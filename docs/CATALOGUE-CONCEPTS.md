# Catalogue des concepts de plan — la théorie d'abord (1er octobre 2026)

Décision de l'auteur (1er octobre) : **étendre le vocabulaire avant de mesurer le rattachement**. Avec 8 concepts
codés sur une soixantaine, les plans n'expliquent que 10 % des coups calmes : c'est le résultat attendu d'un
vocabulaire au dixième. Ce catalogue écrit, à la même grille, tout ce que la théorie nomme ; chaque entrée devient un
détecteur (état but vérifiable, agent, tenue), mesuré dès qu'il est écrit (fréquence par niveau, part des coups calmes
rattachés, dix planches), puis jugé sur planches par un humain.

**La grille** (§3 bis de `PLANS-ET-CONCEPTS.md`) : **moyen** (ce que je fais : un atome ou une suite d'atomes) →
**déséquilibre** (l'état but, vérifiable sur l'échiquier, qui tient au moins 6 demi-coups) → **exploitation** (ce que
l'état permet ensuite). Le **piège** est ce qui ressemble au concept sans l'être : c'est lui qui fixe la clause
d'exclusion du détecteur. **Faits** : ce que le moteur de règles sait déjà voir (`positional/`) ; en italique, ce qui
manque. **Statut** : codé / lot 1 (avec ce qui existe) / lot 2 (un fait à écrire) / lot 3 (définition à discuter).

Sources, par ordre d'ancienneté : Philidor (1749), Steinitz (1889), Tarrasch (1931), Nimzowitsch (*Mon Système*,
1925 ; *La pratique de mon système*, 1929), Capablanca (*Chess Fundamentals*, 1921), Lasker (*Manuel*, 1925), Euwe et
Kramer (*Le milieu de partie*, 1964), Pachman (*Stratégie moderne*, 1959), Kmoch (*Pawn Power*, 1959), Kotov (*Pensez
comme un grand maître*, 1971), Vuković (*L'art de l'attaque*, 1965), Soltis (*Pawn Structure Chess*, 1976), Silman
(*How to Reassess Your Chess*, 1993), Dvoretsky (*Manuel des finales*, 2003).

## A. Pièces lourdes (tours et dame)

| # | Concept | Source | Niveau | Moyen | Déséquilibre (état but) | Exploitation | Piège | Faits | Statut |
|---|---|---|---|---|---|---|---|---|---|
| A1 | Tour sur colonne ouverte | Nimzowitsch, la colonne ouverte | inter. | coup calme de tour | ma tour sur une colonne ouverte, ou semi-ouverte pour moi, et elle tient | pénétration à la 7e, doublement | tour sur une colonne fermée ou semi-ouverte pour l'adversaire | TOUR_COLONNE_OUVERTE | codé |
| A2 | Doublement des tours | Nimzowitsch | inter. | deuxième tour sur la même colonne (ou rangée) | deux tours alignées sur une colonne ouverte ou semi-ouverte, et ça tient | contrôle total de la colonne, pénétration | deux tours côte à côte sur la première rangée | atome doublement | lot 1 |
| A3 | Tour à la 7e rangée | Nimzowitsch, la 7e absolue | inter. | coup calme de tour | ma tour sur la 7e rangée (vue de mon camp) et elle tient | pions adverses pris de flanc, roi coupé | tour qui passe par la 7e en prenant et repart | TOUR_7E, atome septieme | lot 1 |
| A4 | Tour derrière le pion passé | Tarrasch | inter. | manœuvre de tour | ma tour sur la colonne de mon pion passé, derrière lui, et ça tient | le pion avance soutenu, la tour reste active | tour devant le pion (elle bloque sa propre avance) | PION_PASSE | lot 1 |
| A5 | Levée de tour | attaque du roi (Vuković) | avancé | tour qui monte à la 3e rangée puis glisse vers l'aile roi | ma tour sur la 3e (ou 4e) rangée, sur l'aile du roi adverse | attaque de mat avec la dame | tour levée pour défendre | *trajet de tour par la 3e* | lot 2 |
| A6 | Dame centralisée | Pachman, Silman | inter. | coup calme de dame | dame sur une case centrale (d4, e4, d5, e5) non attaquable par pion, et ça tient | pression des deux côtés | dame centrale chassable par un pion | atome manoeuvre D | lot 1 |
| A7 | Prise de la colonne disputée | Nimzowitsch, lutte pour la colonne | avancé | échange des tours ou doublement | j'ai la seule tour (ou la dame) sur la colonne ouverte après les échanges | pénétration | échange qui laisse la colonne à l'adversaire | CONTROLE_COLONNE | lot 1 |
| A8 | Case d'entrée | Nimzowitsch | avancé | manœuvre de tour | ma tour atteint une case d'entrée (7e ou 8e, non attaquable par pion) | gain de pions | case d'entrée couverte par une pièce adverse | CASE_ENTREE | lot 1 |

## B. Pièces mineures

| # | Concept | Source | Niveau | Moyen | Déséquilibre | Exploitation | Piège | Faits | Statut |
|---|---|---|---|---|---|---|---|---|---|
| B1 | Cavalier sur avant-poste | Nimzowitsch, l'avant-poste | inter. | manœuvre de cavalier | cavalier dans le camp adverse, soutenu par un pion, inattaquable par pion, et ça tient | pression, tour derrière | cavalier chassable, ou avant-poste en 4e rangée sans soutien | CAVALIER_AVANT_POSTE | codé |
| B2 | Blocage d'un pion faible | Nimzowitsch, le blocus | inter. | pièce mineure devant le pion | cavalier ou fou juste devant un pion isolé, arriéré ou passé adverse, et ça tient | la pièce bloqueuse est intouchable, le pion est fixé | pièce devant un pion sain | PION_ISOLE, PION_ARRIERE, PION_PASSE | codé |
| B3 | Dominer une couleur | Nimzowitsch, complexe de cases | avancé | je prends son fou de la couleur faible, je garde le mien | COMPLEXE_FAIBLE adverse avec fou ennemi, et ça tient | mes pièces sur ces cases, échecs de fou ou de dame | prise du fou sans trous de cette couleur | COMPLEXE_FAIBLE | codé |
| B4 | Échanger le mauvais fou | Pachman, Silman | avancé | manœuvre puis échange de mon fou de la couleur de mes pions | mon FOU_MAUVAIS a disparu contre une pièce de valeur égale | mes pions ne gênent plus mes pièces | échange de mon bon fou | FOU_MAUVAIS | lot 1 |
| B5 | Bon cavalier contre mauvais fou | Pachman | avancé | échanges qui laissent cavalier contre fou | j'ai un cavalier contre son FOU_MAUVAIS (ou FOU_BON à moi contre cavalier dans une position ouverte) | avant-poste, finale favorable | fou contre cavalier dans une position fermée pour le fou | FOU_CONTRE_CAVALIER, FOU_MAUVAIS, FOU_BON | lot 1 |
| B6 | Paire de fous et ouverture | Steinitz, Pachman | avancé | leviers et échanges de pions | j'ai PAIRE_FOUS contre fou+cavalier ou deux cavaliers, et le nombre de pions baisse (position qui s'ouvre) | les fous rayonnent, avantage durable | paire de fous dans une position que je ferme | PAIRE_FOUS, nombre de pions | lot 1 |
| B7 | Reroutage du cavalier | Nimzowitsch, « la pire pièce d'abord » | inter. | manœuvre de cavalier en 2 à 4 coups | le cavalier atteint une case stratégique (avant-poste, blocage, case faible adverse) | selon la case | manœuvre vers une case où il est chassé | atome manoeuvre, ROUTE_CAVALIER | lot 1 |
| B8 | Fou de fianchetto à longue diagonale ouverte | Euwe | inter. | fianchetto puis ouverture de la diagonale (levier ou échange du pion central) | mon fou en fianchetto voit la longue diagonale sans pion à moi devant | pression sur la tour ou le roi adverse | fianchetto derrière un pion à moi fixé | *diagonale ouverte* | lot 2 |
| B9 | Échange de la pièce défensive clé | Vuković, attaque | avancé | échange d'une pièce mineure adverse qui défendait le roi | le défenseur a disparu (cavalier f6/f3, fou de fianchetto) | attaque sur les cases qu'il tenait | échange qui ouvre mes propres lignes | PIONS_ROI_BOUCLIER, pièces près du roi | lot 1 |
| B10 | Pièce surprotégée (point stratégique) | Nimzowitsch, surprotection | avancé | plusieurs de mes pièces soutiennent un point central à moi | un point (e5, d5…) défendu par trois pièces ou plus, et ça tient | les défenseurs sont bien placés par nature | surprotéger un point sans valeur | atome soutien, compteur de défenseurs | lot 1 |

