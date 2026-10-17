/**
 * Éditeur enseignant (16 octobre 2026). Un enseignant se place sur une position d'un livre et écrit son explication :
 * textes, coups proposés (arbre partagé), annotations (cases, flèches) et séquences rejouables, le tout enregistré
 * comme brouillon versionné puis publié. Contrat d'API : docs/SPEC-EDITEUR-ENSEIGNANT.md §5.
 * Sans API (fetch en échec) : bandeau « API indisponible », l'interface reste manipulable, rien n'est enregistré.
 */
import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { COULEURS, COULEUR_PAR_TYPE, dessinerAnnotations, basculerCase, basculerFleche, contentVide, normaliserContent } from './fleches.js';

const $ = (id) => document.getElementById(id);
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const fr = (san) => san.replace(/[KQRBN]/g, (m) => FR[m]);
const LIVRES = { francaise: 'Défense française', italienne: 'Partie italienne' };
const TYPES = { principal: 'principal', variante: 'variante', faute: 'faute', porte: 'autre livre' };
const ROLES_EDITEURS = ['enseignant', 'validateur', 'admin'];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- pur:début (fonctions sans DOM, testées hors navigateur)
/** Nouvel ordre des identifiants quand on dépose `id` juste avant `avantId` (null : à la fin). */
export function ordreApresDepose(ids, id, avantId) {
  if (!ids.includes(id)) return ids.slice();
  const reste = ids.filter((x) => x !== id);
  if (avantId == null || avantId === id) { reste.push(id); return reste; }
  const i = reste.indexOf(avantId); if (i < 0) { reste.push(id); return reste; }
  reste.splice(i, 0, id); return reste;
}
/** Déplace `id` d'un cran vers le haut (delta -1) ou le bas (+1) ; sans effet aux bords. */
export function ordreDecale(ids, id, delta) {
  const i = ids.indexOf(id); const j = i + delta; if (i < 0 || j < 0 || j >= ids.length) return ids.slice();
  const out = ids.slice(); [out[i], out[j]] = [out[j], out[i]]; return out;
}
/** Champs qui diffèrent entre deux contenus : { nom, sens, menace, blancs, noirs, coups: { move_id: bool } }. */
export function differences(a, b) {
  const t = (v) => String(v ?? '').trim();
  const sans = (c) => JSON.stringify(c?.sequence?.pas?.map((p) => p.san) ?? []);
  const ca = new Map((a?.coups ?? []).map((c) => [Number(c.move_id), c])); const cb = new Map((b?.coups ?? []).map((c) => [Number(c.move_id), c]));
  const coups = {};
  for (const id of new Set([...ca.keys(), ...cb.keys()])) { const x = ca.get(id), y = cb.get(id); coups[id] = t(x?.pourquoi) !== t(y?.pourquoi) || sans(x) !== sans(y); }
  return { nom: t(a?.nom) !== t(b?.nom), sens: t(a?.sens) !== t(b?.sens), menace: t(a?.menace) !== t(b?.menace),
    blancs: t(a?.schema?.blancs) !== t(b?.schema?.blancs), noirs: t(a?.schema?.noirs) !== t(b?.schema?.noirs), coups };
}
// --- pur:fin

// ------------------------------------------------------------------ état
const params = new URLSearchParams(location.search);
const etat = {
  livre: params.get('livre') in LIVRES ? params.get('livre') : 'francaise',
  ligne: (params.get('coups') ?? '').split(' ').filter(Boolean),
  game: new Chess(), orientation: 'white',
  moi: null, horsLigne: false,
  position: null, arbre: [], explications: [], referenceAuthorId: null,
  explication: null, content: contentVide(), videoUrl: '',
  mode: 'jouer', couleur: 'vert', cible: { type: 'position' },
  demo: null, apercu: null, sel: null, targets: [],
  dirty: false, autosave: null, lastSaved: null,
};
// rejoue la ligne de l'URL ; si un coup est illisible, on s'arrête avant
{ const g = new Chess(); const ok = []; for (const s of etat.ligne) { try { g.move(s); ok.push(s); } catch { break; } } etat.ligne = ok; etat.game = g; }

