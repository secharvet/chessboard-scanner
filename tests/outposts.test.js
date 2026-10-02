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

describe('Module 1.3 — avant-poste dont le soutien reste à jouer', () => {
  it('cavalier noir en e3, Blancs sans pion d ni f : avant-poste même sans pion noir qui le soutient (planche 6)', () => {
    const t = facts('5rk1/5p1p/p2p1qpQ/3n1p2/2N1b3/2Pn3N/R5PP/5RK1 w - - 3 28');
    assert.ok(has(t, 'AVANT_POSTE', { square: 'e3', color: 'b', soutenu: false }));
  });

  it('cavalier blanc en e5, pion noir encore en f7 : pas un avant-poste, f6 le chasse (planche 5)', () => {
    const t = facts('r3k2r/pp1bbppp/3qp3/1P1p4/P7/2P5/1B1N1PPP/R2Q1RK1 w kq - 2 16');
    assert.ok(!has(t, 'AVANT_POSTE', { square: 'e5', color: 'w' }));
  });

  it('sans aucun pion à moi, aucun avant-poste', () => {
    const t = facts('8/8/8/4N3/8/8/8/8 w - - 0 1');
    assert.equal(t.filter((f) => f.id === 'AVANT_POSTE').length, 0);
  });

  it('soutien à venir : pas d\'avant-poste au-delà de la 6e rangée (c8 n\'est pas un avant-poste parce que d4 pourrait aller en d7)', () => {
    const t = facts('8/8/8/8/3P4/8/8/8 w - - 0 1');
    assert.ok(!has(t, 'AVANT_POSTE', { square: 'c8', color: 'w' }));
    assert.ok(!has(t, 'AVANT_POSTE', { square: 'c7', color: 'w' }));
    assert.ok(has(t, 'AVANT_POSTE', { square: 'c6', color: 'w' }));
  });

  it('pion blanc bloqué en d2 par un pion en d3 : il ne soutiendra jamais e5', () => {
    const t = facts('8/8/8/8/8/3p4/3P4/8 w - - 0 1');
    assert.ok(!has(t, 'AVANT_POSTE', { square: 'e5', color: 'w' }));
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
