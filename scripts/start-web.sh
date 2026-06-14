#!/usr/bin/env bash
# Production / test intégré : image figée (rebuild après changement de code).
# Pour le dev quotidien (F5 sans rebuild) : ./scripts/dev.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f data/pgn/catalog.json ]]; then
  echo "Catalogue absent — lancement du collecteur…"
  bash scripts/collect-pgn.sh
fi

if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
  podman compose up -d --build web
elif command -v podman-compose >/dev/null 2>&1; then
  podman-compose up -d --build web
else
  echo "Podman introuvable. Installe podman et podman-compose." >&2
  exit 1
fi

echo ""
echo "Lecteur : http://localhost:${WEB_PORT:-6400}/"
echo "Jouer   : http://localhost:${WEB_PORT:-6400}/play.html"
