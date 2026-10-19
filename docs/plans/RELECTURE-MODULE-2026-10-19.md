# Note de relecture — le module partagé et le pilote de l'épreuve du jeu (19 octobre 2026)

Pour l'Expert (le sens) et le Dev chef (la mécanique), avant la première partie. Protocole figé :
`PROTOCOLE-EPREUVE-DU-JEU-2026-10-19.md`. Rien ne joue avant vos deux retours.

## 1. Ce qui est à relire

| Fichier | Rôle | Qui |
|---|---|---|
| `coach/coup-contraint.mjs` | le coup contraint : noteur à cache, `classerCandidats`, `derniereChance`, `choisirCoup`, `horsDePrix`, `pointCalme`, `reponsesOuvertes`, `faisceauLibre`, `prixDeSegment`, `structureCourante`, `jouable` | les deux |
| `coach/faisceau-plan.mjs` | le cœur du faisceau, extrait tel quel de `scripts/plans/faisceau.mjs` (paramètres `P` au lieu de constantes de script) | Dev chef |
| `scripts/plans/partie.mjs` | le pilote : coach (deux bras) + exécutant + adversaire tiré, journal, prix par segment | les deux |
| `scripts/plans/departs.mjs` | lot 1 (panel) et lot 2 (les dix lignes du § 3, légalité vérifiée au chargement) | Expert |
| `scripts/plans/epreuve.sh` · `comparer-passes.mjs` | lanceur départs × camps × bras ; comparaison de deux passes au centième | Dev chef |
| `tests/coup-contraint.test.js` | 7 tests (classement, forcé, roque, dernière chance, choisirCoup, structure courante, cache) | Dev chef |

