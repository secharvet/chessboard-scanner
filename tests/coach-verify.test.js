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

describe('Notion appliquée à chaque case', () => {
  const f = { F1: 'Pion isolé noirs en a7.', F2: 'Doublon noirs en colonne c (c6, c7).' };
  it('« isolés en a7, c7 et c6 » alors que seul a7 est isolé : signalé', () => {
    const r = verifyCitations('Les pions noirs sont isolés en a7, c7 et c6 [F1][F2].', f);
    assert.ok(r.problems.some((p) => /Case c7 présentée comme « isol/.test(p)));
    assert.ok(r.problems.some((p) => /Case c6 présentée comme « isol/.test(p)));
  });
  it('case citée AVANT la notion : pas concernée', () => {
    const r = verifyCitations('Après l’échange en c6, le pion a7 est isolé [F1].', { F1: 'Pion isolé noirs en a7. Ligne : Cxc6 bxc6.' });
    assert.deepEqual(r.problems, []);
  });
});

describe('Portée d’une notion', () => {
  it('« clouage en c3 …, case faible en c5 » : c5 relève de la case faible, pas du clouage', () => {
    const f = { F1: 'Clouage blancs en c3 (n).', F2: 'Case faible noirs en c5.' };
    const r = verifyCitations('Le clouage en c3 disparaît et une case faible apparaît en c5 [F1][F2].', f);
    assert.deepEqual(r.problems, []);
  });
});

describe('Contrôle case par case limité aux notions de case', () => {
  it('« …d3 préparerait Df2#, qui est mat, et …Cf2 prendrait ta dame en d1 » : pas de fausse alerte', () => {
    const f = { P1: '…d3 préparerait Df2# est mat.', P2: '…Cf2 préparerait Cxd1 prend la dame en d1.' };
    const r = verifyCitations('Attention : …d3 préparerait Df2#, qui est mat, et …Cf2 prendrait ta dame en d1 [P1][P2].', f);
    assert.deepEqual(r.problems, []);
  });
});
