/**
 * Vérification des exemples positifs (docs/PLANS-ET-CONCEPTS.md) — deux filtres après l'étiquetage :
 *
 *  1. SUITE CALME : un plan se construit par des coups calmes. Jusqu'à l'apparition du concept :
 *     matériel inchangé (échanges équilibrés permis, pas de sacrifice ni de gain), et le coup qui fait
 *     apparaître le concept n'est ni un roque (tour posée en f1 par O-O) ni la prise d'une pièce.
 *  2. STABILITÉ : le concept doit rester LE PLAN (planLabel : contraste et suite calme) dans l'analyse d'un
 *     AUTRE moteur (--engine2, par défaut l'autre Stockfish installé : 17.1 du paquet Ubuntu ou 19 officiel),
 *     à la même profondeur, suites prolongées de la même façon. Une recherche plus profonde du même moteur
 *     (ancien critère, --depth2) ne suffisait pas : sur 60 plans stables de 16 à 18 avec Stockfish 17.1,
 *     Stockfish 19 n'en retrouvait que 17 (29 septembre). Ce qui dépend de la version n'est pas le plan.
 *
 *   node scripts/verify-labels.mjs data/labels/2013-01.jsonl [--out data/labels/2013-01-verifie.jsonl]
 *        [--workers 1] [--max 2000]
 *
 * Sortie : une ligne par exemple positif vérifié ou rejeté, avec la raison ; résumé par concept.
 */

import { appendFileSync, readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { CONTRAST, GAP, planLabel, quietReason, scanLine } from '../coach/plan-concepts.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { extendPv } from '../coach/extend-line.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = opt('--out', args[0].replace(/\.jsonl$/, '-verifie.jsonl'));
const MAX = Number(opt('--max', 2000));
const WORKERS = Number(opt('--workers', 1));
const DEPTH2 = Number(opt('--depth2', 16));
// L'AUTRE moteur que celui qui a produit l'enregistrement (champ `engine` : « Stockfish 19 » ; absent = 17.1 du
// paquet Ubuntu, avant le 28 septembre). Les deux binaires installés : 17.1 (/usr/games) et 19 (/usr/local/bin).
const PATHS = { 17: '/usr/games/stockfish', 19: '/usr/local/bin/stockfish' };
const otherEngine = (r) => (String(r.engine ?? '').includes('19') ? PATHS[17] : PATHS[19]);
const ENGINE2 = opt('--engine2', Object.values(PATHS).every(existsSync) ? 'auto' : null);
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer'];

/** Positif brut : contraste du concept (strict ou de tempo, CONTRAST), avant les filtres calme et stabilité. */
const positive = (r, k) => {
  const p = r.lines[0][k];
  if (!(p >= 0)) return false;
  const { tempo, maxPly } = CONTRAST[k.replace(/_[wb]$/, '')] ?? CONTRAST.default;
  if (p >= maxPly) return false;
  const worse = r.lines.slice(1).filter((_, i) => r.evals[0] - r.evals[i + 1] >= GAP);
  return worse.length > 0 && !worse.some((l) => l[k] >= 0 && (!tempo || l[k] < p + tempo));
};

// Étiquettes RECALCULÉES depuis les suites enregistrées, avec la définition actuelle des concepts
// (coach/plan-concepts.mjs) : une définition corrigée s'applique sans relancer Stockfish.
const records = readFileSync(args[0], 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.pvs)
  .map((r) => ({ ...r, lines: r.pvs.map((pv) => scanLine(r.fen, pv)) }));
const todo = [];
for (const r of records) for (const c of CONCEPTS) for (const side of ['w', 'b']) if (positive(r, `${c}_${side}`)) todo.push({ r, c, side });
console.error(`${records.length} positions avec suites, ${todo.length} positifs bruts — vérification de ${Math.min(MAX, todo.length)}`);

const stats = {};
const bump = (c, k) => { stats[c] ??= {}; stats[c][k] = (stats[c][k] ?? 0) + 1; };
console.error(`second moteur : ${ENGINE2 ?? 'aucun (le même, plus profond)'}`);
// Un moteur par binaire et par travailleur ; on choisit à chaque enregistrement l'autre que le sien.
const pool = Array.from({ length: WORKERS }, () => Object.fromEntries(Object.entries(PATHS)
  .filter(([, p]) => ENGINE2 === 'auto' ? existsSync(p) : true)
  .map(([v, p]) => [v, new UciEngine({ threads: 1, path: ENGINE2 && ENGINE2 !== 'auto' ? ENGINE2 : p })])));
const engines = pool.map((set) => ({ set, for: (r) => (ENGINE2 === 'auto' ? set[otherEngine(r) === PATHS[17] ? 17 : 19] : Object.values(set)[0]) }));
let next = 0;
await Promise.all(engines.map(async (worker) => {
  while (next < Math.min(MAX, todo.length)) {
    const { r, c, side } = todo[next++];
    const engine = worker.for(r);
    const k = `${c}_${side}`;
    const ply = r.lines[0][k];
    let reason = quietReason(r.fen, r.pvs[0], ply, c);
    let ply2 = null;
    if (!reason) {
      // Second avis : 3 suites de l'autre moteur (ou du même, plus profond), même règle d'étiquetage.
      const lines2 = await engine.analyze(r.fen, { depth: ENGINE2 ? DEPTH2 : Math.max(DEPTH2, 18), multipv: 3 });
      const pvs2 = [];
      for (const l of lines2) pvs2.push(r.ext ? await extendPv(engine, r.fen, l.pv, { plies: r.ext }) : l.pv.slice(0, 24));
      const r2 = { fen: r.fen, evals: lines2.map((l) => toCp(l.score)), pvs: pvs2 };
      const scans2 = pvs2.map((pv) => scanLine(r.fen, pv, r.ext ?? 24));
      ply2 = scans2[0]?.[k] ?? -1;
      if (ply2 < 0) reason = 'instable (absent de la meilleure suite du second moteur)';
      else if (planLabel(r2, scans2, c, side) !== 1) reason = 'instable (pas le plan pour le second moteur)';
    }
    bump(c, reason ?? 'vérifié');
    appendFileSync(OUT, `${JSON.stringify({ fen: r.fen, game: r.game, ply: r.ply, elo: r.elo, concept: c, side, appear: ply, appear2: ply2, ok: !reason, reason, engine: r.engine ?? 'Stockfish 17.1', engine2: engine.path })}\n`);
  }
}));
for (const w of engines) for (const e of Object.values(w.set)) e.stop();
for (const [c, s] of Object.entries(stats)) {
  const total = Object.values(s).reduce((a, b) => a + b, 0);
  console.log(`${c.padEnd(22)} vérifiés ${String(s['vérifié'] ?? 0).padStart(4)}/${total}  —  ${Object.entries(s).filter(([k]) => k !== 'vérifié').map(([k, v]) => `${k} : ${v}`).join(' ; ')}`);
}
