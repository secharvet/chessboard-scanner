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
const invitation = params.get('invitation');
if (invitation) {
  $('fConnexion').hidden = true; $('titre').textContent = 'Créer mon compte'; $('sous').textContent = '';
  api(`/api/auth/invitation/${encodeURIComponent(invitation)}`).then((j) => {
    $('invEmail').textContent = j.email; $('invRole').textContent = j.role; $('fInvitation').hidden = false;
    if (j.role === 'apprenant') $('licenceBloc').hidden = true;
  }).catch((e) => erreur(e.message));
  $('fInvitation').addEventListener('submit', async (ev) => {
    ev.preventDefault(); erreur(''); const f = new FormData(ev.target);
    try { await api(`/api/auth/invitation/${encodeURIComponent(invitation)}`, { mot_de_passe: f.get('mot_de_passe'), display_name: f.get('display_name'), licence: !!f.get('licence') }); location.href = suite; }
    catch (e) { erreur(e.message === 'courriel ou mot de passe incorrect' ? 'Courriel ou mot de passe incorrect. Si tu n\'as pas encore de compte, ouvre d\'abord ton lien d\'invitation.' : e.message); }
  });
} else {
  api('/api/auth/moi').then((j) => { if (j.utilisateur) { $('sous').innerHTML = `Connecté en tant que <b>${j.utilisateur.display_name}</b> (${j.utilisateur.role}). <a href="#" id="dec">Se déconnecter</a>`; $('dec').addEventListener('click', async (ev) => { ev.preventDefault(); await api('/api/auth/deconnexion', {}); location.reload(); }); } }).catch(() => {});
  $('fConnexion').addEventListener('submit', async (ev) => {
    ev.preventDefault(); erreur(''); const f = new FormData(ev.target);
    try { await api('/api/auth/connexion', { email: f.get('email'), mot_de_passe: f.get('mot_de_passe') }); location.href = suite; }
    catch (e) { erreur(e.message === 'courriel ou mot de passe incorrect' ? 'Courriel ou mot de passe incorrect. Si tu n\'as pas encore de compte, ouvre d\'abord ton lien d\'invitation.' : e.message); }
  });
}
