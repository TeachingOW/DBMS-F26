# Extraction, review, and authoring workflow

## Intended workflow

PowerPoint → raw extraction → agent/human review and corrections → reviewed editable content → authoring and composition → rendered presentations.

The CLI now implements separate raw revisions, persistent review corrections, reviewed builds, authored composition, and browser rendering. See [the runnable pipeline guide](deck-pipeline.md). This document describes the broader architecture; automated authored merges, full visual fidelity, and distributed processing remain future work. Existing course outputs have not been automatically migrated.

## 1. Preserve the extraction

Keep a versioned raw extraction with source file hash, extractor version, slide identities, source shape IDs, media, notes, geometry, and animation evidence. Treat it as immutable evidence for that extraction run. Extraction should not embed manually reconstructed teaching concepts or silently replace unsupported objects.

Slide identities must not depend only on slide number. Preserve the source presentation slide identifier and part path; use the source revision to detect identity changes. An ambiguous match after a source edit requires review.

## 2. Review and handle special cases

Generate a review queue for unsupported objects, missing media, layout approximations, diagrams, font substitutions, and animation behavior. Automated detection is a starting point; reviewers can flag any slide. Compare the rendered slide with the original and record the relevant source frame when animations produce several reference images.

An agent can propose a repair or semantic reconstruction, and a human can edit, accept, or reject it. Delegated agent review can use the same records when explicitly authorized. Store each correction outside raw extraction, with its target slide/object, source revision, expected original value, replacement, reason, evidence, reviewer, and status. Preserve original objects when adding an interpreted diagram.

Apply accepted corrections to produce a reviewed content version. On re-extraction, replay a correction only when its identity and expected source values still match. Surface conflicts and invalidate affected approvals rather than silently applying old edits to changed content. Track structural checks and visual review separately: valid JSON does not establish visual fidelity.

## 3. Author from the reviewed version

Create a separately owned editable deck from a pinned reviewed version. Users can rewrite text, add examples and labs, expand explanations, reorder or remove slides, and combine selections from multiple decks. PowerPoint remains the evidence for the original material; the authored deck becomes the source of truth for subsequent teaching changes.

Give each authored slide its own identity and optional provenance pointing to the reviewed source slide and revision. Copying a slide creates a new identity while retaining provenance. New slides need no PowerPoint equivalent. Referenced media must remain available when moving or combining slides.

Re-extraction must never overwrite authored decks. Source updates become explicit changes to review and merge into them. Reusable slide selections should pin a version so an upstream edit does not unexpectedly change every course.

## 4. Build and scale

Render authored content through shared viewer components. Keep reusable renderer fixes separate from per-slide corrections. A general rendering bug should be fixed once; a special case should be represented in content or a correction record.

Use a deck manifest with ordered slide references to assemble courses and variants. Support batch extraction and incremental rebuilds using source/content hashes, namespaced slide and asset IDs, resumable review queues, and per-deck progress. Every output should identify the raw, correction, authored, and renderer versions that produced it.

## Implementation order and acceptance checks

1. Separate raw output from reviewed and authored storage. Verify a rerun leaves an authored edit untouched.
2. Add persistent corrections and review state to the existing comparison workflow. Verify an accepted correction survives a matching rerun and a changed source produces a conflict.
3. Move hard-coded concept reconstructions out of the extractor into reviewed content. Verify source evidence remains accessible.
4. Add deck composition and provenance. Verify slides from two decks retain their media, notes, and unique identities.
5. Add batch/incremental builds and review reporting. Verify unchanged decks are skipped and interrupted reviews can resume.

The existing side-by-side comparison is the starting point for review, not yet a complete correction or authoring system.
