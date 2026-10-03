/** Tour sur colonne ouverte / semi-ouverte : définitions de l'auteur (vérité de terrain du 1er octobre 2026). */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';

const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
const data = JSON.parse(readFileSync(new URL('../reports/verite-terrain.json', import.meta.url), 'utf8'));
const key = JSON.parse(readFileSync(new URL('../reports/verite-terrain-cle.json', import.meta.url), 'utf8'));
const all = [...data.concepts.tour_colonne.positifs, ...data.concepts.tour_colonne.pieges];
function scanOf(id) {
  const k = key[id]; const p = all.find((x) => x.fen === k.fen && x.ply === k.ply && x.game === k.game);
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
