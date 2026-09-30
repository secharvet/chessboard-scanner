/**
 * Jugement d'exécution (docs/PLANS-ET-CONCEPTS.md, §4.2) : pour chaque plan POSITIF des étiquettes humaines
 * (suite calme, apparition avant le 12e demi-coup), la perte des SEULS coups du camp sur le segment du plan
 * (du départ au coup qui réalise le concept inclus), coup par coup contre la meilleure ligne, en
 * ESPÉRANCE DE SCORE (formule de Lichess), jamais en centipions bruts.
 *
 *   node scripts/juge-plans.mjs data/labels/human-*.jsonl [--depth 12] [--workers 14]
 *
 * Sortie : un fichier compagnon par entrée, `<entrée sans .jsonl>.juge.jsonl`, un enregistrement par position :
 *   { game, ply, plans: [{ concept, side, appear, coups, perteMoyenne, pertePire, pertes }], engine, depth }
 * `pertes` : la perte de chaque coup du camp, en points d'espérance de score (0 à 100, arrondi au dixième).
 * Reprise : les positions déjà jugées (game:ply) sont sautées. Les évaluations déjà présentes dans
 * l'étiquette (`eval0`, `evals`, mêmes moteur et profondeur) sont réutilisées.
 */

import { appendFileSync, createReadStream, existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { UciEngine } from '../coach/uci-engine.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEPTH = Number(opt('--depth', 12));
const WORKERS = Number(opt('--workers', 14));
const inputs = args.filter((a, i) => !a.startsWith('--') && !['--depth', '--workers'].includes(args[i - 1]));

/** Espérance de score (0 à 100) depuis des centipions, formule de Lichess (spec §4.2). */
const winPct = (cp) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);

const engines = Array.from({ length: WORKERS }, () => new UciEngine({ threads: 1, hashMb: 64 }));

/** Évaluation en centipions du point de vue des BLANCS (comme label-human.mjs). */
async function evalWhite(engine, fen) {
  const [l] = await engine.analyze(fen, { depth: DEPTH, multipv: 1 });
  if (!l) return null;
  const cp = toCp(l.score);
  return fen.split(' ')[1] === 'w' ? cp : -cp;
}

let judged = 0;
let skipped = 0;
const t0 = Date.now();

async function judgeRecord(engine, r, out) {
  const pos = (r.plans ?? []).filter((p) => p.quiet && p.appear < 12);
  if (!pos.length) return;
  const maxIdx = Math.max(...pos.map((p) => p.appear)) + 1;
  // FEN de chaque demi-coup du segment (fens[i] = position après i demi-coups joués).
  const chess = new Chess(r.fen);
  const fens = [r.fen];
  for (const uci of r.played.slice(0, maxIdx)) {
    try {
      chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      skipped++;
      return; // coup illisible : on ne juge pas cette position
    }
    fens.push(chess.fen());
  }
  // Évaluations (vue des Blancs) : réutilise celles de l'étiquette (même moteur, même profondeur).
  const evals = {};
  if (r.eval0 !== undefined) evals[0] = r.eval0;
  for (const [k, v] of Object.entries(r.evals ?? {})) if (Number(k) <= maxIdx && v !== null) evals[k] = v;
  for (let i = 0; i <= maxIdx; i++) {
    if (evals[i] === undefined) evals[i] = await evalWhite(engine, fens[i]);
    if (evals[i] === null) { skipped++; return; }
  }
  const plans = pos.map((p) => {
    const sign = p.side === 'w' ? 1 : -1;
    const pertes = [];
    for (let i = 0; i <= p.appear; i++) {
      if (fens[i].split(' ')[1] !== p.side) continue; // seuls les coups du camp comptent
      pertes.push(Math.round((winPct(sign * evals[i]) - winPct(sign * evals[i + 1])) * 10) / 10);
    }
    return {
      concept: p.concept, side: p.side, appear: p.appear, coups: pertes.length,
      perteMoyenne: pertes.length ? Math.round((pertes.reduce((a, b) => a + b, 0) / pertes.length) * 10) / 10 : null,
      pertePire: pertes.length ? Math.max(...pertes) : null,
      pertes,
    };
  });
  appendFileSync(out, `${JSON.stringify({ game: r.game, ply: r.ply, plans, engine: engines[0].name ?? 'Stockfish', depth: DEPTH })}\n`);
  if (++judged % 1000 === 0) {
    const rate = judged / ((Date.now() - t0) / 3600000);
    console.error(`${judged} positions jugées (${Math.round(rate)}/h, ${skipped} sautées)`);
  }
}

for (const input of inputs) {
  const out = input.replace(/\.jsonl$/, '.juge.jsonl');
  const done = new Set();
  if (existsSync(out)) {
    for (const l of readFileSync(out, 'utf8').split('\n')) {
      if (!l) continue;
      try { const j = JSON.parse(l); done.add(`${j.game}:${j.ply}`); } catch { /* ligne tronquée (arrêt brutal) : rejugée */ }
    }
  }
  console.error(`${input} → ${out} (${done.size} déjà jugées)`);
  // Pool : chaque moteur prend l'enregistrement suivant dès qu'il est libre.
  const rl = createInterface({ input: createReadStream(input), crlfDelay: Infinity });
  const it = rl[Symbol.asyncIterator]();
  // La distribution des lignes est sérialisée : l'itérateur de readline ne supporte pas les next() concurrents.
  let chain = Promise.resolve();
  const nextLine = () => { const p = chain.then(() => it.next()); chain = p.catch(() => ({})); return p; };
  await Promise.all(engines.map(async (engine) => {
    for (;;) {
      const { value, done: end } = await nextLine();
      if (end) return;
      if (!value) continue;
      const r = JSON.parse(value);
      if (done.has(`${r.game}:${r.ply}`)) continue;
      await judgeRecord(engine, r, out);
    }
  }));
}
for (const e of engines) e.stop();
console.log(`Terminé : ${judged} positions jugées, ${skipped} sautées, ${Math.round((Date.now() - t0) / 60000)} min`);
