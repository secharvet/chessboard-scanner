#!/usr/bin/env node
/**
 * EXTRACTION des positions humaines pour la table (CHANTIER-TABLE-2026-10-25, section 2). Aucun moteur.
 *
 * Lit un fichier PGN Lichess (base mensuelle), garde les parties classées, cadence rapide ou lente (durée estimée
 * base + 40 × incrément ≥ 480 s, règle de Lichess), terminées normalement ou au temps, sans variante, dont LES DEUX joueurs
 * sont dans la même tranche de 200 points entre 1000 et 2200. Découpe les joueurs apprentissage / test par un tirage fixe
 * sur le nom (20 % test) ; une partie est « apprentissage » si ses deux joueurs le sont, « test » si ses deux joueurs le
 * sont, écartée sinon. Tire au plus N positions par partie (8 par défaut), réparties sur les phases. Écrit une ligne JSON
 * par position dans <sortie>/<lot>-<tranche>.jsonl, les parties dans un ordre tiré au sort (un préfixe du fichier est
 * donc un échantillon). Les fichiers « test-* » sont écrits et jamais lus par ce chantier.
 *
 *   node scripts/joueur/extraire-humains.mjs data/lichess/2016-01-filtre.pgn --sortie data/humains-2016-01 [--par-partie 8] [--graine 20261025]
 */
