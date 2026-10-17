// Généré par scripts/ouvertures/construire.mjs : 48 positions du livre + 294 prolongements. Ne pas éditer à la main.
export const OUVERTURE = "Partie espagnole";
export const LIVRE = [
 {
  "coups": "e4",
  "sens": "occupe le centre et ouvre la diagonale du fou roi et la dame",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "répond au centre par le centre : la partie ouverte, celle où l'on apprend le développement et le roque"
   },
   {
    "san": "e6",
    "pourquoi": "la Française : …d5 viendra défier e4 (voir ce livre)",
    "porte": "francaise"
   },
   {
    "san": "c5",
    "pourquoi": "la Sicilienne : on conteste d4 de côté, jeu déséquilibré",
    "porte": "sicilienne"
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "affaiblit le roi et prend la case du cavalier : après Cf3 et d4 les Noirs étouffent"
   },
   {
    "san": "g5",
    "pourquoi": "ouvre la diagonale vers le roi et ne développe rien"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5",
  "nom": "Partie ouverte",
  "sens": "tient le centre pion contre pion : le pion e5 sera attaqué, il faudra le défendre en développant",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "attaque e5 en développant : le coup le plus naturel du jeu"
   },
   {
    "san": "Nc3",
    "pourquoi": "développe sans attaquer : plus calme (partie viennoise)",
    "porte": "viennoise"
   }
  ],
  "erreurs": [
   {
    "san": "Qh5",
    "pourquoi": "sort la dame pour le mat du berger : Cc6 puis g6 la chasse et les Noirs gagnent du temps"
   },
   {
    "san": "f4",
    "pourquoi": "le gambit du roi : jouable mais le roi blanc s'expose, pas pour débuter"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3",
  "sens": "attaque le pion e5 avec un développement : les Noirs doivent le défendre ou le rendre",
  "menace": "Cxe5 gagne un pion",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "défend e5 en développant : la réponse principale"
   },
   {
    "san": "Nf6",
    "pourquoi": "contre-attaque e4 au lieu de défendre : la Petrov, solide",
    "porte": "petrov"
   },
   {
    "san": "d6",
    "pourquoi": "défend par un pion : la Philidor, solide mais le fou f8 est enfermé",
    "porte": "philidor"
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "défend e5 mais Cxe5 ! fxe5 Dh5+ et le roi noir est à nu"
   },
   {
    "san": "Bd6",
    "pourquoi": "défend e5 en bloquant son propre pion d7 : le fou c8 ne sortira plus"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6",
  "sens": "défend e5 en sortant une pièce : les deux camps ont un pion central et un cavalier",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "l'Espagnole : le fou attaque le cavalier qui défend e5, pression durable sur le centre noir"
   },
   {
    "san": "Bc4",
    "pourquoi": "l'Italienne : le fou vise f7 (voir ce livre)",
    "porte": "italienne"
   },
   {
    "san": "d4",
    "pourquoi": "l'Écossaise : ouvre le centre tout de suite",
    "porte": "ecossaise"
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "attaque f7 trop tôt : …h6 ou …d5 le repousse et le cavalier a perdu deux temps"
   },
   {
    "san": "Bd3",
    "pourquoi": "développe le fou devant son propre pion d2 : le fou c1 et le centre sont bloqués"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5",
  "nom": "Partie espagnole",
  "sens": "attaque le cavalier c6, le défenseur de e5 : la pression sur e5 est indirecte mais durable, c'est toute l'idée de l'ouverture",
  "menace": "pas de gain immédiat (Fxc6 dxc6 Cxe5 ? Dd4 ! regagne le pion), mais la menace reviendra après le roque et Te1",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "la défense Morphy : on demande au fou de se décider ; il recule en a4 et …b5 pourra le chasser plus tard"
   },
   {
    "san": "Nf6",
    "pourquoi": "la Berlinoise : contre-attaque e4 tout de suite, très solide"
   },
   {
    "san": "Nd4",
    "pourquoi": "la défense Bird : propose l'échange des cavaliers ; original, un peu artificiel"
   }
  ],
  "erreurs": [
   {
    "san": "Bd6",
    "pourquoi": "défend e5 en bouchant le pion d7 : le fou c8 est enterré pour longtemps"
   },
   {
    "san": "Qf6",
    "pourquoi": "sort la dame trop tôt : Cc3 puis Cd5 la chasse avec gain de temps"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6",
  "nom": "Défense Morphy",
  "sens": "pose la question au fou : il recule en gardant la pression, ou il prend en c6",
  "plan": [
   {
    "san": "Ba4",
    "pourquoi": "garde le fou et la pression sur c6 : la ligne principale, celle des grandes parties"
   },
   {
    "san": "Bxc6",
    "pourquoi": "la variante d'échange : on donne le fou pour doubler les pions noirs et jouer la finale"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "perd une pièce : axb5 ! — le pion a6 était là pour ça"
   },
   {
    "san": "Bd3",
    "pourquoi": "recule devant son propre pion d2 : le fou c1 ne sortira plus, le centre est bloqué"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4",
  "sens": "garde la pression sur c6 et donc sur e5 ; …b5 pourra chasser le fou, qui ira en b3 sur la belle diagonale vers f7",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "attaque e4 en développant : la suite principale"
   },
   {
    "san": "d6",
    "pourquoi": "la Steinitz différée : défend e5 par un pion, …a6 déjà joué rend …b5 possible"
   },
   {
    "san": "b5",
    "pourquoi": "chasse le fou tout de suite ; après Fb3 on joue …Cf6 ou …Fb7"
   },
   {
    "san": "Bc5",
    "pourquoi": "développe en visant f2 : actif, mais c3 et d4 vont le chasser"
   }
  ],
  "erreurs": [
   {
    "san": "Nge7",
    "pourquoi": "bloque le fou f8 : le développement noir prend du retard"
   },
   {
    "san": "f5",
    "pourquoi": "le Schliemann différé : ouvre son propre roi ; d4 ! et le centre explose au mauvais moment"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6",
  "sens": "attaque e4 : les Blancs choisissent entre roquer (e4 est tactiquement défendu par Te1) et le défendre",
  "menace": "Cxe4 gagne un pion si rien n'est fait",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "roque et laisse e4 : si Cxe4, Te1 ou d4 le regagnent. La ligne principale"
   },
   {
    "san": "d3",
    "pourquoi": "défend e4 simplement : plus calme, on manœuvre"
   },
   {
    "san": "Qe2",
    "pourquoi": "défend e4 avec la dame : jouable, mais la dame gêne un peu le fou"
   },
   {
    "san": "Nc3",
    "pourquoi": "défend e4 en développant : une Espagnole à quatre cavaliers, solide"
   }
  ],
  "erreurs": [
   {
    "san": "Bxc6",
    "pourquoi": "donne le fou sans raison : dxc6 et les Noirs ont la paire de fous et un jeu facile"
   },
   {
    "san": "Ng5",
    "pourquoi": "attaque f7 pour rien : …h6 ! le chasse, puis …Cxe4 prend le pion"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O",
  "sens": "roque en laissant e4 en prise : si …Cxe4, d4 ou Te1 le regagnent avec de l'activité",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "l'Espagnole fermée : on développe et on roque, la grande ligne classique"
   },
   {
    "san": "Nxe4",
    "pourquoi": "l'Espagnole ouverte : on prend le pion, les Blancs le regagnent par d4 ; jeu ouvert et actif"
   },
   {
    "san": "b5",
    "pourquoi": "chasse le fou avant de développer : prépare …Fc5 ou …Fb7"
   },
   {
    "san": "d6",
    "pourquoi": "solide : défend e5, le fou sortira en e7"
   }
  ],
  "erreurs": [
   {
    "san": "d5",
    "pourquoi": "exd5 ! attaque le cavalier c6 : si …e4, dxc6 exf3 Dxf3 et les Blancs gagnent du matériel"
   },
   {
    "san": "Nd4",
    "pourquoi": "Cxd4 exd4 e5 ! et le cavalier f6 doit reculer : les Blancs gagnent du temps"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7",
  "nom": "Espagnole fermée",
  "sens": "développe et prépare le roque ; les Noirs tiennent e5 et se préparent à …b5 puis …d6",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "défend e4 et rend la menace sur e5 réelle : la ligne principale"
   },
   {
    "san": "d3",
    "pourquoi": "plus calme : on défend e4 par le pion et on manœuvre (Cbd2, c3)"
   },
   {
    "san": "Qe2",
    "pourquoi": "défend e4 avec la dame, la tour f1 ira en d1 : la variante Worrall"
   }
  ],
  "erreurs": [
   {
    "san": "d4",
    "pourquoi": "trop tôt : exd4 e5 Ce4 et le pion e5 est une cible, le cavalier e4 domine"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1",
  "sens": "défend e4 par la tour : maintenant Fxc6 suivi de Cxe5 est une vraie menace sur e5",
  "menace": "Fxc6 dxc6 Cxe5 gagne un pion (la parade Dd4 ne marche plus, e4 est défendu)",
  "plan": [
   {
    "san": "b5",
    "pourquoi": "chasse le fou : il ne peut plus prendre en c6, e5 est sauvé. La ligne principale"
   },
   {
    "san": "d6",
    "pourquoi": "défend e5 par un pion : solide, la Steinitz différée"
   }
  ],
  "erreurs": [
   {
    "san": "Nd4",
    "pourquoi": "Cxd4 exd4 e5 ! et le cavalier f6 recule ; les Blancs ont le centre et le temps"
   },
   {
    "san": "Bc5",
    "pourquoi": "le fou a déjà bougé en e7 : après c3 et d4 il devra encore fuir, encore un temps perdu"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5",
  "sens": "chasse le fou pour sauver e5 : le fou ira en b3, toujours sur la diagonale vers f7",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "la seule bonne case : le fou vise f7 et reste actif"
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5",
    "pourquoi": "axb5 ! le pion a6 le prenait : une pièce de moins"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3",
  "sens": "le fou garde la diagonale a2-g8 vers f7 ; les Noirs finissent leur développement",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "défend e5 pour de bon et libère le fou c8 : la suite classique"
   },
   {
    "san": "O-O",
    "pourquoi": "roi à l'abri d'abord ; …d6 suivra (ou …d5, le gambit Marshall, pour les forts)"
   },
   {
    "san": "Bb7",
    "pourquoi": "le fou sur la grande diagonale : la variante Arkhangelsk, active"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Txe4 ! gagne le cavalier : la fourchette …d5 est parée par Fxd5. Prendre e4 ne marchait qu'avant Te1"
   },
   {
    "san": "d5",
    "pourquoi": "exd5 Cxd5 Cxe5 ! Cxe5 Txe5 et les Blancs ont un pion de plus"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6",
  "sens": "défend e5 solidement et libère le fou c8 : la structure de l'Espagnole fermée est posée",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "prépare d4 et donne au fou la case de repli c2 : le plan central des Blancs"
   },
   {
    "san": "a4",
    "pourquoi": "conteste la chaîne a6-b5 tout de suite : les Noirs répondent …Fg4 ou …b4"
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "attaque f7 pour rien : O-O (ou …d5) et le cavalier doit repartir"
   },
   {
    "san": "Bxf7+",
    "pourquoi": "sacrifie le fou : Rxf7 et il n'y a pas de suite, les Noirs ont une pièce de plus"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3",
  "sens": "prépare d4 et la retraite Fc2 : les Blancs veulent le grand centre d4-e4",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "roi à l'abri avant la bagarre du centre : la suite normale"
   },
   {
    "san": "Na5",
    "pourquoi": "chasse le fou tout de suite pour jouer …c5 : la Tchigorine, aussi possible sans roquer"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Txe4 ! gagne le cavalier : la fourchette …d5 est parée par Fxd5. Prendre e4 ne marchait qu'avant Te1"
   },
   {
    "san": "d5",
    "pourquoi": "exd5 Cxd5 Cxe5 ! et les Blancs gagnent un pion"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O",
  "nom": "Espagnole fermée, position type",
  "sens": "les deux rois sont à l'abri : les Blancs préparent d4, les Noirs choisissent leur plan à l'aile dame",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "empêche …Fg4 (le clouage gênerait d4) : le coup prophylactique classique"
   },
   {
    "san": "d4",
    "pourquoi": "ouvre le centre tout de suite : jouable, mais …Fg4 cloue et complique"
   },
   {
    "san": "a4",
    "pourquoi": "attaque la chaîne b5 : plan d'aile dame"
   },
   {
    "san": "d3",
    "pourquoi": "garde le centre fermé et manœuvre lentement (Cbd2-f1-g3)"
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "rien à attaquer : …d5 ou …h6 et le cavalier repart"
   },
   {
    "san": "Qe2",
    "pourquoi": "coup sans idée : la dame n'a rien à faire en e2 ; h3 puis d4 était le plan"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3",
  "sens": "interdit …Fg4 avant de jouer d4 : la position la plus jouée de toute l'Espagnole",
  "plan": [
   {
    "san": "Na5",
    "pourquoi": "la Tchigorine : chasse le fou et prépare …c5, contre-jeu à l'aile dame"
   },
   {
    "san": "Nb8",
    "pourquoi": "la Breyer : le cavalier repart en d7 pour soutenir e5 et libérer la diagonale du fou b7"
   },
   {
    "san": "Bb7",
    "pourquoi": "la Zaitsev : le fou sur la grande diagonale, …Te8 et …Ff8 suivent"
   }
  ],
  "erreurs": [
   {
    "san": "Bg4",
    "pourquoi": "hxg4 : le fou tombe tout simplement, h3 est là pour ça"
   },
   {
    "san": "Nxe4",
    "pourquoi": "Txe4 ! gagne le cavalier : la fourchette …d5 est parée par Fxd5. Prendre e4 ne marchait qu'avant Te1"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5",
  "nom": "Variante Tchigorine",
  "sens": "chasse le fou de sa diagonale pour pousser …c5 et prendre de l'espace à l'aile dame",
  "plan": [
   {
    "san": "Bc2",
    "pourquoi": "la seule bonne retraite : le fou garde la diagonale b1-h7 vers le roi noir"
   }
  ],
  "erreurs": [
   {
    "san": "Bxf7+",
    "pourquoi": "sacrifie le fou : Txf7 et il n'y a rien derrière"
   },
   {
    "san": "Nxe5",
    "pourquoi": "dxe5 : e5 était défendu par d6, et le fou b3 reste attaqué par le cavalier a5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2",
  "sens": "le fou vise h7 depuis c2 : les Noirs lancent …c5, les Blancs préparent d4",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "gagne de l'espace et prépare …Dc7 : le plan de la Tchigorine"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Fxe4 : le fou c2 prend le cavalier, il n'y avait rien à gagner sur e4"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5",
  "sens": "les Noirs tiennent l'aile dame ; les Blancs doivent ouvrir le centre maintenant",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "ouvre le centre pendant que le cavalier a5 est loin : le moment juste"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "dxe5 : le pion e5 est défendu par d6, le cavalier est perdu"
   },
   {
    "san": "b4",
    "pourquoi": "cxb4 cxb4 Cc6 et le pion b4 est faible, le centre toujours fermé"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4",
  "nom": "Tchigorine, position principale",
  "sens": "le centre s'ouvre : les Noirs doivent décider s'ils gardent la tension ou échangent",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "défend e5 et c5, garde la tension : le coup classique"
   },
   {
    "san": "cxd4",
    "pourquoi": "échange tout de suite : cxd4 et les Blancs ont le grand centre, à attaquer ensuite"
   },
   {
    "san": "exd4",
    "pourquoi": "échange le pion central : cxd4 et les Noirs jouent …Cc6 contre le centre blanc"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Fxe4 : le cavalier est perdu pour un pion, le fou c2 le prenait"
   }
  ],
  "schema": {
   "blancs": "d4-d5 pour fermer et attaquer à l'aile roi (Cbd2-f1-g3, Ch2-g4), ou garder la tension et jouer a4",
   "noirs": "contre-jeu à l'aile dame : …Cc6, …Td8, pression sur d4 ; si d5, …c4 et le cavalier revient en b7-c5"
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4",
  "nom": "Espagnole ouverte",
  "sens": "prend le pion e4 : les Blancs le regagnent en ouvrant le centre, les Noirs auront du jeu de pièces actif",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "ouvre le centre : …b5 Fb3 d5 dxe5 et les Blancs regagnent le pion avec une bonne position"
   },
   {
    "san": "Re1",
    "pourquoi": "chasse le cavalier : …Cc5 Fxc6 dxc6 Cxe5, plus simple et égal"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "Cxe5 : d4, Te1 et f3 finissent par regagner la pièce, mais les Noirs ressortent plus actifs"
   },
   {
    "san": "Bxc6",
    "pourquoi": "donne la paire de fous pour rien : les Blancs regagnent bien e5, mais il ne reste plus aucune pression"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4",
  "sens": "ouvre le centre pour regagner le pion : le cavalier e4 et le pion e5 sont sous pression",
  "menace": "Te1 puis Cxe5 ou dxe5, le cavalier e4 est cloué sur le roi",
  "plan": [
   {
    "san": "b5",
    "pourquoi": "chasse le fou avant qu'il ne prenne en c6 : la ligne principale"
   },
   {
    "san": "Be7",
    "pourquoi": "développe et prépare le roque : solide"
   }
  ],
  "erreurs": [
   {
    "san": "exd4",
    "pourquoi": "Te1 d5 Cxd4 et le cavalier e4 est cloué : les Noirs sont en grand danger"
   },
   {
    "san": "Nxd4",
    "pourquoi": "Cxd4 exd4 Te1 et le cavalier e4 est perdu"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5",
  "sens": "chasse le fou : il ira en b3, toujours vers f7 et d5",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "la case naturelle : le fou vise d5 et f7"
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5",
    "pourquoi": "axb5 et le fou est perdu : le pion a6 le prenait"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3",
  "sens": "le fou vise d5 : les Noirs doivent consolider le cavalier e4",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "soutient le cavalier et prend le centre : la position principale de l'Ouverte"
   }
  ],
  "erreurs": [
   {
    "san": "exd4",
    "pourquoi": "Te1 d5 Cc3 ! et le cavalier e4 est en danger"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5",
  "nom": "Espagnole ouverte, position principale",
  "sens": "les Noirs ont un centre solide et un cavalier superbe en e4 ; les Blancs regagnent le pion",
  "plan": [
   {
    "san": "dxe5",
    "pourquoi": "regagne le pion : …Fe6 et une position riche, le pion e5 blanc gêne les Noirs"
   },
   {
    "san": "Nxe5",
    "pourquoi": "regagne aussi, mais Cxe5 dxe5 c6 et c'est plus plat"
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "dxc4 Fxc4 ? bxc4 ou Fe6 : le fou b3 n'a rien à gagner ici"
   }
  ],
  "schema": {
   "blancs": "c3, Cbd2 pour chasser le cavalier e4, puis Fc2 et attaque à l'aile roi avec le pion e5 en pointe",
   "noirs": "le fou en e6, …Fc5 ou …Fe7, pression sur f2 et d4 ; garder le cavalier e4 le plus longtemps possible"
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6",
  "nom": "Défense berlinoise",
  "sens": "contre-attaque e4 sans perdre de temps avec …a6 : très solide, aimée des forts joueurs",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "roque et laisse e4 : …Cxe4 d4 mène à la finale berlinoise, …Fe7 à une Espagnole fermée"
   },
   {
    "san": "d3",
    "pourquoi": "défend e4 et évite les échanges : la version calme, on manœuvre"
   },
   {
    "san": "Nc3",
    "pourquoi": "défend e4 en développant : les quatre cavaliers, symétrique et solide"
   }
  ],
  "erreurs": [
   {
    "san": "Bxc6",
    "pourquoi": "dxc6 : donne le fou pour rien, les Noirs ont la paire de fous et un roque facile"
   },
   {
    "san": "Ng5",
    "pourquoi": "rien à attaquer : …d5 ou …h6 et le cavalier repart"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O",
  "sens": "roque en laissant e4 : si …Cxe4, d4 ou Te1 le regagnent",
  "plan": [
   {
    "san": "Nxe4",
    "pourquoi": "prend le pion : d4 mène à la finale berlinoise, Te1 à des échanges"
   },
   {
    "san": "Be7",
    "pourquoi": "rejoint l'Espagnole fermée sans …a6 : solide"
   },
   {
    "san": "Bc5",
    "pourquoi": "développe en visant f2 : actif, c3 et d4 répondent"
   }
  ],
  "erreurs": [
   {
    "san": "Nd4",
    "pourquoi": "Cxd4 exd4 e5 ! et le cavalier f6 recule : les Blancs gagnent du temps"
   },
   {
    "san": "d5",
    "pourquoi": "exd5 ! attaque le cavalier c6 : si …e4, dxc6 exf3 Dxf3 et les Blancs gagnent du matériel"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4",
  "sens": "prend e4 : les Blancs ouvrent le centre pour le regagner, le cavalier e4 va devoir reculer",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "ouvre le centre : …Cd6 Fxc6 dxc6 dxe5 Cf5 Dxd8+ Rxd8, la fameuse finale berlinoise"
   },
   {
    "san": "Re1",
    "pourquoi": "chasse le cavalier : …Cd6 Cxe5 Fe7, des échanges et une position égale"
   }
  ],
  "erreurs": [
   {
    "san": "Bxc6",
    "pourquoi": "donne la paire de fous pour rien : les Blancs regagnent bien e5, mais il ne reste plus aucune pression"
   },
   {
    "san": "Nc3",
    "pourquoi": "Cxc3 dxc3 d6 : les Noirs gardent simplement leur pion de plus, et les Blancs ont des pions doublés en prime"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4",
  "sens": "ouvre le centre : le cavalier e4 doit se décider, le pion e5 est attaqué",
  "menace": "Te1 puis le cavalier e4 est cloué sur le roi",
  "plan": [
   {
    "san": "Nd6",
    "pourquoi": "attaque le fou en reculant : …Cxb5 ou la finale berlinoise après Fxc6"
   },
   {
    "san": "Be7",
    "pourquoi": "développe : Te1 Cd6 Fxc6 dxc6 dxe5 et jeu égal"
   },
   {
    "san": "a6",
    "pourquoi": "pose la question au fou avant de reculer : Fa4 ou Fxc6"
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Cxd4 exd4 Te1 et le cavalier e4 est perdu : …d5 est même interdit, le pion d7 est cloué par le fou b5"
   },
   {
    "san": "exd4",
    "pourquoi": "Te1 d5 Cxd4 et le cavalier e4 est cloué, en grand danger"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6",
  "nom": "Variante d'échange",
  "sens": "donne le fou pour doubler les pions noirs : les Blancs visent la finale, où leur majorité à l'aile roi vaut plus",
  "plan": [
   {
    "san": "dxc6",
    "pourquoi": "reprend vers le centre et ouvre le fou c8 et la dame : la bonne reprise"
   }
  ],
  "erreurs": [
   {
    "san": "bxc6",
    "pourquoi": "reprend du mauvais côté : le fou c8 reste enfermé et les pions c6-c7 sont faibles ; dxc6 ouvre le jeu"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6",
  "sens": "les Noirs ont la paire de fous et un jeu libre ; les Blancs la meilleure structure pour la finale",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "roque et rend Cxe5 réel : …Dd4 ne sauvera plus e5 (Cf3, puis Te1 contre la dame si elle prend e4)"
   },
   {
    "san": "Nc3",
    "pourquoi": "développe et prépare d4 : …f6 ou …Fg4 répondent"
   },
   {
    "san": "d3",
    "pourquoi": "calme : on garde le centre fermé et on manœuvre"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "Dd4 ! attaque le cavalier et le pion e4 : Cf3 Dxe4+ et les Noirs ont regagné le pion avec la paire de fous"
   },
   {
    "san": "d4",
    "pourquoi": "exd4 Dxd4 Dxd4 Cxd4 : tout l'avantage s'évapore, dames échangées, la paire de fous compense largement la structure"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O",
  "sens": "roque : maintenant Cxe5 est une vraie menace, …Dd4 ne sauve plus le pion",
  "menace": "Cxe5 ! gagne le pion : …Dd4 ne marche plus, car après Cf3 …Dxe4 ?? Te1 cloue la dame sur le roi",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "soutient e5 solidement et prépare …Fg4 ou …Fd6 : la réponse principale"
   },
   {
    "san": "Bg4",
    "pourquoi": "cloue le cavalier : h3 Fh5 ou …Fxf3"
   },
   {
    "san": "Qd6",
    "pourquoi": "défend e5 et garde la dame active : actif"
   }
  ],
  "erreurs": [
   {
    "san": "f5",
    "pourquoi": "exf5 Fxf5 d4 et le centre s'ouvre contre les Noirs, roi au milieu"
   },
   {
    "san": "Bc5",
    "pourquoi": "Cxe5 ! et si Dd4, Cf3 Dxe4 ?? Te1 ! cloue la dame sur le roi : elle est perdue"
   }
  ],
  "schema": {
   "blancs": "d4 pour échanger et aller vers la finale : quatre pions contre trois à l'aile roi, les pions noirs doublés ne font qu'un passé",
   "noirs": "garder les pièces et utiliser la paire de fous : …Fd6, …Ce7-g6, …O-O, pression sur e4"
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6",
  "nom": "Steinitz différée",
  "sens": "défend e5 par un pion : solide, et …a6 déjà joué permet …b5 pour chasser le fou",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "prépare d4 et une case pour le fou : la suite classique"
   },
   {
    "san": "O-O",
    "pourquoi": "roque avant d'ouvrir : prudent"
   },
   {
    "san": "Bxc6+",
    "pourquoi": "bxc6 d4 : on casse la structure et on ouvre le centre tout de suite"
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "rien à attaquer : …d5 ou …Fe7 et le cavalier repart"
   },
   {
    "san": "d4",
    "pourquoi": "ouvre trop tôt : …b5 Fb3 Cxd4 Cxd4 exd4 et la dame ne peut pas reprendre (c5 ! puis c4 enferme le fou : l'Arche de Noé). c3 d'abord"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4",
  "sens": "ouvre le centre : correct, mais les Blancs doivent connaître le piège qui suit",
  "plan": [
   {
    "san": "b5",
    "pourquoi": "chasse le fou ET lève le clouage du cavalier c6 (le fou a4 le clouait sur le roi) : …Cxd4 devient possible, le piège de l'Arche de Noé est tendu"
   },
   {
    "san": "exd4",
    "pourquoi": "échange simplement : Cxd4 et jeu normal"
   }
  ],
  "erreurs": [],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5",
  "sens": "chasse le fou : il va en b3, et les pions a6-b5 vont le gêner",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "la seule retraite active"
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5",
    "pourquoi": "axb5 : le pion a6 prend le fou, une pièce de moins"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3",
  "sens": "le fou est en b3 : …Cxd4 pose le piège de l'Arche de Noé",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "échange les cavaliers : si Cxd4 exd4 Dxd4 ?? c5 ! puis c4 enferme le fou b3"
   },
   {
    "san": "exd4",
    "pourquoi": "échange simplement le pion : Cxd4 et jeu normal"
   }
  ],
  "erreurs": [],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4",
  "sens": "les Noirs proposent l'échange : la reprise Cxd4 est forcée, et ensuite il faut éviter Dxd4",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "reprend le cavalier : seul coup"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "dxe5 : le pion e5 est défendu par d6, le cavalier est perdu"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4",
  "sens": "les Noirs reprennent en d4 : le pion attaque ensuite la dame si elle reprend",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "reprend le cavalier : le piège est tendu"
   }
  ],
  "erreurs": [],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4",
  "nom": "L'Arche de Noé",
  "sens": "le piège : si la dame reprend en d4, …c5 puis …c4 enferme le fou b3 derrière les pions a6-b5-c4. Même bien joué, les Blancs n'ont plus d'avantage : c'est la punition du d4 prématuré",
  "menace": "pas de menace immédiate : le piège ne se referme que si la dame reprend en d4",
  "plan": [
   {
    "san": "Bd5",
    "pourquoi": "sort le fou avant qu'il ne soit enfermé : …Tb8 Fc6+ Fd7 Fxd7+ Dxd7 Dxd4 et égalité"
   },
   {
    "san": "c3",
    "pourquoi": "ne reprend pas tout de suite ; attention, après …dxc3 il faut Dd5 ! (f7 et la tour a8) pour tenir l'égalité"
   }
  ],
  "erreurs": [
   {
    "san": "Qxd4",
    "pourquoi": "c5 ! la dame fuit, puis c4 enferme le fou b3 : il est perdu. Le piège de l'Arche de Noé, le plus célèbre de l'Espagnole"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5",
  "sens": "chasse le fou tout de suite, avant même de développer : direct, mais les pions avancés a6-b5 pourront devenir des cibles (a4 !)",
  "menace": "bxa4 gagne le fou : il doit bouger",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "la seule case : le fou reste sur sa diagonale vers f7, hors de portée des pions"
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5",
    "pourquoi": "axb5 ! le pion a6 le prenait : une pièce de moins"
   },
   {
    "san": "Nxe5",
    "pourquoi": "bxa4 ! d'abord le fou : les Blancs ont donné une pièce pour un pion"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3",
  "sens": "le fou est à l'abri sur la diagonale a2-g8 ; les Noirs développent, en surveillant leurs pions avancés",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "développe et attaque e4 : on revient vers les chemins classiques"
   },
   {
    "san": "Bb7",
    "pourquoi": "le fou sur la grande diagonale vise e4 ; l'autre fou sortira ensuite"
   }
  ],
  "erreurs": [
   {
    "san": "Nd4",
    "pourquoi": "Cxd4 exd4 Fxf7+ ! Rxf7 Dh5+ g6 Dd5+ et la tour a8 tombe : le saut du cavalier laissait f7 et a8 sans défense"
   },
   {
    "san": "f6",
    "pourquoi": "n'aide ni le développement ni le roi : a4 ! attaque déjà la chaîne b5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5",
  "sens": "chasse le fou avant de sortir le fou roi : les Noirs choisiront ensuite sa case, f8 reste ouvert",
  "menace": "bxa4 gagne le fou",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "la seule case : la pression sur f7 et le centre continue"
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5",
    "pourquoi": "axb5 ! une pièce contre un pion"
   },
   {
    "san": "Nxe5",
    "pourquoi": "bxa4 ! et les Blancs ont perdu le fou pour un pion : prendre e5 ne compense rien"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3",
  "sens": "le fou garde f7 dans le viseur ; les Noirs choisissent la case de leur fou roi",
  "plan": [
   {
    "san": "Bb7",
    "pourquoi": "l'Arkhangelsk : le fou vise e4 sur la grande diagonale, du contre-jeu actif"
   },
   {
    "san": "Bc5",
    "pourquoi": "développe en visant f2 avant de roquer : la néo-Arkhangelsk, active"
   },
   {
    "san": "Be7",
    "pourquoi": "la voie calme : …d6 et …O-O, on retrouve l'Espagnole fermée"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "un coup trop tard pour l'Ouverte : Te1 Cc5 Fd5 ! et le fou domine tout le centre"
   },
   {
    "san": "g6",
    "pourquoi": "trop lent : d4 ! ouvre le centre, et après dxe5 dxe5 Dxd8+ les Noirs ne roqueront plus"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3",
  "sens": "prépare d4 et une retraite au fou (c2 si …b5) ; rappel : le cavalier c6 est cloué par le fou tant que la case d7 reste vide",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "développe et attaque e4 : après d4 Fe7 puis …O-O, un jeu classique et sain"
   },
   {
    "san": "Bd7",
    "pourquoi": "délie le cavalier c6 (cloué depuis que …d6 a vidé d7) et prépare tranquillement …Cf6 et …Fe7"
   }
  ],
  "erreurs": [
   {
    "san": "Qf6",
    "pourquoi": "sort la dame pour rien : d4 ! et le centre s'ouvre, la dame sera une cible"
   },
   {
    "san": "Nge7",
    "pourquoi": "bloque le fou f8 : d4 ! et le centre s'ouvre pendant que les Noirs s'emmêlent"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6",
  "sens": "soutient e5 pour de bon : …f6 est solide ici, car le fou blanc des cases blanches a disparu — personne ne punira la diagonale affaiblie",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "force l'ouverture : exd4 Cxd4, l'échange des dames se profile et la majorité blanche 4 contre 3 à l'aile roi donne la finale voulue"
   },
   {
    "san": "d3",
    "pourquoi": "plus calme : on développe d'abord (Fe3, Cbd2), d4 viendra mieux préparé"
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "fxe5 ! le pion f6 était là pour ça : une pièce contre un pion. Le contre Dh5+ est paré par Rd7 ! (pas …g6 ? Dxe5 prend la tour h8)"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6",
  "sens": "le cavalier recule en attaquant le fou b5 : les Blancs doivent réagir, et l'échange en c6 mène à la fameuse finale berlinoise",
  "menace": "Cxb5 gagne le fou",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "prend avant d'être pris : dxc6 dxe5 Cf5 Dxd8+ Rxd8 et c'est la finale — majorité blanche saine à l'aile roi, roi noir privé de roque"
   },
   {
    "san": "dxe5",
    "pourquoi": "l'autre ordre : Cxb5 a4 ! rappelle le cavalier vers d4, les Blancs regagnent la pièce, jeu égal"
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "recule sans combattre : e4 ! chasse le cavalier f3 et les Noirs consolident leur pion de plus"
   },
   {
    "san": "Bd3",
    "pourquoi": "e4 ! gagne de l'espace avec gain de temps : les Noirs rendront peut-être le pion, mais gardent le meilleur jeu"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6",
  "sens": "prend le cavalier juste avant que …Cxb5 ne prenne le fou : les Noirs doivent bien reprendre, la finale est au bout",
  "plan": [
   {
    "san": "dxc6",
    "pourquoi": "la bonne reprise : ouvre le fou c8. Après dxe5 Cf5 Dxd8+ Rxd8, la finale berlinoise : les Noirs perdent le roque mais sont très solides avec la paire de fous"
   }
  ],
  "erreurs": [
   {
    "san": "bxc6",
    "pourquoi": "reprend du mauvais côté : dxe5 chasse le cavalier d6 et les pions doublés c6-c7 n'ont plus de compensation"
   },
   {
    "san": "exd4",
    "pourquoi": "oublie de reprendre : Fa4 ! et le fou s'échappe, les Blancs restent avec une pièce de plus"
   }
  ],
  "schema": {
   "blancs": "échanger les dames et jouer la finale : la majorité 4 contre 3 à l'aile roi fera un pion passé ; avancer ces pions, échanger les pièces, pas les pions",
   "noirs": "pas de roque mais aucune faiblesse : garder la paire de fous, freiner la majorité blanche (…h5) et activer le roi, déjà bien placé pour la finale"
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6",
  "nom": "Défense Steinitz différée (ou Steinitz moderne), avec 5.c3",
  "sens": "Développe le cavalier roi vers sa case naturelle et attaque le pion e4, désormais sans défenseur : les Blancs doivent s'en occuper avant tout. Le petit roque noir devient possible dès le coup suivant.",
  "menace": "Cxe4, qui gagne le pion e4 pour rien.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Occupe le centre et défend e4 par la dame. Si ...Cxe4, les Blancs jouent d5 et Da4 ou Dd5 avec de bonnes chances de reprendre le pion. Le pion d4 attaque e5 : les Noirs devront décider entre ...Fd7 et ...b5 puis ...exd4."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri sans défendre e4. Le pion est offert : après ...Cxe4 d4, les Blancs ouvrent le centre contre un roi encore au milieu, et le cavalier e4 doit fuir. Les Noirs préfèrent souvent ...Fd7 ou ...Fe7 et le pion reste à prendre plus tard."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 modestement, comme dans beaucoup de parties espagnoles tranquilles. Les Blancs renoncent à d4 pour l'instant, mais gardent la poussée en réserve et préparent Cbd2 puis le roque."
   }
  ],
  "erreurs": [
   {
    "san": "Qc2",
    "pourquoi": "Défend e4 mais abandonne le centre et place mal la dame. Après ...b5 Fb3 Ca5, le cavalier noir chasse le fou d'a4 et prend la paire de fous : les Noirs gagnent du temps et la dame c2 gêne le développement."
   },
   {
    "san": "h3",
    "pourquoi": "Perd le temps : le pion e4 est attaqué et personne ne le défend. Après ...Cxe4 d4 exd4, les Noirs ont un pion de plus et une position saine. Ne faites pas de coups de pion inutiles quand une pièce est menacée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4",
  "nom": "Partie espagnole, défense Steinitz différée (variante 5.c3 Cf6 6.d4)",
  "sens": "Occupe le centre avec un second pion et attaque e5. La dame surveille e4, donc le pion n'est pas en prise gratuitement.",
  "menace": "Prendre en e5 : après dxe5 dxe5 Dxd8+ Rxd8, le roi noir perd le roque et le cavalier c6 reste attaqué par le fou a4.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou et prépare le roque. Si dxe5 dxe5 Dxd8+, le fou reprend en d8 (ou Fxd8) : les Noirs gardent le roque et la position reste solide. Laisse aux Blancs le choix de maintenir la tension ou de fermer avec d5."
   },
   {
    "san": "Bd7",
    "pourquoi": "Défend le cavalier c6 et casse le clouage du fou a4 : plus de risque sur Fxc6 suivi de dxe5. Prépare ...Fe7 et le roque. Le fou reste un peu passif derrière les pions."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou en c2 ou b3 avec gain de temps, puis ...exd4 cxd4 permet de jouer contre le centre blanc. Mais les pions a6 et b5 affaiblissent l'aile dame et donnent une cible pour a4 plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier ne menace rien de concret et quitte la défense de e5 et du roi. Les Blanches roquent, puis h3 le renvoie en f6 : deux coups perdus et le centre blanc avance sans gêne."
   },
   {
    "san": "g6",
    "pourquoi": "Trop lent : Fg5 cloue le cavalier f6 sur la dame, puis dxe5 crée une double attaque sur f6 et d6. Les Noirs perdent du temps à se dégager et le fou en g7 arrive trop tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4",
  "nom": "Partie espagnole, variante d'échange (5...f6 6.d4)",
  "sens": "Attaque le pion e5 avec le pion d et veut ouvrir la colonne d : l'échange des dames est bon pour les Blancs, qui ont la meilleure structure de pions.",
  "menace": "dxe5 gagne le pion e5 : sur ...fxe5, Cxe5 le prend, et sur ...Dxd1 Txd1 le pion e5 tombe quand même.",
  "plan": [
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3 sur la dame : dxe5 ne marche plus car après ...fxe5 le cavalier ne peut pas reprendre. Le fou sort activement et défend e5 sans bouger de pion. Les Blancs devront d'abord jouer dxe5 et c3 ou h3 pour se libérer."
   },
   {
    "san": "exd4",
    "pourquoi": "Règle le problème de e5 en l'échangeant. Après Dxd4, la dame blanche est centralisée, mais les Noirs ont les deux fous et peuvent développer avec ...Fe6, ...Dd7 ou ...Fd6. Simple et solide."
   },
   {
    "san": "Qe7",
    "pourquoi": "Défend e5 une seconde fois et évite l'échange des dames sur d1. La dame garde la colonne e ; après dxe5 fxe5 le pion est protégé. Inconvénient : le fou f8 doit trouver une autre case (…g6 et …Fg7)."
   }
  ],
  "erreurs": [
   {
    "san": "Bd6",
    "pourquoi": "Développe mais ne défend rien : dxe5 fxe5 Cxe5 et les Blancs gagnent un pion net, le fou d6 étant lui-même attaqué."
   },
   {
    "san": "Be7",
    "pourquoi": "Trop lent : dxe5 Dxd1 Txd1 et le pion e5 est perdu, car ...fxe5 se heurte à Cxe5. Il faut d'abord régler la tension sur e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7",
  "nom": "Partie espagnole, défense Steinitz différée (variante moderne avec c3 et d4)",
  "sens": "développe le fou avant de roquer, en gardant le pion e5 bien soutenu par d6 et Cc6. Si les Blancs échangent en e5 puis les dames, le fou peut reprendre en d8 : les Noirs ne perdent pas le roque et la position reste solide. Le choix est laissé aux Blancs : garder la tension au centre ou la fermer avec d5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri avant d'ouvrir le centre : le roque est prioritaire. Le centre reste tendu (d4 contre e5) et les Blancs décideront plus tard, selon ce que font les Noirs, entre dxe5 ou d5. Les Noirs répondront presque toujours par O-O ou Fd7."
   },
   {
    "san": "dxe5",
    "pourquoi": "ouvre tout de suite le centre : après dxe5, les Blancs ont la colonne d et peuvent jouer Dxd8+ Fxd8 pour une finale sans risque, ou De2 et Cbd2 pour viser la case d5. Simple et clair, mais les Noirs gardent une position saine : c'est le choix si vous aimez les positions sans tension."
   },
   {
    "san": "d5",
    "pourquoi": "ferme le centre et chasse le cavalier c6, qui doit reculer en b8 ou aller en a5. Les Blancs gagnent de l'espace et prépareront c4 puis Cc3 ; les Noirs riposteront sur l'aile roi avec Ch5 et f5. Jouez-le si vous préférez une position stable où le plan est clair."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4",
  "nom": "Partie espagnole, variante d'échange (Lasker, 5...f6)",
  "sens": "Cloue le cavalier f3 sur la dame d1 : le cavalier ne peut plus reprendre en e5, ce qui soutient le pion e5 sans toucher aux pions. Le fou sort activement et vise aussi la case d1 derrière le cavalier.",
  "menace": "...exd4 : si les Blancs reprennent Dxd4, les Noirs échangent les dames par ...Dxd4 et Cxd4 reste impossible à cause du clouage ; si Cxd4, le fou prend la dame en d1.",
  "plan": [
   {
    "san": "dxe5",
    "pourquoi": "Lève tout de suite la tension au centre. Après ...fxe5 le cavalier f3 ne peut pas reprendre, mais le pion f6 a disparu et la case d1 n'est plus en danger. Les Blancs pourront ensuite jouer h3 pour chasser le fou, puis Cbd2 ou Dxd8 selon la position. Les Noirs gardent une structure saine mais sans avantage."
   },
   {
    "san": "c3",
    "pourquoi": "Renforce le pion d4 : sur ...exd4 les Blancs reprennent cxd4 avec un pion et non avec la dame, donc aucun échange de dames forcé. Le centre reste fermé, la case d4 est solide et les Blancs se libéreront ensuite par h3 ou Cbd2. Laisse aux Noirs le temps de jouer ...Fd6 et ...De7."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Développe un cavalier mais oublie la menace sur d4. Après ...exd4 Dxd4 Dxd4, le cavalier f3 cloué ne peut pas reprendre : les Blancs perdent un pion et les Noirs échangent les dames à leur avantage."
   },
   {
    "san": "Re1",
    "pourquoi": "Semble naturel après le roque mais la tour laisse la dame seule. Les Noirs jouent ...Fxf3 Dxf3 Dxd4 : le pion d4 tombe sans compensation car plus rien ne le protège."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O",
  "nom": "Défense Steinitz différée (Espagnole, 4...d6)",
  "sens": "Le roque blanc vient de mettre le roi à l'abri avant d'ouvrir le centre. Les Noirs doivent faire pareil : finir le développement et roquer, car le centre (d4 contre e5) peut s'ouvrir à tout moment et un roi resté en e8 serait exposé.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant que le centre ne s'ouvre. Relie les tours. Si les Blancs jouent dxe5 ensuite, dxe5 reprend tranquillement, et Te1 n'inquiète plus un roi déjà roqué."
   },
   {
    "san": "Bd7",
    "pourquoi": "Rompt le clouage possible sur c6 et libère la case c8. Prépare O-O coup suivant. Laisse aux Blancs le choix d'ouvrir le centre, mais c6 est désormais bien protégé."
   },
   {
    "san": "exd4",
    "pourquoi": "Supprime la tension au centre : après cxd4 les Noirs n'ont plus à surveiller e5. Attention : cela donne aux Blancs un beau centre (d4-e4) ; à ne jouer que si l'on veut un jeu plus simple."
   }
  ],
  "erreurs": [
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier mais oublie le centre : 7...Fg4 8.dxe5 Fxf3 9.Dxf3 et les Noirs perdent le pion e5 ou doivent abandonner la paire de fous dans une mauvaise position."
   },
   {
    "san": "g6",
    "pourquoi": "Coup lent qui ignore la tension : 8.dxe5 Cxe4 9.Cd4 et le cavalier e4 est en l'air, le roi noir reste au centre face à des pièces blanches déjà développées."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -22
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6",
  "nom": "Partie espagnole, défense berlinoise (finale berlinoise)",
  "sens": "reprend le fou en ouvrant la diagonale du fou c8 et la colonne d pour la dame : la structure c6-c7 est doublée mais les Noirs gagnent de l'activité.",
  "menace": "Le pion e5 est attaqué par d4 ; sans réaction, les Noirs jouent exd4 et gagnent un pion central.",
  "plan": [
   {
    "san": "dxe5",
    "pourquoi": "Récupère le pion et chasse le cavalier d6 : après Cf4, Dxd8+ Rxd8 les dames disparaissent. Les Noirs perdent le roque, les Blancs ont une majorité à l'aile roi (e5 avancé) et une structure saine. C'est le seul bon coup ici."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "Semble naturel sur la colonne e, mais les Noirs répondent e4 : le pion avance gagné de temps, cloue le cavalier f3 et f5 vient le soutenir. Les Blancs ont un pion de moins sans compensation."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe une pièce, mais oublie e5 : après e4 le cavalier f3 doit fuir et les Noirs gardent un pion de plus avec f5 pour consolider. Il fallait d'abord reprendre en e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5",
  "sens": "Ouvre la colonne d et attaque le pion f6. Le pion e5 menace de prendre en f6, et la dame d1 vise maintenant la dame d8 : les Noirs doivent répondre à deux problèmes en même temps.",
  "menace": "exf6 (gagne un pion) et Dxd8+ (échange forcé qui abîme la coordination noire).",
  "plan": [
   {
    "san": "Qxd1",
    "pourquoi": "Seul bon coup. Les Noirs échangent les dames eux-mêmes, au bon moment : après Txd1 fxe5, le pion f6 est sauvé et le cavalier f3 ne peut toujours pas prendre e5, car le fou g4 viserait alors la tour d1. La position est simplifiée, la structure noire reste solide, les deux fous compensent le pion doublé. Les Blancs gardent un petit plus, rien de plus."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "Garde la dame mais oublie f6 : exf6 Dxf6, puis h3 chasse le fou. Les Noirs ont perdu un pion pour rien et leur roi est moins bien abrité."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe une pièce mais laisse tomber f6 : exf6 gxf6 détruit la structure noire, et h3 force encore le fou à reculer. Un pion de moins et un roi exposé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O",
  "nom": "Partie espagnole, défense Steinitz différée (variante avec c3 et d4)",
  "sens": "Met le roi à l'abri avant que le centre ne s'ouvre et relie les tours. Les Noirs sont prêts à répondre à dxe5 par dxe5 sans crainte, et à activer leur tour en e8 ou leur cavalier via d7.",
  "menace": "Aucune menace directe. Mais Cxe4 commence à peser : si le pion e4 n'est pas protégé, le cavalier le prend et Fxc6 bxc6 ne récupère rien.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Protège e4, la cible la plus sensible des Blancs. La tour appuie aussi une future poussée au centre et libère la case f1 pour le fou. Les Noirs répondent souvent b5 et Fb7, ou Fd7 et Te8."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe en couvrant e4 une deuxième fois. Le cavalier vise ensuite f1 puis g3 pour attaquer le roi noir. Le fou c1 reste enfermé un moment, c'est le prix à payer."
   },
   {
    "san": "Bc2",
    "pourquoi": "Retire le fou de la prise b5 et le place sur la diagonale b1-h7, tourné vers le roi noir. Le pion e4 est alors défendu par le fou. Les Noirs gagnent un temps pour jouer Te8 ou b5 et Fb7."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Coup de prudence qui ne défend rien d'important. Les Noirs jouent Cxe4 et prennent un pion au centre : après Fxc6 bxc6, les Blancs n'ont rien récupéré. Avant de jouer h3, il faut d'abord protéger e4."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe un fou mais oublie e4. Cxe4 gagne le pion : si Fxc6 bxc6, le cavalier noir reste en e4 bien campé. Mieux vaut Te1 ou Cbd2 pour défendre le centre d'abord."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5",
  "nom": "Espagnole ouverte, variante Berlin (ligne principale)",
  "sens": "reprend le pion e5 et attaque le cavalier d6 : le fou noir f8 est enfermé derrière lui, donc le cavalier doit bouger tout de suite, et après son départ la dame d1 regarde la dame d8.",
  "menace": "exd6, qui gagne le cavalier d6 (il n'a plus de case saine après Qxd8+ car tout échange en d6 est perdant).",
  "plan": [
   {
    "san": "Nf5",
    "pourquoi": "La seule bonne case : le cavalier sort de la prise, surveille d4 et e7 et ne gêne pas le fou f8. Les Blancs jouent alors Qxd8+ Kxd8 : les dames disparaissent, les Noirs perdent le roque mais ont les deux fous et le pion e5 isolé devant eux. Position célèbre, tenable avec Ke8, Be7 et h5 pour installer le cavalier."
   }
  ],
  "erreurs": [
   {
    "san": "Ne4",
    "pourquoi": "Le cavalier revient au centre mais il n'est pas défendu : Qe2 l'attaque et menace Rd1 avec la dame noire face à la colonne d. Après Bf5 Rd1, les Blancs gagnent du temps et presque un pion ; la case e4 n'est pas sûre."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe un fou mais oublie la menace : exd6 prend le cavalier, et après Qxd6 Qe2 les Noirs ont donné une pièce entière pour un pion. Il faut d'abord sauver le cavalier, développer ensuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1",
  "nom": "Partie espagnole, défense Steinitz différée (variante avec 4...d6)",
  "sens": "renforce e4 par la tour pour que le centre tienne même si le cavalier f3 bouge ou s'échange. La tour appuie une future poussée d4-d5 ou e4-e5, et la case f1 se libère pour que le fou a4 puisse reculer plus tard. Les Blancs ont fini leur développement du petit côté et attendent de voir comment les Noirs résolvent la pression sur e5.",
  "plan": [
   {
    "san": "b5",
    "pourquoi": "chasse le fou a4 : il doit aller en c2 ou b3, et il ne regarde plus le cavalier c6 ni la case d7. Après b5, le fou c8 ira en b7 pour viser e4 le long de la diagonale. Cela coûte un peu de temps et fixe les pions b5 et a6, qu'une poussée a4 des Blancs pourra attaquer plus tard."
   },
   {
    "san": "exd4",
    "pourquoi": "règle tout de suite la tension au centre : après cxd4, les Blancs ont un centre fort avec d4 et e4, mais le cavalier c6 va en b4 ou en a5 et la colonne e reste disputée. Simple et solide pour un débutant qui ne veut pas vivre sous la menace permanente de dxe5."
   },
   {
    "san": "Re8",
    "pourquoi": "défend e5 par la tour et prépare Bf8, le schéma classique de l'Espagnole fermée : les Noirs gardent un pion en e5 et attendent. Le fou e7 est encore un peu passif, et il faut penser à Bd7 pour éviter que Bxc6 abîme les pions."
   }
  ],
  "erreurs": [
   {
    "san": "Na5",
    "pourquoi": "le cavalier quitte c6 au moment où il défend e5 : dxe5 dxe5 Nxe5 et les Noirs ont perdu le pion central. Un cavalier en a5, au bord, ne fait rien et peut même être coincé par b4. Avant toute aventure en a5, il faut d'abord jouer b5 pour chasser le fou."
   },
   {
    "san": "h6",
    "pourquoi": "un coup de pion sur l'aile sans rapport avec le centre : Bxc6 bxc6 dxe5 et les pions noirs c6 et d6 deviennent faibles, le pion e5 tombe ou se transforme en gros problème. Dans cette structure, chaque coup doit servir à tenir e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1",
  "sens": "Prend la dame blanche et force l'échange des dames au bon moment : la tour f1 devra reprendre en d1, et pendant ce temps le pion f6 pourra reprendre en e5. Les Noirs simplifient pour atteindre une finale solide avec les deux fous.",
  "menace": "La dame noire en d1 attaque la tour f1 : si les Blancs ne reprennent pas, ils perdent une pièce entière.",
  "plan": [
   {
    "san": "Rxd1",
    "pourquoi": "Le seul coup. On reprend la dame avec la tour. Après fxe5, le cavalier f3 ne peut toujours pas prendre e5, car le fou g4 clouerait le cavalier sur la tour d1. Les Blancs gardent un léger avantage grâce au pion doublé noir, mais la partie est à peu près égale."
   }
  ],
  "erreurs": [
   {
    "san": "exf6",
    "pourquoi": "On ignore la dame pour prendre un pion. Les Noirs répondent Fxf3 : le fou attaque la tour f1 et défend la dame d1. Après Txd1 Fxd1, les Blancs ont perdu une tour pour un pion. Toujours reprendre la dame d'abord."
   },
   {
    "san": "Nc3",
    "pourquoi": "On développe sans regarder ce qui se passe. La dame noire recule simplement en d8 et reste en vie : les Blancs ont donné leur dame pour rien. Avant tout développement, il faut vérifier qu'une pièce n'est pas en prise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 10
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5",
  "nom": "Espagnole ouverte (variante principale)",
  "sens": "Reprend le pion et installe un pion avancé en e5 : il prive le cavalier f6 de sa case naturelle et coupe la position noire en deux. Le fou b3 vise maintenant d5 à travers la diagonale.",
  "menace": "Le pion d5 est attaqué par le fou b3 et la dame d1. S'il tombe, le cavalier e4 se retrouve sans soutien.",
  "plan": [
   {
    "san": "Be6",
    "pourquoi": "Défend d5 une fois pour toutes et neutralise le fou b3. Le fou sort en même temps : les Noirs pourront ensuite jouer Bc5 ou Be7 puis roquer. Les Blancs garderont la pression avec c3, Nbd2 et le pion e5 qui gêne, mais la position reste jouable."
   }
  ],
  "erreurs": [
   {
    "san": "Nc5",
    "pourquoi": "Le cavalier quitte e4 sans défendre d5. Les Blancs jouent simplement Bxd5 : le fou prend le pion central et attaque la tour a8. Après Bb7 Nc3, les Noirs ont perdu un pion et un temps."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Prendre e5 laisse d5 sans défense : Qxd5 Qxd5 Bxd5 et le fou b3 regagne le pion en attaquant la tour a8 et le cavalier e4. Les Noirs perdent du matériel."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -46
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3",
  "nom": "Partie espagnole, défense Steinitz différée (ligne 5.d4 b5)",
  "sens": "propose un échange de pions : si le pion d4 reste, cxd4 le reprendra sans fermer la diagonale du fou b3, et le centre blanc sera reconstruit avec un pion de plus au milieu.",
  "menace": "cxd4 : reprendre le pion en gardant un centre solide (e4, d4) et la pression du fou b3 sur f7.",
  "plan": [
   {
    "san": "dxc3",
    "pourquoi": "prend le pion offert : les Noirs ont un pion de plus. Après Cxc3, les Blancs ont de l'avance en développement, mais rien de concret. Il faudra ensuite développer vite (Cf6, Fe7, 0-0) pour ne pas se faire rattraper."
   },
   {
    "san": "Nf6",
    "pourquoi": "développe en attaquant e4. Les Noirs refusent de prendre tout de suite : si cxd4, le centre blanc existe mais le cavalier f6 et le pion d6 le surveillent déjà."
   },
   {
    "san": "c5",
    "pourquoi": "garde le pion d4 en le soutenant par c5. Les Noirs prennent de l'espace à l'aile dame, mais la case d5 est affaiblie : le fou b3 et un cavalier pourront s'y installer."
   }
  ],
  "erreurs": [
   {
    "san": "Rb8",
    "pourquoi": "coup de tour passif qui ne fait rien pour le centre. Les Blancs jouent cxd4, récupèrent le pion et roquent : ils ont le centre et une pièce de plus en jeu, la tour b8 ne sert à rien."
   },
   {
    "san": "a5",
    "pourquoi": "chasse le fou avec a5-a4, mais oublie le centre : cxd4 d'abord, puis après a4 le fou va simplement en c2. Les Blancs ont le centre, les Noirs ont perdu deux temps avec un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -3
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5",
  "nom": "Variante berlinoise (défense berlinoise), finale berlinoise",
  "sens": "Met le cavalier à l'abri sur sa seule bonne case : il quitte d6 où il était attaqué par le pion e5, surveille d4 et e7, et laisse libre la diagonale du fou f8.",
  "plan": [
   {
    "san": "Qxd8+",
    "pourquoi": "Échange les dames et force le roi noir à reprendre en d8 : les Noirs perdent le droit de roquer et leur roi gêne leurs propres pièces. Les Blancs obtiennent la célèbre finale berlinoise, avec un pion e5 avancé et une majorité de 4 pions contre 3 à l'aile roi. En échange, les Noirs gardent les deux fous et une structure solide."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe une pièce avant d'échanger et laisse les Noirs décider. Si Dxd1 Txd1, la finale est la même qu'après Qxd8+ mais avec le cavalier déjà sorti. Le cavalier regarde e4 et d5 et prépare éventuellement Ce4 ou Ce2."
   },
   {
    "san": "Qe2",
    "pourquoi": "Garde les dames en jeu pour un moment et protège e5 tout en surveillant la colonne e. Les Noirs peuvent échanger quand même par Dd4 ou développer avec Fe7, mais les Blancs restent souples : Td1 ou Cc3 viennent ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "Sort le fou mais oublie que c'est aux Noirs d'échanger : après Dxd1 Txd1, le roi noir reste en e8 et garde son roque. Le fou en f4 est aussi une cible pour g5 plus tard. On a perdu le gain de temps que donnait Qxd8+."
   },
   {
    "san": "Qe1",
    "pourquoi": "Veut garder la dame tout en soutenant e5, mais la dame est mal placée : Nd4 attaque la case f3 et après Qe4 Nxf3+ les Blancs doivent reprendre avec un pion et abîmer leur roque. Mieux vaut échanger tout de suite ou jouer Qe2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 12
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1 b5",
  "nom": "Partie espagnole, défense Steinitz différée (ligne avec ...b5)",
  "sens": "attaque le fou a4 avec le pion pour le forcer à reculer : il quittera la diagonale qui vise c6 et d7, et le fou c8 pourra ensuite sortir en b7 pour viser le pion e4.",
  "menace": "prendre le fou en a4 avec le pion b5 (bxa4), gagnant une pièce.",
  "plan": [
   {
    "san": "Bc2",
    "pourquoi": "Le fou se met à l'abri en c2, derrière le pion d4 et devant la dame. De là, il regarde toujours la case e4 et vise la diagonale vers h7 si le pion e4 avance un jour. Le centre d4-e4 reste solide : les Blancs gardent l'avantage d'espace."
   },
   {
    "san": "Bb3",
    "pourquoi": "Le fou recule en b3 et vise la case f7 et la diagonale a2-g8. Un petit défaut : les Noirs peuvent le gêner plus tard avec ...Na5 ou ...Be6 pour l'échanger. Le fou reste actif, mais c2 est souvent plus tranquille."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "Développer le cavalier oublie que le fou a4 est attaqué. Après ...bxa4, la dame reprend en a4 mais les Blancs ont donné un fou pour un pion. Avant toute chose, il faut sauver la pièce menacée."
   },
   {
    "san": "Bxb5",
    "pourquoi": "Prendre le pion b5 ne marche pas : ...axb5 reprend le fou et les Noirs gagnent une pièce contre un pion. Le pion b5 est bien défendu par a6 ; il ne faut pas se jeter dessus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1",
  "nom": "Variante d'échange, ligne 5...f6",
  "sens": "Reprend la dame avec la tour pour garder la paire de pions e4-e5 et ouvrir la colonne d : la tour d1 vise déjà d7 et d8, et le cavalier f3 reste défendu.",
  "menace": "Rien d'immédiat. Mais si les Noirs tardent, exf6 suivi de Cxe5 ou Fe3 donne aux Blancs un pion de plus ou un gros avantage de développement.",
  "plan": [
   {
    "san": "fxe5",
    "pourquoi": "Récupère tout de suite le pion e5. Le cavalier f3 ne peut toujours pas le reprendre : après Cxe5, Fxd1 gagne la tour grâce au clouage sur d1. Les Noirs gardent leurs deux fous, les Blancs un pion doublé à exploiter. Partie à peu près égale."
   },
   {
    "san": "Bxf3",
    "pourquoi": "Élimine le cavalier qui attaquait e5 avant de reprendre. Après gxf3 fxe5, les Blancs ont des pions f doublés, mais les Noirs ont cédé la paire de fous et le roi blanc peut utiliser la colonne g. Plus simple, un peu moins ambitieux."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développe sans reprendre e5. Les Blancs jouent exf6 : après Cxf6, Cc3 et le pion e4 est protégé, les Blancs ont un pion de plus et un meilleur développement. Il fallait d'abord reprendre."
   },
   {
    "san": "f5",
    "pourquoi": "Attaque e4 mais oublie le pion e5 déjà perdu. Après h3 Fxf3 gxf3, les Blancs gardent leur pion de plus, et le fou noir a dû se donner contre le cavalier. Reprendre sur e5 valait mieux."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6",
  "nom": "Espagnole ouverte, ligne principale",
  "sens": "Protège le pion d5 en développant une pièce : le fou bloque aussi la diagonale du fou b3 vers f7. Les Noirs préparent Fe7 ou Fc5, puis le roque.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Donne au fou b3 une case de repli en c2 et contrôle d4 : le cavalier c6 ne pourra pas s'y installer. Prépare Cbd2 pour chasser le cavalier e4. Laisse aux Noirs le temps de jouer Fc5 ou Fe7 et de roquer."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Attaque le cavalier e4, bien centré mais isolé. S'il recule ou prend en d2, les Blancs gardent le pion e5 qui gêne le roi noir. Attention : le cavalier e4 peut aussi aller en c5 et viser le fou b3."
   },
   {
    "san": "Qe2",
    "pourquoi": "Développe la dame et regarde le cavalier e4 : avec Td1 ensuite, la pression sur d5 augmente. Laisse les Noirs terminer leur développement sans gêne immédiate."
   }
  ],
  "erreurs": [
   {
    "san": "Kh1",
    "pourquoi": "Coup d'attente qui ne fait rien : le roi était déjà en sécurité. Les Noirs jouent Fe7 et roquent tranquillement, ils ont gagné un temps gratuit alors que les Blancs devaient agir vite contre e4 et d5."
   },
   {
    "san": "Qd3",
    "pourquoi": "La dame se place sur une case attaquable : après Cc5 elle doit fuir, et le cavalier prend ensuite le bon fou b3. Les Blancs perdent leur meilleure pièce d'attaque et deux temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3 dxc3",
  "nom": "Partie espagnole, variante Noah's Ark différée (prise sur d4)",
  "sens": "continue la rafle : le pion c3 est pris lui aussi et, s'il n'est pas repris tout de suite, il avancera sur b2 pour fourcher le fou c1 et la tour a1. Les Noirs misent tout sur le matériel, au prix d'un retard de développement énorme.",
  "menace": "cxb2, qui attaque à la fois le fou c1 et la tour a1 et gagne encore du matériel.",
  "plan": [
   {
    "san": "Qd5",
    "pourquoi": "coup fort et direct : la dame attaque la tour a8 ET le pion f7, déjà visé par le fou b3. Les Noirs doivent parer avec Be6, et la dame reprend ensuite tranquillement le pion c3 (ou revient par Qc6+). Les Blancs récupèrent le matériel tout en gardant leur avance de développement."
   },
   {
    "san": "Nxc3",
    "pourquoi": "le coup naturel : il reprend le pion en développant une pièce et bloque la menace cxb2. Le cavalier regarde d5 et b5. Les Blancs restent à un pion de moins mais toutes leurs pièces sortent vite, alors que les Noirs n'ont encore rien développé."
   },
   {
    "san": "a4",
    "pourquoi": "attaque la chaîne b5 avant de reprendre sur c3. Si b5 tombe ou doit avancer, la colonne a s'ouvre pour la tour. Les Noirs n'ont pas le temps de jouer cxb2 : après Nxc3 ensuite la position noire est pleine de trous."
   }
  ],
  "erreurs": [
   {
    "san": "bxc3",
    "pourquoi": "reprend avec le pion « pour garder le cavalier à sa place » : mauvais. La structure blanche est cassée (pions a2 et c3 isolés, colonne b ouverte sur rien) et surtout les Noirs jouent Bb7 : le fou vise e4, qui n'a plus de pion c3 pour le soutenir indirectement. Après Nf6 le pion e4 tombe ou coûte des concessions."
   },
   {
    "san": "Qh5",
    "pourquoi": "tente le mat du berger sur f7 avec le fou b3. Mais Qd7 défend f7 sans problème, puis Nf6 chasse la dame avec gain de temps. Les Blancs ont perdu deux coups et le pion c3 est toujours là : après cxb2, c'est la catastrophe."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1 b5 Bc2",
  "nom": "Défense Steinitz différée (Espagnole avec ...d6 et ...b5)",
  "sens": "sauve le fou attaqué par le pion b5 en le rangeant à l'abri, sans perdre le contrôle de la diagonale b1-h7 ni le soutien du centre d4-e4.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Échange au centre avant que les Blancs n'avancent d5 ou ne jouent h3 et Cbd2 tranquillement. Après cxd4, le pion e4 n'est plus protégé par un pion : les Noirs le visent avec Te8 et Fb7, et le cavalier c6 peut sauter en b4 pour harceler le fou c2. On cède un peu d'espace, mais on obtient du jeu contre le centre blanc."
   },
   {
    "san": "Re8",
    "pourquoi": "Met la tour en face du roi blanc et du pion e4. Elle prépare ...Ff8 et ...exd4 au bon moment. Les Blancs gardent leur centre, mais ils doivent désormais le défendre avant d'attaquer."
   },
   {
    "san": "Bb7",
    "pourquoi": "Le fou sort sur la grande diagonale et regarde e4 à travers le cavalier f6. Il soutient aussi l'avance ...d5 plus tard. Les Blancs répondront probablement Cbd2 pour couvrir e4 : la partie reste équilibrée mais longue."
   }
  ],
  "erreurs": [
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier vise f2 et h2, mais il n'y a rien à attaquer : après h3 il doit rentrer en f6 et les Noirs ont perdu deux temps. Les Blancs jouent Cbd2 et développent gratuitement."
   },
   {
    "san": "Nd7",
    "pourquoi": "Le cavalier quitte f6 et ne surveille plus e4 ni les cases g4 et d5. Les Blancs jouent Cbd2 puis a4 : le pion b5 devient une cible, et la colonne a s'ouvre pour la tour blanche. Les Noirs n'ont rien gagné en échange."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+",
  "nom": "Partie espagnole, défense berlinoise, finale berlinoise",
  "sens": "Force l'échange des dames et oblige le roi noir à reprendre en d8 : les Noirs perdent le roque et leur roi reste au centre, devant ses propres pièces.",
  "plan": [
   {
    "san": "Kxd8",
    "pourquoi": "Le seul coup : la dame est en prise et le roi doit la reprendre. Ensuite, les Noirs jouent Ke8 ou Kc8 pour sortir le roi de la colonne d, puis développent les fous (…Be7, …Be6) et le roi vers l'aile dame. Le pion e5 blanc est avancé mais les Noirs gardent les deux fous et une structure sans faiblesse réelle."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3",
  "nom": "Partie espagnole, défense ouverte (ligne principale 9.c3)",
  "sens": "Offre au fou b3 une case de repli en c2 et prend le contrôle de d4 : le cavalier c6 ne pourra plus s'y installer. Prépare Cbd2 pour chasser le cavalier e4. Laisse aux Noirs le temps de développer le fou roi et de roquer.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, en visant f2 à côté du roi blanc. Permet de roquer au coup suivant. Si les Blancs jouent Cbd2, le cavalier e4 pourra prendre en d2 ou reculer sans gêne. Laisse aux Blancs le temps de jouer Cbd2 ou Fc2."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe plus modestement mais solidement : le fou ne peut pas être attaqué et le roque suivra tout de suite. Le centre d5-e4 reste bien tenu. Laisse aux Blancs Cbd2 ou Fc2 sans contre-jeu immédiat sur f2."
   }
  ],
  "erreurs": [
   {
    "san": "Nc5",
    "pourquoi": "Recule le cavalier avant qu'il ne soit chassé : c'est une perte de temps. Les Blancs jouent Fc2 puis Cbd2 en gardant toutes leurs pièces, et le centre noir (d5) devient une cible. Le fou f8 n'est toujours pas développé et le roque est retardé."
   },
   {
    "san": "f6",
    "pourquoi": "Veut attaquer le pion e5, mais affaiblit la diagonale a2-g8 où le fou b3 vise déjà d5 et le roi. Après Cbd2, le cavalier e4 doit fuir en c5, puis Cd4 saute au centre : les Noirs reculent partout alors que leur roi n'est pas encore à l'abri."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1 fxe5",
  "sens": "Rétablit l'équilibre matériel et garde le clouage : le fou g4 cloue le cavalier f3 sur la tour d1, ce qui empêche Cxe5. Les Noirs misent sur leurs deux fous, les Blancs sur la meilleure structure (le pion doublé c6-c7 ne vaut qu'un demi-pion).",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe en déclouant : la tour d1 est maintenant protégée, donc Cxe5 redevient possible au coup suivant. Le cavalier peut aussi aller en c4 pour viser e5. Inconvénient : il bloque un moment le fou c1, qu'il faudra sortir par b3 ou après Cc4."
   },
   {
    "san": "Rd3",
    "pourquoi": "Sort la tour du clouage tout en la gardant sur la colonne d, la seule ouverte. Elle peut ensuite doubler avec Td1 ou soutenir Cxe5. Attention : la tour en d3 est exposée, il faut garder un œil sur ...Fe6 et ...Fc4."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe simplement et prépare Cbd2 puis Td2 pour relier les tours. Le fou contrôle la case d4 et la diagonale vers a7 ; il laisse pour l'instant le clouage en place, ce qui n'est pas grave puisque rien ne presse."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3 dxc3 Qd5",
  "sens": "Crée une double attaque : la dame vise la tour a8 (sans défense) et le pion f7, déjà pris en ligne de mire par le fou b3. Les Noirs ne peuvent pas tout sauver sans un coup précis.",
  "menace": "Dxf7 mat (la dame est soutenue par le fou b3), et sinon Dxa8 qui gagne la tour.",
  "plan": [
   {
    "san": "Be6",
    "pourquoi": "Le seul coup. Le fou bloque la diagonale du fou b3 et protège f7, tout en coupant la dame de la tour a8 : la dame blanche ne voit plus ni f7 ni a8. Les Blancs reprennent ensuite le pion c3 (Dxc3 ou Cxc3) et récupèrent leur matériel, mais les Noirs ont un pion de plus et une position tenable."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développe une pièce mais oublie la double attaque : Dxa8 gagne la tour. Les Noirs prennent cxb2, mais Fxb2 et ils ont une tour de moins."
   },
   {
    "san": "f6",
    "pourquoi": "Tente de fermer la diagonale avec un pion, mais c'est faux : la dame prend f7 et c'est mat, car le roi e8 est bloqué et la dame est défendue par le fou b3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1 b5 Bc2 exd4",
  "sens": "prend le pion d4 pour casser le centre blanc avant qu'il ne roule : le pion e5 disparaît, et le pion e4 ne sera bientôt plus défendu par un pion.",
  "menace": "si les Blancs ne reprennent pas, le pion d4 prend en c3 et les Noirs gardent un pion de plus.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "reprend avec le pion et garde le gros centre d4-e4. Les Blancs vont ensuite jouer Cc3 ou Cbd2 et h3 pour tout protéger. Ils laissent aux Noirs des cibles (e4, et la case b4 pour le cavalier contre le fou c2), mais ils ont l'espace."
   },
   {
    "san": "Nxd4",
    "pourquoi": "reprend avec le cavalier et évite d'avoir un centre à défendre : après Cxd4, le cavalier central est solide et e4 reste gardé par la pièce. Le centre est plus calme, le jeu plus simple, mais les Blancs renoncent à l'avantage d'espace."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "coup tranquille joué par habitude, mais il oublie de reprendre : dxc3 Cxc3 et les Blancs ont perdu leur pion central d4 pour rien ; le cavalier noir vient ensuite en e5 et les Noirs sont mieux."
   },
   {
    "san": "Bg5",
    "pourquoi": "cloue le cavalier f6 mais ne reprend pas le pion : dxc3 Cxc3 Ce5 et le centre blanc a disparu, les Noirs ont un pion de mieux dans la structure."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 33
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5",
  "nom": "Espagnole ouverte, variante classique (9...Fc5)",
  "sens": "Place le fou sur la diagonale qui vise f2, juste à côté du roi blanc, et prépare le roque au coup suivant. Le cavalier e4 reste bien soutenu par le pion d5.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Attaque le cavalier e4, la pièce noire la plus active. Si les Noirs prennent en d2, la dame reprend et les Blancs achèvent leur développement sans faiblesse. Laisse aux Noirs le choix de roquer ou de jouer ...f5 pour tenir le cavalier."
   },
   {
    "san": "Qd3",
    "pourquoi": "Sort la dame sur une case active : elle regarde le cavalier e4 et, avec le fou b3, le pion d5. Prépare Cbd2 ou Fc2 sans perdre de temps. Laisse aux Noirs le temps de roquer."
   },
   {
    "san": "Bc2",
    "pourquoi": "Reprend la diagonale b1-h7 contre le cavalier e4 et le futur roi noir. Fait de la place au pion b pour que le cavalier b1 sorte confortablement en d2. Cède un peu de pression sur d5."
   }
  ],
  "erreurs": [
   {
    "san": "Na3",
    "pourquoi": "Le cavalier va sur le bord et le fou c5 le prend aussitôt : après bxa3, les pions blancs de l'aile dame sont doublés et abîmés, et les Noirs roquent tranquillement."
   },
   {
    "san": "h3",
    "pourquoi": "Coup de précaution inutile : rien ne menace g4. Les Noirs roquent et jouent ...Te8, et l'avantage de développement passe de leur côté avant que les Blancs n'aient sorti le cavalier b1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8",
  "nom": "Variante berlinoise, finale berlinoise (le « mur de Berlin »)",
  "sens": "Reprend la dame avec le roi, faute de mieux : les Noirs perdent le droit de roquer et leur roi reste pour l'instant sur la colonne d, mais ils gardent la paire de fous et une structure solide.",
  "plan": [
   {
    "san": "Rd1+",
    "pourquoi": "Profite tout de suite du roi sur la colonne d : l'échec force le roi à bouger (…Ke8 ou …Kc8) et la tour s'installe sur la colonne ouverte avant que le fou noir ne vienne la contester. Ne gagne rien de concret, mais gêne le développement noir."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier vers e4 et d5, cases fortes grâce aux pions noirs doublés en c6/c7. Prépare Rd1+ et Bg5+ au bon moment. Laisse aux Noirs le temps de jouer …Ke8 et …Be7."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : retire g4 au fou c8 et prépare g4 pour chasser le cavalier f5, bien placé. Les Blancs ne se pressent pas, car la structure noire ne changera pas."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3 dxc3 Qd5 Be6",
  "sens": "Attaque la dame blanche et coupe en même temps ses deux cibles : le fou se met sur la diagonale b3-g8, donc la dame ne voit plus f7, et il bouche aussi la diagonale a8-d5, donc elle ne voit plus la tour a8. Le pion c3 reste en prise, mais les Blancs n'ont pas le temps de le reprendre.",
  "menace": "...Bxd5 : la dame blanche est attaquée et doit bouger tout de suite. Si elle quitte la case d5 sans donner d'échec, les Noirs jouent ...cxb2 et gardent deux pions de plus.",
  "plan": [
   {
    "san": "Qc6+",
    "pourquoi": "Le seul coup qui tient. L'échec oblige les Noirs à répondre ...Bd7 (revenir en e6 n'est plus possible, le roi est en échec). La dame retourne alors en d5, le fou revient en e6, et la dame redonne l'échec en c6 : les deux camps répètent les coups et la partie est nulle. Pour les Blancs, qui ont déjà un pion de moins, c'est un bon résultat : tout autre coup de dame perd au moins un deuxième pion."
   }
  ],
  "erreurs": [
   {
    "san": "Qxa8",
    "pourquoi": "La dame prend la tour… mais le fou e6 ne bloque plus rien une fois la dame passée en a8, et surtout la dame est tout simplement reprise : ...Qxa8. Les Blancs ont donné une dame (9 points) pour une tour (5 points) et le pion c3 est toujours là. Partie perdue."
   },
   {
    "san": "Qd3",
    "pourquoi": "Retraite naturelle, mais sans échec : les Noirs jouent ...cxb2 et après Bxb2 ils ont deux pions de plus, avec un développement facile (...Nf6, ...Be7, roque). Même problème pour Qd1, Qd4, Qb7 ou Qh5 : seule la dame en c6 avec échec force les Noirs à répondre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1 fxe5 Nbd2",
  "sens": "Développe le cavalier en protégeant la tour d1 : le clouage du cavalier f3 ne gêne plus, et le cavalier d2 vise c4 pour attaquer e5 une deuxième fois.",
  "menace": "Cc4 suivi de Ccxe5 : le pion e5 serait attaqué deux fois, et Cfxe5 devient aussi jouable puisque Fxd1 se heurte à Txd1.",
  "plan": [
   {
    "san": "O-O-O",
    "pourquoi": "Met le roi à l'abri et place la tour sur la colonne d ouverte, face à la tour d1. Les Noirs proposent l'échange des tours : avec la paire de fous et un centre solide, la finale leur convient. Le roi en c8 surveille aussi d7 et b7."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant le pion e4 : les Blancs doivent y penser avant de jouer Cc4. Le cavalier prépare aussi le petit roque et défend les cases d5 et d7. Il laisse e5 à la garde du fou, qu'il faudra renforcer par Fd6 ensuite."
   },
   {
    "san": "Bd6",
    "pourquoi": "Défend e5 une fois pour toutes : Cc4 ne gagnera plus de pion. Le fou est bien placé sur la diagonale b8-h2 et le roque devient possible. Inconvénient : il bouche la colonne d pour une future tour d8."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou vise f2, mais oublie e5. Après Cc4 Cf6 Ccxe5, le pion tombe : f3 n'est plus vraiment cloué, car Fxd1 Txd1 laisse les Blancs très bien placés. Un pion de perdu pour un fou actif mais isolé."
   },
   {
    "san": "Bh5",
    "pourquoi": "Recule le fou sans rien faire : le clouage ne menace plus rien depuis Cbd2. Après Cc4 Cf6 Ccxe5, les Blancs gagnent le pion e5, et le fou h5 est hors jeu. Un coup de tempo perdu, puis un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -20
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1 b5 Bc2 exd4 cxd4",
  "nom": "Partie espagnole, variante Steinitz différée avec ...b5 (centre d4-e4 des Blancs)",
  "sens": "reprend avec le pion pour garder deux pions au centre, d4 et e4, et beaucoup d'espace. Le pion c3 a disparu : la case b4 n'est plus gardée, et le cavalier b1 peut enfin sortir en c3.",
  "plan": [
   {
    "san": "Nb4",
    "pourquoi": "le cavalier saute sur la case b4, que le pion c3 ne garde plus, et attaque le fou c2. Les Blancs doivent perdre un temps : Fb1, Fb3 ou Cc3 avec le fou pris. Ensuite les Noirs jouent ...c5 ou ...d5 pour attaquer le gros centre. Le seul bon coup : tout le reste laisse les Blancs jouer Cc3 tranquillement et le centre devient une force."
   }
  ],
  "erreurs": [
   {
    "san": "d5",
    "pourquoi": "attaque le centre trop tôt : après e5 le cavalier f6 doit bouger (Ce4) et Cc3 le chasse ou l'échange. Les Blancs gagnent du temps et gardent un pion e5 fort qui étouffe le roque noir."
   },
   {
    "san": "Bg4",
    "pourquoi": "cloue le cavalier f3, mais Cc3 puis Fe3 (ou h3) consolident tout : le fou ne gêne personne, et les Blancs gardent leur espace sans que les Noirs aient de contre-jeu. Pendant ce temps la case b4 n'a pas été exploitée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -32
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2",
  "nom": "Espagnole ouverte, variante classique (ligne principale avec 9...Fc5 10.Cbd2)",
  "sens": "attaque le cavalier e4 avec le dernier cavalier blanc à développer, sans créer de faiblesse. Si les Noirs échangent en d2, la dame reprend et les Blancs achèvent tranquillement leur développement.",
  "menace": "Cxe4 dxe4 suivi de Dxd8 : les Blancs échangent la pièce noire la plus active et gagnent du terrain au centre.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Le cavalier e4 reste en place : s'il est pris, le pion d5 reprend et pousse un pion blanc hors du centre. Après le roque, les Noirs sont prêts pour ...f6 ou ...Cxd2 selon la réaction des Blancs, avec un jeu actif et un bon centre."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd2",
    "pourquoi": "Échange la meilleure pièce noire alors que rien ne l'obligeait. Après Dxd2, les Blancs ont toutes leurs pièces sorties et le roi noir est encore au centre : a4 vient ensuite ouvrir l'aile dame et le pion d5 devient une cible."
   },
   {
    "san": "Bf5",
    "pourquoi": "Semble protéger le cavalier e4, mais Cxe4 Fxe4 e6 ! brise la position noire : le pion blanc fourche f7 et libère l'attaque sur le roi encore au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Rd1+",
  "nom": "Variante Berlinoise, finale berlinoise (le « mur de Berlin »)",
  "sens": "Met le roi noir en échec sur la colonne d pour l'obliger à quitter d8 et pour installer la tour sur la seule colonne ouverte avant que le fou de c8 ne puisse s'y opposer.",
  "menace": "Aucune menace directe : c'est un échec qui gagne un temps de développement, pas de matériel.",
  "plan": [
   {
    "san": "Ke8",
    "pourquoi": "Le roi recule sur e8, hors de la colonne d et à l'abri. Il garde la case e7 libre pour le fou f8, et le cavalier f5 reste protégé par le roi lui-même si besoin. Ensuite les Noirs jouent ...Be7, ...h6 ou ...Be6 et roquent « à la main » avec ...Kf8-g8 ; ce roi est très bien placé dans cette finale. Les Blancs gardent un léger avantage de structure (pions doublés noirs en c), rien de plus."
   }
  ],
  "erreurs": [
   {
    "san": "Ke7",
    "pourquoi": "Le roi avance sur la case du fou f8 et le bloque. Pire : après 10.g4 le cavalier f5 doit fuir sur h6, et 11.h3 le laisse enfermé dans le coin ; le roi en e7 gêne aussi ...Be7 pour le délivrer. Les Noirs perdent du temps et de l'espace."
   },
   {
    "san": "Nd6",
    "pourquoi": "Le cavalier se met sur la colonne de la tour, mais il est cloué sur le roi ! 10.exd6 gagne simplement le cavalier, et après 10...cxd6 11.Bf4 les Blancs ont une pièce de plus et attaquent d6. Toujours vérifier ce qui est cloué sur la colonne de l'échec."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3 dxc3 Qd5 Be6 Qc6+",
  "sens": "Donne échec pour gagner du temps : la dame attaque le roi et menace en même temps le fou e6 et le cavalier b8 inattaqués. Les Blancs, un pion de moins, cherchent la répétition de coups.",
  "menace": "Dxe6 (prendre le fou) ou Dxb8 (prendre le cavalier) si l'échec est mal paré.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Le fou bloque l'échec et protège b8 d'un coup. Les Blancs doivent reculer en d5 (sinon ils perdent la dame ou une pièce), le fou revient en e6, et la dame redonne l'échec en c6. Les Noirs peuvent accepter la nulle par répétition, mais avec un pion de plus ils peuvent aussi chercher mieux plus tard, par exemple en déviant avec ...Dd7 au bon moment."
   }
  ],
  "erreurs": [
   {
    "san": "Ke7",
    "pourquoi": "Le roi reste au milieu, bloqué devant ses propres pièces. Après Cxc3 les Blancs se développent avec menace, puis Dxc7+ ramasse un pion en gardant l'initiative : le roi noir sera harcelé toute la partie."
   },
   {
    "san": "Qd7",
    "pourquoi": "Semble naturel, mais la dame blanche file en a8 et attaque la tour h8 et le cavalier b8 en même temps. Après Dc8 (seul moyen de tout défendre), Dc6 recommence le manège : les Noirs n'ont rien gagné et perdent du matériel au prochain tour."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Nf6 d4 Be7 O-O O-O Re1 b5 Bc2 exd4 cxd4 Nb4",
  "sens": "Occupe la case b4 que le pion c3 ne garde plus et attaque le fou c2. Les Blancs doivent déplacer le fou ou accepter de le voir échangé, ce qui leur coûte un temps. Ensuite les Noirs frappent le centre avec ...c5 ou ...d5.",
  "menace": "Prendre le fou c2 avec le cavalier (Cxc2) et gagner la qualité : le fou est attaqué et n'est défendu que par la dame.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Le pion avance et le fou c2 n'est plus attaqué sur la diagonale ouverte qu'il faudrait défendre : le cavalier b4 n'a plus de bonne case en avant et le pion d5 prend de l'espace. Si le cavalier prend en c2, la dame le reprend. Les Blancs gardent le centre sans perdre de temps."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier au lieu de sauver le fou. Si les Noirs prennent Cxc2, la dame reprend : les Blancs ont donné le fou contre le cavalier, mais ils ont un coup de développement de plus et le gros centre d4-e4 tient bien."
   },
   {
    "san": "Bb3",
    "pourquoi": "Le fou s'écarte et regarde la diagonale a2-g8, vers la case f7. Le cavalier b4 reste un peu en l'air. Mais c'est un temps donné aux Noirs, qui peuvent jouer ...c5 ou ...d5 tout de suite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1 fxe5 Nbd2 O-O-O",
  "nom": "Variante d'échange, ligne 5...f6",
  "sens": "Met le roi en sécurité et place la tour sur la colonne d, en face de la tour blanche. Les Noirs sont prêts à échanger les tours : avec la paire de fous et le centre e5-c6, la finale leur sourit. Le fou g4 continue de peser sur le cavalier f3.",
  "menace": "...Fxf3 : si les Blancs reprennent gxf3, leur roque est démoli ; s'ils reprennent Cxf3, la tour d8 prend en d1 et le cavalier d2 n'est plus là pour tenir e4 et la colonne d.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Quitte la colonne d, donc plus d'échange forcé des tours, et défend le pion e4. Sur ...Fxf3, les Blancs reprennent tranquillement Cxf3 : le pion e5 est alors attaqué et le cavalier d2 n'était plus indispensable. Les Blancs gardent un petit avantage grâce à leur structure de pions saine côté roi."
   },
   {
    "san": "Kf1",
    "pourquoi": "Même idée : le roi protège la tour d1 et marche vers e2 pour soutenir f3. Après ...Fxf3, Cxf3 est possible sans perdre la colonne d. Le roi au centre ne craint rien car les dames sont parties."
   },
   {
    "san": "Rf1",
    "pourquoi": "Retire la tour de la colonne d et couvre f3 et f-colonne. Moins actif que Te1 (e4 n'est pas défendu), mais le fou g4 ne gagne plus rien en prenant en f3."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Chasser le fou semble naturel, mais il prend en f3 : ...Fxf3 et les Blancs doivent reprendre gxf3, car Cxf3 laisserait la tour d1 tomber après ...Txd1. Les pions du roque sont cassés, le roi g1 reste à l'air et les Noirs ont les deux fous."
   },
   {
    "san": "c3",
    "pourquoi": "Un coup d'attente qui ignore la menace : ...Fxf3 gxf3 et le roque blanc est ruiné pour rien. Il fallait d'abord bouger la tour d1 pour pouvoir reprendre du cavalier."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2 O-O",
  "nom": "Espagnole ouverte, variante classique (ou Variante Motzko / position de base après 10.Cbd2 O-O)",
  "sens": "Met le roi à l'abri avant tout : la tour f8 est prête à soutenir ...f6 contre le pion e5, et le cavalier e4 peut rester au centre tant que les Blancs ne le délogent pas.",
  "plan": [
   {
    "san": "Bc2",
    "pourquoi": "Attaque le cavalier e4 une deuxième fois (avec le cavalier d2). Les Noirs doivent réagir tout de suite : soit ...Cxd2 (et la dame blanche reprend en centralisant), soit ...f5 qui affaiblit la case e6 et la diagonale vers le roi noir. Le fou b3 quitte aussi la colonne du pion d5, donc il ne sera plus gêné par ...d4 ou ...Ca5."
   },
   {
    "san": "Qe2",
    "pourquoi": "Développe la dame en visant le cavalier e4 par rayons X derrière le cavalier d2, et prépare Td1 pour peser sur d5. Si les Noirs jouent ...Cxd2, le fou c1 reprend et se développe gratuitement. Laisse aux Noirs la possibilité de ...f6 pour casser e5, mais sans gain net."
   },
   {
    "san": "a4",
    "pourquoi": "Frappe l'aile dame tout de suite : le pion b5 est attaqué et ...b4 affaiblirait c4 et a6. Donne au cavalier d2 l'idée de Cb3 ensuite. Laisse cependant le centre noir tranquille un coup de plus, donc les Noirs peuvent jouer ...Cxd2 puis ...f6 sans crainte."
   }
  ],
  "erreurs": [
   {
    "san": "g3",
    "pourquoi": "Affaiblit gravement le roi blanc sans rien gagner. Les Noirs répondent ...Cxf2 ! : si la tour reprend en f2, le fou c5 et la poussée ...f6 ouvrent toute la colonne f sur le roi blanc, et les Noirs récupèrent largement le matériel avec une attaque gagnante."
   },
   {
    "san": "Nb1",
    "pourquoi": "Recule une pièce déjà développée pour un simple regroupement. Les Noirs gagnent un tempo avec ...h6 puis ...g5 et chassent le fou qui veut sortir en f4 ; le cavalier e4 reste installé au centre et les Blancs ont perdu deux coups pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Rd1+ Ke8",
  "nom": "Partie espagnole, variante ouverte, finale berlinoise (ligne 5.d4 Cd6 6.Fxc6 dxc6 7.dxe5)",
  "sens": "Sort le roi de la colonne d où la tour l'attaquait, sans bloquer le fou f8 : la case e7 reste libre. De là, le roi pourra aller en f8 puis g8 pour se mettre à l'abri à la main.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier vers e4 et d5, deux cases fortes dans cette finale. Prépare Ce4 ou Ce2-d4 pour chasser le cavalier f5. Laisse aux Noirs le temps de jouer ...Fe7 et ...h6."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou c8 et au cavalier f5 : les pièces noires ne viendront pas gêner le cavalier f3. Coup calme qui attend que les Noirs se décident."
   },
   {
    "san": "Bf4",
    "pourquoi": "Développe le fou en protégeant le pion e5, le point fort des Blancs. Prépare Cbd2-e4 ou Ce4 sans rien laisser en prise. Les Noirs répondent ...Fe7 ou ...h6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 c3 dxc3 Qd5 Be6 Qc6+ Bd7",
  "sens": "Pare l'échec avec le fou en protégeant b8 et la tour a8 d'un coup : la dame blanche n'a plus de cible et doit reculer.",
  "menace": "...Bxc6 : le fou prend la dame si elle reste en c6. Et ...cxb2 ramasse encore un pion.",
  "plan": [
   {
    "san": "Qd5",
    "pourquoi": "Seul bon coup. La dame revient attaquer la tour a8 et le pion f7, le fou noir rentre en e6, la dame redonne l'échec en c6 : les Blancs cherchent la répétition. Avec un pion de plus, les Noirs peuvent dévier plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "Qxc3",
    "pourquoi": "Tentant de reprendre le pion, mais la dame quitte l'attaque sur a8 et f7. Après ...Nf6 et ...Qe7, les Noirs développent avec tempo et gardent un pion de plus en toute sécurité."
   },
   {
    "san": "Qxa8",
    "pourquoi": "Perd la dame : le fou d7 a coupé la retraite, ...Qxa8 reprend tout de suite. Les Blancs n'ont qu'une tour pour la dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1 fxe5 Nbd2 O-O-O Re1",
  "nom": "Partie espagnole, variante d'échange (ligne 5...f6)",
  "sens": "Sort la tour de la colonne d pour éviter l'échange des tours, protège le pion e4 et libère le cavalier d2, qui n'est plus cloué par la tour d8 : le cavalier f3 peut maintenant bouger sans rien lâcher.",
  "menace": "Cxe5 : le pion e5 n'est défendu par personne, et le cavalier arrivé en e5 attaquerait en plus le fou g4.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "Défend le pion e5 avec la tour. La tour n'avait plus rien à faire sur la colonne d depuis que la tour blanche est partie. Le fou g4 reste cloué sur le cavalier f3 et les Noirs gardent une position solide."
   },
   {
    "san": "Bd6",
    "pourquoi": "Développe le fou en défendant e5. Le fou est actif sur la diagonale b8-h2 et le cavalier g8 pourra sortir ensuite en e7 ou f6 sans perdre de pion."
   },
   {
    "san": "Bb4",
    "pourquoi": "Attaque la tour e1 : si les Blancs prennent Cxe5, les Noirs répondent Fxe1 et gagnent une tour. Les Blancs doivent d'abord jouer c3 ou bouger la tour, ce qui laisse aux Noirs le temps de défendre e5."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développe mais oublie le pion e5 : Cxe5 gagne le pion et attaque le fou g4. Après Fh5, f3 enferme le fou et les Blancs ont un pion de plus avec une position facile."
   },
   {
    "san": "Bh5",
    "pourquoi": "Recule le fou alors que la vraie question est le pion e5. Cxe5 gagne le pion gratuitement, puis le cavalier blanc se replie en d3 ou chasse encore le fou avec g4 et h3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Rd1+ Ke8 Nc3",
  "nom": "Partie espagnole, variante berlinoise (finale berlinoise)",
  "sens": "Développe le cavalier vers les cases fortes e4 et d5. Prépare Ne4 ou Ne2-d4 pour chasser le cavalier f5. Les Blancs sont pressés : le roi noir ne peut plus roquer, donc ils veulent créer des problèmes avant que les Noirs ne s'organisent.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Recule le cavalier avant qu'il soit chassé par Ne2-d4. De e7, il protège le roi, surveille d5 et peut aller en g6 attaquer le pion e5. Libère aussi f5 pour le fou. Laisse aux Blancs Ne4 ou Bg5, sans réel danger."
   },
   {
    "san": "Be6",
    "pourquoi": "Développe le fou sur sa meilleure diagonale et contrôle d5, la case que vise le cavalier blanc. Prépare ...Rd8 pour contester la colonne d. Si Ng5, le fou peut reculer en d5 ou c4 sans problème."
   },
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 aux pièces blanches (cavalier et fou), ce qui calme toute attaque sur f7 ou sur le fou e7. Prépare ...Be7 et ...Rd8 tranquillement. Coup typique de cette finale : les Noirs ont la paire de fous et du temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -14
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 Bg4 dxe5 Qxd1 Rxd1 fxe5 Nbd2 O-O-O Re1 Re8",
  "nom": "Variante d'échange, ligne 5...f6",
  "sens": "Défend le pion e5 avec la tour, qui n'avait plus de travail sur la colonne d depuis le départ de la tour blanche. Les Noirs gardent le fou g4 cloué sur le cavalier f3 et consolident leur centre.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Pose la question au fou g4. S'il prend en f3, le cavalier d2 reprend et les Blancs gardent la paire de fous. S'il recule en h5, on pourra le chasser plus tard avec g4 et Cc4-e3. Laisse aux Noirs le choix, mais aucun n'est confortable."
   },
   {
    "san": "b3",
    "pourquoi": "Prépare Fb2 : le fou visera le pion e5, seul point faible des Noirs. Le pion b3 contrôle aussi c4, case idéale pour le cavalier d2. Développe sans forcer les choses."
   },
   {
    "san": "Nc4",
    "pourquoi": "Le cavalier vient attaquer e5 et regarde a5 et e3. Il libère aussi la case d2 pour le fou c1. Les Noirs doivent surveiller e5 en permanence, ce qui gêne leur développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Rd1+ Ke8 Nc3 Ne7",
  "nom": "Partie espagnole, variation berlinoise (finale berlinoise)",
  "sens": "Met le cavalier à l'abri avant qu'il soit chassé par Ne2-d4. De e7, il couvre le roi, surveille d5 et peut aller en g6 pour attaquer le pion e5. Il libère aussi f5 pour le fou de c8.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "Gagne de l'espace à l'aile dame et prépare a5 pour fixer les pions noirs doublés. Les Blancs ont quatre pions contre trois à l'aile roi : ils peuvent jouer calmement, sans risque. Laisse aux Noirs Ng6 ou Bf5, que l'on répond par Ne2 ou h3."
   },
   {
    "san": "Ne4",
    "pourquoi": "Centralise le cavalier vers c5 ou g5, d'où il gêne le fou c8 et vise f7 ou b7. Sur Bf5, on peut jouer Ng3 pour chasser le fou. Laisse aux Noirs Ng6 contre e5, mais le pion est tenable."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe simplement le fou et prépare Rd1-d2 puis Rad1 pour prendre la colonne d. Si le fou noir vient en f5, h3 puis g4 le repousse. Laisse aux Noirs Nd5, que l'on répond par Bd2 ou Bg5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 14
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4",
  "nom": "Défense Bird",
  "sens": "place le cavalier au centre pour forcer l'échange : après Cxd4 exd4, le pion noir en d4 gêne le développement blanc (plus de Cc3) et le fou b5 se retrouve un peu en l'air, menacé par ...c6.",
  "menace": "Prendre le fou b5 avec le cavalier (Cxb5) et surtout ...Cxf3+ si les Blancs ne réagissent pas : le cavalier d4 ne doit pas rester là sans réponse.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Accepte l'échange : après ...exd4, le pion noir d4 est avancé et isolé, il sera attaqué par c3 et le centre blanc (e4) reste solide. Les Blancs gardent une légère avance de développement."
   },
   {
    "san": "Bc4",
    "pourquoi": "Recule en gardant la diagonale sur f7 et évite l'échange tout de suite. Le cavalier d4 devra se justifier : s'il prend en f3, les Blancs reprennent de la dame et contrôlent le centre."
   },
   {
    "san": "Ba4",
    "pourquoi": "Garde le fou actif en évitant ...c6 et ...d5 gagnant du temps ; permet ensuite de reprendre en d4 tranquillement avec le cavalier."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le roque laisse le fou b5 en prise : ...Cxb5 gagne une pièce entière, et Cxe5 ensuite ne récupère rien car ...c6 ramène le cavalier en sécurité."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Prend le pion mais oublie son propre fou : ...Cxb5 gagne la pièce, et Cxf7 Rxf7 ne rapporte qu'un pion pour le cavalier."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 56
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4",
  "nom": "Défense Bird",
  "sens": "Prend le cavalier qui a sauté en d4 : les Blancs échangent plutôt que de reculer, pour isoler un pion noir au centre et garder leur avance de développement.",
  "menace": "Gagner une pièce : le cavalier d4 est en prise et doit être repris tout de suite.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Reprend la pièce, c'est obligatoire. Le pion d4 gêne un peu les Blancs (il contrôle c3 et e3) mais il est seul : les Blancs vont le harceler par c3 et pousser d3 ou d4. Les Noirs devront le soutenir avec ...c5 ou ...Fc5 et développer vite."
   },
   {
    "san": "a6",
    "pourquoi": "Pose d'abord la question au fou b5 avant de reprendre. Si le fou recule, ...exd4 suit et les Noirs ont gagné le coup ...a6. C'est jouable mais plus risqué : le cavalier d4 reste en prise un coup de plus et les Blancs peuvent jouer Cxc6 ou Fc4 avec initiative."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développe une pièce mais oublie de reprendre : après Cb3 les Blancs ont une pièce de plus pour rien. Avant de développer, on compte toujours les pièces en prise."
   },
   {
    "san": "Bc5",
    "pourquoi": "Attaque le cavalier d4 au lieu de le prendre : les Blancs le sauvent simplement par Cb3 et restent avec une pièce de plus. Le gain est immédiat avec exd4, il ne faut pas chercher plus compliqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -58
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Reprend le cavalier avec le pion e5, qui s'avance en d4 : ce pion contrôle c3 et e3 et gêne le développement blanc, mais il est isolé et doit être défendu.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie la tour au centre avant toute ouverture de lignes. Les Blancs gardent la paire de fous et pourront ensuite jouer c3 ou d3 pour s'en prendre au pion d4. Les Noirs n'ont aucune menace immédiate, donc rien ne presse."
   },
   {
    "san": "Ba4",
    "pourquoi": "Replie le fou à l'avance : après ...c6, il n'aura plus à chercher une case sous le coup de ...d5 ou ...a6-b5. Le fou reste sur la diagonale a4-e8 et vise le roi noir. Ça laisse cependant aux Noirs un temps pour ...Fc5 ou ...c5."
   },
   {
    "san": "d3",
    "pourquoi": "Ouvre la diagonale du fou c1 et prépare c3 pour attaquer le pion d4. Solide, mais un peu passif : les Blancs ne profitent pas tout de suite de l'avance de développement."
   }
  ],
  "erreurs": [
   {
    "san": "Qh5",
    "pourquoi": "Sortir la dame tôt pour attaquer f7 est tentant, mais après ...De7 les Noirs défendent tout et préparent ...Dxe4 : le pion e4 tombe, car Fb5 ne le protège pas. La dame blanche aura perdu du temps pour rien."
   },
   {
    "san": "h3",
    "pourquoi": "Coup d'attente inutile qui n'aide pas à se développer. Après ...Dg5 le pion g2 est attaqué, et le pion b5 aussi : les Blancs doivent reculer le fou (Ff1) et perdent du temps alors qu'il fallait roquer ou jouer c3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O",
  "nom": "Défense Bird (variante du roque)",
  "sens": "Met le roi à l'abri et relie la tour au centre avant toute ouverture de lignes. Les Blancs gardent la paire de fous et pourront ensuite jouer c3 ou d3 pour s'en prendre au pion d4. Les Noirs n'ont aucune menace immédiate, donc rien ne presse.",
  "plan": [
   {
    "san": "c6",
    "pourquoi": "Chasse le fou b5 en gagnant un temps et prépare d5 pour prendre le centre. Le pion d4 reste solide tant que c6 le protège d'un coup c3. Les Blancs reculeront en a4 ou c4 et joueront d3."
   },
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou en le plaçant derrière le pion d4, qu'il soutient. Il vise aussi f2 et prépare le petit roque après Ne7. Les Blancs pourront répondre d3 puis c3 pour attaquer d4."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le pion f, car f6 serait exposé au fou b5. Il prépare le roque et peut aller en g6 ou c6. Les Blancs obtiennent un peu de temps pour jouer d3 et c3."
   }
  ],
  "erreurs": [
   {
    "san": "h5",
    "pourquoi": "Pousse un pion de bord sans rien développer ni défendre. Le roi noir reste au centre et la case g5 s'affaiblit. Les Blancs jouent d3 tranquillement, puis après c6 Fa4 ils gardent leur avance de développement et attaquent d4 par c3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -55
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6",
  "nom": "Défense Bird",
  "sens": "Attaque le fou b5 avec un pion : le fou doit bouger, les Noirs gagnent un temps. Prépare aussi d5 pour prendre le centre et protège la case b5 d'où le pion pourrait chasser un fou revenu en c4.",
  "menace": "Prendre le fou en b5 avec le pion c6 : le fou doit partir maintenant.",
  "plan": [
   {
    "san": "Bc4",
    "pourquoi": "Recule sur la diagonale la plus active : le fou vise f7, la case faible devant le roi noir. Si les Noirs jouent d5 pour chasser le fou, exd5 ouvre la colonne e sur leur roi non roqué. Le fou reste exposé à un futur b5, mais il aura le temps de reculer en b3."
   },
   {
    "san": "Ba4",
    "pourquoi": "Garde le fou sur sa diagonale a4-e8 et surveille le pion c6 : si les Noirs poussent d5, le fou gêne leur développement en épinglant parfois le cavalier qui viendra en d7. Fou un peu passif, loin de f7."
   },
   {
    "san": "Be2",
    "pourquoi": "Le choix le plus solide : le fou protège le roi et ne peut plus être chassé par b5 ou d5. Les Blancs joueront ensuite d3 et c3 pour reprendre le pion d4. Les Noirs ont alors un centre facile avec d5."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Oublie que le fou est attaqué : après cxb5 le fou est perdu. Les Blancs reprennent le pion d4 avec cxd4 mais restent avec une pièce de moins. Toujours sauver la pièce attaquée avant de contre-attaquer."
   },
   {
    "san": "d3",
    "pourquoi": "Coup de développement naturel, mais il laisse le fou en b5 : cxb5 le gagne pour rien. Le pion d3 ne sauve pas la pièce. Même piège pour Qe2, Nc3, a4, Re1 ou Qh5 : tant que le fou n'a pas bougé, tout autre coup perd une pièce."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 55
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4",
  "nom": "Défense Bird",
  "sens": "Recule sur la diagonale a2-g8 au lieu de b5 : le fou vise f7, la case la plus fragile du camp noir tant que le roi n'a pas roqué. Les Blancs gardent aussi l'option c3 pour dissoudre le pion d4 avancé.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe une pièce et attaque e4 : les Blancs doivent s'en occuper (Re1 ou d3) avant de penser à Qf3 contre f7. Prépare Be7 puis le petit roque, qui règle une fois pour toutes la faiblesse de f7. Laisse aux Blancs la poussée e5, mais le cavalier aura d5 grâce au pion c6."
   },
   {
    "san": "d6",
    "pourquoi": "Coup solide : contrôle e5 pour que le cavalier puisse venir en f6 sans être chassé, et ouvre la diagonale du fou c8. Prépare Nf6, Be7 et le roque. Laisse aux Blancs le temps de jouer c3 contre le pion d4, mais la position reste saine."
   },
   {
    "san": "d5",
    "pourquoi": "Chasse immédiatement le fou de sa belle diagonale et prend le centre. Après exd5 cxd5, le fou doit reculer en b3 ou b5+. La colonne e s'ouvre sur le roi noir : il faut donc enchaîner vite Nf6, Be7 et le roque, sans coup de trop."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développement trop lent : le fou ne gêne personne. Les Blancs jouent Qf3 et attaquent f7 avec la dame et le fou c4 ; après Nf6, e5 chasse le cavalier et f7 est de nouveau attaqué. Il fallait d'abord Nf6 ou d6 pour contrôler e5."
   },
   {
    "san": "b5",
    "pourquoi": "Le fou recule tranquillement en b3 et garde exactement la même diagonale vers f7 : le coup n'a rien gagné. En plus, b5 affaiblit c6 et c5, et après Nf6 e5 le cavalier doit bouger alors que le roi n'a toujours pas roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -53
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6",
  "nom": "Défense Bird (variante Cf6 contre 5.O-O c6 6.Fc4)",
  "sens": "développe le cavalier roi et attaque le pion e4 : les Blancs doivent d'abord le défendre, puis les Noirs joueront Fe7 et roqueront pour mettre f7 à l'abri.",
  "menace": "Cxe4 : le pion e4 n'est défendu par rien.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "défend e4 une fois pour toutes avec un pion et ouvre la diagonale du fou c1. Les Blancs pourront ensuite jouer Ff4 ou Fg5, Cd2 et Df3 contre f7. Le pion d4 noir reste isolé et devra être protégé, c'est l'avantage des Blancs."
   },
   {
    "san": "Re1",
    "pourquoi": "défend e4 avec la tour, qui se place sur la colonne du roi noir, ce que les Noirs n'aimeront pas tant qu'ils n'ont pas roqué. Garde d3 pour plus tard et laisse le fou c1 encore enfermé, d'où l'idée de jouer d3 au coup suivant."
   },
   {
    "san": "e5",
    "pourquoi": "chasse le cavalier et gagne de l'espace. Mais le cavalier va en d5, une excellente case protégée par le pion c6, et il faudra défendre le pion e5. À réserver aux joueurs qui aiment l'initiative."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "attaque le pion d4 mais oublie e4 : après Cxe4 les Noirs ont gagné un pion. Te1 chasse le cavalier mais il revient d5 et les Blancs ont perdu leur avantage. Il faut défendre avant d'attaquer."
   },
   {
    "san": "f3",
    "pourquoi": "défend e4 mais affaiblit la diagonale du roi blanc et le pion e4 reste fragile. Après d5 ! les Noirs ouvrent le centre : exd5 Cxd5 et le cavalier noir est centralisé, prêt à sauter en e3 ou f4. Un pion défend mieux depuis d3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 59
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Consolide le centre avec un pion : e4 est désormais protégé durablement, ce qui libère le cavalier b1 et la dame. La diagonale c1-h6 s'ouvre pour le fou, qui pourra sortir en f4 ou g5.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Ouvre la diagonale du fou c8 et pose un pion en d6 qui couvre e5 : le cavalier f6 ne sera plus chassé par e4-e5. Les Noirs peuvent ensuite jouer Fe7 et roquer tranquillement. Le pion d4 reste isolé, mais il gêne le cavalier b1 qui ne peut plus aller en c3."
   },
   {
    "san": "d5",
    "pourquoi": "Frappe le centre tout de suite : le pion attaque le fou c4 et conteste e4. Après exd5 cxd5, les Noirs récupèrent le pion avec un centre solide d5-d4 et le fou c8 est libéré. C'est actif, mais le roi noir reste au centre un coup de plus."
   },
   {
    "san": "a5",
    "pourquoi": "Prépare a5-a4 pour gagner de l'espace à l'aile dame et empêcher le fou blanc de reculer en b3. C'est un coup utile, mais il ne développe rien : il faudra vite jouer d6 ou d5 derrière."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou semble actif, mais le pion n'a rien joué en d6 : les Blancs répondent e5 et le cavalier f6 doit fuir en d5. Le fou c5 se retrouve ensuite ciblé par Cd2-b3 ou b2-b4, et les Noirs perdent des temps à le sauver."
   },
   {
    "san": "Qa5",
    "pourquoi": "Sortir la dame si tôt ne menace rien de réel. Les Blancs jouent Te1 puis Cd2 et développent avec gain de temps, tandis que la dame en a5 gêne le propre développement des Noirs et pourra être chassée par Cb3 ou b2-b4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6",
  "nom": "Défense Bird",
  "sens": "Solidifie le centre : le pion d6 interdit e4-e5 et ouvre la diagonale du fou c8. Les Noirs préparent Fe7 et le petit roque.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou c8 et au cavalier f6 avant qu'ils n'ennuient le roi. Les Blancs pourront ensuite jouer Ff4 ou f4 sans craindre Fg4. Petit coup patient qui laisse les Noirs finir leur développement."
   },
   {
    "san": "Bf4",
    "pourquoi": "Développe le fou sur une diagonale active et appuie sur d6. Prépare Cd2 puis Cf3 pour attaquer le pion isolé d4. Mais le fou peut être visé par ...Ch5."
   },
   {
    "san": "Nd2",
    "pourquoi": "Le cavalier ne peut pas aller en c3 à cause du pion d4 : il passe par d2 pour rejoindre f3 et attaquer d4. Développe en gardant e4. En échange, le fou c1 reste bloqué quelques coups."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 58
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3",
  "nom": "Défense Bird",
  "sens": "Retire la case g4 au fou c8 et au cavalier f6 : plus de Fg4 gênant ni de Cg4 vers le roi. Les Blancs pourront ensuite jouer Ff4 ou f4 tranquillement. Coup d'attente qui laisse les Noirs terminer leur développement.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou et prépare le petit roque. Le roi sera à l'abri avant d'ouvrir le centre. Les Blancs garderont un léger avantage grâce à leur meilleur développement, mais la position est solide."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou c4, très actif sur la diagonale vers f7. Après Fb3, les Noirs peuvent jouer a5 ou Fe7 et roquer. Attention : les pions avancés sur l'aile dame peuvent devenir des cibles plus tard."
   },
   {
    "san": "d5",
    "pourquoi": "Occupe le centre et gagne de l'espace en attaquant le fou c4. Après exd5 cxd5 Fb3, le pion d4 et le pion d5 forment une chaîne solide, mais le roi noir devra vite roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Be6",
    "pourquoi": "Propose l'échange des fous, mais après Fxe6 fxe6 les Noirs ont un pion e6 isolé et un roi affaibli sur la colonne f. Les Blancs jouent f4 et ouvrent la colonne. Mieux vaut garder le fou c8 ou le mettre en d7."
   },
   {
    "san": "h6",
    "pourquoi": "Coup de prudence inutile : rien ne menaçait h7. Il perd un temps alors que le roi n'est pas encore roqué. Les Blancs jouent Cd2 puis Cf3 et prennent l'initiative au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3 Be7",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Termine le développement du petit côté et prépare le roque : une fois le roi en sécurité, les Noirs pourront pousser d5 ou jouer Fe6 pour contester le fou de c4.",
  "plan": [
   {
    "san": "Nd2",
    "pourquoi": "Le cavalier sort sans bloquer le pion c, il vise f3 puis f3 attaquera le pion d4 isolé. Les Blancs gardent le centre et l'avantage de développement. Il laisse aux Noirs le temps de roquer, mais sans contre-jeu réel."
   },
   {
    "san": "Bf4",
    "pourquoi": "Développe le dernier fou sur une case active qui regarde d6 : si les Noirs poussent d5 plus tard, le fou gêne. Prépare De2 et Tfe1 avec pression sur la colonne e."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4, qui est seul loin de ses amis. Après ...dxc3 bxc3 les Blancs ont un grand centre. Les Noirs peuvent défendre par ...d5 ou ...c5, mais ils doivent réagir au lieu de roquer tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "f4",
    "pourquoi": "Trop ambitieux : le coup affaiblit le roi blanc (diagonale g1-a7 et case e3) et ne menace rien. Les Noirs répondent ...d5 ! : après exd5 Cxd5 le cavalier noir est superbe au centre, le fou c4 est attaqué et les Blancs ont perdu tout leur avantage."
   },
   {
    "san": "Qe1",
    "pourquoi": "La dame va sur une case passive où elle ne fait rien : elle bloque la tour f1 au lieu de la libérer. Après ...O-O Cd2 Te8 les Noirs ont fini leur développement et la pression sur e4 commence ; l'avantage blanc a disparu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 60
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3 Be7 Nd2",
  "nom": "Variante Bird",
  "sens": "Développe le cavalier sans bloquer le pion c, pour le ramener en f3 où il attaquera le pion d4 isolé des Noirs. Les Blancs préparent aussi f4 pour gagner de l'espace.",
  "menace": "Cf3 suivi de la pression sur d4 : le pion isolé devra être défendu en permanence.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant que le centre ne s'ouvre. Les Noirs auront ensuite le temps de défendre d4 avec Dc7 ou Fe6, et le cavalier f6 surveille e4."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou de c4 avec gain de temps : il doit reculer en b3, et après a5 il pourra être encore gêné. Attention : cela affaiblit un peu c6 et la case c5."
   },
   {
    "san": "d5",
    "pourquoi": "Pousse au centre pour échanger en e4 et libérer le jeu, le fou e7 et le cavalier f6 respirent. Mais cela peut ouvrir la colonne e sur un roi encore au centre : à jouer plutôt après le roque."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Perd un temps précieux pour rien : le pion h6 ne protège rien ici. Après Cf3 c5 e5 les Blancs chassent le cavalier f6 et prennent le centre, les Noirs n'ont pas encore roqué et subissent."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3 Be7 Nd2 O-O",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Met le roi à l'abri avant que le centre ne s'ouvre : la tour f8 est prête à venir en e8 face au pion e4, et le roque laisse les Noirs libres de défendre d4 avec Dc7 ou Fe6.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Le cavalier revient attaquer le pion isolé d4, le point faible des Noirs. Il prépare aussi Te1 et laisse les Noirs choisir entre défendre d4 (Dc7, c5) ou le perdre."
   },
   {
    "san": "f4",
    "pourquoi": "Prend de l'espace au centre et prépare f5 ou e5 pour chasser le cavalier f6. Le roi blanc est déjà roqué, donc le pion f peut avancer sans danger."
   },
   {
    "san": "Re1",
    "pourquoi": "Coup simple et utile : la tour soutient e4 et se place sur la colonne qui s'ouvrira. Les Blancs attendent de voir le plan noir avant de choisir entre Cf3 et f4."
   }
  ],
  "erreurs": [
   {
    "san": "Kh2",
    "pourquoi": "Un coup de roi qui ne sert à rien : le roi est déjà en sécurité. Les Noirs jouent d5, le fou c4 doit reculer en b3, puis a5 le chasse encore. Un temps perdu pendant que les Noirs prennent le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3 Be7 Nd2 O-O Nf3",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "revient à sa meilleure case pour attaquer le pion isolé d4, cible permanente des Noirs, et libère f1 pour la tour vers e1",
  "menace": "Cxd4 gagne tout simplement le pion d4, que rien ne défend pour l'instant",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Contre-attaque : le pion chasse le fou c4 et ouvre le centre. Si Cxd4, dxc4 reprend le fou ; si exd5, cxd5 prend le fou et le pion d4 est hors d'atteinte. Les Blancs doivent d'abord sauver leur fou."
   },
   {
    "san": "c5",
    "pourquoi": "Défend d4 solidement avec un pion : le cavalier f3 ne peut plus le prendre. En échange, le pion d6 devient un peu arriéré, mais la structure tient et le fou c8 se développe par e6 ou d7."
   },
   {
    "san": "b5",
    "pourquoi": "Gagne du temps en attaquant le fou c4. Après Fb3, les Noirs jouent c5 pour verrouiller d4, puis Fb7 : le fou noir arrive sur la grande diagonale et vise e4."
   }
  ],
  "erreurs": [
   {
    "san": "Qc7",
    "pourquoi": "La dame ne défend pas d4 : le pion est perdu après Cxd4. Et le réflexe d5 pour compliquer échoue, car exd5 gagne un deuxième pion. Un pion isolé se défend par un pion (c5) ou par une contre-attaque (d5), pas par la dame."
   },
   {
    "san": "Re8",
    "pourquoi": "Développe la tour mais oublie la menace : Cxd4 prend le pion gratuitement. Puis d5 ne récupère rien car exd5 attaque encore c6. Avant de développer, il faut toujours répondre à la menace directe."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -48
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O c6 Bc4 Nf6 d3 d6 h3 Be7 Nd2 O-O Nf3 d5",
  "sens": "Attaque le fou c4 avec le pion d5 pour ouvrir le centre : le fou doit bouger, et le pion e4 est aussi touché.",
  "menace": "dxc4 gagne le fou. Si les Blancs sauvent le fou par Fb3, dxe4 suit et les Noirs gagnent un pion central.",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Le seul coup qui ne perd rien : le pion prend d5 avant que le fou soit capturé. Après cxd5, le fou est attaqué par le pion d5, mais il recule tranquillement (Fb3 ou Fb5+). Les Blancs gardent une position saine."
   }
  ],
  "erreurs": [
   {
    "san": "Bb3",
    "pourquoi": "Le fou se sauve, mais oublie le pion e4 : dxe4 dxe4 Cxe4 et les Noirs ont gagné un pion au centre. Il fallait d'abord prendre en d5."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Le cavalier croit gagner un pion, mais dxc4 prend le fou. Même après dxc4, les Noirs jouent Cxe4 et ont une pièce de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 60
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3",
  "nom": "Berlinoise, variante 4.d3 (anti-Berlin)",
  "sens": "renforce e4 avec un pion pour que Cf3 soit libre : plus de prise sur e4, pas d'échange de dames façon Berlin, les Blancs manœuvrent tranquillement.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vise f2 et prépare d6 puis 0-0. Rien à craindre de Fxc6 : après dxc6 le pion e5 tient et le fou e4 des Noirs respire."
   },
   {
    "san": "d6",
    "pourquoi": "Protège e5 une fois pour toutes et ouvre la diagonale du fou c8. Coup solide qui laisse le choix du fou (e7 ou g7 après g6) pour plus tard."
   },
   {
    "san": "Bd6",
    "pourquoi": "Défend e5 en gardant le fou actif : l'idée est de jouer 0-0, puis Te8 et Ff8 pour relâcher le fou. Moins naturel mais parfaitement sain."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Semble normal, mais e5 reste mal défendu : 5.Fxc6 dxc6 6.Cxe5 gagne un pion. Il faut d'abord assurer e5 (d6 ou Fd6) avant de placer le fou en e7."
   },
   {
    "san": "Nd4",
    "pourquoi": "L'échange 5.Cxd4 exd4 laisse un pion d4 isolé et avancé, sans soutien. Les Blancs roquent et le pion devient une cible : plus d'un pion de perdu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5",
  "nom": "Berlin, anti-Berlin (4.d3 Fc5)",
  "sens": "Met le fou sur sa meilleure diagonale, braqué sur f2, et protège indirectement e5 : si Fxc6 dxc6 Cxe5, alors Fxf2+ suivi de Dd4+ récupère le cavalier. Les Noirs sont prêts à roquer.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Prépare d4 pour chasser le fou de sa diagonale et prendre le centre. Garde aussi la case d4 sous contrôle. Laisse aux Noirs le temps de roquer, mais ils n'ont rien de concret."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Après ...d6, on jouera c3 et Cbd2-f1-g3, le plan classique de l'Espagnole. Ne menace rien, mais ne donne rien non plus."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Abîme les pions noirs (dxc6) avant de roquer. Attention : ne pas prendre e5 ensuite, Fxf2+ puis Dd4+ le reprend. Les Noirs gardent la paire de fous, mais leur pion c6 doublé reste faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3",
  "nom": "Espagnole, variante Berlin avec 4.d3 (système 4...Fc5 5.c3)",
  "sens": "prépare d4 pour chasser le fou de c5 et occuper le centre ; en attendant, le pion c3 garde la case d4 et offre au fou b5 une case de repli en c2 via a4.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Frappe le centre tout de suite, avant que les Blancs n'aient joué d4. Après exd5 Dxd5, la dame est active et le fou c8 est libéré. Les Blancs doivent réagir au centre au lieu de dérouler leur plan tranquillement."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri sans rien concéder. Les Noirs attendent d4 pour reculer le fou en b6, où il garde la diagonale a7-g1. Le coup est sûr, mais il laisse aux Blancs le temps de prendre le centre."
   },
   {
    "san": "Bb6",
    "pourquoi": "Retire le fou avant d'y être forcé : après d4, il ne perdra pas de temps. Le fou reste pointé sur f2 et sur la case d4. Les Noirs rouqueront ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Semble naturel comme dans l'Espagnole classique, mais ici le pion e5 n'est défendu que par le cavalier c6. Après Fxc6 bxc6 Cxe5, les Blancs gagnent un pion net, car d6 n'a pas encore été joué."
   },
   {
    "san": "Be7",
    "pourquoi": "Recule le fou sans raison et abandonne le contrôle de d4. Même problème : Fxc6 dxc6 Cxe5 ramasse le pion e5, le fou en c5 ne menaçait plus rien en f2 et la pièce en e7 gêne le roque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -11
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5",
  "sens": "Attaque le centre tout de suite, avant que les Blancs n'aient joué d4 : le pion d5 défie e4 et menace de prendre, et si exd5 Dxd5 la dame noire sort active et le fou c8 respire. Les Noirs forcent les Blancs à réagir au lieu de dérouler leur plan.",
  "menace": "dxe4 : le pion d5 prend e4 et, si dxe4, Dxd1+ échange les dames en laissant les Noirs plus actifs (cavalier f6 et fou c5 pointent déjà vers le roi blanc).",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Prend le pion pour éviter que les Noirs gagnent d'abord en e4. Après Dxd5 la dame noire est active mais exposée : les Blancs la harcèlent ensuite avec c4 ou Cbd2-e4 en gagnant des temps, et le centre blanc reste solide avec d3 et c3. C'est le coup le plus sûr."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Défend e4 une deuxième fois en développant une pièce. Si dxe4, dxe4 et il n'y a plus d'échange de dames gênant car la dame blanche est protégée. Le cavalier ira ensuite en c4 ou f1-g3. Les Noirs gardent une bonne liberté de jeu."
   },
   {
    "san": "d4",
    "pourquoi": "Répond au centre par le centre : attaque e5 et le fou c5 en même temps. La position s'ouvre, ce qui demande du calcul précis, mais les Blancs ont c3 et Cf3 prêts à soutenir d4."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Coup prudent qui ne défend rien d'important. Les Noirs prennent dxe4, et sur Cxe5 ils roquent tranquillement : le pion e4 est perdu, le centre noir domine et les pièces noires sont déjà toutes sorties. Ici il faut répondre au centre, pas jouer en bordure."
   },
   {
    "san": "Qa4",
    "pourquoi": "Semble clouer le cavalier c6 et attaquer, mais le roi noir roque simplement. Si ensuite Fxc6 bxc6, la dame blanche se retrouve seule en a4 sans menace, le pion e4 reste en prise et les Noirs ont la paire de fous et le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 22
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5",
  "sens": "Prend le pion d5 avant que le pion e5 ne pousse en e4. Le centre blanc d3-c3 reste compact, et la pièce noire qui reprendra en d5 sera une cible : les Blancs comptent gagner des temps en la chassant.",
  "menace": "dxc6 : le pion d5 attaque le cavalier c6, déjà cloué par le fou b5. Si les Noirs ne reprennent pas, ils perdent une pièce.",
  "plan": [
   {
    "san": "Qxd5",
    "pourquoi": "Reprend le pion et sauve le cavalier c6. La dame est centralisée et vise b5 et g2. Elle sera chassée par c4 ou Nbd2-e4, mais les Noirs ont le temps de roquer et le jeu reste égal."
   },
   {
    "san": "Nxd5",
    "pourquoi": "Reprend avec le cavalier, qui s'installe au centre sans exposer la dame. Les Blancs peuvent jouer Bxc6+ bxc6 puis Nxe5 et gagner un pion temporairement, d'où une évaluation un peu moins bonne que Qxd5."
   }
  ],
  "erreurs": [
   {
    "san": "e4",
    "pourquoi": "Oublie la menace dxc6. Les Blancs prennent le cavalier, puis Nxe5 : les Noirs ont perdu une pièce pour rien."
   },
   {
    "san": "Bxf2+",
    "pourquoi": "Le sacrifice ne mène à rien : Kxf2 Qxd5 puis Bxc6. Les Blancs ont un fou de plus et le roi blanc n'est pas en danger."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5",
  "sens": "Reprend le pion d5 tout en protégeant le cavalier c6, attaqué par le fou b5. La dame est au centre et regarde à la fois b5 et g2.",
  "menace": "Dxb5 : prendre le fou b5, qui n'est plus défendu. Dxg2 est aussi dans l'air si les Blancs oublient leur roi.",
  "plan": [
   {
    "san": "Bc4",
    "pourquoi": "Sauve le fou en gagnant un temps : il attaque la dame d5, qui doit bouger. Ensuite les Blancs roquent et jouent Cbd2 puis b4 ou d4 pour reprendre le centre. Le fou c4 vise aussi f7."
   },
   {
    "san": "Qb3",
    "pourquoi": "Défend le fou b5 et propose l'échange des dames sur d5. Après Dxb3 axb3, la colonne a s'ouvre pour la tour ; si les Noirs refusent, la dame b3 appuie sur b7 et f7. Idéal si on préfère un jeu calme."
   },
   {
    "san": "Qa4",
    "pourquoi": "Défend le fou b5 et cloue le cavalier c6 sur le roi e8. Les Noirs répondent 0-0 puis Fd7 ou Cd4, et le jeu reste équilibré."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Oublie que le fou b5 est en prise. Pire, après Fxf2+ Txf2 Dxb5, les Noirs ont gagné un pion et cassé le roque blanc. Il faut d'abord régler le problème du fou."
   },
   {
    "san": "c4",
    "pourquoi": "Chasse la dame, mais après Dd6 le fou b5 est toujours attaqué et doit prendre en c6 : Fxc6+ bxc6. Les Blancs ont donné le fou de cases blanches, et le pion c4 laisse d4 et d3 affaiblis."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4",
  "sens": "Met le fou à l'abri en attaquant la dame d5 : les Noirs doivent perdre un temps pour la déplacer. Le fou c4 vise aussi la case f7, la plus fragile du camp noir, et les Blancs vont roquer, jouer Cbd2 puis b4 ou d4 pour reprendre le centre.",
  "menace": "Prendre la dame en d5 avec le fou.",
  "plan": [
   {
    "san": "Qd7",
    "pourquoi": "Recule la dame à l'abri tout en protégeant f7 par avance. Elle reste connectée au fou c8 et prépare le roque après ...0-0. Les Blancs gagnent un temps, mais les Noirs gardent un bon développement et un pion e5 solide."
   },
   {
    "san": "Qd6",
    "pourquoi": "La dame surveille toujours le centre et la diagonale vers d3, elle aide à préparer ...0-0 et ...a6/...b5 pour chasser le fou c4. Attention : elle peut être gênée plus tard par un cavalier en e4 ou un pion en b4-b5."
   },
   {
    "san": "Qd8",
    "pourquoi": "Retour tranquille sur sa case de départ : aucune cible pour les Blancs, et le roque suit tout de suite. Les Noirs ont simplement échangé le pion d contre le pion e4, avec une position égale et facile à jouer."
   }
  ],
  "erreurs": [
   {
    "san": "Bxf2+",
    "pourquoi": "Le sacrifice est tentant mais ne mène nulle part : après Rxf2, la dame est toujours attaquée en d5 et doit fuir (Dc5+), puis Re1. Les Noirs ont donné un fou pour un pion sans attaque réelle : une pièce de moins."
   },
   {
    "san": "Be6",
    "pourquoi": "Oublie que la dame est attaquée. Après Fxd5 Fxd5, les Noirs n'ont que deux pièces mineures pour la dame, et b4 chasse encore le fou c5 : perte décisive."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7",
  "sens": "Retire la dame de l'attaque du fou c4 sans perdre le contact avec f7 : elle couvre la case d'où le fou blanc menace, reste reliée au fou c8 et laisse les Noirs roquer tranquillement.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier dame vers e4 et b3, d'où il harcèle le fou c5. Garde le fou c1 libre et prépare le roque. Les Noirs peuvent roquer, mais leur fou c5 va devoir bouger."
   },
   {
    "san": "b4",
    "pourquoi": "Chasse tout de suite le fou c5 avec gain de temps. Le fou doit reculer en b6 ou d6, et les Blancs continuent par b5 ou Cbd2 pour prendre de l'espace à l'aile dame."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Le centre est ouvert, c'est donc une priorité. Les Noirs roqueront aussi, mais les Blancs choisiront ensuite calmement entre b4, Cbd2 et Te1."
   }
  ],
  "erreurs": [
   {
    "san": "Qd2",
    "pourquoi": "Développe la dame au mauvais endroit : après 7...e4 ! 8.dxe4 Cxe4, le cavalier noir attaque la dame d2 et le pion f2. Les Blancs perdent du temps et du centre au lieu d'en gagner."
   },
   {
    "san": "Ng5",
    "pourquoi": "Attaque f7, mais f7 est déjà protégé par la dame d7. Après 7...0-0 8.0-0 Df5 le cavalier g5 est attaqué et doit rentrer. Coup à vide : les Noirs achèvent leur développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2",
  "sens": "Développe le dernier cavalier vers e4 ou b3, deux cases d'où il attaque le fou c5. Laisse le fou c1 libre et prépare le roque.",
  "menace": "Ce4 ou Cb3 pour gagner du temps sur le fou c5 ; après Cxc5 ou Fxc5, les Blancs gagnent des échanges ou obligent le fou à reculer.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Le fou c5 devra bien reculer après Ce4 ou Cb3, mais il le fera en d6 ou e7 sans rien perdre. Les Noirs auront fini leur développement avant les Blancs."
   },
   {
    "san": "a6",
    "pourquoi": "Donne au fou c5 la case de repli a7, hors de portée des cavaliers blancs. Si Cb3 ou Ce4 arrive, le fou glisse en a7 et reste actif sur la diagonale vers f2."
   },
   {
    "san": "Bd6",
    "pourquoi": "Recule le fou tout de suite, avant que le cavalier ne le chasse. En d6 il protège e5 et regarde h2. Les Noirs cèdent un peu de pression sur f2, mais la position reste solide et le roque suit."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -22
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2 O-O",
  "sens": "Met le roi à l'abri et relie les tours. Les Noirs ont déjà tout développé sauf le fou c8 ; ils comptent jouer Td8 et Dd6 pour prendre la colonne d.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même chose que les Noirs : le roi à l'abri avant tout. Les Blancs ont un coup de retard en développement, il faut le rattraper sans rien précipiter. Ensuite Cb3 ou Ce4 chasseront le fou c5 au bon moment, roi en sécurité."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il interdit Fg4, qui clouerait le cavalier f3 et gênerait la dame. Après h3, les Blanks roqueront tranquillement. Les Noirs gardent une position agréable mais sans cible."
   },
   {
    "san": "b4",
    "pourquoi": "Chasse le fou c5 tout de suite et prend de l'espace à l'aile dame. Le fou recule en d6 ou e7 sans dommage, mais les Blancs ont gagné un temps et peuvent suivre par Fb2 ou a4. Attention : cela affaiblit un peu c3 et a3."
   }
  ],
  "erreurs": [
   {
    "san": "Ne4",
    "pourquoi": "Semble chasser le fou, mais le cavalier n'est pas défendu : 1...Cxe4 2.dxe4 Dxd1 échange les dames et les Blancs perdent le roque. Résultat : roi blanc coincé au centre, colonne d aux Noirs. Il faut roquer d'abord."
   },
   {
    "san": "b3",
    "pourquoi": "Trop lent. Après 1...a6 2.b4 Fa7, le fou s'est glissé sur la diagonale a7-g1 qui vise le roi blanc. Les Blancs ont dépensé deux coups de pion et n'ont toujours pas roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2 O-O O-O",
  "sens": "Met le roi à l'abri et relie les tours. Les Blancs ont fini le développement de base et préparent Cb3 ou Ce4 pour gagner un temps sur le fou c5.",
  "plan": [
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 : plus de Cg5 ni de Fg5 qui viendraient agacer le cavalier f6 et la dame. Petit coup utile qui ne crée aucune faiblesse réelle ; ensuite Td8 et Fd6 ou Fe7 complètent le développement."
   },
   {
    "san": "a5",
    "pourquoi": "Donne au fou c5 la case de repli a7 et gêne Cb3 : après Cb3, a4 chasse le cavalier. Les Noirs gardent leur fou actif sur la diagonale a7-g1 sans perdre de temps."
   },
   {
    "san": "Bd6",
    "pourquoi": "Retire le fou avant d'être chassé et le pointe vers le roi blanc en h2. Libère aussi c5 pour un pion ou un cavalier ; en échange, la diagonale a7-g1 est abandonnée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2 O-O O-O h6",
  "sens": "prend la case g5 aux pièces blanches : ni cavalier ni fou ne viendront y harceler le cavalier f6 et la dame d7. Coup d'attente utile qui ne fragilise rien ; ensuite Td8 et Fd6 ou Fe7 terminent le développement.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "gagne de l'espace à l'aile dame et prépare a5 ou Fa3 selon les cas ; empêche aussi ...b5 qui chasserait le fou c4. La position reste calme, les Blancs ont un peu plus de place."
   },
   {
    "san": "b4",
    "pourquoi": "chasse le fou c5 avec gain de temps : après ...Fd6 ou ...Fe7, les Blancs jouent a4 puis Fb2 ou Fa3 pour attaquer à l'aile dame. Attention : les pions avancés devront être surveillés plus tard."
   },
   {
    "san": "Re1",
    "pourquoi": "la tour vient sur la colonne e, face au pion e5 : elle prépare Ce4 ou d4 pour ouvrir le centre. Coup de développement naturel qui ne crée aucune faiblesse."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2 O-O O-O h6 a4",
  "sens": "Gagne de l'espace à l'aile dame et fixe le pion b7 : ...b5 ne chassera plus le fou c4. Prépare a5 ou Fa3 pour gêner le fou c5 ; la position reste calme et les Blancs ont un peu plus de place.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "Place la tour sur la colonne du pion e5 : elle le protège et surveille la case e4. Les Noirs achèvent leur développement sans créer de faiblesse ; le fou c8 pourra sortir ensuite en f5 ou g4."
   },
   {
    "san": "a6",
    "pourquoi": "Donne une case de repli au fou c5 en a7 et prépare ...b5 malgré a4 : si axb5 axb5 la tour a8 s'ouvre. Empêche aussi tout Cb5 ou Fb5 gênant."
   },
   {
    "san": "a5",
    "pourquoi": "Bloque le pion a4 : plus de a5 pour les Blancs, et le fou c5 garde sa diagonale sans être inquiété. Petit prix : la case b5 reste aux Blancs, mais sans cavalier blanc proche ce n'est pas grave."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -20
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 c3 d5 exd5 Qxd5 Bc4 Qd7 Nbd2 O-O O-O h6 a4 Re8",
  "sens": "Vient soutenir le pion e5 depuis la colonne e et garde un œil sur e4. Les Noirs terminent leur développement sans affaiblir leur roque ; le fou c8 pourra ensuite sortir en f5 ou en g4.",
  "plan": [
   {
    "san": "a5",
    "pourquoi": "Gagne de l'espace à l'aile dame et fixe le pion a7. Le pion a5 interdit la case b6 au cavalier c6 et prépare parfois a6 pour déranger les pions noirs. Il ne crée aucune faiblesse chez les Blancs."
   },
   {
    "san": "Re1",
    "pourquoi": "Place la tour face à la tour e8, sur la colonne du pion e5. Elle prépare Ne4 ou Nf1-g3, et soutient un futur d4 pour ouvrir le centre. C'est le développement le plus naturel."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou c8 et au cavalier f6. Les Blancs évitent le clouage Bg4 sur la dame et gardent le roi bien abrité, avant de choisir leur plan."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3",
  "nom": "Partie des quatre cavaliers (variante espagnole)",
  "sens": "Défend e4 en développant : les quatre cavaliers sont sortis, la position est symétrique et solide. Les Blancs préparent le petit roque sans se presser.",
  "plan": [
   {
    "san": "Bb4",
    "pourquoi": "Développe le fou en clouant le cavalier c3, qui ne défend plus vraiment e4. Prépare le roque. Copie le coup des Blancs : la symétrie est confortable pour les Noirs."
   },
   {
    "san": "Nd4",
    "pourquoi": "Attaque le fou b5 et force les Blancs à réagir tout de suite. Si Fxd4 ou Cxd4, les Noirs reprennent et simplifient. Un coup actif et sûr, le cavalier central gêne les Blancs."
   },
   {
    "san": "Bd6",
    "pourquoi": "Défend solidement e5 et prépare le roque. Le fou bloque le pion d7 un moment, mais il reviendra ensuite ; en attendant le pion e5 ne peut pas être pris."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "Sort la dame trop tôt et bloque le fou f8, qui ne peut plus se développer. Après 5.O-O les Noirs manquent de bons coups : leur roque est retardé et la dame peut être attaquée."
   },
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier part en balade sans but : rien à attaquer sur g4. Après 5.O-O puis h3 il doit rentrer, et les Noirs ont perdu deux temps de développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -11
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4",
  "nom": "Partie des quatre cavaliers, variante espagnole, défense symétrique",
  "sens": "Cloue le cavalier c3 sur le roi, ce qui affaiblit la protection du pion e4, et prépare le petit roque en copiant simplement la mise en place des Blancs.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité tout de suite et décloue le cavalier c3 : la tour vient en f1 et le roi quitte la diagonale du fou. Après le roque, les Blancs pourront jouer d3 puis Fg5 pour harceler le cavalier f6. Les Noirs répondront souvent O-O eux aussi et la position reste symétrique et calme."
   },
   {
    "san": "d3",
    "pourquoi": "Défend solidement le pion e4, puisque le cavalier c3 ne le protège plus vraiment. Ouvre la diagonale du fou c1, qui pourra sortir en g5 ou en e3. Les Noirs copieront souvent par d6 : les deux camps ont alors un centre fermé et solide."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Échange le fou contre le cavalier c6 avant qu'il ne soit chassé : après dxc6, les Noirs ont des pions doublés sur la colonne c, mais ils ouvrent la ligne de leur fou c8. C'est un choix de structure : les Blancs misent sur la meilleure structure de pions à long terme, en échange de l'activité des pièces noires."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O",
  "nom": "Partie des quatre cavaliers, variante espagnole (ou double Ruy Lopez)",
  "sens": "Met le roi à l'abri et enlève le clouage du cavalier c3 : le roi n'est plus sur la diagonale du fou b4, et la tour f1 pourra venir sur e1 pour soutenir e4. Les Blancs sont prêts à jouer d3 et Fg5.",
  "menace": "Rien d'immédiat. Mais les Blancs préparent Fxc6 suivi de Cxe5 : si le pion e5 n'est défendu que par le cavalier c6, il tombe dès que ce cavalier est échangé.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Le coup le plus simple : le roi est en sécurité et la tour f8 est reliée au jeu. Après Fxc6 bxc6 Cxe5, les Noirs récupèrent le pion avec Dd4 ou Te8, le roi étant hors de danger. La position reste symétrique et calme."
   },
   {
    "san": "Bxc3",
    "pourquoi": "Abîme la structure blanche : après dxc3 les Blancs ont des pions doublés sur la colonne c. En échange, les Noirs donnent leur fou de cases noires et les Blancs gardent la paire de fous. À jouer si on aime les positions solides et sans surprise."
   },
   {
    "san": "Bd6",
    "pourquoi": "Défend e5 une deuxième fois avec le fou : Fxc6 suivi de Cxe5 ne gagne plus de pion. Le fou bloque un peu le pion d7, mais il pourra revenir plus tard. Prépare un roque tranquille."
   }
  ],
  "erreurs": [
   {
    "san": "d6",
    "pourquoi": "Défend e5 mais oublie la case d5 : les Blancs jouent Cd5 ! Le cavalier attaque le cavalier f6 et le fou b4 en même temps. Après Cxd5 exd5, le cavalier c6 est attaqué et le fou b4 reste en l'air : les Noirs perdent du matériel."
   },
   {
    "san": "a6",
    "pourquoi": "Chasse le fou, mais les Blancs échangent : Fxc6 bxc6 Cxe5. Le pion e5 était défendu seulement par le cavalier c6 ; une fois celui-ci disparu, le pion tombe gratuitement. Il fallait d'abord roquer ou défendre e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O",
  "nom": "Partie des quatre cavaliers, variante espagnole (double Ruy Lopez)",
  "sens": "Met le roi à l'abri et relie la tour f8 au jeu avant toute ouverture du centre : si les Blancs prennent en c6 puis en e5, la tour peut venir en e8 et le roi ne craint rien.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "Défend solidement e4 et libère la case c1 pour le fou. Le pion d3 enlève aussi la case e4 au cavalier noir après Fxc3. Les Noirs vont le copier avec d6, et la partie reste calme et symétrique."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Casse la symétrie tout de suite : après bxc6, les pions noirs sont doublés sur la colonne c. Attention : ne pas prendre e5 ensuite, car Te8 et Dd4 récupèrent le pion. L'idée est plutôt d3 puis Ce2 pour garder une structure de pions plus saine."
   },
   {
    "san": "Re1",
    "pourquoi": "Protège e4 une seconde fois sans bouger de pion, et garde l'option d4 d'un coup. Laisse aux Noirs le temps de jouer d6 ou Fxc3, ce qui n'est pas grave : la position reste égale et facile à jouer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 24
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3",
  "nom": "Partie des Quatre Cavaliers, variante espagnole (ou « double Espagnole », position symétrique)",
  "sens": "consolide le centre avant toute chose : le pion e4 est protégé deux fois, le fou c1 peut sortir en g5 et le cavalier noir n'aura jamais la case e4",
  "plan": [
   {
    "san": "Bxc3",
    "pourquoi": "Prend le cavalier tout de suite : après bxc3, les Blancs ont des pions doublés sur la colonne c et ne peuvent plus jouer Cd5 pour attaquer le cavalier f6. Ensuite ...d6 solidifie e5. Les Noirs donnent la paire de fous, mais la position reste simple à jouer."
   },
   {
    "san": "d5",
    "pourquoi": "Casse la symétrie et ouvre le centre : après exd5 Cxd5, le cavalier noir arrive au centre et le fou c8 est libéré. Les Blancs peuvent prendre Fxc6 bxc6 et doubler les pions noirs, mais les Noirs ont les pièces actives et le pion e5 reste solide."
   },
   {
    "san": "d6",
    "pourquoi": "Copie les Blancs : e5 est défendu une deuxième fois et le fou c8 peut sortir. C'est le coup le plus calme ; il faut juste accepter Fg5 (clouage du cavalier f6), que l'on gère avec ...Fxc3 et ...De7."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Coup inutile qui oublie le pion e5 : les Blancs jouent Fxc6 bxc6 puis Cxe5 et gagnent un pion net. Tant que le fou b5 regarde c6, le cavalier c6 est le seul vrai défenseur de e5 ; il ne faut pas perdre un temps."
   },
   {
    "san": "Nb8",
    "pourquoi": "Recule un cavalier déjà développé et abandonne e5 : Cxe5 gagne un pion, et après ...d5 Fa4 les Noirs n'ont aucune compensation. Jamais retirer une pièce du centre sans raison."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3",
  "nom": "Partie des quatre cavaliers, variante espagnole (Fb4 symétrique)",
  "sens": "Échange le fou contre le cavalier c3 avant qu'il ne saute en d5 : les Blancs vont devoir reprendre avec le pion b et doubler leurs pions sur la colonne c.",
  "menace": "Le fou c3 attaque le pion b2 et la tour a1 : si les Blancs ne reprennent pas tout de suite, ils perdent du matériel.",
  "plan": [
   {
    "san": "bxc3",
    "pourquoi": "Reprend la pièce immédiatement. Les pions c2 et c3 sont doublés, mais le pion c3 contrôle d4 et la colonne b s'ouvre pour la tour. Les Blancs gardent la paire de fous et pourront préparer d4 ou Fg5 pour embêter le cavalier f6."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Intercale la prise sur c6 : après ...dxc6 (ou ...bxc6) bxc3, les Noirs ont aussi des pions doublés. Le matériel reste égal et la position est symétrique, mais les Blancs ont renoncé à leur fou espagnol."
   }
  ],
  "erreurs": [
   {
    "san": "Ba4",
    "pourquoi": "Oublie le fou en c3. Après ...Fxb4 (le fou recule en gardant une pièce de plus), les Blancs ont donné un cavalier pour rien : une pièce entière de retard."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe en attaquant f6, mais ignore la menace. Le fou noir prend b2, puis a3 après Tb1 : les Noirs gagnent une pièce et un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3",
  "nom": "Partie des quatre cavaliers, variante espagnole (double Fb4)",
  "sens": "Reprend le fou pour garder le matériel égal : les Blancs acceptent des pions doublés sur la colonne c en échange de la paire de fous et de la colonne b ouverte pour la tour. Le pion c3 soutient une future poussée d4 au centre.",
  "menace": "Fxc6 suivi de Cxe5 : si le cavalier c6 est échangé, le pion e5 n'est plus défendu que par le cavalier f6, et Cxe5 gagne un pion.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Solidifie e5 avec un pion : le pion e5 ne dépend plus du cavalier c6. Ouvre la diagonale du fou c8 pour sortir en g4 ou e6. Les Blancs peuvent jouer Fg5 pour clouer le cavalier f6, mais h6 et g5 pourront le chasser plus tard."
   },
   {
    "san": "Qe7",
    "pourquoi": "Défend e5 une deuxième fois avec la dame et libère la case d8 pour la tour. La dame garde aussi un oeil sur b4 et a3. Laisse aux Blancs le temps de jouer Fg5 ou Te1, mais sans gain immédiat."
   },
   {
    "san": "Re8",
    "pourquoi": "Ajoute la tour sur la colonne e pour soutenir e5 et préparer d5 plus tard. Développement naturel qui ne crée aucune faiblesse. Attention : la case f7 reste défendue par le roi seul, mais aucune attaque n'est encore possible."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou, mais les Blancs répondent Fxc6 bxc6 puis Cxe5 : le pion e5 tombe parce que son seul défenseur, le cavalier c6, a disparu. Les Noirs perdent un pion et ont des pions doublés en plus."
   },
   {
    "san": "Ne7",
    "pourquoi": "Retire le cavalier de c6 pour le rediriger vers g6, mais il défendait e5 : Cxe5 gagne le pion aussitôt. Même la réponse d5 ne récupère rien après Te1, car e4 est bien soutenu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6",
  "nom": "Partie espagnole, défense des quatre cavaliers (variante avec Fb4)",
  "sens": "Donne un vrai pilier au pion e5 et libère le fou c8, qui pourra sortir en g4 (clouer le cavalier f3) ou en e6 : les Noirs ont concédé la paire de fous, mais leur position reste très solide.",
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame d8 : il ne peut plus bouger sans perdre la dame. Cela gêne le coup ...d5 et met la pression sur e5. Si les Noirs jouent h6 puis g5 pour chasser le fou, ils affaiblissent les cases autour de leur roi : c'est exactement ce que cherchent les Blancs avec leur paire de fous."
   },
   {
    "san": "Re1",
    "pourquoi": "Protège e4 une fois de plus et prépare d4 : le pion e4 étant tenu, les Blancs pourront pousser au centre et ouvrir le jeu pour leurs deux fous. Coup tranquille et sans risque, qui ne crée aucune faiblesse."
   },
   {
    "san": "h3",
    "pourquoi": "Empêche ...Fg4, qui clouerait le cavalier f3 et gênerait la poussée d4. Les Blancs préparent calmement le centre ; en échange, ils laissent aux Noirs un coup pour terminer leur développement avec ...Ce7 ou ...Dd7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5",
  "nom": "Partie des quatre cavaliers, variante espagnole (ligne avec Fxc3)",
  "sens": "Cloue le cavalier f6 sur la dame d8 pour l'immobiliser : il ne peut plus défendre d5 ni bouger sans perdre la dame. Les Blancs veulent provoquer h6 et g5, qui aèrent le roi noir, ou profiter du cavalier figé pour pousser d4 et presser e5 avec la paire de fous.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Le cavalier c6 quitte la portée du fou b5 et se dirige vers g6 : de là il couvre f4 et h4 et protège le roi. Il libère aussi la case c6 pour le pion c7, ce qui chasse plus tard le fou blanc. Les Blancs gardent la paire de fous mais n'ont pas de cible immédiate."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame quitte la diagonale du fou g5 : le clouage disparaît, le cavalier f6 est de nouveau libre. Elle garde un oeil sur e5 et prépare Cd8 ou Fe6. Attention : il faut vérifier que le cavalier c6 reste défendu quand les Blancs jouent Fxc6."
   },
   {
    "san": "h6",
    "pourquoi": "Pose la question au fou : s'il recule en h4, le clouage reste mais Les Noirs peuvent le casser avec g5 ou De7 ; s'il prend en f6, les Noirs reprennent de la dame et obtiennent un bon pion e5 bien couvert. Ce coup n'affaiblit pas encore le roi, tant qu'on ne pousse pas g5 trop vite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5 Ne7",
  "nom": "Partie des quatre cavaliers, variante espagnole (variante Svenonius)",
  "sens": "Soustrait le cavalier à la portée du fou b5 et le dirige vers g6, d'où il surveillera f4 et h4 et protégera le roi. Libère aussi c6 pour le pion c7, qui chassera le fou blanc plus tard. Les Blancs gardent la paire de fous mais n'ont pas de cible immédiate.",
  "plan": [
   {
    "san": "Nh4",
    "pourquoi": "Le cavalier quitte f3 pour laisser passer la dame vers f3, où elle appuie le clouage du cavalier f6. Il prépare aussi f4 et vise la case f5. Les Noirs répondront ...Ng6 pour couvrir f4 et h4, mais les Blancs ont déjà pris l'initiative sur l'aile roi."
   },
   {
    "san": "Bc4",
    "pourquoi": "Le fou recule avant d'être chassé par ...c6 et se place sur une diagonale active : il regarde f7, près du roi noir. Coup prudent, qui garde la paire de fous. Les Noirs continuent tranquillement ...Ng6 ou ...c6."
   },
   {
    "san": "Bxf6",
    "pourquoi": "Prend le cavalier qui défend le roi : après ...gxf6 les pions noirs sont abîmés et la case h5 reste faible pour la dame blanche. En échange, les Blancs rendent la paire de fous et les Noirs obtiennent le pion f6 qui tient e5 et le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5 Ne7 Nh4",
  "nom": "Partie espagnole, défense des quatre cavaliers (variante avec 4.Cc3 Fb4)",
  "sens": "Libère la case f3 pour la dame, qui viendra renforcer le clouage du cavalier f6. Prépare aussi f4 pour ouvrir la colonne f, et vise la case f5 d'où le cavalier gênerait le roi noir.",
  "menace": "Df3 puis f4 : la dame s'empile sur le cavalier cloué et l'attaque sur l'aile roi devient dangereuse.",
  "plan": [
   {
    "san": "Ng6",
    "pourquoi": "Le cavalier e7 va en g6 : il propose l'échange du cavalier h4, couvre f4 et h4, et protège indirectement le roi. Si les Blancs prennent en g6, le pion h reprend et ouvre la colonne h pour la tour noire. C'est la réponse la plus naturelle et la plus solide."
   },
   {
    "san": "c6",
    "pourquoi": "Chasse le fou b5 et prépare ...d5 pour ouvrir le centre : quand on est attaqué sur une aile, on réagit au centre. Le fou devra reculer, ce qui fait perdre un temps aux Blancs."
   },
   {
    "san": "d5",
    "pourquoi": "Frappe tout de suite au centre : si exd5, le cavalier reprend et le clouage disparaît. Les Noirs acceptent un centre un peu ouvert, mais le roi blanc n'a plus le temps d'attaquer tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Rb8",
    "pourquoi": "Mettre la tour sur la colonne b ouverte semble logique, mais c'est trop lent : après f4 Cg6 fxe5, les Blancs ouvrent la colonne f, gagnent le pion e5 et le cavalier f6 cloué souffre. L'attaque sur l'aile roi va plus vite que la pression sur b2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -10
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5 Ne7 Nh4 Ng6",
  "nom": "Partie des quatre cavaliers, variante espagnole (double espagnole)",
  "sens": "Remet le cavalier au contact du cavalier h4 pour l'échanger, bouche la case g6 devant le roi et couvre f4 et h4 ; les Noirs comptent sur la paire de pions doublés c3 pour tenir la partie égale.",
  "plan": [
   {
    "san": "Nxg6",
    "pourquoi": "Échange tout de suite : après ...hxg6, le pion h6 n'existe plus et le fou g5 reste cloué sur le cavalier f6 sans être chassé. La colonne h s'ouvre pour les Noirs, mais le roi blanc est loin et la tour noire n'a pas de cible."
   },
   {
    "san": "Bc4",
    "pourquoi": "Replace le fou sur la diagonale a2-g8, vers f7 et le roi noir. Le fou ne faisait plus rien en b5 depuis que le cavalier c6 est parti en e7. Laisse aux Noirs le temps de jouer ...h6 ou ...Cxh4."
   },
   {
    "san": "d4",
    "pourquoi": "Ouvre le centre avec le pion : les deux fous blancs veulent des diagonales. Si ...exd4 cxd4, les pions doublés disparaissent et les Blancs ont un centre e4-d4. Laisse aux Noirs la case f4 et un échange en h4."
   }
  ],
  "erreurs": [
   {
    "san": "a3",
    "pourquoi": "Pousse un pion pour rien : le fou noir qu'il voulait chasser est déjà parti en c3. Les Noirs répondent ...h6, le fou g5 doit bouger, et après Cxg6 fxg6 ils obtiennent la colonne f ouverte pour leur tour, un tempo gagné et un roi bien couvert."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5 Ne7 Nh4 Ng6 Nxg6",
  "sens": "prend le cavalier g6 avant qu'il ne soit délogé : le fou g5 garde son clouage sur f6, et les Blancs évitent ...h6 suivi de ...g5 qui chasserait leurs pièces. Le cavalier h4 était aussi mal placé en bord d'échiquier ; l'échange le fait disparaître sans perte de temps.",
  "menace": "Le cavalier g6 est en prise : il faut le reprendre tout de suite, sinon les Noirs perdent une pièce.",
  "plan": [
   {
    "san": "fxg6",
    "pourquoi": "Reprend avec le pion f. La colonne f s'ouvre pour la tour f8, qui regarde maintenant f2 et soutient le cavalier f6. Le pion h7 reste à sa place et protège le roi. Les pions g6 et g7 sont doublés, mais ils forment un bouclier solide devant le roi."
   },
   {
    "san": "hxg6",
    "pourquoi": "Reprend avec le pion h et ouvre la colonne h. Le roi noir perd son pion h et le cavalier f6 reste cloué sans pouvoir être libéré par ...h6, mais la structure est saine et les Noirs peuvent ensuite jouer ...Fe6, ...Dd7 et ...Tae8. Un peu moins précis que fxg6 car la tour f8 reste enfermée."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Oublie que le cavalier g6 est en prise. Après Fxf6 Dxf6 Cxf8, les Blancs ont pris une tour et une pièce contre un fou : une qualité et un pion de perdus. D'abord reprendre, ensuite chasser le fou."
   },
   {
    "san": "Bg4",
    "pourquoi": "Attaque la dame mais laisse le cavalier g6 en prise. Les Blancs jouent Fxf6 : si le fou prend la dame en d1, Fxd8 et le cavalier g6 s'échappe en f8 ou prend encore. Les Noirs finissent avec une pièce de moins. Une menace ne remplace pas une reprise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Bg5 Ne7 Nh4 Ng6 Nxg6 fxg6",
  "nom": "Défense berlinoise (par transposition : Quatre Cavaliers espagnole)",
  "sens": "Reprend vers le centre et ouvre la colonne f pour la tour f8, qui soutient le cavalier f6 cloué et vise f2 ; le pion h7 reste devant le roi.",
  "menace": "Pas de menace directe : les Noirs veulent ensuite ...h6 ou ...Dd7 pour chasser le fou g5 et libérer le cavalier f6 du clouage.",
  "plan": [
   {
    "san": "Bc4+",
    "pourquoi": "Échec sur la diagonale a2-g8, ouverte depuis que f7 a disparu. Le roi doit aller en h8 (ou les Noirs jouent ...d5, ce qui affaiblit e5 et e6). Les Blancs gagnent un temps, placent le fou sur sa meilleure diagonale et gardent le clouage du cavalier f6. Après ...Rh8, Fxf6 Txf6 ou gxf6 reste possible pour abîmer encore les pions noirs."
   },
   {
    "san": "f4",
    "pourquoi": "Ouvre la colonne f à leur tour pour la tour f1 et attaque le centre noir. Si ...exf4, Fxf4 reprend avec le fou, qui regarde d6. Les Blancs disputent la colonne f au lieu de la laisser aux Noirs. Attention : le roi blanc est un peu plus à l'air, mais les Noirs n'ont plus de fou de cases noires pour en profiter."
   },
   {
    "san": "d4",
    "pourquoi": "Pousse au centre avec le soutien du pion c3 et de la dame. Cela ouvre le jeu pour la paire de fous, le grand avantage des Blancs ici. Si ...exd4, cxd4 répare les pions doublés et donne un beau centre e4-d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 11
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4",
  "nom": "Défense Bird (variante 4.Fc4)",
  "sens": "Garde le fou actif sur la diagonale a2-g8, vers f7, sans échanger tout de suite. Laisse au cavalier d4 le soin de se justifier : s'il prend en f3, la dame reprend et surveille le centre.",
  "menace": "Aucune menace directe. Mais le fou vise f7 : avec Cg5 et Cxf7, les Noirs devront bientôt protéger ce point faible.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe une pièce et attaque e4. Le cavalier f6 protégera aussi d5 et h7. Après Cxd4 exd4, le centre noir tient."
   },
   {
    "san": "Nxf3+",
    "pourquoi": "Échange le cavalier d4, qui ne doit plus bouger deux fois. Après Dxf3, la dame blanche est sortie tôt : les Noirs la viseront avec Cf6 et c6-d5."
   },
   {
    "san": "d6",
    "pourquoi": "Solidifie e5 et ouvre la diagonale au fou c8. C'est le coup calme : le cavalier d4 pourra reculer sans que e5 tombe."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Le pion a6 n'attaque plus rien : le fou est déjà parti en c4. Les Blancs jouent Cxd4 exd4 puis roquent, et les Noirs ont perdu un temps pour rien."
   },
   {
    "san": "c5",
    "pourquoi": "Veut soutenir le cavalier d4, mais c'est trop lent. Après Cxd4 exd4, le pion d4 est isolé et la case d5 affaiblie : le fou c4 et un futur cavalier d5 en profitent."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6",
  "nom": "Défense Bird, variante 4.Fc4",
  "sens": "développe une pièce et attaque le pion e4, pour obliger les Blancs à réagir au lieu de poursuivre tranquillement leur développement",
  "menace": "Cxe4, qui gagne un pion au centre",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Échange le cavalier noir centralisé. Après exd4, le pion noir en d4 est isolé et bloque sa propre diagonale. Les Blancs pourront ensuite jouer d3 et roquer tranquillement, mais e4 reste à défendre."
   },
   {
    "san": "Nc3",
    "pourquoi": "Défend e4 en développant une pièce. Simple et sain : le fou c4 et le cavalier c3 regardent le centre. Les Noirs peuvent alors prendre en f3 pour abîmer les pions blancs, mais cela leur coûte du temps."
   },
   {
    "san": "d3",
    "pourquoi": "Protège e4 avec un pion et libère le fou c1. Solide, mais un peu passif : les Noirs ont le temps de jouer d5 ou de prendre en f3."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "Prend un pion mais oublie que e4 pend aussi. Après De7 les Noirs regagnent le pion sur e4 ou e5, avec une pièce centralisée en d4 et une attaque déjà prête contre le roi blanc."
   },
   {
    "san": "Be2",
    "pourquoi": "Recule le fou pour couvrir f3, mais e4 n'est plus défendu : Cxe4 gagne un pion net. Les Blancs ont dépensé trois coups de fou pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4",
  "nom": "Défense Bird (variante Cd4), ligne 4.Fc4",
  "sens": "Prend le cavalier noir centralisé en d4 pour le supprimer : il gênait le développement blanc et visait b5 et c2. Après la reprise par le pion, les Noirs auront un pion isolé en d4 qui bouche leur propre diagonale.",
  "menace": "Le cavalier blanc en d4 est en prise et a déjà gagné une pièce : si les Noirs ne reprennent pas tout de suite, ils restent avec un cavalier de moins.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Le seul coup : reprend le cavalier et rétablit l'égalité de matériel. Le pion d4 est isolé mais il prend de l'espace et gêne le cavalier b1. Ensuite les Noirs continueront par c6 et d5 pour chasser le fou c4 et ouvrir le jeu."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Semble rendre coup pour coup, mais les Blancs jouent De2 : le cavalier e4 est cloué sur le roi et les Noirs n'ont toujours pas repris en d4. Ils finissent avec une pièce de moins."
   },
   {
    "san": "Bc5",
    "pourquoi": "Attaque le cavalier d4 au lieu de le prendre. Les Blancs le mettent simplement à l'abri en b3, gardent leur pièce de plus et chassent ensuite le fou avec d4. On ne menace pas ce qu'on peut capturer gratuitement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -37
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "Reprend le cavalier pour rétablir l'égalité de matériel. Le pion d4 est isolé, mais il prend de l'espace et empêche le cavalier b1 d'aller en c3. Les Noirs préparent c6 et d5 pour chasser le fou c4 et ouvrir le centre.",
  "menace": "Cxe4 : le pion e4 n'est plus défendu par un cavalier, et si Fxf7+ Rxf7 les Noirs gardent une pièce de plus.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et laisse e4 en prise : sur Cxe4, Te1 attaque le cavalier cloué sur le roi, et les Blancs reprennent le pion avec avantage de développement. Les Noirs répondront plutôt par c6 et d5."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 tout simplement et ouvre la diagonale du fou c1. Les Blancs rouleront ensuite O-O, Cd2 et f4 pour attaquer au centre. Le pion d4 reste bloqué et pourra être attaqué plus tard par Cb3."
   },
   {
    "san": "e5",
    "pourquoi": "Chasse le cavalier f6 et gagne de l'espace au centre. Après Ce4 ou d5, les Blancs jouent O-O et d3 ; le pion e5 gêne le développement noir mais devra être soutenu."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Attaque le pion d4 mais oublie e4 : Cxe4 gagne un pion, et après De2 d5 le cavalier est solidement défendu. Le fou c4 doit reculer et les Noirs gardent le pion."
   },
   {
    "san": "Bb3",
    "pourquoi": "Retire le fou de l'attaque c6-d5, mais laisse e4 sans défense : Cxe4 gagne un pion. Le sacrifice Fxf7+ Rxf7 ne rapporte rien, les Blancs perdent une pièce."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O",
  "nom": "Partie espagnole, variante Bird",
  "sens": "Met le roi à l'abri et laisse e4 en prise : sur Cxe4, Te1 attaque le cavalier cloué sur le roi, et les Blancs reprennent le pion avec avantage de développement. Les Noirs répondront plutôt par c6 et d5.",
  "menace": "e5 chassant le cavalier f6, puis Te1 ou Dh5 : le pion d4 isolé et le roi noir resté au centre deviennent des cibles.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Frappe le centre tout de suite : le fou c4 est attaqué, e4 doit se décider, et le fou c8 s'ouvre. Après exd5 Cxd5, le cavalier est bien placé et les Noirs peuvent roquer vite. Ne craignez pas Fb5+ : c6 repousse le fou."
   },
   {
    "san": "c6",
    "pourquoi": "Prépare d5 en solidité : le pion c6 enlève d5 et b5 au fou blanc, et d5 viendra au coup suivant avec gain de temps. Plus lent que d5 immédiat, mais sans aucune tactique à calculer."
   },
   {
    "san": "Nxe4",
    "pourquoi": "Prendre le pion est jouable, mais seulement si vous connaissez la suite : sur Te1, d5 défend le cavalier et attaque le fou c4. Un peu moins bon que d5 car les Blancs gagnent du temps sur votre cavalier et votre roi n'est pas encore roqué."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Trop passif : les Blancs jouent e5 et chassent le cavalier. Après Cxe4, Dg4 attaque le cavalier et le pion g7 en même temps ; les Noirs perdent du matériel ou se font ouvrir le roi."
   },
   {
    "san": "Bb4",
    "pourquoi": "Le fou sort sans but : a3 le chasse, et après d5, axb4 le gagne simplement. Développez d'abord avec un coup de pion central qui ne donne pas de cible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -33
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5",
  "nom": "Partie espagnole, variante Bird",
  "sens": "Frappe le centre tout de suite : le fou c4 est attaqué, le pion e4 doit se décider et le fou c8 s'ouvre vers g4 et f5. Le pion d4 déjà avancé donne aux Noirs un espace solide.",
  "menace": "dxc4 gagne le fou c4 pour un pion",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Le seul bon coup : le pion e4 prend d5 et protège ainsi le fou c4, puisque dxc4 n'est plus possible. Après Cxd5 le cavalier noir est bien placé au centre, mais les Blancs ont un fou actif, le roque fait et pourront jouer d3 puis Te1 ou Fb5+ pour gêner le développement noir."
   }
  ],
  "erreurs": [
   {
    "san": "Bb5+",
    "pourquoi": "Donner échec paraît tentant, mais c6 repousse le fou avec gain de temps, puis Cxe4 prend un pion central. Le fou aura bougé trois fois pour rien et les Blancs ont perdu un pion."
   },
   {
    "san": "d3",
    "pourquoi": "Défendre e4 par d3 oublie le fou c4 : dxc4 le prend pour un pion. Avant de défendre e4, il faut d'abord régler le sort du fou attaqué, et exd5 fait les deux à la fois."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5",
  "nom": "Défense Bird",
  "sens": "Prend le pion offert en d5 et, du même coup, écarte la menace dxc4 sur le fou c4. Les Blancs gardent un pion de plus pour l'instant et un fou actif qui vise f7.",
  "menace": "Le pion d5 attaque le cavalier f6 ? Non : il est en d5, il menace simplement de rester un pion de plus ; si les Noirs tardent, les Blancs jouent d3 et Te1 pour consolider.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe et prépare le roque sans se presser : le pion d5 ne s'enfuira pas, le cavalier le reprendra plus tard. Le fou en e7 ne gêne pas le pion d4 et laisse la case d6 à la dame si besoin."
   },
   {
    "san": "Nxd5",
    "pourquoi": "Reprend tout de suite le pion : le matériel est égal et le cavalier est bien centralisé en d5. Attention ensuite à Te1+ et Fb5+, qui gênent le roque ; il faudra jouer Fe7 et O-O rapidement."
   }
  ],
  "erreurs": [
   {
    "san": "Bd6",
    "pourquoi": "Le fou vient en d6, mais après De2+ le roi noir doit aller en f8 (Fe7 ne couvre plus) : plus de roque possible, et le pion d5 reste blanc."
   },
   {
    "san": "Bg4",
    "pourquoi": "Attaque la dame, mais f3 chasse le fou et après Ff5 Te1+ les Noirs sont en retard de développement, roi coincé au centre et toujours un pion de moins."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Développe le fou et prépare le petit roque sans se précipiter : le pion d5 est bloqué, le cavalier f6 le reprendra plus tard. Le fou en e7 ne gêne pas le pion d4 et laisse la case d6 libre pour la dame.",
  "menace": "Reprendre le pion d5 par Cxd5 et égaliser le matériel.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "Ouvre la diagonale du fou c1 et protège le fou c4. Les Blancs gardent le pion d5 un moment de plus et préparent Te1 pour occuper la colonne e ouverte. Les Noirs reprendront sans doute en d5, mais les Blancs auront un développement plus fluide."
   },
   {
    "san": "Re1",
    "pourquoi": "Occupe tout de suite la colonne e ouverte et cloue le fou e7 sur le roi tant que les Noirs n'ont pas roqué. Si ...Cxd5, le fou e7 reste gênant à défendre et les Noirs doivent roquer vite."
   },
   {
    "san": "Qf3",
    "pourquoi": "Sort la dame en défendant d5 une fois de plus : le pion est pris deux fois et défendu deux fois, donc ...Cxd5 est impossible pour l'instant. Attention toutefois : la dame sortie tôt peut être attaquée plus tard par ...Fg4 après le départ du pion d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 33
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Ouvre la diagonale du fou c1 et consolide le fou c4, qui est désormais protégé par un pion. Les Blancs ne défendent pas le pion d5 directement : ils préfèrent développer vite et préparer Te1 sur la colonne e ouverte.",
  "plan": [
   {
    "san": "Nxd5",
    "pourquoi": "Reprend le pion tout de suite et rétablit l'égalité matérielle. Le cavalier est bien placé au centre ; si le fou c4 le prend, la dame reprend en d5 et les Noirs ont un bon jeu. Attention ensuite à Te1 : il faudra roquer vite."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant de reprendre le pion. Le pion d5 ne s'enfuit pas : il reste attaqué par le cavalier f6 et la dame. Après le roque, les Noirs reprennent en d5 avec un roi en sécurité face à Te1."
   }
  ],
  "erreurs": [
   {
    "san": "Bd7",
    "pourquoi": "Coup de développement mou qui ne reprend pas le pion. Après a4 et h3 les Blancs gardent leur pion d5 en plus, le fou d7 ne fait rien et la colonne e reste aux Blancs. Il faut d'abord récupérer le pion."
   },
   {
    "san": "Qd6",
    "pourquoi": "La dame sort trop tôt pour récupérer d5. Les Blancs jouent Df3 et défendent le pion tout en préparant Te1 ; la dame noire devient une cible et les Noirs restent un pion en moins."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3 Nxd5",
  "nom": "Variante Bird (3...Cd4)",
  "sens": "reprend le pion tout de suite et rétablit l'égalité matérielle ; le cavalier s'installe au centre et libère la case f6 pour le roque rapide",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Met la tour sur la colonne ouverte face au roi noir encore au centre : le fou e7 est cloué tant que les Noirs n'ont pas roqué. Les force à roquer vite plutôt qu'à développer leurs pièces."
   },
   {
    "san": "Nd2",
    "pourquoi": "Développe le dernier cavalier vers e4 ou f3, d'où il attaquera le pion isolé d4 et la case d5. Garde le roque sain ; laisse aux Noirs le temps de roquer, mais sans contre-jeu."
   },
   {
    "san": "Qf3",
    "pourquoi": "Attaque le cavalier d5 une seconde fois (avec le fou c4) et vise f7 : les Noirs doivent répondre précisément, par exemple ...Fe6 ou ...Cb6. Si le cavalier bouge mal, le pion d4 ou b7 tombe."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 22
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3 Nxd5 Re1",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Place la tour sur la colonne ouverte en face du roi noir resté au centre : le fou e7 est cloué et ne peut plus bouger sans perdre le roi. Oblige les Noirs à roquer vite au lieu de développer tranquillement.",
  "menace": "Pas de menace immédiate, mais le fou e7 est cloué : tout coup qui le laisse sans défense (par exemple après Fg5 ou De2) coûte une pièce.",
  "plan": [
   {
    "san": "Be6",
    "pourquoi": "Développe le fou en interposant un défenseur sur la colonne e : le fou e7 n'est plus seul face à la tour. Protège aussi le cavalier d5 contre Fc4. Après Fxe6 fxe6, les Noirs roquent et leur roi est en sécurité. Les Blancs gardent une petite avance d'espace, rien de plus."
   }
  ],
  "erreurs": [
   {
    "san": "Nb4",
    "pourquoi": "Déplace le seul défenseur du roi et gêne rien. Les Blancs jouent Fg5 : le fou e7 est attaqué et cloué, il ne peut pas fuir. Après Fe6 Fxe6 fxe6 Fxe7, les Noirs perdent une pièce entière."
   },
   {
    "san": "Nf6",
    "pourquoi": "Semble recentrer le cavalier, mais le cavalier f6 bloque la case de fuite du fou et le roi reste au centre. Les Blancs jouent De2 : la pression sur e7 double, le fou ne peut toujours pas bouger et les Noirs doivent perdre du temps pour ne pas lâcher de matériel."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3 Nxd5 Re1 Be6",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Interpose un défenseur sur la colonne e : le fou e7 n'est plus seul face à la tour e1. Protège aussi le cavalier d5, visé par le fou c4, et prépare le petit roque. Si Fxe6 fxe6, la colonne f s'ouvre pour la tour noire après le roque.",
  "plan": [
   {
    "san": "Nd2",
    "pourquoi": "Développe la dernière pièce mineure vers e4 ou f3, d'où le cavalier attaquera le pion d4 et la case f6. Toutes les pièces blanches sont alors prêtes ; les Noirs roquent et la partie reste équilibrée, avec un peu plus d'espace pour les Blancs."
   },
   {
    "san": "h3",
    "pourquoi": "Coup de prudence : enlève la case g4 au fou e6 et au cavalier, pour que le roi blanc ne soit pas gêné plus tard. Les Blancs attendent le roque noir avant de choisir où mettre leur cavalier b1."
   },
   {
    "san": "Qh5",
    "pourquoi": "Sort la dame en attaquant d5 une deuxième fois (avec le fou c4) et en regardant h7. Les Noirs doivent répondre précisément par c6 ou Cb6 ; s'ils roquent trop vite, Fxd5 gagne du matériel. Après la bonne réponse, la dame devra souvent revenir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 20
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3 Nxd5 Re1 Be6 Nd2",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Sort la dernière pièce mineure pour l'envoyer en e4 ou f3 : de là, le cavalier visera le pion d4, la case c5 et la case f6, tout en libérant la dame et la tour a1. Toutes les pièces blanches seront alors en jeu face à un roi noir encore au centre.",
  "menace": "Ce4 puis Cc5 pour attaquer le fou e6 et le pion b7 ; si les Noirs tardent à roquer, la tour e1 peut même sacrifier Txe6 fxe6 Dg4 avec une double attaque sur e6 et g7.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout : la colonne e cesse d'être dangereuse, et la tour f8 va pouvoir venir en e8. Les Blancs gardent un peu plus d'espace, mais la partie est équilibrée."
   },
   {
    "san": "c5",
    "pourquoi": "Soutient le pion d4 avec le pion c, pour que le cavalier d5 ne soit plus attaché à sa défense. Attention : le roi est encore au centre, il faudra roquer juste après."
   },
   {
    "san": "a6",
    "pourquoi": "Enlève la case b5 au fou blanc et prépare b5 pour chasser le fou c4, qui regarde le cavalier d5. Coup utile, mais le roque reste plus urgent."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Un coup de pion inutile alors que le roi est au centre : 11.Txe6! fxe6 12.Dg4 attaque à la fois e6 et g7, et les Noirs perdent du matériel ou leur roque."
   },
   {
    "san": "Bf6",
    "pourquoi": "Semble actif, mais après 11.Ce4 le cavalier arrive en c5 avec tempo sur le fou e6 et le pion b7 ; la dame d8 n'a plus de case naturelle et les Blancs prennent l'initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 Nf6 Nxd4 exd4 O-O d5 exd5 Be7 d3 Nxd5 Re1 Be6 Nd2 O-O",
  "nom": "Défense Bird (3...Cd4), variante 4.Fc4",
  "sens": "Met le roi à l'abri avant tout : la colonne e cesse d'être dangereuse, et la tour f8 va pouvoir venir en e8. Les Blancs gardent un peu plus d'espace, mais la partie est équilibrée.",
  "plan": [
   {
    "san": "Qh5",
    "pourquoi": "Sort la dame avec gain de temps : elle appuie le fou c4 contre le cavalier d5 et lorgne la case g5 (après Cf3-g5, f7 et h7 seraient visés). Les Noirs doivent répondre précisément, par exemple ...Cf6 ou ...Fg5, pour ne pas perdre le pion d4."
   },
   {
    "san": "Nf3",
    "pourquoi": "Ramène le cavalier au centre et attaque tout de suite le pion isolé d4. Il libère aussi la case d2 pour le fou c1. Les Noirs défendront d4 par ...c5, mais ce pion reste une cible pour toute la partie."
   },
   {
    "san": "Ne4",
    "pourquoi": "Centralise le cavalier sur une case forte d'où il regarde c5 et g5. Il prépare Fg5 ou Dh5 pour gêner le roque noir. En échange, le cavalier peut être chassé par ...f5, ce qui affaiblit un peu le roi noir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4",
  "nom": "Défense Bird (3...Cd4) avec 4.Fa4",
  "sens": "Retire le fou sur une case où il reste actif : il garde la diagonale a4-e8, échappe au gain de temps ...c6 puis ...d5, et laisse les Blancs reprendre tranquillement en d4 avec le cavalier.",
  "menace": "Prendre en d4 avec le cavalier (Cxd4 exd4), puis roquer et gagner du temps contre le pion isolé en d4.",
  "plan": [
   {
    "san": "Nxf3+",
    "pourquoi": "Le cavalier a fait son travail : il échange avant d'être chassé. Après Dxf3, la dame blanche sort tôt et pourra être visée par ...Cf6 ou ...c6 et ...d5. Les Noirs gardent une structure saine, sans pion isolé en d4."
   },
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, pointée sur f2, et protège le cavalier de d4. Si les Blancs prennent en d4, exd4 et le fou défend le pion ; on roque ensuite. Laisse aux Blancs c3 pour attaquer le pion."
   },
   {
    "san": "c6",
    "pourquoi": "Prépare ...d5 pour ouvrir le centre et ...b5 pour chasser le fou. Donne une case de recul au cavalier en d4 et limite la diagonale a4-e8. Plus lent : les Blancs ont le temps de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Un coup qui ne fait rien : e5 n'est plus défendu. Après Cxe5, la contre-attaque ...Dg5 échoue sur Cg4 et les Noirs ont simplement perdu un pion."
   },
   {
    "san": "Bb4",
    "pourquoi": "Le fou s'expose : c3 l'attaque et chasse en même temps le cavalier. Après ...Cxf3+ Dxf3, le fou doit reculer encore et les Noirs ont perdu deux temps dans l'ouverture."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Échange son cavalier avant qu'il ne soit chassé par c3, en donnant échec : les Blancs doivent reprendre tout de suite et n'ont pas le temps de roquer ni de développer.",
  "menace": "Le cavalier en f3 prend la dame en d1 : il faut le reprendre immédiatement.",
  "plan": [
   {
    "san": "Qxf3",
    "pourquoi": "Reprend le cavalier avec la dame, seul coup correct : la pièce est récupérée et le roi reste prêt à roquer. La dame en f3 est un peu exposée (...Nf6, ...c6 puis ...d5 la gêneront), mais elle vise f7 et les Blancs gardent une petite avance de développement."
   }
  ],
  "erreurs": [
   {
    "san": "Kf1",
    "pourquoi": "Le roi bouge pour éviter de sortir la dame, mais le cavalier reste en vie : il recule en g5 puis e6 et les Blancs ont perdu une pièce entière, le droit de roquer et beaucoup de temps."
   },
   {
    "san": "Ke2",
    "pourquoi": "Même idée, encore pire : le cavalier revient en d4 avec échec, le roi doit rentrer en e1, puis ...b5 attaque le fou a4. Une pièce de moins et le roi coincé au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3",
  "nom": "Partie espagnole, variante Bird",
  "sens": "Reprend le cavalier avec la dame : le matériel est rétabli, le roi blanc peut encore roquer, et la dame vise f7 tout en surveillant la colonne f.",
  "menace": "Aucune menace immédiate : f7 est encore défendu par le roi, mais Dxf7 deviendra une idée si les Noirs négligent cette case.",
  "plan": [
   {
    "san": "c6",
    "pourquoi": "Chasse d'abord le fou d'a4 de la diagonale a4-e8 et prépare ...d5 : le centre noir prend de l'espace et la dame en f3 sera gênée. Le pion c6 ôte la case c6 au cavalier, mais le développement par ...Cf6, ...Fd6 et le roque suit sans problème."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4 : la dame doit s'occuper de ce pion, ce qui freine les Blancs. Prépare ...Fe7 ou ...Fd6 puis le roque. Les Blancs peuvent jouer d3 ou Cc3 pour défendre, mais les Noirs ont gagné un temps."
   },
   {
    "san": "Bd6",
    "pourquoi": "Protège solidement e5 et met en route le petit roque après ...Cf6. Coup tranquille qui ne crée aucune faiblesse ; il laisse seulement un peu d'initiative aux Blancs après d4 ou Cc3."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "La dame bloque le fou de f8 et empêche le roque rapide. Après d4 exd4 O-O, les Blancs sont développés, le roi noir traîne au centre et la dame en e7 gêne ses propres pièces."
   },
   {
    "san": "a6",
    "pourquoi": "Chasse un fou qui ne menace rien : perte de temps. Après Dg3, le pion e5 est attaqué ; les Noirs doivent jouer ...De7 et les Blancs roquent avec une avance de développement nette."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -16
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6",
  "nom": "Variante Bird (Partie espagnole)",
  "sens": "Chasse le fou d'a4 de la diagonale a4-e8 et prépare ...d5 : les Noirs veulent prendre de l'espace au centre et gêner la dame en f3. La case c6 est ôtée au cavalier, mais ...Cf6, ...Fd6 et le roque suivent sans problème.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Après ...d5, les Blancs répondent exd5 et le roi est déjà en sécurité pour la suite. Laisse aux Noirs le choix de ...d5 ou ...Cf6."
   },
   {
    "san": "c3",
    "pourquoi": "Prépare d4 : les Blancs veulent eux aussi occuper le centre. Donne une case de retraite au fou en c2 si ...b5 vient. Petit inconvénient : le cavalier b1 perd sa case c3."
   },
   {
    "san": "d3",
    "pourquoi": "Solidifie e4 avant ...d5, ouvre la diagonale au fou c1 et prépare Cc3 et le roque. Coup modeste mais sans faille : les Noirs ne gagnent rien avec ...d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 24
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O",
  "nom": "Défense Bird (variante du cavalier d4)",
  "sens": "Met le roi à l'abri sur l'aile roi et relie les tours, avant toute ouverture du centre. La dame reste active en f3, prête à viser f7 ou d5. Laisse aux Noirs le soin de choisir leur structure.",
  "plan": [
   {
    "san": "Qf6",
    "pourquoi": "Propose l'échange des dames : sans dame, la pression blanche sur f7 disparaît. Si les Blancs échangent, le pion e5 reste solide et les Noirs développent tranquillement. Si les Blancs refusent, la dame noire garde un œil sur f2 et e5."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4 : les Blancs doivent déjà réagir. Prépare ...Fe7 et ...O-O, le plan le plus simple pour un débutant. Attention ensuite à bien surveiller la case d5 avant de pousser ...d5."
   },
   {
    "san": "d6",
    "pourquoi": "Solidifie e5 et ouvre la diagonale du fou c8. Le pion c6 et le pion d6 forment un petit mur qui tient le centre. Laisse aux Blancs le temps de jouer d4, mais la position noire reste très sûre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "propose l'échange des dames sur f3 : si les Blancs ne bougent pas la dame, les Noirs prennent eux-mêmes et abîment la structure blanche ; sinon la dame noire surveille f2 et protège e5",
  "menace": "Dxf3 suivi de gxf3 : les pions blancs du roque sont doublés et le roi blanc devient moins sûr",
  "plan": [
   {
    "san": "Qg3",
    "pourquoi": "refuse l'échange en gardant la dame active : elle vise e5 et g7, donc le fou f8 ne peut pas sortir librement. Les Blancs préparent d3, Cc3 et f4 pour ouvrir le centre. Les Noirs doivent encore trouver comment développer leur fou-roi."
   },
   {
    "san": "Qe3",
    "pourquoi": "s'écarte en restant au centre : la dame défend e4, regarde e5 et laisse la colonne f libre pour f4 plus tard. Après d3 et Cc3, les Blancs ont un jeu facile. Les Noirs vont jouer d6 et Ce7 sans vraie contre-attaque."
   },
   {
    "san": "Qxf6",
    "pourquoi": "accepte l'échange : après Cxf6 la position est égale, sans pression sur f7. C'est correct mais sans ambition. À choisir seulement si l'on préfère une finale calme."
   }
  ],
  "erreurs": [
   {
    "san": "d3",
    "pourquoi": "oublie la menace : les Noirs jouent Dxf3 et après gxf3 les pions blancs sont doublés sur la colonne f, le roi blanc est à l'air devant son roque. Puis Cf6 développe en attaquant e4 : les Noirs sont déjà mieux."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3",
  "sens": "garde la dame hors d'atteinte tout en restant active : elle appuie sur e5 et sur g7, ce qui cloue en pratique la dame noire sur f6 à sa défense. Les Blancs veulent ensuite d3, Cc3 puis f4 pour ouvrir le centre avant que les Noirs n'aient roqué.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "sort le fou-roi sur sa meilleure diagonale, vers f2 : la dame f6 continue de couvrir g7 et e5, donc rien ne pend. Les Noirs peuvent roquer au coup suivant. Attention à d3-Cc3-Ca4 ou à d4 plus tard pour chasser ce fou."
   },
   {
    "san": "d6",
    "pourquoi": "solidifie e5 avec un pion et libère le fou c8. Le fou f8 n'aura plus que e7, mais la position devient très solide. Prépare Fe6 pour contester la diagonale a2-g8."
   },
   {
    "san": "Ne7",
    "pourquoi": "développe une pièce et prépare Cg6 pour chasser la dame de g3. Le cavalier ouvre aussi la case g8 au roque après la sortie du fou."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "coup de pion inutile qui ne développe rien. Les Blancs répondent d4 ! : après exd4 c3, le centre s'ouvre alors qu'aucune pièce noire n'est sortie, et la dame f6 devient une cible."
   },
   {
    "san": "Bb4",
    "pourquoi": "le fou va sur une case où il n'attaque rien : c3 le chasse, il doit revenir en e7, puis d4 vient avec un temps de gagné. Les Noirs auront joué le fou deux fois pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "Place le fou-roi sur sa meilleure diagonale, pointé sur f2, tout en gardant la dame sur f6 qui protège g7 et e5. Prépare le petit roque.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier dame vers d5 et prépare Ca4 pour chasser le fou c5. Laisse la case d5 contrôlée et garde d2-d3 en réserve pour ouvrir le fou c1."
   },
   {
    "san": "d3",
    "pourquoi": "Solidifie e4 et ouvre la diagonale du fou c1, qui pourra aller en g5 pour harceler la dame f6. Prépare aussi Cc3-a4 contre le fou c5."
   },
   {
    "san": "c3",
    "pourquoi": "Prépare d2-d4 pour chasser le fou c5 et prendre le centre. Attention : le coup est un peu lent, les Noirs roquent tranquillement entre-temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "développe le cavalier dame vers d5 et prépare Ca4 pour chasser le fou c5 ; d2-d3 reste en réserve pour ouvrir le fou c1",
  "menace": "Ca4 puis Cxc5 : gagner la paire de fous en chassant le fou de sa diagonale active",
  "plan": [
   {
    "san": "h5",
    "pourquoi": "menace h4 pour chasser la dame de g3, qui bloque le pion g et vise g7. Gagne de l'espace à l'aile roi et prépare Ce7 sans craindre Cd5. Les Blancs doivent réagir (h4 ou d3), mais le roi noir reste au centre un coup de plus."
   },
   {
    "san": "Ne7",
    "pourquoi": "développe en couvrant d5, la case que vise le cavalier blanc. Prépare le petit roque et libère f6 pour la dame si besoin. Laisse les Blancs jouer Ca4 contre le fou c5, qui pourra reculer en d6 ou b6."
   },
   {
    "san": "Bd6",
    "pourquoi": "recule avant d'être chassé par Ca4 et protège e5, attaqué par la dame en g3. Garde la diagonale b8-h2 pour le fou. Concède que le fou est moins actif qu'en c5, mais les Noirs ne perdent aucun tempo plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "coup lent qui ne répond à rien : les Blancs ouvrent avec d4 ! Après exd4, e5 attaque la dame f6 et gagne du temps, le pion d4 tombe ensuite et le roi noir, toujours au centre, souffre."
   },
   {
    "san": "b5",
    "pourquoi": "le fou prend simplement en b5 : Fxb5 cxb5 Cxb5 et le cavalier menace Cc7+ et Cd6+. Les Noirs ont perdu un pion et leur roi, non roqué, est exposé aux fourchettes."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -17
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3 h5",
  "sens": "Pousse le pion h pour menacer h4 et déloger la dame de g3, qui bloque le pion g et vise g7. Gagne de l'espace à l'aile roi et prépare Ne7 sans craindre Nd5. Le roi noir, lui, reste au centre un coup de plus.",
  "menace": "h4, qui chasse la dame de g3 : si elle recule en f3 ou d3, les Noirs gagnent du temps (échange de dames en f3, ou Qxf2+ dans certains cas) et le pion h continue sa route.",
  "plan": [
   {
    "san": "h4",
    "pourquoi": "Bloque le pion noir sur h5 : il ne peut plus avancer en h4. La dame reste en g3, où elle gêne le roque noir en visant g7. Le pion h4 est protégé par la dame, et les Noirs doivent maintenant trouver autre chose (Ne7, d6) alors que leur roi est encore au centre."
   }
  ],
  "erreurs": [
   {
    "san": "d3",
    "pourquoi": "Trop lent : les Noirs jouent h4 et la dame doit fuir (Qg4, puis d6). Elle perd du temps, le pion h noir a gagné de l'espace gratuitement et les Noirs prennent l'initiative à l'aile roi."
   },
   {
    "san": "Qf3",
    "pourquoi": "Reculer sans y être forcé : les Noirs échangent Qxf3 gxf3 et les pions blancs de l'aile roi sont doublés et brisés. Les Blancs se retrouvent avec une structure abîmée et plus aucune pression sur g7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3 h5 h4",
  "sens": "Fige le pion h5 pour qu'il ne chasse plus la dame, qui reste en g3 pour viser g7 et empêcher le petit roque. Le pion h4 est protégé par la dame.",
  "plan": [
   {
    "san": "Nh6",
    "pourquoi": "Développe le cavalier en protégeant g7 et la case g4. Il peut ensuite aller en g4 ou f5 face à la dame. Le roque redevient possible une fois g7 couvert."
   },
   {
    "san": "Be7",
    "pourquoi": "Recule le fou pour attaquer h4 et protéger f6 et g5. Il libère aussi la colonne c et prépare d6 puis le roque."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe en couvrant g6 et f5, et le cavalier défend la dame f6. Il faudra encore protéger g7 avant de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "g5",
    "pourquoi": "Donne un pion : Dxg5 attaque la dame f6 et le pion h5 est encore faible. Les Noirs perdent du temps et leur roi reste au centre."
   },
   {
    "san": "Rh6",
    "pourquoi": "La tour n'a rien à faire ici : d4 chasse le fou et Fg5 attaque dame et tour en même temps. Les Noirs perdent du matériel."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3 h5 h4 Nh6",
  "sens": "Sort le cavalier en couvrant g7, la case que la dame blanche fixait, et surveille g4 et f5. Le roque noir redevient envisageable, et le cavalier peut sauter en g4 ou f5 pour harceler la dame.",
  "menace": "Ng4 ou Nf5 pour chasser la dame de g3, puis O-O.",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "Replace le fou sur la diagonale a2-g8 : il vise f7 et le futur roi noir. Il libère aussi la case a4 et prépare d3 ou d4 sans gêner le fou. Les Noirs répondront souvent Be7 ou d6."
   },
   {
    "san": "d3",
    "pourquoi": "Soutient e4 et ouvre la diagonale du fou c1 : Bg5 ou Bxh6 deviennent possibles pour contrarier le roque. Coup solide qui ne cède rien."
   },
   {
    "san": "d4",
    "pourquoi": "Attaque le fou c5 et gagne de l'espace au centre. Le fou doit reculer, ce qui donne du temps aux Blancs pour développer le fou c1."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "Semble naturel mais ne fait rien d'utile. Les Noirs jouent Ng4 : la dame est chassée et le pion h4 devient faible. Les Blancs perdent du temps."
   },
   {
    "san": "Kh1",
    "pourquoi": "Coup d'attente inutile. Après Be7 puis d4, la dame noire prend le pion h4 avec Qxh4 : un pion de perdu pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3 h5 h4 Nh6 Bb3",
  "sens": "Replace le fou sur la diagonale a2-g8, pointée vers f7 et vers le roi noir encore au centre. Il libère aussi a4 pour le cavalier (Na4 chasserait le fou c5) et prépare d3 ou d4 sans gêner le fou. Les Noirs doivent maintenant sécuriser leur roi et surveiller la case d4.",
  "menace": "Na4 pour chasser le fou c5, puis d4 pour ouvrir le centre pendant que le roi noir est encore en e8 ; le fou b3 vise déjà f7.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Retire le fou de la case c5 exposée à Na4 et à d4, et protège le pion h4 attaqué... non : il protège surtout la case g5 et prépare le petit roque. Le fou en e7 est moins actif, mais le roi pourra se mettre à l'abri et d6 deviendra possible. Les Blancs garderont un peu d'avance de développement."
   },
   {
    "san": "Ng4",
    "pourquoi": "Active le cavalier vers f2 et h2, en profitant du pion h4 qui a affaibli les cases g4 et g5 côté blanc. Il gêne d4 car le cavalier contrôle e5 avec le pion. En échange, le cavalier peut être chassé plus tard par f3 et la case h6 reste vide pour défendre le roi."
   }
  ],
  "erreurs": [
   {
    "san": "d6",
    "pourquoi": "Coup naturel pour ouvrir le fou c8, mais il arrive trop tôt : les Blancs jouent Na4, le fou c5 doit partir (Bb4) et d4 suit, ouvrant le centre alors que le roi noir n'a pas roqué. Jouez Be7 d'abord, d6 ensuite."
   },
   {
    "san": "Bb6",
    "pourquoi": "Le fou semble en sécurité en b6, mais après d4 le centre s'ouvre, le fou doit encore reculer en c7 et les Blancs placent leur tour en d1 : ils prennent toute l'initiative au centre pendant que les Noirs perdent du temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Nxf3+ Qxf3 c6 O-O Qf6 Qg3 Bc5 Nc3 h5 h4 Nh6 Bb3 Be7",
  "sens": "Recule le fou sur une case sûre, loin de d4, et le place sur la diagonale d8-h4 : avec la dame en f6, il attaque désormais le pion h4 une seconde fois. Il prépare aussi le petit roque et le coup d6.",
  "menace": "Dxh4 : le pion h4 est attaqué deux fois (dame f6, fou e7) et défendu une seule fois (dame g3). Après Dxh4 Dxh4 Fxh4, les Noirs gagnent un pion.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Ouvre la diagonale du fou c1 : si Dxh4 Dxh4 Fxh4, les Blancs reprennent par Fxh6 et récupèrent le pion. En même temps le pion d4 attaque e5 et prend le centre ; le fou b3 regarde f7. Les Noirs devront choisir entre exd4 (qui ouvre les lignes pour les Blancs) et d6."
   },
   {
    "san": "d3",
    "pourquoi": "Plus modeste mais très solide : le fou c1 est libéré, donc h4 est indirectement protégé (Dxh4 Dxh4 Fxh4 Fxh6). Le pion e4 est bien soutenu et le fou pourra venir en g5 pour échanger le fou e7. Les Noirs n'ont rien à gagner tout de suite."
   }
  ],
  "erreurs": [
   {
    "san": "a4",
    "pourquoi": "Un coup sur l'aile qui ne répond pas à la menace. Les Noirs jouent Dxh4 Dxh4 Fxh4 : le pion h4 est perdu, et le fou c1 n'est toujours pas sorti pour le reprendre. Un pion de moins sans aucune compensation."
   },
   {
    "san": "Bc4",
    "pourquoi": "Déplace un fou déjà bien placé et oublie le danger. Encore Dxh4 Dxh4 Fxh4 : les Noirs empochent le pion h4. Avant de bouger une pièce, il faut d'abord regarder ce que l'adversaire menace."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6",
  "nom": "Partie espagnole, variante Arkhangelsk (ordre de coups 4...b5 5.Fb3 Cf6)",
  "sens": "Développe le cavalier roi vers sa meilleure case, attaque le pion e4 et prépare le petit roque : les Noirs demandent aux Blancs de s'occuper de leur centre tout de suite.",
  "menace": "Prendre le pion e4 avec le cavalier (Cxe4), d'autant que le fou blanc a été chassé en b3 et ne surveille plus c6.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri sans défendre e4 directement : si les Noirs prennent en e4, les Blancs récupèrent le pion avec Te1 et d4, le cavalier noir étant exposé au centre. C'est le plan classique de l'Espagnole : laisser e4 en appât tant que la reprise est garantie."
   },
   {
    "san": "d4",
    "pourquoi": "Ouvre le centre immédiatement : le pion e5 est attaqué et le fou c1 trouve une diagonale. Les Noirs doivent prendre ou défendre, et le fou b3 vise déjà f7 une fois le centre ouvert. Convient à ceux qui aiment les positions actives."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne de pions b5 : si les Noirs ne font rien, axb5 ouvre la colonne a pour la tour. Cela gêne le développement du fou c8 et oblige souvent les Noirs à jouer b4 ou Tb8, en perdant du temps."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Coup de prudence inutile : rien ne menace g4. Pendant ce temps, les Noirs prennent le pion e4 gratuitement avec Cxe4, et les Blancs n'ont aucune reprise immédiate, contrairement à l'ordre avec O-O et Te1."
   },
   {
    "san": "c3",
    "pourquoi": "Semble préparer d4, mais c'est trop lent ici : Cxe4 gagne le pion, puis d5 consolide le cavalier au centre. Il faut d'abord roquer ou jouer d4 directement, c3 arrive trop tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O",
  "nom": "Espagnole, variante Arkhangelsk / système avec ...b5 et ...Cf6",
  "sens": "Met le roi en sécurité et place la tour en f1, prête à venir en e1 : le pion e4 reste en appât, car après ...Cxe4 les Blancs le reprennent avec Te1 et d4, le cavalier noir étant chassé du centre.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vise f2 et prépare le roque. Les Noirs disent : « je ne prends pas e4, je développe aussi vite que vous ». Il faudra ensuite jouer ...d6 pour soutenir e5 et ne pas laisser c3-d4 gagner du temps sur le fou."
   },
   {
    "san": "Bb7",
    "pourquoi": "Le fou de cases blanches sort en fianchetto et presse e4 : la prise ...Cxe4 devient une vraie menace. Les Blancs doivent réagir (Te1 ou d3) au lieu de jouer c3-d4 tranquillement."
   },
   {
    "san": "Be7",
    "pourquoi": "Coup solide et classique : le fou protège le roi et la case f6, le roque suit. Moins actif que Fc5, mais sans aucun risque. Les Blancs obtiendront le centre avec c3 et d4, mais les Noirs sont bien placés pour tenir."
   }
  ],
  "erreurs": [
   {
    "san": "d5",
    "pourquoi": "Ouvre le centre alors que le roi noir n'a pas roqué. Après exd5 Cd4 Cxd4 exd4, les Noirs perdent un pion : le pion d5 des Blancs est bien défendu par le fou b3, et le centre noir a disparu."
   },
   {
    "san": "Na5",
    "pourquoi": "Veut échanger le fou b3, mais oublie e5. Les Blancs jouent Cxe5 : si Cxb3 axb3, ils ont un pion de plus et le cavalier e5 est au centre. Dans l'Espagnole, on ne chasse le fou qu'une fois e5 bien défendu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -39
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5",
  "nom": "Arkhangelsk moderne (ou Néo-Arkhangelsk)",
  "sens": "sort le fou roi sur la grande diagonale a7-g1, où il vise f2 et le roi blanc, et libère la case e7 pour pouvoir roquer très vite. Les Noirs refusent la prise en e4 et préfèrent développer une pièce de plus.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Prépare d4 : le pion central va attaquer le fou c5 et chasser le cavalier de e5 en même temps. Les Noirs devront répondre ...d6 pour tenir e5, ce qui bouche leur propre fou. C'est le plan principal des Blancs contre ce fou actif."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque tout de suite le pion b5, qui n'est défendu que par a6. Les Noirs doivent réagir (…Tb8 ou …b4), et l'aile dame noire se fragilise avant même que les Noirs aient roqué."
   },
   {
    "san": "Re1",
    "pourquoi": "Défend e4 une bonne fois, pour que ...Cxe4 ne soit plus jamais possible. C'est calme et solide : les Blancs finissent leur développement avant de pousser c3 et d4."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Semble attaquer b5, mais après ...bxc4 Fxc4 le fou quitte la diagonale qui surveillait e4, et ...Cxe4 gagne un pion gratuitement. Le pion e4 n'est défendu par personne : il faut d'abord le protéger (Te1, d3) avant de bouger les pions d'aile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3",
  "nom": "Espagnole, variante Arkhangelsk moderne (ou variante de Graz)",
  "sens": "Prépare d4 : le pion c soutient d4 pour que les Blancs prennent le centre et attaquent le fou c5. Il ouvre aussi la case c2 pour reculer le fou b3 s'il est attaqué. Le fou c5 est actif : les Blancs veulent le déloger.",
  "menace": "d4 : le pion attaque le fou c5 et prend le centre. Si le fou recule, le pion e5 devient fragile (dxe5).",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Soutient e5 avant que d4 n'arrive. Quand les Blancs jouent d4, les Noirs peuvent reculer le fou en b6 et garder leur pion. Le défaut : le fou c8 est un peu bouché, mais le centre tient."
   },
   {
    "san": "Bb6",
    "pourquoi": "Recule le fou tout de suite, sans attendre d4. Il garde sa belle diagonale vers f2. Les Noirs économisent un temps plus tard, mais e5 reste à défendre après d4."
   },
   {
    "san": "Ba7",
    "pourquoi": "Même idée que Fb6 : le fou reste sur la diagonale a7-g1 et vise f2. En a7, il laisse la case b6 libre et ne gêne pas le pion b5. Un peu plus passif mais solide."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Trop tôt : d4 attaque le fou. Après Fb6, dxe5 gagne le pion e5. Il fallait d'abord protéger e5 par d6."
   },
   {
    "san": "Nxe4",
    "pourquoi": "Prend un pion mais ouvre le centre pour les Blancs : d4 chasse le fou, puis a4 attaque les pions noirs à l'aile dame. Les Noirs perdent du temps et leur roi est encore au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6",
  "nom": "Partie espagnole, variante Møller (ou Archangel moderne)",
  "sens": "Consolide le pion e5 avant la poussée centrale d4 : si les Blancs jouent d4, les Noirs reculent le fou en b6 et conservent leur pion. Le prix : le fou c8 est un peu enfermé derrière d6.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "La poussée centrale naturelle : elle attaque e5 et le fou c5 en même temps. Les Noirs répondent Fb6 et le centre tient, mais les Blancs gagnent de l'espace et ouvrent la colonne d pour leurs pièces."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne b5-a6 sur l'aile dame. Si les Noirs ne réagissent pas, axb5 affaiblit leurs pions. Cela oblige souvent les Noirs à jouer Tb8 ou b4, ce qui détourne leur attention du centre."
   },
   {
    "san": "h3",
    "pourquoi": "Coup prudent : empêche Fg4 qui clouerait le cavalier f3 et gênerait la poussée d4. Les Blancs préparent d4 tranquillement, au prix d'un temps."
   }
  ],
  "erreurs": [
   {
    "san": "Na3",
    "pourquoi": "Le cavalier sort sur le bord, là où il ne contrôle rien d'utile. Après Fb6 il doit déjà rentrer en b1 : deux coups perdus pendant que les Noirs se développent avec Fd7 et prennent l'initiative."
   },
   {
    "san": "Ne1",
    "pourquoi": "Recule une pièce développée sans raison. Les Noirs roquent simplement, le cavalier revient en f3 et les Blancs ont perdu deux temps : le centre reste bloqué et l'avantage du trait s'évapore."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4",
  "nom": "Partie espagnole, variante Arkhangelsk moderne (Møller)",
  "sens": "Pousse au centre pour attaquer deux cibles à la fois : le pion e5 et le fou c5. Elle gagne de l'espace et ouvre la colonne d pour la dame et les tours.",
  "menace": "Prendre le fou en c5 avec d4xc5, ou gagner le pion e5 après d4xe5.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Le fou recule sur une case sûre et reste sur la grande diagonale a7-g1, braqué vers f2. Le pion e5 tient car il est défendu par d6 et le cavalier c6. Les Blancs ont le centre, mais les Noirs sont solides et pourront jouer ...Bg4 ou ...O-O."
   },
   {
    "san": "Ba7",
    "pourquoi": "Même idée que Fb6, le fou garde la diagonale vers f2. Il laisse la case b6 libre pour un cavalier plus tard, mais il est un peu plus loin du centre et bloque la tour a8."
   }
  ],
  "erreurs": [
   {
    "san": "exd4",
    "pourquoi": "Après c3xd4 le fou c5 est de nouveau attaqué et doit reculer en a7, puis Cc3 : les Blancs ont un centre e4-d4 puissant et toutes leurs pièces sortent avec tempo."
   },
   {
    "san": "O-O",
    "pourquoi": "Le roque ignore la menace : d4xc5 gagne le fou. Si les Noirs reprennent d6xc5, Dxd8 échange les dames et les Blancs gardent une pièce de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -38
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4 Bb6",
  "nom": "Partie espagnole, variante Møller (ou défense Archangelsk moderne) avec ...Bb6",
  "sens": "Met le fou à l'abri du pion d4 tout en gardant la pression sur la diagonale a7-g1 vers f2 ; le pion e5 reste tenu par d6 et le cavalier c6, les Noirs attendent ...O-O ou ...Bg4",
  "menace": "Après ...exd4, le pion d4 recapturé par c3 ou le cavalier laisserait f2 et le centre sous pression ; concrètement les Noirs préparent ...Bg4 pour clouer le cavalier f3 et attaquer d4",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe et propose l'échange du fou b6, la pièce noire la plus active. Si ...Bxe3 fxe3, les Blancs ouvrent la colonne f et solidifient d4. Renforce aussi le centre avant de jouer Nbd2."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque le pion b5 avancé. Si ...Rb8 ou ...b4, la structure noire de l'aile dame se fragilise et le fou b3 retrouve la diagonale vers f7. C'est le coup classique contre ...b5 joué tôt."
   },
   {
    "san": "h3",
    "pourquoi": "Empêche ...Bg4, le clouage qui gênerait d4. Simple et utile : ensuite Re1, Nbd2 et le centre tient. Laisse aux Noirs le temps de roquer, mais sans contre-jeu immédiat."
   }
  ],
  "erreurs": [
   {
    "san": "Bc2",
    "pourquoi": "Trop lent : le fou quitte la diagonale a2-g8 sans raison. Les Noirs jouent ...Bg4 et clouent le cavalier f3 ; après d5 Ne7, le centre blanc est figé et le pion d4 ne pousse plus rien."
   },
   {
    "san": "Bd5",
    "pourquoi": "Semble gagner du temps mais échange le bon fou : ...Nxd5 exd5 Ne7 et les Noirs récupèrent facilement d5 ou l'attaquent, tandis que les Blancs ont perdu leur pièce la plus active et leur pression sur f7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4 Bb6 Be3",
  "nom": "Partie espagnole, défense Graz (Fc5)",
  "sens": "Développe le dernier fou et propose l'échange du fou b6, la pièce noire la plus active ; si les Noirs prennent, le pion f reprend, ouvre la colonne f et consolide d4.",
  "menace": "Menace d4xe5 : après ...Cxe5 Cxe5 dxe5, le fou e3 prend le fou b6, et en attendant le centre blanc pèse déjà sur e5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Les Noirs gardent le fou b6 : s'il est échangé, c'est aux Blancs de le faire. Prépare ...Fg4 ou ...Te8 pour appuyer e5."
   },
   {
    "san": "Bb7",
    "pourquoi": "Développe le fou de cases blanches sur la grande diagonale, où il surveille e4. Soutient aussi le cavalier c6 et prépare ...O-O tranquillement."
   },
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3 qui défend d4 et attaque e5 : la pression sur d4 et e5 s'équilibre. Les Blancs devront choisir entre h3 et Cbd2, ce qui leur coûte un temps."
   }
  ],
  "erreurs": [
   {
    "san": "a5",
    "pourquoi": "Perd du temps au bord alors que le centre est tendu. Les Blancs jouent dxe5 Cxe5, puis Fxb6 : le fou actif disparaît et les Noirs se retrouvent avec des pions de l'aile dame désorganisés."
   },
   {
    "san": "h6",
    "pourquoi": "Coup de prévention inutile : rien ne menace g5. Même punition : dxe5 Cxe5 Fxb6, les Noirs perdent leur meilleure pièce et un temps précieux pour roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4 Bb6 Be3 O-O",
  "nom": "Partie espagnole, défense Arkhangelsk (variante moderne)",
  "sens": "met le roi à l'abri avant que le centre ne s'ouvre ; conserve le fou b6 qui vise d4 et prépare ...Fg4 ou ...Te8 pour soutenir e5.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce et protège e4. Le cavalier pourra aller en f1 puis g3 ou e3, comme dans toutes les Espagnoles. Les Blancs gardent la tension au centre : c'est aux Noirs de décider s'ils prennent en d4."
   },
   {
    "san": "h3",
    "pourquoi": "Interdit ...Fg4, qui clouerait le cavalier f3 et gênerait la défense de d4. Coup d'attente utile : les Blancs ne se pressent pas, le centre tient."
   },
   {
    "san": "dxe5",
    "pourquoi": "Clarifie le centre tout de suite : après ...dxe5 ou ...Cxe5, les Blancs peuvent échanger le fou b6 avec Fxb6 et ouvrir la colonne d pour la dame. Position plus simple, mais les Noirs ont des pièces actives."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "La dame bloque la colonne e et ne défend pas d4. Après ...exd4 cxd4 ...Fg4, le cavalier f3 est cloué et le pion d4 craque : les Noirs gagnent du matériel ou le centre."
   },
   {
    "san": "Bc2",
    "pourquoi": "Recule le fou sans raison et abandonne la pression sur f7. Les Noirs répondent ...Fg4 ; si dxe5 alors ...Cxe5 et le cavalier noir s'installe au centre, le pion d4 n'existe plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4 Bb6 Be3 O-O Nbd2",
  "nom": "Partie espagnole, défense Arkhangelsk moderne (système avec Fc5)",
  "sens": "Développe la dernière pièce mineure en couvrant e4 et laisse le pion d4 sous tension : les Blancs ne prennent pas en e5, ils attendent que les Noirs se décident.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "La tour vient soutenir le pion e5 et regarder la colonne e, où le pion e4 blanc sera visé si le centre s'ouvre. Les Noirs n'ont pas besoin de prendre en d4 : ils gardent la tension et laissent aux Blancs le soin de résoudre le centre. Le coup est utile quoi qu'il arrive, c'est pour cela qu'il vient en premier."
   },
   {
    "san": "Na5",
    "pourquoi": "Chasse le fou b3, la meilleure pièce blanche, qui vise f7. Après ...Cxb3 les Noirs obtiennent la paire de fous. Le cavalier quitte le centre un moment, mais le fou b3 ne peut pas rester sur sa belle diagonale sans être échangé."
   },
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3 qui défend d4 et augmente la pression sur le centre blanc. Les Blancs devront chasser le fou par h3 ou accepter que le point d4 soit plus fragile. Le fou peut ensuite reculer en h5 ou prendre en f3 au bon moment."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Nf6 O-O Bc5 c3 d6 d4 Bb6 Be3 O-O Nbd2 Re8",
  "nom": "Partie espagnole, défense Arkhangelsk (variante moderne, Fc5)",
  "sens": "La tour renforce e5 et surveille la colonne e : si le centre s'ouvre, le pion e4 devient une cible. Les Noirs refusent de prendre en d4 et laissent les Blancs décider du centre.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne de pions b5-a6 : si les Noirs ne réagissent pas, axb5 ouvre la colonne a et le fou b3 retrouve la diagonale vers f7. Les Noirs doivent souvent jouer ...Fb7 ou ...Tb8, ce qui les détourne du centre."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au cavalier f6 et au fou c8 avant d'agir au centre. Coup calme : les Blancs gardent la tension en d4 et préparent Te1 ou Cf1-g3 sans craindre ...Fg4 qui clouerait le cavalier f3."
   },
   {
    "san": "Re1",
    "pourquoi": "Protège e4 une fois de plus et libère le cavalier d2 : il pourra aller en f1 puis g3 ou e3, la manœuvre classique de l'Espagnole. Le centre reste fermé, les Blancs attendent que les Noirs prennent en d4 pour recapturer avec le pion c3 et gagner de l'espace."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6",
  "nom": "Espagnole, variation berlinoise avec 4.d3 (variante Anti-Berlin)",
  "sens": "Consolide e5 une fois pour toutes et ouvre la diagonale du fou c8. Le fou noir f8 garde le choix entre e7 et g7 après g6.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie les tours. Les Blancs n'ont rien à prouver tout de suite : ils finissent leur développement avant d'avancer. Les Noirs répondront sans doute par Bd7 ou g6."
   },
   {
    "san": "c3",
    "pourquoi": "Prépare d4 pour pousser au centre au bon moment et donne une case de repli c2 au fou b5. Plan classique de l'Espagnole : jouer d4 avec le soutien du pion c3."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier vers d5, une case forte au centre. En revanche il bloque le pion c, donc les Blancs renoncent au plan c3-d4 pour un jeu de pièces."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 33
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O",
  "nom": "Partie espagnole, défense berlinoise, variante 4.d3",
  "sens": "Met le roi à l'abri et relie les tours. Les Blancs n'ont rien à prouver tout de suite : ils finissent leur développement avant d'avancer. Les Noirs répondront sans doute par Bd7 ou g6.",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit se retirer en a4 ou prendre en c6. Les Noirs gagnent un temps et pourront chasser encore le fou avec b5. Ils laissent aux Blancs le choix d'échanger le fou contre le cavalier."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe le fou et prépare le petit roque. C'est le coup le plus simple : le roi noir sera en sécurité dans deux coups. Les Blancs pourront jouer c3 et Te1 sans gêne."
   },
   {
    "san": "g6",
    "pourquoi": "Prépare Fg7, qui appuiera le pion e5 et regardera toute la grande diagonale. Le roque suivra. En échange, les cases f6 et h6 deviennent un peu moins protégées."
   }
  ],
  "erreurs": [
   {
    "san": "Qd7",
    "pourquoi": "Semble défendre le cavalier c6, mais la dame bloque le fou c8 qui ne peut plus sortir. Les Blancs jouent d4 : après a6 dxe5, le centre noir craque et les Noirs manquent de place pour se développer."
   },
   {
    "san": "h5",
    "pourquoi": "Avance un pion qui n'attaque rien et affaiblit le roque futur. Les Blancs ignorent la menace imaginaire et continuent avec c3 puis Fa4 : ils gardent le centre et les Noirs ont perdu un temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -20
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6",
  "nom": "Partie espagnole, Berlin avec d3 (Anti-Berlin)",
  "sens": "Attaque le fou b5 avec un pion : il doit se retirer ou prendre en c6. Les Noirs gagnent un temps et préparent b5 pour chasser le fou encore une fois.",
  "menace": "axb5 : gagner le fou pour un pion.",
  "plan": [
   {
    "san": "Bxc6+",
    "pourquoi": "Échange le fou contre le cavalier et double les pions noirs sur la colonne c. Après bxc6, les Blancs gardent une structure saine et viseront le pion e5 avec Cbd2, Te1 et d4. Les Noirs obtiennent en compensation la paire de fous et le pion b ouvert pour leur tour."
   },
   {
    "san": "Ba4",
    "pourquoi": "Garde le fou en vie sur la diagonale a4-e8, où il continue de regarder le cavalier c6. Il peut ensuite revenir en b3 vers f7 et le roi noir. Les Noirs peuvent le chasser avec b5, mais cela affaiblit leurs cases c5 et a5."
   },
   {
    "san": "Bc4",
    "pourquoi": "Replace le fou sur la diagonale vers f7, point faible du roi noir. Attention : les Noirs peuvent jouer Ca5 ou d5 pour l'attaquer à nouveau ; il faudra souvent le reculer en b3."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Développe un cavalier mais oublie le fou attaqué. Après axb5 Cxb5, les Blancs ont perdu un fou pour un simple pion : le cavalier b5 sera chassé par c6 ou a6 et il ne restera rien."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Prend un pion alors que le fou est en prise. Les Noirs répondent axb5 : le cavalier e5 reprend en c6, bxc6, et les Blancs ont donné un fou plus un cavalier contre un cavalier et un pion. Un fou de perdu, net."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+",
  "nom": "Partie espagnole, variation berlinoise avec 4.d3 (échange différé)",
  "sens": "prend le cavalier c6 avec échec pour abîmer la structure noire : après la reprise par le pion, les Noirs auront des pions doublés sur la colonne c et un pion e5 plus difficile à tenir",
  "menace": "le fou en c6 est en prise et donne échec : les Noirs doivent le reprendre tout de suite, sinon il capture aussi le pion b7 et attaque la tour a8",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "la seule bonne reprise. Le pion b7 prend en c6 : il ouvre la colonne b pour la tour a8 et garde le fou c8 libre. Les pions c6-c7 sont doublés, mais les Noirs ont la paire de fous et un centre solide. Ensuite, les Noirs développent avec Fe7, O-O et Te8 pour protéger e5 contre d4."
   }
  ],
  "erreurs": [
   {
    "san": "Qd7",
    "pourquoi": "reprendre avec la dame paraît naturel, mais après Fxd7+ Fxd7 les Noirs ont échangé une pièce de plus et perdent du temps ; les Blancs enchaînent b4 et prennent l'initiative avec un gros avantage. Il faut reprendre avec le pion pour garder les pièces actives."
   },
   {
    "san": "Bd7",
    "pourquoi": "bloque l'échec sans reprendre : le fou blanc file en b7, attaque la tour a8 et après Ta7 Fd5 les Blancs ont gagné un pion et gardent un fou dominant au centre. Ne jamais laisser un échec gratuit se transformer en capture gratuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -32
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6",
  "nom": "Partie espagnole, variante d'échange différée (Fxc6 après d3)",
  "sens": "reprend vers le centre avec le pion b : la colonne b s'ouvre pour la tour a8 et le fou c8 reste libre. Les pions c6-c7 sont doublés, mais le centre e5-d6-c6 tient bien et les Noirs gardent la paire de fous.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "renforce e4 avant de pousser d4 : si d4 exd4, le cavalier pourra reprendre sans laisser e4 en prise. Coup calme et utile, qui laisse les Noirs décider où ira le fou f8."
   },
   {
    "san": "d4",
    "pourquoi": "ouvre le centre tout de suite. Après exd4 Cxd4, le cavalier blanc est bien placé et la colonne e s'active. Les Noirs répondent Cxe4 et il faut alors jouer précis : Te1 d5 et le cavalier e4 reste défendu, on récupère le pion avec un petit avantage d'espace."
   },
   {
    "san": "Nbd2",
    "pourquoi": "développe en gardant le contrôle de e4 et prépare Cc4 puis d4. Plus lent que Te1, mais le cavalier vise aussi la case b3 pour aller en c5 plus tard, dans le camp des pions noirs doublés."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1",
  "nom": "Partie espagnole, variante d'échange différée (avec 4.d3)",
  "sens": "renforce e4 avant de pousser d4 : si d4 exd4, le cavalier pourra reprendre sans laisser e4 en prise. Coup calme et utile, qui laisse les Noirs décider où ira le fou f8.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "occupe d4 avec un pion et empêche la poussée d4 des Blancs. Le centre noir (c5, d6, e5) devient solide. Les pions doublés c6-c5 ne sont plus un défaut : ils contrôlent les cases centrales. Le fou c8 pourra ensuite sortir en e6 ou g4."
   },
   {
    "san": "Be7",
    "pourquoi": "développe le fou simplement et prépare le roque. Après O-O le roi est en sécurité et la tour f8 pourra venir en e8. Les Noirs gardent le choix de jouer c5 ou Nd7 ensuite selon ce que font les Blancs."
   },
   {
    "san": "Nd7",
    "pourquoi": "libère la case f6 pour le fou (Bf6 après g6 ou directement) et soutient e5 et c5. Le cavalier d7 pourra aller en b6 ou en c5. Coup souple qui prépare aussi f6 pour verrouiller le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5",
  "nom": "Espagnole d'échange différé (variante 4.d3)",
  "sens": "verrouille la case d4 avec un pion et interdit la poussée d4 : le centre noir c5-d6-e5 est figé et solide. Les pions doublés de la colonne c se transforment en atouts : ils contrôlent b4 et d4. Le fou c8 pourra sortir en e6 ou g4 sans gêner.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "prépare quand même d4 : avec c3, le pion d pourra avancer soutenu et attaquer le point c5-e5. C'est le seul vrai levier des Blancs. Les Noirs répondront souvent par ...g6 et ...Fg7 ou par ...Fe7 et ...O-O ; la lutte se joue autour de d4."
   },
   {
    "san": "Nbd2",
    "pourquoi": "développe le cavalier vers c4 ou f1-g3, d'où il visera les cases d5 et f5. Ne bloque pas le pion c, qui garde l'option c3. Laisse aux Noirs le temps de roquer tranquillement."
   },
   {
    "san": "h3",
    "pourquoi": "coup d'attente utile : ôte la case g4 au fou c8 avant qu'il ne cloue le cavalier f3. Les Blancs gardent toutes leurs options (c3, Cbd2) et évitent les échanges qui soulageraient les Noirs."
   }
  ],
  "erreurs": [
   {
    "san": "Bg5",
    "pourquoi": "cloue un cavalier qui n'a rien à craindre : après ...Fe7, le clouage disparaît, et le fou g5 devient une cible pour ...h6 et ...g5. Les Blancs perdent du temps et affaiblissent leur aile roi pour rien."
   },
   {
    "san": "c4",
    "pourquoi": "a l'air de serrer le centre, mais bloque la case c4 du cavalier et laisse le trou d4 pour toujours. Après ...a5 et ...Cd7-b6 ou ...Cd4, les Noirs installent une pièce sur d4 sans qu'aucun pion blanc puisse la chasser."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 32
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3",
  "sens": "prépare d4 : avec le pion c en soutien, le pion d pourra avancer sans être simplement échangé, et viendra frapper les pions c5 et e5. C'est le seul vrai levier des Blancs dans cette structure.",
  "menace": "d4, qui attaque c5 et e5 en même temps et ouvre le centre au profit des pièces blanches.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "développe le fou et prépare le roque. Le fou défend aussi la case d6 ; après ...O-O, les Noirs sont prêts à répondre à d4 par ...exd4 ou ...Fg4 selon le cas."
   },
   {
    "san": "Nd7",
    "pourquoi": "le cavalier recule pour surveiller e5 et c5 : si d4 cxd4 cxd4, il tient le centre et peut aller en b6 ou f6. Il libère aussi f6 pour le pion f, utile plus tard pour ...f6 et ...Fe6."
   },
   {
    "san": "Bg4",
    "pourquoi": "cloue le cavalier f3, principal soutien de d4. Les Blancs perdent du temps à réagir (h3, puis Fxf3 ou Fh5) ; en échange, les Noirs peuvent céder la paire de fous, ce qu'ils acceptent souvent dans cette structure fermée."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "la dame bloque le fou f8 et ne défend rien de plus. Après d4, les Noirs doivent la déplacer encore (...De6), et Da4 attaque alors a6 et c6 d'un coup : les Blancs gagnent du temps et des cases, les Noirs n'ont toujours pas roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3 Be7",
  "nom": "Espagnole, variante d'échange différée (avec 4.d3)",
  "sens": "sort le fou de sa case initiale pour pouvoir roquer. Le fou couvre d6 et libère la case f8 ; une fois le roi à l'abri, les Noirs pourront répondre à d4 par ...exd4 ou par ...Fg4 qui cloue le cavalier f3.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Attaque le centre tout de suite. Si ...exd4 cxd4 cxd4 Cxd4, le centre noir disparaît et les pions c6-c7 doublés restent faibles. Si les Noirs ne prennent pas, d5 ou dxe5 peut venir ensuite. Le prix : le pion e4 reste attaquable par le cavalier f6."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier en soutenant e4 et en gardant la case f3 libre pour le retour du cavalier. Prépare d4 au coup suivant, sans rien lâcher. Le cavalier pourra aller à f1 puis g3 plus tard."
   },
   {
    "san": "b4",
    "pourquoi": "Attaque le pion c5, qui s'avance seul. Si ...cxb4 cxb4, les Blancs ouvrent la colonne c contre les pions noirs doublés et gagnent de l'espace à l'aile dame. Attention : le pion b4 est un peu avancé et la case c4 reste à surveiller."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 25
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3 Be7 d4",
  "nom": "Défense berlinoise (variante anti-Berlin 4.d3)",
  "sens": "ouvre le centre avant que les Noirs n'aient roqué : le pion d6 et le pion e5 sont attaqués, et la colonne d s'ouvre vers la dame noire non protégée.",
  "menace": "dxe5 dxe5 Dxd8+ Fxd8 Cxe5 : les dames disparaissent et le pion e5, plus défendu, est perdu.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "prend tout de suite pour ne pas laisser dxe5. Après cxd4, les Noirs gardent e5 solide. En échange, les Blancs ont un pion central d4 et des pions noirs c7 encore un peu faible."
   },
   {
    "san": "Nd7",
    "pourquoi": "le cavalier recule pour défendre e5 et c5 à la fois. Les Noirs peuvent ensuite roquer tranquillement. Prix : le cavalier ne regarde plus e4 ni le camp blanc."
   },
   {
    "san": "exd4",
    "pourquoi": "élimine le pion d4 et permet ...Cxe4 si les Blancs prennent cxd4. Les pions noirs restent en groupe. Mais le centre noir n'a plus de pion e5 et les Blancs auront un pion d4 libre."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "roquer semble naturel mais ignore la menace : dxe5 dxe5 Dxd8 Fxd8 Cxe5 et le pion e5 est perdu, car plus rien ne le défend après l'échange des dames."
   },
   {
    "san": "Bb7",
    "pourquoi": "développe sans rien défendre : dxe5 dxe5 Da4+ et le roi noir doit bouger ou se bloquer, puis Cxe5 gagne le pion. Le fou en b7 ne sert à rien tant que e4 tient."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3 Be7 d4 cxd4",
  "nom": "Partie espagnole, échange différé (variante avec 4.d3)",
  "sens": "rend immédiatement le pion pris en c5 pour en gagner un : le pion noir s'installe en d4, où il attaque c3 et garde e5 intact. Si les Blancs ne reprennent pas tout de suite, les Noirs le soutiennent par c7-c5 et restent avec un pion de plus.",
  "menace": "dxc3, ou simplement c7-c5 pour consolider le pion d4 et garder un pion d'avance.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "le seul bon coup : il reprend le pion et rétablit l'égalité matérielle. Les Blancs obtiennent un vrai pion central en d4 qui attaque e5. Les Noirs devront le gérer (exd4 ou garder la tension), et leur pion c7 reste un peu faible sur la colonne c ouverte. Position équilibrée, légère pression blanche."
   }
  ],
  "erreurs": [
   {
    "san": "Bg5",
    "pourquoi": "développer avant de reprendre paraît naturel, mais les Noirs répondent c7-c5 : le pion d4 est maintenant défendu deux fois et les Blancs ne le récupèrent plus. Ils restent avec un pion de moins et une chaîne noire e5-d4-c5 qui étouffe leur centre."
   },
   {
    "san": "Qa4+",
    "pourquoi": "l'échec a l'air actif, mais Fd7 le pare en développant. La dame doit repartir et, pendant ce temps, c7-c5 verrouille le pion d4. Résultat : un tempo perdu et un pion de moins pour les Blancs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3 Be7 d4 cxd4 cxd4",
  "nom": "Partie espagnole, variante d'échange différée (4.d3)",
  "sens": "reprend le pion pour rétablir l'égalité matérielle et installe un vrai pion central en d4 qui attaque e5 ; la colonne c s'ouvre sur le pion noir c7.",
  "menace": "dxe5 : si les Noirs ne font rien, le pion d4 prend e5 et le pion d6 doit reprendre, ce qui ouvre la colonne d et expose la dame noire sur d8.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "règle le problème du centre tout de suite : le pion blanc d4 disparaît. Après Cxd4, le cavalier blanc est bien placé, mais les Noirs ont deux fous et vont roquer tranquillement. C'est le coup le plus simple pour un débutant."
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi en sécurité et connecte la tour. Les Noirs gardent la tension e5-d4 : si dxe5 dxe5, la dame noire n'est plus attaquée car le roi a quitté la colonne e. On garde l'option exd4 pour plus tard."
   },
   {
    "san": "Bb7",
    "pourquoi": "développe le fou sur la grande diagonale, où il regarde e4 et le roi blanc. Mais il faudra vite roquer, car la tension au centre reste et la colonne c est ouverte sur c7."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "attaque le pion d4 une deuxième fois, mais oublie e5 : après dxe5 dxe5, les Blancs jouent Dxd8+ et prennent la dame, car la colonne d est ouverte et le roi noir est encore en e8. Perd un pion et la qualité de la position."
   },
   {
    "san": "Bg4",
    "pourquoi": "cloue le cavalier f3, ça paraît actif, mais d4xe5 attaque le pion d6 et répond au clou par le centre ; après Fxf3 Dxf3, les Blancs ont une dame active, le centre et la colonne c ouverte, et les Noirs ont perdu leur bon fou pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 O-O a6 Bxc6+ bxc6 Re1 c5 c3 Be7 d4 cxd4 cxd4 exd4",
  "sens": "Prend le pion central avant qu'il n'avance : le centre blanc disparaît et les Noirs gardent leurs deux fous. Le pion d4 noir est provisoire, il attend d'être repris.",
  "menace": "Garder un pion de plus si les Blancs ne reprennent pas tout de suite en d4.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le pion avec le cavalier, qui arrive au centre sur une case solide. Il regarde c6, f5 et b5 et pourra sauter plus loin. Ensuite Cc3 et Ff4 : les Blancs sont développés, les Noirs ont encore leur roque à faire."
   },
   {
    "san": "Qxd4",
    "pourquoi": "Reprend avec la dame, qui attaque aussitôt le pion d6 et surveille toute la colonne d. Attention : la dame peut être chassée par c5 ou Cc6 avec gain de temps, il faudra la reculer. Correct, mais un peu moins naturel que la prise au cavalier."
   },
   {
    "san": "Qa4+",
    "pourquoi": "Donne échec avant de reprendre : après Fd7, la dame prend le pion d4 sans être gênée, et le fou noir en d7 est passif. Idée fine, mais la version simple Cxd4 suffit."
   }
  ],
  "erreurs": [
   {
    "san": "e5",
    "pourquoi": "Pousse au lieu de reprendre : les Noirs échangent en e5, puis Dd5 attaque le cavalier et défend tout. Le pion d4 reste noir et les Blancs ont un pion de moins pour rien."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe une pièce et oublie le pion d4. Les Noirs répondent c5 : le pion est maintenant solidement protégé et les Blancs ne le récupéreront plus. Avant de développer, on reprend ce qui est à reprendre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5",
  "nom": "Partie espagnole, défense Møller (variante classique différée)",
  "sens": "sort le fou sur sa diagonale la plus active, en visant f2 : les Noirs refusent le calme de Cf6 et veulent gêner le petit roque blanc.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "prépare d4 : le pion central va chasser le fou c5 et gagner de l'espace. C'est la réponse logique, mais elle laisse les Noirs jouer Cf6 contre e4, qu'il faudra défendre par d3 ou O-O."
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri avant tout : le fou c5 ne mord plus sur f2 une fois la tour en f1. On garde c3 et d4 pour le coup suivant."
   },
   {
    "san": "d3",
    "pourquoi": "solide : défend e4 et ouvre la diagonale du fou c1. Moins ambitieux que c3-d4, mais sans risque."
   }
  ],
  "erreurs": [
   {
    "san": "Bxc6",
    "pourquoi": "donne le fou d'attaque pour rien : après dxc6, les Noirs ont la paire de fous et un centre sain. On a joué Fb5 et Fa4 pour conserver ce fou, pas pour l'échanger."
   },
   {
    "san": "b4",
    "pourquoi": "tente de chasser le fou en sacrifiant un pion, mais après Fxb4 c3 Fa5, le fou se replie tranquillement et le pion est perdu pour de bon."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3",
  "nom": "Partie espagnole, variante Møller (Fc5)",
  "sens": "prépare la poussée d4 : le pion central viendra chasser le fou c5 et prendre le centre. Le coup ne développe aucune pièce et ne défend pas e4, qui reste sans protection.",
  "menace": "d4, qui attaque le fou c5 et le pion e5 en même temps",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "développe en attaquant e4, qui n'est pas défendu. Les Blancs doivent réagir (d3, O-O ou d4). Si d4 exd4 cxd4, le fou peut reculer en b4+ ou b6 et e4 reste une cible."
   },
   {
    "san": "Ba7",
    "pourquoi": "met le fou à l'abri avant que d4 ne le chasse. Il garde la diagonale vers f2 et ne sera plus attaqué par les pions. Laisse aux Blancs le temps de jouer d4, mais sans gain de temps."
   },
   {
    "san": "Nge7",
    "pourquoi": "développe le cavalier et prépare Cg6 pour surveiller e5 et f4. Évite le clouage Fg5 et garde la case f6 libre pour le pion f si l'on veut jouer f5 plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "le fou recule sans y être forcé et perd son travail actif sur la diagonale a7-g1. Après d4, les Blancs ont le centre gratuitement : les Noirs ont joué deux coups de fou pour rien."
   },
   {
    "san": "Rb8",
    "pourquoi": "prépare b5 pour chasser le fou, mais c'est inutile : b5 peut se jouer tout de suite si besoin. Après d4, le fou c5 doit encore bouger et les Blancs prennent le centre avec un tempo d'avance."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -47
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6",
  "nom": "Partie espagnole, défense Møller (variante classique différée)",
  "sens": "développe le cavalier en attaquant le pion e4, qui n'est défendu par rien. Les Blancs ne peuvent pas continuer tranquillement : il faut s'occuper de e4 tout de suite.",
  "menace": "Cxe4 : gagner le pion e4 gratuitement.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "attaque le fou c5 et le pion e5 en même temps, tout en protégeant e4 par la dame (après ...Cxe4, Dd5 ou d5 gêne les Noirs). C'est l'idée du coup c3 : prendre le centre avec les pions. Après 6...exd4 7.cxd4 le fou doit reculer (Fb4+ ou Fb6) et les Blancs ont un centre d4-e4 solide à condition de jouer vite e5 ou Cc3."
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri et laisse les Noirs prendre e4 : après 6...Cxe4 7.d4 ! les Blancs récupèrent le pion car le fou c5 et le cavalier e4 sont attaqués en même temps, avec Te1 qui arrive sur le cavalier. On sacrifie un pion pendant un coup, pas plus."
   }
  ],
  "erreurs": [
   {
    "san": "d3",
    "pourquoi": "défend e4 mais sans ambition : les Noirs jouent 6...b5 7.Fb3 O-O et ont un jeu facile. Le pion c3 a été joué pour pousser d4 ; avec d3, il ne sert plus à rien et le cavalier b1 n'a plus sa case naturelle."
   },
   {
    "san": "Nxe5",
    "pourquoi": "semble gagner un pion, mais 6...Fxf2+ ! 7.Rxf2 Cxe4+ : le roi blanc est attiré au centre, les Noirs récupèrent le pion avec échec et le roi blanc ne pourra plus roquer. Mauvaise affaire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 70
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4",
  "nom": "Partie espagnole, variante classique (Fc5) avec 5.c3 Cf6 6.d4",
  "sens": "Pousse le pion central pour attaquer le fou c5 et le pion e5 en même temps : les Noirs doivent répondre à deux menaces d'un coup. Le pion d4 ouvre aussi la diagonale de la dame vers d5, ce qui couvre e4 contre ...Cxe4.",
  "menace": "7.dxc5 gagne le fou, ou 7.dxe5 gagne le pion e5 ; et si le cavalier prend e4, 7.Dd5 attaque cavalier et f7 (ou 7.d5 chasse le cavalier c6).",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Prend le pion qui attaque : après 7.cxd4 le fou doit encore reculer (Fb4+ ou Fb6), mais le centre blanc est fixé et peut être attaqué par ...d5 ou ...Cxe4 au bon moment. C'est le coup le plus précis, il garde l'égalité matérielle."
   },
   {
    "san": "Bb6",
    "pourquoi": "Sauve le fou en gardant la diagonale a7-g1 vers f2. Laisse les Blancs prendre e5 (7.dxe5 Cxe4) ou pousser d5 : c'est jouable mais ça leur donne plus d'espace."
   },
   {
    "san": "Ba7",
    "pourquoi": "Même idée que Fb6, mais le fou est à l'abri d'un futur Cd2-c4 ou a4-a5. Il reste pointé sur f2."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Semble gagner un pion, mais 7.dxc5 prend le fou ; après 7...Cxc5 8.Fxc6 les Blancs gardent une pièce de plus. Le fou c5 était attaqué, il fallait d'abord s'en occuper."
   },
   {
    "san": "O-O",
    "pourquoi": "Rocquer est un réflexe, mais ici le fou c5 reste en prise : 7.dxc5 et les Blancs ont une pièce gratuite. Avant de roquer, on sauve ses pièces attaquées."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -66
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4",
  "nom": "Partie espagnole, défense Morphy avec 4...Fc5 (ligne classique)",
  "sens": "accepte l'échange au centre pour que le pion d4 blanc devienne une cible : si les Blancs reprennent par le pion, le cavalier f6 pourra sauter en e4 et le fou revenir en b4 avec échec.",
  "menace": "...dxc3 : gagner un pion si les Blancs oublient de reprendre ou de pousser.",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "Chasse le cavalier f6 avec gain de temps au lieu de reprendre tout de suite. Les Noirs n'ont pas de bonne case : ...Ce4 ou ...Cd5 laissent les Blancs reprendre en d4 ensuite dans de bonnes conditions, et le pion e5 enlève la case f6, ce qui gêne le roque noir."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord. Si les Noirs prennent ...dxc3, les Blancs reprennent Cxc3 et ont un développement d'avance pour le pion. Si les Noirs ne prennent pas, cxd4 viendra ensuite sans craindre ...Fb4+ qui gênerait avec le roi encore en e1."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Le coup qui semble logique est pourtant imprécis : après 7...Fb4+ 8.Fd2 Cxe4, le fou blanc est cloué sur sa case, le cavalier noir s'installe en e4 sans être puni et le centre blanc ne vaut plus rien. Il faut d'abord régler le roi ou chasser le cavalier f6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 76
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5",
  "sens": "Attaque le cavalier f6 avec gain de temps avant de reprendre en d4 : les Noirs doivent d'abord sauver la pièce, et le pion e5 contrôle f6, ce qui enlève une case de replis au cavalier et gêne le roque.",
  "menace": "exf6, qui gagne le cavalier f6.",
  "plan": [
   {
    "san": "Ne4",
    "pourquoi": "Le cavalier se centralise au lieu de reculer. Il vise la case faible f2 avec le fou c5 et attaque le pion c3. Si les Blancs reprennent cxd4, le fou vient en b4+ ou recule en e7 et les Noirs achèvent leur développement avec ...d5 ou ...O-O."
   },
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier attaque le pion e5, qui n'est défendu que par le cavalier f3. Les Blancs doivent s'occuper de e5 et de f2 (fou c5 et cavalier g4 visent f2) avant de reprendre en d4. C'est un peu moins solide que Ne4 : le cavalier en g4 peut être chassé par h3."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer sans bouger le cavalier perd une pièce : exf6 le capture, et après ...Re8 les Blancs gardent la pièce de plus. On met toujours la pièce attaquée en sécurité avant de roquer."
   },
   {
    "san": "d5",
    "pourquoi": "Ce contre-coup central arrive trop tard : les Blancs jouent Bxc6+ bxc6 puis exf6 et gagnent le cavalier f6, qui n'a jamais été défendu. Une menace directe sur une pièce se pare d'abord."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -89
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4",
  "nom": "Partie espagnole, défense Morphy, variante classique (4...Fc5) avec 5.c3",
  "sens": "Avance le cavalier au centre au lieu de le faire reculer. Avec le fou c5, il appuie sur f2 et attaque le pion c3. Si les Blancs reprennent cxd4, le fou peut aller en b4 avec échec ou reculer en e7, puis les Noirs finissent leur développement avec ...d5 ou ...O-O.",
  "menace": "...dxc3 : le pion d4 prend sur c3 et menace b2 ; les Noirs gagnent un pion si les Blancs ne réagissent pas.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord : f2 n'est plus un problème et la tour rejoint e1 pour appuyer e5 et chasser le cavalier e4. Après ...dxc3 ou ...d5, les Blancs rattrapent le pion avec cxd4 ou Fxc6 et Dxd4, car le roi noir est encore au centre."
   },
   {
    "san": "cxd4",
    "pourquoi": "Reprend le pion tout de suite et pousse le fou noir. Sur ...Fb4+, Fd2 ou Cbd2 couvre et les Blancs gardent un bon centre e5-d4. Sur ...Fe7, O-O et le centre blanc est plus solide que le cavalier noir en e4."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Laisse f2 sans gardien et sort la dame noire : ...Dh4 attaque f2 et e4 est déjà là. Même après Fe3, ...Ce5 arrive et les Blancs doivent rendre du matériel pour survivre. Bilan : un pion de moins et un roi en danger."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Échange le bon fou pour rien : après ...dxc6 les Noirs ouvrent la diagonale c8-h3 et jouent ...O-O. Les Blancs n'ont plus leur fou espagnol et le pion d4 tombe quand même, avec une colonne d ouverte pour la dame noire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 89
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7",
  "nom": "Partie espagnole, variante Arkhangelsk",
  "sens": "place le fou sur la grande diagonale pour viser e4 : combiné au cavalier f6, il met le pion e4 sous pression et prépare la contre-attaque au centre.",
  "menace": "Cxe4 : le cavalier prend e4 et le fou b7 le soutient, les Blancs n'ont pas de défenseur immédiat du pion.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "défend e4 avec la tour, le coup le plus naturel de l'Espagnole : il neutralise la menace Cxe4 sans affaiblir la position. Ensuite c3 et d4 pour construire le centre. Attention : il laisse les Noirs jouer Fc5 pour viser f2."
   },
   {
    "san": "d3",
    "pourquoi": "défend e4 avec un pion, solidement et pour longtemps. Il libère aussi le fou c1. L'inconvénient : les Blancs renoncent à d4 pour l'instant, le jeu sera plus lent."
   },
   {
    "san": "Nc3",
    "pourquoi": "défend e4 en développant une pièce : le cavalier regarde d5 et e4. Il abandonne l'idée c3-d4 mais garde un bon contrôle du centre, et peut viser d5 ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "a3",
    "pourquoi": "un coup qui ne fait rien contre la menace : les Noirs prennent e4 avec le cavalier. Après Te1 les Noirs jouent d5, consolident le cavalier et gagnent un pion gratuitement."
   },
   {
    "san": "h3",
    "pourquoi": "même erreur : le pion e4 n'est pas défendu, Cxe4 le prend. Après Te1 d5, les Noirs gardent le pion avec un centre solide. Toujours vérifier e4 avant de jouer un coup de pion sur l'aile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1",
  "nom": "Variante Arkhangelsk (Archangel)",
  "sens": "défend e4 avec la tour sans rien affaiblir : la menace Cxe4 est neutralisée et la tour prépare l'ouverture de la colonne e. Ensuite c3 et d4 pour prendre le centre.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "développe le fou sur sa meilleure diagonale : il vise f2, la case la plus faible des Blancs après le roque. Le fou n'est pas gêné par un futur d4, car il pourra reculer en b6. Laisse aux Blancs c3 et d4, mais chaque pion central avancé sera attaqué par vos pièces."
   },
   {
    "san": "Be7",
    "pourquoi": "développe le fou sans risque et prépare le roque. Le fou protège f6 et la case d6. C'est le coup solide : les Blancs jouent c3 et d4, et vous répondez d6 puis roque, position saine et facile à jouer."
   },
   {
    "san": "h6",
    "pourquoi": "empêche Cg5, qui attaquerait f7 et gênerait vos pièces. Utile avant de jouer Fc5, pour que votre fou ne soit jamais chassé. Laisse aux Blancs un temps pour c3 et d4, mais rien de dangereux tout de suite."
   }
  ],
  "erreurs": [
   {
    "san": "d6",
    "pourquoi": "ferme la diagonale de votre propre fou b7 et laisse le roi au centre. Les Blancs jouent Cg5 : f7 est attaqué par le cavalier et le fou b3, et vous ne pouvez plus répondre d5 proprement car e4xd5 vous prend le pion."
   },
   {
    "san": "Qe7",
    "pourquoi": "la dame bloque la case e7 : votre fou f8 ne peut plus se développer et le roque est retardé. Les Blancs jouent a4 et attaquent b5 : votre aile dame craque alors que votre roi n'est pas encore à l'abri."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5",
  "nom": "Variante Arkhangelsk (Archangel)",
  "sens": "Développe le fou sur sa diagonale la plus active : il pointe vers f2, la case la plus fragile des Blancs après le roque, et surveille d4. Si les Blancs poussent d4, le fou reculera en b6 sans perdre de temps.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Prépare d4 avec un pion de soutien : le centre blanc avancera en force, et le fou noir devra reculer en b6. Laisse aux Noirs le temps de roquer, mais c'est le plan le plus solide."
   },
   {
    "san": "d3",
    "pourquoi": "Consolide e4 sans chercher le combat immédiat. Le pion d3 ferme la diagonale du fou b7 et laisse les Blancs manœuvrer tranquillement (Cbd2, Cf1, Cg3)."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque tout de suite la chaîne de pions b5-a6 : si elle craque, le fou b3 revit sur la diagonale a2-g8 et la tour a1 s'ouvre. Oblige les Noirs à réagir avant de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "d4",
    "pourquoi": "Pousse au centre sans préparation : après exd4, le pion e4 reste sans défense et le fou c5 est déjà bien placé. Les Blancs doivent se contorsionner pour regagner le pion, et les Noirs roquent tranquillement avec une position supérieure."
   },
   {
    "san": "Ng5",
    "pourquoi": "Vise f7, mais la case est bien protégée et le cavalier n'a pas de suite. Après O-O puis h6, il doit reculer et les Blancs ont perdu deux temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O",
  "nom": "Partie espagnole, variante classique (3...a6 4.Fa4 Fc5), ligne 5.c3 Cf6 6.d4",
  "sens": "Met le roi à l'abri avant de reprendre le pion : f2 n'est plus une cible et la tour arrive sur e1 pour soutenir e5 et chasser le cavalier e4.",
  "menace": "cxd4 ou Fxc6 suivi de Dxd4 pour rattraper le pion ; puis Te1 pour attaquer le cavalier e4 tant que le roi noir est au centre.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Protège solidement le cavalier e4 et ouvre la diagonale c8-h3 au fou. Si exd6 en passant, ...Cxd6 défend bien. Les Noirs gardent le pion d4 et un centre actif, même si les Blancs ont du jeu pour ce pion."
   },
   {
    "san": "Be7",
    "pourquoi": "Recule le fou avant qu'il soit attaqué par cxd4 et prépare ...O-O. Le fou ne fait plus pression sur f2, mais le roi noir sera vite à l'abri. Les Blancs récupèrent le pion d4, mais sans avantage net."
   }
  ],
  "erreurs": [
   {
    "san": "dxc3",
    "pourquoi": "Prendre un deuxième pion est gourmand : 9.Dd5 attaque le cavalier e4 et f7 en même temps. Les Noirs doivent rendre du matériel et le roi reste au centre, cible des tours blanches."
   },
   {
    "san": "Nxf2",
    "pourquoi": "Le sacrifice sur f2 ne marche plus car le roi a roqué : 9.Txf2 et le cavalier est simplement perdu. Les Noirs ont deux pions pour la pièce, ce qui ne suffit pas."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -91
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3",
  "nom": "Variante Arkhangelsk (Archangel)",
  "sens": "Soutient le pion d4 qui va avancer : le fou c5 sera chassé, le centre blanc gagne du terrain et la case c3 reste libre pour le cavalier plus tard.",
  "menace": "d4, qui gagne du temps sur le fou c5 et prépare d5 pour repousser le cavalier c6.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Recule tout de suite sur sa diagonale sûre : le fou garde l'œil sur f2 et d4 ne gagne plus de temps. Les Noirs rouquent ensuite sans souci."
   },
   {
    "san": "d6",
    "pourquoi": "Renforce e5 avant que d4 n'arrive : si d4 puis d5, le pion e5 tient. Donne aussi une case de repli au cavalier en e7."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord. Après d4, le fou reculera en b6 ; les Noirs perdent un temps mais le roi est déjà en sécurité."
   }
  ],
  "erreurs": [
   {
    "san": "Na5",
    "pourquoi": "Le cavalier court après le fou b3, mais Fc2 l'esquive et le cavalier reste au bord. Après d5 forcé, Cxe5 gagne un pion au centre."
   },
   {
    "san": "h6",
    "pourquoi": "Coup inutile sur l'aile : d4 attaque le fou, puis d5 chasse le cavalier c6. Les Blancs prennent tout le centre gratuitement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -42
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5",
  "sens": "Attaque la tour a8 avec le fou, qui était menacé d'être enfermé par ...c5-c4 : il force les Noirs à réagir tout de suite.",
  "menace": "Fxa8, gagnant la tour entière.",
  "plan": [
   {
    "san": "Rb8",
    "pourquoi": "Sauve la tour en gardant la diagonale fermée. Après Fc6+ Fd7 Fxd7+ Dxd7 Dxd4, tout s'échange et la position est égale : le pion d4 est repris, mais les Noirs ont terminé leur développement sans dégâts."
   }
  ],
  "erreurs": [
   {
    "san": "Bd7",
    "pourquoi": "Bloque l'échec mais ne défend pas la tour : Fxa8 Dxa8 et les Blancs ont gagné la qualité (tour contre fou) pour rien."
   },
   {
    "san": "Be6",
    "pourquoi": "Propose un échange, mais le fou blanc ne mord pas : Fc6+ Fd7 Fxa8 et la tour est perdue malgré tout."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 0
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O d5",
  "nom": "Défense classique (Cordel), 4...Fc5 avec 8...d5",
  "sens": "Protège le cavalier e4 avec le pion d et libère le fou c8 ; les Noirs veulent garder le pion d4 en plus et obtenir un centre solide.",
  "menace": "Aucune menace directe : les Noirs consolident simplement e4 et comptent conserver le pion d4.",
  "plan": [
   {
    "san": "exd6",
    "pourquoi": "Prend en passant tout de suite : la chaîne d5-e4 disparaît et le cavalier e4 perd son soutien. Après 9...Cxd6, le fou b5 peut prendre en c6 puis cxd4 chasse le fou c5 et récupère le pion. Les Blancs ressortent avec un centre sain et un pion d4 solide."
   },
   {
    "san": "cxd4",
    "pourquoi": "Récupère le pion sans attendre et attaque le fou c5. Les Noirs n'ont plus l'extra-pion et le fou doit reculer en b6 ou e7. Le pion e5 reste un peu avancé mais il gêne le développement noir."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Reprend avec le cavalier pour développer en même temps. Il attaque c6 et prépare Fxc6 ou Cxc6 ; les Noirs peuvent prendre en d4 (Fxd4 ou Cxd4) mais les Blancs reprennent et l'égalité est vite rétablie."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "Semble développer en attaquant e4, mais après 9...dxc3 ! le cavalier d2 est attaqué par le pion : si 10.Cxe4 dxe4, les Noirs ont gagné une pièce pour deux pions. Il faut d'abord reprendre en d4."
   },
   {
    "san": "a3",
    "pourquoi": "Coup d'attente inutile : 9...dxc3 10.Cxc3 Cxc3 11.bxc3 et les Noirs gardent leur pion de plus avec une structure blanche abîmée sur l'aile dame. Chaque temps perdu laisse le pion d4 aux Noirs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 81
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3 Bb6",
  "nom": "Partie espagnole, variante Arkhangelsk",
  "sens": "Met le fou à l'abri avant que d4 ne l'attaque avec gain de temps. De b6, il vise toujours f2 et le centre, et les Noirs peuvent roquer tranquillement.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Prend le centre tout de suite : le pion e5 est attaqué et le fou b6 ne peut plus y faire face seul. Après ...exd4 cxd4, les Blancs ont deux pions au centre et le fou b7 reste bloqué par e4. C'est le coup pour lequel c3 avait été joué."
   },
   {
    "san": "d3",
    "pourquoi": "Plus calme : soutient e4, ouvre la diagonale du fou c1 et prépare Cbd2 puis Cf1-g3. On se développe sans rien donner, et on gardera d4 pour plus tard."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne b5-a6 : si ...b4, le fou b3 respire et le cavalier c6 perd son appui. Les Noirs doivent répondre précisément, ce qui est utile contre des joueurs qui ignorent l'aile dame."
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "Vise f7 mais ne menace rien de réel : le fou b3 est bloqué par e4 et les Noirs roquent simplement. Puis ...d5 chasse tout, le cavalier doit reculer et les Blancs ont perdu deux temps."
   },
   {
    "san": "Re2",
    "pourquoi": "Veut protéger f2 ou doubler sur la colonne e, mais la tour bouche le fou c1 et la dame. Après ...O-O et ...d5, les Noirs ouvrent le centre et la tour mal placée gêne tout le développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 40
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5 Rb8",
  "sens": "Sauve la tour attaquée par le fou en d5 sans ouvrir la diagonale : la tour quitte a8 tout en gardant l'œil sur b5 et sur la colonne b.",
  "menace": "Rien d'immédiat, mais les Noirs ont un pion de plus (d4) et menacent de le garder avec c7-c5 ou Cg8-e7, puis de roquer tranquillement.",
  "plan": [
   {
    "san": "Qxd4",
    "pourquoi": "Reprend tout de suite le pion d4 : le matériel redevient égal et la dame s'installe au centre. Le fou reste en d5, actif, et gêne le développement noir. Les Noirs répondront Cf6 ou c6 pour le chasser, mais les Blancs ont du temps pour roquer."
   },
   {
    "san": "Bc6+",
    "pourquoi": "Échec qui force Fd7 ; après Fxd7+ Dxd7 Dxd4, tout s'échange et le pion est repris. Ligne simple et sans risque, mais on rend un fou actif contre un fou passif : la position est égale, les Noirs n'ont plus de problème."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant de reprendre le pion. Possible, car d4 ne s'enfuira pas et les Noirs doivent encore développer tout leur aile roi. Mais après Cf6 ou c6, le fou d5 doit bouger et le pion d4 devient plus difficile à récupérer."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "On veut déloger le pion d4, mais après dxc3 Cxc3 Cf6 les Noirs gardent un pion de plus et le fou d5 est attaqué. Il fallait reprendre directement avec la dame : Dxd4 est gratuit, c3 propose un échange qui offre un pion."
   },
   {
    "san": "b4",
    "pourquoi": "Semble bloquer c5, mais c7-c5 arrive quand même : le pion b4 est attaqué, et le pion d4 est solidement soutenu. Les Noirs jouent ensuite Cf6, gardent leur pion et chassent le fou d5. Un coup à l'aile pendant que le centre brûle."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -9
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3 Bb6 d4",
  "nom": "Espagnole, variante Arkhangelsk (ligne moderne avec ...Fc5)",
  "sens": "Attaque e5 avec le pion d en s'appuyant sur c3 : si les Noirs prennent, cxd4 reconstruit un centre e4-d4 solide qui enferme le fou b7 et limite le fou b6.",
  "menace": "d5, qui chasse le cavalier c6 : après ...Ca5 le cavalier f3 prend e5 et le roi noir, encore au centre, se retrouve exposé.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Soutient e5 avec un pion et surtout empêche d5 d'être gênant : le cavalier c6 restera protégé. Le fou b6 garde la diagonale vers f2. Les Blancs peuvent répondre a4 ou Fg5 et conservent un petit avantage d'espace."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant que le centre ne s'ouvre. Après d5 Ca5 Fc2 ou Cxe5, les Noirs regagnent du temps avec ...d6 ou ...c5. Il faut cependant être prêt à voir e5 tomber temporairement."
   }
  ],
  "erreurs": [
   {
    "san": "Na5",
    "pourquoi": "Veut échanger le fou b3, mais oublie que e5 n'est plus défendu : Cxe5 ! Si ...Cxb3 Dxb3, les Blancs ont pris un pion gratuit et visent déjà f7 avec dame et cavalier."
   },
   {
    "san": "d5",
    "pourquoi": "Coup central tentant, mais prématuré : exd5 Cxd5 puis Cxe5. Le pion e5 tombe, le cavalier c6 est attaqué et le roi noir n'est pas roqué. Les Noirs perdent du matériel sans compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -40
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O d5 exd6",
  "sens": "Prend en passant pour casser la chaîne d5-e4 : le cavalier e4 perd son point d'appui, et le pion d6 menace maintenant la dame et le roi noir au centre.",
  "menace": "dxc7 fourche la dame d8 ; puis cxd4 chasse le fou c5 et reprend le pion. Si rien n'est fait, le roi noir reste au centre avec un centre blanc dominant.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Après 10.dxc7 Dxc7, les Noirs ont perdu un pion mais sont développés et roqués, avec le cavalier e4 actif. C'est le seul coup qui limite les dégâts : les autres laissent le roi au centre ou perdent du matériel."
   }
  ],
  "erreurs": [
   {
    "san": "Be6",
    "pourquoi": "Semble développer, mais 10.dxc7 Dxc7 11.cxd4 : les Blancs gagnent un pion et chassent le fou c5. Le roi noir est encore au centre et les Noirs ont perdu du temps."
   },
   {
    "san": "Qxd6",
    "pourquoi": "Récupère le pion, mais 10.cxd4 attaque le fou c5 et après 10...Fa7 11.d5 chasse le cavalier c6 et gagne du terrain : la dame est exposée au centre et les Blancs prennent l'initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -84
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3 Bb6 d4 d6",
  "nom": "Variante Arkhangelsk (Archangel)",
  "sens": "Soutient e5 avec un pion et empêche la poussée d5 de gêner le cavalier c6, qui restera protégé. Le fou b6 garde la diagonale vers f2 et le centre noir tient.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en face du fou b6 et protège la case d4. Si les Noirs échangent sur e3, les Blancs gardent un centre solide ; sinon le fou b6 est neutralisé."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame et met la pression sur e5 : le centre noir devient plus difficile à tenir. Les Noirs répondent souvent h6, ce qui affaiblit un peu leur roque."
   },
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne de pions b5-a6 sur l'aile dame. Les Noirs doivent réagir, et une ouverture de la colonne a donne une cible aux Blancs."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "Trop tôt : le cavalier bouche la défense de d4. Après exd4 cxd4 Nxd4, les Noirs gagnent un pion central, car le cavalier c6 prend et rien ne le reprend."
   },
   {
    "san": "Re2",
    "pourquoi": "Coup sans but : la tour n'est pas mieux sur e2 et n'ajoute aucune pression. Après O-O et Na5, les Noirs échangent le bon fou b3 et égalisent facilement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 45
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5 Rb8 Qxd4",
  "sens": "Reprend le pion d4 et centralise la dame : elle surveille g7, la colonne d et soutient le fou d5 qui gêne le roque noir.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant le fou d5 et le pion e4 : les Blancs doivent perdre un temps pour sauver le fou (Fb3 ou Fc6+) ou défendre e4. Prépare le roque. Attention : après Fc6+ Fd7 Fxd7+ Dxd7, le fou blanc s'échange, ce qui soulage les Noirs."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou en douceur et couvre la case c6 : le fou blanc ne pourra plus faire échec en c6. Prépare Cf6 puis c6 pour chasser le fou d5. Le fou en d7 est passif mais solide."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe en attaquant directement le fou d5 : il doit bouger tout de suite. Laisse la diagonale h4-d8 fermée et prépare le roque. Moins actif que Cf6, car le cavalier ne touche pas e4."
   }
  ],
  "erreurs": [
   {
    "san": "Bb7",
    "pourquoi": "Tentant pour échanger le fou gênant, mais après Fxb7 Txb7 la tour sort de sa colonne et reste en l'air en b7 : Dc3 vise ensuite c7 et les pions a6-c7 deviennent faibles. Les Noirs n'ont rien gagné et leur roque recule."
   },
   {
    "san": "f5",
    "pourquoi": "Veut chasser e4, mais exf5 ouvre la diagonale du fou d5 sur le roi : le roi noir ne peut plus roquer tranquillement et le pion e5 blanc sera fort. Les Noirs sont en retard de développement et leur position s'ouvre au mauvais moment."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 6
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O d5 exd6 O-O",
  "sens": "Met le roi à l'abri avant de s'occuper du pion c7. Le roi noir quitte le centre, la tour f8 arrive sur la colonne f, et le cavalier e4 reste actif. Les Noirs acceptent de perdre un pion pour finir leur développement.",
  "menace": "Reprendre tranquillement sur d6 (Dxd6 ou Cxd6) et récupérer le pion tout en gardant le cavalier e4.",
  "plan": [
   {
    "san": "dxc7",
    "pourquoi": "Prend le pion c7 avant qu'il ne soit défendu. Après 10...Dxc7, les Blancs ont un pion de plus. Attention ensuite : le pion d4 est attaqué, il faut le reprendre (cxd4) et surveiller le cavalier e4 et le fou c5 qui visent le roi."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "Semble attaquer le cavalier e4, mais oublie le pion c7 qui reste intouchable ensuite. Après 10...Ff5 le cavalier est défendu, puis 11.cxd4 Fxd6 : les Noirs reprennent le pion d6 et l'égalité est complète."
   },
   {
    "san": "Bxc6",
    "pourquoi": "Échange le bon fou pour rien : après 10...bxc6 11.dxc7 Dxc7, les Noirs ont les deux fous et une tour prête sur b8. Le pion gagné compte moins que l'activité perdue."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 90
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3 Bb6 d4 d6 Be3",
  "nom": "Espagnole, variante Archangel (Arkhangelsk)",
  "sens": "oppose son fou au fou b6 et consolide d4 : si les Noirs échangent, le centre blanc reste intact ; sinon le fou noir ne mord plus sur rien.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri avant d'ouvrir le centre. Les Noirs gardent le choix entre ...exd4 et ...Ca5 selon la réponse des Blancs."
   },
   {
    "san": "Na5",
    "pourquoi": "chasse le fou b3, meilleure pièce blanche. Après Fc2, le cavalier revient par c4 ou c6 et les Noirs ont gagné du temps pour roquer."
   },
   {
    "san": "exd4",
    "pourquoi": "ouvre la colonne e et la diagonale du fou b7 vers e4. Après cxd4, le fou b6 presse sur d4 ; les Blancs obtiennent toutefois un centre large."
   }
  ],
  "erreurs": [
   {
    "san": "Ba5",
    "pourquoi": "retire le fou de la lutte pour d4 et perd du temps. Les Blancs jouent Cbd2 puis Fg5 et clouent le cavalier f6 : les Noirs reculent partout."
   },
   {
    "san": "Rc8",
    "pourquoi": "laisse b5 sans défense. Après a4 bxa4 Txa4, le pion a6 est faible et la tour c8 ne fait rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -40
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5 Rb8 Qxd4 Nf6",
  "nom": "Variante Steinitz différée (ligne 5.d4 b5 6.Fb3 Cxd4)",
  "sens": "développe le cavalier en attaquant deux cibles à la fois : le fou d5 et le pion e4. Les Blancs doivent répondre à cette double pression avant de poursuivre leur développement, et les Noirs préparent le petit roque.",
  "menace": "Cxd5 suivi de Dxd5 : gagner le fou, ou au minimum prendre le pion e4 si les Blancs ne le défendent pas",
  "plan": [
   {
    "san": "Bc6+",
    "pourquoi": "Sauve le fou avec échec, donc sans perdre de temps. Après Fd7 Fxd7+ Dxd7, le fou blanc s'échange : les Blancs gardent un léger plus d'espace au centre, mais les Noirs ont fini de résoudre leurs problèmes de développement. Simple et sans risque pour un débutant."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité en ignorant l'attaque sur le fou : si Cxd5 exd5, le pion d5 gêne les Noirs et la dame d4 domine le centre. Demande d'accepter l'échange du fou contre le cavalier, mais garde une position active."
   },
   {
    "san": "Nc3",
    "pourquoi": "Défend e4 et le fou d5 d'un seul coup : si Cxd5 Cxd5, le cavalier arrive sur une case superbe au centre. Développe une pièce au lieu de reculer, et prépare le roque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -9
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O d5 exd6 O-O dxc7",
  "sens": "Le pion blanc arrive en c7 et attaque la dame noire en d8 : il menace aussi de monter en d8 pour devenir une dame. Les Noirs doivent répondre à cette attaque tout de suite.",
  "menace": "cxd8=D : le pion prend la dame et se transforme en dame.",
  "plan": [
   {
    "san": "Qxc7",
    "pourquoi": "Mange le pion dangereux et règle le problème d'un coup. La dame est active en c7, le cavalier e4 et le fou c5 regardent le roi blanc. Les Blancs ont un pion de plus, mais les Noirs ont des pièces bien placées."
   },
   {
    "san": "Qf6",
    "pourquoi": "Sauve la dame en attaquant f2 avec le cavalier e4 et le fou c5. Le pion c7 reste vivant, mais il ne peut pas avancer : la case c8 est occupée par le fou. Attention, les Blancs gardent ce pion en plus."
   },
   {
    "san": "Qd6",
    "pourquoi": "Sauve la dame et attaque le pion c7 en même temps. Le pion est condamné : il tombera au coup suivant. La dame reste au centre et surveille d4."
   }
  ],
  "erreurs": [
   {
    "san": "dxc3",
    "pourquoi": "Prend un pion mais oublie la dame en d8 ! Les Blancs jouent cxd8 et se font une nouvelle dame. Toujours regarder quelle pièce est attaquée avant de prendre."
   },
   {
    "san": "Nxf2",
    "pourquoi": "Attaque tentante contre le roi, mais la dame d8 est toujours en prise : cxd8=D et les Noirs ont perdu leur dame pour un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -89
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7 Re1 Bc5 c3 Bb6 d4 d6 Be3 O-O",
  "nom": "Partie espagnole, défense Arkhangelsk (variante moderne)",
  "sens": "Met le roi à l'abri avant que le centre ne s'ouvre. La tour f8 arrive sur la colonne f et les Noirs attendent de voir ce que font les Blancs en d4 pour choisir entre ...exd4 et ...Ca5.",
  "menace": "Rien d'immédiat, mais ...Ca5 pèse sur le fou b3 et ...exd4 va ouvrir le centre.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Ferme le centre et chasse le cavalier c6 : il doit aller en a5 ou e7. Le fou b7 se retrouve face à un mur en d5 et devient passif. Les Blancs gardent l'espace, les Noirs devront chercher du jeu par ...c5 ou ...f5."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce et prépare Cf1-g3, le trajet classique de l'Espagnole. Le cavalier d2 protège aussi e4 et couvre b3 si le cavalier noir vient en a5. Les Noirs peuvent jouer ...exd4 et le centre s'ouvre, mais les Blancs sont prêts."
   },
   {
    "san": "Bc2",
    "pourquoi": "Retire le fou de b3 avant que ...Ca5 ne vienne le prendre. Le fou vise h7 depuis c2 et le pion b3 peut plus tard avancer pour gêner le cavalier a5."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "Développe la dame au mauvais moment. Après ...exd4 cxd4 Ca5, le fou b3 n'a plus de case et les Noirs prennent le fou contre le cavalier. Avant de bouger la dame, il faut régler le sort du fou b3."
   },
   {
    "san": "h3",
    "pourquoi": "Coup prudent mais lent : ...Ca5 attaque le fou b3. Les Blancs doivent jouer Cbd2 pour le défendre et le cavalier prend quand même en b3, cédant la paire de fous. Un coup sans développement coûte un temps précieux ici."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 40
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5 Rb8 Qxd4 Nf6 Bc6+",
  "sens": "Met le fou en sécurité avec échec : les Noirs doivent parer avant de capturer quoi que ce soit. Le fou s'installe sur c6 d'où il prépare son échange, et la dame d4 attaque déjà le pion d6.",
  "menace": "Rien d'immédiat : la dame d4 appuie seulement sur d6, et le fou c6 attend d'être échangé.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Bloque l'échec en développant une pièce. Après Fxd7+ Dxd7, les Noirs ont réglé leur développement et peuvent roquer rapidement. Les Blancs gardent un peu plus d'espace au centre, mais le jeu est égal. Le seul bon coup."
   }
  ],
  "erreurs": [
   {
    "san": "Qd7",
    "pourquoi": "Bloque l'échec avec la mauvaise pièce. Le fou prend la dame : Fxd7+ Fxd7 et les Noirs ont perdu leur dame contre un fou. Il faut toujours vérifier quelles pièces couvrent la case que l'on interpose."
   },
   {
    "san": "Ke7",
    "pourquoi": "Le roi avance et bloque le fou f8 : les Noirs ne pourront plus roquer. Les Blancs ouvrent le centre par e5, dxe5 Dxe5+, et le roi reste au milieu sous le feu des pièces blanches."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 8
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 O-O d5 exd6 O-O dxc7 Qxc7",
  "sens": "reprend le pion c7 avec la dame : les Noirs n'ont plus de pion blanc dans leur camp, la dame est active en c7 et la colonne c s'ouvre pour elle. Le pion d4 reste en prise, mais il attaque c3 et bloque le centre blanc.",
  "menace": "dxc3, qui gagne un pion et ouvre la diagonale du fou c5 vers f2 ; le cavalier e4 vise déjà f2.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "reprend le pion au centre et chasse le fou c5 : il doit reculer (en b6 ou d6). Les Blancs gardent leur pion de plus, ouvrent la case c3 pour le cavalier b1 et restent avec un centre solide. C'est le seul coup qui conserve l'avantage : tous les autres laissent le pion d4 vivre et les pièces noires s'installer."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "prend le même pion avec le cavalier, mais le cavalier quitte f3 et le roi blanc perd son meilleur défenseur. Les Noirs jouent Fd7 puis Td8 : la dame c7 et la tour pressent la colonne d et le cavalier d4 clouté. L'avantage fond presque entièrement."
   },
   {
    "san": "Bxc6",
    "pourquoi": "échange un bon fou contre le cavalier, mais après Dxc6 la dame noire est encore plus active : elle regarde g2 avec le cavalier e4 et le fou c5. Les Blancs reprennent en d4, le fou recule en d6 et les Noirs ont toutes leurs pièces tournées vers le roi blanc. Le pion de plus ne compte presque plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 92
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Bd5 Rb8 Qxd4 Nf6 Bc6+ Bd7",
  "sens": "Pare l'échec en développant le fou. Mais le fou d7 attaque aussi le fou blanc en c6, qui n'est défendu par rien : les Blancs doivent réagir tout de suite.",
  "menace": "Fxc6, qui gagne le fou blanc sans compensation.",
  "plan": [
   {
    "san": "Bxd7+",
    "pourquoi": "Échange le fou attaqué avant de le perdre. Après Dxd7, les Noirs ont fini leur développement et vont roquer, mais les Blancs gardent plus d'espace au centre grâce au pion e4 et à la dame bien placée en d4. Position équilibrée, c'est le coup simple et sûr."
   },
   {
    "san": "Qc3",
    "pourquoi": "Défend le fou c6 par la dame le long de la colonne c. Si Fxc6 Dxc6+, les Noirs doivent répondre Cd7 et leur roque est retardé. Un peu moins précis que l'échange : la dame se fait chasser plus tard par les pièces noires."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer ignore la menace : Fxc6 gagne le fou, et il n'y a aucune reprise. Un coup naturel qui perd une pièce entière."
   },
   {
    "san": "Bd5",
    "pourquoi": "Reculer au centre semble logique, mais c6 chasse le fou vers b3, puis c5 attaque la dame et le fou b3 sera enfermé par ...c4. Les pions noirs gagnent du temps et le fou blanc finit piégé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -10
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6",
  "nom": "Défense berlinoise, variante 4.d3 avec 4...Fd6",
  "sens": "Protège le pion e5 sans bloquer le fou de cases noires derrière un pion : il prévoit 0-0, Te8 puis Ff8 pour libérer le pion d7 et rouvrir le fou. Solide mais lent, car le fou gêne provisoirement le pion d.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Prépare d4 pour contester le centre pendant que le fou d6 bloque son propre pion d7. Offre aussi une case de repli en c2 au fou b5 et laisse aux Noirs le temps de roquer."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Coup sans risque : les Noirs n'ont aucune menace, donc on finit le développement et on décide ensuite entre c3-d4 et Cbd2-Cc4."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe en visant c4, d'où le cavalier attaquera le fou d6 et le pion e5. Garde la structure souple, mais retarde le roque d'un coup et ferme la diagonale du fou c1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 49
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3",
  "sens": "Prépare d4 pour chasser le fou d6 et ouvrir le centre. Donne aussi au fou b5 une case de repli en c2 si a6 le chasse. Coup calme : il ne menace rien tout de suite.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant que le centre ne s'ouvre. Après d4, les Noirs pourront répondre calmement avec Te8 ou Fb4 ; un roi au centre serait exposé."
   },
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit reculer en a4 ou prendre en c6. Gagne un temps avant de roquer, et un futur b5 pourra encore chasser le fou."
   },
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 au fou c1, pour qu'il ne cloue jamais le cavalier f6. Coup utile mais lent : il laisse aux Blancs le temps de jouer d4 sans être gênés."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "La dame se met devant le fou d6 : le fou et le cavalier b8 n'ont plus de case naturelle. Après O-O O-O Te1, la dame gêne tout le développement et se trouvera sur la colonne e ouverte."
   },
   {
    "san": "Ng8",
    "pourquoi": "Recule un cavalier déjà développé pour le remettre en e7 : deux temps perdus. Les Blancs roquent puis jouent Cbd2, d4, et prennent une grosse avance de développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O",
  "sens": "Met le roi en sécurité et connecte la tour f8 avant l'ouverture du centre. Les Noirs peuvent maintenant jouer ...Te8 ou ...h6 sans craindre d'attaque sur le roi.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même logique que les Noirs : le roi à l'abri avant d'ouvrir le centre. Les Blancs pourront ensuite pousser d4 ou Te1 sans risque. Ne crée aucune faiblesse."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce mineure et renforce e4. Le cavalier vise f1 puis g3 (ou c4) pour s'approcher du roi noir. Laisse aux Noirs le temps de jouer ...Te8 ou ...h6."
   },
   {
    "san": "a4",
    "pourquoi": "Donne une case de repli au fou b5 (il ne sera plus gêné par ...a6 ...b5) et gagne de l'espace à l'aile dame. Un coup utile qui ne presse pas et garde toutes les options."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Semble gagner de l'espace, mais le pion c3 ne contrôle plus d4. Après ...Fc5 et ...Cd4, le cavalier noir s'installe au centre, attaque le fou b5 et force des échanges favorables aux Noirs. Les Blancs perdent le temps et la case d4 pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O",
  "nom": "Partie espagnole, défense berlinoise (variante 4.d3)",
  "sens": "met le roi à l'abri avant d'ouvrir le jeu : la tour f1 pourra venir en e1 appuyer e4, puis les Blancs pousseront d4 pour attaquer le centre noir sans craindre d'échec gênant.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "Défend une seconde fois le pion e5. Le fou d6 bloque le pion d7 : la tour prépare son recul (Fou f8) pour libérer la colonne d. Si les Blancs prennent en c6 puis en e5, le pion est couvert."
   },
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit prendre en c6 (et renforcer notre centre après bxc6) ou reculer en a4. Gagne de l'espace sur l'aile dame et prépare b5 pour chasser le fou encore une fois."
   },
   {
    "san": "Ne7",
    "pourquoi": "Sort le cavalier de la prise du fou b5. Il vise g6 et c6 ; le fou d6 pourra ensuite reculer en c7 et le pion d7 avancer. Laisse les Blancs jouer d4, mais e5 reste défendu par le cavalier f6 et le fou."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou quitte la défense du pion e5. Les Blancs jouent Fxc6 puis bxc6 et Cxe5 : le pion tombe, car le cavalier c6 qui le gardait a disparu. Même problème avec Fe7."
   },
   {
    "san": "Na5",
    "pourquoi": "Le cavalier part au bord sans rien attaquer : le fou recule en a4 et reste en jeu. Après Te1, le pion e5 n'est plus défendu que par le fou, et le cavalier a5 est hors du jeu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8",
  "sens": "Surprotège le pion e5 et prépare le repli du fou en f8 : une fois d6 libéré, le pion d7 pourra avancer et le fou c8 sortir.",
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame. Les Noirs auront du mal à jouer ...d5 ou ...Fe7 sans perdre du temps, et h6 suivi de g5 affaiblirait leur roque."
   },
   {
    "san": "Re1",
    "pourquoi": "Même idée que Te8 : la tour renforce e4 et libère f1 pour un cavalier ou le fou. Coup solide qui garde toutes les options (d4 ou Cbd2 ensuite)."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce mineure. Le cavalier ira en f1 puis g3 (ou e3) : la manœuvre classique de l'Espagnole pour viser f5 et le roque noir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5",
  "sens": "Cloue le cavalier f6 sur la dame d8 : s'il bouge, la dame est prise. Du coup ...d5 devient difficile à préparer, et les Noirs doivent décider comment gérer ce clouage sans affaiblir leur roque.",
  "plan": [
   {
    "san": "h6",
    "pourquoi": "Pose la question au fou tout de suite. S'il recule en h4, le clouage reste mais le cavalier f6 est moins gêné ; s'il prend en f6, les Noirs reprennent de la dame avec la paire de fous. Attention : ne pas continuer par ...g5, qui ouvrirait le roque pour rien."
   },
   {
    "san": "a6",
    "pourquoi": "Chasse le fou b5 avant de s'occuper du clouage. Après Fa4, ...b5 gagne encore un temps, et les Noirs gardent le choix entre ...Fe7 et ...h6 selon la réponse des Blancs."
   },
   {
    "san": "Be7",
    "pourquoi": "Le fou revient en e7 pour couvrir le cavalier : le clouage n'existe plus. On perd un temps, mais la position redevient saine et ...d5 ou ...d6 suivi de ...Cd7 deviennent possibles."
   }
  ],
  "erreurs": [
   {
    "san": "Nb8",
    "pourquoi": "Un coup de recul qui ne règle rien : le cavalier c6 retourne à sa case de départ pour rien. Les Blancs jouent Fa4 et gardent le clouage ; les Noirs ont juste perdu deux temps de développement."
   },
   {
    "san": "Kf8",
    "pourquoi": "Quitter le roque pour annuler le clouage est une idée bizarre et dangereuse : le roi est moins bien protégé, la tour h8... pardon la tour e8 est bloquée, et après Cbd2 puis Fa4 les Blancs se développent tranquillement avec un roi noir mal placé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -37
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6",
  "sens": "Chasse le fou qui cloue le cavalier f6 : il doit choisir tout de suite entre reculer et échanger, et les Noirs gagnent du temps pour respirer sur l'aile roi.",
  "menace": "...hxg5 : prendre le fou pour rien s'il reste en g5.",
  "plan": [
   {
    "san": "Bh4",
    "pourquoi": "Le seul bon coup. Le fou recule mais garde le clouage sur la diagonale h4-d8 : le cavalier f6 reste collé à la dame. Les Noirs peuvent le chasser encore par ...g5, mais cela affaiblirait leur roque ; le fou irait alors en g3 viser e5 et d6. Tous les autres coups perdent du matériel ou l'avantage."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "Développer en oubliant que le fou est attaqué ! Les Noirs jouent ...hxg5 et prennent une pièce. Reprendre par Cxg5 ne sauve rien : après ...Fe7 le cavalier est attaqué et les Blancs ont perdu un fou pour un pion."
   },
   {
    "san": "Bxh6",
    "pourquoi": "Un sacrifice qui ressemble à une attaque, mais il n'y a pas de suite : après ...gxh6 aucune pièce blanche n'arrive sur le roi noir. Les Noirs reculent le fou en f8, consolident, et gardent une pièce de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4",
  "sens": "Le fou recule sans lâcher le clouage : le cavalier f6 reste collé à la dame d8 sur la diagonale h4-d8. Les Blancs veulent ensuite pousser d4 ou jouer Cbd2-c4 pour peser sur e5, avec le cavalier noir immobile.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Le fou revient en e7 pour casser le clouage : le cavalier f6 est de nouveau libre et la dame n'est plus visée. Cela prend un temps, mais le fou en d6 bloquait de toute façon le pion d7 et donc le développement du fou c8."
   },
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit décider tout de suite, prendre en c6 ou reculer en a4. Si Fxc6, dxc6 ouvre la colonne d et libère le fou c8. Le clouage reste en place, il faudra encore le régler."
   },
   {
    "san": "g5",
    "pourquoi": "Chasse le fou en g3 et libère tout de suite le cavalier f6. Mais les pions g5-h6 devant le roi sont affaiblis, et le fou g3 vise e5 et d6 : à ne jouer que si l'on accepte un roque un peu aéré."
   }
  ],
  "erreurs": [
   {
    "san": "Na5",
    "pourquoi": "Le cavalier part sur le bord pour chasser le fou, mais après Fa4 Tb8 Fc2 il ne fait plus rien en a5 : il ne surveille plus e5 ni d4, et les Blancs préparent d4 contre le centre noir. Un cavalier sur le bord est mal placé."
   },
   {
    "san": "Nb8",
    "pourquoi": "Reculer pour ensuite jouer ...c6 perd trop de temps : les Blancs jouent d4 aussitôt, et après exd4 Te1 la pression sur la colonne e et le cavalier cloué rendent la position noire pénible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -33
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4 Be7",
  "sens": "Casse le clouage sur la diagonale h4-d8 : le cavalier f6 peut bouger sans perdre la dame, et le pion d7 est enfin libre d'avancer pour ouvrir le fou c8. Les Noirs reconnaissent que Fd6 était un coup inutile.",
  "plan": [
   {
    "san": "Bg3",
    "pourquoi": "Retire le fou de h4 où un Cf6-h5 pourrait l'échanger ou le chasser. En g3 il garde la diagonale vers e5 et c7, hors de portée des pièces noires. Les Blancs gardent une position solide et attendent que les Noirs se dévoilent."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier vers f1 puis e3 ou g3, le chemin classique de l'Espagnole. Il garde aussi e4. Le fou c1 étant déjà sorti, la case d2 est libre pour cela."
   },
   {
    "san": "Re1",
    "pourquoi": "Renforce e4 avec la tour et met la tour sur la colonne qui s'ouvrira après d3-d4. Cela prépare la poussée centrale d4 qui gagne de l'espace."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 34
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4 Be7 Bg3",
  "sens": "Met le fou à l'abri d'un éventuel Cf6-h5 tout en le gardant actif : depuis g3 il vise toujours e5 et c7, et aucune pièce noire ne peut l'attaquer. Les Blancs menacent surtout Fxc6 suivi de Cxe5 pour gagner le pion e5, désormais mal défendu.",
  "menace": "Fxc6 puis Cxe5 : si le fou de c6 disparaît, le pion e5 n'est plus protégé que par le cavalier, et Cxe5 le ramasse.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Défend e5 avec un pion, la façon la plus solide. Ouvre aussi la diagonale c8-h3 au fou de c8. Les Noirs n'ont plus peur de Fxc6 et peuvent développer tranquillement."
   },
   {
    "san": "Bd6",
    "pourquoi": "Renforce e5 avec le fou et neutralise le fou blanc de g3 sur la même diagonale. Moins naturel car le fou bloque le pion d7, mais e5 est bien gardé."
   }
  ],
  "erreurs": [
   {
    "san": "Nh5",
    "pourquoi": "Veut échanger le fou de g3, mais après Fxc6 ! le cavalier c6 disparaît, puis Cxh3 ou simplement hxg3 : les Noirs perdent du temps et e5 reste faible."
   },
   {
    "san": "a6",
    "pourquoi": "Chasse le fou, mais ne défend rien : Fxc6 bxc6 Cxe5 gagne simplement le pion e5. Il faut d'abord protéger e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4 Be7 Bg3 d6",
  "sens": "Consolide le centre : e5 est maintenant tenu par un pion, le cavalier c6 n'est plus indispensable. Le fou c8 respire et peut sortir en e6 ou g4. Les Noirs sont prêts à jouer tranquillement, sans crainte de Fxc6.",
  "plan": [
   {
    "san": "Ba4",
    "pourquoi": "Retire le fou avant qu'il soit chassé par ...a6 et ...b5 avec gain de temps. Depuis a4 il garde la pression sur c6 et pourra se replier en c2 pour viser le roi noir. Les Noirs continueront par ...Fe6 ou ...Cd7-c5."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce mineure. Le cavalier va en f1 puis e3 ou g3, le trajet classique de l'Espagnole. Il laisse aux Noirs le temps de jouer ...a6 et ...b5, mais les Blancs gardent une position souple."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou c8 et au cavalier f6. Un coup de patience : il évite ...Fg4 qui clouerait le cavalier f3 et gênerait le plan Cbd2-f1. En contrepartie il ne crée aucune menace, les Noirs développent librement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4 Be7 Bg3 d6 Ba4",
  "sens": "Recule le fou avant que ...a6 et ...b5 ne le chassent avec gain de temps. Depuis a4, il continue de regarder le cavalier c6 et garde la route vers c2, d'où il viserait h7 et le roi noir.",
  "plan": [
   {
    "san": "Bg4",
    "pourquoi": "Développe le dernier fou en attaquant le cavalier f3, qui protège e5 et d4. Les Blancs devront jouer h3 ou Cbd2 pour s'en occuper : les Noirs gagnent du temps et pourront ensuite jouer ...Ch5 pour chasser le fou g3."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe en proposant l'échange du fou a4 : le fou c8 ne faisait rien, celui des Blancs vise le roi. Si les Blancs refusent, le fou d7 soutient c6 et libère la case c8 pour une tour."
   },
   {
    "san": "Nh5",
    "pourquoi": "Attaque le fou g3. S'il est pris, la structure des Blancs se dédouble sur g ; s'il recule, le cavalier revient en f6 ou va en f4. Le point faible : h5 laisse e5 un peu moins défendu, il faut vérifier que d4 ne gagne rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -18
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bd6 c3 O-O O-O Re8 Bg5 h6 Bh4 Be7 Bg3 d6 Ba4 Bg4",
  "sens": "Sort le dernier fou en clouant presque le cavalier f3 sur la dame : ce cavalier garde e5 et d4, donc les Blancs doivent le soulager. Le coup prépare aussi ...Ch5 pour chasser ou échanger le fou g3.",
  "menace": "Pas de menace directe, mais ...Ch5 suivi de ...Cxg3 ou ...Fxf3 pour abîmer la structure blanche et affaiblir la case d4.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe en protégeant f3 : si ...Fxf3, le cavalier reprend sans abîmer les pions. Il regarde aussi c4 et f1 pour rejoindre e3. Les Noirs gardent le choix entre ...Ch5 et un lent ...Dd7."
   },
   {
    "san": "h3",
    "pourquoi": "Pose la question au fou tout de suite : il doit prendre en f3 (les Blancs gagnent la paire de fous) ou reculer en h5 puis se faire chasser par g4. Petit inconvénient : les cases g3 et h3 sont un peu plus fragiles après ...Ch5."
   },
   {
    "san": "Re1",
    "pourquoi": "Renforce e4 et met la tour sur la colonne centrale avant de jouer d4. Coup calme qui laisse aux Noirs le temps de ...Ch5, mais sans rien concéder."
   }
  ],
  "erreurs": [
   {
    "san": "Bh4",
    "pourquoi": "Perd du temps pour rien : le fou revient sur une case qu'il a déjà quittée. Après ...Cd7 ! le cavalier f6 se décale et le fou h4 n'attaque plus que le fou e7 ; ...Fxh4 ou Fxe7 Txe7 suivent et les Noirs ont gagné deux tempi dans un centre équilibré."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6",
  "nom": "Partie espagnole, défense Bird (3...Cd4) avec 4.Fc4 d6",
  "sens": "Consolide le pion e5 et libère le fou c8 : le cavalier d4 pourra maintenant reculer ou être échangé sans que e5 tombe.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Échange le cavalier avancé des Noirs. Après ...exd4, le pion noir d4 est isolé et bloque la diagonale du fou f8 ; les Blancs auront un jeu facile avec c3 et d3 pour l'attaquer. C'est le coup le plus fort."
   },
   {
    "san": "c3",
    "pourquoi": "Chasse le cavalier d4 sans échanger : il doit reculer. Le pion c3 prépare aussi d4 pour prendre le centre. Attention : pendant un instant le pion e4 reste gardé seulement par le fou c4, les Noirs peuvent jouer ...Fg4."
   },
   {
    "san": "d3",
    "pourquoi": "Défend solidement e4 et ouvre la diagonale du fou c1. Coup calme : les Blancs continueront avec c3, O-O et Te1 tranquillement. Laisse aux Noirs le temps de se développer, mais sans contre-jeu réel."
   }
  ],
  "erreurs": [
   {
    "san": "Bb3",
    "pourquoi": "Le fou se cache alors qu'il n'est pas attaqué, et l'oubli coûte cher : ...Fg4 cloue le cavalier f3, et si c3 pour chasser le cavalier, ...Cxf3+ et la structure du roque blanc est abîmée. Les Blancs perdent toute leur avance."
   },
   {
    "san": "Be2",
    "pourquoi": "Rentrer le fou revient à perdre du temps : après ...Cxe2 Dxe2 les Noirs échangent le cavalier contre le bon fou blanc. Le fou c4 visait f7, le fou e2 ne vise rien. Avantage envolé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Prend le cavalier qui s'était aventuré au centre : les Blancs forcent une reprise avec le pion e5, qui laissera un pion noir isolé en d4, facile à cibler et gênant pour le développement du fou f8.",
  "menace": "Les Blancs ont une pièce de plus. Si les Noirs ne reprennent pas tout de suite, le cavalier d4 recule tranquillement (Cf3 ou Cb5) et la pièce est perdue pour rien.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Le seul coup : il récupère la pièce. Le pion d4 est isolé mais il prend de l'espace et gêne le cavalier b1. Ensuite, développer vite avec ...Cf6 et ...Fe7, et roquer. Les Blancs joueront c3 et d3 pour attaquer ce pion : il faudra le soutenir ou l'échanger au bon moment."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développer est un bon réflexe, mais ici on oublie qu'une pièce est en prise. Après 6.Cf3, le cavalier blanc est sauvé et les Blancs ont simplement un cavalier de plus : la partie est quasiment perdue."
   },
   {
    "san": "Qh4",
    "pourquoi": "Attaquer e4 et f2 avec la dame paraît agressif, mais 6.Df3 défend tout, et le cavalier d4 reste en vie. Les Noirs restent avec une pièce de moins et une dame exposée que les Blancs vont chasser en gagnant du temps (Cb5, Cc3)."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -49
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4",
  "nom": "Partie espagnole, variante Bird",
  "sens": "Reprend la pièce avec le pion : la structure noire est un peu abîmée (pion d4 isolé), mais ce pion gêne le cavalier blanc, qui n'a plus la case c3.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "Solidifie e4 et ouvre la diagonale du fou c1. Les Blancs pourront ensuite jouer c3 pour attaquer le pion d4 : s'il prend en c3, le cavalier b1 retrouve sa case et se développe en reprenant."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant toute action au centre. Le fou c4 vise déjà f7 : il faut le garder actif et ne pas se presser, le pion d4 ne s'enfuira pas."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4. Si les Noirs l'échangent par ...dxc3, Cxc3 développe le cavalier avec gain de temps ; s'ils le soutiennent par ...c5, leur fou f8 se retrouve un peu enfermé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 54
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3",
  "nom": "Variante Bird (3...Cd4)",
  "sens": "Protège e4 une fois pour toutes et libère le fou c1. Le pion d4 noir est isolé loin de sa base : les Blancs préparent c3 pour le harceler, et si ...dxc3 le cavalier b1 se développe en reprenant.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4. Prépare ...Fe7 et le petit roque. Si c3, on reprend dxc3 sans regret : le cavalier b1 recule en c3 mais on a gagné du temps pour roquer."
   },
   {
    "san": "c6",
    "pourquoi": "Prépare ...d5 pour frapper le centre et chasser le fou c4. Le pion d4 gagne un défenseur en c5 si besoin, et la dame peut sortir en b6 ou a5."
   },
   {
    "san": "c5",
    "pourquoi": "Soutient d4 et garde le pion avancé comme un coin dans le camp blanc. Mais la case d5 est affaiblie : le fou c4 et un cavalier en c3 pourront s'y installer."
   }
  ],
  "erreurs": [
   {
    "san": "Ne7",
    "pourquoi": "Bloque le fou f8 et laisse f7 sans défenseur de cavalier : Dh5 attaque f7 avec le fou c4, puis f4 lance l'assaut. Le cavalier doit aller en f6, pas en e7."
   },
   {
    "san": "g6",
    "pourquoi": "Perd un temps précieux : c3 prend aussitôt le pion d4, dxc3 ne vient plus car ...Fg7 est joué d'abord. Développez les cavaliers avant de préparer un fianchetto."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -54
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6",
  "nom": "Partie espagnole, variante Bird (3...Cd4)",
  "sens": "Développe le cavalier roi vers sa meilleure case et attaque le pion e4, déjà un peu seul depuis que le cavalier f3 a disparu. Prépare ...Fe7 et le petit roque.",
  "menace": "...Cxe4 : le pion e4 n'est défendu que par d3, et après dxe4 ou d3xe4 le pion d4 noir tient toujours. Pas une menace immédiate (d3 protège), mais e4 devient un point sensible à surveiller.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Le pion e4 est déjà couvert par d3, donc rien ne presse. Ensuite viennent f4 ou Cd2-f3 pour reprendre le pion d4 noir, qui est avancé et isolé."
   },
   {
    "san": "Nd2",
    "pourquoi": "Développe le cavalier et ajoute un défenseur à e4. Il ira en f3 pour viser le pion d4. On ne joue pas c3 tout de suite : après ...dxc3 Cxc3 le centre est plus ouvert mais on a perdu un temps."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou c8 : sans ce coup, ...Fg4 suivi de ...Dd7 et ...Fh3 peut devenir gênant une fois roqué. Coup prophylactique, calme, qui garde toutes les options."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O",
  "nom": "Défense Bird (variante Cd4)",
  "sens": "Met le roi à l'abri et connecte les tours. Rien ne presse : e4 est tenu par d3, et les Blancs préparent tranquillement f4 ou Cd2-f3 pour attaquer le pion d4, avancé et isolé.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou et prépare le petit roque. Les Noirs doivent d'abord mettre leur roi en sécurité avant de s'occuper du pion d4. Après O-O, Te8 viendra appuyer sur e4."
   },
   {
    "san": "c6",
    "pourquoi": "Prépare d5 pour ouvrir le centre et rattacher le pion d4 à ses frères : après d5 exd5 cxd5, d4 n'est plus isolé. Ferme aussi la diagonale a4-e8 au fou blanc."
   },
   {
    "san": "Be6",
    "pourquoi": "Propose l'échange du fou c4, la meilleure pièce blanche, qui vise f7. Après Fxe6 fxe6, la colonne f s'ouvre pour la tour noire."
   }
  ],
  "erreurs": [
   {
    "san": "d5",
    "pourquoi": "Ouvre le centre trop tôt, roi noir encore au milieu. Après exd5 les Noirs ont perdu un pion, et Dd1-f3 attaque d5 et b7 en même temps : le fou de c4 et la dame se regardent vers f7."
   },
   {
    "san": "Rb8",
    "pourquoi": "Coup inutile qui perd du temps : la tour ne fait rien sur b8. Les Blancs jouent c3 pour détruire le pion d4, et après dxc3 Db3 la dame attaque b7 et f7 à la fois."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -49
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Sort le fou de sa case de départ pour libérer la petite roque : le roi noir pourra se mettre à l'abri au prochain coup. Le fou en e7 ne fait rien de spécial, mais il ne gêne personne et couvre la case g5.",
  "plan": [
   {
    "san": "Nd2",
    "pourquoi": "Développe le cavalier vers f3 où il attaquera le pion d4, le point faible des Noirs. Depuis d2 il garde aussi e4. Les Blancs gardent une structure saine (pions e4-d3) et visent la colonne e après Te1."
   },
   {
    "san": "Re1",
    "pourquoi": "La tour vient derrière le pion e4 pour le défendre à l'avance : quand la tour noire arrivera en e8, e4 sera déjà bien gardé. Cela libère aussi f1 pour le fou ou le cavalier."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4 : s'il prend en c3, le pion b2 le reprend et les Blancs ont un centre solide avec d3 et e4. Attention : c3 enlève la case c3 au cavalier de b1, qui devra passer par d2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 57
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2",
  "nom": "Variante Bird (défense du cavalier d4)",
  "sens": "Reroute le cavalier vers f3 pour attaquer le pion d4, le point faible des Noirs, tout en gardant e4 ; prépare aussi Te1 pour occuper la colonne e ouverte.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Une fois roqué, la tour f8 pourra venir en e8 pour disputer la colonne e. Le pion d4 reste faible, mais il n'est pas encore attaqué."
   },
   {
    "san": "c6",
    "pourquoi": "Prépare d5 pour pousser au centre et chasser le fou c4, ou simplement b5 et d5 ensemble. Le pion c6 soutient aussi d5 et ferme la diagonale a4-e8 du fou."
   },
   {
    "san": "a6",
    "pourquoi": "Gagne de l'espace à l'aile dame et prépare b5 pour repousser le fou c4. Donne un peu de temps aux Blancs pour Cf3 et Te1, mais la position reste solide."
   }
  ],
  "erreurs": [
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier vise f2 et h2, mais il n'y a aucune suite : après Fb3 et h3, il doit rentrer. Les Noirs ont perdu deux temps et leur roi n'est toujours pas roqué. Attaquer sans développement ne mène à rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2 O-O",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "Met le roi à l'abri et relie la tour f8 au jeu. La tour pourra venir en e8 pour viser le pion e4 sur la colonne e. Le pion d4 reste faible, mais les Noirs ont fini leur développement de base.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Développe la dame en protégeant e4 une fois pour toutes. Elle libère la case d1 pour une tour et prépare f4 ou Cf3 selon les cas. Les Blancs gardent une position solide et le pion d4 isolé reste une cible pour plus tard."
   },
   {
    "san": "Nf3",
    "pourquoi": "Le cavalier revient sur sa meilleure case : il attaque directement le pion d4 et surveille e5 et g5. Il laisse temporairement e4 défendu par le seul pion d3, mais rien ne l'attaque encore."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup prudent : il enlève la case g4 au cavalier f6 et au fou c8, pour éviter toute gêne autour du roi. Il ne presse rien, mais prépare tranquillement f4 ou Cf3 sans mauvaise surprise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 46
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2 O-O Qe2",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "défend e4 avec la dame pour libérer le cavalier d2 : il pourra aller en f3 attaquer d4, ou laisser passer f4. La tour f1 pourra aussi venir en d1 ou e1.",
  "plan": [
   {
    "san": "c6",
    "pourquoi": "Soutient le pion d4 avec c5 ou prépare d5 pour l'échanger. Le fou c4 perd sa case d5 et le pion d4 cesse d'être une cible facile."
   },
   {
    "san": "d5",
    "pourquoi": "Pousse au centre tout de suite : le fou c4 doit bouger et la colonne e s'ouvre pour la tour. Attention, le pion d4 reste isolé et les Blancs pourront le viser avec Cf3."
   },
   {
    "san": "Re8",
    "pourquoi": "Met la tour sur la colonne e face à la dame blanche. Elle protège e7 et surveille e4 : si les Blancs jouent f4, le pion e4 deviendra faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2 O-O Qe2 c6",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Prépare la poussée d5 : le pion c6 enlève la case d5 au fou blanc et permettra d'échanger le pion e4 ou de soutenir d4 par c5.",
  "menace": "Pousser d5 pour attaquer le fou c4 et ouvrir le centre.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Petit coup utile avant que le centre s'ouvre : la case g4 est retirée au fou noir. Après d5, le fou reculera en b3 sans être gêné et la position reste solide."
   },
   {
    "san": "Bb3",
    "pourquoi": "Retire le fou d'avance : si les Noirs jouent d5, il n'est plus attaqué et garde sa diagonale vers f7. Les Blancs pourront ensuite jouer f4 pour avancer au centre."
   },
   {
    "san": "a4",
    "pourquoi": "Prend de l'espace à l'aile dame et empêche b5 qui chasserait le fou. Le fou c4 reste bien placé et les Noirs n'ont pas de cible immédiate."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Attaque le pion d4 mais trop tôt : d5 chasse le fou en b3, puis dxe4 gagne un pion, car le pion d3 ne peut pas tout tenir."
   },
   {
    "san": "f3",
    "pourquoi": "Défend e4 en affaiblissant le roi : après d5 et Te8, la colonne e s'ouvre, le fou c4 recule et la diagonale g1-a7 devient trop faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 47
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2 O-O Qe2 c6 h3",
  "nom": "Partie espagnole, variante Bird (3...Cd4)",
  "sens": "Prend la case g4 au fou noir avant que le centre s'ouvre : le cavalier d2 et la dame e2 ne seront plus gênés par une clouade, et le fou c4 pourra reculer en b3 tranquillement après d5.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Pousse au centre avec le soutien du pion c6 : le fou c4 doit reculer en b3, les Noirs gagnent de l'espace et libèrent le fou c8 (vers e6 ou d7). Après exd5 cxd5, le pion d4 et le pion d5 forment un bloc solide. Les Blancs garderont la poussée f4 ou e5 à long terme."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou c4 avec gain de temps : il recule en b3 et les Noirs prennent de l'espace à l'aile dame avant de jouer d5 ou c5. Cela crée aussi la case c5 pour le fou e7. Le pion b5 devra être défendu plus tard par a6."
   },
   {
    "san": "Re8",
    "pourquoi": "Place la tour sur la colonne e en face de la dame blanche : quand d5 ouvrira le centre, la tour pressera sur e4 et e2. Coup calme et utile qui ne décide rien tout de suite ; les Blancs peuvent jouer f4 pour prendre de l'espace."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -38
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4 d6 Nxd4 exd4 d3 Nf6 O-O Be7 Nd2 O-O Qe2 c6 h3 d5",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Attaque le fou c4 avec le soutien du pion c6 : le fou doit reculer ou le pion e4 doit prendre. Les Noirs gagnent de l'espace au centre et ouvrent la diagonale du fou c8 vers e6 ou d7.",
  "menace": "...dxc4 gagne le fou c4 : il est attaqué par le pion d5 et doit être sauvé tout de suite.",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "Met le fou à l'abri en gardant la diagonale vers f7 et d5. Après ...dxe4 dxe4, le centre s'ouvre et le pion d4 isolé devient une cible pour Cf3 ou Cc4. Les Noirs garderont de l'espace, mais les Blancs ont un jeu simple : Cf3, Fg5, Tad1 contre d4."
   },
   {
    "san": "exd5",
    "pourquoi": "Enlève la tension : après ...cxd5 le fou recule en b3 et le pion d5 n'est plus protégé par c6. Les Blancs visent ensuite Cf3 et c3 pour attaquer le bloc d4-d5. Inconvénient : la colonne c s'ouvre pour les tours noires."
   }
  ],
  "erreurs": [
   {
    "san": "e5",
    "pourquoi": "Oublie que le fou c4 est en prise. Après ...dxc4 exf6 Fxf6, les Noirs ont une pièce contre un pion et le fou f6 protège d4. Toujours sauver la pièce attaquée avant d'attaquer soi-même."
   },
   {
    "san": "Bxd5",
    "pourquoi": "Donne le fou pour un pion : ...cxd5 et le pion d5 est bien défendu par la dame. Après e5 Ce8, le cavalier recule tranquillement et les Noirs sont une pièce de plus sans rien avoir concédé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "Prépare ...d5 pour ouvrir le centre et ...b5 pour chasser le fou a4. Offre au cavalier d4 une retraite et ferme la diagonale a4-e8 : le fou ne vise plus le roi noir. Le prix : les Noirs n'ont toujours rien développé côté roi.",
  "menace": "...b5 pour gagner du temps sur le fou, puis ...d5 pour contester e4",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Élimine le cavalier gênant avant que ...b5 ne devienne fort. Après ...exd4, le pion noir en d4 est isolé et devra être défendu ; les Blancs joueront O-O puis d3 ou c3 pour l'attaquer."
   },
   {
    "san": "c3",
    "pourquoi": "Chasse le cavalier d4 tout de suite : il n'a que f3 (échangé) ou un retour en arrière. Donne aussi au fou a4 la case c2 en cas de ...b5. Laisse aux Noirs le temps de jouer ...d5."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord : le cavalier d4 n'est pas dangereux pour l'instant. Après ...b5, le fou recule en b3 et garde la bonne diagonale vers f7."
   }
  ],
  "erreurs": [
   {
    "san": "d3",
    "pourquoi": "Ouvre la diagonale a5-e1 : la dame vient en a5 et attaque le fou a4 en clouant indirectement. Après c3, le cavalier prend en f3 avec échec de dame à venir ; les Blancs perdent du temps et un pion."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développement naturel mais le cavalier bloque le pion c3 qui devait chasser le cavalier d4. Après ...a5, le fou a4 manque d'air : ...b5 arrive et le fou doit fuir sans bonne case."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 39
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "prend le cavalier d4 qui s'était avancé : il échange une pièce active contre une pièce active et laisse aux Noirs un pion isolé en d4 qu'il faudra défendre. Le cavalier blanc ne peut pas reculer en c3 sans perdre du temps, donc il prend.",
  "menace": "Le cavalier d4 menace de reculer en f3 ou e2 en restant une pièce de plus : si les Noirs ne reprennent pas, ils ont simplement perdu un cavalier.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Reprend la pièce, c'est obligatoire. Le pion d4 est isolé mais il gêne le cavalier blanc (plus de case c3) et contrôle c3 et e3. Ensuite, les Noirs développeront avec ...Cf6, ...d5 ou ...Fc5, et le fou a4 est un peu hors jeu. Les Blancs attaqueront d4 par O-O, d3, c3, mais les Noirs peuvent le soutenir avec ...c5 ou l'échanger."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "Chasse le fou avant de reprendre, mais le cavalier d4 prend en b5 : après ...cxb5 Fxb5, les Blancs ont gagné un pion et conservent une pièce de plus. Il faut toujours reprendre la pièce d'abord."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4",
  "nom": "Défense Bird (variante 4.Fa4 c6)",
  "sens": "Reprend le cavalier pris en d4 : le pion avancé prive le cavalier blanc de la case c3 et contrôle e3, au prix d'un pion isolé que les Blancs vont viser.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "Ouvre la diagonale du fou c1 et prépare c3 pour s'attaquer au pion d4. Le pion e4 est solidement défendu. Les Noirs répondront ...Cf6 et ...d5."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Ensuite d3 et c3 pour harceler d4, ou Te1 pour appuyer e4. Les Noirs auront le temps de jouer ...Cf6 et ...Fc5."
   },
   {
    "san": "c4",
    "pourquoi": "Bloque tout de suite ...d5, gagne de l'espace et prépare d3 : le pion d4 devient une cible fixe. Attention, le fou a4 reste un peu passif."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Coup de bord sans but : il n'aide ni le roi ni le centre. Les Noirs jouent ...Cf6 et ...d5, prennent l'initiative au centre et le pion h4 affaiblit la case du roque blanc."
   },
   {
    "san": "Qh5",
    "pourquoi": "Sortir la dame trop tôt ne mène à rien : ...Cf6 la chasse aussitôt, puis ...Fc5 développe avec gain de temps. Les Noirs rattrapent et dépassent le développement blanc."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 47
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Soutient le pion e4 avec un pion, libère le fou c1 et prépare c3 pour attaquer le pion avancé d4. Les Blancs veulent ouvrir le centre quand ils seront développés.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe le cavalier et attaque e4 : les Blancs doivent déjà réagir. Prépare ...d5 pour prendre le centre et ...Be7 puis le roque. Le pion d4 gêne le cavalier blanc, qui n'a plus la case c3."
   },
   {
    "san": "Bb4+",
    "pourquoi": "Donne échec et force les Blancs à bloquer avec c3 ou Bd2. Après c3, le pion d4 est attaqué mais le fou se replie sur e7 ou a5 et le plan blanc est un peu désorganisé. Attention : le fou peut devenir une cible sur b4."
   },
   {
    "san": "d5",
    "pourquoi": "Frappe le pion e4 tout de suite et ouvre la diagonale du fou c8. Après exd5 cxd5, les Noirs ont un centre solide avec les pions d4 et d5. Le fou a4 reste un peu passif sur la diagonale fermée."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Perd un temps : le fou a4 n'est pas attaqué, il regarde déjà c6 à travers le pion. Les Blancs roquent tranquillement, développent avec Nd2 et jouent c3 : les Noirs sont en retard de développement et le pion d4 tombe sous pression."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Développe en visant e4 et prépare ...d5 : si le centre s'ouvre, le pion d4 prive le cavalier blanc de c3 et le fou a4 reste exposé à ...Da5+.",
  "menace": "...d5 pour attaquer e4 une deuxième fois ; en cas d'échec ...Da5+, le fou a4 serait pris pour cible.",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "Prend d5 sous contrôle : ...d5 devient difficile, le centre blanc tient. Le pion d4 noir est figé et pourra être attaqué plus tard. Laisse aux Noirs le plan ...Fc5 et ...d6, plus lent."
   },
   {
    "san": "Bb3",
    "pourquoi": "Met le fou à l'abri de ...Da5+ et de ...b5, tout en visant f7. Les Blancs pourront ensuite roquer et pousser f4 ou c3 pour contester d4."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant que le centre s'ouvre. Après ...d5, les Blancs répondent e5 ou exd5 avec un roi déjà roqué, et gardent c3 ou f4 en réserve."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Perd du temps sur l'aile roi alors que les Noirs poussent ...d5 tout de suite ; après exd5, ...Fd6 et les Noirs ont le centre, le développement et une cible sur h4."
   },
   {
    "san": "Bd2",
    "pourquoi": "Développe un fou passif qui ne défend rien : après ...d5 et ...dxe4, le pion e4 tombe car le fou d2 bloque les cases de la dame et n'aide pas à reprendre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 50
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4",
  "nom": "Variante Bird",
  "sens": "Prend la case d5 sous contrôle pour empêcher ...d5 et figer le pion noir en d4 ; le fou a4 regarde toujours c6 et le centre blanc se solidifie.",
  "plan": [
   {
    "san": "dxc3",
    "pourquoi": "Prise en passant : le pion c2 vient de sauter la case c3, le pion d4 peut donc le prendre en passant. Cela casse le centre blanc avant qu'il ne se referme. Après bxc3 les pions blancs sont déformés et la colonne d s'ouvre ; après Cxc3 le pion d4 a disparu et ...d5 redevient possible. Les Noirs libèrent ainsi leur position au lieu de garder un pion isolé et cible en d4."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe simplement et prépare le petit roque. Les Noirs gardent le pion d4 comme un coin dans le centre blanc, qui gêne le cavalier b1. Mais ce pion devra être défendu plus tard et les Blancs auront le temps de jouer Cd2 puis f4 pour attaquer au centre."
   },
   {
    "san": "d6",
    "pourquoi": "Ouvre la diagonale du fou c8 vers g4 ou e6 et soutient un futur ...Cd7-c5. C'est un coup solide mais lent : les Blancs peuvent roquer et préparer f4 ou Fc2 pour s'attaquer au pion d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3",
  "sens": "prend en passant pour casser le centre blanc : le pion d4, isolé et cible, disparaît en échange d'un pion c2 qui venait de passer, et le pion noir se retrouve en c3, en pleine position blanche.",
  "menace": "...cxb2, qui gagne un pion et oblige Fxb2 : les Blancs doivent reprendre en c3 tout de suite.",
  "plan": [
   {
    "san": "Nxc3",
    "pourquoi": "Reprend le pion en développant le cavalier, qui surveille d5 et e4. La structure de pions reste saine et le roque peut suivre. Le fou a4 reviendra en c2 ou b3 plus tard."
   },
   {
    "san": "bxc3",
    "pourquoi": "Reprend aussi le pion et garde le cavalier libre pour d2. Mais la colonne b s'ouvre et les pions a2-c3-d3 sont déformés : les Noirs viseront c3 et le pion a2 isolé. Jouable, un peu moins propre que Cxc3."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer sans reprendre laisse ...cxb2 : après Fxb2 les Blancs ont un pion de moins et le fou dame est forcé en b2, loin du centre. Le pion c3 ne peut pas attendre."
   },
   {
    "san": "Bb3",
    "pourquoi": "Déplacer le fou ignore le pion c3. ...cxb2 Fxb2 et les Noirs ont un pion de plus, puis ...Fb4 cloue encore ce qui reste. Toujours régler le pion avancé avant les autres coups."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 43
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3",
  "nom": "Variante Bird",
  "sens": "reprend le pion avec le cavalier et le développe en même temps : il contrôle d5 et e4. Les Blancs gardent une structure saine et n'ont plus qu'à roquer.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Frappe au centre tout de suite. Si 9.e5, le cavalier va en d7 et attaque le pion e5 ; si 9.exd5 Cxd5 ou cxd5, les Noirs rouvrent la diagonale du fou c8 et contestent le centre. C'est le coup qui fait respirer la position noire."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe simplement et prépare le roque court. Le fou reste modeste mais solide : il ne s'expose pas au pion d3-d4 comme en c5 ou d6. Ensuite 0-0 puis d5."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou a4 avec gain de temps : il doit reculer en b3 ou c2. Les Noirs gagnent de l'espace à l'aile dame, mais le pion b5 pourra devenir une cible plus tard (a2-a4)."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou a l'air actif, mais 9.d4 le chasse aussitôt avec gain de temps, puis 10.e5 repousse le cavalier f6. Les Noirs perdent deux temps et les Blancs s'emparent du centre."
   },
   {
    "san": "g6",
    "pourquoi": "Après 9.e5 le cavalier f6 doit fuir en h5, où il est mal placé, et 10.Df3 l'attaque avec le pion f7. Développer le fou en g7 prend trop de temps alors que le centre n'est pas encore réglé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3 d5",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "Frappe le centre blanc pour ouvrir la position : le pion attaque e4, libère la diagonale du fou c8 et conteste le contrôle des cases centrales avant que les Blancs n'aient roqué.",
  "menace": "...d4 chassant le cavalier c3, ou ...dxe4 gagnant le pion e4 si les Blancs ne réagissent pas.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant de régler le centre. Si ...dxe4, les Blancs reprennent avec dxe4 et sortent la dame vers d8 avec échange favorable. Laisse aux Noirs la tension ...d4, mais le cavalier a alors e2 et les Blancs jouent Te1 avec un jeu facile."
   },
   {
    "san": "exd5",
    "pourquoi": "Supprime tout de suite le pion attaquant. Après ...Cxd5, Cxd5 Dxd5 puis O-O, les Blancs ont la paire de fous et une structure saine ; après ...cxd5, le pion d5 devient isolé et une cible pour Fb3 et le cavalier. Laisse aux Noirs un développement rapide par la colonne e."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3 d5 O-O",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "Met le roi à l'abri avant de régler le centre. La tour arrive sur f1, prête à aller sur e1 face à la colonne e. Les Blancs ne se pressent pas : si le pion d5 prend en e4, ils reprennent et proposent l'échange des dames ; s'il avance en d4, le cavalier recule en e2 sans dommage.",
  "menace": "e4xd5 ou e4-e5 : le pion d5 est attaqué et le cavalier f6 risque d'être chassé par e5, ce qui le renvoie en g8.",
  "plan": [
   {
    "san": "dxe4",
    "pourquoi": "Règle tout de suite la question du centre : on prend en e4 pour que le pion blanc ne puisse plus avancer en e5 et chasser le cavalier f6. Après dxe4 Dxd1 Txd1, les dames disparaissent et la position devient calme. Les Noirs ont deux fous contre fou et cavalier, mais leur roi est encore au centre : il faut vite jouer ...Fe7 et ...O-O."
   },
   {
    "san": "d4",
    "pourquoi": "Gagne de l'espace et chasse le cavalier c3 vers e2. Le pion d4 gêne les Blancs, mais il faudra le défendre (...Fc5, ...Dd6). Les Blancs répondent Te1, puis e5 pour chasser le cavalier f6 : les Noirs doivent surveiller cette poussée."
   }
  ],
  "erreurs": [
   {
    "san": "Bg4",
    "pourquoi": "Sort le fou avant d'avoir réglé le centre. Les Blancs jouent f3 : le fou doit reculer en e6, puis d4 prend l'espace et le pion d5 reste faible. Un coup de développement joué au mauvais moment."
   },
   {
    "san": "Be7",
    "pourquoi": "Trop lent : e5 chasse aussitôt le cavalier f6, qui doit rentrer en g8, puis d4 construit un gros centre blanc. Avant de développer le fou, il faut d'abord décider ce que fait le pion d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -32
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3 d5 O-O dxe4",
  "sens": "Prend au centre pour supprimer le pion e4 avant qu'il avance en e5 et chasse le cavalier f6. Le pion noir arrive en e4 et attaque d3 : il force les Blancs à réagir tout de suite.",
  "menace": "...exd3 gagne un pion : si les Blancs ne reprennent pas en e4, le pion d3 tombe, puis ...Dxd1 ou ...Fg4 pour échanger les dames et développer tranquillement.",
  "plan": [
   {
    "san": "dxe4",
    "pourquoi": "Reprend simplement le pion. Les Noirs vont échanger les dames par ...Dxd1 Txd1 puis ...Cxe4 Cxe4 : le matériel est égal, la position est calme, mais le roi noir est encore en e8 et la tour d1 contrôle la colonne ouverte."
   },
   {
    "san": "Re1",
    "pourquoi": "Développe la tour en attaquant le pion e4 au lieu de le prendre tout de suite. Si ...exd3 Dxd3, les dames restent sur l'échiquier et les Blancs ont une tour active sur la colonne e face au roi noir."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame. Si ...exd3, Fxf6 gxf6 Dxd3 abîme la structure noire : le roi noir aura du mal à se mettre à l'abri."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Développe une pièce mais oublie le pion : ...exd3 et le pion d3 est perdu. Après Te1 Fe6, les Noirs gardent le pion de plus et développent sans souci."
   },
   {
    "san": "Qd2",
    "pourquoi": "La dame quitte d1 et ne protège plus d3 : ...exd3 gagne un pion net. Elle se retrouve en plus mal placée, à portée des pièces noires qui arrivent."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3 d5 O-O dxe4 dxe4",
  "nom": "Défense Bird de la Partie espagnole",
  "sens": "Reprend le pion et rouvre la colonne d pour la dame : la dame d1 regarde d8 et le pion e4 est désormais protégé par le cavalier c3.",
  "menace": "Dxd8+ suivi de Td1 : après l'échange forcé des dames, la tour blanche s'installe sur la colonne d ouverte alors que le roi noir, resté en e8, gêne ses propres tours. Le pion e4 peut aussi avancer en e5 pour chasser le cavalier f6.",
  "plan": [
   {
    "san": "Qxd1",
    "pourquoi": "Échange les dames avant que les Blancs ne le fassent avec gain de temps. Après Txd1 Cxe4 Cxe4 le matériel reste égal et la position est calme. Il faudra ensuite développer vite (Fe7, O-O ou Fe6) car la tour d1 contrôle déjà la colonne ouverte."
   },
   {
    "san": "Be6",
    "pourquoi": "Développe une pièce en protégeant la case d5 et en préparant le petit roque. Le fou surveille aussi la diagonale a2-g8 et peut aller en c4 si les Blancs jouent Fb3. Laisse les Blancs échanger les dames eux-mêmes, mais le roi noir sortira vite du centre."
   },
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vise f2 et prépare le roque. Attention au pion e4 : s'il avance en e5, le cavalier f6 devra reculer, il faut donc roquer sans tarder."
   }
  ],
  "erreurs": [
   {
    "san": "Bb4",
    "pourquoi": "Cloue le cavalier mais oublie la colonne d : Dxd8+ Rxd8 Td1+ et le roi noir, privé du roque, est traqué au centre pendant que les Blancs développent avec des échecs."
   },
   {
    "san": "Nd7",
    "pourquoi": "Retire le cavalier de la case f6 sans raison : après De2 le pion e4 est solidement protégé, les Noirs n'ont plus de pièce active et le roque est retardé. Le cavalier en d7 bloque en plus le fou c8."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -24
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 c6 Nxd4 exd4 d3 Nf6 c4 dxc3 Nxc3 d5 O-O dxe4 dxe4 Qxd1",
  "sens": "Prend la dame en d1 pour forcer l'échange avant que les Blancs ne le fassent eux-mêmes avec gain de temps : la dame noire est capturée, et le pion e4 reste attaqué par le cavalier f6.",
  "menace": "Le pion e4 est attaqué par le cavalier f6. Si les Blancs reprennent sans y penser, Cxe4 gagne un pion ou simplifie encore la position.",
  "plan": [
   {
    "san": "Rxd1",
    "pourquoi": "Reprend la dame en mettant la tour sur la colonne d, la seule colonne ouverte. La tour regarde déjà d7 et d8, ce qui gêne le développement noir. Les Noirs peuvent prendre e4 par Cxe4, puis Cxe4 reprend : le matériel reste égal et les Blancs gardent un petit avantage d'activité."
   },
   {
    "san": "Bxd1",
    "pourquoi": "Reprend avec le fou, qui revient d'a4 où il ne faisait plus rien. L'idée est de garder la tour en f1 pour une case plus souple plus tard. C'est correct, mais la tour en d1 était plus active : les Noirs ont le temps de jouer Fe7 ou Fe6 tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd1",
    "pourquoi": "Reprendre avec le cavalier est la pire des trois prises : le cavalier quitte c3, abandonne la défense de e4 et bloque la tour. Après Fe6 puis f3 et Cd7, les Noirs ont le temps de tout développer et la tour blanche ne contrôle plus la colonne d."
   },
   {
    "san": "Bxc6+",
    "pourquoi": "Donner un échec avant de reprendre la dame semble malin, mais après bxc6 la dame noire est toujours en d1 et les Blancs ont perdu un fou pour rien. Txd1 ensuite ne rattrape pas la pièce : il faut toujours reprendre la dame d'abord."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 29
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7",
  "nom": "Partie espagnole, défense berlinoise, variante 4...Fe7",
  "sens": "Développe le fou sur une case tranquille et prépare le roque. Le fou protège aussi le cavalier f6 et le pion e5 reste tenu par le cavalier c6. Les Noirs renoncent pour l'instant à chasser le fou b5 par ...a6.",
  "menace": "Rien d'immédiat, mais ...Cxe4 devient possible dès que les Blancs perdent un temps : le pion e4 n'est défendu par personne.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Défend e4 en activant la tour. C'est le coup le plus naturel : il règle le seul problème des Blancs, le pion e4 en prise. Ensuite c3 et d4 pour construire le centre, comme dans l'Espagnole fermée."
   },
   {
    "san": "Nc3",
    "pourquoi": "Défend e4 en développant une pièce. Le cavalier vise d5. Les Blancs renoncent au plan c3-d4 mais gagnent du temps pour le développement."
   },
   {
    "san": "d4",
    "pourquoi": "Ouvre le centre tout de suite. Si ...exd4 Blancs reprennent avec e5 ou Cxd4 et dominent l'espace. Demande un peu plus de précision que Te1."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Prépare d4 mais oublie que e4 est en prise. Après ...Cxe4 les Noirs ont pris un pion gratuit, et si Te1 le cavalier recule tranquillement en d6 en attaquant le fou b5. Il faut défendre e4 avant de jouer c3."
   },
   {
    "san": "h3",
    "pourquoi": "Coup prophylactique inutile ici : aucune pièce noire ne vise g4. Le temps perdu coûte le pion e4 : ...Cxe4 puis ...Cd6 si Te1, et les Noirs ont un pion de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1",
  "nom": "Berlin, variante 4...Fe7 (fermée)",
  "sens": "Défend e4 avec la tour et pose un problème concret : avec e4 solide, le fou b5 peut prendre en c6 et le cavalier f3 ramasser le pion e5 sans crainte de ...Cxe4.",
  "menace": "Fxc6 suivi de Cxe5 : le pion e5 n'est défendu que par le cavalier c6, les Blancs l'échangent puis gagnent le pion.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Protège e5 une fois pour toutes avec un pion : la menace Fxc6 puis Cxe5 ne gagne plus rien. Le fou c8 reste un peu enfermé, mais les Noirs pourront roquer tranquillement et jouer ...Fd7 ou ...O-O, puis ...a6. C'est la Berlin fermée, solide et facile à jouer."
   },
   {
    "san": "Nd4",
    "pourquoi": "Contre-attaque : le cavalier saute au centre, s'en prend au fou b5 et quitte c6 avant d'être échangé. Après Cxd4 exd4, le pion e5 a disparu et il n'y a plus rien à gagner. Ça règle le problème autrement, mais le pion d4 isolé demande un peu de soin ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer sans regarder la menace coûte un pion : Fxc6 bxc6 Cxe5. Le cavalier qui défendait e5 est échangé et le pion tombe. Toujours vérifier ce que l'adversaire menace avant de roquer."
   },
   {
    "san": "a6",
    "pourquoi": "Le réflexe espagnol ne marche pas ici : Fxc6 dxc6 Cxe5, un pion de moins. Chasser le fou ne sert à rien s'il peut prendre en c6 avec profit. Il faut d'abord défendre e5 avec ...d6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -49
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6",
  "nom": "Partie espagnole, défense berlinoise fermée (variante 4.O-O Fe7 5.Te1 d6)",
  "sens": "Soutient e5 avec un pion : la combinaison Fxc6 suivie de Cxe5 ne rapporte plus rien. Le centre noir est stable, le roque et ...a6 viennent ensuite, au prix d'un fou c8 un peu enfermé.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Occupe le centre tout de suite. Si les Noirs prennent avec ...exd4, Cxd4 et les Blancs ont un cavalier central actif ; s'ils maintiennent avec ...Fd7, les Blancs gardent plus d'espace. Attention : après ...exd4 Cxd4 Fd7, pas de gain de pion, mais une position libre et agréable."
   },
   {
    "san": "c3",
    "pourquoi": "Prépare d4 en gardant un pion pour reprendre : après ...exd4 cxd4, les Blancs ont deux pions au centre. Offre aussi une case de repli au fou sur c2 après ...a6 Fa4 b5 Fc2."
   },
   {
    "san": "h3",
    "pourquoi": "Coup prudent qui enlève la case g4 au fou c8 : les Noirs ne pourront pas clouer le cavalier f3 après d4. Lent, mais utile avant de pousser d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 50
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4",
  "nom": "Défense berlinoise, variante avec 4...Fe7 (ou « Berlin fermé »)",
  "sens": "Ouvre le centre : attaque e5 avec le pion d, et menace d4xe5 pour chasser le cavalier f6 puis gagner d6 ou le pion e5.",
  "menace": "d4xe5 : si ...dxe5, Dxd8+ et les Noirs perdent le roque ; si le cavalier bouge, exd6 ramasse un pion. Et Fb5xc6 suivi de dxe5 gagne aussi e5.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Protège le cavalier c6 : Fxc6 n'arrache plus un pion. Le pion e5 reste solide, les Noirs pourront roquer coup suivant. Les Blancs gardent plus d'espace, mais rien n'est perdu."
   },
   {
    "san": "exd4",
    "pourquoi": "Supprime la menace sur e5 en prenant. Après Cxd4 le cavalier blanc est actif au centre, les Noirs jouent ...Fd7 et roquent : position libre, aucun pion perdu."
   },
   {
    "san": "Nd7",
    "pourquoi": "Défend e5 une deuxième fois et évite tout problème sur f6. Un peu passif : le fou c8 est bloqué, mais la position tient."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer semble naturel, mais Fxc6 bxc6 puis dxe5 gagne un pion : le cavalier f6 doit fuir et e5 tombe. Il fallait d'abord défendre c6 ou prendre en d4."
   },
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3, mais dxe5 ouvre tout : après ...Fxf3 Dxf3, les Blancs gagnent un pion et le centre s'écroule pour les Noirs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -50
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7",
  "nom": "Partie espagnole, défense berlinoise, variante 4.O-O Fe7 (avec d6)",
  "sens": "Relie les pièces et couvre le cavalier c6 : si le fou prend en c6, le fou d7 reprend et la structure reste intacte. Prépare le roque, le roi noir sera à l'abri au prochain coup.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Échange le fou contre le cavalier avant qu'il ne soit chassé par a6. Après Fxc6, le pion e5 n'est plus défendu que par d6 : les Blancs vont prendre en e5, dxe5, puis gagner du temps avec Cc3 ou Fg5 en visant le roi qui n'a pas encore roqué. Les Noirs gardent les deux fous, c'est leur compensation."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient le centre d4 et ouvre la case c2 au fou. Les Blancs gardent leur fou de cases blanches et un centre solide ; les Noirs roquent et jouent plus tard exd4 ou Te8, la partie reste calme et équilibrée."
   },
   {
    "san": "d5",
    "pourquoi": "Ferme le centre et gagne de l'espace : le cavalier c6 doit reculer en b8 ou aller en a5, loin du jeu. Les Blancs joueront ensuite c4 et Cc3 pour pousser sur l'aile dame. En contrepartie la tension disparaît et les Noirs peuvent préparer f5 sans danger immédiat."
   }
  ],
  "erreurs": [
   {
    "san": "Qd3",
    "pourquoi": "Met la dame sur une case exposée sans rien défendre de plus. Les Noirs répondent Cxd4 : le cavalier prend un pion avec attaque sur la dame et sur le fou b5. Après Fxd7 Cxd7 (ou Dxd4 Fxb5), les Noirs ont simplement gagné le pion d4 et tout l'avantage d'espace des Blancs s'est évaporé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 58
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6",
  "sens": "Échange le fou contre le cavalier avant d'être chassé par a6 : le cavalier c6 défendait e5, qui ne tient plus que par d6. Les Blancs veulent ensuite prendre en e5 et gagner du temps contre le roi noir pas encore roqué.",
  "menace": "Fxd7+ puis dxe5 : si les Noirs ne reprennent pas tout de suite en c6, les Blancs échangent en d7 avec échec et gagnent le pion e5.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Reprend avec le fou pour garder la structure de pions intacte. Après dxe5 dxe5 Dxd8+ Txd8 Cxe5, les Noirs perdent un pion mais le fou c6 attaque e4 et les deux fous donnent de l'activité : c'est le moindre mal."
   }
  ],
  "erreurs": [
   {
    "san": "bxc6",
    "pourquoi": "Reprendre avec le pion casse la chaîne de pions et affaiblit e5. Après dxe5 Cg4 Ff4, les Noirs ont des pions doublés en c6, un pion e5 perdu et aucun contre-jeu."
   },
   {
    "san": "O-O",
    "pourquoi": "Roquer ignore la menace : dxe5 dxe5 Fxd7 et les Blancs gagnent une pièce entière. Il faut d'abord reprendre en c6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6",
  "sens": "Reprend avec le fou pour garder la structure de pions intacte et placer le fou sur la grande diagonale, où il vise déjà e4.",
  "menace": "Prendre e4 avec le fou (Fxe4), puisque le pion n'est défendu que par la tour.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Défend e4 en développant une pièce. Le cavalier regarde aussi d5. Les Noirs vont roquer, puis les Blancs pourront jouer d5 pour chasser le fou c6 ou dxe5 au bon moment."
   },
   {
    "san": "Qd3",
    "pourquoi": "Défend e4 avec la dame et relie les tours en libérant le fou c1. La dame vise aussi la colonne d, prête à d5 ou dxe5. En échange, elle peut devenir une cible pour un cavalier noir plus tard."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Défend e4 et laisse c3 libre pour un pion : le centre d4-e4 devient très solide. Le cavalier peut ensuite aller en f1 puis g3. C'est plus lent que Cc3, mais sans faiblesse."
   }
  ],
  "erreurs": [
   {
    "san": "a4",
    "pourquoi": "Coup inutile sur l'aile : e4 reste en prise. Après Fxe4, les Blancs ont perdu un pion au centre pour rien, et le fou noir revient tranquillement en f5 ou g6."
   },
   {
    "san": "dxe5",
    "pourquoi": "Échange le centre trop tôt. Après dxe5, les dames restent en jeu et le fou noir arrive en c5 avec tempo, visant f2. Le centre blanc a disparu et les deux fous noirs deviennent très actifs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 50
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3",
  "nom": "Défense berlinoise, variante fermée (structure de type Steinitz)",
  "sens": "défend e4 en développant une pièce : le cavalier surveille aussi d5, d'où il pourrait chasser le fou c6 ou s'installer plus tard.",
  "menace": "dxe5 : si les Noirs reprennent dxe5, l'échange des dames Dxd8+ suivi de Cxe5 gagne le pion e5, car le roi noir n'a pas encore roqué et le fou c6 est attaqué.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Règle tout de suite le problème du pion e5 : il disparaît avant d'être gagné. Après Cxd4, les Noirs roqueront tranquillement et joueront Te8, Ff8, avec une position solide. Les Blancs gardent un peu plus d'espace, mais sans cible."
   },
   {
    "san": "h6",
    "pourquoi": "Coup d'attente utile : il enlève la case g5 au cavalier et au fou blancs. Les Noirs répondront à dxe5 par dxe5 et après l'échange des dames, le roi noir ira en e7 ou ira en d8 pour tenir e5. Laisse aux Blancs le choix de jouer d5 ou de garder la tension."
   },
   {
    "san": "Qd7",
    "pourquoi": "Protège le fou c6 et prépare le grand roque ou O-O selon les circonstances. Après dxe5 dxe5, la dame d7 n'est plus prise avec échec et e5 reste défendu. Inconvénient : la dame n'est pas très active et les Blancs gardent l'initiative avec d5 ou Cd5."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le coup le plus naturel, mais il perd un pion : 9.dxe5 dxe5 10.Dxd8 Txd8 11.Cxe5. Le pion e5 tombe car après l'échange des dames plus rien ne le défend, et le fou c6 est en prise en plus. Il faut d'abord régler le centre (exd4), puis roquer."
   },
   {
    "san": "Bd7",
    "pourquoi": "Retirer le fou perd du temps et ne défend pas e5 : 9.dxe5 dxe5 10.Cxe5 gagne simplement un pion, le cavalier blanc attaque ensuite le fou d7. Le fou était bien en c6 : c'est le centre qui demandait une décision, pas le fou."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -54
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3 exd4",
  "sens": "liquide le pion e5 avant qu'il ne tombe : le pion noir atterrit sur d4 et attaque le cavalier c3, ce qui force les Blancs à répondre tout de suite.",
  "menace": "...dxc3 gagne le cavalier.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le pion et sauve le cavalier c3 en même temps. Le cavalier d4 est centralisé et surveille le fou c6 (Cxc6 est possible plus tard). Les Blancs ont plus d'espace et une tour déjà active sur e1 ; les Noirs roquent et jouent Te8, Ff8 pour tenir."
   },
   {
    "san": "Nd5",
    "pourquoi": "Le cavalier attaqué saute au centre au lieu de reculer. Si ...Cxd5 exd5, le pion d5 chasse le fou c6 et les Blancs reprennent d4 ensuite. Mais cela demande du calcul : Cxd4 est plus simple."
   },
   {
    "san": "Qxd4",
    "pourquoi": "Reprend aussi le pion et met la dame au centre, mais le pion e4 reste fragile : après ...Fxe4 les Noirs forcent des échanges. Jouable, mais la dame est exposée trop tôt."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Défend le cavalier au lieu de reprendre : ...dxc3 Fxc3 et les Noirs ont simplement un pion de plus. Toujours reprendre d'abord, protéger ensuite."
   },
   {
    "san": "Ne2",
    "pourquoi": "Recule le cavalier mais oublie e4 : ...Fxe4 gagne un pion net, et après Cg3 d5 les Noirs dominent le centre. Le pion d4 noir reste, le pion e4 blanc a disparu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 51
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3 exd4 Nxd4",
  "nom": "Défense berlinoise avec 4...Fe7 (structure de type Steinitz, Blancs à Cd4)",
  "sens": "Reprend le pion d4 avec le cavalier plutôt qu'avec la dame : il reste au centre, protégé par la dame d1, et vise à la fois c6 et f5. Le cavalier c3 n'est plus attaqué par le pion, et les Blancs gardent un centre solide avec e4 défendu par la tour e1.",
  "menace": "Cxc6 bxc6 pour abîmer les pions noirs (pions doublés c6-c7), puis e5 ou Df3 pour attaquer le pion c6 affaibli. Le saut Cf5 vers e7 et g7 est aussi dans l'air.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout : c'est le coup le plus utile et il prépare Te8 puis Ff8 pour tenir la case e4 sous pression et consolider. Si les Blancs prennent Cxc6 bxc6, les Noirs acceptent les pions doublés mais gardent la paire de fous et la colonne b ouverte pour la tour."
   },
   {
    "san": "Bd7",
    "pourquoi": "Recule le fou pour éviter l'échange Cxc6 et garder une structure de pions propre. Le fou défend aussi f5 contre le saut du cavalier. L'inconvénient : les Noirs perdent un temps et les Blancs développent tranquillement avec Fg5 ou Ff4."
   },
   {
    "san": "Nd7",
    "pourquoi": "Dégage la diagonale pour un futur Ff6 et prépare Ce5 ou Cc5, deux belles cases centrales. Le roque n'est pas retardé puisque la case f6 est libre. Attention : le pion g7 n'est plus défendu par le cavalier, il faut donc roquer vite."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Coup d'attente inutile : le fou b5 a déjà disparu, il n'y a rien à chasser. Les Blancs jouent Cf5 (le cavalier attaque e7 et g7), puis Cd5 : les deux cavaliers blancs s'installent dans le camp noir et le fou e7 est harcelé. Un temps perdu, et les pièces blanches débordent."
   },
   {
    "san": "h6",
    "pourquoi": "Empêche Fg5, mais ce n'est pas la menace. Comme après a6, Cf5 puis Cd5 donnent aux Blancs des cavaliers très actifs contre e7 et g7, et le pion h6 crée une case g6 affaiblie. Priorité au roque, pas aux petits coups de pions."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -47
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3 exd4 Nxd4 O-O",
  "nom": "Partie espagnole, défense Steinitz différée (variante avec 6...Fd7 7.Fxc6)",
  "sens": "Met le roi à l'abri et connecte les tours : rien n'est encore attaqué, donc les Noirs finissent leur développement avant de choisir un plan. La tour viendra en e8 pour viser e4 et le fou pourra reculer en f8.",
  "plan": [
   {
    "san": "Nxc6",
    "pourquoi": "Échange le cavalier central contre le fou de c6 avant qu'il ne pointe sur e4. Après ...bxc6 les Noirs ont des pions doublés sur la colonne c et un centre moins souple ; les Blancs gardent un bon cavalier contre le fou e7 et pourront viser le pion c6 avec Df3 ou e5. En échange, les Noirs ouvrent la colonne b pour leur tour."
   },
   {
    "san": "Nf5",
    "pourquoi": "Place le cavalier sur une case avancée et attaque le fou e7. Si les Noirs le prennent par ...Fxf5 exf5, les Blancs gagnent de l'espace et ouvrent la colonne e pour la tour ; s'ils reculent par ...Fd7 ou jouent ...Te8, les Blancs enchaînent Fg5 pour clouer le cavalier f6 et peser sur le roi noir."
   },
   {
    "san": "h3",
    "pourquoi": "Coup d'attente utile : enlève la case g4 au cavalier et au fou noirs, puis les Blancs développent tranquillement Ff4 ou Fe3 sans craindre ...Cg4. Simple et sans risque, mais laisse aux Noirs le temps de jouer ...Te8 et ...Ff8 comme prévu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 55
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3 exd4 Nxd4 O-O Nxc6",
  "sens": "Échange le cavalier central contre le fou de c6 avant qu'il ne tire sur e4. Il force la reprise ...bxc6, qui laisse aux Noirs des pions doublés sur la colonne c et un centre moins souple ; les Blancs garderont un cavalier contre le fou passif de e7.",
  "menace": "Le cavalier c6 est en prise mais attaque aussi la dame d8 : s'il n'est pas repris, Cxd8 gagne la dame.",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "Le seul coup : il faut reprendre le cavalier qui attaque la dame. Oui, les pions c6 et c7 sont doublés, mais la colonne b s'ouvre pour la tour (...Tb8 puis ...Tb4 ou ...Tb2 visent le camp blanc). Ensuite les Noirs jouent ...Cd7, ...Te8 et ...Ff6 pour activer le fou. Les Blancs ont une petite plus-value, pas plus."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Un débutant croit rendre coup pour coup en prenant le pion e4. Mais le cavalier blanc attaque la dame : Cxd8 la gagne tout simplement. Après ...Cxc3 bxc3, les Noirs n'ont qu'un cavalier et un pion pour la dame : perdu."
   },
   {
    "san": "Re8",
    "pourquoi": "Développer la tour semble naturel, mais on oublie que la dame d8 est attaquée. Cxd8 Taxd8 : les Blancs ont pris la dame contre un cavalier. Avant de jouer, toujours vérifier ce que la dernière pièce adverse attaque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -53
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7 Re1 d6 d4 Bd7 Bxc6 Bxc6 Nc3 exd4 Nxd4 O-O Nxc6 bxc6",
  "nom": "Défense Steinitz différée (ligne 5.Te1 d6 6.d4)",
  "sens": "Reprend le cavalier pour sauver la dame, en acceptant des pions doublés sur la colonne c. En échange, la colonne b s'ouvre pour la tour, qui pourra venir en b8 puis b4 ou b2 pour gêner les Blancs.",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "Prend de l'espace au centre et prépare e5 pour chasser le cavalier f6. Avec le roi roqué et la tour en e1, la poussée du pion f est sans risque. Les Noirs devront répondre vite par ...d5 ou ...Te8 avant que e5 n'arrive."
   },
   {
    "san": "b3",
    "pourquoi": "Prépare Fb2, le fou visera la grande diagonale vers f6 et g7. Le pion b3 ferme aussi la colonne b : la tour noire en b8 ne trouve plus de cible. Coup calme, les Noirs ont le temps de jouer ...Cd7 et ...Ff6."
   },
   {
    "san": "Qd3",
    "pourquoi": "Sort la dame avec gain de temps : elle regarde c4 et d6, et libère la case d1 pour une tour. Les Blancs préparent Tad1 pour appuyer sur le pion d6, le point faible des Noirs. Attention à ...Cg4 qui vise h2 et f2 : il faut répondre h3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 55
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5",
  "nom": "Défense berlinoise, variante Beverwijk (4...Fc5)",
  "sens": "sort le fou sur sa meilleure diagonale : il vise f2, le point faible devant le roi roqué, et garde un œil sur d4 pour empêcher les Blancs d'y pousser librement.",
  "menace": "prendre le pion e4 avec le cavalier, qui n'est plus protégé",
  "plan": [
   {
    "san": "Nxe5",
    "pourquoi": "Prend le pion e5 avant que les Noirs ne prennent e4. Si 5...Cxe5, 6.d4 attaque en même temps le fou c5 et le cavalier e5 : les Blancs récupèrent la pièce. Si 5...Cxe4, 6.De2 attaque le cavalier et le pion e5 est aussi menacé : là encore tout revient à l'équilibre, mais le centre blanc est solide."
   },
   {
    "san": "c3",
    "pourquoi": "Prépare d4 : le pion c3 soutiendra d4 et le fou c5 devra reculer. Laisse les Noirs prendre e4 (5...Cxe4), mais 6.d4 récupère le pion grâce à la fourchette sur le fou et au centre. C'est le plan classique de l'Espagnole : construire le centre."
   },
   {
    "san": "Nc3",
    "pourquoi": "Défend simplement e4 en développant une pièce. Pas de complications : les Blancs continuent à sortir leurs pièces et pourront jouer d3 et Fg5 ensuite. Laisse aux Noirs le temps de roquer tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Ba4",
    "pourquoi": "Recul automatique du fou, mais il ignore la menace sur e4. Après 5...Cxe4 les Noirs ont gagné un pion gratuitement, et 6.d3 ne récupère rien : le cavalier rentre en f6. Un coup de développement ne sert à rien si on oublie de défendre."
   },
   {
    "san": "Qe2",
    "pourquoi": "Défend e4 avec la dame, mais sort la pièce la plus précieuse trop tôt. Après 5...O-O les Noirs sont en sécurité, et la prise 6.Fxc6 dxc6 n'apporte rien : les Noirs ouvrent la colonne d et leurs fous sont actifs. La dame gêne aussi le fou f1 qui n'a plus de case."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 50
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5",
  "sens": "prend le pion e5 avant que les Noirs ne prennent e4 : le cavalier blanc gagne un pion et compte sur 6.d4 ou 6.De2 pour le garder ou le rendre à bon compte.",
  "menace": "Le cavalier e5 menace le pion f7 avec le fou b5 derrière (Cxf7 puis Fxc6). Le pion e5 noir est déjà parti : les Noirs ont un pion de moins et doivent le récupérer tout de suite.",
  "plan": [
   {
    "san": "Nxe4",
    "pourquoi": "Reprend aussitôt un pion : un pour un. Si 6.De2 attaque le cavalier, 6...Cxe5 7.Dxe4 d6 et le fou c5 est encore là. Le centre blanc n'est pas si solide : les Noirs ont le pion d7 pour chasser les pièces blanches avec d6 ou d5."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Reprend la pièce. Les Blancs rejouent 6.d4 et attaquent fou et cavalier en même temps, mais 6...a6 ou 6...Fxd4 permet de ne pas perdre de pièce. Plus compliqué que Cxe4 : le débutant doit calculer la fourchette d4 avant de la laisser arriver."
   }
  ],
  "erreurs": [
   {
    "san": "Nd4",
    "pourquoi": "Déplace le cavalier au lieu de reprendre un pion. Les Blancs jouent 6.Fa4 et gardent leur pion en plus. Les Noirs restent avec un pion de moins pour rien."
   },
   {
    "san": "O-O",
    "pourquoi": "Roquer est un bon réflexe, mais ici c'est trop lent. 6.Fxc6 dxc6 7.d3 : les Blancs gardent le pion de plus, la paire de cavaliers, et un centre tranquille. Il fallait d'abord reprendre e4 ou e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -54
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4",
  "sens": "Récupère le pion aussitôt : un pour un. Le cavalier s'installe au centre et attaque le cavalier blanc, qui n'est plus protégé.",
  "menace": "...Cxe5 gagne un cavalier : la pièce en e5 est attaquée par le cavalier c6 et rien ne la défend.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Rentre le cavalier à l'abri. Les Blancs peuvent ensuite jouer Te1 pour clouer le cavalier e4 sur le roi noir, ou d4 pour ouvrir le centre. Simple et sûr."
   },
   {
    "san": "Qe2",
    "pourquoi": "Attaque le cavalier e4 tout en défendant e5 d'une seule case. Si 6...Cxe5 7.Dxe4 d6, matériel égal, les Blancs ont la dame au centre et le roi déjà au roque."
   },
   {
    "san": "Qg4",
    "pourquoi": "Attaque deux choses à la fois : le cavalier e4 et le pion g7. Les Noirs doivent parer les deux, mais la dame sort tôt et peut devenir une cible."
   }
  ],
  "erreurs": [
   {
    "san": "Nxf7",
    "pourquoi": "Tentation classique de prendre f7. Après 6...Rxf7 7.Dh5+ g6, la dame doit reculer : les Blancs ont donné un cavalier pour un pion sans rien obtenir."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développer est naturel, mais 6...Cxc3 7.bxc3 Cxe5 : le cavalier e5 n'était pas défendu et les Noirs gagnent un pion net."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 59
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3",
  "nom": "Défense berlinoise, variante 4...Fc5 (espagnole)",
  "sens": "Ramène le cavalier au centre, hors de portée des pions noirs, et libère la colonne e pour la tour. Les Blancs veulent ensuite jouer Te1 contre le cavalier e4 cloué sur le roi, ou d4 pour chasser le fou c5 et ouvrir le centre.",
  "menace": "Te1 : le cavalier e4 est cloué sur le roi e8 et doit reculer ; et d4 suivi de d5 pour frapper le fou c5 puis le cavalier c6.",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5. S'il prend en c6, le pion d7 reprend et la colonne e est couverte par la dame : le clouage Te1 ne fait plus peur. S'il recule en a4, b5 gagne encore du temps."
   },
   {
    "san": "d5",
    "pourquoi": "Soutient le cavalier e4 avec le pion et ouvre la diagonale du fou c8. Après Te1, le cavalier tient grâce au pion ; après d4 le fou recule en e7 ou d6 tranquillement."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite : le cavalier e4 n'est plus cloué sur le roi. Il faudra encore répondre à d4 avec le fou, mais le roi ne traîne plus au centre."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Trop timide : les Blancs jouent d4, le fou c5 doit reculer en e7, puis d5 chasse le cavalier c6. Les Noirs reculent partout et les Blancs prennent tout le centre gratuitement."
   },
   {
    "san": "Qf6",
    "pourquoi": "La dame sort trop tôt. Après d3, le cavalier e4 est attaqué et n'a pas de bonne case : s'il prend en f2, Txf2 le récupère et les Noirs ont perdu une pièce pour un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -48
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6",
  "nom": "Partie espagnole, défense berlinoise avec 4...Fc5 (piège de Berlin, variante du cavalier en e4)",
  "sens": "Force le fou b5 à se décider : prendre en c6 ou reculer. Si le fou prend, le pion d7 reprend et la dame couvre la colonne e, donc le clouage Te1 contre le cavalier e4 ne fait plus peur. Si le fou recule en a4, b5 gagnera encore un temps.",
  "menace": "Pas de menace directe, mais le fou doit bouger ou être échangé, et si les Blancs l'ignorent, ...axb5 gagne une pièce.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Le coup le plus solide. Après ...dxc6, les Blancs jouent d4 ou Te1 et chassent le cavalier e4 tranquillement. Les Noirs ont la paire de fous mais des pions doublés en c6 : le centre blanc est plus sain."
   },
   {
    "san": "Ba4",
    "pourquoi": "Garde le fou. Les Noirs gagnent un temps avec ...b5, mais le fou revient en b3 vers f7, et d4 ou Te1 arrivent ensuite. Le cavalier e4 reste à chasser."
   }
  ],
  "erreurs": [
   {
    "san": "d4",
    "pourquoi": "Trop pressé : ...b5 attaque le fou avant que d4 ne touche le fou c5. Après dxc5 bxa4, les Blancs ont perdu le fou de cases blanches et le cavalier e4 est toujours là. L'ordre des coups compte : d'abord régler le sort du fou."
   },
   {
    "san": "d3",
    "pourquoi": "Oublie que le fou c5 vise f2. Après ...Cxf2 ! les Noirs gagnent un pion et détruisent le roque : le roi blanc est à nu et Te1 vient trop tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 64
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6",
  "sens": "Échange le fou attaqué contre le cavalier c6 avant d'être chassé : il abîme la structure noire (pions doublés après la reprise) et laisse le cavalier e4 seul au milieu de l'échiquier.",
  "menace": "Le cavalier e4 est en l'air : d4 ou Te1 vont l'attaquer, et le fou c5 peut tomber après d4.",
  "plan": [
   {
    "san": "dxc6",
    "pourquoi": "Reprend vers le centre : ouvre la colonne d pour la dame et la diagonale c8-h3 pour le fou. Les Noirs gardent la paire de fous. Ensuite ...O-O et ...Te8 pour soutenir le cavalier e4. La position reste un peu moins bonne mais tenable."
   }
  ],
  "erreurs": [
   {
    "san": "bxc6",
    "pourquoi": "Reprend vers le bord : le pion d7 reste bloqué, le fou c8 ne sort pas. Après De2 (attaque e4) puis d4, le cavalier doit partir et le fou c5 est chassé. Les Blancs prennent le centre sans effort."
   },
   {
    "san": "Bxf2+",
    "pourquoi": "Sacrifice qui ne marche pas : après Txf2 Cxf2 De1, le cavalier f2 est pris, et les Noirs n'ont aucune attaque. Pièce perdue pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -56
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6",
  "sens": "Reprend vers le centre après l'échange en c6 : la colonne d s'ouvre pour la dame, la diagonale c8-h3 pour le fou, et les Noirs conservent la paire de fous. Le cavalier e4 reste en l'air, il faudra le soutenir par ...O-O et ...Te8.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Attaque tout de suite le cavalier e4, qui n'est défendu par rien. Les Noirs doivent le reculer ou le soutenir par ...De7, ce qui bloque leur fou. Après cela d3 chasse le cavalier et les Blancs gardent un petit avantage grâce aux pions noirs doublés sur la colonne c."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Semble développer en attaquant e4, mais après ...Cxc3 dxc3 Dxd1 Txd1 les dames sont échangées : les Noirs ont la paire de fous, un pion d'avance sur l'aile dame n'est plus possible pour les Blancs, et la position est simplement égale, voire meilleure pour les Noirs."
   },
   {
    "san": "c4",
    "pourquoi": "Veut prendre de l'espace, mais la case d3 n'est plus couverte : ...Dd3 ! entre dans le camp blanc, et après Db3 Dxb3 axb3 les Blancs ont des pions doublés et un centre affaibli."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 59
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2",
  "sens": "Met la dame en face du cavalier e4, qui n'est protégé par aucune pièce : il faut le sauver tout de suite, et la dame prépare aussi d3 pour le chasser s'il reste là.",
  "menace": "Dxe4 : prendre le cavalier e4 pour rien.",
  "plan": [
   {
    "san": "Qe7",
    "pourquoi": "Seul coup qui tient. La dame soutient le cavalier, et si 9.d3 le cavalier recule en d6 ou f6 avec un échange de dames possible en e7, ce qui calme le jeu. Le fou f8 est déjà sorti en c5, donc la dame en e7 ne bloque rien d'important. Les Blancs restent un peu mieux à cause des pions c6 et c7 doublés, mais les Noirs ont la paire de fous."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le roque ne défend pas le cavalier : 9.Dxe4 le gagne net. Après 9...Te8 10.Dc4 la dame blanche s'échappe en défendant tout. Avant de roquer, il faut d'abord sauver la pièce attaquée."
   },
   {
    "san": "Bxf2+",
    "pourquoi": "Le sacrifice tentant ne marche pas : 9.Txf2 et le cavalier e4 est toujours attaqué par la dame. Après 9...De7 10.Tf1 les Noirs ont donné un fou pour un pion et le cavalier reste en danger. On ne doit pas chercher de combinaison quand une pièce est en prise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -58
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2 Qe7",
  "nom": "Partie espagnole, défense berlinoise",
  "sens": "Protège le cavalier e4 clouté sur la colonne e et garde le roi au centre un coup de plus : la dame fait face à celle des Blancs, prête à l'échanger si la pression monte.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Chasse le fou c5 en gagnant du temps et ouvre la diagonale du fou c1. Le cavalier e4 perd son appui central et devra reculer en d6 ou f6. Les Blancs gardent une structure saine face aux pions c6 et c7 doublés."
   },
   {
    "san": "Re1",
    "pourquoi": "Met la tour en face du cavalier e4 et de la dame e7. Le cavalier est attaqué et doit partir, ce qui laisse les Noirs un peu passifs. Après l'échange des dames, la tour est déjà bien placée."
   },
   {
    "san": "d3",
    "pourquoi": "Chasse le cavalier tout de suite, simple et solide. Si les Noirs échangent les dames en e2, les Blancs ont le meilleur pion central et des pions noirs doublés à viser en finale."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Le cavalier e4 prend en c3 et la dame blanche doit échanger en e7, le fou reprend. Résultat : les Blancs ont perdu un cavalier pour rien, car reprendre en c3 avec le pion n'est plus possible après l'échange."
   },
   {
    "san": "Qc4",
    "pourquoi": "La dame attaque le fou c5 mais se place sous le feu des pièces noires : Ff5 développe en gagnant du temps, puis b5 chasse la dame. Les Noirs prennent l'initiative et terminent leur développement les premiers."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 56
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2 Qe7 d4",
  "sens": "attaque le fou c5 avec le pion pour gagner un temps, et ouvre la diagonale c1-h6 au fou de case noire. Le cavalier e4 n'est plus soutenu par un pion central : il devra reculer. Les Blancs visent aussi la colonne e, où leur dame fait face à la dame noire.",
  "menace": "dxc5 gagne simplement le fou c5 ; ensuite Te1 clouerait le cavalier e4 sur la dame e7.",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "recule en gardant une bonne diagonale vers h2. Le fou défend aussi la case e5 et prépare le repli du cavalier en f6 sans gêner le roque. Les Blancs joueront Te1 et c4 : les Noirs auront alors la paire de fous et un pion de plus."
   },
   {
    "san": "Nf6",
    "pourquoi": "met le cavalier à l'abri avant qu'il ne soit cloué par Te1. Le fou c5 reste attaqué, mais après dxc5 Dxe2 les Noirs récupèrent la dame et ne perdent rien de plus : le cavalier revient défendre le roi."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "oublie que le fou c5 est attaqué : dxc5 le gagne tout simplement. Roquer est sain en général, mais ici il faut d'abord répondre à la menace directe."
   },
   {
    "san": "Bxd4",
    "pourquoi": "prend un pion, mais Cxd4 rend la pièce et le cavalier e4 n'a plus de défense : après Cd6 Dxe7 les Blancs restent avec une pièce de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -62
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2 Qe7 d4 Bd6",
  "nom": "Défense berlinoise",
  "sens": "recule le fou sur une diagonale active vers h2, protège e5 et libère la case f6 pour que le cavalier puisse rentrer sans bloquer le roque",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "prend de l'espace au centre et retire la case d5 aux pièces noires ; le pion appuie d4 et prépare Cc3 ou Cbd2 pour chasser le cavalier e4. Les Noirs vont répondre ...Ff5 ou ...c5, mais les Blancs gardent l'initiative."
   },
   {
    "san": "Re1",
    "pourquoi": "cloue le cavalier e4 sur la dame e7 : il ne peut plus bouger sans perdre la dame. Les Blancs menacent ensuite c4 et Cbd2 pour gagner du temps sur cette pièce clouée. Les Noirs devront roquer ou jouer ...Ff5 pour le soutenir."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "semble logique pour attaquer le cavalier, mais après ...Cxd2 Dxd2 Fe6 tout s'échange et les Noirs restent avec la paire de fous, un développement facile et une structure saine. Les Blancs ont perdu leur petit avantage pour rien."
   },
   {
    "san": "h3",
    "pourquoi": "coup de prudence inutile : rien ne menaçait sur g4. Les Noirs jouent ...Ff5 et renforcent le cavalier e4, puis ...c5 attaque d4. Les Blancs ont perdu un temps précieux et le centre devient fragile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 63
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2 Qe7 d4 Bd6 c4",
  "sens": "Prend de l'espace et prépare c5 : le pion va attaquer le fou d6 alors que le cavalier e4 est cloué sur la dame par la dame e2. Le pion c4 retire aussi d5 aux pièces noires et prépare Cc3.",
  "menace": "c5 : le fou d6 est attaqué ; si le cavalier prend sur c5, Dxe7+ Fxe7 puis dxc5 gagne une pièce. Tour e1 pour clouer encore plus le cavalier est aussi dans l'air.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Frappe d4 avant que les Blancs ne jouent c5 eux-mêmes. Si dxc5, le fou reprend et la colonne e s'ouvre pour les Noirs. Le cavalier e4 reste défendu, et le fou d6 n'est plus une cible."
   },
   {
    "san": "Nf6",
    "pourquoi": "Retire le cavalier de la colonne e avant le clouage. Après Dxe7+ Rxe7 les dames sont échangées, le roi noir est à l'abri au centre faute de dames, et le pion c4 a laissé des trous (d4 est plus faible)."
   },
   {
    "san": "b6",
    "pourquoi": "Empêche c5 de gagner du temps sur le fou : si c5 bxc5 et le fou est défendu. Prépare aussi ...Fb7 sur la grande diagonale, qui regarde g2."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roque naturel mais trop lent : c5 attaque le fou d6, et le cavalier e4 ne peut pas prendre (Dxe7 Fxe7 dxc5 gagne une pièce). Les Noirs perdent du matériel."
   },
   {
    "san": "Bf5",
    "pourquoi": "Développe le fou mais ne répond pas à la menace : c5 attaque le fou d6, Cxc5 est puni par Dxe7+ puis dxc5. Toujours parer la menace avant de développer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -58
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 Nxe5 Nxe4 Nf3 a6 Bxc6 dxc6 Qe2 Qe7 d4 Bd6 c4 c5",
  "sens": "frappe le centre blanc avant que les Blancs ne poussent c5 eux-mêmes : si d4 prend, le fou reprend en c5 et la colonne e s'ouvre pour les Noirs, le cavalier e4 reste protégé par la dame.",
  "menace": "cxd4 : gagner le pion d4 et laisser au fou d6 une case solide, les Blancs devant reprendre avec le cavalier et perdre du temps.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "cloue le cavalier e4 sur la dame e7 et le roi e8. S'il bouge, les dames s'échangent par Dxe7+ et les Noirs perdent le droit de roquer. Les Blancs préparent Cbd2 ou d5 pour chasser ou gagner ce cavalier. Ils laissent le pion d4 sous pression, mais dxc4 Dxe7 règle le problème."
   },
   {
    "san": "b4",
    "pourquoi": "attaque le pion c5 pour casser la tenaille sur d4. Si cxb4, le pion d4 avance en d5 et le cavalier e4 n'a plus la case c5 pour reculer. Les Noirs peuvent répondre O-O, mais le centre blanc se libère."
   }
  ],
  "erreurs": [
   {
    "san": "dxc5",
    "pourquoi": "fait exactement ce que les Noirs espéraient : Cxc5 reprend, le cavalier trouve une case parfaite, le fou d6 vise h2 et la colonne e s'ouvre contre la dame e2. Les Noirs ont le centre et l'initiative."
   },
   {
    "san": "Nc3",
    "pourquoi": "développe sur une case attaquée : Cxc3 force Dxe7+ Fxe7, puis bxc3 abîme les pions blancs. Les dames disparaissent, et les Blancs n'ont plus aucune pression sur e4 ni sur c5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 59
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6",
  "nom": "Défense Bird (3...Cd4), variante 4...a6",
  "sens": "attaque le fou b5 avant de reprendre en d4 : les Noirs veulent forcer le fou à choisir sa case, puis jouer ...exd4 en ayant gagné le coup ...a6.",
  "menace": "...axb5 gagne le fou ; et le cavalier d4 reste en prise par le pion e5.",
  "plan": [
   {
    "san": "Ba4",
    "pourquoi": "Sauve le fou sur une diagonale utile : il regarde toujours c6 et d7 et pourra revenir en b3 vers f7. Après ...exd4, les Blancs jouent O-O et d3 ou c3 et rattrapent le pion d4 plus tard, avec une avance de développement. C'est le choix le plus simple à comprendre."
   },
   {
    "san": "Ne6",
    "pourquoi": "Au lieu de reculer, le cavalier saute en e6 où il attaque la dame d8 et le fou f8. Les Noirs doivent le prendre (...dxe6 ou ...fxe6) et cassent leur structure de pions ; ensuite Fc4 ou Fe2 et les Blancs ont un roi noir moins bien abrité. Exige de calculer mais est très fort."
   },
   {
    "san": "Bxd7+",
    "pourquoi": "Échange le fou attaqué contre le pion d7 avec échec. Après ...Fxd7 (ou ...Dxd7), le cavalier d4 a le temps de reculer en f3 ou b3 et les Blancs n'ont rien perdu. Solide, mais les Noirs gardent la paire de fous."
   }
  ],
  "erreurs": [
   {
    "san": "Nf3",
    "pourquoi": "Sauve le cavalier mais oublie le fou : ...axb5 le prend pour rien. Les Blancs n'ont qu'un pion en compensation après d4. Il faut traiter le fou d'abord, il est attaqué par un pion."
   },
   {
    "san": "O-O",
    "pourquoi": "Roque trop tôt : ...axb5 gagne le fou b5 immédiatement, puis le cavalier d4 recule et les Blancs restent avec une pièce de moins. Avant de roquer, on sauve ses pièces en prise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 98
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4",
  "nom": "Défense Bird (Partie espagnole)",
  "sens": "Met le fou à l'abri de l'attaque du pion a6 tout en gardant la diagonale a4-e8 : le fou surveille encore c6 et d7 et pourra revenir en b3 vers f7. Les Blancs acceptent de laisser leur cavalier d4 un instant en prise, car ils le récupéreront avec un pion plus tard.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Le seul bon coup : les Noirs doivent reprendre le cavalier tout de suite, sinon il s'échappe et ils ont perdu un cavalier pour rien. Après la prise, le pion d4 gêne le développement blanc (le cavalier b1 ne peut plus aller en c3). Les Blancs vont roquer et jouer c3 ou d3 pour rattraper ce pion, avec une petite avance de développement : ce n'est pas grave, mais il faut ensuite développer vite (...Cf6, ...Fc5, ...O-O)."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développer avant de reprendre est une erreur grave : le cavalier blanc recule simplement en f3 et les Noirs se retrouvent avec un cavalier de moins pour rien. Règle à retenir : quand une pièce est en prise, on la prend d'abord, on développe ensuite."
   },
   {
    "san": "b5",
    "pourquoi": "Chasser le fou paraît tentant, mais après Fb3 le fou vise f7 ; si les Noirs prennent alors en d4, le fou prend f7 avec échec et le roi noir est déraciné. Une pièce perdue pour les Noirs dans tous les cas : il fallait d'abord jouer exd4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -88
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4",
  "nom": "Défense Bird (variante Bird de l'Espagnole)",
  "sens": "Reprend le cavalier pour rétablir l'équilibre matériel : le pion d4 avancé occupe le centre et prive le cavalier b1 de sa case naturelle c3.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite et connecte la tour à la défense de e4. Les Blancs ne se pressent pas pour d4 : il ne s'échappe pas. Ensuite d3, c3 et Cd2 pour reprendre le pion avec un développement d'avance. Les Noirs auront le temps de jouer ...Cf6 et ...Fc5, mais le pion d4 finira par tomber ou coûter du temps."
   },
   {
    "san": "d3",
    "pourquoi": "Protège e4 et ouvre la diagonale du fou c1. Prépare c3 pour attaquer d4 : après ...dxc3 Cxc3, le cavalier arrive enfin sur sa bonne case. Si les Noirs défendent par ...c5, leur pion d6 devient faible et le fou f8 est gêné."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque d4 immédiatement. Après ...dxc3 dxc3 (ou Cxc3), les Blancs ont un développement fluide et la colonne d. Inconvénient : les Noirs peuvent jouer ...Fc5 et garder le pion un moment, donc roquer d'abord est plus souple."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Veut soutenir d4 ? Non : c'est le pion noir ! Ce coup affaiblit d4 pour les Blancs eux-mêmes et donne ...b5 : après cxb5 axb5 le fou a4 est attaqué, la colonne a s'ouvre pour la tour noire et les Blancs ont perdu tout avantage de développement."
   },
   {
    "san": "e5",
    "pourquoi": "Avance un pion sans développer. Après ...c6 le fou a4 doit reculer et ...d5 attaque e5 et prend le centre. Le pion e5 devient une cible au lieu d'un atout, et le roi blanc n'est toujours pas roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 91
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O",
  "nom": "Défense Bird (Partie espagnole)",
  "sens": "met le roi à l'abri avant d'attaquer le pion d4 : la tour f1 surveillera la colonne e et les Blancs préparent d3, c3 pour reprendre le pion sans se presser.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou en défendant d4 : le pion avancé devient une pointe qui gêne les Blancs. Il prépare ...Ce7 ou ...Cf6 et le petit roque. Les Blancs devront jouer d3 et c3, mais le fou c5 veille sur d4."
   },
   {
    "san": "c6",
    "pourquoi": "Coupe la diagonale a4-e8 et prépare ...d5 pour frapper le centre. Ouvre aussi la case c7 à la dame. Le pion d4 reste défendu par une dame qui pourra aller en b6 ou f6."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4 : les Blancs doivent déjà réagir par d3 ou Te1. Après ...Fc5 ou ...Fe7 les Noirs roquent vite. Il laisse le pion d4 un peu seul, mais les Blancs n'ont pas encore le temps de le prendre."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "Chasse le fou en b3, qui vise alors f7 et mord sur la grande diagonale. Les Blancs jouent a4 et ouvrent l'aile dame : le pion b5 devient une cible et les Noirs perdent le temps qu'il fallait pour défendre d4 et développer."
   },
   {
    "san": "h6",
    "pourquoi": "Coup de prudence inutile : rien ne menace g5. Les Blancs jouent d3 puis Cd2 et récupèrent d4 avec un développement d'avance, pendant que le pion h6 n'aura servi à rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -95
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5",
  "nom": "Partie espagnole, défense Bird",
  "sens": "Sort le fou en protégeant le pion d4 : ce pion avancé gêne le développement blanc (il empêche c3 et Cc3 confortables). Il prépare ...Ce7 ou ...Cf6 puis le petit roque.",
  "plan": [
   {
    "san": "d3",
    "pourquoi": "Ouvre la diagonale du fou c1 et solidifie e4. Le pion d4 noir reste bloqué, et les Blancs pourront ensuite jouer c3 pour le défier. Les Noirs continueront par ...Ce7 ou ...Cf6."
   },
   {
    "san": "Qg4",
    "pourquoi": "La dame attaque le pion g7 et le pion d4 en même temps. Les Noirs doivent répondre précisément (...Cf6 ou ...Rf8) : un bon moyen de tester un débutant, mais la dame peut ensuite être chassée."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4. Si les Noirs prennent en c3, les Blancs reprennent avec le cavalier et développent avec gain de temps. Les Noirs peuvent aussi jouer ...dxc3 ou laisser prendre."
   }
  ],
  "erreurs": [
   {
    "san": "Kh1",
    "pourquoi": "Coup d'attente inutile : les Noirs répondent ...d3 ! Le pion avancé s'enfonce dans le camp blanc, bloque le fou c1 et le pion c2. Les Blancs perdent un temps précieux."
   },
   {
    "san": "e5",
    "pourquoi": "Avance le pion sans défense suffisante : après ...Ce7 et ...O-O, le pion e5 devient une faiblesse à défendre, et le pion d4 noir reste toujours gênant. Les Blancs n'ont rien gagné."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 88
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3",
  "nom": "Variante Bird (défense Bird de l'Espagnole)",
  "sens": "ouvre la diagonale du fou c1 et consolide e4 ; le pion d4 noir reste isolé en territoire blanc, et les Blancs préparent c3 pour le déloger",
  "plan": [
   {
    "san": "c6",
    "pourquoi": "Soutient le pion d4 avec ...d5 ou ...b5 plus tard, et ferme la diagonale du fou a4 : le cavalier c6 n'existe plus, le pion c7 peut avancer sans crainte. Les Noirs préparent ...Ne7 puis ...d5 pour s'installer au centre."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe en gardant la case f6 libre pour ...Ng6 ou ...d5. Le cavalier protège d5 et le roque devient possible. Simple et solide : on sort les pièces avant de bouger les pions."
   },
   {
    "san": "a5",
    "pourquoi": "Prend l'espace à l'aile dame et fixe le fou a4 : il n'aura plus de case de repli sur b3 sans céder du terrain. Prépare ...Ra6 ou ...b5 dans de meilleures conditions. Mais c'est un coup de pion : le développement attend."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "On veut chasser le fou, mais après Bb3 puis a4 les pions a6 et b5 deviennent des cibles. Le fou b3 vise f7 et le roque noir, et les Noirs ont perdu du temps au lieu de développer."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame bloque le fou f8... non, elle gêne le cavalier g8 qui voulait e7 et se place face à la tour e1. Après Re1 et Bb3, la dame est exposée et doit rebouger : du temps perdu alors que les Blancs ont déjà roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -115
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Consolide la structure : le pion c6 soutient l'avance ...d5 et prépare ...b5 pour chasser le fou a4. Il bouche aussi la diagonale a4-e8, donc plus d'échec gênant sur le roi. Les Noirs vont jouer ...Ce7, ...O-O et ...d5 pour prendre le centre.",
  "plan": [
   {
    "san": "Nd2",
    "pourquoi": "Développe le cavalier vers b3 ou c4 : de là il attaque le fou c5 et le pion d4, avancé et isolé. Le pion c2 reste libre de jouer c3 plus tard pour casser d4. Les Noirs continueront ...Ce7 et ...O-O, mais leur pion d4 devient une cible durable."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4. Si les Noirs prennent (...dxc3), les Blancs reprennent avec le cavalier (Cxc3) et développent gratuitement ; sinon cxd4 et le fou c5 doit reculer. Le centre blanc (e4) devient plus solide que le pion noir isolé."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Bloque le centre et enferme le pion d4 derrière un mur : il devient impossible à attaquer avec c3, et le fou a4 reste sans cible. Les Noirs jouent tranquillement ...d6 et ...Cf6 et obtiennent une position confortable sans rien faire."
   },
   {
    "san": "Qe2",
    "pourquoi": "Sort la dame trop tôt : elle bloque la case e2 et gêne la coordination des pièces. Après ...Ce7 et ...O-O, le roi noir est à l'abri et le pion d4 n'est toujours pas attaqué. Le plan f4 fragilise le propre roi blanc sans rien gagner."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 111
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2",
  "nom": "Défense Bird",
  "sens": "Sort le cavalier de d2 pour le remettre en jeu : il vise b3 ou c4, d'où il attaquera le fou c5 et le pion d4, avancé et isolé. La colonne c reste libre pour c3 plus tard, afin de casser d4.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le pion f ; de e7 il peut aller en g6 ou c6 pour soutenir d4. Prépare le petit roque. Laisse aux Blancs Cb3 ou Cc4, mais le fou c5 pourra reculer en b6 ou a7."
   },
   {
    "san": "d6",
    "pourquoi": "Ouvre la diagonale du fou c8 et donne une case de repli au fou c5 via b6 si Cb3 arrive. Solidifie le centre avant de roquer. Attention : le pion d4 reste isolé, il faudra le défendre."
   },
   {
    "san": "a5",
    "pourquoi": "Prépare ...a4 pour chasser le cavalier qui viendrait en b3 et gagner de l'espace à l'aile dame. Évite que le pion d4 soit attaqué deux fois. Retarde un peu le développement du roi, mais sans danger immédiat."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "Chasse le fou en b3, mais il pointe alors sur f7 et d5. Après ...d5 les Blancs jouent a4 et l'aile dame noire s'écroule : le pion b5 est attaqué, la tour a8 exposée, le roi encore au centre."
   },
   {
    "san": "Qe7",
    "pourquoi": "Semble développer la dame, mais elle gêne le cavalier g8 et le fou f8 est déjà sorti : le roque devient compliqué. Les Blancs répondent c3 puis Cb3 : le pion d4 et le fou c5 sont attaqués en même temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -116
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2 Ne7",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "développe le cavalier sans boucher la colonne f : de e7 il ira en g6 ou reviendra en c6 pour soutenir le pion d4, et le roi pourra roquer au prochain coup.",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "Pousse le pion f avec la tour f1 déjà derrière lui. Gagne de l'espace au centre, prépare e5 ou f5 contre le roi noir qui va roquer. Laisse aux Noirs ...d5 pour contester le centre, mais le pion e4 est bien défendu par d3."
   },
   {
    "san": "Qh5",
    "pourquoi": "Sort la dame en attaquant le fou c5 sur la 5e rangée et en visant h7. Les Noirs doivent réagir (...Fb6 ou ...d5) et perdent un temps avant de roquer. Attention : la dame devra revenir si les Noirs chassent avec ...g6."
   },
   {
    "san": "Bb3",
    "pourquoi": "Replace le fou sur la diagonale a2-g8, le nez sur f7. Prépare Cc4 ou f4 ensuite. Laisse aux Noirs ...d5, mais le fou reste actif et hors de portée des pions noirs."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "La tour quitte f1 alors que le bon plan est f4. Après ...O-O, c3 Fb6, les Noirs sont développés tranquillement et la tour e1 ne fait rien derrière le pion e4 déjà défendu."
   },
   {
    "san": "Qe2",
    "pourquoi": "Dame passive qui bloque le fou f1... non, ici elle gêne le futur Cc4 et ne menace rien. Après ...O-O, Fb3 d5, les Noirs ouvrent le centre et le pion d4 reste solide. Les Blancs ont perdu un temps sans plan."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 107
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2 Ne7 f4",
  "nom": "Défense Bird (Cd4) de la Partie espagnole",
  "sens": "Gagne de l'espace au centre avec le pion f, la tour f1 déjà derrière lui ; prépare f5 ou e5 pour chasser les pièces noires et attaquer le roi qui va roquer, tout en gardant e4 solidement tenu par d3.",
  "menace": "f5 puis Dh5 : le pion f5 bloque le cavalier e7 et la dame arrive sur h5 devant le roi noir, avec e5 ou Cf3 derrière.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant que l'attaque ne démarre et relie les tours. Laisse aux Blancs f5, mais les Noirs répondront ...d5 au centre et le fou c5 tient d4."
   },
   {
    "san": "d5",
    "pourquoi": "Conteste tout de suite le centre : si exd5 Cxd5, le cavalier e7 trouve une belle case et la diagonale c8-h3 s'ouvre pour le fou. Ne pas attendre que f5 fige la position."
   },
   {
    "san": "a5",
    "pourquoi": "Prépare ...b5 pour mettre le fou a4 en question et gagner de l'espace à l'aile dame, puis ...Fa6 ou ...Fb7. Un plan calme qui laisse aux Blancs l'initiative à l'aile roi."
   }
  ],
  "erreurs": [
   {
    "san": "d6",
    "pourquoi": "Trop passif : après f5 le cavalier e7 est bloqué, le fou c8 enterré, et Fb3 vise f7. Les Noirs n'ont plus ...d5 et subissent l'attaque sans contre-jeu."
   },
   {
    "san": "h6",
    "pourquoi": "Affaiblit le roque pour rien : Dh5 arrive aussitôt, f5 suit, et h6 devient une cible pour un sacrifice sur g6. Il fallait jouer au centre, pas sur l'aile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -109
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2 Ne7 f4 O-O",
  "nom": "Défense Bird (3...Cd4)",
  "sens": "Met le roi à l'abri avant que l'attaque ne démarre et relie les tours. Laisse aux Blancs f5, mais compte répondre ...d5 au centre pendant que le fou c5 tient d4.",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "Replace le fou sur la diagonale a2-g8 avant que ...d5 ne la ferme : il vise f7 et sort de la ligne de ...a5-a4 qui le menaçait sur a4. Prépare ensuite f5 et c3 pour attaquer le pion d4."
   },
   {
    "san": "f5",
    "pourquoi": "Gagne de l'espace sur l'aile roi et enferme le cavalier e7 : il ne peut plus aller en f5 ni en g6 sans danger. Prépare Dh5 ou g4-g5 contre le roi noir. Laisse aux Noirs ...d5 et ...f6 pour s'ouvrir."
   },
   {
    "san": "Qh5",
    "pourquoi": "Sort la dame en attaque : elle vise h7 et appuie f5. Les Noirs doivent défendre avec ...d5 ou ...f5, ce qui leur laisse peu de temps pour ...a5 contre le fou."
   }
  ],
  "erreurs": [
   {
    "san": "Kh1",
    "pourquoi": "Coup de prudence qui perd un temps. Les Noirs jouent ...d5 puis ...a5 : le pion a va en a4 chasser le fou, et le fou doit fuir en b3 sans avoir rien fait. L'attaque blanche n'a pas commencé."
   },
   {
    "san": "Qe2",
    "pourquoi": "La dame bloque la colonne e et ne menace rien. Après ...a5 les Blancs doivent jouer a3 pour sauver le fou, puis ...f6 ferme l'aile roi : f5 et e5 n'arrivent plus et l'initiative est perdue."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 109
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2 Ne7 f4 O-O Bb3",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "Replace le fou sur la diagonale a2-g8 avant que ...d5 ne la ferme : il vise f7 et quitte a4 où ...a5-a4 allait le chasser. Prépare ensuite f5 pour gêner le roque noir, puis c3 pour attaquer le pion d4.",
  "menace": "f4-f5 suivi de Dh5 : le fou b3 et la dame visent f7 et h7, et f5-f6 vient ouvrir le roque noir.",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "Ferme tout de suite la diagonale du fou b3 et prend de l'espace au centre. Le fou c8 peut enfin sortir. Après f5, les Noirs répondent ...d5-d4 ou ...f6 sans paniquer : le centre est fermé, l'attaque blanche n'a plus de cible."
   },
   {
    "san": "a5",
    "pourquoi": "Continue de chasser le fou : ...a4 le force à bouger encore et gagne du temps. Si c3, le pion d4 est protégé par ...a4-a3 qui affaiblit l'aile dame blanche. Laisse cependant f5 aux Blancs, il faut jouer ...d5 juste après."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "Coup naturel pour gagner de l'espace, mais il ne ferme pas la diagonale a2-g8. Après f5 d5 f6, le pion blanc fend le roque : le cavalier e7 est attaqué et g7 s'affaiblit, les Blancs attaquent le roi."
   },
   {
    "san": "Kh8",
    "pourquoi": "Un demi-coup perdu qui ne règle rien : le fou prend tout simplement f7 (Fxf7) et les Blancs gagnent un pion net, car f7 n'était défendu que par le roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -109
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 a6 Ba4 exd4 O-O Bc5 d3 c6 Nd2 Ne7 f4 O-O Bb3 d5",
  "sens": "Ferme la diagonale a2-g8 du fou b3 et attaque le pion e4 pour contester le centre. Le fou c8 respire enfin, et le pion d5 est solidement soutenu par c6 et le cavalier e7.",
  "plan": [
   {
    "san": "f5",
    "pourquoi": "Gagne de l'espace à l'aile roi et verrouille le fou c8 : les cases e6 et g6 sont sous contrôle, les Noirs ne peuvent plus jouer ...Fe6 ni ...Cg6 tranquillement. Prépare Dh5 ou Cf3-g5 contre le roi. Si ...dxe4, Cxe4 attaque le fou c5 avec tempo. Les Noirs vont devoir répondre ...f6 pour se consolider, mais le fou c8 reste enfermé."
   },
   {
    "san": "Qh5",
    "pourquoi": "Sort la dame avec des menaces directes sur h7 et f7, et appuie la poussée f5. Les Noirs doivent réagir vite (...Cg6 ou ...f5). Un peu moins précis que f5 immédiat car la dame peut devenir une cible pour ...Cg6-f4 ou ...Df6."
   },
   {
    "san": "Nf3",
    "pourquoi": "Attaque le pion d4, le pilier qui protège le fou c5, et ramène le cavalier vers g5 et e5 pour l'attaque. Oblige les Noirs à défendre d4 par ...c5 ou ...Dd6 avant de penser à ...dxe4."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "La tour quitte la colonne f au moment précis où tout le plan blanc repose sur f4-f5. Après ...f6, la position du roi noir est consolidée, f5 n'a plus de mordant, et le fou recule en d6 pour viser f4. Les Blancs ont perdu un temps et leur meilleure pièce d'attaque est mal placée."
   },
   {
    "san": "Rf2",
    "pourquoi": "Coup passif qui ne prépare rien : la tour gêne la dame et le fou b3 n'a toujours pas de diagonale. Les Noirs en profitent pour gagner de l'espace avec ...a5-a4 contre le fou, puis ...f6, et les Blancs n'ont plus d'initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 102
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4",
  "nom": "Partie des quatre cavaliers, variante Rubinstein (par transposition)",
  "sens": "Chasse le fou b5 en occupant le centre : le cavalier d4 attaque le fou et oblige les Blancs à décider immédiatement de son sort.",
  "menace": "Cxb5 : échanger le cavalier contre le fou espagnol, puis Cxc3 pour abîmer les pions blancs si les Blancs ne bougent pas.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Supprime le cavalier gênant avant qu'il ne prenne le fou. Après exd4, le pion noir sur d4 est avancé et isolé : les Blancs l'attaqueront plus tard avec e5 et Dd4 ou c3. Position simple et sans risque."
   },
   {
    "san": "Bc4",
    "pourquoi": "Garde le fou sur sa belle diagonale vers f7 et évite l'échange. Prépare le petit roque et d3. Les Noirs peuvent répondre Fc5 pour défendre d4, mais le fou blanc reste actif."
   },
   {
    "san": "Be2",
    "pourquoi": "Recule le fou en sécurité et laisse aux Noirs le choix : s'ils jouent Cxe2, les Blancs reprennent Dxe2 et gagnent du temps pour roquer et jouer d4. Coup calme et solide."
   }
  ],
  "erreurs": [
   {
    "san": "Rb1",
    "pourquoi": "Ne répond pas à la menace sur le fou. Les Noirs jouent Cxb5 Cxb5 d5 : ils ont éliminé le bon fou espagnol et ouvrent le centre alors que les Blancs ont perdu un coup avec la tour."
   },
   {
    "san": "a3",
    "pourquoi": "Coup de pion inutile qui ne règle rien. Les Noirs jouent c6 et le fou doit reculer quand même sur e2 : les Blancs ont dépensé un temps pour rien, et les Noirs développent Fd6 tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4",
  "nom": "Partie des quatre cavaliers, variante Rubinstein",
  "sens": "Capture le cavalier noir qui venait attaquer le fou b5 : il l'échange avant qu'il ne prenne, et laisse aux Noirs un pion avancé sur d4.",
  "menace": "Le cavalier blanc sur d4 est en prise : s'il reste là, les Blancs ont gagné une pièce.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Reprend le cavalier : c'est le seul coup, sinon les Noirs ont une pièce de moins. Le pion d4 chasse le cavalier c3, qui doit bouger (Ce2). Ce pion est isolé et les Blancs l'attaqueront avec e5 et Dxd4, mais les Noirs ont le temps de jouer c6 puis de pousser d5 pour s'en débarrasser."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe4",
    "pourquoi": "Un débutant croit rendre coup pour coup, mais après Cxe4 exd4 les Blancs ont pris deux pièces contre une : les Noirs restent avec un cavalier de moins. Il fallait d'abord reprendre en d4."
   },
   {
    "san": "a6",
    "pourquoi": "Attaque le fou, mais oublie que le cavalier d4 est en prise. Les Blancs répondent Fxd7+ (échange des pièces) puis reculent le cavalier en f3 : ils ont gagné une pièce pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4",
  "nom": "Partie espagnole, défense des quatre cavaliers avec Cd4 (variante Rubinstein)",
  "sens": "Reprend le cavalier avec le pion e : c'est obligatoire, sinon les Noirs restent avec une pièce de moins. Le pion d4 attaque maintenant le cavalier c3 et le fait reculer.",
  "menace": "dxc3 : prendre le cavalier c3, qui est attaqué par le pion d4.",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "Contre-attaque au lieu de reculer : le pion e5 chasse le cavalier f6. Si les Noirs prennent dxc3, les Blancs reprennent exf6 et ont aussi gagné une pièce : l'échange est équilibré. Après 5...Cd5 ou 5...Ce4, le cavalier c3 est toujours attaqué mais il peut bouger tranquillement (Ce4 ou Cxe4). Les Blancs gardent l'initiative au centre."
   },
   {
    "san": "Nd5",
    "pourquoi": "Le cavalier s'échappe vers une case active au centre. De là il attaque le cavalier f6 et regarde c7. Les Noirs répondent souvent Cxd5 puis exd5, ou c6 pour le chasser : la position reste équilibrée."
   }
  ],
  "erreurs": [
   {
    "san": "Ne2",
    "pourquoi": "Reculer ainsi est passif : après c6 et d5, les Noirs ouvrent le centre et se débarrassent facilement de leur pion isolé. Le fou b5 doit reculer en d3 et les Blancs n'ont plus rien."
   },
   {
    "san": "O-O",
    "pourquoi": "Oublie que le cavalier c3 est attaqué : dxc3 gagne une pièce entière. Même e5 ensuite n'aide pas, le cavalier f6 va en d5 et les Noirs gardent le butin."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5",
  "nom": "Partie espagnole, défense des quatre cavaliers, variante Rubinstein",
  "sens": "Attaque le cavalier f6 au lieu de sauver le cavalier c3 : chaque camp a une pièce en prise, et les Blancs comptent sur l'ordre des captures pour garder l'équilibre matériel tout en gagnant de l'espace au centre.",
  "menace": "exf6 : gagner le cavalier f6 (le pion d4 n'aura alors plus le temps de prendre c3 sans que les Blancs ne reprennent avec un pion ou la dame).",
  "plan": [
   {
    "san": "dxc3",
    "pourquoi": "Prend d'abord le cavalier qui est en prise. Après exf6 Dxf6, chaque camp a gagné une pièce. Ensuite bxc3 ou dxc3 : les Blancs ont des pions doublés sur la colonne c, les Noirs un développement facile avec la dame déjà sortie."
   },
   {
    "san": "c6",
    "pourquoi": "Attaque le fou b5 avant de reprendre en c3. Les Blancs doivent choisir : exf6 cxb5 ou Fc4/Fa4 puis dxc3. Les Noirs gardent les pièces actives, mais c'est un peu plus compliqué que dxc3 et la position reste tendue."
   }
  ],
  "erreurs": [
   {
    "san": "Nd5",
    "pourquoi": "Semble sauver le cavalier tout en attaquant c3, mais Cxd5 le prend, et le pion d4 n'a plus de cible : les Noirs ont perdu une pièce pour rien."
   },
   {
    "san": "Qe7",
    "pourquoi": "Cloue le pion e5 sur le roi, mais 0-0 dégage le roi, et après dxc3 exf6 les Blancs reprennent avec le pion f6 sur la dame : les Noirs doivent gaspiller un temps et restent avec un pion e5 décroché."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -10
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3",
  "sens": "Prend le cavalier en prise sur c3 avant de s'occuper de son propre cavalier f6 : le pion doit être repris, et le cavalier f6 pourra ensuite être échangé contre celui de e5. L'idée : rendre pièce pour pièce et laisser aux Blancs des pions doublés.",
  "menace": "Prendre un second pion avec cxb2 ou cxd2+, en ruinant l'aile dame blanche.",
  "plan": [
   {
    "san": "exf6",
    "pourquoi": "Le seul bon coup : il prend le cavalier noir tout de suite. Après Dxf6, chaque camp a perdu un cavalier et les Blancs reprennent le pion c3 au coup suivant. La position est équilibrée : les Blancs ont les pions doublés, mais le fou b5 est actif et le roque est proche."
   }
  ],
  "erreurs": [
   {
    "san": "dxc3",
    "pourquoi": "Reprendre le pion d'abord semble naturel, mais le cavalier f6 n'est plus menacé : il saute en e4 (ou d5), bien centralisé, et les Blancs se retrouvent avec une pièce de moins contre un pion. Perte nette d'environ quatre pions."
   },
   {
    "san": "bxc3",
    "pourquoi": "Même erreur : le pion e5 ne menace plus rien de sérieux, le cavalier noir se sauve en d5 et garde une pièce d'avance. Toujours prendre la pièce en prise avant de reprendre un simple pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 12
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6",
  "sens": "Capture le cavalier noir sur f6 avant qu'il ne s'échappe. Le pion f6 attaque maintenant g7 et bloque le centre noir, tandis que le pion c3 noir reste en prise.",
  "menace": "fxg7 gagnant le pion g7 et attaquant la tour h8 ; les Noirs doivent réagir tout de suite.",
  "plan": [
   {
    "san": "Qxf6",
    "pourquoi": "Reprend le pion f6 avec la dame, qui se centralise et protège le pion c3 : elle regarde b2 et f2. Après dxc3, les Blancs ont des pions doublés sur la colonne c, les Noirs ont deux fous et une dame active. La position est équilibrée."
   }
  ],
  "erreurs": [
   {
    "san": "cxd2+",
    "pourquoi": "Prend un pion avec échec, mais après Fxd2 le fou blanc est développé gratuitement et le pion f6 est toujours là. Les Noirs reprennent avec Dxf6, mais les Blanches roquent avec un développement d'avance et une structure de pions saine."
   },
   {
    "san": "gxf6",
    "pourquoi": "Reprend avec le pion et abîme toute la structure noire : pions doublés f6 et f7, roi sans abri sur l'aile roi, pion c3 toujours en prise. Après O-O et Te1, les Blancs attaquent le roi noir resté au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -11
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6",
  "nom": "Variante des quatre cavaliers, variante Rubinstein",
  "sens": "Reprend le pion f6 avec la dame et la place au centre : elle protège le pion c3 et vise b2 et f2 d'un coup.",
  "menace": "Dxb2 : la dame prend b2 et attaque la tour a1, qui n'est pas défendue.",
  "plan": [
   {
    "san": "dxc3",
    "pourquoi": "Reprend le pion avec le pion d : la case b2 reste couverte par le fou c1, la menace sur b2 disparaît, et le fou c1 peut sortir. Les Noirs gardent la paire de fous mais les Blancs ont la structure la plus solide. Position égale."
   },
   {
    "san": "Qe2+",
    "pourquoi": "Donne échec et gagne un temps : les Noirs doivent parer avant de prendre b2. Après Fe7 ou De7, les Blancs reprennent en c3 tranquillement. La dame e2 regarde aussi la colonne e ouverte."
   }
  ],
  "erreurs": [
   {
    "san": "bxc3",
    "pourquoi": "Reprendre avec le pion b paraît naturel mais laisse deux pions doublés et isolés sur la colonne c, un roi plus fragile et un fou c1 enfermé. Les Noirs jouent c6 puis d5 et sont mieux sans forcer."
   },
   {
    "san": "O-O",
    "pourquoi": "Mettre le roi à l'abri oublie que c3 est un pion attaquant. Après cxb2 Fxb2 Dxb2, les Noirs gagnent une pièce entière. Il faut d'abord régler le pion c3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3",
  "nom": "Partie des Quatre Cavaliers, variante Rubinstein (par transposition depuis l'Espagnole berlinoise)",
  "sens": "Reprend le pion en gardant b2 protégé par le fou c1 : la dame f6 ne gagne plus rien sur b2, le fou c1 est libre de sortir et la colonne d s'ouvre pour la dame blanche.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Développe le fou sur sa meilleure diagonale et vise f2 avec la dame : les Blancs doivent roquer vite. Prépare le petit roque. Laisse les Blancs jouer Fe3 ou De2 pour chasser le fou, mais sans gain de temps réel."
   },
   {
    "san": "Qe5+",
    "pourquoi": "L'échec oblige les Blancs à interposer De2 ou Fe2 : la dame noire revient au centre et empêche le roque immédiat. Permet ensuite c6 ou Fe7 tranquillement. Attention : la dame peut être attaquée ensuite par Te1 après le roque."
   },
   {
    "san": "c6",
    "pourquoi": "Chasse le fou b5 et prépare d5 pour ouvrir le fou c8. Coup simple de structure : les Noirs gardent les deux fous et un centre souple. Laisse aux Blancs le temps de roquer, mais sans attaque directe."
   }
  ],
  "erreurs": [
   {
    "san": "g6",
    "pourquoi": "Trop lent : les Blancs roquent, puis Te1 cloue la colonne e sur le roi noir resté en e8. Les Noirs perdent des temps à parer la pression (Fe7, Rf8) au lieu de développer."
   },
   {
    "san": "Kd8",
    "pourquoi": "Perd le droit au roque pour rien : le roi gêne les tours et la dame. Après O-O et Te1, les Blancs attaquent la colonne e et le roi d8 reste coincé au milieu toute la partie."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -7
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3 Bc5",
  "nom": "Partie espagnole, défense berlinoise (variante des quatre cavaliers, 4...Cd4)",
  "sens": "Développe le fou sur la grande diagonale a7-g1 : avec la dame déjà en f6, les Noirs regardent f2 à deux pièces. Le but est de forcer les Blancs à régler tout de suite le sort de leur roi, puis de roquer tranquillement.",
  "menace": "Dxf2+ (ou Fxf2+) : f2 n'est défendu que par le roi, et les Noirs l'attaquent deux fois.",
  "plan": [
   {
    "san": "Qe2+",
    "pourquoi": "L'échec gagne un temps : les Noirs doivent interposer ou bouger le roi. La dame en e2 défend f2 et prépare Fe3 pour échanger le fou gênant, puis le roque. C'est le coup le plus simple pour parer la menace et développer en même temps."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'un coup : f2 est désormais défendu par la tour, et la menace sur f2 disparaît. Ensuite Fe3 chasse le fou. Les Blancs ont la paire de fous et une structure saine : ils peuvent jouer calmement."
   },
   {
    "san": "Qd2",
    "pourquoi": "Défend f2 et prépare De3 ou Fe3 pour échanger le fou c5 ; le grand roque devient aussi possible. Un peu plus lent que les deux autres, mais solide."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Semble chasser le fou, mais après Fxe3 fxe3 la structure blanche se déchire : trois pions isolés sur la colonne e et c, et la dame noire gagne un temps avec De5 en attaquant e3 et b5. Il faut d'abord protéger f2 ou roquer, et seulement ensuite jouer Fe3."
   },
   {
    "san": "Qd5",
    "pourquoi": "La dame attaque le fou c5 et b7, mais oublie f2 : Fxf2+ gagne un pion et le roi doit aller en d1, perdant le droit de roquer. Avant toute attaque, les Blancs doivent régler la menace sur f2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 8
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3 Bc5 Qe2+",
  "sens": "donne échec pour gagner un temps : la dame défend f2, qui était attaqué par le fou c5, et prépare Fe3 pour échanger ce fou, puis le roque.",
  "plan": [
   {
    "san": "Qe6",
    "pourquoi": "Interpose la dame et propose l'échange. Si les Blancs échangent, les Noirs reprennent avec le pion f, ouvrent la colonne f et développent en même temps. Sinon, les Noirs roquent tranquillement : f2 reste attaqué par le fou c5 et la position est égale."
   },
   {
    "san": "Qe7",
    "pourquoi": "Même idée : parer l'échec avec la dame sans affaiblir le roi. Après l'échange des dames, les Noirs roquent et jouent d6 ou c6 ; ils laissent aux Blancs la paire de fous mais gardent une structure saine."
   }
  ],
  "erreurs": [
   {
    "san": "Kf8",
    "pourquoi": "Le roi bouge et perd le droit de roquer. Les Blancs roquent, puis replient le fou en d3 : le roi noir reste au centre, la tour h8 ne joue pas, et les Blancs gagnent une petite avance durable."
   },
   {
    "san": "Qe5",
    "pourquoi": "Perd une pièce. Les Blancs échangent les dames, puis la tour (ou le fou) ne peut plus protéger c5 : après Dxe5 Rf8 Dxc5, le fou tombe car la dame noire a quitté la défense de la grande diagonale."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -4
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3 Bc5 Qe2+ Qe6",
  "nom": "Variante des quatre cavaliers, gambit Rubinstein",
  "sens": "Pare l'échec en interposant la dame et propose son échange : si les Blancs prennent, le pion f reprend, ouvre la colonne f et le roi noir roquera face à f2 déjà visé par le fou c5. Si les Blancs refusent, les Noirs roquent et gardent la pression.",
  "plan": [
   {
    "san": "Qxe6+",
    "pourquoi": "Échange les dames tout de suite : plus d'attaque noire contre f2 ni contre le roi blanc. Après fxe6 les Noirs ont un pion doublé sur la colonne e, mais une colonne f ouverte et un développement facile. Finale équilibrée où les Blancs ne risquent rien."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et laisse les Noirs décider. Si ...Dxe2 Fxe2, le fou revient en jeu et la structure blanche reste saine. Si les Noirs roquent, les Blancs jouent Fd3 ou Ff4 et achèvent le développement sans faiblesse."
   },
   {
    "san": "Bd2",
    "pourquoi": "Développe en protégeant la tour a1 et prépare le grand roque. Garde les dames sur l'échiquier si l'on aime jouer. Attention : il faut encore surveiller f2 tant que le fou c5 le regarde."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 8
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3 Bc5 Qe2+ Qe6 Qxe6+",
  "sens": "Échange les dames pour éteindre toute attaque noire : plus de pression sur f2, plus de roi blanc à inquiéter. La dame blanche est en prise sur e6, les Noirs doivent la reprendre tout de suite.",
  "menace": "Si les Noirs ne reprennent pas, la dame blanche reste sur e6 avec échec et dévore f7 ou c7, le roi noir est chassé et la position s'effondre.",
  "plan": [
   {
    "san": "fxe6",
    "pourquoi": "Reprend la dame, c'est le seul coup. Le pion e6 est doublé, mais il contrôle d5 et f5, et la colonne f s'ouvre pour la tour après le petit roque. Le fou c5 vise f2, les Noirs développent facilement : finale équilibrée."
   }
  ],
  "erreurs": [
   {
    "san": "Kf8",
    "pourquoi": "Laisse la dame blanche sur e6 avec une dame de plus pour les Blancs. Après De5 elle attaque le fou c5 et la case c7 : les Noirs perdent du matériel en plus, partie finie."
   },
   {
    "san": "Kd8",
    "pourquoi": "Même désastre : la dame blanche reste en vie, et après Fg5+ le roi noir est pris dans un filet. Les Noirs ont une dame de moins pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -11
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Nd4 Nxd4 exd4 e5 dxc3 exf6 Qxf6 dxc3 Bc5 Qe2+ Qe6 Qxe6+ fxe6",
  "sens": "Reprend la dame avec le pion f pour garder le matériel égal. Le pion e6 est doublé, mais il contrôle d5 et f5 et ouvre la colonne f pour la tour après le petit roque. Le fou c5 regarde toujours f2.",
  "plan": [
   {
    "san": "Bf4",
    "pourquoi": "Développe le fou sur sa meilleure diagonale en attaquant c7, qui gêne le fou c8 et le roque Noir. Prépare le grand roque pour amener la tour sur la colonne d ouverte. Les Noirs répondront ...a6 ou ...d6 ; ils ne gagnent rien."
   },
   {
    "san": "f3",
    "pourquoi": "Bouche la diagonale du fou c5 vers f2 : le roi pourra respirer et aller en f2 plus tard. Prépare Be3 pour échanger le fou actif des Noirs. Laisse aux Noirs le temps de roquer, mais la finale reste égale."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite et connecte les tours. Le fou c5 vise f2, mais la tour f1 le protège. Ensuite Bf4 ou Be3 et Rad1 : les Blancs profitent de la colonne d ouverte."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6",
  "sens": "défend le pion e5 avec le fou et libère la case f8 pour roquer ; en échange, le fou bouche le pion d7 et le fou c8 ne sort plus pour l'instant.",
  "plan": [
   {
    "san": "Ba4",
    "pourquoi": "Recule le fou avant qu'il soit chassé par a6, tout en gardant la pression sur le cavalier c6. Les Blancs restent souples : d3, O-O et Te1 suivront tranquillement."
   },
   {
    "san": "d3",
    "pourquoi": "Protège e4 et ouvre la diagonale du fou c1. Les Blancs ont fini de développer leurs pièces légères, il ne reste plus qu'à roquer : le fou noir en d6 gêne son propre camp, pas le nôtre."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Si les Noirs jouent a6, le fou ira en a4 ou prendra en c6 sans dommage. Les Blancs gardent une position saine et un développement plus fluide que l'adversaire."
   }
  ],
  "erreurs": [
   {
    "san": "Bf1",
    "pourquoi": "Rentrer le fou à la maison perd deux coups pour rien. Après O-O des Noirs puis Fc4, le fou d6 saute en b4 et cloue le cavalier c3 : les Noirs ont rattrapé leur retard et mènent la danse."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 27
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4",
  "nom": "Partie espagnole, variante des quatre cavaliers (avec le fou passif en d6)",
  "sens": "Met le fou à l'abri avant que a6 ne le chasse, tout en restant sur la diagonale a4-e8 : il continue de viser le cavalier c6, le défenseur du pion e5, et pourra encore se replier en b3 vers f7 plus tard.",
  "plan": [
   {
    "san": "Bc5",
    "pourquoi": "Corrige le coup Fd6 : en d6 le fou bloquait le pion d7 et enfermait le fou c8. En c5 il vise f2 et libère la case d6 ; le pion d pourra avancer en d6 pour tenir e5 et ouvrir le fou c8. Les Blancs joueront O-O et d3 sans gêne, mais les Noirs ont un jeu normal."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite et connecte la tour h8. Le fou d6 pourra ensuite revenir en c5 ou e7. Les Blancs continueront d3, O-O, Te1 ; rien de dangereux pour les Noirs."
   },
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou : s'il prend en c6, dxc6 ouvre la diagonale du fou c8 et les Noirs tiennent e5 sans peine. S'il recule en b3, le pion b5 pourra gagner un autre temps. Laisse aux Blancs le choix, mais oblige leur fou à se décider."
   }
  ],
  "erreurs": [
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier part à l'aventure sans but : il ne menace rien en g4, car f2 est défendu par le roi et h2 par le cavalier f3. Les Blancs roquent calmement, puis Ce2 ou h3 le renvoie d'où il vient. Résultat : deux temps perdus pendant que les Blancs terminent leur développement."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame se place devant le fou d6 : désormais ni d7 ni le fou c8 ne peuvent bouger, et la dame elle-même n'a plus de case. Après O-O O-O d3, les Noirs sont tassés sur les deux premières rangées sans plan clair. Mieux vaut d'abord replacer le fou (Fc5) ou roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -19
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5",
  "sens": "Replace le fou sur une bonne diagonale : de c5 il vise f2 et ne bloque plus le pion d7, qui pourra aller en d6 pour tenir e5 et ouvrir le fou c8.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et protège f2 avec la tour, ce qui neutralise la pression du fou c5. La tour f1 pourra ensuite soutenir le centre ; les Noirs roqueront à leur tour."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 pour de bon et ouvre la diagonale du fou c1. Le pion d3 ferme aussi la diagonale a7-g1 en partie : le fou c5 ne pourra plus mordre sur rien après Be3 ou Bg5. Les Noirs répondront d6 avec un jeu solide."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Gagne un pion un moment, mais après Nxe5 les Noirs récupèrent e4 par Nxe4 ou gagnent du temps ; le bilan reste égal. Jouable, mais inutile pour un débutant : préférer roquer d'abord."
   }
  ],
  "erreurs": [
   {
    "san": "Bb5",
    "pourquoi": "Revenir en b5 perd un temps et ne cloue plus rien d'utile. Après Nd4 le cavalier attaque le fou et pousse c2 et f3 ; si Nxe5 alors O-O et les Noirs regagnent le pion avec initiative."
   },
   {
    "san": "b3",
    "pourquoi": "Coup lent qui ne développe rien. Les Noirs jouent Nd4, le cavalier s'installe au centre, attaque le fou a4 et c2 ; après Nxe5 O-O les Blancs ont perdu du temps et leur roi traîne encore."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 25
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O",
  "sens": "Met le roi en sécurité et place la tour sur f1 : le point f2 n'est plus faible, donc le fou c5 ne gêne plus. Surtout, les Blancs préparent de prendre e5 : Cxe5 Cxe5 d4 fourchette le fou c5 et le cavalier e5, et la tour f1 n'a plus peur d'un échec sur f2.",
  "menace": "Cxe5 ! Si Cxe5, d4 attaque à la fois le fou c5 et le cavalier e5 et récupère la pièce avec un pion de plus. Autre idée : Fxc6 suivi de Cxe5, ou Cd5 qui chasse le cavalier f6, dernier défenseur de e5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Le seul bon coup. Le roi se met à l'abri et la tour f8 pourra venir sur e8 défendre le pion e5. Avec le roi roqué, la fourchette d4 après Cxe5 Cxe5 ne gagne plus rien de clair : le fou peut reculer avec tempo et le pion e5 se défend. Ensuite les Noirs jouent d6, h6 et Te8 pour tenir le centre."
   }
  ],
  "erreurs": [
   {
    "san": "Qe7",
    "pourquoi": "Semble défendre e5, mais Cd5 attaque la dame et le cavalier f6 : après Cxd5 exd5 le cavalier c6 est cloué par le fou a4 et doit bouger, et la dame e7 bouche le fou f8. Les Noirs perdent beaucoup de temps."
   },
   {
    "san": "a6",
    "pourquoi": "Chasser le fou arrive trop tard : Fxc6 dxc6 Cxe5 gagne simplement le pion e5, car le cavalier c6 qui le défendait a disparu. Il fallait d'abord mettre le roi à l'abri avec O-O."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -23
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O",
  "sens": "met le roi à l'abri et relie les tours : la tour f8 pourra venir sur e8 défendre le pion e5. Le roi roqué, la fourchette d4 après Cxe5 Cxe5 ne rapporte plus rien de net aux Blancs.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au cavalier f6 et au fou c8 : plus de clouage Fg4 contre le cavalier f3. Petit coup utile avant de pousser d3 et de sortir le fou c1. Il laisse aux Noirs le temps de jouer d6 et h6, mais la position reste tranquille."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 et ouvre la diagonale du fou c1. Le fou pourra aller en g5 clouer le cavalier f6, ou en e3 proposer l'échange du fou c5. Attention : le fou c1 n'ira pas sur la grande diagonale, il faudra choisir entre g5 et e3."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Prend le pion e5 ; après Cxe5 d4 le pion attaque le fou c5 et le cavalier e5 en même temps. Mais le fou recule en d6 et défend le cavalier : les Blancs récupèrent le pion sans gain net. Position égale et ouverte, à ne jouer que si on aime calculer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 26
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3",
  "sens": "Retire la case g4 au cavalier f6 et au fou c8 : plus de clouage Fg4 sur le cavalier f3. Petit coup d'attente avant d3 et la sortie du fou c1.",
  "plan": [
   {
    "san": "d6",
    "pourquoi": "Soutient le pion e5 et ouvre la diagonale du fou c8. Prépare h6 puis Fe6 ou Cd4. Laisse aux Blancs d3 et un jeu calme, sans rien concéder."
   },
   {
    "san": "Re8",
    "pourquoi": "La tour vient derrière le pion e5 pour le protéger et viser e4. Le cavalier f6 peut alors bouger sans que e5 tombe. Prépare aussi un éventuel d5 plus tard."
   },
   {
    "san": "h6",
    "pourquoi": "Même idée que h3 : enlève g5 au cavalier f3 et au fou c1, donc pas de clouage Fg5 sur le cavalier f6. Coup tranquille qui laisse aux Blancs le temps de jouer d3 et Fe3."
   }
  ],
  "erreurs": [
   {
    "san": "Bd6",
    "pourquoi": "Le fou revient en d6 et bloque son propre pion d7 : le fou c8 reste enfermé et le centre noir ne peut plus s'ouvrir. Après d3 Te8 Te1, les Blancs terminent leur développement avec un net avantage d'espace, pendant que les Noirs ont perdu deux temps avec le fou."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -20
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6",
  "sens": "Consolide le centre : le pion e5 est désormais tenu par un pion, le fou c8 respire. Les Noirs annoncent un jeu calme, avec h6 puis Fe6 ou Cd4 en vue.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Prend le cavalier qui défend e5 avant que les Noirs ne le chassent. Après bxc6, les Noirs ont deux pions doublés sur la colonne c : les Blancs peuvent ensuite jouer d3 et viser le pion e5 avec Ca4 contre le fou c5. Petit mais réel avantage de structure."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 et libère le fou c1. Coup solide qui garde la tension : les Blancs pourront ensuite choisir entre Fe3 (pour échanger le fou c5) ou Fg5. Laisse aux Noirs un jeu égal mais sans contre-jeu facile."
   },
   {
    "san": "a3",
    "pourquoi": "Donne au fou c5 moins de place en préparant b4 : les Noirs devront reculer ou échanger. Un peu lent, mais il prépare aussi une case de repli en a2 pour le fou a4."
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "Sortie précoce du cavalier, qui ne menace rien de réel : f7 est défendu par la tour. Les Noirs répondent Ce7 puis h6, et le cavalier doit rebrousser chemin. Perte de temps et affaiblissement du roi blanc."
   },
   {
    "san": "Ne1",
    "pourquoi": "Recule le cavalier pour préparer f4, mais le moment est mal choisi : les Noirs jouent Ce7 et c6, chassent le fou a4 et prennent l'initiative au centre, pendant que les Blancs se désorganisent."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6",
  "sens": "Prend le cavalier qui défend e5 avant qu'il ne soit chassé. Après la reprise par le pion b, les Noirs auront deux pions doublés sur la colonne c : les Blancs veulent ensuite jouer d3 puis Ca4 pour harceler le fou c5 et viser e5.",
  "menace": "Le fou c6 est en prise mais il vaut plus que le cavalier perdu : si les Noirs ne reprennent pas tout de suite, il recule en b5 ou a4 et les Blancs restent avec une pièce de plus.",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "Le seul coup. Reprend la pièce immédiatement : matériel égal. Les pions c7 et c6 sont doublés, c'est un petit défaut, mais le pion c6 contrôle d5 et la colonne b s'ouvre pour la tour. Les Noirs gardent une position jouable."
   }
  ],
  "erreurs": [
   {
    "san": "Bxh3",
    "pourquoi": "Tentation classique : le fou prend un pion près du roi blanc. Mais le fou c6 n'est pas repris ! Les Blancs jouent Fb7 puis Fxa8 : ils gagnent une tour entière en plus du cavalier déjà pris. Toujours reprendre d'abord, attaquer ensuite."
   },
   {
    "san": "Bd4",
    "pourquoi": "Le fou attaque c3 et on se dit que l'échange compensera. Non : les Blancs sauvent leur fou par Fb5, puis après Fxc3 bxc3 ils ont une pièce de plus pour rien. Ne jamais laisser une pièce en prise pour une contre-attaque qui ne gagne rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6 bxc6",
  "sens": "reprend la pièce avec le pion b pour garder le matériel égal : le pion c6 contrôle d5, la colonne b s'ouvre pour la tour, et la paire de fous reste aux Noirs.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Pousse au centre avec un pion défendu par le cavalier f3 et attaque le fou c5. Les Noirs doivent répondre (…exd4 ou …Fb6), et les Blancs gagnent de l'espace. Laisse aux Noirs la paire de fous, mais ouvre la position pour les cavaliers."
   },
   {
    "san": "Re1",
    "pourquoi": "Protège e4 une deuxième fois avec la tour. Ainsi …d5 ne gagne rien au centre, et d2-d4 sera possible ensuite sans souci. Coup calme : les Noirs ont le temps de jouer …Te8 ou …Fb6."
   },
   {
    "san": "d3",
    "pourquoi": "Défend e4 solidement et libère le fou c1. Les Blancs gardent la structure fermée, où les pions doublés c6-c7 gêneront les Noirs à long terme. Moins ambitieux que d4, mais sans risque."
   }
  ],
  "erreurs": [
   {
    "san": "Kh2",
    "pourquoi": "Un coup de roi inutile qui perd un temps. Les Noirs jouent …d5 ! et le centre explose : après Cxe5 dxe4 le pion e4 tombe, le cavalier f3 est chassé et le fou d6 attaque e5. Les Noirs prennent l'initiative avec leurs deux fous."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6 bxc6 d4",
  "sens": "Pousse au centre avec un pion défendu par le cavalier f3 et attaque le fou c5. Les Noirs doivent répondre (…exd4 ou …Fb6), et les Blancs gagnent de l'espace. Laisse aux Noirs la paire de fous, mais ouvre la position pour les cavaliers.",
  "menace": "dxc5 : le pion d4 prend le fou c5, qui n'est protégé que par le pion d6 et doit bouger ou être échangé.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Prend le pion qui attaque le fou. Si Cxd4, le fou c5 reste sur sa belle diagonale et peut même reprendre en d4 plus tard. Les Noirs gardent une structure saine et ouvrent la colonne e pour la tour."
   },
   {
    "san": "Bb4",
    "pourquoi": "Le fou s'écarte en clouant le cavalier c3, ce qui gêne la défense de e4. Le pion e5 reste à prendre, mais après dxe5 dxe5 Cxe5 le fou b4 reste actif. Laisse aux Blancs un peu plus d'espace au centre."
   }
  ],
  "erreurs": [
   {
    "san": "Bb6",
    "pourquoi": "Le fou recule, mais le pion e5 est perdu : dxe5 dxe5 Cxe5 et les Blancs ont gagné un pion sans rien donner."
   },
   {
    "san": "Nxe4",
    "pourquoi": "Prend un pion mais oublie le fou : après Cxe4 Fb6 dxe5, les Noirs ont perdu un cavalier pour un pion. Toujours regarder quelle pièce est attaquée avant de capturer ailleurs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6 bxc6 d4 exd4",
  "sens": "Capture le pion d4 qui attaquait le fou c5. Le fou reste actif sur la diagonale a7-g1 et la colonne e s'ouvre pour la tour f8. Le pion d4 noir attaque maintenant le cavalier c3.",
  "menace": "dxc3, gagnant un cavalier entier : le pion d4 attaque le cavalier c3 et personne ne le défend bien.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le pion avec le cavalier et supprime l'attaque sur c3. Le cavalier se centralise en d4 et attaque le pion c6 affaibli. Si ...Bxd4, les Blancs reprennent avec la dame et obtiennent une position équilibrée avec un centre solide."
   }
  ],
  "erreurs": [
   {
    "san": "Na4",
    "pourquoi": "Sauve le cavalier mais oublie le centre : après ...Nxe4, les Noirs gagnent le pion e4 et le cavalier a4 reste mal placé au bord. Le pion d4 noir reste fort au centre."
   },
   {
    "san": "Re1",
    "pourquoi": "Développe la tour mais ignore la menace : ...dxc3 prend le cavalier gratuitement. Même b4 pour chasser le fou ne récupère rien, car ...Bxb4 gagne encore un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 14
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6 bxc6 d4 exd4 Nxd4",
  "sens": "reprend le pion en centralisant le cavalier : il échappe à la menace sur c3 et vise le pion c6, isolé depuis l'échange en c6.",
  "menace": "Cxc6, qui gagne le pion c6 que rien ne défend.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "Place la tour face au pion e4 au lieu de défendre passivement. Si Cxc6, la dame va en d7, chasse le cavalier et le fou prend en d4 : la tour reprend alors e4 et le compte est bon. Les Noirs gardent la paire de fous et un jeu actif."
   },
   {
    "san": "Bd7",
    "pourquoi": "Défend simplement c6 et développe le fou. Il prépare ...Te8 ou ...De7 contre e4. Les Blancs gardent un centre solide mais sans cible."
   },
   {
    "san": "Bxd4",
    "pourquoi": "Élimine le cavalier central avant qu'il ne prenne c6. Après Dxd4, les Noirs continuent par ...Te8 ou ...Fe6. En échange, ils cèdent leur bon fou et la dame blanche trône en d4."
   }
  ],
  "erreurs": [
   {
    "san": "Kh8",
    "pourquoi": "Coup de roi inutile qui ne défend rien et perd un temps. Les Blancs jouent Te1 puis Fg5 : la pression sur f6 et e4 s'installe, et c6 reste faible."
   },
   {
    "san": "a6",
    "pourquoi": "Perd un temps sur l'aile alors que c6 est menacé. Les Blancs sortent Fg5, attaquent le cavalier f6 et gagnent du terrain au centre. Les Noirs doivent défendre deux points à la fois."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -13
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 Nc3 Bd6 Ba4 Bc5 O-O O-O h3 d6 Bxc6 bxc6 d4 exd4 Nxd4 Re8",
  "sens": "Pointe la tour sur le pion e4, qui n'est défendu que par le cavalier c3. Les Noirs veulent prendre deux fois sur e4 ou échanger en d4 pour libérer la colonne.",
  "menace": "Cxe4 : après Cxe4 Txe4, les Noirs gagnent le pion e4 gratuitement.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Défend e4 une deuxième fois avec la tour : Cxe4 ne marche plus. Le roi reste à l'abri et la tour entre dans le jeu sur la colonne centrale."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame : s'il prend en e4, Fxd8. Développe le fou avec tempo, mais il faudra surveiller h6 et les échanges sur f6."
   },
   {
    "san": "Qd3",
    "pourquoi": "Protège e4 et relie les tours. La dame surveille aussi c4 et le fou c5. Simple et solide, mais laisse aux Noirs le temps de jouer Fb7 ou d5."
   }
  ],
  "erreurs": [
   {
    "san": "Kh1",
    "pourquoi": "Un coup d'attente qui ignore la menace : Cxe4 Cxe4 Txe4 et les Noirs ont gagné le pion central pour rien."
   },
   {
    "san": "e5",
    "pourquoi": "Pousser le pion attaqué semble malin, mais après dxe5 Cxc6 Dxd1 les Blancs perdent leur dame contre tour : les cavaliers ne gardent plus d1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5",
  "nom": "Défense Bird (variante 4.Fa4)",
  "sens": "développe le fou sur la diagonale a7-g1, braquée sur f2, et soutient le cavalier avancé en d4 : si on le prend, exd4 et le pion est défendu par le fou. Les Noirs sont prêts à roquer et gardent c7-c6 pour chasser le fou a4.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Échange le cavalier intrus. Après exd4, le pion noir en d4 est isolé et avancé : on le mettra sous pression avec c3, et le cavalier noir n'a plus sa case d4. Les Noirs gardent la paire de fous, c'est le prix à payer."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque le cavalier d4 tout de suite. Il doit prendre en f3 (Dxf3 recentre la dame) ou reculer. Prépare d4 pour ouvrir le centre et fermer la diagonale du fou c5. Attention : c3 enlève la case c3 au cavalier b1."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'agir. f2 est désormais défendu par la tour f1. On décidera ensuite entre Cxd4 et c3 selon ce que font les Noirs. Laisse aux Noirs le temps de jouer c6 et d5."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "Gagne un pion mais le perd aussitôt : De7 attaque le cavalier e5, qui n'a pas de bonne case. S'il recule en f3, Cxf3+ gxf3 Dxe4+ casse l'aile roi blanche. Les Blancs se retrouvent en retard de développement pour rien."
   },
   {
    "san": "Nc3",
    "pourquoi": "Sort une pièce mais sur une case qui bloque le pion c2. Les Noirs répondent c6 puis d5 : le fou a4 est encerclé, le cavalier d4 reste intouchable car c3 est impossible. Le plan naturel des Blancs (c3 et d4) ne marche plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 40
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4",
  "nom": "Défense Bird (3...Cd4) de la Partie espagnole",
  "sens": "Élimine le cavalier gênant installé en d4 : le fou revient ensuite en liberté, et selon la reprise noire, soit le pion d4 sera isolé, soit le fou en d4 sera chassé par c3. Les Blancs acceptent de laisser aux Noirs la paire de fous.",
  "menace": "Les Blancs ont une pièce de plus : si les Noirs ne reprennent pas tout de suite en d4, le cavalier s'échappe par f3 et l'avantage matériel reste.",
  "plan": [
   {
    "san": "Bxd4",
    "pourquoi": "Reprend avec le fou : la structure de pions reste saine (pas de pion isolé) et le fou en d4 est très actif, il vise f2. Les Blancs vont le chasser par c3, mais il reculera en b6 sans perdre de temps réel."
   },
   {
    "san": "exd4",
    "pourquoi": "La reprise naturelle : le pion d4 gêne les Blancs (plus de cavalier en c3, d2-d3 seulement). Mais il est isolé et avancé, les Blancs vont l'attaquer par c3, il faudra le soutenir ou l'échanger."
   },
   {
    "san": "Qh4",
    "pourquoi": "Coup intermédiaire : la dame attaque e4 et vise f2 avec le fou c5. Sur 6.Cf3 Dxe4+, les Noirs ont repris leur pièce. Plus compliqué, à réserver quand on connaît bien la suite."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Oublie de reprendre la pièce : après 6.Cf3, le cavalier blanc est sauvé et les Blancs ont un cavalier de plus pour rien. Même 6...Cxe4 7.0-0 ne récupère rien de sérieux."
   },
   {
    "san": "Qg5",
    "pourquoi": "Sort la dame trop tôt sans reprendre en d4 : 6.Cf3 attaque la dame en gagnant du temps, et sur 6...Dxg2 7.Tf1 la dame est en danger alors que les Blancs gardent leur pièce de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "Reprend avec le fou pour garder une structure de pions saine (pas de pion isolé en d4) et placer le fou au centre, où il vise le point faible f2.",
  "menace": "Aucune menace directe : Fxf2+ ne marche pas encore (Rxf2 gagne le fou). Mais le fou en d4 gêne le roque et prépare Dh4 ou Cf6 pour appuyer sur f2.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Chasse tout de suite le fou du centre. Il doit reculer en b6, et les Blancs gagnent le temps nécessaire pour jouer d4 ensuite et prendre tout le centre. Attention : ne pas jouer c3 trop tard, sinon le fou s'installe."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant toute chose. Le pion f2 est alors défendu par la tour f1, et le fou d4 n'a plus de cible. Les Blancs joueront c3 au coup suivant."
   },
   {
    "san": "d3",
    "pourquoi": "Solidifie e4 et ouvre la diagonale du fou c1, qui pourra aller en e3 pour échanger le fou noir actif. Plus calme que c3 : les Noirs ont le temps de jouer Cf6 et de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Qh5",
    "pourquoi": "Sortir la dame tôt pour attaquer e5 et f7 est une tentation classique. Mais les Noirs répondent c6 : la dame n'attaque rien de réel, le fou a4 est menacé de recul forcé, et après Cf6 la dame doit encore bouger. Les Blancs perdent plusieurs temps pour rien."
   },
   {
    "san": "a3",
    "pourquoi": "Donne une case de repli au fou en a2, mais c'est un coup de pion inutile : il ne développe rien et ne touche pas le fou d4. Les Noirs jouent Cf6 puis roquent et sont en avance de développement. Le fou doit être chassé par c3, pas protégé par a3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3",
  "nom": "Variante Bird de la Partie espagnole",
  "sens": "Attaque le fou avec un pion : il n'a qu'une seule case de repli sûre, b6, et les Blancs gagnent un temps pour pousser d4 et s'emparer du centre.",
  "menace": "cxd4, gagnant le fou pour un simple pion.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Le seul bon coup. Le fou se met à l'abri sur la diagonale a7-g1, d'où il vise toujours f2. Les Noirs cèdent un peu le centre (d4 arrive), mais restent solides et développent ensuite avec c6, Cf6 ou Dh4 selon le cas."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développer en ignorant l'attaque est l'erreur classique : après cxd4 exd4 d3, les Blancs ont gagné un fou contre un pion. Avant de développer, il faut d'abord sauver la pièce attaquée."
   },
   {
    "san": "Bxf2+",
    "pourquoi": "Le sacrifice tentant ne mène à rien : après Rxf2 Dh4+ g3, la dame est repoussée et les Noirs ont donné un fou pour un pion sans attaque réelle. Un échec n'est pas une attaque gagnante par lui-même."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -36
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6",
  "nom": "Variante Bird (défense Bird de l'Espagnole)",
  "sens": "Retire le fou de la case attaquée par le pion c3 tout en gardant la diagonale a7-g1 : le fou continue de viser f2. Les Noirs acceptent que d4 vienne prendre le centre, mais conservent leur paire de fous.",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "Prend le centre tout de suite avec le soutien du pion c3. Le pion d4 bloque la diagonale du fou b6 et libère le fou c1. Si ...exd4, cxd4 et les Blancs ont un centre e4-d4 solide. Les Noirs répondront souvent ...c6 et ...Cf6 pour contester."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre : le fou b6 vise f2, donc roquer d'abord est prudent. d4 viendra au coup suivant, mais les Noirs ont le temps de jouer ...c6 ou ...Dh4 pour s'opposer."
   },
   {
    "san": "d3",
    "pourquoi": "Coup modeste : soutient e4 et ouvre le fou c1 sans ouvrir le jeu. Moins ambitieux que d4, mais sans risque. Les Noirs égalisent plus facilement avec ...c6 et ...Cf6."
   }
  ],
  "erreurs": [
   {
    "san": "Qg4",
    "pourquoi": "Sort la dame trop tôt pour viser g7. Après ...Cf6 le cavalier attaque la dame en se développant : elle doit reculer (De2) et les Blancs ont perdu deux temps. Les Noirs roquent et sont déjà mieux développés."
   },
   {
    "san": "Qf3",
    "pourquoi": "Même défaut : la dame prend la case du cavalier et n'attaque rien de concret. Après ...Ce7 et ...O-O, les Noirs sont en avance de développement et le fou b6 continue de viser f2, ce qui gêne le roque des Blancs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 28
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4",
  "nom": "Variante Bird (défense Bird de l'Espagnole)",
  "sens": "Occupe le centre avec le soutien du pion c3 : attaque le pion e5, ferme la diagonale du fou b6 et ouvre la sortie du fou c1.",
  "menace": "dxe5 gagne le pion e5, qui n'est plus défendu depuis que le cavalier c6 a disparu.",
  "plan": [
   {
    "san": "exd4",
    "pourquoi": "Prend le pion attaqué avant qu'il ne prenne e5. Après cxd4 les Blancs ont le centre, mais le fou b6 presse d4 et les Noirs vont jouer ...Cf6, ...d6 et ...O-O pour le contester. C'est le coup le plus simple et le plus solide."
   },
   {
    "san": "Qh4",
    "pourquoi": "Défend e5 en attaquant e4 et f2 : les Blancs doivent réagir (O-O, Dd3 ou dxe5). La dame sort tôt, elle peut être chassée par Cd2-f3 : il faut accepter ce risque. Plus compliqué qu'exd4."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe une pièce en gardant la case d5 et prépare ...O-O. Le pion e5 est abandonné après dxe5, mais ...O-O et ...d6 le récupèrent souvent avec un développement rapide. Pour un débutant, exd4 reste plus clair."
   }
  ],
  "erreurs": [
   {
    "san": "c6",
    "pourquoi": "Oublie que e5 est attaqué. dxe5 gagne un pion net ; le fou b6 doit reculer en c7 et Ff4 consolide le pion de plus. Un coup trop lent face à une menace directe."
   },
   {
    "san": "f6",
    "pourquoi": "Défend e5 mais affaiblit la diagonale a2-g8 et la case e6. Après O-O et dxe5, le roi noir reste au centre, incapable de roquer tranquillement, et les Blancs ouvrent les lignes. Perd l'équivalent d'un pion et demi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -35
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4",
  "nom": "Défense Bird (variante 3...Cd4)",
  "sens": "Prend le pion d4 qui attaquait e5, avant de perdre son propre pion central. Le pion d4 noir est condamné, mais les Noirs vont s'appuyer sur le fou b6 pour harceler le centre blanc.",
  "menace": "Menace de prendre un deuxième pion par ...dxc3, avec un pion de plus et un centre blanc en ruine.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Reprend le pion tout de suite et installe deux pions au centre, e4 et d4. Les Blancs ont plus d'espace. En échange, le fou b6 vise d4 : il faudra protéger ce pion (Fe3, Cc3) et ne pas le laisser tomber."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord et reprend en d4 au coup suivant. Si les Noirs prennent en c3, le cavalier b1 reprend en se développant. Un peu moins direct que cxd4, mais tout aussi sain."
   }
  ],
  "erreurs": [
   {
    "san": "e5",
    "pourquoi": "Pousse un pion déjà avancé sans reprendre d4. Après ...Ce7 puis cxd4 et ...O-O, le pion e5 est fragile, le centre blanc est troué en d5 et f5, et les Noirs ont le temps de tout développer."
   },
   {
    "san": "Bd2",
    "pourquoi": "Trop lent et le fou est mal placé. Les Noirs répondent ...Dh4 : la dame attaque e4 et f2 d'un coup, et après O-O le pion ...d3 devient une écharde qui gêne tout le développement blanc."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4",
  "nom": "Défense Bird (variante Cc6-d4)",
  "sens": "Reprend le pion et dresse deux pions au centre, e4 et d4 : les Blancs gagnent de l'espace et préparent Cc3 et Fe3 pour tout consolider.",
  "menace": "Pas de menace immédiate, mais d4-d5 arrive bientôt : le pion avancerait en gagnant du temps et enfermerait le fou b6.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans se mettre devant le pion f : il surveille d5 et prépare le petit roque. Si d4-d5, le cavalier est déjà bien placé et le fou b6 pourra pousser c6 ou d6 pour respirer."
   },
   {
    "san": "Qf6",
    "pourquoi": "Attaque d4 une deuxième fois avec le fou b6 : les Blancs doivent défendre tout de suite (Fe3 ou Cc3-e2). La dame sort tôt, elle devra ensuite reculer, mais elle gêne le développement blanc."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Le coup le plus naturel, mais e4-e5 chasse le cavalier aussitôt : après Cd5, Cc3 le chasse encore. Les Noirs perdent du temps et les Blancs étouffent la position avec leurs pions centraux."
   },
   {
    "san": "Nh6",
    "pourquoi": "Le cavalier sur le bord se fait prendre par Fxh6 : les pions g et h sont doublés et le roi noir n'aura plus d'abri sûr."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4 Ne7",
  "nom": "Variante Bird (défense du cavalier d4)",
  "sens": "sort le cavalier sans bloquer le pion f et sans s'exposer au pion d : il garde d5 et laisse le roi roquer vite.",
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier e7 sur la dame et gêne le roque : les Noirs doivent répondre à la pression avant de pousser d5. Le fou b6 reste un spectateur tant que le centre blanc tient."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe en couvrant d5 et e4 : si les Noirs poussent d5 pour libérer leur jeu, le cavalier est déjà là pour contester la case. Prépare aussi d4-d5 au bon moment."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant d'ouvrir le centre. Laisse aux Noirs le temps de roquer eux aussi, mais les Blancs gardent le centre et une avance de développement."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "Le fou vise c7 mais ne fait rien d'utile : après O-O puis d5, les Noirs cassent le centre, le pion d4 est attaqué par le fou b6 et le fou f4 ne défend rien. Les Blancs ont perdu le tempo qui donnait l'avantage."
   },
   {
    "san": "h3",
    "pourquoi": "Coup de précaution inutile : rien ne menace g4. Les Noirs roquent et poussent d5, le centre s'ouvre alors que les Blancs sont en retard d'un coup de développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4 Ne7 Bg5",
  "nom": "Variante Bird",
  "sens": "cloue le cavalier e7 sur la dame d8 et empêche le roque de se préparer tranquillement : les Noirs doivent gérer la pression avant de pousser d5. Tant que le centre blanc tient, le fou b6 ne fait rien.",
  "menace": "Fxe7 pour échanger le fou contre le cavalier et laisser le roi noir sans développement, puis d5 et Cc3 pour écraser le centre.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri tout de suite : le cavalier e7 n'est plus cloué sur la dame et peut bouger. Les Noirs préparent d5 ou c6 sans crainte. Les Blancs gardent un peu d'avance au centre, mais rien de plus."
   },
   {
    "san": "f6",
    "pourquoi": "chasse le fou g5 d'un coup de pion : il doit reculer (Ff4 ou Fe3) et le clouage disparaît. Attention : f6 affaiblit un peu la case e6 et la diagonale du roi, donc il faut roquer vite ensuite."
   },
   {
    "san": "h6",
    "pourquoi": "pose la question au fou : s'il prend en e7, la dame reprend et les Noirs n'ont rien perdu ; s'il recule en h4, le clouage reste mais h6 sera utile plus tard pour chasser avec g5."
   }
  ],
  "erreurs": [
   {
    "san": "Kf8",
    "pourquoi": "déclouer en déplaçant le roi coûte le droit de roquer pour toujours. Après Cc3 et f6, le fou recule en f4 et le roi noir reste au milieu, sans tour active : les Blancs ont le temps d'attaquer."
   },
   {
    "san": "c5",
    "pourquoi": "attaque le centre trop tôt : d5 ! ferme la position, le fou b6 est repoussé en a5 et le cavalier e7 n'a plus de case. Avec Cc3, les Blancs dominent tout le centre et les Noirs restent cloués."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -32
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4 Ne7 Bg5 O-O",
  "nom": "Partie espagnole, défense Bird",
  "sens": "met le roi à l'abri et libère le cavalier e7 du clouage sur la dame : il pourra aller en g6 ou c6, et les Noirs préparent d5 ou c6 sans crainte.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "développe le dernier cavalier et surprotège e4 : si les Noirs jouent d5, les Blancs ont déjà assez de pièces au centre. Le roi roquera au coup suivant. Les Noirs répondront d6 ou h6, mais les Blancs gardent un centre plus large."
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi en sécurité avant toute ouverture du centre. Un peu moins précis que Nc3, car les Noirs peuvent jouer d5 tout de suite et égaliser ; mais aucun danger pour les Blancs."
   }
  ],
  "erreurs": [
   {
    "san": "Bb3",
    "pourquoi": "coup lent qui ne développe rien de nouveau : après h6 Fh4 d5, les Noirs ouvrent le centre alors que le roi blanc est encore au milieu et le cavalier b1 chez lui. L'avance au centre disparaît."
   },
   {
    "san": "f3",
    "pourquoi": "veut protéger e4 avec un pion, mais affaiblit le roi et la diagonale g1-a7 où regarde déjà le fou b6. Après d5 Cc3 dxe4, le centre s'ouvre contre un roi blanc non roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 38
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4 Ne7 Bg5 O-O Nc3",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "sort la dernière pièce et prépare Cd5 : de là, le cavalier attaquerait le cavalier e7, cloué par le fou g5 devant la dame, et le fou b6. Le roi roquera ensuite.",
  "menace": "Cd5, qui attaque le cavalier e7 (gêné par le clouage du fou g5) et le fou b6 en même temps.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "chasse tout de suite le fou g5 et casse le clouage sur e7. Le cavalier redevient libre et Cd5 ne gagne plus rien. Le pion f6 ouvre un peu la diagonale vers le roi noir, mais les Blancs n'ont pas de pièce pour en profiter."
   },
   {
    "san": "d6",
    "pourquoi": "ouvre la sortie du fou c8 et freine la poussée e5. Les Noirs rattrapent leur retard de développement, mais le fou g5 reste collé au cavalier e7."
   },
   {
    "san": "h6",
    "pourquoi": "pose la question au fou g5 : il doit se décider (Fh4 ou Fe3). Le coup gagne du temps, sans rien développer : il faudra ensuite jouer d6 ou f6."
   }
  ],
  "erreurs": [
   {
    "san": "d5",
    "pourquoi": "semble logique pour ouvrir le centre, mais c'est exactement ce que le dernier coup blanc attendait : Cxd5 prend le pion, et le cavalier attaque e7 et b6. Après f6, Cxb6 gagne le fou. Un pion et une pièce de perdus."
   },
   {
    "san": "c5",
    "pourquoi": "veut casser le centre blanc, mais dxc5 Fxc5 déplace le fou, puis le roque blanc et Fxe7 gagnent une pièce : le cavalier e7 est toujours cloué et plus rien ne le défend. Il faut d'abord régler le fou g5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxd4 Bxd4 c3 Bb6 d4 exd4 cxd4 Ne7 Bg5 O-O Nc3 f6",
  "nom": "Partie espagnole, défense Bird (3...Cd4)",
  "sens": "chasse le fou g5 et casse le clouage sur e7 : le cavalier redevient libre et Cd5 ne gagne plus rien. En échange, la diagonale a2-g8 vers le roi noir s'entrouvre un peu.",
  "menace": "prendre le fou g5 avec le pion f6 (fxg5)",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "recule le fou en protégeant le pion d4 et en s'opposant au fou b6 sur la diagonale. Les Blancs gardent le centre e4-d4 et préparent O-O puis Fb3+ au bon moment. Les Noirs vont jouer ...d5 ou ...d6 pour libérer leur jeu."
   },
   {
    "san": "Bf4",
    "pourquoi": "recule le fou sur une case active : il vise c7 et la colonne e, et empêche ...d6 confortable. Le pion d4 reste défendu par la dame. Les Noirs répondront ...d5 pour attaquer e4."
   },
   {
    "san": "Bb3+",
    "pourquoi": "profite tout de suite de la diagonale ouverte par f6 : après ...Rh8 (ou ...d5), le fou est bien placé et les Blancs reculent ensuite le fou g5. L'échec ne gagne rien mais force le roi noir à se décider."
   }
  ],
  "erreurs": [
   {
    "san": "Bxf6",
    "pourquoi": "le fou disparaît pour un simple pion : après ...Txf6 les Noirs ont une pièce de plus et une tour active sur la colonne f. Puis ...d5 ouvre le jeu alors que les Blancs sont en retard de développement."
   },
   {
    "san": "Qh5",
    "pourquoi": "la dame sort trop tôt en espérant un mat sur h7 : les Noirs jouent simplement ...fxg5 et gagnent le fou, car la dame seule n'attaque rien. Sortir la dame avant de sauver la pièce attaquée coûte une pièce entière."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 31
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3",
  "nom": "Partie espagnole, système d3-c3 (variante lente)",
  "sens": "Soutient la future poussée d4 avec le pion c et offre une retraite en c2 au fou b5, qui ne pourra plus être échangé contre le cavalier c6 après a6.",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit reculer en a4 ou se replier. Les Noirs gagnent du temps et préparent b5 pour chasser le fou encore plus loin. Rien n'est cédé au centre."
   },
   {
    "san": "g6",
    "pourquoi": "Prépare Fg7, un fou solide sur la grande diagonale qui surveille d4 et protège le roi après le petit roque. Le fou f8 ne gêne plus le roque. En contrepartie, les Blancs gardent leur plan d4 sans être pressés."
   },
   {
    "san": "Be7",
    "pourquoi": "Développement simple : le fou sort, le petit roque suit. Le fou défend aussi le cavalier f6 et la case d6. Le défaut : il reste passif et laisse les Blancs choisir le moment de d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -30
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6",
  "nom": "Espagnole, variante d'échange différée / système avec d3 et c3",
  "sens": "Attaque le fou b5 avec un pion : il doit partir ou se faire prendre. Le coup gagne du temps, prépare b5 pour chasser encore le fou, et ne cède rien au centre.",
  "menace": "Prendre le fou en b5 avec le pion a6.",
  "plan": [
   {
    "san": "Ba4",
    "pourquoi": "Le fou recule mais garde la pression sur le cavalier c6 et donc indirectement sur e5. Si les Noirs jouent b5, il se replie en c2 ou b3, bien placé vers f7. Les Blancs conservent leur pièce et une position solide."
   },
   {
    "san": "Bxc6+",
    "pourquoi": "Prend le cavalier avant de reculer. Après bxc6, les pions noirs sont doublés et un peu affaiblis, mais les Noirs ont deux fous et le centre ouvert : c'est jouable, mais moins ambitieux que Fa4."
   },
   {
    "san": "Bc4",
    "pourquoi": "Le fou se replie sur une case active visant f7 et d5. Il reste exposé à d5 ou Ca5 plus tard, mais il garde un rôle direct dans l'attaque."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer ignore la menace : b5 prend le fou. Après b5, il n'y a plus de bonne case et les Blancs perdent une pièce entière pour rien."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Le cavalier croit gagner un pion mais le fou b5 est toujours attaqué. Après b5, le cavalier doit prendre en c6 et le fou tombe : une pièce perdue contre deux pions au mieux."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 24
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4",
  "nom": "Partie espagnole, variante berlinoise avec d3 (système lent avec c3)",
  "sens": "Sauve le fou attaqué en gardant le clouage de c6 : il continue de viser le cavalier qui défend e5, et depuis a4 il peut rejoindre c2 ou b3 pour regarder f7.",
  "plan": [
   {
    "san": "g6",
    "pourquoi": "Prépare Fg7 : le fou sera très solide devant le roi et appuiera e5 de loin. Les Noirs rejoignent une structure sûre et gardent toutes les options au centre. Les Blancs peuvent continuer calmement par O-O et Te1."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse encore le fou vers b3 ou c2 avec gain de temps et prend de l'espace à l'aile dame. Attention : les pions avancés peuvent devenir une cible plus tard (a4 des Blancs)."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe simplement et prépare le roque. Le fou protège d6 et le roi sera vite en sécurité. C'est le coup le plus classique dans l'espagnole."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6",
  "nom": "Partie espagnole, variante Berlin avec d3 (fianchetto noir)",
  "sens": "Prépare le fianchetto du fou en g7 : il protégera le roi après le roque et soutiendra e5 de loin. Les Noirs choisissent une structure solide et flexible, sans fixer le centre tout de suite.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'agir au centre. Prépare Te1 pour renforcer e4, puis d4 au bon moment. Ne presse rien : les Noirs vont roquer aussi, et la lutte pour d4 et d5 commencera ensuite."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier sans bloquer le pion c3 : il vise f1 puis g3 ou e3, le grand classique de l'espagnole. Le fou c1 reste un peu enfermé un moment, c'est le prix à payer."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou et au cavalier noirs, pour que Fe3 ou d4 ne soient pas gênés par un clouage. Petit coup prudent qui garde toutes les options."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 21
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O",
  "sens": "Met le roi en sécurité et relie les tours. Les Blancs n'ont rien de pressé : ils préparent Te1 pour soutenir e4, puis d4 quand tout est prêt.",
  "plan": [
   {
    "san": "Bg7",
    "pourquoi": "Termine le fianchetto commencé par g6. Le fou surveille la grande diagonale et renforce e5 et d4. Il permet surtout de roquer au coup suivant : c'est le coup logique et sans risque."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou et protège le cavalier c6, qui n'est plus cloué par Fa4. Le roque pourra suivre après Fg7. Laisse aux Blancs un peu de temps, mais sans leur donner de cible."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou a4 vers b3 et prend de l'espace à l'aile dame. Attention : les pions a6 et b5 ne pourront plus reculer et deviendront une cible si on en abuse plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "a5",
    "pourquoi": "Un coup de pion inutile : il ne développe rien et ne menace rien. Les Blancs répondent 8.d4 et ouvrent le centre alors que le roi noir n'a pas roqué et que le fou f8 n'est pas sorti. Chaque temps perdu compte dans la lutte pour d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -22
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7",
  "sens": "Achève le fianchetto : le fou prend la grande diagonale, soutient le centre e5 et prépare le roque immédiat.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou et au cavalier noirs. Le cavalier f3 ne sera plus harcelé et le pion d4 pourra être poussé tranquillement. Les Noirs vont roquer, rien de pressé pour eux non plus."
   },
   {
    "san": "Re1",
    "pourquoi": "La tour protège e4 avant de jouer d4. Si les Noirs roquent et jouent ...Cd7, le centre blanc reste solide. Coup de développement sans risque."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier vers f1 puis e3 ou g3, chemin typique de l'Espagnole. Il garde aussi e4. Attention : il bloque un instant le fou c1, il faudra le libérer ensuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 24
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3",
  "nom": "Espagnole, variante d'échange différée refusée / système Fianchetto noir (3...Cf6 4.d3 d6 avec g6)",
  "sens": "Retire la case g4 au fou c8 et au cavalier f6 : le cavalier f3 ne sera plus cloué ni chassé, et les Blancs pourront préparer d4 sans gêne. C'est un coup lent, les Noirs ont le temps de finir leur développement.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri derrière le fou g7 et connecte les tours. C'est le coup le plus naturel : le développement est fini, les Noirs pourront ensuite jouer Te8, Fd7 ou b5 selon ce que font les Blancs. Après d4, le pion e5 est bien tenu par d6 et Cc6."
   },
   {
    "san": "b5",
    "pourquoi": "Chasse le fou a4 vers b3 avec gain de temps et prend de l'espace à l'aile dame. Prépare Ca5 pour échanger ce fou ou Fb7. Attention : le pion b5 pourra être attaqué plus tard par a4, il faudra surveiller la case c6."
   },
   {
    "san": "h6",
    "pourquoi": "Imite les Blancs : enlève g5 au fou c1 et au cavalier f3, pour que le cavalier f6 et le fou g7 restent tranquilles. Coup utile mais passif : il ne développe rien, à jouer de préférence après le roque."
   }
  ],
  "erreurs": [
   {
    "san": "Ra7",
    "pourquoi": "Un débutant peut vouloir protéger la tour ou préparer b5 sans crainte, mais la tour en a7 ne fait rien et bloque la case du fou. Les Blancs jouent d4 tout de suite : après b5 dxe5, le centre noir craque (dxe5 puis Dxd8+ ou Cxe5) alors que la tour a7 et le roi e8 sont mal placés. Un coup perdu dans une ouverture où il faut roquer vite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -25
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3 O-O",
  "nom": "Espagnole, variante Steinitz différée avec fianchetto (système d3-c3 contre g6)",
  "sens": "Met le roi à l'abri derrière le fou g7 et relie les tours : le développement est terminé, les Noirs attendent de voir si les Blancs poussent d4 pour choisir entre Te8, Fd7 ou b5.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Renforce e4 avant d'ouvrir le centre par d4. Si les Blancs jouent d4 tout de suite, le pion e4 n'est défendu que par la dame ; avec la tour en e1, d4 devient solide. La tour sera aussi utile sur la colonne e si celle-ci s'ouvre. Laisse aux Noirs le temps de jouer b5 ou Te8."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe la dernière pièce mineure vers f1 puis e3 ou g3, la manœuvre classique de l'Espagnole. Le cavalier garde aussi e4, ce qui rend d4 plus facile. Les Noirs pourront en profiter pour jouer b5 et Fb7 sans crainte, car la case c3 est déjà occupée par un pion."
   },
   {
    "san": "Bb3",
    "pourquoi": "Recule le fou à l'avance pour viser la diagonale a2-g8 vers f7 et éviter qu'un futur b5 le repousse en perdant un temps. Prépare d4 et parfois Fe3. En revanche, le fou est hors du jeu de l'aile dame et les Noirs peuvent jouer Ca5 pour l'échanger ou le forcer en c2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 15
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3 O-O Re1",
  "sens": "Prépare d4 en mettant la tour derrière le pion e4 : une fois le centre ouvert, e4 sera défendu par la tour et la colonne e sera déjà occupée. Coup calme qui ne menace rien et laisse aux Noirs un temps libre.",
  "plan": [
   {
    "san": "b5",
    "pourquoi": "Gagne de l'espace à l'aile dame et chasse le fou en b3 ou c2, qui regarde moins le roi. Prépare Fb7 ou Ca5 pour échanger ce fou. Laisse aux Blancs d4, mais le pion b5 freine aussi un futur a4."
   },
   {
    "san": "Re8",
    "pourquoi": "Copie l'idée des Blancs : la tour soutient e5 à l'avance. Si d4 arrive, les Noirs peuvent répondre exd4 et ouvrir la colonne e avec leur tour déjà prête. Prépare aussi Cd7 et f5 plus tard."
   },
   {
    "san": "Nd7",
    "pourquoi": "Recule le cavalier pour défendre e5 une seconde fois et libérer la case f6 au fou g7. Prépare f5 pour attaquer e4. Laisse aux Blancs d4 sans gêne, mais e5 tient grâce à d6, Cd7 et Fg7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -25
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3 O-O Re1 b5",
  "nom": "Espagnole, variante Steinitz différée avec fianchetto (ligne lente en d3)",
  "sens": "attaque le fou a4 avec gain de temps et gagne de l'espace à l'aile dame : le fou doit reculer, ce qui donne aux Noirs un coup gratuit pour continuer Fb7 ou Ca5.",
  "menace": "Prendre le fou en a4 avec le pion b5 : il est attaqué et n'a pas d'autre défense que de reculer.",
  "plan": [
   {
    "san": "Bc2",
    "pourquoi": "Sauve le fou et le range derrière le pion d3, où il n'est plus une cible pour Ca5. Il garde l'œil sur e4 et pourra regarder le roi noir après d4 et un futur e4-e5. Laisse aux Noirs du temps pour Fb7 ou d5, mais les Blancs ont toujours le coup central d4 en réserve."
   },
   {
    "san": "Bb3",
    "pourquoi": "Sauve le fou en gardant la diagonale a2-g8 vers f7 et d5, ce qui gêne la poussée d5. Inconvénient : les Noirs peuvent jouer Ca5 pour l'échanger ; les Blancs devront alors choisir entre Fc2 et laisser faire."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe5",
    "pourquoi": "Le cavalier croit gagner un pion, mais après Cxe5 les Blancs ont donné une pièce. Même Fc2 ensuite ne répare rien : le fou a4 était attaqué et le cavalier en e5 est perdu. Toujours sauver la pièce attaquée avant de chercher des combinaisons."
   },
   {
    "san": "d4",
    "pourquoi": "Oublie que le fou est en prise. Après bxa4 les Blancs ont perdu un fou ; reprendre avec Dxa4 ne rend qu'un pion, et Fd7 chasse encore la dame. Un coup central naturel, mais hors sujet : la question du moment est le fou a4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 37
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3 O-O Re1 b5 Bc2",
  "sens": "Met le fou à l'abri derrière le pion d3, hors de portée du cavalier noir. Il continue de soutenir e4 et vise déjà la diagonale vers h7, utile si le pion e4 avance un jour en e5.",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "Place la tour en face du pion e4 et soutient e5. Elle prépare d5 : si les Blancs prennent sur d5, e4 n'est plus protégé par un pion et la tour fait pression. Ne crée aucune faiblesse."
   },
   {
    "san": "d5",
    "pourquoi": "Frappe le centre tout de suite, avant le d4 blanc. Après exd5 Dxd5 (ou Cxd5), les Noirs ont libéré leurs pièces et le fou b7 ou e6 aura une bonne diagonale. Laisse aux Blancs d4 avec échange au centre, mais sans gain pour eux."
   },
   {
    "san": "Bb7",
    "pourquoi": "Développe le fou sur la longue diagonale, où il regarde e4 et d5. Il prépare d5 et Te8 dans l'ordre que l'on veut. Laisse aux Blancs le temps de jouer d4, mais le fou b7 pèse alors sur le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": -39
 },
 {
  "coups": "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c3 a6 Ba4 g6 O-O Bg7 h3 O-O Re1 b5 Bc2 Re8",
  "sens": "met la tour face au pion e4 et renforce e5 : si d5 est joué puis échangé, le pion e4 perd son soutien et la tour pèse sur la colonne e.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "Attaque la chaîne b5-a6 sur l'aile dame. Si les Noirs jouent b4, la case c4 s'ouvre pour un cavalier ; s'ils laissent faire, axb5 ouvre la colonne a pour la tour a1. Les Noirs répondent souvent Fb7 ou Fd7 pour tenir b5."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier vers f1 puis g3 ou e3, le trajet classique de l'Espagnole. Il garde aussi e4 une fois de plus, ce qui désamorce l'idée d5 des Noirs. Laisse aux Noirs le temps de jouer d5 ou Fb7."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en regardant la case c5 et la diagonale vers a7. Il libère d2 pour le cavalier et prépare Dd2. Les Noirs peuvent gagner un temps avec Cg4, mais le fou recule en d2 sans dommage."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-17",
  "evalBest": 41
 }
];
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
