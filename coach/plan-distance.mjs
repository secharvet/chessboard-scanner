/**
 * Distance d'un plan à sa réalisation : une fonction de potentiel calculée sur la position seule, du point de
 * vue de `side`, en NOMBRE DE MES COUPS (y compris ceux des pièces à moi qui doivent s'écarter du chemin).
 * 0 = réalisé, Infinity = pas réalisable tel quel (bloqué par l'adversaire). Le progrès se mesure sur mes
 * demi-coups seulement : d(après mon coup) < d(avant), l'adversaire immobile.
 *
 *   rupture   { pion: 'b', cible: 'b5' }    poussées restantes, chacune pesée par son déficit de soutien (attaquants
 *                                           adverses − mes défenseurs, le pion avançant transparent : la tour derrière
 *                                           lui le soutient par rayon X, une pièce adverse derrière l'attaque de même)
 *   transfert { de: 'f3', vers: 'e5' }      plus court chemin de la pièce ; une pièce à moi sur le chemin coûte un coup de plus
 *   echange   { mienne: 'c8', cible: 'e2' } chemin jusqu'à une case d'où ma pièce attaque la cible, plus la prise
 *   colonne   { colonne: 'c' }              mes pions sur la colonne (un coup chacun), plus le chemin de ma tour la plus proche
 *   et        { plans: [...] }              conjonction : la somme des distances (la batterie Dd3 + Fc2, « f4 puis e5 »)
 *
 * La sécurité des cases n'entre pas dans la distance : c'est le moteur qui la facture en prix. Et « arrivé » n'est
 * pas « réalisé » pour un transfert : la réalisation demande que la pièce TIENNE (critère de l'atome manœuvre,
 * HOLD_ATOM demi-coups), ce que seule une ligne jouée peut constater ; ici d = 0 veut dire arrivé. Un plan réalisé
 * reste réalisé (`verrouiller`) : bxc6 après b5 ne le rend pas indéfini.
 */

import { buildAttackMap, FILES, sq, other, sliderDirs } from '../positional/attack-map.js';

const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const fileOf = (s) => FILES.indexOf(s[0]);
const rankOf = (s) => Number(s[1]);
const inBoard = (f, r) => f >= 0 && f < 8 && r >= 1 && r <= 8;
const LETTRE = { n: 'C', b: 'F', r: 'T', q: 'D', k: 'R', p: '' };

/** Cases attaquées par une pièce `type` de `color` posée en `from` (rayons arrêtés par les pièces de `at`). */
function attaquesDepuis(type, color, from, at) {
  const f0 = fileOf(from), r0 = rankOf(from), out = [];
  const push = (f, r) => { if (inBoard(f, r)) out.push(sq(f, r)); };
  if (type === 'n') for (const [df, dr] of KNIGHT) push(f0 + df, r0 + dr);
  else if (type === 'k') for (const [df, dr] of KING) push(f0 + df, r0 + dr);
  else if (type === 'p') { const dr = color === 'w' ? 1 : -1; push(f0 - 1, r0 + dr); push(f0 + 1, r0 + dr); }
  else for (const [df, dr] of sliderDirs({ type })) {
    let f = f0 + df, r = r0 + dr;
    while (inBoard(f, r)) { out.push(sq(f, r)); if (at[sq(f, r)]) break; f += df; r += dr; }
  }
  return out;
}

/**
 * Coût minimal (en coups) pour amener la pièce de `from` sur chaque case (Dijkstra) : une case vide coûte 1, une
 * case occupée par une pièce à moi coûte 1 de plus (elle doit s'écarter ; un rayon continue derrière elle), une pièce
 * adverse arrête le rayon et ne peut pas être une arrivée. `from` coûte 0. `prev` permet de relire le chemin.
 * @returns {{ dist: Map<string, number>, prev: Map<string, string> }}
 */
