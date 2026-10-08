/**
 * Assistant d'ouverture (maquette, 8 octobre 2026). Échiquier compact + récit coup par coup à partir du livre
 * (coach/openings/francaise.mjs). Survol d'un coup : aperçu muet de l'enchaînement (ligne principale du livre sur 6 demi-coups),
 * clic : on joue le coup et on lit sa phrase. « Suivant » déroule la ligne principale phrase par phrase.
 */
import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { getEngineMove } from './stockfish-client.js';
import { LIVRES } from './livres/index.js';

const $ = (id) => document.getElementById(id);
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const fr = (san) => san.replace(/[KQRBN]/g, (m) => FR[m]);
const PIECE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
// Tous les livres sont chargés ; `courant` est celui qu'on suit, et on bascule automatiquement vers un autre livre
// quand la position jouée n'est plus dans le courant mais existe ailleurs (les Noirs disposent !).
const BOOKS = {};
for (const L of LIVRES) {
  const [m, p] = await Promise.all([import(L.module), import(L.punitions).catch(() => ({ PUNITIONS: {} }))]);
  BOOKS[L.id] = { ...L, LIVRE: m.LIVRE, OUVERTURE: m.OUVERTURE, map: m.positionsDuLivre(Chess), PUNITIONS: p.PUNITIONS ?? {} };
}
let courant = LIVRES[0].id;
const livre = { // même interface qu'une Map, mais sur tous les livres, le courant d'abord
  get(k) { const b = BOOKS[courant]; if (b.map.has(k)) return b.map.get(k); for (const id in BOOKS) { if (id !== courant && BOOKS[id].map.has(k)) { basculer(id); return BOOKS[id].map.get(k); } } return undefined; },
  has(k) { return Object.values(BOOKS).some((b) => b.map.has(k)); },
};
function basculer(id) {
  if (id === courant) return; courant = id; const sel = $('ouvSelect'); if (sel && sel.value !== id) sel.value = id;
  const n = $('ouvNom'); if (n) n.dataset.bascule = `On passe à « ${BOOKS[id].OUVERTURE} » : c'est ce que la position annonce.`;
}
const OUVERTURE_COURANTE = () => BOOKS[courant].OUVERTURE;
const PUNITIONS_COURANTES = () => BOOKS[courant].PUNITIONS;

let game = new Chess();
let orientation = 'white';
let apercu = null; // { timer, saved: Chess }
let recit = null; // punition en cours : { coups: string[], i, cle, retourFen, bonCoup }

const RACINE = { plan: [{ san: 'e4', pourquoi: 'ouvre le centre et libère la dame et le fou roi : le premier coup des deux livres (Française, Italienne) ; ce sont les Noirs qui choisiront l\'ouverture' }] };
function entree(c = game) { return livre.get(cle(c)) ?? (c.history().length === 0 ? RACINE : null); }
function numero(c, san) { const n = Math.ceil((c.history().length + 1) / 2); return c.turn() === 'w' ? `${n}. ${fr(san)}` : `${n}… ${fr(san)}`; }


/** Flèches des coups proposés : vert = coup principal, bleu = variantes, rouge = fautes typiques, orange = coup survolé. */
const COULEUR = { principal: '#3ee6b5', variante: '#6ea8ff', erreur: '#ff6b6b', survol: '#ffb86b' };
function coordCase(sq) { const f = sq.charCodeAt(0) - 97; const r = Number(sq[1]) - 1; const x = orientation === 'white' ? f : 7 - f; const y = orientation === 'white' ? 7 - r : r; return [x * 12.5 + 6.25, y * 12.5 + 6.25]; }
function dessinerFleches(fleches) {
  const wrap = $('ouvBoard').querySelector('.fen-board-wrap'); if (!wrap) return;
  wrap.querySelector('.fen-board__arrows')?.remove();
  if (!fleches.length) return;
  const NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'fen-board__arrows'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
  for (const a of fleches) {
    const [x1, y1] = coordCase(a.from); const [x2, y2] = coordCase(a.to); const dx = x2 - x1, dy = y2 - y1; const len = Math.hypot(dx, dy); if (!len) continue;
    const ux = dx / len, uy = dy / len; const marge = 3.2, tete = 3.6, larg = a.epais ? 2.6 : 1.9;
    const sx = x1 + ux * marge, sy = y1 + uy * marge; const ex = x2 - ux * tete, ey = y2 - uy * tete;
    const line = document.createElementNS(NS, 'line'); line.setAttribute('x1', sx); line.setAttribute('y1', sy); line.setAttribute('x2', ex); line.setAttribute('y2', ey);
    line.setAttribute('stroke', a.couleur); line.setAttribute('stroke-width', larg); line.setAttribute('stroke-linecap', 'round'); line.setAttribute('opacity', a.epais ? '0.95' : '0.75'); svg.appendChild(line);
    const px = -uy, py = ux; const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', `${x2 - ux * 1.2},${y2 - uy * 1.2} ${ex + px * 2.4},${ey + py * 2.4} ${ex - px * 2.4},${ey - py * 2.4}`); poly.setAttribute('fill', a.couleur); poly.setAttribute('opacity', a.epais ? '0.95' : '0.75'); svg.appendChild(poly);
  }
  wrap.appendChild(svg);
}
function flechesDuLivre(surlign = null) {
  const e = entree(); if (!e) return [];
  const out = []; const c = game.fen();
  const ajouter = (san, type) => { const t = new Chess(c); let m; try { m = t.move(san); } catch { return; } out.push({ from: m.from, to: m.to, couleur: surlign === san ? COULEUR.survol : COULEUR[type], epais: surlign === san || type === 'principal' }); };
  (e.plan ?? []).forEach((p, i) => ajouter(p.san, i === 0 ? 'principal' : 'variante'));
  (e.erreurs ?? []).forEach((x) => ajouter(x.san, 'erreur'));
  return out;
}

