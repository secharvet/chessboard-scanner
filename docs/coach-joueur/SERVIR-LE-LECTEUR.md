# Servir le lecteur du coach joueur (pour le pilote — nginx + image de prod)

Le lecteur `partie.html` et ce qu'il charge. Ce qui est **nouveau** (à ajouter) est marqué ; le reste est déjà servi par
les pages existantes, rien à faire.

## Fichiers NOUVEAUX à servir

- `partie.html` **(nouveau)** — la page.
- `partie.js` **(nouveau)** — module navigateur (racine).
- `partie.css` **(nouveau)** — feuille de style.
- `parties/` **(nouveau, données d'exécution)** — `parties/index.json` + `parties/<id>.json`, écrits par l'arène, **pas**
  dans l'image : un dossier servi au runtime (volume monté ou chemin inscriptible).

## Ce que la page charge d'autre (DÉJÀ servi, pour mémoire)

- CSS : `vendor-web/bootstrap/bootstrap.min.css`, `style.css`, `site-nav.css`.
- JS : `site-nav.js` ; `board-view.js` → `board-drawables.js` + `fen-board-renderer.js` ; `/vendor/chess.js` (image).
- Images : `assets/pieces/*.png` (jeu de pièces).
- API (existantes) : `site-nav.js` appelle `/api/auth/moi` et `/api/acces` (il dégrade proprement sinon).

## nginx — un point d'attention

`docker/web/nginx.conf` **bloque tout `.json`** (`location ~ \.(md|mjs|json|…)$ { deny all }`). Il faut donc une
exception de préfixe AVANT ce blocage, pour servir les parties :

```nginx
location ^~ /parties/ { try_files $uri =404; add_header Cache-Control "no-cache, must-revalidate"; }
```

(Le `^~` l'emporte sur la regex `.json`, donc `parties/index.json` et `parties/<id>.json` passent ; rien d'autre en
`.json` n'est ouvert.)

## Image de prod — `docker/web/Dockerfile`

Les fichiers y sont copiés nommément (pas de glob). Ajouter aux `COPY` existants :

- au `COPY` des pages/CSS : `partie.html` et `partie.css` ;
- au `COPY` des modules navigateur : `partie.js`.

`parties/` n'entre pas dans l'image (données d'exécution).

## Rejouer la V0 en une commande

```
bash scripts/joueur/rejouer-v0.sh
```

Arène + examinateur + index, réglage V0 (graine 1, coach Blancs, budget 400000, le vrai `Joueur`). Affiche l'identifiant,
le chemin du fichier et le temps total. Surcharges : `GRAINE`, `CAMP`, `BUDGET`, `SORTIE`, `JOUEUR`, `STOCKFISH_PATH`.
