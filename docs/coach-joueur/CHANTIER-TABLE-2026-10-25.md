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

**Hypothèses écrites avant de regarder les chiffres** (thèse du pilote corrigée par l'Expert le 25 oct. à 15 h ; aucun
chiffre vu). Part « quand allumé », de 1100 à 2100 :

| nœud | attendu | pourquoi |
|---|---|---|
| 1a en échec | plat, ~100 % | forcé ; **hors critère** |
| 1b il menace mat | **monte fort** | le 1100 se fait mater en un (berger, couloir, h7) |
| 1c pièce en prise | monte jusqu'à 1500, puis plateau | en haut on laisse une pièce en prise exprès (contre-attaque, coup intermédiaire) ; ne compter que si le coup nul la gagne vraiment |
| 1d dernière rangée | monte un peu | h3 au bon moment c'est 1700+, mais le 1100 joue h3 au hasard |
| 1e clouage | monte un peu | le faible ignore le clouage jusqu'à ce qu'il coûte |
| 1f que menace-t-il ? | **monte fort et régulièrement** | premier marqueur de niveau ; les sondes de Maia disent la même chose pour les menaces |
| 2a je mate | monte puis sature | mat en 1 vu par tous dès 1300 ; mat en 2 et 3, c'est là que ça monte |
| 2b prise qui gagne | plat ou en cloche | le 1100 prend tout (prise réflexe) ; le 2100 refuse parfois une prise qui coûte en position ; **pas pour le critère** |
| 2c avant de reprendre | monte nettement, mais rare | le coup intermédiaire, signature de force ; intervalle large |
| 2d double attaque · 2e motif | montent | |
| 2f que menacé-je ? | **piège** : monte un peu avec une menace réelle (gain compté au coup nul), **descend** avec une menace au sens large | le faible fait des menaces creuses à chaque coup (Dh5 sur f7) ; le résultat dira surtout comment la menace est définie |
| 3L théorie | monte, mais c'est la mémoire | par phase ; **hors critère** |
| 3D développement | monte dans l'ouverture, plat ensuite | le 1100 pousse des pions et sort la dame |
| 3C plan | monte, peu | catalogue mince ; le faible joue des coups « de plan » par hasard |
| 3d attaque du roi | **non monotone** (cloche) | le faible attaque trop tôt sans roi à l'abri ; avec la règle stricte, monterait |
| 3P pire pièce | **monte** | le regroupement (Cd2-f1-g3) est le geste du joueur formé |
| 3Y prophylaxie | **monte, le plus fort écart** | ce qui sépare un 1900 d'un 1300 ; mais le nœud s'allume rarement si la reconnaissance de son plan est pauvre |
| 3A amélioration | plat ou descend | le reste ; les coups calmes du fort vont dans 3P et 3Y |
| sans nom | **en U** | descend de 1100 à 1500 (moins de coups sans raison), remonte de 1700 à 2100 (coups calmes que l'arbre ne sait pas nommer) |

**Les trois paris de l'Expert pour le critère : 1f, 3Y, 1b** (2c si la prophylaxie s'allume trop peu). Le pilote
ajoute 3P. **Les pièges** : 2f et 1c en haut de tableau — chez le 1100 il y a des pièces en l'air partout à menacer, chez
le 2100 presque jamais ; « allumé » n'a pas le même sens dans les deux tranches, et la part « quand allumé » ne corrige
pas ça. D'où deux garde-fous dans la table : la **part des positions où le nœud est allumé**, par tranche (si elle
change du simple au triple, la comparaison est à prendre avec des pincettes), et pour 2f la menace comptée **réelle**
(gain au coup nul), pas la menace au sens large.

**Deux sorties de plus, demandées par l'Expert.** (a) Les sans nom séparés en deux : ceux qui perdent au moins 100
(une bévue, l'examinateur le dit) et ceux qui ne perdent rien (l'arbre manque une branche) ; les deux courbes iront en
sens inverse. L'examinateur ne passe que sur les sans nom (9 % des positions, profondeur réduite). (b) Ce que la table
ne voit pas : les **suites**. Un 1900 joue le même plan trois coups de suite, la prophylaxie un coup *avant* que 1f
s'allume ; un 1300 joue des coups sans lien. Mesure bon marché : la part des coups dont le nœud est **le même qu'au coup
précédent**, par tranche. Et ce que la table ne verra jamais : *lequel* des coups du nœud (le cavalier vers la bonne
case, la bonne parade plutôt que la pire) ; c'est l'étape 2.

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
| 2 | **échantillon d'abord** : 100 par tranche (6 min), lecture ; puis 500 (5 min en rapide), lecture ; puis 5 000 ; la table à cent mille seulement si chaque palier a montré quelque chose | pilote ; Expert sur les sans nom et les désaccords | la page de résultats, trois chiffres en tête |
| 2 | relecture par le GE | Sébastien | go ou arrêt pour le chantier 2 |

