/**
 * Module 6 — attaques de pièces (menaces, clouages, fourchettes).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildTacticalFacts(fen);
}

describe('Module 6 — pièce menacée', () => {
  it('cavalier blanc attaqué par pion noir', () => {
    const t = facts('8/8/3p4/4N3/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'PIECE_MENACEE', { square: 'e5', color: 'w' }));
  });

  it('position initiale : plusieurs pièces menacées par les pions', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    // Les pions attaquent des cases vides → pas de pièce menacée
    assert.equal(t.filter((f) => f.id === 'PIECE_MENACEE').length, 0);
  });
});

describe('Module 6 — clouage', () => {
  it('cavalier c6 cloué par fou b5 sur roi e8', () => {
    const t = facts('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1');
    assert.ok(has(t, 'CLOUAGE', { square: 'c6', color: 'b' }));
  });

  it('pas de clouage en position initiale', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.equal(t.filter((f) => f.id === 'CLOUAGE').length, 0);
  });
});

describe('Module 6 — fourchette', () => {
  it('cavalier c3 attaque dame et tour noires en d5 et e4', () => {
    const t = facts('8/8/8/3q4/4r3/2N5/8/2K5 w - - 0 1');
    assert.ok(has(t, 'FOURCHETTE', { square: 'c3', color: 'w' }));
  });

  it('pas de fourchette en position initiale', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.equal(t.filter((f) => f.id === 'FOURCHETTE').length, 0);
  });
});

describe('Module 6 — buildAllFacts', () => {
  it('buildAllFacts inclut le module 6', () => {
    const t = buildAllFacts('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1');
    assert.ok(has(t, 'CLOUAGE', { square: 'c6', color: 'b' }));
    assert.ok(has(t, 'ROI_AU_CENTRE'));
  });
});
