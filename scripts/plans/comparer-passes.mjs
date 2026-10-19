#!/usr/bin/env node
/**
 * Compare deux passes du faisceau plan par plan (phrase, prix, prix brut, tempo, limite, merci, ligne retenue, bascule,
 * division) : sert à vérifier qu'une refonte du code ne change pas un chiffre (même moteur, un fil).
 *   node scripts/plans/comparer-passes.mjs <dossier A> <dossier B>
 * Sortie : une ligne par plan différent, puis « identiques : n/m ». Code de sortie 1 s'il y a une différence.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
const [A, B] = process.argv.slice(2);
const lire = (d) => Object.fromEntries(readdirSync(d).filter((f) => /^faisceau-.*\.json$/.test(f)).map((f) => [f, JSON.parse(readFileSync(`${d}/${f}`, 'utf8'))]));
const a = lire(A), b = lire(B);
const cle = (x) => JSON.stringify({ phrase: x.phrase, prix: x.prix, prixBrut: x.prixBrut ?? null, tempo: x.tempo, limite: x.limite ?? null, merci: x.merci ?? null, ligne: (x.ligne ?? []).map((l) => `${l.san}/${l.rep ?? ''}`).join(' '), bascule: x.bascule ? `${x.bascule.ply}:${x.bascule.apres}` : null, division: x.division ? JSON.stringify(x.division).length : null, libre: (x.libreSans ?? []).join(' ') });
let n = 0, m = 0, manquants = 0;
for (const f of Object.keys(a).sort()) {
  if (!b[f]) { manquants++; continue; }
  for (const [i, x] of a[f].entries()) {
    m++; const y = b[f][i];
    if (y && cle(x) === cle(y)) { n++; continue; }
    console.log(`≠ ${f.replace(/^faisceau-|\.json$/g, '')} #${i} ${x.libelle}\n   A ${cle(x)}\n   B ${y ? cle(y) : '(absent)'}`);
  }
}
console.log(`identiques : ${n}/${m} plans (${manquants} fichier(s) de A absent(s) de B)`);
process.exit(n === m ? 0 : 1);
