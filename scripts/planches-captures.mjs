/**
 * Captures d'écran des planches (4 octobre 2026, essai « une planche à Fable ») : ouvre la page HTML autonome des
 * planches dans Chromium et enregistre chaque planche demandée (carte entière : échiquier au coup clé, suite, question).
 *   node scripts/planches-captures.mjs <page.html> <dossier> id1 id2 …
 */
import { chromium } from 'playwright';
import { resolve } from 'node:path';
const [page, dir, ...ids] = process.argv.slice(2);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 2 });
await p.goto('file://' + resolve(page), { waitUntil: 'load' });
await p.waitForTimeout(800);
for (const id of ids) {
  const card = p.locator(`#${id}`);
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  await card.screenshot({ path: `${dir}/${id}.png` });
  console.log('capture', id);
}
await browser.close();
