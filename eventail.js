/**
 * L'éventail d'une ouverture (maquette du 18 octobre 2026, branchée dans l'assistant le 24 octobre).
 * L'arbre du livre en anneaux concentriques : le centre est une position, chaque anneau un demi-coup de plus, la part
 * d'un secteur est la taille de son sous-arbre. L'éventail suit l'échiquier : le chemin joué depuis le début reste
 * allumé, la position courante est cerclée, le centre se recentre deux demi-coups en arrière pour garder la route en
 * vue ; ce secteur garde une part visible même s'il a peu de suites. Clic sur un secteur = l'échiquier va à cette position (via `surClic`). SVG maison, aucune dépendance.
 */
const NS = 'http://www.w3.org/2000/svg';
const FR = { N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' };
const fr = (san) => (san ?? '').replace(/^[NBRQK]/, (c) => FR[c]).replace(/=([NBRQ])/, (_, c) => '=' + FR[c]);
const num = (ply) => (ply % 2 === 1 ? `${(ply + 1) / 2}.` : `${ply / 2}…`);
const PAL = ['#7bd389', '#ff6b6b', '#ffa94d', '#c084fc', '#4dd4e6', '#f9c74f', '#f28ab2', '#a3b18a', '#90caf9', '#e76f51', '#b5e48c', '#d4a373'];
const R0 = 78, R1 = 490, RECUL = 3, PART_CHEMIN = 0.15; // le secteur du chemin joué garde au moins 15 % de l'angle de son parent

// --- pur:début
/**
 * Arbre à partir d'une liste de positions `{ coups, nom?, kind?, porte? }` (coups = SAN séparés par des espaces).
 * Le parent d'une position est la même ligne moins le dernier coup ; une position dont le parent manque est rattachée
 * au plus proche ancêtre connu. Renvoie la racine (position de départ, créée si absente) et l'index par coups.
 */
export function construireArbre(liste) {
  const parCoups = new Map();
  const noeud = (coups) => ({ coups, ply: coups ? coups.split(' ').length : 0, san: coups ? coups.split(' ').at(-1) : null, enfants: [], kind: null, nom: null, portes: [] });
  for (const p of liste) { const k = (p.coups ?? '').trim(); const n = parCoups.get(k) ?? noeud(k); n.nom = p.nom ?? n.nom; if (p.portes) n.portes = p.portes; parCoups.set(k, n); }
  if (!parCoups.has('')) parCoups.set('', noeud(''));
  for (const p of liste) for (const m of p.suites ?? []) { const c = parCoups.get(`${(p.coups ?? '').trim()} ${m.san}`.trim()); if (c && !c.kind) c.kind = m.kind; }
  for (const n of parCoups.values()) {
    if (!n.coups) continue;
    let k = n.coups.split(' ').slice(0, -1).join(' ');
    while (!parCoups.has(k)) k = k.split(' ').slice(0, -1).join(' ');
    n.parent = parCoups.get(k); n.parent.enfants.push(n);
  }
  const ordre = (n) => (n.kind === 'principal' ? 0 : n.kind === 'variante' ? 1 : 2);
  for (const n of parCoups.values()) n.enfants.sort((a, b) => ordre(a) - ordre(b));
  const racine = parCoups.get('');
  const taille = (n) => (n.taille = 1 + n.enfants.reduce((s, c) => s + taille(c), 0));
  taille(racine);
  return { racine, parCoups };
}
/** Le nœud le plus profond du livre sur la ligne jouée, et si la ligne sort du livre. */
export function situer(arbre, coups) {
  let n = arbre.racine; // un trou dans la ligne (position intermédiaire absente du livre) est sauté, comme dans construireArbre
  for (let i = 1; i <= coups.length; i++) { const c = arbre.parCoups.get(coups.slice(0, i).join(' ')); if (c) n = c; }
  return { noeud: n, horsLivre: n.coups !== coups.join(' ') };
}
// --- pur:fin

export function creerEventail(hote, { surClic = () => {} } = {}) {
  hote.innerHTML = `<svg class="evt__scene" viewBox="-500 -500 1000 1000" role="img" aria-label="Éventail de l'ouverture"></svg>
    <div class="evt__barre"><button type="button" class="btn evt__vue" title="Voir tout l'arbre depuis la position de départ">Vue d'ensemble</button><span class="evt__info"></span></div>`;
  const svg = hote.querySelector('svg'), info = hote.querySelector('.evt__info'), btnVue = hote.querySelector('.evt__vue');
  const el = (n, attrs = {}, parent = svg) => { const e = document.createElementNS(NS, n); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const gSect = el('g'), gTxt = el('g'), gCentre = el('g', { class: 'evt__centre' });
  const secteurs = new Map(); // nœud → path
  let arbre = null, centre = null, courant = null, horsLivre = false, ensemble = false, geomCourante = new Map(), anim = null;
  let chemin = new Set();

  // Couleur : par branche au premier embranchement sous le centre (à la racine : après le 3e coup blanc).
  let plyBranche = 5, couleurBranche = new Map();
  const brancheDe = (p) => { let q = p; while (q && q.ply > plyBranche) q = q.parent; return q && q.ply === plyBranche ? q : null; };
  function recolorer() {
    plyBranche = Math.max(5, centre.ply + 1);
    const sous = []; const rec = (p) => { if (p.ply === plyBranche) { sous.push(p); return; } for (const e of p.enfants) rec(e); }; rec(centre);
    sous.sort((a, b) => b.taille - a.taille);
    couleurBranche = new Map(sous.map((b, i) => [b, PAL[i % PAL.length]]));
  }
  const teinte = (c, k) => {
    const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = Math.min(0.35, k * 0.045);
    return `rgb(${Math.round(r + (255 - r) * f)},${Math.round(g + (255 - g) * f)},${Math.round(b + (255 - b) * f)})`;
  };
  const couleur = (p, prof) => { const b = brancheDe(p); const c = b && couleurBranche.get(b); return c ? teinte(c, prof) : b ? '#6b7280' : (prof % 2 ? '#2d6bb4' : '#3b7fcb'); };

  const unitesParPx = () => 1000 / Math.max(240, svg.getBoundingClientRect().width || 1000);
  const PROF = () => (svg.getBoundingClientRect().width < 420 ? 5 : 6);
  const parts = (p, a0, a1) => {
    const E = p.enfants; if (!E.length) return [];
    const brut = E.reduce((s, c) => s + c.taille, 0);
    const poids = E.map((c) => (chemin.has(c) && E.length > 1 ? Math.max(c.taille, brut * PART_CHEMIN) : c.taille)), tot = poids.reduce((s, w) => s + w, 0); let a = a0;
    return E.map((c, i) => { const w = (a1 - a0) * (poids[i] / tot); const r = [c, a, a + w]; a += w; return r; });
  };
  function disposition() {
    const prof = PROF(), ep = (R1 - R0) / prof, out = new Map();
    const rec = (p, a0, a1, k) => {
      if (k > prof) return;
      for (const [e, b0, b1] of parts(p, a0, a1)) { const r0 = R0 + (k - 1) * ep; out.set(e, { n: e, prof: k, r0, r1: r0 + ep - 1.5, a0: b0, a1: b1 }); rec(e, b0, b1, k + 1); }
    };
    rec(centre, 0, 2 * Math.PI, 1);
    return out;
  }
  const arc = (r0, r1, a0, a1) => {
    const g = (r, a) => [r * Math.cos(a - Math.PI / 2), r * Math.sin(a - Math.PI / 2)];
    if (a1 - a0 < 1e-4 || r1 - r0 < 0.5) return 'M0,0';
    if (a1 - a0 >= 2 * Math.PI - 1e-6) { const [x0, y0] = g(r1, 0), [x2, y2] = g(r1, Math.PI), [u0, v0] = g(r0, 0), [u2, v2] = g(r0, Math.PI);
      return `M${x0},${y0}A${r1},${r1} 0 1 1 ${x2},${y2}A${r1},${r1} 0 1 1 ${x0},${y0}M${u0},${v0}A${r0},${r0} 0 1 0 ${u2},${v2}A${r0},${r0} 0 1 0 ${u0},${v0}Z`; }
    const [x0, y0] = g(r1, a0), [x1, y1] = g(r1, a1), [x2, y2] = g(r0, a1), [x3, y3] = g(r0, a0), gr = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0},${y0}A${r1},${r1} 0 ${gr} 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 ${gr} 0 ${x3},${y3}Z`;
  };

  function etats() {
    for (const [n, path] of secteurs) {
      path.classList.toggle('evt--chemin', chemin.has(n));
      path.classList.toggle('evt--ici', n === courant);
      path.classList.toggle('evt--loin', chemin.size > 0 && !chemin.has(n) && !estSous(n, courant));
    }
  }
  const estSous = (n, a) => { for (let q = n; q; q = q.parent) if (q === a) return true; return false; };
  function peindre(geom) {
    for (const [n, g] of geom) {
      let path = secteurs.get(n);
      if (!path) { path = el('path', { class: 'evt__sect' }, gSect); path.__n = n; secteurs.set(n, path); }
      path.setAttribute('d', arc(g.r0, g.r1, g.a0, g.a1)); path.setAttribute('fill', couleur(n, g.prof));
    }
    for (const [n, path] of secteurs) if (!geom.has(n)) { path.remove(); secteurs.delete(n); }
    etats();
  }
  function etiquettes(geom) {
    gTxt.innerHTML = '';
    const u = unitesParPx(), fs = 11 * u;
    for (const g of geom.values()) {
      const am = (g.a0 + g.a1) / 2, rm = (g.r0 + g.r1) / 2, larg = (g.a1 - g.a0) * rm, ep = g.r1 - g.r0;
      const texte = fr(g.n.san), longueur = texte.length * fs * 0.62;
      const radial = longueur <= ep - 6 * u && larg >= fs * 1.2;
      const tangent = !radial && longueur <= larg - 6 * u && ep >= fs * 1.1;
      if (!radial && !tangent) continue;
      const deg = (am * 180) / Math.PI, bas = deg > 90 && deg < 270;
      const t = el('text', { 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': fs }, gTxt);
      t.textContent = texte;
      // le long du rayon, ou le long de l'arc ; retourné dans la moitié basse pour rester lisible
      t.setAttribute('transform', radial ? (bas ? `rotate(${deg + 90}) translate(${-rm},0)` : `rotate(${deg - 90}) translate(${rm},0)`)
        : (bas ? `rotate(${deg + 180}) translate(0,${rm})` : `rotate(${deg}) translate(0,${-rm})`));
    }
  }
  function peindreCentre() {
    gCentre.innerHTML = '';
    const u = unitesParPx(), fs = 13 * u;
    el('circle', { r: R0 - 4, class: 'evt__rond' }, gCentre);
    const coups = centre.coups ? centre.coups.split(' ') : [];
    const lignes = coups.length ? [`${num(centre.ply)}${fr(coups.at(-1))}`] : ['Départ'];
    if (centre.nom) lignes.push(centre.nom.length > 16 ? centre.nom.slice(0, 15) + '…' : centre.nom);
    lignes.forEach((s, i) => { const t = el('text', { x: 0, y: (i - (lignes.length - 1) / 2) * fs * 1.25, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': i ? fs * 0.75 : fs }, gCentre); t.textContent = s; });
  }
  function finir(geom) { geomCourante = geom; peindre(geom); etiquettes(geom); peindreCentre(); legende(); }
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function transition(cible, duree = 420) {
    if (anim) cancelAnimationFrame(anim);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finir(cible); return; }
    const depart = geomCourante, ids = new Set([...depart.keys(), ...cible.keys()]);
    gTxt.innerHTML = '';
    const de = (n) => depart.get(n) ?? { ...cible.get(n), r0: R1, r1: R1 }, vers = (n) => cible.get(n) ?? depart.get(n);
    for (const n of ids) if (!secteurs.has(n)) { const p = el('path', { class: 'evt__sect' }, gSect); p.__n = n; secteurs.set(n, p); }
    etats();
    const t0 = performance.now();
    const pas = (now) => {
      const t = Math.min(1, (now - t0) / duree), k = ease(t);
      for (const n of ids) {
        const a = de(n), b = vers(n), path = secteurs.get(n);
        path.setAttribute('d', arc(a.r0 + (b.r0 - a.r0) * k, a.r1 + (b.r1 - a.r1) * k, a.a0 + (b.a0 - a.a0) * k, a.a1 + (b.a1 - a.a1) * k));
        path.setAttribute('fill', couleur(b.n, b.prof)); path.style.opacity = cible.has(n) ? '' : 1 - k;
      }
      if (t < 1) anim = requestAnimationFrame(pas); else { anim = null; for (const p of secteurs.values()) p.style.opacity = ''; finir(cible); }
    };
    anim = requestAnimationFrame(pas);
  }
  function legende(survol = null) {
    const n = survol ?? courant;
    if (!n) { info.textContent = ''; return; }
    const ligne = n.coups ? n.coups.split(' ').map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + fr(s)).join(' ') : 'position de départ';
    const sous = n.taille - 1;
    info.textContent = survol ? `${ligne} · ${sous ? `${sous} position${sous > 1 ? 's' : ''} du livre en dessous` : 'fin de la ligne du livre'} · clic pour y aller`
      : `${horsLivre ? 'Hors du livre après ' : 'Tu es ici : '}${ligne}${horsLivre ? '' : ` · ${sous ? `${sous} position${sous > 1 ? 's' : ''} du livre devant toi` : 'fin de la ligne du livre'}`}`;
  }
  function recentrer(anime = true) {
    let c = courant; if (!ensemble) while (c.parent && c.ply > courant.ply - RECUL) c = c.parent;
    if (!ensemble && !c.enfants.length && c.parent) c = c.parent;
    else if (ensemble) { // tout l'arbre, en sautant le tronc sans embranchement (1.e4 e5 2.Cf3 Cc6 3.Fc4 dans l'Italienne)
      c = arbre.racine; while (c.enfants.length === 1 && c !== courant && estSous(courant, c.enfants[0])) c = c.enfants[0];
    }
    const change = c !== centre; centre = c; recolorer();
    if (change && anime) transition(disposition()); else finir(disposition());
  }

  svg.addEventListener('pointerover', (ev) => {
    if (ev.pointerType === 'touch') return; const path = ev.target.closest?.('path.evt__sect'); if (!path) return;
    const n = path.__n; for (const [m, p] of secteurs) p.classList.toggle('evt--survol', estSous(n, m) && m.ply > centre.ply);
    legende(n);
  });
  svg.addEventListener('pointerleave', () => { for (const p of secteurs.values()) p.classList.remove('evt--survol'); legende(); });
  svg.addEventListener('click', (ev) => {
    if (ev.target.closest('.evt__centre')) { const v = courant !== centre ? centre : centre.parent; if (v) surClic(v.coups ? v.coups.split(' ') : []); return; } // centre : y revenir, puis remonter
    const path = ev.target.closest('path.evt__sect'); if (path) surClic(path.__n.coups.split(' '));
  });
  btnVue.addEventListener('click', () => { ensemble = !ensemble; btnVue.setAttribute('aria-pressed', ensemble); btnVue.textContent = ensemble ? 'Suivre l\'échiquier' : 'Vue d\'ensemble'; if (arbre) recentrer(); });
  let minuteur; addEventListener('resize', () => { clearTimeout(minuteur); minuteur = setTimeout(() => arbre && finir(disposition()), 150); });

  return {
    /** Charge l'arbre d'un livre (liste de positions, voir `construireArbre`). */
    charger(liste) { arbre = construireArbre(liste); centre = null; courant = arbre.racine; chemin = new Set(); for (const p of secteurs.values()) p.remove(); secteurs.clear(); geomCourante = new Map(); },
    /** Redessine à la taille actuelle (après un repli/dépli du bloc). */
    redessiner() { if (arbre && centre) finir(disposition()); },
    /** Suit la ligne jouée sur l'échiquier (tableau de SAN). */
    suivre(coups) {
      if (!arbre) return;
      const s = situer(arbre, coups); courant = s.noeud; horsLivre = s.horsLivre;
      chemin = new Set(); for (let q = courant; q && q.parent; q = q.parent) chemin.add(q);
      hote.classList.toggle('evt--hors', horsLivre);
      if (!centre) { centre = arbre.racine; recentrer(false); } else recentrer();
    },
  };
}
