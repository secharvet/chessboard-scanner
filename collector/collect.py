#!/usr/bin/env python3
"""
Collecteur de PGN : sources embarquées, inbox locale, registry.json, URLs, Lichess.
Génère data/pgn/catalog.json pour le lecteur web.
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

OUTPUT_DIR = Path(os.environ.get("PGN_OUTPUT_DIR", "/data/pgn"))
ROOT = Path(__file__).resolve().parent
BUNDLED_DIR = ROOT / "sources" / "bundled"
AUGMENTED_DIR = ROOT / "sources" / "augmented"
INBOX_DIR = ROOT / "sources" / "inbox"
OFFICIAL_LICHESS_DIR = ROOT / "sources" / "official" / "lichess"
OFFICIAL_MANIFEST = ROOT / "sources" / "official" / "manifest.json"
STUDIES_OUTPUT_DIR = OUTPUT_DIR / "studies"
REGISTRY_PATH = ROOT / "sources" / "registry.json"
USER_AGENT = "chess-opening-reader-collector/1.0"
# Puzzles / chapitres FEN-only (0–1 coup) exclus du catalogue ouvertures
MIN_PLIES = int(os.environ.get("PGN_MIN_PLIES", "4"))
# Chapitres d'études : seuil plus bas (intros courtes)
MIN_STUDY_PLIES = int(os.environ.get("PGN_MIN_STUDY_PLIES", "2"))
MAX_LICHESS_STUDIES = int(os.environ.get("LICHESS_STUDIES_MAX", "0"))  # 0 = toutes


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "opening"


def parse_event(pgn_text: str) -> str:
    m = re.search(r'\[Event\s+"([^"]+)"\]', pgn_text)
    return m.group(1) if m else "Ouverture"


def parse_tag(pgn_text: str, tag: str) -> str | None:
    m = re.search(rf'\[{re.escape(tag)}\s+"([^"]+)"\]', pgn_text)
    return m.group(1) if m else None


def clean_title(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def count_plies(pgn_text: str) -> int:
    body = re.sub(r"\{[^}]*\}", "", pgn_text)
    body = re.sub(r"\([^)]*\)", "", body)
    body = re.sub(r"\d+\.\.\.", " ", body)
    tokens = re.findall(
        r"(?:O-O-O|O-O|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?)",
        body,
    )
    return len(tokens)


def is_valid_pgn(text: str) -> bool:
    t = text.strip()
    if not t or t.lstrip().startswith("<!DOCTYPE"):
        return False
    return t.startswith("[") or bool(re.search(r"\b1\.\s*\S+", t))


def split_pgn_games(text: str) -> list[str]:
    """Découpe un fichier multi-parties / multi-chapitres."""
    text = text.strip()
    if not text:
        return []
    parts = re.split(r'(?=\[Event\s+")', text)
    games = [p.strip() for p in parts if p.strip() and is_valid_pgn(p)]
    if len(games) <= 1 and is_valid_pgn(text):
        return [text]
    return games


def add_entry(entries: list, dest: Path, content: str, meta: dict) -> bool:
    plies = count_plies(content)
    if plies < MIN_PLIES:
        label = meta.get("title") or dest.name
        print(
            f"    ignoré ({plies} demi-coup(s), minimum {MIN_PLIES}) : {label}",
            file=sys.stderr,
        )
        return False
    write_pgn(dest, content, meta, plies=plies)
    entries.append(meta)
    return True


def write_pgn(dest: Path, content: str, meta: dict, *, plies: int | None = None) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content.strip() + "\n", encoding="utf-8")
    meta["file"] = dest.name
    meta["plies"] = plies if plies is not None else count_plies(content)


def copy_augmented_pair(stem: str, aug_text: str) -> str | None:
    """Écrit le PGN augmenté à côté de l'original ; retourne le nom de fichier."""
    dest = OUTPUT_DIR / f"{stem}.augmented.pgn"
    dest.write_text(aug_text.strip() + "\n", encoding="utf-8")
    return dest.name


def attach_augmented(meta: dict, stem: str) -> None:
    aug_src = AUGMENTED_DIR / f"{stem}.pgn"
    if not aug_src.is_file():
        return
    aug_text = aug_src.read_text(encoding="utf-8")
    if not is_valid_pgn(aug_text):
        print(f"  augmented ignoré (PGN invalide): {aug_src.name}", file=sys.stderr)
        return
    meta["augmentedFile"] = copy_augmented_pair(stem, aug_text)
    meta["augmentedTitle"] = parse_event(aug_text)
    rav_count = aug_text.count("(")
    if rav_count > 0:
        meta["hasVariations"] = True
        meta["variationBranches"] = rav_count
    print(f"  augmented: {stem}.augmented.pgn")


