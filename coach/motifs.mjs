/**
 * Motifs tactiques EXÉCUTÉS dans une ligne de Stockfish.
 *
 * Pour chaque coup du camp qui joue la ligne, on compare les faits tactiques avant/après
 * et on nomme ce que le coup fait : fourchette, clouage, enfilade, découverte, échec double,
 * sacrifice, déviation d'un défenseur surchargé, promotion, mat.
 * Aucune position n'est codée en dur : uniquement la géométrie + la suite de la ligne.
 */

import { Chess } from 'chess.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { toFrenchSan } from './notation.mjs';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };

/**
 * @param {string} fen  position de départ de la ligne
 * @param {string[]} pvUci
 * @param {number} [maxMoves]  nombre de coups du camp au trait à analyser
 * @returns {{ ply: number, san: string, motifs: string[] }[]}
 */
export function lineMotifs(fen, pvUci, maxMoves = 3) {
  const chess = new Chess(fen);
  const mover = chess.turn();
  /** @type {{ san: string, move: import('chess.js').Move, before: string, after: string }[]} */
  const plies = [];
  for (const uci of pvUci.slice(0, maxMoves * 2 + 1)) {
    const before = chess.fen();
    let move;
    try {
      move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
    plies.push({ san: toFrenchSan(move.san), move, before, after: chess.fen() });
  }

  const out = [];
  for (let i = 0; i < plies.length; i += 2) {
    const { move, before, after, san } = plies[i];
    if (move.color !== mover) continue;
    const motifs = [];
    const reply = plies[i + 1];

    if (san.includes('#')) motifs.push('échec et mat');
    if (move.promotion) motifs.push(`promotion en ${NAME[move.promotion]}`);

    const factsBefore = buildTacticalFacts(before);
    const factsAfter = buildTacticalFacts(after);
    const key = (t) => `${t.id}|${JSON.stringify(t.params)}`;
    const known = new Set(factsBefore.map(key));
    const fresh = factsAfter.filter((t) => !known.has(key(t)));
    const opp = mover === 'w' ? 'b' : 'w';

    // Découverte : la pièce jouée était le « masque » d'une découverte possible.
    const disco = factsBefore.find(
      (t) => t.id === 'DECOUVERTE_POSSIBLE' && t.params.color === mover && t.params.mover === move.from
        && t.params.target !== move.to && move.piece !== 'k',
    );
    if (disco) {
      const checkByMover = san.includes('+') && isCheckFrom(after, move.to);
      if (disco.params.check && checkByMover) motifs.push('échec double');
      else motifs.push(disco.params.check ? 'échec à la découverte' : `attaque à la découverte sur ${disco.params.target}`);
    }

    for (const t of fresh) {
      if (t.id === 'FOURCHETTE' && t.params.color === mover && t.params.square === move.to) {
        motifs.push(`fourchette (${t.params.targets})`);
      }
      if (t.id === 'CLOUAGE' && t.params.color === opp && t.params.by === move.to) {
        motifs.push(`clouage de la pièce en ${t.params.square} sur le roi`);
      }
      if (t.id === 'CLOUAGE_RELATIF' && t.params.color === opp && t.params.by === move.to) {
        motifs.push(`clouage de la pièce en ${t.params.square} (pièce plus chère derrière en ${t.params.behind})`);
      }
      if (t.id === 'ENFILADE' && t.params.color === mover && t.params.square === move.to) {
        motifs.push(`enfilade (${t.params.front} puis ${t.params.back})`);
      }
      if (t.id === 'PIECE_PIEGEE' && t.params.color === opp) {
        motifs.push(`piège la pièce adverse en ${t.params.square}`);
      }
    }

    // Déviation : on prend (ou attaque) un défenseur qui était surchargé.
    const overloaded = factsBefore.find(
      (t) => t.id === 'SURCHARGE' && t.params.color === opp && t.params.square === move.to,
    );
    if (overloaded) motifs.push(`élimine ou dévie le défenseur surchargé en ${move.to} (il gardait ${overloaded.params.defends})`);

    // Coup intermédiaire : l'adversaire vient de prendre, et au lieu de reprendre on donne échec
    // (ou on prend ailleurs) avant de revenir.
    const prev = plies[i - 1];
    const isRecapture = Boolean(prev?.move.captured && move.to === prev.move.to);
    const couldRecapture = Boolean(prev?.move.captured)
      && new Chess(before).moves({ verbose: true }).some((m) => m.to === prev.move.to);
    if (couldRecapture && !isRecapture && (san.includes('+') || move.captured)) {
      motifs.push(`coup intermédiaire (${san}) au lieu de reprendre en ${prev.move.to}`);
    }

    // Sacrifice : la pièce jouée est reprise aussitôt, et l'échange coûte du matériel.
    if (reply && reply.move.to === move.to && reply.move.captured) {
      const given = VALUE[move.piece];
      const taken = move.captured ? VALUE[move.captured] : 0;
      if (given - taken >= 2) {
        motifs.push(`sacrifice ${move.piece === 'r' && taken >= 3 ? 'de qualité' : `du ${NAME[move.piece]}`} (${san}, repris par ${reply.san})`);
      }
    } else if (move.captured && !isRecapture && !reply?.move.captured) {
      motifs.push(`gain : prend le ${NAME[move.captured]} en ${move.to}`);
    }

    if (motifs.length) out.push({ ply: i, san, motifs: [...new Set(motifs)] });
  }
  return out;
}

/** La pièce arrivée en `square` donne-t-elle elle-même échec ? */
function isCheckFrom(fen, square) {
  const c = new Chess(fen);
  const king = c.board().flat().find((p) => p && p.type === 'k' && p.color === c.turn());
  return Boolean(king && c.attackers(king.square, c.turn() === 'w' ? 'b' : 'w').includes(square));
}
