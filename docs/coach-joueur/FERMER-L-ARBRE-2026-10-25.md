# Fermer l'arbre avant les gros calculs

25 octobre 2026, 14 h 30 (Paris). Demande de Sébastien : « avant de commencer les gros calculs, ferme l'arbre ». Un arbre
« égal à la théorie » n'existe pas (les manuels ne sont pas d'accord entre eux) : on **mesure** les coups sans nom sur
des parties humaines de 2000 et plus, on ajoute des branches tant que les sans nom ne sont pas des bévues, et on
s'arrête à des seuils écrits d'avance. Thèse du pilote, antithèse de l'Expert (14 h 20), cette page est la synthèse.

## Les deux seuils, dans cet ordre

1. **L'honnêteté d'abord** : parmi les coups nommés, **moins de 5 % de noms faux** (la raison affichée ne se vérifie pas
   sur l'échiquier). **Mesuré par le code, pas par une lecture** (Sébastien, 25 oct. : pas de LLM dans la boucle de
   vérification, trop coûteux et trop peu fiable ; c'est aussi l'interdit de la directive). Chaque nœud porte un
   **vérificateur** qui contrôle sur l'échiquier ce qu'il affirme ; un nœud qui ne vérifie pas ne nomme pas ; et le
   harnais recompte après coup, indépendamment du générateur, ce que la phrase affirme (la pièce était en prise, le pion
   est au centre, la case est libérée), comme il le fait déjà pour les menaces non parées. Le danger reste le même : une
   branche « j'améliore » allumée en permanence ferait tomber les sans nom à zéro et monter les mensonges au plafond. Un
   sans nom est honnête, un faux nom ne l'est pas.
2. **La couverture ensuite** : **moins de 10 % de sans nom qui ne sont pas des bévues**, à 2000 et plus, par phase ;
   5 % quand les branches ci-dessous seront là ; sans doute jamais en finale, où la théorie est faite de coups précis.
   Un sans nom chez un 2100 n'est pas un échec de l'arbre : c'est sa liste de lecture.

## Les branches à construire (toutes vérifiables sur l'échiquier)

**A. Le coup de pion d'ouverture (nœud 3p)** — 37 des 100 sans nom de l'échantillon. Cinq raisons, nommées par la plus
haute qui se vérifie ; si aucune ne vérifie, sans nom à bon droit (…a6 au coup 2) :
- a) **le centre** : le pion arrive en d4/e4 (d5/e5) ou le soutient (c3, e3, …c6, …e6) — vérif : pions centraux ou
  soutiens en plus ;
- b) **ouvrir une pièce** : libère une diagonale ou une case de développement (e3 pour le Ff1, g3, …b6, …d6) — vérif :
  les cases de développement d'une pièce non développée augmentent ;
- c) **chasser ou empêcher** : h3 contre …Fg4, a3 contre …Fb4, …a6 contre Fb5 — vérif : une pièce adverse perd sa case
  ou doit bouger ;
- d) **gagner de l'espace / le levier** : c4, …c5, e5, b4, …f5, ou un contact de pions qui ouvre une colonne pour moi —
  vérif : cases contrôlées dans son camp, ou contact nouveau ; la seule qui continue en milieu de partie ;
- e) **l'abri du roi** : …h6, …g6, h3 devant le roi roqué ou sur la case où une pièce adverse entrerait.

**B. Les coups de pièce calmes du milieu** — 27 des 100 ; les deux premiers en couvrent la moitié selon l'Expert :
- **la pièce qui cède une case** (le recul utile : …Cd7-f8, Fe2-f1, Cf3-e1 pour libérer f3 ou f2) — vérif : une case
  libérée devient utilisable par un pion ou une autre pièce ; 3P ne le voit pas, la pièce ne va pas vers une meilleure
  case, elle en libère une ;
- **défendre d'avance un point** (surprotection) — vérif : le compte sur la case passe de n à n + 1 sans menace présente ;
- **garder la tension ou la résoudre** (ne pas prendre en d5, ou prendre pour fixer) — vérif : la paire de pions en
  contact reste ou disparaît ; c'est « refuser l'échange » appliqué aux pions ;
- **la case de fuite et le roi** (Rh1, Rb1 après le roque, …Rg7) — vérif : une case de fuite de plus ; l'arbre ne l'a
  qu'en couloir (1d) ;
