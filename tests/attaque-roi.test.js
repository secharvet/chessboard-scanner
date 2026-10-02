import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { zoneAttackers, CONCEPTS } from '../coach/plan-concepts.mjs';

describe('Attaque du roi par les pièces (D6)', () => {
  it('position initiale : aucune pièce n\'attaque la zone du roi adverse', () => {
    assert.equal(zoneAttackers(new Chess(), 'w'), 0);
  });
  it('dame, fou et cavalier braqués sur le roque noir → trois attaquants, état réalisé', () => {
    const c = new Chess('r1bq1rk1/pppp1ppp/2n2n2/4p3/2B1P3/2NP1N2/PPPQ1PPP/R3K2R w KQ - 0 1');
    // Fc4 vise f7 (voisine du roi g8), Cf3 vise g5/h4 non ; ajoutons une dame en h5 et un cavalier en g5.
    const d = new Chess('r1bq1rk1/pppp1ppp/2n2n2/4p1NQ/2B1P3/2NP4/PPP2PPP/R3K2R w KQ - 0 1');
    assert.ok(zoneAttackers(c, 'w') < 3);
    assert.ok(zoneAttackers(d, 'w') >= 3);
    assert.ok(CONCEPTS.attaque_roi_pieces([], 'w', d));
  });
});
