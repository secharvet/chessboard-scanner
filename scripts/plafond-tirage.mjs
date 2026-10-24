/**
 * Plafond du vocabulaire (2 octobre 2026, point 1 de la critique du catalogue) : tirer N coups calmes joués par des
 * joueurs à 2000 et plus, dans les parties de TEST, que les détecteurs ne rattachent à aucun plan, pour les classer
 * à la main (plan du catalogue non codé / pas de plan / poussière tactique / inconnu).
 *   node scripts/plafond-tirage.mjs data/labels/human-2016-01f.s0.v2.jsonl [--n 50] [--seed 2] [--elo 2000] [--out reports/plafond-tirage.json]
 */
import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { crc32 } from 'node:zlib';
import { scanLine } from '../coach/plan-concepts.mjs';
import { classify, enPrise, moveEffects } from '../coach/move-class.mjs';
import { toFrenchSan } from '../coach/notation.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const IN = args.find((a) => a.endsWith('.jsonl'));
const N = Number(opt('--n', 50)), ELO = Number(opt('--elo', 2000)), OUT = opt('--out', 'reports/plafond-tirage.json');
let seed = Number(opt('--seed', 2));
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
const COUNTED = 6;
const pool = [];
let seen = 0, records = 0;
for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
  if (!line) continue;
  const r = JSON.parse(line);
  if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue;
  if (Math.max(r.elo?.w ?? 0, r.elo?.b ?? 0) < ELO) continue;
  records++;
  const scan = scanLine(r.fen, r.played, r.played.length);
  const atoms = scan.atomes ?? [];
  const c = new Chess(r.fen);
  for (let i = 0; i < Math.min(COUNTED, r.played.length); i++) {
    const u = r.played[i];
    const color = c.turn();
    if ((r.elo?.[color] ?? 0) < ELO) { try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } continue; }
    const inCheckBefore = c.inCheck();
    const before = enPrise(c, color);
    const fenBefore = c.fen();
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const cat = classify(c, m, i, scan, atoms, inCheckBefore, before);
    if (['prise', 'échec', 'promotion', "sort de l'échec"].includes(cat) || cat.startsWith('plan:')) continue;
    seen++;
    const item = {
      lot, game: r.game, position: r.ply, ply: i, elo: r.elo[color], color, fenBefore, san: toFrenchSan(m.san), cat,
      effets: moveEffects(fenBefore, m).map((e) => e.text),
      avant: r.played.slice(Math.max(0, i - 4), i).map((x) => x), apres: r.played.slice(i + 1, i + 7),
      evalAvant: r.evals?.[String(i)] ?? null, evalApres: r.evals?.[String(i + 1)] ?? null,
      plansCamp: Object.entries(scan).filter(([k, v]) => k.endsWith(`_${color}`) && typeof v === 'number' && v >= 0).map(([k, v]) => `${k.replace(`_${color}`, '')}@${v}`),
    };
    // réservoir
    if (pool.length < N) pool.push(item); else { const j = Math.floor(rnd() * seen); if (j < N) pool[j] = item; }
  }
}
writeFileSync(OUT, JSON.stringify({ records, candidats: seen, tirage: pool }, null, 1));
console.log(`${records} positions 2000+, ${seen} coups calmes non rattachés, ${pool.length} tirés → ${OUT}`);
