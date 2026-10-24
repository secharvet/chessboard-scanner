/**
 * Émergence de plans (docs/PLANS-ET-CONCEPTS.md, §8) : les données proposent des plans, l'humain les nomme.
 *
 * 1. SIGNATURE d'une suite : le long de la suite, du point de vue d'un camp, la liste ordonnée des faits du moteur
 *    de règles qui APPARAISSENT (+) ou DISPARAISSENT (-), abstraits : identifiant, propriétaire (moi / lui), aile
 *    (dame a-c, centre d-e, roi f-h) ; plus quelques événements de coups (échange de pièces, levier de pions).
 * 2. MOTIFS : enchaînements ordonnés de 2 événements (e1 puis e2, à au plus WINDOW demi-coups d'écart), comptés
 *    dans les MEILLEURES suites et dans les suites au moins 0,3 pion moins bonnes des mêmes positions.
 * 3. CANDIDATS : motifs fréquents ET discriminants (présents bien plus souvent dans la meilleure suite : « lift »),
 *    avec des exemples réels. À juger sur planches.
 *
 *   node scripts/emergence.mjs data/labels/2013-01-48.jsonl [--max 3000] [--plies 30] [--window 12]
 *        [--min 25] [--top 25] [--out reports/emergence-1.md]
 *
 * Pas de Stockfish : tout vient des suites enregistrées.
 */

import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { toFrenchSan } from '../coach/notation.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const MAX = Number(opt('--max', 3000));
const PLIES = Number(opt('--plies', 30));
const WINDOW = Number(opt('--window', 12));
const MIN = Number(opt('--min', 25));
const TOP = Number(opt('--top', 25));
const OUT = opt('--out', 'reports/emergence-1.md');
const GAP = 30;

// Faits ignorés : constats globaux, matériel, tactique immédiate (ce n'est pas un plan) — et le bruit de la menace.
const SKIP = new Set(['PHASE', 'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR', 'EGALITE_MATERIEL', 'AVANTAGE_MATERIEL',
  'PIECE_MENACEE', 'FOURCHETTE', 'ENFILADE', 'CLOUAGE', 'CLOUAGE_RELATIF', 'DECOUVERTE_POSSIBLE', 'SURCHARGE',
  'PIECE_PIEGEE', 'ACTIVITE', 'DEVELOPPEMENT', 'STRUCTURE', 'CENTRE', 'PIECE_NON_DEVELOPPEE', 'DAME_SORTIE_TOT']);
const wing = (p) => {
  const f = p.file ?? (typeof p.square === 'string' ? p.square[0] : null) ?? (typeof p.files === 'string' ? p.files[0] : null);
  if (!f) return '';
  return 'abc'.includes(f) ? '·D' : 'de'.includes(f) ? '·C' : '·R';
};
/** Clé abstraite d'un fait, du point de vue de `side`. */
const key = (t, side) => `${t.id}${t.params.color ? (t.params.color === side ? ':moi' : ':lui') : ''}${wing(t.params)}`;
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9 };

/** Signature d'une suite : événements ordonnés (premier demi-coup d'occurrence), pour `side`. */
function signature(fen, pv, side) {
  const c = new Chess(fen);
  let prev = new Set(buildAllFacts(fen).filter((t) => !SKIP.has(t.id)).map((t) => key(t, side)));
  const events = new Map(); // événement -> demi-coup
  const add = (e, i) => { if (!events.has(e)) events.set(e, i); };
  let pendingCapture = null;
  for (const [i, u] of pv.slice(0, PLIES).entries()) {
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const mine = m.color === side;
    // Événements de coups : échange (prise puis reprise de valeur égale), levier (poussée qui attaque un pion).
    if (m.captured) {
      if (pendingCapture && pendingCapture.to === m.to && VALUE[pendingCapture.captured] === VALUE[m.captured]) {
        add(`ECHANGE_${pendingCapture.captured.toUpperCase()}:${pendingCapture.by === side ? 'moi' : 'lui'}`, i);
        pendingCapture = null;
      } else pendingCapture = { to: m.to, captured: m.captured, by: m.color };
    } else {
      pendingCapture = null;
      if (m.piece === 'p') {
        const dir = m.color === 'w' ? 1 : -1;
        const attacks = [-1, 1].some((d) => { const p = c.get(`${String.fromCharCode(m.to.charCodeAt(0) + d)}${Number(m.to[1]) + dir}`); return p && p.type === 'p' && p.color !== m.color; });
        if (attacks) add(`LEVIER:${mine ? 'moi' : 'lui'}${wing({ square: m.to })}`, i);
      }
    }
    const now = new Set(buildAllFacts(c.fen()).filter((t) => !SKIP.has(t.id)).map((t) => key(t, side)));
    for (const k of now) if (!prev.has(k)) add(`+${k}`, i);
    for (const k of prev) if (!now.has(k)) add(`-${k}`, i);
    prev = now;
  }
  return [...events.entries()].sort((a, b) => a[1] - b[1]);
}

