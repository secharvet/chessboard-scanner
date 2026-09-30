/**
 * Contexte du coach : tout ce que le LLM a le droit d'affirmer, calculé en amont.
 *
 *   Stockfish      → quoi jouer (lignes, évaluations, menace adverse)
 *   positional/    → faits de la position
 *   diff de faits  → pourquoi (ce que chaque ligne change dans la position)
 *
 * Le LLM ne fait que rédiger à partir de ce texte.
 */

import { Chess } from 'chess.js';
import { existsSync } from 'node:fs';
import { extendPv } from './extend-line.mjs';
import { UciEngine } from './uci-engine.mjs';
import { detectPlans } from './plans.mjs';
import { predictIntentions } from './intentions.mjs';
import { buildAllFacts, detectPhase } from '../positional/index.js';
import { buildAttackMap } from '../positional/attack-map.js';
import { renderToken, tokenWeight } from '../positional/interpreter.js';
import { tokenKey } from '../positional/tokens.js';
import { toFrenchSan } from './notation.mjs';
import { tr } from '../positional/lang.js';
import { STRUCTURES, oppositeCastlingPlan } from '../positional/structures.js';
import { buildBalance } from '../positional/balance.js';
import { lineMotifs } from './motifs.mjs';
import { preparedThreats } from './prep-threats.mjs';
import { findManeuvers } from './maneuvers.mjs';
import { scorePrepared } from './engine-eval.mjs';

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Faits trop volatils ou trop bavards pour décrire un plan. */
const DIFF_IGNORED = new Set([
  'PHASE', 'PIECE_MENACEE', 'CASE_FAIBLE', 'EGALITE_MATERIEL', 'AVANTAGE_MATERIEL',
  'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR', 'PIONS_ROI_BOUCLIER', 'ROQUES_OPPOSES',
,
  // Disponibilités (positional/disponibilites.js) : faits d'entraînement, muets dans les textes du coach tant que
  // leur formulation n'a pas été relue (interpreter.js n'a pas encore de phrase pour eux).
  'LEVIER_DISPONIBLE', 'ROUTE_CAVALIER', 'ECHANGE_ABIMANT']);
const STATIC_IGNORED = new Set(['STRUCTURE', 'ROQUES_OPPOSES', 'PHASE', 'EGALITE_MATERIEL', 'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR',
  'LEVIER_DISPONIBLE', 'ROUTE_CAVALIER', 'ECHANGE_ABIMANT']);

/**
 * @typedef {import('./uci-engine.mjs').EngineLine} EngineLine
 * @typedef {{ analyze: (fen: string, opts?: { depth?: number, multipv?: number }) => Promise<EngineLine[]> }} Engine
 */

/**
 * @param {{
 *   fen: string,
 *   side?: 'white' | 'black',
 *   moves?: string[],
 *   engine: Engine,
 *   depth?: number,
 * }} input
 */
export async function buildCoachContext({ fen, side, moves = [], engine, depth = 16, elo = null }) {
  const chess = new Chess(fen);
  const toMove = chess.turn();
  const player = side === 'black' ? 'b' : side === 'white' ? 'w' : toMove;
  const phase = detectPhase(fen);

  if (chess.isGameOver()) {
    return { text: tr(`Partie terminée (${gameOverReason(chess)}).`, `Game over (${gameOverReason(chess)}).`), data: { gameOver: true } };
  }

  const lines = await engine.analyze(fen, { depth, multipv: 3 });
  const candidates = lines.map((l) => describeLine(fen, l, player, toMove));
  const threat = await findThreat(fen, lines[0], engine, toMove, player);
  const allFacts = buildAllFacts(fen);
  const staticFacts = selectStaticFacts(allFacts);
  const heavyPieces = /[RrQq]/.test(fen.split(' ')[0]);
  const balance = buildBalance(allFacts, { heavyPieces });
  // Ce que l'adversaire prépare (un coup calme, puis la menace), noté par Stockfish ;
  // manœuvres sûres vers les cases stratégiques (plans à plus long terme).
  const opp = player === 'w' ? 'b' : 'w';
  const prepared = await scorePrepared(engine, fen, opp, preparedThreats(fen, player, { max: 4 }), 1)
    .catch(() => []);
  const maneuvers = findManeuvers(fen, player, { max: 4 });
  const structures = describeStructures(allFacts, player);
  // Plans vérifiés (coach/plans.mjs) : suites prolongées à 24 demi-coups (une relance légère du moteur),
  // puis contraste entre la meilleure suite et les autres. Les deux camps : « ton plan » et « il veut ».
  const plans = await verifiedPlans(engine, fen, lines).catch(() => ({ w: [], b: [] }));
  // Intentions (modèles entraînés sur les plans humains, coach/intentions.mjs) : ce que les joueurs de ce niveau
  // entreprennent ici, et ce que l'adversaire prépare. Une proposition, pas une explication ; null si le service
  // est absent ou désactivé (COACH_INTENTIONS).
  const intentions = await predictIntentions({ fen, facts: allFacts, elo: { w: elo ?? 1500, b: elo ?? 1500 } });

  const data = { fen, player, toMove, phase, candidates, threat, staticFacts, balance, structures, prepared, maneuvers, moves, plans, intentions, elo };
  const rendered = renderContext(data);
  return { text: rendered.text, data: { ...data, facts: rendered.facts } };
}

