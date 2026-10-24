/**
 * Le coup contraint — logique partagée du faisceau, du pilote de partie et du bras coach-prix (protocole de l'épreuve du
 * jeu, § 5 bis, point 10) : une seule implémentation, consommée par les trois.
 *
 *   Noteur            : les n meilleurs coups d'une position par le moteur, avec cache par (position, n, profondeur)
 *   classerCandidats  : les candidats admissibles pour un plan, avec leur classe (progressant / forcé / roque / intendance)
 *   derniereChance    : le meilleur coup progressant hors MultiPV, noté une fois à profondeur réduite, admis s'il coûte ≤ 1 pion
 *   choisirCoup       : ce que l'exécutant joue sous un plan (pilote de partie) — avec le retard mesuré à la profondeur de jeu
 *   pointCalme        : prolonger une position jusqu'à un point calme (prise, échec, pièce en prise, coup forcé)
 *   reponsesOuvertes  : la meilleure réponse adverse, et la seconde si elle est ex æquo
 *   faisceauLibre     : la référence du prix — mêmes candidats, même largeur, sans plan ni compteur ; evals[ply] = la
 *                       meilleure branche libre à ce demi-coup (même pression de sélection que la ligne contrainte)
 *   prixDeSegment     : le prix d'un plan de son adoption à son abandon — faisceau libre depuis l'adoption, écart au point calme
 *   structureCourante : la structure du moment pour un camp (propriétaire d'abord, ordre fixe à égalité)
 *
 * Toutes les évaluations sont en centièmes de pion, bornées à ± 10 pions (les scores de mat ne font pas des prix en milliers).
 * Un fil pour mesurer : le moteur est créé par l'appelant avec COACH_DETERMINISTIC=1.
 */
import { Chess } from 'chess.js';
import { vetoDefense, alarmeDame } from './zone-roi.mjs';
import { distance, suivre, estLevier } from './plan-distance.mjs';
import { enPrise } from './en-prise.mjs';
import { buildStructureFacts } from '../positional/structures.js';

export const DEFAUTS = Object.freeze({ depth: 18, depthDerniereChance: 14, candidats: 4, largeur: 4, plancher: 25, concession: 100, force: 100, k: 2 });
export const borneCp = (c) => Math.max(-1000, Math.min(1000, c));
export const uciOf = (m) => m.from + m.to + (m.promotion ?? '');
export const jouer = (fen, uci) => { const c = new Chess(fen); const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); return { m, fen: c.fen() }; };
export const estRoque = (m) => m.piece === 'k' && Math.abs(m.from.charCodeAt(0) - m.to.charCodeAt(0)) === 2;
const cpDe = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);

/** Les n meilleurs coups (point de vue du camp au trait), avec cache : [{ uci, m, cp }] triés par cp décroissant. */
export class Noteur {
  constructor(engine, opts = {}) { this.engine = engine; this.depth = opts.depth ?? DEFAUTS.depth; this.cache = new Map(); this.appels = 0; }
  async noter(fen, n, depth = this.depth) {
    const k = `${fen}|${n}|${depth}`; if (this.cache.has(k)) return this.cache.get(k);
    const c = new Chess(fen); if (c.isGameOver()) { this.cache.set(k, []); return []; }
    this.appels++;
    // 30 min : une MultiPV « tous les coups légaux » (dernière chance, ~40 lignes) à profondeur 18 dépasse 10 min à un fil sur le VPS (iqp-panov, 19 oct.).
    const lignes = await this.engine.analyze(fen, { depth, multipv: n, timeoutMs: 30 * 60_000 });
    const out = lignes.filter((l) => l.pv?.[0]).map((l) => ({ uci: l.pv[0], m: new Chess(fen).move({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), promotion: l.pv[0][4] }), cp: cpDe(l.score) })).sort((a, b) => b.cp - a.cp);
    this.cache.set(k, out); return out;
  }
  /** Tous les coups légaux notés. */
  async noterTous(fen, depth = this.depth) { return this.noter(fen, new Chess(fen).moves().length, depth); }
}

