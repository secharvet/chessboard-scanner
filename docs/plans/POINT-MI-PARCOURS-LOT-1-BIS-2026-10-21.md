# Lot 1 bis — point à mi-parcours pour le GE (21 octobre 2026, vers 5 h 30, Paris)

Provisoire : 830 parties terminées sur 1 200 (SF 19 : 790 sur 800 ; SF 17.1 : 40 sur 400). Chaque partie neuve est
comparée à la **même partie** du lot 1 et du témoin (même départ, même camp, même graine) : la comparaison est appariée,
pas seulement par moyennes de sous-ensembles. Un fil, `COACH_DETERMINISTIC=1`.

Contrôles faits avant le lancement : deux passes fraîches identiques pour chaque bras neuf aux deux moteurs ; témoin
rejoué identique au lot 1 aux deux moteurs (donc réutilisé, non rejoué) ; non-régression règles coupées (cinq parties du
lot 1 identiques) ; Orion rejoue à l'identique deux parties du VPS (moteurs identiques à l'octet) — le lot est partagé
entre les deux machines.

Rappel des bras : A = cumul lu avant le coup (refus au-delà de 1,0 pion, une vérification au faisceau par segment) +
dernière chance relue à la profondeur de jeu ; B = A + attente utile (sous plan et sans plan, plafond 1,0 pion sans plan)
+ patience 6 avec reprise des plans en attente.

## 1. Critère (SF 19)

Couverture d'abord : **81,5 % des parties ont au moins un plan, exactement comme au lot 1** dans chaque bras — le
garde-fou n'a pas retiré de parties.

| bras | coût méd. / moy. | lot 1 | perdues (< −2) | lot 1 | témoin | éval. finale vs lot 1 | vs témoin (lot 1 vs témoin) |
|---|---|---|---|---|---|---|---|
| livre A (190) | +0,07 / +0,20 | +0,09 / +0,27 | 7 (3,7 %) | 10 | 1 | +0,07 | −0,62 (−0,69) |
| livre B (200) | +0,05 / +0,16 | +0,09 / +0,26 | 7 (3,5 %) | 10 | 1 | +0,12 | −0,56 (−0,68) |
| prix A (200) | +0,09 / +0,19 | +0,10 / +0,28 | 8 (4,0 %) | 12 | 1 | +0,14 | −0,59 (−0,73) |
| prix B (200) | +0,05 / +0,17 | +0,10 / +0,28 | 8 (4,0 %) | 12 | 1 | +0,14 | −0,59 (−0,73) |

- Médiane et moyenne passent largement ; la moyenne baisse d'environ un tiers.
- **La queue ne passe pas encore** : 3,5 à 4 perdues sur 100 contre ≤ 3 demandé (témoin : 0,5). Elle a baissé d'un tiers.
- **Le prix n'ajoute pas** : prix − livre ≈ 0 dans les deux règles (critère : ≤ −0,10).

Où sont les perdues : **iqp-panov Noirs 4/10 dans chacun des quatre bras** (lot 1 : 5) ; fr-avance-noirs Noirs 2 (lot 1 :
4) ; le reste, 0 à 2 cas isolés (carlsbad, fr-tarrasch-ouvert). Les règles guérissent la Française d'avance, pas la Panov
— c'est le cas où ta piste « nommer le plan adverse » s'applique, hors de ce lot.

## 2. D'où vient le gain — pas d'une baisse du temps sous plan

Question de Sébastien : gagne-t-on parce que le coach a moins souvent un plan actif (donc Stockfish joue davantage) ?
**Non.**

| bras | part sous plan (moy.) | lot 1 | coups libres / partie | lot 1 | retards payés / partie | lot 1 |
|---|---|---|---|---|---|---|
| livre A | 21,5 % | 22,4 % | 31,1 | 30,7 | 32 cp | 38 cp |
| livre B | 21,8 % | 22,4 % | 30,4 | 30,6 | 32 cp | 37 cp |
| prix A | 22,6 % | 23,4 % | 30,8 | 30,4 | 32 cp | 39 cp |
| prix B | 23,5 % | 23,4 % | 30,0 | 30,4 | 32 cp | 39 cp |

