/* Screenworld Engine v1.0 prototype — B5-C */
(function(root){
"use strict";
const SOURCES={
human:"preserve facial structure, expression, defining features and body proportions while redesigning wardrobe and surface language",
animal:"retain species anatomy, markings, posture and natural movement while translating shape language and expression",
object:"retain function, key geometry and recognisable construction while reimagining materials, detailing and environmental role",
collectible:"preserve distinctive silhouette, markings, pose and identifying details while adapting material, finish and construction",
vehicle:"preserve vehicle type, functional proportions and key features while translating design language, materials and context",
architecture:"preserve major spatial structure and landmarks while rebuilding material, environmental detail, scale cues and atmosphere"
};
const WORLDS={
"The Simpsons":{category:"TV Shows",dna:"yellow-toned skin and bold simplified anatomy, clean dark contour lines, flat saturated cel colours, rounded geometric forms, domestic sitcom staging and Springfield visual cues",production:"2D television cel-animation logic, readable silhouettes, economical shading and clear graphic staging"},
"Adventure Time":{category:"TV Shows",dna:"soft organic geometric silhouettes, minimal facial marks, candy-colour environments, surreal playful scale, simplified forms and whimsical fantasy motifs",production:"flat expressive 2D animation, shape-led character construction, restrained detail and storybook background design"},
"Arcane":{category:"TV Shows",dna:"painterly hybrid 2D/3D character rendering, textured brushwork, graphic contour accents, nuanced facial planes, dramatic colour contrast and richly layered industrial-fantasy environments",production:"highly authored hybrid animation, painterly surface passes, cinematic depth, selective sharpness and controlled light"},
"Blade Runner 2049":{category:"Films",dna:"monumental minimalist architecture, vast negative space, sculptural forms, muted atmospheric colour fields, reflective surfaces and scale-defining haze",production:"cinematic live-action production design, controlled wide-angle compositions, volumetric light, restrained texture and precise exposure"},
"Spider-Verse":{category:"Films",dna:"comic-book contour hierarchy, halftone and print textures, offset colour registration, graphic shadow shapes, dynamic perspective and layered visual rhythm",production:"stylized hybrid animation with deliberate frame variation, printed surface cues, graphic lighting and energetic composition"},
"Naruto":{category:"Anime",dna:"expressive anime facial construction, decisive linework, cel-shaded form, iconic costume shapes, elemental energy effects and readable action silhouettes",production:"anime key-art rendering, controlled line weight, dynamic perspective, selective speed lines and layered cel shading"},
"One Piece":{category:"Anime",dna:"elastic expressive anatomy, distinctive silhouette exaggeration, bold contour drawing, vivid adventure palette, whimsical environmental scale and expressive facial acting",production:"adventure anime illustration, clean cel-shading, energetic perspective, expressive posing and graphic effects"},
"Rotoscope Cinema":{category:"Other Screen Worlds",dna:"drawn contours anchored to photographic movement, selectively simplified anatomy, painterly frame detail and deliberate tension between realistic motion and illustrated surfaces",production:"rotoscoped frame construction, trace-informed gesture, variable contour and controlled paint or colour treatment"},
"Stop-Motion Miniature":{category:"Other Screen Worlds",dna:"handcrafted miniature scale, sculpted forms, practical fabric and material imperfections, visible assembly details, believable tiny-set props and tactile surfaces",production:"frame-by-frame miniature cinematography, macro lens behaviour, practical set lighting, subtle stop-motion pose logic and physically built environments"}
};
const NEG="Avoid generic style overlays, source subject pasted into a detached background, unrelated franchise characters, costume-only transformation, incompatible rendering methods, unexplained effects, distorted identity, arbitrary props, unreadable detail, text and watermarks.";
function compile(input){
if(!input||!input.target||!WORLDS[input.target])throw new Error("Unknown or missing destination world.");
const src=SOURCES[input.sourceType]||SOURCES.object,world=WORLDS[input.target],subject=(input.subject||"the supplied subject").trim();
return [
"SCREENWORLD TRANSFORMATION — "+input.target,
"SOURCE SUBJECT: "+subject+" ("+input.sourceType+").",
"SOURCE-AWARE RECONSTRUCTION: "+src+". Preserve defining anchors intentionally without freezing the source medium.",
"DESTINATION WORLD DNA: Reconstruct the subject and scene using "+world.dna+". Govern silhouette, form, surface, palette, materials and environment with these identity traits—not superficial decoration.",
"TRANSFORMATION ROUTE: Redesign shape grammar, material response, costume or object details and environmental role. Never force irrelevant anatomy or clothing onto objects, animals, vehicles or landscapes.",
"WORLD BUILD: Create a destination-native setting with coherent architecture, props, scale cues, motifs and spatial relationships. Ground the subject using contact, occlusion, shadows, reflections and atmosphere; avoid cutout-on-generic-background staging.",
"PRODUCTION LANGUAGE: "+world.production+". Match lighting, perspective, depth, edge treatment and detail density to this method.",
"COMPOSITION: Establish focal hierarchy and silhouette clarity. Integrate foreground, subject and background into one intentional scene.",
"CONTINUITY: Preserve source-defining features where they aid recognition. Do not replace the subject with a canonical franchise character or copy a scene unless requested.",
"FAILURE PREVENTION: "+NEG,
"FINAL CHECK: The result must read as a genuine reconstruction of the source as if designed, animated, filmed or physically produced inside "+input.target+"."
].join("\n\n");
}
root.ScreenworldEngine={version:"1.0-prototype",sources:SOURCES,worlds:WORLDS,compile};\nif(typeof module!=="undefined"&&module.exports)module.exports={ScreenworldEngine:root.ScreenworldEngine};
})(typeof window!=="undefined"?window:globalThis);
