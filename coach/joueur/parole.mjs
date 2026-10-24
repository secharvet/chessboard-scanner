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
/** Le matériel en mots, par sa COMPOSITION (Expert, traque du 25 octobre) : « une pièce contre un pion », « la qualité »,
 *  « deux pièces contre une tour »… jamais une somme en nombre de pions. Rend null si le bilan n'est pas un gain net. */
export function materielEnMots(bilan) {
  if (!bilan) return null;
  const v = { P: 1, N: 3, B: 3, R: 5, Q: 9 };
  const total = Object.entries(bilan).reduce((s, [t, n]) => s + v[t] * n, 0);
  if (total <= 0) return null;
  const gagne = { P: Math.max(0, bilan.P ?? 0), M: Math.max(0, bilan.N ?? 0) + Math.max(0, bilan.B ?? 0), R: Math.max(0, bilan.R ?? 0), Q: Math.max(0, bilan.Q ?? 0) };
  const perdu = { P: Math.max(0, -(bilan.P ?? 0)), M: Math.max(0, -(bilan.N ?? 0)) + Math.max(0, -(bilan.B ?? 0)), R: Math.max(0, -(bilan.R ?? 0)), Q: Math.max(0, -(bilan.Q ?? 0)) };
  // un cavalier contre un fou, c'est un échange de pièces : on l'efface du bilan avant de nommer (« la qualité », pas « une tour et une pièce contre deux pièces »)
  const paires = Math.min(gagne.M, perdu.M); gagne.M -= paires; perdu.M -= paires;
  // la qualité : une tour contre une pièce mineure (et rien d'autre d'échangé entre elles)
  if (gagne.R === 1 && perdu.M === 1 && !gagne.Q && !perdu.Q && !perdu.R && !gagne.M) {
    const reste = gagne.P - perdu.P;
    return G.mots.gain.qualite + (reste > 0 ? ` et ${nombre(reste, 'pion')}` : reste < 0 ? ` contre ${nombre(-reste, 'pion')}` : '');
  }
  const liste = (c) => [c.Q ? (c.Q === 1 ? 'la dame' : `${c.Q} dames`) : '', c.R ? nombre(c.R, 'tour') : '', c.M ? nombre(c.M, 'pièce') : '', c.P ? nombre(c.P, 'pion') : ''].filter(Boolean);
  const g = liste(gagne), p = liste(perdu);
  if (!g.length) return null;
  return g.join(' et ') + (p.length ? ` contre ${p.join(' et ')}` : '');
}
const nombre = (n, mot) => (n === 1 ? `${mot === 'pièce' ? 'une' : 'un'} ${mot}`.replace('un pièce', 'une pièce').replace('un tour', 'une tour') : `${['', '', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit'][n] ?? n} ${mot}s`);

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
    ma_piece: maPiece(r.pieceM), case: r.caseM, schema: r.schema ?? '', sa_piece: r.saPiece ?? 'sa pièce', case_cible: r.caseCible ?? r.caseM,
  };
  const parties = [];
  let alerte = null;
  if (r.livre?.fin) parties.push(texte(G.livre.fin));

  // 1. La phrase de la sorte
  const t = r.termes?.[0] ?? null; // le terme le plus lourd, déjà muni de sa clé de gabarit et de ses données
  const dt = (x) => ({ ...d, ...(x?.donnees ?? {}) });
  const gab = (sorte, cle) => G[sorte]?.[cle] ?? G.pilote?.[cle] ?? null; // les gabarits du pilote complètent ceux de l'Expert
  switch (r.sorte) {
    case 'livre': parties.push(remplir(texte(r.sousSorte === 'refus' ? G.livre.refus : G.livre.coup), d)); break;
    case 'calcul': {
      const g = gab('calcul', r.sousSorte) ?? G.calcul.gain; parties.push(remplir(texte(g), dt(t)));
      if (r.motif && r.sousSorte !== 'mat' && !/mat/i.test(r.motif)) { const m = r.motif[0].toUpperCase() + r.motif.slice(1); parties.push(m.endsWith('.') ? m : `${m}.`); }
      break;
    }
    case 'defense': {
      const g = gab('defense', r.sousSorte) ?? G.defense.parer; parties.push(remplir(texte(g), dt(t)));
      if (r.sousSorte !== 'parer' && r.sousSorte !== 'echec_pare' && r.menace && !r.menace.pareeApresM) parties.push(remplir(texte(G.defense.sinon), d));
      break;
    }
    case 'plan': {
      parties.push(remplir(texte(r.plan?.distanceApres === 0 ? G.plan.dernier_pas : G.plan.pas), d));
      break;
    }
    case 'finale': parties.push(remplir(G.finale[r.sousSorte] ?? '', dt(t))); break;
    default: { // amélioration : la phrase de la sous-sorte (un gabarit du pilote), sinon celle du terme le plus lourd, sinon le coup d'attente
      const gp = G.pilote?.[r.sousSorte];
      const tSorte = r.termes?.find((x) => x.cle === r.sousSorte) ?? null; // le terme qui a donné la sous-sorte, s'il existe
      if (gp) parties.push(remplir(texte(gp), dt(tSorte))); // les données du coup (pièce jouée, pièce prise), pas celles d'un terme cité
      else if (r.sousSorte === 'coup_d_attente' || !r.sousSorte) parties.push(remplir(texte(G.amelioration.coup_d_attente), d));
      else {
        const g = G.amelioration[r.sousSorte] ?? G.finale[r.sousSorte] ?? G.amelioration.placement;
        parties.push(remplir(texte(g), dt(tSorte)));
      }
    }
  }
  // Un plan adopté à ce coup s'annonce, quelle que soit la sorte de la phrase (un fait, pas un ornement)
  if (r.plan?.adopte) parties.unshift(remplir(texte(G.plan.adoption), d) + (r.plan.pourquoi ? ` (${r.plan.pourquoi}.)` : ''));
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
  // jamais sous une phrase de défense (elle nomme déjà ce qu'elle pare), ni sur un coup qui mate, ni sous « contraint » (Expert)
  if (r.menace && r.sorte !== 'defense' && r.sousSorte !== 'mat' && r.sousSorte !== 'contraint') {
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