function render(lastMove = null) {
  selected = null; targets = [];
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: lastMove ?? dernier(), targets: [] });
  if (!recit) dessinerFleches(flechesDuLivre());
  renderLigne(); if (recit) afficherRecit(); else renderPanneau();
}
function dernier() { const h = game.history({ verbose: true }); const m = h.at(-1); return m ? { from: m.from, to: m.to } : null; }

function renderLigne() {
  const h = game.history(); const el = $('ouvLigne'); el.innerHTML = '';
  if (!h.length) { el.textContent = 'Position de départ'; return; }
  h.forEach((san, i) => {
    if (i % 2 === 0) { const n = document.createElement('span'); n.textContent = `${i / 2 + 1}. `; el.append(n); }
    const s = document.createElement('span'); s.className = 'mv' + (i === h.length - 1 ? ' mv--cur' : ''); s.textContent = fr(san) + ' '; s.title = 'Revenir ici';
    s.addEventListener('click', () => { allerA(i + 1); }); el.append(s);
  });
}
function allerA(n) { recit = null; const h = game.history(); game = new Chess(); for (const san of h.slice(0, n)) game.move(san); render(); }

function renderPanneau() {
  const e = entree(); const h = game.history({ verbose: true }); const last = h.at(-1);
  $('ouvNom').textContent = e?.nom ?? OUVERTURE_COURANTE();
  const etat = $('ouvEtat'); etat.textContent = e ? (e.auteur ? `${e.auteur}${e.date ? ' · ' + e.date : ''}` : '') : 'hors du livre';
  const recit = $('ouvRecit'); recit.innerHTML = '';
  const nomEl = $('ouvNom'); if (nomEl?.dataset.bascule) { recit.innerHTML += `<p class="bascule">${nomEl.dataset.bascule}</p>`; delete nomEl.dataset.bascule; }
  if (!last) {
    recit.innerHTML += `<p>Deux livres pour l'instant : la <span class="qui">Défense française</span> (1. e4 e6) et la <span class="qui">Partie italienne</span> (1. e4 e5 2. Cf3 Cc6 3. Fc4). Les Blancs proposent 1. e4, les Noirs choisissent ; l'assistant suit automatiquement le livre que la position annonce. Clique sur un coup à droite, ou sur « Suivant », pour dérouler la ligne principale phrase par phrase.</p>`;
    if (!e || e === RACINE) { /* la racine n'a pas de texte de livre : on garde l'introduction */ }
  } else {
    const qui = last.color === 'w' ? 'Les Blancs' : 'Les Noirs';
    if (e) {
      recit.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> — ${qui} ${e.sens ? sensPhrase(e.sens) : 'jouent un coup du livre.'}</p>`;
      if (e.menace) recit.innerHTML += `<p class="menace">Menace : ${e.menace}.</p>`;
    } else {
      const n = game.history().length;
      const hint = n <= 2 ? ` Les livres écrits commencent par <b>1. e4 e6</b> (Française) ou <b>1. e4 e5</b> (Italienne) : ce coup mène ailleurs.` : '';
      recit.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> — <span class="hors">ce coup n'est pas dans le livre : il n'est pas forcément mauvais, mais personne ne l'a encore expliqué ici.${hint} « Retour » pour revenir aux coups connus.</span></p>`;
    }
  }
  // coups du livre (plan) pour le camp au trait
  const liste = $('ouvListeCoups'); liste.innerHTML = '';
  const plan = e?.plan ?? [];
  if (!plan.length) { liste.innerHTML = `<div class="hors">Le livre s'arrête ici pour cette ligne.</div>`; }
  plan.forEach((p, i) => liste.append(carte(p.san, p.pourquoi + (p.porte ? ' <span class="coup__pun">— autre ouverture, livre à venir</span>' : ''), p.porte ? 'autre livre' : (i === 0 ? 'principal' : 'variante'), false)));
  // erreurs
  const err = e?.erreurs ?? []; $('ouvErreurs').hidden = !err.length; const le = $('ouvListeErreurs'); le.innerHTML = '';
  err.forEach((x) => le.append(carte(x.san, x.pourquoi, 'à éviter', true, `${e.coups} ${x.san}`)));
  // schéma
  const sch = e?.schema; $('ouvSchema').hidden = !sch;
  if (sch) $('ouvSchemaCorps').innerHTML = `<div class="ouv__schema"><div><b>Les Blancs</b>${sch.blancs ?? ''}${sch.coupsBlancs ? `<br><small>${fr(sch.coupsBlancs)}</small>` : ''}</div><div><b>Les Noirs</b>${sch.noirs ?? ''}${sch.coupsNoirs ? `<br><small>${fr(sch.coupsNoirs)}</small>` : ''}</div></div>`;
}
function avant() { const h = game.history(); const c = new Chess(); for (const s of h.slice(0, -1)) c.move(s); return c; }
function sensPhrase(s) { return s.replace(/^son /, 'leur ').replace(/\bson\b/g, 'leur').replace(/\bsa\b/g, 'leur').replace(/\bses\b/g, 'leurs') + (/[.!?]$/.test(s) ? '' : '.'); }

