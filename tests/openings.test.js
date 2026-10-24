/**
 * Reconnaissance d'ouverture par les coups (liste lichess-org/chess-openings, si téléchargée).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { identifyOpening } from '../coach/openings.mjs';

const available = existsSync(new URL('../data/openings/c.tsv', import.meta.url));

describe('Ouvertures', { skip: !available && 'data/openings absent (scripts/fetch-openings.sh)' }, () => {
  it('Française avance', () => {
    assert.equal(identifyOpening(['e4', 'e6', 'd4', 'd5', 'e5'])?.eco, 'C02');
  });
  it('plus long préfixe : le Dragon yougoslave plutôt que « Sicilienne »', () => {
    const o = identifyOpening(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3']);
    assert.match(o.name, /Dragon Variation, Yugoslav Attack/);
  });
});
