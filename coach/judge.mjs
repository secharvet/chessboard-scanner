/**
 * Relecteur : un LLM (idéalement plus fort, et différent du rédacteur) juge la JUSTESSE
 * de l'explication au regard du contexte et des principes échiquéens.
 *
 * Variables : JUDGE_PROVIDER, JUDGE_MODEL, JUDGE_API_KEY (défaut LLM_API_KEY), JUDGE_EFFORT.
 */

import { complete, llmConfig } from './llm.mjs';

const JUDGE_SYSTEM = `Tu es arbitre et entraîneur d'échecs de haut niveau. On te donne une analyse calculée (Stockfish + moteur de règles) et l'explication qu'un coach en a tirée pour un joueur de club.
Ta tâche : repérer les erreurs de FOND dans l'explication.
- affirmation contredite par l'analyse (coup, évaluation, matériel, fait positionnel) ;
- affirmation absente de l'analyse et non évidente ;
- raisonnement contraire aux principes échiquéens établis (ex. attaquer du côté de son propre roi en roques opposés, conseiller d'échanger quand on a le pion isolé, promettre un gain quand l'évaluation est nulle) ;
- recommandation qui ne correspond pas aux lignes du moteur.
Datation des faits : « [Après la ligne N, au bout de « X »] » décrit la position juste après la séquence X (qui peut s'arrêter avant la fin de la ligne affichée), pas après toute la ligne : ne compte pas comme une erreur un fait cité avec cette datation.
Ignore le style, la longueur et les formulations maladroites mais justes.
Réponds UNIQUEMENT en JSON : {"erreurs":[{"phrase":"...","raison":"...","gravite":"grave|mineure"}],"note":0-10,"profondeur":0-10}
La note mesure la justesse globale (10 = rien à redire).
La profondeur mesure, INDÉPENDAMMENT de la justesse, la valeur de coach pour un débutant : donne-t-il un vrai plan concret (quoi faire dans les prochains coups, avec quelles pièces, vers quelles cases ou cibles) et le pourquoi du coup conseillé, ou seulement une paraphrase prudente ? 10 = plan clair, concret et instructif ; 5 = raison du coup sans plan ; 0 = rien d'utile.`;

export function judgeConfig(env = process.env) {
  return llmConfig({
    LLM_PROVIDER: env.JUDGE_PROVIDER || env.LLM_PROVIDER,
    LLM_MODEL: env.JUDGE_MODEL || (env.JUDGE_PROVIDER ? '' : env.LLM_MODEL),
    LLM_API_KEY: env.JUDGE_API_KEY || env.LLM_API_KEY,
    LLM_BASE_URL: env.JUDGE_BASE_URL || '',
    LLM_EFFORT: env.JUDGE_EFFORT || '',
  });
}

/**
 * @param {string} contextText
 * @param {string} answer  explication affichée (sans citations)
 * @param {ReturnType<typeof llmConfig>} [cfg]
 * @returns {Promise<{ erreurs: { phrase: string, raison: string, gravite: string }[], note: number | null, raw?: string }>}
 */
export async function judgeAnswer(contextText, answer, cfg = judgeConfig()) {
  const raw = await complete(
    { system: JUDGE_SYSTEM, user: `# Analyse calculée\n\n${contextText}\n\n# Explication du coach\n\n${answer}` },
    cfg,
  );
  const json = raw.match(/\{[\s\S]*\}/)?.[0];
  try {
    const parsed = JSON.parse(json ?? '');
    return { erreurs: Array.isArray(parsed.erreurs) ? parsed.erreurs : [], note: Number(parsed.note ?? NaN), profondeur: Number(parsed.profondeur ?? NaN) };
  } catch {
    return { erreurs: [], note: null, raw };
  }
}
