/**
 * Affaiblir par échange : le plan est daté au coup du camp qui prend (l'initiative), pas à la reprise de pion
 * adverse. Vérité de terrain du 2 octobre 2026 (planches affaiblir 01 et 10).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';

const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
function uci(fen, sans) {
  const c = new Chess(fen);
  return sans.map((s) => { const m = c.move(fr(s)); return m.from + m.to + (m.promotion ?? ''); });
}

describe('Affaiblir : attribution au camp qui prend', () => {
  it('planche 10 : Fxc3+ bxc3 → le plan des Noirs est daté à Fxc3+, pas à bxc3', () => {
    const fen = 'r1bq1rk1/pp3pbp/4n1p1/2n5/4P3/2N1BN2/PP3PPP/R2QKB1R w KQ - 2 13';
    const sans = ['Fe2', 'Fxc3+', 'bxc3', 'Cxe4', 'Dc2', 'C4c5', 'O-O', 'Da5', 'Fh6', 'Td8', 'Tfd1', 'b6'];
    const s = scanLine(fen, uci(fen, sans), sans.length);
    assert.equal(s.affaiblir_b, 1);
    assert.equal(s.affaiblir_moyen_b, 'echange');
  });
});
