/**
 * Test à deux demi-coups (proposé par l'Expert échecs, 18 octobre 2026) : un coup non progressant M est-il PRÉPARATOIRE
 * pour le plan P, ou une simple PRÉFÉRENCE du moteur ? Après M et la meilleure réponse adverse, on mesure à nouveau le
 * retard du meilleur pas de P sur le meilleur coup de la position : s'il a nettement baissé, M préparait P (Dd3 avant Ce5,
 * Tae1 avant e4) ; s'il est inchangé, le moteur avait juste un autre coup utile (h3) ; s'il a monté, M nuit au plan.
 * Une parade à une menace passe le même test. Le « nettement » est un plancher de bruit, provisoire ici (--plancher),
 * à remplacer par la variance 18/24 du test de stabilité.
 * Deux précautions apprises à la première passe : (1) la mesure se fait à un POINT CALME — si après M et la réponse le
 * meilleur coup est une prise ou une parade d'échec (reprise, pièce attaquée), on joue ce coup et la meilleure réponse
 * avant de mesurer, sinon le test accuse M de ce que la réponse adverse a créé ; (2) Δ est donné sur le MÊME pas du plan
 * (celui de la racine) et sur le meilleur pas, car quand le meilleur pas change d'identité, Δ mesure autre chose.
 *
 * Entrée : le JSON du tableau du filtre (un M par plan : son meilleur coup non progressant).
 *   node scripts/plans/preparatoire.mjs [--in reports/plans/filtre.json] [--depth 18] [--plancher 15] [--out reports/plans/preparatoire.md]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, estLevier } from '../../coach/plan-distance.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { POSITIONS } from './positions-filtre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const IN = opt('--in', 'reports/plans/filtre.json');
const DEPTH = Number(opt('--depth', 18));
const PLANCHER = Number(opt('--plancher', 15));
const OUT = opt('--out', 'reports/plans/preparatoire.md');
const SEUL = opt('--seulement', null);

const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const fmt = (c) => (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+'));
const fr = enToFr;
const uciOf = (m) => m.from + m.to + (m.promotion ?? '');

const entrees = JSON.parse(readFileSync(IN, 'utf8')).filter((e) => !SEUL || e.position === SEUL);
const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const cache = new Map(); // `${pos}|${M}` -> mesure au point calme

/** Tous les coups légaux notés (point de vue du camp au trait), et le meilleur. */
async function noter(fen) {
  const c = new Chess(fen); const coups = c.moves({ verbose: true });
  const lignes = await engine.analyze(fen, { depth: DEPTH, multipv: coups.length, timeoutMs: 20 * 60_000 });
  const notes = new Map(); for (const l of lignes) notes.set(l.pv[0], cp(l.score));
  const liste = coups.map((m) => ({ m, cp: notes.get(uciOf(m)) })).filter((x) => x.cp != null).sort((a, b) => b.cp - a.cp);
  return { fen, coups: liste, best: liste[0] };
}

/** M, la meilleure réponse, puis (si le meilleur coup est une prise ou une parade d'échec) ce coup et la réponse : point calme. */
async function pointCalme(pos, fen, M) {
  const key = `${pos.id}|${M}`;
  if (cache.has(key)) return cache.get(key);
  const c = new Chess(fen); const joues = [c.move(M)];
  const repondre = async () => {
    const [rep] = await engine.analyze(c.fen(), { depth: DEPTH, multipv: 1, timeoutMs: 10 * 60_000 });
    if (!rep) return false;
    const u = rep.pv[0]; joues.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); return true;
  };
  if (!(await repondre())) { cache.set(key, null); return null; }
  let mesure = await noter(c.fen()); let prolonge = [];
  if (mesure.best && (mesure.best.m.captured || c.inCheck())) {
    joues.push(c.move(mesure.best.m.san)); prolonge.push(mesure.best.m.san);
    if (await repondre()) { prolonge.push(joues[joues.length - 1].san); mesure = await noter(c.fen()); }
  }
  const r = { joues, prolonge, mesure };
  cache.set(key, r); return r;
}

