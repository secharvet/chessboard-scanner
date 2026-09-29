# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot-reload via Podman volumes — F5 in browser to pick up changes)
make dev          # starts Podman container at http://localhost:6400/
make stop         # stop containers

# Coach server (needs native Stockfish + .env; nginx proxies /api/chess/mentor/ to it)
make coach        # coach/server.mjs on :8000
make coach-eval   # bench naïf vs ancré → reports/

# Tests (Node built-in test runner, no framework; offline — no network, LLM, or container)
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

**Dev container**: `compose.dev.yaml` mounts the whole repo on the nginx web root (read-only), so any edit is live on F5 — no rebuild, no restart. Vendor files live in the image under `/opt/vendor` (served at `/vendor/`). `docker/web/nginx.conf` blocks dotfiles (`.env`), server code (`coach/`), `node_modules/`, `.md/.mjs/.json` etc. — keep that list up to date when adding server-side files. New root-level browser modules still need adding to the `COPY` list in `docker/web/Dockerfile` for the prod image.

## Architecture

Functional architecture of the coach / analysis brain (diagrams, measured results, known limits): `docs/ARCHITECTURE.md` — keep it updated when changing coach/ or positional/.

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

**AI coach** (`coach/` server + `mentor-client.js` / `mentor-ui.js`):
- Principle: the LLM never calculates — it explains from a numbered, time-stamped context and must cite a source for every claim. Golden rule from `docs/ARCHITECTURE.md`: no hard-coded special cases, only general definitions.
- Pipeline (`coach/coach.mjs`): context → LLM → verification → one rewrite if needed → optional judge. `coach/context.mjs` builds everything it may say: native Stockfish lines (MultiPV 3), what each line changes (diff of positional facts at a quiet horizon), opponent threat, recognized pawn structure with classical plans (`positional/structures.js`), imbalance balance-sheet, static facts. Moves are rendered in French SAN (`coach/notation.mjs`).
- "Club-player calculation" tools feed the context: `threats.mjs` (1-ply gains both ways), `forcing.mjs` (forced lines ≤8 plies), `prep-threats.mjs` (what the opponent is preparing), `maneuvers.mjs` (piece itineraries to outposts/files), `motifs.mjs` (tactical motifs along a line). Our code *chooses* lines; `engine-eval.mjs` has Stockfish score only where they end.
- Verification: `verify.mjs` (citations exist and support the claim), `guard.mjs` (every cited move is legal or in the provided lines), `judge.mjs` (optional second LLM grading substance, used by the bench).
- Verified plans: `plans.mjs` / `plan-concepts.mjs` — a plan is a concept that appears in the engine's best line but not in clearly worse ones (contrast/consensus); the coach only announces a plan both Stockfish versions agree on (two-engine rule).
- Experience memory & LLM player: `memory.mjs` / `review.mjs` / `diagnose.mjs` + `scripts/llm-plays.mjs` (LLM plays vs throttled Stockfish with our perception, no engine lines); lessons notebook in `memory/lessons.json` (unversioned).
- Player style/portrait: `coach/profile.mjs`, `coach/portrait.mjs`, `scripts/portrait.mjs --lichess <user>`.
- `coach/server.mjs` (port 8000; nginx proxies `/api/chess/mentor/`) → `coach/llm.mjs` (providers: `claude-cli`, `deepseek`, `groq`, `openai`, `anthropic`; config in `.env`, see `.env.example`; retries on 429/5xx).
- `make coach-eval` / `scripts/coach-eval.mjs`: naive (FEN-only) vs grounded on `coach/eval-positions.mjs`, report in `reports/`; `--judge` adds the grader.
- Requires native Stockfish on the host: `STOCKFISH_PATH`, else `/usr/local/bin/stockfish` (official SF 19 preferred), else `/usr/games/stockfish` (apt).
- The client POSTs `{fen, side, moves, question}` to `/api/chess/mentor/groq` (path kept for compatibility); API base auto-detected (`window.CHESS_MENTOR_API` → origin → `http://127.0.0.1:8000`). `mentor-ui.js` → `bindMentorPanel()` handles button state, abort, streaming, markdown.

**Plans research pipeline** (`scripts/` + `docs/PLANS-ET-CONCEPTS.md`):
- Ongoing experiment: replace the "LLM as strategist" with small specialized models that recognize when a chess concept is the right plan, verified by Stockfish. `docs/PLANS-ET-CONCEPTS.md` holds the definitions (tactic vs plan, contrast criterion, price rule, atoms/recettes grammar) and a dated progress log — read it before touching these scripts, and log results there.
- Label generation from engine lines: `label-positions.mjs`, `extend-labels.mjs`, `verify-labels.mjs`; from human games ("this player, at this level, realizes this plan here"): `label-human.mjs`, `human-grid.mjs`.
- Emergence of motifs from human games by Elo band: `emergence.mjs`, `emergence-humain.mjs`; atom/recette catalog lives in `coach/atoms.mjs` / `coach/recettes.mjs`.
- Training & falsification: `build-dataset.mjs` + `train-plans.py` / `train_plans_lib.py` (4 model families compared on unseen games), `counterfactuals.mjs` + `score-counterfactuals.py` ("kill the ingredient" vs neutral-move probes).
- Outputs (reports, boards, grids) go to `reports/` (unversioned).

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

Tests use Node's built-in `node:test` + `node:assert/strict` and run fully offline (no network, LLM, or Stockfish). Positional tests are FEN-in → token-out assertions using `findToken()`; `coach-*.test.js` files cover the coach's perception and verification modules (threats, forcing lines, motifs, guard, verify, plans, memory…).

### Language

The project is in French: README, docs, commit messages, UI text, and the coach's prose are all French (code identifiers are English). Follow that convention — notably commit messages and anything added to `docs/`.
