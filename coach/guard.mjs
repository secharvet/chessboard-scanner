/**
 * Garde-fou : repère les coups cités par le LLM qui ne figurent pas dans l'analyse fournie.
 */

import { Chess } from 'chess.js';
import { factLang } from '../positional/lang.js';
import { toFrenchSan } from './notation.mjs';

// Coups de pièce (Cd5, Fxe6, Tfd1…), prises de pion (exd5) et roques — lettres de la langue des faits.
// Notation longue (Cb1-d2, e2-e4, Fc4xf7) : vérifiée par case de départ et d'arrivée.
const LETTERS = {
  fr: { pieces: 'RDTFC', promo: 'DTFC', type: { R: 'k', D: 'q', T: 'r', F: 'b', C: 'n' } },
  en: { pieces: 'KQRBN', promo: 'QRBN', type: { K: 'k', Q: 'q', R: 'r', B: 'b', N: 'n' } },
};
const patterns = () => {
  const L = LETTERS[factLang()];
  return {
    L,
    LONG_RE: new RegExp(`(?<![\\w-])([${L.pieces}]?)([a-h][1-8])[-x]([a-h][1-8])(?![\\w])`, 'g'),
    MOVE_RE: new RegExp(`(?<![\\w-])(O-O(?:-O)?|[${L.pieces}][a-h]?[1-8]?x?[a-h][1-8](?:=[${L.promo}])?|[a-h]x[a-h][1-8](?:=[${L.promo}])?)[+#]?(?![\\w])`, 'g'),
  };
};

/** @param {string} s */
const norm = (s) => s.replace(/[+#!?]/g, '');

/**
 * @param {string} advice
 * @param {{ fen: string, candidates: { pvSan: string, pvUci?: string[] }[], threat: { line: string, pvUci?: string[] } | null }} data
 * @returns {string[]} coups cités mais absents du contexte
 */
export function findUngroundedMoves(advice, data) {
  const { L, LONG_RE, MOVE_RE } = patterns();
  const allowed = new Set();
  const addLine = (line) => {
    for (const tok of line.split(/\s+/)) if (!/^\d+\.+$/.test(tok)) allowed.add(norm(tok));
  };
  for (const c of data.candidates ?? []) addLine(c.pvSan);
  if (data.threat) addLine(data.threat.line);
  // Idées de l'adversaire (menaces en préparation) : coups préparatoires et menaces citables.
  for (const t of data.prepared ?? []) {
    for (const p of t.preps ?? [t.prep]) if (p) allowed.add(norm(p));
    if (t.threat) allowed.add(norm(t.threat));
  }
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
  const isPieceRef = (tok) => {
    const m = tok.match(new RegExp(`^([${L.pieces}])([a-h][1-8])$`));
    return Boolean(m && board.get(m[2])?.type === L.type[m[1]]);
  };
  const cited = [...text.matchAll(MOVE_RE)].map((m) => norm(m[1])).filter((m) => !isPieceRef(m));
  return [...new Set([...bad, ...cited.filter((m) => !allowed.has(m))])];
}