const lignes = [];
for (const e of entrees) {
  const pos = POSITIONS.find((p) => p.id === e.position);
  const c = new Chess(); if (pos.fen) c.load(pos.fen); else for (const san of pos.coups.split(/\s+/)) c.move(san);
  const fen = c.fen(), side = c.turn();
  const M = e.nonProgressants[0], bp = e.progressants[0];
  if (!M || !bp) { lignes.push({ pos: pos.id, plan: e.libelle, M: M?.san, statut: 'sans objet', note: !M ? 'aucun coup non progressant' : 'aucun coup progressant à la racine' }); continue; }
  const best0 = Math.max(M.cp, bp.cp); const retardAvant = best0 - bp.cp;
  console.error(`${pos.id} / ${e.libelle} : ${fr(M.san)} …`);
  const q = await pointCalme(pos, fen, M.san);
  if (!q) { lignes.push({ pos: pos.id, plan: e.libelle, M: M.san, statut: 'sans objet', note: 'pas de réponse adverse (partie finie)' }); continue; }
  const suite = q.joues.map((m) => fr(m.san)).join(' ');
  let planQ = e.plan; for (const m of q.joues) planQ = suivre(planQ, m);
  const fenQ = q.mesure.fen;
  if (!estLevier(fenQ, side, planQ)) { lignes.push({ pos: pos.id, plan: e.libelle, M: M.san, suite, prolonge: q.prolonge, retardAvant, statut: 'cible disparue', note: `après ${suite} la rupture n'a plus de pion à attaquer` }); continue; }
  const d0Q = distance(fenQ, side, planQ);
  const bestQ = q.mesure.best.cp;
  const prog = q.mesure.coups.filter((x) => { const a = new Chess(fenQ); a.move(x.m.san); return distance(a.fen(), side, suivre(planQ, x.m)).d < d0Q.d; });
  if (d0Q.d === 0) { lignes.push({ pos: pos.id, plan: e.libelle, M: M.san, suite, prolonge: q.prolonge, retardAvant, statut: 'réalisé', note: `le plan est réalisé après ${suite}` }); continue; }
  if (!prog.length) { lignes.push({ pos: pos.id, plan: e.libelle, M: M.san, suite, prolonge: q.prolonge, retardAvant, statut: d0Q.d === Infinity ? 'bloqué' : 'sans pas', note: `après ${suite} : ${d0Q.detail}` }); continue; }
  const retardApres = bestQ - prog[0].cp;
  const memePas = prog.find((x) => x.m.san === bp.san);
  const retardMeme = memePas ? bestQ - memePas.cp : null;
  const delta = retardAvant - retardApres;
  const deltaMeme = retardMeme == null ? null : retardAvant - retardMeme;
  const ref = deltaMeme ?? delta;
  const statut = ref > PLANCHER ? 'préparatoire' : ref < -PLANCHER ? 'nuit au plan' : 'préférence';
  lignes.push({ pos: pos.id, plan: e.libelle, M: M.san, suite, prolonge: q.prolonge, pasAvant: bp.san, retardAvant, pasApres: prog[0].m.san, retardApres, delta, retardMeme, deltaMeme, statut });
}
engine.stop();

const md = [`# Test à deux demi-coups — préparatoire ou préférence ? (prof. ${DEPTH}, plancher ${PLANCHER} cp) — ${new Date().toISOString().slice(0, 10)}`, '',
  'Pour chaque plan, M est son meilleur coup non progressant à la racine. On joue M, la meilleure réponse adverse — et, si le meilleur coup est alors une prise ou une parade d\'échec, ce coup et la réponse (point calme, colonne « suite ») — puis on mesure à nouveau le retard du pas du plan sur le meilleur coup de la position. Δ = retard avant − retard après, sur le MÊME pas qu\'à la racine (le statut en découle) et sur le meilleur pas : Δ > plancher, M préparait le plan ; |Δ| ≤ plancher, préférence du moteur ; Δ < −plancher, M nuit au plan.', '',
  '| Δ même pas | Δ meilleur pas | statut | position | plan | M | suite | pas de la racine (retard avant → après) | meilleur pas après (retard) |', '|---|---|---|---|---|---|---|---|---|'];
const tri = [...lignes].sort((a, b) => ((b.deltaMeme ?? b.delta) ?? -1e9) - ((a.deltaMeme ?? a.delta) ?? -1e9));
for (const l of tri) {
  if (l.delta == null) { md.push(`| — | — | ${l.statut} | ${l.pos} | ${l.plan} | ${l.M ? fr(l.M) : '—'} | ${l.suite ?? '—'} | ${l.note} | |`); continue; }
  const calme = l.prolonge?.length ? ' *(point calme)*' : '';
  md.push(`| ${l.deltaMeme == null ? '— (pas disparu)' : fmt(l.deltaMeme)} | ${fmt(l.delta)} | **${l.statut}** | ${l.pos} | ${l.plan} | ${fr(l.M)} | ${l.suite}${calme} | ${fr(l.pasAvant)} (${fmt(l.retardAvant)} → ${l.retardMeme == null ? 'n/a' : fmt(l.retardMeme)}) | ${fr(l.pasApres)} (${fmt(l.retardApres)}) |`);
}
const n = (s) => lignes.filter((l) => l.statut === s).length;
md.push('', `Bilan : ${n('préparatoire')} préparatoire(s), ${n('préférence')} préférence(s), ${n('nuit au plan')} qui nuisent au plan, ${n('cible disparue')} cible(s) disparue(s), ${lignes.length - n('préparatoire') - n('préférence') - n('nuit au plan') - n('cible disparue')} sans objet / réalisé / bloqué ; ${lignes.filter((l) => l.prolonge?.length).length} mesure(s) prolongée(s) jusqu'au point calme.`, '');
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md.join('\n') + '\n');
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(lignes, null, 1));
console.error(`écrit : ${OUT}`);
