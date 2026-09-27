/**
 * Menaces EN PRÉPARATION : « qu'est-ce que l'adversaire prépare ? »
 *
 * Pour chaque coup calme possible de l'adversaire (ni prise ni échec), on regarde quelles
 * menaces NOUVELLES il aurait au coup suivant si on ne réagissait pas : prise gagnante,
 * mat, fourchette, découverte, pièce piégée. C'est le scanner et le calcul forcé appliqués
 * un coup plus loin — ce qui manquait pour voir venir les manœuvres calmes (…h5-h4, …Cd4).
 */

import { Chess } from 'chess.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { describeForcing, forcingLines } from './forcing.mjs';
import { toFrenchSan, withPieceName } from './notation.mjs';
import { scanTactics } from './threats.mjs';

const THE = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };

const FILES_ = 'abcdefgh';
const dist = (a, b) => Math.max(Math.abs(FILES_.indexOf(a[0]) - FILES_.indexOf(b[0])), Math.abs(Number(a[1]) - Number(b[1])));

/**
 * Coups calmes adverses « qui vont quelque part » (élagage humain) : pion qui avance vers une de
 * mes pièces ou mon roi, pièce qui se rapproche de mon roi ou d'une de mes pièces.
 */
function purposeful(board, move, me) {
  const mine = board.board().flat().filter((p) => p && p.color === me && p.type !== 'p');
  if (!mine.length) return false;
  const closest = (sq) => Math.min(...mine.map((p) => dist(sq, p.square)));
  return closest(move.to) < closest(move.from) && closest(move.to) <= 3;
}

/**
 * Menaces à DEUX coups calmes (…h5 puis …h4) : l'adversaire joue deux coups calmes « qui vont
 * quelque part » pendant que je ne réagis pas, puis la menace. Élagage : 8 coups par étage.
 * @param {string} fen
 * @param {'w'|'b'} me
 */
