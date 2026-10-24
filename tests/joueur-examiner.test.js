import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { juger, phaseDe, cpPourCoach, MATE_BASE } from '../scripts/joueur/examiner.mjs';

test('examinateur : score moteur → point de vue du coach', () => {
  assert.equal(cpPourCoach({ type: 'cp', value: 30 }, 1), 30);
  assert.equal(cpPourCoach({ type: 'cp', value: 30 }, -1), -30); // le trait n'est pas le coach
  assert.equal(cpPourCoach({ type: 'mate', value: 3 }, 1), MATE_BASE - 3); // le coach mate en 3
  assert.equal(cpPourCoach({ type: 'mate', value: 3 }, -1), -(MATE_BASE - 3)); // le coach est maté en 3
});

test('examinateur : verdict — seuils bévue / faute / ok', () => {
  assert.equal(juger(20, -150, 30).verdict, 'bevue'); // 170 perdus
  assert.equal(juger(20, -40, 30).verdict, 'faute'); // 60 perdus
  assert.equal(juger(20, 0, 30).verdict, 'ok'); // 20 perdus
  assert.equal(juger(0, 50, 30).verdict, 'ok'); // le coup améliore
  assert.equal(juger(0, -101, 30).verdict, 'bevue'); // exactement au-delà de 100
  assert.equal(juger(0, -100, 30).verdict, 'faute'); // pile 100 : faute, pas bévue
});

test('examinateur : exclusions — coup unique, mat conservé, gâchis de conversion', () => {
  assert.deepEqual(juger(20, -900, 1), { verdict: 'exclu', raison: 'coup unique' });
  // mat en 3 devenu mat en 5 (toujours gagnant) : l'issue ne change pas
  assert.equal(juger(MATE_BASE - 3, MATE_BASE - 5, 30).verdict, 'exclu');
  assert.equal(juger(MATE_BASE - 3, MATE_BASE - 5, 30).raison, 'mat conservé');
  // déjà gagné (+600) et toujours gagné (+450 ? non : il faut rester > 500) — ici +600 → +480 franchit : gâchis seulement si les deux > 500
  assert.equal(juger(600, 480, 30).verdict, 'bevue'); // après ≤ 500 : vraie bévue (on a lâché l'avantage décisif)
  assert.equal(juger(900, 600, 30).verdict, 'exclu'); // les deux > 500, même camp, perte 300 : gâchis de conversion
  assert.equal(juger(900, 600, 30).raison, 'gâchis de conversion');
});

test('examinateur : une partie gagnée jetée n\'est pas un gâchis mais une bévue', () => {
  assert.equal(juger(600, -600, 30).verdict, 'bevue'); // +6 → −6 : l'issue change, bévue
  // mat perdu mais encore gagnant franchement : gâchis (les deux au-delà de 500, même camp)
  assert.equal(juger(MATE_BASE - 3, 700, 30).verdict, 'exclu');
  assert.equal(juger(MATE_BASE - 3, 700, 30).raison, 'gâchis de conversion');
});

test('examinateur : phase par le matériel', () => {
  assert.equal(phaseDe(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')), 'ouverture');
  assert.equal(phaseDe(new Chess('r1b2rk1/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1B2RK1 w - - 0 10')), 'finale'); // sans dames
  assert.equal(phaseDe(new Chess('r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 11')), 'milieu'); // dames, matériel lourd, développé
  assert.equal(phaseDe(new Chess('8/8/8/4k3/8/8/4K3/Q7 w - - 0 50')), 'finale'); // dame mais matériel ≤ 2 tours par camp
  assert.equal(phaseDe(new Chess('r5k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 25')), 'finale'); // sans dames, tours seules
});
