# LIBRARY — Editorial Intelligence Audit (Phase 01)

Date: 2026-11-21
Baseline commit: 4523d5239ea6feb34bcff47923e3bd6fff63161e
Scope: Catalogue taxonomy, prompt placement, subcategory logic, prompt quality/redundancy, Randomiser readiness, and option configurators.
Status: Audit in progress. This report records verified findings and separates automated signals from editorial judgments.

## Baseline

The live catalogue contains 1,521 prompt records across 15 collections. Eight base collections are data-driven prompt groups, Films & Shows is organized into five screen-world groups, Toys & Collectibles has been consolidated, and five specialist collections contain domain modules. Structural validation and browser smoke tests are currently passing.

## Finding 01 — Keyword-first taxonomy has high overlap risk (HIGH)

The subcategory classifier prioritizes explicit record tags and title overrides, then uses ordered regex rules against titles. This is maintainable for simple cases but fragile for concepts that naturally span materials, styles, effects, textures, and photographic techniques.

A title-overlap diagnostic found **274 base-catalogue titles** matching more than one subcategory regex. This is a signal for review—not a count of confirmed misclassifications. The first matching rule currently wins, which makes rule order an implicit editorial decision.

Examples:
- Materials: cast resin can match Resins & Waxes and Polymers & Composites.
- Materials: recycled paper can match Recycled & Circular Materials and Paper & Cellulose.
- Materials: carbon fibre can match Textiles & Fabrics and Polymers & Composites.
- Materials: porcelain stoneware can match Stone & Minerals and Glass & Ceramics.
- Materials: wool felt can match Fauna & Animal-derived and Textiles & Fabrics.
- Styles: pop art can match Graphic Design & Typography and Pop & Subculture.
- Styles: neo-futurism can match Art Movements and Futurism & Speculative.
- Styles: woodcut printmaking can match Graphic Design & Typography, Illustration & Drawing, and Folk & Traditional.

**Recommended correction:** Give each prompt one editorially assigned primary subcategory in metadata. Use keywords only as a fallback for legacy/unassigned records. Add optional cross-domain tags for discoverability, but never let those tags change its primary placement.

## Finding 02 — Subcategories currently mix different classification axes (HIGH)

Several category taxonomies mix material families, source origin, physical form, function, and process. This is particularly visible in Materials. A textile can be plant-derived, animal-derived, recycled, smart/functional, or composite at the same time; these are orthogonal properties rather than mutually exclusive folders.

**Recommended correction:** Keep one primary navigation subcategory, but add secondary facets such as:
- Material family (metal, polymer, textile, glass, ceramic, paper, mineral, liquid/gel, composite)
- Origin (plant, animal, mineral, synthetic, recycled, biofabricated)
- Function (smart, conductive, optical, thermal, structural, flexible)
- Process (cast, woven, printed, machined, grown, laminated, recycled)
This avoids a brittle taxonomy without flattening the main collection navigation.

## Finding 03 — Similar titles and prompt-body uniqueness are insufficient semantic QA (HIGH)

The existing quality audit checks completeness, duplicate titles, prompt length, exact normalized body duplicates, missing subject variables, taxonomy coverage, and structural prompt-template repetition. These are valuable guardrails but do not measure whether prompts are meaningfully distinct, specific, or conceptually useful.

**Recommended correction:** Add semantic/editorial review flags:
- Same creative outcome expressed with different nouns
- Prompt skeleton reused with only a material/style name swapped
- Generic prompt with no defining technical or visual characteristics
- Concept that is a better fit for another collection
- Prompt that is not clearly executable or produces ambiguous results
- Redundant module whose stronger counterpart already exists

Do not convert a similarity score into a false quality rating. Use it to create review queues.

## Finding 04 — Prompt collections need domain-native criteria (HIGH)

A single generic quality checklist is not appropriate for all prompt types. Quality criteria should be collection-specific.

