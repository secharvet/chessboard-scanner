#!/usr/bin/env node
/**
 * Inspection JS (défaut) — Chromium headless, console + métriques légères.
 * Pas de capture d’écran (voir screenshot-all.mjs, ponctuel).
 *
 *   npm run check
 *   npm run check -- /play.html
 *   HEADED=1 npm run check
 *   BASE=http://localhost:6400 WAIT_MS=4000 npm run check
 */

import { chromium } from 'playwright';

const base = (process.env.BASE || 'http://localhost:6400').replace(/\/$/, '');
const headed = process.env.HEADED === '1' || process.env.HEADED === 'true';
const waitMs = Number(process.env.WAIT_MS || 3000);

const paths = process.argv.slice(2);
const urls = paths.length
  ? paths.map((p) => (p.startsWith('http') ? p : `${base}${p.startsWith('/') ? p : `/${p}`}`))
  : [`${base}/`, `${base}/play.html`];

/** @type {{ url: string, kind: string, text: string }[]} */
const issues = [];

function track(url, kind, text) {
  issues.push({ url, kind, text });
  console.error(`[${kind}]`, text);
}

const browser = await chromium.launch({ headless: !headed });

for (const url of urls) {
  console.log(`\n=== ${url} ===\n`);

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', (err) => {
    const text = err.stack || err.message;
    track(url, 'pageerror', text);
  });

  page.on('console', (msg) => {
    const type = msg.type();
    if (type !== 'error' && type !== 'warning') return;
    const loc = msg.location();
    const where =
      loc?.url && loc.lineNumber
        ? ` @ ${loc.url}:${loc.lineNumber}:${loc.columnNumber ?? 0}`
        : '';
    track(url, `console.${type}`, msg.text() + where);
  });

  page.on('requestfailed', (req) => {
    track(
      url,
      'network',
      `${req.method()} ${req.url()} — ${req.failure()?.errorText ?? 'failed'}`,
    );
  });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
  } catch (e) {
    track(url, 'goto', e.message);
  }

  await page.waitForTimeout(waitMs);

  const metrics = await page.evaluate(() => ({
    boardPx: Math.round(document.querySelector('.fen-board')?.getBoundingClientRect?.()?.width ?? 0),
    boot: document.getElementById('bootError')?.textContent?.trim() || null,
    engine: document.getElementById('engineStatus')?.textContent ?? null,
    status: document.getElementById('playStatus')?.textContent ?? null,
  }));

  console.log('[metrics]', JSON.stringify(metrics, null, 2));

  if (metrics.boot) track(url, 'boot', metrics.boot);
  if (url.includes('play') && metrics.boardPx === 0) {
    track(url, 'layout', 'échiquier absent (boardPx=0)');
  }
}

await browser.close();

const n = issues.length;
if (n === 0) {
  console.log('\nOK — aucune erreur JS ni alerte layout.');
  process.exit(0);
}

console.error(`\nÉCHEC — ${n} problème(s). Pas de screenshot (npm run screenshot si besoin visuel).`);
process.exit(1);
