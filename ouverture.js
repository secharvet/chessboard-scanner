/**
 * Assistant d'ouverture (8 octobre 2026 ; lecture de l'API et professeurs le 17 octobre).
 * Échiquier d'étude + récit coup par coup, échiquier d'entraînement contre Stockfish qui suit le livre.
 * Les textes viennent de l'API de la plateforme (explications publiées par auteur) ; les fichiers livres/*.js
 * restent un repli quand l'API est injoignable. L'apprenant choisit son professeur, et peut en comparer deux.
 */
import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { getEngineMove } from './stockfish-client.js';
import { LIVRES } from './livres/index.js';
import { dessinerAnnotations, COULEUR_PAR_TYPE } from './fleches.js';
import { jouerSonCoup } from './sons.js';

const $ = (id) => document.getElementById(id);
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' };
const fr = (san) => san.replace(/[KQRBN]/g, (m) => FR[m]);
const PIECE_FR = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const IA_ID = '00000000-0000-0000-0000-000000000001';

// --- pur:début (fonctions sans DOM, testables en Node : voir le script de test dans le compte rendu)
/** Identifiant « IA » : l'auteur système des brouillons générés. */
export const estIA = (auteur) => !!auteur && (auteur.id === IA_ID || auteur.display_name === 'IA (brouillon)');

/**
 * Choisit l'explication à afficher parmi celles d'une position : le professeur choisi s'il a publié ici, sinon
 * l'auteur de référence, sinon le brouillon IA, sinon la première publiée. `repli` dit si l'on a dû se rabattre.
 * Seules les versions publiées comptent ici (les brouillons se lisent dans l'éditeur).
 */
export function choisirExplication(explications, choixId, referenceId) {
  const pub = (explications ?? []).filter((e) => e.status === 'publie');
  const par = (id) => (id ? pub.find((e) => String(e.author.id) === String(id)) : null);
  const voulue = par(choixId); if (voulue) return { expl: voulue, repli: false };
  const expl = par(referenceId) ?? pub.find((e) => estIA(e.author)) ?? pub[0] ?? null;
  return { expl, repli: !!expl && !!choixId };
}

/**
 * Fusionne l'arbre de l'API (coups proposés, partagés) avec les textes d'une explication (propres à l'auteur).
 * Renvoie l'entrée normalisée que le reste de la page sait afficher : plan (principal, variantes, portes), erreurs,
 * sens, menace, schéma, annotations, auteur.
 */
export function fusionner(reponse, expl) {
  const textes = new Map((expl?.content?.coups ?? []).map((x) => [Number(x.move_id), x]));
  const base = (m) => { const t = textes.get(Number(m.id)) ?? {}; return { san: m.san, move_id: Number(m.id), kind: m.kind, porte: m.porte_opening_id ?? null, pourquoi: t.pourquoi ?? '', annotations: t.annotations ?? [], sequence: t.sequence?.pas?.length ? t.sequence : null, to_position: !!m.to_position }; };
  const coups = [...(reponse.coups ?? [])].sort((a, b) => (a.ord - b.ord) || (a.id - b.id)).map(base);
  const c = expl?.content ?? {};
  return {
    id: reponse.position?.id ?? null, livre: reponse.position?.livre ?? null, coups: reponse.position?.coups ?? '',
    nom: c.nom ?? null, sens: c.sens ?? '', menace: c.menace ?? null, schema: c.schema ?? null, annotations: c.annotations ?? [],
    plan: coups.filter((x) => x.kind !== 'faute'), erreurs: coups.filter((x) => x.kind === 'faute'),
    auteur: expl ? { id: expl.author.id, nom: expl.author.display_name, date: expl.published_at, ia: estIA(expl.author) } : null,
    explication: expl ?? null, api: true,
  };
}

/** Même forme à partir d'une entrée des fichiers statiques (repli hors ligne) : les punitions deviennent des séquences. */
export function entreeStatique(e, punitions = {}) {
  const seq = (san) => { const p = punitions[`${e.coups} ${san}`]; return p ? { pas: p.ligne.map((s) => ({ san: s, phrase: '', annotations: [] })), eval: { avant: p.evalAvant, apres: p.evalApres, perte: p.perte, mat: p.mat, fautif: p.fautif }, origine: 'moteur' } : null; };
  return {
    id: null, livre: null, coups: e.coups, nom: e.nom ?? null, sens: e.sens ?? '', menace: e.menace ?? null, schema: e.schema ?? null, annotations: [],
    plan: (e.plan ?? []).map((p, i) => ({ san: p.san, move_id: null, kind: p.porte ? 'porte' : (i === 0 ? 'principal' : 'variante'), porte: p.porte ?? null, pourquoi: p.pourquoi ?? '', annotations: [], sequence: null })),
    erreurs: (e.erreurs ?? []).map((x) => ({ san: x.san, move_id: null, kind: 'faute', porte: null, pourquoi: x.pourquoi ?? '', annotations: [], sequence: seq(x.san) })),
    auteur: { id: IA_ID, nom: e.auteur ?? 'livre statique', date: e.date ?? null, ia: true }, explication: null, api: false,
  };
}
// --- pur:fin

