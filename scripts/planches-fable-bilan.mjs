/** Bilan des verdicts de Fable sur une série de planches : accord avec la clé du programme, désaccords détaillés. */
import { readFileSync, writeFileSync } from 'node:fs';
const [resFile, out] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(resFile, 'utf8'));
const by = {};
for (const r of rows) {
  const b = (by[r.concept] ??= { n: 0, accord: 0, pasSur: 0, desaccords: [] });
  b.n++;
  const attendu = r.programme === 'positif' ? 'oui' : 'non';
  if (r.fable === attendu) b.accord++; else if (r.fable === 'pas sûr') b.pasSur++; else b.desaccords.push(r);
}
const md = ['# Fable sur la seconde série de planches', '', '| Concept | Planches | Accord avec le programme | Pas sûr | Désaccords |', '|---|---|---|---|---|'];
let N = 0, A = 0;
for (const [c, b] of Object.entries(by)) { N += b.n; A += b.accord; md.push(`| ${c} | ${b.n} | ${b.accord} | ${b.pasSur} | ${b.desaccords.map((d) => d.id.split('-')[1]).join(', ') || '—'} |`); }
md.push(`| **total** | ${N} | ${A} (${Math.round(100 * A / N)} %) | ${rows.filter((r) => r.fable === 'pas sûr').length} | ${rows.filter((r) => r.fable !== 'pas sûr' && r.fable !== (r.programme === 'positif' ? 'oui' : 'non')).length} |`, '');
md.push('## Désaccords et doutes (à trancher par l\'auteur)', '');
for (const r of rows.filter((r) => r.fable === 'pas sûr' || r.fable !== (r.programme === 'positif' ? 'oui' : 'non'))) {
  md.push(`### ${r.id} — programme : ${r.programme}${r.raisonProgramme ? ` (${r.raisonProgramme})` : ''} ; Fable : ${r.fable}`, '', r.texte.split('\n').slice(1).join('\n').trim(), '');
}
writeFileSync(out, md.join('\n'));
console.log(md.slice(0, Object.keys(by).length + 5).join('\n'));
