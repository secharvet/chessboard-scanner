/**
 * Complément au livre « Défense française » : les lignes nommées (ECO) manquantes pour un joueur
 * de club (expert échecs, 17 octobre 2026). Même format que coach/openings/francaise.mjs — entrées
 * à coller telles quelles dans LIVRE, aux bons endroits des sections existantes.
 * Couvre : C13 Alekhine-Chatard et Burn, C12 MacCutcheon, C03 Tarrasch 3…Fe7 et 3…a6, C10 Fort Knox,
 * C18 Winawer 6…Dc7 et 6…Da5, C17 retraite 5…Fa5, C15 4.Ce2, C02 Wade, C00 est-indienne,
 * deux cavaliers et franco-sicilienne. Quelques positions de liaison (non demandées) comblent les
 * trous entre une racine du noyau et la position nommée : marquées « liaison » en commentaire.
 * Vérifié : chaque coup cité légal (chess.js) ; chaque plan dans le MultiPV de tête et chaque faute
 * confirmée à Stockfish 19, profondeur 20, MultiPV 4 ; chaque réfutation citée est la meilleure
 * réponse du moteur. Deux choix à trancher par le pilote, signalés « ARBITRAGE » en commentaire.
 */

export const COMPLEMENTS = [
  // ------------------------------------------------------------------ C13 Attaque Alekhine-Chatard (racine du noyau : « … Bg5 Be7 e5 Nfd7 », plan h4)
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4', nom: 'Française, attaque Alekhine-Chatard (C13)',
    sens: 'offre le pion h4 : si …Fxg5 hxg5 Dxg5, la colonne h s\'ouvre pour la tour et chaque attaque contre la dame gagnera un temps ; si les Noirs refusent, h4-h5 renforcera l\'assaut',
    plan: [
      { san: 'c5', pourquoi: 'refuse le pion et contre-attaque la base d4 : la réponse la plus simple (défense Breyer)' },
      { san: 'Bxg5', pourquoi: 'accepte le gambit : un pion de plus, mais la dame ira le chercher seule en plein camp blanc — jouable seulement si on connaît la suite' },
    ],
    erreurs: [
      { san: 'O-O', pourquoi: 'roque droit dans l\'attaque (Spielmann) : Dh5 ! et tout joue contre le roi — Fd3, puis h5 ou Dh6, la cible est choisie' },
      { san: 'f6', pourquoi: 'ouvre sur son propre roi (Teichmann) : Dh5+ ! g6 exf6 et le roi noir, coincé au centre, ne s\'en remet pas' },
      { san: 'a6', pourquoi: 'la préparation Maróczy, trop lente ici : Dg4 ! frappe g7 avant même que …c5 n\'existe' },
    ] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 Bxg5', // liaison
    sens: 'accepte le sacrifice : prend le fou, mais la colonne h va s\'ouvrir — exactement ce que les Blancs voulaient',
    plan: [{ san: 'hxg5', pourquoi: 'reprend la pièce en ouvrant la colonne h : la tour h1 attaque déjà sans avoir bougé' }],
    erreurs: [{ san: 'Nf3', pourquoi: 'oublie le fou : il recule (…Fe7) et les Blancs ont donné une pièce pour rien' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 Bxg5 hxg5', // liaison
    sens: 'reprend en ouvrant la colonne h ; le pion g5 est offert : c\'est lui, le gambit',
    plan: [{ san: 'Qxg5', pourquoi: 'puisqu\'on a pris le fou, il faut prendre le pion : sinon la colonne h est ouverte gratuitement' }],
    erreurs: [{ san: 'h6', pourquoi: 'attaque g5 au lieu de le prendre : Dd2 ! le garde, et gxh6 ouvrira la colonne au bon moment — un pion de moins et le roi à l\'air' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 Bxg5 hxg5 Qxg5', nom: 'Alekhine-Chatard, gambit accepté',
    sens: 'ramasse le pion du gambit : les Noirs ont le matériel, les Blancs la colonne h et des temps à gagner sur cette dame avancée',
    plan: [
      { san: 'Nh3', pourquoi: 'développe en attaquant la dame : chaque temps gagné sur elle nourrit l\'attaque, et le cavalier vise f4 ou b5 selon le moment' },
      { san: 'Rh3', pourquoi: 'la tour monte par la colonne ouverte : Tg3 harcèlera la dame — le dividende direct du gambit' },
    ],
    erreurs: [
      { san: 'Qg4', pourquoi: 'la case n\'est défendue par personne : …Dxg4 gagne la dame, tout simplement' },
      { san: 'Rxh7', pourquoi: 'fonce trop tôt : …Txh7 ! la tour h8 défendait h7 — une tour contre un pion' },
    ] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 c5', nom: 'Alekhine-Chatard, défense Breyer',
    sens: 'refuse le pion et contre-attaque la base d4 : pendant que les Blancs regardent l\'aile roi, les Noirs jouent au centre',
    plan: [{ san: 'Bxe7', pourquoi: 'échange avant que …cxd4 n\'arrive : après …Rxe7 ! (la bonne reprise : la dame garde d8), dxc5 ou Dd2 et les Blancs gardent l\'initiative' }],
    erreurs: [{ san: 'dxc5', pourquoi: '…Cxe5 ! ramasse le pion central : d4 parti, plus personne ne défendait e5' }] },

  // ------------------------------------------------------------------ C13 Variante Burn (racine du noyau : « … Nf6 Bg5 », plan dxe4)
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4', nom: 'Classique, variante Burn (C13)',
    sens: 'échange au centre pour se libérer : les Noirs joueront …Fe7 et …Cbd7, sans faiblesse ; les Blancs gardent l\'espace',
    plan: [{ san: 'Nxe4', pourquoi: 'reprend le pion en centralisant : le cavalier ajoute une attaque sur f6, déjà cloué' }],
    erreurs: [{ san: 'Bxf6', pourquoi: 'échange avant de reprendre : …gxf6 ! et les pions doublés tiennent le centre — …f5 chassera le cavalier et le fou viendra en g7' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4',
    sens: 'reprend au centre : f6 est attaqué deux fois (cavalier et fou) et le clouage interdit à la dame de s\'en mêler',
    menace: 'Cxf6+ : si …Dxf6 ?? Fxf6 gagne la dame (clouage !) ; il faudrait reprendre de g7 et abîmer les pions',
    plan: [
      { san: 'Be7', pourquoi: 'décloue : désormais l\'échange en f6 sera repris du fou et les pions resteront sains' },
      { san: 'Nbd7', pourquoi: 'couvre f6 une deuxième fois : l\'échange pourra être repris du cavalier' },
    ],
    erreurs: [{ san: 'Nxe4', pourquoi: 'le cavalier était cloué : Fxd8 ! prend la dame — deux pièces mineures ne la valent pas' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4 Be7', nom: 'Burn, 5…Fe7',
    sens: 'décloue et prépare le roque ; au passage, le cavalier e4 est attaqué par f6 : les Blancs doivent réagir',
    menace: '…Cxe4 gagne le cavalier, qui n\'est plus protégé par le clouage',
    plan: [
      { san: 'Bxf6', pourquoi: 'élimine l\'attaquant de e4 : …Fxf6 simplifie, …gxf6 !? (le goût moderne) abîme les pions mais ouvre la colonne g — dans les deux cas les Blancs gardent l\'espace' },
      { san: 'Nxf6+', pourquoi: 'l\'autre échange : …Fxf6 et la position est saine des deux côtés, un peu moins ambitieux' },
    ],
    erreurs: [{ san: 'Nf3', pourquoi: 'développe en oubliant la menace : …Cxe4 ramasse le cavalier' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4 Nbd7', nom: 'Burn, 5…Cbd7',
    sens: 'couvre f6 : l\'échange y sera repris du cavalier, et le fou f8 garde le choix de sa case ; e4 reste protégé par le clouage',
    plan: [
      { san: 'Nf3', pourquoi: 'développe tranquillement : le cavalier e4 ne craint rien, f6 est toujours cloué (…Cxe4 ?? Fxd8)' },
      { san: 'Nxf6+', pourquoi: 'échange tout de suite : …Cxf6 et les pions noirs restent sains, puis Cf3 et l\'espace décide' },
    ] },

  // ------------------------------------------------------------------ C12 Variante MacCutcheon (racine du noyau : « … Nf6 Bg5 », plan Bb4)
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4', nom: 'Française, variante MacCutcheon (C12)', // liaison
    sens: 'répond au clouage par un contre-clouage : au lieu de défendre f6, les Noirs attaquent — le cavalier c3 est cloué sur le roi et ne défend plus e4',
    menace: '…dxe4 gagne le pion : le cavalier c3, cloué, n\'a pas le droit de reprendre',
    plan: [
      { san: 'e5', pourquoi: 'sauve e4 en avançant, avec gain de temps sur le cavalier f6 : la grande ligne' },
      { san: 'exd5', pourquoi: 'lève la menace en échangeant : plus calme, les Noirs égalisent sans mal' },
    ],
    erreurs: [
      { san: 'Nf3', pourquoi: 'défend tout sauf e4 : …dxe4 gagne le pion, le cavalier cloué ne reprend pas' },
      { san: 'a3', pourquoi: 'chasse le fou au mauvais moment : …Fxc3+ bxc3 dxe4 — le pion e4 tombe, avec les pions doublés en prime' },
    ] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5', // liaison
    sens: 'pousse en attaquant le cavalier cloué sur la dame : il doit se décider, et la chaîne d4-e5 pointe vers l\'aile roi',
    menace: 'exf6 gagne le cavalier s\'il ne bouge pas',
    plan: [{ san: 'h6', pourquoi: 'LE coup de la MacCutcheon : avant de sauver le cavalier, on interroge le fou — sur exf6, hxg5 ! reprend la pièce' }],
    erreurs: [
      { san: 'Nfd7', pourquoi: 'recule comme dans la classique… mais le fou b4 est parti : plus rien ne bouche la diagonale g5-d8 — Fxd8 ! prend la dame' },
      { san: 'Ne4', pourquoi: 'même oubli : le cavalier ne peut quitter f6 que si la dame est protégée — Fxd8 ! la prend' },
    ] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6',
    sens: 'interroge le fou avant de bouger le cavalier : chaque retraite a son nom, et exf6 se heurte à …hxg5',
    plan: [
      { san: 'Bd2', pourquoi: 'la retraite principale (Lasker) : le fou couvre c3 ; le cavalier f6 reste attaqué, aux Noirs de régler ça' },
      { san: 'Be3', pourquoi: 'variante Janowski : le fou garde la diagonale et soutient d4' },
      // ARBITRAGE : exf6 (Chigorin) est à 0,34 du meilleur coup (+0.22 contre +0.56), un poil au-dessus du seuil 0,3.
      // Je le garde en plan car c'est une variante nommée demandée et la position reste meilleure pour les Blancs. À toi de trancher.
      { san: 'exf6', pourquoi: 'variante Chigorin : prend le cavalier ; après …hxg5 fxg7 Tg8, chacun a sa pièce et les Noirs ont les colonnes g et h' },
    ],
    erreurs: [{ san: 'Bh4', pourquoi: 'variante Bernstein, à éviter : …g5 ! Fg3 Ce4 et les Noirs gagnent du temps sur tout le monde' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2', nom: 'MacCutcheon, variante Lasker',
    sens: 'recule sur la case qui couvre c3 ; le cavalier f6 est toujours attaqué par e5 : les Noirs répondent par l\'échange en c3 puis le saut en e4 — dans cet ordre !',
    menace: 'exf6 gagne le cavalier s\'il ne se passe rien',
    plan: [{ san: 'Bxc3', pourquoi: 'd\'abord l\'échange : après bxc3, …Ce4 ! sauve le cavalier EN attaquant le fou d2 — le coup d\'avance change tout' }],
    erreurs: [
      { san: 'Ne4', pourquoi: 'saute un coup trop tôt : le fou d2 bouche maintenant le clouage, donc Cxe4 ! reprend tout bonnement — l\'ordre est …Fxc3 d\'abord' },
      { san: 'Ng8', pourquoi: 'sauve le cavalier en reculant : tous les temps sont rendus et l\'attaque blanche arrive gratuitement' },
    ] },
  { coups: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Bxc3 bxc3 Ne4',
    sens: 'le cavalier fuit en attaquant : il frappe le fou d2 et le pion c3, et s\'appuie sur d5 ; mais le fou noir parti, g7 n\'a plus de défenseur naturel',
    plan: [
      { san: 'Qg4', pourquoi: 'la réponse de toute la variante : vise g7 — …g6 affaiblit les cases noires, …Rf8 perd le roque ; le cavalier e4, lui, ne prend rien d\'important' },
      { san: 'Bc1', pourquoi: 'étonnant mais bon : recule pour garder la paire de fous — sur …Cxc3, Dg4 vient quand même' },
    ],
    erreurs: [{ san: 'f3', pourquoi: 'chasse le cavalier en ouvrant son roi : …Dh4+ ! g3 Cxg3 et après hxg3 Dxh1, la tour est perdue' }] },

  // ------------------------------------------------------------------ C03 Tarrasch : 3…Fe7 et 3…a6 (racine du noyau : « e4 e6 d4 d5 Nd2 »)
  { coups: 'e4 e6 d4 d5 Nd2 Be7', nom: 'Tarrasch, 3…Fe7 (variante Morozevich) (C03)',
    sens: 'sort le fou avant le cavalier : un coup d\'attente malin — les Noirs gardent …Cf6, …c5 et même …Ch6 en réserve, et demandent aux Blancs de se dévoiler d\'abord',
    plan: [{ san: 'Ngf3', pourquoi: 'développe sans rien dévoiler non plus : sur …Cf6, e5 ramène aux lignes fermées ; sur …c5, exd5 aux lignes ouvertes' }],
    erreurs: [{ san: 'Qg4', pourquoi: 'attaque g7 trop tôt : …Cf6 ! développe en frappant la dame — si Dxg7 Tg8 puis …dxe4, l\'attaque se retourne' }] },
  { coups: 'e4 e6 d4 d5 Nd2 a6', nom: 'Tarrasch, 3…a6 (système moderne) (C03)',
    sens: 'petit coup très utile : prépare …c5 sans craindre Fb5+, l\'échec qui gêne d\'habitude le système ouvert ; b5 est aussi interdit aux pièces blanches',
    plan: [{ san: 'Ngf3', pourquoi: 'développe et attend : sur …c5, exd5 et le jeu s\'ouvre — l\'échec en b5 ne manquera qu\'à moitié' }] },

  // ------------------------------------------------------------------ C10 Fort Knox (racine du noyau : « … Nc3 dxe4 Nxe4 », plan Bd7)
  { coups: 'e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7', nom: 'Rubinstein, variante Fort Knox (C10)',
    sens: 'le mauvais fou prend le grand chemin : il ira en c6 tenir la diagonale et s\'échanger contre une pièce centrale — solide comme un coffre-fort, mais sans ambition',
    plan: [{ san: 'Nf3', pourquoi: 'développe et laisse venir : quand le fou arrivera en c6, on décidera de l\'échange' }],
    erreurs: [{ san: 'Qg4', pourquoi: 'vise g7 en oubliant ses pièces : …f5 ! frappe la dame et le cavalier à la fois — après Dh5+ g6, fxe4 ramasse la pièce' }] },
  { coups: 'e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7 Nf3', // liaison
    sens: 'développe tranquillement : la question se posera en c6',
    plan: [{ san: 'Bc6', pourquoi: 'le coup du système : le fou tient a8-h1 et propose ses services contre le cavalier e4 — échanger le mauvais fou, c\'était tout le sens de …Fd7' }],
    erreurs: [{ san: 'Bb5', pourquoi: 'saute une étape : Fxb5+ ! le fou f1 le prenait — c6 était le chemin, pas b5' }] },
  { coups: 'e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7 Nf3 Bc6',
    sens: 's\'installe sur la grande diagonale et attaque le cavalier e4 : l\'échange du mauvais fou contre la belle pièce centrale est proposé',
    menace: '…Fxe4 gagne le cavalier si personne ne le protège',
    plan: [{ san: 'Bd3', pourquoi: 'développe ET protège e4 : si …Fxe4 Fxe4, le fou reprend la belle case et vise h7 ; sinon, O-O et la petite pression durable' }],
    erreurs: [{ san: 'Be2', pourquoi: 'développe du mauvais côté : …Fxe4 ramasse le cavalier oublié' }] },

  // ------------------------------------------------------------------ C18 Winawer : 6…Dc7 et 6…Da5 (racine du noyau : « … a3 Bxc3+ bxc3 »)
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Qc7', nom: 'Winawer, 6…Dc7 (variante classique) (C18)',
    sens: 'la dame surveille c3 et e5 et laisse le roi libre de son camp ; contre Dg4, les Noirs sont prêts à donner g7 pour prendre le centre en échange',
    plan: [
      { san: 'Qg4', pourquoi: 'pose la grande question de g7 : …Ce7 Dxg7 Tg8 Dxh7 cxd4 — les Blancs ramassent au bord, les Noirs au centre ; la bagarre typique de la Winawer' },
      { san: 'Nf3', pourquoi: 'développe simplement : solide, et la paire de fous attend son heure' },
    ],
    erreurs: [{ san: 'dxc5', pourquoi: 'lâche le centre : …Dxe5+ ! ramasse le pion central avec échec — c\'était lui, le trophée' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Qa5', nom: 'Winawer, 6…Da5 (variante Portisch-Hook) (C18)',
    sens: 'attaque le pion doublé c3 de côté : la dame le harcèlera toute la partie',
    menace: '…Dxc3+ gagne le pion doublé avec échec',
    plan: [{ san: 'Bd2', pourquoi: 'couvre c3 : la menace était réelle ; les Blancs reprennent ensuite leur attaque (h4, Dg4) avec le pion sauvé' }],
    erreurs: [
      { san: 'Qg4', pourquoi: 'part à l\'attaque en laissant sa maison ouverte : …Dxc3+ puis …Dxd4+ — deux pions et l\'initiative changent de camp' },
      { san: 'Nf3', pourquoi: 'développe en laissant c3 en l\'air : …cxd4 ! et après Dxd4 Cc6, la dame est chassée pendant que c3 reste faible — l\'avantage s\'évapore' },
    ] },

  // ------------------------------------------------------------------ C17 Winawer, retraite 5…Fa5 (racine du noyau : « … e5 c5 a3 »)
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Ba5', nom: 'Winawer, variante de retraite 5…Fa5 (C17)',
    sens: 'garde le fou au lieu de l\'échanger : le clouage sur c3 continue ; mais le fou s\'éloigne de son roi, et b4 ! peut venir le harceler',
    plan: [
      { san: 'b4', pourquoi: 'la pointe : attaque le fou en offrant un pion — et b4 bouche la diagonale, le clouage est levé de force' },
      { san: 'Qg4', pourquoi: 'ignore le fou et frappe g7 tout de suite : …Ce7 dxc5 et le fou a5 regarde la bataille de loin' },
    ],
    erreurs: [{ san: 'dxc5', pourquoi: 'ouvre au mauvais moment : …Fxc3+ bxc3 Dc7 et les pions e5, c5 et c3 sont autant de cibles — plus d\'avantage' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Ba5 b4', nom: 'Winawer 5…Fa5 6.b4 (ligne arménienne)',
    sens: 'chasse le fou en donnant un pion : s\'il s\'obstine sur la diagonale, il sera enterré — la bonne réponse des Noirs passe par le centre',
    plan: [{ san: 'cxd4', pourquoi: 'ne prend pas l\'appât : prend le centre ; sur le meilleur Cb5, …Fc7 ! règle le fou (Cxc7+ Dxc7) et les Noirs tiennent, un peu moins bien mais jouables' }],
    erreurs: [
      { san: 'Bxb4', pourquoi: 'prend avec la pièce : axb4 cxb4 Cb5 ! — le fou est parti pour deux pions et le cavalier déboule vers d6' },
      { san: 'Bb6', pourquoi: 's\'obstine : dxc5 ! prend un pion en attaquant encore le fou — il doit fuir en c7, les Blancs ont tout gagné' },
    ] },

  // ------------------------------------------------------------------ C15 Winawer 4.Ce2 (racine du noyau : « e4 e6 d4 d5 Nc3 Bb4 »)
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 Ne2', nom: 'Winawer, variante Alekhine-Maróczy 4.Ce2 (C15)',
    sens: 'couvre c3 : l\'échange …Fxc3 ne doublera plus les pions, Cxc3 reprendrait — tout le projet noir tombe ; en échange, le cavalier bouche le fou f1',
    plan: [{ san: 'dxe4', pourquoi: 'prend le pion offert : les Blancs le regagneront (a3 puis Cxe4), mais les Noirs auront un jeu simple et sain' }],
    erreurs: [{ san: 'Bxc3+', pourquoi: 'échange sans y être forcé : Cxc3 reprend SANS doubler les pions — le bénéfice de la Winawer est perdu' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4', // liaison
    sens: 'prend le pion : aux Blancs de montrer comment ils le regagnent — pas de reprise directe, le cavalier c3 est cloué (Cxe4 est même illégal)',
    plan: [{ san: 'a3', pourquoi: 'règle d\'abord le fou : après …Fxc3+ Cxc3 (ou …Fe7), le cavalier ira ramasser e4 tranquillement' }],
    erreurs: [{ san: 'f3', pourquoi: 'reprend avec le mauvais pion : …exf3 gxf3 Dh4+ ! et le roi blanc a perdu son toit pour un pion regagnable autrement' }] },
  { coups: 'e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4 a3',
    sens: 'chasse le fou maintenant que e4 est tombé : après son départ ou son échange, Cxe4 redevient possible',
    plan: [
      { san: 'Be7', pourquoi: 'recule en gardant la paire de fous : Cxe4 regagne le pion, et les Noirs ont un jeu facile' },
      { san: 'Bxc3+', pourquoi: 'rend le fou : Cxc3 puis Cxe4 — position simple, à peu près égale' },
    ],
    erreurs: [
      { san: 'f5', pourquoi: 's\'accroche au pion en oubliant son fou : axb4 ! le prend tout simplement' },
      { san: 'Bd6', pourquoi: 'recase le fou sur une case déjà visée : Cxe4 ! l\'attaque aussitôt, et Cxd6+ échangera avec tous les temps de gagnés' },
    ] },

  // ------------------------------------------------------------------ C02 Avance, variante Wade (racine du noyau : « e5 c5 c3 Qb6 », plan Nf3)
  { coups: 'e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3', // liaison
    sens: 'défend d4 en développant ; la dame b6 presse b2 : le fou c1 reste attaché à son pion',
    plan: [
      { san: 'Bd7', pourquoi: 'la variante Wade : le fou file vers b5 s\'échanger contre le fou blanc — le « mauvais fou » devient une monnaie d\'échange' },
      { san: 'Nc6', pourquoi: 'l\'autre ordre : deuxième attaquant de d4, on retombe sur la grande ligne de l\'avance' },
    ],
    erreurs: [{ san: 'Qxb2', pourquoi: 'le pion était défendu : Fxb2 ! — la pression de …Db6 vient de ce que le fou c1 ne PEUT PAS bouger, pas de ce que b2 soit gratuit' }] },
  { coups: 'e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7', nom: 'Avance, variante Wade 5…Fd7 (C02)',
    sens: 'petit coup discret, grand projet : …Fb5 pour échanger le mauvais fou noir contre le bon fou blanc, celui qui attaquerait h7',
    plan: [
      { san: 'Be2', pourquoi: 'développe et accepte la discussion : sur …Fb5, on échange ou on laisse faire ; le roque approche' },
      { san: 'a3', pourquoi: 'prend l\'espace à l\'aile dame d\'abord : b4 viendra gêner c5 avant que …Fb5 ne s\'installe' },
    ],
    erreurs: [{ san: 'dxc5', pourquoi: 'rend le centre : …Fxc5 et les Noirs ont développé une pièce en reprenant — d4, la base de la chaîne, a disparu' }] },
  { coups: 'e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7 Be2',
    sens: 'développe sagement et laisse venir …Fb5 : l\'échange des fous n\'effraie pas les Blancs, qui gardent l\'espace',
    plan: [
      { san: 'Bb5', pourquoi: 'le but du système : l\'échange se fera (O-O Fxe2 Dxe2) — le mauvais fou noir contre le bon fou blanc, mission accomplie' },
      { san: 'Nc6', pourquoi: 'rejoint la grande ligne : la pression sur d4 d\'abord, …Fb5 reste pour plus tard' },
    ],
    erreurs: [{ san: 'cxd4', pourquoi: 'relâche la tension : après cxd4, le cavalier b1 retrouve sa belle case c3 — interdite tant que c3 était un pion — et la pression sur d4 s\'éteint' }] },

  // ------------------------------------------------------------------ C00 Attaque est-indienne 2.d3 (racine du noyau : « e4 e6 »)
  { coups: 'e4 e6 d3', nom: 'Française, attaque est-indienne 2.d3 (C00)',
    sens: 'refuse le débat du centre : les Blancs montent toujours le même dispositif (d3, Cd2, Cgf3, g3, Fg2, O-O) et pousseront e5 plus tard — une mise en place plus qu\'une ouverture',
    plan: [
      { san: 'd5', pourquoi: 'prend le centre puisqu\'on le laisse : l\'espace que 2.d3 refuse, les Noirs le prennent' },
      { san: 'c5', pourquoi: 'l\'autre moitié du centre : avec …Cc6 et …d5, les Noirs s\'installent large' },
    ],
    erreurs: [{ san: 'Nf6', pourquoi: 'invite e5 ! : le cavalier déménage (…Cd5) et d4 suivra — les Blancs prennent gratis le grand centre que 2.d3 refusait' }] },
  { coups: 'e4 e6 d3 d5',
    sens: 'occupe le centre : d5 et e6 regardent e4 ; les Blancs continuent leur plan comme si de rien n\'était',
    plan: [
      { san: 'Nd2', pourquoi: 'protège e4 et prépare g3, Fg2, Cgf3 : la mise en place est-indienne, toujours la même' },
      { san: 'Qe2', pourquoi: 'l\'ordre Chigorin : tient e4 en gardant toutes les cases pour les cavaliers' },
    ] },
  { coups: 'e4 e6 d3 c5',
    sens: 'prend l\'aile dame du centre ; …Cc6 et …d5 suivront : les Noirs construisent large pendant que les Blancs fianchettent',
    plan: [{ san: 'Nf3', pourquoi: 'développe vers le dispositif : g3, Fg2, O-O — le plan blanc se moque de ce que font les Noirs' }],
    erreurs: [{ san: 'd4', pourquoi: 'change d\'avis trop tard : …cxd4 Dxd4 et la dame sera chassée (…Cc6) — d3 puis d4, c\'est un temps entier perdu' }] },

  // ------------------------------------------------------------------ C00 Deux cavaliers 2.Cf3 (racine du noyau : « e4 e6 »)
  { coups: 'e4 e6 Nf3', nom: 'Française, 2.Cf3 (C00)', // liaison
    sens: 'développe sans fixer le centre : d4 ou d3 restent en réserve — souvent un chemin vers l\'attaque est-indienne',
    plan: [{ san: 'd5', pourquoi: 'au centre, comme toujours : on force les Blancs à se déclarer sur e4' }],
    erreurs: [{ san: 'Nf6', pourquoi: 'invite e5 ! : le cavalier voyage (…Cd5) pendant que d4 prend tout le centre avec gain de temps' }] },
  { coups: 'e4 e6 Nf3 d5', // liaison
    sens: 'défie e4 : les Blancs doivent choisir — défendre, pousser ou échanger',
    plan: [
      { san: 'Nc3', pourquoi: 'défend e4 en développant : la variante des deux cavaliers' },
      { san: 'e5', pourquoi: 'l\'avance sans d4 : de l\'espace, mais la chaîne n\'a pas encore de base' },
      { san: 'exd5', pourquoi: 'l\'échange, simple et sans prétention' },
    ],
    erreurs: [{ san: 'Bd3', pourquoi: 'défend e4 avec le fou : …dxe4 Fxe4 Cf6 ! le chasse — deux temps de fou perdus, les Noirs égalisent en développant' }] },
  { coups: 'e4 e6 Nf3 d5 Nc3', nom: 'Française, variante des deux cavaliers (C00)',
    sens: 'défend e4 une deuxième fois sans rien fixer : aux Noirs de poser la question',
    plan: [
      { san: 'Nf6', pourquoi: 'développe et remet la pression sur e4 : sur e5, le cavalier recule en d7, comme dans les lignes fermées' },
      { san: 'd4', pourquoi: 'gagne de l\'espace en chassant le cavalier : un pion avancé à surveiller, mais solide' },
    ],
    // ARBITRAGE : le pilote demandait aussi …Bb4 en réponse ; le moteur le met à 0,62 du meilleur coup
    // (e5 ! puis c3 chasse le fou). Je le mets donc en erreur avec l'explication — à toi de trancher.
    erreurs: [{ san: 'Bb4', pourquoi: 'cloue à contretemps : e5 ! puis c3 chassera le fou — la Winawer marche parce que d4 et e4 sont EN PRISE l\'un pour l\'autre ; ici d4 n\'existe pas' }] },

  // ------------------------------------------------------------------ C00 Franco-sicilienne 2…c5 (racine du noyau : « e4 e6 d4 »)
  { coups: 'e4 e6 d4 c5', nom: 'Française, défense franco-sicilienne (C00)',
    sens: 'attaque d4 avant de jouer …d5 : un détour par la sicilienne ; les Blancs peuvent pousser d5 pour gêner tout le camp noir, ou développer et accepter la sicilienne',
    plan: [
      { san: 'd5', pourquoi: 'le pion passe et cramponne : il gêne le cavalier b8 et le fou c8 — la réponse la plus ambitieuse' },
      { san: 'Nf3', pourquoi: 'développe : après …cxd4 Cxd4, c\'est une sicilienne où …e6 est déjà joué — correct, mais un autre livre' },
    ],
    erreurs: [{ san: 'dxc5', pourquoi: 'rend le centre : …Fxc5 et les Noirs développent en reprenant — les Blancs n\'ont plus rien à montrer' }] },
  { coups: 'e4 e6 d4 c5 d5',
    sens: 'le pion passe et divise le camp noir : il faut le contester tout de suite, avant qu\'il ne s\'installe',
    plan: [
      { san: 'exd5', pourquoi: 'ouvre la cage du fou c8 avant que d5 ne se fixe ; …d6 suivra pour tenir la structure' },
      { san: 'Nf6', pourquoi: 'développe d\'abord : si dxe6, …Fxe6 reprend en ouvrant le jeu aux pièces noires' },
    ],
    erreurs: [{ san: 'e5', pourquoi: 'referme sa propre position : le fou c8 et le cavalier b8 étouffent derrière le mur — il fallait prendre' }] },
  { coups: 'e4 e6 d4 c5 Nf3',
    sens: 'développe et laisse le choix : prendre d4, c\'est entrer dans une sicilienne ouverte',
    plan: [
      { san: 'cxd4', pourquoi: 'prend : Cxd4 et c\'est une sicilienne (du genre Taimanov) où …e6 est déjà utile' },
      { san: 'd5', pourquoi: 'revient vers une Française : jouable, mais exd5 exd5 Fb5+ demande de la précision — prendre en d4 est plus naturel ici' },
    ],
    erreurs: [{ san: 'Nc6', pourquoi: 'développe sur la case qui invite d5 ! : le cavalier file au bord (…Ca5) et d6 étouffera tout le camp noir' }] },
];
