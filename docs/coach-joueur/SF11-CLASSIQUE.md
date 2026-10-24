# L'évaluation classique de Stockfish 11 : les nombres repris tels quels

Source publique : dépôt `official-stockfish/Stockfish`, étiquette `sf_11` (janvier 2020, dernière version avant NNUE),
fichiers `types.h`, `evaluate.cpp`, `pawns.cpp`, `psqt.cpp`. Lus le 24 octobre 2026. Les scores sont des paires
(milieu de jeu, finale) en centièmes d'un pion de milieu de jeu valant 128 ; le coach les convertit en centipions
(× 100 / 128 pour le milieu, × 100 / 213 pour la finale, ou garde l'échelle interne et ne convertit qu'à l'affichage).
Le point de départ imposé par le GE : « pas de page blanche ». Ce qui n'est pas repris est dit dans CHANTIERS (v2).

## Valeurs et phase
- Pion 128 / 213, cavalier 781 / 854, fou 825 / 915, tour 1276 / 1380, dame 2538 / 2682.
- Phase : matériel hors pions des deux camps, borné entre EndgameLimit 3915 et MidgameLimit 15258 ; mélange linéaire.

## Placement (psqt.cpp, rangée 1 → 8, colonnes a → d, miroir pour e → h)
```
CAVALIER  (-175,-96)(-92,-65)(-74,-49)(-73,-21) | (-77,-67)(-41,-54)(-27,-18)(-15,8) | (-61,-40)(-17,-27)(6,-8)(12,29)
          (-35,-35)(8,-2)(40,13)(49,28) | (-34,-45)(13,-16)(44,9)(51,39) | (-9,-51)(22,-44)(58,-16)(53,17)
          (-67,-69)(-27,-50)(4,-51)(37,12) | (-201,-100)(-83,-88)(-56,-56)(-26,-17)
FOU       (-53,-57)(-5,-30)(-8,-37)(-23,-12) | (-15,-37)(8,-13)(19,-17)(4,1) | (-7,-16)(21,-1)(-5,-2)(17,10)
          (-5,-20)(11,-6)(25,0)(39,17) | (-12,-17)(29,-1)(22,-14)(31,15) | (-16,-30)(6,6)(1,4)(11,6)
          (-17,-31)(-14,-20)(5,-1)(0,1) | (-48,-46)(1,-42)(-14,-37)(-23,-24)
TOUR      (-31,-9)(-20,-13)(-14,-10)(-5,-9) | (-21,-12)(-13,-9)(-8,-1)(6,-2) | (-25,6)(-11,-8)(-1,-2)(3,-6)
          (-13,-6)(-5,1)(-4,-9)(-6,7) | (-27,-5)(-15,8)(-4,7)(3,-6) | (-22,6)(-2,1)(6,-7)(12,10)
          (-2,4)(12,5)(16,20)(18,-5) | (-17,18)(-19,0)(-1,19)(9,13)
DAME      (3,-69)(-5,-57)(-5,-47)(4,-26) | (-3,-55)(5,-31)(8,-22)(12,-4) | (-3,-39)(6,-18)(13,-9)(7,3)
          (4,-23)(5,-3)(9,13)(8,24) | (0,-29)(14,-6)(12,9)(5,21) | (-4,-38)(10,-18)(6,-12)(8,1)
          (-5,-50)(6,-27)(10,-24)(8,-8) | (-2,-75)(-2,-52)(1,-43)(-2,-36)
ROI       (271,1)(327,45)(271,85)(198,76) | (278,53)(303,100)(234,133)(179,135) | (195,88)(258,130)(169,169)(120,175)
          (164,103)(190,156)(138,172)(98,172) | (154,96)(179,166)(105,199)(70,199) | (123,92)(145,172)(81,184)(31,191)
          (88,47)(120,121)(65,116)(33,131) | (59,11)(89,59)(45,73)(-1,78)
PION (rangées 2 → 7, colonnes a → h, pas de miroir)
          (3,-10)(3,-6)(10,10)(19,0)(16,14)(19,7)(7,-5)(-5,-19)
          (-9,-10)(-15,-10)(11,-10)(15,4)(32,4)(22,3)(5,-6)(-22,-4)
          (-8,6)(-23,-2)(6,-8)(20,-4)(40,-13)(17,-12)(4,-10)(-12,-9)
          (13,9)(0,4)(-13,3)(1,-12)(11,-12)(-2,-6)(-13,13)(5,8)
          (-5,28)(-12,20)(-7,21)(22,28)(-8,30)(-5,7)(-15,6)(-18,13)
          (-7,0)(7,-11)(-3,12)(-13,21)(5,25)(-16,19)(10,4)(-8,7)
```

## Pions (pawns.cpp)
- Isolé (5, 15) ; arriéré (9, 24) ; doublé (11, 56) si non soutenu ; faible non opposé (13, 27) en plus de l'isolé ou de
  l'arriéré quand aucun pion adverse n'est devant ; WeakLever (0, 56).
- Lié : `v = Connected[r] × (2 + phalange − opposé) + 21 × soutiens`, `Connected = {0, 7, 8, 12, 29, 48, 86}`, score
  (v, v × (r − 2) / 4).
- Abri du roi : `ShelterStrength[d][rangée de notre pion]` (d = distance de colonne 0..3) :
  `{-6, 81, 93, 58, 39, 18, 25} {-43, 61, 35, -49, -29, -11, -63} {-10, 75, 23, -2, 32, 3, -45} {-39, -13, -29, -52, -48, -67, -166}`.
- Tempête : `UnblockedStorm[d][rangée du pion adverse]` :
  `{85, -289, -166, 97, 50, 45, 50} {46, -25, 122, 45, 37, -10, 20} {-6, 51, 168, 34, -2, -22, -14} {-15, -11, 101, 4, 11, -15, -29}` ;
  tempête bloquée (82, 82) seulement si le pion adverse est sur la 3e rangée relative. Abri lu sur la case du roi et sur
  g1 / c1 si le roque est encore possible, on garde le meilleur ; malus de finale 16 × distance du roi à son pion le plus proche.

## Pièces (evaluate.cpp)
- Mobilité (cases non attaquées par les pions adverses, hors nos pions bloqués et notre roi et dame) :
  cavalier 9 entrées `(-62,-81)(-53,-56)(-12,-30)(-4,-14)(3,8)(13,15)(22,23)(28,27)(33,33)` ;
  fou 14 `(-48,-59)(-20,-23)(16,-3)(26,13)(38,24)(51,42)(55,54)(63,57)(63,65)(68,73)(81,78)(81,86)(91,88)(98,97)` ;
  tour 15 `(-58,-76)(-27,-18)(-15,28)(-10,55)(-5,69)(-2,82)(9,112)(16,118)(30,132)(29,142)(32,155)(38,165)(46,166)(48,169)(58,171)` ;
  dame 28 `(-39,-36)(-21,-15)(3,8)(3,18)(14,34)(22,54)(28,61)(41,73)(43,79)(48,92)(56,94)(60,104)(60,113)(66,120)(67,123)(70,126)(71,133)(73,136)(79,140)(88,143)(88,148)(99,166)(102,170)(102,175)(106,184)(109,191)(113,206)(116,212)`.
- Avant-poste (30, 21), doublé pour un cavalier ; avant-poste atteignable (32, 10) ; mineure derrière un pion (18, 3).
- Tour sur colonne semi-ouverte (21, 4), ouverte (47, 25) ; tour enfermée par son roi (52, 10), doublé sans droit de roque.
- Fou gêné par ses pions : (3, 7) × pions de sa couleur × (1 + pions bloqués des colonnes centrales) ; fou sur la grande
  diagonale ouverte (45, 0) ; protecteur du roi (7, 8) × distance au roi (cavalier et fou).
- Menaces : par une mineure sur {pion (6, 32), cavalier (59, 41), fou (79, 56), tour (90, 119), dame (79, 161)} ; par une
  tour sur {(3, 44), (38, 71), (38, 61), (0, 38), (51, 38)} ; par le roi (24, 89) ; pièce en l'air (69, 36) ; pion sûr qui
  attaque une pièce (173, 94) ; poussée de pion qui menace (48, 39).
- Pion passé : `PassedRank = {0, (10,28), (17,33), (15,41), (62,72), (168,177), (276,260)}`, `PassedFile (11, 8)` × distance au
  bord ; pour r > 3 : `w = 5r − 13`, bonus de finale `((dist roi adverse à la case devant × 19) / 4 − dist notre roi × 2) × w`,
  moins `dist notre roi à la case suivante × w` si r ≠ 7 ; si la case devant est vide, `k` = 35 si aucune case du chemin
  n'est attaquée, 20 si le chemin jusqu'à la promotion est sûr, 9 si la case devant est sûre, 0 sinon, +5 si une tour ou
  dame est derrière ; bonus (k × w, k × w) ; divisé par 2 si le pion ne reste pas passé après la poussée ou a un pion devant.
- Espace (milieu de jeu, si matériel hors pions > 12222) : cases sûres des colonnes c–f sur nos rangées 2–4, plus celles
  derrière nos pions non attaquées ; bonus × (nombre de nos pièces − 1)² / 16.

## Danger du roi (evaluate.cpp, king())
```
KingAttackWeights = {cavalier 81, fou 52, tour 44, dame 10}
kingDanger =  attaquants × somme des poids
            + 185 × cases de la zone du roi faibles (attaquées par eux, pas deux fois par nous, défendues au plus par roi ou dame)
            + 148 × échecs non sûrs + 98 × nos pièces clouées + 69 × attaques sur les cases voisines du roi
            + échecs sûrs : dame 780, tour 1080, fou 635, cavalier 790
            + 3 × (attaques de flanc)² / 8 + mobilité (eux − nous, milieu)
            − 873 si l'adversaire n'a pas de dame − 100 si notre cavalier défend à côté du roi
            − 6 × (abri, milieu) / 8 − 4 × défenseurs du flanc + 37
si kingDanger > 100 : score −= (kingDanger² / 4096, kingDanger / 16)
```
Attaque de flanc (8, 0) par attaque ; flanc sans pion (17, 95).

## Facteurs d'échelle (fin de partie)
- Fous de couleurs opposées et rien d'autre que les fous : 22 / 64. Sinon `min(sf, 36 + (opposés ? 2 : 7) × pions du camp fort)`.
- Puis `sf − (compteur des 50 coups − 12) / 4`.

## Ce que le coach ne reprend pas (choix écrit d'avance)
L'« initiative » (complexité), les menaces « poussée sûre » et « pièce restreinte », la dame faible, le cavalier/coureur
sur la dame, la mobilité adverse et l'attaque de flanc dans le danger du roi, les tables de finales. Raison : à 5–7
demi-coups ces termes rapportent peu et ne se traduisent pas en phrases de club (antithèse de l'Expert, § 1).
