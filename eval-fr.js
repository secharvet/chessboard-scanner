/**
 * Chaîne Stockfish (UCI) → chess.js → texte français.
 */

import { Chess } from '/vendor/chess.js';
import { buildAllFacts } from './positional/index.js';
import { topAdvice } from './positional/interpreter.js';

/**
 * @param {string} line
 * @returns {{
 *   raw: string,
 *   depth: number | null,
 *   seldepth: number | null,
 *   score: { type: 'cp' | 'mate', value: number } | null,
 *   pv: string | null,
 *   nodes: number | null,
 *   nps: number | null,
 *   timeMs: number | null,
 * } | null}
 */
export function parseUciInfoLine(line) {
  if (!line.startsWith('info ')) return null;

  const depth = line.match(/\bdepth (\d+)/)?.[1];
  const seldepth = line.match(/\bseldepth (\d+)/)?.[1];
  const multipv = line.match(/\bmultipv (\d+)/)?.[1];
  const scoreCp = line.match(/\bscore cp (-?\d+)/);
  const scoreMate = line.match(/\bscore mate (-?\d+)/);
  const pv = line.match(/\bpv (.+)/)?.[1];
  const nodes = line.match(/\bnodes (\d+)/)?.[1];
  const nps = line.match(/\bnps (\d+)/)?.[1];
  const time = line.match(/\btime (\d+)/)?.[1];

  let score = null;
  if (scoreMate) score = { type: 'mate', value: Number(scoreMate[1]) };
  else if (scoreCp) score = { type: 'cp', value: Number(scoreCp[1]) };

  return {
    raw: line,
    depth: depth ? Number(depth) : null,
    seldepth: seldepth ? Number(seldepth) : null,
    multipv: multipv ? Number(multipv) : 1,
    score,
    pv: pv?.trim() ?? null,
    nodes: nodes ? Number(nodes) : null,
    nps: nps ? Number(nps) : null,
    timeMs: time ? Number(time) : null,
  };
}

function uciToMove(uci, promo = 'q') {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci[4] || promo,
  };
}

/**
 * PV UCI → SAN via chess.js.
 * @param {string} fen
 * @param {string | null} pvUci
 */
export function pvUciToChessJsSteps(fen, pvUci) {
  if (!pvUci) return { pvUci: null, steps: [], error: null };

  const chess = new Chess(fen);
  const steps = [];
  for (const uci of pvUci.split(/\s+/).filter(Boolean)) {
    const m = chess.move(uciToMove(uci), { sloppy: true });
    if (!m) {
      return {
        pvUci,
        steps,
        error: `coup illégal après ${steps.length} pli(s) : ${uci}`,
      };
    }
    steps.push({
      uci,
      san: m.san,
      from: m.from,
      to: m.to,
      fen: chess.fen(),
    });
  }
  return { pvUci, steps, error: null };
}

/** @param {string} fen */
export function sideToMoveFromFen(fen) {
  return fen.split(' ')[1] === 'b' ? 'b' : 'w';
}

/**
 * Score UCI : positif = avantage pour le camp qui a le trait.
 * @param {{ type: 'cp' | 'mate', value: number } | null} score
 * @param {'w' | 'b'} sideToMove
 */
export function describeEval(score, sideToMove = 'w') {
  if (!score) return 'Position en cours d\'analyse…';

  const leaderIsWhite =
    score.value > 0 ? sideToMove === 'w' : sideToMove === 'b';
  const leader = leaderIsWhite ? 'les Blancs' : 'les Noirs';

  if (score.type === 'mate') {
    const n = Math.abs(score.value);
    return `Mat pour ${leader} en ${n} coup${n > 1 ? 's' : ''} (selon le moteur).`;
  }

  const abs = Math.abs(score.value / 100);
  let tier;
  if (abs < 0.5) tier = 'Position complètement égale';
  else if (abs < 1.2) tier = 'Léger avantage';
  else if (abs < 2.5) tier = 'Avantage sérieux';
  else tier = 'Avantage décisif (position très favorable)';

  const numeric = score.value / 100;
  const sign = numeric > 0 ? '+' : '';
  const pawnWord = abs >= 1.05 ? 'pions' : 'pion';

  if (abs < 0.5) {
    return `${tier} (score Stockfish ≈ ${sign}${numeric.toFixed(1)} ${pawnWord}).`;
  }

  return `${tier} pour ${leader} (≈ ${abs.toFixed(1)} ${pawnWord}, score Stockfish ${sign}${numeric.toFixed(1)}).`;
}

/**
 * Coup que Stockfish vient de jouer.
 * @param {string | null} uci
 * @param {string} fenBefore
 */
