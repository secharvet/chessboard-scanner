/**
 * Vérification des citations du coach.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { stripCitations, verifyCitations } from '../coach/verify.mjs';

const facts = {
  E1: 'Évaluation Stockfish (meilleur coup) : +0.3 (égalité).',
  L1: 'Ligne 1 : 9. Te1 b6 10. Fb3 (+0.3 (égalité)).',
  F4: 'Les blancs contrôlent la colonne c.',
  F5: 'Pion isolé blancs en d4.',
  F6: 'Clouage noirs en f7 (p).',
};

describe('Vérification des citations', () => {
  it('réponse correctement sourcée : aucun problème', () => {
    const r = verifyCitations('Position égale [E1]. Ton pion isolé en d4 demande de l’activité [F5]. Joue Te1 [L1].', facts);
    assert.deepEqual(r.problems, []);
  });
  it('citation inexistante', () => {
    const r = verifyCitations('La colonne c est à toi [F99].', facts);
    assert.match(r.problems[0], /inexistante \[F99\]/);
  });
  it('case absente de la source', () => {
    const r = verifyCitations('Ton pion isolé en d5 est faible [F5].', facts);
    assert.ok(r.problems.some((p) => /Case d5 absente/.test(p)));
  });
  it('notion absente de la source (clouage inventé)', () => {
    const r = verifyCitations('Ton fou cloue le cavalier [F4].', facts);
    assert.ok(r.problems.some((p) => /clou/.test(p)));
  });
  it('affirmation sans source', () => {
    const r = verifyCitations('Le cavalier ira en e5.', facts);
    assert.ok(r.problems.some((p) => /sans source/.test(p)));
  });
  it('phrase sans affirmation concrète : tolérée', () => {
    assert.deepEqual(verifyCitations('Prends ton temps et reste patient.', facts).problems, []);
  });
  it('les citations sont retirées à l’affichage', () => {
    assert.equal(stripCitations('Joue Te1 [L1][F4]. Position égale [E1, F5].'), 'Joue Te1. Position égale.');
  });
});
