/**
 * Le faisceau : le prix et le tempo d'un plan, en l'imposant au moteur sur quinze coups (docs/plans/FAISCEAU-CRITERE-2026-10-18.md).
 *
 * À chaque coup à nous : les N meilleurs coups du moteur (MultiPV), classés par la distance du plan —
 *   progressant (la distance baisse ; remet le compteur à zéro), forcé (situation à parer : prise à jouer, échec, pièce en
 *   prise au mini-échange, ou le meilleur bat le second de plus d'un pion ; neutre), roque (neutre), intendance (compte 1).
 * Un coup progressant qui vaut plus d'un pion de moins que le meilleur coup est une CONCESSION : refusé. Une branche dont le
 * compteur dépasse k est coupée. L'adversaire joue librement (son meilleur coup). Largeur L : on garde les L branches les
 * mieux évaluées à chaque coup complet. Horizon H coups. La ligne libre (le moteur joue les deux camps) donne la référence :
 *   prix = éval libre − éval contrainte au même demi-coup (notre point de vue ; positif = suivre le plan coûte),
 *   tempo = le demi-coup où la distance tombe à 0.
 * Phrases : c'est le plan (réalisé, prix ≤ plancher) / viable mais ça coûte (réalisé, prix > plancher) / pas réalisable sans
 * concession (toutes les branches coupées faute de progressant admissible) / jamais urgent ici (toutes coupées par le
 * compteur) / en cours à l'horizon (vivant mais pas réalisé). Par coup : la classe et le plan frère servi.
 * Un fil pour mesurer (COACH_DETERMINISTIC=1).
 *
 *   node scripts/plans/faisceau.mjs [--depth 18] [--candidats 4] [--largeur 4] [--horizon 15] [--k 2] [--plancher 25]
 *        [--seulement id] [--out reports/plans/faisceau/faisceau.md]
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, verrouiller, estLevier, libelle } from '../../coach/plan-distance.mjs';
import { enPrise } from '../../coach/en-prise.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { POSITIONS } from './positions-filtre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEPTH = Number(opt('--depth', 18)), CANDIDATS = Number(opt('--candidats', 4)), LARGEUR = Number(opt('--largeur', 4));
const HORIZON = Number(opt('--horizon', 15)), K = Number(opt('--k', 2)), PLANCHER = Number(opt('--plancher', 25)), BANDE = 2 * PLANCHER;
const CONCESSION = 100, FORCE = 100;
const SEUL = opt('--seulement', null);
const OUT = opt('--out', 'reports/plans/faisceau/faisceau.md');

const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const fr = enToFr;
const uciOf = (m) => m.from + m.to + (m.promotion ?? '');
const jouer = (fen, uci) => { const c = new Chess(fen); const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); return { m, fen: c.fen() }; };

const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const cache = new Map();
/** Les n meilleurs coups (point de vue du camp au trait) : [{ uci, m, cp }], triés. */
async function noter(fen, n) {
  const k = `${fen}|${n}`; if (cache.has(k)) return cache.get(k);
  const c = new Chess(fen); if (c.isGameOver()) { cache.set(k, []); return []; }
  const lignes = await engine.analyze(fen, { depth: DEPTH, multipv: n, timeoutMs: 10 * 60_000 });
  const out = lignes.filter((l) => l.pv?.[0]).map((l) => ({ uci: l.pv[0], m: new Chess(fen).move({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), promotion: l.pv[0][4] }), cp: cp(l.score) })).sort((a, b) => b.cp - a.cp);
  cache.set(k, out); return out;
}
/** La ligne libre : le moteur joue les deux camps ; eval[ply] du point de vue de `side`, sans[ply] les coups. */
async function ligneLibre(fen, side, plies) {
  const evals = [], sans = []; let f = fen;
  for (let p = 0; p <= plies; p++) {
    const [best] = await noter(f, 1);
    if (!best) { evals.push(evals[evals.length - 1] ?? 0); break; }
    evals.push(new Chess(f).turn() === side ? best.cp : -best.cp);
    if (p === plies) break;
    const j = jouer(f, best.uci); sans.push(j.m.san); f = j.fen;
  }
  return { evals, sans };
}
const estRoque = (m) => m.piece === 'k' && Math.abs(m.from.charCodeAt(0) - m.to.charCodeAt(0)) === 2;