## C. Structure de pions

| # | Concept | Source | Niveau | Moyen | Déséquilibre | Exploitation | Piège | Faits | Statut |
|---|---|---|---|---|---|---|---|---|---|
| C1 | Rupture de pions | Kmoch, leviers | inter. | levier de pion | colonne nouvelle ouverte ou semi-ouverte pour moi, utilisée (tour) ou faiblesse adverse nouvelle | colonne, pion passé | levier qui n'ouvre rien | COLONNE_OUVERTE, COLONNE_SEMI_OUVERTE | codé |
| C2 | Affaiblir la structure adverse | Nimzowitsch, pions doublés | avancé | échange repris par un pion, ou levier | DOUBLON, PION_ISOLE, PION_ARRIERE ou PIONS_ROI_AFFAIBLI nouveau chez l'adversaire, et ça tient | pression sur la faiblesse | reprise de pion sans faiblesse durable | faits de pions | codé |
| C3 | Attaque de minorité | Soltis, Carlsbad | avancé | levier b4-b5 (ou b5-b4) | pion c adverse faible ou colonne b ouverte | tours sur b et c | poussée b sans structure Carlsbad | STRUCTURE Carlsbad | codé (recette) |
| C4 | Création du pion passé | Capablanca | inter. | levier ou échange de pions | PION_PASSE nouveau pour moi, et il tient | poussée, tour derrière | pion passé immédiatement bloqué et attaqué | PION_PASSE | lot 1 |
| C5 | Poussée du pion passé | Nimzowitsch, « la soif d'expansion » | inter. | poussées successives | mon pion passé avance d'au moins 2 rangées dans la fenêtre | promotion, pièces adverses liées | poussée qui perd le pion | PION_PASSE | lot 1 |
| C6 | Pion passé protégé | Nimzowitsch | avancé | levier ou poussée | PION_PASSE_PROTEGE pour moi, et il tient | il immobilise une pièce adverse à vie | pion passé protégé mais bloqué par un roi | PION_PASSE_PROTEGE | lot 1 |
| C7 | Avance de la majorité | Capablanca | avancé | poussées sur l'aile où j'ai plus de pions | au moins deux poussées sur l'aile de ma majorité, puis pion passé ou colonne | pion passé | avance de la minorité qui fixe mes pions | *MAJORITE_AILE_* à vérifier* | lot 1 |
| C8 | Pion passé éloigné | Capablanca, finales | avancé | échanges qui laissent un pion passé loin du roi adverse | PION_PASSE sur l'aile opposée au roi adverse, en finale | le roi adverse court, le mien mange | pion passé éloigné mais le roi adverse est devant | PION_PASSE, position des rois, PHASE | lot 1 |
| C9 | Fixation des pions adverses | Nimzowitsch, restriction | avancé | poussée qui bloque un pion adverse sur une case de la couleur de son fou | pions adverses fixés sur la couleur de son fou (mauvais fou créé) | B4 chez lui, B5 pour moi | fixation qui bloque mes propres pièces | FOU_MAUVAIS adverse, atome fermeture | lot 1 |
| C10 | Sape de la base de la chaîne | Nimzowitsch, la chaîne de pions | avancé | levier contre le pion de base de la chaîne adverse | la base tombe ou devient faible (PION_ARRIERE ou isolé à la base) | la chaîne s'écroule | levier contre la tête de la chaîne | CHAINE_PIONS, atome levier | lot 1 |
| C11 | Pions pendants | Kmoch, Soltis | avancé | échanges qui laissent c4-d4 (ou c5-d5) sans voisins | j'ai deux pions côte à côte au centre, sans pions sur b et e | poussée centrale qui ouvre les lignes | pions pendants bloqués et attaqués | *PIONS_PENDANTS* | lot 2 |
| C12 | Pion dame isolé : le camp qui l'a | Soltis, structures | avancé | poussée d4-d5 (ou d5-d4) préparée | la poussée du PDI libère les pièces (rupture) | attaque sur le roi avec les pièces libérées | poussée qui perd le pion | STRUCTURE PDI, PION_ISOLE | lot 1 |
| C13 | Pion dame isolé : le camp qui joue contre | Soltis | avancé | blocage puis échanges | le PDI est bloqué (B2) et les pièces mineures s'échangent | finale gagnée contre le pion faible | échange des tours au lieu des mineures | PION_ISOLE, atome blocage, atome echange | lot 1 |
| C14 | Gain d'espace | Pachman | inter. | poussées de pions dans le camp adverse qui tiennent | AVANTAGE_ESPACE nouveau pour moi, et il tient | manœuvres derrière les pions, l'adversaire étouffe | pions avancés qui deviennent des cibles | AVANTAGE_ESPACE, atome espace | lot 1 |
| C15 | Fermer la position quand on est moins développé | Steinitz, Lasker | inter. | fermeture (pions face à face) | le centre est bloqué, les leviers adverses ne sont plus disponibles | temps pour regrouper | fermeture qui enterre mes fous | atome fermeture, LEVIER_DISPONIBLE adverse | lot 1 |
| C16 | Ouvrir la position quand on est mieux développé | Steinitz | inter. | levier ou échange de pions au centre | colonnes ou diagonales ouvertes alors que j'ai plus de pièces développées (DEVELOPPEMENT) | attaque, roi adverse au centre | ouverture qui rend ses pièces à l'adversaire | DEVELOPPEMENT, COLONNE_OUVERTE | lot 1 |

