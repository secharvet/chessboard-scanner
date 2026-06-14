/**
 * Interpréteur positionnel — classification pondérée + rédaction en français.
 *
 * Hiérarchie :
 *   10 — Critique (matériel, sécurité roi)
 *   8  — Haute (pions passés, faiblesses structure)
 *   6  — Moyenne (avant-postes, colonnes + tours, espace)
 *   4  — Info (développement, structure pions, pièces mineures)
 *   2  — Neutre (confort, roque effectué)
 */

/** @typedef {import('./tokens.js').PositionalToken} PosToken */
/** @typedef {{ weight: number, label: string }} Priority */

/** @type {Record<string, Priority>} */
const PRIORITY = {
  // ── Critique (10) ──
  AVANTAGE_MATERIEL: { weight: 10, label: 'CRITIQUE' },
  EGALITE_MATERIEL:  { weight: 10, label: 'CRITIQUE' },
  ROI_AU_CENTRE:     { weight: 10, label: 'CRITIQUE' },
  PIONS_ROI_AFFAIBLI:{ weight: 10, label: 'CRITIQUE' },

  // ── Haute (8) ──
  PION_PASSE:        { weight: 8, label: 'HAUTE' },
  PION_PASSE_PROTEGE:{ weight: 8, label: 'HAUTE' },
  PION_ISOLE:        { weight: 8, label: 'HAUTE' },
  PION_ARRIERE:      { weight: 8, label: 'HAUTE' },
  PION_FAIBLE:       { weight: 8, label: 'HAUTE' },

  // ── Moyenne (6) ──
  AVANT_POSTE:             { weight: 6, label: 'MOYENNE' },
  CAVALIER_AVANT_POSTE:    { weight: 6, label: 'MOYENNE' },
  COLONNE_OUVERTE:         { weight: 6, label: 'MOYENNE' },
  COLONNE_SEMI_OUVERTE:    { weight: 6, label: 'MOYENNE' },
  TOUR_COLONNE_OUVERTE:    { weight: 6, label: 'MOYENNE' },
  AVANTAGE_ESPACE:         { weight: 6, label: 'MOYENNE' },
  CASE_FAIBLE:             { weight: 6, label: 'MOYENNE' },

  // ── Info (4) ──
  PIECE_NON_DEVELOPPEE: { weight: 4, label: 'INFO' },
  DAME_SORTIE_TOT:      { weight: 4, label: 'INFO' },
  NOMBRE_ILOTS_BLANC:   { weight: 4, label: 'INFO' },
  NOMBRE_ILOTS_NOIR:    { weight: 4, label: 'INFO' },
  MAJORITE_AILE_DAME:   { weight: 4, label: 'INFO' },
  MAJORITE_AILE_ROI:    { weight: 4, label: 'INFO' },
  DOUBLON:              { weight: 4, label: 'INFO' },
  CHAINE_PIONS:         { weight: 4, label: 'INFO' },
  PION_ARRIERE_DOUBLE:  { weight: 4, label: 'INFO' },
  PAIRE_FOUS:           { weight: 4, label: 'INFO' },
  FOU_BON:              { weight: 4, label: 'INFO' },
  FOU_MAUVAIS:          { weight: 4, label: 'INFO' },

  // ── Neutre (2) ──
  ROQUE_PETIT:         { weight: 2, label: 'NEUTRE' },
  ROQUE_GRAND:         { weight: 2, label: 'NEUTRE' },
  PIONS_ROI_BOUCLIER:  { weight: 2, label: 'NEUTRE' },

  // ── Module 6 — Attaques (8) ──
  PIECE_MENACEE: { weight: 8, label: 'HAUTE' },
  CLOUAGE:       { weight: 8, label: 'HAUTE' },
  FOURCHETTE:    { weight: 8, label: 'HAUTE' },
};

// ── Rédaction ──

/** @param {string} c */
function colorLabel(c) {
  return c === 'w' ? 'blancs' : 'noirs';
}

/** @param {string} c */
function colorCap(c) {
  return c === 'w' ? 'Blancs' : 'Noirs';
}

