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
| **« Que menacé-je ? »** — le coup qui prépare une menace à un coup (fourchette, échec gagnant) ; 1f tourné vers moi, `menace()` existe déjà | 2 | w-18 c. 8 Cb5 (menace Cxc7+, vérifié), w-08 c. 24 Fh6 (sur g7, avec Te7 et De4) |
| **Améliorer une pièce vers une case forte (3P étendu)** — pas seulement « ma pire pièce » : la dame qui quitte la première rangée, le cavalier qui gagne l'avant-poste ; `maneuvers.mjs` fait déjà les itinéraires | 2 | w-14 c. 8 Ce5, w-24 c. 15 De2 |
| **La conduite (3e, « avantage dynamique : agir »)** — mieux développé, j'ouvre | 1 | w-19 c. 12 d5 |

Les **3 coups sans aucun candidat** (étape « — ») sont dans « technique » et « conduite » : la règle à ajouter est que
l'arbre propose **toujours** au moins un coup d'amélioration ou d'attente (la demande de Sébastien : « soit on enrichit
l'arbre, soit on joue des coups neutres, des coups d'attente »).

Corrections de l'Expert retenues telles quelles : Df4, Ch5, c6 et Fxg7+ sont de l'attaque du roi et non « que menacé-je ? »
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
5. Puis **les cibles** (5), **l'échange** (3), **« que menacé-je ? »** (2), **la technique** (4), **la conduite** (1).
6. Après chaque branche, le taux recalculé sur les mêmes 605 positions.

Ce qui ne bouge pas : l'arbre produit, le calcul départage ; une branche = une question = une fonction qui rend
`{coup, raison, noeud}` ; tests hors ligne sur une position où elle produit et une où elle ne produit pas.

## Remesure après le plafond assoupli (25 oct., 5 h 55 → 7 h 14 Paris, code `b4e640a`)

Deux parades par famille au-delà de six, plafond 4 quand l'étape 1 est vide (Dev chef, 6f5c053). Mêmes 605 positions,
même budget, un fil. Données : `bilan-trous-4d5e252-plafond2.json`.

| | avant (16542ff) | après (b4e640a) |
|---|---|---|
| trous | 83 (13,7 %) | **52 (8,6 %)** |
| coupé | 54 | 29 (2b × 10, 1f × 8, 3D × 5, 1c × 4, 2d × 2) |
| pas reconnu avant | 9 | 7 |
| sans nom | 20 (3,3 %) | **16 (2,6 %)** |
| étape 1 / 2 / 3 / vide | 13,7 / 10,7 / 15,5 / 100 % | 6,9 / 6,8 / 11,1 / 100 % |

Les quatre « sans nom » disparus sont devenus des candidats grâce au plafond 4 : Cb5 (w-18), Tc7 (w-09 c. 24), Ce5
(w-14), Fh6 (w-08 c. 24). Les 29 « coupés » restants tiennent au plafond des étapes 2–3 (2b surtout : plusieurs prises ou
échecs produits, trois ou quatre gardés) ; on n'y touche plus avant les branches, pour ne pas mesurer deux choses à la fois.

## Brief du temps 2, premier lot (pour le Dev chef, après la remesure)

Trois branches, dans cet ordre, même méthode qu'au temps 1 : une question = une fonction qui rend `{coup, raison, noeud}`,
jamais de score ; tests hors ligne sur une position où elle produit et une où elle ne produit pas ; la mesure sur les 605
positions relancée par le pilote après le lot, pas par le Dev chef.

