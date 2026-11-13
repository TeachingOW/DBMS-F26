"""Generate static HTML lecture decks from the organized PowerPoint files."""

import argparse
import csv
import html
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import pypdfium2
from pypdf import PdfReader


SITE = Path(__file__).resolve().parent.parent
OUTPUT = SITE / "lectures" / "library"
REL_ID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def read_xml(archive, name):
    return ET.fromstring(archive.read(name))


def powerpoint_slides(path):
    with ZipFile(path) as archive:
        presentation = read_xml(archive, "ppt/presentation.xml")
        relations = {
            item.get("Id"): item.get("Target")
            for item in read_xml(archive, "ppt/_rels/presentation.xml.rels")
        }
        result = []
        for slide in presentation.findall("./{*}sldIdLst/{*}sldId"):
            target = relations[slide.get(REL_ID)]
            root = read_xml(archive, target.lstrip("/") if target.startswith("/") else f"ppt/{target}")
            paragraphs = []
            for paragraph in root.findall(".//{*}p"):
                text = "".join(item.text or "" for item in paragraph.findall("./*/{*}t"))
                if text.strip():
                    paragraphs.append(text.strip())
            result.append({"hidden": root.get("show") in {"0", "false"}, "text": "\n".join(paragraphs)})
        return result


def web_links(page):
    links = []
    for reference in page.get("/Annots") or []:
        action = reference.get_object().get("/A")
        if not action:
            continue
        url = str(action.get("/URI") or "")
        parsed = urlsplit(url)
        if parsed.scheme in {"http", "https"} and parsed.netloc and url not in links:
            links.append(url)
    return links


def document(title, body, assets=""):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} · DBMS-F26</title>
  <link rel="stylesheet" href="{assets}library.css">
</head>
<body>
{body}
</body>
</html>
"""


def deck_page(topic, pptx):
    return document(topic, f"""<main class="lecture">
  <nav aria-label="Course navigation">
    <a href="../index.html">All lectures</a>
    <a href="{html.escape(pptx)}" download>Download PowerPoint</a>
  </nav>
  <h1>{html.escape(topic)}</h1>
  <div class="slide-controls" aria-label="Slide controls">
    <button type="button" data-prev>Previous</button>
    <form data-jump>
      <label for="slide-number">Slide</label>
      <input id="slide-number" type="number" min="1" value="1" required>
      <span data-total></span>
      <button type="submit">Go</button>
    </form>
    <button type="button" data-next>Next</button>
  </div>
  <p class="status" data-status role="status"></p>
  <figure>
    <img data-slide alt="">
    <figcaption data-caption></figcaption>
  </figure>
  <details data-transcript>
    <summary>Slide text and links</summary>
    <p class="transcript" data-text></p>
    <ul data-links></ul>
  </details>
  <noscript>Enable JavaScript to navigate the slides, or download the PowerPoint above.</noscript>
</main>
<script src="slides.js"></script>
<script src="../viewer.js"></script>""", "../")


def build_deck(source, topic, pdf_dir, titles):
    slides = powerpoint_slides(source)
    deck_dir = OUTPUT / source.stem
    images = deck_dir / "slides"
    images.mkdir(parents=True, exist_ok=True)
    pptx = "../" + ("14_MongoDB_Full.pptx" if source.stem == "14_MongoDB" else source.name)
    shutil.copyfile(source, deck_dir / pptx)
    pdf_file = pdf_dir / (source.stem + ".pdf")
    pdf = pypdfium2.PdfDocument(pdf_file)
    annotations = PdfReader(pdf_file).pages
    if len(pdf) != len(slides):
        raise ValueError(f"{source.name}: {len(slides)} PowerPoint slides, {len(pdf)} rendered")
    for index, slide in enumerate(slides):
        page = pdf[index]
        bitmap = page.render(scale=1440 / page.get_width())
        image = bitmap.to_pil().convert("RGB")
        image.save(images / f"{index + 1:03}.webp", "WEBP", quality=88, method=4)
        slide["title"] = titles.get(index + 1) or f"Slide {index + 1}"
        slide["width"], slide["height"] = image.size
        if not slide["text"]:
            text_page = page.get_textpage()
            slide["text"] = text_page.get_text_range().strip()
            text_page.close()
        slide["links"] = web_links(annotations[index])
        bitmap.close()
        page.close()
    pdf.close()
    for image_file in images.glob("*.webp"):
        if int(image_file.stem) > len(slides):
            image_file.unlink()
    (deck_dir / "slides.js").write_text(
        "window.lectureSlides = " + json.dumps(slides, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    (deck_dir / "index.html").write_text(deck_page(topic, pptx), encoding="utf-8")
    print(f"{topic}: {len(slides)} slides", flush=True)
    return len(slides), pptx.removeprefix("../")


def build_library(source, pdf_dir):
    with (source / "topic-map.csv").open(encoding="utf-8-sig", newline="") as stream:
        topics = [row for row in csv.DictReader(stream) if row["file"] != "02_SQL.pptx"]
    titles = {}
    with (source / "slide-index.csv").open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            titles.setdefault(row["module"], {})[int(row["output_slide"])] = row["title"]
    if not topics:
        raise ValueError("No lecture topics found")
    cards = []
    for row in topics:
        deck = source / row["file"]
        topic = row["topic"] + (" (full lecture)" if deck.stem == "14_MongoDB" else "")
        count, pptx = build_deck(deck, topic, pdf_dir, titles.get(deck.stem, {}))
        cards.append(f"""    <li>
      <h2>{html.escape(topic)}</h2>
      <p>{html.escape(row["focus"])}.</p>
      <p><a href="{deck.stem}/index.html">Open slides</a>
        <a href="{pptx}" download>PowerPoint</a>
        <span>{count} slides</span></p>
    </li>""")
    body = """<main class="catalog">
  <nav aria-label="Course navigation">
    <a href="../../index.html">SQL presentation</a>
    <a href="../../mongodb.html">MongoDB lab presentation</a>
  </nav>
  <h1>Database lectures</h1>
  <p>Open a lecture in your browser or download its PowerPoint.</p>
  <ol class="lecture-list">
""" + "\n".join(cards) + """
  </ol>
</main>"""
    (OUTPUT / "index.html").write_text(document("Database lectures", body), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Organized Lectures folder")
    parser.add_argument("--pdf-dir", type=Path, help="Use pre-rendered PDFs from the same PowerPoint files")
    args = parser.parse_args()
    if args.pdf_dir:
        build_library(args.source, args.pdf_dir)
    else:
        decks = sorted(p for p in args.source.glob("*.pptx") if re.match(r"\d\d_", p.name) and p.name != "02_SQL.pptx")
        with tempfile.TemporaryDirectory(prefix="dbms-lectures-") as tmp:
            subprocess.run([
                "soffice", "--headless", "--convert-to",
                'pdf:impress_pdf_Export:{"ExportHiddenSlides":{"type":"boolean","value":"true"}}',
                "--outdir", tmp, *decks,
            ], check=True)
            build_library(args.source, Path(tmp))


if __name__ == "__main__":
    main()
