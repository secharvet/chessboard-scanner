/**
 * Structures de pions classiques et plans associés (connaissance échiquéenne établie).
 *
 * C'est ce qui permet de parler de stratégie : un plan dépend d'abord de la structure.
 * Les rangées sont exprimées du point de vue du camp (rangée 2 = rangée de départ des pions).
 */

import { parseFenPawns, parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

/**
 * @typedef {{ label: string, owner: string, opponent: string }} StructurePlans
 * owner = plans du camp qui « possède » la structure, opponent = plans de l'adversaire.
 */

/** @type {Record<string, StructurePlans>} */
export const STRUCTURES = {
  PDI: {
    label: 'pion dame isolé (PDI)',
    owner:
      "Le PDI donne de l'espace et de l'activité : jouer en milieu de partie, garder les pièces. " +
      'Occuper e5 (et c5) avec un cavalier, viser le roque adverse (dame + fou sur la diagonale b1-h7, levée de tour), ' +
      'préparer la poussée d4-d5 pour libérer le jeu. Éviter les échanges qui mènent à une finale.',
    opponent:
      'Bloquer le pion isolé sur la case devant lui (d5) avec une pièce, idéalement un cavalier. ' +
      'Échanger les pièces, surtout les pièces actives de l’adversaire : en finale, le pion isolé devient une faiblesse durable. ' +
      'Mettre la pression sur le pion (tours sur la colonne d).',
  },
  PIONS_PENDANTS: {
    label: 'pions pendants (c + d côte à côte, sans voisins)',
    owner:
      "Les pions pendants contrôlent le centre et soutiennent une poussée (d5 ou c5) qui ouvre le jeu au bon moment. " +
      'Les garder côte à côte, pièces actives derrière eux ; pousser seulement si cela crée une menace concrète.',
    opponent:
      "Les attaquer de face et de côté (tours sur les colonnes c et d, fous) pour forcer l'un d'eux à avancer, " +
      "puis bloquer la case devant le pion arriéré qui reste. Échanger les pièces pour rendre les pions faibles.",
  },
  CARLSBAD: {
    label: 'structure Carlsbad (Gambit Dame refusé, variante d’échange)',
    owner:
      "Attaque de minorité : pousser les pions b4-b5 pour échanger sur c6 et laisser à l’adversaire un pion c faible. " +
      'Colonne c semi-ouverte pour les tours ; le cavalier peut viser c5 ou e5.',
    opponent:
      'Jeu à l’aile roi : cavalier en e4, poussée f5, parfois attaque avec les pions g et h. ' +
      "Répondre à l'attaque de minorité en gardant c6 solide ou en jouant ...b5 au bon moment.",
  },
  CHAINE_E5: {
    label: 'chaîne de pions d4-e5 contre d5-e6 (type Française avance)',
    owner:
      "La chaîne pointe vers l'aile roi : c'est là qu'il faut attaquer (f4-f5, pièces vers le roque). " +
      'Soutenir la base d4 contre ...c5 et le pion e5 contre ...f6.',
    opponent:
      "Attaquer la base de la chaîne : ...c5 contre d4, pression sur d4 (Cc6, Db6), puis ...f6 contre e5. " +
      'Le fou de cases blanches est gêné par ses propres pions : chercher à l’échanger ou à l’activer (...b6, ...Fa6).',
  },
  CHAINE_D5: {
    label: 'chaîne de pions d5-e4 contre d6-e5 (type Est-indienne)',
    owner:
      "La chaîne pointe vers l'aile dame : y gagner de l’espace et ouvrir des colonnes (c4-c5, b4). " +
      'Surveiller la poussée adverse ...f5 à l’aile roi.',
    opponent:
      "Attaque à l'aile roi : ...f5, puis ...f4, ...g5, pièces vers le roque. C’est une course : chaque temps compte.",
  },
  MAROCZY: {
    label: 'étau de Maroczy (c4 + e4 contre d6)',
    owner:
      "Les pions c4 et e4 bloquent les poussées libératrices ...b5 et ...d5 : garder l'étau, jouer lentement, " +
      'gagner de l’espace et profiter du manque de place adverse.',
    opponent:
      "Jeu compact et patient ; échanger des pièces pour gagner de la place, préparer ...b5, ...d5 ou ...f5 pour casser l'étau.",
  },
  PETIT_CENTRE_SICILIEN: {
    label: 'structure sicilienne (d6 + e6 contre e4, colonne c semi-ouverte)',
    owner:
      "Contre-jeu sur la colonne c semi-ouverte et à l’aile dame (...b5), poussée libératrice ...d5 au bon moment. " +
      'Le centre compact d6-e6 est solide mais passif.',
    opponent:
      "Avantage d'espace : attaquer à l'aile roi (f4, g4-g5) ou préparer e5/f5 pour ouvrir. " +
      'Surveiller la poussée ...d5 et la case d6 si le pion avance.',
  },
};

/** Pions d'un camp indexés par colonne, rangée relative (2 = départ). */
function pawnMap(pawns, color) {
  /** @type {Record<string, number[]>} */
  const map = {};
  for (const p of pawns) {
    if (p.color !== color) continue;
    const rel = color === 'w' ? p.rank : 9 - p.rank;
    (map[p.file] ??= []).push(rel);
  }
  return {
    has: (file, rel) => (rel == null ? Boolean(map[file]?.length) : Boolean(map[file]?.includes(rel))),
    none: (...files) => files.every((f) => !map[f]?.length),
  };
}

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildStructureFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  const { pieces } = parseFenPieces(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const me = pawnMap(pawns, color);
    const op = pawnMap(pawns, color === 'w' ? 'b' : 'w');
    const add = (name) => out.push(token('STRUCTURE', { name, color }));

    if (me.has('d') && me.none('c', 'e') && op.none('d')) add('PDI');

    if (me.has('c', 4) && me.has('d', 4) && me.none('b', 'e') && op.none('c', 'd')) add('PIONS_PENDANTS');

    // Carlsbad : moi d4 sans pion c ; adversaire c6 + d5 sans pion e.
    if (me.has('d', 4) && me.none('c') && op.has('c', 3) && op.has('d', 4) && op.none('e')) add('CARLSBAD');

    if (me.has('d', 4) && me.has('e', 5) && op.has('d', 4) && op.has('e', 3)) add('CHAINE_E5');

    if (me.has('d', 5) && me.has('e', 4) && op.has('d', 3) && op.has('e', 4)) add('CHAINE_D5');

    if (me.has('c', 4) && me.has('e', 4) && me.none('d') && op.has('d', 3) && op.none('c')) add('MAROCZY');

    if (me.has('d', 3) && me.has('e', 3) && me.none('c') && op.has('e', 4) && op.none('d') && !op.has('c', 4)) {
      add('PETIT_CENTRE_SICILIEN');
    }
  }

  // Roques opposés : course aux attaques de pions.
  const wk = pieces.find((p) => p.type === 'k' && p.color === 'w');
  const bk = pieces.find((p) => p.type === 'k' && p.color === 'b');
  const queens = pieces.filter((p) => p.type === 'q').length;
  if (wk && bk && queens > 0 && wk.rank <= 2 && bk.rank >= 7) {
    const wing = (k) => (k.fileIdx >= 5 ? 'roi' : k.fileIdx <= 2 ? 'dame' : null);
    const ww = wing(wk);
    const bw = wing(bk);
    if (ww && bw && ww !== bw) out.push(token('ROQUES_OPPOSES', {}));
  }

  return out;
}

export const OPPOSITE_CASTLING_PLAN =
  "Roques opposés : c'est une course. Chaque camp lance ses pions vers le roi adverse pour ouvrir des colonnes ; " +
  "la vitesse compte plus que le matériel. Ne pas pousser les pions devant son propre roi.";
