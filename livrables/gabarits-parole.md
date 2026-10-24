# Gabarits de la parole — règles de remplissage (Expert échecs, 24 octobre 2026)

Les gabarits sont dans `livrables/gabarits-parole.json`, sous la forme {sorte: {terme: gabarit}}. Les conditions
(« quand ») y figurent quand elles ne découlent pas de la seule sorte. J'ai choisi un fichier de données plutôt qu'un
module : le pilote l'importe, et je ne code pas l'application.

## 1. Champs utilisés
Ce sont uniquement les champs de la trace. Tout ce qui en est **dérivé** l'est mécaniquement, sans nouveau calcul de
recherche :
- `{M}`, `{R}`, `{L}`, `{coup}`, `{ligneM}`, `{ligneR}`, `{ligneL}`, `{menace}` : en notation française
  (`coach/notation.mjs`), avec les numéros de coup (« 12.Cxe5 Fxe5 13.d4 »).
- `{ma_piece}` / `{sa_piece}` : à prendre dans la table `mots` du JSON, selon la couleur de la pièce citée par le terme.
  Le possessif règle le genre (« mon fou », « ma tour »). C'est pourquoi aucun gabarit ne contient de pronom repris
  derrière une pièce.
- `{case}`, `{case_cible}`, `{colonne}`, `{cible1}`, `{cible2}`, `{cible}` : la pièce et la case du terme ou du motif.
  Une cible s'écrit « {sa_piece} en {case} » (« sa tour en a8 »).
- `{gain}`, `{perte_M}`, `{perte_R}`, `{perte_menace}` : le **matériel compté** au bout de la ligne, comparé à la position
  de départ, par type de pièce. On ne prend jamais l'évaluation. La table `gain` du JSON fixe les libellés. « La qualité »,
  c'est une tour contre une pièce mineure.
- `{ecart_mots}` : l'écart entre M et R, traduit par la table `ecart_mots`. Sous 10 cp, on prend le gabarit « se valent ».
- `{distance_apres}`, `{plan}`, `{raison}`, `{schema}`, `{objet_disparu}` : tels que la trace les donne.

**Aucun nombre d'évaluation dans une phrase.** E0, la note de M et la note de R servent à choisir le gabarit et
`{ecart_mots}`, rien d'autre. Seuls trois nombres peuvent apparaître : un nombre de coups (`{distance_apres}`), un nombre
de pions comptés (`{gain}`) et le seuil « plus d'un pion » de l'abandon.

## 2. Assemblage d'une phrase (ordre fixe)
1. La phrase de la sorte, choisie dans l'ordre calcul > défense > plan > amélioration. Le livre se lit avant tout le reste
   tant qu'on est dans le livre.
2. Pour un calcul, la phrase du motif s'il y en a un, dans les 4 premiers demi-coups de ligneM.
3. La comparaison avec R : `battu` ou `se_valent`, ou `battu_plan` pour la sorte plan. Rien pour « seul coup » et
   « moindre mal », qui parlent déjà de R.
4. La menace vue, s'il y en a une et que la sorte n'est pas déjà une défense qui la nomme. Jamais en finale de pions.
5. **Deux phrases de termes au plus.** Si plusieurs termes sont cités, on prend les deux qui pèsent le plus. Une phrase qui
   énumère cinq raisons n'apprend rien.

## 3. Garde-fous de fidélité, à vérifier au remplissage
1. **« Seul bon coup »**, et non « je gagne », quand M tient l'évaluation et que R s'effondre. Le seuil est le même que pour
   la bévue (80 cp, proche du 100 de l'examinateur, mais lu à SES yeux). Si M et R baissent tous les deux, c'est
   « moindre mal ».
2. **Défense de roi** : la pièce citée vient du terme danger, et son camp choisit le gabarit (défenseur à moi, attaquant
   adverse). Sans pièce citée, pas de phrase de défense de roi.
3. **Plan** : `battu_plan` seulement si le terme plan de R est ≤ 0. Sinon, R servait aussi le plan, et on prend la
   comparaison ordinaire.
4. **Menace non parée en sorte plan ou amélioration** : c'est une alerte, à journaliser. Soit la sorte est fausse, soit le
   coup est une faute. C'est la première chose que je regarderai à la traque.
5. **Pions « chez lui / chez moi »** : le gabarit se choisit au signe du terme. Une faiblesse adverse créée, ou une
   faiblesse à moi évitée.
6. **Principe d'ouverture.** La phrase « dame sortie tôt » énonce un principe, pas un calcul, et le dit entre parenthèses.
   Elle ne prétend pas que la dame sera chassée dans la ligne.
7. **Finales** : le carré ne s'emploie qu'en finale de pions pure. Les cases critiques, seulement pour roi et pion contre
   roi, ou quand le terme est actif. « C'est nul » seulement si le terme de nulle est actif.

## 4. Exemple de remplissage
Coup joué 14.Cd5, battu 14.a3 (40 cp), terme avant-poste (cavalier en d5), aucune menace vue :
« Rien de forcé. Mon cavalier s'installe en d5 : aucun pion adverse ne peut plus l'en chasser. 14.a3 était nettement moins
bon. »
Si 14.a3 avait laissé une menace (par exemple …Fxh2+) que 14.Cd5 pare, ce ne serait pas une parenthèse : la sorte serait
**défense**. La parenthèse « je vois… » ne sert que pour une menace parée par M ET par R, donc qui ne les sépare pas.
(L'exemple sert à montrer l'assemblage. Ce n'est pas une position réelle, et il n'y a rien à vérifier au moteur.)
