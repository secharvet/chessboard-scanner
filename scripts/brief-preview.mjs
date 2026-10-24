import { Chess } from 'chess.js';
import { buildCoachContext } from '../coach/context.mjs';
import { buildBrief } from '../coach/brief.mjs';
import { EVAL_POSITIONS } from '../coach/eval-positions.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
const engine = new UciEngine({ threads: 2 });
for (const [i, pos] of EVAL_POSITIONS.entries()) {
  const c = pos.fen ? new Chess(pos.fen) : new Chess(); const moves = [];
  if (pos.moves) for (const s of pos.moves.split(/\s+/)) { c.move(s); moves.push(s); }
  const fen = c.fen(); const side = pos.side ?? (c.turn() === 'w' ? 'white' : 'black');
  const ctx = await buildCoachContext({ fen, side, moves, engine });
  const b = buildBrief(ctx.data);
  console.log(`#${i + 1} ${pos.name}\n  ${b.text}\n`);
}
engine.stop();
