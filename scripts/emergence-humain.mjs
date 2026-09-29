/**
 * Émergence sur les parties humaines (docs/PLANS-ET-CONCEPTS.md, §8 et §3 bis) : quels enchaînements
 * « moyen → moyen » et « moyen → déséquilibre » les joueurs répètent-ils, à quel niveau, et avec quel effet sur
 * l'évaluation ? Les atomes (coach/atoms.mjs) et les apparitions de concepts sont relevés par label-human.mjs.
 *
 * Signature d'un camp dans une position : la liste ordonnée de ses atomes (échange fou-contre-cavalier, levier à
 * l'aile dame, manœuvre de cavalier, doublement…) et des concepts qu'il réalise (rupture, avant-poste…).
 * Motif : deux événements ordonnés (écart ≤ WINDOW demi-coups). Pour chaque motif : support par tranche d'Elo,
 * et dérive médiane de l'évaluation du camp sur la fenêtre (24 demi-coups), comparée à la dérive de référence de
 * la tranche (témoin : toutes les demi-positions de la tranche). Aucun moteur.
 *
 *   node scripts/emergence-humain.mjs data/labels/human-2013-01.s*.jsonl [--min 80] [--top 30] [--window 12]
 *        [--out reports/emergence-humain-1.md]
 */

import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { toFrenchSan } from '../coach/notation.mjs';
import { RECETTES, containsRecipe, nameMotif } from '../coach/recettes.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const MIN = Number(opt('--min', 80));
const TOP = Number(opt('--top', 30));
const WINDOW = Number(opt('--window', 12));
const OUT = opt('--out', 'reports/emergence-humain-1.md');
const files = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const BR = [['<1200', 0, 1200], ['1200-1600', 1200, 1600], ['1600-2000', 1600, 2000], ['2000+', 2000, 9999]];
const bracket = (elo) => BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0] ?? null;
const wing = (file) => ('abc'.includes(file) ? 'D' : 'de'.includes(file) ? 'C' : 'R');
const P = { p: 'P', n: 'C', b: 'F', r: 'T', q: 'D', k: 'R' };

/** Libellé abstrait d'un atome (sans cases précises). */
function label(a) {
  switch (a.kind) {
    case 'echange': return `échange ${P[a.gives]}x${P[a.takes]}`;
    case 'levier': return `levier·${wing(a.file)}`;
    case 'espace': return `espace·${wing(a.file)}`;
    case 'manoeuvre': return `manœuvre ${P[a.piece]}`;
    case 'doublement': return `doublement (${a.axis})`;
    case 'septieme': return 'tour 7e';
    case 'roque': return a.long ? 'grand roque' : 'petit roque';
    case 'marche_roi': return 'marche du roi';
    case 'perte': return 'perte de pion';
    default: return a.kind;
  }
}

