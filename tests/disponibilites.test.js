/**
 * Disponibilités : levier disponible, route de cavalier, échange abîmant (positional/disponibilites.js).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildAvailabilityFacts } from '../positional/disponibilites.js';
import { findToken } from '../positional/tokens.js';

function has(tokens, id, params = {}) {
  return Boolean(findToken(tokens, id, params));
}

describe('Levier disponible', () => {
  it('d4-d5 attaquerait c6, d5 défendu par e4 → levier', () => {
    const t = buildAvailabilityFacts('4k3/8/2p5/8/3PP3/8/8/4K3 w - - 0 1');
    assert.ok(has(t, 'LEVIER_DISPONIBLE', { color: 'w', pawn: 'd4', square: 'd5', cible: 'c6' }));
  });

  it('d4-d5 attaquerait c6 mais d5 se prend gratuitement (cxd5 sans défenseur) → rien', () => {
    const t = buildAvailabilityFacts('4k3/8/2p5/8/3P4/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'LEVIER_DISPONIBLE', { color: 'w', square: 'd5' }));
  });

  it('double poussée c2-c4 contre b5, c4 défendu par b3 → levier', () => {
    const t = buildAvailabilityFacts('4k3/8/8/1p6/8/1P6/2P5/4K3 w - - 0 1');
    assert.ok(has(t, 'LEVIER_DISPONIBLE', { color: 'w', pawn: 'c2', square: 'c4', cible: 'b5' }));
  });

  it('case de poussée occupée → pas de levier', () => {
    const t = buildAvailabilityFacts('4k3/8/2p5/3n4/3PP3/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'LEVIER_DISPONIBLE', { color: 'w', pawn: 'd4' }));
  });

  it('symétrique : ...f5-f4 contre g3, f4 défendu par g5 → levier noir', () => {
    const t = buildAvailabilityFacts('4k3/8/8/5pp1/8/6P1/8/4K3 b - - 0 1');
    assert.ok(has(t, 'LEVIER_DISPONIBLE', { color: 'b', pawn: 'f5', square: 'f4', cible: 'g3' }));
  });
});

describe('Route de cavalier', () => {
  it('Cg1 atteint l\'avant-poste e5 (créé par d4) en 2 bonds → route', () => {
    const t = buildAvailabilityFacts('4k3/8/8/8/3P4/8/8/4K1N1 w - - 0 1');
    assert.ok(has(t, 'ROUTE_CAVALIER', { color: 'w', from: 'g1', to: 'e5', moves: 2, but: 'avant_poste' }));
  });

  it('Cf3 atteint d4, case de blocage devant le pion isolé d5, en 1 bond → route', () => {
    const t = buildAvailabilityFacts('4k3/8/8/3p4/8/5N2/8/4K3 w - - 0 1');
    assert.ok(has(t, 'ROUTE_CAVALIER', { color: 'w', from: 'f3', to: 'd4', moves: 1, but: 'blocage' }));
  });

  it('case de blocage gardée par un pion adverse → pas de route', () => {
    // e5 noir attaque d4 : le cavalier ne peut pas s'y installer sûrement.
    const t = buildAvailabilityFacts('4k3/8/8/3pp3/8/5N2/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'ROUTE_CAVALIER', { color: 'w', to: 'd4' }));
  });

  it('cavalier trop loin (3 bonds) → pas de route', () => {
    const t = buildAvailabilityFacts('4k3/8/8/3p4/8/8/8/4K2N w - - 0 1');
    assert.ok(!has(t, 'ROUTE_CAVALIER', { color: 'w', to: 'd4' }));
  });
});

describe('Échange abîmant', () => {
  it('Fxc3, seule reprise bxc3 qui double les pions c → échange abîmant', () => {
    const t = buildAvailabilityFacts('4k3/8/8/8/1b6/2N5/1PP5/4K3 b - - 0 1');
    assert.ok(has(t, 'ECHANGE_ABIMANT', { color: 'b', from: 'b4', cible: 'c3', degat: 'double' }));
  });

  it('Fxf3 près du roi roqué, seule reprise gxf3 qui dégarnit l\'abri → degat abri', () => {
    const t = buildAvailabilityFacts('4k3/8/8/8/6b1/5N2/5PPP/6K1 b - - 0 1');
    assert.ok(has(t, 'ECHANGE_ABIMANT', { color: 'b', from: 'g4', cible: 'f3', degat: 'abri' }));
  });

  it('la pièce prise est aussi défendue par une pièce → pas d\'échange abîmant', () => {
    // Cd1 défend c3 en plus de b2 : la reprise n'est plus forcément un pion.
    const t = buildAvailabilityFacts('4k3/8/8/8/1b6/2N5/1PP5/3NK3 b - - 0 1');
    assert.ok(!has(t, 'ECHANGE_ABIMANT', { color: 'b', cible: 'c3' }));
  });

  it('prise perdante (cavalier contre pion défendu) → pas d\'échange abîmant', () => {
    // Cf5 « attaque » h6, mais h6 vaut un pion : sacrifice, hors définition.
    const t = buildAvailabilityFacts('6k1/5pp1/7p/5N2/8/8/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'ECHANGE_ABIMANT', { color: 'w', cible: 'h6' }));
  });

  it('reprise par pion sans dégât (ni doublé, ni isolé, ni abri) → rien', () => {
    // Cxe5 dxe5 : d6 rejoint la colonne e à côté de f7, rien de durable n'est créé (roi au centre).
    const t = buildAvailabilityFacts('4k3/5p2/3p4/4n3/8/5N2/8/4K3 w - - 0 1');
    assert.ok(!has(t, 'ECHANGE_ABIMANT', { color: 'w', cible: 'e5' }));
  });
});
