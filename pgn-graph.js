/**
 * Graphe SVG type « git » des variantes PGN — vanilla JS.
 * @param {HTMLElement} container
 * @param {import('@jackstenglein/chess').Chess} chess
 * @param {{
 *   currentMove?: object | null,
 *   onPreview?: (move: object | null) => void,
 *   onPreviewEnd?: () => void,
 *   onSelect?: (move: object | null) => void,
 *   maxNodes?: number,
 * }} [opts]
 * @returns {{ setCurrent: (move: object | null) => void } | null}
 */

const PILL_H = 16;
const PILL_PAD_X = 6;
const PILL_MIN_W = 22;
const CHAR_W = 6.2;
const COL_GAP = 8;
const LANE_H = 38;
const PAD_X = 12;
const PAD_Y = 14 + PILL_H / 2;
const ZOOM_MIN = 0.35;
const ZOOM_MAX = 10;
const ZOOM_STEP = 1.12;
/**
 * Échelle cible à l'écran : pixels rendus par unité SVG (lisibilité des gélules).
 * Calibré pour ~3 px/u sur un graphe moyen — indépendant de la taille du SVG.
 */
const TARGET_PX_PER_SVG_UNIT = 3.2;
const FALLBACK_ZOOM = 2;

/** Repère du nœud « Début » (position initiale). */
export const GRAPH_START = { __graphStart: true };

/**
 * @param {string} san
 */
function pillLabel(san) {
  return san.length > 8 ? `${san.slice(0, 7)}…` : san;
}

/**
 * @param {string} san
 */
function pillWidth(san) {
  return Math.max(PILL_MIN_W, pillLabel(san).length * CHAR_W + PILL_PAD_X * 2);
}

/**
 * @param {import('@jackstenglein/chess').Chess} chess
 * @param {object} move
 */
function branchChildren(chess, move) {
  const kids = [];
  const next = chess.nextMove(move);
  if (next) kids.push({ move: next, kind: 'main' });

  for (const variation of next?.variations || []) {
    if (variation?.[0]) kids.push({ move: variation[0], kind: 'var' });
  }
  return kids;
}

/**
 * @param {import('@jackstenglein/chess').Chess} chess
 * @param {object} rootMove
 * @returns {{ moveCount: number, endPly: number }}
 */
function variationLinearExtent(chess, rootMove) {
  let moveCount = 0;
  let endPly = rootMove.ply ?? 0;
  let move = rootMove;
  while (move) {
    moveCount += 1;
    endPly = move.ply ?? endPly;
    move = chess.nextMove(move);
  }
  return { moveCount, endPly };
}

/**
 * @typedef {{ lane: number, forkPly: number, endPly: number }} LaneInterval
 */

/**
 * Plus petite lane libre sur [forkPly, endPly] (réutilise l'espace vertical libéré).
 * @param {LaneInterval[]} intervals
 * @param {number} forkPly
 * @param {number} endPly
 * @param {number} [minLane]
 */
function allocateLane(intervals, forkPly, endPly, minLane = 1) {
  for (let lane = minLane; ; lane += 1) {
    const blocked = intervals.some(
      (it) => it.lane === lane && !(it.endPly < forkPly || it.forkPly > endPly),
    );
    if (!blocked) return lane;
  }
}

/**
 * Variantes racine de la ligne principale — parcours depuis la fin,
 * lanes compactées si la variante est assez courte pour « rentrer » dans l'espace libre.
 * @param {import('@jackstenglein/chess').Chess} chess
 * @returns {{ laneByRoot: Map<object, number>, intervals: LaneInterval[] }}
 */
function assignMainLineVariationLanes(chess) {
  /** @type {{ rootMove: object, branchPly: number, varIndex: number }[]} */
  const roots = [];
  let move = chess.history()?.[0] ?? null;

  while (move) {
    const next = chess.nextMove(move);
    for (const [varIndex, variation] of (next?.variations ?? []).entries()) {
      if (variation?.[0]) {
        roots.push({ rootMove: variation[0], branchPly: move.ply ?? 0, varIndex });
      }
    }
    move = next;
  }

  roots.sort((a, b) => b.branchPly - a.branchPly || a.varIndex - b.varIndex);

  /** @type {LaneInterval[]} */
  const intervals = [];
  const laneByRoot = new Map();

  for (const root of roots) {
    const forkPly = root.rootMove.ply ?? root.branchPly;
    const { endPly } = variationLinearExtent(chess, root.rootMove);
    const lane = allocateLane(intervals, forkPly, endPly);
    intervals.push({ lane, forkPly, endPly });
    laneByRoot.set(root.rootMove, lane);
  }

  return { laneByRoot, intervals };
}

