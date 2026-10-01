/**
 * Classement d'un coup joué (inventaire du vocabulaire, 1er octobre 2026) : non calme, sort de l'échec, plan, moyen,
 * défense (sauve, protège), développement, poussée de pion, coup de roi, inexpliqué. Partagé par
 * scripts/inventaire-coups.mjs et scripts/inexpliques.mjs.
 */
export const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer', 'attaque_minorite', 'baionnette'];

/** Pièces de `color` en prise : attaquées, et non défendues ou attaquées par moins cher. */
export function enPrise(c, color) {
  const opp = color === 'w' ? 'b' : 'w';
  const out = new Map();
  for (const p of c.board().flat()) {
    if (!p || p.color !== color || p.type === 'k') continue;
    const att = c.attackers(p.square, opp);
    if (!att.length) continue;
    const def = c.attackers(p.square, color);
    const cheapest = Math.min(...att.map((sq) => VALUE[c.get(sq).type]));
    out.set(p.square, { type: p.type, attacked: true, defenders: def.length, hanging: def.length === 0 || cheapest < VALUE[p.type] });
  }
  return out;
}

export function classify(c, m, i, scan, atoms, inCheckBefore, before) {
  const color = m.color;
  if (m.captured) return 'prise';
  if (m.san.includes('+') || m.san.includes('#')) return 'échec';
  if (m.promotion) return 'promotion';
  if (inCheckBefore) return "sort de l'échec";
  for (const k of CONCEPTS) {
    if (scan[`${k}_${color}`] === i) return `plan:${k}`;
    if ((k === 'rupture' && scan[`rupture_levier_${color}`] === i && scan[`rupture_${color}`] >= 0)
      || (k === 'affaiblir' && scan[`affaiblir_levier_${color}`] === i && scan[`affaiblir_${color}`] >= 0)) return `plan:${k}`;
  }
  const atom = atoms.find((a) => a.side === color && a.ply === i);
  if (atom) return `moyen:${atom.kind}`;
  // Défense : pièces en prise avant / après (la pièce déplacée est suivie sur sa nouvelle case).
  const after = enPrise(c, color);
  const track = (sq) => (sq === m.from ? m.to : sq);
  const wasHanging = [...before.entries()].filter(([, v]) => v.hanging);
  if (wasHanging.length && wasHanging.every(([sq]) => !after.get(track(sq))?.hanging)) return 'défense:sauve';
  for (const [sq, v] of before) {
    const now = after.get(track(sq));
    if (v.attacked && now && now.defenders > v.defenders && sq !== m.from) return 'défense:protège';
  }
  if ((m.piece === 'n' || m.piece === 'b') && m.from[1] === (color === 'w' ? '1' : '8')) return 'développement';
  if (m.piece === 'p') return 'poussée de pion';
  if (m.piece === 'k') return 'coup de roi';
  return `inexpliqué:${m.piece}`;
}

