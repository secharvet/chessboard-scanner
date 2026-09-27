/**
 * Planches de contrôle des étiquettes (docs/PLANS-ET-CONCEPTS.md, §6) : pour un échantillon
 * d'exemples POSITIFS de chaque concept, deux échiquiers côte à côte —
 *   à gauche la position, avec les premiers coups de la meilleure suite de Stockfish en flèches ;
 *   à droite la position où le concept apparaît (l'état but) —
 * et la légende : concept, camp, évaluations, suite jouée, fait qui apparaît.
 *
 *   node scripts/label-boards.mjs data/labels/2013-01.jsonl [--per 12] [--out dossier] [--seed 1]
 * (le site doit tourner sur http://localhost:6400)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { chromium } from 'playwright';
import { buildAllFacts } from '../positional/index.js';
import { renderToken } from '../positional/interpreter.js';
import { scanLine } from '../coach/plan-concepts.mjs';
import { toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PER = Number(opt('--per', 12));
const OUT = opt('--out', `reports/planches-concepts-${Date.now()}`);
let seed = Number(opt('--seed', 1));
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
mkdirSync(OUT, { recursive: true });

const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture'];
const NAMES = { tour_colonne: 'tour sur colonne ouverte', cavalier_avant_poste: 'cavalier sur avant-poste', blocage: 'blocage d\'un pion faible', rupture: 'rupture de pions' };
const RELEVANT = {
  tour_colonne: ['TOUR_COLONNE_OUVERTE'], cavalier_avant_poste: ['CAVALIER_AVANT_POSTE'],
  blocage: ['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE'], rupture: ['COLONNE_OUVERTE', 'COLONNE_SEMI_OUVERTE', 'PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE'],
};

/** Exemple positif : dans la meilleure suite, pas dans les suites qui valent au moins 0,3 pion de moins. */
const positive = (r, k) => r.lines[0][k] >= 0
  && r.lines.slice(1).some((_, i) => r.evals[0] - r.evals[i + 1] >= 30)
  && !r.lines.slice(1).some((l, i) => r.evals[0] - r.evals[i + 1] >= 30 && l[k] >= 0);

const records = readFileSync(args[0], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
// --verified : le fichier d'entrée est la sortie de verify-labels.mjs (on ne garde que ok: true).
const VERIFIED = args.includes('--verified');
const picks = [];
for (const c of CONCEPTS) {
  const pool = [];
  if (VERIFIED) for (const v of records) { if (v.ok && v.concept === c) pool.push({ r: { fen: v.fen }, c, side: v.side }); }
  else for (const r of records) for (const side of ['w', 'b']) if (positive(r, `${c}_${side}`)) pool.push({ r, c, side });
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  picks.push(...pool.slice(0, PER));
  console.log(`${NAMES[c]} : ${pool.length} positifs, ${Math.min(PER, pool.length)} tirés`);
}

// Un seul fil : même recherche que le générateur (déterministe), la planche montre la suite de l'étiquette.
const engine = new UciEngine({ threads: 1 });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1120, height: 760 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:6400/index.html');
const index = [];
let n = 0;
for (const { r, c, side } of picks) {
  n++;
  // Suites recalculées (Stockfish n'est pas parfaitement déterministe) : la planche montre SA suite.
  const lines = await engine.analyze(r.fen, { depth: 16, multipv: 3 });
  const pv = lines[0]?.pv ?? [];
  const scan = scanLine(r.fen, pv);
  const k = `${c}_${side}`;
  const ply = scan[k];
  const chess = new Chess(r.fen);
  const moves = [];
  for (const u of pv.slice(0, Math.max(ply + 1, 4))) {
    try { moves.push(chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
  }
  const goalFen = ply >= 0 ? (() => { const g = new Chess(r.fen); for (const m of moves.slice(0, ply + 1)) g.move(m.san); return g.fen(); })() : r.fen;
  const before = new Set(buildAllFacts(r.fen).map((t) => `${t.id}|${JSON.stringify(t.params)}`));
  const fresh = buildAllFacts(goalFen).filter((t) => RELEVANT[c].includes(t.id) && !before.has(`${t.id}|${JSON.stringify(t.params)}`))
    .map(renderToken).slice(0, 3);
  const arrows = moves.slice(0, 4).map((m) => ({ color: m.color === side ? 'G' : 'R', from: m.from, to: m.to }));
  const sanLine = moves.map((m) => toFrenchSan(m.san)).join(' ');
  const caption = `#${n} — plan des ${side === 'w' ? 'Blancs' : 'Noirs'} : ${NAMES[c]}`
    + ` | éval ${lines.map((l) => (l.score.type === 'mate' ? `mat ${l.score.value}` : (l.score.value / 100).toFixed(2))).join(' / ')}`
    + ` | apparaît au demi-coup ${ply >= 0 ? ply + 1 : '— (plus dans la suite recalculée)'}`;
  await page.evaluate(async ({ fen, goalFen, arrows, caption, sanLine, fresh, orientation }) => {
    const { renderFenBoard } = await import('/board-view.js');
    document.body.innerHTML = `<div id="pl" style="width:1100px;padding:10px;background:#fff;font:15px sans-serif">
      <div style="display:flex;gap:20px"><div id="a" class="board" style="width:520px;height:520px"></div><div id="b" class="board" style="width:520px;height:520px"></div></div>
      <div style="margin-top:8px;font-weight:bold">${caption}</div>
      <div>Suite : ${sanLine}</div><div>Apparaît : ${fresh.join(' ; ') || '(aucun fait nouveau lisible)'}</div></div>`;
    renderFenBoard(document.getElementById('a'), fen, { orientation, drawables: { arrows } });
    renderFenBoard(document.getElementById('b'), goalFen, { orientation, drawables: { arrows: [] } });
  }, { fen: r.fen, goalFen, arrows, caption, sanLine, fresh, orientation: side === 'w' ? 'white' : 'black' });
  await page.waitForTimeout(150);
  const file = `${OUT}/${String(n).padStart(3, '0')}-${c}-${side}.png`;
  await page.locator('#pl').screenshot({ path: file });
  index.push({ n, file, concept: c, side, fen: r.fen, ply, line: sanLine, fresh, stillThere: ply >= 0 });
}
await browser.close();
engine.stop();
writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 2));
console.log(`Planches : ${OUT} (${index.length}) ; concept absent de la suite recalculée : ${index.filter((x) => !x.stillThere).length}`);
