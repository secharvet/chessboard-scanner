/**
 * Essai (4 octobre 2026, idée de l'auteur) : soumettre des planches à Fable UNE À LA FOIS, en image, avec la
 * définition du concept et la question, et recueillir son verdict. Sortie : <dossier>/<id>.txt et un JSON récapitulatif.
 *   node scripts/planches-fable.mjs <dossier des captures> <clé.json> <tirage.json> <sortie.json> id1 id2 …
 * Le tirage sert à donner aussi, en texte, la position avant et après le coup clé (FEN) : l'image ne montre pas la
 * pièce prise au coup clé (essai sur 5 planches : Fable l'a signalé lui-même).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
const [dir, cleFile, tirageFile, out, ...ids] = process.argv.slice(2);
const key = JSON.parse(readFileSync(cleFile, 'utf8'));
const tirage = JSON.parse(readFileSync(tirageFile, 'utf8'));
const fr = (s) => s.replace(/^[CFTDR]/, (x) => ({ C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' })[x]);
/** FEN avant et après le coup clé, et le coup clé en notation française. */
const fens = (id) => {
  const k = key[id]; const concept = id.replace(/-\d+$/, '');
  const all = [...tirage.concepts[concept].positifs, ...tirage.concepts[concept].pieges];
  const p = all.find((x) => x.fen === k.fen && x.ply === k.ply && x.game === k.game);
  const c = new Chess(p.fen); for (let i = 0; i < p.ply; i++) c.move(fr(p.moves[i]));
  const before = c.fen(); c.move(fr(p.moves[p.ply]));
  return { before, after: c.fen(), san: p.moves[p.ply], side: p.side === 'w' ? 'les Blancs' : 'les Noirs', suite: p.moves.join(' ') };
};
const DEF = {
  tour_colonne: 'Tour sur colonne ouverte : une tour vient se placer, par un coup calme, sur une colonne ouverte (aucun pion, ni blanc ni noir), où ce camp n\'avait pas encore de tour, et qu\'aucune tour adverse ne tient déjà ; et elle y reste.',
  tour_colonne_semi_ouverte: 'Tour sur colonne semi-ouverte : une tour vient se placer, par un coup calme, sur une colonne semi-ouverte pour ce camp (un seul pion, celui de l\'adversaire : une cible), où ce camp n\'avait pas encore de tour, et qu\'aucune tour adverse ne tient déjà ; et elle y reste.',
  cavalier_avant_poste: 'Cavalier sur avant-poste : un cavalier s\'installe dans le camp adverse (4e rangée comprise) sur une case qu\'aucun pion adverse ne pourra plus jamais attaquer, soutenue par un pion à lui ou qu\'un pion à lui peut encore venir soutenir ; et il y reste.',
  blocage: 'Blocage d\'un pion : un cavalier ou un fou vient se placer juste devant un pion adverse qu\'aucun pion adverse ne pourra plus chasser de là (isolé, arriéré, base de chaîne, doublé de tête), ou devant un pion passé ; et il y reste.',
  rupture: 'Rupture de pions (réalisée) : une poussée de pion de ce camp qui attaque un pion adverse (le levier), que l\'un des deux pions prend ensuite, et qui ouvre ou semi-ouvre une colonne nouvelle, pour l\'un ou l\'autre camp. Le coup surligné est le levier. Un levier contourné (le pion attaqué avance), dissous par une pièce, ou laissé en tension n\'est pas une rupture.',
  affaiblir: 'Affaiblir la structure adverse : par une prise que l\'adversaire doit reprendre avec un pion, ou par une poussée de pion, ce camp lui crée une faiblesse durable : pions doublés, pion isolé ou arriéré, bouclier du roi abîmé. Le coup surligné est la prise ou la poussée de ce camp, jamais la reprise adverse.',
  dominer: 'Dominer une couleur de cases : ce camp prend lui-même le fou adverse d\'une couleur (ou force l\'échange par une offre), garde son propre fou de cette couleur, et l\'adversaire n\'en a plus une fois l\'échange terminé ; le fou conservé n\'est pas enfermé derrière ses pions, et l\'adversaire est faible sur ces cases.',
};
const results = [];
for (const id of ids) {
  const concept = id.replace(/-\d+$/, '');
  const f = fens(id);
  const prompt = `Regarde l'image ${dir}/${id}.png (lis-la avec l'outil Read). C'est une planche d'échecs : l'échiquier juste après le coup clé surligné, la suite des coups réellement joués (le coup surligné en couleur), le camp qui agit et une question.
Pour lever tout doute de lecture : le camp qui agit est ${f.side}, le coup clé est ${f.san}, la position AVANT ce coup est (FEN) ${f.before} et la position APRÈS est (FEN) ${f.after}. La suite jouée : ${f.suite}.
Définition du concept à juger : ${DEF[concept]}
Question : le coup surligné réalise-t-il ce concept, pour le camp indiqué, dans cette suite ? Juge sur l'échiquier et la suite, pas sur le titre.
Réponds en français. Première ligne exactement « VERDICT : oui », « VERDICT : non » ou « VERDICT : pas sûr ». Puis 3 à 6 lignes de justification en lisant la position (pièces, pions, cases), et si c'est non, le vrai nom de ce que fait le coup.`;
  const t0 = Date.now();
  let text;
  try {
    text = execFileSync('claude', ['-p', '--model', 'fable', '--allowedTools', 'Read', '--permission-mode', 'dontAsk', '--max-turns', '3', prompt], { encoding: 'utf8', timeout: 240000, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { text = `ERREUR : ${e.message}`; }
  const verdict = (text.match(/VERDICT\s*:\s*(oui|non|pas sûr)/i)?.[1] ?? '?').toLowerCase();
  writeFileSync(`${dir}/${id}.txt`, text);
  results.push({ id, concept, programme: key[id]?.kind, raisonProgramme: key[id]?.raison ?? null, fable: verdict, secondes: Math.round((Date.now() - t0) / 1000), texte: text.trim() });
  console.log(`${id}: programme ${key[id]?.kind} | Fable ${verdict} (${Math.round((Date.now() - t0) / 1000)} s)`);
}
writeFileSync(out, JSON.stringify(results, null, 1));
