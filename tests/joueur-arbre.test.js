import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  echec, menaceMat, pieceEnPrise, derniereRangee, clouage, deuxCoups,
  monMat, priseGagnante, intermede, pieceNonDefendue, tactiqueNommee, deuxCoupsMoi,
  livre, developpement, pirePiece, prophylaxie, plansCatalogue, attaqueDuRoi, amelioration,
  candidats, selectionner, piecesEnPrise, ORDRE,
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

test('2b échec qui gagne : un échec à la découverte qui gagne la tour est produit (pas seulement les prises)', () => {
  // 31.Ce5+ : le cavalier quitte f7, la Tc7 fait échec à la découverte, et le cavalier attaque la Td3 → je gagne la tour.
  const fen = '8/p1R2Nkp/1p1P1pp1/8/8/P2r4/1P4PP/5RK1 w - - 0 1';
  const cs = priseGagnante({ fen, camp: 'w' });
  const c = cs.find((x) => x.coup === 'f7e5');
  assert.ok(c && c.noeud === '2b' && /découverte.*tour/.test(c.raison));
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

test('3 développement : en ouverture sort une mineure et prend le centre ; roque quand c\'est possible ; rien en milieu de jeu tout développé', () => {
  // après 1.e4 e5 2.Cf3 : cavalier et fou à sortir, d2-d4 disponible.
  const ouv = 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';
  const cs = developpement({ fen: ouv, camp: 'w' });
  assert.ok(cs.length > 0 && cs.every((c) => c.noeud === '3D'));
  assert.ok(cs.some((c) => c.coup === 'b1c3' && /je sors mon cavalier/.test(c.raison)));
  assert.ok(cs.some((c) => c.coup === 'd2d4' && /centre/.test(c.raison)));
  // Giuoco : O-O possible → « je mets mon roi à l'abri »
  const roque = developpement({ fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', camp: 'w' });
  assert.ok(roque.some((c) => c.coup === 'e1g1' && /abri/.test(c.raison)));
  // milieu de jeu : tout développé, roqué, coup 25 → rien
  assert.deepEqual(developpement({ fen: 'r4rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R4RK1 w - - 0 25', camp: 'w' }), []);
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

test('selectionner : radar hors plafond MAIS 1c/1f collapsés par famille au-delà de 6 (DEUX parades par famille)', () => {
  const radar = [
    { coup: 'a', noeud: '1c', famille: 'prendre', raisons: [] }, { coup: 'b', noeud: '1c', famille: 'fuir', raisons: [] }, { coup: 'c', noeud: '1c', famille: 'fuir', raisons: [] },
    { coup: 'd', noeud: '1f', famille: 'fuir', raisons: [] }, { coup: 'e', noeud: '1f', famille: 'fuir', raisons: [] }, { coup: 'f', noeud: '1f', famille: 'defendre', raisons: [] },
    { coup: 'g', noeud: '1f', famille: 'prendre', raisons: [] }, { coup: 'h', noeud: '1f', famille: 'contre', raisons: [] }, { coup: 'i', noeud: '1f', famille: 'fuir', raisons: [] },
    { coup: 'j', noeud: '1f', famille: 'defendre', raisons: [] }, { coup: 'k', noeud: '1f', famille: 'fuir', raisons: [] },
  ]; // 11 parades
  const sel = selectionner(radar, 3).filter((c) => c.noeud[0] === '1');
  // DEUX par famille : 1c prendre(a) + fuir(b,c) = a,b,c ; 1f fuir(d,e) + defendre(f,j) + prendre(g) + contre(h) ; i,k coupés (3e fuir)
  assert.deepEqual(sel.map((c) => c.coup), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j']);
});

test('selectionner : radar ≤ 6 reste intact (pas de collapse)', () => {
  const radar = [{ coup: 'a', noeud: '1c', famille: 'fuir', raisons: [] }, { coup: 'b', noeud: '1c', famille: 'fuir', raisons: [] }];
  assert.deepEqual(selectionner(radar, 3).map((c) => c.coup), ['a', 'b']); // 2 ≤ 6 → gardés tels quels
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

test('selectionner : étape 1 vide → plafond 4 pour les étapes 2-3 (un candidat de plus)', () => {
  const faux = [
    { coup: 'c', noeud: '2b', raison: '', raisons: [] }, { coup: 'd', noeud: '2d', raison: '', raisons: [] },
    { coup: 'e', noeud: '3D', raison: '', raisons: [] }, { coup: 'f', noeud: '3P', raison: '', raisons: [] },
    { coup: 'g', noeud: '3Y', raison: '', raisons: [] },
  ]; // aucun radar (noeud '1x')
  assert.equal(selectionner(faux, 3).length, 4); // radar vide → plafond relevé à 4
  const faux2 = [{ coup: 'r', noeud: '1c', famille: 'fuir', raisons: [] }, ...faux]; // radar présent
  assert.equal(selectionner(faux2, 3).filter((c) => c.noeud[0] !== '1').length, 3); // radar présent → plafond reste 3
});

/* ---- le plafond : les coups « coupés » du bilan 4d5e252 reviennent dans les candidats (mesure du 25 oct.) ---- */
// Chaque position vient de bilan-trous-4d5e252.json (classe « coupé ») ; le coup que la recherche complète préférait et que
// la sélection écartait doit maintenant être produit ET retenu. Pur (sans sonde) : seul le correctif de sélection joue.
const retenu = (fen, uci) => selectionner(candidats({ fen, camp: fen.split(' ')[1] })).some((c) => c.coup === uci);

test('plafond 1c : deux parades par famille — Dxc5 (w-01 c.15) revient dans les candidats', () => {
  // radar > 6 ; Dxc5 était la 2e parade « prendre » de 1c, coupée quand on n'en gardait qu'une.
  assert.ok(retenu('r2qk1r1/pp1b1p1p/5p1B/1Qbnp3/3N4/2P5/PP2BPPP/R4RK1 w q - 2 15', 'b5c5'));
});

test('plafond 2b : étape 1 vide, plafond 4 — dxe5 (w-13 c.6) revient dans les candidats', () => {
  assert.ok(retenu('rnb1kbnr/pp3pp1/1qpp3p/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R w KQkq e6 0 6', 'd4e5'));
});

test('plafond 2d : étape 1 vide, plafond 4 — f4 (w-11 c.24) revient dans les candidats', () => {
  assert.ok(retenu('5r2/p5kp/1p1pP1p1/2nPnp2/8/1P5P/P1P2PP1/3R1RK1 w - - 1 24', 'f2f4'));
});

test('plafond 3D : étape 1 vide, plafond 4 — Cc3 (w-22 c.6) revient dans les candidats', () => {
  assert.ok(retenu('r1bqk2r/p1ppppbp/1pn3pn/8/2BPP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 6 6', 'b1c3'));
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

/* ====================================================================== temps 2, premier lot (A/B/C) ====================================================================== */

/* ---- 2f « que menacé-je » : le générateur rend la sonde du joueur (mesMenaces) en candidats ---- */
test('2f (générateur) : rend {coup, raison, noeud: 2f} depuis la sonde ; rien sans sonde', () => {
  assert.deepEqual(deuxCoupsMoi({}), []);
  assert.deepEqual(deuxCoupsMoi({ sonde: { mesMenaces: [] } }), []);
  const mm = [{ coup: 'c3b5', raison: 'je menace mat : s\'il ne fait rien, Cb5 puis Cc7#' }];
  assert.deepEqual(deuxCoupsMoi({ sonde: { mesMenaces: mm } }), [{ coup: 'c3b5', raison: mm[0].raison, noeud: '2f' }]);
});

/* ---- 3d attaque du roi (positions du brief, bilan 4d5e252) ---- */
test('3d : produit la pièce qui entre, le levier et le sacrifice dans la zone du roi', () => {
  const coups = (fen) => attaqueDuRoi({ fen, camp: fen.split(' ')[1] }).map((c) => c.coup);
  assert.ok(coups('r1b1r1k1/1p2qp1p/2npp1pB/6N1/p1BP2Q1/P7/1PP2PPP/1K1R3R w - - 1 16').includes('g4f4')); // w-16 Df4 : la pièce entre
  assert.ok(coups('rnbq1rk1/pp1n1pp1/2p1p2p/3pP3/3P1N2/2PB4/P1P2PPP/R1BQ1RK1 w - - 1 10').includes('f4h5')); // w-23 Ch5 : entre (sacrifice d'installation)
  assert.ok(coups('2kr4/pppbq2p/4rp2/nPP1Np2/5P2/2P1Q3/P5PP/2KR1B1R w - - 0 20').includes('c5c6')); // w-17 c6 : le levier
  assert.ok(coups('2q3rk/4R1pp/p6B/8/4Q3/1P6/2r2PPP/R5K1 w - - 0 25').includes('h6g7')); // w-08 Fxg7+ : le sacrifice proposé
});

test('3d : ne produit pas quand mon roi n\'est pas à l\'abri, ni dans une position calme sans accès', () => {
  assert.equal(attaqueDuRoi({ fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1', camp: 'w' }).length, 0); // mon roi encore en e1
  assert.equal(attaqueDuRoi({ fen: 'r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 1', camp: 'w' }).length, 0); // ni ligne ni crochet
});

/* ---- 3A toujours un coup d'amélioration : produit toujours au moins un coup ---- */
test('3A : produit toujours au moins un coup (les positions « vides » du bilan 4d5e252)', () => {
  for (const fen of [
    '8/2p1kppp/1pB5/3Pp3/4P3/7P/P1Q2PP1/6K1 w - - 0 27',       // w-03 c.27
    '3R4/5pk1/p3pp1p/pr6/5P2/6P1/R4K1P/8 w - - 2 35',          // w-09 c.35
    'r2qk2r/1bpnnpb1/pp1pp2p/6p1/3PP3/P1N1BN2/1PPQBPPP/R4RK1 w kq - 0 12', // w-19 c.12
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // le départ (jamais vide)
  ]) {
    const out = amelioration({ fen, camp: fen.split(' ')[1] });
    assert.ok(out.length >= 1, `3A doit produire au moins un coup (${fen})`);
    assert.ok(out.every((c) => c.noeud === '3A'));
  }
});

test('2f/3d/3A sont dans l\'ORDRE de l\'arbre, aux bonnes places', () => {
  assert.ok(ORDRE.indexOf('2f') > ORDRE.indexOf('2e') && ORDRE.indexOf('2f') < ORDRE.indexOf('3L')); // 2f après 2e, dans l'étape 2
  assert.ok(ORDRE.indexOf('3d') < ORDRE.indexOf('3P')); // 3d avant 3P
  assert.equal(ORDRE[ORDRE.length - 1], '3A'); // 3A en dernier (fin d'étape 3)
});