// ---------------------------------------------------------------- Données : API d'abord, fichiers statiques en repli
const BOOKS = {}; // repli statique : { id, nom, signature, map(fenKey→entrée), PUNITIONS }
for (const L of LIVRES) {
  const [m, p] = await Promise.all([import(L.module), import(L.punitions).catch(() => ({ PUNITIONS: {} }))]);
  BOOKS[L.id] = { ...L, LIVRE: m.LIVRE, OUVERTURE: m.OUVERTURE, map: m.positionsDuLivre(Chess), PUNITIONS: p.PUNITIONS ?? {} };
}
let apiDispo = false; let livresApi = []; let utilisateur = null;
async function api(path) {
  const res = await fetch(path, { credentials: 'same-origin' });
  const j = await res.json().catch(() => ({})); return { status: res.status, json: j };
}
try {
  const r = await api('/api/livres'); if (r.status === 200 && r.json.ok) { apiDispo = true; livresApi = r.json.livres; }
} catch { apiDispo = false; }
try { const r = await api('/api/auth/moi'); utilisateur = r.json?.utilisateur ?? null; } catch { utilisateur = null; }
const ENSEIGNANT = !!utilisateur && ['enseignant', 'validateur', 'admin'].includes(utilisateur.role);
const livresDispo = () => (apiDispo ? livresApi.map((l) => ({ id: l.id, nom: l.nom, signature: l.signature })) : LIVRES.map((l) => ({ id: l.id, nom: l.nom, signature: l.signature })));
const nomLivre = (id) => livresDispo().find((l) => l.id === id)?.nom ?? BOOKS[id]?.OUVERTURE ?? id;

let courant = (livresDispo()[0] ?? LIVRES[0]).id;
/** Cache des réponses de l'API par (livre, FEN) ; `null` = hors du livre. */
const cachePos = new Map();
async function reponsePosition(livreId, c) {
  const k = `${livreId}|${cle(c)}`; if (cachePos.has(k)) return cachePos.get(k);
  let rep = null;
  if (apiDispo) {
    try {
      const r = await api(`/api/positions?livre=${encodeURIComponent(livreId)}&coups=${encodeURIComponent(c.history().join(' '))}`);
      if (r.status === 200 && r.json.ok) rep = r.json; else if (r.status !== 404) throw new Error(r.json.error || `HTTP ${r.status}`);
    } catch (e) { console.warn('[assistant] API indisponible, repli statique :', e.message); apiDispo = false; bandeauHorsLigne(true); }
  }
  if (!apiDispo) { const e = BOOKS[livreId]?.map.get(cle(c)); rep = e ? { statique: e, livre: livreId } : null; }
  cachePos.set(k, rep); return rep;
}
/** Entrée normalisée pour une position et un choix de professeur ; cherche dans le livre courant puis dans les autres (bascule). */
async function entreePour(c, profId, { bascule = true } = {}) {
  const ordre = [courant, ...livresDispo().map((l) => l.id).filter((id) => id !== courant)];
  for (const id of ordre) {
    const rep = await reponsePosition(id, c); if (!rep) continue;
    if (bascule && id !== courant) basculer(id);
    if (rep.statique) return entreeStatique(rep.statique, BOOKS[id]?.PUNITIONS ?? {});
    const { expl, repli } = choisirExplication(rep.explications, profId, rep.reference_author_id);
    const e = fusionner(rep, expl); e.repli = repli; e.reference_author_id = rep.reference_author_id; e.explications = rep.explications; return e;
  }
  return null;
}
function basculer(id) {
  if (id === courant) return; courant = id; const sel = $('ouvSelect'); if (sel && sel.value !== id) sel.value = id;
  const n = $('ouvNom'); if (n) n.dataset.bascule = `On passe à « ${nomLivre(id)} » : c'est ce que la position annonce.`;
  peuplerProfesseurs();
}
function bandeauHorsLigne(on) { const b = $('ouvHorsLigne'); if (b) b.hidden = !on; }
bandeauHorsLigne(!apiDispo);

