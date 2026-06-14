/**
 * Infère flèches et surlignages à partir des commentaires + dernier coup.
 */

import { collapseFieldsByPriority } from './board-drawables.js';

/** @typedef {import('./board-drawables.js').BoardArrow} BoardArrow */
/** @typedef {import('./board-drawables.js').BoardField} BoardField */

const SQ = /^[a-h][1-8]$/;

/**
 * @param {string} san
 * @returns {string | null}
 */
export function squareFromSan(san) {
  if (!san) return null;
  const m = san.match(/([a-h][1-8])(?:[+#])?$/i);
  return m ? m[1].toLowerCase() : null;
}

function stripPgnGlyphs(comment) {
  return comment.replace(/\[%[^\]]*]/g, ' ');
}

function addArrow(arrows, arrow) {
  const key = `${arrow.color}:${arrow.from}:${arrow.to}`;
  if (arrows.some((a) => `${a.color}:${a.from}:${a.to}` === key)) return;
  arrows.push(arrow);
}

/**
 * @param {{ from?: string, to?: string } | null | undefined} move
 * @returns {{ arrows: BoardArrow[], fields: BoardField[] }}
 */
export function drawablesFromLastMove(move) {
  if (!move?.from || !move?.to) return { arrows: [], fields: [] };
  return {
    fields: [
      { color: 'M', square: move.from },
      { color: 'M', square: move.to },
    ],
    arrows: [{ color: 'M', from: move.from, to: move.to }],
  };
}

/**
 * @param {string} commentText
 * @param {{ move?: { from?: string, to?: string } | null }} [ctx]
 */
export function drawablesFromCommentText(commentText, ctx = {}) {
  const arrows = [];
  const fields = [];
  const text = stripPgnGlyphs(commentText || '');
  const move = ctx.move ?? null;
  const pieceSq = move?.to ?? null;

  const seenSquares = new Set();

  const addField = (color, sq) => {
    if (!SQ.test(sq) || seenSquares.has(sq)) return;
    seenSquares.add(sq);
    fields.push({ color, square: sq });
    if (pieceSq && pieceSq !== sq) addArrow(arrows, { color, from: pieceSq, to: sq });
  };

  const controlRe =
    /contrôl\w*(?:\s+sur|\s+la\s+case|\s+le\s+centre)?\s+([a-h][1-8])|(?:soutient|appuie\s+sur|bloque)\s+([a-h][1-8])/gi;
  for (const m of text.matchAll(controlRe)) {
    addField('G', (m[1] || m[2])?.toLowerCase());
  }

  const attackRe =
    /(?:vise|menace|pression\s+sur|attaque)\s+(?:sur\s+)?(?:la\s+case\s+|le\s+)?([a-h][1-8])|menace\s+([a-h][1-8])/gi;
  for (const m of text.matchAll(attackRe)) {
    addField('R', (m[1] || m[2])?.toLowerCase());
  }

  const planSanRe = /\.\.\.\s*([NBRQK]?[a-h]?x?[a-h][1-8](?:=[NBRQ])?[+#]?)/gi;
  for (const m of text.matchAll(planSanRe)) {
    const sq = squareFromSan(m[1]);
    if (sq) addField('Y', sq);
  }

  const planSquareRe =
    /(?:prépare|prévoit|en vue|vise\s+à|vers|jouer)\s+(?:\.\.\.\s*)?(?:[a-h][1-8]|[NBRQK][a-h]?x?([a-h][1-8]))|(?:développ\w*|pourra\s+(?:[^.]{0,50}?)?)\s+en\s+([a-h][1-8])|(?:case|pion|fou|cavalier|tour|dame)\s+(?:en\s+|sur\s+)?([a-h][1-8])/gi;
  for (const m of text.matchAll(planSquareRe)) {
    const sq = (m[1] || m[2] || m[3])?.toLowerCase();
    if (sq) addField('Y', sq);
  }

  const bareSqRe = /\ben\s+([a-h][1-8])\b/gi;
  for (const m of text.matchAll(bareSqRe)) {
    const sq = m[1]?.toLowerCase();
    if (!SQ.test(sq) || sq === pieceSq || seenSquares.has(sq)) continue;
    if (/développ|pourra|prépare|vers|fou|cavalier|roque/i.test(text)) {
      addField('Y', sq);
    }
  }

  return {
    arrows,
    fields: collapseFieldsByPriority(fields),
  };
}

/**
 * Fusionne plusieurs sets de drawables (dernier coup prioritaire).
 * @param  {...{ arrows?: BoardArrow[], fields?: BoardField[] }} parts
 */
export function buildBoardDrawables(...parts) {
  const arrows = [];
  const allFields = [];

  for (const p of parts) {
    for (const a of p.arrows ?? []) addArrow(arrows, a);
    if (p.fields) allFields.push(...p.fields);
  }

  return {
    arrows,
    fields: collapseFieldsByPriority(allFields),
  };
}
