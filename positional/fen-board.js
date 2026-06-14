/**
 * Parse FEN → pions et géométrie pion (attaques diagonales).
 */

export const FILES = 'abcdefgh';
export const QUEEN_WING_FILES = ['a', 'b', 'c', 'd'];
export const KING_WING_FILES = ['e', 'f', 'g', 'h'];

/** @typedef {'w'|'b'} Color */
/** @typedef {{ color: Color, file: string, fileIdx: number, rank: number, square: string }} PawnSquare */

/**
 * @param {string} fen
 * @returns {{ pawns: PawnSquare[] }}
 */
export function parseFenPawns(fen) {
  const ranks = fen.split(' ')[0].split('/');
  /** @type {PawnSquare[]} */
  const pawns = [];

  for (let ri = 0; ri < 8; ri++) {
    const rankNum = 8 - ri;
    let fileIdx = 0;
    for (const ch of ranks[ri]) {
      if (ch >= '1' && ch <= '8') {
        fileIdx += Number(ch);
        continue;
      }
      if (ch === 'P' || ch === 'p') {
        pawns.push({
          color: ch === 'P' ? 'w' : 'b',
          file: FILES[fileIdx],
          fileIdx,
          rank: rankNum,
          square: `${FILES[fileIdx]}${rankNum}`,
        });
      }
      fileIdx++;
    }
  }

  return { pawns };
}

/** @param {number} fileIdx @param {number} rank */
export function squareFrom(fileIdx, rank) {
  return `${FILES[fileIdx]}${rank}`;
}

/** @param {Color} color @param {number} fileIdx @param {number} rank */
export function pawnAttackTargets(color, fileIdx, rank) {
  /** @type {{ fileIdx: number, rank: number }[]} */
  const out = [];
  const dr = color === 'w' ? 1 : -1;
  for (const df of [-1, 1]) {
    const f = fileIdx + df;
    const r = rank + dr;
    if (f >= 0 && f < 8 && r >= 1 && r <= 8) {
      out.push({ fileIdx: f, rank: r });
    }
  }
  return out;
}

/** @param {{ fileIdx: number, rank: number }} sq @param {PawnSquare[]} pawns @param {Color} attackerColor */
export function isSquareAttackedByPawn(sq, pawns, attackerColor) {
  for (const p of pawns) {
    if (p.color !== attackerColor) continue;
    const targets = pawnAttackTargets(p.color, p.fileIdx, p.rank);
    if (targets.some((t) => t.fileIdx === sq.fileIdx && t.rank === sq.rank)) {
      return true;
    }
  }
  return false;
}

/** @param {PawnSquare} pawn */
export function frontSquare(pawn) {
  const dr = pawn.color === 'w' ? 1 : -1;
  return { fileIdx: pawn.fileIdx, rank: pawn.rank + dr };
}

/** @param {{ fileIdx: number, rank: number }} sq */
export function isOnBoard(sq) {
  return sq.fileIdx >= 0 && sq.fileIdx < 8 && sq.rank >= 1 && sq.rank <= 8;
}

/** @param {PawnSquare[]} pawns @param {Color} color */
export function pawnsOfColor(pawns, color) {
  return pawns.filter((p) => p.color === color);
}

/** @param {PawnSquare[]} pawns @param {Color} color */
export function countIslands(pawns, color) {
  const files = new Set(
    pawns.filter((p) => p.color === color).map((p) => p.fileIdx),
  );
  if (files.size === 0) return 0;

  const sorted = [...files].sort((a, b) => a - b);
  let islands = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) islands++;
  }
  return islands;
}

/** @typedef {{ type: string, color: Color, file: string, fileIdx: number, rank: number, square: string }} Piece */

/**
 * Parse toutes les pièces du FEN (pas seulement les pions).
 * @param {string} fen
 * @returns {{ pieces: Piece[] }}
 */
export function parseFenPieces(fen) {
  const ranks = fen.split(' ')[0].split('/');
  /** @type {Piece[]} */
  const pieces = [];

  for (let ri = 0; ri < 8; ri++) {
    const rankNum = 8 - ri;
    let fileIdx = 0;
    for (const ch of ranks[ri]) {
      if (ch >= '1' && ch <= '8') {
        fileIdx += Number(ch);
        continue;
      }
      pieces.push({
        type: ch.toLowerCase(),
        color: ch === ch.toUpperCase() ? 'w' : 'b',
        file: FILES[fileIdx],
        fileIdx,
        rank: rankNum,
        square: `${FILES[fileIdx]}${rankNum}`,
      });
      fileIdx++;
    }
  }

  return { pieces };
}