// ── Lignes du moteur ──

/**
 * Un plan n'est annoncé que si DEUX moteurs différents le trouvent (Stockfish 19 et 17.1 quand les deux sont
 * installés) : sur 60 plans étiquetés par l'un, l'autre n'en retrouvait que 17 à la même profondeur (29 septembre).
 * Ce qui dépend de la version du moteur n'est pas le plan de la position.
 */
const SECOND_ENGINE = ['/usr/games/stockfish', '/usr/local/bin/stockfish'];
let second = null;
function secondEngine(engine) {
  if (second !== null) return second || null;
  const other = SECOND_ENGINE.find((p) => p !== engine.path && existsSync(p));
  second = other ? new UciEngine({ path: other, threads: engine.threads ?? 1 }) : false;
  return second || null;
}

async function plansWith(engine, fen, lines) {
  const extended = [];
  for (const l of lines) extended.push({ pv: await extendPv(engine, fen, l.pv, { plies: 24, depth: 12, relaunch: 1 }), score: l.score });
  return detectPlans({ fen, lines: extended, plies: 24, maxPly: 12 });
}

async function verifiedPlans(engine, fen, lines) {
  const first = await plansWith(engine, fen, lines);
  const other = engine.path ? secondEngine(engine) : null;
  if (!other) return first;
  const lines2 = await other.analyze(fen, { depth: 16, multipv: 3 });
  const confirm = await plansWith(other, fen, lines2);
  const both = (side) => first[side].filter((p) => confirm[side].some((q) => q.concept === p.concept));
  return { w: both('w'), b: both('b') };
}

/**
 * @param {string} fen
 * @param {EngineLine} line
 * @param {'w'|'b'} player
 * @param {'w'|'b'} toMove
 */
