#!/usr/bin/env bash
# Sauvegarde quotidienne de la base (pg_dump compressé), 14 jours conservés, puis export des livres statiques.
set -euo pipefail
DEST=/home/ubuntu/sauvegardes/chess; mkdir -p "$DEST"
f="$DEST/chess-$(date +%Y%m%d-%H%M).sql.gz"
podman exec chess-db pg_dump -U chess --no-owner chess | gzip -9 > "$f"
find "$DEST" -name 'chess-*.sql.gz' -mtime +14 -delete
cd /home/ubuntu/chessboard-scanner && podman exec chess-api node scripts/db/exporter-livres.mjs 2>&1 | tail -2
echo "sauvegarde : $f ($(du -h "$f" | cut -f1))"
