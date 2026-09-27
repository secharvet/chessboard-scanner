/**
 * Portrait d'un joueur.
 *
 *   node scripts/portrait.mjs --lichess <pseudo> [--games 20] [--perf blitz,rapid,classical]
 *   node scripts/portrait.mjs --chesscom <pseudo> [--games 20]
 *   node scripts/portrait.mjs --pgn mes-parties.pgn --user "Nom exact" [--games 20]
 *
 * Rapport : reports/portrait-<joueur>-<date>.md (+ .json)
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { loadEnv } from '../coach/env.mjs';
import { complete, llmConfig } from '../coach/llm.mjs';
import { analyzePlayer, axisIndex, fetchChessComGames, fetchLichessGames, PORTRAIT_SYSTEM, portraitFacts } from '../coach/portrait.mjs';
import { stripCitations, verifyCitations } from '../coach/verify.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

loadEnv();
const args = process.argv.slice(2);
const val = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const max = Number(val('--games', 20));
const lichess = val('--lichess', null);
const chesscom = val('--chesscom', null);
const user = lichess ?? chesscom ?? val('--user', null);
if (!user) throw new Error('Préciser --lichess <pseudo>, --chesscom <pseudo> ou --pgn <fichier> --user <nom>');

const pgn = lichess ? await fetchLichessGames(lichess, { max, perf: val('--perf', 'blitz,rapid,classical') })
  : chesscom ? await fetchChessComGames(chesscom, { max })
    : readFileSync(val('--pgn'), 'utf8').split(/\n(?=\[Event )/).slice(0, max).join('\n');

const engine = new UciEngine({ threads: 2 });
const t0 = Date.now();
const analysis = await analyzePlayer(pgn, user, engine, { onGame: (i, n) => process.stderr.write(`\ranalyse ${i}/${n}`) });
engine.stop();
console.error(`\n${analysis.games} parties analysées en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

// Référence de l'axe : les profils de grands maîtres de la validation, s'ils existent.
const refs = existsSync('reports') ? readdirSync('reports').filter((f) => /^profil-[A-Z].*\.json$/.test(f))
  .map((f) => JSON.parse(readFileSync(`reports/${f}`, 'utf8')).agg) : [];
const index = refs.length >= 2 ? axisIndex(analysis.style, refs) : null;
const facts = portraitFacts(analysis, index);
const factText = Object.entries(facts).map(([id, t]) => `- [${id}] ${t}`).join('\n');

const cfg = llmConfig();
const user_ = `Joueur : ${user}\n\n# Faits mesurés (seule source autorisée)\n\n${factText}`;
let raw = await complete({ system: PORTRAIT_SYSTEM, user: user_ }, cfg);
let { problems } = verifyCitations(raw, facts);
if (problems.length) {
  raw = await complete({ system: PORTRAIT_SYSTEM, user: `${user_}\n\n# Ta première version\n\n${raw}\n\nProblèmes relevés :\n${problems.map((p) => `- ${p}`).join('\n')}\nRéécris en corrigeant.` }, cfg);
  ({ problems } = verifyCitations(raw, facts));
}

const text = [
  `# Portrait de ${user}`, '',
  stripCitations(raw), '',
  `> ${problems.length ? `⚠ ${problems.length} affirmation(s) non vérifiée(s)` : '✓ toutes les affirmations sont sourcées'} — ${analysis.games} parties, ${cfg.provider}/${cfg.model}`, '',
  '<details><summary>Faits mesurés</summary>', '', factText, '', '</details>',
].join('\n');
mkdirSync('reports', { recursive: true });
const base = `reports/portrait-${user.replace(/[^\w-]/g, '_')}-${Date.now()}`;
writeFileSync(`${base}.md`, text);
writeFileSync(`${base}.json`, JSON.stringify({ analysis, facts, index }, null, 2));
console.log(text);
console.error(`Rapport : ${base}.md`);
