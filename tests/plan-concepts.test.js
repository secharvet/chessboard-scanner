/** Étiquette « ce concept est le plan » : contraste strict ou de tempo selon le concept, prix borné, suite calme. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CONTRAST, planLabel, quietReason } from '../coach/plan-concepts.mjs';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const quiet = ['g1f3', 'g8f6', 'b1c3', 'b8c6', 'e2e3', 'e7e6'];
const rec = (evals) => ({ fen: START, evals, pvs: [quiet, quiet, quiet] });
const lines = (best, w1 = -1, w2 = -1, k = 'rupture_w') => [{ [k]: best }, { [k]: w1 }, { [k]: w2 }];

describe('planLabel', () => {
  it('0 quand le concept est absent de la meilleure suite', () => {
    assert.equal(planLabel(rec([50, 0, 0]), lines(-1), 'rupture', 'w'), 0);
  });
  it('1 avec contraste strict : présent dans la meilleure, absent des suites 0,3 pion moins bonnes', () => {
    assert.equal(planLabel(rec([50, 0, 0]), lines(2), 'rupture', 'w'), 1);
  });
  it('null sans contraste : les autres suites valent presque autant', () => {
    assert.equal(planLabel(rec([50, 40, 30]), lines(2), 'rupture', 'w'), null);
  });
  it('null si une suite moins bonne réalise aussi le concept (strict)', () => {
    assert.equal(planLabel(rec([50, 0, 0]), lines(2, 6), 'rupture', 'w'), null);
  });
  it('affaiblir : contraste de tempo, la suite moins bonne peut le réaliser bien plus tard', () => {
    assert.deepEqual(CONTRAST.affaiblir, { tempo: 8, maxPly: 10 });
    assert.equal(planLabel(rec([50, 0, 0]), lines(2, 12, -1, 'affaiblir_w'), 'affaiblir', 'w'), 1);
    assert.equal(planLabel(rec([50, 0, 0]), lines(2, 6, -1, 'affaiblir_w'), 'affaiblir', 'w'), null);
  });
  it('affaiblir : le prix est borné, une apparition tardive est exclue', () => {
    assert.equal(planLabel(rec([50, 0, 0]), lines(12, -1, -1, 'affaiblir_w'), 'affaiblir', 'w'), null);
  });
  it('null si la suite est tactique (matériel changé) avant l\'apparition', () => {
    const r = { fen: START, evals: [50, 0, 0], pvs: [['e2e4', 'd7d5', 'e4d5', 'g8f6', 'b1c3'], quiet, quiet] };
    assert.equal(quietReason(START, r.pvs[0], 4, 'rupture'), 'matériel changé (tactique)');
    assert.equal(planLabel(r, lines(4), 'rupture', 'w'), null);
  });
});

describe('dominer une couleur', () => {
  it('apparaît quand je prends son fou de la couleur de ses trous avec une AUTRE pièce, en gardant mon fou', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    // Noirs : trous noirs f6 et h6 (pions e6, g6 passés devant, roi en g8), fou noir de cases noires en e7 ;
    // Blancs : cavalier en d5, fou de cases noires en g5. Cxe7+ Dxe7 : les Noirs n'ont plus de fou noir, moi si.
    const fen = 'r2q1rk1/pp2b2p/2p1p1p1/3N1pB1/3P4/2N2B2/PPP2PPP/R2Q1RK1 w - - 0 12';
    const s = scanLine(fen, ['d5e7', 'd8e7', 'd1d2', 'a7a6', 'a1e1', 'e7f7', 'g5f4', 'a8d8'], 12);
    assert.equal(s.dominer_w, 0);
    assert.equal(s.dominer_couleur_w, 'noires');
    assert.equal(s.dominer_b, -1);
  });
  it('pas de domination si j\'échange mon propre fou de cette couleur contre le sien', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    const fen = 'r2q1rk1/pp2b2p/2p1p1p1/3N1pB1/3P4/2N2B2/PPP2PPP/R2Q1RK1 w - - 0 12';
    const s = scanLine(fen, ['g5e7', 'd8e7', 'd1d2', 'a7a6', 'a1e1', 'e7f7', 'd5f4', 'a8d8'], 12);
    assert.equal(s.dominer_w, -1);
  });
});
