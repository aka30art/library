# AI Prompt Library

A modular visual-prompt archive and builder for creative image transformation. The catalogue is designed around reusable creative elements—not rigid scene recipes—so users can combine ideas while retaining control of the subject and intent.

## Current catalogue

**1,562 prompt records · 15 collections · 5 specialist collections**

| Collection | Records |
|---|---:|
| Materials | 200 |
| Styles | 125 |
| Textures | 125 |
| Photography Post-Edits | 75 |
| Effects | 125 |
| Composition | 75 |
| Rendering | 75 |
| Colour & Atmosphere | 75 |
| Films & Shows | 350 |
| Toys & Collectibles | 87 |
| Architecture & Spaces | 50 |
| Sculpture & 3D Objects | 50 |
| Graphic Design & Layout | 50 |
| Photography & Camera | 50 |
| Product Design | 50 |
| **Total** | **1,562** |

Films & Shows contains five groups: TV Shows, Cartoons, Films, Anime, and Other Screen Worlds (70 records each). The five specialist collections contain ten modules in each of five subcategories. Toys & Collectibles has 87 entries, including a consolidated TCG archive.

## Prompt philosophy

- **Universal collections:** a single integrated prompt per element. Avoid splitting one element into repetitive attribute variants.
- **Neutral creative cores:** subject-specific output requirements, framing, camera, lighting, rendering, and technical specifications should be supplied by the Builder, not hard-coded into universal prompt entries.
- **Transformation prompts:** preserve source identity and structure unless the target transformation specifically requires a change.
- **Photography Post-Edits:** treat the supplied photo as the fixed source; adjust the photographic finish rather than inventing a new capture setup or scene.
- **Specialist collections:** use domain-aware design logic (architecture, sculptural form, graphic hierarchy, photography, product function) rather than generic style language.
- **Films & Shows:** transform the supplied subject into a target world's visual language without replacing it with an existing character or copying protected logos.
- **Collectibles:** make the target format legible through its construction, materials, proportions, presentation and relevant product details.

## Subcategory system

Subcategories are collection-specific and counts are derived from loaded records. Materials, styles, textures, photographic edits, effects, composition, rendering and colour/atmosphere use keyword-based routing; Films & Shows uses explicit tags; specialist collections use explicit subcategory tags. Toys & Collectibles is organized by collectible format, with card-system entries consolidated under TCG.

## Website features

- Responsive homepage, navigation, and prompt archive
- Search, collection and contextual subcategory filtering
- Model filtering, sorting, prompt detail and copy interactions
- Prompt DNA Builder with Standard, Transformation and ART DNA modes
- Smart/Experimental Randomiser with independent module selection
- Prompt compatibility and related-prompt intelligence
- On-demand visual references with source/licence information
- Keyboard accessibility and reduced-motion support

## Quality checks

Run the catalogue structural validator and the browser/randomiser smoke tests from the repository scripts:

```bash
node scripts/validate-catalogue.cjs
node scripts/browser-smoke-test.cjs
node scripts/randomiser-smoke-test.cjs
```

The structural validator verifies expected counts, unique IDs, required fields, valid categories, subject placeholders, Films & Shows subcategory distribution, specialist subcategory distribution, and page asset wiring. Prompt-quality review additionally targets duplicate concepts, unclear boundaries, template repetition, weak specificity, classification collisions, and contradictory module combinations.

## Development

No build step or package installation is required. Run a local static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

GitHub Pages deployment is configured through `.github/workflows/pages.yml`. Changes should be validated and reviewed before merging to `main`; this audit branch does not deploy.

## Backups and recovery

A snapshot is retained in `backups/2026-11-17/`, and the branch `safety/pre-reliability-audit-2026-11-17` preserves the earlier state. Restore only when necessary and after comparing the desired version.

## Reference material

- OpenAI image prompting: https://developers.openai.com/api/docs/guides/image-prompting
- Khronos glTF PBR: https://www.khronos.org/gltf/pbr/
- Adobe OpenPBR: https://experienceleague.adobe.com/en/docs/substance-3d/general-knowledge/openpbr/openpbr-faq
- MIT computational photography: https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-10-photography-and-camera-101.html
- GS1 product-image standards: https://www.gs1us.org/
- Pokémon, Yu-Gi-Oh!, Magic: The Gathering, Disney Lorcana, One Piece Card Game and Topps official/reference resources are useful when validating franchise-specific card language and rarity terminology.