// ---------------------------------------------------------------- Professeurs : choix principal et comparaison
const memo = { lire(k) { try { return localStorage.getItem(k); } catch { return null; } }, ecrire(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* stockage indisponible */ } } };
let profId = null; let prof2Id = null;
function auteursDuLivre(id) { return apiDispo ? (livresApi.find((l) => l.id === id)?.auteurs ?? []) : [{ id: IA_ID, display_name: 'IA (brouillon)', positions: BOOKS[id]?.LIVRE?.length ?? 0 }]; }
function peuplerProfesseurs() {
  const auteurs = auteursDuLivre(courant); const sel = $('ouvProf'); const sel2 = $('ouvProf2'); if (!sel) return;
  const nomAvecIA = (a) => estIA(a) ? 'Brouillon IA (à relire)' : a.display_name;
  const memoP = memo.lire(`ouv.prof.${courant}`); const memoP2 = memo.lire(`ouv.prof2.${courant}`);
  profId = auteurs.some((a) => String(a.id) === memoP) ? memoP : (auteurs[0]?.id ?? null);
  sel.innerHTML = auteurs.map((a) => `<option value="${esc(a.id)}">${esc(nomAvecIA(a))} · ${a.positions} pos.</option>`).join('') || '<option value="">(aucun texte publié)</option>';
  sel.value = profId ?? '';
  if (sel2) { prof2Id = auteurs.some((a) => String(a.id) === memoP2) && memoP2 !== profId ? memoP2 : null; sel2.innerHTML = '<option value="">personne</option>' + auteurs.filter((a) => String(a.id) !== String(profId)).map((a) => `<option value="${esc(a.id)}">${esc(nomAvecIA(a))}</option>`).join(''); sel2.value = prof2Id ?? ''; sel2.disabled = auteurs.length < 2; }
}
peuplerProfesseurs();
$('ouvProf')?.addEventListener('change', () => { profId = $('ouvProf').value || null; memo.ecrire(`ouv.prof.${courant}`, profId); if (prof2Id === profId) { prof2Id = null; memo.ecrire(`ouv.prof2.${courant}`, null); } peuplerProfesseurs(); render(); });
$('ouvProf2')?.addEventListener('change', () => { prof2Id = $('ouvProf2').value || null; memo.ecrire(`ouv.prof2.${courant}`, prof2Id); render(); });

// ---------------------------------------------------------------- État de l'échiquier d'étude
let game = new Chess();
let orientation = 'white';
let apercu = null; // aperçu muet en cours : { timer, badge }
let recit = null;  // récit pas à pas d'une faute : { coups, phrases, annots, i, retourFen, bon, eval, fauteSan, pourquoi, fautif }
let entreeCourante = null; // entrée normalisée (professeur principal) pour la position affichée
let entree2 = null;        // idem pour le professeur comparé
const RACINE = { nom: null, sens: '', menace: null, schema: null, annotations: [], erreurs: [], auteur: null, api: true,
  plan: [{ san: 'e4', move_id: null, kind: 'principal', porte: null, pourquoi: 'ouvre le centre et libère la dame et le fou roi : le premier coup des deux livres (Française, Italienne) ; ce sont les Noirs qui choisiront l\'ouverture', annotations: [], sequence: null }] };
const entree = () => entreeCourante;
function numero(c, san) { const n = Math.ceil((c.history().length + 1) / 2); return c.turn() === 'w' ? `${n}. ${fr(san)}` : `${n}… ${fr(san)}`; }

/** Cases et flèches à dessiner : flèches par type de coup (arbre), annotations de l'auteur sur la position, puis celles du coup survolé. */
function annotationsAffichees(surlign = null, coupSurligne = null) {
  const e = entree(); const cases = []; const fleches = [];
  if (!e) return { cases, fleches };
  const c = game.fen();
  const ajouterCoup = (x) => { const t = new Chess(c); let m; try { m = t.move(x.san); } catch { return; } const actif = surlign === x.san; fleches.push({ de: m.from, a: m.to, couleur: actif ? 'orange' : COULEUR_PAR_TYPE[x.kind === 'faute' ? 'faute' : x.kind] ?? 'bleu', epais: actif || x.kind === 'principal' }); };
  [...e.plan, ...e.erreurs].forEach(ajouterCoup);
  const ajouterAnnots = (liste, op) => { for (const a of liste ?? []) { if (a.type === 'case') cases.push({ case: a.case, couleur: a.couleur }); else if (a.type === 'fleche') fleches.push({ de: a.de, a: a.a, couleur: a.couleur, epais: true, opacite: op }); } };
  ajouterAnnots(e.annotations, 0.9);
  if (coupSurligne) ajouterAnnots(coupSurligne.annotations, 0.95);
  return { cases, fleches };
}
const dessiner = (surlign = null, coup = null) => dessinerAnnotations($('ouvBoard'), annotationsAffichees(surlign, coup), orientation);

let rendu = 0; // numéro de rendu, pour ignorer une réponse arrivée après un rendu plus récent
async function render(lastMove = null) {
  selected = null; targets = []; const mon = ++rendu;
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: lastMove ?? dernier(), targets: [] });
  renderLigne();
  if (recit) { afficherRecit(); return; }
  const racine = game.history().length === 0;
  let e = await entreePour(game, profId); if (mon !== rendu) return;
  if (racine) { if (!e || !e.plan.length) e = { ...RACINE, ...(e ? { id: e.id, livre: e.livre } : {}) }; }
  entreeCourante = e;
  entree2 = prof2Id && e?.api ? await entreePour(game, prof2Id, { bascule: false }) : null; if (mon !== rendu) return;
  dessiner(); renderPanneau();
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

