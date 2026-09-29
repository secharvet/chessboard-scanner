/**
 * Plans HUMAINS (docs/PLANS-ET-CONCEPTS.md, §4 bis) : le plan est cherché dans les coups RÉELLEMENT JOUÉS, et
 * Stockfish ne fait que juger. Pour chaque position de milieu de partie d'une vraie partie :
 *   1. on déroule les 24 demi-coups suivants de la partie ; le moteur de règles relève, pour chaque concept et
 *      chaque camp, s'il apparaît par des coups calmes et délibérés de ce camp (scanLine, mêmes règles que pour
 *      les suites du moteur) ;
 *   2. Stockfish évalue la TRAJECTOIRE : position de départ, puis 2, 8 et 16 demi-coups après l'apparition du
 *      concept, et la fin de la fenêtre. Aucune règle de réfutation n'est écrite ici (un sacrifice positionnel
 *      creuse l'évaluation avant de payer ; un plan mauvais peut ne rien coûter si l'adversaire rate la réfutation) :
 *      la règle, s'il y en a une, se découvrira dans ces trajectoires. Les plans à suite non calme (sacrifices,
 *      échanges inégaux) sont gardés, avec la raison, pour la même étude.
 * On enregistre tout (Elo de chaque joueur, résultat de la partie, nom du moteur).
 *
 *   node scripts/label-human.mjs data/lichess/2013-01.pgn [--out data/labels/human-2013-01.jsonl]
 *        [--workers 1] [--depth 12] [--plies 24] [--every 6] [--max 1000000] [--shard i/n]
 *
 * Reprise automatique (fichier de sortie et `<sortie>.done`). --shard i/n : ce processus ne traite que les
 * parties d'index ≡ i (mod n), pour lancer n processus en parallèle (le moteur de règles, en JavaScript, occupe
 * un fil par processus) ; chacun a son propre fichier de sortie.
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { UciEngine } from '../coach/uci-engine.mjs';
import { quietReason, scanLine } from '../coach/plan-concepts.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PGN = args[0];
const OUT = opt('--out', `data/labels/human-${PGN.split('/').pop().replace(/\.pgn$/, '')}.jsonl`);
const WORKERS = Number(opt('--workers', 1));
const DEPTH = Number(opt('--depth', 12));
const PLIES = Number(opt('--plies', 24));
const EVERY = Number(opt('--every', 6));
const MAX = Number(opt('--max', 1000000));
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer'];
const [SHARD, SHARDS] = (opt('--shard', '0/1')).split('/').map(Number);

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

/** Coups de la partie (SAN nettoyés) et, pour chaque échantillon, le FEN et les coups UCI qui suivent. */
function samples(game) {
  const c = new Chess();
  const sans = game.moves.replace(/\{[^}]*\}/g, '').replace(/\d+\.(\.\.)?/g, ' ')
    .split(/\s+/).filter((t) => t && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
  const ucis = [];
  const fens = [new Chess().fen()];
  for (const san of sans) {
    let m;
    try { m = c.move(san); } catch { break; }
    ucis.push(m.from + m.to + (m.promotion ?? ''));
    fens.push(c.fen());
  }
  const out = [];
  // Un échantillon tous les EVERY demi-coups, du 16e au 60e, avec au moins 8 demi-coups joués ensuite.
  for (let ply = Math.ceil(16 / EVERY) * EVERY; ply <= Math.min(60, ucis.length - 8); ply += EVERY) {
    const pos = new Chess(fens[ply]);
    if (pos.inCheck() || pos.isGameOver()) continue;
    out.push({ ply, fen: fens[ply], next: ucis.slice(ply, ply + PLIES), fens: fens.slice(ply, ply + PLIES + 1) });
  }
  return out;
}

