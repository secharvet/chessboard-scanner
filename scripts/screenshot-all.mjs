#!/usr/bin/env node
/**
 * Vérification visuelle PONCTUELLE (lourd : 2 pages + PNG fullPage).
 * Au quotidien : npm run check
 *
 *   SCREENSHOT=1 npm run screenshot
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

if (process.env.SCREENSHOT !== '1') {
  console.error('Screenshot désactivé par défaut (Playwright + PNG = coûteux).');
  console.error('Inspection JS :  npm run check');
  console.error('Capture visuelle : SCREENSHOT=1 npm run screenshot');
  process.exit(1);
}

const base = process.env.BASE || 'http://localhost:6400';
await mkdir('screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const { tag, url } of [
  { tag: 'lecteur', url: `${base}/` },
  { tag: 'jouer', url: `${base}/play.html` },
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
  await page.waitForTimeout(Number(process.env.WAIT_MS || 3000));

  const metrics = await page.evaluate(() => ({
    boardPx: Math.round(document.querySelector('.fen-board')?.getBoundingClientRect?.()?.width ?? 0),
    boot: document.getElementById('bootError')?.textContent,
    engine: document.getElementById('engineStatus')?.textContent,
    status: document.getElementById('playStatus')?.textContent,
  }));

  const path = `screenshots/${tag}-6400.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(JSON.stringify({ path, url, metrics, errors }, null, 2));
}

await browser.close();
