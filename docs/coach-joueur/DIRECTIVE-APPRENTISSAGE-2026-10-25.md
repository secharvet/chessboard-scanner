# Directive — apprendre l'arbre sur des parties humaines (25 octobre 2026)

*Texte de Sébastien, reçu le 25 octobre 2026 vers 14 h (Paris), recopié tel quel. Il remplace la proposition « calcul
puis nommage » comme direction : « mettre des mots sur des coups non humains, ça n'a pas de sens ».*

**L'idée.** L'arbre de décision du joueur de club nomme les coups. On apprend sur des parties humaines quel nœud un joueur
d'un niveau donné choisit quand plusieurs sont allumés. Le modèle choisit une question, jamais un coup ; le coup vient du
nœud et du calcul court ; la phrase vient du nœud. Le calcul dit vrai, l'arbre dit pourquoi, l'apprentissage dit ce qu'un
humain de ce niveau fait.

**Ce qui existe déjà, à lire avant d'écrire une ligne.** BP-Chess (Ben-Gourion, 2025) : principes des manuels comme
caractéristiques, modèles classiques, parties Lichess 1200-1600, ouvertures seulement ; interprétable, mais ne bat pas Maia
sur la prédiction du coup réel. Maia-3 (Toronto, libre) : la référence pour la prédiction du coup par niveau, et notre
élève de test. Les sondes de concepts sur Maia : les concepts changent avec le niveau, c'est mesuré. Notre case : nœud
comme étiquette, vérification mécanique, récit.

**Les données.** Parties Lichess, cadences rapide et lente seulement, parties complètes, deux joueurs dans la même
tranche, tranches de 200 points de 1000 à 2200. Positions tirées au sort dans les parties, toutes phases, pas seulement
l'ouverture. Découpage apprentissage / test par partie et par joueur, jamais par position, sinon le modèle apprend la
partie. Volume cible : cent mille positions par tranche pour commencer, un million si le nommage le permet.

**Prérequis : le nommage rapide.** Aujourd'hui six secondes par coup ; il en faut moins d'une. Les questions qui demandent
un calcul (1f, 2d) passent par des sondes bornées ou sont approchées statiquement, et on publie ce que l'approximation
coûte en accord avec le nommage lent sur mille coups.

**Les trois étapes, dans l'ordre, chacune publiée avant la suivante.**

1. **La table.** Pour chaque position : les nœuds allumés, le nœud qui nomme le coup joué, la tranche. Première sortie : la
   fréquence de chaque nœud choisi par tranche, et la part des coups sans nom par tranche. C'est déjà un modèle, une table
   de consultation, et c'est elle qui dit si le niveau change le choix. Critère écrit d'avance : au moins trois nœuds dont
   la part varie de façon monotone avec le niveau, au-delà de l'intervalle de confiance. Si la table ne montre rien, on
   arrête là et on l'écrit : l'arbre ne voit pas la différence que les sondes voient dans Maia.
2. **Le modèle.** Entrées : les nœuds allumés, la phase, le matériel compté, qui est mieux selon les trois regards, les
   drapeaux de sécurité du roi, la tranche. Sortie : le nœud choisi. Régression logistique d'abord, arbres boostés ensuite ;
   pas de réseau. Mesures, sur le test : la précision du nœud contre la ligne de base « nœud le plus fréquent de la
   tranche » ; puis la précision du coup, nœud → générateur → calcul court, contre Maia-3 à la même tranche. Critère écrit
   d'avance : battre la ligne de base de quinze points sur le nœud ; sur le coup, publier l'écart à Maia-3 quel qu'il
   soit, l'attente honnête étant d'être en dessous en précision et au-dessus en lisibilité. Les coups « sans nom » prédits
   comme classe à part : leur taux par tranche est la liste des branches à ajouter.
3. **Le joueur.** Dans le coach « calcul puis nommage » : parmi les coups à moins de 50 centièmes du meilleur, choisir
   celui dont le nœud est le plus probable pour la tranche visée ; sinon le meilleur, dit sans nom. Le vérificateur de
   récit s'applique à chaque phrase : un nœud prédit dont l'affirmation est fausse sur la position compte comme faux.
   Mesure : la courbe « ce que l'humanité coûte », perte moyenne en centièmes contre part de coups nommés, par tranche ;
   et vingt coups devant un humain, pour la quatrième fois demandés.

**Interdits.** Pas d'apprentissage par renforcement. Pas de LLM dans une décision. Pas de retouche de l'arbre après
lecture des positions de test ; une branche ajoutée se mesure sur des parties neuves. Pas de pondération des coups par le
résultat de la partie.

**Cadre.** Trois chantiers, un par étape ; une page chacun pour Sébastien avant le code ; une page par semaine, trois
chiffres ; deux semaines ; le GE relit les trois pages et le rapport final. Si l'étape 1 échoue, le reste n'existe pas.

**Pour toi, une image de ce qu'on construit** : Maia te dit quel coup un 1500 joue ; ça, ça te dira à quoi il pense quand
il le joue, et à quoi il penserait s'il avait trois cents points de plus. Si l'arbre voit cette différence, le professeur a
trouvé son vocabulaire pour parler d'un niveau à l'autre.