Suggested evaluation lenses:
- Materials: plausible material behaviour, scale, physical construction, surface, optical response.
- Styles: defining visual vocabulary, technique, composition, palette, historical/contextual fidelity.
- Textures: scale, pattern, directionality, tactile character, surface consistency.
- Effects: effect mechanism, intensity, spatial/subject interaction, preservation of source identity.
- Lighting: source, direction, softness, colour, exposure, contrast, environmental response.
- Composition: focal hierarchy, balance, negative space, framing, rhythm, perspective.
- Rendering: renderer-independent goals, shading/material response, realism vs stylisation, technical artefacts.
- Colour & Atmosphere: palette logic, tonal hierarchy, mood, contrast, depth.
- Films & Shows: source-world specificity, production design, costume/character/environment cues, adaptation limits.
- Toys & Collectibles: format-specific construction, scale, materials, presentation and authenticity.
- Architecture & Spaces: site/context, programme, circulation, structure, scale, material and environmental performance.
- Sculpture & 3D Objects: spatial presence, construction, material, mass, balance, viewing angles.
- Graphic Design & Layout: hierarchy, grid, typography, reproduction/production constraints and communication.
- Photography & Camera: camera/lens/exposure/framing/motion/focus choices with coherent photographic intent.
- Product Design: use case, ergonomics, assembly, materials, manufacturing, serviceability and safety constraints.

## Finding 05 — Randomiser architecture is a promising base but should not be scored as complete (MEDIUM)

The current Randomiser already uses compatibility scoring, creative-role assignment, conflict penalties, source-identity priorities, reconciliation and negative constraints. This is more advanced than concatenation.

Remaining audit questions:
- Are compatibility relationships based on sufficiently explicit metadata or broad keyword rules?
- Are selected modules assigned distinct roles, or can several compete for the same role?
- Can conflicts be resolved by reinterpretation, with a clear explanation, rather than only penalty?
- Are source-preservation rules and technical constraints protected from style/effect overrides?
- Can the Randomiser detect repeated visual outcomes across successive generations?
- Are combinations grounded in creative relationships instead of category adjacency?

## Finding 06 — Contextual options need a restraint policy (MEDIUM)

Prompt configurators are useful when they materially change the result. They become noise when every prompt receives options simply because a control can be added.

**Recommended policy:** Add an option only if it:
1. Represents a meaningful variable within the prompt's domain;
2. Changes the generated output in a predictable way;
3. Does not contradict the prompt's core intent; and
4. Is integrated into the final prompt as an instruction, not just appended as a label.

## Proposed editorial metadata schema

Every prompt should eventually carry a stable editorial record:
- id, title, collection, primarySubcategory
- secondaryTags, domain, creativeRole
- subjectCompatibility
- material/process/visual attributes as applicable
- compatibility and conflict tags
- prompt architecture / synthesis role
- editorial review status and audit notes

Keep this metadata separate from the user-facing prompt text. It should support navigation, search, recommendations and Randomiser synthesis.

## Audit methodology and limits

Automated diagnostics are used to find likely issues, never to make final semantic judgments. A regex overlap, title similarity, short prompt or repeated skeleton is a review signal. It is not proof of a defect.

This Phase 01 report is a verified initial audit with specific systemic findings. **The full catalogue has not yet received a human-style semantic verdict on every individual prompt.** That work should be done in collection batches, with concrete accept/revise/move/merge/retire decisions and a changelog before any catalogue edits are proposed.

## Recommended sequence

1. Fix taxonomy architecture: explicit primary subcategory, fallback-only routing, secondary facets.
2. Audit collections in batches, beginning with Materials and Styles, where overlap risk is highest.
3. Review prompt distinctiveness and redundancy with semantic-review queues.
4. Review subcategory balance and missing concepts per collection.
5. Audit Randomiser compatibility metadata and role assignment against real test combinations.
6. Implement approved catalogue changes in a separate PR; keep production untouched until full validation.

## Decision

No live catalogue changes are included in this audit branch. The immediate objective is to establish the correct editorial model and a transparent, reviewable set of corrections rather than making mass keyword changes that could silently misroute prompts.
