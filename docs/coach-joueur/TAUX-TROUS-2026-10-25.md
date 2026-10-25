# Le taux de trous de l'arbre — premier chiffre publié

25 octobre 2026, 5 h 22 (Paris). Mesure de fin du temps 1 (`CHANTIER-ARBRE-2026-10-25.md`) : sur les **605 coups du coach**
des 26 parties de la série 4d5e252 (déjà jouées, aucune partie nouvelle), l'arbre remet ses candidats, la recherche
complète (400 000 positions, un fil) dit si elle les bat d'au moins 100 (centièmes de pion affichés). Code mesuré : `dev-lead`
à `16542ff` (les trois corrections de la démo Maia incluses). Données : `bilan-trous-4d5e252.json` à côté de cette page
(une ligne par trou : partie, coup, position, coup joué, coup proposé par l'arbre, classe, nœud).

## Le résultat

**83 trous sur 605 coups : 13,7 %.** Dont **20 « sans nom » : 3,3 %** (le chiffre qui compte, sous la barre des 5 %).

(i) Par étape où l'arbre se trouvait :

| étape de l'arbre | coups | trous | taux |
|---|---|---|---|
| 1 — ses menaces | 241 | 33 | 13,7 % |
| 2 — mes coups forcés | 187 | 20 | 10,7 % |
| 3 — mon plan | 174 | 27 | 15,5 % |
| — (aucun candidat) | 3 | 3 | 100 % |

(ii) Par classe de trou :

| classe | ce que ça veut dire | nombre | taux |
|---|---|---|---|
| coupé | une question l'avait produit, la sélection l'a écarté (plafond) | 54 (ét. 1 : 29 · ét. 2 : 14 · ét. 3 : 11) | 8,9 % |
| pas reconnu avant | la question le reconnaît seulement une fois joué | 9 | 1,5 % |
| sans nom | aucune question ne le produit | 20 | 3,3 % |

**Attention au chiffre de la première passe.** La même mesure avait tourné une première fois cette nuit avec le code
*d'avant* les trois corrections de la démo Maia : 48 trous (7,9 %), bilan perdu par un plantage du script. La différence
(35 trous) vient de la correction « une parade par famille quand le radar dépasse six » : elle a fait tomber 14 coups à
l'étape 1c et 10 à 1f dans la classe « coupé ». La correction résout un problème (14 candidats au coup 30 de la démo) en
créant un autre : on coupe le bon coup.

## Lecture des 54 « coupé » : le plafond, pas l'arbre

L'arbre voyait le coup. C'est la sélection (`selectionner()` : radar réduit à une parade par famille au-delà de six, puis
trois candidats au plus pour les étapes 2 et 3, une famille d'abord) qui l'a retiré. Répartition par nœud qui l'avait
produit : 1c × 16, 1f × 14, 2b × 11, 3D × 8, 2d × 3, 3Y × 3.

Proposition : **deux parades par famille** au lieu d'une quand le radar dépasse six (et pas de coupe en dessous), et
**plafond 4** pour les étapes 2–3 quand l'étape 1 n'a rien produit. Le coût est en positions calculées (un candidat de
plus = une recherche de plus à la racine) ; on remesure après, sur les mêmes 605 positions, pour voir ce que ça rend.

## Lecture des 9 « pas reconnu avant » : la question produit moins qu'elle ne reconnaît

2b × 3 (Cb5, Dd4, De4), 2d × 3 (Fh6, Th4, Fxb6), 3D, 3Y, 1c × 1. Le coup crée une menace de gain ou de mat que la
question nomme une fois le coup joué, mais son générateur ne l'a pas proposé. À régler question par question (le
générateur doit proposer ce que le reconnaisseur accepte), sans doctrine nouvelle.

## Lecture des 20 « sans nom » : les branches qui manquent

Chaque position a été regardée (thèse du pilote), puis relue par l'Expert sans moteur (antithèse, 25 oct. 5 h 50) ; le
tableau ci-dessous est la synthèse. Les familles sont toutes dans l'arbre validé (`ARBRE-DECISION-2026-10-25.md`) : la liste
de Sébastien (renforcement, défense, préparation d'un plan, case de fuite, coup d'attente) et celle du temps 2 (cibles,
attaque du roi, trois regards, conduite, « que veut-il faire ? ») les couvrent toutes.

| famille (nœud de l'arbre) | trous | les coups (partie, coup) |
|---|---|---|
| **Cibles (3c)** — un pion ou une pièce faible qu'une tour peut attaquer : septième rangée, colonne à doubler, la tour qui n'a pas joué | 5 | w-09 c. 24 Tc7 (a7), w-09 c. 34 Ta2 (a5), w-09 c. 19 Ted1 (doubler), w-09 c. 17 Te1, w-09 c. 35 Td6 (a6, e6) |
| **Attaque du roi (3d)** — le compte A − D autour de son roi, ma dame, une ligne ouverte ou un pion de roque avancé ; **le sacrifice doit être proposé comme candidat**, sinon le calcul ne le voit jamais | 4 | w-16 c. 16 Df4 (Df6 puis Dg7 mat avec Fh6 : à trois coups, `menace()` ne le voit pas, le compte oui), w-23 c. 10 Ch5 (le crochet h6 de la Française : Ch5, Fxh6, Dg4), w-17 c. 20 c6 (le levier contre son roi en c8), w-08 c. 25 Fxg7+ (combinaison ; **pas** un mat en deux : après Fxg7+ Txg7 Dh7+, Rxh7 est légal — vérifié) |
| **Technique du camp largement gagnant (3a finale / 3e)** — pousser le pion passé, le soutenir, un coup d'attente qui ne gâche rien | 4 | w-20 c. 28 a4, w-26 c. 32 Cc5 (soutient d6), w-03 c. 27 Fb5 (dame + fou contre rien : aucune question ne produit), w-09 c. 35 Td6 |
| **L'échange : le faire ou le refuser (3b, « quelle pièce échanger »)** — garder mes bonnes pièces, casser son roque, ouvrir une case | 3 | w-24 c. 12 Fb3 (le fou recule devant Cxd5 : garder la paire, couvrir c2), w-09 c. 18 Fxb7 (ouvre b7 et d7), w-10 c. 11 Fxh6 (casse son roque : le compte dit « égal », la raison est la structure du roi) |
| **« Et si je jouais deux fois ? »** — le coup qui prépare une menace à un coup (fourchette, échec gagnant) ; 1f tourné vers moi, `menace()` existe déjà | 2 | w-18 c. 8 Cb5 (menace Cxc7+, vérifié), w-08 c. 24 Fh6 (sur g7, avec Te7 et De4) |
| **Améliorer une pièce vers une case forte (3P étendu)** — pas seulement « ma pire pièce » : la dame qui quitte la première rangée, le cavalier qui gagne l'avant-poste ; `maneuvers.mjs` fait déjà les itinéraires | 2 | w-14 c. 8 Ce5, w-24 c. 15 De2 |
| **La conduite (3e, « avantage dynamique : agir »)** — mieux développé, j'ouvre | 1 | w-19 c. 12 d5 |

Les **3 coups sans aucun candidat** (étape « — ») sont dans « technique » et « conduite » : la règle à ajouter est que
l'arbre propose **toujours** au moins un coup d'amélioration ou d'attente (la demande de Sébastien : « soit on enrichit
l'arbre, soit on joue des coups neutres, des coups d'attente »).

Corrections de l'Expert retenues telles quelles : Df4, Ch5, c6 et Fxg7+ sont de l'attaque du roi et non « deux fois »
(la menace est à trois coups, ou c'est une combinaison) ; Fb3, Fxb7, Fxh6 sont des échanges (faits ou refusés), la famille
« prise non validée » disparaît ; d5 est la conduite ; Td6 n'est compté qu'une fois ; **le « mat en deux avec sacrifice »
était une erreur du pilote**, il n'y a pas de faute de 2a à corriger.

## Ce que je propose, dans l'ordre

1. **Le plafond** (54 trous, 8,9 %) : deux parades par famille au-delà de six, plafond 4 quand l'étape 1 est vide.
   Remesure sur les 605 positions (80 min, un fil) **avant tout le reste** : sinon les autres chiffres sont faux.
2. **Les 9 « pas reconnu avant »** : corrections dans les questions existantes, sans doctrine nouvelle.
3. **« Toujours un coup d'amélioration »** tout de suite : presque gratuit, bouche les 3 vides.
4. **L'attaque du roi (3d)** : 4 trous, demandée par le GE, et sans elle le coach reste « un défenseur qui améliore ».
   Le sacrifice sur le roi doit être proposé comme candidat.
5. Puis **les cibles** (5), **l'échange** (3), **« deux fois »** (2), **la technique** (4), **la conduite** (1).
6. Après chaque branche, le taux recalculé sur les mêmes 605 positions.

Ce qui ne bouge pas : l'arbre produit, le calcul départage ; une branche = une question = une fonction qui rend
`{coup, raison, noeud}` ; tests hors ligne sur une position où elle produit et une où elle ne produit pas.
