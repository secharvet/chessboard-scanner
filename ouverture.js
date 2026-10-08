/**
 * Assistant d'ouverture (maquette, 8 octobre 2026). Échiquier compact + récit coup par coup à partir du livre
 * (coach/openings/francaise.mjs). Survol d'un coup : aperçu muet de l'enchaînement (ligne principale du livre sur 6 demi-coups),
 * clic : on joue le coup et on lit sa phrase. « Suivant » déroule la ligne principale phrase par phrase.
 */
import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { LIVRE, OUVERTURE, positionsDuLivre } from './livres/francaise.js';

const $ = (id) => document.getElementById(id);
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const fr = (san) => san.replace(/[KQRBN]/g, (m) => FR[m]);
const PIECE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const livre = positionsDuLivre(Chess);
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');

let game = new Chess();
let orientation = 'white';
let apercu = null; // { timer, saved: Chess }

function entree(c = game) { return livre.get(cle(c)) ?? null; }
function numero(c, san) { const n = Math.ceil((c.history().length + 1) / 2); return c.turn() === 'w' ? `${n}. ${fr(san)}` : `${n}… ${fr(san)}`; }

function render(lastMove = null) {
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: lastMove ?? dernier(), targets: [] });
  renderLigne(); renderPanneau();
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
function allerA(n) { const h = game.history(); game = new Chess(); for (const san of h.slice(0, n)) game.move(san); render(); }

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
  err.forEach((x) => le.append(carte(x.san, x.pourquoi, 'à éviter', true)));
  // schéma
  const sch = e?.schema; $('ouvSchema').hidden = !sch;
  if (sch) $('ouvSchemaCorps').innerHTML = `<div class="ouv__schema"><div><b>Les Blancs</b>${sch.blancs ?? ''}${sch.coupsBlancs ? `<br><small>${fr(sch.coupsBlancs)}</small>` : ''}</div><div><b>Les Noirs</b>${sch.noirs ?? ''}${sch.coupsNoirs ? `<br><small>${fr(sch.coupsNoirs)}</small>` : ''}</div></div>`;
}
function avant() { const h = game.history(); const c = new Chess(); for (const s of h.slice(0, -1)) c.move(s); return c; }
function sensPhrase(s) { return s.replace(/^son /, 'leur ').replace(/\bson\b/g, 'leur').replace(/\bsa\b/g, 'leur').replace(/\bses\b/g, 'leurs') + (/[.!?]$/.test(s) ? '' : '.'); }

function carte(san, pourquoi, tag, erreur) {
  const d = document.createElement('div'); d.className = 'coup' + (tag === 'principal' ? ' coup--principal' : '') + (erreur ? ' coup--erreur' : '');
  d.innerHTML = `<div class="coup__san">${fr(san)}<small>${tag}</small></div><div class="coup__why">${pourquoi}</div>`;
  d.addEventListener('mouseenter', () => demarrerApercu(san));
  d.addEventListener('mouseleave', arreterApercu);
  d.addEventListener('click', () => { arreterApercu(); jouer(san); });
  return d;
}

/** Aperçu muet : on joue le coup, puis la ligne principale du livre, un demi-coup toutes les 700 ms, sans toucher au récit. */
function demarrerApercu(san) {
  arreterApercu();
  const c = new Chess(game.fen()); const saved = game; let step = 0; const coups = [san];
  const t = new Chess(game.fen()); try { t.move(san); } catch { return; }
  for (let i = 0; i < 5; i++) { const e = livre.get(cle(t)); const nxt = e?.plan?.[0]?.san; if (!nxt) break; try { t.move(nxt); coups.push(nxt); } catch { break; } }
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

function jouer(san) { try { game.move(san); } catch { return; } render(); }

bindPlayBoardInput($('ouvBoard'), {
  onSelect: (sq) => { const p = game.get(sq); if (p && p.color === game.turn()) renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets: game.moves({ square: sq, verbose: true }).map((m) => m.to), dragFrom: sq }); },
  onMove: (from, to) => { try { game.move({ from, to, promotion: 'q' }); } catch { render(); return; } render(); },
  onDragStart: () => {}, onDragCancel: () => render(),
});
$('btnDebut').addEventListener('click', () => { game = new Chess(); render(); });
$('btnRetour').addEventListener('click', () => { game.undo(); render(); });
$('btnSuivant').addEventListener('click', () => { const e = entree(); const s = e?.plan?.[0]?.san; if (s) jouer(s); });
$('btnTourner').addEventListener('click', () => { orientation = orientation === 'white' ? 'black' : 'white'; render(); });
render();
