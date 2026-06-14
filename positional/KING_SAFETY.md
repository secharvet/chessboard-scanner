# Module 1.4 — Sécurité du roi

Spec V1 consolidée.

## Jetons

| id | params | Règle | Émission |
|----|--------|-------|----------|
| `ROQUE_PETIT` | `color` | Roi en g1 (blanc) ou g8 (noir) | Si roqué |
| `ROQUE_GRAND` | `color` | Roi en c1 (blanc) ou c8 (noir) | Si roqué |
| `ROI_AU_CENTRE` | `color` | Roi toujours en e1/e8 | Si non roqué |
| `PIONS_ROI_BOUCLIER` | `color` | Les 3 pions devant le roi roqué sont présents | Si roqué et bouclier intact |
| `PIONS_ROI_AFFAIBLI` | `color` | Au moins un pion du bouclier est absent | Si roqué et bouclier percé |
