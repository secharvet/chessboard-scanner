/**
 * Pipeline complet : Stockfish + règles → contexte numéroté → LLM → vérification → (réécriture).
 */

import { buildCoachContext } from './context.mjs';
import { findUngroundedMoves } from './guard.mjs';
import { judgeAnswer, judgeConfig } from './judge.mjs';
import { complete, llmConfig } from './llm.mjs';
import { SYSTEM_PROMPT, buildRevisionPrompt, buildUserPrompt } from './prompt.mjs';
import { buildRevisionPromptEn, buildUserPromptEn, systemPromptEn } from './prompt-en.mjs';
import { factLang } from '../positional/lang.js';
import { frenchDisplay } from './notation.mjs';
import { translateToFrench } from './translate.mjs';
import { REPHRASE_SYSTEM, buildBrief, checkRephrase } from './brief.mjs';
import { stripCitations, verifyCitations } from './verify.mjs';

/**
 * @param {{
 *   fen: string, side?: 'white' | 'black', moves?: string[], question?: string,
 *   engine: import('./context.mjs').Engine, cfg?: ReturnType<typeof llmConfig>, depth?: number,
 *   judge?: boolean,
 * }} input
 */
export async function askCoach({ fen, side, moves, question, engine, cfg = llmConfig(), depth, judge, elo = null }) {
  const t0 = Date.now();
  const context = await buildCoachContext({ fen, side, moves, engine, depth, elo });
  const tContext = Date.now() - t0;

  if (context.data.gameOver) {
    return {
      advice: context.text, context: context.text, ungrounded: [], problems: [], revised: false,
      timings: { context: tContext, llm: 0 },
    };
  }

  // Langue de travail du LLM : français (défaut) ou anglais (COACH_LANG=en). En anglais, la réponse
  // est écrite directement en français (COACH_ANSWER=fr) ou en anglais puis traduite (translate).
  const en = factLang() === 'en';
  const answer = process.env.COACH_ANSWER === 'fr' ? 'fr' : 'en';
  const system = en ? systemPromptEn(answer) : SYSTEM_PROMPT;
  const revision = en ? buildRevisionPromptEn : buildRevisionPrompt;
  const user = (en ? buildUserPromptEn : buildUserPrompt)({ question, contextText: context.text });

  // Mode « fiche » (COACH_MODE=brief) : le code décide du contenu (buildBrief), le LLM reformule
  // seulement ; contrôle exact, une nouvelle tentative, sinon on affiche le texte du code.
  if (process.env.COACH_MODE === 'brief') {
    const brief = buildBrief(context.data);
    const ask = (extra = '') => complete({ system: REPHRASE_SYSTEM, user: `Question de l'élève : ${question?.trim() || 'Que dois-je jouer ?'}\n\n# Texte à reformuler\n\n${brief.text}${extra}` }, cfg, { think: false });
    let out = (await ask()).trim();
    let problems = checkRephrase(out, brief, context.data);
    let revised = false;
    if (problems.length) {
      revised = true;
      out = (await ask(`\n\n# Ta première version avait ces problèmes\n${problems.map((x) => `- ${x}`).join('\n')}\nRecommence en respectant strictement le texte.`)).trim();
      problems = checkRephrase(out, brief, context.data);
    }
    const fallback = problems.length > 0;
    return {
      advice: fallback ? brief.text : out, adviceWorking: brief.text, brief: brief.items, context: context.text,
      ungrounded: [], problems: fallback ? [] : problems, rejected: fallback ? problems : [], revised, fallback,
      timings: { context: tContext, llm: Date.now() - t0 - tContext },
    };
  }
  const check = (raw) => {
    const clean = stripCitations(raw);
    const ungrounded = findUngroundedMoves(clean, context.data);
    const { problems, cited, sentences } = verifyCitations(raw, context.data.facts);
    const all = [...problems, ...ungrounded.map((m) => `Coup ${m} absent des lignes fournies et illégal dans la position.`)];
    return { raw, clean, ungrounded, problems: all, cited, sentences };
  };

  let result = check(await complete({ system, user }, cfg));
  let revised = false;
  if (result.problems.length) {
    // Une seule réécriture : on renvoie au LLM la liste précise des affirmations mal sourcées.
    const retry = check(await complete({
      system,
      user: `${user}\n\n${en ? '# Your first answer' : '# Ta première réponse'}\n\n${result.raw}\n\n${revision(result.problems)}`,
    }, cfg));
    revised = true;
    if (retry.problems.length <= result.problems.length) result = retry;
  }
  // Affichage : toujours en français, coups en notation française.
  const shown = !en ? result.clean : answer === 'fr' ? frenchDisplay(result.clean) : await translateToFrench(result.clean, cfg);
  const tLlm = Date.now() - t0 - tContext;

  const verdict = judge ? await judgeAnswer(context.text, shown, judgeConfig()) : null;

  return {
    advice: shown,
    adviceWorking: en ? result.clean : undefined,
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
