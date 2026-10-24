// L'éventail du livre (eventail.js) : construction de l'arbre et position de l'échiquier dans l'arbre, sans DOM.
import test from 'node:test';
import assert from 'node:assert/strict';
import { construireArbre, situer } from '../eventail.js';

const LISTE = [
  { coups: 'e4', suites: [{ san: 'e6', kind: 'principal' }] },
  { coups: 'e4 e6', nom: 'Défense française', suites: [{ san: 'd4', kind: 'principal' }] },
  { coups: 'e4 e6 d4 d5', suites: [{ san: 'e5', kind: 'variante' }, { san: 'Nc3', kind: 'principal' }] }, // parent « e4 e6 d4 » absent
  { coups: 'e4 e6 d4 d5 e5' },
  { coups: 'e4 e6 d4 d5 Nc3' },
  { coups: 'e4 e6 d4 d5 Nc3 Bb4' },
];

test('éventail : arbre par les coups, racine créée, ancêtre manquant sauté, principal en premier', () => {
  const a = construireArbre(LISTE);
  assert.equal(a.racine.coups, ''); assert.equal(a.racine.taille, 7);
  const d5 = a.parCoups.get('e4 e6 d4 d5');
  assert.equal(d5.parent.coups, 'e4 e6', 'rattaché au plus proche ancêtre connu');
  assert.deepEqual(d5.enfants.map((n) => n.san), ['Nc3', 'e5'], 'le principal avant la variante');
  assert.equal(d5.taille, 4);
});

test('éventail : situer la ligne jouée, et la sortie du livre', () => {
  const a = construireArbre(LISTE);
  let s = situer(a, ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4']);
  assert.equal(s.noeud.coups, 'e4 e6 d4 d5 Nc3 Bb4'); assert.equal(s.horsLivre, false);
  s = situer(a, ['e4', 'e6', 'd4', 'd5', 'Nf3']);
  assert.equal(s.noeud.coups, 'e4 e6 d4 d5', 'dernier nœud connu, le trou « e4 e6 d4 » sauté'); assert.equal(s.horsLivre, true);
  s = situer(a, []); assert.equal(s.noeud, a.racine); assert.equal(s.horsLivre, false);
});
