/**
 * Déséquilibres stratégiques (au sens de Silman) — perception seulement, pas de théorie :
 *
 *   COMPLEXE_FAIBLE      cases d'une couleur affaiblies chez un camp qui n'a plus le fou de cette couleur
 *   CONTROLE_COLONNE     tours/dames qui tiennent une colonne ouverte ou semi-ouverte
 *   CASE_ENTREE          case d'invasion sur une colonne contrôlée (6e/7e rangée adverse)
 *   TOUR_7E              tour ou dame sur la 7e rangée
 *   ACTIVITE             nettement plus de mobilité pour un camp
 *   PIECE_PASSIVE        pièce mineure presque sans cases
 *   CONTROLE_CENTRE      contrôle des cases centrales d4 d5 e4 e5
 *   CENTRE               ouvert / fermé / mobile
 *   FOU_CONTRE_CAVALIER  déséquilibre de pièces mineures
 *   DEVELOPPEMENT        avance de développement
 */

import { buildAttackMap, FILES, relRank, squareColor, sq, other } from './attack-map.js';
import { canPawnsEverAttack, parseFenPawns } from './fen-board.js';
import { detectPhase } from './phase.js';
import { token } from './tokens.js';

const MINOR_START = { w: ['b1', 'g1', 'c1', 'f1'], b: ['b8', 'g8', 'c8', 'f8'] };

/**
 * Mobilité d'une pièce sur un échiquier réduit aux pions (+ elle-même).
 * @param {string} fen @param {import('./fen-board.js').Piece} piece
 */
function pawnOnlyMobility(fen, piece) {
  const rows = [];
  for (let r = 8; r >= 1; r--) {
    let row = '';
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const s = sq(f, r);
      const ch = s === piece.square
        ? (piece.color === 'w' ? piece.type.toUpperCase() : piece.type)
        : pawnAt(fen, s);
      if (ch) {
        if (empty) row += empty;
        row += ch;
        empty = 0;
      } else empty++;
    }
    rows.push(row + (empty || ''));
  }
  const reduced = buildAttackMap(`${rows.join('/')} w - - 0 1`);
  const self = reduced.at[piece.square];
  return reduced.mobility(self);
}

