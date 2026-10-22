# Attaque de roi : seuils écrits avant la nuit d'observation (21 octobre 2026, soir)

Décision du GE (21 oct., soir), go de Sébastien : une nuit, sans toucher au coach. Ce fichier est écrit **avant** la
première partie ; il n'est plus modifié une fois le lot lancé (toute correction ultérieure est ajoutée en dessous, datée).

## 1. Le lot

- 200 parties neuves, **règles A** (le coach du lot 1 bis, inchangé), SF 19, profondeur 18, un fil.
- Lecture retenue des « deux cents parties du lot de perturbation » : le tirage T1 (RELECTURE-MODULE § 11), **graines 11 à
  20**, sur les 20 départs-camps, un seul bras. Aucune partie de ces graines n'a été vue : c'est un test hors échantillon
  pour les deux candidats. *À confirmer par le GE si sa lecture était autre.*
- Les candidats tournent **en observateur** sur les parties finies : rien n'est interdit, la partie jouée est celle de A.

## 2. Les deux candidats

1. **Veto de l'Expert, condition dame.** Le veto de `coach/zone-roi.mjs` (attaque arrivée, encore arrivée après le coup,
   défenses du bouclier en baisse ; jamais sur un coup forcé), **plus** : la dame adverse est parmi les attaquants de la
   zone. Écrite le 21 oct. avant toute mesure (REGROUPEMENT § 6.4) ; aucune partie de ce lot ne l'a vue.
2. **Pression graduée, avec sa tendance** (GE, 22 oct., recopiée telle quelle avant la première partie) :

   > Zone du roi : la même que celle de l'Expert, trois colonnes autour du roi, sa rangée et les deux rangées devant lui,
   > neuf cases, pour que les deux candidats soient comparables. Pression P : somme, sur les pièces adverses hors roi et
   > pions qui attaquent au moins une case de la zone, d'un poids par pièce, cavalier 1, fou 1, tour 2, dame 4. Défense D :
   > la même somme pour mes pièces qui défendent au moins une case de la zone, plus 1 par pion à moi dans la zone. Danger
   > S = P − D, calculé à chaque demi-coup sur la carte d'attaques existante. Tendance : S maintenant moins S quatre
   > demi-coups plus tôt. Le candidat s'allume sur un pas de plan M, progressant ou dernière chance, jamais une parade ni
   > une reprise, quand les trois conditions tiennent à la fois : S ≥ 4 avant le coup, ce qui vaut une dame ou
   > l'équivalent ; tendance ≥ +2 ; et M fait baisser D d'au moins 1, il retire un défenseur ou déplace un pion du
   > bouclier. Pas d'exception pour l'interposition : un coup qui bouche une diagonale fait monter D et baisser P, il ne
   > s'allume pas par construction. Les poids sont ceux des évaluations classiques, pas réglés sur nos parties, et c'est
   > voulu : si ce candidat est un épouvantail à ces poids-là, il échoue, et on ne le retouche pas. Seuils et suite tels
   > qu'écrits au § 3 et § 4.

   Lectures mécaniques (Pilote, écrites avant la première partie, soumises au Dev chef) : « mes pièces » de D = hors roi et
   pions, mêmes poids, les pions comptés à part (1 par pion dans la zone) ; D après M se compte sur la zone d'avant le coup
   (si le roi bouge, on juge la zone qu'il quitte, comme le candidat 1) ; S est celui du camp du coach, à chaque
   demi-coup des deux camps ; « quatre demi-coups plus tôt » remonte dans les coups du départ si la partie a moins de
   quatre demi-coups (la position de départ a son historique).

**Allumé** (par partie) : au moins un pas de plan joué par le coach (progressant ou dernière chance, jamais une parade ou
une reprise) que le candidat aurait arrêté. **Perdue** : évaluation finale < −2 pour le camp du coach (comme au lot 1 bis).

## 3. Les seuils (GE)

Un candidat **passe** s'il tient les trois à la fois :

| | seuil | référence lot 1 bis, veto sans dame (même famille, données déjà vues) |
|---|---|---|
| parties non perdues allumées | **moins de 5 %** | 4,7 % (55 sur 1 161) |
| parties perdues allumées | **plus de 20 %** | 20,5 % (8 sur 39) |
| parties touchées au Tarrasch ouvert (les deux camps, 20 parties) | **au plus 2** | 19 sur 120 (tous coach Noirs) |

Avertissement écrit d'avance, sans changer les seuils : à 200 parties, on attend de 7 à 8 parties perdues au coach (taux SF 19
du lot 1 bis). « Plus de 20 % » veut donc dire **au moins 2 parties perdues allumées** sur 8 ; une partie de plus ou de moins
fait passer ou échouer. Le rapport publie les comptes bruts (n sur N), pas seulement le pourcentage.

## 4. Ce qui suit, décidé d'avance

- **Un candidat passe** : il entre dans le coach comme **déclencheur d'une vérification au moteur** (pas comme interdit).
  Le branchement est écrit, relu par le Dev chef, et mesuré à part ; il n'entre pas dans le coach qui guide Maia sans cette
  mesure.
- **Les deux passent** : on garde celui qui allume le moins de parties non perdues ; à égalité, le plus simple (candidat 1).
- **Aucun ne passe** : on écrit « **la Panov aux Noirs est une limite connue du coach** », et on arrête d'y toucher.
- Aucune retouche d'un candidat après lecture de ce lot (pas de troisième condition).

## 5. En parallèle : les 50 parties Panov « en mécanique »

Panov, coach Noirs, SF 19, A + veto contre A, n° 1–50 (REGROUPEMENT § 5), critère compté en paires. Lancées seulement avec
le lot ci-dessus, dans la limite de trois processus lourds sur le VPS.
