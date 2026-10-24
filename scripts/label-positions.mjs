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
 *        [--workers 3] [--depth 12] [--plies 48] [--every 6] [--max 100000]
 *
 * Les suites sont PROLONGÉES jusqu'à --plies demi-coups (Stockfish relancé depuis leur dernière position,
 * coach/extend-line.mjs) : à profondeur 16, une suite s'arrête d'elle-même vers 17 demi-coups.
 *
 * Reprise automatique : les parties déjà traitées sont sautées (index dans le fichier de sortie, plus le fichier
 * `<sortie>.done` qui note aussi les parties sans position retenue : sans lui, chaque redémarrage les réanalysait).
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { UciEngine } from '../coach/uci-engine.mjs';
import { scanLine } from '../coach/plan-concepts.mjs';
import { extendPv } from '../coach/extend-line.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PGN = args[0];
const OUT = opt('--out', `data/labels/${PGN.split('/').pop().replace(/\.pgn$/, '')}.jsonl`);
const WORKERS = Number(opt('--workers', 3));
const DEPTH = Number(opt('--depth', 12));
const PLIES = Number(opt('--plies', 48));
const EVERY = Number(opt('--every', 6));
const MAX = Number(opt('--max', 100000));

// Concepts et apparition le long d'une suite : coach/plan-concepts.mjs

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
const DONE = `${OUT}.done`;
if (existsSync(DONE)) for (const l of readFileSync(DONE, 'utf8').split('\n')) if (l) done.add(Number(l));
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
    const pvs = [];
    for (const l of lines) pvs.push(await extendPv(engine, pos.fen, l.pv, { plies: PLIES, depth: DEPTH }));
    const rec = {
      game: game.index, ply: pos.ply, fen: pos.fen, elo,
      engine: engine.name,
      evals: lines.map((l) => toCp(l.score)),
      lines: pvs.map((pv) => scanLine(pos.fen, pv, PLIES)),
      // Suites elles-mêmes (UCI, prolongées) : filtres et vérifications possibles après coup, sans recalcul.
      pvs,
      ext: PLIES,
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
    appendFileSync(DONE, `${game.index}\n`);
    processed++;
    if (processed % 50 === 0) {
      const rate = written / ((Date.now() - t0) / 3600000);
      console.error(`${processed} parties, ${written} positions (${Math.round(rate)} positions/h)`);
    }
  }
}));
for (const e of engines) e.stop();
console.error(`Terminé : ${written} positions en ${((Date.now() - t0) / 3600000).toFixed(1)} h`);