def copy_bundled(entries: list) -> None:
    if not BUNDLED_DIR.is_dir():
        return
    for src in sorted(BUNDLED_DIR.glob("*.pgn")):
        text = src.read_text(encoding="utf-8")
        meta = {
            "id": src.stem,
            "title": parse_event(text),
            "source": "bundled",
            "sourceRef": src.name,
        }
        add_entry(entries, OUTPUT_DIR / src.name, text, meta)
        attach_augmented(meta, src.stem)
        print(f"  bundled: {src.name}")


def copy_inbox(entries: list) -> None:
    if not INBOX_DIR.is_dir():
        return
    for src in sorted(INBOX_DIR.glob("*.pgn")):
        text = src.read_text(encoding="utf-8")
        if not is_valid_pgn(text):
            print(f"  inbox ignoré (PGN invalide): {src.name}", file=sys.stderr)
            continue
        meta = {
            "id": src.stem,
            "title": parse_event(text),
            "source": "inbox",
            "sourceRef": str(src.name),
        }
        add_entry(entries, OUTPUT_DIR / src.name, text, meta)
        print(f"  inbox: {src.name}")


def ingest_pgn_text(
    text: str,
    entries: list,
    *,
    source: str,
    source_ref: str,
    filename_hint: str | None = None,
    title_hint: str | None = None,
    split: bool = False,
) -> None:
    if not is_valid_pgn(text):
        print(f"    ignoré (pas un PGN valide): {source_ref}", file=sys.stderr)
        return

    games = split_pgn_games(text) if split else [text]
    if len(games) == 1 and not split:
        games = [text]

    for i, game in enumerate(games):
        title = title_hint or parse_event(game)
        base_id = slugify(filename_hint or title)
        if len(games) > 1:
            file_id = f"{base_id}-{i + 1}"
            title = f"{title} ({i + 1}/{len(games)})"
        else:
            file_id = base_id

        filename = f"{file_id}.pgn"
        if (OUTPUT_DIR / filename).exists():
            filename = f"{file_id}-{source}.pgn"

        meta = {
            "id": file_id,
            "title": title,
            "source": source,
            "sourceRef": source_ref,
        }
        add_entry(entries, OUTPUT_DIR / filename, game, meta)
        print(f"    → {filename}")


def fetch_url(url: str, catalog_entries: list, *, filename: str | None = None, title: str | None = None, split: bool = False) -> None:
    print(f"  url: {url}")
    r = requests.get(url, timeout=90, headers={"User-Agent": USER_AGENT})
    r.raise_for_status()
    ingest_pgn_text(
        r.text,
        catalog_entries,
        source="url",
        source_ref=url,
        filename_hint=filename or url.rstrip("/").split("/")[-1].replace(".pgn", ""),
        title_hint=title,
        split=split,
    )


def official_study_path(study_id: str) -> Path:
    return OFFICIAL_LICHESS_DIR / f"{study_id}.pgn"


