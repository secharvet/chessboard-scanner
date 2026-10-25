import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JoueurArbre, refutationLisible } from '../coach/joueur/joueur-arbre.mjs';

const neuf = (opts = {}) => new JoueurArbre({ camp: 'w', budget: 120000, ...opts });

test('le coup qui gagne du matériel est choisi parmi les candidats, avec son nœud', async () => {
  const r = await neuf().choisir('4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1', { camp: 'w' });
  assert.equal(r.uci, 'd1d5'); // Dxd5 gagne le cavalier
  assert.equal(r.noeud, '2b');
  assert.ok(r.candidats.some((c) => c.coup === 'd1d5'));
  assert.ok(!r.alerte);
});

test('RÈGLE 1 — aucun coup ne se joue sans comparaison : le choix est toujours un candidat comparé', async () => {
  const positions = [
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // départ (livre)
    '4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1',                         // un gain
    '4k3/8/8/8/3n4/8/8/R3K3 w - - 0 1',                         // une parade (fourchette menacée)
    'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', // milieu de jeu
    '6k1/5ppp/8/8/8/5PPP/6K1/8 w - - 0 30',                     // calme (finale)
  ];
  for (const fen of positions) {
    const r = await neuf({ budget: 80000 }).choisir(fen, { camp: 'w' });
    assert.equal(r.choisi, r.uci, `choisi = coup joué (${fen})`);
    assert.ok(r.candidats.length >= 1, `au moins un candidat comparé (${fen})`);
    // le coup joué est l'un des candidats comparés (sauf trou : la recherche complète a tranché, c'est journalisé)
    assert.ok(r.trou || r.candidats.some((c) => c.coup === r.choisi), `coup joué comparé ou trou journalisé (${fen})`);
  }
});

test('parade par test (type 16.Fb5+) : la menace « s\'il jouait deux fois » est parée par un coup trouvé par test', async () => {
  // Noir menace ...Cc2+ puis ...Cxa1 (fourchette qui gagne la tour) ; le coach pare (1f).
  const r = await neuf().choisir('4k3/8/8/8/3n4/8/8/R3K3 w - - 0 1', { camp: 'w' });
  assert.equal(r.noeud, '1f');
  assert.ok(/pare|deux fois/.test(r.phrase));
  assert.ok(r.candidats.every((c) => c.noeud === '1f')); // toutes les parades viennent du même nœud
});

test('le coup écarté est un coup qui PERDAIT, dit au conditionnel avec sa ligne et sa perte', async () => {
  // tours sur la colonne a ouverte : Txa8+ gagne la tour ; Rd2 la perdait (…Txa1).
  const r = await neuf().choisir('r3k3/8/8/8/3n4/8/8/R3K3 w - - 0 1', { camp: 'w' });
  assert.equal(r.uci, 'a1a8'); // Txa8+
  assert.ok(r.ecarte, 'un coup écarté est nommé');
  assert.ok(/tour/.test(r.ecarte.perte), 'la perte nommée est une tour');
  assert.ok(/J'ai pensé à/.test(r.phrase) && /rien de tel/.test(r.phrase));
  assert.ok(Array.isArray(r.ecarte.ligne) && r.ecarte.ligne.length > 0); // la réfutation porte sa ligne
});

test('le gain est NOMMÉ (jamais « du matériel ») et le gain manqué se dit « il sauvait sa pièce »', async () => {
  // Txd4 gagne la pièce ; Rd2 (ou une attaque de la tour) ne fait que l'attaquer → le cavalier fuit → gain manqué.
  // (Position choisie sans échec gagnant : contre une dame, un échec reprend aussi la pièce, les deux se valent alors.)
  const r = await neuf().choisir('4k3/8/8/8/3n4/8/8/3RK3 w - - 0 1', { camp: 'w' });
  assert.ok(/je gagne une pièce/.test(r.phrase) && !/du matériel/.test(r.phrase));
  assert.ok(/il sauvait son cavalier/.test(r.phrase));
  assert.ok(r.ecarte && r.ecarte.manque === 'son cavalier'); // écarté = gain manqué, pas une perte
});

test('reprise : reprendre la pièce qui vient de prendre se dit « je reprends », jamais « je gagne »', async () => {
  // 1.e4 d5 2.Cc3 dxe4 ; 3.Cxe4 est une reprise (même case que sa prise), pas un gain.
  const S = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const r = await neuf({ budget: 100000 }).choisir('rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3', { camp: 'w', depart: S, historique: ['e2e4', 'd7d5', 'b1c3', 'd5e4'] });
  assert.equal(r.uci, 'c3e4');
  assert.equal(r.reprise, true);
  assert.equal(r.gain, null);
  assert.ok(/reprends en e4/.test(r.phrase) && !/je gagne/.test(r.phrase));
});

test('réfutation lisible : la perte vient de la réponse adverse (vrai) vs d\'un coup à moi non forcé (faux)', () => {
  const fen = 'r3k3/8/8/8/8/8/8/R3K3 w - - 0 1';
  assert.equal(refutationLisible(fen, ['e1e2', 'a8a1'], 'w'), true); // Rxa1 punit tout de suite
  assert.equal(refutationLisible(fen, ['e1e2', 'e8e7', 'e2d3', 'a8a1'], 'w'), false); // la perte dépend de mon Rd3 non forcé
});

test('le trou n\'est pas faussement signalé quand la recherche complète est d\'accord avec l\'arbre', async () => {
  const r = await neuf({ trou: true }).choisir('4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1', { camp: 'w' });
  assert.equal(r.uci, 'd1d5');
  assert.equal(r.trou, null); // la recherche complète joue le même coup : pas de trou
});

test('plafond 1f : deux parades par famille — De6+ (w-12 c.26, bilan 4d5e252) revient dans les candidats', async () => {
  // radar > 6 ; De6+ était une parade de 1f « s'il jouait deux fois », coupée quand on n'en gardait qu'une par famille.
  const r = await neuf({ budget: 120000 }).choisir('2kr2r1/2p1nQ2/1p1p4/7p/4b3/R7/1PP2PPP/3R2K1 w - - 0 26', { camp: 'w' });
  assert.ok(r.candidats.some((c) => c.coup === 'f7e6'));
});

test('plafond 3Y : étape 1 vide, plafond 4 — g4+ (w-09 c.41, bilan 4d5e252) revient dans les candidats', async () => {
  const r = await neuf({ budget: 120000 }).choisir('8/5p2/R4p1p/4pk2/5P2/5KP1/7P/8 w - - 4 41', { camp: 'w' });
  assert.ok(r.candidats.some((c) => c.coup === 'g3g4'));
});

test('le record porte tout ce que le fichier de partie attend : candidats, choisi, phrase, nœud', async () => {
  const r = await neuf().choisir('r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', { camp: 'w' });
  assert.equal(typeof r.phrase, 'string');
  assert.ok(r.phrase.length > 0);
  assert.ok('candidats' in r && 'choisi' in r && 'ecarte' in r && 'trou' in r && 'noeud' in r);
  for (const c of r.candidats) assert.ok('san' in c && 'coup' in c && 'noeud' in c && 'raison' in c && 'score' in c && 'ligne' in c);
  // aucune interdiction de vocabulaire dans la phrase (règle de parole)
  assert.ok(!/\bscore\b|\bligne\b|\bcandidat\b|\bréfutation\b|\bnote\b/i.test(r.phrase));
});
