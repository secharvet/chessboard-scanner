/**
 * Banc d'essai du coach : naïf (FEN seule, comme l'ancien projet) vs ancré (Stockfish + règles + structures).
 *
 *   node scripts/coach-eval.mjs                 # toutes les positions, les deux modes
 *   node scripts/coach-eval.mjs --only 3,9      # sous-ensemble (index à partir de 1)
 *   node scripts/coach-eval.mjs --mode grounded # un seul mode
 *
 * Rapport Markdown dans reports/.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { askCoach } from '../coach/coach.mjs';
import { buildCoachContext } from '../coach/context.mjs';
import { loadEnv } from '../coach/env.mjs';
import { EVAL_POSITIONS } from '../coach/eval-positions.mjs';
import { findUngroundedMoves } from '../coach/guard.mjs';
import { complete, llmConfig } from '../coach/llm.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const only = opt('--only')?.split(',').map(Number);
const modes = opt('--mode') ? [opt('--mode')] : ['naive', 'grounded'];
const concurrency = Number(opt('--jobs') ?? 3);
const cfg = llmConfig();
const engine = new UciEngine();

const NAIVE_SYSTEM = `Tu es un coach d'échecs francophone pour joueurs de club. Analyse la position fournie (FEN) et réponds à la question de l'élève : évaluation, plan, coup conseillé, pièges à éviter. Notation française (R, D, T, F, C). 180 mots maximum, Markdown.`;

function prepare(pos) {
  const chess = pos.fen ? new Chess(pos.fen) : new Chess();
  const history = [];
  if (pos.moves) {
    for (const san of pos.moves.split(/\s+/)) {
      chess.move(san);
      history.push(san);
    }
  }
  const fen = chess.fen();
  const side = pos.side ?? (chess.turn() === 'w' ? 'white' : 'black');
  const question = `Quel plan pour les ${side === 'white' ? 'blancs' : 'noirs'} ?`;
  return { fen, side, moves: history, question };
}

async function runNaive(p) {
  // Contexte calculé uniquement pour le garde-fou (le LLM ne le voit pas).
  const ctx = await buildCoachContext({ ...p, engine });
  const user = `Question : ${p.question}\nFEN : ${p.fen}\nCamp de l'élève : ${p.side}\nCoups joués : ${p.moves.join(' ') || '(aucun)'}`;
  const advice = await complete({ system: NAIVE_SYSTEM, user }, cfg);
  return { advice, ungrounded: findUngroundedMoves(advice, ctx.data), context: '' };
}

function score(advice, themes) {
  return themes.map((t) => ({ theme: t, hit: new RegExp(t, 'i').test(advice) }));
}

async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

const selected = EVAL_POSITIONS.map((pos, i) => ({ ...pos, index: i + 1 })).filter(
  (pos) => !only || only.includes(pos.index),
);
const jobs = selected.flatMap((pos) => modes.map((mode) => ({ pos, mode })));

console.log(`${jobs.length} requêtes — ${cfg.provider}/${cfg.model}`);
const results = await pool(jobs, concurrency, async ({ pos, mode }) => {
  const p = prepare(pos);
  const t0 = Date.now();
  try {
    const r = mode === 'naive' ? await runNaive(p) : await askCoach({ ...p, engine, cfg });
    const hits = score(r.advice, pos.themes);
    console.log(
      `#${pos.index} ${mode.padEnd(8)} thèmes ${hits.filter((h) => h.hit).length}/${hits.length}` +
      `  hors contexte ${r.ungrounded.length}  ${((Date.now() - t0) / 1000).toFixed(1)} s  — ${pos.name}`,
    );
    return { pos, mode, p, ...r, hits };
  } catch (e) {
    console.log(`#${pos.index} ${mode} ERREUR ${e.message}`);
    return { pos, mode, p, advice: `ERREUR : ${e.message}`, ungrounded: [], hits: score('', pos.themes), context: '' };
  }
});
engine.stop();

// ── Rapport ──
const summary = modes.map((mode) => {
  const rs = results.filter((r) => r.mode === mode);
  const hit = rs.reduce((a, r) => a + r.hits.filter((h) => h.hit).length, 0);
  const total = rs.reduce((a, r) => a + r.hits.length, 0);
  const ung = rs.reduce((a, r) => a + r.ungrounded.length, 0);
  const clean = rs.filter((r) => r.ungrounded.length === 0).length;
  return { mode, hit, total, ung, clean, n: rs.length };
});

const lines = [`# Évaluation du coach — ${new Date().toISOString()}`, '', `Modèle : ${cfg.provider} / ${cfg.model}`, ''];
lines.push('| Mode | Thèmes trouvés | Coups hors contexte | Réponses sans coup inventé |', '|---|---|---|---|');
for (const s of summary) {
  lines.push(`| ${s.mode} | ${s.hit}/${s.total} (${Math.round((100 * s.hit) / s.total)} %) | ${s.ung} | ${s.clean}/${s.n} |`);
}
for (const pos of selected) {
  lines.push('', `## ${pos.index}. ${pos.name}`, '', `FEN : \`${prepare(pos).fen}\``);
  for (const r of results.filter((x) => x.pos === pos)) {
    const found = r.hits.map((h) => `${h.hit ? '✅' : '❌'} \`${h.theme}\``).join(' ');
    lines.push('', `### ${r.mode}`, '', `Thèmes : ${found}`, `Coups hors contexte : ${r.ungrounded.join(', ') || 'aucun'}`, '', r.advice);
    if (r.context) lines.push('', '<details><summary>Contexte envoyé</summary>', '', '```', r.context, '```', '</details>');
  }
}
mkdirSync('reports', { recursive: true });
const file = `reports/coach-eval-${Date.now()}.md`;
writeFileSync(file, lines.join('\n'));
console.log('\n' + summary.map((s) => `${s.mode}: thèmes ${s.hit}/${s.total}, hors contexte ${s.ung}, propres ${s.clean}/${s.n}`).join('\n'));
console.log(`Rapport : ${file}`);
