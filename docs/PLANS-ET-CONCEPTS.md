# Plans et concepts : définitions et protocole

Document de travail, septembre 2026 (révisé après relecture critique : horizon, entrées, transpositions, concept de blocage). Il fait suite au bilan des essais « LLM stratège ». Un LLM se trompe
encore sur 5 à 12 % des explications, qu'il reçoive un long contexte ou une fiche. Il peut servir de voix,
pas de stratège. La nouvelle piste sort le LLM de la boucle : **de petits réseaux spécialisés, chacun
entraîné à reconnaître un principe d'échecs, s'allument quand ce principe est le bon plan ; leurs
activations, vérifiées par Stockfish, SONT l'explication.**

Avant d'entraîner quoi que ce soit, il faut savoir ce qu'on appelle un plan.

---

## 1. Tactique et plan : définitions opérationnelles

Une définition n'est utile que si un programme peut dire, pour une position donnée, « oui » ou « non ».

### Tactique

Une **tactique** est une suite **forcée** (échecs, prises, menaces directes), d'au plus environ 8 demi-coups, dont
le résultat se **mesure** : matériel gagné, ou mat.

- Elle est vérifiable entièrement par Stockfish et par nos détecteurs actuels (menaces, lignes forcées, motifs).
- Elle ne demande aucun apprentissage : c'est déjà juste par construction dans le mode fiche.

### Plan

Un **plan** est un **état but**, décrit par un ou plusieurs **concepts** (cavalier installé sur un avant-poste,
colonne prise par une tour, rupture de pions jouée, pion faible adverse gagné…). Il doit vérifier trois conditions :

- il est atteignable en environ 5 à 15 coups par des coups qui ne sont pas forcés ;
- sa valeur est **vérifiée** : quand Stockfish déroule sa meilleure suite, l'état but **apparaît** dans cette
  suite (et y reste), **et il n'apparaît pas** dans les suites nettement moins bonnes (contraste) ;
- il est **attribuable** à un camp : mon plan, ou le plan de l'adversaire.

Le plan de l'adversaire se définit de la même manière, du point de vue de l'adversaire, et se vérifie en
déroulant **sa** meilleure suite.

### Pourquoi le contraste est essentiel

Nos règles actuelles détectent la **présence** d'un concept (« une case faible existe en d5 »). Elles ne disent pas
si ce concept **compte maintenant**. Le contraste « apparaît dans la meilleure suite, pas dans les moins bonnes »
transforme un constat en **raison** : c'est ce concept-là qui explique pourquoi le meilleur coup est le meilleur.

---

## 2. Le niveau change le vocabulaire

Un plan de débutant n'est pas un plan de joueur à 2000. On définit trois niveaux de vocabulaire. Un
élève reçoit les concepts de son niveau, plus ceux du niveau précédent.

| Niveau | Elo indicatif | Horizon | Nature des plans |
|---|---|---|---|
| Débutant | moins de 1200 | 3 à 6 coups | un seul concept, très concret |
| Intermédiaire | 1200 à 1600 | 5 à 10 coups | un ou deux concepts enchaînés |
| Avancé | 1600 à 2000 et plus | 8 à 15 coups | plusieurs étapes, prophylaxie, transformation de structure |

**Tactique et plan restent séparés à tous les niveaux.** Pièce en prise, double attaque, clouage, mat du couloir :
c'est de la tactique, déjà traitée (et juste par construction) par le mode fiche. Les niveaux ci-dessus ne concernent
que les plans, c'est-à-dire les suites de coups calmes.

**Hors cible : le niveau expert (plus de 2000).** Sacrifices positionnels, transitions vers une finale, domination
des pièces adverses : notre coach vise les débutants, et ces plans ne se vérifient pas avec nos outils.

**La grille sera mesurée, pas décrétée.** Chaque position étiquetée porte l'Elo de la partie. Une fois l'étiquetage
terminé, on mesure pour chaque concept et chaque tranche d'Elo à quelle fréquence les joueurs jouent réellement le plan
que Stockfish voulait. Un concept que les joueurs à 1300 réussissent déjà est de leur niveau ; un concept que même les
joueurs à 1800 ratent est avancé. Le tableau ci-dessus est une hypothèse de départ que ces chiffres corrigeront.

---

## 3. Liste de départ : 15 concepts (plus 2 candidats)

Pour chaque concept, la colonne « État but » donne la condition vérifiable. La plupart des états buts sont déjà
détectés par le moteur de règles (`positional/`) ; ce qui manque, c'est de savoir **quand** ce concept est le plan.

