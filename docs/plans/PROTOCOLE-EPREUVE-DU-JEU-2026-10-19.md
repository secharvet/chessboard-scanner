# L'épreuve du jeu — protocole (une page, écrite avant le code)

19 octobre 2026. Go de l'auteur. Ordre arrêté : ce protocole, relu reposé → le code → les parties → le rapport. Suite du
rapport du faisceau (`RAPPORT-FAISCEAU-2026-10-18.md`, § 9).

## 1. La question

**La théorie du coach, exécutée par quelqu'un qui calcule, coûte-t-elle quelque chose ?** Le faisceau a donné un prix à un
plan sur quinze coups depuis des positions choisies pour leur stabilité ; une partie entière traverse deux ou trois
structures, et les désaccords entre réseaux, qui tranchent sur une position, se moyennent sur une population de parties.
L'épreuve du jeu est la version statistique de la question du faisceau.

## 2. Les trois joueurs

- **Le coach** : à chaque coup, il choisit le plan — le **plan canonique de la structure courante** pour son camp (table
  `coach/plans-structures.mjs`, première instance ; la seconde si la première est « sans objet » ou « hors de prix ») ;
  quand la structure **bascule**, il change de plan au coup suivant (règle de bascule du faisceau) ; quand aucune
  structure n'est reconnue, il garde le dernier plan tant qu'il est jouable, sinon il laisse jouer librement et le note.
- **L'exécutant** : Stockfish 19, profondeur 18, un fil, **contraint** par le plan du coach exactement comme dans le
  faisceau — parmi ses quatre meilleurs coups, il joue le meilleur *progressant* ; sinon un *forcé* ou le *roque* ; sinon,
  à compteur plein (k = 2), la *dernière chance* (le meilleur progressant hors MultiPV s'il coûte ≤ 1,0) ; sinon le meilleur
  coup libre, noté « intendance ». Il ne choisit jamais un plan ; il paie celui du coach.
- **L'adversaire** : Stockfish 19 libre, même profondeur, même fil.

## 3. Le dispositif

- **Départs** : les dix positions du panel (les deux camps : le coach joue une fois les Blancs, une fois les Noirs — vingt
  départs), plus, en second lot, dix positions d'ouverture des trois livres (Française, Italienne, Espagnole) au 8e coup.
- **Population** : pour chaque départ, **dix parties** : l'adversaire tire sa réponse parmi ses deux meilleures quand elles
  sont ex æquo (≤ 25 cp), au hasard d'une graine fixée par partie (reproductible) ; sinon il joue la meilleure. Vingt
  départs × dix parties = **deux cents parties contraintes**.
- **Témoin** : les mêmes deux cents parties, mêmes graines, **sans coach** (Stockfish libre des deux côtés) — c'est la
  référence, comme le faisceau libre l'était pour le prix.
- **Fin de partie** : mat, nulle, ou le **40e coup** (80 demi-coups) ; alors l'évaluation finale à profondeur 18 (bornée à
  ± 10) tient lieu de résultat.
- **Mesure par partie** : le **coût** = éval finale (vue du coach) de la partie témoin − éval finale de la partie contrainte,
  même départ, même graine ; le **journal** : par coup du coach, le plan suivi, la classe du coup (P/F/R/I/D), la structure,
  les bascules, les plans « sans objet » et les coups libres.
- **Second moteur** : la même chose avec SF 17.1 (coach exécuté et adversaire), pour l'accord.

## 4. Ce qu'on lit

1. **Le coût moyen par partie** et sa dispersion (médiane, quartiles) ; par structure de départ ; par camp.
2. **Le coût par plan** : chaque plan suivi, de son adoption à sa réalisation ou son abandon, a son prix (éval à
   l'abandon − éval à l'adoption, corrigé du témoin) — c'est le faisceau mesuré *dans* la partie.
3. **Les bascules** : combien, lesquelles, et le coût des dix coups qui suivent (le coach a-t-il changé de plan au bon moment ?).
4. **L'accord des moteurs** sur le coût moyen.

## 5. Le critère d'arrêt (écrit avant la première partie)

> **La théorie du coach passe l'épreuve si le coût médian par partie est ≤ 0,25 (le plancher) et le coût moyen ≤ 0,50, avec
> les deux moteurs, sur les deux cents parties.** Entre 0,50 et 1,00 de moyenne : « viable mais ça coûte » — le rapport
> dit où (par structure, par plan), et l'épreuve Maia n'a pas lieu avant correction. Au-delà de 1,00 : la théorie est fausse
> quelque part ; le journal dit où, au coup près, et on ferme.

Pas de coût négatif annoncé comme gain : un coût ≤ 0 se lit « la théorie est ce que le moteur voulait ».

## 6. Ce qui est interdit, ce qui est différé

Interdit : changer la table des structures, le plancher, l'horizon ou les départs après la première partie ; mesurer à
plusieurs fils ; lire une partie sans son témoin. Différé, documenté : le modificateur « roques opposés » (la course des
pions prime) ; la « fenêtre suspendue » (clouage) ; Maia (épreuve 2 : le même coach guidant un Maia-1500 contre lui-même —
seulement si l'épreuve 1 passe).

## 7. Coût et calendrier

Deux cents parties contraintes + deux cents témoins, par moteur : ~40 coups du coach × (une notation MultiPV 4 + une réponse)
≈ 5 min par partie à un fil → **une nuit sur Orion à dix processus** pour les deux moteurs. Code : un à deux soirs (le
faisceau fournit la contrainte, la table la bascule, `nuit-stabilite.sh` le lanceur). Relecture du code par l'Expert et le
Dev chef avant la première partie, comme pour le faisceau. Rapport dans la forme des deux précédents, avec une page à lire
en premier.
