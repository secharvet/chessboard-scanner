/**
 * Inventaire des coups (1er octobre 2026, étape 1 de l'inventaire du vocabulaire) : sur les parties de TEST (jamais
 * vues par les modèles), chaque coup joué est rangé dans un tas, par ordre de priorité :
 *   prise / échec / promotion     coups non calmes (tactique : hors du domaine des plans)
 *   sort de l'échec               le camp était en échec : tout coup légal est une parade
 *   plan:<concept>                le coup réalise un de nos 8 plans (ou en est le levier)
 *   moyen:<atome>                 un des 12 atomes (levier, manœuvre, roque, restriction, regroupement…)
 *   défense:sauve                 une pièce était en prise, elle ne l'est plus (déplacée ou défendue)
 *   défense:protège               le coup ajoute un défenseur à une pièce attaquée
 *   développement                 cavalier ou fou qui quitte sa première rangée
 *   poussée de pion               poussée calme sans levier ni gain d'espace retenu
 *   coup de roi                   roi hors roque
 *   inexpliqué:<pièce>            rien de ce qui précède : c'est le tas à étudier
 * Pour ne compter chaque coup de partie qu'une fois (fenêtres de 24 demi-coups tous les 6), seuls les 6 premiers
 * demi-coups de chaque fenêtre sont comptés ; les plans et atomes sont cherchés sur les 24.
 *
 *   node scripts/inventaire-coups.mjs data/labels/human-2013-01.s0.v2.jsonl [--out reports/inventaire-<lot>.json] [--max N]
 * Fusion : node scripts/inventaire-coups.mjs --merge reports/inventaire-*.json [--md reports/inventaire-coups.md]
 */

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';
import { crc32 } from 'node:zlib';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer', 'attaque_minorite', 'baionnette'];
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? 'inconnu';
const COUNTED = 6;

if (args.includes('--merge')) {
  merge();
} else {
  await inventory();
}

/** Pièces de `color` en prise : attaquées, et non défendues ou attaquées par moins cher. */
function enPrise(c, color) {
  const opp = color === 'w' ? 'b' : 'w';
  const out = new Map();
  for (const p of c.board().flat()) {
    if (!p || p.color !== color || p.type === 'k') continue;
    const att = c.attackers(p.square, opp);
    if (!att.length) continue;
    const def = c.attackers(p.square, color);
    const cheapest = Math.min(...att.map((sq) => VALUE[c.get(sq).type]));
    out.set(p.square, { type: p.type, attacked: true, defenders: def.length, hanging: def.length === 0 || cheapest < VALUE[p.type] });
  }
  return out;
}

function classify(c, m, i, scan, atoms, inCheckBefore, before) {
  const color = m.color;
  if (m.captured) return 'prise';
  if (m.san.includes('+') || m.san.includes('#')) return 'échec';
  if (m.promotion) return 'promotion';
  if (inCheckBefore) return "sort de l'échec";
  for (const k of CONCEPTS) {
    if (scan[`${k}_${color}`] === i) return `plan:${k}`;
    if ((k === 'rupture' && scan[`rupture_levier_${color}`] === i && scan[`rupture_${color}`] >= 0)
      || (k === 'affaiblir' && scan[`affaiblir_levier_${color}`] === i && scan[`affaiblir_${color}`] >= 0)) return `plan:${k}`;
  }
  const atom = atoms.find((a) => a.side === color && a.ply === i);
  if (atom) return `moyen:${atom.kind}`;
  // Défense : pièces en prise avant / après (la pièce déplacée est suivie sur sa nouvelle case).
  const after = enPrise(c, color);
  const track = (sq) => (sq === m.from ? m.to : sq);
  const wasHanging = [...before.entries()].filter(([, v]) => v.hanging);
  if (wasHanging.length && wasHanging.every(([sq]) => !after.get(track(sq))?.hanging)) return 'défense:sauve';
  for (const [sq, v] of before) {
    const now = after.get(track(sq));
    if (v.attacked && now && now.defenders > v.defenders && sq !== m.from) return 'défense:protège';
  }
  if ((m.piece === 'n' || m.piece === 'b') && m.from[1] === (color === 'w' ? '1' : '8')) return 'développement';
  if (m.piece === 'p') return 'poussée de pion';
  if (m.piece === 'k') return 'coup de roi';
  return `inexpliqué:${m.piece}`;
}

