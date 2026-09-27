/** Mode anglais (COACH_LANG=en) : faits, notation, garde-fou et vérification ; conversion d'affichage. */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { renderToken } from '../positional/interpreter.js';
import { STRUCTURES } from '../positional/structures.js';
import { findUngroundedMoves } from '../coach/guard.mjs';
import { frenchDisplay, toFrenchSan, withPieceName } from '../coach/notation.mjs';
import { lineMotifs } from '../coach/motifs.mjs';
import { verifyCitations } from '../coach/verify.mjs';

describe('Affichage : coups anglais → français (toujours actif)', () => {
  it('convertit pièces et promotions, laisse cases et roques', () => {
    assert.equal(frenchDisplay('Joue Nf3 puis Rxe8+, bxa1=Q+ ; e8=Q ; O-O ; la case d4 ; Kf1 ; 12...Qd1#'),
      'Joue Cf3 puis Txe8+, bxa1=D+ ; e8=D ; O-O ; la case d4 ; Rf1 ; 12...Dd1#');
  });
});

describe('COACH_LANG=en', () => {
  before(() => { process.env.COACH_LANG = 'en'; });
  after(() => { delete process.env.COACH_LANG; });

  it('les faits et les motifs sont en anglais, coups en notation anglaise', () => {
    const t = buildTacticalFacts('r2qkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4').map(renderToken).join(' | ');
    assert.match(t, /black knight on c6 pinned to its king by the white bishop on b5/i);
    const m = lineMotifs('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', ['b5c7', 'e8d7', 'c7a8']).flatMap((x) => [x.san, ...x.motifs]).join(' | ');
    assert.match(m, /Nc7\+/);
    assert.match(m, /fork on/);
    assert.ok(!/[éèà]|fourchette|Cc7/.test(m), m);
  });
  it('structure : libellé anglais du pion dame isolé', () => {
    assert.match(STRUCTURES.PDI.label, /isolated queen pawn \(IQP\)/);
  });
  it('notation : pas de conversion, noms de pièces anglais', () => {
    assert.equal(toFrenchSan('Nf3'), 'Nf3');
    assert.equal(withPieceName('Nd4'), 'Nd4 (knight)');
  });
  it('garde-fou : repère un coup anglais inventé', () => {
    const data = { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', candidates: [{ pvSan: '2. Nf3 Nc6 3. Bb5' }], threat: null };
    assert.deepEqual(findUngroundedMoves('Play Nf3 then Bb5, not Nd5.', data), ['Nd5']);
  });
  it('vérification : notion française dans la réponse, source anglaise', () => {
    const facts = { F1: 'White isolated pawn on d4.' };
    assert.equal(verifyCitations('Le pion blanc isolé en d4 [F1] est une cible.', facts).problems.length, 0);
    assert.equal(verifyCitations('Le pion dame isolé [F1] est faible.', facts).problems.length, 1);
    assert.equal(verifyCitations('The isolated pawns on d4 and c3 [F1] are weak.', facts).problems.length, 2);
  });
});