/** La position (à mon trait) est-elle calme ? `cands` = au moins les deux meilleurs coups. */
export function calme(fen, cands, side, p = DEFAUTS) {
  if (!cands.length) return true;
  const force = !cands[1] || cands[0].cp - cands[1].cp > p.force;
  return !(new Chess(fen).inCheck() || cands[0].m.captured || force || enPrise(fen, side));
}

/** Situation forcée pour le camp au trait : échec, prise à jouer, pièce en prise, coup unique, ou le meilleur bat le second de plus d'un pion. */
export function situationForcee(fen, cands, side, p = DEFAUTS) {
  return new Chess(fen).inCheck() || Boolean(cands[0]?.m.captured) || enPrise(fen, side) || (cands[1] && cands[0].cp - cands[1].cp > p.force) || cands.length === 1;
}

/**
 * Classe les candidats du MultiPV pour un plan. Un progressant à plus d'un pion du meilleur est une concession (refusé) ;
 * en situation forcée, seuls le meilleur coup (classe « forcé ») et les progressants sont admis ; le roque est neutre ;
 * l'intendance compte 1 et n'est plus admise au-delà de k ; un coup non progressant à plus d'un pion du meilleur n'est pas
 * une branche. Le compteur est recopié par candidat (chaque branche porte le sien).
 * @returns {{ admis: {cand, classe, compteur, progressant, cout}[], progressantsRefuses: number, coutRefuseMin: number, forcee: boolean, d0: number }}
 */
export function classerCandidats(fen, side, plan, cands, compteur, p = DEFAUTS) {
  const d0 = distance(fen, side, plan).d;
  const forcee = cands.length ? situationForcee(fen, cands, side, p) : false;
  const admis = [], vetos = []; let progressantsRefuses = 0, coutRefuseMin = Infinity;
  for (const cand of cands) {
    const apres = new Chess(fen); apres.move(cand.m.san);
    const progressant = distance(apres.fen(), side, suivre(plan, cand.m)).d < d0;
    const cout = cands[0].cp - cand.cp;
    let classe, cpt = compteur;
    // Le veto de défense (docs/plans/REGROUPEMENT-2026-10-21.md) : un pas VOULU qui dégarnit le roi sous attaque n'est pas une
    // branche ; jamais en situation forcée (une parade ou une reprise ne se vetoe pas). Il n'est pas compté comme refusé.
    if (progressant && p.regles?.veto && !forcee) { const v = vetoDefense(fen, side, cand.m.san); if (v) { vetos.push({ san: cand.m.san, ...v }); continue; } }
    if (progressant) { if (cout > p.concession) { progressantsRefuses++; coutRefuseMin = Math.min(coutRefuseMin, cout); continue; } classe = 'progressant'; cpt = 0; }
    else if (forcee && cand === cands[0]) classe = 'forcé';
    else if (estRoque(cand.m)) classe = 'roque';
    else if (forcee) continue;
    else { classe = 'intendance'; cpt++; if (cpt > p.k) continue; }
    if (!progressant && cout > p.concession) continue;
    admis.push({ cand, classe, compteur: cpt, progressant, cout });
  }
  return { admis, progressantsRefuses, coutRefuseMin, forcee, d0, vetos };
}

/**
 * La branche de la dernière chance : tous les coups légaux notés (à profondeur réduite, c'est un plafond de coût), le
 * meilleur progressant HORS MultiPV ; admis s'il coûte ≤ 1 pion par rapport au meilleur de cette notation.
 * @returns {Promise<{ cand, cout, admis: boolean } | null>}  null : aucun progressant hors MultiPV
 */
export async function derniereChance(noteur, fen, side, plan, cands, p = DEFAUTS) {
  const tous = await noteur.noterTous(fen, p.depthDerniereChance);
  const d0 = distance(fen, side, plan).d;
  for (const cand of tous) {
    if (cands.some((x) => x.uci === cand.uci)) continue;
    const apres = new Chess(fen); apres.move(cand.m.san);
    if (distance(apres.fen(), side, suivre(plan, cand.m)).d < d0) { const cout = tous[0].cp - cand.cp; return { cand, cout, admis: cout <= p.concession }; }
  }
  return null;
}

