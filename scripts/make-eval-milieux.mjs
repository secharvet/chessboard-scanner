/**
 * Banc de MILIEUX DE PARTIE pour le coach (docs/PLANS-ET-CONCEPTS.md, §9 priorité 1) : le banc historique
 * (coach/eval-positions.mjs) est fait de débuts, de pièges et de finales, où le plan vérifié ne sort presque jamais.
 * Ici, les positions viennent des étiquettes humaines : plan réalisé par une suite calme, tôt, par un joueur dont on
 * connaît le niveau. Tirage stratifié par concept et par tranche d'Elo, parties de TEST seulement (même découpage que
 * l'entraînement : crc32 de l'identifiant de partie modulo 10 = 0), pour ne jamais évaluer le coach sur ce qu'un
 * modèle a vu.
 *
 *   node scripts/make-eval-milieux.mjs data/datasets/humains-v3.jsonl data/datasets/humains-2016-v1.jsonl
 *        [--per 2] [--out coach/eval-positions-milieux.mjs] [--seed 3]
 *
 * Les « thèmes » attendus sont les mots du plan (regex), pour la mesure automatique du banc ; le vrai juge reste le
 * relecteur (LLM) et, mieux, un joueur fort sur planches.
 */

import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import zlib from 'node:zlib';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PER = Number(opt('--per', 2));
const OUT = opt('--out', 'coach/eval-positions-milieux.mjs');
let seed = Number(opt('--seed', 3));
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const files = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const BR = [['debutant', 0, 1300], ['intermediaire', 1300, 1700], ['avance', 1700, 9999]];
const THEMES = {
  tour_colonne: ['tour', 'colonne'], rupture: ['ruptur|levier|pouss', 'colonne|ouvr'], affaiblir: ['affaibl|faible|isolé|doublé|arriéré', 'structure|pion'],
  blocage: ['bloqu|devant', 'pion'], cavalier_avant_poste: ['cavalier', 'avant-poste|case'], dominer: ['fou', 'cases? (noires|claires|blanches)|couleur|complexe'],
};
const NAMES = { tour_colonne: 'tour sur colonne ouverte', rupture: 'rupture de pions', affaiblir: 'affaiblir la structure', blocage: 'blocage', cavalier_avant_poste: 'cavalier sur avant-poste', dominer: 'dominer une couleur' };
const isTest = (game) => zlib.crc32(String(game)) % 10 === 0;

const pool = {}; // concept|bracket -> candidats
for (const file of files) {
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (!isTest(r.game)) continue;
    for (const side of ['w', 'b']) {
      const elo = r.elo?.[side];
      const br = BR.find(([, lo, hi]) => elo >= lo && elo < hi)?.[0];
      if (!br) continue;
      // Une seule intention nette par position : exactement un concept réalisé par ce camp.
      const done = Object.keys(THEMES).filter((c) => r.y[`${c}_${side}`] === 1);
      if (done.length !== 1) continue;
      const c = done[0];
      // Le camp étudié doit avoir le trait (le coach conseille le joueur au trait).
      if (r.fen.split(' ')[1] !== side) continue;
      (pool[`${c}|${br}`] ??= []).push({ fen: r.fen, side, elo, concept: c, br, game: r.game, ply: r.ply });
    }
  }
}
const picks = [];
for (const c of Object.keys(THEMES)) for (const [br] of BR) {
  const cands = pool[`${c}|${br}`] ?? [];
  for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [cands[i], cands[j]] = [cands[j], cands[i]]; }
  picks.push(...cands.slice(0, PER));
}
const js = `/**
 * Banc de milieux de partie : positions de TEST tirées des étiquettes humaines (scripts/make-eval-milieux.mjs).
 * Chaque position : un joueur de ce niveau y a réalisé exactement un plan, par une suite calme et tôt. Le coach
 * conseille le camp au trait ; « themes » = mots du plan attendus (mesure automatique), « concept » = étiquette.
 * Généré le ${new Date().toISOString().slice(0, 10)} ; ${picks.length} positions.
 */

export const EVAL_POSITIONS = [
${picks.map((p) => `  { name: '${NAMES[p.concept]} — ${p.br} ${p.elo} (${p.side === 'w' ? 'blancs' : 'noirs'})', fen: '${p.fen}', side: '${p.side === 'w' ? 'white' : 'black'}', elo: ${p.elo}, concept: '${p.concept}', themes: ${JSON.stringify(THEMES[p.concept])} },`).join('\n')}
];
`;
writeFileSync(OUT, js);
console.log(`${picks.length} positions -> ${OUT}`, Object.fromEntries(Object.entries(pool).map(([k, v]) => [k, v.length])));
