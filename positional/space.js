/**
 * Module 5 — Espace (pions avancés, cases faibles).
 */

import { parseFenPawns, canPawnsEverAttack, pawnsOfColor } from './fen-board.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildSpaceFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // AVANTAGE_ESPACE : pions en territoire adverse (rangs 5-8 pour blancs, 1-4 pour noirs)
  const wAdvanced = pawns.filter((p) => p.color === 'w' && p.rank >= 5).length;
  const bAdvanced = pawns.filter((p) => p.color === 'b' && p.rank <= 4).length;

  if (wAdvanced > bAdvanced) out.push(token('AVANTAGE_ESPACE', { color: 'w' }));
  else if (bAdvanced > wAdvanced) out.push(token('AVANTAGE_ESPACE', { color: 'b' }));

  // CASE_FAIBLE (« trou ») : case du camp (rangées 3-4 blancs, 5-6 noirs) qu'aucun pion
  // ami ne pourra plus jamais contrôler, parce qu'un pion voisin l'a déjà dépassée.
  for (const color of /** @type {const} */ (['w', 'b'])) {
    const allies = pawnsOfColor(pawns, color);
    const ranks = color === 'w' ? [3, 4] : [5, 6];

    for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
      for (const rank of ranks) {
        const sq = { fileIdx, rank };
        if (canPawnsEverAttack(sq, allies, color)) continue;
        const neighbourPassed = allies.some(
          (p) =>
            Math.abs(p.fileIdx - fileIdx) === 1 &&
            (color === 'w' ? p.rank >= rank : p.rank <= rank),
        );
        if (neighbourPassed) {
          out.push(token('CASE_FAIBLE', { square: `${'abcdefgh'[fileIdx]}${rank}`, color }));
        }
      }
    }
  }

  return out;
}
