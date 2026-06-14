/**
 * Module 1.1 — Structure de pions (faits statiques depuis FEN).
 */

import {
  KING_WING_FILES,
  QUEEN_WING_FILES,
  countIslands,
  frontSquare,
  isOnBoard,
  isSquareAttackedByPawn,
  parseFenPawns,
  pawnsOfColor,
} from './fen-board.js';
import { token } from './tokens.js';

/** @param {import('./fen-board.js').PawnSquare} pawn @param {import('./fen-board.js').PawnSquare[]} allies */
function isIsolated(pawn, allies) {
  return !allies.some(
    (a) => a.square !== pawn.square && Math.abs(a.fileIdx - pawn.fileIdx) === 1,
  );
}

/** @param {import('./fen-board.js').PawnSquare} pawn @param {import('./fen-board.js').PawnSquare[]} allies */
function hasAdvancedAdjacentAlly(pawn, allies) {
  for (const a of allies) {
    if (Math.abs(a.fileIdx - pawn.fileIdx) !== 1) continue;
    if (pawn.color === 'w' && a.rank > pawn.rank) return true;
    if (pawn.color === 'b' && a.rank < pawn.rank) return true;
  }
  return false;
}

/**
 * @param {import('./fen-board.js').PawnSquare} pawn
 * @param {import('./fen-board.js').PawnSquare[]} allies
 */
function alliedPawnProtectsFront(pawn, allies) {
  const front = frontSquare(pawn);
  if (!isOnBoard(front)) return false;

  for (const a of allies) {
    if (Math.abs(a.fileIdx - pawn.fileIdx) !== 1) continue;
    if (isSquareAttackedByPawn(front, [a], pawn.color)) return true;
  }
  return false;
}

/**
 * @param {import('./fen-board.js').PawnSquare} pawn
 * @param {import('./fen-board.js').PawnSquare[]} enemies
 */
function enemyPawnAttacksFront(pawn, enemies) {
  const front = frontSquare(pawn);
  if (!isOnBoard(front)) return false;

  const opp = pawn.color === 'w' ? 'b' : 'w';
  for (const e of enemies) {
    if (e.color !== opp) continue;
    if (Math.abs(e.fileIdx - pawn.fileIdx) !== 1) continue;
    if (isSquareAttackedByPawn(front, [e], opp)) return true;
  }
  return false;
}

/** @param {import('./fen-board.js').PawnSquare} pawn @param {import('./fen-board.js').PawnSquare[]} allies @param {import('./fen-board.js').PawnSquare[]} enemies */
function isBackward(pawn, allies, enemies) {
  const front = frontSquare(pawn);
  if (!isOnBoard(front)) return false;
  if (!hasAdvancedAdjacentAlly(pawn, allies)) return false;
  if (alliedPawnProtectsFront(pawn, allies)) return false;
  if (!enemyPawnAttacksFront(pawn, enemies)) return false;
  return true;
}

/** @param {import('./fen-board.js').PawnSquare} pawn @param {import('./fen-board.js').PawnSquare[]} enemies */
function isPassed(pawn, enemies) {
  const opp = pawn.color === 'w' ? 'b' : 'w';
  for (const e of enemies) {
    if (e.color !== opp) continue;
    if (Math.abs(e.fileIdx - pawn.fileIdx) > 1) continue;
    if (pawn.color === 'w' && e.rank > pawn.rank) return false;
    if (pawn.color === 'b' && e.rank < pawn.rank) return false;
  }
  return true;
}

/** @param {import('./fen-board.js').PawnSquare} pawn @param {import('./fen-board.js').PawnSquare[]} allies */
function isPassedProtected(pawn, allies) {
  const sq = { fileIdx: pawn.fileIdx, rank: pawn.rank };
  return isSquareAttackedByPawn(sq, allies, pawn.color);
}

/** @param {import('./fen-board.js').PawnSquare[]} pawns @param {readonly string[]} wingFiles */
function countOnWing(pawns, wingFiles) {
  const set = new Set(wingFiles);
  return {
    w: pawns.filter((p) => p.color === 'w' && set.has(p.file)).length,
    b: pawns.filter((p) => p.color === 'b' && set.has(p.file)).length,
  };
}

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildPawnStructureFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const id = color === 'w' ? 'NOMBRE_ILOTS_BLANC' : 'NOMBRE_ILOTS_NOIR';
    out.push(token(id, { count: countIslands(pawns, color) }));
  }

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const allies = pawnsOfColor(pawns, color);
    const enemies = pawnsOfColor(pawns, color === 'w' ? 'b' : 'w');

    for (const pawn of allies) {
      if (isIsolated(pawn, allies)) {
        out.push(token('PION_ISOLE', { color, square: pawn.square }));
      }
      if (isBackward(pawn, allies, enemies)) {
        out.push(token('PION_ARRIERE', { color, square: pawn.square }));
      }
      if (isPassed(pawn, enemies)) {
        out.push(token('PION_PASSE', { color, square: pawn.square }));
        if (isPassedProtected(pawn, allies)) {
          out.push(token('PION_PASSE_PROTEGE', { color, square: pawn.square }));
        }
      }
    }
  }

  for (const wing of /** @type {const} */ ([
    { id: 'MAJORITE_AILE_DAME', files: QUEEN_WING_FILES },
    { id: 'MAJORITE_AILE_ROI', files: KING_WING_FILES },
  ])) {
    const { w, b } = countOnWing(pawns, wing.files);
    if (w > b) out.push(token(wing.id, { color: 'w' }));
    if (b > w) out.push(token(wing.id, { color: 'b' }));
  }

  return out;
}
