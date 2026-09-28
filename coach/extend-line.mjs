/**
 * Prolongation d'une suite de Stockfish (docs/PLANS-ET-CONCEPTS.md, §6 bis, test d'horizon). À profondeur 16,
 * Stockfish arrête sa meilleure suite vers 17 demi-coups en médiane : trop court pour les plans lents. On le
 * relance depuis la dernière position de la suite, et on recolle, jusqu'à `plies` demi-coups.
 */

import { Chess } from 'chess.js';

/**
 * @param {import('./uci-engine.mjs').UciEngine} engine
 * @param {string} fen position de départ
 * @param {string[]} pv suite en notation UCI
 * @returns {Promise<string[]>} la suite prolongée (UCI), au plus `plies` demi-coups
 */
export async function extendPv(engine, fen, pv, { plies = 48, depth = 16, relaunch = 4 } = {}) {
  const c = new Chess(fen);
  const out = [];
  const play = (u) => { try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); out.push(u); return true; } catch { return false; } };
  for (const u of pv) if (out.length >= plies || !play(u)) break;
  for (let k = 0; k < relaunch && out.length < plies && !c.isGameOver(); k++) {
    const [l] = await engine.analyze(c.fen(), { depth, multipv: 1 });
    if (!l?.pv?.length) break;
    const before = out.length;
    for (const u of l.pv) if (out.length >= plies || !play(u)) break;
    if (out.length === before) break;
  }
  return out;
}
