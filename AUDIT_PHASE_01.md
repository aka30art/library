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


## Remaining collection inventory review — 2026-11-21

The following collections and inventories have now been reviewed at title/structure level. This is a catalogue editorial pass; generated prompt bodies share collection-specific templates, so template logic will be reviewed separately from individual title semantics. No changes to catalogue records are proposed yet.

## Finding 07 — Textures is strong but has domain drift and near-duplicate texture concepts (MEDIUM)

The 125-title Texture collection has a good range from conventional surface characteristics to specialized and unusual tactile phenomena. However, it mixes texture vocabulary, material families, physical processes, and objects whose texture is implied rather than named. Food textures, photographic/printing textures, manufactured tape and adhesive, and biological surfaces are all present.

Examples for editorial review/merge:
- “orange-peel texture” and “orange peel powder-coat dimples” may need explicit distinction (organic citrus peel vs coating defect) to avoid ambiguous interpretation.
- “cracked ceramic glaze” and “crazed porcelain glaze” are close and should either be differentiated technically or consolidated.
- “micro-scratches”, “laser-etched microgrooves”, “fine noise structure”, and “photocopier toner scatter” all occupy micro-detail/noise territory but should remain distinct only when their mechanisms and visual results are explicit.
- “woven mesh structure”, “chainmail interlock”, “carbon weave pattern”, and textile/Velcro hook structures are related structural textures; grouping facets would improve browseability.
- Food-like entries (whipped-cream aeration, marshmallow crumb, meringue shell, popcorn crags) may be intentional novelty, but the collection needs a clearly defined edible-surface facet or these could be misread as misplaced materials.

**Recommendation:** Keep Texture prompt modules focused on surface/topology/tactility. Material identity should be cross-tagged, not the primary definition; process entries should describe the visible surface result. Differentiate near-duplicates through physical mechanism and scale.

## Finding 08 — Effects is an overly broad mixed-mechanism collection (HIGH)

The 125-title Effects collection mixes lens optics, photographic chemistry, digital corruption, analog video, printing faults, animation/temporal techniques, object deformation, diagnostic imaging, and material optical phenomena. This is useful breadth, but it creates an inconsistent mental model for navigation and combination.

Suggested facets (not new top-level collections):
- Optical/lens aberrations and bokeh
- Light and atmosphere
- Motion and time
- Photochemical/film processes
- Print/scan/transfer artefacts
- Digital/video corruption
- Geometric and spatial distortion
- Simulation/material optical phenomena
- Imaging/diagnostic false-colour modalities

Potential distinction/overlap review: “chromatic aberration” vs “RGB channel separation”; “halation” vs “spherical aberration glow”; “photocopy degradation” vs “photocopy-generation collapse”; “databending” vs “datamoshing”; “thermal imaging” vs “thermal contour overlay”; “prismatic refraction” vs “spectral dispersion”. These may be valid separate prompts, but their output difference must be explicit.

**Recommendation:** Preserve Effects as the broad collection for now, but create mechanism tags and review near-duplicate pairs. Keep collection prompt directions effect-centric, with intensity, coverage and subject-preservation constraints.

## Finding 09 — Photography Post-Edits has scope/name ambiguity and redundancy (HIGH)

The 75-entry post-edit inventory contains colour grades and film emulations, analog processes, print techniques, retouching methods, composites, camera-era looks and restoration treatments. The current name may imply only colour grading, while entries include physical print processes, retouching, compositing and image degradation/restoration. The catalogue uses a legacy category key “lighting” for this collection; this should be treated as a naming/implementation concern and checked end-to-end before changing identifiers.

Potential overlaps for editorial review:
- Portra 400 warm skin-tone film emulation vs Kodak Gold 200 sun-faded snapshot grade: retain if their colour response and use case are differentiated.
- Kodachrome documentary colour restoration vs Ektachrome cool-slide transparency grade: clarify colour/contrast/grain signatures.
- Polaroid instant-film border and fade vs Instax pastel instant-photo finish: distinguish historical instant-film treatment from contemporary pastel finish.
- Duotone editorial photo treatment vs duotone newspaper archive treatment: clarify modern editorial graphic treatment vs archive print.
- Infrared false-colour foliage edit vs infrared black-sky landscape conversion (in Effects): cross-collection duplicates may be purposeful, but prompt roles and outputs must be differentiated.
- Multiple vintage/expired/faded-film grades: avoid stacking synonymous nostalgia effects without distinctive emulsion/era characteristics.

