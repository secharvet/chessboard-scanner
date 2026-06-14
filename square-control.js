/**
 * Heatmap de contrôle des cases (attaquants chess.js par case).
 */

import { Chess } from '/vendor/chess.js';

const SQUARES = [];
for (const f of 'abcdefgh') {
  for (const r of '12345678') {
    SQUARES.push(`${f}${r}`);
  }
}

const HEAT_WHITE = [55, 140, 255];
const HEAT_BLACK = [255, 70, 85];

/**
 * @param {import('/vendor/chess.js').Chess | string} chessOrFen
 */
export function computeSquareControl(chessOrFen) {
  const chess =
    typeof chessOrFen === 'string' ? new Chess(chessOrFen) : chessOrFen;

  if (typeof chess.attackers !== 'function') {
    throw new Error(
      'chess.js trop ancien : méthode attackers() absente. Rebuild l\'image web (make build-web && make start).',
    );
  }

  let maxPressure = 0;
  const bySquare = {};

  for (const sq of SQUARES) {
    const white = chess.attackers(sq, 'w').length;
    const black = chess.attackers(sq, 'b').length;
    bySquare[sq] = { white, black };
    maxPressure = Math.max(maxPressure, white + black);
  }

  return { bySquare, maxPressure };
}

/**
 * @param {HTMLElement} cell
 * @param {{ white: number, black: number }} ctrl
 * @param {{ maxPressure: number }} meta
 */
export function appendHeatmapLayers(cell, ctrl, meta) {
  const pressure = ctrl.white + ctrl.black;
  if (pressure <= 0) return;

  const scale = Math.max(meta.maxPressure, 2);
  const strength = Math.min(0.92, 0.42 + (pressure / scale) * 0.5);

  let rgb;
  if (ctrl.black === 0) {
    rgb = HEAT_WHITE;
  } else if (ctrl.white === 0) {
    rgb = HEAT_BLACK;
  } else {
    const wR = ctrl.white / pressure;
    const bR = ctrl.black / pressure;
    rgb = [
      Math.round(HEAT_WHITE[0] * wR + HEAT_BLACK[0] * bR),
      Math.round(HEAT_WHITE[1] * wR + HEAT_BLACK[1] * bR),
      Math.round(HEAT_WHITE[2] * wR + HEAT_BLACK[2] * bR),
    ];
  }

  const title =
    ctrl.white > 0 && ctrl.black > 0
      ? `${ctrl.white} attaque(s) blanche(s), ${ctrl.black} noire(s) — case disputée`
      : ctrl.white > 0
        ? `${ctrl.white} attaque(s) blanche(s)`
        : `${ctrl.black} attaque(s) noire(s)`;

  const el = document.createElement('div');
  el.className = 'fen-board__heatmap';
  el.style.background = `radial-gradient(ellipse at center, rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, strength)}) 0%, rgba(${rgb[0]},${rgb[1]},${rgb[2]},${strength * 0.78}) 55%, rgba(${rgb[0]},${rgb[1]},${rgb[2]},${strength * 0.28}) 100%)`;
  el.title = title;
  cell.appendChild(el);
}
