#!/usr/bin/env node
/**
 * Le TAUX DE TROUS de l'arbre, sur des positions déjà jouées (CHANTIER-ARBRE-2026-10-25, mesure de fin du temps 1).
 *
 * Pour chaque coup du coach d'un lot de parties, on remet l'arbre devant la recherche (joueur-arbre, le trou activé) :
 * l'arbre produit ses candidats, la recherche complète dit si elle les bat de 100. On publie DEUX tableaux :
 *   (i)  par étape où l'arbre se trouvait (celle qui aurait produit le coup) : trous / coups ;
 *   (ii) par classe de trou (coupé / pas reconnu avant / sans nom) et par étape à laquelle le trou appartient.
 * Le chiffre qui compte : « sans nom » (une branche manquante). < 5 % : l'arbre suffit ; 20 % : trop pauvre.
 *
 *   node scripts/joueur/taux-trous.mjs parties-serie-4d5e252-26/           # un dossier de parties
 *   node scripts/joueur/taux-trous.mjs partie1.json partie2.json [...]     # des fichiers
 *   COACH_BUDGET=400000 node scripts/joueur/taux-trous.mjs <lot> --sortie bilan-trous.json
 *
 * Un fil, déterministe. Aucune mesure n'est lancée sans l'accord de Sébastien (nombre et heure de fin) : cet outil est là
 * pour QUE le pilote la lance. Il n'écrit rien d'autre que le bilan demandé.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { JoueurArbre } from '../../coach/joueur/joueur-arbre.mjs';

const ETAPE = (noeud) => (noeud == null ? '—' : noeud[0]); // '1' | '2' | '3' | '—'
const PCT = (n, d) => (d ? (100 * n / d).toFixed(1) + ' %' : '—');

function fichiersDe(args) {
  const chemins = args.filter((a) => !a.startsWith('--'));
  const out = [];
  for (const c of chemins) {
    const st = statSync(c);
    if (st.isDirectory()) for (const f of readdirSync(c)) { if (f.endsWith('.json') && f !== 'index.json') out.push(`${c.replace(/\/$/, '')}/${f}`); }
    else out.push(c);
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) { console.error('usage : node scripts/joueur/taux-trous.mjs <dossier|fichiers.json> [--sortie bilan.json]'); process.exit(2); }
  const budget = Number(process.env.COACH_BUDGET ?? 400000);
  const sortie = args.includes('--sortie') ? args[args.indexOf('--sortie') + 1] : null;
  const fichiers = fichiersDe(args);

  const parEtape = {}; // étape de l'arbre → { coups, trous }
  const parClasse = {}; // classe → { étape du trou → n }
  let coups = 0, trous = 0;
  const details = [];

  for (const chemin of fichiers) {
    let partie; try { partie = JSON.parse(readFileSync(chemin, 'utf8')); } catch { console.error(`illisible : ${chemin}`); continue; }
    const camp = partie.coach?.camp ?? 'w', depart = partie.depart;
    const coach = new JoueurArbre({ camp, budget, trou: true });
    const historique = [];
    for (const c of partie.coups ?? []) {
      if (c.coach) {
        const r = await coach.choisir(c.fenAvant, { camp, depart, historique: [...historique] });
        coups++;
        const etArbre = ETAPE(r.trou ? r.trou.etapeArbre : r.noeud);
        parEtape[etArbre] = parEtape[etArbre] ?? { coups: 0, trous: 0 };
        parEtape[etArbre].coups++;
        if (r.trou) {
          trous++;
          parEtape[etArbre].trous++;
          const cl = r.trou.classe, et = ETAPE(r.trou.noeud);
          parClasse[cl] = parClasse[cl] ?? {};
          parClasse[cl][et] = (parClasse[cl][et] ?? 0) + 1;
          details.push({ partie: partie.id, ply: c.ply, fen: c.fenAvant, joue: c.san, arbre: r.candidats[0]?.san, trou: r.trou });
        }
      }
      historique.push(c.uci);
    }
    process.stderr.write(`· ${chemin.split('/').pop()} fait (${coups} coups, ${trous} trous)\n`);
  }

  const bilan = { lot: fichiers.length, coups, trous, taux: coups ? 100 * trous / coups : 0, budget, parEtape, parClasse, details };
  console.log(`\n=== TAUX DE TROUS — ${coups} coups du coach, ${trous} trous (${PCT(trous, coups)}) ===\n`);
  console.log('(i) par étape où l\'arbre se trouvait :');
  for (const et of ['1', '2', '3', '—']) if (parEtape[et]) console.log(`    étape ${et} : ${parEtape[et].trous} trous / ${parEtape[et].coups} coups (${PCT(parEtape[et].trous, parEtape[et].coups)})`);
  console.log('\n(ii) par classe de trou et par étape à laquelle le trou appartient :');
  for (const cl of ['coupé', 'pas reconnu avant', 'sans nom']) if (parClasse[cl]) console.log(`    ${cl} : ${Object.entries(parClasse[cl]).map(([e, n]) => `étape ${e} : ${n}`).join(' · ')} (total ${Object.values(parClasse[cl]).reduce((a, b) => a + b, 0)})`);
  console.log(`\nLe chiffre qui compte — « sans nom » : ${Object.values(parClasse['sans nom'] ?? {}).reduce((a, b) => a + b, 0)} (${PCT(Object.values(parClasse['sans nom'] ?? {}).reduce((a, b) => a + b, 0), coups)}).`);
  if (sortie) { writeFileSync(sortie, JSON.stringify(bilan, null, 1)); console.log(`\nbilan écrit : ${sortie}`); }
}

main().catch((e) => { console.error(e); process.exit(1); });
