# Seconde traque des deux parties V0 (code 3997c2e) — Expert échecs, 25 octobre 2026

Sources : `recits/2026-10-24-maia-w-01.md` (Blancs, 25 coups) et `…-maia-b-02.md` (Noirs, 61 coups).

Vérifications :
- les deux parties rejouées avec chess.js, mats finaux confirmés ;
- les échecs des coups 27 à 30 des Noirs lus sur l'échiquier (qui donne l'échec) ;
- Stockfish 19, un fil, table vidée, profondeur 18, sur 17…Da5 et 40…Rg6.

**Bilan : 72 coups fidèles sur 86 (84 %).** Blancs : 24 sur 25. Noirs : 48 sur 61. Les cinq corrections d'hier
tiennent : 10.Cxd4, 13.Cb3, 14.Cxc5 et 17.Fxa8 sont justes, et 12.Ff3 a changé de défaut (voir A). Les 14 infidèles
viennent de **six causes**, dont deux pèsent à elles seules huit cas, toutes dans la sorte « amélioration ».

| cause | coups | règle |
|---|---|---|
| **A. Pièce fausse dans « mobilité »** (le gabarit prend une autre pièce que celle du terme cité) | B 12.Ff3 (« ma dame en d1 »), N 5…e6 (« fou f8 », terme : cavalier c6), N 16…c4 (« fou e7 », terme : cavalier e4), N 17…Da5 (« ma tour en f8 », terme : dame a5 — c'est la bévue), N 33…a6 (« tour a8 », terme : fou e3) | Remplir {ma_piece} et {case} **uniquement** depuis le terme cité. Le bug signalé au 10.Cxd4 n'est pas corrigé pour ce gabarit. |
| **B. « Attente » ou « amélioration » sur un coup qui attaque** | N 8…Cd7 (attaque le Ce5), 13…Ce4 (attaque la Dd2, qui doit fuir en a5), 16…c4 (attaque la Dd3), 19…Db6 (attaque b2, d'où 20.Tab1) | Un coup qui crée une attaque sur une pièce, ou sur un pion non défendu, n'est **jamais** un coup d'attente. Phrase : « J'attaque {sa_piece} en {case} : il doit s'en occuper. » |
| **C. Terme sans rapport avec le coup** | N 20…h6 (cite « pion lié c4 ») ; N 15…c5 (le gabarit dit « chacun est défendu par un pion voisin », faux pour c5-d5 côte à côte : **mon texte**) | Ne citer qu'un terme dont la valeur **change avec M** (écart avant/après M ≥ 10). Et je récris le gabarit : « Mes pions {cases} restent groupés : aucun n'est isolé. » |
| **D. Motif attribué au mauvais coup** | N 27…Cf2+ et 29…Cf2+ (« échec à la découverte ») : ce sont des échecs **directs**, le roi est en h1 et l'échec vient du seul cavalier. La découverte est au coup suivant (30…Ce4+ : le Fe3 donne l'échec en g1). 28…Cxh3+ « échec double » est juste. | La phrase de motif nomme le coup qui le porte : « Au coup suivant, {coup} sera un échec à la découverte. » |
| **E. Gain fictif** | N 1…d5 « je gagne un pion » (la ligne suppose 2.e4 dxe4 ; note −41 contre −49 avant) | Un gain exige le matériel compté **et** une note de M au moins 80 au-dessus de l'évaluation **statique**. C'était ta règle du 24, il faut la rétablir contre la statique, pas contre la quiescence. Sinon le coach « gagne » des pions que sa propre note ne voit pas. |
| **F. « Seul bon coup » hors de sa condition** | N 54…Dc2+ (R = Dc4+ reste à +16, très au-dessus de E0 : rien ne « s'effondre » ; et « je perdais du terrain » à +16 est faux) | Appliquer la condition écrite : note de R ≤ E0 − 80. Pas de « je perdais du terrain » si R reste gagnant. Ici la phrase juste est un gain (Dd3+, puis …Dxd4, reprend le fou). |

À corriger aussi, sans compter ces cas comme infidèles :
- **B 12.Ff3** : « je suis mieux qu'avec Fh5 » suivi de « Ff3 et Fh5 se valent » se contredisent. « prefere » exige
  un écart ≥ 10 cp (ta propre condition).
- **Ordre d'assemblage** (N 3…Ff5, 4…Cf6) : la comparaison avec R est tombée entre deux phrases de terme, et les deux
  phrases disent la même chose (placement et mobilité de la même pièce). Une seule phrase de terme par pièce, et la
  comparaison en dernier.
- **Développement** : la première sortie d'une mineure parle encore de « placement » (B 6.Cf3, 7.Fd3 ; N 2…Cc6,
  3…Ff5, 4…Cf6, 6…Fd6). L'ajustement annoncé n'est pas actif.
- **Promotion** : « je gagne la dame » sur …c1=D ou …e1=D doit devenir « je fais une dame ». Et « la dame et une tour
  et deux pions » devient « la dame, une tour et deux pions ».
- **Examinateur** : au 56…d4, « +98493 centièmes » est un score de mat mal converti.
- **N 40…Rg6 (« contraint »)** : la phrase est fidèle à la trace, mais **la trace se trompe**. Après 40…Rg6, 41.Cxg5 est
  mauvais pour les Blancs (−7,26, contre −6,28 pour 41.Fg1) : Rg6 PARE la menace. La revérification de la menace après M
  a donc mal conclu ; à regarder dans le code de la menace. Le coup est bon, c'est la phrase qui est fausse.

## Verdict pour le GE
- **Go sur les chiffres** (84 % fidèles, au-dessus de 15 sur 20). Mais les infidèles se concentrent dans la sorte
  « amélioration » : 9 sur 24 aux Noirs.
- Sur 20 coups tirés au sort, il faut s'attendre à 3 ou 4 phrases fausses, et une fois sur dix à 6 ou plus : la marge
  est mince. Les corrections A et B sont mécaniques, avec les mêmes coups.
- Je recommande de les faire avant d'envoyer, et d'écrire en tête que la partie ne montre **toujours aucun plan**.
