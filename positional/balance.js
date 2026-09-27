/**
 * Bilan des déséquilibres : chaque fait devient un atout ou une faiblesse d'un camp.
 * C'est la « feuille de bilan » à la Silman que le coach reçoit.
 */

import { renderToken, tokenWeight } from './interpreter.js';

/** Faits dont `params.color` désigne le camp qui en PROFITE. */
const ASSETS = new Set([
  'AVANTAGE_MATERIEL', 'PION_PASSE', 'PION_PASSE_PROTEGE', 'AVANT_POSTE', 'CAVALIER_AVANT_POSTE',
  'COLONNE_SEMI_OUVERTE', 'TOUR_COLONNE_OUVERTE', 'AVANTAGE_ESPACE', 'MAJORITE_AILE_DAME',
  'MAJORITE_AILE_ROI', 'PAIRE_FOUS', 'FOU_BON', 'FOURCHETTE', 'ENFILADE', 'DECOUVERTE_POSSIBLE',
  'CONTROLE_COLONNE', 'CASE_ENTREE', 'TOUR_7E', 'ACTIVITE', 'CONTROLE_CENTRE', 'DEVELOPPEMENT',
]);

/** Faits dont `params.color` désigne le camp qui en SOUFFRE. */
const WEAKNESSES = new Set([
  'ROI_AU_CENTRE', 'PIONS_ROI_AFFAIBLI', 'PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'CASE_FAIBLE',
  'PIECE_NON_DEVELOPPEE', 'DAME_SORTIE_TOT', 'DOUBLON', 'PION_ARRIERE_DOUBLE', 'FOU_MAUVAIS',
  'PIECE_MENACEE', 'CLOUAGE', 'CLOUAGE_RELATIF', 'SURCHARGE', 'PIECE_PIEGEE', 'RANGEE_FAIBLE',
  'COMPLEXE_FAIBLE', 'PIECE_PASSIVE',
]);

/** Faits de contexte (concernent la position entière). */
const CONTEXT = new Set(['COLONNE_OUVERTE', 'CENTRE', 'FOU_CONTRE_CAVALIER', 'ROQUES_OPPOSES', 'STRUCTURE']);

/** Faits trop fins pour un bilan (redondants avec d'autres). */
const SKIP = new Set([
  'PHASE', 'EGALITE_MATERIEL', 'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR', 'PIONS_ROI_BOUCLIER',
  'ROQUE_PETIT', 'ROQUE_GRAND', 'CHAINE_PIONS',
]);

/** Faits de colonnes : sans objet s'il n'y a plus ni tour ni dame (finales de pièces mineures ou de pions). */
const FILE_FACTS = new Set(['COLONNE_OUVERTE', 'COLONNE_SEMI_OUVERTE', 'TOUR_COLONNE_OUVERTE', 'CONTROLE_COLONNE', 'CASE_ENTREE', 'TOUR_7E']);

/**
 * @param {import('./tokens.js').PositionalToken[]} facts
 * @returns {{ w: { assets: string[], weaknesses: string[] }, b: { assets: string[], weaknesses: string[] }, context: string[] }}
 */
export function buildBalance(facts, { heavyPieces = true } = {}) {
  const sorted = [...facts].sort((a, b) => tokenWeight(b) - tokenWeight(a));
  const res = { w: { assets: [], weaknesses: [] }, b: { assets: [], weaknesses: [] }, context: [] };
  const push = (list, t) => {
    const text = renderToken(t);
    if (!list.includes(text)) list.push(text);
  };

  for (const t of sorted) {
    if (SKIP.has(t.id)) continue;
    if (!heavyPieces && FILE_FACTS.has(t.id)) continue;
    const c = /** @type {'w'|'b'} */ (t.params.color);
    if (CONTEXT.has(t.id) || !c) push(res.context, t);
    else if (ASSETS.has(t.id)) push(res[c].assets, t);
    else if (WEAKNESSES.has(t.id)) push(res[c].weaknesses, t);
    else push(res.context, t);
  }
  return res;
}
