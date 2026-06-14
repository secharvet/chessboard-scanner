/**
 * Module 1.3 — avant-postes et pions faibles.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildOutpostFacts } from '../positional/outposts.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildOutpostFacts(fen);
}

describe('Module 1.3 — avant-postes', () => {
  it('e5 protégé par d4, pas de pion noir sur d6/f6 → avant-poste blanc', () => {
    const t = facts('8/8/8/8/3P4/8/8/8 w - - 0 1');
    assert.ok(has(t, 'AVANT_POSTE', { square: 'e5', color: 'w' }));
    assert.ok(has(t, 'AVANT_POSTE', { square: 'c5', color: 'w' }));
  });

  it('e5 protégé par d4 mais f6 présent → pas avant-poste', () => {
    const t = facts('8/8/5p2/8/3P4/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'AVANT_POSTE', { square: 'e5', color: 'w' }));
    // c5 toujours avant-poste (pas de pion noir en b6/d6)
    assert.ok(has(t, 'AVANT_POSTE', { square: 'c5', color: 'w' }));
  });

  it('d5 protégé par c4, pas de pion blanc en c4? Non — pion noir en c4', () => {
    // Position noire : pion noir en c4, avant-poste noir en b3 ou d3
    const t = facts('8/8/8/8/2p5/8/8/8 w - - 0 1');
    assert.ok(has(t, 'AVANT_POSTE', { square: 'd3', color: 'b' }));
    assert.ok(has(t, 'AVANT_POSTE', { square: 'b3', color: 'b' }));
  });

  it('avant-poste noir maintenu malgré pion blanc sur même colonne', () => {
    const t = facts('8/8/8/8/2p5/3P4/8/8 w - - 0 1');
    // d3 et b3 sont protégés par c4 noir.
    // Le pion blanc en d3 attaque c4 et e4 (pas d3 ni b3).
    // Donc d3 et b3 restent des avant-postes noirs.
    assert.ok(has(t, 'AVANT_POSTE', { square: 'd3', color: 'b' }));
    assert.ok(has(t, 'AVANT_POSTE', { square: 'b3', color: 'b' }));
  });
});

describe('Module 1.3 — pions faibles', () => {
  it('aucun pion faible dans la position française classique', () => {
    const t = facts('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1');
    assert.equal(t.filter((f) => f.id === 'PION_FAIBLE').length, 0);
  });

  it('aucun pion faible dans la position initiale', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.equal(t.filter((f) => f.id === 'PION_FAIBLE').length, 0);
  });
});

describe('Module 1.3 — buildAllFacts', () => {
  it('inclut les avant-postes dans buildAllFacts', () => {
    const t = buildAllFacts('8/8/8/8/3P4/8/8/8 w - - 0 1');
    assert.ok(has(t, 'AVANT_POSTE', { square: 'e5', color: 'w' }));
    assert.ok(has(t, 'PION_PASSE', { color: 'w', square: 'd4' }));
  });
});
