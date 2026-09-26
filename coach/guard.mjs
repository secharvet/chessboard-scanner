/**
 * Garde-fou : repère les coups cités par le LLM qui ne figurent pas dans l'analyse fournie.
 */

import { Chess } from 'chess.js';
import { toFrenchSan } from './notation.mjs';

// Coups de pièce (Cd5, Fxe6, Tfd1…), prises de pion (exd5) et roques.
// Notation longue (Cb1-d2, e2-e4, Fc4xf7) : vérifiée par case de départ et d'arrivée.
const LONG_RE = /(?<![\w-])([RDTFC]?)([a-h][1-8])[-x]([a-h][1-8])(?![\w])/g;
const MOVE_RE = /(?<![\w-])(O-O(?:-O)?|[RDTFC][a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?|[a-h]x[a-h][1-8](?:=[DTFC])?)[+#]?(?![\w])/g;

/** @param {string} s */
const norm = (s) => s.replace(/[+#!?]/g, '');

/**
 * @param {string} advice
 * @param {{ fen: string, candidates: { pvSan: string, pvUci?: string[] }[], threat: { line: string, pvUci?: string[] } | null }} data
 * @returns {string[]} coups cités mais absents du contexte
 */
export function findUngroundedMoves(advice, data) {
  const allowed = new Set();
  const addLine = (line) => {
    for (const tok of line.split(/\s+/)) if (!/^\d+\.+$/.test(tok)) allowed.add(norm(tok));
  };
  for (const c of data.candidates ?? []) addLine(c.pvSan);
  if (data.threat) addLine(data.threat.line);
  // Un coup légal immédiat cité sans être dans les lignes reste toléré (ex. « évite Dxb7 »).
  for (const m of new Chess(data.fen).moves()) allowed.add(norm(toFrenchSan(m)));

  // Coups en notation longue : autorisés si un coup légal ou une ligne fournie relie ces deux cases.
  const fromTo = new Set();
  for (const m of new Chess(data.fen).moves({ verbose: true })) fromTo.add(m.from + m.to);
  for (const c of data.candidates ?? []) for (const u of c.pvUci ?? []) fromTo.add(u.slice(0, 4));
  for (const u of data.threat?.pvUci ?? []) fromTo.add(u.slice(0, 4));

  const bad = [];
  let text = advice;
  for (const m of advice.matchAll(LONG_RE)) {
    // Un plan sur plusieurs coups (Cb1-d2 puis d3-d4) reste acceptable s'il part d'une pièce existante.
    const piece = new Chess(data.fen).get(m[2]);
    if (!fromTo.has(m[2] + m[3]) && !piece) bad.push(m[0]);
    text = text.replace(m[0], ' ');
  }
  // « Fc5 », « Tf1 » : désignation d'une pièce existante sur sa case, pas un coup.
  const board = new Chess(data.fen);
  const FR_TYPE = { R: 'k', D: 'q', T: 'r', F: 'b', C: 'n' };
  const isPieceRef = (tok) => {
    const m = tok.match(/^([RDTFC])([a-h][1-8])$/);
    return Boolean(m && board.get(m[2])?.type === FR_TYPE[m[1]]);
  };
  const cited = [...text.matchAll(MOVE_RE)].map((m) => norm(m[1])).filter((m) => !isPieceRef(m));
  return [...new Set([...bad, ...cited.filter((m) => !allowed.has(m))])];
}
