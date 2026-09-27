/**
 * Expérience B — le LLM joue seul, avec ses principes et la perception du moteur de règles,
 * SANS les lignes de Stockfish, contre Stockfish bridé (UCI_Elo).
 * Un second Stockfish mesure en coulisse le coût de chaque coup du LLM.
 *
 *   node scripts/llm-plays.mjs --elo 1350 --color white --moves 60
 *   LLM_MODEL=deepseek-v4-pro node scripts/llm-plays.mjs --elo 1600
 *   --referee stockfish|rules|none   arbitre des coups confirmés malgré une alerte (défaut : stockfish)
 *   --stop-before 20                 arrêter la partie à la première gaffe avant ce coup
 *   --no-memory                      sans le carnet de leçons (comparaison)
 *   --think auto|on|off              réflexion du LLM : auto = seulement dans les positions critiques (défaut)
 *   --no-review                      sans analyse d'après-partie (le carnet n'apprend rien)
 *
 * Alerte anti-gaffe → « es-tu sûr ? » → si le LLM confirme, l'arbitre tranche :
 *   stockfish : refusé si le coup perd ≥ 2 pions à l'évaluation, sinon sacrifice validé ;
 *   rules     : refusé si le calcul forcé montre un mat ou une perte ≥ 3 points ;
 *   none      : le LLM a le dernier mot.
 * Les vetos sont comptés à part : la perte mesurée n'est plus celle du LLM seul.
 *
 * Rapport : reports/partie-<date>.md (+ .pgn)
 */

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { loadEnv } from '../coach/env.mjs';
import { complete, llmConfig } from '../coach/llm.mjs';
import { fromFrenchSan, toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { buildAllFacts, detectPhase } from '../positional/index.js';
import { buildBalance } from '../positional/balance.js';
import { judgeConfig } from '../coach/judge.mjs';
import { blunderCheck, scanTactics } from '../coach/threats.mjs';
import { describeForcing, forcingLines } from '../coach/forcing.mjs';
import { findManeuvers } from '../coach/maneuvers.mjs';
import { diagnoseMistake } from '../coach/diagnose.mjs';
import { loadLessons, moveTags, recall, remindsOf, situationTags } from '../coach/memory.mjs';
import { learnFromMistake, markRecall } from '../coach/review.mjs';

loadEnv();
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const ELO = Number(opt('--elo', 1350));
const LLM_COLOR = opt('--color', 'white') === 'black' ? 'b' : 'w';
const MAX_MOVES = Number(opt('--moves', 60));
const REFEREE = opt('--referee', 'stockfish');
const STOP_BEFORE = Number(opt('--stop-before', 0));
const VETO_CP = 200;
const USE_MEMORY = !args.includes('--no-memory');
const THINK = opt('--think', 'auto');
let thinkCalls = 0;
let fastCalls = 0;
const REVIEW = !args.includes('--no-review');
const lessons = USE_MEMORY ? loadLessons() : [];
const recalls = [];
const learned = [];
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
- Regarde ensuite « Tes occasions tactiques » et « Tes combinaisons forcées » (lignes calculées jusqu'au bout en ne jouant que des coups forcés) : un gain sûr ou un mat passe avant le plan.
- Pour le plan, « Manœuvres possibles » donne des itinéraires sûrs vers des cases stratégiques (avant-postes, cases de blocage, colonnes ouvertes, pions faibles à attaquer). Un bon plan tient souvent en une manœuvre de 2 à 4 coups : annonce-la et suis-la.
- CONTINUITÉ : un plan se poursuit sur plusieurs coups. Parer une menace n'est pas changer de plan : pare, puis reviens à ton plan. Ne change de plan que si la structure de pions ou le matériel a changé, et dis alors pourquoi.
- Indique le type de ton coup : "plan" (il fait avancer ton plan), "parade" (il pare une menace ; dis comment tu reprends ton plan ensuite) ou "tactique" (il exploite une occasion).
Réponds UNIQUEMENT en JSON : {"plan": "ton plan en une ou deux phrases", "type": "plan|parade|tactique", "raison": "pourquoi ce coup", "coup": "Cf3"}`;

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
    list('Tes combinaisons forcées (échecs, prises, jusqu\'au bout) :', forcingLines(fen, color).map(describeForcing)),
    list("Combinaisons forcées de l'adversaire (s'il jouait maintenant) :", forcingLines(fen, opp).map(describeForcing)),
    list('Manœuvres possibles :', findManeuvers(fen, color).map((m) => m.text)),
    ...(lessons.length ? [list('Souvenirs de tes parties précédentes (situations semblables) :',
      recall(lessons, { situation: situationTags(fen, color) }).map(({ lesson: l }) =>
        `${l.titre} — ${l.lecon} Signal : ${l.signal}${l.count > 1 ? ` (erreur commise ${l.count} fois)` : ''}`))] : []),
  ].join('\n\n');
}

/**
 * Choisit le coup du LLM, avec contrôle anti-gaffe et arbitrage.
 * @param {number} before  évaluation (cp, point de vue du LLM) avant le coup
 */
async function llmMove(chess, plan, history, before) {
  const fen = chess.fen();
  const legal = chess.moves().map(toFrenchSan);
  const user = `Tu joues les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'}. Phase : ${detectPhase(fen)}.
FEN : ${fen}
Derniers coups : ${history.slice(-10).map(toFrenchSan).join(' ') || '(début de partie)'}
Ton plan précédent : ${plan || '(aucun)'}

${perception(fen, LLM_COLOR)}

Coups légaux : ${legal.join(' ')}`;

  const oppColor = LLM_COLOR === 'w' ? 'b' : 'w';
  // Position critique ? (menace grave, combinaison forcée, souvenir) → le LLM réfléchit.
  const critical = scanTactics(fen, oppColor).some((t) => t.severity >= 10)
    || forcingLines(fen, LLM_COLOR).length > 0 || forcingLines(fen, oppColor).length > 0
    || (lessons.length > 0 && recall(lessons, { situation: situationTags(fen, LLM_COLOR) }, { k: 1, min: 0.5 }).length > 0);
  const forbidden = new Set();
  const asked = new Set();
  const events = [];
  const pendingRecalls = [];
  const proposed = new Set();
  let illegal = 0;
  let lastError = '';

  for (let attempt = 0; attempt < 7; attempt++) {
    // Relance après alerte, veto ou erreur : toujours avec réflexion.
    const think = THINK === 'on' || (THINK === 'auto' && (critical || attempt > 0));
    if (think) thinkCalls++; else fastCalls++;
    const raw = await complete({ system: SYSTEM, user: lastError ? `${user}\n\n${lastError}` : user }, cfg, { think });
    let parsed;
    try {
      parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '');
    } catch {
      illegal++;
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
    if (!played) {
      illegal++;
      lastError = `Le coup « ${wanted} » est illégal. Choisis exactement un coup de la liste des coups légaux.`;
      continue;
    }
    const fr = toFrenchSan(played.san);
    proposed.add(played.san);
    if (forbidden.has(played.san)) {
      lastError = `${fr} a déjà été refusé par l'arbitre. Choisis un AUTRE coup. Coups refusés : ${[...forbidden].map(toFrenchSan).join(', ')}.`;
      continue;
    }

    const after = new Chess(fen);
    after.move(played.san);
    const danger = [
      ...blunderCheck(after.fen(), LLM_COLOR),
      ...forcingLines(after.fen(), oppColor, { minGain: 2 }).map((l) => ({ text: `ligne forcée ${describeForcing(l)}`, line: l })),
    ];
    const ok = { san: played.san, plan: parsed.plan ?? '', type: parsed.type ?? '', raison: parsed.raison ?? '', illegal, events, pendingRecalls };

    // « Attends, ça me rappelle… » : le coup ressemble-t-il à une erreur passée ?
    const reminder = lessons.length && !asked.has(played.san)
      ? remindsOf(lessons, situationTags(fen, LLM_COLOR), moveTags(fen, played.san)) : null;
    if (reminder) {
      const l = reminder.lesson;
      danger.push({ text: `SOUVENIR — ça te rappelle une erreur passée : « ${l.titre} » : ${l.lecon}` });
      pendingRecalls.push({ id: l.id, san: played.san, titre: l.titre });
      events.push(`💭 souvenir sur ${fr} : ${l.titre}`);
    }
    if (!danger.length) return ok;

    const dangerText = danger.map((d) => d.text).join(' ; ');
    if (!asked.has(played.san)) {
      // 1) « Es-tu sûr ? »
      asked.add(played.san);
      warnings++;
      events.push(`⚑ alerte sur ${fr} : ${dangerText}`);
      lastError = `Contrôle anti-gaffe : après ${fr}, l'adversaire aurait : ${dangerText}.\n`
        + `Es-tu sûr ? Si c'est un sacrifice, explique dans "raison" ce qu'il rapporte concrètement (mat, gain de matériel supérieur, attaque décisive). Sinon choisis un autre coup.`;
      continue;
    }

    // 2) Le LLM confirme : l'arbitre tranche.
    let veto = false;
    let verdict = '';
    if (REFEREE === 'stockfish') {
      const afterEval = -(await evalFor(after.fen()));
      const loss = before - afterEval;
      veto = loss >= VETO_CP;
      verdict = `Stockfish : ${veto ? 'perd' : 'coûte'} environ ${(loss / 100).toFixed(1)} pion(s)`;
    } else if (REFEREE === 'rules') {
      const worst = forcingLines(after.fen(), oppColor, { minGain: 3 })[0];
      veto = Boolean(worst);
      verdict = worst ? `calcul forcé : ${describeForcing(worst)}` : 'calcul forcé : pas de perte démontrée';
    }
    if (veto) {
      forbidden.add(played.san);
      vetoes.push({ n: Math.ceil((history.length + 1) / 2), san: fr, verdict, raison: parsed.raison ?? '' });
      events.push(`⛔ ${fr} refusé (${verdict}) — justification du LLM : ${parsed.raison ?? ''}`);
      lastError = `Coup refusé par l'arbitre : ${fr} (${verdict}). Choisis un autre coup.`;
      continue;
    }
    sacrificesOk++;
    events.push(`✓ ${fr} confirmé malgré l'alerte (${verdict || 'pas d\'arbitre'})`);
    return ok;
  }
  // Trop de tentatives : dernière chance sans alerte, puis le moins coûteux de SES propositions.
  try {
    const raw = await complete({
      system: SYSTEM,
      user: `${user}\n\nDernière chance : choisis un coup légal qui n'a pas été refusé (refusés : ${[...forbidden].map(toFrenchSan).join(', ') || 'aucun'}). Il sera joué tel quel.`,
    }, cfg, { think: true });
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '');
    const wanted = String(parsed.coup ?? '').trim();
    for (const san of [fromFrenchSan(wanted), wanted]) {
      try {
        const m = new Chess(fen).move(san);
        if (m && !forbidden.has(m.san)) {
          events.push(`dernière chance : ${toFrenchSan(m.san)}`);
          return { san: m.san, plan: parsed.plan ?? plan, raison: parsed.raison ?? '', illegal, events, pendingRecalls };
        }
      } catch { /* essai suivant */ }
    }
  } catch { /* on passe au secours */ }
  let any = chess.moves()[0];
  let best = Infinity;
  for (const san of proposed) {
    if (forbidden.has(san)) continue;
    const alt = new Chess(fen);
    alt.move(san);
    const cost = before + (await evalFor(alt.fen()));
    if (cost < best) { best = cost; any = san; }
  }
  events.push(`coup de secours : le moins coûteux de ses propositions (${toFrenchSan(any)})`);
  return { san: any, plan, raison: '(coup de secours)', illegal: illegal + 1, events, pendingRecalls, fallback: true };
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
let sacrificesOk = 0;
const vetoes = [];
const stamp = Date.now();
mkdirSync('reports', { recursive: true });
const pgnPath = `reports/partie-${stamp}.pgn`;
const eventsPath = `reports/partie-${stamp}.log`;
let stopped = false;
process.on('SIGTERM', () => { stopped = true; writeReport(null); process.exit(0); });
console.log(`LLM (${cfg.provider}/${cfg.model}) avec les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'} contre Stockfish ${ELO} Elo`);

