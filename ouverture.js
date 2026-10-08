/**
 * Assistant d'ouverture (maquette, 8 octobre 2026). Échiquier compact + récit coup par coup à partir du livre
 * (coach/openings/francaise.mjs). Survol d'un coup : aperçu muet de l'enchaînement (ligne principale du livre sur 6 demi-coups),
 * clic : on joue le coup et on lit sa phrase. « Suivant » déroule la ligne principale phrase par phrase.
 */
import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { LIVRE, OUVERTURE, positionsDuLivre } from './livres/francaise.js';
import { PUNITIONS } from './livres/francaise-punitions.js';

const $ = (id) => document.getElementById(id);
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const fr = (san) => san.replace(/[KQRBN]/g, (m) => FR[m]);
const PIECE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const livre = positionsDuLivre(Chess);
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');

let game = new Chess();
let orientation = 'white';
let apercu = null; // { timer, saved: Chess }
let recit = null; // punition en cours : { coups: string[], i, cle, retourFen, bonCoup }

function entree(c = game) { return livre.get(cle(c)) ?? null; }
function numero(c, san) { const n = Math.ceil((c.history().length + 1) / 2); return c.turn() === 'w' ? `${n}. ${fr(san)}` : `${n}… ${fr(san)}`; }

function render(lastMove = null) {
  selected = null; targets = [];
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: lastMove ?? dernier(), targets: [] });
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
  $('ouvNom').textContent = e?.nom ?? OUVERTURE;
  const etat = $('ouvEtat'); etat.textContent = e ? '' : 'hors du livre';
  const recit = $('ouvRecit'); recit.innerHTML = '';
  if (!last) {
    recit.innerHTML = `<p>La <span class="qui">Défense française</span> commence par 1. e4 e6 : les Noirs préparent …d5 pour contester le centre avec un pion soutenu. Clique sur un coup à droite, ou sur « Suivant », pour dérouler la ligne principale phrase par phrase.</p>`;
  } else {
    const qui = last.color === 'w' ? 'Les Blancs' : 'Les Noirs';
    if (e) {
      recit.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> — ${qui} ${e.sens ? sensPhrase(e.sens) : 'jouent un coup du livre.'}</p>`;
      if (e.menace) recit.innerHTML += `<p class="menace">Menace : ${e.menace}.</p>`;
    } else {
      recit.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> — <span class="hors">ce coup n'est pas dans le livre : il n'est pas forcément mauvais, mais personne ne l'a encore expliqué ici. Reviens en arrière pour voir les coups connus.</span></p>`;
    }
  }
  // coups du livre (plan) pour le camp au trait
  const liste = $('ouvListeCoups'); liste.innerHTML = '';
  const plan = e?.plan ?? [];
  if (!plan.length) { liste.innerHTML = `<div class="hors">Le livre s'arrête ici pour cette ligne.</div>`; }
  plan.forEach((p, i) => liste.append(carte(p.san, p.pourquoi, i === 0 ? 'principal' : 'variante', false)));
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
  const pun = clePunition ? PUNITIONS[clePunition] : null;
  d.innerHTML = `<div class="coup__san">${fr(san)}<small>${tag}</small></div><div class="coup__why">${pourquoi}${pun ? ` <span class="coup__pun">— punition : ${pun.ligne.map(fr).join(' ')}</span>` : ''}</div>`;
  d.addEventListener('mouseenter', () => demarrerApercu(san, pun ? pun.ligne : null));
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
  $('btnRembobiner')?.addEventListener('click', () => { const fen = r.retourFen; const h = game.history(); const n = h.length - 1 - 0; recit = null; game = new Chess(); const hist = h; let k = 0; const c = new Chess(); for (const s of hist) { if (c.fen() === fen) break; c.move(s); k++; } for (const s of hist.slice(0, k)) game.move(s); render(); if (r.bon) jouer(r.bon.san); });
  $('ouvEtat').textContent = 'récit d\'une faute';
}
function pasRecit() {
  if (!recit) return false;
  if (recit.i >= recit.coups.length) return true;
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
}

function jouer(san) { recit = null; try { game.move(san); } catch { return; } render(); }

// Déplacement des pièces : clic sur une pièce puis sur une case cible, ou glisser-déposer (comme la page de jeu).
let selected = null; let targets = [];
function refreshBoard() { renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets, dragFrom: selected }); }
function tenter(from, to) {
  selected = null; targets = [];
  try { game.move({ from, to, promotion: 'q' }); } catch { refreshBoard(); return; }
  render();
}
bindPlayBoardInput($('ouvBoard'), {
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
$('btnRetour').addEventListener('click', () => { recit = null; game.undo(); render(); });
$('btnSuivant').addEventListener('click', () => { if (pasRecit()) return; const e = entree(); const s = e?.plan?.[0]?.san; if (s) jouer(s); });
$('btnTourner').addEventListener('click', () => { orientation = orientation === 'white' ? 'black' : 'white'; render(); });
render();
