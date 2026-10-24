/**
 * Le coach joueur : il choisit ses coups avec son propre échiquier, sa propre évaluation et sa propre recherche, et
 * rend pour chaque coup la trace qui le justifie (docs/coach-joueur/CHANTIERS-2026-10-24.md, pages 1 et 2).
 *
 * Aucun moteur, aucune évaluation extérieure n'entre ici : `choisir(fen, contexte)` ne reçoit que la position, la
 * position de départ et les coups joués (pour la répétition, les 50 coups et le livre). Les nombres de la trace sont en
 * centipions affichés, du point de vue du coach.
 *
 * Ordre des sortes : livre (tant qu'on y est) ; puis calcul > défense > plan > amélioration. Les termes cités sont ceux
 * présents juste après le coup ET au bout de la ligne. La menace vue vient du coup nul, jamais en finale de pions, et
 * elle est revérifiée après le coup joué et après le coup battu.
 */
import { Chess } from 'chess.js';
import { Echiquier, DEPART, uci as uciDe } from './echiquier.mjs';
import { evaluer, evaluerDetail, enCentipions, valeurTerme } from './evaluation.mjs';
import { Recherche, MAT } from './recherche.mjs';
import { formuler, materielEnMots, maPiece, saPiece, GABARITS } from './parole.mjs';
import { toFrenchSan } from '../notation.mjs';
import { lineMotifs } from '../motifs.mjs';
import { buildStructureFacts } from '../../positional/structures.js';
import { instancier } from '../plans-structures.mjs';
import { distance, estLevier, suivre, libelle } from '../plan-distance.mjs';
import { LIVRE as LIVRE_FR } from '../../livres/francaise.js';
import { LIVRE as LIVRE_IT } from '../../livres/italienne.js';
import { LIVRE as LIVRE_ES } from '../../livres/espagnole.js';

const LIVRES = new Map();
for (const L of [LIVRE_FR, LIVRE_IT, LIVRE_ES]) for (const e of L) if (!LIVRES.has(e.coups)) LIVRES.set(e.coups, e);

// Bornes (centipions affichés) : docs/coach-joueur/CHANTIERS, en tête.
export const BORNES = Object.freeze({ plan: { parPas: 10, plafond: 30, adoption: 30, abandon: 100 }, livre: 50, seValent: 10, gain: 80, menace: 80, termeCite: 10 });
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const LETTRE = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' };

/** Bilan matériel par type entre deux FEN, du point de vue de `camp` (positif = gagné). */
function bilanMateriel(fenAvant, fenApres, camp) {
  const compte = (fen) => { const c = { P: 0, N: 0, B: 0, R: 0, Q: 0 }; for (const ch of fen.split(' ')[0]) { const l = ch.toLowerCase(); if (!(l in VAL) || l === 'k') continue; const mien = (ch === ch.toUpperCase()) === (camp === 'w'); c[LETTRE[l]] += mien ? 1 : -1; } return c; };
  const a = compte(fenAvant), b = compte(fenApres), out = {};
  for (const k of Object.keys(a)) out[k] = b[k] - a[k];
  return out; // positif : l'adversaire en a perdu plus que nous
}

/** Les termes d'une position agrégés par nom, du point de vue de `camp`, en centipions affichés. */
function termesAgreges(ech, camp) {
  const d = evaluerDetail(ech), agg = new Map();
  for (const t of d.termes) {
    const v = enCentipions(valeurTerme(t, d.phase)) * (t.camp === camp ? 1 : -1);
    const e = agg.get(t.nom) ?? { valeur: 0, entrees: [] };
    e.valeur += v; e.entrees.push({ ...t, cp: v });
    agg.set(t.nom, e);
  }
  return { agg, detail: d };
}

const estFinaleDePions = (fen) => !/[nbrqNBRQ]/.test(fen.split(' ')[0]);

