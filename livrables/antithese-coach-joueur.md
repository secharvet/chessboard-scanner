# Antithèse — le coach joueur (Expert échecs, 24 octobre 2026)

Relecture de `CHANTIERS-2026-10-24.md` (thèse du pilote) à la lumière de `LIGNES-GE-2026-10-24.md`. Sur pièces, sans
moteur ni code. Le projet me paraît jouable. Le danger n'est pas le niveau : un alpha-bêta à 5–7 demi-coups avec
quiescence calcule mieux qu'un 1500. Le danger est la **fidélité des phrases**, et deux trous de mesure.

## 1. Les termes et leurs poids
- **Danger du roi : ne pas inventer les poids.** De mémoire, dans le classique de SF 11 (`evaluate.cpp`, à vérifier sur la
  source), les poids d'attaque sont cavalier 81, fou 52, tour 44, dame 10 : la dame pèse le MOINS par attaquant, l'inverse
  du 1/1/2/4 de la thèse. Le total est ensuite élevé au carré, plus des bonus pour les échecs sûrs. Surtout, il y a une
  forte remise quand l'adversaire n'a pas de dame. C'est la règle « pas d'attaque sans la dame » que la mesure a confirmée.
  Reprendre la forme de SF 11 telle quelle. Ce terme doit voir ce que voyait l'alarme : le Cf6 qui quitte le roi fait monter
  le danger.
- **Manque un terme de développement en ouverture** (pièces mineures sorties, droit de roquer, dame sortie tôt). SF n'en a
  pas besoin, sa recherche est profonde. À 5 demi-coups, sans ce terme : sorties de dame, prise du pion b2, roi au centre.
  `positional/development.js` existe déjà.
- **Manque « échanger quand on a plus de matériel »** : bonus aux échanges de pièces, pas de pions, pour le camp qui a
  l'avantage matériel. C'est ce qui convertit contre un 1500, et c'est une phrase de club.
- **Moins de termes, plus de fidélité.** Une douzaine, chacun avec sa phrase. La « menace par poussée de pion sûre », la
  « dame faiblement protégée » ou la « pièce restreinte » ne se traduisent pas pour un débutant. À ce niveau, la recherche
  fait la tactique, et ces termes ne rapportent presque rien en force.

## 2. Finales : la liste minimale
1. **Forcer le mat** : roi adverse au bord, notre roi qui s'approche (finales R+D contre R et R+T contre R). Hors champ, à
   écrire : fou et cavalier contre roi seul (rare, risque de nulle aux 50 coups).
2. **Pion passé** : la règle du carré, seulement en finale de pions, et la distance des rois à la case devant le pion
   (déjà chez SF). Plus la tour derrière le pion passé.
3. **Roi et pion contre roi** : règle des cases critiques plus l'exception du pion de la colonne a ou h. Elle se vérifie
   contre une table de toutes les positions générée par nous (petite et exacte). C'est une phrase meilleure
   qu'« opposition », qui est difficile à pondérer et qui en découle.
4. **Facteurs de nulle** : matériel insuffisant, fous de couleurs opposées, mauvais fou avec pion de la colonne a ou h.
   Sans pions, moins d'une tour d'avance ne gagne pas (pièce mineure seule contre roi ; tour contre pièce mineure).
5. **Répétition et règle des 50 coups dans la recherche**, avec une nulle à 0. Sans elles, un coach mieux placé répète des
   coups contre Maia et rend un demi-point. C'est la première cause de gâchis.

Lucena et Philidor : **pas en V0**. Lucena demande une technique exacte plus longue que l'horizon, Philidor sert au camp qui
défend. Ce sont des chapitres pour enseigner, pas des conditions du critère. L'examinateur comptera les finales de tours
gâchées, on saura si c'est la suite. Pas de tables de finales (Syzygy) : ce ne serait plus « ses coups ».