function couts(piece, at) {
  const dist = new Map([[piece.square, 0]]);
  const prev = new Map();
  const file = [[piece.square, 0]];
  // Un pion à moi ne « s'écarte » que s'il peut avancer ou prendre ; sinon il bloque comme une pièce adverse
  // (le pion b7 derrière sa propre dame b6 ne libère pas la diagonale c8-a6). Choix conservateur : bloqué par
  // une pièce adverse c'est un vrai mur, bloqué par ma propre pièce mobile ce serait en théorie une cascade +2.
  const mur = (p) => {
    if (!p || p.color !== piece.color || p.type !== 'p') return p && p.color !== piece.color;
    const dr = p.color === 'w' ? 1 : -1;
    const devant = at[sq(p.fileIdx, p.rank + dr)];
    const prend = [-1, 1].some((df) => inBoard(p.fileIdx + df, p.rank + dr) && at[sq(p.fileIdx + df, p.rank + dr)]?.color !== p.color && at[sq(p.fileIdx + df, p.rank + dr)]);
    return Boolean(devant) && !prend;
  };
  const voisins = (s) => {
    const f0 = fileOf(s), r0 = rankOf(s), out = [];
    if (piece.type === 'n' || piece.type === 'k') {
      for (const [df, dr] of piece.type === 'n' ? KNIGHT : KING) {
        if (!inBoard(f0 + df, r0 + dr)) continue;
        const t = sq(f0 + df, r0 + dr), p = at[t];
        if (t !== piece.square && mur(p)) continue;
        out.push([t, p && t !== piece.square ? 2 : 1]);
      }
      return out;
    }
    for (const [df, dr] of sliderDirs(piece)) {
      let f = f0 + df, r = r0 + dr, bloqueurs = 0;
      while (inBoard(f, r)) {
        const t = sq(f, r), p = at[t];
        if (t !== piece.square && mur(p)) break;
        if (p && t !== piece.square) bloqueurs++;
        out.push([t, 1 + bloqueurs]);
        f += df; r += dr;
      }
    }
    return out;
  };
  while (file.length) {
    file.sort((a, b) => a[1] - b[1]);
    const [s, d] = file.shift();
    if (d > dist.get(s)) continue;
    for (const [t, c] of voisins(s)) {
      if (d + c < (dist.get(t) ?? Infinity)) { dist.set(t, d + c); prev.set(t, s); file.push([t, d + c]); }
    }
  }
  return { dist, prev };
}

/** Chemin lu dans `prev`, de l'origine à `to` (origine comprise). */
function chemin(prev, to) { const p = [to]; while (prev.has(p[0])) p.unshift(prev.get(p[0])); return p; }

/** Partie « pièces » d'un FEN sans la pièce en `square`. */
function retirer(board, square) {
  const rangs = board.split('/');
  const ri = 8 - rankOf(square), fi = fileOf(square);
  let out = '', f = 0;
  for (const ch of rangs[ri]) {
    if (/\d/.test(ch)) { out += ch; f += Number(ch); continue; }
    out += f === fi ? '1' : ch; f++;
  }
  rangs[ri] = out.replace(/\d+/g, (m) => String([...m].reduce((s, x) => s + Number(x), 0)));
  return rangs.join('/');
}

/** Déficit de soutien d'une case : attaquants adverses moins mes défenseurs, jamais négatif. */
const deficit = (map, s, side) => Math.max(0, map.attackersOf(s, other(side)).length - map.attackersOf(s, side).length);

/**
 * @param {string} fen
 * @param {'w'|'b'} side
 * @param {object} plan
 * @returns {{ d: number, detail: string, etapes?: string[] }}  etapes : la décomposition, une entrée par coup compté
 */
