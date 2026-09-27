/**
 * Note Stockfish des lignes calculées par NOS outils (calcul forcé, scanner, préparations).
 * Le moteur ne choisit aucun coup : il évalue seulement la position où aboutit la ligne,
 * à faible profondeur — l'« intuition » de la position finale, bien plus juste que le
 * simple décompte du matériel (compensation, activité, sécurité du roi).
 */

import { Chess } from 'chess.js';

const DEPTH = 10;
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Bilan matériel (pions) du point de vue de `side`. */
function material(fen, side) {
  let m = 0;
  for (const ch of fen.split(' ')[0]) {
    const v = VALUE[ch.toLowerCase()];
    if (v != null) m += (ch === ch.toUpperCase()) === (side === 'w') ? v : -v;
  }
  return m;
}

/** Position avec `side` au trait (coup nul si besoin). */
function withTurn(fen, side) {
  const p = fen.split(' ');
  if (p[1] !== side) { p[1] = side; p[3] = '-'; }
  return p.join(' ');
}

/**
 * Évaluation (centipions) du point de vue de `side`.
 * @param {{ analyze: Function }} engine
 */
export async function evalFor(engine, fen, side) {
  const c = new Chess(fen);
  if (c.isCheckmate()) return c.turn() === side ? -10000 : 10000;
  if (c.isDraw()) return 0;
  const [l] = await engine.analyze(fen, { depth: DEPTH, multipv: 1 });
  const cp = l ? toCp(l.score) : 0;
  return c.turn() === side ? cp : -cp;
}

/**
 * Gain réel (en pions, point de vue de `side`) d'une suite de coups jouée par `side` depuis `fen`
 * (`side` mis au trait si besoin : « s'il jouait maintenant »).
 * @param {string[]} sans  coups en notation anglaise (« -- » : coup nul)
 * @returns {Promise<{ gain: number, mate: boolean } | null>}
 */
export async function lineGain(engine, fen, side, sans) {
  let start;
  try { start = new Chess(withTurn(fen, side)); } catch { return null; }
  // Référence : le matériel actuel. (L'évaluation Stockfish du départ inclurait déjà la tactique
  // qu'on veut mesurer, et son « gain » paraîtrait nul.)
  const base = material(start.fen(), side) * 100;
  let c = new Chess(start.fen());
  for (const san of sans) {
    // « -- » = coup nul : l'autre camp ne réagit pas (menaces en préparation).
    if (san === '--') { c = new Chess(withTurn(c.fen(), c.turn() === 'w' ? 'b' : 'w')); continue; }
    try { c.move(san); } catch { break; }
  }
  const end = await evalFor(engine, c.fen(), side);
  return { gain: (end - base) / 100, mate: end >= 9000 };
}

/**
 * Re-note des lignes forcées : `engineGain` ajouté ; on ne garde que celles qui gagnent vraiment.
 * @param {{ pv: string[], mate: boolean }[]} lines
 */
export async function scoreForcingLines(engine, fen, side, lines, minGain = 1) {
  const out = [];
  for (const l of lines) {
    const r = await lineGain(engine, fen, side, l.pv);
    if (!r) continue;
    const scored = { ...l, engineGain: r.gain, mate: l.mate || r.mate };
    if (scored.mate || r.gain >= minGain) out.push(scored);
  }
  return out.sort((a, b) => (b.mate - a.mate) || (b.engineGain - a.engineGain));
}

/**
 * Re-note des menaces du scanner (coup unique) : garde celles qui gagnent vraiment ≥ minGain pion(s).
 * @param {{ sanEn: string, text: string, severity: number }[]} tactics
 */
export async function scoreTactics(engine, fen, side, tactics, minGain = 1) {
  const out = [];
  for (const t of tactics) {
    if (t.severity >= 100) { out.push({ ...t, engineGain: 100 }); continue; } // mat en un : certain
    const r = await lineGain(engine, fen, side, [t.sanEn]);
    if (r && (r.mate || r.gain >= minGain)) {
      out.push({ ...t, engineGain: r.gain, text: `${t.text.replace(/ : gain d'environ \d+ point\(s\)/, '')} (Stockfish : ${r.mate ? 'mat' : `+${r.gain.toFixed(1)} pion(s)`})` });
    }
  }
  return out;
}

/**
 * Re-note des menaces en préparation (coup calme adverse, puis la menace) : garde les vraies.
 * @param {{ seqEn: string[], text: string }[]} preps
 */
export async function scorePrepared(engine, fen, side, preps, minGain = 1) {
  const out = [];
  for (const t of preps) {
    const r = await lineGain(engine, fen, side, t.seqEn);
    if (r && (r.mate || r.gain >= minGain)) {
      out.push({ ...t, engineGain: r.gain, text: `${t.text.replace(/ : gain d'environ \d+ point\(s\)/, '')} (Stockfish : ${r.mate ? 'mat' : `+${r.gain.toFixed(1)} pion(s)`})` });
    }
  }
  return out;
}
