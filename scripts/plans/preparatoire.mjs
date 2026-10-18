/**
 * Test à deux demi-coups, version 2 (cahier des charges du 18 octobre 2026, rapport § 6 et § 9).
 *
 * Pour chaque plan P, M est son meilleur coup non progressant à la racine (lu dans le JSON du tableau). On joue M puis les
 * DEUX meilleures réponses adverses ; après chacune, on prolonge jusqu'à un point calme (prise, échec, ou coup forcé : le
 * meilleur bat le second de plus d'un pion), puis on mesure à nouveau le retard du pas de P sur le meilleur coup.
 * Deux axes, un drapeau, une troisième information :
 *   axe 1, l'effet de M sur P (Δ sur le meilleur pas, pire des deux réponses) : prépare / neutre / nuit / ferme la fenêtre
 *          — « ferme la fenêtre » quand la réponse qui donne le pire Δ ATTAQUE OU CONTRÔLE la case du pas (carte d'attaques
 *          avant/après la réponse, ou le pas devenu illégal) : le plan est périssable ; sinon c'est de la variance ;
 *   axe 2, l'état de P après M et la pire réponse : mûr (la réalisation est viable, retard ≤ 30) / en préparation (un pas
 *          viable existe) / se paie (meilleur pas entre 0,3 et 1,0) / hors de prix (> 1,0) / bloqué / sans objet ;
 *   « limite » quand |Δ| est entre le plancher (25 cp) et la bande (50) ;
 *   « sert un plan frère » : les autres plans listés que M fait progresser.
 * Les fils du moteur viennent de COACH_DETERMINISTIC (un fil pour mesurer). Les sorties A et B de deux moteurs se
 * confrontent avec accord-moteurs.mjs.
 *
 *   node scripts/plans/preparatoire.mjs [--in reports/plans/filtre.json] [--depth 18] [--plancher 25] [--bande 50] [--viable 30]
 *        [--reponses 2] [--seulement id] [--out reports/plans/preparatoire.md]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, estLevier, libelle } from '../../coach/plan-distance.mjs';
import { buildAttackMap, other } from '../../positional/attack-map.js';
import { enPrise } from '../../coach/en-prise.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { POSITIONS } from './positions-filtre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const IN = opt('--in', 'reports/plans/filtre.json');
const DEPTH = Number(opt('--depth', 18));
const PLANCHER = Number(opt('--plancher', 25));
const BANDE = Number(opt('--bande', 50));
const VIABLE = Number(opt('--viable', 30));
const REPONSES = Number(opt('--reponses', 2));
const FORCE = 100; // un coup « forcé » bat le second de plus d'un pion : on le joue avant de mesurer
const OUT = opt('--out', 'reports/plans/preparatoire.md');
const SEUL = opt('--seulement', null);

const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const fmt = (c) => (c == null ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const fr = enToFr;
const uciOf = (m) => m.from + m.to + (m.promotion ?? '');
const jouer = (fen, uci) => { const c = new Chess(fen); const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); return { m, fen: c.fen() }; };

const entrees = JSON.parse(readFileSync(IN, 'utf8')).filter((e) => !SEUL || e.position === SEUL);
const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const cacheNoter = new Map(), cacheRep = new Map();

/** Tous les coups légaux notés (point de vue du camp au trait), triés. */
async function noter(fen) {
  if (cacheNoter.has(fen)) return cacheNoter.get(fen);
  const c = new Chess(fen); const coups = c.moves({ verbose: true });
  if (!coups.length) { const r = { fen, coups: [], best: null }; cacheNoter.set(fen, r); return r; }
  const lignes = await engine.analyze(fen, { depth: DEPTH, multipv: coups.length, timeoutMs: 20 * 60_000 });
  const notes = new Map(); for (const l of lignes) notes.set(l.pv[0], cp(l.score));
  const liste = coups.map((m) => ({ m, cp: notes.get(uciOf(m)) })).filter((x) => x.cp != null).sort((a, b) => b.cp - a.cp);
  const r = { fen, coups: liste, best: liste[0] ?? null }; cacheNoter.set(fen, r); return r;
}
/** Les n meilleures réponses (UCI) dans une position. */
async function reponses(fen, n) {
  const k = `${fen}|${n}`; if (cacheRep.has(k)) return cacheRep.get(k);
  const l = await engine.analyze(fen, { depth: DEPTH, multipv: n, timeoutMs: 10 * 60_000 });
  const r = l.map((x) => x.pv?.[0]).filter(Boolean); cacheRep.set(k, r); return r;
}
/** La position est-elle calme pour le camp au trait ? (pas d'échec, pas de pièce en prise, meilleur coup ni prise ni forcé) */
function calme(fen, mes) {
  const c = new Chess(fen);
  if (c.inCheck() || !mes.best) return !mes.best;
  const force = !mes.coups[1] || mes.best.cp - mes.coups[1].cp > FORCE; // un seul coup légal est forcé par définition
  return !(mes.best.m.captured || force || enPrise(fen, c.turn()));
}
/** Depuis une position à mon trait : prolonger tant que la position n'est pas calme — l'échec se prolonge toujours (parade
 *  forcée), le reste deux fois au plus (chaque prolongation = mon meilleur coup + sa meilleure réponse). Si la position
 *  n'est toujours pas calme à la fin, on le dit (calme: false) plutôt que de mesurer en pleine tactique. */
