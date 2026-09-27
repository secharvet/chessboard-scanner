/**
 * Expérience B — le LLM joue seul, avec ses principes et la perception du moteur de règles,
 * SANS les lignes de Stockfish, contre Stockfish bridé (UCI_Elo).
 * Un second Stockfish mesure en coulisse le coût de chaque coup du LLM.
 *
 *   node scripts/llm-plays.mjs --elo 1350 --color white --moves 60
 *   LLM_MODEL=deepseek-v4-pro node scripts/llm-plays.mjs --elo 1600
 *
 * Rapport : reports/partie-<date>.md (+ .pgn)
 */

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { loadEnv } from '../coach/env.mjs';
import { complete, llmConfig } from '../coach/llm.mjs';
import { fromFrenchSan, toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { buildAllFacts, detectPhase } from '../positional/index.js';
import { buildBalance } from '../positional/balance.js';
import { judgeConfig } from '../coach/judge.mjs';
import { blunderCheck, scanTactics } from '../coach/threats.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const ELO = Number(opt('--elo', 1350));
const LLM_COLOR = opt('--color', 'white') === 'black' ? 'b' : 'w';
const MAX_MOVES = Number(opt('--moves', 60));
const cfg = llmConfig();

// ── Adversaire : Stockfish bridé ──
class LimitedEngine {
  constructor(elo) {
    this.proc = spawn(process.env.STOCKFISH_PATH ?? '/usr/games/stockfish');
    this.waiters = [];
    createInterface({ input: this.proc.stdout }).on('line', (l) => {
      for (const w of [...this.waiters]) if (w.test(l)) { this.waiters.splice(this.waiters.indexOf(w), 1); w.resolve(l); }
    });
    this.send('uci');
    this.send('setoption name UCI_LimitStrength value true');
    this.send(`setoption name UCI_Elo value ${elo}`);
  }
  send(c) { this.proc.stdin.write(`${c}\n`); }
  wait(re) { return new Promise((resolve) => this.waiters.push({ test: (l) => re.test(l), resolve })); }
  async move(fen) {
    this.send(`position fen ${fen}`);
    this.send('go movetime 500');
    const line = await this.wait(/^bestmove/);
    return line.split(' ')[1];
  }
  stop() { this.send('quit'); }
}

// ── Joueur LLM ──
const SYSTEM = `Tu joues une partie d'échecs complète. Tu n'as AUCUN moteur de calcul : tu joues avec les principes (déséquilibres de Silman, structure de pions, activité, sécurité du roi, colonnes, cases faibles, complexes de couleur, tactique élémentaire) et avec la perception fournie par un moteur de règles fiable.
À chaque coup tu reçois : la position (FEN), les derniers coups, le bilan des déséquilibres, les faits tactiques, ton plan précédent et la liste des coups légaux.
Règles :
- Choisis UN coup dans la liste des coups légaux, recopié exactement (notation française : R roi, D dame, T tour, F fou, C cavalier).
- Vérifie d'abord la sécurité : la liste « Menaces de l'adversaire » dit ce qu'il gagnerait s'il jouait maintenant ; pare la plus grave, sauf si tu as mieux (un mat, ou un gain plus gros que ce que tu perds).
- Regarde ensuite « Tes occasions tactiques » : un gain de matériel sûr passe souvent avant le plan.
- Garde un plan cohérent d'un coup à l'autre ; change de plan seulement si la position l'exige, et dis pourquoi.
Réponds UNIQUEMENT en JSON : {"plan": "ton plan en une ou deux phrases", "raison": "pourquoi ce coup", "coup": "Cf3"}`;

function perception(fen, color) {
  const b = buildBalance(buildAllFacts(fen));
  const opp = color === 'w' ? 'b' : 'w';
  const list = (t, xs) => `${t}\n${xs.length ? xs.slice(0, 10).map((x) => `- ${x}`).join('\n') : '- (rien de notable)'}`;
  return [
    list('Tes atouts :', b[color].assets),
    list('Tes faiblesses (dont tes pièces en prise ou clouées) :', b[color].weaknesses),
    list("Atouts de l'adversaire (dont ses menaces tactiques) :", b[opp].assets),
    list("Faiblesses de l'adversaire :", b[opp].weaknesses),
    list('Contexte :', b.context),
    list("Menaces de l'adversaire (ce qu'il gagnerait s'il jouait maintenant) :", scanTactics(fen, opp).map((t) => t.text)),
    list('Tes occasions tactiques (coups qui gagnent quelque chose tout de suite) :', scanTactics(fen, color).map((t) => t.text)),
  ].join('\n\n');
}

async function llmMove(chess, plan, history) {
  const fen = chess.fen();
  const legal = chess.moves().map(toFrenchSan);
  const user = `Tu joues les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'}. Phase : ${detectPhase(fen)}.
FEN : ${fen}
Derniers coups : ${history.slice(-10).map(toFrenchSan).join(' ') || '(début de partie)'}
Ton plan précédent : ${plan || '(aucun)'}

${perception(fen, LLM_COLOR)}

Coups légaux : ${legal.join(' ')}`;

  let lastError = '';
  let blunderChecked = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const raw = await complete({ system: SYSTEM, user: lastError ? `${user}\n\n${lastError}` : user }, cfg);
    let parsed;
    try {
      parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '');
    } catch {
      lastError = 'Ta réponse précédente n\'était pas un JSON valide. Réponds uniquement en JSON.';
      continue;
    }
    const wanted = String(parsed.coup ?? '').trim().replace(/[!?]+$/, '');
    let played = null;
    for (const san of [fromFrenchSan(wanted), wanted]) {
      try {
        const m = new Chess(fen).move(san);
        if (m) { played = m; break; }
      } catch { /* essai suivant */ }
    }
    if (played) {
      // Contrôle anti-gaffe (une seule fois) : le coup laisse-t-il un gain immédiat à l'adversaire ?
      const after = new Chess(fen);
      after.move(played.san);
      const danger = blunderCheck(after.fen(), LLM_COLOR);
      if (danger.length && !blunderChecked) {
        blunderChecked = true;
        warnings++;
        lastError = `Contrôle anti-gaffe : après ${toFrenchSan(played.san)}, l'adversaire aurait : ${danger.map((d) => d.text).join(' ; ')}. `
          + 'Confirme ce coup seulement si tu as vérifié que c\'est voulu (sacrifice calculé, ou mal moindre) ; sinon choisis-en un autre.';
        continue;
      }
      return { san: played.san, plan: parsed.plan ?? '', raison: parsed.raison ?? '', illegal: attempt - (blunderChecked ? 1 : 0), warned: blunderChecked };
    }
    lastError = `Le coup « ${wanted} » est illégal. Choisis exactement un coup de la liste des coups légaux.`;
  }
  // Trois échecs : coup légal au hasard (compté comme erreur du LLM).
  const any = chess.moves()[0];
  return { san: any, plan, raison: '(coup de secours après 3 réponses illégales)', illegal: 3 };
}

