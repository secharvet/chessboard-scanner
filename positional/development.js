/**
 * Module 4 — Développement (pièces encore sur leur case de départ).
 */

import { parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

const STARTING_SQUARES = {
  w: { n: ['b1', 'g1'], b: ['c1', 'f1'], q: ['d1'] },
  b: { n: ['b8', 'g8'], b: ['c8', 'f8'], q: ['d8'] },
};

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildDevelopmentFacts(fen) {
  const { pieces } = parseFenPieces(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  for (const color of /** @type {const} */ (['w', 'b'])) {
    let undevelopedCount = 0;
    let queenOut = false;

    for (const type of /** @type {(keyof typeof STARTING_SQUARES.w)[]} */ (['n', 'b', 'q'])) {
      const starting = STARTING_SQUARES[color][type];
      for (const sq of starting) {
        const piece = pieces.find((p) => p.square === sq && p.color === color && p.type === type);
        if (piece) {
          if (type === 'q') {
            // Reine encore sur sa case → pas sortie
          } else {
            undevelopedCount++;
            out.push(token('PIECE_NON_DEVELOPPEE', { square: sq, color, type }));
          }
        } else if (type === 'q') {
          // Reine absente de sa case de départ → sortie
          const queen = pieces.find((p) => p.type === 'q' && p.color === color);
          if (queen) queenOut = true;
        }
      }
    }

    if (queenOut && undevelopedCount > 0) {
      out.push(token('DAME_SORTIE_TOT', { color }));
    }
  }

  return out;
}
