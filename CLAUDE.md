# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot-reload via Podman volumes — F5 in browser to pick up changes)
make dev          # starts Podman container at http://localhost:6400/
make stop         # stop containers

# Tests (Node built-in test runner, no framework)
npm test                    # all tests
npm run test:pawn           # pawn-structure module only
node --test tests/king-safety.test.js   # single test file

# Browser checks (headless Chromium via Playwright)
make check          # headless
make check-headed   # visible browser

# PGN data
bash scripts/collect-pgn.sh   # populate data/pgn/ + catalog.json (required before first run)

# Docker image rebuild (only needed when docker/web/ or vendor deps change)
make build-web
```

**Runtime**: The app requires the Podman container for Stockfish WASM and PGN serving. `scripts/serve-dev.sh` is a fallback (Python HTTP server, no Stockfish).

**Adding a new root-level JS module**: you must also add a bind-mount line in `compose.dev.yaml` under `services.web.volumes`, otherwise the dev container won't serve the new file.

## Architecture

This is a **vanilla JS, no-build-step** chess web app served by nginx in Podman. All JS is ES modules loaded directly by the browser — no bundler, no TypeScript.

### Two pages

| Page | Entry | Purpose |
|------|-------|---------|
| `index.html` / `app.js` | Opening reader | Browse PGN studies/openings with commentary, variant graph, and AI coach |
| `play.html` / `play.js` | Play vs Stockfish | Interactive game against Stockfish engine with positional analysis |

### Key module boundaries

**Board rendering** — stateless, pure DOM functions:
- `board-view.js` → `renderFenBoard()`: renders the static opening reader board (SVG arrows, field highlights)
- `play-board.js` → `renderPlayBoard()`: renders the interactive play board (drag-and-drop, heatmap)
- `fen-board-renderer.js`: low-level FEN→square helpers used by both
- `board-drawables.js` / `comment-drawables.js`: extract arrow/field drawables from PGN comment annotations (`[%cal]`, `[%csl]`)

**Chess logic**:
- Opening reader uses `@jackstenglein/chess` (CDN ESM import) — supports PGN trees, variations, move comments
- Play mode uses `chess.js` from `/vendor/chess.js` (bundled in Docker image via `npm postinstall`)

**Stockfish integration** (`stockfish-client.js`):
- Runs Stockfish NNUE 16 as a Web Worker (`/vendor/stockfish/stockfish-nnue-16-single.js`)
- Only one analysis in flight at a time (module-level `analysisInFlight` flag)
- Returns `EngineResult` with `bestmove`, `score`, `multiPv`, `depthChain`

**Positional analysis** (`positional/`):
- A rule-based engine that produces `PositionalToken[]` from a FEN string
- Entry: `positional/index.js` → `buildAllFacts(fen)` aggregates all modules
- Modules: `pawn-structure`, `open-files`, `outposts`, `king-safety`, `minor-pieces`, `material`, `development`, `space`, `piece-attacks`
- `positional/interpreter.js` → `interpretFacts()` / `topAdvice()`: converts tokens to French prose with a weighted priority system (10=critical → 2=neutral)
- `positional/tokens.js` defines the `PositionalToken` type and helpers (`token()`, `findToken()`, `sortTokens()`)
- `eval-fr.js`: bridges UCI output → chess.js SAN → French advice using the positional engine

**AI coach** (`mentor-client.js` / `mentor-ui.js`):
- POSTs `{fen, side, moves, question}` to `/api/chess/mentor/groq` (llm-factory backend, Groq · GPT-OSS 120B)
- API base auto-detected: uses `window.CHESS_MENTOR_API` if set, else `window.location.origin`, else `http://127.0.0.1:8000`
- `mentor-ui.js` → `bindMentorPanel()` handles button state, abort controller, streaming display, and markdown rendering

**PGN graph** (`pgn-graph.js`):
- Renders a git-like SVG lane graph of PGN variations
- Supports pan/zoom, hover preview (shows board position on hover), click-to-seek

**Data pipeline**:
- `scripts/collect-pgn.sh` fetches/copies PGN files and generates `data/pgn/catalog.json`
- Catalog has two modes: `openings` (flat list) and `studies` (Lichess studies with chapters)
- The collector service (`collector/collect.py`) fetches from Lichess API

### Vendor / Docker split

- `vendor/chess.js` — copied from `node_modules` by `npm postinstall` (for host-side tests and scripts)
- `/vendor/` inside the container — built into the Docker image (`docker/web/package.json` installs chess.js 1.4.0 + stockfish 16.0.0)
- Never import from `node_modules` directly in browser code; use `/vendor/chess.js`

### Tests

Tests use Node's built-in `node:test` + `node:assert/strict`. Each file in `tests/` covers one positional module. Tests are FEN-in → token-out assertions using `findToken()`.
