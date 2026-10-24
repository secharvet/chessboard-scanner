import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attaqueRoi, vetoDefense, retombee } from '../coach/zone-roi.mjs';
import { avancer } from '../coach/coup-contraint.mjs';

// Panov, coach Noirs (lot 1, SF 19) : n° 1 au ply 7, Fh6 au contact et Dd3 — Cd5 dégarnit g8 et h7 ; n° 9 au ply 3, Ff4 et
// Dd3 sans contact — le Cd5 qui était bon (lecture de l'Expert, 20 oct.).
const FAUTE = '2rqr1k1/pb2bp1p/1pn1pnpB/8/3P3P/P1NQ1N2/1PB2PP1/3RR1K1 b - - 4 16';
const BON = 'r2q1rk1/pb2bp1p/1pn1pnp1/8/3P1B2/P1NQ1N2/1PB2PPP/R3R1K1 b - - 1 14';

test('zone du roi : attaque arrivée avec Fh6 au contact et la dame, pas sans contact', () => {
  const a = attaqueRoi(FAUTE, 'b');
  assert.equal(a.arrivee, true); assert.deepEqual(a.contact, ['Bh6']); assert.ok(a.attaquants.includes('Qd3'));
  assert.equal(attaqueRoi(BON, 'b').arrivee, false); assert.equal(retombee(BON, 'b'), true);
});

test('veto : Cd5 sous attaque arrivée retire deux défenses du bouclier ; pas de veto sans attaque', () => {
  assert.deepEqual([vetoDefense(FAUTE, 'b', 'Nd5').avant, vetoDefense(FAUTE, 'b', 'Nd5').apres], [5, 3]);
  assert.equal(vetoDefense(BON, 'b', 'Nd5'), null);
});

test('suspendu : neutre pour le compteur, la patience et l\'addition', () => {
  assert.deepEqual(avancer({ compteur: 1, attente: 2, cumul: 40 }, 'suspendu', 30), { compteur: 1, attente: 2, cumul: 40 });
});

test('pression graduée (GE) : poids classiques sur la zone de neuf cases, pions de la zone en défense', async () => {
  const { pressionRoi, allumePression } = await import('../coach/zone-roi.mjs');
  // Panov, la faute : Dd3 (4) + Fh6 (1) contre Dd8 (4), Tf8 (2), Cf6 (1), Fe7 (1) et f7 g7 h7 (3)
  const fen = 'r2q1rk1/pb2bppp/1pn1pn1B/8/3P4/P1NQ1N2/1PB2PPP/R3R1K1 b - - 0 14';
  const p = pressionRoi(fen, 'b');
  assert.equal(p.P, 5); assert.equal(p.D, 11); assert.equal(p.S, -6);
  assert.equal(allumePression(fen, 'b', 'Nd5', -20), null); // S < 4 : jamais, quelle que soit la tendance
});

test('alarme (AA) : condition dame, et la vérification garde un pas à un demi-pion du meilleur, pas au-delà', async () => {
  const { alarmeDame } = await import('../coach/zone-roi.mjs');
  const { verifierAlarme } = await import('../coach/coup-contraint.mjs');
  const { Chess } = await import('chess.js');
  // Panov, la faute : Cd5 sous Fh6 + Dd3 — la dame est parmi les attaquants, l'alarme sonne
  const fen = 'r2q1rk1/pb2bppp/1pn1pn1B/8/3P4/P1NQ1N2/1PB2PPP/R3R1K1 b - - 0 14';
  assert.ok(alarmeDame(fen, 'b', 'Nd5'));
  const coup = (uci) => new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4) });
  const faux = (notes) => ({ noter: async () => notes.map(([uci, cp]) => ({ uci, cp, m: coup(uci) })) });
  const A = { depth: 24, borne: 50 };
  assert.equal((await verifierAlarme(faux([['f6g4', -86], ['f6d5', -120]]), fen, 'f6d5', A)).admis, true);   // 34 cp : gardé
  assert.equal((await verifierAlarme(faux([['f6g4', -86], ['f6d5', -200]]), fen, 'f6d5', A)).admis, false);  // 114 cp : suspendu
});
