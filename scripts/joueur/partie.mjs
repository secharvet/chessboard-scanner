#!/usr/bin/env node
/**
 * L'arène du coach joueur (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 3, « qui fait quoi »).
 *
 *   node scripts/joueur/partie.mjs --adversaire maia|sf1500|sf --camp w|b --graine N [--budget 400000]
 *                                  [--joueur coach/joueur/joueur.mjs (défaut) | coach/joueur/joueur-factice.mjs] [--sortie parties/] [--depart <fen>] [--code <sha>]
 *
 * Le COACH (classe `Joueur`, `choisir(fen, contexte)`) joue TOUS ses coups ; l'arène ne lui donne jamais un moteur ni une
 * évaluation (principe 2 du GE : Stockfish est examinateur après coup, jamais proposant). L'adversaire est Maia-1500
 * (politique à 1 nœud ; il tire dans sa politique avec la graine pendant ses 8 premiers coups, puis joue son coup préféré)
 * ou Stockfish bridé (`sf1500` : UCI_LimitStrength + UCI_Elo 1500), ou Stockfish 19 à pleine force (`sf` : prof. 12, un fil).
 * En mode maia, aucun moteur Stockfish n'est lancé.
 *
 * L'échiquier qui fait foi (règles, fin de partie) est `coach/joueur/echiquier.mjs` (perft) ; chess.js sert seulement à la
 * notation SAN des coups adverses et au PGN. On écrit `parties/<id>.json` au contrat, un `.pgn` à côté (phrases en
 * commentaires), et on tient `parties/index.json` à jour.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { Chess } from 'chess.js';
import { toFrenchSan } from '../../coach/notation.mjs';
import { Echiquier, DEPART } from '../../coach/joueur/echiquier.mjs';

/** Les deux premiers champs d'une FEN (placement + trait) : ce qui doit coïncider entre l'échiquier et chess.js (l'en passant et les compteurs divergent légitimement). */
const noyauFen = (fen) => fen.split(' ').slice(0, 2).join(' ');

/**
 * lc0 encode le roque « roi prend sa tour » (e1h1, e8a8…) ; l'échiquier et chess.js attendent le roque standard « roi de
 * deux cases » (e1g1, e8c8). On réécrit ces quatre cas, et seulement si le roi est bien sur sa case de départ.
 */
const ROQUE_LC0 = { e1h1: 'e1g1', e1a1: 'e1c1', e8h8: 'e8g8', e8a8: 'e8c8' };
function normaliserUci(uci, chess) {
  if (ROQUE_LC0[uci] && chess.get(uci.slice(0, 2))?.type === 'k') return ROQUE_LC0[uci];
  return uci;
}

/**
 * Joue une partie entière. Joueurs INJECTÉS (le CLI câble le vrai Maia / UciEngine ; les tests passent des bouchons, hors
 * ligne). Le `coach` expose `choisir(fen, contexte)` ; l'`adversaire` expose `jouer(fen) → uci` et `meta`.
 * @returns l'enregistrement de partie du contrat (page 3).
 */
