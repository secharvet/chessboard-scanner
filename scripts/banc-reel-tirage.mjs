/**
 * Banc de cent milieux (2 octobre 2026) : 60 positions tirées des parties de TEST (jamais vues par les modèles), tous
 * niveaux, pour compléter les 40 du banc et donner un dénominateur à « zéro erreur grave » (moins de 3 % à 100).
 *   node scripts/banc-reel-tirage.mjs [--n 60] [--seed 7] [--out reports/banc-reel-60.json]
 */
import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { crc32 } from 'node:zlib';
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const N = Number(opt('--n', 60)), OUT = opt('--out', 'reports/banc-reel-60.json');
let seed = Number(opt('--seed', 7));
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0];
const per = Math.ceil(N / BR.length);
const pools = Object.fromEntries(BR.map(([b]) => [b, { seen: 0, keep: [] }]));
for (const IN of ['data/labels/human-2016-01f.s0.v2.jsonl', 'data/labels/human-2013-01.s0.v2.jsonl']) {
  const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
  for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
    if (!line) continue; const r = JSON.parse(line);
    if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue;
    if (r.ply < 18 || r.ply > 44) continue;
    const c = new Chess(r.fen); if (c.isGameOver()) continue;
    const side = c.turn(); const elo = r.elo?.[side]; const b = bracket(elo ?? -1); if (!b) continue;
    const p = pools[b]; p.seen++;
    const item = { name: `partie réelle ${lot} #${r.game} coup ${Math.floor(r.ply / 2) + 1} — ${b} ${elo} (${side === 'w' ? 'blancs' : 'noirs'})`, fen: r.fen, side: side === 'w' ? 'white' : 'black', elo, lot, game: r.game, position: r.ply, played: r.played.slice(0, 4) };
    if (p.keep.length < per) p.keep.push(item); else { const j = Math.floor(rnd() * p.seen); if (j < per) p.keep[j] = item; }
  }
}
const out = BR.flatMap(([b]) => pools[b].keep).slice(0, N);
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(Object.fromEntries(BR.map(([b]) => [b, `${pools[b].keep.length} tirées sur ${pools[b].seen}`])), `→ ${OUT}`);
