import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  echec, menaceMat, pieceEnPrise, derniereRangee, clouage, deuxCoups,
  monMat, priseGagnante, intermede, pieceNonDefendue, tactiqueNommee,
  livre, pirePiece, prophylaxie, plansCatalogue,
  candidats, selectionner, piecesEnPrise,
} from '../coach/joueur/arbre.mjs';
import { Echiquier, uci as uciDe } from '../coach/joueur/echiquier.mjs';
import { Recherche, MAT } from '../coach/joueur/recherche.mjs';

const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const coups = (cs) => cs.map((c) => c.coup);
const aRaison = (cs, u) => cs.find((c) => c.coup === u)?.raison ?? '';

/* ---- étape 1 : chaque question sur une position qui produit et une qui ne produit pas ---- */

test('1a échec : produit tous les coups légaux quand je suis en échec, rien sinon', () => {
  // tour noire en e8 cloue le roi blanc e1 ; pas de mat (le roi fuit en d/f).
  const enEchec = { fen: '4r1k1/8/8/8/8/8/8/4K3 w - - 0 1', camp: 'w' };
  const cs = echec(enEchec);
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '1a'));
  assert.equal(coups(cs).sort().join(','), ['e1d1', 'e1d2', 'e1f1', 'e1f2'].sort().join(','));
  assert.deepEqual(echec({ fen: DEPART, camp: 'w' }), []); // pas en échec
});

test('1b menace de mat : produit les parades quand la sonde voit un mat, rien sans sonde', () => {
  const fen = '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1';
  const sonde = { menace: { mat: true }, paree: (u) => u === 'a1a8' }; // Ta8# empêché par une seule parade (bouchon)
  const cs = menaceMat({ fen, camp: 'w', sonde });
  assert.deepEqual(coups(cs), ['a1a8']);
  assert.ok(cs[0].raison.includes('mat') && cs[0].noeud === '1b');
  assert.deepEqual(menaceMat({ fen, camp: 'w' }), []); // pas de sonde → rien
  assert.deepEqual(menaceMat({ fen, camp: 'w', sonde: { menace: { mat: false }, paree: () => true } }), []); // pas un mat → 1f, pas 1b
});

test('1c pièce en prise : produit la sauvegarde de la plus grosse, rien si tout est sûr', () => {
  // fou noir a7 attaque la tour blanche d4, non défendue.
  const fen = '4k3/b7/8/8/3R4/8/8/4K3 w - - 0 1';
  assert.equal(piecesEnPrise(fen, 'w')[0].type, 'r'); // la tour est en prise
  const cs = pieceEnPrise({ fen, camp: 'w' });
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '1c'));
  // la tour peut fuir sur la colonne d ou la 4e rangée hors de portée du fou
  assert.ok(coups(cs).includes('d4d7') || coups(cs).includes('d4e4'));
  assert.ok(cs.some((c) => /à l'abri|défends|prends/.test(c.raison)));
  assert.deepEqual(pieceEnPrise({ fen: DEPART, camp: 'w' }), []); // rien en prise au départ
});

test('1c pièce en prise : la pièce attaquée peut s\'échanger en prenant (bilan à l\'équilibre)', () => {
  // fou b5 attaqué par Cd4 ; Fxc6 est un échange (repris par …bxc6/…Cxc6) qui règle l'attaque.
  const fen = '2kr3r/ppp2ppp/2n5/1B6/3nP3/5N2/PPP2PPP/R1BK3R w - - 0 1';
  const cs = pieceEnPrise({ fen, camp: 'w' });
  const ech = cs.find((c) => c.coup === 'b5c6');
  assert.ok(ech && /échange contre son cavalier/.test(ech.raison));
  assert.ok(cs.some((c) => c.coup === 'f3d4' && /prends son cavalier qui attaquait/.test(c.raison))); // prendre l'attaquant
});

