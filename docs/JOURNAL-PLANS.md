# Journal des plans et concepts

Journal **daté** des mesures, essais, échecs et décisions du projet « plans et concepts ». La spécification stable
(définitions, protocole, décisions en vigueur, priorités) est dans `PLANS-ET-CONCEPTS.md` ; ici, rien n'est
réécrit après coup : chaque entrée porte sa date et ses chiffres tels qu'ils ont été obtenus. Les entrées les plus
anciennes sont en haut ; les décisions prises à la suite d'une entrée sont reportées dans la spécification.

---

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

## 30 septembre 2026 — Grille par Elo conditionnelle (2013 + 2016, 986 465 positions)

`scripts/human-grid-cond.mjs`, `reports/grille-elo-conditionnelle-1.md`. Réponse au point 7 de la relecture du
29 septembre (la part brute confondait le plan et le type de position) : part des demi-positions où le plan est
réalisé **sachant que ses ingrédients sont présents**, les disponibilités servant de dénominateurs.

| Concept | Ingrédients présents (< 1200 → 2000 +) | Réalisé, brut | **Réalisé sachant ingrédients** |
|---|---|---|---|
| Tour sur colonne ouverte | 82 → 88 % | 11,0 → 17,2 % | **12,6 → 18,1 %** |
| Rupture de pions | 56 → 66 % | 5,2 → 8,8 % | **7,8 → 11,7 %** |
| Cavalier sur avant-poste | 20 → 20 % | 0,8 → 2,4 % | **2,5 → 7,8 %** |
| Blocage | 48 → 48 % | 0,9 → 2,1 % | **1,5 → 3,5 %** |
| Affaiblir la structure | 60 → 69 % | 8,0 → 14,3 % | **10,2 → 16,6 %** |
| Dominer une couleur | 75 → 89 % | 0,2 → 0,6 % | **0,3 → 0,7 %** |

Lecture : la montée avec le niveau **tient** une fois les ingrédients contrôlés, pour tous les concepts ; elle est
donc une propension, pas un artefact du type de positions. La disponibilité des ingrédients monte un peu avec
l'Elo (colonnes ouvertes 82 → 88 %, leviers 56 → 66 %), ce qui expliquait une part de l'effet brut, mais l'essentiel
reste : à ingrédients égaux, un joueur à 2000 + installe un cavalier sur un avant-poste trois fois plus souvent qu'un
joueur sous 1200 (7,8 % contre 2,5 %). Dominer une couleur reste rare à tous les niveaux (moins de 1 %). La tranche
< 1200 compte maintenant 93 000 à 134 000 demi-positions selon le concept (lot 2016) : ses chiffres tiennent.
Prochaine version de la grille : « réalise **et réussit** » (perte des coups du camp), quand DENEB aura calculé le
jugement d'exécution.

**Jugement d'exécution : chaîne en place, seuils proposés** (30 septembre, DENEB). `scripts/juge-plans.mjs` :
pour chaque plan positif (calme, apparition < 12), la perte de chaque coup du camp sur le segment, en espérance
de score (formule Lichess, §4.2), Stockfish 19 profondeur 12, 14 moteurs ; les évaluations déjà présentes dans
l'étiquette sont réutilisées ; sortie en fichier compagnon `*.juge.jsonl`, reprise possible. Calcul lancé sur
2013 + 2016 : 429 999 positions, 636 670 plans positifs, ~85 000 positions/h (~5 h).

*Calibration sur les planches* (`reports/calibration-acpl.md`) : sur les 36 planches de
`reports/planches-humains-1`, 21 portent un plan positif au sens actuel. Verdicts relus planche par planche
(par Claude, à confirmer) : 15 bien joués, 4 mal joués (#21 : la rupture e4 crée un pion passé adverse, 44 points
perdus sur un coup ; #36 : gaffe au milieu d'un plan correct, le cas prévu pour le second seuil), 2 « idée bonne,
exécution qui fuit ». **Seuils proposés : X = 10 (moyenne du segment), Y = 20 (pire coup)** — seul couple qui
sépare exactement les deux groupes ; sensibilité documentée dans le rapport. Étiquette « réalisé et bien joué »
implémentée (`build-dataset.mjs --juge`) : le réalisé-mal-joué devient null (ni bon exemple, ni vrai négatif).
Au passage, les identifiants de partie sont préfixés par le lot (les numéros recommencent à zéro à chaque lot :
2013 et 2016 seraient entrés en collision dans `seen` et dans le découpage par partie).

**Mesures d'incertitude dans l'entraînement** (30 septembre, décision 3 du 29) : `train-plans.py --seeds N`
(AUC des réseaux en moyenne ± écart-type), `--bootstrap N` (IC à 95 % des AUC arbres et réseau + faits, et de
leur ÉCART, bootstrap apparié sur le test), précision et rappel au seuil qui maximise F1 sur la validation,
calibration (ECE à 10 paniers). Premier signal utile : l'ECE vaut ~0,15 — les sorties ne sont pas des
probabilités lisibles, le coach devra recalibrer (Platt ou isotone) avant toute phrase du type « souvent ici… ».

## 30 septembre 2026 — Service « intentions » branché dans la fiche (VPS)

`coach/intentions-server.py` (Python local, 127.0.0.1:8001, modèles v3 : arbres et réseau + faits, sept concepts,
210 ms par position), `coach/intentions.mjs` (client, drapeau `COACH_INTENTIONS`, silence en cas d'absence du
service). La fiche dit « à ton niveau, dans ce genre de position, les joueurs entreprennent souvent : … » et, dans
« À surveiller », « à son niveau, il prépare souvent … », jamais à la place d'un plan vérifié. Trois garde-fous
posés à l'essai : **pas de pourcentage** (probabilités rééquilibrées, ECE ≈ 0,15 mesuré par DENEB : à recalibrer
avant production), **marge exigée** sur le second plan, **matière exigée** (sur le banc, la première version a
proposé « une tour sur la colonne ouverte » dans une finale de pions sans tour : le modèle classe, il ne vérifie
pas ; les ingrédients de la grille conditionnelle servent de filtre). Sur les 16 positions du banc : 4 intentions,
plausibles après filtre (rupture pour les Noirs dans la Française avance et l'Est-indienne, tour sur la colonne
dans le PDI). Production : après calibration et banc de milieux de partie.

## 30 septembre 2026 — Banc de milieux de partie : sans et avec intentions

Banc `coach/eval-positions-milieux.mjs` (36 positions de test tirées des étiquettes humaines, un plan réalisé par un
joueur de niveau connu, le coach conseille le camp au trait avec son Elo), mode fiche, relecteur DeepSeek Pro.

| | Thèmes trouvés | Note relecteur | Profondeur | Erreurs graves |
|---|---|---|---|---|
| Sans intentions | 28/72 (39 %) | 7,8/10 | 4,67 | 12 |
| Avec intentions | 36/72 (50 %) | 7,4/10 | 4,64 | 13 |

Lecture honnête : les intentions sont apparues dans 18 réponses sur 36 (« il prépare souvent » dans 9) ; **aucune
erreur grave ne porte sur une phrase d'intention** ; les thèmes du plan sont plus souvent cités (la phrase nomme le
concept) ; mais la note et la profondeur ne bougent pas (l'écart de 0,4 est dans la variance du relecteur, et le
moteur du coach, sur 2 fils, change de lignes d'une passe à l'autre). Sur les 12 positions avec intention, la note
baisse 8 fois, monte 4 fois : bruit. Conclusion : **la phrase d'intention ne nuit pas mais n'apporte pas de
profondeur**, parce qu'elle est vague (« préparer une rupture de pions ») là où le relecteur attend du concret
(« la rupture c5, disponible maintenant »). Deux corrections en découlent, dans cet ordre :
1. **Les 12 erreurs graves viennent des étapes génériques du plan** (`planSteps`), écrites sans regarder les lignes :
   « vise son roi resté au centre » alors qu'il roque dans toutes les lignes (4 cas), étapes géométriquement
   impossibles (« la tour en e1 puis le pion a7 », « le cavalier en d5 puis le fou vers d5 »), mobilité prise au
   mauvais instant. Règle : une étape générique doit être **confirmée par les lignes du moteur** (le fait visé
   subsiste, la case est libre, la pièce existe) ou se taire. Le banc historique ne voyait pas ces défauts.
2. **Rendre l'intention concrète** en la reliant aux disponibilités : « préparer la rupture c5 » (LEVIER_DISPONIBLE
   c6→c5), « installer le cavalier en d5 » (ROUTE_CAVALIER), « échanger sur e6 pour lui laisser un pion isolé »
   (ECHANGE_ABIMANT). La proposition du modèle choisit le concept ; la disponibilité donne la matière.
Les intentions restent derrière leur drapeau jusque-là.

## 30 septembre 2026 — Étapes génériques vérifiées dans la ligne : 12 → 5 erreurs graves

Troisième passe du banc de milieux de partie (sans intentions, moteur sur un fil, étapes génériques confirmées par la
fin de la meilleure ligne : roi adverse « resté au centre » seulement s'il ne peut plus roquer, cible encore présente
et attaquée, colonne encore ouverte, pas de manœuvre vers une case occupée dans la ligne ; plus de mobilité chiffrée ;
faits « dans la suite » tenus jusqu'à l'horizon) :

| | Note relecteur | Profondeur | Erreurs graves |
|---|---|---|---|
| Passe 1 (étapes génériques libres) | 7,8/10 | 4,67 | 12 |
| Passe 3 (étapes vérifiées) | **8,3/10** | 4,75 | **5** |

Les 5 restantes : une tour proposée sur une colonne que la ligne n'occupe pas (2 cas : l'étape « tour sur la
colonne » exige désormais qu'une tour y soit à la fin de la ligne), un fait cité sans exploitation (bouclier
affaibli sur la colonne h), une lecture tactique fausse (« mettre la tour à l'abri » quand le coup est un sacrifice
de dame : hiérarchie de la fiche, à traiter), une idée de structure contredite par la ligne. Règle confirmée :
**tout ce que la fiche affirme comme plan doit être réalisé ou maintenu dans la meilleure ligne du moteur.**

*Quatrième passe* (14 h 25, la « tour sur la colonne » seulement si une tour y est à la fin de la ligne) : note
**8,3/10**, profondeur **4,89**, **3 erreurs graves** (contre 12 le matin). Restent : une étape « vise le pion b7 »
après un cavalier en e5 qui ne l'attaque pas (l'attaque est vérifiée au départ ou à la fin, pas depuis la case
d'arrivée de la manœuvre : à resserrer), un fait cité sans exploitation (colonne h), et la lecture tactique « mets ta
tour à l'abri » pour un sacrifice de dame (hiérarchie des raisons).

## 30 septembre 2026 — Disponibilités reconfirmées sur le lot 2016 (données jamais vues)

Décision 2 de la relecture du 29 : le gain des disponibilités avait été mesuré sur le jeu de test qui avait servi à
les concevoir. Reconfirmation sur le lot 2016 (670 796 positions, 992 789 exemples pour la tour, jamais utilisés
pour concevoir quoi que ce soit ; calcul DENEB, 10 passes, bootstrap 200 ; `reports/train-plans-2016-dispos.json`,
`-sansdispo.json`). Arbres sans → avec les trois disponibilités (AUC) :

| Concept | Arbres sans → avec | Réseau + faits sans → avec | Écart réseau − arbres sans → avec |
|---|---|---|---|
| Tour sur colonne ouverte | 0,891 → 0,891 | 0,909 → 0,910 | +0,018 → +0,019 |
| Rupture de pions | 0,750 → **0,776** (+0,026) | 0,804 → 0,804 | +0,055 → +0,029 |
| Affaiblir la structure | 0,698 → **0,723** (+0,024) | 0,736 → 0,742 | +0,037 → +0,019 |
| Blocage | 0,766 → **0,783** (+0,017) | 0,799 → 0,809 | +0,034 → +0,027 |
| Cavalier sur avant-poste | 0,785 → **0,835** (+0,050) | 0,852 → 0,858 | +0,067 → +0,024 |
| Dominer une couleur | 0,834 → 0,837 | 0,840 → 0,837 | +0,006 → 0,000 |
| Baïonnette | 0,921 → 0,923 | 0,980 → 0,981 | +0,058 → +0,058 |

**Confirmé sur des données neuves** : les disponibilités apportent aux arbres +0,017 à +0,050 sur les quatre concepts
de la sonde, rien aux contrôles ; les réseaux ne bougent pas (ils voyaient déjà) ; l'écart réseau − arbres se referme
de moitié environ (rupture 0,055 → 0,029, avant-poste 0,067 → 0,024). Le cycle « le réseau montre, la règle code,
les arbres récupèrent » tient hors du jeu qui l'a inspiré. Ce qui reste d'écart (0,02 à 0,03) est ce que
l'échiquier dit encore et que les faits ne disent pas.

## 30 septembre 2026 — Grille « réalise et réussit » (jugement d'exécution, 986 465 positions)

Jugement calculé sur DENEB (`scripts/juge-plans.mjs`, 429 947 positions, 5 h 12), joint aux étiquettes
(`scripts/human-grid-reussite.mjs`, `reports/grille-elo-reussite-1.md`). Seuils calibrés sur planches : perte
moyenne des coups du camp ≤ 10 points d'espérance de score et pire coup ≤ 20.

| Concept | < 1200 | 1200-1600 | 1600-2000 | 2000 + |
|---|---|---|---|---|
| Tour sur colonne ouverte | 68 % | 79 % | 87 % | 92 % |
| Rupture de pions | 63 % | 75 % | 85 % | 90 % |
| Affaiblir la structure | 68 % | 78 % | 85 % | 90 % |
| Blocage | 65 % | 77 % | 85 % | 89 % |
| Cavalier sur avant-poste | 68 % | 80 % | 86 % | 90 % |
| Dominer une couleur | 65 % | 75 % | 83 % | 87 % |

(part des plans réalisés qui sont aussi bien joués ; perte moyenne médiane de 5 points sous 1200 à 2 points à 2000 +)

Lecture : **un tiers des plans réalisés par les débutants sont mal joués**, un dixième chez les forts ; la courbe
est la même pour tous les concepts. C'est la réponse au point 2 de la relecture : sans ce filtre, un coach entraîné
sur des parties de débutants apprendrait leurs fautes une fois sur trois. L'étiquette d'entraînement retenue est
« réalisé **et** bien joué » ; les réalisés-mal-joués sont exclus (ni bons exemples, ni vrais négatifs). Prochaine
action : réentraîner sur cette étiquette (DENEB), puis décider du branchement dans le coach.

## 30 septembre 2026 — Modèles v4 : entraînés sur les plans réalisés ET bien joués (16 h 33 → 16 h 58, DENEB)

Jeu de données `humains-v4-juge.jsonl` (2013 + 2016, 986 465 positions ; `build-dataset.mjs --juge`, seuils 10/20) :
95 917 positifs mal joués exclus. Entraînement 10 passes, bootstrap 200 (`reports/train-plans-v4-juge.json`).
Comparaison avec les modèles précédents (2016, étiquette « réalisé », mêmes faits) :

| Concept | Positifs (test) | Arbres avant → après | Réseau + faits avant → après | Écart réseau − arbres |
|---|---|---|---|---|
| Tour sur colonne ouverte | 18 880 | 0,891 → 0,895 | 0,910 → 0,913 | +0,018 |
| Rupture de pions | 11 296 | 0,776 → 0,787 | 0,804 → **0,820** | +0,033 |
| Affaiblir la structure | 15 942 | 0,723 → 0,729 | 0,742 → 0,754 | +0,024 |
| Blocage | 2 607 | 0,783 → **0,807** | 0,809 → **0,830** | +0,023 |
| Cavalier sur avant-poste | 2 818 | 0,835 → 0,841 | 0,858 → 0,868 | +0,027 |
| Dominer une couleur | 759 | 0,837 → 0,839 | 0,837 → **0,861** | +0,022 |
| Baïonnette | 412 | 0,923 → 0,929 | 0,981 → 0,983 | +0,054 |

Lecture : l'étiquette plus exigeante n'a rien coûté ; elle a **légèrement amélioré** tous les concepts (le bruit des
plans mal joués gênait l'apprentissage), surtout blocage (+0,024 arbres) et dominer (+0,023 réseau). Les réseaux
gardent 0,02 à 0,03 d'avance, significative (intervalles disjoints). Les modèles v4 (`plan-*-v4.pt`,
`plan-*-v4-faits.pkl`) sont les candidats à la production ; calibration toujours mauvaise (ECE 0,08 à 0,30), à
traiter avant tout affichage de probabilité. Étape suivante : la mesure « le plan proposé change-t-il selon le
niveau en entrée ? » qui décide de l'ordre entre module de niveau et branchement.

## 30 septembre 2026 — Le niveau en entrée change-t-il le plan proposé ? (mesure préalable, 17 h 05)

Modèles v4 (arbres), 1 500 demi-positions par tranche du lot 2016, plan le plus probable parmi ceux dont les
ingrédients sont présents, avec l'Elo réel puis avec 1500 (le défaut du coach) :

| Tranche | Plan proposé différent avec 1500 | Aucun plan proposable |
|---|---|---|
| < 1200 | **12,8 %** | 1,6 % |
| 1200-2000 | 7,1 % | 0,3 % |
| > 2000 | **13,4 %** | 0,2 % |

