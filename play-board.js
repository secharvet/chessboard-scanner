/**
 * Échiquier interactif — clic ou glisser-déposer (échiquier maison, pas chessboard.js).
 */

import { fieldHighlightStyle } from './board-drawables.js';
import { appendHeatmapLayers, computeSquareControl } from './square-control.js';
import { FILES, fenToSquares, pieceImageUrl, squareAtIndex } from './fen-board-renderer.js';

const DRAG_THRESHOLD_PX = 6;

function squareFromEvent(e) {
  const el = e.target.closest?.('[data-square]');
  return el?.dataset?.square ?? null;
}

/**
 * @param {HTMLElement} container
 * @param {{
 *   fen: string,
 *   orientation?: 'white' | 'black',
 *   boardTheme?: 'classic' | 'brown' | 'dark',
 *   targets?: string[],
 *   lastMove?: { from: string, to: string } | null,
 *   dragFrom?: string | null,
 *   showHeatmap?: boolean,
 * }} state
 */
export function renderPlayBoard(container, state) {
  const orientation = state.orientation ?? 'white';
  const theme = state.boardTheme ?? 'classic';
  const squares = fenToSquares(state.fen);
  const ordered = orientation === 'white' ? squares : [...squares].reverse();
  const targetSet = new Set(state.targets ?? []);
  const last = state.lastMove;
  const dragFrom = state.dragFrom ?? null;
  const showHeatmap = Boolean(state.showHeatmap);
  const heatMap = showHeatmap ? computeSquareControl(state.fen) : null;

  container.innerHTML = '';
  container.className = 'board board--play';
  container.dataset.boardTheme = theme;

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

    if (heatMap) {
      const ctrl = heatMap.bySquare[squareName];
      if (ctrl) appendHeatmapLayers(cell, ctrl, heatMap);
    }

    if (last && (squareName === last.from || squareName === last.to)) {
      const hl = document.createElement('div');
      hl.className = 'fen-board__highlight fen-board__highlight--M';
      const style = fieldHighlightStyle('M');
      hl.style.backgroundColor = style.backgroundColor;
      hl.style.opacity = style.opacity;
      cell.appendChild(hl);
    }

    if (targetSet.has(squareName)) {
      const dot = document.createElement('div');
      dot.className = 'fen-board__target';
      cell.appendChild(dot);
    }

    if (row === 7) cell.dataset.coordFile = FILES[col];
    if (col === 0) {
      cell.dataset.coordRank = String(orientation === 'white' ? 8 - row : row + 1);
    }

    const piece = ordered[i];
    if (piece) {
      const img = document.createElement('img');
      img.className = 'fen-board__piece';
      if (dragFrom === squareName) img.classList.add('fen-board__piece--dragging');
      img.src = pieceImageUrl(piece);
      img.alt = '';
      img.draggable = false;
      cell.appendChild(img);
    }

    grid.appendChild(cell);
  }

  wrap.appendChild(grid);
  body.appendChild(wrap);
  frame.appendChild(body);
  container.appendChild(frame);

  animerDernierCoup(container, grid, last, state.fen);
  container.dataset.fenPrecedente = state.fen;
}

/* Glissement de la pièce qui vient de bouger (17 oct. 2026) : accélération puis amorti, 220 ms.
   On n'anime que si, par rapport au rendu précédent de ce même échiquier, la pièce était bien sur la case
   de départ et pas encore sur la case d'arrivée (donc pas sur un simple rafraîchissement, ni sur un « Retour »).
   Au roque, la tour suit le roi. Respecte « réduire les animations » du système. */
