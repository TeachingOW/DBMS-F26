# Fall 2026 consolidation

## Source relationships

Inspected on 2026-11-24. The chat directory had no source folders. The requested three siblings were found in `OneDrive - SUNY Old Westbury/Teaching/Teaching F26/dbms/`. The new repository is an independent full clone in this chat's `outputs/DBMS-F26-consolidated`, outside OneDrive.

| Source | HEAD / branch | Relationship and working changes |
| --- | --- | --- |
| DBMS-F26 | `9a87d72`, `course-32-meetings` | Owns the shared `.git` directory; four tracked navigation/README edits plus untracked course plan, semester labs, JSON previews, extraction scripts and cache. Local `main` is also at `9a87d72`, two commits behind remote main. |
| DBMS-F26-pptx-layer | `ffd0624`, `pptx-json-content-layer` | Linked worktree under the first repository's `.git/worktrees`. Six tracked modifications: README, schema docs, extractor, DB-design canonical/mirror JSON and viewer. Untracked portable pipeline, tests, templates, legacy repairs, media, TODO and QA artifacts. |
| DBMS-F26-preview | `b0d923f`, `er-modeling-slide56-preview` | Linked worktree sharing the same repository/remotes; clean, and exactly at remote gh-pages. |

All originals use `https://github.com/TeachingOW/DBMS-F26.git`; their shared origin is configured as a partial clone (`blob:none`). The new clone has its own Git metadata and does not use those worktree references. No fetch, checkout, reset, clean, add, commit, or file write was performed in an original folder. Rehashed 5,109 inventoried source files: zero changed (Python cache files were excluded from the inventory).

## Remote comparison and base

- `main`: `74f1cb807171974debb2307c332d95c6dc2acf35` — course plan and student labs, plus deliberate removal of three instructor solution files.
- `pptx-json-content-layer`: `ffd06245bfb9254b034d35ad1ed22b29c45c86bf` — descendant of main, 22 additional commits for JSON extraction and editable previews. Chosen as the `consolidate-f26` base because it already contains the current student course content and solution removals.
- `gh-pages`: `b0d923f4755b8f7d74366669fbec4f9fc5ba93ae` — separate history with no common merge base with main (9 versus 26 commits). Its SQL datasets, table layout and questions are unique. Matching JSON/deck content was already in the PPTX branch; development pipeline sources were absent there. Its publication history was not merged.

The original shared origin/gh-pages tracking ref was stale at `5db0146`; the independent clone used the actual remote tip above.

## Semantic decisions

1. Kept main's 32-meeting plan, 11 student exercise pages, fixtures, performance dataset, booking starter, lecture library and published PowerPoints. Local course-folder copies are equivalent except trailing whitespace, obsolete extraction output and excluded solutions. Its older JSON text is retained by the richer branch except corrected DB-design extraction/normalization, whose reviewed local version was kept.
2. Incorporated the local portable pipeline, review protocol, authored composition protections, agent adapter, regression tests, templates and workflow/schema documentation. Preserved legacy diagram/title repairs separately rather than automatically applying them to arbitrary presentations. Kept the local DB-design viewer's intentional slide-68 teaching layout.
3. Imported gh-pages' interactive questions, public provider configuration, source table layout, slide-specific downloads and exact SQL datasets. Its original SQL data differs only in line endings from the development copy, so there was no content replacement to adjudicate.
4. Resolved the SQL schema conflict by keeping both exact slide fixtures and the older shared lab fixture. `lab-database.sql` creates/selects `lab_practice`; lab/advanced setup controls use its matching inline copy. Semester exercises remain in `course32`. Replacing all datasets with either branch's version would break examples.
5. Restored media and repaired picture relationships using matching source slide counts, shape IDs/names and source OOXML relationships. Existing asset bytes were verified before reuse. Source filenames and SHA-256 hashes are recorded in `qa/media-provenance.json`; no additional original PowerPoints were published. TIFFs retain their originals and have PNG browser derivatives. There are 225 referenced browser assets across ten decks.
6. Removed the embedded instructor guide from the course generator, removed links to withheld files, and retained student programming requirements. Added ignore rules against accidentally reintroducing private outputs.
7. Corrected the extractor's system-color fallback (`lastClr`), refreshed the matching DB-design palette, allowed dense positioned decks to retain their geometry, and added a plain-text/table view to each editable deck. Did not invent animation states or rewrite source wording to hide remaining fidelity limits.

