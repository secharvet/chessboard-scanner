import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { lancer, etat, brancher, argsAdversaire, _reinit } from '../coach/joueur-arene.mjs';

const tick = () => new Promise((r) => setTimeout(r, 10));

/** Un enfant factice (pas de vrai processus) : on pousse des lignes sur son stdout. */
function faireEnfant() { const e = new EventEmitter(); e.stdout = new PassThrough(); e.stderr = new PassThrough(); e.ecrire = (o) => e.stdout.write(`${JSON.stringify(o)}\n`); return e; }
/** Un res factice de SSE : collecte les écritures. */
function faireRes() { const w = []; const st = { fini: false, close: null }; return { w, st, writeHead() {}, write(s) { w.push(s); return true; }, end() { st.fini = true; }, on(ev, cb) { if (ev === 'close') st.close = cb; } }; }
const colle = (res) => res.w.join('');

test('arène serveur : choix d\'adversaire → options', () => {
  assert.deepEqual(argsAdversaire({ adversaire: 'maia' }), ['--adversaire', 'maia']);
  assert.deepEqual(argsAdversaire({ adversaire: 'bride', elo: 1800 }), ['--adversaire', 'sf1500', '--elo', '1800']);
  assert.deepEqual(argsAdversaire({ adversaire: 'bride', elo: 9999 }), ['--adversaire', 'sf1500', '--elo', '1500']); // élo hors liste → 1500
  assert.deepEqual(argsAdversaire({ adversaire: 'pleine' }), ['--adversaire', 'sf', '--depth', '10']);
  assert.throws(() => argsAdversaire({ adversaire: 'x' }));
});

test('arène serveur : le joueur « arbre » et le trou passent en arguments à l\'enfant, sinon non', () => {
  _reinit();
  let a = null; lancer({ adversaire: 'maia', camp: 'w', joueur: 'arbre', trou: true }, { spawnFn: (_c, args) => { a = args; return faireEnfant(); }, graine: 1 });
  assert.equal(a[a.indexOf('--joueur') + 1], 'coach/joueur/joueur-arbre.mjs');
  assert.ok(a.includes('--trou'));
  _reinit();
  let b = null; lancer({ adversaire: 'maia', camp: 'w' }, { spawnFn: (_c, args) => { b = args; return faireEnfant(); }, graine: 1 });
  assert.ok(!b.includes('--joueur') && !b.includes('--trou')); // le coach actuel par défaut
  _reinit();
});

test('arène serveur : lancer, les coups s\'accumulent, occupé si déjà en cours', async () => {
  _reinit();
  const enfant = faireEnfant();
  const r = lancer({ adversaire: 'maia', camp: 'w', budget: 999999 }, { spawnFn: () => enfant, graine: 1 });
  assert.equal(r.budget, 400000); // plafonné
  assert.equal(etat().enCours, true);
  // Une deuxième demande pendant la partie = occupé.
  assert.throws(() => lancer({ adversaire: 'maia', camp: 'w' }, { spawnFn: () => faireEnfant() }), (e) => e.occupe === true);
  enfant.ecrire({ ev: 'debut', id: '20261024T120000-maia-1500-w', adversaire: { nom: 'maia-1500' }, camp: 'w' });
  enfant.ecrire({ ev: 'coup', coup: { ply: 1, san: 'e4', coach: true, phrase: 'centre' } });
  enfant.ecrire({ ev: 'coup', coup: { ply: 2, san: 'e5', coach: false } });
  await tick();
  assert.equal(etat().id, '20261024T120000-maia-1500-w');
  assert.equal(etat().coups.length, 2);
  assert.equal(etat().enCours, true);
});

test('arène serveur : un spectateur reçoit le rattrapage puis le direct, et la fin ferme le flux', async () => {
  _reinit();
  const enfant = faireEnfant();
  lancer({ adversaire: 'maia', camp: 'w' }, { spawnFn: () => enfant, graine: 1 });
  enfant.ecrire({ ev: 'debut', id: 'X', adversaire: { nom: 'maia-1500' }, camp: 'w' });
  enfant.ecrire({ ev: 'coup', coup: { ply: 1, san: 'e4', coach: true } });
  await tick();
  // Un spectateur arrive en cours : il reçoit d'abord le rattrapage (debut + le coup déjà joué).
  const res = faireRes();
  brancher(res);
  assert.match(colle(res), /"ev":"debut"/);
  assert.match(colle(res), /"san":"e4"/);
  assert.equal(res.w.every((l) => l.startsWith('data: ') && l.endsWith('\n\n')), true); // format SSE
  const avant = res.w.length;
  // Puis le direct.
  enfant.ecrire({ ev: 'coup', coup: { ply: 2, san: 'e5', coach: false } });
  await tick();
  assert.ok(res.w.length > avant);
  assert.match(colle(res), /"san":"e5"/);
  // La fin ferme le flux et marque la partie finie.
  enfant.ecrire({ ev: 'fin', id: 'X', resultat: '1-0', raison: 'mat', plies: 2 });
  await tick();
  assert.equal(res.st.fini, true);
  assert.equal(etat().fini, true);
  assert.equal(etat().resultat, '1-0');
});

test('arène serveur : spectateur sur partie finie = rattrapage puis fermeture ; nouvelle partie permise', async () => {
  _reinit();
  const enfant = faireEnfant();
  lancer({ adversaire: 'maia', camp: 'w' }, { spawnFn: () => enfant, graine: 1 });
  enfant.ecrire({ ev: 'debut', id: 'X', adversaire: { nom: 'maia-1500' } });
  enfant.ecrire({ ev: 'fin', id: 'X', resultat: '0-1', raison: 'mat' });
  await tick();
  const res = faireRes();
  brancher(res); // partie finie : rattrapage + end immédiat
  assert.match(colle(res), /"ev":"fin"/);
  assert.equal(res.st.fini, true);
  // Une partie finie n'occupe plus : on peut relancer.
  assert.doesNotThrow(() => lancer({ adversaire: 'maia', camp: 'b' }, { spawnFn: () => faireEnfant(), graine: 2 }));
  assert.equal(etat().camp, 'b');
});

test('arène serveur : sans partie, brancher émet « vide » et etat dit enCours=false', () => {
  _reinit();
  assert.deepEqual(etat(), { enCours: false });
  const res = faireRes();
  brancher(res);
  assert.match(colle(res), /"ev":"vide"/);
  assert.equal(res.st.fini, true);
});

test('arène serveur : arrêt inattendu de l\'enfant clôt proprement', async () => {
  _reinit();
  const enfant = faireEnfant();
  lancer({ adversaire: 'maia', camp: 'w' }, { spawnFn: () => enfant, graine: 1 });
  const res = faireRes(); brancher(res);
  enfant.emit('exit', 1);
  await tick();
  assert.equal(etat().fini, true);
  assert.equal(res.st.fini, true);
  assert.match(colle(res), /arrêt inattendu/);
});
