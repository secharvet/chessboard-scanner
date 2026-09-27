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
import { buildAllFacts, detectPhase } from '../positional/index.js';
import { buildAttackMap } from '../positional/attack-map.js';
import { renderToken, tokenWeight } from '../positional/interpreter.js';
import { tokenKey } from '../positional/tokens.js';
import { toFrenchSan } from './notation.mjs';
import { STRUCTURES, OPPOSITE_CASTLING_PLAN } from '../positional/structures.js';
import { buildBalance } from '../positional/balance.js';
import { lineMotifs } from './motifs.mjs';
import { preparedThreats } from './prep-threats.mjs';
import { findManeuvers } from './maneuvers.mjs';
import { scorePrepared } from './engine-eval.mjs';

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Faits trop volatils ou trop bavards pour décrire un plan. */
const DIFF_IGNORED = new Set([
  'PHASE', 'PIECE_MENACEE', 'EGALITE_MATERIEL', 'AVANTAGE_MATERIEL',
  'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR', 'PIONS_ROI_BOUCLIER', 'ROQUES_OPPOSES',
]);
const STATIC_IGNORED = new Set(['STRUCTURE', 'ROQUES_OPPOSES', 'PHASE', 'EGALITE_MATERIEL', 'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR']);

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
export async function buildCoachContext({ fen, side, moves = [], engine, depth = 16 }) {
  const chess = new Chess(fen);
  const toMove = chess.turn();
  const player = side === 'black' ? 'b' : side === 'white' ? 'w' : toMove;
  const phase = detectPhase(fen);

  if (chess.isGameOver()) {
    return { text: `Partie terminée (${gameOverReason(chess)}).`, data: { gameOver: true } };
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

  const data = { fen, player, toMove, phase, candidates, threat, staticFacts, balance, structures, prepared, maneuvers, moves };
  const rendered = renderContext(data);
  return { text: rendered.text, data: { ...data, facts: rendered.facts } };
}

// ── Lignes du moteur ──

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
    steps.push({ san: toFrenchSan(m.san), fen: chess.fen(), capture: Boolean(m.captured), check: m.san.includes('+') });
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
  const before = buildAttackMap(fen);
  const after = buildAttackMap(step.fen);
  const out = [];
  const center = ['d4', 'e4', 'd5', 'e5'];
  const ctl = (map) => center.filter((s) => map.attackersOf(s, mover).length > 0 || (map.at[s]?.color === mover && map.at[s].type === 'p'));
  const gained = ctl(after).filter((s) => !ctl(before).includes(s));
  if (gained.length) out.push(`contrôle ou occupe désormais ${gained.length > 1 ? 'les cases centrales' : 'la case centrale'} ${gained.join(', ')}`);
  for (const p of after.pieces) {
    if (p.color !== mover || !NAME[p.type]) continue;
    const old = before.pieces.find((q) => q.square === p.square && q.type === p.type && q.color === mover);
    if (!old) continue; // pièce qui vient de bouger : pas une « libération »
    const delta = after.mobility(p) - before.mobility(old);
    if (delta >= 3) out.push(`libère ${NAME[p.type] === 'dame' ? 'la' : NAME[p.type] === 'tour' ? 'la' : 'le'} ${NAME[p.type]} ${p.square} (+${delta} cases)`);
  }
  return out;
}

// ── Structures ──

