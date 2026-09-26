/**
 * Pipeline complet : Stockfish + règles → contexte → LLM → garde-fou.
 */

import { buildCoachContext } from './context.mjs';
import { findUngroundedMoves } from './guard.mjs';
import { complete, llmConfig } from './llm.mjs';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt.mjs';

/**
 * @param {{
 *   fen: string, side?: 'white' | 'black', moves?: string[], question?: string,
 *   engine: import('./context.mjs').Engine, cfg?: ReturnType<typeof llmConfig>, depth?: number,
 * }} input
 */
export async function askCoach({ fen, side, moves, question, engine, cfg = llmConfig(), depth }) {
  const t0 = Date.now();
  const context = await buildCoachContext({ fen, side, moves, engine, depth });
  const tContext = Date.now() - t0;

  if (context.data.gameOver) {
    return { advice: context.text, context: context.text, ungrounded: [], timings: { context: tContext, llm: 0 } };
  }

  const advice = await complete(
    { system: SYSTEM_PROMPT, user: buildUserPrompt({ question, contextText: context.text }) },
    cfg,
  );
  const ungrounded = findUngroundedMoves(advice, context.data);

  return {
    advice,
    context: context.text,
    ungrounded,
    timings: { context: tContext, llm: Date.now() - t0 - tContext },
  };
}
