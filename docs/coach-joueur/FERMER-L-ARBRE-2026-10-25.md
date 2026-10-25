# Fermer l'arbre avant les gros calculs

25 octobre 2026, 14 h 30 (Paris). Demande de Sébastien : « avant de commencer les gros calculs, ferme l'arbre ». Un arbre
« égal à la théorie » n'existe pas (les manuels ne sont pas d'accord entre eux) : on **mesure** les coups sans nom sur
des parties humaines de 2000 et plus, on ajoute des branches tant que les sans nom ne sont pas des bévues, et on
s'arrête à des seuils écrits d'avance. Thèse du pilote, antithèse de l'Expert (14 h 20), cette page est la synthèse.

## Les deux seuils, dans cet ordre

1. **L'honnêteté d'abord** : parmi les coups nommés, **moins de 5 % de noms faux** (la raison affichée ne se vérifie pas
   sur l'échiquier), lus par l'Expert sur 50 coups par tranche. C'est le danger réel : une branche « j'améliore » allumée
   en permanence ferait tomber les sans nom à zéro et monter les mensonges au plafond. Un sans nom est honnête, un faux
   nom ne l'est pas. Chaque nœud doit donc **vérifier** quelque chose qui change avec le coup (règle de l'Expert, déjà
   appliquée à 1c).
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

## La boucle

1. Nommage rapide livré (Dev chef, en cours) ; accord rapide / lent sur les 600 positions de l'échantillon.
2. Branches A puis B puis C, chacune avec ses tests hors ligne (produit / ne produit pas / se vérifie / ne se vérifie
   pas).
3. 500 positions **neuves** de 2000-2199 (quelques minutes) : la table, la liste des sans nom, 50 coups nommés lus par
   l'Expert (noms faux).
4. Si les deux seuils ne sont pas atteints : la branche suivante, et retour en 3 sur 500 positions neuves.
5. Quand ils le sont : les 100 000 positions par tranche sur Orion (environ 5 h pour trois tranches, 12 processus).
