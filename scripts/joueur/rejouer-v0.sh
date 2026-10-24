#!/usr/bin/env bash
# Rejoue la V0 du coach joueur de bout en bout : arène (coach vs Maia-1500) + examinateur + index, en une commande.
# À lancer depuis n'importe où (il se recale sur la racine du worktree). Réglage V0 par défaut : graine 1, coach Blancs,
# budget 400000, le VRAI Joueur. Surcharges par variables : GRAINE, CAMP, BUDGET, SORTIE, JOUEUR, STOCKFISH_PATH.
#
#   bash scripts/joueur/rejouer-v0.sh
#
# Écrit <SORTIE>/<id>.json (contrat), <id>.pgn, et tient <SORTIE>/index.json à jour. Affiche l'identifiant, le chemin et
# le temps total. L'identifiant est <date UTC>-maia-<camp>-<NN> (même calcul que l'arène : date UTC, graine sur deux chiffres).
set -euo pipefail
cd "$(dirname "$0")/../.."

GRAINE="${GRAINE:-1}"
CAMP="${CAMP:-w}"
BUDGET="${BUDGET:-400000}"
SORTIE="${SORTIE:-parties}"
JOUEUR="${JOUEUR:-coach/joueur/joueur.mjs}"
export STOCKFISH_PATH="${STOCKFISH_PATH:-/usr/local/bin/stockfish}"

ID="$(date -u +%F)-maia-${CAMP}-$(printf '%02d' "$GRAINE")"
echo "V0 : ${ID} — coach ${CAMP} contre Maia-1500 (graine ${GRAINE}, budget ${BUDGET}, joueur ${JOUEUR})"

t0=$(date +%s)
node scripts/joueur/partie.mjs --adversaire maia --camp "$CAMP" --graine "$GRAINE" --budget "$BUDGET" --joueur "$JOUEUR" --sortie "$SORTIE"
node scripts/joueur/examiner.mjs "${SORTIE}/${ID}.json"
t1=$(date +%s)

echo "---"
echo "identifiant : ${ID}"
echo "fichier     : ${SORTIE}/${ID}.json (+ .pgn ; ${SORTIE}/index.json à jour)"
echo "temps total : $((t1 - t0)) s"
