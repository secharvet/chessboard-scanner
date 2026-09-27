/**
 * Motifs tactiques EXÉCUTÉS dans une ligne de Stockfish.
 *
 * Pour chaque coup du camp qui joue la ligne, on compare les faits tactiques avant/après
 * et on nomme ce que le coup fait : fourchette, clouage, enfilade, découverte, échec double,
 * sacrifice, déviation d'un défenseur surchargé, promotion, mat.
 * Aucune position n'est codée en dur : uniquement la géométrie + la suite de la ligne.
 */

import { Chess } from 'chess.js';
import { namedPiece } from '../positional/interpreter.js';
import { tr } from '../positional/lang.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { toFrenchSan } from './notation.mjs';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NAME_FR = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const NAME_EN = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const THE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const THE_EN = { p: 'the pawn', n: 'the knight', b: 'the bishop', r: 'the rook', q: 'the queen', k: 'the king' };
const NAME = new Proxy({}, { get: (_, k) => tr(NAME_FR, NAME_EN)[k] });
const THE = new Proxy({}, { get: (_, k) => tr(THE_FR, THE_EN)[k] });

/**
 * @param {string} fen  position de départ de la ligne
 * @param {string[]} pvUci
 * @param {number} [maxMoves]  nombre de coups du camp au trait à analyser
 * @returns {{ ply: number, san: string, motifs: string[] }[]}
 */
/** « de le fou » → « du fou ». */
const de = (named) => tr(named.replace(/^le /, 'du ').replace(/^la /, 'de la '), named);

/** Cibles d'une fourchette, nommées : « la tour noire en d1 et la tour noire en h1 ». */
function targetsNamed(params, color) {
  const types = String(params.targetTypes ?? '').split(',');
  const names = String(params.targets ?? '').split(',').filter(Boolean).map((s, i) => namedPiece(types[i], color, s));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')}${tr(' et ', ' and ')}${names.at(-1)}` : names[0] ?? tr('deux cibles', 'two targets');
}

