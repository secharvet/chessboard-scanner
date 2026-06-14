/**
 * Stockfish WASM via Web Worker.
 */

import { parseUciInfoLine } from './eval-fr.js';

let workerPromise = null;
let analysisInFlight = false;

function getWorker() {
  if (!workerPromise) {
    workerPromise = Promise.resolve(
      new Worker('/vendor/stockfish/stockfish-nnue-16-single.js'),
    );
  }
  return workerPromise;
}

/**
 * @typedef {{
 *   bestmove: string | null,
 *   score: { type: 'cp' | 'mate', value: number } | null,
 *   pv: string | null,
 *   rawLines: string[],
 *   depthChain: ReturnType<typeof parseUciInfoLine>[],
 *   multiPv: ReturnType<typeof parseUciInfoLine>[],
 * }} EngineResult
 */

/**
 * @param {string} fen
 * @param {{
 *   depth?: number,
 *   movetime?: number,
 *   onProgress?: (partial: EngineResult) => void,
 * }} opts
 * @returns {Promise<EngineResult>}
 */
export async function getEngineMove(fen, opts = {}) {
  if (analysisInFlight) {
    throw new Error('Stockfish est déjà en train d\'analyser une position.');
  }
  analysisInFlight = true;

  const worker = await getWorker();
  const depth = opts.depth ?? 12;
  const movetime = opts.movetime ?? 0;
  const onProgress = opts.onProgress;

  return new Promise((resolve, reject) => {
    let evalInfo = null;
    let pv = null;
    let bestmove = null;
    let settled = false;
    const rawLines = [];
    /** @type {Map<number, ReturnType<typeof parseUciInfoLine>>} */
    const byDepth = new Map();
    /** @type {Map<number, ReturnType<typeof parseUciInfoLine>>} multi-PV : multipv → dernière info à la meilleure profondeur */
    const multiPvBest = new Map();

    const snapshot = () => ({
      bestmove,
      score: evalInfo,
      pv,
      rawLines: [...rawLines],
      depthChain: [...byDepth.values()].sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0)),
      multiPv: [...multiPvBest.values()].sort((a, b) => (a.multipv ?? 0) - (b.multipv ?? 0)),
    });

    const emitProgress = () => {
      onProgress?.(snapshot());
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      analysisInFlight = false;
      worker.removeEventListener('message', onMessage);
      resolve(snapshot());
    };

    const onMessage = (event) => {
      const line = typeof event.data === 'string' ? event.data : '';
      if (!line) return;

      rawLines.push(line);

      if (line.startsWith('info ')) {
        const parsed = parseUciInfoLine(line);
        if (parsed?.depth != null) {
          byDepth.set(parsed.depth, parsed);
          if (parsed.score) evalInfo = parsed.score;
          if (parsed.pv) pv = parsed.pv;
          // Multi-PV : garder la dernière info à la meilleure profondeur
          const prev = multiPvBest.get(parsed.multipv);
          if (!prev || (parsed.depth ?? 0) >= (prev.depth ?? 0)) {
            multiPvBest.set(parsed.multipv, parsed);
          }
        } else {
          const scoreCp = line.match(/\bscore cp (-?\d+)/);
          const scoreMate = line.match(/\bscore mate (-?\d+)/);
          const pvMatch = line.match(/\bpv (.+)/);
          if (scoreMate) evalInfo = { type: 'mate', value: Number(scoreMate[1]) };
          else if (scoreCp) evalInfo = { type: 'cp', value: Number(scoreCp[1]) };
          if (pvMatch) pv = pvMatch[1].trim();
        }
        emitProgress();
        return;
      }

      if (line.startsWith('bestmove ')) {
        const parts = line.split(/\s+/);
        bestmove = parts[1] === '(none)' ? null : parts[1] ?? null;
        emitProgress();
        finish();
      }
    };

    worker.addEventListener('message', onMessage);

    const send = (cmd) => worker.postMessage(cmd);

    send('uci');
    send('setoption name MultiPV value 3');
    send('isready');
    send('ucinewgame');
    send(`position fen ${fen}`);
    if (movetime > 0) send(`go movetime ${movetime}`);
    else send(`go depth ${depth}`);

    setTimeout(() => {
      if (!settled) {
        settled = true;
        analysisInFlight = false;
        worker.removeEventListener('message', onMessage);
        reject(new Error('Stockfish : délai dépassé'));
      }
    }, 60_000);
  }).catch((err) => {
    analysisInFlight = false;
    throw err;
  });
}

/**
 * Analyse la position sans jouer de coup (même moteur que getEngineMove).
 * @param {string} fen
 * @param {Parameters<typeof getEngineMove>[1]} opts
 */
export async function engineReady() {
  try {
    const worker = await getWorker();
    return new Promise((resolve) => {
      const onReady = (event) => {
        if (String(event.data).includes('readyok')) {
          worker.removeEventListener('message', onReady);
          resolve(true);
        }
      };
      worker.addEventListener('message', onReady);
      worker.postMessage('uci');
      worker.postMessage('isready');
      setTimeout(() => {
        worker.removeEventListener('message', onReady);
        resolve(true);
      }, 15_000);
    });
  } catch (err) {
    console.error(err);
    return false;
  }
}
