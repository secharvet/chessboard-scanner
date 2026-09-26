/**
 * Positions de référence pour évaluer le coach : plan connu → thèmes attendus dans l'explication.
 * Chaque thème est une regex (insensible à la casse) ; un thème est « trouvé » si elle matche.
 */

export const EVAL_POSITIONS = [
  {
    name: 'Pion dame isolé (blancs)',
    moves: 'd4 d5 c4 e6 Nc3 Nf6 Nf3 c5 cxd5 Nxd5 e3 Nc6 Bc4 cxd4 exd4 Be7 O-O O-O',
    themes: ['isol|PDI', 'e5', 'attaque|roque|roi', 'd5'],
  },
  {
    name: 'Carlsbad — attaque de minorité (blancs)',
    moves: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O',
    side: 'white',
    themes: ['minorit|b4|b5', 'c6', 'colonne c|colonne semi'],
  },
  {
    name: 'Française avance (noirs)',
    moves: 'e4 e6 d4 d5 e5',
    themes: ['c5', 'f6', 'base|chaîne', 'fou'],
  },
  {
    name: 'Est-indienne fermée (blancs)',
    moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7',
    themes: ['aile dame|c5|c4-c5|b4', 'f5', 'course|temps|chaîne'],
  },
  {
    name: 'Est-indienne fermée (noirs)',
    moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3',
    themes: ['f5', 'aile roi|roque|attaque', 'course|temps|chaîne'],
  },
  {
    name: 'Dragon yougoslave, roques opposés (noirs)',
    moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O',
    themes: ['course|vitesse|roques opposés', 'colonne c|aile dame|b5|Tc8', 'pion'],
  },
  {
    name: 'Étau de Maroczy (noirs)',
    moves: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3 d6 Be2 O-O O-O Bd7',
    side: 'black',
    themes: ['b5|d5|f5', 'espace|place|étau', 'échang'],
  },
  {
    name: 'Scheveningen (noirs)',
    moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 Be2 a6 O-O Be7 f4 O-O',
    side: 'black',
    themes: ['d5|b5', 'colonne c|aile dame', 'e5|f5|aile roi|g4'],
  },
  {
    name: 'Piège de l’éléphant (noirs, tactique)',
    moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5',
    themes: ['Cxd5', 'Fb4|échec', 'dame|piège|gagn'],
  },
  {
    name: 'Menace sur g2 (blancs, défense)',
    moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5',
    themes: ['g2', 'menace|attaqu|défend', 'Cxf7|Fxf7|O-O|Tg1|Cg4'],
  },
  {
    name: 'Coup du berger (noirs, défense)',
    moves: 'e4 e5 Bc4 Nc6 Qh5',
    themes: ['f7', 'mat|menace', 'g6|De7|Df6'],
  },
  {
    name: 'Retard de développement, double attaque (noirs)',
    moves: 'e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3',
    themes: ['f7', 'b7', 'De7|Dd7|double'],
  },
  {
    name: 'Italienne lente (blancs)',
    moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O',
    themes: ['d4|centre', 'Te1|Cbd2|Fb3|h3|a4', 'plan|lent|manœuvr'],
  },
  {
    name: 'Caro-Kann avance (noirs)',
    moves: 'e4 c6 d4 d5 e5 Bf5',
    themes: ['c5', 'e6|chaîne|base', 'fou'],
  },
  {
    name: 'Finale roi + pion : opposition (blancs)',
    fen: '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1',
    themes: ['opposition', 'nulle|nul|gagn', 'roi'],
  },
  {
    name: 'Finale : majorité à l’aile dame (blancs)',
    fen: '6k1/pp3ppp/8/8/8/8/PPP2PPP/6K1 w - - 0 30',
    themes: ['majorit|pion passé|passé', 'roi|centralis', 'aile dame|a4|b4|c4'],
  },
];
