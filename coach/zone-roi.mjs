/**
 * L'attaque de roi sur pièces (docs/plans/REGROUPEMENT-2026-10-21.md, définition de l'Expert, 21 oct.) — aucun moteur.
 *
 * Zone du roi de `side` : les trois colonnes autour du roi, de sa rangée à deux rangées devant (9 cases pour un roi en g8).
 * Attaquant : pièce adverse, ni pion ni roi, qui attaque au moins une case de la zone (dame comprise ; pseudo-légal, comme
 * la carte des attaques). Au contact : il attaque une case voisine du roi. Attaque arrivée : ≥ 2 attaquants dont ≥ 1 au
 * contact. Défenses : mes pièces (pions compris, roi exclu) qui touchent la case du roi et ses voisines (le Cf6 qui tient g8
 * et h7, le Fe7 qui tient f8 : Expert) — le bouclier entier, pas seulement les cases déjà visées.
 */
import { Chess } from 'chess.js';
import { buildAttackMap, sq, other } from '../positional/attack-map.js';

/** @returns {{ arrivee: boolean, attaquants: string[], contact: string[], casesContact: string[], attaques: number, defenses: number }} */
export function attaqueRoi(fen, side) {
  const A = buildAttackMap(fen), adv = other(side);
  const roi = A.pieces.find((p) => p.type === 'k' && p.color === side); if (!roi) return null;
  const f0 = roi.fileIdx, r0 = roi.rank, sens = side === 'w' ? 1 : -1;
  const zone = [], voisines = [];
  for (let df = -1; df <= 1; df++) for (let k = 0; k <= 2; k++) { const f = f0 + df, r = r0 + sens * k; if (f >= 0 && f < 8 && r >= 1 && r <= 8) zone.push(sq(f, r)); }
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) { const f = f0 + df, r = r0 + dr; if ((df || dr) && f >= 0 && f < 8 && r >= 1 && r <= 8) voisines.push(sq(f, r)); }
  const pieces = A.pieces.filter((p) => p.color === adv && p.type !== 'p' && p.type !== 'k');
  const attaquants = pieces.filter((p) => A.attacks.get(p).some((s) => zone.includes(s)));
  const contact = attaquants.filter((p) => A.attacks.get(p).some((s) => voisines.includes(s)));
  const casesContact = voisines.filter((s) => contact.some((p) => A.attacks.get(p).includes(s)));
  const attaques = casesContact.reduce((n, s) => n + contact.filter((p) => A.attacks.get(p).includes(s)).length, 0);
  const bouclier = [roi.square, ...voisines];
  const defenses = bouclier.reduce((n, s) => n + A.attackersOf(s, side).filter((p) => p.type !== 'k').length, 0);
  const nom = (p) => `${p.type.toUpperCase()}${p.square}`;
  return { arrivee: attaquants.length >= 2 && contact.length >= 1, attaquants: attaquants.map(nom), contact: contact.map(nom), casesContact, bouclier, attaques, defenses };
}

/**
 * Le veto (§ 3) : l'attaque est arrivée, elle l'est encore après le coup, et le coup fait baisser les défenses du bouclier (comptées sur les MÊMES cases
 * qu'avant le coup : si le roi bouge, on juge le bouclier qu'il quitte).
 */
export function vetoDefense(fen, side, san) {
  const a = attaqueRoi(fen, side); if (!a?.arrivee) return null;
  const c = new Chess(fen); c.move(san);
  const A = buildAttackMap(c.fen());
  const apres = a.bouclier.reduce((n, s) => n + A.attackersOf(s, side).filter((p) => p.type !== 'k').length, 0);
  // Un coup qui coupe l'attaque (Ce4 qui bouche la diagonale du Fd3) n'est pas vetoé : on juge aussi la position d'après.
  if (!attaqueRoi(c.fen(), side)?.arrivee) return null;
  return apres < a.defenses ? { avant: a.defenses, apres, attaquants: a.attaquants, contact: a.contact } : null;
}

/** L'attaque est-elle retombée (le veto se lève) ? Le prédicat ne tient plus (moins de deux attaquants, ou aucun au contact). */
export const retombee = (fen, side) => { const a = attaqueRoi(fen, side); return !a?.arrivee; };


/**
 * Le candidat 2, « pression graduée » (GE, 22 oct. ; docs/plans/SEUILS-ATTAQUE-ROI-2026-10-21.md § 2, recopiée telle
 * quelle) : même zone que l'Expert ; P = poids des pièces adverses (ni roi ni pion) qui attaquent la zone, D = poids de mes
 * pièces (ni roi ni pion) qui en défendent une case + 1 par pion à moi dans la zone ; S = P − D. Poids classiques, non réglés.
 * `zone` imposée : D après un coup se compte sur la zone d'avant (le roi qui bouge laisse juger la zone qu'il quitte).
 */
export const POIDS_PRESSION = Object.freeze({ n: 1, b: 1, r: 2, q: 4 });
export function zoneRoi(fen, side) {
  const roi = buildAttackMap(fen).pieces.find((p) => p.type === 'k' && p.color === side); if (!roi) return null;
  const sens = side === 'w' ? 1 : -1, zone = [];
  for (let df = -1; df <= 1; df++) for (let k = 0; k <= 2; k++) { const f = roi.fileIdx + df, r = roi.rank + sens * k; if (f >= 0 && f < 8 && r >= 1 && r <= 8) zone.push(sq(f, r)); }
  return zone;
}
export function pressionRoi(fen, side, zone = zoneRoi(fen, side)) {
  if (!zone) return null;
  const A = buildAttackMap(fen), adv = other(side);
  const somme = (couleur) => A.pieces.filter((p) => p.color === couleur && POIDS_PRESSION[p.type] && A.attacks.get(p).some((s) => zone.includes(s)))
    .reduce((n, p) => n + POIDS_PRESSION[p.type], 0);
  const P = somme(adv), D = somme(side) + A.pieces.filter((p) => p.color === side && p.type === 'p' && zone.includes(p.square)).length;
  return { P, D, S: P - D, zone };
}
/** Le candidat 2 s'allume-t-il sur le pas `san` ? sAvant4 = S du même camp quatre demi-coups plus tôt. */
export function allumePression(fen, side, san, sAvant4) {
  const a = pressionRoi(fen, side); if (!a || sAvant4 == null) return null;
  const tendance = a.S - sAvant4; if (a.S < 4 || tendance < 2) return null;
  const c = new Chess(fen); c.move(san);
  const apres = pressionRoi(c.fen(), side, a.zone);
  return apres.D <= a.D - 1 ? { S: a.S, tendance, D: a.D, Dapres: apres.D } : null;
}

/**
 * L'alarme d'attaque de roi (candidat 1, passé le 22 oct. : RESULTAT-ATTAQUE-ROI-2026-10-22.md) : le veto de l'Expert dont
 * la dame adverse est parmi les attaquants. Elle ne retire rien : elle déclenche une vérification au moteur (coup-contraint).
 */
export function alarmeDame(fen, side, san) {
  const v = vetoDefense(fen, side, san);
  return v && v.attaquants.some((a) => a.startsWith('Q')) ? v : null;
}
