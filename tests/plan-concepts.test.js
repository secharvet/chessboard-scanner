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
    assert.equal(s.dominer_w, 0); // daté à l'offre Cf6+ (vérité de terrain du 2 octobre : « le vrai coup clé est Cd6+ »)
    assert.equal(s.dominer_couleur_w, 'noires');
    assert.equal(s.dominer_exploite_w, -1); // pas encore exploité dans cette suite
  });
  it('étage 3 : une pièce s\'installe sur un trou de la couleur conquise', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    const fen = 'r4rk1/p1q2pb1/1p5p/4p1p1/1nP1N3/4BQ2/PP3PPP/R2R2K1 w - - 2 19';
    // Cf6+ Fxf6 Dxf6 Dxc4 Dxh6 Dc6 Dxg5+ : la dame donne échec sur une case noire, mon fou noir reste.
    const s = scanLine(fen, ['e4f6', 'g7f6', 'f3f6', 'c7c4', 'f6h6', 'c4c6', 'h6g5', 'g8h7', 'g5h4', 'h7g8', 'd1d3', 'c6c2'], 12);
    assert.equal(s.dominer_w, 0); // daté à l'offre Cf6+ (vérité de terrain du 2 octobre : « le vrai coup clé est Cd6+ »)
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

describe('atomes et recettes', () => {
  it('atomes : échange, levier, manœuvre, doublement, roque', async () => {
    const { detectAtoms } = await import('../coach/atoms.mjs');
    const fen = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5';
    const { atoms } = detectAtoms(fen, ['e1g1', 'e8g8', 'd2d3', 'd7d6', 'c1g5', 'h7h6', 'g5f6', 'd8f6', 'c3d5', 'f6d8', 'c2c3', 'a7a6', 'a2a4', 'c8e6', 'f1e1', 'e6d5', 'c4d5', 'c6e7', 'd5b3', 'e7g6', 'd1d2', 'g6f4', 'a1d1', 'a8b8'], 24);
    const kinds = atoms.map((a) => `${a.kind}:${a.side}@${a.ply + 1}`);
    assert.ok(kinds.includes('roque:w@1') && kinds.includes('roque:b@2'), kinds.join(' '));
    assert.ok(atoms.some((a) => a.kind === 'echange' && a.side === 'w' && a.takes === 'n' && a.gives === 'b'), 'Fxf6 Dxf6 : échange fou contre cavalier');
    assert.ok(atoms.some((a) => a.kind === 'manoeuvre' && a.side === 'b' && a.piece === 'n' && a.to === 'f4' && a.steps >= 2), 'Cc6-e7-g6-f4 : manœuvre');
    assert.ok(!atoms.some((a) => a.kind === 'doublement' && a.side === 'w'), 'Te1 et Td1 côte à côte sur la première rangée : pas un doublement');
  });
  it('recette : attaque de minorité dans la Carlsbad (b4-b5, pion c6 faible, tour sur la colonne)', async () => {
    const { scanLine } = await import('../coach/plan-concepts.mjs');
    // Carlsbad type : Blancs d4 sans pion c, Noirs c6 d5 sans pion e.
    const fen = 'r1bq1rk1/pp1nbppp/2p2n2/3p4/3P1B2/2N1PN2/PPQ2PPP/2KR1B1R w - - 0 10';
    const s = scanLine(fen, ['b2b4', 'a7a6', 'a2a4', 'f8e8', 'b4b5', 'a6b5', 'a4b5', 'c6b5', 'c3b5', 'd8b6', 'd1b1', 'c8b7', 'h1d1', 'a8c8', 'c2b3', 'e7d6', 'f4d6', 'b6d6'], 24);
    assert.ok(s.attaque_minorite_w >= 0, `attaque de minorité attendue, atomes : ${s.atomes.map((a) => a.kind + '@' + (a.ply + 1)).join(' ')}`);
    assert.ok(s.atomes.some((a) => a.kind === 'levier' && a.file === 'b' && a.side === 'w'));
  });
});

describe('atomes de la défense', () => {
  it('fermeture : la poussée vient buter contre un pion adverse', async () => {
    const { detectAtoms } = await import('../coach/atoms.mjs');
    // Française : après e4 e6 d4 d5, e5 ferme le centre contre d5 ? Non : e5 face à e6. Puis ...c5 d'un côté, et f4 ; on
    // teste 1.e4 e6 2.d4 d5 3.e5 : le pion e5 fait face au pion e6 et tient.
    const { atoms } = detectAtoms('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'e4e5', 'c7c5', 'c2c3', 'b8c6', 'g1f3', 'd8b6', 'a2a3', 'c5c4'], 12);
    assert.ok(atoms.some((a) => a.kind === 'fermeture' && a.side === 'w' && a.square === 'e5'), atoms.map((a) => a.kind + '@' + (a.ply + 1)).join(' '));
    assert.ok(atoms.some((a) => a.kind === 'fermeture' && a.side === 'b' && a.square === 'c4'), 'c4 vient buter contre c3');
  });
  it('restriction : ma pièce devant son pion lui interdit le levier', async () => {
    const { detectAtoms } = await import('../coach/atoms.mjs');
    // Blancs : pions d4 e4 ; Noirs : pion c7 (levier ...c5 contre d4 possible). Cb5-d6 ? Plus simple : Cc3-b5 puis Cb5-... non.
    // Position : le cavalier blanc vient en c5 devant le pion c6 noir ? Le levier ...c5 n'est possible que depuis c6→c5
    // attaquant d4/b4. Noirs pion c6, Blancs pion d4 : ...c5 attaque d4 : levier jouable. Le cavalier blanc joue en c5.
    const fen = 'r1bqkbnr/pp3ppp/2p1p3/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 0 6';
    const { atoms } = detectAtoms(fen, ['e4c5', 'f8c5', 'd4c5', 'd8a5', 'c2c3', 'a5c5', 'c1e3', 'c5e7'], 8);
    assert.ok(atoms.some((a) => a.kind === 'restriction' && a.side === 'w' && a.square === 'c5' && a.levier === 'c6c5'), atoms.map((a) => a.kind + ':' + (a.levier ?? '') + '@' + (a.ply + 1)).join(' '));
  });
  it('regroupement : une pièce revient près du roi assiégé', async () => {
    const { detectAtoms } = await import('../coach/atoms.mjs');
    // Roi blanc g1, dame et cavalier noirs autour (h4, g4) ; le cavalier blanc revient de b1 en d2 puis f1 (défense).
    const fen = 'r1b2rk1/ppp2ppp/2n5/8/6nq/3B4/PPP2PPP/RNBQR1K1 w - - 0 12';
    const { atoms } = detectAtoms(fen, ['b1d2', 'a8b8', 'd2f1', 'b8a8', 'f1g3', 'a8b8', 'g3e4', 'b8a8'], 8);
    assert.ok(atoms.some((a) => a.kind === 'regroupement' && a.side === 'w' && a.to === 'f1'), atoms.map((a) => a.kind + '@' + (a.ply + 1)).join(' '));
  });
});
