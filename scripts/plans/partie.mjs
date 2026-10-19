#!/usr/bin/env node
/**
 * Le pilote de partie — l'épreuve du jeu (docs/plans/PROTOCOLE-EPREUVE-DU-JEU-2026-10-19.md).
 *
 *   node scripts/plans/partie.mjs --depart <id> --camp w|b --bras livre|prix|temoin [--parties 10] [--numeros 1,3]
 *                                 [--depth 18] [--plies 80] [--elargi] [--out reports/plans/epreuve/<dossier>]
 *
 * Un processus = un départ × un camp × un bras × ses parties (le cache de notation partage les préfixes). Un fil
 * (COACH_DETERMINISTIC=1), STOCKFISH_PATH pour le binaire.
 *
 * Les joueurs (§ 2) : le COACH (bras coach-livre : première instance jouable de la structure courante dans la table ;
 * bras coach-prix : la moins chère des instances par un faisceau court, l'ordre du livre départage à ≤ 25 cp) tient le
 * plan ; l'EXÉCUTANT (Stockfish contraint, coach/coup-contraint.mjs → choisirCoup) le paie ; l'ADVERSAIRE (Stockfish
 * libre) tire sa réponse parmi ses deux meilleures quand elles sont ex æquo, au hasard d'une graine par (départ, n°).
 * Bras témoin : pas de coach, Stockfish libre des deux côtés, mêmes graines côté adversaire.
 *
 * Abandons (§ 5 bis, 4) : bascule de structure, réalisation (puis enchaînement : instance suivante, sinon la colonne que
 * la rupture a ouverte), hors de prix en jeu (k + 1 coups sans progressant admissible), sans objet. Aucune structure
 * reconnue : le dernier plan est gardé tant qu'il est jouable, sinon coups libres (notés : ils ne mesurent rien).
 *
 * Mesure (§ 3) : le prix de chaque segment (adoption → abandon) contre le faisceau libre lancé depuis la position
 * d'adoption, écart au point calme (coach/coup-contraint.mjs → prixDeSegment, réglages du faisceau du 18 octobre) ;
 * coût de la partie = somme des prix. Journal : la somme des retards coup par coup (secondaire), la classe de chaque coup.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, verrouiller, libelle } from '../../coach/plan-distance.mjs';
import { instancier } from '../../coach/plans-structures.mjs';
import { Noteur, DEFAUTS, choisirCoup, horsDePrix, reponsesOuvertes, prixDeSegment, structureCourante, jouable, jouer, borneCp, faisceauLibre } from '../../coach/coup-contraint.mjs';
import { faisceauPlan, REGLAGES_FAISCEAU } from '../../coach/faisceau-plan.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { trouverDepart, fenDepart } from './departs.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEP = trouverDepart(opt('--depart', '')); if (!DEP) { console.error('--depart <id> inconnu'); process.exit(2); }
const CAMP = opt('--camp', 'w'); if (!['w', 'b'].includes(CAMP)) { console.error('--camp w|b'); process.exit(2); }
const BRAS = opt('--bras', 'livre'); if (!['livre', 'prix', 'temoin'].includes(BRAS)) { console.error('--bras livre|prix|temoin'); process.exit(2); }
const DEPTH = Number(opt('--depth', 18)), PLIES = Number(opt('--plies', 80)), PARTIES = Number(opt('--parties', 10));
const NUMEROS = opt('--numeros', null)?.split(',').map(Number) ?? Array.from({ length: PARTIES }, (_, i) => i + 1);
const ELARGI = args.includes('--elargi'); // fenêtre d'ex æquo adverse à 40 cp (N effectif < 5)
const OUT = opt('--out', `reports/plans/epreuve/partie-${DEP.id}-${CAMP}-${BRAS}`);
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const fr = enToFr;

const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const noteur = new Noteur(engine, { depth: DEPTH });
/** L'exécutant : MultiPV 4 à la profondeur de jeu, dernière chance décidée à 14 (§ 5 bis, 8). */
const P = { ...DEFAUTS, depth: DEPTH, depthDerniereChance: Math.min(14, DEPTH) };
/** L'adversaire : réponses ex æquo ≤ 25 cp (40 si élargi). */
const PA = { ...DEFAUTS, plancher: ELARGI ? 40 : DEFAUTS.plancher };
/** La mesure : le faisceau libre du 18 octobre (largeur 4, quatre candidats), dernière chance à la profondeur de jeu comme dans le faisceau. */
const PR = { ...REGLAGES_FAISCEAU, depth: DEPTH, depthDerniereChance: DEPTH, nMoi: DEFAUTS.candidats, nAdv: 2 }; // la gloutonne et le point calme jouent la politique de la partie (Dev chef) : « gratuit » ⇒ identique
/** Le choix du coach-prix : un faisceau court (horizon 10, largeur 2) — un choix, pas une mesure. */
const PC = { ...REGLAGES_FAISCEAU, depth: DEPTH, depthDerniereChance: DEPTH, horizon: 10, horizonStructure: 10, largeur: 2 };