/**
 * Ce que l'exécutant joue sous un plan (pilote de partie, protocole § 2, ordre arrêté par le GE le 19 oct.) : en situation
 * forcée, le meilleur coup (« forcé » ; « forcé-progressant » s'il est lui-même un pas du plan — la reprise qui réalise —, et
 * il compte alors comme progrès) ; sinon **le meilleur progressant** admissible ; sinon le roque ; sinon, à compteur plein (k), la dernière
 * chance si elle est admise ; sinon le meilleur coup libre, compté « intendance » tant que le compteur n'est pas plein,
 * « libre » au-delà. Un seul compteur, `compteur` : coups consécutifs du coach sans progressant admissible (forcé et roque
 * le traversent sans le toucher, un progressant ou une dernière chance le remettent à zéro) — à k il déclenche la dernière
 * chance, à k + 1 le plan est « hors de prix en jeu » (§ 5 bis, 3). (Le Dev chef a montré que les deux compteurs du
 * premier jet bougeaient toujours ensemble : un compteur à deux seuils.) Le retard d'un coup est toujours (meilleur de la MultiPV à la profondeur de jeu −
 * valeur du coup) ; pour une dernière chance, la valeur du coup est lue dans la réponse adverse à la profondeur de jeu.
 * @returns {Promise<{ m, uci, classe, compteur, retard, cout, progressant, cands, concession? }>}
 */
