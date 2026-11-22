# Phase B1 — Materials: refined architecture and 200-prompt rollout

**Branch state:** all 200 Materials records use the v2 profile-driven prompt compiler on PR #16.

**Approval state:** Materials architecture v2 is approved. Catalogue integrity, prototype, 200-record architecture, prompt-quality audit, desktop/mobile browser QA, Builder, Randomiser and targeted Materials integration tests all passed on commit `c29fedf68b2336529df56be74792353f1d173c76` in [CI run 44977292975](https://github.com/aka30art/library/actions/runs/44977292975).

**Release state:** PR #16 remains open, draft, unmerged and undeployed. No production changes have been made.

## Scope and source baseline

- PR: [#16](https://github.com/aka30art/library/pull/16)
- Branch: `batch-02-phase-b1-materials-prototype`
- Base: `568e34188f1a250de6fb29956f09c5fc2f321606`
- Phase A evidence: PR #15 validation run `44960662207` (attempt 2)
- The production baseline, PR #15 and deployed GitHub Pages remain untouched.

The Materials collection remains 200 records across the 15 existing subcategories. IDs 1–200, titles, category membership, `[SUBJECT]` input contract, record shape, supported model metadata, Builder selection and Randomiser catalogue loading are preserved.

## Refined prompt architecture

The former one-paragraph element substitution has been replaced on this branch by a target-aware material compiler in `catalogue-expansion.js`.

Each generated Materials prompt resolves:

1. **Source identity lock:** subject identity, silhouette, proportions, pose, component count, viewpoint, crop, apertures, controls, labels, joints and functional clearances.
2. **Material identity:** chemistry or material class, including distinctions between substrate, coating, reinforcement and bulk body.
3. **Bulk structure and microstructure:** grain, pores, fibres, weave, layers, crystals, inclusions, cellular networks or continuous liquid phase.
4. **Formation and manufacturing:** casting, forming, machining, weaving, lamination, mould growth, firing, curing, pressing, sintering, coating or other target-appropriate process.
5. **Mechanical and environmental behaviour:** stiffness, density, brittleness, flexibility, viscosity, gravity, load paths, moisture, thermal response and containment.
6. **Optical response:** reflectance, roughness, transmission, refraction, scattering, absorption, anisotropy, subsurface response and structural colour.
7. **Target modifiers and exclusions:** material-specific constraints to prevent false analogies, visual shortcuts and impossible physics.
8. **Source-aware verification:** final silhouette, countable parts, functional openings, attachment continuity, scale and material plausibility.

The compiler uses 15 family-level profiles, explicit target-specific overrides for high-risk materials, and modifier rules for processes such as brushing, polishing, oxidation, lamination, weaving, compression, frosting, iridescence, recycling and charring. It does not force every material into one fixed scene or rendering style.

The v2 system explicitly distinguishes bulk structure from surface finish. In particular, porosity is not permission to convert solid load-bearing parts into an open lattice.

## Taxonomy corrections and stress cases

The branch explicitly resolves the important material boundaries:

- **Ferrofluid:** Liquids & Gels. It is a contained magnetic nanoparticle suspension, not a bulk solid metal.
- **Aerogel:** Polymers & Composites as the stable catalogue route. Its prompt names silica aerogel as the default and recognises polymeric variants without silently changing chemistry.
- **Shape-memory alloy mesh** and **Nitinol wire fabric:** Metals & Alloys. Their trained/programmed recovery is a distinct functional behaviour; the prompt asks for one stable recovered state.
- **Bismuth crystal**, **sintered bronze foam** and **open-cell aluminium foam:** Metals & Alloys. Their crystalline or cellular structures remain metallic.
- **Carbon fibre:** Polymers & Composites. The prompt distinguishes continuous carbon reinforcement from its resin matrix and requires lay-up direction.
- **Waxed canvas:** Textiles & Fabrics. The substrate remains a textile with a wax finish, not a bulk wax object.
- **Cork leather:** Wood & Plant Fibres. Its plant-derived structure is not animal hide.
- **Bone china:** Glass & Ceramics.
- **Hempcrete:** Construction & Earth.
- **Parchment and vellum:** animal-derived sheet materials; paper and cellulose targets retain their distinct sheet-formation logic.

## Visual evaluation

A comparative source-based visual pass used six deliberately different source subjects: a rotary telephone, anatomical hand sculpture, origami crane, guarded quadcopter, moth and running shoe. The treatments exercised brushed aluminium, natural timber, silica aerogel, mycelium composite, nacre and recycled ocean plastic.

The most useful failure was the mycelium-composite drone: an early output turned solid structural parts into an open porous lattice. The compiler was refined to keep broad moulded surfaces dense, reveal the porous interior mainly at cut edges, preserve load paths, and protect vents and functional clearances. Other sample outcomes supported directional grain on timber, anisotropic metal reflection, fragile but continuous aerogel networks, lamellar nacre and recycled polymer inclusions.

This was a directional visual architecture test, not a claim that every one of the 200 prompts has been individually rendered or that model output is deterministic. The six source comparisons informed the v2 profile constraints; all 200 generated records are covered by automated structural regression.

## Automated quality gates

The PR workflow runs:

```sh
node scripts/validate-catalogue.cjs
node scripts/test-materials-prototype.cjs
node scripts/test-materials-catalogue.cjs
node scripts/audit-prompt-quality.cjs
```

The catalogue regression checks all 200 records for:
- the original ID sequence 1–200 and unique titles;
- explicit assignment across all 15 Materials subcategories;
- unique prompt bodies and minimum prompt depth;
- the `[SUBJECT]` contract and title-matched target heading;
- all eight required prompt-architecture sections;
- material-aware negative constraints;
- Ferrofluid, Aerogel, Mycelium Composite, shape-memory alloy, Nitinol, thermochromic pigment, nacre, carbon fibre, cork leather, waxed canvas, bismuth and metallic-foam edge cases.

The whole-catalogue validator and prompt-quality audit also verify the 1,521-record catalogue, 15 collections, category totals, unique IDs and absence of unclassified records.

## Browser acceptance and final result

CI run `44977292975` passed on head `c29fedf68b2336529df56be74792353f1d173c76`:

- Catalogue validation: **PASS**
- Materials prototype suite: **PASS**
- Materials 200-record architecture test: **PASS**
- Prompt-quality audit: **PASS** — 1,521/1,521 unique prompt bodies; zero unclassified records
- Desktop/mobile full-site browser QA: **PASS**
- Randomiser mobile interaction and combined-prompt QA: **PASS**
- Targeted Materials Explore taxonomy and detail checks: **PASS**
- Builder Mycelium Composite selection and copied prompt: **PASS**
- Randomiser Materials synthesis retained all core material profile sections: **PASS**

For this pull-request event, GitHub Pages artifact preparation and deployment were skipped. No merge or production deployment is included in Phase B1.
