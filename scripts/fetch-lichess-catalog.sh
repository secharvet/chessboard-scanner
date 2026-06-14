#!/usr/bin/env bash
# Télécharge des études Lichess (ouvertures, répertoires, tactiques) pour le catalogue.
#
# Usage :
#   ./scripts/fetch-lichess-catalog.sh
#   ./scripts/fetch-lichess-catalog.sh --max-studies 300 --hot-pages 10
#
# Puis regénère le catalogue :
#   ./scripts/collect-pgn.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if command -v podman >/dev/null 2>&1; then
  podman run --rm \
    -v "$(pwd)/collector:/app:Z" \
    -w /app \
    docker.io/library/python:3.12-slim \
    bash -c 'pip install -q requests && python fetch_lichess_studies.py "$@"' _ "$@"
else
  python3 collector/fetch_lichess_studies.py "$@"
fi

echo ""
echo "Étape suivante : ./scripts/collect-pgn.sh"
