#!/usr/bin/env node
/**
 * Taux de passage du critère du faisceau sous perturbations (GE, 19 oct.) : lit plusieurs dossiers de passe (un par tirage :
 * profondeur × table vidée/gardée), recompte le critère automatique par position depuis les JSON (même règle que
 * faisceau.mjs : aucun plan non canonique réalisé ne bat le meilleur canonique réalisé de plus du plancher) et publie la
 * matrice positions × tirages, le nombre de positions réussies par tirage, le taux de passage (≥ 7/10) et, par plan, le
 * nombre de phrases distinctes observées.
 *   node scripts/plans/taux-de-passage.mjs [--plancher 25] [--seuil 7] [--positions scripts/plans/positions-filtre.mjs] <dossier=étiquette> ...
 * `--positions` : re-désigne les plans canoniques depuis le module de positions (désignations v2 du 19 oct.) au lieu du
 * drapeau enregistré dans les JSON ; le drapeau ne sert qu'au compte, jamais à la mesure, donc le recompte vaut sur les
 * passes existantes. Une position dont tous les plans sont canoniques est inéligible (rien à contraster).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const PLANCHER = Number(opt('--plancher', 25)), SEUIL = Number(opt('--seuil', 7)), POSITIONS = opt('--positions', null);
const dossiers = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))).map((a) => { const [d, e] = a.split('='); return { d, e: e ?? d.split('/').pop() }; });
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
/** Canon par position depuis le module : { id → Set(libellés canoniques) }, ou null (drapeau des JSON). */
let canon = null;
if (POSITIONS) {
  const { POSITIONS: P } = await import(pathToFileURL(resolve(POSITIONS)).href);
  const { Chess } = await import('chess.js');
  const { libelle } = await import('../../coach/plan-distance.mjs');
  canon = Object.fromEntries(P.map((p) => { const g = new Chess(); for (const m of p.coups.split(' ')) g.move(m); const fen = g.fen(); return [p.id, new Set((p.canoniques ?? []).map((i) => libelle(p.plans[i], fen)))]; }));
}
const lire = (d) => Object.fromEntries(readdirSync(d).filter((f) => /^faisceau-.*\.json$/.test(f)).map((f) => { const id = f.replace(/^faisceau-|\.json$/g, ''); const rs = JSON.parse(readFileSync(`${d}/${f}`, 'utf8')); return [id, canon?.[id] ? rs.map((r) => ({ ...r, canonique: canon[id].has(r.libelle) })) : rs]; }));
/** Le critère d'une position : { reussi, can, non, marge } ; null si la position n'a pas de plan non canonique (inéligible). */
function critere(rs) {
  if (!rs.some((r) => !r.canonique)) return null;
  const ok = rs.filter((r) => r.tempo != null && r.prix != null);
  const can = ok.filter((r) => r.canonique).sort((a, b) => a.prix - b.prix)[0], non = ok.filter((r) => !r.canonique).sort((a, b) => a.prix - b.prix)[0];
  if (!can) return { reussi: false, can: null, non, marge: null };
  const marge = non ? can.prix - non.prix : -Infinity;
  return { reussi: marge <= PLANCHER, can, non, marge };
}
const passes = dossiers.map(({ d, e }) => ({ e, j: lire(d) }));
const ids = [...new Set(passes.flatMap((p) => Object.keys(p.j)))].sort();
const md = [`# Taux de passage du critère — ${passes.length} tirages, plancher ${PLANCHER}, passage à ≥ ${SEUIL} positions réussies`, ''];
md.push(`| position | ${passes.map((p) => p.e).join(' | ')} | réussie dans |`, `|---|${passes.map(() => '---').join('|')}|---|`);
const parTirage = passes.map(() => 0);
for (const id of ids) {
  const cells = passes.map((p, k) => { const rs = p.j[id]; if (!rs) return '(absent)'; const c = critere(rs); if (!c) return 'inéligible'; if (c.reussi) parTirage[k]++; return c.reussi ? `réussi` : (c.can ? `**raté** ${fmt(c.marge)}` : '**aucun canonique**'); });
  const n = cells.filter((x) => x === 'réussi').length, m = cells.filter((x) => x !== '(absent)' && x !== 'inéligible').length;
  md.push(`| ${id} | ${cells.join(' | ')} | ${n}/${m} |`);
}
md.push(`| **réussies** | ${parTirage.map((n) => `**${n}**`).join(' | ')} | |`, '');
const passages = parTirage.filter((n) => n >= SEUIL).length;
md.push(`**Taux de passage : ${passages}/${passes.length} tirages** à ≥ ${SEUIL} positions réussies (${parTirage.join(', ')}).`, '');
// Stabilité des phrases et des prix par plan
md.push('## Phrases et prix par plan selon le tirage', '', `| position | plan | ${passes.map((p) => p.e).join(' | ')} | phrases distinctes | étendue des prix |`, `|---|---|${passes.map(() => '---').join('|')}|---|---|`);
let plans = 0, stables = 0;
for (const id of ids) {
  const base = passes.find((p) => p.j[id])?.j[id] ?? [];
  base.forEach((r, i) => {
    const cells = passes.map((p) => p.j[id]?.[i]); const phrases = new Set(cells.filter(Boolean).map((x) => x.phrase)); const prix = cells.filter((x) => x && x.prix != null).map((x) => x.prix);
    plans++; if (phrases.size === 1) stables++;
    md.push(`| ${id} | ${r.libelle} | ${cells.map((x) => (x ? `${x.phrase} ${fmt(x.prix)}` : '—')).join(' | ')} | ${phrases.size} | ${prix.length ? fmt(Math.max(...prix) - Math.min(...prix)) : '—'} |`);
  });
}
md.push('', `Plans à phrase stable sur tous les tirages : **${stables}/${plans}**.`, '');
process.stdout.write(md.join('\n'));
