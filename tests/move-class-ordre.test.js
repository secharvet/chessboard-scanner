import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { classify, enPrise } from '../coach/move-class.mjs';

describe('Ordre du classeur : la parade passe avant menace / pression / soutien', () => {
  it('Fh4 : le fou g5 attaqué par h6 se replie, même s\'il « soutient » f2 au passage → défense:sauve', () => {
    const c = new Chess('r2q1rk1/pppnbpp1/4bn1p/3p2B1/3P4/2NB1N2/PPPQ1PPP/2KR3R w - - 0 10');
    const before = enPrise(c, 'w');
    const m = c.move('Bh4');
    const cat = classify(c, m, 0, {}, [{ side: 'w', ply: 0, kind: 'soutien' }], false, before);
    assert.equal(cat, 'défense:sauve');
  });
  it('un levier reste un moyen de structure, devant la parade', () => {
    const c = new Chess('r2q1rk1/pppnbpp1/4bn1p/3p2B1/3P4/2NB1N2/PPPQ1PPP/2KR3R w - - 0 10');
    const before = enPrise(c, 'w');
    const m = c.move('Bh4');
    assert.equal(classify(c, m, 0, {}, [{ side: 'w', ply: 0, kind: 'levier' }], false, before), 'moyen:levier');
  });
});
