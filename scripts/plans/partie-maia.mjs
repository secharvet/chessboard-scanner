#!/usr/bin/env node
/**
 * L'épreuve Maia (docs/plans/PROTOCOLE-MAIA-2026-10-21.md) : Maia-1500 contre Maia-1500 depuis les départs du lot 1.
 *
 *   node scripts/plans/partie-maia.mjs --depart <id> --bras GA|GAU|LL [--camp w|b] [--parties 25] [--numeros 1,3]
 *                                      [--depth 18] [--plies 200] [--out reports/plans/maia/<dossier>]
 *
 * Bras (§ 3) : GA = l'élève du camp --camp guidé par le coach-livre, règles A ; GAU = GA + attente utile ; LL = Maia libre des
 * deux côtés, avec un COACH FANTÔME de chaque côté (reconnaissance et adoption sans filtrer, § 6 point 3) — une partie LL sert
 * de référence aux deux couleurs. Mêmes graines par (départ, n°) dans tous les bras ; le tirage est indexé par la position
 * (§ 7 bis.3) : tant que les positions coïncident, les coups coïncident.
 *
 * Stockfish ne joue jamais : il arbitre le garde-fou (coach/coup-maia.mjs), note chaque position (point de non-retour, § 6)
 * et adjuge (§ 5 : mat vu ou ≥ +6,00 pendant 10 demi-coups ; à 200 demi-coups, ≥ +3,00 = gain, sinon nulle).
 * Le catalogue, la reconnaissance, l'adoption, l'enchaînement, le plan de service et la bascule sont ceux de partie.mjs
 * (lot 1 bis), recopiés sans changement de sens ; pas de prix, pas de dernière chance, pas de reprise (GE § 7).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, verrouiller, libelle } from '../../coach/plan-distance.mjs';
import { instancier } from '../../coach/plans-structures.mjs';
import { Noteur, structureCourante, jouable, avancer, borneCp } from '../../coach/coup-contraint.mjs';
import { Maia, probables, tirer, MAIA } from '../../coach/maia.mjs';
import { REGLES_MAIA, choisirCoupMaia, raisonAbandonMaia, progresse, valeurCoup } from '../../coach/coup-maia.mjs';
import { trouverDepart, fenDepart } from './departs.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEP = trouverDepart(opt('--depart', '')); if (!DEP) { console.error('--depart <id> inconnu'); process.exit(2); }
const BRAS = opt('--bras', 'GA'); if (!['GA', 'GAU', 'LL'].includes(BRAS)) { console.error('--bras GA|GAU|LL'); process.exit(2); }
const CAMP = BRAS === 'LL' ? null : opt('--camp', 'w'); if (CAMP && !['w', 'b'].includes(CAMP)) { console.error('--camp w|b'); process.exit(2); }
const DEPTH = Number(opt('--depth', 18)), PLIES = Number(opt('--plies', 200)), PARTIES = Number(opt('--parties', 25));
const NUMEROS = opt('--numeros', null)?.split(',').map(Number) ?? Array.from({ length: PARTIES }, (_, i) => i + 1);
const OUT = opt('--out', `reports/plans/maia/partie-${DEP.id}-${BRAS}${CAMP ? `-${CAMP}` : ''}`);
const R = BRAS === 'GAU' ? REGLES_MAIA.AU : REGLES_MAIA.A;
const ARRET = { cp: 600, plies: 10 }, FIN = { cp: 300 }; // § 5 (Expert)

const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const noteur = new Noteur(engine, { depth: DEPTH });
const maia = new Maia();
const fnv = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
const TENURE = (plan) => !['rupture', 'poussee'].includes(plan.famille);
const cleInstance = (inst) => inst.pourquoi ?? JSON.stringify(inst.plan);

/** Le coach d'un camp : guide (filtre les coups de l'élève) ou fantôme (suit les mêmes plans sans rien filtrer). */
function nouveauCoach(side, guide) {
  const co = { side, guide, plan: null, structure: null, nomStructure: null, utilises: new Set(), realise: false, dApresMoi: null, dernier: null, dissoute: false,
    cle: null, compteur: 0, cumul: 0, sansPas: 0, cumulDeborde: false, impayables: new Set(), sansPlanCumul: 0, seg: null, segments: [] };
  const etatNeuf = () => ({ compteur: 0, cumul: 0, sansPas: 0, cumulDeborde: false });
  co.fermer = (raison, ply, fen) => {
    if (!co.seg) return;
    Object.assign(co.seg, { plyAbandon: ply, raison, plies: ply - co.seg.plyAdoption, cumul: co.cumul, fenAbandon: fen });
    co.segments.push(co.seg); if (/^hors de prix|^faute/.test(raison)) co.impayables.add(co.cle);
    co.dernier = { plan: co.plan, raison }; co.seg = null; co.plan = null; co.realise = false; co.cle = null; Object.assign(co, etatNeuf());
  };
  co.adopter = (inst, origine, ply, fen) => {
    co.plan = inst.plan; co.realise = false; co.utilises.add(cleInstance(inst)); co.cle = cleInstance(inst); Object.assign(co, etatNeuf());
    co.seg = { plan: libelle(inst.plan, fen), pourquoi: inst.pourquoi ?? null, structure: co.nomStructure, origine, plyAdoption: ply, fenAdoption: fen, coups: 0, retards: 0, retardsNegatifs: 0, changes: 0, classes: {} };
  };
  co.planDeService = (fen) => {
    const d = co.dernier?.plan; if (!d || !['rupture', 'poussee', 'et'].includes(d.famille)) return null;
    const cibles = d.famille === 'et' ? d.plans.map((p) => p.cible).filter(Boolean) : [d.cible];
    const c = new Chess(fen), colonnes = new Set();
    for (const cible of cibles) for (const dx of [0, -1, 1]) { const f = String.fromCharCode(cible.charCodeAt(0) + dx); if (f >= 'a' && f <= 'h') colonnes.add(f); }
    for (const col of colonnes) {
      if ([...Array(8)].some((_, i) => { const p = c.get(`${col}${i + 1}`); return p && p.type === 'p' && p.color === side; })) continue;
      const plan = { famille: 'colonne', colonne: col };
      if (jouable(fen, side, plan)) return { plan, pourquoi: `plan de service : la colonne ${col} ouverte par ${libelle(d, fen)}` };
    }
    return null;
  };
  co.servis = (sc) => (fenAvant, m) => {
    const apres = new Chess(fenAvant); apres.move(m.san); const out = [];
    for (const i of instancier(fenAvant, side, sc.name, sc.color)) {
      const k = cleInstance(i); if (k === co.cle || co.impayables.has(k) || !jouable(fenAvant, side, i.plan)) continue;
      if (distance(apres.fen(), side, suivre(i.plan, m)).d < distance(fenAvant, side, i.plan).d) out.push(libelle(i.plan, fenAvant));
    }
    return out;
  };
  /** Avant le coup de ce camp : bascule, réalisation, sans objet, abandon, puis adoption (même précédence que partie.mjs). */
  co.avant = (fen, ply) => {
    const evts = [];
    const sc = structureCourante(fen, side), sig = sc ? `${sc.name}:${sc.color}:${sc.role}` : null;
    if (!sc) co.dissoute = Boolean(co.structure);
    if (sc && sig !== co.structure) {
      if (co.plan) { co.fermer('bascule', ply, fen); evts.push(`bascule → ${sc.name} (${sc.role})`); } else evts.push(`structure ${sc.name} (${sc.role})`);
      co.structure = sig; co.nomStructure = sc.name; co.utilises = new Set(); co.dissoute = false; co.impayables = new Set();
    } else if (sc && co.dissoute) { co.utilises = new Set(); co.dissoute = false; co.impayables = new Set(); evts.push(`structure ${sc.name} de retour`); }
    let enchaine = false;
    if (co.plan && co.realise) { co.fermer('réalisé', ply, fen); evts.push('réalisé'); enchaine = true; }
    else if (co.plan && !jouable(fen, side, co.plan)) { co.fermer('sans objet', ply, fen); evts.push('sans objet'); }
    else if (co.plan && raisonAbandonMaia(co, R)) { const r = raisonAbandonMaia(co, R); co.fermer(r, ply, fen); evts.push(r); }
    if (!co.plan && sc) {
      const cands = instancier(fen, side, sc.name, sc.color).filter((i) => !co.utilises.has(cleInstance(i)) && jouable(fen, side, i.plan));
      if (cands.length) { co.adopter(cands[0], enchaine ? 'enchaînement' : 'livre', ply, fen); evts.push(`adoption ${co.seg.plan}`); }
      else if (enchaine) { const s = co.planDeService(fen); if (s) { co.adopter(s, 'service', ply, fen); evts.push(`adoption ${co.seg.plan}`); } }
    } else if (!co.plan && enchaine) { const s = co.planDeService(fen); if (s) { co.adopter(s, 'service', ply, fen); evts.push(`adoption ${co.seg.plan}`); } }
    return { evts, sc };
  };
  /** Après un coup (de n'importe quel camp) : le plan suit ses pièces ; la réalisation se constate après la réponse adverse. */
  co.apres = (fen, m, deMoi) => {
    if (!co.plan) return;
    co.plan = suivre(co.plan, m); const d = distance(fen, side, co.plan).d;
    if (deMoi) { co.dApresMoi = d; return; }
    if (TENURE(co.plan) ? d === 0 : (co.dApresMoi === 0 || d === 0)) { co.plan = verrouiller(co.plan, fen, side); co.realise = true; }
  };
  return co;
}

