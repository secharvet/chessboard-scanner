# Le faisceau : cahier des charges et critère d'arrêt (écrits avant la première ligne de code)

18 octobre 2026, 22 h. Go de l'auteur. Suite du rapport `RAPPORT-FILTRE-2026-10-18.md` (§ 6, § 9, § 11).

## 1. Ce que le faisceau mesure

Pour une position P et un plan Π de la grammaire : **le prix et le tempo de Π**, en imposant Π au moteur sur quinze coups
et en comparant à la ligne libre.

- À chaque coup à nous : les **quatre meilleurs coups** du moteur (MultiPV 4, profondeur 18, un fil). Chacun est classé par
  la distance (`coach/plan-distance.mjs`) : **progressant** (la distance baisse), **forcé** (prise à jouer, échec, pièce en
  prise au mini-échange, ou coup qui bat le second de plus d'un pion), **roque**, ou **non progressant**. Jamais de coup
  progressant hors MultiPV (règle de la nuit : le moteur facture, la distance ne choisit pas).
- Le **compteur** : un coup non progressant ni forcé ni roque compte 1 ; progressant remet à zéro ; forcé et roque sont
  neutres. Une branche dont le compteur dépasse **k = 2** est coupée (« le moteur préfère autre chose depuis trois coups »).
- L'adversaire joue **librement** : son meilleur coup (profondeur 18). Option « pire des deux » pour les arbitrages.
- **Largeur 4** : à chaque coup complet, on garde les quatre branches les mieux évaluées (point de vue de notre camp).
- **Horizon : 15 coups** (30 demi-coups) depuis la racine.
- **Ligne libre** : le moteur joue les deux camps depuis P, même profondeur, 30 demi-coups ; son évaluation au demi-coup n
  est la référence du prix.

## 2. Les sorties — exactement le vocabulaire stabilisé le 18 octobre (§ 11), plus le prix et le tempo

Pour chaque (P, Π) :
- **tempo** : le demi-coup où la distance tombe à 0 (plan réalisé, verrouillé) ; ∞ sinon.
- **prix** : évaluation de la ligne libre − évaluation de la ligne contrainte, **au même demi-coup** (celui du tempo, sinon
  l'horizon), notre point de vue ; positif = suivre Π coûte.
- **la phrase**, parmi les quatre du matin :
  - **c'est le plan** : réalisé (tempo fini) et prix ≤ plancher (25 cp) ;
  - **viable mais ça coûte** : réalisé et prix > plancher ;
  - **pas réalisable sans concession** : toutes les branches coupées parce qu'aucun coup progressant du MultiPV ne tient
    (chaque progressant disponible vaut plus d'un pion de moins que le meilleur coup) ;
  - **jamais urgent ici** : toutes les branches coupées par le compteur (le moteur a préféré autre chose trois coups de suite).
- **limite** : prix dans la bande ]25 ; 50] ou tempo à un coup de l'horizon.
- **par coup de la ligne retenue** : la classe du coup (progressant / forcé / roque / intendance), le **plan frère** qu'il
  sert s'il n'est pas progressant pour Π, et quand la réponse adverse touche la case du pas : **fenêtre fermée** (pion) ou
  **suspendue** (clouage, quand `threats.mjs` sera branché ; v1 : non).
- **à la merci de la réponse** : quand l'option « pire des deux » est active et que les deux réponses donnent des prix de
  signes opposés au-delà du plancher.
- **contesté entre moteurs** : quand SF 19 et SF 17.1 ne donnent pas la même phrase et divergent de plus d'un pion sur le
  prix. Un verdict contesté donne toujours les deux prix.

## 3. Le panel et les plans canoniques

Les dix positions du filtre (`scripts/plans/positions-filtre.mjs`), 35 plans. Le critère ne porte que sur les **plans longs**
(distance ≥ 2 à la racine, ou conjonction). Les plans **canoniques** (ceux que la littérature donne pour « le » plan de la
position) sont désignés explicitement dans le fichier des positions (`canoniques`), position par position, et soumis à
l'Expert avant la passe. Depuis le 18 octobre, **le panel canonique est une hypothèse, pas une vérité terrain** (…Cc5 au
hérisson, § 11).

## 4. Le critère d'arrêt

Sur les dix positions, plans longs seulement, à profondeur 18, un fil, SF 19 :

> **Le faisceau réussit si, dans au moins 7 positions sur 10, le plan le moins cher parmi les plans longs est un plan
> canonique, avec un prix qui sort de la bande grise (écart au second > 25 cp) — OU, quand il contredit le livre, si la
> profondeur 30 (Expert, un fil) lui donne raison.**

Si oui : on passe à l'épreuve du jeu (le faisceau étendu à la partie entière, puis Maia). Si non : **on écrit pourquoi et on
ferme**, dans un rapport aussi détaillé que celui du filtre. Dans les deux cas le rapport paraît.

Plafond : **deux semaines de soirées**. Les pièces existent (distance, wrapper UCI, classement des coups, deux moteurs,
protocole à un fil, point calme) ; ce qui manque est la boucle, les branches, le compteur, les sorties.

## 5. Ce qui est interdit

Pas de règle d'échecs codée en dur pour obtenir un résultat ; pas de plancher ni de borne changés après la passe ; pas de
plan ajouté ou retiré du panel après la passe ; mesure à un fil, deux passes fraîches identiques vérifiées avant la passe
définitive ; relecture du code par l'Expert (sémantique) et le Dev chef (mécanique) avant la passe définitive.
