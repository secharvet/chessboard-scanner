import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { Joueur as JoueurFactice } from '../coach/joueur/joueur-factice.mjs';
import { jouerPartie, construireAdversaire, pgn } from '../scripts/joueur/partie.mjs';

/** Un adversaire bouchon, hors ligne : il joue son premier coup légal (chess.js), sans moteur. */
const adversaireBouchon = () => ({
  nom: 'bouchon', meta: { nom: 'bouchon', graine: 0 },
  async jouer(fen) { const [m] = new Chess(fen).moves({ verbose: true }); return m.from + m.to + (m.promotion ?? ''); },
});

test('arène : une partie entière se joue, le coach joue tous ses coups, la partie se termine', async () => {
  const camp = 'w';
  const coach = new JoueurFactice({ camp, graine: 3 });
  const partie = await jouerPartie({ coach, adversaire: adversaireBouchon(), camp, id: 'test-01', code: 'test' });
  assert.ok(partie.plies > 0);
  // Tous les coups du camp du coach portent coach:true ; aucun coup du coach n'est joué par l'adversaire.
  for (const c of partie.coups) assert.equal(c.coach, c.camp === camp);
  // La partie va à son terme (fin réelle) ou atteint le plafond, jamais autre chose.
  if (partie.resultat === '*') assert.match(partie.raison, /non finie/);
  else assert.ok(['1-0', '0-1', '1/2-1/2'].includes(partie.resultat));
});

test('arène : le coach ne reçoit JAMAIS un moteur ni une évaluation dans son contexte', async () => {
  const camp = 'b';
  const factice = new JoueurFactice({ camp, graine: 7 });
  const contextes = [];
  const coach = { camp, code: 'test', async choisir(fen, ctx) { contextes.push(ctx); return factice.choisir(fen, ctx); } };
  const partie = await jouerPartie({ coach, adversaire: adversaireBouchon(), camp, id: 'test-02', maxPlies: 40 });
  assert.ok(contextes.length > 0);
  for (const ctx of contextes) {
    assert.deepEqual(Object.keys(ctx).sort(), ['camp', 'depart', 'historique', 'ply']);
    for (const interdit of ['engine', 'moteur', 'eval', 'evaluation', 'score', 'stockfish', 'sf']) assert.equal(interdit in ctx, false);
  }
  // L'historique passé au coach est bien la suite des coups joués, et il croît d'un coach-coup + un adverse-coup à la fois.
  const coachCoups = partie.coups.filter((c) => c.coach);
  assert.equal(contextes.length, coachCoups.length);
  for (let i = 0; i < contextes.length; i++) assert.equal(contextes[i].historique.length, partie.coups.indexOf(coachCoups[i]));
});

test('arène : chaque coup du coach porte ms, une sorte et une phrase ; les coups adverses sont minimaux', async () => {
  const camp = 'w';
  const coach = new JoueurFactice({ camp, graine: 5 });
  const partie = await jouerPartie({ coach, adversaire: adversaireBouchon(), camp, id: 'test-03', maxPlies: 30 });
  for (const c of partie.coups) {
    if (c.coach) {
      assert.ok(Number.isFinite(c.ms) && c.ms >= 0);
      assert.ok(['plan', 'amelioration', 'defense', 'calcul', 'livre'].includes(c.sorte));
      assert.ok(typeof c.phrase === 'string' && c.phrase.length > 0);
      assert.ok('termes' in c && 'profondeur' in c && 'noeuds' in c);
    } else {
      assert.deepEqual(Object.keys(c).sort(), ['camp', 'coach', 'fenAvant', 'ply', 'san', 'uci']);
    }
  }
});

test('arène : déterminisme — même graine, même partie', async () => {
  const run = () => jouerPartie({ coach: new JoueurFactice({ camp: 'w', graine: 11 }), adversaire: adversaireBouchon(), camp: 'w', id: 'test-04', maxPlies: 50 });
  const a = await run(), b = await run();
  assert.deepEqual(a.coups.map((c) => c.uci), b.coups.map((c) => c.uci));
});

test('arène : en mode maia, aucun moteur Stockfish n\'est construit', async () => {
  let engineConstruit = false;
  class FauxMoteur { constructor() { engineConstruit = true; } }
  class FausseMaia { async politique() { return [{ uci: 'e2e4', p: 0.9 }, { uci: 'd2d4', p: 0.1 }]; } stop() {} }
  const adv = await construireAdversaire('maia', {
    graine: 1,
    MaiaClass: { Maia: FausseMaia, tirer: (coups) => coups[0] },
    EngineClass: { UciEngine: FauxMoteur },
  });
  assert.equal(engineConstruit, false);
  assert.equal(await adv.jouer('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'), 'e2e4');
});

test('arène : maia tire ses 8 premiers coups, puis joue son coup préféré', async () => {
  let tirages = 0;
  class FausseMaia { async politique() { return [{ uci: 'd2d4', p: 0.6 }, { uci: 'e2e4', p: 0.4 }]; } stop() {} }
  const adv = await construireAdversaire('maia', {
    graine: 1,
    MaiaClass: { Maia: FausseMaia, tirer: () => { tirages++; return { uci: 'e2e4' }; } },
  });
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  for (let i = 0; i < 8; i++) assert.equal(await adv.jouer(fen), 'e2e4'); // tiré
  assert.equal(tirages, 8);
  assert.equal(await adv.jouer(fen), 'd2d4'); // 9e : le préféré (plus haute probabilité)
  assert.equal(tirages, 8);
});

test('arène : le PGN porte les phrases du coach en commentaires', async () => {
  const camp = 'w';
  const coach = new JoueurFactice({ camp, graine: 2 });
  const partie = await jouerPartie({ coach, adversaire: adversaireBouchon(), camp, id: '2026-10-25-maia-w-02', maxPlies: 8 });
  const texte = pgn(partie);
  assert.match(texte, /\[White "coach-joueur"\]/);
  assert.match(texte, /\{ \(factice\)/); // au moins une phrase en commentaire
});
