/**
 * Complément au livre « Partie espagnole » : les 8 positions manquantes signalées à la relecture
 * (expert échecs, 17 octobre 2026). Même format que coach/openings/espagnole.mjs — entrées à coller
 * telles quelles dans LIVRE, aux bons endroits des sections existantes.
 * Vérifié : chaque coup cité légal (chess.js) ; chaque plan dans le MultiPV de tête et chaque faute
 * confirmée à Stockfish, profondeur 20 (écart d'au moins 0,4, la plupart au-delà de 1,5).
 */

export const COMPLEMENTS = [
  // ------------------------------------------------------------------ Morphy 4…b5 5.Fb3 (après l'entrée « e4 e5 Nf3 Nc6 Bb5 a6 Ba4 »)
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5', sens: 'chasse le fou tout de suite, avant même de développer : direct, mais les pions avancés a6-b5 pourront devenir des cibles (a4 !)',
    menace: 'bxa4 gagne le fou : il doit bouger',
    plan: [{ san: 'Bb3', pourquoi: 'la seule case : le fou reste sur sa diagonale vers f7, hors de portée des pions' }],
    erreurs: [{ san: 'Bxb5', pourquoi: 'axb5 ! le pion a6 le prenait : une pièce de moins' }, { san: 'Nxe5', pourquoi: 'bxa4 ! d\'abord le fou : les Blancs ont donné une pièce pour un pion' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3', sens: 'le fou est à l\'abri sur la diagonale a2-g8 ; les Noirs développent, en surveillant leurs pions avancés',
    plan: [{ san: 'Nf6', pourquoi: 'développe et attaque e4 : on revient vers les chemins classiques' }, { san: 'Bb7', pourquoi: 'le fou sur la grande diagonale vise e4 ; l\'autre fou sortira ensuite' }],
    erreurs: [{ san: 'Nd4', pourquoi: 'Cxd4 exd4 Fxf7+ ! Rxf7 Dh5+ g6 Dd5+ et la tour a8 tombe : le saut du cavalier laissait f7 et a8 sans défense' }, { san: 'f6', pourquoi: 'n\'aide ni le développement ni le roi : a4 ! attaque déjà la chaîne b5' }] },

  // ------------------------------------------------------------------ Morphy 5.O-O b5 6.Fb3 (après l'entrée « … Ba4 Nf6 O-O »)
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5', sens: 'chasse le fou avant de sortir le fou roi : les Noirs choisiront ensuite sa case, f8 reste ouvert',
    menace: 'bxa4 gagne le fou',
    plan: [{ san: 'Bb3', pourquoi: 'la seule case : la pression sur f7 et le centre continue' }],
    erreurs: [{ san: 'Bxb5', pourquoi: 'axb5 ! une pièce contre un pion' }, { san: 'Nxe5', pourquoi: 'bxa4 ! et les Blancs ont perdu le fou pour un pion : prendre e5 ne compense rien' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3', sens: 'le fou garde f7 dans le viseur ; les Noirs choisissent la case de leur fou roi',
    plan: [{ san: 'Bb7', pourquoi: 'l\'Arkhangelsk : le fou vise e4 sur la grande diagonale, du contre-jeu actif' }, { san: 'Bc5', pourquoi: 'développe en visant f2 avant de roquer : la néo-Arkhangelsk, active' }, { san: 'Be7', pourquoi: 'la voie calme : …d6 et …O-O, on retrouve l\'Espagnole fermée' }],
    erreurs: [{ san: 'Nxe4', pourquoi: 'un coup trop tard pour l\'Ouverte : Te1 Cc5 Fd5 ! et le fou domine tout le centre' }, { san: 'g6', pourquoi: 'trop lent : d4 ! ouvre le centre, et après dxe5 dxe5 Dxd8+ les Noirs ne roqueront plus' }] },

  // ------------------------------------------------------------------ Steinitz différée 5.c3 (après l'entrée « … Ba4 d6 »)
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3', sens: 'prépare d4 et une retraite au fou (c2 si …b5) ; rappel : le cavalier c6 est cloué par le fou tant que la case d7 reste vide',
    plan: [{ san: 'Nf6', pourquoi: 'développe et attaque e4 : après d4 Fe7 puis …O-O, un jeu classique et sain' }, { san: 'Bd7', pourquoi: 'délie le cavalier c6 (cloué depuis que …d6 a vidé d7) et prépare tranquillement …Cf6 et …Fe7' }, { san: 'g6', pourquoi: 'le fou ira en g7 presser le centre d4 : solide' }],
    erreurs: [{ san: 'Qf6', pourquoi: 'sort la dame pour rien : d4 ! et le centre s\'ouvre, la dame sera une cible' }, { san: 'Nge7', pourquoi: 'bloque le fou f8 : d4 ! et le centre s\'ouvre pendant que les Noirs s\'emmêlent' }] },

  // ------------------------------------------------------------------ Échange 5…f6 (après l'entrée « … Bxc6 dxc6 O-O »)
  { coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6', sens: 'soutient e5 pour de bon : …f6 est solide ici, car le fou blanc des cases blanches a disparu — personne ne punira la diagonale affaiblie',
    plan: [{ san: 'd4', pourquoi: 'force l\'ouverture : exd4 Cxd4, l\'échange des dames se profile et la majorité blanche 4 contre 3 à l\'aile roi donne la finale voulue' }, { san: 'd3', pourquoi: 'plus calme : on développe d\'abord (Fe3, Cbd2), d4 viendra mieux préparé' }],
    erreurs: [{ san: 'Nxe5', pourquoi: 'fxe5 ! le pion f6 était là pour ça : une pièce contre un pion. Le contre Dh5+ est paré par Rd7 ! (pas …g6 ? Dxe5 prend la tour h8)' }] },

  // ------------------------------------------------------------------ Berlinoise 5…Cd6 : vers la finale (après l'entrée « … O-O Nxe4 d4 »)
  { coups: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6', sens: 'le cavalier recule en attaquant le fou b5 : les Blancs doivent réagir, et l\'échange en c6 mène à la fameuse finale berlinoise',
    menace: 'Cxb5 gagne le fou',
    plan: [{ san: 'Bxc6', pourquoi: 'prend avant d\'être pris : dxc6 dxe5 Cf5 Dxd8+ Rxd8 et c\'est la finale — majorité blanche saine à l\'aile roi, roi noir privé de roque' }, { san: 'dxe5', pourquoi: 'l\'autre ordre : Cxb5 a4 ! rappelle le cavalier vers d4, les Blancs regagnent la pièce, jeu égal' }],
    erreurs: [{ san: 'Be2', pourquoi: 'recule sans combattre : e4 ! chasse le cavalier f3 et les Noirs consolident leur pion de plus' }, { san: 'Bd3', pourquoi: 'e4 ! gagne de l\'espace avec gain de temps : les Noirs rendront peut-être le pion, mais gardent le meilleur jeu' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6', sens: 'prend le cavalier juste avant que …Cxb5 ne prenne le fou : les Noirs doivent bien reprendre, la finale est au bout',
    plan: [{ san: 'dxc6', pourquoi: 'la bonne reprise : ouvre le fou c8. Après dxe5 Cf5 Dxd8+ Rxd8, la finale berlinoise : les Noirs perdent le roque mais sont très solides avec la paire de fous' }],
    erreurs: [{ san: 'bxc6', pourquoi: 'reprend du mauvais côté : dxe5 chasse le cavalier d6 et les pions doublés c6-c7 n\'ont plus de compensation' }, { san: 'exd4', pourquoi: 'oublie de reprendre : Fa4 ! et le fou s\'échappe, les Blancs restent avec une pièce de plus' }],
    schema: { blancs: 'échanger les dames et jouer la finale : la majorité 4 contre 3 à l\'aile roi fera un pion passé ; avancer ces pions, échanger les pièces, pas les pions', noirs: 'pas de roque mais aucune faiblesse : garder la paire de fous, freiner la majorité blanche (…h5) et activer le roi, déjà bien placé pour la finale' } },
];
