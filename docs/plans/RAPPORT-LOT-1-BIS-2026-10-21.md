# Lot 1 bis de l'épreuve du jeu — rapport (21 octobre 2026)

Cahier : `CAHIER-LOT-1-BIS-2026-10-20.md`. Lot 1 : `RAPPORT-EPREUVE-DU-JEU-2026-10-20.md`. Point à mi-parcours (830
parties, remplacé par ce rapport) : `POINT-MI-PARCOURS-LOT-1-BIS-2026-10-21.md`. Chiffres bruts :
`reports/plans/epreuve-1bis/DEPOUILLEMENT.txt`, produits par `scripts/plans/depouillement-1bis.mjs` (lecture seule).

## En bref

- **1 200 parties, 0 échec.** SF 19 : livre A, prix A, livre B, prix B ; SF 17.1 : livre A, livre B ; 200 parties par
  bras (20 départs-camps × 10). Témoin du lot 1 réutilisé (rejoué identique avant le lancement).
- **Les règles marchent** : coût moyen des plans en baisse d'environ 40 % aux deux moteurs, perdues en baisse, éval.
  finale meilleure, **sans perdre de couverture** (81,5 % / 81,0 %, identique au lot 1) **ni de temps sous plan**.
- **Le critère n'est pas atteint à SF 19** : perdues 3,5-4,0 sur 100 pour ≤ 3 demandé. Il passe à SF 17.1 (2,0-2,5).
  La queue restante est presque toute la **Panov, coach Noirs** (4/10 dans chaque bras à SF 19).
- **Le prix n'ajoute pas** (prix − livre apparié : −0,01 et +0,00 ; critère ≤ −0,10).
- **B n'ajoute pas à A** : l'attente utile change beaucoup de parties dans les deux sens ; patience et reprise ne se
  déclenchent jamais.

## 1. Protocole

Un fil, `COACH_DETERMINISTIC=1`, prof. 18, 80 demi-coups, mêmes graines que le lot 1. Avant le lancement : deux passes
fraîches identiques pour chaque bras neuf aux deux moteurs ; témoin rejoué identique au lot 1 aux deux moteurs ;
non-régression règles coupées (cinq parties du lot 1 identiques) ; deux parties rejouées identiques sur Orion (moteurs
identiques à l'octet). Partage : VPS (SF 19 livre A, 3 processus, 20 oct. 23 h 27 → 21 oct. 5 h 40), Orion (le reste,
12 processus, 23 h 37 → 9 h 12). Code : `division` 43db398 versé dans `dev-lead`, lanceur `scripts/plans/epreuve-1bis.sh`.

**Toutes les comparaisons sont appariées** : chaque partie neuve contre la même partie (départ, camp, numéro) du lot 1
dans le même bras, et contre le témoin.

## 2. Critère

| bras | moteur | coût méd. / moy. | lot 1 | p90 | lot 1 | perdues | lot 1 | témoin | critère |
|---|---|---|---|---|---|---|---|---|---|
| livre A | SF 19 | +0,07 / +0,19 | +0,09 / +0,26 | +0,76 | +0,88 | 7 (3,5 %) | 10 | 1 | ne passe pas (queue) |
| livre A | SF 17.1 | +0,07 / +0,16 | +0,14 / +0,26 | +0,88 | +1,12 | 5 (2,5 %) | 13 | 2 | passe |
| livre B | SF 19 | +0,05 / +0,16 | +0,09 / +0,26 | +0,78 | +0,88 | 7 (3,5 %) | 10 | 1 | ne passe pas (queue) |
| livre B | SF 17.1 | +0,07 / +0,16 | +0,14 / +0,26 | +0,88 | +1,12 | 4 (2,0 %) | 13 | 2 | passe |
| prix A | SF 19 | +0,09 / +0,19 | +0,10 / +0,28 | +0,75 | +0,97 | 8 (4,0 %) | 12 | 1 | ne passe pas (queue) |
| prix B | SF 19 | +0,05 / +0,17 | +0,10 / +0,28 | +0,73 | +0,97 | 8 (4,0 %) | 12 | 1 | ne passe pas (queue) |

Couverture : 81,5 % (SF 19) et 81,0 % (SF 17.1) dans tous les bras, **exactement** celle du lot 1.

Éval. finale, écart moyen apparié : au lot 1 +0,07 à +0,14 (SF 19), +0,20 à +0,24 (SF 17.1) ; au témoin −0,56 à −0,62
(SF 19, lot 1 : −0,68 à −0,73), −0,42 à −0,47 (SF 17.1, lot 1 : −0,66). Le coach reste derrière Stockfish seul, moins
qu'avant.

**Où sont les perdues**

