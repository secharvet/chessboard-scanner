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
la couverture : part de la masse de probabilité gardée).

### 4.2 Le choix du coup

- **Coach sans plan**, ou élève libre : tirage dans la politique de Maia (température 1, restreinte aux coups probables),
  par une **graine** fixée par partie. Le hasard est le nôtre, pas celui de lc0, pour que deux passes soient identiques.
- **Coach avec plan** : on garde parmi les coups probables ceux qui **servent le plan** (pas de plan, roque, coup forcé,
  comme dans `choisirCoup`) ; s'il en reste, tirage parmi eux, au prorata de leur probabilité ; s'il n'en reste aucun,
  l'élève joue son coup (tirage normal) — **jamais un coup que Maia ne jouerait pas** (le plan doit être exécutable par
  l'élève, GE).
- **Attente utile (G-AU seulement)** : sans pas de plan disponible, le premier coup probable (dans l'ordre de Maia) qui
  sert une instance du catalogue.

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

### 4.4 Ce qui ne change pas

Le catalogue, les livres, la reconnaissance de structure, l'adoption, l'enchaînement, la bascule, la dernière chance
relue, le compteur : code du lot 1 bis, règles A. Le bras prix n'est pas joué (GE § 7.4).

## 5. La partie

- Départ du lot 1, puis Maia contre Maia jusqu'à la fin : mat, pat, répétition, 50 coups, ou **200 demi-coups**.
- À 200 demi-coups, ou si la partie est clairement jouée, **adjudication** par Stockfish (prof. 18, un fil) : ≥ +3,00
  pour un camp pendant 6 demi-coups consécutifs → gain ; sinon nulle à 200. Une partie de 1500 n'est « gagnée » au
  score que si elle est gagnée sur l'échiquier ou adjugée : seuil à relire par l'Expert.
- **Score** : 1, ½, 0.

## 6. Mesure et critère (écrits avant la première partie)

Effectifs : **250 parties par couleur et par bras guidé** (10 départs × 25 graines), soit 500 par bras guidé ; L-L : 250
par couleur aussi (pour que la référence ait la même précision). Total : **1 500 parties**.

**Critère** (G-A, puis G-AU séparément) :

1. **Score de l'élève guidé ≥ 55 % sur l'ensemble**, et dans **chaque couleur au moins 5 points au-dessus de L-L** pour
   la même couleur et les mêmes départs.
2. **Les parties perdues sur un coup de plan** ne dépassent pas, chez l'élève guidé, les parties perdues sur un coup
   comparable chez l'élève libre. *Perdue sur un coup de plan* : partie perdue dont la plus grosse chute d'évaluation
   (Stockfish après coup, ≥ 2,00) a lieu sur un coup choisi sous plan ; pour le libre, le même compte sur les coups
   joués aux mêmes moments de la partie.
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
3. **Contrôle de vraisemblance** : sur 20 positions des départs, les coups probables de Maia relus par l'Expert
   (« un 1500 joue-t-il ça ? »).

## 8. Coût

Maia à 1 nœud : quelques millisecondes par coup. Le coût vient de Stockfish (garde-fou si option 1, adjudication, notation
après coup) : de l'ordre de la soirée par bras sur le VPS, moins avec Orion. Plafond : **deux soirées** pour les 1 500
parties ; au-delà, on s'arrête et on le dit.

## 9. Hors protocole, en parallèle (sous réserve du go de Sébastien)

**Distance pour l'atome regroupement** (GE) : que le coach voie arriver une attaque de roi. Retouche avec son test :
la Panov coach Noirs, SF 19, 50 parties, contre le lot 1 bis à mêmes graines ; versée dans le coach qui guidera Maia
seulement si elle réduit les perdues sans dégrader le coût.

## 10. Points à trancher à la relecture

1. Garde-fou : option 1 (Stockfish note) ou option 2 (valeur de Maia) — § 4.3.
2. Coups probables : seuil 5 % et au plus 5 coups ? — § 4.1.
3. Adjudication : +3,00 pendant 6 demi-coups, nulle à 200 ? — § 5.
4. Définition de « perdue sur un coup de plan » et de son pendant chez le libre — § 6.2.
5. Critère par couleur : « ≥ 5 points au-dessus de L-L » à la place de « 55 % dans chaque couleur » — § 3 et § 6.1.
