/**
 * Filtre un flux PGN Lichess (entrée standard) pour constituer un lot équilibré par niveau (docs/PLANS-ET-CONCEPTS.md,
 * §9 : la tranche < 1200 et la tranche 2000 + sont trop minces dans janvier 2013). On garde les parties classées,
 * hors bullet (cadence de base ≥ 180 s), où les DEUX joueurs sont dans la même tranche, jusqu'à un quota par tranche.
 *
 *   curl -s https://database.lichess.org/standard/lichess_db_standard_rated_2016-01.pgn.zst | zstdcat \
 *     | node scripts/filter-pgn.mjs --bas 1300 --haut 1900 --quota 100000 --milieu 50000 > data/lichess/2016-01-filtre.pgn
 *
 *   --bas N     tranche débutants : les deux joueurs < N
 *   --haut N    tranche forts : les deux joueurs > N
 *   --quota Q   parties gardées par tranche extrême ; --milieu M : parties gardées entre les deux (échantillon)
 * Le flux s'arrête de lui-même quand les quotas sont atteints.
 */

import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? Number(args[args.indexOf(k) + 1]) : d);
const BAS = opt('--bas', 1300);
const HAUT = opt('--haut', 1900);
const QUOTA = opt('--quota', 100000);
const MILIEU = opt('--milieu', 50000);
const MIN_BASE = 180;
const kept = { bas: 0, haut: 0, milieu: 0 };
let seen = 0;
let headers = [];
let moves = [];
let inMoves = false;

function flush() {
  if (!headers.length) return;
  seen++;
  const h = Object.fromEntries(headers.map((l) => l.match(/^\[(\w+) "(.*)"\]$/)?.slice(1) ?? []));
  const w = Number(h.WhiteElo);
  const b = Number(h.BlackElo);
  const base = Number(String(h.TimeControl ?? '').split('+')[0]);
  const ok = w && b && base >= MIN_BASE && h.Variant !== 'From Position' && (h.Event ?? '').includes('Rated');
  let band = null;
  if (ok) band = w < BAS && b < BAS ? 'bas' : w > HAUT && b > HAUT ? 'haut' : w >= BAS && b >= BAS && w <= HAUT && b <= HAUT ? 'milieu' : null;
  if (band && kept[band] < (band === 'milieu' ? MILIEU : QUOTA)) {
    kept[band]++;
    process.stdout.write(`${headers.join('\n')}\n\n${moves.join(' ')}\n\n`);
  }
  headers = [];
  moves = [];
  if (seen % 100000 === 0) console.error(`${seen} parties lues — gardées : ${JSON.stringify(kept)}`);
  if (kept.bas >= QUOTA && kept.haut >= QUOTA && kept.milieu >= MILIEU) { console.error(`quotas atteints après ${seen} parties : ${JSON.stringify(kept)}`); process.exit(0); }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  if (line.startsWith('[')) {
    if (inMoves) { flush(); inMoves = false; }
    headers.push(line);
  } else if (line.trim()) { inMoves = true; moves.push(line.trim()); }
});
rl.on('close', () => { flush(); console.error(`fin du flux après ${seen} parties : ${JSON.stringify(kept)}`); });
