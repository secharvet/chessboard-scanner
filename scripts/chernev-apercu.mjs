/**
 * Aperçu (4 oct. 2026, soir) : parties de Chernev (étude Lichess commentée) → pour chaque coup commenté par le maître,
 * ce que NOTRE vocabulaire dit du coup réellement joué, en partant des coups de la partie (pas du moteur).
 *   node scripts/chernev-apercu.mjs data/reference/study-ZBiu3Na0.pgn [nbParties] → reports/chernev-apercu.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';
import { classify, enPrise, moveEffects } from '../coach/move-class.mjs';
import { toFrenchSan } from '../coach/notation.mjs';

const IN = process.argv[2] ?? 'data/reference/study-ZBiu3Na0.pgn';
const N = Number(process.argv[3] ?? 99);
const txt = readFileSync(IN, 'utf8');
const games = txt.split(/\n\n(?=\[Event)/).slice(0, N);

/** PGN → [{ san, comments[] }], commentaires d'intro à part ; variantes ignorées. */
function parse(pgn) {
  const header = Object.fromEntries([...pgn.matchAll(/^\[(\w+) "([^"]*)"\]/gm)].map((m) => [m[1], m[2]]));
  const body = pgn.replace(/^\[.*\]\s*$/gm, '');
  const moves = []; const intro = [];
  let i = 0, depth = 0;
  const clean = (s) => s.replace(/\[%[a-z]+ [^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
  while (i < body.length) {
    const ch = body[i];
    if (ch === '{') { const j = body.indexOf('}', i); const c = clean(body.slice(i + 1, j)); if (c && depth === 0) (moves.length ? moves.at(-1).comments : intro).push(c); i = j + 1; continue; }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') { depth--; i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    let j = i; while (j < body.length && !/[\s{}()]/.test(body[j])) j++;
    const tok = body.slice(i, j); i = j;
    if (depth > 0) continue;
    if (/^\d+\.+$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
    const san = tok.replace(/^\d+\.+/, '').replace(/[!?]+$/, '');
    if (san) moves.push({ san, comments: [] });
  }
  return { header, intro, moves };
}

const out = [];
const totals = { coups: 0, commentes: 0, cats: {} };
for (const g of games) {
  const { header, intro, moves } = parse(g);
  const c0 = new Chess();
  const played = [];
  for (const mv of moves) { try { const m = c0.move(mv.san); played.push(m.from + m.to + (m.promotion ?? '')); } catch { break; } }
  const fen0 = new Chess().fen();
  const scan = scanLine(fen0, played, played.length);
  const atoms = scan.atomes ?? [];
  const c = new Chess();
  const rows = [];
  for (let i = 0; i < played.length; i++) {
    const u = played[i];
    const color = c.turn();
    const inCheckBefore = c.inCheck();
    const before = enPrise(c, color);
    const fenBefore = c.fen();
    const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    const cat = classify(c, m, i, scan, atoms, inCheckBefore, before);
    const effets = moveEffects(fenBefore, m).map((e) => e.text);
    const atomesIci = atoms.filter((a) => a.side === color && a.ply === i).map((a) => a.text ?? a.kind);
    const plans = Object.entries(scan).filter(([k, v]) => k.endsWith(`_${color}`) && typeof v === 'number' && v === i).map(([k]) => k.replace(`_${color}`, ''));
    const comments = moves[i]?.comments ?? [];
    totals.coups++;
    if (comments.length) { totals.commentes++; totals.cats[cat.split(':')[0]] = (totals.cats[cat.split(':')[0]] ?? 0) + 1; }
    rows.push({ ply: i, num: `${Math.floor(i / 2) + 1}${color === 'w' ? '.' : '…'}`, san: toFrenchSan(m.san), color, fenBefore, cat, effets, atomes: atomesIci, plans, maitre: comments });
  }
  out.push({ titre: header.Event?.replace(/^Logical Chess Move-by-Move:\s*/, ''), intro, rows });
  console.log(`${out.length}. ${out.at(-1).titre} : ${rows.length} coups, ${rows.filter((r) => r.maitre.length).length} commentés`);
}
writeFileSync(process.argv[4] ?? 'reports/chernev-apercu.json', JSON.stringify({ source: IN, totals, parties: out }, null, 1));
console.log('TOTAL', JSON.stringify(totals));
