/**
 * Le faisceau d'un plan (scripts/plans/faisceau.mjs en est la ligne de commande ; le bras coach-prix du pilote de partie le
 * consomme aussi) : depuis `fen` (à mon trait), l'exécutant ne joue que des coups admis par le plan (coup contraint,
 * `coach/coup-contraint.mjs`), l'adversaire répond librement (deux réponses si ex æquo : branches jumelles), largeur et
 * horizon fixés ; le prix d'une réalisation est lu au point calme contre le faisceau LIBRE `libre` (référence, même largeur).
 * Division à la bascule de structure : sous-faisceau depuis la position de bascule avec les plans canoniques de la nouvelle
 * structure (continuer / adopter). Réglages dans P : candidats, largeur, plancher, horizon, horizonStructure, bande, k,
 * concession (voir DEFAUTS et REGLAGES_FAISCEAU) ; `concessionCumulee` (cp, absent = pas de coupe) coupe une branche en cours
 * dont la somme des retards de nos coups dépasse la borne (correctif (c) du 19 octobre, Expert + GE).
 * opts : ply0 (demi-coup absolu de `fen`), plyLibre (demi-coup absolu de l'origine de `libre` : la référence d'un
 * sous-faisceau est le faisceau libre DEPUIS LA BASCULE, correctif (b)), horizon, sousFaisceau.
 */
import { Chess } from 'chess.js';
import { distance, suivre, verrouiller, estLevier, libelle } from './plan-distance.mjs';
import { instancier } from './plans-structures.mjs';
import { DEFAUTS, reponsesOuvertes, classerCandidats, derniereChance, pointCalme, structuresDe, signatureStructure, borneCp, jouer, faisceauLibre } from './coup-contraint.mjs';

/** Les réglages du faisceau du 18 octobre (référence du prix) : largeur 4, quatre candidats, horizon 15 (20 pour les plans de structure). */
export const REGLAGES_FAISCEAU = Object.freeze({ ...DEFAUTS, horizon: 15, horizonStructure: 20, bande: 50 });

