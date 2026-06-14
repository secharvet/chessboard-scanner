/**
 * Module 1.3 — Avant-postes et pions faibles.
 */

import {
  FILES,
  isSquareAttackedByPawn,
  parseFenPawns,
  pawnAttackTargets,
  pawnsOfColor,
} from './fen-board.js';
import { buildPawnStructureFacts } from './pawn-structure.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildOutpostFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // ── 1. Avant-postes ──
  const emitted = /** @type {Set<string>} */ (new Set());

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const allies = pawnsOfColor(pawns, color);
    const enemies = pawnsOfColor(pawns, color === 'w' ? 'b' : 'w');
    const minRank = color === 'w' ? 5 : 1;
    const maxRank = color === 'w' ? 8 : 4;

    for (const p of allies) {
      const targets = pawnAttackTargets(p.color, p.fileIdx, p.rank);
      for (const t of targets) {
        if (t.rank < minRank || t.rank > maxRank) continue;
        const sq = FILES[t.fileIdx] + t.rank;
        if (emitted.has(sq + color)) continue;

        if (!isSquareAttackedByPawn(t, enemies, color === 'w' ? 'b' : 'w')) {
          emitted.add(sq + color);
          out.push(token('AVANT_POSTE', { square: sq, color }));
        }
      }
    }
  }

  // ── 2. Pions faibles (isolé + arrière) ──
  const allFacts = buildPawnStructureFacts(fen);
  const isolated = new Set(
    allFacts.filter((t) => t.id === 'PION_ISOLE').map((t) => /** @type {string} */ (t.params.square)),
  );
  const backward = new Set(
    allFacts.filter((t) => t.id === 'PION_ARRIERE').map((t) => /** @type {string} */ (t.params.square)),
  );

  for (const sq of isolated) {
    if (backward.has(sq)) {
      const pawn = pawns.find((p) => p.square === sq);
      if (pawn) {
        out.push(token('PION_FAIBLE', { square: sq, color: pawn.color }));
      }
    }
  }

  return out;
}
