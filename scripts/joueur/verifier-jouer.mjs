#!/usr/bin/env node
/**
 * Vérification Chromium sans tête de `jouer.html` (ordinateur 1440 px ET téléphone 390 px) avec un serveur FACTICE qui
 * rejoue un scénario : /api/auth/moi (enseignant), /api/joueur/en-cours (partie en cours), /api/joueur/en-cours/flux (SSE :
 * debut → coup coach → coup adverse → examen → fin), /api/joueur/parties (liste). Vérifie : panneau de lancement visible,
 * échiquier, phrase du coach, « pourquoi » dépliable, bloc de fin avec lien vers le lecteur, pas d'erreur ni de débordement.
 *   node scripts/joueur/verifier-jouer.mjs
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const RACINE = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
const TYPES = { html: 'text/html', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', svg: 'image/svg+xml', map: 'application/json' };
const sse = (res, o) => res.write(`data: ${JSON.stringify(o)}\n\n`);

const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
// Coup du coach de la forme « arbre » (joueur-arbre) : nœud, candidats comparés, coup écarté dit au conditionnel.
const coupCoach = { ply: 1, camp: 'w', san: 'e4', uci: 'e2e4', coach: true, noeud: '3L', sorte: '3L', raison: 'occupe le centre et ouvre la diagonale du fou roi', phrase: 'Occupe le centre et ouvre la diagonale du fou roi. J\'ai pensé à Cc3. Mais il répondait 1.Cc3 Fb4, et je perdais un pion. Avec e4, rien de tel.', ligne: ['e4', 'e5'], candidats: [{ san: 'e4', coup: 'e2e4', noeud: '3L', raison: 'occupe le centre et ouvre la diagonale du fou roi', score: 56, ligne: ['e4', 'e5'] }, { san: 'Cf3', coup: 'g1f3', noeud: '3C', raison: 'je développe en attaquant', score: 40, ligne: ['Cf3'] }], choisi: 'e2e4', ecarte: { san: 'Cc3', coup: 'b1c3', raison: 'je développe', ligne: ['Cc3', 'Fb4'], pvUci: ['b1c3', 'f8b4'], perte: 'un pion', mat: false }, trou: null, profondeur: 6, noeuds: 120000, ms: 3000 };
const coupAdv = { ply: 2, camp: 'b', san: 'e5', uci: 'e7e5', coach: false };

const serveur = createServer(async (req, res) => {
  const chemin = decodeURIComponent(req.url.split('?')[0]);
  if (chemin === '/api/auth/moi') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, utilisateur: { id: 1, role: 'enseignant', display_name: 'Prof' } })); return; }
  if (chemin === '/api/joueur/en-cours') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, enCours: true, id: '20261024T120000-maia-1500-w', adversaire: { nom: 'maia-1500' }, camp: 'w', coups: [] })); return; }
  if (chemin === '/api/joueur/parties') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, parties: [{ id: '20261024T110000-maia-1500-b', resultat: '0-1', raison: 'mat' }] })); return; }
  // à la fin, la page recharge le fichier de partie écrit (pour le récit complet avec l'examen) : on le sert comme le conteneur.
  if (chemin === '/parties/20261024T120000-maia-1500-w.json') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ id: '20261024T120000-maia-1500-w', coach: { camp: 'w', budget: 200000, code: 'test' }, adversaire: { nom: 'maia-1500' }, depart: DEPART, coups: [coupCoach, coupAdv], resultat: '1-0', raison: 'mat', plies: 2, examen: { coups: 1, bevues: 0, fautes: 0, exclus: 0, profondeur: 18 } })); return; }
  if (chemin === '/api/joueur/en-cours/flux') {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive' });
    sse(res, { ev: 'debut', id: '20261024T120000-maia-1500-w', adversaire: { nom: 'maia-1500' }, camp: 'w', depart: DEPART });
    setTimeout(() => sse(res, { ev: 'coup', coup: coupCoach }), 150);
    setTimeout(() => sse(res, { ev: 'coup', coup: coupAdv }), 300);
    setTimeout(() => sse(res, { ev: 'examen', examen: { bevues: 0, coups: 1 } }), 450);
    setTimeout(() => { sse(res, { ev: 'fin', id: '20261024T120000-maia-1500-w', resultat: '1-0', raison: 'mat', plies: 2 }); res.end(); }, 600);
    return;
  }
  if (chemin.startsWith('/api/')) { res.writeHead(200, { 'content-type': 'application/json' }); res.end('null'); return; } // ex. /api/acces de site-nav
  const local = chemin === '/vendor/chess.js' ? `${RACINE}/vendor/chess.js` : `${RACINE}${chemin}`;
  try { const buf = await readFile(local); res.writeHead(200, { 'content-type': TYPES[local.split('.').pop()] ?? 'application/octet-stream' }); res.end(buf); }
  catch { res.writeHead(404); res.end('introuvable'); }
});

await new Promise((r) => serveur.listen(0, r));
const base = `http://127.0.0.1:${serveur.address().port}`;
const browser = await chromium.launch();
const problemes = [];

async function verifier(largeur) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur <= 800 ? 844 : 900 } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(`pageerror : ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`console : ${m.text().slice(0, 160)}`); });
  page.on('requestfailed', (r) => { const u = r.url(); if (!/favicon/.test(u)) erreurs.push(`requête échouée : ${u.replace(base, '')}`); });
  page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) erreurs.push(`ressource ${r.status()} : ${r.url().replace(base, '')}`); });

  await page.goto(`${base}/jouer.html`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200); // laisse le scénario SSE se dérouler jusqu'à « fin »

  for (const sel of ['.site-nav', '#jouLancement', '#jouJoueur', '#jouBoard .fen-board', '#jouCoups .jpt__coup--coach', '#jouFin']) if ((await page.locator(sel).count()) === 0) erreurs.push(`attendu absent : ${sel}`);
  if ((await page.locator('#jouJoueur option[value="arbre"]').count()) === 0) erreurs.push('choix « joueur : arbre » absent');
  if (await page.locator('#jouLancement').isHidden()) erreurs.push('panneau de lancement caché (enseignant attendu)');
  // Le panneau suit le DERNIER coup (adversaire en fin de scénario) ; on clique le coup du coach pour revoir sa phrase.
  await page.locator('#jouCoups .jpt__coup--coach').first().click().catch(() => {});
  if (!/centre/.test(await page.locator('#jouPhrase').innerText().catch(() => ''))) erreurs.push('phrase du coach absente');
  await page.locator('#jouPourquoi').click().catch(() => {});
  if (!(await page.locator('#jouTrace .jpt__trace-liste').isVisible().catch(() => false))) erreurs.push('trace « pourquoi » non dépliée');
  if (!/partie\.html/.test(await page.locator('#jouFin').innerHTML().catch(() => ''))) erreurs.push('lien vers le lecteur absent à la fin');
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (debord > 2) erreurs.push(`débordement horizontal : ${debord}px`);

  console.log(`${erreurs.length ? '✗' : '✓'} ${largeur}px — ${erreurs.length} problème(s)`);
  for (const e of erreurs) { console.log(`    ${e}`); problemes.push(e); }
  await ctx.close();
}

await verifier(1440);
await verifier(390);
await browser.close();
serveur.close();
console.log(`\n${problemes.length} problème(s)`);
process.exit(problemes.length ? 1 : 0);
