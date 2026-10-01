/**
 * Inventaire des mots de STRATÉGIE (coach/strategy.mjs) sur les parties de test : pour chaque fenêtre de 12 demi-coups
 * et chaque camp, quels mots s'allument, combien de camps n'en ont aucun, par niveau ; avec quels plans (8 concepts)
 * chaque mot va de pair ; exemples pour les planches.
 *
 *   node scripts/inventaire-strategie.mjs data/labels/human-2013-01.s0.v2.jsonl [--out reports/strategie-<fichier>.json]
 * Fusion : node scripts/inventaire-strategie.mjs --merge reports/strategie-*.json [--md reports/inventaire-strategie.md]
 */

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { crc32 } from 'node:zlib';
import { detectStrategy } from '../coach/strategy.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? 'inconnu';
const PLIES = 12;
const EXAMPLES = 12;

if (args.includes('--merge')) merge();
else await run();

async function run() {
  const IN = args.find((a) => !a.startsWith('--') && a.endsWith('.jsonl'));
  const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
  const OUT = opt('--out', `reports/strategie-${IN.split('/').pop().replace(/\.jsonl$/, '')}.json`);
  const MAX = Number(opt('--max', 0));
  const words = {}; // kind -> { n, byBracket, withPlan: {concept: n}, examples }
  const none = {}; // bracket -> { sides, none }
  const pairs = {}; // "a+b" -> n
  let records = 0;
  const t0 = Date.now();
  for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue;
    records++;
    if (MAX && records > MAX) break;
    const s = detectStrategy(r.fen, r.played, { plies: PLIES });
    for (const side of ['w', 'b']) {
      const b = bracket(r.elo?.[side] ?? -1);
      const nb = (none[b] ??= { sides: 0, none: 0 });
      nb.sides++;
      if (!s[side].length) nb.none++;
      const plans = (r.plans ?? []).filter((p) => p.side === side && p.quiet && p.appear < PLIES).map((p) => p.concept);
      const kinds = s[side].map((w) => w.kind);
      for (let i = 0; i < kinds.length; i++) for (let j = i + 1; j < kinds.length; j++) { const k = [kinds[i], kinds[j]].sort().join(' + '); pairs[k] = (pairs[k] ?? 0) + 1; }
      for (const w of s[side]) {
        const g = (words[w.kind] ??= { n: 0, byBracket: {}, withPlan: {}, examples: [] });
        g.n++;
        g.byBracket[b] = (g.byBracket[b] ?? 0) + 1;
        for (const c of plans) g.withPlan[c] = (g.withPlan[c] ?? 0) + 1;
        if (!plans.length) g.withPlan['(aucun plan)'] = (g.withPlan['(aucun plan)'] ?? 0) + 1;
        if (g.examples.length < EXAMPLES) g.examples.push({ fen: r.fen, side, preuves: w.preuves, elo: r.elo?.[side] ?? null, lot, game: r.game, ply: r.ply, plans });
      }
    }
    if (records % 5000 === 0) console.log(`${records} positions, ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  writeFileSync(OUT, JSON.stringify({ lot, file: IN, records, words, none, pairs }, null, 1));
  console.log(JSON.stringify({ records, words: Object.fromEntries(Object.entries(words).map(([k, v]) => [k, v.n])) }));
  console.log('TERMINÉ');
}

function merge() {
  const files = args.filter((a) => a.endsWith('.json'));
  const MD = opt('--md', 'reports/inventaire-strategie.md');
  const words = {};
  const none = {};
  const pairs = {};
  let records = 0;
  for (const f of files) {
    const d = JSON.parse(readFileSync(f, 'utf8'));
    records += d.records;
    for (const [k, n] of Object.entries(d.pairs)) pairs[k] = (pairs[k] ?? 0) + n;
    for (const [b, v] of Object.entries(d.none)) { const t = (none[b] ??= { sides: 0, none: 0 }); t.sides += v.sides; t.none += v.none; }
    for (const [k, g] of Object.entries(d.words)) {
      const t = (words[k] ??= { n: 0, byBracket: {}, withPlan: {}, examples: [] });
      t.n += g.n;
      for (const [b, n] of Object.entries(g.byBracket)) t.byBracket[b] = (t.byBracket[b] ?? 0) + n;
      for (const [c, n] of Object.entries(g.withPlan)) t.withPlan[c] = (t.withPlan[c] ?? 0) + n;
      for (const e of g.examples) if (t.examples.length < EXAMPLES) t.examples.push(e);
    }
  }
  const brackets = BR.map(([b]) => b).filter((b) => none[b]);
  const sides = Object.values(none).reduce((a, v) => a + v.sides, 0);
  const pct = (n, d) => `${(100 * n / Math.max(1, d)).toFixed(1)} %`;
  const md = [`# Inventaire des mots de stratégie — ${records} positions de test, ${sides} camps (fenêtres de ${PLIES} demi-coups)`, '',
    'Un mot de stratégie = une orientation dessinée par plusieurs coups d\'un camp (`coach/strategy.mjs`). Un camp peut en porter plusieurs.', '',
    '## Couverture', '', `| Niveau du camp | Camps | Sans aucun mot |`, '|---|---|---|'];
  for (const b of brackets) md.push(`| ${b} | ${none[b].sides} | ${pct(none[b].none, none[b].sides)} |`);
  md.push(`| **tous** | ${sides} | **${pct(Object.values(none).reduce((a, v) => a + v.none, 0), sides)}** |`, '',
    '## Les mots', '', `| Mot | Camps | Part | ${brackets.join(' | ')} | Plans qui l'accompagnent le plus (12 demi-coups) |`, `|---|---|---|${brackets.map(() => '---').join('|')}|---|`);
  const sorted = Object.entries(words).sort((a, b) => b[1].n - a[1].n);
  for (const [k, g] of sorted) {
    const top = Object.entries(g.withPlan).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, n]) => `${c} ${pct(n, g.n)}`).join(', ');
    md.push(`| ${k} | ${g.n} | ${pct(g.n, sides)} | ${brackets.map((b) => pct(g.byBracket[b] ?? 0, none[b].sides)).join(' | ')} | ${top} |`);
  }
  md.push('', '## Mots qui vont ensemble', '', '| Paire | Camps |', '|---|---|');
  for (const [k, n] of Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 10)) md.push(`| ${k} | ${n} |`);
  md.push('', '## Exemples (pour les planches)', '');
  for (const [k, g] of sorted) {
    md.push(`### ${k} (${g.n} camps)`, '');
    for (const e of g.examples.slice(0, 5)) md.push(`- ${e.side === 'w' ? 'Blancs' : 'Noirs'} (Elo ${e.elo ?? '?'}) : ${e.preuves.join(' ')} — \`${e.fen}\`${e.plans.length ? ` — plans : ${e.plans.join(', ')}` : ''}`);
    md.push('');
  }
  writeFileSync(MD, `${md.join('\n')}\n`);
  writeFileSync(MD.replace(/\.md$/, '.json'), JSON.stringify({ records, sides, words: Object.fromEntries(sorted), none, pairs }, null, 1));
  console.log(md.slice(0, 30).join('\n'));
}
