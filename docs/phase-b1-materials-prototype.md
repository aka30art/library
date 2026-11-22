# Phase B1 — Materials: prototype and QA gate

**Status:** prototype suite only. The live catalogue has not been edited and none of the 200 Materials prompts have been replaced.

## Entry gate

Phase A was accepted for this workstream after the current PR #15 head passed its own validation and browser checks:

- PR #15 head: `c2f2f921bf6bee1fcca8930e6a85517d07f49a0e`
- Current workflow run: `44960662207` (attempt 2)
- Catalogue validation, calibration, audit generation and artifact upload: passed
- Local browser QA: desktop/mobile site interactions passed
- Randomiser mobile interactions: passed
- PR #15 remains a draft, open, mergeable, unmerged and undeployed

The earlier run `44923688992` was cancelled. It was superseded by the successful run on the current PR head; it is not counted as a pass.

## What is in this prototype

`phase-b1-materials-prototype.json` contains 20 representative, target-specific material prompts covering all 15 Materials subcategories currently exposed by the catalogue taxonomy. Each case includes:

- A deliberately difficult source-subject fixture.
- A physical signature describing the material's bulk or surface behaviour.
- A forming, finishing or manufacturing signature.
- The relevant optical and lighting response.
- Explicit constraints against common visual or physical misinterpretations.
- A complete prompt using the existing `[SUBJECT]` input convention.

The sample set includes materially dissimilar cases: brushed metal, anisotropic wood, fused wax layers, grown mycelium, nacreous structural colour, recycled polymer, electrochromic glazing, tempered chocolate, labradorite, etched glass, aramid weave, elastomer, handmade cellulose paper, shear-thickening fluid and rammed earth. Additional stress cases cover aerogel, thermochromic pigment, ferrofluid, shape-memory alloy mesh and spider silk.

## Prompt architecture

The redesigned family is not a single generic paragraph with the target name substituted. Each target prompt must resolve five linked layers:

1. **Source lock:** retain identity, silhouette, proportions, pose, component count, camera, crop, functional features and identifying details.
2. **Material physics:** define the actual structure and mechanical behaviour rather than relying on colour adjectives.
3. **Process evidence:** show how the material is grown, cast, moulded, machined, woven, laminated, fused, compressed or otherwise formed.
4. **Optical response:** specify physically appropriate reflection, roughness, transmission, scattering, absorption, anisotropy or structural colour.
5. **Limits and exclusions:** prevent impossible geometry, misleading material analogies, excess effects and loss of source legibility.

The prompt must adapt these behaviours to the source's actual geometry. It must not force every material into one fixed scene, product format or rendering style.

## Regression checks

Run:

```sh
node scripts/test-materials-prototype.cjs
```

The test verifies the 20-case suite, coverage of all 15 subcategories, unique targets and prompt bodies, minimum prompt completeness, source-variable compatibility, target mention, explicit preservation language, light-response logic, and material-specific exclusions.

The test is added to the PR validation workflow. It is a structural regression test, not proof that an image model will render every instruction correctly.

## Taxonomy findings to resolve before scaling

The prototype records two important taxonomy risks:

- **Ferrofluid:** the current Materials regex can classify it as a metal because the Metals & Alloys rule is evaluated before Liquids & Gels. Its dominant bulk behaviour is a magnetic nanoparticle suspension. Add an explicit override to Liquids & Gels before relying on taxonomy-driven generation.
- **Aerogel:** the name alone does not identify the chemistry. Silica aerogel and polymeric aerogel have different material families and constraints. The target profile must state the aerogel type when known, rather than treating the word as a complete chemical specification.

The stress-case list also demonstrates why functional materials need an explicit material profile even when their subcategory is broad. A shape-memory alloy is still an alloy, but its trained-shape recovery must be represented as a distinct functional behaviour.

## Acceptance gate before the 200-prompt rollout

Do not generate or replace all 200 records until the representative set has passed both forms of review:

- **Structural review:** the automated test passes with no duplicate prompt bodies or missing subcategory coverage.
- **Visual review:** render representative prompts against their stated difficult source fixtures, then score source identity, physical plausibility, process evidence, optical fidelity, geometry/scale and constraint compliance. Revise the family architecture where an image fails for a repeatable reason.

Only after that gate should the 200 Materials records be regenerated in place, preserving IDs, titles, collection membership, tool compatibility, Randomiser behaviour and the existing `[SUBJECT]` substitution contract.

## Isolation

This work is on `batch-02-phase-b1-materials-2026-11-22`, based on the validated PR #15 head. It does not modify PR #15, `main`, the deployed site or the live catalogue. No merge or deployment is included in this phase increment.
