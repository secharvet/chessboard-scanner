/** Affaiblir par échange avec un échange intercalé : daté à MA prise que son pion reprend (banc du 4 octobre, fiche 15). */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';
const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
const uci = (fen, sans) => { const c = new Chess(fen); return sans.map((s) => { const m = c.move(fr(s)); return m.from + m.to + (m.promotion ?? ''); }); };
describe('Affaiblir : échange intercalé', () => {
  it('Fb2 h5 h3 Ca7 Tc1 Cb5 Cxb5 Txc1 Dxc1 axb5 → le plan est daté à Cxb5, pas à Dxc1', () => {
    const fen = '2rq1rk1/1p3ppp/p1n1pn2/3p1b2/1P1P4/P1N1P1P1/5PBP/R1BQ1RK1 w - - 1 13';
    const sans = ['Fb2', 'h5', 'h3', 'Ca7', 'Tc1', 'Cb5', 'Cxb5', 'Txc1', 'Dxc1', 'axb5', 'Dd2', 'Ce4', 'De2', 'Dg5', 'Dxb5', 'Cd2', 'Tc1', 'Cc4', 'Fc3', 'h4'];
    const s = scanLine(fen, uci(fen, sans), sans.length);
    assert.equal(s.affaiblir_moyen_w, 'echange');
    assert.equal(sans[s.affaiblir_w], 'Cxb5');
    assert.equal(s.affaiblir_faiblesse_w.square, 'b7');
  });
});