## D. Le roi

| # | Concept | Source | Niveau | Moyen | Déséquilibre | Exploitation | Piège | Faits | Statut |
|---|---|---|---|---|---|---|---|---|---|
| D1 | Mettre son roi à l'abri | tout le monde | déb. | roque | ROQUE_EFFECTUE, PIONS_ROI_BOUCLIER intact | les tours se relient | roque dans une aile déjà attaquée | ROQUE_EFFECTUE, PIONS_ROI_BOUCLIER | lot 1 |
| D2 | Attaque à la baïonnette | Kmoch, fianchetto | avancé | levier h4-h5 contre g6 | PIONS_ROI_AFFAIBLI adverse après l'échange des pions h | dame et tour sur la colonne h | h4-h5 sans fianchetto adverse | PIONS_ROI_AFFAIBLI | codé (recette) |
| D3 | Tempête de pions (roques opposés) | Kotov | avancé | poussées de pions sur l'aile du roi adverse | au moins deux pions avancés contre son roque, une colonne s'ouvre | mat ou matériel | tempête sans roques opposés (j'ouvre mon propre roi) | ROQUES_OPPOSES | lot 1 |
| D4 | Affaiblir le roque avant le roque | Steinitz, l'attaque justifiée | avancé | échange ou levier contre les pions f/g/h adverses avant qu'il roque | PIONS_ROI_AFFAIBLI adverse alors qu'il avait encore le droit de roquer de ce côté | il ne roque plus de ce côté | affaiblissement de mon côté | PIONS_ROI_AFFAIBLI, droits de roque | codé (drapeau) |
| D5 | Roi au centre : l'y maintenir | Steinitz | inter. | échecs, pressions et échanges qui empêchent le roque | ROI_AU_CENTRE adverse et il ne peut plus roquer, et ça tient | ouverture du centre | roi au centre qui roque au coup suivant | ROI_AU_CENTRE, droits de roque | lot 1 |
| D6 | Attaque du roi : amener les pièces | Vuković | avancé | manœuvres vers la zone du roi adverse | au moins trois de mes pièces à distance ≤ 2 du roi adverse, et ça tient | sacrifice, mat | pièces près du roi mais sans lignes ouvertes | mot de stratégie attaque_aile_roi | lot 1 |
| D7 | Échange des pièces attaquantes (défense) | Lasker, Steinitz | inter. | échanges des pièces adverses près de mon roi | moins de pièces adverses à distance ≤ 3 de mon roi | l'attaque s'éteint | échange qui ouvre une colonne sur mon roi | compteur d'attaquants | lot 1 |
| D8 | Regroupement défensif | Nimzowitsch, prophylaxie | inter. | pièces ramenées près de mon roi | atome regroupement répété | la défense tient | regroupement passif qui abandonne le centre | atome regroupement | lot 1 |
| D9 | Contre-attaque au centre face à l'attaque de flanc | Steinitz | avancé | levier central pendant que l'adversaire pousse sur une aile | son attaque de flanc est en cours (mot de stratégie) et j'ouvre le centre | ses pièces reviennent défendre | contre-attaque au centre fermé | atome levier central, stratégie adverse | lot 1 |
| D10 | Roi actif en finale | Capablanca, Dvoretsky | inter. | marche du roi | roi au centre ou au contact des pions adverses, en finale | gain de pions, soutien du pion passé | roi qui sort en milieu de partie | atome marche_roi, PHASE | lot 1 |
| D11 | Opposition et coupure du roi | finales de tours et de pions | avancé | tour qui coupe le roi adverse d'une rangée ou d'une colonne | le roi adverse ne peut plus rejoindre mon pion passé | promotion | coupure qui laisse ma tour passive | PION_PASSE, position des rois | lot 2 |

## E. Dynamique et échanges

| # | Concept | Source | Niveau | Moyen | Déséquilibre | Exploitation | Piège | Faits | Statut |
|---|---|---|---|---|---|---|---|---|---|
| E1 | Développer ses pièces | tout le monde | déb. | sorties de pièces mineures | PIECE_NON_DEVELOPPEE disparaît, DEVELOPPEMENT en ma faveur | ouverture du jeu (C16) | développement vers des cases chassables | DEVELOPPEMENT | lot 1 |
| E2 | Prendre le centre | Philidor, Steinitz | déb. | pions sur d4/e4 (d5/e5) | CONTROLE_CENTRE pour moi, et ça tient | espace, manœuvres | centre de pions surétendu et attaqué | CONTROLE_CENTRE | lot 1 |
| E3 | Échanger quand on est devant | technique (Capablanca) | déb. | échanges de pièces (pas de pions) | AVANTAGE_MATERIEL conservé, moins de pièces | finale gagnée | échanger les pions (ça rapproche de la nulle) | AVANTAGE_MATERIEL, atome echange | lot 1 |
| E4 | Gagner une faiblesse | Nimzowitsch | déb. | pression puis prise | un pion isolé, arriéré ou faible adverse est pris | matériel | prise d'un pion empoisonné | PION_ISOLE, PION_ARRIERE, PION_FAIBLE | lot 1 |
| E5 | Gagner un tempo (coup intermédiaire) | tactique de position | inter. | coup forçant (menace, pression) avant de reprendre ou de reculer | j'ai joué un coup utile de plus que l'adversaire dans la séquence | initiative | « tempo » qui affaiblit ma position | atomes menace, pression | lot 3 |
| E6 | Simplifier face à l'attaque | Capablanca, Lasker | inter. | échange des dames ou des pièces attaquantes quand il attaque | son attaque (stratégie) est en cours et le nombre de pièces baisse | la position se calme | simplification qui laisse une finale perdante | stratégie adverse, atome echange | lot 1 |
| E7 | Transformer un avantage | Steinitz, l'accumulation | avancé | échange d'un avantage contre un autre | un déséquilibre à moi disparaît et un autre plus durable apparaît (espace → pion passé, paire de fous → structure) | selon l'avantage obtenu | « transformation » qui perd les deux | combinaison de faits | lot 3 |
| E8 | Sacrifice positionnel de pion | Nimzowitsch, Bronstein | avancé | perte volontaire d'un pion (atome perte) suivie d'un déséquilibre durable à moi | PION_PASSE, avant-poste, colonne, complexe faible adverse ou roi adverse au centre, et l'évaluation ne s'effondre pas | initiative durable | perte de pion sans compensation (gaffe) | atome perte + un déséquilibre, trajectoire d'évaluation | lot 1 |
| E9 | Gambit | ouvertures, Morphy | inter. | perte volontaire d'un pion dans l'ouverture | avance de DEVELOPPEMENT, CONTROLE_CENTRE ou roi adverse au centre contre le pion | attaque | gambit « réfuté » (le pion est perdu sans rien) | atome perte, DEVELOPPEMENT, PHASE ouverture | lot 1 |
| E10 | Sacrifice de qualité pour la paire de fous ou les cases | Petrossian | avancé | tour contre pièce mineure (atome perte de 2) | PAIRE_FOUS, avant-poste ou COMPLEXE_FAIBLE adverse en échange | domination | qualité donnée sans déséquilibre | atome perte, faits | lot 1 |
| E11 | Prophylaxie | Nimzowitsch, Dvoretsky | avancé | coup qui enlève à l'adversaire son plan (restriction, soutien préventif) | le levier ou la manœuvre adverse disponible ne l'est plus (atome restriction), ou le plan adverse prédit chute | l'adversaire manque de plan | passivité déguisée | atome restriction, LEVIER_DISPONIBLE, ROUTE_CAVALIER adverses | lot 1 |
| E12 | Pièce passive à réactiver | Nimzowitsch, « la pire pièce » | inter. | manœuvre de la pièce la moins active | PIECE_PASSIVE à moi disparaît (mobilité retrouvée) | coordination | réactivation qui en bloque une autre | PIECE_PASSIVE, atome manoeuvre | lot 1 |

## F. Plans par structure (Soltis) — recettes à écrire par camp

| # | Structure | Plan du camp qui l'a | Plan de l'autre camp | Faits | Statut |
|---|---|---|---|---|---|
| F1 | Carlsbad | attaque de minorité (C3), ou jeu central e3-e4 | attaque à l'aile roi (D6), f5, cavalier en e4 | STRUCTURE | C3 codé, reste lot 2 |
| F2 | Pion dame isolé | C12 : d4-d5, attaque de pièces | C13 : blocage, échanges des mineures | STRUCTURE, PION_ISOLE | lot 1 |
| F3 | Chaîne Française (d4-e5 contre d5-e6) | attaque à l'aile roi (D6), f4-f5 | sape de la base c5 puis f6 (C10) | STRUCTURE, CHAINE_PIONS | lot 1 |
| F4 | Chaîne Est-indienne (d5-e4 contre d6-e5) | gain d'espace à l'aile dame, c4-c5 (C14, C1) | f7-f5 et tempête à l'aile roi (D3) | STRUCTURE | lot 1 |
| F5 | Pions pendants | poussée centrale (C11) | blocage et pression sur les deux pions | *PIONS_PENDANTS* | lot 2 |
| F6 | Hérisson (pions a6 b6 d6 e6) | ruptures b5 ou d5 (C1) | gain d'espace, pression sur d6 | *STRUCTURE hérisson* | lot 2 |
| F7 | Maróczy (pions c4-e4) | étau : restriction des leviers b5/d5 (E11) | leviers b5 ou f5, échange du cavalier c3 | *STRUCTURE Maróczy* | lot 2 |
| F8 | Structure sicilienne ouverte (e4 contre d6-e6) | f4-f5, e4-e5, attaque du roi (D6) | b5-b4, pression sur e4, colonne c | STRUCTURE | lot 2 |

### F bis. Les ouvertures (remarque de l'auteur, 1er octobre, 16 h 40)

Une ouverture est une recette de l'étage des coups, nommée, qui réalise des concepts des étages du dessus : elle
produit une structure (famille F), donc des plans canoniques, et des déséquilibres d'ouverture (développement, centre,
roi à l'abri, gambit = E9). Elle entre au catalogue par la structure qu'elle produit, pas comme un concept à part.
À faire, après les lots en cours : (1) le **fait** `OUVERTURE` (nom, code ECO, structure attendue) à partir de la base
de 3 820 lignes déjà présente (`coach/openings.mjs`, utilisée seulement par le portrait) ; (2) la **grille
ouverture × plan** sur le million de positions, par niveau (quels plans suivent quelle ouverture : a priori fort pour
les modèles, vérification de la théorie des structures) ; (3) dans la fiche, nommer l'ouverture et son idée.

## Décompte

Codés : 8 (A1, B1, B2, B3, C1, C2, C3, D2) et le drapeau D4. **Lot 1** (faits et atomes existants) : 40 entrées.
**Lot 2** (un fait à écrire : trajet de tour par la 3e, diagonale ouverte, pions pendants, hérisson, Maróczy, coupure
du roi) : 9. **Lot 3** (définition à discuter avec l'auteur : tempo, transformation d'un avantage) : 2. Total : 59.

Ordre de codage proposé pour le lot 1, par rendement attendu sur les coups calmes (inventaire du 1er octobre) :
1. pièces lourdes et pion passé : A2, A3, A4, A6, A7, A8, C4, C5, C6 ;
2. développement, centre, roi, échanges : E1, E2, E3, E4, D1, D5, D10 ;
3. structure et mineures : C7, C9, C10, C14, C15, C16, B4, B5, B6, B7, B9, B10, B12-13 ;
4. dynamique : E6, E8, E9, E10, E11, E12, D3, D6, D7, D8, D9, C8.

Chaque lot : détecteur (état but, agent, tenue de 6 demi-coups, clause du piège), recalcul des étiquettes sur les deux
machines (sans moteur), inventaire (fréquence par niveau, part des coups calmes rattachés), dix planches par concept,
jugement humain en aveugle (page de vérité de terrain), puis seulement le jugement d'exécution par le moteur.