/**
 * @param {import('@jackstenglein/chess').Chess} chess
 * @param {number} maxNodes
 */
function buildGraphData(chess, maxNodes) {
  const { laneByRoot: mainLineLanes, intervals: laneIntervals } = assignMainLineVariationLanes(chess);

  /** @type {Map<object, { move: object, lane: number, depth: number, san: string, w: number, x: number, y: number }>} */
  const nodes = new Map();
  /** @type {{ parent: object, child: object, kind: string }[]} */
  const edges = [];
  let maxLane = 0;
  let maxDepth = 0;
  let truncated = false;

  /**
   * @param {object} move
   * @param {number} lane
   * @param {object | null} parent
   * @param {string} edgeKind
   */
  function visit(move, lane, parent, edgeKind = 'main') {
    if (!move || nodes.size >= maxNodes) {
      if (move && nodes.size >= maxNodes) truncated = true;
      return;
    }

    if (nodes.has(move)) {
      if (parent) edges.push({ parent, child: move, kind: 'back' });
      return;
    }

    const depth = move.ply ?? 0;
    const san = move.san || '?';
    maxLane = Math.max(maxLane, lane);
    maxDepth = Math.max(maxDepth, depth);

    nodes.set(move, {
      move,
      lane,
      depth,
      san,
      w: pillWidth(san),
      x: 0,
      y: PAD_Y + lane * LANE_H,
    });

    if (parent) edges.push({ parent, child: move, kind: edgeKind });

    const kids = branchChildren(chess, move);
    for (const kid of kids) {
      if (kid.kind === 'main') {
        visit(kid.move, lane, move, 'main');
      } else {
        let useLane = mainLineLanes.get(kid.move);
        if (useLane == null) {
          const forkPly = kid.move.ply ?? move.ply ?? 0;
          const { endPly } = variationLinearExtent(chess, kid.move);
          useLane = allocateLane(laneIntervals, forkPly, endPly, lane + 1);
          laneIntervals.push({ lane: useLane, forkPly, endPly });
        }
        visit(kid.move, useLane, move, 'var');
        maxLane = Math.max(maxLane, useLane);
      }
    }
  }

  const roots = chess.history();
  if (roots?.length) {
    for (const root of roots) visit(root, 0, null);
  }

  const nodeList = [...nodes.values()];
  const colWidths = new Array(maxDepth + 1).fill(PILL_MIN_W);
  for (const n of nodeList) {
    colWidths[n.depth] = Math.max(colWidths[n.depth], n.w);
  }

  const colStarts = [PAD_X];
  for (let d = 0; d <= maxDepth; d++) {
    const start = colStarts[d];
    const center = start + colWidths[d] / 2;
    for (const n of nodeList) {
      if (n.depth === d) n.x = center;
    }
    colStarts.push(start + colWidths[d] + COL_GAP);
  }

  let width = colStarts[colStarts.length - 1] + PAD_X;
  const height = PAD_Y * 2 + maxLane * LANE_H + PILL_H;

  if (roots?.length) {
    const startW = pillWidth('Début');
    const shift = startW + COL_GAP;
    for (const n of nodeList) n.x += shift;
    width += shift;

    const startNode = {
      move: GRAPH_START,
      lane: 0,
      depth: 0,
      san: 'Début',
      w: startW,
      x: PAD_X + startW / 2,
      y: PAD_Y,
      isStart: true,
    };
    nodeList.unshift(startNode);
    for (const root of roots) {
      edges.unshift({ parent: GRAPH_START, child: root, kind: 'main' });
    }
  }

  return {
    nodes: nodeList,
    edges,
    maxLane,
    maxDepth,
    truncated,
    width,
    height,
  };
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} w1
 * @param {number} x2
 * @param {number} y2
 * @param {number} w2
 */
