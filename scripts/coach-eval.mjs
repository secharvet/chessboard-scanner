/**
 * Banc d'essai du coach : naïf (FEN seule, comme l'ancien projet) vs ancré (Stockfish + règles + structures).
 *
 *   node scripts/coach-eval.mjs                 # toutes les positions, les deux modes
 *   node scripts/coach-eval.mjs --only 3,9      # sous-ensemble (index à partir de 1)
 *   node scripts/coach-eval.mjs --mode grounded # un seul mode
 *   node scripts/coach-eval.mjs --judge         # + note de justesse par le relecteur (JUDGE_*)
 *
 * Rapport Markdown dans reports/.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { askCoach } from '../coach/coach.mjs';
import { stopSecondEngine } from '../coach/context.mjs';
import { buildCoachContext } from '../coach/context.mjs';
import { loadEnv } from '../coach/env.mjs';
// --positions <module> : un autre banc (coach/eval-positions-milieux.mjs, tiré des étiquettes humaines).
const POSITIONS_MODULE = process.argv.includes('--positions') ? process.argv[process.argv.indexOf('--positions') + 1] : '../coach/eval-positions.mjs';
const { EVAL_POSITIONS } = await import(POSITIONS_MODULE.startsWith('.') || POSITIONS_MODULE.startsWith('/') ? POSITIONS_MODULE : `../${POSITIONS_MODULE}`);
import { findUngroundedMoves } from '../coach/guard.mjs';
import { judgeAnswer, judgeConfig } from '../coach/judge.mjs';
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
const useJudge = args.includes('--judge');
const jcfg = judgeConfig();
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
  return { advice, ungrounded: findUngroundedMoves(advice, ctx.data), context: ctx.text, problems: [], hideContext: true };
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
    const r = mode === 'naive' ? await runNaive(p) : await askCoach({ elo: pos.elo ?? null, ...p, engine, cfg });
    const hits = score(r.advice, pos.themes);
    const verdict = useJudge ? await judgeAnswer(r.context, r.advice, jcfg).catch((e) => ({ erreurs: [], note: null, raw: e.message })) : null;
    const graves = verdict?.erreurs.filter((e) => e.gravite === 'grave').length ?? 0;
    console.log(
      `#${pos.index} ${mode.padEnd(8)} thèmes ${hits.filter((h) => h.hit).length}/${hits.length}` +
      `  hors contexte ${r.ungrounded.length}  citations KO ${r.problems?.length ?? 0}${r.revised ? ' (réécrit)' : ''}` +
      (verdict ? `  note ${verdict.note ?? '?'}/10, profondeur ${verdict.profondeur ?? '?'}/10, graves ${graves}` : '') +
      `  ${((Date.now() - t0) / 1000).toFixed(1)} s  — ${pos.name}`,
    );
    return { pos, mode, p, ...r, hits, verdict };
  } catch (e) {
    console.log(`#${pos.index} ${mode} ERREUR ${e.message}`);
    return { pos, mode, p, advice: `ERREUR : ${e.message}`, ungrounded: [], problems: [], hits: score('', pos.themes), context: '', verdict: null };
  }
});
engine.stop();
stopSecondEngine(); // le second moteur (règle des deux moteurs) gardait le processus en vie après le rapport


// ── Rapport ──
const summary = modes.map((mode) => {
  const rs = results.filter((r) => r.mode === mode);
  const hit = rs.reduce((a, r) => a + r.hits.filter((h) => h.hit).length, 0);
  const total = rs.reduce((a, r) => a + r.hits.length, 0);
  const ung = rs.reduce((a, r) => a + r.ungrounded.length, 0);
  const clean = rs.filter((r) => r.ungrounded.length === 0).length;
  const notes = rs.map((r) => r.verdict?.note).filter((x) => Number.isFinite(x));
  const avg = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) : '—';
  const deps = rs.map((r) => r.verdict?.profondeur).filter((x) => Number.isFinite(x));
  const depth = deps.length ? (deps.reduce((a, b) => a + b, 0) / deps.length).toFixed(1) : '—';
  const graves = rs.reduce((a, r) => a + (r.verdict?.erreurs.filter((e) => e.gravite === 'grave').length ?? 0), 0);
  const citeKo = rs.reduce((a, r) => a + (r.problems?.length ?? 0), 0);
  return { mode, hit, total, ung, clean, n: rs.length, avg, depth, graves, citeKo };
});

const lines = [`# Évaluation du coach — ${new Date().toISOString()}`, '', `Modèle : ${cfg.provider} / ${cfg.model}${cfg.effort ? ` (effort ${cfg.effort})` : ''}`];
if (useJudge) lines.push(`Relecteur : ${jcfg.provider} / ${jcfg.model}${jcfg.effort ? ` (effort ${jcfg.effort})` : ''}`);
lines.push('', '| Mode | Thèmes trouvés | Coups hors contexte | Réponses sans coup inventé | Citations KO restantes | Note relecteur | Profondeur | Erreurs graves |', '|---|---|---|---|---|---|---|---|');
for (const s of summary) {
  lines.push(`| ${s.mode} | ${s.hit}/${s.total} (${Math.round((100 * s.hit) / s.total)} %) | ${s.ung} | ${s.clean}/${s.n} | ${s.citeKo} | ${s.avg} | ${s.depth} | ${s.graves} |`);
}
for (const pos of selected) {
  lines.push('', `## ${pos.index}. ${pos.name}`, '', `FEN : \`${prepare(pos).fen}\``);
  for (const r of results.filter((x) => x.pos === pos)) {
    const found = r.hits.map((h) => `${h.hit ? '✅' : '❌'} \`${h.theme}\``).join(' ');
    lines.push('', `### ${r.mode}`, '', `Thèmes : ${found}`, `Coups hors contexte : ${r.ungrounded.join(', ') || 'aucun'}`);
    if (r.problems?.length) lines.push('', 'Citations KO :', ...r.problems.map((x) => `- ${x}`));
    if (r.verdict) {
      lines.push('', `Relecteur : ${r.verdict.note ?? '?'}/10 (profondeur ${r.verdict.profondeur ?? '?'}/10)`);
      for (const e of r.verdict.erreurs) lines.push(`- **${e.gravite}** — « ${e.phrase} » : ${e.raison}`);
    }
    lines.push('', r.advice);
    // Mode anglais : on garde la réponse d'origine (avant traduction / conversion des coups).
    if (r.adviceWorking) lines.push('', "<details><summary>Réponse d'origine du LLM (avant traduction)</summary>", '', r.adviceWorking, '', '</details>');
    if (r.context && !r.hideContext) lines.push('', '<details><summary>Contexte envoyé</summary>', '', '```', r.context, '```', '</details>');
  }
}
mkdirSync('reports', { recursive: true });
const file = `reports/coach-eval-${Date.now()}.md`;
writeFileSync(file, lines.join('\n'));
console.log('\n' + summary.map((s) => `${s.mode}: thèmes ${s.hit}/${s.total}, hors contexte ${s.ung}, propres ${s.clean}/${s.n}, citations KO ${s.citeKo}, note ${s.avg}/10, erreurs graves ${s.graves}`).join('\n'));
console.log(`Rapport : ${file}`);
