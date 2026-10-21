/**
 * Le coup de l'élève guidé (épreuve Maia, docs/plans/PROTOCOLE-MAIA-2026-10-21.md § 4) : Maia-1500 propose ses coups
 * probables, le coach garde ceux qui servent le plan, Stockfish ARBITRE le prix contre le coup naturel de l'élève — il ne
 * propose jamais un coup. Joueur à part (Dev chef, § 7 bis.5) : `choisirCoup` (l'exécutant Stockfish du lot 1 bis) n'est pas
 * touché ; on réutilise ses helpers purs (distance, suivre, avancer) et le Noteur.
 *
 * Ordre : position forcée (échec, ou un seul coup probable) → tirage normal, neutre ; sinon un pas du plan parmi les coups
 * probables (tirage au prorata, puis les autres pas par probabilité), admis si son retard sur le coup naturel ≤ 1 pion et
 * si l'addition reste ≤ 1 pion ; sinon le roque s'il est probable ; sinon (G-AU) l'attente utile ; sinon l'élève joue son
 * coup, compté CONTRE le plan (Expert, § 4.2). Pas de dernière chance : elle irait chercher un coup que Maia ne joue pas.
 */
import { Chess } from 'chess.js';
import { distance, suivre } from './plan-distance.mjs';
import { avancer, estRoque, jouer, DEFAUTS } from './coup-contraint.mjs';
import { tirer } from './maia.mjs';

/** Les réglages de l'élève guidé : G-A = garde-fou seul ; G-AU = + attente utile (borne et plafond de l'Expert). */
export const REGLES_MAIA = Object.freeze({
  A: Object.freeze({ cumul: 100, concession: 100, k: 2 }),
  AU: Object.freeze({ cumul: 100, concession: 100, k: 2, utile: 25, sansPlan: true, plafondSansPlan: 100 }),
});

const coupDe = (fen, uci) => new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

/**
 * La valeur d'un coup pour le camp qui le joue, à la profondeur de jeu : la meilleure réponse adverse, au signe près
 * (même patron que la dernière chance du lot 1 bis). Mat donné = +10000, pat ou nulle = 0.
 */
export async function valeurCoup(noteur, fen, uci) {
  const apres = jouer(fen, uci).fen; const c = new Chess(apres);
  if (c.isCheckmate()) return 10000;
  if (c.isGameOver()) return 0;
  const [rep] = await noteur.noter(apres, 1);
  return rep ? -rep.cp : 0;
}

/** Le coup fait-il progresser le plan (distance qui baisse, l'adversaire immobile) ? */
export function progresse(fen, side, plan, m) {
  const apres = new Chess(fen); apres.move(m.san);
  return distance(apres.fen(), side, suivre(plan, m)).d < distance(fen, side, plan).d;
}

/**
 * @param probables  [{ uci, p }] les coups probables de Maia (≥ 5 %, au plus 5), dans l'ordre de la politique
 * @param etat       { compteur, cumul, sansPas, sansPlanCumul }
 * @param p          { regles, graine, sert?(fen, m) → libellés }
 * @returns {Promise<{ uci, m, p, classe, retard, change, naturel, ...avancer, sansPas, refus?, sert? }>}
 *   change : le coup guidé diffère de ce que CET élève aurait tiré à cette graine (Dev chef : une seule définition)
 * Le retard est mesuré contre le coup modal de Maia (argmax), pas contre le tirage : intrinsèque à la position, biais
 * conservateur assumé (le garde-fou se déclenche un peu plus tôt).
 */