| | SF 19 (4 bras) | lot 1 livre | témoin | SF 17.1 (2 bras) | lot 1 livre | témoin |
|---|---|---|---|---|---|---|
| iqp-panov Noirs | 4, 4, 4, 4 | 5 | 0 | 3, 2 | 4 | 2 |
| fr-avance-noirs Noirs | 2, 2, 2, 2 | 4 | 1 | 0, 0 | 3 | 0 |
| herisson Noirs | 0 | 0 | 0 | 2, 2 | 2 | 0 |
| carlsbad (Blancs ou Noirs) | 0-2 | 0 | 0 | 0 | 0 | 0 |
| fr-tarrasch-ouvert Noirs | 0-1 | 1 | 0 | 0 | 1 | 0 |
| fr-avance-blancs Noirs, fr-avance-noirs Blancs | 0 | 0 | 0 | 0 | 3 | 0 |

La Française d'avance est réparée (SF 19 : 4 → 2 ; SF 17.1 : 3 → 0), comme la lecture de l'Expert le prévoyait (cumul
et dernière chance au-dessus de la borne). La Panov ne l'est pas : à SF 19 elle fait à elle seule 4 des 7-8 perdues.
Hors Panov, SF 19 serait à 1,6-2,1 sur 100 (3 à 4 perdues sur 190) — chiffre donné pour information, le critère porte sur tout le lot.

## 3. D'où vient le gain

**Pas d'une baisse du temps sous plan** (question de Sébastien : le coach gagne-t-il parce qu'il laisse jouer Stockfish
plus souvent ? non) :

| bras | moteur | sous plan (moy.) | lot 1 | retards payés / partie | lot 1 |
|---|---|---|---|---|---|
| livre A | SF 19 | 21,6 % | 22,4 % | 31 cp | 37 cp |
| livre B | SF 19 | 21,8 % | 22,4 % | 32 cp | 37 cp |
| prix A | SF 19 | 22,6 % | 23,4 % | 32 cp | 39 cp |
| prix B | SF 19 | 23,5 % | 23,4 % | 32 cp | 39 cp |
| livre A | SF 17.1 | 22,2 % | 22,6 % | 38 cp | 47 cp |
| livre B | SF 17.1 | 22,0 % | 22,6 % | 39 cp | 47 cp |

Le coach garde ses plans aussi longtemps ; il paie moins pour les servir.

**Peu d'interventions, bien placées** (règles A) : à SF 19 livre A, 7 refus au cumul, 5 dernières chances refusées
(R2), 1 sauvetage au faisceau ; 186 parties sur 200 identiques au lot 1 ; 14 changées : 6 mieux, 2 pire. Prix A : 16
changées, 10 mieux, 0 pire. SF 17.1 livre A : 17 changées, 11 mieux, 0 pire. Exemples retrouvés : SF 17.1
fr-avance-noirs n° 1 et 9, Thf8 de la colonne f refusé à l'addition +1,16 / +1,06 — le cas que l'Expert avait lu.

**L'attente utile (B) remue sans gagner** : livre B change 61 parties à SF 19 (14 mieux, 6 pire) et 60 à SF 17.1
(20 mieux, **14 pire**) ; bilan moyen proche de A. Le cumul sans plan reste minuscule (1-2 cp par partie en moyenne).
**Patience : 0 abandon « en attente » ; reprises : 0**, dans les six bras.

Note de lecture : un refus au cumul sur un coup de dernière chance ferme le plan avec la raison « hors de prix
(compteur) », car le compteur est aussi au seuil (ordre de `raisonAbandon`) ; les fermetures « (cumul) » sous-comptent
donc l'effet du cumul. C'est un libellé, pas un défaut de mécanique (vérifié sur les 16 refus SF 17.1).

## 4. Forme d'une partie

Identique d'un bras et d'un moteur à l'autre ; chiffres de SF 19 livre B.

- ≈ 39 coups du coach : ≈ 8 sous plan (20 %), ≈ 30 libres, < 1 attente utile hors plan. Par coup : libre 78,7 %, forcé
  7,6 %, intendance 6,3 %, progressant 4,0 %, forcé-progressant 1,0 %, attente utile sans plan 0,9 %, attente utile
  0,6 %, dernière chance 0,6 %, roque 0,3 %.
- Part sous plan par partie : 0 % dans 37 parties ; quartiles 5 / 19 / 33 % ; 9e décile 45 % ; maximum 100 %.
- **Les plans vivent juste après l'ouverture** : sous plan 56 % des coups aux demi-coups 1-10, 38 % (11-20), 24 %
  (21-30), 13 % (31-40), 8 % (41-50), 4-5 % ensuite ; adoption médiane au demi-coup 5 (8,5-9 au bras prix).
