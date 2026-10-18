/**
 * Compare deux passes du tableau du filtre (même panel, profondeur ou moteur différents) : la variance des notes sur les
 * mêmes coups (le plancher de bruit) et la part des verdicts qui changent d'identité (meilleur coup, meilleur coup
 * progressant, signe de l'écart). La passe B peut être un dossier de fichiers filtre-<position>.json (nuit-stabilite.sh).
 *
 *   node scripts/plans/comparer-stabilite.mjs --a reports/plans/filtre.json --b reports/plans/stabilite/bin-stockfish-p24 [--plancher 15] [--out reports/plans/stabilite/comparaison.md]
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { enToFr } from '../../coach/notation.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const A = opt('--a', 'reports/plans/filtre.json'), B = opt('--b', null), PLANCHER = Number(opt('--plancher', 15));
const OUT = opt('--out', `${statSync(B).isDirectory() ? B : 'reports/plans/stabilite'}/comparaison.md`);
const charger = (p) => (statSync(p).isDirectory() ? readdirSync(p).filter((f) => /^filtre-.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(p, f), 'utf8'))) : JSON.parse(readFileSync(p, 'utf8')));
const fr = enToFr, fmt = (c) => (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+'));
const cle = (e) => `${e.position}|${e.libelle}`;
const notes = (e) => new Map([...e.progressants, ...e.nonProgressants].map((x) => [x.san, x.cp]));
const meilleur = (e) => [...e.progressants, ...e.nonProgressants].sort((x, y) => y.cp - x.cp)[0]?.san;

const a = new Map(charger(A).map((e) => [cle(e), e])), b = new Map(charger(B).map((e) => [cle(e), e]));
const communs = [...a.keys()].filter((k) => b.has(k));
const deltas = [], lignes = [];
let chgMeilleur = 0, chgProg = 0, chgSigne = 0, chgD0 = 0;
for (const k of communs) {
  const ea = a.get(k), eb = b.get(k), na = notes(ea), nb = notes(eb);
  for (const [san, cp] of na) if (nb.has(san)) deltas.push(Math.abs(nb.get(san) - cp));
  const ma = meilleur(ea), mb = meilleur(eb), pa = ea.progressants[0]?.san, pb = eb.progressants[0]?.san;
  const sa = ea.ecart == null ? null : Math.sign(ea.ecart) * (Math.abs(ea.ecart) > PLANCHER), sb = eb.ecart == null ? null : Math.sign(eb.ecart) * (Math.abs(eb.ecart) > PLANCHER);
  if (ma !== mb) chgMeilleur++; if (pa !== pb) chgProg++; if (sa !== sb) chgSigne++; if (ea.d0 !== eb.d0) chgD0++;
  lignes.push({ k, ma, mb, pa, pb, ea: ea.ecart, eb: eb.ecart, d: ea.d0 === eb.d0 ? '' : `${ea.d0}→${eb.d0}` });
}
deltas.sort((x, y) => x - y);
const q = (p) => deltas[Math.min(deltas.length - 1, Math.floor(p * deltas.length))] ?? 0;
const rangs = (arr) => { const tri = [...arr].map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = []; tri.forEach(([, i], j) => { r[i] = j; }); return r; };
const paires = lignes.filter((l) => l.ea != null && l.eb != null);
const ra = rangs(paires.map((l) => l.ea)), rb = rangs(paires.map((l) => l.eb));
const n = paires.length, spearman = n > 1 ? 1 - (6 * ra.reduce((s, r, i) => s + (r - rb[i]) ** 2, 0)) / (n * (n * n - 1)) : NaN;

const md = [`# Stabilité : ${A} contre ${B}`, '',
  `${communs.length} plans communs ; ${deltas.length} coups notés dans les deux passes.`, '',
  `**Variance des notes sur les mêmes coups** (|Δ| en centipions) : médiane ${q(0.5)}, 75e centile ${q(0.75)}, 90e centile ${q(0.9)}, max ${deltas[deltas.length - 1] ?? 0}. Plancher actuel : ${PLANCHER}.`, '',
  `**Verdicts qui changent d'identité** : meilleur coup ${chgMeilleur}/${communs.length}, meilleur coup progressant ${chgProg}/${communs.length}, signe de l'écart (au plancher) ${chgSigne}/${communs.length}, distance à la racine ${chgD0}/${communs.length}. Corrélation de rang des écarts (Spearman) : ${spearman.toFixed(2)}.`, '',
  '| plan | meilleur coup A → B | meilleur progressant A → B | écart A → B | d0 |', '|---|---|---|---|---|'];
for (const l of lignes) md.push(`| ${l.k} | ${fr(l.ma ?? '—')}${l.ma !== l.mb ? ` → **${fr(l.mb ?? '—')}**` : ''} | ${fr(l.pa ?? '—')}${l.pa !== l.pb ? ` → **${fr(l.pb ?? '—')}**` : ''} | ${l.ea == null ? '—' : fmt(l.ea)} → ${l.eb == null ? '—' : fmt(l.eb)} | ${l.d} |`);
writeFileSync(OUT, md.join('\n') + '\n');
console.log(md.slice(0, 5).join('\n')); console.error(`écrit : ${OUT}`);

// ── Mode test : --test <preparatoire.json A> <dossier ou json B> : statuts et Δ du test à deux demi-coups entre deux passes.
if (args.includes('--test')) {
  const i = args.indexOf('--test'); const TA = args[i + 1], TB = args[i + 2];
  const chargerT = (p) => (statSync(p).isDirectory() ? readdirSync(p).filter((f) => /^preparatoire-.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(p, f), 'utf8'))) : JSON.parse(readFileSync(p, 'utf8')));
  const k2 = (l) => `${l.pos}|${l.plan}`;
  const ta = new Map(chargerT(TA).map((l) => [k2(l), l])), tb = new Map(chargerT(TB).map((l) => [k2(l), l]));
  const com = [...ta.keys()].filter((k) => tb.has(k));
  const dM = [], dB = []; let chgStatut = 0, chgSuite = 0; const rows = [];
  for (const k of com) {
    const x = ta.get(k), y = tb.get(k);
    if (x.statut !== y.statut) chgStatut++;
    if ((x.suite ?? '') !== (y.suite ?? '')) chgSuite++;
    if (x.deltaMeme != null && y.deltaMeme != null) dM.push(Math.abs(x.deltaMeme - y.deltaMeme));
    if (x.delta != null && y.delta != null) dB.push(Math.abs(x.delta - y.delta));
    rows.push({ k, sa: x.statut, sb: y.statut, suiteA: x.suite, suiteB: y.suite, ma: x.deltaMeme, mb: y.deltaMeme, ba: x.delta, bb: y.delta });
  }
  const qq = (arr, p) => { const t = [...arr].sort((u, v) => u - v); return t[Math.min(t.length - 1, Math.floor(p * t.length))] ?? 0; };
  const f = (v) => (v == null ? '—' : fmt(v));
  const out = [`# Stabilité du test à deux demi-coups : ${TA} contre ${TB}`, '', `${com.length} lignes communes.`, '',
    `**Statut qui change** : ${chgStatut}/${com.length}. **Suite jouée (M, réponse, point calme) qui change** : ${chgSuite}/${com.length}.`,
    `**|Δ(Δ même pas)|** : médiane ${qq(dM, 0.5)}, 90e centile ${qq(dM, 0.9)}, max ${qq(dM, 1)} (${dM.length} lignes). **|Δ(Δ meilleur pas)|** : médiane ${qq(dB, 0.5)}, 90e centile ${qq(dB, 0.9)}, max ${qq(dB, 1)}.`, '',
    '| ligne | statut A → B | suite A | suite B | Δ même pas A → B | Δ meilleur pas A → B |', '|---|---|---|---|---|---|'];
  for (const r of rows.sort((u, v) => (u.sa !== u.sb ? -1 : 1) - (v.sa !== v.sb ? -1 : 1))) out.push(`| ${r.k} | ${r.sa}${r.sa !== r.sb ? ` → **${r.sb}**` : ''} | ${r.suiteA ?? '—'} | ${r.suiteA === r.suiteB ? '=' : `**${r.suiteB ?? '—'}**`} | ${f(r.ma)} → ${f(r.mb)} | ${f(r.ba)} → ${f(r.bb)} |`);
  const OUTT = opt('--out-test', `${statSync(TB).isDirectory() ? TB : 'reports/plans/stabilite'}/comparaison-test.md`);
  writeFileSync(OUTT, out.join('\n') + '\n'); console.log(out.slice(2, 6).join('\n')); console.error(`écrit : ${OUTT}`);
}
