import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JoueurArbre } from '../coach/joueur/joueur-arbre.mjs';

// nommer() : quelle question de l'arbre RECONNAÎT un coup déjà joué (ici un coup humain de la série Maia-1500). On teste
// le MODE RAPIDE (sonde bornée, cible < 1 s/coup) demandé pour le chantier 1 (la table), et le VÉRIFICATEUR 1c. Les FEN
// sont figées : le test ne dépend d'aucun fichier de partie (le dossier de la série n'est pas versionné).
const neuf = () => new JoueurArbre({ camp: 'w', budget: 120000 });

/* ---- mode rapide : les menaces de mat du bilan sont nommées 2f « que menacé-je » ---- */

// Les sept positions « je menace mat » du bilan 4d5e252 (coup humain donné). Le mode rapide ne sonde que les coups
// menaçants (prise, échec, gain créé, ou mat en 1 s'il passe) : chacun de ces coups prépare un mat, il doit sortir en 2f.
const MATS = [
  ['w-06 Cb5', 'r1bnkb1r/pp1pqppn/3pp2p/4P3/8/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 9', 'c3b5'],
  ['w-14 Dh5', 'rnbqk2r/p3nppp/4p3/1p1pN3/1b1P4/2NB4/PPP2PPP/R1BQ1RK1 w kq - 2 9', 'd1h5'],
  ['w-15 Te1', 'r1bqkb1r/pp1npp1p/2p2np1/8/4N3/3B1N2/PPPP1PPP/R1BQ1RK1 w kq - 0 7', 'f1e1'],
  ['w-23 Dg4', 'rnbq2k1/pp1n2p1/2p1p2p/3pp2N/3P4/B1P2Q2/P1P2PPP/R4RK1 w - - 2 15', 'f3g4'],
  ['w-04 Fc2', '1r1q1rk1/1bp2pp1/p2p1b1p/1p6/5B2/1BPQ4/PP3PPP/R3R1K1 w - - 2 24', 'b3c2'],
  ['w-16 Fh6', 'rnbq1rk1/ppppbppp/4p3/3nP3/3P2Q1/2N5/PPP2PPP/R1B1KBNR w KQ - 3 6', 'c1h6'],
  ['w-24 Dc4', 'q4k1b/2pbp2p/2np1pp1/8/1p1PP3/1BN1B3/1PP1QPPP/5RK1 w - - 0 18', 'e2c4'],
];

test('mode rapide : les 7 menaces de mat du bilan sont nommées 2f « que menacé-je »', () => {
  for (const [nom, fen, uci] of MATS) {
    const r = neuf().nommer(fen, {}, uci, { rapide: true });
    assert.equal(r.noeud, '2f', `${nom} doit être nommé 2f (obtenu ${r.noeud})`);
    assert.ok(/je menace mat/.test(r.raison), `${nom} : la raison dit « je menace mat » (obtenu « ${r.raison} »)`);
    assert.ok((r.allumes['2f'] ?? []).includes(uci), `${nom} : 2f a bien proposé le coup`);
    assert.equal(r.rapide, true);
  }
});

test('les deux modes restent appelables : le mode LENT nomme aussi 2f sur une menace de mat', () => {
  const [, fen, uci] = MATS[0]; // w-06 Cb5
  const r = neuf().nommer(fen, {}, uci); // sans option : mode lent (par défaut, comme aujourd'hui)
  assert.equal(r.noeud, '2f');
  assert.equal(r.rapide, false);
});

/* ---- vérificateur 1c : « une pièce en prise » ne nomme que si la pièce est VRAIMENT gagnable au coup nul ---- */

test('vérificateur 1c : attaquant CLOUÉ → 1c reconnaît le coup mais ne le NOMME pas (non vérifié)', () => {
  // Fou noir g7 attaque la tour blanche d4 (diagonale a1-h8), mais le fou est cloué sur son roi g8 par Tg1 : ...Fxd4 est
  // illégal, la tour n'est pas vraiment en prise. Le générateur 1c (mini-échange statique) la croit en prise et propose
  // de la sauver ; le vérificateur voit qu'au coup nul l'adversaire ne gagne rien → verifie: false, le coup n'est pas nommé 1c.
  const fen = '6k1/6b1/8/8/3R4/8/8/6RK w - - 0 1';
  for (const uci of ['d4a4', 'd4d1']) {
    const r = neuf().nommer(fen, {}, uci, { rapide: true });
    const c1 = (r.raisons ?? []).find((x) => x.noeud === '1c');
    assert.ok(c1, `${uci} : 1c reconnaît bien le coup (c'est le vérificateur qui doit l'écarter, pas le générateur)`);
    assert.equal(c1.verifie, false, `${uci} : la pièce clouée n'est pas vraiment en prise → 1c non vérifié`);
    assert.notEqual(r.noeud, '1c', `${uci} : 1c ne doit pas nommer un coup non vérifié`);
  }
});

test('vérificateur 1c : pièce vraiment en prise → 1c nomme (vérifié)', () => {
  // Fou noir a7 attaque la tour blanche d4, non défendue et non clouée : au coup nul, ...Fxd4 gagne la tour → en prise réelle.
  const fen = '4k3/b7/8/8/3R4/8/8/4K3 w - - 0 1';
  const r = neuf().nommer(fen, {}, 'd4d1', { rapide: true });
  const c1 = (r.raisons ?? []).find((x) => x.noeud === '1c');
  assert.ok(c1 && c1.verifie === true, 'la tour est vraiment en prise → 1c vérifié');
  assert.equal(r.noeud, '1c', 'le nœud qui nomme est 1c (le plus haut vérifié)');
});

/* ---- sortie « quand allumé » : pour chaque nœud allumé, les coups qu'il proposait (c'est la table) ---- */

test('sortie « quand allumé » : allumes donne, par nœud, la liste des coups proposés', () => {
  const [, fen, uci] = MATS[2]; // w-15 Te1
  const r = neuf().nommer(fen, {}, uci, { rapide: true });
  assert.equal(typeof r.allumes, 'object');
  assert.ok(Object.keys(r.allumes).length > 0, 'au moins un nœud allumé');
  for (const [noeud, coups] of Object.entries(r.allumes)) {
    assert.ok(Array.isArray(coups) && coups.length > 0, `${noeud} : une liste non vide de coups`);
    assert.ok(coups.every((u) => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(u)), `${noeud} : des coups en UCI`);
  }
  assert.ok((r.allumes['2f'] ?? []).includes(uci), 'le coup joué figure dans ce que 2f proposait');
});

test('chaque nœud qui reconnaît le coup porte un drapeau verifie', () => {
  const [, fen, uci] = MATS[0];
  const r = neuf().nommer(fen, {}, uci, { rapide: true });
  for (const x of r.raisons) assert.equal(typeof x.verifie, 'boolean', `${x.noeud} porte un drapeau verifie`);
});