export class Joueur {
  /** @param {{ camp?: 'w'|'b', budget?: number, code?: string }} opts */
  constructor(opts = {}) {
    this.budget = opts.budget ?? 400000;
    this.code = opts.code ?? null;
    this.recherche = new Recherche({ budget: this.budget, candidatsExacts: 4 });
    this.plan = null; // { plan, pourquoi, nom, structure, cumul, adopteAuPly }
    this.dernierDansLivre = null;
  }

  /**
   * @param {string} fen  position courante (ignorée si `contexte.depart` et `contexte.historique` sont donnés)
   * @param {{ camp?: string, ply?: number, depart?: string, historique?: string[] }} contexte
   * @returns {object} l'enregistrement du coup (contrat page 3)
   */
  async choisir(fen, contexte = {}) {
    const t0 = Date.now();
    const depart = contexte.depart ?? fen, historique = contexte.historique ?? [];
    const ech = new Echiquier(depart), chess = new Chess(depart);
    for (const u of historique) { const m = ech.coupDepuisUci(u); if (!m || !ech.jouer(m)) throw new Error(`historique : coup illégal ${u}`); chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); }
    if (!historique.length && depart !== fen) { ech.chargerFen(fen); chess.load(fen); }
    const fenAvant = chess.fen(), camp = chess.turn(), ply = (contexte.ply ?? historique.length) + 1;
    const sanFr = (uciCoup, depuis = fenAvant) => { const c = new Chess(depuis); const m = c.move({ from: uciCoup.slice(0, 2), to: uciCoup.slice(2, 4), promotion: uciCoup[4] }); return { san: toFrenchSan(m.san), brut: m.san, m }; };
    const ligneFr = (pv, depuis = fenAvant) => { const c = new Chess(depuis), out = []; for (const u of pv) { try { out.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } } return { sans: out, fenBout: c.fen() }; };

    // --- l'évaluation avant, la recherche ---
    const E0 = enCentipions(evaluer(ech));
    const res = this.recherche.chercher(ech, { budget: this.budget });
    if (!res.coup) throw new Error('aucun coup légal');
    const cands = res.candidats.map((c) => ({ ...c, uci: uciDe(c.coup), cp: enCentipions(c.score), pvUci: c.pv.map(uciDe) }));

    // --- le livre ---
    const cle = chess.history().join(' ');
    // À la racine (aucun coup joué, Blancs), le répertoire commence par 1.e4 : la raison est le « sens » écrit au livre.
    const entree = LIVRES.get(cle) ?? (cle === '' && fenAvant === DEPART && LIVRES.has('e4') ? { plan: [{ san: 'e4', pourquoi: LIVRES.get('e4').sens ?? 'le début de mon répertoire' }] } : null);
    const livreAvant = historique.length ? LIVRES.has(chess.history().slice(0, -1).join(' ')) || historique.length === 1 : false;
    let livre = null, coupLivre = null;
    if (entree?.plan?.length) {
      const L = entree.plan[0];
      const legal = chess.moves({ verbose: true }).find((m) => m.san === L.san);
      if (legal) {
        coupLivre = { uci: legal.from + legal.to + (legal.promotion ?? ''), san: toFrenchSan(L.san), raison: L.pourquoi };
        let cand = cands.find((c) => c.uci === coupLivre.uci);
        if (cand && !cand.exact) cand = null;
        if (!cand) { const m = ech.coupDepuisUci(coupLivre.uci); const n = this.recherche.noterCoup(ech, m, { prof: res.profondeur }); cand = { coup: m, uci: coupLivre.uci, score: n.score, cp: enCentipions(n.score), pv: n.pv, pvUci: n.pv.map(uciDe), exact: true }; cands.push(cand); }
        coupLivre.cand = cand;
        livre = cands[0].cp - cand.cp > BORNES.livre ? { refus: true, L: coupLivre.san, ligneL: ligneFr(cand.pvUci).sans, raison: L.pourquoi } : { refus: false, raison: L.pourquoi, L: coupLivre.san };
      }
    }
    const finDuLivre = !entree && livreAvant && historique.length > 0 && this.dernierDansLivre === historique.length - 1;
    if (entree) this.dernierDansLivre = historique.length;

