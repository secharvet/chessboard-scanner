/**
 * Carte des attaques — base commune des détecteurs tactiques et stratégiques.
 * Pseudo-légale (ignore clouages et échecs) : on décrit la géométrie, Stockfish juge.
 */

import { parseFenPieces } from './fen-board.js';

export const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
export const FILES = 'abcdefgh';

const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
export const DIAGONALS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
export const STRAIGHTS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/** @typedef {import('./fen-board.js').Piece} Piece */

/** @param {number} f @param {number} r */
export const sq = (f, r) => `${FILES[f]}${r}`;
/** @param {string} c */
export const other = (c) => (c === 'w' ? 'b' : 'w');
/** Couleur de case : 'noires' (a1) ou 'claires'. @param {string} s */
export const squareColor = (s) => ((FILES.indexOf(s[0]) + Number(s[1])) % 2 === 1 ? 'noires' : 'claires');
/** Rangée vue du camp `c` (1 = sa première rangée). */
export const relRank = (rank, c) => (c === 'w' ? rank : 9 - rank);

/** @param {Piece} p */
export function sliderDirs(p) {
  if (p.type === 'b') return DIAGONALS;
  if (p.type === 'r') return STRAIGHTS;
  if (p.type === 'q') return [...DIAGONALS, ...STRAIGHTS];
  return [];
}

/**
 * @param {string} fen
 */
export function buildAttackMap(fen) {
  const { pieces } = parseFenPieces(fen);
  /** @type {Record<string, Piece>} */
  const at = {};
  for (const p of pieces) at[p.square] = p;

  /** @type {Map<Piece, string[]>} */
  const attacks = new Map();
  for (const p of pieces) attacks.set(p, attacksFrom(p, at));

  /** Pièces de `color` qui attaquent (ou défendent) `square`. */
  const attackersOf = (square, color) =>
    pieces.filter((p) => p.color === color && p.square !== square && attacks.get(p).includes(square));

  /** Pièces rencontrées le long d'un rayon depuis `from` (dans l'ordre). */
  const piecesOnRay = (from, [df, dr], max = 2) => {
    const out = [];
    let f = from.fileIdx + df;
    let r = from.rank + dr;
    while (f >= 0 && f < 8 && r >= 1 && r <= 8 && out.length < max) {
      const p = at[sq(f, r)];
      if (p) out.push(p);
      f += df;
      r += dr;
    }
    return out;
  };

  /** Mobilité : cases attaquées non occupées par un ami (pions : poussées libres). */
  const mobility = (p) => {
    if (p.type === 'p') {
      const dr = p.color === 'w' ? 1 : -1;
      return at[sq(p.fileIdx, p.rank + dr)] ? 0 : 1;
    }
    return attacks.get(p).filter((s) => at[s]?.color !== p.color).length;
  };

  /** Case défendue par `color` (au moins un défenseur hors `except`). */
  const isDefended = (square, color, except = null) =>
    attackersOf(square, color).some((p) => p !== except);

  return { pieces, at, attacks, attackersOf, piecesOnRay, mobility, isDefended };
}

/** @param {Piece} p @param {Record<string, Piece>} at */
function attacksFrom(p, at) {
  const out = [];
  const push = (f, r) => {
    if (f >= 0 && f < 8 && r >= 1 && r <= 8) out.push(sq(f, r));
  };
  if (p.type === 'n') for (const [df, dr] of KNIGHT) push(p.fileIdx + df, p.rank + dr);
  else if (p.type === 'k') for (const [df, dr] of KING) push(p.fileIdx + df, p.rank + dr);
  else if (p.type === 'p') {
    const dr = p.color === 'w' ? 1 : -1;
    push(p.fileIdx - 1, p.rank + dr);
    push(p.fileIdx + 1, p.rank + dr);
  } else {
    for (const [df, dr] of sliderDirs(p)) {
      let f = p.fileIdx + df;
      let r = p.rank + dr;
      while (f >= 0 && f < 8 && r >= 1 && r <= 8) {
        out.push(sq(f, r));
        if (at[sq(f, r)]) break;
        f += df;
        r += dr;
      }
    }
  }
  return out;
}
