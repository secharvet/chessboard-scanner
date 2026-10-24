# Lecture coup par coup des 16 parties perdues — Expert échecs

Date : 20 octobre 2026. Demande de Sébastien via le pilote : « le livre a-t-il tort, ou le coach s'accroche-t-il ? »
Matériel : les deux extraits filtrés (fr-avance-noirs-b, iqp-panov-b), rien d'autre. **Vérifications moteur : 2**
(Stockfish 19 du VPS, prof. 30, un fil, table vidée avant chaque recherche) — V1 : française n° 3/8 au ply 20, Tg8
−0,11 contre O-O −1,86 ; V2 : Panov n° 1/2/7 au ply 7, Cg4 −0,86 contre Cd5 −1,61. Tout le reste se lit dans les
candidats du journal.

**Réponse courte : le livre n'a tort nulle part (zéro (a) sur seize) ; le coach s'accroche dans treize parties, par
trois mécanismes précis et récurrents ; trois parties sont perdues sans rapport avec le plan (c).**

## Française d'avance, coach Noirs (7 parties)

| partie | verdict | une ligne |
|---|---|---|
| SF 19 n° 2 | **(b)** | S'accroche à la rupture f6 52 demi-coups sans jamais la jouer — f6 vaut −6,99 chez les candidats dès le ply 4 (ligne du gambit b2, aile roi délabrée) ; le dégât propre : Fe7 progressant ret. 81 (ply 14). À lâcher vers le ply 4-14 ; signal : le coup de cible du plan coté sous −1,0 au moteur pendant des dizaines de demi-coups. |
| SF 19 n° 3 | **(b)** | À l'égalité (+0,00 plies 16-18), le plan paie Fe7 ret. 27 puis O-O ret. 85 — roquer dans la colonne g ouverte ; Tg8 était juste (vérifié prof. 30 : −0,11 contre −1,86). Lâché « sans objet » au ply 22, trop tard ; témoin +0,00. Signal : 112 cp de retards cumulés sur deux progressants consécutifs. |
| SF 19 n° 7 | **(c)** | Témoin même graine : −6,17. Le tirage adverse était perdant ; le coach finit −6,06, pas pire que le jeu libre. Rien à imputer au plan. |
| SF 19 n° 8 | **(b)** | Jumelle de la n° 3 (même Fe7 + O-O ret. 85 depuis l'égalité), témoin +0,00. Même signal. |
| SF 17.1 n° 1 | **(b)** | Le livre est gratis (f6 réalisé, prix +0,04) ; c'est le plan de SERVICE colonne f qui s'accroche : O-O-O ret. 47 (ply 10) puis Thf8 dernière chance ret. 69 (ply 22), « hors de prix » seulement au ply 30 après +1,20. Signal : cumul des retards du segment. |
| SF 17.1 n° 4 | **(b)** | f6 joué en dernière chance à ret. 129 (ply 18) — au-dessus de la borne de 1,0 que la décision à prof. 14 croyait respecter ; la re-mesure à 18 le disait. Couper au lieu de jouer. |
| SF 17.1 n° 6 | **(b)** | Service colonne f encore : O-O-O ret. 47, Fg7 dernière chance ret. 110 (ply 26), hors de prix au ply 36 après +2,01 ; témoin +0,81. Même signal que la n° 1. |

**Conclusion française** : le livre n'a pas tort — quand f6 est joué au bon moment il coûte +0,04 (parties 1 et 6,
SF 17.1). Deux fautes de mécanisme : dans la ligne du gambit b2 (les quatre SF 19), la rupture f6 est hors de prix
dès le ply 4 et le coach la garde adoptée (elle fournit des « progressants » — Fe7, O-O — qui sont les vraies fautes,
dont le roque dans la colonne ouverte, −1,7 à prof. 30) ; côté SF 17.1, le plan de service colonne f paie 47 + 69 à
110 cp sans que rien ne l'arrête avant +1,20/+2,01. Note de mesure, sans changer les verdicts : le prix de segment
(+4,70 partie n° 2) contient la boule de neige d'après-faute — défendable (une faute coûte la position qu'elle
laisse), mais la somme des retards (0,81) dit mieux la part du plan.

## Panov, pion isolé, coach Noirs (9 parties)

