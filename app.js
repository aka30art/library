const collections = [
{id:"materials",name:"Materials",count:0,icon:"▧",tone:"orange",bg:"linear-gradient(120deg,#42474b,#15191e 54%,#8b8c88)"},
{id:"styles",name:"Styles",count:0,icon:"✦",tone:"violet",bg:"linear-gradient(135deg,#39265c,#d15b64 55%,#10151e)"},
{id:"textures",name:"Textures",count:0,icon:"▤",tone:"blue",bg:"linear-gradient(135deg,#26394b,#8b6b50 52%,#121923)"},
{id:"lighting",name:"Lighting",count:0,icon:"☼",tone:"orange",bg:"linear-gradient(135deg,#b5a58b,#46505a 48%,#151a22)"},
{id:"effects",name:"Effects",count:0,icon:"◉",tone:"violet",bg:"linear-gradient(130deg,#ffb52e,#e85d37 48%,#30245e)"},
{id:"composition",name:"Composition",count:0,icon:"▦",tone:"green",bg:"linear-gradient(130deg,#173c35,#111820)"},
{id:"rendering",name:"Rendering",count:0,icon:"⬡",tone:"blue",bg:"linear-gradient(135deg,#b6c0c2,#343d46 55%,#111820)"},
{id:"colour-atmosphere",name:"Colour & Atmosphere",count:0,icon:"◌",tone:"violet",bg:"linear-gradient(135deg,#39265c,#d15b64 55%,#10151e)"},
{id:"films-shows",name:"Films & Shows",count:0,icon:"▣",tone:"violet",bg:"linear-gradient(135deg,#34264d,#b94b58 55%,#111820)"},
{id:"toys-collectibles",name:"Toys & Collectibles",count:0,icon:"✧",tone:"orange",bg:"linear-gradient(135deg,#4b3528,#bd7b45 55%,#111820)"}
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
 document.querySelectorAll(".collection-card").forEach(el=>el.addEventListener("click",()=>{if($("#category-filter"))$("#category-filter").value=el.dataset.category;if($("#subcategory-filter")){ $("#subcategory-filter").value="all"; $("#subcategory-filter").hidden=el.dataset.category!=="films-shows"; }showingAll=true;filterPrompts();}));
}
function filterPrompts(){
 const q=$("#archive-search").value.trim().toLowerCase(),cat=$("#category-filter")?.value||"all",subcat=$("#subcategory-filter")?.value||"all",model=$("#model-filter")?.value||"all",sort=$("#sort-filter")?.value||"featured";
 let list=prompts.filter(p=>(cat==="all"||p.category===cat)&&(subcat==="all"||p.category!=="films-shows"||(p.tags||[]).includes(subcat))&&(model==="all"||p.model.includes(model))&&[p.title,p.desc,p.prompt,p.tags.join(" "),collectionName(p.category)].join(" ").toLowerCase().includes(q));
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
function openPrompt(id){const p=prompts.find(x=>x.id===id);if(!p)return;activePrompt=p;$("#dialog-content").innerHTML=`<p class="detail-category">${collectionName(p.category)} / PROMPT ${String(p.id).padStart(3,"0")}</p><h2 class="detail-title">${p.title}</h2><p class="detail-desc">${p.desc}</p><div class="detail-tags">${p.model.map(m=>`<span>${m}</span>`).join("")}${p.tags.map(t=>`<span>${t}</span>`).join("")}<span class="difficulty-tag">${difficulty(p)}</span></div><div class="prompt-mode-tabs"><button class="mode-tab active" data-mode="standard">Standard Prompt</button><button class="mode-tab" data-mode="template">Universal Template</button><button class="mode-tab" data-mode="transformation">Universal Transformation</button><button class="mode-tab" data-mode="master">MASTER PROMPT · ART DNA</button></div><p class="prompt-label" id="active-prompt-label">STANDARD PROMPT / COPY-READY</p><div class="prompt-code" id="detail-prompt"></div><div class="detail-actions"><button class="button button-orange" id="copy-prompt">▢ Copy selected prompt</button><button class="button button-outline" id="copy-negative">▢ Copy negative prompt</button></div><div class="detail-extra"><details open><summary>Prompt breakdown</summary><p>This prompt applies one unified visual treatment to a subject. Keep its central treatment intact when adapting the prompt.</p></details><details><summary>Variation ideas</summary><p>Try changing the lighting direction, camera distance, colour temperature or environment while keeping the core concept consistent.</p></details></div>`;let mode="standard";const chosen=()=>mode==="master"?masterPrompt(p):mode==="template"?universalTemplatePrompt(p):mode==="transformation"?universalTransformationPrompt(p):p.prompt;$("#detail-prompt").textContent=chosen();document.querySelectorAll(".mode-tab").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;document.querySelectorAll(".mode-tab").forEach(x=>x.classList.toggle("active",x===b));$("#active-prompt-label").textContent=mode==="master"?"MASTER PROMPT / UNIVERSAL ART DNA":mode==="template"?"UNIVERSAL TEMPLATE / VARIABLE-BASED GENERATION":mode==="transformation"?"UNIVERSAL TRANSFORMATION / SOURCE-BASED EDITING":"STANDARD PROMPT / COPY-READY";$("#detail-prompt").textContent=chosen();}));$("#copy-prompt").addEventListener("click",()=>copyText(chosen()));$("#copy-negative").addEventListener("click",()=>copyText(p.negative));$("#prompt-dialog").showModal();}
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast("Prompt copied to clipboard");}catch{const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove();showToast("Prompt copied");}}
let toastTimer;function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
if($("#collection-grid"))renderCollections();if($("#prompt-grid"))filterPrompts();
const promptOfDay=prompts[new Date().getDate()%prompts.length];if(promptOfDay){const pod=$("#prompt-of-day");if(pod){pod.innerHTML=`<span class="eyebrow">PROMPT OF THE DAY</span><strong>${promptOfDay.title}</strong><p>${promptOfDay.desc}</p><button class="button button-orange" id="open-pod">Explore prompt →</button>`;$("#open-pod").addEventListener("click",()=>openPrompt(promptOfDay.id));}}
const builder=$("#builder-type");if(builder){
 const groups=[
  {id:"materials",label:"Materials",categories:["materials"],description:"Complete material transformations for any subject."},
  {id:"styles",label:"Styles",categories:["styles"],description:"Visual languages, art movements and rendering aesthetics."},
  {id:"textures",label:"Textures",categories:["textures"],description:"Surface structure, tactility, grain and microdetail."},
  {id:"lighting",label:"Lighting",categories:["lighting"],description:"Illumination, light direction, contrast and atmosphere."},
  {id:"effects",label:"Effects",categories:["effects"],description:"Optical, photographic and post-production treatments."},
  {id:"composition",label:"Composition",categories:["composition"],description:"Visual hierarchy, balance, spatial relationships and framing."},
  {id:"rendering",label:"Rendering",categories:["rendering"],description:"Rendering methods, material response and image fidelity."},
  {id:"colour-atmosphere",label:"Colour & Atmosphere",categories:["colour-atmosphere"],description:"Palette systems, tonal relationships and atmospheric depth."},
  {id:"films-shows-tv",label:"Films & Shows / TV Shows",categories:["films-shows"],subcategory:"TV Shows",description:"Transform subjects into TV-show visual identities."},
  {id:"films-shows-cartoon",label:"Films & Shows / Cartoons",categories:["films-shows"],subcategory:"Cartoons",description:"Transform subjects into cartoon visual languages."},
  {id:"films-shows-films",label:"Films & Shows / Films",categories:["films-shows"],subcategory:"Films",description:"Transform subjects into cinematic film visual identities."},
  {id:"films-shows-anime",label:"Films & Shows / Anime",categories:["films-shows"],subcategory:"Anime",description:"Transform subjects into anime visual languages."},
  {id:"films-shows-other",label:"Films & Shows / Other Screen Worlds",categories:["films-shows"],subcategory:"Other Screen Worlds",description:"Transform subjects into other screen-based formats."},
  {id:"toys-collectibles",label:"Toys & Collectibles",categories:["toys-collectibles"],description:"Transform supplied subjects into 25 recognisable toy, figure, model and collectible formats, including LEGO and Funko Pop."}
 ];
 const selected=new Set();
 const builderPrompts=window.AI_PROMPT_BUILDER_CATALOGUE||prompts;
 const byId=new Map(builderPrompts.map(p=>[String(p.id),p]));
 const universal=groups.flatMap(g=>g.categories).reduce((s,c)=>s.add(c),new Set());
 const uniquePrompts=[...new Map(builderPrompts.filter(p=>groups.some(g=>g.categories.includes(p.category))).map(p=>[String(p.id),p])).values()];
 const groupItems=(g)=>uniquePrompts.filter(p=>g.categories.includes(p.category)).sort((a,b)=>a.title.localeCompare(b.title));
 const esc=(v)=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const renderGroups=()=>{
  $("#builder-modules").innerHTML=groups.map(g=>{
   const items=groupItems(g).filter(p=>!g.subcategory||(p.tags||[]).includes(g.subcategory));
   return '<section class="builder-module"><div class="builder-module-heading"><div><h3>'+g.label+'</h3><p>'+g.description+'</p></div><span>'+items.length+' elements</span></div><div class="builder-module-grid">'+items.map(p=>'<label class="builder-option"><input type="checkbox" data-prompt-id="'+p.id+'" '+(selected.has(String(p.id))?'checked':'')+'><span>'+esc(p.title)+'</span></label>').join("")+'</div></section>';
  }).join("");
  $("#builder-modules").querySelectorAll('input[data-prompt-id]').forEach(input=>input.addEventListener("change",()=>{const id=input.dataset.promptId;if(input.checked)selected.add(id);else selected.delete(id);compose();}));
 };
 const compose=()=>{
  const chosen=[...selected].map(id=>byId.get(id)).filter(Boolean);
  const type=$("#builder-type").value;
  const style=$("#builder-style").value.trim();
  const light=$("#builder-light").value.trim();
  const frame=$("#builder-frame").value.trim();
  const source=$("#builder-source").value.trim();
  const sections=chosen.map(p=>p.title+"\n"+p.prompt).join("\n\n");
  const hasScreenWorld=chosen.some(p=>p.category==="films-shows");
  const treatment=type==="transformation"?(hasScreenWorld?"Transform the supplied source into the selected screen universe as a complete subject-and-world re-creation. Preserve the original subject's recognisable identity, but allow costume, clothing, hairstyle, accessories, props, environment, background, lighting, colour, composition and rendering to change so the subject genuinely belongs in the selected show, film, cartoon or anime. Do not substitute the subject with an existing franchise character.":"Apply the selected visual modules to the supplied source image. Preserve the source subject's identity and defining structure while changing the requested visual treatment.") :type==="art-dna"?"Create a cohesive ART DNA system from the selected visual modules. Resolve conflicts intelligently, establish a clear hierarchy and apply consistent visual logic throughout.":"Create a coherent image using the selected visual modules as independent, compatible art-direction instructions.";
  const output=["PROMPT DNA — MODULAR VISUAL SYSTEM",treatment,source?"SOURCE / SUBJECT:\n"+source:"",sections?"SELECTED VISUAL MODULES:\n"+sections:"SELECT AT LEAST ONE VISUAL MODULE TO BEGIN.", "ADDITIONAL ART DIRECTION:\nVisual style: "+(style||"No additional style specified")+".\nLighting: "+(light||"No additional lighting specified")+".\nComposition: "+(frame||"No additional composition specified")+".","INTEGRATION RULES:\nTreat each selected module as an independent instruction. Combine them without allowing one module to replace or contradict the others. Preserve subject identity, visual coherence, controlled detail, clear focal hierarchy and professional image quality. Avoid unrelated objects, arbitrary decoration, visual clutter and contradictory treatment."].filter(Boolean).join("\n\n");
  $("#builder-output").textContent=output;
  $("#builder-selection-count").textContent=chosen.length+" selected";
 };
 $("#builder-type").addEventListener("change",compose);
 ["builder-style","builder-light","builder-frame","builder-source"].forEach(id=>$("#"+id).addEventListener(id==="builder-source"?"input":"change",compose));
 $("#builder-clear").addEventListener("click",()=>{selected.clear();renderGroups();compose();});
 $("#copy-builder").addEventListener("click",()=>copyText($("#builder-output").textContent));
 renderGroups();compose();
}
["archive-search","category-filter","subcategory-filter","model-filter","sort-filter"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener(id==="archive-search"?"input":"change",()=>{if(id==="category-filter"&&$("#subcategory-filter")){ $("#subcategory-filter").value="all"; $("#subcategory-filter").hidden=el.value!=="films-shows"; }showingAll=true;filterPrompts();});});
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
