#!/usr/bin/env bash
# Mode dev : sert les fichiers du repo via Podman (volumes), sans rebuild à chaque edit.
# Après lancement : modifie HTML/JS/CSS → Ctrl+Shift+R dans le navigateur.
#
# Rebuild image uniquement si tu changes docker/web/ (npm, nginx, vendor) :
#   podman compose -f compose.yaml build web
set -euo pipefail
cd "$(dirname "$0")/.."

export WEB_PORT="${WEB_PORT:-6400}"

if [[ ! -f data/pgn/catalog.json ]]; then
  echo "Catalogue absent — collecte…"
  bash scripts/collect-pgn.sh
fi

compose() {
  if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
    podman compose "$@"
  elif command -v podman-compose >/dev/null 2>&1; then
    podman-compose "$@"
  else
    echo "Podman introuvable." >&2
    exit 1
  fi
}

# Image une fois (vendor chess.js + stockfish) — pas à chaque session
if ! podman image exists chess_web 2>/dev/null && ! podman image exists localhost/chess_web 2>/dev/null; then
  echo "→ Première fois : build image web (vendor)…"
  compose -f compose.yaml build web
fi

echo "→ Démarrage web (mode dev, volumes montés)…"
compose -f compose.yaml -f compose.dev.yaml up -d --force-recreate web

echo ""
echo "Dev actif — pas de rebuild pour HTML/JS/CSS :"
echo "  Lecteur : http://localhost:${WEB_PORT}/"
echo "  Jouer   : http://localhost:${WEB_PORT}/play.html"
echo ""
echo "Édite les fichiers → rafraîchis le navigateur (Ctrl+Shift+R)."
echo "Rebuild seulement si docker/web/package.json ou Dockerfile changent."
