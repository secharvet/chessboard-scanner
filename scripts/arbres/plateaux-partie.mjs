/** Plateaux d'une seule partie, pour le lecteur : coups (SAN ou UCI, séparés par des espaces) → fichier binaire 72 octets/demi-coup.
 *   node scripts/arbres/plateaux-partie.mjs "e4 e5 Nf3 Nc6 ..." sortie.bin        (ou --pgn fichier.pgn [--game n])
 * Écrit aussi sortie.bin.san.json (liste des coups en SAN) pour l'affichage. */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { plateaux } from '../plateaux.mjs';
const args = process.argv.slice(2); const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
let text, out;
if (args.includes('--pgn')) {
  const pgn = readFileSync(opt('--pgn'), 'utf8'); const n = Number(opt('--game', 1));
  const games = pgn.split(/\n\s*\n(?=\[)/).filter((g) => /\n\s*\n/.test(g) || /^\s*1\./m.test(g)); // blocs en-têtes+coups
  const blocks = []; let cur = []; for (const line of pgn.split(/\r?\n/)) { if (/^\[Event /.test(line) && cur.length && cur.some((l) => /^\s*1\./.test(l))) { blocks.push(cur.join('\n')); cur = []; } cur.push(line); } if (cur.length) blocks.push(cur.join('\n'));
  const b = blocks[n - 1]; text = b.split(/\n\s*\n/).slice(1).join(' '); out = args.filter((a) => !a.startsWith('--') && a !== opt('--pgn') && a !== opt('--game')).pop();
} else { [text, out] = args.filter((a) => !a.startsWith('--')); }
const toks = text.replace(/\{[^}]*\}/g, '').replace(/\([^)]*\)/g, '').replace(/\$\d+/g, '').split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, '').replace(/[!?]+$/, ''));
const c = new Chess(); const uci = []; const san = [];
for (const t of toks) { let m; try { m = /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(t) ? c.move({ from: t.slice(0, 2), to: t.slice(2, 4), promotion: t[4] }) : c.move(t); } catch { console.error(`coup illisible : ${t} après ${san.length} demi-coups`); break; } uci.push(m.from + m.to + (m.promotion ?? '')); san.push(m.san); }
const rows = plateaux(uci); writeFileSync(out, Buffer.concat(rows)); writeFileSync(out + '.san.json', JSON.stringify(san));
console.error(`${rows.length} demi-coups → ${out}`);
