#!/usr/bin/env node
/**
 * Le biais d'enveloppe (M1, Dev chef, 19 oct.) mesuré sans jouer : sur chaque départ, le faisceau libre seul, et l'écart
 * demi-coup par demi-coup entre l'enveloppe (max des branches, largeur L) et la ligne gloutonne (largeur 1) :
 *   g[ply] = evals[ply] − glouton[ply]  (≥ 0 par construction)
 * Distribution de g (médiane, 90e centile, max), courbe g × ply, et g × largeur (1, 2, 4) : ce que coûte le choix « largeur 4 ».
 *   node scripts/plans/biais-enveloppe.mjs [--lot 1] [--horizon 12] [--largeurs 1,2,4] [--depth 18] [--seulement id] [--out reports/plans/epreuve/biais-enveloppe.md]
 * Un fil (COACH_DETERMINISTIC=1), STOCKFISH_PATH.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { Noteur, faisceauLibre } from '../../coach/coup-contraint.mjs';
import { REGLAGES_FAISCEAU } from '../../coach/faisceau-plan.mjs';
import { DEPARTS, fenDepart } from './departs.mjs';
import { Chess } from 'chess.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const LOT = Number(opt('--lot', 1)), HORIZON = Number(opt('--horizon', 12)), DEPTH = Number(opt('--depth', 18));
const LARGEURS = opt('--largeurs', '1,2,4').split(',').map(Number), SEUL = opt('--seulement', null);
const OUT = opt('--out', 'reports/plans/epreuve/biais-enveloppe.md');
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ','));
const quantile = (xs, q) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const noteur = new Noteur(engine, { depth: DEPTH });
const lignes = [];
for (const d of DEPARTS.filter((x) => x.lot === LOT)) {
  if (SEUL && d.id !== SEUL) continue;
  const fen = fenDepart(d), side = new Chess(fen).turn();
  for (const L of LARGEURS) {
    const t0 = Date.now();
    const libre = await faisceauLibre(noteur, fen, side, HORIZON, { ...REGLAGES_FAISCEAU, depth: DEPTH, largeur: L });
    const g = libre.evals.map((e, ply) => (ply < libre.glouton.length ? e - libre.glouton[ply] : null)).filter((x) => x != null);
    lignes.push({ depart: d.id, camp: side, largeur: L, g, secondes: Math.round((Date.now() - t0) / 1000) });
    console.error(`${d.id} L${L} : médiane ${fmt(quantile(g, 0.5))} p90 ${fmt(quantile(g, 0.9))} max ${fmt(Math.max(...g))} (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
}
engine.stop();

const md = [`# Biais d'enveloppe du faisceau libre — lot ${LOT}, horizon ${HORIZON} coups, prof. ${DEPTH}, largeurs ${LARGEURS.join('/')}`, '',
  'g[ply] = enveloppe (max des branches à ce demi-coup) − ligne gloutonne, en pions. Les demi-coups pairs sont à mon trait (c\'est là que se lit un prix de segment). À largeur 1 l\'écart n\'est pas nul : le faisceau choisit son coup sur l\'évaluation après la réponse adverse (deux demi-coups de regard), la gloutonne joue le meilleur coup du moteur.', ''];
for (const L of LARGEURS) {
  const tous = lignes.filter((x) => x.largeur === L).flatMap((x) => x.g);
  const pairs = lignes.filter((x) => x.largeur === L).flatMap((x) => x.g.filter((_, i) => i % 2 === 0));
  md.push(`## Largeur ${L}`, '', `Sur tous les (départ × demi-coup) : médiane ${fmt(quantile(tous, 0.5))}, 90e centile ${fmt(quantile(tous, 0.9))}, max ${fmt(Math.max(...tous))} ; aux demi-coups à mon trait : médiane ${fmt(quantile(pairs, 0.5))}, 90e centile ${fmt(quantile(pairs, 0.9))}.`, '');
  md.push('| départ | camp | ' + Array.from({ length: 2 * HORIZON + 1 }, (_, i) => `${i}`).join(' | ') + ' | s |', '|---|---|' + '---|'.repeat(2 * HORIZON + 1) + '---|');
  for (const x of lignes.filter((y) => y.largeur === L)) md.push(`| ${x.depart} | ${x.camp} | ${Array.from({ length: 2 * HORIZON + 1 }, (_, i) => fmt(x.g[i])).join(' | ')} | ${x.secondes} |`);
  md.push('', '### g médian par demi-coup (tous départs)', '', '| ply | ' + Array.from({ length: 2 * HORIZON + 1 }, (_, i) => `${i}`).join(' | ') + ' |', '|---|' + '---|'.repeat(2 * HORIZON + 1));
  md.push(`| g | ${Array.from({ length: 2 * HORIZON + 1 }, (_, i) => fmt(quantile(lignes.filter((y) => y.largeur === L).map((y) => y.g[i]).filter((v) => v != null), 0.5))).join(' | ')} |`, '');
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md.join('\n'));
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(lignes, null, 1));
console.error(`écrit : ${OUT}`);
