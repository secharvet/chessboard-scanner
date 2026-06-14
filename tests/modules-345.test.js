/**
 * Modules 3-5 — matériel, développement, espace.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildMaterialFacts } from '../positional/material.js';
import { buildDevelopmentFacts } from '../positional/development.js';
import { buildSpaceFacts } from '../positional/space.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

describe('Module 3 — matériel', () => {
  it('position initiale → égalité', () => {
    const t = buildMaterialFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'EGALITE_MATERIEL'));
  });

  it('blancs ont un pion de plus', () => {
    const t = buildMaterialFacts('rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'AVANTAGE_MATERIEL', { color: 'w', score: 1 }));
  });

  it('noirs ont un cavalier de plus', () => {
    const t = buildMaterialFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1');
    // Blancs : cavalier b1 absent (-3), Noirs : 39. Avantage +3 pour noirs.
    assert.ok(has(t, 'AVANTAGE_MATERIEL', { color: 'b', score: 3 }));
  });
});

describe('Module 4 — développement', () => {
  it('position initiale : 4 pièces non développées par camp', () => {
    const t = buildDevelopmentFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const w = t.filter((f) => f.id === 'PIECE_NON_DEVELOPPEE' && f.params.color === 'w');
    const b = t.filter((f) => f.id === 'PIECE_NON_DEVELOPPEE' && f.params.color === 'b');
    assert.equal(w.length, 4);
    assert.equal(b.length, 4);
  });

  it('cavalier b1 développé → 3 pièces non développées', () => {
    const t = buildDevelopmentFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1');
    const w = t.filter((f) => f.id === 'PIECE_NON_DEVELOPPEE' && f.params.color === 'w');
    assert.equal(w.length, 3);
  });

  it('dame sortie trop tôt', () => {
    // Reine blanche en h5, cavaliers/fous encore au départ
    const t = buildDevelopmentFacts('rnbqkbnr/pppppppp/8/7Q/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1');
    assert.ok(has(t, 'DAME_SORTIE_TOT', { color: 'w' }));
  });
});

describe('Module 5 — espace', () => {
  it('position initiale → pas d avantage espace', () => {
    const t = buildSpaceFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(!has(t, 'AVANTAGE_ESPACE'));
  });

  it('1.d4 d5 2.c4 → avantage espace blanc (pion en c5)', () => {
    const t = buildSpaceFacts('rnbqkbnr/ppp1pppp/8/2Pp4/3P4/8/PP2PPPP/RNBQKBNR b KQkq - 0 1');
    assert.ok(has(t, 'AVANTAGE_ESPACE', { color: 'w' }));
  });

  it('case faible noire après 1.e4 : d5 et f5', () => {
    // e4 attaque d5 et f5. Ces cases sont en territoire noir (rangs 5-8),
    // inattaquables par les pions noirs en rang 7 (ils attaquent rang 6).
    const t = buildSpaceFacts('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
    assert.ok(has(t, 'CASE_FAIBLE', { square: 'd5', color: 'b' }));
    assert.ok(has(t, 'CASE_FAIBLE', { square: 'f5', color: 'b' }));
  });
});

describe('Modules 3-5 — buildAllFacts', () => {
  it('buildAllFacts inclut les 8 modules', () => {
    const t = buildAllFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'EGALITE_MATERIEL'));
    assert.ok(has(t, 'PIECE_NON_DEVELOPPEE'));
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC'));
    assert.ok(has(t, 'PAIRE_FOUS'));
    assert.ok(has(t, 'ROI_AU_CENTRE'));
  });
});
