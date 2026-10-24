/**
 * « Faire jouer le coach » (jouer.html) : une seule partie pour tout le site, jouée côté serveur. Les visiteurs ASSISTENT
 * via un flux SSE (`/api/joueur/en-cours/flux`) ; un enseignant/admin peut en lancer une (`POST /api/joueur/parties`).
 * L'échiquier suit, chaque coup du coach affiche sa phrase (pastille + « pourquoi »), et à la fin un lien vers le lecteur.
 */
import { Chess } from '/vendor/chess.js';
import { renderFenBoard } from './board-view.js';

const $ = (id) => document.getElementById(id);
const SORTES = { plan: { l: 'plan', c: '#4e9a06' }, amelioration: { l: 'amélioration', c: '#3465a4' }, defense: { l: 'défense', c: '#c17d11' }, calcul: { l: 'calcul', c: '#a40000' }, livre: { l: 'livre', c: '#5c3566' } };
const VERDICTS = { ok: 'rien à signaler', faute: 'faute', bevue: 'bévue', exclu: 'hors compte' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); // phrases/traces échappées (défense)
const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const vue = { chess: null, orientation: 'white', vus: new Set(), id: null, camp: 'w', fini: false };
let source = null, sondage = null;

function erreur(msg) { const e = $('jouErreur'); e.textContent = msg; e.hidden = false; }

function reset(depart, camp) {
  vue.chess = new Chess(depart || DEPART); vue.orientation = camp === 'b' ? 'black' : 'white'; vue.vus = new Set(); vue.camp = camp; vue.fini = false;
  $('jouCoups').innerHTML = ''; $('jouFin').hidden = true; $('jouTrace').hidden = true; $('jouPourquoi').hidden = true;
  $('jouPastille').hidden = true; $('jouCoupNom').textContent = ''; $('jouPhrase').textContent = 'La partie commence…';
  renderBoard();
}

function renderBoard() { renderFenBoard($('jouBoard'), vue.chess.fen(), { orientation: vue.orientation }); }

