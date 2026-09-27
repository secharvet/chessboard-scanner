/**
 * Profil de style d'un joueur (un processus par joueur, pour paralléliser).
 *
 *   node scripts/profile-players.mjs data/players/Tal.pgn:Tal --games 40 --out reports/profil-Tal.json
 *
 * Parties lentes seulement (blitz, rapides, simultanées, à l'aveugle écartées), ≥ 25 coups,
 * échantillon réparti sur toute la carrière.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { aggregate, profileGame, splitPgn } from '../coach/profile.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

const args = process.argv.slice(2);
const val = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const n = Number(val('--games', 40));
const out = val('--out', null);
const [file, name] = args.find((a) => a.includes(':')).split(':');
const FAST = /blitz|rapid|simul|blind|exhib|armageddon|speed|internet|online|lightning|\bicc\b|\bfics\b|bullet/i;

const games = splitPgn(readFileSync(file, 'utf8'))
  .filter((g) => g.sans.length >= 50 && !FAST.test(`${g.tags.Event ?? ''} ${g.tags.TimeControl ?? ''}`))
  .map((g) => ({ ...g, color: (g.tags.White ?? '').includes(name) ? 'w' : (g.tags.Black ?? '').includes(name) ? 'b' : null }))
  .filter((g) => g.color);
const step = Math.max(1, Math.floor(games.length / n));
const sample = games.filter((_, i) => i % step === 0).slice(0, n);

const engine = new UciEngine({ threads: 1, hashMb: 32 });
const t0 = Date.now();
const profiles = [];
for (const g of sample) profiles.push(await profileGame(g.sans, g.color, { engine }));
engine.stop();
const agg = aggregate(profiles);
console.error(`${name} : ${agg.games} parties lentes, ${agg.moves} coups (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
const result = { name, file, agg };
if (out) {
  mkdirSync('reports', { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 2));
} else console.log(JSON.stringify(result, null, 2));
