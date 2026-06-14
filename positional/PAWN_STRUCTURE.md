# Module 1.1 — Structure de pions (V1)

Faits statiques depuis la FEN uniquement. Jetons `kind: 'fact'`.

## Jetons

| id | params | Émission |
|----|--------|----------|
| `NOMBRE_ILOTS` | `color`, `count` | Toujours (0 inclus) |
| `PION_ISOLE` | `color`, `square` | Par pion |
| `PION_ARRIERE` | `color`, `square` | Par pion (3 conditions) |
| `MAJORITE_AILE_DAME` | `color` | Si strict sur a–d |
| `MAJORITE_AILE_ROI` | `color` | Si strict sur e–h |
| `PION_PASSE` | `color`, `square` | Par pion passé |
| `PION_PASSE_PROTEGE` | `color`, `square` | Si passé + défendu par pion allié |

## Îlots

Colonnes a–h avec ≥1 pion du camp ; groupes de colonnes **adjacentes** = un îlot.

## Pion isolé

Aucun pion allié sur les colonnes `col±1` (toute rangée). a/h : une voisine.

## Pion arrière

P en `(col, row)` arrière ssi :

1. Pion allié sur `col±1` à rangée **strictement** plus avancée (blancs : `> row`, noirs : `< row`).
2. Case devant `(col, row±1)` **non** contrôlée par un pion allié sur `col±1`.
3. Case devant contrôlée par un pion adverse sur `col±1`.

## Majorité

Aile dame = a–d, aile roi = e–h. `MAJORITE_*` pour le camp qui a **strictement** plus de pions sur l’aile.

## Pion passé

Aucun pion adverse sur `col∈{col-1,col,col+1}` avec `r > row` (blancs) ou `r < row` (noirs).

## Pion passé protégé

Passé + case de P attaquée par un pion allié (diagonale pion).

## Tests de référence

- Îlots blancs a2,b2,d2,e2,g2 → count 3
- Arrière : `8/8/8/3p4/3P4/2P5/8/8` → `PION_ARRIERE:c3`
- Contre : `8/8/8/8/3P4/2P5/8/8` → pas arrière