import { createReadStream, mkdirSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';
import { Chess } from 'chess.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const fichiers = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const SORTIE = opt('--sortie', 'data/humains');
const PAR_PARTIE = Number(opt('--par-partie', 8));
const GRAINE = String(opt('--graine', '20261025'));
const PART_TEST = 0.2;
if (!fichiers.length) { console.error('usage : node scripts/joueur/extraire-humains.mjs <fichier.pgn> [--sortie dossier] [--par-partie 8] [--graine n]'); process.exit(2); }

const TRANCHES = [1000, 1200, 1400, 1600, 1800, 2000];
const tranche = (elo) => (elo >= 1000 && elo < 2200 ? 1000 + 200 * Math.floor((elo - 1000) / 200) : null);
const h32 = (s) => parseInt(createHash('sha1').update(GRAINE + '|' + s).digest('hex').slice(0, 8), 16);
const estTest = (joueur) => (h32('joueur:' + joueur) % 1000) < PART_TEST * 1000;
function alea(graine) { let a = graine >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function melange(tab, rnd) { for (let i = tab.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [tab[i], tab[j]] = [tab[j], tab[i]]; } return tab; }

function phaseDe(fen) {
  const pieces = fen.split(' ')[0].replace(/[^a-zA-Z]/g, '').replace(/[kK]/g, '');
  const lourdes = (pieces.match(/[qrQR]/g) ?? []).length, mineures = (pieces.match(/[nbNB]/g) ?? []).length;
  const n = Number(fen.split(' ')[5] ?? 1);
  if (n <= 10) return 'ouverture';
  if (lourdes + mineures <= 6) return 'finale';
  return 'milieu';
}

/** Le texte des coups d'une partie Lichess → la liste des SAN (commentaires, NAG, numéros et résultat retirés). */
function sansDe(texte) {
  const sans = [];
  for (const tok of texte.replace(/\{[^}]*\}/g, ' ').replace(/\([^)]*\)/g, ' ').split(/\s+/)) {
    if (!tok || /^\d+\.+$/.test(tok) || /^\$\d+$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
    sans.push(tok.replace(/[?!]+$/, ''));
  }
  return sans;
}

const compte = { lues: 0, gardees: 0, ecartees: { cadence: 0, classement: 0, variante: 0, fin: 0, mixte: 0, courte: 0, illegale: 0 }, parLot: {} };
const lignes = {}; // `${lot}-${tranche}` → [{ cle, ligne }]

function traiter(entetes, texte) {
  compte.lues++;
  if (entetes.Variant && entetes.Variant !== 'Standard') { compte.ecartees.variante++; return; }
  if (entetes.FEN) { compte.ecartees.variante++; return; }
  if (!/Rated/i.test(entetes.Event ?? '')) { compte.ecartees.classement++; return; }
  const [base, inc] = String(entetes.TimeControl ?? '-').split('+').map(Number);
  if (!(base + 40 * (inc || 0) >= 480)) { compte.ecartees.cadence++; return; }
  if (!/Normal|Time forfeit/.test(entetes.Termination ?? '')) { compte.ecartees.fin++; return; }
  const w = Number(entetes.WhiteElo), b = Number(entetes.BlackElo), tw = tranche(w), tb = tranche(b);
  if (tw == null || tb == null || tw !== tb) { compte.ecartees.classement++; return; }
  const tW = estTest(entetes.White ?? ''), tB = estTest(entetes.Black ?? '');
  if (tW !== tB) { compte.ecartees.mixte++; return; }
  const lot = tW ? 'test' : 'apprentissage';
  const sans = sansDe(texte);
  if (sans.length < 16) { compte.ecartees.courte++; return; }
  const id = (entetes.Site ?? '').split('/').pop() || `${compte.lues}`;
  const chess = new Chess();
  const positions = [];
  for (let i = 0; i < sans.length; i++) {
    const fen = chess.fen();
    let m; try { m = chess.move(sans[i]); } catch { m = null; }
    if (!m) { compte.ecartees.illegale++; return; }
    positions.push({ ply: i + 1, camp: m.color, fen, uci: m.from + m.to + (m.promotion ?? ''), san: m.san, phase: phaseDe(fen) });
  }
  // tirage : au plus PAR_PARTIE positions, réparties sur les phases présentes (tour par tour)
  const rnd = alea(h32('partie:' + id));
  const parPhase = { ouverture: [], milieu: [], finale: [] };
  for (const p of positions) parPhase[p.phase].push(p);
  for (const k of Object.keys(parPhase)) melange(parPhase[k], rnd);
  const choisies = [];
  for (let tour = 0; choisies.length < PAR_PARTIE; tour++) {
    let ajoute = false;
    for (const k of ['ouverture', 'milieu', 'finale']) { const p = parPhase[k][tour]; if (p && choisies.length < PAR_PARTIE) { choisies.push(p); ajoute = true; } }
    if (!ajoute) break;
  }
  choisies.sort((a, b) => a.ply - b.ply);
  compte.gardees++;
  const cle = `${lot}-${tw}`;
  compte.parLot[cle] = compte.parLot[cle] ?? { parties: 0, positions: 0 };
  compte.parLot[cle].parties++; compte.parLot[cle].positions += choisies.length;
  const ordre = h32('ordre:' + id); // l'ordre d'écriture des parties est tiré au sort : un préfixe du fichier est un échantillon
  (lignes[cle] = lignes[cle] ?? []).push({ ordre, texte: choisies.map((p) => JSON.stringify({ partie: id, ply: p.ply, tranche: tw, camp: p.camp, fen: p.fen, uci: p.uci, san: p.san, phase: p.phase, eloW: w, eloB: b, cadence: entetes.TimeControl, mois: entetes.UTCDate?.slice(0, 7) })).join('\n') });
}

async function main() {
  mkdirSync(SORTIE, { recursive: true });
  const t0 = Date.now();
  for (const f of fichiers) {
    let entetes = {}, texte = '', dansTexte = false;
    for await (const line of createInterface({ input: createReadStream(f), crlfDelay: Infinity })) {
      if (line.startsWith('[')) {
        if (dansTexte) { traiter(entetes, texte); entetes = {}; texte = ''; dansTexte = false; }
        const m = /^\[(\w+)\s+"(.*)"\]$/.exec(line); if (m) entetes[m[1]] = m[2];
      } else if (line.trim()) { texte += ' ' + line; dansTexte = true; }
      if (compte.lues % 20000 === 0 && compte.lues && line.startsWith('[Event')) process.stderr.write(`· ${compte.lues} parties lues, ${compte.gardees} gardées, ${Math.round((Date.now() - t0) / 1000)} s\n`);
    }
    if (dansTexte) traiter(entetes, texte);
  }
  for (const [cle, liste] of Object.entries(lignes)) {
    liste.sort((a, b) => a.ordre - b.ordre);
    writeFileSync(`${SORTIE}/${cle}.jsonl`, liste.map((l) => l.texte).join('\n') + '\n');
  }
  const bilan = { fichiers, graine: GRAINE, parPartie: PAR_PARTIE, ...compte };
  writeFileSync(`${SORTIE}/extraction.json`, JSON.stringify(bilan, null, 1));
  console.log(`\n=== EXTRACTION — ${compte.lues} parties lues, ${compte.gardees} gardées (${Math.round((Date.now() - t0) / 1000)} s) ===`);
  console.log('écartées :', JSON.stringify(compte.ecartees));
  console.log('\n| tranche | apprentissage : parties / positions | test : parties / positions |');
  for (const t of TRANCHES) { const a = compte.parLot[`apprentissage-${t}`] ?? { parties: 0, positions: 0 }, te = compte.parLot[`test-${t}`] ?? { parties: 0, positions: 0 }; console.log(`| ${t}-${t + 199} | ${a.parties} / ${a.positions} | ${te.parties} / ${te.positions} |`); }
  console.log(`\nfichiers dans ${SORTIE}/ ; bilan : ${SORTIE}/extraction.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