Le coach garde ses plans aussi longtemps ; il paie moins cher pour les servir (≈ 6 cp de moins par partie). La plupart
des parties sont identiques au lot 1 (A : 176/190 et 184/200 ; B : 139/200 et 136/200) ; le gain se fait sur les parties
que les règles changent :

| bras | changées | mieux (> +0,5) | pire (< −0,5) |
|---|---|---|---|
| livre A | 14 | 6 | 2 |
| prix A | 16 | 10 | 0 |
| livre B | 61 | 14 | 6 |
| prix B | 64 | 15 | 5 |

Parmi les changées, celles où le plan dure aussi longtemps ou plus longtemps gagnent autant ou plus que celles où il
dure moins (petits effectifs : tendance, pas preuve).

Ce qui agit, d'après les comptes : **la dernière chance relue à prof. 18 et l'attente utile**. Le cumul agit peu
(29 refus, 4 sauvetages, 4-5 abandons « hors de prix (cumul) » par bras sur 790 parties). **La patience ne se déclenche
jamais** (0 abandon « en attente ») ; la reprise ne joue presque pas (segments ≈ plans distincts par partie).

## 3. Forme d'une partie (SF 19, livre B, 200 parties)

Sur ≈ 39 coups du coach : ≈ 8 sous plan (20 %), ≈ 30 libres (78 %), < 1 coup d'attente utile hors plan.
Par coup : libre 78,7 %, forcé 7,6 %, intendance 6,3 %, progressant 4,0 %, forcé-progressant 1,0 %, attente utile sans
plan 0,9 %, attente utile 0,6 %, dernière chance 0,6 %, roque 0,3 %.

Part sous plan par partie : 0 % dans 37 parties ; quartiles 5 % / 19 % / 33 % ; 9e décile 45 % ; max 100 %.

**Les plans vivent au début** (demi-coups comptés depuis le départ-camp, donc juste après l'ouverture) :

| demi-coups | sous plan | dont progressants |
|---|---|---|
| 1er coup | 70 % | 40 % |
| 1-10 | 54 % | 16 % |
| 11-20 | 38 % | 9 % |
| 21-30 | 24 % | 4 % |
| 31-40 | 13 % | 3 % |
| 41-50 | 8 % | 1 % |
| 51-80 | 4-5 % | 1 % |

Adoption : médiane au demi-coup 5, trois quarts avant le 22e.

**Plans par partie** : moyenne 1,8 ; 0 plan : 37 parties, 1 : 39, 2 : 75, 3 : 35, 4 : 11, 5 : 3. Durée d'un plan :
médiane 6 demi-coups (quartiles 2 / 12). Origine : livre 294, enchaînement 48, service 19. 59 plans distincts ; les plus
fréquents : colonne d 66, c5 30, f5 26, colonne c 22, b5 20. Très inégal selon le départ : Espagnole échange 0,2,
Mar del Plata Noirs 0,1 ; Carlsbad 2,6-3,3, Hérisson Noirs 3,0, Panov 2,3-2,8.

## 4. Ce que nous en tirons, et les questions pour toi

1. Le test des plans se joue sur une tranche courte (≈ 20-30 premiers demi-coups) ; les 50 suivants mesurent surtout
   Stockfish et diluent l'effet. **Proposition** : publier aussi coût et queue sur la tranche sous plan (par exemple
   fin à « dernier plan fermé + horizon calme »), à côté de la fin à 80 demi-coups. Est-ce recevable comme mesure
   principale, ou seulement en complément ?
2. La queue restante est presque entièrement la Panov Noirs. Faut-il juger le critère de queue hors Panov (en le
   disant), ou attendre le remède « plan adverse » avant de conclure ?
3. La patience à 6 ne joue jamais : faut-il la tester plus courte (3-4) dans un lot ultérieur, ou la retirer ?
4. Le prix n'ajoute rien au livre dans ce lot : on le garde comme bras de contrôle, ou on le retire pour la suite ?

SF 17.1 : trop tôt (40 parties, sur des départs où le coach n'a presque pas de plan, identiques au lot 1). Fin attendue
vers 9 h ; le dépouillement complet suivra.
