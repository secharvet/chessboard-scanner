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
    const lignes = await this.engine.analyze(fen, { depth, multipv: n, timeoutMs: 10 * 60_000 });
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
  const admis = []; let progressantsRefuses = 0, coutRefuseMin = Infinity;
  for (const cand of cands) {
    const apres = new Chess(fen); apres.move(cand.m.san);
    const progressant = distance(apres.fen(), side, suivre(plan, cand.m)).d < d0;
    const cout = cands[0].cp - cand.cp;
    let classe, cpt = compteur;
    if (progressant) { if (cout > p.concession) { progressantsRefuses++; coutRefuseMin = Math.min(coutRefuseMin, cout); continue; } classe = 'progressant'; cpt = 0; }
    else if (forcee && cand === cands[0]) classe = 'forcé';
    else if (estRoque(cand.m)) classe = 'roque';
    else if (forcee) continue;
    else { classe = 'intendance'; cpt++; if (cpt > p.k) continue; }
    if (!progressant && cout > p.concession) continue;
    admis.push({ cand, classe, compteur: cpt, progressant, cout });
  }
  return { admis, progressantsRefuses, coutRefuseMin, forcee, d0 };
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
  const compteur = etat.compteur ?? 0;
  const cands = await noteur.noter(fen, p.candidats);
  if (!cands.length) return null;
  const { admis, forcee, coutRefuseMin } = classerCandidats(fen, side, plan, cands, compteur, p);
  const sortie = (a, classe, cpt, extra = {}) => ({ m: a.m, uci: a.uci, classe, compteur: cpt, retard: cands[0].cp - a.cp, cout: cands[0].cp - a.cp, progressant: ['progressant', 'forcé-progressant', 'dernière chance'].includes(classe), cands, ...extra });
  // Le forcé AVANT le progressant (GE, 19 oct.) : une parade est neutre pour le plan, qui reprend au coup suivant ; sinon un
  // pas à 0,9 passerait devant une pièce en prise et le prix contiendrait de la tactique.
  if (forcee) { const a0 = admis.find((a) => a.cand === cands[0]); return a0?.progressant ? sortie(cands[0], 'forcé-progressant', 0) : sortie(cands[0], 'forcé', compteur); }
  const prog = admis.find((a) => a.progressant); // admis est dans l'ordre du moteur : le premier progressant est le meilleur
  if (prog) return sortie(prog.cand, 'progressant', 0);
  const roque = admis.find((a) => a.classe === 'roque');
  if (roque) return sortie(roque.cand, 'roque', compteur);
  let concession = Number.isFinite(coutRefuseMin) ? coutRefuseMin : null;
  if (compteur >= p.k) {
    const dc = await derniereChance(noteur, fen, side, plan, cands, p);
    if (dc?.admis) {
      const apres = jouer(fen, dc.cand.uci); const [rep] = await noteur.noter(apres.fen, 1);
      const valeur = rep ? -rep.cp : dc.cand.cp; // à la profondeur de jeu, comme les autres
      return { m: dc.cand.m, uci: dc.cand.uci, classe: 'dernière chance', compteur: 0, retard: cands[0].cp - valeur, cout: dc.cout, progressant: true, cands };
    }
    if (dc) concession = concession == null ? dc.cout : Math.min(concession, dc.cout);
    return sortie(cands[0], 'libre', compteur + 1, { concession });
  }
  return sortie(cands[0], 'intendance', compteur + 1, { concession });
}
/** Le plan est-il hors de prix en jeu ? (k + 1 coups consécutifs sans progressant admissible) */
export const horsDePrix = (etat, p = DEFAUTS) => (etat.compteur ?? 0) >= p.k + 1;

/** Prolonge une position (à mon trait) jusqu'à un point calme : mon meilleur coup + la meilleure réponse ; l'échec toujours, le reste `p.budgetCalme` (2) fois au plus. */
export async function pointCalme(noteur, fen, ply, side, p = DEFAUTS) {
  const joues = []; let budget = p.budgetCalme ?? 2; // prolongations hors échec ; élargi pour un segment « payé en tactique »
  for (let i = 0; i < 2 * budget + 2; i++) {
    const cands = await noteur.noter(fen, 2);
    if (!cands.length) return { fen, ply, cp: null, joues, calme: false };
    if (calme(fen, cands, side, p)) return { fen, ply, cp: cands[0].cp, joues, calme: true };
    if (!new Chess(fen).inCheck()) { if (!budget) return { fen, ply, cp: cands[0].cp, joues, calme: false }; budget--; }
    const a = jouer(fen, cands[0].uci); joues.push(a.m);
    const [rep] = await noteur.noter(a.fen, 1); if (!rep) return { fen: a.fen, ply: ply + 1, cp: cands[0].cp, joues, calme: true };
    const b = jouer(a.fen, rep.uci); joues.push(b.m); fen = b.fen; ply += 2;
  }
  const cands = await noteur.noter(fen, 1); return { fen, ply, cp: cands[0]?.cp ?? null, joues, calme: false };
}

/** La meilleure réponse adverse, et la seconde si elle est ex æquo (≤ plancher). */
export async function reponsesOuvertes(noteur, fen, p = DEFAUTS) {
  const reps = await noteur.noter(fen, 2);
  return reps.length > 1 && Math.abs(reps[0].cp - reps[1].cp) <= p.plancher ? reps : reps.slice(0, 1);
}

/** La ligne gloutonne (le moteur joue les deux camps) : evals[ply] du point de vue de `side`, sans[] les coups. Affichage et repli. */
export async function ligneLibre(noteur, fen, side, plies) {
  const evals = [], sans = []; let f = fen;
  for (let i = 0; i <= plies; i++) {
    const [best] = await noteur.noter(f, 1);
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
  const glouton = await ligneLibre(noteur, fen, side, 2 * horizon);
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
  const [bestAbandon] = await noteur.noter(seg.fenAbandon, 1);
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
