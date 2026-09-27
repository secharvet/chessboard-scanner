/**
 * Notation algébrique : anglaise (chess.js) ↔ française (R D T F C).
 */

const EN_TO_FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const FR_TO_EN = { R: 'K', D: 'Q', T: 'R', F: 'B', C: 'N' };

/** @param {string} san */
export function toFrenchSan(san) {
  return san
    .replace(/^[KQRBN]/, (c) => EN_TO_FR[c])
    .replace(/=([QRBN])/, (_, c) => `=${EN_TO_FR[c]}`);
}

/** @param {string} san */
export function fromFrenchSan(san) {
  return san
    .replace(/^[RDTFC]/, (c) => FR_TO_EN[c])
    .replace(/=([DTFC])/, (_, c) => `=${FR_TO_EN[c]}`);
}

const PIECE_NAME = { R: 'roi', D: 'dame', T: 'tour', F: 'fou', C: 'cavalier' };

/**
 * Coup français suivi du nom de la pièce en toutes lettres (« Cd4 (cavalier) ») : les LLM confondent
 * facilement les lettres françaises (C, D, F, T), apprises surtout en notation anglaise.
 * @param {string} san
 */
export function withPieceName(san) {
  if (san.startsWith('O-O')) return `${san} (roque)`;
  return `${san} (${PIECE_NAME[san[0]] ?? 'pion'})`;
}
