/**
 * Réparer les identifiants numériques des grains (lots produits avant la lecture de LichessURL) à partir des plateaux du
 * même lot : mêmes parties dans le même ordre (même découpage --shard/--of, mêmes filtres). On vérifie Elo, résultat et
 * nombre de demi-coups ligne à ligne ; une ligne qui ne concorde pas garde son id et est comptée.
 *   node scripts/arbres/realigner-ids.mjs data/grains/elite-2021-02.s0.jsonl data/plateaux/elite-2021-02.s0.bin.idx.jsonl
 */
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
const [G, P] = process.argv.slice(2);
const idx = readFileSync(P, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const lines = readFileSync(G, 'utf8').split('\n').filter(Boolean);
let ok = 0, ko = 0; const out = [];
for (let j = 0; j < lines.length; j++) {
  const l = lines[j]; const p = idx[j];
  const head = l.slice(0, 400); const we = Number(head.match(/"we":(\d+)/)?.[1]); const be = Number(head.match(/"be":(\d+)/)?.[1]); const res = head.match(/"res":"([^"]*)"/)?.[1]; const n = Number(head.match(/"n":(\d+)/)?.[1]);
  if (p && p.we === we && p.be === be && p.res === res && Math.min(n, 120) === p.n) { ok++; out.push(l.replace(/^\{"id":"[^"]*"/, `{"id":"${p.id}"`)); }
  else { ko++; out.push(l); }
}
writeFileSync(G + '.tmp', out.join('\n') + '\n'); renameSync(G + '.tmp', G);
console.log(`${G}: ${ok} réalignés, ${ko} non concordants`);
