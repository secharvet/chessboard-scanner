/**
 * Profils de style comparés : le profileur distingue-t-il des styles connus ?
 *
 *   node scripts/profile-players.mjs data/players/Tal.pgn:Tal data/players/Petrosian.pgn:Petrosian --games 40
 *
 * Pour chaque trait : moyenne ± erreur type par joueur ; « net » si l'écart dépasse 2 erreurs types.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { aggregate, profileGame, splitPgn, TRAITS } from '../coach/profile.mjs';

const args = process.argv.slice(2);
const n = Number(args[args.indexOf('--games') + 1] ?? 40) || 40;
const players = args.filter((a) => a.includes(':')).map((a) => {
  const [file, name] = a.split(':');
  return { file, name };
});

const results = [];
for (const { file, name } of players) {
  const games = splitPgn(readFileSync(file, 'utf8'))
    .filter((g) => g.sans.length >= 50) // parties d'au moins 25 coups
    .map((g) => ({ ...g, color: (g.tags.White ?? '').includes(name) ? 'w' : (g.tags.Black ?? '').includes(name) ? 'b' : null }))
    .filter((g) => g.color);
  // Échantillon réparti sur toute la carrière (pas seulement les premières parties du fichier).
  const step = Math.max(1, Math.floor(games.length / n));
  const sample = games.filter((_, i) => i % step === 0).slice(0, n);
  const t0 = Date.now();
  const profiles = sample.map((g) => profileGame(g.sans, g.color));
  const agg = aggregate(profiles);
  console.error(`${name} : ${agg.games} parties, ${agg.moves} coups analysés (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  results.push({ name, agg });
}

const [A, B] = results;
const lines = [`| Trait | ${A.name} | ${B?.name ?? ''} | Écart |`, '|---|---|---|---|'];
for (const [k, def] of Object.entries(TRAITS)) {
  const a = A.agg.traits[k];
  const b = B?.agg.traits[k];
  const fmt = (x) => `${x.mean.toFixed(2)} ± ${x.se.toFixed(2)}`;
  let verdict = '';
  if (b) {
    const z = (a.mean - b.mean) / Math.sqrt(a.se ** 2 + b.se ** 2 || 1);
    verdict = Math.abs(z) >= 2 ? `**net** (${z > 0 ? A.name : B.name} plus élevé)` : 'non significatif';
  }
  lines.push(`| ${def.label} (${def.unit}) | ${fmt(a)} | ${b ? fmt(b) : ''} | ${verdict} |`);
}
console.log(lines.join('\n'));
mkdirSync('reports', { recursive: true });
writeFileSync(`reports/profils-${Date.now()}.json`, JSON.stringify(results, null, 2));
