/**
 * Scanner de menaces par règles et contrôle anti-gaffe.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { blunderCheck, scanTactics } from '../coach/threats.mjs';

const texts = (xs) => xs.map((t) => t.text).join(' | ');

describe('Scanner de menaces', () => {
  it('voit le mat du berger du point de vue des blancs', () => {
    const t = scanTactics('r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', 'w');
    assert.equal(t[0].severity, 100);
    assert.match(t[0].text, /Dxf7# \(dame\) est mat/);
  });
  it('voit la fourchette royale Cc7+', () => {
    assert.match(texts(scanTactics('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', 'w')), /Cc7\+ \(cavalier\) : fourchette sur a8,e8 avec échec/);
  });
  it('voit une pièce non défendue à prendre', () => {
    assert.match(texts(scanTactics('r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6', 'b')), /Cxd5 \(cavalier\) prend le cavalier en d5/);
  });
  it('rien en position initiale', () => {
    assert.deepEqual(scanTactics('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w'), []);
  });
  it('un échange à égalité n’est pas une menace', () => {
    // Cf3xe5 Cc6xe5 : cavalier contre pion défendu → pas de gain.
    const t = scanTactics('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', 'w');
    assert.ok(!/Cxe5/.test(texts(t)));
  });
});

describe('Contrôle anti-gaffe', () => {
  it('3...Cf6?? contre Dh5 + Fc4 : signale Dxf7#', () => {
    const d = blunderCheck('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', 'b');
    assert.match(texts(d), /Dxf7# \(dame\) est mat/);
  });
  it('coup sain : aucune alerte', () => {
    // 3...g6 chasse la dame.
    assert.deepEqual(blunderCheck('r1bqkbnr/pppp1p1p/2n3p1/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4', 'b'), []);
  });
});