Rien ne démarre avant le go de Sébastien sur cette page ; chaque lancement de calcul long est annoncé avec sa durée et son
heure de fin. Le site n'est pas touché par ce chantier (le joueur du site reste tel quel ; « calcul puis nommage » n'est
plus la direction).

## 6 bis. Échantillon pilote, 25 oct. 13 h 48 → 13 h 54 : 100 positions par tranche, nommage lent à petit budget

Six processus, 3,6 s par position, 600 positions (`reports/table-pilote/`). Intervalle de confiance d'environ ± 10
points sur chaque part : **on ne conclut rien, on regarde la forme.** Règle désormais écrite dans le calendrier :
échantillon d'abord, paliers ×5, chaque palier justifié par le précédent ([[echantillon-d-abord]]).

| | 1000 | 1200 | 1400 | 1600 | 1800 | 2000 |
|---|---|---|---|---|---|---|
| sans nom (part des coups) | 21 % | 9 % | 25 % | 20 % | 27 % | 15 % |
| 1c pièce en prise : quand allumé | 61 | 57 | 62 | 68 | 75 | 62 |
| 1c : part des positions où allumé | 41 | 49 | 37 | 37 | 24 | 29 |
| 1f que menace-t-il ? : quand allumé | 27 | 18 | 27 | 33 | 31 | 20 |
| 3D développement : quand allumé | 19 | 25 | 20 | 36 | 32 | 42 |
| 2f que menacé-je ? : allumé / nomme | 85 / 0 | 82 / 4 | 80 / 1 | 81 / 3 | 80 / 2 | 82 / 3 |