// ── Mesure du coût d'un coup ──
const judge = new UciEngine({ threads: 2 });
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
async function evalFor(fen) {
  const [l] = await judge.analyze(fen, { depth: 14, multipv: 1 });
  return l ? toCp(l.score) : 0; // point de vue du camp au trait
}

// ── Partie ──
const chess = new Chess();
const opponent = new LimitedEngine(ELO);
const log = [];
let plan = '';
let planChanges = 0;
let warnings = 0;
console.log(`LLM (${cfg.provider}/${cfg.model}) avec les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'} contre Stockfish ${ELO} Elo`);

while (!chess.isGameOver() && chess.history().length < MAX_MOVES * 2) {
  const fen = chess.fen();
  if (chess.turn() === LLM_COLOR) {
    const before = await evalFor(fen);
    const m = await llmMove(chess, plan, chess.history());
    chess.move(m.san);
    const after = -(await evalFor(chess.fen()));
    const loss = Math.max(0, Math.min(1000, before - after));
    const tag = loss >= 300 ? 'gaffe' : loss >= 100 ? 'erreur' : loss >= 50 ? 'imprécision' : '';
    if (plan && m.plan && m.plan !== plan) planChanges++;
    plan = m.plan || plan;
    log.push({ n: Math.ceil(chess.history().length / 2), san: toFrenchSan(m.san), loss, tag, plan: m.plan, raison: m.raison, illegal: Math.max(0, m.illegal), evalAfter: after, warned: m.warned });
    console.log(`${String(log.at(-1).n).padStart(2)}. ${log.at(-1).san.padEnd(7)} perte ${String(loss).padStart(4)} ${tag.padEnd(11)}${m.warned ? '⚑ ' : '  '}${m.plan.slice(0, 80)}`);
  } else {
    const uci = await opponent.move(fen);
    chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  }
}
opponent.stop();

