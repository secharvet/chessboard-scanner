#!/usr/bin/env node
/**
 * Le récit d'une partie du coach joueur, en Markdown lisible par un humain (ou par le GE) : tous les coups, et pour
 * chaque coup du coach sa phrase, sa sorte, et le « pourquoi » (la ligne calculée, le coup battu, la menace vue, le plan,
 * le verdict de l'examinateur). Aucun calcul : c'est le fichier de la partie (contrat, docs/coach-joueur/CHANTIERS
 * page 3) mis en page.
 *
 *   node scripts/joueur/recit.mjs parties/<id>.json [> recit.md]
 */
import { readFileSync } from 'node:fs';

const chemin = process.argv[2];
if (!chemin) { console.error('usage : node scripts/joueur/recit.mjs parties/<id>.json'); process.exit(2); }
const p = JSON.parse(readFileSync(chemin, 'utf8'));
const camp = p.coach.camp === 'w' ? 'Blancs' : 'Noirs';
const SORTES = { livre: 'livre', calcul: 'calcul', defense: 'défense', plan: 'plan', amelioration: 'amélioration', finale: 'finale' };
const coach = p.coups.filter((c) => c.coach);
const compte = (f) => coach.reduce((m, c) => { const k = f(c); m[k] = (m[k] ?? 0) + 1; return m; }, {});
const sortes = compte((c) => SORTES[c.sorte] ?? c.sorte), sous = compte((c) => `${c.sorte}/${c.sousSorte}`);
const ex = p.examen;
const L = [];
L.push(`# Partie du coach joueur : ${p.id}`);
L.push('');
const detailAdv = [p.adversaire.graine != null ? `graine ${p.adversaire.graine}` : '', p.adversaire.tirage ?? '', p.adversaire.profondeur ? `profondeur ${p.adversaire.profondeur}` : '', p.adversaire.bride === false ? 'pleine force' : p.adversaire.elo ? `bridé à ${p.adversaire.elo} Elo` : ''].filter(Boolean).join(', ');
L.push(`**Le coach a les ${camp}** contre ${p.adversaire.nom}${detailAdv ? ` (${detailAdv})` : ''}. ` +
  `Budget de recherche ${p.coach.budget.toLocaleString('fr-FR')} positions par coup, un fil, code \`${p.coach.code}\`. ` +
  `**Résultat : ${p.resultat}** (${p.raison}, ${p.plies} demi-coups).`);
