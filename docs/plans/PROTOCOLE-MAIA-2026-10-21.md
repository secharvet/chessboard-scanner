# Épreuve Maia — protocole (projet, 21 octobre 2026)

Statut : **projet, à relire par l'Expert, le Dev chef et le GE (via Sébastien). Rien ne s'installe ni ne joue avant la
page relue et le go de Sébastien sur la version relue.** Ouvert par le go de Sébastien du 21 octobre, sur la proposition du
GE (`RAPPORT-LOT-1-BIS-2026-10-21.md` § 7).

## 1. La question

Le coach-livre (règles A) rend-il un joueur de 1500 meilleur ? Contre Stockfish, l'épreuve du jeu a mesuré ce que les
plans **coûtent** à un exécutant parfait ; elle ne peut pas dire s'ils **aident** un exécutant imparfait. Maia-1500 (réseau
entraîné sur des parties humaines de ce niveau) tient lieu d'élève.

## 2. Les joueurs

- **Élève guidé** : Maia-1500 dont le coup est choisi parmi **ses propres coups probables**, filtrés par le coach quand
  il a un plan.
- **Élève libre** : Maia-1500 seul, mêmes réglages.
- Mêmes départs que le lot 1 (10 départs), les deux couleurs.
- **Pas de Stockfish pour jouer.** Stockfish sert à arbitrer le garde-fou (§ 4.3, point à trancher) et à noter après
  coup.

## 3. Bras

| bras | élève guidé | adversaire | rôle |
|---|---|---|---|
| **G-A** | coach-livre, règles A (cumul, dernière chance relue), sans attente utile | libre | la question |
| **G-AU** | G-A + attente utile (sous plan et sans plan) | libre | l'attente utile, mesurée là où elle a un sens |
| **L-L** | libre | libre | référence : ce que vaut chaque départ, par couleur, entre deux 1500 |

Le bras L-L est nécessaire parce que les départs ne sont pas équilibrés : un départ qui donne 58 % aux Blancs entre deux
1500 ferait « passer » un élève guidé aux Blancs sans aide du coach. Le critère compare donc chaque couleur à sa
référence L-L (§ 6).

## 4. Le guidage

### 4.1 Les coups probables de Maia

lc0 avec les poids Maia-1500, **1 nœud** (la politique seule, comme Maia est prévu pour jouer). On lit la probabilité de
chaque coup. **Coups probables** = les coups de probabilité ≥ 5 %, au plus 5 coups (à fixer à la relecture ; on publiera
la couverture : part de la masse de probabilité gardée). Seuil validé par l'Expert : à 5 %, un coup est un vrai coup de
1500 (un sur vingt le joue). À publier aussi : **la part des coups de plan joués dont la probabilité était < 10 %** — le
coup que le 1500 trouvait rarement seul, la valeur ajoutée du coach en un chiffre.

### 4.2 Le choix du coup

- **Coach sans plan**, ou élève libre : tirage dans la politique de Maia (température 1, restreinte aux coups probables),
  par une **graine** fixée par partie. Le hasard est le nôtre, pas celui de lc0, pour que deux passes soient identiques.
- **Coach avec plan** : on garde parmi les coups probables ceux qui **servent le plan** (pas de plan, roque, coup forcé,
  comme dans `choisirCoup`) ; s'il en reste, tirage parmi eux, au prorata de leur probabilité ; s'il n'en reste aucun,
  l'élève joue son coup (tirage normal) — **jamais un coup que Maia ne jouerait pas** (le plan doit être exécutable par
  l'élève, GE) — et ce coup compte **contre le plan** (compteur + 1 ; forcé et roque restent neutres), comme au lot 1 :
  un plan que l'élève ne peut jamais jouer n'est pas son plan (Expert). La raison « **abandon faute de coup probable** »
  est publiée à part : c'est la liste des plans du livre qu'il faut **enseigner**, parce qu'un 1500 ne trouve pas le coup.
