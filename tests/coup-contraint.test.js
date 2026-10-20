import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { classerCandidats, derniereChance, choisirCoup, horsDePrix, avancer, raisonAbandon, REGLES_1BIS, prixDeSegment, structureCourante, borneCp, DEFAUTS, Noteur } from '../coach/coup-contraint.mjs';

const apres = (coups) => { const c = new Chess(); for (const s of coups.split(/\s+/)) c.move(s); return c; };
const CARLSBAD = 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8';
/** Candidats factices : des SAN avec une note, dans l'ordre du moteur. */
const cands = (c, liste) => liste.map(([san, cp]) => { const m = new Chess(c.fen()).move(san); return { uci: m.from + m.to + (m.promotion ?? ''), m, cp }; });

test('classerCandidats : progressant remet le compteur à zéro, intendance compte, concession refusée', () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  // h3 (intendance), a3 (progressant : défend b4), Rab1 (progressant, rayon X), b4 à −1,20 (progressant mais concession)
  const r = classerCandidats(c.fen(), 'w', plan, cands(c, [['h3', 40], ['a3', 35], ['Rab1', 30], ['b4', -80]]), 1);
  const par = Object.fromEntries(r.admis.map((a) => [a.cand.m.san, a]));
  assert.equal(par.h3.classe, 'intendance'); assert.equal(par.h3.compteur, 2);
  assert.equal(par.a3.classe, 'progressant'); assert.equal(par.a3.compteur, 0);
  assert.equal(par.Rab1.classe, 'progressant');
  assert.equal(par.b4, undefined); assert.equal(r.progressantsRefuses, 1); assert.equal(r.coutRefuseMin, 120);
  // au-delà de k, l'intendance n'est plus admise
  const r2 = classerCandidats(c.fen(), 'w', plan, cands(c, [['h3', 40], ['a3', 35]]), DEFAUTS.k);
  assert.equal(r2.admis.map((a) => a.cand.m.san).join(), 'a3');
});

test('classerCandidats : en situation forcée, seuls le meilleur coup et les progressants passent ; le roque est neutre', () => {
  // roi blanc en échec : le meilleur coup est « forcé », un autre coup non progressant est écarté
  const c = new Chess('4k3/8/8/8/8/8/3P4/4K2r w - - 0 1'); // Th1+ : Re2 ou Rf2 seulement
  const plan = { famille: 'poussee', pion: 'd', cible: 'd4' };
  const r = classerCandidats(c.fen(), 'w', plan, cands(c, [['Kf2', 0], ['Ke2', -10]]), 0);
  assert.equal(r.forcee, true);
  assert.deepEqual(r.admis.map((a) => `${a.cand.m.san}:${a.classe}`), ['Kf2:forcé']);
  // le roque : neutre (ni compteur, ni progrès) — sauf s'il progresse (O-O-O met la tour en d1 : un pas vers « colonne d »)
  const c2 = new Chess('r3k2r/pppq1ppp/2n2n2/3pp3/3PP3/2N2N2/PPPQ1PPP/R3K2R w KQkq - 0 1');
  const r2 = classerCandidats(c2.fen(), 'w', { famille: 'colonne', colonne: 'b' }, cands(c2, [['O-O', 20], ['O-O-O', 15]]), 1);
  assert.deepEqual(r2.admis.map((a) => `${a.classe}:${a.compteur}`), ['roque:1', 'roque:1']);
  const r3 = classerCandidats(c2.fen(), 'w', { famille: 'colonne', colonne: 'd' }, cands(c2, [['O-O', 20], ['O-O-O', 15]]), 1);
  assert.deepEqual(r3.admis.map((a) => `${a.classe}:${a.compteur}`), ['roque:1', 'progressant:0']);
});

/** Un faux noteur : répond par des notes fixes par coup SAN, sinon `defaut` (0) ; permet de tester la mécanique sans moteur. */
const fauxNoteur = (table, defaut = 0) => ({
  depth: 18, appels: 0,
  async noter(fen, n) { this.appels++; const c = new Chess(fen); return c.moves({ verbose: true }).map((m) => ({ uci: m.from + m.to + (m.promotion ?? ''), m, cp: table[m.san] ?? defaut })).sort((a, b) => b.cp - a.cp).slice(0, n); },
  async noterTous(fen) { return this.noter(fen, 999); },
});

