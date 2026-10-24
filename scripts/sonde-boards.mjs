/**
 * Planches de la sonde « échiquier seul » (docs/PLANS-ET-CONCEPTS.md, §9, étape 2 DENEB) : pour chaque
 * position où le réseau échiquier seul voit le plan que les arbres (faits du moteur de règles) ratent,
 * l'échiquier orienté du camp concerné, et une légende (Elo, scores et rangs des deux modèles, faits allumés).
 * La relecture dit ce que le réseau voit que nos règles ne voient pas.
 *
 *   node scripts/sonde-boards.mjs reports/sonde-echiquier.json [--per 8] [--out reports/planches-sonde]
 * (le site doit tourner sur http://localhost:6400)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PER = Number(opt('--per', 8));
const OUT = opt('--out', 'reports/planches-sonde');
const src = JSON.parse(readFileSync(args[0], 'utf8'));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 560, height: 560 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:6400/index.html');

const legend = ['# Sonde échiquier seul : positifs vus par le réseau, ratés par les arbres', ''];
for (const [concept, d] of Object.entries(src)) {
  const ex = (d.exemples ?? []).slice(0, PER);
  if (!ex.length) continue;
  legend.push(`## ${concept} (${d.sonde} positions retenues sur ${d.positifs_test} positifs de test)`, '');
  for (const [i, e] of ex.entries()) {
    const name = `${concept}-${String(i + 1).padStart(2, '0')}`;
    const orientation = e.side === 'w' ? 'white' : 'black';
    await page.evaluate(async ({ fen, orientation }) => {
      const { renderFenBoard } = await import('/board-view.js');
      document.body.innerHTML = '<div id="rv" class="board" style="width:540px;height:540px;margin:10px"></div>';
      renderFenBoard(document.getElementById('rv'), fen, { orientation });
    }, { fen: e.fen, orientation });
    await page.waitForTimeout(100);
    await page.locator('#rv').screenshot({ path: `${OUT}/${name}.png` });
    const mine = Object.keys(e.facts).filter((k) => k.endsWith(`|${e.side}`) || k.endsWith('|-')).map((k) => k.split('|')[0]);
    legend.push(
      `### ${name}`,
      `- FEN : \`${e.fen}\` — plan des ${e.side === 'w' ? 'Blancs' : 'Noirs'} (partie ${e.game}, demi-coup ${e.ply}, Elo ${e.elo ?? '?'})`,
      `- réseau échiquier seul : ${e.p_cnn} (rang ${e.rang_cnn}) ; arbres sur les faits : ${e.p_arbres} (rang ${e.rang_arbres})`,
      `- faits du camp : ${mine.join(', ') || '—'}`,
      '',
    );
    console.log(`${name} : rang cnn ${e.rang_cnn}, rang arbres ${e.rang_arbres}`);
  }
}
writeFileSync(`${OUT}/LEGENDE.md`, legend.join('\n'));
await browser.close();
console.log(`Planches : ${OUT}`);
