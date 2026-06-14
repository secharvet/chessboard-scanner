/**
 * Annotations PGN [%cal] (flèches) et [%csl] (cases).
 * Codes : M dernier coup, G contrôle, R menace, Y plan, B idée PGN.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL = 100 / 8;
const HALF_CELL = CELL / 2;

/** @typedef {{ color: string, from: string, to: string }} BoardArrow */
/** @typedef {{ color: string, square: string }} BoardField */

/** @type {Record<string, { label: string, stroke: string, field?: string, fieldOpacity?: number }>} */
export const PALETTE = {
  M: {
    label: 'Dernier coup',
    stroke: 'rgba(148, 198, 240, 0.88)',
    field: 'rgba(168, 216, 234, 0.38)',
    fieldOpacity: 1,
  },
  G: {
    label: 'Contrôle / influence',
    stroke: 'rgba(46, 204, 113, 0.75)',
    field: '#2ecc71',
    fieldOpacity: 0.4,
  },
  R: {
    label: 'Menace / pression',
    stroke: 'rgba(255, 92, 109, 0.8)',
    field: '#ff5c6d',
    fieldOpacity: 0.4,
  },
  Y: {
    label: 'Plan / coup préparé',
    stroke: 'rgba(240, 180, 41, 0.85)',
    field: '#f0b429',
    fieldOpacity: 0.42,
  },
  B: {
    label: 'Idée (annotation PGN)',
    stroke: 'rgba(91, 156, 245, 0.8)',
    field: '#5b9cf5',
    fieldOpacity: 0.38,
  },
};

/** Priorité d'affichage si plusieurs annotations sur la même case. */
export const FIELD_PRIORITY = { M: 50, R: 40, G: 30, Y: 20, B: 10 };

/**
 * @param {string} raw ex. "Ge2e4"
 * @returns {BoardArrow | null}
 */
export function parseColorArrow(raw) {
  if (!raw || raw.length < 5) return null;
  const color = raw[0];
  const from = raw.slice(1, 3);
  const to = raw.slice(3, 5);
  if (!isSquare(from) || !isSquare(to)) return null;
  return { color, from, to };
}

/**
 * @param {string} raw ex. "Gf7"
 * @returns {BoardField | null}
 */
export function parseColorField(raw) {
  if (!raw || raw.length < 3) return null;
  const color = raw[0];
  const square = raw.slice(1, 3);
  if (!isSquare(square)) return null;
  return { color, square };
}

/**
 * @param {{ colorArrows?: string[], colorFields?: string[] } | null | undefined} commentDiag
 * @returns {{ arrows: BoardArrow[], fields: BoardField[] }}
 */
export function drawablesFromCommentDiag(commentDiag) {
  const arrows = [];
  const fields = [];

  for (const raw of commentDiag?.colorArrows ?? []) {
    const a = parseColorArrow(raw);
    if (a) arrows.push(a);
  }
  for (const raw of commentDiag?.colorFields ?? []) {
    const f = parseColorField(raw);
    if (f) fields.push(f);
  }

  return { arrows, fields };
}

/**
 * @param {string} colorCode
 */
export function arrowStrokeColor(colorCode) {
  return PALETTE[colorCode]?.stroke ?? PALETTE.G.stroke;
}

/** @deprecated alias */
export function arrowColor(colorCode) {
  return arrowStrokeColor(colorCode);
}

/**
 * @param {string} colorCode
 */
export function fieldHighlightStyle(colorCode) {
  const p = PALETTE[colorCode] ?? PALETTE.G;
  if (p.field?.startsWith('rgba')) {
    return { backgroundColor: p.field, opacity: String(p.fieldOpacity ?? 1) };
  }
  return {
    backgroundColor: p.field ?? p.stroke,
    opacity: String(p.fieldOpacity ?? 0.4),
  };
}

/**
 * @param {BoardField[]} fields
 * @returns {BoardField[]}
 */
export function collapseFieldsByPriority(fields) {
  const bySq = new Map();
  for (const f of fields) {
    const prev = bySq.get(f.square);
    const pNew = FIELD_PRIORITY[f.color] ?? 0;
    const pOld = prev ? (FIELD_PRIORITY[prev.color] ?? 0) : -1;
    if (!prev || pNew > pOld) bySq.set(f.square, f);
  }
  return [...bySq.values()];
}

