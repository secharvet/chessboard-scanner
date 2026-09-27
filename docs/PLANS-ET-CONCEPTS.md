# Plans et concepts : définitions et protocole

Document de travail, septembre 2026. Il fait suite au bilan des essais « LLM stratège ». Un LLM se trompe
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

---

## 3. Liste de départ : 15 concepts

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

### Avancé

| # | Concept | État but | Base existante |
|---|---|---|---|
| 11 | Rupture de pions | un levier de pions ouvre une colonne ou libère une chaîne | à écrire (levier puis colonne ouverte) |
| 12 | Attaque de minorité | les pions de l'aile dame avancent contre une majorité, créant une faiblesse | structure Carlsbad plus faiblesse créée |
| 13 | Échanger son mauvais fou | le mauvais fou disparaît contre une pièce adverse | `FOU_MAUVAIS` disparaît par échange |
| 14 | Prophylaxie | le plan adverse le plus probable devient impossible ou perd sa valeur | activation du détecteur adverse qui chute |
| 15 | Transformer un avantage | un avantage (matériel, espace) devient un autre, plus durable (pion passé, faiblesse fixée) | combinaison de 4, 5 et 8 |

La liste est un point de départ. Elle sera révisée selon ce que les données montrent.

---

## 4. Fabriquer les étiquettes sans LLM ni humain

Pour chaque position tirée de vraies parties (base publique de Lichess) :

1. **Stockfish** donne ses 3 meilleures suites (multipv 3), de 12 à 16 demi-coups chacune.
2. Le **moteur de règles** relève, pour chaque concept, s'il **apparaît** le long de chaque suite, pour chaque camp.
3. **Étiquette positive** « le concept C est le plan du camp X » si les trois conditions suivantes sont réunies :
   - C apparaît dans la meilleure suite pour X ;
   - C y est encore présent à la fin ;
   - C n'apparaît pas dans les suites qui valent au moins 0,3 pion de moins.
4. **Étiquette négative** si C est possible (les ingrédients sont là) mais n'apparaît pas dans la meilleure suite.
5. On garde aussi l'**horizon** (à quel demi-coup C apparaît) et l'**Elo des joueurs** de la partie, pour les niveaux.

Tout est calculé, reproductible, et vérifiable position par position.

---

## 5. Les petits réseaux

- **Entrée** : l'échiquier codé en 12 plans de 8×8 (une couche par type de pièce et par couleur), plus le trait et
  les droits de roque. On peut ajouter en option le vecteur des faits du moteur de règles.
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

- **Concepts** : 6 (tour sur colonne ouverte), 7 (cavalier sur avant-poste), 11 (rupture de pions).
- **Données** : 50 000 à 100 000 positions (milieux de partie), étiquetées sur le serveur, en plusieurs nuits de calcul.
- **Référence à battre** : nos règles actuelles (présence statique des ingrédients du concept).
- **Critère de succès** : sur des positions jamais vues, le réseau prédit que Stockfish va jouer ce plan nettement
  mieux que la référence (AUC supérieure d'au moins 0,1).
- **Si c'est un succès** : on élargit aux 15 concepts et on branche l'explication.
- **Sinon** : on sait, pour pas cher, que cette voie ne suffit pas.

## 7. Risques connus

- **Qualité des étiquettes** : les états buts détectés par nos règles peuvent être imparfaits. Une règle fausse
  apprend un concept faux. Les relectures devant l'échiquier restent indispensables.
- **Horizon** : 12 à 16 demi-coups de Stockfish ne montrent pas toujours un plan de 15 coups.
- **Suites équivalentes** : quand trois coups se valent, le contraste disparaît ; ces positions seront exclues ou marquées.
- **Niveaux** : le plan optimal selon Stockfish n'est pas toujours enseignable à un débutant. L'Elo des parties
  servira à étudier ce que les joueurs de chaque niveau réussissent réellement.

## Références

- T. McGrath et al., « Acquisition of chess knowledge in AlphaZero », *PNAS*, 2022 : des concepts humains se lisent
  dans le réseau d'AlphaZero.