const fnv = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const TENURE = (plan) => !['rupture', 'poussee'].includes(plan.famille);
const FORCES_MAX = 3; // coups forcés consécutifs du coach (six demi-coups) : segment « tactique »
const cleInstance = (inst) => inst.pourquoi ?? JSON.stringify(inst.plan);

async function partie(numero) {
  const t0 = Date.now();
  const graine = fnv(`${DEP.coups ?? DEP.fen}|${numero}`), rng = mulberry32(graine);
  const side = CAMP, adv = side === 'w' ? 'b' : 'w';
  let fen = fenDepart(DEP), ply = 0;
  const sans = [], journal = [], segments = [], tirages = [];
  const coach = { plan: null, structure: null, nomStructure: null, utilises: new Set(), compteur: 0, realise: false, dApresMoi: null, dernier: null, dissoute: false };
  let seg = null;
  const fermer = (raison) => {
    if (!seg) return;
    seg.plyAbandon = ply; seg.fenAbandon = fen; seg.raison = raison; seg.plies = ply - seg.plyAdoption;
    if ((coach.forces ?? 0) >= FORCES_MAX) seg.abandonTactique = true; // abandonné en pleine séquence forcée : pas de prix ici
    segments.push(seg);
    coach.dernier = { plan: coach.plan, raison }; seg = null; coach.plan = null; coach.compteur = 0; coach.realise = false; coach.forces = 0;
  };
  const adopter = (inst, origine, choix = null) => {
    coach.plan = inst.plan; coach.compteur = 0; coach.realise = false; coach.utilises.add(cleInstance(inst));
    seg = { plan: libelle(inst.plan, fen), pourquoi: inst.pourquoi ?? null, structure: coach.nomStructure, origine, choix, plyAdoption: ply, fenAdoption: fen, coups: 0, retards: 0, classes: {} };
  };
  /** Le plan de service après une réalisation : la colonne que la rupture a ouverte — cible, cible−1, cible+1, sans pion à moi, distance finie (la plus proche de la cible d'abord). */
  const planDeService = () => {
    const d = coach.dernier?.plan; if (!d || !['rupture', 'poussee', 'et'].includes(d.famille)) return null;
    const cibles = d.famille === 'et' ? d.plans.map((p) => p.cible).filter(Boolean) : [d.cible];
    const c = new Chess(fen), colonnes = new Set();
    for (const cible of cibles) for (const dx of [0, -1, 1]) { const f = String.fromCharCode(cible.charCodeAt(0) + dx); if (f >= 'a' && f <= 'h') colonnes.add(f); }
    for (const col of colonnes) {
      const mienPion = [...Array(8)].some((_, i) => { const p = c.get(`${col}${i + 1}`); return p && p.type === 'p' && p.color === side; });
      if (mienPion) continue;
      const plan = { famille: 'colonne', colonne: col };
      if (jouable(fen, side, plan)) return { plan, pourquoi: `plan de service : la colonne ${col} ouverte par ${libelle(d, fen)}` };
    }
    return null;
  };
  /** Le coach-prix : la moins chère des instances par un faisceau court ; à ≤ 25 cp, la première de la table. */
  const choisirInstance = async (cands) => {
    if (BRAS !== 'prix' || cands.length === 1) return { inst: cands[0], choix: null };
    const libre = await faisceauLibre(noteur, fen, side, PC.horizon, PC);
    const notes = [];
    for (const inst of cands.slice(0, 3)) {
      const r = await faisceauPlan(noteur, PC, fen, side, inst.plan, [], libre, { sousFaisceau: true });
      notes.push({ inst, libelle: r.libelle, phrase: r.phrase, prix: r.prix, tempo: r.tempo, cle: r.prix == null ? Infinity : r.prix });
    }
    let best = notes[0];
    for (const n of notes.slice(1)) if (n.cle < best.cle - DEFAUTS.plancher) best = n;
    return { inst: best.inst, choix: notes.map((n) => ({ libelle: n.libelle, phrase: n.phrase, prix: n.prix, tempo: n.tempo, retenu: n === best })) };
  };

  async function coupDuCoach() {
    const evts = [];
    const sc = structureCourante(fen, side), sig = sc ? `${sc.name}:${sc.color}:${sc.role}` : null;
    // Précédence (Dev chef, 3) : la bascule est testée AVANT la réalisation — si les deux tombent sur la même réponse adverse, la
    // bascule gagne (pas d'enchaînement, on adopte le plan de la nouvelle structure). Une dissolution (aucune structure) ne ferme
    // rien (§ 2 : le dernier plan est gardé tant qu'il est jouable) ; la même structure qui réapparaît ouvre un nouvel épisode
    // (instances à nouveau disponibles, M5 du Dev chef) sans bascule.
    if (!sc) coach.dissoute = Boolean(coach.structure);
    if (sc && sig !== coach.structure) {
      if (coach.plan) { fermer('bascule'); evts.push(`bascule → ${sc.name} (${sc.role})`); } else if (coach.structure) evts.push(`structure → ${sc.name} (${sc.role})`); else evts.push(`structure ${sc.name} (${sc.role})`);
      coach.structure = sig; coach.nomStructure = sc.name; coach.utilises = new Set(); coach.dissoute = false;
    } else if (sc && coach.dissoute) { coach.utilises = new Set(); coach.dissoute = false; evts.push(`structure ${sc.name} de retour`); }
    let enchaine = false;
    if (coach.plan && coach.realise) { fermer('réalisé'); evts.push('réalisé'); enchaine = true; }
    else if (coach.plan && !jouable(fen, side, coach.plan)) { fermer('sans objet'); evts.push('sans objet'); }
    else if (coach.plan && horsDePrix(coach, P)) { fermer('hors de prix'); evts.push('hors de prix'); }
    if (!coach.plan && sc) {
      const cands = instancier(fen, side, sc.name, sc.color).filter((i) => !coach.utilises.has(cleInstance(i)) && jouable(fen, side, i.plan));
      if (cands.length) { const ch = await choisirInstance(cands); adopter(ch.inst, enchaine ? 'enchaînement' : BRAS, ch.choix); evts.push(`adoption ${seg.plan}`); }
      else if (enchaine) { const s = planDeService(); if (s) { adopter(s, 'service'); evts.push(`adoption ${seg.plan}`); } }
    } else if (!coach.plan && enchaine) { const s = planDeService(); if (s) { adopter(s, 'service'); evts.push(`adoption ${seg.plan}`); } }
    let r;
    if (coach.plan) {
      r = await choisirCoup(noteur, fen, side, coach.plan, coach, P); if (!r) return false; coach.compteur = r.compteur;
      // Plafond tactique (GE, 19 oct.) : trois coups forcés d'affilée (six demi-coups) marquent le segment « tactique » ; un abandon
      // à cet endroit n'est pas tarifé là (la logique du point calme appliquée au compteur).
      coach.forces = r.classe === 'forcé' ? (coach.forces ?? 0) + 1 : 0;
      if (coach.forces >= FORCES_MAX) { seg.tactique = true; evts.push('tactique'); }
    }
    else { const cands = await noteur.noter(fen, P.candidats); if (!cands.length) return false; r = { m: cands[0].m, uci: cands[0].uci, classe: 'libre', retard: 0, cands }; }
    const entree = { ply, san: r.m.san, classe: r.classe, retard: r.retard, plan: seg?.plan ?? null, structure: coach.nomStructure, evts, cands: r.cands.map((x) => `${x.m.san} ${fmt(x.cp)}`).join(' · ') };
    if (r.concession != null) entree.concession = r.concession;
    journal.push(entree);
    if (seg) { seg.coups++; seg.retards += r.retard; seg.classes[r.classe] = (seg.classes[r.classe] ?? 0) + 1; }
    const j = jouer(fen, r.uci); sans.push(j.m.san); fen = j.fen; ply++;
    if (coach.plan) { coach.plan = suivre(coach.plan, j.m); coach.dApresMoi = distance(fen, side, coach.plan).d; }
    return true;
  }
  async function coupAdverse(libre) {
    const reps = await reponsesOuvertes(noteur, fen, PA); if (!reps.length) return false;
    const alt = reps.length > 1; const k = alt && rng() < 0.5 ? 1 : 0;
    if (alt) tirages.push({ ply, choisi: reps[k].m.san, autre: reps[1 - k].m.san, ecart: Math.abs(reps[0].cp - reps[1].cp) });
    const j = jouer(fen, reps[k].uci); sans.push(j.m.san); fen = j.fen; ply++;
    if (coach.plan) {
      coach.plan = suivre(coach.plan, j.m); const d = distance(fen, side, coach.plan).d;
      const realise = TENURE(coach.plan) ? d === 0 : (coach.dApresMoi === 0 || d === 0);
      if (realise) { coach.plan = verrouiller(coach.plan, fen, side); coach.realise = true; }
    }
    return true;
  }
  async function coupLibre() { const cands = await noteur.noter(fen, P.candidats); if (!cands.length) return false; const j = jouer(fen, cands[0].uci); sans.push(j.m.san); fen = j.fen; ply++; return true; }

  let fini = false;
  while (ply < PLIES) {
    const c = new Chess(fen); if (c.isGameOver()) { fini = true; break; }
    const ok = c.turn() === side ? (BRAS === 'temoin' ? await coupLibre() : await coupDuCoach()) : await coupAdverse();
    if (!ok) { fini = true; break; }
  }
  // Fin : barème (§ 3), éval du point de vue du coach, bornée.
  const c = new Chess(fen);
  let resultat;
  if (c.isCheckmate()) resultat = { type: 'mat', eval: c.turn() === side ? -1000 : 1000 };
  else if (c.isDraw()) resultat = { type: c.isThreefoldRepetition() ? 'nulle (répétition)' : 'nulle', eval: 0 };
  else { const [best] = await noteur.noter(fen, c.turn() === side ? P.candidats : 2); resultat = { type: ply >= PLIES ? `${PLIES}e demi-coup` : 'fin', eval: best ? borneCp(c.turn() === side ? best.cp : -best.cp) : 0 }; }
  // Le dernier segment se ferme à la fin ; si c'est à l'adversaire de jouer, sa meilleure réponse ferme le segment (hors partie).
  let fermeture = null;
  if (seg) {
    if (c.turn() !== side && !c.isGameOver()) { const [rep] = await noteur.noter(fen, 2); if (rep) { fermeture = rep.m.san; fen = jouer(fen, rep.uci).fen; ply++; } }
    fermer('fin');
  }
  // Le prix par segment (§ 3, mesure) : faisceau libre depuis l'adoption, écart au point calme.
  // Le prix (GE, 19 oct., M1) : contre la LIGNE GLOUTONNE depuis l'adoption (une ligne contre une ligne) ; l'enveloppe du
  // faisceau libre est publiée à côté, l'écart médian entre les deux chiffre le biais. Un segment « gratuit » (le coach a joué
  // à chaque coup le coup même du moteur, sans tirage adverse) doit lire exactement 0 : vérification publiée.
  // Un segment abandonné en pleine séquence forcée est tarifé APRÈS, au point calme suivant (budget élargi), « payé en
  // tactique » ; « non tarifé » seulement si aucun point calme n'est retrouvé.
  for (const s of segments) {
    s.gratuit = s.retards === 0 && !tirages.some((t) => t.ply >= s.plyAdoption && t.ply < s.plyAbandon);
    if (s.plies <= 0 || new Chess(s.fenAbandon).turn() !== side) { s.prix = null; s.etiquette = s.plies <= 0 ? 'segment vide' : 'hors trait'; continue; }
    const r = await prixDeSegment(noteur, { fenAdoption: s.fenAdoption, fenAbandon: s.fenAbandon, plies: s.plies }, side, s.abandonTactique ? { ...PR, budgetCalme: 6 } : PR);
    if (s.abandonTactique && !r.calme) { s.prix = null; s.etiquette = 'non tarifé : pas de point calme'; s.prolonge = r.prolonge; continue; }
    s.prix = r.prixLigne; s.prixEnveloppe = r.prix; s.prixBrut = r.prixBrut; s.calme = r.calme; s.prolonge = r.prolonge; s.plyCalme = r.plyCalme;
    s.etiquette = s.abandonTactique ? 'payé en tactique' : (s.gratuit ? (s.prix === 0 ? 'gratuit, lit 0' : `GRATUIT MAIS LIT ${fmt(s.prix)}`) : null);
  }
  const coupsCoach = journal.length, coupsSousPlan = journal.filter((e) => e.plan).length;
  const cout = segments.some((s) => s.prix != null) ? segments.reduce((a, s) => a + (s.prix ?? 0), 0) : null;
  const coutEnveloppe = cout == null ? null : segments.reduce((a, s) => a + (s.prixEnveloppe ?? 0), 0);
  return { depart: DEP.id, lot: DEP.lot, camp: side, bras: BRAS, numero, graine, elargi: ELARGI, sans, empreinte: fnv(sans.join(' ')), plies: sans.length, resultat, fermeture,
    cout, coutEnveloppe, retards: segments.reduce((a, s) => a + s.retards, 0), coupsCoach, coupsSousPlan, partSousPlan: coupsCoach ? coupsSousPlan / coupsCoach : null,
    segments: segments.map((s) => ({ ...s, fenAdoption: undefined, fenAbandon: undefined, fens: { adoption: s.fenAdoption, abandon: s.fenAbandon } })), tirages, journal, appels: noteur.appels, secondes: Math.round((Date.now() - t0) / 1000) };
}