async function faisceau(pos, fen, side, plan, autres, libre) {
  const d0 = distance(fen, side, plan).d;
  let etats = [{ fen, plan, compteur: 0, ligne: [], ply: 0, cp: libre.evals[0], d: d0 }];
  const realises = [], coupes = [];
  for (let coup = 0; coup < HORIZON && etats.length; coup++) {
    const suivants = [];
    for (const e of etats) {
      const cands = await noter(e.fen, CANDIDATS);
      if (!cands.length) { coupes.push({ ...e, raison: 'partie finie' }); continue; }
      const c = new Chess(e.fen);
      const situationForcee = c.inCheck() || cands[0].m.captured || enPrise(e.fen, side) || (cands[1] && cands[0].cp - cands[1].cp > FORCE) || cands.length === 1;
      let progressantsRefuses = 0, admis = 0;
      for (const cand of cands) {
        const apres = new Chess(e.fen); apres.move(cand.m.san);
        const planApres = suivre(e.plan, cand.m);
        const d1 = distance(apres.fen(), side, planApres).d;
        const progressant = d1 < e.d;
        let classe, compteur = e.compteur;
        if (progressant) {
          if (cands[0].cp - cand.cp > CONCESSION) { progressantsRefuses++; continue; }
          classe = 'progressant'; compteur = 0;
        } else if (situationForcee && cand === cands[0]) classe = 'forcé';
        else if (estRoque(cand.m)) classe = 'roque';
        else if (situationForcee) continue; // en situation forcée, seuls le meilleur coup et les progressants sont admis
        else { classe = 'intendance'; compteur++; if (compteur > K) continue; }
        if (!progressant && cands[0].cp - cand.cp > CONCESSION) continue; // un coup qui perd un pion sans servir le plan n'est pas une branche
        admis++;
        const sert = autres.filter((a) => distance(apres.fen(), side, suivre(a.plan, cand.m)).d < distance(e.fen, side, a.plan).d).map((a) => a.libelle.replace(/^\S+ /, ''));
        // réponse adverse libre
        const [rep] = await noter(apres.fen(), 1);
        let fenSuite = apres.fen(), planSuite = planApres, cpSuite = cand.cp, ply = e.ply + 1, repSan = null;
        if (rep) { const j = jouer(apres.fen(), rep.uci); fenSuite = j.fen; planSuite = suivre(planApres, j.m); cpSuite = -rep.cp; ply = e.ply + 2; repSan = j.m.san; }
        const dSuite = distance(fenSuite, side, planSuite).d;
        const etat = { fen: fenSuite, plan: dSuite === 0 ? verrouiller(planSuite, fenSuite, side) : planSuite, compteur, ply, cp: cpSuite, d: dSuite, ligne: [...e.ligne, { san: cand.m.san, classe, sert, rep: repSan, cp: cpSuite, d: dSuite }] };
        if (d1 === 0 || dSuite === 0) { etat.tempo = d1 === 0 ? e.ply + 1 : ply; realises.push(etat); continue; }
        if (!rep) { coupes.push({ ...etat, raison: 'partie finie' }); continue; }
        if (!estLevier(fenSuite, side, planSuite)) { coupes.push({ ...etat, raison: 'cible disparue' }); continue; }
        suivants.push(etat);
      }
      if (!admis) coupes.push({ ...e, raison: progressantsRefuses ? 'concession' : 'compteur' });
    }
    // largeur : les L meilleures branches, une par position
    const vues = new Set();
    etats = suivants.sort((a, b) => b.cp - a.cp).filter((s) => !vues.has(s.fen) && vues.add(s.fen)).slice(0, LARGEUR);
  }
  const vivants = etats;
  const prixDe = (s) => (libre.evals[Math.min(s.ply, libre.evals.length - 1)] ?? 0) - s.cp;
  let phrase, retenu = null, prix = null, tempo = null;
  if (realises.length) {
    retenu = realises.reduce((a, b) => (prixDe(b) < prixDe(a) || (prixDe(b) === prixDe(a) && b.tempo < a.tempo) ? b : a));
    prix = prixDe(retenu); tempo = retenu.tempo;
    phrase = prix <= PLANCHER ? "c'est le plan" : 'viable mais ça coûte';
  } else if (vivants.length) {
    retenu = vivants[0]; prix = prixDe(retenu); phrase = "en cours à l'horizon";
  } else {
    const n = (r) => coupes.filter((x) => x.raison === r).length;
    phrase = n('concession') >= n('compteur') && n('concession') > 0 ? 'pas réalisable sans concession' : n('compteur') > 0 ? 'jamais urgent ici' : 'sans objet';
    retenu = coupes.reduce((a, b) => (b.ply > a.ply ? b : a), coupes[0] ?? null);
  }
  const limite = (prix != null && prix > PLANCHER && prix <= BANDE) || (tempo != null && tempo >= 2 * HORIZON - 2);
  return { libelle: libelle(plan, fen), d0, phrase, prix, tempo, limite, ligne: retenu?.ligne ?? [], realises: realises.length, vivants: vivants.length, coupes: { concession: coupes.filter((x) => x.raison === 'concession').length, compteur: coupes.filter((x) => x.raison === 'compteur').length, autres: coupes.filter((x) => !['concession', 'compteur'].includes(x.raison)).length } };
}

