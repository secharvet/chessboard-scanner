/**
 * Générateur d'étiquettes « quel concept est le plan ? » (docs/PLANS-ET-CONCEPTS.md, §4).
 *
 * Pour des positions de milieu de partie tirées de vraies parties : Stockfish donne ses 3 meilleures
 * suites ; le moteur de règles relève, le long de chaque suite et pour chaque camp, à quel demi-coup
 * chaque concept APPARAÎT (absent au départ, présent à ce demi-coup ET encore présent en fin de suite).
 * On enregistre les données brutes (demi-coup d'apparition par suite, écarts d'évaluation) : les règles
 * d'étiquetage (contraste, seuils) se décident à l'entraînement, sans tout recalculer.
 *
 *   node scripts/label-positions.mjs data/lichess/2013-01.pgn [--out data/labels/2013-01.jsonl]
 *        [--workers 3] [--depth 12] [--plies 16] [--every 6] [--max 100000]
 *
 * Reprise automatique : les parties déjà traitées (index dans le fichier de sortie) sont sautées.
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { UciEngine } from '../coach/uci-engine.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PGN = args[0];
const OUT = opt('--out', `data/labels/${PGN.split('/').pop().replace(/\.pgn$/, '')}.jsonl`);
const WORKERS = Number(opt('--workers', 3));
const DEPTH = Number(opt('--depth', 12));
const PLIES = Number(opt('--plies', 24));
const EVERY = Number(opt('--every', 6));
const MAX = Number(opt('--max', 100000));

// ── Concepts (états buts vérifiables, par camp) ──
// Chaque détecteur reçoit les faits d'une position et renvoie les couleurs pour lesquelles le concept est vrai.
const has = (facts, id, color) => facts.some((t) => t.id === id && t.params.color === color);
const WEAK_PAWN = new Set(['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE']);
const CONCEPTS = {
  tour_colonne: (facts, color) => has(facts, 'TOUR_COLONNE_OUVERTE', color),
  cavalier_avant_poste: (facts, color) => has(facts, 'CAVALIER_AVANT_POSTE', color),
  // Blocage : un cavalier ou un fou installé juste devant un pion adverse isolé, arriéré, faible ou passé.
  blocage: (facts, color, board) => facts.some((t) => {
    if (!WEAK_PAWN.has(t.id) || t.params.color === color || typeof t.params.square !== 'string') return false;
    const sq = t.params.square;
    const front = `${sq[0]}${Number(sq[1]) + (t.params.color === 'w' ? 1 : -1)}`;
    const p = board.get(front);
    return Boolean(p && p.color === color && (p.type === 'n' || p.type === 'b'));
  }),
};
const COLORS = ['w', 'b'];

/** Colonnes ouvertes ou semi-ouvertes POUR `color`. */
const openFiles = (facts, color) => new Set(facts
  .filter((t) => t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === color))
  .map((t) => String(t.params.file)));

/**
 * Déroule une suite et renvoie, pour chaque concept et chaque camp, le demi-coup d'apparition (ou -1).
 * Rupture de pions : un coup de pion du camp qui attaque ou prend un pion adverse (levier), suivi dans
 * la suite d'une nouvelle colonne ouverte ou semi-ouverte pour ce camp, encore présente à la fin.
 */
function scanLine(fen, pv) {
  const c = new Chess(fen);
  const start = { facts: buildAllFacts(fen), board: new Chess(fen) };
  const timeline = [];
  const levers = { w: [], b: [] };
  for (const [i, u] of pv.slice(0, PLIES).entries()) {
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    if (m.piece === 'p') {
      const dir = m.color === 'w' ? 1 : -1;
      const f = m.to.charCodeAt(0);
      const attacks = [-1, 1].some((d) => {
        const p = c.get(`${String.fromCharCode(f + d)}${Number(m.to[1]) + dir}`);
        return p && p.type === 'p' && p.color !== m.color;
      });
      if (attacks || m.captured === 'p') levers[m.color].push(i);
    }
    timeline.push({ facts: buildAllFacts(c.fen()), board: new Chess(c.fen()) });
  }
  const out = {};
  if (!timeline.length) return out;
  const end = timeline.at(-1);
  for (const [name, test] of Object.entries(CONCEPTS)) {
    for (const color of COLORS) {
      let ply = -1;
      const ok = (snap) => test(snap.facts, color, snap.board);
      if (!ok(start) && ok(end)) ply = timeline.findIndex(ok);
      out[`${name}_${color}`] = ply;
    }
  }
  for (const color of COLORS) {
    const before = openFiles(start.facts, color);
    const after = openFiles(end.facts, color);
    const fresh = [...after].filter((f) => !before.has(f));
    let ply = -1;
    if (fresh.length && levers[color].length) {
      const opened = timeline.findIndex((snap) => [...openFiles(snap.facts, color)].some((x) => fresh.includes(x)));
      // La rupture doit TRANSFORMER la position, pas liquider une tension : une tour du camp occupe la
      // colonne ouverte à la fin, ou la structure change (faiblesse adverse ou pion passé nouveaux).
      const opp = color === 'w' ? 'b' : 'w';
      const rookUses = end.board.board().flat().some((p) => p && p.type === 'r' && p.color === color && fresh.includes(p.square[0]));
      const key = (t) => `${t.id}|${t.params.color}|${String(t.params.square ?? '')[0]}`;
      const had = new Set(start.facts.map(key));
      const structural = end.facts.some((t) => !had.has(key(t))
        && ((['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE'].includes(t.id) && t.params.color === opp)
          || (t.id === 'PION_PASSE' && t.params.color === color)));
      if (levers[color][0] <= opened && (rookUses || structural)) ply = opened;
    }
    out[`rupture_${color}`] = ply;
  }
  return out;
}

