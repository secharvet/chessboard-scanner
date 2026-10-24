/**
 * Tests contrefactuels (docs/PLANS-ET-CONCEPTS.md, §6 bis, test 3) — la partie qui demande le moteur de règles.
 *
 * Pour chaque exemple POSITIF du jeu de données, on fabrique deux positions voisines :
 *   « tuer »   : on retire l'ingrédient du concept (le pion de levier, le fou de la couleur conquise, on rebouche
 *                la colonne…) ; un modèle qui a compris le concept doit baisser nettement sa probabilité ;
 *   « neutre » : on change quelque chose de sans rapport, loin du concept (un pion de bord avance d'une case) ;
 *                la probabilité ne doit presque pas bouger.
 * Chaque variante est écrite avec ses faits (comme build-dataset.mjs) ; scripts/score-counterfactuals.py fait
 * noter les trois positions par les modèles et compare.
 *
 *   node scripts/counterfactuals.mjs data/datasets/plans-v1.jsonl [--out data/datasets/contrefactuels.jsonl] [--max 400]
 */

import { createReadStream, writeFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = opt('--out', 'data/datasets/contrefactuels.jsonl');
const MAX = Number(opt('--max', 400));
const FILES = 'abcdefgh';
const opp = (c) => (c === 'w' ? 'b' : 'w');

/** Position valide (deux rois, pas de roi adverse en prise) ou null. */
const valid = (c) => { try { return new Chess(c.fen()).isCheck() === c.isCheck() && c.fen(); } catch { return null; } };
const clone = (fen) => new Chess(fen);
const pieces = (c, color, type) => c.board().flat().filter((p) => p && p.color === color && (!type || p.type === type));
const facts = (fen) => {
  const out = {};
  for (const t of buildAllFacts(fen)) { const k = `${t.id}|${t.params.color ?? '-'}`; out[k] = (out[k] ?? 0) + 1; }
  return out;
};

/** Variantes « tuer », par concept, du point de vue de `side`. Renvoient un FEN ou null. */
const KILL = {
  // Reboucher la colonne que ma tour occupe : un pion ADVERSE revient devant elle (colonne fermée pour moi).
  tour_colonne(c, side) {
    for (const r of pieces(c, side, 'r')) {
      const file = r.square[0];
      const target = `${file}${side === 'w' ? 6 : 3}`;
      if (!c.get(target) && !pieces(c, side, 'p').some((p) => p.square[0] === file)) {
        c.put({ type: 'p', color: opp(side) }, target);
        return valid(c);
      }
    }
    return null;
  },
  // Retirer le fou de la couleur que je veux conquérir : plus de domination possible.
  dominer(c, side) {
    const shade = (sq) => (FILES.indexOf(sq[0]) + Number(sq[1])) % 2;
    const bs = pieces(c, side, 'b');
    if (!bs.length) return null;
    c.remove(bs[0].square);
    return valid(c);
  },
  // Retirer mon pion le plus avancé au centre ou sur l'aile du plan : le levier disparaît.
  rupture(c, side) {
    const ps = pieces(c, side, 'p').sort((a, b) => (side === 'w' ? b.square[1] - a.square[1] : a.square[1] - b.square[1]));
    if (!ps.length) return null;
    c.remove(ps[0].square);
    return valid(c);
  },
  // Retirer le pion adverse que je voudrais affaiblir : le plus avancé de l'adversaire.
  affaiblir(c, side) {
    const ps = pieces(c, opp(side), 'p').sort((a, b) => (side === 'w' ? a.square[1] - b.square[1] : b.square[1] - a.square[1]));
    if (!ps.length) return null;
    c.remove(ps[0].square);
    return valid(c);
  },
  // Retirer ma pièce mineure la plus avancée : plus rien à installer sur l'avant-poste ou devant le pion.
  cavalier_avant_poste(c, side) { return KILL.minor(c, side, 'n'); },
  blocage(c, side) { return KILL.minor(c, side, null); },
  minor(c, side, type) {
    const ms = pieces(c, side).filter((p) => (type ? p.type === type : p.type === 'n' || p.type === 'b'))
      .sort((a, b) => (side === 'w' ? b.square[1] - a.square[1] : a.square[1] - b.square[1]));
    if (!ms.length) return null;
    c.remove(ms[0].square);
    return valid(c);
  },
};

/** Variante neutre : un pion de bord (a ou h) de n'importe quel camp avance d'une case, si la case est libre. */
function neutral(c) {
  for (const file of ['h', 'a']) for (const color of ['w', 'b']) {
    for (const p of pieces(c, color, 'p').filter((x) => x.square[0] === file)) {
      const to = `${file}${Number(p.square[1]) + (color === 'w' ? 1 : -1)}`;
      if (Number(to[1]) >= 2 && Number(to[1]) <= 7 && !c.get(to)) {
        c.remove(p.square);
        c.put({ type: 'p', color }, to);
        return valid(c);
      }
    }
  }
  return null;
}

writeFileSync(OUT, '');
const counts = {};
let n = 0;
for await (const line of createInterface({ input: createReadStream(args[0]), crlfDelay: Infinity })) {
  if (!line) continue;
  const r = JSON.parse(line);
  for (const [k, y] of Object.entries(r.y)) {
    if (y !== 1) continue;
    const concept = k.replace(/_[wb]$/, '');
    const side = k.slice(-1);
    if (!KILL[concept] || (counts[concept] ?? 0) >= MAX) continue;
    const kill = KILL[concept](clone(r.fen), side);
    const neut = neutral(clone(r.fen));
    if (!kill || !neut) continue;
    counts[concept] = (counts[concept] ?? 0) + 1;
    n++;
    appendFileSync(OUT, `${JSON.stringify({ concept, side, fen: r.fen, elo: r.elo?.[side] ?? null, kill, neutral: neut, facts: r.facts, factsKill: facts(kill), factsNeutral: facts(neut) })}\n`);
  }
}
console.log(`${n} triplets -> ${OUT}`, counts);
