> Historical source QA, retained during consolidation. The system-color fallback was corrected in this branch; remaining items require source comparison. These findings are not a new all-slide visual approval.

# DB Design slide comparison findings

Compared all 92 editable outputs against the text-matched normalization-library WebP frames. The library has 195 frames because some source slides include animation/build frames.

## Match confidence

- 83 slides scored at least 0.82 for the text match.
- 3 were borderline and need manual source confirmation: slides 63, 65, and 77.
- 6 have no confident source match: slides 47–51 and 89. Their source content differs from the current PPTX, so they should not be judged against the automatically selected candidate frames.

## Main fidelity problems

1. **Theme system colors can become black rectangles.** The theme palette currently records system colors such as `window` and `windowText` instead of their `lastClr` fallback hex values. Rendering then tries to parse those names as hex; invalid SVG fills fall back to black. This is visible on slides 48–52, 55–58, 62–64, and 80–88. Slide 80 was inspected at full size: the source algorithm box is white, while the output is black with dark text.
2. **Tables lose per-cell visual meaning.** JSON keeps table text, column widths, and row heights, but not cell fills, borders, merged-cell spans, vertical alignment, or run-level text styling. The renderer makes all cells uniform. On slides 14–17, the shaded FD table, emphasized cells, and related annotations are lost or misplaced; similar table patterns appear on slides 33–35, 37, and 39–40. Slide 31 also renders table text much smaller than the source.
3. **Text fit and paragraph details need better preservation.** Some boxes clip or shrink too far, so equations and explanatory lines become hard to read or disappear. Slide 15’s equation below the table is an example. Table cell typography is also not scaled from the extracted source text styles.
4. **Shape semantics and stacking need better handling.** The extraction records basic shape geometry and source order, but the renderer supports only a subset of DrawingML shapes and sorts objects by type instead of using original z-order. Connector endpoints, arrowheads, line routing, custom paths, and layered highlights need to be rendered from the actual geometry and order. Keep decorative styling low priority; preserve shapes that encode a dependency, a highlighted value, or a step in an algorithm.
5. **Legacy glyph mapping needs a broader, font-aware pass.** Slide 15’s table header contains a replacement character where the source uses an ellipsis. The current fixed private-use mapping does not cover all source fonts and symbols.
6. **Build frames need a stronger source map.** Text matching is useful, but ambiguous animation/build frames can still score high. Store source deck/slide identity where available, use animation-step ordering to pick the completed source frame, and retain manual review when the match is uncertain.

## Recommended order

1. Resolve theme `sysClr` from `lastClr` and guard invalid colors before emitting CSS/SVG.
2. Extract and render rich table cells, including fill, border, span, text, and alignment metadata.
3. Preserve text fitting, equation glyphs, and paragraph spacing without shrinking content below a legible threshold.
4. Render supported shape geometry, connectors, and source stacking order; flag unsupported custom geometry.
5. Improve source-to-build-frame alignment and expose confidence/manual-review status.

Relative sizing between components is recorded separately in the repository TODO for a later pass and was not applied here.
