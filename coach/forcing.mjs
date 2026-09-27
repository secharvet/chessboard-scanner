/**
 * Calcul des lignes FORCÉES, comme un joueur de club :
 * seuls les coups forçants sont envisagés (échecs, prises, promotions ; toutes les
 * réponses quand on est en échec) et chaque camp peut « s'arrêter » quand la suite
 * ne lui rapporte rien (évaluation statique = matériel).
 *
 * Ce n'est pas un moteur : pas de coups calmes, profondeur et nœuds bornés,
 * évaluation purement matérielle. Il répond à « si je force, qu'est-ce que ça donne ? ».
 */

import { Chess } from 'chess.js';
import { toFrenchSan } from './notation.mjs';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const MATE = 1000;

/** Matériel du point de vue du camp au trait. @param {Chess} c */
function material(c) {
  let s = 0;
  for (const row of c.board()) for (const p of row) if (p) s += (p.color === c.turn() ? 1 : -1) * VALUE[p.type];
  return s;
}

/**
 * @param {string} fen
 * @param {'w'|'b'} side  camp qui cherche à forcer (on le met au trait si besoin)
 * @param {{ maxPly?: number, maxNodes?: number, minGain?: number, max?: number }} [opts]
 * @returns {{ san: string, line: string, gain: number, mate: boolean }[]}  lignes forcées gagnantes
 */
export function forcingLines(fen, side, opts = {}) {
  const maxPly = opts.maxPly ?? 8;
  const maxNodes = opts.maxNodes ?? 40_000;
  const minGain = opts.minGain ?? 2;
  const parts = fen.split(' ');
  if (parts[1] !== side) {
    parts[1] = side;
    parts[3] = '-';
  }
  let chess;
  try {
    chess = new Chess(parts.join(' '));
  } catch {
    return [];
  }
  let nodes = 0;

  /** @returns {{ score: number, pv: string[] }} */
  const search = (ply, alpha, beta, checksAllowed) => {
    nodes++;
    if (chess.isCheckmate()) return { score: -MATE + ply, pv: [] };
    if (chess.isDraw()) return { score: 0, pv: [] };
    const inCheck = chess.inCheck();
    const stand = material(chess);
    if (!inCheck) {
      if (stand >= beta) return { score: stand, pv: [] };
      if (stand > alpha) alpha = stand;
    }
    if (ply >= maxPly || nodes > maxNodes) return { score: inCheck ? stand - 1 : stand, pv: [] };

    let moves = chess.moves({ verbose: true });
    if (!inCheck) {
      moves = moves.filter((m) => m.captured || m.promotion || (checksAllowed && /[+#]/.test(m.san)));
    }
    // Prises des pièces chères par les pièces peu chères d'abord, puis échecs.
    moves.sort((a, b) =>
      ((b.captured ? 10 * VALUE[b.captured] - VALUE[b.piece] : 0) + (/[+#]/.test(b.san) ? 5 : 0))
      - ((a.captured ? 10 * VALUE[a.captured] - VALUE[a.piece] : 0) + (/[+#]/.test(a.san) ? 5 : 0)));

    let best = { score: inCheck ? -MATE + ply : alpha, pv: [] };
    for (const m of moves) {
      chess.move(m.san);
      // Les échecs « gratuits » ne sont envisagés que dans les premiers coups (comme un humain).
      const child = search(ply + 1, -beta, -alpha, ply < 5);
      chess.undo();
      const score = -child.score;
      if (score > best.score) best = { score, pv: [m.san, ...child.pv] };
      if (score > alpha) alpha = score;
      if (alpha >= beta) break;
    }
    return best;
  };

  const base = material(chess);
  const results = [];
  for (const m of chess.moves({ verbose: true }).filter((x) => x.captured || x.promotion || /[+#]/.test(x.san))) {
    chess.move(m.san);
    const child = search(1, -MATE, MATE, true);
    chess.undo();
    const score = -child.score;
    const mate = score > MATE - 50;
    const gain = mate ? MATE : score - base;
    if (mate || gain >= minGain) {
      results.push({ san: toFrenchSan(m.san), line: [m.san, ...child.pv].map(toFrenchSan).join(' '), gain, mate });
    }
  }
  return results.sort((a, b) => b.gain - a.gain).slice(0, opts.max ?? 3);
}

/** Texte lisible d'une ligne forcée. @param {{ line: string, gain: number, mate: boolean }} l */
export function describeForcing(l) {
  return l.mate ? `${l.line} : mat` : `${l.line} : gain d'environ ${l.gain} point(s)`;
}