export async function choisirCoup(noteur, fen, side, plan, etat = {}, p = DEFAUTS) {
  const compteur = etat.compteur ?? 0, R = p.regles ?? null;
  const cands = await noteur.noter(fen, p.candidats);
  if (!cands.length) return null;
  const { admis, forcee, coutRefuseMin, vetos } = classerCandidats(fen, side, plan, cands, compteur, p);
  // Règle 1 (cahier du lot 1 bis, § 2) : l'addition se lit AVANT le coup — un coup qui la porterait au-delà de la borne est refusé.
  const deborde = (retard) => R?.cumul != null && (etat.cumul ?? 0) + Math.max(0, retard) > R.cumul;
  let refus = null;
  const fin = (r) => (refus ? { ...r, refus } : r);
  const sortie = (a, classe, extra = {}) => { const retard = cands[0].cp - a.cp; return fin({ m: a.m, uci: a.uci, classe, ...avancer(etat, classe, retard), retard, cout: retard, progressant: ['progressant', 'forcé-progressant', 'dernière chance'].includes(classe), cands, ...extra }); };
  // Le forcé AVANT le progressant (GE, 19 oct.) : une parade est neutre pour le plan, qui reprend au coup suivant ; sinon un
  // pas à 0,9 passerait devant une pièce en prise et le prix contiendrait de la tactique.
  if (forcee) { const a0 = admis.find((a) => a.cand === cands[0]); return a0?.progressant ? sortie(cands[0], 'forcé-progressant') : sortie(cands[0], 'forcé'); }
  // L'alarme (règles AA) : un pas sous alarme n'est joué que si la vérification au moteur le garde ; sinon on passe au
  // progressant suivant, et s'il n'y en a plus, la fenêtre est suspendue comme sous le veto. Jamais en situation forcée.
  const alarmes = [];
  let prog = null;
  for (const a of admis.filter((x) => x.progressant)) { // dans l'ordre du moteur : le premier progressant gardé est le meilleur
    const al = R?.alarme ? alarmeDame(fen, side, a.cand.m.san) : null;
    if (al) { const v = await verifierAlarme(noteur, fen, a.cand.uci, R.alarme); alarmes.push({ san: a.cand.m.san, ...al, verification: v }); if (!v.admis) continue; }
    prog = a; break;
  }
  const alarme = alarmes.length ? { alarme: alarmes.at(-1) } : {};
  if (prog && !deborde(prog.cout)) return sortie(prog.cand, 'progressant', alarme);
  if (prog) {
    // Refus par l'addition : une vérification au faisceau court, une seule par segment (cahier § 11.1, § 12.3, § 13.2) —
    // gratuit (≤ plancher), c'est un sacrifice en cours de route : le pas est joué et l'addition repart du prix vérifié.
    refus = { san: prog.cand.m.san, cumul: (etat.cumul ?? 0) + prog.cout };
    if (R.verifier && p.verifier && !etat.sauvetages) {
      const prix = await p.verifier(fen, plan); refus.prixVerifie = prix;
      if (prix != null && prix <= p.plancher) { const v = refus; refus = null; return { ...sortie(prog.cand, 'progressant'), cumul: Math.max(0, prix), sauvetage: v }; }
    }
  }
  const roque = admis.find((a) => a.classe === 'roque');
  if (roque && !deborde(roque.cout)) return sortie(roque.cand, 'roque');
  // Règle 3 (§ 4) : l'attente utile — le premier candidat, dans l'ordre du moteur, qui n'est pas un pas du plan, coûte au plus
  // le plancher et sert au moins un plan du catalogue (p.sert : distance seulement, aucun appel moteur).
  if (R?.utile != null && p.sert) {
    const d0 = distance(fen, side, plan).d;
    for (const c of cands) {
      const cout = cands[0].cp - c.cp; if (cout > R.utile || deborde(cout)) continue;
      const apres = new Chess(fen); apres.move(c.m.san);
      if (distance(apres.fen(), side, suivre(plan, c.m)).d < d0) continue; // un pas du plan (refusé plus haut) n'est pas une attente
      const sert = p.sert(fen, c.m); if (sert.length) return sortie(c, 'attente utile', { sert });
    }
  }
  let concession = Number.isFinite(coutRefuseMin) ? coutRefuseMin : null;
  // Fenêtre suspendue : un pas a été vetoé et aucun autre n'est admis — le coup du moteur, neutre pour le plan, qui attend.
  if (vetos.length && !prog) return sortie(cands[0], 'suspendu', { concession, veto: vetos[0] });
  if (alarmes.length && !prog) return sortie(cands[0], 'suspendu', { concession, ...alarme });
  if (compteur >= p.k) {
    const dc = await derniereChance(noteur, fen, side, plan, cands, p);
    if (dc?.admis && R?.veto) { const v = vetoDefense(fen, side, dc.cand.m.san); if (v) return sortie(cands[0], 'suspendu', { concession, veto: { san: dc.cand.m.san, derniereChance: true, ...v } }); }
    if (dc?.admis && R?.alarme) {
      const al = alarmeDame(fen, side, dc.cand.m.san);
      if (al) { const v = await verifierAlarme(noteur, fen, dc.cand.uci, R.alarme); if (!v.admis) return sortie(cands[0], 'suspendu', { concession, alarme: { san: dc.cand.m.san, derniereChance: true, ...al, verification: v } }); }
    }
    if (dc?.admis) {
      const apres = jouer(fen, dc.cand.uci); const [rep] = await noteur.noter(apres.fen, 1);
      const valeur = rep ? -rep.cp : dc.cand.cp; // à la profondeur de jeu, comme les autres
      const retard = cands[0].cp - valeur;
      // Règle 2 (§ 3, § 10.2) : la dernière chance est jugée sur son retard à la profondeur de jeu, pas sur son coût à 14.
      if (R?.relireDC && retard > p.concession) return sortie(cands[0], 'libre', { concession, dcRefusee: { san: dc.cand.m.san, retard } });
      if (deborde(retard)) { refus = { san: dc.cand.m.san, cumul: (etat.cumul ?? 0) + retard, derniereChance: true }; return sortie(cands[0], 'libre', { concession }); }
      return fin({ m: dc.cand.m, uci: dc.cand.uci, classe: 'dernière chance', ...avancer(etat, 'dernière chance', retard), retard, cout: dc.cout, progressant: true, cands });
    }
    if (dc) concession = concession == null ? dc.cout : Math.min(concession, dc.cout);
    return sortie(cands[0], 'libre', { concession });
  }
  return sortie(cands[0], 'intendance', { concession });
}
/**
 * La vérification de l'alarme (règles AA) : le pas M est-il encore à moins de `borne` du meilleur coup, vu à `depth` (plus
 * profond que le jeu) ? Valeur de M lue dans la MultiPV profonde s'il y est, sinon par la meilleure réponse adverse à la
 * même profondeur. @returns {{ retard, depth, borne, admis }}
 */
