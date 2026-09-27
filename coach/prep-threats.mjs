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
import { toFrenchSan } from './notation.mjs';
import { scanTactics } from './threats.mjs';

const THE = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };

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
      out.push({ severity: t.severity, prep, threat: t.san, text: `…${prep} préparerait ${t.text}` });
    }
    if (opts.forcing === true) { // coûteux (jusqu'à 30 s) pour peu de gain mesuré : désactivé par défaut
      for (const l of forcingLines(afterFen, opp, { maxNodes: 3000, max: 1 })) {
        if (nowForcing.has(l.san)) continue;
        out.push({ severity: l.mate ? 90 : 10 + l.gain, prep, threat: l.san, text: `…${prep} préparerait la suite forcée ${describeForcing(l)}` });
      }
    }
    for (const t of buildTacticalFacts(afterFen)) {
      if (t.id !== 'PIECE_PIEGEE' || t.params.color !== me || trappedNow.has(t.params.square)) continue;
      out.push({ severity: 9, prep, threat: `piège ${t.params.square}`, text: `…${prep} piégerait ${THE[t.params.type]} en ${t.params.square} (plus de case de fuite sûre)` });
    }
  }

  // Une ligne par menace ; les coups qui la préparent sont regroupés (« …Cb8 ou …Cb4 »).
  /** @type {Map<string, { severity: number, preps: string[], text: string, threat: string }>} */
  const byThreat = new Map();
  for (const t of out) {
    const cur = byThreat.get(t.threat);
    if (!cur) byThreat.set(t.threat, { severity: t.severity, preps: [t.prep], text: t.text, threat: t.threat });
    else {
      if (!cur.preps.includes(t.prep)) cur.preps.push(t.prep);
      if (t.severity > cur.severity) Object.assign(cur, { severity: t.severity, text: t.text });
    }
  }
  return [...byThreat.values()]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, opts.max ?? 4)
    .map((t) => {
      const preps = t.preps.slice(0, 3).map((p) => `…${p}`).join(' ou ');
      return { ...t, prep: t.preps[0], text: t.text.replace(/^…\S+/, preps) };
    });
}