function smoothEdgePath(x1, y1, w1, x2, y2, w2) {
  const right = x1 + w1 / 2;
  const left = x2 - w2 / 2;
  const gap = left - right;
  if (gap <= 0) return '';

  if (Math.abs(y2 - y1) < 0.5) {
    return `M ${right} ${y1} L ${left} ${y2}`;
  }

  const bend = Math.max(16, Math.min(44, gap * 0.4));
  const c1x = right + bend;
  const c2x = left - bend;
  return `M ${right} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${left} ${y2}`;
}

/**
 * @param {SVGElement} svg
 * @param {object | null} currentMove
 */
function applyCurrentClass(svg, currentMove) {
  for (const g of svg.querySelectorAll('.pgn-graph__node')) {
    const isCurrent = g.__isStart ? !currentMove : Boolean(currentMove && g.__move === currentMove);
    g.classList.toggle('pgn-graph__node--current', isCurrent);
  }
}

/**
 * @param {SVGElement} svg
 * @param {object | null | undefined} previewMove — undefined = pas d'aperçu
 * @param {object | null} [currentMove]
 */
function applyPreviewClass(svg, previewMove, currentMove) {
  for (const g of svg.querySelectorAll('.pgn-graph__node')) {
    const isCurrent = g.__isStart ? !currentMove : Boolean(currentMove && g.__move === currentMove);
    const isPreview =
      previewMove !== undefined &&
      !isCurrent &&
      (g.__isStart ? previewMove === null : Boolean(previewMove && g.__move === previewMove));
    g.classList.toggle('pgn-graph__node--preview', isPreview);
  }
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {{
 *   width: number,
 *   height: number,
 *   zoom: number,
 *   panX: number,
 *   panY: number,
 * }} viewport
 */
function viewSize(viewport) {
  return { vw: viewport.width / viewport.zoom, vh: viewport.height / viewport.zoom };
}

/**
 * @param {{
 *   width: number,
 *   height: number,
 *   zoom: number,
 *   panX: number,
 *   panY: number,
 * }} viewport
 */
function clampPan(viewport) {
  const { vw, vh } = viewSize(viewport);
  viewport.panX = clamp(viewport.panX, 0, Math.max(0, viewport.width - vw));
  viewport.panY = clamp(viewport.panY, 0, Math.max(0, viewport.height - vh));
}

/**
 * Zoom adaptatif : même échelle à l'écran quel que soit le graphe (petit ou immense).
 * @param {{
 *   width: number,
 *   height: number,
 * }} viewport
 * @param {HTMLElement} stageEl
 */
function computeAdaptiveZoom(viewport, stageEl) {
  const rect = stageEl.getBoundingClientRect();
  const sw = rect.width;
  const sh = rect.height;
  if (sw < 8 || sh < 8 || viewport.width <= 0 || viewport.height <= 0) {
    return FALLBACK_ZOOM;
  }
  const unitScale = Math.min(sw / viewport.width, sh / viewport.height);
  if (unitScale <= 0) return FALLBACK_ZOOM;
  return clamp(TARGET_PX_PER_SVG_UNIT / unitScale, ZOOM_MIN, ZOOM_MAX);
}

/**
 * @param {{
 *   width: number,
 *   height: number,
 *   zoom: number,
 *   panX: number,
 *   panY: number,
 * }} viewport
 * @param {HTMLElement} stageEl
 */
function screenPxPerSvgUnit(viewport, stageEl) {
  const { vw, vh } = viewSize(viewport);
  const rect = stageEl.getBoundingClientRect();
  if (vw <= 0 || vh <= 0 || rect.width <= 0 || rect.height <= 0) return 0;
  return Math.min(rect.width / vw, rect.height / vh);
}

/**
 * @param {{
 *   width: number,
 *   height: number,
 *   zoom: number,
 *   panX: number,
 *   panY: number,
 * }} viewport
 * @param {HTMLElement} stageEl
 * @param {number} baselineZoom
 * @param {HTMLElement | null} [zoomEl]
 */
function updateViewportLabel(viewport, stageEl, baselineZoom, zoomEl) {
  if (!zoomEl) return;
  const { vw, vh } = viewSize(viewport);
  const pxPerU = screenPxPerSvgUnit(viewport, stageEl);
  const pct = baselineZoom > 0 ? Math.round((viewport.zoom / baselineZoom) * 100) : 100;
  zoomEl.textContent = `${pct} % · ${Math.round(vw)}×${Math.round(vh)} u`;
  zoomEl.title =
    pxPerU > 0
      ? `Zone visible : ${Math.round(vw)}×${Math.round(vh)} unités SVG · ${pxPerU.toFixed(1)} px/u`
      : '';
}

/**
 * @param {{
 *   width: number,
 *   height: number,
 *   zoom: number,
 *   panX: number,
 *   panY: number,
 * }} viewport
 * @param {SVGElement} svg
 * @param {HTMLElement} stageEl
 * @param {number} baselineZoom
 * @param {HTMLElement | null} [zoomEl]
 */
function applyViewBox(viewport, svg, stageEl, baselineZoom, zoomEl) {
  const { vw, vh } = viewSize(viewport);
  clampPan(viewport);
  svg.setAttribute('viewBox', `${viewport.panX} ${viewport.panY} ${vw} ${vh}`);
  updateViewportLabel(viewport, stageEl, baselineZoom, zoomEl);
}

/**
 * Centrage initial uniquement (nœud Début ou coup courant).
 * @param {Map<object, { x: number, y: number }>} byMove
 * @param {{ width: number, height: number }} data
 * @param {{ panX: number, panY: number, zoom: number }} viewport
 * @param {object | null} move
 */
function centerOnMove(byMove, data, viewport, move) {
  const n = move ? byMove.get(move) : byMove.get(GRAPH_START);
  const { vw, vh } = viewSize(viewport);
  if (n) {
    viewport.panX = n.x - vw / 2;
    viewport.panY = n.y - vh / 2;
  } else {
    viewport.panX = (data.width - vw) / 2;
    viewport.panY = (data.height - vh) / 2;
  }
  clampPan(viewport);
}

const PAN_FRICTION = 0.966;
const PAN_MIN_SPEED = 0.006;
const PAN_DRAG_THRESHOLD = 4;
/** Réponse au flick (plus haut = départ plus vif). */
const PAN_INERTIA_GAIN = 3.2;
const PAN_MAX_VELOCITY = 1.15;

/**
 * Glisser-déposer avec inertie (pan horizontal + vertical, borné au graphe).
 * @param {HTMLElement} stage
 * @param {SVGElement} svg
 * @param {{ width: number, height: number, zoom: number, panX: number, panY: number }} viewport
 * @param {() => void} syncView
 * @returns {{ suppressHover: () => boolean, destroy: () => void }}
 */
function attachGraphPan(stage, svg, viewport, syncView) {
  let rafId = 0;
  let dragging = false;
  let suppressHoverFlag = false;
  let lastClientX = 0;
  let lastClientY = 0;
  let dragDist = 0;
  let velX = 0;
  let velY = 0;
  /** @type {{ t: number, panX: number, panY: number }[]} */
  let samples = [];

  const stopInertia = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const clientToSvgScale = () => {
    const rect = stage.getBoundingClientRect();
    const { vw, vh } = viewSize(viewport);
    return {
      sx: rect.width > 0 ? vw / rect.width : 1,
      sy: rect.height > 0 ? vh / rect.height : 1,
    };
  };

  const tick = (now) => {
    const dt = Math.min(32, now - (tick.prev ?? now));
    tick.prev = now;
    const decay = Math.pow(PAN_FRICTION, dt / 16);
    velX *= decay;
    velY *= decay;
    if (Math.hypot(velX, velY) < PAN_MIN_SPEED) {
      velX = 0;
      velY = 0;
      rafId = 0;
      return;
    }
    viewport.panX += velX * dt;
    viewport.panY += velY * dt;
    syncView();
    rafId = requestAnimationFrame(tick);
  };
  tick.prev = 0;

  const startInertia = () => {
    stopInertia();
    if (Math.hypot(velX, velY) < PAN_MIN_SPEED) return;
    rafId = requestAnimationFrame(tick);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest?.('.pgn-graph__node')) return;
    stopInertia();
    dragging = true;
    suppressHoverFlag = false;
    dragDist = 0;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    samples = [{ t: performance.now(), panX: viewport.panX, panY: viewport.panY }];
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('pgn-graph__stage--dragging');
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const { sx, sy } = clientToSvgScale();
    const dx = e.clientX - lastClientX;
    const dy = e.clientY - lastClientY;
    dragDist += Math.hypot(dx, dy);
    if (dragDist > PAN_DRAG_THRESHOLD) suppressHoverFlag = true;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    viewport.panX -= dx * sx;
    viewport.panY -= dy * sy;
    syncView();
    const now = performance.now();
    samples.push({ t: now, panX: viewport.panX, panY: viewport.panY });
    if (samples.length > 6) samples.shift();
  };

  const onPointerUp = (e) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('pgn-graph__stage--dragging');
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);

    const now = performance.now();
    const recent = samples.filter((s) => now - s.t < 120);
    const first = recent[0] ?? samples[0];
    const last = recent[recent.length - 1] ?? first;
    const dt = Math.max(16, last.t - first.t);
    velX = ((last.panX - first.panX) / dt) * PAN_INERTIA_GAIN;
    velY = ((last.panY - first.panY) / dt) * PAN_INERTIA_GAIN;
    const speed = Math.hypot(velX, velY);
    if (speed > PAN_MAX_VELOCITY) {
      velX = (velX / speed) * PAN_MAX_VELOCITY;
      velY = (velY / speed) * PAN_MAX_VELOCITY;
    }
    startInertia();

    setTimeout(() => {
      suppressHoverFlag = false;
    }, 80);
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);

  return {
    suppressHover: () => suppressHoverFlag,
    destroy: stopInertia,
  };
}