async function partie(numero) {
  const t0 = Date.now();
  const graine = fnv(`${DEP.coups ?? DEP.fen}|${numero}`);
  const fen0 = fenDepart(DEP); const jeu = new Chess(fen0);
  const coachs = { w: nouveauCoach('w', CAMP === 'w'), b: nouveauCoach('b', CAMP === 'b') };
  const actifs = BRAS === 'LL' ? ['w', 'b'] : [CAMP]; // LL : un fantôme de chaque côté ; GA/GAU : le seul coach est le guide
  const journal = []; let ply = 0, resultat = null, serie = { camp: null, n: 0 }, masseTotale = 0, nMasse = 0;
  const appels0 = noteur.appels;

  while (true) {
    const fen = jeu.fen(), tour = jeu.turn();
    if (jeu.isGameOver()) break;
    // La note de la position (Stockfish, prof. de jeu, point de vue des Blancs) : point de non-retour et adjudication.
    const [best] = await noteur.noter(fen, 1); const evB = best ? borneCp(tour === 'w' ? best.cp : -best.cp) : 0;
    const mat = best && Math.abs(best.cp) >= 9000;
    const fort = evB >= ARRET.cp ? 'w' : evB <= -ARRET.cp ? 'b' : null;
    serie = fort && fort === serie.camp ? { camp: fort, n: serie.n + 1 } : { camp: fort, n: fort ? 1 : 0 };
    if (mat || serie.n >= ARRET.plies) { const g = mat ? ((best.cp > 0) === (tour === 'w') ? 'w' : 'b') : serie.camp; resultat = { type: mat ? 'adjugé (mat vu)' : `adjugé (+${ARRET.cp / 100} pendant ${ARRET.plies})`, gagnant: g, evalB: evB }; break; }
    if (ply >= PLIES) { resultat = { type: `${PLIES}e demi-coup`, gagnant: evB >= FIN.cp ? 'w' : evB <= -FIN.cp ? 'b' : null, evalB: evB }; break; }

    const pol = await maia.politique(fen); const pr = probables(pol);
    const coups = pr.coups.length ? pr.coups : pol.slice(0, 1); masseTotale += pr.masse; nMasse++;
    const co = coachs[tour], suivi = actifs.includes(tour);
    const entree = { ply, joueur: tour, evalB: evB, masse: Math.round(1000 * pr.masse) / 1000, nProbables: coups.length };
    let choix;
    if (suivi) {
      const { evts, sc } = co.avant(fen, ply); entree.evts = evts;
      if (co.plan && co.guide) {
        const r = await choisirCoupMaia(noteur, fen, tour, co.plan, coups, co, { regles: R, graine, sert: R.utile != null && sc ? co.servis(sc) : null });
        Object.assign(co, { compteur: r.compteur, cumul: r.cumul, sansPas: r.sansPas });
        if (r.refus) { co.cumulDeborde = true; evts.push(`refus ${r.refus.uci} (addition ${r.refus.cumul})`); }
        choix = { uci: r.uci, p: r.p }; Object.assign(entree, { classe: r.classe, retard: r.retard, change: r.change, naturel: r.naturel, ...(r.sert ? { sert: r.sert } : {}) });
        co.seg.coups++; co.seg.retards += Math.max(0, r.retard); if (r.retard < 0) co.seg.retardsNegatifs++; if (r.change) co.seg.changes++; co.seg.classes[r.classe] = (co.seg.classes[r.classe] ?? 0) + 1;
      } else if (co.plan) {
        // Le fantôme : l'élève joue son coup ; le coach compte comme il compterait (pas → 0, sinon + 1), sans rien filtrer.
        choix = tirer(coups, fen, graine); const m = new Chess(fen).move({ from: choix.uci.slice(0, 2), to: choix.uci.slice(2, 4), promotion: choix.uci[4] });
        const classe = new Chess(fen).inCheck() ? 'forcé' : progresse(fen, tour, co.plan, m) ? 'progressant' : 'intendance';
        Object.assign(co, avancer(co, classe, 0)); co.sansPas = classe === 'progressant' ? 0 : co.sansPas + 1;
        entree.classe = `fantôme ${classe}`; co.seg.coups++; co.seg.classes[classe] = (co.seg.classes[classe] ?? 0) + 1;
      } else if (co.guide && R.sansPlan && sc) {
        // L'attente utile sans plan (G-AU) : table épuisée, structure reconnue ; même borne contre le coup naturel, plafond par partie.
        choix = null;
        let vN = null;
        for (const c of coups) {
          const s = co.servis(sc)(fen, new Chess(fen).move({ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), promotion: c.uci[4] })); if (!s.length) continue;
          vN ??= await valeurCoup(noteur, fen, coups[0].uci);
          const retard = c.uci === coups[0].uci ? 0 : vN - await valeurCoup(noteur, fen, c.uci);
          if (retard > R.utile || co.sansPlanCumul + Math.max(0, retard) > R.plafondSansPlan) continue;
          co.sansPlanCumul += Math.max(0, retard); choix = c; Object.assign(entree, { classe: 'attente utile sans plan', retard, sert: s, change: c.uci !== tirer(coups, fen, graine).uci }); break;
        }
        if (!choix) { choix = tirer(coups, fen, graine); entree.classe = 'libre'; }
      } else { choix = tirer(coups, fen, graine); entree.classe = 'libre'; }
      entree.plan = co.seg?.plan ?? null;
    } else { choix = tirer(coups, fen, graine); entree.classe = 'libre'; }

    const m = jeu.move({ from: choix.uci.slice(0, 2), to: choix.uci.slice(2, 4), promotion: choix.uci[4] });
    Object.assign(entree, { san: m.san, p: choix.p }); journal.push(entree); ply++;
    for (const c of actifs) coachs[c].apres(jeu.fen(), m, c === tour);
  }
  if (!resultat) {
    const evB = journal.at(-1)?.evalB ?? 0;
    if (jeu.isCheckmate()) resultat = { type: 'mat', gagnant: jeu.turn() === 'w' ? 'b' : 'w', evalB: jeu.turn() === 'w' ? -1000 : 1000 };
    else {
      const type = jeu.isThreefoldRepetition() ? 'nulle (répétition)' : jeu.isInsufficientMaterial() ? 'nulle (matériel)' : jeu.isStalemate() ? 'pat' : 'nulle (50 coups)';
      // Nulle d'impuissance (Expert, § 5) : répétition ou 50 coups avec ≥ +3,00 au tableau.
      resultat = { type, gagnant: null, evalB: evB, impuissance: /répétition|50 coups/.test(type) && Math.abs(evB) >= FIN.cp ? (evB > 0 ? 'w' : 'b') : null };
    }
  }
  for (const c of actifs) if (coachs[c].seg) coachs[c].fermer('fin', ply, jeu.fen());
  const score = (camp) => (resultat.gagnant == null ? 0.5 : resultat.gagnant === camp ? 1 : 0);
  return { depart: DEP.id, bras: BRAS, camp: CAMP, numero, graine, sans: journal.map((e) => e.san), empreinte: fnv(journal.map((e) => e.san).join(' ')), plies: ply,
    resultat, scoreBlancs: score('w'), ...(CAMP ? { scoreEleve: score(CAMP) } : {}), masseMoyenne: nMasse ? masseTotale / nMasse : null,
    segments: Object.fromEntries(actifs.map((c) => [c, coachs[c].segments.map((s) => ({ ...s, fenAdoption: undefined, fenAbandon: undefined, fens: { adoption: s.fenAdoption, abandon: s.fenAbandon } }))])),
    journal, appels: noteur.appels - appels0, secondes: Math.round((Date.now() - t0) / 1000), maia: { lc0: MAIA.empreinteLc0, poids: MAIA.empreintePoids } };
}

const parties = [];
for (const n of NUMEROS) {
  console.error(`${DEP.id} ${BRAS}${CAMP ? ` ${CAMP}` : ''} : partie ${n}…`);
  const p = await partie(n); parties.push(p);
  console.error(`  ${p.plies} demi-coups, ${p.resultat.type}, gagnant ${p.resultat.gagnant ?? '—'}, ${p.appels} notations, ${p.secondes} s`);
}
engine.stop(); maia.stop();
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/parties.json`, JSON.stringify(parties, null, 1));
console.error(`écrit : ${OUT}/parties.json`);