function carte(san, pourquoi, tag, erreur, clePunition = null) {
  const d = document.createElement('div'); d.className = 'coup' + (tag === 'principal' ? ' coup--principal' : '') + (erreur ? ' coup--erreur' : '');
  const pun = clePunition ? PUNITIONS_COURANTES()[clePunition] : null;
  d.innerHTML = `<div class="coup__san">${fr(san)}<small>${tag}</small></div><div class="coup__why">${pourquoi}${pun ? ` <span class="coup__pun">— punition : ${pun.ligne.map(fr).join(' ')}</span>` : ''}</div>`;
  d.addEventListener('mouseenter', () => { dessinerFleches(flechesDuLivre(san)); demarrerApercu(san, pun ? pun.ligne : null); });
  d.addEventListener('mouseleave', arreterApercu);
  d.addEventListener('click', () => { arreterApercu(); if (pun) demarrerRecit(san, pun, pourquoi); else jouer(san); });
  return d;
}

/** Phrase mécanique pour un demi-coup de punition : prise, échec, pièce attaquée sans défense. */
function phraseCoup(c, san) {
  const who = c.turn() === 'w' ? 'Les Blancs' : 'Les Noirs'; const m = c.move(san); if (!m) return '';
  const bits = [];
  if (m.captured) bits.push(`prennent ${PIECE_FR[m.captured]}${m.captured === 'p' ? '' : ''} en ${m.to}`);
  if (m.san.includes('#')) bits.push('font mat'); else if (m.san.includes('+')) bits.push('donnent échec');
  if (!bits.length && typeof c.attackers === 'function') {
    const other = m.color === 'w' ? 'b' : 'w'; const cibles = [];
    for (const row of c.board()) for (const p of row) {
      if (!p || p.color !== other || p.type === 'k') continue;
      if (c.attackers(p.square, m.color).includes(m.to) && c.attackers(p.square, other).length === 0) cibles.push(`${PIECE_FR[p.type]} ${p.square}`);
    }
    if (cibles.length) bits.push(`attaquent ${cibles.slice(0, 2).join(' et ')}, sans défense`);
  }
  if (!bits.length) bits.push(m.piece === 'p' ? 'avancent le pion' : `replacent ${PIECE_FR[m.piece]}`);
  return `${who} ${bits.join(', ')}.`;
}

