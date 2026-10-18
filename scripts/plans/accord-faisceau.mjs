/**
 * Accord des deux moteurs sur le faisceau : même phrase et prix à moins d'un pion → annoncé ; phrases différentes et plus
 * d'un pion d'écart → contesté entre moteurs ; sinon désaccord. Et le critère vu des deux côtés.
 *
 *   node scripts/plans/accord-faisceau.mjs --a <faisceau.json SF19> --b <faisceau.json SF17> [--out reports/plans/faisceau/accord.md]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const A = opt('--a'), B = opt('--b'), OUT = opt('--out', 'reports/plans/faisceau/accord.md'), CONTESTE = 100;
if (!A || !B) { console.error('usage : --a <json> --b <json>'); process.exit(2); }
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const k = (r) => `${r.position}|${r.libelle}`;
const a = new Map(JSON.parse(readFileSync(A, 'utf8')).map((r) => [k(r), r])), b = new Map(JSON.parse(readFileSync(B, 'utf8')).map((r) => [k(r), r]));
const rows = [];
for (const key of [...a.keys()].filter((x) => b.has(x))) {
  const x = a.get(key), y = b.get(key);
  const dp = x.prix != null && y.prix != null ? Math.abs(x.prix - y.prix) : null;
  let verdict;
  if (x.phrase === y.phrase && (dp == null || dp <= CONTESTE)) verdict = `annoncé : ${x.phrase}`;
  else if (x.phrase !== y.phrase && dp != null && dp > CONTESTE) verdict = 'contesté entre moteurs';
  else verdict = 'désaccord';
  rows.push({ key, x, y, dp, verdict });
}
const md = [`# Accord des deux moteurs sur le faisceau — ${A} contre ${B}`, '', '| plan | canon. | A : phrase · prix · tempo | B : phrase · prix · tempo | Δ prix | verdict |', '|---|---|---|---|---|---|'];
for (const r of rows.sort((u, v) => u.verdict.localeCompare(v.verdict) || u.key.localeCompare(v.key))) md.push(`| ${r.key} | ${r.x.canonique ? '●' : ''} | ${r.x.phrase} · ${fmt(r.x.prix)} · ${r.x.tempo ?? '∞'} | ${r.y.phrase} · ${fmt(r.y.prix)} · ${r.y.tempo ?? '∞'} | ${fmt(r.dp)} | **${r.verdict}** |`);
const cnt = (p) => rows.filter((r) => r.verdict.startsWith(p)).length;
md.push('', `Bilan : ${cnt('annoncé')} annoncés, ${cnt('désaccord')} désaccords, ${cnt('contesté')} contestés entre moteurs, sur ${rows.length} plans.`, '');
writeFileSync(OUT, md.join('\n') + '\n'); console.log(md[md.length - 2]); console.error(`écrit : ${OUT}`);
