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

## 8. Les preuves (19 octobre, matin) — le pilote peut jouer

Tout à un fil (`COACH_DETERMINISTIC=1`), SF 19, profondeur 18, sur le VPS, trois processus en parallèle au plus.

1. **Identité du faisceau refondu** (`scripts/plans/comparer-passes.mjs`, au centième : phrase, prix, prix brut, tempo,
   limite, merci, ligne, bascule, longueur de division, ligne libre). Référence : Orion, ancien code (`bc733d1`), dix positions
   (`orion-sf19-p18-v3`, iqp-panov recalculé seul cette nuit). Contrôle 1 (hérisson, Carlsbad, fr-echange, code refondu) :
   **9/9 plans identiques**. Contrôle 2 (mêmes positions, après le compteur unique, l'ordre forcé → progressant et
   `nMoi`/`nAdv`) : **9/9 identiques**. iqp-panov au code refondu : délai Stockfish dépassé dans la file de nuit, puis
   seul — un seul appel (tous les coups légaux notés à profondeur 18, pour la dernière chance) dépasse 10 minutes à un fil sur le
   cœur Haswell du VPS, là où Orion passait ; délai du `Noteur` porté à 30 minutes (sans effet sur les valeurs), recalculé :
   **identique, 12/12 plans sur les quatre positions** (hérisson, Carlsbad, fr-echange, iqp-panov ; iqp-panov : Dd3 0,26 t2,
   Ce5 0,35 t4, d5 0,94 t5, au centième). Le faisceau n'a donc pas bougé d'un centième à travers l'extraction du
   module, du cœur `faisceau-plan.mjs`, et des retouches demandées par les trois relecteurs.
2. **Deux parties fraîches identiques** (Carlsbad, Blancs, bras livre, graine n° 1, 80 demi-coups, lancées en même temps dans
   deux dossiers) : les deux `parties.json` sont **égaux hors `secondes`**. Le pilote est déterministe à un fil.
3. **Vérification M1 du GE** sur cette partie : 1 segment gratuit (colonne c, service, bascule : le coach a joué le coup du moteur
   à chaque coup, aucun tirage adverse) — **il lit 0** sur la gloutonne (et +0,22 sur l'enveloppe). Coût de la partie :
   +1,22 (gloutonne) contre +3,27 (enveloppe) ; biais d'enveloppe médian +0,41 sur cinq segments.
4. **Le biais d'enveloppe mesuré sans jouer** (`scripts/plans/biais-enveloppe.mjs`, lot 1, horizon 12 coups, largeurs 1/2/4,
   `reports/plans/epreuve/biais-enveloppe.md`) : g[ply] = enveloppe − gloutonne, aux demi-coups à mon trait :

   | largeur | médiane | 90e centile | g médian au 12e coup (ply 24) |
   |---|---|---|---|
   | 1 | 0,41 | 0,86 | 0,98 |
   | 2 | 0,45 | 1,07 | 1,20 |
   | 4 | 0,69 | 1,53 | 1,82 |

   Deux lectures. **Le biais croît avec la profondeur du segment** (≈ 0,04 pion par demi-coup à largeur 1, ≈ 0,08 à largeur 4 :
   0,20 au 2e coup, 0,71 au 6e, 1,82 au 12e) — il n'est pas une constante qu'on retrancherait. **Il n'est pas nul à largeur 1** : même à un
   état, le faisceau libre retient la meilleure *position après la réponse* parmi (quatre coups × réponses ouvertes), donc
   il s'accorde la seconde réponse adverse quand elle est dans les 25 cp, et choisit sur une évaluation prise deux demi-coups
   plus loin ; à chaque coup il « gagne » un peu, et ces petits gains s'accumulent. La gloutonne joue le coup du moteur des
   deux côtés : c'est bien la seule référence à égalité de pression de sélection avec une ligne jouée (le GE, l'Expert et le
   Dev chef avaient raison, et de loin : comparer à l'enveloppe aurait chargé un segment de douze coups d'un pion et demi).
   Pour le faisceau lui-même rien ne change : ses deux côtés sont des enveloppes de même largeur, le biais s'y annule (F1).
   **En toutes lettres (Expert)** : les prix du faisceau (enveloppe contre enveloppe) et les prix des parties (ligne contre
   ligne) sont deux échelles distinctes, **non comparables terme à terme** ; quand les deux seront publiés côte à côte, le
   rapport le dira.
5. Le désaccord choix/exécution du coach-prix (il choisit son instance avec le faisceau, qui explore sans parer d'abord, et
   l'exécute avec `choisirCoup`, qui pare d'abord) est écrit dans ce rapport, comme demandé ; à surveiller si le coach-prix bat
   le coach-livre.

Prochaine étape : lot 1, SF 19, trois processus (`scripts/plans/epreuve.sh /usr/local/bin/stockfish 3 1`), puis SF 17.1.

## 9. Règles différées (à appliquer entre les lots, pas pendant) et chiffres à publier au dépouillement

1. **Plan de service après « hors de prix »** (Expert, 19 octobre, 11 h 30). Aujourd'hui le plan de service n'est offert qu'après
   une réalisation ; après un abandon « hors de prix », le coach passe à l'instance suivante et, la table épuisée, se tait.
   L'Expert ne voit pas de justification échiquéenne à cette asymétrie : un joueur de club qui renonce à un plan trop cher
   améliore sa position (tour sur colonne ouverte, ce que le plan de service encode) ; après un abandon on a plus besoin
   d'un plan, pas moins. Règle retenue : oui, offrir le plan de service après « hors de prix » quand la table est épuisée,
   **(1) pas pendant le lot qui tourne** (les six cents parties doivent rester comparables), **(2) étiqueté « service après
   abandon »** à part dans le journal et les prix (adopté dans une position probablement moins bonne : ne pas le fondre avec
   le service après réalisation), **(3) même crible d'admissibilité** (sans objet / bloqué) — dans une position morte le
   coach doit pouvoir se taire.
