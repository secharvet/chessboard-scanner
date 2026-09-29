/**
 * Catalogue des plans nommés de la théorie, écrits dans le vocabulaire des atomes (docs/PLANS-ET-CONCEPTS.md,
 * §3 bis). Chaque recette est une suite ordonnée d'événements d'un même camp ; les libellés sont ceux de
 * scripts/emergence-humain.mjs (label des atomes, « → concept » pour un déséquilibre réalisé) :
 *   levier·D|C|R, espace·D|C|R, échange XxY (X = ce que je cède, Y = ce que je prends ; P C F T D),
 *   manœuvre C|F|T|D, doublement (colonne|rangee), tour 7e, petit roque, grand roque, marche du roi,
 *   → tour_colonne, → cavalier_avant_poste, → blocage, → rupture, → affaiblir, → dominer,
 *   → attaque_minorite, → baionnette.
 * « * » = n'importe quelle aile ou pièce. `structure` : nom de STRUCTURE requis au départ (facultatif).
 * Sert à nommer les motifs qui émergent, et à mesurer quels plans des livres les humains jouent, par niveau.
 */

export const RECETTES = [
  // ── Structure de pions ──
  { nom: 'Attaque de minorité', source: 'Carlsbad (Soltis)', structure: 'CARLSBAD', suite: ['levier·D', '→ affaiblir', 'manœuvre T'], niveau: 'avancé' },
  { nom: 'Rupture centrale', source: 'Nimzowitsch, le centre', suite: ['levier·C', '→ rupture'], niveau: 'intermédiaire' },
  { nom: 'Rupture puis colonne', source: 'Nimzowitsch, la colonne ouverte', suite: ['levier·*', '→ rupture', '→ tour_colonne'], niveau: 'intermédiaire' },
  { nom: 'Ouvrir puis occuper la colonne', source: 'Nimzowitsch', suite: ['échange PxP', '→ tour_colonne'], niveau: 'intermédiaire' },
  { nom: 'Gain d\'espace puis liquidation', source: 'principe : échanger quand on a l\'espace', suite: ['espace·*', 'échange PxP'], niveau: 'intermédiaire' },
  { nom: 'Gain d\'espace puis manœuvre', source: 'Pachman, l\'espace', suite: ['espace·*', 'manœuvre *'], niveau: 'intermédiaire' },
  { nom: 'Affaiblir par le levier', source: 'Soltis, leviers', suite: ['levier·*', '→ affaiblir'], niveau: 'avancé' },
  { nom: 'Affaiblir par l\'échange', source: 'Nimzowitsch, les pions doublés', suite: ['échange FxC', '→ affaiblir'], niveau: 'avancé' },
  { nom: 'Affaiblir par l\'échange (cavalier)', source: 'Nimzowitsch, les pions doublés', suite: ['échange CxF', '→ affaiblir'], niveau: 'avancé' },
  { nom: 'Avance de la majorité', source: 'Capablanca, la majorité', suite: ['espace·*', 'levier·*', '→ rupture'], niveau: 'avancé' },
  // ── Pièces lourdes ──
  { nom: 'Colonne puis 7e rangée', source: 'Nimzowitsch, la 7e rangée', suite: ['→ tour_colonne', 'tour 7e'], niveau: 'intermédiaire' },
  { nom: 'Colonne puis doublement', source: 'Nimzowitsch, la colonne ouverte', suite: ['→ tour_colonne', 'doublement (colonne)'], niveau: 'intermédiaire' },
  { nom: 'Roque puis colonne', source: 'développement classique', suite: ['petit roque', '→ tour_colonne'], niveau: 'débutant' },
  { nom: 'Manœuvre puis doublement', source: 'coordination des pièces', suite: ['manœuvre *', 'doublement (colonne)'], niveau: 'intermédiaire' },
  // ── Pièces mineures ──
  { nom: 'Avant-poste par la manœuvre', source: 'Nimzowitsch, l\'avant-poste', suite: ['manœuvre C', '→ cavalier_avant_poste'], niveau: 'intermédiaire' },
  { nom: 'Blocage du pion faible', source: 'Nimzowitsch, le blocus', suite: ['manœuvre *', '→ blocage'], niveau: 'intermédiaire' },
  { nom: 'Échange du fou de la couleur faible', source: 'Nimzowitsch, complexe de cases', suite: ['échange CxF', '→ dominer'], niveau: 'avancé' },
  { nom: 'Échanger puis installer le cavalier', source: 'bon cavalier contre mauvais fou', suite: ['échange FxC', '→ cavalier_avant_poste'], niveau: 'avancé' },
  { nom: 'Échanger le mauvais fou', source: 'Pachman', suite: ['manœuvre F', 'échange FxF'], niveau: 'avancé' },
  { nom: 'Levier puis avant-poste', source: 'créer le trou, l\'occuper', suite: ['levier·*', '→ cavalier_avant_poste'], niveau: 'avancé' },
  // ── Roi ──
  { nom: 'Attaque à la baïonnette', source: 'h4-h5 contre le fianchetto', suite: ['levier·R', '→ baionnette'], niveau: 'avancé' },
  { nom: 'Tempête de pions (roques opposés)', source: 'course des roques opposés', suite: ['grand roque', 'levier·R'], niveau: 'avancé' },
  { nom: 'Échanger le défenseur puis ouvrir', source: 'attaque : retirer le défenseur', suite: ['échange CxC', 'levier·R'], niveau: 'avancé' },
  { nom: 'Échanger le fou de fianchetto', source: 'attaque du roque', suite: ['échange FxF', '→ affaiblir'], niveau: 'avancé' },
  { nom: 'Affaiblir le roque puis ouvrir la colonne', source: 'attaque du roi', suite: ['→ affaiblir', 'levier·R', '→ rupture'], niveau: 'avancé' },
  { nom: 'Roquer puis échanger', source: 'sécurité d\'abord', suite: ['petit roque', 'échange *x*'], niveau: 'débutant' },
  // ── Finale ──
  { nom: 'Roi actif', source: 'finales : le roi est une pièce', suite: ['marche du roi'], niveau: 'intermédiaire' },
  { nom: 'Roi actif puis levier', source: 'finales de pions', suite: ['marche du roi', 'levier·*'], niveau: 'intermédiaire' },
  { nom: 'Tour active puis roi', source: 'finales de tours', suite: ['→ tour_colonne', 'marche du roi'], niveau: 'intermédiaire' },
  { nom: 'Simplifier quand on est devant', source: 'technique', suite: ['échange DxD', 'marche du roi'], niveau: 'intermédiaire' },
];

