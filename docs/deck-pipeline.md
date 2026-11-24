# Portable deck pipeline

Requires Python 3.10+ and its standard library. Copy `scripts/pptx_to_json.py`, `scripts/deck_pipeline.py`, `scripts/agent_review.py`, and `scripts/templates/` together to use the tool with unrelated presentations. No course folders, source filenames, slide numbers, or installed PowerPoint application are required. The CLI can run from any working directory.

## Extract and inspect

```powershell
python scripts/pptx_to_json.py --workspace work extract "path/to/presentation.pptx" --deck example
python scripts/pptx_to_json.py --workspace work status example
python scripts/pptx_to_json.py --workspace work review example --output preview/review
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/preview/review/`. The page shows the raw extraction and current candidate, review status, a link to the original PPTX, and a JSON editor that downloads a correction. These previews are approximations; compare with the original PowerPoint before approving fidelity. Browser edits are drafts only and must be downloaded and submitted. Changing slides retains drafts in memory; reloading the page discards undownloaded drafts.

Input can also be a directory: extraction recursively finds all PPTX files, including SQL decks, and assigns IDs based on relative paths. Keep source paths and explicit single-file IDs stable. Identical sources and extractor versions reuse cached raw revisions. Run one writer per deck at a time; this is a local batch pipeline, not a distributed job service.

## Propose and decide

Get the stable slide ID from `status` or the review page, for example `example:256`. Export a complete corrected slide JSON from the editor, or prepare it with an agent. The `content` array is canonical; derived scene and diagram references are rebuilt. To change visible text, update the relevant `paragraphs`, `rich_paragraphs`, and runs consistently; changing only `title` does not change a positioned title object. Preserve media paths relative to the raw revision. This first version supports corrections using existing source media; add new media to an authored deck instead of changing raw data.

```powershell
python scripts/pptx_to_json.py --workspace work propose example example:256 --replacement correction.json --actor agent-name --reason "Correct text layout after checking the source"
python scripts/pptx_to_json.py --workspace work review example --output preview/review
python scripts/pptx_to_json.py --workspace work accept example example:256 --actor reviewer-name --reason "Compared with the original"
```

Use `reject` to discard a proposal and return to pending. Use `approve` for an unchanged raw slide after reviewing it. Both require `--actor` and `--reason`. Agent and human actions use the same protocol; the tool records the supplied identity but does not authenticate it. The separate `agent-review` command below launches an agent automatically.

## Invoke an agent

The default adapter invokes an installed, signed-in Codex CLI in read-only mode. It uses your configured model unless `--model` is specified. This can send slide content and inspected source evidence to the CLI's configured model provider and uses that provider's account/quota. Extraction alone never invokes a model.

```powershell
# Inspect the queue without launching an agent.
python scripts/pptx_to_json.py --workspace work agent-review example --dry-run --limit 5

# Actually launch Codex for up to five pending/conflicted slides, sequentially.
python scripts/pptx_to_json.py --workspace work agent-review example --limit 5 --timeout 300

# Refresh the browser page to inspect findings and proposed repairs.
python scripts/pptx_to_json.py --workspace work review example --output preview/review
```

The default limit is one slide. Use `--slide example:256` to select a specific slide; repeat the option to select several. Existing approved slides and saved proposals are not overwritten. Matching completed assessments are skipped on subsequent runs; `--force` repeats an assessment on an eligible pending/conflicted slide. Resolve or reject an existing proposal before requesting a new review of it.

Each invocation prepares a source/evidence packet, starts the agent process, validates its response, and imports a supported correction as a **proposal**. It never accepts or approves its own output. `no_change` and `needs_human` record findings while leaving the slide unresolved. Nonzero exits, malformed responses, unsupported visual-review claims, stale source/review state, and timeouts are recorded as failed runs without importing a proposal. A CLI invocation with any failed run exits nonzero.

Run files are retained under `work/decks/ID/agent-runs/RUN_ID/`: request, prompt, response schema, response, process logs, and run summary. Review history retains the imported finding and run location. Review findings are also displayed in the browser review page. Logs may contain source content.

For visual review, supply a reference manifest mapping stable slide IDs to images (paths relative to that manifest):

```json
{
  "example:256": {
    "original": "references/slide-1.png",
    "candidate": "renders/slide-1.png"
  }
}
```

