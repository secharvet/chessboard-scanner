/**
 * Prolonge après coup les suites d'un fichier d'étiquettes produit avant la prolongation (docs/PLANS-ET-CONCEPTS.md,
 * §6 bis) : chaque suite est complétée jusqu'à 48 demi-coups (coach/extend-line.mjs), les étiquettes sont
 * recalculées, et l'enregistrement est écrit dans un nouveau fichier, dans le même ordre.
 *
 *   node scripts/extend-labels.mjs data/labels/lot1.jsonl [--out data/labels/lot1-48.jsonl] [--workers 1]
 *        [--depth 16] [--plies 48]
 *
 * Reprise automatique : les positions déjà écrites (même partie, même demi-coup) sont sautées.
 */

import { appendFileSync, createReadStream, existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { scanLine } from '../coach/plan-concepts.mjs';
import { extendPv } from '../coach/extend-line.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const IN = args[0];
const OUT = opt('--out', IN.replace(/\.jsonl$/, '-48.jsonl'));
const WORKERS = Number(opt('--workers', 1));
const DEPTH = Number(opt('--depth', 16));
const PLIES = Number(opt('--plies', 48));

const id = (r) => `${r.game}:${r.ply}`;
const done = new Set();
if (existsSync(OUT)) for (const l of readFileSync(OUT, 'utf8').split('\n')) if (l) done.add(id(JSON.parse(l)));
console.error(`${done.size} positions déjà prolongées — sortie ${OUT}`);

const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity })[Symbol.asyncIterator]();
let pulling = Promise.resolve();
const take = () => (pulling = pulling.then(async () => {
  for (;;) {
    const { value, done: end } = await rl.next();
    if (end) return null;
    if (!value) continue;
    const r = JSON.parse(value);
    if (r.pvs && !r.ext && !done.has(id(r))) return r;
  }
}));

const engines = Array.from({ length: WORKERS }, () => new UciEngine({ threads: 1 }));
let written = 0;
const t0 = Date.now();
await Promise.all(engines.map(async (engine) => {
  for (let r = await take(); r; r = await take()) {
    const pvs = [];
    for (const pv of r.pvs) pvs.push(await extendPv(engine, r.fen, pv, { plies: PLIES, depth: DEPTH }));
    appendFileSync(OUT, `${JSON.stringify({ ...r, pvs, lines: pvs.map((pv) => scanLine(r.fen, pv, PLIES)), ext: PLIES, engine: engine.name })}\n`);
    if (++written % 500 === 0) console.error(`${written} positions (${Math.round(written / ((Date.now() - t0) / 3600000))} positions/h)`);
  }
}));
for (const e of engines) e.stop();
console.error(`Terminé : ${written} positions prolongées`);
