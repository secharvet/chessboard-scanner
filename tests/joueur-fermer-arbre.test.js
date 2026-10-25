import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coupDePionOuverture, pieceQuiCede, surprotection, verifieBranche } from '../coach/joueur/arbre.mjs';
import { JoueurArbre } from '../coach/joueur/joueur-arbre.mjs';

// « Fermer l'arbre » (FERMER-L-ARBRE-2026-10-25.md), premier lot : trois branches calmes, chacune VÉRIFIABLE sur
// l'échiquier (pas de vérification, pas de nom). Par branche : une position où elle produit, une où elle ne produit pas,
// une où le vérificateur refuse. Ces branches servent au NOMMAGE (la table), pas au joueur du site (choisir() est intact).
const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const coups = (cs) => cs.map((c) => c.coup);

/* ---- A. Le coup de pion d'ouverture (3p) : cinq raisons, nommé par la plus haute qui se vérifie ---- */

test('A (3p) produit : au départ, des coups de pion avec leur raison (centre, ouvrir, espace…)', () => {
  const cs = coupDePionOuverture({ fen: DEPART, camp: 'w' });
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '3p' && c.famille));
  assert.ok(cs.some((c) => c.coup === 'd2d4' && c.famille === 'centre'));   // d4 prend le centre
  assert.ok(cs.some((c) => c.coup === 'g2g3' && c.famille === 'ouvrir'));   // g3 ouvre le fou f1
});

test('A (3p) ne produit pas : passé l\'ouverture (coup > 20), ce nœud se tait', () => {
  assert.deepEqual(coupDePionOuverture({ fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 21', camp: 'w' }), []);
});

test('A (3p) vérificateur refuse : a3 au départ ne prend pas le centre', () => {
  assert.equal(verifieBranche('3p', 'centre', DEPART, 'a2a3', 'w'), false);
  assert.equal(verifieBranche('3p', 'centre', DEPART, 'd2d4', 'w'), true); // d4, lui, le prend
});

/* ---- B1. La pièce qui cède une case (3r) : recul utile, distinct de 3P (pas vers une meilleure case) ---- */

test('B1 (3r) produit : Cf3-g1 se retire et libère f3 pour le pion f', () => {
  const cs = pieceQuiCede({ fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', camp: 'w' });
  assert.ok(cs.some((c) => c.coup === 'f3g1' && c.noeud === '3r'));
});

test('B1 (3r) ne produit pas : au départ, aucune pièce ne peut se retirer utilement', () => {
  assert.deepEqual(coups(pieceQuiCede({ fen: DEPART, camp: 'w' })), []);
});

test('B1 (3r) vérificateur refuse : Cb1-c3 libère b1, que rien ne peut utiliser', () => {
  // Ke1, Cb1, pions d2/e2 : b1 libérée n'est atteignable par aucune pièce (pas de tour/fou) ni par un pion → pas de recul utile.
  assert.equal(verifieBranche('3r', 'cede', '4k3/8/8/8/8/8/3PP3/1N2K3 w - - 0 1', 'b1c3', 'w'), false);
});

/* ---- B2. La surprotection (3s) : un défenseur de plus sur un pion fort, sans menace présente ---- */

test('B2 (3s) produit : Dd1-e2 surprotège le pion e5 (central, non attaqué)', () => {
  const cs = surprotection({ fen: 'r1bqkbnr/pppp1ppp/8/4P3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1', camp: 'w' });
  const c = cs.find((x) => x.coup === 'd1e2');
  assert.ok(c && c.noeud === '3s' && /surprotège e5/.test(c.raison));
});

test('B2 (3s) ne produit pas : au départ, aucun pion fort à surprotéger', () => {
  assert.deepEqual(coups(surprotection({ fen: DEPART, camp: 'w' })), []);
});

test('B2 (3s) vérificateur refuse : a3 ne surprotège aucun point', () => {
  assert.equal(verifieBranche('3s', 'surprotection', 'r1bqkbnr/pppp1ppp/8/4P3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1', 'a2a3', 'w'), false);
});

/* ---- intégration : nommer() allume les nouvelles branches et les marque vérifiées, sans toucher le joueur ---- */

test('nommer() : une surprotection et un recul utile sont nommés 3s / 3r, vérifiés, et figurent dans allumes', () => {
  const j = () => new JoueurArbre({ camp: 'w', budget: 120000 });
  const s = j().nommer('r1bqkbnr/pppp1ppp/8/4P3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1', {}, 'd1e2', { rapide: true });
  assert.equal(s.noeud, '3s');
  assert.equal(s.raisons.find((x) => x.noeud === '3s').verifie, true);
  assert.ok((s.allumes['3s'] ?? []).includes('d1e2'));

  const r = j().nommer('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', {}, 'f3g1', { rapide: true });
  assert.equal(r.noeud, '3r');
  assert.equal(r.raisons.find((x) => x.noeud === '3r').verifie, true);
});
