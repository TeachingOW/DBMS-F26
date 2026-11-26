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

TEXT_MEDIA = {
    "0463c5d2459347f1dbad48a887426897d5bd3828a54c566573876caf183045a5.png": {
        "title": "1. Introduction to Window Functions",
        "lines": ["Window functions compute values across related rows while preserving each individual row in the result."],
        "font": "Arial",
        "size": "1800",
    },
    "46547036dfadff217bb00fb9d6e8fd972e1b0e5aa67d85fabad1339619212122.png": {
        "title": "Aggregates Called as Normal Functions",
        "lines": ["Rows are sorted into groups.", "A normal aggregate returns one result row for each group.", "Example: GROUP BY x with an aggregate produces one aggregate value per distinct x."],
        "font": "Arial",
        "size": "1700",
    },
    "be1ba3d6bf43579449e2bde164fd06c2cc57b19da34a3783ba1cf93e713e48f3.png": {
        "title": "Aggregates Called as Window Functions",
        "lines": ["Rows remain individually visible.", "A window aggregate calculates across related rows and repeats the result alongside each input row.", "The window result does not collapse the rows into one row per group."],
        "font": "Arial",
        "size": "1700",
    },
    "07f0a265a5b690592385d7fae9a37d715a3ee3b1e9557868542f90163022ead8.png": {
        "title": "2. Window Function Syntax",
        "lines": ["The OVER clause defines the window used by a window function.", "PARTITION BY divides rows into independent partitions.", "ORDER BY establishes row order within each partition.", "A frame clause selects the rows around the current row."],
        "font": "Arial",
        "size": "1700",
    },
    "52c45360ca7d40397a67d5691df2be1574fb2862c912d6ccb1a0896b19c9667d.png": {
        "title": "Visual Window Terms",
        "lines": ["Example ordered values: 1, 1, 2, 2, 3, 3, 4, 4, 5, 5.", "Current row: the row being evaluated.", "Peers: rows with the same ORDER BY value.", "Window frame: the subset selected by the frame clause.", "Partition: all rows in the current PARTITION BY group."],
        "font": "Arial",
        "size": "1650",
    },
    "7503be6105f8b6c6f493ee557a2cdb50dff28e4fcb37b61189dcfa353ad48dac.png": {
        "title": "SQL for Window Frames",
        "lines": ["ROWS CURRENT ROW AND CURRENT ROW — end-frame default", "ORDER BY x RANGE CURRENT ROW", "ROWS UNBOUNDED PRECEDING", "ORDER BY x RANGE UNBOUNDED PRECEDING", "ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING"],
        "bullet": True,
        "font": "Consolas",
        "size": "1550",
    },
    "847a952640b77de00cf9a751b44ffbe5ef69f39f75ddbbde2fceac7c3a69e36f.png": {
        "title": "3. Window Syntax with Generic Aggregates",
        "lines": ["Generic aggregate functions such as SUM, AVG, MIN, MAX, and COUNT become window functions when followed by an OVER clause."],
        "font": "Arial",
        "size": "1800",
    },
    "3ac6c053a8ec208d861f3d3481c41f2ef2eac66550d34db11bc108d31507664d.png": {
        "title": "4. Window-Specific Functions",
        "lines": ["Window-specific functions include ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, FIRST_VALUE, LAST_VALUE, and NTH_VALUE."],
        "font": "Arial",
        "size": "1800",
    },
    "41931ab340f2905c615b111b4ff9b8a3f16152ab65a93973312de6240008d8c9.png": {
        "title": "5. Window Function Examples",
        "lines": ["The following examples combine partitions, ordering, frames, ranking, row access, and aggregate window functions."],
        "font": "Arial",
        "size": "1800",
    },
    "1801a9433f7c373edcbca2fb869f6a51b982429b1f18cc68f22754d176072973.png": {
        "title": "6. Considerations",
        "lines": ["Choose partitions and ordering deliberately.", "Check the default frame before using FIRST_VALUE, LAST_VALUE, or NTH_VALUE.", "Consider ties, NULL ordering, and whether the database supports the requested frame syntax."],
        "font": "Arial",
        "size": "1700",
    },
    "fe34ddefcb4d3e8f8f87169d9ca4fe582b9b8cb954a55d2cb1559013e5b8fd74.png": {
        "lines": ["C", "C++", "Erlang", "Haskell", "Java", "Javascript", ".NET (C# F#, PowerShell, etc)", "Node.js", "Perl", "PHP", "Python", "Ruby", "Scala"],
        "bullet": True,
        "font": "Arial",
        "size": "1350",
    },
    "3000fa9e68c49dfb5489133e34766f660b627bc23f2c33628ff15e8043b0b95e.png": {
        "lines": ["CREATE TABLE users (", "  id MEDIUMINT NOT NULL", "    AUTO_INCREMENT,", "  user_id VARCHAR(30),", "  age NUMBER,", "  status CHAR(1),", "  PRIMARY KEY (id)", ")"],
        "font": "Consolas",
        "size": "1100",
    },
    "28e1228aa05d5b184fce34438ffc304e6dae3bf08a82c49a99a88d23eac27b58.png": {
        "lines": ["db.users.insert({", "  user_id: \"abc123\",", "  age: 55,", "  status: \"A\"", "})"],
        "font": "Consolas",
        "size": "1100",
    },
    "ca1d731c5b429c9701fee0c999de75ff9ee3af63d84cf4e6245be317cc8b02d0.png": {
        "lines": ["db.createCollection(\"users\")"],
        "font": "Consolas",
        "size": "1100",
    },
    "eeae385a0da30543701551c71b96c1e11915ba0b2657e2b55de8cef6b8aebae4.png": {
        "lines": ["db.users.drop()"],
        "font": "Consolas",
        "size": "1100",
    },
    "3c65ccdac3c52de5e6357d8ce5b5fb0bc5f5b91e725b76e890c7e816852007bd.png": {
        "lines": ["DROP TABLE users;"],
        "font": "Consolas",
        "size": "1100",
    },
    "a46c6ebdd016cb5d699decab0384770e074d6c3d5f72bcac8b31ddeb181455fd.png": {
        "lines": ["db.inventory.insert(mydocuments);"],
        "font": "Consolas",
        "size": "1200",
    },
    "4165c724a9bb301a5a49a219f063dbc09864eb9ac40d3d1938b3476d922f65da.png": {
        "lines": ["For the document with item equal to \"MNO2\", use the $set operator to update the category and details fields, and use $currentDate to update lastModified with the current date."],
        "font": "Arial",
        "size": "1350",
    },
    "a03e91c5374716bf01bf9893a5e490436a83b1e7aa117d9c6efbcdbd125422ab.png": {
        "lines": ["Definition. A relation schema R is in BCNF if whenever a nontrivial functional dependency X → A holds in R, then X is a superkey of R."],
        "font": "Arial",
        "size": "1350",
    },
    "2895ef19a1a4c32be38b6d5a0be97fc710db855c5b48011452ec9a2bcf18fb02.png": {
        "lines": ["Definition. A relation schema R is in third normal form (3NF) if, whenever a nontrivial functional dependency X → A holds in R, either (a) X is a superkey of R, or (b) A is a prime attribute of R."],
        "font": "Arial",
        "size": "1350",
    },
    "830afc08934eafc63b5c5344d275692846c3d3b3f5dfe8b09ec140d5c118d011.png": {
        "lines": ["Definition. A relation schema R is in second normal form (2NF) if every non-prime attribute A in R is not partially dependent on any key of R."],
        "font": "Arial",
        "size": "1350",
    },
    "17777ff9dc1e9220997db63d1a3ab6e2502555b90758084c291d754f8c87094f.png": {
        "lines": [
            "Consider a social network database about people and their relationships. The database has two relations:",
            "Person(pid, name)",
            "Relationship(pid1, rel, pid2)",
            "Person.pid is a key. Relationship.pid1 and Relationship.pid2 are foreign keys; rel represents the relationship type and may be friend or enemy. The relationship is not necessarily symmetric.",
            "(a) (10 points) Write the SQL statements that define the relational schema. Assume pid values are integers, and name and rel are character strings.",
        ],
        "font": "Arial",
        "size": "1150",
    },
}


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


