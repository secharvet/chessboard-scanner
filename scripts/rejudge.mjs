/**
 * Refait noter les réponses d'un rapport du banc (reports/coach-eval-*.md) par un AUTRE relecteur,
 * sans regénérer les réponses : pour vérifier qu'un relecteur ne favorise pas son propre modèle.
 *
 *   JUDGE_PROVIDER=claude-cli JUDGE_MODEL=opus node scripts/rejudge.mjs reports/coach-eval-XXXX.md [--jobs 2]
 */

import { readFileSync } from 'node:fs';
import { loadEnv } from '../coach/env.mjs';
import { judgeAnswer, judgeConfig } from '../coach/judge.mjs';

loadEnv();
const args = process.argv.slice(2);
const file = args[0];
const jobs = Number(args.includes('--jobs') ? args[args.indexOf('--jobs') + 1] : 2);
const cfg = judgeConfig();

/** Découpe le rapport : une entrée par position (réponse affichée + contexte envoyé). */
function parseReport(md) {
  const out = [];
  for (const block of md.split(/\n(?=## \d+\. )/).slice(1)) {
    const name = block.match(/^## (\d+\. .*)/)?.[1] ?? '?';
    const body = block.split('\n### grounded\n')[1];
    if (!body) continue;
    const lines = body.split('\n');
    // La réponse commence après les lignes « Thèmes / Coups hors contexte / Citations KO / Relecteur ».
    let i = lines.findIndex((l) => l.startsWith('Relecteur :'));
    if (i < 0) i = lines.findIndex((l) => l.startsWith('Coups hors contexte'));
    i++;
    while (i < lines.length && (lines[i].startsWith('- ') || !lines[i].trim())) i++;
    const end = lines.findIndex((l, k) => k >= i && l.startsWith('<details>'));
    const advice = lines.slice(i, end < 0 ? undefined : end).join('\n').trim();
    const context = body.match(/<summary>Contexte envoyé<\/summary>\n\n```\n([\s\S]*?)\n```/)?.[1] ?? '';
    const oldNote = Number(body.match(/^Relecteur : (\d+)\/10/m)?.[1] ?? NaN);
    if (advice && context) out.push({ name, advice, context, oldNote });
  }
  return out;
}

const items = parseReport(readFileSync(file, 'utf8'));
console.log(`${items.length} réponses — relecteur ${cfg.provider}/${cfg.model} — ${file}`);
const results = new Array(items.length);
let next = 0;
await Promise.all(Array.from({ length: jobs }, async () => {
  while (next < items.length) {
    const k = next++;
    const it = items[k];
    const v = await judgeAnswer(it.context, it.advice, cfg).catch((e) => ({ erreurs: [], note: null, raw: e.message }));
    const graves = v.erreurs.filter((e) => e.gravite === 'grave');
    results[k] = { ...it, note: v.note, graves };
    console.log(`${it.name} : ${v.note ?? '?'}/10 (ancien relecteur ${it.oldNote}/10), graves ${graves.length}`);
    for (const g of graves) console.log(`   grave — « ${g.phrase} » : ${String(g.raison).slice(0, 220)}`);
  }
}));
const notes = results.map((r) => r.note).filter(Number.isFinite);
const old = results.map((r) => r.oldNote).filter(Number.isFinite);
const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : '—');
console.log(`\nMoyenne : ${avg(notes)}/10 (ancien relecteur : ${avg(old)}/10) ; réponses avec erreur grave : ${results.filter((r) => r.graves.length).length}/${results.length}`);
