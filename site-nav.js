/** Panneau latéral commun (8 octobre 2026) : toutes les entrées du site, à gauche sur grand écran, en barre sur petit. */
const ENTREES = [
  { href: './index.html', titre: 'Lecteur d\'ouvertures', court: 'Lecteur', sous: 'parties PGN, arbre des coups' },
  { href: './play.html', titre: 'Jouer contre Stockfish', court: 'Jouer', sous: 'avec le jugement des coups' },
  { href: './ouverture.html', titre: 'Assistant d\'ouverture', court: 'Ouverture', sous: 'la Française, coup par coup', tag: 'maquette' },
];
const ici = location.pathname.split('/').pop() || 'index.html';
const nav = document.createElement('nav'); nav.className = 'site-nav'; nav.setAttribute('aria-label', 'Pages du site');
nav.innerHTML = `<div class="site-nav__marque">Échecs<br><small>plateforme d'apprentissage</small></div>` +
  ENTREES.map((e) => `<a class="site-nav__lien${e.href.endsWith(ici) ? ' site-nav__lien--actif' : ''}" href="${e.href}"><span class="site-nav__titre"><span class="site-nav__long">${e.titre}</span><span class="site-nav__court">${e.court}</span>${e.tag ? ` <em>${e.tag}</em>` : ''}</span><span class="site-nav__sous">${e.sous}</span></a>`).join('') +
  `<div class="site-nav__pied">Projet ouvert, par passion, pour les clubs.</div>`;
document.body.prepend(nav); document.body.classList.add('has-site-nav');