## Excluded content

The exact list is `qa/excluded-files.json` (47 paths). It includes:

- `labs/semester/instructor-guide.html`, `programming.sql`, and `reference-queries.sql` from the older course folder.
- QA raw/source snapshots, agent prompts/requests/responses/run logs, local review state, DOM captures, screenshots and disposable generated preview pages. Kept the portable QA tooling, source-alignment map and written findings; generated fresh validation evidence.
- Python caches are omitted and ignored. No credentials, private assignments, grades, exams or sibling private course directories were imported. Public Giscus/Disqus identifiers were retained. Existing published source notes remain; newly introduced private QA notes and absolute local paths were excluded.

This is a new development branch, not a rewrite of pre-existing repository history. Older historical commits already on GitHub are unchanged.

## Pipeline tests

20 Python tests pass: 18 imported pipeline/agent tests plus system-color fallback and public-site integrity regressions. A real 17-slide introduction was extracted without notes into the local scratch workspace and produced raw/candidate review pages. No automatic agent/model review was invoked. MongoDB source/generated-content `--check` passes.

## Slide rendering

Headless Chrome traversed all 126 SQL slides, the full 190-item SQL/lab/advanced sequence (45 dynamic resource links), and all 968 editable slides across ten decks, and rendered the MongoDB opening slide. No JavaScript exceptions, HTTP failures, empty editable slides or broken image decodes. Inspected screenshots of SQL 18/37/84/112, DB-design 15/31/68/80, ER 56 and introduction 1. The ER diagram now keeps its original positions and restored images. Plain-text views expose content that animation/style approximations can obscure.

This is functional coverage plus sampled visual review, not visual approval of every slide. Remaining problems include animation-dependent white text (DB-design slide 80), table typography/merged cells, some glyphs and complex geometry/stacking. Existing alignment findings flag ambiguous/mismatched reference frames; those findings are preserved in `qa/visual-review/findings.md`. Some source material still says Spring 2026; that historical wording was preserved pending an instructor content review.

## Links

84 actual HTML pages passed local file/anchor checks; templates and archived renderer examples are intentionally excluded from standalone-page checks. All canonical/mirror deck JSON pairs agree and all 225 referenced media files exist. Forty external links were checked: 34 returned success (including redirects); five MySQL URLs and LeetCode returned HTTP 403, so their destination content remains unverified. No false replacement was made for an access restriction.

## Questions

Browser tests pass for saving private notes, persistence after reload, isolation by slide, removal, safe display of HTML-like text, and Giscus slide-key configuration. Third-party scripts were stubbed; no question/comment was sent. Live Giscus/Disqus authentication, moderation and posting remain untested.

## SQL scripts

Executed the combined slide setup twice, all 14 standalone subsets twice, and compared all subset tables/rows to their combined-schema equivalents. The inline slide fixture matches its download. Executed semester setup and 100,000-row performance setup, checked fixture counts/account total and foreign-key rollback. Executed 78 lab/advanced SQL snippets in their intended per-lab sequence: 77 succeed; the final foreign-key exercise correctly rejects student 999. Reinstating the shared practice fixture was necessary for these results.

Execution engine: PGlite 0.6.0 reporting PostgreSQL 19.0/WASM. This validates SQL execution but is not a full PostgreSQL 16 server rehearsal. Two-session locking/deadlocks, Python psycopg connectivity, backup/restore and permission administration remain to be checked on a full server. Instructor solution scripts are intentionally neither published nor executed.

## Publication

Only `consolidate-f26` is intended to be pushed, with a draft pull request against `main`. Draft status preserves the visual-fidelity and full-server checks as explicit review work. No auto-merge, gh-pages update or deployment is part of this consolidation.