Preuves en cours : identité au centième du faisceau refondu contre la passe Orion v3 (`reports/plans/faisceau/orion-sf19-p18-v3/`,
9/10 positions, `iqp-panov` en délai dépassé par surcharge d'Orion) ; puis deux parties fraîches identiques.

## 2. Les décisions de lecture du protocole que j'ai prises en codant — à contester

1. **Ordre de l'exécutant (§ 2)** — *corrigé après le GE (voir § 5)* : en situation forcée (échec, prise à jouer, pièce en
   prise, coup unique, meilleur à plus d'un pion du second) `choisirCoup` joue le coup **forcé** (le meilleur) ; sinon le
   **meilleur progressant** admissible (≤ 1,0) parmi les quatre candidats ; sinon le **roque** ; sinon — compteur plein (k = 2) — la **dernière chance** (tous les coups
   légaux notés à profondeur 14, le meilleur progressant hors MultiPV, admis à ≤ 1,0), sinon le meilleur coup libre, compté
   **intendance** tant que le compteur n'est pas plein, **libre** au-delà. Le faisceau, lui, garde *toutes* les branches admises
   (progressants et intendance), inchangé.
2. **Deux compteurs** : `compteur` (intendance, remis à zéro par un progressant, inchangé par forcé et roque — la règle du
   faisceau) et `sansProgressant` (coups consécutifs du coach sans progressant admissible, **forcé et roque exclus**). Hors de
   prix en jeu = `sansProgressant ≥ 3`. Question à l'Expert : une suite de trois coups forcés doit-elle tuer le plan ? J'ai dit
   non (ils ne mesurent rien sur le plan).
3. **Retard d'un coup** = meilleur de la MultiPV 4 à 18 − valeur du coup joué, à la même notation ; dernière chance : sa
   valeur est lue dans la réponse adverse à 18 (§ 5 bis, 8).
4. **Structure courante** (§ 5 bis, 1) : propriétaire d'abord, sinon adversaire, ordre fixe à égalité. **Bascule** = la
   signature `nom:couleur:rôle` change *vers une structure reconnue* ; **aucune structure reconnue ne ferme rien** : le dernier
   plan est gardé tant qu'il est jouable (§ 2, dernière phrase). Les instances d'une structure sont **ré-instanciées à chaque
   adoption** (un transfert se lie à la pièce la plus proche au moment de l'adoption) ; une instance déjà adoptée dans le même
   épisode de structure n'est pas reprise (clé = son `pourquoi` de la table).
5. **Réalisation** : jugée après la réponse adverse, comme dans le faisceau — tenure (transfert, échange, colonne, et) : distance
   0 après la réponse ; rupture / poussée : 0 après mon coup ou après la réponse. Le segment se ferme **au coup suivant du
   coach** (position à mon trait), raison « réalisé », puis enchaînement : instance suivante jouable ; sinon le **plan de
   service** = la colonne de la cible, puis cible−1, puis cible+1, la première **sans pion à moi** et à distance finie
   (bxc6 ouvre la b, …cxb5 axb5 ouvre la a). Question à l'Expert : est-ce la bonne lecture de « la colonne que le plan a
   ouverte » ?
6. **Coach-prix** : faisceau court (horizon 10, largeur 2, sans division) sur les 2–3 instances jouables, référence = faisceau
   libre de même réglage ; une instance « pas réalisable » vaut l'infini ; **la première de la table gagne à moins de 25 cp**
   (comparaison en chaîne : B remplace A seulement si B < A − 25).
7. **Fin de partie** : 80 demi-coups **depuis la position de départ** (le panel est au 10e–15e coup, les parties vont donc vers
   le 50e–55e) — ou `isGameOver`. Si c'est à l'adversaire de jouer à la fin, **sa meilleure réponse ferme le dernier
   segment** (hors partie, notée `fermeture`) pour que le point calme se prenne à mon trait. Question : garder 80 depuis le
   départ, ou 80 depuis le coup 1 (= 40e coup absolu, parties plus courtes) ?
8. **Prix par segment** (§ 3) : `prixDeSegment` = point calme depuis la position d'abandon (même budget que le faisceau : échec
   toujours, le reste deux fois), faisceau libre depuis l'adoption sur ⌈ply calme / 2⌉ + 1 coups, réglages du 18 octobre
   (largeur 4, quatre candidats, plancher 25), écart borné ± 10. Un segment de 0 coup (adoption puis bascule immédiate) n'est
   pas tarifé (`prix: null`), il compte zéro dans le coût de la partie.
9. **Graine** : `mulberry32(fnv1a(coups du départ + '|' + n°))`, tirée uniquement côté adversaire quand ses deux meilleures
   réponses sont à ≤ 25 cp (40 avec `--elargi`). Le témoin (bras `temoin`) : mon camp joue le meilleur de la **même MultiPV 4**
   (pas une MultiPV 1 : le meilleur coup peut différer selon n, et le cache est par n), l'adversaire tire pareil.
10. **Dernière chance dans le faisceau** : notée à la profondeur de la passe (18), comme avant — le pilote seul la décide à 14.
    C'est un paramètre (`depthDerniereChance`), pas une copie.

## 3. Lecture de la division sur Orion v3 (SF 19, prof. 18, un fil) — pour l'Expert

Douze bascules sur 32 plans, quatre avec une structure nommée. **Dans les trois cas comparables, continuer bat adopter** :

| position | plan continué | prix continuer | adopter (plans de la nouvelle structure, table) |
|---|---|---|---|
| Carlsbad, e3-e4 (…dxe4 → PDI blanc, ply 10) | rupture e→e4 | 0,35 (t9) | d4-d5 1,51 (t27) ; Dc2→d3 « en cours » **4,73** |
| Tarrasch fermé, colonne c (…dxe5 → PDI noir, ply 4) | colonne c | −0,04 (t18) | Dd8→d6 0,65 (t24) ; d5-d4 sans objet |
| Hérisson, …b5 (cxb5 → petit centre, ply 12) | rupture b→b5 | 0,30 (t11) | colonne c 0,78 (t22) ; …d5-d4 sans objet |

Les autres bascules sont des dissolutions (CHAINE_E5 → rien par cxd4 ou exf5) : pas de plan à adopter.
**Drapeau** : « Dc2→d3 en cours 4,73 » — un prix de branche vivante à quatre pions n'est pas un prix ; soit la ligne du
sous-faisceau perd du matériel sous contrainte (Dd3 imposé au mauvais moment), soit la référence (le faisceau libre de la
racine, pas de la bascule — biais documenté) est fausse à cet endroit. À regarder à la main avant d'en dire quoi que ce soit.

## 4. Ce que j'attends

- Expert : les points 1, 2, 5, 7 du § 2 (et un œil sur les dix départs du lot 2) ; le drapeau du § 3.
- Dev chef : `coup-contraint.mjs` ligne à ligne contre le § 5 bis, `partie.mjs` (états du coach, fermeture des segments,
  cache), la double écriture `compteur` / `sansProgressant`.

## 5. Retour du GE (19 octobre, nuit) et ce qui a changé

- **Point 1, forcé avant progressant** — appliqué : sinon un pas à 0,9 passe devant une pièce en prise et le prix contient de
  la tactique. Ordre arrêté : forcé → progressant → roque → dernière chance à compteur plein → libre. Test ajouté (8/8).
- **Point 2, les compteurs** — accord (trois coups forcés ne tuent pas le plan), avec un **plafond** : trois coups forcés
  consécutifs du coach (six demi-coups) marquent le segment « tactique » ; s'il s'abandonne à cet endroit, il n'est pas
  tarifé là (`abandonTactique`, affiché « tactique, non tarifé »). Appliqué dans `partie.mjs`.
- **Point 5, plan de service** — le GE demandait la colonne de la cible elle-même : elle y était (cible, cible−1, cible+1) ;
  c'est la note qui disait « ± 1 ». Note corrigée, code inchangé.
- **Point 7** — 80 demi-coups depuis la position de départ, confirmé (même longueur sous mesure pour les deux lots).
- **Point 6** — la première de la table à moins de 25 cp, confirmé (l'écart entre les bras n'est attribuable qu'au prix).
- **Drapeau 4,73** — hypothèse retenue par le GE : la référence de la division doit être le faisceau libre **depuis la
  position de bascule**, pour continuer comme pour adopter ; et une branche « en cours » dont la concession cumulée dépasse
  1,0 doit être coupée, pas tarifée à l'horizon. **Différé** : c'est le faisceau, pas l'épreuve (le coach-prix ne divise
  pas) ; à faire avant toute lecture écrite de la division. « Continuer bat adopter » trois fois : plausible, pas une
  conclusion.
- **Forme** — identité au centième **10/10**, pas 9 : `iqp-panov` sera rejoué sur le VPS avec l'ancien code et le nouveau.

## 6. Retour de l'Expert et du Dev chef (19 octobre, nuit) et ce qui a changé

**Expert** : tout validé (compteurs, plan de service avec la colonne de la cible et les semi-ouvertes, 80 demi-coups depuis le
départ, les dix lignes du lot 2, témoin sur la même MultiPV 4). Sur l'ordre forcé / progressant il se range au GE, avec une
nuance **appliquée** : un coup forcé qui est lui-même un pas du plan (la reprise qui réalise) porte la classe
**forcé-progressant** et remet le compteur à zéro (test ajouté). Drapeau 4,73 élucidé pour l'essentiel : à la bascule le fou
blanc est encore sur d3 et …e4 couvre la case (Dd3 illégal), la branche s'effondre réellement sous contrainte ; la référence
prise à la racine aggrave la lecture. Correctifs de la division acceptés, **à faire pendant les premières parties** (l'épreuve
n'en dépend pas) : (a) stocker la ligne retenue et les raisons de coupe de chaque sous-faisceau, (b) référence = faisceau libre
depuis la position de bascule pour continuer et adopter, (c) coupe des branches « en cours » à concession cumulée > 1,0, puis
re-passe de la Carlsbad e4 pour l'autopsie sur pièce.

**Dev chef** : mécanique saine, les cinq points tiennent. Appliqué : **un seul compteur** (les deux du premier jet bougeaient
toujours ensemble — un compteur à deux seuils, k et k + 1) ; **purge du dossier de sortie** par `epreuve.sh` ; **réapparition
d'une structure dissoute = nouvel épisode** (instances à nouveau disponibles, sans bascule) ; précédence écrite : la bascule est
testée avant la réalisation (si les deux tombent sur la même réponse, la bascule gagne). Documenté, pas changé : le retard
d'une dernière chance est estimé par « coup + réponse à 18 » et non par un score MultiPV — un demi-coup d'horizon de
différence avec les retards ordinaires. Lot 2 : si un départ n'atteint jamais une structure de la table, sa partie ne pèse
rien dans le coût — c'est la carte des trous que le lot 2 mesure.

**M1 — le point de mesure, ouvert, pour le GE.** Le prix d'un segment compare l'**enveloppe** du faisceau libre (le max de
quatre branches à chaque demi-coup) à **une ligne jouée unique**. Dans le faisceau, les deux côtés étaient des enveloppes et
le biais s'annulait (correctif F1) ; dans une partie il ne s'annule pas : un plan gratuit (le coach joue les coups mêmes du
moteur) lirait quelques centièmes positifs au lieu de 0, et sur plusieurs segments un biais systématique de l'ordre de +0,05
à +0,15 — face à un seuil médian de 0,25. Ce que j'ai fait : `prixDeSegment` rend **les deux prix**, `prix` (enveloppe, le
protocole) et `prixLigne` (contre la ligne gloutonne : une ligne des deux côtés), sans calcul moteur en plus ; le pilote
publie le coût de la partie des deux façons. Ce qu'il reste à trancher, et c'est la mesure, donc le GE : **quel des deux est
le critère**. Ma lecture : l'écart entre les deux chiffre le biais ; si sur les premières parties il est matériel (> 0,05
médian), la ligne gloutonne est la référence juste d'un segment à ligne unique, et le seuil 0,25 a été calibré sur elle.