L.push('');
const DEPART_STANDARD = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
if (p.depart && p.depart !== DEPART_STANDARD) {
  L.push(`**Démonstration depuis une position du panel, hors critère.** La partie ne commence pas au premier coup mais à la position \`${p.depart}\` : elle sert à montrer le coach quand il reconnaît une structure et adopte un plan, elle ne compte pour aucune des cinq conditions.`);
  L.push('');
}
L.push('Tous les coups du coach sont les siens : aucun moteur n\'est consulté pendant la partie. Stockfish n\'intervient qu\'après, comme examinateur.');
L.push('');
if (ex) {
  L.push(`**Examen après coup** (${ex.moteur ?? 'Stockfish'}, profondeur ${ex.profondeur}) : ${ex.coups} coups du coach, **${ex.bevues} bévue(s)** (plus d'un pion perdu), ${ex.fautes} faute(s) (entre un demi-pion et un pion), ${ex.exclus} exclu(s) (coups uniques ou position déjà jouée)` + (ex.tauxBevues != null ? `, taux de bévues ${(ex.tauxBevues * 100).toFixed(1)} %` : '') + '.');
  if (ex.parPhase) L.push('Par phase : ' + Object.entries(ex.parPhase).map(([ph, v]) => `${ph} ${v.coups} coups, ${v.bevues} bévue(s)`).join(' ; ') + '.');
  L.push('');
}
L.push(`**Sortes de phrases** (${coach.length} coups du coach) : ` + Object.entries(sortes).map(([k, v]) => `${k} ${v}`).join(', ') + '.');
const pref = sous['amelioration/prefere'] ?? 0;
L.push(`Détail : ` + Object.entries(sous).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') + `. Part des « je suis mieux sans raison unique à nommer » : ${pref} sur ${coach.length} (${Math.round(100 * pref / coach.length)} %).`);
L.push(`Alertes de parole (menace non parée sous une phrase de plan ou d'amélioration) : ${coach.filter((c) => c.alerte).length}.`);
const nPlan = coach.filter((c) => c.sorte === 'plan').length;
L.push('');
L.push(nPlan ? `**Plans** : ${nPlan} coup(s) expliqué(s) par un plan de la grammaire.` : '**Plans : aucun.** Aucun coup de cette partie n\'est expliqué par un plan : le coach n\'adopte un plan que lorsqu\'il reconnaît une structure de pions de sa grammaire (pion isolé, Carlsbad, chaîne française, hérisson, Maróczy…), et cette partie n\'en a traversé aucune. Il n\'a donc parlé qu\'en calcul, défense, amélioration et livre.');
L.push(`**Budget de recherche** : ${p.coach.budget.toLocaleString('fr-FR')} positions pour la recherche principale de chaque coup ; la re-recherche des meilleurs candidats (pour un score exact) et la recherche de la menace adverse s'y ajoutent, d'où des totaux par coup au-dessus du budget.`);
L.push('');
L.push('---');
L.push('');
L.push('## La partie, coup par coup');
L.push('');
L.push('Pour chaque coup du coach : la phrase qu\'il prononce, puis entre crochets la sorte, et en retrait le « pourquoi » tel que le lecteur du site le montre.');
L.push('');
const num = (c) => { const n = Math.ceil(c.ply / 2); return c.ply % 2 ? `${n}.` : `${n}…`; };
const ligne = (sans, ply) => { if (!sans?.length) return ''; return sans.map((s, i) => { const q = ply + i, n = Math.ceil(q / 2); return q % 2 ? `${n}.${s}` : i === 0 ? `${n}…${s}` : s; }).join(' '); };
for (const c of p.coups) {
  if (!c.coach) { L.push(`**${num(c)}${c.san}** (${p.adversaire.nom})`); L.push(''); continue; }
  L.push(`**${num(c)}${c.san}** — ${c.phrase} \`[${SORTES[c.sorte] ?? c.sorte}${c.sousSorte ? ' / ' + c.sousSorte : ''}]\``);
  const pq = [];
  if (c.ligne?.length > 1) pq.push(`ligne calculée : ${ligne(c.ligne, c.ply)}`);
  if (c.battu) pq.push(c.battu.seValent ? `coup battu : ${c.battu.san} (se valent)` : `coup battu : ${c.battu.san}, ${c.battu.ecart} centièmes de moins`);
  if (c.menace) pq.push(`menace vue : ${ligne(c.menace.ligne, c.ply + 1)} (${c.menace.perte}), ${c.menace.pareeApresM ? 'parée' : 'NON parée'} après ${c.san}`);
  if (c.termes?.length) pq.push('termes cités : ' + c.termes.map((t) => `${t.nom}${t.quoi ? ' (' + t.quoi + ')' : ''} ${t.apres > 0 ? '+' : ''}${t.apres}`).join(', '));
  if (c.plan) pq.push(`plan : ${c.plan.nom}${c.plan.distanceApres != null ? `, distance ${c.plan.distanceAvant} → ${c.plan.distanceApres}` : ''}, cumul ${c.plan.cumul ?? 0}${c.plan.abandon ? `, abandon (${c.plan.abandon})` : ''}`);
  if (c.motif) pq.push(`motif : ${c.motif}`);
  pq.push(`recherche : profondeur ${c.profondeur}, ${c.noeuds.toLocaleString('fr-FR')} positions, ${c.ms} ms ; score ${c.score} (avant : ${c.evalAvant})`);
  if (c.examen) pq.push(`examinateur : ${c.examen.verdict}${c.examen.perte != null ? ` (${c.examen.perte > 0 ? '−' : '+'}${Math.abs(c.examen.perte)} centièmes)` : ''}, phase ${c.examen.phase}`);
  if (c.alerte) pq.push(`ALERTE : ${c.alerte}`);
  for (const x of pq) L.push(`  - ${x}`);
  L.push('');
}
process.stdout.write(L.join('\n') + '\n');