export function distance(fen, side, plan) {
  if (plan.realise) return { d: 0, detail: 'réalisé', etapes: [] };
  if (plan.famille === 'et') {
    const parts = plan.plans.map((p) => distance(fen, side, p));
    return { d: parts.reduce((s, p) => s + p.d, 0), detail: parts.map((p) => p.detail).join(' + '), etapes: parts.flatMap((p) => p.etapes ?? []) };
  }
  const map = buildAttackMap(fen);
  const at = map.at;
  const mienne = (s) => { const p = at[s]; return p && p.color === side ? p : null; };

  if (plan.famille === 'rupture') {
    const dir = side === 'w' ? 1 : -1;
    const f = fileOf(plan.cible), rc = rankOf(plan.cible);
    if (map.pieces.some((p) => p.type === 'p' && p.color === side && p.fileIdx === f && p.rank === rc)) return { d: 0, detail: `pion en ${plan.cible}`, etapes: [] };
    // Mon pion de cette colonne le plus proche derrière la cible.
    const pions = map.pieces.filter((p) => p.type === 'p' && p.color === side && p.fileIdx === fileOf(plan.pion) && (rc - p.rank) * dir > 0).sort((a, b) => (b.rank - a.rank) * dir);
    if (!pions.length) return { d: Infinity, detail: `aucun pion ${plan.pion} derrière ${plan.cible}` };
    const pion = pions[0];
    let cases = [];
    for (let r = pion.rank + dir; (rc - r) * dir >= 0; r += dir) cases.push(sq(f, r));
    // Double pas depuis la rangée initiale : la première case n'est pas une arrivée si elle est libre.
    const relRank = side === 'w' ? pion.rank : 9 - pion.rank;
    let sautee = null;
    if (relRank === 2 && cases.length >= 2 && !at[cases[0]]) { sautee = cases[0]; cases = cases.slice(1); }
    // Le soutien se mesure avec le pion avançant retiré : la tour derrière lui le soutiendra une fois qu'il aura
    // avancé (rayon X à travers son propre pion), et une pièce adverse derrière lui l'attaquera de même.
    const sansPion = buildAttackMap(fen.replace(/^(\S+)/, (board) => retirer(board, pion.square)));
    let d = 0; const etapes = [];
    for (const s of cases) {
      const p = at[s];
      if (p && p.color !== side) return { d: Infinity, detail: `bloqué par ${LETTRE[p.type] || 'pion'}${s}`, etapes };
      const att = sansPion.attackersOf(s, other(side)).length, def = sansPion.attackersOf(s, side).length;
      const deficitS = Math.max(0, att - def), bloque = p ? 1 : 0;
      d += 1 + deficitS + bloque;
      etapes.push(`${s} : poussée 1${deficitS ? ` + déficit ${deficitS} (${att} attaquant${att > 1 ? 's' : ''}, ${def} défenseur${def > 1 ? 's' : ''})` : ` (${att} att., ${def} déf.)`}${bloque ? ` + 1 (${LETTRE[p.type] || 'pion'}${s} à moi à écarter)` : ''}`);
      // Case sautée par le double pas : seuls les pions adverses comptent (prise en passant).
      if (s === cases[0] && sautee) {
        const ep = Math.max(0, sansPion.attackersOf(sautee, other(side)).filter((q) => q.type === 'p').length - sansPion.attackersOf(sautee, side).length);
        if (ep) { d += ep; etapes.push(`${sautee} (sautée) : + ${ep} (prise en passant possible)`); }
      }
    }
    return { d, detail: `${pion.square} → ${cases.join(', ')}`, etapes };
  }

  if (plan.famille === 'transfert') {
    const p = mienne(plan.de);
    if (!p) return { d: Infinity, detail: `plus de pièce à moi en ${plan.de}` };
    if (plan.de === plan.vers) return { d: 0, detail: `${LETTRE[p.type]}${plan.vers} arrivée`, etapes: [] };
    const occ = at[plan.vers];
    if (occ && occ.color !== side) return { d: Infinity, detail: `${plan.vers} occupée par ${LETTRE[occ.type] || 'pion'}${plan.vers}` };
    const { dist, prev } = couts(p, at);
    const c = dist.get(plan.vers);
    if (c == null) return { d: Infinity, detail: `${plan.vers} hors de portée` };
    const ch = chemin(prev, plan.vers);
    const ecartes = ch.slice(1).filter((s) => at[s]).map((s) => `${LETTRE[at[s].type] || 'pion'}${s}`);
    return { d: c, detail: `${LETTRE[p.type]}${ch.join('-')}`, etapes: [`${ch.length - 1} coup${ch.length > 2 ? 's' : ''} de ${LETTRE[p.type] || 'pion'} (${ch.join('-')})`, ...(ecartes.length ? [`${ecartes.length} à écarter (${ecartes.join(', ')})`] : [])] };
  }

  if (plan.famille === 'echange') {
    const p = mienne(plan.mienne);
    if (!p) return { d: Infinity, detail: `plus de pièce à moi en ${plan.mienne}` };
    const cible = at[plan.cible];
    if (!cible || cible.color === side) return { d: 0, detail: `cible ${plan.cible} disparue`, etapes: [] };
    const atSans = { ...at }; delete atSans[p.square];
    const { dist, prev } = couts(p, at);
    let best = Infinity, via = null;
    for (const [s, c] of dist) {
      if (c >= best) continue;
      if (attaquesDepuis(p.type, side, s, atSans).includes(plan.cible)) { best = c; via = s; }
    }
    if (best === Infinity) return { d: Infinity, detail: `aucune case d'où attaquer ${plan.cible}` };
    const ch = chemin(prev, via);
    const ecartes = ch.slice(1).filter((s) => at[s]).map((s) => `${LETTRE[at[s].type] || 'pion'}${s}`);
    return { d: best + 1, detail: best === 0 ? `${LETTRE[p.type]}${p.square} attaque déjà ${plan.cible}` : `${LETTRE[p.type]}${ch.join('-')} puis ×${plan.cible}`,
      etapes: [...(best ? [`${best} coup${best > 1 ? 's' : ''} jusqu'à ${via} (${ch.join('-')})`] : []), ...(ecartes.length ? [`${ecartes.length} à écarter (${ecartes.join(', ')})`] : []), `la prise ×${plan.cible}`] };
  }

  if (plan.famille === 'colonne') {
    const f = fileOf(plan.colonne);
    const pions = map.pieces.filter((p) => p.type === 'p' && p.color === side && p.fileIdx === f);
    const tours = map.pieces.filter((p) => p.type === 'r' && p.color === side);
    if (!tours.length) return { d: Infinity, detail: 'plus de tour' };
    let best = Infinity, quelle = null, ch = null;
    for (const t of tours) {
      if (t.fileIdx === f) { best = 0; quelle = t; ch = [t.square]; break; }
      const { dist, prev } = couts(t, at);
      for (let r = 1; r <= 8; r++) { const s = sq(f, r); if ((dist.get(s) ?? Infinity) < best) { best = dist.get(s); quelle = t; ch = chemin(prev, s); } }
    }
    if (best === Infinity) return { d: Infinity, detail: `aucune tour ne peut rejoindre la colonne ${plan.colonne}` };
    const ecartes = ch.slice(1).filter((s) => at[s]).map((s) => `${LETTRE[at[s].type] || 'pion'}${s}`);
    const etapes = [...(best ? [`${best} coup${best > 1 ? 's' : ''} de tour (T${ch.join('-')})`] : [`T${quelle.square} déjà sur la colonne`]), ...(ecartes.length ? [`${ecartes.length} à écarter (${ecartes.join(', ')})`] : []), ...pions.map((p) => `pion ${p.square} à retirer`)];
    return { d: best + pions.length, detail: `T${ch.join('-')}${pions.length ? ` ; pion(s) ${pions.map((p) => p.square).join(', ')} à retirer` : ''}`, etapes };
  }
  throw new Error(`famille inconnue : ${plan.famille}`);
}

