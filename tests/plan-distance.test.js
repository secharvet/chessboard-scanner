import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { distance, suivre, verrouiller } from '../coach/plan-distance.mjs';

const apres = (coups) => { const c = new Chess(); for (const s of coups.split(/\s+/)) c.move(s); return c; };
const CARLSBAD = 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8';

test('rupture : poussées restantes pesées par le déficit de soutien, double pas compris', () => {
  const c = apres(CARLSBAD);
  const plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  // b2 → b4 (Fe7 attaque b4, rien ne le défend : déficit 1), b5 (c6 attaque, Cc3 défend : 0) → 2 + 1
  assert.equal(distance(c.fen(), 'w', plan).d, 3);
  // a3 défend b4 : le déficit tombe, la distance aussi (coup préparatoire)
  const a3 = new Chess(c.fen()); a3.move('a3');
  assert.equal(distance(a3.fen(), 'w', plan).d, 2);
  // Tb1 derrière le pion : rayon X, la tour soutiendra b4 une fois le pion avancé (objection de l'Expert) → progrès
  const rb1 = new Chess(c.fen()); rb1.move('Rab1');
  assert.equal(distance(rb1.fen(), 'w', plan).d, 2);
  // b4 joué : reste b5
  const b4 = new Chess(c.fen()); b4.move('b4');
  assert.equal(distance(b4.fen(), 'w', plan).d, 1);
  // pion arrivé
  assert.equal(distance('4k3/8/2p5/1P6/8/8/8/4K3 w - - 0 1', 'w', plan).d, 0);
  // pion adverse sur le chemin : bloqué
  assert.equal(distance('4k3/8/8/8/1p6/8/1P6/4K3 w - - 0 1', 'w', plan).d, Infinity);
});

test('transfert : plus court chemin, une pièce à moi sur le chemin coûte un coup de plus', () => {
  const c = apres(CARLSBAD);
  assert.equal(distance(c.fen(), 'w', { famille: 'transfert', de: 'f3', vers: 'e5' }).d, 1);
  // Cb1 → d5 par c3 ou d2-f3… : 2 coups ; la tour a1 vers a3 derrière le pion a2 : il doit s'écarter
  assert.equal(distance('4k3/8/8/8/8/8/P7/RN2K3 w - - 0 1', 'w', { famille: 'transfert', de: 'b1', vers: 'd5' }).d, 2);
  assert.equal(distance('4k3/8/8/8/8/8/P7/RN2K3 w - - 0 1', 'w', { famille: 'transfert', de: 'a1', vers: 'a3' }).d, 2);
  // case d'arrivée adverse : impossible
  assert.equal(distance('4k3/8/8/3n4/8/8/8/RN2K3 w - - 0 1', 'w', { famille: 'transfert', de: 'b1', vers: 'd5' }).d, Infinity);
  // la pièce suivie change de case avec le coup
  const m = { from: 'f3', to: 'e5' };
  assert.deepEqual(suivre({ famille: 'transfert', de: 'f3', vers: 'e5' }, m), { famille: 'transfert', de: 'e5', vers: 'e5' });
});

test('échange : chemin jusqu\'à une case d\'où ma pièce attaque la cible, plus la prise', () => {
  // Fc8 contre Fe2 dans la Française d'avance : le pion b7 est bloqué par sa propre dame (pas de route par a6),
  // reste …Fd7, le cavalier c6 s'écarte, …Fb5 : 3 coups puis la prise ; …Fd7 et …Ca5 progressent
  const c = apres('e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2');
  const plan = { famille: 'echange', mienne: 'c8', cible: 'e2' };
  assert.equal(distance(c.fen(), 'b', plan).d, 4);
  const bd7 = new Chess(c.fen()); bd7.move('Bd7');
  assert.equal(distance(bd7.fen(), 'b', suivre(plan, { from: 'c8', to: 'd7' })).d, 3);
  const na5 = new Chess(c.fen()); na5.move('Na5');
  assert.equal(distance(na5.fen(), 'b', plan).d, 3);
  // déjà en contact : 1 (la prise)
  assert.equal(distance('4k3/8/8/8/8/8/8/2B1K1n1 w - - 0 1', 'w', { famille: 'echange', mienne: 'c1', cible: 'g1' }).d, 2);
  assert.equal(distance('4k3/8/8/8/8/8/3n4/2B1K3 w - - 0 1', 'w', { famille: 'echange', mienne: 'c1', cible: 'd2' }).d, 1);
  // cible disparue : réalisé
  assert.equal(distance('4k3/8/8/8/8/8/8/2B1K3 w - - 0 1', 'w', { famille: 'echange', mienne: 'c1', cible: 'd2' }).d, 0);
});

test('et : la distance d\'une conjonction est la somme, et chaque étape est décomposée', () => {
  // Espagnole d'échange sans dames : f4 puis e5 ; f4 (1) + e5 (1 + déficit 1 : f6 attaque, rien ne défend) = 3
  const c = apres('e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 exd4 Nxd4 c5 Nb3 Qxd1 Rxd1 Bg4 f3 Be6');
  const plan = { famille: 'et', plans: [{ famille: 'rupture', pion: 'f', cible: 'f4' }, { famille: 'rupture', pion: 'e', cible: 'e5' }] };
  const r = distance(c.fen(), 'w', plan);
  assert.equal(r.d, 3);
  assert.equal(r.etapes.length, 2);
  // après f4 : f4 réalisé (0), e5 soutenu par f4 (1) → 1
  const f4 = new Chess(c.fen()); f4.move('f4');
  assert.equal(distance(f4.fen(), 'w', plan).d, 1);
});

test('verrou : un plan réalisé reste réalisé', () => {
  const plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  const fen = '4k3/8/2p5/1P6/8/8/8/4K3 w - - 0 1';
  const v = verrouiller(plan, fen, 'w');
  assert.equal(v.realise, true);
  // bxc6 : plus de pion b, mais le plan ne redevient pas indéfini
  assert.equal(distance('4k3/8/2P5/8/8/8/8/4K3 b - - 0 1', 'w', v).d, 0);
  assert.equal(distance('4k3/8/2P5/8/8/8/8/4K3 b - - 0 1', 'w', plan).d, Infinity);
});

test('colonne : mes pions sur la colonne plus le chemin de la tour la plus proche', () => {
  const c = apres('e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 Bd3 Nf6 O-O O-O');
  assert.equal(distance(c.fen(), 'w', { famille: 'colonne', colonne: 'e' }).d, 1);
  // colonne c pour les Blancs : le pion c2 à retirer (1), la tour a1 → c1 avec Cb1 et Fc1 à écarter (1 + 2)
  assert.equal(distance(c.fen(), 'w', { famille: 'colonne', colonne: 'c' }).d, 4);
  // tour déjà sur la colonne, sans pion : réalisé
  assert.equal(distance('4k3/8/8/8/8/8/8/2R1K3 w - - 0 1', 'w', { famille: 'colonne', colonne: 'c' }).d, 0);
});
