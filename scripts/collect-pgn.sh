#!/usr/bin/env bash
# Collecte les PGN dans data/pgn via Podman uniquement.
set -euo pipefail
cd "$(dirname "$0")/.."

compose() {
  if command -v podman >/dev/null 2>&1; then
    podman compose -f compose.yaml "$@"
  elif command -v podman-compose >/dev/null 2>&1; then
    podman-compose -f compose.yaml "$@"
  else
    echo "Erreur : podman (ou podman-compose) requis." >&2
    exit 1
  fi
}

echo "→ Build collecteur…"
compose build collector

echo "→ Collecte PGN…"
compose run --rm collector

echo "OK — catalogue : data/pgn/catalog.json"
