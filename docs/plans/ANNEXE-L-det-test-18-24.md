# Stabilité du test à deux demi-coups : reports/plans/stabilite/det-bin-stockfish-p18-preparatoire.json contre reports/plans/stabilite/bin-stockfish-p24

35 lignes communes.

**Statut qui change** : 12/35. **Suite jouée (M, réponse, point calme) qui change** : 11/35.
**|Δ(Δ même pas)|** : médiane 18, 90e centile 563, max 826 (31 lignes). **|Δ(Δ meilleur pas)|** : médiane 13, 90e centile 575, max 826.

| ligne | statut A → B | suite A | suite B | Δ même pas A → B | Δ meilleur pas A → B |
|---|---|---|---|---|---|
| carlsbad|rupture b→b5 | préférence → **nuit au plan** | h3 g6 | = | −0,15 → −0,21 | −0,10 → −0,07 |
| fr-avance-blancs|transfert Ff1→e2 | préférence → **nuit au plan** | a3 c4 | **a3 Ch6** | +0,08 → −0,28 | +0,08 → −0,28 |
| fr-avance-blancs|transfert Cb1→b3 | préparatoire → **préférence** | a3 c4 | **a3 Ch6** | +0,69 → +0,03 | +0,69 → +0,03 |
| fr-avance-noirs|échange Fc8×Fe2 | nuit au plan → **préférence** | cxd4 cxd4 | = | −0,24 → −0,04 | −0,24 → −0,04 |
| fr-echange|rupture c→c4 | nuit au plan → **préférence** | Fg5 Fg4 | = | −0,20 → −0,02 | −0,20 → −0,02 |
| fr-echange|transfert Fc1→g5 | nuit au plan → **préférence** | Te1 h6 | **Te1 Fg4** | −7,13 → +0,00 | −7,13 → +0,00 |
| fr-tarrasch-ferme|colonne c | préférence → **préparatoire** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | −0,07 → +0,25 | −0,07 → +0,25 |
| fr-tarrasch-ferme|transfert Cf6→e4 | préparatoire → **nuit au plan** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | +0,77 → −7,38 | +0,77 → −7,38 |
| fr-tarrasch-ferme|rupture e→e5 | nuit au plan → **préparatoire** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | −1,99 → +0,32 | +0,33 → +0,32 |
| herisson|rupture b→b5 | préférence → **nuit au plan** | Tab8 Cc2 | **Tab8 De2** | −0,01 → −0,23 | +0,03 → +0,02 |
| herisson|rupture d→d5 | préparatoire → **nuit au plan** | Tab8 Cc2 | **Tab8 De2** | +3,40 → −2,23 | +3,52 → −2,23 |
| iqp-panov|transfert Dd1→d3 | préférence → **nuit au plan** | Ff4 g6 | **Ff4 Fa6** | +0,00 → −8,26 | +0,00 → −8,26 |
| carlsbad|rupture e→e4 | nuit au plan | h3 g6 | = | −0,17 → −0,38 | −0,17 → −0,38 |
| carlsbad|transfert Cf3→e5 | préparatoire | h3 g6 | = | +0,28 → +0,28 | +0,28 → +0,28 |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | nuit au plan | Ff4 c4 | = | — → — | −3,91 → −4,16 |
| espagnole-echange|rupture e→e5 | préférence | Fe3 b6 | = | −0,04 → −0,04 | −0,04 → −0,04 |
| espagnole-echange|transfert Cb1→d5 | nuit au plan | Ff4 c4 | = | −5,34 → −5,47 | −5,34 → −5,47 |
| espagnole-echange|échange Fc1×Ff8 | préférence | Fe3 b6 | = | −0,04 → −0,04 | −0,04 → −0,04 |
| fr-avance-blancs|rupture b→b4 | cible disparue | Fe2 cxd4 cxd4 Ch6 | = | — → — | — → — |
| fr-avance-blancs|transfert Fc1→e3 | nuit au plan | a3 c4 | **a3 Ch6** | −3,42 → −2,22 | −3,42 → −2,22 |
| fr-avance-noirs|transfert Cg8→f5 | préférence | cxd4 cxd4 | = | +0,05 → +0,05 | +0,05 → +0,05 |
| fr-avance-noirs|rupture f→f6 | nuit au plan | cxd4 cxd4 | = | −0,45 → −0,36 | −0,45 → −0,36 |
| fr-avance-noirs|colonne c | nuit au plan | Ch6 Fxh6 gxh6 Dd2 | = | −0,59 → −0,53 | −0,07 → −0,02 |
| fr-echange|colonne e | préférence | Fg5 Fg4 | = | +0,04 → +0,03 | +0,04 → +0,03 |
| fr-tarrasch-ouvert|transfert Cb3→d4 | préparatoire | Fd3 Cb4 | = | +0,16 → +0,17 | +0,16 → +0,17 |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | préférence | Fd3 Cb4 | = | +0,14 → +0,12 | +0,14 → +0,12 |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | bloqué | Fd3 Cb4 | = | — → — | — → — |
| fr-tarrasch-ouvert|transfert Fb5→d3 | nuit au plan | Fd2 Fg4 | = | −0,19 → −0,37 | −0,19 → −0,37 |
| herisson|colonne c | préférence | Tab8 Cc2 | **Tab8 De2** | — → — | +0,02 → +0,03 |
| iqp-panov|rupture d→d5 | préparatoire | Dd3 g6 | = | +0,58 → +0,17 | +0,58 → +0,17 |
| iqp-panov|transfert Cf3→e5 | préparatoire | Dd3 g6 | = | +1,33 → +1,02 | +1,33 → +1,02 |
| kid-mar-del-plata|rupture c→c5 | préférence | g4 h5 | = | +0,04 → −0,13 | +0,04 → −0,13 |
| kid-mar-del-plata|transfert Ce1→d3 | nuit au plan | g4 h5 | = | −0,32 → −0,34 | −0,32 → −0,34 |
| kid-mar-del-plata|colonne c | nuit au plan | g4 h5 | = | −0,18 → −0,24 | −0,18 → −0,24 |
| kid-mar-del-plata|transfert Cc3→b5 | préférence | g4 h5 | = | −0,14 → −0,14 | −0,14 → −0,14 |
