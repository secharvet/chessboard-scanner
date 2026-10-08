// Généré par scripts/ouvertures/construire.mjs : 60 positions du livre + 330 prolongements. Ne pas éditer à la main.
export const OUVERTURE = "Défense française";
export const LIVRE = [
 {
  "coups": "e4",
  "sens": "occupe le centre et ouvre la diagonale du fou roi et la dame",
  "plan": [
   {
    "san": "e6",
    "pourquoi": "prépare …d5 pour défier e4 avec un pion soutenu : c'est la Française, solide, qui joue sur le centre et le pion d4 adverse"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6",
  "nom": "Défense française",
  "sens": "prépare …d5 : le pion d5 sera soutenu par e6, et le fou f8 sort par e7 ou b4",
  "plan": [
   {
    "san": "d4",
    "pourquoi": "prend tout le centre avant que …d5 ne le conteste"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4",
  "sens": "prend tout le centre avec deux pions avant que …d5 ne le conteste",
  "plan": [
   {
    "san": "d5",
    "pourquoi": "défie e4 tout de suite : c'est le coup de la Française, et les Blancs doivent choisir"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5",
  "nom": "Défense française",
  "sens": "défie e4 : les Blancs doivent choisir ce qu'ils font de leur pion e4, et ce choix décide de toute la partie",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "avance : gagne de l'espace, enferme le cavalier g8 et le fou c8 ; la chaîne d4-e5 pointe vers l'aile roi, c'est là que les Blancs attaqueront. En échange, d4 devient la cible des Noirs"
   },
   {
    "san": "Nc3",
    "pourquoi": "défend e4 en développant : la variante classique, ou la Winawer si …Fb4 cloue le cavalier"
   },
   {
    "san": "Nd2",
    "pourquoi": "défend e4 sans permettre …Fb4 (variante Tarrasch) : plus calme, le cavalier gêne un peu le fou c1"
   },
   {
    "san": "exd5",
    "pourquoi": "échange : position symétrique et ouverte, sans tension ; peu d'avantage mais pas de risque"
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "perd un pion : …dxe4 Fxe4 Cf6 chasse le fou, ou …dxe4 et le fou doit reprendre deux fois"
   },
   {
    "san": "f3",
    "pourquoi": "défend e4 avec un pion de l'aile roi : affaiblit le roi et bloque le cavalier g1"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5",
  "nom": "Française, variante d'avance",
  "sens": "fixe le centre : la chaîne d4-e5 donne l'espace et vise l'aile roi ; le cavalier g8 n'a plus f6 ; mais la base d4 devient la cible",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque tout de suite la base de la chaîne, d4 : c'est LE plan noir, suivi de …Cc6 et …Db6 pour accumuler sur d4"
   }
  ],
  "erreurs": [
   {
    "san": "Nc6",
    "pourquoi": "bloque le pion c : le levier …c5, le plan principal des Noirs, devient difficile"
   },
   {
    "san": "f6",
    "pourquoi": "attaque la tête de la chaîne trop tôt : après exf6 le roi noir est à l'air et e6 reste faible"
   }
  ],
  "schema": {
   "blancs": [
    "tenir d4 avec c3 et Cf3, puis Fe2 ou Fd3 et le roque",
    "une fois d4 tenu, attaquer à l'aile roi : Fd3 vers h7, Dg4 contre g7, et le levier f4-f5 contre e6",
    "empêcher …f6 ou le punir en reprenant exf6 quand e6 devient faible"
   ],
   "noirs": [
    "accumuler sur d4 : …c5, …Cc6, …Db6, parfois …Cge7-f5 ou …Ch6-f5",
    "quand d4 tient, préparer …f6 pour casser la tête de la chaîne et libérer les pièces",
    "sortir le mauvais fou c8 : par …Fd7-b5 pour l'échanger, ou par …b6 et …Fa6"
   ],
   "coupsBlancs": [
    {
     "san": "c3",
     "pourquoi": "soutient la base d4 avec un pion"
    },
    {
     "san": "Nf3",
     "pourquoi": "deuxième défenseur de d4, en développant"
    },
    {
     "san": "Be2",
     "pourquoi": "développe le fou et prépare le roque"
    },
    {
     "san": "Bd3",
     "pourquoi": "développe le fou vers h7 : la cible de l'attaque à venir"
    },
    {
     "san": "O-O",
     "pourquoi": "met le roi à l'abri avant d'attaquer"
    },
    {
     "san": "a3",
     "pourquoi": "prépare b4 : espace à l'aile dame, et interdit …Fb4"
    },
    {
     "san": "b4",
     "pourquoi": "gagne de l'espace à l'aile dame et prépare b5 contre le cavalier c6"
    },
    {
     "san": "Nbd2",
     "pourquoi": "le second cavalier vers b3 ou f1-g3 : il soutient d4 ou l'attaque"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour derrière e5, prête pour l'ouverture de la colonne"
    },
    {
     "san": "h4",
     "pourquoi": "lance l'aile roi : h5 chassera un cavalier de g6 ou f5"
    },
    {
     "san": "Qg4",
     "pourquoi": "attaque g7 : c'est l'idée reine de l'avance quand le fou f8 n'est plus là"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 et prépare f5 contre e6"
    },
    {
     "san": "Be3",
     "pourquoi": "défend d4 par le fou quand la dame doit partir"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …Fxc5 ne gagne plus de temps"
    },
    {
     "san": "Nb3",
     "pourquoi": "le cavalier tient d4 depuis b3 et libère le fou c1"
    }
   ],
   "coupsNoirs": [
    {
     "san": "c5",
     "pourquoi": "attaque la base de la chaîne, d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4, et pression sur b2"
    },
    {
     "san": "Bd7",
     "pourquoi": "prépare …Fb5 pour échanger le mauvais fou"
    },
    {
     "san": "Nge7",
     "pourquoi": "le cavalier roi va en f5 contre d4"
    },
    {
     "san": "Nf5",
     "pourquoi": "quatrième attaquant de d4"
    },
    {
     "san": "Nh6",
     "pourquoi": "vers f5 contre d4"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c au bon moment"
    },
    {
     "san": "f6",
     "pourquoi": "casse la tête de la chaîne, e5, pour libérer les pièces"
    },
    {
     "san": "Bb5",
     "pourquoi": "échange le mauvais fou"
    },
    {
     "san": "Rc8",
     "pourquoi": "la tour sur la colonne c, qui s'ouvrira"
    },
    {
     "san": "a5",
     "pourquoi": "fixe b4 ou prépare …Fa6"
    },
    {
     "san": "b6",
     "pourquoi": "prépare …Fa6 pour sortir le mauvais fou"
    },
    {
     "san": "Be7",
     "pourquoi": "développe et prépare le roque"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Qc7",
     "pourquoi": "la dame derrière c5, et pression sur e5"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5",
  "nom": "Avance, 3…c5",
  "sens": "attaque la base de la chaîne, d4 ; annonce …Cc6 et …Db6 : trois pièces contre d4",
  "menace": "…cxd4 puis …Db6 : d4 attaqué deux fois, défendu une",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "soutient d4 avec un pion : la base tiendra quoi qu'il arrive ; c'est la suite principale"
   },
   {
    "san": "Nf3",
    "pourquoi": "défend d4 en développant ; mais après …cxd4 Cxd4 la chaîne n'existe plus et les Noirs sont à l'aise"
   }
  ],
  "erreurs": [
   {
    "san": "dxc5",
    "pourquoi": "rend le centre : …Fxc5 développe avec gain de temps et les Noirs ont le centre et l'activité"
   },
   {
    "san": "Qg4",
    "pourquoi": "sort la dame trop tôt : jouable mais …cxd4 et les Noirs mènent le jeu ; pour débutants, c3 d'abord"
   },
   {
    "san": "Nc3",
    "pourquoi": "le cavalier gêne c3 : d4 ne pourra plus être soutenu par un pion ; après …cxd4 Dxd4 Cc6 la dame est chassée avec gain de temps"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3",
  "sens": "soutient la base d4 avec un pion : quoi qu'il arrive sur d4, un pion pourra reprendre",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "deuxième attaquant de d4, en développant"
   },
   {
    "san": "Qb6",
    "pourquoi": "attaque d4 ET b2 : la dame gêne le fou c1 (il ne peut plus sortir sans laisser b2)"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6",
  "nom": "Avance, ligne principale",
  "sens": "deuxième attaquant de d4 ; prépare …Db6 pour un troisième",
  "menace": "…cxd4 cxd4 Db6 : d4 attaqué trois fois (c6, b6, et plus tard un cavalier en f5), défendu par la dame seule",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "deuxième défenseur de d4, en développant : attaquants deux, défenseurs deux"
   }
  ],
  "erreurs": [
   {
    "san": "f4",
    "pourquoi": "ajoute un défenseur à e5, pas à d4 : après …Db6 et …cxd4 cxd4 Cxd4 le pion tombe"
   },
   {
    "san": "Bd3",
    "pourquoi": "laisse d4 à deux attaquants contre un : …cxd4 cxd4 Cxd4 gagne un pion"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3",
  "nom": "Avance, attaque Paulsen",
  "sens": "deuxième défenseur de d4 et développement ; le cavalier ira parfois en d4 après l'échange des pions c",
  "plan": [
   {
    "san": "Qb6",
    "pourquoi": "troisième attaquant de d4 ; vise b2 au passage, ce qui cloue le fou c1 à sa case"
   },
   {
    "san": "Bd7",
    "pourquoi": "prépare …Fb5 pour échanger le mauvais fou noir contre le bon fou blanc, celui qui attaquerait h7"
   },
   {
    "san": "Nge7",
    "pourquoi": "le cavalier roi va en f5 attaquer d4 : quatrième attaquant"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6",
  "nom": "Avance, ligne principale",
  "sens": "troisième attaquant de d4 ; attaque b2 : le fou c1 est cloué à la défense du pion",
  "menace": "…cxd4 cxd4 Cxd4 Cxd4 Dxd4 : le pion d4 tombe si on ne l'a pas défendu une troisième fois",
  "plan": [
   {
    "san": "a3",
    "pourquoi": "prépare b4 : gagne de l'espace à l'aile dame et empêche …Fb4+ ; d4 tiendra par Fe3 ensuite"
   },
   {
    "san": "Be2",
    "pourquoi": "développe et roque vite ; d4 est tenu par la dame et le cavalier, c'est assez pour l'instant"
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "défend b2 mais affaiblit c3 et la grande diagonale ; …cxd4 cxd4 Fb4+ gêne"
   }
  ],
  "schema": {
   "blancs": [
    "garder d4 : Fe3 ou la dame, et répondre à …cxd4 par cxd4",
    "roquer, puis l'attaque à l'aile roi : Fd3, Dg4 contre g7 si le fou f8 est parti, f4-f5 contre e6",
    "sur l'aile dame : a3 et b4 pour gagner de l'espace et chasser le cavalier c6 par b5"
   ],
   "noirs": [
    "accumuler sur d4 jusqu'à ce qu'il tombe ou que les Blancs se figent pour le défendre",
    "échanger le mauvais fou : …Fd7-b5",
    "casser e5 par …f6 quand le roi est à l'abri"
   ],
   "coupsBlancs": [
    {
     "san": "c3",
     "pourquoi": "soutient la base d4 avec un pion"
    },
    {
     "san": "Nf3",
     "pourquoi": "deuxième défenseur de d4, en développant"
    },
    {
     "san": "Be2",
     "pourquoi": "développe le fou et prépare le roque"
    },
    {
     "san": "Bd3",
     "pourquoi": "développe le fou vers h7 : la cible de l'attaque à venir"
    },
    {
     "san": "O-O",
     "pourquoi": "met le roi à l'abri avant d'attaquer"
    },
    {
     "san": "a3",
     "pourquoi": "prépare b4 : espace à l'aile dame, et interdit …Fb4"
    },
    {
     "san": "b4",
     "pourquoi": "gagne de l'espace à l'aile dame et prépare b5 contre le cavalier c6"
    },
    {
     "san": "Nbd2",
     "pourquoi": "le second cavalier vers b3 ou f1-g3 : il soutient d4 ou l'attaque"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour derrière e5, prête pour l'ouverture de la colonne"
    },
    {
     "san": "h4",
     "pourquoi": "lance l'aile roi : h5 chassera un cavalier de g6 ou f5"
    },
    {
     "san": "Qg4",
     "pourquoi": "attaque g7 : c'est l'idée reine de l'avance quand le fou f8 n'est plus là"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 et prépare f5 contre e6"
    },
    {
     "san": "Be3",
     "pourquoi": "défend d4 par le fou quand la dame doit partir"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …Fxc5 ne gagne plus de temps"
    },
    {
     "san": "Nb3",
     "pourquoi": "le cavalier tient d4 depuis b3 et libère le fou c1"
    }
   ],
   "coupsNoirs": [
    {
     "san": "c5",
     "pourquoi": "attaque la base de la chaîne, d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4, et pression sur b2"
    },
    {
     "san": "Bd7",
     "pourquoi": "prépare …Fb5 pour échanger le mauvais fou"
    },
    {
     "san": "Nge7",
     "pourquoi": "le cavalier roi va en f5 contre d4"
    },
    {
     "san": "Nf5",
     "pourquoi": "quatrième attaquant de d4"
    },
    {
     "san": "Nh6",
     "pourquoi": "vers f5 contre d4"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c au bon moment"
    },
    {
     "san": "f6",
     "pourquoi": "casse la tête de la chaîne, e5, pour libérer les pièces"
    },
    {
     "san": "Bb5",
     "pourquoi": "échange le mauvais fou"
    },
    {
     "san": "Rc8",
     "pourquoi": "la tour sur la colonne c, qui s'ouvrira"
    },
    {
     "san": "a5",
     "pourquoi": "fixe b4 ou prépare …Fa6"
    },
    {
     "san": "b6",
     "pourquoi": "prépare …Fa6 pour sortir le mauvais fou"
    },
    {
     "san": "Be7",
     "pourquoi": "développe et prépare le roque"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Qc7",
     "pourquoi": "la dame derrière c5, et pression sur e5"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3",
  "sens": "prépare b4 : espace à l'aile dame, interdit …Fb4+, et chasse à terme le cavalier c6 par b5",
  "plan": [
   {
    "san": "Nh6",
    "pourquoi": "le cavalier va en f5 attaquer d4 : quatrième attaquant ; si Fxh6 gxh6, la colonne g s'ouvre pour les Noirs"
   },
   {
    "san": "c4",
    "pourquoi": "ferme le centre et fixe les pions blancs : les Noirs jouent alors à l'aile dame avec …Ca5 et …Fd7-b5"
   },
   {
    "san": "Bd7",
    "pourquoi": "prépare …Fb5 pour échanger le mauvais fou"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2",
  "sens": "développe simplement et prépare le roque ; d4 reste tenu par la dame et le cavalier",
  "plan": [
   {
    "san": "Nh6",
    "pourquoi": "vers f5, quatrième attaquant de d4"
   },
   {
    "san": "cxd4",
    "pourquoi": "puis …Cge7-f5 ou …Ch6 : la tension est levée au moment où le cavalier arrive"
   },
   {
    "san": "Bd7",
    "pourquoi": "prépare …Fb5 pour échanger les fous ; après Fxb5 Dxb5 la dame noire est très active"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7",
  "sens": "prépare …Fb5 : échanger le mauvais fou noir (bloqué par e6, d5) contre le fou e2, celui qui attaquerait h7",
  "plan": [
   {
    "san": "Be2",
    "pourquoi": "développe ; si …Fb5, l'échange est acceptable mais on peut aussi jouer c4 pour le gêner"
   },
   {
    "san": "a3",
    "pourquoi": "prépare b4 et empêche …Fb5 d'être suivi de …Fb4"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Qb6",
  "sens": "attaque d4 et b2 d'un coup : la dame gêne le fou c1",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "défend d4 en développant"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3",
  "nom": "Avance, système Nimzowitsch",
  "sens": "défend d4 en développant, sans c3 : accepte l'échange des pions sur d4",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "échange : la chaîne blanche disparaît, le cavalier d4 pourra être échangé ou chassé"
   },
   {
    "san": "Nc6",
    "pourquoi": "deuxième attaquant de d4 ; les Blancs devront choisir entre c3 et dxc5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5",
  "nom": "Avance, variante Steinitz",
  "sens": "rend le centre pour éviter la pression sur d4",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "reprend en développant : les Noirs ont le centre et le fou actif ; le plan est …Cc6, …Cge7-f5 ou …Dc7 contre e5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4",
  "nom": "Avance, attaque Nimzowitsch",
  "sens": "la dame vise g7 tout de suite ; agressif mais précoce",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "prend le centre pendant que la dame est partie ; …Cc6 suit"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6",
  "sens": "développe mais bloque le pion c : le levier …c5 devient difficile ; les Noirs comptent sur …f6 à la place",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "développe et tient d4 ; ensuite c3 et Fd3"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7",
  "nom": "Avance, échange de fou élargi",
  "sens": "prépare …Fb5 pour échanger tout de suite le mauvais fou",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "développe ; si …Fb5, Fxb5+ puis on garde l'espace"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 exd5",
  "nom": "Française, variante d'échange",
  "sens": "échange au centre : plus de tension, position symétrique ; les Blancs renoncent à l'avantage d'espace pour la sécurité",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "reprend du pion : symétrie ; le fou c8 est enfin libre"
   }
  ],
  "schema": {
   "blancs": [
    "développer vite et chercher le levier c4 pour casser la symétrie (variante Monte-Carlo)",
    "placer le fou en d3 et les tours sur la colonne e"
   ],
   "noirs": [
    "même développement : …Fd6, …Cf6, …O-O, …Fg4 ; à la symétrie, le camp qui a le trait de plus pousse un peu"
   ],
   "coupsBlancs": [
    {
     "san": "Nf3",
     "pourquoi": "développe"
    },
    {
     "san": "Bd3",
     "pourquoi": "le fou sur sa meilleure diagonale"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "c4",
     "pourquoi": "casse la symétrie"
    },
    {
     "san": "Nc3",
     "pourquoi": "développe et vise d5"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne ouverte"
    },
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "Qc2",
     "pourquoi": "prépare le roque long ou vise h7"
    },
    {
     "san": "c3",
     "pourquoi": "solide : tient d4"
    },
    {
     "san": "Nbd2",
     "pourquoi": "développe vers f1-g3"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "développe"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou sur sa meilleure diagonale"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Bg4",
     "pourquoi": "cloue le cavalier f3"
    },
    {
     "san": "Nc6",
     "pourquoi": "développe et vise d4"
    },
    {
     "san": "Re8",
     "pourquoi": "la tour sur la colonne ouverte"
    },
    {
     "san": "c6",
     "pourquoi": "tient d5"
    },
    {
     "san": "Nbd7",
     "pourquoi": "développe"
    },
    {
     "san": "Qc7",
     "pourquoi": "vise h2 avec le fou d6"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5",
  "sens": "reprend du pion : symétrie, et le fou c8 est libre",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "développe ; Fd3 et O-O suivent"
   },
   {
    "san": "Bd3",
    "pourquoi": "le fou sur sa meilleure diagonale, vers h7"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3",
  "sens": "développe vers le centre ; prépare Fd3 et le roque",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "le fou sur sa meilleure diagonale, vers h2"
   },
   {
    "san": "Nf6",
    "pourquoi": "développe et prépare le roque"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4",
  "nom": "Échange, variante Monte-Carlo",
  "sens": "casse la symétrie : après …dxc4 Fxc4, les Blancs ont le pion isolé d4 mais des pièces actives",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "développe sans se presser de prendre c4"
   },
   {
    "san": "Bb4+",
    "pourquoi": "échec gênant : Cc3 ou Fd2, et les Noirs décident ensuite de …dxc4"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2",
  "nom": "Française, variante Tarrasch",
  "sens": "défend e4 en évitant le clouage …Fb4 ; c3 reste disponible pour soutenir d4 ; le cavalier gêne un peu le fou c1",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "ouvre le jeu tout de suite (système ouvert) : après exd5 exd5 les Noirs acceptent un pion isolé d5 contre des pièces actives"
   },
   {
    "san": "Nf6",
    "pourquoi": "force e5 (système fermé) : Cfd7 puis …c5 contre la base d4, comme dans l'avance"
   }
  ],
  "schema": {
   "blancs": [
    "système fermé : e5, f4 et Cdf3 pour tenir e5, puis l'attaque à l'aile roi avec Fd3 et parfois g4",
    "système ouvert : jouer contre le pion isolé d5 : le bloquer en d4, l'attaquer par les tours"
   ],
   "noirs": [
    "système fermé : …c5, …Cc6, …Db6 contre d4, et le levier …f6 contre e5",
    "système ouvert : pièces actives autour du pion isolé, …Fd6, …O-O, …Te8, et éviter les échanges"
   ],
   "coupsBlancs": [
    {
     "san": "e5",
     "pourquoi": "gagne l'espace et chasse le cavalier"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7 et prépare c3, Ce2"
    },
    {
     "san": "c3",
     "pourquoi": "soutient d4"
    },
    {
     "san": "Ne2",
     "pourquoi": "tient d4 et laisse f3 au cavalier d2"
    },
    {
     "san": "Ngf3",
     "pourquoi": "développe et tient d4"
    },
    {
     "san": "Nf3",
     "pourquoi": "tient e5 ou d4"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 par un pion"
    },
    {
     "san": "Nf4",
     "pourquoi": "le cavalier vise e6 et d5 après …f6 exf6"
    },
    {
     "san": "Qe2",
     "pourquoi": "prépare le roque et tient e5"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …c5 n'est plus soutenu"
    },
    {
     "san": "exf6",
     "pourquoi": "ouvre la colonne e sur e6 affaibli"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne e"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "force e5"
    },
    {
     "san": "Nfd7",
     "pourquoi": "la case qui soutient …c5 et …f6"
    },
    {
     "san": "c5",
     "pourquoi": "attaque la base d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c et prépare …f6"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5, ouvre la colonne f"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou actif vers h2"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Nxf6",
     "pourquoi": "reprend en centralisant"
    },
    {
     "san": "Qc7",
     "pourquoi": "derrière c5, vise e5"
    },
    {
     "san": "Bd7",
     "pourquoi": "sort le mauvais fou"
    },
    {
     "san": "a5",
     "pourquoi": "fixe l'aile dame"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6",
  "nom": "Tarrasch, système fermé",
  "sens": "attaque e4 pour forcer e5 ; le cavalier ira en d7 et les Noirs joueront …c5 contre d4",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "gagne de l'espace et chasse le cavalier ; la partie ressemble à l'avance, mais le cavalier d2 pourra aller en f3 pour tenir d4"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5",
  "sens": "chasse le cavalier et fixe le centre : la chaîne d4-e5",
  "plan": [
   {
    "san": "Nfd7",
    "pourquoi": "la seule bonne case : de d7 le cavalier soutient …c5 et …f6"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7",
  "sens": "recule sur la case d'où il soutient …c5 et …f6, les deux leviers noirs",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe vers h7 et prépare c3 et Ce2 pour tenir d4"
   },
   {
    "san": "f4",
    "pourquoi": "soutient e5 par un pion (variante du centre de pions) : la chaîne est double, mais le roi blanc est un peu plus exposé"
   },
   {
    "san": "c3",
    "pourquoi": "soutient d4 avant que …c5 n'arrive"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3",
  "sens": "développe vers h7 ; prépare c3 et Ce2 pour tenir d4 avec des pièces",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque la base d4, comme dans l'avance"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5",
  "sens": "attaque la base de la chaîne, d4",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "soutient d4 avec un pion"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3",
  "sens": "soutient d4",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "deuxième attaquant de d4 ; prépare …Db6 et …f6"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6",
  "sens": "deuxième attaquant de d4 ; …Db6 et …f6 suivent",
  "plan": [
   {
    "san": "Ngf3",
    "pourquoi": "développe et tient d4 ; le cavalier d2 restera un défenseur de secours"
   },
   {
    "san": "Ne2",
    "pourquoi": "le cavalier roi en e2 tient d4 et laisse f3 au cavalier d2 pour tenir e5 : les deux pions seront défendus par des pièces"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2",
  "sens": "tient d4 par le cavalier et garde f3 pour l'autre cavalier, qui tiendra e5",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "ouvre la colonne c et prépare …f6 : après cxd4 f6, la chaîne est attaquée des deux côtés"
   },
   {
    "san": "Qb6",
    "pourquoi": "troisième attaquant de d4 et pression sur b2"
   }
  ],
  "schema": {
   "blancs": [
    "Cf3, O-O, et tenir d4 et e5 avec les pièces",
    "quand …f6 vient : exf6 et jouer contre e6 affaibli, avec Cf4 et Fd3 vers h7",
    "le levier f4-f5 si les Noirs tardent"
   ],
   "noirs": [
    "…cxd4 cxd4 f6 : casser la chaîne, ouvrir la colonne f et libérer les pièces",
    "après exf6 Cxf6 : jouer actif, …Fd6, …O-O, …Dc7, mais soigner e6"
   ],
   "coupsBlancs": [
    {
     "san": "e5",
     "pourquoi": "gagne l'espace et chasse le cavalier"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7 et prépare c3, Ce2"
    },
    {
     "san": "c3",
     "pourquoi": "soutient d4"
    },
    {
     "san": "Ne2",
     "pourquoi": "tient d4 et laisse f3 au cavalier d2"
    },
    {
     "san": "Ngf3",
     "pourquoi": "développe et tient d4"
    },
    {
     "san": "Nf3",
     "pourquoi": "tient e5 ou d4"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 par un pion"
    },
    {
     "san": "Nf4",
     "pourquoi": "le cavalier vise e6 et d5 après …f6 exf6"
    },
    {
     "san": "Qe2",
     "pourquoi": "prépare le roque et tient e5"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …c5 n'est plus soutenu"
    },
    {
     "san": "exf6",
     "pourquoi": "ouvre la colonne e sur e6 affaibli"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne e"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "force e5"
    },
    {
     "san": "Nfd7",
     "pourquoi": "la case qui soutient …c5 et …f6"
    },
    {
     "san": "c5",
     "pourquoi": "attaque la base d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c et prépare …f6"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5, ouvre la colonne f"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou actif vers h2"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Nxf6",
     "pourquoi": "reprend en centralisant"
    },
    {
     "san": "Qc7",
     "pourquoi": "derrière c5, vise e5"
    },
    {
     "san": "Bd7",
     "pourquoi": "sort le mauvais fou"
    },
    {
     "san": "a5",
     "pourquoi": "fixe l'aile dame"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5",
  "nom": "Tarrasch, système ouvert",
  "sens": "ouvre le jeu tout de suite : les Noirs acceptent souvent un pion isolé d5 contre l'activité",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "échange pour isoler le pion d5 après …exd5 : la cible de toute la partie"
   },
   {
    "san": "Ngf3",
    "pourquoi": "développe et garde la tension (ligne Euwe-Keres)"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5",
  "sens": "échange pour créer un pion isolé noir en d5 après …exd5",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "accepte le pion isolé : en échange, le fou c8 est libre et les pièces actives"
   },
   {
    "san": "Qxd5",
    "pourquoi": "évite l'isolé mais sort la dame : Cgf3 et Fc4 la chasseront avec gain de temps"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5",
  "sens": "accepte le pion isolé d5 contre l'activité et le fou c8 libre",
  "plan": [
   {
    "san": "Ngf3",
    "pourquoi": "développe ; Fb5+ et O-O suivent, puis le blocus de d5 par un cavalier en d4"
   }
  ],
  "schema": {
   "blancs": [
    "bloquer d5 : un cavalier en d4 ou d4 tenu, puis attaquer le pion isolé avec les tours sur la colonne d",
    "échanger les pièces : l'isolé est plus faible en finale"
   ],
   "noirs": [
    "pièces actives : …Cf6, …Fd6, …O-O, …Te8 ; éviter les échanges ; chercher …d4 au bon moment pour libérer les pièces"
   ],
   "coupsBlancs": [
    {
     "san": "Ngf3",
     "pourquoi": "développe et prépare Fb5+ puis le blocus de d5"
    },
    {
     "san": "Bb5+",
     "pourquoi": "échec qui gêne le développement noir"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Nb3",
     "pourquoi": "vers d4, le blocus du pion isolé"
    },
    {
     "san": "dxc5",
     "pourquoi": "isole encore le pion d5 et attaque"
    },
    {
     "san": "Be3",
     "pourquoi": "tient d4 et vise c5"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne e"
    },
    {
     "san": "Nbd4",
     "pourquoi": "le blocus de l'isolé"
    },
    {
     "san": "c3",
     "pourquoi": "solide : tient d4"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nc6",
     "pourquoi": "développe et tient d4 à distance"
    },
    {
     "san": "Nf6",
     "pourquoi": "développe"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou actif"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Re8",
     "pourquoi": "la tour sur la colonne e"
    },
    {
     "san": "c4",
     "pourquoi": "gagne de l'espace et fixe"
    },
    {
     "san": "Bg4",
     "pourquoi": "cloue le cavalier f3"
    },
    {
     "san": "a6",
     "pourquoi": "empêche Fb5"
    },
    {
     "san": "Qe7",
     "pourquoi": "la dame sur la colonne e"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5",
  "nom": "Tarrasch, défense Chistyakov",
  "sens": "évite le pion isolé en reprenant de la dame",
  "plan": [
   {
    "san": "Ngf3",
    "pourquoi": "développe avec gain de temps : Fc4 suit, la dame devra bouger"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6",
  "nom": "Tarrasch, défense Guimard",
  "sens": "développe mais bloque c7 : les Noirs visent …f6 ou …e5 plutôt que …c5",
  "plan": [
   {
    "san": "Ngf3",
    "pourquoi": "développe ; e5 et c3 suivent, et les Noirs auront du mal à attaquer d4"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3",
  "nom": "Française, 3.Cc3",
  "sens": "défend e4 en développant ; c3 n'est plus disponible pour soutenir d4, et …Fb4 peut clouer le cavalier",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "attaque e4 une deuxième fois (variante classique) : les Blancs doivent jouer Fg5, e5 ou exd5"
   },
   {
    "san": "Bb4",
    "pourquoi": "cloue le cavalier : e4 n'est plus défendu qu'en apparence (Winawer) ; les Noirs échangeront souvent le fou contre le cavalier et joueront contre les pions doublés c3"
   },
   {
    "san": "dxe4",
    "pourquoi": "défense Rubinstein : échange au centre, solide mais passif"
   }
  ],
  "schema": {
   "blancs": [
    "garder le centre : e5 ou Fg5 selon la réponse, puis f4 et Cf3 pour tenir e5",
    "développer vite, roquer (souvent long), et attaquer à l'aile roi"
   ],
   "noirs": [
    "…Cf6 ou …Fb4 contre e4, puis …c5 contre d4 : toujours la base de la chaîne",
    "échanger le fou f8 s'il est passif, et jouer …Cc6, …Db6, …a6 et …b5 à l'aile dame"
   ],
   "coupsBlancs": [
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "e5",
     "pourquoi": "chasse le cavalier et fixe le centre"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 par un pion"
    },
    {
     "san": "Nf3",
     "pourquoi": "développe et tient d4"
    },
    {
     "san": "Be3",
     "pourquoi": "tient d4"
    },
    {
     "san": "Qd2",
     "pourquoi": "prépare le roque long"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roque long : l'attaque à l'aile roi peut commencer"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "Nce2",
     "pourquoi": "tient d4 et libère c3 pour le pion"
    },
    {
     "san": "g4",
     "pourquoi": "lance l'assaut de pions"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …c5 n'est plus soutenu"
    },
    {
     "san": "Bxe7",
     "pourquoi": "échange le fou avant qu'il ne soit mal placé"
    },
    {
     "san": "Nb5",
     "pourquoi": "vise d6 et c7"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "attaque e4"
    },
    {
     "san": "Be7",
     "pourquoi": "décloue"
    },
    {
     "san": "Nfd7",
     "pourquoi": "la case qui soutient …c5"
    },
    {
     "san": "c5",
     "pourquoi": "attaque la base d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4"
    },
    {
     "san": "a6",
     "pourquoi": "prépare …b5 et empêche Cb5"
    },
    {
     "san": "b5",
     "pourquoi": "espace à l'aile dame"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Bb4",
     "pourquoi": "cloue le cavalier c3"
    },
    {
     "san": "Bxc3+",
     "pourquoi": "double les pions blancs"
    },
    {
     "san": "Ne7",
     "pourquoi": "développe en couvrant g7"
    },
    {
     "san": "Qc7",
     "pourquoi": "vise c3 et e5"
    },
    {
     "san": "Qa5",
     "pourquoi": "vise c3 et a3"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6",
  "nom": "Française classique",
  "sens": "deuxième attaque sur e4 : les Blancs doivent décider",
  "schema": {
   "blancs": [
    "tenir le centre : e5 (puis f4, Cf3, Fe3) ou Fg5 (puis e5 et Fxe7)",
    "attaque à l'aile roi quand le centre est fixé : Fd3, Dd2, O-O-O, g4"
   ],
   "noirs": [
    "…c5 contre d4, …Cc6, …Db6 ; le cavalier f6 recule en d7 si e5 arrive",
    "…f6 pour casser e5 une fois le roi à l'abri"
   ]
  },
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "cloue le cavalier f6 : e4 est défendu indirectement ; après …Fe7 e5 Cfd7 Fxe7 Dxe7 f4 les Blancs ont l'espace"
   },
   {
    "san": "e5",
    "pourquoi": "variante Steinitz : chasse le cavalier en d7 et fixe le centre ; f4 et Cf3 tiendront e5"
   },
   {
    "san": "exd5",
    "pourquoi": "échange différé, calme"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5",
  "sens": "cloue le cavalier f6 contre la dame : e4 est protégé indirectement, et le fou pourra s'échanger en e7 pour affaiblir les cases noires",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "décloue simplement ; après e5 Cfd7 Fxe7 Dxe7 les Noirs joueront …c5 contre d4"
   },
   {
    "san": "Bb4",
    "pourquoi": "MacCutcheon : contre-clouage ; tranchant, à connaître"
   },
   {
    "san": "dxe4",
    "pourquoi": "variante Burn : décloue par l'échange, position plus libre pour les Noirs"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7",
  "nom": "Classique, variante normale",
  "sens": "décloue et prépare le roque",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "chasse le cavalier et fixe le centre : la chaîne d4-e5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5",
  "sens": "fixe le centre et chasse le cavalier f6",
  "plan": [
   {
    "san": "Nfd7",
    "pourquoi": "la case d'où il soutient …c5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7",
  "sens": "recule vers la case qui soutient …c5 et …f6",
  "plan": [
   {
    "san": "Bxe7",
    "pourquoi": "échange le fou avant qu'il ne soit mal placé ; puis f4 pour tenir e5"
   },
   {
    "san": "h4",
    "pourquoi": "attaque Alekhine-Chatard : sacrifice de pion pour l'attaque sur le roi ; à connaître avant de l'accepter"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7",
  "sens": "reprend de la dame : les Noirs ont échangé leur fou passif, et …c5 arrive",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "soutient e5 par un pion : la chaîne est solide, Cf3 et Dd2 suivent"
   }
  ],
  "schema": {
   "blancs": [
    "f4, Cf3, Dd2, O-O-O : tenir e5 et attaquer à l'aile roi avec g4-g5 ou f5",
    "répondre à …c5 par dxc5 ou Cb5 selon les cas"
   ],
   "noirs": [
    "…c5, …Cc6, …a6 et …b5 : jouer à l'aile dame et sur d4",
    "…f6 au bon moment pour casser e5"
   ],
   "coupsBlancs": [
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "e5",
     "pourquoi": "chasse le cavalier et fixe le centre"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 par un pion"
    },
    {
     "san": "Nf3",
     "pourquoi": "développe et tient d4"
    },
    {
     "san": "Be3",
     "pourquoi": "tient d4"
    },
    {
     "san": "Qd2",
     "pourquoi": "prépare le roque long"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roque long : l'attaque à l'aile roi peut commencer"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "Nce2",
     "pourquoi": "tient d4 et libère c3 pour le pion"
    },
    {
     "san": "g4",
     "pourquoi": "lance l'assaut de pions"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …c5 n'est plus soutenu"
    },
    {
     "san": "Bxe7",
     "pourquoi": "échange le fou avant qu'il ne soit mal placé"
    },
    {
     "san": "Nb5",
     "pourquoi": "vise d6 et c7"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "attaque e4"
    },
    {
     "san": "Be7",
     "pourquoi": "décloue"
    },
    {
     "san": "Nfd7",
     "pourquoi": "la case qui soutient …c5"
    },
    {
     "san": "c5",
     "pourquoi": "attaque la base d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4"
    },
    {
     "san": "a6",
     "pourquoi": "prépare …b5 et empêche Cb5"
    },
    {
     "san": "b5",
     "pourquoi": "espace à l'aile dame"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Bb4",
     "pourquoi": "cloue le cavalier c3"
    },
    {
     "san": "Bxc3+",
     "pourquoi": "double les pions blancs"
    },
    {
     "san": "Ne7",
     "pourquoi": "développe en couvrant g7"
    },
    {
     "san": "Qc7",
     "pourquoi": "vise c3 et e5"
    },
    {
     "san": "Qa5",
     "pourquoi": "vise c3 et a3"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5",
  "nom": "Classique, variante Steinitz",
  "sens": "fixe le centre et chasse le cavalier ; f4 soutiendra e5",
  "plan": [
   {
    "san": "Nfd7",
    "pourquoi": "vers le soutien de …c5"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7",
  "sens": "recule vers la case qui soutient …c5",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "soutient e5 par un pion : la chaîne tiendra ; Cf3 et Fe3 suivent"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4",
  "sens": "soutient e5 par un pion : la chaîne d4-e5 est doublement tenue",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque la base d4, comme toujours dans la Française"
   }
  ],
  "schema": {
   "blancs": [
    "Cf3, Fe3, Dd2 : tenir d4 ; puis O-O-O ou Fd3 et l'attaque à l'aile roi avec g4 ou f5",
    "sur …cxd4 Cxd4 et un cavalier central"
   ],
   "noirs": [
    "…c5, …Cc6, …Db6 contre d4 ; …a6 et …b5 à l'aile dame",
    "…f6 pour casser e5 quand tout est prêt"
   ],
   "coupsBlancs": [
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "e5",
     "pourquoi": "chasse le cavalier et fixe le centre"
    },
    {
     "san": "f4",
     "pourquoi": "soutient e5 par un pion"
    },
    {
     "san": "Nf3",
     "pourquoi": "développe et tient d4"
    },
    {
     "san": "Be3",
     "pourquoi": "tient d4"
    },
    {
     "san": "Qd2",
     "pourquoi": "prépare le roque long"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roque long : l'attaque à l'aile roi peut commencer"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "Nce2",
     "pourquoi": "tient d4 et libère c3 pour le pion"
    },
    {
     "san": "g4",
     "pourquoi": "lance l'assaut de pions"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …c5 n'est plus soutenu"
    },
    {
     "san": "Bxe7",
     "pourquoi": "échange le fou avant qu'il ne soit mal placé"
    },
    {
     "san": "Nb5",
     "pourquoi": "vise d6 et c7"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nf6",
     "pourquoi": "attaque e4"
    },
    {
     "san": "Be7",
     "pourquoi": "décloue"
    },
    {
     "san": "Nfd7",
     "pourquoi": "la case qui soutient …c5"
    },
    {
     "san": "c5",
     "pourquoi": "attaque la base d4"
    },
    {
     "san": "Nc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Qb6",
     "pourquoi": "troisième attaquant de d4"
    },
    {
     "san": "a6",
     "pourquoi": "prépare …b5 et empêche Cb5"
    },
    {
     "san": "b5",
     "pourquoi": "espace à l'aile dame"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Bb4",
     "pourquoi": "cloue le cavalier c3"
    },
    {
     "san": "Bxc3+",
     "pourquoi": "double les pions blancs"
    },
    {
     "san": "Ne7",
     "pourquoi": "développe en couvrant g7"
    },
    {
     "san": "Qc7",
     "pourquoi": "vise c3 et e5"
    },
    {
     "san": "Qa5",
     "pourquoi": "vise c3 et a3"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4",
  "nom": "Française Winawer",
  "sens": "cloue le cavalier c3 : e4 n'est plus vraiment défendu ; les Noirs échangeront le fou en c3 pour doubler les pions blancs et jouer dessus",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "gagne l'espace et prépare a3 : après …c5 a3 Fxc3+ bxc3, les Blancs ont la paire de fous et l'attaque sur g7 avec Dg4, les Noirs les pions doublés à viser"
   },
   {
    "san": "exd5",
    "pourquoi": "échange : simple et solide, moins ambitieux"
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "laisse …dxe4 Fxe4 Cf6 : le fou est chassé et e4 est perdu pour rien"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5",
  "nom": "Winawer, variante d'avance",
  "sens": "gagne l'espace et vise g7 pour plus tard (Dg4) ; prépare a3 pour chasser le fou",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque la base d4 ; …Cc6 et …Db6 ou …Da5 suivent"
   },
   {
    "san": "Ne7",
    "pourquoi": "développe en gardant …c5 pour plus tard"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5",
  "sens": "attaque la base d4",
  "plan": [
   {
    "san": "a3",
    "pourquoi": "force la décision du fou : …Fxc3+ bxc3 donne la paire de fous aux Blancs contre les pions doublés"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3",
  "sens": "force le fou à choisir : échanger en c3 ou reculer",
  "plan": [
   {
    "san": "Bxc3+",
    "pourquoi": "double les pions blancs sur la colonne c : la cible des Noirs pour toute la partie"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3",
  "nom": "Winawer, ligne principale",
  "sens": "reprend du pion : pions doublés c2-c3, mais paire de fous et centre solide",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "développe en protégeant g7 contre Dg4, et le cavalier ira en f5 ou c6"
   },
   {
    "san": "Qc7",
    "pourquoi": "vise c3 et e5 ; permet …Dxc3+ dans certaines lignes"
   }
  ],
  "schema": {
   "blancs": [
    "Dg4 contre g7 : si les Noirs roquent court, l'attaque est forte ; sinon jouer a4, Fa3 et le fou sur la grande diagonale",
    "Cf3, Fd3 et h4-h5 à l'aile roi"
   ],
   "noirs": [
    "…Db6 ou …Da5 contre les pions c3 et a3 ; …Cc6, …Fd7-a4 pour fixer c2",
    "garder le roi au centre ou roquer long si Dg4 attaque"
   ],
   "coupsBlancs": [
    {
     "san": "Qg4",
     "pourquoi": "attaque g7"
    },
    {
     "san": "Nf3",
     "pourquoi": "développe"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "a4",
     "pourquoi": "prépare Fa3 sur la grande diagonale"
    },
    {
     "san": "Ba3",
     "pourquoi": "le fou sur a3-f8"
    },
    {
     "san": "h4",
     "pourquoi": "lance l'aile roi"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Qd2",
     "pourquoi": "tient c3 et prépare le roque long"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand c'est sûr"
    },
    {
     "san": "Be2",
     "pourquoi": "développe simplement"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Ne7",
     "pourquoi": "développe en couvrant g7"
    },
    {
     "san": "Qc7",
     "pourquoi": "vise c3 et e5"
    },
    {
     "san": "Qa5",
     "pourquoi": "vise c3 et a3"
    },
    {
     "san": "Nbc6",
     "pourquoi": "deuxième attaquant de d4"
    },
    {
     "san": "Bd7",
     "pourquoi": "prépare …Fa4 contre c2"
    },
    {
     "san": "Ba4",
     "pourquoi": "fixe c2"
    },
    {
     "san": "cxd4",
     "pourquoi": "ouvre la colonne c"
    },
    {
     "san": "c4",
     "pourquoi": "ferme et fixe les pions blancs"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roi à l'aile dame si Dg4 attaque"
    },
    {
     "san": "f6",
     "pourquoi": "casse e5"
    },
    {
     "san": "Nf5",
     "pourquoi": "contre d4"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4",
  "nom": "Française, défense Rubinstein",
  "sens": "échange au centre tout de suite : les Noirs renoncent à la tension contre un développement facile ; en échange les Blancs ont plus d'espace",
  "plan": [
   {
    "san": "Nxe4",
    "pourquoi": "reprend en centralisant le cavalier : il vise f6, d6 et g5"
   }
  ],
  "schema": {
   "blancs": [
    "garder l'espace : Cf3, Fd3, De2, O-O ou O-O-O, c3 pour tenir d4",
    "empêcher …c5 d'égaliser : répondre dxc5 ou garder le centre selon le moment",
    "le cavalier e4 s'échange en f6 quand cela déforme les pions noirs, sinon il reste central"
   ],
   "noirs": [
    "…Cd7 puis …Cgf6 pour échanger le cavalier central sans abîmer les pions",
    "…c5 au bon moment pour libérer la position, puis …b6 et …Fb7",
    "rester solide : pas de pion faible, échanger les pièces si l'espace manque"
   ],
   "coupsBlancs": [
    {
     "san": "Nf3",
     "pourquoi": "développe"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "Qe2",
     "pourquoi": "prépare le roque et tient e4"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roque long, attaque à l'aile roi"
    },
    {
     "san": "c3",
     "pourquoi": "tient d4"
    },
    {
     "san": "Nxf6+",
     "pourquoi": "échange quand cela déforme les pions"
    },
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne e"
    },
    {
     "san": "Ne5",
     "pourquoi": "le cavalier central"
    },
    {
     "san": "c4",
     "pourquoi": "espace au centre"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …Fxc5 ne gagne pas de temps"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nd7",
     "pourquoi": "prépare …Cgf6"
    },
    {
     "san": "Ngf6",
     "pourquoi": "échange le cavalier central"
    },
    {
     "san": "Nxf6",
     "pourquoi": "reprend sans abîmer les pions"
    },
    {
     "san": "c5",
     "pourquoi": "libère la position"
    },
    {
     "san": "b6",
     "pourquoi": "prépare …Fb7"
    },
    {
     "san": "Bb7",
     "pourquoi": "le fou sur la grande diagonale"
    },
    {
     "san": "Be7",
     "pourquoi": "développe"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Qc7",
     "pourquoi": "la dame active"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou actif"
    },
    {
     "san": "Nf6",
     "pourquoi": "attaque le cavalier central"
    },
    {
     "san": "Bd7",
     "pourquoi": "variante Fort Knox : vers c6"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4",
  "sens": "reprend en centralisant : le cavalier e4 vise f6 et d6, et gêne le développement noir",
  "plan": [
   {
    "san": "Nd7",
    "pourquoi": "prépare …Cgf6 : si Cxf6, le cavalier d7 reprend et les pions restent intacts"
   },
   {
    "san": "Nf6",
    "pourquoi": "attaque le cavalier tout de suite ; après Cxf6+ il faut reprendre de la dame ou du pion g (pions doublés, mais colonne g ouverte)"
   },
   {
    "san": "Bd7",
    "pourquoi": "variante Fort Knox : le fou va en c6 sur la grande diagonale, pour l'échanger contre le cavalier central"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7",
  "sens": "prépare …Cgf6 pour échanger le cavalier central sans abîmer les pions",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "développe ; le cavalier e4 reste tant que l'échange n'est pas forcé"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3",
  "sens": "développe en gardant le cavalier central",
  "plan": [
   {
    "san": "Ngf6",
    "pourquoi": "propose l'échange du cavalier central : Cxf6+ Cxf6 et les pions noirs sont intacts"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6",
  "sens": "propose l'échange du cavalier central ; après Cxf6+ Cxf6 la structure noire est saine",
  "plan": [
   {
    "san": "Nxf6+",
    "pourquoi": "échange avant d'être chassé, puis Fd3 et De2 : l'espace et le développement contre une position solide"
   },
   {
    "san": "Bd3",
    "pourquoi": "garde le cavalier un coup de plus ; si …Cxe4 Fxe4 le fou est central"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6",
  "sens": "attaque le cavalier central tout de suite",
  "plan": [
   {
    "san": "Nxf6+",
    "pourquoi": "échange : …Dxf6 sort la dame tôt (Cf3 la chassera), …gxf6 double les pions mais ouvre la colonne g"
   },
   {
    "san": "Bd3",
    "pourquoi": "garde la tension et développe vers h7"
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "recule sans raison : le cavalier perd deux temps et les Noirs égalisent avec …c5 ou …Fd6"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+",
  "sens": "échange le cavalier avant d'être chassé ; la reprise décide de la structure noire",
  "plan": [
   {
    "san": "Qxf6",
    "pourquoi": "garde les pions intacts ; la dame sera chassée par Cf3, il faudra la replacer"
   },
   {
    "san": "gxf6",
    "pourquoi": "pions doublés mais colonne g ouverte et centre renforcé : plus tranchant"
   }
  ],
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 dxe4",
  "nom": "Française, défense Rubinstein (par 3.Cd2)",
  "sens": "échange au centre : même structure que la Rubinstein classique",
  "plan": [
   {
    "san": "Nxe4",
    "pourquoi": "reprend en centralisant le cavalier"
   }
  ],
  "schema": {
   "blancs": [
    "garder l'espace : Cgf3, Fd3, De2, O-O, c3 pour tenir d4",
    "le cavalier e4 s'échange en f6 quand cela déforme les pions noirs"
   ],
   "noirs": [
    "…Cd7 puis …Cgf6 pour échanger le cavalier central sans abîmer les pions",
    "…c5 au bon moment, puis …b6 et …Fb7"
   ],
   "coupsBlancs": [
    {
     "san": "Nf3",
     "pourquoi": "développe"
    },
    {
     "san": "Bd3",
     "pourquoi": "vers h7"
    },
    {
     "san": "Qe2",
     "pourquoi": "prépare le roque et tient e4"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "O-O-O",
     "pourquoi": "roque long, attaque à l'aile roi"
    },
    {
     "san": "c3",
     "pourquoi": "tient d4"
    },
    {
     "san": "Nxf6+",
     "pourquoi": "échange quand cela déforme les pions"
    },
    {
     "san": "Bg5",
     "pourquoi": "cloue le cavalier f6"
    },
    {
     "san": "Re1",
     "pourquoi": "la tour sur la colonne e"
    },
    {
     "san": "Ne5",
     "pourquoi": "le cavalier central"
    },
    {
     "san": "c4",
     "pourquoi": "espace au centre"
    },
    {
     "san": "dxc5",
     "pourquoi": "prend quand …Fxc5 ne gagne pas de temps"
    }
   ],
   "coupsNoirs": [
    {
     "san": "Nd7",
     "pourquoi": "prépare …Cgf6"
    },
    {
     "san": "Ngf6",
     "pourquoi": "échange le cavalier central"
    },
    {
     "san": "Nxf6",
     "pourquoi": "reprend sans abîmer les pions"
    },
    {
     "san": "c5",
     "pourquoi": "libère la position"
    },
    {
     "san": "b6",
     "pourquoi": "prépare …Fb7"
    },
    {
     "san": "Bb7",
     "pourquoi": "le fou sur la grande diagonale"
    },
    {
     "san": "Be7",
     "pourquoi": "développe"
    },
    {
     "san": "O-O",
     "pourquoi": "roi à l'abri"
    },
    {
     "san": "Qc7",
     "pourquoi": "la dame active"
    },
    {
     "san": "Bd6",
     "pourquoi": "le fou actif"
    },
    {
     "san": "Nf6",
     "pourquoi": "attaque le cavalier central"
    },
    {
     "san": "Bd7",
     "pourquoi": "variante Fort Knox : vers c6"
    }
   ]
  },
  "auteur": "livre du 6 octobre 2026 (IA, vérifié au moteur), à relire"
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3",
  "sens": "Développe le cavalier et défend d4, que le cavalier noir attaque déjà. Il prépare c3 puis Fd3 pour solidifier la chaîne d4-e5 et viser le roque noir.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite le pion e5, la tête de la chaîne blanche. Si les Blancs prennent sur f6, le cavalier g8 reprend et se développe. Si les Blancs laissent, les Noirs ouvrent la colonne f. En échange, la case e6 devient un peu fragile et le roi noir est moins abrité."
   },
   {
    "san": "Nh6",
    "pourquoi": "Sort le cavalier sans bloquer le fou f8. De h6, il ira en f5 pour attaquer d4 une deuxième fois. Les Blancs peuvent le prendre avec Fxh6, mais cela double un pion sans vraiment gêner les Noirs."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou de cases blanches, le pion e6 ne le gêne plus. Il protège c6 et garde l'option Df6 ou f6 pour plus tard. Coup calme qui ne crée pas de faiblesse."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Coup naturel mais le fou ne fait rien sur e7 : il bloque la dame et la case e7 manque pour le cavalier g8. Après c3, le pion d4 est solide et les Blancs jouent Fd3 tranquillement. Les Noirs ont perdu un temps."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame bloque le fou f8 et le cavalier g8 n'a plus de bonne case. Les Blancs jouent Fd3 puis roquent, et le développement noir reste coincé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -88
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3",
  "sens": "développe le cavalier vers le centre et prépare le roque. Il soutient aussi d4 et e5, les deux pions qui donnent l'espace aux Blancs. Si le fou noir vient en b5, les Blancs l'échangent avec échec et gardent leur avantage d'espace.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque la base de la chaîne de pions blancs en d4. C'est le plan de toute la Française : miner le centre blanc avec c5, puis Cc6 et Db6. Le fou en d7 est bien placé pour soutenir c6 après l'échange. Les Blancs devront défendre d4 avec c3."
   },
   {
    "san": "a6",
    "pourquoi": "prépare Fb5 sans permettre Fxb5+ : les Noirs reprendraient du pion a6. Le but est d'échanger le mauvais fou de la Française contre le bon fou blanc de d3 ou e2. C'est lent, mais le centre est fermé, donc les Blancs ne peuvent pas punir."
   },
   {
    "san": "h6",
    "pourquoi": "coup d'attente utile : enlève la case g5 au cavalier et au fou blancs, et permet plus tard Cf5 ou Ch7. Il reste moins direct que c5, qui doit venir de toute façon."
   }
  ],
  "erreurs": [
   {
    "san": "Nh6",
    "pourquoi": "le cavalier sort sur le bord et se fait prendre aussitôt : Fxh6 gxh6 ruine les pions du roque noir. Le roi ne pourra plus se mettre à l'abri côté roi. Il faut d'abord jouer c5 et Cc6, puis Cge7."
   },
   {
    "san": "c6",
    "pourquoi": "trop timide : le pion ne fait plus pression sur d4. Pour attaquer le centre, les Noirs devront rejouer c5 en perdant un temps, pendant que les Blancs développent Fd3 et c3 tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -23
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3",
  "nom": "Défense française, variante Tarrasch, 3...Cc6 (variante Guimard)",
  "sens": "sort le dernier cavalier du roi vers le centre et garde la pression sur e4 : d4 est désormais protégé deux fois, et les Blancs préparent e5 puis c3 pour verrouiller le centre.",
  "menace": "Aucune menace directe ; e5 suivi de c3 viendrait gagner de l'espace et figer le cavalier noir en c6 devant le pion c7.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4 une deuxième fois. Si les Blancs jouent e5, le cavalier va en d7 et les Noirs attaquent ensuite d4 avec f6. Les Blancs doivent décider tout de suite de ce qu'ils font du pion e4."
   },
   {
    "san": "dxe4",
    "pourquoi": "Prend sur e4 pour libérer le centre : le cavalier blanc reprend en e4, puis les Noirs jouent Cf6 pour l'échanger ou le chasser. Le fou c8 respire mieux, mais les Blancs gardent un peu plus d'espace."
   },
   {
    "san": "h6",
    "pourquoi": "Coup utile d'attente : retire la case g5 au cavalier et au fou blancs, ce qui prépare Cf6 sans craindre de clouage. Laisse aux Blancs le choix de jouer e5 ou c3."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou sur une case passive. Après c3 puis la reprise en e4, les Blancs tiennent un centre solide (d4, Ce4) et le fou e7 ne fait rien ; le cavalier c6 bloque toujours le pion c7, donc les Noirs n'ont aucun levier sur d4."
   },
   {
    "san": "Nb8",
    "pourquoi": "Perd un temps de développement pour recommencer. Les Blancs gagnent aussitôt un coup avec Fb5+ : les Noirs doivent jouer c6, puis le fou recule en d3 avec un développement d'avance pour les Blancs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -71
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6",
  "sens": "attaque la tête de la chaîne blanche : le pion f6 vise e5 pour casser le centre et ouvrir la colonne f, quitte à affaiblir e6 et l'abri du roi noir",
  "menace": "fxe5 puis dxe5 : les Noirs ouvrent la colonne f et jouent ensuite Fc5 ou Dh4 contre un centre blanc réduit",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "cloue le cavalier c6, le seul défenseur de e5 avec f6. Prépare Bxc6 puis exf6 : le pion e5 tient, et les Noirs gardent une structure abîmée sur c6. Laisse aux Noirs Fd7 pour se décloer."
   },
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur la diagonale b1-h7, celle qui vise le roi noir dégarni par f6. Prépare le roque et exf6 au bon moment. Laisse aux Noirs fxe5, mais après dxe5 le fou garde le pion e5 bien soutenu."
   },
   {
    "san": "c3",
    "pourquoi": "soutient d4 pour qu'après fxe5 dxe5 le centre blanc reste solide. Prépare Fd3 et le roque sans se presser. Laisse aux Noirs l'initiative sur la colonne f, mais sans cible facile."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "perd un temps alors que e5 est attaqué. Après fxe5 dxe5 Ch6, les Noirs ont ouvert la colonne f, développé un cavalier qui va en f5 ou f7, et h3 n'a rien apporté : le pion e5 devient une cible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 85
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 c5",
  "nom": "Variante d'avance (Française), avec 3...Fd7",
  "sens": "mine la base de la chaîne de pions blancs : le pion d4 est attaqué et devra être défendu ou échangé. C'est le plan central de toute la Française : faire sauter d4 pour affaiblir e5.",
  "menace": "cxd4 : prendre en d4 et obliger Cxd4, ce qui supprime le soutien du pion e5 et ouvre la colonne c pour les Noirs.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Le coup classique : le pion c3 soutient d4 et la chaîne d4-e5 reste solide. Les Noirs continueront avec Cc6 et Db6 pour mettre la pression sur d4 et b2 ; les Blancs répondront avec Fe2 ou Fd3 et un roque tranquille."
   },
   {
    "san": "c4",
    "pourquoi": "Attaque le pion d5 tout de suite au lieu de défendre d4. Le centre s'ouvre : si les Noirs prennent en d4, le cavalier reprend et le fou en f1 se développe facilement vers d3. Cela convient si l'on préfère un jeu de pièces plutôt qu'une chaîne de pions."
   },
   {
    "san": "dxc5",
    "pourquoi": "Supprime le pion attaqué en échangeant : plus de problème en d4. Le pion e5 reste avancé et prive le cavalier noir de la case f6. Les Noirs reprendront le pion avec Fxc5 et développeront vite ; il faut alors soutenir e5 avec Fd3 et Df… ou Fb3 sans traîner."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Le cavalier bloque la case c3, donc le pion c2 ne peut plus soutenir d4. Après Cc6 et cxd4, la chaîne s'effondre : le pion e5 perd son appui et les Noirs reprennent en c5 avec le fou, actifs et sans faiblesse."
   },
   {
    "san": "a4",
    "pourquoi": "Perd du temps sur l'aile alors que le centre brûle. Les Noirs jouent cxd4, Cxd4 puis Dc7 : la dame attaque e5 et le pion a4 n'a servi à rien. Il fallait d'abord régler la question de d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4",
  "nom": "Défense française, variante d'avance, 4.Cf3 cxd4",
  "sens": "Échange le pion c contre le pion d4 : la base de la chaîne blanche disparaît et la case d4 devient une cible à attaquer avec le cavalier c6 et la dame b6.",
  "menace": "Gagner net le pion d4 si les Blancs ne le reprennent pas.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le pion et centralise le cavalier. Après ...Cc6, le cavalier pourra être échangé ou se replier, mais les Blancs gardent e5 et un développement facile (Fd3, 0-0)."
   },
   {
    "san": "Bd3",
    "pourquoi": "Ne reprend pas tout de suite : le fou vise h7 et le roi noir. Le pion d4 sera repris plus tard par Cxd4 ou Dxd4, et les Blancs gagnent un temps de développement."
   },
   {
    "san": "Qxd4",
    "pourquoi": "Reprend avec la dame au centre. Elle sera chassée par ...Cc6, mais pourra se replier en f4 ou g4 pour viser l'aile roi noire, où le pion e5 gêne la défense."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "Développe mais oublie le pion d4 : après ...Cc6 puis ...Ce7-f5 ou ...Db6, les Noirs attaquent d4 à plusieurs reprises et le gagnent ou forcent des concessions. Le fou en e2 est aussi passif comparé à d3."
   },
   {
    "san": "a3",
    "pourquoi": "Coup d'attente inutile : il ne reprend pas en d4 et ne développe rien. Après ...Cc6 3.c3 dxc3, les Blancs ont perdu un pion et leur structure centrale est ouverte sans compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -11
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4",
  "nom": "Défense française, variante d'avance, 4.Dg4 (ligne secondaire)",
  "sens": "Prend le pion central d4 pendant que la dame blanche est partie sur l'aile roi ; les Noirs gagnent un pion et préparent …Cc6 pour tenir d4 et attaquer e5.",
  "menace": "Garder le pion d4 avec …Cc6 ; si les Blancs tardent, …Cc6 puis …Dc7 ou …Db6 attaquent e5 et b2.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe en attaquant d4 : les Noirs ne peuvent pas tout défendre à la fois. Le cavalier protège aussi e5 et prépare le roque. Les Blancs ne récupèrent peut-être pas le pion tout de suite, mais ils sortent leurs pièces vite."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers h7 : avec la dame en g4, les Blancs visent le roi noir si celui-ci roque trop tôt. Le fou soutient aussi un futur f4-f5 contre e6. Les Noirs gardent le pion mais doivent surveiller leur aile roi."
   },
   {
    "san": "Qxd4",
    "pourquoi": "Reprend le pion tout de suite. Simple, mais la dame revient au centre où …Cc6 la chasse avec gain de temps. Les Noirs développent gratuitement : c'est le prix à payer pour rester à égalité matérielle."
   }
  ],
  "erreurs": [
   {
    "san": "Qd1",
    "pourquoi": "Ramène la dame à la maison : les Blancs ont joué deux coups de dame pour rien. Après …f6 puis …Cc6, les Noirs attaquent e5 et gardent le pion d4 en avance de développement."
   },
   {
    "san": "Qh3",
    "pourquoi": "La dame se range sur h3 sans rien attaquer. Après …Cc6 et f4, le cavalier saute en b4 et vise c2 : les Blancs ont perdu un pion et n'ont aucune pièce sortie."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -96
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5",
  "nom": "Défense française, variante d'avance, 4.dxc5",
  "sens": "Reprend le pion en développant : le fou sort sur une diagonale active vers f2 et les Noirs gardent le centre d5-e6. Le plan est de ronger e5 avec …Cc6, …Cge7-f5 ou …Dc7, et de regarder la case f2 avec …Db6.",
  "plan": [
   {
    "san": "Nd2",
    "pourquoi": "Développe en gardant le cavalier c3 libre pour b3 ou f3 ; ne bloque pas le pion c, qui pourra aller en c3 pour soutenir e5. Laisse aux Noirs …Cc6 et …Db6, mais f2 reste protégé par le roi."
   },
   {
    "san": "Nf3",
    "pourquoi": "Développe et défend e5, le pion qui gêne les Noirs. Prépare Fd3 et le petit roque. Les Noirs répondent …Cc6 et …Db6 pour appuyer sur b2 et f2."
   },
   {
    "san": "Qg4",
    "pourquoi": "Attaque g7, mal défendu puisque le fou a quitté f8. Les Noirs doivent répondre précisément (…Cge7 ou …Rf8), mais la dame sortie tôt peut être chassée par …Cf5 ou …Dc7-h5 plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "f4",
    "pourquoi": "Veut soutenir e5, mais affaiblit la diagonale a7-g1 et la case e3 : après …Ch6, …Cc6 et …Db6, le fou c5 et la dame visent f2 et g1, et le roi blanc a du mal à roquer."
   },
   {
    "san": "c4",
    "pourquoi": "Attaque d5 trop tôt : …Db6 cloue le pion b2 et menace f2 ; les Blancs doivent défendre avec Dc2 sans rien développer, et …Cc6 arrive avec tempo. Le centre blanc se disloque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -32
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3",
  "nom": "Variante d'avance, ligne principale (5...Cc6)",
  "sens": "Protège d4 en sortant une pièce : le cavalier couvre d4 et e5, et prépare le petit roque. Le pion d4 est attaqué deux fois (c5, Db6) et défendu deux fois (c3, Cf3).",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Attaque d4 une troisième fois : avec c5, Db6 et Cc6, le pion est pressé de tous côtés. Développe une pièce vers la case idéale et laisse aux Blancs le souci de tenir le centre, en général par Fd3 ou a3."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou de case-problème en passant par d7 : il visera b5 pour échanger le mauvais fou (bloqué par e6 et d5). Prépare aussi ...Tc8 et garde Cc6 pour plus tard. Les Blancs obtiennent un temps pour Fd3 ou Fe2."
   },
   {
    "san": "Nh6",
    "pourquoi": "Développe le cavalier roi vers f5, d'où il attaquera d4 encore une fois. Évite Ce7 qui bloque le fou f8. Les Blancs peuvent le prendre par Fxh6, ce qui ouvre la colonne g mais double nos pions."
   }
  ],
  "erreurs": [
   {
    "san": "Ne7",
    "pourquoi": "Le cavalier ne menace rien et retire la défense de c5. Après Fd3 Fd7 dxc5, le pion c5 tombe sans compensation et la dame b6 se retrouve mal placée face à Fe3."
   },
   {
    "san": "f6",
    "pourquoi": "Ouvre la diagonale a2-g8 et la colonne f devant son roi avant tout développement. Les Blancs jouent Fd3 et roquent, puis exploitent les cases e6 et g6 affaiblies ; e5 tient facilement grâce à Cf3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -35
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6",
  "nom": "Variante d'échange, avec c4",
  "sens": "Développe le cavalier en défendant d5 : si les Blancs prennent sur d5, le cavalier reprend et se place au centre. Garde la tension au lieu de capturer c4, ce qui rendrait le pion aux Blancs après Fxc4.",
  "menace": "Prendre sur c4 au bon moment (dxc4), par exemple quand le fou blanc ne peut pas reprendre sans perdre un temps.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Développe une pièce et attaque d5 une deuxième fois. Les Blancs menacent cxd5 suivi de Cxd5 pour éliminer le pion central noir. Laisse aux Noirs Fb4 ou Fe7 : il faudra alors décider quoi faire avec la tension c4-d5."
   },
   {
    "san": "Nf3",
    "pourquoi": "Développe et prépare le petit roque. Contrôle e5 et laisse la question c4-d5 pour plus tard. Les Noirs peuvent répondre Fb4+ ou dxc4, mais les Blancs reprennent sans dommage."
   },
   {
    "san": "cxd5",
    "pourquoi": "Échange tout de suite : les Noirs reprennent Cxd5 et le cavalier est bien placé au centre. Simple et clair, mais cela libère le jeu noir et abandonne un peu de pression."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Perd un temps sans développer. Les Noirs jouent Fb4+ : le fou cloue le cavalier qui arrive en c3, puis les Noirs roquent et sont en avance de deux coups. Le pion c4 reste faible et le centre blanc n'est plus soutenu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6",
  "nom": "Tarrasch, variante Guimard",
  "sens": "développe le cavalier en attaquant e4 une deuxième fois : le pion est maintenant attaqué par d5 et par f6, et seul le cavalier d2 le défend.",
  "menace": "prendre dxe4 : après Cxe4 Cxe4, les Noirs gagnent un pion ou obtiennent des échanges qui libèrent leur jeu.",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "avance le pion attaqué au lieu de le défendre. Le cavalier f6 doit reculer en d7, les Blancs gagnent de l'espace et préparent c3 pour tenir d4 contre le futur f6. Les Noirs auront un jeu serré, avec le fou c8 bloqué par e6."
   }
  ],
  "erreurs": [
   {
    "san": "exd5",
    "pourquoi": "résout la tension mais rend le jeu facile aux Noirs : après exd5, leur fou c8 est libéré et ils développent sans problème. Les Blancs perdent tout leur avantage d'ouverture."
   },
   {
    "san": "Bd3",
    "pourquoi": "développe sans régler le problème de e4 : Cb4 attaque le fou d3, et après Cxd3 les Noirs gagnent la paire de fous. Le pion e4 reste de plus attaqué deux fois."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 74
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 c5 c3",
  "nom": "Française, variante d'avance (ligne avec 3...Fd7)",
  "sens": "renforce le centre : le pion c3 protège d4, donc la chaîne d4-e5 tient même si les Noirs attaquent d4 avec le cavalier et la dame.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Le cavalier attaque d4 une deuxième fois (avec le pion c5). C'est le coup naturel : il développe une pièce et prépare Db6 pour viser d4 et b2 en même temps. Les Blancs devront jouer Fe2 ou Fd3 puis roquer."
   },
   {
    "san": "Qb6",
    "pourquoi": "La dame attaque d4 et le pion b2. Les Blancs ne peuvent pas jouer Fd3 tout de suite sans perdre un pion sur d4. Attention : il faut suivre avec Cc6 et Ce7, pas attaquer seul avec la dame."
   },
   {
    "san": "Ne7",
    "pourquoi": "Le cavalier passe par e7 pour aller en f5, d'où il attaque d4 encore. Il ne bloque pas le pion f et laisse la case c6 à l'autre cavalier. Plus lent, mais très solide."
   }
  ],
  "erreurs": [
   {
    "san": "b5",
    "pourquoi": "Pousser les pions de l'aile dame sans développer est une perte de temps. Après Fd3 c4 Fc2, les Blancs gardent un centre intact et toutes leurs pièces sortent ; les Noirs ont affaibli c5 et c6 et n'ont plus de pression sur d4. La tension sur d4 est l'atout des Noirs : il ne faut pas la relâcher."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -30
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6",
  "nom": "Variante d'échange",
  "sens": "Développe le fou sur la diagonale b8-h2, celle qui vise le roi blanc après le petit roque. Prépare Ne7 ou Nf6 et le roque, et dissuade Bf4 : les Noirs cherchent un jeu actif sur l'aile roi dans cette position symétrique.",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "Attaque tout de suite le pion d5 et casse la symétrie. Si ...dxc4, Bxc4 développe le fou avec tempo ; sinon, après cxd5 les Blancs obtiennent un pion isolé adverse ou de l'espace au centre. Le pion c4 reste un peu exposé, il faudra le soutenir."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vers h7, en miroir du fou noir. Prépare O-O, puis Re1 pour prendre la colonne e ouverte. Laisse aux Noirs le temps de jouer ...Ne7 et ...Bf5 pour échanger les fous."
   },
   {
    "san": "Be2",
    "pourquoi": "Développement plus modeste mais solide : le fou ne bloque pas la colonne d et le roque suit vite. Idéal si l'on veut une partie calme ; les Noirs peuvent toutefois s'installer librement avec ...Nf6 et ...O-O."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 19
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5",
  "sens": "cloue le cavalier c6 sur le roi et prépare Fxc6+ puis exf6 : sans le cavalier, e5 tient et les Noirs restent avec des pions doublés sur c6",
  "menace": "Fxc6+ bxc6 puis exf6 : les Blancs gagnent le pion e5 des mains de leur adversaire et abîment la structure noire",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "demande tout de suite au fou de choisir : s'il prend en c6, bxc6 ouvre la colonne b et les Noirs reprennent plus tard en e5 avec fxe5 ; s'il recule en a4, les Noirs gagnent du temps pour Ce7 et Fd7"
   },
   {
    "san": "Bd7",
    "pourquoi": "décloue le cavalier en développant une pièce : si Fxc6 Fxc6, le fou noir se retrouve bien placé sur la grande diagonale. Prépare Dd7 et le petit roque ou fxe5"
   },
   {
    "san": "Ne7",
    "pourquoi": "développe en couvrant c6 une deuxième fois : après Fxc6 Cxc6, pas de pions doublés. Laisse pourtant aux Blancs le temps de jouer c3 ou O-O pour renforcer e5"
   }
  ],
  "erreurs": [
   {
    "san": "Nh6",
    "pourquoi": "le cavalier sort sur le bord et se fait prendre aussitôt : Fxh6 gxh6 casse les pions du roque noir, et le roi n'aura plus d'abri sûr"
   },
   {
    "san": "Qe7",
    "pourquoi": "la dame bloque le fou f8 et ne décloue rien : après c4 Fd7 cxd5, le centre noir s'écroule et la dame se retrouve mal placée face aux pièces blanches"
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -74
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3",
  "sens": "Développe le cavalier en attaquant le pion d4 : les Noirs doivent choisir entre le garder et sortir leurs pièces. Le cavalier soutient aussi e5 et laisse le roi blanc roquer vite.",
  "menace": "Nxd4 : reprendre le pion tout en gardant une position très active (dame en g4, pions e5 et f2 prêts à avancer).",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Défend d4 en développant une pièce : le cavalier tient le pion et regarde aussi e5. Les Noirs gardent leur pion supplémentaire et peuvent continuer avec ...Qc7 ou ...Nge7. Les Blancs ont de l'activité, mais rien de gratuit."
   }
  ],
  "erreurs": [
   {
    "san": "Qd7",
    "pourquoi": "La dame bloque le fou c8 et ne protège pas d4 : Nxd4 reprend le pion, puis Nc6 Nxc6 et les Noirs ont perdu leur avantage matériel sans rien développer."
   },
   {
    "san": "Qc7",
    "pourquoi": "Attaque e5 mais abandonne d4 : après Bd3 f6 Nxd4, les Blancs récupèrent le pion avec toutes leurs pièces dehors, alors que le roi noir est resté au centre et que f6 a affaibli e6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 119
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4",
  "nom": "Défense française, variante d'avance (4.Cf3 cxd4 5.Cxd4)",
  "sens": "reprend le pion en plaçant le cavalier au centre : il contrôle b5, c6, e6 et f5, et les Blancs conservent la chaîne d4-e5 sans elle, mais avec un pion e5 solide et un développement rapide.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "attaque tout de suite le cavalier d4. Les Blancs doivent choisir : l'échanger en c6 (ce qui donne aux Noirs un pion de plus au centre après ...bxc6) ou le replier avec perte de temps. Pendant ce temps, les Noirs développent une pièce vers le roi blanc."
   },
   {
    "san": "Ne7",
    "pourquoi": "développe le cavalier roi par une case sûre, hors de portée de Fd3. Il vise f5 pour attaquer le cavalier d4 ou g6 pour mordre sur e5. Il laisse toutefois les Blancs jouer Fd3 et 0-0 sans être gênés."
   },
   {
    "san": "Qc7",
    "pourquoi": "met la dame sur la colonne c ouverte et attaque e5 une première fois. Elle prépare ...Cc6 et ...Cge7 pour prendre e5 à plusieurs. Attention : elle peut être chassée plus tard par Cb5."
   }
  ],
  "erreurs": [
   {
    "san": "Qb6",
    "pourquoi": "lorgne sur b2 et d4, mais après Fe3 la prise Dxb2 est punie : Cbd2 piège la dame sur b2, qui n'a plus de case de sortie. Même sans prendre, la dame est exposée à Cb5 ou Cc3-a4."
   },
   {
    "san": "Qa5+",
    "pourquoi": "l'échec ne gêne personne : Cc3 développe une pièce avec gain de temps, puis Cb3 chasse la dame une deuxième fois. Les Noirs perdent deux temps pour rien et le roi noir reste au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2",
  "sens": "Développe le cavalier sans boucher le pion c, qui pourra aller en c3 pour soutenir e5. De d2, le cavalier vise b3 (pour chasser le fou c5) ou f3 (pour défendre e5). Le roi garde f2 : ...Fxf2+ ne gagne rien pour l'instant.",
  "plan": [
   {
    "san": "Qb6",
    "pourquoi": "La dame appuie le fou sur la case f2 et attaque b2. Les Blancs doivent réagir (Cb3 ou Df3) avant de finir leur développement. C'est la façon la plus énergique de profiter du pion e5 avancé."
   },
   {
    "san": "Nc6",
    "pourquoi": "Attaque e5 une première fois en développant une pièce. Prépare ...Dc7 ou ...Db6 pour mettre encore plus de pression. Laisse aux Blancs Cgf3 pour défendre, mais le jeu reste facile."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier roi vers f5 ou g6, d'où il regardera e5 et d4. Évite les coups Dg4 contre g7, car le cavalier pourra revenir couvrir."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Recule le fou qui était bien placé sur la diagonale a7-g1. Après Dg4, g7 est attaqué et il faut jouer ...g6, ce qui affaiblit les cases noires autour du roi ; le fou ne peut plus défendre. Les Noirs ont perdu un temps pour rien."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le mauvais fou, qui reste bloqué par ses pions e6 et d5. Les Blancs jouent Cb3 : le fou c5 doit reculer en b6, puis Dg4 attaque g7. Les Noirs sont pris de court sur l'aile roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 33
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5",
  "sens": "Avance le pion attaqué au lieu de le défendre. Il chasse le cavalier f6, qui n'a qu'une bonne case (d7), et fixe un pion en e5 qui coupe l'aile roi noire en deux : le fou c8 reste enfermé derrière e6.",
  "menace": "exd5... non : exf6 gagne le cavalier f6 si les Noirs ne le bougent pas.",
  "plan": [
   {
    "san": "Nd7",
    "pourquoi": "Seul recul correct : le cavalier reste utile, il regarde e5 et prépare f6 pour attaquer la chaîne de pions. Les Blancs joueront c3 et Bd3, et garderont plus d'espace, mais les Noirs ont un plan clair."
   }
  ],
  "erreurs": [
   {
    "san": "Ne4",
    "pourquoi": "Le cavalier a l'air actif, mais il est seul en terrain ennemi : après c3 et Qc2, les Blancs le chassent et prennent le contrôle du centre sans rien donner."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Le pion d4 n'est pas gratuit : Nxd4 reprend, et le cavalier f6 doit encore reculer. Les Noirs ont perdu une pièce pour un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -72
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3",
  "nom": "Défense française, variante d'échange avec 4.c4",
  "sens": "développe le cavalier dame vers le centre et attaque d5 une deuxième fois : avec c4 et Cc3, deux pièces blanches visent le pion central noir, qui n'est défendu que par la dame et le cavalier f6.",
  "menace": "cxd5 suivi de Cxd5 : le pion central noir disparaît et le cavalier blanc s'installe au centre.",
  "plan": [
   {
    "san": "Bb4",
    "pourquoi": "cloue le cavalier c3 sur le roi : il ne peut plus prendre en d5. Développe le fou en préparant le petit roque. Si cxd5, les Noirs reprennent tranquillement Cxd5 et gardent un pion au centre. Les Blancs peuvent chasser le fou par Dа4+ ou Fd2, mais sans gagner de temps réel."
   },
   {
    "san": "Nc6",
    "pourquoi": "développe une pièce et attaque d4 : si les Blancs prennent cxd5, Cxd5 et le pion d4 devient faible. Prépare aussi Fe6 ou Fb4. Laisse aux Blancs c5 pour gagner de l'espace, mais cela relâche la pression sur d5."
   },
   {
    "san": "Be7",
    "pourquoi": "coup simple et solide : développe le fou, prépare le roque. Après cxd5 Cxd5, le centre reste équilibré. Moins actif que Fb4, car le cavalier c3 n'est pas cloué et peut échanger en d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4",
  "nom": "Variante d'échange, 4...Fd6 5.c4",
  "sens": "Attaque le pion d5 tout de suite pour casser la symétrie : soit les Noirs prennent et le fou arrive sur c4 avec tempo, soit les Blancs prennent sur d5 et laissent aux Noirs un pion isolé.",
  "menace": "cxd5, qui gagne un tempo sur la dame après ...Dxd5 (Cc3) ou laisse aux Noirs un pion d5 isolé après ...Cf6.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe en défendant d5 une deuxième fois. Si cxd5 Cxd5, le cavalier est bien centralisé et les Noirs ne gardent aucune faiblesse. Les Blancs peuvent jouer c5 pour chasser le fou d6 : ...Fe7 suffit."
   },
   {
    "san": "dxc4",
    "pourquoi": "Prend le pion offert. Les Blancs le récupèrent par Fxc4 avec un tempo de développement, mais les Noirs continuent ...Cf6 et ...0-0 et le pion d4 des Blancs devient isolé, une cible à long terme."
   },
   {
    "san": "c6",
    "pourquoi": "Renforce d5 avec un pion : plus de pion isolé possible. Le fou d6 garde sa diagonale et ...Cf6, ...0-0 suivent. Un peu passif, mais très solide pour un débutant."
   }
  ],
  "erreurs": [
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3, mais oublie d5. Après Db3 les Blancs attaquent d5 et b7 en même temps ; les Noirs doivent prendre ...Fxf3 gxf3 et perdent leur bon fou pour rien, sans résoudre le problème de d5."
   },
   {
    "san": "Nd7",
    "pourquoi": "Bloque le fou c8 et ne protège pas d5. Après Cc3 le pion d5 est attaqué deux fois ; les Noirs doivent prendre ...dxc4 Fxc4 et les Blancs ont tout développé avec tempo, la case e6 affaiblie."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -18
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6",
  "sens": "demande au fou de choisir tout de suite : prendre en c6 ou reculer. Avec le pion a7 en a6, b5 devient aussi une menace de harcèlement.",
  "menace": "Menace a6xb5 : le fou est attaqué et doit bouger ou prendre, sinon il est perdu.",
  "plan": [
   {
    "san": "Bxc6+",
    "pourquoi": "Prend le cavalier avant d'être chassé. Après bxc6, les Noirs ont des pions doublés sur la colonne c et moins de contrôle sur e5 : le pion e5 blanc tient mieux. Les Blancs gardent une structure saine et le centre."
   },
   {
    "san": "Bd3",
    "pourquoi": "Recule en gardant un rôle actif : le fou vise h7 et la case g6. Il soutient aussi e4 pour plus tard. Laisse aux Noirs fxe5, mais après dxe5 le centre blanc reste solide."
   },
   {
    "san": "Ba4",
    "pourquoi": "Garde la pression sur c6 et le clouage du cavalier. Les Noirs gagnent un temps avec b5 ou Bd7, mais le fou reste sur sa diagonale et peut revenir en b3."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Oublie que le fou est attaqué. Après a6xb5 Cxb5, les Noirs jouent fxe5 et gagnent une pièce contre un pion : le cavalier en b5 ne compense rien."
   },
   {
    "san": "O-O",
    "pourquoi": "Roque sans sauver le fou : axb5 gagne une pièce entière. Un développement ne vaut jamais un fou perdu gratuitement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 75
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3",
  "nom": "Variante Tarrasch, ligne ouverte 3...c5 4.exd5 exd5",
  "sens": "sort le deuxième cavalier vers le centre : il surveille d4 et e5, et libère la case f1 pour le fou (Fb5+) et le roque.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe le cavalier sur sa meilleure case : il défend d5 et prépare le roque. Après Fb5+, on peut répondre Fd7 ou Cc6 sans dégât. Laisse aux Blancs le choix de prendre en c5, mais le pion se récupère facilement."
   },
   {
    "san": "Nc6",
    "pourquoi": "Attaque d4 et défend c5 d'un seul coup. Le centre noir tient. Attention : après Fb5, le cavalier est cloué, il faudra jouer Fd6 ou Cf6 et accepter que les Blancs échangent en c6."
   },
   {
    "san": "cxd4",
    "pourquoi": "Enlève tout de suite la tension au centre : les Blancs reprennent Cxd4 et le cavalier s'installe sur d4, comme ils le voulaient. En échange, le pion d5 devient isolé, mais les Noirs ont des cases libres (c5, f6) pour développer vite. Ligne simple à comprendre."
   }
  ],
  "erreurs": [
   {
    "san": "Qd7",
    "pourquoi": "Sort la dame trop tôt pour protéger d5 et parer un futur Fb5+ : elle gêne le fou c8 et le cavalier b8. Les Blancs jouent Ce5, la dame doit fuir en c7, puis Fb5+ vient avec gain de temps. Les Noirs perdent le fil du développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -13
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3",
  "nom": "Défense française, variante Tarrasch (3.Cd2 c5 4.exd5 Dxd5)",
  "sens": "sort le second cavalier et protège d4 : le fou f1 est maintenant libre d'aller en c4 pour chasser la dame noire.",
  "menace": "Fc4 : la dame devra encore bouger, les Blancs gagnent un temps de développement.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Prend d4 avant que Fc4 n'arrive. Les Blancs devront reprendre : après Fc4 Dd6, puis 0-0 Cf6 et Cb3 Cc6, les Noirs ont fini de régler le centre et développent tranquillement. Le pion d4 noir sera repris, mais sans danger."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en couvrant les cases du roi. Si Fc4, la dame va en d6 où elle est à l'abri et surveille toujours le centre. Laisse aux Blancs la petite tension sur d4 et c5, qui se règlera par cxd4."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 une seconde fois. Après Fc4 Dd6 et 0-0, la position reste solide. Un peu moins précis : la dame est chassée avant que les Noirs n'aient pris en d4."
   }
  ],
  "erreurs": [
   {
    "san": "Qd8",
    "pourquoi": "Recule la dame avant d'y être forcé : un temps perdu pour rien. Après Ce4 cxd4 Dxd4, la dame blanche trône au centre, les Blancs ont trois pièces sorties contre zéro, et c5 a disparu sans compensation."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le mauvais fou : il bouche la diagonale et ne gêne rien. Les Blancs jouent c4 pour chasser la dame (Df5), puis Db3 attaque b7 et la dame noire, mal placée, ne défend plus rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -16
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5",
  "nom": "Variante Steinitz (Française, 5.f4 c5)",
  "sens": "Attaque la base de la chaîne blanche en d4 : si d4 tombe, le pion e5 n'est plus soutenu. Prépare aussi Cc6 et Db6 pour accumuler la pression sur d4.",
  "menace": "cxd4 : gagne le pion d4 si les Blancs ne le défendent pas correctement (après Dxd4, Cc6 chasse la dame avec gain de temps).",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Défend d4 une fois de plus en développant le cavalier vers le roque. Garde la structure intacte : sur cxd4, les Blancs reprennent Cxd4 sans perdre de temps. Laisse aux Noirs Cc6 et Db6, mais Blancs répondent Fe3 et tout tient."
   },
   {
    "san": "Be3",
    "pourquoi": "Soutient d4 avec le fou, qui n'a pas de meilleure case. Prépare Cf3 et Dd2 : les pièces blanches se placent toutes derrière la chaîne d4-e5. Donne aux Noirs Db6 qui attaque b2, mais Dd2 ou Ca4 répondent sans dommage."
   },
   {
    "san": "Nce2",
    "pourquoi": "Retire le cavalier c3 qui serait chassé par cxd4 ou gêné par Cc6-b4, et libère c3 pour reprendre avec un pion sur dxc5 ou soutenir d4 par c3. Plus lent : laisse aux Noirs le temps de jouer Cc6 et Db6 tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "Développe une pièce, mais la mauvaise : d4 reste défendu par la seule dame. Après Cc6 Cf3 cxd4, le pion d4 tombe ou se rachète en concessions, et le fou e2 ne sert à rien derrière la chaîne de pions."
   },
   {
    "san": "h4",
    "pourquoi": "Coup d'attaque hors de propos : rien n'est encore défendu au centre. Après cxd4 Cb5 Cc6, le pion d4 est perdu et le cavalier b5 va être chassé par a6. Règle simple : on sécurise d4 avant de penser au roi noir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 39
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+",
  "nom": "Winawer, variation principale",
  "sens": "Échange le fou de cases noires contre le cavalier c3 : le fou était attaqué par a3 et n'avait pas de bonne retraite. En échange, les Blancs devront reprendre avec un pion et abîmer leur structure.",
  "menace": "Échec au roi blanc : les Blancs doivent reprendre en c3 immédiatement.",
  "plan": [
   {
    "san": "bxc3",
    "pourquoi": "Seule reprise correcte : le pion b2 capture et pare l'échec. Les pions c2-c3 sont doublés, mais les Blancs ont la paire de fous et un centre solide avec d4-e5. Ensuite, ils pourront jouer Df3, Cf3 ou Dg4 contre le roque noir. Les Noirs attaqueront le pion c3 et d4 avec Dc7, Ce7, Cbc6 et cxd4."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Bloque l'échec mais ne reprend pas le fou. Le fou noir en c3 mange alors d4 gratuitement, puis après Cf3 et Dc7 les Noirs ont un pion de plus et un centre blanc en ruine."
   },
   {
    "san": "Qd2",
    "pourquoi": "Même idée fausse : après Fxd2+ Fxd2 les Noirs jouent cxd4 et gagnent le pion d4. Les Blancs ont perdu un pion central et échangé leur dame-défense pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 74
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6",
  "nom": "Défense française, variante Nimzowitsch (4.Dg4)",
  "sens": "Défend d4 en développant une pièce : le cavalier tient le pion gagné et regarde aussi e5. Les Noirs gardent leur pion de plus et préparent ...Dc7 ou ...Cge7.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers le roque noir et dégage f1 pour roquer. Le fou vise h7 et soutient l'attaque de la dame. Les Blancs admettent qu'ils ont un pion de moins, mais jouent pour l'activité et la sécurité du roi."
   },
   {
    "san": "Qg3",
    "pourquoi": "Retire la dame d'une case où ...h5 ou ...Cge7-f5 la chasserait avec gain de temps. Depuis g3 elle protège e5 et garde un œil sur g7. Elle laisse le pion d4 aux Noirs, mais sans leur donner de tempo gratuit."
   },
   {
    "san": "c3",
    "pourquoi": "Attaque tout de suite le pion d4 pour le récupérer. Si les Noirs le prennent, les Blancs reprennent et ouvrent les lignes pour leurs pièces. Le prix : le cavalier b1 ne pourra plus aller sur c3, et les Noirs gardent un pion solide en d4 s'ils ne prennent pas."
   }
  ],
  "erreurs": [
   {
    "san": "Qf4",
    "pourquoi": "Place la dame devant le pion e5, qui devient une cible : ...f6 attaque le pion, et après c3 fxe5 la dame est gênée par ses propres pions. Les Noirs ouvrent la colonne f et récupèrent le centre."
   },
   {
    "san": "Qh3",
    "pourquoi": "Semble garder la pression sur e6, mais la dame s'écarte du centre. ...f6 ouvre le jeu, puis ...Dc7 attaque e5 : les Blancs doivent défendre au lieu d'attaquer, et le pion d4 reste aux Noirs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -126
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6",
  "nom": "Défense française, variante d'avance, 4.Cf3 cxd4 5.Cxd4 Cc6",
  "sens": "attaque le cavalier d4 tout en développant une pièce : le cavalier noir regarde aussi e5, le pion avancé des Blancs, et oblige les Blancs à prendre une décision avant de continuer leur développement.",
  "menace": "...Cxd4 suivi de ...Dxd4 ou ...Cxe5 : si les Blancs ne font rien, le cavalier d4 tombe ou le pion e5 devient une cible.",
  "plan": [
   {
    "san": "Nxc6",
    "pourquoi": "Échange tout de suite le cavalier attaqué. Après ...bxc6, les Noirs ont un pion de plus au centre, mais leur structure devient lourde : le pion c6 bloque la diagonale du fou c8 et les pions a7-c6 sont doublés. Les Blancs peuvent ensuite développer tranquillement avec Fd3 et 0-0, et viser plus tard la case c5 et la colonne b."
   },
   {
    "san": "Bb5",
    "pourquoi": "Cloue le cavalier c6 sur le roi noir au lieu de le fuir. Si les Noirs prennent en d4, Dxd4 recentralise la dame ; sinon les Blancs sont prêts à échanger en c6 pour abîmer les pions noirs puis roquer. Le fou se développe avec tempo : les Noirs doivent répondre à la pression plutôt que jouer leur propre plan."
   },
   {
    "san": "Nf3",
    "pourquoi": "Replie le cavalier sur sa case naturelle : il défend e5 et d4 et garde la pièce. Les Blancs perdent un temps, mais le cavalier est solide et prêt à soutenir le centre. Les Noirs gagnent un coup de développement, ce qui explique la petite préférence pour les Noirs."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Semble défendre d4, mais ignore la vraie faiblesse : e5. Après ...Cxe5, le pion central tombe gratuitement. Si les Blancs tentent f4 pour chasser le cavalier, il revient en c6 et les Blancs ont donné un pion pour rien."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe une pièce mais oublie que e5 n'est plus protégé par le cavalier d4 si celui-ci reste attaqué : ...Cxe5 gagne le pion tout de suite. Développer est bon, mais pas en laissant tomber un pion central."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -5
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6",
  "nom": "Défense française, variante d'avance (ligne 4.dxc5)",
  "sens": "Met deux pions blancs sous pression en même temps : la dame soutient le fou qui vise f2, et elle attaque b2 que personne ne défend. Les Blancs ne peuvent pas tout parer en un coup.",
  "menace": "Fxf2+ suivi de Dxb2 : le roi blanc perd son roque et la tour a1 est menacée.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "La dame couvre f2 depuis la deuxième rangée : le sacrifice Fxf2+ ne marche plus. Elle libère aussi d1 pour le cavalier (Cb3 devient possible) et prépare Cgf3 puis le roque. Les Noirs peuvent prendre b2 (Dxb2), mais après Cb3 et Tb1 la dame noire est chassée et les Blancs rattrapent le temps perdu."
   },
   {
    "san": "Nh3",
    "pourquoi": "Le cavalier défend f2 sans gêner le fou f1, qui pourra sortir en e2 ou d3. Les Blancs sont prêts à roquer vite. Le pion b2 reste faible : si les Noirs le prennent, Tb1 gagne un temps sur la dame, mais les Blancs restent un peu moins bien."
   }
  ],
  "erreurs": [
   {
    "san": "Nb3",
    "pourquoi": "Coup naturel pour chasser le fou, mais f2 n'est plus défendu : Fxf2+ ! Après Re2 (Rxf2 perd la dame par Dxb3... non, par la fourchette sur le roi), le fou revient en g1 et le roi blanc est pris au piège au centre, sans roque possible. Les Blancs perdent des pions et la partie est presque finie."
   },
   {
    "san": "Qf3",
    "pourquoi": "La dame défend f2, mais elle est mal placée : après Cc6 et Cb3, le fou noir saute en d4 et attaque b2 une seconde fois tout en bloquant la dame. Les Blancs doivent défendre passivement et perdent un pion ou le temps pour roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -29
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7",
  "nom": "Défense française, variante Tarrasch, système Guimard",
  "sens": "recule le cavalier attaqué sans le mettre hors jeu : il surveille e5 et prépare ...f6 pour attaquer la chaîne de pions blanche. Les Noirs comptent sur la pression sur e5 et d4 avec ...f6 et ...Cb6 ou ...Cb4.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Le coup le plus simple : il soutient d4 une fois pour toutes, donc e5 ne tombera pas. Ensuite Bd3, 0-0, et Re1 pour renforcer e5 quand ...f6 arrive. Les Blancs gardent plus d'espace et un jeu facile sur l'aile roi."
   },
   {
    "san": "Bb5",
    "pourquoi": "Cloue le cavalier c6, l'un des attaquants de d4 et e5. Si les Noirs prennent ou poussent ...a6, les Blancs échangent en c6 et abîment les pions noirs : la dame est facile à jouer dans ces structures."
   },
   {
    "san": "Nb3",
    "pourquoi": "Libère la case d2 pour le fou de c1, souvent enfermé dans la française. Le cavalier contrôle c5 et d4 reste défendu. Les Blancs pourront jouer Be2, 0-0 et garder un centre solide."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 68
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2",
  "nom": "Défense française, variante d'avance, 5...Fd7 6.Fe2",
  "sens": "Développe le fou tranquillement pour pouvoir roquer vite ; le fou sur e2 protège aussi f3 et d1, ce qui prépare à tenir la case d4 sans craindre ...Db6 et ...Fb5.",
  "plan": [
   {
    "san": "Nge7",
    "pourquoi": "Développe le cavalier sans bloquer le fou f8. De e7 il ira en f5 pour attaquer d4 une deuxième fois, ou en g6 pour viser e5. Il laisse aux Blancs le temps de roquer."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 avec une troisième pièce et vise aussi b2. Il force les Blancs à bien défendre le centre, mais la dame peut être harcelée plus tard par Cb3 ou a3-b4."
   },
   {
    "san": "f6",
    "pourquoi": "S'attaque tout de suite à la pointe e5 pour libérer les cases e5 et f6 pour les pièces noires. Il affaiblit un peu la case e6 et le roi noir, donc il faut avoir Fd7 déjà joué pour que e6 tienne."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -19
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4",
  "nom": "Variante d'échange, attaque c4 (variante Winawer de l'échange)",
  "sens": "Développe le fou en clouant le cavalier sur le roi : il ne peut plus prendre en d5. Prépare le petit roque et garde la pression sur le pion d4 via c3.",
  "menace": "Rien d'immédiat, mais ...dxc4 ou ...0-0 suivi de ...Te8 avec pression sur la colonne e ouverte ; le roi blanc est encore au centre.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe une pièce vers le roque et couvre d4. Les Blancs ne gagnent rien à se presser : après ...0-0, Fe2 et 0-0, la position est symétrique et saine. Le clou en c3 se défera plus tard par Fd2 quand le roi sera à l'abri."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vise h7 et prépare le roque. Si ...dxc4, le fou reprend en c4 avec un temps. Laisse aux Noirs ...0-0 et ...Te8, mais le roi blanc roquera juste à temps."
   },
   {
    "san": "cxd5",
    "pourquoi": "Clarifie le centre tout de suite. Après ...Cxd5, Fd2 ou Dc2 et le pion d4 isolé des Blancs donne de l'espace et des cases actives (c5, e5). Simple, mais moins ambitieux : on soulage la tension sans rien gagner."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Réagit au clou alors qu'il ne fait pas mal encore. Perd un temps : après ...0-0 Cf3 Fg4, les Noirs ont trois pièces dehors contre deux, et le fou d2 bloque la dame. Développez d'abord les pièces qui ne sont pas encore sorties."
   },
   {
    "san": "Qc2",
    "pourquoi": "Sort la dame trop tôt pour protéger c3. Après ...0-0 Cf3 Te8+ les Noirs prennent la colonne e avec échec : le roi blanc est gêné pour roquer et la dame en c2 sera une cible pour ...Cb4 ou ...Fg4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -3
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6",
  "nom": "Variante d'échange, attaque c4",
  "sens": "Développe le cavalier roi en couvrant d5 une deuxième fois : le pion n'est plus en danger après c4, et les Noirs sont prêts à roquer. Si cxd5 Cxd5, le cavalier se centralise sans laisser de faiblesse.",
  "menace": "Aucune menace directe ; les Noirs menacent simplement de roquer et de prendre sur c4 au bon moment (dxc4) si les Blancs tardent.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Chasse le fou d6 avec gain de temps et prend de l'espace à l'aile dame. Après ...Fe7, les Blancs préparent Cc3, Fd3 et une poussée b4-b5. Inconvénient : d4 n'est plus soutenu par c3, les Noirs viseront ...b6 pour casser la chaîne."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe en attaquant d5 une troisième fois. Les Noirs répondent ...O-O ou ...c6 pour tenir le centre. Les Blancs gardent le choix entre cxd5 et c5 plus tard, selon la réaction adverse."
   },
   {
    "san": "cxd5",
    "pourquoi": "Ouvre la colonne c tout de suite. Après ...Cxd5, les Blancs jouent Cc3 et Fc4 pour harceler le cavalier centralisé. Position symétrique et simple, idéale pour un débutant qui préfère développer sans tension."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 15
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6",
  "nom": "Tarrasch, variante ouverte avec 5...Cf6",
  "sens": "développe le cavalier sur sa case naturelle : il protège le pion isolé d5 et libère le roque. Les Noirs acceptent un pion d5 isolé en échange d'un jeu de pièces libre.",
  "menace": "pousser c4 pour chasser le cavalier ou gagner de l'espace, et prendre en d4 si les Blancs ne font rien.",
  "plan": [
   {
    "san": "Bb5+",
    "pourquoi": "donne échec et gêne le développement noir : après Fd7 ou Cc6, les Blancs roquent vite et gardent la tension en d4. Le fou en b5 n'est pas en prise et peut s'échanger si besoin. Laisse aux Noirs le choix du pion isolé ou de l'échange en d4."
   },
   {
    "san": "c3",
    "pourquoi": "solidifie d4 une fois pour toutes : plus de prise en d4 à craindre. Ensuite Fe2 ou Fd3 (seulement maintenant, protégé contre c4), O-O et Cb3 pour attaquer c5. Jeu calme, bon pour un débutant."
   },
   {
    "san": "Be2",
    "pourquoi": "coup sûr : le fou n'est pas exposé, le roque arrive au coup suivant. Laisse aux Noirs la prise en d4 (Cxd4 est sans danger pour eux) mais le pion d5 reste faible et deviendra une cible."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "la case la plus active en apparence, mais le fou est aussitôt chassé par c4 : il doit reculer en e2 et les Noirs gagnent un temps net, puis leur fou vient en d6 avec une belle position. Toujours vérifier la poussée c4 avant de poser un fou en d3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3",
  "nom": "Défense française, variante Steinitz (système 5.f4 Cf3)",
  "sens": "Renforce d4 une troisième fois et sort le cavalier vers le roque : sur cxd4, les Blancs reprennent du cavalier sans perdre de temps et la chaîne d4-e5 reste solide. Les Noirs ont le champ libre pour attaquer d4 avec Cc6 et Db6.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Attaque d4 une deuxième fois et développe. C'est le coup principal : il prépare Db6 et cxd4 pour faire craquer le centre. Les Blancs répondent Fe3 pour tenir d4, et la bataille sur d4 commence."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange tout de suite et ouvre la colonne c pour la tour. Après Cxd4, les Noirs jouent Cc6 ou Fc5 et pressent le cavalier central. Attention : on renonce à la tension, les Blancs centralisent un cavalier."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 et le pion b2 en même temps. Oblige les Blancs à réagir (Fe3 ou Ca4). Un peu tôt : la dame peut devenir une cible pour Ca4 ou Cb5 si c5 bouge."
   }
  ],
  "erreurs": [
   {
    "san": "Nb6",
    "pourquoi": "Retire le cavalier de la lutte pour e5 et d4. Après Fe3 Cc6 dxc5, les Blancs gagnent c5 avec gain de temps et le cavalier b6 est mal placé : il doit encore se replacer."
   },
   {
    "san": "f5",
    "pourquoi": "Semble bloquer l'attaque, mais fige le pion f pour toujours et affaiblit e6 et g6. Les Blancs ouvrent avec g4 (Tg1 puis g4) et attaquent la colonne g, le roi noir n'a plus d'abri."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -35
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+",
  "sens": "échange le fou avant qu'il soit chassé par b5, et donne échec : les Noirs doivent répondre tout de suite. Le but est d'abîmer les pions noirs (c6 doublé après bxc6) et d'affaiblir le contrôle de e5.",
  "menace": "Le fou c6 est en prise et donne échec : si les Noirs ne le reprennent pas, il s'enfuit en a4 avec un pion de plus.",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "Reprend le fou tout de suite : c'est le seul coup qui ne perd pas de matériel. Les pions c6 et c7 sont doublés, mais les Noirs gardent la paire de fous et ouvrent la colonne b pour la tour. Ensuite ils pourront jouer fxe5 ou c5 pour attaquer le centre blanc."
   }
  ],
  "erreurs": [
   {
    "san": "Bd7",
    "pourquoi": "Bloque l'échec au lieu de reprendre : après Bxd7+ Qxd7, les Blancs ont simplement gagné un cavalier pour rien. Un échec se pare d'abord en regardant si on peut prendre la pièce qui l'attaque."
   },
   {
    "san": "Kf7",
    "pourquoi": "Déplace le roi sans reprendre : le fou s'échappe en a4, les Blancs ont un cavalier de plus et le roi noir a perdu le droit de roquer. Même chose avec Ke7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -76
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 Dxd5",
  "sens": "Échange le pion c5 contre d4 avant que le fou blanc n'attaque la dame : les Noirs vident le centre et gardent une structure saine, sans pion isolé.",
  "plan": [
   {
    "san": "Bc4",
    "pourquoi": "Développe le fou avec gain de temps sur la dame, qui doit reculer (en général Dd6). Les Blancs roquent ensuite et reprendront d4 avec Cb3 au bon moment, pas tout de suite."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe aussi le fou vers le roque adverse, mais sans attaquer la dame : plus calme, les Noirs sortent Cf6 et Cc6 sans gêne."
   },
   {
    "san": "a3",
    "pourquoi": "Coup utile qui empêche ...Fb4 et prépare Fc4 ou Fd3 sans craindre une clouette sur le cavalier d2. Le pion d4 ne s'enfuit pas."
   }
  ],
  "erreurs": [
   {
    "san": "Nb3",
    "pourquoi": "Reprend d4 trop vite : après ...e5 les Noirs tiennent le pion avec gain d'espace, et le centre blanc a disparu. D'abord Fc4, Cb3 viendra après."
   },
   {
    "san": "Nc4",
    "pourquoi": "Le cavalier bloque la case du fou et devient une cible : ...Cc6 puis ...Fb4+ gêne les Blancs, qui perdent du temps à le reloger."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3",
  "sens": "met le fou sur la diagonale b1-h7, pointé vers le futur roque noir, et libère f1 pour roquer. Avec la dame en g4, le fou crée une batterie contre h7 et g6. Les Blancs ne reprennent pas le pion d4 : ils misent sur l'activité et la sécurité de leur roi.",
  "menace": "La dame g4 attaque g7 : si les Noirs oublient ce pion, Dxg7 gagne du matériel et ruine leur aile roi.",
  "plan": [
   {
    "san": "h5",
    "pourquoi": "Chasse la dame de g4 avec gain de temps : elle doit partir (en f4 ou h4) et l'attaque sur g7 disparaît. Le pion h5 ôte aussi la case g4 pour plus tard et conserve le pion d4 de plus. Le prix : la case g5 et un petit affaiblissement, mais les Blancs n'ont rien de concret contre."
   }
  ],
  "erreurs": [
   {
    "san": "g6",
    "pourquoi": "Défend g7 mais crée des trous noirs autour du roi (f6, h6). Après O-O Fg7 Dg3, la batterie fou d3 + dame reste pointée vers l'aile roi, et le fou g7 bute sur son propre pion e6 : les Noirs ont un pion de plus mais une position passive."
   },
   {
    "san": "Qa5+",
    "pourquoi": "L'échec semble gagner un temps, mais Cbd2 le pare en développant. La dame doit ensuite revenir en c7, les Blancs roquent : ils ont développé gratuitement et les Noirs ont perdu deux coups de dame tandis que g7 reste sous surveillance."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 116
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3",
  "nom": "Défense française, variante Tarrasch, système Guimard",
  "sens": "Consolide d4 avec un pion pour que e5 reste solidement défendu, puis prépare Fd3, 0-0 et Te1 : les Blancs veulent un développement simple et plus d'espace sur l'aile roi.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Le seul vrai plan : attaque tout de suite le pion e5, la pointe de l'espace blanc. Comme ...c5 est impossible (le cavalier c6 bloque le pion), c'est le coup qui ouvre le jeu pour les Noirs. Après exf6 Cxf6, la colonne f s'ouvre pour la tour et le cavalier revient à f6 bien actif. Les Noirs cèdent un peu de solidité sur e6, mais gagnent de l'activité."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Coup de développement tranquille, mais il ne fait rien contre e5. Les Blancs jouent Fd3 et 0-0 sans être gênés, et ...f6 devient plus faible ensuite car le fou en e7 se retrouve passif. Attaquer e5 tout de suite était plus urgent que de développer."
   },
   {
    "san": "Nb6",
    "pourquoi": "Le cavalier ne fait rien en b6 : il ne regarde ni e5 ni c5, et il bloque le pion b. Les Blancs jouent Fd3 et 0-0 et gardent tout leur espace, tandis que les Noirs n'ont plus aucun moyen simple d'ouvrir le jeu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -59
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6",
  "nom": "Variante d'avance, 6...Ch6",
  "sens": "Amène le cavalier vers f5 pour ajouter un quatrième attaquant sur d4 (avec c5, Cc6 et Db6) ; si les Blancs prennent en h6, gxh6 ouvre la colonne g aux Noirs.",
  "menace": "...Cf5 suivi de ...cxd4 : d4 attaqué quatre fois, défendu seulement trois fois (c3, Cf3, Dd1).",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou sur la diagonale qui vise h7 et prépare le roque. Si ...Cf5, le fou peut prendre en f5 : le quatrième attaquant disparaît. Laisse aux Noirs la prise ...cxd4 cxd4 Cxd4 ? non : après Cxd4 Cxd4 le fou d3 est protégé par la dame, donc d4 tient."
   },
   {
    "san": "b4",
    "pourquoi": "Gagne de l'espace à l'aile dame et empêche ...cxd4 d'être suivi de ...Fc5. Après ...cxd4 cxd4, le fou c1 peut aller en b2 pour défendre d4. Laisse aux Noirs ...a5 pour attaquer la chaîne b4-a3."
   },
   {
    "san": "h3",
    "pourquoi": "Coup d'attente utile : contrôle g4 et prépare g4 pour chasser un cavalier arrivé en f5 avant qu'il ne pèse sur d4. Laisse aux Noirs le temps de jouer ...Fd7 et ...Tc8."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd2",
    "pourquoi": "Semble développer, mais bloque le fou c1 et retire la case d2 à la dame. Après ...cxd4 cxd4 Cf5, d4 est attaqué quatre fois et n'est plus défendable : les Blancs perdent le pion central."
   },
   {
    "san": "Qd2",
    "pourquoi": "Veut défendre d4, mais après ...cxd4 la dame ne peut plus reprendre en c3 (b4 est forcé puis ...dxc3 gagne un pion). Le pion d4 tombe quand même et le centre blanc s'écroule."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 29
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2",
  "sens": "protège f2 depuis la deuxième rangée sans bouger le roi : le sacrifice Fxf2+ ne gagne plus rien. Elle libère d1 pour que le cavalier puisse aller en b3 chasser le fou, et prépare Cgf3 puis le roque.",
  "menace": "Cb3 : le cavalier attaque le fou c5 avec gain de temps, puis Tb1 ou Fe3 pour neutraliser la dame noire sur b6.",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "La dame quitte b6 avant d'être chassée par Cb3 et attaque e5, le pion avancé des Blancs. Les Noirs gardent une position saine et pourront jouer Cc6 pour appuyer la pression sur e5."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le fou c8. Il vise f5 ou g6 pour s'en prendre au pion e5 et prépare le petit roque. Les Blancs joueront Cb3, mais le fou recule en b4 ou e7 sans dégât."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant e5 tout de suite. Les Blancs doivent défendre leur pion (Cgf3), ce qui leur laisse moins de temps pour harceler le fou c5 et la dame b6."
   }
  ],
  "erreurs": [
   {
    "san": "h5",
    "pourquoi": "Un coup de pion sur l'aile qui ne développe rien et affaiblit g5 et g6. Pendant ce temps les Blancs jouent Cb3 puis Cf3 : ils gagnent du temps sur le fou c5 et finissent leur développement, tandis que le roi noir n'a plus d'abri côté roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 32
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5",
  "sens": "Attaque le fou d6 en gagnant un temps et plante un pion avancé à l'aile dame. Il prépare Cc3, Fd3 puis la poussée b4-b5 pour gagner de l'espace. En échange, le pion d4 perd le soutien de c3.",
  "menace": "Prendre le fou d6 avec le pion c5 : cxd6 gagne une pièce contre un pion.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Recule simplement sur la seule case sûre. Le fou reste utile, le roque est toujours possible. Ensuite les Noirs jouent ...O-O puis ...b6 pour attaquer c5 : le pion d4 n'ayant plus c3 derrière lui, la chaîne blanche devient fragile."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Oublie que le fou est attaqué. Après cxd6 Dxd6, les Blancs ont une pièce de plus pour un pion : la partie est pratiquement perdue."
   },
   {
    "san": "Bxc5",
    "pourquoi": "Prendre le pion semble gratuit, mais dxc5 reprend aussitôt : le fou est perdu pour un simple pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -15
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6",
  "nom": "Française d'avance, variante Paulsen (6.Fe2 Ch6)",
  "sens": "amène le cavalier vers f5 sans gêner le pion f : depuis f5 il sera le quatrième attaquant de d4, que les Blancs ne défendent que trois fois.",
  "menace": "...cxd4 puis ...Cf5 : d4 est attaqué quatre fois et défendu trois, le pion tombe ou les Blancs se tordent pour le tenir.",
  "plan": [
   {
    "san": "Bxh6",
    "pourquoi": "Supprime le cavalier avant qu'il n'arrive en f5. Après ...gxh6 les pions noirs du roi sont abîmés et d4 n'est plus en danger. Prix à payer : on cède le fou de cases noires, et les Noirs auront la colonne g ouverte."
   },
   {
    "san": "Bd3",
    "pourquoi": "Le fou vise f5 : si le cavalier y vient, il sera échangé aussitôt. On accepte de laisser e2 vide ; après ...cxd4 cxd4 le fou garde aussi un œil sur h7."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord. Sur ...Cf5 les Blancs répondent Fxf5 ou dxc5 : d4 tient. Simple et solide pour un débutant, mais les Noirs gardent la pression."
   }
  ],
  "erreurs": [
   {
    "san": "b4",
    "pourquoi": "Gagne de l'espace mais perd un pion : ...cxb4 ouvre la colonne c, et après Fxh6 gxh6 les Noirs restent avec un pion de plus et la dame b6 pointe sur c3 et d4."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Coup naturel qui bloque le fou c1 : d4 perd alors un défenseur potentiel. Après ...cxd4 O-O dxc3 les Blancs ont déjà lâché un pion et le centre s'écroule."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 42
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7",
  "nom": "Variante classique, échange du fou de cases noires",
  "sens": "Échange le fou pour éviter qu'il ne reste enfermé derrière la chaîne de pions ; les Blancs comptent ensuite jouer f4 pour cimenter e5 et garder plus d'espace.",
  "menace": "Le fou e7 attaque la dame d8 : les Noirs doivent reprendre tout de suite.",
  "plan": [
   {
    "san": "Qxe7",
    "pourquoi": "Reprend avec la dame, seul coup raisonnable : le roi reste à l'abri et peut roquer. La dame surveille e5 et c5, ce qui prépare ...c5 et ...Nc6 pour attaquer le centre blanc. Les Blancs joueront f4 et Nf3 ; les Noirs répondront ...O-O, ...c5 et ...f6 pour saper e5."
   }
  ],
  "erreurs": [
   {
    "san": "Kxe7",
    "pourquoi": "Reprend avec le roi, qui perd le roque et reste au milieu. Après 7.Qh5 (menace Qxd5 et Qg5+), le roi doit revenir en e8 et les Noirs perdent du temps pendant que les Blancs jouent f4 et Nf3 avec une attaque facile."
   },
   {
    "san": "c5",
    "pourquoi": "Ignore la menace sur la dame : 7.Bxd8 Kxd8 et les Noirs ont donné leur dame contre un fou. La partie est perdue d'un coup."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -37
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6",
  "nom": "Défense française, variante Rubinstein",
  "sens": "Reprend le cavalier avec la dame pour garder la structure de pions intacte ; en échange, la dame sort tôt et sera chassée par Cf3, ce qui coûtera un temps.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe le cavalier et vise e5 et g5 : la dame en f6 se sent menacée et devra bientôt se replacer. Prépare Fd3, O-O et c3 pour une position solide avec un pion de plus au centre. Laisse aux Noirs le temps de jouer ...Cd7 ou ...h6, mais chaque temps dépensé par la dame est un temps gagné pour les Blancs."
   },
   {
    "san": "Bd3",
    "pourquoi": "Place le fou sur la diagonale qui regarde h7 : une fois le roi noir roqué, c'est la cible classique de l'attaque. Prépare le roque et Cf3. Laisse aux Noirs ...c5 ou ...Cc6, mais le fou est déjà idéalement placé."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient le pion d4 avant tout, pour qu'il ne soit jamais attaqué deux fois par ...c5 et ...Cc6. Ouvre aussi la case c2 à la dame. Moins pressant que Cf3 : le fou c1 et le cavalier g1 attendent encore."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Coup de pion sur l'aile sans aucune pièce développée. Après ...Cc6 puis ...h6, les Noirs sortent leurs pièces tranquillement et le pion h4 devient une faiblesse pour le roi blanc : on a dépensé un temps pour rien et perdu l'essentiel de l'avantage."
   },
   {
    "san": "Be2",
    "pourquoi": "Développement trop timide : le fou en e2 ne regarde rien, il ne menace pas h7 et gêne la dame. Après ...Cc6 et ...h6, les Noirs égalisent presque. Un débutant croit avoir « sorti une pièce », mais c'est la mauvaise case : d3 était la bonne."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 86
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6",
  "nom": "Défense française, variante d'avance (échange en c6)",
  "sens": "Échange le cavalier attaqué avant qu'il ne soit chassé et oblige les Noirs à reprendre avec le pion b : la structure noire devient lourde (pions doublés sur la colonne c, fou c8 bloqué par c6) et les Blancs pourront viser la case c5 et la colonne b.",
  "menace": "Le cavalier c6 attaque la dame d8 : s'il n'est pas repris tout de suite, il prend la dame.",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "La seule reprise correcte. Les Noirs rendent le cavalier et obtiennent un pion de plus au centre (c6-d5-e6), ce qui durcit d5. En échange ils acceptent des pions doublés et un fou c8 enfermé. Ensuite, jouer ...Qb6 ou ...Qc7, puis ...Ne7, ...c5 pour libérer le fou, et appuyer sur la colonne b contre b2."
   }
  ],
  "erreurs": [
   {
    "san": "Qc7",
    "pourquoi": "Jouer la dame au lieu de reprendre est une faute énorme : le cavalier c6 n'est pas pris et peut retourner en d4 en sécurité. Les Blancs restent avec un cavalier de plus pour un pion. Il faut d'abord reprendre bxc6, la dame bouge après."
   },
   {
    "san": "Qd7",
    "pourquoi": "Même problème : la dame se met à l'abri mais oublie que le cavalier c6 est en prise. Après Nd4, les Blancs ont une pièce de plus et attaquent déjà e6 et c6. Reprendre d'abord, développer ensuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 2
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3",
  "nom": "Variante d'échange, ligne 4.c4 Cf6 5.Cc3 Fb4 6.Cf3",
  "sens": "Développe le cavalier vers le roque et protège d4 une deuxième fois. Les Blancs refusent de se presser : ils veulent roquer d'abord, puis régler le clou en c3 par Fd2 et pousser c5 ou prendre en d5 au bon moment.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Après ...Te8, la tour vient sur la colonne ouverte e, ce qui gêne Fe2 et le roque blanc. Le clou en c3 reste : les Blancs doivent perdre un temps par Fd2 ou a3."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 pour la deuxième fois. Si les Blancs prennent cxd5, Dxd5 recentre la dame avec les deux cavaliers prêts à sauter. Laisse le fou c8 pour plus tard, il sortira en g4 ou e6 selon le besoin."
   },
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3 qui défend d4. La pression sur d4 devient réelle. Les Blancs peuvent chasser le fou par Fe2 ou h3, mais chaque coup de pion affaiblit un peu l'aile roi avant le roque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 5
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7",
  "nom": "Défense française, variante d'avance, système avec Cge7",
  "sens": "Développe le cavalier sans boucher la diagonale du fou f8. Le cavalier vise f5, d'où il attaquera d4 une deuxième fois, ou g6 pour s'en prendre au pion e5.",
  "menace": "Pas de menace immédiate : les Noirs préparent ...cxd4 suivi de ...Cf5 pour mettre d4 sous pression.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie les tours. d4 est assez défendu par Cf3 et c3 pour l'instant. Si ...Cf5, les Blancs répondent dxc5 ou Fd3 pour chasser le cavalier."
   },
   {
    "san": "Na3",
    "pourquoi": "Développe le cavalier vers c2, d'où il défendra d4 sans gêner la dame ni le fou c1. Ça laisse aux Noirs le temps de jouer ...cxd4 et ...Cf5."
   },
   {
    "san": "dxc5",
    "pourquoi": "Supprime la cible d4 avant que ...Cf5 ne l'attaque. En échange, les Noirs rejouent ...Cg6 ou ...Fxc5 avec un bon développement : jouable mais moins ambitieux."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Affaiblit la diagonale a5-e1 et retire la défense de c3. Les Noirs jouent ...cxd4 cxd4 puis ...Da5+ : le roi n'a pas roqué, les Blancs doivent parer l'échec avec une pièce passive et perdent l'initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 24
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6",
  "nom": "Défense française, variante Steinitz",
  "sens": "attaque d4 une deuxième fois tout en développant une pièce : avec c5 et Cc6, les Noirs mettent le pion d4 sous pression et préparent Db6 et cxd4 pour faire craquer le centre blanc.",
  "menace": "cxd4 suivi de Cxd4 : si les Blancs ne renforcent pas d4, ils perdent un pion au centre.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Défend d4 une troisième fois (dame, cavalier f3, fou e3) et développe une pièce. Les Blancs peuvent ensuite jouer Dd2, 0-0-0 et conserver leur grand centre. Il laisse aux Noirs Db6, qui attaque b2 et d4 à la fois : il faudra répondre par Da4 ou Cb5 selon le cas, mais c'est la vraie bataille de la variante."
   },
   {
    "san": "Ne2",
    "pourquoi": "Déplace le cavalier c3 pour qu'il défende d4 à son tour et libère c3 pour le pion : après cxd4, les Blancs reprennent Cxd4 ou c3 et gardent un centre solide. Plus lent que Fe3, car le fou c1 reste chez lui et le roi tarde à roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Développement naturel, mais le fou ne protège pas d4. Les Noirs jouent Cxd4 : après Cxd4 cxd4, le pion d4 est perdu et le centre blanc s'écroule."
   },
   {
    "san": "dxc5",
    "pourquoi": "Prendre le pion semble simple, mais c'est rendre le centre sans combat. Après Fxc5, le fou noir sort avec gain de temps sur une belle diagonale, le pion d4 a disparu et la chaîne e5 se retrouve seule à tenir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 42
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5",
  "sens": "Attaque la dame avec le pion h : elle doit bouger, ce qui coupe la pression sur g7 et laisse aux Noirs le temps de garder le pion d4 de plus.",
  "menace": "hxg4 : prendre la dame gratuitement.",
  "plan": [
   {
    "san": "Qf4",
    "pourquoi": "Sauve la dame en restant active : elle soutient le pion e5 et regarde f7 et d4. Les Blancs restent un pion en moins mais gardent le développement (0-0, Te1, Cbd2) ; la dame ne gêne pas les cavaliers."
   },
   {
    "san": "Qh3",
    "pourquoi": "Même idée, la dame reste sur la colonne h et surveille h5 et e6. Un peu plus passive qu'en f4 : elle ne pousse plus rien au centre, mais elle est à l'abri et prépare Fg5 et le roque."
   }
  ],
  "erreurs": [
   {
    "san": "Qh4",
    "pourquoi": "La dame semble active, mais Dxh4 Cxh4 Cxe5 : les Noirs échangent les dames puis ramassent le pion e5 avec le cavalier, qui attaque en plus le fou d3. Deux pions de moins."
   },
   {
    "san": "Qxd4",
    "pourquoi": "Reprendre le pion paraît naturel, mais la case d4 est défendue par le cavalier c6 : Cxd4 Cxd4 et les Blancs ont donné leur dame contre un cavalier."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -128
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6",
  "nom": "Variante Guimard (3...Cc6)",
  "sens": "attaque tout de suite le pion e5, la pointe de l'espace blanc : comme ...c5 est bloqué par le cavalier c6, c'est l'unique levier pour ouvrir le jeu et activer la tour f8 et le cavalier d7",
  "menace": "...fxe5 dxe5 Cdxe5 (ou Ccxe5) : e5 est attaqué par les deux cavaliers et défendu seulement par Cf3, le pion tombe",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "Cloue le cavalier c6 sur le roi. Après ...fxe5 dxe5, le cavalier c6 ne peut plus prendre : e5 tient. Le fou se développe et peut échanger en c6 pour affaiblir le pion d5. Les Noirs répondent ...a6 ou ...Fe7, le jeu reste fermé."
   },
   {
    "san": "Nh4",
    "pourquoi": "Le cavalier vise g6 et ouvre la diagonale de la dame vers h5. Si ...fxe5 dxe5 Cdxe5, alors Dh5+ g6 Cxg6 et les Noirs s'écroulent sur l'aile roi. Pour prendre e5, ils doivent d'abord parer la menace d'échec."
   },
   {
    "san": "exf6",
    "pourquoi": "Le coup simple : on échange le pion avant qu'il ne devienne une cible. Après ...Cxf6 les Blancs gardent une bonne structure et jouent Fd3, 0-0, Te1. Ils rendent de l'activité aux Noirs (colonne f, cavalier f6), mais plus de pion e5 à défendre."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Développement naturel, mais le fou ne défend pas e5. Après ...fxe5 dxe5 Ccxe5 (ou Cdxe5), e5 est pris : deux attaquants contre un seul défenseur, le cavalier f3. Les Blancs perdent un pion net."
   },
   {
    "san": "Be2",
    "pourquoi": "Même problème : rien n'ajoute un défenseur à e5. Sur ...fxe5, si 0-0 alors ...Df6 renforce la pression et le pion d4 tombe aussi. Avant de roquer, il faut d'abord régler le sort du pion e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 52
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+",
  "nom": "Tarrasch, variante ouverte 3...c5",
  "sens": "Donne échec pour forcer les Noirs à bloquer avant de finir leur développement : un fou ou un cavalier doit venir en d7 ou c6, puis les Blancs roquent vite et gardent la tension sur c5 et d4. Le fou en b5 ne risque rien et pourra s'échanger si besoin.",
  "menace": "Aucune menace directe : c'est un échec qui gagne du temps. Si les Noirs répondent mal, dxc5 prend un pion et attaque la dame.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Pare l'échec en développant une pièce. Le fou de c8, souvent mal placé dans la française, sort tout de suite. Si les Blancs prennent en d7, la dame ou le cavalier reprend et les Noirs gardent un jeu simple avec roque rapide. Les Noirs choisissent ensuite entre cxd4 ou garder la tension."
   },
   {
    "san": "Nfd7",
    "pourquoi": "Pare l'échec en gardant le cavalier b8 libre pour c6 et le fou c8 pour la diagonale. Mais le cavalier f6 quitte sa bonne case et le roi reste plus longtemps au centre : coup jouable, moins naturel que Bd7."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd7",
    "pourquoi": "Pare l'échec, mais clou le fou c8 derrière le cavalier et laisse le pion d5 fragile. Après O-O a6, la tour vient en e1 sur la colonne ouverte et les Noirs ont du mal à roquer sans concéder d'avantage."
   },
   {
    "san": "Qd7",
    "pourquoi": "Bloque avec la dame : les Blancs prennent Bxd7+, les Noirs reprennent Bxd7, et le roi noir reste au centre sans droit au roque. Après O-O, le pion d5 est attaqué et les pièces noires ne sont pas développées : la position s'effondre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -12
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4",
  "nom": "Variante Tarrasch, ligne ouverte 3...c5 4.exd5 Dxd5",
  "sens": "attaque la dame en d5 avec le fou : elle doit bouger, et les Blancs gagnent un temps pour développer leur pièce avant de roquer.",
  "menace": "Fxd5 : le fou prend la dame pour rien. Il faut la déplacer tout de suite.",
  "plan": [
   {
    "san": "Qd6",
    "pourquoi": "Le coup principal. La dame reste au centre, protège le pion d4 une fois de plus et surveille la colonne d. Elle peut être chassée plus tard par Cb3-Cbxd4 ou Ce4, mais pour l'instant elle gêne les Blancs. Ensuite les Noirs jouent Cf6, Cc6 et Fe7 pour roquer vite."
   },
   {
    "san": "Qd7",
    "pourquoi": "La dame se met à l'abri derrière ses pièces et garde d4. Elle ne gênera pas le développement (Cc6, Cf6, Fd6). Petit défaut : elle bloque un peu le fou c8, il faudra jouer b6 et Fb7 ou la bouger encore."
   },
   {
    "san": "Qh5",
    "pourquoi": "La dame va sur l'aile roi et cloue l'idée Cb3 : si les Blancs reprennent d4, leur roi aura une dame en face. Mais elle s'éloigne du centre et les Blancs peuvent la gêner avec Ce4 ou g4 plus tard : à réserver si l'on connaît bien la ligne."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Coup naturel pour développer, mais il oublie la menace : Fxd5 prend la dame, et après exd5 les Noirs n'ont qu'un fou en échange. La partie est perdue en un coup. Toujours regarder quelle pièce est attaquée avant de développer."
   },
   {
    "san": "Be7",
    "pourquoi": "Même oubli : le fou prépare le roque mais laisse la dame en prise. Fxd5 exd5 et les Blancs ont une dame contre un fou. Dès qu'une pièce est attaquée, on la sauve ou on la protège avant toute autre idée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -17
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7",
  "nom": "Winawer, variante principale",
  "sens": "Développe le cavalier sans bloquer le pion f ni s'exposer sur f6 : il surveille g6 et f5, couvre g7 d'avance, et pourra sauter en f5 pour attaquer d4 ou en c6 pour presser le centre.",
  "plan": [
   {
    "san": "Qg4",
    "pourquoi": "Attaque g7 tout de suite. Les Noirs doivent choisir : roquer et subir une attaque sur l'aile roi, ou jouer ...Dc7 et sacrifier g7 et h7 contre le centre blanc (la 'variante du poison'). C'est le coup le plus tranchant et le plus exigeant pour les deux camps."
   },
   {
    "san": "a4",
    "pourquoi": "Prépare Fa3, qui exploite la case a3 : le fou noir a disparu, les cases noires sont faibles. Le fou clouera aussi la tour ou le roi après ...cxd4. Coup positionnel calme, sans risque."
   },
   {
    "san": "Nf3",
    "pourquoi": "Développement simple : défend d4, prépare Fd3 et le roque. Laisse aux Noirs le temps de jouer ...Cbc6 et ...Da5, mais garde un centre solide et la paire de fous."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 57
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6",
  "sens": "Reprend le fou avec le pion b plutôt qu'avec la dame : il ne perd pas de matériel, garde la paire de fous et ouvre la colonne b pour la tour. Les pions c6 et c7 sont doublés, mais ils soutiennent la poussée c5 contre d4.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en protégeant d4 une fois de plus. Après ...c5, le pion d4 tient sans effort et la dame reste libre. Le centre blanc e5-d4 est solide, et les Blancs pourront ensuite roquer et jouer c3 ou Cbd2."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier sans bloquer le pion c : c3 reste possible pour soutenir d4. De d2, le cavalier peut aller en b3 pour surveiller c5, ou en f3 si l'autre cavalier bouge. Il laisse aux Noirs le temps de jouer fxe5 ou c5, mais le centre blanc reste bien défendu."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite : après fxe5 et l'ouverture de la colonne f, le roi blanc serait exposé en e1. La tour f1 regarde aussi la colonne f, qui va s'ouvrir. Il laisse d4 avec un seul défenseur, mais les Noirs ne peuvent pas encore le gagner."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "Sort la dame trop tôt et la détourne de la défense de d4. Après 7...c5 8.dxc5 Fxc5, les Noirs échangent leur pion doublé contre d4 et sortent leur fou avec gain de temps : le centre blanc a disparu et la paire de fous noire devient dangereuse."
   },
   {
    "san": "h3",
    "pourquoi": "Coup de pion inutile qui ne développe rien. Les Noirs jouent 7...c5 et obligent les Blancs à défendre d4 avec 8.c3, puis ...Ce7 : les Noirs ont une pièce de plus en jeu et pressent le centre, pendant que les Blancs ont perdu un temps sur l'aile roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 71
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3",
  "nom": "Défense française, variante d'avance, système ...Ch6 avec 7.Fd3",
  "sens": "Développe le fou sur la diagonale qui vise h7 et prépare le petit roque. Si le cavalier h6 saute en f5, le fou pourra le prendre : les Noirs perdent leur quatrième attaquant de d4. Le pion d4 reste défendu tactiquement : sur ...cxd4 cxd4 Cxd4 ? Cxd4 Dxd4 ? le coup Fb5+ gagne la dame.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Échange tout de suite en c5 pour fixer la structure : après cxd4 les Blancs n'ont plus la possibilité de jouer dxc5 et la case c5 reste disponible pour le fou. Ensuite ...Cf5 ou ...Fd7, et si Fxf5 alors ...exf5 : la colonne e s'ouvre pour les Noirs et le fou de cases blanches des Blancs a disparu. Attention : ne pas prendre en d4 avec le cavalier, Fb5+ gagnerait la dame."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou de cases blanches (le plus difficile à sortir dans la française) et prépare ...Tc8 et éventuellement ...Fb5 pour échanger le dangereux fou d3. Le pion c5 reste pris en c5 ou tenu, et le roque viendra après."
   },
   {
    "san": "Be7",
    "pourquoi": "Simple développement pour roquer vite. Moins précis que ...cxd4 car les Blancs peuvent jouer dxc5 et le fou devra reprendre en deux temps, mais le roi sera en sécurité."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Attaquer la chaîne par e5 semble logique, mais après O-O fxe5 Cxe5 le cavalier blanc s'installe en e5, la case e6 est faible et le roi noir reste au centre sans protection. Les Noirs ont ouvert leur propre roi."
   },
   {
    "san": "c4",
    "pourquoi": "Chasser le fou avec gain de temps paraît tentant, mais le fou recule tranquillement en c2 et la tension sur d4 disparaît : les Noirs n'ont plus rien à attaquer, et les Blancs préparent b3 pour ouvrir la colonne b et le centre à leur avantage."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7",
  "sens": "la dame se met à l'abri du cavalier (qui visait b3) et vise maintenant e5, le pion avancé des Blancs, que Cc6 viendra bientôt attaquer une deuxième fois",
  "menace": "e5 est attaqué une fois et défendu une fois ; après Cc6, le pion tombera s'il n'est pas protégé davantage",
  "plan": [
   {
    "san": "Nb3",
    "pourquoi": "le cavalier gagne un temps en attaquant le fou c5, qui doit reculer en b6. Il quitte aussi la case d2 et libère le fou c1. Les Noirs répondront Cc6 pour revenir sur e5."
   },
   {
    "san": "f4",
    "pourquoi": "le pion f4 protège solidement e5 : la pression noire sur ce pion n'aboutit plus. En échange, la diagonale g1-a7 reste ouverte pour le fou c5 et le roi blanc sera un peu moins bien abrité."
   },
   {
    "san": "Ngf3",
    "pourquoi": "développe le cavalier roi en défendant e5 une seconde fois, et prépare le petit roque. C'est le coup le plus naturel : les Noirs continueront par Cc6 et Cge7."
   }
  ],
  "erreurs": [
   {
    "san": "Qh5",
    "pourquoi": "la dame part à l'attaque toute seule, sans aucune pièce pour l'aider. Les Noirs jouent Cge7, se développent sans peur et la dame blanche devra revenir en arrière : les Blancs ont perdu du temps."
   },
   {
    "san": "f3",
    "pourquoi": "ce pion ne défend rien d'utile et bouche la case f3 du cavalier. Pire, la diagonale g1-a7 est affaiblie et après b6 puis Fa6, le fou noir vient échanger la dame e2 qui défendait tout : la position blanche se désorganise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -24
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7",
  "nom": "Variante d'échange, 5.c4 (attaque Monte-Carlo)",
  "sens": "met le fou à l'abri de l'attaque du pion c5 sur l'unique case qui le garde actif et laisse le roque disponible ; prépare ...O-O puis ...b6 pour saper c5, point avancé que d4 ne peut plus soutenir avec c3.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur sa meilleure diagonale, vise h7 et prépare le roque. Quand les Noirs joueront ...b6, les Blancs répondront b4 pour tenir c5 : il faut donc être roqué avant."
   },
   {
    "san": "Nc3",
    "pourquoi": "développe en attaquant d5, le pion central noir. Oblige les Noirs à le défendre (...c6 ou ...Be6) avant de penser à ...b6."
   },
   {
    "san": "Be3",
    "pourquoi": "protège d4 à l'avance : la chaîne c5-d4 n'a pas de pion derrière elle, le fou remplace ce soutien manquant. Les Blancs gardent ainsi leur avantage d'espace côté dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 15
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+",
  "nom": "Variante Rubinstein",
  "sens": "Échange le cavalier central avant qu'il ne soit chassé par un pion ou pris sans compensation. Oblige les Noirs à reprendre et laisse les Blancs choisir ensuite leur schéma : Fd3, De2, roque.",
  "plan": [
   {
    "san": "Nxf6",
    "pourquoi": "Le cavalier d7 reprend et arrive sur f6, sa meilleure case : il surveille d5 et e4, protège h7 et le roi. La structure de pions reste intacte, la dame garde sa place et le roque s'annonce sans souci. C'est le seul coup qui ne donne rien aux Blancs."
   }
  ],
  "erreurs": [
   {
    "san": "gxf6",
    "pourquoi": "Casse les pions devant le roi : les cases g7 et h7 sont affaiblies et le roque devient dangereux. Les Blancs jouent Fe3 puis c4 et pressent le centre pendant que le roi noir cherche un abri qu'il n'a plus."
   },
   {
    "san": "Qxf6",
    "pourquoi": "Sort la dame trop tôt : Fg5 l'attaque aussitôt, elle doit fuir sur f5 et Fd3 la harcèle encore. Les Blancs se développent avec gain de temps et le cavalier d7 reste bloqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -44
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3",
  "nom": "Défense française, variante Rubinstein (Burn/Fort Knox sans ...Fd7), ligne 5...Dxf6",
  "sens": "Développe le cavalier vers le roque en gagnant du temps sur la dame : il regarde e5 et surtout g5, d'où le fou de c1 veut aussi venir attaquer la dame. Prépare Fd3, O-O et c3 pour garder tranquillement le pion d4 au centre.",
  "menace": "Fg5 (ou Ff4) pour chasser la dame de f6 et gagner encore un temps de développement.",
  "plan": [
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 au fou et au cavalier : la dame peut rester en f6 sans être chassée. Prépare ensuite ...Fd6, ...O-O et ...c5 pour attaquer d4. Laisse aux Blancs le temps de jouer Fd3 et O-O, mais sans gain de temps sur la dame."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 : les Blancs doivent déjà penser à c3 ou Fe3. La dame sera chassée par Fg5, mais elle ira en g6 ou e7 en gardant la pression sur le centre. Laisse aux Blancs la poussée d5 à surveiller."
   },
   {
    "san": "Qd8",
    "pourquoi": "Rentre la dame avant d'être chassée : elle ne donne plus de cible, et les Noirs développent ensuite ...Fe7, ...O-O, ...b6 et ...Fb7 sans souci. Laisse aux Blancs un développement plus rapide, mais une position solide."
   }
  ],
  "erreurs": [
   {
    "san": "Bd6",
    "pourquoi": "Coup naturel, mais le fou laisse la case g5 ouverte : Fg5 attaque la dame, qui doit aller en g6, puis Fd3 la chasse encore. Les Blancs gagnent deux temps et le fou de d6 gêne même la dame."
   },
   {
    "san": "Nd7",
    "pourquoi": "Développe, mais bloque la retraite de la dame vers d8 : après Fg5 la dame doit fuir en f5, puis Fd3 la chasse à nouveau. Les Blancs développent tout en l'attaquant, les Noirs perdent trois temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -75
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O",
  "nom": "Variante d'échange avec 4.c4",
  "sens": "Met le roi en sécurité et libère la tour f8 pour la colonne e, ouverte depuis l'échange des pions e. Le fou b4 continue de clouer le cavalier c3 : il appuie sur d5 et gêne le développement blanc.",
  "menace": "Pas de menace immédiate. Mais ...Te8 arrive : la tour contrôlera e2, ce qui gênera le fou blanc et le roque, et ...dxc4 ou ...Fg4 suivront pour gagner du temps.",
  "plan": [
   {
    "san": "Be2",
    "pourquoi": "Développe simplement le fou et prépare le roque. Le fou en e2 bloque aussi la colonne e devant la tour noire. Les Blancs rattrapent leur retard de développement avant toute autre chose."
   },
   {
    "san": "Bd3",
    "pourquoi": "Même idée que Fe2 mais le fou est plus actif : il vise h7. Attention toutefois : après ...dxc4 Fxc4 le fou a bougé deux fois et le roi blanc n'a toujours pas roqué."
   },
   {
    "san": "cxd5",
    "pourquoi": "Clarifie le centre tout de suite. Après ...Cxd5 le cavalier est fort au centre, mais les Blancs n'ont plus la tension du pion c4 à gérer et peuvent développer tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Semble naturel pour casser le clou, mais perd un temps. Après ...Fg4 Fe2 dxc4 les Noirs gagnent un pion : le fou e2 est cloué par Fg4 et ne peut pas reprendre en c4."
   },
   {
    "san": "Bf4",
    "pourquoi": "Développe le fou, mais laisse la colonne e. Après ...Te8 Fe2 dxc4 les Noirs prennent le pion c4 : le fou e2 est cloué par la tour e8 et ne peut pas le reprendre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -5
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6",
  "nom": "Défense française, variante d'avance, 6...Ch6 7.Fxh6",
  "sens": "Échange le fou contre le cavalier avant qu'il ne saute en f5 pour harceler d4 ; en retour, les Noirs reprennent avec le pion g et leur roque côté roi est abîmé.",
  "plan": [
   {
    "san": "gxh6",
    "pourquoi": "Le seul coup : il faut reprendre la pièce, sinon les Noirs ont simplement perdu un cavalier. Le pion g a disparu, le roi noir sera moins à l'aise, mais la colonne g s'ouvre pour la tour et les Noirs gardent la paire de fous. La position reste jouable : ensuite, viser Fd7, cxd4 et la pression sur d4 avec le fou g7 absent compensée par Fg7 et Tg8."
   }
  ],
  "erreurs": [
   {
    "san": "Qxb2",
    "pourquoi": "Tentant : gagner un pion au lieu de reprendre. Mais le fou s'échappe en e3 (Fe3), et après Dxa1 la dame est enfermée dans le coin : Dc2 suivi de Cbd2 ou Fd3 la capture. Les Noirs restent une pièce en moins."
   },
   {
    "san": "cxd4",
    "pourquoi": "Jouer « dans le centre » en oubliant de reprendre. Les Blancs reculent simplement le fou en c1 et ont gagné un cavalier pour rien ; sur dxc3, Cxc3 et ils ont tout récupéré avec une pièce d'avance."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -40
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6",
  "nom": "Variante d'avance, échange 5.Cxd4 Cc6 6.Cxc6 bxc6",
  "sens": "reprend le cavalier avec le pion b pour renforcer le centre : la chaîne c6-d5-e6 tient d5 solidement. Les Noirs acceptent des pions doublés et un fou c8 encore enfermé, mais obtiennent la colonne b à moitié ouverte contre b2.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe le fou vers le roque adverse et prépare 0-0 rapidement. Il ne gêne pas le pion c : les Blancs gardent c3 en réserve pour soutenir d4 si nécessaire. Les Noirs répondront ...Qc7 ou ...Qb6 en visant b2 et e5."
   },
   {
    "san": "Nd2",
    "pourquoi": "sort le cavalier sans bloquer le pion c, et prépare Cf3 ou Cb3 pour contrôler d4 et c5. Il protège aussi b2 par la case voisine en cas de ...Qb6. Il laisse aux Noirs ...c5 pour ouvrir le fou c8."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "coup naturel mais le cavalier bloque le pion c, qui ne peut plus venir en c3 soutenir le centre. Après ...Qc7 puis ...c5, le pion e5 devient faible et le cavalier c3 est mal placé : les Noirs égalisent facilement."
   },
   {
    "san": "f4",
    "pourquoi": "soutient e5 mais affaiblit la diagonale a7-g1 et laisse b2 sans défense. Après ...Qb6 la dame attaque b2 et prépare ...Nh6-f5 contre d4 : le roi blanc reste exposé au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -8
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O",
  "nom": "Française, variante d'avance, système avec Fe2",
  "sens": "met le roi à l'abri et relie les tours ; les Blancs renoncent pour l'instant à protéger d4 avec une pièce supplémentaire et comptent sur c3 et Cf3.",
  "plan": [
   {
    "san": "Nf5",
    "pourquoi": "Le cavalier attaque d4 une troisième fois (avec c5 et Cc6). Les Blancs doivent réagir : dxc5 cède le centre, Fd3 chasse le cavalier mais perd un temps. Attention à g4 : si le cavalier est chassé, il doit avoir une case de repli (h6 ou e7)."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange tout de suite et fixe la cible : après cxd4, le pion d4 est isolé face à Cc6, Db6 et Cf5. C'est le plan classique de la Française d'avance : attaquer d4, puis e5 si d4 tombe."
   },
   {
    "san": "Ng6",
    "pourquoi": "Le cavalier vise e5 au lieu de d4. Il sera chassé par h4 moins facilement que de f5 par g4. Il garde aussi la possibilité de ...f6 pour ouvrir le centre."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Relâche toute la pression sur d4 : le pion d4 n'est plus attaqué et devient un roc. Les Blancs jouent Ca3 puis Cc2, et le pion c4 est une cible, pas un atout. Les Noirs perdent leur seul plan actif."
   },
   {
    "san": "Qc8",
    "pourquoi": "Coup passif : la dame ne pèse plus sur d4 ni sur b2. Les Blancs jouent Ca3 tranquillement et reprennent cxd4 par cxd4 sans problème ; les Noirs n'ont rien obtenu et ont perdu un temps de développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -15
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3",
  "nom": "Défense française, variante Steinitz, 7.Fe3",
  "sens": "Renforce d4 une troisième fois et développe le fou sans obstruer la colonne f : les Blancs veulent ensuite Dd2 et 0-0-0 pour garder leur centre e5-d4 intact.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe simplement et prépare le roque. Les Noirs gardent la tension sur d4 et pourront jouer 0-0 puis f6 pour attaquer la chaîne de pions en e5. C'est le coup le plus solide : rien n'est lâché."
   },
   {
    "san": "a6",
    "pourquoi": "Enlève la case b5 aux pièces blanches. Ainsi, après Db6, le cavalier ne pourra plus venir en b5 et la pression sur b2 et d4 devient réelle. Prépare aussi b5 pour gagner de l'espace à l'aile dame."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque b2 et d4 en même temps : c'est le coup thématique de la variante. Les Blancs doivent répondre précisément (Da4 ou Cb5), sinon ils perdent un pion. Le risque : la dame peut être chassée et le roi noir reste au centre un moment."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -34
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4",
  "sens": "Range la dame tout en restant utile : elle tient e5, surveille f7 et prépare Cxd4 pour reprendre le pion perdu, sans gêner le développement des cavaliers.",
  "menace": "Cxd4 : récupérer le pion d4, que la dame attaque désormais le long de la 4e rangée.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite le pion e5, le seul point d'appui des Blancs au centre. Si exf6 Cxf6, le cavalier sort avec tempo et le centre noir (d5, e5 à venir) s'ouvre ; si Cxd4 Cxd4 Dxd4 fxe5, les Noirs reprennent e5 et ouvrent la colonne f. Le coup prépare aussi ...g5 pour chasser la dame de f4, qui a peu de cases. C'est le seul bon coup : tout le reste laisse les Blancs reprendre d4 tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développement naturel, mais il ne pose aucune question : les Blancs jouent Cxd4 puis Cxc6 et récupèrent le pion sans effort. L'avantage matériel des Noirs disparaît et la dame blanche reste bien placée."
   },
   {
    "san": "Nh6",
    "pourquoi": "Le cavalier vise f5, mais il laisse d4 en prise : après 0-0 et Cxd4, les Blancs égalisent le matériel avec une position plus aisée. Il fallait d'abord frapper e5 avec f6, pas sortir une pièce sur le bord."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 123
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5",
  "sens": "cloue le cavalier c6 sur le roi : il ne peut plus prendre en e5 après ...fxe5 dxe5. Le fou se développe et prépare Fxc6 pour affaiblir le pion d5.",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "chasse le fou tout de suite. S'il prend en c6, ...bxc6 ouvre la colonne b et garde d5 solide. S'il recule en a4, ...b5 gagne encore du temps. Après cela, le clouage disparaît et ...fxe5 devient possible."
   },
   {
    "san": "fxe5",
    "pourquoi": "ouvre la colonne f pour la tour et le centre pour les pièces noires. Après dxe5, le cavalier c6 reste cloué, mais e5 est isolé et sera attaqué par ...Fe7, ...O-O et ...Dc7. Les Blancs gardent un peu plus d'espace."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "développe sans régler le clouage. Les Blancs prennent exf6 Cxf6 puis Ce5 : le cavalier blanc s'installe au centre, cloué sur c6, et les Noirs ont perdu le contrôle de e5 sans compensation."
   },
   {
    "san": "Qe7",
    "pourquoi": "semble protéger e6 et préparer le roque, mais la dame bloque le fou f8. Après O-O a6 Fa4, les Blancs gardent le clouage, et les Noirs ne peuvent plus roquer facilement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -46
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3",
  "nom": "Tarrasch, variante fermée (3...Cf6 4.e5)",
  "sens": "ajoute un second défenseur à d4 et développe la dernière pièce mineure du côté roi, tout en préparant le petit roque",
  "plan": [
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 une troisième fois et vise le pion b2 : les Blancs doivent choisir entre tenir le centre et garder leur aile dame. La dame sur b6 reste à l'abri des cavaliers."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange au centre pour fixer la case c5 : après cxd4, la case c5 appartient aux Noirs (cavalier ou fou) et le pion d4 isolé devient une cible. On abandonne en revanche la tension."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque la tête de la chaîne e5 : si exf6, le cavalier d7 revient en jeu sur f6 et le centre noir respire. Attention : la case e6 devient plus fragile."
   }
  ],
  "erreurs": [
   {
    "san": "g5",
    "pourquoi": "Un coup d'aile sans but : il affaiblit toute l'aile roi (f6, h6, le roque devient impossible). Après h3 et Fe2 les Blancs n'ont rien perdu, et le roi noir n'a plus d'abri."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -36
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7",
  "nom": "Défense française, variante Tarrasch, ligne ouverte avec 3...c5",
  "sens": "Pare l'échec en attaquant du même coup le fou blanc de b5, qui n'est protégé par rien : les Blancs doivent réagir tout de suite, soit en échangeant, soit en reculant.",
  "menace": "...Fxb5 gagne le fou de b5 si les Blancs l'oublient.",
  "plan": [
   {
    "san": "Bxd7+",
    "pourquoi": "Échange le fou avant qu'il ne soit chassé par ...a6. Après ...Dxd7 ou ...Cbxd7, les Blancs roquent, jouent dxc5 et visent le pion isolé d5 avec Cb3 et les tours sur la colonne e. Jeu simple et sans risque."
   },
   {
    "san": "Qe2+",
    "pourquoi": "Nouvel échec qui gêne le développement noir : le roi ne peut pas roquer tout de suite et les Noirs doivent parer avec ...Fe7 ou ...De7. La dame prend la colonne e ouverte et les Blancs gardent l'option Fxd7+ ensuite."
   },
   {
    "san": "a4",
    "pourquoi": "Maintient le fou en b5 en lui donnant une case de repli après ...a6 et évite l'échange immédiat. Garde la tension, mais laisse aux Noirs le temps de jouer ...Fe7 et de roquer tranquillement."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer semble naturel, mais oublie que le fou de b5 est attaqué : ...Fxb5 le prend pour rien. Une pièce de moins dès le 7e coup, la partie est perdue."
   },
   {
    "san": "Bc4",
    "pourquoi": "Retrait actif en apparence, mais le fou tombe sur un pion défendu : ...dxc4 gagne le fou, et après Cxc4 Fe6 les Noirs ont une pièce de plus pour un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6",
  "nom": "Tarrasch, variante 3...c5 4.exd5 Dxd5 (ligne principale avec 6...Dd6)",
  "sens": "garde la dame au centre pour tenir le pion d4 et contrôler la colonne d, tout en préparant Cf6, Cc6 et Fe7 pour roquer vite.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité et relie les tours. Les Blancs ne se pressent pas de reprendre d4 : ils préparent Cb3 puis Cbxd4 au bon moment, et la tour sur e1 pèsera sur le pion e6. Les Noirs vont jouer Cf6 et Cc6."
   },
   {
    "san": "Ne4",
    "pourquoi": "Le cavalier saute au centre avec gain de temps : il attaque la dame en d6, qui doit bouger (Dc7 ou Dd8). Il vise aussi f6 et d6. Attention : après Cf6, les Noirs peuvent échanger le cavalier."
   },
   {
    "san": "Nb3",
    "pourquoi": "Attaque le pion d4 une deuxième fois (dame et cavalier contre dame). Si les Noirs le gardent avec Cc6, les Blancs continuent O-O puis Cbxd4 pour rétablir l'égalité matérielle avec une position très active."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 12
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4",
  "nom": "Winawer, variante du poison (7.Dg4)",
  "sens": "attaque le pion g7 sans attendre : la dame vise la case affaiblie par l'absence du fou noir et oblige les Noirs à prendre une décision immédiate sur le sort de leur aile roi.",
  "menace": "Dxg7, qui gagne le pion g7 puis attaque la tour h8 (après ...Tg8, Dxh7 ramasse aussi h7).",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "Laisse volontairement g7 et h7 : après Dxg7 Tg8 Dxh7 cxd4, les Noirs ont deux pions de moins mais attaquent le centre blanc (c3, e5) et le roi blanc reste en danger au milieu. C'est la ligne principale, très tranchante : il faut la connaître par cœur."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et garde tous ses pions. En échange, les Blancs vont attaquer avec Fd3, Cf3, h4 et Fg5. Choix plus solide, mais il faut bien défendre."
   },
   {
    "san": "cxd4",
    "pourquoi": "Ouvre la colonne c tout de suite : si Dxg7 Tg8 Dxh7 Dc7, on revient dans la variante du poison. Les Blancs ont aussi cxd4 pour reconstruire leur centre."
   }
  ],
  "erreurs": [
   {
    "san": "Nbc6",
    "pourquoi": "Développe une pièce mais ignore la menace : Dxg7 Tg8 Dxh7 et les Blancs ont pris deux pions gratuitement, sans que les Noirs aient de compensation (pas de ...Dc7 ni de ...cxd4 joué)."
   },
   {
    "san": "h5",
    "pourquoi": "Chasse la dame, mais elle prend g7 au passage : Dxg7 Tg8 Dxh7 et le pion h5 est tombé lui aussi. Les Noirs ont perdu deux pions et affaibli encore plus leur aile roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -57
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3",
  "sens": "Sort le fou pour défendre d4 une deuxième fois (avec la dame) : si ...c5 arrive, d4 tient sans que la dame reste clouée à sa garde. Les Blancs préparent aussi le petit roque et c3 ou Cbd2 pour cimenter le centre.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans le mettre en prise. De e7 il ira en f5 pour attaquer le fou e3 et le pion d4, ou en g6 pour peser sur e5. Le pion f6 reste prêt à prendre en e5 au bon moment."
   },
   {
    "san": "a5",
    "pourquoi": "Fixe l'aile dame avant l'arrivée du cavalier blanc. Le pion a5 empêche le cavalier de s'installer en b4 et prépare ...Fa6 pour échanger le fou qui bloque le centre. Les Blancs devront aussi veiller à a4."
   },
   {
    "san": "Rb8",
    "pourquoi": "Occupe tout de suite la colonne b ouverte, ce que les pions doublés en c6-c7 rendaient possible. La tour vise b2 et gêne le développement du cavalier blanc en d2. Les Blancs devront réagir par b3 ou Tb1."
   }
  ],
  "erreurs": [
   {
    "san": "fxe5",
    "pourquoi": "Ouvre la colonne f trop tôt. Après Cxe5 le cavalier blanc occupe une case centrale forte, attaque c6 et contrôle f7 : les Noirs se sont privés d'un pion de bloc utile pour rien."
   },
   {
    "san": "c5",
    "pourquoi": "Attaque d4 au moment où il est le mieux défendu. Après dxc5 les Blancs gardent un pion de plus et le pion c7 reste faible, le centre noir se vide pendant que les Blancs roquent tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -79
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3",
  "sens": "attaque le fou c5 pour le faire reculer avec gain de temps, tout en libérant la case d2 et la diagonale du fou c1 ; le cavalier vise aussi la case d4.",
  "menace": "Cxc5 : prendre le fou qui n'est protégé que par la dame, ce qui après Dxc5 laisse les Blancs gagner d'autres temps (Fe3, f4) sur la dame noire.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Le fou recule sur une case sûre et garde sa belle diagonale vers f2. Ensuite Cc6 et Cge7 viendront presser le pion e5. Les Blancs ont gagné un temps, mais la dame noire reste bien placée en c7."
   },
   {
    "san": "b6",
    "pourquoi": "Protège le fou c5 avec le pion b : il peut rester sur sa case active. Ce coup prépare aussi Fa6 pour échanger la dame blanche et fixer les cases claires. En échange, la case c6 devient un peu plus faible pour le cavalier."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe une pièce et prépare Cbc6 contre e5. Le fou c5 reste en prise, mais après Cxc5 Dxc5 les Noirs ont perdu une paire de fous sans perdre de matériel, et leur dame est active. Un choix plus aventureux mais correct."
   }
  ],
  "erreurs": [
   {
    "san": "Bd7",
    "pourquoi": "Développe une pièce mais oublie la menace : Cxc5 Dxc5 puis f4 chasse encore la dame et les Blancs ont gagné le fou de cases noires et plusieurs temps gratuitement."
   },
   {
    "san": "Bb4+",
    "pourquoi": "L'échec paraît actif, mais c3 le repousse aussitôt : le fou doit rentrer en f8, les Blancs ont gagné un temps et jouent f4 pour consolider e5 avec un énorme avantage de développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3",
  "nom": "Variante d'échange, attaque c5 (système à la Rapport)",
  "sens": "Développe le fou sur la diagonale b1-h7, vise le pion h7 et libère la case e1 pour roquer avant que les Noirs n'attaquent la chaîne c5-d4 par ...b6.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir la position. Les Noirs n'ont rien à craindre sur h7 une fois roqués, et ils gardent ...b6 en réserve pour frapper c5 au bon moment."
   },
   {
    "san": "b6",
    "pourquoi": "Attaque tout de suite le pion c5, point avancé des Blancs. Après b4, les Noirs jouent ...a5 pour continuer à ronger la chaîne. Attention : cela retarde le roque d'un coup, donc à jouer seulement si l'on connaît la suite."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe le cavalier sur sa meilleure case, met la pression sur d4 et prépare ...Fg4 ou ...Cb4 pour chasser le fou d3. Le cavalier ne bloque pas le pion c, qui pourra jouer ...b6 ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd7",
    "pourquoi": "Le cavalier bouche la diagonale du fou c8, qui ne sort plus de la maison. Il ne touche ni d4 ni c5, et bloque la case d7 dont le fou aurait besoin. Les Blancs développent tranquillement (Cc3, h3) avec un jeu plus libre."
   },
   {
    "san": "g6",
    "pourquoi": "Affaiblit sans raison les cases f6 et h6 autour du futur roque. Le fou e7 n'a plus de sens, et le fou d3 vise justement ces cases noires creusées. Les Blancs roquent et attaquent plus vite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -14
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6",
  "nom": "Variante Rubinstein (sous-variante ...Dxf6)",
  "sens": "ôte la case g5 au fou et au cavalier blancs : la dame reste tranquille en f6, le roque et ...c5 pourront suivre sans perdre de temps",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur sa meilleure diagonale, vise h7 et prépare le petit roque. Les Blancs gardent leur avance de développement et le centre d4. Après ...Cd7 ou ...Cc6, De2 et O-O suivront ; les Noirs peuvent jouer ...Fd6, mais le fou d3 contrôle e4 et empêche ...e5."
   },
   {
    "san": "c3",
    "pourquoi": "renforce d4 avant que ...c5 ou ...Cc6 ne l'attaquent. Le pion c3 libère aussi la dame pour aller en e2 ou c2 sans être gênée. Coup solide qui laisse aux Noirs le temps de ...Fd6 et ...O-O, mais sans cible."
   },
   {
    "san": "Bb5+",
    "pourquoi": "l'échec oblige ...c6 ou ...Fd7 : le pion c6 enlève la case naturelle au cavalier b8 et retarde ...c5. Le fou se replacera ensuite en d3 ou restera actif. Laisse aux Noirs un développement un peu moins libre."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "la dame sort trop tôt et bouche la diagonale f1-a6 : le fou f1 ne peut plus aller en d3 ou b5. Après ...Cc6 puis ...Fd6, les Noirs attaquent d4 et roquent vite, et la dame doit encore bouger : les Blancs perdent leur avance."
   },
   {
    "san": "g3",
    "pourquoi": "mettre le fou en fianchetto est trop lent ici : après ...Cc6 et ...Fd6, les Noirs pressent sur d4 et visent e5. Le fou en g2 ne regarde rien d'utile, et les cases f3 et h3 s'affaiblissent face à la dame en f6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 72
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4",
  "nom": "Variante classique de la Défense française",
  "sens": "Consolide le pion e5 avec un pion plutôt qu'une pièce : la chaîne d4-e5 tient toute seule et les pièces blanches (Cf3, Dd2) restent libres pour le développement et l'attaque sur l'aile roi.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Ensuite les Noirs jouent ...c5 pour attaquer la base d4 de la chaîne, puis ...Cc6 et ...f6 au bon moment. Les Blancs gardent plus d'espace, mais le roi noir est en sécurité."
   },
   {
    "san": "a6",
    "pourquoi": "Enlève la case b5 au cavalier c3 : après ...c5, les Blancs ne pourront plus jouer Cb5 vers d6 ou c7. Prépare tranquillement ...c5 et ...Cc6. Laisse aux Blancs le temps de jouer Cf3 et Dd2, ce qui n'est pas grave."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Trop tôt : la dame blanche saute en h5 avec échec, et après ...g6 elle va en h6. Le roi noir n'est pas roqué, les cases noires autour de lui sont faibles depuis l'échange des fous. D'abord roquer, puis seulement ...f6."
   },
   {
    "san": "Qh4+",
    "pourquoi": "L'échec ne mène à rien : g3 chasse la dame, qui doit revenir en e7 en ayant perdu deux temps. En plus, les Blancs ont gagné h4 gratuitement pour lancer leur attaque sur l'aile roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -29
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4",
  "sens": "Fixe la structure en prenant en d4 : les Blancs doivent reprendre avec le pion c3 (ou laisser le pion), et la case c5 reste libre pour le fou noir. La dame en b6 regarde déjà b2 et d4.",
  "menace": "...dxc3 : gagner le pion c3, puis ...Cg4 contre f2 et e5 tant que le roi blanc est au centre.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout, en laissant volontairement le pion : si ...dxc3 Cxc3, les Blancs ont tout développé et le cavalier h6 est une cible (Fxh6 abîme le roque noir). Sur ...Cf5, les Blancs ont Fxf5 et le cavalier ne vient jamais sur d4."
   },
   {
    "san": "cxd4",
    "pourquoi": "Reprend le pion et garde le centre e5-d4 intact. Le pion b2 est en prise, mais c'est un gambit voulu : ...Dxb2 coûte beaucoup de temps aux Noirs. Attention à ne jamais jouer Cxd4 ensuite : Cxd4 Dxd4 Fb5+ et la dame tombe (ce piège marche aussi pour les Noirs s'ils prennent en d4)."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au cavalier h6 : il ne pourra plus attaquer f2 et e5. Les Blancs rendent peut-être le pion c3, mais gardent une position solide pour roquer ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Protège c3 de côté... mais le pion c3 saute quand même : ...dxc3 Cxc3 Cg4 et le cavalier attaque f2 et e5 avec le roi blanc toujours au centre. Pion perdu et roi en danger."
   },
   {
    "san": "Qc2",
    "pourquoi": "Semble défendre c3 et b2, mais ...Cg4 attaque f2 : la dame doit revenir en e2, et ...dxc3 gagne le pion. Deux coups de dame pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 29
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2",
  "nom": "Défense française, variante d'échange avec 4.c4",
  "sens": "Termine le développement du côté roi pour roquer au plus vite. Le fou en e2 couvre la case d'entrée de la tour noire sur la colonne e et laisse le pion c4 sous tension : les Blancs n'ont pas encore décidé s'ils prennent en d5 ou laissent les Noirs prendre en c4.",
  "plan": [
   {
    "san": "dxc4",
    "pourquoi": "Prend le pion maintenant que le fou blanc ne regarde plus c4. Les Blancs le reprendront par Fxc4, mais ils auront joué deux fois le fou : les Noirs gagnent un temps et obtiennent une position isolée pour le pion d4, cible pour la suite. C'est le moment : après O-O les Blancs pourraient jouer c5 ou cxd5 eux-mêmes."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4. Avec Fb4 qui cloue le cavalier c3, le pion d4 manque de défenseurs. Les Noirs gardent la tension au centre et préparent Fg4 ou Te8. Laisse aux Blancs le choix de prendre en d5, ce qui ouvre la colonne d pour les Noirs."
   },
   {
    "san": "Be6",
    "pourquoi": "Soutient d5 une seconde fois et prépare dxc4 suivi d'une reprise avec le fou. Le fou est actif sur la diagonale, et les Noirs n'ont plus à craindre cxd5. Développement calme, sans concession."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6",
  "sens": "Attaque le pion e5, seul point d'appui blanc au centre, et prépare ...g5 pour chasser la dame de f4, qui manque de cases.",
  "menace": "...g5 : la dame de f4 doit fuir, puis ...fxe5 ou ...Cxe5 gagne le pion central ; après ...g5 la dame n'a presque plus de cases sûres.",
  "plan": [
   {
    "san": "h4",
    "pourquoi": "Empêche ...g5 : si g5 maintenant, hxg5 ouvre la colonne h sur la tour h1. La dame reste sur f4 pour tenir e5. Les Noirs répondront ...fxe5 ou ...g6 ; la position reste difficile pour les Blancs, mais on évite de perdre la dame dans un piège."
   },
   {
    "san": "Qg3",
    "pourquoi": "Met la dame à l'abri de ...g5 avant d'y être forcé, et garde l'œil sur g7 et e5. Les Noirs prennent sur e5 avec un cavalier ou le pion, mais la dame blanche n'est plus une cible."
   },
   {
    "san": "exf6",
    "pourquoi": "Supprime le pion e5 attaqué plutôt que de le défendre. Après ...Cxf6 le cavalier noir sort avec tempo, mais les Blancs ont le temps de roquer et le pion d4 isolé reste faible."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le pion mais oublie e5 : ...Cxe5 attaque la dame et le fou d3 en même temps. Après Dd2 Fc5, le cavalier d4 est cloué sur f2 et les Noirs ont le centre et l'initiative."
   },
   {
    "san": "O-O",
    "pourquoi": "Trop lent : ...g5 chasse la dame (Dd2), puis ...fxe5 gagne le pion e5 et le centre blanc s'effondre. Il fallait d'abord parer ...g5 ou déplacer la dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -138
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6",
  "sens": "pose la question au fou b5 tout de suite : il doit prendre en c6 ou reculer. Dans les deux cas, le clouage sur le cavalier c6 va disparaître, ce qui libère ...fxe5 pour attaquer le centre blanc.",
  "menace": "...b5 pour gagner un temps sur le fou, puis ...fxe5 une fois le clouage levé.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Le seul bon coup. Il faut prendre avant que ...b5 ne chasse le fou gratuitement. Après ...bxc6, les Noirs ouvrent la colonne b mais leurs pions c6-c7 sont doublés et le fou c8 reste enfermé. Les Blancs gardent un petit avantage grâce au centre e5 et à une structure plus saine."
   }
  ],
  "erreurs": [
   {
    "san": "Ba4",
    "pourquoi": "Recul naturel, mais ...b5 chasse encore le fou avec gain de temps, puis ...fxe5 attaque le centre. Après Cxe5 Cxe5, les Blancs perdent leur pion e5 et le fou a4 reste mal placé."
   },
   {
    "san": "Be2",
    "pourquoi": "Le fou se met à l'abri, mais le clouage disparaît : ...fxe5 dxe5 Cdxe5 gagne simplement le pion e5. Les Blancs ont perdu deux temps avec le fou pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 42
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6",
  "nom": "Variante Rubinstein, ligne Fort Knox / 4...Cd7 (Rubinstein moderne)",
  "sens": "Reprend le cavalier échangé en gardant la structure de pions intacte : le cavalier atterrit sur f6, sa case idéale, d'où il contrôle d5 et e4 et protège h7 et le roi. La dame reste en d8, le roque est prêt, et aucune faiblesse n'est créée.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Place le fou sur la grande diagonale qui vise h7 : avec Dе2 et le roque, les Blancs préparent une attaque sur le roi noir. Le fou laisse c2 un peu faible, mais les Noirs n'ont rien pour l'exploiter tout de suite. Attention : la dame n'est plus protégée sur d1, ne pas oublier ...Dxd4 après un échange en d4."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe et protège d4 solidement, ce qui libère la dame et prépare Dd2 puis le grand roque pour lancer les pions g et h. Un plan simple et agressif. Laisse aux Noirs le temps de jouer ...c5 pour contester le centre."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame : les Noirs doivent jouer ...Fe7 ou ...h6 avant de pouvoir roquer tranquillement. Prépare Dd2 ou Fd3 avec un développement rapide. Laisse aux Noirs la possibilité de chasser le fou par ...h6 et ...g5, ce qui affaiblit leur roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 50
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3",
  "sens": "développe le fou vers le roque adverse et prépare le petit roque. Il regarde h7 : si les Noirs roquent sans précaution, Dg4 ou Dh5 viseront leur roi. Le pion c reste libre d'aller en c3 pour couvrir d4.",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "attaque e5, le pion de pointe des Blancs, qui n'est défendu que par la dame. Elle oblige les Blancs à réagir tout de suite (Ff4 ou 0-0 puis Te1). La dame se place aussi sur la colonne c, ouverte après bxc6, et vise c2 si le fou d3 bouge."
   },
   {
    "san": "Ba6",
    "pourquoi": "propose l'échange du fou noir, celui qui respire mal derrière les pions e6 et d5, contre le bon fou blanc qui regarde h7. Si les Blancs refusent et jouent Fxa6, les Noirs reprennent et le roque blanc perd son attaquant principal. Simple et solide."
   },
   {
    "san": "Qb6",
    "pourquoi": "attaque b2 et empêche le fou blanc de se développer tranquillement en c1-f4 ou e3. Elle pousse souvent les Blancs à jouer 0-0 ou Dd2 ; attention toutefois à ne pas laisser la dame trop loin du roi noir, car le fou d3 vise h7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 15
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5",
  "nom": "Défense française, variante d'avance, 5...Fd7 6.Fe2 Cge7 7.O-O Cf5",
  "sens": "ajoute une troisième attaque sur d4 et force les Blancs à prendre une décision immédiate sur leur centre.",
  "menace": "...cxd4 : après cxd4, le pion d4 est attaqué trois fois (Cc6, Cf5, et bientôt Db6) et seulement défendu deux fois (Cf3, Dd1). Les Blancs doivent défendre d4 ou le liquider maintenant.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Enlève la cible d4 avant qu'elle ne tombe. Les Noirs reprennent le pion par Fxc5, bien placé sur la diagonale a7-g1, mais le centre blanc e5 tient et la pression sur d4 disparaît. C'est le choix le plus sûr pour un débutant : on échange le problème contre un jeu de pièces simple."
   },
   {
    "san": "Na3",
    "pourquoi": "Développe le cavalier vers c2, d'où il défendra d4 une troisième fois. Il laisse aux Noirs le temps de jouer ...cxd4 cxd4 puis ...Db6 ou ...Fe7, mais d4 reste tenable grâce à Cc2."
   },
   {
    "san": "Bd3",
    "pourquoi": "Chasse le cavalier f5 en l'attaquant. Le fou a déjà bougé une fois (Fe2), on perd donc un temps, mais si le cavalier recule en e7 ou h6, la pression sur d4 retombe. Il faut ensuite rester vigilant sur ...cxd4 cxd4 Cxd4."
   }
  ],
  "erreurs": [
   {
    "san": "g4",
    "pourquoi": "Chasser le cavalier à coups de pions affaiblit le roque blanc. Après ...Ce7 dxc5 Cg6, le cavalier revient attaquer e5 et h4, et les cases f4 et h4 sont des trous. Le roi blanc, déjà roqué, devient une cible."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Semble développer, mais la dame ne protège plus d4. Après ...cxd4 Fd3 dxc3, les Noirs gagnent un pion : les Blancs n'ont plus le temps de reprendre avec cxd4 car le cavalier d2 bloque la dame et le fou c1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 31
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7",
  "nom": "Variante Steinitz (Classique), 7...Be7",
  "sens": "développe le fou pour permettre le petit roque. Il ne touche pas au centre : la tension reste en c5-d4 et les Noirs se réservent 0-0 suivi de f6 pour frapper la pointe e5.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Prend en c5 et relâche la tension au bon moment : après Cxc5, le pion d4 ne peut plus tomber et les Blancs gardent une solide majorité e5/f4. Ils ont alors un plan clair : Dd2, 0-0-0 et attaque sur l'aile roi."
   },
   {
    "san": "Qd2",
    "pourquoi": "Défend d4 et e3 en même temps et prépare le grand roque. Le coup est flexible : les Blancs peuvent répondre à cxd4 par Cxd4 et garder un centre solide, tout en préparant g4 et f5."
   },
   {
    "san": "a3",
    "pourquoi": "Prévoit l'arrivée du cavalier en b4 ou du fou en b4 avec échec. Il prépare aussi b4 pour chasser le pion c5 et consolider d4. Un coup calme mais utile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 39
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4",
  "nom": "Tarrasch, variante fermée (3...Cf6) avec 7.Ce2",
  "sens": "Échange au centre pour ouvrir la colonne c et affaiblir d4 : le pion blanc de d4 devient une cible fixe, et ...f6 pourra ensuite attaquer e5. La chaîne blanche sera prise des deux côtés.",
  "menace": "Gagner un pion : sur n'importe quoi d'autre que cxd4, le pion d4 prend en c3 (ou le cavalier c6 prend e5) et la chaîne blanche s'écroule.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Le seul coup. Reprend avec le pion c pour garder d4 et e5 solidement liés : la chaîne f2-e3... non, c3-d4-e5 est reconstituée. Les Noirs continueront par ...f6 ou ...Db6, et les Blancs devront défendre d4 avec Cf3 après f6, ou avec Cb3 ; mais la position reste équilibrée."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprendre du cavalier abandonne e5 : ...Cdxe5 gagne le pion, et après Fc2 ...Cxd4 simplifie en gardant le pion. Les Blancs perdent tout leur centre."
   },
   {
    "san": "O-O",
    "pourquoi": "Roquer d'abord ignore la menace : ...Cxe5 prend un pion, puis ...dxc3 en prend un second. Le centre blanc disparaît en deux coups."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 34
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6",
  "sens": "reprend la pièce : le pion g part, mais la colonne g s'ouvre pour la tour, les Noirs gardent la paire de fous, et la dame b6 continue de viser b2 et d4.",
  "menace": "Dxb2, qui gagne le pion b et attaque la tour a1 et le pion c3.",
  "plan": [
   {
    "san": "Qd2",
    "pourquoi": "protège b2 et c3 d'un seul coup, laisse le roque libre et garde la dame centrée pour soutenir d4. Le point faible h6 pourra plus tard être visé par Dxh6 si le fou g7 ne le couvre pas."
   },
   {
    "san": "b4",
    "pourquoi": "défend b2 en avançant et chasse l'idée cxd4 : après cxb4 cxb4, les Blancs gagnent de l'espace à l'aile dame. Laisse c3 un peu plus faible, donc à jouer avec précision."
   },
   {
    "san": "Na3",
    "pourquoi": "sort le cavalier en couvrant b2 par la tour, et vise c2 puis e3 ou b4. Développe sans laisser le pion b en prise, mais le cavalier est un peu excentré."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "oublie la menace sur b2 : après Dxb2, les Noirs gagnent un pion, et comme Cbd2 est forcé pour sauver la tour, Dxc3 en prend un second. Toujours regarder b2 avant de roquer."
   },
   {
    "san": "Nbd2",
    "pourquoi": "développe une pièce mais laisse b2 sans défense : Dxb2 attaque la tour a1, Tc1 est forcée, puis c4 bloque tout et les Noirs ont un pion de plus avec une bonne position."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6",
  "nom": "Variante Tarrasch, ligne principale avec 3...Cf6 et 7...Db6",
  "sens": "ajoute une troisième pièce sur d4 et vise b2 : les Blancs doivent trancher entre garder le centre et protéger l'aile dame. Sur b6, la dame est hors de portée des cavaliers blancs.",
  "menace": "cxd4 suivi de Cxd4 ou Dxb2 : d4 est attaqué trois fois (c5, Cc6, Db6) et b2 n'est défendu que par la dame, qui est déjà occupée à tenir d4.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant que le centre s'ouvre. Les Blancs renoncent à sauver b2 : après cxd4 cxd4 Cxd4 Cxd4 Dxd4, ils ont un pion de moins mais une avance de développement et le pion e5 qui étouffe le roi noir. Les Noirs peuvent aussi prendre b2 tout de suite, mais la dame sera alors loin de son roi."
   },
   {
    "san": "a3",
    "pourquoi": "Prépare b4 pour chasser le pion c5 et ainsi soulager d4 sans rien céder. Donne un tempo aux Noirs pour développer (Fe7 ou cxd4), mais le centre blanc tient."
   },
   {
    "san": "Qe2",
    "pourquoi": "Soutient e5 et libère la case d1 pour une tour. Le pion d4 reste tenu par c3 et Cf3 ; si cxd4 cxd4, Cb4 gagne le fou d3 mais la dame le reprend. Laisse b2 en l'air : prudence avant de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Kf1",
    "pourquoi": "Roquer à la main perd trop de temps. Après Fe7 et O-O les Noirs sont prêts à ouvrir le centre avec cxd4 pendant que le roi blanc traîne sur f1 et que la tour h1 dort. Jouez O-O tout de suite."
   },
   {
    "san": "dxc5",
    "pourquoi": "Abandonne le centre que les Blancs cherchent à tenir. Fxc5 développe le fou noir avec gain de temps, puis la dame se recule sur c7 et attaque e5 : le pion blanc qui faisait toute la force de la position devient une cible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 24
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O",
  "nom": "Tarrasch, variante 3...c5 avec 6.Fc4 Dd6",
  "sens": "met le roi à l'abri et relie les tours. Les Blancs ne reprennent pas d4 tout de suite : le cavalier d2 va aller en b3 pour prendre d4 au bon moment, et une tour viendra en e1 appuyer sur e6.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "développe une pièce et prépare le petit roque. Le cavalier contrôle aussi e4 et d5, donc le saut Ce4 des Blancs sera moins gênant. C'est le coup le plus naturel et le plus solide."
   },
   {
    "san": "Nc6",
    "pourquoi": "développe en protégeant le pion d4, qui est le point faible des Noirs. Mais le roi reste au centre un coup de plus, et la dame en d6 reste exposée : on le joue juste après Cf6."
   },
   {
    "san": "Qc7",
    "pourquoi": "retire la dame d'avance de la colonne d, où une tour blanche viendra. La dame surveille c4 et e5. C'est un peu passif : les Noirs retardent leur développement."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "développe, mais trop tôt : après Ce4 la dame doit bouger (Dc7), puis Dxd4 reprend le pion gratuitement et les Blancs ont un gros avantage de développement avec un roi déjà roqué."
   },
   {
    "san": "Qd8",
    "pourquoi": "ranger la dame sans développer est trop lent : les Blancs jouent De2 puis Td1, prennent d4 et dominent le centre pendant que les Noirs n'ont encore aucune pièce sortie."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -6
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7",
  "nom": "Winawer, variante du Pion empoisonné (Poisoned Pawn)",
  "sens": "Sort la dame pour viser e5 et c3, et laisse exprès le pion g7 en prise : les Noirs misent sur l'attaque du centre et du roi blanc resté au milieu plutôt que sur la défense des pions.",
  "menace": "Prendre en d4 (cxd4) puis attaquer c3 et e5 avec la dame ; aussi Cf5 ou Cbc6 pour frapper d4.",
  "plan": [
   {
    "san": "Qxg7",
    "pourquoi": "Prend le pion offert. Après Tg8 Dxh7 cxd4, les Blancs ont deux pions de plus mais la dame est loin et le roi reste au centre : il faut connaître la suite (Cf3, Cd4 pour les Noirs) et ne pas paniquer."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers h7 et prépare le roque. Plus calme : les Blancs gardent l'attaque Dxg7 en réserve et peuvent répondre à cxd4 par cxd4 ou Ce2."
   },
   {
    "san": "Rb1",
    "pourquoi": "Met la tour sur la colonne b ouverte, vise b7. Le roi blanc n'a plus besoin de la tour en a1 ; les Noirs doivent surveiller b7 avant de roquer long."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Défend d4 avec une pièce qui se fait chasser : après cxd4 Fxd4 Cf5, le cavalier attaque le fou et la dame, d4 tombe et le centre blanc s'écroule."
   },
   {
    "san": "Bf4",
    "pourquoi": "Semble défendre e5, mais après cxd4 Tc1 Dxc3+ les Noirs gagnent le pion c3 avec échec : c3 n'était protégé par personne."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 63
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7",
  "sens": "amène le cavalier vers f5, où il attaquera le fou e3 et le pion d4, ou vers g6 pour peser sur e5 ; en attendant, le pion f6 reste prêt à prendre en e5 au bon moment.",
  "menace": "Cf5 attaque le fou e3 ; après Fd2 ou Ff4, le pion d4 devient faible et ...fxe5 ouvre le jeu.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier et prépare Ca4-c5 vers les cases noires affaiblies par bxc6. Si ...Cf5, le fou peut reculer en f4 ou d2 sans drame car d4 sera défendu par la dame. Laisse aux Noirs le choix entre ...fxe5 et ...c5, mais les Blancs restent mieux développés."
   },
   {
    "san": "Nh4",
    "pourquoi": "Contrôle f5 avant que le cavalier noir n'y arrive, et prépare Dh5+ ou f4 pour tenir e5. Le cavalier h4 est au bord, mais il empêche le plan principal des Noirs."
   },
   {
    "san": "Qd3",
    "pourquoi": "Défend d4 et e3 d'avance, prépare le grand roque et vise le pion a6. Après ...Cf5, le fou recule en f4 et tout est protégé. Laisse aux Noirs ...c5 pour ouvrir le centre."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Défend d4 trop tôt et oublie le fou. Après 8...Cf5 9.O-O Cxe3 les Noirs gagnent la paire de fous sans rien donner, et les pions blancs du centre deviennent plus faibles."
   },
   {
    "san": "h4",
    "pourquoi": "Pousse un pion de l'aile sans rien défendre. 8...Cf5 force 9.Ff4, puis 9...Tb8 attaque b2 : les Blancs n'ont pas roqué et perdent du temps à parer les menaces."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 72
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6",
  "sens": "Développe en préparant la suite : le roi blanc est encore au centre et le pion e5 est avancé mais isolé. Les Blancs veulent le consolider avant que les cavaliers noirs ne l'attaquent.",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "Soutient e5 avec un pion : désormais Cc6 et Cge7 ne pourront plus le gagner. Le pion e5 devient la tête d'une chaîne solide qui étouffe le jeu noir sur l'aile roi. En échange, la diagonale e1-h4 s'ouvre un peu autour du roi, il faudra roquer vite."
   },
   {
    "san": "Bd2",
    "pourquoi": "Développe le fou qui bloquait la tour a1, et prépare Fc3 : le fou viendra lui aussi défendre e5 et s'opposer au fou b6 sur la longue diagonale. Coup calme qui ne crée pas de faiblesse."
   },
   {
    "san": "Nf3",
    "pourquoi": "Développe en défendant e5 une fois de plus et prépare le roque. Attention : après Cc6 et Cge7 la pression monte, il faudra penser à f4 ou Ff4 pour tenir le pion."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Ouvre le centre au mauvais moment : les Noirs prennent dxc4, et après Dxc4 la dame c7 capture e5 avec échec. Les Blancs perdent un pion et le roi noir est tranquille, le leur non."
   },
   {
    "san": "Bg5",
    "pourquoi": "Le fou n'attaque rien : il n'y a pas de cavalier en f6 à clouer. Les Noirs continuent Cc6 et Cge7 et la pression sur e5 augmente, pendant que le fou devra peut-être reculer après h6. Un coup qui perd du temps au lieu de défendre e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -23
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O",
  "nom": "Variante d'échange, avec c4-c5",
  "sens": "Met le roi à l'abri avant d'ouvrir le centre. La tour f8 pourra venir sur e8, et ...b6 reste en réserve pour attaquer la chaîne c5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même logique que les Noirs : le roi se met à l'abri avant que la colonne e ne s'ouvre. Ensuite la tour e1 prend la colonne ouverte et le cavalier b1 se développe sans se presser. Les Noirs répondront ...b6 pour frapper c5."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en soutenant le pion c5 par avance : quand ...b6 arrive, c5 tient. Le fou surveille aussi d4. Laisse aux Noirs ...Ne4 ou ...b6 avec une position équilibrée."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe le cavalier vers e2-f4 ou b5 et pèse sur d5. Attention : le pion c5 n'est alors défendu que par d4, donc ...b6 vient vite ; il faudra répondre b4 ou cxb6 selon le cas."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 18
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3",
  "nom": "Défense française, variante Rubinstein (sous-variante 5...Dxf6)",
  "sens": "place le fou sur la diagonale qui regarde h7 et libère la case f1 pour le roque ; il garde aussi l'œil sur e4 pour interdire la poussée libératrice ...e5.",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "Développe le fou sur sa diagonale active, vers h2. La dame f6 et le fou d6 regardent ensemble le roi blanc après O-O, et les Noirs préparent eux-mêmes le petit roque. Les Blancs répondront De2 ou O-O ; ils gardent le pion d4 mais rien de plus."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 : le pion central doit être défendu par c3 ou Fe3. Le cavalier n'a pas de pion c6 qui le gêne, car les Noirs ont ouvert la diagonale c8-h3. Il prépare aussi ...e5 une fois le fou f8 sorti."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou qui est le problème habituel de la Française. Il vise c6 puis la grande diagonale, ou soutient ...Cc6 sans craindre Fb5. Un coup calme qui finit le développement avant de choisir où mettre le roi."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "Attaque d4 trop tôt. Après Fe3 Cc6 dxc5, les Blancs gagnent un pion net : le fou f8 n'est pas sorti, donc rien ne reprend sur c5 tout de suite, et la dame f6 est hors jeu pour défendre."
   },
   {
    "san": "Qd8",
    "pourquoi": "Recule la dame par peur fantôme. Les Blancs jouent De2, Cc6, c3 et prennent tout l'espace : ils roquent, mettent les tours au centre, et les Noirs ont perdu deux temps pour rien. La dame était très bien sur f6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -74
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4",
  "sens": "Fixe le pion h5 et interdit ...g5 : si ce pion avance, hxg5 ouvre la colonne h devant la tour h1. La dame reste sur f4 pour soutenir e5, et la case g5 devient un point d'appui possible pour le cavalier.",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "Attaque e5 une troisième fois (pion f6, cavalier c6, dame c7) tout en évitant les échanges sur e5 qui soulageraient les Blancs. Après ...fxe5, le pion blanc avancé disparaît et la dame c7 surveille aussi c2 et la diagonale vers h2. Les Noirs gardent leur pion d4 de plus et une position très confortable."
   }
  ],
  "erreurs": [
   {
    "san": "fxe5",
    "pourquoi": "Trop pressé : après Nxe5 Nxe5 Qxe5, tout s'échange sur e5 et la dame blanche se retrouve au centre, active, sans plus aucune pression. Les Noirs ont perdu presque tout leur avantage : préparer la prise avec Qc7 d'abord est bien plus fort."
   },
   {
    "san": "Nh6",
    "pourquoi": "Développe, mais oublie la diagonale d3-h7 : après c3 dxc3, Bg6+ met le roi noir en échec et la position s'ouvre pour les pièces blanches alors que le roi noir n'est pas roqué. Le cavalier sur h6 est aussi exposé à Bxh6 plus tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 139
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 exd5 (échange Fb5+)",
  "sens": "Prend le fou d7 avant qu'il ne soit chassé par ...a6 : les Blancs simplifient le jeu, gardent un développement facile et préparent le petit roque, dxc5 puis la pression sur le pion isolé d5 avec Cb3 et les tours en colonne e.",
  "plan": [
   {
    "san": "Nbxd7",
    "pourquoi": "Reprend avec le cavalier dame : le cavalier b8 se développe gratuitement et la dame reste libre pour d6 ou b6. Les Noirs roquent ensuite et jouent ...Fd6 ou ...Fe7 ; le pion d5 sera isolé après dxc5, mais les pièces noires actives le défendent sans peine."
   },
   {
    "san": "Qxd7",
    "pourquoi": "Reprend avec la dame : elle regarde déjà la colonne e et le pion c5 reste soutenu par ...Cc6. Le cavalier b8 ira en c6 pour appuyer d4 et c5. Un peu moins souple, car la dame peut être attaquée par Ce5 plus tard."
   },
   {
    "san": "Nfxd7",
    "pourquoi": "Reprend avec le cavalier roi : jouable, mais il quitte f6 où il défendait d5 et h7, et il faudra le ramener. Le roque est retardé d'un temps. À connaître, mais préférer Nbxd7."
   }
  ],
  "erreurs": [
   {
    "san": "Kxd7",
    "pourquoi": "Reprendre du roi perd le droit de roquer et laisse le roi au centre, sur une colonne qui va s'ouvrir. Après 8.O-O le roi doit fuir vers c8, puis 9.c4 ouvre les lignes contre lui : les tours blanches attaquent et les Noirs n'ont plus aucune sécurité."
   },
   {
    "san": "Ke7",
    "pourquoi": "Ignorer la prise est encore pire : le fou blanc n'est pas repris et peut se replier en h3. Les Noirs ont donc perdu une pièce entière pour rien, le roi reste bloqué au centre et les Blancs roquent tranquillement avec une position gagnante."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -7
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O",
  "nom": "Variante classique, 7.f4 O-O",
  "sens": "Met le roi à l'abri avant d'ouvrir le centre par ...c5 : la tour arrive en f8 et pourra soutenir ...f6 contre la pointe e5.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe le cavalier sur sa meilleure case : il protège d4 (que ...c5 va attaquer) et e5 (que ...f6 va attaquer). Les Blancs gardent leur chaîne d4-e5 et leur avantage d'espace. Après ...c5, ils peuvent continuer Dd2 et O-O-O, ou Fd3 avec l'idée de pointer vers h7."
   },
   {
    "san": "Qd2",
    "pourquoi": "Sort la dame pour relier les pièces et préparer le grand roque. Elle soutient aussi d4 une deuxième fois. Si les Noirs jouent ...c5 et ...Cc6, les Blancs répondent Cf3 et O-O-O : le roi blanc part à gauche, loin de la poussée ...f6."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou sur la diagonale b1-h7, vers le roi noir, et prépare le petit roque. Mais le fou bouche la colonne d : d4 n'est plus protégé par la dame, il faudra vite jouer Cf3 pour tenir le centre après ...c5."
   }
  ],
  "erreurs": [
   {
    "san": "Nge2",
    "pourquoi": "Mauvaise case : le cavalier ne défend ni d4 ni e5 aussi bien que depuis f3, et il gêne le fou f1. Les Noirs gagnent du temps par ...a6 et ...b5, lancent leur attaque sur l'aile dame pendant que les Blancs peinent à finir leur développement."
   },
   {
    "san": "Qg4",
    "pourquoi": "Trop tôt : la dame part attaquer un roi déjà roqué, sans aucune pièce pour l'aider. Après ...c5 et ...Cc6, les Noirs tapent sur d4 et le centre blanc craque, tandis que la dame en g4 peut être chassée par ...f5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 53
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O",
  "sens": "Met le roi à l'abri avant tout et laisse le pion d4 en pâture : les Blancs préfèrent gagner un temps de développement plutôt que de reprendre tout de suite, et gardent en réserve la capture Fxh6 qui casserait les pions du roque noir.",
  "menace": "Reprendre le pion par cxd4, puis Fxh6 pour abîmer les pions devant le roi noir si le cavalier reste en h6.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Développe une pièce et prépare ...Tc8 sur la colonne c. Il empêche aussi Fb5 qui clouerait le cavalier c6. Les Noirs gardent le choix entre ...dxc3 et ...Cf5 pour le coup suivant, sans rien donner aux Blancs."
   },
   {
    "san": "Nf5",
    "pourquoi": "Sort le cavalier de h6 avant que Fxh6 ne vienne doubler les pions g. Si les Blancs jouent Fxf5 exf5, le fou c8 respire enfin et les Noirs ont la paire de fous. Attention : le cavalier ne pourra plus sauter en d4, le pion f5 doit ensuite être défendu."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe et prépare le petit roque. Le fou pourra aller en g5 pour s'échanger contre le fou c1. Les Blancs peuvent reprendre le pion par cxd4, mais les Noirs ont terminé leur développement et le roi noir sera bientôt en sécurité."
   }
  ],
  "erreurs": [
   {
    "san": "Qd8",
    "pourquoi": "Recule la dame au lieu de développer : Fxh6 gxh6 et les pions du roque noir sont doublés et isolés, puis cxd4 reprend le pion. Les Noirs ont perdu deux temps et leur roi n'a plus d'abri."
   },
   {
    "san": "g6",
    "pourquoi": "Veut protéger la case f5, mais après cxd4 Cf5 Fxf5 gxf5, les pions f et h sont faibles et le roi noir n'a plus de roque sûr. Les Blancs ont repris le pion et attaquent gratuitement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -27
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4",
  "sens": "Prend le pion c4 au moment où le fou blanc vient de quitter sa diagonale : les Blancs devront le reprendre avec Fxc4, un deuxième coup de fou, et resteront avec un pion d4 isolé que les Noirs pourront attaquer.",
  "menace": "Garder le pion supplémentaire si les Blancs tardent : après Fe6 ou b5, le pion c4 serait solidement défendu et les Blancs auraient simplement perdu un pion.",
  "plan": [
   {
    "san": "Bxc4",
    "pourquoi": "Reprend le pion tout de suite. Le fou se place sur une bonne diagonale vers f7 et le matériel est égal. Oui, les Blancs ont joué deux fois le fou, mais ils roquent au coup suivant et leur pion d4 isolé contrôle e5 et c5 : la position reste équilibrée."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord et reprend c4 au coup suivant. Si les Noirs défendent c4 par Fe6, les Blancs jouent Cd2 ou Ce5 pour récupérer le pion. Un peu plus lent, mais sûr."
   }
  ],
  "erreurs": [
   {
    "san": "Bg5",
    "pourquoi": "Développe une pièce mais oublie le pion c4. Après Fe6 les Noirs le protègent et gardent un pion de plus. Les Blancs ont développé joliment... un pion en moins. Reprendre d'abord, développer ensuite."
   },
   {
    "san": "Qc2",
    "pourquoi": "Attaque c4 avec la dame, mais Cc6 attaque le pion d4 isolé et après O-O Cxd4 les Noirs prennent un second pion. Les pions isolés doivent être défendus avant d'attaquer ceux de l'adversaire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -14
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6",
  "sens": "Échange le fou de cases blanches contre le cavalier c6 avant que ...b5 ne le chasse : les Noirs héritent de pions doublés c6-c7, le fou c8 reste bloqué derrière e6 et d5, et le centre e5 tient mieux.",
  "menace": "Le fou c6 attaque la tour a8 et le cavalier d7 : il faut le reprendre tout de suite, sinon les Blancs gagnent une pièce entière.",
  "plan": [
   {
    "san": "bxc6",
    "pourquoi": "Le seul coup : il reprend la pièce. Les Noirs ouvrent la colonne b pour la tour, préparent ...c5 pour attaquer d4 et ...Fa6 pour sortir le mauvais fou. Mais les pions c6-c7 doublés et le centre e5 donnent un petit avantage aux Blancs."
   }
  ],
  "erreurs": [
   {
    "san": "fxe5",
    "pourquoi": "Oublie que le fou c6 attaque. Après Fxd7+ Fxd7 Cxe5, les Blancs ont gagné une pièce pour rien et occupent e5 avec un cavalier. Toujours reprendre avant d'attaquer ailleurs."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe tranquillement comme si rien ne se passait. Mais exf6 gxf6 Fa4 : le fou s'enfuit avec une pièce de plus, et le roi noir est à découvert sur la colonne g."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -40
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3",
  "nom": "Variante Rubinstein (Défense française)",
  "sens": "Les Noirs doivent trouver du jeu pour leurs pièces : le fou de c8 est encore enfermé derrière le pion e6, et il faut attaquer le centre blanc avant que l'attaque sur h7 ne démarre.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Attaque tout de suite le pion d4 et ouvre la colonne c pour la dame et la tour. Si les Blancs échangent en c5, la dame noire peut reprendre en c5 ou en d4 (la dame blanche en d1 n'est pas protégée). Après ...c5, le fou de c8 pourra sortir par d7 ou b7 et les Noirs ont un jeu de pièces libre."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou qui gêne tout le monde et prépare ...Fc6 : sur la grande diagonale, ce fou vise g2 et le cavalier f3, et il protège le roi noir à distance. C'est un coup calme qui ne crée aucune faiblesse."
   },
   {
    "san": "b6",
    "pourquoi": "Prépare ...Fb7 pour mettre le fou sur la longue diagonale. L'inconvénient : les cases c6 et a6 deviennent un peu faibles, et les Blancs gagnent un temps pour attaquer avec De2 et Fg5."
   }
  ],
  "erreurs": [
   {
    "san": "Bb4+",
    "pourquoi": "L'échec ne sert à rien : les Blancs jouent c3 et le fou doit repartir en e7. Les Noirs ont perdu deux coups, et le pion c3 renforce le centre blanc. Un échec n'est utile que s'il apporte quelque chose."
   },
   {
    "san": "h6",
    "pourquoi": "Affaiblit le roque sans besoin : le fou d3 vise déjà h7, et avec h6 la case g6 et la diagonale deviennent des cibles. Les Blancs jouent De2 puis Ce5 et leur attaque arrive avant que les Noirs aient fini de se développer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -36
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7",
  "sens": "attaque e5, le pion de pointe des Blancs, qui n'est défendu que par la dame. Elle oblige les Blancs à réagir tout de suite. La dame se place aussi sur la colonne c, ouverte après bxc6, et vise c2 si le fou d3 bouge.",
  "menace": "Dxe5 gagne le pion central des Blancs. Après la prise, la dame noire domine le centre et les Blancs n'ont plus de pion de pointe.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Défend e5 une deuxième fois sans rien bloquer. La dame laisse la case d1 libre pour une tour et surveille aussi e4. Les Blancs peuvent ensuite jouer Ff4, 0-0 et f4 pour renforcer e5. Les Noirs continueront Fa6 ou c5, mais ils n'ont rien gagné."
   },
   {
    "san": "f4",
    "pourquoi": "Soutient e5 avec un pion : c'est la défense la plus solide, le pion f4 ne se laissera pas chasser. Le centre blanc devient un mur d'où partira l'attaque sur le roi noir. Le prix à payer : la diagonale g1-a7 et la case e3 sont affaiblies, et le roi blanc devra roquer vite."
   },
   {
    "san": "Bf4",
    "pourquoi": "Défend e5 en développant une pièce. Le fou vise aussi la case d6 et gêne le développement du fou f8. Attention : après Cf6 ou Ce7 les Noirs vont attaquer le fou et le pion e5 par Cg6, il faudra bien calculer."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le roque est naturel, mais il ignore la menace. Après Dxe5 Te1, les Blancs attaquent la dame et récupèrent du temps, mais pas le pion : la dame recule en b8 et les Noirs ont un pion de plus. Le pion e5 est le cœur de la position blanche, on le défend d'abord, on roque ensuite."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développe une pièce, mais pas celle qui aide e5. Après Dxe5 le pion est perdu pour rien, et le cavalier c3 est gênant : il bouche la case c3 au pion c2 et ne protège rien. Avant de développer, on regarde ce qui est attaqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5",
  "nom": "Variante d'avance, 7...Cf5 8.dxc5",
  "sens": "Liquide le pion d4 attaqué trois fois (par Cc6, Cf5 et la dame) avant qu'il ne tombe : plutôt que de le défendre encore, les Blancs l'échangent et gardent seulement le pion e5 comme point fort au centre.",
  "menace": "Aucune menace directe, mais si les Noirs tardent à reprendre, b2-b4 protège le pion c5 et le conserve.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Reprend tout de suite le pion. Le fou se place sur la grande diagonale a7-g1 et vise la case f2 devant le roi blanc. Il faut reprendre maintenant : un coup de retard et b4 garderait le pion. Ensuite les Noirs roquent et jouent la dame en c7 ou b6 pour s'occuper du pion e5."
   },
   {
    "san": "a5",
    "pourquoi": "Empêche d'abord b2-b4, qui est le coup que les Blancs aimeraient jouer. Le pion c5 ne peut pas se sauver : les Noirs le reprendront au coup suivant sans que le fou soit chassé par b4. Plus lent, mais le fou gardera ensuite sa diagonale tranquille."
   }
  ],
  "erreurs": [
   {
    "san": "Nfe7",
    "pourquoi": "Recule le cavalier qui venait de prendre place en f5 et perd du temps. Les Blancs jouent b2-b4 : le pion c5 est protégé et reste aux Blancs. Les Noirs ont donné un pion pour rien."
   },
   {
    "san": "b6",
    "pourquoi": "Veut reprendre avec le pion, mais après cxb6 Dxb6 b4 les Blancs ont gagné des coups : le pion b4 prend de l'espace et la dame noire se retrouve exposée, tandis que le fou f8 n'est toujours pas sorti."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -27
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5",
  "nom": "Défense française, variante Steinitz (8.dxc5)",
  "sens": "Échange le pion d4 avant qu'il ne tombe : plus de cible en d4 à défendre, et les Blancs gardent la chaîne e5/f4 pour attaquer à l'aile roi avec Dd2 et 0-0-0.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Reprend le pion avec le fou : le fou sort de la case passive e7 et vient s'échanger contre le bon fou e3. Attention : Fxc5 Fxc5 Cxc5 est possible, mais aussi Dd2 ou Dd4 qui cloue le fou ; roquer ensuite est urgent."
   },
   {
    "san": "Nxc5",
    "pourquoi": "Reprend avec le cavalier : il quitte d7 pour une case active, lorgne e4 et d3, et libère le fou c8 qui respire enfin. Le pion d5 reste solide, et Fe7 garde le roque bien couvert."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord : le pion c5 ne s'enfuit pas, les Noirs le reprendront au coup suivant. Mais cela laisse aux Blancs un temps pour jouer a3 et b4 et garder le pion un moment."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Attaquer la chaîne tout de suite est naturel, mais après exf6 Cxf6 Fb5 le roi noir est à découvert sur la colonne e, le cavalier c6 est cloué, et e6 devient faible pour toute la partie."
   },
   {
    "san": "b6",
    "pourquoi": "Vouloir reprendre en c5 avec un pion semble malin, mais cxb6 Cxb6 Fb5 laisse les Noirs sans le pion d4 gagné, avec un cavalier mal placé en b6 et le cavalier c6 cloué : un pion de moins pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -24
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2",
  "nom": "Variante d'avance, ligne Cc6-Db6-Ch6",
  "sens": "Protège b2 et c3 d'un seul coup après avoir pris le cavalier h6 : la dame reste au centre pour soutenir d4, le roque devient possible et le pion h6, maintenant doublé et isolé, est une cible future pour Dxh6.",
  "menace": "Dxh6 : le pion h6 n'est défendu par rien tant que le fou n'est pas en g7.",
  "plan": [
   {
    "san": "Bg7",
    "pourquoi": "Couvre h6 et place le fou sur la grande diagonale, pointé vers e5 et d4. C'est la case naturelle du fou après gxh6 : il travaille au lieu de rester enfermé. Les Noirs pourront ensuite jouer f6 pour attaquer e5."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou de cases blanches et prépare Tc8 ou Tg8 selon le besoin. Le fou peut aussi aller en b5 pour échanger le bon fou blanc e2. La dame b6 et le cavalier c6 continuent de presser d4."
   },
   {
    "san": "a5",
    "pourquoi": "Gagne de l'espace à l'aile dame et prépare a4 pour fixer le pion b2 et gêner les Blancs. Le roi blanc n'est pas encore roqué : les Noirs attaquent sur l'aile où ils sont les plus forts."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Mauvaise case : le fou ne couvre pas h6 et ne presse rien. Après 0-0 Fd7, les Blancs jouent dxc5 et le pion c5 est pris sans compensation car la dame b6 doit aussi surveiller h6."
   },
   {
    "san": "Ne7",
    "pourquoi": "Retire la pression sur d4 et e5 au mauvais moment : après 0-0 cxd4 cxd4, les Blancs ont un centre solide et le cavalier e7 bloque le fou f8. Les Noirs perdent leur jeu actif pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -38
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O",
  "nom": "Tarrasch, variante 3...Cf6 (gambit du pion b2)",
  "sens": "Place le roi à l'abri sur l'aile roi et relie les tours avant que le centre ne s'ouvre. Les Blancs abandonnent le pion b2 : ils comptent sur leur avance de développement et sur le pion e5 qui gêne le roi noir.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Prend d'abord au centre. Après cxd4 Cxd4 Cxd4 Dxd4, les Noirs gagnent un pion sain et la pression sur d4 disparaît. C'est le moment : les Blancs n'ont pas encore joué Te1 ni Cb3."
   },
   {
    "san": "a5",
    "pourquoi": "Prépare a4, qui empêche Cb3 et gagne de l'espace à l'aile dame. La dame b6 reste active contre b2 et d4, et le pion c5 garde la tension au centre."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe le fou pour roquer vite. Les Noirs renoncent à prendre tout de suite et jouent solide : le centre reste fermé et le roi va en sécurité."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Idée naturelle pour attaquer e5, mais trop tôt. Après exf6 Cxf6 Cg5, le cavalier g5 vise e6 et h7, le roi noir est encore au centre et la case e5 reste faible."
   },
   {
    "san": "Qa5",
    "pourquoi": "La dame se déplace sans but et quitte la pression sur b2 et d4. Les Blancs jouent Cg5 puis Dh5 : les Noirs doivent se défendre contre f7 et h7 avant d'avoir roqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -32
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 Dxd5 (type « dame en d6 »)",
  "sens": "sort le cavalier vers le centre, surveille e4 et d5, et prépare le petit roque",
  "plan": [
   {
    "san": "Nb3",
    "pourquoi": "le cavalier attaque le pion d4 et ouvre la diagonale du fou c1. Les Noirs doivent défendre d4 (Cc6) ou le rendre. Si la dame d6 se déplace, Fb5+ ou Cxd4 deviennent possibles. C'est le coup le plus énergique : les Blancs récupèrent le pion avec une activité supérieure."
   },
   {
    "san": "Re1",
    "pourquoi": "la tour prend la colonne e, ouverte vers le roi noir encore au centre. Elle prépare Ce4 : le cavalier viendrait avec gain de temps sur la dame d6, et si cxd4 est repris, la tour pèsera sur e6. Les Blancs ne se pressent pas pour d4 : le pion ne s'échappe pas."
   },
   {
    "san": "Qe2",
    "pourquoi": "la dame se place aussi sur la colonne e et soutient un futur Ce4. Elle libère d1 pour la tour, qui regardera le pion d4. Simple et solide, un peu moins incisif que Cb3 car les Noirs ont le temps de roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 11
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4",
  "sens": "Soutient e5 avec un pion pour que Cc6 et Cge7 ne puissent plus le gagner : le pion e5 devient la tête d'une chaîne solide qui étouffe le jeu noir sur l'aile roi, au prix d'une diagonale e1-h4 un peu ouverte autour du roi blanc.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier roi sans bloquer le pion f : il ira en f5 ou en c6, et prépare le petit roque. Il laisse aux Blancs le temps de jouer Cf3, mais sans dégât."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite la tête de la chaîne : si exf6, le centre blanc s'effondre et la colonne f s'ouvre pour les Noirs. Il faut ensuite faire attention à la diagonale a2-g8 et à la case e6."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en pressant e5 une fois de plus et prépare Cge7 puis f6. Simple et naturel : les Noirs gardent une position saine."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Perd un temps pour rien : après Fe3, les Blancs échangent le bon fou b6 ou gagnent du temps dessus, puis roquent long. Les Noirs n'ont rien développé."
   },
   {
    "san": "d4",
    "pourquoi": "Le pion avance seul dans le vide : Dc4 l'attaque et harcèle aussi f7, puis Cf3 le cible encore. Il devient une faiblesse à défendre au lieu d'une force."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 23
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4",
  "nom": "Tarrasch, variante 3...Cf6, ligne principale avec 7.Ce2",
  "sens": "Reprend sur d4 avec le pion c pour garder la chaîne d4-e5 intacte : le pion e5 reste soutenu par d4, et le cavalier d2 pourra aller en f3 défendre d4 à son tour.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Attaque la tête de la chaîne, le pion e5. Si les Blancs prennent exf6, le cavalier d7 reprend et les Noirs obtiennent la colonne f et le centre e5. Si les Blancs défendent par Cf3, ...fxe5 ouvre la colonne f et le pion d4 devient une cible pour ...Db6 et ...Cxd4 plus tard."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque la base de la chaîne, le pion d4, avec la dame et le cavalier c6. Prend aussi b2 dans le viseur, ce qui gêne le fou c1. Les Blancs doivent répondre Cf3 ou Cb3 et retardent leur roque."
   }
  ],
  "erreurs": [
   {
    "san": "Nb6",
    "pourquoi": "Le cavalier quitte d7 et ne pourra plus reprendre en f6 ni attaquer e5. Après Cf3 et le roque blanc, les Noirs n'ont plus de cible : ils ont perdu un temps et le plan ...f6 ne marche plus aussi bien."
   },
   {
    "san": "Be7",
    "pourquoi": "Coup de développement tranquille, mais il laisse les Blanc roquer et jouer Cf3 : d4 est alors défendu et la chaîne blanche est solide. Les Noirs n'ont plus de pression, et l'espace blanc à l'aile roi se fait sentir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -25
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3",
  "sens": "Sort la dernière pièce mineure et vise la case c5 par Ca4 : les cases noires du côté dame sont fragiles depuis bxc6. Garde d4 solide (fou e3, dame d1) tout en laissant aux Noirs le choix de ...fxe5 ou ...c5.",
  "menace": "Ca4 puis Cc5 : le cavalier s'installe sur une case noire que les Noirs ne peuvent plus chasser avec un pion b.",
  "plan": [
   {
    "san": "Nf5",
    "pourquoi": "Attaque le fou e3 et le pion d4. Le fou doit reculer, les Blancs perdent un temps. Le cavalier est aussi très actif sur f5 pour la suite ...c5 ou ...fxe5."
   },
   {
    "san": "Rb8",
    "pourquoi": "Met la tour sur la colonne b ouverte par bxc6 et vise le pion b2. Si Ca4, la tour gêne déjà le cavalier et la poussée ...Tb4 devient possible."
   },
   {
    "san": "a5",
    "pourquoi": "Prépare ...Fa6 pour échanger le fou enfermé, et empêche b4 qui soutiendrait un cavalier en c5. Coup lent mais utile, les Blancs gardent l'initiative."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "Trop tôt : après dxc5 Cf5 exf6, le centre noir s'écroule, le pion c5 est perdu et le roi reste exposé sur e8."
   },
   {
    "san": "Bb7",
    "pourquoi": "Le fou reste buté sur c6 et d5. Après Ca4 et De2, les Blancs prennent c5 et les Noirs n'ont rien fait pour leur développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -67
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O",
  "nom": "Variante d'échange, système avec c4-c5",
  "sens": "Met le roi à l'abri avant que la colonne e ne s'ouvre : la tour f1 pourra venir en e1 et le cavalier b1 se développera tranquillement.",
  "plan": [
   {
    "san": "b6",
    "pourquoi": "Frappe aussitôt le pion c5, la pointe de la chaîne blanche. Si cxb6, axb6 ouvre la colonne a pour la tour et le pion b6 contrôle c5. Si les Blancs défendent par b4, ...a5 continue de miner la chaîne."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en visant b4 et e5. Le cavalier prépare ...Ff5 ou ...Fg4 et laisse ...b6 pour plus tard. Les Blancs peuvent gagner du temps avec a3, mais sans réel danger."
   },
   {
    "san": "Re8",
    "pourquoi": "Occupe la colonne e ouverte en premier. Le fou e7 est protégé, et ...Cc6 puis ...Fg4 suivent. Laisse aux Blancs le temps de jouer Cc3 et Te1 : c'est plus calme que ...b6."
   }
  ],
  "erreurs": [
   {
    "san": "a6",
    "pourquoi": "Perd un temps : le coup ne prépare rien de concret. Après h3 puis ...b6 cxb6, les Noirs reprennent avec un pion a6 déjà avancé, ce qui affaiblit le long terme sans la colonne a ouverte."
   },
   {
    "san": "Kh8",
    "pourquoi": "Sans aucune utilité : le roi en g8 était déjà parfaitement placé. Les Blancs jouent Ff4 et Cc3 et prennent une avance de développement nette pendant que les Noirs ont joué un coup pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -16
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6",
  "nom": "Variante Rubinstein, sous-variante 4...Cf6",
  "sens": "Met le fou sur la diagonale qui vise h2 et vide la case d7 pour développer le cavalier plus tard. Avec la dame f6 déjà sortie, les deux pièces regardent la même aile, et le petit roque est prêt dès le coup suivant.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Libère la case d1 pour les tours et prépare le grand roque : le roi blanc ira à gauche, loin de la paire dame-fou qui vise h2. Elle garde aussi un œil sur e4 et e5, et laisse les Noirs roquer tranquillement."
   },
   {
    "san": "c3",
    "pourquoi": "Solidifie d4 une bonne fois et donne une case de retraite au fou en c2. Après ce coup, un échange sur d4 n'abîme pas la structure blanche. C'est le coup calme avant de roquer."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. On regarde h2 ? Peu importe : Ff4 ou De2 suivront, et le fou noir ne mord pas tout seul. Les Noirs roquent à leur tour, la position reste solide des deux côtés."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Veut mettre le fou en b2 pour attaquer la dame, mais c'est trop lent. Après Fd7 et Fc6, le fou noir prend la grande diagonale, menace f3 et g2, et le fou blanc en b2 ne vise plus rien derrière le pion d4. Tout l'avantage blanc disparaît."
   },
   {
    "san": "a4",
    "pourquoi": "Un coup de bord qui ne développe rien. Les Noirs jouent Cc6 et roquent : ils ont fini leur développement, les Blancs non. Le pion a4 n'empêche rien et sert seulement de cible plus tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 58
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4 Qc7",
  "sens": "Ajoute une troisième attaque sur e5 (pion f6, cavalier c6, dame c7) sans échanger tout de suite : les Noirs veulent gagner le pion e5 ou forcer sa disparition, tout en surveillant c2 et la diagonale vers h2.",
  "menace": "...Nxe5 : le cavalier prend e5 ; si Nxe5 fxe5 et la dame blanche doit fuir, les Noirs ont deux pions de plus et un centre solide.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant de perdre le pion e5, qui ne peut plus être sauvé. Après ...Nxe5 Nxe5 fxe5, la dame ira sur g3 ou e4 et les Blancs joueront c3 ou Nd2 pour récupérer un peu de jeu contre le roi noir resté au centre. Les Blancs restent moins bien, mais le roi est en sécurité."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Attaque d4 mais oublie e5 : après ...Nxe5 Nxe5 Qxe5, la dame blanche f4 est attaquée et les Noirs gagnent un pion net avec un gros centre. Le roi blanc est encore au milieu."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Prend un pion mais abandonne e5 : ...Qxe5 attaque la dame f4, et après Qxe5 Nxe5 les Noirs ont rendu le pion, échangé les dames et gardent un cavalier central dominant. Les Blancs ont perdu tout espoir d'attaque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -145
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7",
  "nom": "Winawer, variante du Pion empoisonné",
  "sens": "Prend le pion g7 : la dame blanche attaque la tour h8 et le pion h7 pour grappiller encore du matériel pendant que le roi noir est coincé au centre.",
  "menace": "Dxh8+ gagne la tour entière, puisque le roi noir ne peut pas roquer et la tour ne peut ni se défendre ni fuir sans y laisser des plumes.",
  "plan": [
   {
    "san": "Rg8",
    "pourquoi": "Sauve la tour et contre-attaque en même temps : la dame blanche doit maintenant chercher un abri. Après Dxh7, les Noirs jouent cxd4 pour ouvrir le centre et activer leurs pièces, avec Cbc6 et Fd7-0-0-0 à suivre : le roi noir file à l'aile dame. Les Blancs ont deux pions de plus, mais leur dame est loin sur h7 et leur roi est encore au centre sans grand-roque possible, c'est le prix à payer. Il faut connaître cette suite et ne pas paniquer."
   }
  ],
  "erreurs": [
   {
    "san": "Rf8",
    "pourquoi": "Sauve la tour mais la laisse passive sur f8 : elle ne fait rien, alors que sur g8 elle attaquait g2 et gênait la dame. Après Fd2 cxd4 cxd4, les Blancs consolident tranquillement avec un pion de plus."
   },
   {
    "san": "Ng6",
    "pourquoi": "Essaie de couvrir h8 et de gagner un tempo, mais après Fd2 la dame doit rentrer sur e7 et la tour reste clouée sur h8. Les Blancs gardent leur pion en plus et finissent par pousser a4 ou Fd3 pour attaquer g6 : les Noirs ont un mauvais cavalier et rien en échange."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -56
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3",
  "nom": "Variante classique (ligne principale)",
  "sens": "Développe le cavalier sur sa meilleure case : il protège d4, que ...c5 va attaquer, et e5, que ...f6 va attaquer. Les Blancs consolident leur chaîne de pions et gardent leur espace au centre.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Le coup clé de toute Française : on attaque la base de la chaîne, le pion d4. Si les Blancs prennent dxc5, le cavalier reprend en d7xc5 et sort avec gain de temps. Sinon le cavalier b8 va en c6 pour appuyer la pression. Les Blancs répondront Dd2 et grand roque ou Fd3, mais la contre-attaque noire est lancée."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque l'autre pion de la chaîne, e5, pour libérer les pièces noires : après ...fxe5 la colonne f s'ouvre pour la tour f8 et le cavalier d7 peut venir en f6. Attention : le pion e6 devient arriéré et le roi s'ouvre un peu, donc jouer ...c5 d'abord est plus sûr."
   }
  ],
  "erreurs": [
   {
    "san": "Nc6",
    "pourquoi": "Développer avant de frapper le centre perd du temps : les Blancs jouent Fd3 puis h4 et attaquent le roi sur l'aile roi, car le fou vise h7 et les Noirs n'ont rien pour contre-attaquer d4. Il faut jouer ...c5 d'abord, le cavalier ira en c6 ensuite."
   },
   {
    "san": "f5",
    "pourquoi": "Ferme le centre au lieu de l'ouvrir : le pion e5 est verrouillé pour toujours, le fou c8 reste enterré derrière e6 et les Blancs attaquent tranquillement avec Dd2 et Cb5 vers c7. La poussée ...f6 (pour prendre en e5) est la bonne idée, pas ...f5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -42
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O Bd7",
  "nom": "Variante d'avance, système Milner-Barry différé (gambit du pion d4)",
  "sens": "Développe le fou en restant souple : la tour a8 pourra venir en c8, et le fou couvre c6 pour empêcher tout clouage par Fb5. Les Noirs gardent en réserve la prise ...dxc3 ou le saut ...Cf5.",
  "menace": "Prendre en c3 (...dxc3) pour liquider le centre blanc, puis gagner le pion b2 ou e5 après ...Cf5.",
  "plan": [
   {
    "san": "b4",
    "pourquoi": "Gagne de l'espace à l'aile dame et bloque la case c5 au fou noir. Après ...dxc3, le cavalier revient en c3 et les Blancs ont un pion d'avance en moins mais un gros jeu de pièces sur l'aile roi. La dame b6 est aussi plus à l'étroit."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup prophylactique : il retire la case g4 au cavalier h6 et prépare g4 pour chasser un cavalier arrivé en f5. Les Blancs sacrifient le pion c3 sans s'en inquiéter : leur centre e5 et leurs pièces actives le valent."
   },
   {
    "san": "Bc2",
    "pourquoi": "Garde la diagonale b1-h7 tout en libérant d3 pour la dame. Si ...Cf5, le fou peut le viser et la dame peut venir en d3 avec une batterie vers h7."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Reprendre le pion paraît naturel, mais après ...Cxd4 Cc3 Cb3 le cavalier noir fourche la tour a1 et le pion d4 ; les Blancs perdent la qualité ou leur centre. Il faut laisser le pion c3 se faire prendre et jouer vite."
   },
   {
    "san": "a4",
    "pourquoi": "Perd du temps à l'aile dame. Après ...dxc3 Cxc3 Fc5 le fou noir arrive en c5 avec vue sur f2, et la dame b6 le soutient : les Noirs ont un pion de plus et plus d'activité."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 31
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5",
  "nom": "Variante Rubinstein (Défense française)",
  "sens": "Attaque le centre blanc en d4 et ouvre la colonne c pour la dame et la tour ; il libère aussi la case c6 pour le fou et prépare un jeu de pièces actif.",
  "menace": "Prendre en d4 (cxd4) et gagner un pion : le cavalier f3 reprend mais la dame d1 reste sans protection si les pièces noires arrivent sur la colonne d.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Prend le pion tout de suite et supprime la tension. Les Noirs reprennent avec le fou (Bxc5) ou la dame, mais le fou noir ne pourra plus utiliser une chaîne de pions fixe pour viser d4. Les Blancs gardent un développement rapide et le coup O-O suivra."
   },
   {
    "san": "Be3",
    "pourquoi": "Défend d4 avec une pièce de développement. Si cxd4 Bxd4, le fou prend une belle case centrale. Cela prépare aussi Qe2 et O-O. Les Noirs peuvent jouer Qc7 ou Bd6 pour continuer le développement."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient d4 avec un pion, de façon solide. La case c3 est libre depuis que le cavalier est parti. Les Blancs garderont un centre stable ; en échange ils acceptent un jeu un peu plus lent, et les Noirs auront le temps de sortir le fou par b7 ou d7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2",
  "sens": "Défend e5 une deuxième fois sans gêner les pièces : la dame garde la case d1 libre pour une tour, surveille e4 et prépare Ff4, 0-0 puis f4 pour bétonner e5.",
  "plan": [
   {
    "san": "f5",
    "pourquoi": "Gagne de l'espace et verrouille le centre : le pion e5 blanc ne pourra plus être soutenu par f4-f5. Les Noirs préparent ensuite Ce7 et c5 pour jouer sur l'aile dame. Attention : la case e5 reste un bon avant-poste blanc et la case e6 devient un peu faible."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier vers g6 ou f5, d'où il attaque e5. Le cavalier ne bloque pas le fou de cases blanches, qui ira en a6 pour échanger le fou d3 blanc."
   },
   {
    "san": "c5",
    "pourquoi": "Pousse le pion doublé pour libérer la diagonale du fou vers a6 et gagner de l'espace. Le centre noir (c5-d5) devient mobile, mais la case d5 peut devenir une cible après c3 ou c4 des Blancs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 3
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec Fb5+",
  "sens": "Reprend avec le cavalier dame pour le développer sans perdre de temps : le cavalier b8 arrive sur d7 d'où il soutient f6 et e5, et la dame reste libre pour d6 ou b6. Les Noirs vont ensuite roquer et placer le fou en d6 ou e7.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et connecte les tours. C'est le coup le plus utile : après ...Fe7 et ...O-O, les Blancs jouent Te1 ou Cb3 et commencent à presser le pion d5, qui sera isolé après dxc5."
   },
   {
    "san": "dxc5",
    "pourquoi": "Prend tout de suite le pion c5 pour isoler d5 : après ...Cxc5 les Blancs continuent O-O, Cb3 et Cbd4, et le cavalier s'installe devant le pion isolé. Les Noirs obtiennent des pièces actives en échange, mais ils devront défendre d5 toute la partie."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient le centre d4 et garde la tension : les Blancs choisiront plus tard entre dxc5 et un développement tranquille (O-O, Te1, Cb3). Cela laisse aux Noirs le temps de jouer ...Fd6 et ...O-O sans problème."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 23
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4",
  "nom": "Défense française, variante d'échange avec 4.c4 (structure du pion isolé)",
  "sens": "reprend aussitôt le pion c4 pour rétablir l'égalité matérielle et place le fou sur la diagonale a2-g8, qui vise f7. Le roi blanc est encore au centre, mais il roquera au prochain coup.",
  "plan": [
   {
    "san": "Bg4",
    "pourquoi": "cloue le cavalier f3 sur la dame et attaque ainsi le pion d4, qui est isolé et a besoin du cavalier pour être défendu. Les Blancs devront roquer ou jouer Fe3, et les Noirs gagnent du temps en développant une pièce."
   },
   {
    "san": "Nc6",
    "pourquoi": "développe le cavalier en attaquant directement d4. Le pion isolé devient une cible : après Fg4 et Te8, les Noirs auront toutes leurs pièces contre lui. Les Blancs peuvent répondre O-O et Fe3, mais ils restent sur la défensive."
   },
   {
    "san": "Qe7+",
    "pourquoi": "donne échec sur la colonne e ouverte. Les Blancs doivent parer avec Fe3 ou Fe2, ce qui ralentit un peu leur roque. C'est correct, mais cela laisse la dame exposée à Te1 plus tard : préférer Fg4 ou Cc6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6 bxc6",
  "sens": "Reprend la pièce avec le pion b et ouvre la colonne b pour la tour. Les Noirs préparent ...c5 contre d4 et ...Fa6 pour sortir le fou de c8, mais gardent des pions doublés sur c6 et c7.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le centre. Garde la tension sur e5 : si ...fxe5, dxe5 Cxe5 Cxe5 et le pion e5 tient, car il est défendu par d4 et le cavalier f3. Les Noirs devront ensuite choisir entre ...c5 et ...O-O."
   },
   {
    "san": "Qa4",
    "pourquoi": "Attaque tout de suite le pion faible c6, que rien ne défend. Les Noirs doivent le protéger (par ...Db6 ou ...Fb7), ce qui freine leur plan ...c5 et ...Fa6. La dame peut ensuite revenir pour laisser le roque."
   },
   {
    "san": "exf6",
    "pourquoi": "Supprime la tension au centre et évite toute surprise sur e5. En échange, le cavalier revient sur f6 avec un bon développement et la colonne f s'ouvre pour la tour noire : c'est jouable mais moins ambitieux."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Pousse un pion de l'aile roi sans but, alors que le roi est encore au centre. Les Noirs jouent ...a5 puis ...fxe5 et les Blancs n'ont plus de bon plan : le pion h4 affaiblit le roque et perd un temps précieux."
   },
   {
    "san": "a3",
    "pourquoi": "Coup d'attente inutile : rien ne menace b4. Les Noirs répondent ...fxe5 et après Cxe5 Cxe5 dxe5 le centre blanc est démoli, le pion e5 isolé et les Noirs ont la colonne f pour attaquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 51
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2 Bg7",
  "nom": "Défense française, variante d'avance, ligne 5...Db6 6.Fe2 Ch6 7.Fxh6 gxh6",
  "sens": "Met le fou au travail sur la grande diagonale : il vise e5 et d4, protège le pion h6 et prépare f6 pour ouvrir le jeu contre le centre blanc.",
  "menace": "Pas de menace immédiate ; les Noirs préparent cxd4 puis f6 pour attaquer e5 et profiter du fou g7.",
  "plan": [
   {
    "san": "Na3",
    "pourquoi": "Développe le cavalier sans bloquer la case c2 ni le fou. Il vise c2 d'où il défendra d4 et b4, ou pourra aller en b5 si c5 avance. Les Blancs gardent le centre solide avant de roquer."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. La position est fermée, rien ne presse ; les Blancs finiront leur développement (Ca3, Tfe1) et laisseront les Noirs se casser les dents sur d4 et e5."
   },
   {
    "san": "h4",
    "pourquoi": "Gagne de l'espace à l'aile roi et fixe les pions noirs doublés h6 et h7. Cela prépare éventuellement h5 pour empêcher le roi noir de se mettre bien, mais retarde un peu le roque blanc."
   }
  ],
  "erreurs": [
   {
    "san": "Qe3",
    "pourquoi": "Laisse b2 sans défense : après Dxb2, la dame noire prend un pion et attaque la tour a1. Les Blancs doivent roquer et perdent ensuite a1 ou a2. Une dame ne doit pas abandonner la défense de son camp."
   },
   {
    "san": "dxc5",
    "pourquoi": "Donne le centre pour rien : après Dxc5, la dame noire est bien placée sur la diagonale et le pion e5 reste isolé et faible. Le fou g7 et le cavalier c6 attaquent alors e5 librement. Il faut garder le pion d4 qui soutient e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 27
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3",
  "nom": "Variante Tarrasch, ligne 3...c5 4.exd5 Dxd5",
  "sens": "attaque le pion d4 une deuxième fois et libère la diagonale du fou c1. Il invite la dame noire à bouger pour frapper ensuite avec Fb5+ ou Cxd4.",
  "menace": "Cbxd4 : les Blancs récupèrent le pion avec un cavalier centralisé et un développement d'avance.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Défend d4 en développant une pièce. Si les Blancs prennent en d4, les Noirs reprennent et la position s'ouvre à égalité. Le cavalier c6 bouche aussi la diagonale a4-e8 : plus de Fb5+."
   },
   {
    "san": "a6",
    "pourquoi": "Retire la case b5 au fou blanc. Les Noirs acceptent de rendre le pion d4, mais la dame d6 pourra ensuite bouger sans craindre un échec. Coup calme qui prépare b5 et Fb7."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe et prépare le petit roque. Les Noirs rendent le pion d4 mais gagnent du temps : roi en sécurité, puis Cc6 et Fd7 pour jouer une partie solide."
   }
  ],
  "erreurs": [
   {
    "san": "Qb6",
    "pourquoi": "La dame quitte d6 pour protéger d4, mais après Cbxd4 elle est mal placée : De2 puis Fe3 la chassent encore, et les Blancs développent avec le gain de temps. Déplacer la dame une troisième fois perd le fil."
   },
   {
    "san": "h6",
    "pourquoi": "Coup inutile sur l'aile : les Blancs prennent d4 tranquillement avec Cbxd4, puis après Cc6 le cavalier saute en b5 et harcèle la dame. Les Noirs perdent le pion sans compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -13
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4 Ne7",
  "sens": "Sort le cavalier roi sans boucher la colonne f : il pourra aller en f5 ou en c6, et le petit roque devient possible. Rien n'est attaqué, mais les Noirs finissent leur développement.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe le cavalier roi vers sa meilleure case : il protège e5 (déjà soutenu par f4) et libère le petit roque. Les Noirs continuent avec Cbc6 ou 0-0, mais les Blancs n'ont rien perdu."
   },
   {
    "san": "c3",
    "pourquoi": "Ferme la diagonale a7-g1 pour que le fou b6 ne vise plus le roi, et prépare Fe3 sans se faire prendre le fou. Cela laisse aux Noirs le temps de jouer Cf5, mais la position reste solide."
   },
   {
    "san": "a3",
    "pourquoi": "Prépare b4 pour gagner de l'espace à l'aile dame et chasser le fou b6 plus tard. Coup lent : les Noirs jouent Cbc6 et 0-0 tranquillement, mais rien ne craque."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Semble naturel, mais le fou b6 prend en e3, la dame reprend, et la dame noire file en c2 avec gain du pion. Le fou b6 contrôle déjà cette diagonale : il faut jouer c3 d'abord."
   },
   {
    "san": "h4",
    "pourquoi": "Lance une attaque sans aucune pièce développée : le cavalier saute en f5, le pion h4 devient une cible après h5, et le roi blanc n'a plus d'abri. Le développement d'abord, les pions ensuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -19
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6",
  "nom": "Tarrasch, variante fermée (ligne 5.Fd3)",
  "sens": "attaque la tête de la chaîne de pions, le pion e5, pour ouvrir la colonne f et libérer le jeu noir",
  "menace": "...fxe5 suivi de dxe5 Cdxe5 : les Noirs gagnent le pion d4 et le centre blanc s'écroule, d'autant que le cavalier d2 bloque la défense de d4",
  "plan": [
   {
    "san": "exf6",
    "pourquoi": "le seul bon coup : les Blancs échangent avant que ...fxe5 ne détruise leur centre. Après ...Cxf6, le pion d4 reste isolé mais défendable (Cf3, O-O), et les Blancs gardent la case e5 pour un cavalier. Les Noirs obtiennent la colonne f et un jeu actif, mais le pion e6 devient faible."
   }
  ],
  "erreurs": [
   {
    "san": "Nf3",
    "pourquoi": "défendre e5 semble naturel, mais après ...fxe5 dxe5 Cdxe5 ! le pion d4 a disparu et le cavalier noir prend e5 : si Cxe5 Cxe5, les Noirs ont gagné un pion net au centre."
   },
   {
    "san": "O-O",
    "pourquoi": "roquer tranquillement ignore la menace : ...fxe5 et les Blancs ne peuvent plus reprendre dxe5 à cause de ...Cdxe5 qui gagne d4. Après ...Fe7, les Noirs ont un pion de plus au centre et la colonne f ouverte contre le roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 41
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O b6",
  "sens": "attaque la pointe de la chaîne blanche : le pion c5 est avancé, il doit être soutenu ou échangé sous peine de tomber.",
  "menace": "...bxc5 puis dxc5 Bxc5 : les Noirs gagnent le pion c5 car d4 ne peut plus le reprendre sans se faire capturer par le fou e7.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en protégeant d4. Ainsi, après ...bxc5 dxc5, le pion c5 est tenu par le fou et le fou e7 ne peut rien prendre. Les Noirs vont jouer ...c6 ou ...Nc6 pour attaquer la chaîne autrement."
   },
   {
    "san": "cxb6",
    "pourquoi": "Supprime le pion attaqué avant qu'il ne devienne une faiblesse. Les Noirs reprennent ...axb6 et obtiennent la colonne a et le contrôle de c5, mais le centre blanc reste solide avec d4 bien gardé."
   },
   {
    "san": "Qc2",
    "pourquoi": "Soutient c5 et vise h7 avec le fou d3. Si ...bxc5 dxc5 Bxc5, la dame reprend sur c5 et rien n'est perdu. Attention toutefois au clouage possible du cavalier f3 par ...Bg4."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "Coup de développement naturel mais qui ignore la menace. Après ...bxc5 dxc5 Bxc5, les Noirs ont simplement gagné un pion au centre : d4 a disparu et le fou e7 s'est installé sur la belle case c5."
   },
   {
    "san": "Ne5",
    "pourquoi": "Saut tentant vers une case centrale, mais le cavalier ne défend ni c5 ni d4. ...bxc5 dxc5 Bxc5 laisse les Blancs avec un pion de moins et un cavalier isolé en e5 qui pourra être chassé par ...Nbd7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 21
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5 Bxc5",
  "nom": "Défense française, variante d'avance, système 5...Fd7 6.Fe2 Cge7 avec dxc5",
  "sens": "Reprend le pion tout de suite et place le fou sur la diagonale a7-g1, braqué sur f2. Avec le cavalier f5 déjà posté, les Noirs ont deux pièces actives qui regardent le roi blanc.",
  "menace": "Pas de menace immédiate. Mais le fou c5 vise f2 : si les Blancs se laissent distraire, Fxf2+ ou ...Dh4 avec le cavalier f5 peuvent devenir dangereux.",
  "plan": [
   {
    "san": "b4",
    "pourquoi": "Chasse le fou c5 avec gain de temps : il doit reculer (b6 ou e7). Le pion b4 prépare aussi b5 pour repousser le cavalier c6, défenseur de e5. Les Blancs gagnent de l'espace à l'aile dame. Attention : b4 affaiblit c3 et c4, les Noirs pourront jouer ...a5 pour attaquer la chaîne."
   },
   {
    "san": "Bd3",
    "pourquoi": "Le fou e2 se replace sur une diagonale plus active, face au cavalier f5. Il prépare Fxf5 pour éliminer la pièce noire la plus gênante, celle qui vise d4 et h4. Laisse aux Noirs le temps de roquer et de jouer ...Dc7 ou ...Db6."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier vers b3 ou f3, d'où il contrôle d4 et peut chasser le fou (Cb3). Garde la position souple : les Blancs peuvent ensuite jouer b4 ou Fd3 selon ce que font les Noirs. Un coup calme et solide."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "Semble défendre e5, mais le fou devient une cible : après ...h6 puis ...g5, il doit fuir et les Noirs gagnent du temps en attaquant à l'aile roi. Le pion e5 reste de toute façon sous pression du cavalier c6 et de la dame."
   },
   {
    "san": "b3",
    "pourquoi": "Trop lent et affaiblit la case c3. Le cavalier f5 saute en h4 : il échange sur f3 ou vient en g6 attaquer e5. Les Blancs n'ont plus de bon défenseur pour ce pion. Si on veut jouer un coup de pion, c'est b4 avec gain de temps, pas b3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 43
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5 Bxc5",
  "nom": "Variante Steinitz, ligne classique 7.Fe3 Fe7 8.dxc5 Fxc5",
  "sens": "Reprend le pion en activant le fou : il quitte la case passive e7, vise le fou e3 et, derrière lui, la case g1 et le roi blanc. Les Noirs veulent échanger ce bon fou de cases noires ou forcer les Blancs à prendre une décision tout de suite.",
  "menace": "Fxe3 : prendre le bon fou blanc ; si les Blancs reprennent mal, la dame noire arrive en b6 avec attaque sur b2 et sur le roi resté au centre.",
  "plan": [
   {
    "san": "Qd2",
    "pourquoi": "Défend le fou e3 sans bouger le roi et prépare le grand roque. Après ...Fxe3 Dxe3, la dame reste bien placée et le pion b2 est protégé par le roque. Les Noirs vont souvent jouer ...Db6 ou ...a6, mais rien ne presse pour les Blancs."
   },
   {
    "san": "Bxc5",
    "pourquoi": "Échange tout de suite les fous : après ...Cxc5, les Blancs jouent Dd2, Fd3 puis roquent tranquillement. Le pion e5 reste solide et le cavalier noir c5 peut être chassé par b4 plus tard. Simple et sans risque."
   },
   {
    "san": "Nd4",
    "pourquoi": "Centralise le cavalier et bloque la colonne d. Si ...Fxd4 Fxd4, le fou blanc domine la grande diagonale ; si ...Cxd4 Fxd4 Fxd4 Dxd4, la dame est superbe au centre. Position égale mais claire."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Le fou recule et perd tout son effet : ...a6, ...Fa7 et les Noirs gardent leur bon fou pointé sur le roi tandis que le fou blanc d2 ne défend plus rien. Les Blancs ont perdu un temps pour rien."
   },
   {
    "san": "Kf2",
    "pourquoi": "Le roi vient défendre e3 lui-même : après ...Fxe3+ Rxe3 Db6+, le roi est exposé au centre, les Noirs arrivent avec échecs et les Blancs ne pourront plus roquer. Il ne faut jamais défendre une pièce avec le roi quand la dame peut le faire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O cxd4",
  "nom": "Défense française, variante Tarrasch, ligne fermée 3...Cf6",
  "sens": "Échange au centre pour fixer un nouveau point d'attaque : si les Blancs ne reprennent pas, le pion prend en c3 et la dame noire visera ensuite e5. Après la reprise, le pion d4 reste isolé face à la dame b6, au cavalier c6 et au cavalier d7.",
  "menace": "dxc3 gagne un pion ; après bxc3 Dc7 attaque aussi e5.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Seul bon coup : reprend le pion avant qu'il ne prenne en c3. Les Blancs gardent leur chaîne d4-e5 et conservent la case c3 pour le cavalier (Cb3-c3 n'est plus possible, mais Cb1-c3 via Cb3 non plus ; en pratique le cavalier d2 ira en b3 ou en f1). Les Noirs peuvent alors prendre en d4 : Cxd4 Cxd4 Dxd4, puis Cf3 Db6 Da4 et les Blancs ont une avance de développement contre un pion (gambit Kortchnoï). Plus simple pour les Noirs : f6 pour attaquer e5."
   }
  ],
  "erreurs": [
   {
    "san": "Re1",
    "pourquoi": "Coup naturel mais trop lent : dxc3 bxc3 Dc7 et les Noirs ont gagné un pion sain, tout en visant e5. La tour n'a rien fait."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Reprend avec la mauvaise pièce : Cxe5 ! Le cavalier d7 prend un pion défendu seulement par le cavalier f3, qui vient de partir. Puis Cxd3 ramasse le fou. Toujours reprendre d4 avec le pion c3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 49
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3 Nf5",
  "sens": "Le cavalier vient harceler le fou e3 et viser d4 : les Blancs doivent s'occuper de leur fou avant de poursuivre leur développement.",
  "menace": "...Cxe3 fxe3 abîme la structure blanche ; après ...c5 le pion d4 sera attaqué deux fois.",
  "plan": [
   {
    "san": "Qd3",
    "pourquoi": "Défend le fou e3 sans le faire reculer et attaque le cavalier f5, qui doit se justifier. La dame regarde aussi a6 et le roque est libre. Les Noirs prendront sans doute ...Cxe3 Dxe3 : la dame reste bien centrée et d4 est solide."
   },
   {
    "san": "Qd2",
    "pourquoi": "Même idée, plus modeste : couvre e3 et prépare O-O ou O-O-O. Après ...Cxe3 Dxe3 les Blancs n'ont rien perdu ; mais la dame sur d2 ne gêne pas le cavalier f5."
   },
   {
    "san": "Na4",
    "pourquoi": "Le cavalier vise la case c5 pour y empêcher ...c5 et bloquer le jeu noir. Si ...Cxe3 fxe3, la colonne f s'ouvre pour la tour. Attention : le cavalier a4 est un peu excentré."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Perd du temps pour rien : après ...c5 O-O cxd4 le fou e3 est pris en fourchette et le centre blanc s'écroule. Il fallait d'abord régler le problème du fou."
   },
   {
    "san": "Rc1",
    "pourquoi": "Développe une tour alors que le roi n'est pas roqué et que le fou e3 pend. Après ...c5 Ca4 fxe5 les Noirs ouvrent le centre et le roi blanc reste au milieu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 60
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2",
  "nom": "Défense française, variante Rubinstein (sous-variante 4...Cf6 5.Cxf6+ Dxf6)",
  "sens": "Prépare le grand roque : la dame quitte la colonne d pour qu'une tour vienne en d1, et le roi filera à gauche, loin de la dame et du fou noirs qui regardent h2. Depuis e2, elle surveille aussi e4 et e5, et peut sauter en e4 d'un seul coup si le roi noir se cache trop tôt en g8.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou qui ira en c6 : de là il contrôle la grande diagonale et chasse la dame si elle vient en e4. Cela prépare aussi Cc6 et le grand roque, comme les Blancs. Les Noirs gardent une position solide, sans faiblesse."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe le cavalier en attaquant d4 : les Blancs doivent déjà penser à leur centre (c3 ou Fe3). Le cavalier peut aller en b4 ou e7 ensuite. Attention : il bloque le pion c, donc plus de c5 pour attaquer d4."
   },
   {
    "san": "c5",
    "pourquoi": "Frappe tout de suite le pion d4 : si dxc5 Fxc5, le fou noir vise f2 et les Noirs ont des pièces actives. Les Blancs peuvent gagner un temps avec Fe3 ou c3, mais le centre blanc est contesté."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Trop tôt ! Après 9.De4 la dame vise h7 : si Td8, 10.Dh7+ Rf8 11.Dh8 mat, car le pion h6 bouche la fuite du roi et le fou d3 verrouille la diagonale. Il faut d'abord Fd7 ou Cc6, puis roquer quand e4 est contrôlé."
   },
   {
    "san": "Bf4",
    "pourquoi": "Le fou déjà développé va s'échanger contre un fou qui n'a pas encore bougé (9.O-O Fxc1 10.Taxc1) : les Noirs perdent deux temps et donnent aux Blancs une tour active en c1. Les cases noires autour du roi noir s'affaiblissent sans aucune contrepartie."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -70
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4 Qc7 O-O",
  "sens": "Met le roi à l'abri sur l'aile roi avant de perdre le pion e5, qui n'est plus défendable. La tour f1 pourra venir sur e1 pour viser la colonne e, où le roi noir est resté.",
  "plan": [
   {
    "san": "Nxe5",
    "pourquoi": "Gagne le pion e5 tout de suite. Après Cxe5 fxe5, la dame blanche doit fuir (Dg3 ou De4) et les Noirs ont un centre massif avec d4 et e5. Le roi noir est encore au centre : il faudra ensuite développer vite (Ch6, Fd7) et roquer long."
   },
   {
    "san": "Nh6",
    "pourquoi": "Développe le cavalier sans bloquer la colonne f : il surveille f5 et g4 et prépare le petit roque ou ...Cf7. Le pion e5 ne s'enfuit pas, on pourra le prendre au coup suivant."
   },
   {
    "san": "Bc5",
    "pourquoi": "Sort le fou avec un gain de temps possible et protège le pion d4. Il prépare le roque court et garde l'option de prendre e5 ensuite. Laisse aux Blancs un peu de temps pour Te1."
   }
  ],
  "erreurs": [
   {
    "san": "Bb4",
    "pourquoi": "Le fou donne un échec inutile qui est repoussé par a3 : les Noirs perdent un temps et le fou doit revenir. Pendant ce temps les Blancs jouent Te1 et le pion e5 devient défendable."
   },
   {
    "san": "Nge7",
    "pourquoi": "Bloque le fou f8 et la case e7 dont le roi a besoin. Les Blancs jouent Te1 et Dg3 : la colonne e s'ouvre contre le roi noir toujours au centre, et le gain du pion e5 n'est plus possible proprement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 122
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5",
  "nom": "Française classique, variante 7.f4 (ligne principale avec 8...c5)",
  "sens": "attaque la base de la chaîne blanche, le pion d4, pour desserrer le centre et activer le cavalier d7 puis le cavalier b8 via c6",
  "menace": "cxd4 suivi de Nc6 et Qb4 : la pression sur d4 et b2 force les Blancs à se décider tout de suite",
  "plan": [
   {
    "san": "Qd2",
    "pourquoi": "Défend d4 une seconde fois et prépare le grand roque. La dame reste derrière ses pions, le roi ira en c1 à l'abri, et la tour d1 soutiendra d4. Les Noirs continueront Nc6 et a6-b5, mais les Blancs gardent leur solide chaîne d4-e5 pour attaquer sur l'aile roi avec g4 ou f5."
   },
   {
    "san": "dxc5",
    "pourquoi": "Supprime la tension au centre : plus de pion d4 à attaquer. Après Nxc5 le cavalier noir est actif, mais les Blancs obtiennent la case d4 pour un cavalier (Nf3-d4) et peuvent jouer Bd3 et Qd2 tranquillement. Bon choix si l'on n'aime pas défendre d4."
   },
   {
    "san": "Nb5",
    "pourquoi": "Coup surprenant : le cavalier vise d6 et c7, et laisse c2-c3 pour renforcer d4. Les Noirs doivent réagir (Nc6 ou a6), ce qui leur coûte du temps. Attention : si le cavalier est chassé par a6, il doit avoir une bonne case de repli, ici d6 ou c3."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "Trop passif : le fou ne fait rien en e2 et d4 n'est pas protégé. Après Nc6, les Blancs doivent prendre dxc5, puis f6 ! casse la chaîne en e5 et le centre blanc s'écroule. Le fou aurait dû aller en d3, où il regarde h7."
   },
   {
    "san": "h4",
    "pourquoi": "Attaquer sur l'aile avant d'avoir sécurisé le centre. Après Nc6 le pion d4 tombe sous pression, les Blancs prennent dxc5, et f6 ouvre la colonne f contre le roi blanc encore au centre. Le pion h4 est inutile et le roi blanc en danger."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 58
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O Bd7 b4",
  "nom": "Variante d'avance, gambit de type Milner-Barry (6.a3 Ch6)",
  "sens": "Pousse les pions de l'aile dame pour chasser le cavalier c6 avec b5 et ôter la case c5 aux pièces noires. Les Blancs laissent le pion c3 en prise : ils veulent récupérer d4 ensuite et garder leur centre e5 avec de l'espace.",
  "menace": "b5 chasse le cavalier c6, et le fou c1 peut prendre en h6 pour casser les pions du roque noir.",
  "plan": [
   {
    "san": "Nf5",
    "pourquoi": "Sort le cavalier de h6 avant que le fou c1 ne le prenne. En f5, il appuie sur d4 et sur la case e3. Si le fou d3 le prend, les Noirs reprennent exf5 et ouvrent la colonne e."
   },
   {
    "san": "a6",
    "pourquoi": "Empêche b5 : le cavalier c6 reste bien placé, il tient d4 et e5. Les Noirs gardent leur pion d4 en plus pour le moment."
   },
   {
    "san": "Rc8",
    "pourquoi": "Met la tour sur la colonne c avant de prendre en c3. Après ...dxc3 Cxc3, la tour et la dame viseront le cavalier c3 et le pion c3 n'aura plus de défenseur facile."
   }
  ],
  "erreurs": [
   {
    "san": "dxc3",
    "pourquoi": "Prend le pion tout de suite, mais après Cxc3 le cavalier blanc attaque d5 et le fou c1 prend en h6 : les pions du roque noir sont doublés et le roi noir n'a plus d'abri."
   },
   {
    "san": "Ne7",
    "pourquoi": "Bouge le mauvais cavalier : Fxh6 gxh6 casse les pions du roi, puis cxd4 reprend le pion gratuitement. Les Noirs ont perdu leur avantage et leur roque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -30
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8",
  "nom": "Défense française, variante Winawer, ligne du pion empoisonné (variante Poisoned Pawn)",
  "sens": "Met la tour à l'abri de la dame en l'activant sur la colonne g : elle attaque maintenant g2 et peut gêner le roi blanc. La dame blanche est attaquée et doit se décider sans perdre de temps.",
  "menace": "Txg7 : la dame blanche est en prise. Si elle se retire mal, Tg8xg2 ou le pion c5 prend d4 avec une pression immédiate sur le centre.",
  "plan": [
   {
    "san": "Qxh7",
    "pourquoi": "Prend un deuxième pion et attaque la tour g8. C'est le seul bon coup : les Blancs encaissent deux pions nets en échange d'une dame éloignée sur h7 et d'un roi qui restera au centre. Après cxd4, Cbc6, Fd7 et 0-0-0, le roi noir file à l'aile dame et les Noirs ont du jeu, mais les pions passés blancs à l'aile roi (g et h) sont une vraie force à long terme. Il faut connaître cette suite et ne pas paniquer."
   }
  ],
  "erreurs": [
   {
    "san": "Qh6",
    "pourquoi": "Semble prudent, mais la dame reste sur la colonne h sans rien prendre. Les Noirs jouent cxd4 puis dxc3 et ravagent le centre blanc : les Blancs ont donné un pion pour rien au lieu d'en ramasser un deuxième."
   },
   {
    "san": "Qg3",
    "pourquoi": "Catastrophe : la dame est encore attaquée par la tour g8 et les Noirs jouent simplement Txg3. Un débutant oublie que la colonne g est désormais ouverte sur la dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 51
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2 f5",
  "sens": "Fixe le centre et coupe la grande diagonale du fou d3 : le pion f5 bloque la route vers h7 et interdit l'avance f4-f5 des Blancs. Les Noirs veulent ensuite Ce7, c5 et Fa6 pour jouer sur l'aile dame.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Enlève la case d4 aux pièces noires et ouvre la diagonale a2-g8 pour la dame. Cela prépare aussi un fou en e3 ou d2 sans crainte de ...d4. En contrepartie, les Blancs retardent un peu le roque."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le jeu. La tour f1 pourra soutenir f4 plus tard. Attention : le fou c1 n'est pas encore développé, il faudra s'en occuper vite."
   },
   {
    "san": "f4",
    "pourquoi": "Soutient solidement le pion e5, l'avant-poste principal des Blancs. Le pion f4 ne pourra pas aller plus loin, mais le centre est verrouillé et les Noirs devront chercher du jeu par c5 et Fa6. Le roi blanc doit ensuite roquer vite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5",
  "nom": "Défense française, variante Rubinstein",
  "sens": "Échange le pion central pour éviter que c5 ne fasse pression sur d4. Les Blancs gardent un développement rapide et le roque suivra.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Reprend le pion tout de suite en développant le fou sur une bonne diagonale. Les Noirs n'ont perdu aucun temps et pourront roquer ensuite. La position reste équilibrée."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Laisse le pion c5 aux Blancs : après De2, O-O et Fd2, ils gardent un pion de plus et un fou noir passif."
   },
   {
    "san": "Qc7",
    "pourquoi": "Semble attaquer c5, mais b4 défend le pion. Après b6, Fb5+ gêne les Noirs et le pion reste perdu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -20
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O",
  "nom": "Française Tarrasch, variante 3...c5 avec Fb5+",
  "sens": "Met le roi à l'abri et libère la tour f1 pour e1. Les Blancs attendent le développement noir pour ouvrir le centre avec dxc5 et attaquer le pion d5 isolé.",
  "menace": "Rien d'immédiat. L'idée est Te1 suivi de De2 pour contrôler la colonne e et gêner le petit roque noir.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou et prépare le roque tout de suite. Le roi noir doit quitter la colonne e avant que Te1 et De2 ne la contrôlent. Après ...O-O, les Noirs auront un pion d5 isolé mais des pièces actives."
   },
   {
    "san": "Rc8",
    "pourquoi": "Place la tour sur la colonne c pour soutenir c5 et préparer ...c4. Mais le roi reste au centre un coup de plus : c'est jouable, un peu moins précis que Fe7."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Ouvre le centre alors que le roi noir est encore en e8. Après De2 et Te1, la colonne e est clouée sur le roi : Fe7 ne peut plus roquer tranquillement et le pion d5 devient faible."
   },
   {
    "san": "Bd6",
    "pourquoi": "Semble actif, mais après Te1+ le fou doit revenir en e7 : perte de temps. Pendant ce temps De2 renforce le contrôle de la colonne e."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -6
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4 Bg4",
  "nom": "Variante d'échange, ligne 4.c4 (Variante Monte Carlo)",
  "sens": "cloue le cavalier f3 sur la dame pour fragiliser la défense du pion isolé d4, tout en développant une pièce avec gain de temps.",
  "menace": "Cxd4 après le clouage n'est pas encore une menace directe ; les Noirs menacent surtout de jouer ...Cc6 pour attaquer d4 une deuxième fois, le cavalier f3 étant cloué.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Défend d4 une seconde fois, sans dépendre du cavalier cloué. Prépare le roque tranquillement. Les Noirs continuent par ...Cc6 ou ...Cbd7, mais d4 tient."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri d'abord. Si ...Fxc3 bxc3, la dame protège aussi d4. Laisse aux Noirs la possibilité de doubler les pions c, mais la paire de fous et le centre compensent."
   },
   {
    "san": "Be2",
    "pourquoi": "Recule le fou pour casser le clouage : le cavalier f3 redevient libre et d4 est de nouveau défendu. Perd un temps, mais rend la position très solide."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "Développe mais oublie le clouage : après ...Fxf3 gxf3, le pion d4 n'est plus défendu par le cavalier et le roque blanc est abîmé. Puis ...Cc6 attaque d4 une deuxième fois."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6, mais ne défend pas d4. Après ...Te8+ le fou doit revenir en e3, et ...Fxf3 abîme les pions. Les Blancs ont perdu deux temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -13
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6 bxc6 O-O",
  "sens": "Met le roi à l'abri et connecte les tours avant que le centre ne s'ouvre. Maintient la tension sur e5 sans se presser : le pion est bien soutenu par d4 et le cavalier f3, et les Noirs doivent maintenant décider du sort de leur pion f6.",
  "plan": [
   {
    "san": "a5",
    "pourquoi": "Fixe l'aile dame : le pion a5 empêche le cavalier d2 de venir en b3 puis c5, case idéale pour lui. Il prépare aussi ...Fa6 pour activer le fou par la diagonale ouverte, et laisse la tension sur e5 aux Blancs, qui n'ont rien de pressé."
   },
   {
    "san": "fxe5",
    "pourquoi": "Ouvre la colonne f pour la tour après le petit roque. Après dxe5 Cxe5 Cxe5 le pion e5 est perdu pour les Blancs sauf s'ils reprennent, mais ils gardent un centre solide. Les Noirs obtiennent du jeu actif ; en échange, la case e5 reste faible et le roi noir devra roquer vite."
   },
   {
    "san": "f5",
    "pourquoi": "Ferme le centre : le pion f5 bloque la position et retire aux Blancs toute idée de exf6. Les Noirs jouent ensuite ...Fe7, ...O-O puis ...c5 pour attaquer d4. C'est plus calme, mais le fou c8 reste enfermé derrière e6 et f5."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "Coup naturel qui attaque d4, mais trop tôt : après Ch4 les Blancs visent f5 et g6, et Cdf3 renforce e5. Le roi noir est encore au centre, la case e6 devient faible et les Noirs manquent de temps pour terminer le développement."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe le fou, mais laisse les Blancs échanger exf6 gxf6 : la structure noire est ruinée (pions f6, e6, c6, c7, a6 isolés ou doublés) et Ch4 vise les cases f5 et g6 devant le roi, sans aucun pion pour les couvrir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -45
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2 Bg7 Na3",
  "sens": "Sort le cavalier sans gêner le fou ni boucher c2 : de a3 il ira en c2 pour soutenir d4 et b4, ou sautera en b5 si le pion c5 avance.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Les pions h doublés semblent fragiles, mais la colonne g ouverte et le fou en g7 donnent aux Noirs du jeu sur l'aile roi. Après Cc2, les Noirs pourront jouer f6 pour attaquer e5."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange sur d4 avant que le cavalier n'arrive en c2 pour le défendre. Après cxd4, la dame en b6 presse sur b2 et d4, et le fou g7 regarde aussi d4. Le centre blanc devient une cible."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou et prépare le grand roque ou Tc8. Il protège aussi c6 contre un futur Fb5, qui clouerait le cavalier."
   }
  ],
  "erreurs": [
   {
    "san": "Ne7",
    "pourquoi": "Retire le cavalier de la pression sur d4 et e5. Les Blancs répondent Fb5+ : le cavalier doit revenir en c6, puis Fxc6 abîme les pions noirs. Un coup qui recule et perd du temps."
   },
   {
    "san": "Nd8",
    "pourquoi": "Même idée, même punition : Fb5+ force Cc6, puis les Blancs roquent tranquillement. Les Noirs ont joué deux coups pour rien et le cavalier ne gêne plus d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -29
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 Dxd5",
  "sens": "Défend le pion d4 en développant une pièce. Le cavalier ferme aussi la diagonale a4-e8 : plus de Fb5+ gênant pour la dame.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Met la tour sur la colonne e, ouverte, avant de reprendre d4. Elle vise e6 et e7 : après Cbxd4 Cxd4 Cxd4, le roi noir est encore au centre et Dh5 ou Cb5 peut suivre. On laisse les Noirs décider du moment de ...Fe7 et ...O-O."
   },
   {
    "san": "Nbxd4",
    "pourquoi": "Reprend le pion tout de suite, avec le cavalier qui bloquait la colonne b. Après ...Cxd4 Cxd4, le centre est vide, les pièces blanches sont plus actives et la dame noire en d6 reste exposée à Cb5."
   },
   {
    "san": "a4",
    "pourquoi": "Prépare a5 pour chasser le cavalier b3 ... non : gagne de l'espace et prépare a5-a6 pour affaiblir b7 et c6 ; ouvre aussi une case à la tour en a3. Coup d'attente utile : d4 ne s'échappe pas, les Blancs le reprendront ensuite."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 16
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4 Ne7 Nf3",
  "sens": "Sort le dernier cavalier et prépare le petit roque : le cavalier ajoute un défenseur à e5 et surveille d4, la case que les Noirs aimeraient occuper.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le jeu. Les Noirs ont déjà un pion de plus et tout leur développement en main : rien ne presse. Ensuite viennent Nbc6, f6 ou d4 au bon moment, avec le roi en sécurité."
   },
   {
    "san": "Nbc6",
    "pourquoi": "Développe en attaquant e5 une deuxième fois : les Blancs doivent surveiller ce pion en permanence. Le cavalier vise aussi d4, la case centrale affaiblie par le départ du pion d. Attention : les Blancs peuvent répondre c3 pour la boucher."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou dame qui, sinon, reste enfermé derrière e6. Il prépare le grand roque ou Rc8 sur la colonne c, et laisse c6 libre pour le cavalier."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Attaquer e5 tout de suite semble logique, mais après exf6 gxf6 Nd4 les Noirs se retrouvent avec le roi découvert et le pion e6 fragile : le cavalier blanc s'installe au centre et la case e6 devient une cible. Il faut d'abord roquer."
   },
   {
    "san": "Nf5",
    "pourquoi": "Le cavalier a l'air actif, mais g4 le chasse aussitôt : il doit revenir en e7 et les Blancs ont gagné du temps et de l'espace, puis Nd4 s'installe au centre. Un coup qui recule en pratique."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O b6 Be3",
  "nom": "Variante d'échange, 4.Cf3 Fd6 5.c4",
  "sens": "développe le fou tout en défendant d4 : si les Noirs prennent en c5, le pion d4 reprend et le fou le soutient. Les Blancs peuvent ensuite jouer Cc3 et Te1 pour pousser leur avantage d'espace sur l'aile dame",
  "plan": [
   {
    "san": "bxc5",
    "pourquoi": "ouvre la colonne b pour la tour. Après dxc5, le pion d4 a disparu : le centre blanc est moins solide et la case d4 devient disponible pour un cavalier noir (…Cc6 puis …Ce4 ou …Cb4). Le pion c5 est tenu par le fou, mais il reste une cible pour …Cbd7 et …Fa6."
   },
   {
    "san": "Ng4",
    "pourquoi": "attaque le fou e3, le défenseur de d4 et c5. Si le fou recule en f4 ou d2, …Ff6 revient presser d4. Si les Blancs laissent prendre (…Cxe3 fxe3), leurs pions sont doublés et le roi un peu plus exposé."
   },
   {
    "san": "c6",
    "pourquoi": "renforce d5 et empêche cxb6 d'abîmer la structure. Prépare …Fa6 pour échanger le bon fou d3 des Blancs, puis …Cbd7 et …bxc5 au bon moment. Les Blancs gardent l'espace, mais n'ont pas de cible."
   }
  ],
  "erreurs": [
   {
    "san": "a5",
    "pourquoi": "veut fixer l'aile dame, mais laisse les Blancs jouer cxb6. Après …cxb6, les pions a5, b6 et d5 sont isolés et faibles, et Te1 vient presser la colonne e. Les Noirs ont trois faiblesses à défendre sans contre-jeu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -21
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5 Bxc5 b4",
  "nom": "Défense française, variante d'avance, 5...Fd7 6.Fe2 Cge7",
  "sens": "Attaque le fou c5 avec le pion pour gagner un temps : le fou doit reculer et les Blancs gagnent de l'espace à l'aile dame. Le pion prépare aussi b5 pour chasser le cavalier c6, défenseur de e5.",
  "menace": "bxc5 gagne le fou. Ensuite b5 chasse le cavalier c6 et le pion e5 respire.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Recule mais reste actif : le fou vise toujours f2 sur la diagonale a7-g1. Il garde l'œil sur d4 et soutient un futur ...d4 pour casser le centre. Les Noirs pourront jouer ...a5 contre la chaîne b4-c3."
   },
   {
    "san": "Be7",
    "pourquoi": "Retraite solide : le fou couvre d6 et la case g5, et le roque devient possible tout de suite. Plus passif que Fb6 : le fou ne vise plus f2."
   },
   {
    "san": "Bf8",
    "pourquoi": "Garde le fou en réserve derrière ses pions : il n'est plus une cible et pourra ressortir en d6 ou e7. Mais il retarde le roque, les Blancs gagnent du temps pour a3 et Fb2."
   }
  ],
  "erreurs": [
   {
    "san": "Nxb4",
    "pourquoi": "Le cavalier prend un pion défendu : cxb4 Fxb4 Fd3 et les Noirs ont donné un cavalier contre deux pions. Le fou b4 reste en l'air, le cavalier f5 est attaqué."
   },
   {
    "san": "f6",
    "pourquoi": "Oublie que le fou c5 est attaqué : bxc5 gagne une pièce. Après fxe5 Ca3, les Blancs ont un fou de plus et le centre noir est troué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -29
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6",
  "nom": "Variante Tarrasch, ligne fermée (3...Cf6)",
  "sens": "Échange le pion e5 avant qu'il ne soit pris : les Blancs évitent que ...fxe5 dxe5 n'ouvre la colonne f sur leur roi tout en leur laissant un pion d4 isolé et attaqué. Le pion f6 doit maintenant être repris, sinon il avance.",
  "menace": "fxg7 gagne un pion et ruine le roque noir ; ou f7+ qui déplace le roi noir et lui interdit le roque.",
  "plan": [
   {
    "san": "Nxf6",
    "pourquoi": "Le seul coup. Il reprend le pion avec développement : le cavalier contrôle e4 et surveille g4 et h5. Les Noirs obtiennent la colonne f semi-ouverte pour leur tour après O-O, et le pion d4 isolé devient une cible (Fd6, Dc7, Cb4 ou Cxd4 plus tard). En échange, le pion e6 est un peu faible et les Blancs gardent la case e5 pour un cavalier (Cf3-e5)."
   }
  ],
  "erreurs": [
   {
    "san": "gxf6",
    "pourquoi": "Reprendre du pion ouvre toute l'aile roi : la colonne g et la case h5 n'ont plus de défenseur, et le pion e6 reste en l'air. Après O-O puis Cf3, les Blancs attaquent un roi noir qui n'a plus d'abri sûr."
   },
   {
    "san": "e5",
    "pourquoi": "Ignorer le pion f6 est une faute : f7+ force Rxf7 et le roi noir perd le droit au roque. Il reste au milieu, exposé sur la colonne f et la diagonale, pendant que les Blancs roquent tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -28
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5 Bxc5 Qd2",
  "nom": "Variante Steinitz, attaque Boleslavsky",
  "sens": "Protège le fou e3 avec la dame pour ne pas avoir à bouger le roi : après ...Fxe3 Dxe3, la dame reste active sur e3. Prépare aussi le grand roque, qui mettra le roi en sécurité et une tour sur d1.",
  "plan": [
   {
    "san": "Qb6",
    "pourquoi": "La dame vise b2 et appuie le fou c5 sur la diagonale vers e3. Les Blancs ne peuvent plus roquer tranquillement à la main gauche sans défendre b2 : cela leur impose un coup de plus. Les Noirs gardent la pression sur d4 et sur les cases noires."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'ouvrir le jeu. Ensuite ...f6 attaque le pion e5, point fort des Blancs. On laisse le choix aux Blancs d'échanger en e3 ou non, sans se presser."
   },
   {
    "san": "Bxe3",
    "pourquoi": "Échange le fou de cases noires contre son homologue, ce qui enlève une pièce d'attaque aux Blancs. Après Dxe3, on joue ...Db6 ou ...Da5 pour harceler la dame et le pion b2."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Ramener le fou en e7 perd un temps : le fou était bien placé en c5, en face du fou e3. Après O-O-O, les Blancs ont fini leur développement et le pion e5 reste solide ; les Noirs n'ont plus rien à attaquer."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame bloque son propre fou e7... non, ici elle laisse le fou c5 sans soutien : après O-O-O O-O Fxc5 Dxc5, les Noirs ont échangé le fou qui tenait les cases noires et ont perdu plusieurs temps avec la dame. Les Blancs attaquent ensuite sur l'aile roi avec g4 et f5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -30
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3 Nf5 Qd3",
  "sens": "défend le fou e3 sans le reculer et attaque le cavalier f5 : la dame garde aussi un œil sur le pion a6 et libère la case d1 pour roquer vite, sans doute du côté dame.",
  "menace": "Dxa6 ou g2-g4 pour chasser le cavalier f5, qui n'a pas de bonne case de repli.",
  "plan": [
   {
    "san": "a5",
    "pourquoi": "sauve le pion a6 tout de suite et le sort de la portée de la dame. Il prépare aussi ...Fa6 : le fou de cases blanches viendra regarder la dame d3 et gêner le roque long. Le cavalier f5 reste en place, car Fe3 et f5 se surveillent mutuellement."
   },
   {
    "san": "Be7",
    "pourquoi": "développe le fou et prépare le petit roque. Si les Blancs jouent g4, le cavalier revient en h4 ou en d6 après ...fxe5. Les Noirs cèdent le pion a6 un instant mais obtiennent du développement en échange."
   },
   {
    "san": "fxe5",
    "pourquoi": "ouvre la colonne f pour la tour et attaque e5 une fois de plus. Après Cxe5, la dame d8 a le choix entre d6 et f6 : le centre blanc perd son pion le plus gênant. Le pion a6 reste en prise mais les Blancs n'ont pas le temps de le prendre."
   }
  ],
  "erreurs": [
   {
    "san": "Nxe3",
    "pourquoi": "échange le bon cavalier contre un fou passif. Après Dxe3, la dame blanche trône au centre, d4 est solide et les Blancs roquent long avec une attaque facile sur l'aile roi. Le cavalier f5 valait plus que le fou e3 : il fallait le garder."
   },
   {
    "san": "c5",
    "pourquoi": "semble logique pour miner d4, mais dxc5 détruit la chaîne de pions noire : c6 devient faible, le fou e7 ne peut plus prendre en c5 à cause de Dxd5. Après Fe7 et 0-0-0, les Blancs ont un pion de plus et le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -72
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2 Bd7",
  "nom": "Variante Rubinstein",
  "sens": "sort le fou pour le placer en c6, sur la grande diagonale, d'où il surveillera e4 et appuiera le grand roque après Cc6.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie la tour à e1. Les Blancs ont un pion de plus au centre (d4) et plus d'espace : une fois roqués, ils jouent Ce5 ou c4 pour l'exploiter. Pas de précipitation, la position ne réclame rien d'urgent."
   },
   {
    "san": "Ne5",
    "pourquoi": "Centralise le cavalier et attaque le fou d7. Si les Noirs le prennent par Fxe5, dxe5 gagne du temps en chassant la dame f6 et le pion e5 bloque le centre noir. Le cavalier en e5 gêne aussi Cc6 et le roque long adverse."
   },
   {
    "san": "Bd2",
    "pourquoi": "Développe la dernière pièce mineure et prépare le grand roque pour amener vite la tour sur d1, face au pion d4 qui pousse. Laisse aux Noirs le temps de jouer Fc6 et Cd7, mais la position reste tranquille."
   }
  ],
  "erreurs": [
   {
    "san": "c3",
    "pourquoi": "Coup prophylactique inutile : rien n'attaque d4. Après Fc6 puis Fe4 Fxe4, les Blancs ont échangé leur bon fou et perdu un temps au lieu de roquer ou de centraliser le cavalier."
   },
   {
    "san": "Qe3",
    "pourquoi": "Déplace la dame sans but : elle ne menace rien et gêne le fou c1. Les Noirs jouent Fc6, puis roquent tranquillement pendant que les Blancs ont dépensé un coup pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 69
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5 Qd2",
  "nom": "Variante classique, 7.f4 (ligne de la Dame en d2)",
  "sens": "Renforce d4 une deuxième fois et libère la case e1 pour le grand roque : le roi ira s'abriter en c1 et la tour d1 soutiendra la chaîne d4-e5.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Attaque d4 une troisième fois et développe la pièce la plus utile. Si les Blancs prennent en c5, la dame reprend avec gain de temps. Prépare aussi a6 et b5 pour attaquer le roi blanc qui ira à gauche."
   },
   {
    "san": "a6",
    "pourquoi": "Empêche Cb5 (qui viserait d6 et c7) et prépare b5-b4 pour chasser le cavalier c3, défenseur de d5. C'est le début de l'attaque sur l'aile dame."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite la base de la chaîne en e5. Après exf6 la dame ou le cavalier reprend et le pion e6 pourra avancer. Attention : cela ouvre un peu la diagonale vers le roi noir, il faut donc rester précis."
   }
  ],
  "erreurs": [
   {
    "san": "b6",
    "pourquoi": "Laisse la case b5 sans défense : après Cb5 ! le cavalier saute en d6, cloue le jeu noir et ne peut plus être chassé. Jouer a6 avant b5 ou b6."
   },
   {
    "san": "Nb6",
    "pourquoi": "Le cavalier abandonne la défense du roi et de f6, et b5 n'est plus couvert. Après O-O-O et Cb5 les Blancs menacent Cd6 et le cavalier b6 ne sert à rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -26
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O Bd7 b4 Nf5",
  "nom": "Variation d'avance, ligne 6.a3 Ch6 7.Fd3 cxd4 8.O-O",
  "sens": "Met le cavalier à l'abri du fou c1 et le place sur une case active : il pèse sur d4 et surveille e3. Si le fou d3 le prend, la reprise exf5 ouvre la colonne e pour les Noirs.",
  "menace": "Rien d'immédiat : les Noirs veulent jouer ...dxc3 puis ...Fe7 et roquer, en gardant leur pion de plus sur d4.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Pose la tour derrière le pion e5 pour le soutenir, et libère f1 pour le fou si besoin. Les Blancs ne reprennent pas tout de suite en d4 : ils développent d'abord et comptent sur l'espace donné par e5. Ils laissent les Noirs prendre en c3, mais la reprise Cxc3 ouvrira la position."
   },
   {
    "san": "Bxf5",
    "pourquoi": "Supprime le cavalier qui pressait d4 avant qu'il ne gêne davantage. Après exf5, le pion noir f5 bloque le fou d7 et la case d4 se reprend tranquillement par cxd4. Les Blancs cèdent la paire de fous et la colonne e, mais gardent un centre solide."
   },
   {
    "san": "h4",
    "pourquoi": "Gagne de l'espace à l'aile roi et prépare g4 pour chasser le cavalier f5 sans l'échanger. Le pion h4 affaiblit un peu le roi blanc, donc il faut d'abord être sûr que les Noirs ne prennent pas l'initiative au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 40
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2 f5 c3",
  "sens": "Verrouille le centre : le pion c3 contrôle d4 et empêche ...d4, pour pouvoir sortir le fou en e3 ou d2 sans être chassé. Le roque est remis à plus tard.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Libère la case c6 et ouvre la diagonale a8-h1 : le fou c8 pourra aller en b7 ou en a6 pour s'échanger contre le fou d3. Le pion c5 contrôle aussi d4. En échange, le pion d5 est un peu moins soutenu."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier vers g6, d'où il attaquera le pion e5. Il ne gêne pas le pion f5 et prépare le roque. Les Blancs peuvent roquer tranquillement."
   },
   {
    "san": "Rb8",
    "pourquoi": "Met la tour sur la colonne b, à moitié ouverte depuis 6...bxc6 : elle vise le pion b2 et gêne le fou blanc qui voulait aller en e3 ou d2. Mais les pièces mineures attendent encore."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou vient sur une case que les Blancs chassent aussitôt par 10.b4 : il recule en b6 et les Blancs ont gagné un temps et de l'espace à l'aile dame, puis développent Cd2 et roquent."
   },
   {
    "san": "Be7",
    "pourquoi": "Le fou est passif derrière les pions e6-d5 et prend la case e7 au cavalier, qui n'a plus de bon chemin vers g6. Après 10.O-O et Te1, les Blancs sont développés et les Noirs restent à l'étroit."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 9
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O cxd4 cxd4",
  "nom": "Tarrasch, gambit Kortchnoï (9.cxd4)",
  "sens": "reprend le pion pour garder la chaîne d4-e5 intacte et offre d4 : si les Noirs le prennent, les Blancs gagnent des temps de développement contre la dame noire.",
  "menace": "Cb3 : le cavalier défend d4 et bouche la colonne b devant la dame noire, qui perd sa pression sur d4 et b2.",
  "plan": [
   {
    "san": "a5",
    "pourquoi": "Chasse le cavalier avant qu'il n'arrive : après Cb3, a4 le fait partir et d4 reste faible. Le pion a5 gagne de l'espace à l'aile dame et garde la dame b6 active sur b2 et d4. C'est le coup le plus solide, sans risque."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Gagne un pion : Cxd4 Dxd4, puis Cf3 Db6 et Da4. Les Blancs ont un pion de moins mais toutes leurs pièces sortent avec gain de temps contre la dame. Jouable, mais il faut ensuite se défendre précisément : réservé à ceux qui aiment garder le matériel."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Semble logique pour attaquer e5, mais après Cb3 puis Fe3, d4 est solidement défendu et la case e6 devient faible : si exf6 Cxf6, le pion e6 est isolé et le roi noir s'expose sur la diagonale h5-e8. Avant f6, il faut d'abord régler le problème du cavalier b3 (a5)."
   },
   {
    "san": "Be7",
    "pourquoi": "Coup de développement tranquille, mais il laisse Cb3 puis a4 : le cavalier verrouille d4, la dame b6 ne menace plus rien et a5 est bloqué. Les Noirs ont laissé passer l'occasion de prendre d4 ou de jouer a5 : ils restent cramponnés sans contre-jeu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -33
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4 Qc7 O-O Nxe5",
  "sens": "prend le pion e5 avec le cavalier pour détruire la chaîne blanche et ouvrir le centre : le cavalier attaque aussi le fou d3 et le cavalier f3.",
  "menace": "Cxd3 ou Cxf3+ : gagner une pièce, le fou d3 et le cavalier f3 sont tous deux en prise.",
  "plan": [
   {
    "san": "Nxe5",
    "pourquoi": "Seul coup correct : reprend tout de suite pour ne pas perdre de matériel. Après fxe5, le pion attaque la dame qui doit reculer (Dg3 ou De4). Les Noirs gardent un pion de plus et un gros centre d4-e5, mais leur roi est encore au milieu : les Blancs doivent ouvrir des lignes vite."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Reprend le mauvais pion. Après Db6, la dame noire attaque le cavalier d4 et le pion b2 en même temps ; le fou d3 reste en prise sur e5. Les Blancs lâchent trop de matériel d'un coup."
   },
   {
    "san": "Bg6+",
    "pourquoi": "Un échec inutile : le roi va simplement en d8 et il y est en sécurité. Ensuite Cxe5 Dxe5 et les Noirs ont un pion de plus, un centre solide, et la dame blanche est attaquée en f4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -125
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7",
  "nom": "Winawer, variante du pion empoisonné",
  "sens": "Ramasse un deuxième pion (h7) et attaque la tour g8 : la dame blanche a dévoré l'aile roi, mais elle est loin du centre et le roi blanc n'est pas encore à l'abri.",
  "menace": "Dxg8+ si la tour n'est pas défendue ou ne bouge pas ; à plus long terme, les pions g et h deviendront des passés très dangereux.",
  "plan": [
   {
    "san": "cxd4",
    "pourquoi": "Ouvre tout de suite la colonne c vers le roi blanc et casse le centre : après cxd4, le pion e5 devient une cible et c2 est faible. La tour g8 est déjà défendue par le cavalier e7, donc pas d'urgence : on crée d'abord ses propres menaces. Ensuite Cbc6, Fd7 et 0-0-0, le roi va se cacher à l'aile dame."
   }
  ],
  "erreurs": [
   {
    "san": "Nbc6",
    "pourquoi": "Naturel, mais ça laisse les Blancs jouer Ff4 pour consolider e5 avant que la colonne c ne s'ouvre. Il faut d'abord cxd4 : l'ordre des coups compte, sinon le centre blanc tient et les deux pions en plus commencent à peser."
   },
   {
    "san": "Bd7",
    "pourquoi": "Trop lent : les Blancs ramènent la dame par Dd3, puis h4 pousse déjà le pion passé. Les Noirs n'ont pas ouvert la colonne c ni attaqué le centre, et se retrouvent simplement avec deux pions de moins."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -71
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6 bxc6 O-O a5",
  "nom": "Défense française, variante Tarrasch (ligne Guimard avec ...Cc6)",
  "sens": "Fixe l'aile dame : le pion en a5 interdit b4 et empêche le cavalier d2 de passer par b3 pour atteindre c5. Il prépare ...Fa6 pour donner de l'air au fou sur la diagonale a6-f1, et laisse aux Blancs le soin de décider quoi faire du pion e5.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Soutient le pion e5, le point clé du centre. Si les Noirs jouent ...fxe5, le cavalier reprend en e5 avec le soutien de la tour. Les Blancs gardent ainsi leur avant-poste et le roi noir reste sans abri en e8."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il enlève la case g4 au cavalier et au fou noirs, et prépare Fe3 ou Cf1-g3 sans craindre d'ennuis. Les Blancs attendent que les Noirs se dévoilent, car rien ne presse."
   },
   {
    "san": "exf6",
    "pourquoi": "Simplifie le centre : après ...Cxf6 ou ...Dxf6, la case e5 devient libre pour le cavalier blanc, et la colonne e peut s'ouvrir contre le roi noir toujours au centre. Mais cela rend aussi au fou c8 et au cavalier d7 un peu d'activité."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Le coup ne défend rien d'utile et laisse e5 fragile. Les Noirs répondent ...fxe5, puis après Cxe5 Cxe5 le pion e5, pilier de la position blanche, disparaît et le centre noir s'ouvre librement."
   },
   {
    "san": "Nb1",
    "pourquoi": "Un recul qui perd un temps précieux. Les Noirs jouent ...fxe5 et après dxe5 ils activent la tour par ...Ta6 : l'aile dame des Blancs est vide et leur cavalier revient à sa case de départ sans avoir rien fait."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 36
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5",
  "nom": "Défense française, variante Rubinstein",
  "sens": "Reprend le pion sans perdre de temps : le fou prend une diagonale active vers f2 et les Noirs peuvent roquer au coup suivant.",
  "plan": [
   {
    "san": "Bf4",
    "pourquoi": "Développe le fou avant de roquer et contrôle la diagonale b8-h2. Il empêche le fou noir de se poser en d6 et prépare Qe2 puis O-O-O ou O-O selon la réaction. Les Noirs répondront sûrement par O-O et Qc7 ou b6."
   },
   {
    "san": "Qe2",
    "pourquoi": "Prépare le grand roque et pousse la dame sur la colonne e, face au roi noir encore au centre. Elle laisse la case d1 à la tour. Les Noirs doivent roquer vite pour ne pas subir une attaque sur e6."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité tout de suite. Simple et solide pour un débutant, mais cela laisse aux Noirs le temps de roquer aussi et d'égaliser avec b6 et Bb7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 29
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O Be7",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec Fb5+",
  "sens": "Développe le fou pour roquer dès le coup suivant : le roi noir quitte la colonne e avant que Te1 et De2 ne la prennent en enfilade. Le pion d5 restera isolé, mais les pièces noires seront actives.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Prend le pion maintenant que les Noirs ont joué Fe7 : après ...Cxc5, le pion d5 est isolé et devient une cible pour Cb3, Fe3 et les tours. Les Blancs obtiennent une petite initiative durable."
   },
   {
    "san": "Re1",
    "pourquoi": "Occupe la colonne e ouverte juste avant que le roi noir ne parte. Après ...O-O, la tour vise e7 et soutient un futur Ce5. Simple et utile dans toutes les variantes."
   },
   {
    "san": "c3",
    "pourquoi": "Renforce d4 avant de décider sur c5 : les Blancs évitent toute tension prématurée et préparent Cb3 ou Db3 pour attaquer d5. Les Noirs peuvent roquer tranquillement, la position reste équilibrée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 12
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4 Bg4 Be3",
  "nom": "Variante d'échange, 4.c4 (gambit de la Dame contre-attaqué)",
  "sens": "Les Blancs ont renforcé d4 avec le fou et peuvent roquer : la position est ouverte, symétrique, et il faut finir de développer sans céder de tempo.",
  "plan": [
   {
    "san": "Nbd7",
    "pourquoi": "Développe le cavalier sans bloquer le pion c : il pourra aller en b6 chasser le fou de c4, ou en f8 défendre le roi. Il laisse e4 libre pour l'autre cavalier plus tard."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 une troisième fois : avec le fou de g4 clouant le cavalier f3, le pion d4 reste sous pression. Attention : le cavalier bloque le pion c, qui ne jouera plus ...c5."
   },
   {
    "san": "Bh5",
    "pourquoi": "Coup d'attente utile : le fou recule hors de portée de h3, garde le clouage sur f3 et pourra se replier en g6 face à la dame. Les Noirs attendent de voir où les Blancs roquent avant de choisir le plan."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2 Bg7 Na3 O-O",
  "nom": "Variante d'avance, 5...Db6 6.Fe2 Ch6 (ligne Fxh6)",
  "sens": "Le roi quitte le centre et se cache derrière le fou g7 : les pions h doublés ne gênent pas tant que la colonne g reste aux Noirs. Les Noirs préparent f6 pour frapper e5, la base de la chaîne blanche.",
  "menace": "Pas de menace immédiate ; les Noirs visent cxd4 suivi de Cxe5 ou f6 pour démolir e5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met aussi le roi à l'abri avant que le centre ne s'ouvre. Les Blancs pourront ensuite jouer Cc2 et Tad1 pour tenir d4 et e5. Les Noirs pousseront f6, mais le roi blanc n'est plus sur la colonne e."
   },
   {
    "san": "Nc2",
    "pourquoi": "Ramène le cavalier mal placé vers d4 : il protège le pion d4 et laisse la dame d2 libre. Cela répond au plan noir cxd4 et Cxe5. En échange, les Noirs gagnent un temps pour f6."
   },
   {
    "san": "h4",
    "pourquoi": "Fixe les pions h noirs et prépare h5 pour clouer l'aile roi. C'est un coup de combat : les Blancs acceptent de retarder le roque pour empêcher les Noirs de respirer sur l'aile roi."
   }
  ],
  "erreurs": [
   {
    "san": "dxc5",
    "pourquoi": "Abandonne le centre. Après Dxc5 et Cc2, les Noirs jouent Cxe5 : le pion e5 tombe car plus rien ne le défend. Les Blancs perdent un pion et toute leur chaîne."
   },
   {
    "san": "Bb5",
    "pourquoi": "Attaque le cavalier c6 mais oublie d4. Après cxd4 cxd4 f6, le centre blanc s'écroule : e5 est attaqué, d4 est isolé et le fou b5 ne sert à rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 38
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6 Re1",
  "nom": "Variante Tarrasch, ligne ouverte 3...c5",
  "sens": "Place la tour sur la colonne e ouverte avant de reprendre le pion d4. Elle fixe le pion e6 et la case e7 : tant que le roi noir reste au centre, chaque pièce blanche qui arrive sur e5, b5 ou h5 pèse plus lourd.",
  "menace": "Pas de menace immédiate, mais Cbxd4 arrive : après Cbxd4 Cxd4 Cxd4, la dame blanche ou le cavalier (Dh5, Cb5) viennent harceler un roi encore au centre.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe, bouche la colonne e et prépare le petit roque dès le coup suivant. Le roi quitte le centre avant que les Blancs ne reprennent d4 et ne lancent leurs pièces. On laisse d4 : ce pion tombera de toute façon, mieux vaut un roi en sécurité."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou de dame et protège le cavalier c6, ce qui désamorce les sauts Cb5 et les attaques sur c6. Il prépare aussi ...Tc8 ou ...Td8 selon les cas. Le roque viendra un coup plus tard."
   },
   {
    "san": "a6",
    "pourquoi": "Interdit la case b5 au cavalier et au fou blancs. Petit coup, mais il enlève une des deux idées blanches avant même qu'elle n'existe. Il faut ensuite roquer vite car on a dépensé un temps."
   }
  ],
  "erreurs": [
   {
    "san": "Qc7",
    "pourquoi": "La dame recule sur une case passive et abandonne la défense du pion d4. Les Blancs jouent Cbxd4, et après Cxd4 Dxd4 ils ont récupéré le pion avec une dame centralisée face à un roi noir toujours au centre. Garder d4 un coup de plus ne valait pas ce retard."
   },
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier saute en avant sans but : il ne menace rien de concret. h3 le chasse, il revient en f6 et les Blancs reprennent d4 avec Cbxd4 en ayant gagné un temps net. Deux coups de cavalier pour rien pendant que les Blancs se renforcent."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -10
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4 Ne7 Nf3 O-O",
  "sens": "Met le roi à l'abri avant d'ouvrir le jeu. Les Noirs ont déjà un pion de plus et tout leur développement en main : rien ne presse. Ensuite viennent Nbc6, f6 ou d4 au bon moment, avec le roi en sécurité.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe la dernière pièce mineure et propose l'échange du fou b6, la meilleure pièce noire, qui cloue presque le roi blanc sur la diagonale a7-g1. Après ...Bxe3 Qxe3, les Blancs peuvent enfin roquer et le pion e5 reste solide."
   },
   {
    "san": "Nbd4",
    "pourquoi": "Centralise le cavalier et bouche la diagonale du fou b6 : le roi e1 respire. Le cavalier vise b5 et e6 et protège c2 contre la dame c7. Les Noirs répondront ...Nbc6 pour l'échanger, mais le Blanc gagne du temps pour se développer."
   },
   {
    "san": "c3",
    "pourquoi": "Donne au cavalier b3 la case d4 et à la dame la case c2 si besoin. Le pion c3 ferme aussi la colonne c où la dame noire regarde. Coup calme qui prépare Be3 et le roque."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Le fou coupe la ligne e2-c2 : la dame blanche ne défend plus le pion c2. ...Qxc2 prend un pion gratuit, et si Bb4 pour piéger la dame, ...Qxe2 échange et les Noirs ont deux pions de plus."
   },
   {
    "san": "h4",
    "pourquoi": "Attaque à l'aile alors que le roi blanc n'a pas roqué et que le fou c1 dort. Les Noirs ouvrent le centre avec ...f6 : le pion e5 tombe ou la colonne f s'ouvre contre e1, et h4 devient un pion isolé qui ne sert à rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 13
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5 Bxc5 b4 Bb6",
  "nom": "Variante d'avance, système Cge7-Cf5",
  "sens": "Recule devant b4 sans perdre le fil : depuis b6, le fou garde la diagonale vers f2 et surveille d4. Il prépare ...d4 pour ouvrir le centre et ...a5 pour attaquer la chaîne de pions b4-c3.",
  "menace": "Pas de menace immédiate. Mais ...d4 arrive : si les Blancs laissent d4 sans contrôle, le pion vient frapper c3 et libère le fou b6 vers f2.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Chasse le cavalier f5 qui gêne le roque blanc. Si ...Ch4, Cxh4 Dxh4 ne gagne rien aux Noirs car la dame revient vite. Le fou vise aussi h7 pour plus tard. Les Noirs répondront ...Dc7 pour appuyer sur e5."
   },
   {
    "san": "a4",
    "pourquoi": "Prend d'avance le combat sur l'aile dame : si ...a5, alors b5 chasse le cavalier c6 qui défend e5 et d4. Les Blancs gagnent de l'espace tranquillement."
   },
   {
    "san": "Re1",
    "pourquoi": "Soutient le pion e5, point fort de toute la variante d'avance. La tour quitte f1 et libère la case pour le fou si besoin. Les Noirs auront le temps de jouer ...O-O ou ...d4."
   }
  ],
  "erreurs": [
   {
    "san": "Na3",
    "pourquoi": "Cavalier sur le bord, sans utilité. Les Noirs jouent ...Ch4 : après Cxh4 Dxh4, la dame noire est très active sur l'aile roi et le fou b6 surveille f2. Les Blancs ont perdu le contrôle de leur aile roi pour rien."
   },
   {
    "san": "Bg5",
    "pourquoi": "Semble actif, mais ...f6 ! Le fou doit bouger et e5 tombe : après exf6 gxf6, les Noirs ont le centre et la colonne g ouverte vers le roi blanc. Le fou n'a rien de solide à attaquer sur g5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 32
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3 Nf5 Qd3 a5",
  "sens": "met le pion a6 hors de portée de la dame d3 et libère la case a6 pour le fou : de là, il regardera la dame et gênera le roque long. Le cavalier f5 reste cloué sur place, surveillé par Fe3 comme il surveille Fe3.",
  "menace": "...Fa6, qui attaque la dame d3 et la force à bouger avant que les Blancs aient roqué.",
  "plan": [
   {
    "san": "O-O-O",
    "pourquoi": "roque tout de suite, avant que ...Fa6 ne vienne gêner. Le roi quitte le centre et la tour d1 soutient d4. Si ensuite ...Fa6, la dame recule en d2 ou e2 sans perdre de temps, car le roque est déjà fait."
   },
   {
    "san": "Na4",
    "pourquoi": "vise la case c5, un trou dans le camp noir depuis ...a5 et ...bxc6. Un cavalier en c5 attaquerait e6 et bloquerait toute l'aile dame. Il laisse aux Noirs ...Fa6, mais la dame peut aller en e2 ou d2."
   },
   {
    "san": "h4",
    "pourquoi": "prépare g4 pour chasser le cavalier f5, pièce la plus active des Noirs. Avec h4 d'abord, le cavalier ne pourra pas se réfugier en h4 après g4. Ce coup laisse aux Noirs le temps de jouer ...Fa6."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "semble écarter le fou de la vue du cavalier f5, mais ...g5 l'attaque aussitôt. Après g4 pour chasser le cavalier, il saute en h6 et le fou doit reculer : les Blancs ont perdu plusieurs temps et affaibli leur aile roi."
   },
   {
    "san": "h3",
    "pourquoi": "prépare g4 trop lentement. Les Noirs jouent ...fxe5 tout de suite : après Cxe5 Fd6, le cavalier e5 est attaqué et les Noirs ouvrent la colonne f pour leur tour. Le centre blanc se dissout avant que g4 n'arrive."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 59
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2 f5 c3 c5",
  "sens": "Ouvre la case c6 et la grande diagonale pour le fou c8, qui vise b7 ou a6 afin d'échanger le fou d3. Le pion c5 contrôle d4 mais laisse d5 un peu plus fragile.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant d'agir. Les Blancs pourront ensuite jouer f4 ou Te1 pour soutenir e5 ; ils laissent les Noirs choisir entre ...Fb7 et ...Fa6, sans rien perdre."
   },
   {
    "san": "f4",
    "pourquoi": "Consolide e5 une fois pour toutes et fixe le pion f5. Prépare un plan de jeu sur l'aile roi (g4 plus tard). En échange, la diagonale a7-g1 vers le roi blanc s'affaiblit un peu."
   },
   {
    "san": "Nd2",
    "pourquoi": "Développe le cavalier vers f3 ou b3, d'où il surveillera d4 et c5. Laisse aux Noirs le temps de jouer ...Fa6 pour échanger le fou d3, mais la position reste solide."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O b6 Be3 bxc5",
  "sens": "prend le pion c5 pour forcer dxc5 : le pion d4 disparaît, le centre blanc s'affaiblit et la colonne b s'ouvre pour la tour noire. Le pion c5 restera une cible.",
  "menace": "…cxd4 : les Noirs gagnent un pion net si les Blancs ne reprennent pas tout de suite.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Seul bon coup : il reprend le pion. Le fou e3 soutient c5 et la case d4 est libre pour un cavalier blanc (Cd4). En échange, les Noirs ont la colonne b ouverte et vont attaquer c5 avec …Cbd7 et …Fa6. Le pion c5 devra être défendu sans relâche, mais il gêne le développement noir."
   }
  ],
  "erreurs": [
   {
    "san": "Nc3",
    "pourquoi": "Développe un cavalier, mais oublie le pion : après …cxd4 Fxd4 Cbd7, les Noirs ont un pion de plus et le centre blanc est vidé."
   },
   {
    "san": "Qc2",
    "pourquoi": "Même oubli : …cxd4 Fxd4 Cbd7 et les Blancs ont perdu un pion pour rien. D'abord reprendre, ensuite développer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 23
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5 Bxc5 Qd2 Qb6",
  "nom": "Défense française, variante Steinitz (ligne avec 7.Fe3 et 9.Dd2)",
  "sens": "Place la dame sur la diagonale a7-g1, derrière le fou c5, pour attaquer le pion b2 et surcharger le fou e3 : les Blancs doivent régler ces deux problèmes avant de pouvoir roquer.",
  "menace": "...Fxe3 suivi de Dxe3 Dxb2 (gain du pion b2 et la tour a1 est attaquée) ; ou ...Fxe3 Dxe3 d4, fourchette qui gagne une pièce.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Enlève tout de suite le fou c5, l'attaquant principal des cases noires. Après ...Cxc5 ou ...Dxc5, la diagonale vers e3 est vide, la dame d2 n'est plus clouée à la défense et les Blancs peuvent jouer Fd3 puis 0-0-0 : le roi en c1 protègera b2. Les Noirs gardent une bonne case c5 pour le cavalier, mais perdent leur paire de fous."
   }
  ],
  "erreurs": [
   {
    "san": "Bg1",
    "pourquoi": "Le fou recule pour éviter l'échange, mais la case b2 reste sans défense : ...Fxg1 Cxg1 Dxb2 et les Noirs gagnent un pion en attaquant la tour a1. Un recul passif qui oublie la menace."
   },
   {
    "san": "Nd4",
    "pourquoi": "Le cavalier vient bloquer la diagonale, mais d4 est attaqué trois fois (fou c5, cavalier c6, dame b6) et défendu deux fois seulement : ...Fxd4 Fxd4 Dxd4 Dxd4 Cxd4 et les Blancs ont perdu une pièce entière."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 27
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2 Bd7 O-O",
  "nom": "Variante Rubinstein",
  "sens": "Met le roi à l'abri et relie les tours : la dame et le fou d3 visent déjà la case h7, les Blancs attendent que les Noirs roquent pour y frapper.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Développe le dernier cavalier et attaque le pion d4 : les Blancs doivent le garder (c3) au lieu de lancer leur attaque. Prépare O-O-O, où le roi noir sera loin de la batterie dame-fou sur h7."
   },
   {
    "san": "a6",
    "pourquoi": "Enlève la case b5 au fou et au cavalier blancs avant de roquer long : plus de clouage Fb5 ni de coup gênant sur b5. Petit coup, mais il prépare le plan sans rien donner."
   },
   {
    "san": "a5",
    "pourquoi": "Même idée, et freine en plus la poussée b4-b5 des Blancs sur l'aile dame. Le roi noir ira ensuite sur l'aile dame, à l'abri."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer du même côté que la batterie blanche : De4 menace Dxh7 mat. Les Noirs doivent jouer g6, et Fxh6 gagne le pion h6 qui n'est plus défendu par le pion g. Le roi noir se retrouve à découvert."
   },
   {
    "san": "b6",
    "pourquoi": "Coup lent qui laisse le temps à Ce5 : le cavalier attaque le fou d7. Si Fxe5 dxe5, la dame f6 est chassée et le pion e5 enferme les Noirs ; les Blancs gardent les deux fous et l'initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -61
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5 Qd2 Nc6",
  "nom": "Variante classique, système Steinitz-Alekhine-Chatard déviée (7.f4 avec 9.Dd2)",
  "sens": "Pose une troisième pièce sur d4 et sort la dernière pièce mineure vers le centre. Si les Blancs prennent en c5, la dame reprend en gagnant du temps. Le cavalier prépare aussi a6 et b5 pour inquiéter le roi blanc, qui ira à gauche.",
  "menace": "...cxd4 : le pion d4 n'est défendu que deux fois (Cf3, Dd2) contre trois attaques. Après 10.Cxd4 Cxd4 ou ...Cdxe5, les Blancs perdent du matériel ou leur centre.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Supprime la tension au centre avant qu'elle ne tourne mal : d4 était attaqué trois fois. Après ...Dxc5 (ou ...Cxc5), le pion e5 reste solide, protégé par f4 et Cf3, et les Blancs gardent une bonne case d4 pour un cavalier. Le prix : les Noirs ont une dame active en c5 et une colonne c demi-ouverte."
   },
   {
    "san": "O-O-O",
    "pourquoi": "Met le roi à l'abri et ajoute la tour d1 à la défense de d4. Sur ...cxd4 11.Cxd4, tout est protégé. Mais le roi se retrouve à gauche, là où les Noirs veulent jouer a6, b5 et b4 : il faudra être rapide à l'aile roi (g4, f5)."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers l'aile roi, en visant h7 après un futur f5. Il laisse ...cxd4 11.Cxd4 Cxd4 12.Dxd4 Cc5 : position égale mais tenable. Un coup naturel qui finit le développement."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "Trop lent : il ne défend pas d4. Après ...cxd4, le cavalier doit sauter en b5 pour regagner le pion, et ...f6 vient casser le pion e5. Le centre blanc s'effrite et le roi noir, déjà roqué, est en sécurité."
   },
   {
    "san": "Rd1",
    "pourquoi": "Semble défendre d4, mais retarde le roque et laisse le roi au milieu. Après ...cxd4 11.Cxd4 f6 !, le pion e5 est miné : si exf6, le cavalier d7 reprend et la colonne f s'ouvre contre le roi blanc resté en e1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 24
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O Bd7 b4 Nf5 Re1",
  "nom": "Défense française, variante d'avance (ligne 6.a3 Ch6)",
  "sens": "Place la tour derrière le pion e5 pour le consolider, et libère f1 pour le fou. Les Blancs ne se pressent pas de reprendre en d4 : ils achèvent leur développement et comptent sur l'espace que donne e5. Ils préparent aussi Fxf5 suivi de Cxd4 ou cxd4 pour récupérer le pion avec un centre fort.",
  "menace": "Fxf5 exf5 puis Cxd4 (ou cxd4) : les Blancs reprennent le pion d4 et obtiennent un beau centre. b5 pour chasser le cavalier c6 est aussi dans l'air.",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "Empêche b5 : le cavalier c6 reste en place et continue de défendre d4. Les Noirs gardent leur pion de plus un moment et peuvent ensuite développer tranquillement le fou en e7."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe et prépare le petit roque. Le roi sera à l'abri avant que le centre ne s'ouvre. Les Noirs laissent les Blancs reprendre en d4, mais ils auront fini leur développement."
   },
   {
    "san": "Rc8",
    "pourquoi": "Met la tour sur la colonne c, en face du pion c3 et du futur cavalier c3. Prépare ...dxc3 au bon moment : la reprise Cxc3 sera alors clouée ou gênée par la tour."
   }
  ],
  "erreurs": [
   {
    "san": "dxc3",
    "pourquoi": "Trop tôt : après Cxc3 le cavalier blanc se développe gratuitement, puis Cxd4 et Cg5 arrivent avec des menaces sur f7 et h7. Les Noirs rendent le pion et laissent les Blancs ouvrir la position alors que leur roi n'a pas roqué."
   },
   {
    "san": "Nfe7",
    "pourquoi": "Retire le cavalier qui défendait d4. Les Blancs jouent Fb2 et reprendront le pion d4 sans effort, en gardant tout leur espace. Le cavalier en e7 gêne en plus le fou f8."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -41
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O cxd4 cxd4 a5",
  "nom": "Française Tarrasch, variante fermée avec 9...a5",
  "sens": "prépare a4 pour chasser un cavalier qui irait en b3 et garde la pression sur d4 : la dame b6 et le cavalier c6 attaquent le pion, que f3 et la dame d1 doivent surveiller.",
  "menace": "a4 suivi de Fe7 et 0-0, puis renforcer la pression sur d4 ; pas de menace immédiate.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Sort la tour de la case f1 et libère f1 pour le cavalier d2 : Cf1 puis Ce3 ou Cg3 défend d4 et prépare l'attaque de roque. La tour soutient aussi e5. Les Noirs continuent par a4 et Fe7, mais d4 tient."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au cavalier et au fou noir : après Cf1-e3 ou Fe3, aucune pièce ne pourra venir gêner la défense de d4. Coup d'attente utile avant de choisir le plan."
   },
   {
    "san": "a3",
    "pourquoi": "Prépare b4 pour prendre de l'espace à l'aile dame et empêche Cb4 : le cavalier noir ne pourra plus échanger le fou d3. Concède a4 aux Noirs, mais ce pion fixé sur a4 peut devenir une cible."
   }
  ],
  "erreurs": [
   {
    "san": "a4",
    "pourquoi": "Semble bloquer le pion noir, mais oublie que d4 pend : après Cxd4 Cxd4 Dxd4, les Noirs gagnent un pion net, car la dame b6 prenait déjà d4 et plus rien ne le défend. Il faut d'abord défendre d4."
   },
   {
    "san": "Rb1",
    "pourquoi": "Défend b2 contre une menace qui n'existe pas et laisse c6-b4 : le cavalier force l'échange du fou d3, le bon fou blanc qui attaque h7. Sans lui, l'attaque de roque disparaît et d4 reste faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 45
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6",
  "nom": "Tarrasch, variante fermée (ligne 3...Cf6 avec ...f6)",
  "sens": "reprend le pion en développant : le cavalier contrôle e4 et surveille g4 et h5, tout en ouvrant la colonne f pour la tour après le petit roque.",
  "menace": "Aucune menace immédiate ; les Noirs préparent ...Fd6, ...O-O et la pression sur d4 par ...Dc7 ou ...Cb4.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Il relie les tours et prépare Cf3 puis Te1 ou Ff4. Il laisse aux Noirs le temps de jouer ...Fd6, mais le roi blanc est en sécurité et d4 reste bien défendu par Ce2 et la dame."
   },
   {
    "san": "Nf3",
    "pourquoi": "Développe le dernier cavalier et vise la case e5, le trou laissé par ...f6. Il défend aussi d4 et h2. En échange, il bloque la diagonale du fou d3 et laisse aux Noirs ...Fd6 avec un coup de plus pour attaquer."
   },
   {
    "san": "Qb3",
    "pourquoi": "Attaque tout de suite le pion e6 affaibli et le pion b7. Il force les Noirs à défendre avec ...Fd6 ou ...Dd6 avant de roquer. Mais la dame sortie tôt peut être chassée par ...Ca5, et les Blancs ont retardé leur propre développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 31
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4 Qc7 O-O Nxe5 Nxe5",
  "sens": "Reprend la pièce tout de suite pour rester à matériel égal. Le cavalier central est protégé par la dame f4 et vise g6 et f7 ; avec le fou d3, il regarde la case g6, juste à côté du roi noir encore au centre.",
  "menace": "Ng6 pour fourcher la tour h8, et Bg6+ suivi de Qf7 contre le roi coincé sur e8.",
  "plan": [
   {
    "san": "Qxe5",
    "pourquoi": "Le seul bon coup. La dame prend le cavalier qui gêne : si les Blancs reprennent avec Qxe5, fxe5 et les dames sont échangées. Sans dames, le roi noir au centre ne risque plus rien et les Noirs gardent un pion de plus avec le centre d4-e5. Si les Blancs gardent les dames, le cavalier est gagné pour rien."
   }
  ],
  "erreurs": [
   {
    "san": "fxe5",
    "pourquoi": "Tentant, mais le pion f6 s'en va et la diagonale vers g6 s'ouvre : Bg6+ Ke7 puis Qf7 mat. Il faut reprendre avec la dame, pas avec le pion."
   },
   {
    "san": "g5",
    "pourquoi": "Chasse la dame, mais hxg5 et la dame f4 est toujours là, prête à aller en h4 : le cavalier e5 reste, le roi noir est à découvert et les Noirs ont perdu du temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 101
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6 bxc6 O-O a5 Re1",
  "nom": "Défense française, variante Tarrasch, système Guimard (3...Cc6)",
  "sens": "Renforce le pion e5 avec la tour : si les Noirs prennent en e5, le cavalier reprend sans crainte. Les Blancs veulent garder ce pion qui coupe l'échiquier en deux et empêche le roi noir de respirer.",
  "plan": [
   {
    "san": "f5",
    "pourquoi": "Ferme le centre. Le pion e5 reste là, mais il ne gêne plus : les Noirs vont pouvoir jouer ...Fe7, ...O-O puis ...c5 tranquillement. Les Blancs gardent un bon pion en e5, mais la position se calme et le roi noir trouvera un abri."
   },
   {
    "san": "fxe5",
    "pourquoi": "Échange un pion et un cavalier (10...fxe5 11.Cxe5 Cxe5 12.dxe5). La colonne f s'ouvre pour la tour après ...Fe7 et ...O-O. Attention : les Blancs gardent un pion e5 solide et les pions noirs c6/c7 restent doublés."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développe trop tôt. Les Blancs jouent 11.exf6 Cxf6 12.Ce5 : le cavalier s'installe en e5 avec le soutien de la tour et le roi noir reste au centre, sans pouvoir roquer vite."
   },
   {
    "san": "c5",
    "pourquoi": "Attaque le centre, mais le roi est encore en e8. Après 11.exf6 Dxf6 12.c4, tout s'ouvre et les pièces blanches foncent vers le roi noir qui n'a plus de protection."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -43
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4",
  "nom": "Winawer, variante du Pion empoisonné (Portisch-Hook / ligne principale 7.Dg4 Dc7)",
  "sens": "ouvre la colonne c vers le roi blanc et casse le centre : après la prise, le pion e5 devient une cible et c2 est faible. La tour g8 est déjà défendue par le cavalier e7, donc pas d'urgence : les Noirs créent d'abord leurs propres menaces avant Cbc6, Fd7 et 0-0-0.",
  "menace": "dxc3, qui ouvre la colonne d et gagne un pion de plus, avec Dxe5+ dans l'air.",
  "plan": [
   {
    "san": "Ne2",
    "pourquoi": "Développe en couvrant c3 et d4 à la fois. Les Blancs reprennent le contrôle du centre, préparent Rb1 ou f4 pour tenir e5, et laissent aux Noirs un roi qui doit encore trouver refuge à l'aile dame."
   },
   {
    "san": "Rb1",
    "pourquoi": "Sort la tour de la diagonale a1-h8 avant qu'elle ne soit attaquée, et vise le pion b7 ; la tour sera active sur la colonne b, exactement là où le roi noir veut se cacher."
   },
   {
    "san": "Qd3",
    "pourquoi": "Ramène la dame au centre : elle défend c3 et e5 en même temps, et dxc3 ne gagne plus rien. Les Noirs gardent un pion de moins mais obtiennent du jeu sur les colonnes c et g."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Développe mais oublie c3 : après Dxc3+ le roi blanc doit aller en e2, puis la dame noire prend la tour a1. Une pièce entière perdue pour avoir voulu aller trop vite."
   },
   {
    "san": "Bb5+",
    "pourquoi": "Un échec qui ne mène nulle part : les Noirs bloquent avec Fd7, le fou s'échange et le cavalier reprend en d7 avec un très beau développement. Les Blancs ont dépensé deux coups pour aider l'adversaire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 67
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5 Bf4",
  "nom": "Défense française, variation Rubinstein",
  "sens": "Sort le fou avant de roquer et prend la diagonale b8-h2 : le fou noir ne pourra plus s'installer en d6, et les Blancs gardent le choix entre O-O et O-O-O après Qe2.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Les Noirs n'ont aucun pion faible et un développement simple : ensuite b6, Bb7 et Qe7 ou Nd5. Les Blancs ne peuvent rien attaquer de concret pour l'instant."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le dernier fou vers c6, d'où il visera la grande diagonale. Il prépare aussi Qa5+ ou Qb6 avec la dame soutenue. Laisse aux Blancs le temps de roquer, mais sans cible."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque le pion b2 et menace de gêner le roque long des Blancs. Si b3, le fou c5 reste fort et les Noirs roquent tranquillement. Attention : la dame peut devenir une cible après Qe2 et O-O-O."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -28
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2 Bg7 Na3 O-O O-O",
  "nom": "Défense française, variante d'avance, ligne 5...Db6 6.Fe2 Ch6",
  "sens": "Met le roi à l'abri en coin, loin de la colonne e qui va s'ouvrir après f6, et relie les tours pour soutenir d4 et e5.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite le pion e5, la pointe de la chaîne blanche. Si exf6, le fou g7 et la tour f8 s'ouvrent sur le centre et les pions doublés h6 n'ont plus d'importance. Les Blancs devront choisir entre défendre e5 ou l'échanger."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange en c3 pour fixer le pion d4 comme cible : la dame b6 et le cavalier c6 le visent, et le fou g7 pointera sur lui après f6. Attention : après cxd4, la case b4 devient disponible pour le cavalier blanc a3-b5 ; il faut surveiller c7 et d6."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou qui bloque la tour a8 et prépare Tac8 ou Tb8. C'est un coup utile qui ne décide rien : les Blancs continuent Cc2 et Tad1, mais les Noirs ont une pièce de plus en jeu avant de pousser f6."
   }
  ],
  "erreurs": [
   {
    "san": "Qc7",
    "pourquoi": "Reculer la dame sans raison donne un temps gratuit : après Cc2 et Tac1, les Blancs tiennent d4 confortablement et la dame noire ne gêne plus rien sur b6. La pression sur b2 et d4 disparaît, c'était pourtant le but de Db6."
   },
   {
    "san": "Ne7",
    "pourquoi": "Retire le cavalier de la pression sur d4 pour l'amener en f5, mais trop lentement : Cc2 puis cxd4 et le centre blanc est solide. Le cavalier en c6 était bien placé ; mieux vaut d'abord jouer f6 pour ouvrir la position."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -34
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6 Re1 Be7",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 Dxd5",
  "sens": "Termine le développement de l'aile roi et ferme la colonne e : le fou fait écran devant le roi, qui pourra roquer au coup suivant. Le pion d4 est abandonné à son sort, la sécurité du roi passe avant.",
  "plan": [
   {
    "san": "Nbxd4",
    "pourquoi": "Reprend le pion avec le bon cavalier : celui de b3 était mal placé, celui de f3 reste devant le roi pour le protéger. Le cavalier en d4 attaque c6 et e6, et après ...Cxd4 Dxd4 la dame regarde la colonne d vers la dame noire. Les Noirs vont roquer, mais les Blancs ont déjà toutes leurs pièces en jeu."
   },
   {
    "san": "Nfxd4",
    "pourquoi": "Reprend aussi le pion, mais libère la colonne f et laisse le cavalier b3 un peu passif. C'est jouable : le but est le même, rétablir l'égalité matérielle avant que les Noirs ne consolident."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe en clouant le cavalier f6 contre la dame : ...Fxg5 Cxg5 n'est pas à craindre. On reprendra d4 ensuite, le pion ne s'enfuira pas. Attention : les Noirs peuvent jouer ...Dd8 ou roquer, ils tiennent l'égalité."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Retire le fou de la diagonale a2-g8 où il visait e6 et f7. Les Noirs répondent ...e5 ! : le pion est soutenu, 5.Cxe5 Cxe5 et les Blancs n'ont rien gagné. Le pion d4 reste en vie, désormais protégé par e5, et les Noirs ont le centre."
   },
   {
    "san": "Bd2",
    "pourquoi": "Trop timide : le fou bloque la dame et la colonne d. Après ...O-O et le fou blanc qui doit déjà bouger (Fb5), les Noirs jouent ...Td8 : le pion d4 est maintenant défendu par la dame et la tour, et les Blancs restent avec un pion de moins pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4 Ne7 Nf3 O-O Be3",
  "nom": "Variante Steinitz avec 4.dxc5 (Défense française)",
  "sens": "Termine le développement et offre l'échange du fou b6, la meilleure pièce noire : tant qu'il vise g1, le roi blanc ne peut pas roquer tranquillement. Après l'échange, les Blancs roquent et le pion e5 reste solide.",
  "menace": "Bxb6 suivi de O-O-O ou O-O : les Blancs prennent le bon fou noir et mettent enfin leur roi à l'abri.",
  "plan": [
   {
    "san": "Bxe3",
    "pourquoi": "Prend d'abord : après Dxe3 le pion e5 est moins défendu et les Noirs gardent la bonne structure. Mieux vaut échanger soi-même que de laisser Fxb6 abîmer les pions avec ...axb6."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou de cases blanches et prépare ...Fb5 pour l'échanger contre la dame ou le fou f1. Si Fxb6, les Noirs reprennent de la dame (...Dxb6) sans casser les pions."
   },
   {
    "san": "Nf5",
    "pourquoi": "Le cavalier attaque e3 et presse sur d4. Si Fxb6 Dxb6, la dame noire regarde b2 et e3 : les Blancs ont du mal à roquer sans concéder quelque chose."
   }
  ],
  "erreurs": [
   {
    "san": "Ng6",
    "pourquoi": "Le cavalier quitte la défense de c6 et de d5 pour attaquer f4 et e5. Mais Fxb6 axb6 : les pions noirs sont doublés et le cavalier g6 sera chassé par g3 puis h4-h5. Reprendre de la dame est impossible car elle ne défend plus b6."
   },
   {
    "san": "Na6",
    "pourquoi": "Développe au bord : Fxb6 Dxb6, puis g3 et les Blancs roquent. Le cavalier a6 ne fait rien et les Noirs ont perdu leur fou actif sans contrepartie. Mieux vaut échanger soi-même avec ...Fxe3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5 Bxc5 b4 Bb6 Bd3",
  "nom": "Française, variante d'avance, 5...Fd7 6.Fe2 Cge7 avec 8.dxc5 et 9.b4",
  "sens": "attaque le cavalier f5 pour le forcer à bouger : sur f5 il tient d4 et surveille le roi blanc. Le fou pointe aussi vers h7, cible classique dès que les Noirs auront roqué.",
  "menace": "Fxf5 suivi de Fxf5 : les Blancs échangent le cavalier actif contre leur fou et abîment la coordination noire ; aucune perte de matériel immédiate, mais le cavalier doit se décider.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant de s'occuper du cavalier. Si Fxf5 exf5, le pion f5 ouvre la colonne e et le fou d7 devient actif. Les Noirs gardent la pression sur e5 et préparent ...Dc7 ou ...f6."
   },
   {
    "san": "Nh4",
    "pourquoi": "Propose l'échange des cavaliers : après Cxh4 Dxh4, la dame attaque e5 et b4 à la fois. Les Blancs doivent défendre et perdent du temps ; la dame reviendra en c7 ou d8 si on la chasse."
   },
   {
    "san": "Qc7",
    "pourquoi": "Appuie sur e5 et sur la diagonale b8-h2, tout en liant la pièce lourde au jeu. Prépare ...O-O-O ou ...Ch4 avec le pion e5 sous pression. Laisse aux Blancs le choix de prendre en f5, ce qui ouvre la colonne e aux Noirs."
   }
  ],
  "erreurs": [
   {
    "san": "Nh6",
    "pourquoi": "Recule sur une case passive où le cavalier ne fait rien. Les Blancs jouent b5 : le cavalier c6 est chassé en a5, puis a4 le laisse coincé au bord. Les Noirs perdent du temps et leur pression sur e5 disparaît."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -33
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2 f5 c3 c5 O-O",
  "sens": "Met le roi à l'abri sur l'aile roi avant d'ouvrir le centre. La tour f1 pourra venir en e1 pour soutenir e5, et f4 devient possible sans exposer le roi.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier vers g6, d'où il attaquera le pion e5. Il garde aussi f5 et d5. Les Noirs pourront ensuite roquer ou jouer ...Bd7 et ...c4 selon la réaction des Blancs."
   },
   {
    "san": "Bd7",
    "pourquoi": "Sort le fou avant le roque en gardant la diagonale a4-e8. Le fou protège e6 et c6, et laisse la case b7 libre pour la tour ou la dame. Les Noirs ne cèdent rien et finissent leur développement."
   },
   {
    "san": "c4",
    "pourquoi": "Chasse le fou d3 de sa belle diagonale vers h7. Le pion gagne de l'espace à l'aile dame et fixe la structure. Attention : le pion c4 devra être soutenu plus tard par ...a5 ou ...Bd7."
   }
  ],
  "erreurs": [
   {
    "san": "Bb7",
    "pourquoi": "Le fou se bloque derrière ses propres pions c5 et d5 : il ne voit rien. Après Nd2 puis b4, les Blancs attaquent c5 et le fou en b7 reste passif, sans jamais trouver une case utile."
   },
   {
    "san": "Be7",
    "pourquoi": "Trop lent. Les Blancs jouent b4 et le pion c5 vacille : après ...c4 le fou recule en c2 et reste pointé sur h7 et f5. Le fou en e7 ne protège rien et gêne la dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 1
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 Bd3 cxd4 O-O Bd7 b4 Nf5 Re1 a6",
  "nom": "Variante d'avance, système 6.a3 avec 7.Fd3",
  "sens": "Interdit b5 : le cavalier c6 n'est plus chassé et continue de couvrir d4 et e5. Les Noirs conservent leur pion de plus et pourront finir leur développement par Fe7 et roque.",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "Attaque le pion d5 et ouvre la colonne c tant que le roi noir est encore au centre. Si les Noirs prennent en c4, le fou se recentre sur c4 ou e4 avec vue sur f7 ; sinon d5 doit être défendu. Les Blancs renoncent à reprendre d4, mais gagnent de l'activité."
   },
   {
    "san": "Bxf5",
    "pourquoi": "Élimine le cavalier qui pressait d4 et gênait le jeu blanc. Après exf5, les Noirs ont des pions doublés et leur fou d7 est devenu mauvais, mais la colonne e s'ouvre pour leur fou ; les Blancs devront vite reprendre en d4 avec c3xd4."
   },
   {
    "san": "h4",
    "pourquoi": "Gagne de l'espace sur l'aile roi et prépare g4 pour chasser le cavalier f5. Cela crée aussi une case h3 pour le roi. Le pion h4 est un peu avancé, les Noirs peuvent répondre h5 pour bloquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 40
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O Be7 dxc5",
  "nom": "Variante Tarrasch, ligne 3...c5 4.exd5 exd5 avec Fb5+",
  "sens": "Échange le pion central contre le pion c5 : les Noirs doivent reprendre, et le pion d5 reste isolé, sans voisin pour le protéger. Si les Noirs tardent, b2-b4 garde le pion de plus.",
  "menace": "Garder le pion c5 avec b2-b4 si les Noirs ne le reprennent pas tout de suite.",
  "plan": [
   {
    "san": "Nxc5",
    "pourquoi": "Reprend le pion immédiatement avec le cavalier d7, qui gagne une belle case : il vise e4 et surveille d5. Le fou e7 reste bien placé et le roque suivra. Les Noirs auront un pion d5 isolé, mais des pièces actives pour le défendre."
   },
   {
    "san": "a5",
    "pourquoi": "Empêche b2-b4 : les Blancs ne pourront plus garder le pion c5. Le cavalier le reprendra au coup suivant. Coup plus lent, qui laisse aux Blancs un temps pour Cb3 ou Te1."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer est naturel, mais trop tôt : après b2-b4 le pion c5 est défendu et les Noirs restent avec un pion de moins. Reprendre d'abord, roquer ensuite."
   },
   {
    "san": "Bxc5",
    "pourquoi": "Reprend avec la mauvaise pièce : après Te1+ le roi doit aller en f8 et perd le droit de roquer, puis Cb3 chasse le fou. Le cavalier reprend mieux, le fou doit rester en e7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -14
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4 Bg4 Be3 Nbd7",
  "nom": "Défense française, variante d'échange avec 4.c4",
  "sens": "Développe le dernier cavalier sans boucher la colonne c. Il vise b6 pour chasser le fou de c4, et garde f8 en réserve pour protéger le roi. L'autre cavalier pourra plus tard sauter en e4.",
  "menace": "…Cb6 gagne du temps sur le fou de c4, puis …Cbd5 ou …Cfd5 s'installe sur la case faible d5 devant le pion d4 isolé.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Le pion d4 est isolé : il faut d'abord finir le développement, puis chercher l'attaque avec les pièces actives. Les Noirs jouent …Cb6, mais le fou recule en b3 ou e2 sans dommage."
   },
   {
    "san": "h3",
    "pourquoi": "Pose la question au fou g4 : il doit soit prendre en f3 (et donner la paire de fous), soit reculer en h5. Cela retire aussi la case g4 à un cavalier noir. Rien n'est perdu, et le roque suit."
   },
   {
    "san": "Bb3",
    "pourquoi": "Retire le fou avant qu'il ne soit attaqué par …Cb6. Depuis b3, il continue de viser f7 et ne gêne plus la tour sur la colonne c. Les Noirs gardent une position solide mais sans cible facile."
   }
  ],
  "erreurs": [
   {
    "san": "Qc2",
    "pourquoi": "Trop tôt : après …Fxf3 gxf3 les pions blancs du roque sont abîmés, puis …Cb6 chasse le fou. Les Blancs ont perdu du temps et affaibli leur roi pour rien."
   },
   {
    "san": "Qe2",
    "pourquoi": "La dame se place sur une colonne qui va s'ouvrir avec …Te8. Après …Cb6 Fb3 a5, les Noirs gagnent des temps en attaquant le fou, et la dame gêne ses propres pièces."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -7
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2 Bd7 O-O Nc6",
  "nom": "Variante Rubinstein",
  "sens": "développe le dernier cavalier et attaque le pion d4 avec le cavalier et la dame : les Blancs doivent d'abord le protéger. Prépare le grand roque, pour mettre le roi noir loin de la batterie dame-fou visant h7.",
  "menace": "Cxd4 : le cavalier prend d4 ; si Cxd4, Dxd4 et les Noirs ont gagné un pion.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Protège d4 solidement avec un pion. Le fou d3 reste sur sa diagonale vers h7 et le centre tient. Les Noirs vont roquer long ou pousser e5, les Blancs gardent un peu plus d'espace."
   },
   {
    "san": "Qe3",
    "pourquoi": "Défend d4 avec la dame tout en restant au centre. Évite la prise en d4. Les Noirs peuvent roquer long et jouer e5 pour libérer leur jeu."
   }
  ],
  "erreurs": [
   {
    "san": "Bb5",
    "pourquoi": "Semble clouer le cavalier, mais après Cxd4 le pion est perdu : Fxd7+ Rxd7 et les Noirs gardent le pion gagné en toute sécurité."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe mais oublie que le fou ne défend d4 qu'une fois : après O-O-O puis e5, le pion d4 est sous une pression énorme et le centre blanc s'écroule."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 64
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O cxd4 cxd4 a5 Re1",
  "nom": "Française, variante Tarrasch fermée (3...Cf6, système 5.Fd3 c5 6.c3)",
  "sens": "libère f1 pour le cavalier de d2 et place la tour derrière e5 : Cf1 puis Ce3 ou Cg3 viendra défendre d4 et viser le roi noir.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe et prépare le roque. Le fou surveille g5 et h4, ce qui gêne un futur Cg3-h5 ou Fg5. Ensuite O-O, puis f6 ou a4 au bon moment. Les Blancs jouent Cf1 : d4 reste solide, mais les Noirs ont un jeu sain."
   },
   {
    "san": "h6",
    "pourquoi": "Prend la case g5 au cavalier et au fou avant de roquer. Un coup utile mais moins pressé que Fe7 : il ne développe pas et laisse aux Blancs une avance tranquille (Cf1, Ce3)."
   }
  ],
  "erreurs": [
   {
    "san": "a4",
    "pourquoi": "Trop tôt : après a3 et b4, le pion a4 est bloqué et b4 gagne de l'espace. Le cavalier d2 n'a pas bougé mais d4 tient quand même. Développer d'abord avec Fe7."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Le piège classique rate : après Cxd4 Dxd4 Cf3, la dame doit fuir et les Blancs ont donné un pion pour un développement rapide et une attaque (Fe3, Fb5, Tc1). Avec le roi noir encore au centre, c'est dangereux."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -44
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3 Nf5 Qd3 a5 O-O-O",
  "sens": "Met le roi à l'abri sur l'aile dame avant que ...Fa6 ne vienne harceler la dame. La tour d1 soutient d4 et la dame pourra reculer en d2 ou e2 sans perdre de temps, le roque étant déjà fait.",
  "menace": "g2-g4 pour chasser le cavalier f5, bien placé contre e3 et d4.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "Le pion marche vers le roi blanc : il fixe a2 et prépare ...a3 pour ouvrir les lignes. Il libère aussi la case a5 pour la dame. Les Blancs devront surveiller leur roque."
   },
   {
    "san": "Bb4",
    "pourquoi": "Développe en clouant le cavalier c3 sur le roi. Prépare ...a4 et ...Fa6 avec du monde contre le roque blanc. Les Blancs peuvent répondre a3 pour chasser le fou."
   },
   {
    "san": "Be7",
    "pourquoi": "Développe sobrement et prépare le petit roque. Le fou protège f6 et la case g5. Laisse les Blancs jouer g4, mais le cavalier reviendra en h4 ou prendra en e3."
   }
  ],
  "erreurs": [
   {
    "san": "Ba6",
    "pourquoi": "Chasse la dame... qui recule en d2 sans gêne, car le roque est fait. Le fou a6 ne vise plus rien et le temps est perdu : les Blancs jouent Tde1 et poussent g4 contre le cavalier."
   },
   {
    "san": "Nxe3",
    "pourquoi": "Donne le bon cavalier contre un fou passif. Après Dxe3 la dame blanche est active, h4 suit et les Noirs n'ont plus de pièce pour gêner d4 et e5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -63
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O b6 Be3 bxc5 dxc5",
  "sens": "reprend le pion pour ne pas rester en déficit matériel. Le pion c5, soutenu par le fou e3, prive le cavalier noir de la case d6 et bloque le pion c7. La case d4, devenue libre, attend un cavalier blanc.",
  "plan": [
   {
    "san": "Ng4",
    "pourquoi": "attaque le fou e3, le seul défenseur de c5. Si le fou recule en d4, …Bf6 propose l'échange et affaiblit c5 ; si les Blancs laissent prendre, …Nxe3 fxe3 leur donne des pions doublés. Le cavalier devra toutefois revenir ensuite : les Blancs gagnent un temps avec h3."
   },
   {
    "san": "a5",
    "pourquoi": "prépare …Ba6 pour échanger le bon fou d3 et contrôle la case b4, que la dame blanche aimerait utiliser. Ensuite …Nd7 et …Qc8-…Rb8 attaquent c5 par la colonne b ouverte. Les Blancs ont le temps de jouer Nc3 et Nd4."
   },
   {
    "san": "Ne4",
    "pourquoi": "centralise le cavalier et vise c5 et f2. Si Bxe4 dxe4, le cavalier f3 doit bouger et c5 reste faible. Le cavalier peut cependant être chassé par Nbd2 ou échangé, ce qui simplifie la position."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -29
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5 Bxc5 Qd2 Qb6 Bxc5",
  "nom": "Défense française, variante Steinitz (ligne Boleslavsky)",
  "sens": "échange le fou noir qui visait e3 et mettait la pression sur la grande diagonale ; le fou blanc attaque au passage la dame b6 et libère la dame d2, qui ne doit plus garder e3 : les Blancs pourront jouer Fd3 puis grand roque, le roi en c1 couvrant b2.",
  "menace": "Prendre la dame b6 : le fou c5 l'attaque directement.",
  "plan": [
   {
    "san": "Nxc5",
    "pourquoi": "Reprend avec le cavalier, qui s'installe sur la belle case c5 : il surveille d3, e4 et b3, et ne peut pas être chassé par un pion. La dame reste en b6 et continue de viser b2, ce qui gêne le grand roque blanc. Ensuite les Noirs roquent et jouent ...f6 pour attaquer le centre blanc. Les Blancs gardent un peu plus d'espace, mais rien de grave."
   }
  ],
  "erreurs": [
   {
    "san": "Qxc5",
    "pourquoi": "Reprendre avec la dame est naturel mais mauvais : la dame quitte la colonne b et ne gêne plus le grand roque. Après 0-0-0 et h4, les Blancs lancent leur attaque de pions (h5, f5) contre le roi noir, et le cavalier d7 reste mal placé. Les Noirs perdent environ un pion de valeur de position."
   },
   {
    "san": "Qxb2",
    "pourquoi": "Le pion b2 semble gratuit, mais c'est un piège : après Tb1 la dame est attaquée et n'a aucune case de fuite (a3, c3, c2 sont toutes couvertes). Elle doit prendre en b1 et le cavalier c3 la reprend : les Noirs ont donné leur dame pour une tour et un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -32
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5 Qd2 Nc6 dxc5",
  "nom": "Variante classique, 4.Fg5 Fe7 5.e5 (système 7.f4 avec Dd2)",
  "sens": "Résout la tension sur d4 en prenant le pion c5 : les Blancs renoncent à leur centre de pions pour garder un e5 solide et offrir la case d4 à un cavalier.",
  "plan": [
   {
    "san": "Nxc5",
    "pourquoi": "Reprend le pion avec le cavalier, qui sort de d7 et trouve une belle case active en c5 : il regarde e4 et d3. La dame reste en e7 pour surveiller la colonne e et préparer ...f6 contre le pion e5. Les Blancs peuvent répondre O-O-O ou Fd3, mais les Noirs ont un jeu facile."
   },
   {
    "san": "Qxc5",
    "pourquoi": "Reprend avec la dame, qui devient active sur la diagonale c5-g1 et empêche les Blancs de roquer tranquillement côté roi. Le cavalier d7 reste en place pour soutenir ...f6. Attention : la dame peut être chassée par Cd4 ou Fd3, il faudra trouver une case de repli."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite le pion e5, le point fort des Blancs. Après exf6, le cavalier d7 reprend en f6 et la colonne f s'ouvre pour la tour. On diffère la reprise en c5 : le pion c5 ne s'enfuira pas et peut encore être pris plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "Re8",
    "pourquoi": "Coup trop lent : la tour n'a rien à faire sur une colonne fermée par le pion e5. Les Blancs répondent Ca4 et le pion c5 est défendu. Ensuite le cavalier blanc vient en d6 ou b6, les Noirs ont perdu un pion sans compensation."
   },
   {
    "san": "h6",
    "pourquoi": "Un coup de sécurité inutile : il ne prend pas le pion c5 et affaiblit le roque. Les Blancs jouent O-O-O puis De3 : le pion c5 est consolidé et le pion h6 devient une cible pour h4-h5 et une attaque sur l'aile roi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -22
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6 O-O",
  "nom": "Défense française, variante Tarrasch (ligne fermée, 3...Cf6)",
  "sens": "met le roi à l'abri et relie les tours avant de choisir un plan ; il prépare Cf3 puis Te1 ou Ff4, sans rien céder au centre",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vise h2 et empêche Ff4. Il prépare ...O-O et ...e5 pour libérer le fou de c8. Il laisse aux Blancs Cf3 et Te1, mais les Noirs ont fini leur développement."
   },
   {
    "san": "e5",
    "pourquoi": "Pousse tout de suite au centre : le pion e6 bouge, le fou c8 respire. Après dxe5 Cxe5, les Noirs ont des pièces actives. Attention : le pion d5 devient isolé et les Blancs peuvent l'attaquer."
   },
   {
    "san": "Qc7",
    "pourquoi": "Place la dame sur la colonne c ouverte et vise h2 avec le fou qui viendra en d6. Elle interdit Ff4 (le fou serait échangé) et prépare ...Fd6 puis ...O-O."
   }
  ],
  "erreurs": [
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 et b2, mais d4 est bien défendu. Après Cf3 Fd6 Ff4 les Blancs échangent le bon fou noir, et la dame en b6 ne fait rien : elle gêne même le développement du fou c8."
   },
   {
    "san": "Qd7",
    "pourquoi": "Bloque le fou c8 et ne menace rien. Après Cf3 la dame doit revenir en c7, et Ff4 prend la diagonale : les Noirs ont perdu deux temps pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -31
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7 c3 f6 Bb5 a6 Bxc6 bxc6 O-O a5 Re1 f5",
  "sens": "verrouille le centre : le pion f5 bloque la poussée blanche et laisse les Noirs respirer. Le pion e5 blanc reste solide mais n'attaque plus rien, et les Noirs vont pouvoir développer tranquillement ...Be7, roquer, puis pousser ...c5.",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "Attaque tout de suite le pion d5, pilier de la position noire. Si les Noirs prennent, Cxc4 arrive avec le cavalier sur une belle case et la colonne c s'ouvre sur leurs pions doublés. S'ils ne prennent pas, d5 doit être défendu en permanence."
   },
   {
    "san": "Nb3",
    "pourquoi": "Sort le cavalier de d2 où il bloquait tout, libère le fou c1 et vise la case c5 : il empêche la poussée ...c5 que veulent les Noirs. L'adversaire n'a plus son plan naturel."
   },
   {
    "san": "a4",
    "pourquoi": "Fixe le pion a5 noir et prépare Fa3 ou Cb3 : la case b5 et le pion a5 deviennent des cibles. Les Noirs n'ont rien d'immédiat contre ce coup."
   }
  ],
  "erreurs": [
   {
    "san": "a3",
    "pourquoi": "Perd un temps pour rien : les Noirs répondent ...c5 et libèrent leur jeu, la poussée que les Blancs devaient empêcher avec Cb3. Le centre blanc perd ses points d'appui."
   },
   {
    "san": "h4",
    "pourquoi": "Attaque dans le vide : avec le centre fermé, le roi noir est en sécurité et h4 n'ouvre rien. Après ...h6 et ...Fe7, les Noirs roquent tranquillement et c'est le roque blanc qui est affaibli."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 59
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 Nh6 Bxh6 gxh6 Qd2 Bg7 Na3 O-O O-O f6",
  "sens": "Frappe la pointe de la chaîne blanche : le pion e5 est attaqué une fois de plus par f6, et derrière lui le fou g7 et la tour f8 attendent que la colonne f et la grande diagonale s'ouvrent.",
  "menace": "fxe5 : les Noirs gagnent le pion e5, car après dxe5 ou Cxe5 le pion d4 ou le cavalier tombent sous les coups du fou g7 et des pièces noires concentrées sur le centre.",
  "plan": [
   {
    "san": "exf6",
    "pourquoi": "Le coup le plus simple : on échange le pion attaqué avant de le perdre. Après Fxf6 ou Txf6 le centre s'ouvre, mais la case e5 n'est plus un poids à défendre, et le pion h6 reste faible et doublé. Il faudra ensuite surveiller la colonne f et la case e5, où un cavalier noir aimerait s'installer."
   },
   {
    "san": "dxc5",
    "pourquoi": "Contre-attaque au lieu de défendre : on prend c5 avec gain de temps sur la dame b6. Si Dxc5, e5 est toujours attaqué, mais le cavalier blanc peut aller en b5 ou d4 et les Blancs ont déjà échangé un pion central. Attention : le pion e5 reste à défendre après fxe5."
   }
  ],
  "erreurs": [
   {
    "san": "Rad1",
    "pourquoi": "Développer une tour semble naturel, mais cela ignore la menace. Après fxe5 Cxe5 Cxe5, les Blancs perdent simplement le pion central : la tour en d1 ne défend rien d'utile ici."
   },
   {
    "san": "Kh1",
    "pourquoi": "Un coup d'attente qui perd le pion e5 : fxe5 dxe5 Cxe5 et les Noirs ont gagné un pion au centre tout en ouvrant la colonne f et la diagonale du fou g7 vers le roi blanc."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 33
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3 Nc6 Bd3 h5 Qf4 f6 h4 Qc7 O-O Nxe5 Nxe5 Qxe5",
  "sens": "La dame reprend le cavalier et se met en face de la dame blanche : elle force les Blancs à choisir tout de suite entre échanger les dames ou reculer, tout en gardant le pion d4 et le centre.",
  "menace": "Dxf4 : la dame noire attaque la dame blanche ; si les Blancs ne bougent pas la dame, elle est prise avec un pion de plus pour les Noirs.",
  "plan": [
   {
    "san": "Qf3",
    "pourquoi": "Recule en gardant les dames : c'est la seule chance des Blancs, car le roi noir est encore au centre. La dame regarde h5 et la grande diagonale vers b7, et prépare Te1 pour appuyer sur e5 et e6. Les Noirs restent avec un pion de plus, mais doivent encore mettre leur roi à l'abri."
   }
  ],
  "erreurs": [
   {
    "san": "Qxe5",
    "pourquoi": "Échange les dames : après fxe5, le roi noir au centre n'a plus rien à craindre et les Noirs gardent un pion de plus avec les pions d4 et e5 qui tiennent tout le centre. Les Blancs ont donné leur seul atout, l'attaque sur le roi."
   },
   {
    "san": "Qd2",
    "pourquoi": "Garde les dames mais recule passivement : les Noirs jouent Ch6, développent sans problème et mettent le roi en sécurité. La dame en d2 n'attaque rien, et le pion de plus des Noirs finit par compter."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -133
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2",
  "nom": "Variante Winawer, pion empoisonné (ligne principale)",
  "sens": "Développe le cavalier en attaquant le pion d4 et en couvrant c3 : les Blancs veulent reprendre d4 avec le cavalier ou le pion c3 pour rebâtir leur centre, tout en gardant leur dame active sur l'aile roi.",
  "menace": "cxd4 (ou Cxd4) : reprendre le pion et retrouver un centre solide e5-d4 pendant que le roi noir est encore au milieu.",
  "plan": [
   {
    "san": "Nbc6",
    "pourquoi": "Développe en attaquant e5 et en protégeant d4 : si les Blancs prennent cxd4, Cxd4 suit et le pion e5 reste faible. Les Noirs préparent Fd7 puis le grand roque pour mettre le roi à l'abri à l'aile dame."
   },
   {
    "san": "dxc3",
    "pourquoi": "Prend un troisième pion pour le cavalier donné sur c3 et casse la chaîne c3-d4 : le centre blanc perd son appui. Après Dxc3, les Noirs jouent Cbc6 et Fd7 ; les Blancs gardent l'attaque sur l'aile roi, mais les Noirs ont du matériel."
   }
  ],
  "erreurs": [
   {
    "san": "Qxe5",
    "pourquoi": "La dame prend un pion mais se place au centre : cxd4 l'attaque avec gain de temps, puis Ff4 la chasse encore. Les Blancs récupèrent d4 et développent leurs pièces gratuitement, les Noirs ont perdu deux temps."
   },
   {
    "san": "Qa5",
    "pourquoi": "La dame s'éloigne de la défense du roi pour attaquer c3, mais h4 puis Fg5 clouent le cavalier e7 et menacent le roi resté en e8. Les Noirs n'ont plus le temps de roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -60
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5 Bf4 O-O",
  "nom": "Défense française, variante Rubinstein",
  "sens": "Met le roi à l'abri avant d'ouvrir le jeu : les Noirs n'ont plus aucune pièce en prise au centre et peuvent ensuite développer l'aile dame tranquillement avec b6, Fb7 et De7 ou Cd5.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Développe la dame sur une case active : elle regarde e6 et prépare le grand roque (O-O-O) avec le fou f4 déjà sorti. Elle libère aussi d1 pour la tour. Les Noirs répondront b6 et Fb7, mais le roi blanc sera vite en sécurité."
   },
   {
    "san": "c3",
    "pourquoi": "Solidifie le centre : le pion c3 enlève la case b4 au fou noir et protège la dame si elle vient en d2 ou c2. Il laisse aux Noirs le temps de jouer Cd5, qui attaque le fou f4, mais Fg3 règle le problème."
   },
   {
    "san": "O-O",
    "pourquoi": "Le coup le plus simple : le roi blanc est à l'abri lui aussi, la tour f1 est prête à venir en e1 pour viser le pion e6. La position est équilibrée, chacun développe et la partie se jouera sur les plans."
   }
  ],
  "erreurs": [
   {
    "san": "Ne5",
    "pourquoi": "Le cavalier saute au centre mais il n'attaque rien de concret. Après b6, les Noirs préparent Fb7 ; si les Blancs jouent Df3 pour menacer f7 et b7, Dd5 bloque tout et attaque e5 et a2. Les Blancs perdent du temps et doivent se replier : mieux vaut d'abord finir le développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 27
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Nf5 dxc5 Bxc5 b4 Bb6 Bd3 O-O",
  "nom": "Défense française, variante d'avance, système avec ...Cge7-f5 et Fd3",
  "sens": "Met le roi à l'abri avant de régler le sort du cavalier f5. Si Fxf5 exf5, le pion f5 ouvre la colonne e et le fou d7 devient actif. Les Noirs gardent la pression sur e5 et préparent ...Dc7 ou ...f6.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Protège e5 une fois de plus et libère f1 pour le fou. Le pion e5 est le cœur de la position blanche : tant qu'il tient, les Noirs manquent d'air. La tour attendra aussi l'ouverture de la colonne e après un éventuel ...f6."
   },
   {
    "san": "a4",
    "pourquoi": "Gagne de l'espace à l'aile dame et menace a5, qui chasserait le fou b6 de sa belle diagonale. Les Noirs doivent répondre par ...a6 ou ...a5, ce qui fixe des cibles pour plus tard."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier en soutenant f3 et en gardant la case e4. Il n'y a rien à faire en a3 ou c3 : d2 est sa case naturelle d'où il ira peut-être en b3 ou f1."
   }
  ],
  "erreurs": [
   {
    "san": "Bb2",
    "pourquoi": "Le fou s'enferme derrière c3 et b4. Pire, il abandonne la case h4 : après ...Nh4, le cavalier échange le défenseur de e5 ou file en g6 pour attaquer le pion. Le fou c1 doit rester disponible pour prendre en f5 si besoin."
   },
   {
    "san": "Na3",
    "pourquoi": "Le cavalier part sur le bord, loin du centre, et ne défend rien. Après ...h6 puis Fxf5 exf5, les Noirs obtiennent la colonne e et un fou d7 très actif, tandis que le cavalier a3 reste à la touche."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 38
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 cxd4 Nxd4 Nc6 Nxc6 bxc6 Bd3 Qc7 Qe2 f5 c3 c5 O-O Ne7",
  "sens": "Développe le cavalier vers g6 pour attaquer le pion e5, tout en gardant f5 et d5. Les Noirs préparent aussi le petit roque.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en visant c5 : le pion c5 est attaqué, les Noirs doivent le défendre (…Dxe5 est impossible tant que e5 tient). Prépare aussi Cd2 et f4 pour solidifier e5. Laisse aux Noirs le temps de roquer."
   },
   {
    "san": "f4",
    "pourquoi": "Soutient e5 une fois pour toutes : le cavalier noir en g6 n'aura plus de cible. Fixe la structure et prépare g4 ou Fe3. Le roi blanc est un peu plus aéré, mais la colonne f sert à l'attaque."
   },
   {
    "san": "Re1",
    "pourquoi": "Défend e5 par la tour et libère f1 pour le fou ou le cavalier. Coup calme qui garde toutes les options : Cd2, f4 ou Fe3 selon la réponse noire."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -4
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2 Bd7 O-O Nc6 c3",
  "nom": "Variante Rubinstein",
  "sens": "consolide d4 avec un pion pour libérer la dame et le fou : le centre blanc ne dépend plus d'une pièce, et le fou d3 garde sa diagonale vers h7.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Le cavalier quitte c6 où il bloquait le pion c7. Il vise d5 ou g6, et la diagonale b7-d7 s'ouvre pour le fou. Les Noirs préparent le grand roque et la poussée c5 ou e5 avec un cavalier mieux placé."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Le fou d6 et la dame f6 protègent déjà h7 face au fou d3. Ensuite, Tfe8 ou e5 pour contester le centre."
   },
   {
    "san": "a6",
    "pourquoi": "Coup d'attente utile : il empêche Fb5 qui clouerait le cavalier c6 sur le roi, et prépare le grand roque sans que b4-b5 ne gêne."
   }
  ],
  "erreurs": [
   {
    "san": "b6",
    "pourquoi": "Affaiblit les cases c6 et a6 et laisse le roi au centre. Après Te1 puis Ce5, le cavalier blanc attaque c6 et d7 ; les Noirs doivent défendre au lieu de roquer."
   },
   {
    "san": "Qe7",
    "pourquoi": "La dame recule sans raison et bloque sa propre case e7. Les Blancs jouent b4 puis Te1 : ils gagnent de l'espace à l'aile dame et pressent sur e6 pendant que les Noirs perdent un temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -89
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 dxc5 Bxc5 Nd2 Qb6 Qe2 Qc7 Nb3 Bb6 f4 Ne7 Nf3 O-O Be3 Bxe3",
  "sens": "Échange le fou avant que Fxb6 ne force ...axb6 et n'abîme les pions noirs : après la reprise de la dame, e5 et f4 restent sans appui de pièce et les Noirs gardent une structure saine.",
  "menace": "Le fou e3 est en prise : s'il n'est pas repris, les Noirs gagnent une pièce entière.",
  "plan": [
   {
    "san": "Qxe3",
    "pourquoi": "Le seul coup : il reprend la pièce. La dame surveille e5 et c5, et les Blancs pourront ensuite roquer. La position reste à peu près égale, les Noirs ayant déjà un bon développement."
   }
  ],
  "erreurs": [
   {
    "san": "g3",
    "pourquoi": "Ne reprend pas : le fou e3 reste en prise. Après ...Db6 il est même cloué sur... rien, mais simplement imprenable à défendre : les Noirs restent avec une pièce de plus."
   },
   {
    "san": "Nbd4",
    "pourquoi": "Oublie le fou en prise. Les Noirs jouent ...Fxf4 et gagnent une pièce plus un pion ; de plus le pion e5 n'est plus protégé et tombe aussi."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4 Bg4 Be3 Nbd7 O-O",
  "nom": "Défense française, variante d'échange avec 4.c4 (pion isolé)",
  "sens": "Les Blancs ont mis le roi à l'abri et relié les tours. Le dernier coup ne menace rien : il termine le développement avant d'exploiter l'activité que donne le pion isolé d4.",
  "plan": [
   {
    "san": "Nb6",
    "pourquoi": "Attaque le fou c4 avec gain de temps et prend le contrôle de d5, la case devant le pion isolé. Le fou recule en b3 ou e2, mais le cavalier s'installe durablement et pourra sauter en d5."
   },
   {
    "san": "Bh5",
    "pourquoi": "Anticipe h3 sans se laisser chasser : le fou reste cloué sur la diagonale et pourra revenir en g6 pour viser c2 et le roque blanc."
   },
   {
    "san": "c6",
    "pourquoi": "Solidifie d5 et la case b5, enlève toute entrée au cavalier c3. Coup calme qui garde le fou b4 et prépare …Dc7 ou …Te8."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 3
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ngf3 Qb6 O-O cxd4 cxd4 a5 Re1 Be7",
  "nom": "Tarrasch, système fermé (ligne 3...Cf6 avec ...a5)",
  "sens": "développe la dernière pièce mineure et prépare le petit roque : le fou garde g5 et h4, ce qui freine un Fg5 ou un cavalier blanc vers h5. Ensuite O-O, puis ...f6 pour attaquer e5 ou ...a4 pour gêner la dame et les cavaliers blancs.",
  "menace": "...Cxd4 : après Cxd4 Dxd4 les Noirs gagnent le pion d4, car le pion a5 a enlevé aux Blancs le coup de pression Cb3 et le tour en e1 ne protège plus rien sur d4.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "petit coup utile qui ôte la case g4 aux pièces noires (cavalier après ...f6, fou après ...Fd7) et donne de l'air au roi. Les Blancs peuvent alors répondre à ...Cxd4 par Cxd4 Dxd4 Cf3 avec tempo sur la dame, puis Fb5 ou Dc2 : le pion revient avec une forte initiative. Les Noirs roqueront et joueront ...f6."
   },
   {
    "san": "Nb1",
    "pourquoi": "recule pour mieux sauter : le cavalier va en c3, où il défend d4 une fois pour toutes et attaque d5. Cela libère aussi la diagonale c1-h6 pour le fou. Les Noirs répondent O-O ou ...a4 pour fixer le cavalier."
   },
   {
    "san": "a4",
    "pourquoi": "bloque le pion a5 avant qu'il n'avance en a4, et prépare Cb3 ou Fb5 sans être chassé. Le cavalier d2 peut ensuite aller en f1 et g3 tranquillement. Les Noirs obtiennent la case b4, mais rien de concret tout de suite."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "un coup d'attaque qui oublie le centre : ...Cxd4 Cxd4 Dxd4 et le pion d4 est perdu pour rien, car la dame noire prend ensuite h4 ou revient en b6 sans danger. Avant d'attaquer sur l'aile, il faut d'abord défendre d4."
   },
   {
    "san": "b4",
    "pourquoi": "veut chasser le pion a5, mais ouvre tout : ...Cxd4 bxa5 Cxf3+ et les Noirs gagnent une pièce contre un pion, car le cavalier d2 est cloué par la dame b6 sur la recapture. Ne jamais pousser b4 tant que d4 est attaqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 46
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 f6 Bb5 a6 Bxc6+ bxc6 Be3 Ne7 Nc3 Nf5 Qd3 a5 O-O-O a4",
  "sens": "pousse le pion vers le roque adverse : fixe a2, prépare ...a3 pour ouvrir la colonne b et libère a5 pour la dame. Les Blancs doivent réagir sur l'aile dame.",
  "menace": "...a3 suivi de ...axb2+ ou ...Fb4, ouvrant les lignes devant le roi blanc.",
  "plan": [
   {
    "san": "a3",
    "pourquoi": "bloque le pion noir avant qu'il n'arrive en a3 : la colonne b reste fermée et le roi blanc respire. Les Blancs pourront ensuite jouer g4 pour chasser le cavalier f5."
   },
   {
    "san": "g4",
    "pourquoi": "chasse le cavalier f5, bien placé contre e3 et d4. Après ...Cxe3 Dxe3, les Blancs reprennent et gardent le centre ; sinon le cavalier recule et le pion g4 lance l'attaque à l'aile roi."
   },
   {
    "san": "Bf4",
    "pourquoi": "retire le fou de la fourche possible ...Cxe3 et tient e5. Le centre reste solide, mais a4 n'est pas encore stoppé : il faudra jouer a3 ensuite."
   }
  ],
  "erreurs": [
   {
    "san": "Qd2",
    "pourquoi": "ne répond pas au pion. Après ...a3, b3 est forcé et ...Fb4 cloue le cavalier c3 : le roi blanc est pris sous le feu et les Noirs gagnent du temps."
   },
   {
    "san": "h3",
    "pourquoi": "coup lent sur la mauvaise aile. Les Noirs jouent ...a3, b3 ...Fb4 : les lignes s'ouvrent devant le roi blanc pendant que h3 n'a rien préparé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 68
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6 Re1 Be7 Nbxd4",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 Dxd5",
  "sens": "Reprend le pion d4 avec le cavalier qui était le plus mal placé, en gardant celui de f3 devant le roi. Depuis d4, le cavalier vise c6 et e6 ; si les Noirs échangent en d4, la dame blanche reprend et s'aligne face à la dame noire sur la colonne d.",
  "menace": "Cxc6 suivi de Dxd6 : le cavalier prend en c6 avec attaque sur la dame noire, et la dame noire, clouée face à la tour e1 après ...Dxd1, perd un temps ou des pièces. Toute réponse qui n'y répond pas perd gros.",
  "plan": [
   {
    "san": "Nxd4",
    "pourquoi": "Enlève tout de suite le cavalier gênant. Après Dxd4, les dames se regardent sur la colonne d, mais la dame noire est protégée et les Noirs roquent ensuite tranquillement. Le jeu est simple et le roi noir sera vite en sécurité."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Si Cxc6 bxc6, les Noirs reprennent avec le pion : la structure est abîmée mais la dame d6 reste bien défendue et les pièces noires sont prêtes à jouer. Un coup sûr quand on ne veut pas calculer."
   },
   {
    "san": "Bd7",
    "pourquoi": "Développe le fou et protège c6 une fois de plus. Le cavalier d4 ne peut plus rien prendre avec gain. Les Noirs roqueront au coup suivant, mais ils laissent les Blancs choisir le moment de l'échange en c6."
   }
  ],
  "erreurs": [
   {
    "san": "h6",
    "pourquoi": "Coup de prudence hors sujet : il ne répond pas à la menace. Après Cxc6, la dame noire est attaquée et doit se défendre ; si ...Dxd1 Txd1, les Blancs ont gagné une pièce et restent avec une tour active sur la colonne d. Les Noirs perdent au moins un pion net."
   },
   {
    "san": "Qd8",
    "pourquoi": "Recule la dame sans voir le problème : Cxc6 attaque encore la dame et casse la structure noire. Après ...Dxd1 Txd1 bxc6, les Blancs ont une tour sur la colonne ouverte, un pion c6 faible à attaquer, et les Noirs n'ont pas roqué. Reculer au lieu d'échanger coûte une bonne partie de l'avantage."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -16
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O Be7 dxc5 Nxc5",
  "nom": "Défense française, variante Tarrasch, 3...c5 avec 4.exd5 exd5 (ligne d'échange simplifiée)",
  "sens": "Récupère le pion c5 avec le cavalier d7, qui gagne une belle case centrale : il vise e4 et surveille d5. Le fou e7 reste prêt au roque. Les Noirs acceptent un pion d5 isolé en échange de pièces actives.",
  "menace": "Aucune menace immédiate : les Noirs comptent simplement roquer, puis mettre le pion d5 à l'abri et poster un cavalier en e4.",
  "plan": [
   {
    "san": "Nb3",
    "pourquoi": "Propose l'échange du cavalier c5, la pièce la plus active des Noirs. Si les Noirs échangent, les Blancs gardent une structure saine face au pion d5 isolé. Le cavalier b3 libère aussi la case d2 et la diagonale du fou c1. Après, les Blancs joueront Nbd4 ou Nfd4 pour bloquer d5."
   },
   {
    "san": "c3",
    "pourquoi": "Solidifie le centre : contrôle d4 et b4, retire la case d4 aux pièces noires. Le pion c3 donnera une base solide au cavalier qui ira en d4 plus tard. Le fou c1 reste à développer, mais la structure est sûre."
   },
   {
    "san": "Re1",
    "pourquoi": "Met la tour sur la colonne ouverte e avant que les Noirs ne roquent. Elle surveille e4, la case rêvée du cavalier noir, et prépare parfois Ne5. Les Noirs ne peuvent pas s'en inquiéter, mais la tour sera prête pour la lutte sur cette colonne."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 28
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 c4 Nf6 c5 Be7 Bd3 O-O O-O b6 Be3 bxc5 dxc5 Ng4",
  "sens": "Harcèle le fou e3, seul gardien du pion c5. Si le fou va en d4, ...Bf6 propose l'échange et le pion c5 perd son soutien ; si les Blancs ne bougent pas, ...Nxe3 fxe3 leur laisse des pions doublés. Le cavalier devra toutefois reculer ensuite après h3 : les Blancs gagneront un temps.",
  "menace": "...Nxe3 fxe3 : abîmer la structure blanche avec des pions doublés sur la colonne e.",
  "plan": [
   {
    "san": "Bf4",
    "pourquoi": "Le fou s'écarte en restant actif : il contrôle la diagonale b8-h2 et empêche le cavalier noir de s'installer en e5. Le pion c5 est provisoirement laissé à lui-même, mais ...Bxc5 se heurterait à Bxh7+ puis Qxd5 ou Qc2. Les Blancs gardent une structure saine et pourront chasser le cavalier par h3."
   },
   {
    "san": "Qc2",
    "pourquoi": "Défend indirectement : si ...Nxe3 fxe3, la dame protège c5 et vise h7 avec le fou d3. Elle quitte aussi la colonne d, où le pion d5 pourrait avancer avec gain de temps."
   },
   {
    "san": "Bd2",
    "pourquoi": "Recul modeste mais solide : le fou reste protégé, la structure de pions est intacte, et les Blancs joueront h3 pour renvoyer le cavalier. Le pion c5 est laissé un peu faible, mais il se défendra par Nc3 ou Qc2."
   }
  ],
  "erreurs": [
   {
    "san": "Bd4",
    "pourquoi": "Semble naturel pour soutenir c5, mais c'est précisément ce que les Noirs attendent : ...Nc6 attaque le fou, puis après h3 ...Nxd4 échange le défenseur de c5. Le pion c5 devient une cible et les Blancs n'ont rien gagné."
   },
   {
    "san": "Nc3",
    "pourquoi": "Développer le cavalier paraît logique, mais il ignore la menace : ...Nxe3 fxe3 laisse les Blancs avec des pions e doublés et un roi affaibli, sans compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 28
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6 O-O Bd6",
  "nom": "Tarrasch, variante 3...Cf6 avec 5.Fd3 c5 et 8...f6",
  "sens": "Place le fou sur la diagonale qui vise h2 et surveille f4 : les Blancs ne peuvent plus échanger ce fou par Ff4. Il prépare le petit roque puis la poussée ...e5, qui ouvrirait le centre et libérerait le fou de c8, encore enfermé derrière le pion e6.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe le dernier cavalier et contrôle e5 : la poussée ...e5 devient difficile tant que d4 et e5 sont bien tenus. Le cavalier regarde aussi g5, d'où il pourrait viser e6, le point faible des Noirs. Il laisse aux Noirs ...O-O et ...Dc7, mais les Blancs gardent une petite avance d'espace."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il enlève la case g4 au cavalier f6 et au fou c8, et prépare tranquillement Cf3 sans craindre ...Fg4 qui clouerait le cavalier. Il ne prend pas d'initiative, mais il ne concède rien non plus."
   },
   {
    "san": "Bc2",
    "pourquoi": "Retire le fou de la colonne d avant que ...e5 ne l'attaque après dxe5 et garde la diagonale vers h7, cible classique contre le roi noir roqué. Il prépare Db3 ou Dd3 pour créer la batterie dame-fou. Il laisse aux Noirs le temps de roquer et de jouer ...Dc7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 34
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 Be7 dxc5 Bxc5 Qd2 Qb6 Bxc5 Nxc5",
  "nom": "Défense française, variante Steinitz, ligne Boleslavsky (7.Fe3)",
  "sens": "Reprend la pièce en plaçant le cavalier sur c5, une case solide qu'aucun pion ne peut attaquer : il vise d3, e4 et b3. La dame reste en b6 et regarde le pion b2, désormais sans défenseur.",
  "menace": "...Dxb2 : le pion b2 n'est plus défendu, les Noirs le gagnent si les Blancs ne réagissent pas.",
  "plan": [
   {
    "san": "O-O-O",
    "pourquoi": "Met le roi à l'abri en c1, d'où il protège b2 : la menace ...Dxb2 disparaît d'un seul coup. La tour arrive sur la colonne d, en face de la dame et du pion d5. Les Blancs peuvent ensuite jouer Cd4 ou Fd3. Les Noirs roqueront et joueront ...f6, mais le centre blanc tient."
   },
   {
    "san": "Nd4",
    "pourquoi": "Centralise le cavalier : il bouche la diagonale de la dame noire vers b2 via la case... non, il ne défend pas b2, mais il menace Cxc6 pour abîmer les pions noirs, et Fb5 devient fort. Si ...Dxb2 ? Tb1 et Cxc6 : les Noirs ont de gros problèmes. Prépare aussi le grand roque."
   },
   {
    "san": "Be2",
    "pourquoi": "Développe le fou simplement, sans se placer sur une case attaquable, et permet le petit comme le grand roque. Sur ...Dxb2, Tb1 Da3 puis Tb3 chasse la dame avec gain de temps. Laisse aux Noirs le temps de roquer et de préparer ...f6."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Oublie le pion b2 : ...Dxb2 le prend gratuitement. Après Tb1 Da3, la dame noire est en sécurité et les Blancs ont perdu un pion pour rien, tout en ayant affaibli leur aile roi."
   },
   {
    "san": "Bb5",
    "pourquoi": "Semble actif, mais le fou n'attaque rien de vraiment utile : après ...O-O et ...Fd7, il doit se justifier, et b2 reste faible. Les Blancs perdent du temps au lieu de régler le problème de b2 par le grand roque."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 39
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5 Qd2 Nc6 dxc5 Nxc5",
  "nom": "Défense française, variante classique (ligne 7.f4 avec échange des fous)",
  "sens": "Reprend le pion en activant le cavalier : depuis c5 il vise e4 et d3, libère la case d7 pour le fou et laisse la dame en e7 prête à soutenir ...f6 contre le pion e5.",
  "plan": [
   {
    "san": "Qe3",
    "pourquoi": "La dame va en e3 pour attaquer le cavalier c5, protéger f4 et garder d4 sous contrôle. Elle libère aussi la case d2 et prépare le grand roque. Les Noirs répondront ...b6 ou ...f6, mais les Blancs gardent le centre bien tenu."
   },
   {
    "san": "O-O-O",
    "pourquoi": "Met le roi à l'abri et place la tour sur la colonne d, en face du pion d5. Les Blancs pourront ensuite jouer Fd3 ou Cd4. En échange, le roi blanc deviendra la cible des pions noirs (...b5, ...a5), il faut donc jouer vite au centre."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers la case active d3, en direction de h7, et surveille e4. Le fou peut être échangé par ...Cxd3+, ce qui est acceptable : les Blancs reprennent avec la dame et gardent un jeu solide."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "La dame quitte d2 et abandonne la case d4. Après ...b5 ! les Noirs gagnent du temps : ...b4 chasse le cavalier c3, et la dame doit encore se replacer. Les Blancs perdent deux temps et le contrôle du centre."
   },
   {
    "san": "a4",
    "pourquoi": "Coup trop lent qui affaiblit la case b4. Après ...f5 ! le pion e5 est fixé, les Noirs ont stabilisé leur centre et jouent ensuite ...Fd7 et ...Tc8 ; les Blancs n'ont gagné aucun développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 23
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5 Bf4 O-O Qe2",
  "nom": "Défense française, variante Rubinstein (4...Cd7)",
  "sens": "Prépare le grand roque : avec le fou f4 déjà sorti, la dame quitte la colonne d pour laisser passer la tour en d1. Elle surveille aussi e6 et e5, d'où un cavalier blanc pourra venir s'installer.",
  "plan": [
   {
    "san": "Nd5",
    "pourquoi": "Le cavalier attaque le fou f4 et saute au centre, à l'abri de tout pion. Le fou doit reculer (Fg3 ou Fd2), ce qui fait perdre un temps aux Blancs. Ensuite les Noirs jouent ...Db6 ou ...f5 pour gêner le roi blanc avant qu'il ne roque. Les Blancs garderont un développement facile, mais sans attaque directe."
   },
   {
    "san": "Qb6",
    "pourquoi": "La dame vise à la fois b2 et f2. Si les Blancs roquent grand tout de suite, le pion b2 tombe avec échec sur la diagonale a7-g1. Les Blancs doivent donc dépenser un coup (c3, Fe3 ou Ce5) et leur plan O-O-O se complique. Attention : la dame en b6 peut ensuite être harcelée par Fe3."
   },
   {
    "san": "Qa5+",
    "pourquoi": "L'échec oblige les Blancs à boucher avec c3 ou Fd2. Avec c3, la case d3 et la diagonale du fou sont affaiblies et le fou f4 n'est plus protégé par la dame ; avec Fd2, le fou f4 quitte sa belle diagonale et la dame noire peut revenir en c7 ou b6. Dans les deux cas le grand roque blanc est retardé."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Reculer le fou en e7 paraît prudent, mais c'est une perte de temps : le fou était très bien en c5, où il tenait la diagonale vers f2. Les Blancs roquent grand, jouent Ce5 et occupent le centre, et les Noirs n'ont plus rien à montrer sur les cases noires."
   },
   {
    "san": "a5",
    "pourquoi": "Ce coup ne développe rien et affaiblit b5 et b6. Les Blancs roquent grand puis jouent Fg5 : le cavalier f6 est cloué sur la dame, et les Noirs doivent se tordre pour le défendre. Il faut d'abord sortir ses pièces ou attaquer le fou f4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -17
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ Qxf6 Nf3 h6 Bd3 Bd6 Qe2 Bd7 O-O Nc6 c3 Ne7",
  "nom": "Variante Rubinstein",
  "sens": "Libère le pion c7 et replace le cavalier : il vise d5 ou g6, ouvre la diagonale au fou d7 et prépare le grand roque puis la poussée c5 ou e5.",
  "plan": [
   {
    "san": "Bd2",
    "pourquoi": "Développe la dernière pièce mineure et relie les tours. Le fou protège c3 et surveille la case b4. Les Blancs préparent Tad1 ou Tae1 pour appuyer d4 et e-colonne avant que les Noirs ne poussent c5 ou e5."
   },
   {
    "san": "Ne5",
    "pourquoi": "Occupe la case centrale avec un cavalier solide, défendu par le pion d4. Il regarde d7 et g6 et gêne le développement noir : si ...Fxe5, dxe5 et la dame doit bouger. Les Blancs gardent plus d'espace."
   },
   {
    "san": "a4",
    "pourquoi": "Gagne de l'espace à l'aile dame et prépare a5 pour fixer les pions noirs. Utile si les Noirs roquent long : on attaque là où ira leur roi. Laisse aux Noirs le temps de jouer ...c5, mais la position reste calme."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 90
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2 Nbc6",
  "nom": "Défense française, variante Winawer, pion empoisonné",
  "sens": "Développe en attaquant e5 une deuxième fois : le pion n'est plus défendu depuis que la dame blanche est partie en h7. Le cavalier protège aussi d4, qui gêne la case c3 et bloque le centre blanc. Les Noirs veulent Fd7 puis grand roque pour cacher le roi à l'aile dame.",
  "menace": "...Cxe5 gagne le pion central ; ...dxc3 est aussi dans l'air.",
  "plan": [
   {
    "san": "f4",
    "pourquoi": "Défend e5 avec un pion, solidement. C'est le coup principal : le centre tient, la dame blanche peut revenir par h4 ou d3, et les Blancs gardent leur pion de plus. Les Noirs jouent Fd7 puis O-O-O et l'attaque sur l'aile dame commence."
   },
   {
    "san": "h4",
    "pourquoi": "Avance le pion h passé tout de suite : il peut courir jusqu'à h6 et h7 avec la dame derrière. Ne défend pas e5 directement, mais après ...Cxe5 les Blancs reprennent du jeu avec Dd3 ou Ff4. Risqué pour un débutant : le roi blanc reste au centre."
   },
   {
    "san": "Rb1",
    "pourquoi": "Met la tour sur la colonne b ouverte avant que le roi noir n'y arrive. Elle vise b7 et gênera le grand roque. Laisse e5 en prise, donc à ne jouer que si on accepte ...Cxe5 contre une attaque sur b7."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Semble gagner un pion, mais ...Cxd4 arrive avec tempo : le cavalier menace ...Cf5 et surtout e5 reste sans défense. Les Blancs rendent tout l'avantage et ouvrent le centre contre leur propre roi."
   },
   {
    "san": "h3",
    "pourquoi": "Coup lent qui ne répond pas à la menace. ...Cxe5 prend simplement le pion, puis le cavalier saute sur f3 ou g4 avec échec ou attaque sur le roi blanc, encore au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 66
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nc3 Bb4 Nf3 O-O Be2 dxc4 Bxc4 Bg4 Be3 Nbd7 O-O Nb6",
  "sens": "chasse le fou c4 et vise la case d5, juste devant le pion isolé en d4 : un cavalier posé là bloquera le pion pour longtemps",
  "menace": "Cxc4 gagne le fou contre le cavalier et abîme la structure blanche ; après Fxc3, le pion d4 reste isolé et faible",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "sauve le fou sans perdre de temps : il reste sur la diagonale a2-g8 et surveille f7 et d5. Le cavalier noir ira quand même en d5, mais le fou le gêne et appuie un futur d4-d5."
   },
   {
    "san": "Be2",
    "pourquoi": "recule et neutralise le fou g4 : si Fxf3, Fxf3 reprend sans casser les pions. Plus passif que Fb3, mais très solide."
   },
   {
    "san": "Bd3",
    "pourquoi": "garde le fou tourné vers l'aile roi (h7) pour une attaque future. Il bloque toutefois la dame et laisse d5 un peu plus libre pour les Noirs."
   }
  ],
  "erreurs": [
   {
    "san": "a3",
    "pourquoi": "chasse le fou b4 mais oublie c4. Les Noirs jouent Fxf3 puis Fxc3 : Dxf3 est forcée, et après Fxc3 bxc3 le fou c4 tombe sur Cxc4. Une pièce de perdue."
   },
   {
    "san": "h3",
    "pourquoi": "même oubli : Fxf3 Dxf3 puis Cxc4 prend le fou laissé en l'air. Avant de chasser une pièce, on met les siennes en sécurité."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -8
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O Be7 dxc5 Nxc5 Nb3",
  "nom": "Variante Tarrasch, ligne d'échange 3...c5 avec 6.Fb5+",
  "sens": "Propose l'échange du cavalier c5, la pièce noire la plus active, pour garder une structure saine face au pion d5 isolé. Le cavalier quitte d2 et ouvre la diagonale du fou c1, en visant la case d4 pour bloquer le pion isolé.",
  "plan": [
   {
    "san": "Nce4",
    "pourquoi": "Refuse l'échange et saute au centre : le cavalier e4 est protégé par d5 et gêne le développement blanc. Si les Blancs le chassent, il reviendra sur une bonne case. Les Noirs gardent leur pièce active au lieu de la troquer."
   },
   {
    "san": "Ncd7",
    "pourquoi": "Recule sans échanger et garde le cavalier pour l'activer plus tard via b6 ou f6-e4. Les Noirs conservent toutes leurs pièces pour compenser le pion d5 isolé par de l'activité. Les Blancs pourront installer un cavalier en d4."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri sans se soucier de l'échange en b3 : si les Blancs prennent en c5, Fxc5 développe le fou avec tempo. Simple et sain pour un débutant."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -6
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6 Re1 Be7 Nbxd4 Nxd4",
  "nom": "Défense française, variante Tarrasch, 3...c5 avec 4...Dxd5",
  "sens": "Échange le cavalier central qui gênait : les Noirs simplifient pour roquer sans histoire. Après la reprise, les dames se font face sur la colonne d, mais Dd6 est protégée par le fou e7.",
  "menace": "Un cavalier blanc est en prise sur d4 : il faut reprendre tout de suite, sinon les Noirs gagnent une pièce.",
  "plan": [
   {
    "san": "Qxd4",
    "pourquoi": "Reprend la pièce en centralisant la dame. Les dames se regardent, mais Dd6 est couverte par le fou e7, donc pas de gain immédiat. Les Blancs gardent une petite avance de développement ; les Noirs vont roquer et jouer ...a6 ou ...Fd7 pour se libérer."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Reprend avec le cavalier, qui s'installe au centre et évite tout échange de dames. Le cavalier d4 vise b5 et f5 ; les Blancs peuvent continuer par Fb3, Fg5 ou Df3 contre le roi noir."
   }
  ],
  "erreurs": [
   {
    "san": "Be3",
    "pourquoi": "Oublie que le cavalier d4 est en prise ! Après ...Cxf3+ ou ...Cc6, les Blancs ont simplement perdu une pièce entière : avant toute idée de développement, on reprend ce qu'on peut reprendre."
   },
   {
    "san": "Ne5",
    "pourquoi": "Semble actif, mais laisse le cavalier d4 en vie. Après ...Cc6, même l'échange de dames Dxd6 Fxd6 ne change rien : les Noirs ont une pièce de plus et la partie est perdue."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 14
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5 Bf4 O-O Qe2 Nd5",
  "nom": "Variante Rubinstein (Défense française)",
  "sens": "Attaque le fou f4 depuis une case centrale qu'aucun pion blanc ne peut chasser : les Blancs doivent déplacer le fou avant de roquer, ce qui leur coûte un temps.",
  "menace": "...Cxf4 : gagner le fou f4 contre le cavalier, ou obliger le fou à bouger.",
  "plan": [
   {
    "san": "Be5",
    "pourquoi": "Le fou recule sur une case active où il reste au centre et ne gêne personne. Il vise g7 et b8, et il ne peut pas être pris par le cavalier. Ensuite les Blancs roquent (O-O ou O-O-O) et jouent c3 pour contrôler d4 et b4. Les Noirs n'ont rien gagné : ils ont seulement forcé le fou à bouger."
   },
   {
    "san": "Bd2",
    "pourquoi": "Le fou se range tranquillement derrière les pions. Il protège c3 et garde une diagonale vers a5 et b4, utile contre ...Fb4 ou ...Da5. Les Blancs roquent ensuite et jouent c4 pour chasser le cavalier d5. Coup solide mais passif : le fou ne menace rien."
   },
   {
    "san": "Bg3",
    "pourquoi": "Le fou reste sur la diagonale h2-b8 et garde l'oeil sur c7 et d6. Le roque court suivra. Attention : le fou en g3 est un peu éloigné et peut être échangé par ...Ch4 ou ...f5-f4 plus tard."
   }
  ],
  "erreurs": [
   {
    "san": "Bxh7+",
    "pourquoi": "Sacrifice tentant mais faux : après ...Rxh7, le fou f4 est toujours attaqué et il n'y a aucune suite d'attaque (la dame ne peut pas arriver sur h5 avec échec). Les Blancs ont donné une pièce pour un pion et perdent aussi le fou f4 ou doivent le reculer. Pièce perdue."
   },
   {
    "san": "O-O-O",
    "pourquoi": "Roquer sans régler le fou attaqué : ...Cxf4 gagne simplement le fou f4. Avant de roquer, il faut toujours vérifier qu'aucune pièce n'est en prise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nf6 Bb5+ Bd7 Bxd7+ Nbxd7 O-O Be7 dxc5 Nxc5 Nb3 Nce4",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 4.exd5 exd5 (pion isolé d5)",
  "sens": "Garde le cavalier plutôt que de l'échanger en b3 : la pièce saute au centre, où le pion d5 la soutient, et elle vise f2 et d2 tout en gênant le développement de la dame et du fou c1 des Blancs.",
  "plan": [
   {
    "san": "Be3",
    "pourquoi": "Développe le dernier fou et le place sur une diagonale solide qui surveille d4 et a7. Il ne craint rien du cavalier e4 et prépare Cfd4 ou c3 selon la réponse noire. Les Noirs vont roquer et jouer Tc8 ou Dd6 ; la partie reste calme."
   },
   {
    "san": "Re1",
    "pourquoi": "Met la tour sur la colonne ouverte, en face du cavalier e4. Le cavalier n'est plus si confortable : s'il bouge, la tour fixe la case e7. Les Noirs doivent soutenir avec f5 (affaiblit le roi) ou reculer."
   },
   {
    "san": "c3",
    "pourquoi": "Consolide la case d4 et prépare Cbd4 ou Cfd4. Le pion c3 ferme aussi la diagonale au fou e7 et enlève b4 et d4 aux cavaliers noirs. Coup simple, mais il laisse l'initiative aux Noirs qui roquent tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 14
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3",
  "nom": "Tarrasch, variante Euwe-Keres (3...c5 4.Cgf3)",
  "sens": "sort le second cavalier en gardant toutes les tensions (e4-d5, d4-c5) : il protège d4, prépare le petit roque et évite de dévoiler ses intentions au centre.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Attaque d4 une deuxième fois et développe une pièce. Les Blancs devront choisir : exd5 (puis Fb5 pour clouer) ou c3. Le cavalier sera prêt pour une pression durable sur d4."
   },
   {
    "san": "cxd4",
    "pourquoi": "Lève la tension tout de suite : après Cxd4, le fou c8 n'est plus bloqué par le pion e6 si l'on joue ...Cf6 et ...Fd6. On abandonne le pion c5 mais les Noirs gagnent un centre plus souple."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe en attaquant e4 : les Blancs doivent réagir (e5 ou exd5). Le cavalier ira souvent en d7 ou b6 si e5 vient, pour attaquer d4 de nouveau."
   }
  ],
  "erreurs": [
   {
    "san": "dxe4",
    "pourquoi": "Ouvre la position alors que les Noirs sont moins développés : après Cxe4 cxd4 Dxd4, la dame blanche trône au centre sans être chassée, les pièces blanches sont déjà actives et les Noirs n'ont aucun gain."
   },
   {
    "san": "Qb6",
    "pourquoi": "Sort la dame trop tôt pour viser d4 et b2. Les Blancs répondent exd5 exd5 c4 : la dame est harcelée, le pion d5 devient une cible et les Blancs gagnent du temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -10
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6",
  "nom": "Tarrasch, variante 3...c5 (ligne principale)",
  "sens": "ajoute une deuxième attaque sur d4 tout en développant : le cavalier vise la case centrale et prépare ...cxd4 pour isoler ou gagner le pion.",
  "menace": "...cxd4 suivi de ...Cxd4 : d4 est attaqué deux fois (pion c5, cavalier c6) et défendu deux fois seulement si rien ne bouge, donc les Blancs doivent réagir tout de suite.",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Échange au centre : après ...exd5, les Noirs auront un pion isolé sur d5. Le coup prépare Fb5 pour clouer le cavalier c6 sur le roi et augmenter la pression sur d5 et c5."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient d4 avec un pion, de façon solide. Le centre e4-d4 tient, mais le cavalier d2 reste un peu enfermé : les Noirs peuvent jouer ...cxd4 et ...Fd6 avec un jeu libre."
   },
   {
    "san": "Bb5",
    "pourquoi": "Développe en clouant le cavalier c6 sur le roi : il ne peut plus prendre en d4. Les Blancs gardent l'option exd5 ensuite ; les Noirs répondent souvent ...dxe4 puis ...cxd4 pour simplifier."
   }
  ],
  "erreurs": [
   {
    "san": "a3",
    "pourquoi": "Coup de pion inutile qui ne défend rien. Les Noirs jouent ...dxe4 Cxe4 cxd4 : le centre blanc disparaît et les Blancs ont perdu un temps."
   },
   {
    "san": "h3",
    "pourquoi": "Ne répond pas à la menace sur d4. Les Noirs prennent ...Cxd4 : si exd5 alors ...Dxd5 et le pion est perdu pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 28
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5",
  "nom": "Défense française, variante Tarrasch, 3...c5 (ligne principale avec pion isolé)",
  "sens": "Échange le pion e4 contre d5 pour fixer les Noirs avec un pion isolé après la reprise, et ouvre la diagonale a4-e8 : le fou f1 va venir en b5 clouer le cavalier c6 sur le roi.",
  "menace": "Le pion d5 attaque le cavalier c6 et le pion e6 : il faut reprendre tout de suite, sinon dxc6 gagne une pièce ou abîme la structure.",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Reprend sans perdre de temps et ouvre la colonne e au fou c8. Le pion d5 devient isolé, mais il tient le centre, donne de l'espace et des cases actives (e4, c4) aux pièces noires. C'est la suite classique : les Noirs acceptent l'isolé contre un jeu de pièces facile."
   },
   {
    "san": "Qxd5",
    "pourquoi": "Évite le pion isolé en reprenant de la dame. Mais la dame sort tôt : les Blancs gagnent du temps avec Fc4 ou Cb3 en l'attaquant, et développent plus vite. Jouable, mais demande plus de précision."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Ignore l'attaque sur c6. Après dxc6 bxc6, les Noirs ont des pions doublés et isolés sur la colonne c, un roi sans abri et un pion d4 qui va tomber. Toujours répondre à une menace sur une pièce avant de capturer ailleurs."
   },
   {
    "san": "Nxd4",
    "pourquoi": "Semble rendre coup pour coup, mais après Cxd4 cxd4 Fb5+ le roi noir est en échec, le pion d5 gagne une pièce ou se fait reprendre avec gros avantage. Le cavalier c6 doit rester en place pour que la reprise exd5 soit possible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -33
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5",
  "nom": "Tarrasch, variante ouverte (3...c5 4.Cgf3 Cc6 5.exd5 exd5)",
  "sens": "Reprend le pion avec le pion pour garder un centre solide et ouvrir la diagonale du fou c8. Les Noirs acceptent un futur pion d5 isolé en échange de pièces actives et d'un développement rapide.",
  "menace": "Pousser ...c4 ou ...cxd4 pour gagner de l'espace et fixer le centre ; après ...Fd6 et ...Cf6, les Noirs seront bien développés.",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "Cloue le cavalier c6 qui défend d5 et prépare le petit roque. Il met la pression sur le centre noir : si les Noirs répondent ...Fd6, dxc5 gagne du temps, et 0-0 suit vite."
   },
   {
    "san": "dxc5",
    "pourquoi": "Prend le pion c5 pour isoler d5 tout de suite. Les Noirs reprendront avec le fou (...Fxc5) et joueront vite, mais le pion d5 sera une cible durable pour les cavaliers blancs (b3, d4)."
   },
   {
    "san": "Qe2+",
    "pourquoi": "Donne échec pour gêner le développement : si ...Fe7, la dame blanche ne perd rien et Fe3 ou dxc5 suit ; si ...Fe6, le pion d5 perd un défenseur et c4 devient fort."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Le fou semble actif, mais ...c4 le chasse aussitôt (il doit revenir en e2) : les Blancs perdent un temps et les Noirs gagnent de l'espace sur l'aile dame."
   },
   {
    "san": "b3",
    "pourquoi": "Trop lent : ...cxd4 ouvre le centre, et après Fb2 les Noirs jouent ...Fc5 en gardant le pion d4 ; le centre blanc est démoli et les pièces blanches sont en retard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 25
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5",
  "nom": "Variante Tarrasch, ligne ouverte 3...c5",
  "sens": "cloue le cavalier c6 sur le roi pour affaiblir la défense du pion d5 et prépare le petit roque ; la pression sur c5 et d5 veut forcer les Noirs à se décider au centre",
  "menace": "aucune menace immédiate, mais dxc5 suivi de 0-0 et Te1 vient vite si les Noirs tardent à se développer",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "développe le fou sur sa meilleure diagonale, vers h2, et prépare ...Cge7 puis le roque. Si dxc5 Fxc5, le fou reste actif et les Noirs ont un bon jeu de pièces en échange du pion d5 isolé."
   },
   {
    "san": "Qe7+",
    "pourquoi": "l'échec oblige les Blancs à choisir : De2 propose l'échange des dames, et après ...Dxe2+ Rxe2 le roi blanc perd le droit de roquer. Les Noirs gagnent du temps pour ...Cf6 et ...Fe6 sans subir d'attaque."
   },
   {
    "san": "c4",
    "pourquoi": "ferme le centre et prive le cavalier d2 de la case c4. Les Noirs gagnent de l'espace à l'aile dame et pourront jouer ...Fd6 et ...Cge7 tranquillement, mais le pion d4 des Blancs devient solide."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "le fou est passif sur e7 et ne regarde plus h2. Après 0-0 Fe6 Te1, la colonne e est ouverte sur le roi noir : les Noirs ont du mal à roquer et le pion d5 reste faible."
   },
   {
    "san": "Bd7",
    "pourquoi": "le fou est mal placé : il bloque la dame et ne défend pas d5. Après 0-0 cxd4 Te1+, le roi noir est pris sur la colonne e et les Blancs reprennent d4 avec une forte initiative."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -26
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6",
  "nom": "Défense française, variante Tarrasch, ligne ouverte 3...c5",
  "sens": "sort le fou sur sa diagonale la plus active, pointée vers h2, et prépare ...Cge7 suivi du roque ; le fou garde aussi un oeil sur c5, prêt à reprendre si les Blancs prennent",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "prend le pion et force ...Fxc5 : le fou noir quitte la diagonale d6-h2 et le pion d5 devient isolé, une cible durable pour les pièces blanches (Cb3, Cbd4, Fe3)"
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri avant d'ouvrir le centre ; les Blancs gardent dxc5 en réserve et menacent Te1+ pour gêner le développement noir"
   },
   {
    "san": "c3",
    "pourquoi": "soutient d4 et donne au fou une case de repli en c2 ou d3 ; le centre reste solide et les Noirs doivent décider quoi faire du pion c5"
   }
  ],
  "erreurs": [
   {
    "san": "Bxc6+",
    "pourquoi": "échange le bon fou sans raison : après ...bxc6 dxc5 De7+, les Noirs récupèrent c5 avec un gros avantage de développement et une paire de fous"
   },
   {
    "san": "Be2",
    "pourquoi": "recule passivement et rend la pression sur c6 ; après ...c4 puis ...c3 si b3, les Noirs gagnent de l'espace et l'aile dame blanche est désorganisée"
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 28
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec 5.exd5 exd5",
  "sens": "prend le pion c5 pour obliger le fou noir à reprendre : il quitte la diagonale d6-h2 qui visait h2, et le pion d5 reste seul, sans pion voisin pour le protéger. Les Blancs pourront le viser durablement avec Cb3, Cbd4 et Fe3.",
  "menace": "garder le pion c5 : si les Noirs ne reprennent pas tout de suite, cxd6 gagne le fou ou laisse les Blancs avec un pion de plus.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "reprend le pion aussitôt : le fou reste actif sur la diagonale a7-g1 et regarde f2. Les Noirs auront un pion d5 isolé, mais en échange leurs pièces sortent vite et facilement. Les Blancs joueront O-O, Cb3 puis Cbd4 pour s'installer devant le pion."
   },
   {
    "san": "Qe7+",
    "pourquoi": "donne un échec qui gêne le roque blanc avant de reprendre en c5. Les Blancs répondent De2 ou Fe2, et les Noirs reprennent le pion ensuite. Un peu moins simple que la reprise directe, mais correct."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "oublie que le fou d6 est attaqué : après cxd6 les Blancs gagnent une pièce entière. Avant de développer, il faut d'abord répondre à la prise."
   },
   {
    "san": "Be7",
    "pourquoi": "recule le fou au lieu de reprendre en c5 : les Blancs gardent le pion de plus et le protègent avec Cb3. Les Noirs ont perdu un pion pour rien et le pion d5 reste faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -27
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec 6.Fb5",
  "sens": "Reprend le pion aussitôt et garde le fou sur la diagonale a7-g1, braqué sur f2. Les Noirs acceptent un pion d5 isolé contre un développement rapide et libre.",
  "menace": "Aucune menace immédiate. Le fou c5 vise f2, mais seul il ne peut rien : il attend Cf6 et Dame pour peser sur la case.",
  "plan": [
   {
    "san": "Nb3",
    "pourquoi": "Attaque le fou c5 avec gain de temps et libère le fou c1. Prépare Cbd4 pour bloquer le pion isolé d5. Les Noirs reculeront en d6 ou b6, et leur fou perdra un peu de mordant."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout contact. f2 est défendu par la tour et le roi, donc la diagonale du fou c5 ne fait plus peur. Suivra Cb3 et Cbd4 avec le même plan."
   },
   {
    "san": "Bxc6+",
    "pourquoi": "Prend le cavalier pour abîmer les pions noirs : après bxc6, les Noirs ont des pions doublés et isolés. En échange ils gardent la paire de fous, donc ce coup est jouable mais pas plus fort que Cb3."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "Le fou recule tout seul et perd le temps gagné par Fb5. Les Noirs jouent Cf6 et roquent sans gêne, et le fou en e2 ne presse plus rien ; le pion d5 isolé n'est plus une faiblesse."
   },
   {
    "san": "b3",
    "pourquoi": "Affaiblit c3 et la grande diagonale avant d'avoir roqué, et ne développe aucune pièce. Les Noirs jouent Cge7 puis O-O et prennent de l'avance ; le fou en b2 arrive trop tard."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 33
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec 5...exd5",
  "sens": "attaque le fou c5 pour gagner un temps et dégage la diagonale du fou c1. Le cavalier vise ensuite d4, la case devant le pion isolé d5, pour le bloquer.",
  "menace": "Nxc5 : prendre le fou c5 et obtenir la paire de fous contre un pion isolé.",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "recule sur sa meilleure diagonale : le fou vise h2 et garde l'œil sur le roque blanc. Le pion d5 reste défendu par la dame. Les Noirs développeront ensuite Nge7 et 0-0 sans souci."
   },
   {
    "san": "Ne7",
    "pourquoi": "développe en laissant le fou en c5 : si Nxc5, Qa5+ puis Qxc5 récupère la pièce avec un bon centre. Le cavalier e7 couvre aussi d5 et prépare le roque."
   },
   {
    "san": "Bb6",
    "pourquoi": "garde la diagonale a7-g1 qui regarde f2. Mais le fou est un peu hors jeu après c3 et Nbd4, où le cavalier blanc bloque d5 confortablement."
   }
  ],
  "erreurs": [
   {
    "san": "Qb6",
    "pourquoi": "semble attaquer b2 et défendre c5, mais après Bxc6 Qxc6 Nxc5 le fou est perdu : la dame ne protégeait plus c5. Un pion de moins net."
   },
   {
    "san": "a6",
    "pourquoi": "veut chasser le fou b5, mais les Blancs ne reculent pas : Bxc6 bxc6 puis Nxc5 gagne le fou c5, oublié pendant un coup. Toujours vérifier ce qui est attaqué avant de jouer un coup de pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -28
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3 Bd6",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec 5.exd5 exd5",
  "sens": "Retire le fou de l'attaque du cavalier b3 en le replaçant sur la diagonale b8-h2 : il vise h2 et surveille le futur roque blanc. Le pion isolé d5 reste protégé par la dame, et les Noirs n'ont plus qu'à jouer Cge7 puis 0-0.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Après Cge7, la tour f1 viendra sur e1 pour s'emparer de la colonne e ouverte. Le fou noir regarde h2, mais seul, il ne menace rien : il faudrait une dame et un cavalier pour attaquer."
   },
   {
    "san": "c3",
    "pourquoi": "Donne une case de repli au fou en d3 (après Fxc6+ ou pas) et ferme la diagonale a1-h8. Prépare Fd3 ou Cbd4 et met d4 sous contrôle. Laisse aux Noirs le temps de roquer."
   },
   {
    "san": "Nbd4",
    "pourquoi": "Centralise le cavalier sur une case forte, devant le pion isolé d5. Il attaque c6 et pourrait aller en f5 pour chasser le fou d6. Attention : après Cge7, les Noirs peuvent défendre c6 et proposer des échanges."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 29
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3 Bd6 O-O",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec 5.exd5 exd5 et 6.Fb5",
  "sens": "Met le roi à l'abri et libère la tour f1 pour la colonne e ouverte. Les Blancs ne menacent rien tout de suite : ils veulent d'abord finir le développement, puis poser la tour en e1 et pousser c4 pour attaquer le pion d5 isolé.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le pion f ni fermer la diagonale du fou d6. De e7, le cavalier protège c6 et d5, et prépare le roque. Si les Blancs jouent Te1, la case e7 est déjà bien gardée. C'est le coup le plus solide : il garde l'égalité."
   },
   {
    "san": "a6",
    "pourquoi": "Pose la question au fou b5 : il doit prendre en c6 ou reculer. Après Fxc6 bxc6, les Noirs ont la paire de fous mais un pion c6 doublé. Le coup est jouable, mais il donne aux Blancs un peu de temps : le cavalier g8 attend toujours."
   },
   {
    "san": "h6",
    "pourquoi": "Retire la case g5 au cavalier f3 et au fou c1 avant de jouer Cge7 ou Cf6. Coup prudent : il ne développe rien, mais il évite une épingle gênante. À préférer seulement si l'on connaît bien la position."
   }
  ],
  "erreurs": [
   {
    "san": "Qc7",
    "pourquoi": "Semble naturel : la dame regarde h2 avec le fou d6. Mais le pion d5 est laissé seul. Les Blancs jouent Dxd5 : le cavalier c6 est attaqué par le fou b5, le pion d5 a disparu, et après Cge7 Fxc6 les Noirs perdent un pion net. Développer avant d'attaquer."
   },
   {
    "san": "Nf6",
    "pourquoi": "Le cavalier bloque la colonne f mais surtout, il laisse e7 sans défense. Après Te1+, les Noirs doivent jouer Fe6, puis Cbd4 attaque le fou e6 et le cavalier c6 : trop de pièces pendent. Avec le cavalier en e7 au lieu de f6, ce problème n'existe pas."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -28
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3 Bd6 O-O Ne7",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec Cc6 et Ce7",
  "sens": "Développe le cavalier roi sans boucher la diagonale du fou d6 ni gêner le pion f. De e7, il soutient c6 et d5 et permet de roquer au coup suivant. La case e7 est solide face à une tour blanche sur e1.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Met la tour sur la colonne e, ouverte, avant que les Noirs roquent. Le roi noir est encore au centre : la tour gêne le roque et vise e7. Ensuite Fg5 et c3 complètent le développement. Les Noirs répondent O-O et égalisent presque."
   },
   {
    "san": "c3",
    "pourquoi": "Donne un point d'appui au fou b5 et ouvre la case c2 pour le fou ou la dame. Contrôle d4 pour empêcher ...d4. Coup calme : les Blancs gardent une structure saine contre le pion isolé d5, qu'ils attaqueront plus tard avec Cbd4 et Fe3."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue rien pour l'instant mais regarde e7 et h6. Si les Noirs roquent, Fxe7 ou Te1 arrivent avec pression sur la colonne e. Le fou sort avant de fermer la diagonale avec e3 : principe classique."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 27
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3 Bd6 O-O Ne7 Re1",
  "nom": "Défense française, variante Tarrasch (3.Cd2 c5), ligne principale avec pion d5 isolé",
  "sens": "Occupe la colonne e ouverte avant le roque noir : la tour cloue le cavalier e7 sur le roi et prépare Fg5 pour l'attaquer une deuxième fois. Elle retarde aussi le roque, car tant que le roi reste en e8 chaque pièce noire sur la colonne e est en danger.",
  "menace": "Fg5 : le cavalier e7, cloué par la tour, serait attaqué deux fois (tour e1 et fou g5) et seulement défendu par la dame. Les Noirs devraient jouer ...f6 et affaiblir leur roi.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Sort le roi de la colonne e : le clouage disparaît et le cavalier e7 est libre. Les Noirs achèvent le développement, puis jouent ...Fg4 et ...Dc7 ou ...Tc8 pour jouer activement avec leur pion d5 isolé. Les Blancs gardent une pression légère sur d5, rien de plus."
   },
   {
    "san": "Bg4",
    "pourquoi": "Développe le dernier fou avec un clouage sur f3 : le cavalier ne peut plus sauter en d4 pour viser d5 et e6. Le roque suivra. Attention au moment : après Fxc6+ bxc6 les Noirs ont des pions doublés, mais un fou actif et la colonne b ouverte."
   },
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 au fou blanc avant qu'il ne cloue le cavalier e7. Coup prudent qui coûte un temps : les Noirs roqueront juste après, et les Blancs jouent c3 et Cbd4 contre d5."
   }
  ],
  "erreurs": [
   {
    "san": "f6",
    "pourquoi": "Veut empêcher Fg5, mais affaiblit la diagonale a2-g8 et surtout la case e6. Après Cbd4 O-O Ce6, le cavalier blanc s'installe en e6, attaque la dame et la tour f8 : les Noirs perdent la qualité ou restent paralysés."
   },
   {
    "san": "Qc7",
    "pourquoi": "Développe la dame, mais oublie que d5 est protégé seulement par le cavalier cloué. Dxd5 prend le pion gratuitement : si Cxd5, la tour e1 prend le roi en e8. Après O-O Dh5, les Blancs ont un pion de plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -22
 },
 {
  "coups": "e4 e6 d4 d5 Nd2 c5 Ngf3 Nc6 exd5 exd5 Bb5 Bd6 dxc5 Bxc5 Nb3 Bd6 O-O Ne7 Re1 O-O",
  "nom": "Défense française, variante Tarrasch, ligne 3...c5 avec pion d5 isolé",
  "sens": "Met le roi à l'abri et libère le cavalier e7 : la colonne e ne cloue plus rien. Les Noirs vont pouvoir jouer ...Fg4, ...Dc7 ou ...Tc8 pour compenser le pion d5 isolé par des pièces actives.",
  "plan": [
   {
    "san": "Nfd4",
    "pourquoi": "Occupe la case d4, juste devant le pion isolé : c'est la meilleure case pour un cavalier blanc. Il bloque le pion, attaque c6 et empêche ...Fg4 d'être gênant. Les Blancs pourront ensuite jouer Fe3 et c3 pour cimenter la case."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou noir avant même qu'il y aille. Petit coup utile : le cavalier f3 reste tranquille et le roi blanc gagne une case d'air. Laisse aux Noirs le temps de jouer ...Dc7 ou ...Fg4 quand même, mais ce dernier est moins fort."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe le dernier fou vers d4 et c5. Il surveille la case devant le pion isolé et prépare Cbd4 ou Cfd4. Attention : un cavalier noir en f5 pourrait venir l'échanger, les Blancs doivent y penser."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 30
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5",
  "nom": "Variante d'échange (via 3.Cc3 Cf6)",
  "sens": "ouvre le centre sans attendre : les Blancs échangent le pion e4 contre d5 pour obtenir une position symétrique, simple et sans tension. Le pion d5 est maintenant à prendre.",
  "menace": "le pion blanc d5 prend e6 au prochain coup, et le fou c8 serait alors mal placé après Fxe6",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "reprend tout de suite avec le pion. Le fou c8 retrouve sa diagonale c8-h3, le centre est symétrique et le roi noir pourra roquer tranquillement. C'est le coup le plus simple et le meilleur."
   },
   {
    "san": "Nxd5",
    "pourquoi": "reprend avec le cavalier, qui se place au centre mais s'expose à Cxd5 Dxd5 puis Cf3 : les Blancs gagnent du temps pendant que la dame noire doit bouger. Jouable, mais un peu moins bon."
   }
  ],
  "erreurs": [
   {
    "san": "Bb4",
    "pourquoi": "cloue le cavalier c3 mais oublie le pion d5. Après dxe6 Fxe6, les Noirs ont perdu un pion central et le fou e6 bloque leur propre pion e. Toujours reprendre d'abord."
   },
   {
    "san": "c6",
    "pourquoi": "veut garder la structure, mais le pion saute en c6 et après dxc6 Cxc6 les Noirs ont un pion de moins pour rien. La règle : quand on vous prend un pion, reprenez-le."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 2
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5",
  "nom": "Variante d'échange de la Défense française (avec 3.Cc3 Cf6)",
  "sens": "reprend le pion d5 avec le pion e6 : le centre devient symétrique, le fou c8 n'est plus enfermé et sort sur la diagonale c8-h3, et le roi noir pourra roquer rapidement",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "développe le cavalier vers le centre et prépare le petit roque. Il surveille e5 et d4, et garde toutes les options pour le fou f1 (Fd3 ou Fe2). Les Noirs répondront Fd6 ou Fe7 puis roque : le jeu reste égal, c'est normal dans cette ligne symétrique."
   },
   {
    "san": "Bg5",
    "pourquoi": "cloue le cavalier f6 sur la dame d8 et le gêne. Si les Noirs jouent Fe7 pour rompre le clou, le fou reste bien placé. Attention : on laisse aux Noirs la possibilité de chasser le fou par h6 et g5, ce qui affaiblit leur roque."
   },
   {
    "san": "Bd3",
    "pourquoi": "place le fou sur sa meilleure diagonale, vers h7, là où le roi noir va roquer. Il faut ensuite jouer Cge2 ou Cf3 et roquer. Ne pas oublier que le fou d3 bloque pour l'instant la dame et laisse d4 défendu seulement par la dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3",
  "nom": "Variante d'échange (Défense française)",
  "sens": "développe le cavalier vers le centre et prépare le petit roque : il surveille e5 et d4 tout en laissant le choix du fou de cases blanches (Bd3 ou Be2)",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "la case la plus active pour le fou : il vise h2 et contrôle e5, ce qui empêche un cavalier blanc de s'y installer. Il prépare le roque et laisse e7 libre pour une tour ou la dame. Les Blancs joueront sans doute Bd3 en miroir : la position reste équilibrée."
   },
   {
    "san": "Be7",
    "pourquoi": "plus modeste mais très solide : le fou couvre le roi et le cavalier f6, et le roque suit tout de suite. Il laisse d6 pour un cavalier ou pour la dame plus tard, et ne donne aucune cible aux Blancs."
   },
   {
    "san": "Bb4",
    "pourquoi": "cloue le cavalier c3 et met un peu de pression sur e4 et sur le pion d5 adverse indirectement. Après a3, il faut choisir : prendre en c3 (on cède la paire de fous mais on abîme les pions blancs) ou reculer. Plus tranchant, à réserver si l'on aime les positions déséquilibrées."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6",
  "nom": "Variante d'échange (ligne 3.Cc3 Cf6)",
  "sens": "place le fou sur sa meilleure diagonale : il vise h2, contrôle e5 et interdit à un cavalier blanc de s'y installer, tout en préparant le petit roque.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Le coup miroir : le fou vise h7 et contrôle e4, la case clé devant le pion d5. Prépare le roque. La position reste symétrique et équilibrée : il faudra ensuite jouer O-O, Fg5 et Te1 pour prendre la colonne e."
   },
   {
    "san": "Nb5",
    "pourquoi": "Attaque le fou d6 : si les Noirs jouent Fe7 ou Fb4+, le fou perd sa belle diagonale. Mais après ...O-O, les Blancs doivent reprendre Cxd6 et donnent la paire de fous : aucun avantage réel, juste une autre façon de jouer."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame et gêne le roque noir. Prépare Fd3 et Dd2. Les Noirs répondront ...c6 ou ...Fe7 pour casser le clouage : rien de grave, mais c'est le coup le plus actif."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3",
  "nom": "Variante d'échange, ligne symétrique avec Cc3 et Cf6",
  "sens": "Place le fou sur sa meilleure diagonale : il vise h7 et surveille e4, la case devant le pion d5. Prépare le petit roque et complète le développement en miroir des Noirs.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Relie les tours et prépare Te8 pour disputer la colonne e. Dans une position symétrique, celui qui finit son développement le premier prend l'initiative."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe le cavalier vers e7 ou b4 et défend d4 indirectement en pressant d4. Prépare aussi Fg4 pour clouer le cavalier f3. Laisse cependant les Blancs jouer Fg5 et Te1 avec un peu d'initiative."
   },
   {
    "san": "c6",
    "pourquoi": "Renforce d5 et libère la case c7 pour la dame. Donne une base solide avant Fg4 et O-O. Un peu passif : les Blancs roquent et prennent la colonne e les premiers."
   }
  ],
  "erreurs": [
   {
    "san": "Na6",
    "pourquoi": "Le cavalier va en b4 pour échanger le fou d3, mais perd du temps. Après O-O Cb4 Te1, les Blancs tiennent la colonne e et menacent Fxb4 ou Fg5 : le roi noir, pas encore roqué, reste sur la colonne ouverte."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -3
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O",
  "nom": "Variante d'échange, ligne avec Cc3 et Fd6",
  "sens": "Met le roi à l'abri et relie les tours. Dans une position symétrique, les Noirs veulent finir leur développement les premiers pour jouer Te8 et prendre la colonne e en main.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même logique que les Noirs : le roi se met à l'abri, la tour f1 pourra venir en e1 pour disputer la colonne e. C'est le coup le plus naturel et le plus solide ; il garde toutes les options pour ensuite (Fg5, Te1, Ce2-g3)."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe le fou en clouant le cavalier f6 sur la dame. Cela ralentit les Noirs et prépare à affaiblir le roque adverse si les Noirs chassent le fou par h6. Attention : il faut roquer juste après, le roi blanc est encore au centre."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il retire la case g4 au fou c8 et au cavalier. Ainsi Fg4 ne viendra plus clouer le cavalier f3. Il prépare un roque tranquille sans se presser."
   }
  ],
  "erreurs": [
   {
    "san": "Qe2",
    "pourquoi": "Semble disputer la colonne e, mais la dame arrive trop tôt. Après Te8 elle est face à la tour noire et doit perdre du temps ; en plus elle bloque le fou c1 qui ne sait plus où aller. Les Noirs gagnent l'initiative sur la colonne e."
   },
   {
    "san": "Bd2",
    "pourquoi": "Le fou est passif en d2 : il ne cloue rien et gêne la dame. Après Te8 puis c5, les Noirs ouvrent le centre et gagnent du temps pendant que les Blancs réorganisent leurs pièces. Mieux vaut Fg5 ou Fe3, où le fou travaille vraiment."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -9
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O",
  "nom": "Variante d'échange (ligne avec Cc3 et Cf6)",
  "sens": "Met le roi à l'abri et relie les tours : la tour f1 pourra aller en e1 pour disputer la colonne e ouverte. Les Blancs gardent toutes leurs options (Fg5, Te1, Ce2-g3).",
  "plan": [
   {
    "san": "Bg4",
    "pourquoi": "Cloue le cavalier f3 sur la dame d1 et développe le fou avec tempo. Les Noirs répondent au futur Fg5 par le même coup miroir. Si h3, le fou peut prendre en f3 ou reculer en h5 ; le cavalier f3 ne défend plus bien d4."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe le cavalier vers d4, soutient un futur ...Cb4 contre le fou d3 et prépare ...Te8. Le pion c7 reste mobile. Attention : laisse aux Blancs Fg5 et Cb5, il faut alors protéger le fou d6."
   },
   {
    "san": "c6",
    "pourquoi": "Solidifie d5 et retire la case b5 au cavalier c3 : plus de Cb5 qui attaque le fou d6. Donne aussi la case c7 au fou ou à la dame. Un peu passif mais très sûr pour un débutant."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd7",
    "pourquoi": "Naturel mais le cavalier bloque le fou c8 et ne contrôle plus b5. Les Blancs jouent Cb5 : le fou d6 doit fuir en b4, puis c3 le chasse encore. Les Noirs perdent du temps et leur fou se retrouve mal placé."
   },
   {
    "san": "c5",
    "pourquoi": "Ouvre le jeu trop tôt. Après Fg5 (clouage sur la dame) puis Cb5, le fou d6 et le pion d5 deviennent faibles ; le cavalier blanc arrive en d6 ou prend le fou. Mieux vaut d'abord finir le développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4",
  "nom": "Variante d'échange, ligne symétrique avec 3.Cc3 Cf6",
  "sens": "cloue le cavalier f3 sur la dame d1 et développe la dernière pièce mineure avec tempo : le cavalier ne défend plus librement d4, et les Noirs sont prêts à répondre à Fg5 par le même clouage.",
  "menace": "Aucune menace directe. L'idée est de gêner la défense de d4 et de préparer Cc6 puis une pression sur le pion central.",
  "plan": [
   {
    "san": "h3",
    "pourquoi": "Pose la question au fou tout de suite. S'il prend en f3, la dame reprend et les Blancs gardent la paire de fous. S'il recule en h5, g4 devient possible plus tard pour le chasser encore. Cela coûte un temps, mais lève le clouage proprement."
   },
   {
    "san": "Bg5",
    "pourquoi": "Le coup miroir : les Blancs clouent à leur tour le cavalier f6 sur la dame d8. La position reste symétrique et équilibrée ; chacun devra décider quand prendre ou quand jouer h3 pour chasser le fou adverse."
   },
   {
    "san": "Nb5",
    "pourquoi": "Attaque le fou d6 pour gagner la paire de fous après Cxd6 Dxd6, ou forcer le fou à reculer en e7. Attention : ce cavalier s'éloigne du centre, et les Noirs peuvent le gêner avec c6 après le retrait du fou."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -8
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3",
  "nom": "Variante d'échange, système Cc3 avec ...Cf6",
  "sens": "Pose la question au fou cloueur : il doit choisir entre prendre en f3 et reculer. Les Blancs gagnent une information et préparent, si le fou reste sur la diagonale, le coup g4 pour le chasser de nouveau.",
  "menace": "h3xg4 : le fou est attaqué et doit bouger, sinon il est perdu pour rien.",
  "plan": [
   {
    "san": "Bh5",
    "pourquoi": "Le fou recule en gardant le clouage du cavalier f3 et la pression sur la dame d1. Les Noirs conservent leur paire de fous et attendent de voir si les Blancs osent g4, ce qui affaiblirait leur roi."
   }
  ],
  "erreurs": [
   {
    "san": "Bxf3",
    "pourquoi": "La dame reprend en f3, bien placée, et les Blancs gardent la paire de fous dans une position ouverte. Après h4, ils préparent même Fg5 avec l'initiative : les Noirs ont donné leur bon fou sans contrepartie."
   },
   {
    "san": "Bd7",
    "pourquoi": "Rentrer le fou sans combattre perd le temps gagné par le clouage. Les Blancs jouent Fg5 et Te1 : ils sont pleinement développés avec le contrôle de la colonne e, et les Noirs doivent rejouer le fou en e6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3 Bh5",
  "nom": "Variante d'échange de la Défense française",
  "sens": "maintient le clouage du cavalier f3 sur la dame d1 tout en gardant la paire de fous ; le fou reste actif sur la diagonale h5-d1 et invite les Blancs à se découvrir avec g4",
  "plan": [
   {
    "san": "Nb5",
    "pourquoi": "Attaque le fou d6, la meilleure pièce noire. Si les Noirs le gardent, le cavalier échange ou se replie en ayant gagné du temps. Cela prépare aussi c3 ou Ff4 pour contrôler la case e5. Les Noirs répondront souvent Fe7 ou Fb4."
   },
   {
    "san": "Re1",
    "pourquoi": "Occupe la colonne e ouverte, la seule colonne vraiment ouverte de la position. La tour pèse sur e7 et sur toute pièce qui viendra sur e5 ou e4. Elle prépare Fg5 et Dd2 pour harmoniser les pièces."
   },
   {
    "san": "g4",
    "pourquoi": "Chasse le fou et casse le clouage : après Fg6 les Blancs échangeront sur g6 pour supprimer la paire de fous. Mais les pions g4 et h3 affaiblissent le roi blanc ; à jouer seulement en acceptant un jeu plus risqué."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -9
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3 Bh5 Nb5",
  "nom": "Défense française, variation d'échange avec Cc3 et Cb5",
  "sens": "attaque le fou d6, la meilleure pièce noire : s'il reste, le cavalier l'échange ou revient en gagnant du temps, et la case e5 devient plus facile à contrôler avec c3 ou Ff4",
  "menace": "Cxd6 suivi de Dxd6 : les Blancs échangent le bon fou noir contre leur cavalier et gardent la paire de fous",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "ignore la menace : la tour prend la colonne e ouverte, la seule colonne ouverte du centre. Si Cxd6 Dxd6, la dame noire est très bien placée en d6 et la tour e8 contrôle e1. Les Noirs gagnent du temps au lieu d'en perdre."
   },
   {
    "san": "Nc6",
    "pourquoi": "développe en protégeant d6 une fois de plus par l'idée Cb4 ou Ce7. Si Cxd6 Dxd6, les Noirs sont très bien développés. Laisse aux Blancs c3 pour chasser un cavalier plus tard."
   },
   {
    "san": "Bb4",
    "pourquoi": "sauve le fou en gagnant du temps : il cloue le pion c2 contre la dame et regarde a5 et e7. Les Blancs doivent répondre c3 ou a3, ce qui n'avance pas leur développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 12
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3 Bh5 Nb5 Re8",
  "sens": "occupe la seule colonne ouverte avec la tour au lieu de reculer le fou d6 : si le cavalier prend en d6, la dame reprend et se retrouve centralisée tandis que la tour vise e1. Les Noirs préfèrent gagner un temps de développement plutôt que de sauver un fou qui sera échangé contre un cavalier.",
  "plan": [
   {
    "san": "Nxd6",
    "pourquoi": "Prend le fou tout de suite : le cavalier b5 était attaquable par a6, autant encaisser le fou avant qu'il recule. Après Qxd6 la dame noire est bien placée, mais les Blancs gardent la paire de fous et peuvent jouer Bg5 ou c3 pour consolider d4. La position est égale."
   },
   {
    "san": "g4",
    "pourquoi": "Chasse le fou h5 vers g6, puis Bxg6 ou Nxd6 au choix. Le pion g4 gagne de l'espace mais affaiblit le roque : à ne jouer que si l'on accepte de défendre ensuite les cases f4 et h4. Laisse aux Noirs Bg6 avec échange des fous de cases blanches."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe en attaquant le cavalier f6, défenseur de d5 et de h7. Les Blancs gardent la menace Nxd6 en réserve : si Bxf3 Qxf3, la dame blanche entre en jeu sur la grande diagonale. Les Noirs répondent par a6 ou Be7 et la partie reste équilibrée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3 Bh5 Nb5 Re8 Nxd6",
  "nom": "Variante d'échange, 3.Cc3 Cf6",
  "sens": "Encaisse le fou d6 avant qu'il ne soit chassé : le cavalier était attaquable par a6, autant échanger tout de suite. Les Blancs récupèrent la paire de fous sans rien céder.",
  "menace": "Le cavalier d6 est en prise et il attaque la tour e8 et le pion b7 : il faut le reprendre immédiatement.",
  "plan": [
   {
    "san": "Qxd6",
    "pourquoi": "La seule reprise correcte. La dame se centralise sur d6 : elle surveille f4 et h2, et laisse c7 en place pour garder la structure saine. Le cavalier b8 ira en c6 ou d7, puis Fg6 échangera les fous. Position égale."
   }
  ],
  "erreurs": [
   {
    "san": "cxd6",
    "pourquoi": "Reprendre avec le pion abîme la structure : d6 et d5 deviennent des pions isolés et doublés, faibles pour toute la partie. Les Blancs jouent g4 pour chasser le fou puis Ce1-g2 et ciblent d5. Un pion de retard, durablement."
   },
   {
    "san": "Bxf3",
    "pourquoi": "Commencer par cet échange oublie que le cavalier d6 prend f7 avec échec : après Cxf7 Fxd1 Cxd8, les Noirs ont perdu une pièce dans le compte. Toujours reprendre la pièce qui vient de capturer avant de lancer d'autres échanges."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Nf3 Bd6 Bd3 O-O O-O Bg4 h3 Bh5 Nb5 Re8 Nxd6 Qxd6",
  "nom": "Variante d'échange, ligne 3.Cc3 Cf6",
  "sens": "Reprend le cavalier en centralisant la dame : depuis d6 elle surveille f4 et h2 et garde le pion c7 en place, ce qui conserve une structure saine. Les Noirs ont rendu la paire de fous mais gardent une position solide.",
  "plan": [
   {
    "san": "g4",
    "pourquoi": "Chasse le fou h5 vers g6 et gagne de l'espace à l'aile roi. Après Fg6 Fxg6, les fous sont échangés et la dame noire ne regarde plus h2. Le roi blanc est un peu aéré, mais les Noirs n'ont pas de pièces pour l'attaquer tout de suite."
   },
   {
    "san": "c3",
    "pourquoi": "Renforce d4 et ferme la diagonale a5-e1. Le fou c1 pourra sortir en e3 ou g5 sans que d4 soit faible. Coup calme qui prépare Dc2 ou Te1 et garde la paire de fous."
   },
   {
    "san": "Be3",
    "pourquoi": "Développe le fou en protégeant d4 et en gardant un œil sur f4. Attention : après Fxf3 Dxf3, les Blancs gardent la paire de fous mais doivent surveiller Dxh2 si la dame quitte la défense de h2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5",
  "nom": "Winawer, variante d'échange",
  "sens": "Échange le pion central pour ouvrir la colonne e et simplifier : les Blancs renoncent à la tension et visent une partie calme et symétrique.",
  "menace": "Prendre un pion : dxe6 gagne un pion, et si ...Bxe6 le fou noir devient une cible pour le fou blanc ou pour d5.",
  "plan": [
   {
    "san": "exd5",
    "pourquoi": "Reprend le pion tout de suite et rétablit l'égalité matérielle. Le fou c8 est libéré, la structure est symétrique et saine. Les Blancs n'ont plus que Nf3, Bd3, et une petite avance de développement."
   }
  ],
  "erreurs": [
   {
    "san": "Nf6",
    "pourquoi": "Développe, mais ignore la menace : les Blancs jouent dxe6, Bxe6 et ont un pion de plus. Avec Nf3 ensuite ils gardent une position tranquille et un pion net."
   },
   {
    "san": "Qxd5",
    "pourquoi": "Reprend, mais avec la dame, qui sort trop tôt. Après Nf3 et Bd3 la dame est chassée, les Blancs développent avec du tempo et le fou b4 reste en l'air. Toujours reprendre avec le pion ici."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -16
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5",
  "nom": "Variante Winawer, échange",
  "sens": "Reprend le pion d5 et rétablit l'égalité matérielle. Ouvre la diagonale du fou c8 et donne une structure symétrique, sans faiblesse. Le fou b4 cloue encore le cavalier c3.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, vers h7, et prépare le petit roque. Il laisse aux Noirs la possibilité de jouer Ne7 ou Nf6 et de roquer : la position reste équilibrée, mais les Blancs ont un temps d'avance."
   },
   {
    "san": "a3",
    "pourquoi": "Pose la question au fou b4 : s'il prend en c3, les Blancs reprennent bxc3 et obtiennent la paire de fous. S'il recule en e7, les Blancs ont gagné du temps et peuvent développer tranquillement."
   },
   {
    "san": "Nf3",
    "pourquoi": "Sort le cavalier vers le centre et prépare le roque. Il surveille e5 et d4 et ne crée aucune faiblesse. Les Noirs répondront Nf6 ou Ne7 et égaliseront sans mal."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 22
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3",
  "nom": "Défense française, variante Winawer, échange",
  "sens": "Développe le fou sur sa diagonale la plus active, vers h7, et libère la case f1 pour le petit roque. Les Blancs ont fini de préparer le roque ; ils sont un temps devant.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe le cavalier sur sa meilleure case et contrôle e4 et g4. Prépare O-O dès le coup suivant. Les Blancs peuvent jouer Nge2 ou Nf3 : après le roque des deux côtés, la position est symétrique et saine pour les Noirs."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le pion f. Il pourra aller en g6 ou f5, et le pion f reste libre pour f5 plus tard. Prépare aussi O-O. L'inconvénient : il bloque un instant le fou c8."
   },
   {
    "san": "c6",
    "pourquoi": "Solidifie d5 et ouvre la diagonale d8-a5 à la dame. Si les Blancs jouent a3, le fou peut reculer en d6 ou prendre en c3. Ne précipite pas le développement, mais la structure devient très solide."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -17
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6",
  "nom": "Variante Winawer, échange",
  "sens": "Développe le cavalier sur sa meilleure case et contrôle e4 et g4. Prépare le petit roque dès le coup suivant et laisse le fou b4 cloué sur le cavalier c3.",
  "plan": [
   {
    "san": "Ne2",
    "pourquoi": "Développe le cavalier sans bloquer le fou c1 ni gêner la poussée f2-f3 plus tard. Permet aussi de rejouer Ne2-g3 ou de reprendre en c3 avec le cavalier si les Noirs échangent sur c3. Le roque suit tout de suite."
   },
   {
    "san": "Nf3",
    "pourquoi": "Le développement le plus naturel : contrôle e5 et d4, prépare O-O. Position symétrique où chacun développe tranquillement ; les Blancs gardent un petit plus grâce au trait."
   },
   {
    "san": "a3",
    "pourquoi": "Pose la question au fou b4 : il doit prendre en c3 (les Blancs reprennent bxc3 et obtiennent la paire de fous) ou reculer en e7 et perdre un temps. Chasse la clouade avant de roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Bb5+",
    "pourquoi": "L'échec ne mène à rien : après 6...c6, le fou doit reculer en d3 et les Blancs ont perdu deux temps. Les Noirs roquent avec une position agréable et le pion c6 solidifie d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 20
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2",
  "nom": "Variante Winawer, échange (ligne 4.exd5)",
  "sens": "Le dernier coup est joué par les Blancs ; aux Noirs de répondre. Ce coup développe le cavalier sans masquer le fou c1 ni encombrer la case f3, garde l'option de reprendre en c3 avec le cavalier et annonce un roque immédiat.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite : la structure est symétrique et ouverte sur la colonne e, donc le roi au centre serait exposé. La tour f8 pourra venir en e8 face au cavalier e2. Laisse aux Blancs 0-0 et Fg5, sans rien perdre."
   },
   {
    "san": "c6",
    "pourquoi": "Consolide le pion d5 et donne une retraite au fou b4 en d6 ou c7, sans fermer la diagonale du fou c8. Après ce coup, les Noirs ne craignent plus a3 ni Cxd5 tactiquement. Les Blancs ont le temps de roquer et de jouer Fg5."
   },
   {
    "san": "Be7",
    "pourquoi": "Recule le fou avant qu'a3 ne le force à l'échange : conserve la paire de fous et retire le fou de la prise du cavalier c3. C'est solide mais un peu lent, donc les Blancs obtiennent Fg5 et 0-0 sans être gênés."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -3
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O",
  "nom": "Défense française, variante Winawer, variante d'échange",
  "sens": "Met le roi à l'abri avant que la colonne e ne s'ouvre pour de bon, et prépare Te8 pour peser sur le cavalier e2. Ne cherche aucune menace immédiate : la structure est symétrique, chacun développe d'abord.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même logique que les Noirs : le roi sort du centre avant que les tours n'arrivent en e1 et e8. Ensuite Ff4 ou Fg5 et Dd2 se jouent sans souci. Les Noirs répondront Te8 ou c6, sans rien gagner."
   },
   {
    "san": "a3",
    "pourquoi": "Pose la question au fou b4 : il doit prendre en c3 (et les Blancs reprennent avec le pion b2, obtenant la paire de fous) ou reculer en d6/e7. Dans les deux cas, le cavalier c3 est libéré du clouage."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame d8, ce qui freine Ce4 et prépare Dd2 puis un roque. Laisse aux Noirs h6 ou Fe7 pour chasser le fou, sans que les Blancs perdent du temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 7
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O",
  "nom": "Variante d'échange, ligne 4...exd5 avec Fb4",
  "sens": "met le roi à l'abri avant que les tours n'arrivent sur la colonne e ouverte : la tour f1 pourra aller en e1 et les fous se développer sans crainte d'un échec",
  "plan": [
   {
    "san": "Re8",
    "pourquoi": "prend la colonne e ouverte en premier : la tour vise e2 et e1. Les Blancs devront répondre Te1 pour l'équilibrer, et chaque pièce blanche sur la colonne e devra être défendue."
   },
   {
    "san": "c6",
    "pourquoi": "solidifie d5 une fois pour toutes et donne au fou b4 une case de retraite en d6 ou c7. Prépare Dc7 ou Fg4. Laisse aux Blancs le temps de jouer Ff4, mais sans dégât."
   },
   {
    "san": "Be7",
    "pourquoi": "le fou n'a plus rien à faire en b4 depuis que le cavalier est en e2 : il revient en e7 où il garde f6 et évite d'être chassé par a3 avec perte de temps. Prépare Fg4 et Cbd7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8",
  "nom": "Défense française, variante Winawer, ligne d'échange (3.Cc3 Fb4 4.exd5)",
  "sens": "Occupe la colonne e ouverte avant l'adversaire : la tour fixe le cavalier e2, qui est maintenant cloué contre la case e1 et doit rester protégé tant que la tour blanche n'est pas en face.",
  "plan": [
   {
    "san": "Ng3",
    "pourquoi": "Sort le cavalier de la colonne e, où il gênait : il libère e2 pour la dame ou la tour, regarde f5 et h5 et ne laisse plus rien à prendre sur la colonne. Les Noirs peuvent répondre Fg4 ou c6 pour continuer leur développement."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame d8 et développe une pièce avec tempo. Si les Noirs chassent le fou par h6, il recule en h4 et garde la pression. Laisse aux Noirs l'option Fxc3 pour abîmer les pions blancs."
   },
   {
    "san": "Re1",
    "pourquoi": "Dispute aussitôt la colonne e : la tour blanche défend e2 et neutralise la tour noire. Coup solide et simple, mais le cavalier e2 reste un peu passif tant qu'il n'a pas bougé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3",
  "nom": "Variante Winawer, échange (3...Fb4 4.exd5)",
  "sens": "Déplace le cavalier hors de la colonne e pour ne plus offrir de cible à la tour e8, libère e2 pour la dame ou la tour et surveille f5 et h5 ; la position est équilibrée, les Noirs finissent tranquillement leur développement.",
  "plan": [
   {
    "san": "Nbd7",
    "pourquoi": "Développe le cavalier sans bloquer le fou c8 et garde c6 libre pour un pion. Le cavalier pourra aller en f8 pour défendre le roi, ou en b6 vers c4. Il laisse aux Blancs Fg5 ou c3 sans dommage."
   },
   {
    "san": "Bg4",
    "pourquoi": "Sort le fou avec une pique sur la dame d1 : les Blancs doivent réagir par f3 ou Fe2. Le fou gêne le développement blanc et prépare Cbd7 puis c6. Attention : après f3 le fou doit reculer en e6 ou h5."
   },
   {
    "san": "c6",
    "pourquoi": "Consolide d5 une fois pour toutes et ouvre la case c7 à la dame. Le fou b4 pourra revenir en d6, face au cavalier g3. Les Blancs obtiennent le temps de jouer c3 et Fg5, sans menace réelle."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3 Nbd7",
  "nom": "Variante Winawer, ligne d'échange (3...Fb4 4.exd5)",
  "sens": "Développe le dernier cavalier sans boucher le fou c8 et garde la case c6 libre pour le pion : le cavalier vise f8 pour couvrir le roi, ou b6 puis c4.",
  "plan": [
   {
    "san": "a3",
    "pourquoi": "Pose la question au fou b4. S'il prend en c3, les Blancs reprennent bxc3 et obtiennent la paire de fous et un centre plus solide ; s'il recule en d6 ou e7, les Blancs ont gagné un temps et pourront pousser c4 ou placer le cavalier en f5."
   },
   {
    "san": "Re1",
    "pourquoi": "Prend la colonne e ouverte en face de la tour e8. Les Blancs disputent la seule colonne ouverte, préparent Fg5 et Dd2, et peuvent échanger les tours quand cela les arrange."
   },
   {
    "san": "Bg5",
    "pourquoi": "Cloue le cavalier f6 sur la dame d8. Le cavalier f6 défend d5 et h7 : s'il est gêné, Cf5 et Dd2 deviennent forts. Les Noirs doivent répondre avec soin (c6 ou h6)."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3 Nbd7 a3",
  "nom": "Défense française, variante d'échange (ligne Winawer avec Cc3)",
  "sens": "attaque le fou b4 avec un pion pour le forcer à se décider : soit il prend en c3 et donne la paire de fous, soit il recule et les Blancs gagnent un temps pour pousser c4 ou amener le cavalier en f5",
  "menace": "axb4 : gagner le fou pour un simple pion",
  "plan": [
   {
    "san": "Bf8",
    "pourquoi": "Le fou rentre à la maison. Il n'a rien à faire sur la diagonale a5-e1 et en f8 il protège le roi sur la grande diagonale. De plus il libère la colonne e pour la tour. Les Blancs gagnent un temps, mais la position noire reste très solide."
   },
   {
    "san": "Ba5",
    "pourquoi": "Garde le clouage sur c3 et attend b4 pour reculer en b6, où le fou visera d4. Attention : après b4 Fb6 le fou peut être gêné par c4-c5, il faut suivre les pions blancs de près."
   },
   {
    "san": "Bxc3",
    "pourquoi": "Prend le cavalier et abîme les pions blancs (bxc3). Mais on donne la paire de fous et le centre blanc devient plus solide : c'est jouable, pas le plus précis."
   }
  ],
  "erreurs": [
   {
    "san": "Bc5",
    "pourquoi": "Le fou va se faire prendre : dxc5 Cxc5 et le pion d5 est cloué par Fg5. Les Noirs ont perdu une pièce pour un pion."
   },
   {
    "san": "c5",
    "pourquoi": "On oublie que le fou est attaqué : axb4 et le fou est perdu. Toujours regarder quelle pièce est attaquée avant de jouer un autre coup."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 3
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3 Nbd7 a3 Bf8",
  "nom": "Variante d'échange, système avec Fb4 et Ce2-g3",
  "sens": "Met le fou à l'abri avant qu'il ne soit chassé par a3 et b4 : en f8, il couvre la case g7 devant le roi et dégage la colonne e pour la tour. La position noire est symétrique et sans faiblesse, les Noirs se contentent d'une solidité totale.",
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "Développe le dernier fou en clouant le cavalier f6 sur la dame. Cela gêne ...c5 et prépare Df3 puis Cf5 pour peser sur le roi noir. Les Noirs peuvent répondre ...h6 ou ...c6 sans crainte."
   },
   {
    "san": "Nf5",
    "pourquoi": "Place le cavalier sur sa meilleure case : il regarde g7 et d6, et devra être chassé par ...g6, ce qui affaiblit les cases noires près du roi. Les Blancs gagnent de l'espace sur l'aile roi."
   },
   {
    "san": "Re1",
    "pourquoi": "Dispute la colonne e ouverte. Si la tour noire s'y installe seule, elle devient gênante ; avec Te1 les Blancs peuvent l'échanger ou la neutraliser. Coup simple et utile en attendant mieux."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -2
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3 Nbd7 a3 Bf8 Bg5",
  "sens": "Développe le dernier fou en clouant le cavalier f6 sur la dame d8 : il gêne ...c5, qui laisserait d5 moins bien défendu, et prépare Df3 puis Cf5 pour peser sur le roi noir.",
  "menace": "Pas de menace immédiate, mais la pression sur f6 rend le saut Cxd5 possible dès que le cavalier f6 ou le pion d5 perd un défenseur.",
  "plan": [
   {
    "san": "h6",
    "pourquoi": "Pose la question au fou : il doit se décider tout de suite. S'il prend en f6, la dame reprend et le clouage disparaît ; s'il recule en h4, ...c6 solidifie d5 et ...g5 peut suivre pour chasser le fou. Les Noirs gardent une position solide sans faiblesse."
   },
   {
    "san": "c6",
    "pourquoi": "Renforce d5 une fois pour toutes : le coup Cxd5 ne fonctionne plus. Le pion c6 ouvre aussi la case c7 à la dame et prépare ...Db6 ou ...Cb6. Les Noirs laissent les Blancs jouer Df3 et Cf5, mais ont le temps de répondre ...Cf8 pour protéger le roi."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "Coup naturel pour attaquer le centre, mais il arrive un temps trop tôt : Fb5 attaque le cavalier d7, et après ...a6 Fxd7 les Noirs perdent une pièce ou doivent lâcher d5. C'est exactement ce que le clouage sur f6 empêche."
   },
   {
    "san": "Be7",
    "pourquoi": "Semble annuler le clouage, mais Cf5 saute aussitôt sur le fou e7 et vise g7. Après ...c6 Te1, les Blancs dominent la colonne e et la case f5 ; les Noirs ont perdu un pion en valeur de position."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Nf6 Ne2 O-O O-O Re8 Ng3 Nbd7 a3 Bf8 Bg5 h6",
  "nom": "Variante d'échange, système Winawer avec ...Fb4",
  "sens": "chasse le fou g5 et l'oblige à choisir : prendre en f6, reculer ou se faire gagner. Le pion h6 enlève aussi la case g5 à tout jamais aux pièces blanches.",
  "menace": "...hxg5 : si le fou reste en g5, il est simplement pris.",
  "plan": [
   {
    "san": "Bf4",
    "pourquoi": "Recule sur une diagonale active : le fou vise c7 et surveille e5. Il reste hors de portée des pions noirs et la position reste égale."
   },
   {
    "san": "Be3",
    "pourquoi": "Retour solide : le fou protège d4 et laisse Dd2 suivre. Les Blancs renoncent au clouage mais ne donnent rien."
   },
   {
    "san": "f4",
    "pourquoi": "Garde le fou en g5 en le défendant par le pion. Si ...hxg5 fxg5 attaque le cavalier f6. Plus tranchant, mais affaiblit e3 et la diagonale du roi."
   }
  ],
  "erreurs": [
   {
    "san": "Bh4",
    "pourquoi": "Le fou reste sur la diagonale et ...g5 le gagne : après Fxg5 hxg5 les Blancs ont perdu une pièce pour deux pions. Le recul en h4 est exactement ce que ...h6 attendait."
   },
   {
    "san": "Bxh6",
    "pourquoi": "Sacrifice bluffeur : ...gxh6 et les Blancs n'ont pas de suite. Df3 est paré par ...Cb6, le roi noir tient. Les Blancs ont donné une pièce pour un pion."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 0
 },
 {
  "coups": "e4 e6 d4 d5 e5 c5 Nf3 Nc6",
  "nom": "Variante d'avance, ligne principale (Paulsen)",
  "sens": "ajoute un deuxième attaquant sur d4, déjà pressé par le pion c5 : les Blancs doivent soutenir leur centre tout de suite",
  "menace": "cxd4 puis Cxd4 : gagner le pion d4, car Cf3 est son seul défenseur",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "soutient d4 avec un pion : après cxd4 cxd4 le centre e5-d4 tient. C'est la ligne principale ; le cavalier b1 attendra d2 et le fou f1 ira en d3 ou e2."
   },
   {
    "san": "Nbd2",
    "pourquoi": "développe en gardant b3 pour le cavalier après cxd4 ; moins solide que c3, car d4 n'est pas défendu par un pion et les Noirs gagnent du temps avec Db6."
   }
  ],
  "erreurs": [
   {
    "san": "dxc5",
    "pourquoi": "abandonne le centre : après Fxc5 le fou noir sort avec attaque et Db6 vise f2 et b2. Les Noirs ont le développement et un centre libre."
   },
   {
    "san": "Nc3",
    "pourquoi": "le cavalier bloque le pion c2, qui ne peut plus défendre d4 : après cxd4 le pion est perdu, et le saut Cb5 ne rattrape rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 25
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3",
  "nom": "Variante d'échange",
  "sens": "Développe le fou sur la diagonale b1-h7, celle qui vise le futur roque noir : si les Noirs jouent trop vite ...Nf6 puis ...O-O, le fou pointera sur h7. Il prépare aussi Ne2 ou Nf3 et le petit roque.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Attaque tout de suite le centre : après dxc5, le fou de f8 reprend en c5 avec un bon développement. Cela casse la symétrie et donne du jeu aux Noirs, au prix d'un pion d5 qui peut devenir isolé : il faudra le défendre."
   },
   {
    "san": "Nf6",
    "pourquoi": "Développe une pièce vers le centre, contrôle e4 et prépare le roque. Attention ensuite au fou d3 qui regarde h7 : il faudra parfois placer un fou en d6 ou un cavalier en e4 pour parer cette pression."
   },
   {
    "san": "Bd6",
    "pourquoi": "Pose le fou face à face avec celui des Blancs, sur la même bonne diagonale vers h2. Il protège aussi la case e5 et prépare ...Nf6, ...O-O et ...c6 pour soutenir d5. Position solide et facile à jouer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -3
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5",
  "nom": "Variante d'échange, 4...c5",
  "sens": "Attaque le pion d4 tout de suite pour casser la symétrie : si dxc5, le fou de f8 reprend en c5 et sort avec gain de temps. Les Noirs acceptent un pion d5 potentiellement isolé en échange d'un jeu de pièces actif.",
  "menace": "cxd4, qui gagne du terrain au centre et oblige la dame blanche à reprendre en d4 ou laisse un pion d4 noir gênant.",
  "plan": [
   {
    "san": "Nf3",
    "pourquoi": "Développe en couvrant d4 : si cxd4, Cxd4 recentre le cavalier et le pion d5 des Noirs devient isolé et faible. Prépare le roque. Laisse aux Noirs le choix de maintenir la tension ou de l'échanger."
   },
   {
    "san": "c3",
    "pourquoi": "Renforce d4 avec un pion : les Blancs refusent de céder le centre. Si cxd4, cxd4 et la colonne c s'ouvre pour les tours. Le petit prix : le cavalier b1 ne peut plus aller en c3, il ira en d2."
   },
   {
    "san": "dxc5",
    "pourquoi": "Prend le pion et accepte le plan noir : après Fxc5, les Noirs sont bien développés mais leur pion d5 est isolé. Les Blancs joueront Cf3, O-O, Cc3 et viseront d5 à long terme. Simple, mais donne du temps aux Noirs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 12
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3",
  "nom": "Française, variante d'échange",
  "sens": "développe le cavalier en protégeant d4 et prépare le petit roque ; si les Noirs prennent en d4, le cavalier reprend au centre et le pion d5 reste isolé.",
  "plan": [
   {
    "san": "Nf6",
    "pourquoi": "Développe en protégeant d5 et prépare le roque. Garde la tension en c5 : ce sont les Blancs qui devront décider quoi faire de d4. Le fou f8 pourra ensuite sortir en d6 ou e7."
   },
   {
    "san": "c4",
    "pourquoi": "Chasse le fou d3 qui doit bouger une deuxième fois. Le pion c4 est bien soutenu par d5 et gêne le développement blanc. En échange, les Noirs renoncent à prendre en d4 et fixent leur pion d5."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 une deuxième fois. Si les Blancs prennent en c5, le fou f8 reprend en gagnant un temps. Laisse aux Blancs le choix de défendre d4 ou de l'échanger."
   }
  ],
  "erreurs": [
   {
    "san": "Bg4",
    "pourquoi": "Attaque le cavalier f3, mais après h3 le fou doit soit reculer, soit prendre en f3 : après Dxf3, les Noirs ont cédé leur bon fou pour un cavalier et la dame blanche vise déjà d5."
   },
   {
    "san": "Qe7+",
    "pourquoi": "Un échec sans suite : Fe2 le pare en développant, et la dame en e7 bloque le fou f8. Les Noirs auront perdu un temps et devront redéplacer la dame pour roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -9
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6",
  "nom": "Variante d'échange, 4.Fd3 c5",
  "sens": "Développe le cavalier vers le centre en soutenant le pion d5, attaqué deux fois par la dame d1 et le fou d3. Prépare le roque. Laisse volontairement la tension en c5 : les Noirs attendent de voir si les Blancs prennent, poussent ou protègent d4.",
  "menace": "cxd4, qui isole ou gagne le pion d4 si les Blancs ne font rien.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Solidifie d4 avec un pion : si ...cxd4 alors cxd4 et le centre reste intact. Ouvre aussi la diagonale a4-d1 pour la dame. Les Noirs pourront développer Fd6 et roquer ; la position restera symétrique et calme."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Si ...cxd4, Cxd4 reprend avec un cavalier centralisé et le pion d5 devient une cible isolée. Laisse aux Noirs le choix de résoudre la tension."
   },
   {
    "san": "Bb5+",
    "pourquoi": "Donne échec pour gêner le développement : après ...Cc6 ou ...Fd7 les Blancs jouent dxc5 et le pion d5 se retrouve isolé. Cela déplace toutefois le fou déjà développé, donc le gain reste modeste."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 18
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3",
  "nom": "Variante d'échange de la Défense française",
  "sens": "étaye d4 avec un pion : si le pion c5 prend en d4, le pion c3 reprend et le centre reste solide. Libère aussi la diagonale d1-a4 pour la dame.",
  "plan": [
   {
    "san": "Bd6",
    "pourquoi": "Développe le fou sur sa meilleure diagonale, face au fou blanc d3, et vise h2. Prépare le roque et garde l'option ...c4 ou ...cxd4 pour plus tard. Les Blancs joueront O-O et Re1 : la position reste symétrique et calme."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange tout de suite et fixe la structure : après cxd4, les Noirs ont un pion d5 isolé face au pion d4 isolé des Blancs. Ouvre la colonne c pour la tour et la case c6 pour le cavalier. Laisse aux Blancs une colonne c ouverte aussi : la partie se joue sur l'activité des pièces."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe en attaquant d4 une deuxième fois (avec le pion c5). Les Blancs doivent surveiller d4 et ne peuvent pas prendre en c5 sans donner du jeu. Laisse le fou f8 encore à développer, donc le roque attend un coup."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -5
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6",
  "nom": "Variante d'échange, système avec c3 et ...c5",
  "sens": "Développe le fou face au fou blanc et vise h2 ; prépare le roque tout en gardant l'option ...c4 ou ...cxd4.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Prend le pion c5 pour forcer le fou noir à reprendre (...Bxc5), ce qui lui fait perdre un temps et quitter la diagonale vers h2. La structure devient asymétrique : les Blancs ont un pion de plus au centre contre un pion isolé en d5 à cibler plus tard. Il faudra juste ne pas traîner à roquer ensuite."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout ; c'est la priorité absolue quand les fous sont déjà pointés vers les rois. Après ...O-O, les Blancs suivent par Re1 ou dxc5 selon ce que jouent les Noirs. Les Noirs gardent le choix entre ...c4 et ...cxd4, mais sans pression immédiate."
   },
   {
    "san": "Qe2+",
    "pourquoi": "Échec qui gêne le roque noir : si ...Qe7, échange des dames et partie calme ; si ...Be7, le fou revient sur une case passive. Attention toutefois : la dame en e2 bloque un moment le fou d3 et doit ensuite se repositionner."
   }
  ],
  "erreurs": [
   {
    "san": "a4",
    "pourquoi": "Coup de bord inutile qui ne développe rien et affaiblit b4. Après ...O-O et ...c4, le fou d3 est chassé en c2 et les Noirs gagnent de l'espace à l'aile dame gratuitement : les Blancs ont perdu un temps précieux."
   },
   {
    "san": "Be2",
    "pourquoi": "Recule le fou de sa meilleure diagonale sans raison : il ne regarde plus h7 et ne gêne plus le fou d6. Après ...O-O, puis dxc5 Bxc5, les Noirs sont mieux développés et plus actifs. Un fou bien placé ne se déplace pas deux fois sans motif."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 17
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5",
  "nom": "Variante d'échange de la Défense française",
  "sens": "Capture le pion c5 pour obliger le fou noir à reprendre : il perd un temps et quitte la diagonale d6-h2. La structure devient asymétrique, avec un pion noir isolé en d5 que les Blancs voudront attaquer plus tard.",
  "menace": "Garder le pion c5 : après c5-c6 ou la poussée b2-b4, le fou d6 serait chassé et les Noirs resteraient avec un pion de moins.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Reprend simplement le pion. Le fou reste actif sur la diagonale a7-g1, où il vise f2, et les Noirs peuvent roquer tranquillement. Le pion d5 est isolé mais il contrôle e4 et c4, et les pièces noires sont bien placées pour le défendre."
   },
   {
    "san": "Qe7+",
    "pourquoi": "Donne un échec qui empêche les Blancs de roquer tout de suite : ils doivent interposer une pièce ou jouer le roi. Les Noirs reprendront le pion c5 au coup suivant. Attention : la dame sur la colonne e peut ensuite gêner le roque noir, donc il faut la replacer rapidement."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer d'abord paraît naturel, mais les Blancs jouent c5xd6 : le fou est perdu pour un simple pion. Il faut d'abord reprendre en c5."
   },
   {
    "san": "Be7",
    "pourquoi": "Le fou recule au lieu de reprendre : les Blancs gardent le pion c5, le soutiennent avec Fe3 et b4, et les Noirs jouent avec un pion de moins sans aucune compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -1
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5",
  "nom": "Variante d'échange, structure du pion isolé",
  "sens": "Reprend le pion sans perdre de temps : le fou garde la grande diagonale vers f2 et le roque noir est prêt.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. La case g1 n'est plus visée par le fou noir une fois la tour en f1 pour couvrir f2. Ensuite les Blancs sortiront le cavalier b1 en d2 et regarderont le pion isolé d5."
   },
   {
    "san": "Qe2+",
    "pourquoi": "Donne un échec qui gêne les Noirs : s'ils parent avec le fou en e6 ou la dame en e7, leur développement se tord un peu. La dame prend aussi la colonne e ouverte. Mais attention, elle pourra être attaquée par une tour noire plus tard."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il retire la case g4 au fou et au cavalier noirs, pour que le cavalier f3 et le roi ne soient jamais clouéS ou harcelés. Les Blancs roquent ensuite tranquillement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 10
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O",
  "nom": "Défense française, variante d'échange",
  "sens": "Met le roi à l'abri et relie les tours. La tour f1 couvre f2, qui n'est donc plus une cible pour le fou c5. Les Blancs pourront ensuite jouer Cbd2, Cb3 et viser le pion isolé d5.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Même recette : le roi se cache, la tour f8 arrive sur la colonne e. Le pion d5 est isolé mais bien défendu par le cavalier f6 ; il donne aussi de l'espace aux pièces noires. Après le roque, Noirs peuvent jouer Cc6, Te8 et Fg4 pour gêner le cavalier f3."
   },
   {
    "san": "Nc6",
    "pourquoi": "Développe une pièce vers le centre : le cavalier regarde e5 et d4 et défend indirectement d5. Attention toutefois à Fb5 qui cloue le cavalier ; il faut donc roquer vite derrière."
   },
   {
    "san": "h6",
    "pourquoi": "Petit coup utile : il retire la case g5 au fou c1 et au cavalier f3, ce qui empêche un clouage gênant sur f6. Le prix : un temps de développement, donc à jouer seulement si on roque juste après."
   }
  ],
  "erreurs": [
   {
    "san": "Nbd7",
    "pourquoi": "Le cavalier bouche la diagonale du fou c8 et ne défend rien d'utile. Après Te1 les Blancs gagnent un temps sur la colonne e, puis De2 : le fou c5 doit reculer en e7 et le roi noir est encore au centre."
   },
   {
    "san": "Qc7",
    "pourquoi": "La dame sort trop tôt. Les Blancs répondent Ca3 ! puis Cb5 : la dame est chassée avec gain de temps et le cavalier vise d6 et a7. Les Noirs perdent du temps au lieu de roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -9
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O O-O",
  "nom": "Variante d'échange, position à pion isolé",
  "sens": "met le roi à l'abri avant la bataille du centre et relie les tours : la tour f8 pourra venir sur e8, la colonne ouverte, pendant que le pion d5 isolé reste couvert par le cavalier f6.",
  "plan": [
   {
    "san": "Bf4",
    "pourquoi": "Sort le fou de c1 avant de jouer Cbd2 : il contrôle la diagonale h2-b8 et empêche le fou noir de revenir en d6 sans échange. Il prépare Cbd2-b3 pour chasser le fou c5. Il laisse aux Noirs Cc6 et Te8, mais le fou f4 n'est pas gênant."
   },
   {
    "san": "h3",
    "pourquoi": "Enlève la case g4 au fou noir : le clouage Fg4 contre le cavalier f3 ne marche plus. Prépare tranquillement Cbd2, Cb3 et Te1. Il donne un temps aux Noirs pour Cc6 et Te8, mais sans cible claire."
   },
   {
    "san": "Re1",
    "pourquoi": "Prend la colonne e ouverte avant la tour noire et surveille la case e5. Prépare Fg5 et Cbd2 pour attaquer le pion d5. Il laisse Fg4 aux Noirs, qu'on chassera ensuite par h3 ou Fe2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 14
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O O-O Bf4",
  "nom": "Variante d'échange de la Défense française",
  "sens": "Développe le fou de c1 avant le cavalier dame : il prend la diagonale h2-b8 et empêche le fou noir de revenir en d6 sans échange. Il prépare Cbd2 puis Cb3 pour chasser le fou c5 et poser la question de sa case.",
  "plan": [
   {
    "san": "Bb6",
    "pourquoi": "Met le fou à l'abri tout de suite sur la diagonale a7-g1, avant que Cbd2-b3 ne le chasse. Depuis b6, il vise f2 et garde d4. Il laisse aux Blancs Cbd2 et Te1, mais sans gain de temps sur le fou."
   },
   {
    "san": "Nc6",
    "pouroi_typo_ignore": null,
    "pourquoi": "Développe le cavalier dame sur sa meilleure case, contrôle d4 et e5, et prépare Te8 pour prendre la colonne e ouverte. Il laisse aux Blancs Cbd2-b3 : le fou devra reculer en b6, mais ce n'est pas grave."
   },
   {
    "san": "Re8",
    "pourquoi": "Prend la colonne e ouverte, la seule du pion : la tour regarde e1 et gêne le Cbd2 (clouage futur sur la colonne). Il laisse aux Blancs Cbd2 et Te1 pour contester la colonne."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -14
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O O-O Bf4 Bb6",
  "nom": "Variante d'échange de la Française",
  "sens": "Retire le fou de c5 avant qu'un cavalier blanc ne l'attaque depuis b3 ou e4, et le garde sur la grande diagonale vers f2. De b6, il surveille aussi d4 et ne gêne plus le pion c5 ni la dame. Les Noirs disent : « développe comme tu veux, je ne te donnerai pas de tempo ».",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Prend la colonne ouverte e avant les Noirs. La tour regarde e8 et toute la colonne ; elle pourra gêner le fou ou le cavalier noir qui viendra en e4 ou e6. Les Noirs répondront souvent Nc6 puis Bg4 ou Re8."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier et contrôle e4. De d2 il peut aller en b3 pour s'approcher de d4 et c5, ou en f1-g3 pour soutenir l'aile roi. Il bouche la colonne d pour la dame, ce n'est pas grave : la dame ira en c2."
   },
   {
    "san": "Qc2",
    "pourquoi": "Aligne dame et fou d3 sur h7 : les Noirs doivent répondre h6 ou Nbd7-f8 pour couvrir ce point. Prépare aussi Nbd2 et Rae1. Attention : cela laisse aux Noirs Re8 et Bg4 avec une position très solide."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 23
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O O-O Bf4 Bb6 Re1",
  "nom": "Variante d'échange de la Défense française",
  "sens": "occupe la colonne e ouverte avant les Noirs : la tour surveille e8, e4 et e6, et gênera toute pièce noire qui s'y installera.",
  "plan": [
   {
    "san": "Nbd7",
    "pourquoi": "développe le cavalier sans bloquer la case c6 ni le fou c8. Il vise e5 et c5 ; les Noirs garderont ensuite c6 pour un pion afin de solidifier d5. Laisse aux Blancs le temps de jouer Nbd2 et h3."
   },
   {
    "san": "Bg4",
    "pourquoi": "sort le fou avant de bloquer avec ...e6 : il cloue le cavalier f3 et prépare ...Nbd7 ou ...Nc6. Les Blancs répondront souvent h3 ou Nbd2 pour chasser le fou."
   },
   {
    "san": "Re8",
    "pourquoi": "conteste tout de suite la colonne e : les tours se regardent et un échange sur e1 ou e8 simplifie la partie. Laisse aux Blancs la possibilité de prendre l'initiative avec Nbd2 et Ne5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -11
 },
 {
  "coups": "e4 e6 d4 d5 exd5 exd5 Bd3 c5 Nf3 Nf6 c3 Bd6 dxc5 Bxc5 O-O O-O Bf4 Bb6 Re1 Nbd7",
  "nom": "Variante d'échange, système Fd3-c3",
  "sens": "Développe le dernier cavalier sans boucher la case c6 ni la diagonale du fou c8. Il regarde e5 et c5, et prépare Te8 ou Cc5 pour chasser le fou d3. Les Noirs gardent c6 pour un pion afin de bétonner d5.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Même idée que les Noirs : le cavalier sort sans gêner la dame ni le fou. Il surveille e4 et c4, et pourra sauter en b3 ou f1-g3. Il libère aussi la case c1 pour la tour. Les Noirs répondront Te8 ou Cc5."
   },
   {
    "san": "h3",
    "pourquoi": "Petit coup utile : il ôte la case g4 au cavalier f6 et au fou c8, et donne au roi une case d'air en h2. Les Blancs gardent ainsi leur fou f4 tranquille. Cela laisse aux Noirs le temps de jouer Te8 ou Ch5."
   },
   {
    "san": "Qc2",
    "pourquoi": "Place la dame sur la diagonale b1-h7 avec le fou d3 : les Blancs visent h7 et surveillent e4. La dame quitte aussi la colonne d, ce qui évite les attaques de la tour f8-d8. Attention : les Noirs peuvent répondre Cc5 pour chasser le fou."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 21
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6",
  "sens": "prépare Fb5 pour échanger le mauvais fou des Noirs : après Fxb5 ils reprendraient du pion a6, et le fou blanc disparaît avec lui",
  "plan": [
   {
    "san": "c4",
    "pourquoi": "attaque d5 tout de suite : les Noirs ont pris du temps avec a6, les Blancs ouvrent le centre avant que le fou n'arrive en b5. Si dxc4, Fxc4 développe avec gain de temps ; les Noirs n'ont plus le temps pour Fb5."
   },
   {
    "san": "c3",
    "pourquoi": "solidifie d4 et garde le centre fermé. Ensuite Fd3 : si Fb5, les Blancs peuvent refuser l'échange avec Fc2 ou Fe2 selon le cas et garder leur bon fou."
   },
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur la diagonale vers h7 et prépare le roque. Laisse Fb5 aux Noirs, mais après Fxd3 Dxd3 la dame est active et les Blancs ont de l'avance en développement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 50
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4",
  "sens": "frappe le pion d5 avant que les Noirs n'aient installé leur fou en b5 : le centre s'ouvre pendant que les pièces noires sont encore mal placées, et chaque échange sur c4 ou d5 donne un coup de développement aux Blancs.",
  "menace": "cxd5 exd5 puis Cc3 et Fd3 : les Blancs gagnent du temps contre le pion isolé en d5, et le fou d7 bloque toujours la case naturelle du cavalier b8.",
  "plan": [
   {
    "san": "Bb4+",
    "pourquoi": "sort le fou avec échec : les Blancs doivent répondre tout de suite (Cc3 ou Fd2), et les Noirs gagnent le temps nécessaire pour reprendre en c4 ou jouer c5 ensuite. Si Fd2, le fou échange une pièce passive contre une pièce active."
   },
   {
    "san": "dxc4",
    "pourquoi": "accepte le pion : après Fxc4 les Blancs se développent avec tempo, mais les Noirs répondent b5 puis Fb7 ou c5, et le fou en c4 devient une cible. C'est l'esprit de a6 : chasser le fou blanc."
   },
   {
    "san": "c5",
    "pourquoi": "contre-attaque le centre blanc en d4 sans toucher à d5 : les Noirs ne cèdent rien et ouvrent la colonne c pour la dame. Le fou d7 pourra revenir en c6 une fois d5 solidifié."
   }
  ],
  "erreurs": [
   {
    "san": "Bc6",
    "pourquoi": "le fou cherche b5, mais c5 ! ferme la case d'un coup : après Fb5 Fxb5 axb5 les Noirs ont des pions doublés, plus de fou blanc, et leur dame garde la case d5 toute seule."
   },
   {
    "san": "Be7",
    "pourquoi": "développe sans échec : les Blancs jouent Cc3 et prennent d5 au moment choisi. Le fou en e7 ne fait rien d'utile, alors que Fb4+ forçait une réponse et gagnait un temps."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -51
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+",
  "sens": "Donne échec pour obliger les Blancs à réagir avant de pouvoir reprendre en c4 ou jouer c5 : le fou sort en gagnant un temps, et si on lui propose l'échange en d2, il troque une pièce peu utile dans la Française contre un bon défenseur blanc.",
  "plan": [
   {
    "san": "Nc3",
    "pourquoi": "Pare l'échec en développant une pièce : le cavalier couvre d5 et e4 et garde la paire de fous. Les Noirs prendront sans doute en c3 (…Fxc3+ bxc3) pour abîmer les pions, mais les Blancs obtiennent un centre large et le fou c1 reste actif. C'est le coup le plus ambitieux."
   },
   {
    "san": "Bd2",
    "pourquoi": "Pare l'échec en proposant l'échange des fous. Si …Fxd2+ Cbxd2, les Blancs ont développé deux pièces et gardent une structure saine. C'est plus simple et plus sûr que Cc3, mais on laisse aux Noirs l'échange qu'ils cherchaient."
   }
  ],
  "erreurs": [
   {
    "san": "Qd2",
    "pourquoi": "Interpose la dame sur la case du fou b4 : après …Fxd2+ Fxd2 la dame disparaît contre un simple fou. Perte d'une pièce entière, partie pratiquement finie."
   },
   {
    "san": "Nfd2",
    "pourquoi": "Recule le bon cavalier et laisse la case h4 sans défense : …Dh4 ! attaque f2 et d4 à la fois. Les Blancs sont déjà en grande difficulté, par exemple a3 Fxd2+ et le centre s'écroule."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 51
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3",
  "sens": "Pare l'échec en développant une pièce : le cavalier couvre d5 et e4 et évite d'affaiblir les cases noires par c3 ou de reculer le fou. Les Blancs acceptent des pions doublés sur c3 contre un centre large et le fou c1 actif.",
  "menace": "a3 pour chasser le fou b4 : il devra prendre en c3 ou perdre du temps en reculant. Et c4xd5 ouvre le centre pendant que les Noirs sont peu développés.",
  "plan": [
   {
    "san": "dxc4",
    "pourquoi": "Prend le pion c4 tout de suite et supprime la tension au centre. Le fou d7 pourra aller en c6 pour viser le roi par la grande diagonale. Les Blancs reprendront le pion avec Fxc4, mais leur centre perd le pion d5 à presser et le cavalier c3 reste cloué."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le pion c, qui pourra pousser en c5 pour attaquer d4. Si cxd5, Cxd5 reprend en bonne position centrale. Le roi pourra bientôt roquer."
   },
   {
    "san": "c5",
    "pourquoi": "Attaque la base du centre blanc en d4 : avec le fou b4, le cavalier c3 est pris en tenaille. Laisse aux Blancs le choix de prendre en d5 ou en c5, mais le centre blanc commence à craquer."
   }
  ],
  "erreurs": [
   {
    "san": "Nc6",
    "pourquoi": "Développe mais trop vite : après cxd5 exd5 a3, le fou doit prendre en c3 et le pion d5 devient isolé et faible devant un centre blanc solide. Mieux vaut d'abord régler la question de d5 avec dxc4."
   },
   {
    "san": "c6",
    "pourquoi": "Trop passif : le pion c6 bloque la case naturelle du fou d7 et renonce à attaquer d4. Après a3 Fxc3+ bxc3, les Blancs ont un centre massif, deux fous et l'initiative sans rien donner."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -62
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4",
  "sens": "Capture le pion c4 et supprime la tension au centre : les Blancs n'ont plus de pion d5 à viser, le cavalier c3 reste cloué par le fou b4, et le fou d7 pourra aller en c6 sur la grande diagonale.",
  "menace": "Garder le pion c4 avec ...b5 si les Blancs ne le reprennent pas tout de suite.",
  "plan": [
   {
    "san": "Bxc4",
    "pourquoi": "Récupère immédiatement le pion. Le fou se développe sur une bonne diagonale, vise f7 et e6, et les Blancs gardent leur avance de développement avec un centre d4-e5 solide. Les Noirs n'ont plus le temps de jouer ...b5 pour conserver le pion."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Déclouer le cavalier semble naturel, mais ça laisse le temps de ...b5 : les Noirs gardent le pion c4 pour de bon. Après a4 Fa5, le pion b5 tient et les Blancs ont donné un pion pour rien."
   },
   {
    "san": "a3",
    "pourquoi": "Chasse le fou, mais après ...Fxc3+ bxc3 les pions blancs c3 et c4 sont doublés et faibles, et ...b5 garde le pion c4. Le centre blanc est abîmé et le pion est perdu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 68
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4",
  "sens": "Reprend le pion sans attendre : le fou sort sur une diagonale active, regarde f7 et e6, et les Blancs gardent leur avance de développement derrière le centre d4-e5.",
  "menace": "Rien d'immédiat, mais les Blancs sont prêts à roquer et à jouer d4-d5 ou Fd3 pour exploiter le retard des Noirs.",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "Propose l'échange des fous : le fou noir de d7 était passif, le fou blanc de c4 est la meilleure pièce blanche. Si les Blancs prennent, les Noirs reprennent avec le pion a6 et ouvrent la colonne a. Si les Blancs s'écartent, le fou noir reste actif sur la diagonale a6-f1."
   },
   {
    "san": "h6",
    "pourquoi": "Petit coup de sécurité : il retire la case g5 au cavalier et au fou blancs, pour que ...Ce7 et ...Cg6 puissent suivre sans être gênés. Il concède encore un temps, mais évite les attaques sur f7."
   },
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier vers g6 ou f5, d'où il harcèle le pion e5 et le centre blanc. Il faut ensuite roquer vite ; les Blancs garderont l'initiative, mais les Noirs ont un plan."
   }
  ],
  "erreurs": [
   {
    "san": "Nc6",
    "pourquoi": "Semble naturel, mais le cavalier bloque le pion c7 : les Noirs ne pourront plus jouer ...c5 pour contester d4. Après 0-0 Ce7 Fd3, les Blancs ont tout développé et visent le roi noir sur la diagonale b1-h7."
   },
   {
    "san": "b5",
    "pourquoi": "Trop tard pour chasser le fou : il recule en d3, bien placé vers h7. Le pion b5 affaiblit a6 et c6, et le fou d7 reste enfermé. Les Blancs roquent et dominent sans avoir rien perdu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -68
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5",
  "sens": "Propose l'échange des fous pour liquider la meilleure pièce blanche contre un fou noir qui respirait mal. Si les Blancs prennent, le pion a6 reprend et la colonne a s'ouvre pour la tour. Si les Blancs reculent, le fou noir reste bien placé sur la diagonale a6-f1.",
  "menace": "Fxc4, échange qui enlève aux Blancs leur fou actif et laisse le fou b4 cloué sur le cavalier c3.",
  "plan": [
   {
    "san": "Bb3",
    "pourquoi": "Refuse l'échange en gardant le fou sur la diagonale a2-g8, pointé vers e6 et f7. Le fou noir en b5 reste sans adversaire et peut devenir une cible pour a3 et Cd2-c4 plus tard. Les Blancs conservent leur meilleure pièce et un net avantage d'espace."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe une pièce avec gain de temps en attaquant la dame d8 : les Noirs doivent répondre (Ce7 ou f6) avant d'échanger en c4. Les Blancs acceptent de perdre le fou c4 mais gagnent du développement et roquent vite."
   }
  ],
  "erreurs": [
   {
    "san": "Bxb5+",
    "pourquoi": "Fait exactement ce que les Noirs veulent : axb5 ouvre la colonne a pour la tour a8, et le fou noir b4 prend ensuite en c3 pour doubler les pions blancs. Les Blancs ont échangé leur meilleure pièce contre la plus passive des Noirs."
   },
   {
    "san": "Nd2",
    "pourquoi": "Semble couvrir c4 et b3, mais le cavalier quitte la défense du pion d4 : Dxd4 gagne un pion net, et après Fxb5+ axb5 les Noirs ont aussi la colonne a. Avant de reculer une pièce, vérifier ce qu'elle ne défend plus."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 71
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3",
  "sens": "Garde son fou sur la diagonale a2-g8, braqué sur e6 et f7, au lieu de l'échanger contre le fou noir. Avec Cg5 en réserve, la case f7 devient un point faible, et le fou b5 n'a plus personne en face.",
  "menace": "Cg5 pour attaquer f7 et e6 avec le fou b3 ; si les Noirs ne s'occupent pas vite du roi, Cxf7 ou d5 peuvent suivre.",
  "plan": [
   {
    "san": "Ne7",
    "pourquoi": "Développe le cavalier sans bloquer le fou, prépare le petit roque et couvre d5 et f5. Après ...O-O, la pression sur f7 tombe à plat. C'est le coup le plus solide : les Blancs gardent plus d'espace, mais les Noirs se mettent à l'abri."
   },
   {
    "san": "Nd7",
    "pourquoi": "Sort l'autre cavalier, prépare ...Ce7 et ...c5 pour attaquer le centre. Le cavalier d7 surveille e5 et c5. Les Noirs restent un peu derrière en espace, il faudra ensuite roquer vite."
   },
   {
    "san": "c5",
    "pourquoi": "Attaque tout de suite le centre blanc en d4 et ouvre la diagonale au fou b4. Le but est de casser la chaîne d4-e5 avant que les Blancs ne finissent leur développement, mais le roi noir reste au centre un moment de plus."
   }
  ],
  "erreurs": [
   {
    "san": "Bd7",
    "pourquoi": "Le fou revient d'où il est parti : une perte de temps. Les Blancs jouent Cg5 et après ...h6 le sacrifice Cxf7 fonctionne, car le fou b3 vise justement f7 et le roi noir n'a plus de défenseur."
   },
   {
    "san": "h6",
    "pourquoi": "Un coup qui ne développe rien et qui veut empêcher Cg5. Les Blancs répondent d5 : le pion e6 est attaqué, et après ...exd5 Fxd5 le centre noir s'écroule avec le fou blanc qui regarde b7 et f7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -67
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3 Ne7",
  "sens": "Développe le cavalier sans boucher la diagonale du fou de cases blanches, prépare le petit roque et surveille d5 et f5. Une fois roqué, le roi noir n'a plus rien à craindre sur f7.",
  "plan": [
   {
    "san": "a4",
    "pourquoi": "Chasse le fou b5 avec gain de temps : il doit choisir entre prendre en c3 (ce qui donne la paire de fous aux Blancs) ou reculer. Les Blancs gagnent de l'espace à l'aile dame et gardent l'initiative tant que les Noirs n'ont pas roqué."
   },
   {
    "san": "Bd2",
    "pourquoi": "Lève le clouage du cavalier c3 et prépare a4 ou a3 dans de bonnes conditions. Coup calme : il laisse aux Noirs le temps de roquer, mais garde une position d'espace saine."
   },
   {
    "san": "Bg5",
    "pourquoi": "Développe le fou en attaquant le cavalier e7, ce qui gêne le roque et oblige les Noirs à réagir (…h6 ou …Dd7). Sinon les Noirs roquent et les Blancs ont développé une pièce de plus."
   }
  ],
  "erreurs": [
   {
    "san": "Ng5",
    "pourquoi": "L'attaque sur f7 ne mène à rien : le cavalier e7 et le roque protègent tout. Après …h6 le cavalier doit revenir en e4, puis …Cf5 attaque d4 : les Blancs ont perdu deux temps pour rien."
   },
   {
    "san": "Be3",
    "pourquoi": "Le fou est mal placé : après …c5 la pression sur d4 monte, et après a3 les Noirs prennent en c3 et doublent les pions blancs. Le fou en e3 ne contrôle ni g5 ni la grande diagonale, il bloque surtout la colonne e."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 62
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3 Ne7 a4",
  "sens": "attaque le fou b5 avec le pion : il doit bouger tout de suite, sinon il est pris. Le pion a4 gagne aussi de l'espace à l'aile dame et prépare Fd2 ou 0-0 avec l'initiative.",
  "menace": "axb5 gagne le fou",
  "plan": [
   {
    "san": "Bc6",
    "pourquoi": "Recule sur la grande diagonale : le fou reste actif et défend b7. Ensuite les Noirs jouent Fxc3+ puis 0-0 pour mettre le roi à l'abri. Les Blancs gardent plus d'espace, mais rien ne tombe."
   },
   {
    "san": "Bd7",
    "pourquoi": "Recule plus modestement : le fou garde un œil sur a4 et c6 et libère b5 pour Cbc6 plus tard. Le fou est moins actif, mais la case c6 reste libre pour le cavalier dame."
   }
  ],
  "erreurs": [
   {
    "san": "Bxc3+",
    "pourquoi": "Prendre en c3 ne sauve pas le fou b5 : après bxc3 Fc6 0-0, les Noirs ont donné la paire de fous pour rien et les Blancs dominent le centre et la colonne b."
   },
   {
    "san": "c5",
    "pourquoi": "Oublie que le fou b5 est attaqué : axb5 le gagne net. Toujours répondre à une menace directe avant de jouer ailleurs."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -61
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3 Ne7 a4 Bc6",
  "sens": "Recule le fou sur la grande diagonale pour qu'il reste actif : il vise f3 et g2, défend b7 et prépare Fxc3+ suivi du petit roque.",
  "menace": "Fxf3 : si le pion g2 reprend, la structure blanche est abîmée ; si la dame reprend, elle quitte la défense du pion d4 (…Cc6 et …Cd5 suivent).",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri avant tout. Après …Fxf3 Dxf3, la dame est active et d4 reste tenable car la tour f1 et le fou b3 travaillent. Les Blancs gardent plus d'espace et le fou b3 regarde e6 ; les Noirs devront encore roquer."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "Développe une pièce mais oublie la menace. Après …Fxf3 Dxf3 Cc6, le pion d4 est attaqué deux fois et mal défendu : les Blancs perdent du matériel ou doivent se tordre pour sauver le centre."
   },
   {
    "san": "Kf1",
    "pourquoi": "Semble éviter le roque forcé, mais …Fxf3 gxf3 détruit l'abri du roi, puis …Cc6 attaque d4. Le roi blanc reste coincé au centre, la tour h1 ne sortira pas de sitôt."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 66
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3 Ne7 a4 Bc6 O-O",
  "sens": "Met le roi à l'abri avant de lancer des attaques. La tour arrive sur f1 et protège f3 par la dame après un échange. Le fou b3 reste braqué sur e6 et les Noirs, eux, n'ont pas encore roqué.",
  "menace": "Rien d'immédiat, mais Cg5 (avec Dh5) vise h7 et f7 dès que les Noirs se relâchent.",
  "plan": [
   {
    "san": "Bd5",
    "pourquoi": "Propose l'échange du fou b3, la pièce blanche la plus gênante contre e6. Après Fxd5 Cxd5, le cavalier trouve une case centrale solide et le roque noir devient sûr."
   },
   {
    "san": "h6",
    "pourquoi": "Enlève la case g5 au cavalier et au fou blancs. C'est une précaution utile avant de roquer : plus de Cg5 ni de Fg5 qui cloue le cavalier e7."
   },
   {
    "san": "Bxf3",
    "pourquoi": "Supprime le cavalier qui va en g5 et affaiblit la garde de d4. En échange, la dame blanche arrive sur f3, active ; les Noirs doivent vite roquer et jouer …c5 pour attaquer le centre."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer tout de suite paraît naturel, mais après Ch4 ! le fou c6 est traqué et le cavalier menace f5 ou g6. Sur …Fd5 Cxd5, les Noirs perdent la paire de fous et la pression sur e6 reste."
   },
   {
    "san": "Nd5",
    "pourquoi": "Le cavalier bloque le fou c6 et laisse g5 libre : Cg5 attaque h7 et f7, puis Dh5 vient. Les Noirs n'ont pas roqué et doivent se défendre en catastrophe."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -65
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 a6 c4 Bb4+ Nc3 dxc4 Bxc4 Bb5 Bb3 Ne7 a4 Bc6 O-O Bd5",
  "sens": "Propose l'échange du fou b3, la pièce blanche la plus gênante contre e6. Après Fxd5 Cxd5, le cavalier trouve une case centrale solide et le roque noir devient sûr.",
  "menace": "Prendre en b3 (Fxb3), puis Dxb3 Cbc6 : les Noirs ont échangé le fou qui vise e6 et développent tranquillement.",
  "plan": [
   {
    "san": "Bg5",
    "pourquoi": "Développe en clouant le cavalier e7 sur la dame. Si les Noirs prennent en b3, Dxb3 et Fxe7 gagne du temps ; ils doivent d'abord régler le clouage avant de roquer."
   },
   {
    "san": "Nxd5",
    "pourquoi": "Échange le fou gênant au centre plutôt que de laisser prendre en b3. Après Cxd5, le fou b3 reste actif contre d5 et e6, et c4 ou Fg5 suivent pour chasser le cavalier."
   }
  ],
  "erreurs": [
   {
    "san": "Bxd5",
    "pourquoi": "Rend service aux Noirs : après Cxd5, le cavalier s'installe au centre, le roque noir est sûr et le fou b3, meilleure pièce blanche, a disparu. Cg5 ensuite est repoussé par h6."
   },
   {
    "san": "Re1",
    "pourquoi": "Trop calme : Fxb3 Dxb3 Cbc6 et les Noirs ont fait disparaître le fou b3 sans rien céder. Il fallait d'abord créer une menace (Fg5) ou échanger en d5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 71
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6",
  "sens": "coup d'attente : retire la case g5 au cavalier et au fou blancs, et prépare plus tard un cavalier en f5 ou h7 ; mais il ne touche pas au centre, alors que c5 devra être joué de toute façon.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur sa meilleure diagonale, vers h7 et le roi noir. Il prépare le roque et laisse c3 pour soutenir d4 quand les Noirs joueront c5."
   },
   {
    "san": "c3",
    "pourquoi": "renforce d4 avant que c5 ne l'attaque. Cela laisse le cavalier b1 aller en d2, et le centre e5-d4 tient sans effort."
   },
   {
    "san": "h4",
    "pourquoi": "gagne de l'espace à l'aile roi et fixe h6 comme cible : si les Noirs roquent petit, g5 puis h5 peuvent ouvrir la colonne h. Cela demande de garder son propre roi au centre ou de roquer grand."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "ouvre le centre trop tôt : après dxc4 Fxc4 Fc6, les Noirs ont échangé leur pion d5 et leur fou, souvent mauvais dans la française, arrive sur la longue diagonale et vise f3 et g2. Le pion d4 devient isolé et faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 61
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3",
  "sens": "place le fou sur la diagonale b1-h7, braqué vers h7 et le futur roque noir. Il libère la case f1 pour roquer et garde c3 libre au pion, qui viendra soutenir d4 dès que les Noirs attaqueront le centre par c5.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "attaque la base de la chaîne de pions blancs : d4 est la pierre angulaire qui tient e5. C'est le plan de toute Défense française. Après c3, les Noirs continueront avec Cc6 et Db6 pour mettre d4 sous pression. Le fou d7 est déjà prêt à aller en b5 pour échanger le fou d3 qui vise h7."
   },
   {
    "san": "a6",
    "pourquoi": "prépare tranquillement c5 en empêchant Fb5 après un futur Cc6, et garde la case b5 pour son propre fou. Coup utile avant d'engager le centre."
   },
   {
    "san": "g5",
    "pourquoi": "gagne de l'espace à l'aile roi et interdit Ff4 ou Fg5. C'est plus risqué : les pions avancés autour du roi deviennent des cibles si les Noirs roquent court. À réserver si l'on comprend que le roi ira plutôt à l'aile dame."
   }
  ],
  "erreurs": [
   {
    "san": "c6",
    "pourquoi": "bloque la case c5 et renonce au plan principal. Les Noirs n'attaquent plus d4 et les Blancs jouent c4 : ils ouvrent le centre à leur guise alors que les Noirs n'ont presque rien développé. Après Fb4 Cc3, les Blancs ont plus d'espace et un jeu facile."
   },
   {
    "san": "Ne7",
    "pourquoi": "développe un cavalier, mais au mauvais moment : il bouche la diagonale du fou f8 et ne touche pas d4. Les Blancs jouent c3 et roquent sans gêne, puis Dc2 et Fxh7 devient une menace réelle si les Noirs roquent court. Il fallait d'abord frapper d4 par c5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -51
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5",
  "nom": "Défense française, variante d'avance (ligne avec 3...Fd7 et 4...h6)",
  "sens": "attaque d4, la base de la chaîne de pions blancs : si d4 tombe, e5 ne tient plus. Les Noirs préparent Cc6 et Db6 pour accentuer la pression sur ce point.",
  "menace": "cxd4 pour liquider la base de la chaîne ; après Cxd4, le fou f8 vient en c5 avec gain de temps sur le cavalier.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "soutient d4 avec un pion : c'est le coup standard de l'Avance. Après cxd4 cxd4, la chaîne d4-e5 reste intacte et le fou d3 garde sa diagonale vers h7. Les Noirs continueront Cc6 et Db6, mais d4 est désormais bien défendu."
   },
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri avant de s'occuper du centre. Si cxd4, Blancs reprennent Cxd4 : le pion e5 reste tenu par le cavalier et la position est ouverte pour les pièces blanches déjà développées."
   },
   {
    "san": "dxc5",
    "pourquoi": "prend le pion et change de plan : plus de chaîne à défendre. Après Fxc5, les Blancs gardent e5 qui gêne le cavalier g8, et pourront jouer O-O puis Fe3 ou b4 pour chasser le fou c5."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "coup de pion inutile sur l'aile alors que d4 est attaqué. Après Cc6 c3 cxd4, les Noirs ont gagné un temps : la pression sur la base de la chaîne est maximale et les Blancs n'ont rien construit en échange."
   },
   {
    "san": "Be2",
    "pourquoi": "recule un fou déjà bien placé et laisse d4 sans soutien. Après cxd4 Cxd4 Fc5, le fou noir attaque le cavalier d4 et l'initiative passe aux Noirs : les Blancs ont perdu deux temps pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 57
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3",
  "nom": "Défense française, variante d'Avance",
  "sens": "soutient d4 avec un pion : c'est le coup standard de l'Avance. Après cxd4 cxd4, la chaîne d4-e5 reste intacte et le fou d3 garde sa diagonale vers h7. Les Noirs continueront Cc6 et Db6, mais d4 est désormais bien défendu.",
  "plan": [
   {
    "san": "Nc6",
    "pourquoi": "Développe le cavalier et attaque d4 une deuxième fois. C'est le coup naturel de la Française : la pression sur d4 oblige les Blancs à surveiller leur centre. Prépare Db6 pour viser aussi b2."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 avec la dame et vise b2 : les Blancs doivent défendre le centre au lieu d'attaquer. Prépare cxd4 au bon moment, quand d4 sera réellement menacé."
   },
   {
    "san": "c4",
    "pourquoi": "Ferme le centre en chassant le fou d3. Le fou perd sa belle diagonale vers h7 et le roque noir respire mieux. En échange, les Noirs renoncent à la pression sur d4 : c'est un choix de tranquillité."
   }
  ],
  "erreurs": [
   {
    "san": "cxd4",
    "pourquoi": "Échanger trop tôt libère les Blancs : après cxd4, le pion d4 est solide et le cavalier b1 vient en c3 sans problème. Les Noirs perdent la tension sur d4, leur principale arme dans l'Avance. Il faut d'abord attaquer d4 avec Cc6 et Db6, et échanger seulement quand cela gagne quelque chose."
   },
   {
    "san": "Qc8",
    "pourquoi": "Coup passif : la dame ne fait rien sur c8 et ne menace rien. Les Blancs roquent tranquillement et jouent Te1 pour renforcer e5. Les Noirs ont perdu un temps précieux alors que la dame doit aller en b6, où elle attaque d4 et b2."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -56
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6",
  "nom": "Française, variante d'avance",
  "sens": "Développe le cavalier vers le centre et attaque d4 une deuxième fois, en lui laissant le soutien du pion c5. Prépare Db6 pour viser aussi b2 et accentuer la pression sur d4.",
  "menace": "cxd4 puis Db6 : si les Blancs ne gardent pas d4 avec soin, le pion central et b2 deviennent des cibles.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie les tours avant toute bagarre au centre. Le pion d4 reste gardé par c3 et le cavalier f3, donc inutile de paniquer : les Noirs peuvent prendre cxd4, mais cxd4 reconstruit la chaîne."
   },
   {
    "san": "a3",
    "pourquoi": "Prépare b4 pour gagner de l'espace à l'aile dame et chasser le pion c5, ce qui soulage d4. Empêche aussi Cb4 qui viendrait échanger le bon fou d3."
   },
   {
    "san": "dxc5",
    "pourquoi": "Rend d4 moins vulnérable en liquidant le pion attaqué. Les Blancs gardent le pion e5 qui bloque la Française, et le fou d3 vise ensuite h7. En échange, les Noirs reprennent sur c5 avec un bon développement."
   }
  ],
  "erreurs": [
   {
    "san": "h3",
    "pourquoi": "Perd un temps sur un coup inutile : après cxd4 cxd4 Db6, les Noirs attaquent d4 et b2 en même temps. Les Blancs n'ont plus la ressource Cc3 ni d'autre défense simple : l'avantage s'évapore."
   },
   {
    "san": "g3",
    "pourquoi": "Affaiblit la case f3 et ne gagne rien. Même punition : cxd4 cxd4 Db6, double attaque sur d4 et b2, et les Blancs sont en difficulté."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 63
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O",
  "sens": "met le roi à l'abri derrière ses pions et relie les tours ; les Blancs n'ont plus rien à craindre avant de pousser au centre ou à l'aile roi",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "prépare b5 pour gagner de l'espace à l'aile dame, là où les Noirs sont les plus forts grâce au pion c5. Cela enlève aussi la case b5 au cavalier ou au fou blanc. Les Blancs peuvent répondre dxc5 ou Te1, mais ils n'ont rien de pressé."
   },
   {
    "san": "Qc7",
    "pourquoi": "la dame appuie c5 et regarde e5, le pion de base des Blancs. Elle laisse la case d8 libre pour une tour et prépare cxd4 au bon moment. Attention : elle quitte la défense de d5, donc gardez toujours e6 et le fou d7 en place."
   },
   {
    "san": "cxd4",
    "pourquoi": "simplifie le centre : après cxd4, le pion d4 blanc devient une cible pour Cge7-f5 et la dame en b6. Les Noirs cèdent la tension, mais ils savent clairement où attaquer : d4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -64
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6",
  "sens": "prépare la poussée b5 pour gagner de l'espace à l'aile dame, là où les Noirs ont leur jeu grâce au pion c5. La case b5 est aussi retirée au cavalier et au fou blancs, qui ne pourront plus s'y installer.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "renforce le pion e5, la clé de toute la structure blanche. La tour quitte f1 avant que les Noirs n'ouvrent la colonne f par f6. Elle libère aussi f1 pour le fou ou le cavalier si besoin. Les Noirs répondent b5 ou Db6."
   },
   {
    "san": "dxc5",
    "pourquoi": "échange le pion d4 avant que les Noirs ne le mettent sous pression avec Db6. Après Fxc5, le fou noir est sorti, mais les Blancs gagnent un temps avec b4 ou Cbd2-b3 pour le chasser. Le centre blanc tient encore sur e5."
   },
   {
    "san": "Qe2",
    "pourquoi": "défend e5 une fois de plus et relie les tours. La dame surveille aussi la case b5 : si b5 vient, les Blancs pourront l'attaquer par a4. Mais la dame peut être gênée plus tard par un cavalier noir sur f4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 59
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1",
  "sens": "renforce le pion e5, la clé de toute la structure blanche. La tour quitte f1 avant que les Noirs n'ouvrent la colonne f par f6, et libère f1 pour le fou ou le cavalier.",
  "plan": [
   {
    "san": "Qc7",
    "pourquoi": "Attaque e5 une deuxième fois avec le cavalier c6. Les Blancs doivent surveiller leur pion central. La dame reste souple : elle peut aussi aller sur b6 plus tard. Les Noirs préparent Cge7 et f6 pour casser le centre."
   },
   {
    "san": "cxd4",
    "pourquoi": "Échange tout de suite sur d4 : après cxd4 le pion c3 disparaît et le pion d4 devient une cible fixe pour Db6 et Cc6. Attention : les Blancs gagnent la case c3 pour leur cavalier."
   },
   {
    "san": "Qb6",
    "pourquoi": "Attaque d4 et b2 en même temps. Le pion b2 gêne le fou c1. Les Blancs doivent défendre d4 par Fe3 ou Ca3 : un développement moins naturel."
   }
  ],
  "erreurs": [
   {
    "san": "Nge7",
    "pourquoi": "Le cavalier bloque le fou f8 et laisse les Blancs jouer dxc5 : le pion c5 est perdu temporairement, et b4 vient ensuite pour le garder. Les Noirs perdent du temps à le récupérer."
   },
   {
    "san": "g5",
    "pourquoi": "Affaiblit le roque noir avant même de développer les pièces. Après h3 et Cbd2, les Blancs sont prêts à ouvrir le jeu, et le roi noir n'a plus d'abri sûr."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -58
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1 Qc7",
  "sens": "ajoute une deuxième attaque sur e5 et met la dame sur la diagonale b8-h2, tout en restant souple (b6 plus tard). Elle prépare Cge7 puis f6 pour attaquer le pion e5 une troisième fois.",
  "menace": "…c4 pour chasser le fou d3 et gagner de l'espace, suivi de …Cge7 et …f6 contre e5.",
  "plan": [
   {
    "san": "dxc5",
    "pourquoi": "Supprime la tension au centre : la dame n'attaquera plus par …c4 et le pion e5 devient facile à tenir avec Ff4 ou Cbd2-b3. Après …Fxc5, les Blancs gagnent un temps avec b4 ou Cb3 pour chasser le fou. Le pion e5 reste un coin dans la position noire."
   },
   {
    "san": "Bc2",
    "pourquoi": "Retire le fou avant que …c4 ne le chasse de force. Il reste sur la diagonale b1-h7, visant h7 pour une future attaque sur le roi. Laisse aux Noirs le choix de prendre en d4, après quoi cxd4 garde le centre."
   },
   {
    "san": "a3",
    "pourquoi": "Prépare b4 pour gagner de l'espace à l'aile dame et soutenir d4 par c5 plus tard. Contrôle b4 au cas où le cavalier c6 voudrait y sauter. Un coup calme : les Noirs peuvent continuer …Cge7 sans problème immédiat."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 66
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1 Qc7 dxc5",
  "sens": "Échange le pion d4 contre le pion c5 pour supprimer la tension au centre : les Noirs ne pourront plus jouer …c4 ni …cxd4. Le pion e5 reste seul mais facile à soutenir avec Ff4 ou Cbd2-b3, et il gêne toujours le camp noir.",
  "menace": "Garder le pion c5 en le soutenant par b4 : si les Noirs ne le reprennent pas tout de suite, le fou f8 reste enfermé et les Blancs ont un pion de plus.",
  "plan": [
   {
    "san": "Bxc5",
    "pourquoi": "Reprend le pion immédiatement et développe le fou vers la case active c5, qui regarde f2. Le fou devra ensuite reculer après b4 ou Cb3, mais c'est le prix normal : attendre reviendrait à laisser le pion aux Blancs. Ensuite, …Cge7, …O-O ou …f6 pour attaquer e5."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Développe le fou, mais laisse le pion c5 aux Blancs : après b4 ils le gardent, et les Noirs ont un pion de moins pour rien. Il faut reprendre d'abord avec le fou."
   },
   {
    "san": "g5",
    "pourquoi": "Affaiblit le roi noir sans raison et oublie encore le pion c5. Après De2 et h3, les Blancs consolident, gardent le pion de plus et la poussée …g5 n'a créé que des trous sur f5 et h5."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -68
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1 Qc7 dxc5 Bxc5",
  "sens": "reprend le pion sans attendre et sort le fou sur la diagonale a7-g1, où il vise f2 ; le camp noir termine son développement avant que les Blancs ne gagnent du temps sur lui.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier vers b3, d'où il chassera le fou de c5 avec gain de temps, et garde la case e4 sous contrôle. Il laisse aux Noirs …Cge7 et …O-O, mais les Blancs ont alors tout développé et conservent leur pion e5."
   },
   {
    "san": "Bf4",
    "pourquoi": "Défend solidement e5 avant que …f6 ou …Cge7-g6 ne l'attaquent, et place le fou face à la dame c7. Les Blancs pourront ensuite jouer Cbd2-b3. Il laisse aux Noirs le temps de roquer."
   },
   {
    "san": "b4",
    "pourquoi": "Chasse tout de suite le fou de c5 et gagne de l'espace à l'aile dame. Le fou recule en e7 ou b6, et le pion b4 sera soutenu par a3. Attention : il affaiblit un peu c3 et la diagonale vers le roi noir."
   }
  ],
  "erreurs": [
   {
    "san": "Bc2",
    "pourquoi": "Le fou n'a aucune raison de reculer : d3 est sa meilleure case. Après …Cge7 et Cbd2 …Fa7, les Noirs ont fini de se développer et les Blancs ont perdu un temps pour rien."
   },
   {
    "san": "a3",
    "pourquoi": "Trop lent : il prépare b4, mais les Noirs répondent …Cge7 puis …Fa7, le fou reste sur sa belle diagonale et b4 ne gagne plus de temps. Mieux vaut Cbd2, qui développe une pièce."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 72
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1 Qc7 dxc5 Bxc5 Nbd2",
  "sens": "Met le dernier cavalier en jeu sans boucher la colonne c : il vise b3 pour chasser le fou de c5 avec gain de temps, et il surveille e4 contre toute poussée …d4 ou …f6 qui ouvrirait le centre.",
  "menace": "Cb3 : le fou c5 doit reculer, puis les Blancs gagnent encore un temps avec b4 ou a4 et élargissent leur espace à l'aile dame.",
  "plan": [
   {
    "san": "Nge7",
    "pourquoi": "Développe la dernière pièce mineure et prépare …O-O ou …Cg6 pour attaquer le pion e5. Le cavalier ne gêne ni le fou d7 ni la dame c7. Les Blancs joueront Cb3 et le fou reculera en a7, mais les Noirs auront fini leur développement."
   },
   {
    "san": "Ba7",
    "pourquoi": "Recule avant d'y être forcé : le fou reste sur la grande diagonale a7-g1 en visant f2 et le roi blanc, et il n'est plus une cible pour Cb3 ni b4. Cela laisse aux Blancs a4 pour fixer l'aile dame, mais les Noirs gardent leur plan …Cge7 et …O-O."
   }
  ],
  "erreurs": [
   {
    "san": "Bb6",
    "pourquoi": "Semble naturel, mais le fou reste sur la colonne b : après b4 puis a4, les Blancs menacent a5 et le fou doit reculer encore. Chaque coup de pion blanc gagne un temps et de l'espace, le fou finit enfermé derrière ses pions."
   },
   {
    "san": "Be7",
    "pourquoi": "Rend la diagonale a7-g1 sans combat et gêne le cavalier g8, qui n'a plus la case e7. Après Cb3 et h3, les Blancs ont tout développé, le pion e5 est solide et les Noirs n'ont plus de contre-jeu."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -62
 },
 {
  "coups": "e4 e6 d4 d5 e5 Bd7 Nf3 h6 Bd3 c5 c3 Nc6 O-O a6 Re1 Qc7 dxc5 Bxc5 Nbd2 Nge7",
  "nom": "Défense française, variante d'avance (ligne avec 3...Fd7 et ...h6)",
  "sens": "Achève le développement des pièces mineures : le cavalier regarde g6 pour viser le pion e5, et laisse le petit roque prêt. Il ne bloque ni le fou d7 ni la dame c7.",
  "menace": "...Cg6 suivi de ...Cgxe5 ou ...Ccxe5 : le pion e5 serait attaqué trois fois (deux cavaliers, dame c7) et ne tient plus qu'avec Cf3 et Te1.",
  "plan": [
   {
    "san": "Nb3",
    "pourquoi": "Chasse le fou c5 avec gain de temps : il doit reculer en a7 ou b6. Le cavalier quitte d2, ce qui libère le fou c1 et la case d2 pour la dame. Les Noirs finissent leur développement, mais les Blancs gardent l'espace et le pion e5."
   },
   {
    "san": "h3",
    "pourquoi": "Coup d'attente utile : la case g4 est retirée aux pièces noires, ce qui protège le cavalier f3, défenseur de e5. Les Blancs gardent Cb3 pour le coup suivant. Ne crée aucune faiblesse immédiate."
   },
   {
    "san": "Qc2",
    "pourquoi": "Lie la dame et le fou d3 sur la diagonale b1-h7, utile après ...O-O ou ...Cg6. Libère la case d1 pour une tour et soutient e5 indirectement en gardant un œil sur la case e4."
   }
  ],
  "erreurs": [
   {
    "san": "h4",
    "pourquoi": "Pousse un pion devant son propre roi sans but : après ...Fb6 Cb3 f6, les Noirs ouvrent la colonne f et frappent e5, et le pion h4 devient une cible pour ...Cg6 ou ...Df4. L'avantage blanc disparaît."
   },
   {
    "san": "g3",
    "pourquoi": "Affaiblit les cases f3 et h3 autour du roi pour rien : après ...O-O Cb3 Fb6, les Noirs ont fini leur développement et la diagonale a7-g1 affaiblie par g3 pointe vers le roi. Cb3 tout de suite était plus utile."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 68
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 Ne7",
  "nom": "Winawer, variante 4.e5 Ce7 (sans …c5 immédiat)",
  "sens": "développe le cavalier vers f5 ou g6 en gardant la poussée …c5 en réserve : la case e7 ne bloque rien, et le pion e5 reste à surveiller.",
  "plan": [
   {
    "san": "a3",
    "pourquoi": "demande au fou de choisir tout de suite : s'il prend en c3, les Blancs reprennent bxc3 et gagnent la paire de fous ; s'il recule en a5, il reste cloué sur c3 mais les Blancs ont évité le dédoublement sans concession. C'est la suite principale."
   },
   {
    "san": "Bd3",
    "pourquoi": "développe une pièce vers le roi noir et contrôle f5, la case naturelle du cavalier e7. Laisse aux Noirs …c5 avec une bonne partie, mais les Blancs restent sains."
   }
  ],
  "erreurs": [
   {
    "san": "f4",
    "pourquoi": "soutient e5 mais affaiblit la diagonale g1-a7 et retarde le développement ; après …c5 puis …Fa5, le cavalier c3 reste cloué et le centre blanc devient une cible."
   },
   {
    "san": "Qg4",
    "pourquoi": "la dame sort trop tôt : ici g7 est protégé par le cavalier e7. Après …c5 dxc5 Cc6, les Noirs se développent avec tempo et la dame doit revenir."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 64
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 Ne7 a3",
  "nom": "Variante Winawer, ligne principale",
  "sens": "attaque le fou cloueur et l'oblige à se décider : prendre en c3 et donner la paire de fous, ou reculer et perdre un temps. Les Blancs acceptent les pions doublés en échange des deux fous et du centre.",
  "menace": "axb4 : gagner le fou pour un simple pion.",
  "plan": [
   {
    "san": "Bxc3+",
    "pourquoi": "Le fou prend le cavalier avant d'être capturé. Après bxc3, les Blancs ont des pions doublés sur la colonne c : c'est une faiblesse durable que les Noirs attaqueront avec c5, Dc7 ou Da5. En échange, ils cèdent la paire de fous et le contrôle des cases noires : les Blancs chercheront à jouer Dg4 contre g7."
   }
  ],
  "erreurs": [
   {
    "san": "Ba5",
    "pourquoi": "Le fou veut garder le clouage, mais b4 le chasse encore : il doit aller en b6, hors jeu, et les Blancs gagnent de l'espace sur l'aile dame sans avoir abîmé leurs pions."
   },
   {
    "san": "Bd6",
    "pourquoi": "Le pion e5 prend tout simplement en d6. Les Noirs rejouent cxd6, mais ils ont perdu leur fou roi, leur structure est ruinée et Fb5+ arrive avec un clouage désagréable."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -56
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 Ne7 a3 Bxc3+",
  "nom": "Winawer, variante 4.e5 Ce7 5.a3 Fxc3+",
  "sens": "Donne le fou de cases noires pour le cavalier en faisant échec : les Blancs doivent reprendre tout de suite, et la seule reprise correcte double leurs pions sur la colonne c. Les Noirs misent sur cette faiblesse durable (c5, Dc7, Da5) et acceptent de céder la paire de fous et les cases noires.",
  "menace": "Le roi est en échec : il faut parer. Si les Blancs ne reprennent pas, le fou b4 restera un morceau de plus pour les Noirs.",
  "plan": [
   {
    "san": "bxc3",
    "pourquoi": "La seule bonne réponse : on reprend le fou avec le pion b. Les pions c2 et c3 sont doublés, c'est vrai, mais en échange les Blancs gardent la paire de fous, un centre solide (d4, e5) et le plan Dg4 contre g7 affaibli par le départ du fou noir. Les Noirs répondront c5 puis Dc7 ou Da5 pour viser c3 ; les Blancs chercheront l'attaque sur l'aile roi."
   }
  ],
  "erreurs": [
   {
    "san": "Qd2",
    "pourquoi": "Parer l'échec avec la dame laisse le fou prendre encore : Fxd2+ Fxd2 et les Noirs ont gagné un cavalier entier pour un fou. Avec une pièce de plus, ils développent tranquillement (b6, Fa6) et gagnent sans effort."
   },
   {
    "san": "Bd2",
    "pourquoi": "Interposer le fou semble naturel, mais le fou noir reste en prise sur c3 et file en b2 : Fxb2 puis Fxa1, la tour est perdue. Les Blancs ont donné une pièce et une qualité pour rien."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 61
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Bb4 e5 Ne7 a3 Bxc3+ bxc3",
  "nom": "Winawer, ligne principale",
  "sens": "reprend le fou avec le pion b pour garder le centre d4-e5 intact et ouvrir la colonne b vers b7 ; accepte les pions doublés c2-c3 en échange de la paire de fous et de l'attaque Dg4 sur g7.",
  "plan": [
   {
    "san": "c5",
    "pourquoi": "Attaque tout de suite d4, la base du centre blanc. C'est le coup clé de la Winawer : il ouvre la diagonale a5-e1 pour la dame (Da5 ou Dc7) qui viendra viser le pion c3 affaibli. Le roi noir attendra Cbc6 et Fd7 avant de choisir son camp."
   },
   {
    "san": "b6",
    "pourquoi": "Prépare Fa6 pour échanger le fou de cases blanches, celui qui est enfermé derrière les pions d5-e6. Sans ce fou, l'attaque blanche sur l'aile roi perd son meilleur attaquant (le fou d3). En échange, on retarde c5 et le centre blanc respire un peu."
   },
   {
    "san": "Nf5",
    "pourquoi": "Place le cavalier sur une case active d'où il attaque d4 et surveille h4 et g3. Il bloque aussi la diagonale d3-h7. Attention : les Blancs peuvent le chasser par g4, il faut donc avoir prévu de revenir ou de jouer h5."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Rentre dans l'attaque blanche. Sans le fou de b4, le roi en g8 est faible : après Fd3 puis Dh5, les Blancs menacent mat sur h7 et le cavalier e7 ne peut pas revenir en f6. Il faut d'abord jouer c5 et garder le roi au centre un moment."
   },
   {
    "san": "Nd7",
    "pourquoi": "Bloque le fou c8 et laisse Dg4 arriver sans réponse : le pion g7 n'est plus défendu par rien et le cavalier d7 ne protège ni f6 ni g7. Les Noirs doivent sortir le cavalier par c6 (après c5), pas par d7."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -55
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6",
  "nom": "Défense française, variante d'avance, 3...Cc6 4.Cf3 Ch6",
  "sens": "développe le cavalier roi en gardant la diagonale du fou f8 libre ; il vise f5 pour attaquer d4 une deuxième fois, et laisse e7 au fou ou à la dame.",
  "menace": "Ch6-f5 qui attaque d4 une deuxième fois : les Blancs devront alors défendre d4 (c3) ou perdre du terrain au centre.",
  "plan": [
   {
    "san": "Bxh6",
    "pourquoi": "prend le cavalier avant qu'il n'arrive en f5. Après gxh6, les Noirs ont des pions doublés et un roque côté roi affaibli. Les Blancs renoncent à leur fou de cases noires, mais le centre e5 ne sera plus attaqué par un cavalier venu de f5."
   },
   {
    "san": "c3",
    "pourquoi": "solidifie d4 à l'avance : quand le cavalier arrivera en f5, d4 sera déjà défendu par le pion. Les Blancs gardent leur chaîne d4-e5 intacte et pourront jouer Fd3 pour viser h7 et f5."
   },
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur sa meilleure diagonale : il surveille f5 (le cavalier noir pourra y être échangé) et vise h7. Prépare le petit roque. Laisse aux Noirs la possibilité de jouer Cf5 ou cxd4 plus tard pour creuser le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 106
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6",
  "sens": "Échange le fou contre le cavalier qui allait venir en f5 harceler d4 : il abîme la structure noire et affaiblit l'aile roi, au prix du fou de cases noires.",
  "menace": "Le fou en h6 est en prise : si les Noirs ne le reprennent pas tout de suite, les Blancs le sauvent et restent avec une pièce de plus.",
  "plan": [
   {
    "san": "gxh6",
    "pourquoi": "Le seul coup : reprend la pièce pour rétablir l'égalité matérielle. Les pions h sont doublés et le roque côté roi est fragilisé, mais les Noirs gardent la paire de fous et pourront jouer ...f6 ou ...Dg5 plus tard pour utiliser la colonne g ouverte."
   }
  ],
  "erreurs": [
   {
    "san": "Nxd4",
    "pourquoi": "Prend un pion au lieu de reprendre le fou. Les Blancs jouent Dxd4, puis après gxh6 la dame arrive en g4 : les Noirs ont une pièce de moins et un roi exposé."
   },
   {
    "san": "Nxe5",
    "pourquoi": "Même idée, même punition : Cxe5 prend le cavalier, et après gxh6 la dame surgit en h5 avec attaque sur h6 et f7. Une pièce de moins, un roi en danger."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -100
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6",
  "sens": "Reprend la pièce pour rétablir l'égalité matérielle. Les pions h sont doublés et le roque côté roi est fragilisé, mais les Noirs gardent la paire de fous et pourront jouer ...f6 ou ...Dg5 plus tard pour utiliser la colonne g ouverte.",
  "plan": [
   {
    "san": "Nbd2",
    "pourquoi": "Développe le cavalier en soutenant f3 et e4 sans bloquer le pion c : le pion c3 viendra ensuite consolider d4 contre ...Db6 et ...Cxd4. Le cavalier pourra aussi aller en b3 ou f1 pour défendre le roi. Laisse aux Noirs ...Dg5 ou ...f6, mais la base d4-e5 reste solide."
   },
   {
    "san": "c3",
    "pourquoi": "Soutient immédiatement d4 contre la pression de ...Db6 et ...f6. Le centre blanc devient très stable et le fou f1 peut aller en d3 pour viser h7. Laisse la case c3 au cavalier plus tard via d2."
   },
   {
    "san": "Bd3",
    "pourquoi": "Développe le fou vers h7 et prépare le petit roque. Pointe sur le roi noir affaibli par les pions h doublés. Attention : d4 n'est pas encore protégé par c3, donc il faut surveiller ...Cxd4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 104
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2",
  "sens": "Développe le cavalier dame en gardant f3 et e4 sans bloquer le pion c : c3 pourra ensuite soutenir d4 contre ...Db6 et ...Cxd4. Le cavalier pourra aussi aller en b3 ou f1 pour défendre le roi. Laisse aux Noirs le temps de se développer, mais la base d4-e5 reste solide.",
  "plan": [
   {
    "san": "Bg7",
    "pourquoi": "Place le fou sur la grande diagonale, derrière la colonne g ouverte : il appuie sur e5 et prépare ...f6 pour attaquer la chaîne blanche. Le roi pourra rester au centre ou roquer plus tard."
   },
   {
    "san": "Qe7",
    "pourquoi": "Soutient d'avance ...f6 et ...0-0-0 : la dame renforce e6 et laisse d8 libre pour la tour. Elle ne gêne pas le fou f8, qui ira en g7 ou h6."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite e5, la pointe de la chaîne blanche : après exf6 Dxf6, la colonne f s'ouvre et le fou f8 trouve g7. Laisse un peu d'air à e6, mais le centre blanc perd sa pointe."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -111
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7",
  "sens": "Installe le fou sur la grande diagonale pour appuyer sur e5 et d4, et prépare ...f6 afin d'attaquer la base de la chaîne blanche. Il garde aussi la possibilité de roquer plus tard, même avec les pions h doublés.",
  "menace": "...Bxe5 n'est pas encore possible (Nxe5), mais ...f6 arrive bientôt pour ouvrir le centre et activer le fou g7.",
  "plan": [
   {
    "san": "Bb5",
    "pourquoi": "Cloue le cavalier c6 sur le roi : c'est le cavalier qui attaque e5 et d4, donc la pression noire s'arrête. Les Blancs peuvent aussi l'échanger par Bxc6 pour enlever un défenseur du centre."
   },
   {
    "san": "c3",
    "pourquoi": "Solidifie d4, la base de la chaîne e5-d4. Après ...f6, les Blancs tiennent le centre et profitent des pions h doublés des Noirs."
   },
   {
    "san": "Nb3",
    "pourquoi": "Dégage d2 et renforce d4 une seconde fois. Le cavalier regarde c5 et laisse la place à la dame pour aller en d2 attaquer h6."
   }
  ],
  "erreurs": [
   {
    "san": "Bd3",
    "pourquoi": "Le fou vise h7, mais rien n'y est. Après ...O-O et ...f6, le centre blanc est attaqué et le fou d3 n'aide pas à tenir d4 : les Noirs reprennent l'initiative."
   },
   {
    "san": "Qe2",
    "pourquoi": "Coup passif : la dame bloque le fou f1 et ne défend ni d4 ni e5. Les Noirs roquent et jouent ...Ne7-f5 pour frapper d4 avec le fou g7 derrière."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 106
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5",
  "sens": "Cloue le cavalier c6 sur le roi : il ne peut plus bouger ni appuyer une attaque sur d4 et e5. Les Blancs menacent aussi de l'échanger pour affaiblir la structure noire.",
  "menace": "Fxc6+ suivi de bxc6, puis Cb3-c5 : les pions noirs sont doublés sur la colonne c et le cavalier blanc s'installe sur la belle case c5.",
  "plan": [
   {
    "san": "Bd7",
    "pourquoi": "Pare le clouage et prépare à reprendre en d7 après Fxc6 : la structure reste saine. Le fou sera ensuite derrière la poussée ...f6 ou ...c5. Les Noirs restent un peu moins bien à cause des pions h doublés, mais c'est le seul coup qui tient."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le roi se cache derrière des pions déjà abîmés (h6 doublés, colonne g ouverte). Les Blancs jouent Fxc6 bxc6 puis Cb3-c5 : pions c doublés, cavalier intouchable, et une attaque sur le roi à venir."
   },
   {
    "san": "f6",
    "pourquoi": "Semble attaquer le centre, mais après exf6 Dxf6 Fxc6 bxc6 la position noire s'ouvre et se délite : pions doublés, roi exposé, et le centre blanc est gagnant."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -113
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7",
  "sens": "Déclouage du cavalier c6 : le fou s'interpose devant la dame et surveille b5. Si le fou blanc prend en c6, il sera repris par le fou d7 sans abîmer la structure de pions. Le vrai but est tactique : le cavalier c6 est maintenant libre de sauter sur e5.",
  "menace": "...Cxe5 ! Après Cxe5 Fxb5, les Noirs gagnent le pion e5 car le fou b5 n'est plus défendu. Les Blancs doivent régler ce problème tout de suite.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Supprime la menace à la racine : plus de cavalier, plus de prise en e5. Après ...Fxc6, le fou noir est enfermé derrière son pion d5 et ne peut rien faire ; les Blancs gardent le pion e5 solide et vont jouer c3, O-O puis viser les pions h faibles avec Dd2 et Ch4-f5 ou Cb3-c5. Ligne la plus simple et la plus claire pour un débutant."
   },
   {
    "san": "Qe2",
    "pourquoi": "Défend d'un coup le fou b5 et le pion e5, donc ...Cxe5 ne marche plus. La dame prépare aussi O-O-O pour mettre le roi à l'abri du côté où les Noirs ne peuvent pas attaquer. Le fou reste cloué sur c6 et garde la pression. On laisse aux Noirs le choix de jouer ...a6, mais on reprend alors Fxc6 sans rien perdre."
   },
   {
    "san": "a4",
    "pourquoi": "Le pion a4 protège le fou b5 : si ...Cxe5 Cxe5 Fxb5, alors axb5 et les Blancs ont un cavalier central pour un fou. Le pion a4 empêche aussi ...a6 suivi de ...b5. Coup utile et sûr, mais il ne développe rien : à réserver si l'on veut garder le clouage à tout prix."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Le roque semble naturel mais oublie la menace : ...Cxe5 ! Cxe5 Fxb5 et les Noirs ont gagné le pion central gratuitement. Toute la position blanche reposait sur e5 ; sans lui, le fou g7 et la paire de fous noirs s'ouvrent. Règle : avant de roquer, vérifier ce que l'adversaire vient de menacer."
   },
   {
    "san": "c3",
    "pourquoi": "Même piège : ...Cxe5 Cxe5 Fxb5 et le pion e5 tombe. Le coup c3 ne défend ni b5 ni e5 ; il ne fait que perdre un temps pendant que les Noirs exécutent leur menace. Le pion b5 non défendu est la pièce à surveiller ici."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 112
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6",
  "sens": "Échange le fou contre le cavalier qui attaquait e5 : plus de cavalier, plus de pression sur le pion e5. Ensuite le fou noir qui reprend en c6 se retrouve bloqué derrière son propre pion d5.",
  "menace": "Le fou blanc en c6 est en prise, mais il menace de prendre le fou d7 (Fxd7+) : les Noirs doivent reprendre tout de suite.",
  "plan": [
   {
    "san": "Bxc6",
    "pourquoi": "Le seul coup : il récupère la pièce avec le fou. Le pion b7 reste à sa place, donc la structure des Noirs sur l'aile dame reste saine. Le fou c6 est passif derrière d5, mais les Noirs pourront jouer ...De7, ...O-O-O ou ...f6 pour attaquer e5. Les Blancs restent un peu mieux à cause des pions h faibles."
   }
  ],
  "erreurs": [
   {
    "san": "bxc6",
    "pourquoi": "Reprendre avec le pion garde le fou d7 actif, mais crée un deuxième pion doublé (c6/c7) et laisse le pion a7 isolé. Les Blancs jouent Cb3 puis O-O et visent c5 et les pions faibles : les Noirs ont trop de cibles à défendre."
   },
   {
    "san": "O-O",
    "pourquoi": "Oublier de reprendre coûte une pièce : Fxd7 Dxd7 et les Blancs ont un fou de plus. En plus roquer du côté des pions h doublés met le roi dans une zone déjà ouverte."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -94
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6 Bxc6",
  "sens": "reprend la pièce avec le fou pour garder la structure de pions intacte : b7 reste en place et le fou, même passif derrière d5, protège l'aile dame et pourra soutenir ...De7 et ...O-O-O.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "met le roi à l'abri tout de suite. Les Noirs ont des pions h doublés et affaiblis, les Blancs ne risquent rien à l'aile roi et pourront ensuite jouer Te1 et Cb3 pour tenir e5 et viser c5. Les Noirs cherchent ...f6 ou ...De7 et ...O-O-O."
   },
   {
    "san": "Nf1",
    "pourquoi": "le cavalier quitte d2 pour aller en g3 ou e3 : de là il regarde f5 et h5, les cases affaiblies par les pions h doublés. Il libère aussi la colonne d pour la dame. Les Noirs auront le temps de jouer ...De7 et ...O-O-O."
   },
   {
    "san": "Qe2",
    "pourquoi": "défend e5 une fois de plus et connecte les tours après le roque. Si les Noirs jouent ...f6, exf6 ouvre la colonne e sur le roi noir. Laisse aux Noirs ...De7 puis ...O-O-O."
   }
  ],
  "erreurs": [
   {
    "san": "g3",
    "pourquoi": "coup lent qui ne fait rien contre les plans noirs : après ...O-O et ...Fe8, le fou noir vient en g6 ou h5 et le pion g3 crée des trous en f3 et h3. Les pions h doublés des Noirs ne sont plus un handicap, l'avantage blanc fond."
   },
   {
    "san": "b3",
    "pourquoi": "affaiblit c3 et ne développe rien : le cavalier d2 perd la case b3 et les Noirs jouent ...O-O puis ...Fe8-g6 sans problème. Les Blancs ont perdu un temps précieux au lieu de roquer."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 107
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6 Bxc6 O-O",
  "sens": "Le roque blanc met le roi à l'abri avant d'activer la tour sur e1 et le cavalier vers b3 : les Blancs comptent sur la chaîne e5 et les pions h doublés des Noirs pour jouer tranquillement.",
  "plan": [
   {
    "san": "Qe7",
    "pourquoi": "Relie les tours, protège e6 et prépare le grand roque : le roi noir ira à l'aile dame, loin des pions h doublés. Ensuite ...f6 pour casser e5 avec la dame qui soutient."
   },
   {
    "san": "h5",
    "pourquoi": "Transforme la faiblesse en force : le pion avance, fixe la case g4 et prépare ...Bg4 ou ...h4 pour gêner le cavalier f3 et l'aile roi blanche. Laisse toutefois le roi noir sans abri clair à l'aile roi."
   },
   {
    "san": "f6",
    "pourquoi": "Attaque tout de suite la base de la chaîne e5 : après exf6 Bxf6, la colonne f s'ouvre et le fou g7 respire. Mais le pion e6 et le roi deviennent un peu plus exposés sur la diagonale h5-e8."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -101
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6 Bxc6 O-O Qe7",
  "sens": "Relie les tours et protège e6, pour roquer à l'aile dame loin des pions h doublés, puis pousser ...f6 contre le pion e5 avec la dame derrière.",
  "plan": [
   {
    "san": "Re1",
    "pourquoi": "Surprotège e5 avant que les Noirs ne jouent ...f6. Si le pion e5 est échangé, la tour regardera la colonne e ouverte vers le roi noir, qui n'a pas encore roqué."
   },
   {
    "san": "Nb3",
    "pourquoi": "Libère la case d2 et vise c5 : le cavalier fera pression sur d7 et sur la structure noire. Il ouvre aussi la dame vers la case d2 pour viser les pions h6 et h5."
   },
   {
    "san": "g3",
    "pourquoi": "Prépare h4 et Kg2 : le roi blanc se cache et le pion h4 bloque les pions h noirs. Ce coup est lent, les Noirs peuvent roquer long et jouer ...f6."
   }
  ],
  "erreurs": [
   {
    "san": "b3",
    "pourquoi": "Pousse un pion inutile et laisse les Noirs jouer ...h5 puis ...O-O-O sans gêne. Le fou c1 est déjà échangé : b3 ne développe rien et affaiblit la case c3."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 107
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6 Bxc6 O-O Qe7 Re1",
  "sens": "renforce le pion e5 en avance : si les Noirs jouent ...f6 et que le pion disparaît, la tour verra la colonne e ouverte, droit sur le roi noir resté au centre.",
  "plan": [
   {
    "san": "h5",
    "pourquoi": "Avance le pion doublé avant qu'il ne devienne une cible (g4 des Blancs ne viendra plus). Prépare ...h4 pour gagner de l'espace à droite et ouvre la diagonale h6-c1 à une future tour sur g8. Les Noirs gardent le choix de roquer ou non."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri et relie les tours avant d'ouvrir le centre par ...f6. Les pions h6/h7 sont abîmés, mais le fou g7 protège bien le roi. Ensuite ...Rh8 et ...Tg8 pour utiliser la colonne g."
   },
   {
    "san": "Rg8",
    "pourquoi": "Prend tout de suite la colonne g ouverte : la tour vise g2 et soutient ...Fh6 ou ...h5-h4. Le roi reste au centre, donc il faudra retarder ...f6 tant que la colonne e peut s'ouvrir."
   }
  ],
  "erreurs": [
   {
    "san": "Bf8",
    "pourquoi": "Le fou recule sans raison et perd un temps. Après Cf1, si les Noirs jouent ...f5, les Blancs prennent en passant par exf6 : le centre s'ouvre alors que le roi noir n'a pas roqué, exactement ce que la tour e1 attendait."
   },
   {
    "san": "Qb4",
    "pourquoi": "La dame va chercher le pion b2, mais Te3 le défend indirectement et la dame se retrouve loin du roi. Après ...O-O-O, a4 la harcèle et les Blancs gagnent du temps sur l'aile dame."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -108
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Nh6 Bxh6 gxh6 Nbd2 Bg7 Bb5 Bd7 Bxc6 Bxc6 O-O Qe7 Re1 h5",
  "sens": "Met le pion doublé en sécurité avant qu'il ne soit attaqué et prépare ...h4 pour gagner de l'espace à droite. Libère aussi la case h6 au fou et laisse le roi noir libre de roquer ou de rester au centre.",
  "menace": "...h4 puis ...h3 pour fragiliser la case g2 devant le roi blanc.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Consolide d4, la base de la chaîne de pions e5-d4. Après ...h4, les Noirs ne pourront pas ouvrir le centre avec ...c5 sans que d4 tienne bon. Laisse b2 et la diagonale du fou g7 bien bloquées."
   },
   {
    "san": "h4",
    "pourquoi": "Bloque net le pion h5 : plus de ...h4, donc plus de gain d'espace à droite pour les Noirs. Le cavalier d2 pourra ensuite aller en f1 puis g3 attaquer h5. En échange, la case g4 appartient aux Noirs."
   },
   {
    "san": "Qe2",
    "pourquoi": "Relie les tours et surveille e5, le pion le plus important des Blancs. Prépare Nf1-g3 ou c3 selon ce que font les Noirs, sans rien affaiblir."
   }
  ],
  "erreurs": [
   {
    "san": "Nf1",
    "pourquoi": "Le cavalier veut aller en g3, mais il est trop lent : ...h4 interdit g3, puis après h3 les Noirs roquent grand et leur tour arrive sur g8. Les Blancs ont perdu deux temps et le cavalier reste passif en f1."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 115
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7",
  "nom": "Défense française, variante d'avance avec 3...Cc6 (ligne irrégulière)",
  "sens": "Sort le fou de cases blanches pendant que la diagonale est libre, protège le cavalier c6 et prépare f6 ou Df6 pour attaquer la chaîne e5-d4.",
  "plan": [
   {
    "san": "c3",
    "pourquoi": "Soutient d4 avant que les Noirs ne l'attaquent par f6 ou Db6. La chaîne d4-e5 étouffe le fou f8 ; la solidifier est le cœur de l'avance. Laisse aux Noirs le temps de jouer f6, mais e5 est bien défendu."
   },
   {
    "san": "Be2",
    "pourquoi": "Développe une pièce et prépare le roque. Si les Noirs jouent f6, le fou couvre f3 et la colonne f ne gênera pas. Coup sûr qui ne crée aucune faiblesse."
   },
   {
    "san": "a3",
    "pourquoi": "Empêche Fb4 et Cb4 et prépare b4 pour gagner de l'espace à l'aile dame. Un peu lent, mais les Noirs manquent de cases pour en profiter."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 97
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3",
  "nom": "Défense française, variante d'avance, système Cc6-Fd7",
  "sens": "Renforce le pion d4 avec un pion : le centre tient même si les Noirs l'attaquent par f6 et Db6, et la dame reste libre de se déplacer.",
  "plan": [
   {
    "san": "f6",
    "pourquoi": "Attaque la tête de la chaîne, e5. Après exf6 Cxf6, le cavalier sort avec gain de temps et le fou f8 respire enfin. Si les Blancs laissent le pion e5 en place, les Noirs pourront l'échanger quand ils le voudront."
   },
   {
    "san": "Nh6",
    "pourquoi": "Développe le cavalier roi en gardant la case f6 pour le pion. Le cavalier vise f5 pour presser d4 ; si les Blancs jouent Fxh6, ils cèdent la paire de fous et ouvrent la colonne g pour la tour."
   },
   {
    "san": "a6",
    "pourquoi": "Coup utile d'attente : prépare b5 et ôte la case b5 au fou blanc. Les Noirs gardent tous leurs choix (f6, Ch6) pour le coup suivant."
   }
  ],
  "erreurs": [
   {
    "san": "Nge7",
    "pourquoi": "Le cavalier bloque le fou f8 et prend la case e7 qui servait à reculer. Pire : il ne pourra plus jouer f6 avec le pion sans se gêner. Après Fd3, les Noirs se retrouvent cramponnés sans contre-jeu sur e5."
   },
   {
    "san": "Be7",
    "pourquoi": "Le fou se place devant le pion e6 fermé : il regarde un mur. Après Fd3 Ch6 Fxh6, les Noirs doivent reprendre du pion g et affaiblir leur roi, sans avoir attaqué le centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -96
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6",
  "sens": "s'attaque à la tête de la chaîne de pions blancs : le pion e5 est frappé une deuxième fois (avec le cavalier c6) et, après l'échange sur e5, la colonne f s'ouvre pour la tour et le fou f8 trouve enfin de l'air.",
  "menace": "...fxe5 suivi de ...Fd6 ou ...e5 : les Noirs liquident le pion e5 qui les étouffait et activent toutes leurs pièces.",
  "plan": [
   {
    "san": "b4",
    "pourquoi": "Gagne de l'espace à l'aile dame et prépare b5 pour chasser le cavalier c6, l'un des attaquants de e5. Après ...fxe5 dxe5, le pion b4 retire aussi la case c5 au fou noir. Les Blancs renforcent leur chaîne avant de la défendre, car le pion e5 n'est pas en danger immédiat."
   },
   {
    "san": "Bd3",
    "pourquoi": "Simple et solide : développe le fou vers h7, protège e4 et prépare le roque. Après ...fxe5 dxe5, le fou d3 vise la diagonale ouverte vers le roi noir, et le centre blanc reste soutenu par f3 et c3."
   },
   {
    "san": "Bf4",
    "pourquoi": "Défend directement le pion e5 avec une pièce. Le fou sort avant le roque, ce qui évite qu'il reste enfermé derrière la chaîne. Les Noirs peuvent prendre sur e5, mais les Blancs reprennent avec le fou ou le pion sans perdre de temps."
   }
  ],
  "erreurs": [
   {
    "san": "c4",
    "pourquoi": "Ouvre le centre au mauvais moment. Après ...Fb4+ le cavalier b1 doit s'interposer sur d2, et ...fxe5 fait tomber le pion e5 : la chaîne qui donnait l'avantage s'écroule. Ne jamais changer la structure quand l'adversaire est mieux développé."
   },
   {
    "san": "Bb5",
    "pourquoi": "Semble clouer le cavalier c6, mais les Noirs répondent ...Cxe5 ! : après Cxe5 fxe5 les Blancs ont perdu un pion, car le fou d7 protège le cavalier c6 et le clouage est illusoire. Avant un clouage, vérifier qui défend la pièce clouée."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 90
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4",
  "sens": "gagne de l'espace à l'aile dame et prépare b5 pour chasser le cavalier c6, un des attaquants de e5 ; retire aussi la case c5 au fou noir.",
  "menace": "b5, qui repousse le cavalier c6 et affaiblit la pression noire sur e5 et d4.",
  "plan": [
   {
    "san": "fxe5",
    "pourquoi": "Prend tout de suite, avant que b5 ne chasse le cavalier. Après dxe5, le pion d4 a disparu : la colonne f s'ouvre pour la tour après le petit roque, et le cavalier c6 continue d'attaquer e5. Les Noirs peuvent ensuite jouer Nge7 et Ng6 pour viser e5 une troisième fois."
   },
   {
    "san": "a6",
    "pourquoi": "Empêche b5 : le cavalier c6 reste à sa place et garde sa pression sur d4 et e5. Les Noirs prennent leur temps et pourront prendre en e5 au moment qui leur convient. En échange, ils laissent les Blancs développer un coup de plus."
   },
   {
    "san": "Nge7",
    "pourquoi": "Développe le cavalier roi : il ira en g6 attaquer e5 ou en f5 presser d4. Si b5, le cavalier c6 peut reculer en a5 ou b8 sans drame. Laisse aux Blancs le temps de jouer Bd3 et de consolider."
   }
  ],
  "erreurs": [
   {
    "san": "a5",
    "pourquoi": "Semble contester b4, mais après b5 le cavalier c6 doit fuir en a7, une case passive. Puis a4 fixe tout : le cavalier a7 est hors jeu et la pression sur e5 a disparu. Jouer a6 (pas a5) pour tenir b5."
   },
   {
    "san": "Qe7",
    "pourquoi": "Développe la dame, mais oublie la menace : b5 chasse le cavalier en a5, où il ne défend plus rien, et la dame en e7 gêne le fou f8 et le cavalier g8. Les Blancs consolident avec Nbd2 et gardent leur grand centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -89
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5",
  "sens": "prend le pion e5 tout de suite, avant que b5 ne chasse le cavalier c6 : si dxe5, le pion d4 disparaît, la colonne f s'ouvrira pour la tour et le cavalier continue d'attaquer e5.",
  "menace": "exd4, puis le pion d4 ne pourra pas reprendre sur e5 : le centre blanc s'effondre.",
  "plan": [
   {
    "san": "dxe5",
    "pourquoi": "reprend le pion et garde un pion fort en e5. Le pion d4 a disparu, mais c3 et le cavalier f3 défendent e5. Les Noirs vont attaquer ce pion avec Nge7-g6 ; les Blancs répondront Bd3 ou Bf4 pour le protéger."
   },
   {
    "san": "b5",
    "pourquoi": "chasse d'abord le cavalier c6 : il doit reculer, et seulement ensuite les Blancs reprennent sur e5. Le pion e5 est alors moins attaqué. Mais attention : les Noirs gardent un pion de plus au centre pour quelques coups, il faut calculer précisément."
   }
  ],
  "erreurs": [
   {
    "san": "Be2",
    "pourquoi": "développe une pièce, mais oublie le centre : les Noirs jouent exd4 ou e4 et attaquent le cavalier f3. Les Blancs perdent du temps ou un pion : le centre s'écroule."
   },
   {
    "san": "Ng5",
    "pourquoi": "le cavalier part à l'aventure sans menacer grand-chose. Les Noirs prennent en d4 : le pion est perdu, et après b5 le cavalier c6 saute en e5 avec une position dominante au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 84
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5",
  "sens": "reprend le pion et garde un pion avancé en e5 qui gêne les Noirs. Le pion d4 a disparu, mais c3 et le cavalier f3 tiennent e5. Les Blancs ont gagné de l'espace sur l'aile dame avec b4 : ils veulent bientôt pousser b5 pour chasser le cavalier c6.",
  "menace": "b5 : le cavalier c6 est chassé et perd son contrôle sur e5",
  "plan": [
   {
    "san": "a6",
    "pourquoi": "stoppe b5 tout de suite. Le cavalier c6 reste en place et continue d'attaquer e5. Après ce coup, les Noirs peuvent jouer Nge7-g6 ou Nh6-f7 pour presser encore e5. Les Blancs garderont leur pion fort en e5 et un peu plus d'espace, mais sans menace directe."
   },
   {
    "san": "Nh6",
    "pourquoi": "développe le cavalier vers f7 ou f5, d'où il attaque e5 et prépare le roque. Attention : les Blancs peuvent échanger Bxh6, ce qui abîme les pions noirs, mais le fou f8 reprend et la colonne g devient utile."
   },
   {
    "san": "Be7",
    "pourquoi": "développe simplement et prépare le roque. Le fou peut ensuite aller en g5 ou h4 pour gêner les Blancs. Laisse b5 possible, mais après b5 le cavalier recule en a5 ou d8 sans grand dommage."
   }
  ],
  "erreurs": [
   {
    "san": "Nce7",
    "pourquoi": "recule un cavalier déjà bien placé qui attaquait e5. Les Blancs jouent Bd3 puis, si le cavalier g8 va en h6, Bxh6 casse les pions du roi noir. Les Noirs perdent du temps et affaiblissent leur roque."
   },
   {
    "san": "a5",
    "pourquoi": "semble attaquer b4, mais les Blancs répondent b5 et chassent le cavalier c6 : le pion e5 n'est plus attaqué et les Blancs gagnent de l'espace. Le pion a5 devient faible."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -89
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6",
  "sens": "stoppe b5 tout de suite : le cavalier c6 reste en place et continue d'attaquer e5. Les Noirs préparent ensuite Nge7-g6 ou Nh6-f7 pour presser encore le pion e5.",
  "plan": [
   {
    "san": "Bd3",
    "pourquoi": "développe le fou sur sa meilleure diagonale, vers h7 et le roi noir. Il surveille aussi g6 et f5, les cases où les cavaliers noirs veulent venir pour attaquer e5. Les Blancs préparent le roque."
   },
   {
    "san": "h4",
    "pourquoi": "gagne de l'espace à l'aile roi et prépare h5 : le cavalier noir ne pourra plus s'installer tranquillement en g6. Attention, cela retarde un peu le développement."
   },
   {
    "san": "a4",
    "pourquoi": "prépare b5 malgré tout : après a4 puis b5, le cavalier c6 devra bouger et e5 respirera. Les Blancs jouent à l'aile dame, là où ils ont plus d'espace."
   }
  ],
  "erreurs": [
   {
    "san": "Bf4",
    "pourquoi": "semble défendre e5 une fois de plus, mais le fou fait une cible : après Qe7 et Qf7, la dame noire vient sur la colonne f et attaque le fou f4 en même temps que f3 et e5. Les Blancs perdent du temps."
   },
   {
    "san": "a3",
    "pourquoi": "trop lent : les Noirs jouent Nh6 puis Ng4 et le pion e5 est attaqué une fois de plus. Il faut jouer actif (Bd3, h4) au lieu de protéger un pion b4 qui n'est pas menacé."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 90
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3",
  "sens": "Développe le fou vers h7 et le roi noir, et garde g6 et f5, les cases d'où les cavaliers noirs voudraient attaquer e5. Les Blancs sont prêts à roquer.",
  "menace": "Pas de menace immédiate, mais si les Noirs jouent trop vite sur l'aile roi, la batterie Fd3 + Dc2 vise h7.",
  "plan": [
   {
    "san": "Nh6",
    "pourquoi": "Le cavalier sort sans bloquer rien : il vise f5 et f7, d'où il attaquera le pion e5 et défendra le roi. Il garde aussi un œil sur g4. Les Noirs préparent ensuite Fe7 et le roque. Seul coup correct ici : tout le reste laisse les Blancs trop confortables."
   }
  ],
  "erreurs": [
   {
    "san": "Be7",
    "pourquoi": "Semble naturel, mais le fou en e7 bouche la case e7 et le cavalier g8 n'a plus que h6. Les Blancs jouent Dc2 : la dame et le fou visent h7. Après Ch6, Fxh6 détruit les pions devant le roi et le roque noir devient dangereux."
   },
   {
    "san": "Nge7",
    "pourquoi": "Le cavalier va vers g6 pour attaquer e5, mais les Blancs répondent Fg5 : le cavalier e7 est cloué sur la dame. Les Noirs perdent du temps avec Dc8, puis h4 relance l'attaque et les Noirs n'ont jamais joué ...Cg6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -93
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3 Nh6",
  "sens": "sort le cavalier sans gêner le fou f8 : il vise f5 et f7 pour attaquer e5 et protéger le roi, et surveille g4 avant Fe7 et le roque.",
  "menace": "Cf7 puis Cxe5 : le pion e5 serait attaqué une deuxième fois et difficile à tenir.",
  "plan": [
   {
    "san": "Qe2",
    "pourquoi": "Défend e5 une fois de plus et laisse le fou c1 libre de choisir sa case. Prépare Fxh6 ou Fg5 selon la réponse noire, et garde le roque court pour plus tard, quand le pion g7 ne pourra plus avancer gratuitement."
   },
   {
    "san": "h4",
    "pourquoi": "Empêche le plan noir g5 qui chasserait le fou et ouvrirait le roi blanc. Donne la case g5 au fou et prépare h5 pour clouer le cavalier sur h6. Les Noirs doivent réagir avant de roquer."
   },
   {
    "san": "Bxh6",
    "pourquoi": "Prend tout de suite le cavalier qui menace e5 et abîme la structure noire : après gxh6, le roi noir ne peut plus roquer tranquillement. En échange, les Blancs cèdent la paire de fous et la colonne g aux Noirs."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer trop tôt laisse les Noirs jouer Cf7 puis g5 ! Le pion g avance avec gain de temps, le fou c1 n'a plus de bonne case, et l'attaque g4 arrive vite sur le roi blanc."
   },
   {
    "san": "Be3",
    "pourquoi": "Le fou ne regarde rien d'utile et n'empêche pas Cf7 : après le roque blanc, le cavalier noir prend simplement e5, et le pion central des Blancs disparaît sans compensation."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 94
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3 Nh6 Qe2",
  "nom": "Variante d'avance de la Défense française",
  "sens": "Soutient le pion e5 avec la dame pour que le fou c1 puisse sortir où il veut. Garde le roque en réserve et prépare h4 ou Fxh6 contre le cavalier mal placé en h6.",
  "menace": "Fxh6 suivi de gxh6 : les Blancs cassent les pions de l'aile roi noire et le roi noir n'a plus d'abri sûr.",
  "plan": [
   {
    "san": "Be7",
    "pourquoi": "Développe une pièce et prépare le petit roque. Le fou défend aussi g5 et h4, donc les attaques blanches sur l'aile roi perdent de la force. Après le roque, le cavalier h6 ira en f7 ou f5 sans danger."
   },
   {
    "san": "Nf5",
    "pourquoi": "Sort le cavalier de la diagonale du fou c1 : plus de Fxh6. En f5, il regarde d4 et h4, deux cases importantes. Si les Blancs jouent g4 pour le chasser, ils affaiblissent leur propre roi."
   },
   {
    "san": "Nf7",
    "pourquoi": "Recule hors de prise et attaque le pion e5, qui est la clé de la position blanche. Les Blancs doivent encore défendre e5, ce qui leur laisse moins de temps pour attaquer."
   }
  ],
  "erreurs": [
   {
    "san": "Ne7",
    "pourquoi": "Bouche la sortie du fou f8 : les Noirs ne peuvent plus roquer vite. Après 10.O-O Cf7 11.h4, les Blancs gagnent du temps et poussent leurs pions vers le roi noir encore au centre."
   },
   {
    "san": "Ng4",
    "pourquoi": "Le cavalier n'a rien à faire en g4 : 10.h3 le renvoie en h6, puis 11.h4 arrive. Les Noirs ont perdu deux coups et les Blancs ont avancé leur attaque gratuitement."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -106
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3 Nh6 Qe2 Be7",
  "sens": "Termine le développement et prépare le petit roque. Une fois le roi en g8, le cavalier h6 pourra revenir en f7 ou sauter en f5, et la tour f8 appuiera sur la colonne f ouverte.",
  "menace": "Roquer, puis amener la tour f8 contre le cavalier f3 et le pion e5 ; le cavalier h6 rejoindra f5 ou f7.",
  "plan": [
   {
    "san": "Bxh6",
    "pourquoi": "Prend tout de suite le cavalier : après gxh6, les pions noirs du roque sont doublés et cassés. Le roi noir sera moins à l'aise en g8, et les Blancs n'ont plus à craindre Cf5. Les Noirs gardent la paire de fous, mais leur structure est abîmée pour longtemps."
   },
   {
    "san": "O-O",
    "pourquoi": "Met le roi en sécurité avant toute chose. Le fou c1 garde l'option de prendre en h6 plus tard, et la dame e2 continue de soutenir le pion e5. C'est le coup simple quand on ne veut rien calculer."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Sort le cavalier dame vers f1 ou b3, sans gêner le fou c1. Il protège aussi e4 et f3 en cas de poussée des Noirs. Le roque viendra au coup suivant."
   }
  ],
  "erreurs": [
   {
    "san": "Bd2",
    "pourquoi": "Le fou va en d2 alors qu'il pouvait prendre en h6 tout de suite. Après O-O, s'il prend quand même en h6, il aura mis deux coups pour un seul résultat. Un tempo perdu, et le roi noir est déjà à l'abri."
   },
   {
    "san": "g3",
    "pourquoi": "Affaiblit la case f3 sans nécessité. Après O-O Fxh6, les Noirs répondent Txf3 ! : le cavalier f3 tombe et le pion g3 ne protège rien. Les Noirs récupèrent largement le matériel donné, et le roi blanc reste au centre."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 100
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3 Nh6 Qe2 Be7 Bxh6",
  "sens": "Échange le fou de cases noires contre le cavalier pour casser le roque noir : après la reprise du pion g, les pions h doublés ne protègent plus le roi, et le cavalier ne viendra plus en f5.",
  "menace": "Le fou en h6 est en prise et ne peut pas rester : s'il n'est pas repris, il se retire avec un cavalier de plus pour les Blancs.",
  "plan": [
   {
    "san": "gxh6",
    "pourquoi": "Seul coup : il faut reprendre la pièce, sinon les Noirs ont donné un cavalier pour rien. La structure est abîmée (pions h doublés, colonne g ouverte), mais les Noirs gardent la paire de fous, le pion d5 solide et la pression sur e5 avec Dc7 ou O-O-O. Le roi ira vers l'aile dame."
   }
  ],
  "erreurs": [
   {
    "san": "O-O",
    "pourquoi": "Roquer sans reprendre laisse le fou s'échapper en d2 : les Noirs ont simplement perdu le cavalier h6. Et un roi en g8 face à un fou d3 et une dame e2 sans défenseur subit vite une attaque sur h7."
   },
   {
    "san": "Nxb4",
    "pourquoi": "Compte sur un échange, mais les Blancs reprennent cxb4 et seulement ensuite les Noirs jouent gxh6 : au total un cavalier contre un pion. Ne jamais lancer un contre-coup quand une pièce est en prise."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -104
 },
 {
  "coups": "e4 e6 d4 d5 e5 Nc6 Nf3 Bd7 c3 f6 b4 fxe5 dxe5 a6 Bd3 Nh6 Qe2 Be7 Bxh6 gxh6",
  "sens": "Reprend le fou pour ne pas perdre une pièce. Le pion g s'en va, la colonne g s'ouvre vers le roi blanc et le fou e7 pourra sauter en g5. Le roi noir visera le grand roque.",
  "menace": "Bg5 : le fou cloue le cavalier f3 sur la dame et vise d2, en profitant de la colonne g ouverte.",
  "plan": [
   {
    "san": "O-O",
    "pourquoi": "Met le roi à l'abri tout de suite. Les Noirs n'ont plus de pion g pour l'attaquer, et la tour f1 pourra surveiller la colonne f ouverte après f6. Laisse les Noirs faire O-O-O, mais le roi noir sera moins bien protégé que le blanc."
   },
   {
    "san": "Nbd2",
    "pourquoi": "Développe le dernier cavalier et renforce e5 par la case f3. Si le fou noir vient en g5, Nxg5 n'est plus possible, mais le cavalier d2 garde b3 et c4 sous contrôle."
   },
   {
    "san": "a4",
    "pourquoi": "Gagne de la place à l'aile dame avec b5 en vue : le cavalier c6 n'aura plus de bonne case et le grand roque noir sera attaqué par les pions. Cède un peu de temps sur le développement."
   }
  ],
  "erreurs": [
   {
    "san": "Qd2",
    "pourquoi": "Laisse Bg5 : le fou cloue et force Nxg5 hxg5, ce qui redonne aux Noirs un pion g solide et une colonne h ouverte pour la tour. Les pions h doublés, la faiblesse noire, disparaissent."
   },
   {
    "san": "Qe3",
    "pourquoi": "Même problème : après Bg5 la dame doit revenir en e2, deux coups de dame perdus, et les Noirs roquent avec un développement en avance."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 101
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4",
  "nom": "Variante MacCutcheon",
  "sens": "cloue le cavalier c3 sur le roi et attaque ainsi le pion e4 une deuxième fois : les Blancs ne peuvent plus compter sur Cc3 pour le défendre. Les Noirs menacent de s'ouvrir le jeu au centre à leur avantage.",
  "menace": "...dxe4, qui gagne le pion e4 car Cxe4 est impossible (le cavalier est cloué) ; si Fxf6 Dxf6, la dame noire prend part à l'attaque.",
  "plan": [
   {
    "san": "e5",
    "pourquoi": "Pousse le pion attaqué en chassant le cavalier f6, qui doit reculer en d7. Ferme le centre et gagne de l'espace ; les Blancs pourront ensuite jouer a3 pour forcer Fxc3+ puis bxc3, et viser le roi noir avec Dg4 ou h4. Les Noirs attaqueront la chaîne de pions par ...c5. Ligne principale, très tranchante."
   },
   {
    "san": "exd5",
    "pourquoi": "Supprime simplement la tension au centre : la menace ...dxe4 disparaît. Après ...Dxd5 ou ...exd5, le jeu reste équilibré et plus calme. Bon choix pour éviter les complications, mais ne cherche aucun avantage."
   }
  ],
  "erreurs": [
   {
    "san": "Bxf6",
    "pourquoi": "Donne le fou de cases noires pour rien : après ...Dxf6 puis e5, la dame se retire en d8 et le pion e4 n'est toujours pas plus solide. Les Blancs ont perdu la paire de fous sans compensation."
   },
   {
    "san": "Bh4",
    "pourquoi": "Garde le clouage mais oublie e4 : ...Fxc3+ bxc3 dxe4 gagne le pion central et abîme la structure blanche. Toujours répondre d'abord à la menace sur e4."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": 43
 },
 {
  "coups": "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5",
  "nom": "Variante MacCutcheon",
  "sens": "Attaque le cavalier f6, qui est cloué par le fou g5 sur la dame d8 : il ne peut pas bouger sans perdre la dame. Ferme le centre et gagne de l'espace vers le roi noir.",
  "menace": "exf6, qui gagne le cavalier (après ...gxf6, la structure noire est détruite et le fou g5 reprend sur h6 ou f6).",
  "plan": [
   {
    "san": "h6",
    "pourquoi": "Le seul coup. Attaque le fou g5 pour lever le clouage avant de sauver le cavalier. Si 6.Bd2, les Noirs jouent ...Bxc3 puis ...Ne4 : le cavalier saute en avant au lieu de reculer, et le centre blanc est fragilisé. Si 6.exf6, alors ...hxg5 7.fxg7 Rg8 : le pion g7 tombe ensuite, le matériel est égal. Laisse aux Blancs le choix de la structure, mais règle le problème du clouage."
   }
  ],
  "erreurs": [
   {
    "san": "c5",
    "pourquoi": "Attaque le centre mais oublie le cavalier cloué. Après 6.exf6 gxf6 7.Bh6, les Noirs ont perdu une pièce pour un pion et leur roi n'a plus d'abri."
   },
   {
    "san": "Nbd7",
    "pourquoi": "Développe mais ne défend rien : 6.exf6 gxf6 7.Bd2 et les Noirs ont une pièce de moins. Il faut d'abord chasser le fou g5 par ...h6."
   }
  ],
  "auteur": "brouillon IA (Fable), vérifié au moteur, à relire",
  "date": "2026-10-08",
  "evalBest": -56
 }
];
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