test('derniereChance : le meilleur progressant hors MultiPV, admis sous un pion, refusé au-delà', async () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  const top = cands(c, [['h3', 40], ['Bh4', 38], ['Rfe1', 36], ['Qd2', 34]]); // aucun progressant dans le top 4
  const n1 = fauxNoteur({ h3: 40, Bh4: 38, Rfe1: 36, Qd2: 34, a3: 10 }); // a3 progresse (défend b4), coûte 0,30
  const d1 = await derniereChance(n1, c.fen(), 'w', plan, top);
  assert.equal(d1.cand.m.san, 'a3'); assert.equal(d1.cout, 30); assert.equal(d1.admis, true);
  // tout pas vers b4-b5 (a3, Tab1, Tfb1, Db1…) coûte 1,30 : refusé
  const n2 = fauxNoteur({ h3: 40, Bh4: 38, Rfe1: 36, Qd2: 34 }, -90);
  const d2 = await derniereChance(n2, c.fen(), 'w', plan, top);
  assert.equal(d2.admis, false); assert.equal(d2.cout, 130);
});

test('choisirCoup : le meilleur progressant, sinon intendance (compteur), puis dernière chance, sinon libre ; hors de prix à k + 1', async () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  // a3 est 2e du moteur et progresse : joué dès le premier coup, retard 5, compteurs à zéro
  const n1 = fauxNoteur({ h3: 40, a3: 35, Bh4: 30, Rfe1: 28 });
  const r1 = await choisirCoup(n1, c.fen(), 'w', plan, { compteur: 1 });
  assert.equal(r1.m.san, 'a3'); assert.equal(r1.classe, 'progressant'); assert.equal(r1.retard, 5); assert.equal(r1.compteur, 0);
  // aucun progressant dans les quatre, tous les pas coûtent 1,30 : intendance (h3, retard 0) tant que le compteur n'est pas plein
  const n2 = fauxNoteur({ h3: 40, Bh4: 38, Rfe1: 36, Qd2: 34 }, -90);
  const r2 = await choisirCoup(n2, c.fen(), 'w', plan, {});
  assert.equal(r2.classe, 'intendance'); assert.equal(r2.m.san, 'h3'); assert.equal(r2.retard, 0); assert.equal(r2.compteur, 1);
  // compteur plein : dernière chance tentée et refusée (1,30) → coup libre, compteur 3 → hors de prix
  const r3 = await choisirCoup(n2, c.fen(), 'w', plan, { compteur: DEFAUTS.k });
  assert.equal(r3.classe, 'libre'); assert.equal(r3.m.san, 'h3'); assert.equal(r3.concession, 130); assert.equal(horsDePrix(r3), true);
  assert.equal(horsDePrix(r2), false);
  // compteur plein, dernière chance admise (a3 à 0,30 hors MultiPV) : jouée, retard lu dans la réponse adverse (tout à 0 → 40 − 0)
  const n3 = fauxNoteur({ h3: 40, Bh4: 38, Rfe1: 36, Qd2: 34, a3: 10 });
  const r4 = await choisirCoup(n3, c.fen(), 'w', plan, { compteur: DEFAUTS.k });
  assert.equal(r4.classe, 'dernière chance'); assert.equal(r4.m.san, 'a3'); assert.equal(r4.cout, 30); assert.equal(r4.retard, 40);
});

test('choisirCoup : le forcé passe avant le progressant (une parade est neutre pour le plan)', async () => {
  // Th1+ : Rf2 est forcé ; d2-d4 progresse (poussée d→d4) mais n'est pas joué d'abord
  const n = fauxNoteur({ Kf2: 0, Ke2: -10 });
  const r = await choisirCoup(n, '4k3/8/8/8/8/8/3P4/4K2r w - - 0 1', 'w', { famille: 'poussee', pion: 'd', cible: 'd4' }, { compteur: 1 });
  assert.equal(r.classe, 'forcé'); assert.equal(r.m.san, 'Kf2'); assert.equal(r.compteur, 1);
  // forcé-progressant : bxc6 est une prise à jouer (situation forcée) ET un pas vers « colonne b » (distance 2 → 1) : compteurs à zéro
  const n2 = fauxNoteur({ bxc6: 60, Rb1: 20 });
  const r2 = await choisirCoup(n2, '6k1/p4ppp/2p5/1P6/8/8/5PPP/R5K1 w - - 0 1', 'w', { famille: 'colonne', colonne: 'b' }, { compteur: 2 });
  assert.equal(r2.classe, 'forcé-progressant'); assert.equal(r2.m.san, 'bxc6'); assert.equal(r2.compteur, 0); assert.equal(r2.progressant, true);
});

