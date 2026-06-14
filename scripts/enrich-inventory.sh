#!/usr/bin/env bash
# Liste les coups d'un PGN à enrichir (dry-run, Podman).
set -euo pipefail
cd "$(dirname "$0")/.."
PGN="${1:-collector/sources/bundled/londres.pgn}"

podman run --rm \
  -v "$(pwd)/collector:/app:Z,ro" \
  -w /app \
  localhost/chess_collector:latest \
  python enrich_tree.py --in "/app/${PGN#collector/}" --json 2>/dev/null \
  || PGN_OUTPUT_DIR=/tmp python3 collector/enrich_tree.py --in "$PGN"