test('1d dernière rangée : produit l\'aération/la couverture sous la menace du couloir, rien sinon', () => {
  const faible = { fen: '3r2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1', camp: 'w' }; // Td8 sur colonne ouverte, roi g1 étouffé
  const cs = derniereRangee(faible);
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '1d'));
  assert.ok(coups(cs).some((u) => ['g2g3', 'h2h3', 'f2f3'].includes(u))); // un trou d'aération
  assert.deepEqual(derniereRangee({ fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1', camp: 'w' }), []); // pas de pièce lourde adverse
});

test('1e clouage : produit la prise du cloueur, le déclouage et la fuite du roi ; rien au départ', () => {
  // tour noire e8 cloue ma tour e2 sur mon roi e1.
  const fen = '4r2k/8/8/8/8/8/4R3/4K3 w - - 0 1';
  const cs = clouage({ fen, camp: 'w' });
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '1e'));
  assert.ok(coups(cs).includes('e2e8')); // je prends le cloueur
  assert.ok(aRaison(cs, 'e2e8').includes('cloueur'));
  assert.ok(coups(cs).includes('e2e3')); // je décloue (le long du clou)
  assert.ok(coups(cs).some((u) => u.startsWith('e1'))); // le roi sort du clou
  assert.deepEqual(clouage({ fen: DEPART, camp: 'w' }), []);
});

test('1f deux coups : produit les parades de la menace matérielle (sonde), rien sans sonde', () => {
  const fen = DEPART;
  const sonde = { menace: { mat: false, perte: 'un pion' }, paree: (u) => u === 'g1f3' };
  const cs = deuxCoups({ fen, camp: 'w', sonde });
  assert.deepEqual(coups(cs), ['g1f3']);
  assert.ok(cs[0].raison.includes('un pion') && cs[0].noeud === '1f');
  assert.deepEqual(deuxCoups({ fen, camp: 'w' }), []);
  assert.deepEqual(deuxCoups({ fen, camp: 'w', sonde: { menace: { mat: true }, paree: () => true } }), []); // un mat → 1b
});

/* ---- étape 2 : mes coups forcés ---- */

test('2a mon mat : produit le mat de la sonde, rien sinon', () => {
  assert.deepEqual(monMat({ sonde: { monMat: { coup: 'a1a8' } } }), [{ coup: 'a1a8', raison: 'j\'ai un mat', noeud: '2a' }]);
  assert.deepEqual(monMat({ sonde: null }), []);
  assert.deepEqual(monMat({ sonde: { monMat: null } }), []);
});

test('2b prise gagnante : produit la prise qui gagne (la plus grosse d\'abord), rien si rien à gagner', () => {
  // dame blanche d1 prend le cavalier noir d5 non défendu.
  const fen = '4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1';
  const cs = priseGagnante({ fen, camp: 'w' });
  assert.ok(cs.some((c) => c.coup === 'd1d5' && c.noeud === '2b'));
  assert.ok(aRaison(cs, 'd1d5').includes('cavalier'));
  assert.deepEqual(priseGagnante({ fen: DEPART, camp: 'w' }), []); // aucune prise au départ
});

test('2c coup intermédiaire : produit un échec/une prise avant de reprendre, rien hors reprise', () => {
  // le fou f1 peut donner Fb5+ avant de reprendre le pion e5 avec le cavalier f3.
  const fen = '4k3/8/8/4p3/8/5N2/8/4KB2 w - - 0 1';
  const cs = intermede({ fen, camp: 'w', dernier: { case: 'e5', prise: true } });
  assert.ok(cs.some((c) => c.coup === 'f1b5' && c.noeud === '2c')); // Fb5+ intermédiaire
  assert.ok(!coups(cs).includes('f3e5')); // la reprise elle-même n'est pas un intermédiaire
  assert.deepEqual(intermede({ fen, camp: 'w', dernier: null }), []); // pas de reprise en attente
});