export async function choisirCoupMaia(noteur, fen, side, plan, probables, etat, p) {
  const R = p.regles, naturel = probables[0];
  const sortie = (c, classe, retard, extra = {}) => ({ uci: c.uci, m: coupDe(fen, c.uci), p: c.p, classe, retard, naturel: naturel.uci, ...avancer(etat, classe, retard), ...extra });
  const libre = tirer(probables, fen, p.graine);
  // Position forcée : l'élève pare comme il le ferait ; neutre pour le plan (un pas qui pare compte comme pas).
  if (new Chess(fen).inCheck() || probables.length === 1) {
    const pas = progresse(fen, side, plan, coupDe(fen, libre.uci));
    return { ...sortie(libre, pas ? 'forcé-progressant' : 'forcé', 0), sansPas: pas ? 0 : etat.sansPas ?? 0, change: false };
  }
  let vNaturel = null;
  const retardDe = async (c) => { if (c.uci === naturel.uci) return 0; vNaturel ??= await valeurCoup(noteur, fen, naturel.uci); return vNaturel - await valeurCoup(noteur, fen, c.uci); };
  const deborde = (retard) => (etat.cumul ?? 0) + Math.max(0, retard) > R.cumul;
  const pas = probables.filter((c) => progresse(fen, side, plan, coupDe(fen, c.uci)));
  let refus = null;
  if (pas.length) {
    const premier = tirer(pas, fen, p.graine);
    for (const c of [premier, ...pas.filter((x) => x !== premier)]) {
      const retard = await retardDe(c);
      // Trop cher seul (> 1 pion : pas une branche, comme au lot 1) ou trop cher pour l'addition (refus : le plan s'arrête au coup suivant).
      if (retard > R.concession) continue;
      if (deborde(retard)) { refus ??= { uci: c.uci, retard, cumul: (etat.cumul ?? 0) + Math.max(0, retard) }; continue; }
      return { ...sortie(c, 'progressant', retard, refus ? { refus } : {}), sansPas: 0, change: c.uci !== libre.uci };
    }
  }
  const roque = probables.find((c) => estRoque(coupDe(fen, c.uci)));
  if (roque) {
    const retard = await retardDe(roque);
    if (retard <= R.concession && !deborde(retard)) return { ...sortie(roque, 'roque', retard, refus ? { refus } : {}), sansPas: pas.length ? 0 : (etat.sansPas ?? 0) + 1, change: roque.uci !== libre.uci };
  }
  // L'attente utile (G-AU) : le premier coup probable, dans l'ordre de Maia, qui n'est pas un pas, coûte ≤ 25 cp contre le
  // coup naturel et sert une instance du catalogue (Expert : la borne et l'addition valent pour l'élève aussi).
  if (R.utile != null && p.sert) {
    for (const c of probables) {
      if (pas.includes(c)) continue;
      const s = p.sert(fen, coupDe(fen, c.uci)); if (!s.length) continue;
      const retard = await retardDe(c); if (retard > R.utile || deborde(retard)) continue;
      return { ...sortie(c, 'attente utile', retard, { sert: s, ...(refus ? { refus } : {}) }), sansPas: pas.length ? 0 : (etat.sansPas ?? 0) + 1, change: c.uci !== libre.uci };
    }
  }
  // L'élève joue son coup : contre le plan (compteur + 1). Son retard est nul par définition (c'est la référence ou un
  // coup de même rang) ; on ne le note pas.
  return { ...sortie(libre, 'intendance', 0, refus ? { refus } : {}), sansPas: pas.length ? 0 : (etat.sansPas ?? 0) + 1, change: false };
}

/**
 * Pourquoi le plan de l'élève s'arrête-t-il (null : il continue) ? Libellés propres dès le départ (Dev chef, § 7 bis.5) :
 * l'addition d'abord ; puis le compteur, nommé « faute de coup probable » quand aucun des k + 1 derniers coups n'offrait de
 * pas parmi les coups probables (Expert : la liste des plans à ENSEIGNER).
 */
export function raisonAbandonMaia(etat, R) {
  if (etat.cumulDeborde) return 'hors de prix (cumul)';
  if ((etat.compteur ?? 0) >= R.k + 1) return (etat.sansPas ?? 0) >= R.k + 1 ? 'faute de coup probable' : 'hors de prix (compteur)';
  return null;
}

export { DEFAUTS };
