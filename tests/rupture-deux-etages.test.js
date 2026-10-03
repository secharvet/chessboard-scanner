/**
 * Rupture en deux étages (décision de l'auteur, 2 octobre 2026) : le levier est suivi jusqu'à son issue.
 * Positions des planches de vérité de terrain (rupture 4 et 7).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';

const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
const uci = (fen, sans) => { const c = new Chess(fen); return sans.map((s) => { const m = c.move(fr(s)); return m.from + m.to + (m.promotion ?? ''); }); };
// Positions des planches 7 et 4, copiées ici pour que le test tourne sans les rapports locaux.
const key = { 'rupture-07': { fen: 'r3k1nr/1b1pqpbp/p1n1p1p1/1pp5/4P3/P1PPBN2/BP3PPP/RN1Q1RK1 w kq - 3 10' }, 'rupture-04': { fen: 'r4rk1/ppq2ppp/5n2/2p1b3/8/2PP2Pb/PP2B2P/RNBQ1RK1 w - - 1 13' } };

describe('Rupture : issue du levier', () => {
  it('planche 7 : f5 puis …exf5 → rupture réalisée, datée au levier f5', () => {
    const fen = key['rupture-07'].fen;
    const sans = ['Cg5', 'Ff6', 'Ch3', 'b4', 'axb4', 'cxb4', 'f4', 'bxc3', 'bxc3', 'd6', 'f5', 'exf5'];
    const s = scanLine(fen, uci(fen, sans), sans.length);
    const rec = s.rupture_leviers_w.find((r) => r.levier === 10);
    assert.equal(rec.issue, 'prise');
    assert.equal(s.rupture_w, 10);
    assert.ok(s.rupture_colonne_w || s.rupture_colonne_adverse_w);
  });
  it('planche 4 : …c4 puis d4 → levier contourné, pas de rupture', () => {
    const fen = key['rupture-04'].fen;
    const sans = ['Tf2', 'c4', 'd4', 'Fd6', 'Ff4', 'Fxf4', 'Txf4', 'Cd5', 'Th4', 'Ce3', 'Dd2', 'Ff5'];
    const s = scanLine(fen, uci(fen, sans), sans.length);
    const rec = s.rupture_leviers_b.find((r) => r.levier === 1);
    assert.equal(rec.issue, 'contournee');
    assert.equal(s.rupture_b, -1);
  });
  it('tension maintenue : d4 contre e5 sans prise → ni rupture ni contournement', () => {
    const fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';
    const sans = ['d4', 'Cf6', 'Cc3', 'Fb4', 'Fe2', 'O-O', 'O-O', 'Te8'];
    const s = scanLine(fen, uci(fen, sans), sans.length);
    assert.equal(s.rupture_leviers_w[0].issue, 'tension');
    assert.equal(s.rupture_w, -1);
  });
});
