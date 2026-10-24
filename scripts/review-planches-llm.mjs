/**
 * Essai de relecture des planches par deux LLM (à défaut d'un relecteur humain, 30 septembre 2026) : pour chaque
 * planche de plan humain, le relecteur reçoit la position (FEN), le camp, la définition précise du concept, la suite
 * réellement jouée et les faits qui apparaissent, et doit dire si le plan étiqueté est RÉEL (juste / bruit / doute)
 * en une phrase. Deux relecteurs indépendants : DeepSeek (JUDGE_*) et Opus (claude-cli). On mesure leur accord.
 *
 *   node scripts/review-planches-llm.mjs reports/planches-humains-1/index.json [--n 10] [--out reports/review-llm-10.md]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnv } from '../coach/env.mjs';
import { complete } from '../coach/llm.mjs';
import { judgeConfig } from '../coach/judge.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const N = Number(opt('--n', 10));
const OUT = opt('--out', 'reports/review-llm-10.md');
const index = JSON.parse(readFileSync(args[0], 'utf8'));

const DEF = {
  tour_colonne: 'TOUR SUR COLONNE OUVERTE : le camp amène délibérément une tour (par un coup calme de la tour, pas par un roque ni une prise) sur une colonne ouverte (aucun pion) ou semi-ouverte pour lui (aucun de ses pions), et elle y reste au moins six demi-coups.',
  cavalier_avant_poste: 'CAVALIER SUR AVANT-POSTE : le camp installe un cavalier, par un coup calme, sur une case du camp adverse (5e rangée ou au-delà, 4e admise) protégée par un de ses pions et qu\'aucun pion adverse ne pourra plus jamais attaquer ; le cavalier y reste au moins six demi-coups.',
  blocage: 'BLOCAGE : le camp installe un cavalier ou un fou, par un coup calme, juste devant un pion adverse isolé, arriéré, faible ou passé, et la pièce y reste au moins six demi-coups.',
  rupture: 'RUPTURE DE PIONS : le camp pousse un pion (pas une prise) qui attaque un pion adverse (levier), et cela ouvre pour lui une colonne nouvelle (ouverte ou semi-ouverte) qu\'une de ses tours utilise ensuite, ou crée une faiblesse adverse ou un pion passé pour lui ; la colonne reste ouverte au moins six demi-coups.',
  affaiblir: 'AFFAIBLIR LA STRUCTURE ADVERSE : par un échange (le camp prend, l\'adversaire est obligé de reprendre avec un pion) ou par un levier de pions voisin, une faiblesse nouvelle apparaît chez l\'adversaire (pions doublés, pion isolé, pion arriéré, ou bouclier du roi dégarni) et elle dure au moins six demi-coups.',
  dominer: 'DOMINER UNE COULEUR DE CASES : l\'adversaire est faible sur une couleur (au moins deux trous de cette couleur) ; le camp prend son fou de cette couleur avec une AUTRE pièce que son propre fou de même couleur (ou force l\'échange en l\'offrant), et garde le sien ; le complexe faible adverse subsiste au moins six demi-coups.',
};
const per = { tour_colonne: 2, cavalier_avant_poste: 2, blocage: 2, rupture: 2, affaiblir: 1, dominer: 1 };
const picks = [];
for (const [c, k] of Object.entries(per)) picks.push(...index.filter((x) => x.concept === c).slice(0, k));
const sample = picks.slice(0, N);

const SYSTEM = `Tu es un maître d'échecs relecteur. On te donne une position (FEN), le camp qui agit, la définition précise d'un concept stratégique, la suite réellement jouée dans une partie humaine, et les faits que notre programme dit voir apparaître. Ta tâche : dire si l'étiquette « le camp réalise ce concept dans cette suite » est JUSTE (le concept est bien réalisé, conformément à la définition, et c'est une idée stratégique réelle et pas un hasard de la suite), BRUIT (l'étiquette ne correspond pas à la définition, ou le concept apparaît par accident, ou c'est une faute), ou DOUTE. Réponds sur une seule ligne : VERDICT: JUSTE|BRUIT|DOUTE — puis une phrase de justification précise, en français, avec les cases.`;
const ask = (p) => `Position (FEN) : ${p.fen}\nCamp qui agit : ${p.side === 'w' ? 'Blancs' : 'Noirs'}\nConcept étiqueté : ${DEF[p.concept]}\nSuite réellement jouée (notation française, le concept apparaît au demi-coup ${p.ply + 1}) : ${p.line}\nFaits qui apparaissent selon notre programme : ${p.fresh.join(' ; ') || '(aucun rendu)'}`;

const cfgA = judgeConfig();
const cfgB = judgeConfig({ ...process.env, JUDGE_PROVIDER: 'claude-cli', JUDGE_MODEL: 'opus', JUDGE_API_KEY: '', JUDGE_BASE_URL: '', JUDGE_EFFORT: '' });
const parse = (t) => ({ verdict: (t.match(/VERDICT\s*:\s*(JUSTE|BRUIT|DOUTE)/i)?.[1] ?? '?').toUpperCase(), why: t.replace(/^[\s\S]*?VERDICT\s*:\s*(JUSTE|BRUIT|DOUTE)\s*[—:-]?\s*/i, '').split('\n')[0].trim().slice(0, 260) });
const rows = [];
for (const p of sample) {
  const [a, b] = await Promise.all([
    complete({ system: SYSTEM, user: ask(p) }, cfgA, { think: false }).then(parse).catch((e) => ({ verdict: 'ERREUR', why: e.message })),
    complete({ system: SYSTEM, user: ask(p) }, cfgB, { think: false }).then(parse).catch((e) => ({ verdict: 'ERREUR', why: e.message })),
  ]);
  rows.push({ n: p.n, concept: p.concept, fen: p.fen, a, b });
  console.log(`#${p.n} ${p.concept}: DeepSeek ${a.verdict} | Opus ${b.verdict}`);
}
const accord = rows.filter((r) => r.a.verdict === r.b.verdict).length;
const md = [`# Relecture de ${rows.length} planches par deux LLM — ${new Date().toISOString().slice(0, 16)}`, '',
  `Relecteur A : ${cfgA.provider}/${cfgA.model} ; relecteur B : ${cfgB.provider}/${cfgB.model}. Accord : ${accord}/${rows.length}.`, '',
  '| Planche | Concept | DeepSeek | Opus |', '|---|---|---|---|',
  ...rows.map((r) => `| #${r.n} | ${r.concept} | ${r.a.verdict} | ${r.b.verdict} |`), '', '## Justifications', ''];
for (const r of rows) md.push(`### #${r.n} ${r.concept} — \`${r.fen}\``, `- DeepSeek (${r.a.verdict}) : ${r.a.why}`, `- Opus (${r.b.verdict}) : ${r.b.why}`, '');
writeFileSync(OUT, `${md.join('\n')}\n`);
console.log(`accord ${accord}/${rows.length} -> ${OUT}`);
