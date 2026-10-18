# Stabilité : reports/plans/filtre.json contre reports/plans/stabilite/bin-stockfish-p24

35 plans communs ; 230 coups notés dans les deux passes.

**Variance des notes sur les mêmes coups** (|Δ| en centipions) : médiane 6, 75e centile 12, 90e centile 19, max 44. Plancher actuel : 15.

**Verdicts qui changent d'identité** : meilleur coup 10/35, meilleur coup progressant 1/35, signe de l'écart (au plancher) 6/35, distance à la racine 0/35. Corrélation de rang des écarts (Spearman) : 0.95.

| plan | meilleur coup A → B | meilleur progressant A → B | écart A → B | d0 |
|---|---|---|---|---|
| carlsbad|rupture b→b5 | h3 | a3 | +0,16 → +0,23 |  |
| carlsbad|rupture e→e4 | h3 | e4 | +3,70 → +3,73 |  |
| carlsbad|transfert Cf3→e5 | h3 | Ce5 | +0,28 → +0,33 |  |
| iqp-panov|rupture d→d5 | Dd3 | Fb3 | +0,78 → +0,94 |  |
| iqp-panov|transfert Cf3→e5 | Dd3 | Ce5 | +2,13 → +2,30 |  |
| iqp-panov|transfert Dd1→d3 | Dd3 | Dd3 | −0,20 → −0,26 |  |
| herisson|rupture b→b5 | Tab8 → **Tac8** | Dc5 | +0,12 → +0,12 |  |
| herisson|rupture d→d5 | Tab8 → **Tac8** | d5 | +3,65 → +3,99 |  |
| herisson|colonne c | Tab8 → **Tac8** | Tac8 | +0,03 → −0,04 |  |
| kid-mar-del-plata|rupture c→c5 | g4 → **a4** | b4 | +0,04 → +0,21 |  |
| kid-mar-del-plata|transfert Ce1→d3 | g4 → **a4** | Cd3 | +0,11 → +0,41 |  |
| kid-mar-del-plata|colonne c | g4 → **a4** | Tc1 | +0,02 → +0,12 |  |
| kid-mar-del-plata|transfert Cc3→b5 | g4 → **a4** | Cb5 | +0,32 → +0,46 |  |
| espagnole-echange|poussée f→f4 ET rupture e→e5 | Ff4 | f4 → **Te1** | +0,78 → +0,94 |  |
| espagnole-echange|rupture e→e5 | Ff4 | Ff4 | −0,06 → −0,13 |  |
| espagnole-echange|transfert Cb1→d5 | Ff4 | Cc3 | +0,11 → +0,23 |  |
| espagnole-echange|échange Fc1×Ff8 | Ff4 | Ff4 | −0,06 → −0,13 |  |
| fr-avance-noirs|transfert Cg8→f5 | cxd4 | Ch6 | +0,05 → +0,10 |  |
| fr-avance-noirs|échange Fc8×Fe2 | cxd4 | Fd7 | +0,24 → +0,22 |  |
| fr-avance-noirs|rupture f→f6 | cxd4 | f6 | +0,53 → +0,46 |  |
| fr-avance-noirs|colonne c | cxd4 | cxd4 | −0,05 → −0,10 |  |
| fr-avance-blancs|rupture b→b4 | a3 | a3 | −0,08 → −0,18 |  |
| fr-avance-blancs|transfert Ff1→e2 | a3 | Fe2 | +0,08 → +0,24 |  |
| fr-avance-blancs|transfert Fc1→e3 | a3 | Fe3 | +1,58 → +1,41 |  |
| fr-avance-blancs|transfert Cb1→b3 | a3 | Cbd2 | +0,71 → +0,69 |  |
| fr-tarrasch-ferme|colonne c | O-O | Fd7 | +0,36 → +0,25 |  |
| fr-tarrasch-ferme|transfert Cf6→e4 | O-O | Ce4 | +0,77 → +0,73 |  |
| fr-tarrasch-ferme|rupture e→e5 | O-O | e5 | +0,40 → +0,47 |  |
| fr-tarrasch-ouvert|transfert Cb3→d4 | Fd3 | Cbd4 | +0,17 → +0,17 |  |
| fr-tarrasch-ouvert|échange Fc1×Ce7 | Fd3 | Fg5 | +0,14 → +0,20 |  |
| fr-tarrasch-ouvert|échange Fb5×Cc6 | Fd3 | Fxc6 | +0,28 → +0,26 |  |
| fr-tarrasch-ouvert|transfert Fb5→d3 | Fd3 | Fd3 | −0,02 → −0,04 |  |
| fr-echange|rupture c→c4 | Fg5 → **h3** | c4 | +0,35 → +0,24 |  |
| fr-echange|colonne e | Fg5 → **h3** | Te1 | +0,08 → +0,10 |  |
| fr-echange|transfert Fc1→g5 | Fg5 → **h3** | Fg5 | −0,08 → +0,05 |  |
