# L'alarme d'attaque de roi : le branchement, pour relecture du Dev chef (24 octobre 2026)

Go de Sébastien le 24 oct. (« go alarme »). Suite écrite avant la nuit d'observation (SEUILS § 4) : le candidat qui passe
entre dans le coach **comme déclencheur d'une vérification au moteur, pas comme interdit**. Le candidat 1 a passé
(RESULTAT-ATTAQUE-ROI-2026-10-22.md). Code sur `division`, derrière `--regles AA` ; sans l'option, rien ne change.

## 1. Le déclencheur

`alarmeDame(fen, side, san)` (`coach/zone-roi.mjs`) = le veto de l'Expert (`vetoDefense` : attaque arrivée, encore arrivée
après le coup, défenses du bouclier en baisse) **et** la dame adverse parmi les attaquants. Exactement le candidat mesuré
la nuit du 22, sans retouche.

## 2. Ce qu'il déclenche

Sous les règles AA (`coach/coup-contraint.mjs`, `choisirCoup`) :

1. Les pas du plan admissibles sont examinés dans l'ordre du moteur (comme avant). Un pas sous alarme est **revu par le
   moteur** (`verifierAlarme`) : MultiPV 4 à **profondeur 24**, retard = meilleur − valeur du pas (valeur lue dans la MultiPV
   profonde s'il y est, sinon par la meilleure réponse adverse à 24). **Gardé si retard ≤ 50 cp**, sinon on passe au pas
   suivant.
2. S'il ne reste aucun pas gardé : la fenêtre est **suspendue**, comme sous le veto (le coup du moteur, classe
   « suspendu », neutre pour le compteur, l'attente et l'addition ; le plan reprend au coup suivant).
3. La dernière chance passe par la même vérification.
4. Jamais en situation forcée (parade, reprise) : le déclencheur n'est pas consulté.
5. Journal : `alarme <coup> : retard <cp> à prof. 24 → gardé | suspendu`.

## 3. Deux réglages choisis par moi, avant toute mesure, à discuter

- **Profondeur 24** (jeu à 18) : la faute de la Panov ne se voit pas à 18 (Cd5 y passe la concession d'un pion) et se voit
  à 30 (Cg4 −0,86, Cd5 pire que Ff8 −1,75). 24 est un compromis de coût (une MultiPV 4 à 24 à un fil : de l'ordre d'une
  minute sur le VPS) ; l'alarme sonne dans 2 % des parties, le coût total reste petit.
- **Borne 50 cp** : la « seconde borne objective, contre le meilleur coup du moteur, un demi-pion » proposée par le GE le
  22 oct. pour le bras soufflé ; reprise ici telle quelle.

## 4. Ce qui ne change pas

- Sans `--regles AA`, `choisirCoup` est identique : la boucle sur les progressants rend le premier, comme l'ancien `find`.
  Contrôle : parties des lots précédents rejouées à l'identique (§ 5).
- Le veto (AV) reste à côté, inchangé ; AA ne l'active pas.
- Rien n'entre dans le coach qui guide Maia sans mesure à part.

## 5. Contrôles (à remplir)

- `npm test` : 326 réussis, 0 échec (la borne avec un moteur simulé, et le repli par la réponse adverse à 24).
- **Relecture du Dev chef (24 oct.)** : sans AA, A, AV et B rendent le même coup octet pour octet (la boucle rend le
  premier progressant comme l'ancien `find`, chemin du refus compris) ; valeur hors MultiPV à 24 par la réponse adverse :
  correct, même patron que la dernière chance ; cache indexé par profondeur, aucune collision. Deux retouches de journal
  faites (`1a61116` : toutes les alarmes du coup, la dernière n'étant pas forcément le coup joué ; test du repli). Les
  réglages 24 / 50 cp sont des choix d'échecs : à l'Expert et au GE.
- **Non-régression (VPS, un fil)** : Panov n° 1 en A identique au lot 1 bis ; Panov n° 16 en A identique à la nuit du 22.
- **Reproductibilité de la recherche à 24** (demande du Dev chef) : Panov n° 16 en AA, deux passes fraîches, empreintes
  identiques (1717198971).
- **Premier essai** : Panov n° 16 (perdue en A, −6,09) : l'alarme sonne sur Cd5 au ply 7, retard 72 cp à prof. 24 →
  suspendu, Ff8 joué ; la partie finit nulle par répétition, coût −0,34 contre +2,34 en A. Une partie : une anecdote.

## 7. La mesure à part (proposée, rien n'est lancé)

Panov coach Noirs, AA contre A, n° 1-50, mêmes graines (les 50 A existent), compté en paires comme le veto ; puis, avant
tout versement, AA sur le panel entier (20 départs-camps, 10 graines neuves) pour voir le coût hors de la Panov. Réglages
24 / 50 cp à confirmer par l'Expert et le GE avant.

## 6. Questions au Dev chef

1. La boucle sur les progressants change-t-elle quelque chose sans AA (ordre, `refus` par l'addition qui ne regarde que le
   premier progressant gardé) ?
2. La valeur du pas hors MultiPV profonde, lue par la réponse adverse à 24 : même patron que la dernière chance relue, ça
   te va ?
3. Le cache du Noteur est indexé par profondeur : aucune collision entre la note à 18 et celle à 24 ?
