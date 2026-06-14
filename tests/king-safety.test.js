/**
 * Module 1.4 — sécurité du roi.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildKingSafetyFacts } from '../positional/king-safety.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildKingSafetyFacts(fen);
}

describe('Module 1.4 — roque', () => {
  it('position initiale : roi au centre pour les deux camps', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'ROI_AU_CENTRE', { color: 'w' }));
    assert.ok(has(t, 'ROI_AU_CENTRE', { color: 'b' }));
  });

  it('petit roque blanc après 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O', () => {
    const t = facts('r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 0 1');
    assert.ok(has(t, 'ROQUE_PETIT', { color: 'w' }));
    assert.ok(!has(t, 'ROQUE_GRAND', { color: 'w' }));
    assert.ok(!has(t, 'ROI_AU_CENTRE', { color: 'w' }));
  });

  it('grand roque noir', () => {
    const t = facts('2kr1bnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1');
    assert.ok(has(t, 'ROQUE_GRAND', { color: 'b' }));
  });
});

describe('Module 1.4 — bouclier de pions', () => {
  it('bouclier petit roque blanc intact (f2,g2,h2 présents)', () => {
    const t = facts('rnbq1rk1/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 0 1');
    assert.ok(has(t, 'PIONS_ROI_BOUCLIER', { color: 'w' }));
  });

  it('bouclier grand roque noir affaibli (manque a7)', () => {
    // roi en c8, pions en b7,c7 mais pas a7
    const t = facts('2kr1bnr/1ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1');
    assert.ok(has(t, 'PIONS_ROI_AFFAIBLI', { color: 'b' }));
  });

  it('roque + bouclier dans buildAllFacts', () => {
    const t = buildAllFacts('rnbq1rk1/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 0 1');
    assert.ok(has(t, 'ROQUE_PETIT', { color: 'w' }));
    assert.ok(has(t, 'PIONS_ROI_BOUCLIER', { color: 'w' }));
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC'));
  });
});
