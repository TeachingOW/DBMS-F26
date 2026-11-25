# DBMS Fall 2026 website

The student-facing website contains JSON content, shared browser renderers, media, and downloadable student materials. It has no authoring pipeline or build requirement.

Start with [Student materials](materials.html), [Course plan](course-plan.html), or the [SQL presentation](index.html). Existing URLs and slide bookmarks remain available.

## Content layout

- `content/site.json`: routes linking stable URLs to JSON documents, data, styles and renderer modules.
- `content/pages/`: structured nodes for navigation, handouts, labs, syntax references and presentation controls.
- `content/runtime/`: SQL slides, activities, notes, advanced slides, MongoDB, captions, syntax metadata and discussion configuration.
- `content/library/`: pointers to pinned reviewed lecture decks.
- `content/decks-json/`: 26 canonical source-reviewed decks (2,646 slides), with stable source identities, reviewed-version provenance and selectable text.
- `runtime/`, presentation controllers and CSS: rendering and interactions.
- Lecture, presentation, asset, lab and database directories: student downloads and media. HTML files are loading shells.

All 16 published PowerPoints, 18 SQL scripts and the Python booking starter remain downloadable. Library images remain visual references alongside editable decks. Instructor solutions are excluded.

## Running and editing

Serve this directory with any static HTTP server, for example `python -m http.server 8000 --bind 127.0.0.1`, and open `http://127.0.0.1:8000/materials.html`. JSON loading requires HTTP; direct `file://` loading is unsupported. Project subpaths are supported.

Edit JSON and reload; no HTML build is needed. SQL setup panels fetch the files students download. Original slide datasets, `lab_practice`, and `course32` exercises remain separate; use each activity's linked fixture. The booking starter requires psycopg and a PostgreSQL server.

## Authoring and QA

Tools, review pipelines, migration scripts and QA live in the private [TeachingOW/DBMS-teaching-materials](https://github.com/TeachingOW/DBMS-teaching-materials) repository. Students do not need access to it.

Presentation pages default to layouts rendered from JSON. A toggle exposes the lossless static PowerPoint references attached to reviewed JSON for comparison; those static exports do not play animations. Plain-text views retain the extracted source content, including Office math/alternate-content blocks. DB-design variants reuse reviewed base layouts where all text and table values match; their added teaching slides remain intact. Discussion providers are configured in JSON; private notes stay on the student's device.

The consolidation is proposed on `consolidate-f26` in [PR #5](https://github.com/TeachingOW/DBMS-F26/pull/5). The source-review migration is included on the same development branch. Publishing to gh-pages remains a separate action.
