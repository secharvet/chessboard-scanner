/**
 * Module 1.2 — Colonnes ouvertes, semi-ouvertes, doublons, chaînes de pions.
 */

import {
  FILES,
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
export function buildOpenFilesFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // ── 1. Colonnes ouvertes / semi-ouvertes ──
  for (let fi = 0; fi < 8; fi++) {
    const file = FILES[fi];
    const wCount = pawns.filter((p) => p.fileIdx === fi && p.color === 'w').length;
    const bCount = pawns.filter((p) => p.fileIdx === fi && p.color === 'b').length;

    if (wCount === 0 && bCount === 0) {
      out.push(token('COLONNE_OUVERTE', { file }));
    } else if (wCount === 0 && bCount > 0) {
      out.push(token('COLONNE_SEMI_OUVERTE', { file, color: 'w' }));
    } else if (bCount === 0 && wCount > 0) {
      out.push(token('COLONNE_SEMI_OUVERTE', { file, color: 'b' }));
    }
  }

  // ── 2. Doublons ──
  for (const color of /** @type {const} */ (['w', 'b'])) {
    for (let fi = 0; fi < 8; fi++) {
      const file = FILES[fi];
      const count = pawns.filter((p) => p.fileIdx === fi && p.color === color).length;
      if (count >= 2) {
        out.push(token('DOUBLON', { file, color }));
      }
    }
  }

  // ── 3. Pions arrière doubles (≥2 arrière adjacents) ──
  const allFacts = buildPawnStructureFacts(fen);
  const backward = allFacts.filter((t) => t.id === 'PION_ARRIERE');

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const bw = backward.filter((t) => t.params.color === color);
    if (bw.length < 2) continue;

    const fileSet = new Set(bw.map((t) => /** @type {string} */ (t.params.square)[0]));
    const hasAdjacent = [...fileSet].some(
      (f) => fileSet.has(FILES[FILES.indexOf(f) - 1]) || fileSet.has(FILES[FILES.indexOf(f) + 1]),
    );
    if (hasAdjacent) {
      out.push(token('PION_ARRIERE_DOUBLE', { color }));
    }
  }

  // ── 4. Chaînes de pions (≥3 soutenus diagonalement) ──
  for (const color of /** @type {const} */ (['w', 'b'])) {
    const colorPawns = pawnsOfColor(pawns, color);
    if (colorPawns.length < 3) continue;

    // Graph dirigé : un pion « soutient » les pions alliés sur ses diagonales avant
    /** @type {Map<string, string[]>} */
    const supports = new Map();
    const squareSet = new Set(colorPawns.map((p) => p.square));
    for (const p of colorPawns) {
      supports.set(p.square, []);
    }
    for (const p of colorPawns) {
      const targets = pawnAttackTargets(p.color, p.fileIdx, p.rank);
      for (const t of targets) {
        const sq = FILES[t.fileIdx] + t.rank;
        if (squareSet.has(sq)) {
          supports.get(p.square)?.push(sq);
        }
      }
    }

    // Plus longue chaîne depuis chaque pion (DAG → DFS + mémo)
    /** @type {Map<string, number>} */
    const memo = new Map();
    function longestFrom(sq) {
      if (memo.has(sq)) return /** @type {number} */ (memo.get(sq));
      let max = 1;
      for (const next of supports.get(sq) || []) {
        max = Math.max(max, 1 + longestFrom(next));
      }
      memo.set(sq, max);
      return max;
    }

    let maxChain = 0;
    for (const p of colorPawns) {
      maxChain = Math.max(maxChain, longestFrom(p.square));
    }

    if (maxChain >= 3) {
      out.push(token('CHAINE_PIONS', { color }));
    }
  }

  return out;
}