/** Un libellé d'événement correspond-il à un motif du catalogue (« * » = joker sur l'aile ou la pièce) ? */
export function matchLabel(pattern, label) {
  if (pattern === label) return true;
  if (!pattern.includes('*')) return false;
  const re = new RegExp(`^${pattern.replace(/[.()]/g, '\\$&').replace(/\*/g, '[^ ]+')}$`);
  return re.test(label);
}

/** La suite d'événements `events` (libellés ordonnés) contient-elle la recette comme sous-séquence ? */
export function containsRecipe(recette, events) {
  let k = 0;
  for (const e of events) if (k < recette.suite.length && matchLabel(recette.suite[k], e)) k++;
  return k === recette.suite.length;
}

/**
 * Pour un motif (deux libellés ordonnés) : recettes qui le contiennent exactement, sinon les plus proches (même
 * nombre d'éléments en commun en ignorant l'aile ou la pièce). Renvoie { exact: [...], proches: [...] }.
 */
export function nameMotif(a, b) {
  const kind = (l) => l.replace(/·[DCR]$/, '·*').replace(/^(manœuvre|échange) .*/, '$1 *');
  const exact = RECETTES.filter((r) => containsRecipe(r, [a, b]));
  if (exact.length) return { exact, proches: [] };
  const scored = RECETTES.map((r) => {
    const suite = r.suite.map(kind);
    const score = [a, b].filter((x) => suite.some((p) => matchLabel(p, kind(x)) || p === kind(x))).length;
    return { r, score };
  }).filter((x) => x.score > 0).sort((x, y) => y.score - x.score);
  return { exact: [], proches: scored.slice(0, 3).map((x) => ({ nom: x.r.nom, commun: x.score })) };
}
