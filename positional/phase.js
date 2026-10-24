/**
 * Phase de jeu (ouverture / milieu / finale) — conditionne l'importance des autres faits.
 */

import { parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

const NON_PAWN_VALUE = { q: 9, r: 5, b: 3, n: 3 };

/** Pièces mineures encore sur leur case de départ (les deux camps). */
const MINOR_START = {
  w: { b1: 'n', g1: 'n', c1: 'b', f1: 'b' },
  b: { b8: 'n', g8: 'n', c8: 'b', f8: 'b' },
};

/**
 * @param {string} fen
 * @returns {'ouverture' | 'milieu' | 'finale'}
 */
export function detectPhase(fen) {
  const { pieces } = parseFenPieces(fen);
  const fullmove = Number(fen.split(' ')[5] ?? 1) || 1;

  const npm = { w: 0, b: 0 };
  let queens = 0;
  let undeveloped = 0;
  for (const p of pieces) {
    npm[p.color] += NON_PAWN_VALUE[p.type] ?? 0;
    if (p.type === 'q') queens++;
    if (MINOR_START[p.color][p.square] === p.type) undeveloped++;
  }

  // Finale : plus de dames et peu de pièces, ou très peu de matériel au total.
  if ((queens === 0 && npm.w <= 13 && npm.b <= 13) || npm.w + npm.b <= 20) {
    return 'finale';
  }
  if (fullmove <= 12 && undeveloped >= 3) return 'ouverture';
  return 'milieu';
}

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildPhaseFacts(fen) {
  return [token('PHASE', { phase: detectPhase(fen) })];
}