- **1,8 plan par partie** (0 : 37 ; 1 : 39 ; 2 : 75 ; 3 : 35 ; 4 : 11 ; 5 : 3) ; durée médiane 6 demi-coups (quartiles
  2 / 12). Origine : livre 294, enchaînement 48, service 19. 59 plans distincts ; les plus fréquents : colonne d 66,
  c5 30, f5 26, colonne c 22, b5 20. Très inégal selon le départ : Espagnole échange 0,2, Mar del Plata Noirs 0,1 ;
  Carlsbad 2,6-3,3, Hérisson Noirs 3,0, Panov 2,3-2,8.

Conséquence de mesure : l'épreuve teste les plans sur ≈ 20-30 demi-coups ; les ≈ 50 suivants mesurent surtout
Stockfish et diluent l'effet (dans les deux sens).

## 5. Conclusions

1. **Le cumul et la dernière chance relue à prof. 18 (règles A) sont acquis** : gain aux deux moteurs, aucune perte de
   couverture, très peu de parties dégradées. Recommandation : les garder par défaut.
2. **L'attente utile, la patience et la reprise (règles B) n'apportent rien de mesurable** ; l'attente utile ajoute de
   la variance (SF 17.1 : 14 parties pires). Recommandation : ne pas les retenir en l'état.
3. **Le prix n'ajoute rien au livre** dans ce lot (deux règles, apparié).
4. **Il reste un verrou : la Panov, coach Noirs, à SF 19.** Le lot 1 bis ne la guérit pas ; c'est le cas de la piste
   « nommer le plan adverse » (GE), hors de ce lot.

## 6. Questions au GE

1. **Mesure sur la tranche sous plan** : publier aussi coût et queue arrêtés à « dernier plan fermé + horizon calme »,
   à côté de la fin à 80 demi-coups. Recevable comme mesure principale, ou en complément ?
2. **Queue et Panov** : juger le critère hors Panov en le disant (SF 19 : 1,6-2,1 sur 100), ou attendre le remède
   « plan adverse » avant de conclure ?
3. **Règles B** : retirer attente utile, patience et reprise, ou tester une patience plus courte (3-4) ?
4. **Bras prix** : le garder comme contrôle, ou le retirer pour la suite ?

## 7. Réponse du GE (21 octobre 2026)

1. **Tranche sous plan** : en complément. Pour le **coût**, c'est la mesure honnête de ce que coûtent les plans ; à
   publier à côté. Pour la **queue**, non : une partie perdue au 60e demi-coup à cause d'un roi dégarni au 20e est une
   perte du plan. Utile en revanche : l'**attribution**, éval. au dernier plan fermé + horizon calme contre éval. finale,
   partie par partie (perte acquise sous plan, ou venue du jeu libre). Explication seulement ; le critère reste sur la
   partie entière.
2. **Queue et Panov** : ni hors Panov (retailler le panel après coup), ni attendre le remède (ne jamais conclure). Le
   résultat s'écrit tel quel : **ne passe pas à SF 19 (7 sur 200), passe à SF 17.1 (4 à 5)**, et l'écart entre 3,5 et 3
   est dans ce que 200 parties distinguent (intervalle ≈ 1,5 à 7 %). Plus fort qu'une barre : la queue n'est pas
   diffuse, c'est un départ, avec une cause nommée (l'attaque de roi que le coach ne voit pas) et un remède identifié
   (une distance pour l'atome regroupement). La Panov devient le cas-test du prochain lot, seule, 50 parties. Leçon : une
   barre de queue à 3 % ne se décide qu'avec plus de parties ; l'écrire désormais avec son intervalle.
3. **Règles B** : retirées des lots de coût, pour une raison structurelle, pas un échec : contre un exécutant parfait,
   l'attente utile ne peut pas gagner (sans plan, le coup libre est déjà le meilleur coup du moteur ; un coup admis à
   25 cp près fait aussi bien ou un peu moins bien — les 60 parties changées dans les deux sens sont ce bruit). Sa valeur
   est pédagogique et ne se mesure que face à un élève qui ne joue pas le coup du moteur : l'épreuve Maia. Code gardé
   derrière le drapeau ; pas de patience plus courte (rien à attraper).
4. **Bras prix** : retiré des lots ; réponse donnée deux fois, avec et sans garde-fou : entre instances d'une même table,
   le prix ne bat pas le livre en partie. En réserve pour le jour où la table contiendra des instances de nature
   différente (défense, restriction, regroupement). Le prix devient un outil de relecture des livres, pas de jeu.

Synthèse du GE : un coach de sortie d'ouverture qui suit le livre, sait s'arrêter, coûte un sixième de pion par partie et
perd 3 à 4 fois sur 100 au lieu d'une, presque toujours au même endroit, pour une raison connue. La question qui reste
est celle du mot « professeur » : ce coach rend-il un joueur de 1500 meilleur ? C'est l'épreuve Maia, ouverte par le go de
Sébastien le 21 octobre — d'abord une page de protocole relue, pas de code.
