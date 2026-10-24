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
import { Echiquier, DEPART, uci as uciDe, BLANC, NOIR, PION, ROI, type as typePiece, couleur as couleurPiece, horsJeu, nomCase } from './echiquier.mjs';
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
    // Le demi-coup se lit sur l'échiquier (1 = premier coup des Blancs), quel que soit le comptage de l'appelant.
    const fenAvant = chess.fen(), camp = chess.turn(), ply = chess.moveNumber() * 2 - (camp === 'w' ? 1 : 0);
    const sanFr = (uciCoup, depuis = fenAvant) => { const c = new Chess(depuis); const m = c.move({ from: uciCoup.slice(0, 2), to: uciCoup.slice(2, 4), promotion: uciCoup[4] }); return { san: toFrenchSan(m.san), brut: m.san, m }; };
    const ligneFr = (pv, depuis = fenAvant) => { const c = new Chess(depuis), out = []; for (const u of pv) { try { out.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } } return { sans: out, fenBout: c.fen() }; };

    // --- l'évaluation avant, la recherche ---
    // E0 : l'évaluation avant le coup, posée par la quiescence (les prises en suspens résolues), sinon un pion en l'air
    // ferait dire « je gagne » à une simple reprise et « très mauvaise » à une position normale.
    const posee = this.recherche.evaluationPosee(ech);
    let E0 = enCentipions(posee.score); const E0statique = enCentipions(evaluer(ech));
    const ligneQ = ligneFr(posee.pv.map(uciDe)); // la ligne des prises résolues : la référence du matériel pour le gain (Expert)
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
    // les jetons de positional/ : { id: 'STRUCTURE', kind: 'fact', params: { name, color } }
    const structures = buildStructureFacts(fenAvant).filter((t) => t.id === 'STRUCTURE' && t.params?.name).map((t) => t.params);
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
          const perte = materielEnMots(Object.fromEntries(Object.entries(bilan).map(([k, v]) => [k, -v])));
          // Une menace, c'est du matériel qu'il gagnerait (Expert), ou un mat : une ligne « positionnelle » à faible profondeur n'en est pas une.
          if (perte || mn.score >= MAT - 200) {
            // Parée ? On REJOUE le coup menaçant après le coup candidat et on compte le matériel au bout de la courte ligne
            // qui suit : s'il ne gagne plus de matériel (ni ne mate), la menace est parée (Expert : la note seule se trompait).
            const paree = (c) => {
              const e2 = new Echiquier(fenAvant); e2.jouer(e2.coupDepuisUci(c.uci));
              const t = e2.coupDepuisUci(pvUci[0]); if (!t) return true; // le coup menaçant n'existe plus
              const n = this.recherche.noterCoup(e2, t, { prof: 3, budget: Math.trunc(this.budget / 10) });
              if (n.score >= MAT - 200) return false; // il mate toujours
              const e3 = new Echiquier(fenAvant); e3.jouer(e3.coupDepuisUci(c.uci));
              const lm2 = ligneFr(n.pv.map(uciDe), e3.fen());
              const b = bilanMateriel(e3.fen(), lm2.fenBout, camp);
              return Object.entries(b).reduce((s, [k, v]) => s + VAL[k.toLowerCase()] * v, 0) >= 0;
            };
            menace = { ligne: lm.sans, gain: valeur, perte: mn.score >= MAT - 200 ? 'la partie (mat)' : perte ?? 'du terrain', mat: mn.score >= MAT - 200, pareeApresM: paree(M), pareeApresR: R ? paree(R) : true };
          }
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
    // le placement est le terme le plus vague : il passe après les autres ; la première sortie d'une mineure, c'est du développement avant tout
    const sortieMineure = (mM.m.piece === 'n' || mM.m.piece === 'b') && mM.m.from[1] === (camp === 'w' ? '1' : '8');
    const rang = (t) => (t.nom === 'placement' ? t.poids / 2 : t.nom === 'développement' && sortieMineure ? t.poids * 3 : t.poids);
    termes.sort((a, b) => (b.d1 > 0) - (a.d1 > 0) || rang(b) - rang(a));
    const termesCites = termes.slice(0, 3);

    // --- la sorte, par priorité : livre, calcul, défense, plan, amélioration ---
    const estMat = M.score >= MAT - 200;
    // Référence du gain (Expert, traque du 25 octobre) : le matériel SUR L'ÉCHIQUIER ; exception : si le dernier coup adverse
    // était une prise et que mon coup précédent n'en était pas une, la référence est le matériel d'avant sa prise (sinon la
    // reprise se lit « je gagne une pièce »). Le gain se nomme par sa composition, jamais par une somme.
    const dernierAdverse0 = historique.length ? historique[historique.length - 1] : null;
    const rejouer = (n) => { const c = new Chess(depart); let dernier = null; for (const u of historique.slice(0, n)) dernier = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); return { fen: c.fen(), dernier }; };
    const saPrise = dernierAdverse0 ? !!rejouer(historique.length).dernier?.captured : false;
    const maPrisePrecedente = historique.length >= 2 ? !!rejouer(historique.length - 1).dernier?.captured : false;
    const fenRef = saPrise && !maPrisePrecedente ? rejouer(historique.length - 1).fen : fenAvant;
    const bilanM = bilanMateriel(fenRef, ligneM.fenBout, camp);
    const gainM = materielEnMots(bilanM);
    const perteM = materielEnMots(Object.fromEntries(Object.entries(bilanM).map(([k, v]) => [k, -v])));
    const bilanR = R ? bilanMateriel(fenAvant, ligneR.fenBout, camp) : null;
    const perteR = bilanR ? materielEnMots(Object.fromEntries(Object.entries(bilanR).map(([k, v]) => [k, -v]))) : null;
    let sorte, sousSorte = null, motif = null, attaqueDonnees = null;
    const enTete = (t) => { if (t) termesCites.unshift(...termesCites.splice(termesCites.indexOf(t), 1)); };
    const roiTerme = termesCites.find((t) => (t.nom === 'danger du roi' || t.nom === 'abri du roi') && t.d1 > 0 && t.cle !== null);
    const sauvetage = termesCites.find((t) => t.cle === 'piece_en_prise' && t.d1 > 0);
    const attaque = termesCites.find((t) => (t.cle === 'attaque_par_pion' || t.cle === 'menace_piece') && t.d1 > 0);
    const prise = !!mM.m.captured, echecDonne = /\+$/.test(mM.brut), enEchec = ech.enEchec();
    const dernierAdverse = historique.length ? historique[historique.length - 1] : null;
    const dernierPrenait = dernierAdverse ? (() => { const c = new Chess(depart); for (const u of historique.slice(0, -1)) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); return !!c.move({ from: dernierAdverse.slice(0, 2), to: dernierAdverse.slice(2, 4), promotion: dernierAdverse[4] }).captured; })() : false;
    const reprise = prise && dernierPrenait && dernierAdverse.slice(2, 4) === caseM;
    const bilanTotal = Object.entries(bilanM).reduce((s, [t, n]) => s + VAL[t.toLowerCase()] * n, 0);
    const matSubi = M.score <= -(MAT - 200);
    const promotionM = !!M.uci[4];
    // Cause B (Expert) : un coup qui crée une attaque sur une pièce adverse, ou sur un pion adverse non défendu, n'est jamais
    // un coup d'attente ni une simple amélioration : « J'attaque {sa_piece} en {case} : il doit s'en occuper. »
    const nouvellesAttaques = (() => {
      const moi = camp === 'w' ? BLANC : NOIR, lui = moi ^ NOIR, echApres = new Echiquier(apresM.fen()), out = [];
      for (let sq = 0; sq < 128; sq++) {
        if (horsJeu(sq)) { sq += 7; continue; }
        const p = echApres.cases[sq]; if (!p || couleurPiece(p) !== lui || typePiece(p) === ROI) continue;
        if (!echApres.attaquee(sq, moi)) continue;
        if (ech.cases[sq] === p && ech.attaquee(sq, moi)) continue; // déjà attaquée avant le coup
        if (typePiece(p) === PION && echApres.attaquee(sq, lui)) continue; // un pion défendu n'a rien à craindre d'un pion attaqué
        out.push({ type: typePiece(p), sq: nomCase(sq) });
      }
      out.sort((a, b) => b.type - a.type); // la plus grosse pièce d'abord
      return out;
    })();
    // Règle 3 (Expert) : si le meilleur score tombe de plus de 80 sous E0 sans perte comptée, E0 était une aberration de la
    // quiescence : on prend E0 = score de M. Et pas de « coup d'attente » si la ligne contient une prise par la pièce jouée.
    if (M.cp <= E0 - BORNES.gain && bilanTotal >= 0 && !matSubi) E0 = M.cp;
    const priseParPieceJouee = (() => { const c = new Chess(fenAvant); let sq = null; for (let i = 0; i < M.pvUci.length; i++) { const u = M.pvUci[i]; let mv; try { mv = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } if (i === 0) { sq = mv.to; continue; } if (mv.color === camp && mv.from === sq) { if (mv.captured) return true; sq = mv.to; } } return false; })();
    // « le matériel est rétabli » seulement si, au bout de la ligne, il égale celui d'avant SA prise (Expert)
    const fenAvantSaPrise = dernierAdverse ? (() => { const c = new Chess(depart); for (const u of historique.slice(0, -1)) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); return c.fen(); })() : null;
    const retabli = reprise && fenAvantSaPrise && Object.entries(bilanMateriel(fenAvantSaPrise, ligneM.fenBout, camp)).every(([, n]) => n === 0);
    // Notre menace après M (l'adversaire passe, que gagne-t-on ?) : ne sert qu'à valider « j'attaque sa pièce ».
    const menaceNotre = () => { const e2 = new Echiquier(apresM.fen()); const mn = this.recherche.menace(e2, { budget: Math.trunc(this.budget / 8), profondeurMax: 4 }); if (!mn) return false; const e3 = new Echiquier(apresM.fen()); e3.jouerNul(); const lm = ligneFr(mn.pv.map(uciDe), e3.fen()); const b = bilanMateriel(apresM.fen(), lm.fenBout, camp); return Object.entries(b).reduce((s, [t, n]) => s + VAL[t.toLowerCase()] * n, 0) > 0; };
    if (livre && !livre.refus) { sorte = 'livre'; sousSorte = 'coup'; }
    else if (estMat) { sorte = 'calcul'; sousSorte = 'mat'; }
    else if (matSubi) { sorte = 'calcul'; sousSorte = 'mat_subi'; }
    // Reprise : dite comme telle (rétablie ou non). Gain : du matériel en plus par rapport à la ligne de quiescence de E0, et M
    // ne descend pas sous E0. Les effondrements (seul coup, moindre mal) se lisent contre E0 posée.
    else if (reprise && bilanTotal >= 0) { sorte = 'calcul'; sousSorte = retabli ? 'reprise' : 'reprise_partielle'; } // une reprise est une reprise, quel que soit le score
    else if (promotionM) { sorte = 'calcul'; sousSorte = 'promotion'; }
    // Gain (Expert, cause E) : matériel compté ET note de M au moins 80 au-dessus de l'évaluation STATIQUE (sinon « 1…d5 gagne un pion » sur une ligne supposée).
    else if (gainM && M.cp - E0statique >= BORNES.gain) { sorte = 'calcul'; sousSorte = 'gain'; }
    // Seul coup (cause F) : la condition écrite, note de R ≤ E0 − 80 et M qui tient ; et jamais quand R reste gagnant.
    else if (R && M.cp >= E0 - BORNES.gain && R.cp <= E0 - BORNES.gain && (perteR || R.cp < 0)) { sorte = 'calcul'; sousSorte = 'seul_coup'; }
    else if (M.cp <= E0 - BORNES.gain && M.cp <= -100 && (!R || R.cp <= E0 - BORNES.gain)) { sorte = 'calcul'; sousSorte = perteM ? 'moindre_mal' : 'perdu'; }
    else if (enEchec) { sorte = 'defense'; sousSorte = cands.length === 1 ? 'echec_seul' : 'echec_pare'; }
    else if (menace && !menace.pareeApresR && menace.pareeApresM) { sorte = 'defense'; sousSorte = 'parer'; }
    else if (sauvetage) { sorte = 'defense'; sousSorte = 'piece_en_prise'; enTete(sauvetage); }
    else if (roiTerme && (!R || M.cp - R.cp >= BORNES.seValent)) { sorte = 'defense'; sousSorte = roiTerme.cle; enTete(roiTerme); }
    else if (livre?.refus) { sorte = 'livre'; sousSorte = 'refus'; }
    else if (this.plan && M.planTerme > 0 && M.dApres < M.d0 && (!R || R.planTerme < M.planTerme || R.cp <= M.cp)) { sorte = 'plan'; sousSorte = M.dApres === 0 ? 'dernier_pas' : 'pas'; }
    else {
      const finale = termesCites.find((t) => t.d1 > 0 && t.cle && (t.cle.startsWith('mat_') || t.cle.startsWith('carre') || t.cle === 'nulle_materiel'));
      // amélioration : le premier terme qui s'améliore pour nous ET qui a une phrase d'amélioration (les termes de défense n'en ont pas)
      const amel = termesCites.find((t) => t.d1 > 0 && t.cle && (GABARITS.amelioration[t.cle] || GABARITS.finale[t.cle]));
      if (finale) { sorte = 'finale'; sousSorte = finale.cle; enTete(finale); }
      else if (prise) { // une prise n'est jamais une « amélioration » : échange (si « échanger quand on mène » est actif, c'est lui qui parle), ou prise rendue
        const mene = termesCites.find((t) => t.cle === 'echanges_quand_on_mene' && t.d1 > 0);
        sorte = 'amelioration'; sousSorte = bilanTotal === 0 ? (mene ? 'echanges_quand_on_mene' : 'echange') : 'prise_rendue'; enTete(mene);
      }
      else if (nouvellesAttaques.length) { // cause B : le coup attaque une pièce (ou un pion non défendu)
        const a = nouvellesAttaques[0];
        sorte = 'amelioration'; sousSorte = mM.m.piece === 'p' ? 'attaque_par_pion' : 'menace_piece';
        attaqueDonnees = { sa_piece: saPiece(['', 'P', 'N', 'B', 'R', 'Q', 'K'][a.type]), case_cible: a.sq, case: a.sq };
      }
      else if (amel) { sorte = 'amelioration'; sousSorte = amel.cle; enTete(amel); }
      else if (sortieMineure && !prise) { sorte = 'amelioration'; sousSorte = 'developpement_mineure'; } // la première sortie d'une mineure, c'est du développement
      else if (echecDonne) { sorte = 'amelioration'; sousSorte = 'echec_donne'; }
      else if (mM.m.piece === 'p') { sorte = 'amelioration'; sousSorte = 'placement'; } // un pas de pion n'est jamais « un coup d'attente »
      else if (menace && !menace.pareeApresM) { sorte = 'amelioration'; sousSorte = 'contraint'; } // rien ne pare la menace : on ne dit pas « coup d'attente »
      else if (R && M.total - R.total >= BORNES.seValent) { sorte = 'amelioration'; sousSorte = 'prefere'; } // M bat R nettement, sans terme simple : on le dit tel quel (« prefere » exige 10)
      else if (priseParPieceJouee) { sorte = 'amelioration'; sousSorte = 'placement'; } // sa ligne contient une prise par la pièce jouée : pas « un coup d'attente », mais pas « mieux que R » non plus
      else { sorte = 'amelioration'; sousSorte = 'coup_d_attente'; termesCites.length = 0; }
    }
    if (sorte === 'calcul') { // un motif nommé dans les 4 premiers demi-coups de notre ligne ; « gain : prend… » redit la phrase, on l'écarte
      const ms = lineMotifs(fenAvant, M.pvUci, 2);
      // seuls les motifs nommés comptent (fourchette, clouage, enfilade, découverte, déviation, surcharge, intermède, promotion, mat) ; « gain », « échange », « perte » redisent la phrase
      const nomme = /fourchette|clou|enfilade|découvert|double|déviation|dévi|surcharge|interm|défenseur|promotion|\bmat\b|sacrifice/i;
      for (const x of ms) { if (x.ply > 3) break; const m = (x.motifs ?? []).find((s) => nomme.test(s) && !/^(gain|échange|perte)\b/i.test(s)); if (m) { motif = m; break; } }
      // Cause D (Expert) : « échec à la découverte » seulement si la pièce jouée ne donne pas elle-même l'échec (sans elle, le roi
      // adverse reste attaqué). Un échec direct nommé « découverte » est faux : on retire le motif.
      if (motif && /découvert/i.test(motif) && echecDonne) {
        const e2 = new Echiquier(apresM.fen()); const moi = camp === 'w' ? BLANC : NOIR; const roiLui = e2.rois[(moi ^ NOIR) >> 3];
        const idx = [...'abcdefgh'].indexOf(caseM[0]) + (Number(caseM[1]) - 1) * 16;
        const piece = e2.cases[idx]; e2.cases[idx] = 0; const encore = e2.attaquee(roiLui, moi); e2.cases[idx] = piece;
        if (!encore) motif = null;
      }
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
      score: M.cp, evalAvant: E0, evalStatique: E0statique, total: M.total,
      battu: R ? { san: sanFr(R.uci).san, score: R.cp, ecart: Math.abs(ecart), seValent: Math.abs(ecart) < BORNES.seValent, planTerme: R.planTerme ?? 0 } : null,
      ligne: ligneM.sans, ligneBattu: ligneR.sans,
      termes: termesCites.map((t) => ({ nom: t.nom, cle: t.cle, apres: t.d1, bout: t.d2, quoi: t.quoi, donnees: t.donnees, poids: t.poids })),
      menace, motif, plan: planInfo, livre: livre ? { ...livre, fin: false } : (finDuLivre ? { fin: true } : null),
      gain: gainM, perteM, perteR, pieceM, caseM,
      saPiece: attaqueDonnees?.sa_piece ?? (mM.m.captured ? saPiece(LETTRE[mM.m.captured]) : null), caseCible: attaqueDonnees?.case_cible ?? caseM,
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
    const parQuoi = (e, mien) => new Map((e?.entrees ?? []).filter((x) => (x.camp === camp) === mien).map((x) => [x.quoi, x.cp]));
    const av = parQuoi(avantEntree, true), ap = parQuoi(apresEntree, true), avLui = parQuoi(avantEntree, false), apLui = parQuoi(apresEntree, false);
    const nomPiece = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' }[coupM.piece];
    // Règle (Expert, seconde traque) : la phrase nomme la pièce de l'entrée du terme qui a VRAIMENT changé avec le coup : la
    // pièce jouée si sa propre entrée s'améliore, sinon l'entrée (à nous en mieux, ou à lui en pire) qui a le plus bougé ;
    // et si aucune entrée ne bouge d'au moins 10, le terme n'est pas cité (un pion c4 n'explique pas …h6).
    let meilleure = null, jouee = null;
    for (const [quoi, cp] of ap) {
      const cleAvant = quoi === `${nomPiece} ${caseM}` ? `${nomPiece} ${coupM.from}` : quoi;
      const delta = cp - (av.get(cleAvant) ?? 0);
      if (quoi === `${nomPiece} ${caseM}`) jouee = { quoi, delta, mien: true };
      if (delta > 0 && (!meilleure || delta > meilleure.delta)) meilleure = { quoi, delta, mien: true };
    }
    for (const [quoi, cp] of new Set([...apLui.keys(), ...avLui.keys()])) { // ses entrées : en pire pour lui = en mieux pour nous
      const delta = (avLui.get(quoi) ?? 0) - (apLui.get(quoi) ?? 0);
      if (delta > 0 && (!meilleure || delta > meilleure.delta)) meilleure = { quoi, delta, mien: false };
    }
    const choisie = jouee && jouee.delta >= 5 ? jouee : meilleure;
    const significatif = !!choisie && choisie.delta >= BORNES.termeCite;
    const L2 = { pion: 'P', cavalier: 'N', fou: 'B', tour: 'R', dame: 'Q', roi: 'K' };
    const [pieceNom, caseNom] = (choisie?.quoi ?? `${nomPiece} ${caseM}`).split(' ');
    const lettre = L2[pieceNom] ?? pieceM;
    const donnees = { ma_piece: maPiece(lettre), sa_piece: saPiece(lettre), case: caseNom ?? caseM, colonne: (caseNom ?? caseM)[0], cases: [...ap.keys()].map((q) => q.split(' ')[1]).join(', ') };
    // Les termes de menace sont crédités à l'attaquant et nomment la pièce attaquée : « siennes » = nos pièces menacées.
    const menacesSurMoi = (e) => siennes(e), menacesSurLui = (e) => miennes(e);
    const sauvee = menacesSurMoi(avantEntree).find((x) => !menacesSurMoi(apresEntree).some((y) => y.quoi === x.quoi));
    const nouvelleCible = menacesSurLui(apresEntree).find((x) => !menacesSurLui(avantEntree).some((y) => y.quoi === x.quoi));
    let cle = null;
    const tour7 = coupM.piece === 'r' && ((camp === 'w' && caseM[1] === '7') || (camp === 'b' && caseM[1] === '2'));
    switch (nom) {
      // si l'entrée qui change est une pièce À LUI (elle perd des cases, de l'activité), c'est le gabarit à lui qui parle (Expert)
      case 'placement': cle = roque ? 'developpement_roque' : tour7 ? 'septieme' : !choisie ? null : choisie.mien ? 'placement' : 'placement_lui'; break;
      case 'mobilité': cle = roque ? 'developpement_roque' : !choisie || pieceNom === 'pion' ? null : choisie.mien ? 'mobilite' : 'mobilite_lui'; break;
      case 'avant-poste': cle = 'avant_poste'; break;
      case 'tour sur colonne ouverte': cle = 'colonne_ouverte'; break;
      case 'tour enfermée': cle = roque ? 'developpement_roque' : 'mobilite'; break;
      case 'tour sur colonne semi-ouverte': { cle = 'colonne_semi_ouverte'; const c = new Chess(fenApres); const col = caseM[0]; const pion = [...'12345678'].map((r) => col + r).find((s) => { const p = c.get(s); return p && p.type === 'p' && p.color !== camp; }); donnees.case_cible = pion ?? ''; break; }
      case 'paire de fous': cle = d1 > 0 && coupM.captured === 'b' ? 'paire_de_fous' : null; break;
      case 'fou gêné par ses pions': cle = coupM.piece === 'b' && coupM.captured ? 'mauvais_fou' : null; break;
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
      case 'attaquée par un pion sûr': case 'pièce en l\'air': case 'menace par une mineure': case 'menace par une tour': case 'menace par le roi': {
        if (d1 > 0 && sauvee) { // une de nos pièces n'est plus menacée : on la nomme, avec la case où elle était
          const [pn, cs] = sauvee.quoi.split(' '); cle = 'piece_en_prise'; donnees.ma_piece = maPiece(L2[pn] ?? pieceM); donnees.case = pn === nomPiece && cs === caseM ? coupM.from : cs;
        } else if (d1 > 0 && nouvelleCible) { // nous menaçons une pièce de plus
          const [pn, cs] = nouvelleCible.quoi.split(' '); donnees.sa_piece = saPiece(L2[pn] ?? 'N'); donnees.case_cible = cs;
          cle = nom === 'attaquée par un pion sûr' && coupM.piece === 'p' ? 'attaque_par_pion' : 'menace_piece';
        } else cle = null;
        break;
      }
      case 'échanger quand on mène': cle = 'echanges_quand_on_mene'; break;
      case 'mat forcé : roi au bord, le nôtre s\'approche': { // « sans lui, {ma_piece} ne peut pas mater seule » : la pièce lourde, pas le roi
        cle = coupM.piece === 'k' ? 'mat_roi_approche' : 'mat_roi_au_bord';
        const pieces = fenApres.split(' ')[0]; donnees.ma_piece = maPiece((camp === 'w' ? /Q/ : /q/).test(pieces) ? 'Q' : 'R'); break;
      }
      case 'abri du roi': { // sans pions à nous, il n'y a pas d'abri à garder
        const mesPions = (fenApres.split(' ')[0].match(camp === 'w' ? /P/g : /p/g) ?? []).length;
        cle = d1 > 0 && mesPions && (coupM.piece === 'p' || coupM.piece === 'k' || roque) ? 'roi_abri' : null; break;
      }
      case 'danger du roi': {
        const luiSeul = !(fenApres.split(' ')[0].match(camp === 'w' ? /[pnbrq]/g : /[PNBRQ]/g) ?? []).length; // roi adverse seul : pas de « danger », c'est le mat forcé qui parle
        if (d1 <= 0 || luiSeul) { cle = null; break; }
        const roiCase = (() => { const c = new Chess(fenApres); for (const r of '12345678') for (const f of 'abcdefgh') { const p = c.get(f + r); if (p && p.type === 'k' && p.color === camp) return f + r; } return null; })();
        const pres = roiCase && Math.max(Math.abs(caseM.charCodeAt(0) - roiCase.charCodeAt(0)), Math.abs(+caseM[1] - +roiCase[1])) <= 2;
        if (coupM.captured) { cle = 'roi_attaquant'; donnees.sa_piece = saPiece(LETTRE[coupM.captured]); }
        else if (coupM.piece === 'k' || roque || (coupM.piece === 'p' && pres)) cle = 'roi_abri';
        else if (pres) { cle = 'roi_defenseur'; donnees.ma_piece = maPiece(pieceM); donnees.case = caseM; }
        else cle = null;
        break;
      }
      default: cle = null;
    }
    // un terme par pièce dont aucune entrée ne bouge d'au moins 10 avec le coup n'est pas cité (Expert, cause C)
    const PAR_PIECE = new Set(['placement', 'mobilité', 'pion lié', 'pion isolé', 'pion doublé', 'pion arriéré', 'pion passé', 'avant-poste', 'mineure derrière un pion', 'tour sur colonne ouverte', 'tour sur colonne semi-ouverte', 'tour enfermée', 'fou gêné par ses pions', 'grande diagonale']);
    if (!significatif && PAR_PIECE.has(nom)) cle = null;
    return { nom, cle, d1, d2, poids, chezMoi, quoi: choisie?.quoi ?? surCaseM?.quoi ?? miennes(apresEntree)[0]?.quoi ?? '', donnees };
  }
}
