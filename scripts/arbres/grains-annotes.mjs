/**
 * Grains des parties ANNOTÉES (Chernev, études Lichess commentées) : mêmes grains que grains.mjs, plus le commentaire du
 * maître attaché au demi-coup qu'il suit (`com`). Sert à mesurer l'accord entre les arbres appris et ce que disent les
 * maîtres.
 *   node scripts/arbres/grains-annotes.mjs data/reference/study-ZBiu3Na0.pgn data/reference/grains-chernev.jsonl
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { grains } from '../grains.mjs';

const [IN, OUT] = process.argv.slice(2);
const txt = readFileSync(IN, 'utf8');
const games = txt.split(/\n\n(?=\[Event)/);
const out = [];
for (const g of games) {
  const header = Object.fromEntries([...g.matchAll(/^\[(\w+) "([^"]*)"\]/gm)].map((m) => [m[1], m[2]]));
  const body = g.replace(/^\[.*\]\s*$/gm, '');
  const moves = []; let i = 0; let depth = 0;
  const clean = (s) => s.replace(/\[%[a-z]+ [^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
  while (i < body.length) {
    const ch = body[i];
    if (ch === '{') { const j = body.indexOf('}', i); const c = clean(body.slice(i + 1, j)); if (c && depth === 0 && moves.length) moves.at(-1).com = (moves.at(-1).com ? moves.at(-1).com + ' ' : '') + c; i = j + 1; continue; }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') { depth--; i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    let j = i; while (j < body.length && !/[\s{}()]/.test(body[j])) j++;
    const tok = body.slice(i, j); i = j;
    if (depth > 0) continue;
    if (/^\d+\.+$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
    const san = tok.replace(/^\d+\.+/, '').replace(/[!?]+$/, '');
    if (san) moves.push({ san, com: '' });
  }
  const c = new Chess(); const uci = [];
  for (const mv of moves) { try { const m = c.move(mv.san); uci.push(m.from + m.to + (m.promotion ?? '')); } catch { break; } }
  if (uci.length < 20) continue;
  const rec = grains(uci, { id: (header.Event ?? '').replace(/^Logical Chess Move-by-Move:\s*/, '').slice(0, 60), we: 0, be: 0, res: header.Result, total: uci.length });
  if (!rec) continue;
  for (const [k, n] of rec.nodes.entries()) n.com = moves[k]?.com || '';
  out.push(rec);
  console.error(`${rec.id} : ${rec.n} demi-coups, ${rec.nodes.filter((n) => n.com).length} commentés`);
}
writeFileSync(OUT, out.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.error(`TERMINÉ ${out.length} parties → ${OUT}`);