while (!chess.isGameOver() && chess.history().length < MAX_MOVES * 2) {
  const fen = chess.fen();
  if (chess.turn() === LLM_COLOR) {
    const before = await evalFor(fen);
    const t0 = Date.now();
    const m = await llmMove(chess, plan, chess.history(), before);
    const secs = ((Date.now() - t0) / 1000).toFixed(0);
    chess.move(m.san);
    // Mat donné : pas de perte (l'évaluation d'une position matée n'a pas de ligne).
    const after = chess.isCheckmate() ? 10000 : -(await evalFor(chess.fen()));
    const loss = Math.max(0, Math.min(1000, before - after));
    const tag = loss >= 300 ? 'gaffe' : loss >= 100 ? 'erreur' : loss >= 50 ? 'imprécision' : '';
    if (plan && m.plan && m.plan !== plan) planChanges++;
    plan = m.plan || plan;
    // Souvenirs rappelés : ont-ils évité une erreur ? (coup abandonné qui aurait coûté ≥ 1 pion)
    for (const r of m.pendingRecalls ?? []) {
      let helped = false;
      if (r.san !== m.san) {
        const alt = new Chess(fen);
        alt.move(r.san);
        helped = before - -(await evalFor(alt.fen())) >= 100;
      }
      markRecall(r.id, helped);
      recalls.push({ n: Math.ceil(chess.history().length / 2), titre: r.titre, abandoned: r.san !== m.san, helped });
      m.events.push(`💭 ${r.titre} : ${r.san !== m.san ? `coup abandonné${helped ? ' — erreur évitée ✓' : ' (il n\'était pas si mauvais)'}` : 'rappel ignoré, coup maintenu'}`);
    }
    let diag = null;
    if (loss >= 100) {
      const played = toFrenchSan(m.san);
      diag = await diagnoseMistake(judge, fen, chess.fen(), { ...m, alerted: m.events.some((e) => e.startsWith(`⚑ alerte sur ${played}`)) });
      m.events.push(`🔎 ${diag.text}`);
    }
    const warned = m.events.some((e) => e.startsWith('⚑'));
    const vetoed = m.events.filter((e) => e.startsWith('⛔')).length;
    log.push({ type: m.type ?? '', fallback: Boolean(m.fallback), n: Math.ceil(chess.history().length / 2), san: toFrenchSan(m.san), sanEn: m.san, fenBefore: fen, fenAfter: chess.fen(), diag, loss, tag, plan: m.plan, raison: m.raison, illegal: m.illegal, evalAfter: after, warned, vetoed, events: m.events });
    console.log(`${String(log.at(-1).n).padStart(2)}. ${log.at(-1).san.padEnd(7)} perte ${String(loss).padStart(4)} ${tag.padEnd(11)}${warned ? '⚑' : ' '}${vetoed ? `⛔${vetoed}` : '  '} ${String(secs).padStart(3)}s ${m.plan.slice(0, 80)}`);
    for (const e of m.events) console.log(`      ${e.slice(0, 200)}`);
    appendFileSync(eventsPath, `${log.at(-1).n}. ${log.at(-1).san} (perte ${loss}) — plan : ${m.plan} — raison : ${m.raison}\n${m.events.map((e) => `   ${e}`).join('\n')}\n`);
    writeFileSync(pgnPath, chess.pgn());
    if (STOP_BEFORE && tag === 'gaffe' && !m.fallback && log.at(-1).n < STOP_BEFORE) {
      console.log(`Arrêt : gaffe au coup ${log.at(-1).n} (avant le coup ${STOP_BEFORE}).`);
      break;
    }
  } else {
    const uci = await opponent.move(fen);
    chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    writeFileSync(pgnPath, chess.pgn());
  }
}
opponent.stop();

