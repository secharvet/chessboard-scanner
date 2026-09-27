/**
 * Structures de pions classiques et plans associés (connaissance échiquéenne établie).
 *
 * C'est ce qui permet de parler de stratégie : un plan dépend d'abord de la structure.
 * Les rangées sont exprimées du point de vue du camp (rangée 2 = rangée de départ des pions).
 */

import { parseFenPawns, parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';
import { tr } from './lang.js';

/**
 * @typedef {{ label: string, owner: string, opponent: string }} StructurePlans
 * owner = plans du camp qui « possède » la structure, opponent = plans de l'adversaire.
 */

/** @type {Record<string, StructurePlans>} */
export const STRUCTURES = {
  PDI: {
    get label() {
      return tr('pion dame isolé (PDI)', "isolated queen pawn (IQP)");
    },
    get owner() {
      return tr(
        "Le PDI donne de l'espace et de l'activité : jouer en milieu de partie, garder les pièces. " +
          'Occuper e5 (et c5) avec un cavalier, viser le roque adverse (dame + fou sur la diagonale b1-h7, levée de tour), ' +
          'préparer la poussée d4-d5 pour libérer le jeu. Éviter les échanges qui mènent à une finale.',
        "The IQP gives space and activity: play for the middlegame and keep pieces on the board. Occupy e5 (and c5) with a knight, aim at the enemy king (queen + bishop on the b1-h7 diagonal, rook lift), prepare the d4-d5 break to free the game. Avoid exchanges that lead to an endgame.",
      );
    },
    get opponent() {
      return tr(
        'Bloquer le pion isolé sur la case devant lui (d5) avec une pièce, idéalement un cavalier. ' +
          'Échanger les pièces, surtout les pièces actives de l’adversaire : en finale, le pion isolé devient une faiblesse durable. ' +
          'Mettre la pression sur le pion (tours sur la colonne d).',
        "Blockade the isolated pawn on the square in front of it (d5) with a piece, ideally a knight. Trade pieces, especially the opponent's active pieces: in the endgame the isolated pawn becomes a lasting weakness. Pile up pressure on the pawn (rooks on the d-file).",
      );
    },
  },
  PIONS_PENDANTS: {
    get label() {
      return tr('pions pendants (c + d côte à côte, sans voisins)', "hanging pawns (c + d side by side, with no neighbors)");
    },
    get owner() {
      return tr(
        "Les pions pendants contrôlent le centre et soutiennent une poussée (d5 ou c5) qui ouvre le jeu au bon moment. " +
          'Les garder côte à côte, pièces actives derrière eux ; pousser seulement si cela crée une menace concrète.',
        "Hanging pawns control the center and support a break (d5 or c5) that opens the game at the right moment. Keep them side by side with active pieces behind them; push only when it creates a concrete threat.",
      );
    },
    get opponent() {
      return tr(
        "Les attaquer de face et de côté (tours sur les colonnes c et d, fous) pour forcer l'un d'eux à avancer, " +
          "puis bloquer la case devant le pion arriéré qui reste. Échanger les pièces pour rendre les pions faibles.",
        "Attack them from the front and the side (rooks on the c- and d-files, bishops) to force one of them to advance, then blockade the square in front of the backward pawn left behind. Trade pieces to make the pawns weak.",
      );
    },
  },
  CARLSBAD: {
    get label() {
      return tr('structure Carlsbad (Gambit Dame refusé, variante d’échange)', "Carlsbad structure (Queen's Gambit Declined, Exchange Variation)");
    },
    get owner() {
      return tr(
        "Attaque de minorité : pousser les pions b4-b5 pour échanger sur c6 et laisser à l’adversaire un pion c faible. " +
          'Colonne c semi-ouverte pour les tours ; le cavalier peut viser c5 ou e5.',
        "Minority attack: push the b-pawn b4-b5 to exchange on c6 and leave the opponent with a weak c-pawn. The half-open c-file is for the rooks; the knight can aim at c5 or e5.",
      );
    },
    get opponent() {
      return tr(
        'Jeu à l’aile roi : cavalier en e4, poussée f5, parfois attaque avec les pions g et h. ' +
          "Répondre à l'attaque de minorité en gardant c6 solide ou en jouant ...b5 au bon moment.",
        "Kingside play: knight to e4, the f5 push, sometimes an attack with the g- and h-pawns. Meet the minority attack by keeping c6 solid or by playing ...b5 at the right moment.",
      );
    },
  },
  CHAINE_E5: {
    get label() {
      return tr('chaîne de pions d4-e5 contre d5-e6 (type Française avance)', "d4-e5 vs d5-e6 pawn chain (French Advance type)");
    },
    get owner() {
      return tr(
        "La chaîne pointe vers l'aile roi : c'est là qu'il faut attaquer (f4-f5, pièces vers le roque). " +
          'Soutenir la base d4 contre ...c5 et le pion e5 contre ...f6.',
        "The chain points toward the kingside: that is where to attack (f4-f5, pieces toward the enemy king). Support the d4 base against ...c5 and the e5 pawn against ...f6.",
      );
    },
    get opponent() {
      return tr(
        "Attaquer la base de la chaîne : ...c5 contre d4, pression sur d4 (Cc6, Db6), puis ...f6 contre e5. " +
          'Le fou de cases blanches est gêné par ses propres pions : chercher à l’échanger ou à l’activer (...b6, ...Fa6).',
        "Attack the base of the chain: ...c5 against d4, pressure on d4 (Nc6, Qb6), then ...f6 against e5. The light-squared bishop is hemmed in by its own pawns: try to trade it or activate it (...b6, ...Ba6).",
      );
    },
  },
  CHAINE_D5: {
    get label() {
      return tr('chaîne de pions d5-e4 contre d6-e5 (type Est-indienne)', "d5-e4 vs d6-e5 pawn chain (King's Indian type)");
    },
    get owner() {
      return tr(
        "La chaîne pointe vers l'aile dame : y gagner de l’espace et ouvrir des colonnes (c4-c5, b4). " +
          'Surveiller la poussée adverse ...f5 à l’aile roi.',
        "The chain points toward the queenside: gain space there and open files (c4-c5, b4). Watch out for the opponent's ...f5 push on the kingside.",
      );
    },
    get opponent() {
      return tr(
        "Attaque à l'aile roi : ...f5, puis ...f4, ...g5, pièces vers le roque. C’est une course : chaque temps compte.",
        "Kingside attack: ...f5, then ...f4, ...g5, pieces toward the enemy king. It is a race: every tempo counts.",
      );
    },
  },
  MAROCZY: {
    get label() {
      return tr('étau de Maroczy (c4 + e4 contre d6)', "Maroczy Bind (c4 + e4 vs d6)");
    },
    get owner() {
      return tr(
        "Les pions c4 et e4 bloquent les poussées libératrices ...b5 et ...d5 : garder l'étau, jouer lentement, " +
          'gagner de l’espace et profiter du manque de place adverse.',
        "The c4 and e4 pawns stop the freeing breaks ...b5 and ...d5: keep the bind, play slowly, gain space and exploit the opponent's lack of room.",
      );
    },
    get opponent() {
      return tr(
        "Jeu compact et patient ; échanger des pièces pour gagner de la place, préparer ...b5, ...d5 ou ...f5 pour casser l'étau.",
        "Compact, patient play; trade pieces to gain room, prepare ...b5, ...d5 or ...f5 to break the bind.",
      );
    },
  },
  PETIT_CENTRE_SICILIEN: {
    get label() {
      return tr('structure sicilienne (d6 + e6 contre e4, colonne c semi-ouverte)', "Sicilian structure (d6 + e6 vs e4, half-open c-file)");
    },
    get owner() {
      return tr(
        "Contre-jeu sur la colonne c semi-ouverte et à l’aile dame (...b5), poussée libératrice ...d5 au bon moment. " +
          'Le centre compact d6-e6 est solide mais passif.',
        "Counterplay on the half-open c-file and on the queenside (...b5), with the freeing ...d5 break at the right moment. The compact d6-e6 center is solid but passive.",
      );
    },
    get opponent() {
      return tr(
        "Avantage d'espace : attaquer à l'aile roi (f4, g4-g5) ou préparer e5/f5 pour ouvrir. " +
          'Surveiller la poussée ...d5 et la case d6 si le pion avance.',
        "Space advantage: attack on the kingside (f4, g4-g5) or prepare e5/f5 to open the game. Watch out for the ...d5 break and the d6 square if the pawn advances.",
      );
    },
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
    if (ww && bw && ww !== bw) out.push(token('ROQUES_OPPOSES', { white: ww, black: bw }));
  }

  return out;
}

/** Plan des roques opposés, dans la langue des faits (résolu à l'appel). */
export function oppositeCastlingPlan() {
  return tr(
    "Roques opposés : c'est une course. Chaque camp lance ses pions vers le roi adverse pour ouvrir des colonnes ; " +
      "la vitesse compte plus que le matériel. Ne pas pousser les pions devant son propre roi.",
    "Opposite-side castling: it is a race. Each side throws its pawns at the enemy king to open files; speed matters more than material. Do not push the pawns in front of your own king.",
  );
}

/** Compatibilité : résolu au chargement du module (COACH_LANG doit être fixé avant l'import). */
export const OPPOSITE_CASTLING_PLAN = oppositeCastlingPlan();