**Recommendation:** Rename or broaden the collection description to “Photography & Image Treatments” (or equivalent) and use facets for film emulation, colour grading, retouching, print/chemical process, composites, degradation and restoration. Validate the legacy category ID before implementation.

## Finding 10 — Composition is a mixed technique / viewpoint / layout collection (MEDIUM)

The 75 entries include foundational compositional principles, symmetry, focal hierarchy, negative space, framing, camera viewpoints, perspective, still-life staging, multi-panel formats, and diagram-like layouts. Several are closely related rather than strictly redundant:
- Golden-ratio arrangement vs Fibonacci spiral vs Golden-spiral framing
- Radial arrangement vs radial symmetry
- Central symmetry vs bilateral symmetry
- Triptych vs asymmetric triptych; diptych vs panoramic diptych
- Orthographic arrangement vs axonometric exploded layout vs isometric arrangement
- Single-, two-, and three-point perspective vs multiple vanishing points
- Generous negative space vs spatial minimalism vs quiet visual balance

**Recommendation:** Organize by composition principles, framing/viewpoint, spatial/perspective, arrangement/layout, and scale/juxtaposition. Make each prompt name the intended effect and visual outcome, not merely a technique label. Near-duplicate principles should be merged or explicitly specialized.

## Finding 11 — Rendering has a strong technical breadth but contains method overlaps and style/domain crossovers (MEDIUM)

The 75 titles span rendering pipelines and algorithms, shading models, modelling/geometry methods, simulation, capture/reconstruction, and non-photorealistic styles. This is useful but mixes how it is rendered, what it looks like, and which scene technique is used.

Review pairs/groups:
- Path-traced lighting vs spectral path tracing vs bidirectional path tracing
- Global illumination vs radiosity vs real-time global illumination
- Volumetric rendering vs spectral volume rendering vs volumetric particle rendering
- Neural rendering vs neural radiance-field rendering vs Gaussian splatting
- Procedural geometry vs signed-distance-field rendering vs signed-distance ray marching
- High-poly sculptural detail vs micropolygon displacement vs subdivision-surface rendering
- Cel shading vs toon shading vs stylized character shading vs toon-outline hybrid rendering
- Technical cutaway rendering vs CAD visualisation vs product/architectural visualisation (distinct goals, not synonyms)

**Recommendation:** Facet Rendering by technique family (lighting/transport, geometry, surface/shading, volumes, reconstruction/neural, simulation, technical visualization, stylized/NPR). Clarify distinctions in each prompt and consider moving pure visual styles to Styles where their main intent is aesthetic rather than render technique.

## Finding 12 — Colour & Atmosphere mixes palette recipes with atmospheric effects (MEDIUM)

The 75 entries contain palette harmonies, named colour pairings, tonal/grade approaches, atmosphere and light/air phenomena. The collection is useful but is not a single classification axis. Palette choices and environmental atmosphere are often compatible, yet should not be presented as interchangeable modules.

Overlap/review areas include monochromatic and near-black chromatic palette; muted earth tones and mineral pigment palette; high-key pastel palette and pastel atmosphere; volumetric haze, mist diffusion and fog-muted palette; several named combinations that are closely related in hue/contrast; and atmospheric colour presets already present in Effects and Photography Post-Edits.

**Recommendation:** Keep the collection, but split its internal browsing facets into Palette Systems, Colour Relationships/Recipes, Tonal Grades, Atmosphere/Depth and Colour Phenomena. Give each recipe a distinct rationale and contrast/temperature relationship. Ensure atmospheric modules affect environment and depth, not only the global colour wash.

## Finding 13 — Specialist collection titles are structured well but need a definition of what each module actually produces (MEDIUM)

The five 50-title specialist inventories (Architecture & Spaces, Sculpture & 3D Objects, Graphic Design & Layout, Photography & Camera, Product Design) are generally well scoped and domain-native. However, many titles are terse and can be interpreted as either a subject brief or a design approach. The shared prompt template must explicitly convert each title into a complete domain-specific brief.

