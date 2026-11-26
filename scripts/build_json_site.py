#!/usr/bin/env python3
"""Generate the public JSON course home and enforce JSON-slide site invariants.

Run this script before committing generated JSON changes. Use ``--check`` in CI
to verify that committed JSON matches the Python source of truth.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HOME_PATH = ROOT / "content/pages/index.json"
SITE_PATH = ROOT / "content/site.json"
DECKS_DIR = ROOT / "content/decks-json"
DECK_MEDIA_DIR = ROOT / "assets/deck-media"
MEDIA_REFERENCE = re.compile(r"assets/deck-media/[^\"\\s]+")
LEGACY_MEDIA_PREFIX = "assets/reviewed-media/"
DECK_MEDIA_PREFIX = "assets/deck-media/"
WINDOW_FUNCTIONS_PATH = DECKS_DIR / "lecture-06-window-functions.json"
LECTURE_INDEX_PATH = ROOT / "content/pages/lectures/library/index.json"
WINDOW_FUNCTIONS_AUTHORING_NOTE = "authored:1673261d7e4e4fd8aa3c2032c24b8729"


HOME_DOCUMENT = {
    "schemaVersion": 1,
    "title": "Database Management Systems · Fall 2026",
    "bodyAttributes": {},
    "nodes": [
        {
            "tag": "nav",
            "attrs": {"class": "home-nav", "aria-label": "Course navigation"},
            "children": [
                {"tag": "strong", "children": ["DBMS-F26"]},
                {"tag": "a", "attrs": {"href": "materials.html"}, "children": ["Student materials"]},
                {"tag": "a", "attrs": {"href": "lectures/library/index.html"}, "children": ["Lectures"]},
                {"tag": "a", "attrs": {"href": "course-plan.html"}, "children": ["Course plan"]},
                {"tag": "a", "attrs": {"href": "docs/GETTING_STARTED.html"}, "children": ["Database setup"]},
            ],
        },
        {
            "tag": "main",
            "attrs": {"class": "home"},
            "children": [
                {"tag": "h1", "children": ["Database systems"]},
                {
                    "tag": "p",
                    "attrs": {"class": "lede"},
                    "children": [
                        "Fall 2026 course materials for relational design, SQL, storage, query processing, transactions, and document databases."
                    ],
                },
                {
                    "tag": "div",
                    "attrs": {"class": "home-actions"},
                    "children": [
                        {"tag": "a", "attrs": {"href": "lectures/library/index.html"}, "children": ["Browse lecture topics"]},
                        {"tag": "a", "attrs": {"href": "materials.html", "class": "secondary"}, "children": ["Open all materials"]},
                    ],
                },
                {
                    "tag": "section",
                    "children": [
                        {"tag": "h2", "children": ["One sequence per topic"]},
                        {
                            "tag": "p",
                            "children": [
                                "Each lecture opens as a JSON-rendered slide sequence. Alternate source decks and labs are combined into the relevant topic instead of appearing as separate presentations."
                            ],
                        },
                    ],
                },
                {
                    "tag": "section",
                    "children": [
                        {"tag": "h2", "children": ["Course work"]},
                        {
                            "tag": "p",
                            "children": [
                                "Use Student materials for labs, datasets, handouts, and downloadable SQL. The course plan connects those activities to the lecture sequence."
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}


HOME_ROUTE = {
    "document": "content/pages/index.json",
    "styles": ["runtime/home.css"],
    "data": [],
    "scripts": [],
}


def serialized(value: object) -> str:
    return json.dumps(value, indent=2, ensure_ascii=False) + "\n"


def generate() -> dict[Path, str]:
    site = json.loads(SITE_PATH.read_text())
    site["routes"]["index.html"] = HOME_ROUTE
    decks = {
        path: json.loads(path.read_text().replace(LEGACY_MEDIA_PREFIX, DECK_MEDIA_PREFIX))
        for path in sorted(DECKS_DIR.glob("*.json"))
    }
    window_functions = decks[WINDOW_FUNCTIONS_PATH]
    window_functions["slides"] = [
        slide
        for slide in window_functions["slides"]
        if slide.get("id") != WINDOW_FUNCTIONS_AUTHORING_NOTE
    ]
    for number, slide in enumerate(window_functions["slides"], start=1):
        slide["number"] = number

    lecture_index = json.loads(LECTURE_INDEX_PATH.read_text())
    for node in walk_nodes(lecture_index["nodes"]):
        children = node.get("children")
        if children == ["235 slides"]:
            node["children"] = ["234 slides"]

    return {
        HOME_PATH: serialized(HOME_DOCUMENT),
        SITE_PATH: serialized(site),
        LECTURE_INDEX_PATH: serialized(lecture_index),
        **{path: serialized(deck) for path, deck in decks.items()},
    }


def walk_nodes(nodes: list[object]):
    for node in nodes:
        if not isinstance(node, dict):
            continue
        yield node
        yield from walk_nodes(node.get("children", []))


def validate_decks() -> list[str]:
    errors = []
    decks = sorted(DECKS_DIR.glob("*.json"))
    media_references: set[str] = set()
    if len(decks) != 16:
        errors.append(f"expected 16 canonical decks, found {len(decks)}")
    for path in decks:
        source = path.read_text()
        deck = json.loads(source)
        media_references.update(MEDIA_REFERENCE.findall(source))
        numbers = [slide.get("number") for slide in deck.get("slides", [])]
        if numbers != list(range(1, len(numbers) + 1)):
            errors.append(f"{path.name}: slide numbers are not contiguous")
        references = [
            slide.get("number")
            for slide in deck.get("slides", [])
            if slide.get("presentation", {}).get("reference")
        ]
        if references:
            errors.append(f"{path.name}: contains {len(references)} PowerPoint reference images")

    legacy_slide_dirs = sorted((ROOT / "lectures/library").glob("*/slides"))
    if legacy_slide_dirs:
        errors.append(f"found {len(legacy_slide_dirs)} obsolete full-slide image directories")
    if (ROOT / "assets/reviewed-media").exists():
        errors.append("obsolete assets/reviewed-media directory still exists")

    media_files = {
        path.relative_to(ROOT).as_posix()
        for path in DECK_MEDIA_DIR.iterdir()
        if path.is_file()
    }
    missing_media = sorted(media_references - media_files)
    unused_media = sorted(media_files - media_references)
    if missing_media:
        errors.append(f"canonical decks reference {len(missing_media)} missing media files")
    if unused_media:
        errors.append(f"deck-media contains {len(unused_media)} unreferenced files")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="report generated-file drift without writing")
    args = parser.parse_args()
    outputs = generate()
    drift = [path for path, expected in outputs.items() if not path.exists() or path.read_text() != expected]
    errors = validate_decks()
    if args.check:
        for path in drift:
            print(f"generated file is stale: {path.relative_to(ROOT)}")
        for error in errors:
            print(error)
        return 1 if drift or errors else 0
    for path, text in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        print(f"wrote {path.relative_to(ROOT)}")
    for error in errors:
        print(error)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
