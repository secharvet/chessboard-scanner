/**
 * Concepts de plan (docs/PLANS-ET-CONCEPTS.md) : états buts vérifiables, par camp, et leur apparition
 * le long d'une suite de coups. Partagé par le générateur d'étiquettes et les planches de contrôle.
 */

import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';

// ── Concepts (états buts vérifiables, par camp) ──
// Chaque détecteur reçoit les faits d'une position et renvoie les couleurs pour lesquelles le concept est vrai.
const has = (facts, id, color) => facts.some((t) => t.id === id && t.params.color === color);
const WEAK_PAWN = new Set(['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE']);
export const CONCEPTS = {
  tour_colonne: (facts, color) => has(facts, 'TOUR_COLONNE_OUVERTE', color),
  cavalier_avant_poste: (facts, color) => has(facts, 'CAVALIER_AVANT_POSTE', color),
  // Blocage : un cavalier ou un fou installé juste devant un pion adverse isolé, arriéré, faible ou passé.
  blocage: (facts, color, board) => facts.some((t) => {
    if (!WEAK_PAWN.has(t.id) || t.params.color === color || typeof t.params.square !== 'string') return false;
    const sq = t.params.square;
    const front = `${sq[0]}${Number(sq[1]) + (t.params.color === 'w' ? 1 : -1)}`;
    const p = board.get(front);
    return Boolean(p && p.color === color && (p.type === 'n' || p.type === 'b'));
  }),
};
export const COLORS = ['w', 'b'];

/** Colonnes ouvertes ou semi-ouvertes POUR `color`. */
const openFiles = (facts, color) => new Set(facts
  .filter((t) => t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === color))
  .map((t) => String(t.params.file)));

/**
 * Le coup `m` (joué par `color`) réalise-t-il DÉLIBÉRÉMENT le concept ? Un plan s'exécute par un coup
 * calme de la pièce concernée : une colonne qui s'ouvre sous une tour immobile, ou un blocage né d'une
 * série d'échanges, ne sont pas des plans (relecture des planches, septembre 2026).
 */
const AGENT = {
  tour_colonne: (m, snap, color) => m.piece === 'r' && snap.facts.some((t) => t.id === 'TOUR_COLONNE_OUVERTE' && t.params.color === color && t.params.square === m.to),
  cavalier_avant_poste: (m, snap, color) => m.piece === 'n' && snap.facts.some((t) => t.id === 'CAVALIER_AVANT_POSTE' && t.params.color === color && t.params.square === m.to),
  blocage: (m, snap, color) => (m.piece === 'n' || m.piece === 'b') && snap.facts.some((t) => {
    if (!WEAK_PAWN.has(t.id) || t.params.color === color || typeof t.params.square !== 'string') return false;
    return `${t.params.square[0]}${Number(t.params.square[1]) + (t.params.color === 'w' ? 1 : -1)}` === m.to;
  }),
};

/**
 * Déroule une suite et renvoie, pour chaque concept et chaque camp, le demi-coup d'apparition (ou -1).
 * Apparition = absent au départ, réalisé par un coup CALME et DÉLIBÉRÉ du camp (voir AGENT), et encore
 * vrai à la fin de la suite.
 * Rupture de pions : une POUSSÉE de pion du camp (pas une prise) qui attaque un pion adverse (levier),
 * suivie d'une nouvelle colonne ouverte ou semi-ouverte pour ce camp qui transforme la position (tour du
 * camp dessus à la fin, ou faiblesse adverse ou pion passé nouveaux). Attribuée au seul camp qui pousse.
 */
