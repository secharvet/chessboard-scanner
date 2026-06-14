/**
 * Module 1.2 — colonnes, doublons, chaînes de pions.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildOpenFilesFacts } from '../positional/open-files.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

/** @param {import('../positional/tokens.js').PositionalToken[]} tokens @param {string} id @param {Record<string, string | number | boolean>} [params] */
function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

/** @param {string} fen */
function facts(fen) {
  return buildOpenFilesFacts(fen);
}

describe('Module 1.2 — colonnes', () => {
  it('échiquier vide → toutes colonnes ouvertes', () => {
    const t = facts('8/8/8/8/8/8/8/8 w - - 0 1');
    assert.equal(t.filter((f) => f.id === 'COLONNE_OUVERTE').length, 8);
  });

  it('colonne a occupée, colonnes b-h ouvertes', () => {
    const t = facts('8/8/8/8/8/8/P7/p7 w - - 0 1');
    assert.equal(t.filter((f) => f.id === 'COLONNE_OUVERTE').length, 7);
    assert.ok(!has(t, 'COLONNE_OUVERTE', { file: 'a' }));
    assert.ok(has(t, 'COLONNE_OUVERTE', { file: 'b' }));
  });

  it('colonne semi-ouverte pour blancs (pion noir seul sur d)', () => {
    const t = facts('8/8/3p4/8/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'COLONNE_SEMI_OUVERTE', { file: 'd', color: 'w' }));
    assert.ok(!has(t, 'COLONNE_SEMI_OUVERTE', { file: 'd', color: 'b' }));
    assert.ok(!has(t, 'COLONNE_OUVERTE', { file: 'd' }));
  });

  it('position initiale : aucune colonne ouverte ni semi-ouverte', () => {
    const t = facts('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.equal(t.filter((f) => f.id === 'COLONNE_OUVERTE').length, 0);
    assert.equal(t.filter((f) => f.id === 'COLONNE_SEMI_OUVERTE').length, 0);
  });
});

describe('Module 1.2 — doublons', () => {
  it('doublon blanc colonne c', () => {
    const t = facts('8/8/8/8/2P5/2P5/8/8 w - - 0 1');
    assert.ok(has(t, 'DOUBLON', { file: 'c', color: 'w' }));
  });

  it('doublon noir colonne f', () => {
    const t = facts('8/8/5p2/5p2/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'DOUBLON', { file: 'f', color: 'b' }));
  });

  it('pas de doublon si un seul pion par colonne', () => {
    const t = facts('8/8/8/8/8/8/PPPPPPPP/8 w - - 0 1');
    assert.equal(t.filter((f) => f.id === 'DOUBLON').length, 0);
  });

  it('triplé blanc colonne a', () => {
    const t = facts('8/P7/P7/P7/8/8/8/8 w - - 0 1');
    assert.ok(has(t, 'DOUBLON', { file: 'a', color: 'w' }));
  });
});

describe('Module 1.2 — pion arrière double', () => {
  // c3 arrière (d4+d5), d2 arrière (e3+e4) — adjacents en c et d
  const FEN_DOUBLE = '8/8/8/3p4/3Pp3/2P1P3/3P4/8 w - - 0 1';

  it('deux pions arrière adjacents c3+d2', () => {
    const t = facts(FEN_DOUBLE);
    assert.ok(has(t, 'PION_ARRIERE_DOUBLE', { color: 'w' }));
  });

  it('un seul pion arrière → pas de jeton', () => {
    const t = facts('8/8/8/3p4/3P4/2P5/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ARRIERE_DOUBLE'));
  });

  it('deux pions arrière non adjacents → pas de jeton', () => {
    const t = facts('8/8/8/3p4/3P4/2P2P2/8/8 w - - 0 1');
    assert.ok(!has(t, 'PION_ARRIERE_DOUBLE'));
  });
});

describe('Module 1.2 — chaîne de pions', () => {
  it('c3-d4-e5 → chaîne blanche', () => {
    const t = facts('8/8/8/4P3/3P4/2P5/8/8 w - - 0 1');
    assert.ok(has(t, 'CHAINE_PIONS', { color: 'w' }));
  });

  it('a2-b3-c4 → chaîne blanche', () => {
    const t = facts('8/8/8/8/2P5/1P6/P7/8 w - - 0 1');
    assert.ok(has(t, 'CHAINE_PIONS', { color: 'w' }));
  });

  it('chaîne noire f7-g6-h5', () => {
    const t = facts('8/8/7p/6p1/5p2/8/8/8 w - - 0 1');
    assert.ok(has(t, 'CHAINE_PIONS', { color: 'b' }));
  });

  it('deux pions enchaînés seulement → pas de chaîne', () => {
    const t = facts('8/8/8/4P3/3P4/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'CHAINE_PIONS'));
  });

  it('chaîne dans buildAllFacts', () => {
    const t = buildAllFacts('8/8/8/4P3/3P4/2P5/8/8 w - - 0 1');
    assert.ok(has(t, 'CHAINE_PIONS', { color: 'w' }));
    assert.ok(has(t, 'NOMBRE_ILOTS_BLANC'));
  });
});
