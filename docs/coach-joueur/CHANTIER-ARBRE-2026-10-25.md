# Chantier « le joueur humain » : l'arbre de décision, en deux temps

25 octobre 2026. Pour le Dev chef (worktree `~/chess-dev-joueur`, branche `joueur-dev`). La doctrine est dans
`ARBRE-DECISION-2026-10-25.md` (version finale, validée par le GE) : ce chantier dit **quoi construire, dans quel ordre,
et comment on le mesure**. Il ne part qu'avec le go de Sébastien.

**Unités** : comme `CHANTIERS-2026-10-24.md`, toutes les bornes en centièmes de pion affichés (interne × 100 / 213).

## Les trois règles qui ne bougent pas

1. **L'arbre produit des candidats, le calcul départage, jamais l'inverse.** Les règles chiffrées (compte sur une case,
   A − D de l'attaque du roi, distance d'un plan) **produisent** un coup et **servent à le dire** ; elles ne décident
   jamais. Que ce soit écrit ainsi dans le code (un générateur rend `{coup, raison, noeud}`, il ne rend pas de score), et
   qu'un test le garantisse : aucun chemin ne joue un coup sans passer par la comparaison (étape 4).
2. **Une seule liste, classée par le bilan net après sa meilleure réponse.** Les exceptions sont les seules de la page :
   en échec, les coups légaux ; mon mat avant tout ; parer son mat juste après.
3. **La barre** : ≥ 50 % contre Maia-1500, < 5 % de bévues (examinateur SF19 prof. 18, un fil). On accepte de perdre du
   niveau, pas la tactique de base.

## Temps 1 — le radar, la comparaison, le contrôle, la parole, le taux de trous

**Étape 1 (ses menaces)**, chaque question = une fonction nommée qui rend ses candidats avec leur raison :
1a échec → coups légaux ; 1b mat menacé en 1 ou 2 (recherche de mat courte pour lui) ; 1c pièce en prise, la plus grosse
d'abord (attaquée et non défendue, ou attaquée par moins gros) → fuir, défendre, s'interposer, contre-attaquer plus gros ;
1d dernière rangée (pas de case de fuite, un seul défenseur) → trou d'aération, pièce qui couvre ; 1e pièce clouée ou
alignée avec mon roi ou ma dame → déclouer, rompre ; 1f « s'il jouait deux fois » (le coup nul existant, `menace()`) → la
parade par **test** : tout coup légal après lequel sa ligne ne gagne plus (on rejoue sa ligne après chaque coup légal, on
compte ; c'est ce qui trouve 16.Fb5+ contre …Txg2+).

**Étape 2 (mes coups forcés)** : 2a mon mat en 1 à 3 (recherche de mat courte) ; 2b prise ou échec qui gagne, le plus gros
d'abord (compte des prises/reprises sur la case pour produire, le calcul décide : s'ils ne sont pas d'accord, la phrase
ne dit pas « je compte ») ; 2c avant de reprendre, un coup intermédiaire ; 2d ses pièces non défendues → double attaque,
attaque d'une pièce qu'il ne peut sauver ; 2e motifs nommés (clouage, enfilade, déviation, surcharge, pièce enfermée),
en reprenant `coach/motifs.mjs` si ça s'y prête.

**Étape 3, réduite pour le temps 1** : le livre tant qu'on y est ; **ma pire pièce** (au plus 2 cases utiles, fou gêné par
ses pions fixés, mineure encore chez elle après le coup 10) vers une meilleure case ; la **prophylaxie** par son meilleur
coup au coup nul quand ce n'est pas une menace de matériel (le coup qui le rend mauvais d'au moins 50 à ses yeux) ; les
plans du catalogue existants (structures reconnues) comme source de candidats. Pas encore les cibles (3c) ni l'attaque du
roi (3d) : c'est le taux de trous qui dira s'il les faut, et dans quel ordre.

