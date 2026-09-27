/**
 * Module 6 — Tactique statique : motifs géométriques présents sur l'échiquier.
 *
 * PIECE_MENACEE, FOURCHETTE, CLOUAGE (au roi), CLOUAGE_RELATIF (à une pièce plus chère),
 * ENFILADE, DECOUVERTE_POSSIBLE, SURCHARGE, PIECE_PIEGEE, RANGEE_FAIBLE.
 *
 * Convention `color` : camp qui SUBIT (menace, clouage, surcharge, pièce piégée, rangée faible)
 * ou camp qui PROFITE (fourchette, enfilade, découverte) — voir positional/balance.js.
 */

import { buildAttackMap, VALUE, other, relRank, sliderDirs, sq } from './attack-map.js';
import { token } from './tokens.js';

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildTacticalFacts(fen) {
  const map = buildAttackMap(fen);
  const { pieces, at, attacks, attackersOf, piecesOnRay, isDefended } = map;
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  /** Une pièce attaquée est-elle réellement en prise ? */
  const enPrise = (p) => {
    const attackers = attackersOf(p.square, other(p.color));
    if (!attackers.length) return false;
    const cheapest = Math.min(...attackers.map((a) => VALUE[a.type]));
    return !isDefended(p.square, p.color) || cheapest < VALUE[p.type];
  };

  // ── PIECE_MENACEE : non défendue, ou attaquée par une pièce de moindre valeur ──
  for (const p of pieces) {
    if (p.type === 'k' || !enPrise(p)) continue;
    out.push(token('PIECE_MENACEE', {
      square: p.square, color: p.color, type: p.type, defended: isDefended(p.square, p.color),
    }));
  }

  // ── FOURCHETTE : au moins deux cibles rentables (roi, pièce plus chère, pièce non défendue) ──
  for (const p of pieces) {
    if (p.type === 'k') continue;
    const victims = attacks.get(p)
      .map((s) => at[s])
      .filter((t) => t && t.color !== p.color && t.type !== 'p')
      .filter((t) => t.type === 'k' || VALUE[t.type] > VALUE[p.type] || !isDefended(t.square, t.color));
    if (victims.length >= 2) {
      out.push(token('FOURCHETTE', {
        square: p.square, color: p.color, type: p.type, targets: victims.map((v) => v.square).join(','),
      }));
    }
  }

  // ── Motifs de ligne : clouage, enfilade, découverte ──
  for (const s of pieces) {
    for (const dir of sliderDirs(s)) {
      const [p1, p2] = piecesOnRay(s, dir, 2);
      if (!p1 || !p2) continue;

      // Une pièce qui peut prendre la pièce clouante le long de la ligne n'est pas vraiment clouée.
      const canTakePinner = p1.type !== 'n' && attacks.get(p1).includes(s.square);
      if (p1.color !== s.color && p2.color !== s.color && p1.type !== 'k' && !canTakePinner) {
        if (p2.type === 'k') {
          out.push(token('CLOUAGE', { square: p1.square, color: p1.color, type: p1.type, by: s.square }));
        } else if (VALUE[p2.type] > VALUE[p1.type] && VALUE[p2.type] > VALUE[s.type]) {
          out.push(token('CLOUAGE_RELATIF', {
            square: p1.square, color: p1.color, type: p1.type, by: s.square, behind: p2.square,
          }));
        }
      }

      // Enfilade : la pièce de devant (roi ou plus chère) doit bouger et découvre celle de derrière.
      if (p1.color !== s.color && p2.color !== s.color && p2.type !== 'k'
        && (p1.type === 'k' || VALUE[p1.type] > VALUE[p2.type])
        && (!isDefended(p2.square, p2.color) || VALUE[p2.type] > VALUE[s.type])) {
        out.push(token('ENFILADE', { square: s.square, color: s.color, front: p1.square, back: p2.square }));
      }

      // Découverte : une pièce amie masque une ligne vers le roi, la dame ou une pièce non défendue.
      // Un pion ne quitte sa colonne qu'en prenant : sur une ligne verticale, il faut une prise possible.
      const pawnStuck = p1.type === 'p' && dir[0] === 0
        && !attacks.get(p1).some((sqr) => at[sqr] && at[sqr].color !== p1.color);
      if (!pawnStuck && p1.color === s.color && p2.color !== s.color
        && (p2.type === 'k' || p2.type === 'q' || (p2.type !== 'p' && !isDefended(p2.square, p2.color)))) {
        out.push(token('DECOUVERTE_POSSIBLE', {
          color: s.color, slider: s.square, mover: p1.square, target: p2.square, check: p2.type === 'k',
        }));
      }
    }
  }

  // ── SURCHARGE : seul défenseur de deux pièces attaquées ──
  for (const d of pieces) {
    if (d.type === 'k') continue;
    const duties = pieces.filter(
      (p) => p.color === d.color && p !== d && p.type !== 'k'
        && attackersOf(p.square, other(p.color)).length > 0
        && attacks.get(d).includes(p.square)
        && attackersOf(p.square, p.color).length === 1,
    );
    if (duties.length >= 2) {
      out.push(token('SURCHARGE', {
        square: d.square, color: d.color, type: d.type, defends: duties.map((p) => p.square).join(','),
      }));
    }
  }

  // ── PIECE_PIEGEE : pièce menacée sans aucune case de fuite sûre ──
  for (const p of pieces) {
    if (!['n', 'b', 'r', 'q'].includes(p.type) || !enPrise(p)) continue;
    // Si l'on peut prendre la pièce qui attaque, la pièce n'est pas piégée.
    const hunters = attackersOf(p.square, other(p.color));
    if (hunters.some((h) => attackersOf(h.square, p.color).length > 0)) continue;
    const exits = attacks.get(p).filter((s) => at[s]?.color !== p.color);
    const safe = exits.some((s) => {
      const hunters = attackersOf(s, other(p.color));
      const target = at[s];
      if (target && VALUE[target.type] >= VALUE[p.type]) return true; // prise rentable
      if (!hunters.length) return true;
      return Math.min(...hunters.map((h) => VALUE[h.type])) >= VALUE[p.type] && isDefended(s, p.color, p);
    });
    if (!safe) out.push(token('PIECE_PIEGEE', { square: p.square, color: p.color, type: p.type }));
  }

  // ── RANGEE_FAIBLE : roi sur sa première rangée sans case de fuite, adversaire avec tour/dame ──
  for (const color of /** @type {const} */ (['w', 'b'])) {
    const king = pieces.find((p) => p.type === 'k' && p.color === color);
    if (!king || relRank(king.rank, color) !== 1) continue;
    const heavy = pieces.some((p) => p.color !== color && (p.type === 'r' || p.type === 'q'));
    if (!heavy) continue;
    const up = color === 'w' ? 1 : -1;
    const escapes = [-1, 0, 1]
      .map((df) => [king.fileIdx + df, king.rank + up])
      .filter(([f]) => f >= 0 && f < 8)
      .map(([f, r]) => sq(f, r))
      .filter((s) => !at[s] && attackersOf(s, other(color)).length === 0);
    // Une tour/dame amie sur la rangée la garde ; deux pièces lourdes = rangée tenue.
    const guards = pieces.filter(
      (p) => p.color === color && (p.type === 'r' || p.type === 'q') && p.rank === king.rank,
    ).length;
    if (escapes.length === 0 && guards <= 1) {
      out.push(token('RANGEE_FAIBLE', { color, king: king.square, guarded: guards === 1 }));
    }
  }

  return out;
}