2. **Chiffre gratuit, dès ce lot, sans toucher au pilote** : le nombre de demi-coups « sans plan, table épuisée » par partie
   (coups « libre » sans plan alors qu'une structure est reconnue) — la mesure directe de la profondeur de couverture de la
   table, lue dans le journal au dépouillement ; dira ce que la règle 1 rapporterait avant de la coder.
3. **Nulles par répétition** côté contraint, par départ (constat 6 du protocole : un plan qui tourne en rond est un signal).
4. **Σ retards contre prix ligne** (GE) : si la coïncidence de la partie fraîche (+1,10 / +1,22) tient sur deux cents parties,
   la mesure rejetée devient un contrôle gratuit de la mesure retenue.
5. **Part des coups sous plan** : la colonne la plus importante du rapport, souvent sous la moitié (la table n'a rien à dire
   en finale).

## 10. La table de hachage comptait (19 octobre, midi) — méthode de mesure changée

Stockfish à un fil est déterministe **à historique égal** : la table de hachage garde le travail des recherches précédentes
et la suivante s'en sert. Même position Carlsbad, prof. 18, un fil : moteur frais h3 +0,44 · a3 +0,34 · Tab1 +0,29 · Ce5
+0,28 ; après cinq autres recherches h3 +0,42 · Tab1 +0,30 · Ce5 +0,24 · a3 +0,22 (a3 de 2e à 4e) ; après vidage, les valeurs
du moteur frais exactement. Trouvé parce que deux parties fraîches identiques entre elles (Orion, coupées au 71e par la
répétition) donnaient d'autres prix que la même partie poussée au 80e (VPS), à coups et candidats identiques : les prix se
calculent après la partie, sur une table au contenu différent (jusqu'à 21 cp sur un prix d'enveloppe). Nos identités au
centième tenaient parce que la suite d'appels était la même. Surcoût du vidage : 3 % (douze positions voisines, 16 contre
17 s). Décision : en mode mesure, `ucinewgame` avant chaque recherche ; une valeur ne dépend plus que de la position et de la
profondeur. Conséquences : lot 1 et re-passe Orion relancés ; les prix d'hier bougeront de quelques centièmes, la re-passe
sans coupe est la nouvelle référence ; le plancher de 25 cp n'avait pas à absorber ce bruit-là, il reste.

## 11. Le lot de perturbation de l'épreuve — proposition à soumettre au GE (19 octobre, 19 h, après le « go pour le jeu »)

Ce que le taux de passage a fait au faisceau, il faut le faire à l'épreuve : **donner un intervalle à l'agrégat** (coût
médian et moyen par bras, différence coach-prix − coach-livre) avant de le lire comme un verdict. Rien ci-dessous n'est
lancé avant l'accord du GE ; le lot 1 reste la référence déterministe.

**Référence.** Lot 1 : vingt départs × trois bras × dix graines, profondeur 18, un fil, table vidée, code gelé (`4e84a5f`),
aux deux moteurs (SF 19 sur le VPS, SF 17.1 sur Orion, lancé le 19 à 19 h au même code).

**Quatre tirages proposés**, même code, même panel, un seul moteur (SF 19 — l'écart entre moteurs est déjà une perturbation,
mesurée par la référence elle-même) :

| tirage | ce qui bouge | code à écrire | coût estimé (Orion, six processus) |
|---|---|---|---|
| T1 | graines 11 à 20 : un autre tirage des réponses adverses ex æquo | aucun (`--numeros`) | une nuit |
| T2 | profondeur 17, pour l'exécutant, l'adversaire et la mesure (ligne gloutonne et faisceau libre à la même profondeur que la ligne jouée) | aucun (`--depth`) | une nuit |
| T3 | profondeur 19, idem | aucun | une nuit et demie |
| T4 | ordre des ex æquo **côté exécutant** : parmi les candidats admissibles à ≤ 25 cp du meilleur, le dernier au lieu du premier | une option dans `coach/coup-contraint.mjs`, sur `division`, relue par le Dev chef, fusionnée après la fin du lot 1 | une nuit |

Ordre : T1, T2, T3 d'abord (aucun code), T4 en dernier. Entre la référence et les quatre tirages, **le code ne change pas**
(la règle « service après abandon » du § 9 attend la fin du lot de perturbation, pas seulement la fin du lot 1), et rien ne
se lit avant que les cinq soient là.

**Chiffres publiés par tirage**, les mêmes qu'au dépouillement du lot 1 (§ 9) : coût médian et moyen par bras, différence
prix − livre (médiane et moyenne), part des coups sous plan, nulles par répétition, demi-coups « sans plan, table épuisée »,
segments gratuits lisant 0.

**Règle de lecture, à fixer avec le GE avant le premier tirage** (proposition) : le verdict du critère d'arrêt (§ 5 du
protocole : médian ≤ 0,25 et moyen ≤ 0,50) **tient s'il est le même dans au moins quatre tirages sur cinq** (référence +
quatre), et la différence prix − livre **garde son signe dans les cinq** ; sinon « pas de verdict », et le rapport publie
l'intervalle (le plus bas et le plus haut des cinq) à la place d'un chiffre. Trois sur cinq ne serait pas un verdict.

**Ce qu'on n'y met pas** : la table gardée (la méthode de mesure est fixée, § 10), un autre panel, un autre plancher.
