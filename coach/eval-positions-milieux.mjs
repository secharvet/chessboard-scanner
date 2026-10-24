/**
 * Banc de milieux de partie : positions de TEST tirées des étiquettes humaines (scripts/make-eval-milieux.mjs).
 * Chaque position : un joueur de ce niveau y a réalisé exactement un plan, par une suite calme et tôt. Le coach
 * conseille le camp au trait ; « themes » = mots du plan attendus (mesure automatique), « concept » = étiquette.
 * Généré le 2026-09-30 ; 36 positions.
 */

export const EVAL_POSITIONS = [
  { name: 'tour sur colonne ouverte — debutant 1171 (blancs)', fen: '3k3r/1pp2p1p/1b2bp2/p3p3/1PP1P3/P1N2P2/5P1P/4KB1R w - - 0 19', side: 'white', elo: 1171, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'tour sur colonne ouverte — debutant 1282 (blancs)', fen: 'rn2k2r/1p2q1bp/2b1p1p1/3p1p2/3P1P2/1Q1NB3/P3P1PP/R3KB1R w KQkq - 0 16', side: 'white', elo: 1282, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'tour sur colonne ouverte — intermediaire 1662 (blancs)', fen: 'r1b2rk1/pp3ppp/2n5/2b5/4B3/5N2/PP3PPP/R1B1K2R w KQ - 1 13', side: 'white', elo: 1662, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'tour sur colonne ouverte — intermediaire 1503 (blancs)', fen: '3r1rk1/b4p2/p1p4p/3ppp2/P7/1BPP3P/5PP1/R4RK1 w - - 0 25', side: 'white', elo: 1503, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'tour sur colonne ouverte — avance 2137 (blancs)', fen: '3r1rk1/pb3pp1/1p2pn1p/2q1N3/5P2/1P1B4/P1P1Q1PP/R4R1K w - - 2 19', side: 'white', elo: 2137, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'tour sur colonne ouverte — avance 2080 (blancs)', fen: '2k3r1/p2rbp1p/2p5/B2n4/8/1P6/P2N1PPP/R4K1R w - - 2 19', side: 'white', elo: 2080, concept: 'tour_colonne', themes: ["tour","colonne"] },
  { name: 'rupture de pions — debutant 1193 (blancs)', fen: 'r1bqk2r/3p1ppp/pp1b4/2pPp3/3n4/3PBN2/PPP1BPPP/R2Q1RK1 w kq - 1 10', side: 'white', elo: 1193, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'rupture de pions — debutant 1224 (blancs)', fen: 'r1bq1rk1/1p1n1pp1/p1pbpn1p/3p4/3P4/1P2PN1P/PBPNBPP1/R2Q1RK1 w - - 3 10', side: 'white', elo: 1224, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'rupture de pions — intermediaire 1632 (blancs)', fen: 'r3kbnr/1b1p1pp1/pqn1p2p/1pp5/4PB2/2PP1NP1/PP2BP1P/RN1Q1RK1 w kq - 2 10', side: 'white', elo: 1632, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'rupture de pions — intermediaire 1612 (blancs)', fen: 'r3k1nr/p2nqpp1/1p1bp3/1Bpp2Np/5Pb1/1QP1P3/PP1P2PP/RNB2RK1 w kq - 4 10', side: 'white', elo: 1612, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'rupture de pions — avance 2249 (blancs)', fen: '3r1rk1/p1p2ppp/bp1qpn2/n2p4/3P4/P3PNP1/1PPN1PBP/2RQR1K1 w - - 5 13', side: 'white', elo: 2249, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'rupture de pions — avance 2002 (blancs)', fen: '2rq1rk1/1p1bbppp/p3pn2/P1p1N3/3PP3/6P1/1PQB1PBP/R3R1K1 w - - 0 19', side: 'white', elo: 2002, concept: 'rupture', themes: ["ruptur|levier|pouss","colonne|ouvr"] },
  { name: 'affaiblir la structure — debutant 1088 (blancs)', fen: 'r1b1kb1r/3nq3/p1p1p1p1/1p1p1pNp/1P1PnP2/P1N1P1P1/2P1Q1BP/R1B2RK1 w kq - 1 13', side: 'white', elo: 1088, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'affaiblir la structure — debutant 1208 (blancs)', fen: 'r1b3r1/ppppkNp1/2nb1q1p/7Q/3pP3/8/PPP2PPP/RNB1K2R w KQ - 2 10', side: 'white', elo: 1208, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'affaiblir la structure — intermediaire 1608 (blancs)', fen: 'r1bqk2r/ppp1n1pp/1b1p1n2/1P2N3/3PP3/2P5/P4PPP/RNBQK2R w KQ - 0 10', side: 'white', elo: 1608, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'affaiblir la structure — intermediaire 1616 (blancs)', fen: '2rq1rk1/1p3ppp/p1n1pn2/3p1b2/1P1P4/P1N1P1P1/5PBP/R1BQ1RK1 w - - 1 13', side: 'white', elo: 1616, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'affaiblir la structure — avance 1907 (blancs)', fen: 'r2qkb1r/pp1n1ppp/4pnb1/3p4/6P1/2N2N1P/PP1PPPB1/R1BQ1RK1 w kq - 1 10', side: 'white', elo: 1907, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'affaiblir la structure — avance 1726 (blancs)', fen: 'r2q1rk1/1bpnbppp/pp1ppn2/8/2PPPB2/2NB1N2/PP3PPP/2RQ1RK1 w - - 2 10', side: 'white', elo: 1726, concept: 'affaiblir', themes: ["affaibl|faible|isolé|doublé|arriéré","structure|pion"] },
  { name: 'blocage — debutant 1230 (blancs)', fen: 'r6r/pp2k1pp/4pp2/1B1nB3/3Pn3/2P4P/PP3PP1/R3K2R w KQ - 2 19', side: 'white', elo: 1230, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'blocage — debutant 1293 (blancs)', fen: '2r3k1/2p2pp1/2b1p2p/q1NnP3/2QP4/5N1P/5PP1/4R1K1 w - - 1 31', side: 'white', elo: 1293, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'blocage — intermediaire 1645 (blancs)', fen: 'r2k1b1r/p2b1ppp/2pp4/8/8/1PN5/P3NPPP/3RK2R w K - 0 16', side: 'white', elo: 1645, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'blocage — intermediaire 1592 (blancs)', fen: '4r3/pp1b1kpQ/2p2q2/3p4/1P6/8/P1B2PPP/4R1K1 w - - 0 25', side: 'white', elo: 1592, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'blocage — avance 2163 (blancs)', fen: '2kr4/1ppqnBr1/p2b1p2/7p/P2PP1b1/2P2N2/1P1N2PP/R2Q1R1K w - - 1 16', side: 'white', elo: 2163, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'blocage — avance 1846 (blancs)', fen: 'r4rk1/pppn2pp/3b1p2/3Pp1B1/7P/PB3P2/1PP3P1/1K1R3R w - - 0 19', side: 'white', elo: 1846, concept: 'blocage', themes: ["bloqu|devant","pion"] },
  { name: 'cavalier sur avant-poste — debutant 1229 (blancs)', fen: 'r1bqkr2/2p1b3/p1n4p/2N5/3p3B/4nP2/PPP1Q1PP/2KR1BNR w q - 6 19', side: 'white', elo: 1229, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'cavalier sur avant-poste — debutant 1269 (blancs)', fen: 'r1b1q1k1/pp1p4/2n2r1p/3p2p1/Q5PN/4PN2/P4P1P/1R3RK1 w - - 1 22', side: 'white', elo: 1269, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'cavalier sur avant-poste — intermediaire 1675 (blancs)', fen: 'r2qk2r/4bppp/1p3n2/p1p1p3/2BnP3/2NPB2P/PPP3P1/R2Q1RK1 w kq - 0 13', side: 'white', elo: 1675, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'cavalier sur avant-poste — intermediaire 1418 (blancs)', fen: '2rqk2r/1p3pp1/p1n1pn1p/3p4/4QNPP/PPN1PP2/2P1K3/R6R w k - 3 19', side: 'white', elo: 1418, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'cavalier sur avant-poste — avance 2071 (blancs)', fen: 'r2qr1k1/1p1bppbp/3p1np1/p3n3/3NP1P1/1BN1BP2/PPPQ3P/2KR3R w - - 0 13', side: 'white', elo: 2071, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'cavalier sur avant-poste — avance 2081 (blancs)', fen: 'r4rk1/p3ppbp/2pq1np1/3p2B1/3P4/2N5/PPP1QPPP/R4RK1 w - - 2 13', side: 'white', elo: 2081, concept: 'cavalier_avant_poste', themes: ["cavalier","avant-poste|case"] },
  { name: 'dominer une couleur — debutant 1280 (blancs)', fen: 'r3kb1r/pp2qppp/3p4/4n3/1PPNP1b1/P2P4/6PP/RN1QKB1R w KQkq - 3 13', side: 'white', elo: 1280, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  { name: 'dominer une couleur — debutant 1027 (blancs)', fen: 'rn2k2r/p5pp/4pp2/qp1pNb2/1b1P1B2/2N1P3/P2Q1PPP/2R1KB1R w Kkq - 0 13', side: 'white', elo: 1027, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  { name: 'dominer une couleur — intermediaire 1541 (blancs)', fen: '2rq1rk1/1bN2pbp/4p1p1/p7/1p1P4/1P1QPPP1/P5P1/1BR2RK1 w - - 1 31', side: 'white', elo: 1541, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  { name: 'dominer une couleur — intermediaire 1478 (blancs)', fen: 'r2qk2r/5pbp/bn2p1p1/1p1p4/p2P1P2/P1PQ1NP1/1P3N1P/R1B1R1K1 w kq - 6 19', side: 'white', elo: 1478, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  { name: 'dominer une couleur — avance 1703 (blancs)', fen: 'r2q1rk1/1b1nbppp/2n1p3/3pP3/pppP2N1/2P2N1P/PPB2PP1/R1BQR1K1 w - - 2 16', side: 'white', elo: 1703, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  { name: 'dominer une couleur — avance 2235 (blancs)', fen: 'r2q1rk1/2nb1pbn/p2p2p1/1ppPp1P1/P1P1P2p/2NBBP1P/1PKQN3/3R3R w - - 0 22', side: 'white', elo: 2235, concept: 'dominer', themes: ["fou","cases? (noires|claires|blanches)|couleur|complexe"] },
  // Cas réels (partie du 30 septembre au soir) : la case du coup conseillé est attaquée mais défendue ; position en échec.
  { name: 'cas réel — d4 attaqué par le cavalier, défendu par la dame (blancs)', fen: 'r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2', side: 'white', elo: 1200, concept: 'centre', themes: ["d4"] },
  { name: 'cas réel — en échec (…Dh4+), plus de préparation adverse (blancs)', fen: 'r3kb1r/ppp2ppp/2n1p1n1/3pP3/3Pb1Pq/2P2P2/PP1NB2P/R1BQK1NR w KQkq - 1 9', side: 'white', elo: 1200, concept: 'echec', themes: ["Rf1"] },
  { name: 'cas réel — Td1 conseillé, la tour passe par d1 pour aller en e1 (blancs)', fen: 'r2k1b1r/1pp4p/p3qp2/5n1Q/2Pnp2N/6P1/PP3PBP/R1B2RK1 w - - 0 17', side: 'white', elo: 1200, concept: 'tour_colonne', themes: ["e1"] },
  { name: 'cas réel — Te1 cloue le pion e4, Fxe4 le prend ensuite (blancs)', fen: 'r4b1r/1pp1k2p/p3qp2/5n1Q/2Pnp2N/6P1/PP3PBP/R1BR2K1 w - - 2 18', side: 'white', elo: 1200, concept: 'clouage', themes: ["e4"] },
];
