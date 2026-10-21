import { test } from 'node:test';
import assert from 'node:assert/strict';
import { probables, tirer } from '../coach/maia.mjs';

const POL = [{ uci: 'e2e4', p: 0.4 }, { uci: 'd2d4', p: 0.3 }, { uci: 'g1f3', p: 0.1 }, { uci: 'c2c4', p: 0.06 },
  { uci: 'b1c3', p: 0.05 }, { uci: 'g2g3', p: 0.05 }, { uci: 'a2a3', p: 0.04 }];

test('maia : coups probables = P ≥ 5 %, au plus 5, dans l\'ordre de la politique, et leur masse', () => {
  const { coups, masse } = probables(POL);
  assert.deepEqual(coups.map((c) => c.uci), ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3']);
  assert.ok(Math.abs(masse - 0.91) < 1e-9);
  assert.deepEqual(probables([{ uci: 'a2a3', p: 0.04 }]).coups, []);
});

test('maia : le tirage dépend de la position et de la graine, pas de l\'ordre des appels', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const a = tirer(POL, fen, 7); tirer(POL, 'autre', 7);
  assert.equal(tirer(POL, fen, 7), a);
  const vus = new Set(); for (let g = 0; g < 200; g++) vus.add(tirer(POL, fen, g).uci);
  assert.ok(vus.has('e2e4') && vus.has('d2d4') && vus.size >= 4);
  assert.equal(tirer([], fen, 1), null);
});

test('maia : au prorata des probabilités', () => {
  const fen = '8/8/8/8/8/8/8/K6k w - - 0 1'; let n = 0;
  for (let g = 0; g < 2000; g++) if (tirer([{ uci: 'a', p: 0.75 }, { uci: 'b', p: 0.25 }], fen, g).uci === 'a') n++;
  assert.ok(n > 1400 && n < 1600, String(n));
});
