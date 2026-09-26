/**
 * Motifs exécutés dans une ligne (lignes écrites à la main, sans moteur).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lineMotifs } from '../coach/motifs.mjs';

const all = (res) => res.flatMap((r) => r.motifs).join(' | ');

describe('Motifs de ligne', () => {
  it('fourchette royale Cc7+ puis gain de la tour', () => {
    const m = all(lineMotifs('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', ['b5c7', 'e8d7', 'c7a8']));
    assert.match(m, /fourchette \(a8,e8\)/);
    assert.match(m, /gain : prend le tour en a8/);
  });
  it('piège de l’éléphant : découverte puis coup intermédiaire Fb4+', () => {
    const fen = 'r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6';
    const res = lineMotifs(fen, ['f6d5', 'g5d8', 'f8b4', 'd1d2', 'b4d2', 'e1d2', 'e8d8']);
    assert.match(all(res), /attaque à la découverte sur g5/);
    assert.match(all(res), /coup intermédiaire \(Fb4\+\) au lieu de reprendre en d8/);
    assert.ok(!/au lieu de reprendre en d2/.test(all(res)));
  });
  it('clouage exécuté par Te8 sur le fou e4', () => {
    const m = all(lineMotifs('r7/8/8/2k5/4B3/8/8/4K3 b - - 0 1', ['a8e8', 'e1f2', 'e8e4']));
    assert.match(m, /clouage de la pièce en e4 sur le roi/);
  });
  it('sacrifice : la pièce jouée est reprise et coûte du matériel', () => {
    // Fxh7+ Rxh7 : le fou est donné pour un pion.
    const fen = 'rnbq1rk1/ppp2ppp/4pn2/3p4/1b1P4/2NBPN2/PPP2PPP/R1BQK2R w KQ - 0 6';
    const m = all(lineMotifs(fen, ['d3h7', 'f6h7']));
    assert.match(m, /sacrifice du fou/);
  });
});
