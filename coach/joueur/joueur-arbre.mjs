/**
 * Le joueur « humain » : l'ARBRE devant la recherche (docs/coach-joueur/ARBRE-DECISION-2026-10-25.md et
 * CHANTIER-ARBRE-2026-10-25.md), TEMPS 1.
 *
 * Même contrat que `coach/joueur/joueur.mjs` (`async choisir(fen, contexte)`), mais le coup se choisit autrement :
 *   1-3. l'arbre (coach/joueur/arbre.mjs) PRODUIT des candidats {coup, raison, noeud} — jamais de score ;
 *   4.   la recherche actuelle, RESTREINTE à la racine aux candidats (en dessous, tous les coups), leur donne un score
 *        exact et une ligne ; on élague un candidat dont la ligne coûte du matériel (avec sa ligne = la réfutation) ;
 *        on garde le meilleur bilan net après sa meilleure réponse ; à égalité (< 10) la raison la plus haute dans l'arbre ;
 *   5.   contrôle : sur la position après le coup, on repose la question « que menace-t-il ? » — une menace nouvelle de
 *        matériel (≥ 80) ou un mat que la ligne n'avait pas vus écartent le coup au profit du suivant ;
 *   6.   on dit : la question du nœud qui a produit le coup, et, si le meilleur écarté vaut 80 ou plus et que sa
 *        réfutation se lit, « j'ai pensé à X, mais … ; avec M, rien de tel ».
 *
 * Le TROU de l'arbre (la recherche complète, tous les coups, tourne en plus pour le mesurer) est une OPTION
 * (`trou: true`), car elle double le temps par coup ; par défaut elle est éteinte.
 *
 * Aucune évaluation extérieure n'entre : la sonde (menace, parade par test, mon mat, prophylaxie) est calculée ici, avec
 * la propre recherche du coach (réutilisant Recherche.menace, coup nul, budget 60 000).
 */
import { Chess } from 'chess.js';
import { Echiquier, DEPART, uci as uciDe } from './echiquier.mjs';
import { evaluer, enCentipions } from './evaluation.mjs';
import { Recherche, MAT } from './recherche.mjs';
import { materielEnMots, ligneTexte, GABARITS } from './parole.mjs';
import { toFrenchSan } from '../notation.mjs';
import { candidats as candidatsArbre, candidatsEtAllumes, selectionner, ORDRE, saPiece, piecesEnPrise } from './arbre.mjs';
import { buildAttackMap, other, sq as caseNom } from '../../positional/attack-map.js';
import { gainEchange } from '../en-prise.mjs';

const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const LETTRE = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q' };
export const BORNES = Object.freeze({ seValent: 10, menace: 80, trou: 100, ecarteDit: 80 });

/** Le nom de la question d'un nœud, pour la pastille et la phrase (« le mot du nœud »). */
export const MOT_NOEUD = {
  '1a': 'je suis en échec', '1b': 'il menace mat', '1c': 'une pièce en prise', '1d': 'la dernière rangée',
  '1e': 'une pièce clouée', '1f': 'il me menace', '2a': 'un mat', '2b': 'une prise qui gagne',
  '2c': 'un coup intermédiaire', '2d': 'une double attaque', '2e': 'une tactique', '3L': 'le livre',
  '3D': 'je développe', '3P': 'ma pire pièce', '3Y': 'la prophylaxie', '3C': 'mon plan',
};

/* Gabarits de l'étape 6, dans gabarits-parole.json section « arbre » (relus par l'Expert) : le gain et la perte NOMMÉS par
   composition, la même référence pour les deux ; le coup écarté au conditionnel ; jamais « score », « ligne », « candidat ». */
const A = GABARITS.arbre;
const PAROLE = { ecartePerte: A.ecarte_perte, ecarteMat: A.ecarte_mat, ecarteManque: A.ecarte_manque, seValent: A.se_valent, trou: A.trou, finRienDeTel: A.fin_rien_de_tel, finEvite: A.fin_evite };

const fenApresUci = (fen, pvUci) => { const c = new Chess(fen); for (const u of pvUci) { try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } } return c.fen(); };
const ligneFr = (fen, pvUci) => { const c = new Chess(fen), sans = []; for (const u of pvUci) { try { sans.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } } return { sans, fenBout: c.fen() }; };

/** Bilan matériel par type entre deux FEN, du point de vue de `camp` (positif = gagné). */
function bilanParType(fenA, fenB, camp) {
  const compte = (fen) => { const c = { P: 0, N: 0, B: 0, R: 0, Q: 0 }; for (const ch of fen.split(' ')[0]) { const l = ch.toLowerCase(); if (!VAL[l] || l === 'k') continue; const mien = (ch === ch.toUpperCase()) === (camp === 'w'); c[LETTRE[l]] += mien ? 1 : -1; } return c; };
  const a = compte(fenA), b = compte(fenB), out = {};
  for (const k of Object.keys(a)) out[k] = b[k] - a[k];
  return out;
}
const sommeMat = (bilan) => Object.entries(bilan).reduce((s, [t, n]) => s + VAL[t.toLowerCase()] * n, 0);
const estForcee = (fen, pvUci) => { const c = new Chess(fen); for (const u of pvUci) { let m; try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { return false; } if (!m.captured && !c.inCheck()) return false; } return true; };
/** Matériel net (en pions) du point de vue de `camp` dans une FEN. */
const materielNet = (fen, camp) => { let s = 0; for (const ch of fen.split(' ')[0]) { const l = ch.toLowerCase(); if (!VAL[l]) continue; s += (ch === ch.toUpperCase() ? 'w' : 'b') === camp ? VAL[l] : -VAL[l]; } return s; };

