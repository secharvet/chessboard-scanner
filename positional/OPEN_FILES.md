# Module 1.2 — Colonnes et structure de pions avancée

Spec V1 consolidée.

## Jetons

| id | params | Règle | Émission |
|----|--------|-------|----------|
| `COLONNE_OUVERTE` | `file` | Aucun pion (blanc ni noir) sur la colonne | Par colonne |
| `COLONNE_SEMI_OUVERTE` | `file`, `color` | Aucun pion de `color`, mais pion adverse présent | Par colonne + couleur |
| `DOUBLON` | `file`, `color` | ≥ 2 pions de même couleur sur la même colonne | Par doublon |
| `PION_ARRIERE_DOUBLE` | `color` | ≥ 2 pions arrière de même couleur sur colonnes adjacentes | Si présent |
| `CHAINE_PIONS` | `color` | ≥ 3 pions qui se soutiennent diagonalement | Si présent |
