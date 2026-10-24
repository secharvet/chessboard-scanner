# Traque de la partie V0 (2026-10-24-maia-w-01) — Expert échecs, 24 octobre 2026

Source : `docs/coach-joueur/recits/2026-10-24-maia-w-01.md` (dev-lead 1ea41bd).

Vérifications :
- partie et 24 lignes du coach rejouées avec chess.js : toutes légales, mat final confirmé ;
- menace 18…Dxg2# confirmée mat (trait passé) ;
- Stockfish 19, un fil, table vidée, profondeur 18, sur les coups 11, 13 et 14 et sur le livre au 5e coup.

**Bilan : 20 coups fidèles sur 25, 5 infidèles.** Les infidèles ont presque toutes une seule cause : la comptabilité du
matériel. Dans deux cas, c'est ma faute : la table « gain » en nombres entiers, et la référence du gain que j'avais
proposée.

| coup | verdict | cause, en une ligne |
|---|---|---|
| 1.e4, 2.d4, 3.Cc3, 4.Cxe4 | fidèle | livre |
| 5.Cxf6+ | fidèle, **livre faux** | « …Dxf6 (Cf3 la chassera) » : Cf3 n'attaque pas f6. C'est Cf3 PUIS Fg5 qui chasse la dame, d'où …h6. Un 6.Fg5 immédiat perd le fou (…Dxg5, −6,99). Après 6.Cf3 Fd6, 7.Fg5 (+1,28) est le meilleur coup. Livre corrigé sur ma branche. |
| 6.Cf3 | fidèle (plat) | Une première sortie de pièce mineure en ouverture devrait prendre le gabarit développement, pas placement. |
| 7.Fd3 | fidèle | |
| 8.Fe2 | fidèle | « sans raison unique » est honnête (le fou n'était pas en prise). |
| 9.O-O | fidèle | |
| **10.Cxd4** | **infidèle** | Sorte fausse : c'est une **reprise** (…cxd4). Pièce fausse : la phrase parle du « fou c1 », alors que le terme cité est le cavalier d4. C'est un bug de remplissage. |
| 11.c3 | fidèle | La défense est juste (Cd4 attaqué deux fois, défendu une fois). La parenthèse « je vois » double la phrase de défense, contrairement à l'étape 4 de l'assemblage. Au moteur, 11.Fe3 était meilleur (+1,94 contre +0,90) : il défendait en développant. C'est la faute à −99, mais elle n'entre pas dans le jugement de fidélité. |
| **12.Ff3** | **infidèle** | « Coup d'attente, ne change rien » : faux, le fou vise le Cd5 (Fxd5 est dans la ligne). Et la note tombe de 413 (E0) à 218 sans perte comptée : E0, lu par la quiescence, est une aberration ici. |
| **13.Cb3** | **infidèle** | « Je gagne deux pions » : la ligne gagne **une pièce contre un pion** (…Fxf2+ Txf2). Le vrai motif est une **double attaque** : Cb3 attaque le Fc5 alors que le Cd5 est déjà attaqué deux fois (Ff3, Dd1). Moteur : +6,80, le meilleur coup, qui gagne une pièce. La faute vient de la table « gain » en nombres entiers, la mienne. |
| **14.Cxc5** | **infidèle** | « Seul bon coup », alors que le coup **prend un fou en prise**. Moteur : 14.c4 gagnait aussi (+6,97 contre +7,98), donc ce n'est pas le seul coup. La faute vient de la référence du gain par quiescence, la mienne : la prise était déjà dans E0, donc « pas de gain ». |
| 15.Cxe6 | fidèle (réserve) | Le gain de la qualité est bien dans la ligne. Mais le motif affiché (« échange, ni gain ni perte ») est hors sujet : le vrai motif est un **clouage** : le Cd5 est cloué devant la Ta8 par le Ff3, et c4 attaque la pièce clouée. |
| 16.c4 | fidèle | |
| **17.Fxa8** | **infidèle** | « J'ai plus de matériel, donc j'échange » : c'est **la prise de la tour**, le gain de la qualité annoncé deux coups plus tôt. Même cause que 14. |
| 18.Fxf4 | fidèle | La parenthèse …Dxg2# est juste, et c'est même la vraie urgence (D + Cf4 sur g2). Au journal, « menace : (un pion) » doit se lire « mat ». |
| 19.Dd6 à 24.Dd6+ | fidèles | La fourchette Dxe6+ sur Re8 et Tg8 est exacte, les mats sont exacts. |
| 25.Dc7# | fidèle | « Après Dc7#, ce n'est plus possible » est absurde sur un coup qui mate. Pas de parenthèse sur un mat. |

## Trois règles, toutes dans la parole (les coups ne changent pas)
1. **Référence du gain.** C'est le matériel sur l'échiquier, sauf si le dernier coup adverse était une prise et que mon
   coup précédent n'en était pas une. La référence est alors le matériel d'avant sa prise. Le gain se teste **avant** le
   « seul coup ». Contrôle sur la partie : 10 devient une reprise, 13 « une pièce contre un pion », 14 « une pièce »,
   17 « la qualité », 18 « un pion ». J'annule ma proposition « contre la quiescence de E0 ».
2. **Le gain se nomme par la composition, pas par un nombre** : une pièce, la qualité, une pièce contre un pion, deux
   pièces contre une tour… Un « 2 » de différence n'est pas deux pions.
3. **E0 sous contrôle.** Si le meilleur score de la racine tombe à plus de 80 sous E0 sans perte comptée, E0 est une
   aberration de la quiescence et on prend E0 = score de M. Le « coup d'attente » est interdit si la ligne contient une
   prise par la pièce jouée.

Petits ajustements, à faire sans en débattre :
- pas de parenthèse « je vois » sur un coup qui mate ni sous une phrase de défense ;
- une menace de mat s'affiche « mat » ;
- gabarit développement pour la première sortie d'une pièce mineure ;
- le remplissage « mobilité » prend la pièce du terme cité.

Mécanique, à signaler : le budget de 400 000 positions est dépassé (707 655 au coup 12, 577 860 au 13). Le budget n'est
donc pas un plafond.

## Verdict pour le GE
**No-go tel quel, go après les trois règles ci-dessus.** Les coups ne changent pas, seules les phrases sont refaites.
Le jeu est réel et propre : 0 bévue, un mat construit. Mais les cinq infidélités tombent toutes sur le matériel, la
chose que le lecteur débutant vérifie en premier (« je gagne deux pions » quand on gagne une pièce). Et la partie ne
montre **aucun plan** (0 sur 25) : il faut le dire en tête du récit, pas laisser le GE le découvrir.