/** Récit d'une faute : on joue la faute, puis « Suivant » déroule la punition une phrase à la fois, puis bilan et retour. */
function demarrerRecit(san, pun, pourquoi) {
  const retourFen = game.fen(); const e = entree(); const bon = e?.plan?.[0] ?? null;
  try { game.move(san); } catch { return; }
  recit = { coups: pun.ligne, i: 0, retourFen, bon, pun, pourquoi, fauteSan: san };
  render(); afficherRecit();
}
function afficherRecit() {
  if (!recit) return;
  const r = recit; const box = $('ouvRecit'); const fautif = r.pun.fautif === 'w' ? 'les Blancs' : 'les Noirs';
  let html = `<p><span class="qui faute">Faute : ${fr(r.fauteSan)}</span> — ${r.pourquoi}</p>`;
  for (let k = 0; k < r.i; k++) html += `<p class="pas">${k + 1}. ${r.phrases[k]}</p>`;
  if (r.i < r.coups.length) html += `<p class="hors">« Suivant » joue la réponse (${r.coups.length - r.i} demi-coup${r.coups.length - r.i > 1 ? 's' : ''} restants).</p>`;
  else {
    const perte = Math.abs(r.pun.perte) / 100;
    html += `<p class="bilan">Bilan : au bout de ${Math.ceil(r.coups.length / 2)} coups, ${fautif} ont perdu l'équivalent de ${perte >= 0.95 ? perte.toFixed(1).replace('.', ',') + ' pion' + (perte >= 1.95 ? 's' : '') : 'une demi-position (' + perte.toFixed(2).replace('.', ',') + ' pion)'}${r.pun.mat ? ', et c\'est mat' : ''}. Voilà pourquoi on ne joue pas ${fr(r.fauteSan)}.</p>`;
    if (r.bon) html += `<p><button class="btn btn--primary" id="btnRembobiner">⏪ Revenir et jouer ${fr(r.bon.san)}</button> <span class="hors">${r.bon.pourquoi}</span></p>`;
    else html += `<p><button class="btn" id="btnRembobiner">⏪ Revenir</button></p>`;
  }
  box.innerHTML = html;
  $('btnRembobiner')?.addEventListener('click', rembobiner);
  $('ouvEtat').textContent = 'récit d\'une faute';
}
function rembobiner() {
  if (!recit) return; const r = recit; const fen = r.retourFen; const hist = game.history(); recit = null;
  const c = new Chess(); let k = 0; for (const s of hist) { if (c.fen() === fen) break; c.move(s); k++; }
  game = new Chess(); for (const s of hist.slice(0, k)) game.move(s); render(); if (r.bon) jouer(r.bon.san);
}
function pasRecit() {
  if (!recit) return false;
  if (recit.i >= recit.coups.length) { rembobiner(); return true; }
  recit.phrases = recit.phrases ?? [];
  const c = new Chess(game.fen()); recit.phrases.push(phraseCoup(c, recit.coups[recit.i])); game.move(recit.coups[recit.i]); recit.i++;
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets: [] }); renderLigne(); afficherRecit();
  return true;
}

/** Aperçu muet : on joue le coup, puis la ligne principale du livre, un demi-coup toutes les 700 ms, sans toucher au récit. */
function demarrerApercu(san, ligne = null) {
  arreterApercu();
  const c = new Chess(game.fen()); const saved = game; let step = 0; const coups = [san];
  const t = new Chess(game.fen()); try { t.move(san); } catch { return; }
  if (ligne) coups.push(...ligne);
  else for (let i = 0; i < 5; i++) { const e = livre.get(cle(t)); const nxt = e?.plan?.[0]?.san; if (!nxt) break; try { t.move(nxt); coups.push(nxt); } catch { break; } }
  const badge = document.createElement('div'); badge.className = 'ouv__apercu'; badge.textContent = `aperçu : ${coups.map(fr).join(' ')}`; $('ouvBoard').parentElement.append(badge);
  const tick = () => {
    if (step >= coups.length) return;
    const m = c.move(coups[step++]); renderPlayBoard($('ouvBoard'), { fen: c.fen(), orientation, lastMove: { from: m.from, to: m.to }, targets: [] });
    apercu.timer = setTimeout(tick, 700);
  };
  apercu = { timer: setTimeout(tick, 150), saved, badge };
}
function arreterApercu() {
  if (!apercu) return; clearTimeout(apercu.timer); apercu.badge?.remove(); apercu = null;
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets: [] });
  if (!recit) dessinerFleches(flechesDuLivre());
}

function jouer(san) { recit = null; try { game.move(san); } catch { return; } render(); }

