/**
 * Thèmes des commentaires des maîtres (nuit du 6 au 7 octobre 2026), par Fable (claude -p), lots de 30, reprise possible.
 *   node scripts/arbres/themes-fable.mjs data/reference/annotes [--worker k --of n] [--min-ply 15]
 * Sortie : <dir>/themes-fable.w<k>.jsonl : {id, ply, themes:[...]} ; les thèmes viennent de la liste THEMES (≤ 3 par commentaire).
 */
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { complete, llmConfig } from '../../coach/llm.mjs';
const args = process.argv.slice(2); const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DIR = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a)) ?? 'data/reference/annotes';
const WK = Number(opt('--worker', 0)); const OF = Number(opt('--of', 1)); const MINPLY = Number(opt('--min-ply', 15)); const LOT = Number(opt('--lot', 30));
const cfg = llmConfig({ ...process.env, LLM_PROVIDER: 'claude-cli', LLM_MODEL: 'fable' });
export const THEMES = ['attaque_roi', 'defense_roi', 'colonne_ouverte', 'structure_pions', 'case_faible_avant_poste', 'echange_pieces', 'developpement', 'centre_espace', 'levier_rupture', 'prophylaxie', 'manoeuvre', 'initiative_pression', 'tactique', 'finale', 'materiel', 'blocus', 'aile_dame', 'evaluation', 'erreur', 'autre'];
const DEF = `attaque_roi : attaque contre le roi adverse, mat, sacrifice d'attaque, ouverture des lignes vers le roi
defense_roi : sécurité de son propre roi, défense, abri, parer une attaque
colonne_ouverte : colonne ouverte ou semi-ouverte, tours sur la colonne, septième rangée, diagonale ouverte
structure_pions : structure de pions (isolé, doublé, arriéré, passé, majorité, chaîne, îlots)
case_faible_avant_poste : case faible, trou, avant-poste, pièce installée sur une case forte
echange_pieces : échanger ou garder une pièce (bon/mauvais fou, paire de fous, cavalier contre fou, simplifier)
developpement : développement, tempo, retard de développement, roquer tôt
centre_espace : centre, espace, contrôle du centre, pions centraux
levier_rupture : poussée de pion de rupture, levier, ouverture du jeu
prophylaxie : empêcher le plan adverse, restreindre, prévenir un coup
manoeuvre : manœuvre de pièce, regroupement, transfert d'une pièce vers une meilleure case
initiative_pression : initiative, pression, activité des pièces, forcer les événements
tactique : coup tactique concret (fourchette, clouage, découverte, combinaison, menace directe)
finale : technique de finale, activité du roi, pion passé en finale, opposition
materiel : gain ou perte de matériel, pion de plus, compensation
blocus : blocus, blocage d'un pion ou d'une position
aile_dame : jeu à l'aile dame, attaque de minorité, expansion sur l'aile dame
evaluation : seulement une évaluation (meilleur, égal, gagnant) sans raison stratégique
erreur : signale une erreur ou un meilleur coup, sans idée stratégique
autre : rien de ce qui précède (histoire, anecdote, calcul pur, phrase vide)`;
const rows = readFileSync(`${DIR}/coups.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const items = []; for (const r of rows) for (const c of r.commentaires) if (c.ply >= MINPLY) items.push({ id: r.id, ply: c.ply, san: c.san, text: c.text.slice(0, 600) });
const mine = items.filter((_, i) => i % OF === WK);
const OUT = `${DIR}/themes-fable.w${WK}.jsonl`; const done = new Set();
if (existsSync(OUT)) for (const l of readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean)) { const j = JSON.parse(l); done.add(`${j.id}:${j.ply}`); }
const todo = mine.filter((x) => !done.has(`${x.id}:${x.ply}`));
console.error(`worker ${WK}/${OF} : ${mine.length} commentaires, ${todo.length} à faire`);
let erreurs = 0;
for (let s = 0; s < todo.length; s += LOT) {
  const lot = todo.slice(s, s + LOT);
  const user = `Voici ${lot.length} commentaires de parties d'échecs annotées (anglais ou français), chacun attaché au coup qu'il suit. Pour chacun, donne les thèmes stratégiques dont parle le commentateur, parmi cette liste fermée (1 à 3 thèmes, les plus centraux d'abord) :\n${DEF}\n\nRéponds UNIQUEMENT par un tableau JSON : [{"n": 1, "themes": ["..."]}, ...], un objet par commentaire, dans l'ordre.\n\n` + lot.map((x, i) => `${i + 1}. (après ${x.san}) ${x.text}`).join('\n');
  let text;
  try { text = await complete({ system: 'Tu es un maître d\'échecs et un pédagogue. Tu classes des commentaires par thème. JSON strict.', user }, cfg, { think: 'low', maxTokens: 1500, temperature: 0 }); erreurs = 0; }
  catch (e) { console.error(`lot ${s}: ${e.message}`); if (++erreurs >= 5) process.exit(1); s -= LOT; await new Promise((r) => setTimeout(r, 30000)); continue; }
  let arr; try { arr = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1)); } catch { console.error(`lot ${s}: JSON illisible`); continue; }
  const byN = new Map(arr.map((o) => [Number(o.n), o]));
  for (let i = 0; i < lot.length; i++) {
    const o = byN.get(i + 1); if (!o) continue;
    const th = (o.themes ?? []).filter((t) => THEMES.includes(t)).slice(0, 3);
    appendFileSync(OUT, JSON.stringify({ id: lot[i].id, ply: lot[i].ply, themes: th }) + '\n');
  }
  console.error(`worker ${WK} : ${Math.min(s + LOT, todo.length)}/${todo.length}`);
}
console.error(`TERMINÉ worker ${WK}`);
