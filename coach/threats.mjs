/**
 * Scanner de menaces par règles, à un coup de profondeur (perception, pas recherche) :
 * pour chaque coup possible d'un camp, que gagnerait-il immédiatement ?
 *
 *   mat en un, prise qui gagne du matériel, fourchette, attaque à la découverte,
 *   enfilade, nouveau clouage.
 *
 * Usages : « qu'est-ce qu'il menace ? », « qu'est-ce que je peux gagner ? »,
 * et le contrôle anti-gaffe (« mon coup laisse-t-il quelque chose en prise ? »).
 */

import { Chess } from 'chess.js';
import { buildAttackMap, VALUE } from '../positional/attack-map.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { tr } from '../positional/lang.js';
import { namedPiece } from '../positional/interpreter.js';
import { toFrenchSan, withPieceName } from './notation.mjs';

// Sous-promotions ignorées : pour un débutant, « bxa1=T+ » est du bruit, la menace est la promotion en dame.
const queenOnly = (m) => !m.promotion || m.promotion === 'q';

const THE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const THE_EN = { p: 'the pawn', n: 'the knight', b: 'the bishop', r: 'the rook', q: 'the queen', k: 'the king' };
const THE = new Proxy({}, { get: (_, k) => tr(THE_FR, THE_EN)[k] });

/** Cibles nommées d'une fourchette. */
const targetsOf = (params, color) => {
  const types = String(params.targetTypes ?? '').split(',');
  const names = String(params.targets ?? '').split(',').filter(Boolean).map((s, i) => namedPiece(types[i], color, s));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')}${tr(' et ', ' and ')}${names.at(-1)}` : names[0] ?? '';
};

/**
 * @typedef {{ severity: number, san: string, sanEn: string, text: string }} Tactic
 */

/**
 * Coups tactiques disponibles pour `side`, comme si c'était à lui de jouer.
 * @param {string} fen
 * @param {'w'|'b'} side
 * @param {number} [max]
 * @returns {Tactic[]}
 */
