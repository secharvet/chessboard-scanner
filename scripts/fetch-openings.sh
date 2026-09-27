#!/usr/bin/env bash
# Liste publique des ouvertures (lichess-org/chess-openings, domaine public) → data/openings/
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p data/openings
for x in a b c d e; do
  curl -fsSL -o "data/openings/$x.tsv" "https://raw.githubusercontent.com/lichess-org/chess-openings/master/$x.tsv"
done
echo "$(cat data/openings/*.tsv | wc -l) lignes d'ouvertures"
