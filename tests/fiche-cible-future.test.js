/** Partie réelle du 4 octobre : « son pion en h5 est une cible » alors que h5 est vide (le pion venait de h7 par …h5). */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildBrief } from '../coach/brief.mjs';

describe('Fiche : une pièce prise plus tard dans la ligne n\'est pas une « cible » si elle n\'y est pas encore', () => {
  const fen = 'r2qkb1r/ppp2ppp/2n1p1n1/3pPb2/3P1P2/2P5/PP2B1PP/RNBQK1NR w KQkq - 0 9';
  const base = { fen, player: 'w', toMove: 'w', phase: 'ouverture', threat: null, prepared: [], structures: [] };
  it('le pion vient de h7 : on le dit, et h5 n\'est pas cité comme cible', () => {
    const data = { ...base, candidates: [{ move: 'g3', pvUci: ['g2g3', 'c6a5', 'h2h4', 'h7h5', 'e2h5'], horizonSan: '9. g3 Ca5 10. h4 h5 11. Fxh5', evalPlayer: { type: 'cp', value: 70 }, material: 2 }] };
    const b = buildBrief(data);
    assert.ok(!/en h5 est une cible/.test(b.text), b.text);
    assert.ok(!/en h5 est une cible/.test(b.idea), b.idea);
    assert.match(b.text, /Fxh5 prend son pion en h5, venu de h7/);
    assert.match(b.idea, /Pas de prise à préparer tout de suite/);
    assert.ok(b.allowed.pieces.has('p|opp|h7'), [...b.allowed.pieces].join());
    assert.ok(!b.allowed.pieces.has('p|opp|h5'));
  });
  it('la pièce est déjà là : la formulation « cible » reste', () => {
    // Fou f5 présent aujourd'hui, pris deux coups plus tard par g4 puis… ici une ligne artificielle : h3 h6 g4 (fou fuit) → on prend un fou resté en f5.
    const data = { ...base, candidates: [{ move: 'Cf3', pvUci: ['g1f3', 'a7a6', 'g2g4', 'a6a5', 'g4f5'], horizonSan: '9. Cf3 a6 10. g4 a5 11. gxf5', evalPlayer: { type: 'cp', value: 300 }, material: 3 }] };
    const b = buildBrief(data);
    assert.match(b.idea, /son fou en f5 est une cible/);
    assert.ok(b.allowed.pieces.has('b|opp|f5'));
  });
});
