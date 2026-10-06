/** Rejoue une partie assistée (JSON de coached-game) et produit, pour chaque coup de l'élève, la fiche AVANT (sans
 * coach d'ouverture) et APRÈS (avec), sur les mêmes données moteur. Sortie : JSON + page HTML.
 *   node scripts/partie-avant-apres.mjs reports/partie-commentee-<stamp>.json reports/partie-francaise-blancs */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildCoachContext } from '../coach/context.mjs';
import { buildBrief } from '../coach/brief.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
const [inFile, outBase] = process.argv.slice(2);
const game = JSON.parse(readFileSync(inFile, 'utf8'));
const engine = new UciEngine({ threads: 2 });
const out = [];
for (const t of game.turns) {
  const side = t.moves.length % 2 === 0 ? 'white' : 'black';
  const ctx = await buildCoachContext({ fen: t.fen, side, moves: t.moves, engine });
  process.env.COACH_OPENING = '0';
  const avant = buildBrief(ctx.data);
  delete process.env.COACH_OPENING;
  const apres = buildBrief(ctx.data);
  const r = apres.items.find((x) => x.kind === 'reason');
  out.push({ n: t.n, fen: t.fen, derniers: t.moves.slice(-6), joue: t.played, perte: t.loss, avant: avant.text, apres: apres.text, idee: apres.idea, raison: r?.type, conseil: r?.move, ouverture: apres.items.some((x) => String(x.kind).startsWith('opening')) });
  console.log(`${t.n}. ${r?.type} ${r?.move} | ${apres.text.slice(0, 90)}`);
}
engine.stop();
writeFileSync(`${outBase}.json`, JSON.stringify({ pgn: game.pgn, coups: out }, null, 1));
console.log('TERMINÉ', out.length, 'coups,', out.filter((x) => x.ouverture).length, 'avec le coach d\'ouverture');