const DUREE_GLISSEMENT_MS = 220;
const COURBE_GLISSEMENT = 'cubic-bezier(0.4, 0, 0.2, 1)';
function piecesParCase(fen) {
  const s = fenToSquares(fen); const m = {};
  for (let i = 0; i < 64; i++) m[squareAtIndex(i, 'white')] = s[i] || null;
  return m;
}
function glisser(grid, from, to) {
  const dest = grid.querySelector(`[data-square="${to}"] .fen-board__piece`);
  const dep = grid.querySelector(`[data-square="${from}"]`);
  const arr = grid.querySelector(`[data-square="${to}"]`);
  if (!dest || !dep || !arr || typeof dest.animate !== 'function') return;
  const a = dep.getBoundingClientRect(), b = arr.getBoundingClientRect();
  const dx = a.left - b.left, dy = a.top - b.top;
  if (!dx && !dy) return;
  dest.style.zIndex = '5';
  const anim = dest.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: DUREE_GLISSEMENT_MS, easing: COURBE_GLISSEMENT, fill: 'none' });
  anim.finished?.then(() => { dest.style.zIndex = ''; }).catch(() => {});
}
function animerDernierCoup(container, grid, last, fen) {
  if (!last?.from || !last?.to) return;
  const fenPrec = container.dataset.fenPrecedente; if (!fenPrec || fenPrec === fen) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const avant = piecesParCase(fenPrec), apres = piecesParCase(fen);
  const piece = apres[last.to]; if (!piece) return;
  if (avant[last.from] !== piece || avant[last.to] === piece) return; // pas un coup joué vers l'avant
  glisser(grid, last.from, last.to);
  // roque : le roi a sauté deux colonnes, la tour l'accompagne
  if (piece.toLowerCase() === 'k' && Math.abs(last.from.charCodeAt(0) - last.to.charCodeAt(0)) === 2) {
    const rang = last.to[1]; const petit = last.to[0] === 'g';
    glisser(grid, (petit ? 'h' : 'a') + rang, (petit ? 'f' : 'd') + rang);
  }
}

/**
 * Clic + drag (une seule fois sur #playBoard).
 * @param {HTMLElement} container
 * @param {{
 *   canInteract: () => boolean,
 *   playerColor: () => string,
 *   getPiece: (sq: string) => { color: string } | null,
 *   onSelect?: (sq: string) => void,
 *   onSquareClick?: (sq: string) => void,
 *   onMove?: (from: string, to: string) => void,
 *   onDrop?: (from: string, to: string) => void,
 *   onDragStart?: (from: string) => void,
 *   onDragCancel?: () => void,
 * }} handlers
 */
export function bindPlayBoardInput(container, handlers) {
  if (container.dataset.bound === '1') return;
  container.dataset.bound = '1';

  const onSelect = handlers.onSelect ?? handlers.onSquareClick;
  const onMove = handlers.onMove ?? handlers.onDrop;
  if (!onSelect || !onMove) {
    throw new Error(
      'bindPlayBoardInput : onSelect (ou onSquareClick) et onMove (ou onDrop) sont requis.',
    );
  }

  let dragFrom = null;
  let dragActive = false;
  let dragVisual = false;
  let startX = 0;
  let startY = 0;

  const resetDrag = () => {
    if (dragVisual) handlers.onDragCancel?.();
    dragFrom = null;
    dragActive = false;
    dragVisual = false;
  };

  container.addEventListener('mousedown', (e) => {
    if (!handlers.canInteract()) return;
    const sq = squareFromEvent(e);
    if (!sq) return;
    const piece = handlers.getPiece(sq);
    if (!piece || piece.color !== handlers.playerColor()) return;
    dragFrom = sq;
    dragActive = false;
    dragVisual = false;
    startX = e.clientX;
    startY = e.clientY;
  });

  container.addEventListener('mousemove', (e) => {
    if (!dragFrom) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!dragActive && Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
      dragActive = true;
      if (!dragVisual) {
        dragVisual = true;
        handlers.onDragStart?.(dragFrom);
      }
    }
  });

  container.addEventListener('mouseup', (e) => {
    if (!handlers.canInteract()) {
      resetDrag();
      return;
    }
    const sq = squareFromEvent(e);
    if (!sq) {
      resetDrag();
      return;
    }
    if (dragActive && dragFrom) {
      if (sq !== dragFrom) onMove(dragFrom, sq);
      resetDrag();
      return;
    }
    if (dragFrom && sq !== dragFrom) {
      onMove(dragFrom, sq);
    } else {
      onSelect(sq);
    }
    resetDrag();
  });

  container.addEventListener('mouseleave', () => {
    resetDrag();
  });
}