// ------------------------------------------------------------------ API
async function api(method, chemin, body) {
  let res;
  try {
    res = await fetch(chemin, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  } catch (e) { etat.horsLigne = true; bandeau('API indisponible : l\'interface reste manipulable, mais rien ne sera enregistré.', true); throw Object.assign(new Error('hors ligne'), { horsLigne: true }); }
  const j = await res.json().catch(() => ({}));
  if (!res.ok || j.ok === false) throw Object.assign(new Error(j.error || `HTTP ${res.status}`), { status: res.status, json: j });
  if (etat.horsLigne) { etat.horsLigne = false; bandeau(''); }
  return j;
}
function bandeau(texte, erreur = false) {
  const b = $('ediBandeau'); b.hidden = !texte; b.innerHTML = texte; b.classList.toggle('edi__bandeau--erreur', erreur);
}
const peutEditer = () => Boolean(etat.moi && ROLES_EDITEURS.includes(etat.moi.role));
const estValidateur = () => Boolean(etat.moi && ['validateur', 'admin'].includes(etat.moi.role));

async function chargerMoi() {
  try { const j = await api('GET', '/api/auth/moi'); etat.moi = j.utilisateur ?? null; } catch { etat.moi = null; }
  const el = $('ediMoi');
  if (etat.moi) el.innerHTML = `<b>${esc(etat.moi.display_name)}</b><br>${esc(etat.moi.role)}${etat.moi.club ? ' · ' + esc(etat.moi.club) : ''}`;
  else el.innerHTML = `<a class="topbar__link" href="./connexion.html?suite=${encodeURIComponent(location.pathname + location.search)}">Se connecter</a>`;
  document.body.classList.toggle('edi__lecture', !peutEditer());
  if (!peutEditer() && !etat.horsLigne) bandeau(`Lecture seule : <a href="./connexion.html?suite=${encodeURIComponent(location.pathname + location.search)}">connecte-toi en tant qu'enseignant</a> pour modifier cette position.`);
}

async function chargerPosition() {
  if (etat.dirty) await enregistrer(true);
  finirDemo(false); etat.apercu = null; etat.cible = { type: 'position' };
  const coups = etat.ligne.join(' ');
  history.replaceState(null, '', `?livre=${etat.livre}&coups=${encodeURIComponent(coups)}`);
  try {
    const j = await api('GET', `/api/positions?livre=${etat.livre}&coups=${encodeURIComponent(coups)}`);
    etat.position = j.position; etat.arbre = (j.coups ?? []).slice().sort((a, b) => a.ord - b.ord); etat.explications = j.explications ?? []; etat.referenceAuthorId = j.reference_author_id ?? null;
  } catch (e) {
    etat.position = e.status === 404 ? null : { id: null, coups, fen: etat.game.fen(), ply: etat.ligne.length };
    etat.arbre = []; etat.explications = [];
    if (e.status === 404) bandeau('Cette position n\'est pas encore dans le livre : joue un coup connu ou reviens en arrière. (Un enseignant peut la créer en ajoutant le coup depuis la position précédente.)');
  }
  choisirContenu(); rendreTout();
}
/** Mon brouillon s'il existe, sinon ma version publiée, sinon vide ; puis aligne les coups sur l'arbre. */
function choisirContenu() {
  const miennes = etat.explications.filter((x) => etat.moi && x.author?.id === etat.moi.id);
  const e = miennes.find((x) => x.status === 'brouillon') ?? miennes.find((x) => x.status === 'publie') ?? null;
  etat.explication = e; etat.content = normaliserContent(e?.content); etat.videoUrl = e?.video_url ?? ''; etat.dirty = false;
  synchroniserCoups();
}
function synchroniserCoups() {
  const existants = new Map(etat.content.coups.map((c) => [c.move_id, c]));
  const alignes = etat.arbre.map((m) => existants.get(m.id) ?? { move_id: m.id, pourquoi: '', annotations: [] });
  const orphelins = etat.content.coups.filter((c) => !etat.arbre.some((m) => m.id === c.move_id));
  etat.content.coups = [...alignes, ...orphelins];
}
const entreeCoup = (move_id) => etat.content.coups.find((c) => c.move_id === move_id);
const coupArbre = (move_id) => etat.arbre.find((m) => m.id === move_id);

// ------------------------------------------------------------------ navigation
function allerA(n) { etat.ligne = etat.ligne.slice(0, n); const g = new Chess(); for (const s of etat.ligne) g.move(s); etat.game = g; etat.sel = null; etat.targets = []; chargerPosition(); }
function jouerSan(san) { const g = new Chess(etat.game.fen()); try { g.move(san); } catch { return; } etat.ligne.push(san); etat.game = g; etat.sel = null; etat.targets = []; chargerPosition(); }
function dernierCoup(g = etat.game) { const m = g.history({ verbose: true }).at(-1); return m ? { from: m.from, to: m.to } : null; }
function numero(g, san) { const n = Math.ceil((g.history().length + 1) / 2); return g.turn() === 'w' ? `${n}. ${fr(san)}` : `${n}… ${fr(san)}`; }
function casesDuCoup(fen, san) { const t = new Chess(fen); try { const m = t.move(san); return { de: m.from, a: m.to }; } catch { return null; } }

// ------------------------------------------------------------------ rendu de l'échiquier et de sa couche d'annotations
function rendre() {
  renderPlayBoard($('ediBoard'), { fen: etat.game.fen(), orientation: etat.orientation, lastMove: dernierCoup(), targets: etat.targets, dragFrom: etat.sel });
  const b = $('ediBoard'); b.classList.toggle('edi__board-mode-fleche', etat.mode === 'fleche'); b.classList.toggle('edi__board-mode-surligner', etat.mode === 'surligner');
  dessinerCouche(); rendreLigne(); rendreCible();
}
/** Ce qu'on dessine dépend de la cible : la position (ses annotations + les coups de l'arbre en flèches fines), un coup (ses annotations, sa flèche épaisse), ou le pas courant d'une démonstration. */
function dessinerCouche(extra = null) {
  const cases = [], fleches = [];
  const ajouter = (annots, opacite) => { for (const a of annots) { if (a.type === 'case') cases.push({ case: a.case, couleur: a.couleur }); else fleches.push({ de: a.de, a: a.a, couleur: a.couleur, epais: true, opacite }); } };
  if (etat.demo) { ajouter(etat.demo.pas[etat.demo.i].annotations, 0.95); }
  else if (etat.apercu) { ajouter(etat.content.annotations, 0.9); if (extra) ajouter(extra, 0.95); }
  else if (etat.cible.type === 'coup') {
    const e = entreeCoup(etat.cible.move_id); const m = coupArbre(etat.cible.move_id); const fen = etat.game.fen();
    ajouter(etat.content.annotations, 0.35); if (e) ajouter(e.annotations, 0.95);
    const c = m && casesDuCoup(fen, m.san); if (c) fleches.push({ ...c, couleur: COULEUR_PAR_TYPE[m.kind], epais: true, opacite: 0.95 });
  } else {
    ajouter(etat.content.annotations, 0.95); const fen = etat.game.fen();
    for (const m of etat.arbre) { const c = casesDuCoup(fen, m.san); if (c) fleches.push({ ...c, couleur: COULEUR_PAR_TYPE[m.kind], epais: m.kind === 'principal', opacite: 0.45 }); }
  }
  dessinerAnnotations($('ediBoard'), { cases, fleches }, etat.orientation);
}
function rendreLigne() {
  const el = $('ediLigne'); el.innerHTML = '';
  if (!etat.ligne.length && !etat.demo) { el.textContent = 'Position de départ'; return; }
  etat.ligne.forEach((san, i) => {
    if (i % 2 === 0) el.append(Object.assign(document.createElement('span'), { textContent: `${i / 2 + 1}. ` }));
    const s = document.createElement('span'); s.className = 'mv' + (i === etat.ligne.length - 1 && !etat.demo ? ' mv--cur' : ''); s.textContent = fr(san) + ' '; s.title = 'Revenir ici';
    s.addEventListener('click', () => { if (etat.demo) return; allerA(i + 1); }); el.append(s);
  });
  if (etat.demo) { const d = document.createElement('span'); d.style.color = '#ffb86b'; d.textContent = ' ▶ ' + etat.demo.pas.slice(0, etat.demo.i + 1).map((p) => fr(p.san)).join(' '); el.append(d); }
}
function rendreCible() {
  const c = etat.cible; let t = 'la position';
  if (etat.demo) t = `le pas ${etat.demo.i + 1} de la démonstration`;
  else if (c.type === 'coup') { const m = coupArbre(c.move_id); t = `le coup ${m ? fr(m.san) : '?'}`; }
  $('ediCible').innerHTML = `Annotations : <b>${esc(t)}</b>${c.type === 'coup' && !etat.demo ? ' · <a href="#" id="lienCiblePosition">revenir à la position</a>' : ''}`;
  $('lienCiblePosition')?.addEventListener('click', (e) => { e.preventDefault(); etat.cible = { type: 'position' }; rendre(); rendreCoups(); });
}

// ------------------------------------------------------------------ annotations : liste visée par la cible courante
function listeCible() {
  if (etat.demo) { const p = etat.demo.pas[etat.demo.i]; return [() => p.annotations, (v) => { p.annotations = v; }]; }
  if (etat.cible.type === 'coup') { const e = entreeCoup(etat.cible.move_id); if (e) return [() => e.annotations, (v) => { e.annotations = v; }]; }
  return [() => etat.content.annotations, (v) => { etat.content.annotations = v; }];
}
function poserCase(sq) { if (!peutEditer()) return; const [get, set] = listeCible(); set(basculerCase(get(), sq, etat.couleur)); marquerModifie(); dessinerCouche(); rendreCoups(); }
function poserFleche(de, a) { if (!peutEditer()) return; const [get, set] = listeCible(); set(basculerFleche(get(), de, a, etat.couleur)); marquerModifie(); dessinerCouche(); rendreCoups(); }
function effacerAnnotations() { if (!peutEditer()) return; const [, set] = listeCible(); set([]); marquerModifie(); dessinerCouche(); rendreCoups(); }

// ------------------------------------------------------------------ interaction avec l'échiquier
function tenter(from, to) {
  etat.sel = null; etat.targets = [];
  const t = new Chess(etat.game.fen()); let m; try { m = t.move({ from, to, promotion: 'q' }); } catch { rendre(); return; }
  if (etat.demo) { ajouterPas(m.san); return; }
  const dansArbre = etat.arbre.find((c) => c.san === m.san);
  if (dansArbre) {
    if (dansArbre.kind === 'porte') { bandeau(`${fr(m.san)} mène à un autre livre (${esc(dansArbre.porte_opening_id ?? '?')}) : il n'est pas prolongé ici.`); rendre(); return; }
    if (!dansArbre.to_position && etat.position?.id) { /* la position suivante n'existe pas encore : l'API la créera à la demande */ }
    jouerSan(m.san); return;
  }
  rendre();
  if (!peutEditer()) { bandeau(`${fr(m.san)} n'est pas dans le livre. Connecte-toi en tant qu'enseignant pour le proposer.`); return; }
  dialogueAjoutCoup(m.san);
}
bindPlayBoardInput($('ediBoard'), {
  canInteract: () => etat.mode === 'jouer' && !etat.apercu,
  getPiece: (sq) => etat.game.get(sq), playerColor: () => etat.game.turn(),
  onSquareClick: (sq) => { if (etat.sel && etat.targets.includes(sq)) { tenter(etat.sel, sq); return; } const p = etat.game.get(sq); if (p && p.color === etat.game.turn()) { etat.sel = sq; etat.targets = etat.game.moves({ square: sq, verbose: true }).map((m) => m.to); } else { etat.sel = null; etat.targets = []; } rendre(); },
  onDragStart: (from) => { const p = etat.game.get(from); if (p && p.color === etat.game.turn()) { etat.sel = from; etat.targets = etat.game.moves({ square: from, verbose: true }).map((m) => m.to); rendre(); } },
  onDrop: (from, to) => { if (etat.targets.includes(to)) tenter(from, to); else { etat.sel = null; etat.targets = []; rendre(); } },
  onDragCancel: () => { etat.sel = null; etat.targets = []; rendre(); },
});
// modes Surligner / Flèche, et le geste des études Lichess : clic droit = case, clic droit glissé = flèche
{
  const board = $('ediBoard'); let depart = null; let droit = false;
  const caseDe = (e) => e.target.closest?.('[data-square]')?.dataset?.square ?? null;
  board.addEventListener('contextmenu', (e) => e.preventDefault());
  board.addEventListener('mousedown', (e) => {
    const sq = caseDe(e); if (!sq) return;
    if (e.button === 2) { droit = true; depart = sq; e.preventDefault(); return; }
    if (etat.mode === 'fleche') { depart = sq; e.preventDefault(); }
  });
  board.addEventListener('mouseup', (e) => {
    const sq = caseDe(e);
    if (droit) { if (sq && depart) { if (sq === depart) poserCase(sq); else poserFleche(depart, sq); } droit = false; depart = null; return; }
    if (etat.mode === 'surligner' && sq) poserCase(sq);
    else if (etat.mode === 'fleche' && depart && sq) poserFleche(depart, sq);
    depart = null;
  });
  board.addEventListener('mouseleave', () => { depart = null; droit = false; });
}
function choisirMode(mode) { etat.mode = mode; document.querySelectorAll('.edi__mode[data-mode]').forEach((b) => b.classList.toggle('edi__mode--actif', b.dataset.mode === mode)); etat.sel = null; etat.targets = []; rendre(); }
document.querySelectorAll('.edi__mode[data-mode]').forEach((b) => b.addEventListener('click', () => choisirMode(b.dataset.mode)));
document.querySelectorAll('.edi__couleur').forEach((b) => b.addEventListener('click', () => { etat.couleur = b.dataset.couleur; document.querySelectorAll('.edi__couleur').forEach((x) => x.classList.toggle('edi__couleur--actif', x === b)); }));
$('ediEffacer').addEventListener('click', effacerAnnotations);
$('btnDebut').addEventListener('click', () => { if (etat.demo) return; allerA(0); });
$('btnRetour').addEventListener('click', () => { if (etat.demo) { if (etat.demo.i > 0) { rejouerDemo(etat.demo.i - 1); rendre(); rendreDemo(); } return; } allerA(etat.ligne.length - 1); });
$('btnTourner').addEventListener('click', () => { etat.orientation = etat.orientation === 'white' ? 'black' : 'white'; rendre(); });
document.addEventListener('keydown', (e) => { if (e.target.matches('input, textarea, select')) return; if (e.key === 'ArrowLeft') $('btnRetour').click(); });

// ------------------------------------------------------------------ ajout d'un coup à l'arbre
function dialogue(html) {
  const d = $('ediDialogue'); d.hidden = false; d.innerHTML = `<div class="boite">${html}</div>`;
  d.onclick = (e) => { if (e.target === d) fermerDialogue(); }; return d.firstElementChild;
}
function fermerDialogue() { const d = $('ediDialogue'); d.hidden = true; d.innerHTML = ''; }
function dialogueAjoutCoup(sanInitial = '') {
  const boite = dialogue(`<h4>Ajouter un coup à l'arbre</h4>
    <p class="hors" style="margin:0 0 8px;font-size:.85rem">L'arbre est partagé entre les enseignants : ce coup apparaîtra pour tous, chacun y écrira son pourquoi.</p>
    <label>Coup <input id="dlgSan" type="text" value="${esc(sanInitial)}" placeholder="ex. Cf3 ou Nf3" style="width:7em;margin-left:6px"></label>
    <label>Type <select id="dlgKind"><option value="variante">variante</option><option value="faute">faute</option><option value="principal" ${estValidateur() ? '' : 'disabled'}>principal${estValidateur() ? '' : ' (validateur seulement)'}</option></select></label>
    <div id="dlgErr" style="color:#ff8a8a;font-size:.85rem;min-height:1.2em"></div>
    <div class="boutons"><button type="button" class="btn" id="dlgAnnuler">Annuler</button><button type="button" class="btn btn--primary" id="dlgOk">Ajouter</button></div>`);
  boite.querySelector('#dlgAnnuler').addEventListener('click', fermerDialogue);
  boite.querySelector('#dlgOk').addEventListener('click', async () => {
    const brut = boite.querySelector('#dlgSan').value.trim(); const kind = boite.querySelector('#dlgKind').value;
    const san = sanLegal(brut); if (!san) { boite.querySelector('#dlgErr').textContent = 'Coup illisible ou illégal dans cette position.'; return; }
    if (etat.arbre.some((c) => c.san === san)) { boite.querySelector('#dlgErr').textContent = 'Ce coup est déjà dans l\'arbre.'; return; }
    try {
      if (!etat.position?.id) throw new Error('position inconnue de l\'API');
      const j = await api('POST', `/api/positions/${etat.position.id}/coups`, { san, kind });
      etat.arbre.push(j.coup); etat.arbre.sort((a, b) => a.ord - b.ord); synchroniserCoups(); etat.cible = { type: 'coup', move_id: j.coup.id }; fermerDialogue(); rendre(); rendreCoups(); marquerModifie();
    } catch (e) { boite.querySelector('#dlgErr').textContent = e.status === 403 ? 'Refusé : changer le coup principal demande le rôle validateur.' : `Impossible d'ajouter : ${e.message}`; }
  });
  boite.querySelector('#dlgSan').focus();
}
/** Accepte un SAN anglais ou français et rend le SAN anglais légal, ou null. */
function sanLegal(brut) {
  const en = brut.replace(/^R(?=[a-h1-8x])/, 'K').replace(/D/g, 'Q').replace(/T/g, 'R').replace(/F/g, 'B').replace(/C/g, 'N');
  for (const cand of [brut, en]) { const t = new Chess(etat.game.fen()); try { return t.move(cand).san; } catch { /* suivant */ } }
  return null;
}
$('btnAjoutCoup').addEventListener('click', () => { if (peutEditer()) dialogueAjoutCoup(); });

// ------------------------------------------------------------------ formulaire
function rendreTout() { rendre(); rendreEnTete(); rendreChamps(); rendreCoups(); rendreReprendre(); $('ediAvertissements').hidden = true; rendreSauvegarde(); }
function rendreEnTete() {
  $('ediNom').textContent = etat.content.nom || LIVRES[etat.livre];
  const e = etat.explication; const autres = etat.explications.filter((x) => x.status === 'publie').length;
  $('ediEtat').textContent = e ? `${e.status} · version ${e.version}${e.based_on_id ? ' · reprise' : ''}` : (peutEditer() ? 'aucun texte de toi ici' : '') + (autres ? ` · ${autres} version${autres > 1 ? 's' : ''} publiée${autres > 1 ? 's' : ''}` : '');
  $('ediFil').textContent = etat.ligne.length ? etat.ligne.map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + fr(s)).join(' ') : 'position de départ';
  const dernier = etat.ligne.at(-1); const avant = new Chess(); for (const s of etat.ligne.slice(0, -1)) avant.move(s);
  $('fSensCoup').textContent = dernier ? `(${numero(avant, dernier)})` : '(position de départ)';
  $('lienAssistant').href = `./ouverture.html`;
  $('ediLivre').value = etat.livre;
}
function rendreChamps() {
  $('fNom').value = etat.content.nom; $('fSens').value = etat.content.sens; $('fMenace').value = etat.content.menace; $('fVideo').value = etat.videoUrl;
  $('fBlancs').value = etat.content.schema.blancs; $('fNoirs').value = etat.content.schema.noirs;
  compterSens(); titreOnglet();
}
function lier(id, setter) { $(id).addEventListener('input', (e) => { setter(e.target.value); marquerModifie(); if (id === 'fNom') $('ediNom').textContent = etat.content.nom || LIVRES[etat.livre]; }); }
lier('fNom', (v) => { etat.content.nom = v; }); lier('fSens', (v) => { etat.content.sens = v; }); lier('fMenace', (v) => { etat.content.menace = v; }); lier('fVideo', (v) => { etat.videoUrl = v; });
lier('fBlancs', (v) => { etat.content.schema.blancs = v; }); lier('fNoirs', (v) => { etat.content.schema.noirs = v; });

