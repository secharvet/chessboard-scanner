# Plans et concepts : spécification

*Spécification stable du projet « plans et concepts » du coach d'échecs (dernière refonte : 30 septembre 2026).
Les mesures datées, les essais et les échecs sont dans `JOURNAL-PLANS.md` ; ce document ne garde que les
définitions, le protocole et les décisions en vigueur. Quand une décision change, elle est réécrite ici et l'ancienne
version reste lisible dans le journal.*

## 0. La question produit, et la thèse

**La question à laquelle tout doit répondre : un débutant progresse-t-il quand on lui montre le plan ?** Rien
ci-dessous n'a de valeur si la réponse est non ; elle n'est pas encore mesurée (voir §9, priorités).

**Thèse en vigueur** (elle a changé depuis la première version, et le journal dit pourquoi) :
- un **plan** est une idée humaine qui donne sens à une suite de coups calmes ; il se lit dans les **parties
  humaines** (là où il y a des intentions), pas dans les suites d'un moteur (qui calcule et ne planifie pas) ;
- le **moteur de règles voit** (faits, atomes, recettes), **Stockfish juge** (la qualité d'exécution, la valeur du
  plan dans la position), **un modèle propose** (quel plan un joueur de ce niveau entreprend ici, et lequel
  l'adversaire prépare), **le code explique** avec des phrases vérifiables ; le LLM, s'il parle, ne fait que reformuler ;
- le modèle de production est, par concept, **le meilleur entre des arbres sur les faits et un petit réseau** ; le
  réseau qui ne voit que l'échiquier sert de **sonde** : là où il bat les arbres, il manque un fait, on l'écrit, les
  arbres le récupèrent (cycle validé le 29 septembre avec les « disponibilités ») ;
- **l'activation d'un modèle n'est pas une explication.** L'explication, c'est l'état but vérifié sur l'échiquier et
  la phrase du code ; le modèle ne fait que choisir quoi vérifier.

**Décisions produit de l'auteur (30 septembre – 1er octobre 2026, après la première partie réelle)** :
- **le coach ne souffle pas le coup.** Donner le meilleur coup « revient à faire rejouer Stockfish contre lui-même » :
  le joueur exécute, il n'apprend pas, et le test est faussé (il gagne parce qu'il joue le coup du moteur). Avant le
  coup, la fiche donne **l'idée** (menace, pièce attaquée, cible, plan) ; le coup est derrière des **indices par
  paliers** (la pièce, puis la case, puis la fiche complète) ; **après** le coup, le coach **juge le coup joué**
  (perte d'espérance de score, réfutation lue dans la ligne du moteur, coup qu'il fallait). En place le 1er octobre ;
- **le joueur automatique** (outil de validation, §9) ne rejouera pas la ligne de Stockfish : il joue d'après les
  motifs reconnus et les conseils de la fiche (« prends le centre », « développe-toi », « ton fou est menacé »), et
  Stockfish ne sert qu'à le juger. C'est la seule façon de mesurer si les conseils, suivis, font bien jouer ;
- **le gambit** manque au catalogue : sacrifice volontaire d'un pion contre du développement, le centre ou
  l'initiative. À écrire comme recette (atome `perte` + compensation mesurée par le moteur) et à faire proposer par la
  fiche seulement quand les deux moteurs confirment la compensation, avec l'explication du déséquilibre créé. Pas
  prioritaire tant que les erreurs graves ne sont pas à zéro (l'auteur : « pour l'instant ça rajoute du vocabulaire »).