Deux remarques de second ordre du Dev chef, à connaître (pas changées) : le bras coach-prix **choisit** son instance avec le
faisceau (qui explore toutes les branches admises, même en position forcée) et l'**exécute** avec `choisirCoup` (qui pare
d'abord) — le choix se fait sur un modèle d'exécution légèrement différent de l'exécution réelle ; et un plan qui dégénère en
trois coups forcés et meurt là n'est pas tarifé — c'est l'intention (« la tactique n'est pas le prix du plan »), mais c'est
aussi une porte de sortie pour un plan qui marche droit dans une tactique perdante : le matériel perdu n'est alors pas compté
comme coût du plan. Question pour l'Expert et le GE : faut-il, dans ce cas, tarifer le segment au **dernier point calme avant
la séquence** plutôt que ne pas le tarifer ?

**M1, avis de l'Expert** : la ligne gloutonne, sans hésiter — le principe qui a réglé F1 : la référence subit la même
pression de sélection que l'objet mesuré ; au faisceau l'objet était une enveloppe (référence = faisceau libre), en partie
c'est une ligne (référence = une ligne jouée par le moteur seul). L'enveloppe est « un explorateur avantagé qui n'a jamais
existé sur l'échiquier » et surfacture la théorie. Publier les deux, lire le critère sur la gloutonne, ne pas rétro-changer le
faisceau. Le GE est consulté ; le pilote publie `cout` (enveloppe) et `coutLigne` (gloutonne), le critère sera lu sur celui
que le GE confirme.

