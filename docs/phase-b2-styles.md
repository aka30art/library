# Phase B2 — Styles v2 rollout

**Branch:** `batch-02-phase-b2-styles-v2`  
**Base:** `main` after the B1 Materials v2 release  
**Scope:** 125 existing Styles prompts; no new records  
**Release boundary:** isolated PR only; no merge or production deployment in this phase.

## Implementation

- Replaced the generic Styles prompt body for all 125 existing records with authored target-specific style profiles.
- Preserved IDs 201–325, original title sequence and all 15 collection totals.
- Added explicit assignment across nine Styles subcategories and tagged every record with its assigned subcategory.
- Added source-aware visual language transfer sections for style identity, form grammar, markmaking, colour/value, composition, medium, source adaptation, exclusions and final validation.
- Strengthened the Builder Style Transfer architecture to distinguish a complete visual system from a filter or palette swap.
- Added Styles-aware Randomiser compaction with a dedicated 4,800-character allowance and ordered section preservation.
- Bumped client cache keys for the catalogue and affected Builder/Randomiser scripts.

## Regression coverage

- New catalogue test: `scripts/test-styles-catalogue.cjs`
- New browser test: `scripts/styles-browser-smoke-test.cjs`
- Existing catalogue validator and prompt-quality audit retained; Styles was added to specialist-template analysis.
- PR CI runs Styles catalogue validation and Explore/Builder/Randomiser browser integration in addition to all prior regression suites.

## Visual-review disclosure

Automated tests cover all 125 records at the structural and integration level. Browser tests inspect the rendered library UI and verify that compiled prompt sections survive Builder and Randomiser use. They do not render 125 independent AI images. Any representative visual spot-check will be reported separately with its exact sample and limitations.