test('structureCourante : propriétaire d\'abord, sinon l\'adversaire', () => {
  const c = apres(CARLSBAD);
  assert.deepEqual(structureCourante(c.fen(), 'w'), { name: 'CARLSBAD', color: 'w', role: 'owner' });
  assert.deepEqual(structureCourante(c.fen(), 'b'), { name: 'CARLSBAD', color: 'w', role: 'opponent' });
  assert.equal(structureCourante(new Chess().fen(), 'w'), null);
});

test('prixDeSegment : la référence est le faisceau libre depuis l\'adoption, au demi-coup du point calme', async () => {
  // h3 en tête (un coup tranquille, pas Fxf6), tout le reste à 0 : prix 0, point calme immédiat, pas de prolongation.
  const c = apres(CARLSBAD);
  const n = fauxNoteur({ h3: 10 });
  const r = await prixDeSegment(n, { fenAdoption: c.fen(), fenAbandon: c.fen(), plies: 0 }, 'w');
  assert.equal(r.prix, 0); assert.equal(r.calme, true); assert.deepEqual(r.prolonge, []);
  assert.equal(borneCp(12345), 1000); assert.equal(borneCp(-99999), -1000);
});

test('Noteur : cache par (position, n, profondeur), rien n\'est demandé deux fois', async () => {
  let appels = 0;
  const engine = { async analyze(fen, { multipv }) { appels++; const c = new Chess(fen); return c.moves({ verbose: true }).slice(0, multipv).map((m, i) => ({ pv: [m.from + m.to + (m.promotion ?? '')], score: { type: 'cp', value: 10 - i } })); } };
  const n = new Noteur(engine, { depth: 12 });
  const f = new Chess().fen();
  await n.noter(f, 3); await n.noter(f, 3); await n.noter(f, 3, 12);
  assert.equal(appels, 1);
  await n.noter(f, 3, 14); assert.equal(appels, 2);
});

// ——— Lot 1 bis (docs/plans/CAHIER-LOT-1-BIS-2026-10-20.md) ———
const PA_ = { ...DEFAUTS, regles: REGLES_1BIS.A }, PB_ = { ...DEFAUTS, regles: REGLES_1BIS.B };

test('avancer : la source unique — un pas remet compteur et attente à zéro, l\'attente utile est neutre pour le compteur seulement, le forcé hors cumul', () => {
  const e = { compteur: 1, attente: 3, cumul: 40 };
  assert.deepEqual(avancer(e, 'progressant', 20), { compteur: 0, attente: 0, cumul: 60 });
  assert.deepEqual(avancer(e, 'forcé', 50), { compteur: 1, attente: 3, cumul: 40 });
  assert.deepEqual(avancer(e, 'roque', 10), { compteur: 1, attente: 3, cumul: 50 });
  assert.deepEqual(avancer(e, 'attente utile', 5), { compteur: 1, attente: 4, cumul: 45 });
  assert.deepEqual(avancer(e, 'intendance', 0), { compteur: 2, attente: 4, cumul: 40 });
  assert.deepEqual(avancer(e, 'libre', -10), { compteur: 2, attente: 4, cumul: 40 }); // un retard négatif ne rembourse pas
});

test('raisonAbandon : sans règles, le seul « hors de prix » du lot 1 ; avec, compteur, cumul et patience distingués', () => {
  assert.equal(raisonAbandon({ compteur: 3 }), 'hors de prix');
  assert.equal(raisonAbandon({ compteur: 0, cumulDeborde: true, attente: 9 }), null);
  assert.equal(raisonAbandon({ compteur: 3 }, PA_), 'hors de prix (compteur)');
  assert.equal(raisonAbandon({ compteur: 0, cumulDeborde: true }, PA_), 'hors de prix (cumul)');
  assert.equal(raisonAbandon({ compteur: 0, attente: 6 }, PA_), null); // la patience n'existe qu'en B
  assert.equal(raisonAbandon({ compteur: 0, attente: 6 }, PB_), 'en attente');
  assert.equal(raisonAbandon({ compteur: 0, attente: 5 }, PB_), null);
});