function rendreCoups() {
  const liste = $('fCoups'); const fautes = $('fFautes'); liste.innerHTML = ''; fautes.innerHTML = '';
  for (const m of etat.arbre) (m.kind === 'faute' ? fautes : liste).append(carteCoup(m));
  for (const el of [liste, fautes]) activerDepose(el);
  if (!etat.arbre.length) liste.innerHTML = '<div class="hors">Aucun coup proposé ici : joue un coup sur l\'échiquier pour l\'ajouter à l\'arbre.</div>';
  $('fFautesBloc').hidden = !etat.arbre.some((m) => m.kind === 'faute');
}
function carteCoup(m) {
  const e = entreeCoup(m.id) ?? { pourquoi: '', annotations: [] };
  const d = document.createElement('div'); d.className = `ccoup ccoup--${m.kind}` + (etat.cible.type === 'coup' && etat.cible.move_id === m.id ? ' ccoup--cible' : '');
  const nPas = e.sequence?.pas?.length ?? 0; const nAnn = e.annotations.length + (e.sequence?.pas ?? []).reduce((s, p) => s + (p.annotations?.length ?? 0), 0);
  d.innerHTML = `<div class="ccoup__san">${esc(fr(m.san))}</div>
    <div class="ccoup__why"><textarea placeholder="Pourquoi ce coup : ce qu'il fait, ce qu'il prépare, ce qu'il laisse à l'adversaire.">${esc(e.pourquoi)}</textarea></div>
    <div class="ccoup__type"><select class="form-select form-select-sm">${Object.entries(TYPES).map(([k, v]) => `<option value="${k}" ${k === m.kind ? 'selected' : ''} ${(k === 'principal' && !estValidateur() && m.kind !== 'principal') || (k === 'porte' && m.kind !== 'porte') ? 'disabled' : ''}>${v}</option>`).join('')}</select></div>
    <div class="ccoup__pied"><span>${nAnn} annotation${nAnn > 1 ? 's' : ''}</span>
      <button type="button" class="btn" data-demo>${nPas ? `Modifier la suite (${nPas} pas)` : 'Enregistrer une suite'}</button>
      ${m.kind !== 'porte' ? '<button type="button" class="btn ccoup__jouer" data-jouer title="Aller à la position après ce coup">jouer ce coup ▸</button>' : ''}
      ${peutEditer() ? '<span class="ccoup__ordre"><button type="button" class="btn" data-ordre="-1" title="Monter">▲</button><button type="button" class="btn" data-ordre="1" title="Descendre">▼</button></span>' : ''}
      ${e.sequence?.eval != null ? `<span class="${Math.abs(e.sequence.eval) >= 30 ? 'ok' : 'ko'}">éval. ${(e.sequence.eval / 100).toFixed(1).replace('.', ',')}</span>` : ''}
      ${e.sequence?.origine ? `<span>${esc(e.sequence.origine)}</span>` : ''}
      ${m.to_position ? '<span>→ position écrite</span>' : '<span>→ pas encore de suite dans le livre</span>'}</div>`;
  d.addEventListener('click', (ev) => { if (ev.target.closest('textarea, select, button')) return; etat.cible = etat.cible.type === 'coup' && etat.cible.move_id === m.id ? { type: 'position' } : { type: 'coup', move_id: m.id }; rendre(); rendreCoups(); });
  d.querySelector('textarea').addEventListener('input', (ev) => { const x = entreeCoup(m.id); if (x) { x.pourquoi = ev.target.value; marquerModifie(); } });
  d.querySelector('textarea').addEventListener('focus', () => { if (!(etat.cible.type === 'coup' && etat.cible.move_id === m.id)) { etat.cible = { type: 'coup', move_id: m.id }; rendre(); document.querySelectorAll('.ccoup').forEach((c) => c.classList.remove('ccoup--cible')); d.classList.add('ccoup--cible'); } });
  d.querySelector('select').addEventListener('change', async (ev) => {
    const kind = ev.target.value; const ancien = m.kind;
    try {
      await api('POST', `/api/positions/${etat.position.id}/coups`, { san: m.san, kind });
      // l'API rétrograde l'ancien principal en variante : on relit l'arbre pour le refléter fidèlement
      if (kind === 'principal' || ancien === 'principal') { await chargerPosition(); }
      else { m.kind = kind; rendre(); rendreCoups(); }
    } catch (err) { ev.target.value = ancien; bandeau(err.status === 403 ? (err.message || 'Changer le coup principal demande le rôle validateur.') : `Type non modifié : ${esc(err.message)}`, true); }
  });
  d.querySelector('[data-demo]').addEventListener('click', () => demarrerDemo(m.id));
  d.querySelector('[data-jouer]')?.addEventListener('click', () => jouerSan(m.san));
  d.querySelectorAll('[data-ordre]').forEach((b) => b.addEventListener('click', () => reordonner(ordreDecale(idsDuGroupe(m), m.id, Number(b.dataset.ordre)), m.kind === 'faute')));
  // glisser-déposer
  if (peutEditer()) {
    d.draggable = true; d.dataset.moveId = String(m.id);
    d.addEventListener('dragstart', (ev) => { if (ev.target.closest('textarea, select, button')) { ev.preventDefault(); return; } ev.dataTransfer.setData('text/plain', String(m.id)); ev.dataTransfer.effectAllowed = 'move'; d.classList.add('ccoup--glisse'); });
    d.addEventListener('dragend', () => { d.classList.remove('ccoup--glisse'); document.querySelectorAll('.ccoup--survol').forEach((c) => c.classList.remove('ccoup--survol')); });
  }
  return d;
}