**Ce qui a été essayé et abandonné** (détails et chiffres dans le journal) : la thèse initiale « de petits réseaux
dont les activations, vérifiées par Stockfish, sont l'explication », entraînés sur des étiquettes lues dans les suites
de Stockfish. Les étiquettes se sont révélées fragiles (9 % survivent à l'accord de deux versions du moteur) et peu
prédictibles (AUC 0,55 à 0,62) ; le critère fixé (+0,1 d'AUC sur la référence) n'a pas été atteint.

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

Le plan de l'adversaire se définit de la même manière, du point de vue de l'adversaire.

**Une seule ontologie.** L'état but de cette définition est le **déséquilibre** de la grammaire du §3 bis ; ce qui
manquait à la définition initiale, c'est le **moyen** (l'opération qui y mène : levier, échange, manœuvre) et
l'**exploitation** (ce que le déséquilibre rend juste ensuite). Un plan complet est donc « moyen → déséquilibre →
exploitation » ; un concept nommé est le déséquilibre visé, et une recette est le triplet.

**Deux façons d'établir qu'un plan est LE plan d'une position**, selon la source :
- dans une **partie humaine** (source principale, §4) : le joueur le réalise par des coups calmes, tôt (règle du prix :
  dans les 12 premiers demi-coups), et **le joue bien** (perte moyenne de ses coups sur le segment, en espérance de
  score, sous un seuil, et aucun coup au-dessus d'un second seuil) ;
- dans les **suites du moteur** (coach en direct, §4 ter) : le déséquilibre apparaît dans la meilleure suite, calmement,
  et pas dans les suites nettement moins bonnes (contraste) ; quand toutes les bonnes suites se valent et y mènent
  toutes (consensus), le plan est *bon ici* sans être *distinctif* : le coach le dit, l'étiquetage ne le compte pas. Et
  seul un plan trouvé par **deux moteurs différents** est annoncé.

### Présence, disponibilité, réalisation

Les règles détectent la **présence** d'un déséquilibre (« une case faible existe en d5 »), la **disponibilité** d'un
moyen (« un levier c5 est jouable », « le cavalier a une route vers d5 en deux bonds », « Cxe6 lui laisserait un pion
isolé » : `positional/disponibilites.js`) et, le long d'une suite, la **réalisation** (atomes et recettes). Ce qui
compte *maintenant*, c'est ce que le joueur réalise (source humaine) ou ce que la meilleure suite réalise et pas les
autres (contraste, source moteur).

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

**Le débutant relève d'heuristiques, les plans appris commencent à l'intermédiaire.** Développer, roquer, prendre le
centre, échanger quand on est devant (concepts 1 à 4 du §3) sont dans toutes les bonnes suites : aucun contraste ne
peut les isoler, et ils n'ont pas besoin de l'être. La fiche du coach les sert déjà comme heuristiques, en tête de sa
hiérarchie. Tout ce qui est validé par l'apprentissage concerne les niveaux intermédiaire et avancé ; c'est assumé.

**La grille est mesurée, pas décrétée, et elle est conditionnelle.** Chaque position étiquetée porte l'Elo de la partie. Une fois l'étiquetage
terminé, on mesure pour chaque concept et chaque tranche d'Elo la part des joueurs qui réalisent le plan **sachant que
ses ingrédients sont présents** (la part brute confond le plan et le type de positions rencontrées), et bientôt la
part qui le réalise **et le joue bien** (perte des coups du camp). Un concept que les joueurs à 1300 réussissent déjà
est de leur niveau ; un concept que même les joueurs à 1800 ratent est avancé. Le tableau ci-dessus est une hypothèse
de départ que ces chiffres corrigent (`scripts/human-grid.mjs`, `scripts/human-grid-cond.mjs`, résultats au journal).

---

## 3. Les concepts : liste de départ (19)

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
| 11 | Bloquer un pion faible | un cavalier ou un fou s'installe juste devant un pion adverse isolé, arriéré, faible ou passé (souvent le précurseur de l'avant-poste) | faits de pions et occupant de la case de blocage |

### Avancé

| # | Concept | État but | Base existante |
|---|---|---|---|
| 12 | Affaiblir la structure adverse | une faiblesse nouvelle apparaît chez l'adversaire (pions doublés, isolés, arriérés, bouclier du roi) ; moyen noté : échange qui force une reprise de pion, ou poussée ; drapeau « avant le roque » | faits de pions et droits de roque (voir §8) |
| 13 | Rupture de pions | un levier de pions ouvre une colonne ou libère une chaîne | à écrire (levier puis colonne ouverte) |
| 14 | Attaque de minorité | les pions de l'aile dame avancent contre une majorité, créant une faiblesse | structure Carlsbad plus faiblesse créée |
| 15 | Échanger son mauvais fou | le mauvais fou disparaît contre une pièce adverse | `FOU_MAUVAIS` disparaît par échange |
| 16 | Prophylaxie | le plan adverse le plus probable devient impossible ou perd sa valeur | activation du détecteur adverse qui chute — **reporté** après la première expérience (état but difficile à définir de façon symbolique) |
| 17 | Transformer un avantage | un avantage (matériel, espace) devient un autre, plus durable (pion passé, faiblesse fixée) | combinaison de 4, 5 et 8 |
| 18 | Paire de fous dans une position qui s'ouvre | un camp garde ses deux fous contre fou et cavalier ou deux cavaliers, et des pions centraux disparaissent (colonnes et diagonales qui s'ouvrent) | nombre de fous et structure centrale — candidat |
| 19 | Dominer une couleur de cases | plan à étages (formulation de l'auteur) : l'adversaire est faible sur une couleur (au moins deux trous) ; **moyen** : je prends son fou de cette couleur en gardant le mien ; **déséquilibre** : `COMPLEXE_FAIBLE` adverse « avec fou ennemi » apparaît et tient ; **exploitation** (à venir) : mes pièces et mon attaque s'installent sur cette couleur | `COMPLEXE_FAIBLE` (couleur, trous, fou ennemi) — étages 1 et 2 codés (`dominer`) |

État (30 septembre) : codés comme plans (`coach/plan-concepts.mjs`) : 6, 7, 11, 12, 13, 19, plus les recettes
« attaque de minorité » (14) et « baïonnette » ; 1 à 4 servis par heuristiques ; les autres à écrire comme recettes sur
les atomes (§3 bis). Il reste 20 à 30 concepts de la théorie à définir avec un état but vérifiable avant la prochaine
grande session d'étiquetage.

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

## 4. Source humaine : chercher les plans là où il y a des intentions (source principale)

Objection de l'auteur (29 septembre) : Stockfish ne fait pas de plan, il calcule ; sa meilleure suite est un
sous-produit de la recherche, et y « reconnaître » un plan revient souvent à lire une intention là où il n'y a qu'un
ordre de coups qui change avec la version du moteur (§7, dépendance au moteur : avec l'accord de deux moteurs exigé,
**18 positifs sur 191** survivent sur 400 positions, 9 %). Un plan est une idée humaine qui résume et donne sens à une suite de coups : un déplacement,
une configuration, voulus.

**Inversion des rôles.** Les intentions se trouvent dans les parties humaines (Lichess, Chess.com : des milliards de
parties, avec l'Elo des deux joueurs ; le blitz convient, le bruit se filtre) ; Stockfish ne décide plus, il **juge**.

1. **Détection dans les coups réellement joués** : depuis chaque position, les 24 demi-coups suivants de la partie
   passent par le même `scanLine` (mêmes concepts, agentivité, tenue, suite calme).
2. **Jugement de l'exécution** (décision du 29 septembre, à la suite d'une relecture) : la dérive d'évaluation
   début-fin mesurait le joueur et l'adversaire ensemble, pas le plan ; elle est abandonnée comme règle. À la place,
   la **perte des seuls coups du camp sur le segment du plan** (chaque coup comparé au meilleur coup, en
   **espérance de score** par la formule de Lichess, jamais en centipions bruts), avec **deux seuils** : moyenne du
   segment sous X et aucun coup au-dessus de Y, calibrés sur des planches relues. Une recherche par coup du camp,
   sur les positifs seulement.
3. **L'étiquette retenue** : « à ce niveau, ce joueur réalise ce plan ici, **et le joue bien** ». Sans le second
   membre, un coach entraîné sur des parties de débutants apprendrait leurs fautes typiques (le Fxg6 hxg6 à 1200 est
   souvent une faute). Elle ne dépend pas de la version du moteur : évaluer des coups joués est stable.
4. **Ce qu'on enregistre** : les 24 demi-coups joués, les plans des deux camps avec leur moment et leur calme, les
   atomes (§3 bis), la trajectoire d'évaluation (indicative), l'Elo de chaque joueur, le résultat, le moteur et sa
   profondeur.

Les suites de Stockfish gardent deux rôles : le plan vérifié dans le coach (« ce plan est-il bon *ici* ? », avec
l'accord de deux moteurs), et une seconde source d'étiquettes, marquée comme telle. Générateur :
`scripts/label-human.mjs`, sortie `data/labels/human-*.jsonl`.

---

## 4 ter. Source moteur (seconde source ; coach en direct)

*Décision du 29 septembre : cette source n'est plus la source principale d'étiquettes (voir §0 et le journal : 9 % de
survie à deux moteurs, AUC 0,55 à 0,62). Elle reste la méthode du coach en direct (« ce plan est-il bon ici ? »,
`coach/plans.mjs`, accord de deux moteurs exigé) et une seconde source d'étiquettes, marquée comme telle.*

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
- **Réseaux et arbres, décision en vigueur** : les arbres de décision sur les faits du moteur de règles sont la
  référence à battre ; à volume égal les réseaux font jeu égal ou un peu mieux, et ils profitent du volume alors que
  les arbres plafonnent (journal, 29 septembre). On livre **par concept le meilleur des deux**, arbres par défaut
  (explicables). Le **réseau échiquier seul** est une **sonde** : les positions où il bat les arbres désignent les
  faits qui manquent aux règles ; on les écrit (« disponibilités », 29 septembre), et les arbres les récupèrent. Ni le
  nombre de passes ni la largeur du réseau n'ont d'effet mesurable ; le nombre de positifs, si.
- **Entrées** : l'Elo du joueur qui agit fait partie des entrées (le plan naturel dépend du niveau).

### Du modèle à l'explication

1. Le modèle donne les plans candidats, pour l'élève et pour l'adversaire : « à ton niveau, on entreprend souvent X
   ici », « il prépare probablement Y ». C'est une **proposition**, pas une explication.
2. Chaque candidat est **vérifié** par le moteur (deux versions) : le déséquilibre apparaît-il dans la meilleure
   suite, calmement, tôt ?
3. Les plans vérifiés, filtrés par le niveau, sont racontés par des **phrases écrites par le code**, avec le moyen
   (« prépare la rupture c5 »), le déséquilibre (« elle ouvre la colonne c ») et l'exploitation quand elle est visible.
   Le LLM n'intervient pas, ou seulement comme voix contrôlée.
4. La mémoire des erreurs s'y branche : « dans ce type de position, tu passes souvent à côté du plan *colonne ouverte* ».

---

## 6. Expériences

**Première expérience (étiquettes moteur) : ÉCHEC, constaté le 29 septembre.** Critère : AUC supérieure d'au moins
0,1 à la référence « ingrédients présents ». Résultat : 0,55 à 0,62 sur 7 900 positions, étiquettes à 9 % de survie
entre deux versions du moteur ; le critère n'a pas été atteint et la source a été abandonnée (§0, §4 ter). Le
protocole initial est conservé ci-dessous pour mémoire.

- **Concepts** : 6 (tour sur colonne ouverte), 7 (cavalier sur avant-poste), 11 (blocage), 13 (rupture de pions).
- **Contrôle visuel d'abord** : environ 1 000 positions étiquetées sont relues devant l'échiquier (planches avec la
  suite de Stockfish) pour vérifier que chaque étiquette correspond à l'intuition d'un joueur, avant tout entraînement.
- **Données** : 50 000 à 100 000 positions (milieux de partie), étiquetées sur le serveur, en plusieurs nuits de calcul.
- **Référence à battre** : nos règles actuelles (présence statique des ingrédients du concept), puis un modèle simple sur les faits du moteur de règles (§6 bis, test 3).
- **Critère de succès** : sur des positions jamais vues, le réseau prédit que Stockfish va jouer ce plan nettement
  mieux que la référence (AUC supérieure d'au moins 0,1).
- **Si c'est un succès** : on élargit aux 15 concepts et on branche l'explication.
- **Sinon** : on sait, pour pas cher, que cette voie ne suffit pas. *C'est ce qui s'est produit.*

**Expérience en cours (étiquettes humaines).** Référence : arbres de décision à gradient sur les faits (la référence
« ingrédients présents » était trop faible ; le seuil est passé de +0,1 à **+0,02** d'AUC, écart minimal pour
justifier un réseau face à un modèle explicable ; le changement est dit ici et daté au journal). Mesures exigées :
AUC **avec intervalle** (bootstrap sur le test, trois graines : ±0,01 d'erreur-type avec 900 positifs, un écart plus
petit n'est pas un résultat), **précision au seuil d'exploitation** et précision au premier plan par position (le
coach montre un plan à 1 à 5 % de prévalence), courbe de calibration, contrefactuels. Découpage par partie ; **la
sonde tourne sur la validation, jamais sur le test** (le test a été contaminé une fois, 29 septembre : les
disponibilités ont été conçues sur ses positifs ; reconfirmation exigée sur le lot 2016).

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

**État** : test 1 fait (horizon réel plus court que prévu, suites prolongées) ; test 3 fait (référence arbres adoptée,
contrefactuels en place : les réseaux réagissent à l'ingrédient dans 28 à 87 % des cas selon le concept, et ce taux
baisse quand le volume monte, ce qui dit qu'ils s'appuient aussi sur le décor) ; **test 2 non fait** : la relecture
par un joueur de plus de 1800 n'a pas eu lieu, ni pour les étiquettes ni pour le plan vérifié du coach. Quand un
critère a plusieurs conditions, dire lesquelles sont bloquantes.

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
  sert à étudier ce que les joueurs de chaque niveau réussissent réellement.
- **L'étiquette humaine mesure ce que les humains font, pas ce qui est bon** : sans le jugement d'exécution (§4),
  le modèle apprend les fautes typiques du niveau.
- **Contamination du test** : concevoir des faits en relisant les positifs du test rend le gain optimiste ; la sonde
  travaille sur la validation.
- **Chiffres sans incertitude** : une AUC seule, une seule graine, ne permet pas de conclure sur un écart de 0,01.
- **Trajectoire d'évaluation** : elle mesure le joueur et l'adversaire autant que le plan ; indicative seulement.

## 8. Plans à étages et émergence

### Un plan a plusieurs étages

Un vrai plan ne se réduit pas à « quoi faire ». Exemple d'entraîneur : *fragiliser la structure de pions adverse
à l'aile roi avant que l'adversaire roque, par une poussée de pions ou par un échange qui l'oblige à reprendre avec
un pion ; ce déséquilibre dicte ensuite la stratégie* (garder son roi au centre, attaquer sur la colonne ouverte, viser
les pions doublés…). On distingue donc trois étages :

1. **Le moyen** : poussée de pions, échange de pièce légère ou lourde, manœuvre.
2. **Le déséquilibre créé** : faiblesse de structure, roi privé d'abri, paire de fous, colonne, pion passé…
3. **L'exploitation** : la stratégie que ce déséquilibre rend juste.

Le concept « affaiblir la structure adverse » (§3, n° 12) modélise les étages 1 et 2 de façon vérifiable : le moyen est
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

Depuis le 29 septembre, l'émergence tourne sur les **parties humaines** (atomes et concepts des deux camps, motifs
« moi » et « lui fait X, puis je fais Y »), avec un **catalogue de la théorie** écrit dans le même vocabulaire
(`coach/recettes.mjs`) qui nomme les motifs reconnus, signale les variantes et isole les inconnus. Elle ne demande
que du calcul, pas de Stockfish.

**Limites** : beaucoup de motifs seront triviaux (« il roque ») ou du bruit ; on ne découvre que des plans dont les
étapes sont visibles par le moteur de règles (d'où l'intérêt de l'enrichir) ; l'horizon limite les plans très lents.

**Première exploration** (en parallèle de l'expérience du §6), à partir d'environ 50 000 positions : extraire les
20 enchaînements les plus fréquents et les plus discriminants, avec planches, et juger si de vrais plans en sortent.

## 9. Priorités en vigueur (1er octobre 2026)

Le journal daté est dans `JOURNAL-PLANS.md`. Par ordre, ce qui compte :

0. **Zéro erreur grave dans la fiche, en partie réelle.** Règle de construction : toute phrase a sa preuve dans la
   ligne du coup conseillé ou dans les faits, sinon silence. Mesure : banc de milieux en mode déterministe
   (`COACH_DETERMINISTIC=1`, 40 positions dont 4 tirées de parties réelles) et parties jouées par l'auteur avec le
   conseil et le jugement à chaque coup. Le relecteur LLM signale aussi de fausses erreurs (il lit l'analyse, pas
   l'échiquier) : chaque « grave » est vérifiée sur la position avant d'être comptée.

1. **La question produit** : un banc de milieux de partie tiré des plans humains bien joués, la fiche du coach avec le
   plan proposé puis vérifié, et une mesure de ce qu'un débutant en retire (au minimum : relecture par un joueur
   fort, test 2 du §6 bis ; au mieux : des élèves).
2. **Le jugement d'exécution** (perte des coups du camp, §4) calculé sur les étiquettes existantes, puis l'étiquette
   « réalisé et bien joué » et la grille « réalise et réussit » par niveau.
3. **Une évaluation propre** : reconfirmation des disponibilités sur le lot 2016, intervalles, métriques produit.
4. **Le service « intentions »** dans le coach, derrière un drapeau, puis les phrases des disponibilités relues.
   **Prérequis relevé par l'auteur le 30 septembre : l'estimation du niveau d'un joueur anonyme.** Les modèles
   prennent l'Elo en entrée ; en production il n'est pas connu. Feature à ajouter (non prévue à l'origine) : un
   module `coach/niveau.mjs` qui estime l'Elo en continu à partir de la perte des coups joués (la mesure du jugement
   d'exécution, dont la relation au niveau est mesurée sur notre million de positions : perte médiane 5 → 2 points de
   1100 à 2000 +), affinée par les plans réalisés et réussis (la grille lue à l'envers), remplacée par l'Elo réel si
   le joueur donne un pseudo Lichess ou Chess.com, avec un réglage manuel à trois positions en repli. Le niveau est
   une entrée continue et tout plan annoncé reste vérifié par le moteur : une erreur d'estimation décale, elle ne
   casse pas. Validation : sur des parties de test, retrouver l'Elo réel à 200 points près après 20 coups. Décision
   d'y aller conditionnée à une mesure préalable : le plan proposé change-t-il vraiment selon le niveau donné en
   entrée, pour les débutants (< 1200) et les forts (> 2000) ? Si non, le niveau par défaut suffit et la feature
   attend.
5. **Conditionner mon plan au plan adverse et à son stade** (arbres conditionnels, puis sélecteur de décision).
6. L'inventaire des 20 à 30 concepts restants, les recettes défensives, puis la prochaine grande session
   d'étiquetage en duo (VPS et DENEB).

Deux machines : le VPS (site, coach, étiquetage) et DENEB (GPU : entraînement, sonde, contrefactuels) ; procédure
dans `MACHINE-GPU.md`.

## Références

- T. McGrath et al., « Acquisition of chess knowledge in AlphaZero », *PNAS*, 2022 : des concepts humains se lisent
  dans le réseau d'AlphaZero.
- L. Schut et al., « Bridging the human-AI knowledge gap: concept discovery and transfer in AlphaZero », 2023 : des
  concepts extraits de l'espace latent d'AlphaZero, jamais formulés par les humains, enseignés à des grands maîtres
  qui progressent. Preuve de principe de l'émergence (§8).
- M. Sadler et N. Regan, *Game Changer*, 2019 : les « plans » d'AlphaZero sont des récits humains a posteriori ; le
  moteur ne planifie pas, mais ces récits ont servi à la compréhension des joueurs. C'est l'objet pédagogique visé ici : une
  idée reconnaissable par un humain et vérifiée par le moteur.