// ── Bilan ──
const finalEval = await evalFor(chess.fen()) * (chess.turn() === LLM_COLOR ? 1 : -1);
judge.stop();

// Cohérence du plan, jugée par le relecteur.
let coherence = null;
try {
  const jcfg = judgeConfig();
  const raw = await complete({
    system: `Tu es entraîneur d'échecs. On te donne, coup par coup, le plan annoncé par un joueur et le coup joué. Juge la COHÉRENCE stratégique : le joueur suit-il ses plans, ses changements de plan sont-ils justifiés, ses coups servent-ils le plan annoncé, applique-t-il des principes justes ? Réponds UNIQUEMENT en JSON : {"note": 0-10, "points_forts": ["..."], "points_faibles": ["..."]}`,
    user: log.map((x) => `${x.n}. ${x.san} (perte ${x.loss} cp${x.tag ? `, ${x.tag}` : ''}) — plan : ${x.plan} — raison : ${x.raison}`).join('\n'),
  }, judgeConfig());
  coherence = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? 'null');
} catch (e) {
  coherence = { note: null, points_faibles: [`relecteur indisponible : ${e.message}`] };
}
// Analyse d'après-partie : une leçon par erreur, rangée dans le carnet.
if (REVIEW) {
  for (const x of log.filter((e) => e.loss >= 100 && e.diag?.refutationUci && !e.fallback)) {
    try {
      const r = await learnFromMistake({
        fenBefore: x.fenBefore, san: x.sanEn, fenAfter: x.fenAfter, plan: x.plan, raison: x.raison,
        refutationUci: x.diag.refutationUci, cause: x.diag.cause, loss: x.loss,
      }, cfg);
      learned.push({ n: x.n, san: x.san, ...r });
      console.log(`📓 leçon ${r.action} (coup ${x.n}. ${x.san}) : ${r.lesson.titre} — ${r.lesson.lecon}`);
    } catch (e) {
      console.log(`📓 analyse impossible pour ${x.n}. ${x.san} : ${e.message}`);
    }
  }
}
writeReport(coherence, finalEval);

