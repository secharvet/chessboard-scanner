/* Coquille de navigation commune (8 oct. 2026 ; comptes le 17 ; deux dispositions le 17/10 soir).
   - Deux dispositions au choix de l'apprenant, réglées dans Paramètres et mémorisées :
     « côté » = barre latérale à gauche (grand écran) ; « haut » = barre horizontale en haut.
     Sur téléphone, les deux retombent sur une rangée d'onglets en haut.
   - Bloc compte toujours visible (nom, Mon compte, Se déconnecter) ; les entrées réservées
     n'apparaissent qu'avec le rôle voulu. */
const ENTREES = [
  { href: './accueil.html', titre: 'Accueil', court: 'Accueil', sous: 'présentation du site' },
  { href: './index.html', titre: 'Lecteur d\'ouvertures', court: 'Lecteur', sous: 'parties PGN, arbre des coups' },
  { href: './play.html', titre: 'Jouer contre Stockfish', court: 'Jouer', sous: 'avec le jugement des coups' },
  { href: './ouverture.html', titre: 'Assistant d\'ouverture', court: 'Ouverture', sous: 'Française et Italienne, coup par coup' },
  { href: './editeur.html', titre: 'Éditeur', court: 'Éditer', sous: 'pour les enseignants', roles: ['enseignant', 'validateur', 'admin'] },
  { href: './guide-enseignant.html', titre: 'Guide de l\'enseignant', court: 'Guide', sous: 'écrire, montrer, publier', roles: ['enseignant', 'validateur', 'admin'] },
  { href: './admin.html', titre: 'Administration', court: 'Admin', sous: 'comptes et invitations', roles: ['validateur', 'admin'] },
  { href: './parametres.html', titre: 'Paramètres', court: 'Réglages', sous: 'affichage et thème' },
];

/* Disposition choisie, lue au plus tôt pour éviter un saut d'affichage. */
function dispositionChoisie() {
  try { const v = localStorage.getItem('site-shell'); if (v === 'top' || v === 'side') return v; } catch (e) {}
  return 'side';
}
document.body.dataset.shell = dispositionChoisie();

const ici = location.pathname.split('/').pop() || 'index.html';
const nav = document.createElement('nav');
nav.className = 'site-nav';
nav.setAttribute('aria-label', 'Pages du site');

const lien = (e) => `<a class="site-nav__lien${e.href.endsWith(ici) ? ' site-nav__lien--actif' : ''}" href="${e.href}"${e.href.endsWith(ici) ? ' aria-current="page"' : ''}><span class="site-nav__titre"><span class="site-nav__long">${e.titre}</span><span class="site-nav__court">${e.court}</span>${e.tag ? ` <em>${e.tag}</em>` : ''}</span><span class="site-nav__sous">${e.sous}</span></a>`;

function rendre(utilisateur) {
  const role = utilisateur?.role ?? null;
  const visibles = ENTREES.filter((e) => !e.roles || (role && e.roles.includes(role)));
  const marque = `<a class="site-nav__marque" href="./accueil.html"><span class="site-nav__logo" aria-hidden="true">♞</span><span class="site-nav__marque-txt"><b>Échecs</b><small>plateforme d'apprentissage</small></span></a>`;
  const liens = `<div class="site-nav__liens">${visibles.map(lien).join('')}</div>`;
  let compte;
  if (utilisateur) {
    const initiale = (utilisateur.display_name || '?').trim().charAt(0).toUpperCase();
    compte = `<div class="site-nav__compte">
        <div class="site-nav__moi"><span class="site-nav__avatar" aria-hidden="true">${initiale}</span><span class="site-nav__moi-txt"><b>${utilisateur.display_name}</b><span>${utilisateur.role}${utilisateur.club ? ' · ' + utilisateur.club : ''}</span></span></div>
        <a class="site-nav__act" href="./parametres.html"><span class="site-nav__act-ic" aria-hidden="true">◇</span> Mon compte</a>
        <button type="button" class="site-nav__act" data-deconnexion><span class="site-nav__act-ic" aria-hidden="true">⇥</span> Se déconnecter</button>
      </div>`;
  } else {
    compte = `<div class="site-nav__compte">
        <a class="site-nav__act site-nav__act--connexion${ici === 'connexion.html' ? ' site-nav__lien--actif' : ''}" href="./connexion.html"><span class="site-nav__act-ic" aria-hidden="true">⇥</span> Connexion</a>
      </div>`;
  }
  nav.innerHTML = marque + liens + compte;
  const btn = nav.querySelector('[data-deconnexion]');
  if (btn) btn.addEventListener('click', deconnexion);
}

async function deconnexion() {
  try { await fetch('/api/auth/deconnexion', { method: 'POST', credentials: 'same-origin' }); } catch (e) {}
  location.href = './accueil.html';
}

rendre(null);
document.body.prepend(nav);
document.body.classList.add('has-site-nav');
fetch('/api/auth/moi', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((j) => { if (j?.utilisateur) rendre(j.utilisateur); }).catch(() => {});
