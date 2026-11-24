"""Build a text-matched WebP vs editable-render review page for a PPTX deck.

The normalization library exports animation/build frames as separate WebP files,
so reference frame numbers do not necessarily match PowerPoint slide numbers.
This utility aligns slides by extracted text and preserves sequence order.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pptx_to_json


def clean(value: str) -> str:
    value = pptx_to_json.normalize_symbols(value or "")
    value = value.replace("–", "-").replace("—", "-").replace("’", "'")
    return re.sub(r"\s+", " ", value).strip().lower()


def slide_text(blocks: list[dict]) -> str:
    parts: list[str] = []
    for block in blocks:
        if block.get("paragraphs"):
            parts.extend(block["paragraphs"])
        elif block.get("rich_paragraphs"):
            parts.extend(p.get("text", "") for p in block["rich_paragraphs"])
        for row in block.get("rows", []):
            parts.extend(row)
        parts.append(slide_text(block.get("children", [])))
    return clean(" ".join(parts))


def similarity(source: dict, reference: dict) -> float:
    src = clean(f"{source.get('title', '')} {slide_text(source.get('content', []))}")
    ref = clean(f"{reference.get('title', '')} {reference.get('text', '')}")
    st, rt = set(re.findall(r"[\w]+|->|→", src)), set(re.findall(r"[\w]+|->|→", ref))
    overlap = len(st & rt)
    precision = overlap / max(1, len(rt))
    recall = overlap / max(1, len(st))
    f1 = 2 * precision * recall / max(1e-9, precision + recall)
    title_score = SequenceMatcher(None, clean(source.get("title", "")), clean(reference.get("title", ""))).ratio()
    return 0.85 * f1 + 0.15 * title_score


def align(slides: list[dict], frames: list[dict]) -> list[tuple[int, float]]:
    """Max-score monotonic alignment; frames between matches represent builds."""
    scores = [[similarity(s, f) for f in frames] for s in slides]
    n, m = len(slides), len(frames)
    dp = [[float("-inf")] * m for _ in range(n)]
    back = [[-1] * m for _ in range(n)]
    for j in range(m):
        dp[0][j] = scores[0][j] + j * 1e-9  # tie-break toward the completed/later build
    for i in range(1, n):
        best_value, best_idx = float("-inf"), -1
        for j in range(m):
            if j:
                previous = dp[i - 1][j - 1]
                if previous >= best_value:
                    best_value, best_idx = previous, j - 1
            if best_idx >= 0:
                dp[i][j] = best_value + scores[i][j] + j * 1e-9
                back[i][j] = best_idx
    j = max(range(m), key=lambda k: dp[n - 1][k])
    result = [(0, 0.0)] * n
    for i in range(n - 1, -1, -1):
        result[i] = (j, scores[i][j])
        j = back[i][j] if i else -1
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pptx", type=Path, default=Path("../slides/DB_Design.pptx"))
    parser.add_argument("--library", type=Path, default=Path("lectures/library/05_Normalization"))
    parser.add_argument("--output", type=Path, default=Path("qa/visual-review"))
    parser.add_argument("--deck-url", default="../../presentations/editable/db-design/index.html")
    args = parser.parse_args()

    deck = pptx_to_json.extract(args.pptx.resolve(), include_speaker_notes=False)
    js = (args.library / "slides.js").read_text(encoding="utf-8")
    frames = json.loads(js.split("=", 1)[1].strip().rstrip(";"))
    pairs = align(deck["slides"], frames)
    args.output.mkdir(parents=True, exist_ok=True)

    report = []
    for slide, (frame_idx, score) in zip(deck["slides"], pairs):
        confident = score >= 0.72
        report.append({
            "pptx_slide": slide["number"],
            "title": slide["title"],
            "webp_frame": frame_idx + 1 if confident else None,
            "webp_file": f"{frame_idx + 1:03}.webp" if confident else None,
            "candidate_webp_frame": frame_idx + 1,
            "match_score": round(score, 4),
            "review": "strong" if score >= 0.82 else ("review" if confident else "no-confident-match"),
        })
    (args.output / "db-design-map.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    options = "".join(
        f'<option value="{r["pptx_slide"]}">Slide {r["pptx_slide"]}: '
        f'{html.escape(r["title"])} — '
        f'{("WebP " + str(r["webp_frame"])) if r["webp_frame"] else "no confident WebP match"} '
        f'({r["match_score"]:.2f})</option>' for r in report
    )
    html_doc = f'''<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DB Design visual comparison</title>
<style>
*{{box-sizing:border-box}}body{{margin:0;font:15px/1.4 system-ui,sans-serif;color:#1a211d;background:#edf0ed}}
header{{padding:12px 18px;background:#fff;border-bottom:1px solid #cbd2cc;display:flex;gap:16px;align-items:center;flex-wrap:wrap}}
select,button{{font:inherit;padding:6px}}#meta{{margin-left:auto;color:#53645a}}main{{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;height:calc(100vh - 78px)}}
section{{background:#fff;min-width:0;display:flex;flex-direction:column;border:1px solid #cbd2cc}}h2{{font-size:14px;margin:0;padding:7px 10px;border-bottom:1px solid #d8ded9}}
img,iframe{{width:100%;height:100%;border:0;object-fit:contain}}@media(max-width:800px){{main{{grid-template-columns:1fr;height:auto}}section{{height:70vh}}}}
</style><header><b>Source WebP vs editable render</b><select id="slide">{options}</select>
<span id="meta"></span><a id="open" target="_blank">Open slide</a></header>
<main><section><h2 id="sourceTitle"></h2><img id="source"></section>
<section><h2>Editable JSON rendering</h2><iframe id="render"></iframe></section></main>
<script>
const pairs={json.dumps(report, ensure_ascii=False)};const base={json.dumps(args.deck_url)};
const select=document.querySelector('#slide');const requested=Number(new URLSearchParams(location.search).get('slide'));if(requested&&pairs.some(x=>x.pptx_slide===requested))select.value=String(requested);function show(){{const r=pairs.find(x=>x.pptx_slide===Number(select.value));
document.querySelector('#sourceTitle').textContent=r.webp_frame?`Matched source WebP frame ${{r.webp_frame}}: ${{r.title}}`:`No confident source match for slide ${{r.pptx_slide}}; candidate WebP ${{r.candidate_webp_frame}} requires manual review`;
document.querySelector('#meta').textContent=`Text match ${{r.match_score.toFixed(2)}} · ${{r.review}}`;
document.querySelector('#source').src=r.webp_file?`../../${{"lectures/library/05_Normalization/slides/"}}${{r.webp_file}}`:'';
document.querySelector('#render').src=`${{base}}?slide=${{r.pptx_slide}}${{r.webp_frame?`&compare=${{r.webp_frame}}`:''}}`;
document.querySelector('#open').href=`${{base}}?slide=${{r.pptx_slide}}`;}}select.onchange=show;show();
</script>'''
    (args.output / "db-design.html").write_text(html_doc, encoding="utf-8")
    weak = [r for r in report if r["review"] != "strong"]
    print(f"Matched {len(report)} PPTX slides to {len(frames)} WebP frames; {len(weak)} need manual text-match review.")
    for r in weak[:12]:
        print(f"slide {r['pptx_slide']:>2} -> candidate {r['candidate_webp_frame']:>3}: {r['match_score']:.2f} {r['title']}")
    print(args.output / "db-design.html")


if __name__ == "__main__":
    main()
