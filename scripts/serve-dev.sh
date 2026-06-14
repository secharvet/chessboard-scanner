#!/usr/bin/env bash
# Fallback sans Stockfish (python seulement) — pas pour play.html.
# Dev complet (vendor + hot reload) : ./scripts/dev.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f data/pgn/catalog.json ]]; then
  echo "Catalogue absent — collecte…"
  bash scripts/collect-pgn.sh
fi

PORT="${DEV_PORT:-8080}"
echo "HTTP simple : http://localhost:${PORT}"
echo "Pour Jouer + Stockfish + F5 sans rebuild : ./scripts/dev.sh"
exec python3 -m http.server "$PORT"
