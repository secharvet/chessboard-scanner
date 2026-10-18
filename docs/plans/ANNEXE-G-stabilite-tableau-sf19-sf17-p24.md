# Stabilité : reports/plans/stabilite/sf19-p24-filtre.json contre reports/plans/stabilite/bin-stockfish-17.1-p24

35 plans communs ; 229 coups notés dans les deux passes.

**Variance des notes sur les mêmes coups** (|Δ| en centipions) : médiane 9, 75e centile 17, 90e centile 36, max 365. Plancher actuel : 15.

**Verdicts qui changent d'identité** : meilleur coup 22/35, meilleur coup progressant 1/35, signe de l'écart (au plancher) 8/35, distance à la racine 0/35. Corrélation de rang des écarts (Spearman) : 0.93.

| plan | meilleur coup A → B | meilleur progressant A → B | écart A → B | d0 |
|---|---|---|---|---|
| carlsbad|rupture b→b5 | h3 | a3 → **Tab1** | +0,23 → +0,19 |  |
| carlsbad|rupture e→e4 | h3 | e4 | +3,73 → +2,97 |  |
| carlsbad|transfert Cf3→e5 | h3 | Ce5 | +0,33 → +0,22 |  |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | Ff4 | Te1 | +0,94 → +0,93 |  |
| espagnole-echange|rupture e→e5 | Ff4 | Ff4 | −0,13 → −0,18 |  |
| espagnole-echange|transfert Cb1→d5 | Ff4 | Cc3 | +0,23 → +0,21 |  |
| espagnole-echange|échange Fc1×Ff8 | Ff4 | Ff4 | −0,13 → −0,18 |  |
| fr-avance-blancs|rupture b→b4 | a3 → **Fd3** | a3 | −0,18 → +0,03 |  |
| fr-avance-blancs|transfert Ff1→e2 | a3 → **Fd3** | Fe2 | +0,24 → +0,04 |  |
| fr-avance-blancs|transfert Fc1→e3 | a3 → **Fd3** | Fe3 | +1,41 → +1,33 |  |
| fr-avance-blancs|transfert Cb1→b3 | a3 → **Fd3** | Cbd2 | +0,69 → +0,81 |  |
| fr-avance-noirs|transfert Cg8→f5 | cxd4 → **Ch6** | Ch6 | +0,10 → −0,03 |  |
| fr-avance-noirs|échange Fc8×Fe2 | cxd4 → **Ch6** | Fd7 | +0,22 → +0,21 |  |
| fr-avance-noirs|rupture f→f6 | cxd4 → **Ch6** | f6 | +0,46 → +0,39 |  |
| fr-avance-noirs|colonne c | cxd4 → **Ch6** | cxd4 | −0,10 → +0,03 |  |
| fr-echange|rupture c→c4 | h3 → **Fg5** | c4 | +0,24 → +0,29 |  |
| fr-echange|colonne e | h3 → **Fg5** | Te1 | +0,10 → +0,08 |  |
| fr-echange|transfert Fc1→g5 | h3 → **Fg5** | Fg5 | +0,05 → −0,03 |  |
| fr-tarrasch-ferme|colonne c | O-O | Fd7 | +0,25 → +0,26 |  |
| fr-tarrasch-ferme|transfert Cf6→e4 | O-O | Ce4 | +0,73 → +0,64 |  |
| fr-tarrasch-ferme|rupture e→e5 | O-O | e5 | +0,47 → +0,37 |  |
| fr-tarrasch-ouvert|transfert Cb3→d4 | Fd3 → **c3** | Cbd4 | +0,17 → +0,18 |  |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | Fd3 → **c3** | Fg5 | +0,20 → +0,04 |  |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | Fd3 → **c3** | Fxc6 | +0,26 → +0,41 |  |
| fr-tarrasch-ouvert|transfert Fb5→d3 | Fd3 → **c3** | Fd3 | −0,04 → +0,05 |  |
| herisson|rupture b→b5 | Tac8 → **Tad8** | Dc5 | +0,12 → +0,14 |  |
| herisson|rupture d→d5 | Tac8 → **Tad8** | d5 | +3,99 → +2,52 |  |
| herisson|colonne c | Tac8 → **Tad8** | Tac8 | −0,04 → +0,03 |  |
| iqp-panov|rupture d→d5 | Dd3 | Fb3 | +0,94 → +0,93 |  |
| iqp-panov|transfert Cf3→e5 | Dd3 | Ce5 | +2,30 → +2,03 |  |
| iqp-panov|transfert Dd1→d3 | Dd3 | Dd3 | −0,26 → −0,13 |  |
| kid-mar-del-plata|rupture c→c5 | a4 → **b4** | b4 | +0,21 → −0,04 |  |
| kid-mar-del-plata|transfert Ce1→d3 | a4 → **b4** | Cd3 | +0,41 → +0,15 |  |
| kid-mar-del-plata|colonne c | a4 → **b4** | Tc1 | +0,12 → +0,04 |  |
| kid-mar-del-plata|transfert Cc3→b5 | a4 → **b4** | Cb5 | +0,46 → +0,25 |  |
