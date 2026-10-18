/**
 * Tableau du filtre de compatibilité, à la profondeur 1, sur les positions de positions-filtre.mjs : pour chaque
 * plan, la distance à la racine, les coups qui la réduisent (progressants) avec leur note moteur, le meilleur
 * coup non progressant et l'écart qui le « force ». Pas de recherche, pas de prix : un tableau qu'un œil humain
 * lit en une page pour juger si le filtre a le bon goût. Et, à la fin, la distribution des écarts.
 *
 *   node scripts/plans/filtre.mjs [--depth 18] [--seulement id] [--out reports/plans/filtre.md]
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { distance, suivre, libelle } from '../../coach/plan-distance.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { POSITIONS } from './positions-filtre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEPTH = Number(opt('--depth', 18));
const SEUL = opt('--seulement', null);
const OUT = opt('--out', 'reports/plans/filtre.md');

const cp = (score) => (score.type === 'mate' ? (score.value > 0 ? 10000 - score.value : -10000 - score.value) : score.value);
const fmt = (c) => (c >= 9000 ? '#' : c <= -9000 ? '-#' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const fr = (san) => enToFr(san);
const dd = (d) => (d === Infinity ? '∞' : String(d));

const engine = new UciEngine({ threads: 3, hashMb: 256 });
const md = [`# Filtre de compatibilité à la profondeur ${DEPTH} — ${new Date().toISOString().slice(0, 10)}`, '',
  'Pour chaque plan : distance à la racine (0 = réalisé, ∞ = bloqué), coups progressants (la distance baisse après mon coup, l\'adversaire immobile) avec la note du moteur et le retard sur le meilleur coup, puis le meilleur coup non progressant et l\'écart par lequel il bat le meilleur progressant (positif = le moteur préfère ne pas progresser : c\'est là que « forcé » se décide). Notes du point de vue du camp au trait.', ''];
const ecarts = [];
const json = [];

for (const pos of POSITIONS) {
  if (SEUL && pos.id !== SEUL) continue;
  const c = new Chess();
  if (pos.fen) c.load(pos.fen); else for (const san of pos.coups.split(/\s+/)) c.move(san);
  const fen = c.fen(); const side = c.turn();
  const legaux = c.moves({ verbose: true });
  console.error(`${pos.id} : ${legaux.length} coups légaux, profondeur ${DEPTH}…`);
  const t0 = Date.now();
  const lignes = await engine.analyze(fen, { depth: DEPTH, multipv: legaux.length, timeoutMs: 20 * 60_000 });
  console.error(`  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  const note = new Map(); // uci -> cp
  for (const l of lignes) note.set(l.pv[0], cp(l.score));
  const coups = legaux.map((m) => ({ m, uci: m.from + m.to + (m.promotion ?? ''), cp: note.get(m.from + m.to + (m.promotion ?? '')) ?? null })).filter((x) => x.cp != null).sort((a, b) => b.cp - a.cp);
  const meilleur = coups[0];
  md.push(`## ${pos.nom}`, '', `\`${fen}\`  `, `Coups : ${pos.coups ? pos.coups.split(/\s+/).map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + fr(s)).join(' ') : '—'}  `, `Attendu : ${pos.attendu}  `, `Meilleur coup moteur : **${fr(meilleur.m.san)}** (${fmt(meilleur.cp)}) ; ${coups.length} coups notés.`, '');
  // Pour chaque plan et chaque coup : la distance après le coup (adversaire immobile).
  const d0s = pos.plans.map((plan) => distance(fen, side, plan));
  const d1s = pos.plans.map((plan) => coups.map((x) => { const apres = new Chess(fen); apres.move(x.m.san); return distance(apres.fen(), side, suivre(plan, x.m)).d; }));
  const progresse = (i, k) => d1s[i][k] < d0s[i].d;
  // Un coup non progressant pour ce plan sert-il un autre plan de la position ? (sinon le creux des écarts est brouillé)
  const autres = (i, k) => pos.plans.map((p, j) => (j !== i && progresse(j, k) ? libelle(p, fen) : null)).filter(Boolean);
  md.push('| plan | distance | coups progressants (note ; retard) | meilleur non progressant | écart |', '|---|---|---|---|---|');
  pos.plans.forEach((plan, i) => {
    const d0 = d0s[i];
    const prog = [], non = [];
    coups.forEach((x, k) => (progresse(i, k) ? prog : non).push({ ...x, d1: d1s[i][k], autres: autres(i, k) }));
    const bp = prog[0], bn = non[0];
    const ecart = bp && bn ? bn.cp - bp.cp : null;
    if (ecart != null) ecarts.push({ pos: pos.id, plan: libelle(plan, fen), ecart, prog: fr(bp.m.san), non: fr(bn.m.san), sert: bn.autres });
    const lp = prog.slice(0, 6).map((x) => `${fr(x.m.san)}→${dd(x.d1)} (${fmt(x.cp)} ; ${fmt(x.cp - meilleur.cp)})`).join(', ') + (prog.length > 6 ? `, … (${prog.length})` : '');
    const decomp = d0.etapes?.length ? `<br><small>${d0.etapes.map((e) => `· ${e}`).join('<br>')}</small>` : '';
    const sert = bn?.autres.length ? `<br><small>sert : ${bn.autres.join(', ')}</small>` : '';
    md.push(`| ${libelle(plan, fen)} | **${dd(d0.d)}** — ${d0.detail}${decomp} | ${lp || '*aucun*'} | ${bn ? `${fr(bn.m.san)} (${fmt(bn.cp)})${sert}` : '—'} | ${ecart == null ? '—' : fmt(ecart)} |`);
    json.push({ position: pos.id, plan, libelle: libelle(plan, fen), d0: d0.d, detail: d0.detail, etapes: d0.etapes ?? [], progressants: prog.map((x) => ({ san: x.m.san, cp: x.cp, d1: x.d1 })), nonProgressants: non.slice(0, 5).map((x) => ({ san: x.m.san, cp: x.cp, sert: x.autres })), ecart });
  });
  md.push('');
}
engine.stop();

if (ecarts.length) {
  md.push('## Distribution des écarts (meilleur non progressant − meilleur progressant)', '',
    'Un écart négatif ou nul : le meilleur coup du moteur progresse. Un écart positif : le moteur préfère un coup non progressant ; « forcé » commence quelque part dans cette liste, s\'il y a un creux.', '');
  const tri = [...ecarts].sort((a, b) => a.ecart - b.ecart);
  md.push('| écart | position | plan | meilleur progressant | meilleur non progressant | sert un autre plan ? |', '|---|---|---|---|---|---|');
  for (const e of tri) md.push(`| ${fmt(e.ecart)} | ${e.pos} | ${e.plan} | ${e.prog} | ${e.non} | ${e.sert.length ? e.sert.join(', ') : '—'} |`);
  const seuils = [0, 10, 25, 50, 100, Infinity];
  md.push('', 'Par tranche (centipions) :', '');
  for (let i = 0; i + 1 < seuils.length; i++) {
    const n = tri.filter((e) => e.ecart > seuils[i] && e.ecart <= seuils[i + 1]).length;
    md.push(`- ]${seuils[i]}, ${seuils[i + 1] === Infinity ? '∞' : seuils[i + 1]}] : ${n} ${'█'.repeat(n)}`);
  }
  md.push(`- ≤ 0 (le meilleur coup progresse) : ${tri.filter((e) => e.ecart <= 0).length} ${'█'.repeat(tri.filter((e) => e.ecart <= 0).length)}`);
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md.join('\n') + '\n');
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(json, null, 1));
console.error(`écrit : ${OUT}`);