test('2d pièce non défendue : produit la double attaque, rien au départ', () => {
  // Na4-c5 fourche la tour a6 et le fou e4, toutes deux non défendues (elles ne se défendent pas l'une l'autre), c5 sûre.
  const fen = '7k/8/r7/8/N3b3/8/8/4K3 w - - 0 1';
  const cs = pieceNonDefendue({ fen, camp: 'w' });
  const dbl = cs.find((c) => c.coup === 'a4c5');
  assert.ok(dbl && dbl.noeud === '2d' && /double attaque/.test(dbl.raison));
  assert.deepEqual(pieceNonDefendue({ fen: DEPART, camp: 'w' }), []);
});

test('2d : une pièce DÉFENDUE attaquée par plus petit n\'est jamais dite « non défendue »', () => {
  // c3 attaque le Cd4, défendu par le Cc6 : « avec mon pion », pas « non défendue ».
  const fen = '2kr3r/ppp2ppp/2n5/1B6/3nP3/5N2/PPP2PPP/R1BK3R w - - 0 1';
  const cs = pieceNonDefendue({ fen, camp: 'w' });
  const c3 = cs.find((c) => c.coup === 'c2c3');
  assert.ok(c3 && /avec mon pion/.test(c3.raison) && !/non défendue/.test(c3.raison));
  // aucune raison ne dit « non défendue » d'une pièce en réalité défendue (Cd4 et Td8 le sont ici)
  for (const c of cs) if (/non défendue/.test(c.raison)) assert.fail(`« non défendue » faux : ${c.coup} ${c.raison}`);
});

test('2e tactique nommée : produit un clouage créé en un coup, rien au départ', () => {
  // Ta1-e1 cloue le cavalier e5 sur le roi e8.
  const fen = '4k3/8/8/4n3/8/8/8/R5K1 w - - 0 1';
  const cs = tactiqueNommee({ fen, camp: 'w' });
  assert.ok(cs.some((c) => c.coup === 'a1e1' && c.noeud === '2e' && /cloue/.test(c.raison)));
  assert.deepEqual(tactiqueNommee({ fen: DEPART, camp: 'w' }), []);
});

/* ---- étape 3 (réduite) ---- */

test('3 livre : produit le coup du répertoire avec son sens, rien hors livre', () => {
  const cs = livre({ fen: DEPART, depart: DEPART, historique: [] });
  assert.equal(cs.length, 1);
  assert.equal(cs[0].coup, 'e2e4');
  assert.equal(cs[0].noeud, '3L');
  assert.ok(cs[0].raison.length > 0);
  // une suite hors répertoire ne produit rien
  assert.deepEqual(livre({ fen: 'rnbqkbnr/1ppppppp/p7/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 2', depart: DEPART, historique: ['a2a3', 'a7a6'] }), []);
});

test('3 pire pièce : active une mineure encore chez elle au coup 10, rien au départ', () => {
  const fen = 'r2qkb1r/pp2pppp/2np1n2/2p5/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 10'; // Ff1 pas développé
  const cs = pirePiece({ fen, camp: 'w' });
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '3P' && c.coup.startsWith('f1')));
  assert.ok(cs.some((c) => /pire pièce/.test(c.raison)));
  assert.deepEqual(pirePiece({ fen: DEPART, camp: 'w' }), []); // rien à activer au premier coup (les pièces sont bloquées, pas « mauvaises »)
});

test('3 prophylaxie : produit les coups qui gênent son idée (sonde), rien sans sonde', () => {
  const sonde = { prophylaxie: { paree: (u) => u === 'a2a3', idee: 'jouer …b4' } };
  const cs = prophylaxie({ fen: DEPART, camp: 'w', sonde });
  assert.deepEqual(cs.map((c) => c.coup), ['a2a3']);
  assert.ok(/empêche de jouer …b4/.test(cs[0].raison) && cs[0].noeud === '3Y');
  assert.deepEqual(prophylaxie({ fen: DEPART, camp: 'w' }), []);
});

