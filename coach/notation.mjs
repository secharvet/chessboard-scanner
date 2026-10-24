/**
 * Notation algébrique : anglaise (chess.js) ↔ française (R D T F C).
 *
 * `toFrenchSan` / `fromFrenchSan` convertissent vers / depuis la notation DES FAITS : française par
 * défaut, anglaise (identité) quand COACH_LANG=en. `frenchDisplay` convertit un texte anglais final
 * pour l'affichage.
 */

import { factLang } from '../positional/lang.js';

const EN_TO_FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const FR_TO_EN = { R: 'K', D: 'Q', T: 'R', F: 'B', C: 'N' };

/** @param {string} san */
export function toFrenchSan(san) {
  if (factLang() === 'en') return san;
  return enToFr(san);
}

/** @param {string} san coup anglais → coup français, quelle que soit la langue des faits */
export function enToFr(san) {
  return san
    .replace(/^[KQRBN]/, (c) => EN_TO_FR[c])
    .replace(/=([QRBN])/, (_, c) => `=${EN_TO_FR[c]}`);
}

/** @param {string} san */
export function fromFrenchSan(san) {
  if (factLang() === 'en') return san;
  return san
    .replace(/^[RDTFC]/, (c) => FR_TO_EN[c])
    .replace(/=([DTFC])/, (_, c) => `=${FR_TO_EN[c]}`);
}

const PIECE_NAME = { R: 'roi', D: 'dame', T: 'tour', F: 'fou', C: 'cavalier' };
const PIECE_NAME_EN = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight' };

/**
 * Coup français suivi du nom de la pièce en toutes lettres (« Cd4 (cavalier) ») : les LLM confondent
 * facilement les lettres françaises (C, D, F, T), apprises surtout en notation anglaise.
 * @param {string} san
 */
export function withPieceName(san) {
  if (factLang() === 'en') {
    if (san.startsWith('O-O')) return `${san} (castling)`;
    return `${san} (${PIECE_NAME_EN[san[0]] ?? 'pawn'})`;
  }
  if (san.startsWith('O-O')) return `${san} (roque)`;
  return `${san} (${PIECE_NAME[san[0]] ?? 'pion'})`;
}

// Coups anglais dans un texte : pièce (Nf3, Rxe8+, Qd1=…), prise de pion avec promotion (bxa1=Q+),
// poussée avec promotion (e8=Q). Les cases seules et les roques ne changent pas.
const EN_MOVE_RE = /(?<![\w-])([KQRBN][a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?|[a-h]x?[a-h]?[1-8]=[QRBN])([+#]?)(?![\w])/g;

/**
 * Texte final (en français, coups en notation anglaise) → coups en notation française.
 * « Nf3 » → « Cf3 », « Rxe8+ » → « Txe8+ », « bxa1=Q+ » → « bxa1=D+ ».
 * @param {string} text
 */
export function frenchDisplay(text) {
  return text.replace(EN_MOVE_RE, (_, mv, suffix) => `${enToFr(mv)}${suffix}`);
}