## 7. Décisions du GE (19 octobre, matin) — le pilote est spécifié

1. **M1** : **la ligne gloutonne est le critère**, l'enveloppe est la borne publiée à côté, l'écart médian entre les deux
   est la mesure du biais. Raison : dans le faisceau les deux côtés étaient des enveloppes ; dans une partie le côté
   contraint est une ligne unique, le comparer au max de quatre branches charge le plan de quelques centièmes par
   segment, dans le mauvais sens pour un critère de passage. Ligne contre ligne, même position d'adoption, même politique
   adverse : la seule comparaison à égalité de pression de sélection, celle sur laquelle le 0,25 a été calibré. Le faisceau
   garde son enveloppe (chaque instrument sa référence symétrique — Expert et Dev chef disent la même chose).
   **Vérification exigée, dans le pilote** : un segment où le coach a joué à chaque coup le coup même du moteur, sans
   tirage adverse (« gratuit »), doit lire exactement 0 ; le rapport compte ces segments et nomme ceux qui ne lisent pas 0.
   Appliqué : `prix` = ligne gloutonne, `prixEnveloppe` à côté, `gratuit` et son contrôle publiés par partie et par passe.
2. **La séquence forcée qui tue le plan** : **tarifer après, pas avant, et pas « non tarifé »** — la séquence se prolonge
   jusqu'au point calme suivant (comme une réalisation), le segment actif quand elle a commencé en porte le prix, étiquette
   « payé en tactique ». « Non tarifé » seulement si la partie finit dans la séquence sans jamais retrouver un point calme.
   Le plafond à trois coups forcés garde son rôle : ne pas prendre le prix *au milieu*. Appliqué : budget de prolongation
   élargi (6 au lieu de 2) pour ces segments, étiquettes « payé en tactique » / « non tarifé : pas de point calme ».
3. Forcé-progressant : oui. Le désaccord entre le modèle de choix du coach-prix (explore sans parer d'abord) et son
   exécution (pare d'abord) : réel, acceptable pour une première passe, **à écrire dans le rapport** ; si le coach-prix bat le
   coach-livre, vérifier que ce n'est pas cet optimisme qui le fait choisir. Drapeau 4,73 : élucidation du bon genre.
4. Ordre : identité au centième dix sur dix, deux parties fraîches identiques, puis les parties.
