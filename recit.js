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

/** Un coup du coach est-il de la forme « arbre » (joueur-arbre) plutôt que « sorte » (joueur.mjs) ? */
export const estArbre = (c) => Array.isArray(c?.candidats);
const PASTILLE_SORTE = { plan: { libelle: 'plan', couleur: '#4e9a06' }, amelioration: { libelle: 'amélioration', couleur: '#3465a4' }, defense: { libelle: 'défense', couleur: '#c17d11' }, calcul: { libelle: 'calcul', couleur: '#a40000' }, livre: { libelle: 'livre', couleur: '#5c3566' }, finale: { libelle: 'finale', couleur: '#4e9a06' } };
/** Le « mot du nœud » et sa couleur, par nœud de l'arbre (le radar en orange, le forcé en rouge, le plan en vert/bleu/violet). */
export const NOEUDS = {
  '1a': { libelle: 'échec', couleur: '#c17d11' }, '1b': { libelle: 'mat menacé', couleur: '#c17d11' }, '1c': { libelle: 'pièce en prise', couleur: '#c17d11' }, '1d': { libelle: 'dernière rangée', couleur: '#c17d11' }, '1e': { libelle: 'clouage', couleur: '#c17d11' }, '1f': { libelle: 'sa menace', couleur: '#c17d11' },
  '2a': { libelle: 'mat', couleur: '#a40000' }, '2b': { libelle: 'prise qui gagne', couleur: '#a40000' }, '2c': { libelle: 'intermédiaire', couleur: '#a40000' }, '2d': { libelle: 'double attaque', couleur: '#a40000' }, '2e': { libelle: 'tactique', couleur: '#a40000' },
  '3L': { libelle: 'livre', couleur: '#5c3566' }, '3P': { libelle: 'ma pire pièce', couleur: '#4e9a06' }, '3Y': { libelle: 'prophylaxie', couleur: '#3465a4' }, '3C': { libelle: 'mon plan', couleur: '#4e9a06' },
};
/** La pastille (libellé + couleur) d'un coup du coach, qu'il soit de la forme « arbre » (nœud) ou « sorte ». */
export function pastilleDe(c) {
  if (estArbre(c)) return (c.trou || c.noeud == null) ? { libelle: 'calcul', couleur: '#555' } : (NOEUDS[c.noeud] ?? { libelle: c.noeud, couleur: '#555' });
  return PASTILLE_SORTE[c.sorte] ?? { libelle: c.sorte, couleur: '#555' };
}

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
  if (coach.some(estArbre)) { // partie de la forme « arbre » : résumé par étape et par classe de trou
    const ET = { 1: 'étape 1 (ses menaces)', 2: 'étape 2 (mes coups forcés)', 3: 'étape 3 (plan)', trou: 'trou' };
    const parEt = compte((c) => (c.trou ? 'trou' : c.noeud ? c.noeud[0] : 'trou'));
    L.push(`**Nœuds de l'arbre** (${coach.length} coups du coach) : ` + Object.entries(parEt).map(([k, v]) => `${ET[k] ?? k} ${v}`).join(', ') + '.');
    const trous = coach.filter((c) => c.trou);
    if (trous.length) { const parCl = trous.reduce((m, c) => { m[c.trou.classe] = (m[c.trou.classe] ?? 0) + 1; return m; }, {}); L.push(`**Trous** (${trous.length} sur ${coach.length}, ${Math.round(100 * trous.length / coach.length)} %) : ` + Object.entries(parCl).map(([k, v]) => `${k} ${v}`).join(', ') + '.'); }
    else L.push('**Trous : aucun** (la recherche complète n\'a battu l\'arbre sur aucun coup — ou la mesure du trou était éteinte).');
    if (technique) L.push(`Alertes de parole : ${coach.filter((c) => c.alerte).length}. Coups qui disent un coup écarté : ${coach.filter((c) => c.ecarte).length}.`);
    L.push('');
    return;
  }
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

