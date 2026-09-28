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
  it('compte aussi quand je force l\'échange par une offre : Cf6+ Fxf6 Dxf6 (planche réelle)', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    const fen = 'r4rk1/p1q2pb1/1p5p/4p1p1/1nP1N3/4BQ2/PP3PPP/R2R2K1 w - - 2 19';
    const s = scanLine(fen, ['e4f6', 'g7f6', 'f3f6', 'c7c4', 'd1d2', 'c4c6', 'f6f3', 'c6e6', 'a1d1', 'a7a5', 'h2h4', 'g5h4'], 12);
    assert.equal(s.dominer_w, 2);
    assert.equal(s.dominer_couleur_w, 'noires');
    assert.equal(s.dominer_exploite_w, -1); // pas encore exploité dans cette suite
  });
  it('étage 3 : une pièce s\'installe sur un trou de la couleur conquise', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    const fen = 'r4rk1/p1q2pb1/1p5p/4p1p1/1nP1N3/4BQ2/PP3PPP/R2R2K1 w - - 2 19';
    // Cf6+ Fxf6 Dxf6 Dxc4 Dxh6 Dc6 Dxg5+ : la dame donne échec sur une case noire, mon fou noir reste.
    const s = scanLine(fen, ['e4f6', 'g7f6', 'f3f6', 'c7c4', 'f6h6', 'c4c6', 'h6g5', 'g8h7', 'g5h4', 'h7g8', 'd1d3', 'c6c2'], 12);
    assert.equal(s.dominer_w, 2);
    assert.equal(s.dominer_exploite_w, 6);
  });
  it('ne compte pas quand l\'adversaire donne son fou de lui-même et que je ne fais que reprendre', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    // Le cavalier f6 était là depuis le début : Fxf6 est une décision blanche, Fxf6 une simple reprise noire.
    const fen = 'r2q1rk1/pp2b2p/2p1pnp1/3N1pB1/3P4/2N2B2/PPP2PPP/R2Q1RK1 w - - 0 12';
    const s = scanLine(fen, ['g5f6', 'e7f6', 'd1d2', 'a7a6', 'a1e1', 'd8e7', 'd5f4', 'a8d8'], 12);
    assert.equal(s.dominer_b, -1);
  });
  it('pas de domination si j\'échange mon propre fou de cette couleur contre le sien', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    const fen = 'r2q1rk1/pp2b2p/2p1p1p1/3N1pB1/3P4/2N2B2/PPP2PPP/R2Q1RK1 w - - 0 12';
    const s = scanLine(fen, ['g5e7', 'd8e7', 'd1d2', 'a7a6', 'a1e1', 'e7f7', 'd5f4', 'a8d8'], 12);
    assert.equal(s.dominer_w, -1);
  });
});
