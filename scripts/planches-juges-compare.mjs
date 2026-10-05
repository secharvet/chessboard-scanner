/**
 * Compare plusieurs juges sur les mêmes planches : accord avec le programme (étiquettes), accord avec le juge de
 * référence (Fable), par concept. Sortie Markdown.
 *   node scripts/planches-juges-compare.mjs <référence.json> <sortie.md> <juge1.json> [juge2.json …]
 */
import { readFileSync, writeFileSync } from 'node:fs';
const [refFile, out, ...files] = process.argv.slice(2);
const load = (f) => Object.fromEntries(JSON.parse(readFileSync(f, 'utf8')).map((r) => [r.id, r]));
const ref = load(refFile);
const ids = Object.keys(ref);
const attendu = (r) => (r.programme === 'positif' ? 'oui' : 'non');
const v = (r) => r?.verdict ?? r?.fable;
const judged = (x) => ['oui', 'non', 'pas sûr'].includes(x);
const lines = ['# Juges de planches : comparaison', '', `Référence : ${refFile} (${ids.length} planches, juge Fable). Accord « programme » = même réponse que l'étiquette du code ; accord « Fable » = même réponse que Fable sur les planches jugées par les deux.`, ''];
lines.push('| Juge | Jugées | Accord programme | Accord Fable | Pas sûr | Erreurs | Secondes/planche |', '|---|---|---|---|---|---|---|');
const refAcc = ids.filter((i) => judged(v(ref[i])) && v(ref[i]) === attendu(ref[i])).length;
lines.push(`| Fable (référence) | ${ids.length} | ${refAcc} (${Math.round(100 * refAcc / ids.length)} %) | — | ${ids.filter((i) => v(ref[i]) === 'pas sûr').length} | ${ids.filter((i) => !judged(v(ref[i]))).length} | ${Math.round(ids.reduce((s, i) => s + (ref[i].secondes ?? 0), 0) / ids.length)} |`);
const perConcept = {};
for (const f of files) {
  const j = load(f);
  const name = Object.values(j)[0]?.modele ?? f;
  const rows = ids.map((i) => j[i]).filter(Boolean);
  const jg = rows.filter((r) => judged(v(r)));
  const accP = jg.filter((r) => v(r) === attendu(r)).length;
  const both = jg.filter((r) => judged(v(ref[r.id])));
  const accF = both.filter((r) => v(r) === v(ref[r.id])).length;
  lines.push(`| ${name} | ${jg.length} | ${accP} (${jg.length ? Math.round(100 * accP / jg.length) : 0} %) | ${accF}/${both.length} (${both.length ? Math.round(100 * accF / both.length) : 0} %) | ${rows.filter((r) => v(r) === 'pas sûr').length} | ${rows.filter((r) => !judged(v(r))).length} | ${jg.length ? Math.round(jg.reduce((s, r) => s + (r.secondes ?? 0), 0) / jg.length) : 0} |`);
  for (const r of jg) {
    const c = r.concept; perConcept[c] ??= {}; perConcept[c][name] ??= { n: 0, acc: 0 };
    perConcept[c][name].n++; if (v(r) === attendu(r)) perConcept[c][name].acc++;
  }
}
lines.push('', '## Accord avec le programme, par concept', '');
const names = [...new Set(Object.values(perConcept).flatMap((o) => Object.keys(o)))];
lines.push(`| Concept | ${names.join(' | ')} |`, `|---|${names.map(() => '---').join('|')}|`);
for (const [c, o] of Object.entries(perConcept)) lines.push(`| ${c} | ${names.map((n) => (o[n] ? `${o[n].acc}/${o[n].n}` : '—')).join(' | ')} |`);
lines.push('', '## Désaccords avec Fable (planche, programme, Fable, juge)', '');
for (const f of files) {
  const j = load(f); const name = Object.values(j)[0]?.modele ?? f;
  for (const i of ids) { const r = j[i]; if (!r || !judged(v(r)) || !judged(v(ref[i])) || v(r) === v(ref[i])) continue; lines.push(`- ${i} : programme ${ref[i].programme}, Fable ${v(ref[i])}, ${name} ${v(r)}`); }
}
writeFileSync(out, lines.join('\n') + '\n');
console.log(lines.slice(4, 6 + files.length).join('\n'));
