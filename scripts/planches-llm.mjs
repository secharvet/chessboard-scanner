/**
 * Juge de planches par un modèle d'API (compatible OpenAI, images jointes en base64) : même protocole que
 * planches-fable.mjs, pour comparer plusieurs modèles sur les mêmes planches (5 octobre 2026, idée de l'auteur :
 * le catalogue Nvidia offre une vingtaine de modèles gratuits pendant six mois, 40 requêtes par minute).
 *   node scripts/planches-llm.mjs --provider nvidia --model deepseek-ai/deepseek-v4.1-flash [--rpm 30] [--no-image] \
 *        <dossier des captures> <clé.json> <tirage.json> <sortie.json> id1 id2 …
 * Sortie : même forme que Fable (`verdict`, et `fable` recopié pour les bilans existants), plus `modele`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { complete, llmConfig } from '../coach/llm.mjs';
import { makeFens, consigne, lireVerdict } from './lib/planches-commun.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const provider = opt('--provider', 'nvidia');
const model = opt('--model', '');
const rpm = Number(opt('--rpm', '30'));
const noImage = args.includes('--no-image') ? (args.splice(args.indexOf('--no-image'), 1), true) : false;
const [dir, cleFile, tirageFile, out, ...ids] = args;
const cfg = { ...llmConfig({ ...process.env, LLM_PROVIDER: provider, LLM_BASE_URL: process.env.LLM_BASE_URL ?? '' }), ...(model ? { model } : {}) };
if (!cfg.apiKey) { console.error(`clé manquante pour ${provider} (NVIDIA_API_KEY ou LLM_API_KEY dans .env)`); process.exit(2); }
const key = JSON.parse(readFileSync(cleFile, 'utf8'));
const tirage = JSON.parse(readFileSync(tirageFile, 'utf8'));
const fens = makeFens(key, tirage);
const results = [];
let erreurs = 0;
const minGap = 60_000 / Math.max(1, rpm);
let last = 0;
for (const id of ids) {
  const concept = id.replace(/-\d+$/, '');
  if (erreurs >= 3) { console.log(`${id}: non soumis (trois erreurs de suite)`); results.push({ id, concept, programme: key[id]?.kind, modele: cfg.model, verdict: 'non soumis', fable: 'non soumis', texte: '' }); continue; }
  const f = fens(id);
  const hint = noImage ? 'Tu ne vois pas l\'image : juge sur les positions FEN et la suite données ci-dessous.' : 'L\'image jointe est une capture de la planche.';
  const prompt = consigne(id, dir, f, concept, hint);
  const wait = minGap - (Date.now() - last);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const t0 = Date.now(); last = t0;
  let text;
  try {
    text = await complete({ system: 'Tu es un juge d\'échecs rigoureux. Tu réponds en français, verdict en première ligne.', user: prompt, images: noImage ? [] : [{ path: `${dir}/${id}.png` }] }, cfg, { maxTokens: 1200, temperature: 0.2 });
    if (!text) text = 'ERREUR : réponse vide';
  } catch (e) { text = `ERREUR : ${e.message}`; }
  erreurs = text.startsWith('ERREUR') ? erreurs + 1 : 0;
  const verdict = lireVerdict(text);
  const slug = cfg.model.replace(/[^a-z0-9]+/gi, '_');
  writeFileSync(`${dir}/${id}.${slug}.txt`, text);
  results.push({ id, concept, programme: key[id]?.kind, raisonProgramme: key[id]?.raison ?? null, modele: cfg.model, verdict, fable: verdict, secondes: Math.round((Date.now() - t0) / 1000), texte: text.trim() });
  console.log(`${id}: programme ${key[id]?.kind} | ${cfg.model} ${verdict} (${Math.round((Date.now() - t0) / 1000)} s)`);
}
writeFileSync(out, JSON.stringify(results, null, 1));
