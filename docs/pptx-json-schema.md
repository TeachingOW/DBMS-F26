# PowerPoint JSON extraction model

The PowerPoint remains the source of truth for extracted evidence. After review, separately authored decks become the source of truth for teaching edits and extensions. Extraction preserves source evidence in JSON; it does not attempt to decide the instructional meaning of every object. See [the extraction, review, and authoring workflow](extraction-workflow.md) for the target separation and implementation sequence.

## Layers

1. `slides[].content` stores ordered, editable source objects: text and rich paragraphs, tables, shape geometry and transforms, fills and lines, images and relationships, text-box settings, and object identifiers.
2. `slides[].scene` stores a lightweight visual graph. Each item in `scene.objects` points to its source object through `content_index` and `shape_id`. `scene.connections` retains PowerPoint connector endpoints. Positions and rendering details stay in `content` so they have one canonical copy.
3. `slides[].animation_steps` stores ordered effects and target shape IDs. `animation_timing_xml` preserves the source timing tree for effects not yet normalized.
4. `slides[].speaker_notes` always stores notes unless extraction is explicitly run with `--exclude-speaker-notes`. Notes are not part of the rendered slide.

## Conceptual extraction for similar slides

The extractor uses the same object and scene schema for every slide; it does not identify a concept by slide number. It can flag a dense visual composition as a diagram candidate using object counts and positions. That flag is only a navigation hint. It does not claim that a shape is an entity, relationship, attribute, or cardinality. Those meanings require review against the source and should be represented as an evidence-linked semantic layer when added.

Custom shape paths retain their commands, points, and guide formulas. Connector references retain source shape IDs. A renderer can therefore map scene references to source objects, place them on a slide-sized canvas, and build diagram structures across related slides without replacing the extracted evidence with hand-authored, slide-specific layouts.

## Current fidelity limit

The HTML viewer places straightforward text and table slides on a proportional slide canvas when their objects have source or inherited bounds. Complex diagrams still use simplified layout and approximate vector reconstruction. Theme/style inheritance, every custom path or media asset, and PowerPoint animation timing are not yet reproduced fully. JSON extraction and visual rendering remain separate stages; the renderer should consume the scene graph and source object properties.
