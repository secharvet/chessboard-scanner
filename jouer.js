/**
 * « Faire jouer le coach » (jouer.html) : une seule partie pour tout le site, jouée côté serveur. Les visiteurs ASSISTENT
 * via un flux SSE (`/api/joueur/en-cours/flux`) ; un enseignant/admin peut en lancer une (`POST /api/joueur/parties`).
 * L'échiquier suit, chaque coup du coach affiche sa phrase (pastille + « pourquoi »), et à la fin un lien vers le lecteur.
 */
import { Chess } from '/vendor/chess.js';
import { renderFenBoard } from './board-view.js';
import { recitTexte, pourquoiHumain, pastilleDe } from './recit.js';

const $ = (id) => document.getElementById(id);
const VERDICTS = { ok: 'rien à signaler', faute: 'faute', bevue: 'bévue', exclu: 'hors compte' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); // phrases/traces échappées (défense)
const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const vue = { chess: null, orientation: 'white', vus: new Set(), id: null, camp: 'w', fini: false, coups: [], debut: null, fin: null };
let source = null, sondage = null;

function erreur(msg) { const e = $('jouErreur'); e.textContent = msg; e.hidden = false; }

function reset(depart, camp) {
  vue.chess = new Chess(depart || DEPART); vue.orientation = camp === 'b' ? 'black' : 'white'; vue.vus = new Set(); vue.camp = camp; vue.fini = false; vue.coups = []; vue.fin = null;
  $('jouCoups').innerHTML = ''; $('jouFin').hidden = true; $('jouTrace').hidden = true; $('jouPourquoi').hidden = true;
  $('jouPastille').hidden = true; $('jouCoupNom').textContent = ''; $('jouPhrase').textContent = 'La partie commence…';
  $('jouDerniers').hidden = true; $('jouReponse').hidden = true; $('jouRecit').value = '';
  renderBoard();
}

function renderBoard(c) {
  // le dernier coup joué (vert) et, si le coach en a dit un, le coup écarté (jaune — « l'autre couleur »)
  const arrows = [];
  if (c?.uci) arrows.push({ color: 'G', from: c.uci.slice(0, 2), to: c.uci.slice(2, 4) });
  if (c?.coach && c.ecarte?.coup) arrows.push({ color: 'Y', from: c.ecarte.coup.slice(0, 2), to: c.ecarte.coup.slice(2, 4) });
  renderFenBoard($('jouBoard'), vue.chess.fen(), { orientation: vue.orientation, drawables: { arrows } });
}

