/**
 * Grille par Elo « réalise ET réussit » (docs/PLANS-ET-CONCEPTS.md, §2 et §4 ; JOURNAL, 30 septembre) : pour chaque
 * concept et chaque tranche d'Elo du joueur qui agit, la part des plans réalisés (suite calme, apparition avant le
 * 12e demi-coup) qui sont aussi BIEN JOUÉS selon le jugement d'exécution (scripts/juge-plans.mjs, calculé sur DENEB) :
 * perte moyenne des coups du camp sur le segment ≤ X et pire coup ≤ Y, en points d'espérance de score.
 *
 * Les fichiers d'étiquettes et leurs compagnons `.juge.jsonl` sont joints PAR FICHIER (les identifiants de partie
 * recommencent à zéro à chaque lot).
 *
 *   node scripts/human-grid-reussite.mjs data/labels/human-2013-01.s*.jsonl data/labels/human-2016-01f.s*.jsonl
 *        [--x 10] [--y 20] [--out reports/grille-elo-reussite.md]
 */

import { createReadStream, existsSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const X = Number(opt('--x', 10));
const Y = Number(opt('--y', 20));
const OUT = opt('--out', 'reports/grille-elo-reussite.md');
const files = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? null;
const CONCEPTS = ['tour_colonne', 'rupture', 'affaiblir', 'blocage', 'cavalier_avant_poste', 'dominer'];
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };

const stats = {}; // concept -> bracket -> { realises, juges, reussis, moyennes[] }
let positions = 0;
let sansJuge = 0;
for (const file of files) {
  const jf = file.replace(/\.jsonl$/, '.juge.jsonl');
  if (!existsSync(jf)) { console.error(`pas de jugement pour ${file}`); continue; }
  const juge = new Map();
  for await (const line of createInterface({ input: createReadStream(jf), crlfDelay: Infinity })) {
    if (!line) continue;
    const j = JSON.parse(line);
    juge.set(`${j.game}:${j.ply}`, j.plans);
  }
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    positions++;
    const jp = juge.get(`${r.game}:${r.ply}`);
    for (const p of r.plans) {
      if (!CONCEPTS.includes(p.concept) || !p.quiet || !(p.appear < 12)) continue;
      const b = bracket(r.elo?.[p.side] ?? -1);
      if (!b) continue;
      const s = ((stats[p.concept] ??= {})[b] ??= { realises: 0, juges: 0, reussis: 0, moyennes: [] });
      s.realises++;
      const v = jp?.find((q) => q.concept === p.concept && q.side === p.side);
      if (!v || typeof v.perteMoyenne !== 'number') { sansJuge++; continue; }
      s.juges++;
      s.moyennes.push(v.perteMoyenne);
      if (v.perteMoyenne <= X && v.pertePire <= Y) s.reussis++;
    }
  }
}
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)} %` : '—');
const md = [`# Grille par Elo « réalise et réussit » — ${positions} positions, seuils X = ${X} (moyenne), Y = ${Y} (pire coup)`, '',
  'Par concept et tranche d\'Elo du joueur qui agit : plans réalisés (suite calme, avant le 12e demi-coup), part de ceux',
  'qui sont bien joués (perte moyenne des coups du camp sur le segment ≤ X et aucun coup > Y, en points d\'espérance de',
  `score, Stockfish 19 profondeur 12), et perte moyenne médiane. Plans sans jugement : ${sansJuge}.`, '',
  '| Concept | Elo | Réalisés | Jugés | **Réussis (part des jugés)** | Perte moyenne médiane |', '|---|---|---|---|---|---|'];
for (const c of CONCEPTS) for (const [b] of BR) {
  const s = stats[c]?.[b];
  if (!s) continue;
  md.push(`| ${c} | ${b} | ${s.realises} | ${s.juges} | **${pct(s.reussis, s.juges)}** | ${med(s.moyennes) ?? '—'} |`);
}
md.push('', '## Lecture', '',
  '- « Réussi » = réalisé et bien joué : c\'est l\'étiquette d\'entraînement retenue (§4). La part qui monte avec le niveau dit',
  '  que les forts exécutent mieux les mêmes plans ; une part basse à tous les niveaux dit que le plan est souvent une faute.',
  '- Les seuils viennent de la calibration sur planches (DENEB, 30 septembre) ; la sensibilité est dans `reports/calibration-acpl.md`.');
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(md.join('\n'));
