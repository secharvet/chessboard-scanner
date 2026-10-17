#!/usr/bin/env node
/**
 * Vérification des pages de la plateforme dans Chromium sans tête (17 octobre 2026) : erreurs JS, console, éléments clés.
 * Se connecte via l'API avec un compte de test, puis charge l'éditeur, l'administration, la connexion et l'assistant.
 *   node scripts/verifier-pages.mjs            (BASE=http://localhost:6400 par défaut : nginx direct, sans Caddy)
 */
import { chromium } from 'playwright';
const base = (process.env.BASE || 'http://localhost:6400').replace(/\/$/, '');
const compte = { email: process.env.EMAIL || 'prof-demo@demo.local', mot_de_passe: process.env.MDP || 'demo-demo-demo' };
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const problemes = []; let total = 0;
async function verifier(url, attentes = []) {
  const page = await ctx.newPage(); const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(`pageerror : ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`console : ${m.text().slice(0, 200)}`); });
  page.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) erreurs.push(`requête échouée : ${r.url().replace(base, '')} ${r.failure()?.errorText ?? ''}`); });
  const rep = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => ({ status: () => `erreur ${e.message}` }));
  await page.waitForTimeout(1500);
  const statut = rep.status(); const titre = await page.title().catch(() => '');
  for (const a of attentes) { const ok = typeof a === 'string' ? (await page.locator(a).count()) > 0 : await a(page); if (!ok) erreurs.push(`attendu absent : ${typeof a === 'string' ? a : a.name}`); }
  total++; console.log(`${erreurs.length ? '✗' : '✓'} ${statut} ${url.replace(base, '')} — « ${titre} »`);
  for (const e of erreurs) { console.log(`    ${e}`); problemes.push({ url, e }); }
  await page.close();
}
// connexion par l'API (cookie dans le contexte)
const r = await ctx.request.post(`${base}/api/auth/connexion`, { data: compte });
const j = await r.json().catch(() => ({})); console.log(j.ok ? `connecté : ${j.utilisateur.display_name} (${j.utilisateur.role})` : `connexion impossible : ${j.error}`);
const coups = encodeURIComponent('e4 e6 d4 d5');
await verifier(`${base}/connexion.html`, ['form#fConnexion']);
await verifier(`${base}/ouverture.html`, ['#ouvBoard .fen-board', '#ouvRecit']);
await verifier(`${base}/editeur.html?livre=francaise&coups=${coups}`, ['.fen-board', async function formulaire(p) { return (await p.locator('textarea, input[type=text]').count()) >= 2; }, async function cartesDeCoups(p) { const t = await p.locator('body').innerText(); return /e5/.test(t) && /Cc3|Nc3/.test(t); }]);
await verifier(`${base}/admin.html`, []);  // avec un simple enseignant : redirection vers la connexion attendue (pas une erreur)
// administration avec un compte admin
await ctx.request.post(`${base}/api/auth/deconnexion`);
const ra = await ctx.request.post(`${base}/api/auth/connexion`, { data: { email: process.env.EMAIL_ADMIN || 'admin-demo@demo.local', mot_de_passe: process.env.MDP_ADMIN || 'demo-demo-demo' } });
console.log((await ra.json()).ok ? 'connecté : admin' : 'admin : connexion impossible');
await verifier(`${base}/admin.html`, ['form#fInvite', 'tbody#comptes tr']);
await browser.close();
console.log(`\n${total} pages, ${problemes.length} problème(s)`); process.exit(problemes.length ? 1 : 0);
