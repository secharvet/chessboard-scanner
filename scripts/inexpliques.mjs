/**
 * Étape 2 de l'inventaire du vocabulaire (1er octobre 2026) : les coups INEXPLIQUÉS (scripts/inventaire-coups.mjs)
 * sont regroupés par leurs EFFETS, pas par leur apparence, pour faire apparaître des concepts candidats :
 *   menace        après le coup, une pièce adverse est en prise qui ne l'était pas (attaque simple)
 *   attaque       la pièce jouée attaque une pièce adverse nouvelle (défendue : pression, pas menace)
 *   défend        la pièce jouée défend une pièce à moi qu'elle ne défendait pas
 *   libère        une autre de mes pièces à longue portée gagne au moins 3 cases (le coup dégage une ligne)
 *   case_reprise  dans les 6 demi-coups, une autre de mes pièces vient sur la case quittée (le coup libère une case)
 *   vers_roi      la pièce se rapproche du roi adverse (distance ≤ 3 à l'arrivée, moindre qu'au départ)
 *   centralise    arrivée dans le carré c3-f6, départ hors de ce carré
 *   recule        la pièce revient vers ma première rangée
 *   prend_ensuite la même pièce prend quelque chose dans les 6 demi-coups
 *   suivi:<x>     premier atome ou plan de mon camp dans les 12 demi-coups suivants (ce que le coup prépare)
 * Chaque coup inexpliqué reçoit une signature (pièce + effets) ; on compte les signatures, par niveau, avec le
 * changement d'évaluation à la fin de la fenêtre, et on garde des exemples pour les planches.
 *
 *   node scripts/inexpliques.mjs data/labels/human-2013-01.s0.v2.jsonl [--out reports/inexpliques-<fichier>.json]
 * Fusion : node scripts/inexpliques.mjs --merge reports/inexpliques-*.json [--md reports/inexpliques.md] [--top 30]
 */

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { crc32 } from 'node:zlib';
import { scanLine } from '../coach/plan-concepts.mjs';
import { classify, enPrise, CONCEPTS } from '../coach/move-class.mjs';
import { toFrenchSan } from '../coach/notation.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const BR = [['< 1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000 +', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? 'inconnu';
const COUNTED = 6;
const EXAMPLES = 12;
const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
// Effet PRINCIPAL d'un coup : le premier de cette liste parmi ses effets (les signatures complètes éclatent en
// milliers de groupes d'un coup ; l'essai sur 400 positions donnait 38 groupes pour 39 coups).
const PRIORITY = ['menace', 'attaque', 'défend', 'libère', 'case_reprise', 'vers_roi', 'centralise', 'recule', 'prend_ensuite'];

const flip = (fen) => { const p = fen.split(' '); p[1] = p[1] === 'w' ? 'b' : 'w'; p[3] = '-'; return p.join(' '); };
const dist = (a, b) => Math.max(Math.abs(a.charCodeAt(0) - b.charCodeAt(0)), Math.abs(Number(a[1]) - Number(b[1])));
const central = (sq) => 'cdef'.includes(sq[0]) && '3456'.includes(sq[1]);

if (args.includes('--merge')) merge();
else await run();

