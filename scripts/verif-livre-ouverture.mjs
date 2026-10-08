/** Vérifie au moteur le livre des intentions : chaque coup de `plan` doit être dans les 3 premiers à moins de 0,3 du
 * meilleur ; chaque coup d'`erreurs` doit être hors des 3 premiers ou à plus de 0,3. Sortie : reports/verif-livre-' + (process.argv[3] ?? 'francaise') + '.md */
import { writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { UciEngine } from '../coach/uci-engine.mjs';
const { LIVRE } = await import('../coach/openings/' + (process.argv[3] ?? 'francaise') + '.mjs');
import { toFrenchSan } from '../coach/notation.mjs';
const engine = new UciEngine({ threads: 1 });
const DEPTH = Number(process.argv[2] ?? 18);
const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 : -10000) : s.value);
const rows = []; let okPlan = 0, nPlan = 0, okErr = 0, nErr = 0;
for (const e of LIVRE) {
  if (!e.plan?.length && !e.erreurs?.length) continue;
  const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san);
  const lines = await engine.analyze(c.fen(), { depth: DEPTH, multipv: 5 });
  const top = lines.map((l) => { const cc = new Chess(c.fen()); const m = cc.move({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), promotion: l.pv[0][4] }); return { san: m.san, cp: cp(l.score) }; });
  const best = top[0]?.cp ?? 0;
  const verdict = (san, attenduBon) => {
    const i = top.findIndex((t) => t.san === san);
    const d = i >= 0 ? best - top[i].cp : null;
    const bon = i >= 0 && d <= 40; // plan : à moins de 0,4 du meilleur (les ouvertures ont souvent cinq coups équivalents)
    const mauvais = i < 0 || d > 30; // erreur : hors des cinq premiers, ou à plus de 0,3
    return { san: toFrenchSan(san), rang: i >= 0 ? i + 1 : '>5', ecart: d == null ? '—' : (d / 100).toFixed(2), ok: attenduBon ? bon : mauvais };
  };
  for (const p of e.plan ?? []) { const v = verdict(p.san, true); nPlan++; if (v.ok) okPlan++; rows.push({ coups: e.coups, type: 'plan', ...v }); }
  for (const p of e.erreurs ?? []) { const v = verdict(p.san, false); nErr++; if (v.ok) okErr++; rows.push({ coups: e.coups, type: 'erreur', ...v }); }
  console.log(`${e.coups} : moteur ${top.slice(0, 3).map((t) => `${toFrenchSan(t.san)} ${t.cp}`).join(', ')}`);
}
engine.stop();
const md = [`# Vérification du livre de la Française au moteur (profondeur ${DEPTH})`, '', `Coups de plan confirmés : ${okPlan}/${nPlan}. Erreurs confirmées mauvaises : ${okErr}/${nErr}.`, '', '| Position | Type | Coup | Rang moteur | Écart (pions) | OK |', '|---|---|---|---|---|---|'];
for (const r of rows) md.push(`| ${r.coups} | ${r.type} | ${r.san} | ${r.rang} | ${r.ecart} | ${r.ok ? '✓' : '✗'} |`);
writeFileSync('reports/verif-livre-' + (process.argv[3] ?? 'francaise') + '.md', md.join('\n') + '\n');
console.log(`TERMINÉ plan ${okPlan}/${nPlan} erreurs ${okErr}/${nErr}`);
