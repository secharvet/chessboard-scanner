# Réponse au GE — largeur effective, échelle ligne, répétition, table de hachage (19 octobre 2026, après-midi)

Suite au verdict du matin (note de relecture § 7 et § 10). Trois points demandés, une découverte en plus qui change la
lecture des chiffres d'hier. Tout est mesuré à un fil, SF 19, profondeur 18, **table de hachage vidée avant chaque recherche**
(nouvelle méthode, § 4). Les fichiers : `faisceau-v4/sans-coupe/` (nouvelle référence) et `faisceau-v4/coupe/` (autopsie de
la division) à côté de cette note.

## 1. Largeur effective du faisceau contraint — vérifiée sans jouer

Ce qui est compté : à chaque coup du faisceau contraint, le nombre de branches gardées après le tri (le faisceau libre en
garde 4). Lecture **jusqu'au coup de réalisation de la ligne retenue** : après, il ne reste que les retardataires et leur
nombre ne dit rien de l'étroitesse ; un 0 final est l'extinction, pas une largeur.

| | |
|---|---|
| plans mesurés | 35 (dix positions) |
| coups mesurés jusqu'à la réalisation (comprise) | 215 |
| largeur médiane | 4 |
| coups à largeur < 4 | 17 (8 %) — 1 : 8 coups, 2 : 6, 3 : 3 |
| plans à largeur médiane < 4 | 0 |
| plans à minimum < 4 | 10 sur 35 ; à minimum 1 : 5 (un seul coup admissible à la racine : les trois plans noirs de l'avance française ; un coup étroit en cours de ligne : Fc1×Ce7 du Tarrasch ouvert, d5 de la Panov) |

*Chiffres recalculés à 16 h d'une seule source, les JSON de la passe v5 à table vide au code corrigé (branches gardées,
réalisée comprise, lues jusqu'au coup de réalisation) : la réserve du Dev chef de 15 h est fermée. Les chiffres provisoires
(27 coups étroits, 14 %, quatre plans à médiane < 4) venaient du décompte sans la branche réalisée et surestimaient
l'étroitesse ; la colonne du tableau en bas vient de la même source.*

Verdict sur ta hypothèse : **le faisceau contraint a la largeur du libre dans 92 % des coups.** L'étroitesse est concentrée à la
racine (un seul coup admissible, les trois plans noirs de l'avance française) et sur quelques coups isolés en cours de
ligne. L'écart de largeur n'explique donc qu'une petite part du
biais d'enveloppe ; la part principale est celle mesurée hier à largeur égale (le libre prend le meilleur après réponse
parmi 4 × réponses ouvertes, la gloutonne ne choisit pas).

## 2. L'échelle ligne, publiée à côté de l'enveloppe — avec sa propre limite

Colonne « prix ligne » = ligne gloutonne − ligne retenue, au même point calme. Sur les 30 plans réalisés :

| | enveloppe (hier, gelée) | ligne |
|---|---|---|
| plans à prix ≤ 0 (« gratuit ») | 8 / 30 | 23 / 30 |
| enveloppe − ligne | médiane +0,49 (de 0 à +1,55) | |

L'écart « enveloppe − ligne » n'est que le biais du **côté libre** (faisceau libre − gloutonne au point calme) : le côté
contraint est la même ligne dans les deux colonnes. Et cette ligne retenue est elle-même **choisie** : la meilleure après
réponse parmi 4 branches × réponses ouvertes. L'échelle ligne compare donc un côté choisi à 4 et un côté gloutonne à 1 :
elle **favorise le plan**, comme l'enveloppe le pénalise (deux mécanismes différents, de sens opposés ; leur égalité n'est
pas démontrée). Ni l'une ni l'autre n'est l'échelle des parties ; seule
l'épreuve du jeu (une ligne contre une ligne, le coach-prix contre le coach-livre) l'est. Les deux colonnes sont publiées,
le coach ne parlera qu'une langue : celle de l'épreuve, quand elle aura parlé.