Specific opportunities:
- Architecture: separate site/context, typologies, interior environments, public/civic, ritual/contemplative spaces, and structural/sectional studies; check residential types overlap without a distinct brief.
- Sculpture: separate form/geometry, construction/assembly, motion/kinetics, natural/biological growth, landscape/site intervention, and public function. “Precision Stack” vs “Compressed Volume” and “Interlocking Modules” vs “Cut-and-Stack” need differentiated intent.
- Graphic Design: group editorial, posters, typography, identity/branding, packaging, production/print, and spatial graphics. “Cover System”, “Identity Poster”, “Editorial Brand System” and “Brand Launch System” need clear deliverable/scale distinctions.
- Photography & Camera: group optical/lens, exposure/light, camera movement, focus/depth, genre/application and composition. “Panning Motion”, “Tracking Shot”, “Directional Motion Blur”, “Dolly Perspective”, “Orbiting Camera” and “Zoom Burst” must each specify the camera/subject movement relationship.
- Product Design: group tools/equipment, interfaces/electronics, furniture/lighting, packaging/containers, circular/repairable/sustainable and speculative products. The design prompt must prioritize use-case, ergonomics, manufacturing, assembly, serviceability and safety, not merely a visual aesthetic.

**Recommendation:** These five collections should remain distinct. Their titles are modules that should trigger complete, discipline-specific creative briefs, not generic visual transformations. Add tags and targeted prompt-quality checks rather than merging these collections.

## Finding 14 — Films & Shows is large and duplicates conceptual source worlds (HIGH)

Each of the five subcollections contains 70 entries (350 total). The inventory mixes individual franchises, visual styles, format/production treatments, and broader fictional universes. The same source world appears in multiple forms, e.g. a title-specific entry and a broader universe/era entry. This can be intentional, but should be explicit and supported by distinct prompt behaviour.

Confirmed inventory overlap/review cases:
- Doctor Who appears as both a TV show and “Doctor Who TARDIS interior world” under Other Screen Worlds.
- The Mandalorian appears as a TV show and “The Mandalorian: Ahsoka-era”.
- Pokémon appears as an anime series, an animated-series style entry and a broader Pokémon live-action creature world.
- Star Wars appears as a Film entry and The Clone Wars as a TV show (shared universe, but different medium and visual language).
- The Simpsons appears as a TV show and The Simpsons Movie as a Cartoon entry.
- Several Cartoon entries are individual franchises, while others are format/aesthetic prompts (UPA, ligne claire, stop-motion-inspired), mixing source-world adaptations and generic cartoon styles.

**Recommendation:** Define explicit record types: franchise/source-world, style/medium, production-format, universe/setting. Use parent franchise prompts with contextual options when multiple variants exist. Distinguish medium adaptations from duplicates. Review title/subcategory boundaries so a broad universe entry does not compete with a title-specific transformation.

## Finding 15 — Toys & Collectibles still contains too many separate TCG brand/rarity records (HIGH)

The 87-title Toys & Collectibles inventory has good breadth across figures, LEGO, plush, die-cast, toys and accessories. However, it still contains separate prompts for specific TCG brands and rarities despite the PR10 consolidation goal. Examples include Pokémon Full-Art Secret Rare, Pokémon Trainer Gallery, multiple Pokémon rarity types; multiple Yu-Gi-Oh! rarity treatments; Magic Mythic Rare, Borderless, Showcase and Serialized; One Piece Manga Rare, SP, Treasure Rare and Parallel Leader; and several Lorcana rarity variants.

**Recommendation:** Keep one parent prompt per TCG brand/source game (Pokémon, One Piece, Yu-Gi-Oh!, Magic: The Gathering, Disney Lorcana, Sports, and any Universal TCG parent). Within the opened parent prompt, use configurable card format/type, rarity/edition, foil/finish, numbering/serialisation, artwork layout and special treatment options. Remove redundant rarity-specific catalogue entries after checking whether their unique instructions can be preserved as option values. Retain separate accessory/product prompts (slab, pack, playmat, card back, etc.). This should align the collection with the user's stated preference and reduce unnecessary catalogue clutter.