export async function jouerPartie({ coach, adversaire, camp, id = 'sans-id', fenDepart = DEPART, budget = 400000, code = 'factice', maxPlies = 400, onCoup = null }) {
  const ech = new Echiquier(fenDepart);
  const chess = new Chess(fenDepart); // miroir de notation ; jamais la source de la légalité
  const coups = [];
  const historique = []; // coups UCI joués depuis le départ, des deux camps (le coach reconstruit son échiquier avec)
  let ply = 0;

  const appliquer = (uciBrut) => {
    const uci = normaliserUci(uciBrut, chess);
    const m = ech.coupDepuisUci(uci);
    if (m == null) throw new Error(`coup illégal pour l'échiquier : ${uci} (${ech.fen()})`);
    ech.jouer(m);
    const cm = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined });
    if (!cm) throw new Error(`coup refusé par chess.js : ${uci} (${chess.fen()})`);
    if (noyauFen(ech.fen()) !== noyauFen(chess.fen())) throw new Error(`désynchronisation échiquier/chess.js après ${uci}`);
    return cm;
  };

  let fin = ech.fin();
  while (!fin && ply < maxPlies) {
    const fen = ech.fen();
    const trait = ech.trait === 0 ? 'w' : 'b';
    if (trait === camp) {
      const t0 = performance.now();
      const r = await coach.choisir(fen, { camp, ply: ply + 1, depart: fenDepart, historique: [...historique] });
      const ms = Math.round(performance.now() - t0);
      if (!r) throw new Error(`le coach n'a rien joué alors que la partie n'est pas finie (${fen})`);
      appliquer(r.uci);
      coups.push({ ...r, ply: ply + 1, camp: trait, san: r.san, uci: r.uci, fenAvant: fen, coach: true, ms });
      historique.push(r.uci);
    } else {
      const cm = appliquer(await adversaire.jouer(fen));
      const uci = cm.from + cm.to + (cm.promotion ?? ''); // UCI standard, reconstruit depuis le coup appliqué (roque normalisé)
      // SAN de l'adversaire en français comme celui du coach (toFrenchSan n'est PAS idempotent — ne l'appliquer qu'au SAN anglais de chess.js).
      coups.push({ ply: ply + 1, camp: trait, san: toFrenchSan(cm.san), uci, fenAvant: fen, coach: false });
      historique.push(uci);
    }
    if (onCoup) await onCoup(coups[coups.length - 1]); // flux en direct : un coup émis dès qu'il est joué
    ply++;
    fin = ech.fin();
  }

  return {
    version: 1,
    id,
    depart: fenDepart,
    coach: { camp, budget, code },
    adversaire: adversaire.meta,
    coups,
    resultat: fin ? fin.resultat : '*',
    raison: fin ? fin.raison : `non finie (plafond ${maxPlies} demi-coups)`,
    plies: ply,
    examen: null,
  };
}

/* ------------------------------------------------------------------ adversaires ------------------------------------------------------------------ */

/**
 * Construit l'adversaire. Classes injectables (`MaiaClass`, `EngineClass`) pour les tests hors ligne : en mode `maia`,
 * `EngineClass` n'est JAMAIS appelée (aucun moteur Stockfish lancé) ; en mode `sf1500`, `MaiaClass` ne l'est pas.
 */
export async function construireAdversaire(type, { graine = 1, depth = 12, elo = 1500, MaiaClass, EngineClass, maiaOpts = {}, engineOpts = {} } = {}) {
  if (type === 'maia') {
    const mod = MaiaClass ?? (await import('../../coach/maia.mjs')); // injectable pour les tests hors ligne
    const maia = new mod.Maia(maiaOpts);
    const tireur = mod.tirer;
    let coup = 0;
    return {
      nom: 'maia-1500',
      meta: { nom: 'maia-1500', graine, tirage: '8 premiers coups' },
      async jouer(fen) {
        const pol = await maia.politique(fen);
        coup++;
        const c = coup <= 8 ? tireur(pol, fen, graine) : pol[0]; // préféré = la plus haute probabilité (politique triée)
        return c.uci;
      },
      async stop() { maia.stop?.(); },
    };
  }
  if (type === 'sf1500') {
    const mod = EngineClass ?? (await import('../../coach/uci-engine.mjs'));
    const engine = new mod.UciEngine({ ...engineOpts, options: { UCI_LimitStrength: true, UCI_Elo: elo } });
    void graine;
    return {
      nom: `sf${elo}`,
      meta: { nom: `stockfish-${elo}`, elo, profondeur: depth },
      async jouer(fen) {
        const [ligne] = await engine.analyze(fen, { depth, multipv: 1 });
        if (!ligne?.pv?.[0]) throw new Error(`l'adversaire bridé n'a rendu aucun coup (${fen})`);
        return ligne.pv[0];
      },
      async stop() { engine.stop?.(); },
    };
  }
  if (type === 'sf') {
    // Stockfish 19 à PLEINE force (Sébastien veut voir le coach se faire ramasser) : un fil, aucune option de bride, profondeur fixe 12.
    const mod = EngineClass ?? (await import('../../coach/uci-engine.mjs'));
    const engine = new mod.UciEngine({ ...engineOpts, threads: 1 });
    void graine;
    return {
      nom: 'sf',
      meta: { nom: 'stockfish-19', profondeur: depth, bride: false },
      async jouer(fen) {
        const [ligne] = await engine.analyze(fen, { depth, multipv: 1 });
        if (!ligne?.pv?.[0]) throw new Error(`l'adversaire Stockfish n'a rendu aucun coup (${fen})`);
        return ligne.pv[0];
      },
      async stop() { engine.stop?.(); },
    };
  }
  throw new Error(`adversaire inconnu : ${type} (maia|sf1500|sf)`);
}