export function lineMotifs(fen, pvUci, maxMoves = 3) {
  const chess = new Chess(fen);
  const mover = chess.turn();
  /** @type {{ san: string, move: import('chess.js').Move, before: string, after: string }[]} */
  const plies = [];
  for (const uci of pvUci.slice(0, maxMoves * 2 + 5)) {
    const before = chess.fen();
    let move;
    try {
      move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
    plies.push({ san: toFrenchSan(move.san), move, before, after: chess.fen() });
  }

  // Le gain matériel tient-il encore 4 demi-coups plus tard (pas de reprise différée) ?
  const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  const mat = (f) => {
    let m = 0;
    for (const ch of f.split(' ')[0]) {
      const v = VAL[ch.toLowerCase()];
      if (v != null) m += ((ch === ch.toUpperCase()) === (mover === 'w') ? 1 : -1) * v;
    }
    return m;
  };
  const stillAhead = (i) => {
    const later = plies[Math.min(i + 4, plies.length - 1)];
    return mat(later.after) > mat(plies[i].before);
  };

  const out = [];
  for (let i = 0; i < plies.length; i += 2) {
    const { move, before, after, san } = plies[i];
    if (move.color !== mover) continue;
    const motifs = [];
    const reply = plies[i + 1];

    if (san.includes('#')) motifs.push(tr('échec et mat', 'checkmate'));
    if (move.promotion) motifs.push(tr(`promotion en ${NAME[move.promotion]}`, `promotion to a ${NAME[move.promotion]}`));

    const factsBefore = buildTacticalFacts(before);
    const factsAfter = buildTacticalFacts(after);
    const key = (t) => `${t.id}|${JSON.stringify(t.params)}`;
    const known = new Set(factsBefore.map(key));
    const fresh = factsAfter.filter((t) => !known.has(key(t)));
    const opp = mover === 'w' ? 'b' : 'w';
    // La pièce jouée est-elle prise au coup suivant ? Alors ses « fourchettes », clouages et pièges
    // sont illusoires (Cxc6 bxc6 n'est pas une fourchette sur b4 et d8).
    const movedIsTaken = Boolean(reply && reply.move.captured && reply.move.to === move.to);
    // Sans la réponse adverse (dernier coup de la ligne), on ne conclut rien sur un gain.
    const replyKnown = Boolean(reply);

    // Découverte : la pièce jouée était le « masque » d'une découverte possible.
    const disco = factsBefore.find(
      (t) => t.id === 'DECOUVERTE_POSSIBLE' && t.params.color === mover && t.params.mover === move.from
        && t.params.target !== move.to && move.piece !== 'k',
    );
    if (disco) {
      const checkByMover = san.includes('+') && isCheckFrom(after, move.to);
      if (disco.params.check && checkByMover) motifs.push(tr('échec double', 'double check'));
      else motifs.push(disco.params.check ? tr('échec à la découverte', 'discovered check') : `${tr('attaque à la découverte sur ', 'discovered attack on ')}${namedPiece(disco.params.targetType, opp, disco.params.target)}`);
    }

    for (const t of movedIsTaken ? [] : fresh) {
      if (t.id === 'FOURCHETTE' && t.params.color === mover && t.params.square === move.to) {
        motifs.push(`${tr('fourchette sur ', 'fork on ')}${targetsNamed(t.params, opp)}`);
      }
      if (t.id === 'CLOUAGE' && t.params.color === opp && t.params.by === move.to) {
        motifs.push(tr(`clouage ${de(namedPiece(t.params.type, opp, t.params.square))} sur son roi`, `pin of ${namedPiece(t.params.type, opp, t.params.square)} against its king`));
      }
      if (t.id === 'CLOUAGE_RELATIF' && t.params.color === opp && t.params.by === move.to) {
        motifs.push(tr(`clouage ${de(namedPiece(t.params.type, opp, t.params.square))} (derrière : ${namedPiece(t.params.behindType, opp, t.params.behind)})`, `pin of ${namedPiece(t.params.type, opp, t.params.square)} (behind it: ${namedPiece(t.params.behindType, opp, t.params.behind)})`));
      }
      if (t.id === 'ENFILADE' && t.params.color === mover && t.params.square === move.to) {
        motifs.push(tr(`enfilade sur ${namedPiece(t.params.frontType, opp, t.params.front)} puis ${namedPiece(t.params.backType, opp, t.params.back)}`, `skewer on ${namedPiece(t.params.frontType, opp, t.params.front)} then ${namedPiece(t.params.backType, opp, t.params.back)}`));
      }
      if (t.id === 'PIECE_PIEGEE' && t.params.color === opp) {
        motifs.push(tr(`piège la pièce adverse en ${t.params.square}`, `traps the enemy piece on ${t.params.square}`));
      }
    }

    // Déviation : on prend (ou attaque) un défenseur qui était surchargé.
    const overloaded = factsBefore.find(
      (t) => t.id === 'SURCHARGE' && t.params.color === opp && t.params.square === move.to,
    );
    if (overloaded) motifs.push(tr(`élimine ou dévie le défenseur surchargé en ${move.to} (il gardait ${overloaded.params.defends})`, `removes or deflects the overloaded defender on ${move.to} (it was guarding ${overloaded.params.defends})`));

    // Coup intermédiaire : l'adversaire vient de prendre, et au lieu de reprendre on donne échec
    // (ou on prend ailleurs) avant de revenir.
    const prev = plies[i - 1];
    const isRecapture = Boolean(prev?.move.captured && move.to === prev.move.to);
    const couldRecapture = Boolean(prev?.move.captured)
      && new Chess(before).moves({ verbose: true }).some((m) => m.to === prev.move.to);
    if (couldRecapture && !isRecapture && (san.includes('+') || move.captured)) {
      motifs.push(tr(`coup intermédiaire (${san}) au lieu de reprendre en ${prev.move.to}`, `in-between move (${san}) instead of recapturing on ${prev.move.to}`));
    }

    // Échange ou sacrifice : la pièce jouée est reprise aussitôt.
    if (reply && reply.move.to === move.to && reply.move.captured) {
      const given = VALUE[move.piece];
      const taken = move.captured ? VALUE[move.captured] : 0;
      if (move.captured && Math.abs(given - taken) <= 0) {
        motifs.push(tr(`échange ${NAME[move.piece]} contre ${NAME[move.captured]} (${san}, repris par ${reply.san}) : ni gain ni perte de matériel`, `exchange of ${NAME[move.piece]} for ${NAME[move.captured]} (${san}, recaptured by ${reply.san}): no material gained or lost`));
      } else if (given - taken >= 2) {
        motifs.push(tr(`sacrifice ${move.piece === 'r' && taken >= 3 ? 'de qualité' : `du ${NAME[move.piece]}`} (${san}, repris par ${reply.san})`, `${move.piece === 'r' && taken >= 3 ? 'exchange sacrifice' : `${NAME[move.piece]} sacrifice`} (${san}, recaptured by ${reply.san})`));
      }
    } else if (move.captured && !isRecapture && replyKnown && !reply.move.captured && stillAhead(i)) {
      motifs.push(tr(`gain : prend ${THE[move.captured]} en ${move.to}`, `gain: takes ${THE[move.captured]} on ${move.to}`));
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