def load_lichess_manifest_by_id() -> dict[str, dict]:
    if not OFFICIAL_MANIFEST.is_file():
        return {}
    try:
        data = json.loads(OFFICIAL_MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    by_id: dict[str, dict] = {}
    for row in data.get("sources", {}).get("lichess", {}).get("studies", []):
        sid = str(row.get("id", "")).strip()
        if sid:
            by_id[sid] = row
    return by_id


def ingest_local_lichess_studies(studies_catalog: list) -> None:
    if not OFFICIAL_LICHESS_DIR.is_dir():
        return

    manifest_by_id = load_lichess_manifest_by_id()
    files = sorted(OFFICIAL_LICHESS_DIR.glob("*.pgn"))
    if MAX_LICHESS_STUDIES > 0:
        files = files[:MAX_LICHESS_STUDIES]

    STUDIES_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for src in files:
        study_id = src.stem
        text = src.read_text(encoding="utf-8")
        if not is_valid_pgn(text):
            print(f"  ignoré (PGN invalide): {src.name}", file=sys.stderr)
            continue

        manifest = manifest_by_id.get(study_id, {})
        chapters_raw = split_pgn_games(text)
        if not chapters_raw:
            continue

        study_name = (
            clean_title(parse_tag(chapters_raw[0], "StudyName"))
            or clean_title(manifest.get("title"))
            or study_id
        )
        author = clean_title(manifest.get("author")) or "Lichess"
        category = clean_title(manifest.get("category")) or "ouverture"

        chapter_entries: list[dict] = []
        for i, chapter_text in enumerate(chapters_raw, start=1):
            plies = count_plies(chapter_text)
            if plies < MIN_STUDY_PLIES:
                continue

            chapter_title = (
                clean_title(parse_tag(chapter_text, "ChapterName"))
                or clean_title(parse_event(chapter_text))
                or f"Chapitre {i}"
            )
            chapter_id = f"{study_id}-c{i:03d}"
            dest = STUDIES_OUTPUT_DIR / f"{chapter_id}.pgn"
            dest.write_text(chapter_text.strip() + "\n", encoding="utf-8")
            chapter_entries.append(
                {
                    "id": chapter_id,
                    "title": chapter_title,
                    "file": f"studies/{dest.name}",
                    "plies": plies,
                }
            )

        if not chapter_entries:
            print(f"  ignoré (aucun chapitre ≥ {MIN_STUDY_PLIES} coups): {src.name}", file=sys.stderr)
            continue

        studies_catalog.append(
            {
                "id": f"study-{study_id}",
                "studyId": study_id,
                "title": study_name,
                "author": author,
                "category": category,
                "source": "lichess",
                "url": manifest.get("url") or f"https://lichess.org/study/{study_id}",
                "chapterCount": len(chapter_entries),
                "chapters": chapter_entries,
            }
        )
        print(f"  étude {study_id}: {len(chapter_entries)} chapitre(s) — {study_name[:50]}")


def fetch_lichess_study(study_id: str, catalog_entries: list) -> None:
    study_id = study_id.strip()
    if not study_id:
        return
    if official_study_path(study_id).is_file():
        print(f"  lichess: {study_id} (déjà dans official/, ignoré)")
        return
    url = f"https://lichess.org/api/study/{study_id}.pgn"
    print(f"  lichess: {study_id}")
    r = requests.get(url, timeout=90, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    if r.status_code == 404:
        print(f"    ignoré (404)", file=sys.stderr)
        return
    r.raise_for_status()
    ingest_pgn_text(
        r.text,
        catalog_entries,
        source="lichess",
        source_ref=study_id,
        filename_hint=f"lichess-{study_id[:12]}",
        split=True,
    )


def load_registry() -> dict:
    if REGISTRY_PATH.is_file():
        return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    return {"urls": [], "lichess_studies": []}


def process_registry(entries: list) -> None:
    reg = load_registry()
    for item in reg.get("urls", []):
        url = item.get("url", "").strip()
        if not url:
            continue
        try:
            fetch_url(
                url,
                entries,
                filename=item.get("filename"),
                title=item.get("title"),
                split=bool(item.get("split", False)),
            )
        except requests.RequestException as exc:
            print(f"    erreur: {exc}", file=sys.stderr)

    for sid in reg.get("lichess_studies", []):
        try:
            fetch_lichess_study(str(sid), entries)
        except requests.RequestException as exc:
            print(f"    erreur {sid}: {exc}", file=sys.stderr)


def write_catalog(entries: list, studies: list) -> None:
    # Dédupliquer par id
    seen = set()
    unique = []
    for e in entries:
        if e["id"] in seen:
            continue
        seen.add(e["id"])
        unique.append(e)

    studies_sorted = sorted(studies, key=lambda s: (s.get("title", ""), s.get("author", "")))
    chapter_total = sum(s.get("chapterCount", 0) for s in studies_sorted)

    catalog = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "openings": sorted(unique, key=lambda e: e.get("title", "")),
        "studies": studies_sorted,
        "stats": {
            "openingCount": len(unique),
            "studyCount": len(studies_sorted),
            "chapterCount": chapter_total,
        },
    }
    (OUTPUT_DIR / "catalog.json").write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"\nCatalogue : {len(unique)} ouverture(s), "
        f"{len(studies_sorted)} étude(s), {chapter_total} chapitre(s) "
        f"→ {OUTPUT_DIR / 'catalog.json'}"
    )


def purge_output_pgns() -> None:
    for old in OUTPUT_DIR.glob("*.pgn"):
        old.unlink()
    if STUDIES_OUTPUT_DIR.is_dir():
        for old in STUDIES_OUTPUT_DIR.glob("*.pgn"):
            old.unlink()


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    purge_output_pgns()

    entries: list = []
    studies: list = []

    print("=== PGN embarqués ===")
    copy_bundled(entries)

    print("\n=== Inbox (collector/sources/inbox/*.pgn) ===")
    copy_inbox(entries)

    print("\n=== Études Lichess locales (collector/sources/official/lichess/) ===")
    ingest_local_lichess_studies(studies)

    print("\n=== Registre (collector/sources/registry.json) ===")
    process_registry(entries)

    urls = [u.strip() for u in os.environ.get("PGN_URLS", "").split(",") if u.strip()]
    if urls:
        print("\n=== URLs (env PGN_URLS) ===")
        for url in urls:
            try:
                fetch_url(url, entries, split=True)
            except requests.RequestException as exc:
                print(f"    erreur: {exc}", file=sys.stderr)

    study_ids = [s.strip() for s in os.environ.get("LICHESS_STUDY_IDS", "").split(",") if s.strip()]
    if study_ids:
        print("\n=== Lichess (env LICHESS_STUDY_IDS) ===")
        for sid in study_ids:
            try:
                fetch_lichess_study(sid, entries)
            except requests.RequestException as exc:
                print(f"    erreur {sid}: {exc}", file=sys.stderr)

    if not entries and not studies:
        print("Aucun PGN collecté.", file=sys.stderr)
        return 1

    write_catalog(entries, studies)
    return 0


if __name__ == "__main__":
    sys.exit(main())
