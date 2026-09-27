/**
 * Calcul des lignes forcées et planificateur de manœuvres.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { describeForcing, forcingLines } from '../coach/forcing.mjs';
import { findManeuvers } from '../coach/maneuvers.mjs';

const lines = (fen, side) => forcingLines(fen, side).map(describeForcing).join(' | ');
const routes = (fen, side) => findManeuvers(fen, side).map((m) => m.text).join(' | ');

describe('Lignes forcées', () => {
  it('mat du couloir', () => assert.match(lines('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', 'w'), /Td8# : mat/));
  it('mat de Légal en trois temps', () => {
    assert.match(lines('r2qkbnr/ppp2ppp/2np4/4N3/2B1P1b1/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6', 'w'), /Fxf7\+ Re7 Cd5# : mat/);
  });
  it('piège de l’éléphant : après Cxd5, Fxd8 ne gagne pas (coup intermédiaire Fb4+)', () => {
    assert.equal(lines('r1bqkb1r/ppp2ppp/8/3n2B1/3P4/8/PP2PPPP/R2QKBNR w KQkq - 0 7', 'w'), '');
  });
  it('rien à forcer en position initiale', () => {
    assert.equal(lines('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w'), '');
  });
});

describe('Manœuvres', () => {
  it('pion dame isolé : cavaliers noirs vers la case de blocage d5 (dont Cc6-b4-d5)', () => {
    const r = routes('r1bq1rk1/pp2bppp/2n1pn2/8/2BP4/2N2N2/PP3PPP/R1BQ1RK1 b - - 0 9', 'b');
    assert.match(r, /cavalier f6 → d5 \(case de blocage/);
    assert.match(r, /c6-b4-d5/);
  });
  it('Sicilienne avec ...e5 : Cc3-d5 sur le trou', () => {
    assert.match(routes('r1bqkb1r/pp1p1ppp/2n2n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq e6 0 6', 'w'), /cavalier c3 → d5/);
  });
  it('Carlsbad : tour sur la colonne c semi-ouverte', () => {
    assert.match(routes('r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR w KQ - 0 9', 'w'), /tour a1 → c1/);
  });
});
