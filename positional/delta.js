/**
 * Module Delta — comparaison statique de deux FEN.
 * Détecte ce qui a changé entre deux positions (avant/après un coup).
 */

import { buildAllFacts } from './index.js';
import { token } from './tokens.js';

/** Faits « nouveaux » : apparus dans after, absents dans before. */
const DELTA_NEW = /** @type {const} */ ({
  PION_PASSE: 'NOUVEAU_PION_PASSE',
  PION_PASSE_PROTEGE: 'NOUVEAU_PION_PASSE_PROTEGE',
  PION_ISOLE: 'NOUVEAU_PION_ISOLE',
  PION_ARRIERE: 'NOUVEAU_PION_ARRIERE',
  AVANT_POSTE: 'AVANT_POSTE_CREE',
  COLONNE_OUVERTE: 'COLONNE_DEVENUE_OUVERTE',
  COLONNE_SEMI_OUVERTE: 'COLONNE_DEVENUE_SEMI_OUVERTE',
  PIONS_ROI_AFFAIBLI: 'BOUCLIER_AFFAIBLI',
  CAVALIER_AVANT_POSTE: 'NOUVEAU_CAVALIER_AVANT_POSTE',
  TOUR_COLONNE_OUVERTE: 'NOUVELLE_TOUR_COLONNE',
  PION_FAIBLE: 'NOUVEAU_PION_FAIBLE',
  DOUBLON: 'NOUVEAU_DOUBLON',
  PION_ARRIERE_DOUBLE: 'NOUVEAU_ARRIERE_DOUBLE',
  CASE_FAIBLE: 'NOUVELLE_CASE_FAIBLE',
  DAME_SORTIE_TOT: 'DAME_SORTIE_TOT',
});

/** Faits « perdus » : présents dans before, absents dans after. */
const DELTA_LOST = /** @type {const} */ ({
  PION_PASSE: 'PION_PASSE_PERDU',
  PION_PASSE_PROTEGE: 'PION_PASSE_PROTEGE_PERDU',
  BOUCLIER_AFFAIBLI: 'BOUCLIER_AFFAIBLI', // ré-émis tel quel
});

/**
 * @param {string} fenBefore
 * @param {string} fenAfter
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildDeltaFacts(fenBefore, fenAfter) {
  if (!fenBefore || !fenAfter || fenBefore === fenAfter) return [];

  const before = buildAllFacts(fenBefore);
  const after = buildAllFacts(fenAfter);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  const beforeSet = new Set(before.map(factKey));
  const afterSet = new Set(after.map(factKey));

  // Nouveaux faits
  for (const f of after) {
    const key = factKey(f);
    if (beforeSet.has(key)) continue;
    const deltaId = DELTA_NEW[/** @type {keyof typeof DELTA_NEW} */ (f.id)];
    if (deltaId) out.push(token(deltaId, f.params));
  }

  // Faits perdus
  for (const f of before) {
    const key = factKey(f);
    if (afterSet.has(key)) continue;
    const deltaId = DELTA_LOST[/** @type {keyof typeof DELTA_LOST} */ (f.id)];
    if (deltaId) out.push(token(deltaId, f.params));
  }

  // Roque : ROI_AU_CENTRE avant → ROQUE_PETIT ou GRAND après
  const beforeCenter = before.some((f) => f.id === 'ROI_AU_CENTRE' && f.params.color === 'w');
  const afterCenter = after.some((f) => f.id === 'ROI_AU_CENTRE' && f.params.color === 'w');
  const afterPetit = after.some((f) => f.id === 'ROQUE_PETIT' && f.params.color === 'w');
  const afterGrand = after.some((f) => f.id === 'ROQUE_GRAND' && f.params.color === 'w');
  if (beforeCenter && !afterCenter && (afterPetit || afterGrand)) {
    out.push(token('ROQUE_EFFECTUE', { color: 'w' }));
  }
  // Idem pour noirs
  const bCenterBefore = before.some((f) => f.id === 'ROI_AU_CENTRE' && f.params.color === 'b');
  const bCenterAfter = after.some((f) => f.id === 'ROI_AU_CENTRE' && f.params.color === 'b');
  const bAfterPetit = after.some((f) => f.id === 'ROQUE_PETIT' && f.params.color === 'b');
  const bAfterGrand = after.some((f) => f.id === 'ROQUE_GRAND' && f.params.color === 'b');
  if (bCenterBefore && !bCenterAfter && (bAfterPetit || bAfterGrand)) {
    out.push(token('ROQUE_EFFECTUE', { color: 'b' }));
  }

  return out;
}

/** @param {import('./tokens.js').PositionalToken} f */
function factKey(f) {
  return `${f.id}|${JSON.stringify(Object.entries(f.params).sort())}`;
}