function evalTexte(v) {
  if (v == null) return '—';
  if (Math.abs(v) >= 90000) return `${v > 0 ? '+' : '−'}M${100000 - Math.abs(v)}`;
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${(Math.abs(v) / 100).toFixed(2).replace('.', ',')}`;
}

function traceHtml(c) {
  const li = [];
  if (c.ligne?.length) li.push(`<li><b>Ligne calculée :</b> ${esc(c.ligne.join(' '))}</li>`);
  if (c.battu) li.push(`<li><b>Coup battu :</b> ${esc(c.battu.san)} ${c.battu.seValent ? '— se valent' : `(${(c.battu.ecart / 100).toFixed(2).replace('.', ',')} de moins)`}</li>`);
  if (c.termes?.length) li.push(`<li><b>Ce qui a compté :</b> ${esc(c.termes.map((t) => `${t.nom} (après ${t.apres}, au bout ${t.bout})`).join(' · '))}</li>`);
  if (c.menace) li.push(`<li><b>Menace vue :</b> ${esc((c.menace.ligne ?? []).join(' '))}${c.menace.pareeApres ? ' — parée après le coup' : ''}</li>`);
  if (c.motif) li.push(`<li><b>Motif :</b> ${esc(c.motif)}</li>`);
  if (c.plan) li.push(`<li><b>Plan :</b> ${esc(c.plan.nom)} (distance ${c.plan.distance}, cumul ${c.plan.cumul})</li>`);
  if (c.profondeur != null) li.push(`<li><b>Recherche :</b> profondeur ${c.profondeur}, ${c.noeuds ?? 0} positions${c.ms != null ? `, ${c.ms} ms` : ''}</li>`);
  return `<ul class="jpt__trace-liste">${li.join('')}</ul>`;
}

function montrerPhrase(c) {
  const nom = $('jouCoupNom'), pastille = $('jouPastille'), phrase = $('jouPhrase'), pourquoi = $('jouPourquoi'), trace = $('jouTrace');
  nom.textContent = `${Math.floor((c.ply - 1) / 2) + 1}${c.camp === 'w' ? '.' : '…'} ${c.san}`;
  trace.hidden = true; pourquoi.setAttribute('aria-expanded', 'false');
  if (c.coach) {
    const s = SORTES[c.sorte] ?? { l: c.sorte, c: '#555' };
    pastille.hidden = false; pastille.textContent = s.l; pastille.style.backgroundColor = s.c;
    phrase.textContent = c.phrase ?? '(pas de phrase)';
    pourquoi.hidden = false; trace.innerHTML = traceHtml(c);
    pourquoi.onclick = () => { trace.hidden = !trace.hidden; pourquoi.setAttribute('aria-expanded', String(!trace.hidden)); };
  } else { pastille.hidden = true; phrase.textContent = 'Coup de l\'adversaire.'; pourquoi.hidden = true; }
}

function ajouterCoup(c) {
  if (vue.vus.has(c.ply)) return; vue.vus.add(c.ply); // dédoublonnage (le rattrapage peut rejouer des coups déjà vus)
  vue.chess.move({ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), promotion: c.uci[4] || undefined });
  renderBoard();
  const li = document.createElement('li');
  li.className = `jpt__coup ${c.coach ? 'jpt__coup--coach' : 'jpt__coup--adv'}`;
  const num = c.camp === 'w' ? `${Math.floor(c.ply / 2) + 1}.` : '';
  li.innerHTML = `<span class="jpt__coup-num">${num}</span> <span class="jpt__coup-san">${esc(c.san)}</span>` +
    (c.coach && c.sorte ? `<span class="jpt__coup-pastille" style="background:${(SORTES[c.sorte] ?? {}).c ?? '#555'}"></span>` : '');
  li.onclick = () => montrerPhrase(c);
  $('jouCoups').appendChild(li);
  montrerPhrase(c);
}

function montrerFin(o, examen) {
  vue.fini = true;
  const lien = vue.id ? `<a href="./partie.html?partie=${encodeURIComponent(vue.id)}">Revoir la partie dans le lecteur →</a>` : '';
  const ex = examen ? ` · examen : ${examen.bevues} bévue(s) sur ${examen.coups}` : '';
  const res = o.erreur ? `Partie interrompue (${esc(o.erreur)})` : `Partie finie : ${esc(o.resultat ?? '')} (${esc(o.raison ?? '')})`;
  $('jouFin').hidden = false; $('jouFin').innerHTML = `${res}${ex}<br>${lien}`;
}

function traiter(o) {
  if (o.ev === 'vide') { montrerAucune(); return; }
  if (o.ev === 'debut') { $('jouMeta').textContent = `Partie en cours : le coach ${o.camp === 'b' ? 'Noirs' : 'Blancs'} contre ${o.adversaire?.nom ?? '?'}`; vue.id = o.id; reset(o.depart, o.camp); $('jouListeBloc').hidden = true; }
  else if (o.ev === 'coup') ajouterCoup(o.coup);
  else if (o.ev === 'examen') vue._examen = o.examen;
  else if (o.ev === 'fin') { vue.id = o.id ?? vue.id; montrerFin(o, vue._examen); fermerFlux(); sonder(); }
}

function ouvrirFlux() {
  fermerFlux();
  source = new EventSource('/api/joueur/en-cours/flux');
  source.onmessage = (e) => { try { traiter(JSON.parse(e.data)); } catch { /* ligne non-JSON ignorée */ } };
  source.onerror = () => { fermerFlux(); sonder(); }; // coupure : on repasse en sondage léger
}
function fermerFlux() { if (source) { source.close(); source = null; } }

/** Sondage léger quand il n'y a pas de partie : on rouvre le flux dès qu'une partie démarre. */
function sonder() {
  clearTimeout(sondage);
  sondage = setTimeout(async () => {
    try { const e = await (await fetch('/api/joueur/en-cours')).json(); if (e.enCours) { ouvrirFlux(); return; } } catch { /* réseau */ }
    sonder();
  }, 5000);
}

async function montrerAucune() {
  $('jouMeta').textContent = 'Aucune partie en cours.';
  try {
    const d = await (await fetch('/api/joueur/parties')).json();
    const ul = $('jouListe'); ul.innerHTML = '';
    for (const p of (d.parties ?? []).slice(0, 50)) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="./partie.html?partie=${encodeURIComponent(p.id)}">${esc(p.id)}</a> <span class="jou__liste-detail">${esc(p.resultat)} (${esc(p.raison)})</span>`;
      ul.appendChild(li);
    }
    $('jouListeBloc').hidden = false;
  } catch { /* pas de liste */ }
  sonder();
}

async function initLancement() {
  let moi = null;
  try { moi = (await (await fetch('/api/auth/moi')).json()).utilisateur; } catch { /* non connecté */ }
  const peut = moi && ['enseignant', 'validateur', 'admin'].includes(moi.role);
  $('jouLancement').hidden = !peut;
  if (!peut) return;
  $('jouAdversaire').onchange = () => { $('jouEloChamp').hidden = $('jouAdversaire').value !== 'bride'; };
  $('jouJouer').onclick = async () => {
    $('jouJouer').disabled = true; $('jouErreur').hidden = true;
    const corps = { adversaire: $('jouAdversaire').value, elo: Number($('jouElo').value), camp: $('jouCamp').value };
    try {
      const r = await fetch('/api/joueur/parties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(corps) });
      const j = await r.json();
      if (!r.ok || !j.ok) erreur(j.error ?? 'lancement impossible');
      else setTimeout(ouvrirFlux, 400); // laisse l'enfant émettre « debut »
    } catch { erreur('lancement impossible (réseau).'); }
    $('jouJouer').disabled = false;
  };
}

async function init() {
  await initLancement();
  // État initial : s'il y a (ou vient d'y avoir) une partie, on ouvre le flux (rattrapage inclus) ; sinon « aucune » + liste.
  try {
    const e = await (await fetch('/api/joueur/en-cours')).json();
    if (e.enCours || e.fini) ouvrirFlux(); else montrerAucune();
  } catch { montrerAucune(); }
}

init();
