/**
 * Échiquier FEN : pièces locales, coordonnées, flèches/cases PGN [%cal]/[%csl].
 */

import { fieldHighlightStyle, renderBoardArrows } from './board-drawables.js';
import { FILES, fenToSquares, pieceImageUrl, squareAtIndex } from './fen-board-renderer.js';

/**
 * @param {HTMLElement} container
 * @param {string} fen
 * @param {{
 *   orientation?: 'white' | 'black',
 *   drawables?: { arrows?: import('./board-drawables.js').BoardArrow[], fields?: import('./board-drawables.js').BoardField[] },
 * }} [options]
 */
export function renderFenBoard(container, fen, options = {}) {
  const orientation = options.orientation ?? 'white';
  const squares = fenToSquares(fen);
  const ordered = orientation === 'white' ? squares : [...squares].reverse();
  const arrows = options.drawables?.arrows ?? [];
  const fields = options.drawables?.fields ?? [];

  const fieldBySquare = new Map();
  for (const f of fields) {
    fieldBySquare.set(f.square, f.color);
  }

  container.innerHTML = '';
  container.className = 'board';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Position actuelle');

  const frame = document.createElement('div');
  frame.className = 'board-frame';

  const body = document.createElement('div');
  body.className = 'board-body';

  const wrap = document.createElement('div');
  wrap.className = 'fen-board-wrap';

  const grid = document.createElement('div');
  grid.className = 'fen-board';

  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isLight = (row + col) % 2 === 0;
    const squareName = squareAtIndex(i, orientation);

    const cell = document.createElement('div');
    cell.className = `fen-board__sq ${isLight ? 'fen-board__sq--light' : 'fen-board__sq--dark'}`;
    cell.dataset.square = squareName;

    const hl = fieldBySquare.get(squareName);
    if (hl) {
      const hlEl = document.createElement('div');
      hlEl.className = `fen-board__highlight fen-board__highlight--${hl}`;
      const style = fieldHighlightStyle(hl);
      hlEl.style.backgroundColor = style.backgroundColor;
      hlEl.style.opacity = style.opacity;
      cell.appendChild(hlEl);
    }

    if (row === 7) {
      const f = document.createElement('span');
      f.className = 'fen-board__coord fen-board__coord--file';
      f.textContent = FILES[col];
      cell.appendChild(f);
    }
    if (col === 0) {
      const r = document.createElement('span');
      r.className = 'fen-board__coord fen-board__coord--rank';
      r.textContent = String(orientation === 'white' ? 8 - row : row + 1);
      cell.appendChild(r);
    }

    const piece = ordered[i];
    if (piece) {
      const img = document.createElement('img');
      img.className = 'fen-board__piece';
      img.src = pieceImageUrl(piece);
      img.alt = '';
      img.draggable = false;
      cell.appendChild(img);
    }

    grid.appendChild(cell);
  }

  wrap.appendChild(grid);

  if (arrows.length > 0) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'fen-board__arrows');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    renderBoardArrows(svg, arrows, orientation);
    wrap.appendChild(svg);
  }

  body.appendChild(wrap);
  frame.appendChild(body);
  container.appendChild(frame);
}
