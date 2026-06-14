/**
 * Module 5 — Espace (pions avancés, cases faibles).
 */

import { parseFenPawns, parseFenPieces, isSquareAttackedByPawn, pawnsOfColor } from './fen-board.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildSpaceFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  const { pieces } = parseFenPieces(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // AVANTAGE_ESPACE : pions en territoire adverse (rangs 5-8 pour blancs, 1-4 pour noirs)
  const wAdvanced = pawns.filter((p) => p.color === 'w' && p.rank >= 5).length;
  const bAdvanced = pawns.filter((p) => p.color === 'b' && p.rank <= 4).length;

  if (wAdvanced > bAdvanced) out.push(token('AVANTAGE_ESPACE', { color: 'w' }));
  else if (bAdvanced > wAdvanced) out.push(token('AVANTAGE_ESPACE', { color: 'b' }));

  // CASE_FAIBLE : case en territoire ami (1-4 blancs, 5-8 noirs),
  // inattaquable par tout pion allié, attaquable par un pion adverse
  for (const color of /** @type {const} */ (['w', 'b'])) {
    const allies = pawnsOfColor(pawns, color);
    const enemies = pawnsOfColor(pawns, color === 'w' ? 'b' : 'w');
    const ranks = color === 'w' ? [1, 2, 3, 4] : [5, 6, 7, 8];
    const files = 'abcdefgh';

    for (const fileChar of files) {
      for (const rank of ranks) {
        const fileIdx = files.indexOf(fileChar);
        const sq = { fileIdx, rank };
        const attackedByAlly = isSquareAttackedByPawn(sq, allies, color);
        const attackedByEnemy = isSquareAttackedByPawn(sq, enemies, color === 'w' ? 'b' : 'w');
        if (!attackedByAlly && attackedByEnemy) {
          out.push(token('CASE_FAIBLE', { square: `${fileChar}${rank}`, color }));
        }
      }
    }
  }

  return out;
}
