/**
 * Module — Disponibilités (docs/PLANS-ET-CONCEPTS.md, §9, sonde « échiquier seul »).
 *
 * La sonde a montré que trois moyens n'existaient chez nous que comme ÉVÉNEMENTS le long d'une suite,
 * jamais comme FAITS « disponibles maintenant » sur l'échiquier. Ce module les code. Pseudo-légal comme
 * le reste (clouages et échecs ignorés) : on décrit la géométrie, Stockfish juge.
 *
 *   LEVIER_DISPONIBLE {color, pawn, square, cible}   une poussée légale d'un pion (case(s) libre(s)) qui
 *     attaquerait un pion adverse depuis la case d'arrivée, sans s'y faire prendre gratuitement
 *     (case d'arrivée non attaquée, ou défendue au moins une fois).
 *   ROUTE_CAVALIER {color, from, to, moves, but}     un cavalier atteint en 1 ou 2 bonds SÛRS une case
 *     d'avant-poste à soi (`but: 'avant_poste'`) ou la case de blocage devant un pion adverse isolé,
 *     arriéré, faible ou passé (`but: 'blocage'`). Sécurité d'une case : aucun pion adverse ne l'attaque,
 *     et si une pièce adverse l'attaque, la moins chère vaut au moins un cavalier et la case est défendue.
 *     (Mêmes règles que les itinéraires de coach/maneuvers.mjs, restatées ici : positional/ est du code
 *     navigateur et ne peut pas importer coach/.)
 *   ECHANGE_ABIMANT {color, from, cible, degat}      une prise sans perte de matériel (valeur prise ≥ valeur
 *     de la pièce qui prend) dont la SEULE reprise possible est un pion, et dont chaque reprise possible
 *     crée un dégât durable : pions doublés (`degat: 'double'`), pion isolé (`'isole'`), ou un pion de
 *     l'abri du roi quitte sa colonne (`'abri'`, prioritaire dans le libellé).
 */

import { buildAttackMap, FILES, VALUE, other, relRank, sq } from './attack-map.js';
import { pawnAttackTargets } from './fen-board.js';
import { buildPawnStructureFacts } from './pawn-structure.js';
import { buildOutpostFacts } from './outposts.js';
import { token } from './tokens.js';

const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildAvailabilityFacts(fen) {
  const map = buildAttackMap(fen);
  const pawnFacts = [...buildPawnStructureFacts(fen), ...buildOutpostFacts(fen)];
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];
  for (const color of /** @type {const} */ (['w', 'b'])) {
    leverAvailable(map, color, out);
    knightRoutes(map, pawnFacts, color, out);
    damagingExchange(map, color, out);
  }
  return out;
}

/** ── 1. Levier disponible ── */
function leverAvailable(map, color, out) {
  const opp = other(color);
  const dr = color === 'w' ? 1 : -1;
  const start = color === 'w' ? 2 : 7;
  for (const p of map.pieces) {
    if (p.type !== 'p' || p.color !== color) continue;
    const dests = [];
    if (!map.at[sq(p.fileIdx, p.rank + dr)]) {
      dests.push(p.rank + dr);
      if (p.rank === start && !map.at[sq(p.fileIdx, p.rank + 2 * dr)]) dests.push(p.rank + 2 * dr);
    }
    for (const r of dests) {
      const dest = sq(p.fileIdx, r);
      const targets = pawnAttackTargets(color, p.fileIdx, r)
        .map((t) => sq(t.fileIdx, t.rank))
        .filter((s) => map.at[s]?.type === 'p' && map.at[s].color === opp);
      if (!targets.length) continue;
      // Pas gratuite : personne ne l'attaque, ou au moins un défenseur (le pion poussé n'attaque jamais sa case).
      const free = map.attackersOf(dest, opp).length > 0 && map.attackersOf(dest, color).length === 0;
      if (!free) out.push(token('LEVIER_DISPONIBLE', { color, pawn: p.square, square: dest, cible: targets.join(',') }));
    }
  }
}

