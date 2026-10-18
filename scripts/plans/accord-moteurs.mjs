/**
 * Accord des deux moteurs sur le test à deux demi-coups v2 : un verdict n'est annoncé que si les deux moteurs donnent le
 * même axe 1 et le même axe 2 ; au-delà d'un pion d'écart entre leurs Δ sur la même ligne, « contesté entre moteurs »
 * (désaccord tactique, à trancher une fois à profondeur 30) ; sinon « désaccord » (petit écart sans signe).
 *
 *   node scripts/plans/accord-moteurs.mjs --a <preparatoire SF19 .json ou dossier> --b <preparatoire SF17 .json ou dossier> [--out reports/plans/accord-moteurs.md]
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { enToFr } from '../../coach/notation.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const A = opt('--a'), B = opt('--b'), OUT = opt('--out', 'reports/plans/accord-moteurs.md'), CONTESTE = 100;
const charger = (p) => (statSync(p).isDirectory() ? readdirSync(p).filter((f) => /^preparatoire-.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(p, f), 'utf8'))) : JSON.parse(readFileSync(p, 'utf8')));
const k = (l) => `${l.pos}|${l.plan}`, fr = enToFr, fmt = (c) => (c == null ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const a = new Map(charger(A).map((l) => [k(l), l])), b = new Map(charger(B).map((l) => [k(l), l]));
const rows = [];
for (const key of [...a.keys()].filter((x) => b.has(x))) {
  const x = a.get(key), y = b.get(key);
  let verdict;
  if (x.delta != null && y.delta != null && Math.abs(x.delta - y.delta) > CONTESTE) verdict = 'contesté entre moteurs';
  else if (x.axe1 === y.axe1 && x.etat === y.etat) verdict = `annoncé : ${x.axe1} · ${x.etat}`;
  else if (x.axe1 === y.axe1) verdict = `annoncé (axe 1 seul) : ${x.axe1}`;
  else verdict = 'désaccord';
  rows.push({ key, x, y, verdict });
}
const md = [`# Accord des deux moteurs — ${A} contre ${B}`, '', '| ligne | moteur A (axe 1 · axe 2 · Δ) | moteur B | verdict |', '|---|---|---|---|'];
for (const r of rows.sort((u, v) => u.verdict.localeCompare(v.verdict))) md.push(`| ${r.key} · M=${r.x.M ? fr(r.x.M) : '—'} | ${r.x.axe1} · ${r.x.etat} · ${fmt(r.x.delta)} | ${r.y.axe1} · ${r.y.etat} · ${fmt(r.y.delta)} | **${r.verdict}** |`);
const cnt = (p) => rows.filter((r) => r.verdict.startsWith(p)).length;
md.push('', `Bilan : ${cnt('annoncé :')} annoncés sur les deux axes, ${cnt('annoncé (axe 1')} sur l'axe 1 seul, ${cnt('désaccord')} désaccords, ${cnt('contesté')} contestés entre moteurs, sur ${rows.length} lignes.`, '');
writeFileSync(OUT, md.join('\n') + '\n'); console.log(md[md.length - 2]); console.error(`écrit : ${OUT}`);