export async function faisceauPlan(noteur, P, fen, side, plan, autres, libre, opts = {}) {
  const ply0 = opts.ply0 ?? 0, plyLibre = opts.plyLibre ?? 0, sousFaisceau = Boolean(opts.sousFaisceau);
  /** La référence libre au demi-coup absolu `ply` (bornée à la fin de la ligne libre). */
  const refLibre = (ply) => libre.evals[Math.max(0, Math.min(ply - plyLibre, libre.evals.length - 1))] ?? 0;
  const { candidats: CANDIDATS, largeur: LARGEUR, plancher: PLANCHER, horizon: HORIZON, horizonStructure: HORIZON_STRUCTURE } = P, BANDE = P.bande ?? 2 * PLANCHER;
  const structure = signatureStructure;
  const d0 = distance(fen, side, plan).d;
  const tenure = !['rupture', 'poussee'].includes(plan.famille); // un transfert ou un échange doit TENIR après la réponse ; une poussée est réalisée en poussant
  const horizon = opts.horizon ?? (['rupture', 'poussee', 'et'].includes(plan.famille) ? HORIZON_STRUCTURE : HORIZON); // les plans de structure prennent plus de coups
  const structRacine = structure(fen);
  let etats = [{ fen, plan, autres: autres.map((a) => a.plan), compteur: 0, ligne: [], ply: ply0, cp: refLibre(ply0), d: d0, jumelles: [], bascule: null, cumul: 0 }];
  let splits = 0;
  const realises = [], coupes = [], largeurs = []; // largeurs[coup] = branches vivantes gardées après le tri (la largeur EFFECTIVE du faisceau contraint, GE 19 oct.)
  /** Joue `cand` depuis l'état e, puis la ou les réponses adverses (la seconde si elle est ex æquo) ; range les états. */
  async function etendre(e, cand, classe, compteur, meilleurCp, suivants) {
    const apres = new Chess(e.fen); apres.move(cand.m.san);
    const planApres = suivre(e.plan, cand.m);
    const d1 = distance(apres.fen(), side, planApres).d;
    // plans frères suivis le long de la ligne (sinon les crochets mentent en profondeur)
    const autresApres = e.autres.map((a) => suivre(a, cand.m));
    const sert = autres.map((a, i) => (distance(apres.fen(), side, autresApres[i]).d < distance(e.fen, side, e.autres[i]).d ? a.libelle.replace(/^\S+ /, '') : null)).filter(Boolean);
    const cout = meilleurCp - cand.cp, cumul = e.cumul + Math.max(0, cout); // (c) : la somme des retards de nos coups le long de la branche
    const reps = await reponsesOuvertes(noteur, apres.fen(), P);
    if (!reps.length) {
      const etat = { fen: apres.fen(), plan: planApres, autres: autresApres, compteur, ply: e.ply + 1, cp: cand.cp, d: d1, jumelles: e.jumelles, cumul, ligne: [...e.ligne, { san: cand.m.san, classe, sert, cout, rep: null, cp: cand.cp, d: d1 }] };
      if (d1 === 0) { etat.tempo = e.ply + 1; etat.realise = true; suivants.push(etat); } else coupes.push({ ...etat, raison: 'partie finie' });
      return;
    }
    const split = reps.length > 1 ? ++splits : null;
    for (const [ri, rep] of reps.entries()) {
      const j = jouer(apres.fen(), rep.uci);
      const planSuite = suivre(planApres, j.m), dSuite = distance(j.fen, side, planSuite).d;
      const realise = tenure ? dSuite === 0 : (d1 === 0 || dSuite === 0);
      const sig = structure(j.fen);
      const bascule = e.bascule ?? (sig !== structRacine ? { ply: e.ply + 2, fen: j.fen, avant: structRacine, apres: sig, nouvelles: structuresDe(j.fen).filter((x) => !structRacine.includes(`${x.name}:${x.color}`)), par: structure(apres.fen()) !== structRacine ? cand.m.san : j.m.san, parAdversaire: structure(apres.fen()) === structRacine, prixAvant: borneCp(refLibre(e.ply + 2)) - borneCp(-rep.cp) } : null);
      const etat = { fen: j.fen, plan: realise ? verrouiller(planSuite, j.fen, side) : planSuite, autres: autresApres.map((a) => suivre(a, j.m)), compteur, ply: e.ply + 2, cp: -rep.cp, d: dSuite, bascule, cumul,
        jumelles: split ? [...e.jumelles, { id: split, cote: ri }] : e.jumelles,
        ligne: [...e.ligne, { san: cand.m.san, classe, sert, cout, rep: j.m.san, repAlt: ri > 0, cp: -rep.cp, d: dSuite }] };
      if (realise) { etat.tempo = !tenure && d1 === 0 ? e.ply + 1 : e.ply + 2; etat.realise = true; suivants.push(etat); continue; } // soumis au même tri de largeur que les branches vivantes
      if (!estLevier(j.fen, side, planSuite)) { coupes.push({ ...etat, raison: 'cible disparue' }); continue; }
      if (P.concessionCumulee != null && cumul > P.concessionCumulee) { coupes.push({ ...etat, raison: 'concession cumulée', cout: cumul }); continue; }
      suivants.push(etat);
    }
  }
  for (let coup = 0; coup < horizon && etats.length; coup++) {
    const suivants = [];
    for (const e of etats) {
      const cands = await noteur.noter(e.fen, CANDIDATS);
      if (!cands.length) { coupes.push({ ...e, raison: 'partie finie' }); continue; }
      const { admis, progressantsRefuses, coutRefuseMin } = classerCandidats(e.fen, side, e.plan, cands, e.compteur, P);
      for (const a of admis) await etendre(e, a.cand, a.classe, a.compteur, cands[0].cp, suivants);
      if (admis.length) continue;
      // La branche de la dernière chance : le meilleur coup progressant HORS MultiPV, noté une fois, joué s'il coûte ≤ 1 pion.
      const dc = await derniereChance(noteur, e.fen, side, e.plan, cands, P);
      if (dc?.admis) { await etendre(e, dc.cand, 'dernière chance', 0, dc.cand.cp + dc.cout, suivants); continue; }
      const coutReel = [dc?.cout ?? null, Number.isFinite(coutRefuseMin) ? coutRefuseMin : null].filter((x) => x != null);
      coupes.push({ ...e, raison: dc || progressantsRefuses ? 'concession' : 'compteur', cout: coutReel.length ? Math.min(...coutReel) : null });
    }
    const vues = new Set();
    const gardes = suivants.sort((a, b) => b.cp - a.cp).filter((x) => !vues.has(x.fen) && vues.add(x.fen)).slice(0, LARGEUR);
    for (const x of gardes) if (x.realise) realises.push(x);
    etats = gardes.filter((x) => !x.realise);
    largeurs.push(etats.length);
  }
  const vivants = etats;
  const borne = borneCp; // les scores de mat ne font pas des prix en milliers
  const prixBrut = (x) => borne(refLibre(x.ply)) - borne(x.cp);
  // Le prix d'une réalisation se prend à un POINT CALME après elle (le Tarrasch fermé : 0,84 annoncé au 22e en pleine
  // tactique, −0,49 réel) ; le prix brut au tempo est gardé pour information.
  for (const x of realises) {
    const q = await pointCalme(noteur, x.fen, x.ply, side, P);
    x.calme = q.calme; x.plyCalme = q.ply; x.cpCalme = q.cp ?? x.cp; x.prolonge = q.joues.map((m) => m.san);
    x.prixCalme = borne(refLibre(q.ply)) - borne(x.cpCalme);
    // L'échelle ligne (GE, 19 oct.) : la ligne retenue contre la ligne GLOUTONNE (largeur 1 des deux côtés), la langue des parties.
    const gl = libre.glouton; x.prixLigne = gl ? borne(gl[Math.max(0, Math.min(q.ply - plyLibre, gl.length - 1))] ?? 0) - borne(x.cpCalme) : null;
  }
  const prixDe = (x) => (x.prixCalme ?? prixBrut(x));
  let phrase, retenu = null, prix = null, tempo = null, merci = false;
  if (realises.length) {
    retenu = realises.reduce((a, b) => (prixDe(b) < prixDe(a) || (prixDe(b) === prixDe(a) && b.tempo < a.tempo) ? b : a));
    prix = prixDe(retenu); tempo = retenu.tempo;
    phrase = prix <= PLANCHER ? "c'est le plan" : 'viable mais ça coûte';
    // à la merci de la réponse : branches JUMELLES d'une même réponse ex æquo, prix de signes opposés au-delà du plancher
    const ids = new Set(realises.flatMap((x) => x.jumelles.map((j) => j.id)));
    for (const id of ids) {
      const cote = (k) => realises.filter((x) => x.jumelles.some((j) => j.id === id && j.cote === k)).map(prixDe);
      const a = cote(0), b = cote(1); if (!a.length || !b.length) continue;
      const pa = Math.min(...a), pb = Math.min(...b);
      if ((pa > PLANCHER && pb < -PLANCHER) || (pb > PLANCHER && pa < -PLANCHER)) merci = true;
    }
  } else if (vivants.length) {
    retenu = vivants[0]; prix = prixDe(retenu); phrase = "en cours à l'horizon";
  } else {
    const n = (r) => coupes.filter((x) => x.raison === r).length, nConc = n('concession') + n('concession cumulée');
    phrase = nConc >= n('compteur') && nConc > 0 ? 'pas réalisable sans concession' : n('compteur') > 0 ? 'jamais urgent ici' : 'sans objet';
    retenu = coupes.reduce((a, b) => (b.ply > a.ply ? b : a), coupes[0] ?? null);
  }
  // Division à la bascule : la ligne retenue a continué l'ancien plan (son prix est « continuer ») ; un sous-faisceau repart
  // de la position de bascule avec les plans canoniques de la nouvelle structure pour notre camp (table de l'Expert).
  // (b) La référence des deux côtés est le faisceau libre DEPUIS LA BASCULE (même largeur) : « continuer » y est relu, et
  // chaque « adopter » y est tarifé ; le prix depuis la racine reste `prix`. (a) La ligne retenue et les coupes de chaque
  // sous-faisceau sont conservées pour l'autopsie.
  let division = [], continuer = null;
  if (!sousFaisceau && retenu?.bascule?.nouvelles?.length) {
    const b = retenu.bascule, restant = horizon - Math.floor((b.ply - ply0) / 2);
    const libreB = restant > 0 ? await faisceauLibre(noteur, b.fen, side, restant, P) : null;
    const refB = (ply) => borne(libreB?.evals[Math.max(0, Math.min(ply - b.ply, libreB.evals.length - 1))] ?? 0);
    if (libreB) continuer = { prix: refB(retenu.plyCalme ?? retenu.ply) - borne(retenu.cpCalme ?? retenu.cp), prixRacine: prix, phrase, tempo, ply: retenu.plyCalme ?? retenu.ply };
    for (const st of b.nouvelles) {
      for (const inst of instancier(b.fen, side, st.name, st.color).slice(0, 2)) {
        if (!libreB) { division.push({ structure: st.name, libelle: libelle(inst.plan, b.fen), pourquoi: inst.pourquoi, phrase: 'horizon épuisé' }); continue; }
        const r = await faisceauPlan(noteur, P, b.fen, side, inst.plan, [], libreB, { ply0: b.ply, plyLibre: b.ply, horizon: restant, sousFaisceau: true });
        division.push({ structure: st.name, libelle: r.libelle, pourquoi: inst.pourquoi, phrase: r.phrase, prix: r.prix, prixBrut: r.prixBrut, tempo: r.tempo, calme: r.calme, prolonge: r.prolonge, limite: r.limite, concessionMin: r.concessionMin, ligne: r.ligne, realises: r.realises, vivants: r.vivants, coupes: r.coupes, coupesListe: r.coupesListe });
      }
    }
  }
  // (a) Les coupes, les plus avancées d'abord (au plus huit) : où et pourquoi chaque branche s'est arrêtée.
  const coupesListe = [...coupes].sort((a, b) => b.ply - a.ply).slice(0, 8).map((x) => ({ ply: x.ply, raison: x.raison, cout: x.cout ?? null, cp: x.cp, ligne: x.ligne.map((l) => l.san + (l.rep ? ' ' + l.rep + (l.repAlt ? '′' : '') : '')).join(' ') }));
  const concessionMin = coupes.filter((x) => x.raison === 'concession' && x.cout != null).reduce((m, x) => Math.min(m, x.cout), Infinity); // le coût d'un refus à UN coup
  const cumulMin = coupes.filter((x) => x.raison === 'concession cumulée').reduce((m, x) => Math.min(m, x.cout), Infinity); // le cumul d'une branche coupée (autre grandeur, à part)
  const limite = (prix != null && prix > PLANCHER && prix <= BANDE) || (tempo != null && tempo >= 2 * horizon - 2)
    || (tempo == null && Number.isFinite(concessionMin) && Math.abs(concessionMin - P.concession) <= PLANCHER); // dernière chance refusée à un cheveu de la borne
  return { libelle: libelle(plan, fen), d0, phrase, prix, prixBrut: retenu && retenu.tempo != null ? prixBrut(retenu) : null, calme: retenu?.calme ?? null, prolonge: retenu?.prolonge ?? [], bascule: retenu?.bascule ? { ...retenu.bascule, fen: undefined } : null, division, continuer, horizon, prixLigne: retenu?.prixLigne ?? null, largeurs, tempo, limite, merci, concessionMin: Number.isFinite(concessionMin) ? concessionMin : null, cumulMin: Number.isFinite(cumulMin) ? cumulMin : null, ligne: retenu?.ligne ?? [], realises: realises.length, vivants: vivants.length,
    coupes: { concession: coupes.filter((x) => x.raison === 'concession').length, compteur: coupes.filter((x) => x.raison === 'compteur').length, cumul: coupes.filter((x) => x.raison === 'concession cumulée').length, autres: coupes.filter((x) => !['concession', 'compteur', 'concession cumulée'].includes(x.raison)).length }, coupesListe };
}