async function inventory() {
  const IN = args.find((a) => !a.startsWith('--') && a.endsWith('.jsonl'));
  const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
  const OUT = opt('--out', `reports/inventaire-${IN.split('/').pop().replace(/\.jsonl$/, '')}.json`);
  const MAX = Number(opt('--max', 0));
  const counts = {}; // bracket -> category -> n
  let records = 0;
  let moves = 0;
  const t0 = Date.now();
  for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue; // parties de test seulement
    records++;
    if (MAX && records > MAX) break;
    const scan = scanLine(r.fen, r.played, r.played.length);
    const atoms = scan.atomes ?? [];
    const c = new Chess(r.fen);
    for (let i = 0; i < Math.min(COUNTED, r.played.length); i++) {
      const u = r.played[i];
      const color = c.turn();
      const inCheckBefore = c.inCheck();
      const before = enPrise(c, color);
      let m;
      try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
      const cat = classify(c, m, i, scan, atoms, inCheckBefore, before);
      const b = bracket(r.elo?.[color] ?? -1);
      ((counts[b] ??= {})[cat] ??= 0);
      counts[b][cat]++;
      moves++;
    }
    if (records % 5000 === 0) console.log(`${records} positions, ${moves} coups, ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  writeFileSync(OUT, JSON.stringify({ lot, file: IN, records, moves, counts }, null, 1));
  console.log(JSON.stringify({ records, moves }));
  console.log('TERMINÉ');
}

function merge() {
  const files = args.filter((a) => a.endsWith('.json'));
  const MD = opt('--md', 'reports/inventaire-coups.md');
  const counts = {};
  let records = 0;
  let moves = 0;
  for (const f of files) {
    const d = JSON.parse(readFileSync(f, 'utf8'));
    records += d.records;
    moves += d.moves;
    for (const [b, cats] of Object.entries(d.counts)) for (const [k, n] of Object.entries(cats)) ((counts[b] ??= {})[k] ??= 0, counts[b][k] += n);
  }
  const brackets = BR.map(([b]) => b).filter((b) => counts[b]);
  const total = {};
  for (const b of brackets) for (const [k, n] of Object.entries(counts[b])) total[k] = (total[k] ?? 0) + n;
  const all = Object.values(total).reduce((a, x) => a + x, 0);
  const group = (k) => (['prise', 'échec', 'promotion'].includes(k) ? 'non calme' : k.startsWith('plan:') ? 'plan' : k.startsWith('moyen:') ? 'moyen'
    : k.startsWith('défense') || k === "sort de l'échec" ? 'défense' : k.startsWith('inexpliqué') ? 'inexpliqué' : 'autre coup calme');
  const groups = {};
  for (const [k, n] of Object.entries(total)) groups[group(k)] = (groups[group(k)] ?? 0) + n;
  const calm = all - (groups['non calme'] ?? 0);
  const pct = (n, d) => `${(100 * n / d).toFixed(1)} %`;
  const md = [`# Inventaire des coups — ${records} positions de test, ${moves} coups (parties jamais vues)`, '',
    'Chaque coup joué est rangé dans un tas, par priorité (voir `scripts/inventaire-coups.mjs`). « Calme » = ni prise, ni échec, ni promotion.', '',
    '## Les tas', '', `| Tas | Coups | Part de tous les coups | Part des coups calmes |`, '|---|---|---|---|'];
  for (const g of ['non calme', 'défense', 'plan', 'moyen', 'autre coup calme', 'inexpliqué']) {
    const n = groups[g] ?? 0;
    md.push(`| ${g} | ${n} | ${pct(n, all)} | ${g === 'non calme' ? '—' : pct(n, calm)} |`);
  }
  md.push('', '## Le détail', '', `| Catégorie | Coups | Part des coups calmes | ${brackets.join(' | ')} |`, `|---|---|---|${brackets.map(() => '---').join('|')}|`);
  const calmBy = Object.fromEntries(brackets.map((b) => [b, Object.entries(counts[b]).filter(([k]) => group(k) !== 'non calme').reduce((a, [, n]) => a + n, 0)]));
  for (const [k, n] of Object.entries(total).sort((x, y) => y[1] - x[1])) {
    md.push(`| ${k} | ${n} | ${group(k) === 'non calme' ? '—' : pct(n, calm)} | ${brackets.map((b) => (group(k) === 'non calme' ? '—' : pct(counts[b][k] ?? 0, calmBy[b]))).join(' | ')} |`);
  }
  md.push('', '## Lecture', '',
    '- Le tas « inexpliqué » est celui à étudier (étape 2 : regrouper par effets). Les tas « défense » et « autre coup calme »',
    '  sont explicables par des règles simples déjà disponibles, mais pas encore dits par la fiche.',
    '- Les parts par niveau disent si un tas est une affaire de débutants (coups sans but) ou de forts (préparations).');
  writeFileSync(MD, `${md.join('\n')}\n`);
  console.log(md.join('\n'));
}