/** Identifiants du groupe (coups proposés ou fautes) auquel appartient le coup, dans l'ordre affiché. */
function idsDuGroupe(m) { const faute = m.kind === 'faute'; return etat.arbre.filter((x) => (x.kind === 'faute') === faute).map((x) => x.id); }

/** Zone de dépose : une liste (#fCoups ou #fFautes) accepte les cartes de son propre groupe. */
function activerDepose(liste) {
  if (!peutEditer() || liste.dataset.depose) return; liste.dataset.depose = '1';
  liste.addEventListener('dragover', (ev) => {
    const carte = ev.target.closest('.ccoup'); if (!carte || !carte.dataset.moveId) return; ev.preventDefault(); ev.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.ccoup--survol').forEach((c) => c.classList.remove('ccoup--survol')); carte.classList.add('ccoup--survol');
  });
  liste.addEventListener('drop', (ev) => {
    ev.preventDefault(); const id = Number(ev.dataTransfer.getData('text/plain')); const cible = ev.target.closest('.ccoup'); if (!id || !cible) return;
    const m = coupArbre(id); const c = coupArbre(Number(cible.dataset.moveId)); if (!m || !c || (m.kind === 'faute') !== (c.kind === 'faute')) return;
    const ids = idsDuGroupe(m); const rect = cible.getBoundingClientRect(); const apres = ev.clientY > rect.top + rect.height / 2;
    const suivant = apres ? ids[ids.indexOf(c.id) + 1] ?? null : c.id;
    reordonner(ordreApresDepose(ids, id, suivant), m.kind === 'faute');
  });
}

