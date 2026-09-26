/**
 * Module 1.4 — Sécurité du roi (roque, bouclier de pions).
 */

import { parseFenPawns, parseFenPieces, FILES } from './fen-board.js';
import { detectPhase } from './phase.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildKingSafetyFacts(fen) {
  // En finale, le roi doit être actif : roque et bouclier n'ont plus de sens.
  const phase = detectPhase(fen);
  if (phase === 'finale') return [];
  // Dans les premiers coups, un roi au centre est normal : on ne le signale qu'ensuite.
  const fullmove = Number(fen.split(' ')[5] ?? 1) || 1;
  const centreIsAlarming = fullmove >= 8;

  const { pieces } = parseFenPieces(fen);
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const king = pieces.find((p) => p.type === 'k' && p.color === color);
    if (!king) continue;

    const homeRank = color === 'w' ? 1 : 8;
    const nearHome = Math.abs(king.rank - homeRank) <= 1;

    // Roi mis à l'abri sur une aile (roqué, ou déplacé à la main en f/g/h ou a/b/c).
    if (king.fileIdx >= 5 && nearHome) {
      out.push(token('ROQUE_PETIT', { color }));
      addShield(out, pawns, color, ['f', 'g', 'h']);
    } else if (king.fileIdx <= 2 && nearHome) {
      out.push(token('ROQUE_GRAND', { color }));
      addShield(out, pawns, color, ['a', 'b', 'c']);
    } else if ((king.fileIdx === 3 || king.fileIdx === 4) && centreIsAlarming) {
      out.push(token('ROI_AU_CENTRE', { color }));
    }
  }

  return out;
}

/**
 * Bouclier : un pion ami sur chaque colonne de l'aile, sur les 2 rangées devant le roi
 * (un pion avancé d'une case, ex. h3, protège encore).
 * @param {import('./tokens.js').PositionalToken[]} out
 * @param {import('./fen-board.js').PawnSquare[]} pawns
 * @param {'w'|'b'} color
 * @param {string[]} files
 */
function addShield(out, pawns, color, files) {
  const shieldRanks = color === 'w' ? [2, 3] : [7, 6];
  const missing = files.filter(
    (file) =>
      !pawns.some((p) => p.color === color && p.file === file && shieldRanks.includes(p.rank)),
  );

  if (missing.length === 0) {
    out.push(token('PIONS_ROI_BOUCLIER', { color }));
  } else {
    out.push(token('PIONS_ROI_AFFAIBLI', { color, files: missing.join(',') }));
  }
}