### Débutant

| # | Concept | État but (vérifiable) | Base existante |
|---|---|---|---|
| 1 | Développer ses pièces | les pièces mineures ont quitté leur case de départ | `PIECE_NON_DEVELOPPEE` disparaît |
| 2 | Mettre son roi à l'abri | roque effectué, bouclier de pions intact | `ROQUE_EFFECTUE`, `PIONS_ROI_BOUCLIER` |
| 3 | Prendre le centre | contrôle des cases d4, e4, d5, e5 | `CONTROLE_CENTRE` |
| 4 | Échanger quand on est devant | avantage matériel conservé, moins de pièces | `AVANTAGE_MATERIEL` et nombre de pièces |
| 5 | Gagner une faiblesse | le pion faible, isolé ou arriéré adverse est pris | `PION_ISOLE`, `PION_ARRIERE`, `PION_FAIBLE` disparaissent par capture |

### Intermédiaire

| # | Concept | État but | Base existante |
|---|---|---|---|
| 6 | Tour sur colonne ouverte | une tour occupe et contrôle une colonne ouverte ou semi-ouverte | `TOUR_COLONNE_OUVERTE`, `CONTROLE_COLONNE` |
| 7 | Cavalier sur avant-poste | un cavalier est installé sur un avant-poste | `CAVALIER_AVANT_POSTE` |
| 8 | Créer et pousser un pion passé | un pion passé apparaît ou avance de 2 rangées ou plus | `PION_PASSE`, `PION_PASSE_PROTEGE` |
| 9 | Activer son roi en finale | le roi atteint le centre ou les pions adverses | phase de finale et position du roi |
| 10 | Attaquer le roi | bouclier adverse affaibli, pièces proches du roi adverse | `PIONS_ROI_AFFAIBLI`, à compléter |
| 10 bis | Bloquer un pion faible | un cavalier ou un fou s'installe juste devant un pion adverse isolé, arriéré, faible ou passé (souvent le précurseur de l'avant-poste) | faits de pions et occupant de la case de blocage |

### Avancé

| # | Concept | État but | Base existante |
|---|---|---|---|
| 10 ter | Affaiblir la structure adverse | une faiblesse nouvelle apparaît chez l'adversaire (pions doublés, isolés, arriérés, bouclier du roi) ; moyen noté : échange qui force une reprise de pion, ou poussée ; drapeau « avant le roque » | faits de pions et droits de roque (voir §8) |
| 11 | Rupture de pions | un levier de pions ouvre une colonne ou libère une chaîne | à écrire (levier puis colonne ouverte) |
| 12 | Attaque de minorité | les pions de l'aile dame avancent contre une majorité, créant une faiblesse | structure Carlsbad plus faiblesse créée |
| 13 | Échanger son mauvais fou | le mauvais fou disparaît contre une pièce adverse | `FOU_MAUVAIS` disparaît par échange |
| 14 | Prophylaxie | le plan adverse le plus probable devient impossible ou perd sa valeur | activation du détecteur adverse qui chute — **reporté** après la première expérience (état but difficile à définir de façon symbolique) |
| 15 | Transformer un avantage | un avantage (matériel, espace) devient un autre, plus durable (pion passé, faiblesse fixée) | combinaison de 4, 5 et 8 |
| 16 | Paire de fous dans une position qui s'ouvre | un camp garde ses deux fous contre fou et cavalier ou deux cavaliers, et des pions centraux disparaissent (colonnes et diagonales qui s'ouvrent) | nombre de fous et structure centrale — candidat |
| 17 | Affaiblir un complexe de cases | après une poussée de pion (g3, g6, f6…), des cases d'une couleur autour du roi adverse ne sont plus défendues par un pion, et le fou de cette couleur a disparu | cartes de contrôle des cases et fous restants — candidat, prolonge 10 ter |

La liste est un point de départ. Elle sera révisée selon ce que les données montrent.

---

## 4. Fabriquer les étiquettes sans LLM ni humain

Pour chaque position tirée de vraies parties (base publique de Lichess) :