function rendre(parties) {
  const md = [`# Épreuve du jeu — ${DEP.nom} — coach ${CAMP === 'w' ? 'Blancs' : 'Noirs'} — bras ${BRAS} — prof. ${DEPTH}, ${PLIES} demi-coups, ${parties.length} partie(s)`, '',
    '| n° | graine | coups | résultat | éval finale | coût (Σ prix · enveloppe) | Σ retards | coups sous plan | segments (plan · origine · raison · prix · enveloppe · étiquette) | s |', '|---|---|---|---|---|---|---|---|---|---|'];
  for (const p of parties) md.push(`| ${p.numero} | ${p.graine} | ${p.plies} | ${p.resultat.type} | ${fmt(p.resultat.eval)} | ${fmt(p.cout)} · ${fmt(p.coutEnveloppe)} | ${fmt(p.retards)} | ${p.coupsSousPlan}/${p.coupsCoach} | ${p.segments.map((s) => `${s.plan} · ${s.origine} · ${s.raison} · ${fmt(s.prix)} · ${fmt(s.prixEnveloppe)}${s.etiquette ? ` · ${s.etiquette}` : ''}`).join('<br>') || '—'} | ${p.secondes} |`);
  const distinctes = new Set(parties.map((p) => p.empreinte)).size;
  const segs = parties.flatMap((p) => p.segments), gratuits = segs.filter((s) => s.gratuit && s.prix != null), ecarts = segs.filter((s) => s.prix != null && s.prixEnveloppe != null).map((s) => s.prixEnveloppe - s.prix).sort((a, b) => a - b);
  md.push('', `Parties distinctes : ${distinctes}/${parties.length} (N effectif). Tirages adverses : ${parties.reduce((a, p) => a + p.tirages.length, 0)}.`,
    `Vérification M1 : ${gratuits.length} segment(s) gratuit(s) (le coach a joué le coup du moteur à chaque coup, sans tirage) — ${gratuits.filter((s) => s.prix !== 0).length} ne lisent pas 0${gratuits.filter((s) => s.prix !== 0).length ? ` (${gratuits.filter((s) => s.prix !== 0).map((s) => fmt(s.prix)).join(', ')})` : ''}. Biais d'enveloppe (enveloppe − ligne) : médiane ${fmt(ecarts[Math.floor(ecarts.length / 2)] ?? null)} sur ${ecarts.length} segment(s).`, '');
  for (const p of parties) {
    md.push(`## Partie ${p.numero}`, '', `Coups : ${p.sans.map((s, i) => (i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : '') + fr(s)).join(' ')}`, '', '| ply | coup | classe | retard | plan | structure | événements | candidats |', '|---|---|---|---|---|---|---|---|');
    for (const e of p.journal) md.push(`| ${e.ply} | ${fr(e.san)} | ${e.classe} | ${fmt(e.retard)} | ${e.plan ?? '—'} | ${e.structure ?? '—'} | ${e.evts.join(' ; ')} | ${e.cands} |`);
    md.push('');
  }
  return md.join('\n');
}

const parties = [];
for (const n of NUMEROS) {
  console.error(`${DEP.id} ${CAMP} ${BRAS} : partie ${n}…`);
  const p = await partie(n); parties.push(p);
  console.error(`  ${p.plies} demi-coups, ${p.resultat.type} ${fmt(p.resultat.eval)}, coût ${fmt(p.cout)}, ${p.segments.length} segment(s), ${p.secondes} s`);
}
engine.stop();
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/parties.json`, JSON.stringify(parties, null, 1));
writeFileSync(`${OUT}/parties.md`, rendre(parties));
console.error(`écrit : ${OUT}/parties.{json,md}`);