/** Effets d'un coup calme `m` joué depuis `before` (Chess avant), `after` (Chess après), coups suivants `next` (verbose). */
function effects(before, after, m, next, scan, atoms, i) {
  const color = m.color;
  const opp = color === 'w' ? 'b' : 'w';
  const out = [];
  // Menace : une pièce adverse en prise après, qui ne l'était pas avant.
  const oppBefore = enPrise(before, opp);
  const oppAfter = enPrise(after, opp);
  if ([...oppAfter.entries()].some(([sq, v]) => v.hanging && !oppBefore.get(sq)?.hanging)) out.push('menace');
  else {
    // Attaque nouvelle (pression sur une pièce défendue) : cibles de la pièce jouée, avant / après.
    let mine;
    try { mine = new Chess(flip(after.fen())); } catch { mine = null; }
    if (mine) {
      const targets = (c, sq) => new Set(c.moves({ square: sq, verbose: true }).filter((x) => x.captured).map((x) => x.to));
      const tb = targets(before, m.from);
      const ta = targets(mine, m.to);
      if ([...ta].some((sq) => !tb.has(sq))) out.push('attaque');
      // Libère : une autre pièce à longue portée gagne ≥ 3 cases.
      const mob = (c) => { const r = {}; for (const x of c.moves({ verbose: true })) r[x.from] = (r[x.from] ?? 0) + 1; return r; };
      const mb = mob(before);
      const ma = mob(mine);
      if (before.board().flat().some((p) => p && p.color === color && 'bqr'.includes(p.type) && p.square !== m.from && (ma[p.square] ?? 0) - (mb[p.square] ?? 0) >= 3)) out.push('libère');
    }
  }
  // Défend : la pièce jouée défend une pièce à moi (pas le roi) qu'elle ne défendait pas.
  for (const p of after.board().flat()) {
    if (!p || p.color !== color || p.type === 'k' || p.square === m.to) continue;
    if (after.attackers(p.square, color).includes(m.to) && !before.attackers(p.square, color).includes(m.from)) { out.push('défend'); break; }
  }
  const king = after.board().flat().find((p) => p && p.type === 'k' && p.color === opp)?.square;
  if (king && dist(m.to, king) <= 3 && dist(m.to, king) < dist(m.from, king)) out.push('vers_roi');
  if (central(m.to) && !central(m.from)) out.push('centralise');
  const rel = (sq) => (color === 'w' ? Number(sq[1]) : 9 - Number(sq[1]));
  if (rel(m.to) < rel(m.from)) out.push('recule');
  // Suite : la case quittée reprise par une autre de mes pièces ; la même pièce prend ; premier atome/plan de mon camp.
  let sq = m.to;
  let took = false;
  let reused = false;
  for (const [k, x] of next.entries()) {
    if (x.color === color) {
      if (x.from === sq) { sq = x.to; if (x.captured && k < 6) took = true; }
      else if (x.to === m.from && k < 6) reused = true;
    } else if (x.to === sq) break; // ma pièce est prise
  }
  if (reused) out.push('case_reprise');
  if (took) out.push('prend_ensuite');
  let follow = null;
  for (let k = i + 1; k <= i + 12 && !follow; k++) {
    const a = atoms.find((x) => x.side === color && x.ply === k && !['echange', 'perte'].includes(x.kind));
    if (a) follow = a.kind;
    for (const c of CONCEPTS) if (scan[`${c}_${color}`] === k) follow = c;
  }
  if (follow) out.push(`suivi:${follow}`);
  return out;
}

