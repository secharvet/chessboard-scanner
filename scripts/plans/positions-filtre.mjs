/**
 * Dix positions pour juger le filtre de compatibilité à l'œil : cinq canoniques (le plan ne fait débat pour
 * personne) et cinq tirées des schémas du livre de la Française. Chaque position est au trait du camp qui plane ;
 * les plans sont des instances des quatre familles de coach/plan-distance.mjs.
 */

export const POSITIONS = [
  { id: 'carlsbad', nom: 'Carlsbad (Gambit dame refusé, échange), Blancs', coups: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8',
    attendu: 'attaque de minorité b4-b5 ; l\'alternative e3-e4 est connue ; Ce5 prépare l\'attaque à l\'aile roi',
    plans: [
      { famille: 'rupture', pion: 'b', cible: 'b5' },
      { famille: 'rupture', pion: 'e', cible: 'e4' },
      { famille: 'transfert', de: 'f3', vers: 'e5' },
    ] },
  { id: 'iqp-panov', nom: 'Pion isolé (Caro-Kann Panov), Blancs', coups: 'e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5 Bd3 Nc6 O-O O-O Re1 Nf6 a3 b6 Bc2 Bb7',
    attendu: 'les trois plans du pion isolé : la poussée d4-d5, le cavalier en e5, la batterie Fc2-Dd3',
    plans: [
      { famille: 'rupture', pion: 'd', cible: 'd5' },
      { famille: 'transfert', de: 'f3', vers: 'e5' },
      { famille: 'transfert', de: 'd1', vers: 'd3' },
    ] },
  { id: 'herisson', nom: 'Hérisson (Anglaise), Noirs', coups: 'c4 c5 Nf3 Nf6 Nc3 e6 g3 b6 Bg2 Bb7 O-O Be7 d4 cxd4 Qxd4 d6 Rd1 a6 b3 Nbd7 e4 Qc7 Bb2 O-O Qe3 Rfe8 Nd4 Bf8 Rac1',
    attendu: 'les deux ruptures …b5 et …d5, préparées longtemps ; …Tc8 est le préparatif classique',
    plans: [
      { famille: 'rupture', pion: 'b', cible: 'b5' },
      { famille: 'rupture', pion: 'd', cible: 'd5' },
      { famille: 'colonne', colonne: 'c' },
    ] },
  { id: 'kid-mar-del-plata', nom: 'Est-indienne Mar del Plata, Blancs', coups: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Be3 f5 f3 f4 Bf2 g5',
    attendu: 'c4-c5 à l\'aile dame — b4 et Tc1 doivent ressortir comme ses coups préparatoires, pas comme des plans ; Cd3 ; a4-a5 ; Cb5 est l\'autre idée connue',
    plans: [
      { famille: 'rupture', pion: 'c', cible: 'c5' },
      { famille: 'transfert', de: 'e1', vers: 'd3' },
      { famille: 'rupture', pion: 'a', cible: 'a5' },
      { famille: 'transfert', de: 'c3', vers: 'b5' },
    ] },
  { id: 'espagnole-echange', nom: 'Espagnole d\'échange sans dames, Blancs', coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 exd4 Nxd4 c5 Nb3 Qxd1 Rxd1 Bg4 f3 Be6',
    attendu: 'faire valoir la majorité à l\'aile roi : f4 puis e5 (une conjonction) ; e5 seul doit montrer f4 comme coup préparatoire ; le cavalier vers d5 via c3. Expert (prof. 20) : f4 immédiat vaut −0,65 (…Fd6 ! cloue le pion) et le meilleur coup est Ff4 — l\'échange des fous de cases noires débloque la rupture : f4 doit sortir « progressant mais cher »',
    plans: [
      { famille: 'et', plans: [{ famille: 'rupture', pion: 'f', cible: 'f4' }, { famille: 'rupture', pion: 'e', cible: 'e5' }] },
      { famille: 'rupture', pion: 'e', cible: 'e5' },
      { famille: 'transfert', de: 'b1', vers: 'd5' },
      { famille: 'echange', mienne: 'c1', cible: 'f8' },
    ] },
  // ── Française (schémas du livre coach/openings/francaise.mjs) ──
  { id: 'fr-avance-noirs', nom: 'Française d\'avance après 6.Fe2, Noirs', coups: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2',
    attendu: 'livre : le cavalier roi vers f5 contre d4 ; échanger le mauvais fou par …Fd7-b5 ; …f6 quand d4 tient',
    plans: [
      { famille: 'transfert', de: 'g8', vers: 'f5' },
      { famille: 'echange', mienne: 'c8', cible: 'e2' },
      { famille: 'rupture', pion: 'f', cible: 'f6' },
    ] },
  { id: 'fr-avance-blancs', nom: 'Française d\'avance après 5…Db6, Blancs', coups: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6',
    attendu: 'a3 puis b4, le levier sur c5 ; Fe2 (Fd3, le gambit Milner-Barry, fait débat : écarté) ; Fe3 pour d4. PIÈGE voulu : Cb1-d2-b3 — 6.Cbd2 vaut −0,53 contre +0,32 (…cxd4 ! coupe la défense Dd1-d4), le tableau doit le classer progressant mais cher',
    plans: [
      { famille: 'rupture', pion: 'b', cible: 'b4' },
      { famille: 'transfert', de: 'f1', vers: 'e2' },
      { famille: 'transfert', de: 'c1', vers: 'e3' },
      { famille: 'transfert', de: 'b1', vers: 'b3' },
    ] },
  { id: 'fr-tarrasch-ferme', nom: 'Française Tarrasch fermée après 11.O-O, Noirs', coups: 'e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6 Nf3 Bd6 O-O',
    attendu: 'livre : jouer actif, la tour sur la colonne c, soigner e6 ; …e5 est la libération rêvée mais chère',
    plans: [
      { famille: 'colonne', colonne: 'c' },
      { famille: 'transfert', de: 'f6', vers: 'e4' },
      { famille: 'rupture', pion: 'e', cible: 'e5' },
    ] },
  { id: 'fr-tarrasch-ouvert', nom: 'Française Tarrasch ouverte, pion isolé noir, Blancs', coups: 'e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nc6 Bb5 Bd6 O-O Nge7 dxc5 Bxc5 Nb3 Bd6 Re1 O-O',
    attendu: 'contre le pion isolé : le bloquer en d4, échanger les pièces mineures (Fg5×e7, Fb5×c6) ; c4 écarté (à double tranchant : après …dxc4 la faiblesse disparaît). Expert : les trois tiennent dans 0,3 (Fg5 +0,21, Cbd4 +0,10, Fxc6 +0,04) ; nuance sur Fxc6, …bxc6 ! répare la structure',
    plans: [
      { famille: 'transfert', de: 'b3', vers: 'd4' },
      { famille: 'echange', mienne: 'c1', cible: 'e7' },
      { famille: 'echange', mienne: 'b5', cible: 'c6' },
    ] },
  { id: 'fr-echange', nom: 'Française d\'échange symétrique après 6…O-O, Blancs', coups: 'e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 Bd3 Nf6 O-O O-O',
    attendu: 'livre : casser la symétrie par c4 ; les tours sur la colonne e ; Fg5 cloue',
    plans: [
      { famille: 'rupture', pion: 'c', cible: 'c4' },
      { famille: 'colonne', colonne: 'e' },
      { famille: 'transfert', de: 'c1', vers: 'g5' },
    ] },
];