export async function verifierAlarme(noteur, fen, uci, A) {
  const notes = await noteur.noter(fen, DEFAUTS.candidats, A.depth);
  if (!notes.length) return { retard: 0, depth: A.depth, borne: A.borne, admis: true };
  let valeur = notes.find((n) => n.uci === uci)?.cp;
  if (valeur == null) { const apres = jouer(fen, uci); const [rep] = await noteur.noter(apres.fen, 1, A.depth); valeur = rep ? -rep.cp : notes[0].cp; }
  const retard = notes[0].cp - valeur;
  return { retard, depth: A.depth, borne: A.borne, admis: retard <= A.borne };
}

/** Le plan est-il hors de prix en jeu ? (k + 1 coups consécutifs sans progressant admissible) */
export const horsDePrix = (etat, p = DEFAUTS) => (etat.compteur ?? 0) >= p.k + 1;

/**
 * Lot 1 bis (docs/plans/CAHIER-LOT-1-BIS-2026-10-20.md) : les règles, coupées par défaut (comportement du lot 1).
 * A = le garde-fou (cumul lu avant le coup, vérification au faisceau, dernière chance relue) ; B = A + l'attente utile.
 */
export const REGLES_1BIS = Object.freeze({
  A: Object.freeze({ cumul: 100, verifier: true, relireDC: true }),
  AV: Object.freeze({ cumul: 100, verifier: true, relireDC: true, veto: true }), // A + le veto de défense (REGROUPEMENT, 21 oct.)
  // A + l'alarme d'attaque de roi (veto à condition dame, déclencheur et non interdit) : le pas sous alarme est revu à
  // profondeur 24 et gardé s'il reste à un demi-pion du meilleur (borne du GE, 22 oct.). ALARME-ATTAQUE-ROI-2026-10-24.md.
  AA: Object.freeze({ cumul: 100, verifier: true, relireDC: true, alarme: Object.freeze({ depth: 24, borne: 50 }) }),
  B: Object.freeze({ cumul: 100, verifier: true, relireDC: true, utile: 25, patience: 6, sansPlan: true, plafondSansPlan: 100 }),
});

/**
 * La source unique (Dev chef, cahier § 10.1) : compteur, attente et cumul suivent de la classe du coup et de son retard.
 * Un pas (progressant, forcé-progressant, dernière chance) remet compteur et attente à zéro ; forcé et roque les traversent ;
 * le reste les incrémente — SEULE divergence : l'attente utile est neutre pour le compteur mais compte pour la patience.
 * Le cumul additionne les retards de tous les coups sauf les forcés (une parade est neutre), et n'est jamais remis à zéro.
 */
export function avancer(etat, classe, retard) {
  const compteur = etat.compteur ?? 0, attente = etat.attente ?? 0, cumul = etat.cumul ?? 0;
  const pas = ['progressant', 'forcé-progressant', 'dernière chance'].includes(classe), neutre = ['forcé', 'roque', 'suspendu'].includes(classe);
  return {
    compteur: pas ? 0 : neutre || classe === 'attente utile' ? compteur : compteur + 1,
    attente: pas ? 0 : neutre ? attente : attente + 1,
    cumul: classe === 'forcé' || classe === 'suspendu' ? cumul : cumul + Math.max(0, retard),
  };
}

/** Pourquoi le plan s'arrête-t-il avant le coup (null : il continue) ? Sans règles, le seul « hors de prix » du lot 1. */
export function raisonAbandon(etat, p = DEFAUTS) {
  const R = p.regles;
  if (horsDePrix(etat, p)) return R ? 'hors de prix (compteur)' : 'hors de prix';
  if (R && etat.cumulDeborde) return 'hors de prix (cumul)';
  if (R?.patience != null && (etat.attente ?? 0) >= R.patience) return 'en attente';
  return null;
}

