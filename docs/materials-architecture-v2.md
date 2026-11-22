# Materials Architecture v2.0 — Phase B1

**Status:** architecture refinement implemented on the isolated Phase B1 branch; approval is conditional on the new catalogue and browser regression gates passing.

## Architectural decision

Materials is a target-specific transformation system, not a generic prompt sentence with a material name substituted. Each of the 200 catalogue records is generated from a material profile and has an explicit catalogue subcategory.

The shared prompt architecture executes in this order:

1. **Source identity lock** — preserve subject identity, silhouette, proportions, pose, part count, viewpoint, crop, controls, apertures, text, joints and functional relationships.
2. **Material identity** — state the relevant composition and distinguish it from visually similar materials.
3. **Bulk structure and microstructure** — describe grain, fibres, pores, layers, particles, matrix, crystalline structure or active coating at a scale appropriate to the source.
4. **Formation and manufacturing evidence** — describe the credible process and its visible consequences at seams, edges, joins, cut faces, mould transitions and contact points.
5. **Mechanical and environmental behaviour** — resolve stiffness, brittleness, flexibility, load paths, gravity, moisture, heat, containment, recovery or stimulus response where relevant.
6. **Optical response** — specify reflectance, roughness, transmission, refraction, scattering, absorption, anisotropy, structural colour or emission as applicable.
7. **Material boundaries and exclusions** — prevent common false analogies, impossible physics, unsupported geometry and unwanted scene additions.
8. **Final source-aware check** — verify source identity, geometry, part count, functionality, material physics, process logic and optical coherence.

The profile architecture deliberately distinguishes bulk material from surface coating, reinforcement, textile construction and optical treatment. Porosity must not be interpreted as permission to redesign a solid component as an open lattice.

## Target-specific behaviour

Every generated Materials record includes:
- the existing stable record ID and title;
- the existing `materials` collection key;
- an explicit `subcategory` property and matching tag;
- a material-specific description;
- a complete professional prompt retaining the `[SUBJECT]` input contract;
- material-aware negative constraints;
- the existing supported image-model metadata and visual card metadata.

No new collection or front-end control is required. The existing catalogue, Explore filter, Builder and Randomiser continue to consume the same prompt record shape.

## Taxonomy corrections

Material subcategories are explicitly assigned at generation time, avoiding dependence on overlapping keyword-regex order.

- **Ferrofluid** → Liquids & Gels. A magnetic nanoparticle suspension is not a bulk metal.
- **Shape-memory alloy mesh** and **Nitinol wire fabric** → Metals & Alloys. The wire is metallic even where it is assembled as an open mesh or textile.
- **Aerogel** → Polymers & Composites as the catalogue's stable broad class; the prompt defaults to silica aerogel and acknowledges polymeric chemistry only when specified.
- **Carbon fibre** → Polymers & Composites, with continuous reinforcement filaments and resin-matrix lay-up.
- **Bone china** → Glass & Ceramics.
- **Cork leather** → Wood & Plant Fibres.
- **Waxed canvas** → Textiles & Fabrics.
- **Hempcrete** → Construction & Earth.
- **Parchment and vellum** remain animal-derived sheet materials; paper and cellulose materials retain their distinct sheet-formation logic.

## Visual evaluation

A comparative source-based visual pass used six deliberately different source subjects: a rotary telephone, anatomical hand sculpture, origami crane, guarded quadcopter, moth and running shoe. The treatments exercised brushed aluminium, natural timber, silica aerogel, mycelium composite, nacre and recycled ocean plastic.

| Case | Observed result | Architecture response |
|---|---|---|
| Brushed aluminium / rotary phone | Silhouette, receiver, dial, cord and major markings remained legible; directional metal grain and restrained anisotropic reflection were visible | Retain directional-grain and edge-transition rules |
| Natural timber / hand sculpture | Hand form and five-digit anatomy remained recognisable; grain was convincing but locally inconsistent | Explicitly align grain to each structural part and expose end grain only at actual cuts |
| Silica aerogel / origami crane | Folded silhouette remained clear; a delicate translucent porous network was visible | Keep chemistry explicit and require continuous support paths for fragile spans |
| Mycelium composite / drone | Material looked porous, but the drone's solid structural components became too lattice-like | Add dense moulded-surface logic; expose porosity mainly at cut edges; prohibit changing load-bearing parts into open lattice or blocking functional clearances |
| Nacre / moth | Wing silhouette and antennae remained legible; angle-dependent pearlescence was strong | Retain lamellar microstructure and local, directional structural colour |
| Recycled ocean plastic / shoe | Shoe identity and major component boundaries remained; embedded recovered fragments were visible | Retain a continuous polymer matrix; distinguish flexible upper and wear-bearing sole; prohibit loose litter props |

This was a directional visual architecture test, not a claim that all 200 prompts have been individually rendered or that image-model output is deterministic. The new regression suite checks the actual generated 200-record catalogue structurally, while the visual findings above inform the profile constraints.

## Approval gate

The architecture can be approved only when all of the following are green:

- the 200-record Materials architecture test;
- existing full catalogue validation (1,521 records, stable IDs and collection totals);
- prototype regression suite;
- prompt-quality audit with no blocking errors;
- desktop and mobile browser smoke tests;
- targeted Materials filter and Builder integration checks;
- Randomiser single/multi-module regression and combined-prompt checks.

Mass generation does not alter the existing 200 record titles or ID sequence. No merge, deployment, or production change is part of Phase B1.
