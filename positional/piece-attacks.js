/**
 * Module 6 — Attaques de pièces (menaces, clouages, fourchettes).
 */

import { parseFenPieces } from './fen-board.js';
import { token } from './tokens.js';

// ── Attaques brutes (sans bloqueurs) ──

const KNIGHT_MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];
const KING_MOVES = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
];
const DIAGONALS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const STRAIGHTS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/** @typedef {{ fileIdx: number, rank: number }} Pos */
/** @typedef {import('./fen-board.js').Piece & { attacks: Pos[] }} ArmedPiece */

/**
 * @param {Pos} sq
 * @param {number} df
 * @param {number} dr
 */
function step(sq, df, dr) {
  return { fileIdx: sq.fileIdx + df, rank: sq.rank + dr };
}

function onBoard(sq) {
  return sq.fileIdx >= 0 && sq.fileIdx < 8 && sq.rank >= 1 && sq.rank <= 8;
}

// ── Générateur d'attaques (avec bloqueurs) ──

/**
 * @param {import('./fen-board.js').Piece[]} pieces
 * @returns {{ bySquare: Record<string, ArmedPiece>, byColor: Record<string, ArmedPiece[]> }}
 */
function armedPieces(pieces) {
  /** @type {Record<string, ArmedPiece>} */
  const bySquare = {};
  /** @type {Record<string, ArmedPiece[]>} */
  const byColor = { w: [], b: [] };

  for (const p of pieces) {
    /** @type {ArmedPiece} */
    const armed = { ...p, attacks: [] };
    bySquare[p.square] = armed;
    byColor[p.color].push(armed);
  }

  // Calculer les attaques (avec bloqueurs pour les pièces glissantes)
  for (const p of pieces) {
    const armed = bySquare[p.square];
    const targets = [];

    switch (armed.type) {
      case 'n': // Cavalier
        for (const [df, dr] of KNIGHT_MOVES) {
          const s = step(armed, df, dr);
          if (onBoard(s)) targets.push(s);
        }
        break;

      case 'k': // Roi
        for (const [df, dr] of KING_MOVES) {
          const s = step(armed, df, dr);
          if (onBoard(s)) targets.push(s);
        }
        break;

      case 'p': // Pion — diagonales avant
        {
          const dr = armed.color === 'w' ? 1 : -1;
          for (const df of [-1, 1]) {
            const s = step(armed, df, dr);
            if (onBoard(s)) targets.push(s);
          }
        }
        break;

      case 'b': // Fou — diagonales
        for (const [df, dr] of DIAGONALS) {
          let sq = step(armed, df, dr);
          while (onBoard(sq)) {
            targets.push({ ...sq });
            if (bySquare[`${'abcdefgh'[sq.fileIdx]}${sq.rank}`]) break;
            sq = step(sq, df, dr);
          }
        }
        break;

      case 'r': // Tour — lignes droites
        for (const [df, dr] of STRAIGHTS) {
          let sq = step(armed, df, dr);
          while (onBoard(sq)) {
            targets.push({ ...sq });
            if (bySquare[`${'abcdefgh'[sq.fileIdx]}${sq.rank}`]) break;
            sq = step(sq, df, dr);
          }
        }
        break;

      case 'q': // Dame — diagonales + droites
        for (const dirs of [DIAGONALS, STRAIGHTS]) {
          for (const [df, dr] of dirs) {
            let sq = step(armed, df, dr);
            while (onBoard(sq)) {
              targets.push({ ...sq });
              if (bySquare[`${'abcdefgh'[sq.fileIdx]}${sq.rank}`]) break;
              sq = step(sq, df, dr);
            }
          }
        }
        break;
    }

    armed.attacks = targets;
  }

  return { bySquare, byColor };
}

// ── Faits tactiques ──