const med = (arr) => { if (!arr.length) return null; const s = [...arr].sort((x, y) => x - y); return s[s.length >> 1]; };
const motifs = new Map(); // motif -> { n, byBr: {br: n}, drift: [], ex: [] }
// Couverture du catalogue : combien de demi-positions contiennent chaque recette de la théorie, par tranche.
const coverage = new Map(RECETTES.map((r) => [r.nom, { byBr: {}, drift: [] }]));
const halfByBr = {};
const base = {}; // br -> drifts
let n = 0;
for (const file of files) {
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (!r.atomes) continue; // enregistrements d'avant les atomes
    n++;
    const last = Math.max(...Object.keys(r.evals).map(Number));
    for (const side of ['w', 'b']) {
      const br = bracket(r.elo?.[side] ?? -1);
      if (!br || r.evals[last] == null) continue;
      const drift = (side === 'w' ? 1 : -1) * (r.evals[last] - r.eval0);
      (base[br] ??= []).push(drift);
      // Les événements de l'ADVERSAIRE sont dans la même chronologie, préfixés « lui : » : un motif
      // « lui : levier·R → échange CxC » est une RÉPONSE (défense, contre-attaque), pas un plan isolé.
      const opp = side === 'w' ? 'b' : 'w';
      const ev = [
        ...r.atomes.filter((a) => a.side === side).map((a) => [a.ply, label(a)]),
        ...r.plans.filter((p) => p.side === side && p.quiet).map((p) => [p.appear, `→ ${p.concept}`]),
        ...r.atomes.filter((a) => a.side === opp).map((a) => [a.ply, `lui : ${label(a)}`]),
        ...r.plans.filter((p) => p.side === opp && p.quiet).map((p) => [p.appear, `lui : → ${p.concept}`]),
      ].sort((a, b) => a[0] - b[0]);
      halfByBr[br] = (halfByBr[br] ?? 0) + 1;
      const labels = ev.map((e) => e[1]);
      for (const rec of RECETTES) if (containsRecipe(rec, labels)) { const c = coverage.get(rec.nom); c.byBr[br] = (c.byBr[br] ?? 0) + 1; c.drift.push(drift); }
      const seen = new Set();
      for (let i = 0; i < ev.length; i++) for (let j = i + 1; j < ev.length; j++) {
        if (ev[j][0] - ev[i][0] > WINDOW) break;
        if (ev[j][0] <= ev[i][0] || ev[i][1] === ev[j][1]) continue;
        // On garde : mes enchaînements, et « lui : X → moi : Y » (réponses). Pas « moi → lui » ni « lui → lui ».
        if (ev[j][1].startsWith('lui : ')) continue;
        const k = `${ev[i][1]} → ${ev[j][1]}`;
        if (seen.has(k)) continue;
        seen.add(k);
        const m = motifs.get(k) ?? { n: 0, byBr: {}, drift: [], ex: [] };
        m.n++;
        m.byBr[br] = (m.byBr[br] ?? 0) + 1;
        m.drift.push(drift);
        if (m.ex.length < 2) m.ex.push({ fen: r.fen, side, elo: r.elo[side], upto: ev[j][0], played: r.played });
        motifs.set(k, m);
      }
    }
  }
}
const baseMed = Object.fromEntries(Object.entries(base).map(([b, d]) => [b, med(d)]));
const allBase = med(Object.values(base).flat());
const rows = [...motifs.entries()].filter(([, m]) => m.n >= MIN).map(([k, m]) => ({ k, ...m, med: med(m.drift), gain: med(m.drift) - allBase }));
const san = (fen, played, upto) => { const c = new Chess(fen); const out = []; for (const u of played.slice(0, upto + 1)) { try { out.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } } return out.join(' '); };
const fmt = (s) => rows.length && s.map((r) => `| ${r.k} | ${r.n} | ${BR.map(([b]) => r.byBr[b] ?? 0).join(' / ')} | ${r.med} | ${r.gain >= 0 ? '+' : ''}${r.gain} |`);
const md = [`# Émergence sur les parties humaines — ${n} positions avec atomes`, '',
  `Motif = « événement, puis événement » du même camp (écart ≤ ${WINDOW} demi-coups). Support par tranche d'Elo (<1200 / 1200-1600 / 1600-2000 / 2000+).`,
  `Δ24 = dérive médiane de l'évaluation du camp sur la fenêtre (centipions) ; référence toutes positions : ${allBase} (par tranche : ${BR.map(([b]) => `${b} ${baseMed[b] ?? '—'}`).join(', ')}).`,
  'Le Δ mesure le joueur autant que le plan (§9) : à lire comme un indice, pas comme une preuve.', '',
  `## Les plus fréquents (support ≥ ${MIN})`, '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt([...rows].sort((a, b) => b.n - a.n).slice(0, TOP)), '',
  '## Recettes : un moyen, puis un déséquilibre (« → concept »)', '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt(rows.filter((r) => r.k.includes(' → → ') || /^(?!→).* → → /.test(r.k) || (/ → → /.test(r.k))).slice(0, 0)),
  ...fmt(rows.filter((r) => !r.k.startsWith('→') && r.k.split(' → ').slice(1).join(' → ').startsWith('→')).sort((a, b) => b.n - a.n).slice(0, TOP)), '',
  '## Les plus payants (Δ24 le plus au-dessus de la référence, support ≥ ' + MIN * 2 + ')', '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt(rows.filter((r) => r.n >= MIN * 2).sort((a, b) => b.gain - a.gain).slice(0, TOP)), '',
  '## Les plus coûteux', '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt(rows.filter((r) => r.n >= MIN * 2).sort((a, b) => a.gain - b.gain).slice(0, 15)), '', '## Exemples des recettes les plus fréquentes', ''];
for (const r of rows.filter((r) => !r.k.startsWith('→') && r.k.split(' → ').slice(1).join(' → ').startsWith('→')).sort((a, b) => b.n - a.n).slice(0, 12)) {
  md.push(`### ${r.k} (n = ${r.n})`);
  for (const e of r.ex) md.push(`- ${e.side === 'w' ? 'Blancs' : 'Noirs'} ${e.elo} Elo — \`${e.fen}\` — ${san(e.fen, e.played, e.upto)}`);
  md.push('');
}
// ── Nommer les motifs : reconnus dans le catalogue, variantes proches, inconnus ──
const splitMotif = (k) => {
  // « X → → concept » : le second élément est un déséquilibre (libellé « → concept ») ; « lui : → concept » possible.
  const m = k.match(/^(.*?) → (→ .*|lui : → .*|.*)$/);
  return m ? [m[1], m[2]] : k.split(' → ');
};
const named = rows.filter((r) => r.n >= MIN * 2).map((r) => {
  const [a, b] = splitMotif(r.k);
  return { ...r, a, b, ...nameMotif(a, b) };
});
const skipTrivial = (r) => !/perte de pion/.test(r.k) && !(/^levier/.test(r.a) && r.b === 'échange PxP');
const reactions = rows.filter((r) => r.k.startsWith('lui : ') && !/perte de pion/.test(r.k));
md.push('## Réponses : « lui fait X, puis je fais Y » (défense, contre-attaque)', '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt([...reactions].sort((a, b) => b.n - a.n).slice(0, 25)), '',
  '### Les réponses les plus payantes (support ≥ ' + MIN * 2 + ')', '', '| Motif | n | par Elo | Δ24 méd. | vs réf. |', '|---|---|---|---|---|',
  ...fmt(reactions.filter((r) => r.n >= MIN * 2).sort((a, b) => b.gain - a.gain).slice(0, 20)), '');
md.push('## Motifs reconnus dans le catalogue de la théorie', '', '| Motif | n | Δ24 vs réf. | Plan nommé (source) |', '|---|---|---|---|');
for (const r of named.filter((x) => x.exact.length && skipTrivial(x)).sort((x, y) => y.n - x.n).slice(0, 25)) md.push(`| ${r.k} | ${r.n} | ${r.gain >= 0 ? '+' : ''}${r.gain} | ${r.exact.map((e) => `${e.nom} (${e.source})`).join(' ; ')} |`);
md.push('', '## Motifs sans nom : variantes proches d\'un plan connu', '', '| Motif | n | Δ24 vs réf. | Plus proches voisins |', '|---|---|---|---|');
for (const r of named.filter((x) => !x.exact.length && x.proches.length && skipTrivial(x)).sort((x, y) => y.gain - x.gain).slice(0, 20)) md.push(`| ${r.k} | ${r.n} | ${r.gain >= 0 ? '+' : ''}${r.gain} | ${r.proches.map((p) => `${p.nom} (${p.commun}/2)`).join(' ; ')} |`);
md.push('', '## Motifs sans rien de proche (candidats nouveaux)', '', '| Motif | n | Δ24 vs réf. |', '|---|---|---|');
for (const r of named.filter((x) => !x.exact.length && !x.proches.length && skipTrivial(x)).sort((x, y) => y.n - x.n).slice(0, 15)) md.push(`| ${r.k} | ${r.n} | ${r.gain >= 0 ? '+' : ''}${r.gain} |`);
md.push('', '## Les plans des livres que les humains jouent, par niveau', '', `Part des demi-positions contenant la recette (${BR.map(([b]) => `${b} : ${halfByBr[b] ?? 0}`).join(', ')}).`, '',
  '| Plan (source) | Niveau supposé | ' + BR.map(([b]) => b).join(' | ') + ' | Δ24 méd. |', '|---|---|' + BR.map(() => '---').join('|') + '|---|');
for (const rec of RECETTES) {
  const c = coverage.get(rec.nom);
  const tot = Object.values(c.byBr).reduce((x, y) => x + y, 0);
  if (!tot) continue;
  md.push(`| ${rec.nom} (${rec.source}) | ${rec.niveau} | ${BR.map(([b]) => (halfByBr[b] ? `${(100 * (c.byBr[b] ?? 0) / halfByBr[b]).toFixed(1)} %` : '—')).join(' | ')} | ${med(c.drift)} |`);
}
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(`${rows.length} motifs (support ≥ ${MIN}) sur ${n} positions -> ${OUT}`);
