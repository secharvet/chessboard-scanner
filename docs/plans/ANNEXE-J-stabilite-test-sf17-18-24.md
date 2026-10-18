# Stabilité du test à deux demi-coups : reports/plans/stabilite/sf17-p18-preparatoire.json contre reports/plans/stabilite/bin-stockfish-17.1-p24

35 lignes communes.

**Statut qui change** : 4/35. **Suite jouée (M, réponse, point calme) qui change** : 5/35.
**|Δ(Δ même pas)|** : médiane 8, 90e centile 37, max 606 (31 lignes). **|Δ(Δ meilleur pas)|** : médiane 7, 90e centile 37, max 606.

| ligne | statut A → B | suite A | suite B | Δ même pas A → B | Δ meilleur pas A → B |
|---|---|---|---|---|---|
| fr-echange|rupture c→c4 | nuit au plan → **préférence** | Fg5 Fg4 | = | −0,20 → −0,12 | −0,20 → −0,12 |
| fr-echange|transfert Fc1→g5 | nuit au plan → **préférence** | Te1 h6 | **Te1 Fg4** | −4,48 → +0,00 | −4,48 → +0,00 |
| iqp-panov|transfert Dd1→d3 | préférence → **nuit au plan** | Ff4 Te8 | **Ff4 Fa6** | −0,07 → −6,13 | −0,07 → −6,13 |
| kid-mar-del-plata|rupture c→c5 | nuit au plan → **préférence** | g4 h5 | = | −0,51 → −0,14 | −0,51 → −0,14 |
| carlsbad|rupture b→b5 | préférence | h3 g6 | **h3 Ch5 Fxe7 Dxe7** | −0,09 → +0,09 | −0,09 → +0,14 |
| carlsbad|rupture e→e4 | préparatoire | h3 g6 | **h3 Ch5 Fxe7 Dxe7** | +0,79 → +3,17 | +0,79 → +3,17 |
| carlsbad|transfert Cf3→e5 | préparatoire | h3 g6 | **h3 Ch5 Fxe7 Dxe7** | +0,28 → +0,25 | +0,28 → +0,25 |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | nuit au plan | Ff4 c4 | = | — → — | −2,81 → −2,71 |
| espagnole-echange|rupture e→e5 | préférence | Fe3 b6 | = | −0,09 → −0,08 | −0,09 → −0,08 |
| espagnole-echange|transfert Cb1→d5 | nuit au plan | Ff4 c4 | = | −3,79 → −3,91 | −3,79 → −3,91 |
| espagnole-echange|échange Fc1×Ff8 | préférence | Fe3 b6 | = | −0,09 → −0,08 | −0,09 → −0,08 |
| fr-avance-blancs|rupture b→b4 | cible disparue | Fe2 cxd4 cxd4 Cge7 | = | — → — | — → — |
| fr-avance-blancs|transfert Ff1→e2 | préférence | a3 c4 | = | +0,04 → −0,01 | +0,04 → −0,01 |
| fr-avance-blancs|transfert Fc1→e3 | nuit au plan | a3 c4 | = | −1,32 → −1,57 | −1,32 → −1,57 |
| fr-avance-blancs|transfert Cb1→b3 | préparatoire | a3 c4 | = | +0,71 → +0,71 | +0,71 → +0,71 |
| fr-avance-noirs|transfert Cg8→f5 | préférence | cxd4 cxd4 | = | +0,04 → +0,03 | +0,05 → +0,05 |
| fr-avance-noirs|échange Fc8×Fe2 | préférence | cxd4 cxd4 | = | −0,05 → −0,05 | −0,05 → −0,05 |
| fr-avance-noirs|rupture f→f6 | nuit au plan | cxd4 cxd4 | = | −0,17 → −0,25 | −0,17 → −0,25 |
| fr-avance-noirs|colonne c | nuit au plan | Ch6 Fxh6 gxh6 Dd2 | = | −0,33 → −0,66 | −0,10 → −0,09 |
| fr-echange|colonne e | préférence | Fg5 Fg4 | = | +0,04 → −0,02 | +0,04 → −0,02 |
| fr-tarrasch-ferme|colonne c | préférence | O-O Ff4 Fxf4 Cxf4 | = | +0,02 → −0,05 | +0,02 → −0,05 |
| fr-tarrasch-ferme|transfert Cf6→e4 | préparatoire | O-O Ff4 Fxf4 Cxf4 | = | +0,77 → +0,77 | +0,77 → +0,77 |
| fr-tarrasch-ferme|rupture e→e5 | nuit au plan | O-O Ff4 Fxf4 Cxf4 | = | −1,16 → −1,39 | +0,30 → +0,37 |
| fr-tarrasch-ouvert|transfert Cb3→d4 | préférence | Fd3 h6 | = | −0,11 → −0,12 | −0,11 → −0,12 |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | nuit au plan | Fd3 h6 | = | −4,04 → −4,04 | −2,82 → −2,82 |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | nuit au plan | Fd3 h6 | = | — → — | −0,19 → −0,16 |
| fr-tarrasch-ouvert|transfert Fb5→d3 | nuit au plan | Fd2 Fg4 | = | −0,20 → −0,21 | −0,20 → −0,21 |
| herisson|rupture b→b5 | préférence | Tab8 De2 | = | −0,07 → −0,15 | +0,05 → +0,02 |
| herisson|rupture d→d5 | préparatoire | Tab8 De2 | = | +0,78 → +0,42 | +0,78 → +0,42 |
| herisson|colonne c | préférence | Tab8 De2 | = | — → — | +0,03 → +0,03 |
| iqp-panov|rupture d→d5 | préparatoire | Dd3 g6 | = | +0,47 → +0,53 | +0,47 → +0,53 |
| iqp-panov|transfert Cf3→e5 | préparatoire | Dd3 g6 | = | +1,12 → +1,24 | +1,12 → +1,24 |
| kid-mar-del-plata|transfert Ce1→d3 | nuit au plan | g4 h5 | = | −0,71 → −0,56 | −0,71 → −0,56 |
| kid-mar-del-plata|colonne c | nuit au plan | g4 h5 | = | −0,58 → −0,33 | −0,58 → −0,33 |
| kid-mar-del-plata|transfert Cc3→b5 | nuit au plan | g4 h5 | = | −0,31 → −0,19 | −0,31 → −0,19 |
