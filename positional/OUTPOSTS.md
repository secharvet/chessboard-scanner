# Module 1.3 — Avant-postes et pions faibles

Spec V1 consolidée.

## Jetons

| id | params | Règle | Émission |
|----|--------|-------|----------|
| `AVANT_POSTE` | `square`, `color` | Case en territoire adverse (rangs 5-8 blancs, 1-4 noirs), protégée par un pion allié, inattaquable par tout pion adverse | Par avant-poste |
| `PION_FAIBLE` | `square`, `color` | Pion à la fois isolé ET arrière | Par pion faible |
