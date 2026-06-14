/**
 * Module 3 — Matériel (décompte des pièces, avantage matériel).
 */

import { parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

const PIECE_VALUE = { q: 9, r: 5, b: 3, n: 3, p: 1 };

/** @param {import('./fen-board.js').Piece[]} pieces @param {'w'|'b'} color */
function materialScore(pieces, color) {
  let score = 0;
  for (const p of pieces) {
    if (p.color === color) score += PIECE_VALUE[p.type] ?? 0;
  }
  return score;
}

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildMaterialFacts(fen) {
  const { pieces } = parseFenPieces(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  const w = materialScore(pieces, 'w');
  const b = materialScore(pieces, 'b');

  if (w > b) out.push(token('AVANTAGE_MATERIEL', { color: 'w', score: w - b }));
  else if (b > w) out.push(token('AVANTAGE_MATERIEL', { color: 'b', score: b - w }));
  else out.push(token('EGALITE_MATERIEL', {}));

  return out;
}
