# Test à deux demi-coups v2 — Stockfish 19, profondeur 18, un fil, plancher 25, bande 50, viable 30, 2 réponses

Axe 1 = effet de M sur le plan (Δ du retard du meilleur pas, pire des deux réponses) ; « ferme la fenêtre » = un pion adverse prend le contrôle de la case du pas. Axe 2 = état du plan après M et la pire réponse. « limite » = 25 < |Δ| ≤ 50. « sert » = plans frères que M fait progresser.

| position | plan | M | sert | axe 1 | limite | axe 2 | pire réponse (suite) | Δ meilleur pas | Δ même pas | pourquoi |
|---|---|---|---|---|---|---|---|---|---|---|
| fr-echange | transfert Fc1→g5 | Te1 | colonne e | **ferme la fenêtre** |  | hors de prix | h6 (Te1 h6) | −6,90 | −6,90 | le pion h6 contrôle g5 (0 → 1 attaquant) |
| fr-tarrasch-ouvert | échange Fc1×Ce7 | Fd3 | transfert Fb5→d3 | **ferme la fenêtre** |  | hors de prix | h6 (Fd3 h6) | −3,69 | −6,25 | le pion h6 contrôle g5 (0 → 1 attaquant) |
| espagnole-echange | poussée f→f4 ET rupture e→e5 | Ff4 | rupture e→e5, échange Fc1×Ff8 | **prépare** | limite | se paie | Tc8 (Ff4 Tc8) | +0,36 | — |  |
| fr-tarrasch-ferme | rupture e→e5 | O-O | — | **prépare** | limite | en préparation | Ff4 (O-O Ff4 Fxf4 Cxf4, point calme) | +0,36 | −1,75 | Ff4 vise e5 : plus cher, pas fermé |
| iqp-panov | transfert Cf3→e5 | Dd3 | transfert Dd1→d3 | **prépare** |  | se paie | g6 (Dd3 g6) | +1,29 | +1,29 |  |
| carlsbad | rupture e→e4 | h3 | — | **nuit** |  | hors de prix | a5 (h3 a5) | −0,54 | −0,54 |  |
| fr-avance-blancs | rupture b→b4 | Fe2 | transfert Ff1→e2 | **nuit** | limite | se paie | Ch6 (Fe2 Ch6 Fxh6 gxh6, point calme) | −0,42 | −2,63 |  |
| fr-avance-blancs | transfert Fc1→e3 | a3 | rupture b→b4 | **nuit** |  | hors de prix | c4 (a3 c4) | −3,29 | −3,29 |  |
| fr-avance-blancs | transfert Cb1→b3 | a3 | rupture b→b4 | **nuit** | limite | hors de prix | Fd7 (a3 Fd7) | −0,36 | −0,36 |  |
| fr-avance-noirs | échange Fc8×Fe2 | cxd4 | colonne c | **nuit** | limite | se paie | O-O (cxd4 O-O) | −0,45 | −0,45 |  |
| fr-avance-noirs | rupture f→f6 | cxd4 | colonne c | **nuit** |  | hors de prix | O-O (cxd4 O-O) | −0,87 | −0,87 |  |
| fr-echange | rupture c→c4 | Fg5 | transfert Fc1→g5 | **nuit** |  | hors de prix | h6 (Fg5 h6 Fh4 Fg4, point calme) | −0,68 | −0,68 |  |
| fr-tarrasch-ferme | transfert Cf6→e4 | O-O | — | **nuit** |  | hors de prix | Fg5 (O-O Fg5) | −7,52 | −7,52 |  |
| fr-tarrasch-ouvert | transfert Fb5→d3 | Fd2 | — | **nuit** | limite | mûr | Fg4 (Fd2 Fg4) | −0,30 | −0,30 |  |
| herisson | rupture d→d5 | Tab8 | — | **nuit** |  | hors de prix | De2 (Tab8 De2) | −1,25 | −1,25 |  |
| iqp-panov | transfert Dd1→d3 | Ff4 | — | **nuit** |  | se paie | Fd6 (Ff4 Fd6 Fg5 Ce7, point calme) | −0,56 | −0,56 |  |
| kid-mar-del-plata | colonne c | g4 | — | **nuit** | limite | se paie | Tf6 (g4 Tf6) | −0,33 | −0,33 |  |
| carlsbad | rupture b→b5 | h3 | — | **neutre** |  | en préparation | Fe6 (h3 Fe6) | +0,12 | +0,12 |  |
| carlsbad | transfert Cf3→e5 | h3 | — | **neutre** |  | mûr | Fe6 (h3 Fe6) | +0,19 | +0,19 |  |
| espagnole-echange | rupture e→e5 | Fe3 | — | **neutre** |  | en préparation | c4 (Fe3 c4 Cc5 Fxc5 Fxc5 Ce7, point calme) | −0,25 | — |  |
| espagnole-echange | transfert Cb1→d5 | Ff4 | rupture e→e5, échange Fc1×Ff8 | **neutre** |  | en préparation | Tc8 (Ff4 Tc8) | +0,11 | +0,11 |  |
| espagnole-echange | échange Fc1×Ff8 | Fe3 | — | **neutre** |  | en préparation | b6 (Fe3 b6) | −0,03 | −0,03 |  |
| fr-avance-blancs | transfert Ff1→e2 | a3 | rupture b→b4 | **neutre** |  | mûr | Fd7 (a3 Fd7) | −0,13 | −0,13 |  |
| fr-avance-noirs | transfert Cg8→f5 | cxd4 | colonne c | **neutre** |  | en préparation | cxd4 (cxd4 cxd4) | +0,05 | +0,05 |  |
| fr-avance-noirs | colonne c | Ch6 | transfert Cg8→f5 | **neutre** |  | en préparation | Fxh6 (Ch6 Fxh6 gxh6 Dd2, point calme) | −0,03 | −0,49 |  |
| fr-echange | colonne e | Fg5 | transfert Fc1→g5 | **neutre** |  | mûr | Fg4 (Fg5 Fg4) | −0,10 | −0,10 |  |
| fr-tarrasch-ferme | colonne c | O-O | — | **neutre** |  | se paie | Ff4 (O-O Ff4 Fxf4 Cxf4, point calme) | −0,05 | −0,05 |  |
| fr-tarrasch-ouvert | transfert Cb3→d4 | Fd3 | transfert Fb5→d3 | **neutre** |  | mûr | h6 (Fd3 h6) | −0,09 | −0,09 |  |
| fr-tarrasch-ouvert | échange Fb5×Cc6 | Fd3 | transfert Fb5→d3 | **neutre** |  | se paie | Te8 (Fd3 Te8) | −0,16 | — |  |
| herisson | rupture b→b5 | Tab8 | — | **neutre** |  | en préparation | De2 (Tab8 De2) | +0,02 | −0,11 |  |
| herisson | colonne c | Tab8 | — | **neutre** |  | mûr | De2 (Tab8 De2) | +0,02 | +0,02 |  |
| iqp-panov | rupture d→d5 | Dd3 | transfert Dd1→d3 | **neutre** |  | se paie | Cb8 (Dd3 Cb8) | +0,07 | −0,32 |  |
| kid-mar-del-plata | rupture c→c5 | g4 | — | **neutre** |  | en préparation | Tf6 (g4 Tf6) | +0,04 | +0,04 |  |
| kid-mar-del-plata | transfert Ce1→d3 | g4 | — | **neutre** |  | mûr | h5 (g4 h5) | −0,17 | −0,17 |  |
| kid-mar-del-plata | transfert Cc3→b5 | g4 | — | **neutre** |  | se paie | h5 (g4 h5) | −0,13 | −0,13 |  |

Bilan axe 1 : 3 prépare, 18 neutre, 12 nuit, 2 ferme la fenêtre ; 7 limite(s).
Bilan axe 2 : 7 mûr, 0 mûr (réalisé), 9 en préparation, 10 se paie, 9 hors de prix, 0 bloqué, 0 pas de point calme, 0 sans objet.