Lecture : prendre tout le monde pour un 1500 change le plan proposé dans une position sur huit aux deux extrémités,
une sur quatorze au milieu. Ce n'est pas dominant (la position décide dans 87 % des cas), mais c'est la cible
(débutants) qui est la plus touchée. **Décision** : brancher les modèles v4 d'abord avec un niveau **déclaré**
(réglage à trois positions dans l'interface, 1500 par défaut, Elo réel si pseudo Lichess ou Chess.com donné) ;
l'estimation automatique à partir des coups joués vient juste après, sans bloquer le branchement.

## 30 septembre 2026 — Passe 5 du banc : modèles v4 et intentions concrètes (17 h 19 → 17 h 40)

| | Note | Profondeur | Erreurs graves |
|---|---|---|---|
| Passe 4 (sans intentions) | 8,3 | 4,89 | 3 |
| Passe 5 (v4, intentions concrètes) | 7,7 | 4,69 | **8** |

Intentions présentes dans 16 réponses (+ 9 « il prépare souvent »). **Cinq des huit erreurs graves viennent des
phrases d'intention** : « il prépare l'échange de ton fou » alors que le coup prend la dame ; « mets une tour sur la
colonne a » quand aucune ligne du moteur n'y va ; « échange son fou des cases noires » quand le complexe est ailleurs.
Le relecteur a raison : une tendance statistique lue comme un conseil pour CETTE position est une erreur dès que la
ligne du moteur la contredit. On avait sauté l'étape « Stockfish vérifie » pour les intentions.

**Décision** : les intentions restent hors production. Prochaine et dernière tentative dans ce sens : n'énoncer une
intention que si son coup concret (la poussée du levier, le premier pas de la route, la prise de l'échange) figure
dans une des trois lignes du moteur ; sinon silence. Si la passe 6 ne fait pas mieux que la passe 4 (3 erreurs,
profondeur 4,89), le rôle des modèles dans le coach se limite à **choisir et ordonner** parmi les plans vérifiés,
et à la grille par niveau ; ils ne produisent plus de phrase.

## 30 septembre 2026 — Passe 6 : intentions compatibles avec les lignes (17 h 43 → 18 h 04) ; décision

| | Note | Profondeur | Erreurs graves | dont sur une intention |
|---|---|---|---|---|
| Passe 4 (sans intentions) | 8,3 | 4,89 | 3 | — |
| Passe 5 (intentions concrètes) | 7,7 | 4,69 | 8 | 5 |
| Passe 6 (intentions vérifiées dans les lignes) | 7,9 | 4,58 | 9 | **0** |

La vérification dans les lignes a fait son travail : plus aucune erreur grave ne porte sur une intention (10 phrases
émises, 3 « il prépare »). Mais la profondeur ne monte pas, et les 9 erreurs graves de la passe 6 sont des défauts
**déjà connus de la fiche** (« O-O pare cette menace » alors que le fou reste en prise ; « mets ta tour à l'abri » pour
un sacrifice de dame ; « Dh5+ pare ce mat » pour un perpétuel ; la manœuvre de tour que notre propre contexte marque
absente des lignes ; le texte de structure Est-indienne qui parle de c4-c5 sans pion c ; « équilibrée » avec un pion
de plus), présents à des degrés divers dans toutes les passes. **La variance entre passes est grande** (3 → 9 erreurs
sur le même code de fiche, mêmes lignes de moteur à un fil) : elle vient de la reformulation par le LLM et du
relecteur, pas du code. Deux conséquences :

**Décision sur les intentions** : le critère fixé (≤ 3 erreurs, profondeur ≥ 4,89) n'est pas atteint ; les
intentions ne produisent plus de phrase dans la fiche. Le rôle des modèles dans le coach devient : **choisir et
ordonner** parmi les plans vérifiés par le moteur, et alimenter la grille par niveau. Le drapeau reste, le service
est arrêté. Ce n'est pas un échec des modèles (ils prédisent bien ce que les joueurs font) : c'est que le coach ne
doit dire que ce que le moteur confirme, et alors le plan vérifié suffit.

**Décision sur la mesure** : le banc jugera désormais d'abord le **texte écrit par le code** (`adviceWorking`), sans
reformulation, pour mesurer la fiche elle-même sans le bruit du LLM ; la reformulation sera mesurée à part. À faire
avant toute nouvelle correction de la fiche.

## 30 septembre 2026 — Passe 7 : référence déterministe (texte du code, sans LLM ni intentions), 18 h 06 → 18 h 23

| | Note | Profondeur | Erreurs graves |
|---|---|---|---|
| Passe 4 (reformulée par le LLM) | 8,3 | 4,89 | 3 |
| **Passe 7 (texte du code, sans reformulation)** | **8,6** | 4,53 | **4** |

Le texte brut du code est jugé aussi bien ou mieux que sa reformulation : le LLM ne sert donc à rien dans la fiche
et peut en sortir. Les 4 erreurs graves restantes sont **toutes dans la logique de la fiche**, avec leur cause :
1. (n° 20) une manœuvre prise dans la **ligne 2** du moteur (« son premier pas figure dans une ligne ») alors que la
   meilleure ligne fait autre chose : la manœuvre doit venir de la meilleure ligne, ou d'une ligne qui vaut autant ;
2. (n° 32) « Fxb5+ pare cette menace » alors que la menace s'exécute quand même dans la ligne (le cavalier tombe) :
   une parade ne peut être annoncée que si, dans la meilleure ligne après le coup, la perte menacée n'a pas lieu ;
3. (n° 35, 36) le texte de théorie de la structure reconnue (« la chaîne pointe vers l'aile dame : c4-c5, b4 »)
   contredit la position (pas de pion c) ou la ligne : ce texte générique ne sera cité que si un des coups qu'il
   nomme est jouable ici et figure dans une ligne ; sinon il disparaît.
Objectif : **zéro** sur ce banc, en corrigeant ces trois règles, puis relecture humaine de tout ce que le relecteur
signale encore (il se trompe aussi : position 3, même phrase jugée grave une fois sur deux).

## 30 septembre, soir — vitesse de la fiche, et le moteur ne redonne pas deux fois la même fiche

- **Mise en ligne** (18 h 55, Paris) : le serveur du coach tournait depuis le 28 septembre ; relancé sur le code actuel,
  `COACH_REPHRASE=0` (texte du code, sans LLM), `COACH_INTENTIONS=0`. Le site (nginx dans Podman) était injoignable
  (502 derrière le login) depuis le 29 septembre 12 h 27 : le lien de port rootless du conteneur avait disparu ;
  `podman restart` a échoué (« kill network process: permission denied »), `podman start` après l'arrêt a suffi.
- **Où passe le temps d'une fiche** (`scripts/coach-timing.mjs`, `data.timings` dans `coach/context.mjs`), 36 positions
  du banc, avant : 4 608 ms en moyenne = analyse principale 1 039 (33 %), menace 133 (4 %), préparations adverses
  1 282 (40 %, jusqu'à 9 analyses à profondeur 10), plans deux moteurs 2 176 sur 3 positions (le second moteur, lent,
  attendait le premier).
- **Deux changements sans toucher aux profondeurs** : `ucinewgame` une seule fois au démarrage (la table de hachage
  est conservée entre les analyses d'une fiche) ; le second moteur part dès l'analyse principale finie, en parallèle.
  Après : **3 157 ms** en moyenne (−31 %), maximum 6 226 → 4 546 ms. En production : 4 à 5 s sur une position dure.
- **Découverte** : deux exécutions du MÊME code (avant) donnent des textes différents sur **34 fiches sur 36** (29 hors
  chiffres d'évaluation) : Stockfish à 2 fils n'est pas déterministe, et le plan « vérifié » peut changer d'une
  exécution à l'autre (#6 : « tour en e1 » puis « fou a5-b4 »). Conséquences : (1) les passes du banc comparées jusqu'ici
  portaient aussi ce bruit-là, pas seulement celui du relecteur ; (2) pour mesurer, il faut un mode déterministe
  (1 fil, table vidée par requête) ; (3) un plan qui dépend du bruit de recherche n'est pas assez robuste : à traiter.
- Décisions produit du soir (à consigner dans la spécification) : la fiche ne doit plus donner le meilleur coup par
  défaut (« ça revient à faire rejouer Stockfish contre lui-même ») : idée avant, jugement du coup joué après, indices
  par paliers, coup révélé sur demande ou après l'erreur ; le joueur automatique ne rejoue pas la ligne du moteur, il
  joue d'après les motifs et les conseils (centre, développement, pièce menacée), Stockfish ne fait que le juger ;
  le concept de gambit manque au catalogue (sacrifice de pion volontaire contre développement, centre, initiative).

## 30 septembre, 20 h 30 — première partie réelle avec la fiche du code

- Page de jeu : conseil affiché **à chaque coup du joueur** (case « Conseil à chaque coup », mémorisée) ; limite par
  visiteur 12 → 200 requêtes par 10 min ; la liste des coups est journalisée avec chaque fiche.
- Incident : en échec (…Dh4+), « préparations adverses » retournait le trait → position illégale → Stockfish muet →
  62 s. Corrigé (pas de préparation en échec ; `engineLegal` dans `UciEngine.analyze`). 239 tests verts.
- **Retour de l'utilisateur après une partie entière gagnée** : « aucune erreur grave, le meilleur coup est toujours
  présent mais il en propose d'autres, j'aime bien quand il donne un plan, c'est souvent juste ». Deux cas de test à
  ajouter au banc : 1.e4 Cc6 2.d4 (dire que d4 est attaqué par le cavalier mais défendu par la dame) et la position en
  échec ci-dessus.

## 30 septembre, 21 h 10 — état à la pause (reprise dans quelques jours)

- **En ligne** : coach relancé à 21 h 10 sur les corrections de la fiche (commit 839a07e) ; conseil à chaque coup ;
  texte du code sans LLM ; ~3 s par fiche.
- **Banc** : mode déterministe (0 fiche différente sur 36 entre deux passes) ; corrections rejouées : 23/36 fiches
  changent, les 5 planches sont corrigées, relues une à une. Relecteur (passe 8, unité `passe8-juge`) lancé à 20 h 55 :
  rapport `reports/coach-eval-<horodatage>.md` le plus récent, à comparer aux 4 erreurs graves de la passe 7.
- **Retour utilisateur** : partie entière gagnée avec le coach à chaque coup, « aucune erreur grave », plans appréciés.
- **À reprendre, dans l'ordre** : (3) la fiche sans « le meilleur coup » par défaut : idée, menace, plan ; coup derrière
  un bouton d'indice par paliers (pièce → case → coup), révélé après l'erreur ; (4) mode joueur : jugement de chaque coup
  joué (espérance de score, suit le plan ou non) ; (5) consigner dans la spécification les décisions produit (§0/§9) :
  pas de meilleur coup imposé, joueur automatique guidé par les motifs et non par la ligne du moteur, concept de
  gambit ; (6) niveau du joueur envoyé par la page (déclaré) ; (7) défauts d'étiquettes signalés par DeepSeek
  (blocage, rupture par prise, affaiblir, dominer) avant tout réentraînement.

## 30 septembre, 21 h 40 — passe 8 du relecteur (après les corrections)

- `reports/coach-eval-1790796058412.md`, 38 positions, texte du code : note 7,9, **4 « graves » signalées**, contre 4 à
  la passe 7. Mais 3 des 4 sont des erreurs du relecteur, vérifiées sur les FEN : il affirme qu'il n'y a pas de fou
  noir en b6 (#1), en c6 (#2), en g6 (#17) alors que les trois sont sur l'échiquier, et il oublie la dame b3 qui
  reprend en a4 (#2). Les phrases « X attaque la case…, mais Y la défend : s'il prend, tu reprends et gagnes 2 » sont
  justes (échange statique pièce par pièce). Le relecteur lit le texte d'analyse, pas l'échiquier : c'est sa limite.
- La 4e était réelle (#10) : manœuvre « g5-f3-e5-c6 » dont seul le premier pas figurait dans la ligne, qui joue ensuite
  Cxd4. Corrigé : une manœuvre n'est annoncée que si la pièce ARRIVE à destination dans la ligne du coup conseillé.
  Rejoué : seule la fiche #10 change. **Erreurs graves réelles sur le banc : 0 sur 38** (relecture humaine encore due
  sur les 23 fiches modifiées). Coach en ligne relancé sur cette version.

## 1er octobre, matin — fiche sans coup soufflé, jugement du coup joué, étiquettes

- **Fiche sans meilleur coup** (en ligne) : par défaut, l'IDÉE (menace, pièce attaquée, cible, plan) ; bouton « Indice »
  à paliers : la pièce, puis la case, puis la fiche complète. En échec, la fiche le dit d'abord. Une prise ou un échec
  n'est jamais présenté comme « coup calme ». Dans l'idée, une manœuvre qui commence par le coup conseillé perd son
  trajet (« amène une pièce vers e1 »). Contrôle automatique sur le banc (40 positions) : le coup conseillé n'apparaît
  dans l'idée que 2 fois, et c'est le plan lui-même (« prépare la rupture d5 », structure « poussée f5 ») ; accepté.
- **Jugement du coup joué** (`coach/move-judge.mjs`, route `/api/chess/mentor/judge`) : perte d'espérance de score
  (seuils Lichess 10/20/30) avec un plancher en pions (1,5 → imprécision, 3 → erreur : à +7 l'espérance sature) ;
  réfutation lue dans la ligne du moteur (« l'adversaire joue fxg5 et prend ton fou en g5 »), coup qu'il fallait.
  Affiché en tête du conseil suivant (« Ton coup — … / Maintenant — … »). Journalisé.
- **Banc** : 40 positions (dont 4 de parties réelles) ; textes complets inchangés par ces étapes ; 0 erreur grave réelle.
- **Étiquettes** : sur les 7 planches que DeepSeek jugeait « bruit », 5 étaient des erreurs du relecteur — la planche
  ne montrait la suite que jusqu'au coup étiqueté, il ne pouvait pas voir que le plan tient 6 demi-coups (#1, #13 :
  e6 est bien arriéré, #19-#20 : rupture = levier puis ouverture par prise, conforme, #31 : échange offert). Deux défauts
  réels corrigés : un ÉCHEC compté comme coup de plan (#14, …Cc3+) ; « affaiblir » par échange crédité d'une faiblesse
  sans rapport avec la reprise (#25). `scripts/rescan-labels.mjs` recalcule les étiquettes sans moteur à partir des 24
  demi-coups gardés (inchangé / supprimé / déplacé → `stale` / nouveau → `stale`) ; il applique aussi les règles
  changées depuis l'étiquetage (avant-poste en 4e rangée, recettes). Échantillon de 300 enregistrements : 569 plans
  gardés, 30 supprimés, 10 déplacés, 14 nouveaux. Lancé sur DENEB à 9 h 52 sur les 986 465 enregistrements.
- **Recalcul terminé** (DENEB, 9 h 52 → 11 h 07, 8 processus) sur 986 465 enregistrements : 2 023 201 plans gardés,
  80 370 supprimés (3,8 %), 14 885 déplacés (marqués `stale` : trajectoire et jugement à recalculer), 2 929 nouveaux.
  Par concept, supprimés : blocage 9,1 %, avant-poste 8,6 %, affaiblir 5,5 %, tour sur colonne 3,0 % ; rupture et
  dominer inchangés. Fichiers `*.v2.jsonl` sur DENEB, à côté des originaux (non écrasés).

## 1er octobre, 11 h 52 → 11 h 58 — Courbe de prédiction le long de la partie (DENEB, `scripts/prediction-courbe.py`)

Demande de l'auteur : sur des parties déjà jouées (qui ne tiennent pas compte de nous), à chaque position, le modèle
annonce le plan du camp au trait ; on compte ce qui se réalise, selon la distance à la réalisation. 97 025 positions
de test (parties jamais vues à l'entraînement, découpage par partie), modèles v4, 8 concepts. `reports/prediction-courbe.md`.

- **Rappel selon la distance** (le plan se réalise à d demi-coups ; le modèle l'annonçait-il, p ≥ 0,5 ?) : réseau
  91 % à 0-1 demi-coup, 83 % à 2-3, 78 % à 4-5, 76 % à 6-7, 71 % à 8-11, 61 % à 12-23. La courbe monte à mesure que
  les choses s'engagent, comme attendu ; arbres 2 à 3 points en dessous.
- **Précision des annonces** (règle de production : p ≥ 0,5, marge 0,1) : **25 %** ; le modèle annonce un plan sur
  47-52 % des positions alors qu'un de nos 8 plans ne suit que dans **35 %** des positions (c'est la couverture du
  vocabulaire à l'étage plan). Par concept : tour sur colonne 37-41 % (taux de base 17 %), affaiblir 32 % (16 %),
  rupture 24-26 % (10 %), avant-poste 9-10 % (2,7 %), blocage 6-8 % (2,8 %), baïonnette 4-6 % (0,6 %), dominer 3 %
  (0,8 %) : 2 à 10 fois le hasard, mais trois annonces sur quatre ne se réalisent pas. Par niveau : 16-18 % sous 1200,
  26-28 % au-dessus de 1600.
- AUC sur le test : 0,74 (affaiblir) à 0,98 (baïonnette), cohérent avec le rapport d'entraînement (tour sur colonne
  0,90-0,92). Correction d'une phrase fausse dite à l'oral ce matin : « à peine mieux que le hasard » valait pour les
  étiquettes MOTEUR (0,55-0,62) ; sur les étiquettes humaines les modèles classent bien.
- Lecture : le modèle sait **classer** (AUC) mais pas **affirmer** (précision 25 % au seuil 0,5, calibration connue
  mauvaise) ; cela confirme le retrait des intentions de la fiche (30 septembre). Pour annoncer « il prépare X » il
  faudrait un seuil par concept calé sur une précision cible (≥ 60 %), au prix du rappel, et ne parler que des trois
  concepts fréquents. La couverture de 35 % dit que les 8 concepts ne décrivent qu'un tiers des suites calmes :
  argument pour l'inventaire des concepts manquants par les coups inexpliqués (étage 2 de l'étagement proposé).

## 1er octobre, 12 h 07 → 12 h 15 — Inventaire des coups (DENEB, `scripts/inventaire-coups.mjs`)

Étape 1 de l'inventaire du vocabulaire (décidée avec l'auteur : « on n'a pas les mots »). 97 025 positions de test,
582 150 coups joués (chaque coup de partie compté une fois), rangés par priorité. `reports/inventaire-coups.md`.

| Tas | Part des coups | Part des coups calmes |
|---|---|---|
| non calme (prise, échec, promotion) | 29,7 % | — |
| défense (sauve une pièce en prise 13,8 ; protège une pièce attaquée 11,2 ; sort de l'échec 3,0) | 19,7 % | 28,1 % |
| plan (coup qui réalise un des 8 plans, ou son levier) | 7,4 % | 10,5 % |
| moyen (atome : roque 4,0 ; restriction 3,4 ; manœuvre 2,6 ; espace 2,2 ; levier 1,5 ; fermeture 1,3…) | 11,4 % | 16,3 % |
| autre coup calme (poussée de pion 13,1 ; développement 7,3 ; coup de roi 2,4) | 16,0 % | 22,7 % |
| **inexpliqué** (cavalier 6,6 ; tour 5,7 ; dame 5,3 ; fou 4,8) | 15,8 % | **22,4 %** |

- Le tas vraiment inexpliqué est **un coup calme sur cinq**, pas deux sur trois : la défense (28 %) et les coups
  simples (22 %) sont dicibles par des règles déjà disponibles, que la fiche ne dit pas encore.
- Il est **stable selon le niveau** (21 % sous 1200, 23 % au-dessus de 2000), légèrement plus fourni chez les forts
  en coups de tour et de dame : ce n'est pas seulement du bruit de débutant.
- Les plans ne comptent ici que par leur coup de réalisation (10,5 %) ; les coups qui les préparent sont dans
  « moyen » ou « inexpliqué ». « Sort de l'échec » est trois fois plus fréquent sous 1200 (6,9 %) qu'au-dessus de 1600.
- Suite (étape 2) : regrouper les 91 725 coups inexpliqués par leurs effets (faits qui changent, cases attaquées et
  défendues, ce qui se réalise dans les 12 demi-coups suivants) pour en sortir des planches par groupe.

## 1er octobre, 12 h 37 → 12 h 47 — Les coups inexpliqués, regroupés par effets (DENEB, `scripts/inexpliques.mjs`)

91 732 coups inexpliqués (22 % des coups calmes des parties de test). Effets relevés (un coup peut en avoir plusieurs) :
**défend** une pièce à moi qu'il ne défendait pas 60,3 % ; **attaque** une pièce adverse défendue (pression) 36,2 % ;
**menace** (une pièce adverse se retrouve en prise) 27,2 % ; recule 21,7 % ; centralise 18,9 % ; vers le roi 15,4 % ;
libère une ligne 14,8 % ; libère une case reprise ensuite 9,4 % ; prend ensuite avec la même pièce 22,4 %.
**Aucun effet relevé : 0,4 %** (334 coups). Ce qui suit dans les 12 demi-coups : une manœuvre 25 %, un levier 12 %,
une tour sur colonne 10 %, un affaiblissement 8 %, rien 20 %.

Par pièce et effet principal (ordre menace > attaque > défend > …) : tour-défend 11,2 %, cavalier-attaque 10,9 %,
dame-attaque 10,8 %, cavalier-menace 8,8 %, fou-attaque 8,3 %, cavalier-défend 7,2 %, dame-défend 6,7 %, fou-menace
6,5 %, tour-menace 6,2 %, tour-attaque 6,2 %, dame-menace 5,6 %, fou-défend 3,9 % ; le reste (recule, libère, suite
seule) < 1,5 % chacun. Δ d'évaluation en fin de fenêtre proche de 0 partout (−0,8 à +0,2 pion) : ces coups ne décident
rien à court terme, ce sont des coups de position.

**Lecture** : le tas « inexpliqué » n'est pas mystérieux. Il tient en trois mots de l'étage MOYEN qui manquaient :
**menace** (mettre une pièce en prise), **pression** (attaquer une pièce défendue), **soutien** (défendre une pièce qui
n'est pas attaquée : consolidation, prophylaxie). Avec « sauve » et « protège » (inventaire, 28 % des coups calmes),
la fiche peut dire ce que fait presque tout coup calme d'un débutant. Les préparations lointaines que l'auteur
voulait inventorier se cachent dans les 20 % « rien ne suit » et dans les « suivi:manœuvre » : ce sont ceux-là à
montrer sur planches à un maître. `reports/inexpliques.md` et `.json` (exemples par groupe, FEN et suite).

## 1er octobre, 13 h 07 — les trois mots en ligne ; atomes ; chaîne v5 lancée

- **Fiche et jugement** : `coach/move-class.mjs` → `moveEffects` (menace, pression, soutien, lus avant / après le coup,
  jamais pour le roi). Le « pourquoi » d'un coup calme commence par son effet (« Cg4 : attaque son cavalier en f6, qui
  est défendu : c'est de la pression ») ; l'idée le dit sans la case (« une pièce adverse défendue mérite qu'on mette
  la pression dessus ») ; le jugement nomme l'intention (« Cd2 : bon coup. Il soutient ton fou en f1 »). Banc : 17
  fiches sur 40 changent, relues ; en ligne à 13 h 07.
- **Atomes** `menace`, `pression`, `soutien` dans `coach/atoms.mjs` (avec la cible) : 15 moyens. Spécification §3 bis.
- **Réponse à l'auteur** (« faut-il tout réentraîner ? ») : non pour les mots (règles), oui pour les étiquettes
  corrigées. Chaîne v5 (`scripts/pipeline-v5.sh`, DENEB, 13 h 10) : recalcul des étiquettes avec les nouveaux atomes
  → jeu `humains-v5-juge.jsonl` (plans déplacés exclus, jugement du fichier d'origine) → modèles v5 (10 passes,
  bootstrap 200) → courbes de prédiction v4 et v5 sur les mêmes parties de test.
- **Partage du calcul** (demande de l'auteur, 13 h 45 : « le VPS se tourne les pouces ») : `scripts/repartir.sh`,
  un processus par fichier, 4 sur 5 à DENEB (16 fils), 1 sur 5 au VPS en `nice 10` (un cœur gardé au coach),
  attente bornée sur les marques TERMINÉ, rapatriement des sorties. Testé à 13 h 56. La chaîne v5 en cours n'a pas
  été redécoupée (gain ≈ 12 min, risque au milieu d'une chaîne qui tourne).

## 1er octobre, 15 h 05 — chaîne v5 terminée : les étiquettes corrigées ne changent pas les modèles

- Recalcul 2016 redécoupé à 14 h 02 en 16 morceaux (13 DENEB, 3 VPS en nice 10, `rescan-labels --skip/--limit`),
  recollé à 14 h 30 : étape 1 finie 40 min plus tôt. Jeu `humains-v5-juge.jsonl` : 986 465 positions (14 h 46).
  Modèles v5 : 14 h 59 (`reports/train-plans-v5-juge.json`). Courbes : 15 h 02. Copie DENEB → VPS (étiquettes v2,
  jeu v5, modèles v5) vérifiée (tailles, md5).
- **AUC v4 → v5** (réseau + faits, test par parties) : tour sur colonne 0,913 → 0,911 ; rupture 0,820 → 0,821 ;
  affaiblir 0,754 → 0,752 ; blocage 0,830 → 0,826 ; avant-poste 0,868 → 0,867 ; dominer 0,861 → 0,860 ; baïonnette
  0,983 → 0,984. Intervalles à 95 % recouvrants partout : **aucune différence mesurable**.
- **Courbe de prédiction sur le jeu v5** (réseau) : précision des annonces v4 24,7 % → v5 25,1 % ; rappel à 0-1
  demi-coup 91,5 → 90,8 %, à 12-23 61,0 → 59,9 %. Par concept, rupture 23,7 → 25,6 %, le reste à ± 1 point.
- Lecture : la correction des étiquettes (3,8 % de plans retirés) a rendu la **référence** plus juste, pas les
  modèles plus forts : ce qu'ils apprenaient était déjà le signal des 96 % de plans justes. La précision des
  annonces reste à 25 % : le levier n'est pas dans l'entraînement mais dans le **seuil d'annonce** (et dans le
  vocabulaire : 8 plans couvrent 10 % des coups calmes). v5 remplace v4 comme référence (étiquettes propres), sans
  attente de gain. En production les intentions restent débranchées.

## 1er octobre, 15 h 55 — après les trois mots : 98 % des coups calmes ont un nom ; premiers mots de stratégie

- **Inventaire refait** (étiquettes v2, atomes menace/pression/soutien ; 97 025 positions de test, 582 150 coups) :
  inexpliqué **22,4 % → 1,7 %** des coups calmes. Moyens 71,5 % (soutien 23,2 %, pression 17,1 %, menace 15,4 %,
  roque 4,0 %, restriction 3,4 %, manœuvre 2,6 %, espace 2,2 %, levier 1,5 %, fermeture 1,3 %), plans 10,5 %, autres
  coups calmes 10,8 %, défense d'une pièce attaquée 5,4 % (le reste est absorbé par « soutien », classé avant).
  La menace est le mot des débutants (19,9 % sous 1200, 14,0 % au-dessus de 2000), le soutien celui des forts
  (18,4 % → 24,8 %). `reports/inventaire-coups-2.md`.
- **Mots de stratégie** (`coach/strategy.mjs`, 7 mots, fenêtres de 12 demi-coups, par camp ; `scripts/inventaire-strategie.mjs`,
  194 050 camps) : attaque à l'aile roi 19,1 %, attaque à l'aile dame 15,1 %, jeu au centre 9,1 %, consolidation
  7,3 % (3,7 % sous 1200 → 8,8 % au-dessus de 2000 : le mot des forts), course sur roques opposés 1,5 %,
  simplification 1,2 %, poussée du pion passé 0,9 %. **Sans aucun mot : 53,7 %** des camps (57,7 % sous 1200,
  52,0 % au-dessus de 2000). Un mot va avec un de nos 8 plans dans 27-31 % des cas seulement : les deux étages
  sont largement indépendants, ce qui est attendu (le plan dit quoi, la stratégie dit où). Paires fréquentes :
  attaque aile roi + jeu au centre, attaque aile roi + course sur roques opposés. `reports/inventaire-strategie.md`
  (12 exemples par mot, à relire : premières définitions, validées par leur fréquence seulement).
- Répartiteur corrigé (lancements distants réellement parallèles : un `&&` mettait tout un sous-shell en arrière-plan).

## 1er octobre, 16 h 12 — étape 2 : la page de vérité de terrain des plans

`scripts/verite-terrain.mjs` : pour 6 concepts, 5 **positifs stricts** (réalisé, calme, avant le 12e demi-coup, bien
joué : perte moyenne ≤ 10, pire ≤ 20) et 5 **pièges** (même apparence sans le concept : tour sur une colonne non
ouverte, cavalier chassable, pièce devant un pion non faible, levier qui n'ouvre rien, échange repris par un pion sans
faiblesse, prise du fou sans complexe faible), tirés des parties de test. Page publiée (privée) :
https://claude.ai/artifact/KdJrsQCFLH2FFoGNtPso7x — 60 planches en aveugle (positifs et pièges mélangés, la nature
n'est pas dans la page), deux échiquiers (départ, après le coup clé), la suite jouée, trois réponses (oui / non /
pas sûr) et une remarque, enregistrées dans la base de la page. Clé de correction locale :
`reports/verite-terrain-cle.json`. Dépouillement : un « non » sur un positif ou un « oui » sur un piège met la
définition en cause ; l'accord humain/programme par concept est la première vérité de terrain du §1.

## 1er octobre, 16 h 14 — étape 3 : le seuil d'annonce des intentions (modèles v5, réseau, test)

Pour chaque concept, précision de « p ≥ t » pour t de 0,50 à 0,95 (vérité : le plan se réalise, suite calme, 24
demi-coups). **Aucun concept n'atteint 60 % de précision avant 0,95** ; seule la tour sur colonne y arrive, à 0,95 :
elle n'annonce alors plus que sur 2,3 % des positions et ne voit que 9 % des cas. À 0,9 : affaiblir 53,5 %, rupture
44 %, tour sur colonne 57 %, avant-poste 20 %, blocage 19,5 %, baïonnette 11 %, dominer 6 %. Décision : les
intentions restent hors de la fiche comme affirmation ; les modèles peuvent servir à **choisir quoi vérifier**
(classer les plans candidats avant la vérification par le moteur), jamais à dire « il prépare X ».
`reports/prediction-courbe-v5.md`.

## 1er octobre, 16 h 35 — « la théorie d'abord » : catalogue de 59 concepts, lot 1 codé

Décision de l'auteur (16 h 20) : étendre le vocabulaire des plans avant de mesurer le rattachement (« avec un concept
sur trente, on ne rattache rien : ça explique les 10 % »). `docs/CATALOGUE-CONCEPTS.md` : 59 entrées en six familles
(pièces lourdes, mineures, structure, roi, dynamique, plans par structure), à la grille moyen → déséquilibre →
exploitation, avec le piège (clause d'exclusion), les faits disponibles et le statut (8 codés, 40 en lot 1, 9 en
lot 2 avec un fait à écrire, 2 en lot 3 à discuter : tempo, transformation). Sources datées.
Lot 1, première fournée (`coach/plan-concepts.mjs`, états buts + agents + tenue 6 demi-coups) : doublement_tours,
tour_septieme, tour_derriere_passe, dame_centralisee, colonne_controlee, pion_passe, pion_passe_protege,
pion_passe_avance. Liste partagée `coach/concept-list.mjs` (16 concepts). Tests verts. Mesure de couverture lancée
(inventaire des coups, 8 fichiers, deux machines).
- **Mesure du lot 1** (16 h 50, 582 150 coups de test) : coups calmes réalisant un plan nommé **10,5 % → 12,7 %**
  (colonne contrôlée 1,0 %, doublement 0,4 %, pion passé créé 0,2 %, tour 7e 0,2 %, pion passé protégé 0,2 %, tour
  derrière le passé 0,1 %, pion passé avancé 0,1 %, dame centralisée 0,1 %). Chaque concept est rare pris seul : la
  part des COUPS sous-estime par construction (un plan = un coup sur douze au mieux) ; ajout d'une couverture par
  FENÊTRE (le camp réalise au moins un plan en 12 demi-coups) pour la mesure du lot 2. `reports/inventaire-coups-3.md`.
- **Fournées 2 à 4 du lot 1** (16 h 50 → 17 h 05) : développement, centre, roi à l'abri, roi actif en finale, gain
  d'espace, pion passé éloigné, fixation (mauvais fou adverse) ; avance de la majorité, surprotection, PDI poussé,
  tempête sur roques opposés, attaque du roi par les pièces, pièce passive réactivée, prophylaxie (agent = atome
  restriction, sinon 190/300 fenêtres : trop lâche) ; gambit, sacrifice positionnel de pion, sacrifice de qualité
  (état but décalé de 2 demi-coups : il faut que l'adversaire prenne ; agent = mon coup calme suivi de l'atome
  perte), regroupement défensif. **29 concepts étiquetés** (`coach/concept-list.mjs`). Les atomes sont calculés avant
  les concepts et passés aux agents. Tests verts. Les ouvertures : famille F bis du catalogue (fait OUVERTURE, grille
  ouverture × plan), à coder après les lots.
- **Mesure du lot 2** (17 h 11, 23 concepts) : coups calmes réalisant un plan nommé **12,7 % → 17,2 %** (roi à l'abri
  2,7 %, gain d'espace 1,3 %, roi actif 0,3 %, fixation 0,3 %…). **Couverture par fenêtre** (nouvelle mesure) : un camp
  réalise au moins un plan nommé en 12 demi-coups dans **58,5 %** des cas (55,5 % sous 1200, 59,5 % au-dessus de
  2000). `reports/inventaire-coups-4.md`. Mesure avec les 29 concepts lancée (inventaire5).
- **Mesure du lot 3** (17 h 31, 29 concepts) : coups calmes réalisant un plan nommé **17,2 % → 18,8 %** ; par fenêtre
  **61,6 %** des camps (58,2 % sous 1200, 62,7 % au-dessus de 2000). Nouveaux : surprotection 0,5 %, prophylaxie 0,5 %,
  pièce réactivée 0,3 %, majorité avancée 0,2 %, tempête 0,1 %, sacrifice de pion 0,1 %, regroupement, PDI poussé,
  sacrifice de qualité rares. **Jamais vus : gambit** (les positions étiquetées commencent en milieu de partie : à
  mesurer sur des fenêtres d'ouverture) **et attaque_roi_pieces** (à vérifier demain : état trop exigeant ou défaut).
  Bilan de la journée sur la couverture des plans : 8 → 29 concepts, coups 10,5 % → 18,8 %, fenêtres 61,6 %.
  `reports/inventaire-coups-5.md`.

## 1er octobre, 19 h 05 — vérité de terrain : les dix planches « tour sur colonne ouverte »

Dépouillement (clé `reports/verite-terrain-cle.json`) : les 5 pièges tous reconnus (verdict non) ; sur les 5 positifs
du programme, l'auteur en accepte 2 (planches 1 et 7) et en refuse 3 (3 : « Td5 occupe déjà la colonne, c'est un
doublement » ; 4 : « Tae1 occupe une colonne semi-ouverte disputée par la tour e8 » ; 6 : « oui mais semi-ouverte »).
Trois corrections de définition : (1) **séparer** tour sur colonne ouverte (aucun pion) et tour sur colonne
semi-ouverte (un pion adverse seul), définitions de l'auteur au catalogue (A1, A1 bis) ; (2) exclure la colonne où
j'ai déjà une tour (c'est A2, doublement) ; (3) exclure la colonne déjà tenue par une tour adverse (disputée, A7).
Deux leçons au-delà du concept : sur les pièges 8 et 9, l'auteur lit le vrai sens du coup, un **soutien** avec son
compte (« f7 attaqué 2 fois par les tours, défendu 1 fois par le roi » ; « tripler la défense de d4 ») : le rapport
attaquants / défenseurs d'une pièce clé (pion racine d'une chaîne) manque au vocabulaire → ajouté à la phrase de
soutien de la fiche (`moveEffects`) et au catalogue (B10 bis), concept à coder. Défaut de tirage : planches 9 et 10
tirées de la même partie à six demi-coups d'écart (même coup clé) → une planche par partie et par concept
(`verite-terrain.mjs`), à appliquer au prochain tirage, pas pendant le jugement en cours.

## 1er octobre, 22 h 15 — vérité de terrain : les planches « cavalier sur avant-poste »

Neuf planches jugées (la 9 est restée sans réponse). Accord sur 7 : les 4 positifs du programme acceptés (1, 4, 7, 8)
et les pièges 2, 3 et 10 reconnus, avec la définition de l'auteur en commentaire (planche 2) : « une case qui ne
peut plus être attaquée par un pion adverse et qui est protégée par un de tes propres pions ». Deux désaccords, les
pièges 5 et 6, tous deux des cases **sans soutien de pion** : l'auteur dit oui parce que le soutien peut venir
(« pouvoir pousser f2-f4 pour consolider le cavalier entre totalement dans la stratégie de l'avant-poste »). La règle
exigeait le soutien présent : trop stricte. Correction (`positional/outposts.js`) : l'avant-poste est une case
qu'aucun pion adverse ne pourra jamais attaquer, soutenue par un pion à moi **ou soutenable** (un pion à moi
derrière, sur une colonne voisine, chemin libre de pions) ; nouveau paramètre `soutenu`. Après correction, la
planche 6 (cavalier noir en e3, les Blancs n'ont plus de pion d ni f) devient un positif, comme l'auteur ; la
planche 5 reste un piège : le pion noir est encore en f7 et f7-f6 chasse le cavalier de e5, ce qui contredit la
première condition de la définition écrite par l'auteur lui-même (à lui trancher). Tests ajoutés (4), suite complète
verte (245). Les étiquettes `.v2` ont été calculées avec l'ancienne règle : à recalculer avec les corrections des
colonnes (A1 / A1 bis) au prochain recalcul, après la fin du jugement des 60 planches.

## 1er octobre, 22 h 50 — vérité de terrain : les planches « blocage d'un pion faible »

Neuf planches jugées (la 5 sans réponse). Accord sur 6 : les 4 positifs vus (1 à 4) acceptés, les pièges 7 et 10
reconnus (« g6 est défendu par h7 »). Trois désaccords, tous des pièges acceptés par l'auteur : planche 8 (Cf4 devant
un pion f3 **doublé**), planche 9 (Cd5 devant d4, **base de la chaîne** d4-e5 sans pion c), planche 6 (Fh6 devant h7
alors que g6 est déjà passé). La liste « isolé, arriéré, passé » était trop courte ; la définition de l'auteur
(planche 1) donne la bonne règle : la case devant un pion faible est à l'abri de ce pion, la pièce s'y installe à
l'abri d'une poussée frontale. Nouvelle règle commune au concept et au tirage des pièges (`blocked`,
`coach/plan-concepts.mjs`) : pièce mineure devant un pion adverse **qu'aucun pion adverse ne pourra plus chasser**
(aucun pion adverse sur les colonnes voisines derrière la case), ou devant un pion passé. Rejouée sur les dix
planches : 9 accords sur 9 jugées. Six tests (`tests/blocage.test.js`), suite complète verte. Même défaut de tirage
que la veille : planches 6 et 10 tirées de la même position (partie 1623), déjà corrigé pour le prochain tirage.
Reste à faire au prochain recalcul des étiquettes : colonnes (A1 / A1 bis), avant-poste soutenable, blocage élargi.

## 2 octobre, 17 h 15 — plafond du vocabulaire : cinquante coups calmes classés à la main

Point 1 de la critique du catalogue (« la prémisse 10 % expliqués = vocabulaire au dixième n'est pas acquise »).
Tirage (`scripts/plafond-tirage.mjs`) : parties de test du lot 2016-01, joueurs à 2000 et plus, 8 199 positions,
22 821 coups calmes qu'aucun des 29 détecteurs ne rattache à un plan, 50 tirés, classés un par un
(`reports/plafond-50.md`). Résultat : **9 plans du catalogue non codés** (reroutage du cavalier × 3, batterie de
pièces lourdes sur une colonne, pion clou h6 — absent du catalogue —, provocation / fixation vue du bon camp, sape de
la base de la chaîne, attaque du pion faible, éviter l'échange qui abîme la structure), **4 plans codés non crédités
au coup** (réalisation aussitôt échangée, levier crédité deux demi-coups plus tard, tenue du roi actif, et un défaut
de construction : une seconde tour sur une seconde colonne ouverte n'est pas créditée parce que l'état était déjà
vrai), **17 coups tactiques** (menaces, parades, gains de tempo) et **20 coups utiles sans plan** (défense,
prophylaxie, repli, échange, préparation). Conclusion : le plan récupérable est 13 / 50 = 26 % des non rattachés,
soit 21 points de couverture : **le plafond des plans est vers 40 % des coups calmes**, pas 100 % ; les 60 % restants
sont de la tactique et des devoirs, qui relèvent de la fiche (menace, parade, soutien) et du jugement du coup, pas
d'un plan. L'ordre des lots doit suivre ce tirage : B7, batterie sur colonne, pion clou, provocation, sape, attaque
du pion faible, B6. Marge : ± 14 points à 50 tirages.
Défaut du classeur corrigé au passage (`classify`) : six parades sur 50 (pièce attaquée par un pion qui se replie)
étaient rangées en « soutien » ou « pression », parce que les trois atomes au niveau de la pièce passaient avant la
parade ; ordre désormais : moyen de structure → parade → menace / pression / soutien → protège. Les inventaires
`inventaire-coups-*.md` ont été comptés avec l'ancien ordre : la part « défense : sauve » y est sous-estimée.
Autre observation du tirage : le classeur ne distingue pas « échec donné » et « coup calme avec échec dans la suite »
(sans effet ici).

## 3 octobre, 18 h 00 — vérité de terrain : rupture et affaiblissement

**Affaiblissement : 0 accord sur 10, inversion parfaite, et ce n'est pas une erreur de l'auteur.** Les cinq positifs
surlignaient la **reprise de pion de l'adversaire** (bxc3, exd5, axb5, fxg3, exf5) : le programme datait le plan au
moment où la faiblesse apparaît, donc au coup adverse ; l'auteur juge le coup surligné et répond non. Les cinq pièges
surlignaient la prise du camp (Fxh6, Txe5, Fxf4, Fxe4, Fxc3+), qui crée bel et bien des pions doublés ou isolés :
l'auteur répond oui, et il a raison ; la raison écrite par le tirage (« aucune faiblesse nouvelle ne tient ») était
fausse pour quatre d'entre eux (le tirage traitait comme pièges les échanges que le pipeline d'étiquettes avait
écartés pour d'autres motifs, dont le changement de matériel). Correction (`scanLine`) : le plan par échange est daté
à la prise du camp ; la fiche (`plans.mjs`) compensait déjà, elle ne change pas (banc de 40 rejoué : 0 fiche
différente). Règle d'attribution écrite au catalogue, confirmée par l'auteur.
**Rupture : 6 accords sur 10.** Positifs 1, 2, 3, 8 acceptés ; positif 9 refusé : le coup surligné était la reprise
axb3, pas la rupture …cxb3 (même cause). Pièges 6, 7 et 10 acceptés : l'auteur appelle rupture le levier qui attaque
la structure pour ouvrir des lignes, colonnes ou diagonales, même si l'ouverture n'arrive pas dans la fenêtre ; piège 4
refusé (le pion attaqué avance et contourne le levier). Planches 5 et 7 : le même coup f5 de la même partie, tiré deux
fois ; réponses non puis oui avec commentaire, on retient la réponse commentée. Définition de la rupture à trancher
avec l'auteur avant de toucher au code. Tirage : les prochaines planches positives surlignent le coup d'initiative
(levier, ou prise qui force la reprise).

## 3 octobre, 20 h 05 — rupture en deux étages : le levier suivi jusqu'à son issue

Décision de l'auteur (sur la théorie, Kmoch) : le levier est le moyen, la rupture réalisée est le levier résolu par une
prise de pion qui ouvre une ligne ; plutôt qu'allonger la fenêtre, suivre chaque levier jusqu'à l'une de ses quatre
issues (prise, contourné, dissous, tension) ; enregistrer quelle colonne s'ouvre et pour qui, sans juger ; mesurer les
colonnes d'abord, les diagonales plus tard ; la percée de finale est un autre concept. Codé dans `scanLine`
(`rupture_leviers_<camp>`, `rupture_colonne`, `rupture_colonne_adverse`, `rupture_prise`, `rupture_tour`) ; la colonne
nouvelle se lit à la fin de l'échange, après les reprises sur la même case (d5 exd5 exd5 : la colonne e est ouverte
pour les deux, pas « pour lui »). Le plan est daté au levier (initiative). La condition ancienne « tour dessus ou
faiblesse adverse » passe à l'étage exploitation. Mesure sur 2 000 positions de test (lot 2013) : 1 134 leviers dans
les 12 premiers demi-coups, issues prise 838 / contourné 197 / dissous 62 / tension 37 ; rupture réalisée 777 camps
contre 308 avec l'ancienne règle (284 communs) : **le concept devient 2,5 fois plus fréquent**, 19 % des
camps-fenêtres ; le contraste et le « bien joué » filtreront ensuite. Tirage des pièges : la raison nomme l'issue du
levier. Trois tests (planches 4 et 7, tension Espagnole). Banc de 40 : 2 fiches changent, un plan de rupture apparaît
(c3 puis c4 ouvre la colonne c), l'autre dit maintenant que la colonne e s'ouvre pour les deux.

## 3 octobre, 20 h 45 — domination : 10 sur 10 ; colonnes séparées ; recalcul v3 lancé (carte blanche DENEB)

**Domination d'une couleur** (dix planches, toutes commentées par l'auteur) : 2 justes sur 10 avant. L'auteur a
écrit les règles qui manquaient, codées telles quelles : (1) juger la position une fois l'échange terminé, reprises
intercalées comprises ; (2) j'ai encore un fou de la couleur, l'adversaire plus aucun ; (3) c'est moi qui prends, ou
qui force l'échange par une offre (daté à l'offre : Cd6+, pas exd6), jamais une reprise ni une prise forcée par un
échec ; (4) mon fou conservé n'est pas un mauvais fou (fait FOU_MAUVAIS ou trois quarts de mes pions sur sa
couleur : son seuil « la moitié » rejetait sa propre planche 6) ; (5) il est encore là au bout de la tenue. Rejouées :
10 accords sur 10, le coup clé des planches 2 et 6 est le sien. Banc de 40 : 0 fiche changée. Remarque d'affichage
de l'auteur (dame et cavalier blancs rendus comme des noirs) : glyphes pleins pour toutes les pièces, colorés par le
remplissage.
**Colonnes** : A1 (ouverte) et A1 bis (semi-ouverte) codées sur ses définitions : non disputée par une tour adverse,
sans tour à moi déjà dessus ; fait TOUR_COLONNE_OUVERTE avec `ouverte` et `disputee` ; nouveau concept
`tour_colonne_semi_ouverte` (liste, fiche, jeu de données, entraînement). Les quatre planches jugées concordent.
Effet de bord vu au banc : la preuve « apparaît tôt et tient » de la fiche portait sur tous les paramètres du fait, et
`disputee` change quand la tour adverse bouge → la phrase « dans la suite, tour en e1 sur colonne… » disparaissait ;
clé de preuve ramenée à la tour et sa case.
**Bilan des 60 planches** : 58 jugées (avant-poste 9 et blocage 5 sans réponse). Accord brut programme / auteur :
tour 7/10, avant-poste 7/9, blocage 6/9, rupture 6/10, affaiblir 0/10, domination 2/10, soit 28 / 58. Après les
corrections de la journée, rejouées sur les mêmes planches : tour 4/4 (planches testées), avant-poste 8/9 (la 5 en
question), blocage 9/9, affaiblir 10/10 par construction (coup d'initiative), domination 10/10, rupture : définition
changée (deux étages), 9/10 attendus. L'offre de l'auteur de rejuger une seconde série est acceptée : nouveau tirage
après le recalcul, sur les règles du 2 octobre, une planche par partie et par concept, coup d'initiative surligné.
**Recalcul v3** lancé à 20 h 43 (3 octobre) : 24 morceaux identiques sur les deux machines (`split`, md5 vérifié), répartis 4/5
DENEB 1/5 VPS (`repartir.sh`), sortie `reports/rescan-v3/*.v3.jsonl`, règles « 2026-10-02 ». Suite sur DENEB
(`scripts/pipeline-v6.sh`) : jugement moteur des plans ajoutés ou déplacés (reprise par plan), jeu v6, modèles v6,
courbes v5 et v6, inventaire de couverture.

## 4 octobre, 3 h 05 — nuit de calcul : recalcul fini, jugement moteur en cours sur le VPS

Recalcul v3 terminé à 21 h 59 (3 octobre), 24 morceaux recollés sur le VPS (8 fichiers, 986 465 lignes, tailles
vérifiées). Défaut : la copie des 4 morceaux faits sur le VPS vers DENEB a échoué (chemin du foyer de DENEB développé
localement), à refaire quand DENEB sera rallumé (script corrigé). Chaîne de nuit sur le VPS « full power » (accord de
l'auteur) : coach arrêté à 22 h 00, jugement moteur à 4 fils, reprise par plan : 273 000 positions jugées en 5 h
(54 000 / h, les évaluations déjà présentes dans les étiquettes sont réutilisées), fichier 6 sur 8 commencé à 3 h 00,
fin estimée vers 8 h 15. Minuterie de réveil du coach à 7 h 30 : la première s'était déclenchée aussitôt (date
passée), remise à 5 h 30 UTC. Dates : les trois entrées précédentes avaient été écrites « 2 octobre » alors que le
travail était du 3 (changement de jour non vu) ; corrigées.

## 4 octobre, 10 h 35 — matin de calcul : DENEB synchronisé, seconde série de planches, couverture avec les règles corrigées

- **Nuit** : jugement moteur sur le VPS fini à 8 h 20, 553 512 positions jugées en 10 h 20 (4 fils, évaluations des
  étiquettes réutilisées), 228 sautées ; `.juge.jsonl` complets (983 459 lignes). Coach relancé à 7 h 30.
- **DENEB** rallumé à 10 h 08 : morceaux manquants copiés, 8 fichiers v3 recollés (986 465 lignes), jugements copiés
  (tunnel à 90 Mo/s, sommes de contrôle égales) ; chaîne v6 lancée à 10 h 13 (jugement : plus rien à faire ; jeu v6
  construit en 15 min ; modèles en cours).
- **Seconde série de planches** (offre de l'auteur) : https://claude.ai/artifact/7iwNH5YSUe3iSxgvf1zXVj — 70 planches,
  7 concepts (colonne ouverte et semi-ouverte séparées), lot 2016 s0 recalculé et rejugé, parties jamais tirées, coup
  d'initiative surligné, une planche par partie et par concept pièges compris (le tirage précédent avait encore deux
  doublons côté pièges), définitions de l'auteur affichées, glyphes pleins ; réponses dans la collection `verdicts2`,
  clé `reports/verite-terrain-2-cle.json`. Les plans recalculés (`stale`) sont admis dès lors qu'ils ont été rejugés au
  même demi-coup (sinon rupture et colonne semi-ouverte n'avaient aucun positif).
- **Couverture avec les règles du 3 octobre** (`reports/inventaire-coups-6-2013.md`, parties de test du lot 2013 s0,
  47 000 coups) : plans **19,3 %** des coups calmes (18,8 % avant, sur les deux lots) ; par fenêtre de 12 demi-coups,
  64 % des camps réalisent un plan nommé (61,6 % avant). Rupture 4,3 → 4,7 % ; tour sur colonne 4,2 % → ouverte 1,4 %
  + semi-ouverte 1,7 % (le reste était des doublements et des colonnes disputées, désormais exclus) ; roi à l'abri
  2,7 → 3,1 % ; colonne contrôlée 1,0 → 1,5 %. **Défense** 5,3 → **17,0 %** et moyens 63,7 → 51,8 % : c'est la
  correction de l'ordre du classeur (la parade passe avant soutien / pression), pas un changement de jeu. La couverture
  des plans ne monte presque pas : cohérent avec le plafond mesuré le 2 octobre (vers 40 % au mieux, le reste est
  tactique et devoirs).
- **Jeu v6** (`humains-v6-juge.jsonl`, 986 465 positions) : blocage 33 825 positifs, rupture 191 112, affaiblir
  163 433, domination 5 068 (règles strictes : 6 fois moins qu'avant), baïonnette 4 445, minorité 454.

## 4 octobre, 11 h 05 — modèles v6 : des étiquettes plus justes et plus dures à prédire ; essai « une planche à Fable »

**Chaîne v6 terminée sur DENEB à 10 h 53** (jeu 10 h 28, modèles 10 h 44, courbes, inventaire). AUC (test par
parties, réseau + faits) v5 → v6 : tour sur colonne **ouverte** 0,911 → 0,848 ; colonne semi-ouverte (nouveau) 0,848 ;
rupture 0,821 → 0,809 ; affaiblir 0,752 → 0,752 ; blocage 0,826 → 0,800 ; avant-poste 0,867 → 0,852 ; domination
0,860 → 0,821 ; baïonnette 0,984 → 0,984. Lecture : l'étiquette v5 de la tour sur colonne, la plus facile à prédire,
était celle que l'auteur refusait aux trois cinquièmes (« c'est semi-ouverte », « c'est un doublement », « colonne
disputée ») ; la séparer et exclure ces cas enlève le signal facile (il existe une colonne semi-ouverte) et laisse deux
concepts voisins que le réseau confond. Même mouvement sur l'avant-poste, le blocage et la domination : les règles de
l'auteur rendent les positifs plus rares et plus exigeants. La baisse d'AUC n'est pas une régression du modèle, c'est
la mesure d'une étiquette plus juste (point 8 de la critique du catalogue : à dire dans le journal, c'est fait).
Couverture, lot 2016 s0 test (`reports/inventaire-coups-6.md`) : plans 18,9 % des coups calmes, défense 16,6 %,
moyens 52,3 % ; par fenêtre 61 à 64 % des camps selon le niveau.
**Essai « une planche à Fable »** (idée de l'auteur : il a jugé la première série en montrant les captures à Fable, qui
« s'en sort mieux en image qu'en texte ») : `scripts/planches-captures.mjs` (Chromium, une carte par image) et
`scripts/planches-fable.mjs` (claude -p --model fable, outil Read seul, une planche à la fois, définition de l'auteur et
question dans la consigne, FEN avant / après le coup clé en texte parce que l'image ne montre pas la pièce prise).
Cinq planches : 5 verdicts sur 5 égaux à la clé du programme (2 positifs oui, 3 pièges non), justifications vérifiées
case par case sur les positions : exactes, y compris les finesses (prise en passant possible, dame manquante, pion e2 à
un pas de la promotion), 16 à 38 s par planche. Convaincu : les 70 planches sont soumises à 11 h 05 (fin vers 11 h 40),
pour donner à l'auteur une troisième colonne (programme / Fable / lui) et lui épargner les cas d'accord.

## 4 octobre, 12 h 30 — Fable juge la série 2 ; trois décisions de l'auteur ; six défauts corrigés

**Idée de l'auteur** : il avait jugé la première série en montrant les captures à Fable (« il s'en sort mieux en image
qu'en texte »). Essai sur 5 planches (`scripts/planches-captures.mjs`, `scripts/planches-fable.mjs` : claude -p, modèle
fable, outil Read seul, une planche à la fois, définition + question + FEN avant / après) : 5 / 5 égaux à la clé,
justifications vérifiées case par case. Puis les 70 : 26 min, 23 s par planche, **52 accords sur 70 (74 %)**, 2 « pas
sûr », 16 désaccords (`reports/fable-planches-serie2.md`, page https://claude.ai/artifact/AJb47F5i1VEsGDaQ9zkYCU).
Dans les désaccords, Fable avait raison presque partout : cinq « pièges » étaient de vraies réalisations non calmes
(rupture 3, 4, 5 ; affaiblir 3, 10 : le tirage rangeait en piège tout ce qui n'était pas un positif calme) ; levier à
deux cibles arrêté à la première issue (rupture 2) ; tenue vérifiée sur l'état et non sur la pièce, et acquise quand
la suite s'arrête (avant-poste 5, 6, 7 ; blocage 3) ; faiblesse née d'un coup de roi adverse attribuée à mon levier
(affaiblir 2) ; pion arriéré sur colonne fermée compté (affaiblir 8) ; planches de 12 demi-coups pour des étiquettes
sur 24 (rupture 10, domination 5).
**Trois questions de définition tranchées par l'auteur devant l'échiquier** (page
https://claude.ai/artifact/1zr7cqX24kfEvAgnCx7LRs) : (1) cavalier sur la bande : oui, exclure a et h sauf pion qui
soutient déjà ; (2) colonne semi-ouverte : oui, la tour doit voir le pion cible ; (3) domination : non à la lettre
seule : « la lettre décrit un fou sans vis-à-vis (moyen), pas une domination ; il faut des cases faibles de cette
couleur et une pièce qui les exploite ; l'origine tactique n'est pas le problème ».
**Code** (`plan-concepts.mjs`, `minor-pieces.js`, `verite-terrain.mjs`) : tenue par pièce (case pour mineure et dame,
colonne pour tour, rangée pour la septième) et fenêtre de tenue entière exigée ; levier multi-cibles ; faiblesse née
d'un coup de pion adverse ou de ma prise de pion, pion arriéré exposé seulement ; `fou_sans_vis_a_vis` (moyen) et
`dominer` = moyen + exploitation ; cavalier de bande soutenu ; `degagee` sur le fait tour (vérifié au coup, pas
pendant la tenue : Fb2 devant Tb1 trois coups plus tard n'annule pas la prise de colonne) ; tirage : 24 demi-coups,
jamais de piège là où le programme réalise le concept, raison « colonne bouchée ». Tests : 274, dont dix tirés des
désaccords (`tests/serie2-fable.test.js`, 24 demi-coups des étiquettes d'origine). Banc de 40 : une fiche perd un
« À surveiller » dont la tenue n'est plus prouvable dans la suite du moteur.

## 4 octobre, 14 h 00 — étiquettes v4 (règles du 4 octobre) : recalcul, jugement, chaîne de l'après-midi

Recalcul v4 lancé à 12 h 31 sur les 24 morceaux (DENEB 4/5, VPS 1/5), fini à 13 h 49 ; incident : vingt processus sur
DENEB au lieu de quatorze (« sinon je freeze ») → six mis en pause à 12 h 52, reprise à 13 h 30 ; `repartir.sh` a
maintenant une file d'attente avec plafonds (DENEB 14, VPS 3). Recollage à 13 h 50 sur les deux machines (tailles
vérifiées). **Jugement moteur** des plans qui ont bougé par rapport à la nuit : 2 135 positions sur le VPS (3 min),
10 654 sur DENEB (5 min) : la quasi-totalité des jugements de la nuit reste valable (reprise par plan). Modèles v7 et
inventaire lancés sur DENEB à 13 h 55 ; troisième série de planches (lot 2016 s1, graine 3, 7 concepts) et Fable sur
le VPS dans la foulée.
**Comptes v4 par rapport aux étiquettes d'origine** (tous demi-coups, calmes ou non ; `reports/rescan-v4/stats-total.json`) :
tour sur colonne ouverte gardées 108 429 (v3 : 212 852) ; semi-ouverte ajoutées 153 275 (v3 : 287 767) ; cavalier sur
avant-poste gardées 62 595 (v3 : 96 085) ; blocage 65 083 (v3 : 106 285) ; domination 8 665 (v3 : 31 493) ; rupture et
affaiblir redatées par construction. Les règles du jour (tenue sur la pièce avec fenêtre entière, colonne vue par la
tour, bande soutenue, domination exploitée) retirent donc un tiers à deux tiers des étiquettes d'installation : c'est
attendu, elles comptaient les passages et les fins de suite.

## 4 octobre, 15 h 15 — série 3 : 90 % d'accord, la boucle d'affinage s'arrête ; modèles v7 ; courbes v1 → v7

**Série 3** (étiquettes v4, lot 2016 s1, 70 planches, Fable) : première passe à 14 h 25, 57 appels sur 70 refusés par le
service en quatre minutes et comptés « oui » par le script (la consigne contient « VERDICT : oui ») : faux 59 %
détecté avant envoi ; script corrigé (verdict en tête de réponse, erreurs à part, arrêt après trois refus) ; seconde
passe à 14 h 43 sur les 57 : 0 refus. **Résultat : 63 accords sur 70 (90 %)** contre 52 sur 70 (74 %) la veille au
matin et 28 sur 58 (48 %) avec l'auteur sur la première série ; blocage, rupture et colonne ouverte 10 / 10. Les sept
désaccords (page publiée, voir la mémoire de reprise) sont des lectures d'intention (coup « d'abord tactique »,
tour qui quitte la colonne après la tenue) et une nuance de règle : une tour adverse DERRIÈRE son propre pion sur la
colonne (Ta1 derrière a4) ne la « tient » pas (semi-ouverte 8) : à corriger au prochain lot. **Condition d'arrêt
atteinte** (≥ 90 %) : la boucle d'affinage des sept concepts s'arrête ici ; l'auteur l'avait demandé (« est-ce
rentable ces planches ou on fait du surplace »).
**Modèles v7** (étiquettes v4, 10 h 44 → 14 h 26) : AUC réseau + faits v6 → v7 : tour 0,848 → 0,836 ; semi-ouverte
0,848 → 0,843 ; rupture 0,809 → 0,812 ; affaiblir 0,752 → 0,746 ; blocage 0,800 → 0,800 ; avant-poste 0,852 → 0,857 ;
domination 0,821 → 0,829 (200 positifs de test seulement) ; baïonnette 0,984. Positifs du jeu : tour 45 319,
semi-ouverte 50 598, avant-poste 32 574, blocage 32 221, rupture 192 569, affaiblir 138 747, domination 2 090.
Couverture avec les règles du 4 octobre (lot 2016 s0 test) : plans 18,0 % des coups calmes (18,9 % avec les règles
du 3 : les faux positifs d'installation sont partis), défense 16,8 %, moyens 53,1 %.
**Courbes v1 → v7** publiées à la demande de l'auteur (https://claude.ai/artifact/8rTn6SUd9JBC6DD5M7V81B) : accord des
étiquettes 48 → 74 → 90 % ; erreurs graves de la fiche 9 → 0 ; temps de fiche 6 → 3,2 s ; couverture 10,5 → 18 %
(plafond vers 40 %) ; AUC 0,91 → 0,84 sur la tour (étiquette plus vraie, plus dure). Lecture : ce qui a progressé,
c'est la vérité des étiquettes et la fiche ; la couverture et l'AUC ne sont pas les bons indicateurs de ce travail.

## 4 octobre, 19 h 00 — cent fiches relues par Fable : onze erreurs graves trouvées, dix corrigées le jour même

Banc de cent (40 + 60 réelles) regénéré à 15 h 46 avec le coach du jour ; `scripts/fiches-fable.mjs` : image de la
position, FEN, texte de la fiche, Fable liste les GRAVES (affirmation fausse sur l'échiquier, conseil qui perd du
matériel ou mate, menace inventée) et les mineures ; 70 à 135 s par fiche ; interrompu une fois par la limite d'usage
(reprise `--from`), un appel expiré resoumis. **99 + 1 fiches relues : 11 fiches avec au moins une grave (12 graves),
256 remarques mineures.** Chaque grave vérifiée sur la position, souvent avec la ligne du moteur : **10 réelles**, toutes
corrigées, testées (275 tests), banc de 40 rejoué à chaque fois, coach relancé :
1. échange intercalé (fiche 15) : plan daté à ma prise que son pion reprend (Cxb5), pas à la reprise Dxc1 ;
2. attaquant cloué (33) : attaquants de la case d'arrivée = prises légales ;
3. plan type de structure non retourné (33) : cases miroir quand la structure appartient aux Noirs ;
4. menace « non parée » (42) : parée dès que son premier coup ne s'exécute plus ;
5. manœuvre qui coûte du matériel dans la ligne (65) : plus proposée ;
6. « Évite X : tu perds du matériel » (67) : seulement si la ligne est 1,5 pion moins bonne ;
7. menace préparée par un coup qui perd une pièce (84, 92) : la préparation doit tenir debout après mon coup ;
8. « menace » qui n'était que la fuite d'un cavalier en prise (88) : gain immédiat ou mat exigé ;
9. fou « attaquant » un pion d'une autre couleur de cases (95) : cible vue en diagonale ;
10. rupture « ouvrant la colonne c » ouverte par un autre échange (99) : colonnes des deux pions du levier seulement.
Discutée (86) : « Cd4 pare cette menace », Fable voit Fxd4 puis le retour de la menace ; la ligne du moteur ne le montre
pas dans l'horizon. Mineures fréquentes et justes : « dans la suite, avant-poste en b6 » annoncé avant d'être acquis,
« bouclier affaibli » lu dans une suite non montrée, « s'il prend, tu reprends et gagnes 2 points » quand il ne prendra
pas. Page : https://claude.ai/artifact/KwnhALPJ5wy645e7ur3MW6. Le « zéro sur 100 » après corrections n'est pas mesuré :
seconde passe de relecture à décider par l'auteur (deux heures de Fable).

### 4 octobre 2026, soir : « son pion en h5 est une cible » (h5 vide)

Partie réelle de l'auteur (Française avance, 9e coup) : la fiche disait « Il y a du matériel à gagner : son pion en h5 est
une cible », alors que h5 était vide : le pion venait de h7 par …h5, dans la ligne du moteur. La phrase nommait la case
de la prise, pas la case actuelle de la pièce. Correction : la pièce prise plus tard est suivie en arrière jusqu'à sa case
d'aujourd'hui ; si elle n'est pas encore là, on ne parle plus de cible (« venu de h7 : c'est l'adversaire qui l'amène là »)
et l'indice devient « pas de prise à préparer tout de suite ». Test `tests/fiche-cible-future.test.js`. Famille à ajouter
au relecteur : tout objet nommé dans la fiche doit exister sur l'échiquier au moment où elle est lue.

### 5 octobre 2026, matin : le mat forcé

Journal de la partie du 4 au soir : mat en 1 disponible, le juge disait « Ta1 : bon coup, presque aussi bon que Db7# »
(le mat était comparé comme un score ordinaire, saturé à 100 % des deux côtés) ; la fiche, avec un mat en 2, parlait de
« pression » et de « pion isolé c7 ». Corrections : juge → mat raté = erreur (« tu avais un mat en N par X »), mat gardé
mais plus long = imprécision, mat aussi court = bien joué ; fiche → raison « mate » avant tout, plus de plan type, de
« se valent presque » ni de « à surveiller » quand le mat est là. Tests `tests/mat-force.test.js` ; banc de 40 inchangé.

### 5 octobre 2026, matin : deux récits à la main, test du modèle « partir des coups joués »

Opéra 1858 : 23 phrases, 10 mélodies, 5 faits statiques, 8 tactique, 0 moteur seul. Fischer – Spassky 1972 (6) : 16 phrases,
14 mélodies, 1 fait, 1 tactique, 0 moteur seul. Aucune phrase contredite par les références. Nos détecteurs sur les mêmes
parties : Morphy → que des « pression / menace / soutien » ; Fischer → dix plans sur 41 coups blancs, mais jamais le
pourquoi (Fb5 « développement » au lieu de « empêche …Cd7 » ; Dh3 « pression e6 » au lieu de « transfert vers l'aile roi »).
Trous confirmés (après Chernev la veille) : intention, prophylaxie, bilan comparé, transfert de pièces, chaîne qui prépare
une rupture, pions pendants ; règle de tenue qui efface la tour sur la colonne ouverte (12.O-O-O chez Morphy).
Pages : docs/recits/opera-1858.html, docs/recits/fischer-spassky-1972-6.html. Décision de l'auteur attendue.

### 5 octobre 2026, soir : le catalogue des mélodies, consolidé seul

L'auteur a validé l'idée (« le pourquoi est la clé ») et délégué la consolidation. Catalogue de 41 mélodies en six
familles (docs/MELODIES.md, page publiée), chacune avec : ce que c'est, l'affirmer si, se taire si, réponse enseignée,
source théorique, exemple, fréquence chez Chernev, état du vocabulaire (10 acquises, 13 partielles, 18 absentes).
Étiquetage à la main des 226 commentaires de fond de Chernev : 189 rattachés (84 %) (reports/chernev-melodies-tags.json).
Les plus fréquents : frapper le centre 24, préparer la rupture 11, accumuler sur un point 11, roi à l'abri 11, libérer
une pièce 11. Ordre de réalisation proposé (fréquence × absence) : préparer la rupture, empêcher un coup, garder sa bonne
pièce, clouer puis charger, supprimer le défenseur, retard de développement, fianchetto, batterie vers h7, bilan comparé,
libérer une pièce. Règle de sûreté en tête de catalogue. Nvidia abandonné (trop lent) ; images et comparaison de juges
restent dans le code. Prochaine étape : corrections de l'auteur, puis définitions sur ses mots, puis planches.

### 6 octobre 2026, matin : POC « coach d'ouverture » sur la Défense française

Demande de l'auteur : « un POC où le coach parle d'intention, de menaces, de plans ; on ne lit plus le premier coup de
Stockfish ». Choix : partir des ouvertures, « des gammes », une seule pour commencer.
Fait : `coach/openings/francaise.mjs`, livre des intentions (60 positions : avance, échange, Tarrasch, classique,
Winawer, Rubinstein), avec pour chaque position le sens du dernier coup, la menace type, le plan (coups recommandés et
pourquoi), les erreurs fréquentes et, aux carrefours, le schéma des deux camps et les coups types des plans.
`coach/opening-intent.mjs` lit les coups JOUÉS, retrouve la position par FEN (interversions comprises), dit le sens du
coup adverse, explique une sortie de théorie (une fois), et choisit le conseil : en livre, le coup du plan s'il est dans
les trois premiers du moteur à moins de 0,3 ; hors livre, le premier coup type du plan encore à jouer, même règle ;
les coups d'attaque attendent le roque sauf si le moteur les met premiers. Branché dans `brief.mjs` AVANT la raison
moteur ; la tactique (pièce en prise, menace, gain, mat) garde la priorité, le résumé d'ouverture suit alors en une phrase.
Vérification du livre au moteur (profondeur 18) : 97 coups de plan sur 99 à moins de 0,4 du meilleur ; 12 erreurs sur 12
confirmées (trois retirées en route). Deux parties jouées (élève 1320 contre 1500, premiers coups imposés), rejouées
AVANT/APRÈS : `scripts/partie-avant-apres.mjs`, page `scripts/poc-ouverture-page.py`. Les adversaires ont quitté le
livre au 3e coup (…Ce7, …dxe4) : le plan guide alors le conseil (« c3 soutient la base d4 », « Cb3 tient d4 et libère le
fou c1 », « O-O met le roi à l'abri avant d'attaquer »). Défauts vus : « a3 prépare b4 » quand b4 est jouable ; h4 au 8e
coup roi en e1 (le moteur le met premier) ; milieu de jeu toujours plat (chantier des mélodies) ; livre vite dépassé,
une ouverture sur vingt. Défaut corrigé au passage : « Fg5 préparerait Fxd8 prend la dame » (menace parable par deux coups
gratuits : filtrée, `tests/menace-preparee-parable.test.js`).

### 6 octobre 2026, après-midi : les arbres stratégiques appris (deux passes)

Après le rejet du POC d'ouverture (« heuristique hardcodée »), l'auteur a précisé sa vision : regarder comment les grains
s'enchaînent dans des milliers de parties humaines, arbres bicolores portant menaces, contrôle et étiquettes, vectorisés,
regroupés, inventoriés, nommés, interrogeables ; aucune règle écrite. Spec consolidée en brainstorming (docs/ARBRES.md) :
grains relationnels (zones relatives aux rois, cibles, sans cases), fenêtres de 16 demi-coups vues du camp qui joue, AVENIR
(faits des 10 demi-coups suivants) comme définition opérationnelle de l'intention, encodeur transformeur entraîné à prédire
l'avenir + voisinage temporel, témoin coups seuls, FAISS, k-moyennes, critères soutien/compacité/prévisibilité, nommage par
LLM vérifié par les comptes. Corpus : Lichess Elite 2021-01..03 (1,65 M parties 2400+). Passe 1 (88 k parties, toutes
phases) : AUC 0,763 contre 0,728 (témoin) ; arbres dominés par « rupture » et finales ; sans étiquettes de plan, même AUC.
Passe 2 (136 k parties, milieu de jeu, 300 arbres à deux niveaux) : AUC 0,743 contre 0,703 ; arbres plus variés ; retrouvés
seuls : attaque de minorité, libération en hérisson, centre bloqué/ailes opposées, lutte pour la colonne ouverte, attaque du
pion isolé, assaut par la colonne ouverte. Reste : doublons « chasse au roi par échecs », finales de pièces lourdes, fenêtres
de 40, accord avec les parties annotées, lecture à l'aveugle par l'auteur, branchement au coach. Rappel reçu (3e fois) :
DENEB ≤ 12 processus en nice 19 ; VPS chargeable à fond.

### 6 octobre 2026, soir : passe 3, échelle 40, accord Chernev ; décision des deux étages

Passe 3 (milieu, échecs répétés écartés, 200 arbres) : AUC 0,731 contre 0,691 (témoin) ; 80 arbres nommés par Fable
(DeepSeek sans crédit, Groq jugé faible, Nvidia muet) : 51 de milieu de jeu mais souvent des situations génériques.
Échelle 40 : 281 k fenêtres, AUC 0,667, non concluant. Accord avec Chernev (57 paires, Fable) : même idée 2 %, voisine
42 %, rien à voir 56 % ; le test compare le but d'un coup au contexte de seize demi-coups, à refaire au bon grain.
Décision avec l'auteur : étage 1 = apprendre sur l'échiquier brut (auto-supervisé, 1,65 M parties, sans étiquettes en
entrée ; registre Maia, pas AlphaZero : lire, pas jouer) ; étage 2 = greffer les noms (fenêtres annotées, plans, arbres
nommés → sondes linéaires ; l'explicable d'abord). Prérequis : corpus annoté multi-auteurs (études Lichess, domaine public).


## 6 octobre 2026, 21 h 35 : étage 1 lancé et mesuré ; corpus OTB de maîtres ; corpus annoté récolté

Fait le soir même (« C'est parti, VPS, DENEB gogogo ») : scripts/plateaux.mjs (72 octets par demi-coup, aucune étiquette),
scripts/arbres/train-brut.py (positions brutes → transformeur ; prochain coup + voisinage ; v2 : cases jouées des 10 prochains
demi-coups, voisin à 8), scripts/arbres/sonder.py (sonde figée → 141 faits d'avenir, témoins), scripts/arbres/index-brut.py,
scripts/arbres/realigner-ids.mjs (ids numériques des grains 2021-02 réparés, 48 000/48 000). Modèle brut 1 : 348 k parties
Lichess, 7,7 M fenêtres, 33 min GPU ; coup exact 21 %. Sonde (parties jamais vues) : hasard 0,50 ; brut linéaire 0,71 ; brut
+ couche cachée 0,72 ; sac de grains sans modèle 0,74 (> modèle à grains bout en bout 0,73 : le transformeur sur grains
n'ajoutait rien) ; brut + sac 0,76 (meilleur score, les deux sont complémentaires). Groupes bruts dominés par la reprise
immédiate (défaut de l'objectif « coup suivant ») → v2 à horizon 10 lancée (d 192, 6 couches, 4 époques). Second corpus :
LumbrasGigabase OTB Elite > 2400 (864 k parties, CC BY-NC-SA, via Mega + megatools sur DENEB), plateaux extraits (826 k),
modèle OTB en entraînement ; grains sur 13 200 parties OTB (VPS) pour sonder. Corpus annoté : 314 études, 97 gardées,
84 uniques, 16 158 commentaires de fond (Chernev, Capablanca, Steinitz, Morphy, Fischer, amateurs). Doc : ARBRES.md § 13 +
figure arbres-10. DENEB : 12 processus nice 19 respectés.

**6 octobre, 23 h 10.** Modèle OTB (826 k parties, 18,5 M fenêtres, 47 min) : sonde 0,716 sur OTB, 0,729 sur Lichess ; modèle
Lichess : 0,724 / 0,711 ; les espaces se transfèrent. Version 2 (horizon 10, d 192, 6 couches) : coup exact 25 %, sonde
0,750 seul (> sac 0,744 > modèle à grains 0,731), 0,773 avec le sac ; premier arbre « levier → doublon, colonne semi-ouverte,
avant-poste ». Remarque de l'auteur : « quoi qu'on fasse, on arrive au même chiffre » ; détail par fait : 25 faits > 0,85
(évidents : roque, développement), 79 entre 0,60 et 0,75 (bruit : échange, manœuvre, case faible). Conclusion : la cible
plafonne, pas les modèles. Proposé pour demain : les mots des maîtres comme cible au grain du coup (84 études), avenir
à trente demi-coups, lecture à l'aveugle. Données DENEB : data/brut, data/brut2, data/brut-otb (modèles, vecteurs, sondes,
arbres), data/grains/otb-2400.s*.jsonl ; VPS : data/grains/otb-2400.*, data/reference/annotes/.

**6 octobre, 23 h 45 : épreuve des mots des maîtres.** 84 études, 1 076 chapitres, 9 914 commentaires classés par Fable
(six travailleurs, 40 min) en 17 thèmes ; sonde par étude (5 plis). AUC moyenne : hasard 0,49, sac de grains 0,64, traits
triviaux 0,66, brut v1 0,67, OTB 0,68, brut v2 0,68. L'espace lit les maîtres mieux que nos étiquettes mais à peine mieux que
le numéro du coup et le matériel ; signal réel sur aile dame, levier, attaque de roi, case faible, défense du roi ; rien sur
prophylaxie, initiative, échange, tactique. Décision proposée : changer d'échelle (fenêtres 40-60, modèle plus large, dix
époques, deux corpus) plutôt que l'objectif ; l'épreuve des mots devient le juge. Scripts : annotes-coups.mjs,
themes-fable.mjs, themes-lexique.py, grains-coups.mjs, sonder-mots.py. v3 (horizon 30) en cours, résultat à suivre.
**7 octobre, 0 h 15 : fin de nuit.** v3 (horizon 30, voisin 16, d 192, 6 couches, 45 min) : coup exact 24 %, avenir 0,757
seul / 0,776 avec sac, mots des maîtres 0,681 (+0,004 sur v2). Tout consigné, plus rien ne tourne. Recommandation : changer
d'échelle (fenêtres 40-60, modèle large, dix époques, deux corpus, GPU loué), juge = épreuve des mots.

## 7 octobre 2026, soir : H100 louée (RunPod), modèle à l'échelle, correction d'une annonce trop rapide

Pod RunPod H100 SXM (3,49 $/h, Islande, volume réseau 60 Go, clé SSH du VPS ; plugin runpod@runpod installé pour Claude Code,
OAuth non fait). Transferts DENEB → pod 5 Mo/s par flux (15 en quatre). train-brut.py : --amp, préchargement, --resume
(sauvegarde par époque, planificateur avancé). Modèle échelle (W 40, d 384, 8 couches, horizon 30, 6 époques, 348 k parties,
2 h 20) : coup exact 27,1 %, avenir 0,763 (0,780 avec sac). Mots des maîtres : 0,803 annoncé comme émergence, puis corrigé :
sur les mêmes 4 284 coups (après le 39e demi-coup), v2 d'hier fait 0,785 → gain réel +0,02 ; le milieu de jeu se lit à 0,80
loin du trivial 0,66, thèmes abstraits compris. Leçon notée : comparer à population égale avant d'annoncer. Erreurs du soir :
pkill -f a tué ma propre relance (GPU à vide 20 min, vu par l'auteur) ; point de 20 h manqué ; « réponds quand je t'interroge ».
OTB à l'échelle lancé 22 h 02 (6 époques, ~20 $, crédit 25 $), sondes en file. Résultats VPS : data/brut-x/.
**8 octobre, 0 h 55.** OTB à l'échelle fini (2 h 40, plus vite que prévu) : coup exact 26,7 %, avenir 0,724, mots des maîtres
0,806 vs Lichess 0,804 à coups égaux → maîtres et blitz se lisent pareil. Résultats et plongements annotés rapatriés
(data/brut-x, data/brut-otb-x). Indexation des arbres du modèle échelle lancée sur le pod (inventaire à rapatrier), puis le pod
est à ARRÊTER par l'auteur (bouton Stop).

## 8 octobre 2026, soir : le lecteur dans le coach (étage 2, première greffe)

L'auteur a joué et « n'a vu aucune différence », puis « manœuvre ne veut rien dire », puis « aucune explication d'intention ni
de menace, rien d'éclairant… très décevant ». Fait en réponse : scripts/arbres/lecteur.py (sonde des thèmes des maîtres +
mode serveur, port 8002, relais W16 brut3 → W40 brut-x à partir du 40e demi-coup) ; coach/lecteur.mjs (client, COACH_LECTEUR=1) ;
coach/intention-lecture.mjs : les cases de départ et d'arrivée prédites par la tête horizon (30 demi-coups) sont reliées aux
coups légaux (score p_départ × p_arrivée), chaque coup est décrit mécaniquement (prise, échec, pièce attaquée et défendue ou
non, levier, approche du roi) et une phrase d'ensemble est donnée quand les cases convergent (attaque du roi, aile) ; aucune
règle ne choisit le plan. Fiche : « Ce que je vois » en tête. Vérifié sur Fischer–Spassky 1972 (f5 levier avant 26.f5 ; Rf7 ;
cases f5/g3) et sur la partie de l'auteur (Ne4, Nf6, Nxe4 annoncés avant d'être joués). Limite : phrases au niveau du coup,
pas encore du plan ; arbres biaisés finales (160/200) à refaire en milieu de jeu. Page de lecture :
https://claude.ai/artifact/1Nc85Rb64nkZy6enMpQGnw ; arbres échelle nommés : https://claude.ai/artifact/LfE1M4ZUwt9tCyJCVZ9dUN.
**8 octobre, soir, suite.** Suite probable (déroulé gourmand des têtes « prochain coup », python-chess dans le service) affichée
en tête de la fiche ; sur Fischer–Spassky après 25...a5, les trois premiers demi-coups prédits sont ceux de la partie. Le modèle
comme joueur (scripts/arbres/joueur.py, coup le plus probable sans calcul, ouvertures humaines, Stockfish bridé 50 ms) : 1/20 à
1320, 1/20 à 1500, 1,5/20 à 1800, 0,5/20 à 2100 → moins de 1200 Elo : il lit, il ne calcule pas ; Stockfish garde la tactique.
Demande de l'auteur : ne plus lui lister de coups, donner des résultats et des phrases ; il attend la suite et jugera en jouant.

## 8 octobre 2026, 5 h 30 : clôture du projet (décision de l'auteur)

Après la mise en ligne du lecteur (modèle brut + sonde des maîtres + suite probable + intention/menace mécaniques), l'auteur a joué
et conclu : « rien n'a changé, coach insipide », « mauvais joueur, mauvais coach, j'arrête les frais », « jamais une IA n'égalera
un coach humain ». Le projet est clos à sa demande.

État laissé : branche coach-grounded poussée (tout commité) ; site en ligne inchangé (coach + jugement Stockfish + lecteur) ;
service lecteur arrêté sur le VPS pour libérer la mémoire (COACH_LECTEUR reste à 1 dans .env, le coach se tait sans service) ;
pod RunPod arrêté par l'auteur, volume réseau chess_storage (60 Go, ~4 $/mois) à supprimer par lui s'il ne compte pas reprendre ;
clés Nvidia collées dans le chat à révoquer. Données : DENEB data/{grains,plateaux,arbres*,brut*,otb}, VPS data/{brut-x,brut3,
reference,lecteur}.

Acquis mesurés : grains > coups seuls (+0,04 AUC) ; sac de grains = modèle à grains ; échiquier brut auto-supervisé lit les mots
des maîtres mieux que les étiquettes (0,68 contre 0,64 sur tous les coups ; 0,80 en milieu de jeu contre 0,66 au trivial) ;
l'échelle (H100) n'apporte que +0,02 ; maîtres OTB et blitz se lisent pareil ; le modèle comme joueur < 1200 Elo.
Non obtenu : la formulation du but (le plan au-delà du coup), seule chose qui aurait rendu le coach éclairant.

## 8 octobre 2026, après-midi : réorientation en plateforme éducative ; assistant d'ouverture sur la Française

Décision de l'auteur (matin) : plus de coach IA ; une plateforme éducative ouverte pour les clubs, où des enseignants signent
leurs explications coup par coup, l'apprenant choisit son professeur, l'IA ne fait que des brouillons vérifiés. Maquette
`ouverture.html` (échiquier compact, récit du dernier coup, coups du livre avec pourquoi, flèches vert/bleu/rouge, aperçu au
survol, clic pour jouer, fautes typiques jouées avec punition Stockfish narrée pas à pas, bilan, rembobinage vers le bon coup,
mise en page téléphone). Jugement de l'auteur : « le format me convient parfaitement, c'est la ligne dont je rêvais ».
Livre de la Française prolongé par `scripts/ouvertures/etendre.mjs` (Stockfish multipv 12 → Fable rédige → vérification) en
trois passes (120 + 60 + 150 requêtes Fable, zéro échec de rédaction) : 60 → **390 positions**, toutes les lignes jusqu'au
10e coup, 330 brouillons signés « IA, à relire », punitions recalculées (`livres/francaise-punitions.js`). Livre servi :
`livres/francaise.js` (assemblé par `construire.mjs` ; nginx refuse .mjs et data/), source des brouillons versionnée dans
`livres/sources/francaise-ext.json`. Prochain : relecture par l'auteur, modèle de données enseignants/versions, autres ouvertures.

**8 octobre, 20 h 10 : deuxième livre, la Partie italienne.** Noyau de 29 positions écrit à la main (coach/openings/italienne.mjs),
vérifié au moteur (54/60 plans, 45/49 fautes, écarts corrigés), prolongé en trois passes (330 requêtes Fable, zéro rejet) :
**305 positions**, lignes jusqu'au 10e coup, 428 punitions. Assistant multi-livres : livres/index.js, bascule automatique selon
la position, sélecteur, adversaire d'entraînement qui tire son livre au sort après 1. e4. Bug corrigé : chemins relatifs de
l'index (échiquiers gris) ; punitions : fins de partie gérées. Restent 222 variantes secondaires non écrites dans l'Italienne.
**8 octobre, 21 h 25.** Italienne recentrée : les portes vers d'autres ouvertures (Espagnole, Petrov, Philidor, Écossaise,
viennoise, Sicilienne, Française) sont marquées `porte` dans le livre et ne sont plus prolongées ; les 206 brouillons qui en
dépendaient sont retirés (gardés dans l'historique Git pour amorcer ces livres). Italienne finale : **179 positions**, 10e coup
partout, 269 punitions. Deux livres en ligne : Française 390, Italienne 179.

## 17 octobre 2026, nuit (2 h – 6 h, carte blanche) : la plateforme enseignants prend corps

Décisions de l'auteur consignées dans la spec (§7) : comparaison de deux professeurs, ajout libre de coups (principal validé),
publication libre, brouillons IA visibles, CC BY-SA 4.0, champ vidéo ; connexion par courriel + mot de passe sur invitation.
Fait dans la nuit : migrations 0002/0003 (arbre, explications versionnées, sessions, invitations, rôle validateur), import des
deux livres (571 positions, 2 144 coups, 569 explications IA), comptes (scrypt natif, cookies HttpOnly), API complète
(coach/plateforme.mjs), pages connexion/administration, panneau latéral sensible au rôle, nginx : /api/ proxifié et
auth_request sur editeur.html/admin.html, éditeur d'explications (agent : modes, démonstrations, aperçu, historique,
remarques), vérifications dans Chromium (5 pages sans erreur, scénario enseignant complet), export base → livres statiques.
Régression trouvée et corrigée : le conteneur API Alpine n'avait pas Stockfish depuis le 9 octobre (le juge tuait le serveur) →
image Debian + binaire de l'hôte monté + sonde de santé avec redémarrage, et le moteur ne fait plus tomber le processus.
Piège noté : `sed -i` sur un fichier monté seul dans un conteneur (nginx.conf) casse le montage.
**17 octobre, 2 h 35 : fin de la nuit.** Ajouts : assistant sur l'API (choix/comparaison de professeurs, annotations et
séquences de l'auteur, bouton Modifier), accueil, guide de l'enseignant, 404, administration avec auteur de référence,
réordonnancement et changement de type des coups, comparaison de versions, sauvegarde quotidienne, README. Contrôles :
9 pages sans erreur dans Chromium, scénario enseignant complet, test API de bout en bout, 298 tests. Reste : courriels
(SMTP), glisser tactile, annotations dans la comparaison, premier enseignant réel. Invitation admin de l'auteur en attente.

## 17 octobre 2026, après-midi : troisième livre, la Partie espagnole

Décision de l'auteur (après la refonte visuelle, le choix des pièces et le son des coups) : ajouter l'Espagnole, l'ouverture
la plus instructive après l'Italienne et déjà annoncée comme « porte » dans ce livre. Noyau écrit à la main par le pilote
(`coach/openings/espagnole.mjs`) : Morphy, Espagnole fermée jusqu'à la Tchigorine 11.d4, Ouverte, Berlinoise, variante
d'échange, Steinitz différée avec l'Arche de Noé. **Relecture par la session Expert échecs** : 6 coups illégaux dans les
fautes (Fxc6 alors que …b5 bloque la diagonale, Fa2 pion en a2, cavalier c6 cloué…), 3 « pourquoi » faux (après Te1, la
réfutation de …Cxe4 est Txe4 ! et non d4), menaces de l'échange et de l'Arche de Noé réécrites, 8 positions manquantes
rédigées par l'expert (lignes …b5, Steinitz différée 5.c3, échange 5…f6, finale berlinoise). **Bug corrigé dans
`scripts/verif-livre-ouverture.mjs`** : un SAN illégal n'était jamais dans le top 5 du moteur et passait donc pour une
« faute confirmée » ; il est désormais signalé ILLÉGAL. Noyau final : 48 positions, 106/106 plans et 78/78 fautes confirmés
(prof. 16), 0 illégal. Extension `etendre.mjs` en deux passes (2 × 150 rédactions IA, 0 échec), **342 positions** jusqu'au
10e–11e coup, 1 378 coups cités tous légaux, **520 punitions** (prof. 16). Reste une frontière de ~150 positions profondes
pour une passe ultérieure. Livre enregistré (`livres/index.js`, signature `e4 e5 Nf3 Nc6 Bb5`), importé en base, en ligne.
**17 octobre, soir.** Passe 3 d'extension (go de l'auteur) : **492 positions** (48 à la main + 444 rédactions IA), 1 969 coups
cités tous légaux, **730 punitions** recalculées ; reste une frontière de ~190 positions au-delà du 10e coup, laissée là.
Même jour : son des coups mesuré hors-ligne (crête 0,14 → 0,48, 23 → 103 ms) après que l'auteur l'a trouvé inaudible —
l'enveloppe exponentielle vers zéro vidait le son en quelques millisecondes.
**17 octobre, soir : lignes principales profondes (Française).** Constat sur l'Espagnole : les variantes sont bien explorées
(jusqu'à 4 écarts du principal) mais tout s'arrête au 10e coup. Politique retenue avec l'auteur : prolonger la ligne principale
et les variantes de 1er niveau (là où la littérature est solide) jusqu'au 15e coup, sans brancher, et laisser le reste au 10e.
Option `--niveau-max` ajoutée à `etendre.mjs`. Française : **120 positions ajoutées** (ligne principale au 15e coup), 163 punitions
ajoutées, **rien d'existant modifié** (contrôle : 392 anciennes intactes, 502 punitions intactes). Piège évité : `livres/francaise.js`
est désormais régénéré chaque nuit depuis la base (export) — on n'y a ajouté les nouvelles positions qu'en annexe de l'export, et
c'est l'import en base qui fait foi.
**17 octobre, soir : lignes nommées manquantes de la Française (Expert échecs).** Constat de l'auteur après le nommage ECO :
une quinzaine de variantes qu'un joueur de club rencontre n'avaient aucune position (Alekhine-Chatard, Burn, MacCutcheon,
Tarrasch 3…Fe7 et 3…a6, Fort Knox, Winawer 6…Dc7 / 6…Da5 / 5…Fa5 / 4.Ce2, Wade, est-indienne, deux cavaliers,
franco-sicilienne). Rédigées par la session Expert échecs : 38 entrées (dont 8 positions de liaison pour éviter les trous),
chaque coup légal, chaque plan dans le MultiPV de tête et chaque faute confirmée à Stockfish 19 prof. 20 MultiPV 4 — le
moteur a corrigé l'expert lui-même trois fois (dans la MacCutcheon, …Cfd7 et …Ce4 après e5 perdent la dame par Fxd8 ; Dg4 ??
dans le Chatard accepté perd la dame ; bxa5 dans l'arménienne n'est pas une faute). Intégration additive : **35 entrées en
annexe** du livre exporté (512 → 547, anciennes intactes), les 3 positions déjà expliquées reçoivent leurs 5 fautes nouvelles
par fusion SQL dans l'explication IA existante. **42 punitions** (prof. 18) fusionnées (665 → 707) ; deux fautes sous le seuil
de 0,3 à cette profondeur retirées (cxd4 après Fe2 : 0,22 ; 2…Cf6 dans l'est-indienne : 0,27). Arbitrages du pilote : exf6
(Chigorin, à 0,34 du meilleur) gardé en plan car variante nommée et position toujours favorable ; …Fb4 des deux cavaliers
(0,62) classé en faute avec l'explication (une Winawer sans d4 ne marche pas). Française en base : 553 positions.
**17 octobre, soir : relecture des 13 schémas « ce que chacun va chercher ensuite » (Expert échecs).** Go de l'auteur après avoir
trouvé le bloc « enrichissant » mais demandé d'où il venait (réponse : brouillon IA, théorie classique reformulée, non vérifiée
phrase à phrase). Relecture de fond du premier noyau de la Française, moteur sur chaque affirmation vérifiable : une vingtaine de
corrections, dont quatre listes réécrites. Les plus graves étaient des copier-coller du tronc 3.Cc3 vers des positions filles où
ils n'avaient plus de sens : la Classique après Fxe7 Dxe7 citait Fb4, Fxc3+, Fg5, Fe3 alors que les deux fous de cases noires
sont échangés (réécrite autour de Cb5 vers le trou d6, +0,38 et meilleur coup, d'où …a6 côté noir) ; la Steinitz f4 citait e5, f4,
Cfd7 déjà joués ; le Tarrasch fermé promettait « Cf4 vise e6 et d5 après …f6 exf6 », réfuté brut (−1,33 : …Cxd4 !), remplacé par
la vraie manœuvre Ff4 puis Cxf4 ; la Classique 3…Cf6 n'avait aucune liste (ajoutée, 10 + 10). Mises à jour directement dans les
explications IA en base (13/13), sauvegarde des versions précédentes conservée ; doublon de clés coupsBlancs/coupsNoirs nettoyé
dans le noyau source. Leçon de méthode : un schéma de milieu de jeu doit être écrit position par position, jamais hérité du tronc.

## 18 octobre 2026, nuit : réouverture bornée — le filtre de compatibilité des plans, à la profondeur 1

**Contexte.** Discussion à trois (l'auteur, la session Expert échecs, le pilote) sur la clôture du coach : le diagnostic retenu
est que l'étage 2 (formuler le plan) demandait au LLM de la pondération en contexte, ce qu'il ne sait pas faire, alors que les
étages 1 (percevoir) et 3 (traduire un plan en coups vérifiés) marchaient. La proposition de l'Expert — imposer le plan au
moteur et le chiffrer (son **prix** : évaluation finale contre la ligne libre ; son **tempo** : le coup où l'atome se réalise)
plutôt que lire le plan dans les coups du moteur — n'a jamais été essayée : `counterfactuals.mjs` perturbait des positions,
pas des lignes. Hypothèse testée : « ce qui manquait n'était pas de l'intelligence mais un arbitre ». **Go de l'auteur sur le
premier livrable seul** : le filtre de compatibilité (quel coup est un pas vers le plan), sur dix positions, à la profondeur 1,
sans recherche ni prix, dans un tableau qu'un œil humain juge.

**Construit.** `coach/plan-distance.mjs` : une fonction de potentiel par famille de plan, en nombre de mes coups, 0 = réalisé,
∞ = bloqué par l'adversaire — `rupture` (poussées restantes, chacune pesée par son déficit de soutien, le pion avançant
transparent : la tour derrière lui le soutient par rayon X), `transfert` (plus court chemin, une pièce à moi sur le chemin
coûte un coup de plus ; la sécurité de l'arrivée n'entre pas, c'est le moteur qui la facture), `echange` (chemin jusqu'au
contact, plus la prise ; la cible est une pièce suivie, pas une case), `colonne` (mes pions à retirer plus le chemin de la
tour), et le combinateur `et` (somme ; la batterie, « f4 puis e5 »). Progrès = la distance baisse après mon coup, l'adversaire
immobile. `scripts/plans/filtre.mjs` : tous les coups légaux notés (MultiPV = nombre de coups, prof. 18, ~20 s par position),
coups progressants avec leur retard sur le meilleur, meilleur coup non progressant et l'écart, et pour celui-ci « sert-il un
autre plan listé ? » (suggestion de l'Expert) ; distribution des écarts en fin de tableau. `scripts/plans/positions-filtre.mjs` :
cinq canoniques (Carlsbad, pion isolé Panov, hérisson, Mar del Plata, Espagnole d'échange sans dames) et cinq schémas de la
Française, panel relu par l'Expert (…Cc5 retiré du hérisson ; b4 retiré des plans de la Mar del Plata car c'est un coup
préparatoire de c5 ; Fd3 écarté, gambit Milner-Barry ; c4 écarté du Tarrasch ouvert ; Cb1-d2-b3 gardé **exprès comme piège**,
6.Cbd2 vaut −0,53 au moteur). Tests : `tests/plan-distance.test.js` (6).

**Deux trous dans la distance, trouvés avant et par le tableau.** (1) Le rayon X : sans pion transparent, Tb1 n'était jamais
un progrès de b4-b5 — relevé par l'Expert sur la définition, corrigé avant la première passe. (2) Un pion à moi sur le chemin
ne « s'écarte » que s'il peut bouger : le Fc8 de la Française d'avance passait par une route fantôme c8-a6 derrière le pion b7
bloqué par sa propre dame b6, et le plan « échanger le mauvais fou » n'avait **aucun coup progressant** ; corrigé (le pion
immobile bloque comme une pièce adverse), …Fd7 et …Ca5 progressent, distance 4.

**Ce que le tableau montre (35 plans, 10 positions, `reports/plans/filtre.md`, passe finale en déterministe).** La mécanique
fait ce qu'on voulait : sur la Carlsbad, **Tab1** et a3 sont progressants pour b4-b5 à 0,23–0,29 du meilleur coup (h3), et b4
immédiat progresse aussi mais à −1,05 (« progressant mais ça coûte ») ; e3-e4 coûte −3,62 (le Fg5 tombe après les échanges en e4), ce que la distance ne voit
pas et ne doit pas voir. Sur la Mar del Plata, b4 et Cd3 sortent tous deux comme coups préparatoires de c5 (ils comblent le
déficit), à 0,06–0,07 du meilleur. Sur l'Espagnole, **Ff4 sert à la fois e4-e5 (il défend e5) et l'échange des fous** — la composition
que l'Expert annonçait —, et f4 immédiat est bien « progressant mais cher » (−0,63, …Fd6 cloue). Le piège Cbd2 est classé
progressant à −0,60 : la mécanique ne le cache pas. Un angle mort assumé : Tc1 dans la Mar del Plata prépare la colonne que
c5 ouvrira (second ordre), invisible à la distance de rupture ; un plan `colonne c` listé à côté l'aurait attrapé en
« sert un autre plan ».

**La distribution des écarts est continue, sans creux** (8 / 7 / 6 / 5 / 4 par tranche de 0,10-0,25-0,50-1,00-∞, et 5 cas où
le meilleur coup progresse). Mais lue avec la colonne « sert un autre plan », elle se décompose : dix écarts positifs sont des
coups qui servent un autre plan listé (ni forcés ni inutiles) ; parmi les autres petits écarts (0,09 à 0,48), deux coups
récurrents étaient en fait **des plans absents de la liste** — cxd4 (avance, noirs) ouvre la colonne c, Fd3 (Tarrasch ouvert)
est le transfert Fb5→d3 vers h7 — relevé par l'Expert et ajoutés au panel ; principe : un meilleur coup non progressant
récurrent sans étiquette est d'abord un plan manquant, ensuite seulement de l'intendance. L'intendance vraie se réduit à h3
(quatre fois) et au roque (trois) ; décision de l'Expert pour la recherche : roque neutre par règle, h3 compté et absorbé par
k ≈ 2 — « le moteur préfère l'intendance pendant deux coups » est précisément le signal « jamais urgent ici ». Et tous les
grands écarts (> 0,6) ont le même sens : **le meilleur coup progressant du plan est lui-même mauvais ici** — plan prématuré ou
réfuté dans cette position —, qu'il soit une poussée (e4, d5) ou un coup de pièce (Cbd2, Ce4, Fe3, Ce5) ; jamais une
alternative forcée. **Aucun cas « forcé » dans le panel** : dix positions calmes, aucune
menace sur l'échiquier, la clause « parade » n'a rien eu à trancher. Le scalaire x ne se calibre donc pas ici ; il faut un
second panel avec une menace pendante. Autre constat : d'une passe à l'autre (3 fils, puis déterministe à un fil) les notes bougent
de ±0,10 et le meilleur coup tourne quand la tête est plate (Tc1, a4, g4 sur la Mar del Plata, tous à 0,06 près) — la passe
finale est en `COACH_DETERMINISTIC=1`, et la suite ira à prof. ≥ 22 pour les arbitrages serrés.

**Suite, si go** : un panel avec menaces pour calibrer x ; le test de stabilité 18/24 et deux moteurs ; puis la recherche en
faisceau avec le compteur (coup forcé neutre, coupure après k coups ni progressants ni forcés) et les quatre sorties : c'est
le plan / viable mais ça coûte / pas réalisable sans concession / jamais urgent ici.

**18 octobre, suite (go de l'auteur sur le test à deux demi-coups).** Trois accrocs du tableau corrigés sur relecture de
l'Expert : une rupture doit viser un pion (`estLevier`, vérifié à la racine ; famille `poussee` pour f3-f4 avant e5 ; a4-a5
retiré de la Mar del Plata, remplacé par `colonne c` qui attrape Tc1), étiquettes « n coup(s) + m écart(s) », déficit sans
discernement laissé tel quel (réglé par construction dans le faisceau). Test à deux demi-coups (`scripts/plans/preparatoire.mjs`,
déterministe, prof. 18, plancher provisoire 15 cp) : **5 préparatoires, 17 préférences, 12 « nuit au plan », 1 cible
disparue**. Dd3 avant Ce5 (Panov) : retard 2,13 → 0,84 ; le roque avant …Ce4 (Tarrasch fermée) : 0,77 → 0,00, mesuré au
point calme. Première passe apprise : deux demi-coups ne sont pas un point calme (la réponse adverse créait des menaces
imputées à M) → prolongation quand le meilleur coup est une prise ou une parade d'échec, Δ sur le même pas et sur le
meilleur pas, « cible disparue » pour une rupture sans pion visé. Le « nuit au plan » reste hétérogène (rétrogradation
réelle, prophylaxie adverse, parade non détectée, changement d'identité du pas). **Rapport complet, argumenté, avec les
limites : `docs/plans/RAPPORT-FILTRE-2026-10-18.md`.**
**18 octobre, soir : nuit de stabilité (go de l'auteur, aucun code de test).** VPS : SF 19 p24 (tableau 26 min, test 34 min),
SF 17.1 p18, SF 17.1 p24 en file ; Orion : SF 17.1 p24 puis SF 19 p24 (déterminisme entre machines), binaires copiés du VPS
pour aligner les versions (le paquet d'Orion était un SF 16). Résultats (§ 7 du rapport, annexes C-F) : variance des notes
18/24 médiane 6 cp, 90e centile 19 → **plancher 20 cp** ; distances et pas progressants stables ; Spearman 0,95 sur les
écarts ; **le test à deux demi-coups ne tient que si la réponse adverse est la même** (22/22 statuts stables à suite
identique, 9/14 changent quand la réponse change) ; entre moteurs, 7 statuts changent à suite identique (écarts de 0,3-1,0
entre réseaux). Cahier des charges de l'étape suivante : deux réponses adverses (pire Δ), point calme par menaces, accord des
deux moteurs. Incident de pilotage : un `kill` par motif a tué le shell de la chaîne (la passe 2 remise en file à la main) —
règle : PID dans un fichier, jamais de kill par grep.
**18 octobre, 19 h : passe 3 rentrée d'Orion** (rapatriée par le tunnel, sa session n'ayant ni enchaîné ni prévenu ; passe 1
relancée sur Orion directement par ssh). Axe profondeur SF 17.1 : 30/30 statuts stables à réponse identique sauf 2 ; axe moteur
à 24 : 90e centile 36 cp, 6 statuts changent à réponse identique. Annexes G-J. Déterminisme VPS/Orion en attente.
**18 octobre, 18 h 30 : la nuit refaite en vrai déterministe.** Bug trouvé par la vérification VPS/Orion : `filtre.mjs` et
`preparatoire.mjs` fixaient les fils du moteur en dur (3 et 2) et écrasaient `COACH_DETERMINISTIC` — aucune passe n'était
déterministe, et à un fil le tableau est même plus rapide (180 s contre 355 s par position à 24, trois processus sur quatre
cœurs). Corrigé (0 différence entre deux passes fraîches), trois passes refaites (SF 19 p18, SF 19 p24, SF 17.1 p18).
Chiffres propres (§ 8 du rapport, annexes K-P) : bruit des fils seul 5/17/49 cp ; profondeur 8/25/46, Spearman 0,95, test 3/24
changés à réponse identique contre 9/12 à réponse changée ; moteur 7/26/363, 11 signes d'écart sur 35 changés, Spearman 0,85.
**Plancher 25 cp.** Leçons : un fil pour mesurer, toujours ; vérifier la reproductibilité AVANT d'annoncer « déterministe ».
**18 octobre, 19 h : retour de l'Expert sur la nuit.** Son outil d'arbitrage tournait lui aussi à 4 fils (corrigé, un fil par
défaut, son commit fbf0a1a). Deux arbitrages limites des livres revalidés à un fil prof. 24 : cxd4 (Wade, 6.Fe2) écart 0,16
(0,25 à 4 fils) — retrait conforté ; 2…Cf6 (est-indienne 2.d3) écart 0,39 (0,49), punition e5 ! confirmée — la faute tient
au-dessus de 0,3 mais la marge est passée de 0,19 à 0,09, le bruit mesuré en grandeur nature. Plancher 25 cp endossé.
Méthode retenue : bande grise large au tri ([0,05 ; 0,55] à prof. 18), retest systématique à un fil prof. 24 dedans ; et la
règle des deux moteurs pour tout verdict à petit écart, dans le faisceau comme dans le coach. Option laissée à l'auteur :
estampiller 2…Cf6 « limite » en base (l'Expert la garderait telle quelle, pédagogiquement : e5 ! gagne de l'espace avec tempo).
**18 octobre, 20 h : lecture de la nuit (relecture relayée par l'auteur), § 9 du rapport.** Le résultat du jour : *le plan est
plus stable que le coup* — meilleur coup changé 15/35 entre moteurs (11/35 par les seuls fils), meilleur coup progressant 2/35,
distance 35/35 partout. Les sauts du test se classent par la carte d'attaques de la case du pas (réponse qui la touche = « ferme
la fenêtre », plan périssable ; sinon variance) — mis en tête du cahier des charges de l'étape 2. Le plancher à 25 implique
qu'un test à un pas dira souvent « limite » : argument pour le faisceau (prix linéaire, bruit en racine). « Contesté entre
moteurs » au-delà d'un pion, à trancher à prof. 30 une fois. Règle « un fil pour mesurer » écrite dans CLAUDE.md.
**18 octobre, 19 h : Orion à un fil (go de l'auteur « lance tout »).** Déterminisme VPS/Orion : **identique au centipion**
(0/0/0, Spearman 1,00, annexe Q). Moteur à 24 : 9/24/380, 4 statuts changés à réponse identique sur 24, 9/12 à réponse
changée ; profondeur SF 17.1 : 5/14/37, 1/31 et 4/5. Lignes ajoutées au § 8, annexes R-T.
**18 octobre, 20 h : étape 2 livrée (go « lance tout »).** Test à deux demi-coups v2 (deux réponses, point calme par menaces,
« ferme la fenêtre » par la carte d'attaques, deux axes, plancher 25, accord des moteurs), **relu par l'Expert (sémantique) et
le Dev chef (mécanique) avant la passe définitive** — 4 + 9 correctifs appliqués (mini-échange, pion contre pièce, point calme
strict, vocabulaire mûr / en préparation / se paie / hors de prix ; tour au roque dans `suivre`, unicité des libellés, lanceurs
résilients…). Résultats (§ 10, annexes U-W) : 21/35 lignes annoncées par les deux moteurs, 8 désaccords (petits écarts), 2
contestés (e4 Carlsbad, …d5 hérisson) ; **2 fenêtres qui se ferment, identiques sur les deux moteurs (…h6 contre Fg5)** ; Dd3
prépare Ce5 et d5 ; le roque prépare …e5 ; 0 ligne mesurée en pleine tactique. Suite possible : threats.mjs (clouage relatif),
profondeur 30 sur les 2 contestés, panel à menaces, faisceau.
**18 octobre, 21 h : les deux contestés tranchés à prof. 30 par l'Expert (SF 19, un fil).** e4 Carlsbad après h3 : nuit
(Δ −1,74 sur …a6 ; mais +2,65 sur …Fe6, réponse ex æquo — la règle « pire des deux » validée brutalement, et un verdict
contesté doit donner les Δ par réponse) ; …d5 hérisson après Tab8 : prépare, limite (+0,38 sur h3, +2,20 sur Te1), d5 reste
hors de prix (3,81). Anecdote : …Cc5, écarté du panel, est le meilleur coup du hérisson à prof. 30. Complément au § 10.
**18 octobre, 21 h 30 : lecture de clôture (§ 11 du rapport).** Première phrase de coach falsifiable et juste : « Fg5 se joue
avant …h6, après c'est fermé ». Vocabulaire des sorties stabilisé : deux axes, fenêtre fermée (pion) / **suspendue** (clouage,
threats.mjs en premier), plan frère, contesté entre moteurs, **à la merci de la réponse** (Δ de signes opposés sur les deux
meilleures réponses — Carlsbad e4 : −1,74 / +2,65). Le panel canonique est une hypothèse : les désaccords grammaire / livre
(…Cc5 au hérisson) sont à montrer à Marc en premier. Ordre de la suite : clouage + bande axe 2, puis panel à menaces, puis
faisceau dont les sorties sont ce vocabulaire plus prix et tempo. Le test à deux demi-coups n'est plus à polir.
**18 octobre, 21 h – 23 h : le faisceau (go de l'auteur, « lance tout, n'oublie pas ton rapport détaillé »).** Cahier des
charges et critère écrits avant le code (`FAISCEAU-CRITERE-2026-10-18.md`), canoniques désignés et validés par l'Expert (Panov →
Dd3 seul, échange → c4 seul), code `scripts/plans/faisceau.mjs` (+ `faisceau.sh`, `accord-faisceau.mjs`, `coach/en-prise.mjs`).
Passe témoin SF 17.1 à référence gloutonne : 6/10 et des prix négatifs → relectures Expert (biais de sélection croissant avec
le tempo, tenure, plans frères suivis, jumelles, « le faisceau apprend le bon moment du même plan ») et Dev chef (réalisations
non bornées par la largeur, coût réel des concessions, mats bornés, garde d'unicité remontée) ; référence remplacée par un
**faisceau libre** de même largeur. Passes définitives (Orion, 29 min chacune, 0 échec) : **critère 6/10 avec chaque moteur**,
plans longs canoniques ≤ 1,0 : 8/10 (SF 19), 5/10 (SF 17.1) ; accord des moteurs 18/35 ; deux contradictions communes
(Carlsbad b4-b5 0,46-1,62 contre Ce5 0 ; Tarrasch fermée colonne c 0,84-1,92 contre …e5 0). Clause prof. 30 en cours chez
l'Expert sur les quatre contradictions de SF 19. Rapport : `RAPPORT-FAISCEAU-2026-10-18.md` (§ 8 à compléter), annexes X-ZZ.
**18 octobre, 23 h 55 : verdict du faisceau.** Arbitrages à prof. 30 (Expert, SF 19, un fil, prix = racine − fin de ligne) :
Carlsbad confirmée-limite (b5 gratuit à 30, Ce5 encore moins cher de 0,30 : les deux sont des plans) ; Espagnole confirmée nette
(Cd5 bat e5 de 0,59) ; avance blancs confirmée mais « à la merci de la réponse » (…Cxe5 douteux à 30) ; Tarrasch fermée
INFIRMÉE et renversée (colonne c −0,49 réel contre +0,84 annoncé : 1,3 pion d'erreur de snapshot tactique). **Clause appliquée :
9/10, le critère passe**, plans longs 8/10, trois drapeaux. Lecture : la mesure ne contredit pas la théorie, elle la précise
(trois cas Marc) ; le prix à 18 n'est pas fiable au-delà de la bande grise ; le critère passe sur la clause, pas sur la passe
à 18 seule. Épreuve du jeu : go à part, à froid, après prix au point calme et horizon 20.
**19 octobre, 0 h 20 : identité VPS / Orion sur le faisceau** — même passe SF 19, 35/35 plans identiques (phrase, prix, tempo,
ligne). Journée close : filtre, nuit de stabilité, test à deux demi-coups v2, faisceau, deux rapports, 30 annexes.
**19 octobre, 0 h 40 : passe de contrôle avec les trois retouches (Orion, deux moteurs, 0 échec), § 10 du rapport.** Point calme :
le Tarrasch fermé passe de +0,84 à −0,04 chez SF 19 (ce que la prof. 30 avait trouvé) ; 8/35 prix bougent de plus de 25 cp.
Horizon 20 : l'attaque de minorité reste « en cours » chez SF 19, +1,51 au 23e chez SF 17.1. Bascules nommées sur 13/35 lignes
(cxd4 dissout la chaîne, dxe5 donne un PDI noir, cxb5 Maroczy → petit centre). Décompte indicatif 7/10 avec chaque moteur
(critère gelé, verdict inchangé). Division « continuer / adopter » codée (table de l'Expert, `coach/plans-structures.mjs`), pas
encore passée. Ordre arrêté : lecture à froid → protocole → bascule → parties.
**19 octobre, 2 h (Paris) : passe de contrôle Orion v3 (division, SF 19, prof. 18, un fil) — 9/10, `iqp-panov` en délai dépassé
(un `go depth 18` > 10 min, Orion à charge 16 : symptôme de surcharge, à refaire sur le VPS).** Lecture de la division sur les
12 bascules, 4 avec structure nommée : **continuer bat adopter dans les trois cas comparables** — Carlsbad e4 (…dxe4 donne un
PDI blanc) : continuer 0,35 (t9) contre adopter d5 1,51 (t27) ; Tarrasch fermé (…dxe5 donne un PDI noir) : colonne c −0,04
contre Dd6 0,65 ; hérisson …b5 (cxb5 → petit centre) : 0,30 contre colonne c 0,78. Les autres bascules sont des dissolutions
(CHAINE_E5 → rien par cxd4, exf5) sans plan à adopter. Drapeau : « Dc2→d3 en cours 4,73 » (Carlsbad, sous-faisceau PDI), un
prix de branche vivante à 4 pions, à vérifier à la main avant d'en tirer quoi que ce soit. Passe rangée dans
`reports/plans/faisceau/orion-sf19-p18-v3/`, elle sert de référence au centième pour les refontes du module partagé.
**Module partagé de l'épreuve du jeu (protocole § 5 bis, 10)** : `coach/coup-contraint.mjs` (noteur à cache par
(position, n, profondeur), `classerCandidats`, `derniereChance`, `choisirCoup` selon le § 2 — meilleur progressant d'abord,
puis forcé / roque, puis dernière chance à compteur plein, sinon intendance ; deux compteurs, `horsDePrix` à k + 1 —,
`pointCalme`, `reponsesOuvertes`, `faisceauLibre`, `prixDeSegment`, `structureCourante`) et `coach/faisceau-plan.mjs` (le
cœur du faisceau, importable sans lancer de moteur). `scripts/plans/faisceau.mjs` ne garde que la ligne de commande et le
rendu ; `scripts/plans/comparer-passes.mjs` compare deux passes au centième. Tests `tests/coup-contraint.test.js` (7).
Pilote écrit, pas encore joué : `scripts/plans/partie.mjs` (deux bras + témoin, graines mulberry32 côté adversaire, journal,
prix par segment), `scripts/plans/departs.mjs` (lot 1 = panel, lot 2 = les dix lignes de livre du § 3, légalité vérifiée au
chargement), lanceur `scripts/plans/epreuve.sh`. Avant la première partie : identité au centième des refontes (en cours),
deux parties fraîches identiques, relecture Expert (sémantique) et Dev chef (mécanique).
**19 octobre, 4 h 30 (Paris) : retour du GE sur la note de relecture** — forcé avant progressant dans `choisirCoup`
(appliqué, test), plafond tactique à trois coups forcés consécutifs (segment non tarifé à cet endroit, appliqué), 80 demi-coups
depuis le départ et la règle des 25 cp du coach-prix confirmés ; pour le faisceau, **différé** : référence de la division depuis
la position de bascule (pas la racine) et coupe des branches « en cours » à concession cumulée > 1,0 — à faire avant toute
lecture écrite de la division. Exigence de forme : identité 10/10 (iqp-panov à rejouer, ancien code contre nouveau).
**19 octobre, 5 h (Paris) : relecture de l'Expert rendue** — compteurs, plan de service (cible, −1, +1 ; semi-ouverte admise),
80 demi-coups depuis le départ, dix lignes du lot 2, témoin sur la même MultiPV 4 : validés. Drapeau 4,73 élucidé pour
l'essentiel : à la bascule (…dxe4) le fou blanc est encore sur d3 et le pion e4 couvre la case — l'instance Dc2→d3 naît avec
cascade +1 et une arrivée empoisonnée, la branche s'effondre réellement sous contrainte, et la référence prise à la racine
aggrave la lecture. Correctifs demandés pour la division, acceptés et différés après le lancement des premières parties :
(a) stocker la ligne retenue et les raisons de coupe de chaque sous-faisceau, (b) référence = faisceau libre depuis la position
de bascule pour continuer et adopter, (c) re-passe de cette division. **Désaccord Expert / GE sur l'ordre forcé / progressant**
(GE : forcé d'abord ; Expert : progressant d'abord, la concession garde) — soumis à l'auteur, le code est dans l'ordre du GE.
**19 octobre, 5 h 30 (Paris) : Dev chef rendu, Expert rallié au GE** — appliqué : forcé avant progressant + classe
forcé-progressant, un seul compteur, purge du lanceur, épisode de structure, précédence bascule > réalisation. **M1 (Dev chef)** :
le prix par segment compare une enveloppe (max de 4 branches) à une ligne unique → biais vers le haut ; `prixDeSegment` rend
`prix` (enveloppe) et `prixLigne` (ligne gloutonne), le pilote publie les deux coûts ; le critère reste à trancher par le GE.
`iqp-panov` relancé sur Orion avec l'ancien code (référence 10/10). Tests 8/8, suite 310/310.
**19 octobre, 6 h (Paris) : M1 — l'Expert tranche pour la ligne gloutonne** (symétrie de F1 : une ligne contre une ligne), le
Dev chef aussi si l'inflation approche le plancher ; GE consulté. Orion recalcule `iqp-panov` à l'ancien code ; fr-echange rendu
sur le VPS au code refondu.
**19 octobre, 6 h 30 (Paris) : le GE tranche, le pilote est spécifié** — M1 : la ligne gloutonne est le prix, l'enveloppe
publiée à côté, segments « gratuits » vérifiés à 0 ; séquence forcée qui tue le plan : tarifée après, au point calme suivant,
« payé en tactique » ; coach-prix : optimisme du choix à écrire dans le rapport. Tout est codé dans `partie.mjs`
(`prix`/`prixEnveloppe`, `gratuit`, `etiquette`), `pointCalme` prend un budget. Reste : identité 10/10, deux parties fraîches,
puis les parties (file de nuit en cours sur le VPS).
**19 octobre, 8 h (Paris) : les preuves sont rendues** — identité du faisceau refondu contre Orion (ancien code, 10 positions) :
contrôle 1 **9/9**, contrôle 2 **9/9** (iqp-panov au nouveau code : délai dépassé à trois processus, recalculé seul) ; deux
parties fraîches **identiques hors secondes** ; la vérification M1 passe (le segment gratuit lit 0). Le biais d'enveloppe mesuré
sans jouer (`biais-enveloppe.mjs`, lot 1, horizon 12) : il **croît avec la longueur du segment** (≈ 0,04 pion par demi-coup à largeur 1, ≈ 0,08 à
largeur 4 : 1,82 médian au 12e coup) et **n'est pas nul à largeur 1** (seconde réponse adverse admise, choix sur l'évaluation à
deux demi-coups) — la gloutonne est bien la seule référence juste d'une ligne jouée. Note § 8. Orion éteint (dépôt GE différé).
**19 octobre, 9 h (Paris) : identité 12/12** — iqp-panov au code refondu identique à Orion au centième (délai du `Noteur` porté à
30 min : la MultiPV « tous les coups légaux » à profondeur 18 dépasse 10 min sur le VPS). Les quatre positions de contrôle
(hérisson, Carlsbad, fr-echange, iqp-panov) sont identiques ancien code / nouveau code. Lancement des premières parties.
**19 octobre, 10 h 45 (Paris) : verdict du GE, le lot 1 repart** — (1) le biais d'enveloppe est une découverte : l'annulation de
F1 au faisceau suppose des largeurs effectives égales des deux côtés, or le faisceau contraint garde souvent moins de quatre
branches ; à vérifier sans jouer (largeur effective par coup, désormais dans les sorties) et, si elle est bien inférieure à
quatre, publier le **prix sur l'échelle ligne** (ligne retenue contre gloutonne) à côté des prix d'hier, pour que le coach ne
parle qu'une langue ; le verdict d'hier reste gelé. (2) La partie fraîche montre déjà l'écart entre les bras (le livre sait quel
plan, pas quand : b5 au 3e coup avec 0,40 de retard) et la bascule a travaillé sur pièce (…c5, PDI adverse, blocus Cf3→d4 à
+0,60). (3) **Défaut** : la triple répétition n'était pas vue (position reconstruite depuis la FEN, sans historique) — la
partie fraîche tricote Rg3/Tc5 du 36e coup au 80e demi-coup. Corrigé (compteur de positions, « nulle (répétition) » comptée à
part), vérifié hors moteur sur la partie fraîche (coupée au 71e demi-coup). Lot 1 arrêté (8 processus, 3 h 20 perdues) et
**relancé à 10 h 40** avec la correction. Colonnes à garder : part des coups sous plan, Σ retards (contrôle gratuit du prix
ligne si la coïncidence +1,10 / +1,22 tient). Branche `division` fusionnée (a)(b)(c) + largeur effective + prix ligne ;
re-passe des dix positions sur Orion, sans coupe (prix d'hier + nouvelles colonnes) et avec coupe (autopsie de la division).
**19 octobre, 12 h 15 (Paris) : la table de hachage comptait — vidée avant chaque recherche en mode mesure.** Deux parties
fraîches identiques sur Orion avec le compteur de positions (coupées au 71e, « nulle (répétition) », identité hors secondes
tenue), mais leurs prix diffèrent de la partie du VPS poussée au 80e (b5 +0,51 contre +0,53, Cf3→d4 +0,69 contre +0,60,
enveloppe jusqu'à 21 cp d'écart) à coups et candidats strictement identiques : les prix se calculent après la partie, sur une
table de hachage qui n'a plus le même contenu. Expérience sur Orion (SF 19, un fil, prof. 18) : la même position notée après
cinq autres recherches change de 2 à 12 cp par coup et d'ordre des candidats (a3 de 2e à 4e) ; table vidée, les valeurs du
moteur frais reviennent exactement ; surcoût 3 %. **Stockfish à un fil est déterministe à historique égal** — nos identités
au centième tenaient parce que la suite d'appels était la même. Décision (Sébastien, sur recommandation) : en
`COACH_DETERMINISTIC=1`, `ucinewgame` avant chaque recherche (`uci-engine.mjs`), la valeur d'une position ne dépend plus que
d'elle et de la profondeur. Lot 1 et re-passe Orion arrêtés et relancés avec cette méthode ; les prix d'hier (référence
`orion-sf19-p18-v3`) bougeront de quelques centièmes : la re-passe sans coupe devient la nouvelle référence.
**19 octobre, 14 h 30 (Paris) : re-passe Orion à table vide, réponse au GE rédigée** (`docs/plans/REPONSE-GE-2026-10-19.md`).
Largeur effective du faisceau contraint, comptée jusqu'à la réalisation de la ligne retenue : médiane 4, 14 % des coups
sous 4 (concentrés à la racine et dans les transferts courts) — l'écart de largeur n'explique qu'une petite part du biais
d'enveloppe. Échelle ligne publiée (23 plans gratuits sur 30 contre 8 à l'enveloppe, écart médian 0,49 = biais du côté
libre seul) avec sa limite : la ligne retenue est choisie à 4 contre une gloutonne à 1, l'échelle ligne favorise le plan
autant que l'enveloppe le pénalise ; seule l'épreuve (1 contre 1) tranche. Division Carlsbad e4 depuis la bascule :
continuer −0,03 (racine +0,68 : le prix est dans la poussée), adopter d5 +0,11 « c'est le plan ». **Correction de ce que
j'écrivais à midi** : la table vide ne bouge pas les prix « de quelques centièmes », elle change la phrase de 17 plans sur
35 et des prix de près de deux pions, à code identique (12/12 prouvé le matin) : le faisceau amplifie 10 cp en un changement
de ligne. Reproductible n'est pas robuste ; marge au seuil proposée au GE pour après le lot. Rendu des largeurs corrigé sur
`division` (8af9520 : branches gardées réalisées comprises, lecture jusqu'à la réalisation, zéros finals exclus), fusion
après le lot 1 (le bras prix charge le module). Seconde passe fraîche à table vide lancée sur Orion (3 positions) pour la
preuve « deux passes, zéro différence » dans le nouveau mode.
**19 octobre, 15 h 30 (Paris) : réponse du GE — « le verdict d'hier est un tirage ».** Dix-sept phrases sur trente-cinq
sous une perturbation de dix centièmes : le plancher des sorties du faisceau (processus de sélection discret) n'a jamais été
mesuré, la nuit de stabilité n'a porté que sur le filtre et le test à deux demi-coups. Le compte automatique du critère passe
de 6/10 (passe d'hier) à 5/10 (passe d'aujourd'hui). Fait : page « à lire en premier » rectifiée (neuf sur dix sur un
tirage, robustesse non mesurée, taux de passage à venir) ; `scripts/plans/taux-de-passage.mjs` (division) ; **nuit de
perturbations en file sur Orion** après les passes v5 : prof. 17 et 19 × table vidée / gardée (les deux tirages à 18 sont
les v5), 40 passes, six en parallèle, dossiers `nuit-p{17,19}-{vide,garde}`, marque TERMINE dans `nuit-p17-garde/`.
Engagé pour après le lot 1 : prix = médiane des branches réalisées, phrase avec marge, coupes à marge, coup refusé imprimé ;
lot de perturbation de l'épreuve (prof. 17–19, ordre des ex æquo côté exécutant) à spécifier avec le GE. Réponse au GE § 6.
**19 octobre, 16 h (Paris) : réserve du Dev chef fermée, la table de hachage explique seize des dix-sept bascules.** Passes
v5 sur Orion (code corrigé `division` 8af9520 + f8a3e1c, dix positions, un fil, prof. 18) : à table vide, identique au
centième à la passe v4 sur 35/35 plans (les deux correctifs sont des non-opérations sur les prix ; reproductibilité à
table vide établie sur les dix positions). À hash gardé contre table vide, code identique : **16 phrases sur 35** changent
(huit positions), 30 lignes retenues sur 35, écart de prix médian 0,33 (max 5,61). Code seul (v3 d'hier contre v5 hash
gardé) : 1 phrase sur 35 (Panov Dd1→d3, correction du point calme), écart médian 0,00 (max 0,14). Largeurs effectives
recalculées d'une seule source (JSON v5 table vide, réalisée comprise) : médiane 4, **8 %** des coups sous 4 (et non 14 %),
aucun plan à médiane < 4, cinq plans à minimum 1 (racine de l'avance française noire, un coup isolé dans Fc1×Ce7 et d5
Panov). Critère automatique : 6/10 à hash gardé (hier et aujourd'hui), 5/10 à table vide. Nuit de perturbations lancée
à 13 h 57 sur Orion (prof. 17 et 19 × vide/gardé, six moteurs) ; taux de passage au matin. Réponse au GE § 1, § 4, § 5 et
tableau mis à jour.
**19 octobre, 16 h 30 (Paris) : taux de passage mesuré — 2 tirages sur 6, ce n'est pas un verdict.** Les quarante passes
de la « nuit » (prof. 17 et 19 × table vidée / gardée) ont tenu en deux heures sur Orion ; avec les deux passes v5 à prof. 18,
six tirages au même code, un fil. Critère automatique : 6, 8, 5, 6, 7, 5 positions réussies → **2/6 tirages à ≥ 7**
(`docs/plans/TAUX-DE-PASSAGE-2026-10-19.md`). Trois positions réussissent 6/6 (Tarrasch ouvert, Panov, KID), l'Espagnole
d'échange 0/6 — de façon stable, e5 du livre coûte de +0,87 à +4,66 dans les six tirages, l'arbitrage prof. 30 de l'Expert
tient. Phrases stables sur les six tirages : 8 plans sur 35. Le plan le moins cher est le même dans ≥ 5 tirages sur 6 pour
7 positions sur 10 : le classement est plus solide que la phrase. Un pli de profondeur change 11 à 16 phrases (écart de
prix médian 0,14–0,19) ; la table 16 à 19 (0,19–0,33). Page « à lire en premier » et réponse au GE § 6 mises à jour.
