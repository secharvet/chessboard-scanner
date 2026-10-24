/** Partie réelle du 4 octobre : un mat forcé ne se compare pas comme un score, et passe avant tout dans la fiche. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { judgeMove } from '../coach/move-judge.mjs';
import { buildBrief } from '../coach/brief.mjs';

// Mat du couloir : Te8# en un coup.
const fen = '6k1/r4ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1';
const fakeEngine = (afterScore) => ({
  async analyze(f) {
    if (f === fen) return [{ pv: ['e1e8'], score: { type: 'mate', value: 1 } }];
    return [{ pv: ['a7a2'], score: afterScore }]; // vue de l'adversaire (au trait)
  },
});

describe('Juge : mat raté', () => {
  it('mat en 1 raté, plus de mat forcé → erreur, et on nomme le mat', async () => {
    const v = await judgeMove({ fen, move: 'Re2', engine: fakeEngine({ type: 'cp', value: -50 }) });
    assert.equal(v.category, 'erreur');
    assert.match(v.text, /Tu avais un mat en 1 coup par Te8#/);
    assert.ok(!/presque aussi bon/.test(v.text), v.text);
  });
  it('mat gardé mais plus long → imprécision', async () => {
    const v = await judgeMove({ fen, move: 'Re2', engine: fakeEngine({ type: 'mate', value: -2 }) });
    assert.equal(v.category, 'imprecision');
    assert.match(v.text, /garde un mat, mais en 2 coups/);
  });
  it('le mat joué reste « échec et mat, bravo »', async () => {
    const v = await judgeMove({ fen, move: 'Re8#', engine: fakeEngine({ type: 'cp', value: 0 }) });
    assert.equal(v.category, 'mat');
  });
});

describe('Fiche : le mat forcé passe avant tout', () => {
  it('mat en 1 : « échec et mat », pas de plan ni de « à surveiller »', () => {
    const data = {
      fen, player: 'w', toMove: 'w', phase: 'finale', threat: null, prepared: [{ text: 'son plan est de jouer …Ta1' }], structures: [],
      plans: { b: [{ text: 'tour sur la colonne a' }] },
      candidates: [{ move: 'Te8#', pvUci: ['e1e8'], evalPlayer: { type: 'mate', value: 1 }, material: 0 }, { move: 'Te2', pvUci: ['e1e2'], evalPlayer: { type: 'cp', value: 50 }, material: 0 }],
    };
    const b = buildBrief(data);
    assert.equal(b.items.find((x) => x.kind === 'reason').type, 'mate');
    assert.match(b.text, /Tu as un mat en 1 coup\(s\)\. Te8# : échec et mat\./);
    assert.ok(!b.items.some((x) => x.kind === 'plan_steps' || x.kind === 'watch' || x.kind === 'alternatives'), JSON.stringify(b.items));
    assert.ok(!/pion isolé|pression|surveiller/.test(b.text), b.text);
    assert.match(b.idea, /Cherche le mat/);
  });
});
