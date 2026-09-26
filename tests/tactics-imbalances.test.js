/**
 * Tactique statique étendue et déséquilibres stratégiques.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { buildImbalanceFacts } from '../positional/imbalances.js';
import { buildBalance } from '../positional/balance.js';
import { buildAllFacts } from '../positional/index.js';
import { findToken } from '../positional/tokens.js';

const has = (t, id, params = {}) => Boolean(findToken(t, id, params));

describe('Tactique — motifs de ligne', () => {
  it('enfilade : tour a1 sur roi a5, dame a8 derrière', () => {
    const t = buildTacticalFacts('q7/8/8/k7/8/8/8/R3K3 w - - 0 1');
    assert.ok(has(t, 'ENFILADE', { square: 'a1', color: 'w', front: 'a5', back: 'a8' }));
  });
  it('clouage relatif : Fg5 cloue Cf6 sur la dame d8', () => {
    const t = buildTacticalFacts('rn1qkb1r/ppp2ppp/3p1n2/4p1B1/4P3/3P4/PPP2PPP/RN1QKBNR w KQkq - 0 5');
    assert.ok(has(t, 'CLOUAGE_RELATIF', { square: 'f6', color: 'b', by: 'g5', behind: 'd8' }));
  });
  it('attaque à la découverte : Cd4 masque Fb2 sur la dame h8', () => {
    const t = buildTacticalFacts('7q/8/8/8/3N4/8/1B6/4K2k w - - 0 1');
    assert.ok(has(t, 'DECOUVERTE_POSSIBLE', { color: 'w', slider: 'b2', mover: 'd4', target: 'h8', check: false }));
  });
  it('échec à la découverte : Ce4 masque Te1 sur le roi e8', () => {
    const t = buildTacticalFacts('4k3/8/8/8/4N3/8/8/4RK2 w - - 0 1');
    assert.ok(has(t, 'DECOUVERTE_POSSIBLE', { color: 'w', mover: 'e4', check: true }));
  });
});

describe('Tactique — surcharge, pièce piégée, dernière rangée', () => {
  it('dame e7 seule à défendre Ce5 et Fb4', () => {
    const t = buildTacticalFacts('6k1/4q3/8/4n3/1b6/P4N2/8/6K1 w - - 0 1');
    assert.ok(has(t, 'SURCHARGE', { square: 'e7', color: 'b' }));
  });
  it('fou h7 piégé après ...g6 (Rg7 le menace, aucune fuite)', () => {
    const t = buildTacticalFacts('8/5pkB/6p1/8/8/8/8/6K1 w - - 0 1');
    assert.ok(has(t, 'PIECE_PIEGEE', { square: 'h7', color: 'w' }));
  });
  it('dernière rangée : sans case de fuite → faible ; avec h3 → non', () => {
    assert.ok(has(buildTacticalFacts('3r2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 30'), 'RANGEE_FAIBLE', { color: 'w' }));
    assert.ok(!has(buildTacticalFacts('3r2k1/5ppp/8/8/8/7P/5PP1/6K1 w - - 0 30'), 'RANGEE_FAIBLE', { color: 'w' }));
  });
});

describe('Déséquilibres', () => {
  it('complexe de cases claires affaibli autour du roi blanc (g3, plus de fou clair)', () => {
    const t = buildImbalanceFacts('6k1/5ppp/4b3/6n1/3PP3/6P1/5P1P/2BQ2K1 w - - 0 20');
    const f = findToken(t, 'COMPLEXE_FAIBLE', { color: 'w', shade: 'claires', enemyBishop: true });
    assert.ok(f);
    assert.match(String(f.params.squares), /f3/);
    assert.match(String(f.params.squares), /h3/);
  });
  it('tour en 7e et contrôle de la colonne', () => {
    const t = buildImbalanceFacts('6k1/1R3ppp/8/8/8/8/5PPP/6K1 w - - 0 30');
    assert.ok(has(t, 'TOUR_7E', { color: 'w', square: 'b7' }));
    assert.ok(has(t, 'CONTROLE_COLONNE', { color: 'w', file: 'b' }));
  });
  it('Française avance : centre fermé', () => {
    const t = buildImbalanceFacts('rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3');
    assert.ok(has(t, 'CENTRE', { type: 'fermé' }));
  });
  it('fou contre cavalier', () => {
    const t = buildImbalanceFacts('6k1/5ppp/4n3/8/8/4B3/5PPP/6K1 w - - 0 30');
    assert.ok(has(t, 'FOU_CONTRE_CAVALIER', { bishop: 'w', knight: 'b' }));
  });
  it('avance de développement', () => {
    // 1.e4 e5 2.Cf3 Cc6 3.Fc4 Fc5 4.O-O … contre des noirs qui ont joué des coups de pion
    const t = buildImbalanceFacts('rnbqkbnr/1pp2pp1/p2p3p/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 b kq - 0 5');
    assert.ok(has(t, 'DEVELOPPEMENT', { color: 'w' }));
  });
});

describe('Bilan', () => {
  it('répartit atouts et faiblesses par camp', () => {
    const b = buildBalance(buildAllFacts('6k1/1R3ppp/8/8/8/8/5PPP/6K1 w - - 0 30'));
    assert.ok(b.w.assets.some((s) => /7e rangée/.test(s)));
    assert.ok(b.b.weaknesses.some((s) => /Dernière rangée faible/.test(s)));
  });
});
