/**
 * Relecture des fiches du banc par Fable (4 octobre 2026) : pour chaque fiche d'un banc chronométré (coach-timing),
 * une image de la position, la FEN, le trait et le texte de la fiche ; Fable liste les erreurs GRAVES (affirmation
 * fausse sur l'échiquier, conseil qui perd du matériel ou le mat, menace inventée) et mineures. Une fiche à la fois.
 *   node scripts/fiches-fable.mjs reports/timing-xxx.json <dossier images> <sortie.json> [--max N]
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const [timing, dir, out] = process.argv.slice(2);
const MAX = Number(process.argv.includes('--max') ? process.argv[process.argv.indexOf('--max') + 1] : 1000);
const FROM = Number(process.argv.includes('--from') ? process.argv[process.argv.indexOf('--from') + 1] : 0); // reprise après une coupure
const allRows = JSON.parse(readFileSync(timing, 'utf8')).rows;
const rows = allRows.slice(FROM, MAX);
mkdirSync(dir, { recursive: true });
// Une page avec un échiquier par fiche (glyphes pleins colorés par le remplissage), capturée carte par carte.
const G = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const board = (fen) => {
  const rows8 = fen.split(' ')[0].split('/'); let s = '<svg viewBox="0 0 8.6 8.6" width="520" height="520" xmlns="http://www.w3.org/2000/svg">';
  rows8.forEach((rk, r) => { let c = 0; for (const ch of rk) { if (/\d/.test(ch)) { c += Number(ch); continue; }
    const w = ch === ch.toUpperCase(); s += `<rect x="${c + 0.3}" y="${r}" width="1" height="1" fill="${(r + c) % 2 === 0 ? '#ece4d1' : '#9aa37a'}"/><text x="${c + 0.8}" y="${r + 0.82}" font-size="0.85" text-anchor="middle" fill="${w ? '#fff' : '#111'}" stroke="${w ? '#222' : '#000'}" stroke-width="0.03" font-family="DejaVu Sans, Segoe UI Symbol, sans-serif">${G[ch.toLowerCase()]}</text>`; c++; } });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (!(((r + c) % 2 === 0))) {} 
  // cases vides : fond
  let bg = '';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) bg += `<rect x="${c + 0.3}" y="${r}" width="1" height="1" fill="${(r + c) % 2 === 0 ? '#ece4d1' : '#9aa37a'}"/>`;
  s = s.replace('xmlns="http://www.w3.org/2000/svg">', 'xmlns="http://www.w3.org/2000/svg">' + bg);
  for (let r = 0; r < 8; r++) s += `<text x="0.1" y="${r + 0.62}" font-size="0.3" fill="#444">${8 - r}</text>`;
  'abcdefgh'.split('').forEach((l, c) => { s += `<text x="${c + 0.8}" y="8.42" font-size="0.3" text-anchor="middle" fill="#444">${l}</text>`; });
  return s + '</svg>';
};
const html = `<!doctype html><meta charset="utf-8"><style>body{background:#fff;margin:0}article{width:560px;padding:20px;background:#fff}p{font:16px system-ui;margin:8px 0 0}</style>` +
  rows.map((r, k) => { const i = FROM + k; return `<article id="f${i}">${board(r.fen)}<p>Trait aux ${r.fen.split(' ')[1] === 'w' ? 'Blancs' : 'Noirs'} — ${r.fen}</p></article>`; }).join('');
writeFileSync(`${dir}/fiches.html`, html);
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 700, height: 800 }, deviceScaleFactor: 2 });
await page.goto('file://' + resolve(`${dir}/fiches.html`)); await page.waitForTimeout(500);
for (let k = 0; k < rows.length; k++) { const i = FROM + k; const el = page.locator(`#f${i}`); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `${dir}/f${i}.png` }); }
await browser.close(); console.log(`${rows.length} images`);
const results = []; let erreurs = 0;
for (let k = 0; k < rows.length; k++) {
  const i = FROM + k; const r = rows[k]; const side = r.fen.split(' ')[1] === 'w' ? 'les Blancs' : 'les Noirs';
  if (erreurs >= 3) { results.push({ i, name: r.name, fen: r.fen, advice: r.advice, graves: null, texte: 'non soumis' }); continue; }
  const prompt = `Regarde l'image ${resolve(dir)}/f${i}.png avec l'outil Read : c'est une position d'échecs. Trait aux ${side}. FEN exacte : ${r.fen}.
Voici la fiche qu'un coach d'échecs pour débutants affiche sur cette position (elle tutoie le joueur qui a le trait) :
« ${r.advice} »
Ta tâche : vérifier chaque affirmation de la fiche sur l'échiquier (pièces, cases, attaques, défenses, évaluation du conseil). Une erreur GRAVE est : une affirmation fausse sur la position (pièce ou case qui n'existe pas, attaque ou défense inexistante), un conseil qui perd du matériel ou qui tombe dans un mat, une menace inventée. Une erreur MINEURE est une imprécision, un mot mal choisi, une phrase inutile.
Réponds en français. Première ligne exactement « GRAVES : n » (n = nombre d'erreurs graves, 0 si aucune). Puis une ligne par erreur : « GRAVE : <phrase de la fiche> → <pourquoi, en lisant la position> » ou « MINEURE : <phrase> → <pourquoi> ». Si tout est juste, écris une ligne « RAS » après la première.`;
  const t0 = Date.now(); let text;
  try { text = execFileSync('claude', ['-p', '--model', 'fable', '--allowedTools', 'Read', '--permission-mode', 'dontAsk', '--max-turns', '3', prompt], { encoding: 'utf8', timeout: 240000, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { text = `ERREUR : ${e.message.slice(0, 200)}`; }
  erreurs = text.startsWith('ERREUR') ? erreurs + 1 : 0;
  const graves = text.startsWith('ERREUR') ? null : Number(text.trim().match(/^GRAVES\s*:\s*(\d+)/i)?.[1] ?? NaN);
  writeFileSync(`${dir}/f${i}.txt`, text);
  results.push({ i, name: r.name, fen: r.fen, advice: r.advice, graves, secondes: Math.round((Date.now() - t0) / 1000), texte: text.trim() });
  console.log(`${i + 1}/${allRows.length} ${r.name.slice(0, 50)} : graves ${graves ?? 'erreur'} (${Math.round((Date.now() - t0) / 1000)} s)`);
  writeFileSync(out, JSON.stringify(results, null, 1));
}
const ok = results.filter((x) => typeof x.graves === 'number');
console.log(`\n${ok.length} fiches relues, ${ok.filter((x) => x.graves === 0).length} sans erreur grave, ${ok.reduce((a, x) => a + x.graves, 0)} graves signalées, ${results.length - ok.length} non relues`);
console.log('TERMINÉ');
