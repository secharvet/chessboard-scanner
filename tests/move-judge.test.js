import test from 'node:test';
import assert from 'node:assert/strict';
import { category, expectedScore } from '../coach/move-judge.mjs';

test('espérance de score : symétrique, bornée, mat = 0 ou 100', () => {
  assert.equal(Math.round(expectedScore({ type: 'cp', value: 0 })), 50);
  assert.ok(expectedScore({ type: 'cp', value: 300 }) > 75);
  assert.equal(expectedScore({ type: 'mate', value: 3 }), 100);
  assert.equal(expectedScore({ type: 'mate', value: -2 }), 0);
});

test('catégories : seuils de Lichess', () => {
  assert.equal(category(2), 'bon');
  assert.equal(category(7), 'correct');
  assert.equal(category(12), 'imprecision');
  assert.equal(category(25), 'erreur');
  assert.equal(category(40), 'gaffe');
});