async function run() {
  const IN = args.find((a) => !a.startsWith('--') && a.endsWith('.jsonl'));
  const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
  const OUT = opt('--out', `reports/inexpliques-${IN.split('/').pop().replace(/\.jsonl$/, '')}.json`);
  const MAX = Number(opt('--max', 0));
  const groups = {}; // signature -> { n, byBracket, deltaSum, deltaN, flags, examples }
  const flagTotals = {};
  let records = 0;
  let unexplained = 0;
  const t0 = Date.now();
  for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue;
    records++;
    if (MAX && records > MAX) break;
    const scan = scanLine(r.fen, r.played, r.played.length);
    const atoms = scan.atomes ?? [];
    const c = new Chess(r.fen);
    const verbose = [];
    const fens = [r.fen];
    for (const u of r.played) { try { verbose.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); fens.push(c.fen()); } catch { break; } }
    const last = fens.length - 1;
    const eEnd = r.evals?.[String(last)] ?? r.evals?.[String(r.played.length - 1)] ?? null;
    for (let i = 0; i < Math.min(COUNTED, verbose.length); i++) {
      const m = verbose[i];
      const before = new Chess(fens[i]);
      const inCheckBefore = before.inCheck();
      const prise = enPrise(before, m.color);
      const after = new Chess(fens[i + 1]);
      const cat = classify(after, m, i, scan, atoms, inCheckBefore, prise);
      if (!cat.startsWith('inexpliqué')) continue;
      unexplained++;
      const fl = effects(before, after, m, verbose.slice(i + 1), scan, atoms, i);
      const primary = PRIORITY.find((f) => fl.includes(f)) ?? (fl.find((f) => f.startsWith('suivi:')) ? 'seulement une suite' : 'aucun effet relevé');
      const sig = `${NAME[m.piece]} | ${primary}`;
      const g = (groups[sig] ??= { n: 0, byBracket: {}, deltaSum: 0, deltaN: 0, follow: {}, examples: [] });
      g.n++;
      const fw = fl.find((f) => f.startsWith('suivi:'));
      g.follow[fw ? fw.slice(6) : 'rien'] = (g.follow[fw ? fw.slice(6) : 'rien'] ?? 0) + 1;
      const b = bracket(r.elo?.[m.color] ?? -1);
      g.byBracket[b] = (g.byBracket[b] ?? 0) + 1;
      for (const f of fl) flagTotals[f] = (flagTotals[f] ?? 0) + 1;
      if (eEnd !== null && r.eval0 !== undefined) { g.deltaSum += (m.color === 'w' ? 1 : -1) * (eEnd - r.eval0); g.deltaN++; }
      if (g.examples.length < EXAMPLES) {
        g.examples.push({ fen: fens[i], san: toFrenchSan(m.san), effets: fl, elo: r.elo?.[m.color] ?? null, lot, game: r.game, ply: r.ply + i,
          next: verbose.slice(i + 1, i + 13).map((x) => toFrenchSan(x.san)).join(' ') });
      }
    }
    if (records % 5000 === 0) console.log(`${records} positions, ${unexplained} coups inexpliqués, ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  writeFileSync(OUT, JSON.stringify({ lot, file: IN, records, unexplained, flagTotals, groups }, null, 1));
  console.log(JSON.stringify({ records, unexplained, groups: Object.keys(groups).length }));
  console.log('TERMINÉ');
}

function merge() {
  const files = args.filter((a) => a.endsWith('.json'));
  const MD = opt('--md', 'reports/inexpliques.md');
  const TOP = Number(opt('--top', 30));
  const groups = {};
  const flagTotals = {};
  let records = 0;
  let unexplained = 0;
  for (const f of files) {
    const d = JSON.parse(readFileSync(f, 'utf8'));
    records += d.records;
    unexplained += d.unexplained;
    for (const [k, n] of Object.entries(d.flagTotals)) flagTotals[k] = (flagTotals[k] ?? 0) + n;
    for (const [sig, g] of Object.entries(d.groups)) {
      const t = (groups[sig] ??= { n: 0, byBracket: {}, deltaSum: 0, deltaN: 0, follow: {}, examples: [] });
      t.n += g.n;
      for (const [k, n] of Object.entries(g.follow ?? {})) t.follow[k] = (t.follow[k] ?? 0) + n;
      t.deltaSum += g.deltaSum;
      t.deltaN += g.deltaN;
      for (const [b, n] of Object.entries(g.byBracket)) t.byBracket[b] = (t.byBracket[b] ?? 0) + n;
      for (const e of g.examples) if (t.examples.length < EXAMPLES) t.examples.push(e);
    }
  }
  const brackets = BR.map(([b]) => b);
  const pct = (n, d) => `${(100 * n / d).toFixed(1)} %`;
  const sorted = Object.entries(groups).sort((a, b) => b[1].n - a[1].n);
  const md = [`# Coups inexpliqués regroupés par effets — ${unexplained} coups sur ${records} positions de test`, '',
    'Un coup inexpliqué = calme, pas une défense, pas un plan ni un atome connus, pas un développement ni un coup de pion',
    '(`scripts/inventaire-coups.mjs`). Signature = pièce + effets relevés (`scripts/inexpliques.mjs`).', '',
    '## Les effets, un par un (un coup peut en avoir plusieurs)', '', '| Effet | Coups | Part des inexpliqués |', '|---|---|---|'];
  for (const [k, n] of Object.entries(flagTotals).sort((a, b) => b[1] - a[1])) md.push(`| ${k} | ${n} | ${pct(n, unexplained)} |`);
  const none = groups[Object.keys(groups).find((k) => k.endsWith('aucun effet relevé'))];
  const noneTotal = sorted.filter(([k]) => k.endsWith('aucun effet relevé')).reduce((a, [, g]) => a + g.n, 0);
  md.push(`| (aucun effet relevé) | ${noneTotal} | ${pct(noneTotal, unexplained)} |`, '',
    `## Les ${TOP} signatures les plus fréquentes`, '',
    `| # | Pièce, effet principal | Coups | Part | ${brackets.join(' | ')} | Δ éval fin de fenêtre (pions) | Ce qui suit le plus souvent (12 demi-coups) |`, `|---|---|---|---|${brackets.map(() => '---').join('|')}|---|---|`);
  sorted.slice(0, TOP).forEach(([sig, g], k) => {
    const d = g.deltaN ? (g.deltaSum / g.deltaN / 100).toFixed(2) : '—';
    const tot = Math.max(1, Object.values(g.byBracket).reduce((a, x) => a + x, 0));
    const follow = Object.entries(g.follow).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, n]) => `${f} ${pct(n, g.n)}`).join(', ');
    md.push(`| ${k + 1} | ${sig} | ${g.n} | ${pct(g.n, unexplained)} | ${brackets.map((b) => pct(g.byBracket[b] ?? 0, tot)).join(' | ')} | ${d} | ${follow} |`);
  });
  md.push('', '## Exemples (pour les planches)', '');
  sorted.slice(0, TOP).forEach(([sig, g], k) => {
    md.push(`### ${k + 1}. ${sig} (${g.n} coups)`, '');
    for (const e of g.examples.slice(0, 5)) md.push(`- ${e.san} (Elo ${e.elo ?? '?'} ; effets : ${(e.effets ?? []).join(', ') || 'aucun'}) — \`${e.fen}\` — suite : ${e.next}`);
    md.push('');
  });
  writeFileSync(MD, `${md.join('\n')}\n`);
  writeFileSync(MD.replace(/\.md$/, '.json'), JSON.stringify({ records, unexplained, flagTotals, groups: Object.fromEntries(sorted) }, null, 1));
  console.log(md.slice(0, 60).join('\n'));
  if (none) console.log(`(aucun effet) exemples : ${none.examples.slice(0, 3).map((e) => `${e.san} ${e.fen}`).join(' | ')}`);
}
