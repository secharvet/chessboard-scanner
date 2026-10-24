# Plans canoniques par structure — table pour la bascule du faisceau

Expert échecs, 18 octobre 2026. Pour `positional/structures.js` (owner = le camp qui possède la
structure, au sens des signatures du fichier) ; instances dans les cinq familles de
`coach/plan-distance.mjs`, transferts par **type de pièce et case cible**. Les cases sont écrites
dans l'orientation owner = Blancs ; miroir pour l'autre couleur. Une ou deux instances par camp ;
quand un deuxième plan « sans débat » n'existe pas, c'est dit. Le POURQUOI est en une ligne, pour
les sorties du coach.

Rappel de grammaire qui corrige deux exemples du cahier des charges : **…f5 (Carlsbad) et …b5
(sicilienne) n'attaquent aucun pion — ce sont des `poussee`, pas des `rupture`** ; la rupture
vient au coup d'après (…f4, …b4 n'en est pas une non plus : il chasse une pièce). `estLevier`
les aurait refusées de toute façon.

## PDI — pion dame isolé (owner : le camp du pion d4)

| camp | instance | pourquoi (une ligne) |
|---|---|---|
| owner | transfert { D, d3 } | la batterie vers h7 : les pièces vers le roi tant qu'elles sont là — le plan « du moment » (notre arbitrage du panel) |
| owner | rupture { d, d5 } | la poussée libératrice, au moment de force maximale — souvent un sacrifice juste |
| opponent | transfert { C, d5 } | le blocus : un cavalier devant le pion, il ne craint rien |
| opponent | colonne { d } | la pression sur le pion faible ; en finale il tombe |

Note opponent : « échanger les pièces, surtout les actives » est un principe, pas une instance —
toute réalisation d'`echange` à valeur égale sert ce camp ; inutile de le lister comme plan.

## PIONS_PENDANTS — c4 + d4 (owner : le camp des pendants)

| camp | instance | pourquoi |
|---|---|---|
| owner | rupture { d, d5 } | la poussée qui transforme les pendants en force — jouée au pic d'activité |
| owner | transfert { C, e5 } | l'avant-poste que les pendants garantissent ; prépare l'attaque roi |
| opponent | rupture { b, b5 } | le levier contre c4 : forcer UNE poussée, puis bloquer l'autre pion |
| opponent | colonne { c } | les tours contre la paire : elle ne peut pas avancer sous pression |

## CARLSBAD (owner : le camp d4 sans pion c — celui de la minorité)

| camp | instance | pourquoi |
|---|---|---|
| owner | rupture { b, b5 } | l'attaque de minorité : échanger en c6 et léguer un pion c faible |
| owner | rupture { e, e4 } | l'alternative centrale (Botvinnik) : jouer au centre au lieu de l'aile |
| opponent | transfert { C, e4 } | le cavalier de contre-attaque sur la case que d5 garantit |
| opponent | poussee { f, f5 } | l'assaut roi (PAS une rupture : f5 n'attaque rien ; la rupture est f4, au coup d'après) |

Note owner : transfert { C, e5 } sert les deux ruptures — le faisceau le verra tout seul (plan
frère), inutile de le désigner. Nos arbitrages prof. 30 du panel : les deux plans owner sont
quasi gratuits, Ce5 aussi — cette structure a trois bons plans, pas un.

## CHAINE_E5 — chaîne d4-e5 contre e6-d5 (owner : le camp de la pointe e5)

| camp | instance | pourquoi |
|---|---|---|
| owner | rupture { f, f5 } | l'attaque de la base e6 (f4 d'abord) : la chaîne pointe vers le roi, on ouvre là |
| opponent | rupture { c, c5 } | la base d4 d'abord (Nimzowitsch) — le levier fondamental du camp e6/d5 |
| opponent | rupture { f, f6 } | la pointe e5 ensuite, quand d4 est sous pression |

Pas de deuxième plan owner « sans débat » : les pièces vers l'aile roi dépendent du dispositif
(Fd3 vers h7, Ce2-f4 contre e6 — conditionné « quand d4 ne dépend plus de lui », g4 contre
…Cf5). Le dire au faisceau par position, pas par structure.

## CHAINE_D5 — chaîne e4-d5 contre d6-e5 (owner : le camp de la pointe d5)

| camp | instance | pourquoi |
|---|---|---|
| owner | rupture { c, c5 } | contre d6 : la chaîne pointe vers l'aile dame, on ouvre là (Mar del Plata) |
| owner | colonne { c } | la colonne que c5 ouvrira — le plan de service attitré |
| opponent | rupture { f, f5 } | contre e4 : l'assaut roi, LE plan du camp d6/e5 |

Pas de deuxième plan opponent : la suite (…f4 puis g5-g4) est la même attaque en famille
`poussee` — une seule désignation suffit, le faisceau enchaîne.

## MAROCZY — étau c4 + e4 (owner : le camp de l'étau)

| camp | instance | pourquoi |
|---|---|---|
| owner | transfert { C, d5 } | la case que l'étau garantit : une pièce y vaut la paire |
| opponent | rupture { b, b5 } | contre c4 : la libération côté dame |
| opponent | rupture { f, f5 } | contre e4 : la libération côté roi |

Pas de deuxième plan owner « sans débat » : contre un fianchetto, l'échange des fous de cases
noires (echange { F, cible le F fianchetto }) est canonique ; sans fianchetto, c'est l'espace
(b4, f4) — conditionné au dispositif, à lier par position.

## PETIT_CENTRE_SICILIEN — d6 + e6 contre e4 (owner : le camp du petit centre)

| camp | instance | pourquoi |
|---|---|---|
| owner | rupture { d, d5 } | la poussée libératrice — tout le contre-jeu sicilien la prépare |
| owner | colonne { c } | la colonne semi-ouverte : les tours y travaillent en attendant …d5 |
| opponent | poussee { f, f4 } ET rupture { e, e5 } | la conjonction contre d6 : f4 soutient, e5 ouvre (même écriture que l'espagnole du panel) |

Note owner : …b5 est une `poussee` (elle n'attaque rien), au service de la colonne c et de …d5 —
le faisceau la verra en plan frère. Note opponent : en roques opposés, l'assaut g4-g5 (Keres)
passe DEVANT la conjonction — voir le modificateur ci-dessous.

## ROQUES_OPPOSES — modificateur, pas une structure

Les deux camps, symétriquement : **la course des pions contre le roi adverse prime sur les plans
de structure** (le tempo roi d'abord — celui qui ne court pas perd la course).

| camp | instance | pourquoi |
|---|---|---|
| chacun | poussee { g ou h, g5/h5 } puis rupture { g ou h, la case qui attaque un pion de l'abri } | ouvrir une colonne contre le roi : la poussée devient rupture dès qu'un pion de l'abri est cible (h5-h6 contre g7, g5-g6 contre f7/h7) |
| chacun | colonne { g ou h } | la colonne ouverte par l'assaut — le plan de service de la course |

L'instance exacte (g ou h, la cible) se lie à la position du roque adverse au moment de la
bascule, pas à la structure. Règle de préséance pour la division du faisceau : si ROQUES_OPPOSES
est actif, la branche « plan canonique de la nouvelle structure » teste D'ABORD l'assaut.
