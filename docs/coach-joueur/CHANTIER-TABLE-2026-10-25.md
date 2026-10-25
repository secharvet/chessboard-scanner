# Chantier 1 — La table : quel nœud de l'arbre un joueur de chaque niveau choisit

25 octobre 2026. Première des trois pages de la directive `DIRECTIVE-APPRENTISSAGE-2026-10-25.md`. Page de plan, à lire
par Sébastien **avant toute ligne de code**. Rien ne démarre sans son go ; le calendrier est indicatif, rien n'est pressé.

## 1. La question, et le critère écrit d'avance

Dans une position où plusieurs questions de l'arbre sont allumées (« ma pièce est en prise », « je peux développer »,
« je menace quelque chose »…), **laquelle un joueur de 1200 suit-il ? et un joueur de 1900 ?** Si la réponse change avec
le niveau, l'arbre a un vocabulaire pour parler d'un niveau à l'autre ; sinon, on l'écrit et on s'arrête là.

**Critère de réussite, fixé maintenant** : au moins **trois nœuds** dont la part, parmi les coups joués de la tranche,
varie de façon **monotone** sur les six tranches (1000-1199 … 2000-2199), et dont l'écart entre la première et la dernière
tranche dépasse la somme de leurs demi-intervalles de confiance à 95 %. On regarde deux parts pour chaque nœud, et c'est
la seconde qui compte pour le critère :
- **part brute** : coups nommés par ce nœud / tous les coups de la tranche (dépend aussi des positions : un 1100 a plus
  souvent une pièce en prise qu'un 2100) ;
- **part quand allumé** : coups nommés par ce nœud / positions où ce nœud proposait quelque chose. C'est elle qui dit le
  comportement : « quand il pouvait sauver sa pièce, l'a-t-il fait ? ».

**Hypothèses écrites avant de regarder** (à confirmer ou infirmer, et l'Expert en ajoutera) : la part « quand allumé »
de 1c (sauver la pièce en prise) et de 1f (parer sa menace) **monte** avec le niveau ; celle de 2b (prise qui gagne)
monte aussi (les prises gagnantes ratées sont le lot des faibles) ; 3Y (prophylaxie) et 2f (créer une menace) montent ;
2d (double attaque) monte ; la part des coups **sans nom** baisse avec le niveau (le fort joue des coups que l'arbre
nomme, le faible joue des coups sans raison) — ou l'inverse, si les forts jouent des coups calmes que l'arbre ne sait pas
encore nommer : c'est justement ce qu'on veut savoir.

## 1 bis. Ce qui existe, lu avant d'écrire (sources du GE, vérifiées le 25 oct.)

**BP-Chess** (Skidanov, Erbesfeld, Weiss, Elyasaf, [arXiv 2504.05425](https://arxiv.org/html/2504.05425v1), avril 2025).
Les principes des manuels codés comme « scénarios » explicites : 5 compteurs (coups de pion, cavalier, fou, tour, dame),
8 stratégies de base (centre, développement, espace, attaque de f7, structure de pions, dame sortie tôt, coups de pion
en ouverture, roque), 3 avancées (défendre, attaquer et clouer, échanger). Données : **5 000 parties** Lichess, rapides,
les deux joueurs entre **1200 et 1600**, **ouverture seulement** (jusqu'au second roque, ou 10 coups). Tâche : binaire,
« ce coup a-t-il été joué ? », classes rééquilibrées par SMOTE, modèles linéaires. Chiffre d'affiche 81–83 % contre 47–53 %
pour Maia, **à ne pas comparer** à la vraie tâche : sur « quel coup parmi les légaux », ils écrivent qu'ils n'ont pas
égalé Maia. Les stratégies avancées n'apportent presque rien (82,9 contre 81,3 %), ce qu'ils attribuent à l'ouverture,
dominée par développement, centre et roque. **Ce que ça change pour nous** : notre table se lit **par phase**, sinon
l'ouverture dira « développement » à tous les niveaux ; et le chiffre de précision du coup, à l'étape 2, sera en dessous de
Maia-3 — c'est écrit d'avance, la valeur est dans l'explication.

**Maia-3** (Anderson et coll., Toronto, [dépôt CSSLab/maia3](https://github.com/CSSLab/maia3), AGPL-3.0 ; article
Chessformer, ICLR 2026). Un seul modèle, le niveau en entrée (options UCI `Elo`, `SelfElo`, `OppoElo`), de 600 à 2600 ;
57,1 % de coups prédits sur leur jeu de test (52,0 % pour Maia-2, 51,6 % pour Maia-1). Trois tailles (5M pour CPU, 23M,
79M) sur Hugging Face, moteur UCI en Python, `MultiPV` pour les coups humains probables. **Ce que ça change** : l'élève
de test de l'étape 2 est installable sur le VPS en CPU (5M) ; son graphique « coups par classement » est exactement la
distribution que notre table veut **nommer**.

**Les concepts dans Maia** (Li, Russek, Kuperwajs, Griffiths, CogSci 2026,
[eScholarship 2bz5j950](https://escholarship.org/uc/item/2bz5j950)). Sondes linéaires des 24 termes d'évaluation de
Stockfish 8 sur les neuf Maia 1100–1900 : tous décodables ; **16 sur 24 montent avec le niveau** de façon significative,
dont menaces (milieu de partie), sécurité du roi (finale), matériel, pions, cavaliers, espace, déséquilibre, pions
passés ; fou, tour, dame, mobilité ne bougent pas. **L'effet est modeste : 0,3 à 0,7 point de R² par 100 points de
classement.** Les concepts simples se lisent tôt dans le réseau, les complexes (menaces) tard. **Ce que ça change** :
si l'arbre voit la même chose, les écarts entre tranches seront **petits** ; d'où le besoin de cent mille positions par
tranche (intervalle de confiance d'environ ± 0,3 point sur une part de 10 %), et un critère qui exige la monotonie, pas
seulement une différence entre deux tranches. Et nos nœuds « menace » (1f, 2f) sont ceux dont on attend le plus.

Ce qui n'existe pas, et que ce chantier fait : un arbre de joueur de club comme espace d'étiquettes, le choix du nœud
appris par niveau, chaque nœud vérifié mécaniquement sur la position, et un récit.

## 2. Les données

**Source.** Base mensuelle de Lichess (`database.lichess.org`). Nous avons déjà en local deux mois : janvier 2013
(121 000 parties) et janvier 2016 filtré (250 000 parties). Comptage des parties qui conviennent — classées, cadence
rapide ou lente (durée estimée ≥ 8 minutes, règle de Lichess), terminées normalement ou au temps, **les deux joueurs dans
la même tranche de 200 points** :

| tranche | 2016-01 | 2013-01 |
|---|---|---|
| 1000-1199 | 13 550 | 101 |
| 1200-1399 | 14 515 | 2 599 |
| 1400-1599 | 4 223 | 8 232 |
| 1600-1799 | 4 374 | 5 399 |
| 1800-1999 | 6 093 | 865 |
| 2000-2199 | 4 001 | 8 |

Une partie donne environ 70 positions (les coups des deux joueurs comptent, ils sont de la même tranche). **Cent mille
positions par tranche = environ 1 500 parties par tranche** : janvier 2016 suffit seul pour l'étape 1, et c'est mieux
ainsi — les classements Lichess glissent d'une année à l'autre, une table se fait sur **un seul mois**. Pour le million,
on téléchargera un mois récent (2025, environ 30 Go compressés, 100 millions de parties) ; pas avant que la table à cent
mille ait parlé.

**Tirage des positions.** Au plus 8 positions par partie, tirées au sort, réparties sur les phases (ouverture / milieu /
finale au tiers chacune, tant que la partie le permet) : prendre toutes les positions d'une partie reviendrait à compter
dix fois la même partie. Les positions dans le livre (coups de théorie connus) sont gardées mais **comptées à part** :
sinon le nœud « théorie » écrase l'ouverture.

**Découpage apprentissage / test, dès le départ.** Chaque joueur est affecté à l'apprentissage ou au test par un tirage
fixe sur son nom (80 / 20). Une partie est « apprentissage » si ses deux joueurs le sont, « test » si ses deux joueurs le
sont ; les parties mixtes sont écartées. La table de ce chantier se calcule **sur l'apprentissage seulement** ; les
positions de test ne sont **jamais lues** (interdit de la directive : pas de retouche de l'arbre après lecture du test).

**Ce qu'on garde par position** (un enregistrement JSON par ligne) : identifiant de partie, numéro du coup, tranche,
camp, FEN, coup joué, phase, les nœuds **allumés** (chaque nœud avec ses coups proposés), le nœud qui **nomme** le coup
joué (le plus haut dans l'arbre, et la liste de tous ceux qui le reconnaissent), et un drapeau « vérifié » pour les nœuds
qui mesurent quelque chose (1c : la pièce était bien en prise au coup nul, pas seulement attaquée).

## 3. Le prérequis : nommer en moins d'une seconde

**Aujourd'hui** : 4 secondes par coup (budget 120 000), mesuré ce matin sur les 605 coups de la série. Où va le temps :
« que menacé-je ? » (2f) sonde chacun des 30 à 35 coups légaux, soit 70 % du temps ; la petite recherche « ai-je un mat ? »
(2a) 25 % ; « que menace-t-il ? » (1f) 5 % ; toutes les autres questions sont statiques et ne coûtent rien.

**Cible : moins d'une seconde**, soit au plus 100 000 positions calculées par coup :
- 2f ne sonde que les coups qui **peuvent** être une menace : prises, échecs, coups après lesquels une pièce adverse ou
  la zone de son roi est attaquée de plus (en pratique 5 à 10 coups), avec une sonde de 2 000 positions chacun ;
- 2a : une recherche de mat **par les échecs seulement**, profondeur 3 (quelques milliers de positions) ;
- 1f : la sonde actuelle, bornée à 15 000 ;
- aucune recherche complète (le coup à nommer est donné : c'est celui de l'humain).

**Ce que l'approximation coûte, publié** : le nommage rapide et le nommage lent sur **mille coups** (les 605 de la série
plus 400 coups humains tirés au sort), même nœud dans x % des cas, et la liste des désaccords par nœud, relus par
l'Expert sur une cinquantaine. Seuil d'acceptation : **95 % d'accord** ; en dessous, on cherche d'où vient l'écart avant
d'aller plus loin.

**Temps de calcul de la table** : 100 000 positions × 6 tranches à moins d'une seconde = **environ 7 jours à un
processus, 2 jours sur les 4 cœurs du VPS**, ou une nuit et demie sur DENEB à 12 processus. D'où l'ordre : une table
« v0 » à **10 000 positions par tranche** (6 heures sur le VPS) pour voir si le critère a une chance, puis les cent mille.

## 4. Ce qu'on publie

Une page de résultats avec **trois chiffres** en tête : le temps par coup du nommage rapide, son accord avec le lent, et
le **nombre de nœuds qui vérifient le critère**. Puis :
- la table : par tranche et par nœud, part brute et part quand allumé, avec l'intervalle de confiance ; une ligne « sans
  nom » ; une ligne « livre » à part ;
- la même table par phase (ouverture / milieu / finale), parce que la finale est là où l'arbre nomme le moins (14,5 % de
  sans nom sur nos parties, contre 7 % ailleurs) ;
- les coups nommés par **plusieurs** nœuds : combien, et lesquels vont ensemble (c'est le cas de 379 coups sur 552 chez
  nous ; si c'est aussi fréquent chez les humains, le choix « le plus haut » est une convention qu'il faudra discuter à
  l'étape 2) ;
- vingt coups sans nom par tranche, en clair, pour voir quelle question manque à quel niveau.

Si la table ne montre pas trois nœuds monotones, la page le dit en première ligne, et le chantier 2 n'existe pas.

## 5. Ce qui est figé pendant le chantier

L'**arbre** à la version du jour (`dev-lead`, avec les nœuds 2f, 3A, 3d du premier lot et les parades 1c vérifiées) :
aucune branche ajoutée ni réglée pendant la mesure, et jamais après lecture du test. Si une branche s'impose (les sans nom
le diront), elle se mesure sur des parties **neuves** (un autre mois). Les seuils et le critère de cette page ne bougent
pas après le premier regard sur les données.

## 6. Qui fait quoi, et dans quel ordre

| semaine | travail | qui | sortie |
|---|---|---|---|
| 1 | nommage rapide (2f, 2a, 1f bornés), vérificateur 1c, mesure d'accord sur mille coups | Dev chef ; pilote pour la mesure | temps par coup, % d'accord, désaccords par nœud |
| 1 | extraction Lichess : filtres, tirage des positions, découpage par joueur, format par ligne | pilote | le lot « v0 » (10 000 positions × 6 tranches) et le lot complet, comptés |
| 2 | table v0 (6 h), lecture, puis table à cent mille (2 jours VPS) | pilote ; Expert sur les sans nom et les désaccords | la page de résultats, trois chiffres en tête |
| 2 | relecture par le GE | Sébastien | go ou arrêt pour le chantier 2 |

Rien ne démarre avant le go de Sébastien sur cette page ; chaque lancement de calcul long est annoncé avec sa durée et son
heure de fin. Le site n'est pas touché par ce chantier (le joueur du site reste tel quel ; « calcul puis nommage » n'est
plus la direction).

## 7. Deux points à trancher par Sébastien

1. **La période des parties** : janvier 2016 (déjà en local, suffisant pour cent mille par tranche) ou un mois récent à
   télécharger (30 Go, classements d'aujourd'hui, nécessaire de toute façon pour le million) ? Proposition : 2016 pour la
   v0 et la table à cent mille ; un mois récent ensuite, qui servira aussi de parties neuves pour les branches ajoutées.
2. **La lecture humaine** (« vingt coups devant un humain ») figure à l'étape 3 de la directive. Elle avait été refusée le
   25 octobre au matin. Elle n'est pas dans ce chantier ; elle ne sera préparée que sur une demande explicite.
