# Enrichissement de la grammaire : structures rencontrées, plans canoniques — Expert échecs, 25 octobre 2026

Même format que `plans-canoniques-structures.md` (commit c09aff9). Owner est le camp qui possède la structure. Les cases
sont écrites dans l'orientation owner = Blancs (miroir pour les Noirs). Les familles sont celles de
`coach/plan-distance.mjs`. Rangées **relatives** au camp : la 4e rangée des Noirs, c'est la 5e de l'échiquier.

**D'où viennent ces structures.** J'ai fait tourner des détecteurs candidats (chess.js, mon scratchpad
`structures-parties.mjs`) sur les quatre parties entières du coach : maia-w-01, maia-b-02, sf1500-w-01 et sf-w-01. La
démonstration Carlsbad est exclue, puisqu'elle commence sur une position du panel. Nos sept structures n'y apparaissent
qu'une fois : CHAINE_E5, 9 demi-coups, sf1500-w-01. Voici ce qui y apparaît, en nombre de demi-coups :

| structure candidate | w-01 | b-02 | sf1500 | sf | parties |
|---|---|---|---|---|---|
| PION_PASSE (passé à la 4e rangée relative ou plus loin) | — | 40 | 82 + 18 | 119 | 3 |
| ROI_AU_CENTRE (roi adverse non roqué, centre entrouvert) | 33 | 18 | 25 | 1 | 4 |
| MAJORITE (plus de pions sur une aile) | 23 | — | 32 + 20 | 66 | 3 |
| UNE_COLONNE_OUVERTE | 20 | — | 24 | 40 | 3 |
| FINALE (sans dames, petit matériel) | — | 16 | — | 80 | 2 |
| RUBINSTEIN (d4 contre e6) | 12 | — | — | — | 1 |
| CENTRE_OUVERT (aucun pion d ni e) | 11 | — | 11 | — | 2 |

Ces comptes sortent de mes détecteurs d'essai, un peu plus larges que les règles écrites plus bas : majorité comptée sur les colonnes a à c, roi au centre sans la condition « mon roi roqué ». Les chiffres définitifs viendront de ton détecteur.

Ce sont **deux structures de pions** et **cinq situations de jeu** (roi, aile, colonne, finale, centre). Le
coach les traverse dans chaque partie. Ce n'est pas une liste choisie après coup pour faire passer un critère : il n'y
a pas de critère de plan ici.

---

## 1. PION_PASSE (owner : le camp du pion passé)
Reconnaissance : un pion à moi sans aucun pion adverse devant lui, ni sur sa colonne ni sur les deux voisines, arrivé
à la 4e rangée relative ou plus loin. En finale, à toute rangée.

| camp | instance | pourquoi |
|---|---|---|
| owner | poussee { passé, 8e rangée } | « Un pion passé doit avancer » : chaque pas rapproche la dame et fixe une pièce adverse |
| owner | transfert { T, derrière le passé, même colonne } | La tour derrière le pion passé : elle gagne en force à chaque pas du pion (règle de Tarrasch) |
| opponent | transfert { C, case devant le passé } | Le blocus : le cavalier bloque sans perdre ses cases, c'est le meilleur bloqueur |
| opponent | transfert { T, derrière le passé } | La tour derrière le pion passé, même adverse : de là, elle le suit jusqu'au bout |

## 2. ROI_AU_CENTRE (owner : le camp qui attaque ; opponent : le camp dont le roi est au centre)
Reconnaissance : roi adverse sur les colonnes c à f, à sa 1re ou 2e rangée. Dames sur l'échiquier. Coup 8 passé.
Colonne d ou e sans pion **à moi** (semi-ouverte de mon côté : c'est elle qui mène au roi), ou un levier d/e disponible. **Et mon roi roqué.** (Correction du 25 oct. : j'avais écrit « sans pion adverse », ce qui envoyait la tour derrière son propre pion, cf. b-02 17…Db6.)
Au moteur, sur w-01 après 8…c5 (prof. 18) : la rupture d5 vaut −1,19, contre +1,24 pour O-O. Ouvrir le centre avant
d'avoir mis son propre roi à l'abri est une faute. La condition « mon roi roqué » n'est donc pas une préférence, elle
est nécessaire.

| camp | instance | pourquoi |
|---|---|---|
| owner | colonne { e } (sinon { d }), celle sans pion à moi | Une tour sur la colonne qui mène à son roi resté au centre : il ne pourra plus y rester tranquille |
| owner | rupture { d, d5 } (ou { e, e5 }, le levier disponible) | Ouvrir le centre pendant que son roi y est encore |
| opponent | transfert { R, g8 } (roquer) | Mettre le roi à l'abri d'abord : tant qu'il est au centre, chaque colonne qui s'ouvre est pour l'adversaire |

Note : le roque doit compter pour **un** coup dans la distance du transfert du roi. À vérifier dans `plan-distance.mjs`.

