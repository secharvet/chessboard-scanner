# Module 2 — Pièces mineures et tours

Spec V1 consolidée.

## Jetons

| id | params | Règle | Émission |
|----|--------|-------|----------|
| `PAIRE_FOUS` | `color` | Les deux fous de la couleur sont présents | Si présents |
| `FOU_BON` | `color`, `square` | Peu de pions amis sur la couleur du fou (< 2) | Par fou |
| `FOU_MAUVAIS` | `color`, `square` | ≥ 2 pions amis sur la couleur du fou | Par fou |
| `CAVALIER_AVANT_POSTE` | `square`, `color` | Cavalier placé sur un avant-poste (module 1.3) | Par cavalier |
| `TOUR_COLONNE_OUVERTE` | `square`, `color` | Tour sur une colonne ouverte ou semi-ouverte pour son camp | Par tour |
