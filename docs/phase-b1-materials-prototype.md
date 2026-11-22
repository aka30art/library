# Phase B1 — Materials: refined architecture and 200-prompt rollout

**Branch state:** the Materials v2 prompt compiler is now wired into all 200 Materials records on PR #16. This is an isolated branch change only. It has not been merged to `main` or deployed.

**Approval state:** the architecture is not signed off yet. The first full-catalogue CI attempt exposed test/compiler mismatches; these are being corrected. Automated browser QA and actual image-to-image output review remain required before the quality gate can be approved.

## Scope and source baseline

- PR: [#16](https://github.com/aka30art/library/pull/16)
- Branch: `batch-02-phase-b1-materials-prototype`
- Base: `568e34188f1a250de6fb29956f09c5fc2f321606`
- Phase A evidence: PR #15 validation run `44960662207` (attempt 2)
- Production baseline, PR #15 and deployed GitHub Pages remain untouched.

The Materials collection remains 200 records across the 15 existing subcategories. IDs, titles, collection membership, `[SUBJECT]` input contract, record shape, Builder selection and Randomiser catalogue loading are preserved.

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

## Taxonomy corrections and stress cases

The branch explicitly resolves the known boundary cases:

- **Ferrofluid:** Liquids & Gels. It is a contained magnetic nanoparticle suspension, not a bulk solid metal.
- **Aerogel:** Polymers & Composites as the catalogue route. Its prompt names silica aerogel as the default and recognises polymeric variants without silently changing chemistry.
- **Shape-memory alloy mesh:** Metals & Alloys. Its trained/programmed recovery is a separate functional behaviour and the prompt requests one stable recovered state.
- **Nitinol wire fabric:** Metals & Alloys. It is a metallic wire textile, not an ordinary yarn fabric.
- **Carbon fibre:** Polymers & Composites. The prompt distinguishes continuous carbon reinforcement from its resin matrix and requires lay-up direction.
- **Waxed canvas:** Textiles & Fabrics. The substrate remains a textile with a wax finish, not a bulk wax object.
- **Cork leather:** Wood & Plant Fibres. Its plant-derived structure is not animal hide.

## Automated quality gates

The PR workflow runs these checks before browser QA:

```sh
node scripts/validate-catalogue.cjs
node scripts/test-materials-prototype.cjs
node scripts/test-materials-catalogue.cjs
node scripts/audit-prompt-quality.cjs
```

The prototype test checks the 20 difficult cases and all 15 subcategories. The catalogue test checks all 200 records for explicit category assignment, unique IDs and titles, prompt depth, source-variable compatibility, eight required prompt-architecture sections, target-specific negative constraints, and key material-specific behaviours. It also verifies that all 15 subcategories are represented and that the full catalogue retains unique IDs.

The first current catalogue test attempt identified two concrete defects:
- The test expected title-cased headings while the compiler was emitting raw catalogue casing.
- The shape-memory alloy profile did not state the programmed geometry and stable recovered state using the test's required wording.

These are being corrected at the compiler/profile level, not by weakening the checks.

## Browser and visual acceptance

A green structural test is not image-model validation. Final approval requires:

- Desktop browser QA of catalogue navigation, Materials filtering, prompt detail and copy actions.
- Mobile browser QA of the same paths.
- Builder selection and generated output using at least one Materials record.
- Randomiser single-collection and mixed-collection runs to confirm Materials remain composable without category leakage.
- Actual source-to-output visual review using representative difficult fixtures.

Visual review must score source identity, physical plausibility, process evidence, optical fidelity, geometry/scale and constraint compliance. The current PR has not yet passed this visual gate. Do not infer a visual pass from prompt text or browser QA.

## Rollout and isolation

All 200 records are generated on the PR branch using the refined compiler. The production catalogue is unaffected until a later, separately authorised merge. PR #16 remains draft, open, unmerged and undeployed. No production deployment is part of Phase B1.