async function pointCalme(fen) {
  const joues = []; let budget = 2;
  for (let i = 0; i < 6; i++) {
    const mes = await noter(fen);
    if (!mes.best) return { fen, mesure: mes, joues, calme: false };
    if (calme(fen, mes)) return { fen, mesure: mes, joues, calme: true };
    const echec = new Chess(fen).inCheck();
    if (!echec) { if (!budget) return { fen, mesure: mes, joues, calme: false }; budget--; }
    const a = jouer(fen, uciOf(mes.best.m)); joues.push(a.m);
    const [rep] = await reponses(a.fen, 1); if (!rep) { const m2 = await noter(a.fen); return { fen: a.fen, mesure: m2, joues, calme: calme(a.fen, m2) }; }
    const b = jouer(a.fen, rep); joues.push(b.m); fen = b.fen;
  }
  const mes = await noter(fen); return { fen, mesure: mes, joues, calme: false };
}
/** La réponse adverse ferme-t-elle la fenêtre du pas ? Un PION adverse qui prend le contrôle de la case du pas est
 *  irréversible (…h6 contre Fg5) : fenêtre fermée ; une PIÈCE qui vient la viser se chasse ou s'échange : le pas devient
 *  seulement plus cher (« nuit »). Pas devenu illégal après la réponse : fermé aussi. Si M lui-même a déplacé la pièce du
 *  pas ou occupé sa case, ce n'est pas la réponse qui ferme. */
function toucheCase(fenAvant, fenApres, mRep, pas, mM, side) {
  if (!pas) return { ferme: false, pièce: false, raison: '' };
  const to = pas.to, opp = other(side);
  const aNous = (f) => { const p = f.split(' '); p[1] = side; p[3] = '-'; return p.join(' '); };
  let legalAvant = true; try { legalAvant = new Chess(aNous(fenAvant)).moves({ verbose: true }).some((m) => m.from === pas.from && m.to === pas.to); } catch { legalAvant = true; }
  if (!legalAvant) return { ferme: false, pièce: false, raison: mM.to === to ? `${fr(pas.san)} bloqué par M` : `${fr(pas.san)} déplacé par M` };
  const avant = buildAttackMap(fenAvant).attackersOf(to, opp), apres = buildAttackMap(fenApres).attackersOf(to, opp);
  const legal = new Chess(fenApres).moves({ verbose: true }).some((m) => m.from === pas.from && m.to === pas.to);
  if (!legal) return { ferme: true, pièce: false, raison: `${fr(pas.san)} n'est plus légal après ${fr(mRep.san)}` };
  const vise = apres.some((p) => p.square === mRep.to) || apres.length > avant.length;
  if (!vise) return { ferme: false, pièce: false, raison: '' };
  if (mRep.piece === 'p') return { ferme: true, pièce: false, raison: `le pion ${fr(mRep.san)} contrôle ${to} (${avant.length} → ${apres.length} attaquant${apres.length > 1 ? 's' : ''})` };
  return { ferme: false, pièce: true, raison: `${fr(mRep.san)} vise ${to} : plus cher, pas fermé` };
}