/**
 * @param {HTMLElement} container
 * @param {import('@jackstenglein/chess').Chess} chess
 * @param {{
 *   currentMove?: object | null,
 *   onPreview?: (move: object | null) => void,
 *   onPreviewEnd?: () => void,
 *   onSelect?: (move: object | null) => void,
 *   maxNodes?: number,
 * }} [opts]
 */
export function renderPgnGraph(container, chess, opts = {}) {
  const maxNodes = opts.maxNodes ?? 400;
  const data = buildGraphData(chess, maxNodes);

  container.innerHTML = '';
  if (!data.nodes.length) {
    container.innerHTML = '<div class="pgn-graph__empty">Aucun coup à afficher.</div>';
    return null;
  }

  const zoomEl =
    container.closest('.graph-strip')?.querySelector('[data-pgn-zoom]') ??
    document.getElementById('pgnGraphZoom');

  const stage = document.createElement('div');
  stage.className = 'pgn-graph__stage';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'pgn-graph__svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const byMove = new Map(data.nodes.map((n) => [n.move, n]));
  const viewport = {
    width: data.width,
    height: data.height,
    zoom: 1,
    panX: 0,
    panY: 0,
  };
  let userZoomed = false;
  let baselineZoom = FALLBACK_ZOOM;
  let panApi = null;
  /** @type {ResizeObserver | null} */
  let resizeObserver = null;

  const syncView = () => applyViewBox(viewport, svg, stage, baselineZoom, zoomEl);

  const applyAdaptiveZoom = () => {
    baselineZoom = computeAdaptiveZoom(viewport, stage);
    if (!userZoomed) viewport.zoom = baselineZoom;
  };

  const edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgesG.setAttribute('class', 'pgn-graph__edges');
  for (const e of data.edges) {
    const a = byMove.get(e.parent);
    const b = byMove.get(e.child);
    if (!a || !b) continue;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', `pgn-graph__edge pgn-graph__edge--${e.kind}`);
    path.setAttribute('d', smoothEdgePath(a.x, a.y, a.w, b.x, b.y, b.w));
    path.setAttribute('fill', 'none');
    edgesG.appendChild(path);
  }
  svg.appendChild(edgesG);

  const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesG.setAttribute('class', 'pgn-graph__nodes');
  for (const n of data.nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `pgn-graph__node${n.isStart ? ' pgn-graph__node--start' : ''}`);
    g.setAttribute('tabindex', '0');
    g.__move = n.move;
    g.__isStart = Boolean(n.isStart);
    g.__x = n.x;
    g.__y = n.y;

    const left = n.x - n.w / 2;
    const top = n.y - PILL_H / 2;

    const hit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hit.setAttribute('x', String(left - 2));
    hit.setAttribute('y', String(top - 2));
    hit.setAttribute('width', String(n.w + 4));
    hit.setAttribute('height', String(PILL_H + 4));
    hit.setAttribute('rx', String((PILL_H + 4) / 2));
    hit.setAttribute('class', 'pgn-graph__hit');

    const pill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pill.setAttribute('x', String(left));
    pill.setAttribute('y', String(top));
    pill.setAttribute('width', String(n.w));
    pill.setAttribute('height', String(PILL_H));
    pill.setAttribute('rx', String(PILL_H / 2));
    pill.setAttribute('class', 'pgn-graph__pill');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(n.x));
    label.setAttribute('y', String(n.y));
    label.setAttribute('class', 'pgn-graph__label');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.textContent = pillLabel(n.san);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = n.san;

    g.appendChild(hit);
    g.appendChild(pill);
    g.appendChild(label);
    g.appendChild(title);

    const previewMove = () => (n.isStart ? null : n.move);

    const onEnter = () => {
      if (panApi?.suppressHover()) return;
      opts.onPreview?.(previewMove());
    };
    const onLeave = (e) => {
      if (panApi?.suppressHover()) return;
      const related = /** @type {Node | null} */ (e.relatedTarget);
      if (related?.closest?.('.pgn-graph__node')) return;
      opts.onPreviewEnd?.();
    };
    const onSelect = (e) => {
      if (panApi?.suppressHover()) return;
      e.stopPropagation();
      opts.onSelect?.(previewMove());
    };

    g.addEventListener('mouseenter', onEnter);
    g.addEventListener('mouseleave', onLeave);
    g.addEventListener('focus', onEnter);
    g.addEventListener('blur', onLeave);
    g.addEventListener('click', onSelect);
    g.addEventListener('pointerdown', (e) => e.stopPropagation());

    nodesG.appendChild(g);
  }
  svg.appendChild(nodesG);
  stage.appendChild(svg);
  container.appendChild(stage);

  const onWheel = (e) => {
    e.preventDefault();
    userZoomed = true;
    const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    viewport.zoom = clamp(viewport.zoom * factor, ZOOM_MIN, ZOOM_MAX);
    syncView();
  };
  stage.addEventListener('wheel', onWheel, { passive: false });
  let currentMove = opts.currentMove ?? null;
  panApi = attachGraphPan(stage, svg, viewport, syncView);

  const initViewport = () => {
    applyAdaptiveZoom();
    centerOnMove(byMove, data, viewport, opts.currentMove ?? null);
    syncView();
  };

  requestAnimationFrame(() => requestAnimationFrame(initViewport));

  resizeObserver = new ResizeObserver(() => {
    const prevBaseline = baselineZoom;
    applyAdaptiveZoom();
    if (!userZoomed) {
      centerOnMove(byMove, data, viewport, currentMove);
    } else if (prevBaseline > 0) {
      viewport.zoom = clamp(
        viewport.zoom * (baselineZoom / prevBaseline),
        ZOOM_MIN,
        ZOOM_MAX,
      );
    }
    syncView();
  });
  resizeObserver.observe(stage);
  applyCurrentClass(svg, currentMove);
  applyPreviewClass(svg, undefined, currentMove);

  if (data.truncated) {
    const note = document.createElement('div');
    note.className = 'pgn-graph__trunc';
    note.textContent = `Graphe tronqué (${maxNodes} nœuds max).`;
    container.appendChild(note);
  }

  let previewMove = undefined;

  return {
    setCurrent(move) {
      currentMove = move;
      applyCurrentClass(svg, move);
      applyPreviewClass(svg, previewMove, move);
    },
    setPreview(move) {
      previewMove = move;
      applyPreviewClass(svg, move, currentMove);
    },
    setZoom(zoom) {
      userZoomed = true;
      viewport.zoom = clamp(zoom, ZOOM_MIN, ZOOM_MAX);
      clampPan(viewport);
      syncView();
    },
    destroy() {
      resizeObserver?.disconnect();
      panApi?.destroy();
    },
  };
}
