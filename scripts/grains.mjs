/**
 * Grains bicolores (6 octobre 2026) : pour chaque demi-coup d'une partie humaine, un nœud qui porte tout ce que le code
 * sait voir — camp, pièce, prise, échec, effets immédiats (menace, pression, soutien), atomes de structure (levier,
 * manœuvre, échange, roque…), plans détectés, faits de position apparus et disparus (menaces, clouages, fourchettes,
 * pions faibles, colonnes, avant-postes…), contrôle des cases par zone et pression sur la zone du roi adverse.
 * Aucune règle nouvelle : ce sont les détecteurs existants, appliqués à toute la partie. La suite (modèle, vecteurs,
 * regroupements) apprend sur ce flux.
 *
 *   node scripts/grains.mjs <fichier.pgn> <sortie.jsonl> [--shard k --of n] [--max N] [--min-plies 30] [--max-plies 120]
 */
import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Chess } from 'chess.js';
import { detectAtoms } from '../coach/atoms.mjs';
import { scanLine } from '../coach/plan-concepts.mjs';
import { moveEffects } from '../coach/move-class.mjs';
import { buildAllFacts } from '../positional/index.js';
import { buildAttackMap } from '../positional/attack-map.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const [IN, OUT] = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const SHARD = Number(opt('--shard', 0)); const OF = Number(opt('--of', 1));
const MAX = Number(opt('--max', Infinity)); const MIN_PLIES = Number(opt('--min-plies', 30)); const MAX_PLIES = Number(opt('--max-plies', 120));

const FILES = 'abcdefgh';
/** Zone RELATIVE : 0 côté de son roi, 1 centre, 2 côté de mon roi (selon la colonne des rois) × (0 mon camp, 3 son camp).
 *  Même grain pour g4 et b4 selon où se trouve le roi adverse : c'est l'abstraction qui permet de fusionner. */
const wingOf = (f) => (f < 3 ? 'q' : f < 5 ? 'c' : 'k');
const zoneOf = (sq, color, kings) => {
  const f = FILES.indexOf(sq[0]); const r = Number(sq[1]);
  const w = wingOf(f);
  const his = kings[color === 'w' ? 'b' : 'w']; const mine = kings[color];
  const hisW = his ? wingOf(FILES.indexOf(his[0])) : 'k'; const mineW = mine ? wingOf(FILES.indexOf(mine[0])) : 'k';
  const wing = w === 'c' ? 1 : w === hisW ? 0 : w === mineW ? 2 : (hisW === 'c' ? 0 : 2);
  const myHalf = color === 'w' ? r <= 4 : r >= 5;
  return wing + (myHalf ? 0 : 3);
};
const kingZone = (ksq) => {
  if (!ksq) return [];
  const f = FILES.indexOf(ksq[0]); const r = Number(ksq[1]); const out = [];
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) { const ff = f + df; const rr = r + dr; if (ff >= 0 && ff < 8 && rr >= 1 && rr <= 8) out.push(FILES[ff] + rr); }
  return out;
};
/** Contrôle : pour chaque camp, cases attaquées par zone (6) et pression sur la zone du roi adverse. */
function control(fen) {
  const map = buildAttackMap(fen);
  const out = { w: { z: [0, 0, 0, 0, 0, 0], k: 0 }, b: { z: [0, 0, 0, 0, 0, 0], k: 0 } };
  const kings = { w: map.pieces.find((p) => p.type === 'k' && p.color === 'w')?.square, b: map.pieces.find((p) => p.type === 'k' && p.color === 'b')?.square };
  const kz = { w: new Set(kingZone(kings.b)), b: new Set(kingZone(kings.w)) }; // zone du roi ADVERSE, vue du camp
  for (const color of ['w', 'b']) {
    const seen = new Set();
    for (const p of map.pieces) if (p.color === color) for (const s of map.attacks.get(p)) seen.add(s);
    for (const s of seen) { out[color].z[zoneOf(s, color, kings)]++; if (kz[color].has(s)) out[color].k++; }
  }
  out.kings = kings; out.map = map;
  return out;
}
/** Cibles RELATIONNELLES du coup : ce que la pièce jouée vise après le coup. */
function targets(ctl, m, facts) {
  const me = m.color; const op = me === 'w' ? 'b' : 'w';
  const att = ctl.map.attacks.get(ctl.map.at[m.to]) ?? [];
  const kz = new Set(kingZone(ctl.kings[op]));
  const out = [];
  if (att.some((s) => kz.has(s))) out.push('roi');
  const weak = new Set([...facts].filter((k) => /^(PION_ISOLE|PION_ARRIERE|PION_FAIBLE|PION_ARRIERE_DOUBLE|DOUBLON):/.test(k) && k.includes(':' + op)).map((k) => k.split('@')[1]).filter(Boolean));
  if (att.some((s) => weak.has(s))) out.push('pion_faible');
  if ((m.piece === 'r' || m.piece === 'q') && [...facts].some((k) => k.startsWith('COLONNE_OUVERTE') && k.endsWith('@' + m.to[0]))) out.push('colonne_ouverte');
  if (['d4', 'e4', 'd5', 'e5'].includes(m.to)) out.push('centre');
  const hisPieces = ctl.map.pieces.filter((p) => p.color === op && p.type !== 'k' && p.type !== 'p').map((p) => p.square);
  if (att.some((s) => hisPieces.includes(s))) out.push('piece');
  return out;
}
const factKey = (f) => `${f.id}${f.params?.color ? ':' + f.params.color : ''}${f.params?.square ? '@' + f.params.square : f.params?.file ? '@' + f.params.file : ''}`;
const factSet = (fen) => new Set(buildAllFacts(fen).filter((f) => f.id !== 'PHASE').map(factKey));
const strip = (k) => k.replace(/@.*$/, ''); // sans la case : pour les comptes

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