/** Le même plan après un coup (de l'un ou l'autre camp) : les pièces suivies changent de case avec le coup —
 *  la cible d'un échange est une pièce, pas une case : si le Fe2 va en d3, « échanger le mauvais fou » survit. */
export function suivre(plan, move) {
  if (plan.famille === 'et') return { ...plan, plans: plan.plans.map((p) => suivre(p, move)) };
  if (plan.famille === 'transfert' && move.from === plan.de) return { ...plan, de: move.to };
  if (plan.famille === 'echange') {
    if (move.from === plan.mienne) return { ...plan, mienne: move.to };
    if (move.from === plan.cible) return { ...plan, cible: move.to };
  }
  return plan;
}

/** Verrou de réalisation : un plan arrivé à 0 reste à 0 (le pion de levier qui prend ensuite ne le rend pas indéfini). */
export function verrouiller(plan, fen, side) {
  if (plan.famille === 'et') return { ...plan, plans: plan.plans.map((p) => verrouiller(p, fen, side)) };
  return distance(fen, side, plan).d === 0 ? { ...plan, realise: true } : plan;
}

/** Libellé court d'un plan (notation française). */
export function libelle(plan, fen) {
  const at = fen ? buildAttackMap(fen).at : {};
  const L = (s) => `${LETTRE[at[s]?.type ?? ''] ?? ''}${s}`;
  if (plan.famille === 'et') return plan.plans.map((p) => libelle(p, fen)).join(' ET ');
  if (plan.famille === 'rupture') return `rupture ${plan.pion}→${plan.cible}`;
  if (plan.famille === 'transfert') return `transfert ${L(plan.de)}→${plan.vers}`;
  if (plan.famille === 'echange') return `échange ${L(plan.mienne)}×${L(plan.cible)}`;
  if (plan.famille === 'colonne') return `colonne ${plan.colonne}`;
  return plan.famille;
}
