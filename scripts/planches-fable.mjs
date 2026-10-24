/**
 * Essai (4 octobre 2026, idée de l'auteur) : soumettre des planches à Fable UNE À LA FOIS, en image, avec la
 * définition du concept et la question, et recueillir son verdict. Sortie : <dossier>/<id>.txt et un JSON récapitulatif.
 *   node scripts/planches-fable.mjs <dossier des captures> <clé.json> <tirage.json> <sortie.json> id1 id2 …
 * Le tirage sert à donner aussi, en texte, la position avant et après le coup clé (FEN) : l'image ne montre pas la
 * pièce prise au coup clé (essai sur 5 planches : Fable l'a signalé lui-même).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { makeFens, DEF, consigne, lireVerdict } from './lib/planches-commun.mjs';
const [dir, cleFile, tirageFile, out, ...ids] = process.argv.slice(2);
const key = JSON.parse(readFileSync(cleFile, 'utf8'));
const tirage = JSON.parse(readFileSync(tirageFile, 'utf8'));
const fens = makeFens(key, tirage);
void DEF;
const results = [];
let erreurs = 0;
for (const id of ids) {
  if (erreurs >= 3) { console.log(`${id}: non soumis (trois erreurs de suite : quota ou panne)`); results.push({ id, concept: id.replace(/-\d+$/, ''), programme: key[id]?.kind, fable: 'non soumis', texte: '' }); continue; }
  const concept = id.replace(/-\d+$/, '');
  const f = fens(id);
  const prompt = consigne(id, dir, f, concept, `Regarde l'image ${dir}/${id}.png (lis-la avec l'outil Read).`);
  const t0 = Date.now();
  let text;
  try {
    text = execFileSync('claude', ['-p', '--model', 'fable', '--allowedTools', 'Read', '--permission-mode', 'dontAsk', '--max-turns', '3', prompt], { encoding: 'utf8', timeout: 240000, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { text = `ERREUR : ${e.message}`; }
  // Le verdict se lit en TÊTE de la réponse, jamais dans l'écho de la consigne (série 3 : 57 appels en erreur ont été
  // comptés « oui » parce que la consigne contient « VERDICT : oui »).
  erreurs = text.startsWith('ERREUR') ? erreurs + 1 : 0;
  const verdict = lireVerdict(text);
  writeFileSync(`${dir}/${id}.txt`, text);
  results.push({ id, concept, programme: key[id]?.kind, raisonProgramme: key[id]?.raison ?? null, fable: verdict, secondes: Math.round((Date.now() - t0) / 1000), texte: text.trim() });
  console.log(`${id}: programme ${key[id]?.kind} | Fable ${verdict} (${Math.round((Date.now() - t0) / 1000)} s)`);
}
writeFileSync(out, JSON.stringify(results, null, 1));
