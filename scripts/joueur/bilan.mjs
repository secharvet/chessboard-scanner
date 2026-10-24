#!/usr/bin/env node
/**
 * Le bilan d'une série de parties du coach joueur : lit tous les `<dossier>/*.json` (hors `bilan.json`), agrège, écrit
 * `<dossier>/bilan.json`. Idempotent : il scanne le disque, donc il est juste quelle que soit la reprise.
 *
 *   node scripts/joueur/bilan.mjs parties-serie
 *
 * Score du point de vue du coach (1 / ½ / 0). Les parties « non finies » (plafond de demi-coups) sont comptées à part et
 * exclues du score. Bévues / phrases / sortes / alertes sur les coups du coach ; temps = somme des `ms`.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const dossier = process.argv[2] ?? 'parties-serie';
const fichiers = readdirSync(dossier).filter((f) => f.endsWith('.json') && f !== 'bilan.json').sort();

/** Score du coach pour une partie (null si non finie). */
function score(p) {
  if (p.resultat === '*') return null;
  const blancs = p.resultat === '1-0' ? 1 : p.resultat === '0-1' ? 0 : 0.5;
  return p.coach.camp === 'w' ? blancs : 1 - blancs;
}

const b = {
  figees: null, maj: new Date().toISOString(), parties: 0, nonFinies: 0,
  blancs: { n: 0, score: 0 }, noirs: { n: 0, score: 0 }, scoreCoach: 0,
  coups: 0, bevues: 0, fautes: 0, exclus: 0, gachis: 0, nonExamines: 0,
  phrases: 0, alertes: 0, sortes: {}, prefere: 0, secondes: 0, parParties: [],
};

for (const f of fichiers) {
  let p;
  try { p = JSON.parse(readFileSync(`${dossier}/${f}`, 'utf8')); } catch { continue; }
  if (!p.coups) continue;
  b.parties++;
  b.figees ??= p.coach.code;
  const s = score(p);
  if (s == null) b.nonFinies++;
  else { const c = p.coach.camp === 'w' ? b.blancs : b.noirs; c.n++; c.score += s; b.scoreCoach += s; }
  const coach = p.coups.filter((x) => x.coach);
  for (const x of coach) {
    b.coups++;
    if (x.phrase && x.phrase.trim()) b.phrases++;
    if (x.alerte) b.alertes++;
    b.sortes[x.sorte ?? '(aucune)'] = (b.sortes[x.sorte ?? '(aucune)'] ?? 0) + 1;
    if (x.sousSorte === 'prefere') b.prefere++;
    b.secondes += Math.round((x.ms ?? 0) / 1000);
  }
  if (p.examen) { b.bevues += p.examen.bevues; b.fautes += p.examen.fautes; b.exclus += p.examen.exclus; b.gachis += p.examen.gachis ?? 0; }
  else b.nonExamines++;
  b.parParties.push({ id: p.id, camp: p.coach.camp, resultat: p.resultat, score: s, bevues: p.examen?.bevues ?? null });
}

const scores = b.blancs.n + b.noirs.n;
b.scorePct = scores ? b.scoreCoach / scores : null;
b.bevuePct = b.coups ? b.bevues / b.coups : null;
b.phrasePct = b.coups ? b.phrases / b.coups : null;

writeFileSync(`${dossier}/bilan.json`, JSON.stringify(b, null, 1));
const pc = (x) => (x == null ? '—' : `${(100 * x).toFixed(1).replace('.', ',')} %`);
console.error(`bilan : ${b.parties} parties (${b.nonFinies} non finies), score coach ${b.scoreCoach}/${scores} (${pc(b.scorePct)}) — Blancs ${b.blancs.score}/${b.blancs.n}, Noirs ${b.noirs.score}/${b.noirs.n} ; bévues ${b.bevues}/${b.coups} (${pc(b.bevuePct)}), phrases ${pc(b.phrasePct)}, alertes ${b.alertes}`);