/** Applique un nouvel ordre à un groupe : enregistre côté serveur (PATCH …/coups/ordre), puis re-rend dans l'ordre renvoyé. */
async function reordonner(ids, fautes) {
  const actuel = etat.arbre.filter((x) => (x.kind === 'faute') === fautes).map((x) => x.id);
  if (JSON.stringify(ids) === JSON.stringify(actuel)) return;
  const appliquer = (ordres) => { // ordres : Map id → ord
    for (const m of etat.arbre) if (ordres.has(m.id)) m.ord = ordres.get(m.id);
    etat.arbre.sort((a, b) => a.ord - b.ord); synchroniserCoups(); rendreCoups();
  };
  try {
    const j = await api('PATCH', `/api/positions/${etat.position.id}/coups/ordre`, { ids });
    appliquer(new Map((j.coups ?? []).map((c) => [Number(c.id), c.ord])));
  } catch (e) {
    // ordre tenu localement pour la session ; on prévient que le serveur ne l'a pas gardé
    appliquer(new Map(ids.map((id, i) => [id, i])));
    bandeau(e.status === 403 ? 'Réordonner demande le rôle enseignant.' : `Ordre non enregistré sur le serveur (${esc(e.message)}) : il sera perdu au rechargement.`, true);
  }
}

// ------------------------------------------------------------------ brouillon, publication, vérification
const TITRE_ONGLET = document.title;
function titreOnglet() { document.title = (etat.dirty ? '• ' : '') + TITRE_ONGLET; }
function marquerModifie() {
  if (!peutEditer()) return;
  etat.dirty = true; rendreSauvegarde(); titreOnglet(); clearTimeout(etat.autosave); etat.autosave = setTimeout(() => enregistrer(true), 30000);
}
function compterSens() { const n = $('fSens').value.length; const el = $('fSensCompte'); if (!el) return; el.textContent = `${n} caractère${n > 1 ? 's' : ''}${n > 400 ? ' — long pour un débutant, 400 au plus conseillés' : ''}`; el.classList.toggle('ko', n > 400); }
$('fSens').addEventListener('input', compterSens);
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); enregistrer(); } });
function rendreSauvegarde(msg = null) {
  const el = $('ediSauvegarde');
  if (msg) { el.innerHTML = msg; return; }
  if (etat.dirty) el.textContent = 'Modifications non enregistrées (enregistrement automatique dans 30 s).';
  else if (etat.lastSaved) el.textContent = `Brouillon enregistré à ${etat.lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`;
  else el.textContent = '';
}
async function enregistrer(auto = false) {
  if (!peutEditer()) return false;
  if (!etat.position?.id) { rendreSauvegarde('<span class="ko">Rien à enregistrer : la position n\'est pas connue de l\'API.</span>'); return false; }
  clearTimeout(etat.autosave);
  try {
    const j = await api('PUT', `/api/positions/${etat.position.id}/explication`, { content: etat.content, video_url: etat.videoUrl || null });
    etat.explication = j.explication; etat.dirty = false; etat.lastSaved = new Date(); titreOnglet(); rendreSauvegarde(); rendreEnTete(); return true;
  } catch (e) { rendreSauvegarde(`<span class="ko">${auto ? 'Enregistrement automatique impossible' : 'Enregistrement impossible'} : ${esc(e.message)}</span>`); return false; }
}
async function publier() {
  if (!(await enregistrer())) return;
  try { const j = await api('POST', `/api/explications/${etat.explication.id}/publier`); etat.explication = j.explication; rendreEnTete(); rendreSauvegarde(`Publié (version ${j.explication.version}). Les apprenants qui te lisent voient ce texte.`); }
  catch (e) { rendreSauvegarde(`<span class="ko">Publication impossible : ${esc(e.message)}</span>`); }
}
async function verifier() {
  const box = $('ediAvertissements'); box.hidden = false; box.textContent = 'Vérification au moteur…';
  try {
    const j = await api('POST', '/api/verifier', { position_id: etat.position?.id, content: etat.content });
    const av = j.avertissements ?? [];
    box.innerHTML = av.length ? `<b>${av.length} avertissement${av.length > 1 ? 's' : ''}</b> (non bloquants, tu gardes le dernier mot) :<ul>${av.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : '<span class="ok">Le moteur ne voit rien à redire.</span>';
    for (const c of j.coups ?? []) { const e = entreeCoup(c.move_id); if (e) e.verif = c; }
  } catch (e) { box.innerHTML = `<span class="ko">Vérification impossible : ${esc(e.message)}</span>`; }
}
$('btnEnregistrer').addEventListener('click', () => enregistrer());
$('btnPublier').addEventListener('click', publier);
$('btnVerifier').addEventListener('click', verifier);
window.addEventListener('beforeunload', (e) => { if (etat.dirty) { e.preventDefault(); e.returnValue = ''; } });

// « Partir du texte de… »
function rendreReprendre() {
  const sel = $('selReprendre'); sel.innerHTML = '<option value="">Partir du texte de…</option>';
  for (const x of etat.explications.filter((x) => x.status === 'publie' && x.author?.id !== etat.moi?.id)) sel.append(Object.assign(document.createElement('option'), { value: x.id, textContent: `${x.author?.display_name ?? '?'} (v${x.version})` }));
  sel.disabled = sel.options.length === 1;
}
$('selReprendre').addEventListener('change', async (e) => {
  const id = e.target.value; if (!id) return; e.target.value = '';
  if (etat.dirty && !confirm('Ton brouillon actuel sera remplacé par une copie de ce texte. Continuer ?')) return;
  try { await api('POST', `/api/explications/${id}/reprendre`); etat.dirty = false; await chargerPosition(); rendreSauvegarde('Texte repris dans ton brouillon : modifie-le, puis publie.'); }
  catch (err) { rendreSauvegarde(`<span class="ko">Reprise impossible : ${esc(err.message)}</span>`); }
});
$('ediLivre').addEventListener('change', (e) => { etat.livre = e.target.value; etat.ligne = []; etat.game = new Chess(); chargerPosition(); });

// ------------------------------------------------------------------ démonstration (séquence rejouable)
function demarrerDemo(move_id) {
  if (!peutEditer() || etat.demo) return;
  const m = coupArbre(move_id); const e = entreeCoup(move_id); if (!m || !e) return;
  const pas = e.sequence?.pas?.length ? e.sequence.pas.map((p) => ({ san: p.san, phrase: p.phrase ?? '', annotations: [...(p.annotations ?? [])] })) : [{ san: m.san, phrase: '', annotations: [] }];
  if (pas[0].san !== m.san) pas.unshift({ san: m.san, phrase: '', annotations: [] });
  etat.demo = { move_id, pas, i: 0, fenDepart: etat.game.fen(), gameDepart: etat.game }; etat.mode === 'jouer' || choisirMode('jouer');
  rejouerDemo(pas.length - 1); rendre(); rendreDemo(); $('ediDroite').scrollTop = 0;
}
/** Place l'échiquier après le pas i ; si un pas est devenu illégal (séquence ancienne), on coupe là. */
function rejouerDemo(i) {
  const g = new Chess(etat.demo.fenDepart); let k = 0;
  for (; k <= i && k < etat.demo.pas.length; k++) { try { g.move(etat.demo.pas[k].san); } catch { etat.demo.pas = etat.demo.pas.slice(0, k); break; } }
  etat.demo.i = Math.min(i, etat.demo.pas.length - 1); etat.game = g;
}
function ajouterPas(san) {
  const d = etat.demo; d.pas = d.pas.slice(0, d.i + 1).concat([{ san, phrase: '', annotations: [] }]); rejouerDemo(d.pas.length - 1); marquerModifie(); rendre(); rendreDemo();
}
function rendreDemo() {
  const box = $('ediDemo'); const d = etat.demo; box.hidden = !d; if (!d) return;
  const m = coupArbre(d.move_id); const g = new Chess(d.fenDepart);
  box.innerHTML = `<h4>Démonstration du coup ${esc(fr(m?.san ?? '?'))} (${esc(TYPES[m?.kind] ?? '')}) — pas ${d.i + 1} / ${d.pas.length}</h4>
    <div class="hors">Joue les coups sur l'échiquier : chacun devient un pas. Écris une phrase par pas (facultatif). Les cases et flèches posées maintenant appartiennent au pas courant.</div>
    <div id="demoPas"></div>
    <div class="boutons"><button type="button" class="btn" id="demoPrec">◀ pas précédent</button><button type="button" class="btn" id="demoSuiv">pas suivant ▶</button><button type="button" class="btn" id="demoSuppr" title="Retirer ce pas et les suivants">Couper ici</button><button type="button" class="btn btn--primary" id="demoFin">Terminer</button><button type="button" class="btn" id="demoAnnuler">Annuler</button></div>`;
  const liste = box.querySelector('#demoPas');
  d.pas.forEach((p, k) => {
    const row = document.createElement('div'); row.className = 'pas' + (k === d.i ? ' pas--cur' : '');
    const num = numero(g, p.san); try { g.move(p.san); } catch { /* ignoré */ }
    row.innerHTML = `<b>${esc(num)}</b><input type="text" placeholder="phrase pour ce pas" value="${esc(p.phrase)}">`;
    row.querySelector('b').addEventListener('click', () => { rejouerDemo(k); rendre(); rendreDemo(); });
    row.querySelector('input').addEventListener('input', (ev) => { p.phrase = ev.target.value; marquerModifie(); });
    row.querySelector('input').addEventListener('focus', () => { if (d.i !== k) { rejouerDemo(k); rendre(); rendreDemo(); liste.querySelectorAll('input')[k]?.focus(); } });
    liste.append(row);
  });
  box.querySelector('#demoPrec').addEventListener('click', () => { if (d.i > 0) { rejouerDemo(d.i - 1); rendre(); rendreDemo(); } });
  box.querySelector('#demoSuiv').addEventListener('click', () => { if (d.i < d.pas.length - 1) { rejouerDemo(d.i + 1); rendre(); rendreDemo(); } });
  box.querySelector('#demoSuppr').addEventListener('click', () => { if (d.i === 0) return; d.pas = d.pas.slice(0, d.i); rejouerDemo(d.pas.length - 1); marquerModifie(); rendre(); rendreDemo(); });
  box.querySelector('#demoFin').addEventListener('click', () => finirDemo(true));
  box.querySelector('#demoAnnuler').addEventListener('click', () => finirDemo(false));
}
function finirDemo(garder) {
  const d = etat.demo; if (!d) return;
  if (garder) { const e = entreeCoup(d.move_id); if (e) { e.sequence = { ...(e.sequence ?? {}), pas: d.pas, origine: 'enseignant' }; delete e.sequence.eval; marquerModifie(); } }
  etat.game = d.gameDepart; etat.demo = null; etat.cible = { type: 'coup', move_id: d.move_id }; $('ediDemo').hidden = true; rendre(); rendreCoups();
}

// ------------------------------------------------------------------ aperçu : la position comme l'apprenant la verra, depuis MON contenu
let apercuTimer = null;
function ouvrirApercu() {
  if (etat.demo) return;
  etat.apercu = { recit: null }; etat.cible = { type: 'position' };
  $('ediForm').hidden = true; $('ediEtat').textContent = 'aperçu'; rendre();
  const box = document.createElement('div'); box.className = 'edi__apercu'; box.id = 'ediApercu'; $('ediDroite').insertBefore(box, $('ediForm')); rendreApercu();
}
function fermerApercu() { clearTimeout(apercuTimer); $('ediApercu')?.remove(); $('ediForm').hidden = false; etat.apercu = null; const g = new Chess(); for (const s of etat.ligne) g.move(s); etat.game = g; rendreTout(); }
function rendreApercu() {
  const box = $('ediApercu'); if (!box) return; const c = etat.content; const dernier = etat.ligne.at(-1); const avant = new Chess(); for (const s of etat.ligne.slice(0, -1)) avant.move(s);
  const qui = dernier ? (avant.turn() === 'w' ? 'Les Blancs' : 'Les Noirs') : '';
  let html = `<p class="hors" style="margin:0 0 10px"><button type="button" class="btn" id="btnQuitterApercu">◀ Quitter l'aperçu</button> Ce que verra l'apprenant qui te lit (survole un coup : l'enchaînement se joue ; clique : pas à pas).</p>`;
  const r = etat.apercu.recit;
  if (r) {
    const m = coupArbre(r.move_id);
    html += `<p><span class="qui">${esc(fr(m.san))}</span> — ${esc(entreeCoup(r.move_id)?.pourquoi ?? '')}</p>`;
    r.pas.slice(0, r.i + 1).forEach((p, k) => { html += `<p class="pas">${k + 1}. <b>${esc(fr(p.san))}</b> ${esc(p.phrase)}</p>`; });
    html += r.i < r.pas.length - 1 ? `<p><button type="button" class="btn btn--primary" id="btnApercuSuivant">Suivant ▶</button> <span class="hors">${r.pas.length - 1 - r.i} pas restant${r.pas.length - 1 - r.i > 1 ? 's' : ''}</span></p>` : `<p><button type="button" class="btn" id="btnApercuRetour">⏪ Revenir à la position</button></p>`;
  } else {
    if (dernier) html += `<p><span class="qui">${esc(numero(avant, dernier))}</span> — ${qui} ${esc(c.sens || '(sens du coup non écrit)')}</p>`; else html += `<p>${esc(c.sens || '(sens non écrit)')}</p>`;
    if (c.menace) html += `<p class="menace">Menace : ${esc(c.menace)}.</p>`;
    html += '<div class="ouv__bloc"><h3>Coups du livre</h3><div class="ouv__liste" id="apercuCoups"></div></div>';
    if (etat.arbre.some((m) => m.kind === 'faute')) html += '<div class="ouv__bloc"><h3>Fautes typiques</h3><div class="ouv__liste" id="apercuFautes"></div></div>';
    if (c.schema.blancs || c.schema.noirs) html += `<div class="ouv__bloc"><h3>Ce que chacun va chercher ensuite</h3><div class="ouv__schema"><div><b>Les Blancs</b>${esc(c.schema.blancs)}</div><div><b>Les Noirs</b>${esc(c.schema.noirs)}</div></div></div>`;
  }
  box.innerHTML = html;
  box.querySelector('#btnQuitterApercu').addEventListener('click', fermerApercu);
  box.querySelector('#btnApercuSuivant')?.addEventListener('click', () => { const r2 = etat.apercu.recit; r2.i++; const g = new Chess(etat.apercu.fenDepart); for (let k = 0; k <= r2.i; k++) g.move(r2.pas[k].san); etat.game = g; rendre(); dessinerCouche(r2.pas[r2.i].annotations); rendreApercu(); });
  box.querySelector('#btnApercuRetour')?.addEventListener('click', () => { etat.apercu.recit = null; const g = new Chess(); for (const s of etat.ligne) g.move(s); etat.game = g; rendre(); rendreApercu(); });
  if (!r) for (const m of etat.arbre) {
    const e = entreeCoup(m.id); const d = document.createElement('div'); d.className = `coup${m.kind === 'principal' ? ' coup--principal' : ''}${m.kind === 'faute' ? ' coup--erreur' : ''}`;
    d.innerHTML = `<div class="coup__san">${esc(fr(m.san))}<small>${esc(TYPES[m.kind])}</small></div><div class="coup__why">${esc(e?.pourquoi || '(pourquoi non écrit)')}${e?.sequence?.pas?.length > 1 ? ` <span class="coup__pun">— ${e.sequence.pas.length - 1} coup${e.sequence.pas.length > 2 ? 's' : ''} de suite</span>` : ''}</div>`;
    d.addEventListener('mouseenter', () => demarrerApercuCoup(m, e));
    d.addEventListener('mouseleave', arreterApercuCoup);
    d.addEventListener('click', () => { arreterApercuCoup(); if (e?.sequence?.pas?.length) { etat.apercu.recit = { move_id: m.id, pas: e.sequence.pas, i: 0 }; etat.apercu.fenDepart = etat.game.fen(); const g = new Chess(etat.game.fen()); g.move(e.sequence.pas[0].san); etat.game = g; rendre(); dessinerCouche(e.sequence.pas[0].annotations); rendreApercu(); } });
    (m.kind === 'faute' ? box.querySelector('#apercuFautes') : box.querySelector('#apercuCoups'))?.append(d);
  }
}
function demarrerApercuCoup(m, e) {
  arreterApercuCoup(); const coups = e?.sequence?.pas?.length ? e.sequence.pas.map((p) => p.san) : [m.san];
  const g = new Chess(etat.game.fen()); let k = 0; const fenRetour = etat.game.fen();
  const tick = () => { if (k >= coups.length) return; try { g.move(coups[k]); } catch { return; } renderPlayBoard($('ediBoard'), { fen: g.fen(), orientation: etat.orientation, lastMove: dernierCoup(g), targets: [] }); const annots = e?.sequence?.pas?.[k]?.annotations ?? (k === 0 ? e?.annotations ?? [] : []); dessinerAnnotations($('ediBoard'), { cases: annots.filter((a) => a.type === 'case'), fleches: annots.filter((a) => a.type === 'fleche').map((a) => ({ ...a, epais: true })) }, etat.orientation); k++; apercuTimer = setTimeout(tick, 700); };
  apercuTimer = setTimeout(tick, 150); etat.apercu.fenRetour = fenRetour;
}
function arreterApercuCoup() { clearTimeout(apercuTimer); apercuTimer = null; if (etat.apercu) rendre(); }
$('btnApercu').addEventListener('click', () => (etat.apercu ? fermerApercu() : ouvrirApercu()));

// ------------------------------------------------------------------ tiroir : historique et remarques
async function ouvrirTiroir(titre) {
  $('ediTiroirTitre').textContent = titre; $('ediTiroir').hidden = false; const corps = $('ediTiroirCorps'); corps.textContent = 'Chargement…';
  if (!etat.position?.id) { corps.textContent = 'Position inconnue de l\'API.'; return; }
  let j; try { j = await api('GET', `/api/positions/${etat.position.id}/historique`); } catch (e) { corps.textContent = `Impossible de charger : ${e.message}`; return; }
  const versions = j.versions ?? []; const remarques = j.remarques ?? [];
  if (titre === 'Historique') {
    corps.innerHTML = versions.length ? '' : '<p class="hors">Aucune version pour cette position.</p>';
    if (versions.length > 1) corps.insertAdjacentHTML('beforeend', '<p class="hors cmp__aide">Coche deux versions pour les comparer côte à côte.</p>');
    const cochees = new Set();
    for (const v of versions) {
      const mienne = v.author?.id === etat.moi?.id; const visible = v.status === 'publie' || mienne;
      const d = document.createElement('div'); d.className = 'version' + (v.status === 'publie' ? ' version--publie' : '');
      d.innerHTML = `<div>${visible && versions.length > 1 ? `<label class="cmp__case"><input type="checkbox" data-cmp="${v.id}" title="comparer"> </label>` : ''}<b>${esc(v.author?.display_name ?? '?')}</b> · v${v.version} · ${esc(v.status)}<small>${new Date(v.published_at ?? v.created_at).toLocaleString('fr-FR')}</small></div>
        <div>${peutEditer() && !(mienne && v.id === etat.explication?.id) ? `<button type="button" class="btn" data-reprendre="${v.id}">${mienne ? 'Restaurer' : 'Reprendre'}</button>` : ''}</div>`;
      d.querySelector('[data-reprendre]')?.addEventListener('click', async (ev) => { try { await api('POST', `/api/explications/${ev.target.dataset.reprendre}/reprendre`); etat.dirty = false; fermerTiroir(); await chargerPosition(); rendreSauvegarde('Version copiée dans ton brouillon.'); } catch (e) { ev.target.textContent = `Échec : ${e.message}`; } });
      d.querySelector('[data-cmp]')?.addEventListener('change', (ev) => {
        const id = Number(ev.target.dataset.cmp);
        if (ev.target.checked) { if (cochees.size >= 2) { ev.target.checked = false; return; } cochees.add(id); } else cochees.delete(id);
        rendreComparaison([...cochees], versions);
      });
      corps.append(d);
    }
    corps.insertAdjacentHTML('beforeend', '<div id="ediComparaison" class="cmp" hidden></div>');
  } else {
    const autres = versions.filter((v) => v.status === 'publie' && v.author?.id !== etat.moi?.id);
    corps.innerHTML = (remarques.length ? remarques.map((r) => `<div class="remarque"><b>${esc(r.author?.display_name ?? '?')}</b> <small>sur la version ${esc(String(versions.find((v) => v.id === r.explanation_id)?.author?.display_name ?? r.explanation_id))} · ${new Date(r.created_at).toLocaleString('fr-FR')}</small><br>${esc(r.texte)}</div>`).join('') : '<p class="hors">Aucune remarque ici.</p>')
      + (peutEditer() && autres.length ? `<p style="margin-top:12px"><b>Écrire une remarque</b> sur la version de <select id="remSur">${autres.map((v) => `<option value="${v.id}">${esc(v.author?.display_name ?? '?')} (v${v.version})</option>`).join('')}</select></p><textarea id="remTexte" rows="3" placeholder="« D'accord, mais j'ajouterais… »"></textarea><p><button type="button" class="btn btn--primary" id="remEnvoyer">Envoyer</button></p>` : '');
    corps.querySelector('#remEnvoyer')?.addEventListener('click', async () => { const t = corps.querySelector('#remTexte').value.trim(); if (!t) return; try { await api('POST', `/api/explications/${corps.querySelector('#remSur').value}/remarques`, { texte: t }); ouvrirTiroir('Remarques'); } catch (e) { corps.querySelector('#remEnvoyer').textContent = `Échec : ${e.message}`; } });
  }
}
/** Deux versions cochées : on lit leur contenu et on les met côte à côte, champs différents surlignés (classe diff). */
async function rendreComparaison(ids, versions) {
  const box = $('ediComparaison'); if (!box) return;
  if (ids.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false; box.textContent = 'Chargement des deux versions…';
  let a, b;
  try { [a, b] = await Promise.all(ids.map((id) => api('GET', `/api/explications/${id}/contenu`).then((j) => j.explication))); }
  catch (e) { box.innerHTML = `<span class="ko">Comparaison impossible : ${esc(e.message)}</span>`; return; }
  const diff = differences(a.content, b.content);
  const entete = (x) => { const v = versions.find((y) => y.id === x.id); return `<b>${esc(v?.author?.display_name ?? '?')}</b> · v${x.version} · ${esc(x.status)}`; };
  const ligne = (titre, cle, va, vb) => `<div class="cmp__titre">${titre}</div><div class="cmp__cell ${diff[cle] ? 'diff' : ''}">${esc(va || '—')}</div><div class="cmp__cell ${diff[cle] ? 'diff' : ''}">${esc(vb || '—')}</div>`;
  const ca = new Map((a.content?.coups ?? []).map((c) => [Number(c.move_id), c])); const cb = new Map((b.content?.coups ?? []).map((c) => [Number(c.move_id), c]));
  const pas = (c) => (c?.sequence?.pas?.length ? ` <small>(suite : ${c.sequence.pas.map((p) => fr(p.san)).join(' ')})</small>` : '');
  let html = `<div class="cmp__grille"><div></div><div class="cmp__cell cmp__entete">${entete(a)}</div><div class="cmp__cell cmp__entete">${entete(b)}</div>`
    + ligne('Nom', 'nom', a.content?.nom, b.content?.nom) + ligne('Sens', 'sens', a.content?.sens, b.content?.sens) + ligne('Menace', 'menace', a.content?.menace, b.content?.menace);
  for (const id of Object.keys(diff.coups).map(Number)) {
    const m = coupArbre(id); const x = ca.get(id), y = cb.get(id);
    html += `<div class="cmp__titre">${m ? esc(fr(m.san)) : 'coup ' + id}</div><div class="cmp__cell ${diff.coups[id] ? 'diff' : ''}">${esc(x?.pourquoi || '—')}${pas(x)}</div><div class="cmp__cell ${diff.coups[id] ? 'diff' : ''}">${esc(y?.pourquoi || '—')}${pas(y)}</div>`;
  }
  html += ligne('Blancs', 'blancs', a.content?.schema?.blancs, b.content?.schema?.blancs) + ligne('Noirs', 'noirs', a.content?.schema?.noirs, b.content?.schema?.noirs) + '</div>';
  box.innerHTML = html;
}
function fermerTiroir() { $('ediTiroir').hidden = true; }
$('btnHistorique').addEventListener('click', () => ouvrirTiroir('Historique'));
$('btnRemarques').addEventListener('click', () => ouvrirTiroir('Remarques'));
$('btnFermerTiroir').addEventListener('click', fermerTiroir);

// ------------------------------------------------------------------ départ
await chargerMoi();
await chargerPosition();
