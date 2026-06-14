import { buildPawnStructureFacts } from './pawn-structure.js';
import { buildOpenFilesFacts } from './open-files.js';
import { buildOutpostFacts } from './outposts.js';
import { buildKingSafetyFacts } from './king-safety.js';
import { buildMinorPiecesFacts } from './minor-pieces.js';
import { buildMaterialFacts } from './material.js';
import { buildDevelopmentFacts } from './development.js';
import { buildSpaceFacts } from './space.js';
import { buildTacticalFacts } from './piece-attacks.js';

export {
  buildPawnStructureFacts,
  buildOpenFilesFacts,
  buildOutpostFacts,
  buildKingSafetyFacts,
  buildMinorPiecesFacts,
  buildMaterialFacts,
  buildDevelopmentFacts,
  buildSpaceFacts,
  buildTacticalFacts,
};
export { parseFenPawns } from './fen-board.js';
export { findToken, sortTokens, token, tokenKey } from './tokens.js';

/**
 * Tous les faits positionnels combinés (modules 1-6).
 * @param {string} fen
 * @returns {import('./tokens.js').PositionalToken[]}
 */
export function buildAllFacts(fen) {
  return [
    ...buildPawnStructureFacts(fen),
    ...buildOpenFilesFacts(fen),
    ...buildOutpostFacts(fen),
    ...buildKingSafetyFacts(fen),
    ...buildMinorPiecesFacts(fen),
    ...buildMaterialFacts(fen),
    ...buildDevelopmentFacts(fen),
    ...buildSpaceFacts(fen),
    ...buildTacticalFacts(fen),
  ];
}
