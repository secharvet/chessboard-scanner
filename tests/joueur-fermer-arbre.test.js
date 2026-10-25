import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coupDePionOuverture, pieceQuiCede, surprotection, tension, cibleTours, pieceVersMieux, roiBranche, verifieBranche } from '../coach/joueur/arbre.mjs';
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

test('A (3p) : passé l\'ouverture, le centre/l\'ouverture/l\'abri se taisent ; chasser et espace continuent (correction du lot 2)', () => {
  const tardif = 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 21';
  assert.ok(coupDePionOuverture({ fen: tardif, camp: 'w' }).every((c) => c.famille === 'chasser' || c.famille === 'espace'));
  assert.equal(verifieBranche('3p', 'centre', tardif, 'd3d4', 'w'), false); // le centre est d'ouverture → muet au coup 21
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

test('nommer() : un recul utile (3r) est nommé vérifié ; une surprotection (3s) s\'allume dans allumes', () => {
  const j = () => new JoueurArbre({ camp: 'w', budget: 120000 });
  const r = j().nommer('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', {}, 'f3g1', { rapide: true });
  assert.equal(r.noeud, '3r');
  assert.equal(r.raisons.find((x) => x.noeud === '3r').verifie, true);

  const s = j().nommer('r1bqkbnr/pppp1ppp/8/4P3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1', {}, 'd1e2', { rapide: true });
  assert.ok((s.allumes['3s'] ?? []).includes('d1e2'));                                    // la surprotection de e5 est reconnue (allumée)
  assert.ok(s.noeud && s.raisons.find((x) => x.noeud === s.noeud).verifie === true);       // le nom retenu est vérifié
});

/* ---- lot 2 : tension (3t), cibles pour les tours (3u), pièce vers une meilleure case (3m), le roi (3k) ---- */

test('B3 (3t) tension : une prise de pion par un pion la résout ; une non-prise ne produit pas ; le vérificateur refuse une prise de pièce', () => {
  const fen = 'rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4'; // exd5 résout la tension e4/d5
  assert.ok(tension({ fen, camp: 'w' }).some((c) => c.coup === 'e4d5'));
  assert.deepEqual(tension({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', camp: 'w' }), []); // aucun contact de pions
  assert.equal(verifieBranche('3t', 'resout', fen, 'e4e5', 'w'), false); // e5 est une poussée, pas une résolution de tension
});

test('C (3u) cibles pour les tours : Tc1 va sur une colonne ; sans colonne ni cible → rien ; le vérificateur refuse un coup qui n\'est pas une tour', () => {
  const fen = 'rn1q1rk1/1bp1bppp/p3pn2/1p6/3P1B2/2NBPN2/PP3PPP/R2Q1RK1 w - - 6 10';
  assert.ok(cibleTours({ fen, camp: 'w' }).some((c) => c.coup === 'a1c1' && c.noeud === '3u'));
  assert.deepEqual(cibleTours({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', camp: 'w' }), []); // tours enfermées, aucune colonne
  assert.equal(verifieBranche('3u', 'tour', fen, 'd1d2', 'w'), false); // Dd2 n'est pas une tour
});

test('pièce (3m) vers une meilleure case : Cd4 s\'active ; une pièce déjà bien placée ne produit pas ; le vérificateur refuse un coup de pion', () => {
  const fen = '2r3k1/3b2pp/3p1p2/Pp1P3P/q3P3/P1B2N1P/1Q5K/4R3 w - - 0 29'; // Cf3-d4, cavalier vers une case centrale forte
  assert.ok(pieceVersMieux({ fen, camp: 'w' }).some((c) => c.coup === 'f3d4'));
  assert.equal(verifieBranche('3m', 'active', fen, 'a3a4', 'w'), false); // a4 est un pion, pas une pièce (D/F/C)
});

test('B4 (3k) le roi : roi actif en finale (Ke3) ; en pleine bataille sans case gagnée → rien ; le vérificateur refuse un coup de pièce', () => {
  const fen = '8/5Q2/6pk/4p2p/P1P4P/6P1/5K2/8 w - - 1 44'; // Rf2-e3 : le roi s'active / se rapproche
  assert.ok(roiBranche({ fen, camp: 'w' }).some((c) => c.coup === 'f2e3' && c.noeud === '3k'));
  assert.equal(verifieBranche('3k', 'roi', fen, 'f7f6', 'w'), false); // Df6 n'est pas un coup de roi
});
