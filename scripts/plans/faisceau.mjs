/**
 * Le faisceau : le prix et le tempo d'un plan, en l'imposant au moteur sur quinze coups (docs/plans/FAISCEAU-CRITERE-2026-10-18.md).
 *
 * À chaque coup à nous : les N meilleurs coups du moteur (MultiPV), classés par la distance du plan —
 *   progressant (la distance baisse ; remet le compteur à zéro), forcé (situation à parer : prise à jouer, échec, pièce en
 *   prise au mini-échange, ou le meilleur bat le second de plus d'un pion ; neutre), roque (neutre), intendance (compte 1).
 * Un coup progressant qui vaut plus d'un pion de moins que le meilleur coup est une CONCESSION : refusé. Une branche dont le
 * compteur dépasse k est coupée. L'adversaire joue librement (son meilleur coup). Largeur L : on garde les L branches les
 * mieux évaluées à chaque coup complet. Horizon H coups. La ligne libre (le moteur joue les deux camps) donne la référence :
 *   prix = éval libre − éval contrainte au même demi-coup (notre point de vue ; positif = suivre le plan coûte),
 *   tempo = le demi-coup où la distance tombe à 0.
 * Phrases : c'est le plan (réalisé, prix ≤ plancher) / viable mais ça coûte (réalisé, prix > plancher) / pas réalisable sans
 * concession (toutes les branches coupées faute de progressant admissible) / jamais urgent ici (toutes coupées par le
 * compteur) / en cours à l'horizon (vivant mais pas réalisé). Par coup : la classe et le plan frère servi.
 * Un fil pour mesurer (COACH_DETERMINISTIC=1).
 *
 *   node scripts/plans/faisceau.mjs [--depth 18] [--candidats 4] [--largeur 4] [--horizon 15] [--k 2] [--plancher 25]
 *        [--seulement id] [--out reports/plans/faisceau/faisceau.md]
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { libelle } from '../../coach/plan-distance.mjs';
import { faisceauPlan } from '../../coach/faisceau-plan.mjs';
import { Noteur, DEFAUTS, faisceauLibre } from '../../coach/coup-contraint.mjs';
import { enToFr } from '../../coach/notation.mjs';
import { POSITIONS } from './positions-filtre.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const DEPTH = Number(opt('--depth', 18)), CANDIDATS = Number(opt('--candidats', 4)), LARGEUR = Number(opt('--largeur', 4));
const HORIZON = Number(opt('--horizon', 15)), HORIZON_STRUCTURE = Number(opt('--horizon-structure', 20)), K = Number(opt('--k', 2)), PLANCHER = Number(opt('--plancher', 25)), BANDE = 2 * PLANCHER;
const HMAX = Math.max(HORIZON, HORIZON_STRUCTURE);
const SEUL = opt('--seulement', null);
const OUT = opt('--out', 'reports/plans/faisceau/faisceau.md');

const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const fmt = (c) => (c == null || !Number.isFinite(c) ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^(-?)/, (m) => (m === '-' ? '−' : '+')));
const fr = enToFr;
const mediane = (xs) => { const t = [...xs].sort((a, b) => a - b); return t.length ? t[Math.floor((t.length - 1) / 2)] : null; };

const engine = new UciEngine({ threads: process.env.COACH_DETERMINISTIC === '1' ? 1 : 2, hashMb: 256 });
const noteur = new Noteur(engine, { depth: DEPTH });
/** Les réglages partagés (coach/coup-contraint.mjs) : ici, la dernière chance se note à la profondeur de la passe (le pilote de partie la décide à 14). */
const P = { ...DEFAUTS, depth: DEPTH, depthDerniereChance: DEPTH, candidats: CANDIDATS, largeur: LARGEUR, plancher: PLANCHER, k: K };

