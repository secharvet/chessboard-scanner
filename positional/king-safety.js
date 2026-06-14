/**
 * Module 1.4 — Sécurité du roi (roque, bouclier de pions).
 */

import { parseFenPawns, parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildKingSafetyFacts(fen) {
  const { pieces } = parseFenPieces(fen);
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const king = pieces.find((p) => p.type === 'k' && p.color === color);
    if (!king) continue;

    const g = color === 'w' ? 'g1' : 'g8';
    const c = color === 'w' ? 'c1' : 'c8';
    const e = color === 'w' ? 'e1' : 'e8';

    if (king.square === g) {
      out.push(token('ROQUE_PETIT', { color }));
      addShield(out, pawns, color, 'petit');
    } else if (king.square === c) {
      out.push(token('ROQUE_GRAND', { color }));
      addShield(out, pawns, color, 'grand');
    } else if (king.square === e) {
      out.push(token('ROI_AU_CENTRE', { color }));
    }
  }

  return out;
}

/**
 * @param {import('./tokens.js').PositionalToken[]} out
 * @param {import('./fen-board.js').PawnSquare[]} pawns
 * @param {'w'|'b'} color
 * @param {'petit'|'grand'} side
 */
function addShield(out, pawns, color, side) {
  const squares =
    side === 'petit'
      ? color === 'w'
        ? ['f2', 'g2', 'h2']
        : ['f7', 'g7', 'h7']
      : color === 'w'
        ? ['a2', 'b2', 'c2']
        : ['a7', 'b7', 'c7'];

  const present = pawns.filter((p) => p.color === color && squares.includes(p.square));
  if (present.length === 3) {
    out.push(token('PIONS_ROI_BOUCLIER', { color }));
  } else {
    out.push(token('PIONS_ROI_AFFAIBLI', { color }));
  }
}
