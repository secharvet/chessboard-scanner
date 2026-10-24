/**
 * Le lecteur du coach joueur (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 3) : charge une partie `parties/<id>.json`
 * (paramètre ?partie=) et la liste `parties/index.json`, montre l'échiquier, la liste des coups, et pour chaque coup du
 * coach sa phrase (avec une pastille de sorte), un bouton « pourquoi » qui déplie la trace, l'examen caché par défaut, et un
 * mode « lecture » qui tire 20 coups au sort (graine affichée) et recueille deux oui/non par coup, puis copie le résultat.
 */
import { Chess } from '/vendor/chess.js';
import { renderFenBoard } from './board-view.js';
import { recitTexte, pourquoiHumain } from './recit.js';

const $ = (id) => document.getElementById(id);
const SORTES = {
  plan: { libelle: 'plan', couleur: '#4e9a06' },
  amelioration: { libelle: 'amélioration', couleur: '#3465a4' },
  defense: { libelle: 'défense', couleur: '#c17d11' },
  calcul: { libelle: 'calcul', couleur: '#a40000' },
  livre: { libelle: 'livre', couleur: '#5c3566' },
};
const VERDICTS = { ok: 'rien à signaler', faute: 'faute', bevue: 'bévue', exclu: 'hors compte' };

/** Un score interne → texte lisible (mat encodé ± (100000 − N)). */
function evalTexte(v) {
  if (v == null) return '—';
  if (Math.abs(v) >= 90000) { const n = 100000 - Math.abs(v); return `${v > 0 ? '+' : '−'}M${n}`; }
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${(Math.abs(v) / 100).toFixed(2).replace('.', ',')}`;
}

/** PRNG graine → [0,1[ (mulberry32), pour le tirage reproductible du mode lecture. */
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const etat = { partie: null, fens: [], cur: 0, orientation: 'white' };

function erreur(msg) { const e = $('jptErreur'); e.textContent = msg; e.hidden = false; }

/** Reconstruit la suite des positions depuis le départ (fens[0] = départ, fens[k] = après le k-ième coup). */
function construireFens(partie) {
  const jeu = new Chess(partie.depart);
  const fens = [jeu.fen()];
  for (const c of partie.coups) {
    jeu.move({ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), promotion: c.uci[4] || undefined });
    fens.push(jeu.fen());
  }
  return fens;
}

function rendreBoard() {
  renderFenBoard($('jptBoard'), etat.fens[etat.cur], { orientation: etat.orientation });
  $('jptCompteur').textContent = `${etat.cur} / ${etat.partie.coups.length}`;
  for (const li of $('jptCoups').children) li.classList.toggle('jpt__coup--courant', Number(li.dataset.i) === etat.cur);
}

/** La carte d'explication pour la position courante (le coup qui vient d'être joué = coups[cur-1]). */
function rendrePhrase() {
  const carte = $('jptPhraseCarte'), pastille = $('jptPastille'), nom = $('jptCoupNom'), phrase = $('jptPhrase');
  const pourquoi = $('jptPourquoi'), trace = $('jptTrace');
  trace.hidden = true; pourquoi.setAttribute('aria-expanded', 'false');
  const c = etat.cur > 0 ? etat.partie.coups[etat.cur - 1] : null;
  if (!c) { pastille.hidden = true; nom.textContent = ''; phrase.textContent = 'Choisissez un coup pour lire son explication.'; pourquoi.hidden = true; $('jptExamen').hidden = true; return; }
  nom.textContent = `${Math.floor((c.ply - 1) / 2) + 1}${c.camp === 'w' ? '.' : '…'} ${c.san}`;
  if (c.coach) {
    const s = SORTES[c.sorte] ?? { libelle: c.sorte, couleur: '#555' };
    pastille.hidden = false; pastille.textContent = s.libelle; pastille.style.backgroundColor = s.couleur;
    phrase.textContent = c.phrase ?? '(pas de phrase — échec compté)';
    carte.classList.toggle('jpt__phrase-carte--sans', !c.phrase);
    pourquoi.hidden = false;
    trace.innerHTML = traceHtml(c);
  } else {
    pastille.hidden = true; phrase.textContent = `Coup de l'adversaire (${etat.partie.adversaire?.nom ?? '—'}).`;
    pourquoi.hidden = true; carte.classList.remove('jpt__phrase-carte--sans');
  }
  rendreExamen(c);
}

