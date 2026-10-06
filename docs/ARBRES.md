# Les arbres stratégiques appris

*Comment on fait émerger, sans règle écrite, les chorégraphies qui reviennent dans les parties humaines, pour qu'un coach parle d'intention plutôt que de coups.*

Document de travail, 6 octobre 2026. Les nombres de la section 9 couvrent les deux premières passes ; ils seront complétés à chaque passe.

---

## 1. Le problème

Un coach d'échecs pour débutants doit dire **pourquoi** on joue un coup : ce que l'adversaire prépare, ce que la position demande, où l'on va. Deux approches échouent :

- **Expliquer le coup du moteur.** Stockfish choisit un coup ; le code cherche une raison locale (« protège d4 », « développe le fou »). C'est vrai et plat : le coup du moteur n'a pas de raison exprimable à ce niveau, et le milieu de partie reste muet.
- **Écrire des règles.** Un livre d'ouverture par ouverture, une règle par plan : dès que le joueur s'écarte de ce qui est prévu, le coach se tait. Il faudrait une heuristique infinie. Et l'on n'apprend rien sur les échecs : on recopie ce qu'on croit savoir.

La troisième voie, celle de ce document : **regarder comment les petits grains s'enchaînent dans des milliers de parties humaines, laisser les gros grains apparaître, les compter, puis les nommer.**

![La chaîne complète](figures/arbres-01-chaine.svg)

---

## 2. Les grains : ce que le code voit

Chaque demi-coup de chaque partie devient un **grain** : un nœud qui porte tout ce que le code sait voir sur l'échiquier, sans jugement.