function evalTexte(v) {
  if (v == null) return '—';
  if (Math.abs(v) >= 90000) return `${v > 0 ? '+' : '−'}M${100000 - Math.abs(v)}`;
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${(Math.abs(v) / 100).toFixed(2).replace('.', ',')}`;
}

/** Le « pourquoi » déplié : le même texte que le récit, sans la trace de la recherche (profondeur, positions, score). */
function traceHtml(c) {
  const li = pourquoiHumain({ ...c, examen: null }).map((x) => `<li>${esc(x.charAt(0).toUpperCase() + x.slice(1))}</li>`);
  return `<ul class="jpt__trace-liste">${li.join('') || '<li>Rien de plus à dire sur ce coup.</li>'}</ul>`;
}

const nomCoup = (c) => `${Math.floor((c.ply - 1) / 2) + 1}${c.camp === 'w' ? '.' : '…'} ${c.san}`;

/**
 * Montre une paire de demi-coups : le coup du coach (sa phrase) et la réponse de l'adversaire qui le suit. Cliquer un coup
 * de l'adversaire montre donc le coup du coach qui le précède, avec cette réponse : on ne voit jamais un coup seul.
 */
function montrer(c) {
  const k = vue.coups.indexOf(c);
  let coach = c.coach ? c : null, rep = c.coach ? null : c;
  if (!c.coach) for (let i = k - 1; i >= 0; i--) if (vue.coups[i].coach) { coach = vue.coups[i]; break; }
  if (c.coach && k >= 0 && vue.coups[k + 1] && !vue.coups[k + 1].coach) rep = vue.coups[k + 1];
  const adv = vue.debut?.adversaire?.nom ?? 'l\'adversaire';
  const d = $('jouDerniers');
  d.hidden = false;
  d.innerHTML = `Derniers coups : ${coach ? `<b>${esc(nomCoup(coach))}</b> (coach)` : ''}${coach && rep ? ' · ' : ''}${rep ? `<b>${esc(nomCoup(rep))}</b> (${esc(adv)})` : ''}`;
  if (coach) montrerPhrase(coach); else montrerPhrase(c);
  const r = $('jouReponse');
  r.hidden = !(coach && rep);
  if (coach && rep) r.textContent = `Réponse de ${adv} : ${nomCoup(rep)}.`;
}

function montrerPhrase(c) {
  const nom = $('jouCoupNom'), pastille = $('jouPastille'), phrase = $('jouPhrase'), pourquoi = $('jouPourquoi'), trace = $('jouTrace');
  nom.textContent = `${Math.floor((c.ply - 1) / 2) + 1}${c.camp === 'w' ? '.' : '…'} ${c.san}`;
  trace.hidden = true; pourquoi.setAttribute('aria-expanded', 'false');
  if (c.coach) {
    const s = pastilleDe(c);
    pastille.hidden = false; pastille.textContent = s.libelle; pastille.style.backgroundColor = s.couleur;
    phrase.textContent = c.phrase ?? '(pas de phrase)';
    pourquoi.hidden = false; trace.innerHTML = traceHtml(c);
    pourquoi.onclick = () => { trace.hidden = !trace.hidden; pourquoi.setAttribute('aria-expanded', String(!trace.hidden)); };
  } else { pastille.hidden = true; phrase.textContent = 'Coup de l\'adversaire.'; pourquoi.hidden = true; }
}

function ajouterCoup(c) {
  if (vue.vus.has(c.ply)) return; vue.vus.add(c.ply); // dédoublonnage (le rattrapage peut rejouer des coups déjà vus)
  vue.chess.move({ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), promotion: c.uci[4] || undefined });
  renderBoard(c);
  const li = document.createElement('li');
  li.className = `jpt__coup ${c.coach ? 'jpt__coup--coach' : 'jpt__coup--adv'}`;
  const num = c.camp === 'w' ? `${Math.floor(c.ply / 2) + 1}.` : '';
  const s = c.coach ? pastilleDe(c) : null;
  li.innerHTML = `<span class="jpt__coup-num">${num}</span> <span class="jpt__coup-san">${esc(c.san)}</span>` +
    (s ? `<span class="jpt__coup-pastille" style="background:${s.couleur}" title="${esc(s.libelle)}"></span>` : '');
  li.onclick = () => montrer(c);
  $('jouCoups').appendChild(li);
  vue.coups.push(c);
  montrer(c);
  majRecit();
}

/** Le récit complet, tenu à jour coup par coup (la position de lecture dans l'encart est gardée). */
function majRecit(partie) {
  const ta = $('jouRecit'), haut = ta.scrollTop;
  const d = vue.debut ?? {};
  const p = partie ?? { id: vue.id, coach: { camp: vue.camp, budget: d.budget, code: d.code }, adversaire: d.adversaire, depart: d.depart, coups: vue.coups,
    resultat: vue.fin?.resultat, raison: vue.fin?.raison, plies: vue.fin?.plies, examen: vue._examen };
  ta.value = recitTexte(p);
  ta.scrollTop = haut;
}

/** Copie le récit ; si le presse-papiers est refusé, le texte reste sélectionné (Ctrl+C suffit). */
function copierRecit() {
  const ta = $('jouRecit'), bouton = $('jouRecitCopie');
  const ok = () => { bouton.textContent = 'Copié ✓'; setTimeout(() => { bouton.textContent = 'Copier le récit'; }, 2000); };
  (navigator.clipboard?.writeText(ta.value) ?? Promise.reject()).then(ok).catch(() => {
    ta.focus(); ta.select();
    try { if (document.execCommand('copy')) ok(); else bouton.textContent = 'Sélectionné : Ctrl+C'; } catch { bouton.textContent = 'Sélectionné : Ctrl+C'; }
  });
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
  if (o.ev === 'debut') { vue.debut = o; $('jouMeta').textContent = `Partie en cours : le coach ${o.camp === 'b' ? 'Noirs' : 'Blancs'} contre ${o.adversaire?.nom ?? '?'}`; vue.id = o.id; reset(o.depart, o.camp); $('jouListeBloc').hidden = true; }
  else if (o.ev === 'coup') ajouterCoup(o.coup);
  else if (o.ev === 'examen') vue._examen = o.examen;
  else if (o.ev === 'fin') {
    vue.id = o.id ?? vue.id; vue.fin = o; $('jouMeta').textContent = $('jouMeta').textContent.replace('Partie en cours', 'Partie finie'); montrerFin(o, vue._examen); fermerFlux(); sonder(); majRecit();
    // Le fichier de la partie porte l'examen coup par coup : le récit final le reprend.
    if (vue.id) fetch(`./parties/${encodeURIComponent(vue.id)}.json`).then((r) => (r.ok ? r.json() : null)).then((p) => { if (p) majRecit(p); }).catch(() => {});
  }
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
  $('jouRecitCopie').onclick = copierRecit;
  await initLancement();
  // État initial : s'il y a (ou vient d'y avoir) une partie, on ouvre le flux (rattrapage inclus) ; sinon « aucune » + liste.
  try {
    const e = await (await fetch('/api/joueur/en-cours')).json();
    if (e.enCours || e.fini) ouvrirFlux(); else montrerAucune();
  } catch { montrerAucune(); }
}

init();
