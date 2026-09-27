/**
 * Diagnostic d'une erreur du joueur LLM : pourquoi a-t-il raté la réfutation ?
 *
 *   AVERTI    : l'alerte anti-gaffe l'avait signalée, il a confirmé quand même ;
 *   LISTÉE    : la menace figurait dans ce qu'il avait sous les yeux, il ne l'a pas parée ;
 *   PAS VU    : la réfutation n'apparaissait nulle part (coup calme, ou trop profonde).
 */

import { Chess } from 'chess.js';
import { forcingLines } from './forcing.mjs';
import { toFrenchSan } from './notation.mjs';
import { scanTactics } from './threats.mjs';

/**
 * @param {{ analyze: Function }} engine
 * @param {string} fenBefore  position avant le coup du LLM
 * @param {string} fenAfter   position après
 * @param {{ san: string, plan?: string, raison?: string, alerted?: boolean }} move
 * @returns {Promise<{ cause: string, text: string }>}
 */
export async function diagnoseMistake(engine, fenBefore, fenAfter, move) {
  const me = fenBefore.split(' ')[1];
  const opp = me === 'w' ? 'b' : 'w';
  const [ref] = await engine.analyze(fenAfter, { depth: 14, multipv: 1 });
  if (!ref) return { cause: 'INCONNU', text: 'diagnostic impossible' };
  const c = new Chess(fenAfter);
  const pv = [];
  for (const u of ref.pv.slice(0, 6)) {
    try { pv.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
  }
  if (!pv.length) return { cause: 'INCONNU', text: 'diagnostic impossible' };

  const norm = (x) => x.replace(/[+#]/g, '');
  const refSan = toFrenchSan(pv[0].san);
  const line = pv.map((x) => toFrenchSan(x.san)).join(' ');
  const quiet = !pv[0].captured && !/[+#]/.test(pv[0].san);
  // Coup calme suivi d'une prise ou d'un échec adverse dans les coups suivants : combinaison à coup d'attente.
  const tacticAfterQuiet = quiet && pv.slice(1, 5).some((x, i) => i % 2 === 1 && (x.captured || /[+#]/.test(x.san)));
  const listed = [...scanTactics(fenBefore, opp), ...forcingLines(fenBefore, opp)].map((t) => norm(t.san));
  const mentions = new RegExp(pv[0].to).test(`${move.raison ?? ''} ${move.plan ?? ''}`);

  const cause = move.alerted ? 'AVERTI'
    : listed.includes(norm(refSan)) ? 'LISTÉE'
      : tacticAfterQuiet ? 'PAS VU (coup calme puis tactique)'
        : quiet ? 'PAS VU (coup calme)' : 'PAS VU (tactique profonde)';
  const label = {
    AVERTI: 'averti par l\'anti-gaffe mais a confirmé',
    LISTÉE: 'menace listée avant son coup mais ignorée (focalisé sur son plan)',
    'PAS VU (coup calme)': 'pas vu : réfutation positionnelle par un coup calme',
    'PAS VU (coup calme puis tactique)': 'pas vu : coup calme puis tactique (combinaison à coup d\'attente, hors calcul forcé)',
    'PAS VU (tactique profonde)': 'pas vu : tactique trop profonde ou hors du calcul forcé',
  }[cause];
  return {
    cause,
    text: `${label} — réfutation Stockfish : ${line}${mentions ? ` (sa justification évoquait pourtant ${pv[0].to})` : ''}`,
  };
}
