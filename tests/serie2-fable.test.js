/** Désaccords de Fable sur la série 2 (4 octobre 2026) et décisions de l'auteur : positions copiées ici. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scanLine } from '../coach/plan-concepts.mjs';

const P = [
 {
  "id": "cavalier_avant_poste-03",
  "fen": "2k3r1/p1p4p/2p1p3/5p2/3P1P1K/2NnP3/PP5P/4R3 w - - 7 25",
  "side": "w",
  "ply": 4,
  "played": [
   "e1e2",
   "d3c1",
   "e2c2",
   "c1d3",
   "c3a4",
   "d3b4",
   "c2c4",
   "b4a2",
   "c4c6",
   "a2b4",
   "c6e6",
   "b4d3",
   "e6f6",
   "g8g4",
   "h4h5",
   "g4g2",
   "h2h4",
   "d3b2",
   "a4b2",
   "g2b2",
   "f6f5",
   "b2a2",
   "f5c5",
   "a7a5"
  ]
 },
 {
  "id": "cavalier_avant_poste-07",
  "fen": "r2qk2r/pp3pbp/2b2p2/2p1p3/2Q1P3/5N2/3P1PPP/R1B2RK1 w kq - 2 16",
  "side": "w",
  "ply": 6,
  "played": [
   "c1a3",
   "b7b6",
   "h2h4",
   "e8g8",
   "h4h5",
   "f8e8",
   "f3h4",
   "d8e7",
   "h4f5",
   "e7e6",
   "c4e6",
   "e8e6",
   "h5h6",
   "g7f8",
   "f2f4",
   "e5f4",
   "f1f4",
   "c6e4",
   "a1e1",
   "e4f5",
   "e1e6",
   "f5e6",
   "f4f6",
   "b6b5"
  ]
 },
 {
  "id": "blocage-03",
  "fen": "rnbq1rk1/1p2bppp/p3p1n1/3pP3/P1pP4/5NP1/1PPN1PBP/R1BQ1RK1 w - - 5 10",
  "side": "b",
  "ply": 7,
  "played": [
   "d2b1",
   "c8d7",
   "c2c3",
   "b8c6",
   "b2b3",
   "c4b3",
   "d1b3",
   "c6a5",
   "b3c2",
   "a5c4",
   "b1d2",
   "b7b5",
   "a4b5",
   "a6b5",
   "a1a8",
   "d8a8",
   "d2b3",
   "a8a4",
   "b3d2",
   "a4c2"
  ]
 },
 {
  "id": "rupture-02",
  "fen": "r2qk2r/pp3ppp/2bb1n2/3pp3/8/1NP1P3/PP2NPPP/R1BQK2R w KQkq - 4 10",
  "side": "b",
  "ply": 5,
  "played": [
   "f2f3",
   "e8g8",
   "g2g3",
   "d8c7",
   "h2h4",
   "d5d4",
   "e3e4",
   "d4c3",
   "e2c3",
   "a8d8",
   "d1c2",
   "f6d7",
   "c1e3",
   "b7b6",
   "a1c1",
   "d7c5",
   "b3c5",
   "d6c5",
   "e3c5",
   "b6c5",
   "c1d1",
   "c7a5",
   "d1d8",
   "f8d8"
  ]
 },
 {
  "id": "affaiblir-02",
  "fen": "r2qk2r/ppp2ppb/2nb1n1p/3p4/1P1P2P1/P3PP2/3B3P/RN1QKBNR w KQkq - 1 10",
  "side": "b",
  "ply": 5,
  "played": [
   "b1c3",
   "d8e7",
   "f1e2",
   "e7e6",
   "e1f2",
   "h6h5",
   "g4g5",
   "f6d7",
   "f3f4",
   "g7g6",
   "e2f3",
   "d7b6",
   "h2h4",
   "f7f6",
   "g1h3",
   "b6c4",
   "c3d5",
   "e8c8",
   "d5f6",
   "c6e7",
   "d1a4",
   "c8b8",
   "a1d1",
   "c4b2"
  ]
 },
 {
  "id": "affaiblir-08",
  "fen": "r1bqk2r/1pp2pp1/p2p1n1p/n3p3/2B1P3/P1PPB3/2PN1PPP/R2QK2R w KQkq - 2 10",
  "side": "w",
  "ply": 4,
  "played": [
   "c4a2",
   "d8e7",
   "e1g1",
   "c8e6",
   "d3d4",
   "e6a2",
   "a1a2",
   "e7d7",
   "d4d5",
   "c7c5",
   "c3c4",
   "b7b6",
   "d1e1",
   "f6g4",
   "h2h3",
   "g4e3",
   "f2e3",
   "e8c8",
   "d2b3",
   "a5b3",
   "c2b3",
   "f7f6",
   "b3b4",
   "c8b7"
  ]
 },
 {
  "id": "tour_colonne_semi_ouverte-02",
  "fen": "rn5r/pp2kBbp/2p1bn2/3pB3/3P3N/8/PPP3PP/RN2K2R w KQ - 0 16",
  "side": "b",
  "ply": 5,
  "played": [
   "f7e6",
   "e7e6",
   "e1g1",
   "h8f8",
   "b1c3",
   "f8g8",
   "h4f5",
   "b8d7",
   "a1e1",
   "f6g4",
   "e5g7",
   "e6f7",
   "e1e7",
   "f7g6",
   "f5h4",
   "g6h5",
   "e7d7",
   "g4e3",
   "f1e1",
   "h5h4",
   "e1e3",
   "a8e8",
   "g7e5",
   "g8g4"
  ]
 },
 {
  "id": "dominer-06",
  "fen": "r1b2rk1/ppp2pb1/3p3p/3P2q1/3nP1pN/2N3P1/PPPQB2P/2KR3R w - - 3 16",
  "side": "b",
  "ply": 1,
  "played": [
   "h4g2",
   "d4e2",
   "c3e2",
   "g5d2",
   "d1d2",
   "f8e8",
   "g2f4",
   "e8e4",
   "h1e1",
   "c8d7",
   "e2c3",
   "e4e1"
  ]
 },
 {
  "id": "rupture-03",
  "fen": "r1bq1rk1/1pp1bppp/pn1p1n2/8/3pP3/1PN2N2/PBP1BPPP/R2Q1RK1 w - - 0 10",
  "side": "b",
  "ply": 7,
  "played": [
   "d1d4",
   "c7c5",
   "d4d2",
   "c8d7",
   "e2d3",
   "a8c8",
   "d2f4",
   "c5c4",
   "d3e2",
   "f6h5",
   "f4e3",
   "c4b3",
   "a2b3",
   "h5f6",
   "e2d3",
   "f8e8",
   "e3f4",
   "f6h5",
   "f4e3",
   "e7f6",
   "e4e5",
   "d6e5",
   "e3e4",
   "g7g6"
  ]
 },
 {
  "id": "affaiblir-10",
  "fen": "r1bq1rk1/ppp2ppp/2n2n2/4p3/4p3/2PB1N2/PP1P1PPP/R1BQR1K1 w - - 0 10",
  "side": "b",
  "ply": 7,
  "played": [
   "d3e4",
   "f6e4",
   "e1e4",
   "c8f5",
   "e4e1",
   "e5e4",
   "f3d4",
   "c6d4",
   "c3d4",
   "d8d4",
   "d1e2",
   "a8d8",
   "h2h3",
   "c7c5",
   "a2a4",
   "b7b6",
   "a4a5",
   "f8e8",
   "a5b6",
   "a7b6",
   "a1a7",
   "c5c4",
   "e2h5",
   "f5g6"
  ]
 }
];
function scanOf(id) {
  const p = (typeof PLANCHES !== 'undefined' ? PLANCHES : P).find((x) => x.id === id);
  return { s: scanLine(p.fen, p.played, p.played.length), p }; // 24 demi-coups des étiquettes d'origine
}

describe('Série 2 : ce que Fable a vu et que l\'auteur a tranché', () => {
  it('avant-poste 3 : Ca4 sur la bande sans pion qui le soutient → pas un avant-poste', () => {
    const { s, p } = scanOf('cavalier_avant_poste-03'); assert.notEqual(s[`cavalier_avant_poste_${p.side}`], p.ply);
  });
  it('avant-poste 7 : Ch4 n\'est qu\'un passage, le cavalier s\'installe en f5 au coup suivant', () => {
    const { s, p } = scanOf('cavalier_avant_poste-07'); assert.equal(s[`cavalier_avant_poste_${p.side}`], p.ply + 2);
  });
  it('blocage 3 : Ca5 repart aussitôt, pas de blocage à ce coup', () => {
    const { s, p } = scanOf('blocage-03'); assert.notEqual(s[`blocage_${p.side}`], p.ply);
  });
  it('rupture 2 : levier d4 à deux cibles, e3 avance mais dxc3 réalise la rupture', () => {
    const { s, p } = scanOf('rupture-02'); assert.equal(s[`rupture_${p.side}`], p.ply); assert.equal(s[`rupture_leviers_${p.side}`][0].issue, 'prise');
  });
  it('rupture 3 : c4 puis cxb3, colonne nouvelle → rupture réalisée (était rangée en piège)', () => {
    const { s, p } = scanOf('rupture-03'); assert.equal(s[`rupture_${p.side}`], p.ply);
  });
  it('affaiblir 2 : le bouclier du roi blanc « affaibli » par Rf2 n\'est pas l\'œuvre du levier h5', () => {
    const { s, p } = scanOf('affaiblir-02'); assert.notEqual(s[`affaiblir_${p.side}`], p.ply);
  });
  it('affaiblir 8 : pion d6 arriéré derrière d5 blanc, colonne fermée → pas une faiblesse', () => {
    const { s, p } = scanOf('affaiblir-08'); assert.equal(s[`affaiblir_${p.side}`], -1);
  });
  it('affaiblir 10 : Cxd4 cxd4 laisse d2 isolé → affaiblissement réel (était rangé en piège)', () => {
    const { s, p } = scanOf('affaiblir-10'); assert.equal(s[`affaiblir_${p.side}`], p.ply);
  });
  it('colonne semi-ouverte 2 : Tg8 derrière son fou g7 ne voit pas la colonne', () => {
    const { s, p } = scanOf('tour_colonne_semi_ouverte-02'); assert.notEqual(s[`tour_colonne_semi_ouverte_${p.side}`], p.ply);
  });
  it('domination 6 : fou sans vis-à-vis (moyen) mais aucune exploitation des cases → pas de domination', () => {
    const { s, p } = scanOf('dominer-06'); assert.equal(s[`fou_sans_vis_a_vis_${p.side}`], p.ply); assert.equal(s[`dominer_${p.side}`], -1);
  });
});