/* ------------------------------------------------------------------ PGN ------------------------------------------------------------------ */

/** Le PGN d'une partie, les phrases du coach en commentaires. */
export function pgn(partie) {
  const blanc = partie.coach.camp === 'w' ? `coach-joueur` : partie.adversaire.nom;
  const noir = partie.coach.camp === 'b' ? `coach-joueur` : partie.adversaire.nom;
  const entetes = [
    ['Event', 'Coach joueur — V0'], ['Site', 'chess-dev'], ['Date', partie.id.slice(0, 10).replace(/-/g, '.')],
    ['Round', partie.adversaire.graine != null ? String(partie.adversaire.graine) : '-'], ['White', blanc], ['Black', noir],
    ['Result', partie.resultat],
  ];
  if (partie.depart !== DEPART) { entetes.push(['SetUp', '1'], ['FEN', partie.depart]); }
  const lignes = entetes.map(([k, v]) => `[${k} "${v}"]`);
  lignes.push('');
  let texte = '';
  for (const c of partie.coups) {
    const numero = c.camp === 'w' ? `${Math.floor((c.ply - 1) / 2) + 1}. ` : (c.ply === partie.coups[0].ply ? `${Math.floor((c.ply - 1) / 2) + 1}... ` : '');
    texte += `${numero}${c.san} `;
    if (c.coach && c.phrase) texte += `{ ${c.phrase.replace(/[{}]/g, '')} } `;
  }
  texte += partie.resultat;
  // retour à la ligne doux tous ~100 caractères pour la lisibilité
  lignes.push(texte.replace(/(.{80,}?) /g, '$1\n'));
  return lignes.join('\n') + '\n';
}

/* ------------------------------------------------------------------ index ------------------------------------------------------------------ */

/** Met `index.json` à jour (upsert par id, plus récent d'abord). */
export function majIndex(dossier, entree) {
  const chemin = `${dossier}/index.json`;
  let liste = [];
  if (existsSync(chemin)) { try { liste = JSON.parse(readFileSync(chemin, 'utf8')); } catch { liste = []; } }
  liste = liste.filter((e) => e.id !== entree.id);
  liste.push(entree);
  liste.sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  writeFileSync(chemin, JSON.stringify(liste, null, 1));
  return liste;
}

/* ------------------------------------------------------------------ CLI ------------------------------------------------------------------ */

/** Identifiant horodaté pour une partie à la demande : <date>T<hhmmss>-<adversaire>-<camp> (aucune collision). */
export const horodate = (nomAdversaire, camp, d = new Date()) => `${d.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', 'T')}-${nomAdversaire}-${camp}`;