![Anatomie d'un grain](figures/arbres-02-grain.svg)

| Famille | Contenu | D'où ça vient |
|---|---|---|
| Identité | camp, pièce, prise, échec, roque, promotion | la partie |
| Zone d'arrivée | relative aux rois (voir §3), mon camp ou le sien | position des rois |
| Cibles | ce que la pièce jouée vise après le coup : roi, pièce, pion faible, colonne ouverte, centre | carte des attaques |
| Effets immédiats | menace, pression, soutien | `coach/move-class.mjs` |
| Atomes de structure | levier, manœuvre, échange, roque, espace, fermeture, restriction, septième | `coach/atoms.mjs` |
| Faits apparus et disparus | clouage, fourchette, pion isolé, colonne ouverte, avant-poste, bouclier abîmé, roi au centre… | `positional/` |
| Contrôle des cases | cases attaquées par zone, variation depuis le coup précédent, pression sur la zone du roi adverse | carte des attaques |
| Plans détectés | les trente concepts du catalogue, quand ils sont réalisés | `coach/plan-concepts.mjs` |

Les grains sont mécaniques : une prise est une prise, un clouage est un clouage. Aucune stratégie n'y est écrite. Le code qui les produit est `scripts/grains.mjs` ; il traite une partie en moins d'une demi-seconde.

**Le flux est bicolore** : les grains blancs et noirs alternent dans le même flux. Une attaque ne se lit pas dans les coups d'un camp seul ; elle se lit dans ce que l'un fait et ce que l'autre laisse faire.

---

## 3. L'abstraction relationnelle

Deux joueurs ne mènent jamais une attaque avec les mêmes coups. Si l'on reste au niveau des coups exacts, rien ne se ressemble jamais et rien ne fusionne. Il faut monter d'un cran : **décrire un coup par ce qu'il fait, relativement à la position, pas par la case où il va.**

![Abstraction relationnelle](figures/arbres-04-abstraction.svg)

Trois choix concrets :

1. **Les camps sont relatifs** : « moi » est le camp qui vient de jouer, « lui » l'adversaire. Une attaque blanche et une attaque noire sont le même objet.
2. **Les zones sont relatives aux rois** : côté de son roi, centre, côté de mon roi, dans mon camp ou dans le sien. Un pion g4 contre un roi roqué court et un pion b4 contre un roi roqué long sont le même grain : « pion vers le côté de son roi ».
3. **Les cases exactes disparaissent** : un fait garde sa nature (pion isolé, colonne ouverte, clouage) et son propriétaire, pas son adresse.

Ce que l'on perd : la précision tactique. Ce que l'on gagne : la possibilité que deux chemins différents se ressemblent. C'est le prix de l'intuition.

---

## 4. Les fenêtres et l'avenir

Le flux de chaque partie est découpé en **fenêtres de seize demi-coups** qui glissent de deux en deux, à partir du dixième coup. Chaque fenêtre est vue du camp qui vient de jouer.

![Flux bicolore et fenêtre](figures/arbres-03-fenetre.svg)

À chaque fenêtre on attache son **avenir** : non pas les coups qui suivent, mais les **faits** que produisent les dix demi-coups suivants, et par qui. La pression sur son roi monte. Une colonne s'ouvre pour moi. Un pion passé apparaît. Un défenseur disparaît. Du matériel change de camp. Il roque. Je joue un levier.

Ce choix est le cœur de la méthode. **L'intention, opérationnellement, c'est l'avenir prévisible d'une suite de coups.** Deux fenêtres faites de coups différents, mais qui mènent au même avenir, doivent recevoir le même vecteur. On ne demande donc pas au modèle de reconnaître une stratégie, ce qu'il ne saurait pas faire sans qu'on la lui définisse : on lui demande de prédire ce qui va se passer, et la stratégie est ce qu'il doit comprendre pour y arriver.

Ordres de grandeur de la première passe : 88 000 parties, 2,1 millions de fenêtres, un vocabulaire de 367 traits de nœud et 139 traits d'avenir. Le code est `scripts/arbres/dataset.py`.

---

## 5. Le modèle

![Le modèle](figures/arbres-05-modele.svg)

**Entrée.** Seize nœuds. Chaque nœud est une liste d'au plus quarante identifiants de traits ; son plongement est la somme des plongements de ses traits, à laquelle on ajoute un plongement de position dans la fenêtre.

**Architecture.** Un transformeur encodeur de quatre couches et quatre têtes, dimension 128, pré-normalisation, avec un jeton de résumé en tête de séquence. Environ 1,2 million de paramètres. Il tient en quelques minutes par époque sur la carte graphique de DENEB.

**Sorties.** Le vecteur de résumé `h` (128 nombres), puis deux têtes :

- une tête **avenir**, 139 sorties sigmoïdes, une par fait d'avenir ;
- une **projection contrastive**, 128 nombres normalisés, pour la contrainte de voisinage.

**Témoin.** Le même modèle, entraîné sur les mêmes fenêtres, mais dont l'entrée est réduite aux coups seuls : camp, pièce, prise, échec, zone d'arrivée. Il mesure ce que les grains apportent au-delà des coups. Le code est `scripts/arbres/train.py`.

---

## 6. Les deux objectifs d'apprentissage

![Les deux objectifs](figures/arbres-06-objectifs.svg)

1. **Prédire l'avenir.** Entropie croisée binaire entre les 139 probabilités et les faits réellement produits, pondérée pour que les faits rares comptent. C'est l'objectif qui force le vecteur à dire « vers quoi ça va ».
2. **Voisinage temporel.** La fenêtre qui finit au demi-coup `t` et celle qui finit à `t + 2`, dans la même partie, doivent être proches ; toutes les autres fenêtres du lot sont des contre-exemples (perte InfoNCE, température 0,1). Une chorégraphie reste au même endroit de l'espace pendant qu'elle se joue.

Perte totale : avenir + 0,5 × voisinage. Aucune étiquette humaine, aucune règle : seulement la partie elle-même.

---

## 7. L'espace vectoriel et les arbres remarquables

Toutes les fenêtres sont plongées dans l'espace par le modèle, puis rangées dans une **base vectorielle** (FAISS, produit scalaire sur vecteurs normalisés). Une base vectorielle est un classeur : on y range des millions de vecteurs et on lui demande lesquels ressemblent le plus à celui qu'on lui tend, en quelques millisecondes. Rien d'intelligent n'y habite ; l'intelligence est dans la façon dont les vecteurs ont été fabriqués.

![Espace vectoriel et arbres](figures/arbres-07-espace.svg)

Les fenêtres sont ensuite regroupées par **k-moyennes** (2 000 groupes dans la première passe). Un groupe est un **arbre** : la superposition de milliers de chemins qui se ressemblent et qui se ramifient de la même manière. Il est **remarquable** si :

- **Soutien** : au moins 200 parties distinctes y passent ;
- **Compacité** : ses fenêtres se ressemblent (cosinus moyen au centre) ;
- **Prévisibilité** : ses suites se ressemblent, des faits d'avenir sont présents dans au moins 40 % des membres et au moins 1,5 fois plus souvent qu'ailleurs ;
- **Saillance** : des traits de fenêtre y sont nettement sur-représentés.

Un carrefour très fréquenté dont les suites partent dans tous les sens n'est pas un arbre : il a du soutien, pas de direction.

Pour chaque arbre, l'inventaire garde ses traits saillants, ses suites habituelles, et des exemples (fenêtre et suite en coups). Le code est `scripts/arbres/index.py`.

---

## 8. Le nommage

L'arbre vient avant le nom. Trois sources, dans cet ordre :

1. **Les parties annotées.** Chernev (*Logical Chess*), les études Lichess commentées, les deux récits de référence : quand le maître a écrit « attaque à l'aile roi » sur une fenêtre, ses voisines dans l'espace, venues d'autres parties, héritent de l'indice.
2. **Le LLM sous contrôle.** Il reçoit les traits saillants, les suites habituelles et six exemples, et propose un nom, une phrase de sens, et les traits sur lesquels il s'appuie. Ces traits doivent figurer dans la liste fournie ; sinon le nom est marqué non vérifié. Il travaille hors ligne, par lots ; en direct, le coach ne fait que retrouver.
3. **La lecture à l'aveugle** par l'auteur des cinquante premiers arbres : lesquels sont des stratégies reconnaissables.

Le code est `scripts/arbres/nommer.mjs`.

---

## 9. Comment on saura si ça marche

![Évaluation](figures/arbres-08-evaluation.svg)

Trois mesures, un témoin :

| Mesure | Passe 1 (toutes phases, 88 000 parties) | Passe 2 (milieu de jeu, 136 000) | Passe 3 (milieu, sans séquences d'échecs, 136 000) |
|---|---|---|---|
| Fenêtres | 2 120 787 | 2 480 587 | 1 925 811 |
| AUC moyenne de la prédiction de l'avenir, parties jamais vues, modèle grains | 0,763 | 0,743 | 0,731 |
| Même mesure, témoin coups seuls | 0,728 | 0,703 | 0,691 |
| Même mesure, constante (fréquences) | 0,500 | 0,500 | 0,500 |
| Même mesure, modèle sans les étiquettes de plan | 0,763 | — | — |
| Arbres retenus | 1 998 groupes fins | 300 arbres | 200 arbres |
| Sur les premiers nommés : finales / milieu / ouverture | 20 / 30 / 0 | 25 / 26 / 9 | 8 / 51 / 21 |
| Accord avec les commentaires de Chernev (57 paires, jugées par Fable) | — | — | même idée 2 %, voisine 42 %, rien à voir 56 % |

Échelle de 40 demi-coups (passe 3, 281 000 fenêtres seulement, 3 époques) : AUC 0,667, arbres dominés par les séquences d'échecs ; non concluant à cette taille.

Lecture honnête, passe 1 : les grains aident modestement ; les premiers arbres sont dominés par les étiquettes de plan « rupture » et par les finales ; le modèle entraîné sans les étiquettes de plan prédit aussi bien, donc l'apprentissage ne dépend pas de mes règles. Passe 2 : l'écart entre grains et coups seuls s'élargit en milieu de jeu (+0,04) ; les arbres sont plus variés : lutte pour la colonne ouverte, attaque du pion isolé, assaut du roi par la colonne ouverte, chasse au roi non roqué, levier devant son propre roi, assaut de pions avant le roque, centre fermé et mauvais fou, pion isolé devenu passé ; mais les chasses au roi par échecs répétés forment encore un gros paquet de doublons. Passe 3 : les échecs écartés, l'écart grains / coups seuls se maintient (+0,04) ; 51 arbres de milieu de jeu sur 80, mais beaucoup sont des situations génériques (roque, colonne ouverte, développement achevé) plutôt que des intentions ; l'accord avec Chernev est faible, et le test lui-même compare deux grains de finesse différents : le maître commente le but d'UN coup (« empêche Cf5 », « ouvre la voie à la dame »), l'arbre décrit le contexte de seize demi-coups. C'est la limite du vocabulaire actuel, pas seulement du test.

Les deux passes ont retrouvé seules des choses connues : l'attaque de minorité (« rupture b4 contre la chaîne c5, préparée par a3 et Tb1 »), la libération en hérisson (« …b5 ou …d5 une fois développé »), le centre bloqué avec assauts sur ailes opposées.

Les deux autres mesures, accord avec les parties annotées et lecture à l'aveugle, viennent après le nommage.

---

## 10. Ce que le coach en fera

![Usage par le coach](figures/arbres-09-coach.svg)

À chaque coup : les seize derniers demi-coups deviennent des grains, puis un vecteur, puis les arbres les plus proches pour chaque camp. Le coach dit : « tes trois derniers coups suivent l'arbre X, vu dans 1 240 parties à ce niveau, qui continue d'habitude par ceci ; lui est dans l'arbre Y, voilà ce qu'il faut craindre ». Le moteur garde son rôle de garde-fou : la suite proposée par l'arbre n'est dite comme conseil que si elle est dans ses trois premiers coups. Un écart du joueur ne casse rien : c'est la proximité qui compte.

---

## 11. Ce que les trois passes ont appris, et la suite

- Les grains relationnels aident à prédire l'avenir au-delà des coups seuls, de façon stable (+0,04 d'AUC sur trois passes). L'apprentissage ne dépend pas des étiquettes de plan.
- Des stratégies connues émergent seules, mais la majorité des arbres décrivent des situations, pas des intentions, et l'accord avec les commentaires des maîtres est faible : le vocabulaire de mes détecteurs borne ce que l'espace peut distinguer.
- Suite décidée avec l'auteur : **laisser le modèle apprendre sur l'échiquier brut** (étage 1, auto-supervisé sur le million et demi de parties, sans aucune de mes étiquettes en entrée), puis **greffer les noms** (étage 2 : fenêtres commentées par les maîtres, plans du catalogue, arbres nommés, projetés dans l'espace ; une petite couche apprend à lire chaque nom ; les régions sans nom restent muettes : l'explicable d'abord). Prérequis : un corpus annoté de 2 000 à 5 000 coups commentés par plusieurs auteurs (études Lichess publiques, livres du domaine public), et un test d'accord au bon grain : le commentaire d'un coup contre ce que l'arbre prédit pour ce coup, pas contre le contexte entier.

## 12. Les limites connues

- Les grains viennent de mes détecteurs. Ils sont descriptifs, pas stratégiques, mais leur grain de finesse borne ce que le modèle peut distinguer. Deux grosseurs seront comparées.
- Seize demi-coups peuvent être trop courts pour la stratégie. Des fenêtres de quarante seront mesurées.
- Les parties Lichess à 2400 sont surtout du blitz : les stratégies y sont présentes mais plus brouillonnes.
- Le nommage par LLM reste une explication produite par un modèle de langage, hors ligne et vérifiée par les comptes ; une erreur de nom est possible, mais elle est visible et corrigible, et elle n'invente rien en direct.

---

## Annexe : fichiers

| Étape | Code | Sorties |
|---|---|---|
| Grains | `scripts/grains.mjs` | `data/grains/*.jsonl` |
| Fenêtres | `scripts/arbres/dataset.py` | `windows.npz`, `windows.vocab.json`, `windows.meta.jsonl` |
| Modèle et témoin | `scripts/arbres/train.py` | `model.pt`, `model.emb.npy`, `model.report.json` |
| Base et arbres | `scripts/arbres/index.py` | `arbres.faiss`, `arbres.labels.npy`, `arbres.inventaire.json` |
| Nommage | `scripts/arbres/nommer.mjs` | `noms.json` |
| Inventaire lisible | `scripts/arbres/inventaire-page.py` | page HTML |
| Chaîne DENEB | `scripts/arbres/chaine-deneb.sh` | journaux `logs/arbres-*.log` |
