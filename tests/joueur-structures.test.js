// La grammaire enrichie du coach joueur : les sept structures de l'Expert (25 octobre 2026) et leurs plans.
import test from 'node:test';
import assert from 'node:assert/strict';
import { structuresEtendues, instancierEtendu, distanceEtendue } from '../coach/joueur/structures-etendues.mjs';

const noms = (fen) => structuresEtendues(fen).map((s) => `${s.name}:${s.color}`).sort();

test('structures étendues : pion passé, finale, roi au centre, colonne ouverte, centre ouvert', () => {
  // finale de tours, pion passé blanc d5 (rangée 5), pas de dames : FINALE des deux côtés, PION_PASSE blanc
  assert.ok(noms('6k1/5ppp/8/3P4/8/8/5PPP/3R2K1 w - - 0 40').includes('PION_PASSE:w'));
  const fin = structuresEtendues('6k1/5ppp/8/3P4/8/8/5PPP/3R2K1 w - - 0 40');
  assert.ok(fin.some((s) => s.name === 'PION_PASSE' && s.color === 'w' && s.params.pion === 'd5'));
  assert.ok(fin.some((s) => s.name === 'FINALE' && s.color === 'w'));
  const plans = instancierEtendu('6k1/5ppp/8/3P4/8/8/5PPP/3R2K1 w - - 0 40', 'w', fin.find((s) => s.name === 'PION_PASSE'));
  assert.deepEqual(plans.map((p) => p.plan.famille), ['poussee', 'transfert'], 'le passé avance, la tour se met derrière');
  assert.equal(plans[0].plan.cible, 'd8');
  // roi noir au centre après le coup 8, dames présentes, colonne e sans pion noir, roi blanc roqué
  const rac = structuresEtendues('r1bqk2r/pp3ppp/2n2n2/2bp4/8/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 10');
  assert.ok(rac.some((s) => s.name === 'ROI_AU_CENTRE' && s.color === 'w' && s.params.colonne === 'e'));
  const pr = instancierEtendu('r1bqk2r/pp3ppp/2n2n2/2bp4/8/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 10', 'b', rac.find((s) => s.name === 'ROI_AU_CENTRE'));
  assert.deepEqual(pr.map((p) => p.plan), [{ famille: 'roquer' }], 'pour les Noirs : roquer');
  // la distance du plan « roquer » : droit présent, 1 + pièces entre le roi et la tour ; roqué = 0
  assert.equal(distanceEtendue('r1bqk2r/pp3ppp/2n2n2/2bp4/8/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 10', 'b', { famille: 'roquer' }).d, 1, 'les Noirs peuvent roquer tout de suite');
  assert.equal(distanceEtendue('r1bqkbnr/pp3ppp/2n5/2pp4/8/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 10', 'b', { famille: 'roquer' }).d, 3, 'fou f8 et cavalier g8 encore à la maison');
  assert.equal(distanceEtendue('r1bq1rk1/pp3ppp/2n2n2/2bp4/8/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 10', 'b', { famille: 'roquer' }).d, 0, 'roqué');
  // même position, roi blanc PAS roqué : pas de ROI_AU_CENTRE
  assert.ok(!structuresEtendues('r1bqk2r/pp3ppp/2n2n2/2bp4/8/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 10').some((s) => s.name === 'ROI_AU_CENTRE'));
  // centre ouvert : aucun pion d ni e
  assert.ok(structuresEtendues('r2q1rk1/pp3ppp/2n2n2/8/8/2N2N2/PP3PPP/R2Q1RK1 w - - 0 15').filter((s) => s.name === 'CENTRE_OUVERT').length === 2);
});

test('structures étendues : majorité et Rubinstein', () => {
  // Blancs 3 pions à l'aile dame contre 2, égalité à l'aile roi, après le coup 12
  const maj = structuresEtendues('r4rk1/1p3ppp/p7/8/8/8/PPP2PPP/R4RK1 w - - 0 20');
  const m = maj.find((s) => s.name === 'MAJORITE' && s.color === 'w');
  assert.ok(m && m.params.aile === 'dame' && ['a2', 'b2', 'c2'].includes(m.params.candidat), JSON.stringify(maj));
  assert.ok(!maj.some((s) => s.name === 'MAJORITE' && s.color === 'b'), 'les Noirs n\'ont de majorité nulle part');
  // Rubinstein : d4 blanc sans pion e, e6 noir sans pion d
  const rub = structuresEtendues('rnbqkb1r/ppp2ppp/4pn2/8/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5');
  assert.ok(rub.some((s) => s.name === 'RUBINSTEIN' && s.color === 'w'));
  const po = instancierEtendu('rnbqkb1r/ppp2ppp/4pn2/8/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5', 'b', rub.find((s) => s.name === 'RUBINSTEIN'));
  assert.deepEqual(po.map((p) => `${p.plan.famille} ${p.plan.pion}${p.plan.cible}`), ['rupture cc5', 'rupture ee5']);
});
