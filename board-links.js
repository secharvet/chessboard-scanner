/**
 * Liens entre un texte (réponse du coach) et l'échiquier affiché :
 *   case citée (« e5 »)   → la case s'illumine ;
 *   coup cité (« Cd5 »)   → flèche départ → arrivée si le coup est jouable dans la position,
 *                           sinon illumination de la case d'arrivée (coup d'une ligne future).
 * Survol sur ordinateur, toucher sur téléphone (un second toucher ou un toucher ailleurs efface).
 */

import { Chess } from '/vendor/chess.js';
import { renderBoardArrows } from './board-drawables.js';

const FR_TO_EN = { R: 'K', D: 'Q', T: 'R', F: 'B', C: 'N' };
// Coups en notation française (pièce, prise de pion, roque) puis cases seules.
const TOKEN_RE = /(?<![\w-])(O-O(?:-O)?|[RDTFC][a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?[+#]?|[a-h]x[a-h][1-8](?:=[DTFC])?[+#]?|[a-h][1-8])(?![\w])/g;

/** @param {string} san notation française */
function toEnglish(san) {
  return san.replace(/^[RDTFC]/, (c) => FR_TO_EN[c]).replace(/=([DTFC])/, (_, c) => `=${FR_TO_EN[c]}`);
}

/**
 * Remplace, dans les nœuds texte de `root`, les cases et coups par des liens.
 * @param {HTMLElement} root
 */
export function linkifyChess(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.parentElement?.closest('.sq-link, .mv-link, code, a')) nodes.push(n);
  }
  for (const node of nodes) {
    const text = node.nodeValue ?? '';
    TOKEN_RE.lastIndex = 0;
    if (!TOKEN_RE.test(text)) continue;
    TOKEN_RE.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const m of text.matchAll(TOKEN_RE)) {
      frag.append(text.slice(last, m.index));
      const span = document.createElement('span');
      const token = m[1];
      if (/^[a-h][1-8]$/.test(token)) {
        span.className = 'sq-link';
        span.dataset.sq = token;
      } else {
        span.className = 'mv-link';
        span.dataset.san = token;
      }
      span.textContent = token;
      span.tabIndex = 0;
      frag.append(span);
      last = m.index + token.length;
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
}

/**
 * Ce qu'un lien doit montrer dans la position `fen`.
 * @returns {{ arrow?: { from: string, to: string }, square?: string } | null}
 */
export function resolveLink(el, fen) {
  if (el.classList.contains('sq-link')) {
    // « Joue d4 » : une case qui correspond à un coup de pion jouable devient une flèche.
    const sq = el.dataset.sq ?? '';
    try {
      const pawn = new Chess(fen).moves({ verbose: true }).find((m) => m.piece === 'p' && m.to === sq && !m.captured);
      if (pawn) return { arrow: { from: pawn.from, to: pawn.to } };
    } catch { /* position illisible */ }
    return { square: sq };
  }
  const san = el.dataset.san ?? '';
  try {
    const m = new Chess(fen).move(toEnglish(san.replace(/[+#]$/, '')));
    if (m) return { arrow: { from: m.from, to: m.to } };
  } catch { /* coup d'une ligne future : pas jouable maintenant */ }
  const dest = san.match(/([a-h][1-8])(?:=[DTFC])?[+#]?$/)?.[1];
  return dest ? { square: dest } : null;
}

/** Efface les indications posées sur l'échiquier. */
export function clearBoardHints(board) {
  board.querySelectorAll('.fen-board__sq--glow').forEach((c) => c.classList.remove('fen-board__sq--glow'));
  board.querySelectorAll('.fen-board__arrows--hint').forEach((s) => s.remove());
}

/** Montre une case ou une flèche sur l'échiquier `board`. */
export function showOnBoard(board, what, orientation = 'white') {
  clearBoardHints(board);
  if (!what) return;
  if (what.square) {
    board.querySelector(`[data-square="${what.square}"]`)?.classList.add('fen-board__sq--glow');
  }
  if (what.arrow) {
    const wrap = board.querySelector('.fen-board-wrap') ?? board;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'fen-board__arrows fen-board__arrows--hint');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    renderBoardArrows(svg, [{ color: 'Y', from: what.arrow.from, to: what.arrow.to }], orientation);
    wrap.appendChild(svg);
    board.querySelector(`[data-square="${what.arrow.to}"]`)?.classList.add('fen-board__sq--glow');
  }
}

/**
 * Branche survol et toucher sur les liens de `container`.
 * @param {HTMLElement} container
 * @param {{ board: () => HTMLElement | null, getFen: () => string, getOrientation?: () => 'white' | 'black' }} opts
 */
export function bindBoardLinks(container, opts) {
  let pinned = null;
  const show = (el) => {
    const board = opts.board();
    if (board) showOnBoard(board, resolveLink(el, opts.getFen()), opts.getOrientation?.() ?? 'white');
  };
  const clear = () => {
    const board = opts.board();
    if (board) clearBoardHints(board);
  };
  const linkOf = (e) => /** @type {HTMLElement | null} */ (e.target)?.closest?.('.sq-link, .mv-link');

  container.addEventListener('mouseover', (e) => { const l = linkOf(e); if (l && !pinned) show(l); });
  container.addEventListener('mouseout', (e) => { if (linkOf(e) && !pinned) clear(); });
  container.addEventListener('click', (e) => {
    const l = linkOf(e);
    if (!l) return;
    e.preventDefault();
    if (pinned === l) { pinned = null; l.classList.remove('is-active'); clear(); return; }
    pinned?.classList.remove('is-active');
    pinned = l;
    l.classList.add('is-active');
    show(l);
  });
  document.addEventListener('click', (e) => {
    if (pinned && !linkOf(e) && !/** @type {HTMLElement} */ (e.target).closest?.('.fen-board')) {
      pinned.classList.remove('is-active');
      pinned = null;
      clear();
    }
  });
}
