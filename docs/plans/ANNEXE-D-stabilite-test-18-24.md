# Stabilité du test à deux demi-coups : reports/plans/preparatoire.json contre reports/plans/stabilite/bin-stockfish-p24

35 lignes communes.

**Statut qui change** : 9/35. **Suite jouée (M, réponse, point calme) qui change** : 13/35.
**|Δ(Δ même pas)|** : médiane 12, 90e centile 285, max 860 (31 lignes). **|Δ(Δ meilleur pas)|** : médiane 11, 90e centile 302, max 860.

| ligne | statut A → B | suite A | suite B | Δ même pas A → B | Δ meilleur pas A → B |
|---|---|---|---|---|---|
| carlsbad|rupture b→b5 | préférence → **préparatoire** | h3 g6 | **h3 a5** | −0,10 → +0,16 | −0,01 → +0,16 |
| iqp-panov|transfert Dd1→d3 | préférence → **nuit au plan** | Ff4 Tc8 | **Ff4 Fa6** | +0,00 → −8,60 | +0,00 → −8,60 |
| herisson|rupture b→b5 | préférence → **nuit au plan** | Tab8 Cde2 | **Tab8 De2** | +0,03 → −0,17 | +0,11 → −0,12 |
| herisson|rupture d→d5 | préparatoire → **nuit au plan** | Tab8 Cde2 | **Tab8 De2** | +0,87 → −1,98 | +3,56 → −1,98 |
| fr-avance-blancs|transfert Ff1→e2 | nuit au plan → **préférence** | a3 a5 | **a3 c4** | −0,27 → +0,08 | −0,27 → +0,08 |
| fr-avance-blancs|transfert Cb1→b3 | préférence → **préparatoire** | a3 a5 | **a3 c4** | −0,14 → +0,66 | −0,14 → +0,66 |
| fr-tarrasch-ferme|colonne c | préférence → **préparatoire** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | −0,10 → +0,27 | −0,10 → +0,27 |
| fr-tarrasch-ferme|transfert Cf6→e4 | préparatoire → **nuit au plan** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | +0,77 → −7,60 | +0,77 → −7,60 |
| fr-tarrasch-ferme|rupture e→e5 | nuit au plan → **préparatoire** | O-O Ff4 Fxf4 Cxf4 | **O-O Fg5** | −1,99 → +0,40 | +0,33 → +0,40 |
| carlsbad|rupture e→e4 | nuit au plan | h3 g6 | **h3 a5** | −0,19 → −1,06 | −0,19 → −1,06 |
| carlsbad|transfert Cf3→e5 | préparatoire | h3 g6 | **h3 a5** | +0,28 → +0,25 | +0,28 → +0,25 |
| iqp-panov|rupture d→d5 | préparatoire | Dd3 g6 | = | +0,47 → +0,46 | +0,47 → +0,46 |
| iqp-panov|transfert Cf3→e5 | préparatoire | Dd3 g6 | = | +1,29 → +1,40 | +1,29 → +1,40 |
| herisson|colonne c | préférence | Tab8 Cde2 | **Tab8 De2** | — → — | +0,03 → +0,03 |
| kid-mar-del-plata|rupture c→c5 | préférence | g4 h5 | = | −0,05 → +0,00 | −0,05 → +0,00 |
| kid-mar-del-plata|transfert Ce1→d3 | nuit au plan | g4 h5 | = | −0,31 → −0,28 | −0,31 → −0,28 |
| kid-mar-del-plata|colonne c | préférence | g4 h5 | = | +0,00 → −0,12 | +0,00 → −0,12 |
| kid-mar-del-plata|transfert Cc3→b5 | préférence | g4 h5 | = | +0,14 → −0,05 | +0,14 → −0,05 |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | nuit au plan | Ff4 c4 | = | — → — | −4,15 → −4,27 |
| espagnole-echange|rupture e→e5 | préférence | Fe3 b6 | = | −0,03 → −0,11 | −0,03 → −0,11 |
| espagnole-echange|transfert Cb1→d5 | nuit au plan | Ff4 c4 | = | −5,24 → −5,44 | −5,24 → −5,44 |
| espagnole-echange|échange Fc1×Ff8 | préférence | Fe3 b6 | = | −0,03 → −0,11 | −0,03 → −0,11 |
| fr-avance-noirs|transfert Cg8→f5 | préférence | cxd4 cxd4 | = | +0,05 → +0,05 | +0,05 → +0,05 |
| fr-avance-noirs|échange Fc8×Fe2 | nuit au plan | cxd4 cxd4 | = | −0,32 → −0,30 | −0,32 → −0,30 |
| fr-avance-noirs|rupture f→f6 | nuit au plan | cxd4 cxd4 | = | −0,46 → −0,61 | −0,46 → −0,61 |
| fr-avance-noirs|colonne c | nuit au plan | Ch6 Fxh6 gxh6 Dd2 | = | −0,47 → −0,43 | +0,00 → −0,02 |
| fr-avance-blancs|rupture b→b4 | cible disparue | Fe2 cxd4 cxd4 Ch6 | = | — → — | — → — |
| fr-avance-blancs|transfert Fc1→e3 | nuit au plan | a3 a5 | **a3 c4** | −0,66 → −3,68 | −0,66 → −3,68 |
| fr-tarrasch-ouvert|transfert Cb3→d4 | préférence | Fd3 h6 | = | −0,11 → −0,09 | −0,11 → −0,09 |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | nuit au plan | Fd3 h6 | = | −6,43 → −6,46 | −3,54 → −3,57 |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | préférence | Fd3 h6 | = | — → — | −0,05 → −0,15 |
| fr-tarrasch-ouvert|transfert Fb5→d3 | nuit au plan | Fd2 Fg4 | = | −0,26 → −0,36 | −0,26 → −0,36 |
| fr-echange|rupture c→c4 | préférence | Fg5 Fg4 | = | −0,13 → +0,00 | −0,13 → +0,00 |
| fr-echange|colonne e | préférence | Fg5 Fg4 | = | −0,01 → +0,04 | −0,01 → +0,04 |
| fr-echange|transfert Fc1→g5 | préférence | Te1 Fg4 | = | +0,00 → −0,06 | +0,00 → −0,06 |