/** Prolonge une position (à mon trait) jusqu'à un point calme : mon meilleur coup + la meilleure réponse ; l'échec toujours, le reste `p.budgetCalme` (2) fois au plus. */
export async function pointCalme(noteur, fen, ply, side, p = DEFAUTS) {
  const joues = []; let budget = p.budgetCalme ?? 2; // prolongations hors échec ; élargi pour un segment « payé en tactique »
  for (let i = 0; i < 2 * budget + 2; i++) {
    const cands = await noteur.noter(fen, Math.max(2, p.nMoi ?? 2));
    if (!cands.length) return { fen, ply, cp: null, joues, calme: false };
    if (calme(fen, cands, side, p)) return { fen, ply, cp: cands[0].cp, joues, calme: true };
    if (!new Chess(fen).inCheck()) { if (!budget) return { fen, ply, cp: cands[0].cp, joues, calme: false }; budget--; }
    const a = jouer(fen, cands[0].uci); joues.push(a.m);
    const [rep] = await noteur.noter(a.fen, p.nAdv ?? 1); if (!rep) return { fen: a.fen, ply: ply + 1, cp: cands[0].cp, joues, calme: true };
    const b = jouer(a.fen, rep.uci); joues.push(b.m); fen = b.fen; ply += 2;
  }
  const cands = await noteur.noter(fen, Math.max(2, p.nMoi ?? 2)); return { fen, ply, cp: cands[0]?.cp ?? null, joues, calme: false };
}

/** La meilleure réponse adverse, et la seconde si elle est ex æquo (≤ plancher). */
export async function reponsesOuvertes(noteur, fen, p = DEFAUTS) {
  const reps = await noteur.noter(fen, 2);
  return reps.length > 1 && Math.abs(reps[0].cp - reps[1].cp) <= p.plancher ? reps : reps.slice(0, 1);
}

/** La ligne gloutonne (le moteur joue les deux camps, à la politique `p.nMoi` / `p.nAdv`, 1/1 par défaut) : evals[ply] du point de vue de `side`, sans[] les coups. Référence d'un segment de partie, affichage et repli du faisceau. */
export async function ligneLibre(noteur, fen, side, plies, p = DEFAUTS) {
  const evals = [], sans = []; let f = fen;
  const nMoi = p.nMoi ?? 1, nAdv = p.nAdv ?? 1; // la MÊME politique que la partie (coach : MultiPV 4, adversaire : 2) — le meilleur coup peut dépendre de n
  for (let i = 0; i <= plies; i++) {
    const [best] = await noteur.noter(f, new Chess(f).turn() === side ? nMoi : nAdv);
    if (!best) { evals.push(evals[evals.length - 1] ?? 0); break; }
    evals.push(new Chess(f).turn() === side ? best.cp : -best.cp);
    if (i === plies) break;
    const j = jouer(f, best.uci); sans.push(j.m.san); f = j.fen;
  }
  return { evals, sans };
}

/**
 * Le faisceau LIBRE depuis `fen` (à mon trait) sur `horizon` coups : evals[ply] indexé depuis 0 = la meilleure branche libre
 * à ce demi-coup ; repli sur la ligne gloutonne quand il n'y a plus d'état. Même largeur, mêmes candidats, mêmes réponses
 * ouvertes que la ligne contrainte : c'est ce qui rend le prix symétrique.
 */
export async function faisceauLibre(noteur, fen, side, horizon, p = DEFAUTS) {
  const glouton = await ligneLibre(noteur, fen, side, 2 * horizon, p);
  const evals = [...glouton.evals];
  let etats = [{ fen, ply: 0, cp: glouton.evals[0] }];
  for (let coup = 0; coup < horizon && etats.length; coup++) {
    const suivants = [];
    for (const e of etats) {
      const cands = await noteur.noter(e.fen, p.candidats);
      for (const cand of cands) {
        if (cands[0].cp - cand.cp > p.concession) continue;
        const apres = jouer(e.fen, cand.uci);
        const reps = await reponsesOuvertes(noteur, apres.fen, p);
        if (!reps.length) { suivants.push({ fen: apres.fen, ply: e.ply + 1, cp: cand.cp, fini: true }); continue; }
        for (const rep of reps) suivants.push({ fen: jouer(apres.fen, rep.uci).fen, ply: e.ply + 2, cp: -rep.cp });
      }
    }
    const vues = new Set();
    etats = suivants.sort((a, b) => b.cp - a.cp).filter((x) => !vues.has(x.fen) && vues.add(x.fen)).slice(0, p.largeur);
    for (const x of etats) evals[x.ply] = Math.max(evals[x.ply] ?? -Infinity, x.cp);
    etats = etats.filter((x) => !x.fini);
  }
  return { evals, glouton: glouton.evals, sans: glouton.sans };
}