mkdirSync(OUT.replace(/\/[^/]*$/, ''), { recursive: true });
// Parties déjà traitées : par ce fichier ET par les autres tranches (`<base>.s<k>.jsonl`), pour pouvoir changer
// le nombre de tranches en cours de route sans retraiter ni perdre de parties.
const done = new Set();
const dir = OUT.replace(/\/[^/]*$/, '') || '.';
const base = OUT.split('/').pop().replace(/\.s\d+\.jsonl$/, '').replace(/\.jsonl$/, '');
for (const f of readdirSync(dir)) {
  if (!f.startsWith(base) || !(f.endsWith('.jsonl') || f.endsWith('.jsonl.done'))) continue;
  for (const l of readFileSync(`${dir}/${f}`, 'utf8').split('\n')) if (l) done.add(f.endsWith('.done') ? Number(l) : JSON.parse(l).game);
}
const DONE = `${OUT}.done`;
console.error(`${done.size} parties déjà traitées — sortie ${OUT}, ${WORKERS} moteur(s), profondeur ${DEPTH}`);

const engines = Array.from({ length: WORKERS }, () => new UciEngine({ threads: 1 }));
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
/** Évaluation en centipions du point de vue des BLANCS. */
async function evalWhite(engine, fen) {
  const [l] = await engine.analyze(fen, { depth: DEPTH, multipv: 1 });
  if (!l) return null;
  const cp = toCp(l.score);
  return fen.split(' ')[1] === 'w' ? cp : -cp;
}
let written = 0;
let processed = 0;
const t0 = Date.now();

async function labelGame(engine, game) {
  const elo = { w: Number(game.headers.WhiteElo) || null, b: Number(game.headers.BlackElo) || null };
  for (const s of samples(game)) {
    const scan = scanLine(s.fen, s.next, PLIES);
    // Plans humains candidats : concept apparu (règles d'agentivité et de tenue) par une suite calme.
    const plans = [];
    for (const c of CONCEPTS) for (const side of ['w', 'b']) {
      const p = scan[`${c}_${side}`];
      if (!(p >= 0)) continue;
      const quiet = quietReason(s.fen, s.next, p, c);
      plans.push({ concept: c, side, appear: p, quiet: quiet === null, quietReason: quiet });
    }
    if (!plans.length) continue; // rien à juger : on n'évalue pas (économie de moteur)
    const e0 = await evalWhite(engine, s.fen);
    if (e0 === null || Math.abs(e0) > 400) continue; // position déjà décidée
    const evals = { 0: e0 };
    const last = s.fens.length - 1;
    for (const p of plans) {
      // Trajectoire du point de vue du camp : après le coup qui réalise le concept et la réponse adverse (+2),
      // puis +8 et +16 demi-coups, et la fin de la fenêtre.
      const sign = p.side === 'w' ? 1 : -1;
      p.deltas = {};
      for (const k of [2, 8, 16]) {
        const at = Math.min(p.appear + k, last);
        if (evals[at] === undefined) evals[at] = await evalWhite(engine, s.fens[at]);
        p.deltas[k] = evals[at] === null ? null : sign * (evals[at] - e0);
      }
      if (evals[last] === undefined) evals[last] = await evalWhite(engine, s.fens[last]);
      p.deltas.end = evals[last] === null ? null : sign * (evals[last] - e0);
    }
    const rec = {
      game: game.index, ply: s.ply, fen: s.fen, elo, result: game.headers.Result ?? null, played: s.next,
      eval0: e0, evals, plans,
      extra: Object.fromEntries(Object.entries(scan).filter(([k]) => /moyen|avant_roque|faiblesse|couleur|exploite|levier|colonne_|echangeable|rangee|_colonne/.test(k) && scan[k] !== null && scan[k] !== -1 && scan[k] !== false)),
      engine: engine.name,
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
    if (done.has(r.value.index) || r.value.index % SHARDS !== SHARD) continue;
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
      console.error(`${processed} parties, ${written} positions avec plan humain (${Math.round(rate)} positions/h)`);
    }
  }
}));
for (const e of engines) e.stop();
console.error(`Terminé : ${written} positions en ${((Date.now() - t0) / 3600000).toFixed(1)} h`);