## Remaining collection summary — preliminary decisions

- **Textures:** retain; refine scope and differentiate near-duplicate texture mechanisms.
- **Effects:** retain; facet by mechanism and strengthen distinction/compatibility.
- **Photography Post-Edits:** retain content; rename/describe more accurately and verify legacy identifier.
- **Composition:** retain; facet and consolidate overlapping principles.
- **Rendering:** retain; facet technical families and distinguish overlapping methods.
- **Colour & Atmosphere:** retain; separate palette systems from atmosphere/depth effects.
- **Films & Shows:** retain parent collection; add source-type metadata and resolve universe/franchise duplication.
- **Toys & Collectibles:** retain collection; consolidate TCG brands/rarities into parent configurators.
- **Architecture & Spaces:** retain; facet and refine overlapping typology entries.
- **Sculpture & 3D Objects:** retain; facet form, assembly, kinetic, biological and site-specific modules.
- **Graphic Design & Layout:** retain; facet deliverable and production types, clarify overlapping brand/poster modules.
- **Photography & Camera:** retain; facet optical, exposure, movement, focus, genre and framing modules.
- **Product Design:** retain; facet use-case/product families and keep engineering/user constraints explicit.

## Editorial correction plan (consolidated; no catalogue edits yet)

### A. Taxonomy architecture
1. Introduce explicit primary subcategory metadata for every record; regex routing becomes fallback only.
2. Add secondary facets/tags independent of primary navigation: domain, medium, material family, process, creative role, source/franchise type, subject compatibility, technique, production format and intensity.
3. Replace first-match ambiguity with deterministic primary tags; use overlap diagnostics to populate review queues.
4. Add collection-specific facet schemas instead of forcing one taxonomy model on all collections.

### B. Prompt quality standards
5. Audit shared template instructions separately from title records. A template must transform its target concept into a complete, coherent, subject-aware brief; not simply paste a title or generic prose.
6. Apply domain-native QA standards per collection. Preserve identity/subject where applicable, avoid conflicting directives, and ensure requested technique affects the output in a controlled, intelligible way.
7. Use semantically similar prompt pairs as review candidates, not automatic deletions. Merge only when creative outcome and execution are substantially redundant.

### C. Collection-specific changes
8. Textures: clarify surface-only focus; use cross-tags for material/process/source and define scale/tactility.
9. Effects: add mechanism facets; distinguish similar optics, film/print/digital processes and distortions; maintain compatibility/subject-preservation rules.
10. Photography & Image Treatments: rename collection display/description carefully; preserve legacy data ID until compatibility is verified; facet edit type.
11. Composition: group principles, framing, viewpoint, perspective, layout and scale; clarify overlapping geometry concepts.
12. Rendering: organize method families; clarify pipeline vs technique vs aesthetic output; move only after editorial review.
13. Colour & Atmosphere: separate palette, harmony, grading, atmospheric depth and colour phenomena.
14. Films & Shows: tag source type; consolidate franchise parents and move variants into contextual options where appropriate; distinguish medium-specific adaptations.
15. Toys & Collectibles: consolidate TCG brand-specific rarity prompts into parent configurators; retain standalone accessories and non-TCG collectibles.
16. Specialist collections: preserve five disciplines; create domain-specific facets and distinct output briefs; strengthen title-level definitions where overlaps are real.

### D. Implementation & validation
17. Build a review queue/report with actions KEEP, REFINE, MOVE, MERGE, RETIRE, CONVERT_TO_OPTION, and ADD_MISSING.
18. Implement corrections in isolated batches with before/after inventory, record-count deltas and rationale.
19. Validate IDs, categories, primary subcategory coverage, duplicates, prompt output modes, options integration, Randomiser compatibility, desktop/mobile smoke tests and deployment only after approved merge.
20. Maintain a catalogue changelog so every removal, move, merge or option conversion is traceable.

**Audit completeness:** All remaining collection title inventories have been reviewed in this pass. The findings are editorially grounded in inventory and catalogue structure. A full line-by-line semantic assessment of every generated prompt body and every collection template is not yet complete; that is a distinct next audit pass and is not claimed here.
