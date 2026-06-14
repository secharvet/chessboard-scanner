/**
 * Module 2 — Pièces mineures et tours (paires de fous, bon/mauvais fou,
 * cavalier sur avant-poste, tour sur colonne ouverte).
 */

import { parseFenPieces } from './fen-board.js';
import { buildOpenFilesFacts } from './open-files.js';
import { buildOutpostFacts } from './outposts.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildMinorPiecesFacts(fen) {
  const { pieces } = parseFenPieces(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // Références croisées : avant-postes et colonnes
  const outposts = buildOutpostFacts(fen).filter((t) => t.id === 'AVANT_POSTE');
  const outpostSet = new Set(
    outposts.map((t) => /** @type {string} */ (t.params.square) + t.params.color),
  );

  const openFacts = buildOpenFilesFacts(fen);
  const openSet = new Set(
    openFacts.filter((t) => t.id === 'COLONNE_OUVERTE').map((t) => /** @type {string} */ (t.params.file)),
  );
  /** @type {Record<string, Set<string>>} */
  const semiOpenFor = {};
  for (const t of openFacts.filter((t) => t.id === 'COLONNE_SEMI_OUVERTE')) {
    const file = /** @type {string} */ (t.params.file);
    const color = /** @type {string} */ (t.params.color);
    (semiOpenFor[file] ??= new Set()).add(color);
  }

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const bishops = pieces.filter((p) => p.type === 'b' && p.color === color);
    const knights = pieces.filter((p) => p.type === 'n' && p.color === color);
    const rooks = pieces.filter((p) => p.type === 'r' && p.color === color);
    const pawns = pieces.filter((p) => p.type === 'p' && p.color === color);

    // PAIRE_FOUS
    if (bishops.length === 2) {
      out.push(token('PAIRE_FOUS', { color }));
    }

    // FOU_BON / FOU_MAUVAIS
    for (const b of bishops) {
      const complex = (b.fileIdx + b.rank) % 2;
      const blocked = pawns.filter((p) => (p.fileIdx + p.rank) % 2 === complex).length;
      out.push(token(blocked >= 2 ? 'FOU_MAUVAIS' : 'FOU_BON', { color, square: b.square }));
    }

    // CAVALIER_AVANT_POSTE
    for (const n of knights) {
      if (outpostSet.has(n.square + color)) {
        out.push(token('CAVALIER_AVANT_POSTE', { square: n.square, color }));
      }
    }

    // TOUR_COLONNE_OUVERTE
    for (const r of rooks) {
      if (openSet.has(r.file) || semiOpenFor[r.file]?.has(color)) {
        out.push(token('TOUR_COLONNE_OUVERTE', { square: r.square, color }));
      }
    }
  }

  return out;
}
