/**
 * Avant / après : repasse les positions d'une partie commentée dans le coach ACTUEL et met les deux
 * réponses côte à côte (même position, même question) — pour juger une correction sur des cas réels.
 *
 *   node scripts/coach-replay.mjs reports/partie-commentee-XXXX.json [--from 1] [--to 12]
 *
 * Rapport : reports/avant-apres-<date>.md
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { askCoach } from '../coach/coach.mjs';
import { loadEnv } from '../coach/env.mjs';
import { llmConfig } from '../coach/llm.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? Number(args[args.indexOf(k) + 1]) : d);
const src = JSON.parse(readFileSync(args[0], 'utf8'));
const from = opt('--from', 1);
const to = opt('--to', 999);
const cfg = llmConfig();
const engine = new UciEngine({ threads: 2 });

const lines = [`# Avant / après — ${args[0]}`, '', `Coach actuel : ${cfg.provider}/${cfg.model}`, ''];
for (const t of src.turns.filter((x) => x.n >= from && x.n <= to)) {
  const side = t.fen.split(' ')[1] === 'w' ? 'white' : 'black';
  const r = await askCoach({ fen: t.fen, side, question: 'Quel est le plan ? Que dois-je jouer ?', engine, cfg });
  console.error(`coup ${t.n} : ${r.problems.length} problème(s)`);
  lines.push(`## Coup ${t.n}`, '', `FEN : \`${t.fen}\``, '', '### Avant', '', t.advice, '', '### Après', '', r.advice,
    '', `Vérification : ${r.problems.length ? r.problems.map((p) => `⚠ ${p}`).join(' ; ') : '✓'}`, '');
}
engine.stop();
mkdirSync('reports', { recursive: true });
const out = `reports/avant-apres-${Date.now()}.md`;
writeFileSync(out, lines.join('\n'));
console.error(`Rapport : ${out}`);