/** @param {PosToken} t */
function renderToken(t) {
  const p = t.params;

  switch (t.id) {
    case 'AVANTAGE_MATERIEL':
      return `Avantage matériel ${colorLabel(/** @type {string} */ (p.color))} (+${p.score}).`;

    case 'EGALITE_MATERIEL':
      return `Matériel égal.`;

    case 'ROI_AU_CENTRE':
      return `Roi ${colorLabel(/** @type {string} */ (p.color))} encore au centre — roquer est prioritaire.`;

    case 'PIONS_ROI_AFFAIBLI':
      return `Bouclier de pions affaibli devant le roi ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PION_PASSE':
      return `Pion passé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_PASSE_PROTEGE':
      return `Pion passé protégé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_ISOLE':
      return `Pion isolé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_ARRIERE':
      return `Pion arrière ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_FAIBLE':
      return `Pion faible (isolé + arrière) ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'AVANT_POSTE':
      return `Avant-poste pour les ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'CAVALIER_AVANT_POSTE':
      return `Cavalier ${colorLabel(/** @type {string} */ (p.color))} sur avant-poste en ${p.square}.`;

    case 'COLONNE_OUVERTE':
      return `Colonne ${p.file} ouverte.`;

    case 'COLONNE_SEMI_OUVERTE':
      return `Colonne ${p.file} semi-ouverte pour les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'TOUR_COLONNE_OUVERTE':
      return `Tour ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} sur colonne ouverte/semi-ouverte.`;

    case 'AVANTAGE_ESPACE':
      return `Avantage d'espace pour les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'CASE_FAIBLE':
      return `Case faible ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PIECE_NON_DEVELOPPEE':
      return `Pièce non développée ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}).`;

    case 'DAME_SORTIE_TOT':
      return `Dame ${colorLabel(/** @type {string} */ (p.color))} sortie trop tôt, pièces mineures encore au départ.`;

    case 'NOMBRE_ILOTS_BLANC':
      return `Ilots blancs : ${p.count}.`;

    case 'NOMBRE_ILOTS_NOIR':
      return `Ilots noirs : ${p.count}.`;

    case 'MAJORITE_AILE_DAME':
      return `Majorité ${colorLabel(/** @type {string} */ (p.color))} à l'aile dame.`;

    case 'MAJORITE_AILE_ROI':
      return `Majorité ${colorLabel(/** @type {string} */ (p.color))} à l'aile roi.`;

    case 'DOUBLON':
      return `Doublon ${colorLabel(/** @type {string} */ (p.color))} en colonne ${p.file}.`;

    case 'CHAINE_PIONS':
      return `Chaîne de pions ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PION_ARRIERE_DOUBLE':
      return `Pions arrière doubles chez les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PAIRE_FOUS':
      return `Paire de fous ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'FOU_BON':
      return `Bon fou ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'FOU_MAUVAIS':
      return `Mauvais fou ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'ROQUE_PETIT':
      return `Petit roque ${colorLabel(/** @type {string} */ (p.color))} effectué.`;

    case 'ROQUE_GRAND':
      return `Grand roque ${colorLabel(/** @type {string} */ (p.color))} effectué.`;

    case 'PIONS_ROI_BOUCLIER':
      return `Bouclier de pions intact devant le roi ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PIECE_MENACEE':
      return `Pièce menacée ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}).`;

    case 'CLOUAGE':
      return `Clouage ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}).`;

    case 'FOURCHETTE':
      return `Fourchette ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}).`;

    default:
      return `${t.id}: ${JSON.stringify(p)}`;
  }
}

// ── API publique ──

/**
 * Interprétation complète — utilisée par l'affichage positionnel.
 * @param {PosToken[]} facts
 * @returns {string}
 */
export function interpretFacts(facts) {
  if (!facts.length) return 'Aucun fait positionnel détecté.';

  // Grouper par poids décroissant
  const groups = new Map();
  for (const f of facts) {
    const prio = PRIORITY[f.id] ?? { weight: 0, label: 'INCONNU' };
    const list = groups.get(prio.weight) || [];
    list.push(f);
    groups.set(prio.weight, list);
  }

  const sortedWeights = [...groups.keys()].sort((a, b) => b - a);
  const lines = [];

  for (const weight of sortedWeights) {
    const group = groups.get(weight) || [];
    const dedup = new Set();
    const uniqueTokens = [];
    for (const f of group) {
      const text = renderToken(f);
      if (!dedup.has(text)) {
        dedup.add(text);
        uniqueTokens.push(f);
      }
    }
    const label = PRIORITY[uniqueTokens[0]?.id]?.label ?? 'INCONNU';
    const prefix = weight >= 8 ? '##' : weight >= 6 ? '###' : '-';
    lines.push(`\n${prefix} ${label}`);
    for (const f of uniqueTokens) {
      lines.push(`  ${renderToken(f)}`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Conseil rapide (3 faits prioritaires) — utilisé par buildConseil.
 * @param {PosToken[]} facts
 * @param {number} [topN=3]
 * @returns {string | null}
 */
export function topAdvice(facts, topN = 3) {
  if (!facts.length) return null;

  const sorted = [...facts].sort(
    (a, b) => (PRIORITY[b.id]?.weight ?? 0) - (PRIORITY[a.id]?.weight ?? 0),
  );

  const seen = new Set();
  const top = [];
  for (const f of sorted) {
    const text = renderToken(f);
    if (!seen.has(text)) {
      seen.add(text);
      top.push(text);
      if (top.length >= topN) break;
    }
  }

  return top.join(' ');
}