// ── Bilan ──
const result = chess.isCheckmate()
  ? (chess.turn() === LLM_COLOR ? 'défaite (mat)' : 'victoire (mat)')
  : chess.isGameOver() ? 'nulle' : `arrêtée au coup ${Math.ceil(chess.history().length / 2)}`;
const finalEval = await evalFor(chess.fen()) * (chess.turn() === LLM_COLOR ? 1 : -1);
judge.stop();

const acpl = Math.round(log.reduce((a, x) => a + x.loss, 0) / Math.max(1, log.length));
const count = (t) => log.filter((x) => x.tag === t).length;
const illegal = log.reduce((a, x) => a + x.illegal, 0);

// Cohérence du plan, jugée par le relecteur.
let coherence = null;
try {
  const jcfg = judgeConfig();
  const raw = await complete({
    system: `Tu es entraîneur d'échecs. On te donne, coup par coup, le plan annoncé par un joueur et le coup joué. Juge la COHÉRENCE stratégique : le joueur suit-il ses plans, ses changements de plan sont-ils justifiés, ses coups servent-ils le plan annoncé, applique-t-il des principes justes ? Réponds UNIQUEMENT en JSON : {"note": 0-10, "points_forts": ["..."], "points_faibles": ["..."]}`,
    user: log.map((x) => `${x.n}. ${x.san} (perte ${x.loss} cp${x.tag ? `, ${x.tag}` : ''}) — plan : ${x.plan} — raison : ${x.raison}`).join('\n'),
  }, jcfg);
  coherence = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? 'null');
} catch (e) {
  coherence = { note: null, points_faibles: [`relecteur indisponible : ${e.message}`] };
}

const pgn = chess.pgn();
const lines = [
  `# Partie : LLM (${cfg.model}) contre Stockfish ${ELO} Elo`, '',
  `- LLM avec les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'} ; résultat : **${result}** ; éval finale (pour le LLM) : ${(finalEval / 100).toFixed(1)}`,
  `- Perte moyenne par coup (ACPL) : **${acpl}** ; gaffes : ${count('gaffe')}, erreurs : ${count('erreur')}, imprécisions : ${count('imprécision')}`,
  `- Réponses illégales : ${illegal} ; changements de plan : ${planChanges} ; alertes anti-gaffe : ${warnings}`,
  coherence ? `- Cohérence stratégique (relecteur) : **${coherence.note ?? '?'}/10**` : '',
  '', ...(coherence?.points_forts ?? []).map((x) => `- ✅ ${x}`), ...(coherence?.points_faibles ?? []).map((x) => `- ⚠ ${x}`),
  '', '## Coups du LLM', '', '| Coup | Perte (cp) | | Plan annoncé | Raison |', '|---|---|---|---|---|',
  ...log.map((x) => `| ${x.n}. ${x.san}${x.warned ? ' ⚑' : ''} | ${x.loss} | ${x.tag} | ${x.plan.replace(/\|/g, '/')} | ${x.raison.replace(/\|/g, '/')} |`),
  '', '## PGN', '', '```', pgn, '```',
];
mkdirSync('reports', { recursive: true });
const stamp = Date.now();
writeFileSync(`reports/partie-${stamp}.md`, lines.join('\n'));
writeFileSync(`reports/partie-${stamp}.pgn`, pgn);
console.log(`\n${result} — ACPL ${acpl}, gaffes ${count('gaffe')}, erreurs ${count('erreur')}, imprécisions ${count('imprécision')}, illégaux ${illegal}, cohérence ${coherence?.note ?? '?'}/10`);
console.log(`Rapport : reports/partie-${stamp}.md`);
