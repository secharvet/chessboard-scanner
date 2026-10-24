/** Grains des parties annotées (coups.jsonl → grains jsonl), pour le témoin « sac de grains » de la sonde des mots.
 *   node scripts/arbres/grains-coups.mjs data/reference/annotes/coups.jsonl data/grains/annotes.s0.jsonl --shard 0 --of 4 */
import { readFileSync, writeFileSync } from 'node:fs';
import { grains } from '../grains.mjs';
const args = process.argv.slice(2); const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const [IN, OUT] = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const SHARD = Number(opt('--shard', 0)); const OF = Number(opt('--of', 1));
const rows = readFileSync(IN, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const out = []; let n = 0; const t0 = Date.now();
rows.forEach((r, i) => {
  if (i % OF !== SHARD || r.fen0) return;
  try { out.push(JSON.stringify(grains(r.uci, { id: r.id, total: r.uci.length }))); } catch (e) { console.error(`${r.id}: ${e.message}`); }
  if (++n % 50 === 0) console.error(`${n} parties (${((Date.now() - t0) / n).toFixed(0)} ms/partie)`);
});
writeFileSync(OUT, out.join('\n') + '\n'); console.error(`TERMINÉ ${out.length} parties`);
