/* Coquille de navigation commune (8 oct. 2026 ; comptes le 17 ; dispositions, thème et matrice d'accès le 17/10 soir).
   - Deux dispositions au choix (Paramètres), mémorisées ; téléphone en onglets.
   - Thème clair / sombre / système ; bouton soleil/lune.
   - Le menu reflète la matrice de sécurité (/api/acces) : chaque rôle ne voit que ses pages.
   - L'administrateur peut « voir en tant qu'apprenant » (œil) : aperçu du menu dans un autre rôle. */
const ENTREES = [
  { id: 'accueil', href: './accueil.html', titre: 'Accueil', court: 'Accueil', sous: 'présentation du site' },
  { id: 'index', href: './index.html', titre: 'Lecteur d\'ouvertures', court: 'Lecteur', sous: 'parties PGN, arbre des coups' },
  { id: 'play', href: './play.html', titre: 'Jouer contre Stockfish', court: 'Jouer', sous: 'avec le jugement des coups' },
  { id: 'ouverture', href: './ouverture.html', titre: 'Assistant d\'ouverture', court: 'Ouverture', sous: 'Française et Italienne, coup par coup' },
  { id: 'editeur', href: './editeur.html', titre: 'Éditeur', court: 'Éditer', sous: 'pour les enseignants', roles: ['enseignant', 'validateur', 'admin'] },
  { id: 'guide', href: './guide-enseignant.html', titre: 'Guide de l\'enseignant', court: 'Guide', sous: 'écrire, montrer, publier', roles: ['enseignant', 'validateur', 'admin'] },
  { id: 'admin', href: './admin.html', titre: 'Administration', court: 'Admin', sous: 'comptes, sécurité', roles: ['validateur', 'admin'] },
  { id: 'parametres', href: './parametres.html', titre: 'Paramètres', court: 'Réglages', sous: 'affichage et thème' },
];

const root = document.documentElement;
let utilisateurReel = null; // le vrai compte connecté
let matriceAcces = null;    // /api/acces : { pageId: { role: bool } }

