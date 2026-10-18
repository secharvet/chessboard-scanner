# Stabilité : reports/plans/stabilite/det-bin-stockfish-p18-filtre.json contre reports/plans/stabilite/bin-stockfish-p24

35 plans communs ; 232 coups notés dans les deux passes.

**Variance des notes sur les mêmes coups** (|Δ| en centipions) : médiane 8, 75e centile 13, 90e centile 25, max 46. Plancher actuel : 15.

**Verdicts qui changent d'identité** : meilleur coup 8/35, meilleur coup progressant 3/35, signe de l'écart (au plancher) 6/35, distance à la racine 0/35. Corrélation de rang des écarts (Spearman) : 0.95.

| plan | meilleur coup A → B | meilleur progressant A → B | écart A → B | d0 |
|---|---|---|---|---|
| carlsbad|rupture b→b5 | h3 | a3 → **Tab1** | +0,23 → +0,21 |  |
| carlsbad|rupture e→e4 | h3 | e4 | +3,97 → +3,69 |  |
| carlsbad|transfert Cf3→e5 | h3 | Ce5 | +0,32 → +0,31 |  |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | Ff4 | f4 → **Te1** | +0,73 → +0,91 |  |
| espagnole-echange|rupture e→e5 | Ff4 | Ff4 | −0,08 → −0,05 |  |
| espagnole-echange|transfert Cb1→d5 | Ff4 | Cc3 | +0,16 → +0,25 |  |
| espagnole-echange|échange Fc1×Ff8 | Ff4 | Ff4 | −0,08 → −0,05 |  |
| fr-avance-blancs|rupture b→b4 | a3 | a3 | −0,18 → −0,05 |  |
| fr-avance-blancs|transfert Ff1→e2 | a3 | Fe2 | +0,18 → +0,05 |  |
| fr-avance-blancs|transfert Fc1→e3 | a3 | Fe3 | +1,77 → +1,24 |  |
| fr-avance-blancs|transfert Cb1→b3 | a3 | Cbd2 | +1,00 → +0,75 |  |
| fr-avance-noirs|transfert Cg8→f5 | cxd4 | Ch6 | +0,16 → +0,15 |  |
| fr-avance-noirs|échange Fc8×Fe2 | cxd4 | Fd7 | +0,35 → +0,38 |  |
| fr-avance-noirs|rupture f→f6 | cxd4 | f6 | +0,36 → +0,47 |  |
| fr-avance-noirs|colonne c | cxd4 | cxd4 | −0,16 → −0,15 |  |
| fr-echange|rupture c→c4 | Fg5 | c4 | +0,26 → +0,33 |  |
| fr-echange|colonne e | Fg5 | Te1 | +0,06 → +0,05 |  |
| fr-echange|transfert Fc1→g5 | Fg5 | Fg5 | −0,04 → −0,04 |  |
| fr-tarrasch-ferme|colonne c | O-O | Fd7 | +0,32 → +0,30 |  |
| fr-tarrasch-ferme|transfert Cf6→e4 | O-O | Ce4 | +0,62 → +0,78 |  |
| fr-tarrasch-ferme|rupture e→e5 | O-O | e5 | +0,47 → +0,29 |  |
| fr-tarrasch-ouvert|transfert Cb3→d4 | Cfd4 → **h3** | Cbd4 | +0,13 → +0,18 |  |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | Cfd4 → **h3** | Fg5 | +0,11 → +0,13 |  |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | Cfd4 → **h3** | Fxc6 | +0,20 → +0,31 |  |
| fr-tarrasch-ouvert|transfert Fb5→d3 | Cfd4 → **h3** | Fd3 | +0,08 → +0,03 |  |
| herisson|rupture b→b5 | Tac8 | Dc5 | +0,11 → +0,12 |  |
| herisson|rupture d→d5 | Tac8 | d5 | +3,51 → +3,72 |  |
| herisson|colonne c | Tac8 | Tac8 | −0,02 → −0,03 |  |
| iqp-panov|rupture d→d5 | Dd3 | Fb3 | +1,01 → +0,84 |  |
| iqp-panov|transfert Cf3→e5 | Dd3 | Ce5 | +2,17 → +2,09 |  |
| iqp-panov|transfert Dd1→d3 | Dd3 | Dd3 | −0,26 → −0,17 |  |
| kid-mar-del-plata|rupture c→c5 | Cd3 → **b4** | Cd3 → **b4** | −0,07 → −0,12 |  |
| kid-mar-del-plata|transfert Ce1→d3 | Cd3 → **b4** | Cd3 | −0,02 → +0,29 |  |
| kid-mar-del-plata|colonne c | Cd3 → **b4** | Tc1 | +0,07 → +0,12 |  |
| kid-mar-del-plata|transfert Cc3→b5 | Cd3 → **b4** | Cb5 | +0,40 → +0,42 |  |
