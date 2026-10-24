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

import { createReadStream, writeFileSync, appendFileSync, existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { buildAllFacts } from '../positional/index.js';
import { planLabel, scanLine } from '../coach/plan-concepts.mjs';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'data/datasets/plans-v1.jsonl';
// Jugement d'exécution (§4.2, seuils calibrés dans reports/calibration-acpl.md) : avec --juge, un plan positif
// n'est étiqueté 1 que s'il est « réalisé ET bien joué » (perte moyenne ≤ X, pire coup ≤ Y, espérance de score) ;
// réalisé mais mal joué (ou non jugé) → null : ni bon exemple, ni vrai négatif.
const JUGE = args.includes('--juge');
const SEUIL_MOY = Number(args.includes('--seuil-moyenne') ? args[args.indexOf('--seuil-moyenne') + 1] : 10);
const SEUIL_PIRE = Number(args.includes('--seuil-pire') ? args[args.indexOf('--seuil-pire') + 1] : 20);
const optNames = ['--out', '--seuil-moyenne', '--seuil-pire'];
const inputs = args.filter((a, i) => !a.startsWith('--') && !optNames.includes(args[i - 1]));
const CONCEPTS = ['tour_colonne', 'tour_colonne_semi_ouverte', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer', 'attaque_minorite', 'baionnette'];

writeFileSync(OUT, '');
const seen = new Set();
const counts = {};
let n = 0;
let malJoue = 0;
let nonJuge = 0;
for (const file of inputs) {
  // Les numéros de partie recommencent à zéro à chaque lot (2013, 2016...) : l'identifiant est préfixé par le
  // lot pour que `seen` et le découpage par partie (crc32) ne confondent jamais deux lots.
  const lot = file.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '').replace(/\.jsonl$/, '');
  // Jugements d'exécution (scripts/juge-plans.mjs) : fichier compagnon `<entrée>.juge.jsonl`, clé game:ply.
  const juge = new Map();
  if (JUGE) {
    // Étiquettes recalculées (`.v2.jsonl`, scripts/rescan-labels.mjs) : le jugement est celui du fichier d'origine.
    const jf = file.replace(/(\.v\d+)?\.jsonl$/, '.juge.jsonl');
    if (existsSync(jf)) {
      for (const l of readFileSync(jf, 'utf8').split('\n')) {
        if (!l) continue;
        try {
          const j = JSON.parse(l);
          juge.set(`${j.game}:${j.ply}`, Object.fromEntries(j.plans.map((p) => [`${p.concept}_${p.side}`, p])));
        } catch { /* ligne tronquée */ }
      }
    }
    console.error(`${file} : ${juge.size} positions jugées`);
  }
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    const id = `${lot}:${r.game}:${r.ply}`;
    const human = Boolean(r.played);
    if ((!human && (!r.ext || !r.pvs)) || seen.has(id)) continue;
    seen.add(id);
    const jugements = JUGE ? juge.get(`${r.game}:${r.ply}`) : null;
    const lines = human ? null : r.pvs.map((pv) => scanLine(r.fen, pv, r.ext));
    const y = {};
    const traj = {};
    for (const c of CONCEPTS) for (const side of ['w', 'b']) {
      let v;
      if (human) {
        const p = r.plans.find((x) => x.concept === c && x.side === side);
        // Règle du prix (§9) : le plan doit apparaître tôt pour être attribué à CETTE position ; plus tard, ambigu.
        // Plan déplacé ou nouveau au recalcul (`stale`) : son jugement d'exécution est périmé → ambigu, pas un exemple.
        // Sauf s'il a été rejugé depuis (jugement au même demi-coup d'apparition) : il redevient un exemple (2 octobre).
        const rejuge = p?.stale && JUGE && jugements?.[`${c}_${side}`]?.appear === p.appear;
        v = !p ? 0 : (p.stale && !rejuge) ? null : p.quiet && p.appear < 12 ? 1 : null;
        if (p) traj[`${c}_${side}`] = { appear: p.appear, quiet: p.quiet, ...p.deltas };
        // « Réalisé ET bien joué » (§4.2) : le positif doit passer les deux seuils du jugement d'exécution.
        if (JUGE && v === 1) {
          const j = jugements?.[`${c}_${side}`];
          if (!j || j.perteMoyenne === null) { v = null; nonJuge++; } else {
            traj[`${c}_${side}`].perteMoyenne = j.perteMoyenne;
            traj[`${c}_${side}`].pertePire = j.pertePire;
            if (j.perteMoyenne > SEUIL_MOY || j.pertePire > SEUIL_PIRE) { v = null; malJoue++; }
          }
        }
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
    appendFileSync(OUT, `${JSON.stringify({ game: `${lot}:${r.game}`, ply: r.ply, elo: r.elo, fen: r.fen, eval: human ? r.eval0 : r.evals[0], source: human ? 'humain' : 'moteur', y, traj, facts })}\n`);
    if (++n % 5000 === 0) console.error(`${n} positions`);
  }
}
console.log(`${n} positions -> ${OUT}`);
if (JUGE) console.log(`jugement : ${malJoue} positifs mal joués exclus, ${nonJuge} positifs sans jugement exclus (seuils ${SEUIL_MOY}/${SEUIL_PIRE})`);
for (const [c, v] of Object.entries(counts)) console.log(`${c.padEnd(22)} positifs ${v[1]}  négatifs ${v[0]}  exclus ${v.null}`);
