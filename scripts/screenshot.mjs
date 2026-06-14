import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const url = process.env.URL || 'http://localhost:6400/';
const outDir = new URL('../screenshots', import.meta.url);
const viewport = {
  width: Number(process.env.W || 1440),
  height: Number(process.env.H || 900),
};

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport });
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(800);

const tag = process.env.TAG || 'full';
const path = new URL(`../screenshots/${tag}-${viewport.width}x${viewport.height}.png`, import.meta.url);

await page.screenshot({ path: path.pathname, fullPage: true });

const metrics = await page.evaluate(() => {
  const board = document.querySelector('.fen-board');
  const card = document.querySelector('.left .card');
  const layout = document.querySelector('.layout');
  const br = (el) => (el ? el.getBoundingClientRect() : null);
  return {
    layout: br(layout),
    card: br(card),
    board: br(board),
    boardPx: board ? Math.round(board.width) : 0,
    boardOuter: br(document.querySelector('.board'))?.width,
  };
});

console.log(JSON.stringify({ saved: path.pathname, viewport, metrics }, null, 2));
await browser.close();