/* Thème : appliqué au plus tôt pour éviter un saut de couleur. */
function themeSauve() { try { const v = localStorage.getItem('theme'); if (v === 'light' || v === 'dark' || v === 'system') return v; } catch (e) {} return 'system'; }
function appliquerTheme(t) {
  let effectif = t;
  if (t === 'system') { root.removeAttribute('data-theme'); effectif = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  else root.setAttribute('data-theme', t);
  root.setAttribute('data-bs-theme', effectif);
  const ic = nav.querySelector('[data-theme-toggle] span');
  if (ic) ic.textContent = effectif === 'dark' ? '☀' : '☾';
}

/* Disposition choisie, lue au plus tôt. */
function dispositionChoisie() { try { const v = localStorage.getItem('site-shell'); if (v === 'top' || v === 'side') return v; } catch (e) {} return 'side'; }
document.body.dataset.shell = dispositionChoisie();

/* Vue d'aperçu : un admin peut regarder le site dans un autre rôle (apprenant par défaut). */
function vueRole() { try { return sessionStorage.getItem('vue-role'); } catch (e) { return null; } }
function estAdminReel() { return utilisateurReel?.role === 'admin'; }
function roleEffectif() { const o = vueRole(); if (o && estAdminReel()) return o; return utilisateurReel?.role || 'apprenant'; }
function autorise(e, role) {
  if (matriceAcces && matriceAcces[e.id]) return !!matriceAcces[e.id][role];
  return !e.roles || (role && role !== 'apprenant' && e.roles.includes(role)) || (!e.roles); // repli : règles codées
}

const ici = location.pathname.split('/').pop() || 'index.html';
const nav = document.createElement('nav');
nav.className = 'site-nav';
nav.setAttribute('aria-label', 'Pages du site');

const lien = (e) => `<a class="site-nav__lien${e.href.endsWith(ici) ? ' site-nav__lien--actif' : ''}" href="${e.href}"${e.href.endsWith(ici) ? ' aria-current="page"' : ''}><span class="site-nav__titre"><span class="site-nav__long">${e.titre}</span><span class="site-nav__court">${e.court}</span>${e.tag ? ` <em>${e.tag}</em>` : ''}</span><span class="site-nav__sous">${e.sous}</span></a>`;

function rendre() {
  const role = roleEffectif();
  const apercu = !!vueRole() && estAdminReel();
  const visibles = ENTREES.filter((e) => autorise(e, role));
  const marque = `<a class="site-nav__marque" href="./accueil.html"><span class="site-nav__logo" aria-hidden="true">♞</span><span class="site-nav__marque-txt"><b>Échecs</b><small>plateforme d'apprentissage</small></span></a>`;
  const liens = `<div class="site-nav__liens">${visibles.map(lien).join('')}</div>`;
  const theme = `<button type="button" class="site-nav__theme" data-theme-toggle aria-label="Changer le thème clair ou sombre" title="Thème clair / sombre"><span aria-hidden="true">☾</span></button>`;
  let compte;
  if (utilisateurReel) {
    const initiale = (utilisateurReel.display_name || '?').trim().charAt(0).toUpperCase();
    const oeil = estAdminReel()
      ? `<button type="button" class="site-nav__act" data-vue><span class="site-nav__act-ic" aria-hidden="true">${apercu ? '✖' : '👁'}</span> ${apercu ? 'Revenir en admin' : 'Voir en apprenant'}</button>`
      : '';
    compte = `<div class="site-nav__compte">
        <div class="site-nav__moi"><span class="site-nav__avatar" aria-hidden="true">${initiale}</span><span class="site-nav__moi-txt"><b>${utilisateurReel.display_name}</b><span>${apercu ? 'vue ' + role : utilisateurReel.role}${utilisateurReel.club ? ' · ' + utilisateurReel.club : ''}</span></span></div>
        <a class="site-nav__act" href="./parametres.html"><span class="site-nav__act-ic" aria-hidden="true">◇</span> Mon compte</a>
        ${oeil}
        <button type="button" class="site-nav__act" data-deconnexion><span class="site-nav__act-ic" aria-hidden="true">⇥</span> Se déconnecter</button>
      </div>`;
  } else {
    compte = `<div class="site-nav__compte">
        <a class="site-nav__act site-nav__act--connexion${ici === 'connexion.html' ? ' site-nav__lien--actif' : ''}" href="./connexion.html"><span class="site-nav__act-ic" aria-hidden="true">⇥</span> Connexion</a>
      </div>`;
  }
  nav.innerHTML = marque + liens + theme + compte;
  const bt = nav.querySelector('[data-theme-toggle]');
  if (bt) bt.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const suivant = cur === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', suivant); } catch (e) {}
    appliquerTheme(suivant);
  });
  const bd = nav.querySelector('[data-deconnexion]');
  if (bd) bd.addEventListener('click', deconnexion);
  const bv = nav.querySelector('[data-vue]');
  if (bv) bv.addEventListener('click', () => {
    try { if (vueRole()) sessionStorage.removeItem('vue-role'); else sessionStorage.setItem('vue-role', 'apprenant'); } catch (e) {}
    rendre(); banniere();
  });
  appliquerTheme(themeSauve());
}

let banniereEl = null;
function banniere() {
  const actif = !!vueRole() && estAdminReel();
  if (banniereEl) { banniereEl.remove(); banniereEl = null; }
  document.body.classList.toggle('a-vue-apercu', actif);
  if (!actif) return;
  banniereEl = document.createElement('div');
  banniereEl.className = 'site-vue-apercu';
  banniereEl.innerHTML = `<span>👁 Vue apprenant — tu vois le site comme un apprenant.</span> <button type="button">Revenir en admin</button>`;
  banniereEl.querySelector('button').addEventListener('click', () => { try { sessionStorage.removeItem('vue-role'); } catch (e) {} rendre(); banniere(); });
  document.body.prepend(banniereEl);
}

async function deconnexion() {
  try { await fetch('/api/auth/deconnexion', { method: 'POST', credentials: 'same-origin' }); } catch (e) {}
  location.href = './accueil.html';
}

appliquerTheme(themeSauve());
rendre();
document.body.prepend(nav);
document.body.classList.add('has-site-nav');

Promise.all([
  fetch('/api/auth/moi', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).catch(() => null),
  fetch('/api/acces', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).catch(() => null),
]).then(([moi, acces]) => {
  if (moi?.utilisateur) utilisateurReel = moi.utilisateur;
  if (acces?.ok) matriceAcces = acces.matrice;
  rendre(); banniere();
});
