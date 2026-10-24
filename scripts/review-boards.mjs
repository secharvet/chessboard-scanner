/**
 * Planches de relecture : pour chaque conseil d'une partie commentée, l'échiquier dessiné par le
 * moteur de rendu du site, avec une flèche sur le coup conseillé et une sur le coup joué.
 * Sert à relire les explications « devant l'échiquier », comme un joueur.
 *
 *   node scripts/review-boards.mjs reports/partie-commentee-XXXX.json [--out dossier]
 * (le site doit tourner sur http://localhost:6400)
 */

import { mkdirSync, readFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { chromium } from 'playwright';
import { fromFrenchSan } from '../coach/notation.mjs';

const args = process.argv.slice(2);
const src = JSON.parse(readFileSync(args[0], 'utf8'));
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : `reports/planches-${Date.now()}`;
mkdirSync(out, { recursive: true });

/** Coup conseillé : le premier coup cité après « Coup conseillé ». */
function advisedMove(advice, fen) {
  const part = advice.split(/Coup conseillé/i)[1] ?? '';
  for (const m of part.matchAll(/(?:\d+\.+\s*)?(O-O(?:-O)?|[RDTFC]?[a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?)/g)) {
    try {
      const mv = new Chess(fen).move(fromFrenchSan(m[1]));
      if (mv) return { from: mv.from, to: mv.to, san: m[1] };
    } catch { /* suivant */ }
  }
  return null;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 560, height: 560 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:6400/index.html');
for (const t of src.turns) {
  const adv = advisedMove(t.advice, t.fen);
  const playedMv = (() => { try { return new Chess(t.fen).move(fromFrenchSan(t.played)); } catch { return null; } })();
  const orientation = t.fen.split(' ')[1] === 'w' ? 'white' : 'black';
  await page.evaluate(async ({ fen, adv, played, orientation }) => {
    const { renderFenBoard } = await import('/board-view.js');
    document.body.innerHTML = '<div id="rv" class="board" style="width:540px;height:540px;margin:10px"></div>';
    const arrows = [];
    if (adv) arrows.push({ color: 'G', from: adv.from, to: adv.to });
    if (played && (!adv || played.from !== adv.from || played.to !== adv.to)) arrows.push({ color: 'R', from: played.from, to: played.to });
    renderFenBoard(document.getElementById('rv'), fen, { orientation, drawables: { arrows } });
  }, { fen: t.fen, adv, played: playedMv ? { from: playedMv.from, to: playedMv.to } : null, orientation });
  await page.waitForTimeout(150);
  await page.locator('#rv').screenshot({ path: `${out}/coup-${String(t.n).padStart(2, '0')}.png` });
  console.log(`coup ${t.n} : conseillé ${adv?.san ?? '—'} (vert), joué ${t.played} (rouge si différent)`);
}
await browser.close();
console.log(`Planches : ${out}`);