    // --- le plan : structure, adoption, terme ---
    const exacts = cands.filter((c) => c.exact);
    const structures = buildStructureFacts(fenAvant).filter((t) => (t.kind ?? t.type) === 'STRUCTURE').map((t) => t.params ?? t);
    const structureNom = structures.map((s) => `${s.name}:${s.color}`).sort().join('|');
    let planRec = null;
    const planCourant = this.plan;
    if (planCourant) {
      // le plan suit les pièces depuis son adoption : on le remet à jour sur les coups joués depuis
      const dHist = distance(fenAvant, camp, planCourant.plan);
      if (dHist.d === 0) { planRec = { abandon: null, realise: true }; this.plan = null; }
      else if (planCourant.structure !== structureNom && structureNom) { planRec = { abandon: 'sans_objet', ancien: planCourant.nom, objetDisparu: 'la structure' }; this.plan = null; }
      else if (planCourant.cumul > BORNES.plan.abandon) { planRec = { abandon: 'cher', ancien: planCourant.nom }; this.plan = null; }
    }
    const planTerme = (plan, cand) => { // (distance à la racine − distance au bout de la ligne) × 10, plafonné à ± 30
      const d0 = distance(fenAvant, camp, plan).d;
      const c = new Chess(fenAvant); let p = plan;
      for (const u of cand.pvUci) { let m; try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } p = suivre(p, m); }
      const dBout = distance(c.fen(), camp, p).d;
      const c1 = new Chess(fenAvant), m1 = c1.move({ from: cand.uci.slice(0, 2), to: cand.uci.slice(2, 4), promotion: cand.uci[4] });
      const dApres = distance(c1.fen(), camp, suivre(plan, m1)).d;
      return { terme: Math.max(-BORNES.plan.plafond, Math.min(BORNES.plan.plafond, (d0 - dBout) * BORNES.plan.parPas)), d0, dApres, dBout };
    };
    let adopteMaintenant = false;
    if (!this.plan && structures.length) {
      const propositions = [];
      for (const s of structures) for (const inst of instancier(fenAvant, camp, s.name, s.color)) {
        if (!estLevier(fenAvant, camp, inst.plan)) continue;
        const d0 = distance(fenAvant, camp, inst.plan).d;
        if (!(d0 > 0) || !Number.isFinite(d0)) continue;
        let meilleurPas = null;
        for (const cand of exacts) { const pt = planTerme(inst.plan, cand); if (pt.dApres < d0) { const cout = cands[0].cp - cand.cp; if (!meilleurPas || cout < meilleurPas.cout) meilleurPas = { cand, cout }; } }
        if (meilleurPas && meilleurPas.cout <= BORNES.plan.adoption) propositions.push({ ...inst, d0, cout: meilleurPas.cout, structure: structureNom });
      }
      if (propositions.length) {
        propositions.sort((a, b) => a.cout - b.cout);
        const p = propositions[0];
        this.plan = { plan: p.plan, pourquoi: p.pourquoi, nom: libelle(p.plan, fenAvant), structure: structureNom, cumul: 0, adopteAuPly: ply };
        adopteMaintenant = true;
      }
    }
    for (const c of exacts) { c.planTerme = 0; c.total = c.cp; }
    let planInfo = null;
    if (this.plan) {
      for (const c of exacts) { const pt = planTerme(this.plan.plan, c); c.planTerme = pt.terme; c.total = c.cp + pt.terme; c.dApres = pt.dApres; c.d0 = pt.d0; }
    }

    // --- le choix : M, et R le meilleur autre coup exact ---
    exacts.sort((a, b) => b.total - a.total);
    let M = livre && !livre.refus ? coupLivre.cand : exacts[0];
    if (!M.total && M.total !== 0) { M.planTerme = 0; M.total = M.cp; }
    const R = exacts.find((c) => c !== M) ?? null;
    const mM = sanFr(M.uci), pieceM = LETTRE[mM.m.piece], caseM = mM.m.to;
    const apresM = new Chess(fenAvant); apresM.move({ from: M.uci.slice(0, 2), to: M.uci.slice(2, 4), promotion: M.uci[4] });
    const ligneM = ligneFr(M.pvUci), ligneR = R ? ligneFr(R.pvUci) : { sans: [], fenBout: fenAvant };
    const ecart = R ? M.total - R.total : 0;

    // --- la menace adverse (coup nul), revérifiée après M et après R ---
    let menace = null;
    if (!estFinaleDePions(fenAvant)) {
      const mn = this.recherche.menace(ech, { budget: Math.trunc(this.budget / 6), profondeurMax: 4 });
      if (mn) {
        const valeur = enCentipions(mn.score) + E0; // ce qu'on perdrait en passant
        if (valeur >= BORNES.menace) {
          const pvUci = mn.pv.map(uciDe); const ech2 = new Echiquier(fenAvant); ech2.jouerNul();
          const lm = ligneFr(pvUci, ech2.fen());
          const bilan = bilanMateriel(fenAvant, lm.fenBout, camp);
          const paree = (c) => c.cp >= E0 - valeur / 2;
          menace = { ligne: lm.sans, gain: valeur, perte: materielEnMots(Object.fromEntries(Object.entries(bilan).map(([k, v]) => [k, -v]))) ?? 'du terrain', pareeApresM: paree(M), pareeApresR: R ? paree(R) : true };
        }
      }
    }

    // --- les termes cités : présents juste après M et au bout de la ligne ---
    const avant = termesAgreges(ech, camp);
    const echM = new Echiquier(apresM.fen()), echBout = new Echiquier(ligneM.fenBout);
    const apres = termesAgreges(echM, camp), bout = termesAgreges(echBout, camp);
    const noms = new Set([...avant.agg.keys(), ...apres.agg.keys(), ...bout.agg.keys()]);
    const termes = [];
    for (const nom of noms) {
      const v0 = avant.agg.get(nom)?.valeur ?? 0, v1 = apres.agg.get(nom)?.valeur ?? 0, v2 = bout.agg.get(nom)?.valeur ?? 0;
      const d1 = v1 - v0, d2 = v2 - v0;
      if (Math.abs(d1) < BORNES.termeCite || Math.abs(d2) < BORNES.termeCite || Math.sign(d1) !== Math.sign(d2)) continue;
      termes.push(this.#terme(nom, d1, d2, apres.agg.get(nom), avant.agg.get(nom), camp, pieceM, caseM, mM.m, apresM.fen()));
    }
    // Les termes qui s'améliorent pour nous d'abord (ils font la phrase), les coûts ensuite (ils restent dans la trace).
    termes.sort((a, b) => (b.d1 > 0) - (a.d1 > 0) || b.poids - a.poids);
    const termesCites = termes.slice(0, 3);

    // --- la sorte, par priorité : livre, calcul, défense, plan, amélioration ---
    const estMat = M.score >= MAT - 200;
    const bilanM = bilanMateriel(fenAvant, ligneM.fenBout, camp), gainM = materielEnMots(bilanM);
    const perteM = materielEnMots(Object.fromEntries(Object.entries(bilanM).map(([k, v]) => [k, -v])));
    const bilanR = R ? bilanMateriel(fenAvant, ligneR.fenBout, camp) : null;
    const perteR = bilanR ? materielEnMots(Object.fromEntries(Object.entries(bilanR).map(([k, v]) => [k, -v]))) : null;
    let sorte, sousSorte = null, motif = null;
    const roiTerme = termesCites.find((t) => t.nom === 'danger du roi' || t.nom === 'abri du roi');
    const sauvetage = termesCites.find((t) => (t.nom === 'pièce en l\'air' || t.nom === 'attaquée par un pion sûr' || t.nom === 'menace par une mineure' || t.nom === 'menace par une tour') && t.chezMoi && t.d1 > 0);
    if (livre && !livre.refus) { sorte = 'livre'; sousSorte = 'coup'; }
    else if (estMat) { sorte = 'calcul'; sousSorte = 'mat'; }
    else if (M.cp - E0 >= BORNES.gain && gainM) { sorte = 'calcul'; sousSorte = 'gain'; }
    else if (R && Math.abs(M.cp - E0) < BORNES.gain && R.cp <= E0 - BORNES.gain) { sorte = 'calcul'; sousSorte = 'seul_coup'; }
    else if (M.cp <= E0 - BORNES.gain && perteM) { sorte = 'calcul'; sousSorte = 'moindre_mal'; }
    else if (menace && !menace.pareeApresR && menace.pareeApresM) { sorte = 'defense'; sousSorte = 'parer'; }
    else if (sauvetage) { sorte = 'defense'; sousSorte = 'piece_en_prise'; termesCites.unshift(...termesCites.splice(termesCites.indexOf(sauvetage), 1)); }
    else if (roiTerme && roiTerme.chezMoi && roiTerme.d1 > 0 && (!R || M.cp - R.cp >= BORNES.seValent)) { sorte = 'defense'; sousSorte = roiTerme.nom === 'abri du roi' ? 'roi_abri' : roiTerme.cle; termesCites.unshift(...termesCites.splice(termesCites.indexOf(roiTerme), 1)); }
    else if (livre?.refus) { sorte = 'livre'; sousSorte = 'refus'; }
    else if (this.plan && M.planTerme > 0 && M.dApres < M.d0 && (!R || R.planTerme < M.planTerme || R.cp <= M.cp)) { sorte = 'plan'; sousSorte = M.dApres === 0 ? 'dernier_pas' : 'pas'; }
    else {
      const finale = termesCites.find((t) => t.d1 > 0 && (t.cle.startsWith('mat_') || t.cle.startsWith('carre') || t.cle === 'nulle_materiel'));
      // amélioration : le premier terme qui s'améliore pour nous ET qui a une phrase d'amélioration (les termes de défense n'en ont pas)
      const amel = termesCites.find((t) => t.d1 > 0 && (GABARITS.amelioration[t.cle] || GABARITS.finale[t.cle]));
      if (finale) { sorte = 'finale'; sousSorte = finale.cle; termesCites.unshift(...termesCites.splice(termesCites.indexOf(finale), 1)); }
      else if (amel) { sorte = 'amelioration'; sousSorte = amel.cle; termesCites.unshift(...termesCites.splice(termesCites.indexOf(amel), 1)); }
      else { sorte = 'amelioration'; sousSorte = 'coup_d_attente'; termesCites.length = 0; }
    }
    if (sorte === 'calcul') { // un motif nommé dans les 4 premiers demi-coups de notre ligne ; « gain : prend… » redit la phrase, on l'écarte
      const ms = lineMotifs(fenAvant, M.pvUci, 2);
      for (const x of ms) { if (x.ply > 3) break; const m = (x.motifs ?? []).find((s) => !/^gain\b/i.test(s)); if (m) { motif = m; break; } }
    }

    // --- le plan : cumul des coûts propres, état rendu ---
    if (this.plan) {
      const pas = M.dApres < M.d0;
      if (pas) this.plan.cumul += Math.max(0, exacts[0].cp - M.cp);
      planInfo = { nom: this.plan.nom, pourquoi: this.plan.pourquoi, distanceAvant: M.d0, distanceApres: M.dApres, cumul: this.plan.cumul, adopte: adopteMaintenant, ...(planRec ?? {}) };
      if (M.dApres === 0) this.plan = null;
    } else if (planRec) planInfo = { nom: planRec.ancien ?? '', ...planRec };

    const rec = {
      ply, camp, san: mM.san, uci: M.uci, fenAvant, coach: true, sorte, sousSorte,
      score: M.cp, evalAvant: E0, total: M.total,
      battu: R ? { san: sanFr(R.uci).san, score: R.cp, ecart: Math.abs(ecart), seValent: Math.abs(ecart) < BORNES.seValent, planTerme: R.planTerme ?? 0 } : null,
      ligne: ligneM.sans, ligneBattu: ligneR.sans,
      termes: termesCites.map((t) => ({ nom: t.nom, cle: t.cle, apres: t.d1, bout: t.d2, quoi: t.quoi, donnees: t.donnees, poids: t.poids })),
      menace, motif, plan: planInfo, livre: livre ? { ...livre, fin: false } : (finDuLivre ? { fin: true } : null),
      gain: gainM, perteM, perteR, pieceM, caseM,
      candidats: exacts.slice(0, 4).map((c) => ({ san: sanFr(c.uci).san, score: c.cp, planTerme: c.planTerme ?? 0, total: c.total })),
      profondeur: res.profondeur, noeuds: res.noeuds, ms: Date.now() - t0,
    };
    const { phrase, alerte } = formuler(rec);
    rec.phrase = phrase; if (alerte) rec.alerte = alerte;
    return rec;
  }

  /** Un terme cité : sa clé de gabarit, ses données de remplissage et son poids. d1 : juste après M ; d2 : au bout. */
  #terme(nom, d1, d2, apresEntree, avantEntree, camp, pieceM, caseM, coupM, fenApres) {
    const poids = Math.min(Math.abs(d1), Math.abs(d2));
    const miennes = (e) => (e?.entrees ?? []).filter((x) => x.camp === camp), siennes = (e) => (e?.entrees ?? []).filter((x) => x.camp !== camp);
    const surCaseM = miennes(apresEntree).find((x) => x.quoi?.endsWith(` ${caseM}`));
    const chezMoi = d1 > 0 ? miennes(apresEntree).length > 0 || miennes(avantEntree).length > 0 : false;
    const roque = coupM.flags?.includes('k') || coupM.flags?.includes('q');
    // La pièce dont le terme a le plus bougé (la pièce jouée est lue de sa case de départ à sa case d'arrivée) : c'est elle
    // que la phrase nomme, pas forcément la pièce jouée (une tour découverte par un roi qui s'écarte, par exemple).
    const parQuoi = (e) => new Map((e?.entrees ?? []).filter((x) => x.camp === camp).map((x) => [x.quoi, x.cp]));
    const av = parQuoi(avantEntree), ap = parQuoi(apresEntree);
    const nomPiece = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' }[coupM.piece];
    let meilleure = null;
    for (const [quoi, cp] of ap) {
      const cleAvant = quoi === `${nomPiece} ${caseM}` ? `${nomPiece} ${coupM.from}` : quoi;
      const delta = cp - (av.get(cleAvant) ?? 0);
      if (!meilleure || delta > meilleure.delta) meilleure = { quoi, delta };
    }
    const [pieceNom, caseNom] = (meilleure?.quoi ?? `${nomPiece} ${caseM}`).split(' ');
    const lettre = { pion: 'P', cavalier: 'N', fou: 'B', tour: 'R', dame: 'Q', roi: 'K' }[pieceNom] ?? pieceM;
    const donnees = { ma_piece: maPiece(lettre), case: caseNom ?? caseM, colonne: (caseNom ?? caseM)[0] };
    let cle = null;
    const tour7 = coupM.piece === 'r' && ((camp === 'w' && caseM[1] === '7') || (camp === 'b' && caseM[1] === '2'));
    switch (nom) {
      case 'placement': cle = roque ? 'developpement_roque' : tour7 ? 'septieme' : 'placement'; break;
      case 'mobilité': cle = roque ? 'developpement_roque' : 'mobilite'; break;
      case 'avant-poste': cle = 'avant_poste'; break;
      case 'tour sur colonne ouverte': cle = 'colonne_ouverte'; break;
      case 'tour enfermée': cle = roque ? 'developpement_roque' : 'mobilite'; break;
      case 'tour sur colonne semi-ouverte': { cle = 'colonne_semi_ouverte'; const c = new Chess(fenApres); const col = caseM[0]; const pion = [...'12345678'].map((r) => col + r).find((s) => { const p = c.get(s); return p && p.type === 'p' && p.color !== camp; }); donnees.case_cible = pion ?? ''; break; }
      case 'paire de fous': cle = 'paire_de_fous'; break;
      case 'fou gêné par ses pions': cle = 'mauvais_fou'; break;
      case 'grande diagonale': cle = 'grande_diagonale'; break;
      case 'pion isolé': cle = d1 > 0 && siennes(apresEntree).length > siennes(avantEntree).length ? 'pion_isole_chez_lui' : 'pion_isole_chez_moi'; donnees.case_cible = siennes(apresEntree).at(-1)?.quoi?.split(' ').pop() ?? ''; break;
      case 'pion doublé': cle = siennes(apresEntree).length > siennes(avantEntree).length ? 'pion_double_chez_lui' : 'pion_double_chez_moi'; donnees.colonne = (siennes(apresEntree).at(-1)?.quoi?.split(' ').pop() ?? caseM)[0]; break;
      case 'pion arriéré': cle = siennes(apresEntree).length > siennes(avantEntree).length ? 'pion_arriere_chez_lui' : 'pion_arriere_chez_moi'; donnees.case_cible = siennes(apresEntree).at(-1)?.quoi?.split(' ').pop() ?? ''; break;
      case 'pion lié': cle = 'pions_lies'; break;
      case 'pion passé': cle = coupM.piece === 'p' ? 'pion_passe_pousse' : 'pion_passe_bloque'; break;
      case 'espace': cle = 'espace'; break;
      case 'développement': cle = coupM.flags?.includes('k') || coupM.flags?.includes('q') ? 'developpement_roque' : 'developpement_mineure'; break;
      case 'dame sortie tôt': cle = 'developpement_dame_tot'; break;
      case 'roque manqué': cle = 'developpement_roque'; break;
      case 'attaquée par un pion sûr': { cle = 'attaque_par_pion'; const e = siennes(apresEntree)[0] ?? miennes(apresEntree)[0]; donnees.sa_piece = saPiece(LETTRE[{ pion: 'p', cavalier: 'n', fou: 'b', tour: 'r', dame: 'q' }[e?.quoi?.split(' ')[0]] ?? 'n']); break; }
      case 'échanger quand on mène': cle = 'echanges_quand_on_mene'; break;
      case 'mat forcé : roi au bord, le nôtre s\'approche': cle = coupM.piece === 'k' ? 'mat_roi_approche' : 'mat_roi_au_bord'; break;
      case 'abri du roi': cle = 'roi_abri'; break;
      case 'danger du roi': { const e = (chezMoi ? miennes(apresEntree) : siennes(apresEntree))[0]; cle = coupM.piece === 'k' || !e ? 'roi_abri' : (surCaseM || miennes(apresEntree).length ? 'roi_defenseur' : 'roi_attaquant'); donnees.sa_piece = saPiece(pieceM); break; }
      case 'pièce en l\'air': case 'menace par une mineure': case 'menace par une tour': case 'menace par le roi': cle = 'piece_en_prise'; donnees.case = coupM.from; break;
      default: cle = 'placement';
    }
    return { nom, cle, d1, d2, poids, chezMoi, quoi: surCaseM?.quoi ?? miennes(apresEntree)[0]?.quoi ?? '', donnees };
  }
}