/** Plans classiques des structures reconnues, formulés du point de vue du joueur. */
function describeStructures(facts, player) {
  const out = [];
  for (const f of facts) {
    if (f.id === 'ROQUES_OPPOSES') out.push({ label: 'roques opposés', plans: [OPPOSITE_CASTLING_PLAN] });
    if (f.id !== 'STRUCTURE') continue;
    const s = STRUCTURES[/** @type {string} */ (f.params.name)];
    if (!s) continue;
    const mine = f.params.color === player;
    out.push({
      label: `${s.label} — ${mine ? 'chez toi' : "chez l'adversaire"}`,
      plans: [
        `Plan du camp qui a cette structure (${mine ? 'toi' : "l'adversaire"}) : ${s.owner}`,
        `Plan de l'autre camp (${mine ? "l'adversaire" : 'toi'}) : ${s.opponent}`,
      ],
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
    gained: dedupeText(gained).slice(0, 6),
    lost: dedupeText(lost).slice(0, 6),
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
    return r.length ? `roque encore possible (${r.join(' et ')})` : 'ne peut plus roquer';
  };
  return `roi blanc en ${find('K')} (${rights(true)}), roi noir en ${find('k')} (${rights(false)})`;
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
    return e.value > 0 ? `mat pour toi en ${e.value}` : `mat contre toi en ${-e.value}`;
  }
  const p = e.value / 100;
  const abs = Math.abs(p);
  const tier = abs < 0.4 ? 'égalité' : abs < 1.2 ? 'léger avantage' : abs < 2.5 ? 'net avantage' : 'avantage décisif';
  const who = abs < 0.4 ? '' : p > 0 ? ' pour toi' : " pour l'adversaire";
  return `${p > 0 ? '+' : ''}${p.toFixed(1)} (${tier}${who})`;
}

function formatMaterial(delta, player) {
  const forPlayer = player === 'w' ? delta : -delta;
  if (forPlayer === 0) return 'matériel inchangé';
  return forPlayer > 0 ? `tu gagnes ${forPlayer} point(s) de matériel` : `tu perds ${-forPlayer} point(s) de matériel`;
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
  if (chess.isCheckmate()) return 'échec et mat';
  if (chess.isStalemate()) return 'pat';
  if (chess.isThreefoldRepetition()) return 'répétition';
  if (chess.isInsufficientMaterial()) return 'matériel insuffisant';
  return 'nulle';
}

/** Le matériel et l'évaluation racontent-ils deux histoires différentes ? */
function materialVsEval(d) {
  const best = d.candidates[0]?.evalPlayer;
  if (!best || best.type !== 'cp') return null;
  const mat = materialBalance(d.fen) * (d.player === 'w' ? 1 : -1);
  const ev = best.value / 100;
  if (mat >= 1 && ev < 0.5) {
    return `Tu as ${mat} point(s) de matériel en plus, mais le moteur juge la position ${ev < -0.4 ? 'défavorable' : 'égale (probablement nulle)'} : l'avantage matériel ne suffit pas ici, c'est l'idée principale à expliquer.`;
  }
  if (mat <= -1 && ev > -0.5) {
    return `Tu as ${-mat} point(s) de matériel en moins, mais le moteur juge la position ${ev > 0.4 ? 'favorable' : 'égale'} : tu as une compensation (activité, initiative, structure).`;
  }
  return null;
}

// ── Rendu texte (entrée du LLM) ──

/**
 * Chaque affirmation vérifiable reçoit un identifiant ([E1], [L2], [F7]…) que le coach doit citer.
 * @returns {{ text: string, facts: Record<string, string> }}
 */
function renderContext(d) {
  const colorName = (c) => (c === 'w' ? 'Blancs' : 'Noirs');
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
  out.push(`- Tu joues les ${colorName(d.player)}. Trait aux ${colorName(d.toMove)}. Phase : ${d.phase}.`);
  if (d.moves.length) out.push(`- Derniers coups : ${d.moves.slice(-8).map(toFrenchSan).join(' ')}`);
  cite(`[Position actuelle] ${kingState(d.fen)}.`, 'E0');
  if (d.candidates[0]) cite(`Évaluation Stockfish, de TON point de vue (positif = bon pour toi) : ${formatEval(d.candidates[0].evalPlayer)}.`, 'E1');
  const note = materialVsEval(d);
  if (note) cite(note, 'E2');

  out.push('');
  if (d.toMove === d.player) {
    out.push('## Coups candidats (Stockfish, du meilleur au moins bon) — c\'est à TOI de jouer');
  } else {
    out.push("## Coups candidats — c'est à l'ADVERSAIRE de jouer : chaque ligne commence par un de SES meilleurs coups selon Stockfish, puis ta réponse. Ton coup à jouer est le 2e coup de la ligne, APRÈS son coup.");
  }
  d.candidates.forEach((c, i) => {
    const L = `L${i + 1}`;
    out.push(`### ${i + 1}. ${c.move} — ${formatEval(c.evalPlayer)}`);
    cite(`Ligne ${i + 1} : ${c.pvSan} (${formatEval(c.evalPlayer)}).`, L);
    const after = `[Après la ligne ${i + 1}, au bout de « ${c.horizonSan} »]`;
    cite(`${after} ${formatMaterial(c.material, d.player)} ; ${c.endKings}.`, `${L}m`);
    (c.motifs ?? []).forEach((m, j) => cite(`[Pendant la ligne ${i + 1}] Motif tactique : ${m}.`, `${L}t${j + 1}`));
    if (c.basics?.length) cite(`[Effet élémentaire de ${c.move}] ${c.move} ${c.basics.join(' ; ')}.`, `${L}b`);
    if (c.immediate) {
      const now = `[Juste après « ${c.immediateSan} » — effet du coup lui-même]`;
      c.immediate.gained.forEach((g, j) => cite(`${now} apparaît : ${g}`, `${L}i+${j + 1}`));
      c.immediate.lost.forEach((g, j) => cite(`${now} n'est plus vrai : ${g}`, `${L}i-${j + 1}`));
      if (!c.immediate.gained.length && !c.immediate.lost.length) cite(`${now} aucun changement positionnel notable.`, `${L}i0`);
    }
    c.changes.gained.forEach((g, j) => cite(`${after} apparaît : ${g}`, `${L}+${j + 1}`));
    c.changes.lost.forEach((g, j) => cite(`${after} n'est plus vrai : ${g}`, `${L}-${j + 1}`));
  });

  out.push('');
  out.push('## Structure de pions reconnue (plans classiques, connaissance générale)');
  if (d.structures.length) {
    d.structures.forEach((st, i) => {
      out.push(`### ${st.label}`);
      st.plans.forEach((p, j) => cite(p, `S${i + 1}${'abc'[j]}`));
    });
  } else {
    out.push('- Aucune structure type reconnue.');
  }

  out.push('');
  out.push('## Menace (position actuelle)');
  if (d.threat) {
    cite(
      `Si le camp au trait passait son tour, ${d.threat.by === 'toi' ? 'tu jouerais' : "l'adversaire jouerait"} ${d.threat.move} ` +
      `(ligne : ${d.threat.line} ; ${formatMaterial(d.threat.material, d.player)}).`,
      'M1',
    );
  } else {
    cite('Aucune menace immédiate significative détectée par le moteur.', 'M0');
  }

  out.push('');
  out.push("## Ce que l'adversaire prépare — [Position actuelle] (un coup calme de sa part, puis la menace, SI TU NE RÉAGIS PAS ; gains notés par Stockfish dans ce cas)");
  if (d.prepared.length) d.prepared.forEach((t, i) => cite(`[Position actuelle] ${t.text}.`, `P${i + 1}`));
  else out.push('- (rien de notable)');

  out.push('');
  out.push('## Manœuvres possibles — [Position actuelle] (itinéraires sûrs vers des cases stratégiques, plans à plus long terme)');
  if (d.maneuvers.length) {
    // Compatible si le premier pas de la manœuvre apparaît dans une ligne du moteur.
    const inLines = (m) => d.candidates.some((c) => (c.pvUci ?? []).some((u) => u.slice(0, 4) === m.path[0] + m.path[1]));
    d.maneuvers.forEach((m, i) => cite(`[Position actuelle] ${m.text}${inLines(m) ? ' — son premier pas figure dans une ligne du moteur' : ' — plan à long terme, ABSENT des lignes du moteur : ne pas le conseiller comme coup à jouer'}.`, `K${i + 1}`));
  }
  else out.push('- (rien de notable)');

  out.push('');
  out.push('## Bilan des déséquilibres — [Position actuelle], AVANT tout coup des lignes');
  const me = d.player;
  const opp = me === 'w' ? 'b' : 'w';
  const section = (title, items, max) => {
    out.push(`### ${title}`);
    if (!items.length) out.push('- (rien de notable)');
    for (const it of items.slice(0, max)) cite(it);
  };
  section('Tes atouts', d.balance[me].assets, 8);
  section('Tes faiblesses', d.balance[me].weaknesses, 8);
  section("Atouts de l'adversaire", d.balance[opp].assets, 8);
  section("Faiblesses de l'adversaire", d.balance[opp].weaknesses, 8);
  section('Contexte général', d.balance.context, 5);

  return { text: out.join('\n'), facts };
}
