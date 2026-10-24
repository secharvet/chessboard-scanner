/**
 * Coups commentés des études annotées (nuit du 6 au 7 octobre 2026) : pour chaque chapitre des études gardées (sans
 * doublon), la ligne principale rejouée, et chaque commentaire rattaché au coup qu'il suit (variations ignorées).
 * Sorties : <out>/coups.jsonl (une ligne par chapitre : id, study, uci, fen0, commentaires [{ply, san, text}]) et les
 * plateaux bruts data/plateaux/annotes.bin (+ .idx.jsonl) pour plonger ces parties dans les espaces appris.
 *   node scripts/arbres/annotes-coups.mjs data/reference/annotes
 */
import { readFileSync, writeFileSync, openSync, writeSync, closeSync } from 'node:fs';
import { Chess } from 'chess.js';
import { plateaux } from '../plateaux.mjs';
const DIR = process.argv[2] ?? 'data/reference/annotes';
const inv = JSON.parse(readFileSync(`${DIR}/inventaire.json`, 'utf8')).filter((x) => x.garde && !x.doublon_de);
const ENGINE = /(Inaccuracy|Mistake|Blunder|was best|Checkmate is now|The game is a draw|is winning|^\s*[-+]?\d+\.\d+\s*$)/;
function* games(text) {
  let headers = {}; let body = []; let inHeaders = true;
  for (const line of text.split(/\r?\n/)) {
    if (/^\[\w+ "/.test(line) && (inHeaders || !body.join(' ').trim())) { const m = line.match(/^\[(\w+) "([^"]*)"\]/); if (m) headers[m[1]] = m[2]; inHeaders = true; continue; }
    if (inHeaders && !line.trim()) { inHeaders = false; continue; }
    if (!inHeaders && !line.trim() && body.length) { yield { headers, text: body.join(' ') }; headers = {}; body = []; inHeaders = true; continue; }
    if (!inHeaders) body.push(line);
  }
  if (body.length) yield { headers, text: body.join(' ') };
}
function parse(text) {
  // ligne principale : coups à profondeur 0 ; commentaires rattachés au dernier coup joué à profondeur 0
  const moves = []; const comments = []; let depth = 0; let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '{') { const j = text.indexOf('}', i); const c = text.slice(i + 1, j < 0 ? text.length : j); if (depth === 0 && moves.length) comments.push({ ply: moves.length - 1, text: c }); i = j < 0 ? text.length : j + 1; continue; }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') { depth = Math.max(0, depth - 1); i++; continue; }
    if (ch === '}') { i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    let j = i; while (j < text.length && !/[\s{}()]/.test(text[j])) j++;
    const tok = text.slice(i, j); i = j;
    if (depth) continue;
    if (/^\d+\.+$/.test(tok) || /^\$\d+$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
    const san = tok.replace(/^\d+\.+/, '').replace(/[!?]+$/, '').replace(/[+#]$/, (m) => m);
    if (san) moves.push(san);
  }
  return { moves, comments };
}
const out = []; const fd = openSync('data/plateaux/annotes.bin', 'w'); const idx = []; let offset = 0;
let chap = 0, kept = 0, ncom = 0, ncomLate = 0, skippedFen = 0;
for (const st of inv) {
  const text = readFileSync(`${DIR}/${st.id}.pgn`, 'utf8'); let k = 0;
  for (const g of games(text)) {
    chap++; k++;
    if (g.headers.Variant && g.headers.Variant !== 'Standard') continue;
    const { moves, comments } = parse(g.text);
    const fen0 = g.headers.FEN;
    let c; try { c = fen0 ? new Chess(fen0) : new Chess(); } catch { continue; } const uci = []; const sans = [];
    let okAll = true;
    for (const san of moves) { let m; try { m = c.move(san); } catch { okAll = false; break; } uci.push(m.from + m.to + (m.promotion ?? '')); sans.push(m.san); }
    if (uci.length < 17) { if (fen0) skippedFen++; continue; }
    const coms = comments.filter((x) => x.ply < uci.length).map((x) => ({ ply: x.ply, san: sans[x.ply], text: x.text.replace(/\[%[a-z]+ [^\]]*\]/g, '').replace(/\s+/g, ' ').trim() })).filter((x) => x.text.length >= 25 && !ENGINE.test(x.text));
    if (!coms.length) continue;
    const id = `${st.id}_${k}`; let rows; try { rows = plateaux(uci, fen0); } catch { continue; } if (rows.length < 17) continue;
    const head = JSON.stringify({ id, we: 0, be: 0, res: g.headers.Result, eco: g.headers.ECO, n: rows.length }) + '\n'; const hb = Buffer.from(head); writeSync(fd, hb); const body = Buffer.concat(rows); writeSync(fd, body);
    idx.push({ id, off: offset + hb.length, n: rows.length, we: 0, be: 0, res: g.headers.Result }); offset += hb.length + body.length;
    out.push({ id, study: st.id, titre: st.titre, chapitre: g.headers.ChapterName ?? g.headers.Event ?? '', annotateur: g.headers.Annotator ?? '', fen0: fen0 ?? null, tronque: !okAll, uci, commentaires: coms });
    kept++; ncom += coms.length; ncomLate += coms.filter((x) => x.ply >= 15).length;
  }
}
closeSync(fd); writeFileSync('data/plateaux/annotes.bin.idx.jsonl', idx.map((x) => JSON.stringify(x)).join('\n') + '\n');
writeFileSync(`${DIR}/coups.jsonl`, out.map((x) => JSON.stringify(x)).join('\n') + '\n');
console.error(`TERMINÉ ${inv.length} études, ${chap} chapitres, ${kept} gardés (${skippedFen} partiels trop courts), ${ncom} commentaires, dont ${ncomLate} après le 15e demi-coup (sondables)`);
