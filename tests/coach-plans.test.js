/** Plans vérifiés pour le coach : détection depuis des suites du moteur, phrases écrites par le code. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectPlans, planSentence } from '../coach/plans.mjs';

const cp = (v) => ({ type: 'cp', value: v });

describe('detectPlans', () => {
  // Position de la planche réelle : Cf6+ Fxf6 Dxf6 échange le fou noir des cases noires, le fou blanc e3 reste.
  const fen = 'r4rk1/p1q2pb1/1p5p/4p1p1/1nP1N3/4BQ2/PP3PPP/R2R2K1 w - - 2 19';
  const best = ['e4f6', 'g7f6', 'f3f6', 'c7c4', 'f6h6', 'c4c6', 'h6g5', 'g8h7', 'g5h4', 'h7g8', 'd1d3', 'c6c2'];
  const quiet = ['d1d2', 'a8d8', 'a1d1', 'c7c6', 'h2h3', 'g8h7', 'e4c3', 'b4a6', 'f3e4', 'h7g8', 'd2d3', 'a6c5'];

  it('trouve le plan des Blancs « dominer les cases noires », avec le coup et l\'exploitation', () => {
    const plans = detectPlans({ fen, lines: [{ pv: best, score: cp(300) }, { pv: quiet, score: cp(90) }, { pv: quiet, score: cp(80) }] });
    const p = plans.w.find((x) => x.concept === 'dominer');
    assert.ok(p, 'plan dominer attendu');
    assert.equal(p.move, 'Dxf6');
    assert.equal(p.shade, 'noires');
    assert.equal(p.exploit, 'Dxg5+');
    assert.match(planSentence(p, 'me'), /^échange son fou des cases noires par Dxf6 en gardant le tien : il est faible sur ces cases, puis Dxg5\+$/);
    assert.match(planSentence(p, 'opp'), /^échanger ton fou des cases noires par Dxf6/);
  });
  it('sans contraste (les autres suites valent autant), pas de plan', () => {
    const plans = detectPlans({ fen, lines: [{ pv: best, score: cp(300) }, { pv: quiet, score: cp(290) }, { pv: quiet, score: cp(285) }] });
    assert.equal(plans.w.length, 0);
  });
  it('consensus : des suites qui se valent et mènent toutes au même concept, c\'est le plan', () => {
    const plans = detectPlans({ fen, lines: [{ pv: best, score: cp(300) }, { pv: best, score: cp(295) }, { pv: best, score: cp(290) }] });
    assert.ok(plans.w.some((x) => x.concept === 'dominer'));
  });
  it('position de mat : pas de plan à raconter', () => {
    const plans = detectPlans({ fen, lines: [{ pv: best, score: { type: 'mate', value: 3 } }, { pv: quiet, score: cp(0) }] });
    assert.deepEqual(plans, { w: [], b: [] });
  });
});

describe('intentions : la matière du plan doit être là', async () => {
  const { ingredientsPresent, pieceCounts, topIntention } = await import('../coach/intentions.mjs');
  it('finale de pions : pas de « tour sur la colonne ouverte » sans tour', () => {
    const fen = '8/5k2/8/3K4/3P4/8/8/8 w - - 0 1';
    const facts = [{ id: 'COLONNE_OUVERTE', params: { file: 'e' } }];
    assert.deepEqual(pieceCounts(fen, 'w'), { r: 0, n: 0, b: 0 });
    assert.equal(ingredientsPresent('tour_colonne', facts, 'w', pieceCounts(fen, 'w')), false);
    assert.equal(topIntention({ tour_colonne: { arbres: 0.9 }, rupture: { arbres: 0.1 } }, { facts, fen, side: 'w' }), null);
  });
  it('avec une tour et une colonne ouverte, la proposition passe', () => {
    const fen = '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1';
    const facts = [{ id: 'COLONNE_OUVERTE', params: { file: 'e' } }];
    const best = topIntention({ tour_colonne: { arbres: 0.9 }, rupture: { arbres: 0.1 } }, { facts, fen, side: 'w' });
    assert.equal(best?.concept, 'tour_colonne');
  });
  it('marge insuffisante entre les deux premiers : on se tait', () => {
    assert.equal(topIntention({ tour_colonne: { arbres: 0.62 }, rupture: { arbres: 0.58 } }), null);
  });
});