**Étape 4 (comparer)** : la recherche actuelle (`Recherche.chercher`, même budget) **restreinte à la racine aux candidats**
(3 à 5 : le radar hors plafond, puis 3 au plus pour le reste, une famille d'abord chacune) ; en dessous, tous les coups.
Pour chaque candidat : score exact (fenêtre ouverte, comme aujourd'hui) et ligne principale. Élagage : un candidat dont la
ligne coûte du matériel compté est écarté **avec sa ligne** (c'est la réfutation qu'on dira). Égalité (< 10) : la raison la
plus haute dans l'arbre.

**Étape 5 (contrôle)** : sur la position après le coup choisi, on repose 1a–1f pour lui, plus « la pièce déplacée
défendait-elle quelque chose ? ». Si une menace nouvelle d'au moins 80 apparaît que la ligne calculée n'a pas vue, le
candidat suivant.

**Le trou de l'arbre, mesuré à chaque coup** : la recherche complète actuelle (tous les coups, 400 000 positions) tourne
en plus ; si son meilleur coup bat tous les candidats d'au moins **100**, on **joue ce coup** et on journalise un trou :
le coup repasse dans les questions, dans l'ordre de l'arbre, et tombe dans une classe : **coupé** (une question le
reconnaît mais ne l'avait pas produit), **pas reconnu avant** (la même question le voit après coup seulement), **sans
nom** (aucune). Phrase du trou : « Mon calcul trouve mieux que mes idées : M. Si je jouais X, … ».

**Étape 6 (dire)** : une seule question dite par coup, celle du nœud qui a produit le coup ; puis, si le meilleur écarté
est à 80 ou plus **et** que sa réfutation se lit (matériel compté, mat, roque perdu) : « J'ai pensé à Cc3. Mais il
répondait …Fb4, et je perdais le pion e4. Avec Cf3, rien de tel. » ; sinon « Les deux se valent. J'ai pris M, parce que
(raison). » Au conditionnel ; la ligne citée limitée à 4 demi-coups dans le calme, 8 dans le forcé ; jamais « score »,
« ligne », « candidat », « réfutation ». Les gabarits dans `gabarits-parole.json`, section « arbre ».

**Le harnais suit les phrases** (demande du GE) :
- le fichier de la partie porte, par coup du coach : `candidats: [{san, raison, noeud, score, ligne}]`, `choisi`,
  `ecarte: {san, ligne, perte}` quand une comparaison est dite, `trou: {san, classe, noeud}` le cas échéant ;
- **vérification de la phrase comparative** : le harnais rejoue la ligne du coup écarté depuis la position, compte le
  matériel au bout, et contrôle que ce que la phrase annonce (« je perdais le pion e4 », « il prenait ma tour », « c'était
  mat ») est ce que la ligne montre. Un désaccord = une alerte, comme aujourd'hui pour les menaces non parées ;
- `recit.mjs` et les pages montrent la raison, le coup écarté et sa ligne (les flèches du coup écarté d'une autre
  couleur sur le site) ; le mot du nœud remplace la « sorte » dans la pastille.

**Tests hors ligne** (positions fixes, pas de moteur) : chaque question de l'étape 1 et 2 sur deux positions (une où elle
produit, une où elle ne produit pas) ; la parade par test sur le cas 16.Fb5+ ; la règle « aucun coup sans comparaison » ;
le trou sur une position construite ; la vérification de la phrase comparative sur une ligne vraie et une fausse.

**Mesure de fin du temps 1** (à demander à Sébastien avant de la lancer, avec le nombre et l'heure de fin) :
1. **Le taux de trous sur les 605 positions de la série 4d5e252** (déjà jouées, aucune partie nouvelle) : l'arbre produit
   ses candidats, la recherche complète dit si elle les bat de 100 ; publié par étape où l'arbre se trouvait et par classe
   (deux tableaux). Un fil, environ une heure. **C'est le premier chiffre publié.** < 5 % : l'arbre suffit ; 20 % : trop
   pauvre ; la classe « sans nom » désigne la branche à construire au temps 2.
2. Puis **une** partie contre Maia-1500, sur le site, avec son récit.

## Temps 2 — les branches que le taux de trous désigne

Selon les trous « sans nom » : **3c les cibles** (les huit de la page, chacune avec son critère et ses verbes : attaquer,
fixer, échanger le défenseur, bloquer ; la cible choisie = le plus grand écart attaquants/défenseurs) ; **3d l'attaque du
roi** (A − D ≥ 2, ma dame, une ligne ouverte ou un pion de roque avancé ; refus si mon roi n'est pas à l'abri, si le
centre n'est pas fermé, si je suis en retard de développement) ; **3b les trois regards** « je suis mieux » et **3e la
conduite** (simplifier / compliquer / agir / jouer lentement / poser des problèmes) ; **« que veut-il faire ? »** à chaque
nœud par l'étape 3 jouée pour lui. Même méthode : une question = une fonction qui produit, des tests fixes, le taux de
trous recalculé après chaque branche.

## Ce qui ne change pas

L'échiquier, l'évaluation et ses termes, la recherche, le livre, les structures et plans, l'examinateur, l'arène, le
flux et les pages : tout reste. L'arbre s'ajoute **devant** la recherche ; on peut à tout moment comparer « arbre » et
« recherche complète » sur la même position, c'est même la mesure.