/** ── 2. Route de cavalier vers un avant-poste ou une case de blocage ── */
function knightRoutes(map, pawnFacts, color, out) {
  const opp = other(color);
  /** @type {Map<string, string>} case → but */
  const targets = new Map();
  for (const f of pawnFacts) {
    if (f.id === 'AVANT_POSTE' && f.params.color === color) targets.set(String(f.params.square), 'avant_poste');
    if (['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE', 'PION_PASSE_PROTEGE'].includes(f.id) && f.params.color === opp) {
      const w = String(f.params.square);
      const front = sq(FILES.indexOf(w[0]), Number(w[1]) + (opp === 'w' ? 1 : -1));
      if (!targets.has(front)) targets.set(front, 'blocage');
    }
  }
  if (!targets.size) return;
  // Sécurité (coach/maneuvers.mjs) : pas de pion adverse ; sinon moins cher ≥ cavalier et case défendue.
  const safe = (s) => {
    const enemies = map.attackersOf(s, opp);
    if (enemies.some((e) => e.type === 'p')) return false;
    if (!enemies.length) return true;
    return Math.min(...enemies.map((e) => VALUE[e.type])) >= VALUE.n && map.attackersOf(s, color).length > 0;
  };
  const hops = (s) => {
    const f0 = FILES.indexOf(s[0]);
    const r0 = Number(s[1]);
    return KNIGHT.map(([df, dr]) => [f0 + df, r0 + dr])
      .filter(([f, r]) => f >= 0 && f < 8 && r >= 1 && r <= 8)
      .map(([f, r]) => sq(f, r));
  };
  for (const piece of map.pieces) {
    if (piece.type !== 'n' || piece.color !== color) continue;
    const seen = new Set([piece.square]);
    let frontier = [piece.square];
    for (let depth = 1; depth <= 2 && frontier.length; depth++) {
      const next = [];
      for (const from of frontier) {
        for (const to of hops(from)) {
          if (seen.has(to) || map.at[to] || !safe(to)) continue;
          seen.add(to);
          next.push(to);
          if (targets.has(to)) {
            out.push(token('ROUTE_CAVALIER', { color, from: piece.square, to, moves: depth, but: targets.get(to) }));
            targets.delete(to); // une route par cible : la plus courte, le parcours est en largeur
          }
        }
      }
      frontier = next;
    }
  }
}

/** ── 3. Échange abîmant disponible ── */
function damagingExchange(map, color, out) {
  const opp = other(color);
  const oppPawns = map.pieces.filter((p) => p.type === 'p' && p.color === opp);
  const king = map.pieces.find((p) => p.type === 'k' && p.color === opp);
  for (const attacker of map.pieces) {
    if (attacker.color !== color || attacker.type === 'k') continue;
    for (const s of map.attacks.get(attacker)) {
      const prey = map.at[s];
      if (!prey || prey.color !== opp || prey.type === 'k') continue;
      if (VALUE[prey.type] < VALUE[attacker.type]) continue; // pas de sacrifice : échange égal ou gagnant
      const defenders = map.attackersOf(s, opp);
      if (!defenders.length || defenders.some((d) => d.type !== 'p')) continue; // la seule reprise est un pion
      const degats = defenders.map((d) => recaptureDamage(d, prey, s, oppPawns, king, opp));
      if (degats.every(Boolean)) {
        // L'adversaire choisit sa reprise : on annonce le dégât le moins grave garanti (abri > doublé > isolé).
        const degat = ['isole', 'double', 'abri'].find((g) => degats.includes(g)) ?? degats[0];
        out.push(token('ECHANGE_ABIMANT', { color, from: attacker.square, cible: s, degat }));
      }
    }
  }
}

/** Dégât créé si le pion `d` reprend en `s` (la pièce `prey` disparaît) : 'abri', 'double', 'isole' ou null. */
function recaptureDamage(d, prey, s, oppPawns, king, opp) {
  const before = oppPawns.filter((p) => p !== (prey.type === 'p' ? prey : null));
  const after = before.filter((p) => p !== d).concat([{ fileIdx: FILES.indexOf(s[0]), rank: Number(s[1]) }]);
  // Abri : roi d'aile (roqué ou réfugié), pas un roi resté au centre dont tout pion serait « l'abri ».
  const wingKing = king && (king.fileIdx <= 2 || king.fileIdx >= 5) && relRank(king.rank, opp) <= 2;
  if (wingKing && Math.abs(d.fileIdx - king.fileIdx) <= 1 && relRank(d.rank, opp) <= 3) return 'abri';
  if (doubledCount(after) > doubledCount(before)) return 'double';
  if (isolatedCount(after) > isolatedCount(before)) return 'isole';
  return null;
}

/** Nombre de pions en surnombre sur leur colonne (doublés, triplés…). */
function doubledCount(pawns) {
  const perFile = new Array(8).fill(0);
  for (const p of pawns) perFile[p.fileIdx]++;
  return perFile.reduce((n, c) => n + Math.max(0, c - 1), 0);
}

/** Nombre de pions sans pion ami sur une colonne voisine. */
function isolatedCount(pawns) {
  return pawns.filter((p) => !pawns.some((q) => q !== p && Math.abs(q.fileIdx - p.fileIdx) === 1)).length;
}