/**
 * Le prix d'un segment (un plan de son adoption à son abandon) : faisceau libre depuis la position d'adoption sur la
 * longueur du segment, la ligne jouée prolongée à son point calme, la référence lue au même demi-coup relatif.
 * @param {{ fenAdoption: string, fenAbandon: string, plies: number }} seg  plies = demi-coups joués entre les deux (à mon trait aux deux bouts)
 * `prix` = contre l'enveloppe du faisceau libre (le protocole, § 5 bis, 9) ; `prixLigne` = contre la ligne gloutonne (une seule
 * ligne des deux côtés — M1 du Dev chef : l'enveloppe est un max de quatre branches, la ligne jouée est unique, l'écart entre
 * les deux prix chiffre ce biais). Aucun calcul moteur en plus.
 * @returns {Promise<{ prix: number, prixLigne: number, prixBrut: number, calme: boolean, prolonge: string[], plyCalme: number }>}
 */
export async function prixDeSegment(noteur, seg, side, p = DEFAUTS) {
  const q = await pointCalme(noteur, seg.fenAbandon, seg.plies, side, p);
  const horizon = Math.ceil(q.ply / 2) + 1;
  const libre = await faisceauLibre(noteur, seg.fenAdoption, side, horizon, p);
  const ref = (ply) => borneCp(libre.evals[Math.min(ply, libre.evals.length - 1)] ?? 0);
  const refLigne = (ply) => borneCp(libre.glouton[Math.min(ply, libre.glouton.length - 1)] ?? 0);
  const [bestAbandon] = await noteur.noter(seg.fenAbandon, Math.max(2, p.nMoi ?? 2));
  const cpBrut = bestAbandon ? bestAbandon.cp : 0, cpCalme = borneCp(q.cp ?? cpBrut);
  return { prix: ref(q.ply) - cpCalme, prixLigne: refLigne(q.ply) - cpCalme, prixBrut: ref(seg.plies) - borneCp(cpBrut), calme: q.calme, prolonge: q.joues.map((m) => m.san), plyCalme: q.ply };
}

export const ORDRE_STRUCTURES = ['PDI', 'PIONS_PENDANTS', 'CARLSBAD', 'CHAINE_E5', 'CHAINE_D5', 'MAROCZY', 'PETIT_CENTRE_SICILIEN'];
/** Les structures reconnues dans une position : [{ name, color }]. */
export const structuresDe = (fen) => buildStructureFacts(fen).filter((f) => f.id === 'STRUCTURE').map((f) => ({ name: f.params.name, color: f.params.color }));
/** Signature textuelle (pour détecter une bascule). */
export const signatureStructure = (fen) => structuresDe(fen).map((x) => `${x.name}:${x.color}`).sort().join(' ') || '—';
/** La structure courante pour `side` : celle dont il est propriétaire si elle existe, sinon celle de l'adversaire ; à égalité l'ordre fixe. */
export function structureCourante(fen, side) {
  const sts = structuresDe(fen); if (!sts.length) return null;
  const rang = (s) => ORDRE_STRUCTURES.indexOf(s.name);
  const miennes = sts.filter((s) => s.color === side).sort((a, b) => rang(a) - rang(b));
  if (miennes.length) return { ...miennes[0], role: 'owner' };
  const autres = sts.filter((s) => s.color !== side).sort((a, b) => rang(a) - rang(b));
  return { ...autres[0], role: 'opponent' };
}
/** Un plan est-il encore jouable (distance finie, cible existante) ? */
export const jouable = (fen, side, plan) => estLevier(fen, side, plan) && Number.isFinite(distance(fen, side, plan).d);