def convert_text_media(value: object) -> None:
    if isinstance(value, list):
        for item in value:
            convert_text_media(item)
        return
    if not isinstance(value, dict):
        return
    media_name = Path(str(value.get("media_src", ""))).name
    replacement = TEXT_MEDIA.get(media_name)
    if replacement:
        lines = ([replacement["title"]] if replacement.get("title") else []) + replacement["lines"]
        value.pop("media_src", None)
        value.pop("media_content_type", None)
        value.pop("crop", None)
        value["kind"] = "text"
        value["object_type"] = "sp"
        value["paragraphs"] = lines
        value["rich_paragraphs"] = [
            {
                "text": line,
                "level": 0,
                "alignment": None,
                "runs": [
                    {
                        "text": line,
                        "style": {
                            "sz": "3000" if replacement.get("title") and index == 0 else replacement["size"],
                            "font": replacement["font"],
                            "color": {"type": "srgbClr", "value": "111111"},
                            "bold": bool(replacement.get("title") and index == 0),
                        },
                    }
                ],
                "paragraph_format": {"spcAft": {"spcPts": "300"}},
                "bullet": {
                    "type": "char" if replacement.get("bullet") and not (replacement.get("title") and index == 0) else "none",
                    "value": "•" if replacement.get("bullet") and not (replacement.get("title") and index == 0) else None,
                    "source": "generated-text-media",
                },
            }
            for index, line in enumerate(lines)
        ]
        value["text_box"] = {
            "anchor": "t",
            "lIns": "60000",
            "rIns": "60000",
            "tIns": "30000",
            "bIns": "30000",
            "auto_fit": "normAutoFit",
        }
    for child in value.values():
        convert_text_media(child)


def generate() -> dict[Path, str]:
    site = json.loads(SITE_PATH.read_text())
    site["routes"]["index.html"] = HOME_ROUTE
    decks = {
        path: json.loads(path.read_text().replace(LEGACY_MEDIA_PREFIX, DECK_MEDIA_PREFIX))
        for path in sorted(DECKS_DIR.glob("*.json"))
    }
    for deck in decks.values():
        for slide in deck.get("slides", []):
            source = json.dumps(slide)
            for media_name, replacement in TEXT_MEDIA.items():
                if replacement.get("title") and media_name in source:
                    slide["title"] = replacement["title"]
                    break
        convert_text_media(deck)
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


def walk_objects(values: list[object]):
    for value in values:
        if not isinstance(value, dict):
            continue
        yield value
        yield from walk_objects(value.get("children", []))


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
        slide_size = deck.get("slide_size_emu", {})
        slide_area = slide_size.get("width", 0) * slide_size.get("height", 0)
        full_slide_media = []
        if slide_area:
            for slide in deck.get("slides", []):
                for block in walk_objects(slide.get("content", [])):
                    bounds = block.get("bounds_emu", {})
                    coverage = bounds.get("width", 0) * bounds.get("height", 0) / slide_area
                    if block.get("media_src") and coverage >= 0.9:
                        full_slide_media.append(slide.get("number"))
        if full_slide_media:
            errors.append(f"{path.name}: contains {len(full_slide_media)} full-slide media objects")

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
