// Généré par scripts/ouvertures/construire.mjs : 60 positions du livre + 120 prolongements. Ne pas éditer à la main.
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
 }
];
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
