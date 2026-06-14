#!/usr/bin/env bash
# Télécharge des collections PGN officielles depuis le web.
# Sources : Lichess Studies (API), The Week in Chess (TWIC).
#
# Usage :
#   bash scripts/fetch-official-pgn.sh
#   bash scripts/fetch-official-pgn.sh --twic-only
#   bash scripts/fetch-official-pgn.sh --lichess-only
set -euo pipefail
cd "$(dirname "$0")/.."

ROOT="$(pwd)"
LICHESS_DIR="$ROOT/collector/sources/official/lichess"
TWIC_DIR="$ROOT/collector/sources/official/twic"
MANIFEST="$ROOT/collector/sources/official/manifest.json"
UA="chess-opening-reader-collector/1.0"

TWIC_ONLY=false
LICHESS_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --twic-only) TWIC_ONLY=true ;;
    --lichess-only) LICHESS_ONLY=true ;;
  esac
done

mkdir -p "$LICHESS_DIR" "$TWIC_DIR"

echo "=== Téléchargement PGN officiels ==="
echo ""

if ! $LICHESS_ONLY; then
  echo "→ TWIC (The Week in Chess)…"
  # Dernière semaine disponible sur la page d'accueil
  TWIC_ZIP=$(curl -sS "https://theweekinchess.com/a-year-of-pgn-game-files" \
    | grep -oE 'href="https://theweekinchess.com/zips/twic[0-9]+g\.zip"' \
    | head -1 | sed 's/href="//;s/"//')
  if [[ -n "$TWIC_ZIP" ]]; then
    BASENAME=$(basename "$TWIC_ZIP")
    curl -sS -L -o "$TWIC_DIR/$BASENAME" "$TWIC_ZIP"
    unzip -o -q "$TWIC_DIR/$BASENAME" -d "$TWIC_DIR"
    echo "  OK : $TWIC_DIR/$(basename "$BASENAME" .zip).pgn"
  else
    echo "  ⚠ TWIC : aucun zip trouvé" >&2
  fi
  echo ""
fi

if ! $TWIC_ONLY; then
  echo "→ Lichess Studies (API)…"
  python3 << 'PY'
import json, requests
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent if False else Path(".")
LICHESS_DIR = Path("collector/sources/official/lichess")
MANIFEST = Path("collector/sources/official/manifest.json")
UA = "chess-opening-reader-collector/1.0"
LICHESS_DIR.mkdir(parents=True, exist_ok=True)

# Auteurs titrés + études curated (staff picks / communauté)
USERS = [
    ("NoseKnowsAll", "trainer"),
    ("DanielNaroditsky", "GM"),
    ("EricRosen", "IM"),
    ("thijscom", "FM"),
    ("Mr_Penings", "NM"),
    ("Craze", "GM"),
    ("Dejokz", "trainer"),
]

PRIORITY_IDS = {
    "1MfUDGWI": ("GM-RAM 5 Key Endgame Positions", "GM-RAM", "endgame"),
    "mENTYbNo": ("Advanced Endgame Tactics: Kasparov", "lichess", "endgame"),
    "kSK7Uq54": ("Tactics in Pawn Endgames", "lichess", "tactique"),
    "iDSPaPWA": ("Beautiful Chess Studies (1)", "FM thijscom", "etude"),
    "ByFy31hm": ("Beautiful Chess Studies (2)", "FM thijscom", "etude"),
    "RdtICntn": ("Beautiful Checkmate Puzzles", "FM thijscom", "tactique"),
    "ZWHbJIPd": ("Nimzo/Bogo Indian Repertoire", "NM Mr_Penings", "ouverture"),
    "xx2nOKJv": ("Most Common Mistakes in Chess", "NM Mr_Penings", "pedagogie"),
    "ZRY61QJ6": ("Top Sacrifices in the Attack", "NM Mr_Penings", "tactique"),
    "miI3fn8S": ("Fischer's My 60 Memorable Games", "NoseKnowsAll", "partie"),
    "mr9g4cVe": ("How to play against 1.e4", "IM EricRosen", "ouverture"),
    "GmddprG6": ("Singapore Openings MasterClass", "IM EricRosen", "ouverture"),
    "2EoS8scc": ("Top 10 Openings In 2026", "GM Craze", "ouverture"),
}

