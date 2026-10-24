/**
 * La parole du coach joueur : la trace d'un coup mise en français de club, avec les gabarits de l'Expert
 * (gabarits-parole.json, règles dans livrables/gabarits-parole.md de sa branche ; docs/coach-joueur/CHANTIERS, page 2).
 *
 * Entrée : l'enregistrement d'un coup tel que le construit joueur.mjs (sorte déjà choisie, termes déjà cités, menace déjà
 * revérifiée). Sortie : { phrase, alerte }. Aucun nombre d'évaluation n'entre dans une phrase : les écarts sont traduits
 * en mots, et seuls un nombre de coups, un matériel compté et « plus d'un pion » peuvent apparaître.
 */
import { createRequire } from 'node:module';
const G = createRequire(import.meta.url)('./gabarits-parole.json');

const remplir = (gabarit, donnees) => gabarit.replace(/\{(\w+)\}/g, (_, k) => (donnees[k] ?? `{${k}}`));
const texte = (g) => (typeof g === 'string' ? g : g.texte);

/** « 12.Cxe5 Fxe5 13.d4 » ; `ply` est le demi-coup (1 = premier coup des Blancs) du premier coup de la ligne. */
export function ligneTexte(sans, ply) {
  if (!sans?.length) return '';
  const out = [];
  sans.forEach((s, i) => {
    const p = ply + i, n = Math.ceil(p / 2);
    if (p % 2 === 1) out.push(`${n}.${s}`); else out.push(i === 0 ? `${n}…${s}` : s);
  });
  return out.join(' ');
}

export const ecartEnMots = (ecart) => (ecart < 10 ? null : ecart < 30 ? G.mots.ecart_mots['10-30'] : ecart < 80 ? G.mots.ecart_mots['30-80'] : ecart < 200 ? G.mots.ecart_mots['80-200'] : G.mots.ecart_mots['200+']);

/** Le matériel gagné (ou perdu) au bout d'une ligne, en mots, depuis le bilan par type : { P, N, B, R, Q } (positif = gagné). */
export function materielEnMots(bilan) {
  if (!bilan) return null;
  const v = { P: 1, N: 3, B: 3, R: 5, Q: 9 };
  const total = Object.entries(bilan).reduce((s, [t, n]) => s + v[t] * n, 0);
  if (total <= 0) return null;
  if (bilan.Q > 0 && total >= 8) return G.mots.gain.dame;
  if (bilan.R > 0 && (bilan.N < 0 || bilan.B < 0) && total === 2) return G.mots.gain.qualite;
  if (total >= 5 && bilan.R > 0) return total >= 6 ? `${G.mots.gain.tour} et un pion` : G.mots.gain.tour;
  if (total >= 3 && (bilan.N > 0 || bilan.B > 0)) return total >= 4 ? `${G.mots.gain.piece} et un pion` : G.mots.gain.piece;
  if (total >= 3) return G.mots.gain['3'];
  return G.mots.gain[String(total)] ?? `${total} pions`;
}

const maPiece = (p) => G.mots.ma_piece[p] ?? 'ma pièce';
const saPiece = (p) => G.mots.sa_piece[p] ?? 'sa pièce';

/**
 * @param {object} r  l'enregistrement du coup (voir joueur.mjs)
 * @returns {{ phrase: string, alerte: string|null }}
 */
