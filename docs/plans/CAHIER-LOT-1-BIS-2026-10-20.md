# Cahier des charges du lot 1 bis — le cumul et le coup utile (20 octobre 2026, soir)

Écrit avant tout code et toute partie, sur le go de Sébastien. À relire par le GE (via Sébastien), l'Expert (le sens) et le
Dev chef (la mécanique). Rien ne se code avant leur retour, rien ne se joue avant un go à part.

Sources : `RAPPORT-EPREUVE-DU-JEU-2026-10-20.md` (§ 9 : lecture des seize parties perdues, réponse du GE),
`LECTURE-EPREUVE-2026-10-20.md`, proposition de Sébastien et réponse du GE (« le petit coup utile »), code actuel
`coach/coup-contraint.mjs`.

## 1. Pourquoi

Le lot 1 passe le critère, mais une partie sur quinze se perd sous coach (une sur cent sans). La lecture des seize parties
perdues dit : le livre n'a jamais tort, **le coach s'accroche**, parce que personne ne tient l'addition de ce qu'un plan a
coûté. Et quand le plan doit attendre, le coach n'a qu'un geste : jouer le meilleur coup du moteur, le classer
« intendance » et le compter **contre** le plan (au troisième, le plan est abandonné). Un coup d'attente qui prépare la suite
est traité comme un aveu d'échec. Deux règles, une de chaque côté du même problème : **le cumul dit quand lâcher, le coup
utile dit quoi faire pendant qu'on attend.**

## 2. Règle 1 — le cumul (garde-fou en jeu)

1. Chaque segment de plan (livre, enchaînement, service) porte **la somme des retards** des coups du coach joués sous lui,
   **sauf les coups « forcé »** (une parade est neutre pour le plan, GE 19 oct.). Le retard est celui qui est déjà publié :
   meilleur coup de la MultiPV à la profondeur de jeu − valeur du coup joué.
2. **Le cumul se lit avant le coup** (Expert) : un pas du plan qui porterait la somme au-dessus de 1,00 pion est **refusé
   comme un pas trop cher**, et le coup se joue comme si le plan n'avait pas de pas admissible (roque, attente utile,
   intendance, libre). Lu après coup, le cumul laisserait passer le paiement fautif : française SF 19 n° 3, Fe7 27 + O-O 85 =
   112, O-O était déjà joué ; lu avant, O-O est refusé et le libre joue Tg8 (−0,11 contre −1,86 à prof. 30). Panov : Cd5 54 +
   Dc7 69 = 123, refusé au deuxième paiement au lieu de payer jusqu'au ply 33.
3. Quand la somme **atteint ou dépasse 1,00 pion** (100 cp, la borne `concession` déjà en vigueur coup par coup), le plan est **hors
   de prix en jeu** : abandon, raison « hors de prix (cumul) », publiée à part de « hors de prix (compteur) » ; on enchaîne
   sur l'instance suivante, comme aujourd'hui.
4. Le cumul est un **déclencheur d'abandon, pas un prix** : le prix publié du segment reste celui du faisceau libre au point
   calme (« un plan se paie à sa réalisation »). Le rapport publie les deux côte à côte (Expert : la somme des retards dit la
   part propre du plan, le prix contient la boule de neige d'après-faute).

## 3. Règle 2 — la dernière chance re-mesurée

La dernière chance est choisie à profondeur 14 (plafond de coût). Son retard est déjà relu à profondeur 18 avant d'être
publié ; il sera **relu avant d'être joué** : au-dessus de 1,00 pion à 18, la dernière chance est refusée (comme un
progressant trop cher) et le coup est joué en « libre », compteur + 1. Cas du lot 1 : 109, 110, 112, 129 cp.

## 4. Règle 3 — le coup utile (« attente utile »)

**Définition mécanique, sans règle d'échecs nouvelle.** Quand le plan courant n'a pas de pas admissible (aujourd'hui :
branche « intendance »), on regarde les candidats de la MultiPV (quatre, profondeur de jeu) qui ne sont pas des pas du plan.
Un candidat **sert** un plan du catalogue si, après lui, la distance de ce plan baisse — la même mesure que la colonne
« sert » du faisceau (`faisceau-plan.mjs`), portée dans l'exécutant. Plans comptés : les autres instances de la structure
reconnue (le catalogue de la position, plan courant exclu), **sauf celles déjà abandonnées « hors de prix » dans la partie**
(Expert : servir un plan qu'on vient de déclarer impayable n'est pas utile).

