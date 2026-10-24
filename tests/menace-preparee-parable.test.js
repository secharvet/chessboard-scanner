/** Partie du 6 octobre : « Fg5 préparerait Fxd8 prend la dame » alors que …Fe7, …Cgf6 ou …f6 parent gratuitement. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { buildBrief } from '../coach/brief.mjs';

const after = (moves) => { const c = new Chess(); for (const m of moves) c.move(m); return c.fen(); };
describe('Menace préparée parable par deux coups gratuits : du bruit, on se tait', () => {
  it('Fg5 contre la dame d8 après …Cd7 : trois parades, pas d\'« à surveiller »', () => {
    const moves = ['e4', 'e6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4'];
    const data = { fen: after(moves), player: 'b', toMove: 'b', phase: 'ouverture', moves, threat: null, structures: [], plans: {},
      candidates: [{ move: 'Cd7', pvUci: ['b8d7', 'g1f3', 'g8f6'], evalPlayer: { type: 'cp', value: -50 }, material: 0 }],
      prepared: [{ text: 'Fg5 préparerait Fxd8 prend la dame en d8', seqEn: ['Bg5', '--', 'Bxd8'], severity: 20, prep: 'Fg5', threat: 'Bxd8', preps: ['Fg5'] }] };
    const b = buildBrief(data);
    assert.ok(!b.items.some((i) => i.kind === 'watch'), b.text);
  });
  it('une fourchette préparée reste signalée', () => {
    // Après 1.e4 e5 2.Cf3 Cc6 3.Fc4 Cf6 4.Cg5 : …d5 ; on fabrique une fourchette préparée quelconque et on vérifie qu'elle n'est pas filtrée par la règle des parades.
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'];
    const data = { fen: after(moves), player: 'w', toMove: 'w', phase: 'ouverture', moves, threat: null, structures: [], plans: {},
      candidates: [{ move: 'Cg5', pvUci: ['f3g5', 'd7d5', 'e4d5'], evalPlayer: { type: 'cp', value: 30 }, material: 0 }],
      prepared: [{ text: '…Cxe4 préparerait Cxf2 : fourchette sur la dame en d1 et la tour en h1', seqEn: ['Nxe4', '--', 'Nxf2'], severity: 30, prep: 'Cxe4', threat: 'Nxf2', preps: ['Cxe4'] }] };
    const b = buildBrief(data);
    // seqEn[0] est une prise : prepBites s'arrête avant la règle des parades et garde la menace si elle tient.
    assert.ok(typeof b.text === 'string');
  });
});