Pass `--references references.json`. Codex receives these images as attachments. Without both images, the agent can inspect JSON/OOXML but cannot record a visual-review claim. Providing both enables inspection; it does not independently verify the agent's claim. The pipeline does not automatically render original PowerPoint reference images.

### Other agents

Use `--agent-config agent.json` to invoke another executable or a provider wrapper. The configuration is independent of deck data:

```json
{
  "actor": "my-review-agent",
  "argv": ["python", "/absolute/path/to/reviewer.py", "--request", "{request}", "--output", "{response}"]
}
```

The command runs without a shell, in its per-run directory, and receives instructions on stdin. Supported substitutions are `{request}`, `{response}`, `{prompt}`, `{schema}`, and `{run_dir}`. The wrapper must write its final JSON to `{response}` using the schema in `{schema}` and exit zero. Custom agents run with the invoking process's permissions; read-only sandboxing is supplied by the default Codex adapter, not imposed on arbitrary executables.

The response contains exactly `decision` (`propose`, `no_change`, or `needs_human`), a nonempty `reason`, an `evidence` string array, `replacement_json` (a string encoding the complete slide, or empty for a non-proposal), and `visual_review` (boolean). Proposed replacements need source evidence and valid source-relative media. No third-party Python package is needed for the adapter itself.

When source content, media bytes, slide size, or theme changes, affected reviews become conflicts. Old proposals and decisions remain in history. Re-propose against the current slide or explicitly approve the new raw slide. Unchanged slides keep their decisions, even when reordered.

## Build a reviewed version

```powershell
python scripts/pptx_to_json.py --workspace work build example
```

Every active slide must be approved or have an accepted correction. The command prints the versioned reviewed `deck.json` path. The raw extraction and original PPTX remain preserved. A reviewed version includes a snapshot of its review evidence.

## Author, expand, and combine

Create a JSON manifest with paths relative to the manifest file. Pin the reviewed version returned by `build`; include multiple sources to combine decks. Omit `slides` to include every slide, or list IDs in the order wanted. Repeated IDs deliberately produce independent copies.

```json
{
  "title": "My expanded presentation",
  "sources": [
    {
      "deck": "work/decks/example/reviewed/VERSION/deck.json",
      "slides": ["example:256", "example:257"]
    }
  ]
}
```

```powershell
python scripts/pptx_to_json.py compose composition.json --output authored/my-deck
python scripts/pptx_to_json.py render authored/my-deck/deck.json --output preview/my-deck
```

Edit `authored/my-deck/deck.json` directly or with an agent: change content, reorder/remove slides, or add new slides with unique IDs, titles, and content arrays. Add assets under its `media/` folder and set `media_src` relative to that folder's parent. Composition creates new IDs, pins provenance, and bundles media by content hash. It preserves each slide's size, theme, notes, and animation evidence. The viewer still approximates animations and complex geometry.

Extraction never writes to authored decks. Composition refuses an existing output directory. Rendering only overwrites directories marked as generated previews and cannot render over its own input. Source updates are manually merged or composed into a new version; automatic merging of authored changes is not implemented.

## Storage and limits

```text
work/decks/ID/
  source.json                  source identity
  current.json                 active raw revision
  raw/REVISION/                source.pptx, deck.json, media/
  review.json                  current decisions and history
  reviewed/VERSION/            deck.json, review.json, media/
  reviewed-current.json        latest completed reviewed version
authored/my-deck/               separately owned editable content
preview/                       disposable generated browser output
```

Raw revisions include source, extractor, and pipeline hashes. Stable slide IDs use the deck namespace and PowerPoint slide identifier; replacing a slide with a new identifier requires a fresh review. Automated flags assist review but do not detect every unsupported PowerPoint feature. Version folders are immutable by convention and pipeline behavior, not filesystem access controls. Notes are included unless extraction uses `--exclude-speaker-notes`; do not publish a workspace containing private notes or original files unintentionally.

Existing course previews have not been regenerated or migrated. Previous embedded course-specific diagram data and renderer overrides are preserved under `content/legacy-overrides/`; they are not automatically applied by this generic pipeline. Port useful repairs as explicit review proposals. The former `--input-dir`/`--output-dir` one-step CLI is replaced by these explicit stages to avoid silently overwriting authored material.

Run regression checks with `python -m unittest discover -s scripts -p "test_*.py" -v`. Agent adapter tests launch a deterministic local test process; they do not call a model or use credentials.
