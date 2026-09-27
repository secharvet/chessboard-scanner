/**
 * Validation du profileur sur deux groupes de styles réputés.
 *
 *   node scripts/profile-groups.mjs --games 40
 *
 * Cohérence d'un trait = part des paires (attaquant, prudent) où l'attaquant a la valeur la plus
 * élevée (100 % = séparation parfaite, 50 % = hasard, 0 % = séparation parfaite à l'envers).
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { TRAITS } from '../coach/profile.mjs';

const args = process.argv.slice(2);
const games = Number(args.includes('--games') ? args[args.indexOf('--games') + 1] : 40);
const reuse = args.includes('--reuse');
const GROUPS = {
  attaquants: ['Tal', 'Shirov', 'Morozevich', 'Topalov'],
  prudents: ['Petrosian', 'Andersson', 'Karpov', 'Kramnik'],
};
const all = [...GROUPS.attaquants, ...GROUPS.prudents];

const run = (name) => new Promise((resolve) => {
  const out = `reports/profil-${name}.json`;
  if (reuse && existsSync(out)) return resolve();
  const p = spawn('node', ['scripts/profile-players.mjs', `data/players/${name}.pgn:${name}`, '--games', String(games), '--out', out], { stdio: ['ignore', 'inherit', 'inherit'] });
  p.on('close', resolve);
});
const queue = [...all];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await run(queue.shift()); }));

const prof = Object.fromEntries(all.map((n) => [n, JSON.parse(readFileSync(`reports/profil-${n}.json`, 'utf8')).agg]));
const rows = [];
const header = `| Trait | ${all.join(' | ')} | Cohérence |`;
rows.push(header, `|${'---|'.repeat(all.length + 2)}`);
for (const [k, def] of Object.entries(TRAITS)) {
  const v = (n) => prof[n].traits[k]?.mean ?? NaN;
  let pairs = 0;
  let wins = 0;
  for (const a of GROUPS.attaquants) for (const b of GROUPS.prudents) {
    pairs++;
    if (v(a) > v(b)) wins++;
    else if (v(a) === v(b)) wins += 0.5;
  }
  const coh = Math.round((100 * wins) / pairs);
  const tag = coh >= 80 ? ' ✅ attaquants' : coh <= 20 ? ' ✅ prudents' : '';
  rows.push(`| ${def.label} | ${all.map((n) => v(n).toFixed(2)).join(' | ')} | ${coh} %${tag} |`);
}
const table = rows.join('\n');
console.log(`\nAttaquants : ${GROUPS.attaquants.join(', ')} — Prudents : ${GROUPS.prudents.join(', ')}\n\n${table}`);
writeFileSync(`reports/profils-groupes-${Date.now()}.md`, table);