1. **Stockfish** donne ses 3 meilleures suites (multipv 3, profondeur 16) ; on en exploite jusqu'à 24 demi-coups.
2. Le **moteur de règles** relève, pour chaque concept, s'il **apparaît** le long de chaque suite, pour chaque camp.
3. **Étiquette positive** « le concept C est le plan du camp X » si les trois conditions suivantes sont réunies :
   - C apparaît dans la meilleure suite pour X ;
   - C y est encore présent à la fin ;
   - C n'apparaît pas dans les suites qui valent au moins 0,3 pion de moins.

   Le contraste porte sur l'**apparition du concept** le long des suites, pas sur leur premier coup. Deux suites à peu près
   équivalentes qui mènent au même concept par des ordres de coups différents (transpositions) **renforcent** l'étiquette
   positive : elles ne sont pas une raison d'exclure la position. On n'exclut que les positions où des suites équivalentes
   mènent à des concepts **différents**.
4. **Étiquette négative** si C est possible (les ingrédients sont là) mais n'apparaît pas dans la meilleure suite.
5. On garde aussi l'**horizon** (à quel demi-coup C apparaît) et l'**Elo des joueurs** de la partie, pour les niveaux.

Tout est calculé, reproductible, et vérifiable position par position.

---

## 5. Les petits réseaux

- **Entrée** : l'échiquier codé en 12 plans de 8×8 (une couche par type de pièce et par couleur), plus le trait et
  les droits de roque. **Deux variantes seront comparées** : l'échiquier seul, et l'échiquier plus le vecteur des faits
  du moteur de règles (structure de pions, cartes de contrôle des cases, colonnes, avant-postes). Avec ces faits, le
  réseau n'a pas à réapprendre la géométrie de l'échiquier et peut se concentrer sur la question « ce concept va-t-il
  devenir le plan ? ».
- **Un petit réseau par concept et par camp** (« mon plan » / « son plan ») : quelques couches, quelques centaines
  de milliers de paramètres, sortie = probabilité que ce concept soit le plan. On gardera plus tard l'option d'un
  tronc commun avec une tête par concept.
- **Pourquoi des réseaux et pas des règles** : les règles voient le présent ; un réseau entraîné sur des suites de
  Stockfish apprend à reconnaître, **avant** qu'il soit réalisé, qu'un concept va être le plan.

### De l'activation à l'explication

1. Les détecteurs allumés au-dessus d'un seuil donnent les concepts candidats, pour moi et pour l'adversaire.
2. Chaque candidat est **vérifié** en déroulant Stockfish : l'état but apparaît-il dans la meilleure suite ?
3. Les concepts vérifiés, filtrés par le niveau de l'élève, sont racontés par des phrases écrites par le code.
   Le LLM n'intervient pas, ou seulement comme voix contrôlée.
4. La mémoire des erreurs s'y branche : « dans ce type de position, tu passes souvent à côté du plan *colonne ouverte* ».

---

## 6. Première expérience (réfutable)

- **Concepts** : 6 (tour sur colonne ouverte), 7 (cavalier sur avant-poste), 10 bis (blocage), 11 (rupture de pions).
- **Contrôle visuel d'abord** : environ 1 000 positions étiquetées sont relues devant l'échiquier (planches avec la
  suite de Stockfish) pour vérifier que chaque étiquette correspond à l'intuition d'un joueur, avant tout entraînement.
- **Données** : 50 000 à 100 000 positions (milieux de partie), étiquetées sur le serveur, en plusieurs nuits de calcul.
- **Référence à battre** : nos règles actuelles (présence statique des ingrédients du concept), puis un modèle simple sur les faits du moteur de règles (§6 bis, test 3).
- **Critère de succès** : sur des positions jamais vues, le réseau prédit que Stockfish va jouer ce plan nettement
  mieux que la référence (AUC supérieure d'au moins 0,1).
- **Si c'est un succès** : on élargit aux 15 concepts et on branche l'explication.
- **Sinon** : on sait, pour pas cher, que cette voie ne suffit pas.

## 6 bis. Tests de rupture

Trois tests conçus pour faire échouer l'approche vite et pour pas cher (issus d'une relecture adverse). Chacun a
un critère d'échec écrit à l'avance.

**1. Horizon (positions fermées).** Un plan de position fermée (rupture f5-f4 dans l'Est-Indienne, f6 dans la
Française avance, attaque de minorité dans la structure Carlsbad) peut demander plus de 12 coups. Si le concept
n'apparaît pas dans les 24 demi-coups, le générateur ne produit rien : le risque est de **manquer** les plans lents
(faux négatifs), pas d'en inventer. Test : une série de positions de manuel au plan connu (`scripts/horizon-test.mjs`),
à 24 demi-coups puis à 48 en prolongeant la suite (Stockfish relancé depuis sa dernière position).
**Échec** : les plans attendus manquent même à 48 demi-coups. S'ils n'apparaissent qu'à 48, on prolonge les suites
dans le générateur avant tout entraînement.