Contrôle gratuit prévu au dépouillement (ta colonne « Σ retards ») : si la somme des retards d'une partie recompose le prix
ligne, l'échelle ligne est celle des parties au biais de choix près.

## 3. La division Carlsbad e4, lue depuis la bascule (ton point 2)

Même position que la partie fraîche (Carlsbad après 10…Cf8, Blancs), plan e→e4, 20 demi-coups, SF 19 prof. 18, table vide.

- **Depuis la racine** : viable mais ça coûte +0,68 (brut +0,88, calme après Fxe4 Cf4). Ligne : h3 a5 Tad1 Ch5′ Fxe7 Txe7′
  **e4** (dernière chance, concession 0,65) dxe4. Bascule au 8e demi-coup CARLSBAD → PDI, par l'adversaire (dxe4).
- **Continuer depuis la bascule** (référence : faisceau libre relancé depuis la position de bascule) : **−0,03**. Le prix
  d'e4 est payé dans la poussée elle-même ; une fois dans la PDI, continuer ne coûte rien.
- **Adopter dans la PDI** : rupture d→d5, *c'est le plan* +0,11, tempo 11 (Fxe4 Cf4′ d5 cxd5) ; transfert Dc2→d3 (batterie
  vers h7), *viable mais ça coûte* +0,54, tempo 24.
- Lecture : le livre dit « e4 » et il a raison sur le plan, pas sur le moment (0,65 à la poussée) ; dès que la structure a
  basculé, le plan propre à la PDI (d5) est gratuit. C'est l'écart entre les bras que la partie fraîche montrait, retrouvé
  sans jouer et chiffré.
- **Relecture de l'Expert sur l'échiquier** (treize sondes SF 19 sur Orion, table vide, prof. 18 ; livrable
  `autopsie-carlsbad-e4.md` à côté de cette note) : la division est juste. e4 concède 0,19 à prof. 18 au nœud de la poussée
  (0,65 est le chiffre prudent de la dernière chance à prof. 14, même décision) ; à la bascule Fxe4 est le meilleur coup ;
  dans la PDI, d5 forcé +0,23 contre meilleur +0,20. Le +0,54 du transfert Dc2→d3 est la vraie histoire : Cf4 couvre d3, la
  batterie doit faire le détour Dc1–e3 ; la mesure inverse l'ordre canonique de la table (batterie avant d5) pour une raison
  de position — cas d'école, pas une correction de table. Les deux coupes « concession » à +8,40 / +7,98 ne sont **pas** une
  tactique laissée par l'adversaire (je l'avais écrit à tort) : c'est le propre coup du plan, Dd3??, qui donne la dame
  (Cxd3) ; coupé, pas tarifé, rien ne fuit dans les prix. Les deux coupes du faisceau principal (6,09 et 1,75) sont de même
  nature (e4?? avec le fou g5 en prise ; e4 prématuré). Recommandation d'affichage pour après le lot : imprimer le coup
  refusé à côté de la concession (« concession 8,40 (Dd3??) »), pour que le lecteur lise « le plan ne peut plus avancer qu'en
  donnant la dame ».

La coupe à concession cumulée 1,0 (variante `coupe/`) ne change **aucun prix** des 33 plans réalisés ou hors de prix ; elle
remplace deux « en cours à l'horizon » absurdes (Fc1→e3 à +4,34, d5 de la Panov à +6,55 : des branches vivantes très
en dessous du libre) par « pas réalisable sans concession ». Elle devient le réglage par défaut du faisceau de rapport ; le
pilote ne l'utilise pas.

## 4. Ce qui change la lecture d'hier : la table de hachage comptait, et pas qu'un peu

