# B5-D — Screenworld Catalogue Rebuild Architecture

Status: catalogue rebuild in progress. Prototype merged and deployed. Real-image visual QA remains outstanding and is recorded as an explicit risk, not a pass.

## Catalogue target
- 5 subcategories: TV Shows, Cartoons, Films, Anime, Other Screen Worlds.
- 25 entries per subcategory; 125 total.
- One entry is one complete transformation prompt—not a style label plus generic filler.
- Every entry must be standalone, usable with arbitrary source subjects, and materially distinct from other entries.

## Prompt compiler structure
Every prompt follows a complete, ordered transformation brief:
1. **Source lock:** identify supplied subject as primary reference; preserve recognisable identity, anatomy/geometry, defining features, silhouette, pose, and functional details unless the world adaptation specifically calls for controlled redesign.
2. **Destination DNA:** define target world's characteristic visual grammar—shape language, colour, surface/line treatment, proportions, and production language—without relying on a vague name-only style invocation.
3. **Adaptation plan:** state how the source subject is translated (not replaced); select a source-aware pathway for human, animal, object, collectible, vehicle, or architecture.
4. **Subject reconstruction:** describe the specific transformation rules and how they apply to the subject. Avoid one-size-fits-all generic phrases.
5. **World construction:** create environment, props, background, atmosphere, and scale cues that belong to the destination world and reinforce the transformed subject.
6. **Composition/camera:** choose deliberate staging, focal hierarchy, perspective, and camera distance appropriate to the destination.
7. **Lighting/materials:** give destination-specific lighting and materials, avoiding contradictory render directions.
8. **Integration:** ensure the subject belongs naturally in the world—contact, shadows, scale, spatial logic, perspective and palette are coherent.
9. **Identity and continuity:** retain key source traits; use no unrelated character substitution, logo/title text or franchise character cameo.
10. **Failure prevention:** explicit exclusions tailored to the target and subject class; prevent generic crossover collage, weak surface-only filter, identity loss, broken anatomy/geometry, inconsistent environment, and unwanted typography.
11. **Final quality gate:** demand a coherent single image, resolved detail hierarchy, clean silhouette, and evidence of full transformation rather than an overlay.

## Subcategory boundaries
- **TV Shows:** episodic television production identities, series-specific production design, framing, recurring environment logic and visual tone. Do not duplicate Film or Anime prompts.
- **Cartoons:** animation-medium transformation languages (cel, cut-paper, rubber-hose, limited-animation, UPA, etc.) with explicit shape/line/color rules, not franchise destinations.
- **Films:** cinematic production design, shot composition, lens/camera logic, atmosphere, material realism and movie-world integration.
- **Anime:** anime production grammar—character design, linework, cel/painterly shading, motion/impact language, environment and colour—not a simple generic anime filter.
- **Other Screen Worlds:** exclusive non-standard screen/production forms (puppet, stop-motion, miniature, rotoscope, motion graphics, experimental, mixed-media, virtual production, interactive/AR). Exclude conventional film/TV/anime/cartoon destinations.

## Quality and deduplication gates
- Reject generic prompts that could be assigned to multiple unrelated destinations unchanged.
- Reject entries where transformation is only “apply style”, palette, texture, or lighting.
- Distinct entries must differ in operational construction, not just adjectives.
- No repeated prompt scaffold with a swapped title or surface treatment.
- Validate exact count (25 per category, 125 total), non-empty standalone prompts, title uniqueness, normalized prompt uniqueness, category boundary, source coverage and required sections.
- Add tests for source type coverage (human, animal, object, collectible/toy, vehicle, architecture), quality gates, and category-specific restrictions.

## B5-D sequencing
1. Lock this architecture.
2. Build the 25 TV Shows prompts and validate quality before moving on.
3. Build Cartoons, Films, Anime, and Other Screen Worlds in separate reviewable batches.
4. Run full catalogue audit and deduplication.
5. Integrate catalogue with Explore, Builder, and Randomiser.
6. Run regression and browser QA; fix all failures.
7. PR review and merge/deploy only after green checks.

## Validation honesty
No generated-image visual QA is claimed. Prompt and structural checks cannot substitute for inspecting actual rendered images. B5-D proceeds on user direction with this limitation documented.
