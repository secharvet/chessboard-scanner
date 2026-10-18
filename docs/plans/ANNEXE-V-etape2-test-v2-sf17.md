# Test à deux demi-coups v2 — Stockfish 17.1, profondeur 18, un fil, plancher 25, bande 50, viable 30, 2 réponses

Axe 1 = effet de M sur le plan (Δ du retard du meilleur pas, pire des deux réponses) ; « ferme la fenêtre » = un pion adverse prend le contrôle de la case du pas. Axe 2 = état du plan après M et la pire réponse. « limite » = 25 < |Δ| ≤ 50. « sert » = plans frères que M fait progresser.

| position | plan | M | sert | axe 1 | limite | axe 2 | pire réponse (suite) | Δ meilleur pas | Δ même pas | pourquoi |
|---|---|---|---|---|---|---|---|---|---|---|
| fr-echange | transfert Fc1→g5 | Te1 | colonne e | **ferme la fenêtre** |  | hors de prix | h6 (Te1 h6) | −4,59 | −4,59 | le pion h6 contrôle g5 (0 → 1 attaquant) |
| fr-tarrasch-ouvert | échange Fc1×Ce7 | Fd3 | transfert Fb5→d3 | **ferme la fenêtre** |  | hors de prix | h6 (Fd3 h6) | −2,68 | −4,09 | le pion h6 contrôle g5 (0 → 1 attaquant) |
| carlsbad | rupture e→e4 | h3 | — | **prépare** |  | hors de prix | a6 (h3 a6) | +1,24 | +1,24 |  |
| espagnole-echange | poussée f→f4 ET rupture e→e5 | Ff4 | rupture e→e5, échange Fc1×Ff8 | **prépare** |  | en préparation | Tc8 (Ff4 Tc8) | +0,52 | — |  |
| fr-tarrasch-ferme | rupture e→e5 | O-O | — | **prépare** | limite | mûr | Fg5 (O-O Fg5) | +0,36 | +0,36 |  |
| herisson | rupture d→d5 | Tab8 | — | **prépare** |  | hors de prix | De2 (Tab8 De2) | +0,98 | +0,98 |  |
| iqp-panov | rupture d→d5 | Dd3 | transfert Dd1→d3 | **prépare** |  | en préparation | g6 (Dd3 g6) | +0,62 | +0,62 |  |
| iqp-panov | transfert Cf3→e5 | Dd3 | transfert Dd1→d3 | **prépare** |  | hors de prix | g6 (Dd3 g6) | +1,10 | +1,10 |  |
| espagnole-echange | rupture e→e5 | Fe3 | — | **nuit** |  | se paie | c4 (Fe3 c4 Cc5 Fc8, point calme) | −0,71 | −4,88 |  |
| fr-avance-blancs | rupture b→b4 | Fe2 | transfert Ff1→e2 | **nuit** | limite | se paie | Ch6 (Fe2 Ch6 Fxh6 gxh6, point calme) | −0,38 | −2,23 |  |
| fr-avance-blancs | transfert Ff1→e2 | a3 | rupture b→b4 | **nuit** | limite | se paie | Fd7 (a3 Fd7) | −0,27 | −0,27 |  |
| fr-avance-blancs | transfert Fc1→e3 | a3 | rupture b→b4 | **nuit** |  | hors de prix | c4 (a3 c4) | −1,16 | −1,16 |  |
| fr-avance-blancs | transfert Cb1→b3 | a3 | rupture b→b4 | **nuit** | limite | hors de prix | Fd7 (a3 Fd7) | −0,35 | −0,35 |  |
| fr-avance-noirs | échange Fc8×Fe2 | cxd4 | colonne c | **nuit** |  | hors de prix | O-O (cxd4 O-O) | −0,79 | −0,79 |  |
| fr-avance-noirs | rupture f→f6 | cxd4 | colonne c | **nuit** |  | hors de prix | O-O (cxd4 O-O) | −0,85 | −0,85 |  |
| fr-echange | rupture c→c4 | Fg5 | transfert Fc1→g5 | **nuit** |  | hors de prix | Fe6 (Fg5 Fe6) | −0,67 | −0,67 |  |
| fr-tarrasch-ferme | transfert Cf6→e4 | O-O | — | **nuit** |  | hors de prix | Fg5 (O-O Fg5) | −4,88 | −4,88 |  |
| fr-tarrasch-ouvert | échange Fb5×Cc6 | Fd3 | transfert Fb5→d3 | **nuit** | limite | se paie | Te8 (Fd3 Te8) | −0,27 | — |  |
| kid-mar-del-plata | transfert Ce1→d3 | g4 | — | **nuit** | limite | se paie | h5 (g4 h5) | −0,42 | −0,42 |  |
| carlsbad | rupture b→b5 | h3 | — | **neutre** |  | en préparation | a6 (h3 a6) | +0,05 | +0,05 |  |
| carlsbad | transfert Cf3→e5 | h3 | — | **neutre** |  | mûr | Fe6 (h3 Fe6) | +0,24 | +0,24 |  |
| espagnole-echange | transfert Cb1→d5 | Ff4 | rupture e→e5, échange Fc1×Ff8 | **neutre** |  | en préparation | Tc8 (Ff4 Tc8) | −0,02 | −0,02 |  |
| espagnole-echange | échange Fc1×Ff8 | Fe3 | — | **neutre** |  | en préparation | c4 (Fe3 c4 Cc5 Fc8, point calme) | −0,07 | −4,88 |  |
| fr-avance-noirs | transfert Cg8→f5 | cxd4 | colonne c | **neutre** |  | en préparation | cxd4 (cxd4 cxd4) | +0,05 | +0,05 |  |
| fr-avance-noirs | colonne c | Ch6 | transfert Cg8→f5 | **neutre** |  | en préparation | Fxh6 (Ch6 Fxh6 gxh6 Dd2, point calme) | −0,14 | −0,58 |  |
| fr-echange | colonne e | Fg5 | transfert Fc1→g5 | **neutre** |  | mûr | Fg4 (Fg5 Fg4) | −0,01 | −0,01 |  |
| fr-tarrasch-ferme | colonne c | O-O | — | **neutre** |  | se paie | Ff4 (O-O Ff4 Fxf4 Cxf4, point calme) | +0,04 | +0,04 |  |
| fr-tarrasch-ouvert | transfert Cb3→d4 | Fd3 | transfert Fb5→d3 | **neutre** |  | mûr | h6 (Fd3 h6) | −0,07 | −0,07 |  |
| fr-tarrasch-ouvert | transfert Fb5→d3 | Fd2 | — | **neutre** |  | mûr | Fg4 (Fd2 Fg4) | −0,15 | −0,15 |  |
| herisson | rupture b→b5 | Tab8 | — | **neutre** |  | en préparation | De2 (Tab8 De2) | +0,00 | −0,04 |  |
| herisson | colonne c | Tab8 | — | **neutre** |  | mûr | De2 (Tab8 De2) | +0,03 | +0,03 |  |
| iqp-panov | transfert Dd1→d3 | Ff4 | — | **neutre** |  | mûr | Tc8 (Ff4 Tc8) | +0,00 | +0,00 |  |
| kid-mar-del-plata | rupture c→c5 | g4 | — | **neutre** |  | en préparation | h5 (g4 h5) | +0,00 | +0,00 |  |
| kid-mar-del-plata | colonne c | g4 | — | **neutre** |  | en préparation | a5 (g4 a5) | −0,20 | −0,20 |  |
| kid-mar-del-plata | transfert Cc3→b5 | g4 | — | **neutre** |  | se paie | h5 (g4 h5) | −0,10 | −0,10 |  |

Bilan axe 1 : 6 prépare, 16 neutre, 11 nuit, 2 ferme la fenêtre ; 6 limite(s).
Bilan axe 2 : 7 mûr, 0 mûr (réalisé), 10 en préparation, 7 se paie, 11 hors de prix, 0 bloqué, 0 pas de point calme, 0 sans objet.

