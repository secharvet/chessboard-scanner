/**
 * Jeu de données pour les petits réseaux de plans (docs/PLANS-ET-CONCEPTS.md, §5, §6, §6 bis).
 *
 * Pour chaque position étiquetée AVEC suites prolongées (champ `ext`), et pour chaque concept et chaque camp :
 *   y = 1  le concept est le plan du camp (planLabel : meilleure suite, contraste strict ou de tempo selon le
 *          concept, suite calme jusqu'à l'apparition) ;
 *   y = 0  le concept n'apparaît pas dans la meilleure suite ;
 *   null   cas ambigus, exclus (apparaît, mais sans contraste, trop tard, ou par une suite tactique).
 * Les étiquettes sont RECALCULÉES depuis les suites avec la définition actuelle des concepts.
 * Le filtre de stabilité (recherche plus profonde) demande Stockfish : il n'est pas appliqué ici.
 *
 * Entrées du modèle : le FEN (échiquier codé en Python) et les faits du moteur de règles, comptés par
 * identifiant et par couleur (la référence « vraie » du §6 bis s'entraîne sur ces faits).
 *
 *   node scripts/build-dataset.mjs data/labels/2013-01.jsonl data/labels/2013-01-48.jsonl
 *        [--out data/datasets/plans-v1.jsonl]
 *
 * Enregistrements de PLANS HUMAINS (scripts/label-human.mjs, champ `played`) : y = 1 si le concept apparaît par une
 * suite calme dans les coups joués, 0 s'il n'apparaît pas, null s'il apparaît par une suite non calme. On garde
 * l'Elo des deux joueurs et la trajectoire d'évaluation de chaque plan (`traj`), pour les seuils et la grille.
 */

import { createReadStream, writeFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { buildAllFacts } from '../positional/index.js';
import { planLabel, scanLine } from '../coach/plan-concepts.mjs';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'data/datasets/plans-v1.jsonl';
const inputs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer'];

writeFileSync(OUT, '');
const seen = new Set();
const counts = {};
let n = 0;
for (const file of inputs) {
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    const id = `${r.game}:${r.ply}`;
    const human = Boolean(r.played);
    if ((!human && (!r.ext || !r.pvs)) || seen.has(id)) continue;
    seen.add(id);
    const lines = human ? null : r.pvs.map((pv) => scanLine(r.fen, pv, r.ext));
    const y = {};
    const traj = {};
    for (const c of CONCEPTS) for (const side of ['w', 'b']) {
      let v;
      if (human) {
        const p = r.plans.find((x) => x.concept === c && x.side === side);
        v = !p ? 0 : p.quiet ? 1 : null;
        if (p) traj[`${c}_${side}`] = { appear: p.appear, quiet: p.quiet, ...p.deltas };
      } else v = planLabel(r, lines, c, side);
      y[`${c}_${side}`] = v;
      counts[c] ??= { 1: 0, 0: 0, null: 0 };
      counts[c][v]++;
    }
    const facts = {};
    for (const t of buildAllFacts(r.fen)) {
      const key = `${t.id}|${t.params.color ?? '-'}`;
      facts[key] = (facts[key] ?? 0) + 1;
    }
    appendFileSync(OUT, `${JSON.stringify({ game: r.game, ply: r.ply, elo: r.elo, fen: r.fen, eval: human ? r.eval0 : r.evals[0], source: human ? 'humain' : 'moteur', y, traj, facts })}\n`);
    if (++n % 5000 === 0) console.error(`${n} positions`);
  }
}
console.log(`${n} positions -> ${OUT}`);
for (const [c, v] of Object.entries(counts)) console.log(`${c.padEnd(22)} positifs ${v[1]}  négatifs ${v[0]}  exclus ${v.null}`);
