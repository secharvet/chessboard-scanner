/** Coach d'ouverture (POC du 6 octobre 2026) : la Française, lue depuis les coups joués. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { openingIntent } from '../coach/opening-intent.mjs';
import { buildBrief } from '../coach/brief.mjs';
import { Chess } from 'chess.js';

const cand = (...ms) => ms.map((m, i) => ({ move: m, evalPlayer: { type: 'cp', value: 40 - 5 * i } }));
describe('Coach d’ouverture : intentions', () => {
  it('ligne principale de l’avance : sens du coup adverse, menace, plan vérifié au moteur', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'], player: 'w', candidates: cand('a3', 'Fe2', 'Fd3') });
    assert.equal(r.nom, 'Avance, ligne principale');
    assert.match(r.texte, /Son Db6 troisième attaquant de d4/);
    assert.match(r.texte, /Menace type/);
    assert.equal(r.conseil.san, 'a3');
    assert.equal(r.ecart, null);
  });
  it('coup du livre absent des trois premiers du moteur : on le dit, on ne le conseille pas', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'], player: 'w', candidates: cand('Dd2', 'h4', 'g3') });
    assert.equal(r.conseil, null);
    assert.match(r.texte, /le moteur préfère nettement Dd2/);
  });
  it('coup du livre second du moteur mais à plus de 0,3 : pas conseillé', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'], player: 'w', candidates: [{ move: 'Dd2', evalPlayer: { type: 'cp', value: 80 } }, { move: 'a3', evalPlayer: { type: 'cp', value: 20 } }] });
    assert.equal(r.conseil, null);
  });
  it('écart adverse listé comme erreur : le pourquoi est donné, et le plan reste', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'Bd3'], player: 'b', candidates: cand('cxd4') });
    assert.match(r.texte, /Il a quitté la théorie avec Fd3/);
    assert.match(r.texte, /Le plan des Noirs ici/);
  });
  it('interversion d4 e6 e4 d5 : reconnue par la position', () => {
    const r = openingIntent({ moves: ['d4', 'e6', 'e4', 'd5'], player: 'w', candidates: cand('e5', 'Cc3') });
    assert.equal(r.nom, 'Défense française');
    assert.equal(r.conseil.san, 'e5');
  });
  it('désambiguïsation : Cbd7 du moteur vaut Cd7 du livre', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Nf6', 'Nc3', 'Bd6', 'a3'], player: 'b', candidates: cand('Cbd7', 'O-O', 'c5') });
    assert.equal(r.conseil.san, 'Cbd7');
    assert.match(r.texte, /Maintenant : Cbd7 prépare …Cgf6/);
  });
  it('un coup du plan dont la suite n’est pas décrite n’est pas un écart', () => {
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'Be2', 'Nh6'], player: 'w', candidates: cand('Fxh6') });
    assert.equal(r.ecart, null);
    assert.match(r.texte, /Le plan des Blancs/);
  });
  it('pas une Française : rien', () => {
    assert.equal(openingIntent({ moves: ['e4', 'e5', 'Nf3', 'Nc6'], player: 'w', candidates: cand('Fb5') }), null);
  });
  it('se tait loin du livre', () => {
    const moves = ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'Be2', 'Nh6', 'O-O', 'cxd4', 'cxd4', 'Nf5', 'Nc3', 'Be7', 'Na4', 'Qa5', 'Bd2', 'Qd8', 'Rc1', 'O-O', 'Nc5', 'b6', 'Nd3', 'a5', 'g4', 'Nh4', 'Nxh4', 'Bxh4'];
    assert.equal(openingIntent({ moves, player: 'w', candidates: cand('Fe3') }), null);
    // Hors livre mais proche : le plan parle encore, et le conseil suit l'ordre du plan parmi les coups du moteur.
    const r = openingIntent({ moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'Ne7', 'Nf3', 'a6'], player: 'w', candidates: cand('b4', 'c3', 'Fd3') });
    assert.match(r.texte, /Maintenant : c3 soutient la base d4/);
    assert.equal(r.conseil.rang, 1);
  });
});

describe('Coach d’ouverture : dans la fiche', () => {
  it('la fiche se construit sur le coup du livre quand il est second du moteur à moins de 0,3', () => {
    const moves = ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6'];
    const c = new Chess(); for (const m of moves) c.move(m);
    const data = {
      fen: c.fen(), player: 'w', toMove: 'w', phase: 'ouverture', moves, threat: null, prepared: [], structures: [], plans: {},
      candidates: [
        { move: 'Fe2', pvUci: ['f1e2', 'c5d4', 'c3d4'], evalPlayer: { type: 'cp', value: 35 }, material: 0 },
        { move: 'a3', pvUci: ['a2a3', 'c5c4', 'b1d2'], evalPlayer: { type: 'cp', value: 30 }, material: 0 },
      ],
    };
    const b = buildBrief(data);
    const reason = b.items.find((x) => x.kind === 'reason');
    assert.equal(reason.type, 'opening');
    assert.equal(reason.move, 'a3');
    assert.match(b.text, /Ouverture : Avance, ligne principale/);
    assert.match(b.text, /Son Db6/);
    assert.match(b.text, /Ton plan : a3/);
    assert.ok(!/Sors tes pièces/.test(b.text), b.text);
    assert.match(b.hints.join(' '), /pion en a2/);
  });
});
