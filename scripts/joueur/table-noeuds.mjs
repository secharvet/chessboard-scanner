#!/usr/bin/env node
/**
 * LA TABLE (CHANTIER-TABLE-2026-10-25) : pour des positions humaines (fichier JSONL de extraire-humains.mjs), quels nœuds
 * de l'arbre sont ALLUMÉS et lequel NOMME le coup joué. Écrit une ligne par position (nœuds allumés avec leurs coups, nœud
 * qui nomme, tous les nœuds qui reconnaissent) et imprime la table : par nœud, part brute (nommé / positions), part
 * « quand allumé » (nommé / positions où le nœud proposait), part des positions où il est allumé ; sans nom ; par phase.
 *
 *   node scripts/joueur/table-noeuds.mjs data/humains-2016-01/apprentissage-1400.jsonl --n 100 --sortie reports/table-1400.jsonl
 *   COACH_BUDGET=40000 ... (le budget de la sonde ; le mode rapide viendra avec { rapide: true })
 *
 * Aucune recherche complète. Un processus = un fil. Ne lit jamais les fichiers test-*.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { JoueurArbre } from '../../coach/joueur/joueur-arbre.mjs';
import { ORDRE } from '../../coach/joueur/arbre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const fichiers = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const N = Number(opt('--n', 0));
const SORTIE = opt('--sortie', null);
const RAPIDE = args.includes('--rapide');
const budget = Number(process.env.COACH_BUDGET ?? 40000);
if (!fichiers.length) { console.error('usage : node scripts/joueur/table-noeuds.mjs <positions.jsonl> [--n 100] [--sortie lignes.jsonl] [--rapide]'); process.exit(2); }
if (fichiers.some((f) => /(^|\/)test-/.test(f))) { console.error('refus : les fichiers test-* ne se lisent pas dans ce chantier'); process.exit(2); }

const PCT = (n, d) => (d ? (100 * n / d).toFixed(1).padStart(5) + ' %' : '    —  ');
const t0 = Date.now();
const lignes = [];
let positions = 0;
const stats = { parNoeud: {}, phases: {} }; // nœud → { allume, nomme, reconnait } ; phase → { positions, sansNom }
const st = (n) => (stats.parNoeud[n] = stats.parNoeud[n] ?? { allume: 0, nomme: 0, reconnait: 0 });

for (const f of fichiers) {
  const toutes = readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const prises = N ? toutes.slice(0, N) : toutes;
  const coach = new JoueurArbre({ budget });
  let precedent = null;
  for (const p of prises) {
    let r;
    try { r = coach.nommer(p.fen, {}, p.uci, RAPIDE ? { rapide: true } : undefined); } catch (e) { process.stderr.write(`erreur ${p.partie} ply ${p.ply} : ${e.message}\n`); continue; }
    positions++;
    const allumes = {};
    for (const c of r.candidats) for (const rs of (c.raisons ?? [{ noeud: c.noeud }])) (allumes[rs.noeud] = allumes[rs.noeud] ?? []).push(c.coup);
    for (const n of Object.keys(allumes)) st(n).allume++;
    const reconnait = (r.raisons ?? []).map((x) => x.noeud);
    for (const n of new Set(reconnait)) st(n).reconnait++;
    if (r.noeud) st(r.noeud).nomme++;
    const ph = (stats.phases[p.phase] = stats.phases[p.phase] ?? { positions: 0, sansNom: 0, memeNoeud: 0, suites: 0 });
    ph.positions++; if (!r.noeud) ph.sansNom++;
    if (precedent && precedent.partie === p.partie && precedent.camp === p.camp) { ph.suites++; if (precedent.noeud && precedent.noeud === r.noeud) ph.memeNoeud++; }
    precedent = { partie: p.partie, camp: p.camp, noeud: r.noeud };
    lignes.push({ ...p, noeud: r.noeud, reconnait, allumes });
    if (positions % 50 === 0) process.stderr.write(`· ${positions} positions, ${Math.round((Date.now() - t0) / 1000)} s (${((Date.now() - t0) / 1000 / positions).toFixed(2)} s/position)\n`);
  }
}

const nommes = Object.values(stats.parNoeud).reduce((a, s) => a + s.nomme, 0);
console.log(`\n=== TABLE — ${fichiers.map((f) => f.split('/').pop()).join(', ')} : ${positions} positions, ${nommes} nommées (${PCT(nommes, positions).trim()}), ${positions - nommes} sans nom (${PCT(positions - nommes, positions).trim()}) — ${((Date.now() - t0) / 1000 / Math.max(1, positions)).toFixed(2)} s/position, budget ${budget}${RAPIDE ? ', rapide' : ''} ===\n`);
console.log('| nœud | allumé (part des positions) | nomme : part brute | nomme : quand allumé |');
console.log('|---|---|---|---|');
for (const n of ORDRE) { const s = stats.parNoeud[n]; if (!s) continue; console.log(`| ${n} | ${s.allume} (${PCT(s.allume, positions).trim()}) | ${s.nomme} (${PCT(s.nomme, positions).trim()}) | ${PCT(s.nomme, s.allume).trim()} |`); }
console.log('\npar phase :');
for (const [ph, v] of Object.entries(stats.phases)) console.log(`    ${ph} : ${v.positions} positions, sans nom ${PCT(v.sansNom, v.positions).trim()}, même nœud qu'au coup précédent ${v.suites ? PCT(v.memeNoeud, v.suites).trim() : '—'} (${v.suites} suites)`);
if (SORTIE) { writeFileSync(SORTIE, lignes.map((l) => JSON.stringify(l)).join('\n') + '\n'); console.log(`\nlignes écrites : ${SORTIE}`); }
