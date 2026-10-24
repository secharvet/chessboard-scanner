/** Page de connexion et d'acceptation d'invitation (16 octobre 2026). */
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search); const suite = params.get('suite') || './ouverture.html';
// Si des identifiants ont atterri dans l'adresse (envoi natif du formulaire), on les retire immédiatement de l'historique.
if (params.has('mot_de_passe') || params.has('email')) { params.delete('mot_de_passe'); params.delete('email'); history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '')); }
const erreur = (msg) => { const e = $('erreur'); e.textContent = msg; e.hidden = !msg; if (msg) e.scrollIntoView({ block: 'center' }); };
async function api(path, body) {
  const res = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
  const j = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` })); if (!j.ok) throw new Error(j.error || `HTTP ${res.status}`); return j;
}
const memo = { get: () => { try { return localStorage.getItem('invitationEnAttente'); } catch { return null; } }, set: (t) => { try { if (t) localStorage.setItem('invitationEnAttente', t); else localStorage.removeItem('invitationEnAttente'); } catch {} } };
const invitation = params.get('invitation');
if (invitation) {
  $('fConnexion').hidden = true; $('titre').textContent = 'Créer mon compte'; $('sous').textContent = '';
  api(`/api/auth/invitation/${encodeURIComponent(invitation)}`).then((j) => {
    $('invEmail').textContent = j.email; $('invRole').textContent = j.role; roleInvite = j.role; $('fInvitation').hidden = false; memo.set(invitation);
    if (j.role === 'apprenant') $('licenceBloc').hidden = true;
  }).catch((e) => erreur(e.message));
  let roleInvite = 'enseignant';
  $('fInvitation').addEventListener('submit', async (ev) => {
    ev.preventDefault(); erreur(''); const f = new FormData(ev.target);
    // validation en clair ici plutôt que par les bulles du navigateur, invisibles sur téléphone
    const nom = String(f.get('display_name') || '').trim(); const mdp = String(f.get('mot_de_passe') || '');
    if (!nom) return erreur('Indique le nom qui sera affiché à côté de tes textes.');
    if (mdp.length < 10) return erreur(`Le mot de passe doit faire au moins 10 caractères (il en a ${mdp.length}).`);
    if (roleInvite !== 'apprenant' && !f.get('licence')) return erreur('Coche la case de la licence CC BY-SA pour pouvoir publier.');
    const bouton = ev.target.querySelector('button[type=submit]'); bouton.disabled = true; bouton.textContent = 'Création…';
    try { await api(`/api/auth/invitation/${encodeURIComponent(invitation)}`, { mot_de_passe: mdp, display_name: nom, licence: !!f.get('licence') }); bouton.textContent = 'Compte créé, redirection…'; memo.set(null); location.href = suite; }
    catch (e) { erreur(e.message); bouton.disabled = false; bouton.textContent = 'Créer mon compte'; }
  });
} else {
  // une invitation ouverte mais pas encore utilisée : on la propose en premier, avant le formulaire de connexion
  const enAttente = memo.get();
  if (enAttente) {
    api(`/api/auth/invitation/${encodeURIComponent(enAttente)}`).then((j) => {
      const p = document.createElement('p'); p.className = 'cpt__attente';
      p.innerHTML = `Tu as une invitation en attente pour <b>${j.email}</b>, ton compte n'est pas encore créé. <a class="btn btn--primary" href="./connexion.html?invitation=${encodeURIComponent(enAttente)}${params.get('suite') ? '&suite=' + encodeURIComponent(params.get('suite')) : ''}">Créer mon compte avec mon invitation</a>`;
      $('fConnexion').before(p);
    }).catch(() => memo.set(null));
  }
  api('/api/auth/moi').then((j) => { if (j.utilisateur) {
    $('titre').textContent = 'Mon compte'; $('fConnexion').hidden = true; $('fMotDePasse').hidden = false;
    $('sous').innerHTML = `Connecté en tant que <b>${j.utilisateur.display_name}</b> (${j.utilisateur.role}). <a href="#" id="dec">Se déconnecter</a>`;
    $('dec').addEventListener('click', async (ev) => { ev.preventDefault(); await api('/api/auth/deconnexion', {}); location.reload(); }); } }).catch(() => {});
  $('fMotDePasse').addEventListener('submit', async (ev) => {
    ev.preventDefault(); erreur(''); const f = new FormData(ev.target);
    if (String(f.get('nouveau') || '').length < 10) return erreur('Le nouveau mot de passe doit faire au moins 10 caractères.');
    try { await api('/api/auth/mot-de-passe', { actuel: f.get('actuel'), nouveau: f.get('nouveau') }); ev.target.reset(); const ok = $('erreur'); ok.textContent = 'Mot de passe changé.'; ok.hidden = false; ok.classList.add('cpt__ok'); }
    catch (e) { erreur(e.message); }
  });
  $('fConnexion').addEventListener('submit', async (ev) => {
    ev.preventDefault(); erreur(''); const f = new FormData(ev.target);
    if (!String(f.get('email') || '').includes('@')) return erreur('Indique ton courriel.'); if (!f.get('mot_de_passe')) return erreur('Indique ton mot de passe.');
    try { await api('/api/auth/connexion', { email: f.get('email'), mot_de_passe: f.get('mot_de_passe') }); location.href = suite; }
    catch (e) { erreur(e.message === 'courriel ou mot de passe incorrect' ? 'Courriel ou mot de passe incorrect. Si tu n\'as pas encore de compte, ouvre d\'abord ton lien d\'invitation.' : e.message); }
  });
}
