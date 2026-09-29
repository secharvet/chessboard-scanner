/**
 * Grille par Elo mesurée (docs/PLANS-ET-CONCEPTS.md, §2 et §4 bis) : pour chaque concept et chaque tranche d'Elo
 * du joueur qui agit, à quelle fréquence les humains réalisent le plan (par suite calme), et ce que devient
 * l'évaluation ensuite (médiane de la trajectoire à +8 et +16 demi-coups, part des plans qui n'ont pas coûté
 * plus de 0,3 pion). Aucune règle n'est tranchée ici : c'est la mesure qui servira à écrire la grille.
 *
 *   node scripts/human-grid.mjs data/labels/human-2013-01.s*.jsonl [--out reports/grille-elo.md]
 */

import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'reports/grille-elo.md';
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const BRACKETS = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer'];
const bracket = (elo) => BRACKETS.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? null;
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };

// positions[bracket] : nombre de demi-positions (une par camp) ; plans[concept][bracket] : { n, calm, d8, d16, kept }
// TÉMOIN : dérive de l'évaluation du joueur sur la fenêtre entière (24 demi-coups) quand il n'a réalisé AUCUN plan
// calme, par tranche ; à comparer à la dérive quand il en a réalisé un (Δ fin). Sans ce témoin, un Δ positif pourrait
// n'être que « les forts gagnent des points de toute façon ».
const control = {};
const withPlan = {};
const positions = {};
const plans = {};
let n = 0;
for (const file of files) {
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    n++;
    for (const side of ['w', 'b']) {
      const b = bracket(r.elo?.[side] ?? -1);
      if (!b) continue;
      positions[b] = (positions[b] ?? 0) + 1;
      const last = Math.max(...Object.keys(r.evals ?? {}).map(Number));
      const drift = r.evals?.[last] == null ? null : (side === 'w' ? 1 : -1) * (r.evals[last] - r.eval0);
      const mine = r.plans.filter((p) => p.side === side && p.quiet);
      if (drift !== null) (mine.length ? (withPlan[b] ??= []) : (control[b] ??= [])).push(drift);
      for (const p of r.plans) {
        if (p.side !== side) continue;
        const s = ((plans[p.concept] ??= {})[b] ??= { n: 0, calm: 0, d8: [], d16: [], kept: 0 });
        s.n++;
        if (!p.quiet) continue;
        s.calm++;
        if (p.deltas?.[8] != null) s.d8.push(p.deltas[8]);
        if (p.deltas?.[16] != null) { s.d16.push(p.deltas[16]); if (p.deltas[16] >= -30) s.kept++; }
      }
    }
  }
}
const md = [`# Grille par Elo mesurée — ${n} positions avec au moins un plan humain candidat (${files.length} fichiers)`, '',
  'Une ligne par concept et par tranche d\'Elo du joueur qui agit. « Réalisé » : le concept apparaît par une suite',
  'calme dans les 24 demi-coups joués (part des demi-positions de la tranche). « Δ » : évaluation du joueur, en',
  'centipions, 8 et 16 demi-coups après l\'apparition (médiane). « Tenu » : part des plans dont Δ16 ≥ -30.', '',
  '| Concept | Elo | Demi-positions | Candidats | Réalisés (calmes) | Δ8 méd. | Δ16 méd. | Tenu |', '|---|---|---|---|---|---|---|---|'];
for (const c of CONCEPTS) for (const [b] of BRACKETS) {
  const s = plans[c]?.[b];
  const pos = positions[b] ?? 0;
  if (!s || !pos) continue;
  md.push(`| ${c} | ${b} | ${pos} | ${s.n} | ${s.calm} (${(100 * s.calm / pos).toFixed(1)} %) | ${med(s.d8) ?? '—'} | ${med(s.d16) ?? '—'} | ${s.d16.length ? `${Math.round(100 * s.kept / s.d16.length)} %` : '—'} |`);
}
md.push('', '## Témoin : dérive de l\'évaluation du joueur sur 24 demi-coups', '',
  '| Elo | Sans plan calme réalisé (n) | Δ24 méd. | Avec au moins un plan calme (n) | Δ24 méd. |', '|---|---|---|---|---|');
for (const [b] of BRACKETS) if (control[b] || withPlan[b]) md.push(`| ${b} | ${control[b]?.length ?? 0} | ${med(control[b] ?? []) ?? '—'} | ${withPlan[b]?.length ?? 0} | ${med(withPlan[b] ?? []) ?? '—'} |`);
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(md.join('\n'));