function rendre(resultats, positions) {
  const md = [`# Faisceau — ${new Date().toISOString().slice(0, 10)} — prof. ${DEPTH}, ${CANDIDATS} candidats, largeur ${LARGEUR}, horizon ${HORIZON} coups, k = ${K}, plancher ${PLANCHER}`, '',
    'Prix = éval de la ligne libre − éval de la ligne contrainte au même demi-coup (positif = suivre le plan coûte). Tempo = demi-coup de la réalisation. Ligne : nos coups avec leur classe (P progressant, F forcé, R roque, I intendance) et le plan frère servi entre crochets ; la réponse adverse suit.', ''];
  for (const pos of positions) {
    const rs = resultats.filter((r) => r.position === pos.id); if (!rs.length) continue;
    md.push(`## ${pos.nom}`, '', `Ligne libre : ${rs[0].libreSans.map((s) => fr(s)).join(' ')} …`, '', '| plan | canon. | long | phrase | prix | tempo | limite | branches (réalisées · vivantes · coupées concession / compteur / autres) | ligne retenue | s |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const r of [...rs].sort((a, b) => (a.tempo == null) - (b.tempo == null) || (a.prix ?? 1e9) - (b.prix ?? 1e9))) {
      const ligne = r.ligne.map((x) => `${fr(x.san)}<sub>${{ progressant: 'P', forcé: 'F', roque: 'R', intendance: 'I' }[x.classe]}${x.sert?.length ? `[${x.sert.join(',')}]` : ''}</sub>${x.rep ? ' ' + fr(x.rep) : ''}`).join(' ');
      md.push(`| ${r.libelle} | ${r.canonique ? '●' : ''} | ${r.long ? 'long' : ''} | **${r.phrase}** | ${fmt(r.prix)} | ${r.tempo ?? '∞'} | ${r.limite ? 'limite' : ''} | ${r.realises} · ${r.vivants} · ${r.coupes.concession} / ${r.coupes.compteur} / ${r.coupes.autres} | ${ligne} | ${r.secondes} |`);
    }
    md.push('');
  }
  // Critère : classement sur les plans RÉALISÉS (un plan en cours à l'horizon n'a qu'un prix d'étape, il ne gagne pas par défaut)
  const elig = positions.filter((p) => resultats.some((r) => r.position === p.id) && p.plans.some((_, i) => !(p.canoniques ?? []).includes(i)));
  let ok = 0; const detail = [];
  for (const p of elig) {
    const rs = resultats.filter((r) => r.position === p.id && r.tempo != null && r.prix != null).sort((a, b) => a.prix - b.prix || a.tempo - b.tempo);
    if (!rs.length) { detail.push(`- ${p.id} : aucun plan réalisé dans l'horizon`); continue; }
    const [a, b] = rs; const ecart = b ? b.prix - a.prix : Infinity;
    const reussi = a.canonique && ecart > PLANCHER; if (reussi) ok++;
    detail.push(`- ${p.id} : le moins cher des réalisés est **${a.libelle}** (${fmt(a.prix)}, tempo ${a.tempo}${a.canonique ? ', canonique' : ', NON canonique'}), écart au second ${fmt(ecart)} → ${reussi ? 'réussi' : a.canonique ? 'canonique mais dans la bande' : 'contredit le livre (à trancher à prof. 30)'}`);
  }
  const longs = resultats.filter((r) => r.long), longsRealises = longs.filter((r) => r.tempo != null && r.prix != null);
  md.push('## Critère', '', `Positions éligibles : ${elig.length} ; réussies : **${ok}** (${elig.length ? Math.round((100 * ok) / elig.length) : 0} %). Plans longs : ${longs.length}, réalisés dans l'horizon à prix fini : **${longsRealises.length}** (${longs.length ? Math.round((100 * longsRealises.length) / longs.length) : 0} %).`, '', ...detail, '');
  return md.join('\n') + '\n';
}

mkdirSync(dirname(OUT), { recursive: true });
const FUSION = opt('--fusion', null);
if (FUSION) {
  const { readdirSync, readFileSync } = await import('node:fs');
  const resultats = readdirSync(FUSION).filter((f) => /^faisceau-.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${FUSION}/${f}`, 'utf8')));
  writeFileSync(OUT, rendre(resultats, POSITIONS)); writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(resultats, null, 1));
  console.error(`fusion : ${resultats.length} plans → ${OUT}`); process.exit(0);
}

const resultats = [];
for (const pos of POSITIONS) {
  if (SEUL && pos.id !== SEUL) continue;
  const c = new Chess(); if (pos.fen) c.load(pos.fen); else for (const san of pos.coups.split(/\s+/)) c.move(san);
  const fen = c.fen(), side = c.turn();
  console.error(`${pos.id} : ligne libre…`);
  const libre = await ligneLibre(fen, side, 2 * HORIZON);
  const tous = pos.plans.map((p, i) => ({ plan: p, libelle: libelle(p, fen), canonique: (pos.canoniques ?? []).includes(i) }));
  for (const [i, t] of tous.entries()) {
    console.error(`  ${t.libelle} …`); const t0 = Date.now();
    const r = await faisceau(pos, fen, side, t.plan, tous.filter((x) => x !== t), libre);
    resultats.push({ position: pos.id, index: i, canonique: t.canonique, long: t.plan.famille === 'et' || r.d0 >= 2, ...r, libreSans: libre.sans.slice(0, 10), secondes: Math.round((Date.now() - t0) / 1000) });
    console.error(`    ${r.phrase} prix ${fmt(r.prix)} tempo ${r.tempo ?? '∞'} (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
}
engine.stop();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, rendre(resultats, POSITIONS));
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(resultats, null, 1));
console.error(`écrit : ${OUT}`);
