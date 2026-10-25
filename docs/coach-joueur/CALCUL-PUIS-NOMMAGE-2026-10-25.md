# « Calcul puis nommage » : le calcul choisit, l'arbre explique

25 octobre 2026, 11 h 30 (Paris). Idée de Sébastien, ce matin : « plutôt que de tâtonner avec l'arbre, faire comme avant,
lancer le gros calcul et aller trouver la correspondance du coup choisi dans l'arbre. On a l'explication, c'est ce qu'on
cherche. » Cette page mesure l'idée sur les coups déjà joués, et dit ce qu'elle change.

## La mesure

Les 605 coups du coach des 26 parties de la série 4d5e252 ont été choisis par le calcul complet (l'ancien coach). On passe
chaque coup dans les questions de l'arbre (toutes, sans plafond) : **laquelle le reconnaît ?** Aucune recherche complète :
seulement les petits calculs des questions. Outil : `scripts/joueur/nommer-coups.mjs`, méthode `JoueurArbre.nommer()`
(dev-lead 7cad405). Quatre processus à un fil, 15 minutes. Données : `nommer-4d5e252.json` à côté de cette page.

**552 coups sur 605 ont un nom : 91,2 %. 53 sans nom : 8,8 %.**

| question qui nomme | coups | part |
|---|---|---|
| 1c ma pièce en prise | 143 | 23,6 % |
| 3D je développe | 88 | 14,5 % |
| 2b prise ou échec qui gagne | 66 | 10,9 % |
| 1f que menace-t-il ? | 50 | 8,3 % |
| 3L théorie | 43 | 7,1 % |
| 2d double attaque, pièce non défendue | 40 | 6,6 % |
| 2a je mate | 36 | 6,0 % |
| 2f que menacé-je ? | 27 | 4,5 % |
| 3d j'attaque son roi | 13 | 2,1 % |
| 3C mon plan | 11 | 1,8 % |
| 1a en échec · 1e cloué · 1d dernière rangée · 1b il menace mat · 2e motif · 3Y je l'empêche | 10 · 7 · 6 · 5 · 5 · 2 | 5,8 % |

Sans nom par phase : ouverture 18 / 255 (7,1 %) · milieu 19 / 240 (7,9 %) · **finale 16 / 110 (14,5 %)**.

## Ce que disent les 53 sans nom

Presque tous sont des **coups calmes d'amélioration** : la tour vers la colonne ouverte ou la septième (Te1, Ted1, Tad1,
Tc6, Tc7, Ta2, Td6, Tb1), la dame qui quitte la première rangée (De2 × 4, Dd2, Dd3, Dc2, Dd4), un cavalier ou un fou vers
une meilleure case (Ce5, Cd5, Cf4 × 2, Ce2, Cd2, Ch2, Fc4, Fe2, Fb3, Fg4, Ff5), un pion de l'aile qui avance ou
soutient (a3 × 2, a4 × 2, a5, b3 × 2, h3, g3, g4, d4, d6). Quatre seulement sont tactiques (Ta6+, Df3+, Db6+, Dg4).

La question **« j'améliore une pièce » (3A) existe depuis ce matin**, mais seulement en dernier recours : elle ne parle que
quand aucune autre question n'a produit. En mode « nommage », il n'y a plus de plafond à protéger : on peut la laisser
toujours allumée, et la plupart des 53 coups prendront un nom (« ma tour vers la colonne ouverte », « ma dame quitte la
première rangée », « mon cavalier vers e5 »). Ce qui restera sans nom : les coups de pion de l'aile et la finale de tours
(la famille « cibles » et la technique de finale du temps 2).

## Ce que ça change

**Le niveau de jeu** : celui de l'ancien coach, intégralement. Plus de trou, plus de plafond, plus de coup coupé avant
d'être regardé. Le temps par coup : celui d'avant, plus le nommage du **seul coup choisi** (pour « que menacé-je ? », une
sonde au lieu de trente-cinq).

**L'explication** : la question qui reconnaît le coup, la plus haute dans l'arbre quand plusieurs le reconnaissent (379
des 552 coups nommés le sont par au moins deux questions). Et la phrase comparative reste : le calcul complet connaît les
coups écartés, leur ligne et leur perte (« j'ai pensé à X, mais il répondait Y et je perdais Z »).

**Le risque, à régler avant de basculer : la raison plausible mais fausse.** Un coup reconnu par « je développe » peut
avoir été choisi parce qu'il est le seul qui évite un mat en quatre. Parade proposée : si le calcul dit que le coup est
**forcé** (tous les autres candidats perdent d'au moins 100 affichés, ou se font mater), la phrase donne la raison tactique
— ce que les autres perdaient — et non le nom du plan ; sinon, le nom de la question. Second garde-fou : quand plusieurs
questions reconnaissent le coup, on dit la plus haute, et une seule.

**Les coups sans nom** se disent honnêtement : « Mon calcul préfère ce coup ; je ne sais pas le nommer. » Leur part (8,8 %
aujourd'hui, moins avec « j'améliore » allumée) devient le seul chiffre à faire baisser, par des questions nouvelles, sans
que cela touche jamais au niveau.

## Ce qui est proposé à Sébastien

1. Basculer le joueur du site en « calcul puis nommage » : le calcul complet choisit (comme avant, même budget), puis
   `nommer()` sur le coup choisi, toutes les questions allumées, 3A comprise ; la règle du coup forcé ; la phrase « sans
   nom » honnête. Le mode « arbre d'abord » reste disponible pour comparaison (c'est la mesure), il n'est plus le joueur.
2. Arrêter les deux chantiers devenus inutiles chez le Dev chef : la sonde moins chère et le coup d'œil avant la coupe.
3. Remesurer le nommage avec 3A allumée (15 minutes), puis une partie contre Maia sur le site avec le nouveau récit.
4. Dix minutes de l'Expert, en texte, sur la règle du coup forcé (est-ce ainsi qu'un entraîneur distingue « je développe »
   de « j'étais obligé » ?).

Rien n'est basculé ni déployé sans le go de Sébastien.