| partie | verdict | une ligne |
|---|---|---|
| SF 19 n° 1 | **(b)** | Cd5 en dernière chance ret. 54 (ply 7) alors que le Cf6 défendait le roi face à Dd3+h4+Fh6 (vérifié prof. 30 : Cg4 −0,86, Cd5 −1,61) ; puis colonne d maintenue du ply 9 au 33 sous l'attaque de mat (Dc7 69, Tc7 54, Td7 19), prix +4,00. À lâcher vers le ply 11 ; signal : cumul des retards pendant que l'adversaire ne joue que côté roi. |
| SF 19 n° 2 | **(b)** | Même Cd5 ret. 54 + Dc7 ret. 69 ; le compteur « hors de prix » finit par jouer (ply 23, +0,67) mais 12 demi-coups trop tard ; témoin +0,19. |
| SF 19 n° 3 | **(b)** | Cd5 en dernière chance ret. 109 (ply 5) — au-dessus de la borne ; le cavalier s'échange et le transfert meurt « sans objet ». La perte finale vient du jeu libre (témoin +0,10) mais le −1,45 initial vient de la dernière chance. |
| SF 19 n° 7 | **(b)** | Jumelle de la n° 1, colonne d tenue du ply 9 au 51 (« réalisée » à −5) ; témoin +0,48. Le cas le plus pur de « mauvaise aile » : tout le plan tire vers d pendant que h4-h5, Fh6, Cg5, Dh3 arrivent sur le roi. |
| SF 19 n° 9 | **(c)** | La preuve que la désignation est bonne : Cd5 progressant ret. 4, transfert réalisé à prix −0,18 (gratis), coût total −0,04. Perdu bien après les plans sur une tactique du jeu libre (Cxf7) ; témoin +0,00. |
| SF 17.1 n° 2 | **(b)** | Cd5 en dernière chance ret. 112 — au-dessus de la borne ; transfert « réalisé » à +1,29 ; témoin +0,00. |
| SF 17.1 n° 3 | **(c)** | Témoin ET autre bras −4,10 identiques, coût des plans −0,60 (gratis) : graine perdante, rien à imputer. |
| SF 17.1 n° 5 | **(b)** | Cd5 dernière chance ret. 54 (ply 9) + Tad8 ret. 50 → −1,71 au ply 11, la chute suit ; témoin +0,07. |
| SF 17.1 n° 9 | **(b)** | Cd5 progressant ret. 59 au ply 15, h5/Fh6 en face — le bon plan au mauvais moment ; prix +0,68 ; témoin +0,00. |

**Conclusion Panov** : le livre a raison sur la doctrine — bloquer l'isolé par Cd5 est LE plan noir, et la partie
n° 9 (SF 19) le réalise gratis, perdant ensuite pour d'autres raisons. Mais le moment est tout : face à la batterie
Dd3 + h4 + Fh6, le Cf6 est un défenseur du roi, et c'est la DERNIÈRE CHANCE qui force Cd5 à contretemps dans six des
neuf défaites (ret. 54 à 112, deux fois au-dessus de sa propre borne). L'avertissement du départ (−0,6) est réel mais
n'explique pas la queue : les témoins tiennent entre +0,00 et +0,48 partout sauf la n° 3 (SF 17.1).

## La règle générale qui découle des (b)

Treize (b) sur seize, trois mécanismes, une seule racine : **le coach paie plusieurs fois pour le même plan et
personne ne tient l'addition**. Le garde-fou par coup (concession ≤ 1,0) regarde chaque paiement isolément ; « hors
de prix en jeu » (3 coups sans progressant) ne se déclenche pas tant qu'il reste des progressants bon marché à payer.

**Règle d'or : le cumul est un garde-fou en jeu comme au faisceau.** Un segment de plan (livre, enchaînement ou
service) porte la somme des retards payés sous lui (progressants, dernières chances, roques) ; quand elle dépasse
1,0 pion, le plan est hors de prix en jeu — on enchaîne. C'est la transposition exacte du correctif (c) du faisceau
(coupe à concession cumulée > 1,0), déjà de la doctrine ; cohérente avec « un plan se paie à sa réalisation » parce
que le cumul est un déclencheur d'abandon, pas un prix publié. Sur ces seize parties, elle attrape : Fe7+O-O (112),
colonne f (116 ; 157), colonne d (123 et au-delà), et les trois dernières chances au-dessus de la borne.

**Corollaire (déjà consigné comme note d'homogénéisation 14/18)** : la dernière chance est re-mesurée à prof. 18
avant d'être jouée ; au-dessus de la borne, coupe au lieu de jouer. Trois cas ici : 109, 112, 129.

Aucun (a), aucun (d). Pas d'élargissement aux parties gagnées sans ton accord.