/**
 * @param {{ arrows?: BoardArrow[], fields?: BoardField[] }} drawables
 * @returns {string[]} codes présents (pour la légende)
 */
export function activePaletteCodes(drawables) {
  const codes = new Set();
  for (const f of drawables?.fields ?? []) codes.add(f.color);
  for (const a of drawables?.arrows ?? []) codes.add(a.color);
  return [...codes].sort((a, b) => (FIELD_PRIORITY[b] ?? 0) - (FIELD_PRIORITY[a] ?? 0));
}

export function isSquare(sq) {
  return /^[a-h][1-8]$/.test(sq);
}

/**
 * @param {string} square
 * @param {'white' | 'black'} orientation
 */
export function squareCenterPct(square, orientation = 'white') {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]);
  const row = orientation === 'white' ? 8 - rank : rank - 1;
  const col = file;
  return { x: (col + 0.5) * CELL, y: (row + 0.5) * CELL };
}

/**
 * Distance du centre d'une case jusqu'à son bord, selon une direction unitaire.
 * @param {number} ux
 * @param {number} uy
 */
function edgeDistance(ux, uy) {
  return HALF_CELL / Math.max(Math.abs(ux), Math.abs(uy), 1e-6);
}

/**
 * Segment flèche : centre de la case source → bord entrant de la case destination.
 * Bord-à-bord casse l'orientation du marqueur sur les coups adjacents (longueur nulle).
 * @param {string} from
 * @param {string} to
 * @param {'white' | 'black'} orientation
 */
export function arrowEndpoints(from, to, orientation = 'white') {
  const a = squareCenterPct(from, orientation);
  const b = squareCenterPct(to, orientation);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };

  const ux = dx / len;
  const uy = dy / len;
  const inset = edgeDistance(ux, uy);

  return {
    x1: a.x,
    y1: a.y,
    x2: b.x - ux * inset,
    y2: b.y - uy * inset,
  };
}

/**
 * Dessine les flèches dans un SVG (viewBox 0 0 100 100).
 * @param {SVGSVGElement} svg
 * @param {BoardArrow[]} arrows
 * @param {'white' | 'black'} orientation
 */
export function renderBoardArrows(svg, arrows, orientation = 'white') {
  const used = [...new Set(arrows.map((a) => a.color))];
  const defs = document.createElementNS(SVG_NS, 'defs');

  const HEAD_LEN = 6.5;
  const HEAD_HALF = 2.75;

  for (const code of used) {
    const fill = arrowStrokeColor(code);
    const marker = document.createElementNS(SVG_NS, 'marker');
    marker.setAttribute('id', `arrowhead-${code}`);
    marker.setAttribute('markerWidth', String(HEAD_LEN));
    marker.setAttribute('markerHeight', String(HEAD_HALF * 2));
    // ref à la base du triangle : la pointe dépasse vers l'avant, le trait s'arrête ici
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', String(HEAD_HALF));
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');

    const head = document.createElementNS(SVG_NS, 'path');
    head.setAttribute(
      'd',
      `M0,0 L${HEAD_LEN},${HEAD_HALF} L0,${HEAD_HALF * 2} Z`,
    );
    head.setAttribute('fill', fill);
    marker.appendChild(head);
    defs.appendChild(marker);
  }

  svg.appendChild(defs);

  for (const arrow of arrows) {
    const { x1, y1, x2, y2 } = arrowEndpoints(arrow.from, arrow.to, orientation);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;

    const ux = dx / len;
    const uy = dy / len;
    const headLen = Math.min(HEAD_LEN, len * 0.85);

    // Pointe au bord de la case (x2,y2) ; le trait s'arrête à la base du triangle
    const lineEndX = x2 - ux * headLen;
    const lineEndY = y2 - uy * headLen;

    const stroke = arrowStrokeColor(arrow.color);
    const width = arrow.color === 'M' ? '2.8' : '2.4';

    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(lineEndX));
    line.setAttribute('y2', String(lineEndY));
    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', width);
    line.setAttribute('stroke-linecap', 'round');
    if (arrow.color === 'Y') line.setAttribute('stroke-dasharray', '3.5 2.5');
    line.setAttribute('marker-end', `url(#arrowhead-${arrow.color})`);
    svg.appendChild(line);
  }
}
