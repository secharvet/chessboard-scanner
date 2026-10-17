/**
 * Module commun pour la création de plateau FEN (partagé entre board-view et play-board).
 */

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const PIECE_IMG_BASE = './assets/pieces';

// Jeux de pièces disponibles (sous-dossiers de assets/pieces/, en SVG). Le choix se fait dans Paramètres.
export const PIECE_SETS = ['cburnett', 'fresca', 'california', 'tatiana', 'maestro', 'gioco'];

export function pieceSetCourant() {
  try { const v = localStorage.getItem('piece-set'); if (PIECE_SETS.includes(v)) return v; } catch (e) {}
  return 'cburnett';
}

export function pieceImageUrl(piece) {
  const isWhite = piece === piece.toUpperCase();
  const type = piece.toUpperCase();
  return `${PIECE_IMG_BASE}/${pieceSetCourant()}/${isWhite ? 'w' : 'b'}${type}.svg`;
}

export function fenToSquares(fen) {
  const ranks = fen.split(' ')[0].split('/');
  const squares = [];
  for (const rank of ranks) {
    for (const ch of rank) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < Number(ch); i++) squares.push(null);
      } else {
        squares.push(ch);
      }
    }
  }
  return squares;
}

export function squareAtIndex(i, orientation) {
  const row = Math.floor(i / 8);
  const col = i % 8;
  const rankNum = orientation === 'white' ? 8 - row : row + 1;
  return `${FILES[col]}${rankNum}`;
}
