/**
 * Pièce en prise par mini-échange sur sa case (valeurs croissantes, rayons X et clouages ignorés) : l'adversaire gagne-t-il
 * du matériel en ouvrant les prises ? Partagé par le test à deux demi-coups et le faisceau.
 */
import { buildAttackMap, other } from '../positional/attack-map.js';

export const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

/** Gain (en pions) de l'adversaire de `side` s'il ouvre les prises sur `sq` ; 0 si rien à prendre ou si ça ne rapporte pas. */
export function gainEchange(map, sq, side) {
  const p = map.at[sq]; if (!p) return 0;
  const opp = other(side);
  const att = map.attackersOf(sq, opp).sort((a, b) => VAL[a.type] - VAL[b.type]);
  const def = map.attackersOf(sq, side).sort((a, b) => VAL[a.type] - VAL[b.type]);
  const prises = []; let valeur = VAL[p.type], i = 0, j = 0, tourOpp = true;
  for (;;) { const arr = tourOpp ? att : def, k = tourOpp ? i : j; if (k >= arr.length) break; prises.push(valeur); valeur = VAL[arr[k].type]; if (tourOpp) i++; else j++; tourOpp = !tourOpp; }
  if (!prises.length) return 0;
  let g = prises[prises.length - 1];
  for (let k = prises.length - 2; k >= 0; k--) g = prises[k] - Math.max(0, g);
  return g;
}

/** Une pièce de `side` (ni pion ni roi) est-elle en prise ? */
export function enPrise(fen, side) {
  const map = buildAttackMap(fen);
  return map.pieces.some((p) => p.color === side && p.type !== 'p' && p.type !== 'k' && gainEchange(map, p.square, side) > 0);
}