/** Lien vers l'éditeur pour la position courante (enseignants). */
const lienEditeur = () => `./editeur.html?livre=${encodeURIComponent(courant)}&coups=${encodeURIComponent(game.history().join(' '))}`;
const dateFr = (d) => { try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return ''; } };
function signature(e) {
  if (!e?.auteur) return '';
  if (e.auteur.ia) return `Texte : <b>brouillon IA, à relire</b>${e.auteur.date ? ' · ' + dateFr(e.auteur.date) : ''}.`;
  return `Texte de <b>${esc(e.auteur.nom)}</b>${e.auteur.date ? ', publié le ' + dateFr(e.auteur.date) : ''}.`;
}

function renderPanneau() {
  const e = entree(); const h = game.history({ verbose: true }); const last = h.at(-1);
  $('ouvNom').textContent = e?.nom ?? nomLivre(courant);
  const etat = $('ouvEtat'); etat.textContent = e ? (e.auteur?.ia ? 'brouillon IA' : (e.auteur?.nom ?? '')) : 'hors du livre';
  // bouton éditeur (enseignant connecté)
  const btn = $('ouvEditer'); if (btn) { btn.hidden = !ENSEIGNANT || !apiDispo; btn.textContent = e ? 'Modifier cette position' : 'Écrire cette position'; btn.href = lienEditeur(); }
  const deux = !!(entree2 && prof2Id && prof2Id !== profId && e?.api);
  $('ouvColonnes').classList.toggle('ouv__colonnes--deux', deux); $('ouvCol2').hidden = !deux;
  renderColonne('', e, last, true);
  if (deux) renderColonne('2', entree2, last, false);
}
/** Une colonne de lecture : récit du dernier coup, coups du livre, fautes, schéma, signature. `suf` = '' ou '2'. */
function renderColonne(suf, e, last, principale) {
  const recitEl = $('ouvRecit' + suf); recitEl.innerHTML = '';
  if (principale) { const nomEl = $('ouvNom'); if (nomEl?.dataset.bascule) { recitEl.innerHTML += `<p class="bascule">${esc(nomEl.dataset.bascule)}</p>`; delete nomEl.dataset.bascule; } }
  if (!principale) { const a = auteursDuLivre(courant).find((x) => String(x.id) === String(prof2Id)); recitEl.innerHTML += `<p class="ouv__colTitre">${esc(estIA(a) ? 'Brouillon IA' : (a?.display_name ?? 'autre professeur'))}</p>`; }
  if (e?.repli && e.api) {
    const voulu = auteursDuLivre(courant).find((x) => String(x.id) === String(principale ? profId : prof2Id));
    recitEl.innerHTML += `<p class="repli">${esc(voulu ? (estIA(voulu) ? 'Le brouillon IA' : voulu.display_name) : 'Ce professeur')} n'a rien publié sur cette position : voici le texte de ${e.auteur ? (e.auteur.ia ? 'repli (brouillon IA)' : esc(e.auteur.nom)) : 'repli'}.</p>`;
  }
  if (!last) {
    recitEl.innerHTML += `<p>Deux livres pour l'instant : la <span class="qui">Défense française</span> (1. e4 e6) et la <span class="qui">Partie italienne</span> (1. e4 e5 2. Cf3 Cc6 3. Fc4). Les Blancs proposent 1. e4, les Noirs choisissent ; l'assistant suit automatiquement le livre que la position annonce. Clique sur un coup à droite, ou sur « Suivant », pour dérouler la ligne principale phrase par phrase.</p>`;
  } else {
    const qui = last.color === 'w' ? 'Blancs' : 'Noirs';
    if (e) {
      recitEl.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> <span class="camp">(${qui})</span> — ${e.sens ? sensPhrase(esc(e.sens)) : 'coup du livre.'}</p>`;
      if (e.menace) recitEl.innerHTML += `<p class="menace">Menace : ${esc(e.menace)}.</p>`;
      if (e.explication?.video_url) recitEl.innerHTML += `<p><a class="ouv__video" href="${esc(e.explication.video_url)}" target="_blank" rel="noopener">▶ Vidéo du professeur</a></p>`;
    } else if (principale) {
      const n = game.history().length;
      const hint = n <= 2 ? ` Les livres écrits commencent par <b>1. e4 e6</b> (Française) ou <b>1. e4 e5</b> (Italienne) : ce coup mène ailleurs.` : '';
      recitEl.innerHTML += `<p><span class="qui">${numero(avant(), last.san)}</span> — <span class="hors">ce coup n'est pas dans le livre : il n'est pas forcément mauvais, mais personne ne l'a encore expliqué ici.${hint} « Retour » pour revenir aux coups connus.</span></p>`;
      if (ENSEIGNANT && apiDispo) recitEl.innerHTML += `<p><a class="btn" href="${lienEditeur()}">✎ Écrire cette position</a></p>`;
    }
  }
  const liste = $('ouvListeCoups' + suf); liste.innerHTML = '';
  const plan = e?.plan ?? [];
  if (!plan.length) liste.innerHTML = `<div class="hors">Le livre s'arrête ici pour cette ligne.</div>`;
  for (const p of plan) liste.append(carte(p, p.kind === 'porte' ? 'autre livre' : p.kind, false));
  const err = e?.erreurs ?? []; $('ouvErreurs' + suf).hidden = !err.length; const le = $('ouvListeErreurs' + suf); le.innerHTML = '';
  for (const x of err) le.append(carte(x, 'à éviter', true));
  const sch = e?.schema && (e.schema.blancs || e.schema.noirs) ? e.schema : null; $('ouvSchema' + suf).hidden = !sch;
  if (sch) $('ouvSchemaCorps' + suf).innerHTML = `<div class="ouv__schema"><div><b>Les Blancs</b>${esc(sch.blancs ?? '')}${sch.coupsBlancs ? `<br><small>${fr(esc(sch.coupsBlancs))}</small>` : ''}</div><div><b>Les Noirs</b>${esc(sch.noirs ?? '')}${sch.coupsNoirs ? `<br><small>${fr(esc(sch.coupsNoirs))}</small>` : ''}</div></div>`;
  const sig = $('ouvSignature' + suf); if (sig) sig.innerHTML = e ? (signature(e) + (e.auteur?.ia ? ' Chaque enseignant peut signer sa version.' : '')) : '';
}
function avant() { const h = game.history(); const c = new Chess(); for (const s of h.slice(0, -1)) c.move(s); return c; }
function sensPhrase(s) { return s.replace(/^son /, 'leur ').replace(/\bson\b/g, 'leur').replace(/\bsa\b/g, 'leur').replace(/\bses\b/g, 'leurs') + (/[.!?]$/.test(s) ? '' : '.'); }

