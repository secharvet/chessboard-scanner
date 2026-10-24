// L'échiquier du coach joueur : règles vérifiées par comptage exhaustif (perft) sur les positions de référence publiques.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Echiquier, DEPART, uci } from '../coach/joueur/echiquier.mjs';

const REFERENCES = [
  // [fen, [perft 1, 2, 3, 4]]  (valeurs publiques : chessprogramming.org/Perft_Results)
  [DEPART, [20, 400, 8902, 197281]],
  ['r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [48, 2039, 97862]],
  ['8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [14, 191, 2812, 43238]],
  ['r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [6, 264, 9467, 422333]],
  ['rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [44, 1486, 62379]],
  ['r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', [46, 2079, 89890]],
];

test('échiquier : perft sur les six positions de référence', () => {
  for (const [fen, attendus] of REFERENCES) {
    const e = new Echiquier(fen);
    assert.equal(e.fen(), fen, 'FEN relue à l\'identique');
    attendus.forEach((n, i) => assert.equal(e.perft(i + 1), n, `${fen} perft ${i + 1}`));
    assert.equal(e.fen(), fen, 'la position est intacte après perft');
  }
});

test('échiquier : la clé et la position reviennent à l\'identique après coup joué / repris', () => {
  const e = new Echiquier('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1');
  const lo = e.lo, hi = e.hi, fen = e.fen();
  for (const m of e.coups()) {
    assert.ok(e.jouer(m), uci(m));
    const e2 = new Echiquier(e.fen());
    assert.equal(e2.lo, e.lo, `clé incrémentale = clé recalculée après ${uci(m)}`);
    assert.equal(e2.hi, e.hi);
    e.reprendre();
    assert.equal(e.fen(), fen); assert.equal(e.lo, lo); assert.equal(e.hi, hi);
  }
});

test('échiquier : fins de partie', () => {
  const mat = new Echiquier('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
  assert.deepEqual(mat.fin(), { resultat: '0-1', raison: 'mat' });
  const pat = new Echiquier('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  assert.deepEqual(pat.fin(), { resultat: '1/2-1/2', raison: 'pat' });
  assert.equal(new Echiquier('8/8/4k3/8/8/3BK3/8/8 w - - 0 1').fin().raison, 'matériel insuffisant');
  assert.equal(new Echiquier('8/8/4k3/8/8/3BK3/8/5B2 w - - 0 1').fin().raison, 'matériel insuffisant', 'deux fous de même couleur');
  assert.equal(new Echiquier('8/8/4k3/8/8/3BK3/8/4B3 w - - 0 1').fin(), null, 'deux fous de couleurs différentes');
  const rep = new Echiquier('4k3/8/8/8/8/8/8/4K2R w - - 0 1');
  for (const s of ['h1h2', 'e8d8', 'h2h1', 'd8e8', 'h1h2', 'e8d8', 'h2h1', 'd8e8']) rep.jouer(rep.coupDepuisUci(s));
  assert.equal(rep.fin()?.raison, 'triple répétition');
  const nul = new Echiquier('4k3/8/8/8/8/8/8/4K2R w K - 0 1');
  nul.jouerNul(); assert.equal(nul.trait, 8); nul.reprendreNul(); assert.equal(nul.fen(), '4k3/8/8/8/8/8/8/4K2R w K - 0 1');
});
