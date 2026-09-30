/**
 * Grille par Elo CONDITIONNELLE (docs/PLANS-ET-CONCEPTS.md, §9, relecture du 29 septembre, point 7) : la part brute
 * « réalise le plan » confond le plan et le type de position (à 2000 + les parties atteignent plus souvent un
 * milieu de jeu à colonnes ouvertes ; à 1200 elles finissent sur une gaffe). On rapporte donc, par tranche d'Elo du
 * joueur qui agit, **P(plan réalisé | ingrédients présents)** : le dénominateur est le nombre de demi-positions où
 * les ingrédients du concept sont là, lus dans les faits du jeu de données (les disponibilités servent de
 * dénominateurs pour rupture, avant-poste, blocage, affaiblir).
 *
 * Ingrédients par concept (faits « à moi » sauf mention) :
 *   tour_colonne          COLONNE_OUVERTE (sans camp) ou COLONNE_SEMI_OUVERTE à moi
 *   rupture               LEVIER_DISPONIBLE à moi
 *   cavalier_avant_poste  ROUTE_CAVALIER à moi
 *   blocage               ROUTE_CAVALIER à moi ou pion faible adverse (PION_ISOLE, PION_ARRIERE, PION_FAIBLE, PION_PASSE à lui)
 *   affaiblir             ECHANGE_ABIMANT à moi ou LEVIER_DISPONIBLE à moi
 *   dominer               COMPLEXE_FAIBLE à lui, ou CASE_FAIBLE à lui
 *
 *   node scripts/human-grid-cond.mjs data/datasets/humains-v3.jsonl data/datasets/humains-2016-v1.jsonl
 *        [--out reports/grille-elo-conditionnelle.md]
 */

import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'reports/grille-elo-conditionnelle.md';
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? null;

/** Ingrédients présents pour `side`, d'après les faits comptés « id|couleur ». */
const INGREDIENTS = {
  tour_colonne: (f, me) => has(f, 'COLONNE_OUVERTE', '-') || has(f, 'COLONNE_SEMI_OUVERTE', me),
  rupture: (f, me) => has(f, 'LEVIER_DISPONIBLE', me),
  cavalier_avant_poste: (f, me) => has(f, 'ROUTE_CAVALIER', me),
  blocage: (f, me, opp) => has(f, 'ROUTE_CAVALIER', me) || ['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE'].some((id) => has(f, id, opp)),
  affaiblir: (f, me) => has(f, 'ECHANGE_ABIMANT', me) || has(f, 'LEVIER_DISPONIBLE', me),
  dominer: (f, me, opp) => has(f, 'COMPLEXE_FAIBLE', opp) || has(f, 'CASE_FAIBLE', opp),
};
const has = (f, id, col) => (f[`${id}|${col}`] ?? 0) > 0;

// stats[concept][bracket] = { with: demi-positions avec ingrédients, done: dont plan réalisé, all: toutes, doneAll }
const stats = {};
let n = 0;
for (const file of files) {
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    n++;
    for (const side of ['w', 'b']) {
      const b = bracket(r.elo?.[side] ?? -1);
      if (!b) continue;
      const opp = side === 'w' ? 'b' : 'w';
      for (const [c, test] of Object.entries(INGREDIENTS)) {
        const y = r.y[`${c}_${side}`];
        if (y === null || y === undefined) continue; // ambigu : exclu du numérateur et du dénominateur
        const s = ((stats[c] ??= {})[b] ??= { with: 0, done: 0, all: 0, doneAll: 0 });
        s.all++;
        if (y === 1) s.doneAll++;
        if (test(r.facts, side, opp)) { s.with++; if (y === 1) s.done++; }
      }
    }
  }
}
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)} %` : '—');
const md = [`# Grille par Elo conditionnelle — ${n} positions (${files.map((f) => f.split('/').pop()).join(', ')})`, '',
  'Par concept et tranche d\'Elo du joueur qui agit : part des demi-positions où le plan est réalisé (suite calme, avant',
  'le 12e demi-coup) **sachant que les ingrédients sont présents**, comparée à la part brute. Les cas ambigus (plan',
  'tardif ou par suite tactique) sont exclus des deux. « Ingrédients » : voir l\'en-tête du script.', '',
  '| Concept | Elo | Demi-positions | dont ingrédients présents | Réalisé, brut | **Réalisé sachant ingrédients** |',
  '|---|---|---|---|---|---|'];
for (const c of Object.keys(INGREDIENTS)) for (const [b] of BR) {
  const s = stats[c]?.[b];
  if (!s) continue;
  md.push(`| ${c} | ${b} | ${s.all} | ${s.with} (${pct(s.with, s.all)}) | ${pct(s.doneAll, s.all)} | **${pct(s.done, s.with)}** |`);
}
md.push('', '## Lecture', '',
  '- Si la colonne conditionnelle monte avec l\'Elo comme la colonne brute, le niveau change bien la propension à',
  '  réaliser le plan, pas seulement le type de positions rencontrées.',
  '- Si elle est plate alors que la brute monte, la « grille » mesurait la disponibilité des ingrédients, pas le plan.',
  '- La part « ingrédients présents » par tranche dit ce que les positions de chaque niveau offrent comme occasions.');
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(md.join('\n'));