export function preparedThreats2(fen, me, { max = 4, width = 8 } = {}) {
  const opp = me === 'w' ? 'b' : 'w';
  const withTurn = (f, c) => { const p = f.split(' '); if (p[1] !== c) { p[1] = c; p[3] = '-'; } return p.join(' '); };
  let start;
  try { start = new Chess(withTurn(fen, opp)); } catch { return []; }
  const now = new Set(scanTactics(start.fen(), opp, 10).map((t) => t.san));
  const dots = opp === 'b' ? '…' : '';
  const quiet = (b) => b.moves({ verbose: true })
    .filter((m) => !m.captured && !/[+#]/.test(m.san) && !m.promotion && purposeful(b, m, me))
    .slice(0, width);
  const out = [];
  for (const m1 of quiet(start)) {
    const b1 = new Chess(start.fen());
    b1.move(m1.san);
    let b1o;
    try { b1o = new Chess(withTurn(b1.fen(), opp)); } catch { continue; }
    for (const m2 of quiet(b1o)) {
      const b2 = new Chess(b1o.fen());
      b2.move(m2.san);
      for (const t of scanTactics(b2.fen(), opp, 3)) {
        if (now.has(t.san) || t.severity < 12) continue;
        out.push({
          severity: t.severity, prep: `${toFrenchSan(m1.san)} puis ${dots}${toFrenchSan(m2.san)}`, preps: [toFrenchSan(m1.san)],
          threat: t.san, seqEn: [m1.san, '--', m2.san, '--', t.sanEn],
          text: `${dots}${withPieceName(toFrenchSan(m1.san))} puis ${dots}${withPieceName(toFrenchSan(m2.san))} préparerait ${t.text}`,
        });
      }
    }
  }
  const byThreat = new Map();
  for (const t of out) if (!byThreat.has(t.threat) || byThreat.get(t.threat).severity < t.severity) byThreat.set(t.threat, t);
  return [...byThreat.values()].sort((a, b) => b.severity - a.severity).slice(0, max);
}

/**
 * @param {string} fen
 * @param {'w'|'b'} me  camp qui veut savoir ce que l'adversaire prépare
 * @param {{ max?: number, forcing?: boolean }} [opts]
 * @returns {{ severity: number, prep: string, threat: string, text: string }[]}
 */
export function preparedThreats(fen, me, opts = {}) {
  const opp = me === 'w' ? 'b' : 'w';
  // L'adversaire joue son coup calme : on le met au trait.
  const parts = fen.split(' ');
  if (parts[1] !== opp) {
    parts[1] = opp;
    parts[3] = '-';
  }
  let board;
  try {
    board = new Chess(parts.join(' '));
  } catch {
    return [];
  }
  const start = board.fen();
  const dots = opp === 'b' ? '…' : ''; // les points de suspension désignent un coup NOIR
  const now = new Set(scanTactics(start, opp, 10).map((t) => t.san));
  const nowForcing = opts.forcing === true ? new Set(forcingLines(start, opp, { maxNodes: 4000 }).map((l) => l.san)) : new Set();
  const trappedNow = new Set(
    buildTacticalFacts(fen).filter((t) => t.id === 'PIECE_PIEGEE' && t.params.color === me).map((t) => t.params.square),
  );

  const out = [];
  for (const m of board.moves({ verbose: true })) {
    if (m.captured || /[+#]/.test(m.san) || m.promotion) continue;
    const after = new Chess(start);
    after.move(m.san);
    // Après son coup calme c'est à moi ; on regarde ce qu'il menacerait si je « passais ».
    const afterFen = after.fen();
    const prep = toFrenchSan(m.san);

    for (const t of scanTactics(afterFen, opp, 3)) {
      // Bruit exclu : un pion gagné (sévérité 11) ne vaut pas une alerte ; on garde ≥ 2 points, mat,
      // fourchette, découverte (sévérités 8-9 hors prises).
      if (now.has(t.san) || t.severity < 8 || t.severity === 11) continue;
      out.push({ severity: t.severity, prep, threat: t.san, seqEn: [m.san, '--', t.sanEn], text: `${dots}${withPieceName(prep)} préparerait ${t.text}` });
    }
    if (opts.forcing === true) { // coûteux (jusqu'à 30 s) pour peu de gain mesuré : désactivé par défaut
      for (const l of forcingLines(afterFen, opp, { maxNodes: 3000, max: 1 })) {
        if (nowForcing.has(l.san)) continue;
        out.push({ severity: l.mate ? 90 : 10 + l.gain, prep, threat: l.san, seqEn: [m.san, '--', ...l.pv], text: `${dots}${withPieceName(prep)} préparerait la suite forcée ${describeForcing(l)}` });
      }
    }
    for (const t of buildTacticalFacts(afterFen)) {
      if (t.id !== 'PIECE_PIEGEE' || t.params.color !== me || trappedNow.has(t.params.square)) continue;
      out.push({ severity: 9, prep, threat: `piège ${t.params.square}`, seqEn: [m.san], text: `${dots}${withPieceName(prep)} piégerait ${THE[t.params.type]} en ${t.params.square} (plus de case de fuite sûre)` });
    }
  }

  // Une ligne par menace ; les coups qui la préparent sont regroupés (« …Cb8 ou …Cb4 »).
  /** @type {Map<string, { severity: number, preps: string[], text: string, threat: string }>} */
  const byThreat = new Map();
  for (const t of out) {
    const cur = byThreat.get(t.threat);
    if (!cur) byThreat.set(t.threat, { severity: t.severity, preps: [t.prep], text: t.text, threat: t.threat, seqEn: t.seqEn });
    else {
      if (!cur.preps.includes(t.prep)) cur.preps.push(t.prep);
      if (t.severity > cur.severity) Object.assign(cur, { severity: t.severity, text: t.text, seqEn: t.seqEn });
    }
  }
  return [...byThreat.values()]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, opts.max ?? 4)
    .map((t) => {
      const d = t.text.startsWith('…') ? '…' : '';
      const preps = t.preps.slice(0, 3).map((p) => `${d}${withPieceName(p)}`).join(' ou ');
      return { ...t, prep: t.preps[0], text: t.text.replace(/^…?\S+ \([^)]*\)/, preps) };
    });
}