/** Paires ordonnées (e1 puis e2, écart ≤ WINDOW) d'une signature. */
function pairs(sig) {
  const out = new Set();
  for (let i = 0; i < sig.length; i++) for (let j = i + 1; j < sig.length; j++) {
    if (sig[j][1] - sig[i][1] > WINDOW) break;
    // Le premier événement est une ACTION du camp (ou un fait sans camp) : « je fais X, puis Y arrive ». Les
    // motifs vus de l'autre camp sont les mêmes en miroir : on ne les compte pas deux fois.
    if (sig[j][1] > sig[i][1] && !sig[i][0].includes(':lui')) out.add(`${sig[i][0]} → ${sig[j][0]}`);
  }
  return out;
}

const best = new Map(); // motif -> { n, ex: [] }
const worse = new Map(); // motif -> n
let nBest = 0;
let nWorse = 0;
let n = 0;
const bump = (map, k) => map.set(k, (map.get(k) ?? 0) + 1);
for await (const line of createInterface({ input: createReadStream(args[0]), crlfDelay: Infinity })) {
  if (!line || n >= MAX) continue;
  const r = JSON.parse(line);
  if (!r.pvs || !r.ext) continue;
  const worseIdx = r.pvs.slice(1).map((_, i) => i + 1).filter((i) => r.evals[0] - r.evals[i] >= GAP);
  if (!worseIdx.length) continue; // sans suite nettement moins bonne, pas de contraste possible
  n++;
  for (const side of ['w', 'b']) {
    const sb = signature(r.fen, r.pvs[0], side);
    const pb = pairs(sb);
    nBest++;
    for (const k of pb) {
      const e = best.get(k) ?? { n: 0, ex: [] };
      e.n++;
      if (e.ex.length < 3) e.ex.push({ fen: r.fen, side, pv: r.pvs[0], sig: sb });
      best.set(k, e);
    }
    for (const i of worseIdx) {
      nWorse++;
      for (const k of pairs(signature(r.fen, r.pvs[i], side))) bump(worse, k);
    }
  }
  if (n % 250 === 0) console.error(`${n} positions, ${best.size} motifs`);
}

// Motifs fréquents et discriminants : lift = fréquence dans les meilleures / fréquence dans les moins bonnes.
const scored = [...best.entries()].filter(([, e]) => e.n >= MIN).map(([k, e]) => {
  const fb = e.n / nBest;
  const fw = ((worse.get(k) ?? 0) + 1) / (nWorse + 1);
  return { k, n: e.n, nw: worse.get(k) ?? 0, lift: fb / fw, ex: e.ex };
}).sort((a, b) => b.lift - a.lift);

const san = (fen, pv, upto) => {
  const c = new Chess(fen);
  const out = [];
  for (const u of pv.slice(0, upto + 1)) { try { out.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } }
  return out.join(' ');
};
const md = [`# Émergence, série 1 — ${n} positions, ${nBest} signatures de meilleures suites, ${nWorse} de suites moins bonnes`, '',
  `Motif = « événement 1 puis événement 2 » (écart ≤ ${WINDOW} demi-coups), du point de vue d'un camp (moi / lui ; ·D aile dame, ·C centre, ·R aile roi).`,
  `Lift = fréquence dans les meilleures suites ÷ fréquence dans les suites au moins 0,3 pion moins bonnes. Support minimal ${MIN}.`, ''];
md.push('| # | Motif | Meilleures | Moins bonnes | Lift |', '|---|---|---|---|---|');
scored.slice(0, TOP).forEach((s, i) => md.push(`| ${i + 1} | ${s.k} | ${s.n} | ${s.nw} | ${s.lift.toFixed(1)} |`));
md.push('', '## Exemples', '');
scored.slice(0, TOP).forEach((s, i) => {
  md.push(`### ${i + 1}. ${s.k}`, '');
  for (const ex of s.ex) {
    const [e1, e2] = s.k.split(' → ');
    const p2 = ex.sig.find(([e]) => e === e2)?.[1] ?? 6;
    md.push(`- ${ex.side === 'w' ? 'Blancs' : 'Noirs'} — \`${ex.fen}\` — ${san(ex.fen, ex.pv, p2)}`);
    md.push(`  - signature : ${ex.sig.filter(([, p]) => p <= p2).map(([e, p]) => `${e}@${p + 1}`).join(', ')}`);
    void e1;
  }
  md.push('');
});
md.push('## Les plus fréquents (sans tenir compte du lift)', '', '| Motif | Meilleures | Moins bonnes | Lift |', '|---|---|---|---|');
[...scored].sort((a, b) => b.n - a.n).slice(0, 15).forEach((s) => md.push(`| ${s.k} | ${s.n} | ${s.nw} | ${s.lift.toFixed(1)} |`));
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(`${scored.length} motifs (support ≥ ${MIN}) -> ${OUT}`);