export function scanLine(fen, pv, PLIES = 24) {
  const c = new Chess(fen);
  const start = { facts: buildAllFacts(fen), board: new Chess(fen) };
  const timeline = [];
  const moves = [];
  const levers = { w: [], b: [] };
  for (const [i, u] of pv.slice(0, PLIES).entries()) {
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    moves.push(m);
    if (m.piece === 'p' && !m.captured) {
      const dir = m.color === 'w' ? 1 : -1;
      const f = m.to.charCodeAt(0);
      const attacks = [-1, 1].some((d) => {
        const p = c.get(`${String.fromCharCode(f + d)}${Number(m.to[1]) + dir}`);
        return p && p.type === 'p' && p.color !== m.color;
      });
      if (attacks) levers[m.color].push(i);
    }
    timeline.push({ facts: buildAllFacts(c.fen()), board: new Chess(c.fen()) });
  }
  const out = {};
  if (!timeline.length) return out;
  const end = timeline.at(-1);
  for (const [name, test] of Object.entries(CONCEPTS)) {
    for (const color of COLORS) {
      let ply = -1;
      const ok = (snap) => test(snap.facts, color, snap.board);
      if (!ok(start) && ok(end)) {
        ply = timeline.findIndex((snap, i) => moves[i].color === color && !moves[i].captured && AGENT[name](moves[i], snap, color));
      }
      out[`${name}_${color}`] = ply;
    }
  }
  for (const color of COLORS) {
    const before = openFiles(start.facts, color);
    const after = openFiles(end.facts, color);
    const fresh = [...after].filter((f) => !before.has(f));
    let ply = -1;
    if (fresh.length && levers[color].length) {
      const opened = timeline.findIndex((snap) => [...openFiles(snap.facts, color)].some((x) => fresh.includes(x)));
      const opp = color === 'w' ? 'b' : 'w';
      const rookUses = end.board.board().flat().some((p) => p && p.type === 'r' && p.color === color && fresh.includes(p.square[0]));
      const key = (t) => `${t.id}|${t.params.color}|${String(t.params.square ?? '')[0]}`;
      const had = new Set(start.facts.map(key));
      const structural = end.facts.some((t) => !had.has(key(t))
        && ((['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE'].includes(t.id) && t.params.color === opp)
          || (t.id === 'PION_PASSE' && t.params.color === color)));
      // Le levier doit venir du camp ET précéder l'ouverture ; l'autre camp, qui la subit, n'est pas crédité.
      const firstLever = Math.min(levers[color][0] ?? Infinity, Infinity);
      const oppLever = levers[opp][0] ?? Infinity;
      if (firstLever <= opened && firstLever < oppLever && (rookUses || structural)) ply = opened;
    }
    out[`rupture_${color}`] = ply;
  }

  // Affaiblir la structure adverse (plan à étages : MOYEN → DÉSÉQUILIBRE) : une faiblesse nouvelle
  // apparaît chez l'adversaire dans la suite calme et y reste. Moyen : « échange » (le camp prend une
  // pièce, l'adversaire reprend avec un pion) ou « poussée » (levier de pion du camp). On note aussi si
  // l'adversaire pouvait encore roquer du côté affaibli (« avant le roque » : on lui enlève son abri).
  const weakKey = (t) => (t.id === 'DOUBLON' ? `D|${t.params.color}|${t.params.file}`
    : t.id === 'PION_ISOLE' || t.id === 'PION_ARRIERE' ? `${t.id}|${t.params.color}|${t.params.square[0]}`
      : t.id === 'PIONS_ROI_AFFAIBLI' ? `K|${t.params.color}` : null);
  const castling = fen.split(' ')[2] ?? '-';
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const had = new Set(start.facts.filter((t) => t.params.color === opp).map(weakKey).filter(Boolean));
    const atEnd = new Set(end.facts.filter((t) => t.params.color === opp).map(weakKey).filter(Boolean));
    let ply = -1;
    let means = null;
    let wing = null;
    for (let i = 0; i < timeline.length && ply < 0; i++) {
      const fresh = timeline[i].facts.filter((t) => t.params.color === opp).map((t) => [weakKey(t), t])
        .filter(([k]) => k && !had.has(k) && atEnd.has(k));
      if (!fresh.length) continue;
      const m = moves[i];
      const prev = moves[i - 1];
      if (m.color === opp && m.piece === 'p' && m.captured && m.captured !== 'p' && prev?.color === color && prev.captured) means = 'echange';
      else if (levers[color].some((l) => l <= i)) means = 'poussee';
      else continue; // faiblesse sans moyen identifiable du camp : pas un plan de ce type
      ply = i;
      const t = fresh[0][1];
      const file = t.params.file ?? t.params.square?.[0] ?? String(t.params.files ?? '')[0];
      wing = file && 'efgh'.includes(file) ? 'roi' : file ? 'dame' : null;
    }
    out[`affaiblir_${color}`] = ply;
    out[`affaiblir_moyen_${color}`] = means;
    // L'adversaire pouvait-il encore roquer de ce côté au départ ?
    const rights = opp === 'w' ? { roi: 'K', dame: 'Q' } : { roi: 'k', dame: 'q' };
    out[`affaiblir_avant_roque_${color}`] = ply >= 0 && wing ? castling.includes(rights[wing]) : false;
  }
  return out;
}
