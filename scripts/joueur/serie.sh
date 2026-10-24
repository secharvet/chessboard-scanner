#!/usr/bin/env bash
# La série de la V0 : 100 parties du coach contre Maia-1500 (50 Blancs graines 1-50, 50 Noirs graines 1-50), budget 400000,
# arène + examinateur pour chacune. Écrit dans `parties-serie/` de CE worktree (jamais ailleurs). Tient `parties-serie/bilan.json`
# à jour après chaque partie (score, bévues, phrases, sortes, alertes, temps). REPRENABLE : une partie déjà jouée ET examinée
# est sautée (on repère par camp + graine, quelle que soit la date). Le code figé de la série est écrit dans chaque fichier.
#
#   bash scripts/joueur/serie.sh
#
# Surcharges : SORTIE, BUDGET, FIGEE (sha du code figé), STOCKFISH_PATH, GRAINES (nb de graines par couleur, défaut 50).
set -euo pipefail
cd "$(dirname "$0")/../.."

SORTIE="${SORTIE:-parties-serie}"
BUDGET="${BUDGET:-400000}"
GRAINES="${GRAINES:-50}"
FIGEE="${FIGEE:-93e0a86}"   # version figée de la série (dev-lead au lancement)
export STOCKFISH_PATH="${STOCKFISH_PATH:-/usr/local/bin/stockfish}"
mkdir -p "$SORTIE"
date="$(date -u +%F)"

une_partie() {
  local camp="$1" graine="$2"
  local nn; nn="$(printf '%02d' "$graine")"
  # Reprise : un fichier <*>-maia-<camp>-<nn>.json déjà examiné (quelle que soit la date) → on saute.
  local fait=""
  for cand in "$SORTIE"/*-maia-"${camp}"-"${nn}".json; do
    [ -e "$cand" ] || continue
    if node -e "process.exit(require('./$cand').examen?0:1)" 2>/dev/null; then fait="$cand"; break; fi
  done
  if [ -n "$fait" ]; then echo "saute maia-${camp}-${nn} (déjà fait : $fait)"; return; fi

  local id="${date}-maia-${camp}-${nn}"
  node scripts/joueur/partie.mjs --adversaire maia --camp "$camp" --graine "$graine" --budget "$BUDGET" \
    --joueur coach/joueur/joueur.mjs --code "$FIGEE" --sortie "$SORTIE"
  node scripts/joueur/examiner.mjs "$SORTIE/${id}.json"
  node scripts/joueur/bilan.mjs "$SORTIE" || true
}

echo "SÉRIE : début $(date -u +%FT%TZ) — 100 parties (${GRAINES} Blancs + ${GRAINES} Noirs), budget ${BUDGET}, code figé ${FIGEE}"
for g in $(seq 1 "$GRAINES"); do une_partie w "$g"; done
for g in $(seq 1 "$GRAINES"); do une_partie b "$g"; done
node scripts/joueur/bilan.mjs "$SORTIE"
echo "SÉRIE TERMINÉE $(date -u +%FT%TZ)"
touch "$SORTIE/.termine"
