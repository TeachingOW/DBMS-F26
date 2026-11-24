# DBMS Fall 2026 teaching materials

Static course site with 126 SQL slides, 42 aligned/quick labs, 22 advanced SQL slides, MongoDB, the lecture library, a 32-meeting course plan, and ten editable JSON decks (968 slides).

## Start locally

Run `python -m http.server 8000 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:8000/`. Use HTTP for editable decks because they load JSON with fetch.

- [Course plan](course-plan.html): 32 meetings, 11 supplemental exercise pages and project milestones.
- [Lecture library](lectures/library/index.html): published PowerPoints and rendered browser slides.
- [Editable presentations](presentations/editable/index.html): editable JSON previews with plain-text/table views. Complex geometry and animations remain approximate; use the lecture library or original PowerPoint for visual reference.
- [SQL presentation](index.html) and [MongoDB presentation](mongodb.html).

## Choose the matching SQL fixture

Use PostgreSQL 16+ and a disposable teaching database.

| Material | Setup | Behavior |
| --- | --- | --- |
| Original SQL slide examples | `demo-database.sql` or the slide-specific download in `databases/` | Combined setup separates incompatible slide schemas; standalone subsets use the current schema. |
| Aligned/quick labs and advanced SQL | `lab-database.sql` | Shared practice data in `lab_practice`; the inline setup and download buttons use this fixture. |
| Semester exercises | `labs/semester/setup.sql` | Creates `course32` once and refuses an existing schema. |
| Performance exercises | `labs/semester/performance-setup.sql` | Run after the semester setup; creates 100,000 purchases. |

After loading a fixture, run examples in the same session or explicitly select its search path. Slide subsets and the combined slide setup are repeatable and replace their teaching objects. The practice reset replaces teaching tables only in `lab_practice`. Semester exercises have their own fixture; do not mix the datasets. Existing MySQL/MariaDB source lectures retain their original dialect.

The booking starter needs Python and `psycopg[binary]`, plus a full PostgreSQL server. Configure connection details through environment variables; do not commit credentials.

## Questions

The SQL Questions panel supports slide-specific Giscus/Disqus discussions and private notes stored on the current device. `questions-config.js` contains public service identifiers, not credentials. Shared-service posting is not part of the automated tests; those tests stub remote scripts and exercise the local UI and mapping.

## Editing

- `python scripts/build-course-plan.py` regenerates the student plan/exercises. Instructor guides, reference answers, and stored-program solutions are deliberately excluded from both the output and generator.
- Edit `lectures/14_MongoDB.pptx`, then run `python scripts/generate-mongodb-slides.py`. Use `--check` for drift checking.
- The lecture-library renderer uses LibreOffice and Python packages listed in `scripts/generate-lecture-library.py`; preserve the original organized source catalog when regenerating.
- The [portable PPTX pipeline](docs/deck-pipeline.md) separates immutable extraction, proposed/accepted corrections, reviewed builds, authored compositions, and disposable renders. It uses the Python standard library. Agent invocation is explicit and never approves its own proposals.
- Source notes are included by the pipeline unless `--exclude-speaker-notes` is set. Review notes before publication. Private workspaces, logs, and original QA source snapshots are not part of this site.
- Existing course-specific repairs are preserved in `content/legacy-overrides/`; migration to formal reviewed correction records remains open.
- If `lab-database.sql` changes, regenerate `lab-database.js` with `python scripts/build-lab-setup.py`.

## Validation and development

See [consolidation decisions and evidence](docs/consolidation-f26.md) and [QA instructions](qa/README.md).

```text
python -m unittest discover -s scripts -p "test_*.py" -v
python scripts/validate_site.py
python scripts/generate-mongodb-slides.py --check
```

Development branch: `consolidate-f26`, proposed against `main`. Publishing to `gh-pages` is a separate release action. This consolidation does not merge or deploy either branch.
