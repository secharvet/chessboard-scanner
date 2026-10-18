# Stabilité du test à deux demi-coups : reports/plans/stabilite/det-bin-stockfish-p18-preparatoire.json contre reports/plans/stabilite/games-stockfish-p18

35 lignes communes.

**Statut qui change** : 9/35. **Suite jouée (M, réponse, point calme) qui change** : 10/35.
**|Δ(Δ même pas)|** : médiane 11, 90e centile 273, max 564 (31 lignes). **|Δ(Δ meilleur pas)|** : médiane 11, 90e centile 273, max 564.

| ligne | statut A → B | suite A | suite B | Δ même pas A → B | Δ meilleur pas A → B |
|---|---|---|---|---|---|
| carlsbad|rupture b→b5 | préférence → **préparatoire** | h3 g6 | **h3 Fe6** | −0,15 → +0,16 | −0,10 → +0,16 |
| carlsbad|rupture e→e4 | nuit au plan → **préparatoire** | h3 g6 | **h3 Fe6** | −0,17 → +2,56 | −0,17 → +2,56 |
| fr-avance-blancs|transfert Ff1→e2 | préférence → **nuit au plan** | a3 c4 | **a3 Cge7 dxc5 Dc7** | +0,08 → −0,18 | +0,08 → −0,18 |
| fr-avance-blancs|transfert Fc1→e3 | nuit au plan → **préparatoire** | a3 c4 | **a3 Cge7 dxc5 Dc7** | −3,42 → +1,23 | −3,42 → +1,23 |
| fr-avance-blancs|transfert Cb1→b3 | préparatoire → **préférence** | a3 c4 | **a3 Cge7 dxc5 Dc7** | +0,69 → +0,00 | +0,69 → +0,00 |
| fr-avance-noirs|échange Fc8×Fe2 | nuit au plan → **préférence** | cxd4 cxd4 | = | −0,24 → −0,06 | −0,24 → −0,06 |
| fr-tarrasch-ouvert|transfert Cb3→d4 | préparatoire → **préférence** | Fd3 Cb4 | = | +0,16 → +0,15 | +0,16 → +0,15 |
| iqp-panov|transfert Dd1→d3 | préférence → **nuit au plan** | Ff4 g6 | **Ff4 Fa6** | +0,00 → −5,64 | +0,00 → −5,64 |
| kid-mar-del-plata|transfert Cc3→b5 | préférence → **nuit au plan** | g4 h5 | = | −0,14 → −0,31 | −0,14 → −0,31 |
| carlsbad|transfert Cf3→e5 | préparatoire | h3 g6 | **h3 Fe6** | +0,28 → +0,17 | +0,28 → +0,17 |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | nuit au plan | Ff4 c4 | = | — → — | −3,91 → −2,79 |
| espagnole-echange|rupture e→e5 | préférence | Fe3 b6 | = | −0,04 → −0,05 | −0,04 → −0,05 |
| espagnole-echange|transfert Cb1→d5 | nuit au plan | Ff4 c4 | = | −5,34 → −3,81 | −5,34 → −3,81 |
| espagnole-echange|échange Fc1×Ff8 | préférence | Fe3 b6 | = | −0,04 → −0,05 | −0,04 → −0,05 |
| fr-avance-blancs|rupture b→b4 | cible disparue | Fe2 cxd4 cxd4 Ch6 | = | — → — | — → — |
| fr-avance-noirs|transfert Cg8→f5 | préférence | cxd4 cxd4 | = | +0,05 → +0,05 | +0,05 → +0,05 |
| fr-avance-noirs|rupture f→f6 | nuit au plan | cxd4 cxd4 | = | −0,45 → −0,34 | −0,45 → −0,34 |
| fr-avance-noirs|colonne c | nuit au plan | Ch6 Fxh6 gxh6 Dd2 | = | −0,59 → −0,63 | −0,07 → −0,16 |
| fr-echange|rupture c→c4 | nuit au plan | Fg5 Fg4 | = | −0,20 → −0,21 | −0,20 → −0,21 |
| fr-echange|colonne e | préférence | Fg5 Fg4 | = | +0,04 → −0,02 | +0,04 → −0,02 |
| fr-echange|transfert Fc1→g5 | nuit au plan | Te1 h6 | = | −7,13 → −4,39 | −7,13 → −4,39 |
| fr-tarrasch-ferme|colonne c | préférence | O-O Ff4 Fxf4 Cxf4 | = | −0,07 → −0,11 | −0,07 → −0,11 |
| fr-tarrasch-ferme|transfert Cf6→e4 | préparatoire | O-O Ff4 Fxf4 Cxf4 | = | +0,77 → +0,77 | +0,77 → +0,77 |
| fr-tarrasch-ferme|rupture e→e5 | nuit au plan | O-O Ff4 Fxf4 Cxf4 | = | −1,99 → −1,23 | +0,33 → +0,26 |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | préférence | Fd3 Cb4 | = | +0,14 → +0,14 | +0,14 → +0,14 |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | bloqué | Fd3 Cb4 | = | — → — | — → — |
| fr-tarrasch-ouvert|transfert Fb5→d3 | nuit au plan | Fd2 Fg4 | = | −0,19 → −0,17 | −0,19 → −0,17 |
| herisson|rupture b→b5 | préférence | Tab8 Cc2 | **Tab8 De2** | −0,01 → −0,04 | +0,03 → +0,03 |
| herisson|rupture d→d5 | préparatoire | Tab8 Cc2 | **Tab8 De2** | +3,40 → +0,83 | +3,52 → +0,83 |
| herisson|colonne c | préférence | Tab8 Cc2 | **Tab8 De2** | — → — | +0,02 → +0,01 |
| iqp-panov|rupture d→d5 | préparatoire | Dd3 g6 | = | +0,58 → +0,69 | +0,58 → +0,69 |
| iqp-panov|transfert Cf3→e5 | préparatoire | Dd3 g6 | = | +1,33 → +1,28 | +1,33 → +1,28 |
| kid-mar-del-plata|rupture c→c5 | préférence | g4 h5 | = | +0,04 → −0,11 | +0,04 → −0,11 |
| kid-mar-del-plata|transfert Ce1→d3 | nuit au plan | g4 h5 | = | −0,32 → −0,52 | −0,32 → −0,52 |
| kid-mar-del-plata|colonne c | nuit au plan | g4 h5 | = | −0,18 → −0,52 | −0,18 → −0,52 |
