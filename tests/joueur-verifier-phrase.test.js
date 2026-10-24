import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifierPhrases } from '../scripts/joueur/verifier-phrase.mjs';

const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const partie = (coups) => ({ coach: { camp: 'w' }, coups });
const coupCoach = (ecarte, fenAvant) => ({ ply: 1, coach: true, san: 'Txa8+', phrase: 'J\'ai pensé à Rd2. Mais …, et je perdais une tour.', fenAvant, ecarte });

test('phrase comparative VRAIE (la ligne du coup écarté perd bien du matériel) : aucune alerte', () => {
  // depuis r3k3/.../R3K3 w : Rd2 Cc2 Rc3 Cxa1 — le coach perd la tour, comme la phrase l'annonce.
  const fen = 'r3k3/8/8/8/3n4/8/8/R3K3 w - - 0 1';
  const e = { san: 'Rd2', coup: 'e1d2', pvUci: ['e1d2', 'd4c2', 'd2c3', 'c2a1'], perte: 'une tour', mat: false };
  assert.deepEqual(verifierPhrases(partie([coupCoach(e, fen)])), []);
});

test('phrase comparative FAUSSE (la ligne ne perd rien alors qu\'elle annonce une perte) : une alerte', () => {
  const fen = 'r3k3/8/8/8/3n4/8/8/R3K3 w - - 0 1';
  const e = { san: 'Rd2', coup: 'e1d2', pvUci: ['e1d2', 'e8e7'], perte: 'une tour', mat: false }; // Rd2 Re7 : rien de perdu
  const alertes = verifierPhrases(partie([coupCoach(e, fen)]));
  assert.equal(alertes.length, 1);
  assert.match(alertes[0], /ne perd rien/);
});

test('phrase « c\'était perdu / mat » VRAIE (la ligne finit par un mat) : aucune alerte', () => {
  const e = { san: 'f3', coup: 'f2f3', pvUci: ['f2f3', 'e7e5', 'g2g4', 'd8h4'], perte: 'la partie', mat: true }; // mat du fou
  assert.deepEqual(verifierPhrases(partie([{ ...coupCoach(e, DEPART), mat: true }])), []);
});

test('phrase « c\'était perdu / mat » FAUSSE (ni mat ni perte) : une alerte', () => {
  const e = { san: 'e4', coup: 'e2e4', pvUci: ['e2e4', 'e7e5'], perte: 'la partie', mat: true };
  const alertes = verifierPhrases(partie([coupCoach(e, DEPART)]));
  assert.equal(alertes.length, 1);
  assert.match(alertes[0], /ne le montre pas/);
});

test('un coup écarté sans ligne UCI est signalé (le joueur doit la fournir)', () => {
  const e = { san: 'Rd2', coup: 'e1d2', perte: 'une tour' }; // pas de pvUci
  const alertes = verifierPhrases(partie([coupCoach(e, DEPART)]));
  assert.equal(alertes.length, 1);
  assert.match(alertes[0], /pas de ligne/);
});

test('un coup sans écarté n\'est pas vérifié', () => {
  assert.deepEqual(verifierPhrases(partie([{ ply: 1, coach: true, san: 'e4', fenAvant: DEPART }])), []);
});