test('règle 1 : l\'addition lue avant le coup — le pas qui déborde est refusé, vérifié une fois au faisceau', async () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  const n = () => fauxNoteur({ h3: 40, a3: 35, Bh4: 30, Rfe1: 28 }); // a3 progresse, retard 5
  const r1 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 95 }, PA_);
  assert.equal(r1.classe, 'progressant'); assert.equal(r1.cumul, 100); assert.equal(r1.refus, undefined); // 100 n'est pas au-delà
  const r2 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 96 }, PA_);
  assert.equal(r2.classe, 'intendance'); assert.equal(r2.m.san, 'h3'); assert.equal(r2.refus.san, 'a3'); assert.equal(r2.refus.cumul, 101);
  // vérification gratuite : le pas est joué, l'addition repart du prix vérifié
  let appels = 0; const gratuit = { ...PA_, verifier: async () => { appels++; return 10; } };
  const r3 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 96 }, gratuit);
  assert.equal(r3.classe, 'progressant'); assert.equal(r3.m.san, 'a3'); assert.equal(r3.cumul, 10); assert.equal(r3.sauvetage.cumul, 101); assert.equal(r3.refus, undefined);
  // déjà un sauvetage dans le segment : refus sans deuxième vérification
  const r4 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 96, sauvetages: 1 }, gratuit);
  assert.equal(r4.refus.san, 'a3'); assert.equal(appels, 1);
  // vérification chère : refus
  const r5 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 96 }, { ...PA_, verifier: async () => 70 });
  assert.equal(r5.classe, 'intendance'); assert.equal(r5.refus.prixVerifie, 70);
  // sans règles : le lot 1, aucune addition
  const r6 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 0, cumul: 500 });
  assert.equal(r6.classe, 'progressant'); assert.equal(r6.refus, undefined);
});

test('règle 2 : la dernière chance jugée sur son retard à la profondeur de jeu, pas sur son coût à 14', async () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  // a3 coûte 0,30 à la notation de tous les coups (admise), mais la réponse adverse la lit à −0,80 : retard 40 + 80 = 120
  const table = { h3: 40, Bh4: 38, Rfe1: 36, Qd2: 34, a3: 10 };
  const noteur = { depth: 18, appels: 0,
    async noter(fen, n) { const ch = new Chess(fen); if (ch.turn() === 'b') return ch.moves({ verbose: true }).slice(0, 1).map((m) => ({ uci: m.from + m.to, m, cp: 80 })); return ch.moves({ verbose: true }).map((m) => ({ uci: m.from + m.to + (m.promotion ?? ''), m, cp: table[m.san] ?? -90 })).sort((a, b) => b.cp - a.cp).slice(0, n); },
    async noterTous(fen) { return this.noter(fen, 999); } };
  const lot1 = await choisirCoup(noteur, c.fen(), 'w', plan, { compteur: DEFAUTS.k });
  assert.equal(lot1.classe, 'dernière chance'); assert.equal(lot1.retard, 120);
  const r = await choisirCoup(noteur, c.fen(), 'w', plan, { compteur: DEFAUTS.k }, PA_);
  assert.equal(r.classe, 'libre'); assert.equal(r.m.san, 'h3'); assert.equal(r.dcRefusee.san, 'a3'); assert.equal(r.dcRefusee.retard, 120); assert.equal(horsDePrix(r), true);
});

test('règle 3 : l\'attente utile — le premier candidat du moteur qui sert un plan et coûte ≤ 0,25, neutre pour le compteur', async () => {
  const c = apres(CARLSBAD), plan = { famille: 'rupture', pion: 'b', cible: 'b5' };
  const n = () => fauxNoteur({ h3: 40, Bh4: 38, Rfe1: 36, Qd2: 10 }, -90); // aucun pas vers b5 dans les quatre
  const sert = (fen, m) => (m.san === 'Rfe1' || m.san === 'Qd2' ? ['poussée e4'] : []);
  const r = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 1, attente: 2, cumul: 0 }, { ...PB_, sert });
  assert.equal(r.classe, 'attente utile'); assert.equal(r.m.san, 'Rfe1'); assert.deepEqual(r.sert, ['poussée e4']);
  assert.equal(r.compteur, 1); assert.equal(r.attente, 3); assert.equal(r.cumul, 4);
  // Qd2 sert aussi mais coûte 0,30 : au-dessus du plancher. Si Rfe1 ne sert rien, intendance.
  const r2 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 1 }, { ...PB_, sert: (f, m) => (m.san === 'Qd2' ? ['x'] : []) });
  assert.equal(r2.classe, 'intendance'); assert.equal(r2.compteur, 2);
  // en A (pas d'attente utile) : intendance même si un coup sert
  const r3 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 1 }, { ...PA_, sert });
  assert.equal(r3.classe, 'intendance');
  // l'attente utile ne fait pas déborder l'addition
  const r4 = await choisirCoup(n(), c.fen(), 'w', plan, { compteur: 1, cumul: 97 }, { ...PB_, sert });
  assert.equal(r4.classe, 'intendance');
});
