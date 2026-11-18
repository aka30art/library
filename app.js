const collections = [
{id:"materials",name:"Materials",count:0,icon:"▧",tone:"orange",bg:"linear-gradient(120deg,#42474b,#15191e 54%,#8b8c88)"},
{id:"styles",name:"Styles",count:0,icon:"✦",tone:"violet",bg:"linear-gradient(135deg,#39265c,#d15b64 55%,#10151e)"},
{id:"textures",name:"Textures",count:0,icon:"▤",tone:"blue",bg:"linear-gradient(135deg,#26394b,#8b6b50 52%,#121923)"},
{id:"lighting",name:"Photography Post-Edits",count:0,icon:"☼",tone:"orange",bg:"linear-gradient(135deg,#b5a58b,#46505a 48%,#151a22)"},
{id:"effects",name:"Effects",count:0,icon:"◉",tone:"violet",bg:"linear-gradient(130deg,#ffb52e,#e85d37 48%,#30245e)"},
{id:"composition",name:"Composition",count:0,icon:"▦",tone:"green",bg:"linear-gradient(130deg,#173c35,#111820)"},
{id:"rendering",name:"Rendering",count:0,icon:"⬡",tone:"blue",bg:"linear-gradient(135deg,#b6c0c2,#343d46 55%,#111820)"},
{id:"colour-atmosphere",name:"Colour & Atmosphere",count:0,icon:"◌",tone:"violet",bg:"linear-gradient(135deg,#39265c,#d15b64 55%,#10151e)"},
{id:"films-shows",name:"Films & Shows",count:0,icon:"▣",tone:"violet",bg:"linear-gradient(135deg,#34264d,#b94b58 55%,#111820)"},
{id:"toys-collectibles",name:"Toys & Collectibles",count:0,icon:"✧",tone:"orange",bg:"linear-gradient(135deg,#4b3528,#bd7b45 55%,#111820)"}
{id:"architecture-spaces",name:"Architecture & Spaces",count:0,icon:"⌂",tone:"blue",bg:"linear-gradient(135deg,#1c3545,#6d8997 55%,#111820)"},
{id:"sculpture-3d-objects",name:"Sculpture & 3D Objects",count:0,icon:"⬡",tone:"violet",bg:"linear-gradient(135deg,#292a38,#9478a2 55%,#111820)"},
{id:"graphic-design-layout",name:"Graphic Design & Layout",count:0,icon:"▣",tone:"orange",bg:"linear-gradient(135deg,#43352b,#d09a5e 55%,#111820)"},
{id:"photography-camera",name:"Photography & Camera",count:0,icon:"◉",tone:"green",bg:"linear-gradient(135deg,#233c39,#8b9991 55%,#111820)"},
{id:"product-design",name:"Product Design",count:0,icon:"◇",tone:"blue",bg:"linear-gradient(135deg,#29343f,#7c8e9d 55%,#111820)"}
];
let prompts = [];
prompts.push(...(window.AI_PROMPT_EXPANSION||[]));
const originalCatalogue=prompts;
prompts=originalCatalogue.map(p=>({...p}));
window.AI_PROMPT_LIBRARY_ARCHIVE=[];
window.AI_PROMPT_BUILDER_CATALOGUE=originalCatalogue;
collections.forEach(c=>c.count=prompts.filter(p=>p.category===c.id).length);
const catalogueAudit={total:originalCatalogue.length,visible:prompts.length,builderElements:originalCatalogue.length,collections:collections.length};
window.AI_PROMPT_LIBRARY_AUDIT=catalogueAudit;
const $=s=>document.querySelector(s);
const collectionName=id=>collections.find(c=>c.id===id)?.name||id;
const subcategoryTaxonomy={"materials":[["Metals & Alloys",{"__regex":"aluminium|aluminum|chrome|copper|titanium|iron|steel|brass|bronze|pewter|tungsten|alloy|metal|ferrofluid|bismuth|gallium|graphene|graphite|nitinol|sintered|electroformed|magnetorheological"}],["Wood & Plant Fibres",{"__regex":"wood|timber|bamboo|cork|rattan|hemp|linen|cotton|jute|sisal|abaca|ramie|coir|kapok|pineapple|banana fibre|plant fibre|paper|washi|kozo|lokta|mulberry|cellulose|sailcloth|canvas"}],["Flora & Fungi",{"__regex":"mycelium|mushroom|moss|lichen|flower|pollen|plant|leaf|kelp|seaweed|cellulose|coir|kapok|hemp|sisal|abaca|ramie|pineapple|banana fibre|coconut|sugar|caramel|beeswax|carnauba|wax"}],["Fauna & Animal-derived",{"__regex":"leather|skin|hide|shell|nacre|abalone|mother.of.pearl|shagreen|stingray|fish.scale|fish leather|eel skin|eggshell|ostrich|bone|chitin|silk|wool|alpaca|mohair|cashmere|feather|quill|cocoon|spider.silk|reindeer|porcupine|peacock|beetle|butterfly|cicada|sea.urchin"}],["Wood & Plant Fibres",{"__regex":"wood|timber|bamboo|cork|rattan|hemp|linen|cotton|jute|sisal|abaca|ramie|coir|kapok|pineapple|banana fibre|plant fibre|paper|washi|kozo|lokta|mulberry|washi|cellulose|sailcloth|canvas"}],["Stone & Minerals",{"__regex":"stone|marble|travertine|basalt|slate|onyx|obsidian|granite|sandstone|soapstone|amber|copal|jet stone|labradorite|moonstone|malachite|lapis|turquoise|rhodochrosite|fluorite|mica|pumice|diatomaceous|gypsum|alabaster|salt crystal|mineral|meteorite"}],["Glass & Ceramics",{"__regex":"glass|ceramic|porcelain|glaze|celadon|raku|vitreous|dichroic|sugar glass"}],["Textiles & Fabrics",{"__regex":"woven|fabric|textile|felt|yarn|knit|bouclé|chenille|velvet|corduroy|tweed|brocade|organza|tulle|fleece|suede|denim|tyvek|weave|aramid|kevlar|fibreglass|fibre|fiber|nylon|silk|wool|cotton|linen|canvas|oilskin|sailcloth|rope|braid"}],["Polymers & Composites",{"__regex":"resin|rubber|plastic|silicone|composite|bioplastic|polymer|aerogel|carbon fibre|carbon nanotube|fibreglass|foam|ptfe|hydrogel|elastomer|vinyl|casein plastic|tyvek|graphene film"}],["Paper & Cellulose",{"__regex":"paper|pulp|parchment|vellum|washi|kozo|lokta|mulberry|cellulose|receipt|newsprint"}],["Liquids & Gels",{"__regex":"liquid|gel|fluid|hydrogel|magnetorheological|shear.thickening|agar|gelatin|alginate"}],["Construction & Earth",{"__regex":"concrete|hempcrete|plaster|tadelakt|limewash|rammed earth|adobe|earth block|gypsum|earth|wax|encaustic"}]],"styles":[["Art Movements",{"__regex":"bauhaus|constructiv|expression|surreal|de stijl|art deco|art nouveau|futurism|supremat|dada|impression|precision|orphan|or-ph|vortic|or-ph|tachisme|fluxus|arte povera|land art|process art|kinetic art|new objectivity|metaphysical|co.br|gutai|mono.ha|systems art|synchromism|synthetism|neo.geo|stuckism|art brut|outsider art|unilalianism|excessivism"}],["Graphic Design & Typography",{"__regex":"graphic|swiss|poster|risograph|constructivist|pixação|lettering|chicha|2 tone|webcore|collage|print|woodcut|pop art|memphis|op art"}],["Illustration & Drawing",{"__regex":"illustrat|anime|manga|inkwork|woodcut|ukiyo|sumi.e|naive art|folk|comic|concept art|dark fantasy|mythpunk|storybook|psychedelic poster"}],["Photography & Realism",{"__regex":"photoreal|hyperreal|cinematic realism|painterly realism|new objectivity|magic realism"}],["Digital & Generative",{"__regex":"pixel|low.poly|generative|plotter|glitch|data.mosh|digital|frutiger|y2k|webcore|dreamcore|weirdcore|kidcore|liminal|analog horror"}],["Futurism & Speculative",{"__regex":"futur|cyberpunk|solarpunk|biopunk|steampunk|retrofutur|vaporwave|synthwave|cassette futurism|atompunk|dieselpunk|afrofutur|space|sci.fi"}],["Folk & Traditional",{"__regex":"ukiyo|sumi.e|folk|arts and crafts|wiener|vienna secession|chicha|woodcut|minjung|naive constructivism"}],["Pop & Subculture",{"__regex":"pop art|lowbrow|pop surreal|toyism|kidcore|goblin.core|cottagecore|mallsoft|gothic|psychedelic|dungeon synth|hauntology"}]],"textures":[["Natural & Biological",{"__regex":"bark|reptile|feather|fur|crystal growth|lichen|moss|coral|petrified|shell|wood knot|beeswax|pollen|biological|skin|scale|cocoon|spider|cicada|butterfly|fung|organic|sea.urchin"}],["Mineral & Geological",{"__regex":"mineral|crystal|sediment|lava|salt|stone|geode|selenite|meteorite|glacier|snow|volcanic|sand|mud|desert varnish|ice striation"}],["Metal & Industrial",{"__regex":"metal|steel|rust|oxide|sintered|electroform|carbon weave|microgroove|foil|powder.coat|chainmail|magnetic tape|vinyl record|cd diffraction"}],["Textile & Fibres",{"__regex":"woven|fibre|fiber|knit|embroidery|tuft|pile|suede|fleece|boucle|terry|carpet|velcro|fabric|tape cloth|ribbon|cotton|chenille|tulle"}],["Paper & Print",{"__regex":"paper|parchment|newsprint|risograph|photocopier|toner|carbon.paper|receipt|ink|print|cardstock"}],["Liquid & Atmospheric",{"__regex":"condensation|water|ripple|foam|bubble|suds|gel|droplet|mist|vapour|vapor|smoke|cloud|haze"}],["Synthetic & Manufactured",{"__regex":"plastic|rubber|foam|latex|adhesive|tape|vinyl|lcd|pixel|synthetic|microfibre|microfiber|astro turf|artificial grass|shrink|balloon"}],["Surface Wear & Ageing",{"__regex":"patina|abrasion|scratch|fracture|crack|aged|wear|distress|peel|oxid|corrosion|blister|crackle|craz|wrinkle|fade|stain|weather"}]],"lighting":[["Film Emulation",{"__regex":"portra|kodak|kodachrome|ektachrome|fujifilm|superia|cinestill|ilford|tri.x|fomapan|film|negative|slide"}],["Colour Grading",{"__regex":"teal|orange|nordic|colour grade|color grade|bleach.bypass|silver retention|warm|cool|muted|sun.bleached|cinematic grade"}],["Monochrome & Black-and-White",{"__regex":"black.and.white|monochrome|tri.x|hp5|silver|duotone|sepia"}],["Analogue & Vintage",{"__regex":"analog|analogue|vintage|retro|disposable.camera|expired|chemical shift|1970s|1990s|2000s|nostalgia"}],["Digital & Sensor",{"__regex":"ccd|digital|sensor|compact.camera|digital noise|pixel|scan|chromatic aberration"}],["Light & Lens Effects",{"__regex":"halation|bloom|flare|lens|bokeh|diffusion|glow|soft focus|vignette|flash|long exposure"}],["Restoration & Finish",{"__regex":"restor|archival|fade repair|dust removal|scratch removal|retouch|finish|print preparation"}]],"effects":[["Light & Optical",{"__regex":"light|optical|lens|prism|chromatic|caustic|refraction|reflection|glow|bloom|flare|halo|iridescen|holograph|diffraction|laser"}],["Atmospheric & Weather",{"__regex":"fog|mist|haze|smoke|cloud|rain|snow|storm|wind|dust|underwater|volumetric|atmospher|weather"}],["Motion & Distortion",{"__regex":"motion|blur|warp|distort|ripple|wave|liquid|melt|twist|stretch|displace|echo|trail|kinetic"}],["Particles & Energy",{"__regex":"particle|spark|ember|fire|flame|electric|plasma|energy|explosion|debris|shatter|ash|dust|powder"}],["Material & Surface",{"__regex":"texture|surface|metal|glass|liquid|crystal|frost|ice|rust|corrosion|crack|peel|melt|grain|emboss"}],["Digital & Glitch",{"__regex":"glitch|pixel|datamosh|scanline|digital|noise|compression|signal|rgb split|bitcrush|vhs|crt"}]],"composition":[["Layout & Grid",{"__regex":"grid|layout|editorial|swiss|modular|column|typographic|poster|panel|triptych|diptych"}],["Geometric & Abstract",{"__regex":"geometric|radial|spiral|circle|triangle|polygon|symmetry|tessellation|fractal|modular|bauhaus|abstract"}],["Perspective & Depth",{"__regex":"perspective|isometric|axonometric|vanishing|depth|layer|foreground|background|overhead|top.down|worm.s.eye|bird.s.eye"}],["Framing & Cropping",{"__regex":"frame|framing|crop|close.up|macro|wide.angle|portrait|panorama|negative space|silhouette"}],["Balance & Symmetry",{"__regex":"balanced|symmetr|asymmetr|centered|centred|golden ratio|rule of thirds|mirror|radial"}],["Dynamic & Motion",{"__regex":"dynamic|diagonal|motion|action|kinetic|leading line|trajectory|sequence|flow|movement"}]],"rendering":[["3D & CGI",{"__regex":"3d|cgi|ray.trac|path.trac|polygon|voxel|wireframe|mesh|subsurface|global illumination|unreal|octane|blender|render engine"}],["Photorealism",{"__regex":"photoreal|hyperreal|realistic|physically based|pbr|product photography|studio photograph"}],["Stylised & Illustration",{"__regex":"illustrat|anime|cartoon|stylized|stylised|cel.shad|toon|painterly|vector|comic|ink"}],["Material Rendering",{"__regex":"material|metal|glass|fabric|wood|stone|translucen|subsurface|surface|shader|texture"}],["Product & Studio",{"__regex":"product|packaging|commercial|catalogue|catalog|studio|turntable|mockup|industrial design"}],["Technical & Architectural",{"__regex":"architect|technical|blueprint|cad|isometric|engineering|diagram|exploded view|industrial"}]],"colour-atmosphere":[["Colour Palettes",{"__regex":"palette|colour|color|chromatic|monochrome|duotone|complementary|analogous|triadic|gradient|spectrum"}],["Lighting & Time of Day",{"__regex":"sunrise|sunset|golden hour|blue hour|dawn|dusk|nocturnal|moonlight|daylight|twilight|backlit"}],["Weather & Environment",{"__regex":"rain|storm|fog|mist|snow|desert|forest|ocean|underwater|mountain|urban|coastal|arctic|tropical"}],["Mood & Emotion",{"__regex":"melanchol|serene|eerie|dream|nostalg|tense|romantic|ominous|tranquil|surreal|hopeful|dramatic"}],["Cinematic Atmosphere",{"__regex":"cinematic|film|noir|neo.noir|teal|orange|volumetric|haze|smoke|atmospheric"}]],"films-shows":[["TV Shows",null],["Cartoons",null],["Films",null],["Anime",null],["Other Screen Worlds",null]],"architecture-spaces":[["Urban Architecture",{"__regex":"^$"}],["Residential Architecture",{"__regex":"^$"}],["Interior Architecture",{"__regex":"^$"}],["Civic & Institutional",{"__regex":"^$"}],["Sacred & Contemplative",{"__regex":"^$"}]],
"sculpture-3d-objects":[["Monolithic Form",{"__regex":"^$"}],["Assembled Sculpture",{"__regex":"^$"}],["Kinetic Sculpture",{"__regex":"^$"}],["Biomorphic Sculpture",{"__regex":"^$"}],["Public Monument",{"__regex":"^$"}]],
"graphic-design-layout":[["Editorial Systems",{"__regex":"^$"}],["Poster Composition",{"__regex":"^$"}],["Typographic Experiment",{"__regex":"^$"}],["Brand Applications",{"__regex":"^$"}],["Print & Production",{"__regex":"^$"}]],
"photography-camera":[["Lens & Perspective",{"__regex":"^$"}],["Exposure & Capture",{"__regex":"^$"}],["Photographic Genres",{"__regex":"^$"}],["Camera Movement",{"__regex":"^$"}],["Focus & Depth",{"__regex":"^$"}]],
"product-design":[["Industrial Objects",{"__regex":"^$"}],["Consumer Electronics",{"__regex":"^$"}],["Furniture & Lighting",{"__regex":"^$"}],["Packaging & Containers",{"__regex":"^$"}],["Concept Products",{"__regex":"^$"}]],
"toys-collectibles":[["Action Figures & Dolls",{"__regex":"action figure|six.inch|hot toys|1:6|fashion doll|american girl|transformers"}],["Vinyl & Designer Toys",{"__regex":"vinyl|designer|blind.box|gashapon|capsule toy|retro 1980s|vintage 1990s"}],["Plush & Soft Toys",{"__regex":"plush|bean|beanie|soft toy"}],["Construction & Building Sets",{"__regex":"lego|brick|construction set|building set"}],["Die-Cast & Vehicles",{"__regex":"die.cast|hot wheels|matchbox|vehicle|car\\b|blaster"}],["TCG",{"__regex":"trading card|tcg|pokemon|pokémon|magic: the gathering|mythic rare|planeswalker|mana cost|commander card|showcase card|borderless card|serialized magic|yu.gi.oh|ghost rare|starlight rare|ultimate rare|collector.s rare|quarter century secret|one piece|manga rare|treasure rare|parallel leader|special parallel|lorcana|enchanted rare|iconic rare|epic rare|sports card|rookie card|hockey card|football soccer card|basketball rookie|baseball rookie|superfractor|autograph relic|patch card|double rare|ultra rare|secret rare|illustration rare|special illustration rare|hyper rare|mega hyper rare|mega attack rare|ace spec|radiant rare|shiny rare|amazing rare|rare holo|rare prime|rare break|quarter century|serialized|one.of.one|1/1|parallel|refractor|holographic|holofoil|foil card|textured foil|rainbow foil|ghost foil|cracked ice|prizm|chrome|autograph|signed card|relic|memorabilia|game.worn|on.card auto|sticker auto|booster pack|playmat|card back|graded trading card slab|card sleeve|deck box"}],["Scale Models & Statues",{"__regex":"scale model|miniature|premium statue|display statue|collector figure"}],["Puzzles & Games",{"__regex":"puzzle|rubik|game"}]]};;
function subcategoryFor(p){
 if(p.category==="films-shows"){const known=["TV Shows","Cartoons","Films","Anime","Other Screen Worlds"];return known.find(x=>(p.tags||[]).includes(x))||"Other Screen Worlds";}
 const rules=subcategoryTaxonomy[p.category]||[];const exact=(p.tags||[]).find(tag=>rules.some(([name])=>name===tag));if(exact)return exact;const hay=[p.title,p.desc,...(p.tags||[])].join(" ").toLowerCase();
 for(const [name,rule] of rules){if(rule&&new RegExp(rule.__regex,"i").test(hay))return name;}
 return "Other";
}
function updateSubcategoryOptions(category){
 const select=$("#subcategory-filter");if(!select)return;
 const options=subcategoryTaxonomy[category]||[];
 if(category==="all"||!options.length){select.hidden=true;select.innerHTML='<option value="all">All subcategories</option>';select.value="all";return;}
 const counts=new Map();prompts.filter(p=>p.category===category).forEach(p=>{const key=subcategoryFor(p);counts.set(key,(counts.get(key)||0)+1);});
 select.innerHTML='<option value="all">All subcategories ('+prompts.filter(p=>p.category===category).length+')</option>'+options.map(([name])=>'<option value="'+name.replace(/&/g,'&amp;')+'">'+name+' ('+(counts.get(name)||0)+')</option>').join('')+'<option value="Other">Other ('+(counts.get("Other")||0)+')</option>';
 select.hidden=false;select.value="all";
}

