/**
 * Module 2 — Pièces mineures et tours (paires de fous, bon/mauvais fou,
 * cavalier sur avant-poste, tour sur colonne ouverte).
 */

import { parseFenPieces } from './fen-board.js';
import { buildOpenFilesFacts } from './open-files.js';
import { buildOutpostFacts } from './outposts.js';
import { squareColor } from './attack-map.js';
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
  const outposts = buildOutpostFacts(fen).filter((t) => t.id === 'AVANT_POSTE' || t.id === 'AVANT_POSTE_POSSIBLE');
  const outpostInfo = new Map(outposts.map((t) => [/** @type {string} */ (t.params.square) + t.params.color, t.params]));
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

    // FOU_BON / FOU_MAUVAIS : un fou est mauvais quand ses propres pions centraux (c-f) sont
    // FIXÉS (bloqués par un pion adverse) sur sa couleur. Pions mobiles → aucun jugement.
    const enemyPawns = pieces.filter((p) => p.type === 'p' && p.color !== color);
    const dr = color === 'w' ? 1 : -1;
    const fixed = pawns.filter(
      (p) => p.fileIdx >= 2 && p.fileIdx <= 5
        && enemyPawns.some((e) => e.fileIdx === p.fileIdx && e.rank === p.rank + dr),
    );
    for (const b of bishops) {
      const complex = (b.fileIdx + b.rank) % 2;
      const same = fixed.filter((p) => (p.fileIdx + p.rank) % 2 === complex).length;
      const other = fixed.length - same;
      if (same >= 2 && same > other) out.push(token('FOU_MAUVAIS', { color, square: b.square }));
      else if (other >= 2 && same === 0) out.push(token('FOU_BON', { color, square: b.square }));
    }

    // CAVALIER_AVANT_POSTE. « echangeable » (Nimzowitsch) : l'adversaire garde une pièce mineure capable de
    // l'échanger, un fou de la couleur de la case ou un cavalier ; l'avant-poste vaut alors beaucoup moins.
    const enemyMinors = pieces.filter((p) => p.color !== color && (p.type === 'n' || p.type === 'b'));
    for (const n of knights) {
      if (outpostSet.has(n.square + color)) {
        const info0 = outpostInfo.get(n.square + color) ?? {};
        // Sur la bande (colonnes a et h), un soutien seulement possible ne suffit pas : il faut un pion qui soutient
        // déjà (décision de l'auteur du 4 octobre : Ca4 « ne fait rien », le vrai avant-poste était c5).
        if ((n.file === 'a' || n.file === 'h') && !info0.soutenu) continue;
        const shade = squareColor(n.square);
        const echangeable = enemyMinors.some((p) => p.type === 'n' || squareColor(p.square) === shade);
        const info = outpostInfo.get(n.square + color) ?? {};
        out.push(token('CAVALIER_AVANT_POSTE', { square: n.square, color, echangeable, rangee: info.rangee, colonne: info.colonne, soutenu: info.soutenu }));
      }
    }

    // TOUR_COLONNE_OUVERTE
    // `ouverte` : aucun pion (sinon semi-ouverte pour moi) ; `disputee` : une tour adverse tient déjà la colonne
    // (vérité de terrain du 1er octobre : « une colonne semi-ouverte défendue par la tour e8 n'est pas conquise »).
    const enemyRooks = pieces.filter((p) => p.type === 'r' && p.color !== color);
    // `degagee` : la tour voit sa colonne vers le camp adverse, jusqu'au premier pion, sans pièce à elle devant (tour
    // ou dame à elle ne bouchent pas : batterie). Décision de l'auteur du 4 octobre : « Tg8 derrière son fou g7 ne voit
    // aucune case de la colonne ».
    const dirR = color === 'w' ? 1 : -1;
    const sees = (r) => {
      for (let rk = r.rank + dirR; rk >= 1 && rk <= 8; rk += dirR) {
        const q = pieces.find((p) => p.fileIdx === r.fileIdx && p.rank === rk);
        if (!q) continue;
        if (q.type === 'p') return true;
        if (q.color === color && q.type !== 'r' && q.type !== 'q') return false;
      }
      return true;
    };
    for (const r of rooks) {
      if (openSet.has(r.file) || semiOpenFor[r.file]?.has(color)) {
        out.push(token('TOUR_COLONNE_OUVERTE', { square: r.square, color, ouverte: openSet.has(r.file), disputee: enemyRooks.some((e) => e.file === r.file), degagee: sees(r) }));
      }
    }
  }

  return out;
}