export function formuler(r) {
  const M = r.san, R = r.battu?.san ?? null, ply = r.ply;
  const d = {
    M, R, L: r.livre?.L ?? '', coup: M,
    ligneM: ligneTexte(r.ligne, ply), ligneR: ligneTexte(r.ligneBattu, ply), ligneL: ligneTexte(r.livre?.ligneL, ply),
    menace: r.menace ? ligneTexte(r.menace.ligne, ply + 1) : '',
    gain: r.gain ?? '', perte_M: r.perteM ?? 'du matériel', perte_R: r.perteR ?? 'du terrain', perte_menace: r.menace?.perte ?? 'du matériel',
    ecart_mots: r.battu ? ecartEnMots(r.battu.ecart) ?? '' : '',
    plan: r.plan?.nom ?? '', distance_apres: r.plan?.distanceApres ?? '', raison: r.livre?.raison ?? '', objet_disparu: r.plan?.objetDisparu ?? '',
    ma_piece: maPiece(r.pieceM), case: r.caseM, schema: r.schema ?? '',
  };
  const parties = [];
  let alerte = null;
  if (r.livre?.fin) parties.push(texte(G.livre.fin));

  // 1. La phrase de la sorte
  const t = r.termes?.[0] ?? null; // le terme le plus lourd, déjà muni de sa clé de gabarit et de ses données
  const dt = (x) => ({ ...d, ...(x?.donnees ?? {}) });
  switch (r.sorte) {
    case 'livre': parties.push(remplir(texte(r.sousSorte === 'refus' ? G.livre.refus : G.livre.coup), d)); break;
    case 'calcul': {
      const g = G.calcul[r.sousSorte] ?? G.calcul.gain; parties.push(remplir(texte(g), d));
      if (r.motif) { const m = r.motif[0].toUpperCase() + r.motif.slice(1); parties.push(m.endsWith('.') ? m : `${m}.`); }
      break;
    }
    case 'defense': {
      const g = G.defense[r.sousSorte] ?? G.defense.parer; parties.push(remplir(texte(g), dt(t)));
      if (r.sousSorte !== 'parer' && r.menace && !r.menace.pareeApresM) parties.push(remplir(texte(G.defense.sinon), d));
      break;
    }
    case 'plan': {
      if (r.plan?.adopte) parties.push(remplir(texte(G.plan.adoption), d));
      parties.push(remplir(texte(r.plan?.distanceApres === 0 ? G.plan.dernier_pas : G.plan.pas), d));
      if (r.plan?.pourquoi && r.plan.adopte) parties.push(`(${r.plan.pourquoi}.)`);
      break;
    }
    case 'finale': parties.push(remplir(G.finale[r.sousSorte] ?? '', dt(t))); break;
    default: { // amélioration : la phrase du terme le plus lourd, ou le coup d'attente
      if (!t || t.poids < 10) parties.push(remplir(texte(G.amelioration.coup_d_attente), d));
      else {
        const g = G.amelioration[t.cle] ?? G.finale[t.cle];
        parties.push(g ? remplir(texte(g), dt(t)) : remplir(texte(G.amelioration.placement), d));
      }
    }
  }
  // Abandon d'un plan annoncé à ce coup
  if (r.plan?.abandon === 'cher') parties.unshift(remplir(texte(G.plan.abandon_cher), { plan: r.plan.ancien ?? r.plan.nom }));
  if (r.plan?.abandon === 'sans_objet') parties.unshift(remplir(texte(G.plan.abandon_sans_objet), { plan: r.plan.ancien ?? r.plan.nom, objet_disparu: r.plan.objetDisparu ?? 'la cible' }));

  // 2. La comparaison avec R (rien pour « seul coup », « moindre mal » et le mat, qui en parlent déjà, ni pour le livre, qui n'est pas choisi par comparaison)
  if (R && !['seul_coup', 'moindre_mal', 'mat', 'refus', 'coup'].includes(r.sousSorte)) {
    if (r.battu.seValent) parties.push(remplir(texte(G.comparaison.se_valent), d));
    else if (r.sorte === 'plan' && r.battu.planTerme <= 0) parties.push(remplir(texte(G.comparaison.battu_plan), d));
    else if (d.ecart_mots) parties.push(remplir(texte(G.comparaison.battu), d));
  }

  // 3. La menace vue (sauf si la défense la nomme déjà ; jamais en finale de pions, déjà filtrée en amont)
  if (r.menace && !(r.sorte === 'defense' && r.sousSorte === 'parer') && r.sousSorte !== 'mat') {
    if (r.menace.pareeApresM && r.menace.pareeApresR) parties.push(remplir(texte(G.menace_vue.paree), d));
    else if (!r.menace.pareeApresM) {
      parties.push(remplir(texte(G.menace_vue.non_paree), d));
      if (r.sorte === 'plan' || r.sorte === 'amelioration') alerte = 'menace non parée en sorte plan ou amélioration : sorte fausse ou coup fautif';
    }
  }

  // 4. Une seconde phrase de terme, pour une amélioration ou un plan (deux au plus en tout)
  if ((r.sorte === 'amelioration' || r.sorte === 'plan') && r.termes?.length > 1) {
    const t2 = r.termes[1];
    if (t2.poids >= 10) { const g = G.amelioration[t2.cle] ?? G.finale[t2.cle]; if (g && t2.cle !== t?.cle) parties.push(remplir(texte(g), dt(t2)).replace(/^Rien de forcé\. /, '')); }
  }
  // Majuscule en tête de phrase pour un possessif venu d'un gabarit (« mon fou » après un point) ; jamais sur un coup.
  const phrase = parties.join(' ').replace(/\s+/g, ' ').trim().replace(/(^|[.!?] |\( )(mon|ma|son|sa|mes|ses) /g, (_, a, b) => `${a}${b[0].toUpperCase()}${b.slice(1)} `);
  return { phrase, alerte };
}

export { G as GABARITS, maPiece, saPiece };
