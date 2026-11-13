"""Render the editable MongoDB PowerPoint text into the site's slide data."""

import argparse
import json
import posixpath
from pathlib import Path
import xml.etree.ElementTree as ET
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parent.parent
DECK = ROOT / "lectures" / "14_MongoDB.pptx"
OUTPUT = ROOT / "mongodb-content.js"
REL_ID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
PREFIX = (
    "// Generated from lectures/14_MongoDB.pptx by scripts/generate-mongodb-slides.py.\n"
    "window.DBMS_ADVANCED_SLIDES = window.DBMS_ADVANCED_SLIDES || {};\n"
    "window.DBMS_ADVANCED_SLIDES.mongodb = "
)


def xml(deck, part):
    return ET.fromstring(deck.read(part))


def relationships(deck, part):
    folder, name = posixpath.split(part)
    rels = posixpath.join(folder, "_rels", name + ".rels")
    if rels not in deck.namelist():
        return {}
    return {
        rel.get("Id"): (
            rel.get("Type").rsplit("/", 1)[-1],
            posixpath.normpath(posixpath.join(folder, rel.get("Target"))).lstrip("/"),
        )
        for rel in xml(deck, rels)
        if rel.get("TargetMode") != "External"
    }


def shape_text(shape):
    lines = []
    for paragraph in shape.findall("./{*}txBody/{*}p"):
        fragments = []
        for child in paragraph:
            if child.tag.endswith("}br"):
                fragments.append("\n")
            else:
                fragments.extend(node.text or "" for node in child.findall("./{*}t"))
        lines.append("".join(fragments))
    return "\n".join(lines)


def slide_data(deck, part, index):
    shapes = {}
    for shape in xml(deck, part).findall("./{*}cSld/{*}spTree/{*}sp"):
        properties = shape.find("./{*}nvSpPr/{*}cNvPr")
        if properties is not None:
            shapes[properties.get("name")] = shape_text(shape)

    notes = next((target for kind, target in relationships(deck, part).values()
                  if kind == "notesSlide"), None)
    section = "MongoDB"
    if notes:
        for shape in xml(deck, notes).findall(".//{*}sp"):
            for line in shape_text(shape).splitlines():
                if line.startswith("Section: "):
                    section = line.removeprefix("Section: ")

    try:
        title, lead, takeaway = (shapes[name] for name in ("Title", "Lead", "Result or takeaway"))
    except KeyError as exc:
        raise ValueError(f"Slide {index} is missing the {exc.args[0]!r} text box") from exc

    slide = {
        "id": f"mongodb-{index}", "section": section, "title": title, "lead": lead,
        "points": [shapes[name] for name in sorted(
            (name for name in shapes if name.startswith("Point ")),
            key=lambda name: int(name.removeprefix("Point ")),
        )],
        "takeaway": takeaway,
    }
    if "Runnable example" in shapes:
        slide["code"] = [{
            "label": shapes["Example label"],
            "language": "javascript",
            "text": shapes["Runnable example"],
        }]
    return slide


def render():
    with ZipFile(DECK) as deck:
        part = "ppt/presentation.xml"
        rels = relationships(deck, part)
        parts = [rels[slide.get(REL_ID)][1]
                 for slide in xml(deck, part).findall("./{*}sldIdLst/{*}sldId")]
        if not parts:
            raise ValueError("The PowerPoint has no slides")
        slides = [slide_data(deck, target, i) for i, target in enumerate(parts, 1)]
    return PREFIX + json.dumps(slides, ensure_ascii=False, indent=2) + ";\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if the generated file is stale")
    args = parser.parse_args()
    result = render()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != result:
            parser.exit(1, "mongodb-content.js differs from the PowerPoint. Regenerate it.\n")
    else:
        OUTPUT.write_text(result, encoding="utf-8")


if __name__ == "__main__":
    main()
