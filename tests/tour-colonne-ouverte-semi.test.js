/** Tour sur colonne ouverte / semi-ouverte : définitions de l'auteur (vérité de terrain du 1er octobre 2026).
 * Positions des planches, copiées ici pour que le test tourne sans les rapports locaux. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scanLine } from '../coach/plan-concepts.mjs';

const PLANCHES = [
 {
  "id": "tour_colonne-01",
  "fen": "rnbqkbnr/p5p1/4pp2/3p4/2pP1P1p/2P1PN2/P2NB1PP/R1BQK2R w KQkq - 0 10",
  "side": "w",
  "ply": 0,
  "played": [
   "a1b1",
   "h4h3",
   "g2g3",
   "c8a6",
   "e1g1",
   "d8a5",
   "c1b2",
   "f8a3",
   "b2a3",
   "a5a3",
   "d1c2",
   "b8c6",
   "c2g6",
   "e8f8",
   "g6c2",
   "g8e7",
   "b1a1",
   "a8b8",
   "f1b1",
   "b8b1",
   "a1b1",
   "f8f7",
   "e2d1",
   "e7f5"
  ]
 },
 {
  "id": "tour_colonne-03",
  "fen": "r4rk1/pp1b1ppp/4p3/1P1p4/P7/b1P2N2/5PPP/3Q1RK1 w - - 0 19",
  "side": "b",
  "ply": 11,
  "played": [
   "f3e5",
   "a8d8",
   "e5d7",
   "d8d7",
   "d1d3",
   "b7b6",
   "c3c4",
   "a3c5",
   "c4d5",
   "d7d5",
   "d3f3",
   "f8d8",
   "h2h3",
   "g7g6",
   "g2g4",
   "g8g7",
   "h3h4",
   "d5d3",
   "f3f4",
   "d3d4",
   "f4g5",
   "d8d5",
   "g5c1",
   "d4g4"
  ]
 },
 {
  "id": "tour_colonne-04",
  "fen": "r2qr1k1/pp3pp1/2nbpn1p/3pN2b/3P1P2/2PBB3/PPQN2PP/R4RK1 w - - 2 13",
  "side": "w",
  "ply": 2,
  "played": [
   "d2f3",
   "d8c7",
   "a1e1",
   "f6d7",
   "a2a3",
   "d7e5",
   "f4e5",
   "d6e7",
   "c2f2",
   "e8f8",
   "f2g3",
   "g8h8",
   "f3h4",
   "f7f5",
   "e5f6",
   "c7g3",
   "h2g3",
   "e7f6",
   "d3e2",
   "h5e2",
   "e1e2",
   "f8f7",
   "e2f2",
   "h8g8"
  ]
 },
 {
  "id": "tour_colonne-06",
  "fen": "r3k1nr/pppq1ppp/1b6/8/3PP3/1P6/PB4PP/RN1QK2R w KQkq - 1 13",
  "side": "b",
  "ply": 5,
  "played": [
   "b1a3",
   "g8f6",
   "d1d3",
   "e8g8",
   "a3c4",
   "f8e8",
   "c4b6",
   "a7b6",
   "e4e5",
   "a8d8",
   "e1g1",
   "f6d5",
   "a2a3",
   "f7f6",
   "e5f6",
   "d5f6",
   "a1d1",
   "d7d5",
   "d3c4",
   "e8e2",
   "c4d5",
   "d8d5",
   "b2c3",
   "e2e3"
  ]
 },
 {
  "id": "tour_colonne-07",
  "fen": "r3k2r/ppp1b1pp/2np3n/8/3p4/5N2/PPPP1PPP/RNB1K2R w KQkq - 2 10",
  "side": "w",
  "ply": 4,
  "played": [
   "e1g1",
   "e8g8",
   "d2d3",
   "h6f5",
   "f1e1",
   "e7f6",
   "c1g5",
   "c6e5",
   "g5f6",
   "f8f6",
   "f3e5",
   "d6e5",
   "e1e5",
   "f5d6",
   "e5e7",
   "a8f8",
   "f2f3",
   "f8c8",
   "e7d7",
   "f6e6",
   "b1d2",
   "e6e2",
   "a1d1",
   "d6f5"
  ]
 }
];
function scanOf(id) {
  const p = (typeof PLANCHES !== 'undefined' ? PLANCHES : P).find((x) => x.id === id);
  return { s: scanLine(p.fen, p.played, p.played.length), p }; // 24 demi-coups des étiquettes d'origine
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