Découvert à midi (note § 10) : à un fil, Stockfish est déterministe **à historique égal**. La même position notée après
cinq autres recherches bouge de 2 à 12 cp et change l'ordre des candidats. Décision prise : table vidée avant chaque
recherche en mode mesure (surcoût 3 %). Le lot 1 et la re-passe des dix positions ont été relancés ainsi à 11 h.

J'avais écrit que les prix d'hier « bougeraient de quelques centièmes ». C'est faux. Entre la passe d'hier et celle
d'aujourd'hui, **la phrase de 17 plans sur 35 change** et des prix bougent de près de deux pions (Carlsbad b5 : « en cours »
−1,66 → « c'est le plan » +0,22 ; Panov d5 : +0,94 → « en cours » +6,55). Le mécanisme : quelques centièmes déplacent un
candidat du 2e au 4e rang, le faisceau garde d'autres branches, ouvre d'autres réponses, et vingt demi-coups plus loin la
ligne retenue n'est plus la même. Quatre bascules sont des franchissements de seuil à moins de 0,40 (b4, Dd1→d3, Fc1×Ff8,
la colonne c du KID) ; les treize autres sont des lignes différentes.

*Réserve du Dev chef (15 h), fermée à 16 h par la mesure.* La passe d'hier venait de l'ancien code, celle d'aujourd'hui du
module refondu ; le refactor était une non-opération par lecture du code, pas par mesure. Mesure faite sur Orion : les dix
positions au code d'aujourd'hui, hash gardé contre table vide — une seule variable bascule.

| | phrases changées | lignes retenues changées | prix | ligne libre changée |
|---|---|---|---|---|
| **table seule** (code d'aujourd'hui, hash gardé → table vide) | **16 / 35**, sur huit positions | 33 / 35 en ligne pleine (dont 3 où nos coups tiennent et seule la réponse adverse bouge) | écart médian 0,33, max 5,61, sur 29 plans tarifés des deux côtés | 10 / 10 positions |
| **code et l'historique qu'il induit** (hier v3 → aujourd'hui hash gardé) | **1 / 35** (Panov Dd1→d3, +0,26 → +0,12 : la correction du point calme, connue) | 2 / 35 | 28 / 35 plans au même prix ; les 7 qui bougent le font de 5 à 14 cp, sous le plancher 25 | 0 / 10 |

Les dix-sept bascules d'hier se décomposent donc en **seize dues à la table et une due au code** ; la borne haute était la
valeur. Deux précisions du Dev chef (16 h 30). La seconde ligne n'isole pas le code pur : à hash gardé, le code refondu
change aussi l'ordre et le nombre des recherches contraintes, donc la table conservée ; l'isolement propre (ancien code à
table vide) est impossible, v3 étant antérieur au vidage, et « 1 phrase » est un majorant de l'effet du code, pas une
mesure. Et l'artefact touche la référence autant que la contrainte : la ligne libre elle-même est re-routée par la table
(10/10) alors que le code ne la touche pas (0/10) ; séparer la part du libre et la part du contraint dans l'écart de prix
demanderait une passe instrumentée et ne changerait pas la conclusion (33 cp médians nets > plancher 25 : on vide).
Critère automatique : 6/10 à hash gardé, hier comme aujourd'hui au code corrigé, 5/10 à table vide.

Ce que j'en tire, à contester :

1. **Le verdict d'hier reste gelé comme verdict sur la méthode**, pas sur les positions : la phrase du faisceau est une
   lecture à un état du moteur. La re-passe `sans-coupe` est la nouvelle référence (table vide, reproductible : preuve de
   deux passes fraîches identiques, § 5).
2. **Reproductible n'est pas robuste.** Le faisceau amplifie un bruit de 10 cp en un changement de ligne. L'épreuve du jeu
   ne souffre pas du même défaut de la même façon : chaque partie est une trajectoire, et le dépouillement agrège 10 parties
   × 10 départs par bras ; c'est l'agrégat qui est robuste, pas une partie.
3. Pour le faisceau de rapport, je propose de ne plus publier une phrase sans sa **marge** : la distance du prix au seuil
   le plus proche, et « c'est le plan » seulement à plus de 0,25 du seuil (le plancher de bruit mesuré). À décider après le
   lot 1, pas pendant.

## 5. Preuves et état

- Triple répétition : corrigée avant le lot 1 (compteur de positions, « nulle (répétition) » comptée à part), vérifiée sur la
  partie fraîche (coupée au 71e demi-coup) et sur deux parties fraîches Orion identiques hors secondes.
- **Deux passes fraîches à table vide sur Orion (Carlsbad, avance française blancs, Panov) : identiques au centième, 10 plans
  sur 10** (phrase, prix, prix brut, tempo, ligne retenue, bascule, division ; sorties JSON identiques hors durées). La
  nouvelle méthode est reproductible.
- **Passe v5 à table vide sur les dix positions, code corrigé (largeurs 8af9520, option hash gardé f8a3e1c) : identique au
  centième à la passe v4 sur 35 plans sur 35** (phrase, prix, prix brut, tempo, ligne, bascule, division). Les deux
  correctifs sont des non-opérations sur les prix, et la reproductibilité à table vide est établie sur les dix positions.
- Lot 1 (SF 19, trois processus) : relancé à 11 h Paris avec la table vide ; fin estimée demain midi. Dépouillement selon
  § 9 de la note de relecture : écart agrégé coach-prix − coach-livre, N effectif par départ, M1 à 0, nulles par répétition,
  demi-coups « sans plan, table épuisée », Σ retards contre prix ligne, part des coups sous plan.

## 6. Réponse du GE (15 h) et ce qui est engagé

Le GE a raison, et je l'écris sans l'adoucir : **le verdict d'hier est un tirage.** Le plancher de 25 mesuré avant-hier
portait sur les évaluations ; le faisceau est un processus de sélection discret (quatre branches, seuil d'ex æquo, seuil
de concession) et le plancher de *ses* sorties n'a jamais été mesuré — la marche sautée, la même erreur que les fils. Le
compte automatique du critère passe d'ailleurs de 6 positions sur 10 (passe d'hier) à 5 sur 10 (passe d'aujourd'hui). On
ne sait pas si le critère a passé.

