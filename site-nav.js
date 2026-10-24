/** Panneau latéral commun (8 octobre 2026, comptes le 17) : les entrées réservées n'apparaissent qu'avec le rôle voulu. */
const ENTREES = [
  { href: './accueil.html', titre: 'Accueil', court: 'Accueil', sous: 'présentation du site' },
  { href: './index.html', titre: 'Lecteur d\'ouvertures', court: 'Lecteur', sous: 'parties PGN, arbre des coups' },
  { href: './play.html', titre: 'Jouer contre Stockfish', court: 'Jouer', sous: 'avec le jugement des coups' },
  { href: './ouverture.html', titre: 'Assistant d\'ouverture', court: 'Ouverture', sous: 'Française et Italienne, coup par coup' },
  { href: './editeur.html', titre: 'Éditeur', court: 'Éditer', sous: 'pour les enseignants', roles: ['enseignant', 'validateur', 'admin'] },
  { href: './guide-enseignant.html', titre: 'Guide de l\'enseignant', court: 'Guide', sous: 'écrire, montrer, publier', roles: ['enseignant', 'validateur', 'admin'] },
  { href: './admin.html', titre: 'Administration', court: 'Admin', sous: 'comptes et invitations', roles: ['validateur', 'admin'] },
];
const ici = location.pathname.split('/').pop() || 'index.html';
const nav = document.createElement('nav'); nav.className = 'site-nav'; nav.setAttribute('aria-label', 'Pages du site');
const lien = (e) => `<a class="site-nav__lien${e.href.endsWith(ici) ? ' site-nav__lien--actif' : ''}" href="${e.href}"><span class="site-nav__titre"><span class="site-nav__long">${e.titre}</span><span class="site-nav__court">${e.court}</span>${e.tag ? ` <em>${e.tag}</em>` : ''}</span><span class="site-nav__sous">${e.sous}</span></a>`;
function rendre(utilisateur) {
  const role = utilisateur?.role ?? null;
  const visibles = ENTREES.filter((e) => !e.roles || (role && e.roles.includes(role)));
  const compte = utilisateur
    ? `<a class="site-nav__lien site-nav__compte" href="./connexion.html"><span class="site-nav__titre"><span class="site-nav__long">${utilisateur.display_name}</span><span class="site-nav__court">Moi</span></span><span class="site-nav__sous">${utilisateur.role}${utilisateur.club ? ' · ' + utilisateur.club : ''}</span></a>`
    : `<a class="site-nav__lien site-nav__compte${ici === 'connexion.html' ? ' site-nav__lien--actif' : ''}" href="./connexion.html"><span class="site-nav__titre"><span class="site-nav__long">Connexion</span><span class="site-nav__court">Compte</span></span><span class="site-nav__sous">enseignants invités</span></a>`;
  nav.innerHTML = `<a class="site-nav__marque" href="./accueil.html" style="text-decoration:none;color:inherit">Échecs<br><small>plateforme d'apprentissage</small></a>` + visibles.map(lien).join('') + compte + `<div class="site-nav__pied">Projet ouvert, par passion, pour les clubs.</div>`;
}
rendre(null); document.body.prepend(nav); document.body.classList.add('has-site-nav');
fetch('/api/auth/moi', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((j) => { if (j?.utilisateur) rendre(j.utilisateur); }).catch(() => {});
