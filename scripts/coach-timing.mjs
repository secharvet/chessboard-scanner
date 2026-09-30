/**
 * Chronomètre la fiche du coach étape par étape (data.timings de coach/context.mjs) sur les positions du banc,
 * et enregistre le texte de chaque fiche pour comparer avant/après une optimisation (le texte ne doit pas changer).
 *
 *   COACH_MODE=brief COACH_REPHRASE=0 node scripts/coach-timing.mjs [--n 36] [--out reports/timing-<tag>.json]
 */
import { writeFileSync } from 'node:fs';
import { loadEnv } from '../coach/env.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { askCoach } from '../coach/coach.mjs';
import { stopSecondEngine } from '../coach/context.mjs';
import { EVAL_POSITIONS } from '../coach/eval-positions-milieux.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const N = Number(opt('--n', EVAL_POSITIONS.length));
const OUT = opt('--out', `reports/timing-${Date.now()}.json`);
const engine = new UciEngine();
const rows = [];
const totals = {};
for (const p of EVAL_POSITIONS.slice(0, N)) {
  const t0 = Date.now();
  const r = await askCoach({ fen: p.fen, side: p.side, moves: [], question: '', engine, elo: p.elo });
  const ms = Date.now() - t0;
  const steps = r.timings?.steps ?? [];
  for (const [label, d] of steps) totals[label] = (totals[label] ?? 0) + d;
  rows.push({ name: p.name, fen: p.fen, ms, steps, advice: r.advice });
  console.log(`${String(ms).padStart(6)} ms  ${p.name}  ${steps.map(([l, d]) => `${l} ${d}`).join(' | ')}`);
}
stopSecondEngine();
engine.stop();
const total = rows.reduce((a, r) => a + r.ms, 0);
console.log(`\n${rows.length} fiches, moyenne ${(total / rows.length).toFixed(0)} ms`);
for (const [l, d] of Object.entries(totals)) console.log(`  ${l.padEnd(24)} ${(d / rows.length).toFixed(0)} ms en moyenne (${(100 * d / total).toFixed(0)} %)`);
writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), rows }, null, 1));
console.log(`écrit : ${OUT}`);
console.log('TERMINÉ');
