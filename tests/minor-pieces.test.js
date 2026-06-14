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
  it('fou blanc c4 : pions majoritairement sur cases claires → mauvais', () => {
    // Position initiale : blancs ont 4 pions sur cases claires (a2,c2,e2,g2) et 4 sur foncées
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const f1 = facts('rnbqkbnr/pppppppp/8/8/2B5/8/PPPPPPPP/RN1QKBNR b KQkq - 0 1');
    // Fou sur c4 (case claire) avec 4 pions sur cases claires (a2,c2,e2,g2) → mauvais
    assert.ok(has(f1, 'FOU_MAUVAIS', { color: 'w' }));
  });

  it('fou noir c8 : pions sur cases foncées → bon fou', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    // Fou noir c8 (case claire). Pions noirs : a7,b7,c7,d7,e7,f7,g7,h7.
    // Cases claires noires : a7(? 0+7=7 impair → claire), c7(2+7=9 impair→claire), e7, g7 → 4 pions
    // Donc fou c8 sur case claire, 4 pions sur clair → FOU_MAUVAIS
    assert.ok(has(t, 'FOU_MAUVAIS', { color: 'b' }));
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
    assert.ok(has(t, 'ROI_AU_CENTRE', { color: 'w' }));
  });
});