1. **Le moteur choisit, pas la règle** : on joue **le premier candidat, dans l'ordre du moteur, qui sert au moins un plan et
   coûte au plus 0,25 pion** (le plancher : un coup utile est gratuit dans le bruit, sinon il redevient un paiement). À
   égalité d'ordre, rien d'autre n'intervient (ni le nombre de plans servis, ni leur nature). Aucun candidat utile : on
   revient à l'intendance d'aujourd'hui.
2. Classe **« attente utile »**, **neutre pour le compteur** (comme le roque) — ce n'est plus un aveu d'échec. Son retard
   (≤ 25 cp) **entre dans le cumul** de la règle 1 : c'est le frein. Sans le cumul, l'attente utile allongerait exactement
   ce qui a perdu les seize parties ; les deux règles ne se jouent pas l'une sans l'autre.
3. **Borne d'attente** : au-delà de **six coups consécutifs du coach sans progressant** (attentes utiles comprises), le plan
   est abandonné « en attente » — un plan qui n'avance pas en six coups n'est plus le plan de la position, même gratuit.
   *(Valeur à trancher par le GE : six est une proposition ; l'Expert l'endosse, le double du « trois sans progressant »
   actuel parce que l'attente est devenue gratuite.)* Un plan abandonné « en attente » **n'a pas démérité : il reste
   ré-adoptable** plus tard, contrairement à « hors de prix » (sinon, dans les structures à préparation longue comme le
   hérisson, la borne jetterait définitivement le bon plan alors qu'il fallait jouer d'abord l'instance mûre).
4. Phrase du coach (publiée dans le journal, pas encore dans l'interface) : « le plan [X] attend ; en attendant, [coup] sert
   [plans servis] ».
5. **Ce que le coup utile ne couvre pas dans ce lot** : le regroupement près du roi (`atoms.mjs`) n'a pas de distance, donc
   ne « sert » rien au sens mécanique ; lui en donner une est un chantier à part (et le vrai remède à la Panov, avec le plan
   adverse, reste « nommer l'attaque d'en face » : au programme, pas dans ce lot).

**Question au GE — la table épuisée.** Les vingt-six coups par partie « structure reconnue, table épuisée » se jouent **sans
plan courant** : la règle 3 telle qu'écrite ne les touche pas. Les couvrir veut dire étendre l'attente utile au cas « pas de
plan » (le coup sert un plan du catalogue sans qu'aucun soit adopté) — c'est presque la règle différée « service après
abandon » (relecture § 9.1). Proposition : **oui, dans le bras B, étiqueté « attente utile sans plan »**, publié à part, même
borne de coût, sans compteur (il n'y a pas de plan à abandonner). Sinon la couverture ne bougera presque pas.
L'Expert l'endosse (c'est son « service après abandon » en plus prudent : pas d'adoption, étiqueté, publié à part) **avec sa
propre addition** : sans plan pas de segment, donc pas de cumul, et vingt-six coups à 0,25 pourraient payer en silence ce que
la règle 1 interdit. **La somme des retards « attente utile sans plan » d'une partie est plafonnée à 1,00 pion ; au-delà,
retour au libre pur.** Personne ne paie sans addition.

## 5. Les bras

Mêmes vingt départs-camps, dix parties par départ-camp et par bras, mêmes graines (appariées partie par partie avec le lot 1), profondeur 18, un fil, table
vidée, deux moteurs.

| bras | choix du plan | exécutant |
|---|---|---|
| A-livre | livre | règles 1 et 2 (garde-fou seul) |
| A-prix | prix | règles 1 et 2 |
| B-livre | livre | règles 1, 2 et 3 (garde-fou + coup utile) |
| B-prix | prix | règles 1, 2 et 3 |
| témoin | — | **repris du lot 1**, non rejoué (le chemin libre ne passe pas par l'exécutant ; vérifié par une partie fraîche identique) |

A contre lot 1 dit ce que rapporte le garde-fou ; B contre A ce que rapporte le coup utile ; prix contre livre, dans A et
dans B, répond enfin à la question du prix avec un exécutant qui ne s'accroche pas (GE : elle n'a pas été posée proprement).
Coût : 800 parties par moteur au lieu de 600 (environ 21 h de VPS à trois processus par moteur, beaucoup moins sur Orion).
**Option économe** si Sébastien le préfère : B-livre et B-prix seulement (400 par moteur), en renonçant à séparer les deux
règles.

## 6. Le critère, réécrit avant la première partie

Pour chaque bras, **aux deux moteurs** :
1. coût médian par partie ≤ 0,25 et coût moyen ≤ 0,50 (inchangé ; parties sans plan hors calcul, comptées à part) ;
2. **la queue : au plus 3 parties perdues sur 100** (éval finale < −2,00 côté coach, sur toutes les parties du bras, avec ou
   sans plan). Repère : le témoin en perd 1 %, le lot 1 en perdait 5 à 7 %.

**Le prix ajoute quelque chose** si, aux deux moteurs, dans le même exécutant : moyenne appariée (prix − livre) ≤ −0,10 et
queue du prix pas plus lourde que celle du livre. Sinon, le rapport dit « le prix n'ajoute rien au livre », cette fois avec
un exécutant sain.

## 7. Ce que le rapport publiera (en plus du § 9 de la relecture)

- **L'échange, pas seulement la médiane** (GE) : part des coups sous plan (progressants, attentes utiles comptées à part),
  coups « sans plan, table épuisée », contre le coût par coup sous plan et la queue — un professeur qui se tait plus mais ne
  perd plus, ou qui parle plus et paie quoi.
- Abandons par raison : réalisé, sans objet, bascule, hors de prix (compteur), hors de prix (cumul), en attente.
- Pour chaque attente utile : le coup, les plans servis, et si un plan servi a été adopté ensuite (le coup a-t-il
  « débloqué la suite » ?).
- Les seize parties perdues du lot 1, rejouées aux mêmes graines : combien le restent, dans A et dans B.

## 8. Code et contrôles avant de jouer

1. Code sur `division` uniquement : `coup-contraint.mjs` (règles 1 à 3 derrière des options, **défaut = comportement du lot
   1**) et `partie.mjs` (bras A et B). Tests hors ligne pour chaque règle (une position par cas, dont les quatre dernières
   chances au-dessus de la borne).
2. Relecture du Dev chef avant toute fusion.
3. **Non-régression** : options coupées, quelques parties du lot 1 rejouées doivent être identiques hors secondes.
4. Déterminisme : deux parties fraîches identiques par bras nouveau, à chaque moteur.
5. Puis le go de Sébastien pour jouer. Ensuite seulement : le lot de perturbation, sur le bras retenu.

## 9. Relecture de l'Expert (20 octobre, soir) — intégrée ci-dessus

Le sens tient. Quatre corrections, toutes reprises : le cumul lu **avant** le coup (le trou du premier jet : il constatait
après), les instances « hors de prix » exclues du « sert », le plan abandonné « en attente » ré-adoptable, et un plafond de
1,00 pion par partie pour l'attente utile sans plan. Réserve endossée telle quelle : le coup utile ne voit ni Tg8 (c'est un
refus de progressant, donc la règle 1) ni la défense du roi de la Panov (aucun plan du catalogue ne la mesure : le plan
adverse, autre chantier). Pour la Panov, c'est le cumul lu avant qui borne les dégâts.

## 10. Relecture du Dev chef (20 octobre, soir) — conditions de mise en œuvre

Les quatre points sont sains ; aucun appel moteur de plus (la dernière chance relue utilise le retard à 18 déjà calculé ;
« sert » n'est que de la distance sur les quatre candidats déjà notés). Conditions retenues pour le code :
1. **Une seule source de vérité** : compteur, cumul et borne d'attente se mettent à jour en un seul endroit, à partir de la
   classe du coup. Le cumul (somme des retards hors « forcé », jamais remise à zéro) est orthogonal au compteur ; la borne
   d'attente suit le compteur **sauf** sur l'attente utile — divergence écrite explicitement, pas trois `if` dispersés.
2. La dernière chance est refusée sur son **retard à 18**, pas sur son coût à 14 ; raison publiée à part : « dernière chance
   refusée (relecture 18) ».
3. **Non-régression ciblée** : les parties rejouées options coupées couvrent les branches touchées — les quatre dernières
   chances au-dessus de la borne (109, 110, 112, 129), un abandon au compteur et une bascule — pas un tirage au hasard.
4. **Reprise du témoin par moteur** : une partie fraîche identique contre le témoin du lot 1 à SF 19, une autre à SF 17.1.
Le Dev chef relira le code sur `division` avant toute fusion, en particulier la source unique.

## 11. Réponse du GE (20 octobre, soir) — décisions

1. **Cumul lu avant le coup : approuvé** (« un garde-fou qui constate après coup est un commentateur »). **Ajout** : un refus
   par l'addition n'est pas un abandon automatique, c'est **une vérification** — le faisceau court depuis la position (une
   minute de moteur, cas rares) distingue le sacrifice en cours de route du plan qui ne reviendra pas. *Proposition du
   pilote, à relire par l'Expert et le Dev chef* : au refus, faisceau du plan courant depuis la position (mêmes réglages que
   la mesure des segments) ; si son prix est ≤ 0,25 (le plancher), le pas refusé est joué et le cumul repart de ce prix ;
   sinon, abandon « hors de prix (cumul) ». Le rapport publie le nombre de vérifications et leur issue.
2. **Attente utile sans plan : oui**, aux deux conditions déjà écrites — elle sert au moins une instance du catalogue **non
   abandonnée** dans la position (sinon c'est du jeu libre, compté à part), et chaque coup est sous le plancher (≤ 0,25) ;
   le plafond d'un pion par partie par-dessus.
3. **Patience de six : oui, comme paramètre.** Elle ne compte que les coups qui ne servent **pas du tout** le plan (a4 avant
   b5, le soutien d'une case font baisser la distance : ce sont des progressants, ils remettent à zéro). Le lot publie **la
   distribution des abandons par patience**, pour régler la valeur après, pas avant. **Reprise automatique** : dès qu'un pas
   admissible sous le plancher réapparaît, le plan abandonné « en attente » revient.
4. **Taille du lot** : la queue décide, et voir une baisse de sept à trois pour cent demande deux cents parties par bras.
   Complet à SF 19 (la question prix contre livre reste ouverte) ; économe à SF 17.1, bras livre seulement (confirmer
   l'agrégat et la queue). Lot de perturbation à part. *Lecture exacte à confirmer par Sébastien* (voir ci-dessous).
5. **Critère écrit avant**, avec la queue (≤ 3 perdues sur 100) à côté de la médiane et de la moyenne, et **la couverture
   publiée en première ligne** du rapport.
6. **Remarque du GE — le regroupement** : l'atome existe (« une pièce ramenée près du roi quand deux pièces adverses ou plus
   rôdent ») ; lui donner une distance permettrait au coup utile de voir l'attaque arriver — premier pas, à portée, vers le
   plan adverse. Hors de ce lot sauf décision de Sébastien (il change ce que « sert » compte, donc la comparaison A / B).

**Taille, deux lectures possibles de « six cents parties »** (200 parties par bras et par moteur) :
- (i) SF 19 : B-livre + B-prix (400) ; SF 17.1 : B-livre (200) = **600**, mais sans bras A, on ne sépare plus le garde-fou
  du coup utile ;
- (ii) SF 19 : A-livre, A-prix, B-livre, B-prix (800) ; SF 17.1 : A-livre + B-livre (400) = 1 200.

## 12. Relecture de l'Expert sur la vérification au faisceau (§ 11.1)

Sur pièces du journal, la vérification n'aurait **sauvé à tort aucune** des fautes vues : O-O (française n° 3/8) est refusé
à 27 + 85 = 112 et le faisceau ne peut pas dire gratuit (référence libre −0,11 par Tg8, glissade 17.Cf6+ à quatre
demi-coups) ; Cd5 (Panov) ne déclenche pas la vérification (54 seul, sous la borne), c'est Dc7 (54 + 69 = 123) qui la
déclenche, et l'effondrement de la colonne d est à quatre-six demi-coups. Trois conditions retenues :
1. horizon de la vérification **au moins 8 à 10 demi-coups** (l'attaque doit atterrir dedans) ;
2. référence = **faisceau libre depuis la même position**, mêmes réglages ;
3. **un seul sauvetage par segment** : si l'addition déborde à nouveau après un sauvetage, abandon sans deuxième
   vérification (« un plan qui redemande sans cesse la caisse est mort »).

## 13. Relecture du Dev chef sur la vérification et la reprise (§ 11)

1. **Faisceau court dans l'exécutant** : sûr, avec le même Noteur (cache par position et profondeur, table vidée avant
   chaque recherche, appels séquentiels) ; interdit table gardée ou à plusieurs fils, comme partout.
2. **Une vérification par segment** (concorde avec l'Expert, § 12.3) : au deuxième refus par le cumul dans un même segment,
   abandon direct.
3. **Reprise d'un plan « en attente »** : une seule classification par coup, deux usages — les compteurs du plan actif et le
   balayage des plans dormants. Le balayage ne coûte aucun appel moteur (distance sur les quatre candidats déjà notés) ; si
   une vérification de prix est exigée, une seule fois, au moment de la reprise. **À la reprise, le plan garde son cumul et
   sa borne** (pas de remise à zéro : pas d'oscillation abandon → reprise → abandon). Plusieurs dormants jouables au même
   coup : **le premier dans l'ordre du catalogue**.
