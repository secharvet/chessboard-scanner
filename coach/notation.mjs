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
