import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { faisceauPlan, REGLAGES_FAISCEAU } from '../coach/faisceau-plan.mjs';

const apres = (coups) => { const c = new Chess(); for (const s of coups.split(/\s+/)) c.move(s); return c; };
const CARLSBAD = 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8';
/** Un faux noteur : notes fixes par coup SAN, sinon `defaut` ; permet de tester la mécanique du faisceau sans moteur. */
const fauxNoteur = (table, defaut = 0) => ({
  depth: 18,
  async noter(fen, n) { const c = new Chess(fen); return c.moves({ verbose: true }).map((m) => ({ uci: m.from + m.to + (m.promotion ?? ''), m, cp: table[m.san] ?? defaut })).sort((a, b) => b.cp - a.cp).slice(0, n); },
  async noterTous(fen) { return this.noter(fen, 999); },
});
const P = { ...REGLAGES_FAISCEAU, depthDerniereChance: 18 };
const plan = { famille: 'rupture', pion: 'b', cible: 'b5' };

test('(c) coupe à concession cumulée : réglage hors par défaut ; une branche coupée est écartée, pas tarifée', async () => {
  const c = apres(CARLSBAD);
  // Tfe1 en tête à 1,00 (intendance, retard 0) ; a3 et Tab1 progressent à 0,40 (retard 0,60 chacun) ; l'adversaire à 0 partout (réponses ex æquo)
  const n = fauxNoteur({ Rfe1: 100, a3: 40, Rab1: 40 });
  const libre = { evals: Array(40).fill(100), glouton: Array(40).fill(100), sans: [] };
  const sans = await faisceauPlan(n, P, c.fen(), 'w', plan, [], libre, { horizon: 1 });
  assert.equal(sans.coupes.cumul, 0); assert.ok(sans.vivants >= 1);
  const avec = await faisceauPlan(n, { ...P, concessionCumulee: 50 }, c.fen(), 'w', plan, [], libre, { horizon: 1 });
  assert.ok(avec.coupes.cumul >= 2, `coupes cumul : ${avec.coupes.cumul}`); // a3 et Tab1, chacune après ses réponses
  assert.ok(avec.coupesListe.every((x) => x.raison !== 'concession cumulée' || x.cout > 50), JSON.stringify(avec.coupesListe));
  assert.ok(avec.vivants >= 1 && avec.vivants < sans.vivants); // Tfe1 (retard 0) survit, les branches coupées ne sont plus dans le faisceau
  // concession cumulée seule → « pas réalisable sans concession », pas « sans objet »
  const tout = await faisceauPlan(n, { ...P, concessionCumulee: -1 }, c.fen(), 'w', plan, [], libre, { horizon: 1 });
  assert.equal(tout.phrase, 'pas réalisable sans concession'); assert.equal(tout.vivants, 0);
});

test('(b) la référence est lue au demi-coup relatif à son origine (plyLibre) : un sous-faisceau depuis la bascule', async () => {
  const c = apres(CARLSBAD);
  const n = fauxNoteur({ Rfe1: 100, a3: 40 });
  // libre indexé depuis la bascule (demi-coup absolu 10) : au 2e demi-coup relatif, 0,70 ; au 12e absolu, 0 (ne doit PAS être lu)
  const evals = Array(14).fill(0); evals[0] = 50; evals[2] = 70;
  const libre = { evals, glouton: evals, sans: [] };
  const r = await faisceauPlan(n, P, c.fen(), 'w', plan, [], libre, { ply0: 10, plyLibre: 10, horizon: 1, sousFaisceau: true });
  assert.equal(r.phrase, "en cours à l'horizon");
  assert.equal(r.prix, 70); // réf. 0,70 au demi-coup 12 (relatif 2) − 0 (réponse adverse à 0)
  const sansDecalage = await faisceauPlan(n, P, c.fen(), 'w', plan, [], libre, { ply0: 10, horizon: 1, sousFaisceau: true });
  assert.equal(sansDecalage.prix, 0); // l'ancienne lecture : evals[12] = 0
  // (a) la liste des coupes et la ligne sont rendues
  assert.ok(Array.isArray(r.coupesListe)); assert.ok(r.ligne.length >= 1);
});
