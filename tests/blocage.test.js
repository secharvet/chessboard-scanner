/**
 * Blocage d'un pion : vérité de terrain du 1er octobre 2026 (planches jugées par l'auteur).
 * La pièce mineure se place devant un pion adverse qu'aucun pion adverse ne pourra plus chasser (ou devant un pion passé).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { blocked, blockadeTarget } from '../coach/plan-concepts.mjs';

/** @param {string} fen @param {string} san @param {'w'|'b'} side */
function isBlockade(fen, san, side) {
  const c = new Chess(fen);
  const m = c.move(san);
  const pawnSq = blockadeTarget(c, m.to, side);
  return Boolean(pawnSq) && blocked(buildAllFacts(c.fen()), c, pawnSq, side === 'w' ? 'b' : 'w', side);
}

describe('Blocage — planches de vérité de terrain', () => {
  it('planche 8 : Cf4 devant le pion f3 doublé, aucun pion blanc ne peut chasser f4 → blocage', () => {
    assert.ok(isBlockade('r4rk1/ppp2pp1/3p1q1p/3Pn2n/1b2P3/2N1BP1P/PP2BP1K/R2Q2R1 b - - 7 16', 'Nf4', 'b'));
  });
  it('planche 9 : Cd5 devant d4, base de la chaîne d4-e5 sans pion c → blocage', () => {
    assert.ok(isBlockade('3rr1k1/1ppq1ppp/1p3n2/4P3/3P4/1P1Q4/PB4PP/R4RK1 b - - 2 18', 'Nd5', 'b'));
  });
  it('planche 6 : Fh6 devant h7, le pion g est déjà en g6 → blocage', () => {
    assert.ok(isBlockade('r6b/pbkp3p/1pn3p1/4p1B1/2B1n3/8/PPP2PPP/R3K2R w KQ - 0 16', 'Bh6', 'w'));
  });
  it('planche 10 : Fg5 devant g6, mais h7-h6 chasse le fou → pas un blocage', () => {
    assert.ok(!isBlockade('r6r/pbkp1Nbp/1pn1pnp1/8/2B1P3/8/PPP2PPP/R1B1K2R w KQ - 1 13', 'Bg5', 'w'));
  });
  it('planche 7 : Fb5 devant b6, a7-a6 chasse le fou → pas un blocage', () => {
    assert.ok(!isBlockade('r4rk1/pp1b1ppp/2pqpn2/3p4/3P4/3BP3/PPP2PPP/RN1QK2R w KQ - 2 10', 'Bb5', 'w'));
  });
  it('pion isolé d5 : Cd4 devant → blocage (planche 2)', () => {
    assert.ok(isBlockade('r4rk1/pp3ppp/3q1n2/3p4/6b1/P3PN2/1P2BPPP/2RQ1RK1 w - - 6 15', 'Nd4', 'w'));
  });
});
