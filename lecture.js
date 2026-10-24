/**
 * Lecture humaine des explications du coach (condition 5 de l'épreuve, et mesure de référence avant la piste « candidats
 * nommés ») : un tirage `parties/lecture-<date>.json` (scripts/joueur/tirage-lecture.mjs, graine affichée), un coup à la
 * fois, trois questions (vrai/faux, utile/creux, compris par un 1500 ou non) et une remarque ; à la fin, le résultat à copier.
 * Paramètre ?tirage=lecture-2026-10-25 (défaut). Les réponses sont gardées dans ce navigateur (localStorage) pour qu'un
 * rechargement ne perde rien ; elles ne partent nulle part.
 */
import { renderFenBoard } from './board-view.js';

const $ = (id) => document.getElementById(id);
const NOM = new URLSearchParams(location.search).get('tirage') || 'lecture-2026-10-25';
const CLE = `lecture:${NOM}`;
const etat = { tirage: null, i: 0, reponses: [] };
const QUESTIONS = ['vrai', 'utile', 'comprend'];

function erreur(msg) { const e = $('lecErreur'); e.textContent = msg; e.hidden = false; }
function garder() { try { localStorage.setItem(CLE, JSON.stringify(etat.reponses)); } catch { /* stockage refusé */ } }
function relire() { try { return JSON.parse(localStorage.getItem(CLE) ?? '[]'); } catch { return []; } }

const nomCoup = (c) => `${Math.ceil(c.ply / 2)}${c.camp === 'w' ? '.' : '…'} ${c.san}`;

function rendre() {
  const n = etat.tirage.coups.length;
  if (etat.i >= n) { rendreFin(); return; }
  $('lecZone').hidden = false; $('lecFin').hidden = true;
  const c = etat.tirage.coups[etat.i];
  const r = etat.reponses[etat.i] ?? {};
  $('lecMeta').textContent = `Coup ${etat.i + 1} / ${n} · le coach a les ${c.camp === 'w' ? 'Blancs' : 'Noirs'} · ${c.partie}`;
  renderFenBoard($('lecBoard'), c.fenAvant, { orientation: c.camp === 'b' ? 'black' : 'white', drawables: { arrows: [{ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), color: 'G' }] } });
  $('lecCoup').textContent = nomCoup(c);
  $('lecPhrase').textContent = c.phrase ?? '(aucune phrase)';
  for (const b of document.querySelectorAll('[data-q]')) b.classList.toggle('active', r[b.dataset.q] === (b.dataset.v === '1'));
  $('lecRemarque').value = r.remarque ?? '';
  $('lecPrec').disabled = etat.i === 0;
  $('lecSuiv').disabled = !QUESTIONS.every((q) => q in r);
  $('lecSuiv').textContent = etat.i === n - 1 ? 'Terminer ▶' : 'Coup suivant ▶';
}

function texteResultat() {
  const t = etat.tirage, rs = etat.reponses;
  const vrais = rs.filter((r) => r?.vrai).length, utiles = rs.filter((r) => r?.utile).length, compris = rs.filter((r) => r?.comprend).length;
  const n = t.coups.length;
  const parStrate = Object.keys(t.strates ?? {}).map((s) => { const ks = t.coups.map((c, k) => (c.strate === s ? k : -1)).filter((k) => k >= 0); return `${s} : vrai ${ks.filter((k) => rs[k]?.vrai).length}/${ks.length}, utile ${ks.filter((k) => rs[k]?.utile).length}/${ks.length}, compris ${ks.filter((k) => rs[k]?.comprend).length}/${ks.length}`; });
  const L = [`Lecture des explications du coach — tirage ${NOM}, graine ${t.graine}, ${t.coups.length} coups sur ${t.urne} (hors livre), ${t.parties} parties (${t.source})`,
    `Vrai : ${vrais}/${n} · Utile : ${utiles}/${n} · Compris : ${compris}/${n}`, ...parStrate, ''];
  t.coups.forEach((c, k) => {
    const r = rs[k] ?? {};
    L.push(`${k + 1}. ${c.partie} ${nomCoup(c)} [${c.strate ?? c.sorte}] — ${r.vrai ? 'vrai' : 'faux'}, ${r.utile ? 'utile' : 'creux'}, ${r.comprend ? 'compris' : 'pas compris'}`);
    L.push(`   « ${c.phrase ?? '(aucune phrase)'} »`);
    if (r.remarque) L.push(`   remarque : ${r.remarque}`);
  });
  return { texte: L.join('\n') + '\n', vrais, utiles, compris };
}

function rendreFin() {
  $('lecZone').hidden = true; $('lecFin').hidden = false;
  const { texte, vrais, utiles, compris } = texteResultat();
  $('lecBilan').innerHTML = `Terminé. <b>${vrais}/${etat.tirage.coups.length}</b> phrases vraies, <b>${utiles}/${etat.tirage.coups.length}</b> utiles, <b>${compris}/${etat.tirage.coups.length}</b> comprises par un 1500.`;
  $('lecTexte').value = texte;
}

function copier() {
  const ta = $('lecTexte'), b = $('lecCopie');
  const ok = () => { b.textContent = 'Copié ✓'; setTimeout(() => { b.textContent = 'Copier le résultat'; }, 2000); };
  (navigator.clipboard?.writeText(ta.value) ?? Promise.reject()).then(ok).catch(() => {
    ta.focus(); ta.select();
    try { if (document.execCommand('copy')) ok(); else b.textContent = 'Sélectionné : Ctrl+C'; } catch { b.textContent = 'Sélectionné : Ctrl+C'; }
  });
}

async function init() {
  try { etat.tirage = await (await fetch(`./parties/${encodeURIComponent(NOM)}.json`)).json(); } catch { erreur(`Tirage « ${NOM} » introuvable.`); return; }
  etat.reponses = relire();
  const premier = etat.tirage.coups.findIndex((_, k) => !QUESTIONS.every((q) => q in (etat.reponses[k] ?? {})));
  etat.i = premier < 0 ? etat.tirage.coups.length : premier;
  for (const b of document.querySelectorAll('[data-q]')) b.addEventListener('click', () => {
    const r = (etat.reponses[etat.i] ??= {});
    r[b.dataset.q] = b.dataset.v === '1'; garder(); rendre();
  });
  $('lecRemarque').addEventListener('input', () => { (etat.reponses[etat.i] ??= {}).remarque = $('lecRemarque').value.trim(); garder(); });
  $('lecPrec').addEventListener('click', () => { if (etat.i > 0) { etat.i--; rendre(); } });
  $('lecSuiv').addEventListener('click', () => { etat.i++; rendre(); });
  $('lecRevoir').addEventListener('click', () => { etat.i = 0; rendre(); });
  $('lecCopie').addEventListener('click', copier);
  rendre();
}

init();
