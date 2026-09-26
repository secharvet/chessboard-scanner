/**
 * Module 2 — pièces mineures et tours.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildMinorPiecesFacts } from '../positional/minor-pieces.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildMinorPiecesFacts(fen);
}

describe('Module 2 — paire de fous', () => {
  it('position initiale : paire de fous blanche et noire', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'PAIRE_FOUS', { color: 'w' }));
    assert.ok(has(t, 'PAIRE_FOUS', { color: 'b' }));
  });

  it('un seul fou blanc → pas de paire', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RN1QKBNR w KQkq - 0 1');
    assert.ok(!has(t, 'PAIRE_FOUS', { color: 'w' }));
    assert.ok(has(t, 'PAIRE_FOUS', { color: 'b' }));
  });
});

describe('Module 2 — bon / mauvais fou', () => {
  it('position initiale : pions centraux équilibrés → aucun jugement', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(!has(t, 'FOU_MAUVAIS'));
    assert.ok(!has(t, 'FOU_BON'));
  });

  it('Française avance : fou c8 noir mauvais (pions d5/e6 sur cases claires)', () => {
    // 1.e4 e6 2.d4 d5 3.e5
    const t = facts('rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3');
    assert.ok(has(t, 'FOU_MAUVAIS', { color: 'b', square: 'c8' }));
    assert.ok(has(t, 'FOU_MAUVAIS', { color: 'w', square: 'c1' }));
    assert.ok(!has(t, 'FOU_MAUVAIS', { color: 'b', square: 'f8' }));
  });
});

describe('Module 2 — cavalier sur avant-poste', () => {
  it('cavalier blanc en e5 avec avant-poste e5 (d4 protège)', () => {
    const t = facts('8/8/8/4N3/3P4/8/8/8 w - - 0 1');
    assert.ok(has(t, 'CAVALIER_AVANT_POSTE', { square: 'e5', color: 'w' }));
  });

  it('cavalier en e5 sans pion protecteur → pas avant-poste', () => {
    const t = facts('8/8/8/4N3/8/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'CAVALIER_AVANT_POSTE'));
  });
});

describe('Module 2 — tour sur colonne ouverte', () => {
  it('tour blanche sur colonne e ouverte', () => {
    const t = facts('8/8/8/8/8/8/8/R3K3 w - - 0 1');
    // Colonne a : tour blanche en a1, pas de pion → ouverte
    assert.ok(has(t, 'TOUR_COLONNE_OUVERTE', { square: 'a1', color: 'w' }));
  });

  it('tour sur colonne semi-ouverte pour son camp', () => {
    const t = facts('8/4p3/8/8/8/8/8/R3K3 w - - 0 1');
    // Colonne a : pas de pion blanc, pion noir en e7 → semi-ouverte pour blancs
    assert.ok(has(t, 'TOUR_COLONNE_OUVERTE', { square: 'a1', color: 'w' }));
  });

  it('tour sur colonne fermée → pas de jeton', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(!has(t, 'TOUR_COLONNE_OUVERTE'));
  });
});

describe('Module 2 — buildAllFacts', () => {
  it('inclut module 2 dans buildAllFacts', () => {
    const t = buildAllFacts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.ok(has(t, 'PAIRE_FOUS', { color: 'w' }));
    assert.ok(!has(t, 'ROI_AU_CENTRE', { color: 'w' })); // normal au 1er coup
  });
});
