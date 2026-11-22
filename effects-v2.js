/* LIBRARY Effects v2.0 — existing 125 Effects profiles, target-specific compiler */
(function(){
"use strict";
const profiles=(window.AI_PROMPT_EXPANSION||[]).filter(p=>p.category==="effects");
if(profiles.length!==125)throw new Error("Effects v2 expected 125 profiles; found "+profiles.length);
const categories=[
["Optical & Lens",/lens|bokeh|halation|anamorph|aberration|diopter|defocus|starburst|diffraction|peephole|fisheye|barrel|spherical|comatic|chromatic|vignette|flare|refraction|polarisation|polarization|interference|moire|lenticular|prism|spectral|kaleidoscop|tilt.shift|field.curvature/i],
["Light & Energy",/bloom|glow|flare|corona|caustic|scattering|particle|plasma|electric|energy|spark|ember|fire|streak|foil|rainbow|soap.film|oil.film/i],
["Motion & Temporal",/motion|trail|echo|stutter|frame|rolling.shutter|slow.shutter|flash.curtain|stop.motion|jitter|suspension|puppet|string|temporal|feedback|photogram|solargraph/i],
["Spatial Distortion",/distort|warp|displace|ripple|wave|squeeze|stretch|melt|re.form|heat.haze|mirage|topographic|contour|emboss|relief|paper.tear|inflatable|rubber.hose|jelly|shatter/i],
["Digital & Signal",/glitch|pixel|data.?mosh|data.?bend|scanline|vhs|crt|video|fax|dot.matrix|printer|inkjet|laser|thermal|signal|interlac|channel.separation|rgb|infrared|x.ray|night.vision|edge.detection|poster|threshold|sorting|compression/i],
["Print & Photochemical",/print|photochemical|cross.process|expired.film|emulsion|cyanotype|van.dyke|gum.bichromate|wet.plate|daguerreotype|polaroid|instant.film|reticulation|photogram|solargraph|negative|orange.mask|bleach.stain|screen.print|cmyk|halftone|sprocket|film.burn|fax|photocopy|risograph|offset/i],
["Atmospheric & Environmental",/fog|haze|mist|volumetric|underwater|heat.haze|mirage|scattering/i],
["Material & Physical",/chrome|inflatable|rubber.hose|claymation|fingerprint|emulsion.lift|liquid.chrome|paper.tear|foil|emboss|relief|soap.film|oil.film|film.burn|melt|physical|distress|scratch|glass.block/i],
["Colour & Perception",/colour|color|duotone|solarisation|solarization|thermal|infrared|x.ray|night.vision|contour|false.colou?r|polarisation|polarization|spectral|prismatic|oil.slick|interference/i],
["Exposure & Camera",/exposure|shutter|flash|photographic|camera|solargraph|photogram|film|negative|instant|contact.sheet|sprocket/i]
];
const tally={};
function classify(title){
 if(/liquid chrome|inflatable object|rubber.hose|claymation fingerprint|paper.tear dimensional|liquid emulsion lift|film burn|soap.film|oil.film|glass.block/i.test(title))return "Material & Physical";
 for(const [name,rx] of categories)if(rx.test(title))return name;return "Spatial Distortion";
}
function mechanism(title){const n=title.toLowerCase();
if(/chromatic aberration/.test(n))return "Separate wavelength-dependent fringes along high-contrast edges; keep central alignment and restrain fringe width.";
if(/lens flare|anamorphic streak|diffraction starburst/.test(n))return "Build a directional, source-driven optical streak or flare tied to bright emitters and optics.";
if(/motion|trail|echo|stutter|frame|shutter/.test(n))return "Resolve temporal samples with movement direction, spacing, persistence and decay; distinguish moving regions from stable surroundings.";
if(/ripple|warp|distort|displace|squeeze|stretch|melt|mirage|heat.haze|fisheye|barrel/.test(n))return "Define a displacement field with origin, vector, amplitude, scale, falloff and boundaries; retain unaffected geometry.";
if(/glitch|pixel|data|scanline|vhs|crt|fax|dot.matrix|printer|sorting|interlac|channel/.test(n))return "Recreate the named signal or reproduction failure using repeatable grid, channel, scan or sampling logic; preserve a clean identity baseline.";
if(/photochemical|cyanotype|van.dyke|gum.bichromate|wet.plate|daguerreotype|polaroid|instant.film|reticulation|cross.process|solarisation|solarization|bleach|emulsion|negative|film/.test(n))return "Model the named process as a specific exposure, emulsion, chemistry, transfer or inversion event with characteristic density, tonal response and edge behaviour.";
if(/thermal|infrared|x.ray|night.vision|contour|topographic/.test(n))return "Map information according to the named sensing modality, range, calibration and spatial field; preserve source shape.";
if(/bloom|glow|corona|caustic|scattering|particle|plasma|spark|ember|fire/.test(n))return "Trace energy from a credible source through emission, attenuation, reflection, scattering and occlusion with controlled intensity.";
if(/lenticular|holographic|prismatic|interference|iridescent|rainbow|polarisation|polarization|oil.slick|soap.film|thin.film/.test(n))return "Resolve wavelength, viewing angle, layer thickness or polarization into controlled spectral response; preserve the base image beneath it.";
return "Specify the effect's defining mechanism, origin, spatial or temporal footprint, scale, intensity, direction, falloff, distribution, affected zones and unaffected regions; avoid generic filter appearance.";
}
profiles.forEach(p=>{
 const cat=classify(p.title);p.subcategory=cat;tally[cat]=(tally[cat]||0)+1;if(!p.tags.includes(cat))p.tags.push(cat);
 p.prompt=[
 "EFFECT TRANSFORMATION — TARGET-SPECIFIC EFFECT SYSTEM",
 "SOURCE: [SUBJECT] / [SOURCE IMAGE]. Treat the supplied source as the identity and geometry reference. Preserve subject, defining features, composition and essential structure unless this effect explicitly requires a controlled local change.",
 "EFFECT TARGET: "+p.title,
 "EFFECT DOMAIN: "+cat,
 "VISUAL INTENT: Make "+p.title+" the dominant unmistakable treatment. It must read through its own image-forming mechanism—not a generic overlay.",
 "MECHANISM AND CAUSALITY: "+mechanism(p.title),
 "SPATIAL / TEMPORAL FIELD: Define origin, direction, scale, intensity, falloff, persistence and boundaries. Make affected regions coherent with the source and keep unaffected regions stable.",
 "SOURCE IDENTITY AND STRUCTURE LOCK: Preserve recognisable identity, silhouette, proportions, pose, object count, text, landmarks, viewpoint and scene relationships. Any change must be necessary for the named effect and remain local.",
 "LIGHT, COLOUR AND SIGNAL RESPONSE: Resolve brightness, colour, contrast, transparency, reflection, scattering, channels and exposure according to the effect. Maintain a clear focal hierarchy and avoid obscuring essential source information.",
 "INTEGRATION AND LAYERING: Integrate with depth, masking, occlusion, foreground/background and transitions. Avoid flat full-frame overlays unless the mechanism itself requires full-frame coverage.",
 "INTENSITY AND CONTROL: Make the effect legible but deliberate. Keep the primary subject readable; prevent clipping, excessive contrast and unrelated stacked effects.",
 "BOUNDARIES AND EXCLUSIONS: No subject replacement, unrelated props, random debris, arbitrary glow, generic glitch, uniform noise, inconsistent direction, impossible optical behaviour, unrequested scene expansion, watermark or signature.",
 "FINAL EFFECT-AWARE CHECK: Verify effect specificity, source fidelity, mechanism, scale, origin, direction, falloff, affected-zone boundaries, depth, light/colour response, intensity and clean unaffected regions."
 ].join("\n\n");
 p.negative="source identity loss, unrequested geometry change, unbounded effect coverage, generic overlay or filter, incorrect mechanism, random artifacts, incoherent light or signal, effect without origin, unrelated objects, watermark, signature";
 p.kind="effect";p.difficulty="Professional";
});
if(Object.keys(tally).length!==10)throw new Error("Effects v2 taxonomy missing groups: "+JSON.stringify(tally));
window.AI_PROMPT_EFFECTS_V2={version:"2.0",profiles:profiles.length,subcategoryCounts:tally,sections:12};
})();