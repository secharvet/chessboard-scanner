/**
 * Menaces en préparation : un coup calme adverse, puis la menace.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { preparedThreats } from '../coach/prep-threats.mjs';

describe('Menaces en préparation', () => {
  it('pion qui chasse une pièce : …g5 préparerait gxf4 sur le fou f4 non défendu', () => {
    // Fou blanc f4, pions noirs g7/h6 : …g5 attaque le fou.
    const t = preparedThreats('4k3/6p1/7p/8/5B2/8/8/4K3 w - - 0 1', 'w');
    assert.ok(t.some((x) => x.preps.includes('g5') && /fou en f4/.test(x.text)));
  });
  it('pas de bruit en position initiale', () => {
    assert.deepEqual(preparedThreats('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w'), []);
  });
  it('coups préparant la même menace regroupés', () => {
    // Fou blanc a6 non défendu : …Cb8 et …Cb4 (depuis c6) le visent tous deux.
    const t = preparedThreats('4k3/8/B1n5/8/8/8/8/4K3 w - - 0 1', 'w');
    const a6 = t.find((x) => /fou en a6/.test(x.text));
    assert.ok(a6 && a6.preps.length >= 2);
    assert.match(a6.text, / ou /);
  });
});

import { preparedThreats2 } from '../coach/prep-threats.mjs';

describe('Menaces à deux coups calmes', () => {
  it('deux poussées de pion pour attaquer un cavalier (…g6 puis …g5 contre Cf4)', () => {
    // Cavalier blanc f4, pion noir g7 : …g6 ne touche rien, …g5 attaque le cavalier.
    const t = preparedThreats2('4k3/6p1/8/8/5N2/8/8/4K3 w - - 0 1', 'w');
    assert.ok(t.some((x) => /cavalier en f4/.test(x.text) && /puis/.test(x.text)));
  });
  it('rien en position initiale', () => {
    assert.deepEqual(preparedThreats2('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w'), []);
  });
});

describe('Notation des idées adverses', () => {
  it('pas de « … » devant un coup blanc (idée Fb5 contre le cavalier c6)', () => {
    const t = preparedThreats('4k3/8/2n5/8/8/8/8/4KB2 b - - 0 1', 'b');
    assert.ok(t.length > 0);
    assert.ok(t.every((x) => !x.text.startsWith('…')));
  });
  it('« … » devant un coup noir', () => {
    const t = preparedThreats('4k3/6p1/7p/8/5B2/8/8/4K3 w - - 0 1', 'w');
    assert.ok(t.length > 0 && t.every((x) => x.text.startsWith('…')));
  });
});
