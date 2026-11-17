# AI Prompt Library

A responsive, dark editorial prompt-discovery website built for the AI Prompt Library project.

## Design direction

The interface follows the approved hybrid direction: functional archive and search patterns combined with a distinctive editorial identity. The palette uses ink/charcoal foundations, signature neon orange interactions, and electric blue/violet artwork accents. Typography uses Space Grotesk for display text and Inter for interface/body copy.

## Included

- Responsive homepage and navigation
- Twenty collection entry points
- Prompt archive with text search, collection filter, model filter and sorting
- Prompt detail dialog with Standard and universal ART DNA MASTER PROMPT modes
- Prompt DNA Builder for combining a base prompt with visual style, lighting and composition
- Prompt difficulty labels: Foundation, Advanced and Professional
- Daily featured prompt
- Visual-trait filtering
- Session-only bookmark interaction
- Newsletter interface with explicit integration placeholder
- Reduced-motion support and keyboard-accessible controls

## Run locally

No build step or package installation is required. Open `index.html` in a browser, or run a local static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Content status

The catalogue contains 1,281 prompt records across ten collections. Materials contains 200 prompts; Styles, Textures and Effects contain 125 each; Photography Post-Edits contains 75; Composition, Rendering and Colour & Atmosphere contain 75 each. Films & Shows contains 350 prompts across five subcategories—TV Shows, Cartoons, Films, Anime, and Other Screen Worlds—with 70 prompts in each. Toys & Collectibles contains 56 mainstream formats, including major trading-card-game and sports-card designs. The Explore page exposes the screen-world filter only when Films & Shows is selected, while the DNA Builder presents the five screen-world groups independently.

The Prompt DNA Builder includes five specialist Universal Transformation Prompt architectures: material transformation, surface transformation, texture transformation, style transfer, and hybrid transformation. The universal collections use one integrated prompt per element rather than splitting each element into facet-specific variants.

### Prompt design and research basis

Each universal collection entry is a complete, category-specific treatment prompt. Material prompts describe the requested material transformation as one unified visual outcome; they do not split the treatment into surface, finish, behaviour or detail specifications. Photography Post-Edits treats the supplied photograph as the fixed source and applies a coherent finishing process rather than changing the capture lighting. The same integrated-prompt principle applies to styles, textures, photographic post-edits, effects, composition, rendering, and colour & atmosphere.

Research references:
- OpenAI, Image prompting: https://developers.openai.com/api/docs/guides/image-prompting
- Khronos Group, Physically Based Rendering in glTF: https://www.khronos.org/gltf/pbr/
- Adobe Substance 3D, OpenPBR FAQ: https://experienceleague.adobe.com/en/docs/substance-3d/general-knowledge/openpbr/openpbr-faq
- MIT, Computational Photography — lens filters: https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-10-photography-and-camera-101.html
- GS1, Product Image Specification Standard: https://assets.ctfassets.net/9uypwcnuzbqi/Rk3x9bOpgBMnlPYajw4tT/5a261266d2afba045bd5cc00844056e7/GS1-technical-product-image-specification-standard.pdf
- GS1 US, Best Practice Guideline for Exchanging Product Images and Attributes: https://www.gs1us.org/content/dam/gs1us/documents/industries-insights/by-industry/apparel-general-merchandise/guideline-toolkit/Guideline-Best-Practice-Guideline-for-Exchanging-Product-Images-and-Attributes.pdf

## Integrations still required

- Connect newsletter form to an email provider before collecting addresses.
- Add persistent user accounts/bookmarks only if required.
- Configure a production host/domain and analytics only when chosen.
- Replace the CSS-generated artwork placeholders with approved image assets when available.

## File structure

- `index.html` — semantic page structure
- `styles.css` — responsive visual system and components
- `app.js` — collection and prompt seed data, filtering and interactions

## Deployment

A GitHub Actions workflow has been added at `.github/workflows/pages.yml` to publish the static site to GitHub Pages on pushes to `main`. GitHub Pages must be configured to use GitHub Actions in repository Settings → Pages. Once configured, each push to `main` triggers deployment. Vercel project creation was blocked by the connected Vercel account permissions, so no Vercel project or deployment was created. No backend secrets or API keys are required for the current prototype.


## Catalogue expansion

The catalogue contains 950 prompts across ten collections. Materials contains 150 prompts; the other seven universal collections contain 75 each; Films & Shows contains 350 prompts across five subcategories of 70 each; and Toys & Collectibles contains 56 mainstream toy and TCG collectible formats. Counts are calculated from the loaded records and verified by the catalogue validator.

## Reliability and recovery

- All three pages use synchronized, versioned shared assets.
- Each page attempts to load the primary catalogue expansion and falls back to the verified snapshot at `backups/2026-11-17/catalogue-expansion.js` if the primary script fails to expose its data.
- `scripts/validate-catalogue.cjs` checks expected prompt and collection totals, collection-specific sizes, unique IDs, required prompt fields, category references and synchronized page asset versions.
- GitHub Pages deployment is gated on that validation passing.
- A full pre-maintenance snapshot is stored under `backups/2026-11-17/`; a separate Git branch `safety/pre-reliability-audit-2026-11-17` preserves the prior site state.

To restore the full snapshot, copy the files from `backups/2026-11-17/` back to the repository root and commit the restoration. To restore only the catalogue expansion, copy `backups/2026-11-17/catalogue-expansion.js` to the root as `catalogue-expansion.js`.


## Visual examples

Every prompt includes an on-demand visual-reference panel. It searches Openverse for openly licensed image examples relevant to the prompt category and title, displays creator and licence information, and links to the original source. Results are cached in the visitor's browser to reduce repeat searches. The panel is available from prompt detail views and from each item in the Builder. Visual references illustrate the material, texture, style, process, screen world or collectible; they are reference examples, not generated outputs of the prompt.


### Prompt-card visual examples
Each prompt card displays one best-matching openly licensed image directly in its thumbnail. Images load on demand as cards approach the viewport and are cached locally; the creator/licence credit links to the original source. Prompt details show the same single-example approach.