async function main() {
  const out = createWriteStream(OUT);
  const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity });
  const buffer = [];
  let index = 0; let kept = 0; const t0 = Date.now();
  const flush = () => { for (const g of games(buffer.splice(0))) handle(g); };
  const handle = (g) => {
    const i = index++;
    if (i % OF !== SHARD || kept >= MAX) return;
    const we = Number(g.headers.WhiteElo || 0); const be = Number(g.headers.BlackElo || 0);
    if (g.headers.Variant && g.headers.Variant !== 'Standard') return;
    const list = sans(g.text);
    if (list.length < MIN_PLIES) return;
    const c = new Chess(); const uci = [];
    for (const san of list.slice(0, MAX_PLIES)) { let m; try { m = c.move(san); } catch { return; } uci.push(m.from + m.to + (m.promotion ?? '')); }
    const rec = grains(uci, { id: g.headers.Site?.split('/').pop() ?? String(i), we, be, res: g.headers.Result, eco: g.headers.ECO, op: g.headers.Opening, tc: g.headers.TimeControl, total: list.length });
    if (!rec) return;
    out.write(JSON.stringify(rec) + '\n'); kept++;
    if (kept % 50 === 0) console.error(`${kept} parties (${((Date.now() - t0) / 1000 / kept).toFixed(2)} s/partie)`);
  };
  for await (const line of rl) { buffer.push(line); if (buffer.length > 4000 && line === '' && buffer.at(-2) !== '' && /^\[Event/.test(buffer.find((l) => l.startsWith('[')) ?? '')) { /* flush par blocs de parties complètes */ } if (buffer.length > 20000) { const lastBlank = buffer.lastIndexOf(''); if (lastBlank > 0) { const head = buffer.splice(0, lastBlank + 1); for (const g of games(head)) handle(g); } } if (kept >= MAX) break; }
  flush();
  out.end();
  console.error(`TERMINÉ ${kept} parties gardées sur ${index} lues (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}

/** Le flux bicolore d'une partie. */
export function grains(uci, meta = {}) {
  const start = new Chess();
  const fen0 = start.fen();
  let atoms = []; let scan = {};
  try { atoms = detectAtoms(fen0, uci, uci.length).atoms ?? []; } catch { atoms = []; }
  try { scan = scanLine(fen0, uci, uci.length); } catch { scan = {}; }
  const plansAt = new Map();
  for (const [k, v] of Object.entries(scan)) {
    if (typeof v !== 'number' || v < 0) continue;
    const m = k.match(/^(.*)_(w|b)$/); if (!m) continue;
    if (!plansAt.has(v)) plansAt.set(v, []); plansAt.get(v).push(`${m[1]}:${m[2]}`);
  }
  const c = new Chess(fen0);
  let prevFacts = factSet(fen0); let prevCtl = control(fen0);
  delete prevCtl.map;
  const nodes = [];
  for (const [i, u] of uci.entries()) {
    const fenBefore = c.fen();
    let m; try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const fenAfter = c.fen();
    const ef = (() => { try { return moveEffects(fenBefore, m).map((e) => e.kind); } catch { return []; } })();
    const at = atoms.filter((a) => a.ply === i && a.side === m.color).map((a) => a.kind);
    const facts = factSet(fenAfter);
    const fa = [...facts].filter((k) => !prevFacts.has(k)).map(strip);
    const fl = [...prevFacts].filter((k) => !facts.has(k)).map(strip);
    const ctl = control(fenAfter);
    const me = m.color; const op = me === 'w' ? 'b' : 'w';
    const tg = targets(ctl, m, facts);
    nodes.push({
      i, s: me, san: m.san, pc: m.piece, cap: m.captured ?? null, chk: m.san.includes('+') ? 1 : m.san.includes('#') ? 2 : 0,
      cas: m.san.startsWith('O-O-O') ? 'q' : m.san.startsWith('O-O') ? 'k' : null, fr: m.from, to: m.to, zt: zoneOf(m.to, me, ctl.kings), tg,
      ef: [...new Set(ef)], at: [...new Set(at)], pl: plansAt.get(i) ?? [],
      fa: [...new Set(fa)], fl: [...new Set(fl)],
      cz: ctl[me].z, dz: ctl[me].z.map((v, j) => v - prevCtl[me].z[j]), kz: ctl[me].k, dk: ctl[me].k - prevCtl[me].k, ok: ctl[op].k,
    });
    prevFacts = facts; prevCtl = ctl; delete prevCtl.map;
  }
  if (!nodes.length) return null;
  return { ...meta, n: nodes.length, nodes };
}

if (process.argv[1] && /grains\.mjs$/.test(process.argv[1])) main().catch((e) => { console.error(e); process.exit(1); });