const lignes = [];
for (const e of entrees) {
  const pos = POSITIONS.find((p) => p.id === e.position);
  const c = new Chess(); if (pos.fen) c.load(pos.fen); else for (const san of pos.coups.split(/\s+/)) c.move(san);
  const fen = c.fen(), side = c.turn();
  const M = e.nonProgressants[0], bp = e.progressants[0];
  const base = { pos: pos.id, plan: e.libelle, M: M?.san, sert: M?.sert ?? [] };
  if (!M || !bp) { lignes.push({ ...base, axe1: 'sans objet', etat: 'sans objet', note: !M ? 'aucun coup non progressant' : 'aucun coup progressant à la racine' }); continue; }
  const best0 = Math.max(M.cp, bp.cp), retardAvant = best0 - bp.cp;
  const pasRacine = c.moves({ verbose: true }).find((m) => m.san === bp.san);
  console.error(`${pos.id} / ${e.libelle} : ${fr(M.san)} …`);
  const mM = jouer(fen, uciOf(c.moves({ verbose: true }).find((m) => m.san === M.san)));
  // Le pas suit sa pièce : si M a joué la pièce du pas (Fe3 avant Ff4, Fd3 avant Fxc6), le pas part de la nouvelle case.
  const pasSuivi = pasRacine && pasRacine.from === mM.m.from ? { ...pasRacine, from: mM.m.to } : pasRacine;
  const reps = await reponses(mM.fen, REPONSES);
  if (!reps.length) { lignes.push({ ...base, axe1: 'sans objet', etat: 'sans objet', note: 'pas de réponse adverse (partie finie)' }); continue; }
  const essais = [];
  for (const u of reps) {
    const r = jouer(mM.fen, u);
    const tc = toucheCase(mM.fen, r.fen, r.m, pasSuivi, mM.m, side);
    const q = await pointCalme(r.fen);
    let planQ = suivre(suivre(e.plan, mM.m), r.m); for (const m of q.joues) planQ = suivre(planQ, m);
    const suite = [mM.m, r.m, ...q.joues].map((m) => fr(m.san)).join(' ');
    const essai = { reponse: r.m.san, suite, touche: tc.ferme, piece: tc.pièce, raison: tc.raison, prolonge: q.joues.length > 0 };
    if (!q.mesure.best) { essais.push({ ...essai, etat: 'sans objet', delta: null, deltaMeme: null }); continue; }
    if (!q.calme) { essais.push({ ...essai, etat: 'pas de point calme', note: 'ligne tactique, pas de Δ', delta: null, deltaMeme: null }); continue; }
    if (!estLevier(q.fen, side, planQ)) { essais.push({ ...essai, etat: 'sans objet', note: 'plus de pion à attaquer', delta: null, deltaMeme: null }); continue; }
    const d0Q = distance(q.fen, side, planQ);
    const bestQ = q.mesure.best.cp;
    const prog = q.mesure.coups.map((x) => { const a = new Chess(q.fen); a.move(x.m.san); return { ...x, d1: distance(a.fen(), side, suivre(planQ, x.m)).d }; }).filter((x) => x.d1 < d0Q.d);
    const meme = prog.find((x) => pasSuivi ? x.m.from === pasSuivi.from && x.m.to === pasSuivi.to : x.m.san === bp.san); // par cases : le SAN peut devenir ambigu
    const retardMeilleur = prog.length ? bestQ - prog[0].cp : null, retardMeme = meme ? bestQ - meme.cp : null;
    const meilleurRetard = prog.length ? bestQ - prog[0].cp : Infinity;
    const etat = d0Q.d === 0 ? 'mûr (réalisé)' : d0Q.d === Infinity ? 'bloqué' : prog.some((x) => x.d1 === 0 && bestQ - x.cp <= VIABLE) ? 'mûr' : meilleurRetard <= VIABLE ? 'en préparation' : meilleurRetard <= 100 ? 'se paie' : 'hors de prix';
    essais.push({ ...essai, etat, pasApres: prog[0]?.m.san ?? null, retardMeilleur, retardMeme, delta: retardMeilleur == null ? null : retardAvant - retardMeilleur, deltaMeme: retardMeme == null ? null : retardAvant - retardMeme });
  }
  const mesurables = essais.filter((x) => x.delta != null);
  if (!mesurables.length) { lignes.push({ ...base, axe1: 'sans objet', etat: essais[0].etat, note: essais.map((x) => `${fr(x.reponse)} : ${x.note ?? x.etat}`).join(' ; '), essais, retardAvant, pasAvant: bp.san }); continue; }
  const pire = mesurables.reduce((a, b) => (b.delta < a.delta ? b : a));
  const dw = pire.delta;
  const axe1 = dw > PLANCHER ? 'prépare' : dw < -PLANCHER ? (pire.touche ? 'ferme la fenêtre' : 'nuit') : 'neutre';
  const limite = Math.abs(dw) > PLANCHER && Math.abs(dw) <= BANDE;
  lignes.push({ ...base, pasAvant: bp.san, retardAvant, essais, pire: pire.reponse, delta: dw, deltaMeme: pire.deltaMeme, axe1, limite, etat: pire.etat, touche: pire.touche, raison: axe1 === 'ferme la fenêtre' || pire.piece ? pire.raison : '' });
}
engine.stop();

