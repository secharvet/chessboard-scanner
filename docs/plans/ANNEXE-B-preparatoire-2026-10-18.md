# Test à deux demi-coups — préparatoire ou préférence ? (prof. 18, plancher 15 cp) — 2026-10-18

Pour chaque plan, M est son meilleur coup non progressant à la racine. On joue M, la meilleure réponse adverse — et, si le meilleur coup est alors une prise ou une parade d'échec, ce coup et la réponse (point calme, colonne « suite ») — puis on mesure à nouveau le retard du pas du plan sur le meilleur coup de la position. Δ = retard avant − retard après, sur le MÊME pas qu'à la racine (le statut en découle) et sur le meilleur pas : Δ > plancher, M préparait le plan ; |Δ| ≤ plancher, préférence du moteur ; Δ < −plancher, M nuit au plan.

| Δ même pas | Δ meilleur pas | statut | position | plan | M | suite | pas de la racine (retard avant → après) | meilleur pas après (retard) |
|---|---|---|---|---|---|---|---|---|
| +1,29 | +1,29 | **préparatoire** | iqp-panov | transfert Cf3→e5 | Dd3 | Dd3 g6 | Ce5 (+2,13 → +0,84) | Ce5 (+0,84) |
| +0,87 | +3,56 | **préparatoire** | herisson | rupture d→d5 | Tab8 | Tab8 Cde2 | d5 (+3,65 → +2,78) | Dc5 (+0,09) |
| +0,77 | +0,77 | **préparatoire** | fr-tarrasch-ferme | transfert Cf6→e4 | O-O | O-O Ff4 Fxf4 Cxf4 *(point calme)* | Ce4 (+0,77 → +0,00) | Ce4 (+0,00) |
| +0,47 | +0,47 | **préparatoire** | iqp-panov | rupture d→d5 | Dd3 | Dd3 g6 | Fb3 (+0,78 → +0,31) | Fb3 (+0,31) |
| +0,28 | +0,28 | **préparatoire** | carlsbad | transfert Cf3→e5 | h3 | h3 g6 | Ce5 (+0,28 → +0,00) | Ce5 (+0,00) |
| +0,14 | +0,14 | **préférence** | kid-mar-del-plata | transfert Cc3→b5 | g4 | g4 h5 | Cb5 (+0,32 → +0,18) | Cb5 (+0,18) |
| +0,05 | +0,05 | **préférence** | fr-avance-noirs | transfert Cg8→f5 | cxd4 | cxd4 cxd4 | Ch6 (+0,05 → +0,00) | Ch6 (+0,00) |
| +0,03 | +0,11 | **préférence** | herisson | rupture b→b5 | Tab8 | Tab8 Cde2 | Dc5 (+0,12 → +0,09) | Fa8 (+0,01) |
| — (pas disparu) | +0,03 | **préférence** | herisson | colonne c | Tab8 | Tab8 Cde2 | Tac8 (+0,03 → n/a) | Tbc8 (+0,00) |
| +0,00 | +0,00 | **préférence** | iqp-panov | transfert Dd1→d3 | Ff4 | Ff4 Tc8 | Dd3 (+0,00 → +0,00) | Dd3 (+0,00) |
| +0,00 | +0,00 | **préférence** | kid-mar-del-plata | colonne c | g4 | g4 h5 | Tc1 (+0,02 → +0,02) | Tc1 (+0,02) |
| +0,00 | +0,00 | **préférence** | fr-echange | transfert Fc1→g5 | Te1 | Te1 Fg4 | Fg5 (+0,00 → +0,00) | Fg5 (+0,00) |
| −0,01 | −0,01 | **préférence** | fr-echange | colonne e | Fg5 | Fg5 Fg4 | Te1 (+0,08 → +0,09) | Te1 (+0,09) |
| −0,03 | −0,03 | **préférence** | espagnole-echange | rupture e→e5 | Fe3 | Fe3 b6 | Ff4 (+0,00 → +0,03) | Ff4 (+0,03) |
| −0,03 | −0,03 | **préférence** | espagnole-echange | échange Fc1×Ff8 | Fe3 | Fe3 b6 | Ff4 (+0,00 → +0,03) | Ff4 (+0,03) |
| −0,05 | −0,05 | **préférence** | kid-mar-del-plata | rupture c→c5 | g4 | g4 h5 | b4 (+0,04 → +0,09) | b4 (+0,09) |
| — (pas disparu) | −0,05 | **préférence** | fr-tarrasch-ouvert | échange Fb5×Cc6 | Fd3 | Fd3 h6 | Fxc6 (+0,28 → n/a) | Fb5 (+0,33) |
| −0,10 | −0,01 | **préférence** | carlsbad | rupture b→b5 | h3 | h3 g6 | a3 (+0,16 → +0,26) | Tab1 (+0,17) |
| −0,10 | −0,10 | **préférence** | fr-tarrasch-ferme | colonne c | O-O | O-O Ff4 Fxf4 Cxf4 *(point calme)* | Fd7 (+0,36 → +0,46) | Fd7 (+0,46) |
| −0,11 | −0,11 | **préférence** | fr-tarrasch-ouvert | transfert Cb3→d4 | Fd3 | Fd3 h6 | Cbd4 (+0,17 → +0,28) | Cbd4 (+0,28) |
| −0,13 | −0,13 | **préférence** | fr-echange | rupture c→c4 | Fg5 | Fg5 Fg4 | c4 (+0,35 → +0,48) | c4 (+0,48) |
| −0,14 | −0,14 | **préférence** | fr-avance-blancs | transfert Cb1→b3 | a3 | a3 a5 | Cbd2 (+0,71 → +0,85) | Cbd2 (+0,85) |
| −0,19 | −0,19 | **nuit au plan** | carlsbad | rupture e→e4 | h3 | h3 g6 | e4 (+3,70 → +3,89) | e4 (+3,89) |
| −0,26 | −0,26 | **nuit au plan** | fr-tarrasch-ouvert | transfert Fb5→d3 | Fd2 | Fd2 Fg4 | Fd3 (+0,00 → +0,26) | Fd3 (+0,26) |
| −0,27 | −0,27 | **nuit au plan** | fr-avance-blancs | transfert Ff1→e2 | a3 | a3 a5 | Fe2 (+0,08 → +0,35) | Fe2 (+0,35) |
| −0,31 | −0,31 | **nuit au plan** | kid-mar-del-plata | transfert Ce1→d3 | g4 | g4 h5 | Cd3 (+0,11 → +0,42) | Cd3 (+0,42) |
| −0,32 | −0,32 | **nuit au plan** | fr-avance-noirs | échange Fc8×Fe2 | cxd4 | cxd4 cxd4 | Fd7 (+0,24 → +0,56) | Fd7 (+0,56) |
| −0,46 | −0,46 | **nuit au plan** | fr-avance-noirs | rupture f→f6 | cxd4 | cxd4 cxd4 | f6 (+0,53 → +0,99) | f6 (+0,99) |
| −0,47 | +0,00 | **nuit au plan** | fr-avance-noirs | colonne c | Ch6 | Ch6 Fxh6 gxh6 Dd2 *(point calme)* | cxd4 (+0,00 → +0,47) | Fd7 (+0,00) |
| −0,66 | −0,66 | **nuit au plan** | fr-avance-blancs | transfert Fc1→e3 | a3 | a3 a5 | Fe3 (+1,58 → +2,24) | Fe3 (+2,24) |
| −1,99 | +0,33 | **nuit au plan** | fr-tarrasch-ferme | rupture e→e5 | O-O | O-O Ff4 Fxf4 Cxf4 *(point calme)* | e5 (+0,40 → +2,39) | Cg4 (+0,07) |
| — (pas disparu) | −4,15 | **nuit au plan** | espagnole-echange | poussée f→f4 ET rupture e→e5 | Ff4 | Ff4 c4 | f4 (+0,78 → n/a) | Fxc7 (+4,93) |
| −5,24 | −5,24 | **nuit au plan** | espagnole-echange | transfert Cb1→d5 | Ff4 | Ff4 c4 | Cc3 (+0,11 → +5,35) | Cc3 (+5,35) |
| −6,43 | −3,54 | **nuit au plan** | fr-tarrasch-ouvert | échange Fc1×Ce7 | Fd3 | Fd3 h6 | Fg5 (+0,14 → +6,57) | Txe7 (+3,68) |
| — | — | cible disparue | fr-avance-blancs | rupture b→b4 | Fe2 | Fe2 cxd4 cxd4 Ch6 | après Fe2 cxd4 cxd4 Ch6 la rupture n'a plus de pion à attaquer | |

Bilan : 5 préparatoire(s), 17 préférence(s), 12 qui nuisent au plan, 1 cible(s) disparue(s), 0 sans objet / réalisé / bloqué ; 5 mesure(s) prolongée(s) jusqu'au point calme.

