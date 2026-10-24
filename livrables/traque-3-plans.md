# Coup d'œil aux récits définitifs (7e2a0fc) et aux premières phrases de plan — Expert échecs, 25 octobre 2026

Vérifications :
- les deux parties rejouées avec chess.js, mats confirmés ;
- matériel des lignes 18, 23 et 26 à 28 des Noirs recompté pièce par pièce ;
- 24…Tb1+ est bien un échec ;
- 12.Fh6 rend le petit roque noir illégal (f8 attaqué) ;
- après 15…Fh3, …Txg2+ ne laisse que Rh1.

**Bilan : 40 coups fidèles sur 48.** Blancs 18 sur 19, Noirs 22 sur 29. Les causes d'hier ne reviennent pas, à deux
exceptions près : « attaque » et « attente » sur un coup qui CONTESTE une pièce défendue (6…Fd6, 8…Cd7, 14…Ce4), et la
pièce prise ailleurs que dans le coup (24…Tb1+). Deux des huit fautes sont **dans mes textes**. Je les ai corrigés.

## Les 8 infidèles
| coup | ce qui cloche | règle ou correction |
|---|---|---|
| B 12.Fh6 | « Je prends un plan : colonne d. (une tour **en face du roi**…) » : la colonne d n'est pas en face du Re8. **Mon texte.** | Récrit : « Une tour sur la colonne qui mène à son roi resté au centre. » |
| N 6…Fd6 | « J'attaque son fou en f4 : il doit s'en occuper » : le Ff4 est défendu par e3, …Fxf4 exf4 n'est qu'un échange | « Attaque » seulement si c'est une **menace réelle** : l'adversaire passant, la prise gagne du matériel compté. **C'était ma règle (5) du 24, ma formulation d'hier l'a élargie à tort.** Sinon, un nouveau gabarit : « {ma_piece} vient contester {sa_piece} en {case} : je lui propose l'échange. » |
| N 8…Cd7 | « Coup d'attente » : Cd7 conteste le Ce5 (défendu deux fois) | Même règle : gabarit « contester ». Jamais « attente » si le coup attaque une pièce, même défendue. |
| N 14…Ce4 | Trois fautes. (a) « La rupture d→d4 n'a plus d'objet : la cible n'est plus là » : e3 est toujours là, c'est **sa dame en d4** qui bloque la case. (b) Le pourquoi « en face du roi » (mon texte). (c) « J'attaque son fou en g3 » : défendu par f2, c'est un échange. | (a) La raison de l'abandon se lit dans le détail de la distance : « bloqué : sa dame occupe d4 ». (b) Récrit. (c) Gabarit « contester ». |
| N 17…Db6 | « Plan : colonne d » alors que **mon** pion d5 est sur la colonne : une tour en d8 ne voit rien. **Ma règle était fausse** : « colonne sans pion adverse » au lieu de « sans pion à moi ». | Règle corrigée dans `grammaire-enrichie.md` : la colonne de l'attaque est celle sans pion à moi. |
| N 18…Dxb2 | « Je rends du matériel » : faux, la ligne garde le pion (recompté : les Blancs ont seulement un pion en moins au bout). Le gain a été refusé par la condition de note, puis le gabarit « prise rendue » a parlé à sa place. | Nouveau gabarit quand le matériel monte mais pas la note : « Je prends {sa_piece} en {case}. Je le garde au bout de ma ligne, mais ma note bouge à peine : sa position compense. » |
| N 23…Tfb8 | « Sacrifice du tour (Tfb8, repris par Txb8+) » : c'est une offre d'échange de tours (…Txb8 reprend), pas un sacrifice. Et il faut écrire « de la tour ». | Un « sacrifice » exige que le matériel rendu ne soit pas repris dans les deux demi-coups. Sinon, pas de motif. |
| N 24…Tb1+ | « Rien de forcé. En a8, ma tour a plus de cases » sur un **échec** donné par l'autre tour | Un échec n'est jamais « rien de forcé » : gabarit echec_donne. Et l'entrée citée doit être celle de la pièce jouée quand elle donne échec. |

Justes, après recomptage pièce par pièce : 26…Fxd4 « deux pions » (Txh2 prend le **fou** h2, pas un pion), 27…Txc2+
« deux pions », 28…Tb8 « une tour ».

## Les phrases de plan : justes sur l'échiquier ?
- **Les pas sont des pas, mais on ne voit pas pourquoi.** 13…Cc5 « en est un pas ; il en reste 3 » : c'est vrai par la
  distance (le cavalier quitte d7, et la dame d8 soutient d4 à travers la colonne). 13.Dd3 « colonne d, il en reste 1 » :
  la dame sur la colonne, la tour suivra. 17…Db6 : la dame libère d8 pour la tour. Le lecteur ne peut pas deviner ces
  raisons. Je propose de dire ce qui a changé dans le détail de la distance : « Plan : {plan}. {M} en est un pas :
  {ce_qui_change}. Il en reste {n}. », avec {ce_qui_change} parmi : « un défenseur de plus pour {case} », « un
  attaquant de moins sur {case} », « {ma_piece} se rapproche de {case} », « la voie est libre pour {ma_piece} ». Sans
  ça, je crains des « n'apprend rien » à la lecture humaine.
- **13…Cc5 attaque aussi la Dd3.** La phrase de plan l'emporte, c'est la règle de priorité. Mais une menace réelle créée
  par le coup doit s'ajouter en seconde phrase (« Au passage, j'attaque sa dame. »), comme la parenthèse de menace vue.
- **Le libellé** « poussée c→c4 », « rupture d→d4 » est du jargon de code. En français de club : « Mon plan : pousser le
  pion c en c4 », « Mon plan : la poussée …d4, qui attaque e3 », « Mon plan : une tour sur la colonne d ».
- **La parenthèse du pourquoi à l'adoption est utile.** Elle est la seule à dire le but. Mais une ligne au plus, et
  juste pour l'instance : mes deux textes du roi au centre étaient faux ou trop longs (« seulement après le roque » est
  une condition, pas une raison). Les deux sont corrigés.
- **Adoption sur un coup du livre** (4.Cxe4) : la phrase du livre d'abord, l'adoption ensuite. Ou mieux, annoncer le
  plan au premier coup hors livre, sinon le lecteur croit que Cxe4 sert c4.
- **« Je prends un plan : colonne b » deux fois** (23 et 27) : si c'est le même plan repris peu après, dire « Je reviens
  à la colonne b. »
- **Une phrase manque, et elle serait la meilleure du lot.** 12.Fh6 interdit le petit roque noir : f8 est attaqué,
  chess.js le confirme, et le mat final 19.Dxd7# s'appuie sur ce fou. Dans ROI_AU_CENTRE, un coup qui rend le roque adverse
  illégal mérite son gabarit : « J'empêche son roi de roquer : {ma_piece} contrôle {case}. »
- 16.Fb5+ : la phrase « il doit répondre » est fidèle. Mais la vraie raison est la menace …Txg2+ (Fh3 + Tg8), que
  l'échec dévie : …Fd7 ramène le fou. Aucune menace n'est notée au journal pour ce coup, à regarder dans la recherche de
  la menace.

## Verdict
Les plans parlent enfin, et leurs pas sont de vrais pas. Il reste trois choses à faire avant la lecture humaine : le
gabarit « contester », dire ce qui a changé dans un pas, et le français du libellé. Les deux fautes de doctrine étaient
les miennes (la colonne du roi au centre, et ses pourquoi) ; elles sont corrigées.
