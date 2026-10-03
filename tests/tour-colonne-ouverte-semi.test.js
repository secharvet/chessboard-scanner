/** Tour sur colonne ouverte / semi-ouverte : définitions de l'auteur (vérité de terrain du 1er octobre 2026).
 * Positions des planches, copiées ici pour que le test tourne sans les rapports locaux. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';

const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
const PLANCHES = [
  {
    "id": "tour_colonne-01",
    "fen": "rnbqkbnr/p5p1/4pp2/3p4/2pP1P1p/2P1PN2/P2NB1PP/R1BQK2R w KQkq - 0 10",
    "side": "w",
    "ply": 0,
    "moves": [
      "Tb1",
      "h3",
      "g3",
      "Fa6",
      "O-O",
      "Da5",
      "Fb2",
      "Fa3",
      "Fxa3",
      "Dxa3",
      "Dc2",
      "Cc6"
    ]
  },
  {
    "id": "tour_colonne-03",
    "fen": "r4rk1/pp1b1ppp/4p3/1P1p4/P7/b1P2N2/5PPP/3Q1RK1 w - - 0 19",
    "side": "b",
    "ply": 11,
    "moves": [
      "Ce5",
      "Tad8",
      "Cxd7",
      "Txd7",
      "Dd3",
      "b6",
      "c4",
      "Fc5",
      "cxd5",
      "Txd5",
      "Df3",
      "Tfd8"
    ]
  },
  {
    "id": "tour_colonne-04",
    "fen": "r2qr1k1/pp3pp1/2nbpn1p/3pN2b/3P1P2/2PBB3/PPQN2PP/R4RK1 w - - 2 13",
    "side": "w",
    "ply": 2,
    "moves": [
      "Cdf3",
      "Dc7",
      "Tae1",
      "Cd7",
      "a3",
      "Cdxe5",
      "fxe5",
      "Fe7",
      "Df2",
      "Tf8",
      "Dg3",
      "Rh8"
    ]
  },
  {
    "id": "tour_colonne-06",
    "fen": "r3k1nr/pppq1ppp/1b6/8/3PP3/1P6/PB4PP/RN1QK2R w KQkq - 1 13",
    "side": "b",
    "ply": 5,
    "moves": [
      "Ca3",
      "Cf6",
      "Dd3",
      "O-O",
      "Cc4",
      "Tfe8",
      "Cxb6",
      "axb6",
      "e5",
      "Tad8",
      "O-O",
      "Cd5"
    ]
  },
  {
    "id": "tour_colonne-07",
    "fen": "r3k2r/ppp1b1pp/2np3n/8/3p4/5N2/PPPP1PPP/RNB1K2R w KQkq - 2 10",
    "side": "w",
    "ply": 4,
    "moves": [
      "O-O",
      "O-O",
      "d3",
      "Cf5",
      "Te1",
      "Ff6",
      "Fg5",
      "Ce5",
      "Fxf6",
      "Txf6",
      "Cxe5",
      "dxe5"
    ]
  }
];
function scanOf(id) {
  const p = PLANCHES.find((x) => x.id === id);
  const c = new Chess(p.fen); const uci = [];
  for (const s of p.moves) { try { const m = c.move(fr(s)); uci.push(m.from + m.to + (m.promotion ?? '')); } catch { break; } }
  return { s: scanLine(p.fen, uci, uci.length), p };
}
const at = (s, p, concept) => s[`${concept}_${p.side}`] === p.ply;

describe('Tour sur colonne : planches de l\'auteur', () => {
  it('planches 1 et 7 (oui) : tour sur colonne ouverte au coup surligné', () => {
    for (const id of ['tour_colonne-01', 'tour_colonne-07']) { const { s, p } = scanOf(id); assert.ok(at(s, p, 'tour_colonne'), id); }
  });
  it('planche 3 (non : doublement) : ni ouverte ni semi-ouverte au coup surligné', () => {
    const { s, p } = scanOf('tour_colonne-03'); assert.ok(!at(s, p, 'tour_colonne') && !at(s, p, 'tour_colonne_semi_ouverte'));
  });
  it('planche 4 (non : colonne semi-ouverte disputée par la tour e8)', () => {
    const { s, p } = scanOf('tour_colonne-04'); assert.ok(!at(s, p, 'tour_colonne') && !at(s, p, 'tour_colonne_semi_ouverte'));
  });
  it('planche 6 (« oui mais semi-ouverte ») : tour sur colonne semi-ouverte, pas ouverte', () => {
    const { s, p } = scanOf('tour_colonne-06'); assert.ok(!at(s, p, 'tour_colonne')); assert.ok(at(s, p, 'tour_colonne_semi_ouverte'));
  });
});
