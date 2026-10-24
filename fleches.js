/**
 * Annotations d'échiquier partagées (16 octobre 2026) : couleurs par type, géométrie des flèches et des cases
 * surlignées, dessin SVG par-dessus l'échiquier de play-board.js, et aides pures sur le contenu d'une explication.
 * Les fonctions pures (sans DOM) sont testables en Node : COULEURS, coordCase, basculerCase, basculerFleche,
 * contentVide, normaliserContent.
 */

/** Couleur d'annotation → teinte. Les noms viennent du contrat de l'API (content.annotations[].couleur). */
export const COULEURS = { vert: '#3ee6b5', bleu: '#6ea8ff', rouge: '#ff6b6b', orange: '#ffb86b' };
/** Type de coup proposé → couleur d'annotation. */
export const COULEUR_PAR_TYPE = { principal: 'vert', variante: 'bleu', faute: 'rouge', porte: 'orange' };
/** Ordre du cycle des couleurs au clic répété sur une case : vert → bleu → rouge → orange → retrait. */
export const CYCLE = ['vert', 'bleu', 'rouge', 'orange'];

/** Centre d'une case dans le repère SVG 0..100 (12,5 par case), selon l'orientation de l'échiquier. */
export function coordCase(sq, orientation = 'white') {
  const f = sq.charCodeAt(0) - 97; const r = Number(sq[1]) - 1;
  const x = orientation === 'white' ? f : 7 - f; const y = orientation === 'white' ? 7 - r : r;
  return [x * 12.5 + 6.25, y * 12.5 + 6.25];
}

/** Clic sur une case : ajoute en `couleur` si absente, passe à la couleur suivante du cycle si présente, retire après orange. Renvoie une nouvelle liste. */
export function basculerCase(annotations, sq, couleur = 'vert') {
  const i = annotations.findIndex((a) => a.type === 'case' && a.case === sq);
  if (i < 0) return [...annotations, { type: 'case', case: sq, couleur }];
  const k = CYCLE.indexOf(annotations[i].couleur);
  const suite = annotations.slice(0, i).concat(annotations.slice(i + 1));
  if (k < 0 || k === CYCLE.length - 1) return suite;
  return [...suite, { type: 'case', case: sq, couleur: CYCLE[k + 1] }];
}

/** Flèche de→a : la pose en `couleur` ; refaire la même flèche (mêmes cases) la retire. Renvoie une nouvelle liste. */
export function basculerFleche(annotations, de, a, couleur = 'vert') {
  if (!de || !a || de === a) return annotations;
  const i = annotations.findIndex((x) => x.type === 'fleche' && x.de === de && x.a === a);
  if (i >= 0) return annotations.slice(0, i).concat(annotations.slice(i + 1));
  return [...annotations, { type: 'fleche', de, a, couleur }];
}

/** Contenu vide d'une explication (forme du contrat, §4 de la spécification). */
export function contentVide() {
  return { nom: '', sens: '', menace: '', schema: { blancs: '', noirs: '' }, annotations: [], coups: [] };
}

/** Met un contenu (peut-être partiel ou ancien) dans la forme attendue, sans rien perdre. */
export function normaliserContent(c) {
  const v = contentVide(); if (!c || typeof c !== 'object') return v;
  v.nom = String(c.nom ?? ''); v.sens = String(c.sens ?? ''); v.menace = String(c.menace ?? '');
  v.schema = { blancs: String(c.schema?.blancs ?? ''), noirs: String(c.schema?.noirs ?? '') };
  v.annotations = Array.isArray(c.annotations) ? c.annotations.filter(annotationValide) : [];
  v.coups = Array.isArray(c.coups) ? c.coups.map((x) => ({
    move_id: x.move_id, pourquoi: String(x.pourquoi ?? ''),
    annotations: Array.isArray(x.annotations) ? x.annotations.filter(annotationValide) : [],
    ...(x.sequence?.pas?.length ? { sequence: { pas: x.sequence.pas.map((p) => ({ san: String(p.san), phrase: String(p.phrase ?? ''), annotations: Array.isArray(p.annotations) ? p.annotations.filter(annotationValide) : [] })), ...(x.sequence.eval != null ? { eval: x.sequence.eval } : {}), ...(x.sequence.origine ? { origine: x.sequence.origine } : {}) } } : {}),
  })) : [];
  return v;
}
const CASE = /^[a-h][1-8]$/;
export function annotationValide(a) {
  if (!a || !(a.couleur in COULEURS)) return false;
  if (a.type === 'case') return CASE.test(a.case ?? '');
  if (a.type === 'fleche') return CASE.test(a.de ?? '') && CASE.test(a.a ?? '') && a.de !== a.a;
  return false;
}

/**
 * Dessine cases surlignées et flèches dans l'échiquier rendu par play-board.js (élément .board).
 * `fleches` : [{de, a, couleur (hex ou nom), epais?, opacite?}] ; `cases` : [{case, couleur}].
 */
export function dessinerAnnotations(boardEl, { cases = [], fleches = [] } = {}, orientation = 'white') {
  const wrap = boardEl?.querySelector('.fen-board-wrap'); if (!wrap) return;
  wrap.querySelector('.fen-board__arrows')?.remove();
  if (!cases.length && !fleches.length) return;
  const NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'fen-board__arrows'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
  const teinte = (c) => COULEURS[c] ?? c;
  for (const c of cases) {
    const [x, y] = coordCase(c.case, orientation); const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x - 6.25); r.setAttribute('y', y - 6.25); r.setAttribute('width', 12.5); r.setAttribute('height', 12.5);
    r.setAttribute('fill', teinte(c.couleur)); r.setAttribute('opacity', '0.45'); svg.appendChild(r);
  }
  for (const a of fleches) {
    const [x1, y1] = coordCase(a.de, orientation); const [x2, y2] = coordCase(a.a, orientation);
    const dx = x2 - x1, dy = y2 - y1; const len = Math.hypot(dx, dy); if (!len) continue;
    const ux = dx / len, uy = dy / len; const marge = 3.2, tete = 3.6, larg = a.epais ? 2.6 : 1.9; const op = a.opacite ?? (a.epais ? 0.95 : 0.75);
    const sx = x1 + ux * marge, sy = y1 + uy * marge; const ex = x2 - ux * tete, ey = y2 - uy * tete;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', sx); line.setAttribute('y1', sy); line.setAttribute('x2', ex); line.setAttribute('y2', ey);
    line.setAttribute('stroke', teinte(a.couleur)); line.setAttribute('stroke-width', larg); line.setAttribute('stroke-linecap', 'round'); line.setAttribute('opacity', op);
    svg.appendChild(line);
    const px = -uy, py = ux; const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', `${x2 - ux * 1.2},${y2 - uy * 1.2} ${ex + px * 2.4},${ey + py * 2.4} ${ex - px * 2.4},${ey - py * 2.4}`);
    poly.setAttribute('fill', teinte(a.couleur)); poly.setAttribute('opacity', op); svg.appendChild(poly);
  }
  wrap.appendChild(svg);
}
