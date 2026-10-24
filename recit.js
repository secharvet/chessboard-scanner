/**
 * Le récit d'une partie du coach joueur, en texte (Markdown simple) : tous les coups, et pour chaque coup du coach sa
 * phrase et son « pourquoi ». Aucun calcul : c'est le fichier de la partie (contrat, docs/coach-joueur/CHANTIERS page 3)
 * mis en page. Partagé par le site (partie.html, jouer.html : encart à copier) et par scripts/joueur/recit.mjs.
 *
 * Deux tons : `technique: false` (par défaut, pour un lecteur humain : ni profondeur, ni nombre de positions, ni score
 * interne) et `technique: true` (le récit complet du dépôt, avec la trace de la recherche).
 */
const SORTES = { livre: 'livre', calcul: 'calcul', defense: 'défense', plan: 'plan', amelioration: 'amélioration', finale: 'finale' };
const DEPART_STANDARD = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const VERDICTS = { ok: 'rien à signaler', faute: 'faute', bevue: 'bévue', exclu: 'hors compte' };

const num = (c) => { const n = Math.ceil(c.ply / 2); return c.ply % 2 ? `${n}.` : `${n}…`; };
const ligne = (sans, ply) => { if (!sans?.length) return ''; return sans.map((s, i) => { const q = ply + i, n = Math.ceil(q / 2); return q % 2 ? `${n}.${s}` : i === 0 ? `${n}…${s}` : s; }).join(' '); };
const pions = (cp) => `${(Math.abs(cp) / 100).toFixed(2).replace('.', ',')} pion`;
const matTxt = (n) => (n == null ? null : n > 0 ? `mat en ${n}` : `maté en ${-n}`);

