#!/usr/bin/env node
/**
 * « CALCUL PUIS NOMMAGE » (idée de Sébastien, 25 oct. 2026) : les coups d'un lot de parties ont déjà été choisis par le
 * calcul complet ; on demande seulement à l'arbre quelle question RECONNAÎT chaque coup. Aucune recherche complète ici :
 * seulement la sonde des questions (menace, mat court, « que menacé-je ? »).
 *
 * Publie : la part des coups nommés, par nœud ; la part des coups sans nom, par phase (ouverture / milieu / finale) ;
 * et une ligne par coup sans nom (partie, coup, position) pour savoir quelle question manque.
 *
 *   node scripts/joueur/nommer-coups.mjs <dossier|fichiers.json> [--rapide] [--sortie bilan.json] [--part i/n]
 *   (--rapide : nommage rapide, sonde bornée, < 1 s/coup ; sans l'option, le nommage lent — comparer les deux donne l'accord)
 *   (--part 2/4 : ne traite que les fichiers de rang 2 sur 4, pour paralléliser par processus — chaque processus reste à un fil)
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { JoueurArbre } from '../../coach/joueur/joueur-arbre.mjs';
import { ORDRE } from '../../coach/joueur/arbre.mjs';

const PCT = (n, d) => (d ? (100 * n / d).toFixed(1) + ' %' : '—');

function fichiersDe(args) {
  const chemins = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--sortie' && args[i - 1] !== '--part');
  const out = [];
  for (const c of chemins) {
    const st = statSync(c);
    if (st.isDirectory()) for (const f of readdirSync(c).sort()) { if (f.endsWith('.json') && f !== 'index.json') out.push(`${c.replace(/\/$/, '')}/${f}`); }
    else out.push(c);
  }
  return out;
}

function phaseDe(fen) {
  const pieces = fen.split(' ')[0].replace(/[^a-zA-Z]/g, '').replace(/[kK]/g, '');
  const lourdes = (pieces.match(/[qrQR]/g) ?? []).length, mineures = (pieces.match(/[nbNB]/g) ?? []).length;
  const n = Number(fen.split(' ')[5] ?? 1);
  if (n <= 10) return 'ouverture';
  if (lourdes + mineures <= 6) return 'finale';
  return 'milieu';
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) { console.error('usage : node scripts/joueur/nommer-coups.mjs <dossier|fichiers.json> [--sortie bilan.json] [--part i/n]'); process.exit(2); }
  const budget = Number(process.env.COACH_BUDGET ?? 120000);
  const rapide = args.includes('--rapide'); // nommage rapide (sonde bornée, < 1 s/coup) ; sans l'option, le nommage lent d'aujourd'hui
  const sortie = args.includes('--sortie') ? args[args.indexOf('--sortie') + 1] : null;
  let fichiers = fichiersDe(args);
  if (args.includes('--part')) { const [i, n] = args[args.indexOf('--part') + 1].split('/').map(Number); fichiers = fichiers.filter((_, k) => k % n === i - 1); }

  const parNoeud = {}; const parPhase = {}; let coups = 0, nommes = 0; const sansNom = []; const details = [];
  const t0 = Date.now();
  for (const chemin of fichiers) {
    let partie; try { partie = JSON.parse(readFileSync(chemin, 'utf8')); } catch { console.error(`illisible : ${chemin}`); continue; }
    if (!Array.isArray(partie.coups)) { process.stderr.write(`· ${chemin.split('/').pop()} ignoré (pas une partie)\n`); continue; }
    const camp = partie.coach?.camp ?? 'w', depart = partie.depart;
    const coach = new JoueurArbre({ camp, budget });
    const historique = [];
    for (const c of partie.coups) {
      if (c.coach) {
        const r = coach.nommer(c.fenAvant, { depart, historique: [...historique] }, c.uci, { rapide });
        coups++;
        const ph = phaseDe(c.fenAvant);
        parPhase[ph] = parPhase[ph] ?? { coups: 0, sansNom: 0 }; parPhase[ph].coups++;
        if (r.noeud) { nommes++; parNoeud[r.noeud] = (parNoeud[r.noeud] ?? 0) + 1; }
        else { parPhase[ph].sansNom++; sansNom.push({ partie: partie.id, ply: c.ply, fen: c.fenAvant, san: c.san, sorte: c.sorte, phase: ph, candidats: r.candidats.map((x) => x.noeud).join(' ') }); }
        details.push({ partie: partie.id, ply: c.ply, san: c.san, noeud: r.noeud, raison: r.raison, autres: r.raisons.slice(1).map((x) => x.noeud) });
      }
      historique.push(c.uci);
    }
    process.stderr.write(`· ${chemin.split('/').pop()} fait (${coups} coups, ${nommes} nommés, ${Math.round((Date.now() - t0) / 1000)} s)\n`);
    if (sortie) writeFileSync(sortie, JSON.stringify(bilanDe(), null, 1));
  }
  function bilanDe() { return { lot: fichiers.length, budget, coups, nommes, sansNom: coups - nommes, parNoeud, parPhase, sansNomListe: sansNom, details }; }

  console.log(`\n=== CALCUL PUIS NOMMAGE — ${coups} coups, ${nommes} nommés (${PCT(nommes, coups)}), ${coups - nommes} sans nom (${PCT(coups - nommes, coups)}) ===\n`);
  console.log('par question qui nomme :');
  for (const n of ORDRE) if (parNoeud[n]) console.log(`    ${n} : ${parNoeud[n]} (${PCT(parNoeud[n], coups)})`);
  console.log('\nsans nom par phase :');
  for (const [ph, v] of Object.entries(parPhase)) console.log(`    ${ph} : ${v.sansNom} / ${v.coups} (${PCT(v.sansNom, v.coups)})`);
  if (sortie) { writeFileSync(sortie, JSON.stringify(bilanDe(), null, 1)); console.log(`\nbilan écrit : ${sortie}`); }
}

main().catch((e) => { console.error(e); process.exit(1); });
