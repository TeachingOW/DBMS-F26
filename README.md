# DBMS Fall 2026 website

The student-facing website contains JSON content, shared browser renderers, media, and downloadable student materials. It has no authoring pipeline or build requirement.

Start with [Student materials](materials.html), [Course plan](course-plan.html), or the [SQL presentation](index.html). Existing URLs and slide bookmarks remain available.

## Content layout

- `content/site.json`: routes linking stable URLs to JSON documents, data, styles and renderer modules.
- `content/pages/`: structured nodes for navigation, handouts, labs, syntax references and presentation controls.
- `content/runtime/`: SQL slides, activities, notes, advanced slides, MongoDB, captions, syntax metadata and discussion configuration.
- `content/library/`: pointers to pinned reviewed lecture decks.
- `content/decks-json/`: 16 canonical topic decks, with alternate source sequences combined, stable source provenance and selectable text.
- `runtime/`, presentation controllers and CSS: rendering and interactions.
- Lecture, presentation, asset, lab and database directories: student downloads and media. HTML files are loading shells.

The 18 SQL scripts and Python booking starter remain downloadable. Presentation pages render directly from canonical JSON; embedded teaching media is retained while full-slide PowerPoint reference images are excluded. Instructor solutions are excluded.

## Running and editing

Serve this directory with any static HTTP server, for example `python -m http.server 8000 --bind 127.0.0.1`, and open `http://127.0.0.1:8000/materials.html`. JSON loading requires HTTP; direct `file://` loading is unsupported. Project subpaths are supported.

Edit source files and reload; no HTML build is needed. Do not hand-edit generated JSON when a Python generator exists. SQL setup panels fetch the files students download. Original slide datasets, `lab_practice`, and `course32` exercises remain separate; use each activity's linked fixture. The booking starter requires psycopg and a PostgreSQL server.

For generated site JSON, edit `scripts/build_json_site.py` first and run `python3 scripts/build_json_site.py`. Use `python3 scripts/build_json_site.py --check` to detect generated-file drift. Canonical deck JSON is validated by the same command; its private PowerPoint extraction and source-review pipeline remains in `DBMS-teaching-materials`.

## Authoring and QA

Tools, review pipelines, migration scripts and QA live in the private [TeachingOW/DBMS-teaching-materials](https://github.com/TeachingOW/DBMS-teaching-materials) repository. Students do not need access to it.

Presentation pages use one shared JSON renderer. Alternate Introduction, ER, DB Design, Window Functions, Indexes and MongoDB decks are combined by topic, with source provenance recorded on appended slides. Plain-text views retain extracted source content, including Office math/alternate-content blocks. Discussion providers are configured in JSON; private notes stay on the student's device.

The consolidation is proposed on `consolidate-f26` in [PR #5](https://github.com/TeachingOW/DBMS-F26/pull/5). The source-review migration is included on the same development branch. Publishing to gh-pages remains a separate action.
