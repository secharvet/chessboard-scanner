/**
 * Diagnostic après coup d'une partie du joueur LLM (PGN + journal reports/partie-*.log).
 *   node scripts/diagnose-game.mjs reports/partie-XXXX.pgn [--color white] [--learn]
 *   --learn : analyse d'après-partie, une leçon par erreur dans le carnet (memory/lessons.json)
 */

import { existsSync, readFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { diagnoseMistake } from '../coach/diagnose.mjs';
import { toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { loadEnv } from '../coach/env.mjs';
import { llmConfig } from '../coach/llm.mjs';
import { learnFromMistake } from '../coach/review.mjs';

loadEnv();
const learn = process.argv.includes('--learn');

const pgnPath = process.argv[2];
const color = process.argv.includes('--color') && process.argv[process.argv.indexOf('--color') + 1] === 'black' ? 'b' : 'w';
const logPath = pgnPath.replace(/\.pgn$/, '.log');
const journal = existsSync(logPath) ? readFileSync(logPath, 'utf8') : '';

const src = new Chess();
src.loadPgn(readFileSync(pgnPath, 'utf8'));
const moves = src.history();
const engine = new UciEngine({ threads: 2 });
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const evalFor = async (fen) => { const [l] = await engine.analyze(fen, { depth: 14, multipv: 1 }); return l ? toCp(l.score) : 0; };

const board = new Chess();
const counts = {};
for (const san of moves) {
  const fen = board.fen();
  const mine = board.turn() === color;
  board.move(san);
  if (!mine) continue;
  const loss = Math.max(0, (await evalFor(fen)) + (await evalFor(board.fen())));
  if (loss < 100) continue;
  const fr = toFrenchSan(san);
  const n = Math.ceil(board.history().length / 2);
  const entry = journal.split('\n').find((l) => l.startsWith(`${n}. ${fr} `)) ?? '';
  const alerted = journal.includes(`⚑ alerte sur ${fr}`) && journal.indexOf(`⚑ alerte sur ${fr}`) > journal.indexOf(entry);
  const raison = entry.split('— raison : ')[1] ?? '';
  const plan = (entry.split('— plan : ')[1] ?? '').split(' — raison')[0];
  const d = await diagnoseMistake(engine, fen, board.fen(), { san, plan, raison, alerted });
  counts[d.cause] = (counts[d.cause] ?? 0) + 1;
  console.log(`${n}. ${fr} (−${loss} cp) : ${d.text}`);
  if (learn) {
    const r = await learnFromMistake({ fenBefore: fen, san, fenAfter: board.fen(), plan, raison, refutationUci: d.refutationUci, cause: d.cause, loss }, llmConfig());
    console.log(`   📓 leçon ${r.action} : ${r.lesson.titre} — ${r.lesson.lecon} (signal : ${r.lesson.signal})`);
  }
}
engine.stop();
console.log('\nBilan :', JSON.stringify(counts));