**A. « Que menacé-je ? » (nœud 2f, étape 2, après 2e).** Le `menace()` qui sert à 1f, mais pour mon camp :
on imagine que l'adversaire ne répond pas à mon coup (si lui ne fait rien) et on regarde ce que ma recherche
courte gagne. Trois sortes de gain nommées, chacune sa pastille : **je menace mat**
(sa ligne finit mat : les 7 « pas reconnu avant », Cb5 → Cc7 mat, Dd4 → Dxg7 mat, De4 → Dxh7 mat, Fh6 → Dxf8 mat, Th4,
Fxb6 → Da7+ puis Dxc7 mat, Dg4), **je menace une fourchette / un échec qui gagne** (Cb5 de w-18 : Cxc7+), **je menace
{sa pièce}** (gain de matériel compté au bout de la ligne). Le candidat = le premier coup de ma ligne. Phrase : « Je menace
{mat | sa tour | Cxc7 avec échec} : s'il ne fait rien, {ligne ≤ 4 demi-coups}. » Si sa meilleure réponse pare tout, le
calcul (étape 4) le dit, et la phrase comparative s'applique comme aujourd'hui. Positions de test : les 7 ci-dessus
(fen dans `bilan-trous-4d5e252-plafond2.json`) ; une position calme où rien n'est menacé (ne produit pas).

**B. « Toujours un coup d'amélioration » (nœud 3A, fin de l'étape 3).** Quand les étapes 1 à 3 n'ont rien produit (les
3 vides : w-03 c. 27, w-09 c. 35, w-19 c. 12), l'arbre propose quand même : (1) la pièce qui a le moins de cases utiles
vers la case où elle en a le plus, **dame et tours comprises** (De2 de w-24, Te1 et Ted1 de w-09 : la tour vers la colonne
ouverte ou semi-ouverte, la dame hors de la première rangée) ; (2) le pion passé qui avance ou la pièce qui le soutient
(a4 de w-20, Cc5 de w-26) ; (3) sinon un coup d'attente : un coup de pion ou de roi qui ne change ni le matériel ni la
sécurité (Fb5 de w-03 : le fou qui recule sans rien lâcher). Phrase : « Rien ne presse : j'améliore {pièce} » /
« J'avance mon pion passé » / « J'attends : {coup} ne change rien ». Ce nœud produit **toujours** au moins un coup : la
règle « aucun coup sans idée » (Sébastien) ; le trou « sans nom » pour arbre vide disparaît par construction, et c'est
voulu — on mesure alors si ce coup d'attente est battu de 100 par le calcul (il reste un trou, classé « coupé 3A » si le
calcul préfère un autre coup du même nœud, « sans nom » sinon).

**C. L'attaque du roi (nœud 3d, étape 3, avant 3P).** La règle de la page validée : zone = les cases autour de son roi et la
rangée devant ; A = mes pièces (hors pions et roi) qui attaquent la zone ou peuvent le faire en un coup ; D = ses
défenseurs ; **j'attaque si A − D ≥ 2, ma dame est sur l'échiquier, et il y a une ligne ouverte vers son roi ou un pion de
roque avancé** (…h6, …g6) ; **je refuse** si mon roi n'est pas à l'abri, si le centre est ouvert et jouable pour lui, ou si
je suis en retard de développement. Candidats produits, dans l'ordre : la pièce de plus qui entre dans la zone (Df4 de
w-16, Ch5 de w-23), le levier de pion contre son roi (c6 de w-17, le crochet …h6 attaqué), et **la prise ou l'échec dans
la zone même si le compte dit « égal » ou « perdant »** (Fxg7+ de w-08 c. 25 : c'est la correction de l'Expert — si l'arbre
ne propose pas le sacrifice comme candidat, le calcul ne le voit jamais ; la règle le *propose*, le calcul *décide*, et
s'il le rejette la phrase comparative dit pourquoi). Phrase : « J'attaque son roi : {A} pièces contre {D}, {la ligne
ouverte | son pion h6} » ; pastille « j'attaque son roi ». Tests : les quatre positions ci-dessus (produit) ; une
position où A − D ≥ 2 mais mon roi n'est pas à l'abri (ne produit pas) ; une où il n'y a ni ligne ni crochet (ne produit
pas).

Hors de ce lot : les cibles (3c, 5 trous : Ta2, Td6, Te1, Ted1 partiellement couverts par B), l'échange (Fb3, Fxb7,
Fxh6), la conduite (d5). Au lot suivant, après la mesure de celui-ci.
