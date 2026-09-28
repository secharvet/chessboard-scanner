/**
 * Vérification des exemples positifs (docs/PLANS-ET-CONCEPTS.md) — deux filtres après l'étiquetage :
 *
 *  1. SUITE CALME : un plan se construit par des coups calmes. Jusqu'à l'apparition du concept :
 *     matériel inchangé (échanges équilibrés permis, pas de sacrifice ni de gain), et le coup qui fait
 *     apparaître le concept n'est ni un roque (tour posée en f1 par O-O) ni la prise d'une pièce.
 *  2. STABILITÉ : le concept doit réapparaître (calmement) dans une recherche PLUS PROFONDE (18 au lieu
 *     de 16). Une recherche identique serait inutile : à un fil et table de hachage vidée (ce que fait
 *     UciEngine avant chaque analyse), Stockfish est déterministe. Un vrai plan survit à plus de calcul.
 *     La seconde suite est prolongée comme la première (coach/extend-line.mjs) si celle-ci l'a été.
 *
 *   node scripts/verify-labels.mjs data/labels/2013-01.jsonl [--out data/labels/2013-01-verifie.jsonl]
 *        [--workers 1] [--max 2000]
 *
 * Sortie : une ligne par exemple positif vérifié ou rejeté, avec la raison ; résumé par concept.
 */

import { appendFileSync, readFileSync } from 'node:fs';
import { quietReason, scanLine } from '../coach/plan-concepts.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { extendPv } from '../coach/extend-line.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = opt('--out', args[0].replace(/\.jsonl$/, '-verifie.jsonl'));
const MAX = Number(opt('--max', 2000));
const WORKERS = Number(opt('--workers', 1));
const DEPTH2 = Number(opt('--depth2', 18));
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir'];

/** Positif brut : dans la meilleure suite, pas dans les suites qui valent au moins 0,3 pion de moins. */
const positive = (r, k) => r.lines[0][k] >= 0
  && r.lines.slice(1).some((_, i) => r.evals[0] - r.evals[i + 1] >= 30)
  && !r.lines.slice(1).some((l, i) => r.evals[0] - r.evals[i + 1] >= 30 && l[k] >= 0);

// Étiquettes RECALCULÉES depuis les suites enregistrées, avec la définition actuelle des concepts
// (coach/plan-concepts.mjs) : une définition corrigée s'applique sans relancer Stockfish.
const records = readFileSync(args[0], 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.pvs)
  .map((r) => ({ ...r, lines: r.pvs.map((pv) => scanLine(r.fen, pv)) }));
const todo = [];
for (const r of records) for (const c of CONCEPTS) for (const side of ['w', 'b']) if (positive(r, `${c}_${side}`)) todo.push({ r, c, side });
console.error(`${records.length} positions avec suites, ${todo.length} positifs bruts — vérification de ${Math.min(MAX, todo.length)}`);

const stats = {};
const bump = (c, k) => { stats[c] ??= {}; stats[c][k] = (stats[c][k] ?? 0) + 1; };
const engines = Array.from({ length: WORKERS }, () => new UciEngine({ threads: 1 }));
let next = 0;
await Promise.all(engines.map(async (engine) => {
  while (next < Math.min(MAX, todo.length)) {
    const { r, c, side } = todo[next++];
    const k = `${c}_${side}`;
    const ply = r.lines[0][k];
    let reason = quietReason(r.fen, r.pvs[0], ply, c);
    let ply2 = null;
    if (!reason) {
      const [l] = await engine.analyze(r.fen, { depth: DEPTH2, multipv: 1 });
      const pv2 = l && r.ext ? await extendPv(engine, r.fen, l.pv, { plies: r.ext }) : l?.pv;
      ply2 = pv2 ? scanLine(r.fen, pv2)[k] : -1;
      if (ply2 < 0) reason = 'instable (absent de la recherche plus profonde)';
      else if (quietReason(r.fen, pv2, ply2, c)) reason = 'instable (seconde suite non calme)';
    }
    bump(c, reason ?? 'vérifié');
    appendFileSync(OUT, `${JSON.stringify({ fen: r.fen, game: r.game, ply: r.ply, elo: r.elo, concept: c, side, appear: ply, appear2: ply2, ok: !reason, reason })}\n`);
  }
}));
for (const e of engines) e.stop();
for (const [c, s] of Object.entries(stats)) {
  const total = Object.values(s).reduce((a, b) => a + b, 0);
  console.log(`${c.padEnd(22)} vérifiés ${String(s['vérifié'] ?? 0).padStart(4)}/${total}  —  ${Object.entries(s).filter(([k]) => k !== 'vérifié').map(([k, v]) => `${k} : ${v}`).join(' ; ')}`);
}