function describeLine(fen, line, player, toMove) {
  const chess = new Chess(fen);
  /** @type {{ san: string, fen: string, capture: boolean, check: boolean }[]} */
  const steps = [];
  for (const uci of line.pv.slice(0, 12)) {
    let m;
    try {
      m = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
    steps.push({ san: toFrenchSan(m.san), fen: chess.fen(), capture: Boolean(m.captured), captured: m.captured, check: m.san.includes('+') });
  }

  // Point d'arrivée « calme » : pas au milieu d'un échange ni d'une série d'échecs. On avance tant que
  // le dernier coup est une prise ou un échec, OU qu'une prise suit dans les deux demi-coups
  // (8.exd5 O-O 9.O-O cxd5 : la reprise n'est pas encore faite après 8...O-O).
  const busy = (k) => steps[k - 1]?.capture || steps[k - 1]?.check || steps[k]?.capture || steps[k + 1]?.capture;
  let end = Math.min(steps.length, 6);
  while (end < steps.length && end < 12 && busy(end)) end++;
  const endFen = end > 0 ? steps[end - 1].fen : fen;

  // Effet IMMÉDIAT du coup : après lui et la réponse adverse (échange terminé), pour ne pas attribuer
  // au premier coup ce que produit la suite de la ligne (le roque qui supprime un clouage, par ex.).
  // L'échange est terminé dès que le demi-coup suivant n'est plus une prise (ni une parade d'échec).
  let imm = Math.min(steps.length, 2);
  while (imm < steps.length && imm < 6 && (steps[imm]?.capture || steps[imm - 1]?.check)) imm++;
  const immFen = imm > 0 ? steps[imm - 1].fen : fen;

  return {
    move: steps[0]?.san ?? line.pv[0],
    pvUci: line.pv.slice(0, steps.length),
    evalPlayer: scoreForPlayer(line.score, toMove, player),
    pvSan: numberedSan(fen, steps.map((s) => s.san)),
    horizonSan: numberedSan(fen, steps.slice(0, end).map((s) => s.san)),
    endKings: kingState(endFen),
    changes: diffFacts(fen, endFen),
    immediateSan: imm < end ? numberedSan(fen, steps.slice(0, imm).map((s) => s.san)) : null,
    immediate: imm < end ? diffFacts(fen, immFen, { tactical: true }) : null,
    basics: firstMoveBasics(fen, steps[0]),
    motifs: lineMotifs(fen, line.pv.slice(0, steps.length)).map((m) => `${m.san} : ${m.motifs.join(', ')}`),
    material: materialBalance(endFen) - materialBalance(fen),
    // Une ligne qui finit par un mat se dit « mat », pas « tu perds 1 point ».
    mates: steps.some((s) => s.san.endsWith('#')),
    // Échange en cours : la ligne commence par une reprise ; matériel une fois l'échange terminé.
    firstCapture: steps[0]?.capture ? steps[0].san : null,
    firstCaptureValue: steps[0]?.captured ? { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }[steps[0].captured] : 0,
    immMaterial: materialBalance(immFen) - materialBalance(fen),
  };
}

/**
 * Menace adverse : ce que l'adversaire jouerait si le camp au trait « passait son tour ».
 * Signalée seulement si passer coûterait au moins 1,5 pion.
 */
async function findThreat(fen, best, engine, toMove, player) {
  const chess = new Chess(fen);
  if (chess.inCheck() || !best) return null;

  const parts = fen.split(' ');
  parts[1] = toMove === 'w' ? 'b' : 'w';
  parts[3] = '-';
  const nullFen = parts.join(' ');
  try {
    new Chess(nullFen);
  } catch {
    return null;
  }

  const [line] = await engine.analyze(nullFen, { depth: 12, multipv: 1 });
  if (!line) return null;

  const opp = toMove === 'w' ? 'b' : 'w';
  const bestForMover = toCp(best.score);
  const nullForOpp = toCp(line.score);
  if (nullForOpp + bestForMover < 150) return null;

  const threatLine = describeLine(nullFen, line, opp, opp);
  return {
    move: threatLine.move,
    line: threatLine.horizonSan,
    pvUci: threatLine.pvUci,
    by: opp === player ? 'toi' : "l'adversaire",
    material: threatLine.material,
    mates: threatLine.mates,
  };
}

// ── Effets élémentaires du premier coup (pour débutants) ──

/**
 * Ce que le coup fait « à l'œil » : cases centrales contrôlées, pièces libérées (mobilité gagnée).
 * @param {string} fen
 * @param {{ fen: string } | undefined} step  position après le coup
 */
function firstMoveBasics(fen, step) {
  if (!step) return [];
  const mover = fen.split(' ')[1];
  const NAME = { n: 'cavalier', b: 'fou', r: 'tour', q: 'dame' };
  const NAME_EN = { n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
  const before = buildAttackMap(fen);
  const after = buildAttackMap(step.fen);
  const out = [];
  const center = ['d4', 'e4', 'd5', 'e5'];
  const occ = (map) => center.filter((s) => map.at[s]?.color === mover);
  const ctl = (map) => center.filter((s) => map.attackersOf(s, mover).length > 0);
  const occupied = occ(after).filter((s) => !occ(before).includes(s));
  const controlled = ctl(after).filter((s) => !ctl(before).includes(s) && !occupied.includes(s));
  if (occupied.length) out.push(tr(`occupe la case centrale ${occupied.join(', ')}`, `occupies the central square ${occupied.join(', ')}`));
  if (controlled.length) out.push(tr(`contrôle (attaque) ${controlled.length > 1 ? 'les cases centrales' : 'la case centrale'} ${controlled.join(', ')}`, `controls (attacks) the central square${controlled.length > 1 ? 's' : ''} ${controlled.join(', ')}`));
  for (const p of after.pieces) {
    if (p.color !== mover || !NAME[p.type]) continue;
    const old = before.pieces.find((q) => q.square === p.square && q.type === p.type && q.color === mover);
    if (!old) continue; // pièce qui vient de bouger : pas une « libération »
    const delta = after.mobility(p) - before.mobility(old);
    if (delta >= 3) out.push(tr(`libère ${NAME[p.type] === 'dame' ? 'la' : NAME[p.type] === 'tour' ? 'la' : 'le'} ${NAME[p.type]} ${p.square} (+${delta} cases)`, `frees the ${NAME_EN[p.type]} on ${p.square} (+${delta} squares)`));
  }
  return out;
}

// ── Structures ──

/** Plans classiques des structures reconnues, formulés du point de vue du joueur. */
function describeStructures(facts, player) {
  const out = [];
  for (const f of facts) {
    if (f.id === 'ROQUES_OPPOSES') out.push({ label: tr('roques opposés', 'opposite-side castling'), plans: [oppositeCastlingPlan()] });
    if (f.id !== 'STRUCTURE') continue;
    const s = STRUCTURES[/** @type {string} */ (f.params.name)];
    if (!s) continue;
    const mine = f.params.color === player;
    out.push({
      label: tr(`${s.label} — ${mine ? 'chez toi' : "chez l'adversaire"}`, `${s.label} — ${mine ? 'yours' : "the opponent's"}`),
      plans: tr([
        `Plan du camp qui a cette structure (${mine ? 'toi' : "l'adversaire"}) : ${s.owner}`,
        `Plan de l'autre camp (${mine ? "l'adversaire" : 'toi'}) : ${s.opponent}`,
      ], [
        `Plan for the side that has this structure (${mine ? 'you' : 'the opponent'}): ${s.owner}`,
        `Plan for the other side (${mine ? 'the opponent' : 'you'}): ${s.opponent}`,
      ]),
    });
  }
  return out;
}

// ── Faits ──

/** Faits qui apparaissent / disparaissent entre deux positions. */
function diffFacts(fenBefore, fenAfter, { tactical = false } = {}) {
  // Pour l'effet immédiat d'un coup, on garde les faits tactiques (pièce qui n'est plus en prise…).
  const ignored = (f) => DIFF_IGNORED.has(f.id) && !(tactical && f.id === 'PIECE_MENACEE');
  const before = buildAllFacts(fenBefore).filter((f) => !ignored(f));
  const after = buildAllFacts(fenAfter).filter((f) => !ignored(f));
  const beforeKeys = new Set(before.map(tokenKey));
  const afterKeys = new Set(after.map(tokenKey));

  const byWeight = (a, b) => tokenWeight(b) - tokenWeight(a);
  const gained = after.filter((f) => !beforeKeys.has(tokenKey(f))).sort(byWeight);
  const lost = before.filter((f) => !afterKeys.has(tokenKey(f))).sort(byWeight);
  return {
    gained: dedupeText(gained).slice(0, 4),
    lost: dedupeText(lost).slice(0, 4),
  };
}

function selectStaticFacts(facts) {
  const kept = facts
    .filter((f) => !STATIC_IGNORED.has(f.id) && tokenWeight(f) >= 4)
    .sort((a, b) => tokenWeight(b) - tokenWeight(a));
  return dedupeText(kept).slice(0, 16);
}

/** @param {import('../positional/tokens.js').PositionalToken[]} facts */
function dedupeText(facts) {
  return [...new Set(facts.map(renderToken))];
}

// ── Utilitaires ──

/** Rois et droits de roque : ce qui change le plus souvent entre « maintenant » et « après la ligne ». */
function kingState(fen) {
  const [board, , castling] = fen.split(' ');
  const find = (ch) => {
    const rows = board.split('/');
    for (let r = 0; r < 8; r++) {
      let f = 0;
      for (const c of rows[r]) {
        if (/\d/.test(c)) f += Number(c);
        else {
          if (c === ch) return `${'abcdefgh'[f]}${8 - r}`;
          f++;
        }
      }
    }
    return '?';
  };
  const rights = (up) => {
    const r = [];
    if (castling.includes(up ? 'K' : 'k')) r.push('petit');
    if (castling.includes(up ? 'Q' : 'q')) r.push('grand');
    return r.length ? tr(`roque encore possible (${r.join(' et ')})`, `can still castle (${r.join(' and ')})`) : tr('ne peut plus roquer', 'can no longer castle');
  };
  return tr(`roi blanc en ${find('K')} (${rights(true)}), roi noir en ${find('k')} (${rights(false)})`,
    `white king on ${find('K')} (${rights(true)}), black king on ${find('k')} (${rights(false)})`);
}

function materialBalance(fen) {
  let total = 0;
  for (const ch of fen.split(' ')[0]) {
    const v = PIECE_VALUE[ch.toLowerCase()];
    if (v != null) total += ch === ch.toUpperCase() ? v : -v;
  }
  return total; // positif = avantage blanc
}

/** @param {import('./uci-engine.mjs').Score} s */
function toCp(s) {
  if (s.type === 'mate') return s.value > 0 ? 10_000 - s.value : -10_000 - s.value;
  return s.value;
}

function scoreForPlayer(score, toMove, player) {
  const sign = toMove === player ? 1 : -1;
  if (score.type === 'mate') return { type: 'mate', value: sign * score.value };
  return { type: 'cp', value: sign * score.value };
}

function formatEval(e) {
  if (e.type === 'mate') {
    return e.value > 0 ? tr(`mat pour toi en ${e.value}`, `mate for you in ${e.value}`) : tr(`mat contre toi en ${-e.value}`, `mate against you in ${-e.value}`);
  }
  const p = e.value / 100;
  const abs = Math.abs(p);
  const tier = abs < 0.4 ? tr('égalité', 'equal') : abs < 1.2 ? tr('léger avantage', 'slight advantage') : abs < 2.5 ? tr('net avantage', 'clear advantage') : tr('avantage décisif', 'decisive advantage');
  const who = abs < 0.4 ? '' : p > 0 ? tr(' pour toi', ' for you') : tr(" pour l'adversaire", ' for the opponent');
  return `${p > 0 ? '+' : ''}${p.toFixed(1)} (${tier}${who})`;
}

function formatMaterial(delta, player) {
  const forPlayer = player === 'w' ? delta : -delta;
  if (forPlayer === 0) return tr('matériel inchangé', 'material unchanged');
  return forPlayer > 0 ? tr(`tu gagnes ${forPlayer} point(s) de matériel`, `you win ${forPlayer} point(s) of material`) : tr(`tu perds ${-forPlayer} point(s) de matériel`, `you lose ${-forPlayer} point(s) of material`);
}

function numberedSan(fen, sans) {
  if (!sans.length) return '';
  const parts = fen.split(' ');
  let n = Number(parts[5]) || 1;
  let white = parts[1] === 'w';
  const out = [];
  sans.forEach((san, i) => {
    if (white) out.push(`${n}. ${san}`);
    else out.push(i === 0 ? `${n}... ${san}` : san);
    if (!white) n++;
    white = !white;
  });
  return out.join(' ');
}

function gameOverReason(chess) {
  if (chess.isCheckmate()) return tr('échec et mat', 'checkmate');
  if (chess.isStalemate()) return tr('pat', 'stalemate');
  if (chess.isThreefoldRepetition()) return tr('répétition', 'repetition');
  if (chess.isInsufficientMaterial()) return tr('matériel insuffisant', 'insufficient material');
  return tr('nulle', 'draw');
}

/** Le matériel et l'évaluation racontent-ils deux histoires différentes ? */
function materialVsEval(d) {
  const best = d.candidates[0]?.evalPlayer;
  if (!best || best.type !== 'cp') return null;
  const sign = d.player === 'w' ? 1 : -1;
  const mat = materialBalance(d.fen) * sign;
  const ev = best.value / 100;
  // Échange pas terminé (l'adversaire vient de prendre, tu reprends) : le bilan actuel est trompeur.
  const c0 = d.candidates[0];
  if (d.toMove === d.player && c0?.firstCapture && mat <= -1) {
    const after = mat + c0.immMaterial * sign;
    // Échange en cours = l'adversaire vient de prendre. Sans historique, on exige que la reprise
    // rétablisse le matériel (sinon c'est une simple prise, pas la fin d'un échange).
    const last = d.moves.at(-1);
    // Sans historique : la prise elle-même doit combler le retard (on reprend la dame qu'on vient de perdre).
    const pending = last ? /x/.test(last) && after > mat : after >= 0 && c0.firstCaptureValue >= -mat;
    if (pending) {
      return tr(
        `Un échange est en cours : pour l'instant tu as ${-mat} point(s) de matériel en moins, mais tu peux reprendre tout de suite (${toFrenchSan(c0.firstCapture)}) ; une fois l'échange terminé, ${after === 0 ? 'le matériel est égal' : after > 0 ? `tu as ${after} point(s) en plus` : `tu as encore ${-after} point(s) en moins`}.`,
        `An exchange is in progress: right now you are ${-mat} point(s) of material down, but you can recapture immediately (${toFrenchSan(c0.firstCapture)}); once the exchange is over, ${after === 0 ? 'material is equal' : after > 0 ? `you are ${after} point(s) up` : `you are still ${-after} point(s) down`}.`,
      );
    }
  }
  if (mat >= 1 && ev < 0.5) {
    return tr(
      `Tu as ${mat} point(s) de matériel en plus, mais le moteur juge la position ${ev < -0.4 ? 'défavorable' : 'égale (probablement nulle)'} : l'avantage matériel ne suffit pas ici, c'est l'idée principale à expliquer.`,
      `You are ${mat} point(s) of material up, but the engine judges the position ${ev < -0.4 ? 'unfavourable' : 'equal (probably drawn)'}: the material advantage is not enough here, that is the main idea to explain.`,
    );
  }
  if (mat <= -1 && ev > -0.5) {
    return tr(
      `Tu as ${-mat} point(s) de matériel en moins, mais le moteur juge la position ${ev > 0.4 ? 'favorable' : 'égale'} : tu as une compensation (activité, initiative, structure).`,
      `You are ${-mat} point(s) of material down, but the engine judges the position ${ev > 0.4 ? 'favourable' : 'equal'}: you have compensation (activity, initiative, structure).`,
    );
  }
  return null;
}

// ── Rendu texte (entrée du LLM) ──

/**
 * Chaque affirmation vérifiable reçoit un identifiant ([E1], [L2], [F7]…) que le coach doit citer.
 * @returns {{ text: string, facts: Record<string, string> }}
 */
function renderContext(d) {
  const colorName = (c) => (c === 'w' ? tr('Blancs', 'White') : tr('Noirs', 'Black'));
  const none = tr('- (rien de notable)', '- (nothing notable)');
  const out = [];
  /** @type {Record<string, string>} */
  const facts = {};
  let n = 0;
  const cite = (text, prefix = 'F') => {
    const id = prefix === 'F' ? `F${++n}` : prefix;
    facts[id] = text;
    out.push(`- [${id}] ${text}`);
  };

  out.push('## Situation');
  out.push(tr(`- Tu joues les ${colorName(d.player)}. Trait aux ${colorName(d.toMove)}. Phase : ${d.phase}.`,
    `- You play ${colorName(d.player)}. ${colorName(d.toMove)} to move. Phase: ${d.phase}.`));
  if (d.moves.length) out.push(`${tr('- Derniers coups : ', '- Last moves: ')}${d.moves.slice(-8).map(toFrenchSan).join(' ')}`);
  cite(`${tr('[Position actuelle]', '[Current position]')} ${kingState(d.fen)}.`, 'E0');
  if (d.candidates[0]) cite(`${tr('Évaluation Stockfish, de TON point de vue (positif = bon pour toi) : ', 'Stockfish evaluation, from YOUR point of view (positive = good for you): ')}${formatEval(d.candidates[0].evalPlayer)}.`, 'E1');
  const note = materialVsEval(d);
  if (note) cite(note, 'E2');

  out.push('');
  if (d.toMove === d.player) {
    out.push(tr('## Coups candidats (Stockfish, du meilleur au moins bon) — c\'est à TOI de jouer', '## Candidate moves (Stockfish, best first) — it is YOUR move'));
  } else {
    out.push(tr("## Coups candidats — c'est à l'ADVERSAIRE de jouer : chaque ligne commence par un de SES meilleurs coups selon Stockfish, puis ta réponse. Ton coup à jouer est le 2e coup de la ligne, APRÈS son coup.",
      "## Candidate moves — it is the OPPONENT's move: each line starts with one of THEIR best moves according to Stockfish, then your answer. Your move to play is the 2nd move of the line, AFTER theirs."));
  }
  d.candidates.forEach((c, i) => {
    const L = `L${i + 1}`;
    out.push(`### ${i + 1}. ${c.move} — ${formatEval(c.evalPlayer)}`);
    cite(`${tr('Ligne', 'Line')} ${i + 1}${tr(' : ', ': ')}${c.pvSan} (${formatEval(c.evalPlayer)}).`, L);
    const after = tr(`[Après la ligne ${i + 1}, au bout de « ${c.horizonSan} »]`, `[After line ${i + 1}, at the end of "${c.horizonSan}"]`);
    // Matériel perdu (ou gagné) mais évaluation proche de la meilleure : compensation, pas une gaffe.
    const forPlayer = d.player === 'w' ? c.material : -c.material;
    const best = d.candidates[0]?.evalPlayer;
    const close = best && best.type === 'cp' && c.evalPlayer.type === 'cp' && best.value - c.evalPlayer.value <= 50;
    const comp = forPlayer <= -1 && close
      ? tr(" (le moteur juge ce matériel compensé : activité, initiative ou attaque — ce n'est pas une perte sèche)",
        ' (the engine judges this material compensated: activity, initiative or attack — not a plain loss)')
      : '';
    const mateNote = c.mates ? tr(' ; la ligne complète se termine par un ÉCHEC ET MAT', '; the full line ends in CHECKMATE') : '';
    cite(`${after} ${formatMaterial(c.material, d.player)}${comp}${mateNote}${tr(' ; ', '; ')}${c.endKings}.`, `${L}m`);
    const APPEARS = tr('apparaît : ', 'appears: ');
    const GONE = tr("n'est plus vrai : ", 'no longer true: ');
    (c.motifs ?? []).forEach((m, j) => cite(tr(`[Pendant la ligne ${i + 1}] Motif tactique : ${m}.`, `[During line ${i + 1}] Tactical motif: ${m}.`), `${L}t${j + 1}`));
    if (c.basics?.length) cite(tr(`[Effet élémentaire de ${c.move}] ${c.move} ${c.basics.join(' ; ')}.`, `[Elementary effect of ${c.move}] ${c.move} ${c.basics.join('; ')}.`), `${L}b`);
    if (c.immediate) {
      const now = tr(`[Juste après « ${c.immediateSan} » — effet du coup lui-même]`, `[Right after "${c.immediateSan}" — effect of the move itself]`);
      c.immediate.gained.forEach((g, j) => cite(`${now} ${APPEARS}${g}`, `${L}i+${j + 1}`));
      c.immediate.lost.forEach((g, j) => cite(`${now} ${GONE}${g}`, `${L}i-${j + 1}`));
      if (!c.immediate.gained.length && !c.immediate.lost.length) cite(`${now} ${tr('aucun changement positionnel notable.', 'no notable positional change.')}`, `${L}i0`);
    }
    c.changes.gained.forEach((g, j) => cite(`${after} ${APPEARS}${g}`, `${L}+${j + 1}`));
    c.changes.lost.forEach((g, j) => cite(`${after} ${GONE}${g}`, `${L}-${j + 1}`));
  });

  out.push('');
  out.push(tr('## Structure de pions reconnue (plans classiques, connaissance générale)', '## Recognised pawn structure (classical plans, general knowledge)'));
  if (d.structures.length) {
    d.structures.forEach((st, i) => {
      out.push(`### ${st.label}`);
      st.plans.forEach((p, j) => cite(p, `S${i + 1}${'abc'[j]}`));
    });
  } else {
    out.push(tr('- Aucune structure type reconnue.', '- No typical structure recognised.'));
  }

  out.push('');
  out.push(tr('## Menace (position actuelle)', '## Threat (current position)'));
  if (d.threat) {
    cite(tr(
      `Si le camp au trait passait son tour, ${d.threat.by === 'toi' ? 'tu jouerais' : "l'adversaire jouerait"} ${d.threat.move} ` +
      `(ligne : ${d.threat.line} ; ${d.threat.mates ? 'la ligne se termine par un ÉCHEC ET MAT' : formatMaterial(d.threat.material, d.player)}). ` +
      "C'est ce qui arriverait si ce camp ne jouait RIEN, pas après n'importe quel autre coup : ce que donnent les autres coups, ce sont les lignes candidates.",
      `If the side to move passed, ${d.threat.by === 'toi' ? 'you would play' : 'the opponent would play'} ${d.threat.move} ` +
      `(line: ${d.threat.line}; ${d.threat.mates ? 'the line ends in CHECKMATE' : formatMaterial(d.threat.material, d.player)}). ` +
      'This is what would happen if that side played NOTHING, not after any other move: what other moves lead to is given by the candidate lines.',
    ), 'M1');
  } else {
    cite(tr('Aucune menace immédiate significative détectée par le moteur.', 'No significant immediate threat detected by the engine.'), 'M0');
  }

  out.push('');
  const NOW = tr('[Position actuelle]', '[Current position]');
  out.push(tr("## Ce que l'adversaire prépare — [Position actuelle] (un coup calme de sa part, puis la menace, SI TU NE RÉAGIS PAS ; gains notés par Stockfish dans ce cas)",
    '## What the opponent is preparing — [Current position] (one quiet move by them, then the threat, IF YOU DO NOT REACT; gains scored by Stockfish in that case)'));
  if (d.prepared.length) d.prepared.forEach((t, i) => cite(`${NOW} ${t.text}.`, `P${i + 1}`));
  else out.push(none);

  out.push('');
  out.push(tr('## Manœuvres possibles — [Position actuelle] (itinéraires sûrs vers des cases stratégiques, plans à plus long terme)',
    '## Possible manoeuvres — [Current position] (safe routes towards strategic squares, longer-term plans)'));
  if (d.maneuvers.length) {
    // Compatible si le premier pas de la manœuvre apparaît dans une ligne du moteur.
    const inLines = (m) => d.candidates.some((c) => (c.pvUci ?? []).some((u) => u.slice(0, 4) === m.path[0] + m.path[1]));
    d.maneuvers.forEach((m, i) => cite(`${NOW} ${m.text}${inLines(m)
      ? tr(' — son premier pas figure dans une ligne du moteur', ' — its first step appears in an engine line')
      : tr(' — plan à long terme, ABSENT des lignes du moteur : ne pas le conseiller comme coup à jouer', ' — long-term plan, absent from the engine lines: do not advise it as the move to play')}.`, `K${i + 1}`));
  }
  else out.push(none);

  out.push('');
  out.push(tr('## Bilan des déséquilibres — [Position actuelle], AVANT tout coup des lignes', '## Imbalance balance sheet — [Current position], BEFORE any move of the lines'));
  const me = d.player;
  const opp = me === 'w' ? 'b' : 'w';
  const section = (title, items, max) => {
    out.push(`### ${title}`);
    if (!items.length) out.push(none);
    for (const it of items.slice(0, max)) cite(it);
  };
  section(tr('Tes atouts', 'Your assets'), d.balance[me].assets, 8);
  section(tr('Tes faiblesses', 'Your weaknesses'), d.balance[me].weaknesses, 8);
  section(tr("Atouts de l'adversaire", "Opponent's assets"), d.balance[opp].assets, 8);
  section(tr("Faiblesses de l'adversaire", "Opponent's weaknesses"), d.balance[opp].weaknesses, 8);
  section(tr('Contexte général', 'General context'), d.balance.context, 5);

  return { text: out.join('\n'), facts };
}
