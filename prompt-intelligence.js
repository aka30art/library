/* LIBRARY Prompt Intelligence v2 — domain-aware compatibility and conflict analysis */
(()=>{
"use strict";
const types={
 materials:"Material Transformation",
 styles:"Visual Style",
 textures:"Texture Treatment",
 lighting:"Photography Post-Edit",
 effects:"Visual Effect",
 composition:"Composition System",
 rendering:"Rendering Method",
 "colour-atmosphere":"Colour & Atmosphere",
 "films-shows":"Screen-World Transformation",
 "toys-collectibles":"Collectible Design",
 "architecture-spaces":"Architecture & Spatial Design",
 "sculpture-3d-objects":"Sculpture & 3D Object Design",
 "graphic-design-layout":"Graphic Design & Layout",
 "photography-camera":"Photography & Camera System",
 "product-design":"Industrial & Product Design"
};
const roles={
 materials:"Material identity, physical behaviour and surface response",
 styles:"Overarching visual language, form grammar and art direction",
 textures:"Surface detail, tactility and microstructure",
 lighting:"Photographic finishing, tonal response and film/sensor character",
 effects:"Optical, atmospheric, motion or post-production phenomena",
 composition:"Framing, spatial hierarchy, layout and visual balance",
 rendering:"Image construction, shading, simulation and output fidelity",
 "colour-atmosphere":"Palette logic, tonal relationships, atmosphere and emotional temperature",
 "films-shows":"Screen-world visual language, setting, production design and cinematic conventions",
 "toys-collectibles":"Collectible format, object construction, display and card/product presentation",
 "architecture-spaces":"Site, programme, massing, circulation, structure and human-scale spatial design",
 "sculpture-3d-objects":"Three-dimensional form, mass/void, gravity, assembly and spatial presence",
 "graphic-design-layout":"Typography, grid, information hierarchy, brand communication and print production",
 "photography-camera":"Lens, viewpoint, exposure, camera movement, focus and photographic intent",
 "product-design":"User task, ergonomics, affordances, function, manufacturing and lifecycle"
};
const terms={
 styles:["photorealism","hyperrealism","cinematic realism","anime","manga","bauhaus","brutalism","surrealism","minimalism","maximalism","cyberpunk","vaporwave","art deco","constructivism","editorial","vector","flat vector","pixel art","woodcut","risograph","painterly","low-poly","futurism","gothic","pop art","swiss design","mid-century","photographic","illustration","cartoon","printmaking","collage"],
 materials:["glass","chrome","aluminium","aluminum","copper","brass","bronze","steel","titanium","concrete","marble","stone","wood","timber","ceramic","porcelain","resin","rubber","silicone","fabric","textile","paper","carbon fibre","carbon fiber","crystal","amber","turquoise","liquid metal","wax","leather","velvet","linen","nylon","foam","plaster","earth","composite","mycelium","bioplastic","ferrofluid"],
 textures:["grain","microtexture","micro-scratch","pore","weave","woven","crack","patina","abrasion","fracture","emboss","deboss","fibre","fiber","mottling","crystalline","ripple","condensation","rust","foam","pile","paper tooth","crazing","oxidation","knit","grain structure"],
 lighting:["cinematic","studio lighting","soft light","hard light","flash","halation","bloom","flare","film","monochrome","black-and-white","color grade","colour grade","vintage","analog","analogue","ccd","vhs","grain","retouch","restoration","daylight","tungsten","high key","low key"],
 effects:["glow","bloom","flare","refraction","reflection","caustic","chromatic aberration","distortion","warp","blur","motion","glitch","fog","mist","haze","smoke","particle","spark","shatter","ripple","wave","plasma","photochemical","datamosh","prism","diffraction"],
 architecture:["urban","residential","interior","civic","institutional","sacred","circulation","massing","site","facade","façade","daylight","structure","adaptive reuse","courtyard","transit","waterfront","accessibility"],
 sculpture:["monolith","assembly","kinetic","biomorphic","monument","negative space","gravity","balance","joinery","counterweight","suspension","volume","void","public art"],
 graphic:["editorial","poster","typography","letterform","grid","brand identity","wayfinding","risograph","screenprint","foil stamping","die-cut","print production","typographic hierarchy"],
 photography:["lens","perspective","telephoto","fisheye","anamorphic","macro","exposure","shutter","aperture","iso","panning","tracking shot","focus plane","depth of field","bokeh","documentary","portrait","landscape","still life","handheld"],
 product:["ergonomics","affordance","manufacturing","assembly","serviceability","repairable","interface","consumer electronics","industrial design","packaging","container","furniture","assistive","circular design","tolerance"],
 targets:["portrait","character","creature","animal","architecture","building","interior","landscape","environment","product","object","vehicle","food","packaging","poster","typography","logo","card","toy","figure","sculpture","room","furniture","device"]
};
const categories={
 materials:["textures","rendering","effects","colour-atmosphere","lighting","photography-camera","product-design","sculpture-3d-objects"],
 styles:["composition","rendering","colour-atmosphere","lighting","textures","graphic-design-layout","films-shows","photography-camera"],
 textures:["materials","rendering","lighting","effects","sculpture-3d-objects","product-design"],
 lighting:["styles","composition","rendering","colour-atmosphere","effects","photography-camera","films-shows"],
 effects:["lighting","textures","composition","colour-atmosphere","rendering","photography-camera"],
 composition:["styles","lighting","rendering","colour-atmosphere","effects","graphic-design-layout","photography-camera","architecture-spaces","sculpture-3d-objects"],
 rendering:["materials","styles","textures","lighting","composition","sculpture-3d-objects","photography-camera"],
 "colour-atmosphere":["lighting","styles","composition","effects","rendering","graphic-design-layout"],
 "films-shows":["styles","lighting","composition","rendering","colour-atmosphere","photography-camera"],
 "toys-collectibles":["materials","textures","rendering","lighting","composition","product-design","graphic-design-layout"],
 "architecture-spaces":["materials","textures","lighting","composition","rendering","product-design","sculpture-3d-objects"],
 "sculpture-3d-objects":["materials","textures","lighting","composition","rendering","architecture-spaces"],
 "graphic-design-layout":["styles","composition","colour-atmosphere","photography-camera","toys-collectibles"],
 "photography-camera":["lighting","styles","composition","rendering","effects","colour-atmosphere","films-shows"],
 "product-design":["materials","styles","textures","rendering","architecture-spaces","sculpture-3d-objects","graphic-design-layout"]
};
const conflicts=[
 {a:/photoreal|hyperreal|cinematic realism/,b:/flat vector|pixel art|woodcut|risograph|screenprint/,label:"photographic realism versus a deliberately flat or print-based image language"},
 {a:/flat vector|vector illustration/,b:/photographic realism|photoreal|hyperreal/,label:"flat vector construction versus photographic rendering"},
 {a:/pixel art|voxel art/,b:/photographic realism|photoreal|hyperreal/,label:"pixel-grid construction versus photographic fidelity"},
 {a:/minimalis/,b:/maximalis|dense ornamental/,label:"minimal visual density versus maximal ornament"},
 {a:/monochrome|black.and.white|grayscale/,b:/full spectrum|full colour|vibrant multicolou?r/,label:"monochrome versus full-spectrum colour"},
 {a:/strict symmetry|perfect symmetry/,b:/dynamic asymmetry|deliberate asymmetry/,label:"strict symmetry versus deliberate asymmetry"},
 {a:/shallow depth of field|strong bokeh/,b:/deep focus|everything in focus/,label:"shallow focus versus deep-focus requirements"},
 {a:/long exposure|motion trail/,b:/flash freeze|frozen motion/,label:"long-exposure motion versus flash-frozen action"}
];
const normal=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const textOf=p=>[p.title,p.desc,p.prompt,(p.tags||[]).join(" ")].join(" ").toLowerCase();
function pickTerms(text,list){return list.filter(term=>text.includes(term));}
function analyze(p){
 const t=textOf(p),tags=(p.tags||[]).map(String);
 const found={};
 for(const key of Object.keys(terms))found[key]=pickTerms(t,terms[key]);
 const target=found.targets.slice(0,6);
 const promptWords=String(p.prompt||"").trim().split(/\s+/).filter(Boolean).length;
 return{
  type:types[p.category]||"Visual Prompt",
  role:roles[p.category]||"General creative direction",
  target:target.length?target:["Any subject"],
  styles:found.styles,materials:found.materials,textures:found.textures,lighting:found.lighting,effects:found.effects,
  architecture:found.architecture,sculpture:found.sculpture,graphic:found.graphic,photography:found.photography,product:found.product,
  tags,complexity:p.difficulty||((promptWords>150||/technical|procedural|physics|optical|micro|macro|ergonomic|manufactur/.test(t))?"Professional":promptWords>75?"Advanced":"Foundation"),
  searchText:[p.title,p.desc,p.prompt,tags.join(" "),types[p.category],roles[p.category],...Object.values(found).flat()].join(" ").toLowerCase()
 };
}
function compatibility(a,b){
 const A=analyze(a),B=analyze(b),ta=textOf(a),tb=textOf(b);
 let score=52,notes=[],warnings=[],conflictLabels=[];
 if(a.category===b.category){score-=18;notes.push("Same collection: combine only when the modules describe distinct aspects rather than repeating the same operation.");}
 else if((categories[a.category]||[]).includes(b.category)||(categories[b.category]||[]).includes(a.category)){score+=22;notes.push("The selected domains have complementary creative responsibilities.");}
 else score+=6;
 const shared=A.tags.filter(tag=>B.tags.includes(tag));
 if(shared.length){score+=Math.min(9,shared.length*2);notes.push("Shared context: "+shared.slice(0,3).join(", ")+".");}
 for(const rule of conflicts){
  if((rule.a.test(ta)&&rule.b.test(tb))||(rule.b.test(ta)&&rule.a.test(tb))){score-=23;conflictLabels.push(rule.label);}
 }
 if(conflictLabels.length){warnings.push("Resolve competing visual requirements: "+[...new Set(conflictLabels)].join("; ")+".");}
 if(/strict identity|preserve source|preservation lock/.test(ta)&&/complete redesign|replace the background|rebuild the environment/.test(tb))warnings.push("Clarify the source-preservation boundary before redesigning the scene.");
 if(/photographic post.production|fixed source photograph/.test(ta)&&/new camera setup|rebuild the scene|change the viewpoint/.test(tb))warnings.push("A photographic finishing module may conflict with instructions to recapture or rebuild the scene.");
 if(/functional|ergonomic|manufactur/.test(ta+tb)&&/purely decorative|non.functional|impossible construction/.test(ta+tb))warnings.push("Resolve function and decorative intent; functional constraints take priority unless the brief explicitly requests speculative art.");
 score=Math.max(0,Math.min(100,score));
 return{score,level:score>=78?"Strong synergy":score>=58?"Compatible":score>=38?"Mixed / review":"Potential conflict",notes,warnings,conflicts:[...new Set(conflictLabels)]};
}
function related(p,list,limit=6){
 return list.filter(x=>x.id!==p.id).map(x=>{
  const r=compatibility(p,x),sameTags=analyze(p).tags.filter(t=>analyze(x).tags.includes(t)).length;
  const affinity=(categories[p.category]||[]).includes(x.category)?12:0;
  return{prompt:x,score:r.score+sameTags*3+affinity,compat:r};
 }).sort((a,b)=>b.score-a.score).slice(0,limit);
}
window.PromptIntelligence={analyze,compatibility,related,types,categories,roles};
})();
