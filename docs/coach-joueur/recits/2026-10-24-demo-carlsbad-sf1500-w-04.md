# Partie du coach joueur : 2026-10-24-sf1500-w-04

**Le coach a les Blancs** contre stockfish-1500 (graine undefined). Budget de recherche 400 000 positions par coup, un fil, code `3997c2e`. **Résultat : 0-1** (mat, 80 demi-coups).

**Démonstration depuis une position du panel, hors critère.** La partie ne commence pas au premier coup mais à la position `r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 9 11` : elle sert à montrer le coach quand il reconnaît une structure et adopte un plan, elle ne compte pour aucune des cinq conditions.

Tous les coups du coach sont les siens : aucun moteur n'est consulté pendant la partie. Stockfish n'intervient qu'après, comme examinateur.

**Examen après coup** (Stockfish 19, profondeur 18) : 40 coups du coach, **2 bévue(s)** (plus d'un pion perdu), 3 faute(s) (entre un demi-pion et un pion), 8 exclu(s) (coups uniques ou position déjà jouée), taux de bévues 5.0 %.
Par phase : ouverture 3 coups, 0 bévue(s) ; milieu 37 coups, 2 bévue(s) ; finale 0 coups, 0 bévue(s).

**Sortes de phrases** (40 coups du coach) : amélioration 13, calcul 21, défense 3, plan 3.
Détail : calcul/moindre_mal 8, calcul/seul_coup 7, amelioration/prefere 4, calcul/mat_subi 4, amelioration/echange 2, amelioration/placement 2, calcul/gain 2, plan/pas 2, defense/roi_attaquant 2, amelioration/contraint 2, amelioration/mobilite 2, amelioration/coup_d_attente 1, defense/piece_en_prise 1, plan/dernier_pas 1. Part des « je suis mieux sans raison unique à nommer » : 4 sur 40 (10 %).
Alertes de parole (menace non parée sous une phrase de plan ou d'amélioration) : 2.

**Plans** : 3 coup(s) expliqué(s) par un plan de la grammaire.
**Budget de recherche** : 400 000 positions pour la recherche principale de chaque coup ; la re-recherche des meilleurs candidats (pour un score exact) et la recherche de la menace adverse s'y ajoutent, d'où des totaux par coup au-dessus du budget.

---

## La partie, coup par coup

Pour chaque coup du coach : la phrase qu'il prononce, puis entre crochets la sorte, et en retrait le « pourquoi » tel que le lecteur du site le montre.

**1.Ce5** — Je joue Ce5 : au bout de 11.Ce5 Fe6 12.Db3 h6 13.Fxf6 gxf6, je suis mieux qu'avec Tae1, sans raison unique à nommer. Tae1 était nettement moins bon. `[amélioration / prefere]`
  - ligne calculée : 1.Ce5 Fe6 2.Db3 h6 3.Fxf6 gxf6
  - coup battu : Tae1, 43 centièmes de moins
  - termes cités : danger du roi +54
  - recherche : profondeur 4, 400 001 positions, 6135 ms ; score 105 (avant : 105)
  - examinateur : ok (−21 centièmes), phase ouverture

**1…Cg4** (stockfish-1500)

**2.Fxe7** — Je prends un plan : rupture b→b5. (l'attaque de minorité : échanger en c6 et léguer un pion c faible.) J'échange mon fou contre son fou : après 12.Fxe7 Dxe7 13.Cxg4 Fxg4 14.h3, personne n'a gagné de matériel. Ff4 était nettement moins bon. (Je vois 12…Fxg5 13.Cf3 h6 14.h3 ; après Fxe7, ce n'est plus possible.) `[amélioration / echange]`
  - ligne calculée : 2.Fxe7 Dxe7 3.Cxg4 Fxg4 4.h3
  - coup battu : Ff4, 79 centièmes de moins
  - menace vue : 2…Fxg5 3.Cf3 h6 4.h3 (une pièce), parée après Fxe7
  - termes cités : placement (fou e7) -12
  - plan : rupture b→b5, distance 3 → 2, cumul 0
  - recherche : profondeur 5, 342 236 positions, 4372 ms ; score 118 (avant : 132)
  - examinateur : ok (+1 centièmes), phase ouverture

**2…Dxe7** (stockfish-1500)

**3.Cxg4** — J'échange mon cavalier contre son cavalier : après 13.Cxg4 Fxg4 14.Ca4 Dd7 15.Cc5, personne n'a gagné de matériel. Cf3 était un peu moins bon. (Je vois 13…Cxe5 14.dxe5 Dxe5 15.Tad1 ; après Cxg4, ce n'est plus possible.) En a1, ma tour a plus de cases. `[amélioration / echange]`
  - ligne calculée : 3.Cxg4 Fxg4 4.Ca4 Dd7 5.Cc5
  - coup battu : Cf3, 16 centièmes de moins
  - menace vue : 3…Cxe5 4.dxe5 Dxe5 5.Tad1 (un pion), parée après Cxg4
  - termes cités : menace par une mineure -51, mobilité (cavalier g4) -29, placement (cavalier g4) -16
  - plan : rupture b→b5, distance 3 → 3, cumul 0
  - recherche : profondeur 5, 391 057 positions, 4808 ms ; score 58 (avant : 132)
  - examinateur : ok (−14 centièmes), phase ouverture

**3…Fxg4** (stockfish-1500)

**4.Ca4** — Rien de mieux qu'un coup d'attente : Ca4 ne change rien et ne gâte rien. Ca4 et Tfe1 se valent ; j'ai pris Ca4. `[amélioration / coup_d_attente]`
  - ligne calculée : 4.Ca4 Dg5 5.Tfe1 Cg6 6.Cc5
  - coup battu : Tfe1 (se valent)
  - plan : rupture b→b5, distance 3 → 3, cumul 0
  - recherche : profondeur 5, 752 344 positions, 7574 ms ; score 55 (avant : 39)
  - examinateur : ok (−8 centièmes), phase milieu

**4…Tad8** (stockfish-1500)

**5.h3** — Rien de forcé. Mon pion va en h3, une meilleure case. Cc5 était un peu moins bon. `[amélioration / placement]`
  - ligne calculée : 5.h3 Fh5 6.Cc5 Fg6 7.Tac1 Fxd3 8.Dxd3
  - coup battu : Cc5, 10 centièmes de moins
  - plan : rupture b→b5, distance 3 → 3, cumul 0
  - recherche : profondeur 5, 516 826 positions, 5246 ms ; score 69 (avant : 7)
  - examinateur : ok (+7 centièmes), phase milieu

**5…Fh5** (stockfish-1500)

**6.Cc5** — Rien de forcé. Mon cavalier va en c5, une meilleure case. Cc5 et Tab1 se valent ; j'ai pris Cc5. `[amélioration / placement]`
  - ligne calculée : 6.Cc5 Fg6 7.Tad1 b6 8.Ca6 Fxd3 9.Txd3
  - coup battu : Tab1 (se valent)
  - termes cités : placement (cavalier c5) +34
  - plan : rupture b→b5, distance 3 → 2, cumul 0
  - recherche : profondeur 5, 522 264 positions, 5294 ms ; score 42 (avant : 42)
  - examinateur : ok (+2 centièmes), phase milieu

**6…Td6** (stockfish-1500)

**7.Ff5** — Je joue Ff5 : au bout de 17.Ff5 Fg6 18.Fxg6 Txg6 19.Da4, je suis mieux qu'avec Tac1, sans raison unique à nommer. Ff5 et Tac1 se valent ; j'ai pris Ff5. `[amélioration / prefere]`
  - ligne calculée : 7.Ff5 Fg6 8.Fxg6 Txg6 9.Da4
  - coup battu : Tac1 (se valent)
  - plan : rupture b→b5, distance 2 → 3, cumul 0
  - recherche : profondeur 5, 464 772 positions, 4791 ms ; score 29 (avant : 99)
  - examinateur : ok (−37 centièmes), phase milieu

**7…Cg6** (stockfish-1500)

**8.g4** — Je joue g4 : après 18.g4 b6 19.gxh5 Ch4 20.Fg4 bxc5 21.dxc5, je gagne un pion. Tfe1 était beaucoup moins bon. `[calcul / gain]`
  - ligne calculée : 8.g4 b6 9.gxh5 Ch4 10.Fg4 bxc5 11.dxc5
  - coup battu : Tfe1, 108 centièmes de moins
  - termes cités : attaquée par un pion sûr (fou h5) +75, mobilité (cavalier c5) +15, abri du roi (g1) -37
  - plan : rupture b→b5, distance 3 → 3, cumul 0
  - recherche : profondeur 5, 434 979 positions, 4444 ms ; score 123 (avant : 77)
  - examinateur : ok (−36 centièmes), phase milieu

**8…Ch4** (stockfish-1500)

**9.gxh5** — Je joue gxh5 : après 19.gxh5 b6 20.Ca6 Tf6 21.Fg4, je gagne une pièce. Fxh7+ était perdant. `[calcul / gain]`
  - ligne calculée : 9.gxh5 b6 10.Ca6 Tf6 11.Fg4
  - coup battu : Fxh7+, 222 centièmes de moins
  - termes cités : matériel (pion h5) +398, abri du roi (g1) +27, échanger quand on mène (avantage matériel) +17
  - plan : rupture b→b5, distance 3 → 3, cumul 0
  - recherche : profondeur 5, 480 863 positions, 4972 ms ; score 222 (avant : 17)
  - examinateur : ok (−8 centièmes), phase milieu

**9…b6** (stockfish-1500)

**10.Cb3** — Je sauve mon cavalier, en prise en c5. Cb3 et Ca6 se valent ; j'ai pris Cb3. `[défense / piece_en_prise]`
  - ligne calculée : 10.Cb3 Df6 11.Fg4 Cf3+ 12.Rh1 Ch4
  - coup battu : Ca6 (se valent)
  - termes cités : attaquée par un pion sûr +72, placement (cavalier b3) -26, mobilité (cavalier b3) -13
  - plan : rupture b→b5, distance 3 → 5, cumul 0
  - recherche : profondeur 5, 452 111 positions, 4569 ms ; score 251 (avant : -48)
  - examinateur : ok (+15 centièmes), phase milieu

**10…g6** (stockfish-1500)

**11.hxg6** — Seul bon coup : hxg6. Sur Fg4, il y avait 21.Fg4 f5 22.Dd1 fxg4 23.Dxg4, et je perdais une pièce contre un pion. `[calcul / seul_coup]`
  - ligne calculée : 11.hxg6 Txg6+ 12.Rh1 Dg5 13.Fg4 Df6
  - coup battu : Fg4, 195 centièmes de moins
  - termes cités : attaquée par un pion sûr +72, pièce en l'air +58, pion lié (pion a2) +21
  - plan : rupture b→b5, distance 5 → 5, cumul 0
  - recherche : profondeur 5, 426 712 positions, 4195 ms ; score 260 (avant : -111)
  - examinateur : ok (+23 centièmes), phase milieu

**11…fxg6** (stockfish-1500)

**12.Fg4** — Seul bon coup : Fg4. Sur Cd2, il y avait 22.Cd2 Cxf5 23.Cf3 De4 24.De2, et je perdais une pièce. Sacrifice du fou (Fxh5, repris par gxh5). `[calcul / seul_coup]`
  - ligne calculée : 12.Fg4 h5 13.Fxh5 gxh5 14.Rh1
  - coup battu : Cd2, 235 centièmes de moins
  - termes cités : danger du roi (g1 : 1 attaquant(s), 1 case(s) faible(s)) +359, attaquée par un pion sûr +72, menace par une mineure +34
  - plan : rupture b→b5, distance 5 → 5, cumul 0
  - motif : sacrifice du fou (Fxh5, repris par gxh5)
  - recherche : profondeur 5, 497 103 positions, 4522 ms ; score 215 (avant : -67)
  - examinateur : ok (−2 centièmes), phase milieu

**12…h5** (stockfish-1500)

**13.De2** — Plan : rupture b→b5. De2 en est un pas ; il en reste 4. Fxh5 ne fait pas avancer ce plan. (Je vois 23…hxg4 24.Cd2 Dg5 25.Dd1 gxh3+, et je ne peux pas tout empêcher.) `[plan / pas]`
  - ligne calculée : 13.De2 hxg4 14.Dxg4 Tf8 15.Cd2
  - coup battu : Fxh5, 53 centièmes de moins
  - menace vue : 13…hxg4 14.Cd2 Dg5 15.Dd1 gxh3+ (une pièce et un pion), NON parée après De2
  - termes cités : mobilité (dame e2) -17
  - plan : rupture b→b5, distance 5 → 4, cumul 0
  - recherche : profondeur 5, 381 836 positions, 3738 ms ; score 76 (avant : 372)
  - examinateur : ok (−13 centièmes), phase milieu
  - ALERTE : menace non parée en sorte plan ou amélioration : sorte fausse ou coup fautif

**13…Tf6** (stockfish-1500)

**14.Cd2** — Plan : rupture b→b5. Cd2 en est un pas ; il en reste 3. Rh1 ne fait pas avancer ce plan. (Je vois 24…hxg4 25.Dxg4 Cf3+ 26.Rg2 Dc7, et je ne peux pas tout empêcher.) `[plan / pas]`
  - ligne calculée : 14.Cd2 hxg4 15.Dxg4 Cf5 16.Tac1
  - coup battu : Rh1, 93 centièmes de moins
  - menace vue : 14…hxg4 15.Dxg4 Cf3+ 16.Rg2 Dc7 (une pièce contre un pion), NON parée après Cd2
  - termes cités : danger du roi (g1 : 2 attaquant(s), 1 case(s) faible(s)) +12
  - plan : rupture b→b5, distance 5 → 3, cumul 0
  - recherche : profondeur 5, 477 993 positions, 4541 ms ; score 85 (avant : 312)
  - examinateur : ok (−26 centièmes), phase milieu
  - ALERTE : menace non parée en sorte plan ou amélioration : sorte fausse ou coup fautif

**14…hxg4** (stockfish-1500)

**15.Dxg4** — Mon roi d'abord : son pion ne vise plus mon roi. hxg4 était nettement moins bon. `[défense / roi_attaquant]`
  - ligne calculée : 15.Dxg4 Tf5 16.Rh1 Tef8 17.Rg1
  - coup battu : hxg4, 77 centièmes de moins
  - termes cités : danger du roi (g1 : 2 attaquant(s), 0 case(s) faible(s)) +56, matériel (dame g4) +73, abri du roi (g1) +18
  - plan : rupture b→b5, distance 3 → 4, cumul 0
  - recherche : profondeur 5, 432 692 positions, 3821 ms ; score 45 (avant : 103)
  - examinateur : ok (−20 centièmes), phase milieu

**15…Tf5** (stockfish-1500)

**16.Rh1** — Je joue Rh1 : au bout de 26.Rh1 Tef8 27.Dg3 c5 28.Rg1, je suis mieux qu'avec Rh2, sans raison unique à nommer. Rh2 était nettement moins bon. (Je vois 26…Tg5 27.Tac1 Txg4+ 28.hxg4 Df6 ; après Rh1, ce n'est plus possible.) `[amélioration / prefere]`
  - ligne calculée : 16.Rh1 Tef8 17.Dg3 c5 18.Rg1
  - coup battu : Rh2, 33 centièmes de moins
  - menace vue : 16…Tg5 17.Tac1 Txg4+ 18.hxg4 Df6 (la dame contre une tour), parée après Rh1
  - plan : rupture b→b5, distance 4 → 4, cumul 0
  - recherche : profondeur 5, 363 713 positions, 3378 ms ; score 46 (avant : 86)
  - examinateur : ok (+30 centièmes), phase milieu

**16…Rg7** (stockfish-1500)

**17.Tac1** — Je joue Tac1 : au bout de 27.Tac1 c5 28.dxc5 bxc5 29.Rg1, je suis mieux qu'avec a3, sans raison unique à nommer. a3 était nettement moins bon. `[amélioration / prefere]`
  - ligne calculée : 17.Tac1 c5 18.dxc5 bxc5 19.Rg1
  - coup battu : a3, 33 centièmes de moins
  - plan : rupture b→b5, distance 4 → 4, cumul 0
  - recherche : profondeur 5, 591 703 positions, 5075 ms ; score 72 (avant : 49)
  - examinateur : ok (+26 centièmes), phase milieu

**17…c5** (stockfish-1500)

**18.dxc5** — Mon roi d'abord : son pion ne vise plus mon roi. a3 était un peu moins bon. `[défense / roi_attaquant]`
  - ligne calculée : 18.dxc5 bxc5 19.e4 dxe4
  - coup battu : a3, 29 centièmes de moins
  - termes cités : danger du roi (h1 : 2 attaquant(s), 0 case(s) faible(s)) +74, pion lié (pion a2) +17, pion isolé (pion h3) +12
  - plan : rupture b→b5, distance 3 → 2, cumul 0
  - recherche : profondeur 5, 773 068 positions, 6457 ms ; score 87 (avant : 68)
  - examinateur : ok (+21 centièmes), phase milieu

**18…bxc5** (stockfish-1500)

**19.b4** — Le plan rupture b→b5 n'a plus d'objet : la structure n'est plus là. Je prends un plan : rupture b→b4. (le levier contre c4 : forcer une poussée, puis bloquer l'autre pion.) Plan : rupture b→b4. Avec b4, c'est fait. Dg3 ne fait pas avancer ce plan. `[plan / dernier_pas]`
  - ligne calculée : 19.b4 c4 20.e4 dxe4 21.Txc4
  - coup battu : Dg3, 25 centièmes de moins
  - plan : rupture b→b4, distance 1 → 0, cumul 0, abandon (sans_objet)
  - recherche : profondeur 4, 400 001 positions, 3504 ms ; score 71 (avant : 68)
  - examinateur : bevue (−255 centièmes), phase milieu

**19…Tg5** (stockfish-1500)

**20.Df4** — Je joue Df4 : aucun coup n'empêche 30…Txg4 31.hxg4 c4 32.a3, et celui-ci me laisse le mieux placé. Dxh4 était nettement moins bon. `[amélioration / contraint]`
  - ligne calculée : 20.Df4 Tf8 21.Dxh4 Tg1+ 22.Rxg1 Dxh4 23.Txc5 Dxh3 24.Txd5
  - coup battu : Dxh4, 54 centièmes de moins
  - menace vue : 20…Txg4 21.hxg4 c4 22.a3 (la dame contre une tour), NON parée après Df4
  - recherche : profondeur 5, 214 619 positions, 2025 ms ; score -123 (avant : -123)
  - examinateur : bevue (−344 centièmes), phase milieu

**20…Tf8** (stockfish-1500)

**21.Dxh4** — Je ne peux pas tout garder. Avec Dxh4, je perds la dame contre une tour et une pièce ; les autres coups coûtaient plus. (Je vois 31…Txf4 32.exf4 Tf5 33.Txc5 Txf4 34.Txd5 Dxb4, et je ne peux pas tout empêcher.) `[calcul / moindre_mal]`
  - ligne calculée : 21.Dxh4 Tg1+ 22.Rxg1 Dxh4 23.bxc5 Dxh3
  - coup battu : Dh2, 66 centièmes de moins
  - menace vue : 21…Txf4 22.exf4 Tf5 23.Txc5 Txf4 24.Txd5 Dxb4 (la dame contre une tour), NON parée après Dxh4
  - termes cités : pièce en l'air -28, mobilité (dame h4) -26
  - recherche : profondeur 5, 352 623 positions, 3161 ms ; score -200 (avant : 477)
  - examinateur : ok (+9 centièmes), phase milieu

**21…Tg1+** (stockfish-1500)

**22.Rxg1** — Je ne peux pas tout garder. Avec Rxg1, je perds la dame contre une tour ; les autres coups coûtaient plus. `[calcul / moindre_mal]`
  - ligne calculée : 22.Rxg1 Dxh4 23.Txc5 Dxh3 24.Tc7+ Rh6 25.b5 Dg4+ 26.Rh2
  - coup battu : Txg1, 209 centièmes de moins
  - termes cités : placement (roi g1) +15, menace par le roi -23
  - recherche : profondeur 7, 335 755 positions, 2166 ms ; score -181 (avant : 653)
  - examinateur : ok (+42 centièmes), phase milieu

**22…Dxh4** (stockfish-1500)

**23.Txc5** — Seul bon coup : Txc5. Sur Rg2, il y avait 33.Rg2 c4 34.a4 Dg5+ 35.Rh1 Dh5, et je perdais du terrain. `[calcul / seul_coup]`
  - ligne calculée : 23.Txc5 Dxh3 24.Tc7+ Rh6 25.b5 Dg4+ 26.Rh2
  - coup battu : Rg2, 156 centièmes de moins
  - menace vue : 23…Dxh3 24.Tfe1 Dg4+ 25.Rf1 cxb4 (deux pions), parée après Txc5
  - termes cités : pion lié (pion e3) +16, pion isolé (pion h3) +16, tour sur colonne ouverte (tour c5) +15
  - recherche : profondeur 5, 258 060 positions, 1920 ms ; score -181 (avant : -123)
  - examinateur : faute (−66 centièmes), phase milieu

**23…Dxh3** (stockfish-1500)

**24.Tc7+** — Rien de forcé. En c7, ma tour a plus de cases. Tfc1 était nettement moins bon. (Je vois 34…Dg4+ 35.Rh1 Th8# ; après Tc7+, ce n'est plus possible.) `[amélioration / mobilite]`
  - ligne calculée : 24.Tc7+ Rh6 25.Te1 a6 26.f4 Dg3+ 27.Rf1
  - coup battu : Tfc1, 62 centièmes de moins
  - menace vue : 24…Dg4+ 25.Rh1 Th8# (la partie (mat)), parée après Tc7+
  - termes cités : mobilité (tour c7) +10
  - recherche : profondeur 5, 235 138 positions, 1775 ms ; score -260 (avant : -260)
  - examinateur : ok (+18 centièmes), phase milieu

**24…Rh6** (stockfish-1500)

**25.Tfc1** — Rien de forcé. En c1, ma tour a plus de cases. Te1 était un peu moins bon. Ma tour prend la colonne c, ouverte : aucun pion ne la bloque. `[amélioration / mobilite]`
  - ligne calculée : 25.Tfc1 Tf5 26.f3 Tg5+ 27.Rf2 Dh2+ 28.Re1
  - coup battu : Te1, 18 centièmes de moins
  - termes cités : mobilité (tour c1) +29, tour sur colonne ouverte (tour c1) +15, danger du roi (g1 : 2 attaquant(s), 4 case(s) faible(s)) -44
  - recherche : profondeur 5, 220 962 positions, 1924 ms ; score -270 (avant : -270)
  - examinateur : faute (−65 centièmes), phase milieu

**25…d4** (stockfish-1500)

**26.T7c2** — Je joue T7c2 : aucun coup n'empêche 36…dxe3 37.Ce4 exf2+ 38.Cxf2 Dg3+ 39.Rf1 Txf2+, et celui-ci me laisse le mieux placé. Ce4 était nettement moins bon. `[amélioration / contraint]`
  - ligne calculée : 26.T7c2 dxe3 27.Cc4 Tf5 28.Cxe3
  - coup battu : Ce4, 43 centièmes de moins
  - menace vue : 26…dxe3 27.Ce4 exf2+ 28.Cxf2 Dg3+ 29.Rf1 Txf2+ (une pièce et un pion), NON parée après T7c2
  - termes cités : pièce en l'air (pion d4) -21, mobilité (tour c2) -32, placement (tour c2) -10
  - recherche : profondeur 5, 236 744 positions, 1829 ms ; score -406 (avant : -406)
  - examinateur : faute (−51 centièmes), phase milieu

**26…dxe3** (stockfish-1500)

**27.Cc4** — Je ne peux pas tout garder. Avec Cc4, je perds deux pions ; les autres coups coûtaient plus. (Je vois 37…exf2# ; après Cc4, ce n'est plus possible.) `[calcul / moindre_mal]`
  - ligne calculée : 27.Cc4 Dg4+ 28.Rf1 Dg3 29.Td1 exf2
  - coup battu : Cb3, 100 centièmes de moins
  - menace vue : 27…exf2# (la partie (mat)), parée après Cc4
  - termes cités : attaquée par un pion sûr +54
  - recherche : profondeur 5, 237 357 positions, 1638 ms ; score -477 (avant : -360)
  - examinateur : ok (+9 centièmes), phase milieu

**27…Tf5** (stockfish-1500)

**28.f4** — Je ne peux pas tout garder. Avec f4, je perds une pièce contre un pion ; les autres coups coûtaient plus. Sacrifice du cavalier (Cxe3, repris par Dxe3+). `[calcul / moindre_mal]`
  - ligne calculée : 28.f4 Th5 29.Cxe3 Dxe3+ 30.Rg2 Th4 31.Tf1
  - coup battu : fxe3, 13271 centièmes de moins
  - menace vue : 28…Tg5# (la partie (mat)), parée après f4
  - termes cités : danger du roi (g1 : 1 attaquant(s), 3 case(s) faible(s)) +241, mobilité (cavalier c4) +33, abri du roi (g1) -20
  - motif : sacrifice du cavalier (Cxe3, repris par Dxe3+)
  - recherche : profondeur 6, 268 639 positions, 1525 ms ; score -811 (avant : -406)
  - examinateur : exclu (−107 centièmes), phase milieu

**28…Th5** (stockfish-1500)

**29.Cxe3** — Je ne peux pas tout garder. Avec Cxe3, je perds une pièce ; les autres coups coûtaient plus. Sacrifice du cavalier (Cxe3, repris par Dxe3+). `[calcul / moindre_mal]`
  - ligne calculée : 29.Cxe3 Dxe3+ 30.Rg2 Dxf4 31.a3 De4+ 32.Rf1 Th1+ 33.Rf2
  - coup battu : Th2, 13205 centièmes de moins
  - menace vue : 29…Dh1# (la partie (mat)), parée après Cxe3
  - termes cités : pion passé +53, menace par une mineure -12
  - motif : sacrifice du cavalier (Cxe3, repris par Dxe3+)
  - recherche : profondeur 6, 400 001 positions, 2328 ms ; score -878 (avant : -370)
  - examinateur : exclu (−98748 centièmes), phase milieu

**29…Dxe3+** (stockfish-1500)

**30.Rg2** — Je ne peux pas tout garder. Avec Rg2, je perds une tour et un pion ; les autres coups coûtaient plus. `[calcul / moindre_mal]`
  - ligne calculée : 30.Rg2 Dxf4 31.Rg1 Tg5+ 32.Tg2 De3+ 33.Rf1 Dxc1+ 34.Rf2
  - coup battu : Tf2, 330 centièmes de moins
  - termes cités : placement (roi g2) +18, danger du roi (g2 : 2 attaquant(s), 4 case(s) faible(s)) -48
  - recherche : profondeur 6, 341 748 positions, 1923 ms ; score -1351 (avant : -675)
  - examinateur : ok (+98558 centièmes), phase milieu

**30…De4+** (stockfish-1500)

**31.Rg3** — Seul bon coup : Rg3. Sur Rg1, il y avait 41.Rg1 Df3 42.Tg2 De3+ 43.Tf2 Dxc1+ 44.Tf1 Dd2, et je perdais une tour. `[calcul / seul_coup]`
  - ligne calculée : 31.Rg3 Dd3+ 32.Rg2 Th4 33.Tc4 De2+ 34.Rg3 Rh5
  - coup battu : Rg1, 397 centièmes de moins
  - termes cités : pièce en l'air +20, danger du roi (g3 : 2 attaquant(s), 4 case(s) faible(s)) -99
  - recherche : profondeur 6, 395 965 positions, 2187 ms ; score -847 (avant : -847)
  - examinateur : ok (+98666 centièmes), phase milieu

**31…Dd3+** (stockfish-1500)

**32.Rg2** — Je ne peux pas tout garder. Avec Rg2, je perds deux pions ; les autres coups coûtaient plus. `[calcul / moindre_mal]`
  - ligne calculée : 32.Rg2 Th4 33.f5 gxf5 34.Rg1 De3+ 35.Rf1 Txb4
  - coup battu : Rf2, 13155 centièmes de moins
  - termes cités : danger du roi (g2 : 2 attaquant(s), 4 case(s) faible(s)) -29, mobilité (tour c1) -10
  - recherche : profondeur 6, 274 977 positions, 1558 ms ; score -926 (avant : -623)
  - examinateur : exclu (−385 centièmes), phase milieu

**32…Dd5+** (stockfish-1500)

**33.Rg3** — Je ne peux pas tout garder. Avec Rg3, je perds un pion ; les autres coups coûtaient plus. `[calcul / moindre_mal]`
  - ligne calculée : 33.Rg3 Df5 34.Tc3 Th3+ 35.Rg2 Dg4+ 36.Rf1 Th1+ 37.Rf2 Dxf4+
  - coup battu : Rf2, 309 centièmes de moins
  - termes cités : danger du roi (g3 : 2 attaquant(s), 3 case(s) faible(s)) -25
  - recherche : profondeur 6, 324 787 positions, 1798 ms ; score -795 (avant : -566)
  - examinateur : ok (+118 centièmes), phase milieu

**33…Dd3+** (stockfish-1500)

**34.Rg2** — Seul bon coup : Rg2. Sur Rf2, il y avait 44.Rf2 Th2+ 45.Rg1 Dg3+ 46.Rf1 Df3+ 47.Rg1 Th1#, et je perdais du terrain. `[calcul / seul_coup]`
  - coup battu : Rf2, 14081 centièmes de moins
  - termes cités : danger du roi (g2 : 2 attaquant(s), 4 case(s) faible(s)) -29, mobilité (tour c1) -10
  - recherche : profondeur 6, 400 003 positions, 2315 ms ; score 0 (avant : -615)
  - examinateur : exclu (−145 centièmes), phase milieu

**34…De4+** (stockfish-1500)

**35.Rg3** — Seul bon coup : Rg3. Sur Rg1, il y avait 45.Rg1 Df3 46.Tg2 De3+ 47.Tf2 Dxc1+ 48.Tf1 Dd2, et je perdais une tour. `[calcul / seul_coup]`
  - coup battu : Rg1, 1244 centièmes de moins
  - termes cités : pièce en l'air +20, danger du roi (g3 : 2 attaquant(s), 4 case(s) faible(s)) -99
  - recherche : profondeur 6, 300 945 positions, 1671 ms ; score 0 (avant : -581)
  - examinateur : ok (−15 centièmes), phase milieu

**35…De3+** (stockfish-1500)

**36.Rg2** — Seul bon coup : Rg2. Sur Rg4, il y avait 46.Rg4 Dh3#, et je perdais du terrain. `[calcul / seul_coup]`
  - coup battu : Rg4, 14084 centièmes de moins
  - termes cités : danger du roi (g2 : 2 attaquant(s), 4 case(s) faible(s)) -20, pièce en l'air -20
  - recherche : profondeur 6, 400 001 positions, 2253 ms ; score 0 (avant : -623)
  - examinateur : ok (+119 centièmes), phase milieu

**36…Th3** (stockfish-1500)

**37.Rf1** — Je suis mat dans quelques coups quoi que je fasse : Rf1 retarde l'échéance. Rf1 et Tc3 se valent ; j'ai pris Rf1. (Je vois 47…Df3+ 48.Rg1 Th1#, et je ne peux pas tout empêcher.) `[calcul / mat_subi]`
  - ligne calculée : 37.Rf1 Df3+ 38.Re1 Th1+ 39.Rd2 Th2+ 40.Re1 Dh1#
  - coup battu : Tc3 (se valent)
  - menace vue : 37…Df3+ 38.Rg1 Th1# (la partie (mat)), NON parée après Rf1
  - termes cités : danger du roi (f1 : 2 attaquant(s), 4 case(s) faible(s)) +71, menace par le roi -35, mobilité (tour c1) -20
  - recherche : profondeur 5, 65 321 positions, 409 ms ; score -14081 (avant : -785)
  - examinateur : exclu (+0 centièmes), phase milieu

**37…Df3+** (stockfish-1500)

**38.Re1** — Je suis mat dans quelques coups quoi que je fasse : Re1 retarde l'échéance. Re1 et Tf2 se valent ; j'ai pris Re1. `[calcul / mat_subi]`
  - ligne calculée : 38.Re1 Th1+ 39.Rd2 Th2+ 40.Re1 Dh1#
  - coup battu : Tf2 (se valent)
  - recherche : profondeur 4, 7 206 positions, 102 ms ; score -14082 (avant : -676)
  - examinateur : exclu (+0 centièmes), phase milieu

**38…Th1+** (stockfish-1500)

**39.Rd2** — Je suis mat dans quelques coups quoi que je fasse : Rd2 retarde l'échéance. `[calcul / mat_subi]`
  - ligne calculée : 39.Rd2 Th2+ 40.Re1 Dh1#
  - termes cités : placement (roi d2) +20
  - recherche : profondeur 3, 645 positions, 67 ms ; score -14083 (avant : -753)
  - examinateur : exclu (+0 centièmes), phase milieu

**39…Th2+** (stockfish-1500)

**40.Re1** — Je suis mat dans quelques coups quoi que je fasse : Re1 retarde l'échéance. `[calcul / mat_subi]`
  - ligne calculée : 40.Re1 Dh1#
  - termes cités : danger du roi (e1 : 2 attaquant(s), 3 case(s) faible(s)) +98, pièce en l'air (tour h2) +20
  - recherche : profondeur 2, 74 positions, 64 ms ; score -14084 (avant : -702)
  - examinateur : exclu (+0 centièmes), phase milieu

**40…Dh1#** (stockfish-1500)