// ── Lecture des parties ──
async function* games(path) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  let headers = {};
  let moves = [];
  let index = 0;
  for await (const line of rl) {
    if (line.startsWith('[')) {
      if (moves.length) { yield { index: index++, headers, moves: moves.join(' ') }; headers = {}; moves = []; }
      const m = line.match(/^\[(\w+) "(.*)"\]$/);
      if (m) headers[m[1]] = m[2];
    } else if (line.trim()) moves.push(line.trim());
  }
  if (moves.length) yield { index: index++, headers, moves: moves.join(' ') };
}

/** Positions de milieu de partie : un échantillon tous les EVERY demi-coups, du 16e au 60e. */
function positions(game) {
  const c = new Chess();
  const sans = game.moves.replace(/\{[^}]*\}/g, '').replace(/\d+\.(\.\.)?/g, ' ')
    .split(/\s+/).filter((t) => t && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
  const out = [];
  for (const [i, san] of sans.entries()) {
    try { c.move(san); } catch { break; }
    const ply = i + 1;
    if (ply >= 16 && ply <= 60 && ply % EVERY === 0 && !c.inCheck() && !c.isGameOver()) out.push({ ply, fen: c.fen() });
  }
  return out;
}

// ── Boucle principale ──
mkdirSync(OUT.replace(/\/[^/]*$/, ''), { recursive: true });
const done = new Set();
if (existsSync(OUT)) for (const l of readFileSync(OUT, 'utf8').split('\n')) if (l) done.add(JSON.parse(l).game);
console.error(`${done.size} parties déjà traitées — sortie ${OUT}, ${WORKERS} moteurs, profondeur ${DEPTH}`);

const engines = Array.from({ length: WORKERS }, () => new UciEngine({ threads: 1 }));
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
let written = 0;
let processed = 0;
const t0 = Date.now();

async function labelGame(engine, game) {
  const elo = Math.round((Number(game.headers.WhiteElo) + Number(game.headers.BlackElo)) / 2) || null;
  for (const pos of positions(game)) {
    const lines = await engine.analyze(pos.fen, { depth: DEPTH, multipv: 3 });
    if (!lines.length) continue;
    const best = toCp(lines[0].score);
    if (Math.abs(best) > 400) continue; // position déjà décidée : pas de plan à apprendre
    const rec = {
      game: game.index, ply: pos.ply, fen: pos.fen, elo,
      evals: lines.map((l) => toCp(l.score)),
      lines: lines.map((l) => scanLine(pos.fen, l.pv)),
    };
    appendFileSync(OUT, `${JSON.stringify(rec)}\n`);
    written++;
  }
}

let exhausted = false;
const source = games(PGN);
async function next() {
  while (!exhausted) {
    const r = await source.next();
    if (r.done) { exhausted = true; return null; }
    if (done.has(r.value.index)) continue;
    return r.value;
  }
  return null;
}
let pulling = Promise.resolve();
const take = () => (pulling = pulling.then(next));

await Promise.all(engines.map(async (engine) => {
  for (;;) {
    if (written >= MAX) return;
    const game = await take();
    if (!game) return;
    await labelGame(engine, game).catch((e) => console.error(`partie ${game.index} : ${e.message}`));
    processed++;
    if (processed % 50 === 0) {
      const rate = written / ((Date.now() - t0) / 3600000);
      console.error(`${processed} parties, ${written} positions (${Math.round(rate)} positions/h)`);
    }
  }
}));
for (const e of engines) e.stop();
console.error(`Terminé : ${written} positions en ${((Date.now() - t0) / 3600000).toFixed(1)} h`);
