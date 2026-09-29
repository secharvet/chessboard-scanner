/**
 * Atomes des plans (docs/PLANS-ET-CONCEPTS.md, §3 bis) : les MOYENS, opérations relevées le long d'une suite de
 * coups (jouée ou calculée). Un plan nommé est une recette « moyen → déséquilibre → exploitation » ; les moyens
 * sont ce vocabulaire-là, petit et partagé :
 *   echange      prise puis reprise de valeur égale (types des pièces échangées)
 *   levier       poussée de pion qui attaque un pion adverse
 *   espace       poussée de pion dans le camp adverse (5e rangée et au-delà) qui n'attaque rien et qui TIENT
 *   manoeuvre    une pièce (pas un pion, pas le roi) fait au moins deux coups calmes pour s'installer sur une case
 *                où elle TIENT ; on note la case d'arrivée
 *   doublement   deux tours du camp sur la même colonne (ou la même rangée), et ça tient
 *   septieme     une tour du camp atteint la 7e rangée (vue du camp) et y tient
 *   roque        petit ou grand
 *   marche_roi   en finale (pas de dame), le roi fait au moins deux pas vers le centre ou vers les pions adverses
 *   sacrifice    le camp perd un pion (ou plus) à un point calme, sans le récupérer dans la fenêtre
 * Chaque atome : { kind, side, ply, ...details }. Les atomes servent aux recettes (coach/plan-concepts.mjs) et à
 * l'émergence (scripts/emergence.mjs).
 */

import { Chess } from 'chess.js';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const HOLD_ATOM = 6;
const fileOf = (sq) => sq.charCodeAt(0) - 97;
const rankOf = (sq) => Number(sq[1]);
const relRank = (sq, side) => (side === 'w' ? rankOf(sq) : 9 - rankOf(sq));
const material = (c) => c.board().flat().reduce((s, p) => s + (p ? (p.color === 'w' ? 1 : -1) * VALUE[p.type] : 0), 0);

/**
 * @param {string} fen
 * @param {string[]} pv coups UCI
 * @param {number} [plies]
 * @returns {{ atoms: object[], moves: import('chess.js').Move[], boards: Chess[] }}
 */
