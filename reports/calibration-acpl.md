# Calibration des deux seuils du jugement d'exécution (30 septembre)

Spec §4.2 : un plan positif est « bien joué » si la perte moyenne des coups du camp sur le segment est sous X
**et** qu'aucun coup ne dépasse Y (points d'espérance de score, formule de Lichess, Stockfish 19 profondeur 12).

Base : les planches de `reports/planches-humains-1` (36 planches). **21** portent un plan positif au sens actuel
(calme, apparition avant le 12e demi-coup) ; les 14 autres relèvent de l'ancien échantillonnage et sont hors base.
Les verdicts ci-dessous sont **proposés par Claude après relecture des planches** (l'idée et son exécution, jugées
sur l'échiquier avant de regarder la mesure) — à confirmer par l'auteur.

| # | Concept | Elo | Moy | Pire | Verdict proposé | Note |
|---|---|---|---|---|---|---|
| 1 | tour_colonne-w | 1511 | 2,7 | 2,7 | bien joué | Td1 naturel, roi noir au centre |
| 4 | tour_colonne-w | 1743 | 8,9 | 14,3 | bien joué (limite) | Td1 contre d4 passé, exécution moyenne |
| 6 | tour_colonne-w | 1809 | 3,1 | 7,1 | bien joué | Te1 derrière e6 |
| 7 | cavalier_avant_poste-b | 1593 | 12,4 | 18,4 | idée bonne, exécution qui fuit | Cc4 thématique mais trop lent ici |
| 9 | cavalier_avant_poste-b | 1742 | 8,8 | 8,8 | bien joué | Ce4 appuyé |
| 11 | cavalier_avant_poste-w | 1731 | 1,4 | 5,3 | bien joué | Cb5-d6 |
| 12 | cavalier_avant_poste-w | 1755 | 2,8 | 8,3 | bien joué | Cd5 central |
| 15 | blocage-w | 1371 | 5,3 | 16,8 | bien joué (limite) | Cd5 après échanges |
| 18 | blocage-b | 1650 | 0,2 | 0,7 | bien joué | Cd4 bloqueur |
| 19 | rupture-w | 1656 | 4,7 | 10,5 | bien joué | h4-h5 contre g6 |
| 20 | rupture-w | 1527 | 4,9 | 7,9 | bien joué | e4 central |
| 21 | rupture-w | 1855 | 15,5 | 44,1 | **mal joué** | e4 crée un passé noir et isole d4 |
| 22 | rupture-w | 1501 | 10,8 | 32,4 | **mal joué** | marche du roi fautive avant a4 |
| 24 | rupture-b | 1783 | 25,1 | 25,1 | **mal joué** | ...e3 ouvre la colonne f au camp adverse |
| 26 | affaiblir-w | 1647 | 15,5 | 15,5 | idée bonne, coup imprécis | Fxg4 dissipe l'avantage selon le moteur |
| 27 | affaiblir-w | 2062 | −0,4 | −0,4 | bien joué | Fxg6 hxg6 parfait |
| 29 | affaiblir-b | 1752 | −0,5 | −0,5 | bien joué | Cxe3 fxe3, doublés + arriéré |
| 30 | affaiblir-w | 1644 | 2,4 | 2,5 | bien joué | échange du fianchetto puis h4 |
| 33 | dominer-b | 1852 | 0,4 | 0,8 | bien joué | complexe noir c3-d4 |
| 35 | dominer-b | 1916 | 1,4 | 1,4 | bien joué (étiquette douteuse) | coups sûrs, mais séquence tactique ; le concept est opportuniste |
| 36 | dominer-w | 1487 | 8,7 | 34,2 | **mal joué** | Db5 gaffe au milieu (le cas prévu pour Y) |

## Seuils retenus (provisoires, à confirmer)

**X = 10 (moyenne du segment) et Y = 20 (pire coup du camp).**

- Gardent les 15 plans « bien joués », dont les deux limites (#4 : 8,9/14,3 ; #15 : 5,3/16,8).
- Rejettent les 4 « mal joués » (#21, #22, #24 par X et Y ; **#36 par Y seul** — la moyenne 8,7 passait,
  c'est la gaffe au milieu que le second seuil doit attraper) et les 2 « exécution qui fuit » (#7, #26 par X).
- Sensibilité : X = 8 rejetterait aussi #4 et #9 (verdicts « bien joué ») ; X = 12 garderait #7 ;
  Y = 25 garderait #24 (mal joué). X = 10 / Y = 20 est le seul couple qui sépare exactement.

## Étiquette d'entraînement

« Réalisé et bien joué » : un plan positif dont `perteMoyenne ≤ 10` et `pertePire ≤ 20`. Un plan réalisé mais
mal joué devient **null** (exclu) : ce n'est ni un bon exemple (on n'enseigne pas la version fautive) ni un
vrai négatif (l'intention y était). Implémentation : `scripts/build-dataset.mjs --juge`.

Limite : 21 planches, verdicts proposés par relecture de Claude et non par un joueur titré ; #35 rappelle que
le jugement d'exécution ne rattrape pas une étiquette conceptuellement douteuse (question séparée, test 2 du §7).