async function main() {
  const args = process.argv.slice(2);
  const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
  const TYPE = opt('--adversaire', 'maia'); if (!['maia', 'sf1500', 'sf'].includes(TYPE)) { console.error('--adversaire maia|sf1500|sf'); process.exit(2); }
  const CAMP = opt('--camp', 'w'); if (!['w', 'b'].includes(CAMP)) { console.error('--camp w|b'); process.exit(2); }
  const GRAINE = Number(opt('--graine', 1));
  const BUDGET = Number(opt('--budget', 400000));
  const DEPTH = Number(opt('--depth', 12));
  const ELO = Number(opt('--elo', 1500));
  const SORTIE = opt('--sortie', 'parties');
  const DEP = opt('--depart', DEPART);
  const FLUX = args.includes('--flux'); // une ligne JSON par coup sur stdout, puis l'examen, puis la fin
  // Par défaut le VRAI coach : le factice ne sert qu'aux tests et se demande explicitement (une partie « factice » contre
  // Stockfish a été prise pour une vraie le 24 octobre ; plus jamais).
  const MODULE = opt('--joueur', '../../coach/joueur/joueur.mjs');

  const { Joueur } = await import(MODULE.startsWith('.') || MODULE.startsWith('/') ? MODULE : `../../${MODULE}`);
  const coach = new Joueur({ camp: CAMP, budget: BUDGET, graine: GRAINE });
  // Le code qui a produit la partie : --code s'il est donné (la série fige sa version), sinon le commit courant (git).
  let code = opt('--code', null);
  if (!code) { try { code = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { code = coach.code ?? 'inconnu'; } }
  const adversaire = await construireAdversaire(TYPE, { graine: GRAINE, depth: DEPTH, elo: ELO });

  const date = new Date().toISOString().slice(0, 10);
  const id = opt('--id', null) ?? (FLUX ? horodate(adversaire.meta.nom, CAMP) : `${date}-${TYPE}-${CAMP}-${String(GRAINE).padStart(2, '0')}`);
  // En flux, stdout ne porte QUE des lignes JSON d'événement (le relais SSE les lit) ; tout le reste va sur stderr.
  const emet = FLUX ? (o) => process.stdout.write(`${JSON.stringify(o)}\n`) : null;

  console.error(`arène : ${id} — coach ${CAMP} contre ${adversaire.meta.nom} (budget ${BUDGET})…`);
  if (FLUX) emet({ ev: 'debut', id, adversaire: adversaire.meta, camp: CAMP, budget: BUDGET, depart: DEP, code });
  const partie = await jouerPartie({ coach, adversaire, camp: CAMP, id, fenDepart: DEP, budget: BUDGET, code, onCoup: FLUX ? (c) => emet({ ev: 'coup', coup: c }) : null });
  await adversaire.stop?.();

  // L'examen, dans le même processus (indispensable en flux : le serveur n'en lance pas d'autre).
  if (FLUX) {
    try {
      process.env.COACH_DETERMINISTIC = '1';
      const { UciEngine } = await import('../../coach/uci-engine.mjs');
      const { examiner } = await import('./examiner.mjs');
      const moteur = new UciEngine({ path: process.env.STOCKFISH_PATH ?? '/usr/local/bin/stockfish', threads: 1 });
      await moteur.start();
      await examiner(moteur, partie);
      moteur.stop();
      emet({ ev: 'examen', examen: partie.examen });
    } catch (e) { emet({ ev: 'examen', examen: null, erreur: String(e?.message ?? e) }); }
  }

  mkdirSync(SORTIE, { recursive: true });
  writeFileSync(`${SORTIE}/${id}.json`, JSON.stringify(partie, null, 1));
  writeFileSync(`${SORTIE}/${id}.pgn`, pgn(partie));
  majIndex(SORTIE, { id, adversaire: adversaire.meta.nom, camp: CAMP, resultat: partie.resultat, raison: partie.raison, plies: partie.plies, date });
  if (FLUX) emet({ ev: 'fin', id, resultat: partie.resultat, raison: partie.raison, plies: partie.plies });
  console.error(`  ${partie.plies} demi-coups, ${partie.resultat} (${partie.raison}) — écrit ${SORTIE}/${id}.{json,pgn}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