- **Attente utile (G-AU seulement)** : sans pas de plan disponible, le premier coup probable (dans l'ordre de Maia) qui
  sert une instance du catalogue, avec sa borne (≤ 0,25 mesuré contre le coup naturel) et son plafond d'addition :
  personne ne paie sans addition, élève compris (Expert).

### 4.3 Le garde-fou à l'échelle de l'élève — **point à trancher**

Le GE : « le garde-fou doit juger les coups de plan parmi les coups que Maia aurait joués, pas parmi ceux de Stockfish ».
Ce qui est clair : la **référence** du retard n'est plus le meilleur coup de Stockfish mais le **coup que l'élève aurait
joué** (le plus probable de Maia, ou l'espérance sur les coups probables). Ce qui reste à décider : **qui note** les deux
coups.

- **Option 1 (proposée)** : Stockfish note, à prof. 18, un fil, le coup de plan et le coup de référence de Maia ;
  retard = différence ; cumul > 1,0 → hors de prix, comme au lot 1 bis. Stockfish **arbitre**, il ne propose jamais un
  coup. Coût : deux recherches par coup sous plan (≈ 20 % des coups).
- **Option 2** : la tête de valeur de Maia note. Aucun moteur dans la boucle, mais une valeur de 1500 est grossière et
  sa fiabilité pour un seuil de 1,0 pion n'a jamais été mesurée.

**Expert : option 1, sans hésitation.** Chaque faute de plan des seize parties perdues était punie 4 à 6 demi-coups plus
tard ; une valeur à 1 nœud, intuition statique sans recherche, ne voit précisément pas ce qui a perdu ces parties.
Précisions : (a) la référence est **le coup le plus probable de Maia, « le coup naturel »** (deux recherches ; l'espérance
en coûterait cinq pour peu de gain) ; (b) le retard peut être **négatif** (le coup de plan évite la gaffe naturelle) : le
cumul compte **max(0, retard)**, sans crédit, sinon l'addition fuit ; mais les retards négatifs sont **publiés** — « le
plan a évité une faute », le cœur de la question.

### 4.4 Ce qui ne change pas

Le catalogue, les livres, la reconnaissance de structure, l'adoption, l'enchaînement, la bascule, la dernière chance
relue, le compteur : code du lot 1 bis, règles A. Le bras prix n'est pas joué (GE § 7.4).

## 5. La partie

- Départ du lot 1, puis Maia contre Maia jusqu'à la fin : mat, pat, répétition, 50 coups, ou **200 demi-coups**. La
  conversion fait partie de ce qu'on mesure (un 1500 laisse filer une pièce d'avance assez souvent) : on laisse jouer.
- **Arrêt anticipé** seulement sur un mat vu par Stockfish ou au-delà de **+6,00 pendant 10 demi-coups** (prof. 18, un
  fil) → gain. **À 200 demi-coups** : ≥ +3,00 → gain, sinon nulle (Expert).
- **Score** : 1, ½, 0. À publier : la part des parties adjugées et le score recalculé sans elles ; les **nulles
  d'impuissance** (répétition ou 50 coups avec ≥ +3,00 au tableau), par bras — une politique à 1 nœud peut tourner en
  rond dans une position gagnée.

## 6. Mesure et critère (écrits avant la première partie)

Effectifs : **250 parties par couleur et par bras guidé** (10 départs × 25 graines), soit 500 par bras guidé ; L-L : 250
par couleur aussi (pour que la référence ait la même précision). Total : **1 500 parties**.

**Critère** (G-A, puis G-AU séparément) :

1. **Score de l'élève guidé ≥ 55 % sur l'ensemble**, et dans **chaque couleur au moins 5 points au-dessus de L-L** pour
   la même couleur et les mêmes départs.
2. **Les défaites sur un coup de plan** ne sont pas plus fréquentes chez l'élève guidé que chez le libre (définitions
   de l'Expert) :
   - *point de non-retour* : le coup après lequel l'évaluation (Stockfish après coup) passe sous −2,00 et n'y remonte
     plus jusqu'à la fin ; une faute que l'adversaire ne punit pas n'en est pas un ;
   - *coup de plan* (guidé) : un coup où le filtre a **changé** le choix (les coups qui servent sont strictement moins
     nombreux que les coups probables) ; si Maia l'aurait tiré de toute façon, le plan n'y est pour rien ;
   - *moment de plan* (libre) : un **coach fantôme** fait tourner reconnaissance et adoption sur les parties libres sans
     filtrer ; « moment de plan » = coup où il aurait eu un plan actif ;
   - on compare des **taux** : défaites dont le point de non-retour tombe sur un coup de plan (guidé) ou un moment de
     plan (libre), pour cent coups de ce type.
3. **En dessous de 52 %**, on écrit : la théorie du livre ne rend pas un 1500 meilleur.
4. Entre 52 et 55 % : on publie le chiffre avec son intervalle (± 4,4 points à 500 parties), sans conclure.

**Leçon du lot 1 bis** : chaque chiffre est publié avec son intervalle à 95 %.

À publier aussi : score par départ et couleur, part des coups sous plan, couverture des coups probables (§ 4.1), nombre
de fois où le plan n'avait aucun coup probable à proposer, et le **retard moyen des coups de plan** par rapport au coup
que Maia aurait joué (le coût du plan pour l'élève).

## 7. Prérequis (avant tout lot)

1. **Installation** : lc0 (compilé, version épinglée) et les poids Maia-1500 (dépôt CSSLab, somme de contrôle notée), sur
   le VPS (processeur) et sur Orion (processeur et carte graphique RTX 5070 Ti).
2. **Déterminisme**, même discipline qu'avec Stockfish : un fil, 1 nœud, table vidée ; **deux parties fraîches
   identiques** par bras ; identité VPS / Orion ; et si Orion joue sur carte graphique, identité processeur / carte
   graphique des politiques (au dernier chiffre près, ou on joue sur processeur).
3. **Contrôle de vraisemblance** (rien de choisi après coup) : 20 positions **tirées par graine** dans les départs et
   dans des parties L-L, entre les demi-coups 10 et 40, calmes et tactiques. Critère écrit avant la lecture : « l'ensemble
   des coups probables contient le coup naturel du 1500 et aucun coup qu'aucun 1500 ne jouerait », sur au moins 16
   positions sur 20. L'Expert note en plus, pour chaque position, si le coup de plan du livre figure parmi les coups
   probables (premier aperçu de « plan sans coup probable »).

## 8. Coût

Maia à 1 nœud : quelques millisecondes par coup. Le coût vient de Stockfish (garde-fou si option 1, adjudication, notation
après coup) : de l'ordre de la soirée par bras sur le VPS, moins avec Orion. Plafond : **deux soirées** pour les 1 500
parties ; au-delà, on s'arrête et on le dit.

## 9. Hors protocole, en parallèle (sous réserve du go de Sébastien)

**Distance pour l'atome regroupement** (GE) : que le coach voie arriver une attaque de roi. Retouche avec son test :
la Panov coach Noirs, SF 19, 50 parties, contre le lot 1 bis à mêmes graines ; versée dans le coach qui guidera Maia
seulement si elle réduit les perdues sans dégrader le coût.

## 10. Points à trancher à la relecture

Tranchés par l'Expert (21 oct., intégrés dans le corps) : garde-fou option 1, coup naturel, max(0, retard) (§ 4.3) ;
5 % et 5 coups (§ 4.1) ; aucun coup probable = contre le plan (§ 4.2) ; adjudication +6,00 / 10 demi-coups, +3,00 à 200
(§ 5) ; point de non-retour, coup de plan qui change le choix, coach fantôme (§ 6.2) ; contrôle de vraisemblance tiré par
graine, critère 16/20 écrit avant (§ 7.3).

Restent : la mécanique (Dev chef : lc0, déterminisme, coût, branchement) ; et pour le GE, le critère par couleur
« ≥ 5 points au-dessus de L-L » à la place de « 55 % dans chaque couleur » (§ 3 et § 6.1).