*Premier résultat (28 septembre, 5 positions, `reports/horizon-test.txt`)* : plans attendus trouvés 3 fois sur 6 à
24 demi-coups, 4 sur 6 en prolongeant. Trois enseignements :
- **l'horizon réel est plus court que prévu** : à profondeur 16, la meilleure suite de Stockfish s'arrête d'elle-même
  vers 17 demi-coups en médiane (12 à 23 ; 9 % seulement atteignent 24). La prolongation est donc nécessaire ;
- **« encore présent en fin de suite » est trop strict** pour les pièces : dans la Pélikan, le cavalier va bien en d5
  au premier coup, puis il est échangé, et le plan n'est pas compté. Piste : exiger que le concept tienne un
  nombre minimal de demi-coups, plutôt que jusqu'à la fin ;
- **le plan de Stockfish n'est pas toujours celui des manuels** : dans la Française avance, il préfère le jeu à l'aile
  dame (Ca5-b3) à la rupture f6 dans les 20 premiers demi-coups. Ce n'est pas forcément une erreur de notre part.

**2. Fausse attribution (coups d'attente).** Quand la vraie raison du meilleur coup est prophylactique, un concept
peut apparaître par hasard plus loin dans la suite (une tour qui finit sur une colonne ouverte). L'étiquette est
vraie sur l'échiquier mais ce n'est pas la raison. Test : 50 planches vérifiées par concept, dont une part tirée
exprès parmi les positions où le premier coup de Stockfish est un coup de roi ou un petit coup de pion, relues par
un joueur de plus de 1800 Elo. **Échec** : plus de 30 % des planches jugées « ce n'est pas le plan ».

**3. Le réseau doit battre une vraie référence.** Le réseau ne reconnaît pas un concept (les règles le font par
définition) : il prédit qu'il **deviendra** le plan. La référence « ingrédients présents » est trop faible. Nouvelle
référence : un modèle simple et classique (arbres de décision à gradient) entraîné sur les faits du moteur de
règles. **Échec** : le réseau ne bat pas ce modèle simple ; on garde alors règles plus modèle simple, plus facile à
expliquer. Complément, **tests contrefactuels** : déplacer la tour d'une case, retirer le pion de levier, changer une
pièce sans toucher la structure ; la probabilité du réseau doit réagir dans le bon sens, sinon il a appris une fausse
corrélation.

**Ordre** : l'horizon d'abord (une heure, sans attendre la fin de l'étiquetage), puis la référence et les tests
contrefactuels avec l'entraînement, puis la relecture par un joueur fort dès qu'un relecteur est disponible.

## 7. Risques connus

- **Qualité des étiquettes** : les états buts détectés par nos règles peuvent être imparfaits. Une règle fausse
  apprend un concept faux. Les relectures devant l'échiquier restent indispensables.
- **Horizon** : 24 demi-coups de Stockfish ne montrent pas toujours un plan de 15 coups ; risque de faux négatifs
  pour les plans lents (attaque de minorité, roi actif, transformation d'avantage). Piste : prolonger la suite en
  relançant Stockfish depuis sa dernière position, ou adapter la longueur au concept.
- **Suites équivalentes** : quand trois coups se valent, le contraste disparaît ; ces positions seront exclues ou marquées.
- **Niveaux** : le plan optimal selon Stockfish n'est pas toujours enseignable à un débutant. L'Elo des parties
  servira à étudier ce que les joueurs de chaque niveau réussissent réellement.

## 8. Plans à étages et émergence

### Un plan a plusieurs étages

Un vrai plan ne se réduit pas à « quoi faire ». Exemple d'entraîneur : *fragiliser la structure de pions adverse
à l'aile roi avant que l'adversaire roque, par une poussée de pions ou par un échange qui l'oblige à reprendre avec
un pion ; ce déséquilibre dicte ensuite la stratégie* (garder son roi au centre, attaquer sur la colonne ouverte, viser
les pions doublés…). On distingue donc trois étages :

1. **Le moyen** : poussée de pions, échange de pièce légère ou lourde, manœuvre.
2. **Le déséquilibre créé** : faiblesse de structure, roi privé d'abri, paire de fous, colonne, pion passé…
3. **L'exploitation** : la stratégie que ce déséquilibre rend juste.

Le concept 10 ter (« affaiblir la structure adverse ») modélise les étages 1 et 2 de façon vérifiable : le moyen est
identifié automatiquement (échange ou poussée) et le moment est noté (l'adversaire pouvait-il encore roquer du côté
affaibli ?). L'étage 3 demande un horizon plus long (prolongation des suites, §7).

### Laisser les plans émerger

Jusqu'ici, c'est nous qui écrivons les concepts : on ne trouve que ce qu'on sait déjà nommer. L'émergence inverse le
sens : **les données proposent des plans, l'humain les nomme et les valide.**

1. **Signature de la meilleure suite.** Pour chaque position, on relève coup par coup, et pour chaque camp, TOUS les
   faits du moteur de règles qui apparaissent ou disparaissent le long de la meilleure suite, dans l'ordre, et en quoi
   ils diffèrent des suites moins bonnes. Exemple : « échange fou contre cavalier → pions doublés adverses à l'aile
   roi → roi adverse au centre → tour et dame sur la colonne g ».
2. **Recherche de motifs.** Sur des centaines de milliers de positions : quels enchaînements reviennent souvent ET
   distinguent la meilleure suite des moins bonnes ? Recherche de motifs séquentiels et regroupement de signatures,
   sans LLM.
3. **Plans candidats.** Chaque enchaînement fréquent et discriminant devient un plan candidat (moyen → déséquilibre →
   exploitation), accompagné de ses exemples réels.
4. **Validation humaine sur planches** : vrai plan (nommé), bruit, ou plan jamais formulé mais juste.

Tout repose sur les suites enregistrées par le générateur : l'analyse ne demande que du calcul, pas de Stockfish en plus.

**Limites** : beaucoup de motifs seront triviaux (« il roque ») ou du bruit ; on ne découvre que des plans dont les
étapes sont visibles par le moteur de règles (d'où l'intérêt de l'enrichir) ; l'horizon limite les plans très lents.

**Première exploration** (en parallèle de l'expérience du §6), à partir d'environ 50 000 positions : extraire les
20 enchaînements les plus fréquents et les plus discriminants, avec planches, et juger si de vrais plans en sortent.

## 9. État d'avancement (28 septembre 2026)

**Génération des étiquettes** : en cours sur le serveur (Stockfish profondeur 16, 3 moteurs à un fil, environ
7 500 positions par heure). 80 000 positions faites sur un objectif de 400 000, fin prévue le 30 septembre.

**Vérification des exemples positifs** (`scripts/verify-labels.mjs`). Deux filtres s'ajoutent à l'étiquetage du §4 :

1. **Suite calme** : jusqu'à l'apparition du concept, le matériel reste le même aux points calmes (échanges
   équilibrés permis, pas de gain ni de sacrifice) ; une tour posée par le roque ne compte pas.
2. **Stabilité** : le concept doit réapparaître, calmement, dans une recherche plus profonde (profondeur 18).

Premier lot (48 952 positions, 23 595 positifs bruts) :

| Concept | Vérifiés | Rejetés : tactique | Rejetés : instable |
|---|---|---|---|
| Tour sur colonne ouverte | 1 180 / 6 223 | 3 701 | 1 342 |
| Affaiblir la structure adverse | 1 400 / 9 003 | 5 608 | 1 995 |
| Rupture de pions | 777 / 4 989 | 3 005 | 1 207 |
| Blocage d'un pion faible | 156 / 2 129 | 1 315 | 658 |
| Cavalier sur avant-poste | 104 / 1 251 | 691 | 456 |

Environ 15 % des positifs bruts survivent ; la plupart des rejets sont des suites tactiques, ce que le filtre doit écarter.
Contrôle visuel (3 séries de planches) : rupture et tour sur colonne correspondent à l'intuition dans 9 à 10 cas sur 10.

**Prochaines étapes**

1. Planches sur les exemples vérifiés (dont les premiers avant-postes).
2. Premiers réseaux (tour sur colonne, rupture, affaiblir), comparés aux règles (critère du §6), sur le processeur
   du serveur ; l'entraînement passera sur une carte graphique (RTX 5070 Ti) dès qu'elle sera disponible.
3. Outil d'émergence (§8) sur les suites enregistrées.

## Références

- T. McGrath et al., « Acquisition of chess knowledge in AlphaZero », *PNAS*, 2022 : des concepts humains se lisent
  dans le réseau d'AlphaZero.
