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
    assert.match(m, /fourchette sur la tour noire en a8 et le roi noir en e8|fourchette sur le roi noir en e8 et la tour noire en a8/);
    assert.match(m, /gain : prend la tour en a8/);
  });
  it('piège de l’éléphant : découverte puis coup intermédiaire Fb4+', () => {
    const fen = 'r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6';
    const res = lineMotifs(fen, ['f6d5', 'g5d8', 'f8b4', 'd1d2', 'b4d2', 'e1d2', 'e8d8']);
    assert.match(all(res), /attaque à la découverte sur le fou blanc en g5/);
    assert.match(all(res), /coup intermédiaire \(Fb4\+\) au lieu de reprendre en d8/);
    assert.ok(!/au lieu de reprendre en d2/.test(all(res)));
  });
  it('clouage exécuté par Te8 sur le fou e4', () => {
    const m = all(lineMotifs('r7/8/8/2k5/4B3/8/8/4K3 b - - 0 1', ['a8e8', 'e1f2', 'e8e4']));
    assert.match(m, /clouage du fou blanc en e4 sur son roi/);
  });
  it('un pion cloué sur une pièce n\'est pas un motif (g3 puis Fg2 contre b7/a8)', () => {
    const m = all(lineMotifs('rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2', ['g2g3', 'g8f6', 'f1g2', 'd7d5']));
    assert.ok(!/clouage/.test(m), m);
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

describe('Échange', () => {
  it('Cxc6 bxc6 est nommé « échange cavalier contre cavalier »', () => {
    const fen = 'r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 4 6';
    const m = lineMotifs(fen, ['d4c6', 'b7c6', 'f1d3', 'e8g8']).flatMap((r) => r.motifs).join(' | ');
    assert.match(m, /échange cavalier contre cavalier \(Cxc6, repris par bxc6\)/);
  });
});