function writeReport(coherence, finalEval = null) {
  const result = chess.isCheckmate()
    ? (chess.turn() === LLM_COLOR ? 'défaite (mat)' : 'victoire (mat)')
    : chess.isGameOver() ? 'nulle' : `arrêtée au coup ${Math.ceil(chess.history().length / 2)}`;
  const acpl = Math.round(log.reduce((a, x) => a + x.loss, 0) / Math.max(1, log.length));
  const count = (t) => log.filter((x) => x.tag === t).length;
  const illegal = log.reduce((a, x) => a + x.illegal, 0);
  const pgn = chess.pgn();
  const lines = [
    `# Partie : LLM (${cfg.model}) contre Stockfish ${ELO} Elo`, '',
    `- LLM avec les ${LLM_COLOR === 'w' ? 'Blancs' : 'Noirs'} ; résultat : **${result}**${finalEval != null ? ` ; éval finale (pour le LLM) : ${(finalEval / 100).toFixed(1)}` : ''}`,
    `- Arbitre : ${REFEREE} ; vetos : **${vetoes.length}** ; coups confirmés malgré une alerte : ${sacrificesOk} ; alertes : ${warnings}`,
    `- Perte moyenne par coup joué (ACPL) : **${acpl}** ; gaffes : ${count('gaffe')}, erreurs : ${count('erreur')}, imprécisions : ${count('imprécision')}`,
    `- Types de coups : plan ${log.filter((x) => x.type === 'plan').length}, parade ${log.filter((x) => x.type === 'parade').length}, tactique ${log.filter((x) => x.type === 'tactique').length}`,
    `- Réponses illégales : ${illegal} ; changements de plan : ${planChanges} ; réflexion : ${THINK} (appels avec réflexion : ${thinkCalls}, rapides : ${fastCalls})`,
    coherence ? `- Cohérence stratégique (relecteur) : **${coherence.note ?? '?'}/10**` : '',
    '', ...(coherence?.points_forts ?? []).map((x) => `- ✅ ${x}`), ...(coherence?.points_faibles ?? []).map((x) => `- ⚠ ${x}`),
    '', '## Gaffes voulues bloquées par l\'arbitre', '',
    ...(vetoes.length ? vetoes.map((v) => `- coup ${v.n} : ${v.san} — ${v.verdict} — justification : ${v.raison}`) : ['- aucune']),
    '', '## Diagnostic des erreurs (perte ≥ 1 pion)', '',
    ...(() => {
      const diags = log.filter((x) => x.loss >= 100).map((x) => `- ${x.n}. ${x.san} (−${x.loss} cp) : ${x.events.find((e) => e.startsWith('🔎'))?.slice(2).trim() ?? '—'}`);
      return diags.length ? diags : ['- aucune erreur'];
    })(),
    '', '## Carnet de leçons', '',
    `- Leçons disponibles au début de la partie : ${lessons.length} ; rappels : ${recalls.length} (coups abandonnés : ${recalls.filter((r) => r.abandoned).length}, erreurs évitées : ${recalls.filter((r) => r.helped).length})`,
    ...recalls.map((r) => `- coup ${r.n} : « ${r.titre} » — ${r.abandoned ? (r.helped ? 'erreur évitée ✓' : 'coup abandonné') : 'rappel ignoré'}`),
    ...(learned.map((l) => `- 📓 leçon ${l.action} après ${l.n}. ${l.san} : **${l.lesson.titre}** — ${l.lesson.lecon} (signal : ${l.lesson.signal}) [${l.lesson.move.join(', ')} → ${l.lesson.punishment.join(', ') || 'positionnel'}]`)),
    '', '## Coups du LLM', '', '| Coup | Perte (cp) | | Plan annoncé | Raison | Alertes / arbitrage |', '|---|---|---|---|---|---|',
    ...log.map((x) => `| ${x.n}. ${x.san}${x.type ? ` (${x.type})` : ''} | ${x.loss} | ${x.tag} | ${x.plan.replace(/\|/g, '/')} | ${x.raison.replace(/\|/g, '/')} | ${x.events.join(' ; ').replace(/\|/g, '/')} |`),
    '', '## PGN', '', '```', pgn, '```',
  ];
  writeFileSync(`reports/partie-${stamp}.md`, lines.join('\n'));
  writeFileSync(pgnPath, pgn);
  console.log(`\n${result} — ACPL ${acpl}, gaffes ${count('gaffe')}, erreurs ${count('erreur')}, imprécisions ${count('imprécision')}, vetos ${vetoes.length}, illégaux ${illegal}, cohérence ${coherence?.note ?? '?'}/10`);
  console.log(`Rapport : reports/partie-${stamp}.md`);
}
