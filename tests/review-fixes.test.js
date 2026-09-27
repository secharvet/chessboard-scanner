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
  it('« matériel » et « material » ne sont pas « mat » ; « trouver » n\'est pas un « trou »', () => {
    const facts = { L1: 'Ligne 1 : 5. Fc4 (+0.3) ; tu gagnes 1 point(s) de matériel.' };
    assert.equal(verifyCitations('Sinon tu perds du matériel [L1].', facts).problems.length, 0);
    assert.equal(verifyCitations('Otherwise you lose material [L1].', facts).problems.length, 0);
    assert.equal(verifyCitations('Il te faut trouver un abri [L1].', facts).problems.length, 0);
    assert.equal(verifyCitations('C\'est mat [L1].', facts).problems.length, 1);
  });
  it('clouage d\'un pion au roi : signalé seulement s\'il lui retire un coup', () => {
    assert.match(texts('4k3/8/8/2b5/8/8/5P2/6K1 w - - 0 1'), /Pion blanc en f2 cloué/); // f3 libre
    assert.ok(!/cloué/.test(texts('4k3/8/8/2b5/8/5N2/5P2/6K1 w - - 0 1'))); // Cf3 bloque : rien à perdre
    assert.match(texts('4k3/4q3/8/8/3p4/4P3/8/4K3 w - - 0 1'), /Pion blanc en e3 cloué/); // exd4 interdit
  });
});

describe('Mode fiche : contrôle de la reformulation', async () => {
  const { checkRephrase } = await import('../coach/brief.mjs');
  const fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';
  const data = { fen, player: 'w', candidates: [{ pvUci: ['f1b5', 'a7a6'] }] };
  const brief = {
    items: [{ kind: 'reason', move: 'Fb5' }],
    allowed: { squares: new Set(['b5', 'c6', 'f3']), moves: new Set(['Fb5', 'Fc4']), pieces: new Set() },
  };
  it('accepte une reformulation fidèle', () => {
    assert.deepEqual(checkRephrase('**Coup conseillé** — Fb5 : ton fou attaque le cavalier c6. Fc4 se vaut presque.', brief, data), []);
  });
  it('refuse une pièce attribuée au mauvais camp', () => {
    assert.equal(checkRephrase('**Coup conseillé** — Fb5 contre ton cavalier en c6.', brief, data).length, 1);
  });
  it('refuse une alternative à la place du coup conseillé', () => {
    assert.equal(checkRephrase('**Coup conseillé** — Fc4 ou Fb5 se valent.', brief, data).length, 1);
  });
  it('refuse une case ou un coup inventés', () => {
    assert.equal(checkRephrase('**Coup conseillé** — Fb5, puis Cg5 sur f7.', brief, data).length >= 2, true);
  });
});

describe('Mode fiche : hiérarchie des raisons', async () => {
  const { buildBrief } = await import('../coach/brief.mjs');
  it('une prise qui gagne la dame passe avant « parer le mat » (et le mentionne)', () => {
    const data = {
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', player: 'b', toMove: 'b', phase: 'ouverture',
      candidates: [{ move: 'Cxh5', pvUci: ['f6h5', 'c4f7', 'e8f7'], evalPlayer: { type: 'cp', value: 650 }, material: -6 }],
      threat: { move: 'Dxf7#', mates: true, material: 0 }, prepared: [], structures: [],
    };
    const b = buildBrief(data);
    assert.equal(b.items.find((x) => x.kind === 'reason').kind, 'win');
    assert.match(b.text, /Cxh5 prend sa dame en h5/);
    assert.match(b.text, /pare la menace de mat Dxf7#/);
  });
});
