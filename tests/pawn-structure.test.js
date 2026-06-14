/**
 * Module 1.1 — structure de pions (un scénario par règle).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildPawnStructureFacts } from '../positional/pawn-structure.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildPawnStructureFacts(fen);
}

describe('Module 1.1 — îlots', () => {
  it('a2,b2,d2,e2,g2 → 3 îlots blancs', () => {
    const t = facts('8/8/8/8/8/8/PP1PP1P1/8 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC', { count: 3 }));
  });

  it('a2,c2,e2,g2 → 4 îlots blancs', () => {
    const t = facts('8/8/8/8/8/8/P1P1P1P1/8 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC', { count: 4 }));
  });

  it('c2,d2,e2 → 1 îlot blanc', () => {
    const t = facts('8/8/8/8/8/8/1PPP1/8 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC', { count: 1 }));
  });

  it('aucun pion blanc → 0 îlot', () => {
    const t = facts('8/8/8/8/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC', { count: 0 }));
  });

  it('deux pions même colonne a2+a4 → 1 îlot', () => {
    const t = facts('8/8/8/8/P7/8/8/P7 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC', { count: 1 }));
  });

  it('pions noirs a7,b7,d7,e7 → 2 îlots noirs', () => {
    const t = facts('pp1pp3/8/8/8/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'NOMBRE_ILOTS_NOIR', { count: 2 }));
  });
});

describe('Module 1.1 — pion isolé', () => {
  it('d4 seul (rien en c/e) → isolé', () => {
    const t = facts('8/8/8/8/3P4/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_ISOLE', { color: 'w', square: 'd4' }));
  });

  it('a2 seul → isolé', () => {
    const t = facts('8/8/8/8/8/8/P7/8 w - - 0 1');
    assert.ok(has(t, 'PION_ISOLE', { color: 'w', square: 'a2' }));
  });

  it('d4 + c3 → pas isolé', () => {
    const t = facts('8/8/8/8/3P4/2P6/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ISOLE', { color: 'w', square: 'd4' }));
  });

  it('d4 + e2 → pas isolé', () => {
    const t = facts('8/8/8/8/3P4/8/4P3/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ISOLE', { color: 'w', square: 'd4' }));
  });
});

describe('Module 1.1 — pion arrière', () => {
  const FEN_ARRIERE = '8/8/8/3p4/3P4/2P5/8/8 w - - 0 1';
  const FEN_PAS_ARRIERE = '8/8/8/8/3P4/2P5/8/8 w - - 0 1';

  it('c3 avec d4 et d5 → arrière', () => {
    const t = facts(FEN_ARRIERE);
    assert.ok(has(t, 'PION_ARRIERE', { color: 'w', square: 'c3' }));
  });

  it('sans d5 → pas arrière', () => {
    const t = facts(FEN_PAS_ARRIERE);
    assert.ok(!has(t, 'PION_ARRIERE', { color: 'w', square: 'c3' }));
  });

  it('b2,c4,a5 → pas arrière (a5 ne contrôle pas b3)', () => {
    const t = facts('8/8/p7/8/2P5/8/1P6/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ARRIERE', { color: 'w', square: 'b2' }));
  });

  it('c2,d2 même rangée → pas arrière', () => {
    const t = facts('8/8/8/8/8/PP6/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ARRIERE', { color: 'w', square: 'c2' }));
    assert.ok(!has(t, 'PION_ARRIERE', { color: 'w', square: 'd2' }));
  });
});

describe('Module 1.1 — majorité aile', () => {
  it('3 vs 2 sur a-d blancs → MAJORITE_AILE_DAME blanc', () => {
    const t = facts('8/8/8/8/8/PPP5/pp5/8 w - - 0 1');
    assert.ok(has(t, 'MAJORITE_AILE_DAME', { color: 'w' }));
    assert.ok(!has(t, 'MAJORITE_AILE_DAME', { color: 'b' }));
  });

  it('2 vs 2 sur a-d → pas de jeton', () => {
    const t = facts('8/8/8/8/8/PP5/pp5/8 w - - 0 1');
    assert.ok(!has(t, 'MAJORITE_AILE_DAME', { color: 'w' }));
    assert.ok(!has(t, 'MAJORITE_AILE_DAME', { color: 'b' }));
  });

  it('4 vs 1 sur e-h blancs → MAJORITE_AILE_ROI blanc', () => {
    const t = facts('8/8/8/4PPPP/4p3/8/8/8 w - - 0 1');
    assert.ok(has(t, 'MAJORITE_AILE_ROI', { color: 'w' }));
  });

  it('majorité noire aile dame', () => {
    const t = facts('8/8/8/8/8/ppppp3/PP3/8 w - - 0 1');
    assert.ok(has(t, 'MAJORITE_AILE_DAME', { color: 'b' }));
  });
});

describe('Module 1.1 — pion passé', () => {
  it('e5 sans opposition → passé', () => {
    const t = facts('8/8/8/4P3/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
  });

  it('e5 + d7 → pas passé', () => {
    const t = facts('8/3p4/8/4P3/8/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
  });

  it('a2 sans opposition → passé', () => {
    const t = facts('8/8/8/8/8/8/P7/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'a2' }));
  });

  it('d4 + e5 → pas passé', () => {
    const t = facts('8/8/8/4p3/3P4/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_PASSE', { color: 'w', square: 'd4' }));
  });

  it('e4 + e5 → pas passé', () => {
    const t = facts('8/8/8/4p3/4P3/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_PASSE', { color: 'w', square: 'e4' }));
  });

  it('e5 + f6 → pas passé', () => {
    const t = facts('8/8/5p2/4P3/8/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
  });
});

describe('Module 1.1 — pion passé protégé', () => {
  it('e5 passé + d4 → protégé', () => {
    const t = facts('8/8/8/4P3/3P4/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
    assert.ok(has(t, 'PION_PASSE_PROTEGE', { color: 'w', square: 'e5' }));
  });

  it('e5 passé seul → pas protégé', () => {
    const t = facts('8/8/8/4P3/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
    assert.ok(!has(t, 'PION_PASSE_PROTEGE', { color: 'w', square: 'e5' }));
  });

  it('e5 passé + c3 → pas protégé', () => {
    const t = facts('8/8/8/4P3/2P5/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'e5' }));
    assert.ok(!has(t, 'PION_PASSE_PROTEGE', { color: 'w', square: 'e5' }));
  });

  it('a5 passé + b4 → protégé', () => {
    const t = facts('8/8/8/P7/1P6/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'a5' }));
    assert.ok(has(t, 'PION_PASSE_PROTEGE', { color: 'w', square: 'a5' }));
  });

  it('h5 passé + g4 → protégé', () => {
    const t = facts('8/8/8/7P/6P1/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'h5' }));
    assert.ok(has(t, 'PION_PASSE_PROTEGE', { color: 'w', square: 'h5' }));
  });
});
