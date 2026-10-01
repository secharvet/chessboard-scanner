/**
 * Jugement du coup JOUÉ par l'élève (mode joueur, décision du 30 septembre : l'idée avant le coup, le jugement après).
 *
 * Stockfish évalue la position avant le coup (meilleur coup) et après le coup joué ; la perte est mesurée en points
 * d'espérance de score (0–100, même échelle que le jugement d'exécution des plans humains, seuils de Lichess). Le texte
 * est écrit par le code, et chaque affirmation vient de la ligne du moteur :
 *   - coup du moteur, ou aussi bon : on le dit ;
 *   - perte : la réfutation (le coup adverse qui punit, la pièce perdue, le mat) et le coup qu'il fallait.
 */

import { Chess } from 'chess.js';
import { toFrenchSan } from './notation.mjs';

const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const FEM = { q: true, r: true };

/** Espérance de score (0–100) pour un score du point de vue du joueur (formule de Lichess). */
export function expectedScore(score) {
  if (score.type === 'mate') return score.value > 0 ? 100 : 0;
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * score.value)) - 1);
}

/** Catégorie selon la perte d'espérance de score (seuils de Lichess : 10 imprécision, 20 erreur, 30 gaffe). */
export function category(loss) {
  if (loss < 5) return 'bon';
  if (loss < 10) return 'correct';
  if (loss < 20) return 'imprecision';
  if (loss < 30) return 'erreur';
  return 'gaffe';
}

function pawns(score) {
  if (score.type === 'mate') return score.value > 0 ? `mat en ${score.value}` : `mat contre toi en ${-score.value}`;
  const p = score.value / 100;
  return `${p > 0 ? '+' : ''}${p.toFixed(1).replace('.', ',')}`;
}

const neg = (s) => ({ type: s.type, value: -s.value });
const sameMove = (uci, m) => uci && uci.slice(0, 4) === m.from + m.to && (uci[4] ?? '') === (m.promotion ?? '');

/**
 * @param {{ fen: string, move: string, engine: any, depth?: number }} input  fen AVANT le coup ; move en UCI ou SAN anglaise
 */
export async function judgeMove({ fen, move, engine, depth = 14 }) {
  const board = new Chess(fen);
  const me = board.turn();
  let played;
  try {
    played = /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)
      ? board.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] })
      : board.move(move);
  } catch {
    throw new Error(`coup illégal : ${move}`);
  }
  const playedFr = toFrenchSan(played.san);
  const afterFen = board.fen();

  const [best] = await engine.analyze(fen, { depth, multipv: 1 });
  const bestUci = best?.pv?.[0];
  const isBest = sameMove(bestUci, played);
  let bestSan = null;
  try {
    if (bestUci) bestSan = toFrenchSan(new Chess(fen).move({ from: bestUci.slice(0, 2), to: bestUci.slice(2, 4), promotion: bestUci[4] }).san);
  } catch { /* */ }

  // Après le coup : score du point de vue de l'adversaire (au trait), retourné pour l'élève.
  let afterScore;
  let refutation = [];
  if (board.isCheckmate()) afterScore = { type: 'mate', value: 1 };
  else if (board.isDraw()) afterScore = { type: 'cp', value: 0 };
  else {
    const [l] = await engine.analyze(afterFen, { depth, multipv: 1 });
    afterScore = l ? neg(l.score) : { type: 'cp', value: 0 };
    refutation = l?.pv ?? [];
  }
  const bestScore = best?.score ?? afterScore;
  const loss = isBest ? 0 : Math.max(0, expectedScore(bestScore) - expectedScore(afterScore));
  // L'espérance de score sature quand la position est déjà gagnée (+7,4 → +3,2 ne « coûte » que 17 points) : pour un
  // débutant, perdre une pièce pour rien reste une erreur. Plancher en pions : 1,5 → imprécision, 3 → erreur.
  const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 1000 : -1000) : s.value);
  const drop = isBest ? 0 : cp(bestScore) - cp(afterScore);
  const ORDER = ['bon', 'correct', 'imprecision', 'erreur', 'gaffe'];
  let base = category(loss);
  const floor = drop >= 300 ? 'erreur' : drop >= 150 ? 'imprecision' : 'bon';
  if (ORDER.indexOf(floor) > ORDER.indexOf(base)) base = floor;
  const cat = board.isCheckmate() ? 'mat' : isBest ? 'meilleur' : base;

  const sentences = [];
  if (cat === 'mat') {
    sentences.push(`${playedFr} : échec et mat, bravo !`);
  } else if (cat === 'meilleur') {
    sentences.push(`${playedFr} : c'est le coup du moteur. Bien joué.`);
  } else if (cat === 'bon') {
    sentences.push(`${playedFr} : bon coup, presque aussi bon que ${bestSan}.`);
  } else if (cat === 'correct') {
    sentences.push(`${playedFr} : coup correct. ${bestSan} était un peu plus précis.`);
  } else {
    const label = { imprecision: 'imprécision', erreur: 'erreur', gaffe: 'grosse erreur' }[cat];
    sentences.push(`${playedFr} : ${label}. L'évaluation passe de ${pawns(bestScore)} à ${pawns(afterScore)}.`);
    // La punition : la ligne de l'adversaire après ton coup, lue coup par coup (sa première prise, ou le mat).
    const c = new Chess(afterFen);
    const line = [];
    let punish = null;
    for (const [i, u] of refutation.slice(0, 8).entries()) {
      let m;
      try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
      line.push(toFrenchSan(m.san));
      if (i % 2 === 0 && !punish && m.captured) { punish = { m, i }; break; }
    }
    if (afterScore.type === 'mate' && afterScore.value < 0) {
      sentences.push(`Après ton coup, l'adversaire a un mat : ${line.join(' ')}.`);
    } else if (punish) {
      const t = punish.m.captured;
      sentences.push(`Après ton coup, l'adversaire joue ${line.join(' ')} et prend ${FEM[t] ? 'ta' : 'ton'} ${NAME[t]} en ${punish.m.to}.`);
    } else if (line.length) {
      sentences.push(`La suite du moteur : ${line.slice(0, 4).join(' ')}.`);
    }
    if (bestSan) sentences.push(`Il fallait jouer ${bestSan} (${pawns(bestScore)}).`);
  }

  return {
    move: playedFr, best: bestSan, isBest, category: cat, loss: Math.round(loss * 10) / 10,
    before: bestScore, after: afterScore, text: sentences.join(' '), player: me,
  };
}
