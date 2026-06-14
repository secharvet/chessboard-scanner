# Chess — raccourcis Podman / npm (voir scripts/ pour le détail).
WEB_PORT ?= 6400
export WEB_PORT

.DEFAULT_GOAL := help

.PHONY: help dev start stop logs build-web collect check check-headed \
	check-mentor check-mentor-all screenshot install test test-pawn

help: ## Affiche cette aide
	@echo "Chess — cibles Make (port web : $(WEB_PORT))"
	@echo ""
	@grep -E '^[a-zA-Z0-9_.-]+:.*##' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "URLs : http://localhost:$(WEB_PORT)/  |  …/play.html"

dev: ## Dev quotidien (volumes, F5 sans rebuild)
	bash scripts/dev.sh

start: ## Prod / intégration (image figée, rebuild)
	bash scripts/start-web.sh

stop: ## Arrête les conteneurs compose
	@if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then \
		podman compose -f compose.yaml -f compose.dev.yaml down 2>/dev/null || podman compose -f compose.yaml down; \
	elif command -v podman-compose >/dev/null 2>&1; then \
		podman-compose -f compose.yaml down; \
	else \
		echo "Podman introuvable." >&2; exit 1; \
	fi

logs: ## Logs du service web
	@if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then \
		podman compose -f compose.yaml -f compose.dev.yaml logs -f web 2>/dev/null || podman compose -f compose.yaml logs -f web; \
	else \
		podman-compose -f compose.yaml logs -f web; \
	fi

build-web: ## Rebuild image web (vendor chess.js + Stockfish)
	@if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then \
		podman compose -f compose.yaml build web; \
	else \
		podman-compose -f compose.yaml build web; \
	fi

collect: ## Collecte PGN → data/pgn/catalog.json
	bash scripts/collect-pgn.sh

fetch-official: ## Télécharge PGN officiels (Lichess + TWIC)
	bash scripts/fetch-official-pgn.sh

extract-benchmark: ## Construit benchmark-v2 (puzzles + études Lichess)
	node scripts/extract-benchmark-v2.mjs

validate-benchmark: ## Valide cohérence des extractions (couleur trait + commentaire/coup)
	node scripts/validate-extraction.mjs

install: ## Dépendances npm (Playwright, checks navigateur)
	npm install

test: ## Tests unitaires
	npm test

test-pawn: ## Tests structure de pions (Module 1.1)
	npm run test:pawn

check: ## Vérif JS + layout (Chromium headless)
	npm run check

check-headed: ## Comme check, navigateur visible
	npm run check:headed

benchmark: ## Métrique mentor v2 rapide (Stockfish WASM)
	node scripts/extract-benchmark-v2.mjs --skip-download 2>/dev/null || true
	node scripts/benchmark-mentor.mjs --fast --depth 12 --benchmark data/benchmark/benchmark-v2.json

benchmark-full: ## Métrique mentor v2 complète (~30+ min)
	node scripts/benchmark-mentor.mjs --depth 14 --benchmark data/benchmark/benchmark-v2.json

benchmark-mentor: ## Mesure perte IA vs Stockfish (puzzles couche A, 10 pos)
	node scripts/mentor-benchmark.mjs --fast --limit 10

benchmark-mentor-full: ## Mesure perte IA vs Stockfish (50 puzzles, ~10 min)
	node scripts/mentor-benchmark.mjs --limit 50

check-mentor: ## Test coach Groq (~10 s)
	npm run check:mentor

check-mentor-all: ## Test coach Groq + DeepSeek (~1 min)
	npm run check:mentor:all

screenshot: ## Captures lecteur + jouer
	npm run screenshot