/**
 * La réfutation d'un coup écarté est-elle LISIBLE (demande de l'Expert) ? Oui si, dans sa ligne, la perte de matériel est
 * décidée par la réponse de l'adversaire et par mes reprises/coups forcés — jamais par un coup à MOI non forcé (sinon « je
 * perdais X » accuse un coup que je n'aurais pas joué). On saute le coup écarté lui-même (il est donné) ; mes coups d'après
 * la réponse adverse doivent être forcés (un seul coup légal, ou une reprise) tant que la perte n'est pas encore actée.
 */
export function refutationLisible(fenAvant, pvUci, camp) {
  const base = materielNet(fenAvant, camp), c = new Chess(fenAvant);
  for (let i = 0; i < (pvUci?.length ?? 0); i++) {
    if (c.turn() === camp && i >= 2) {
      const reprise = pvUci[i - 1] && pvUci[i - 1].slice(2, 4) === pvUci[i].slice(2, 4);
      if (c.moves().length > 1 && !reprise && materielNet(c.fen(), camp) >= base) return false; // mon coup libre, perte pas encore actée
    }
    try { c.move({ from: pvUci[i].slice(0, 2), to: pvUci[i].slice(2, 4), promotion: pvUci[i][4] }); } catch { break; }
  }
  return materielNet(c.fen(), camp) < base; // la perte est bien au bout de la ligne
}

export class Joueur {
  /** @param {{ camp?: string, budget?: number, code?: string, trou?: boolean }} opts */
  constructor(opts = {}) {
    this.budget = opts.budget ?? 400000;
    this.code = opts.code ?? null;
    this.trou = opts.trou ?? (process.env.COACH_TROU === '1'); // mesure du trou : option (double le temps par coup)
    this.recherche = new Recherche({ budget: this.budget });
  }