downloaded = []
errors = []

def fetch_study(sid, meta):
    url = f"https://lichess.org/api/study/{sid}.pgn"
    try:
        r = requests.get(url, timeout=90, headers={"User-Agent": UA, "Accept": "*/*"})
        if r.status_code == 200 and r.text.strip().startswith("["):
            dest = LICHESS_DIR / f"{sid}.pgn"
            dest.write_text(r.text, encoding="utf-8")
            downloaded.append({
                "id": sid,
                "file": dest.name,
                "bytes": len(r.text),
                "url": f"https://lichess.org/study/{sid}",
                "api": url,
                **meta,
            })
            print(f"  OK {sid}: {meta.get('title', sid)[:50]} ({len(r.text)} bytes)")
            return True
        errors.append({"id": sid, "status": r.status_code})
        print(f"  FAIL {sid}: HTTP {r.status_code}")
    except Exception as e:
        errors.append({"id": sid, "error": str(e)})
        print(f"  ERR {sid}: {e}")
    return False

# 1. Études prioritaires (curated)
for sid, (title, author, category) in PRIORITY_IDS.items():
    fetch_study(sid, {
        "title": title, "author": author, "category": category,
        "source": "lichess", "type": "study",
    })

# 2. Études publiques des auteurs titrés (max 3 par auteur)
seen = set(PRIORITY_IDS.keys())
for user, title_prefix in USERS:
    url = f"https://lichess.org/api/study/by/{user}"
    try:
        r = requests.get(url, timeout=30, headers={"User-Agent": UA, "Accept": "application/x-ndjson"})
        if r.status_code != 200:
            continue
        count = 0
        for line in r.text.strip().split("\n"):
            if not line.strip() or count >= 3:
                break
            s = json.loads(line)
            sid = s["id"]
            if sid in seen:
                continue
            seen.add(sid)
            ok = fetch_study(sid, {
                "title": s.get("name", sid),
                "author": user,
                "title_prefix": title_prefix,
                "source": "lichess",
                "type": "study",
                "likes": s.get("likes", 0),
            })
            if ok:
                count += 1
    except Exception as e:
        print(f"  ERR user {user}: {e}")

# 3. Nettoyer fichiers HTML invalides
for f in LICHESS_DIR.glob("*.pgn"):
    if f.read_text(encoding="utf-8", errors="ignore")[:1] != "[":
        f.unlink()
        print(f"  DEL invalid: {f.name}")

# 4. Manifeste
twic_files = list(Path("collector/sources/official/twic").glob("twic*.pgn"))
manifest = {
    "updatedAt": datetime.now(timezone.utc).isoformat(),
    "sources": {
        "lichess": {
            "description": "Études Lichess publiques par GMs/IMs/FMs/NMs",
            "api": "https://lichess.org/api/study/{id}.pgn",
            "count": len(downloaded),
            "studies": downloaded,
        },
        "twic": {
            "description": "The Week in Chess — parties de tournois officiels (GM)",
            "site": "https://theweekinchess.com",
            "files": [
                {
                    "file": f.name,
                    "bytes": f.stat().st_size,
                    "url": "https://theweekinchess.com/a-year-of-pgn-game-files",
                }
                for f in twic_files
            ],
        },
    },
    "errors": errors,
}
MANIFEST.parent.mkdir(parents=True, exist_ok=True)
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\nManifeste → {MANIFEST}")
print(f"Total Lichess : {len(downloaded)} études")
PY
fi

echo ""
echo "=== Terminé ==="
ls -lh "$LICHESS_DIR"/*.pgn 2>/dev/null | wc -l | xargs -I{} echo "  Lichess : {} fichiers"
ls -lh "$TWIC_DIR"/twic*.pgn 2>/dev/null | wc -l | xargs -I{} echo "  TWIC    : {} fichiers"
