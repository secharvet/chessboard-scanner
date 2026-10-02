/**
 * Module 1.3 — Avant-postes et pions faibles.
 */

import {
  FILES,
  canPawnsEverAttack,
  parseFenPawns,
  pawnAttackTargets,
  pawnsOfColor,
} from './fen-board.js';
import { buildPawnStructureFacts } from './pawn-structure.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildOutpostFacts(fen) {
  const { pawns } = parseFenPawns(fen);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // ── 1. Avant-postes ──
  const emitted = /** @type {Set<string>} */ (new Set());

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const allies = pawnsOfColor(pawns, color);
    const enemies = pawnsOfColor(pawns, color === 'w' ? 'b' : 'w');
    // Camp adverse, 4e rangée comprise (un cavalier en d4 soutenu par e3, sans pion noir c ni e, est un avant-poste).
    const minRank = color === 'w' ? 4 : 1;
    const maxRank = color === 'w' ? 8 : 5;

    // Cases candidates : celles qu'un pion à moi soutient déjà (soutenu = true) et celles qu'un pion à moi
    // pourra venir soutenir plus tard (soutenu = false : le pion est derrière sur une colonne voisine et rien ne
    // le bloque jusqu'à la case de soutien). Vérité de terrain du 1er octobre : l'auteur accepte l'avant-poste
    // dont le soutien reste à jouer (f2-f4 derrière un cavalier en e5), pas celui qu'un pion adverse peut chasser.
    /** @type {Map<string, { fileIdx: number, rank: number, soutenu: boolean }>} */
    const candidates = new Map();
    const dir = color === 'w' ? 1 : -1;
    for (const p of allies) {
      for (const t of pawnAttackTargets(p.color, p.fileIdx, p.rank)) {
        if (t.rank < minRank || t.rank > maxRank) continue;
        candidates.set(FILES[t.fileIdx] + t.rank, { ...t, soutenu: true });
      }
      for (const df of [-1, 1]) {
        const fileIdx = p.fileIdx + df;
        if (fileIdx < 0 || fileIdx > 7) continue;
        // Soutien à venir : seulement sur les 4e, 5e et 6e rangées vues du camp. Au-delà, toute case est « hors
        // d'atteinte des pions adverses » par construction (un pion n'attaque pas en arrière) et le fait polluait
        // la fiche (« avant-poste en c8 », banc du 2 octobre).
        const farRank = color === 'w' ? 6 : 3;
        for (let rank = p.rank + 2 * dir; rank >= 1 && rank <= 8 && (dir > 0 ? rank <= farRank : rank >= farRank); rank += dir) {
          // Le pion doit pouvoir avancer jusqu'à la case juste derrière (rank - dir) : aucun pion sur son chemin.
          const blocked = pawns.some((q) => q.fileIdx === p.fileIdx && (dir > 0 ? q.rank > p.rank && q.rank <= rank - dir : q.rank < p.rank && q.rank >= rank - dir));
          if (blocked) break;
          if (rank < minRank || rank > maxRank) continue;
          const key = FILES[fileIdx] + rank;
          if (!candidates.has(key)) candidates.set(key, { fileIdx, rank, soutenu: false });
        }
      }
    }

    for (const [sq, t] of candidates) {
      if (emitted.has(sq + color)) continue;

      // Un avant-poste ne peut jamais être chassé par un pion adverse.
      if (!canPawnsEverAttack(t, enemies, color === 'w' ? 'b' : 'w')) {
        emitted.add(sq + color);
        // Rangée vue du camp (4 = la sienne, 5 et plus = camp adverse) et état de la colonne (Nimzowitsch :
        // l'avant-poste sur la colonne ouverte est une base d'attaque).
        const rangee = color === 'w' ? t.rank : 9 - t.rank;
        const ownOnFile = allies.some((p) => p.fileIdx === t.fileIdx);
        const enemyOnFile = enemies.some((p) => p.fileIdx === t.fileIdx);
        const colonne = !ownOnFile && !enemyOnFile ? 'ouverte' : !ownOnFile ? 'semi-ouverte' : 'fermee';
        out.push(token('AVANT_POSTE', { square: sq, color, rangee, colonne, soutenu: t.soutenu }));
      }
    }
  }

  // ── 2. Pions faibles (isolé + arrière) ──
  const allFacts = buildPawnStructureFacts(fen);
  const isolated = new Set(
    allFacts.filter((t) => t.id === 'PION_ISOLE').map((t) => /** @type {string} */ (t.params.square)),
  );
  const backward = new Set(
    allFacts.filter((t) => t.id === 'PION_ARRIERE').map((t) => /** @type {string} */ (t.params.square)),
  );

  for (const sq of isolated) {
    if (backward.has(sq)) {
      const pawn = pawns.find((p) => p.square === sq);
      if (pawn) {
        out.push(token('PION_FAIBLE', { square: sq, color: pawn.color }));
      }
    }
  }

  return out;
}