## 3. Le livre
**C'est « ses coups »**, au sens où un joueur de club joue son répertoire appris. Le livre est une connaissance, comme la
finale, et la phrase dit honnêtement « coup du livre : [raison] ». Mais le **bonus de 20 cp est mal choisi**. À 5 demi-coups,
l'évaluation d'ouverture bouge de plus de 20 cp d'une profondeur à l'autre, et le coach sortirait du livre au hasard. Je
propose une **règle** : dans une position du livre, jouer le coup du livre, sauf si sa propre recherche y trouve une perte de
plus de 50 cp. Dans ce cas, le coach dit ce qu'il a vu.

## 4. Le plan plafonné, savoir s'arrêter
- Le plafond de 30 cp est sain. Bien vu, il borne la concession par coup à 0,3, donc le cumul d'un pion demande quatre coups
  de suite au plafond. Garder la règle, elle ne coûte rien. Mais avec SES coûts, elle n'aurait pas attrapé les fautes des
  16 parties, invisibles à faible profondeur. La protection réelle, ce sont le plafond et le terme danger du roi.
- **À définir dans la thèse :** le terme vaut (distance du plan à la racine − distance au bout de la ligne) × poids, plafonné.
  Il faut aussi la **règle d'adoption** : qui adopte quel plan, quand, et comment il en change. La thèse ne l'écrit pas.

## 5. La bévue
Plus de 100 cp à profondeur 18 : d'accord, avec trois précisions écrites avant.
- **Mats** : un mat en N qui devient un mat en N+k n'est pas une bévue.
- **Positions jouées d'avance** : si l'évaluation est au-delà de ±5 avant ET après le coup, ce n'est pas une bévue, sauf si le
  coup change l'issue (gagné vers nul, nul vers perdu). Celles-là se comptent à part, en « gâchis de conversion ».
- **Un seul coup légal** : ce n'est pas une bévue possible.
Publier aussi le taux par phase (ouverture, milieu, finale). Les longues finales gagnées diluent le taux global.

**Trou de mesure.** Si Maia à 1 nœud joue toujours son coup préféré et que le coach est déterministe, les 50 parties avec les
Blancs sont une seule partie. Il faut dire d'où vient la variété : tirage dans la politique de Maia avec graine, ou départs
variés. Sinon l'intervalle de ±10 points est faux.

## 6. Où les phrases mentiront (le cœur)
1. **Termes lus au bout de lignes différentes.** M et R finissent 6 demi-coups plus loin, dans des positions différentes.
   « Le terme qui a fait la différence » y est souvent un accident de feuille, par exemple une mobilité +0,12 due à une pièce
   au 6e demi-coup. Règle : ne citer qu'un terme **déjà présent juste après M** (après la quiescence) **et encore au bout de la
   ligne**.
2. **« Je gagne » quand en fait « R perdait ».** Comparer trois valeurs : l'évaluation avant le coup, la note de M, la note
   de R. Si M monte, c'est un gain (calcul). Si M tient et que R s'effondre, c'est **le seul coup**, donc une défense, et il
   faut nommer ce que R permettait.
3. **Ordre de priorité écrit** : calcul, puis défense, puis plan, puis amélioration. La défense passe avant le plan dès
   qu'il existe une menace que R laisse et que M pare. C'est le piège « plan par peur » de la thèse.
4. **La menace vue.** Elle se trouve en passant le tour à l'adversaire. Cela ment en zugzwang, donc pas de menace en finale
   de pions. Et « après M ce n'est plus possible » doit être **revérifié** par la même recherche après M.
5. **Motifs** : seulement dans les 3 ou 4 premiers demi-coups de la ligne, et si le gain arrive dans la ligne.
6. **« Battu »** : si R est à moins de 10 cp de M, dire « M et R se valent, j'ai pris M », pas « M bat R ». Même chose
   pour l'amélioration : ne nommer une destination (« vers e4 ») que si elle est dans la ligne, et dire « le cavalier a
   plus de cases », pas « mobilité +3 ».
