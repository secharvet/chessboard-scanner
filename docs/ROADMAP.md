# Feuille de route — coach d'échecs (1er → 22 octobre 2026)

Principe inchangé : le code voit, Stockfish juge, le code explique ; zéro erreur grave avant toute nouveauté visible.
Chaque version a un critère de sortie mesurable. Détails techniques : `PLANS-ET-CONCEPTS.md` (§9), journal : `JOURNAL-PLANS.md`.

| Version | Date visée | Thème | Critère de sortie |
|---|---|---|---|
| v0.4 | 1er oct. (en ligne) | Coach qui ne souffle pas | idée → indices → jugement du coup ; 0 erreur grave sur le banc de 40 positions |
| v0.5 | 8 oct. | Le coach qui enseigne | revue de fin de partie ; motifs tactiques nommés ; ouverture nommée ; niveau déclaré ; 3 parties réelles sans erreur grave |
| v0.6 | 15 oct. | La preuve | joueur automatique guidé par les conseils ; mesure « suivre les conseils fait-il mieux jouer ? » ; relecture par un professeur |
| v0.7 | 22 oct. | Les plans des humains | modèles réentraînés sur les étiquettes corrigées ; plan adverse et réponse ; plans « à ton niveau » vérifiés |
| v1.0 | après le 22 oct. | Le produit | parties importées (Lichess, Chess.com), exercices tirés de ses propres erreurs, progression suivie |

## v0.5 — Le coach qui enseigne (semaine du 1er octobre)
1. **Revue de fin de partie.** À la fin d'une partie : les trois moments décisifs, ce qui a été bien joué, les erreurs
   avec leur réfutation, les plans réalisés ou manqués. Construit sur le jugement du coup joué (déjà en ligne) et sur
   le détecteur de plans. C'est la page qu'un élève relit.
2. **Motifs tactiques nommés.** Clouage, fourchette, attaque à la découverte, pièce surchargée, dits avec la preuve de
   la ligne (cas réel du 30 septembre : Te1 cloue le pion e4 contre la dame et le roi, le coach ne le disait pas).
3. **L'ouverture nommée** dans la fiche, avec son idée principale (base de 3 820 lignes déjà présente, inutilisée par
   la fiche) ; gambits compris.
4. **Niveau déclaré** (débutant, intermédiaire, avancé) : vocabulaire, longueur et seuils du jugement adaptés.

## v0.6 — La preuve (semaine du 8 octobre)
1. **Joueur automatique guidé par les conseils** : il lit la fiche (idée, menace, plan) et choisit son coup d'après
   elle, sans voir la ligne du moteur ; Stockfish ne fait que juger.
2. **La mesure produit** : à niveau égal, un joueur qui suit les conseils perd-il moins de points par coup qu'un joueur
   qui ne les suit pas ? Premier chiffre qui répond à la question du §0.
3. **Banc élargi** à 100 positions tirées des parties réelles jouées sur le site.
4. **Relecture par un professeur** (Marc Quenehen), sur décision de l'auteur, quand v0.5 est stable.

## v0.7 — Les plans des humains (semaine du 15 octobre)
1. **Modèles réentraînés** (DENEB) sur les étiquettes corrigées le 1er octobre.
2. **Plan adverse et réponse** : « il prépare la poussée b4 ; voici comment t'y opposer », vérifié par le moteur.
3. **« À ton niveau, les joueurs font souvent… »** réintroduit seulement si la proposition est confirmée par la ligne
   du moteur (retirée le 30 septembre parce qu'elle ajoutait des erreurs).
4. **Gambit** au catalogue des recettes (sacrifice de pion, compensation mesurée).

## v1.0 — Le produit (après le 22 octobre)
Import de ses parties (Lichess, Chess.com), revue automatique de chacune, exercices tirés de ses propres erreurs,
suivi de la progression, comptes. Domaine définitif et ouverture au-delà d'un seul compte.