## 3. MAJORITE (owner : le camp qui a plus de pions sur une aile)
Reconnaissance : aile dame = colonnes a à d, aile roi = colonnes e à h. Owner a plus de pions que l'adversaire sur
une aile, et pas plus sur l'autre. Pas avant le coup 12, quand le centre est déjà échangé.
**Candidat** : le pion de la majorité dont la colonne n'a pas de pion adverse. Si aucun ne l'est, celui qui a le
moins d'adversaires devant lui.

| camp | instance | pourquoi |
|---|---|---|
| owner | poussee { candidat, 5e rangée } | Le candidat avance en premier, les autres le soutiennent : c'est ainsi qu'une majorité fait un pion passé |
| owner | transfert { R, d3 } (côté majorité, seulement en finale) | En finale, le roi soutient la majorité ; deux contre un ne s'arrête pas sans lui |
| opponent | transfert { C, case devant le candidat } | Bloquer le candidat, et la majorité ne peut plus rien produire |

Note : l'adversaire a presque toujours sa propre majorité sur l'autre aile, donc son propre jeton MAJORITE. C'est une
course, et chaque camp a déjà son plan. Rien à ajouter.

## 4. UNE_COLONNE_OUVERTE (owner : les deux camps)
Reconnaissance : exactement une colonne sans aucun pion, et une tour au moins de chaque côté.

| camp | instance | pourquoi |
|---|---|---|
| les deux | colonne { la colonne ouverte } | La seule colonne ouverte appartient à qui l'occupe en premier : y doubler les tours |
| les deux | transfert { T, 7e rangée de cette colonne } | Le but de la colonne : la 7e rangée, d'où la tour attaque les pions restés chez eux |

## 5. FINALE (owner : les deux camps)
Reconnaissance : pas de dames, et chaque camp a au plus tour + pièce mineure (8 points) hors pions.

| camp | instance | pourquoi |
|---|---|---|
| les deux | transfert { R, e4 } (ou d4, la case centrale la plus proche) | En finale, le roi est une pièce forte : au centre, il touche les deux ailes |

C'est la seule instance. Le reste de la finale est de la tactique et nos connaissances de finale : carré, cases
critiques, nulles. Sébastien l'avait écrit.

## 6. RUBINSTEIN — d4 contre e6 (Française Rubinstein, Caro-Kann classique) (owner : le camp du pion d4)
Reconnaissance : moi, d4 et pas de pion e. Lui, e6 et pas de pion d.

| camp | instance | pourquoi |
|---|---|---|
| owner | transfert { C, e5 } | L'avant-poste que d4 garantit, d'où le cavalier gêne tout le jeu noir |
| owner | poussee { c, c4 } | De l'espace à l'aile dame, et la case d5 enlevée aux pièces adverses |
| opponent | rupture { c, c5 } | La libération : attaquer d4. Au moteur, sur w-01 (ply 15), …c5 −1,21 contre le meilleur −0,92, soit 29 cp, dans le plafond |
| opponent | rupture { e, e5 } | L'autre libération. Elle demande une préparation : sur w-01, …e5 tout de suite coûte 73 cp |

## 7. CENTRE_OUVERT (owner : les deux camps)
Reconnaissance : aucun pion sur les colonnes d et e, des deux côtés.

| camp | instance | pourquoi |
|---|---|---|
| les deux | colonne { d } | Les colonnes centrales sont les routes du jeu : les tours y vont avant les pions |
| les deux | colonne { e } | Idem. Celle des deux qui est en face du roi adverse d'abord |

---

## Ce que je ne propose pas, et pourquoi
- **Paire de fous contre cavaliers.** C'est déjà un terme d'évaluation (+0,3). Son plan, « ouvrir la position », est
  une rupture que les pions décident : elle est déjà dans les structures ci-dessus. Il n'y a pas d'instance propre à
  mesurer par une distance.
- **Française d'échange (d4 contre d5, pas de pion e).** C'est une structure fréquente au club, mais aucune partie du
  coach ne l'a traversée. Je l'écris pour plus tard, sans la mettre dans ce lot : colonne { e }, transfert { C, e5 } et,
  pour déséquilibrer, rupture { c, c4 }.
- **Finale de tours** à part : couverte par PION_PASSE (tour derrière) et FINALE (roi au centre). La « tour active » est
  un terme de mobilité, pas un plan.

## Vérifications
- Détecteurs rejoués avec chess.js sur les quatre parties entières, avec les comptes ci-dessus.
- Stockfish 19, un fil, table vidée, profondeur 18 : w-01 au ply 15 (…c5 −1,21, …e5 −1,65, meilleur −0,92) ; w-01 après
  8…c5 (O-O +1,24, d5 −1,19, dxc5 +0,11).
- Les autres instances sont la doctrine classique (Nimzowitsch pour le pion passé et le blocus, Capablanca pour la
  majorité, Tarrasch pour la tour derrière le pion passé). Aucune n'est un coup précis : ce sont des cibles de distance.
  Le coach les paiera à sa propre évaluation, sous le plafond de 30.
