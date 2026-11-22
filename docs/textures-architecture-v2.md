# Textures Architecture v2.0 — Phase B3

**Scope:** 125 existing Texture records (IDs 326–450).  
**Status:** Implemented on the isolated B3 branch; acceptance is determined by the exact-head CI result.

## Design decision

Textures is a source-aware surface-structure system, not a generic adjective, material replacement or noise overlay. Each record is a named target with its own physical or image-forming origin, morphological structure, scale behaviour, distribution logic and exclusions.

The compiler produces a twelve-section execution brief: transformation intent, source input, named target, identity and geometry lock, texture identity and formation, microstructure and scale, topography and distribution, tactile/mechanical character, optical response, source integration, boundaries and final verification.

Texture detail must follow actual form, substrate, curvature, gravity, stress, growth, weave, process and viewing scale. Surface relief must not silently become bulk geometry; a coating must not replace its substrate; loose deposits must not be rendered as bonded material.

## Taxonomy

Every profile receives one explicit subcategory, stored on the prompt and mirrored into its tags so Explore, Builder and Randomiser use the same routing:

- Natural & Biological
- Microstructure & Surface Finish
- Food & Organic Textures
- Mineral & Geological
- Metal & Industrial
- Textile & Fibres
- Paper & Print
- Liquid & Atmospheric
- Synthetic & Manufactured
- Surface Wear & Ageing
- Print, Media & Optical

The taxonomy separates biological growth, mineral structures, engineered surfaces, textile constructions, paper/printing processes, optical media, coatings, liquid films and ageing mechanisms.

## Application integration

- **Explore:** retains all 125 records and exposes eleven explicit, populated filters.
- **Builder:** retains each prompt as an independent selectable module and uses a stronger texture-specific transformation protocol to preserve source form, scale, distribution, substrate and functional boundaries.
- **Randomiser:** recognises structured Textures v2 records and preserves their ordered prompt sections with a dedicated 4,800-character ceiling instead of generic short-module compaction.

## Acceptance gates

- Exactly 125 records, with IDs 326–450 and original title order retained.
- 125 authored target-specific profiles and unique prompt bodies.
- All eleven subcategories explicitly assigned and runtime-filterable.
- Twelve required sections in every prompt and both [SUBJECT] and [SOURCE IMAGE] source tokens.
- Existing catalogue remains 1,521 records in 15 collections.
- Materials B1, Styles B2, screen-world, specialist and full-site regressions remain green.
- Explore, Builder transformation and Randomiser integration pass Playwright on mobile and desktop.

## Visual-review boundary

Automated tests inspect all 125 profiles and their application integration. Browser tests verify the prompt content is available and preserved by the UI. They do not render 125 independent AI images; any visual sampling must be reported separately with its exact sample and limitations.