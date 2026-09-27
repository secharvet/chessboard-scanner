/**
 * Motifs exécutés dans une ligne (lignes écrites à la main, sans moteur).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lineMotifs } from '../coach/motifs.mjs';

const all = (res) => res.flatMap((r) => r.motifs).join(' | ');

describe('Motifs de ligne', () => {
  it('fourchette royale Cc7+ puis gain de la tour', () => {
    const m = all(lineMotifs('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', ['b5c7', 'e8d7', 'c7a8', 'd7c6']));
    assert.match(m, /fourchette \(a8,e8\)/);
    assert.match(m, /gain : prend la tour en a8/);
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

describe('Motifs illusoires', () => {
  const fen = 'r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 4 6';
  it('Cxc6 bxc6 : pas de « fourchette » ni de « piège » (le cavalier est repris)', () => {
    const m = lineMotifs(fen, ['d4c6', 'b7c6', 'f1d3', 'e8g8']).flatMap((r) => r.motifs).join(' | ');
    assert.doesNotMatch(m, /fourchette|piège/);
  });
  it('exd5 cxd5 : pas de « gain » annoncé pour une prise reprise', () => {
    const line = ['d4c6', 'b7c6', 'f1d3', 'e8g8', 'e1g1', 'd7d5', 'e4d5', 'c6d5'];
    const m = lineMotifs(fen, line, 4).flatMap((r) => r.motifs).join(' | ');
    assert.doesNotMatch(m, /prend le pion en d5/);
  });
});

describe('Gain différé', () => {
  it('exd5 puis cxd5 deux demi-coups plus tard : pas de « gain »', () => {
    const fen = 'r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 4 6';
    const line = ['d4c6', 'b7c6', 'f1d3', 'd7d5', 'e4d5', 'e8g8', 'e1g1', 'c6d5', 'h2h3'];
    const m = lineMotifs(fen, line, 4).flatMap((r) => r.motifs).join(' | ');
    assert.doesNotMatch(m, /prend le pion en d5/);
  });
});