// Déplacement des pièces : clic sur une pièce puis sur une case cible, ou glisser-déposer (comme la page de jeu).
let selected = null; let targets = [];
function refreshBoard() { renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets, dragFrom: selected }); if (!recit) dessinerFleches(flechesDuLivre()); }
function tenter(from, to) {
  selected = null; targets = [];
  try { game.move({ from, to, promotion: 'q' }); } catch { refreshBoard(); return; }
  render();
}
bindPlayBoardInput($('ouvBoard'), {
  canInteract: () => true,
  getPiece: (sq) => game.get(sq),
  playerColor: () => game.turn(),
  onSquareClick: (sq) => {
    if (selected && targets.includes(sq)) { tenter(selected, sq); return; }
    const p = game.get(sq);
    if (p && p.color === game.turn()) { selected = sq; targets = game.moves({ square: sq, verbose: true }).map((m) => m.to); }
    else { selected = null; targets = []; }
    refreshBoard();
  },
  onDragStart: (from) => { const p = game.get(from); if (p && p.color === game.turn()) { selected = from; targets = game.moves({ square: from, verbose: true }).map((m) => m.to); refreshBoard(); } },
  onDrop: (from, to) => { if (targets.includes(to)) tenter(from, to); else { selected = null; targets = []; refreshBoard(); } },
  onDragCancel: () => { selected = null; targets = []; refreshBoard(); },
});
$('btnDebut').addEventListener('click', () => { recit = null; game = new Chess(); render(); });
{ const sel = $('ouvSelect'); if (sel) { sel.innerHTML = LIVRES.map((L) => `<option value="${L.id}">${L.nom}</option>`).join(''); sel.value = courant;
  sel.addEventListener('change', () => { courant = sel.value; recit = null; game = new Chess(); for (const m of BOOKS[courant].signature.split(' ')) game.move(m); render(); }); } }
$('btnRetour').addEventListener('click', () => { recit = null; game.undo(); render(); });
$('btnSuivant').addEventListener('click', () => {
  try { if (pasRecit()) return; const e = entree(); const s = e?.plan?.[0]?.san; if (s) jouer(s); else $('ouvEtat').textContent = 'le livre s\'arrête ici'; }
  catch (err) { console.error('[ouverture] Suivant', err); $('ouvEtat').textContent = 'erreur : ' + err.message; }
});
$('btnTourner').addEventListener('click', () => { orientation = orientation === 'white' ? 'black' : 'white'; render(); });
render();