export function describeEnginePlayed(uci, fenBefore) {
  if (!uci || uci.length < 4) return '';
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promo = uci[4];
  const clone = new Chess(fenBefore);
  const m = clone.move({ from, to, promotion: promo || 'q' }, { sloppy: true });
  const side = sideToMoveFromFen(fenBefore);
  const who = side === 'w' ? 'Stockfish (Blancs)' : 'Stockfish (Noirs)';
  if (!m) return `${who} a joué : ${from}→${to}`;
  return `${who} a joué : ${m.san}`;
}

/**
 * @param {ReturnType<typeof parseUciInfoLine>[]} depthChain
 * @param {string} fen
 */
export function depthChainToChessJsPayload(depthChain, fen) {
  if (!Array.isArray(depthChain)) return [];
  return depthChain.map((step) => {
    const pv = pvUciToChessJsSteps(fen, step.pv);
    return {
      depth: step.depth,
      seldepth: step.seldepth,
      score: step.score,
      nodes: step.nodes,
      nps: step.nps,
      timeMs: step.timeMs,
      pvUci: step.pv,
      pvSan: pv.steps.map((s) => s.san).join(' '),
      chessJsSteps: pv.steps,
      chessJsError: pv.error,
    };
  });
}

/**
 * @param {ReturnType<typeof depthChainToChessJsPayload>} chessJsChain
 * @param {'w' | 'b'} sideToMove
 */
export function describeDepthChainHuman(chessJsChain, sideToMove) {
  if (!chessJsChain.length) return 'En attente des lignes « info depth » de Stockfish…';

  return chessJsChain
    .map((step) => {
      const evalText = describeEval(step.score, sideToMove);
      const pv =
        step.pvSan ||
        (step.chessJsError ? `(PV non converti : ${step.chessJsError})` : '—');
      const meta = [
        step.seldepth != null ? `seldepth ${step.seldepth}` : null,
        step.nodes != null ? `${step.nodes} nœuds` : null,
        step.timeMs != null ? `${step.timeMs} ms` : null,
      ]
        .filter(Boolean)
        .join(', ');
      return `Profondeur ${step.depth}${meta ? ` (${meta})` : ''}\n  • ${evalText}\n  • Ligne : ${pv}`;
    })
    .join('\n\n');
}

function getFinalScore(trace) {
  return trace.finalScore ?? trace.depthChain[trace.depthChain.length - 1]?.score ?? null;
}

/**
 * Pipeline complet pour l'UI debug.
 * @param {string} fen
 * @param {{
 *   rawLines: string[],
 *   depthChain: ReturnType<typeof parseUciInfoLine>[],
 *   bestmove: string | null,
 *   finalScore: { type: 'cp' | 'mate', value: number } | null,
 * }} trace
 */
export function buildAnalysisPipeline(fen, trace) {
  const stm = sideToMoveFromFen(fen);
  const chessJsChain = depthChainToChessJsPayload(trace.depthChain, fen);
  const humanChain = describeDepthChainHuman(chessJsChain, stm);
  const playedLine = trace.bestmove ? describeEnginePlayed(trace.bestmove, fen) : '';

  return {
    raw: trace.rawLines.join('\n'),
    chessJs: JSON.stringify(
      { fen, sideToMove: stm, depthChain: chessJsChain, bestmove: trace.bestmove, finalScore: trace.finalScore },
      null,
      2,
    ),
    human: [humanChain, playedLine].filter(Boolean).join('\n\n———\n\n'),
  };
}

/**
 * Mode normal : conseil court (éval + coup).
 * @param {string} fenAnalyzed
 * @param {{
 *   depthChain: ReturnType<typeof parseUciInfoLine>[],
 *   bestmove: string | null,
 *   finalScore: { type: 'cp' | 'mate', value: number } | null,
 * } | null} trace
 * @param {{ thinking?: boolean, playerTurn?: boolean }} opts
 */
export function buildConseil(fenAnalyzed, trace, opts = {}) {
  if (opts.thinking) return 'Le moteur réfléchit…';
  if (!trace) return null;

  const parts = [];

  if (opts.playerTurn && trace.bestmove && fenAnalyzed) {
    parts.push(
      [describeEnginePlayed(trace.bestmove, fenAnalyzed), 'À toi de jouer.']
        .filter(Boolean)
        .join('\n\n'),
    );
  } else {
    const score = getFinalScore(trace);
    if (score) parts.push(describeEval(score, sideToMoveFromFen(fenAnalyzed)));
    if (trace.bestmove) parts.push(describeEnginePlayed(trace.bestmove, fenAnalyzed));
  }

  const posText = topAdvice(buildAllFacts(fenAnalyzed));
  if (posText) parts.unshift(posText);

  return parts.length ? parts.join('\n\n') : null;
}
