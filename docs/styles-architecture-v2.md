# Styles Architecture v2.0 — Phase B2

**Status: APPROVED.** Final catalogue and browser acceptance passed on head `bfdcae02c9d6c1065acb555e215a096b980b0035` in [CI run 44979679495](https://github.com/aka30art/library/actions/runs/44979679495).

## Scope and preservation contract

Phase B2 upgrades the existing 125 records in the Styles collection. It does not add or remove prompts. The original IDs (201–325), title order, collection membership, supported model metadata and `[SUBJECT]` source contract remain stable. The only deliberate catalogue field extension is the supported `subcategory` field, mirrored into `tags`, so all nine Styles groups are explicit and filterable; no version-specific per-record metadata was added.

Each record now has an explicit Styles subcategory and an authored style profile. The profile is not a generic prompt with a style name substituted into a shared sentence. It defines the visual logic that distinguishes the named style and gives the compiler target-specific constraints.

## Style profile model

Each of the 125 profiles records:

1. **Visual thesis** — the governing artistic or design proposition and its purpose.
2. **Form grammar** — characteristic shape construction, silhouette, geometry, proportion, simplification or distortion.
3. **Markmaking and edge behaviour** — line, stroke, cut, pixel, print, photographic or surface treatment.
4. **Colour and value system** — palette logic, tonal hierarchy, contrast, chroma and finish.
5. **Composition and spatial logic** — focal hierarchy, rhythm, balance, depth, negative space and crop.
6. **Medium and rendering method** — the physical, photographic, printed or digital process appropriate to the style.
7. **Source adaptation** — how the named style is applied to the supplied subject without replacing it with a stock motif.
8. **Boundaries and exclusions** — common visual misreadings, clichés, incompatible conventions and source-specific failure modes.

The compiled prompt turns these into a consistent eleven-section execution brief: target-specific style transformation, source input, identity lock, style identity, form grammar, markmaking, colour/value/surface, composition/space, medium/rendering, source adaptation, boundaries and a final style-aware check.

## Taxonomy

All records are explicitly assigned to one of nine subcategories:

- Art Movements
- Graphic Design & Typography
- Illustration & Drawing
- Photography & Realism
- Digital & Generative
- Futurism & Speculative
- Folk & Traditional
- Pop & Subculture
- Contemporary & Experimental

The profile is authoritative for the subcategory and writes that value into both the record's `subcategory` field and `tags`. This ensures Explore, Builder and Randomiser use the same classification rather than relying on title keyword inference.

## Application integration

### Explore

The existing Styles collection and subcategory filter consume the new explicit assignments. The collection remains 125 prompts and every record must be reachable through one of the nine subcategories; no record should fall into an `Other` bucket.

### Builder

The Builder continues to expose every style as an independent selectable visual module. The transformation-mode Style Transfer architecture is strengthened to resolve style as a coordinated system: visual thesis, shape grammar, line/markmaking, colour/value, composition/space, medium/reproduction, detail hierarchy and source preservation. It does not replace the selected record's style profile.

### Randomiser

The combined-prompt compiler now recognises Styles v2 records and extracts the complete ordered profile sections. Styles receive a dedicated 4,800-character preservation allowance rather than the generic short-prompt cap. This prevents the Randomiser from reducing a style to its name and a superficial art-direction sentence.

## Acceptance gates

- Exactly 125 Styles records.
- Original title order and IDs 201–325 preserved.
- 125 unique authored style profiles and unique prompt bodies.
- All nine subcategories explicitly assigned and present in tags.
- Eleven required profile/verification sections present in every prompt.
- The existing total catalogue remains 1,521 records across 15 collections.
- No duplicate IDs, missing fields, missing subject variables or unclassified records.
- Explore filter, prompt detail, Builder module selection and Style Transfer architecture tested.
- Randomiser loads all Styles records and preserves the complete style profile in combined output.
- Desktop and mobile browser smoke tests pass.
- Existing Materials, Randomiser, screen-world and collection regressions remain green.

## Quality boundary

The regression suite verifies the full 125-record catalogue structurally and checks application integration in a live browser. This is not equivalent to individually rendering 125 images. Any visual review should be described as a representative sample and should report which styles and source subjects were actually inspected.