Engagé :

1. **Aujourd'hui** : la page « à lire en premier » dit désormais « neuf sur dix sur un tirage de l'instrument ; robustesse
   non mesurée ; dix-sept phrases sur trente-cinq sensibles ; le taux de passage sera mesuré ». La lecture à froid portera
   sur ce chiffre-là.
2. **Cette nuit, sur Orion** : le critère sous six tirages — profondeur 17, 18, 19 × table vidée / gardée — sur les dix
   positions, même code, un fil (les deux tirages à profondeur 18 sont les passes v5 qui ferment la réserve du Dev chef ;
   les quatre autres suivent automatiquement). Publié : la matrice positions × tirages, les positions réussies par
   tirage, le **taux de passage** (tirages à ≥ 7 positions réussies sur 10), et par plan le nombre de phrases distinctes
   et l'étendue des prix (`scripts/plans/taux-de-passage.mjs`). L'ordre des ex æquo comme septième perturbation demande
   une option dans le code : après le lot. La clause « prof. 30 » ne se rejoue pas par tirage ; le taux publié est celui
   du compte automatique, la clause sera appliquée à part sur les positions qui restent contestées dans tous les tirages.
3. **Après le lot 1, sur l'instrument** : prix d'un plan = médiane des branches réalisées (plus le maximum) ; phrase avec sa
   marge, « c'est le plan » à plus de 0,25 du seuil ; coupes à marge (garder les branches à moins d'une marge de la
   quatrième, pas exactement quatre) ; coup refusé imprimé à côté de la concession.
