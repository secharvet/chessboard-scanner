# Second pilote Maia (22 octobre 2026, nuit) — résultat brut

Demandé par le GE le 22 oct., go de Sébastien. VPS, un fil, code `division` 6f4eb16 (copie figée). Deux départs × trois
bras × 25 parties (graines 1-25, les mêmes que le premier pilote) ; adjudication sur mat vu seulement, sinon jusqu'au
200e demi-coup. LL = élève libre (coach fantôme), GA = guidé strict (seulement parmi ses coups probables), GS = guidé
soufflé (le coach peut souffler un pas du plan hors des coups probables, sous le seul garde-fou du retard). Dépouillement
complet, partie par partie : `reports/plans/maia/pilote-2/DEPOUILLEMENT.txt` (`scripts/plans/depouillement-pilote-maia.mjs`).

## 1. « Un 1500 trouve-t-il le coup du plan ? » (la mesure directe, ta 4e proposition)

À chaque coup sous plan, tous les pas légaux du plan et la probabilité que Maia leur donne. « Trouvé » = au moins un pas
parmi les coups probables (≥ 5 %).

| départ | coups sous plan (LL) | un pas parmi les probables | probabilité médiane du meilleur pas |
|---|---|---|---|
| **Carlsbad, élève Blancs** | 182 | **27 %** | **2,8 %** |
| Panov, élève Noirs | 127 | 54 % | 5,1 % |

Carlsbad, attaque de minorité (rupture b→b5) : pas probable dans 19 % des coups, meilleur pas à 4,8 % (LL) ; poussée e4 :
37 %, 2,9 %. **Ton hypothèse est confirmée sur la Carlsbad** : trois fois sur quatre, aucun coup du plan n'est dans ce
qu'un 1500 envisage. Sur la Panov (plans d'un coup, Cd5, Td8), une fois sur deux.

## 2. Le coach parle-t-il ?

| | coups changés par partie (médiane) | coups soufflés | probabilité Maia médiane du coup soufflé |
|---|---|---|---|
| Carlsbad GA | 1 | — | — |
| **Carlsbad GS** | **4** (condition ≥ 3 tenue) | 79 | 4,0 % |
| Panov GA | 1 | — | — |
| Panov GS | 1 | 15 | 1,5 % |

Dans la Carlsbad, le bras soufflé fait enfin parler le coach. Dans la Panov, non : il n'y a presque rien à souffler.

## 3. Score et tranche au 30e demi-coup (25 parties : tout est dans le bruit)

| départ | bras | score de l'élève | longueur médiane | fins | éval 30e, apparié − LL (médiane ; mieux / pareil / moins bien) |
|---|---|---|---|---|---|
| Carlsbad | LL | 7,5/25 | 42 | 24 mats vus, 1 nulle | — |
| Carlsbad | GA | 8,5/25 | 45 | 24 mats vus, 1 nulle | 0,00 ; 8 / 10 / 7 |
| Carlsbad | **GS** | **11/25** | 52 | 23 mats vus, 2 nulles | **+1,64 ; 14 / 1 / 10** |
| Panov | LL | 14/25 | 33 | 25 mats vus | — |
| Panov | GA | 12/25 | 22 | 25 mats vus | 0,00 ; 5 / 10 / 10 |
| Panov | GS | 7/25 | 26 | 25 mats vus | −0,10 ; 4 / 8 / 13 |

- À 25 parties, l'écart de score attendu par le seul hasard est de l'ordre de ± 3 à 4 points. Carlsbad GS +3,5 sur LL,
  Panov GS −7 : le premier est dans le bruit, le second en limite. **Aucun des deux n'est un résultat.**
- L'éval au 30e demi-coup prend l'éval finale (± 10) quand la partie est finie avant : la loterie des mats y entre encore.
  La médiane appariée est plus parlante que la moyenne.
- **Presque toutes les parties finissent sur un mat vu**, même sans l'adjudication à +6 (Carlsbad 47/50 des guidées) :
  Maia à un nœud se fait mater. La loterie tactique est la première page, comme tu l'as dit.

## 4. Ce que le pilote établit, et ce qu'il n'établit pas

- **Établi** : les pas du plan de la Carlsbad ne sont pas des coups qu'un 1500 trouve seul (27 % des coups, meilleur pas à
  2-3 %). Un coach qui ne souffle pas n'y peut rien dire ; le bras soufflé y parle (4 coups par partie).
- **Pas établi** : que souffler aide. Carlsbad soufflé mieux (11 contre 7,5, 14 paires sur 25 meilleures au 30e
  demi-coup), Panov soufflé moins bien (7 contre 14) : à 25 parties, ni l'un ni l'autre.
- Rien n'est relancé. La suite (protocole avec le bras soufflé et l'adjudication sur mat, sur quels départs, combien de
  parties pour sortir du bruit) est à décider avec toi.
