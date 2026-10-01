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