test('3 plans du catalogue : ne jette pas, et toute sortie est un pas de plan nommé', () => {
  for (const fen of [DEPART, 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 0 6']) {
    const cs = plansCatalogue({ fen, camp: fen.split(' ')[1] });
    assert.ok(Array.isArray(cs));
    for (const c of cs) assert.ok(c.noeud === '3C' && /^j'avance mon plan/.test(c.raison));
  }
});

/* ---- assemblage + sélection ---- */

test('candidats : dédoublonne par coup, garde le nœud le plus haut de l\'arbre', () => {
  const fen = '4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1'; // Dxd5 est produit par 2b, et attaquer d5 par 2d
  const cs = candidats({ fen, camp: 'w' });
  const uniques = new Set(coups(cs));
  assert.equal(uniques.size, cs.length); // aucun doublon de coup
  // un coup produit par 2b et 2d garde 2b (plus haut) mais conserve ses deux raisons
  const d1d5 = cs.find((c) => c.coup === 'd1d5');
  assert.ok(d1d5 && d1d5.noeud === '2b');
});

test('selectionner : radar hors plafond, le reste limité à 3 (une famille d\'abord)', () => {
  const faux = [
    { coup: 'a', noeud: '1c', raison: '', raisons: [] }, { coup: 'b', noeud: '1c', raison: '', raisons: [] }, // radar (2)
    { coup: 'c', noeud: '2b', raison: '', raisons: [] }, { coup: 'd', noeud: '2b', raison: '', raisons: [] },
    { coup: 'e', noeud: '2d', raison: '', raisons: [] }, { coup: 'f', noeud: '2d', raison: '', raisons: [] },
    { coup: 'g', noeud: '2e', raison: '', raisons: [] },
  ];
  const sel = selectionner(faux, 3);
  assert.deepEqual(sel.filter((c) => c.noeud[0] === '1').map((c) => c.coup), ['a', 'b']); // tout le radar
  const reste = sel.filter((c) => c.noeud[0] !== '1');
  assert.equal(reste.length, 3); // plafonné à 3
  assert.deepEqual(reste.map((c) => c.coup), ['c', 'e', 'g']); // une famille d'abord : 2b, 2d, 2e
});

/* ---- la recherche restreinte à la racine aux candidats (étape 4) ---- */

test('racineLimitee : la recherche ne compare que les coups donnés, et chacun a un score exact', () => {
  const ech = new Echiquier('4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1');
  const rech = new Recherche({ budget: 60000 });
  const permis = [ech.coupDepuisUci('d1d5'), ech.coupDepuisUci('e1e2')]; // Dxd5 (gagne le cavalier) vs un coup de roi
  const r = rech.chercher(ech, { budget: 60000, racineLimitee: permis });
  assert.equal(r.candidats.length, 2); // seulement les deux candidats à la racine
  assert.ok(r.candidats.every((c) => c.exact)); // tous exacts (fenêtre ouverte)
  assert.equal(uciDe(r.coup), 'd1d5'); // le meilleur des deux est Dxd5 (il gagne une pièce)
});

test('menace : la recherche courte voit le mat du couloir donné par une PRISE (…Txd1#)', () => {
  // le trou de classe « pas reconnu avant » qu'on veut éliminer : s'il joue, …Txd1 est mat (roi g1, pions f2 g2 h2).
  const ech = new Echiquier('3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1');
  const mn = new Recherche({ budget: 60000 }).menace(ech, { budget: 60000, profondeurMax: 4 });
  assert.ok(mn && mn.score >= MAT - 200, 'la menace doit être un mat'); // c'est ce qui allumera la sonde de 1b dans le joueur
  assert.equal(uciDe(mn.pv[0]), 'd8d1');
});

test('racineLimitee absente : la recherche garde tous les coups de la racine', () => {
  const ech = new Echiquier(DEPART);
  const rech = new Recherche({ budget: 40000 });
  const r = rech.chercher(ech, { budget: 40000 });
  assert.equal(r.candidats.length, 20); // les 20 coups du départ
});
