/**
 * Nettoyage du bruit : phase de jeu, pièces réellement en prise, fourchettes rentables, roi.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { buildKingSafetyFacts } from '../positional/king-safety.js';
import { detectPhase } from '../positional/phase.js';
import { findToken } from '../positional/tokens.js';

const has = (t, id, params = {}) => Boolean(findToken(t, id, params));

describe('Phase de jeu', () => {
  it('position initiale = ouverture', () => {
    assert.equal(detectPhase('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'), 'ouverture');
  });
  it('finale de tours = finale', () => {
    assert.equal(detectPhase('4k3/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 40'), 'finale');
  });
  it('milieu de partie développé = milieu', () => {
    assert.equal(detectPhase('r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 10'), 'milieu');
  });
});

describe('Pièce en prise (plus de bruit)', () => {
  it('pièce défendue attaquée par une pièce plus chère : pas signalée', () => {
    // Cavalier e5 défendu par d4, attaqué par la dame e7.
    const t = buildTacticalFacts('4k3/4q3/8/4N3/3P4/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'PIECE_MENACEE', { square: 'e5' }));
  });
  it('pièce défendue attaquée par un pion : signalée', () => {
    const t = buildTacticalFacts('4k3/8/3p4/4N3/3P4/8/8/4K3 w - - 0 1');
    assert.ok(has(t, 'PIECE_MENACEE', { square: 'e5', defended: true }));
  });
  it('pièce non défendue : signalée', () => {
    const t = buildTacticalFacts('4k3/4q3/8/4N3/8/8/8/4K3 w - - 0 1');
    assert.ok(has(t, 'PIECE_MENACEE', { square: 'e5', defended: false }));
  });
});

describe('Fourchette rentable', () => {
  it('dame qui attaque deux pièces défendues moins chères : pas une fourchette', () => {
    // Dame d4 attaque Cb6? non : cavaliers c5 et e5 noirs défendus par pions d6/f6.
    const t = buildTacticalFacts('4k3/8/3p1p2/2n1n3/3Q4/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'FOURCHETTE', { square: 'd4' }));
  });
  it('cavalier roi + tour : fourchette', () => {
    const t = buildTacticalFacts('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'FOURCHETTE', { square: 'b5' }));
    const t2 = buildTacticalFacts('r3k3/2N5/8/8/8/8/8/4K3 w - - 0 1');
    assert.ok(has(t2, 'FOURCHETTE', { square: 'c7', color: 'w' }));
  });
});

describe('Sécurité du roi généralisée', () => {
  it('roi en h1 derrière g2/h2 mais sans pion f : bouclier affaibli sur f', () => {
    const t = buildKingSafetyFacts('r1bq1rk1/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP2PP/R1BQ1R1K w - - 0 8');
    assert.ok(has(t, 'ROQUE_PETIT', { color: 'w' }));
    assert.ok(has(t, 'PIONS_ROI_AFFAIBLI', { color: 'w', files: 'f' }));
  });
  it('pion h3 compte encore dans le bouclier', () => {
    const t = buildKingSafetyFacts('r1bq1rk1/pppp1ppp/2n2n2/4p3/4P3/2N2N1P/PPPP1PP1/R1BQ1RK1 w - - 0 8');
    assert.ok(has(t, 'PIONS_ROI_BOUCLIER', { color: 'w' }));
  });
  it('roi au centre en finale : pas signalé', () => {
    const t = buildKingSafetyFacts('8/pp3kpp/8/8/8/8/PP2K1PP/8 w - - 0 40');
    assert.ok(!has(t, 'ROI_AU_CENTRE'));
  });
});

import { buildStructureFacts } from '../positional/structures.js';

describe('Structures de pions', () => {
  it('PDI blanc', () => {
    const t = buildStructureFacts('r1bq1rk1/pp2bppp/2n1pn2/8/2BP4/2N2N2/PP3PPP/R1BQ1RK1 w - - 0 9');
    assert.ok(has(t, 'STRUCTURE', { name: 'PDI', color: 'w' }));
  });
  it('Carlsbad (blancs d4/e3 contre c6/d5)', () => {
    const t = buildStructureFacts('r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR w KQ - 0 9');
    assert.ok(has(t, 'STRUCTURE', { name: 'CARLSBAD', color: 'w' }));
  });
  it('Française avance', () => {
    const t = buildStructureFacts('rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3');
    assert.ok(has(t, 'STRUCTURE', { name: 'CHAINE_E5', color: 'w' }));
  });
  it('Est-indienne fermée', () => {
    const t = buildStructureFacts('r1bq1rk1/pppnn1bp/3p2p1/3Pp3/2P1Pp2/2N5/PP2BPPP/R1BQNRK1 w - - 0 11');
    assert.ok(has(t, 'STRUCTURE', { name: 'CHAINE_D5', color: 'w' }));
  });
  it('roques opposés', () => {
    const t = buildStructureFacts('2kr1b1r/ppp2ppp/2n5/3q4/8/2N2N2/PPP2PPP/R2Q1RK1 w - - 0 10');
    assert.ok(has(t, 'ROQUES_OPPOSES'));
  });
});