4. **Après le lot 1, sur l'épreuve** : le lot 1 est la référence déterministe, il ne conclut rien seul ; il lui faut son
   lot de perturbation (profondeur 17 à 19, ordre des ex æquo côté exécutant), pour que l'agrégat échantillonne vraiment la
   variabilité. À spécifier avec le GE avant de lancer.

## Tableau — les 35 plans, hier (hash gardé) et aujourd'hui (table vide)

Phrase en gras = changée. Largeur eff. = médiane · minimum jusqu'à la réalisation comprise, recalculée à 16 h depuis les JSON
v5 table vide (une seule source, § 1). « avec coupe » = idem sauf mention ; le nombre entre parenthèses est le nombre de
branches coupées pour concession cumulée > 1,0. La colonne « aujourd'hui » (v4) est identique au centième à la passe v5
table vide ; la colonne « hier » (v3) coïncide avec la passe v5 à hash gardé sur 34 phrases sur 35 (Panov Dd1→d3 y devient
« c'est le plan +0,12 »).

| position | plan | hier (v3, hash gardé) | aujourd'hui (v4, table vide) | prix ligne | largeur eff. | tempo | avec coupe 1,0 |
|---|---|---|---|---|---|---|---|
| carlsbad | rupture b→b5 | en cours à l'horizon −1,66 | **c'est le plan +0,22** | −1,18 | 4 · 4 | 17 | idem (2) |
| carlsbad | rupture e→e4 | viable mais ça coûte +0,35 | viable mais ça coûte +0,68 | +0,18 | 4 · 2 | 7 | idem (0) |
| carlsbad | transfert Cf3→e5 | c'est le plan +0,19 | c'est le plan +0,11 | +0,05 | 4 · 4 | 4 | idem (0) |
| espagnole-echange | poussée f→f4 ET rupture e→e5 | jamais urgent ici — | **pas réalisable sans concession —** | — | 4 · 2 | ∞ | idem (0) |
| espagnole-echange | rupture e→e5 | pas réalisable sans concession — | **viable mais ça coûte +0,87** | +0,24 | 4 · 4 | 19 | idem (0) |
| espagnole-echange | transfert Cb1→d5 | c'est le plan −0,12 | c'est le plan −0,07 | −0,70 | 4 · 4 | 20 | idem (0) |
| espagnole-echange | échange Fc1×Ff8 | viable mais ça coûte +0,28 | **c'est le plan −0,10** | −0,69 | 4 · 4 | 14 | idem (0) |
| fr-avance-blancs | rupture b→b4 | viable mais ça coûte +0,30 | **c'est le plan +0,23** | −0,10 | 4 · 4 | 3 | idem (4) |
| fr-avance-blancs | transfert Ff1→e2 | c'est le plan +0,23 | c'est le plan −0,12 | −0,45 | 4 · 4 | 6 | idem (0) |
| fr-avance-blancs | transfert Fc1→e3 | viable mais ça coûte +0,62 | **en cours à l'horizon +4,34** | — | 4 · 2 | ∞ | pas réalisable sans concession — (8) |
| fr-avance-blancs | transfert Cb1→b3 | pas réalisable sans concession — | **c'est le plan +0,07** | −0,70 | 4 · 4 | 10 | idem (35) |
| fr-avance-noirs | transfert Cg8→f5 | viable mais ça coûte +0,52 | **c'est le plan −0,06** | −0,53 | 4 · 4 | 6 | idem (0) |
| fr-avance-noirs | échange Fc8×Fe2 | viable mais ça coûte +0,52 | **pas réalisable sans concession —** | — | 4 · 1 | ∞ | idem (0) |
| fr-avance-noirs | rupture f→f6 | viable mais ça coûte +1,08 | viable mais ça coûte +0,77 | +0,20 | 4 · 1 | 7 | idem (1) |
| fr-avance-noirs | colonne c | viable mais ça coûte +0,44 | viable mais ça coûte +0,39 | −0,18 | 4 · 1 | 8 | idem (0) |
| fr-echange | rupture c→c4 | viable mais ça coûte +0,36 | viable mais ça coûte +0,89 | −0,06 | 4 · 4 | 9 | idem (0) |
| fr-echange | colonne e | c'est le plan +0,14 | c'est le plan +0,01 | −0,22 | 4 · 4 | 6 | idem (0) |
| fr-echange | transfert Fc1→g5 | c'est le plan +0,08 | c'est le plan +0,06 | +0,01 | 4 · 4 | 2 | idem (0) |
| fr-tarrasch-ferme | colonne c | c'est le plan −0,04 | c'est le plan +0,08 | −0,58 | 4 · 4 | 14 | idem (0) |
| fr-tarrasch-ferme | transfert Cf6→e4 | viable mais ça coûte +0,53 | **c'est le plan −0,03** | −0,19 | 4 · 4 | 6 | idem (0) |
| fr-tarrasch-ferme | rupture e→e5 | viable mais ça coûte +0,37 | **c'est le plan −0,55** | −1,34 | 4 · 4 | 23 | idem (5) |
| fr-tarrasch-ouvert | transfert Cb3→d4 | c'est le plan +0,12 | c'est le plan −0,03 | −0,12 | 4 · 4 | 6 | idem (0) |
| fr-tarrasch-ouvert | échange Fc1×Ce7 | en cours à l'horizon +2,20 | **pas réalisable sans concession —** | — | 4 · 1 | ∞ | idem (6) |
| fr-tarrasch-ouvert | échange Fb5×Cc6 | jamais urgent ici — | **c'est le plan +0,04** | −0,05 | 4 · 4 | 6 | idem (0) |
| fr-tarrasch-ouvert | transfert Fb5→d3 | c'est le plan +0,05 | c'est le plan +0,06 | −0,03 | 4 · 4 | 6 | idem (0) |
| herisson | rupture b→b5 | viable mais ça coûte +0,30 | viable mais ça coûte +1,23 | −0,32 | 4 · 3 | 19 | idem (16) |
| herisson | rupture d→d5 | viable mais ça coûte +0,73 | viable mais ça coûte +0,53 | +0,12 | 4 · 3 | 5 | idem (0) |
| herisson | colonne c | c'est le plan +0,02 | c'est le plan +0,03 | −0,17 | 4 · 4 | 6 | idem (0) |
| iqp-panov | rupture d→d5 | viable mais ça coûte +0,94 | **en cours à l'horizon +6,55** | — | 4 · 1 | ∞ | pas réalisable sans concession — (13) |
| iqp-panov | transfert Cf3→e5 | viable mais ça coûte +0,35 | viable mais ça coûte +1,09 | +1,09 | 4 · 4 | 12 | idem (18) |
| iqp-panov | transfert Dd1→d3 | viable mais ça coûte +0,26 | **c'est le plan −0,06** | −0,15 | 4 · 4 | 2 | idem (0) |
| kid-mar-del-plata | rupture c→c5 | c'est le plan −0,29 | c'est le plan +0,06 | −0,33 | 4 · 4 | 3 | idem (3) |
| kid-mar-del-plata | transfert Ce1→d3 | viable mais ça coûte +0,62 | viable mais ça coûte +0,33 | −0,31 | 4 · 4 | 6 | idem (0) |
| kid-mar-del-plata | colonne c | c'est le plan −0,07 | **viable mais ça coûte +0,32** | −0,42 | 4 · 4 | 12 | idem (0) |
| kid-mar-del-plata | transfert Cc3→b5 | c'est le plan −0,04 | **viable mais ça coûte +0,75** | −0,04 | 4 · 4 | 6 | idem (0) |

Un plan réalisé au premier coup a une largeur sur un seul coup, celui de la réalisation (Fc1→g5 de l'échange, Dd1→d3 de la Panov).
