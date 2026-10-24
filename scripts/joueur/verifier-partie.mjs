#!/usr/bin/env node
/**
 * Vérification Chromium sans tête du lecteur `partie.html` (ordinateur 1440 px ET téléphone 390 px) : pas d'erreur JS, les
 * éléments clés présents, « pourquoi » et l'examen qui se déplient, le mode lecture qui démarre, pas de débordement
 * horizontal au téléphone. Sert le worktree avec `/vendor/chess.js` (comme le conteneur). Nécessite une partie examinée
 * dans `parties/` (voir --partie).
 *   node scripts/joueur/verifier-partie.mjs [--partie <id>]
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const RACINE = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
const args = process.argv.slice(2);
const PARTIE = args.includes('--partie') ? args[args.indexOf('--partie') + 1] : '2026-10-24-maia-w-03';
const TYPES = { html: 'text/html', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', svg: 'image/svg+xml', map: 'application/json', woff2: 'font/woff2' };

const serveur = createServer(async (req, res) => {
  let chemin = decodeURIComponent(req.url.split('?')[0]);
  // site-nav interroge /api/auth/moi et /api/acces ; sans serveur, on répond « null » (il dégrade proprement) pour éviter un 404.
  if (chemin.startsWith('/api/')) { res.writeHead(200, { 'content-type': 'application/json' }); res.end('null'); return; }
  const local = chemin === '/vendor/chess.js' ? `${RACINE}/vendor/chess.js` : `${RACINE}${chemin}`;
  try {
    const buf = await readFile(local);
    res.writeHead(200, { 'content-type': TYPES[local.split('.').pop()] ?? 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('introuvable'); }
});

await new Promise((r) => serveur.listen(0, r));
const base = `http://127.0.0.1:${serveur.address().port}`;
const browser = await chromium.launch();
const problemes = [];

async function verifier(largeur) {
  const tel = largeur <= 800;
  const ctx = await browser.newContext({ viewport: { width: largeur, height: tel ? 844 : 900 } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(`pageerror : ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`console : ${m.text().slice(0, 160)}`); });
  page.on('requestfailed', (r) => { const u = r.url(); if (!/favicon|\/api\//.test(u)) erreurs.push(`requête échouée : ${u.replace(base, '')}`); });

  await page.goto(`${base}/partie.html?partie=${PARTIE}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  const attendus = ['.site-nav', '#jptBoard .fen-board', '#jptCoups .jpt__coup', '#jptPhrase', '#jptLectureStart'];
  for (const sel of attendus) if ((await page.locator(sel).count()) === 0) erreurs.push(`attendu absent : ${sel}`);

  // Aller au dernier coup du coach et déplier « pourquoi » puis l'examen.
  await page.locator('#jptCoups .jpt__coup--coach').last().click();
  await page.locator('#jptPourquoi').click();
  if (!(await page.locator('#jptTrace .jpt__trace-liste').isVisible())) erreurs.push('trace « pourquoi » non dépliée');
  await page.locator('#jptExamenToggle').click();
  if (!(await page.locator('#jptExamen .jpt__verdict').isVisible())) erreurs.push('examen non affiché');

  // Mode lecture : démarre et affiche une question.
  await page.locator('#jptLectureStart').click();
  if (!(await page.locator('#jptLecture .jpt__lecture-q').first().isVisible())) erreurs.push('mode lecture non démarré');

  // Pas de débordement horizontal.
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (debord > 2) erreurs.push(`débordement horizontal : ${debord}px`);

  console.log(`${erreurs.length ? '✗' : '✓'} ${largeur}px — ${erreurs.length} problème(s)`);
  for (const e of erreurs) { console.log(`    ${e}`); problemes.push({ largeur, e }); }
  await ctx.close();
}

await verifier(1440);
await verifier(390);
await browser.close();
serveur.close();
console.log(`\n${problemes.length} problème(s)`);
process.exit(problemes.length ? 1 : 0);
