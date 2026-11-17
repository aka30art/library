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

The catalogue contains 1,001 prompt records across 20 populated collections. The planned library structure now contains 19 categories. Every collection contains at least 20 prompts: Materials (20), Filters & Effects (20), Mockups (21), 3D & Rendering (20), Environments (20), Photography & Lighting (20), Graphic Design & Typography (20), Transformations (20), and Composition & Art Direction (20). The catalogue has been expanded with specialist material studies, optical and post-production effects, product mockups, physically based rendering, environments, lighting setups, graphic systems, image transformations and composition strategies. The original 36-record source catalogue was not present in the repository at initialisation, so these entries are researched and authored catalogue content rather than a claimed recovery of those missing records.

### Prompt design and research basis

Prompts specify visible outcomes and relevant technical behaviour instead of relying on generic quality adjectives. Material entries distinguish base appearance, microtexture, roughness, metallic response, anisotropic reflection, transmission, refraction and lighting. Effect entries distinguish optical phenomena from post-production treatments and constrain intensity, subject preservation and edge behaviour. Mockup entries define product geometry, view angle, material response, blank artwork zones, lighting and commercial presentation constraints.

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

The catalogue contains 1,001 prompts across 20 populated collections. The base prompt records and specialist expansion records are loaded as one unified catalogue at runtime. Collection totals are calculated from the loaded records rather than hard-coded display values.

## Reliability and recovery

- All three pages use synchronized, versioned shared assets.
- Each page attempts to load the primary catalogue expansion and falls back to the verified snapshot at `backups/2026-11-17/catalogue-expansion.js` if the primary script fails to expose its data.
- `scripts/validate-catalogue.cjs` checks expected prompt and collection totals, minimum collection sizes, unique IDs, required prompt fields, category references and synchronized page asset versions.
- GitHub Pages deployment is gated on that validation passing.
- A full pre-maintenance snapshot is stored under `backups/2026-11-17/`; a separate Git branch `safety/pre-reliability-audit-2026-11-17` preserves the prior site state.

To restore the full snapshot, copy the files from `backups/2026-11-17/` back to the repository root and commit the restoration. To restore only the catalogue expansion, copy `backups/2026-11-17/catalogue-expansion.js` to the root as `catalogue-expansion.js`.
