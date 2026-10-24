// Vérifie la légalité de tous les coups d'un livre d'ouverture (coups, plan[].san, erreurs[].san)
// et signale les doublons plan/erreurs. Usage : node outils/verif-legalite-livre.mjs <chemin-du-livre.mjs>
// Le livre doit exporter LIVRE (ou COMPLEMENTS) au format de coach/openings/*.mjs.
// Écrit pour la relecture de l'Espagnole (oct. 2026) : a trouvé 6 coups illégaux (clouages, diagonales
// bouchées par b5) que la vérification moteur ne voyait pas. Toujours passer la légalité AVANT le moteur.
import { Chess } from '../vendor/chess.js';

const chemin = process.argv[2];
if (!chemin) { console.error('Usage : node outils/verif-legalite-livre.mjs <livre.mjs>'); process.exit(2); }
const mod = await import(new URL(chemin, `file://${process.cwd()}/`).href);
const livre = mod.LIVRE || mod.COMPLEMENTS || mod.default;
if (!Array.isArray(livre)) { console.error('Pas de tableau LIVRE/COMPLEMENTS exporté.'); process.exit(2); }

let problemes = 0;
for (const pos of livre) {
  const chess = new Chess();
  let ok = true;
  for (const san of pos.coups.split(/\s+/)) {
    try { chess.move(san); } catch {
      console.log(`ILLEGAL (coups): "${pos.coups}" -> ${san}`);
      problemes++; ok = false; break;
    }
  }
  if (!ok) continue;
  const fen = chess.fen();
  for (const cat of ['plan', 'erreurs']) {
    for (const item of pos[cat] || []) {
      const c2 = new Chess(fen);
      try { c2.move(item.san); } catch {
        console.log(`ILLEGAL (${cat}): "${pos.coups}" -> ${item.san}`);
        problemes++;
      }
    }
  }
  const sans = [...(pos.plan || []), ...(pos.erreurs || [])].map(i => i.san);
  const dup = sans.filter((s, i) => sans.indexOf(s) !== i);
  if (dup.length) { console.log(`DOUBLON: "${pos.coups}" -> ${dup.join(', ')}`); problemes++; }
}
console.log(problemes ? `${problemes} problème(s) sur ${livre.length} positions.` : `OK : ${livre.length} positions, tous les coups légaux.`);
process.exit(problemes ? 1 : 0);
