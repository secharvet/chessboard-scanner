/**
 * Accord entre les arbres appris et les commentaires des maîtres (Chernev).
 * Entrées : les grains annotés (grains-annotes.mjs), les fenêtres faites avec le vocabulaire du modèle (dataset.py
 * --vocab --keep-all --stride 1), le plongement (plonger.py) et les noms des arbres. Pour chaque demi-coup commenté qui
 * clôt une fenêtre, on met côte à côte le commentaire du maître et le nom + sens de l'arbre, et un LLM juge à l'aveugle :
 * même idée (oui), idée voisine (partiel), rien à voir (non). Sortie : JSON + Markdown avec le taux d'accord.
 *   node scripts/arbres/accord-chernev.mjs <grains-annotes.jsonl> <windows.meta.jsonl> <plonge.json> <noms.json> <sortie>
 * (plonge.json : {arbre:[...], cos:[...]} exporté de plonger.py en JSON)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { complete, llmConfig } from '../../coach/llm.mjs';
const [grainsFile, metaFile, plongeFile, nomsFile, out] = process.argv.slice(2);
const games = Object.fromEntries(readFileSync(grainsFile, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((g) => [g.id, g]));
const meta = readFileSync(metaFile, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const plonge = JSON.parse(readFileSync(plongeFile, 'utf8'));
const noms = JSON.parse(readFileSync(nomsFile, 'utf8'));
const provider = process.env.ARBRES_PROVIDER || (process.env.GROQ_API_KEY ? 'groq' : 'claude-cli');
const cfg = llmConfig({ ...process.env, LLM_PROVIDER: provider, LLM_MODEL: provider === 'groq' ? 'openai/gpt-oss-120b' : provider === 'claude-cli' ? 'fable' : (process.env.LLM_MODEL || '') });
const paires = [];
for (const [i, m] of meta.entries()) {
  const [gid, end, me] = m; const g = games[gid]; if (!g) continue;
  const node = g.nodes[end - 1]; if (!node?.com || node.s !== me) continue; // le commentaire porte sur le dernier coup de la fenêtre, joué par « moi »
  const arbre = plonge.arbre[i]; const nom = noms[arbre];
  if (!nom?.nom || nom.nom === "pas d'idée commune") continue;
  paires.push({ partie: gid, fin: end, coup: node.san, commentaire: node.com, arbre, nom: nom.nom, sens: nom.sens, cos: plonge.cos[i] });
}
console.log(`${paires.length} paires commentaire / arbre`);
const res = [];
for (const [k, p] of paires.entries()) {
  const prompt = `Un maître d'échecs a commenté le coup ${p.coup} : « ${p.commentaire} ».
Un programme a classé la séquence de jeu qui mène à ce coup dans un groupe nommé « ${p.nom} » : ${p.sens}
Question : le commentaire du maître et le nom du groupe parlent-ils de la même idée ? Réponds en JSON strict : {"accord": "oui|partiel|non", "pourquoi": "une phrase"}.
oui = même idée stratégique ou tactique ; partiel = idées voisines ou l'une contient l'autre ; non = rien à voir.`;
  let j = { accord: 'erreur', pourquoi: '' };
  try { const t = await complete({ system: 'Tu es un arbitre neutre. JSON strict.', user: prompt }, cfg, { think: 'low', maxTokens: 200, temperature: 0 }); j = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch (e) { j.pourquoi = e.message.slice(0, 80); }
  res.push({ ...p, ...j });
  if ((k + 1) % 20 === 0) console.log(`${k + 1}/${paires.length}`);
}
const n = res.filter((r) => r.accord !== 'erreur').length;
const c = (v) => res.filter((r) => r.accord === v).length;
const md = [`# Accord arbres appris / commentaires de Chernev`, '', `${n} paires jugées : oui ${c('oui')} (${Math.round(100 * c('oui') / Math.max(1, n))} %), partiel ${c('partiel')} (${Math.round(100 * c('partiel') / Math.max(1, n))} %), non ${c('non')} (${Math.round(100 * c('non') / Math.max(1, n))} %).`, '',
  '| Partie | Coup | Commentaire du maître | Arbre | Accord | Pourquoi |', '|---|---|---|---|---|---|'];
for (const r of res) md.push(`| ${r.partie} | ${r.fin} ${r.coup} | ${r.commentaire.slice(0, 120)} | ${r.nom} | ${r.accord} | ${(r.pourquoi || '').slice(0, 100)} |`);
writeFileSync(out + '.json', JSON.stringify(res, null, 1)); writeFileSync(out + '.md', md.join('\n') + '\n');
console.log(md[2]);
