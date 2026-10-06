/**
 * Partie commentée : un « élève » (Stockfish bridé, niveau débutant) joue contre un adversaire un peu
 * plus fort ; à chaque coup de l'élève, on demande conseil au COACH (le pipeline du site), puis on
 * mesure le coup réellement joué. Le compte rendu sert à relire les explications une par une.
 *
 *   node scripts/coached-game.mjs [--student 1320] [--opponent 1500] [--moves 40] [--color white] [--opening "e4 e6 d4 d5 e5"]
 *
 * Rapport : reports/partie-commentee-<date>.md (+ .json)
 */

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { askCoach } from '../coach/coach.mjs';
import { loadEnv } from '../coach/env.mjs';
import { llmConfig } from '../coach/llm.mjs';
import { toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const STUDENT_ELO = Number(opt('--student', 1320));
const OPP_ELO = Number(opt('--opponent', 1500));
const MAX_MOVES = Number(opt('--moves', 40));
const COLOR = opt('--color', 'white') === 'black' ? 'b' : 'w';
const QUESTION = opt('--question', 'Quel est le plan ? Que dois-je jouer ?');
const OPENING = (opt('--opening', '') || '').split(/\s+/).filter(Boolean); // premiers coups imposés (SAN anglais)
const STAMP = Date.now();

class Limited {
  constructor(elo) {
    this.proc = spawn(process.env.STOCKFISH_PATH ?? '/usr/games/stockfish');
    this.waiters = [];
    createInterface({ input: this.proc.stdout }).on('line', (l) => {
      for (const w of [...this.waiters]) if (w.re.test(l)) { this.waiters.splice(this.waiters.indexOf(w), 1); w.resolve(l); }
    });
    for (const c of ['uci', 'setoption name UCI_LimitStrength value true', `setoption name UCI_Elo value ${elo}`]) this.send(c);
  }
  send(c) { this.proc.stdin.write(`${c}\n`); }
  async move(fen) {
    this.send(`position fen ${fen}`);
    this.send('go movetime 400');
    const line = await new Promise((resolve) => this.waiters.push({ re: /^bestmove/, resolve }));
    return line.split(' ')[1];
  }
  stop() { this.send('quit'); }
}

const cfg = llmConfig();
const engine = new UciEngine({ threads: 2 });
const student = new Limited(STUDENT_ELO);
const opponent = new Limited(OPP_ELO);
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const evalFor = async (fen) => {
  const c = new Chess(fen);
  if (c.isCheckmate()) return -10000;
  const [l] = await engine.analyze(fen, { depth: 14, multipv: 1 });
  return l ? toCp(l.score) : 0;
};

const chess = new Chess();
for (const san of OPENING) chess.move(san);
const turns = [];
console.error(`Partie commentée : élève ${STUDENT_ELO} (${COLOR === 'w' ? 'Blancs' : 'Noirs'}) contre ${OPP_ELO} — coach ${cfg.provider}/${cfg.model}`);
while (!chess.isGameOver() && chess.history().length < MAX_MOVES * 2) {
  const fen = chess.fen();
  if (chess.turn() === COLOR) {
    const n = Math.ceil((chess.history().length + 1) / 2);
    const t0 = Date.now();
    const r = await askCoach({ fen, side: COLOR === 'w' ? 'white' : 'black', moves: chess.history(), question: QUESTION, engine, cfg });
    const before = await evalFor(fen);
    const uci = await student.move(fen);
    const m = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    const loss = Math.max(0, Math.min(1000, before + (await evalFor(chess.fen()))));
    turns.push({ n, fen, moves: chess.history().slice(0, -1), advice: r.advice, adviceWorking: r.adviceWorking, problems: r.problems, revised: r.revised, context: r.context, played: toFrenchSan(m.san), loss, secs: Math.round((Date.now() - t0) / 1000) });
    console.error(`${n}. conseil reçu (${turns.at(-1).secs} s, ${r.problems.length} problème(s)) — l'élève joue ${turns.at(-1).played} (perte ${loss} cp)`);
    writeReport();
  } else {
    const uci = await opponent.move(fen);
    chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  }
}
student.stop();
opponent.stop();
engine.stop();
writeReport(true);

function writeReport(final = false) {
  const lines = [
    `# Partie commentée — élève ${STUDENT_ELO} contre ${OPP_ELO}${final ? '' : ' (en cours)'}`, '',
    `Coach : ${cfg.provider}/${cfg.model} ; question : « ${QUESTION} »`, '',
  ];
  for (const t of turns) {
    lines.push(`## Coup ${t.n} — l'élève joue ${t.played} (perte ${t.loss} cp)`, '', `FEN : \`${t.fen}\``, '',
      t.advice, '', `Vérification : ${t.problems.length ? t.problems.map((p) => `⚠ ${p}`).join(' ; ') : '✓ sources vérifiées'}${t.revised ? ' (réécrit)' : ''}`, '',
      '<details><summary>Contexte</summary>', '', '```', t.context, '```', '</details>', '');
  }
  lines.push('## PGN', '', '```', chess.pgn(), '```');
  mkdirSync('reports', { recursive: true });
  writeFileSync(`reports/partie-commentee-${STAMP}.md`, lines.join('\n'));
  writeFileSync(`reports/partie-commentee-${STAMP}.json`, JSON.stringify({ turns, pgn: chess.pgn() }, null, 2));
}