const CUMUL = args.includes('--sans-coupe-cumulee') ? null : Number(opt('--coupe-cumulee', 100)); // (c) : coupe des branches en cours à concession cumulée > 1,0 ; `--sans-coupe-cumulee` = ancien comportement
const PF = { ...P, horizon: HORIZON, horizonStructure: HORIZON_STRUCTURE, bande: BANDE, concessionCumulee: CUMUL };
const faisceau = (pos, fen, side, plan, autres, libre, opts) => faisceauPlan(noteur, PF, fen, side, plan, autres, libre, opts);

function rendre(resultats, positions) {
  const md = [`# Faisceau — ${new Date().toISOString().slice(0, 10)} — prof. ${DEPTH}, ${CANDIDATS} candidats, largeur ${LARGEUR}, horizon ${HORIZON} coups (${HORIZON_STRUCTURE} pour les plans de structure), k = ${K}, plancher ${PLANCHER}, prix au point calme${CUMUL != null ? `, coupe à concession cumulée > ${fmt(CUMUL)}` : ''}`, '',
    'Prix = éval du FAISCEAU LIBRE (même largeur, mêmes candidats, sans plan) − éval de la ligne contrainte au même demi-coup (positif = suivre le plan coûte ; négatif = gratuit, pas un gain). Prix ligne = la ligne retenue contre la ligne gloutonne (largeur 1 des deux côtés : l\'échelle des parties). Largeur eff. = branches vivantes gardées à chaque coup (médiane · min) ; le faisceau libre en garde ' + LARGEUR + '. Tempo = demi-coup de la réalisation. Ligne : nos coups avec leur classe (P progressant, F forcé, R roque, I intendance, D dernière chance : meilleur progressant hors MultiPV, joué parce qu\'il coûte ≤ 1 pion) et le plan frère servi entre crochets ; la réponse adverse suit (′ = seconde réponse, ouverte parce qu\'ex æquo).', ''];
  for (const pos of positions) {
    const rs = resultats.filter((r) => r.position === pos.id); if (!rs.length) continue;
    md.push(`## ${pos.nom}`, '', `Ligne gloutonne (affichage) : ${rs[0].libreSans.map((s) => fr(s)).join(' ')} …`, '', '| plan | canon. | long | phrase | prix (point calme · brut) | prix ligne | largeur eff. (méd. · min) | tempo | limite | bascule de structure | branches (réalisées · vivantes · coupées concession / compteur / cumul / autres) | ligne retenue | s |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of [...rs].sort((a, b) => (a.tempo == null) - (b.tempo == null) || (a.prix ?? 1e9) - (b.prix ?? 1e9))) {
      const ligne = r.ligne.map((x) => `${fr(x.san)}<sub>${{ progressant: 'P', forcé: 'F', roque: 'R', intendance: 'I', 'dernière chance': 'D' }[x.classe]}${x.sert?.length ? `[${x.sert.join(',')}]` : ''}</sub>${x.rep ? ' ' + fr(x.rep) + (x.repAlt ? '′' : '') : ''}`).join(' ');
      md.push(`| ${r.libelle} | ${r.canonique ? '●' : ''} | ${r.long ? 'long' : ''} | **${r.phrase}**${r.merci ? ' · à la merci de la réponse' : ''}${r.concessionMin != null && r.tempo == null ? ` (concession ${fmt(r.concessionMin)})` : ''} | ${fmt(r.prix)}${r.prixBrut != null && r.prixBrut !== r.prix ? ` · brut ${fmt(r.prixBrut)}` : ''}${r.calme === false ? ' · pas de point calme' : ''}${r.prolonge?.length ? `<br><small>calme après ${r.prolonge.map((x) => fr(x)).join(' ')}</small>` : ''} | ${r.tempo != null ? fmt(r.prixLigne) : ''} | ${r.largeurs?.length ? `${mediane(r.largeurs)} · ${Math.min(...r.largeurs)}` : ''} | ${r.tempo ?? '∞'} | ${r.limite ? 'limite' : ''} | ${r.bascule ? `${r.bascule.ply} : ${r.bascule.avant} → ${r.bascule.apres} par ${r.bascule.parAdversaire ? 'l\'adversaire ' : ''}${fr(r.bascule.par)}, prix jusque-là ${fmt(r.bascule.prixAvant)}${r.division?.length ? `<br><small>continuer : ${r.phrase} ${fmt(r.continuer?.prix ?? r.prix)}${r.continuer ? ` (réf. depuis la bascule ; depuis la racine ${fmt(r.prix)})` : ''} · ${r.division.map((d) => `adopter ${d.libelle} (${d.structure}) : ${d.phrase}${d.prix != null ? ' ' + fmt(d.prix) : ''}${d.tempo != null ? ', tempo ' + d.tempo : ''}`).join(' · ')}</small>` : ''}` : ''} | ${r.realises} · ${r.vivants} · ${r.coupes.concession} / ${r.coupes.compteur} / ${r.coupes.cumul ?? 0} / ${r.coupes.autres} | ${ligne} | ${r.secondes} |`);
    }
    md.push('');
    // (a) L'autopsie des divisions : pour chaque sous-faisceau, la ligne retenue et où chaque branche s'est arrêtée.
    const divisees = rs.filter((r) => r.division?.length);
    if (divisees.length) {
      md.push(`### Divisions (${pos.nom}) — référence : faisceau libre depuis la position de bascule`, '');
      const ligneDe = (l) => l.map((x) => `${fr(x.san)}<sub>${{ progressant: 'P', forcé: 'F', 'forcé-progressant': 'FP', roque: 'R', intendance: 'I', 'dernière chance': 'D' }[x.classe] ?? '?'}</sub>${x.rep ? ' ' + fr(x.rep) + (x.repAlt ? '′' : '') : ''}`).join(' ');
      const coupesDe = (d) => `${d.coupes.concession} concession / ${d.coupes.compteur} compteur / ${d.coupes.cumul ?? 0} cumul / ${d.coupes.autres} autres${d.coupesListe?.length ? ` ; les plus avancées : ${d.coupesListe.slice(0, 4).map((c) => `${c.ply} ${c.raison}${c.cout != null ? ' ' + fmt(c.cout) : ''} après ${c.ligne.split(' ').map((x) => fr(x)).join(' ')}`).join(' · ')}` : ''}`;
      for (const r of divisees) {
        md.push(`- **${r.libelle}**, bascule au ${r.bascule.ply} (${r.bascule.avant} → ${r.bascule.apres}) : **continuer** ${r.phrase} ${fmt(r.continuer?.prix ?? r.prix)}${r.continuer ? ` depuis la bascule (depuis la racine ${fmt(r.prix)}, lu au ${r.continuer.ply})` : ''}, ligne ${ligneDe(r.ligne)}`);
        for (const d of r.division) md.push(`  - **adopter ${d.libelle}** (${d.structure}) : ${d.phrase}${d.prix != null ? ' ' + fmt(d.prix) : ''}${d.prixBrut != null && d.prixBrut !== d.prix ? ` · brut ${fmt(d.prixBrut)}` : ''}${d.tempo != null ? `, tempo ${d.tempo}` : ''}${d.calme === false ? ', pas de point calme' : ''}${d.concessionMin != null && d.tempo == null ? ` (concession ${fmt(d.concessionMin)})` : ''}${d.ligne ? ` — ligne ${ligneDe(d.ligne)}` : ''}${d.coupes ? `<br>branches : ${d.realises} réalisées · ${d.vivants} vivantes · coupées ${coupesDe(d)}` : ''}`);
      }
      md.push('');
    }
  }
  // Critère (amendé) : aucun plan NON canonique réalisé ne bat le meilleur canonique réalisé de plus du plancher ;
  // les plans longs comptés à part, canoniques seulement, « prix fini » = ≤ 1,0.
  const elig = positions.filter((p) => resultats.some((r) => r.position === p.id) && p.plans.some((_, i) => !(p.canoniques ?? []).includes(i)));
  let ok = 0; const detail = [];
  for (const p of elig) {
    const rs = resultats.filter((r) => r.position === p.id && r.tempo != null && r.prix != null);
    const can = rs.filter((r) => r.canonique).sort((a, b) => a.prix - b.prix)[0], non = rs.filter((r) => !r.canonique).sort((a, b) => a.prix - b.prix)[0];
    if (!can) { detail.push(`- ${p.id} : **aucun plan canonique réalisé** dans l'horizon${non ? ` (le moins cher réalisé : ${non.libelle}, ${fmt(non.prix)})` : ''} → échec`); continue; }
    const marge = non ? can.prix - non.prix : -Infinity; // > plancher : un non canonique bat le canonique de plus de 25
    const reussi = marge <= PLANCHER; if (reussi) ok++;
    detail.push(`- ${p.id} : meilleur canonique **${can.libelle}** (${fmt(can.prix)}, tempo ${can.tempo})${non ? ` ; meilleur non canonique ${non.libelle} (${fmt(non.prix)}, tempo ${non.tempo})` : ' ; aucun non canonique réalisé'} → ${reussi ? 'réussi' : `**contredit le livre de ${fmt(marge)}** (à trancher à prof. 30)`}`);
  }
  const longs = resultats.filter((r) => r.long && r.canonique), longsRealises = longs.filter((r) => r.tempo != null && r.prix != null && r.prix <= 100);
  md.push('## Critère', '', `Positions éligibles : ${elig.length} ; réussies : **${ok}** (${elig.length ? Math.round((100 * ok) / elig.length) : 0} %). Plans longs canoniques : ${longs.length}, réalisés dans l'horizon à prix ≤ 1,0 : **${longsRealises.length}** (${longs.length ? Math.round((100 * longsRealises.length) / longs.length) : 0} %).`, '', ...detail, '');
  return md.join('\n') + '\n';
}

