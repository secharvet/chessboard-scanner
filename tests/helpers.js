/**
 * Helpers de test — positions construites via chess.js (pas de FEN fragiles).
 */

import { Chess } from 'chess.js';

/** @param {string[]} sans */
export function fenAfterSans(sans) {
  const chess = new Chess();
  for (const san of sans) {
    const m = chess.move(san);
    if (!m) throw new Error(`Coup illégal dans fixture : ${san} (après ${chess.fen()})`);
  }
  return chess.fen();
}

/** @param {string} fen @param {string[]} sans */
export function fenAfterFrom(fen, sans) {
  const chess = new Chess(fen);
  for (const san of sans) {
    const m = chess.move(san);
    if (!m) throw new Error(`Coup illégal : ${san}`);
  }
  return chess.fen();
}

export { Chess };