/** @param {string} fen @param {string} s */
function pawnAt(fen, s) {
  const { pawns } = parseFenPawns(fen);
  const p = pawns.find((q) => q.square === s);
  return p ? (p.color === 'w' ? 'P' : 'p') : '';
}

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildImbalanceFacts(fen) {
  const map = buildAttackMap(fen);
  const { pieces, at, attackersOf, mobility } = map;
  const { pawns } = parseFenPawns(fen);
  const phase = detectPhase(fen);
  const fullmove = Number(fen.split(' ')[5] ?? 1) || 1;
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];
  const of = (color, type) => pieces.filter((p) => p.color === color && p.type === type);

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const opp = other(color);
    const myPawns = pawns.filter((p) => p.color === color);

    // ── Complexes de couleur ──
    // Cases de mon camp (rangées 2-4) ou autour de mon roi qu'aucun de mes pions ne couvrira plus,
    // et que l'adversaire attaque déjà ou pourra occuper.
    const king = pieces.find((p) => p.type === 'k' && p.color === color);
    const candidates = new Set();
    for (let f = 0; f < 8; f++) {
      for (const rr of [3, 4]) candidates.add(sq(f, color === 'w' ? rr : 9 - rr));
    }
    if (king && relRank(king.rank, color) <= 2) {
      for (let df = -1; df <= 1; df++) {
        for (const dr of [1, 2]) {
          const f = king.fileIdx + df;
          const r = king.rank + (color === 'w' ? dr : -dr);
          if (f >= 0 && f < 8 && r >= 1 && r <= 8) candidates.add(sq(f, r));
        }
      }
    }
    const holes = [...candidates].filter((s) => {
      const pos = { fileIdx: FILES.indexOf(s[0]), rank: Number(s[1]) };
      if (canPawnsEverAttack(pos, myPawns, color)) return false;
      if (at[s]?.color === color && at[s].type === 'p') return false;
      // Il faut qu'un pion voisin soit passé devant (vrai trou), ou que la case soit près du roi.
      const nearKing = king && Math.abs(king.fileIdx - pos.fileIdx) <= 1 && Math.abs(king.rank - pos.rank) <= 2;
      const passed = myPawns.some(
        (p) => Math.abs(p.fileIdx - pos.fileIdx) === 1 && (color === 'w' ? p.rank >= pos.rank : p.rank <= pos.rank),
      );
      return (passed || nearKing) && attackersOf(s, opp).length > 0;
    });
    for (const shade of /** @type {const} */ (['claires', 'noires'])) {
      const squares = holes.filter((s) => squareColor(s) === shade);
      const myBishop = of(color, 'b').some((b) => squareColor(b.square) === shade);
      if (squares.length >= 2 && !myBishop) {
        const enemyBishop = of(opp, 'b').some((b) => squareColor(b.square) === shade);
        out.push(token('COMPLEXE_FAIBLE', { color, shade, squares: squares.sort().join(','), enemyBishop }));
      }
    }

    // ── Colonnes : contrôle, cases d'entrée ──
    for (let f = 0; f < 8; f++) {
      const file = FILES[f];
      const myPawnOnFile = myPawns.some((p) => p.fileIdx === f);
      if (myPawnOnFile) continue; // colonne ni ouverte ni semi-ouverte pour moi
      const heavy = (c) =>
        pieces.filter((p) => p.color === c && p.fileIdx === f && (p.type === 'r' || p.type === 'q')).length;
      const mine = heavy(color);
      const theirs = pawns.some((p) => p.color === opp && p.fileIdx === f) ? 0 : heavy(opp);
      if (mine === 0 || mine <= theirs) continue;
      out.push(token('CONTROLE_COLONNE', { file, color, doubled: mine >= 2 }));

      // Case d'entrée : 6e/7e rangée adverse sur cette colonne, libre de mes pièces, pas prenable par un pion.
      // Inutile si une de mes pièces lourdes y est déjà entrée.
      const alreadyIn = pieces.some(
        (p) => p.color === color && p.fileIdx === f && (p.type === 'r' || p.type === 'q') && relRank(p.rank, color) >= 6,
      );
      for (const rr of alreadyIn ? [] : [7, 6]) {
        const r = color === 'w' ? rr : 9 - rr;
        const s = sq(f, r);
        if (at[s]) continue; // case occupée (par un pion adverse notamment) : ce n'est pas une case d'entrée
        const heavyOnFile = pieces.filter((p) => p.color === color && p.fileIdx === f && (p.type === 'r' || p.type === 'q'));
        const reachable = heavyOnFile.some((h) => {
          const step = r > h.rank ? 1 : -1;
          for (let rr = h.rank + step; rr !== r; rr += step) if (at[sq(f, rr)]) return false;
          return true;
        });
        if (!reachable) continue;
        const pawnGuard = attackersOf(s, opp).some((p) => p.type === 'p');
        if (!pawnGuard) {
          out.push(token('CASE_ENTREE', { square: s, color, file }));
          break;
        }
      }
    }

    // ── Tour (ou dame) en 7e ──
    for (const p of pieces) {
      if (p.color !== color || (p.type !== 'r' && p.type !== 'q') || relRank(p.rank, color) !== 7) continue;
      const enemyKing8 = pieces.some((k) => k.type === 'k' && k.color === opp && relRank(k.rank, color) === 8);
      const pawns7 = pawns.some((q) => q.color === opp && relRank(q.rank, color) === 7);
      if (enemyKing8 || pawns7) out.push(token('TOUR_7E', { square: p.square, color, type: p.type }));
    }

    // ── Pièces passives ──
    if (phase !== 'ouverture') {
      for (const p of pieces) {
        if (p.color !== color || (p.type !== 'n' && p.type !== 'b')) continue;
        if (MINOR_START[color].includes(p.square)) continue;
        // Passivité structurelle : on ne compte que la gêne des pions (les pièces bougent, les pions restent).
        if (pawnOnlyMobility(fen, p) <= 2) out.push(token('PIECE_PASSIVE', { square: p.square, color, type: p.type }));
      }
    }
  }

  // ── Activité globale (mobilité des pièces hors roi et pions) ──
  const totalMobility = (c) =>
    pieces
      .filter((p) => p.color === c && !['k', 'p'].includes(p.type))
      .reduce((a, p) => a + (p.type === 'q' ? mobility(p) / 2 : mobility(p)), 0);
  const mw = totalMobility('w');
  const mb = totalMobility('b');
  if (mw - mb >= 8 && mw >= 1.3 * mb) out.push(token('ACTIVITE', { color: 'w', mine: Math.round(mw), theirs: Math.round(mb) }));
  else if (mb - mw >= 8 && mb >= 1.3 * mw) out.push(token('ACTIVITE', { color: 'b', mine: Math.round(mb), theirs: Math.round(mw) }));

  // ── Contrôle du centre ──
  const center = ['d4', 'd5', 'e4', 'e5'];
  const control = (c) =>
    center.reduce((a, s) => a + attackersOf(s, c).length + (at[s]?.color === c && at[s].type === 'p' ? 1 : 0), 0);
  const cw = control('w');
  const cb = control('b');
  if (cw - cb >= 3) out.push(token('CONTROLE_CENTRE', { color: 'w' }));
  else if (cb - cw >= 3) out.push(token('CONTROLE_CENTRE', { color: 'b' }));

  // ── Type de centre ──
  const blocked = pawns.filter(
    (p) => p.color === 'w' && p.fileIdx >= 2 && p.fileIdx <= 5
      && pawns.some((q) => q.color === 'b' && q.fileIdx === p.fileIdx && q.rank === p.rank + 1),
  ).length;
  const centralPawns = pawns.filter((p) => p.fileIdx === 3 || p.fileIdx === 4).length;
  if (blocked >= 2) out.push(token('CENTRE', { type: 'fermé' }));
  else if (centralPawns <= 1) out.push(token('CENTRE', { type: 'ouvert' }));

  // ── Fou contre cavalier ──
  const minors = (c) => ({ b: of(c, 'b').length, n: of(c, 'n').length });
  const w = minors('w');
  const b = minors('b');
  if (w.b > b.b && b.n > w.n) out.push(token('FOU_CONTRE_CAVALIER', { bishop: 'w', knight: 'b' }));
  else if (b.b > w.b && w.n > b.n) out.push(token('FOU_CONTRE_CAVALIER', { bishop: 'b', knight: 'w' }));

  // ── Avance de développement ──
  if (phase !== 'finale' && fullmove <= 20) {
    const developed = (c) => {
      const minorsOut = pieces.filter(
        (p) => p.color === c && (p.type === 'n' || p.type === 'b') && !MINOR_START[c].includes(p.square),
      ).length;
      const k = pieces.find((p) => p.type === 'k' && p.color === c);
      const castled = k && (k.fileIdx >= 6 || k.fileIdx <= 2) ? 1 : 0;
      return minorsOut + castled;
    };
    const dw = developed('w');
    const db = developed('b');
    if (dw - db >= 2) out.push(token('DEVELOPPEMENT', { color: 'w', lead: dw - db }));
    else if (db - dw >= 2) out.push(token('DEVELOPPEMENT', { color: 'b', lead: db - dw }));
  }

  return out;
}
