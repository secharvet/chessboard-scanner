/**
 * Plateaux bruts (6 octobre 2026, étage 1) : pour chaque demi-coup d'une partie, la position telle quelle, sans aucune
 * étiquette : 64 codes de pièces (0 vide, 1-6 blanc PNBRQK, 7-12 noir), le trait, les droits de roque, la case de
 * départ et d'arrivée du coup joué. Le modèle apprendra à lire l'échiquier lui-même.
 *
 *   node scripts/plateaux.mjs <fichier.pgn> <sortie.bin> [--shard k --of n] [--max N] [--min-plies 30] [--max-plies 120]
 * Format binaire par partie : en-tête JSON (une ligne) puis n × 72 octets : 64 codes, trait, roque (4 bits), from, to,
 * prise (code pièce ou 0), échec (0/1/2), zéro, zéro. L'index (positions des parties) est écrit dans <sortie>.idx.jsonl.
 */
import { createReadStream, openSync, writeSync, closeSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const [IN, OUT] = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const SHARD = Number(opt('--shard', 0)); const OF = Number(opt('--of', 1));
const MAX = Number(opt('--max', Infinity)); const MIN_PLIES = Number(opt('--min-plies', 30)); const MAX_PLIES = Number(opt('--max-plies', 120));
const CODE = { p: 1, n: 2, b: 3, r: 4, q: 5, k: 6 };
const SQ = (s) => (s.charCodeAt(0) - 97) + 8 * (Number(s[1]) - 1);

function* games(lines) {
  let headers = {}; let moves = [];
  for (const line of lines) {
    if (line.startsWith('[')) { const m = line.match(/^\[(\w+) "([^"]*)"\]/); if (m) headers[m[1]] = m[2]; continue; }
    if (!line.trim()) { if (moves.length) { yield { headers, text: moves.join(' ') }; headers = {}; moves = []; } continue; }
    moves.push(line);
  }
  if (moves.length) yield { headers, text: moves.join(' ') };
}
const sans = (text) => text.replace(/\{[^}]*\}/g, '').replace(/\([^)]*\)/g, '').replace(/\$\d+/g, '').split(/\s+/)
  .filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, '').replace(/[!?]+$/, ''));

export function plateaux(uci) {
  const c = new Chess(); const rows = [];
  for (const u of uci) {
    let m; try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const buf = Buffer.alloc(72);
    const b = c.board(); // rangée 8 en premier
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const p = b[r][f]; if (p) buf[(7 - r) * 8 + f] = CODE[p.type] + (p.color === 'b' ? 6 : 0); }
    const fen = c.fen().split(' ');
    buf[64] = fen[1] === 'w' ? 0 : 1;
    buf[65] = (fen[2].includes('K') ? 1 : 0) | (fen[2].includes('Q') ? 2 : 0) | (fen[2].includes('k') ? 4 : 0) | (fen[2].includes('q') ? 8 : 0);
    buf[66] = SQ(m.from); buf[67] = SQ(m.to); buf[68] = m.captured ? CODE[m.captured] : 0; buf[69] = m.san.includes('#') ? 2 : m.san.includes('+') ? 1 : 0;
    rows.push(buf);
  }
  return rows;
}

async function main() {
  const fd = openSync(OUT, 'w'); const idx = [];
  let offset = 0; let index = 0; let kept = 0; const t0 = Date.now();
  const handle = (g) => {
    const i = index++;
    if (i % OF !== SHARD || kept >= MAX) return;
    if (g.headers.Variant && g.headers.Variant !== 'Standard') return;
    const list = sans(g.text); if (list.length < MIN_PLIES) return;
    const c = new Chess(); const uci = [];
    for (const san of list.slice(0, MAX_PLIES)) { let m; try { m = c.move(san); } catch { return; } uci.push(m.from + m.to + (m.promotion ?? '')); }
    const rows = plateaux(uci); if (!rows.length) return;
    const head = JSON.stringify({ id: (g.headers.LichessURL ? g.headers.LichessURL.split('/').pop() : '') || String(i), we: Number(g.headers.WhiteElo || 0), be: Number(g.headers.BlackElo || 0), res: g.headers.Result, eco: g.headers.ECO, n: rows.length }) + '\n';
    const hb = Buffer.from(head); writeSync(fd, hb); const body = Buffer.concat(rows); writeSync(fd, body);
    idx.push({ id: JSON.parse(head).id, off: offset + hb.length, n: rows.length, we: JSON.parse(head).we, be: JSON.parse(head).be, res: g.headers.Result });
    offset += hb.length + body.length; kept++;
    if (kept % 2000 === 0) console.error(`${kept} parties (${((Date.now() - t0) / 1000 / kept * 1000).toFixed(0)} ms/partie)`);
  };
  const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity }); const buffer = [];
  for await (const line of rl) { buffer.push(line); if (buffer.length > 20000) { const lastBlank = buffer.lastIndexOf(''); if (lastBlank > 0) { const head = buffer.splice(0, lastBlank + 1); for (const g of games(head)) handle(g); } } if (kept >= MAX) break; }
  for (const g of games(buffer.splice(0))) handle(g);
  closeSync(fd); writeFileSync(OUT + '.idx.jsonl', idx.map((x) => JSON.stringify(x)).join('\n') + '\n');
  console.error(`TERMINÉ ${kept} parties, ${idx.reduce((s, x) => s + x.n, 0)} demi-coups (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
if (process.argv[1] && /plateaux\.mjs$/.test(process.argv[1])) main().catch((e) => { console.error(e); process.exit(1); });
