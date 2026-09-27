/**
 * Traduction finale (COACH_LANG=en, COACH_ANSWER=translate) : la réponse, raisonnée et vérifiée en
 * anglais, est traduite en français pour l'élève. Les coups restent en notation anglaise pendant la
 * traduction, puis le code les convertit (Nf3 → Cf3) : le LLM ne touche jamais à la notation.
 */

import { complete } from './llm.mjs';
import { frenchDisplay } from './notation.mjs';

export const TRANSLATE_SYSTEM = `You translate a chess coach's answer from English into French for a beginner (use "tu").
Rules:
- Translate faithfully: add nothing, remove nothing, keep the Markdown formatting.
- Keep EVERY chess move exactly as written, in English algebraic notation (Nf3, Rxe8+, bxa1=Q+, O-O, 12...Qd1): never translate or change the piece letters. Square names (e4, d5) stay as they are.
- Section titles: **Evaluation** → **Évaluation**, **The idea** → **L'idée**, **Advised move** → **Coup conseillé**, **Watch out** → **Attention**.
- Standard French chess terms: pin → clouage (pinned → cloué), skewer → enfilade, fork → fourchette, discovered attack → attaque à la découverte, discovered check → échec à la découverte, double check → échec double, in-between move → coup intermédiaire, outpost → avant-poste, weak square / hole → case faible, light/dark-square complex → complexe de cases claires/noires, isolated pawn → pion isolé, isolated queen pawn (IQP) → pion dame isolé, backward pawn → pion arriéré, doubled pawns → pions doublés, passed pawn → pion passé, open file → colonne ouverte, half-open file → colonne semi-ouverte, 7th rank → 7e rangée, back rank → dernière rangée, bishop pair → paire de fous, exchange sacrifice → sacrifice de qualité, hanging / undefended → en prise / non défendu, trapped → piégé, overloaded → surchargé, castle → roquer, kingside / queenside → aile roi / aile dame, White / Black → les Blancs / les Noirs, material → matériel, mate → mat.
- Output only the French text.`;

/**
 * @param {string} english réponse vérifiée, citations déjà retirées
 * @param {ReturnType<typeof import('./llm.mjs').llmConfig>} cfg
 */
export async function translateToFrench(english, cfg) {
  const fr = await complete({ system: TRANSLATE_SYSTEM, user: english }, cfg, { think: false });
  return frenchDisplay(fr);
}