/** Le « pourquoi » déplié : le même texte que le récit (ce qu'il a calculé, ce qu'il a aussi regardé…), sans la trace de la recherche. */
function traceHtml(c) {
  const li = pourquoiHumain({ ...c, examen: null }).map((x) => `<li>${x.charAt(0).toUpperCase()}${x.slice(1)}</li>`);
  return `<ul class="jpt__trace-liste">${li.join('') || '<li>Rien de plus à dire sur ce coup.</li>'}</ul>`;
}

function rendreExamen(c) {
  const bloc = $('jptExamen');
  const montre = $('jptExamenToggle').getAttribute('aria-expanded') === 'true';
  if (!montre || !c?.coach || !c.examen) { bloc.hidden = true; return; }
  const e = c.examen;
  bloc.hidden = false;
  // Quand un mat est en jeu (e.mat), on affiche « mat en N → mat en M » (distance au mat), jamais une perte en centièmes.
  const face = (n, enc) => (n == null ? evalTexte(enc) : `mat en ${Math.abs(n)}${n < 0 ? ' (contre le coach)' : ''}`);
  const detail = e.mat
    ? `${face(e.mat.avant, e.avant)} → ${face(e.mat.apres, e.apres)}`
    : `avant ${evalTexte(e.avant)} → après ${evalTexte(e.apres)} (${e.perte > 0 ? '−' : '+'}${(Math.abs(e.perte) / 100).toFixed(2).replace('.', ',')})`;
  bloc.innerHTML = `<span class="jpt__verdict jpt__verdict--${e.verdict}">${VERDICTS[e.verdict] ?? e.verdict}</span>` +
    `<span class="jpt__examen-detail">${detail} · ${e.phase}${e.raison ? ` · ${e.raison}` : ''}</span>`;
}

function rendreListe() {
  const ol = $('jptCoups'); ol.innerHTML = '';
  etat.partie.coups.forEach((c, k) => {
    const li = document.createElement('li');
    li.className = `jpt__coup ${c.coach ? 'jpt__coup--coach' : 'jpt__coup--adv'}`;
    li.dataset.i = String(k + 1);
    const num = c.camp === 'w' ? `${Math.floor(c.ply / 2) + 1}.` : '';
    li.innerHTML = `<span class="jpt__coup-num">${num}</span> <span class="jpt__coup-san">${c.san}</span>` +
      (c.coach && c.sorte ? `<span class="jpt__coup-pastille" style="background:${(SORTES[c.sorte] ?? {}).couleur ?? '#555'}" title="${(SORTES[c.sorte] ?? {}).libelle ?? c.sorte}"></span>` : '');
    li.addEventListener('click', () => { etat.cur = k + 1; rendreBoard(); rendrePhrase(); });
    ol.appendChild(li);
  });
}

function rendreMeta() {
  const p = etat.partie;
  const blancs = p.coach.camp === 'w' ? 'coach' : p.adversaire?.nom ?? '?';
  const noirs = p.coach.camp === 'b' ? 'coach' : p.adversaire?.nom ?? '?';
  $('jptMeta').innerHTML = `<b>${blancs}</b> — <b>${noirs}</b> · ${p.resultat} (${p.raison}) · ${p.plies} demi-coups · code ${p.coach.code ?? '—'}` +
    (p.examen ? ` · <span class="jpt__meta-examen">examen : ${p.examen.bevues} bévue(s) sur ${p.examen.coups}</span>` : ' · examen non fait');
}

/* ------------------------------------------------------------------ mode lecture ------------------------------------------------------------------ */

const lecture = { actif: false, liste: [], i: 0, reponses: [], graine: 0 };

