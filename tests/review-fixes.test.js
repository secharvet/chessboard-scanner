/** Défauts relevés en relisant des parties commentées (parties 3 et 4), corrigés à la racine. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { renderToken } from '../positional/interpreter.js';
import { verifyCitations } from '../coach/verify.mjs';
import { preparedThreats } from '../coach/prep-threats.mjs';

const texts = (fen) => buildTacticalFacts(fen).map(renderToken).join(' | ');

describe('Relecture des parties commentées', () => {
  it('fourchette : les cibles sont nommées (deux tours, pas « la dame en d1 »)', () => {
    const t = texts('4r1k1/ppp3p1/3p4/5b1p/2PP1p2/7P/PPn2nP1/2KRNB1R w - - 0 20');
    assert.match(t, /le cavalier noir en f2 attaque en même temps la tour blanche en d1 et la tour blanche en h1/);
  });
  it('pas de clouage relatif sur un pion (Fg2 contre b7, tour a8 derrière)', () => {
    const t = texts('rnbqkb1r/pppp1ppp/5n2/4p3/2P5/6P1/PP1PPPBP/RNBQK1NR b KQkq - 1 3');
    assert.ok(!/Clouage relatif/.test(t), t);
  });
  it('pas d\'enfilade dont la cible de derrière est un pion', () => {
    // Dame blanche d1 → cavalier g4 → pion h5.
    const t = texts('6k1/8/8/7p/6n1/8/8/3QK3 w - - 0 1');
    assert.ok(!/Enfilade/.test(t), t);
  });
  it('clouage au roi : la pièce qui cloue est nommée', () => {
    const t = texts('r2qkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4');
    assert.match(t, /Cavalier noir en c6 cloué contre son roi par le fou blanc en b5/);
  });
  it('« pion dame isolé » exige une source qui nomme la structure', () => {
    const facts = { F3: 'Pion isolé blancs en d6.' };
    assert.equal(verifyCitations('Les Blancs ont un pion dame isolé [F3].', facts).problems.length, 1);
    assert.equal(verifyCitations('Le pion blanc isolé en d6 [F3] est faible.', facts).problems.length, 0);
  });
  it('menaces préparées : promotion en dame seulement (partie 3, coup 18 : …b2 puis bxa1)', async () => {
    const r = await preparedThreats('r3qrk1/1p3pb1/2pp1Bp1/3Np2p/2P1P2P/Pp1P1nPB/5P2/R2K3R w - - 0 18', 'w');
    const promos = r.map((x) => x.threat).filter((t) => /=/.test(t));
    assert.ok(promos.length > 0, 'la menace de promotion doit être vue');
    assert.ok(promos.every((t) => /=D/.test(t)), promos.join(', '));
  });
});
