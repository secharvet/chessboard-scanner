/**
 * Vérification navigateur : libellé du coach, panneau positionnel, erreurs console.
 *   node scripts/check-coach-ui.mjs
 */
import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage();
const logs = [];
p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
await p.goto(`http://localhost:${process.env.WEB_PORT ?? 6400}/play.html`);
await p.waitForTimeout(3000);
console.log('Statut coach :', await p.locator('#mentorStatus').innerText());
console.log('Panneau positionnel :', JSON.stringify((await p.locator('#positionalPanel').innerText()).slice(0, 300)));
console.log('Erreurs :', logs.length ? logs.join('\n') : 'aucune');
await b.close();