/**
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildTacticalFacts(fen) {
  const { pieces } = parseFenPieces(fen);
  const { bySquare } = armedPieces(pieces);
  /** @type {import('./tokens.js').PositionalToken[]} */
  const out = [];

  // ── PIECE_MENACEE ──
  /** @type {Set<string>} */
  const menaced = new Set();
  for (const p of pieces) {
    const square = p.square;
    for (const defender of pieces) {
      if (defender.color === p.color) continue;
      const armed = bySquare[defender.square];
      if (!armed) continue;
      if (armed.attacks.some((a) => `abcdefgh`[a.fileIdx] + a.rank === square)) {
        const key = `${p.type}:${square}:${p.color}`;
        if (!menaced.has(key)) {
          menaced.add(key);
          out.push(token('PIECE_MENACEE', { square, color: p.color, type: p.type }));
        }
      }
    }
  }

  // ── CLOUAGE ──
  for (const p of pieces) {
    const king = pieces.find((k) => k.type === 'k' && k.color === p.color);
    if (!king) continue;
    if (p.type === 'k') continue;
    if (p.color === king.color) {
      // Vérifier si cette pièce est clouée : un slider adverse attaque le roi à travers elle
      for (const slider of pieces) {
        if (slider.color === p.color) continue;
        if (!['b', 'r', 'q'].includes(slider.type)) continue;

        // Attaque brute du slider (sans bloqueurs) pour voir s'il vise le roi
        const rawAttacks = sliderRawAttacks(slider);
        const hitsKing = rawAttacks.some(
          (a) => `abcdefgh`[a.fileIdx] + a.rank === king.square,
        );
        const hitsPiece = rawAttacks.some(
          (a) => `abcdefgh`[a.fileIdx] + a.rank === p.square,
        );
        if (!hitsKing || !hitsPiece) continue;

        // La pièce doit être entre le slider et le roi, sur la même ligne
        if (isBetween(p, slider, king)) {
          // Vérifier qu'il n'y a PAS d'autre pièce entre la pièce et le slider
          // (sinon le clouage est bloqué avant)
          if (!hasBlockerBetween(slider, p, pieces, p.color)) {
            out.push(token('CLOUAGE', { square: p.square, color: p.color, type: p.type }));
          }
        }
      }
    }
  }

  // ── FOURCHETTE ──
  for (const p of pieces) {
    const armed = bySquare[p.square];
    if (!armed) continue;
    const victims = [];
    for (const target of pieces) {
      if (target.color === p.color || target.type === 'p') continue; // exclure les pions (trop fréquents)
      if (armed.attacks.some((a) => `abcdefgh`[a.fileIdx] + a.rank === target.square)) {
        victims.push(target);
      }
    }
    if (victims.length >= 2) {
      out.push(token('FOURCHETTE', { square: p.square, color: p.color, type: p.type }));
    }
  }

  return out;
}

/** Vérifie si `piece` est sur la ligne droite/diagonale entre `slider` et `king`. */
function isBetween(piece, slider, king) {
  const dfk = Math.sign(king.fileIdx - slider.fileIdx);
  const drk = Math.sign(king.rank - slider.rank);
  if (dfk === 0 && drk === 0) return false;

  const dfp = Math.sign(piece.fileIdx - slider.fileIdx);
  const drp = Math.sign(piece.rank - slider.rank);
  if (dfp !== dfk || drp !== drk) return false;

  const distKing = Math.max(
    Math.abs(king.fileIdx - slider.fileIdx),
    Math.abs(king.rank - slider.rank),
  );
  const distPiece = Math.max(
    Math.abs(piece.fileIdx - slider.fileIdx),
    Math.abs(piece.rank - slider.rank),
  );
  return distPiece < distKing;
}

/** Attaques brutes d'un slider (sans bloqueurs). */
function sliderRawAttacks(slider) {
  const dirs = slider.type === 'b' ? DIAGONALS : slider.type === 'r' ? STRAIGHTS : [...DIAGONALS, ...STRAIGHTS];
  const out = [];
  for (const [df, dr] of dirs) {
    let sq = step(slider, df, dr);
    while (onBoard(sq)) { out.push({ ...sq }); sq = step(sq, df, dr); }
  }
  return out;
}

/** Y a-t-il un bloqueur entre slider et target ? */
function hasBlockerBetween(slider, target, pieces) {
  const df = Math.sign(target.fileIdx - slider.fileIdx);
  const dr = Math.sign(target.rank - slider.rank);
  let sq = step(slider, df, dr);
  while (onBoard(sq) && (sq.fileIdx !== target.fileIdx || sq.rank !== target.rank)) {
    if (pieces.some(p => `abcdefgh`[sq.fileIdx] + sq.rank === p.square)) return true;
    sq = step(sq, df, dr);
  }
  return false;
}