const md = [`# Test à deux demi-coups v2 — ${new Date().toISOString().slice(0, 10)} — prof. ${DEPTH}, plancher ${PLANCHER}, bande ${BANDE}, viable ${VIABLE}, ${REPONSES} réponses`, '',
  'Axe 1 = effet de M sur le plan (Δ du retard du meilleur pas, pire des réponses) ; « ferme la fenêtre » = la pire réponse attaque ou contrôle la case du pas (plan périssable). Axe 2 = état du plan après M et la pire réponse. « limite » = |Δ| entre plancher et bande. « sert » = plans frères que M fait progresser.', '',
  '| position | plan | M | sert | axe 1 | limite | axe 2 | pire réponse (suite) | Δ meilleur pas | Δ même pas | pourquoi |', '|---|---|---|---|---|---|---|---|---|---|---|'];
const ordre = { 'ferme la fenêtre': 0, prépare: 1, nuit: 2, neutre: 3, 'sans objet': 4 };
for (const l of [...lignes].sort((a, b) => (ordre[a.axe1] ?? 9) - (ordre[b.axe1] ?? 9))) {
  const pireE = l.essais?.find((x) => x.reponse === l.pire);
  md.push(`| ${l.pos} | ${l.plan} | ${l.M ? fr(l.M) : '—'} | ${l.sert?.length ? l.sert.join(', ') : '—'} | **${l.axe1}** | ${l.limite ? 'limite' : ''} | ${l.etat ?? '—'} | ${pireE ? `${fr(pireE.reponse)} (${pireE.suite}${pireE.prolonge ? ', point calme' : ''})` : (l.note ?? '—')} | ${fmt(l.delta)} | ${fmt(l.deltaMeme)} | ${l.raison ?? ''} |`);
}
const n = (k, v) => lignes.filter((l) => l[k] === v).length;
md.push('', `Bilan axe 1 : ${n('axe1', 'prépare')} prépare, ${n('axe1', 'neutre')} neutre, ${n('axe1', 'nuit')} nuit, ${n('axe1', 'ferme la fenêtre')} ferme la fenêtre, ${n('axe1', 'sans objet')} sans objet ; ${lignes.filter((l) => l.limite).length} limite(s).`,
  `Bilan axe 2 : ${['mûr', 'mûr (réalisé)', 'en préparation', 'se paie', 'hors de prix', 'bloqué', 'pas de point calme', 'sans objet'].map((v) => `${n('etat', v)} ${v}`).join(', ')}.`, '');
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md.join('\n') + '\n');
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(lignes, null, 1));
console.error(`écrit : ${OUT}`);