/** Carte d'un coup proposé (plan ou faute). Survol : aperçu (séquence de l'auteur, sinon ligne principale) ; clic : jouer, ou récit si c'est une faute avec séquence. */
function carte(x, tag, erreur) {
  const d = document.createElement('div'); d.className = 'coup' + (tag === 'principal' ? ' coup--principal' : '') + (erreur ? ' coup--erreur' : '');
  const seq = x.sequence; const suite = seq ? seq.pas.map((p) => fr(p.san)).join(' ') : '';
  const extra = x.kind === 'porte' ? ` <span class="coup__pun">— autre ouverture${x.porte && livresDispo().some((l) => l.id === x.porte) ? '' : ', livre à venir'}</span>` : (seq ? ` <span class="coup__pun">— ${erreur ? 'punition' : 'suite'} : ${esc(suite)}${seq.origine === 'moteur' ? '' : ' · ' + (x.annotations?.length || seq.pas.some((p) => p.annotations?.length) ? 'annotée' : 'du professeur')}</span>` : '');
  d.innerHTML = `<div class="coup__san">${fr(x.san)}<small>${esc(tag)}</small></div><div class="coup__why">${esc(x.pourquoi)}${extra}</div>`;
  d.addEventListener('mouseenter', () => { dessiner(x.san, x); demarrerApercu(x); });
  d.addEventListener('mouseleave', arreterApercu);
  d.addEventListener('click', () => { arreterApercu(); if (erreur && seq) demarrerRecit(x); else jouer(x.san); });
  return d;
}