mkdirSync(dirname(OUT), { recursive: true });
const FUSION = opt('--fusion', null);
if (FUSION) {
  const { readdirSync, readFileSync } = await import('node:fs');
  const resultats = readdirSync(FUSION).filter((f) => /^faisceau-.*\.json$/.test(f)).flatMap((f) => { try { return JSON.parse(readFileSync(`${FUSION}/${f}`, 'utf8')); } catch (e) { console.error(`JSON illisible, ignoré : ${f} (${e.message})`); return []; } });
  writeFileSync(OUT, rendre(resultats, POSITIONS)); writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(resultats, null, 1));
  console.error(`fusion : ${resultats.length} plans → ${OUT}`); process.exit(0);
}

const resultats = [];
for (const pos of POSITIONS) {
  if (SEUL && pos.id !== SEUL) continue;
  const c = new Chess(); if (pos.fen) c.load(pos.fen); else for (const san of pos.coups.split(/\s+/)) c.move(san);
  const fen = c.fen(), side = c.turn();
  console.error(`${pos.id} : ligne libre et faisceau libre…`);
  const libre = await faisceauLibre(noteur, fen, side, HMAX, P);
  const tous = pos.plans.map((p, i) => ({ plan: p, libelle: libelle(p, fen), canonique: (pos.canoniques ?? []).includes(i) }));
  for (const [i, t] of tous.entries()) {
    console.error(`  ${t.libelle} …`); const t0 = Date.now();
    const r = await faisceau(pos, fen, side, t.plan, tous.filter((x) => x !== t), libre);
    resultats.push({ position: pos.id, index: i, canonique: t.canonique, long: t.plan.famille === 'et' || r.d0 >= 2, ...r, libreSans: libre.sans.slice(0, 10), secondes: Math.round((Date.now() - t0) / 1000) });
    console.error(`    ${r.phrase} prix ${fmt(r.prix)} tempo ${r.tempo ?? '∞'} (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
}
engine.stop();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, rendre(resultats, POSITIONS));
writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(resultats, null, 1));
console.error(`écrit : ${OUT}`);