- **lui enlever sa case** (h3 contre …Fg4, a3 contre …Cb4) — vérif : la mobilité de sa pièce baisse ; prophylaxie de
  case, plus simple que « son plan » ;
- **préparer un levier** (Tb1 puis b4, …Te8 puis …e5) — vérif : un soutien de plus sur la case du levier ; le
  plan-distance existant, allumé sans structure reconnue.

**C. Déjà listées, à faire aussi** : l'échange, le faire ou le refuser (garder la paire, casser le roque, échanger le
défenseur) ; les cibles pour les tours (septième, colonne, pion faible) ; le roque comme question à part (« je mets mon
roi à l'abri ») ; la technique de finale (pion passé qui avance ou soutenu, roi actif). « J'améliore » (3A) reste en
dernier recours, avec une raison vérifiable, jamais allumée en permanence.

**Ce qu'on ne fait pas** : le sacrifice positionnel (hors de portée d'un arbre, seul le calcul le trouve) ; la manœuvre
longue, le levier d'aile, le transfert vers l'aile du roi, la simplification : déjà couverts par 3P, d), 3d et 3c.

## Mesure 1 (25 oct., 15 h 06) : lot 1 fusionné (dev-lead 5064de9), 500 positions neuves de 2000-2199

Lichess septembre 2025, mode rapide, quatre processus à un fil, 2 minutes. Trois chiffres :
- **temps par coup** : 0,9 à 1,0 s mur sur la machine partagée ; 61 600 positions calculées par coup en moyenne sur la
  série (p90 99 100), la cible « moins de 100 000 » est tenue ;
- **noms refusés par le vérificateur** : 37 sur 480 reconnaissances (7,7 %) : ce sont des noms faux évités ; le
  recomptage indépendant du harnais reste à construire, le vérificateur est pour l'instant le seul étage ;
- **sans nom** : 57 sur 500 (11,4 %), dont 7 bévues (SF19 prof. 12, un fil) → **50 sans nom hors bévues = 10,0 %**,
  sur le seuil, pas dessous. Par phase : ouverture 7,8 %, milieu 14,4 %, finale 16,9 %.

Qui nomme, à 2000-2199 (part brute) : 3D développement 21,2 % · 1f que menace-t-il ? 11,8 % · 1c pièce en prise 10,6 %
· 3p pion d'ouverture 8,8 % · 2b prise qui gagne 6,4 % · 2d double attaque 5,6 % · 1a 4,8 % · 3r pièce qui cède une case
3,6 % · 2f 2,6 % · 2e 2,4 % · 1e, 3C 2,2 % · 3L 2,0 % · le reste sous 1,5 % ; 3s surprotection ne nomme rien (allumée
27 %). Quand allumé : 1f 48 %, 1c 42 %, 3D 35 %, 2b 34 % ; 2f allumée dans 75 % des positions et nomme 3,5 % : la
définition de « allumé » pour 2f reste au sens large, à resserrer.

Les 50 sans nom hors bévues disent le lot 2 : tours vers une colonne (10), échanges de pions et tension (9), coups de
pion que 3p n'a pas vérifiés (13 : h3 avant que …Fg4 soit possible, a3, a6, c5, f4, b5…), le roi (3), la dame vers une
meilleure case (5), fou et cavalier vers une case forte (8). Accord rapide / lent sur les 600 positions d'hier : 86,7 %
même nœud ; les désaccords viennent surtout du vérificateur 1c (43 « attaquée mais défendue » renommées), voulu ; hors
1c, l'approximation change le nœud dans environ 3 % des cas.

## La boucle : deux tours au plus (Sébastien : « c'est un peu long »)

1. **Premier lot** (Dev chef, d'une traite) : le nommage rapide, la branche A (pions d'ouverture), les deux premières de B
   (la pièce qui cède une case, la surprotection), chacune avec son vérificateur et ses tests hors ligne (produit / ne
   produit pas / le vérificateur refuse). Accord rapide / lent mesuré sur les 600 positions de l'échantillon.
2. **Une mesure** : 500 positions **neuves** de 2000-2199 (quelques minutes). Trois chiffres : noms faux (harnais),
   sans nom hors bévues, temps par coup.
3. Sous les seuils : les 100 000 positions par tranche sur Orion (environ 5 h pour trois tranches, 12 processus).
   Sinon : **second lot** (le reste de B, puis C), une seconde mesure, et on lance quel que soit le résultat, en
   publiant les sans nom comme liste de lecture.
