# Branches prioritaires du répertoire vers nos structures — Expert échecs, 25 octobre 2026

Toutes les suites ont été rejouées avec chess.js. La structure d'arrivée a été lue par `buildStructureFacts`
(dev-lead). Chaque choix du coach a été mesuré au moteur : Stockfish 19, un fil, table vidée, profondeur 18. La
concession est l'écart avec le meilleur coup. Aucune ne dépasse 30 cp, sauf les deux coups écartés, qui sont signalés.
« Coach » désigne les coups que le coach choisit ; ceux de l'adversaire ne sont pas garantis.

| # | coach | suite SAN | structure | concession, remarque |
|---|---|---|---|---|
| 1 | Blancs | e4 e6 d4 d5 **e5** | CHAINE_E5 (propriétaire : Blancs) | 3.e5 +0,24 contre 3.Cc3 +0,47 : 23 cp. Structure acquise tout de suite. 3.Cc3 permettait 3…dxe4 (partie V0). |
| 2 | Blancs | e4 e5 Nf3 Nc6 Bc4 Bc5 **c3** Nf6 **d4** exd4 **cxd4** Bb4+ **Bd2** Bxd2+ **Nbxd2** d5 **exd5** Nxd5 | PDI (Blancs) | 5.d4 −0,06 contre 5.d3 +0,22 : 28 cp, le prix du jeu ouvert. **7.Bd2, pas 7.Nc3** (−0,29). |
| 3 | Blancs | e4 e5 Nf3 Nc6 Bc4 Be7 **d4** d6 **d5** | CHAINE_D5 (Blancs) | 4.d4 et 5.d5 sont les meilleurs coups. |
| 4 | Blancs | e4 c6 d4 d5 **exd5** cxd5 **Bd3** Nc6 **c3** | CARLSBAD inversé (propriétaire : Noirs) | Hors livre, à ajouter en mini-livre (5 coups). 3.exd5 +0,16 contre +0,28 : 12 cp. Le coach est du côté adverse de la minorité. Plans miroirs de la table : C vers e5, poussée f4-f5. |
| 5 | Blancs, seulement si 1.d4 | d4 d5 c4 e6 Nc3 Nf6 **cxd5** exd5 **Bg5** (…c6) | CARLSBAD (Blancs) | 4.cxd5 +0,20 contre +0,22 : gratuit. Mais 1.d4 change la racine du répertoire, et tous nos livres commencent par 1.e4. Je ne le recommande pas pour la série du critère. |
| 6 | Noirs | e4 e6 d4 d5 Nc3 **Nf6** e5 | CHAINE_E5 (propriétaire : Blancs ; le coach mène les ruptures c5 et f6) | 3…Cf6 −0,33 contre −0,26 : 7 cp. **Écartés : 3…dxe4 (−0,59, sort des structures) et 3…Fb4 (−0,66 : 40 cp à cette profondeur, au-dessus du plafond).** |
| 7 | Noirs | e4 e6 d4 d5 Nd2 **c5** exd5 exd5 … dxc5 | PDI (Noirs) | 3…c5 est le meilleur coup (−0,24). La structure n'apparaît que si les Blancs prennent en c5. |
| 8 | Noirs | e4 e6 d4 d5 e5 **c5** | CHAINE_E5 (Blancs) | La rupture c5 tout de suite (−0,34 contre −0,23 : du bruit, c'est le même coup en tête). |
| 9 | Noirs | e4 e5 Nf3 Nc6 Bc4 **Bc5** c3 **Nf6** d4 **exd4** cxd4 **Bb4+** Bd2 **Bxd2+** Nbxd2 **d5** | PDI (Blancs ; le coach bloque en d5) | 3…Fc5 −0,22 contre −0,12 : 10 cp. **6…Fb4+ est obligatoire : 6…Fb6 perd (−2,18 ; e5 Ce4 De2).** |

Ce qui n'est accessible depuis aucun de nos livres : pions pendants, Maróczy, petit centre sicilien. Il faudrait 1.d4
ou une Sicilienne. C'est l'argument de Sébastien pour enrichir la grammaire plutôt que tordre le répertoire.

**Attention, mécanique.** `livres/*.js` porte la mention « Livre exporté de la base … Ne pas éditer à la main ». Ma
correction du 5.Cxf6+ (« Cf3 puis Fg5 la chassera, d'où …h6 ») doit donc aussi entrer **dans la base**. Sinon, le
prochain export la reprendra.