function demarrerLecture() {
  const coach = etat.partie.coups.map((c, k) => (c.coach && c.phrase ? k : -1)).filter((k) => k >= 0);
  if (!coach.length) { erreur('Aucun coup du coach avec phrase à lire.'); return; }
  lecture.graine = (Math.random() * 1e9) >>> 0;
  const rng = mulberry32(lecture.graine);
  const melange = [...coach];
  for (let i = melange.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [melange[i], melange[j]] = [melange[j], melange[i]]; }
  lecture.liste = melange.slice(0, Math.min(20, melange.length));
  lecture.i = 0; lecture.reponses = []; lecture.actif = true;
  $('jptLecture').hidden = false;
  rendreLecture();
}

function rendreLecture() {
  const bloc = $('jptLecture');
  if (lecture.i >= lecture.liste.length) {
    const fideles = lecture.reponses.filter((r) => r.correspond).length;
    const apprend = lecture.reponses.filter((r) => r.apprend).length;
    bloc.innerHTML = `<div class="jpt__lecture-fin"><p>Terminé. Graine <b>${lecture.graine}</b>. ` +
      `<b>${fideles}/${lecture.reponses.length}</b> fidèles au coup, <b>${apprend}/${lecture.reponses.length}</b> apprennent quelque chose.</p>` +
      `<button type="button" class="btn btn-sm btn-outline-light" id="jptLectureCopie">Copier le résultat</button> ` +
      `<button type="button" class="btn btn-sm btn-outline-secondary" id="jptLectureFin">Fermer</button></div>`;
    $('jptLectureCopie').addEventListener('click', copierLecture);
    $('jptLectureFin').addEventListener('click', () => { lecture.actif = false; bloc.hidden = true; });
    return;
  }
  const k = lecture.liste[lecture.i];
  etat.cur = k + 1; $('jptExamenToggle').setAttribute('aria-expanded', 'false'); rendreBoard(); rendrePhrase(); // examen caché pendant la lecture
  const c = etat.partie.coups[k];
  bloc.innerHTML = `<div class="jpt__lecture-tete">Coup ${lecture.i + 1} / ${lecture.liste.length} · graine ${lecture.graine}</div>` +
    `<p class="jpt__lecture-phrase">« ${c.phrase} »</p>` +
    `<div class="jpt__lecture-q"><span>La phrase correspond au coup ?</span>` +
    `<button type="button" class="btn btn-sm btn-outline-success" data-q="correspond" data-v="1">oui</button>` +
    `<button type="button" class="btn btn-sm btn-outline-danger" data-q="correspond" data-v="0">non</button></div>` +
    `<div class="jpt__lecture-q"><span>Elle apprend quelque chose ?</span>` +
    `<button type="button" class="btn btn-sm btn-outline-success" data-q="apprend" data-v="1">oui</button>` +
    `<button type="button" class="btn btn-sm btn-outline-danger" data-q="apprend" data-v="0">non</button></div>` +
    `<button type="button" class="btn btn-sm btn-primary" id="jptLectureSuiv" disabled>Coup suivant</button>`;
  const choix = {};
  for (const b of bloc.querySelectorAll('[data-q]')) b.addEventListener('click', () => {
    choix[b.dataset.q] = b.dataset.v === '1';
    for (const f of bloc.querySelectorAll(`[data-q="${b.dataset.q}"]`)) f.classList.remove('active');
    b.classList.add('active');
    $('jptLectureSuiv').disabled = !('correspond' in choix && 'apprend' in choix);
  });
  $('jptLectureSuiv').addEventListener('click', () => {
    lecture.reponses.push({ ply: c.ply, san: c.san, correspond: choix.correspond, apprend: choix.apprend });
    lecture.i++; rendreLecture();
  });
}

function copierLecture() {
  const l = [`Lecture — partie ${etat.partie.id} — graine ${lecture.graine}`];
  for (const r of lecture.reponses) l.push(`${r.san}\tcorrespond=${r.correspond ? 'oui' : 'non'}\tapprend=${r.apprend ? 'oui' : 'non'}`);
  const fideles = lecture.reponses.filter((r) => r.correspond).length;
  l.push(`total\t${fideles}/${lecture.reponses.length} fidèles`);
  const texte = l.join('\n');
  (navigator.clipboard?.writeText(texte) ?? Promise.reject()).then(() => { $('jptLectureCopie').textContent = 'Copié ✓'; }).catch(() => {
    const ta = document.createElement('textarea'); ta.value = texte; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); $('jptLectureCopie').textContent = 'Copié ✓'; } catch { erreur('Copie impossible — le résultat est dans la console.'); console.log(texte); }
    ta.remove();
  });
}