  /**
   * NOMMER un coup déjà choisi (par le calcul complet, ou joué dans une partie) : quelle question de l'arbre le produit ?
   * Rend les candidats de l'arbre pour la position et, pour le coup donné, le nœud le plus haut qui le reconnaît (ou
   * null : « sans nom »). Aucune recherche complète ; seulement la sonde des questions. Sert à la mesure « calcul puis
   * nommage » (Sébastien, 25 oct.) : le gros calcul choisit, l'arbre explique.
   * Deux modes (option `{ rapide }`) : LENT (par défaut, aujourd'hui) ou RAPIDE (sonde bornée, cible < 1 s/coup, pour
   * nommer un lot humain). Les deux restent appelables ; le pilote mesure leur accord. Le mode ne change RIEN à `choisir()`.
   *
   * VÉRIFICATION (demande de l'Expert) : chaque nœud qui reconnaît le coup porte `verifie: true/false`. 1c (« pièce en
   * prise ») n'est vérifié que si la ligne du coup nul gagne VRAIMENT du matériel (une pièce attaquée mais défendue n'est
   * pas en prise). Le nœud QUI NOMME est le plus haut VÉRIFIÉ ; si tous ses nœuds reconnaissants sont non vérifiés, le
   * coup est « sans nom ». La table « quand allumé » (`allumes`) donne, par nœud, tous les coups qu'il a proposés.
   * @param {string} fen @param {{ depart?: string, historique?: string[] }} contexte @param {string} uci le coup à nommer
   * @param {{ rapide?: boolean }} opts
   */
  nommer(fen, contexte = {}, uci, opts = {}) {
    const depart = contexte.depart ?? fen, historique = contexte.historique ?? [];
    const ech = new Echiquier(depart), chess = new Chess(depart);
    for (const u of historique) { const m = ech.coupDepuisUci(u); if (!m || !ech.jouer(m)) throw new Error(`historique : coup illégal ${u}`); chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); }
    if (!historique.length && depart !== fen) { ech.chargerFen(fen); chess.load(fen); }
    const fenAvant = chess.fen(), camp = chess.turn();
    const E0 = enCentipions(this.recherche.evaluationPosee(ech).score);
    const sonde = this.#sonde(ech, fenAvant, camp, E0, { rapide: !!opts.rapide });
    const { liste: tous, allumes } = candidatsEtAllumes({ fen: fenAvant, camp, depart, historique, sonde });
    const c = tous.find((x) => x.coup === uci) ?? null;
    // vérification par nœud reconnaissant ; le nœud qui nomme = le plus haut VÉRIFIÉ (les raisons sont déjà triées par l'arbre)
    if (c) for (const r of c.raisons) r.verifie = this.#verifie(r.noeud, sonde);
    const nommant = c ? c.raisons.find((r) => r.verifie !== false) ?? null : null;
    return {
      candidats: tous, allumes,
      noeud: nommant?.noeud ?? null, raison: nommant?.raison ?? null, raisons: c?.raisons ?? [],
      sonde: { menace: !!sonde.menace, monMat: !!sonde.monMat }, rapide: !!opts.rapide,
    };
  }

  /**
   * Drapeau « vérifié » d'un nœud qui reconnaît le coup. 1c : la pièce était-elle VRAIMENT en prise, c.-à-d. la ligne du
   * coup nul (`sonde.menace`) gagne-t-elle vraiment du matériel (≥ une pièce / l'échange, ou mat) ? Une pièce attaquée
   * mais défendue — ou dont l'attaquant est cloué — ne donne pas de menace réelle au coup nul : non vérifié. Les autres
   * nœuds ne mesurent rien de ce genre → vérifiés d'office (seul 1c est vérifié pour l'instant, point de l'Expert).
   */
  #verifie(noeud, sonde) {
    if (noeud !== '1c') return true;
    return !!sonde.menace && (sonde.menace.mat || (sonde.menace.gainMat ?? 0) >= 2);
  }

  async choisir(fen, contexte = {}) {
    const t0 = Date.now();
    const depart = contexte.depart ?? fen, historique = contexte.historique ?? [];
    const ech = new Echiquier(depart), chess = new Chess(depart);
    for (const u of historique) { const m = ech.coupDepuisUci(u); if (!m || !ech.jouer(m)) throw new Error(`historique : coup illégal ${u}`); chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); }
    if (!historique.length && depart !== fen) { ech.chargerFen(fen); chess.load(fen); }
    const fenAvant = chess.fen(), camp = chess.turn(), ply = chess.moveNumber() * 2 - (camp === 'w' ? 1 : 0);
    const E0 = enCentipions(this.recherche.evaluationPosee(ech).score);

    // --- la sonde (ce que les générateurs qui regardent plus loin qu'un coup réclament) ---
    const sonde = this.#sonde(ech, fenAvant, camp, E0);

    // --- l'arbre produit, la sélection donne les candidats à comparer (radar hors plafond, reste ≤ 3) ---
    const tous = candidatsArbre({ fen: fenAvant, camp, depart, historique, sonde });
    let retenus = selectionner(tous), arbreVide = false;
    if (!retenus.length) { // aucune question n'a produit : repli sur la recherche complète — c'est un trou « sans nom » par définition
      arbreVide = true;
      const plein = this.recherche.chercher(ech, { budget: this.budget });
      retenus = [{ coup: uciDe(plein.coup), noeud: null, raison: 'aucune de mes idées ne s\'applique', raisons: [] }];
    }

    // --- étape 4 : la recherche restreinte aux candidats ---
    const permis = retenus.map((c) => ({ c, m: ech.coupDepuisUci(c.coup) })).filter((x) => x.m != null);
    const res = this.recherche.chercher(ech, { budget: this.budget, racineLimitee: permis.map((x) => x.m) });
    const parUci = new Map(res.candidats.map((cd) => [uciDe(cd.coup), cd]));
    const evalues = permis.map(({ c }) => {
      const cd = parUci.get(c.coup);
      const cp = cd ? enCentipions(cd.score) : -100000;
      const pvUci = cd ? cd.pv.map(uciDe) : [c.coup];
      const { sans, fenBout } = ligneFr(fenAvant, pvUci);
      const bilan = bilanParType(fenAvant, fenBout, camp);
      let captured = null; try { captured = new Chess(fenAvant).move({ from: c.coup.slice(0, 2), to: c.coup.slice(2, 4), promotion: c.coup[4] })?.captured ?? null; } catch { /* coup illégal : ignoré */ }
      // gain et perte NOMMÉS par composition, contre la même référence (l'échiquier) : l'un des deux au plus est non nul
      return { ...c, cp, mat: cd ? cd.score >= MAT - 200 : false, matSubi: cd ? cd.score <= -(MAT - 200) : false, pvUci, ligne: sans, bilanMat: sommeMat(bilan), captured, gain: materielEnMots(bilan), perte: materielEnMots(Object.fromEntries(Object.entries(bilan).map(([k, v]) => [k, -v]))) };
    });

    // élagage : un candidat dont la ligne coûte du matériel compté (et ne mate pas) est écarté, AVEC sa ligne (la réfutation
    // qu'on dira). Les survivants ne perdent rien ; les élagués portent une perte (c'est ce qu'on nomme au conditionnel).
    const survivants = evalues.filter((c) => c.mat || c.bilanMat >= 0);
    const elagues = evalues.filter((c) => !(c.mat || c.bilanMat >= 0) && c.perte);
    const vivants = survivants.length ? survivants : evalues; // s'ils perdent tous du matériel (position perdue), on compare quand même
    // meilleur bilan net après sa meilleure réponse ; à égalité (< 10) la raison la plus haute dans l'arbre
    const mieux = (a, b) => (b.cp - a.cp) || (ORDRE.indexOf(a.noeud) - ORDRE.indexOf(b.noeud));
    const ordre = [...vivants].sort(mieux);

    // --- étape 5 : contrôle (le premier candidat, dans l'ordre, qui passe le contrôle) ---
    let M = null, alerte = null;
    for (const cand of ordre) { if (this.#controle(fenAvant, cand, camp)) { M = cand; break; } }
    if (!M) { M = ordre[0]; alerte = 'aucun candidat ne passe le contrôle : le coup joué laisse une menace non vue'; }

    // --- le trou (option) : la recherche complète tourne en plus ; si elle bat tous les candidats d'au moins 100, on la joue ---
    let trou = null;
    if (this.trou) {
      const plein = this.recherche.chercher(ech, { budget: this.budget });
      const cpPlein = enCentipions(plein.score), uciPlein = uciDe(plein.coup);
      const meilleurCand = Math.max(...evalues.map((c) => c.cp));
      if (cpPlein - meilleurCand >= BORNES.trou && !evalues.some((c) => c.coup === uciPlein)) {
        trou = this.#classerTrou(uciPlein, tous, fenAvant, camp, sonde);
        trou.etapeArbre = M.noeud; // l'étape où l'arbre se trouvait (le coup qu'il aurait joué) — pour le tableau de la mesure
        const { sans } = ligneFr(fenAvant, plein.pv.map(uciDe));
        M = { coup: uciPlein, noeud: null, raison: 'mon calcul trouve mieux que mes idées', raisons: [], cp: cpPlein, pvUci: plein.pv.map(uciDe), ligne: sans, trou: true };
      }
    }
    // un arbre vide est un trou « sans nom » par définition (aucune question n'a su quoi proposer) : on le note toujours
    if (arbreVide && !trou) trou = { san: sanDe(fenAvant, M.coup), classe: 'sans nom', noeud: null, etapeArbre: null };

    // --- pour la phrase : le survivant le plus proche (« les deux se valent ») et le meilleur élagué (« j'ai pensé à … mais ») ---
    const survivantSuivant = ordre.find((c) => c.coup !== M.coup) ?? null;
    const elagueBest = [...elagues].sort((a, b) => b.cp - a.cp)[0] ?? null;

    // reprise : le coup choisi prend la pièce qui vient de prendre (même case) — son matériel se compte contre la position
    // d'AVANT sa prise, donc ce n'est pas un gain. On le dit « je reprends en … ».
    const reprise = this.#reprise(depart, historique, fenAvant, M.coup);

    // --- étape 6 : la parole ---
    const { phrase, ecarte, alerte: alerteP } = this.#dire(M, survivantSuivant, elagueBest, ply, fenAvant, camp, reprise);
    if (alerteP && !alerte) alerte = alerteP;

    const san = sanDe(fenAvant, M.coup);
    const rec = {
      ply, camp, san, uci: M.coup, fenAvant, coach: true,
      noeud: M.noeud, sorte: M.noeud ?? 'trou', raison: M.raison, gain: reprise ? null : (M.gain ?? null), reprise: !!reprise,
      score: M.cp, evalAvant: E0, ligne: M.ligne, profondeur: res.profondeur, noeuds: res.noeuds,
      candidats: evalues.map((c) => ({ san: sanDe(fenAvant, c.coup), coup: c.coup, noeud: c.noeud, raison: c.raison, score: c.cp, ligne: c.ligne })),
      choisi: M.coup, ecarte, trou,
      phrase, ms: Date.now() - t0,
    };
    if (alerte) rec.alerte = alerte;
    return rec;
  }

  /**
   * La sonde : menace adverse (coup nul), parade par test, mon mat (courte recherche), prophylaxie, « que menacé-je ? ».
   * Réutilise Recherche.menace. Deux modes :
   *  - LENT (par défaut, comme `choisir()`) : menace à budget/6, mon mat par recherche profondeur 6, 2f sur TOUS mes coups.
   *  - RAPIDE (`{ rapide: true }`, pour nommer un lot humain en < 1 s/coup) : 1f borné à 15 000 ; 2a (mon mat) cherché par
   *    les ÉCHECS seulement, profondeur 3 ; 2f ne sonde que les coups MENAÇANTS (prise, échec, ou coup qui attaque de plus
   *    une pièce adverse / la zone de son roi), à 2 000 chacun. La menace retenue reste RÉELLE (gain au coup nul ou mat).
   */
  #sonde(ech, fenAvant, camp, E0, { rapide = false } = {}) {
    const budMenace = rapide ? 15000 : Math.trunc(this.budget / 6);
    const budParee = rapide ? 2000 : Math.trunc(this.budget / 10);
    const mn = this.recherche.menace(ech, { budget: budMenace, profondeurMax: 4 });
    let menace = null, paree = null, prophylaxie = null; // paree au PREMIER niveau de la sonde (contrat des générateurs 1b/1f)
    if (mn) {
      const pvUci = mn.pv.map(uciDe), estMat = mn.score >= MAT - 200;
      const ech2 = new Echiquier(fenAvant); ech2.jouerNul();
      const fenBout = fenApresUci(ech2.fen(), pvUci);
      const bilan = bilanParType(fenAvant, fenBout, camp);
      const perte = materielEnMots(Object.fromEntries(Object.entries(bilan).map(([k, v]) => [k, -v])));
      const gainMat = -sommeMat(bilan); // ce qu'il gagne en matériel
      const ligneMenace = ligneFr(ech2.fen(), pvUci).sans.slice(0, 4).join(' puis '); // sa ligne menaçante, ≤ 4 demi-coups, pour « il menace … »
      if (estMat || gainMat > 0) { menace = { mat: estMat, perte: estMat ? 'la partie (mat)' : perte ?? 'du matériel', ligne: ligneMenace, pvUci, gainMat }; paree = this.#pareeFab(fenAvant, pvUci, estMat, camp, budParee); }
      else if (enCentipions(mn.score) + E0 >= 50) { // menace positionnelle : prophylaxie (lui enlever son idée = la rendre illégale après mon coup)
        const idee = ligneFr(ech2.fen(), [pvUci[0]]).sans[0];
        prophylaxie = { idee: idee || null, paree: this.#prophPareeFab(fenAvant, pvUci[0]) };
      }
    }
    let monMat;
    if (rapide) monMat = this.#matParEchecs(fenAvant, 3);
    else { const probe = this.recherche.chercher(ech, { budget: Math.min(this.budget, 120000), profondeurMax: 6 }); monMat = probe.coup && probe.score >= MAT - 200 ? { coup: uciDe(probe.coup) } : null; }
    const mesMenaces = this.#mesMenaces(fenAvant, camp, rapide ? { budget: 2000, menacantsSeuls: true } : {});
    return { menace, paree, prophylaxie, monMat, mesMenaces };
  }

  /**
   * 2a rapide — « ai-je un mat ? » par les ÉCHECS seulement, profondeur `profMax` (nombre de mes coups). Chacun de mes
   * coups est un échec ; l'adversaire a toutes ses réponses ; je mate si, après un échec, soit c'est mat, soit toutes ses
   * réponses mènent encore à un mat forcé par échecs. Quelques milliers de positions au plus (plafond de sûreté). Rend
   * `{ coup }` (le premier coup d'un mat forcé) ou null. Approxime la recherche profonde : les mats « tranquilles » (un
   * coup non-échec dans la séquence) lui échappent — c'est un désaccord assumé, publié avec la mesure.
   */
  #matParEchecs(fenAvant, profMax = 3) {
    const chess = new Chess(fenAvant); // un seul échiquier, coup/reprise (pas de re-lecture de FEN par nœud)
    let noeuds = 0; const PLAFOND = 8000;
    const rec = (prof) => {
      for (const m of chess.moves({ verbose: true })) {
        if (++noeuds > PLAFOND) return null;
        chess.move(m);
        let trouve = null;
        if (chess.inCheck()) {
          if (chess.isCheckmate()) trouve = m;
          else if (prof > 1) {
            const reps = chess.moves({ verbose: true });
            let toutes = reps.length > 0;
            for (const r of reps) { chess.move(r); const sub = rec(prof - 1); chess.undo(); if (!sub) { toutes = false; break; } }
            if (toutes) trouve = m;
          }
        }
        chess.undo();
        if (trouve) return trouve;
      }
      return null;
    };
    const m = rec(profMax);
    return m ? { coup: m.from + m.to + (m.promotion ?? '') } : null;
  }

  /**
   * « Que menacé-je ? » (2f) : pour chacun de mes coups M, je joue M, l'adversaire passe (coup nul), et ma
   * recherche courte dit ce que je gagne alors — c'est `menace()` retourné vers mon camp. On garde les coups qui créent
   * une menace de mat, une fourchette / un échec qui gagne, ou un gain de pièce (≥ 2), le plus fort d'abord, trois au plus.
   * Le candidat est M (le premier coup de ma ligne) ; la phrase donne la ligne « s'il ne fait rien ».
   */
  #mesMenaces(fenAvant, camp, { budget = Math.min(Math.trunc(this.budget / 12), 40000), menacantsSeuls = false } = {}) {
    const out = [];
    const map0 = menacantsSeuls ? buildAttackMap(fenAvant) : null;
    const profMax = menacantsSeuls ? 3 : 4; // rapide : profondeur 3 pour tenir les ~2 000 positions (la recherche finit son palier)
    let aSonder = new Chess(fenAvant).moves({ verbose: true });
    if (menacantsSeuls) { // ne sonder que les coups qui PEUVENT menacer, et au plus les 10 plus prometteurs (directive : 5 à 10)
      aSonder = aSonder.map((mv) => ({ mv, prio: this.#estMenacant(fenAvant, mv, camp, map0) })).filter((x) => x.prio > 0)
        .sort((a, b) => b.prio - a.prio).slice(0, 10).map((x) => x.mv);
    }
    for (const mv of aSonder) {
      const uciM = mv.from + mv.to + (mv.promotion ?? '');
      const fenM = fenApresUci(fenAvant, [uciM]);
      const echM = new Echiquier(fenM);
      const mn = this.recherche.menace(echM, { budget, profondeurMax: profMax }); // mon meilleur coup s'il passe
      if (!mn) continue;
      const estMat = mn.score >= MAT - 200;
      const echN = new Echiquier(fenM); echN.jouerNul(); const fenMN = echN.fen(); // à moi de jouer (il a passé)
      const pvUci = mn.pv.map(uciDe);
      const fenBout = fenApresUci(fenMN, pvUci);
      const gainMat = sommeMat(bilanParType(fenAvant, fenBout, camp)); // le gain net de tout mon plan de deux coups
      if (!estMat && gainMat < 2) continue; // en position calme, rien n'est menacé : on ne produit pas
      const sanM = ligneFr(fenAvant, [uciM]).sans[0];
      const { sans: sansSuite } = ligneFr(fenMN, pvUci);
      const ligneTxt = [sanM, ...sansSuite].slice(0, 4).join(' puis ');
      let quoi;
      if (estMat) quoi = 'mat';
      else {
        let m2cap = null; try { m2cap = new Chess(fenMN).move({ from: pvUci[0].slice(0, 2), to: pvUci[0].slice(2, 4), promotion: pvUci[0][4] })?.captured ?? null; } catch { /* ignore */ }
        const m2echec = (() => { try { const c = new Chess(fenMN); c.move({ from: pvUci[0].slice(0, 2), to: pvUci[0].slice(2, 4), promotion: pvUci[0][4] }); return c.inCheck(); } catch { return false; } })();
        quoi = m2echec && m2cap ? 'une fourchette' : m2cap ? saPiece(m2cap) : 'du matériel';
      }
      out.push({ coup: uciM, raison: `je menace ${quoi} : s'il ne fait rien, ${ligneTxt}`, _mat: estMat, _gain: gainMat });
    }
    out.sort((a, b) => (b._mat - a._mat) || (b._gain - a._gain));
    return out.slice(0, 3).map(({ _mat, _gain, ...t }) => t);
  }

  /**
   * Un coup PEUT-il être une VRAIE menace, et avec quelle PRIORITÉ (0 = non menaçant) ? Filtre bon marché du mode rapide,
   * aucune recherche complète. « Attaqué de plus » au sens large laisserait passer la moitié des coups du milieu de jeu ;
   * on exige une menace RÉELLE, comme la sonde qui suit (gain au coup nul ou mat), et on classe par promesse pour ne
   * sonder que les plus prometteurs :
   *  - prise ou échec (toujours à vérifier) ;
   *  - après le coup, une pièce adverse devient GAGNABLE (mini-échange favorable) et ne l'était pas avant — un gain créé ;
   *  - après le coup, s'il passe (coup nul), j'ai un mat en 1 par un échec — une menace de mat (Te1 → Cd6#, Fc2 → Dh7#…),
   *    priorité maximale (une menace de mat prime sur un gain) pour ne jamais être écartée par le plafond de sondes.
   * Le mat en 1 par les échecs est bon marché (mes seuls échecs testés) ; la sonde de 2 000 confirme la menace réelle.
   */
  #estMenacant(fenAvant, mv, camp, map0 = buildAttackMap(fenAvant)) {
    const uciM = mv.from + mv.to + (mv.promotion ?? '');
    const fenM = fenApresUci(fenAvant, [uciM]);
    let prio = 0;
    if (mv.captured) prio = Math.max(prio, 2 + VAL[mv.captured]); // prise : la valeur prise
    if (new Chess(fenM).inCheck()) prio = Math.max(prio, 5); // échec
    const map1 = buildAttackMap(fenM);
    // un gain CRÉÉ : une pièce adverse devient gagnable (mini-échange) et ne l'était pas avant. gainEchange prend le
    // PROPRIÉTAIRE de la pièce (l'adverse) et rend ce que moi je gagne en ouvrant les prises.
    for (const p of map1.pieces) {
      if (p.color !== other(camp) || p.type === 'k') continue;
      const avant = map0.at[p.square] && map0.at[p.square].color === p.color ? gainEchange(map0, p.square, p.color) : 0;
      const ap = gainEchange(map1, p.square, p.color);
      if (ap > 0 && avant <= 0) prio = Math.max(prio, 3 + ap);
    }
    // menace de mat : s'il passe (coup nul), ai-je un mat en 1 par un échec ? Priorité maximale.
    const fenNul = fenM.replace(/ (w|b) /, ` ${camp} `);
    try { if (this.#matParEchecs(fenNul, 1)) prio = Math.max(prio, 20); } catch { /* position inhabituelle après le retournement du trait : on laisse */ }
    return prio;
  }

  /** Parade par test (1b, 1f) : après mon coup, sa ligne menaçante ne gagne-t-elle plus (ni ne mate) ? */
  #pareeFab(fenAvant, menacePvUci, estMat, camp, budget = Math.trunc(this.budget / 10)) {
    return (uci) => {
      const e2 = new Echiquier(fenAvant); const m = e2.coupDepuisUci(uci); if (!m || !e2.jouer(m)) return false;
      const t = e2.coupDepuisUci(menacePvUci[0]); if (!t) return true; // son coup menaçant n'existe plus
      const n = this.recherche.noterCoup(e2, t, { prof: 3, budget });
      if (n.score >= MAT - 200) return false; // il mate encore
      if (estMat) return true; // ce n'était un mat que par cette ligne, qui ne mate plus
      const e3 = new Echiquier(fenAvant); e3.jouer(e3.coupDepuisUci(uci));
      const fenBout = fenApresUci(e3.fen(), n.pv.map(uciDe));
      return sommeMat(bilanParType(e3.fen(), fenBout, camp)) >= 0; // il ne gagne plus de matériel
    };
  }

  /** Prophylaxie (3Y) : mon coup rend-il son idée (un coup positionnel) illégale pour lui ? (lui enlever sa cible). */
  #prophPareeFab(fenAvant, ideeUci) {
    return (uci) => {
      const e2 = new Echiquier(fenAvant); const m = e2.coupDepuisUci(uci); if (!m || !e2.jouer(m)) return false;
      if (uci === ideeUci) return false; // je ne compte pas comme prophylaxie le fait de jouer sa case moi-même via son propre coup
      return e2.coupDepuisUci(ideeUci) == null; // son idée n'est plus jouable
    };
  }

  /**
   * Contrôle (étape 5) : sur la position après le coup, « que menace-t-il ? ». Si sa meilleure réponse gagne du matériel
   * (≥ 80) ou mate ET que la ligne calculée du candidat ne l'avait PAS prévue (son 2e demi-coup ≠ cette réponse), le coup
   * laisse une menace non vue → il ne passe pas. Si la réponse était prévue, le score du candidat en tient déjà compte.
   */
  #controle(fenAvant, cand, camp) {
    if (cand.mat) return true; // un mat forcé ne se contrôle pas
    const e = new Echiquier(fenAvant); const m = e.coupDepuisUci(cand.coup); if (!m || !e.jouer(m)) return false;
    const mn = this.recherche.menace(e, { budget: Math.trunc(this.budget / 8), profondeurMax: 4 });
    if (!mn) return true;
    const fenBout = fenApresUci(e.fen(), mn.pv.map(uciDe));
    const grave = mn.score >= MAT - 200 || -sommeMat(bilanParType(e.fen(), fenBout, camp)) * 100 >= BORNES.menace;
    if (!grave) return true;
    const prevue = cand.pvUci[1] != null && uciDe(mn.pv[0]) === cand.pvUci[1]; // sa meilleure réponse était-elle le 2e demi-coup de la ligne du candidat ?
    return prevue;
  }

  /**
   * Dire (étape 6) : la question du nœud qui a produit le coup ; puis, si un coup qui perdait du matériel était à 80 ou
   * plus (le meilleur élagué, sa réfutation se lit) « j'ai pensé à X, mais … » au conditionnel ; sinon, si un autre coup
   * se valait (< 10), « X ou Y : les deux se valent ». Rend aussi l'« écarté » du fichier de partie (le coup verbalisé).
   */
  /** Le coup `uci` reprend-il la pièce qui vient de prendre (même case) ? Rend { case } ou null. */
  #reprise(depart, historique, fenAvant, uci) {
    if (!historique.length) return null;
    const dernier = historique[historique.length - 1];
    const avant = new Chess(depart);
    try { for (const u of historique.slice(0, -1)) avant.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { return null; }
    let mvDer; try { mvDer = avant.move({ from: dernier.slice(0, 2), to: dernier.slice(2, 4), promotion: dernier[4] }); } catch { return null; }
    if (!mvDer?.captured || uci.slice(2, 4) !== dernier.slice(2, 4)) return null; // il n'a pas pris, ou je ne reprends pas sur sa case
    let mvM; try { mvM = new Chess(fenAvant).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); } catch { return null; }
    return mvM?.captured ? { case: dernier.slice(2, 4) } : null;
  }

  #dire(M, survivantSuivant, elagueBest, ply, fenAvant, camp, reprise) {
    const sanM = sanDe(fenAvant, M.coup);
    if (M.trou) return { phrase: remplir(PAROLE.trou, { M: sanM, gain: M.gain ? ` Je gagne ${M.gain}.` : '' }).replace(/\s+/g, ' ').trim(), ecarte: null, alerte: null };
    // reprise : le matériel se compte contre la position d'avant sa prise → ce n'est pas un gain, on dit « je reprends ».
    let mainRaison, gainDit = false;
    if (reprise) mainRaison = `je reprends en ${reprise.case}`;
    else {
      // (défaut 1) le gain de M nommé par composition : « je gagne une pièce » ; si la ligne ne garde pas de gain net, on
      // retire la vantardise « et je gagne du matériel » au lieu de la laisser.
      mainRaison = M.raison || MOT_NOEUD[M.noeud] || 'je joue ce coup';
      if (/gagne du matériel/.test(mainRaison)) mainRaison = M.gain ? mainRaison.replace('du matériel', M.gain) : mainRaison.replace(/ et je gagne du matériel/, '');
      gainDit = !!M.gain && /gagne/.test(mainRaison); // la première phrase a déjà dit le gain de M → on omet « rien de tel »
    }
    const fin = gainDit ? remplir(PAROLE.finEvite, { M: sanM }) : remplir(PAROLE.finRienDeTel, { M: sanM });
    const parties = [cap(mainRaison) + '.'];
    let ecarte = null;
    // (a) un coup tentant qui PERDAIT, et dont la réfutation se lit (perte forcée, pas un coup à moi non forcé — défaut 3)
    if (elagueBest && M.cp - elagueBest.cp >= BORNES.ecarteDit && refutationLisible(fenAvant, elagueBest.pvUci, camp)) {
      const sanR = sanDe(fenAvant, elagueBest.coup);
      const ligneR = ligneTexte(coupe(elagueBest.ligne, fenAvant, elagueBest.pvUci), ply);
      parties.push(remplir(elagueBest.matSubi ? PAROLE.ecarteMat : PAROLE.ecartePerte, { R: sanR, ligneR, perteR: elagueBest.perte ?? 'du matériel', fin }));
      ecarte = { san: sanR, coup: elagueBest.coup, raison: elagueBest.raison, ligne: elagueBest.ligne, pvUci: elagueBest.pvUci, perte: elagueBest.perte ?? 'la partie', mat: !!elagueBest.matSubi };
    }
    // (b) GAIN MANQUÉ (défaut 2) : M gagne une pièce (par une prise), le meilleur autre coup ne la gagne pas → « il sauvait sa pièce »
    else if (M.captured && M.gain && survivantSuivant && M.cp - survivantSuivant.cp >= BORNES.ecarteDit && !survivantSuivant.gain) {
      const sanR = sanDe(fenAvant, survivantSuivant.coup);
      parties.push(remplir(PAROLE.ecarteManque, { R: sanR, sauve: saPiece(M.captured) }));
      ecarte = { san: sanR, coup: survivantSuivant.coup, raison: survivantSuivant.raison, ligne: survivantSuivant.ligne, pvUci: survivantSuivant.pvUci, manque: saPiece(M.captured) };
    }
    // deux coups qui se valent (< 10) : on dit la raison du nœud
    else if (survivantSuivant && Math.abs(M.cp - survivantSuivant.cp) < BORNES.seValent) {
      // la raison du nœud est déjà la première phrase : on ne la redit pas (« J'ai pris e4. »). Au livre, la seule chose à
      // ajouter est que c'est le répertoire.
      const suite = M.noeud === '3L' ? ' : c\'est mon répertoire' : '';
      parties.push(remplir(PAROLE.seValent, { M: sanM, R: sanDe(fenAvant, survivantSuivant.coup), suite }));
    }
    return { phrase: parties.join(' ').replace(/\s+/g, ' ').trim(), ecarte, alerte: null };
  }

  /** Classe le trou : coupé (l'arbre l'a produit mais la sélection l'a écarté), pas reconnu avant (son point apparaît un coup plus loin), sans nom (aucune question). */
  #classerTrou(uci, tous, fenAvant, camp, sonde) {
    const produit = tous.find((c) => c.coup === uci);
    if (produit) return { san: sanDe(fenAvant, uci), classe: 'coupé', noeud: produit.noeud };
    // pas reconnu avant : après le coup, est-ce que je menace quelque chose qu'une question nommerait (gain matériel / mat) ?
    const e = new Echiquier(fenAvant); const m = e.coupDepuisUci(uci); if (m) e.jouer(m);
    const mn = m ? this.recherche.menace(e, { budget: Math.trunc(this.budget / 8), profondeurMax: 4 }) : null; // ce que JE menacerai s'il passe (coup nul après le mien)
    if (mn && (mn.score >= MAT - 200 || -sommeMat(bilanParType(e.fen(), fenApresUci(e.fen(), mn.pv.map(uciDe)), camp)) > 0)) return { san: sanDe(fenAvant, uci), classe: 'pas reconnu avant', noeud: null };
    return { san: sanDe(fenAvant, uci), classe: 'sans nom', noeud: null };
  }
}

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const remplir = (g, d) => g.replace(/\{(\w+)\}/g, (_, k) => (d[k] ?? `{${k}}`));
const sanDe = (fen, uci) => { try { return toFrenchSan(new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san); } catch { return uci; } };
/** Coupe la ligne à 4 demi-coups dans le calme, 8 dans le forcé (ce qu'un 1500 calcule vraiment). */
function coupe(sans, fenAvant, pvUci) { const n = estForcee(fenAvant, pvUci) ? 8 : 4; return sans.slice(0, n); }

export { Joueur as JoueurArbre };
