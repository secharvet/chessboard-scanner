/**
 * Classement d'un coup joué (inventaire du vocabulaire, 1er octobre 2026) : non calme, sort de l'échec, plan, moyen,
 * défense (sauve, protège), développement, poussée de pion, coup de roi, inexpliqué. Partagé par
 * scripts/inventaire-coups.mjs et scripts/inexpliques.mjs.
 */
import { Chess } from 'chess.js';

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


const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const FEM = { q: true, r: true };
const ref = (type, owner, square) => `${owner === 'me' ? (FEM[type] ? 'ta' : 'ton') : (FEM[type] ? 'sa' : 'son')} ${NAME[type]} en ${square}`;
const flipTurn = (fen) => { const p = fen.split(' '); p[1] = p[1] === 'w' ? 'b' : 'w'; p[3] = '-'; return p.join(' '); };

/**
 * Les trois mots qui manquaient (inventaire du 1er octobre : 60 % des coups calmes « inexpliqués » soutiennent, 36 %
 * pressent, 27 % menacent) : effets IMMÉDIATS d'un coup calme, lus sur l'échiquier avant / après, chacun avec sa
 * phrase et les pièces citées (pour le contrôle de la fiche).
 *   menace   : une pièce adverse est en prise après le coup, et ne l'était pas avant
 *   pression : la pièce jouée attaque une pièce adverse défendue qu'elle n'attaquait pas
 *   soutien  : la pièce jouée défend une pièce à moi (pas le roi) qu'elle ne défendait pas
 * @param {string} fenBefore  position avant le coup
 * @param {{ from: string, to: string, color: 'w'|'b', piece: string, captured?: string, san: string }} m  coup joué (verbose chess.js)
 * @returns {{ kind: 'menace'|'pression'|'soutien', text: string, pieces: [string, 'me'|'opp', string][] }[]}
 */
export function moveEffects(fenBefore, m) {
  const out = [];
  // Pas pour le roi : « O-O soutient ton pion en g2 » est vrai et ridicule (banc, position 21).
  if (m.captured || m.san.includes('+') || m.san.includes('#') || m.piece === 'k') return out;
  const before = new Chess(fenBefore);
  const after = new Chess(fenBefore);
  try { after.move({ from: m.from, to: m.to, promotion: m.promotion }); } catch { return out; }
  const color = m.color;
  const opp = color === 'w' ? 'b' : 'w';
  const oppBefore = enPrise(before, opp);
  const oppAfter = enPrise(after, opp);
  const newlyHanging = [...oppAfter.entries()].filter(([sq, v]) => v.hanging && !oppBefore.get(sq)?.hanging);
  if (newlyHanging.length) {
    const [sq, v] = newlyHanging.sort((a, b) => VALUE[b[1].type] - VALUE[a[1].type])[0];
    out.push({ kind: 'menace', text: `met ${ref(v.type, 'opp', sq)} en prise`, pieces: [[v.type, 'opp', sq]] });
  } else {
    let mine = null;
    try { mine = new Chess(flipTurn(after.fen())); } catch { /* adversaire en échec : pas de lecture */ }
    if (mine) {
      const targets = (c, sq) => new Map(c.moves({ square: sq, verbose: true }).filter((x) => x.captured).map((x) => [x.to, x.captured]));
      const tb = targets(before, m.from);
      const ta = targets(mine, m.to);
      const fresh = [...ta.entries()].filter(([sq]) => !tb.has(sq)).sort((a, b) => VALUE[b[1]] - VALUE[a[1]]);
      if (fresh.length) {
        const [sq, type] = fresh[0];
        out.push({ kind: 'pression', text: `attaque ${ref(type, 'opp', sq)}, qui est défendu${FEM[type] ? 'e' : ''} : c'est de la pression`, pieces: [[type, 'opp', sq]] });
      }
    }
  }
  for (const p of after.board().flat()) {
    if (!p || p.color !== color || p.type === 'k' || p.square === m.to) continue;
    if (after.attackers(p.square, color).includes(m.to) && !before.attackers(p.square, color).includes(m.from)) {
      const attacked = after.attackers(p.square, opp).length > 0;
      out.push({ kind: 'soutien', text: `${attacked ? 'protège' : 'soutient'} ${ref(p.type, 'me', p.square)}`, pieces: [[p.type, 'me', p.square]] });
      break;
    }
  }
  return out;
}
