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
2. **Pression graduée, avec sa tendance** (proposition du GE). *Définition à recevoir du GE avant le lancement ; sans elle,
   ce candidat ne tourne pas et le lot se joue pour le seul candidat 1.* Elle sera recopiée ici, telle quelle, avant la
   première partie.

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
