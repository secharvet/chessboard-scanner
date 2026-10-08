// Généré par scripts/ouvertures/construire.mjs : 60 positions du livre + 9 prolongements. Ne pas éditer à la main.
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
 }
];
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
