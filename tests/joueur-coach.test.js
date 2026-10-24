// Le coach joueur hors ligne : évaluation lisible, recherche qui trouve le mat, et un coup choisi avec sa phrase.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Echiquier, uci } from '../coach/joueur/echiquier.mjs';
import { evaluer, evaluerDetail, enCentipions } from '../coach/joueur/evaluation.mjs';
import { Recherche, MAT } from '../coach/joueur/recherche.mjs';
import { Joueur } from '../coach/joueur/joueur.mjs';
import { formuler, ligneTexte, materielEnMots } from '../coach/joueur/parole.mjs';

test('évaluation : symétrique au départ, un pion de plus vaut environ un pion, termes nommés', () => {
  const depart = new Echiquier();
  const e0 = enCentipions(evaluer(depart));
  assert.ok(Math.abs(e0) < 20, `départ proche de 0 : ${e0}`);
  const pionDePlus = new Echiquier('rnbqkbnr/ppp1pppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2');
  const e1 = enCentipions(evaluer(pionDePlus));
  assert.ok(e1 > 60 && e1 < 160, `un pion de plus : ${e1}`);
  const d = evaluerDetail(pionDePlus);
  const noms = new Set(d.termes.map((t) => t.nom));
  for (const n of ['matériel', 'placement', 'mobilité', 'abri du roi', 'développement']) assert.ok(noms.has(n), `terme ${n} présent`);
  assert.ok(d.termes.every((t) => typeof t.quoi === 'string'), 'chaque terme dit de quoi il parle');
  // même position vue par les Noirs : score opposé (au tempo près)
  const noirs = new Echiquier('rnbqkbnr/ppp1pppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2');
  assert.ok(Math.abs(enCentipions(evaluer(noirs)) + e1) < 30, 'antisymétrie');
});

test('recherche : mat en deux trouvé, reproductible, candidats exacts', () => {
  const R = new Recherche({ budget: 100000 });
  const e = new Echiquier('r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1');
  const r = R.chercher(e);
  assert.equal(uci(r.coup), 'd5f6'); assert.ok(r.score >= MAT - 10, 'score de mat');
  assert.deepEqual(r.pv.map(uci), ['d5f6', 'g7f6', 'c4f7']);
  const r2 = R.chercher(e);
  assert.equal(r2.noeuds, r.noeuds, 'même position, même recherche');
  assert.ok(r.candidats.slice(0, 2).every((c) => c.exact), 'les deux premiers candidats ont un score exact');
  // répétition : la position revenue deux fois vaut 0 dans la recherche
  const rep = new Echiquier('4k3/8/8/8/8/8/8/4K2R w - - 0 1');
  for (const s of ['h1h2', 'e8d8', 'h2h1', 'd8e8', 'h1h2', 'e8d8', 'h2h1', 'd8e8']) rep.jouer(rep.coupDepuisUci(s));
  assert.equal(rep.fin()?.raison, 'triple répétition');
});

test('parole : lignes numérotées, matériel en mots, phrase assemblée', () => {
  assert.equal(ligneTexte(['Cxe5', 'Fxe5', 'd4'], 23), '12.Cxe5 Fxe5 13.d4');
  assert.equal(ligneTexte(['Fxe5', 'd4'], 24), '12…Fxe5 13.d4');
  assert.equal(materielEnMots({ P: 1, N: 0, B: 0, R: 0, Q: 0 }), 'un pion');
  assert.equal(materielEnMots({ P: 0, N: -1, B: 0, R: 1, Q: 0 }), 'la qualité (une tour contre un cavalier ou un fou)');
  assert.equal(materielEnMots({ P: 0, N: 0, B: 0, R: 0, Q: 1 }), 'la dame');
  const { phrase, alerte } = formuler({ ply: 27, san: 'Cd5', sorte: 'amelioration', sousSorte: 'avant_poste', battu: { san: 'a3', ecart: 40, seValent: false, planTerme: 0 }, ligne: ['Cd5'], ligneBattu: ['a3'], termes: [{ nom: 'avant-poste', cle: 'avant_poste', poids: 40, donnees: { ma_piece: 'mon cavalier', case: 'd5' } }], menace: null, pieceM: 'N', caseM: 'd5' });
  assert.equal(phrase, 'Rien de forcé. Mon cavalier s\'installe en d5 : aucun pion adverse ne peut plus l\'en chasser. a3 était nettement moins bon.');
  assert.equal(alerte, null);
});

test('joueur : un coup légal, une phrase, le contrat ; le livre à la racine ; le mat dit mat', async () => {
  const J = new Joueur({ budget: 30000 });
  const r = await J.choisir('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', { camp: 'w', ply: 0, depart: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', historique: [] });
  assert.equal(r.san, 'e4'); assert.equal(r.sorte, 'livre'); assert.match(r.phrase, /^Coup du livre/);
  for (const k of ['ply', 'camp', 'san', 'uci', 'fenAvant', 'sorte', 'phrase', 'score', 'evalAvant', 'ligne', 'termes', 'profondeur', 'noeuds', 'ms']) assert.ok(k in r, `champ ${k}`);
  assert.equal(r.coach, true);
  const m = await new Joueur({ budget: 30000 }).choisir('r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1', { camp: 'w', ply: 20 });
  assert.equal(m.san, 'Cf6+'); assert.equal(m.sousSorte, 'mat'); assert.match(m.phrase, /c'est mat/);
  assert.ok(m.phrase.length > 0 && !/\{\w+\}/.test(m.phrase), 'aucun trou de gabarit dans la phrase');
  // le demi-coup se lit sur l'échiquier, pas dans le contexte : coup 1 des Blancs quel que soit `ply`
  assert.equal(m.ply, 1); assert.match(m.phrase, /après 1\.Cf6\+ gxf6 2\.Fxf7#/);
});