/** Phrase mécanique pour un demi-coup (quand l'auteur n'en a pas écrit) : prise, échec, pièce attaquée sans défense. */
function phraseCoup(c, san) {
  const who = c.turn() === 'w' ? 'Les Blancs' : 'Les Noirs'; const m = c.move(san); if (!m) return '';
  const bits = [];
  if (m.captured) bits.push(`prennent ${PIECE_FR[m.captured]} en ${m.to}`);
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

/** Récit d'une faute : on joue la faute, puis « Suivant » déroule la séquence une phrase à la fois (celle de l'auteur si elle existe), puis bilan et retour. */
function demarrerRecit(x) {
  const retourFen = game.fen(); const e = entree(); const bon = e?.plan?.find((p) => p.kind === 'principal') ?? e?.plan?.[0] ?? null;
  const fautif = game.turn();
  try { game.move(x.san); } catch { return; }
  recit = { coups: x.sequence.pas.map((p) => p.san), auteurPhrases: x.sequence.pas.map((p) => p.phrase ?? ''), annots: x.sequence.pas.map((p) => p.annotations ?? []), phrases: [], i: 0, retourFen, bon, eval: x.sequence.eval ?? null, fauteSan: x.san, pourquoi: x.pourquoi, fautif, origine: x.sequence.origine };
  render(); afficherRecit();
}
function afficherRecit() {
  if (!recit) return;
  const r = recit; const box = $('ouvRecit'); const fautif = r.fautif === 'w' ? 'les Blancs' : 'les Noirs';
  let html = `<p><span class="qui faute">Faute : ${fr(r.fauteSan)}</span> — ${esc(r.pourquoi)}</p>`;
  for (let k = 0; k < r.i; k++) html += `<p class="pas">${k + 1}. ${esc(r.phrases[k])}</p>`;
  if (r.i < r.coups.length) html += `<p class="hors">« Suivant » joue la réponse (${r.coups.length - r.i} demi-coup${r.coups.length - r.i > 1 ? 's' : ''} restants).</p>`;
  else {
    if (r.eval && typeof r.eval.perte === 'number') {
      const perte = Math.abs(r.eval.perte) / 100;
      html += `<p class="bilan">Bilan : au bout de ${Math.ceil(r.coups.length / 2)} coups, ${fautif} ont perdu l'équivalent de ${perte >= 0.95 ? perte.toFixed(1).replace('.', ',') + ' pion' + (perte >= 1.95 ? 's' : '') : 'une demi-position (' + perte.toFixed(2).replace('.', ',') + ' pion)'}${r.eval.mat ? ', et c\'est mat' : ''}. Voilà pourquoi on ne joue pas ${fr(r.fauteSan)}.</p>`;
    } else html += `<p class="bilan">Fin de la démonstration${r.origine && r.origine !== 'moteur' ? ' du professeur' : ''}. Voilà pourquoi on ne joue pas ${fr(r.fauteSan)}.</p>`;
    if (r.bon) html += `<p><button class="btn btn--primary" id="btnRembobiner">⏪ Revenir et jouer ${fr(r.bon.san)}</button> <span class="hors">${esc(r.bon.pourquoi)}</span></p>`;
    else html += `<p><button class="btn" id="btnRembobiner">⏪ Revenir</button></p>`;
  }
  box.innerHTML = html;
  $('btnRembobiner')?.addEventListener('click', rembobiner);
  $('ouvEtat').textContent = 'récit d\'une faute';
}
function rembobiner() {
  if (!recit) return; const r = recit; const fen = r.retourFen; const hist = game.history(); recit = null;
  const c = new Chess(); let k = 0; for (const s of hist) { if (c.fen() === fen) break; c.move(s); k++; }
  game = new Chess(); for (const s of hist.slice(0, k)) game.move(s); render().then(() => { if (r.bon) jouer(r.bon.san); });
}
function pasRecit() {
  if (!recit) return false;
  if (recit.i >= recit.coups.length) { rembobiner(); return true; }
  const c = new Chess(game.fen()); const san = recit.coups[recit.i];
  const phraseAuteur = recit.auteurPhrases[recit.i]; recit.phrases.push(phraseAuteur || phraseCoup(c, san));
  try { game.move(san); } catch { recit.i = recit.coups.length; afficherRecit(); return true; }
  const annots = recit.annots[recit.i]; recit.i++;
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets: [] });
  dessinerAnnotations($('ouvBoard'), { cases: annots.filter((a) => a.type === 'case'), fleches: annots.filter((a) => a.type === 'fleche').map((a) => ({ de: a.de, a: a.a, couleur: a.couleur, epais: true })) }, orientation);
  renderLigne(); afficherRecit();
  return true;
}

/** Aperçu muet : le coup, puis la séquence de l'auteur si elle existe, sinon la ligne principale du livre (5 demi-coups), un demi-coup toutes les 700 ms. */
async function demarrerApercu(x) {
  arreterApercu();
  const depart = game.fen(); const coups = [x.san]; const annots = [x.annotations ?? []];
  const t = new Chess(); for (const s of game.history()) t.move(s); // ligne complète : l'API retrouve la position par ses coups
  try { t.move(x.san); } catch { return; }
  const mon = {}; apercu = { timer: null, badge: null, jeton: mon };
  if (x.sequence) { for (const p of x.sequence.pas) { try { t.move(p.san); } catch { break; } coups.push(p.san); annots.push(p.annotations ?? []); } }
  else {
    for (let i = 0; i < 5; i++) {
      const e = await entreePour(t, profId, { bascule: false }); if (apercu?.jeton !== mon) return; // la souris est partie
      const nxt = e?.plan?.find((p) => p.kind === 'principal') ?? null; if (!nxt) break;
      try { t.move(nxt.san); } catch { break; } coups.push(nxt.san); annots.push([]);
    }
  }
  if (apercu?.jeton !== mon) return;
  const badge = document.createElement('div'); badge.className = 'ouv__apercu'; badge.textContent = `aperçu : ${coups.map(fr).join(' ')}`; $('ouvBoard').parentElement.append(badge); apercu.badge = badge;
  const c = new Chess(depart); let step = 0;
  const tick = () => {
    if (apercu?.jeton !== mon || step >= coups.length) return;
    const m = c.move(coups[step]); const an = annots[step] ?? []; step++;
    renderPlayBoard($('ouvBoard'), { fen: c.fen(), orientation, lastMove: { from: m.from, to: m.to }, targets: [] });
    dessinerAnnotations($('ouvBoard'), { cases: an.filter((a) => a.type === 'case'), fleches: an.filter((a) => a.type === 'fleche').map((a) => ({ de: a.de, a: a.a, couleur: a.couleur, epais: true })) }, orientation);
    apercu.timer = setTimeout(tick, 700);
  };
  apercu.timer = setTimeout(tick, 150);
}
function arreterApercu() {
  if (!apercu) return; clearTimeout(apercu.timer); apercu.badge?.remove(); apercu = null;
  renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets: [] });
  if (!recit) dessiner();
}

