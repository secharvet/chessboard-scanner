/**
 * Manœuvres : itinéraires sûrs (2 à 4 coups) d'une pièce vers une case stratégique,
 * comme « mon cavalier va en d5 par d2-f1-e3 ».
 *
 * Cibles (issues du moteur de règles, jamais codées en dur) :
 *   cavaliers, fous → avant-postes à moi, trous et cases faibles adverses ;
 *   tours           → colonnes ouvertes/semi-ouvertes à moi, cases d'entrée, 7e rangée.
 * Le reste de l'échiquier est supposé immobile (c'est un plan, pas un calcul).
 */

import { buildAttackMap, FILES, VALUE, relRank, sq } from '../positional/attack-map.js';
import { buildAllFacts } from '../positional/index.js';

const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const STRAIGHT = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const LETTER = { n: 'C', b: 'F', r: 'T' };
const NAME = { n: 'cavalier', b: 'fou', r: 'tour' };

/**
 * @param {string} fen
 * @param {'w'|'b'} side
 * @param {{ maxMoves?: number, max?: number }} [opts]
 * @returns {{ piece: string, from: string, to: string, path: string[], moves: number, why: string, text: string }[]}
 */
export function findManeuvers(fen, side, opts = {}) {
  const maxMoves = opts.maxMoves ?? 4;
  const map = buildAttackMap(fen);
  const facts = buildAllFacts(fen);
  const opp = side === 'w' ? 'b' : 'w';

  // ── Cibles ──
  /** @type {Map<string, string>} case → raison */
  const minorTargets = new Map();
  /** @type {Map<string, string>} */
  const rookTargets = new Map();
  for (const f of facts) {
    const p = f.params;
    if (f.id === 'AVANT_POSTE' && p.color === side) minorTargets.set(String(p.square), 'avant-poste');
    if (f.id === 'CASE_FAIBLE' && p.color === opp) minorTargets.set(String(p.square), 'case faible adverse');
    if (f.id === 'COMPLEXE_FAIBLE' && p.color === opp) {
      for (const s of String(p.squares).split(',')) if (!minorTargets.has(s)) minorTargets.set(s, `trou du complexe de cases ${p.shade}`);
    }
    if (f.id === 'CASE_ENTREE' && p.color === side) rookTargets.set(String(p.square), "case d'entrée");
    const openForMe = f.id === 'COLONNE_OUVERTE' || (f.id === 'COLONNE_SEMI_OUVERTE' && p.color === side);
    if (openForMe) {
      const fi = FILES.indexOf(String(p.file));
      for (const rr of [1, 2]) {
        const s = sq(fi, side === 'w' ? rr : 9 - rr);
        if (!map.at[s] && !rookTargets.has(s)) rookTargets.set(s, `colonne ${p.file} ${f.id === 'COLONNE_OUVERTE' ? 'ouverte' : 'semi-ouverte'}`);
      }
    }
  }
  // Case de blocage devant un pion isolé ou passé adverse (le bloqueur de Nimzowitsch).
  for (const f of facts) {
    if (!['PION_ISOLE', 'PION_PASSE', 'PION_PASSE_PROTEGE', 'PION_FAIBLE'].includes(f.id) || f.params.color !== opp) continue;
    const w = String(f.params.square);
    const front = sq(FILES.indexOf(w[0]), Number(w[1]) + (opp === 'w' ? 1 : -1));
    if (!map.at[front] || map.at[front].color === side) minorTargets.set(front, `case de blocage devant le pion ${f.id.startsWith('PION_PASSE') ? 'passé' : 'isolé'} en ${w}`);
  }

  // Pions faibles adverses : cases d'où un cavalier les attaque, colonne du pion pour les tours.
  for (const f of facts) {
    if (!['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE'].includes(f.id) || f.params.color !== opp) continue;
    const w = String(f.params.square);
    const wf = FILES.indexOf(w[0]);
    const wr = Number(w[1]);
    for (const [df, dr] of KNIGHT) {
      const t = sq(wf + df, wr + dr);
      if (wf + df >= 0 && wf + df < 8 && wr + dr >= 1 && wr + dr <= 8 && !minorTargets.has(t)) {
        minorTargets.set(t, `attaque le pion faible en ${w}`);
      }
    }
    const mine = map.pieces.some((p) => p.type === 'p' && p.color === side && p.fileIdx === wf);
    if (!mine) {
      for (let r = 1; r <= 8; r++) {
        const t = sq(wf, r);
        const between = side === 'w' ? r < wr : r > wr;
        if (between && !map.at[t] && !rookTargets.has(t)) rookTargets.set(t, `pression sur le pion faible en ${w}`);
      }
    }
  }

  for (let f = 0; f < 8; f++) {
    const s = sq(f, side === 'w' ? 7 : 2);
    if (!map.at[s] && !rookTargets.has(s)) rookTargets.set(s, '7e rangée');
  }

  // ── Sécurité d'une case pour une pièce de valeur v ──
  const safe = (s, v) => {
    const enemies = map.attackersOf(s, opp);
    if (enemies.some((e) => e.type === 'p')) return false;
    if (!enemies.length) return true;
    const cheapest = Math.min(...enemies.map((e) => VALUE[e.type]));
    return cheapest >= v && map.attackersOf(s, side).length > 0;
  };

  const out = [];
  for (const piece of map.pieces) {
    if (piece.color !== side || !['n', 'b', 'r'].includes(piece.type)) continue;
    const targets = new Map(piece.type === 'r' ? rookTargets : minorTargets); // copie : le filtre des fous ne doit pas toucher les autres pièces
    if (!targets.size) continue;
    if (piece.type === 'b') {
      // Un fou ne change jamais de couleur de case.
      for (const s of [...targets.keys()]) {
        if ((FILES.indexOf(s[0]) + Number(s[1])) % 2 !== (piece.fileIdx + piece.rank) % 2) targets.delete(s);
      }
    }
    const v = VALUE[piece.type];

    // Parcours en largeur : chemins de cases vides et sûres.
    /** @type {Map<string, string | null>} */
    const prev = new Map([[piece.square, null]]);
    let frontier = [piece.square];
    for (let depth = 1; depth <= maxMoves && frontier.length; depth++) {
      const next = [];
      for (const from of frontier) {
        for (const to of stepsFrom(from, piece.type, map.at, piece.square)) {
          if (prev.has(to) || !safe(to, v)) continue;
          prev.set(to, from);
          next.push(to);
          if (targets.has(to) && to !== piece.square) {
            const path = [];
            for (let s = to; s; s = prev.get(s)) path.unshift(s);
            out.push({
              piece: `${LETTER[piece.type]}${piece.square}`,
              from: piece.square, to, path, moves: depth, why: targets.get(to),
              text: `${NAME[piece.type]} ${piece.square} → ${to} (${targets.get(to)}) en ${depth} coup(s) : ${path.join('-')}`,
            });
          }
        }
      }
      frontier = next;
    }
  }

  // Une manœuvre par pièce et par cible ; les plus courtes d'abord, cibles avancées en tête.
  const seen = new Set();
  return out
    .filter((m) => (seen.has(m.piece + m.to) ? false : seen.add(m.piece + m.to)))
    .sort((a, b) => a.moves - b.moves || relRank(Number(b.to[1]), side) - relRank(Number(a.to[1]), side))
    .slice(0, opts.max ?? 5);
}

/** Cases atteignables en un coup (cases vides seulement ; l'origine de la pièce compte comme vide). */
function stepsFrom(from, type, at, origin) {
  const f0 = FILES.indexOf(from[0]);
  const r0 = Number(from[1]);
  const empty = (s) => !at[s] || s === origin;
  const out = [];
  if (type === 'n') {
    for (const [df, dr] of KNIGHT) {
      const f = f0 + df;
      const r = r0 + dr;
      if (f >= 0 && f < 8 && r >= 1 && r <= 8 && empty(sq(f, r))) out.push(sq(f, r));
    }
    return out;
  }
  for (const [df, dr] of type === 'b' ? DIAG : STRAIGHT) {
    let f = f0 + df;
    let r = r0 + dr;
    while (f >= 0 && f < 8 && r >= 1 && r <= 8 && empty(sq(f, r))) {
      out.push(sq(f, r));
      f += df;
      r += dr;
    }
  }
  return out;
}
