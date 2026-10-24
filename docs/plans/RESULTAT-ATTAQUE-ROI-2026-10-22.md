# Attaque de roi : résultat de la nuit du 22 octobre

Seuils et suite écrits avant : `SEUILS-ATTAQUE-ROI-2026-10-21.md`. Orion, SF 19, prof. 18, un fil, code figé `ca6de70`,
0 échec (20/20 et 9/9 processus, fin 22 oct. 6 h 15 heure de Paris). Dépouillement le 24 oct. (en retard : les lots
étaient finis depuis jeudi matin). Sorties : `reports/plans/epreuve-attaque/` (`OBSERVATEUR.txt`).

## 1. La nuit d'observation (200 parties neuves, graines 11-20, règles A)

195 non perdues, **5 perdues** (moins que les 7 à 8 attendus) ; 391 pas de plan joués.

| candidat | non perdues allumées (< 5 %) | perdues allumées (> 20 %) | Tarrasch ouvert (≤ 2) | verdict |
|---|---|---|---|---|
| **1. veto de l'Expert, condition dame** | 4/195 (2,1 %) | **2/5 (40 %)** | 1 | **passe** |
| 2. pression graduée du GE | 0/195 | 0/5 | 0 | échoue (muet) |

- Le candidat 1 passe, **de justesse et sur peu** : les deux perdues allumées sont des Panov Noirs (n° 16 et 17, Cd5 au
  ply 7 contre Fh6 + Dd3) ; une perdue de moins et il échouait. C'était écrit d'avance (§ 3).
- Le candidat 2 ne s'allume jamais, comme sur les 1 200 parties du lot 1 bis (contrôle de mécanisme) : à ces poids, S ≥ 4
  n'arrive que dans 0,3 % des positions, jamais au moment d'un pas qui retire un défenseur. Il échoue ; on ne le retouche
  pas (GE).

## 2. Les 50 parties Panov (coach Noirs, A contre A + veto, mêmes graines)

| | |
|---|---|
| parties identiques dans les deux bras | 36 (le veto n'a pas agi) |
| parties où le veto a agi | 14 |
| **perdues en A, sauvées avec le veto** | **6** |
| **perdues avec le veto seulement** | **0** |
| perdues dans les deux | 8 |
| perdues : A / A + veto | 14 / 8 |
| coût moyen apparié, veto − A | **−0,61** (seuil : ≤ +0,10) |

Critères 1 et 2 (REGROUPEMENT § 5) **tenus** : 6 paires contre 0, coût en baisse. Critère 3 : aucune nouvelle défaite à
relire. Critère 4 : la condition « dame » en observateur sur ces 50 parties A s'allume dans 9 perdues sur 14 et 5 non
perdues sur 36.

## 3. Ce qui suit, tel qu'écrit avant (§ 4 des seuils)

Le candidat 1 entre dans le coach **comme déclencheur d'une vérification au moteur, pas comme interdit** : branchement à
écrire, relu par le Dev chef, mesuré à part, pas dans le coach qui guide Maia sans cette mesure. Rien n'est commencé :
attente du go.
