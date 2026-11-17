# AI Prompt Library

A responsive, dark editorial prompt-discovery website built for the AI Prompt Library project.

## Design direction

The interface follows the approved hybrid direction: functional archive and search patterns combined with a distinctive editorial identity. The palette uses ink/charcoal foundations, signature neon orange interactions, and electric blue/violet artwork accents. Typography uses Space Grotesk for display text and Inter for interface/body copy.

## Included

- Responsive homepage and navigation
- Nine collection entry points
- Prompt archive with text search, collection filter, model filter and sorting
- Prompt detail dialog with copy-ready positive and negative prompts
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

The current data file contains a small representative seed catalogue to demonstrate the interface. The project history refers to 36 existing prompts and three active collections, but those source prompt records were not present in the empty GitHub repository at initialisation. The nine collection pathways are represented; the remaining prompt records should be imported from the authoritative prompt library rather than fabricated.

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

A GitHub Actions workflow has been added at `.github/workflows/pages.yml` to publish the static site to GitHub Pages on pushes to `main`. The Pages deployment has not yet been verified. Vercel project creation was blocked by the connected Vercel account permissions, so no Vercel project or deployment was created. No backend secrets or API keys are required for the current prototype.
