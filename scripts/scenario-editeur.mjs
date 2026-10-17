#!/usr/bin/env node
/** Scénario réel dans Chromium : un enseignant écrit, annote, enregistre, publie ; on vérifie par l'API (17 octobre 2026).
 *   node scripts/scenario-editeur.mjs   (BASE, EMAIL, MDP comme verifier-pages.mjs)
 *   LARGEUR=390 : vérifie la lecture seule du téléphone (formulaire caché, message affiché), sans écrire. */
import { chromium } from 'playwright';
const base = (process.env.BASE || 'http://localhost:6400').replace(/\/$/, '');
const compte = { email: process.env.EMAIL || 'prof-demo@demo.local', mot_de_passe: process.env.MDP || 'demo-demo-demo' };
const largeur = Number(process.env.LARGEUR || 1440); const telephone = largeur <= 800;
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: largeur, height: Number(process.env.HAUTEUR || (telephone ? 844 : 900)) } });
const marque = `scénario ${new Date().toISOString().slice(11, 19)}`; const erreurs = [];
const r0 = await ctx.request.post(`${base}/api/auth/connexion`, { data: compte }); if (!(await r0.json()).ok) { console.log('connexion impossible'); process.exit(1); }
const page = await ctx.newPage(); page.on('pageerror', (e) => erreurs.push('pageerror : ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') erreurs.push('console : ' + m.text().slice(0, 160)); });
const coups = 'e4 e6 d4 d5 e5';
await page.goto(`${base}/editeur.html?livre=francaise&coups=${encodeURIComponent(coups)}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
// Téléphone : l'éditeur est en lecture seule par conception ; on vérifie cet état et on s'arrête là.
if (telephone) {
  if (!(await page.locator('.edi__telephone').isVisible())) erreurs.push('le message « édition sur ordinateur » n\'est pas affiché à 390 px');
  if (await page.locator('#fSens').isVisible()) erreurs.push('le formulaire d\'édition est visible à 390 px alors qu\'il devrait être caché');
  if (!(await page.locator('#ediBoard .fen-board').count())) erreurs.push('échiquier absent à 390 px');
  await browser.close();
  for (const e of erreurs) console.log('  ✗ ' + e);
  console.log(erreurs.length ? `${erreurs.length} problème(s)` : '✓ téléphone : lecture seule vérifiée'); process.exit(erreurs.length ? 1 : 0);
}
// 1. écrire le sens et un pourquoi
await page.fill('#fSens', `Texte d'essai : ${marque}.`);
const cartes = page.locator('#fCoups textarea, #fFautes textarea'); const nCartes = await cartes.count(); console.log('cartes (coups + fautes) :', await page.locator('#fCoups .ccoup').count(), '+', await page.locator('#fFautes .ccoup').count()); if (nCartes) await cartes.first().fill(`Pourquoi d'essai (${marque}).`);
// 2. surligner une case : d'abord « Effacer » (les clics sur une case déjà surlignée font tourner la couleur
// jusqu'au retrait ; le brouillon garde les annotations d'une passe à l'autre, on repart donc de zéro),
// puis mode « Surligner » et clic sur la case d4 (data-square)
await page.click('#ediEffacer').catch(() => erreurs.push('bouton Effacer introuvable'));
const btnSurligner = page.locator('#ediModes button', { hasText: /surligner/i }); if (await btnSurligner.count()) { await btnSurligner.first().click(); await page.locator('[data-square="d4"]').first().click(); } else erreurs.push('bouton Surligner introuvable');
// 3. enregistrer
await page.click('#btnEnregistrer'); await page.waitForTimeout(1500);
const etat1 = (await page.locator('#ediSauvegarde').innerText().catch(() => '')).trim();
const v1 = await (await ctx.request.get(`${base}/api/positions?livre=francaise&coups=${encodeURIComponent(coups)}`)).json();
const mien = v1.explications.find((e) => e.author.display_name === 'Prof Démo' && e.status === 'brouillon');
if (!mien) erreurs.push('aucun brouillon trouvé par l\'API après enregistrement');
else { if (!mien.content.sens.includes(marque)) erreurs.push('le sens enregistré ne contient pas la marque'); if (nCartes && !mien.content.coups.some((c) => (c.pourquoi || '').includes(marque))) erreurs.push('le pourquoi enregistré ne contient pas la marque'); const toutes = [...mien.content.annotations.map((a) => ({ ...a, sur: 'position' })), ...mien.content.coups.flatMap((c) => (c.annotations || []).map((a) => ({ ...a, sur: 'coup ' + c.move_id })))];
  const d4 = toutes.find((a) => a.type === 'case' && a.case === 'd4'); if (!d4) erreurs.push('la case d4 surlignée n\'est nulle part dans les annotations'); else console.log(`annotation d4 rattachée à : ${d4.sur} (${d4.couleur})`); }
// 4. publier
page.once('dialog', (d) => d.accept()); await page.click('#btnPublier'); await page.waitForTimeout(1500);
const anon = await browser.newContext(); const v2 = await (await anon.request.get(`${base}/api/positions?livre=francaise&coups=${encodeURIComponent(coups)}`)).json();
const publie = v2.explications.find((e) => e.author.display_name === 'Prof Démo' && e.status === 'publie');
if (!publie) erreurs.push('la version publiée n\'est pas visible anonymement'); else if (!publie.content.sens.includes(marque)) erreurs.push('la version publiée n\'a pas le bon texte');
await browser.close();
console.log(`cartes de coups : ${nCartes} ; indicateur après enregistrement : « ${etat1} » ; brouillon : ${mien ? 'oui' : 'non'} ; publié visible : ${publie ? 'oui' : 'non'}`);
for (const e of erreurs) console.log('  ✗ ' + e);
console.log(erreurs.length ? `${erreurs.length} problème(s)` : '✓ scénario complet réussi'); process.exit(erreurs.length ? 1 : 0);