export function scanTactics(fen, side, max = 6) {
  const parts = fen.split(' ');
  if (parts[1] !== side) {
    parts[1] = side;
    parts[3] = '-';
  }
  let chess;
  try {
    chess = new Chess(parts.join(' '));
  } catch {
    return []; // position impossible (ex. le camp adverse est en échec)
  }
  const start = chess.fen();
  const factsBefore = buildTacticalFacts(start);
  const opp = side === 'w' ? 'b' : 'w';
  /** @type {Tactic[]} */
  const out = [];

  for (const m of chess.moves({ verbose: true }).filter(queenOnly)) {
    const after = new Chess(start);
    after.move(m.san);
    const san = toFrenchSan(m.san);
    const sanEn = m.san;
    const said = withPieceName(san); // pour les textes : « Cd4 (cavalier) »
    const afterFen = after.fen();

    if (after.isCheckmate()) {
      out.push({ severity: 100, san, sanEn, text: tr(`${said} est mat`, `${said} is mate`) });
      continue;
    }

    const map = buildAttackMap(afterFen);
    const movedDefended = map.attackersOf(m.to, side).length > 0;
    const movedAttackers = map.attackersOf(m.to, opp);
    const movedHangs = movedAttackers.length > 0
      && (!movedDefended || Math.min(...movedAttackers.map((a) => VALUE[a.type])) < VALUE[m.piece]);

    // Prise : gain net approximatif (on perd la pièce qui prend si la case est défendue).
    if (m.captured) {
      const defended = map.attackersOf(m.to, opp).length > 0;
      const gain = VALUE[m.captured] - (defended ? VALUE[m.piece] : 0);
      if (gain >= 1) {
        out.push({
          severity: 10 + gain,
          san,
          sanEn,
          text: tr(`${said} prend ${THE[m.captured]} en ${m.to}${defended ? '' : ` (non ${m.captured === 'q' || m.captured === 'r' ? 'défendue' : 'défendu'})`} : gain d'environ ${gain} point(s)`,
            `${said} takes ${THE[m.captured]} on ${m.to}${defended ? '' : ' (undefended)'}: gain of about ${gain} point(s)`),
        });
      }
    }

    const factsAfter = buildTacticalFacts(afterFen);
    const key = (t) => `${t.id}|${JSON.stringify(t.params)}`;
    const known = new Set(factsBefore.map(key));
    for (const t of factsAfter) {
      if (known.has(key(t))) continue;
      if (t.id === 'FOURCHETTE' && t.params.color === side && t.params.square === m.to) {
        const check = san.includes('+');
        // Fourchette illusoire si la pièce se fait prendre (même en donnant échec : la prise pare l'échec).
        if (movedHangs) continue;
        out.push({ severity: check ? 9 : 8, san, sanEn, text: tr(`${said} : fourchette sur ${targetsOf(t.params, opp)}${check ? ' avec échec' : ''}`, `${said}: fork on ${targetsOf(t.params, opp)}${check ? ' with check' : ''}`) });
      }
      if (t.id === 'ENFILADE' && t.params.color === side && t.params.square === m.to && !movedHangs) {
        out.push({ severity: 8, san, sanEn, text: tr(`${said} : enfilade sur ${namedPiece(t.params.frontType, opp, t.params.front)} puis ${namedPiece(t.params.backType, opp, t.params.back)}`, `${said}: skewer on ${namedPiece(t.params.frontType, opp, t.params.front)} then ${namedPiece(t.params.backType, opp, t.params.back)}`) });
      }
      // Clouer un simple pion n'est pas une occasion tactique.
      if ((t.id === 'CLOUAGE' || t.id === 'CLOUAGE_RELATIF') && t.params.color === opp && t.params.by === m.to && !movedHangs && t.params.type !== 'p') {
        out.push({ severity: t.id === 'CLOUAGE' ? 6 : 5, san, sanEn, text: tr(`${said} : cloue ${namedPiece(t.params.type, opp, t.params.square)}`, `${said}: pins ${namedPiece(t.params.type, opp, t.params.square)}`) });
      }
    }

    const disco = factsBefore.find(
      (t) => t.id === 'DECOUVERTE_POSSIBLE' && t.params.color === side && t.params.mover === m.from && t.params.target !== m.to,
    );
    if (disco && m.piece !== 'k') {
      const target = map.at[disco.params.target];
      const stillThere = target && target.color === opp;
      if (stillThere && (target.type === 'k' || target.type === 'q' || !map.attackersOf(target.square, opp).length)) {
        out.push({
          severity: target.type === 'k' ? 9 : 8,
          san,
          sanEn,
          text: target.type === 'k' ? tr(`${said} : échec à la découverte`, `${said}: discovered check`)
            : tr(`${said} : attaque à la découverte sur ${THE[target.type]} en ${target.square}`, `${said}: discovered attack on ${THE[target.type]} on ${target.square}`),
        });
      }
    }
  }

  // Un seul motif par coup (le plus grave), coups les plus dangereux d'abord.
  const best = new Map();
  for (const t of out) if (!best.has(t.san) || best.get(t.san).severity < t.severity) best.set(t.san, t);
  return [...best.values()].sort((a, b) => b.severity - a.severity).slice(0, max);
}

/**
 * Contrôle anti-gaffe : après mon coup, l'adversaire a-t-il un gain immédiat sérieux ?
 * @param {string} fenAfterMyMove
 * @param {'w'|'b'} me
 * @returns {Tactic[]}  menaces graves (mat, gain ≥ 2 points, fourchette/découverte)
 */
export function blunderCheck(fenAfterMyMove, me) {
  const opp = me === 'w' ? 'b' : 'w';
  return scanTactics(fenAfterMyMove, opp, 4).filter((t) => t.severity >= 8);
}
