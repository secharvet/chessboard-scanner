/**
 * Mémoire d'expérience : signatures de situation et rappel par similarité.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { moveTags, recall, remindsOf, situationTags } from '../coach/memory.mjs';

const BERGER_H5 = 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3';
const BERGER_F3 = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3';

// Leçon tirée de 3...Cf6?? contre Dh5 (comme l'écrirait l'analyse d'après-partie).
const lesson = {
  id: 'L1', titre: 'Vérifier les menaces avant de développer', lecon: '…', signal: '…', count: 1,
  situation: situationTags(BERGER_H5, 'b'),
  move: moveTags(BERGER_H5, 'Nf6'),
  punishment: ['mat'],
};

describe('Signatures', () => {
  it('la menace de mat fait partie de la situation', () => {
    assert.ok(situationTags(BERGER_H5, 'b').includes('menace_mat:adv'));
  });
  it('un coup qui laisse la menace de mat est marqué', () => {
    assert.ok(moveTags(BERGER_H5, 'Nf6').includes('ignore_menace_mat'));
    assert.ok(!moveTags(BERGER_H5, 'g6').includes('ignore_menace_mat'));
  });
});

describe('Rappel par situation semblable (pas la même position)', () => {
  const sit = situationTags(BERGER_F3, 'b');
  it('Df3 au lieu de Dh5 : ...d6 et ...Cd4 ignorent la menace → souvenir', () => {
    assert.equal(remindsOf([lesson], sit, moveTags(BERGER_F3, 'd6'))?.lesson.id, 'L1');
    assert.equal(remindsOf([lesson], sit, moveTags(BERGER_F3, 'Nd4'))?.lesson.id, 'L1');
  });
  it('...Cf6 pare la menace ici → pas de faux souvenir', () => {
    assert.equal(remindsOf([lesson], sit, moveTags(BERGER_F3, 'Nf6')), null);
  });
  it('position calme sans menace → pas de souvenir', () => {
    const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    assert.equal(remindsOf([lesson], situationTags(start, 'w'), moveTags(start, 'e4')), null);
  });
  it('la situation seule fait remonter la leçon dans la perception', () => {
    assert.equal(recall([lesson], { situation: sit })[0]?.lesson.id, 'L1');
  });
});

import { threatTags } from '../coach/memory.mjs';

describe('Souvenirs resserrés', () => {
  it('prise perdante : pièce plus chère qui prend sur une case défendue', () => {
    // Fc4xd5, le pion d5 étant défendu par la dame d8.
    const fen = 'rnbqkbnr/pp3ppp/4p3/3p4/2B5/8/PPPP1PPP/RNBQK1NR w KQkq - 0 5';
    assert.ok(moveTags(fen, 'Bxd5').includes('prise_perdante'));
    // Prise d'un pion non défendu : pas « perdante ».
    assert.ok(!moveTags('rnbqkbnr/pp3ppp/4p3/8/2Bp4/8/PPPP1PPP/RNBQK1NR w KQkq - 0 5', 'Bd5').includes('prise_perdante'));
  });
  it('pas de souvenir si la punition d’origine est impossible après le coup', () => {
    const l = { id: 'X', titre: 't', lecon: 'l', signal: 's', count: 1, situation: ['phase:milieu'], move: ['prise_perdante', 'piece:fou'], punishment: ['gain'] };
    const sit = ['phase:milieu'];
    const mv = ['prise_perdante', 'piece:fou'];
    assert.equal(remindsOf([l], sit, mv, ['gain'])?.lesson.id, 'X');
    assert.equal(remindsOf([l], sit, mv, []), null);
  });
  it('threatTags voit un gain de matériel (Txd5 prend la dame non défendue)', () => {
    assert.ok(threatTags('4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1', 'w').includes('gain'));
    assert.deepEqual(threatTags('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w'), []);
  });
});