function jouer(san) { recit = null; try { game.move(san); } catch { return; } jouerSonCoup(); render(); }

// Déplacement des pièces : clic sur une pièce puis sur une case cible, ou glisser-déposer (comme la page de jeu).
let selected = null; let targets = [];
function refreshBoard() { renderPlayBoard($('ouvBoard'), { fen: game.fen(), orientation, lastMove: dernier(), targets, dragFrom: selected }); if (!recit) dessiner(); }
function tenter(from, to) {
  selected = null; targets = [];
  try { game.move({ from, to, promotion: 'q' }); } catch { refreshBoard(); return; }
  jouerSonCoup();
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
{ const sel = $('ouvSelect'); if (sel) { sel.innerHTML = livresDispo().map((L) => `<option value="${esc(L.id)}">${esc(L.nom)}</option>`).join(''); sel.value = courant;
  sel.addEventListener('change', () => { courant = sel.value; peuplerProfesseurs(); recit = null; game = new Chess(); for (const m of (livresDispo().find((l) => l.id === courant)?.signature ?? '').split(' ').filter(Boolean)) game.move(m); render(); }); } }
$('btnRetour').addEventListener('click', () => { recit = null; game.undo(); render(); });
$('btnSuivant').addEventListener('click', () => {
  try { if (pasRecit()) return; const e = entree(); const s = (e?.plan?.find((p) => p.kind === 'principal') ?? e?.plan?.[0])?.san; if (s) jouer(s); else $('ouvEtat').textContent = 'le livre s\'arrête ici'; }
  catch (err) { console.error('[ouverture] Suivant', err); $('ouvEtat').textContent = 'erreur : ' + err.message; }
});
$('btnTourner').addEventListener('click', () => { orientation = orientation === 'white' ? 'black' : 'white'; render(); });
render();


// ---------------------------------------------------------------- Entraînement contre Stockfish (PC), le livre à côté
const ent = { game: new Chess(), couleur: 'w', sel: null, targets: [], pensant: false, entree: null, livre: null };
const $ent = $('entBoard');
function entRender() {
  if (!$ent) return;
  const last = ent.game.history({ verbose: true }).at(-1);
  renderPlayBoard($ent, { fen: ent.game.fen(), orientation: ent.couleur === 'w' ? 'white' : 'black', lastMove: last ? { from: last.from, to: last.to } : null, targets: ent.targets, dragFrom: ent.sel });
}
/** Entrées connues de la position d'entraînement dans chaque livre (sans basculer le livre d'étude). */
async function entEntrees() {
  const out = [];
  for (const L of livresDispo()) {
    const rep = await reponsePosition(L.id, ent.game); if (!rep) continue;
    if (rep.statique) out.push({ livre: L.id, e: entreeStatique(rep.statique, BOOKS[L.id]?.PUNITIONS ?? {}) });
    else { const { expl } = choisirExplication(rep.explications, profId, rep.reference_author_id); out.push({ livre: L.id, e: fusionner(rep, expl) }); }
  }
  return out;
}
async function entMettreAJour() {
  const liste = await entEntrees(); const pref = liste.find((x) => x.livre === (ent.livre ?? courant)) ?? liste[0] ?? null;
  const racine = ent.game.history().length === 0;
  ent.entree = pref?.e && (pref.e.plan.length || !racine) ? pref.e : (racine ? RACINE : null); ent.livre = pref?.livre ?? ent.livre; return liste;
}
function entPanneau(note = '') {
  const box = $('entPanneau'); if (!box) return;
  const h = ent.game.history(); const e = ent.entree; const last = ent.game.history({ verbose: true }).at(-1);
  let html = '';
  if (note) html += `<p>${esc(note)}</p>`;
  if (last) {
    const qui = last.color === ent.couleur ? 'Toi' : (e ? 'L\'adversaire (suit le livre)' : 'Stockfish');
    if (e) html += `<p><span class="ok">Encore dans le livre${ent.livre ? ' (' + esc(nomLivre(ent.livre)) + ')' : ''}.</span> ${qui} : <b>${fr(last.san)}</b>${e.sens ? ' — ' + sensPhrase(esc(e.sens)) : ''}</p>`;
    else html += `<p><span class="ko">Hors du livre</span> depuis ${qui === 'Toi' ? 'ton coup' : 'la réponse de Stockfish'} <b>${fr(last.san)}</b>. Le livre n'a rien écrit ici ; « Voir dans le livre » t'amène à la dernière position connue.</p>`;
  }
  const jouables = (e?.plan ?? []).filter((p) => p.kind !== 'porte');
  if (jouables.length && ent.game.turn() === ent.couleur) html += `<p>Le livre te propose : ${jouables.map((p) => `<b>${fr(p.san)}</b>${p.kind === 'principal' ? ' (principal)' : ''}`).join(', ')}.</p>`;
  if (ent.game.isGameOver()) html += `<p><b>Partie terminée.</b></p>`;
  html += `<div class="ent__ligne">${h.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + fr(m)).join(' ') || 'Position de départ'}</div>`;
  box.innerHTML = html; $('entEtat').textContent = ent.pensant ? 'Stockfish réfléchit…' : (e ? 'dans le livre' : (h.length ? 'hors du livre' : ''));
}
async function entMoteur() {
  if (ent.game.isGameOver() || ent.game.turn() === ent.couleur) return;
  // Tant que la position est dans un livre, l'adversaire suit le livre (principal 7 fois sur 10, sinon une variante,
  // jamais une porte vers un livre absent) ; si plusieurs livres connaissent la position (après 1. e4), il tire au sort.
  const liste = await entEntrees(); const choixLivre = liste.length ? liste[Math.floor(Math.random() * liste.length)] : null;
  const racine = ent.game.history().length === 0;
  const e = choixLivre?.e && (choixLivre.e.plan.length || !racine) ? choixLivre.e : (racine ? RACINE : null);
  const jouables = (e?.plan ?? []).filter((p) => p.kind !== 'porte');
  if (jouables.length) {
    const principal = jouables.find((p) => p.kind === 'principal') ?? jouables[0]; const autres = jouables.filter((p) => p !== principal);
    const choix = autres.length && Math.random() > 0.7 ? autres[Math.floor(Math.random() * autres.length)] : principal;
    await new Promise((r) => setTimeout(r, 350));
    try { ent.game.move(choix.san); if (choixLivre) ent.livre = choixLivre.livre; } catch { /* coup illisible : on passe au moteur */ }
    if (ent.game.turn() === ent.couleur) { await entMettreAJour(); entRender(); entPanneau(); return; }
  }
  ent.pensant = true; entPanneau();
  try {
    const depth = Number($('entNiveau').value); const r = await getEngineMove(ent.game.fen(), { depth });
    if (r.bestmove && r.bestmove.length >= 4) ent.game.move({ from: r.bestmove.slice(0, 2), to: r.bestmove.slice(2, 4), promotion: r.bestmove[4] || 'q' });
  } catch (err) { console.error('[entraînement] moteur', err); }
  ent.pensant = false; await entMettreAJour(); entRender(); entPanneau();
}
async function entJouer(from, to) {
  ent.sel = null; ent.targets = [];
  try { ent.game.move({ from, to, promotion: 'q' }); } catch { entRender(); return; }
  entRender(); await entMettreAJour(); entPanneau(); entMoteur();
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
  const nouvelle = async () => { ent.game = new Chess(); ent.couleur = $('entCouleur').value; ent.livre = null; orientation = ent.couleur === 'w' ? 'white' : 'black'; render(); ent.sel = null; ent.targets = []; await entMettreAJour(); entRender(); entPanneau(ent.couleur === 'b' ? 'Nouvelle partie : l\'adversaire a les Blancs et commence.' : 'Nouvelle partie : à toi.'); entMoteur(); };
  $('entNouvelle').addEventListener('click', nouvelle);
  $('entCouleur').addEventListener('change', nouvelle);
  $('entLivre').addEventListener('click', async () => {
    // amener l'échiquier du livre sur la dernière position de la partie connue d'un livre
    const h = ent.game.history(); const c = new Chess(); let n = 0;
    for (let i = 0; i < h.length; i++) { c.move(h[i]); for (const L of livresDispo()) { if (await reponsePosition(L.id, c)) { n = i + 1; break; } } }
    if (ent.livre) courant = ent.livre; const sel = $('ouvSelect'); if (sel) sel.value = courant; peuplerProfesseurs();
    recit = null; game = new Chess(); for (const s of h.slice(0, n)) game.move(s); render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  entMettreAJour().then(() => { entRender(); entPanneau(); entMoteur(); });
}