function enTete(p, technique, L) {
  const camp = p.coach.camp === 'w' ? 'Blancs' : 'Noirs';
  const adv = p.adversaire ?? {};
  const coach = p.coups.filter((c) => c.coach);
  const ex = p.examen;
  const fini = p.resultat != null;
  L.push(`# Partie du coach joueur : ${p.id ?? ''}`);
  L.push('');
  const detailAdv = [adv.graine != null ? `graine ${adv.graine}` : '', adv.tirage ?? '', adv.profondeur ? `profondeur ${adv.profondeur}` : '', adv.bride === false ? 'pleine force' : adv.elo ? `bridé à ${adv.elo} Elo` : ''].filter(Boolean).join(', ');
  const res = fini ? `**Résultat : ${p.resultat}** (${p.raison}, ${p.plies} demi-coups).` : `**Partie en cours** (${p.coups.length} demi-coups joués).`;
  if (technique) {
    L.push(`**Le coach a les ${camp}** contre ${adv.nom}${detailAdv ? ` (${detailAdv})` : ''}. ` +
      `Budget de recherche ${p.coach.budget.toLocaleString('fr-FR')} positions par coup, un fil, code \`${p.coach.code}\`. ` + res);
  } else {
    L.push(`**Le coach a les ${camp}** contre ${adv.nom ?? '?'}${detailAdv ? ` (${detailAdv})` : ''}. ` + res);
  }
  L.push('');
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
  if (!coach.length) return;
  const compte = (f) => coach.reduce((m, c) => { const k = f(c); m[k] = (m[k] ?? 0) + 1; return m; }, {});
  const sortes = compte((c) => SORTES[c.sorte] ?? c.sorte);
  L.push(`**Sortes de phrases** (${coach.length} coups du coach) : ` + Object.entries(sortes).map(([k, v]) => `${k} ${v}`).join(', ') + '.');
  if (technique) {
    const sous = compte((c) => `${c.sorte}/${c.sousSorte}`);
    const pref = sous['amelioration/prefere'] ?? 0;
    L.push(`Détail : ` + Object.entries(sous).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') + `. Part des « je suis mieux sans raison unique à nommer » : ${pref} sur ${coach.length} (${Math.round(100 * pref / coach.length)} %).`);
    L.push(`Alertes de parole (menace non parée sous une phrase de plan ou d'amélioration) : ${coach.filter((c) => c.alerte).length}.`);
  }
  const nPlan = coach.filter((c) => c.sorte === 'plan').length;
  L.push('');
  L.push(nPlan ? `**Plans** : ${nPlan} coup(s) expliqué(s) par un plan de la grammaire.` : '**Plans : aucun.** Aucun coup de cette partie n\'est expliqué par un plan : le coach n\'adopte un plan que lorsqu\'il reconnaît une structure de pions de sa grammaire (pion isolé, Carlsbad, chaîne française, hérisson, Maróczy…), et cette partie n\'en a traversé aucune. Il n\'a donc parlé qu\'en calcul, défense, amélioration et livre.');
  if (technique) L.push(`**Budget de recherche** : ${p.coach.budget.toLocaleString('fr-FR')} positions pour la recherche principale de chaque coup ; la re-recherche des meilleurs candidats (pour un score exact) et la recherche de la menace adverse s'y ajoutent, d'où des totaux par coup au-dessus du budget.`);
  L.push('');
}

function examenTxt(ex) {
  const m = ex.mat;
  if (m && (m.avant != null || m.apres != null)) return `${VERDICTS[ex.verdict] ?? ex.verdict} (${matTxt(m.avant) ?? pions(ex.avant)} → ${matTxt(m.apres) ?? pions(ex.apres)})`;
  if (ex.perte != null && ex.perte > 0 && ex.verdict !== 'ok') return `${VERDICTS[ex.verdict] ?? ex.verdict} (${pions(ex.perte)} perdu)`;
  return VERDICTS[ex.verdict] ?? ex.verdict;
}

/** Le « pourquoi » d'un coup du coach, en clair (sans la trace de la recherche) : une ligne de texte par élément. */
export function pourquoiHumain(c) {
  const pq = [];
  if (c.ligne?.length > 1) pq.push(`ce que j'ai calculé : ${ligne(c.ligne, c.ply)}`);
  if (c.battu) pq.push(c.battu.seValent ? `j'ai aussi regardé ${c.battu.san} : il se vaut` : `j'ai aussi regardé ${c.battu.san} : moins bon de ${pions(c.battu.ecart)}`);
  if (c.menace) pq.push(`la menace que j'ai vue : ${ligne(c.menace.ligne, c.ply + 1)} (${c.menace.perte}), ${c.menace.pareeApresM ? 'parée' : 'NON parée'} après ${c.san}`);
  if (c.termes?.length) pq.push('ce qui a pesé : ' + c.termes.map((t) => `${t.nom}${t.quoi ? ' (' + t.quoi + ')' : ''}`).join(', '));
  if (c.plan) pq.push(`mon plan : ${c.plan.nom}${c.plan.distanceApres != null ? `, il me reste ${c.plan.distanceApres} étape(s) (avant ce coup : ${c.plan.distanceAvant})` : ''}${c.plan.abandon ? `, abandonné (${c.plan.abandon})` : ''}`);
  if (c.motif) pq.push(`motif : ${c.motif}`);
  if (c.examen) pq.push(`Stockfish après coup : ${examenTxt(c.examen)}`);
  return pq;
}

function pourquoiTechnique(c) {
  const pq = [];
  if (c.ligne?.length > 1) pq.push(`ligne calculée : ${ligne(c.ligne, c.ply)}`);
  if (c.battu) pq.push(c.battu.seValent ? `coup battu : ${c.battu.san} (se valent)` : `coup battu : ${c.battu.san}, ${c.battu.ecart} centièmes de moins`);
  if (c.menace) pq.push(`menace vue : ${ligne(c.menace.ligne, c.ply + 1)} (${c.menace.perte}), ${c.menace.pareeApresM ? 'parée' : 'NON parée'} après ${c.san}`);
  if (c.termes?.length) pq.push('termes cités : ' + c.termes.map((t) => `${t.nom}${t.quoi ? ' (' + t.quoi + ')' : ''} ${t.apres > 0 ? '+' : ''}${t.apres}`).join(', '));
  if (c.plan) pq.push(`plan : ${c.plan.nom}${c.plan.distanceApres != null ? `, distance ${c.plan.distanceAvant} → ${c.plan.distanceApres}` : ''}, cumul ${c.plan.cumul ?? 0}${c.plan.abandon ? `, abandon (${c.plan.abandon})` : ''}`);
  if (c.motif) pq.push(`motif : ${c.motif}`);
  pq.push(`recherche : profondeur ${c.profondeur}, ${c.noeuds.toLocaleString('fr-FR')} positions, ${c.ms} ms ; score ${c.score} (avant : ${c.evalAvant})`);
  if (c.examen) {
    const ex = c.examen, m = ex.mat;
    const detail = m && (m.avant != null || m.apres != null) ? ` (${matTxt(m.avant) ?? `${ex.avant} centièmes`} → ${matTxt(m.apres) ?? `${ex.apres} centièmes`})` : ex.perte != null ? ` (${ex.perte > 0 ? '−' : '+'}${Math.abs(ex.perte)} centièmes)` : '';
    pq.push(`examinateur : ${ex.verdict}${detail}, phase ${ex.phase}`);
  }
  if (c.alerte) pq.push(`ALERTE : ${c.alerte}`);
  return pq;
}

/** Le récit complet d'une partie `p` (même forme que parties/<id>.json ; une partie en cours convient aussi). */
export function recitTexte(p, { technique = false } = {}) {
  const L = [];
  enTete(p, technique, L);
  const nomAdv = p.adversaire?.nom ?? 'adversaire';
  L.push('---');
  L.push('');
  L.push('## La partie, coup par coup');
  L.push('');
  L.push(technique
    ? 'Pour chaque coup du coach : la phrase qu\'il prononce, puis entre crochets la sorte, et en retrait le « pourquoi » tel que le lecteur du site le montre.'
    : 'Pour chaque coup du coach : la phrase qu\'il prononce, la sorte entre crochets, puis en retrait ce qu\'il a calculé et ce qu\'en dit Stockfish après la partie.');
  L.push('');
  for (const c of p.coups) {
    if (!c.coach) { L.push(`**${num(c)}${c.san}** (${nomAdv})`); L.push(''); continue; }
    L.push(technique
      ? `**${num(c)}${c.san}** — ${c.phrase} \`[${SORTES[c.sorte] ?? c.sorte}${c.sousSorte ? ' / ' + c.sousSorte : ''}]\``
      : `**${num(c)}${c.san}** — ${c.phrase ?? '(pas de phrase)'} [${SORTES[c.sorte] ?? c.sorte}]`);
    for (const x of technique ? pourquoiTechnique(c) : pourquoiHumain(c)) L.push(`  - ${x}`);
    L.push('');
  }
  return L.join('\n') + '\n';
}
