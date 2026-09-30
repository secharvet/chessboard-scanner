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
| 17 | Dominer une couleur de cases | plan à étages (formulation de l'auteur) : l'adversaire est faible sur une couleur (au moins deux trous) ; **moyen** : je prends son fou de cette couleur en gardant le mien ; **déséquilibre** : `COMPLEXE_FAIBLE` adverse « avec fou ennemi » apparaît et tient ; **exploitation** (à venir) : mes pièces et mon attaque s'installent sur cette couleur | `COMPLEXE_FAIBLE` (couleur, trous, fou ennemi) — étages 1 et 2 codés (`dominer`) |

La liste est un point de départ. Elle sera révisée selon ce que les données montrent.

---

## 3 bis. Une grammaire plutôt qu'une liste : moyens, déséquilibres, recettes

**État des lieux (29 septembre).** Six concepts codés comme plans (tour sur colonne, cavalier sur avant-poste,
blocage, rupture, affaiblir, dominer une couleur), onze listés au §3 sans code, une cinquantaine de faits du moteur
de règles comme ingrédients. La théorie (Steinitz, Nimzowitsch, Pachman, Silman, Soltis, Dvoretsky) nomme **50 à
60 plans** ; ce qui manque, par famille :

| Famille | Chez nous | Manquant ou incomplet |
|---|---|---|
| Pièces lourdes | tour sur colonne | doublement des tours, tour à la 7e, tour derrière le pion passé, dame centralisée, levée de tour |
| Pièces mineures | avant-poste, dominer une couleur, blocage | échanger le mauvais fou, fou contre cavalier selon la structure, paire de fous et ouverture du jeu, reroutage d'un cavalier, « la pire pièce d'abord » |
| Structure de pions | rupture, affaiblir, blocage | attaque de minorité, avance de la majorité, création du pion passé, fixation des pions adverses, sape de la base d'une chaîne, pions pendants, plans du PDI, gain d'espace |
| Roi | affaiblir avant le roque, complexe faible près du roi | tempête de pions sur roques opposés, attaque h4-h5 contre le fianchetto, échange du défenseur clé, ouverture de lignes vers le roi, roi actif en finale |
| Dynamique | — | initiative et tempo, ouvrir quand on est mieux développé, fermer sinon, contre-attaque au centre face à une attaque de flanc, sacrifice positionnel |
| Défense | — | simplification quand on est devant, échange des pièces attaquantes, blocus d'un pion passé, prophylaxie, forteresse |
| Finale | — | activation du roi, pion passé éloigné, majorité, coupure du roi adverse, opposition |
| Par structure (Soltis) | Carlsbad, PDI, chaînes Est-indienne et Française reconnues | les 2 ou 3 plans canoniques de chaque structure, par camp |

**Granularité : les plans nommés sont composites.** Décomposés, ils ont tous la même grammaire (§8) :
- *attaque de minorité* = levier b4-b5 → pion c6 faible ou colonne b ouverte → tours sur c6 ;
- *attaque à la baïonnette* = levier h4-h5 → bouclier du roi brisé → pièces sur la colonne h ;
- *dominer une couleur* = échange du fou → complexe faible → pièces sur ces cases ;
- *pion passé éloigné* = échanges → majorité → poussée → pion passé → roi adverse attiré.

Le vocabulaire atomique est petit :
- une douzaine de **moyens** (opérations, événements le long de la partie) : échange (quelle pièce contre laquelle),
  levier, poussée de gain d'espace, manœuvre d'une pièce vers une case, occupation d'une colonne ou d'une rangée,
  doublement, roque, marche du roi, sacrifice de pion ;
- une vingtaine de **déséquilibres** (faits qui apparaissent ou disparaissent) : colonne ouverte, pion faible,
  avant-poste, complexe faible, bouclier brisé, pion passé, paire de fous, roi au centre, espace…

Les plans de la théorie sont des **recettes** sur ce vocabulaire, nommées après coup, comme Nimzowitsch a nommé ce
que les forts joueurs faisaient déjà. Décisions :
1. détecter les **atomes** (moyens comme événements, déséquilibres comme faits) plutôt qu'ajouter des concepts
   monolithiques ; il manque comme moyens : manœuvre, poussée d'espace, doublement, sacrifice ;
2. écrire chaque plan nommé comme une **recette** (triplet avec contraintes de proximité, comme le levier voisin de
   la colonne qu'il ouvre) ; six existent, une quarantaine tiennent en quelques lignes chacune ;
3. laisser l'**émergence** (§8) proposer les recettes non nommées, sur les parties humaines ;
4. adapter la granularité au niveau : l'atome au débutant (« mets ta tour sur la colonne ouverte »), la recette à
   l'intermédiaire, la recette avec sa condition et sa prophylaxie à l'avancé.

Pour les réseaux : prédire les **déséquilibres visés** (une vingtaine de sorties, chacune bien fournie) plutôt que
les recettes (soixante, dont la moitié rares) ; la recette se reconstitue symboliquement.

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

## 4 bis. Source humaine : chercher les plans là où il y a des intentions

Objection de l'auteur (29 septembre) : Stockfish ne fait pas de plan, il calcule ; sa meilleure suite est un
sous-produit de la recherche, et y « reconnaître » un plan revient souvent à lire une intention là où il n'y a qu'un
ordre de coups qui change avec la version du moteur (§7, dépendance au moteur : avec l'accord de deux moteurs exigé,
**18 positifs sur 191** survivent sur 400 positions, 9 %). Un plan est une idée humaine qui résume et donne sens à une suite de coups : un déplacement,
une configuration, voulus.

**Inversion des rôles.** Les intentions se trouvent dans les parties humaines (Lichess, Chess.com : des milliards de
parties, avec l'Elo des deux joueurs ; le blitz convient, le bruit se filtre) ; Stockfish ne décide plus, il **juge**.

1. **Détection dans les coups réellement joués** : depuis chaque position, les 24 demi-coups suivants de la partie
   passent par le même `scanLine` (mêmes concepts, agentivité, tenue, suite calme).
2. **Jugement** : Stockfish évalue la position de départ et celle où le concept apparaît (après la réponse adverse).
   Le plan a **tenu** si l'évaluation du joueur n'a pas baissé de plus de 0,3 pion ; sinon il a été **réfuté**.
   C'est la mesure « l'avantage se dirige vers nous » qui n'avait pas de sens le long d'une suite de moteur
   (évaluation constante par construction) et qui en a le long d'une partie humaine.
3. **Ce que devient l'étiquette** : « à ce niveau, les humains font ce plan ici, et il tient ». C'est le plan
   enseignable de la grille par Elo (§2), et il ne dépend plus des manies d'une version : évaluer une séquence fixe
   de coups joués est bien plus stable que choisir une suite.
4. **Coût** : deux évaluations à profondeur 12 par position, au lieu de trois suites prolongées.

Les suites de Stockfish gardent deux rôles : le plan vérifié dans le coach (« ce plan est-il bon *ici* ? », avec
l'accord de deux moteurs), et une seconde source d'étiquettes, marquée comme telle. Générateur :
`scripts/label-human.mjs`, sortie `data/labels/human-*.jsonl`.

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

*Après corrections (suites prolongées à 48 demi-coups, concept tenu 6 demi-coups au lieu de « jusqu'à la fin »),
12 positions* : 7 plans sur 13 à 24 demi-coups, **9 sur 13** à 48. Les 4 manqués :
- Française avance : Stockfish joue h4-h5 puis f4-f5 pour les Blancs, pas de f6 noir dans sa suite ;
- Pélikan : le cavalier va en d5, mais Stockfish abandonne lui-même l'appui du pion e4 deux coups plus tard (exf5) ;
- Najdorf : notre position de test mène à une suite tactique (Cd5 Cxe4) ; cas de test mal choisi ;
- Benoni : la poussée b5 est jouée, mais notre définition de rupture exige une colonne utilisée par une tour ou une
  faiblesse créée ; b5 gagne de l'espace et prépare c4. **La définition de la rupture est trop étroite.**

*Essai d'une « rupture d'espace » (28 septembre, écarté)* : compter aussi une rupture quand, après le levier, le camp
pousse un pion voisin dans le camp adverse. La Benoni est alors trouvée (b5 puis c4), mais sur 800 positions les
exemples positifs de rupture augmentent de 28 %, et les exemples nouveaux relus sont surtout du bruit : poussées de
pions passés en finale, 30 à 45 demi-coups après un levier sans rapport. Définition écartée ; à reprendre avec des
garde-fous (milieu de partie, pion non passé, poussée proche du levier) si d'autres cas manqués le justifient.

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
- **Dépendance au moteur** (mesurée le 29 septembre) : sur 60 plans étiquetés avec Stockfish 17.1 (profondeur 16,
  stables à 18), Stockfish 19 à la même profondeur ne remet le concept dans sa meilleure suite que 34 fois et ne
  redonne un plan positif que 17 fois ; Stockfish 17.1 rejoué redonne 54 sur 60 (déterminisme). Une part des
  « plans » est donc une manie d'une version du moteur, pas une propriété de la position. **Règle adoptée** : un
  plan ne compte que si **deux moteurs différents** le trouvent (vérification des étiquettes et coach). Moins
  d'exemples, mais des plans qui tiennent.
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

**Génération des étiquettes** : en cours sur le serveur (Stockfish profondeur 16, 3 moteurs à un fil). 80 000
positions faites avant le test d'horizon (suites non prolongées, environ 7 500 positions par heure) ; depuis le
28 septembre, les suites sont prolongées à 48 demi-coups, et les 80 000 premières le sont après coup
(`scripts/extend-labels.mjs`).

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

**Moteur** : Stockfish 19 officiel (BMI2/AVX2) depuis le 28 septembre au soir, à la place du paquet Ubuntu 17.1
(SSE2). Au banc mono-fil, 1,8 fois plus de nœuds par seconde ; en production (4 moteurs sur 4 vCPU, profondeur 16
fixe), le gain réel est modeste : génération 2 300 positions/h (inchangé), prolongation 1 600/h (+16 %). Une
profondeur nominale coûte plus de nœuds dans la version 19, et les vCPU partagent leurs unités de calcul. On garde
la 19 (plus forte, même coût) ; chaque enregistrement porte le nom du moteur.

**Plan vérifié dans le coach** (29 septembre, `coach/plans.mjs`) : en mode fiche, les suites du moteur sont
prolongées à 24 demi-coups, chaque concept passe par `planLabel` (horizon 12 demi-coups ; quand aucune suite n'est
nettement moins bonne, cas fréquent en direct, le **consensus** de toutes les suites équivalentes vaut contraste), et
la fiche écrit « Ton plan (vérifié …) » et « son plan est de … » (prophylaxie). Sur le banc de 16 positions (débuts,
pièges, finales), le plan ne sort que dans 1 réponse : le banc ne mesure pas ce module, il faudra un banc de
milieux de partie tirés des étiquettes vérifiées. Rappel sur 60 plans étiquetés : 20 % avec Stockfish 19 seul,
cause identifiée ci-dessus (§7, dépendance au moteur) ; le coach exige désormais l'accord des deux moteurs.

**Chaîne d'entraînement prête** (`scripts/build-dataset.mjs`, `scripts/train-plans.py`) : étiquettes recalculées
depuis les suites, 4 modèles comparés sur des parties jamais vues (règle linéaire sur les faits, arbres de décision
sur les faits, petit réseau sur l'échiquier seul, réseau avec les faits). Essai sur 7 900 positions : la chaîne
fonctionne ; les AUC (0,55 à 0,62) ne veulent encore rien dire, faute de positifs (moins de 50 en test).

**Tests contrefactuels prêts** (`scripts/counterfactuals.mjs`, `scripts/score-counterfactuals.py`) : pour chaque
exemple positif, une variante « tuer » (l'ingrédient du concept retiré : pion de levier, fou de la couleur conquise,
colonne rebouchée, pièce mineure à installer) et une variante « neutre » (un pion de bord avance). Sur les modèles de
l'essai : le réseau « échiquier seul » ne bouge pas d'un millième dans les deux cas (il n'a rien appris, sortie
constante) ; le réseau avec faits baisse dans 22 % des cas pour la rupture. Critère pour jeudi : baisse nette
(Δ ≤ -0,10) dans la majorité des cas « tuer », stabilité (|Δ| < 0,05) dans la majorité des cas « neutre ».

**Effet de bord de la prolongation : le contraste s'effondre pour les concepts fréquents.** Sur 1 500 positions,
en passant de 24 à 48 demi-coups :

| Concept | Dans la meilleure suite | Contraste réussi | Présent dans les 3 suites |
|---|---|---|---|
| Tour sur colonne ouverte | 1 099 → 1 574 | 147 → **74** | 506 → 1 153 |
| Affaiblir la structure | 1 249 → 1 875 | 280 → **221** | 425 → 1 003 |
| Rupture de pions | 567 → 756 | 171 → 199 | 115 → 214 |
| Blocage | 184 → 312 | 98 → 146 | 17 → 26 |
| Cavalier sur avant-poste | 99 → 175 | 57 → 92 | 7 → 9 |

Sur 24 coups, une tour finit presque toujours sur une colonne ouverte, quelle que soit la suite : ce n'est plus un
plan, c'est inévitable. Les concepts rares, eux, gagnent 16 à 60 % d'exemples. Piste : un **contraste de tempo**, le
concept apparaît dans la meilleure suite au moins 8 à 12 demi-coups plus tôt que dans les suites moins bonnes
(« c'est le moment »). Il rend 206 à 254 exemples de tour sur colonne et 382 à 462 d'affaiblissement.

*Décision (28 septembre, planches tempo série 1, 20 exemples que le strict rejette)*. Deux règles retenues :
- **le prix est borné** (idée de l'auteur : si la suite est longue, l'écart d'évaluation n'est pas attribuable au
  concept) : pour un exemple de tempo, le concept doit apparaître dans les 10 premiers demi-coups ;
- **le tempo se décide concept par concept** (`CONTRAST` dans `coach/plan-concepts.mjs`). Tour sur colonne :
  aucune des planches qui passent la règle du prix n'est un vrai plan (une tour qui se pose sur une colonne
  semi-ouverte, c'est du développement ordinaire) ; contraste strict conservé. Affaiblir : 5 justes, 1 doute,
  2 bruit sur 8 (le bruit : la « faiblesse » créée était un pion isolé sur la bande pendant que le vrai plan était
  une attaque de pions) ; tempo adopté. Sur 1 500 positions : 82 exemples d'affaiblissement au lieu de 63.

Remarque sur « l'avantage doit se diriger vers nous » : le long de la meilleure suite, l'évaluation est constante par
construction ; ce qui se mesure, c'est l'écart entre suites (déjà le critère). « Enfermer le roi adverse » relève de
l'étage d'exploitation du §8 (un fait d'attaque doit suivre le déséquilibre) : à traiter avec les plans à étages.

**Plans humains, premières mesures** (29 septembre, 58 000 positions de janvier 2013, `scripts/human-grid.mjs`,
`reports/grille-elo-1.md`). Générateur à 34 000 positions par heure sur 4 processus.

1. *La fréquence des plans monte avec le niveau, pour tous les concepts.* Part des demi-positions où le joueur
   réalise le plan par une suite calme, de < 1200 à 2000 + : tour sur colonne 10 → 22 %, affaiblir 9 → 17 %,
   rupture 6,6 → 11 %, blocage 1,4 → 3,5 %, cavalier sur avant-poste 0,5 → 3,1 %, dominer autour de 1 %.
   C'est la grille du §2 mesurée (réserve : la tranche < 1200 est petite, 1 574 demi-positions).
2. *La trajectoire d'évaluation mesure le joueur plus que le plan.* Témoin sur 24 demi-coups : un joueur à 2000 +
   gagne +104 centipions sans plan et +89 avec ; un joueur < 1200 perd −348 sans plan et −107 avec. Les forts
   gagnent quoi qu'ils fassent, et « sans plan » inclut les positions où l'adversaire déroule le sien. Isoler
   l'effet propre du plan demande une comparaison à niveau, évaluation de départ et plan adverse égaux : une étude,
   pas un seuil. Aucune règle de réfutation n'est écrite.
3. *Planches* (36, `reports/planches-humains-1`) : la détection correspond aux définitions (cavalier sur avant-poste
   central, Fxg6 hxg6 qui double les pions devant le roi, levier puis tour sur la colonne). Ce que les planches ne
   disent pas, c'est si l'idée était bonne : c'est la question 2.
4. *Étiquette retenue pour l'entraînement* : « ce joueur, à ce niveau, réalise ce plan ici » (suite calme, apparition
   avant le 12e demi-coup, règle du prix). Propre, abondante (des milliers d'exemples par concept, sauf dominer),
   indépendante de la version du moteur, graduée par niveau.

**Premier entraînement sur les plans humains** (29 septembre, 63 000 positions, parties de test jamais vues,
`reports/train-plans-humains-1.json`) :

| Concept | Positifs (test) | Règle linéaire | Arbres | Réseau échiquier | Réseau + faits |
|---|---|---|---|---|---|
| Tour sur colonne ouverte | 1 408 | 0,863 | 0,879 | 0,870 | **0,884** |
| Rupture de pions | 843 | 0,721 | 0,735 | **0,752** | 0,747 |
| Affaiblir la structure | 1 173 | 0,658 | 0,666 | 0,645 | **0,671** |
| Blocage | 164 | 0,698 | **0,717** | 0,623 | 0,706 |
| Cavalier sur avant-poste | 111 | 0,736 | 0,743 | 0,673 | **0,784** |

(AUC ; le hasard vaut 0,5.) Trois lectures :
1. **L'intention humaine se prédit depuis la position seule** : 0,67 à 0,88 d'AUC selon le concept, alors que la
   voie « suites de moteur » n'avait rien donné (0,55 à 0,62 sur des étiquettes fragiles). Les étiquettes humaines
   portent un signal réel et régulier.
2. **Les réseaux ne battent pas les arbres** au seuil fixé (+0,02), sauf sur le cavalier sur avant-poste (+0,04
   pour le réseau avec faits) ; le réseau échiquier seul gagne de peu sur la rupture. Conformément au §6 bis : la
   référence « règles + arbres » est retenue comme modèle de production, les réseaux restent une option pour les
   concepts à forte composante géométrique.
3. **Le signal dépend du concept** : la tour sur la colonne ouverte est presque déterminée par la position (0,88),
   l'affaiblissement de la structure l'est peu (0,67) : c'est un choix, pas une conséquence.

*Contrefactuels sur ces modèles* (300 triplets par concept ; « tuer » = ingrédient retiré, « neutre » = pion de bord
avancé) : le réseau avec faits baisse nettement (Δ ≤ −0,10) dans **57 %** des cas « tuer » pour la rupture, **56 %**
pour l'avant-poste, 49 % pour l'affaiblissement, 25 % pour le blocage, et reste stable dans 74 à 83 % des cas
« neutre » ; le réseau échiquier seul réagit deux à trois fois moins (il a appris des corrélations plus diffuses).
Les modèles ont donc bien appris, au moins en partie, l'ingrédient du concept et non un décor. Limite : la variante
« tuer » de la tour sur colonne (reboucher la colonne de la tour actuelle) ne vise pas la bonne colonne quand la tour
n'y est pas encore ; à refaire avec la colonne cible.

**Émergence sur les parties humaines, première passe** (29 septembre, 8 200 positions avec atomes,
`scripts/emergence-humain.mjs`, `reports/emergence-humain-1.md`). Trois familles de motifs sortent :
- des **liens de définition** (levier → échange de pions, levier → rupture, échange fou-contre-cavalier → affaiblir) :
  le même événement vu deux fois ; sans intérêt, mais ils valident la chaîne ;
- des **pertes** (perte de pion → n'importe quoi, Δ24 autour de −400) : le blitz ;
- des **candidats recettes**, fréquents et bien au-dessus de la référence de dérive : gain d'espace au centre puis
  échange de pions (+259, n = 75), échange cavalier-contre-fou puis petit roque (+176), manœuvre de cavalier puis
  doublement des tours (+172), échange de cavaliers puis levier à l'aile roi (+134, n = 104), tour sur colonne puis
  gain d'espace au centre (+165). À rejouer sur le volume complet (support ≥ 300) et à relire sur planches ; le Δ
  reste un indice (il mesure aussi le joueur).

**Catalogue de la théorie et nommage des motifs** (`coach/recettes.mjs`, 30 recettes à ce jour, écrites dans le
vocabulaire des atomes avec leur source et leur niveau supposé). Chaque motif qui émerge est **reconnu** (sous-séquence
d'une recette), **voisin** (mêmes éléments à l'aile ou à la pièce près, plus proches voisins listés) ou **inconnu**.
Première passe sur 10 700 positions : les motifs fréquents sont presque tous reconnus (affaiblir par l'échange
fou-contre-cavalier, rupture centrale, ouvrir puis occuper la colonne, roquer puis échanger…). Parmi les voisins
bien au-dessus de la référence de dérive : *affaiblir puis cavalier sur avant-poste* (créer le trou, l'occuper,
+190, n = 68), *doubler puis tour à la 7e* (+161), *échange fou-contre-cavalier puis tour à la 7e* (+208) : des
recettes connues qui manquaient au catalogue, à y ajouter. Dans l'autre sens, **la couverture de la théorie par la
pratique** : part des demi-positions où chaque plan des livres est joué, par tranche d'Elo (le roi actif en finale
5 à 6 % partout ; la manœuvre puis doublement 0 % sous 1200, 5,8 % à 2000 + ; l'attaque de minorité 0,6 % à tous
les niveaux). À relire sur le volume complet.

**Réponses : « lui fait X, puis je fais Y »** (29 septembre, 45 900 positions avec atomes). L'émergence met les
événements des deux camps dans la même chronologie et ne garde que « lui : X → moi : Y ». Les réponses fréquentes
sont triviales (lever → prendre le pion ; manœuvre → manœuvre). Les « plus payantes » sont dominées par « → tour
à la 7e », qui est une **conséquence** d'une partie déjà gagnée, pas une réponse : le biais du Δ (§9) en plein.
Trois motifs méritent des planches : *lui : levier à l'aile roi → moi : gain d'espace à l'aile dame* (+161,
n = 386, la contre-attaque sur l'autre aile), *lui : levier au centre → moi : échange cavalier-contre-fou* (+176,
n = 377), *lui : marche du roi → moi : gain d'espace à l'aile dame* (+201, finales : le pion passé éloigné). Pour
voir de vraies réponses défensives il manque les **atomes de la défense** (§3 bis) : fermeture (poussée qui
verrouille), restriction et prophylaxie (un levier adverse possible ne l'est plus après mon coup), regroupement
(manœuvre vers mon roi quand des attaquants sont là), retour de matériel voulu. À écrire, avec les recettes
« réaction à » du catalogue (prophylaxie, surprotection, blocus, échanger l'attaquant, simplifier, fermer le flanc,
contre-attaque au centre, regroupement, forteresse).

**Entraînement sur le mois complet** (29 septembre au soir, 315 669 positions, Elo du joueur en entrée, négatifs
sous-échantillonnés à 5 par positif à l'entraînement, test complet ; `reports/train-plans-humains-2-*.json`) :

| Concept | Positifs (test) | Arbres | Réseau échiquier | Réseau + faits | Écart réseau − arbres |
|---|---|---|---|---|---|
| Tour sur colonne ouverte | 6 954 | 0,881 | 0,889 | **0,895** | +0,014 |
| Rupture de pions | 4 416 | 0,745 | 0,782 | **0,796** | **+0,051** |
| Affaiblir la structure | 6 262 | 0,687 | 0,693 | **0,714** | **+0,027** |
| Blocage | 906 | 0,762 | 0,746 | **0,770** | +0,008 |
| Cavalier sur avant-poste | 944 | 0,745 | 0,776 | **0,829** | **+0,084** |
| Dominer une couleur | 311 | 0,819 | 0,810 | **0,833** | +0,014 |
| Baïonnette (recette) | 125 | 0,927 | 0,980 | **0,983** | **+0,056** |

Avec cinq fois plus de données, **les réseaux décrochent les arbres sur 4 concepts sur 7** (seuil +0,02) et font au
moins jeu égal partout ; les arbres n'ont presque pas bougé depuis 63 000 positions (rupture 0,735 → 0,745), les
réseaux si (0,747 → 0,796). Réponse à la question du §6 : le volume profite aux réseaux, pas aux arbres. Règle de
production : par concept, le meilleur des deux ; le réseau échiquier seul reste la sonde des lacunes du moteur de
règles (là où il bat les arbres, il manque un fait). La baïonnette à 0,98 doit être relue : sa précondition
(fianchetto, roi roqué) est facile, l'AUC en profite.

*Contrefactuels* (400 triplets par concept) : réseau + faits, baisse nette dans **87 %** des cas « tuer » pour
l'avant-poste (cavalier retiré : Δ moyen −0,44), 46 % rupture, 43 % affaiblir, 35 % blocage, 28 % dominer ; stable
dans 69 à 86 % des cas « neutre ». La tour sur colonne attend sa variante « tuer » sur la colonne cible.

*Incident* : deux entraînements tués par le noyau (OOM, 6,4 et 6,8 Go sur 7,7, sans mémoire d'échange), la session
avec. Correctifs : échiquiers en octets, négatifs sous-échantillonnés, un processus par concept, 2 Go d'échange.
L'entraînement passe sur une machine GPU (`docs/MACHINE-GPU.md`) ; le VPS garde le site, le coach et l'étiquetage.

**Passes et largeur sur DENEB** (29 septembre au soir, mois complet, RTX 5070 Ti, ~6 minutes par table complète
contre plusieurs heures sur le VPS ; `reports/train-plans-gpu-1/2/3-*.json`). La table du mois complet est d'abord
reproduite à 8 passes sur le GPU (AUC à ±0,008 de la table du VPS : le matériel ne change pas les conclusions).
Puis deux variantes, réponse à la question « l'écart réseaux − arbres se creuse-t-il ? » : **non.**

| Concept | Réseau + faits, 8 passes | 10 passes | 10 passes, large (96 canaux, tête 256) |
|---|---|---|---|
| Tour sur colonne ouverte | 0,895 | 0,895 | 0,895 |
| Rupture de pions | 0,792 | 0,795 | 0,794 |
| Affaiblir la structure | 0,705 | 0,710 | 0,708 |
| Blocage | 0,770 | 0,773 | 0,765 |
| Cavalier sur avant-poste | 0,822 | 0,825 | 0,819 |
| Dominer une couleur | 0,835 | 0,841 | 0,825 |
| Baïonnette | 0,983 | 0,983 | 0,983 |

- **10 passes** : gain de +0,003 en moyenne, l'affaiblissement repasse le seuil (+0,024) ; les mêmes 4 concepts
  sur 7 restent au-dessus de +0,02 (rupture, affaiblir, avant-poste, baïonnette).
- **Le réseau large (1,76 M de paramètres contre 444 k) n'apporte rien** et perd sur les concepts rares
  (dominer 0,825 contre 0,841 ; blocage 0,765) : avec 1 000 à 2 300 positifs d'entraînement, la capacité en plus
  surapprend. À ce volume, la limite n'est ni la profondeur d'entraînement ni la taille du réseau : c'est le
  signal des étiquettes (et le nombre de positifs pour les concepts rares — le lot 2016 en apportera).
- Modèles retenus : les 10 passes en architecture d'origine (`plan-*.pt`, `plan-*-faits.pkl`) ; la variante large
  reste disponible par `train-plans.py --large` (drapeau enregistré dans le checkpoint et relu par
  `score-counterfactuals.py`), et l'entraînement garde les tenseurs sur la carte avec des lots de 1024.

**Sonde « échiquier seul » : ce que le réseau voit que les règles ne voient pas** (29 septembre au soir,
`scripts/sonde-echiquier.py` + `scripts/sonde-boards.mjs`, `reports/sonde-echiquier-complet.json`,
planches `reports/planches-sonde/`). Méthode : sur le jeu de test du mois complet, chaque positif est classé
par le réseau échiquier seul et par les arbres (rangs sur le jeu de test, les scores bruts n'étant pas
comparables) ; on retient les positifs où le réseau est très confiant (rang ≥ 0,85) et les arbres nettement
moins (écart de rangs ≥ 0,35), soit « l'échiquier porte un signal que les faits ne portent pas ».

| Concept | Positifs de test | Vus par l'échiquier seul, ratés par les arbres |
|---|---|---|
| Affaiblir la structure | 6 262 | 275 (4,4 %) |
| Rupture de pions | 4 416 | 171 (3,9 %) |
| Blocage | 906 | 48 (5,3 %) |
| Cavalier sur avant-poste | 944 | 42 (4,4 %) |
| Tour sur colonne ouverte | 6 954 | 20 (0,3 %) |
| Dominer une couleur | 311 | 8 |
| Baïonnette | 125 | 0 |

Les effectifs suivent les écarts d'AUC : là où le réseau bat les arbres, il y a des positions que les faits
n'expliquent pas ; pour la tour sur colonne et la baïonnette, les faits suffisent (cohérent avec l'AUC 0,98
« précondition facile » de la baïonnette). Relecture des planches (8 à 12 par concept) : trois faits statiques
manquent au moteur de règles, chacun étant la version « disponible maintenant » d'un moyen que nous ne
détectons aujourd'hui que comme événement le long de la suite :

1. **Le levier disponible** (rupture) : des pions à une case du contact, la tension prête (c6 + e6 face à d4
   → c5 ou e5 ; a4 contre b5). Le levier n'existe chez nous que comme atome-événement une fois joué ;
   aucun fait ne dit « une rupture est dans l'air ». Planches rupture-02, -03, -04.
2. **La route du cavalier** (avant-poste, blocage) : un cavalier à un ou deux bonds d'un trou déjà fixé par
   la structure (Ce4 + pion e5 → d6 ; Cc1 → d3 → c5 appuyé par b4 et d4). Nos faits nomment la case
   (`CASE_FAIBLE`, `AVANT_POSTE`) mais pas « une pièce peut l'atteindre sûrement en ≤ 2 coups » ;
   `coach/maneuvers.mjs` calcule déjà ces itinéraires, mais hors du vecteur de faits. Planches
   cavalier_avant_poste-01, -03, -04.
3. **L'échange abîmant disponible** (affaiblir) : une prise dont la reprise est forcée par un pion, surtout
   près du roi (Cxh6 gxh6, Cxe6 fxe6, Fxc3 bxc3). Même situation : l'échange est un atome-événement,
   pas un fait « cet échange est sur l'échiquier maintenant ». Planches affaiblir-01, -04, -05.

Biais transversal relevé : les positions de la sonde portent souvent `PIECE_MENACEE` et un déséquilibre
matériel — les arbres semblent traiter la poussière tactique et le matériel comme des contre-signaux alors
que le joueur déroule quand même son plan calme. À garder en tête, mais le remède est le même : donner aux
faits les trois « disponibilités » ci-dessus, réentraîner les arbres, et mesurer si l'écart réseau − arbres
se referme (c'est le critère de réussite de la sonde).

**Les trois disponibilités codées** (29 septembre au soir, `positional/disponibilites.js`, branché dans
`buildAllFacts`, 14 tests) : `LEVIER_DISPONIBLE` (poussée légale d'un pion qui attaquerait un pion adverse,
sans se faire prendre gratuitement sur la case d'arrivée), `ROUTE_CAVALIER` (un cavalier atteint en 1 ou 2
bonds sûrs un avant-poste à soi ou la case de blocage devant un pion adverse isolé, arriéré, faible ou passé ;
mêmes règles de sécurité que `coach/maneuvers.mjs`, restatées car `positional/` est du code navigateur et ne
peut pas importer `coach/`), `ECHANGE_ABIMANT` (une prise sans perte de matériel dont la seule reprise est un
pion, et chaque reprise possible crée pions doublés, pion isolé, ou dégarnit l'abri d'un roi d'aile).

**Critère écrit avant la mesure** (jeu de données reconstruit avec les nouveaux faits, réentraînement à
10 passes, mêmes découpages) :
- réussite si, sur les 4 concepts de la sonde (rupture, affaiblir, blocage, avant-poste), l'AUC des arbres
  gagne au moins +0,010 sur au moins 2 concepts, ET l'écart meilleur-réseau − arbres se referme d'au moins
  la moitié sur au moins 2 ;
- contrôle : tour sur colonne et baïonnette ne bougent pas (± 0,005) ;
- la sonde relancée sur les nouveaux modèles doit retenir au moins un tiers de positions en moins sur
  rupture et affaiblir ;
- ablation « sans faits tactiques » (arbres réentraînés sans CLOUAGE, CLOUAGE_RELATIF, DECOUVERTE_POSSIBLE,
  ENFILADE, FOURCHETTE, PIECE_MENACEE, PIECE_PIEGEE, RANGEE_FAIBLE, SURCHARGE) : mesure le biais
  « poussière tactique en contre-signal » relevé par la sonde ; informative, sans seuil.
Sinon, les disponibilités codées ne captent pas ce que le réseau voit, et on retourne aux planches.

**Résultat : critère atteint** (29 septembre, tard le soir ; jeu `humains-v3.jsonl`, mêmes étiquettes que v2,
seul le vecteur de faits change ; `reports/train-plans-gpu-4-dispos.json`, ablation `-gpu-5-sans-tactique.json`,
sonde `reports/sonde-echiquier-v3.json`) :

| Concept | Arbres v2 → v3 | Écart réseau − arbres v2 → v3 | Sonde v2 → v3 |
|---|---|---|---|
| Rupture de pions | 0,744 → **0,769** (+0,025) | +0,051 → +0,025 (−51 %) | 171 → 99 (−42 %) |
| Affaiblir la structure | 0,685 → **0,708** (+0,023) | +0,024 → +0,014 (−42 %) | 275 → 187 (−32 %) |
| Blocage | 0,756 → **0,779** (+0,023) | +0,017 → +0,007 (−59 %) | 48 → 19 (−60 %) |
| Cavalier sur avant-poste | 0,748 → **0,812** (+0,064) | +0,077 → +0,018 (−77 %) | 42 → 32 (−24 %) |
| Tour sur colonne (contrôle) | 0,881 → 0,882 | +0,013 → +0,017 | 20 → 16 |
| Dominer (contrôle) | 0,823 → 0,827 | +0,018 → +0,002 | 8 → 2 |
| Baïonnette (contrôle) | 0,934 → 0,937 | +0,049 → +0,045 | 0 → 0 |

- (a) **4 concepts sur 4** gagnent plus de +0,010 aux arbres (seuil : 2) — l'avant-poste gagne +0,064 à lui
  seul : la route du cavalier était l'essentiel de ce que le réseau voyait ;
- (b) l'écart se referme d'au moins la moitié sur **3 concepts sur 4** (seuil : 2) ;
- (c) la sonde retient −42 % sur la rupture (seuil : −33 %) et **−32 % sur affaiblir, un point sous le
  seuil** : il reste là un signal que `ECHANGE_ABIMANT` ne capte pas entièrement (planches à refaire sur
  les 187 restantes) ;
- ablation sans faits tactiques : les arbres perdent 0,001 à 0,015 selon le concept — la poussière tactique
  apporte un peu plus qu'elle ne coûte, le « contre-signal » vu par la sonde n'est pas un défaut net du
  vecteur ; on garde les faits tactiques.
Les réseaux, eux, n'ont presque pas bougé (cnn + f : rupture 0,795 → 0,794, affaiblir 0,710 → 0,722) :
les disponibilités ont surtout transféré aux arbres ce que l'échiquier montrait déjà aux réseaux.
C'est le cycle recherché : **le réseau échiquier seul trouve la lacune, la planche la nomme, le fait la
code, les arbres la récupèrent** — et le modèle de production reste explicable. Modèles de production :
v3, vecteur complet (`plan-*.pt`, `plan-*-faits.pkl`).

**Lot 2016 équilibré** : 250 000 parties de janvier 2016 (100 000 avec les deux joueurs < 1300, 100 000 > 1900,
50 000 entre, bullet exclu ; `scripts/filter-pgn.mjs`), étiquetage lancé le 29 septembre à 18 h 27 (Paris), avec
les atomes de la défense.

**Relecture critique du 29 septembre au soir (le document entier), décisions prises.** Neuf points, presque tous
justes ; les actions, par priorité :

1. **L'étiquette mesure ce que les humains font, pas ce qui est bon** (point décisif). Décision : calculer, pour chaque
   plan réalisé, la **perte en centipions des seuls coups du camp sur le segment du plan** (ACPL du camp, coup par
   coup contre la meilleure ligne), a posteriori sur les enregistrements existants (on a les coups joués), et
   retenir pour l'entraînement l'étiquette « plan réalisé **et bien joué** ». Écrire noir sur blanc : le modèle
   propose, Stockfish vérifie, le code explique ; *l'activation n'est pas l'explication*. — DENEB (calcul), VPS (doc).
   Spécification de la mesure (précisions du relecteur, adoptées) : (a) la perte de chaque coup se mesure en
   **espérance de score**, pas en centipions bruts (à ±6 pions un coup neutre « coûte » 200 cp) : convertir chaque
   évaluation en probabilité de gain par la formule de Lichess, `50 + 50 × (2 / (1 + exp(−0,00368208 × cp)) − 1)`,
   et soustraire dans cet espace ; (b) **deux seuils** : moyenne du segment sous X *et* aucun coup du camp au-dessus
   de Y (une gaffe au milieu, et le plan n'a pas « tenu ») ; X et Y se calibrent sur les 36 planches humaines déjà
   relues (`reports/planches-humains-1`), dont on sait si l'idée était bonne ; (c) coût : une recherche par coup du
   camp sur le segment (4 à 6 à profondeur 12), sur les positifs candidats seulement. Effet de bord : la grille par
   Elo passe de « réalise le plan » à « réalise **et réussit** le plan », la vraie question du §2.
2. **Jeu de test contaminé par la sonde** (les disponibilités ont été conçues sur les positifs du test) : le gain
   mesuré est optimiste. Reconfirmer sur le lot 2016, jamais utilisé ; désormais la sonde tourne sur la validation,
   jamais sur le test. — DENEB.
3. **Incertitude et métriques produit** : bootstrap sur le test et trois graines pour les AUC (±0,01 d'erreur-type
   avec 900 positifs : « +0,008 » n'est pas un résultat) ; précision au seuil d'exploitation, précision au premier
   plan par position, calibration. — DENEB.
4. **Grille par Elo conditionnelle** : rapporter P(plan | ingrédients présents) par tranche, les disponibilités
   servant de dénominateurs (levier disponible, route de cavalier, échange abîmant). — VPS.
5. **Consensus (coach) contre contraste (étiquettes)** : deux questions différentes (« bon ici » contre
   « distinctif »), à écrire ; et mesurer enfin la précision du plan vérifié sur planches (test 2 du §6 bis). — VPS.
6. **Le document** : séparer une spécification stable d'un journal daté ; réécrire l'introduction (la thèse réelle :
   intentions humaines, modèle qui propose, moteur qui vérifie, code qui explique, réseau échiquier comme sonde) ;
   inscrire l'échec des étiquettes moteur au §6 et le passage du critère +0,1 à +0,02 ; réconcilier §1 et §3 bis
   (l'état but est le déséquilibre, le moyen est ce qui manquait) ; assumer que **le débutant relève d'heuristiques**
   (concepts 1 à 4, déjà servis par la fiche) et que les plans appris commencent à l'intermédiaire ; dire quels
   critères de la sonde étaient bloquants ; renuméroter ; mettre en tête **la question produit : un débutant
   progresse-t-il quand on lui montre le plan ?** et une liste priorisée à la place des fronts ouverts. — VPS.
7. Noter la baisse du taux « tuer » des contrefactuels avec le volume (57 → 46 % rupture) ; régularisation par
   contrefactuels notée pour plus tard. Migrer les règles d'itinéraire dupliquées dans `positional/` (le coach peut
   l'importer, pas l'inverse). — DENEB.

**Lot 2016 étiqueté** (30 septembre, 10 h 30) : 250 000 parties, **670 796 positions** avec plan humain candidat
(2,7 par partie), sans incident ni recours à la mémoire d'échange ; atomes de la défense compris. Avec les 315 669
du mois 2013 : près d'un million de positions.

**Idée à venir (l'auteur, 30 septembre) : conditionner mon plan au plan adverse.** Aujourd'hui les deux camps sont
prédits indépendamment depuis la position ; la position contient le dispositif adverse, pas son intention. Deux
temps : (1) arbres conditionnels, P(mon plan | position, plan adverse prédit et son **stade** dans la recette : combien
d'atomes déjà joués, le troisième étage imminent vaut alarme), entraînés sur les plans adverses observés et
inférés sur les prédits, avec validation croisée pour éviter la boucle ; l'ACPL du camp dit quelles interruptions
étaient bonnes ; (2) si ça marche, un sélecteur de décision (continuer ou parer) jugé par le moteur, l'idée initiale
du sélecteur de stratégie, à condition de rester racontable via les recettes à étages. Après l'ACPL et 2016.

**Prochaines étapes** (mises à jour le 29 septembre au soir ; deux machines : le VPS étiquette et sert le coach,
DENEB (RTX 5070 Ti, `docs/MACHINE-GPU.md`) entraîne)

Sur DENEB :
1. ~~Reproduire la table du mois complet avec 10 passes, puis des réseaux plus larges (canaux 96, tête 256)~~ —
   fait (29 septembre au soir, voir ci-dessus) : l'écart ne se creuse pas, le réseau large surapprend les concepts
   rares ; modèles retenus = 10 passes, architecture d'origine.
2. ~~Réseau échiquier seul comme sonde~~ — fait (29 septembre au soir, voir ci-dessus) : trois faits manquent au
   moteur de règles, les « disponibilités » (levier disponible, route du cavalier vers le trou, échange abîmant
   disponible). Suite : les coder dans `positional/`, réentraîner les arbres, vérifier que l'écart se referme.
3. Contrefactuels complets, dont la variante « tuer » de la tour sur colonne sur la colonne cible (ajouter
   `tour_colonne_case` à la sortie de `scanLine`, à l'`extra` des étiquettes et au jeu de données).
4. Émergence à trois éléments et motifs triviaux filtrés (manœuvre ⇒ manœuvre) ; planches des candidats les plus
   solides (échange CxF ⇒ espace au centre ; il pousse à l'aile roi ⇒ espace au centre ; échange FxC ⇒ tour à la 7e).
5. Quand les étiquettes 2016 arrivent (rsync) : grille par Elo avec les débutants, entraînement v3, recettes
   défensives (atomes fermeture, restriction, regroupement).

Avant la prochaine grande session d'étiquetage (décidé le 29 septembre au soir) :
- **inventorier les concepts restants** : il en reste 20 à 30 à définir et à coder (voir la table du §3 bis et les
  recettes défensives), tous avec un état but vérifiable, avant de relancer un étiquetage massif ;
- l'étiquetage se fera **en duo** : le VPS (4 vCPU, ~34 000 positions/h) et DENEB (16 fils, 8 à 12 fois plus), sur
  des tranches disjointes du même PGN, fichiers fusionnés par `rsync` ; le même Stockfish 19 des deux côtés.

Sur le VPS :
6. Service local « intentions » (Python, modèles sur les faits) interrogé par le coach ; phrase « à ton niveau, le
   plan naturel ici… » et « il prépare souvent… » dans la fiche, derrière un drapeau, puis banc de milieux de partie.
7. Relire la baïonnette (AUC 0,98 suspecte : précondition facile).

## Références

- T. McGrath et al., « Acquisition of chess knowledge in AlphaZero », *PNAS*, 2022 : des concepts humains se lisent
  dans le réseau d'AlphaZero.
- L. Schut et al., « Bridging the human-AI knowledge gap: concept discovery and transfer in AlphaZero », 2023 : des
  concepts extraits de l'espace latent d'AlphaZero, jamais formulés par les humains, enseignés à des grands maîtres
  qui progressent. Preuve de principe de l'émergence (§8).
- M. Sadler et N. Regan, *Game Changer*, 2019 : les « plans » d'AlphaZero sont des récits humains a posteriori ; le
  moteur ne planifie pas, mais ces récits ont servi à la compréhension des joueurs. C'est l'objet pédagogique visé ici : une
  idée reconnaissable par un humain et vérifiée par le moteur.
