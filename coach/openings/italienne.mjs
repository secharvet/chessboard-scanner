/**
 * Partie italienne : le livre des INTENTIONS (noyau écrit le 8 octobre 2026, même format que francaise.mjs).
 * Chaque entrée décrit la position atteinte après `coups` (SAN anglais) : sens du dernier coup, menace, plan (coups
 * recommandés pour le camp au trait, le principal d'abord), erreurs (coups fréquents mais fautifs), schema (plans du milieu).
 * Les positions avant 3.Fc4 sont incluses pour que l'assistant couvre 1…e5 dès le premier coup.
 * Vérifié au moteur par scripts/verif-livre-ouverture.mjs ; prolongé par scripts/ouvertures/etendre.mjs.
 */

export const OUVERTURE = 'Partie italienne';

export const LIVRE = [
  { coups: 'e4', sens: 'occupe le centre et ouvre la diagonale du fou roi et la dame',
    plan: [{ san: 'e5', pourquoi: 'répond au centre par le centre : la partie ouverte, celle où l\'on apprend le développement et le roque' }, { san: 'e6', pourquoi: 'la Française : …d5 viendra défier e4 (voir ce livre)', porte: 'francaise' }, { san: 'c5', pourquoi: 'la Sicilienne : on conteste d4 de côté, jeu déséquilibré', porte: 'sicilienne' }],
    erreurs: [{ san: 'f6', pourquoi: 'affaiblit le roi et prend la case du cavalier : après Cf3 et d4 les Noirs étouffent' }, { san: 'g5', pourquoi: 'ouvre la diagonale vers le roi et ne développe rien' }] },
  { coups: 'e4 e5', nom: 'Partie ouverte', sens: 'tient le centre pion contre pion : le pion e5 sera attaqué, il faudra le défendre en développant',
    plan: [{ san: 'Nf3', pourquoi: 'attaque e5 en développant : le coup le plus naturel du jeu' }, { san: 'Nc3', pourquoi: 'développe sans attaquer : plus calme (partie viennoise)', porte: 'viennoise' }, { san: 'Bc4', pourquoi: 'vise f7, le point faible : le fou de l\'Italienne, mais Cf3 d\'abord est plus précis', porte: 'fou-roi' }],
    erreurs: [{ san: 'Qh5', pourquoi: 'sort la dame pour le mat du berger : Cc6 puis g6 la chasse et les Noirs gagnent du temps' }, { san: 'f4', pourquoi: 'le gambit du roi : jouable mais le roi blanc s\'expose, pas pour débuter' }] },
  { coups: 'e4 e5 Nf3', sens: 'attaque le pion e5 avec un développement : les Noirs doivent le défendre ou le rendre',
    menace: 'Cxe5 gagne un pion',
    plan: [{ san: 'Nc6', pourquoi: 'défend e5 en développant : la réponse principale' }, { san: 'Nf6', pourquoi: 'contre-attaque e4 au lieu de défendre : la Petrov, solide', porte: 'petrov' }, { san: 'd6', pourquoi: 'défend par un pion : la Philidor, solide mais le fou f8 est enfermé', porte: 'philidor' }],
    erreurs: [{ san: 'f6', pourquoi: 'défend e5 mais Cxe5 ! fxe5 Dh5+ et le roi noir est à nu' }, { san: 'Bd6', pourquoi: 'défend e5 en bloquant son propre pion d7 : le fou c8 ne sortira plus' }] },
  { coups: 'e4 e5 Nf3 Nc6', sens: 'défend e5 en sortant une pièce : les deux camps ont un pion central et un cavalier',
    plan: [{ san: 'Bc4', pourquoi: 'l\'Italienne : le fou vise f7, la case la plus faible du camp noir (défendue par le seul roi)' }, { san: 'Bb5', pourquoi: 'l\'Espagnole : attaque indirectement e5 en gênant le cavalier qui le défend', porte: 'espagnole' }, { san: 'd4', pourquoi: 'l\'Écossaise : ouvre le centre tout de suite', porte: 'ecossaise' }],
    erreurs: [{ san: 'Ng5', pourquoi: 'attaque f7 trop tôt : …h6 ou …d5 le repousse et le cavalier a perdu deux temps' }, { san: 'Bd3', pourquoi: 'développe le fou devant son propre pion d2 : le fou c1 et le centre sont bloqués' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4', nom: 'Partie italienne', sens: 'pointe le fou sur f7, protégé par le seul roi : toute l\'ouverture tourne autour de ce point faible',
    menace: 'Cg5 suivi de Cxf7 ou Fxf7+ si les Noirs ne font rien pour f7',
    plan: [{ san: 'Bc5', pourquoi: 'symétrie : le fou noir vise f2 à son tour ; le Giuoco Piano, le « jeu tranquille »' }, { san: 'Nf6', pourquoi: 'attaque e4 : les Deux Cavaliers, plus tranchant, invite Cg5' }, { san: 'Be7', pourquoi: 'la Hongroise : solide, un peu passive' }],
    erreurs: [{ san: 'Nd4', pourquoi: 'piège tentant (si Cxe5 ? Dg5 !) mais c3 ! ou Cxd4 exd4 c3 laisse les Noirs en retard' }, { san: 'h6', pourquoi: 'empêche Cg5 au prix d\'un temps : d4 ! et les Blancs prennent le centre' }] },

  // ------------------------------------------------------------------ Giuoco Piano 3…Fc5
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5', nom: 'Giuoco Piano', sens: 'copie le plan blanc : le fou vise f2 ; les deux fous se regardent, les cavaliers sont développés',
    plan: [{ san: 'c3', pourquoi: 'prépare d4 pour prendre tout le centre et chasser le fou c5 : le plan principal' }, { san: 'd3', pourquoi: 'le Giuoco Pianissimo : on garde le centre fermé, on roque, on manœuvre' }, { san: 'O-O', pourquoi: 'met le roi à l\'abri avant de choisir' }, { san: 'b4', pourquoi: 'le gambit Evans : un pion pour gagner du temps sur le fou et jouer c3-d4 avec tempo ; le moteur ne l\'aime pas, les romantiques si' }],
    erreurs: [{ san: 'Bxf7+', pourquoi: 'sacrifie le fou pour rien : Rxf7 et les Noirs ont une pièce de plus pour un pion' }, { san: 'Nxe5', pourquoi: 'prend un pion mais Cxe5 ! et si d4, Fxd4 ou Fd6 : les Blancs ont perdu une pièce pour deux pions au mieux' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3', sens: 'prépare d4 : si …exd4 cxd4 attaque le fou c5 et les Blancs ont deux pions au centre',
    menace: 'd4 chasse le fou et prend le centre',
    plan: [{ san: 'Nf6', pourquoi: 'contre-attaque e4 avant que d4 n\'arrive : la ligne principale' }, { san: 'd6', pourquoi: 'soutient e5 ; après d4 Fb6 la position reste fermée' }],
    erreurs: [{ san: 'd5', pourquoi: 'trop tôt : exd5 Cxd5 (ou Dxd5) et d4 vient avec gain de temps' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6', sens: 'attaque e4 : les Blancs doivent choisir entre d4 tout de suite et d3 plus calme',
    menace: 'Cxe4 gagne un pion',
    plan: [{ san: 'd4', pourquoi: 'prend le centre : exd4 cxd4 Fb4+ et une position ouverte où le développement compte' }, { san: 'd3', pourquoi: 'défend e4, garde le centre fermé : la version moderne, on roque et on joue b4, a4, Cbd2' }],
    erreurs: [{ san: 'O-O', pourquoi: 'laisse e4 en prise : Cxe4 et d4 ne menace plus rien' }, { san: 'Qe2', pourquoi: 'défend e4 avec la dame et bloque le fou f1… qui est déjà sorti, mais la dame sera chassée' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4', sens: 'prend le centre : le pion attaque le fou et le pion e5 à la fois',
    menace: 'dxc5 ou dxe5 gagne du matériel',
    plan: [{ san: 'exd4', pourquoi: 'la seule réponse : on rend le centre pour ne pas perdre de pièce' }],
    erreurs: [{ san: 'Bb6', pourquoi: 'garde le fou mais dxe5 Cxe4 Dd5 ! menace f7 et le cavalier' }, { san: 'Bd6', pourquoi: 'bloque le pion d7 et le fou c8 ; dxe5 Fxe5 Cxe5 Cxe5 Fxf7+ ! ' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4', sens: 'rend le centre : les Blancs reprendront par cxd4 avec tempo sur le fou',
    plan: [{ san: 'cxd4', pourquoi: 'reprend en attaquant le fou : deux pions au centre contre un développement noir avancé' }, { san: 'e5', pourquoi: 'la poussée : chasse le cavalier avant de reprendre ; …d5 ! est la bonne réponse' }],
    erreurs: [{ san: 'Nxd4', pourquoi: 'reprend du cavalier : Cxe4 ! et f2 tremble, les Noirs égalisent facilement' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4', sens: 'reprend en attaquant le fou : les pions d4-e4 forment un centre complet',
    menace: 'dxc5 gagne le fou',
    plan: [{ san: 'Bb4+', pourquoi: 'échec intermédiaire : le fou se sauve avec tempo et force les Blancs à interposer ou à jouer Fd2' }],
    erreurs: [{ san: 'Bb6', pourquoi: 'recule sans échec : d5 ! Ce7 e5 et les Noirs sont étouffés' }, { san: 'Be7', pourquoi: 'passif : d5 Ca5 Fd3 et les Blancs dominent le centre' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+', sens: 'échec qui gagne un temps : les Blancs choisissent entre le solide Fd2 et le vif Cc3 (gambit)',
    plan: [{ san: 'Bd2', pourquoi: 'interpose et propose l\'échange : Fxd2+ Cbxd2 d5 ! égalise, position classique' }, { san: 'Nc3', pourquoi: 'le gambit : Cxe4 O-O ! et les Blancs sacrifient un pion pour l\'attaque (attaque Möller)' }],
    erreurs: [{ san: 'Kf1', pourquoi: 'perd le droit de roquer pour rien : le roi gêne la tour h1' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 d3', nom: 'Giuoco Pianissimo', sens: 'ferme le centre : les Blancs renoncent à d4 pour l\'instant, roquent et manœuvrent (c3, b4, a4, Cbd2-f1-g3)',
    plan: [{ san: 'Nf6', pourquoi: 'développe en visant e4 : la suite naturelle' }, { san: 'd6', pourquoi: 'soutient e5 et libère le fou c8' }],
    erreurs: [{ san: 'Nd4', pourquoi: 'Cxd4 Fxd4 c3 et le fou perd un temps' }, { san: 'f5', pourquoi: 'ouvre le roi : exf5 et Cg5 ou Dh5+ pointent sur f7' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6', sens: 'les quatre cavaliers et les deux fous sont sortis : on roque, puis on prépare lentement d4 ou l\'attaque à l\'aile roi',
    plan: [{ san: 'c3', pourquoi: 'prépare d4 et donne une case de retraite au fou en c2 ; plan b4-a4 à l\'aile dame' }, { san: 'O-O', pourquoi: 'roi à l\'abri d\'abord' }],
    erreurs: [{ san: 'Ng5', pourquoi: 'attaque f7 mais O-O ! et le cavalier n\'a rien : h6 le renvoie' }, { san: 'Bg5', pourquoi: 'cloue le cavalier mais h6 Fh4 g5 ! Fg3 et le fou est enfermé, le roi noir prendra l\'abri sur l\'aile dame ou roquera après' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4', nom: 'Gambit Evans', sens: 'offre un pion : si Fxb4, c3 chasse le fou avec tempo et d4 prend le centre, les Blancs gagnent deux temps pour un pion',
    plan: [{ san: 'Bxb4', pourquoi: 'accepte : il faut ensuite rendre le pion au bon moment (…d5 ou …Fa5-b6) et finir le développement' }, { san: 'Bb6', pourquoi: 'refuse : le fou garde la diagonale, b4 reste un pion un peu avancé' }],
  },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4', sens: 'a pris le pion : les Blancs vont jouer c3 et d4 avec tempo',
    plan: [{ san: 'c3', pourquoi: 'chasse le fou et prépare d4 : le pion sacrifié paie en temps' }],
    erreurs: [{ san: 'a3', pourquoi: 'chasse le fou sans préparer d4 : Fa5 et le pion b4 a été donné pour rien' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3', sens: 'attaque le fou et prépare d4 : le centre blanc va rouler',
    menace: 'cxb4 reprend le fou',
    plan: [{ san: 'Ba5', pourquoi: 'garde la diagonale vers f2 et le clouage éventuel sur c3 ; la retraite classique' }, { san: 'Be7', pourquoi: 'solide : le fou défend le roi, on rendra le pion par …d5' }],
    erreurs: [{ san: 'Bd6', pourquoi: 'bloque d7 : d4 et le fou gêne tout le camp noir' }] },

  // ------------------------------------------------------------------ Deux Cavaliers 3…Cf6
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6', nom: 'Défense des deux cavaliers', sens: 'attaque e4 au lieu de défendre : les Noirs acceptent Cg5 et le sacrifice de pion …d5 pour l\'initiative',
    menace: 'Cxe4 prend un pion',
    plan: [{ san: 'Ng5', pourquoi: 'attaque f7 deux fois : les Noirs doivent répondre …d5, seule défense' }, { san: 'd3', pourquoi: 'défend e4 tranquillement : on revient dans un Pianissimo' }, { san: 'd4', pourquoi: 'ouvre le centre : exd4 et une position vive' }],
    erreurs: [{ san: 'Nc3', pourquoi: 'défend e4 mais Cxe4 ! Cxe4 d5 fourchette : les Noirs récupèrent la pièce avec un bon centre' }, { san: 'O-O', pourquoi: 'laisse e4 en prise : Cxe4 et il faut jouer Te1 pour le récupérer, sans avantage' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5', sens: 'attaque f7 avec le fou et le cavalier : f7 n\'est défendu que par le roi',
    menace: 'Cxf7 fourchette dame et tour, ou Fxf7+',
    plan: [{ san: 'd5', pourquoi: 'la seule parade : bloque la diagonale du fou avec gain de temps' }],
    erreurs: [{ san: 'Bc5', pourquoi: 'ignore la menace : Cxf7 ! et si Fxf2+ Rf1, les Blancs gagnent la qualité' }, { san: 'h6', pourquoi: 'Cxf7 ! Rxf7 Dh5+ et le roi noir se promène' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5', sens: 'bloque la diagonale : les Blancs doivent prendre, et les Noirs reprennent ou sacrifient',
    plan: [{ san: 'exd5', pourquoi: 'la seule suite logique : garde la menace sur f7 si les Noirs reprennent du cavalier' }],
    erreurs: [{ san: 'Bxd5', pourquoi: 'Cxd5 exd5 Dxd5 et les Noirs ont le centre et le développement' }, { san: 'Bb3', pourquoi: 'dxe4 et les Blancs ont un pion de moins et un cavalier en l\'air' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5', sens: 'prend : si …Cxd5 ? Cxf7 ! (l\'attaque Fegatello, « foie frit ») ; la bonne réponse est …Ca5',
    menace: 'dxc6 ou, après …Cxd5, Cxf7 !',
    plan: [{ san: 'Na5', pourquoi: 'attaque le fou c4 et laisse le pion : les Noirs auront le développement et l\'initiative (ligne principale)' }, { san: 'Nd4', pourquoi: 'le contre-gambit Fritz : tranchant, à connaître avant de le jouer', porte: 'fritz' }, { san: 'b5', pourquoi: 'l\'Ulvestad : dévie le fou, très vif', porte: 'ulvestad' }],
    erreurs: [{ san: 'Nxd5', pourquoi: 'la faute classique : Cxf7 ! Rxf7 Df3+ Re6 Cc3 et le roi noir est traîné au centre' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5', sens: 'attaque le fou et refuse de reprendre : les Noirs donnent un pion pour chasser les pièces blanches et développer vite',
    menace: 'Cxc4 gagne le fou',
    plan: [{ san: 'Bb5+', pourquoi: 'échec intermédiaire : c6 dxc6 bxc6 et le fou recule en e2 ; les Blancs gardent le pion, les Noirs l\'initiative' }],
    erreurs: [{ san: 'Qf3', pourquoi: 'menace f7 mais h6 ! chasse le cavalier, la dame est mal placée et les Noirs gagnent des temps' }, { san: 'Bb3', pourquoi: 'Cxb3 axb3 et les Blancs ont perdu la paire de fous pour un pion douteux' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5', sens: 'reprend le pion mais laisse f7 à deux attaquants : les Blancs peuvent sacrifier',
    plan: [{ san: 'Nxf7', pourquoi: 'le « foie frit » : Rxf7 Df3+ et le roi noir doit aller en e6 pour défendre d5 ; attaque violente, à connaître' }],
    erreurs: [{ san: 'Bxd5', pourquoi: 'Dxd5 et le cavalier g5 est perdu : Cxf7 ? Dxg2 !' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7', nom: 'Attaque Fegatello (foie frit)', sens: 'sacrifie le cavalier pour arracher le roi : après Rxf7 Df3+ le roi doit s\'avancer en e6 pour garder d5',
    menace: 'Cxd8 gagne la dame si le cavalier n\'est pas repris',
    plan: [{ san: 'Kxf7', pourquoi: 'il faut prendre : sinon la dame tombe ; le roi va devoir vivre dangereusement' }],
    erreurs: [{ san: 'Qe7', pourquoi: 'Cxh8 et les Blancs ont une tour de plus' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7', sens: 'le roi noir est en f7 : les Blancs ont une pièce de moins mais le roi adverse à portée',
    plan: [{ san: 'Qf3+', pourquoi: 'échec qui attaque aussi d5 : Re6 est forcé (Re8 ? Fxd5 et la pièce revient avec une attaque gagnante)' }],
    erreurs: [{ san: 'Bxd5+', pourquoi: 'Re8 et les Blancs n\'ont qu\'un pion pour la pièce' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+', sens: 'attaque le roi et le cavalier d5 : le roi doit défendre lui-même',
    menace: 'Fxd5+ gagne la pièce si le roi quitte la défense de d5',
    plan: [{ san: 'Ke6', pourquoi: 'la seule façon de garder d5 : le roi au milieu, mais une pièce de plus' }],
    erreurs: [{ san: 'Ke8', pourquoi: 'Fxd5 et les Blancs récupèrent la pièce avec une attaque décisive' }, { san: 'Kg8', pourquoi: 'Fxd5+ Re8 Fxc6 ou Dxf6 ? non : Fxd5+ gagne simplement la pièce' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6', sens: 'le roi tient d5 au milieu de l\'échiquier : il faut lui amener toutes les pièces',
    plan: [{ san: 'Nc3', pourquoi: 'attaque d5 une troisième fois : Cce7 ou Cb4 et la bataille fait rage, d4 suivra' }],
    erreurs: [{ san: 'Bxd5+', pourquoi: 'trop tôt : Rd6 et le roi se sauve vers l\'aile dame avec la pièce de plus' }] },

  // ------------------------------------------------------------------ Hongroise 3…Fe7 et fautes de débutant
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Be7', nom: 'Défense hongroise', sens: 'développe le fou sans l\'exposer : solide, mais ne vise rien ; les Blancs prennent le centre',
    plan: [{ san: 'd4', pourquoi: 'prend le centre tout de suite, les Noirs n\'ont pas de contre-jeu sur f2' }, { san: 'O-O', pourquoi: 'roque d\'abord, d4 ensuite' }],
    erreurs: [{ san: 'Ng5', pourquoi: 'Fxg5 ! et le fou c1 reprend, mais les Blancs ont échangé un cavalier actif contre un fou passif sans rien gagner' }] },
  { coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 O-O', sens: 'roque d\'abord : le roi à l\'abri, les Blancs choisiront ensuite entre c3-d4 et d3',
    plan: [{ san: 'Nf6', pourquoi: 'développe en attaquant e4' }, { san: 'd6', pourquoi: 'soutient e5, libère le fou c8' }],
    erreurs: [{ san: 'Nd4', pourquoi: 'Cxd4 Fxd4 c3 et le fou recule : deux temps perdus' }, { san: 'Qf6', pourquoi: 'la dame sort trop tôt pour viser f2 : c3 et d4 la chassent' }] },
];

export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) {
    const c = new Chess();
    for (const san of e.coups.split(' ')) c.move(san);
    out.set(c.fen().split(' ').slice(0, 4).join(' '), e);
  }
  return out;
}