/** Copie le récit ; si le presse-papiers est refusé, le texte reste sélectionné (Ctrl+C suffit). */
function copierRecit(ta, bouton) {
  const ok = () => { bouton.textContent = 'Copié ✓'; setTimeout(() => { bouton.textContent = 'Copier le récit'; }, 2000); };
  (navigator.clipboard?.writeText(ta.value) ?? Promise.reject()).then(ok).catch(() => {
    ta.focus(); ta.select();
    try { if (document.execCommand('copy')) ok(); else bouton.textContent = 'Sélectionné : Ctrl+C'; } catch { bouton.textContent = 'Sélectionné : Ctrl+C'; }
  });
}

/* ------------------------------------------------------------------ chargement ------------------------------------------------------------------ */

async function chargerListe(selId) {
  try {
    const liste = await (await fetch('./parties/index.json')).json();
    const sel = $('jptSelect'); sel.innerHTML = '';
    for (const e of liste) { const o = document.createElement('option'); o.value = e.id; o.textContent = `${e.id} · ${e.resultat} (${e.raison})`; sel.appendChild(o); }
    if (selId && liste.some((e) => e.id === selId)) sel.value = selId;
    return sel.value;
  } catch { return selId; }
}

async function chargerPartie(id) {
  const p = await (await fetch(`./parties/${id}.json`)).json();
  etat.partie = p; etat.fens = construireFens(p); etat.cur = p.coups.length; etat.orientation = p.coach.camp === 'b' ? 'black' : 'white';
  rendreMeta(); rendreListe(); rendreBoard(); rendrePhrase();
  $('jptRecit').value = recitTexte(p);
}

async function init() {
  const params = new URLSearchParams(location.search);
  let id = params.get('partie');
  id = await chargerListe(id);
  if (!id) { erreur('Aucune partie à lire. Lancez l\'arène (scripts/joueur/partie.mjs) pour en produire.'); return; }
  try { await chargerPartie(id); } catch (e) { erreur(`Partie « ${id} » introuvable ou illisible.`); return; }

  $('jptDebut').addEventListener('click', () => { etat.cur = 0; rendreBoard(); rendrePhrase(); });
  $('jptFin').addEventListener('click', () => { etat.cur = etat.partie.coups.length; rendreBoard(); rendrePhrase(); });
  $('jptPrec').addEventListener('click', () => { if (etat.cur > 0) { etat.cur--; rendreBoard(); rendrePhrase(); } });
  $('jptSuiv').addEventListener('click', () => { if (etat.cur < etat.partie.coups.length) { etat.cur++; rendreBoard(); rendrePhrase(); } });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'ArrowLeft') $('jptPrec').click(); else if (ev.key === 'ArrowRight') $('jptSuiv').click(); });
  $('jptPourquoi').addEventListener('click', () => { const t = $('jptTrace'); t.hidden = !t.hidden; $('jptPourquoi').setAttribute('aria-expanded', String(!t.hidden)); });
  $('jptExamenToggle').addEventListener('click', () => {
    const on = $('jptExamenToggle').getAttribute('aria-expanded') !== 'true';
    $('jptExamenToggle').setAttribute('aria-expanded', String(on));
    $('jptExamenToggle').textContent = on ? 'Cacher l\'examen' : 'Afficher l\'examen';
    rendreExamen(etat.cur > 0 ? etat.partie.coups[etat.cur - 1] : null);
  });
  $('jptLectureStart').addEventListener('click', demarrerLecture);
  $('jptRecitCopie').addEventListener('click', () => copierRecit($('jptRecit'), $('jptRecitCopie')));
  $('jptSelect').addEventListener('change', (ev) => { if (ev.target.value) { const u = new URL(location); u.searchParams.set('partie', ev.target.value); history.replaceState(null, '', u); chargerPartie(ev.target.value).catch(() => erreur('Partie illisible.')); } });
}

init();