const promptGrid=$("#prompt-grid");
let activePrompt=null,showingAll=document.body.dataset.page==="explore";
function collectionCard(c){return `<a class="collection-card" data-tone="${c.tone}" href="#archive" data-category="${c.id}" style="--card-bg:${c.bg}"><span class="collection-icon">${c.icon}</span><span class="collection-meta"><strong>${c.name}</strong><small>${c.count} prompts</small></span><span class="collection-arrow">→</span></a>`}
function thumb(p){return `<div class="prompt-thumb" data-kind="${p.kind}" style="--thumb-bg:${p.bg};--thumb-art:${p.art};--thumb-glow:${p.glow}"><div class="thumb-art"></div><button class="bookmark" aria-label="Save ${p.title}" title="Save prompt">♧</button></div>`}
function promptCard(p){return `<article class="prompt-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Open ${p.title}">${thumb(p)}<div class="prompt-info"><h3>${p.title}</h3><div class="prompt-meta"><span class="pill">${collectionName(p.category)}</span><small>${difficulty(p)} ↗</small></div></div></article>`}
function difficulty(p){const t=(p.tags||[]).join(" ").toLowerCase();return p.difficulty||((p.prompt.length>520||/technical|optical|physics|procedural|macro/.test(t))?"Professional":p.prompt.length>300?"Advanced":"Foundation");}
function masterPrompt(p){return `UNIVERSAL ART DNA — MASTER PROMPT
Transform the following creative brief into a fully art-directed, visually coherent image while preserving its original subject, intent and essential technical requirements.

CORE CREATIVE BRIEF:
${p.prompt}

ART DIRECTION:
Establish a clear visual concept and focal hierarchy. Refine the composition, spatial relationships, framing, camera perspective and negative space. Develop a deliberate colour strategy, tonal structure and lighting design. Give every material, surface and object physically or stylistically coherent behaviour. Introduce depth, atmosphere and controlled detail without clutter. Make every visual decision support the original concept.

CRAFT & FIDELITY:
Prioritise accurate subject construction, intentional shape language, convincing textures, coherent shadows and reflections, clean edge behaviour and consistent perspective. Balance micro-detail with overall readability. Deliver a distinctive, polished result with professional visual judgement.

PRESERVATION RULES:
Do not change the core subject, remove essential details, invent unrelated objects, distort required geometry or compromise the original output purpose. Do not add decorative effects unless they strengthen the brief. Retain all explicit constraints.

OUTPUT INTENT:
${p.desc}
Create a resolved, high-quality image with strong visual identity and disciplined execution.`;}
function universalTemplatePrompt(p){
return `UNIVERSAL TEMPLATE PROMPT — VARIABLE-BASED GENERATION
Use this reusable structure to generate a new visual from a defined creative brief. Replace every bracketed field with a precise value; remove any field that is not relevant. Do not leave unresolved placeholders in the final generation.

[PRIMARY SUBJECT]: ${p.title.split(" — ")[0]} / [INSERT SUBJECT OR OBJECT]
[SUBJECT DESCRIPTION & DISTINCTIVE FEATURES]: [DEFINE FORM, IDENTITY, PROPORTIONS, DETAILS AND REQUIRED CHARACTERISTICS]
[VISUAL STYLE / ART MOVEMENT]: [INSERT STYLE, REFERENCE LANGUAGE OR ART DIRECTION]
[MEDIUM / MATERIAL / SURFACE]: [INSERT MATERIALS, FINISHES, TEXTURES OR RENDERING MEDIUM]
[ENVIRONMENT / BACKGROUND]: [INSERT SETTING, CONTEXT AND ATMOSPHERIC CONDITIONS]
[COMPOSITION & CAMERA]: [INSERT VIEWPOINT, LENS OR PERSPECTIVE, FRAMING, SCALE, HIERARCHY AND NEGATIVE SPACE]
[LIGHTING]: [INSERT LIGHT SOURCE, DIRECTION, QUALITY, CONTRAST AND COLOUR TEMPERATURE]
[COLOUR SYSTEM]: [INSERT PALETTE, TONAL RANGE AND COLOUR RELATIONSHIPS]
[DETAIL & FIDELITY]: [INSERT REQUIRED MICRO-DETAIL, REALISM LEVEL, EDGE QUALITY AND FINISH]
[OUTPUT FORMAT / PURPOSE]: [INSERT ASPECT RATIO, RESOLUTION, PRESENTATION OR PRODUCTION USE]

GENERATION BRIEF:
Create [PRIMARY SUBJECT] as [SUBJECT DESCRIPTION & DISTINCTIVE FEATURES]. Interpret the brief through [VISUAL STYLE / ART MOVEMENT], using [MEDIUM / MATERIAL / SURFACE]. Place the subject within [ENVIRONMENT / BACKGROUND]. Construct the image using [COMPOSITION & CAMERA]. Illuminate it with [LIGHTING] and apply [COLOUR SYSTEM]. Prioritise [DETAIL & FIDELITY]. The final output must satisfy [OUTPUT FORMAT / PURPOSE].

SUBJECT-SPECIFIC CREATIVE DIRECTION:
Use the following specialist reference as the starting point, adapting it to the completed variables rather than copying it mechanically:
${p.prompt}

QUALITY CONTROL:
Maintain internal consistency between subject, scale, materials, lighting, perspective and visual style. Establish one clear focal hierarchy. Avoid generic filler, contradictory instructions, accidental clutter, malformed structure, weak material response and details that do not support the brief.

[NEGATIVE PROMPT / EXCLUSIONS]: ${p.negative}
`;
}
function universalTransformationPrompt(p){
if(p.category==="films-shows"){
return `UNIVERSAL TRANSFORMATION PROMPT — COMPLETE SCREEN-UNIVERSE RE-CREATION

SOURCE INPUT:
Use the supplied image as the sole source of the original subject's identity and defining characteristics. Do not replace the source with a newly invented person, character or object.

TARGET UNIVERSE:
${p.title}

TRANSFORMATION OBJECTIVE:
Transform the original subject so they look as though they genuinely belong inside the specific visual universe of ${p.title}. Recreate both the subject's presentation and the surrounding world. This must be a complete character/object, costume, environment and art-direction transformation — not simply a colour filter, rendering overlay or generic style imitation.

SUBJECT AND CHARACTER DESIGN:
Preserve the original subject's recognisable identity, face or defining geometry, core proportions and characteristic features. Reimagine their visible styling to fit the target universe. If the source is a person or character, redesign their clothing, costume, footwear, accessories, hairstyle or headwear using the target universe's wardrobe, silhouettes, materials and character-design conventions. They should look like a character who belongs in that world, while still being recognisable as the original person. Do not retain incompatible source clothing merely for the sake of preservation. If the source is an object, redesign its construction, materials, detailing and surface language so it looks native to that universe. Adapt animals and creatures in the same way while retaining their recognisable identity.

ENVIRONMENT AND WORLD-BUILDING:
Transform the surroundings to match the selected universe. Adapt or replace the original background with fitting architecture, interiors, streets, landscapes, technology, props, set dressing and atmospheric details. Use recognisable visual cues from the selected production's world and production design. The environment must feel like a believable location from that specific show, film, cartoon or anime, not an unchanged photograph with a new filter.

UNIFIED VISUAL LANGUAGE:
Apply the target universe consistently to subject design, costume, materials, environment, props, lighting, colour grading, atmosphere, camera language, perspective, linework, shading, rendering and overall production finish. Reproduce the distinctive aesthetic and visual grammar of the selected title rather than relying on generic genre conventions. Aim for the result to read as an authentic frame, cinematic still or key visual from that universe.

SOURCE PRESERVATION AND CREATIVE PERMISSION:
Keep the original subject recognisable. Preserve defining facial characteristics or object geometry, essential proportions and key identity cues. Permit substantial changes to clothing, styling, background, props, lighting and composition whenever needed to make the transformation convincing. Do not substitute the source subject with an existing named franchise character. Do not add unrelated main characters, logos, watermarks or captions.

SCENE CONTROL:
[OPTIONAL SCENE / LOCATION / ACTION — IF LEFT BLANK, CREATE A NATURAL SCENE THAT FITS THE TARGET UNIVERSE.]

TARGET-SPECIFIC VISUAL DIRECTION:
${p.prompt}

FINAL REQUIREMENT:
The finished image must unmistakably combine the original subject's identity with the complete visual world of ${p.title}. The subject must look as though they belong in that universe, and the environment must reinforce the same universe. Avoid a superficial style transfer.

Avoid: ${p.negative}
`;
}
return `UNIVERSAL TRANSFORMATION PROMPT

Transform the supplied image by applying the visual treatment of ${p.title}. Use the existing image as the source and preserve its subject.

Apply this complete visual treatment to the source image:
${p.prompt}

Interpret the treatment above as the target style, material, surface, effect or rendering direction. Transfer its relevant visual characteristics onto the existing subject; do not recreate or substitute the example subject described in the treatment prompt.

Preserve the source subject's identity, defining features, shape, proportions, pose, expression, objects and composition. Modify only its visual treatment as needed to achieve the result. Keep all unrelated details unchanged.

Avoid: ${p.negative}
`;
}
function renderCollections(){
 if($("#collection-grid"))$("#collection-grid").innerHTML=collections.map(collectionCard).join("");
 if($("#category-filter"))$("#category-filter").innerHTML='<option value="all">All collections</option>'+collections.map(c=>'<option value="'+c.id+'">'+c.name+' ('+c.count+')</option>').join("");
 document.querySelectorAll(".collection-card").forEach(el=>el.addEventListener("click",()=>{if($("#category-filter"))$("#category-filter").value=el.dataset.category;if($("#subcategory-filter"))updateSubcategoryOptions(el.dataset.category);showingAll=true;filterPrompts();}));
}
function intelligenceEscape(s){return String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function promptProfileHTML(p){
 const I=window.PromptIntelligence;if(!I)return "";
 const a=I.analyze(p),list=v=>v&&v.length?v.map(intelligenceEscape).join(", "):"—",rel=I.related(p,prompts,4);
 const cells=[["Target / Scope",a.target],["Style DNA",a.styles],["Material DNA",a.materials],["Surface / Texture",a.textures],["Lighting DNA",a.lighting],["Effect DNA",a.effects]];
 return '<section class="intelligence-profile"><h3>Prompt Anatomy</h3><div class="profile-top"><span class="intelligence-chip">'+intelligenceEscape(a.type)+'</span><span class="intelligence-chip">'+intelligenceEscape(a.complexity)+'</span><span class="intelligence-chip">'+intelligenceEscape(a.role)+'</span></div><div class="profile-grid">'+cells.map(([label,values])=>'<div class="profile-cell"><strong>'+label+'</strong><p>'+list(values)+'</p></div>').join("")+'</div><div class="profile-tags">'+a.tags.map(t=>'<span class="intelligence-chip">'+intelligenceEscape(t)+'</span>').join("")+'</div><div class="compatibility-panel"><h3>Related & compatible prompts</h3><div class="compat-list">'+rel.map(x=>'<button type="button" class="compat-row intelligence-related" data-prompt-id="'+x.prompt.id+'"><span><strong>'+intelligenceEscape(x.prompt.title)+'</strong><small>'+intelligenceEscape(x.compat.level)+'</small></span><span class="compat-score">'+x.compat.score+'/100</span></button>').join("")+'</div><p class="compat-note">Heuristic compatibility based on category roles and prompt language; use judgement for final combinations.</p></div></section>';
}
function filterPrompts(){
 const q=$("#archive-search").value.trim().toLowerCase(),cat=$("#category-filter")?.value||"all",subcat=$("#subcategory-filter")?.value||"all",model=$("#model-filter")?.value||"all",sort=$("#sort-filter")?.value||"featured",type=$("#prompt-type-filter")?.value||"all",complexity=$("#complexity-filter")?.value||"all";
 let list=prompts.filter(p=>(cat==="all"||p.category===cat)&&(subcat==="all"||subcategoryFor(p)===subcat)&&(model==="all"||p.model.includes(model))&&(type==="all"||window.PromptIntelligence?.analyze(p).type===type)&&(complexity==="all"||window.PromptIntelligence?.analyze(p).complexity===complexity)&&[p.title,p.desc,p.prompt,p.tags.join(" "),collectionName(p.category),window.PromptIntelligence?.analyze(p).searchText||""].join(" ").toLowerCase().includes(q));
 if(!showingAll)list=list.slice(0,5);
 if(sort==="az")list.sort((a,b)=>a.title.localeCompare(b.title));
 promptGrid.innerHTML=list.map(promptCard).join("");

 $("#empty-state").hidden=list.length>0;
 $("#result-count").textContent=`Showing ${list.length} of ${prompts.length} prompts across ${collections.length} collections`;
 document.querySelectorAll(".prompt-card").forEach(card=>{
  card.addEventListener("click",e=>{if(e.target.closest(".bookmark"))return;openPrompt(Number(card.dataset.id));});
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openPrompt(Number(card.dataset.id));}});
 });
 document.querySelectorAll(".bookmark").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();btn.classList.toggle("saved");btn.textContent=btn.classList.contains("saved")?"♥":"♧";showToast(btn.classList.contains("saved")?"Saved to this session":"Removed from saved");}));
}
function openPrompt(id){const p=prompts.find(x=>x.id===id);if(!p)return;activePrompt=p;$("#dialog-content").innerHTML=`<p class="detail-category">${collectionName(p.category)} / PROMPT ${String(p.id).padStart(3,"0")}</p><h2 class="detail-title">${p.title}</h2><p class="detail-desc">${p.desc}</p><div class="detail-tags">${p.model.map(m=>`<span>${m}</span>`).join("")}${p.tags.map(t=>`<span>${t}</span>`).join("")}<span class="difficulty-tag">${difficulty(p)}</span></div>${promptProfileHTML(p)}<div class="prompt-mode-tabs"><button class="mode-tab active" data-mode="standard">Standard Prompt</button><button class="mode-tab" data-mode="template">Universal Template</button><button class="mode-tab" data-mode="transformation">Universal Transformation</button><button class="mode-tab" data-mode="master">MASTER PROMPT · ART DNA</button></div><p class="prompt-label" id="active-prompt-label">STANDARD PROMPT / COPY-READY</p><div class="prompt-code" id="detail-prompt"></div><div class="detail-actions"><button class="button button-orange" id="copy-prompt">▢ Copy selected prompt</button><button class="button button-outline" id="copy-negative">▢ Copy negative prompt</button></div><div class="detail-extra"><details open><summary>Prompt breakdown</summary><p>This prompt applies one unified visual treatment to a subject. Keep its central treatment intact when adapting the prompt.</p></details><details><summary>Variation ideas</summary><p>Try changing the lighting direction, camera distance, colour temperature or environment while keeping the core concept consistent.</p></details></div>`;let mode="standard";const chosen=()=>mode==="master"?masterPrompt(p):mode==="template"?universalTemplatePrompt(p):mode==="transformation"?universalTransformationPrompt(p):p.prompt;$("#detail-prompt").textContent=chosen();document.querySelectorAll(".mode-tab").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;document.querySelectorAll(".mode-tab").forEach(x=>x.classList.toggle("active",x===b));$("#active-prompt-label").textContent=mode==="master"?"MASTER PROMPT / UNIVERSAL ART DNA":mode==="template"?"UNIVERSAL TEMPLATE / VARIABLE-BASED GENERATION":mode==="transformation"?"UNIVERSAL TRANSFORMATION / SOURCE-BASED EDITING":"STANDARD PROMPT / COPY-READY";$("#detail-prompt").textContent=chosen();}));$("#copy-prompt").addEventListener("click",()=>copyText(chosen()));$("#copy-negative").addEventListener("click",()=>copyText(p.negative));document.querySelectorAll(".intelligence-related").forEach(b=>b.addEventListener("click",()=>openPrompt(Number(b.dataset.promptId))));$("#prompt-dialog").showModal();}
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast("Prompt copied to clipboard");}catch{const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove();showToast("Prompt copied");}}
let toastTimer;function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
if($("#prompt-type-filter")&&window.PromptIntelligence){$("#prompt-type-filter").innerHTML='<option value="all">All prompt types</option>'+[...new Set(prompts.map(p=>window.PromptIntelligence.analyze(p).type))].sort().map(t=>'<option value="'+t.replace(/&/g,"&amp;")+'">'+t+'</option>').join("");}if($("#collection-grid"))renderCollections();if($("#prompt-grid"))filterPrompts();["archive-search","category-filter","subcategory-filter","model-filter","sort-filter","prompt-type-filter","complexity-filter"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("input",filterPrompts),el.addEventListener("change",filterPrompts);});
const promptOfDay=prompts[new Date().getDate()%prompts.length];if(promptOfDay){const pod=$("#prompt-of-day");if(pod){pod.innerHTML=`<span class="eyebrow">PROMPT OF THE DAY</span><strong>${promptOfDay.title}</strong><p>${promptOfDay.desc}</p><button class="button button-orange" id="open-pod">Explore prompt →</button>`;$("#open-pod").addEventListener("click",()=>openPrompt(promptOfDay.id));}}
const builder=$("#builder-type");if(builder){
 const groups=[
  {id:"materials",label:"Materials",categories:["materials"],description:"Complete material transformations for any subject."},
  {id:"styles",label:"Styles",categories:["styles"],description:"Visual languages, art movements and rendering aesthetics."},
  {id:"textures",label:"Textures",categories:["textures"],description:"Surface structure, tactility, grain and microdetail."},
  {id:"lighting",label:"Photography Post-Edits",categories:["lighting"],description:"Photographic colour grading, film emulations, darkroom processes, retouching and experimental image finishing."},
  {id:"effects",label:"Effects",categories:["effects"],description:"Optical, photographic and post-production treatments."},
  {id:"composition",label:"Composition",categories:["composition"],description:"Visual hierarchy, balance, spatial relationships and framing."},
  {id:"rendering",label:"Rendering",categories:["rendering"],description:"Rendering methods, material response and image fidelity."},
  {id:"colour-atmosphere",label:"Colour & Atmosphere",categories:["colour-atmosphere"],description:"Palette systems, tonal relationships and atmospheric depth."},
  {id:"films-shows-tv",label:"Films & Shows / TV Shows",categories:["films-shows"],subcategory:"TV Shows",description:"Transform subjects into TV-show visual identities."},
  {id:"films-shows-cartoon",label:"Films & Shows / Cartoons",categories:["films-shows"],subcategory:"Cartoons",description:"Transform subjects into cartoon visual languages."},
  {id:"films-shows-films",label:"Films & Shows / Films",categories:["films-shows"],subcategory:"Films",description:"Transform subjects into cinematic film visual identities."},
  {id:"films-shows-anime",label:"Films & Shows / Anime",categories:["films-shows"],subcategory:"Anime",description:"Transform subjects into anime visual languages."},
  {id:"films-shows-other",label:"Films & Shows / Other Screen Worlds",categories:["films-shows"],subcategory:"Other Screen Worlds",description:"Transform subjects into other screen-based formats."},
  {id:"toys-collectibles",label:"Toys & Collectibles",categories:["toys-collectibles"],description:"Transform supplied subjects into 56 mainstream toy, figure, model and trading-card collectible formats, including LEGO, Hot Wheels, Barbie and major TCG designs."}
 ];
 const selected=new Set();
 const builderPrompts=window.AI_PROMPT_BUILDER_CATALOGUE||prompts;
 const byId=new Map(builderPrompts.map(p=>[String(p.id),p]));
 const universal=groups.flatMap(g=>g.categories).reduce((s,c)=>s.add(c),new Set());
 const uniquePrompts=[...new Map(builderPrompts.filter(p=>groups.some(g=>g.categories.includes(p.category))).map(p=>[String(p.id),p])).values()];
 const groupItems=(g)=>uniquePrompts.filter(p=>g.categories.includes(p.category)).sort((a,b)=>a.title.localeCompare(b.title));
 const esc=(v)=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 let openGroup=null, builderQuery="";
 const renderGroups=()=>{
  $("#builder-modules").innerHTML=groups.map((g,gi)=>{
   const items=groupItems(g).filter(p=>!g.subcategory||(p.tags||[]).includes(g.subcategory));
   const chosen=items.filter(p=>selected.has(String(p.id))).length;
   const filtered=items.filter(p=>!builderQuery||p.title.toLowerCase().includes(builderQuery));
   const expanded=openGroup===gi||(!!builderQuery&&filtered.length>0);
   return '<section class="builder-module '+(expanded?'is-open':'')+'"><button type="button" class="builder-module-toggle" data-group-index="'+gi+'" aria-expanded="'+expanded+'"><div class="builder-module-heading"><div><h3>'+g.label+'</h3><p>'+g.description+'</p></div><span class="builder-module-count">'+(chosen?chosen+' selected · ':'')+items.length+' elements <b class="builder-chevron">⌄</b></span></div></button><div class="builder-module-content" '+(expanded?'':'hidden')+'><div class="builder-module-grid">'+filtered.map(p=>'<div class="builder-option"><label><input type="checkbox" data-prompt-id="'+p.id+'" '+ (selected.has(String(p.id))?'checked':'')+'><span>'+esc(p.title)+'</span></label></div>').join("")+'</div>'+(builderQuery&&!filtered.length?'<p class="builder-empty">No matching options in this group.</p>':'')+'</div></section>';
  }).join("");
  $("#builder-modules").querySelectorAll(".builder-module-toggle").forEach(button=>button.addEventListener("click",()=>{openGroup=Number(button.dataset.groupIndex)===openGroup?null:Number(button.dataset.groupIndex);renderGroups();}));
  $("#builder-modules").querySelectorAll('input[data-prompt-id]').forEach(input=>input.addEventListener("change",()=>{const id=input.dataset.promptId;if(input.checked)selected.add(id);else selected.delete(id);compose();renderGroups();}));
 };
 const compose=()=>{
  const chosen=[...selected].map(id=>byId.get(id)).filter(Boolean);
  const type=$("#builder-type").value;
  const style=$("#builder-style").value.trim();
  const light=$("#builder-light").value.trim();
  const frame=$("#builder-frame").value.trim();
  const source=$("#builder-source").value.trim();
  const sections=chosen.map(p=>p.title+"\n"+p.prompt).join("\n\n");
  const escapeHTML=v=>String(v||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const hasScreenWorld=chosen.some(p=>p.category==="films-shows");
  const treatment=type==="transformation"?(hasScreenWorld?"Transform the supplied source into the selected screen universe as a complete subject-and-world re-creation. Preserve the original subject's recognisable identity, but allow costume, clothing, hairstyle, accessories, props, environment, background, lighting, colour, composition and rendering to change so the subject genuinely belongs in the selected show, film, cartoon or anime. Do not substitute the subject with an existing franchise character.":"Apply the selected visual modules to the supplied source image. Preserve the source subject's identity and defining structure while changing the requested visual treatment.") :type==="art-dna"?"Create a cohesive ART DNA system from the selected visual modules. Resolve conflicts intelligently, establish a clear hierarchy and apply consistent visual logic throughout.":"Create a coherent image using the selected visual modules as independent, compatible art-direction instructions.";
  const output=["PROMPT DNA — MODULAR VISUAL SYSTEM",treatment,source?"SOURCE / SUBJECT:\n"+source:"",sections?"SELECTED VISUAL MODULES:\n"+sections:"SELECT AT LEAST ONE VISUAL MODULE TO BEGIN.", "ADDITIONAL ART DIRECTION:\nVisual style: "+(style||"No additional style specified")+".\nLighting: "+(light||"No additional lighting specified")+".\nComposition: "+(frame||"No additional composition specified")+".","INTEGRATION RULES:\nTreat each selected module as an independent instruction. Combine them without allowing one module to replace or contradict the others. Preserve subject identity, visual coherence, controlled detail, clear focal hierarchy and professional image quality. Avoid unrelated objects, arbitrary decoration, visual clutter and contradictory treatment."].filter(Boolean).join("\n\n");
  const moduleHTML=chosen.map((p,i)=>'<details class="builder-output-module"><summary><span>'+escapeHTML(p.title)+'</span><small>'+escapeHTML(collectionName(p.category))+' · Prompt '+(i+1)+'</small></summary><div class="builder-output-module-text">'+escapeHTML(p.prompt)+'</div></details>').join("");
  const extraHTML='<details class="builder-output-module builder-output-extra"><summary><span>Additional Art Direction</span><small>Style, lighting and composition</small></summary><div class="builder-output-module-text">'+escapeHTML("Visual style: "+(style||"No additional style specified")+".\nLighting: "+(light||"No additional lighting specified")+".\nComposition: "+(frame||"No additional composition specified")+".")+'</div></details><details class="builder-output-module builder-output-extra"><summary><span>Integration Rules</span><small>Overall synthesis instructions</small></summary><div class="builder-output-module-text">'+escapeHTML("Treat each selected module as an independent instruction. Combine them without allowing one module to replace or contradict the others. Preserve subject identity, visual coherence, controlled detail, clear focal hierarchy and professional image quality. Avoid unrelated objects, arbitrary decoration, visual clutter and contradictory treatment.")+'</div></details>';
  $("#builder-output").innerHTML='<div class="builder-output-intro"><strong>PROMPT DNA — MODULAR VISUAL SYSTEM</strong><p>'+escapeHTML(treatment)+'</p>'+(source?'<p><strong>Source / Subject:</strong> '+escapeHTML(source)+'</p>':'')+'<p class="builder-output-collapse-note">Each module is collapsed. Tap any item to inspect its full prompt.</p></div>'+moduleHTML+extraHTML;
  $("#builder-output").dataset.copyText=output;
  $("#builder-selection-count").textContent=chosen.length+" selected";
 };
 $("#builder-type").addEventListener("change",compose);
 ["builder-style","builder-light","builder-frame","builder-source"].forEach(id=>$("#"+id).addEventListener(id==="builder-source"?"input":"change",compose));
 $("#builder-clear").addEventListener("click",()=>{selected.clear();renderGroups();compose();});
 const moduleSearch=$("#builder-module-search"); if(moduleSearch)moduleSearch.addEventListener("input",()=>{builderQuery=moduleSearch.value.trim().toLowerCase();if(builderQuery)openGroup=null;renderGroups();});
 $("#copy-builder").addEventListener("click",()=>copyText($("#builder-output").dataset.copyText||$("#builder-output").textContent));
 renderGroups();compose();
}
["archive-search","category-filter","subcategory-filter","model-filter","sort-filter"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener(id==="archive-search"?"input":"change",()=>{if(id==="category-filter"&&$("#subcategory-filter"))updateSubcategoryOptions(el.value);showingAll=true;filterPrompts();});});
const pageType=document.body.dataset.page||"home";
const params=new URLSearchParams(location.search);
if(pageType==="explore"&&params.has("search")&&$("#archive-search")){$("#archive-search").value=params.get("search");showingAll=true;filterPrompts();}
function runSearch(value){
 const query=String(value||"").trim();
 if(!query)return;
 if(pageType==="explore"){
  const input=$("#archive-search");
  if(input){input.value=query;showingAll=true;filterPrompts();history.replaceState(null,"", "explore.html?search="+encodeURIComponent(query)+"#archive");$("#archive").scrollIntoView({behavior:"smooth",block:"start"});}
 }else location.href="explore.html?search="+encodeURIComponent(query)+"#archive";
}
if($("#hero-search")){
 $("#hero-search").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();runSearch(e.currentTarget.value);}});
 const heroForm=$("#hero-search").closest("form");
 if(heroForm)heroForm.addEventListener("submit",e=>{e.preventDefault();runSearch($("#hero-search").value);});
}
if($("#archive-search"))$("#archive-search").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();showingAll=true;filterPrompts();}});
const focusSearch=$("#focus-search");
if(focusSearch)focusSearch.addEventListener("click",()=>{
 const input=pageType==="explore"?$("#archive-search"):pageType==="home"?$("#hero-search"):null;
 if(input){input.focus();input.scrollIntoView({behavior:"smooth",block:"center"});}
 else location.href="explore.html#archive";
});
if($("#show-all"))$("#show-all").addEventListener("click",()=>{showingAll=true;filterPrompts();$("#archive")?.scrollIntoView({behavior:"smooth"});});
const menuButton=$("#menu-toggle"),mobileMenu=$("#mobile-menu");
if(menuButton&&mobileMenu){
 const closeMenu=()=>{mobileMenu.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open menu");};
 menuButton.addEventListener("click",e=>{e.preventDefault();const open=!mobileMenu.classList.contains("open");mobileMenu.classList.toggle("open",open);menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Close menu":"Open menu");});
 mobileMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
 document.addEventListener("click",e=>{if(mobileMenu.classList.contains("open")&&!mobileMenu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
}
if($("#newsletter"))$("#newsletter").addEventListener("submit",e=>{e.preventDefault();$("#newsletter-message").textContent="No email has been sent. Newsletter sign-up will activate when an email service is connected.";});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();const target=pageType==="explore"?$("#archive-search"):$("#hero-search");if(target){target.focus();target.scrollIntoView({behavior:"smooth",block:"center"});}else location.href="explore.html#archive";}});