// ---------------------------------------------------------------- Entraînement contre Stockfish (PC), le livre à côté
const ent = { game: new Chess(), couleur: 'w', sel: null, targets: [], pensant: false };
const $ent = $('entBoard');
function entRender() {
  if (!$ent) return;
  const last = ent.game.history({ verbose: true }).at(-1);
  renderPlayBoard($ent, { fen: ent.game.fen(), orientation: ent.couleur === 'w' ? 'white' : 'black', lastMove: last ? { from: last.from, to: last.to } : null, targets: ent.targets, dragFrom: ent.sel });
}
function entEntree() { return livre.get(cle(ent.game)) ?? (ent.game.history().length === 0 ? RACINE : null); }
function entPanneau(note = '') {
  const box = $('entPanneau'); if (!box) return;
  const h = ent.game.history(); const e = entEntree(); const last = ent.game.history({ verbose: true }).at(-1);
  let html = '';
  if (note) html += `<p>${note}</p>`;
  if (last) {
    const qui = last.color === ent.couleur ? 'Toi' : (e ? 'L\'adversaire (suit le livre)' : 'Stockfish');
    if (e) html += `<p><span class="ok">Encore dans le livre.</span> ${qui} : <b>${fr(last.san)}</b>${e.sens ? ' — ' + sensPhrase(e.sens) : ''}</p>`;
    else html += `<p><span class="ko">Hors du livre</span> depuis ${qui === 'Toi' ? 'ton coup' : 'la réponse de Stockfish'} <b>${fr(last.san)}</b>. Le livre n'a rien écrit ici ; « Voir dans le livre » t'amène à la dernière position connue.</p>`;
  }
  if (e?.plan?.length && ent.game.turn() === ent.couleur) html += `<p>Le livre te propose : ${e.plan.map((p, i) => `<b>${fr(p.san)}</b>${i === 0 ? ' (principal)' : ''}`).join(', ')}.</p>`;
  if (ent.game.isGameOver()) html += `<p><b>Partie terminée.</b></p>`;
  html += `<div class="ent__ligne">${h.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + fr(m)).join(' ') || 'Position de départ'}</div>`;
  box.innerHTML = html; $('entEtat').textContent = ent.pensant ? 'Stockfish réfléchit…' : (e ? 'dans le livre' : (h.length ? 'hors du livre' : ''));
}
async function entMoteur() {
  if (ent.game.isGameOver() || ent.game.turn() === ent.couleur) return;
  // Tant que la position est dans le livre, l'adversaire suit le livre (principal 7 fois sur 10, sinon une variante) :
  // c'est le seul moyen de s'entraîner à CETTE ouverture. Hors du livre, Stockfish joue librement.
  // Si plusieurs livres connaissent la position (après 1. e4 : Française et Italienne), l'adversaire tire son livre au sort :
  // tu ne sais pas à l'avance ce qu'il va jouer, comme en vrai.
  const k = cle(ent.game); const livresIci = Object.keys(BOOKS).filter((id) => BOOKS[id].map.has(k));
  const e = livresIci.length > 1 ? BOOKS[livresIci[Math.floor(Math.random() * livresIci.length)]].map.get(k) : entEntree();
  if (e?.plan?.length) {
    const choix = e.plan.length > 1 && Math.random() > 0.7 ? e.plan[1 + Math.floor(Math.random() * (e.plan.length - 1))] : e.plan[0];
    await new Promise((r) => setTimeout(r, 350));
    try { ent.game.move(choix.san); ent.livreCoup = choix; } catch { /* coup illisible : on passe au moteur */ }
    if (ent.game.turn() === ent.couleur) { entRender(); entPanneau(); return; }
  }
  ent.pensant = true; entPanneau();
  try {
    const depth = Number($('entNiveau').value); const r = await getEngineMove(ent.game.fen(), { depth });
    if (r.bestmove && r.bestmove.length >= 4) ent.game.move({ from: r.bestmove.slice(0, 2), to: r.bestmove.slice(2, 4), promotion: r.bestmove[4] || 'q' });
  } catch (err) { console.error('[entraînement] moteur', err); }
  ent.pensant = false; entRender(); entPanneau();
}
function entJouer(from, to) {
  ent.sel = null; ent.targets = [];
  try { ent.game.move({ from, to, promotion: 'q' }); } catch { entRender(); return; }
  entRender(); entPanneau(); entMoteur();
}
if ($ent) {
  bindPlayBoardInput($ent, {
    canInteract: () => !ent.pensant && ent.game.turn() === ent.couleur && !ent.game.isGameOver(),
    getPiece: (sq) => ent.game.get(sq), playerColor: () => ent.couleur,
    onSquareClick: (sq) => { if (ent.sel && ent.targets.includes(sq)) { entJouer(ent.sel, sq); return; } const p = ent.game.get(sq); if (p && p.color === ent.couleur) { ent.sel = sq; ent.targets = ent.game.moves({ square: sq, verbose: true }).map((m) => m.to); } else { ent.sel = null; ent.targets = []; } entRender(); },
    onDragStart: (from) => { const p = ent.game.get(from); if (p && p.color === ent.couleur) { ent.sel = from; ent.targets = ent.game.moves({ square: from, verbose: true }).map((m) => m.to); entRender(); } },
    onDrop: (from, to) => { if (ent.targets.includes(to)) entJouer(from, to); else { ent.sel = null; ent.targets = []; entRender(); } },
    onDragCancel: () => { ent.sel = null; ent.targets = []; entRender(); },
  });
  const nouvelle = () => { ent.game = new Chess(); ent.couleur = $('entCouleur').value; orientation = ent.couleur === 'w' ? 'white' : 'black'; render(); ent.sel = null; ent.targets = []; entRender(); entPanneau(ent.couleur === 'b' ? 'Nouvelle partie : Stockfish a les Blancs et commence.' : 'Nouvelle partie : à toi.'); entMoteur(); };
  $('entNouvelle').addEventListener('click', nouvelle);
  $('entCouleur').addEventListener('change', nouvelle);
  $('entLivre').addEventListener('click', () => {
    // amener l'échiquier du livre sur la dernière position de la partie connue du livre
    const h = ent.game.history(); let n = h.length; const c = new Chess();
    const connu = []; for (let i = 0; i < h.length; i++) { c.move(h[i]); if (livre.has(cle(c))) connu.push(i + 1); }
    n = connu.length ? connu.at(-1) : 0; recit = null; game = new Chess(); for (const s of h.slice(0, n)) game.move(s); render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  entRender(); entPanneau(); entMoteur();
}
