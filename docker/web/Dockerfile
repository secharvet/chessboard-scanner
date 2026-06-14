# Étape 1 : npm uniquement dans le conteneur de build (jamais sur le host)
FROM docker.io/library/node:22-alpine AS vendor
WORKDIR /build
COPY docker/web/package.json ./
RUN npm install --omit=dev

# Étape 2 : nginx + fichiers statiques + vendor copié depuis l'étape 1
FROM docker.io/library/nginx:alpine

COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# HTML / CSS
COPY index.html play.html style.css play.css \
  /usr/share/nginx/html/

# JS — modules racine
COPY app.js board-view.js board-drawables.js comment-drawables.js pgn-graph.js \
  play.js play-board.js square-control.js stockfish-client.js eval-fr.js \
  mentor-client.js mentor-markdown.js mentor-ui.js \
  /usr/share/nginx/html/

# JS — répertoires entiers (tout sous-fichier inclus)
COPY positional /usr/share/nginx/html/positional/

# Statique
COPY assets /usr/share/nginx/html/assets/

# Vendor (chess.js + stockfish WASM) depuis l'étape npm
COPY --from=vendor /build/node_modules/chess.js/dist/esm/chess.js \
  /usr/share/nginx/html/vendor/chess.js
# Supprime la référence au source map absent (évite un warning console)
RUN sed -i '$d' /usr/share/nginx/html/vendor/chess.js
COPY --from=vendor /build/node_modules/stockfish/src/stockfish-nnue-16-single.js \
  /usr/share/nginx/html/vendor/stockfish/stockfish-nnue-16-single.js
COPY --from=vendor /build/node_modules/stockfish/src/stockfish-nnue-16-single.wasm \
  /usr/share/nginx/html/vendor/stockfish/stockfish-nnue-16-single.wasm
