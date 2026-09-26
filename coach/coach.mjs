/**
 * Pipeline complet : Stockfish + règles → contexte numéroté → LLM → vérification → (réécriture).
 */

import { buildCoachContext } from './context.mjs';
import { findUngroundedMoves } from './guard.mjs';
import { judgeAnswer, judgeConfig } from './judge.mjs';
import { complete, llmConfig } from './llm.mjs';
import { SYSTEM_PROMPT, buildRevisionPrompt, buildUserPrompt } from './prompt.mjs';
import { stripCitations, verifyCitations } from './verify.mjs';

/**
 * @param {{
 *   fen: string, side?: 'white' | 'black', moves?: string[], question?: string,
 *   engine: import('./context.mjs').Engine, cfg?: ReturnType<typeof llmConfig>, depth?: number,
 *   judge?: boolean,
 * }} input
 */
export async function askCoach({ fen, side, moves, question, engine, cfg = llmConfig(), depth, judge }) {
  const t0 = Date.now();
  const context = await buildCoachContext({ fen, side, moves, engine, depth });
  const tContext = Date.now() - t0;

  if (context.data.gameOver) {
    return {
      advice: context.text, context: context.text, ungrounded: [], problems: [], revised: false,
      timings: { context: tContext, llm: 0 },
    };
  }

  const user = buildUserPrompt({ question, contextText: context.text });
  const check = (raw) => {
    const clean = stripCitations(raw);
    const ungrounded = findUngroundedMoves(clean, context.data);
    const { problems, cited, sentences } = verifyCitations(raw, context.data.facts);
    const all = [...problems, ...ungrounded.map((m) => `Coup ${m} absent des lignes fournies et illégal dans la position.`)];
    return { raw, clean, ungrounded, problems: all, cited, sentences };
  };

  let result = check(await complete({ system: SYSTEM_PROMPT, user }, cfg));
  let revised = false;
  if (result.problems.length) {
    // Une seule réécriture : on renvoie au LLM la liste précise des affirmations mal sourcées.
    const retry = check(await complete({
      system: SYSTEM_PROMPT,
      user: `${user}\n\n# Ta première réponse\n\n${result.raw}\n\n${buildRevisionPrompt(result.problems)}`,
    }, cfg));
    revised = true;
    if (retry.problems.length <= result.problems.length) result = retry;
  }
  const tLlm = Date.now() - t0 - tContext;

  const verdict = judge ? await judgeAnswer(context.text, result.clean, judgeConfig()) : null;

  return {
    advice: result.clean,
    adviceCited: result.raw,
    context: context.text,
    ungrounded: result.ungrounded,
    problems: result.problems,
    citedSentences: result.cited,
    sentences: result.sentences,
    revised,
    judge: verdict,
    timings: { context: tContext, llm: tLlm, judge: verdict ? Date.now() - t0 - tContext - tLlm : 0 },
  };
}