/** Le « pourquoi » d'un coup de la forme « arbre », en clair : ce qui a produit le coup, ce qu'il a écarté, ce qu'il a pesé. */
function pourquoiArbreHumain(c) {
  const pq = [];
  if (c.ligne?.length > 1) pq.push(`ce que j'ai calculé : ${ligne(c.ligne, c.ply)}`);
  if (c.ecarte) pq.push(`j'ai pensé à ${c.ecarte.san} : ${ligne(c.ecarte.ligne, c.ply)}, et je perdais ${c.ecarte.perte}`);
  const autres = (c.candidats ?? []).filter((x) => x.coup !== c.choisi && x.raison).slice(0, 3);
  if (autres.length) pq.push('j\'ai aussi pesé : ' + autres.map((x) => `${x.san} (${x.raison})`).join(' ; '));
  if (c.trou) pq.push('mon calcul trouvait mieux que mes idées sur ce coup');
  if (c.examen) pq.push(`Stockfish après coup : ${examenTxt(c.examen)}`);
  return pq;
}

/** Le « pourquoi » d'un coup de la forme « arbre », version complète (nœud, candidats comparés, trou, recherche). */
function pourquoiArbreTechnique(c) {
  const pq = [];
  pq.push(`nœud : ${c.noeud ?? 'trou'}${c.raison ? ' — ' + c.raison : ''}`);
  if (c.ligne?.length) pq.push(`ligne calculée : ${ligne(c.ligne, c.ply)}`);
  if (c.candidats?.length) pq.push('candidats comparés : ' + c.candidats.map((x) => `${x.san} [${x.noeud ?? '—'}] ${x.score}`).join(', '));
  if (c.ecarte) pq.push(`écarté : ${c.ecarte.san} — ${ligne(c.ecarte.ligne, c.ply)} (perd ${c.ecarte.perte})`);
  if (c.trou) pq.push(`TROU : ${c.trou.classe}${c.trou.noeud ? ` (${c.trou.noeud})` : ''}, l'arbre était en ${c.trou.etapeArbre ?? '—'}`);
  pq.push(`recherche : profondeur ${c.profondeur}, ${(c.noeuds ?? 0).toLocaleString('fr-FR')} positions, ${c.ms} ms ; score ${c.score} (avant : ${c.evalAvant})`);
  if (c.examen) { const ex = c.examen, m = ex.mat; const detail = m && (m.avant != null || m.apres != null) ? ` (${matTxt(m.avant) ?? `${ex.avant} centièmes`} → ${matTxt(m.apres) ?? `${ex.apres} centièmes`})` : ex.perte != null ? ` (${ex.perte > 0 ? '−' : '+'}${Math.abs(ex.perte)} centièmes)` : ''; pq.push(`examinateur : ${ex.verdict}${detail}, phase ${ex.phase}`); }
  if (c.alerte) pq.push(`ALERTE : ${c.alerte}`);
  return pq;
}

/** Le « pourquoi » d'un coup du coach, en clair (sans la trace de la recherche) : une ligne de texte par élément. */
export function pourquoiHumain(c) {
  if (estArbre(c)) return pourquoiArbreHumain(c);
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
  if (estArbre(c)) return pourquoiArbreTechnique(c);
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
    const etiquette = estArbre(c) ? pastilleDe(c).libelle : `${SORTES[c.sorte] ?? c.sorte}${technique && c.sousSorte ? ' / ' + c.sousSorte : ''}`;
    L.push(technique
      ? `**${num(c)}${c.san}** — ${c.phrase} \`[${etiquette}]\``
      : `**${num(c)}${c.san}** — ${c.phrase ?? '(pas de phrase)'} [${etiquette}]`);
    for (const x of technique ? pourquoiTechnique(c) : pourquoiHumain(c)) L.push(`  - ${x}`);
    L.push('');
  }
  return L.join('\n') + '\n';
}