export function detectAtoms(fen, pv, plies = 48) {
  const c = new Chess(fen);
  const start = new Chess(fen);
  const moves = [];
  const boards = []; // position APRÈS chaque demi-coup
  const mats = [];
  for (const u of pv.slice(0, plies)) {
    try { moves.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
    boards.push(new Chess(c.fen()));
    mats.push(material(c));
  }
  const atoms = [];
  const n = moves.length;
  /** La pièce `type` de `side` est-elle encore sur `sq` de i à i + HOLD (ou la fin) ? */
  const stays = (i, sq, type, side) => boards.slice(i, i + HOLD_ATOM + 1).every((b) => { const p = b.get(sq); return p && p.type === type && p.color === side; });
  const quietAt = (i) => i === n - 1 || !moves[i + 1].captured;
  const startMat = material(start);
  const endgame = !/[Qq]/.test(fen.split(' ')[0]);

  // Échanges : prise (i) puis reprise (i+1) sur la même case, valeurs égales.
  for (let i = 0; i + 1 < n; i++) {
    const a = moves[i];
    const b = moves[i + 1];
    if (a.captured && b.captured && b.to === a.to && VALUE[a.captured] === VALUE[b.captured] && !atoms.some((x) => x.kind === 'echange' && x.ply === i - 1)) {
      // Attribué au camp qui prend en premier ; « gives » : ce que ce camp a cédé, « takes » : ce qu'il a pris.
      atoms.push({ kind: 'echange', side: a.color, ply: i, takes: a.captured, gives: b.captured, square: a.to });
    }
  }

  // Poussées de pions : levier ou gain d'espace.
  for (let i = 0; i < n; i++) {
    const m = moves[i];
    if (m.piece !== 'p' || m.captured) continue;
    const dir = m.color === 'w' ? 1 : -1;
    const b = boards[i];
    const attacks = [-1, 1].some((d) => { const p = b.get(`${String.fromCharCode(m.to.charCodeAt(0) + d)}${rankOf(m.to) + dir}`); return p && p.type === 'p' && p.color !== m.color; });
    if (attacks) atoms.push({ kind: 'levier', side: m.color, ply: i, square: m.to, file: m.to[0] });
    else if (relRank(m.to, m.color) >= 5 && stays(i, m.to, 'p', m.color)) atoms.push({ kind: 'espace', side: m.color, ply: i, square: m.to, file: m.to[0] });
  }

  // Manœuvres : une même pièce fait ≥ 2 coups calmes (pas de prise) et s'installe ; suivi par identité de case.
  const tracks = new Map(); // clé : side|type|case courante -> { from0, steps }
  for (let i = 0; i < n; i++) {
    const m = moves[i];
    if (m.piece === 'p' || m.piece === 'k') continue;
    const key = `${m.color}|${m.piece}|${m.from}`;
    const t = tracks.get(key);
    tracks.delete(key);
    if (m.captured) continue; // une prise interrompt la manœuvre (c'est de la tactique)
    const steps = (t?.steps ?? 0) + 1;
    const from0 = t?.from0 ?? m.from;
    tracks.set(`${m.color}|${m.piece}|${m.to}`, { from0, steps });
    if (steps >= 2 && stays(i, m.to, m.piece, m.color)) {
      atoms.push({ kind: 'manoeuvre', side: m.color, ply: i, piece: m.piece, from: from0, to: m.to, steps });
      tracks.delete(`${m.color}|${m.piece}|${m.to}`);
    }
  }

  // Tours : doublement (même colonne ou même rangée) et 7e rangée, par un coup de tour du camp.
  for (let i = 0; i < n; i++) {
    const m = moves[i];
    if (m.piece !== 'r' || m.captured) continue;
    const b = boards[i];
    const rooks = b.board().flat().filter((p) => p && p.type === 'r' && p.color === m.color).map((p) => p.square);
    const other = rooks.find((sq) => sq !== m.to && (sq[0] === m.to[0] || sq[1] === m.to[1]));
    if (other && stays(i, m.to, 'r', m.color)) atoms.push({ kind: 'doublement', side: m.color, ply: i, squares: [m.to, other], axis: other[0] === m.to[0] ? 'colonne' : 'rangee' });
    if (relRank(m.to, m.color) === 7 && stays(i, m.to, 'r', m.color)) atoms.push({ kind: 'septieme', side: m.color, ply: i, square: m.to });
  }

  // Roque, marche du roi (finale).
  const kingSteps = { w: 0, b: 0 };
  for (let i = 0; i < n; i++) {
    const m = moves[i];
    if (m.san.startsWith('O-O')) { atoms.push({ kind: 'roque', side: m.color, ply: i, long: m.san === 'O-O-O' }); continue; }
    if (m.piece !== 'k' || !endgame) continue;
    const toward = Math.abs(fileOf(m.to) - 3.5) + Math.abs(rankOf(m.to) - 4.5) < Math.abs(fileOf(m.from) - 3.5) + Math.abs(rankOf(m.from) - 4.5)
      || relRank(m.to, m.color) > relRank(m.from, m.color);
    kingSteps[m.color] = toward ? kingSteps[m.color] + 1 : 0;
    if (kingSteps[m.color] === 2) atoms.push({ kind: 'marche_roi', side: m.color, ply: i, to: m.to });
  }

  // Sacrifice : à un point calme, le camp a perdu au moins un pion de matériel par rapport au départ, et ne l'a
  // pas récupéré à la fin de la fenêtre (les échanges équilibrés ne changent pas le solde).
  for (const side of ['w', 'b']) {
    const sign = side === 'w' ? 1 : -1;
    const i = mats.findIndex((mat, k) => quietAt(k) && sign * (mat - startMat) <= -1);
    if (i >= 0 && sign * (mats[n - 1] - startMat) <= -1 && !boards[i].isCheck()) {
      atoms.push({ kind: 'sacrifice', side, ply: i, pawns: -sign * (mats[i] - startMat) });
    }
  }

  atoms.sort((a, b) => a.ply - b.ply);
  return { atoms, moves, boards };
}
