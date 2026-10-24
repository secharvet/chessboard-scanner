/**
 * Garde-fou du coach : coups cités absents de l'analyse.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findUngroundedMoves } from '../coach/guard.mjs';

const ITALIAN = 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 7';
const data = { fen: ITALIAN, candidates: [{ pvSan: '7. b4 Fb6 8. a4 a6', pvUci: ['b2b4', 'c5b6', 'a2a4', 'a7a6'] }], threat: null };

describe('Garde-fou', () => {
  it('coups des lignes et coups légaux : acceptés', () => {
    assert.deepEqual(findUngroundedMoves('Joue b4 puis a4 ; après Fb6, Cbd2 est possible.', data), []);
  });
  it('désignation de pièce (ton Fc4, le Fc5 adverse) : acceptée', () => {
    assert.deepEqual(findUngroundedMoves('Ton Fc4 et le Fc5 adverse se font face.', data), []);
  });
  it('notation longue depuis une pièce existante : acceptée', () => {
    assert.deepEqual(findUngroundedMoves('Plan : Cb1-d2-f1-g3.', data), []);
  });
  it('coup inventé : signalé', () => {
    assert.deepEqual(findUngroundedMoves('Joue Dxh7 pour mater.', data), ['Dxh7']);
  });
});