Ce que la forme dit déjà :
- **Les humains jouent un coup sur cinq que l'arbre ne nomme pas** (contre un sur onze pour notre coach). Les 100 sans
  nom se répartissent ainsi : 37 coups de pion en ouverture, 27 coups de pièce en milieu, 16 coups de pièce en ouverture,
  13 coups de pion en milieu, 18 en finale. **Le premier manque est le coup de pion d'ouverture** (…e6, …c6, c4, e5,
  …h6) : le livre ne s'allume que dans 2 % des positions (les humains en sortent vite) et « je développe » ne couvre pas
  les pions. C'est le principe « coups de pion en ouverture » de BP-Chess. Avant de grossir l'échantillon, cette branche
  (et « j'améliore » toujours allumée) doit exister, sinon la table mesure un trou connu.
- **Le piège 2f est réel** : allumé dans 80 % des positions (menace au sens large), il ne nomme que 0 à 4 %. Sans la
  menace réelle (gain compté), ce nœud ne dit rien. Le nommage rapide du Dev chef la fixe.
- **Le garde-fou « allumé » est utile** : 1c est allumé dans 41 à 49 % des positions à 1000-1399, 24 à 29 % à 1800-2199 —
  les faibles laissent plus de pièces en prise. La part « quand allumé » de 1c (61 → 75 → 62) et celle de 3D (19 → 42)
  ont l'air de monter : à revoir à 500 par tranche.
- Les phases : ouverture 45 %, milieu 40 %, finale 14 % des positions tirées ; la finale est courte dans ces parties.

**Prochain palier**, seulement après le nommage rapide (fin prévue 19 h 15) et la branche « coup de pion d'ouverture » :
100 par tranche en rapide contre ces 600 (l'accord), puis **500 par tranche** (3 000 positions, 5 minutes en rapide).
Pas de table à dix mille avant d'avoir vu les 500.

## 6 ter. Palier 5 000 par tranche (Orion, 25 oct. 14 h 34 → 14 h 50) : trois tranches, l'arbre fermé (lot 2)

Lichess septembre 2025, 5 000 positions par tranche (1 250 parties, 4 positions par partie), nommage rapide, arbre à
`cb7039b`. Intervalle de confiance à 95 % : ± 0,5 point sur une part de 3 %, ± 1,4 sur une part de 30 %, ± 2 à 3 points
sur les parts « quand allumé » des nœuds moyens. Données `reports/table-5000/` (VPS et Orion `/mnt/toto`).

| | 1200-1399 | 2000-2199 | 2200-2399 |
|---|---|---|---|
| sans nom (bruts) | 3,3 % | 4,0 % | 3,5 % |
| sans nom par phase (ouv. / mil. / fin.) | 1,7 / 4,3 / 6,8 | 1,9 / 5,4 / 7,6 | 1,9 / 4,5 / 6,6 |
| **2b prise qui gagne** : brut (quand allumé) | **9,1 (33,2)** | 6,2 (27,9) | 6,5 (27,9) |
| **3D développement** : brut (quand allumé) | 18,9 **(28,7)** | 20,9 (34,2) | 21,1 (34,9) |
| **3p pion d'ouverture** : brut | 9,0 | 11,2 | 11,9 |
| 1b il menace mat : quand allumé | 67 | 90 | 87 |
| 1c pièce en prise : brut (quand allumé) | 14,1 (42,7) | 13,4 (46,6) | 12,6 (43,0) |
| 1f que menace-t-il ? : brut (quand allumé) | 12,6 (39,4) | 11,6 (40,6) | 12,1 (42,5) |
| 2d double attaque : brut | 5,6 | 5,7 | 5,4 |
| 3Y prophylaxie : brut (quand allumé) | 0,8 (3,3) | 0,5 (2,2) | 0,5 (2,3) |
| 3u tours · 3m pièce · 3t tension · 3r | 1,6 · 2,8 · 1,1 · 1,5 | 1,7 · 2,8 · 1,7 · 2,0 | 2,0 · 3,3 · 1,4 · 2,1 |
| allumé : 1c · 2b · 3D (part des positions) | 33 · 27,5 · 66 | 28,7 · 22 · 61 | 29,4 · 23 · 61 |
| même nœud qu'au coup précédent (suites) | 11,7 % | 12,2 % | 11,8 % |

**Lecture honnête.** À 5 000 positions, **les trois tranches se ressemblent beaucoup**. Ce qui bouge au-delà de
l'intervalle : la **prise qui gagne** (le 1200 prend plus : 9,1 contre 6,2 %, et 33 contre 28 % quand c'est possible —
« la prise réflexe » de l'Expert), le **développement quand il est possible** (29 → 34 → 35 %) et le **pion d'ouverture**
(9 → 11 → 12 %). Le reste est plat : pièce en prise, que menace-t-il ?, double attaque, prophylaxie (qui baisse même,
3,3 → 2,2, à l'inverse de l'attente), les sans nom, les suites. Les positions elles-mêmes changent peu entre tranches
(1c allumé 33 contre 29 %). Les écarts sont de l'ordre de 2 à 5 points : la taille que les sondes de concepts dans Maia
laissaient attendre, et pas plus.

**Ce que ça veut dire pour le critère** (trois nœuds monotones sur les six tranches, au-delà de l'intervalle) : avec
trois tranches seulement, on ne peut ni le valider ni l'infirmer. Les quatre tranches manquantes (1000, 1400, 1600,
1800) sont en cours d'extraction sur Orion depuis 14 h 53 (même mois, même méthode, réseau seulement), puis 5 000
positions chacune (15 minutes). **Pas de palier 100 000 tant que la table à six tranches n'a pas parlé** : s'il n'y a
que deux ou trois nœuds qui bougent de quelques points, 100 000 positions ne feront que resserrer les intervalles autour
de la même réponse, et la directive dit alors : on l'écrit, on s'arrête.

**Ce que la table ne voit pas, rappel de l'Expert** : *lequel* des coups du nœud (le 2000 développe vers la bonne case),
et les suites entre coups. Si la table à six tranches reste plate, c'est là qu'est la différence de niveau, et c'est une
autre mesure (le coup choisi dans le nœud, contre Maia-3), pas une table de plus.

## 6 quater. La table à sept tranches, 5 000 positions chacune (Orion, 25 oct., 15 h 30)

Les quatre tranches manquantes extraites du même mois (30 000 parties chacune) et nommées sur Orion en 15 minutes ;
35 000 positions en tout, arbre à `cb7039b`. **Réserve** : le recomptage indépendant conteste 21 % des noms de 3D
(poussées centrales) et 14,5 % de 2b ; leurs pentes sont à relire après le lot 3. 1b, 3p, 3r, 3t sont propres (< 1 %
contestés ou non recomptables).

| | 1000 | 1200 | 1400 | 1600 | 1800 | 2000 | 2200 |
|---|---|---|---|---|---|---|---|
| sans nom | 3,5 | 3,3 | 3,3 | 3,5 | 3,8 | 4,0 | 3,5 |
| **1b il menace mat** : paré quand allumé | **62** | 67 | 74 | 78 | 84 | 90 | **87** |
| **3D développement** : joué quand possible | **26** | 29 | 28 | 31 | 33 | 34 | **35** |
| **2b prise qui gagne** : jouée quand possible | **32** | 33 | 32 | 30 | 33 | 28 | **28** |
| **3p pion d'ouverture** : part brute | **8,2** | 9,0 | 9,9 | 10,4 | 10,1 | 11,2 | **11,9** |
| 1f que menace-t-il ? : paré quand allumé | 38 | 39 | 40 | 43 | 40 | 41 | 43 |
| 1c pièce en prise : sauvée quand allumé | 43 | 43 | 44 | 42 | 45 | 47 | 43 |
| 3Y prophylaxie : quand allumé | 3,7 | 3,3 | 3,1 | 3,0 | 2,7 | 2,2 | 2,3 |
| 1c allumé (part des positions) | 35 | 33 | 32 | 30 | 29 | 29 | 29 |
| 1a en échec (part brute) | 7,0 | 6,3 | 5,2 | 5,6 | 5,4 | 4,3 | 4,3 |

**Le critère, lu avec un test de tendance** (la monotonie stricte sur sept points est brouillée par le bruit de ± 1 point
entre tranches voisines ; on ajuste une pente par tranche de 200 points, pondérée, et on la rapporte à son écart-type :
|z| ≥ 3 = tendance nette, au-delà de l'intervalle). Sur la part **quand allumé**, six nœuds ont une tendance nette :
- **1b il menace mat : + 4,7 points par tranche (z 5,3)** — le 1000 pare le mat en un 62 % du temps, le 2000 90 % ;
- **3D développement : + 1,5 (z 9,8)** ; **3p pion d'ouverture : + 0,6 (z 6,5)** ; 3C plan : + 0,3 (z 3,7) ; 3r recul
  utile : + 0,2 (z 3,9) ;
- **2b prise qui gagne : − 0,8 (z − 3,2)** — la « prise réflexe » des faibles, comme l'Expert l'avait écrit.
Et sur la part brute : 1a (− 0,4, z − 6,9) et 1c (− 0,3, z − 3,7) **baissent** — ce sont les positions qui changent (les
forts sont moins souvent en échec, laissent moins de pièces en prise), pas le choix ; 3Y baisse légèrement (z − 3,1) à
l'inverse de l'attente ; 1f monte un peu (+ 0,6, z 2,6, sous le seuil). Les sans nom sont plats (z 1,4).

**Verdict provisoire** : le critère écrit d'avance (au moins trois nœuds) est **atteint** — six nœuds, dont trois propres
(1b, 3p, 3r) et trois à confirmer après le lot 3 (3D, 2b, 3C). Les paris de l'Expert : 1b oui (le plus net), 1f faible,
3Y non (le nœud s'allume mal : 22 % des positions, nomme 3 %). Les écarts sont de la taille attendue : 1 à 5 points par
tranche, 10 à 30 points entre 1000 et 2200 sur les nœuds qui bougent. **La suite** : (1) lot 3 (noms contestés), (2) la
même table à 5 000 refaite (15 minutes sur Orion) ; si les six tendances tiennent, (3) le palier 100 000 sur les tranches
2000, 2200 et une basse, pour l'étape 2 de la directive — le modèle. La lecture de l'Expert reste vraie : la table dit
*quelle question*, pas *quel coup dans la question* ; c'est l'étape 2.

## 7. Deux points à trancher par Sébastien

1. **La période des parties** : janvier 2016 (déjà en local, suffisant pour cent mille par tranche) ou un mois récent à
   télécharger (30 Go, classements d'aujourd'hui, nécessaire de toute façon pour le million) ? Proposition : 2016 pour la
   v0 et la table à cent mille ; un mois récent ensuite, qui servira aussi de parties neuves pour les branches ajoutées.
2. **La lecture humaine** (« vingt coups devant un humain ») figure à l'étape 3 de la directive. Elle avait été refusée le
   25 octobre au matin. Elle n'est pas dans ce chantier ; elle ne sera préparée que sur une demande explicite.
