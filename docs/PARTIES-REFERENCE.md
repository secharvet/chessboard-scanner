# Parties de référence avec leur récit (corpus pour repenser le modèle)

Décision du 4 octobre 2026 (soir) : le conseil ne part plus du coup de Stockfish, il part des coups joués par les deux
camps et de ce qu'ils construisent (« la dynamique du jeu »). Pour savoir si ce modèle tient, on écrit d'abord le récit
de parties célèbres dont le récit de maîtres existe déjà, et on compare. Le même corpus servira à mesurer les trous du
vocabulaire : chaque phrase d'un récit de maître que nos concepts ne savent pas dire est un trou.

## Récits libres (Wikipédia, licence CC BY-SA), coup par coup

| Partie | Type | Récit |
|---|---|---|
| Morphy – duc de Brunswick et comte Isouard, Paris 1858 (« partie de l'Opéra ») | ouverture : développement, lignes ouvertes, clouages | [fr](https://fr.wikipedia.org/wiki/Partie_de_l'op%C3%A9ra) · [en, plus détaillé](https://en.wikipedia.org/wiki/Opera_Game) |
| Botvinnik – Capablanca, AVRO 1938 | stratégie : chaîne centrale, espace, attaque sur le roi, pion passé | [en](https://en.wikipedia.org/wiki/Botvinnik_versus_Capablanca,_AVRO_1938) |
| Fischer – Spassky, Reykjavik 1972, 6e partie | stratégie : pièces transférées, e4 !, f5, attaque sur le roi | [en, coups + notes brèves](https://en.wikipedia.org/wiki/World_Chess_Championship_1972) · [chess.com](https://www.chess.com/blog/ThummimS/world-chess-championship-1972-game-6) |
| Rotlewi – Rubinstein, Łódź 1907 | combinaison préparée par le positionnel | [en](https://en.wikipedia.org/wiki/Rotlewi_versus_Rubinstein) |
| Steinitz – von Bardeleben, Hastings 1895 | roi au centre, colonne ouverte | [en](https://en.wikipedia.org/wiki/Steinitz_versus_von_Bardeleben) |
| Lasker – Bauer, Amsterdam 1889 | sacrifice des deux fous | [en](https://en.wikipedia.org/wiki/Lasker_versus_Bauer,_Amsterdam_1889) |
| Anderssen – Kieseritzky 1851 (« Immortelle »), Anderssen – Dufresne 1852 (« Toujours jeune »), Byrne – Fischer 1956 (« partie du siècle ») | tactique romantique | articles fr et en |

Liste complète : [Liste de parties d'échecs remarquables](https://fr.wikipedia.org/wiki/Liste_de_parties_d%27%C3%A9checs_remarquables)
(fr) et [Category:Chess games](https://en.wikipedia.org/wiki/Category:Chess_games) (en, 28 articles).

## Récits « chaque coup expliqué » pour débutants (Chernev, *Logical Chess: Move by Move*, 1957)

C'est exactement la voix visée : 33 parties, chaque coup expliqué en une ou deux phrases, principes nommés. Le livre est
sous droits ; des lecteurs ont retranscrit leurs notes dans des études Lichess publiques, récupérables en PGN avec les
commentaires (`https://lichess.org/api/study/<id>.pgn`). Copies dans `data/reference/study-*.pgn` (usage interne,
recherche ; ne pas redistribuer).

| Étude | Chapitres | Commentaires | Langue |
|---|---|---|---|
| ZBiu3Na0 | 33 | 883 | anglais |
| KRzW1B6k | 21 | 493 | portugais |
| eTrEyh19 | 33 | 84 | anglais (coups surtout) |
| Iy7yukTc | 9 | 48 | anglais |

Autres sources repérées : [mjae.com](https://www.mjae.com/parties.html) (parties commentées en français, par thème :
le plan, le sacrifice en h7, en g7…) ; livre « 50 leçons de stratégie, les parties qu'il faut connaître » (Olibris) ;
[chessgames.com](https://www.chessgames.com) pour les PGN bruts.

## Protocole du test (5 octobre)

1. Récit à la main, sans moteur, voix du coach, pour le camp qui gagne : Morphy 1858, puis Fischer – Spassky 1972 (6).
2. Comparaison ligne à ligne avec le récit de référence : mélodies nommées par les maîtres et manquées ; l'inverse.
3. Chaque phrase marquée : **mélodie** (suite de coups + position, reconnaissable), **fait statique**, **tactique**
   (calcul), **moteur seul**. La part de mélodies dit si le modèle tient.
4. Ensuite seulement : passer nos détecteurs sur les 33 parties de Chernev et compter les phrases du récit que notre
   vocabulaire ne sait pas dire. C'est la carte des trous.
