#!/usr/bin/env node
/**
 * Prompt Intelligence Audit v3.
 * Conservative rule-based triage, not a semantic quality score.
 * Usage: --json | --summary | --self-test | --calibration-test
 */
const fs=require("node:fs"),vm=require("node:vm");
const SPECIALIST=new Set(["architecture-spaces","sculpture-3d-objects","graphic-design-layout","photography-camera","product-design"]);
const UNIVERSAL_TARGET_CATEGORIES=new Set(["materials","styles","textures","lighting","effects","composition","rendering","colour-atmosphere"]);
const MIN_TARGET_FAMILY_SIZE=20;
const TARGET_REDESIGN_BRIEFS={
 materials:["Specify the selected material's physical behaviour (for example reflectance, translucency, anisotropy, porosity, grain or elasticity).","Define a relevant surface or manufacturing process and how it changes edges, joints or geometry.","Explain how light interacts with the material and how the behaviour adapts to the supplied subject."],
 styles:["Translate the selected movement or style into distinctive form, geometry, line, proportion, palette, typography or ornament decisions.","Identify medium- and technique-specific execution, not only a style label.","Preserve relevant historical or cultural visual logic without reducing the style to superficial decoration."],
 textures:["Define the texture's morphology, scale, density, direction and formation mechanism.","Specify where it appears and how it follows the source surface or image structure.","Describe its response to light, focus, contrast and surrounding materials."],
 lighting:["Specify the chosen photographic process or stock's tonal curve, colour response, grain and highlight/shadow behaviour.","Distinguish capture characteristics from post-production treatment where relevant.","Define how the treatment affects skin, materials, highlights, shadow detail and mixed light."],
 effects:["Explain the physical, optical, chemical or digital mechanism producing the effect.","Control location, direction, intensity, falloff and interaction with the source subject.","Define what remains legible and which parts of the source must not be distorted."],
 composition:["Translate the named principle into concrete focal hierarchy, framing, spatial relationships, alignment, rhythm and negative-space decisions.","Specify viewpoint, crop and depth relationships appropriate to the source.","Explain how the arrangement guides attention rather than merely naming a composition concept."],
 rendering:["Name the relevant rendering or simulation method and why it suits the subject.","Specify material response, light transport, shadow, reflection/refraction and surface fidelity.","Set technical quality constraints such as geometry, sampling, anti-aliasing, noise and artifact control where relevant."],
 "colour-atmosphere":["Define the actual hue relationships and palette roles, not only a mood label.","Specify tonal hierarchy, contrast, saturation and highlight/shadow colour behaviour.","Tie atmospheric effects to a plausible light source, environment or time-of-day condition."]
};
const CHECKS={
materials:[
["material_behaviour","Material behaviour",/\b(reflectance|reflective|translucen\w*|refract\w*|absorb\w*|diffus\w*|poros\w*|malleab\w*|elastic\w*|brittle|conduct\w*|density|grain|patina|oxid\w*|corros\w*|weather\w*|hardness|flexib\w*|roughness)\b/i],
["surface_process","Surface or production process",/\b(brush\w*|polish\w*|cast\w*|forge\w*|machine\w*|extrud\w*|laminat\w*|weav\w*|glaz\w*|coat\w*|finish|machining|microstructure|manufactur\w*)\b/i],
["light_response","Light and optical response",/\b(light|specular|gloss|highlight|shadow|transmission|refraction|scattering|fresnel|iridescen\w*|caustic)\b/i]
],
styles:[
["visual_grammar","Distinctive visual grammar",/\b(linework|line weight|silhouette|shape language|geometry|proportion|colour|color|tonal|palette|ornament|pattern|composition|form language)\b/i],
["technique_medium","Technique or medium",/\b(brushwork|ink|wash|printmaking|woodcut|etch\w*|collage|vector|raster|painterly|photographic|rendering|halftone|screenprint|risograph|texture)\b/i],
["context_provenance","Historical or cultural context",/\b(histor\w*|period|movement|tradition|cultural|regional|provenance|origin|contemporary|historical)\b/i]
],
textures:[
["physical_structure","Physical surface structure",/\b(microstructure|microtexture|grain|pore|fibre|fiber|weave|cellular|lattice|granular|crystal|stri\w*|ridge|fracture|layer\w*|pile|nap|filament)\b/i],
["formation_wear","Formation, wear or deposition",/\b(form\w*|growth|deposit\w*|erosion|abrasion|weather\w*|corrosion|crystall\w*|fractur\w*|compress\w*|melt\w*|dry\w*|ageing|aging|patina)\b/i],
["scale_light","Scale or light response",/\b(macro|micro|close.up|magnif\w*|scale|light|shadow|gloss|sheen|reflect\w*|translucen\w*|depth)\b/i]
],
lighting:[
["photo_process","Photographic process or medium",/\b(film|negative|slide|sensor|ccd|cmos|chemical|emulsion|print|camera|photographic|analogue|analog|digital)\b/i],
["tonal_colour","Tonal or colour control",/\b(highlight|shadow|black point|white point|contrast|midtone|tone curve|colour|color|saturation|temperature|split toning|grade|grading)\b/i],
["optical_capture","Optical or capture character",/\b(halation|bloom|flare|grain|noise|exposure|flash|lens|focus|diffusion|leak|bleed|reticulation)\b/i]
],
effects:[
["mechanism","Physical, optical or digital mechanism",/\b(refraction|dispersion|diffraction|interference|displacement|distortion|photochemical|chemical|digital|optical|thermal|magnetic|volumetric|particle|signal|temporal|motion)\b/i],
["source_interaction","Interaction with the source",/\b(subject|source|surface|edge|silhouette|foreground|background|reflection|shadow|environment|integrat\w*|interact\w*|within)\b/i],
["control_restraint","Control, intensity or restraint",/\b(subtle|restrain\w*|controlled|selective|local\w*|limited|falloff|opacity|intensity|strength|direction|scale|preserv\w*)\b/i]
],
composition:[
["hierarchy_balance","Hierarchy and balance",/\b(hierarchy|focal|dominant|secondary|balance|weight|contrast|rhythm|repetition|emphasis|negative space)\b/i],
["framing_viewpoint","Framing or viewpoint",/\b(frame|framing|crop\w*|viewpoint|camera|perspective|overhead|isometric|orthographic|eye level|angle|vanishing point)\b/i],
["spatial_relationship","Spatial relationship",/\b(foreground|background|depth|overlap|occlusion|spacing|alignment|scale|proximity|distance|layer\w*|directional flow)\b/i]
],
rendering:[
["render_method","Rendering or simulation method",/\b(ray trac\w*|path trac\w*|raster\w*|vector|shader|render\w*|global illumination|ambient occlusion|simulation|photogrammetr\w*|voxel|sdf|nurbs|subdivision)\b/i],
["material_light","Material or light response",/\b(material|roughness|refraction|reflection|subsurface|anisotropic|specular|diffuse|shadow|illumination|translucen\w*)\b/i],
["technical_fidelity","Technical fidelity or artifact control",/\b(topology|sampling|anti.alias|aliasing|noise|denois\w*|resolution|geometry|mesh|precision|physically plausible|physical accuracy)\b/i]
],
"colour-atmosphere":[
["colour_relationship","Colour relationships",/\b(complementary|analogous|triadic|split.complementary|warm.cool|hue|chroma|saturation|palette|colour harmony|color harmony)\b/i],
["tonal_roles","Tonal and contrast roles",/\b(highlight|shadow|midtone|contrast|luminance|value range|black point|white point|tonal|duotone|monochrome)\b/i],
["atmospheric_cause","Atmospheric or lighting cause",/\b(haze|mist|fog|diffusion|ambient|volumetric|backlight|weather|time of day|nocturnal|dawn|dusk|temperature|light source)\b/i]
],
"films-shows":[
["source_identity","Source-world or character identity",/\b(source|reference|character|world|universe|setting|canon|identity|recognis\w*|recogniz\w*|faithful|faithfulness)\b/i],
["visual_language","Distinctive screen visual language",/\b(art direction|visual language|cinematograph\w*|animation|colour script|color script|linework|lighting|palette|production design|camera language)\b/i],
["scene_continuity","Scene, spatial or continuity control",/\b(scene|environment|continuity|composition|spatial|perspective|atmosphere|costume|prop|architecture)\b/i]
],
"toys-collectibles":[
["collectible_logic","Object and collectible logic",/\b(collectible|toy|figure|card|miniature|sculpt|articulation|display|edition|scale|accessory)\b/i],
["material_production","Material and production",/\b(vinyl|resin|plastic|metal|fabric|paint|mould|mold|cast|injection|print|finish|manufactur\w*)\b/i],
["construction_presentation","Construction or presentation",/\b(joint|assembly|packaging|base|stand|pose|proportion|surface|die.cut|foil|holographic|serialis\w*|serializ\w*)\b/i]
],
"architecture-spaces":[
["programme_users","Programme, use and users",/\b(programme|program|function|purpose|occupant|user|visitor|staff|resident|patient|student|audience|capacity|activity)\b/i],
["site_spatial_logic","Site, circulation and spatial organisation",/\b(site|context|urban|landscape|orientation|circulation|route|access|threshold|entrance|adjacency|zoning|plan|section|sightline)\b/i],
["structure_performance","Structure, material or environmental performance",/\b(structure|span|load|material|envelope|climate|daylight|ventilation|acoustic|thermal|fire|safety|accessibility|construction)\b/i]
],
"sculpture-3d-objects":[
["form_material","Form and material logic",/\b(form|volume|mass|silhouette|material|surface|texture|weight|density|proportion|geometry)\b/i],
["fabrication_stability","Fabrication, assembly or stability",/\b(fabricat\w*|cast\w*|carv\w*|weld\w*|join\w*|fasten\w*|assembly|balance|stability|support|load|tension|compression|mechanism)\b/i],
["site_viewer","Site, movement or viewer relationship",/\b(site|public|viewer|audience|human.scale|interaction|movement|kinetic|circulation|landscape|interior|installation|sightline)\b/i]
],
"graphic-design-layout":[
["communication_hierarchy","Communication and information hierarchy",/\b(message|communication|hierarchy|reading order|legibility|readability|audience|information|headline|body copy|call to action)\b/i],
["typography_layout","Typography and layout system",/\b(typograph\w*|typeface|letterform|grid|column|baseline|leading|kerning|alignment|margin|whitespace|white space)\b/i],
["format_production","Format or production constraints",/\b(format|print|paper|ink|spot colour|spot color|cmyk|bleed|trim|fold|binding|screenprint|risograph|foil|emboss|deboss)\b/i]
],
"photography-camera":[
["capture_intent","Photographic intent and subject context",/\b(documentary|editorial|portrait|landscape|sports|product|architectural|street|still.life|subject|environment|moment|narrative|context)\b/i],
["optical_choice","Lens, perspective or camera choice",/\b(lens|focal length|wide.angle|telephoto|macro|fisheye|anamorphic|perspective|camera|viewpoint|sensor|format)\b/i],
["exposure_focus","Exposure, movement or focus control",/\b(exposure|shutter|aperture|iso|flash|focus|depth of field|bokeh|motion blur|long exposure|white balance|bracketing)\b/i]
],
"product-design":[
["task_user","User, task and use context",/\b(user|task|use case|function|purpose|interaction|operation|accessibility|environment|workflow|hand|body|operator)\b/i],
["ergonomics_interface","Ergonomics and interface",/\b(ergonom\w*|grip|reach|posture|comfort|contact|interface|control|feedback|display|button|gesture|haptic)\b/i],
["engineering_lifecycle","Engineering, manufacture and lifecycle",/\b(material|component|battery|thermal|assembly|fastener|manufactur\w*|serviceab\w*|repair\w*|durab\w*|tolerance|sustainab\w*|recycl\w*)\b/i]
]
};
const METHOD=/\b(transform|construct|build|model|compose|render|simulate|fabricate|photograph|capture|arrange|integrate|derive|develop|specify|engineer|reconfigure|reproduce|translate|apply|define|stage|assemble|shape|form|position|control|preserve|retain|calibrate|layer|grade|process|treat)\b/i;
const CONTROLS=/\b(silhouette|proportion|geometry|scale|viewpoint|perspective|composition|surface|texture|material|lighting|contrast|palette|depth|focus|structure|edge|shape|form|spatial|tonal|colour|color|alignment|hierarchy|roughness|reflectance|exposure|aperture|shutter|typography|grid|circulation|ergonomic|interface|fabrication|assembly|finish|grain|translucen\w*|refraction|shadow|highlight|negative space)\b/i;
const CONTEXT=/\b(function|purpose|environment|scene|reference|use case|audience|story|narrative|domain|user|visitor|site|location|context|task|intent|application|setting|programme|program|workflow|operation)\b/i;
const QUALITY=/\b(preserve|retain|accurate|credible|believable|legible|readable|balanced|precise|coherent|consistent|physically plausible|anatomical|structural integrity|clean topology|controlled|intentional|resolve|refine|artifact|artefact|seamless|continuity)\b/i;
const FALLBACK=/Use the specific module .{1,120} as the decisive proposition\.\s*Show the design decisions that make this module distinct/i;
const VAGUE=[/make it (?:beautiful|amazing|stunning|eye.catch(?:ing)?|visually interesting|unique)/i,/add (?:lots of|more|extra) detail/i,/high quality (?:image|render|result|output)/i,/professional quality/i,/make it pop/i,/visually appealing/i];

function norm(value){return String(value||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();}
function excerpt(text,match){const at=match.index||0;return text.slice(Math.max(0,at-45),Math.min(text.length,at+match[0].length+75)).replace(/\s+/g," ").trim();}
function issue(list,code,severity,dimension,evidence,why,action){if(!list.some(x=>x.code===code))list.push({code,severity,dimension,evidence,whyItMatters:why,suggestedAction:action});}
function evidence(text,re){const m=re.exec(text);return m?excerpt(text,m):null;}
function skeleton(record){
 let text=String(record.prompt||"");
 const values=[record.title,record.category].concat(Array.isArray(record.tags)?record.tags:[]).filter(Boolean).sort((a,b)=>String(b).length-String(a).length);
 for(const value of values){const escaped=String(value).split("").map(ch=>"\\^$.*+?()[]{}|/".includes(ch)?"\\"+ch:ch).join("");text=text.replace(new RegExp(escaped,"gi")," MODULETOKEN ");}
 return norm(text.replace(/\[SUBJECT\]/gi," SOURCEINPUT "));
}
function targetSubstitutionFingerprint(record,source){
 let text=String(source.prompt||"");
 text=text.replace(/\[SUBJECT\]/gi," SOURCEINPUT ");
 const title=String(source.title||"");
 if(title){
  const escaped=title.split("").map(ch=>"\\^$.*+?()[]{}|/".includes(ch)?"\\"+ch:ch).join("");
  text=text.replace(new RegExp(escaped,"gi")," TARGETNAME ");
 }
 return norm(text);
}
function targetSubstitutionPreview(source){
 let text=String(source.prompt||"");
 text=text.replace(/\[SUBJECT\]/gi,"[SOURCE]");
 const title=String(source.title||"");
 if(title){
  const escaped=title.split("").map(ch=>"\\^$.*+?()[]{}|/".includes(ch)?"\\"+ch:ch).join("");
  text=text.replace(new RegExp(escaped,"gi"),"[TARGET ELEMENT]");
 }
 return text;
}
function detectTargetSubstitutionFamilies(prompts,records){
 const categoryCounts=new Map(),groups=new Map();
 for(const record of records){
  if(!UNIVERSAL_TARGET_CATEGORIES.has(record.category)||!record.prompt)continue;
  categoryCounts.set(record.category,(categoryCounts.get(record.category)||0)+1);
  const key=record.category+"::"+targetSubstitutionFingerprint(record,prompts[record.index]);
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(record);
 }
 const families=[];
 for(const [key,members] of groups){
  const category=members[0].category,total=categoryCounts.get(category)||0,coverage=total?members.length/total:0;
  if(members.length<MIN_TARGET_FAMILY_SIZE||coverage<0.8)continue;
  const familyId=category+"-target-substitution-"+String(families.length+1).padStart(2,"0");
  const memberList=members.map(r=>({id:r.id,title:r.title,subcategory:r.subcategory}));
  const source=prompts[members[0].index];
  const family={
   familyId,category,count:members.length,categoryTotal:total,categoryCoverage:Number((coverage*100).toFixed(1)),
   classification:"rewrite_family_candidate",
   evidence:"The complete normalized prompt body is identical across this family after masking only [SUBJECT] and each record's exact target title. The target concept therefore changes, but the instructions do not.",
   whyItMatters:"A material, style, texture, effect or other selected target may require its own physical, visual, technical or compositional execution logic. A single generic instruction body does not explain how the selected target should actually behave or be applied.",
   recommendedAction:"Redesign this as a family of target-aware prompts. Preserve any useful common source-lock/application scaffold, but add genuinely distinct mechanisms, visual consequences, execution parameters and exclusions for each target. Review one representative from every subcategory before regenerating the family.",
   targetSpecificRequirements:TARGET_REDESIGN_BRIEFS[category]||[],
   members:memberList,sharedTemplatePreview:targetSubstitutionPreview(source)
  };
  families.push(family);
  for(const record of members){
   record.targetSubstitutionFamily={id:familyId,size:members.length,categoryCoverage:family.categoryCoverage};
   record.familyRewriteCandidate=true;
   issue(record.issues,"target_substitution_family","review","target-specific execution",
    {familyId,familySize:members.length,categoryCoverage:family.categoryCoverage},
    "This record belongs to a large family whose complete prompt body is unchanged after masking only the target name. It is a family-level redesign candidate, not an automatic instruction to rewrite this record in isolation.",
    "Contribute target-specific execution logic to the family redesign: define the selected target's mechanism, observable consequences, controls and exclusions.");
  }
 }
 return families;
}
function analysePrompts(prompts){
 const records=prompts.map((p,index)=>{
  const text=String(p.prompt||""),id=String(p.id==null?"":p.id),title=String(p.title||""),category=String(p.category||"unknown");
  const words=text.split(/\s+/).filter(Boolean).length,issues=[];
  if(!id)issue(issues,"missing_id","high","structure",null,"The record has no stable identifier.","Assign a unique record ID.");
  if(!title.trim())issue(issues,"missing_title","high","structure",null,"The record cannot be reliably identified.","Add a specific, searchable title.");
  if(!text.trim())issue(issues,"missing_prompt_body","high","structure",null,"There is no executable prompt body.","Write the complete prompt before publishing.");
  if(text&&!/\[SUBJECT\]/i.test(text))issue(issues,"missing_subject_anchor","high","source anchoring",null,"The required source-subject variable is missing.","Restore [SUBJECT] and state how the source identity is preserved or transformed.");
  const malformed=text.match(/\[[A-Z][A-Z0-9 _-]{2,}(?=[^\]])/);
  if(malformed&&!/\[[A-Z][A-Z0-9 _-]{2,}\]/.test(text))issue(issues,"possible_malformed_placeholder","medium","structure",malformed[0],"A bracketed uppercase token may be an unfinished variable.","Check the placeholder syntax and retain only supported variables.");
  const fallback=FALLBACK.exec(text);
  if(fallback)issue(issues,"generic_module_focus_fallback","medium","module differentiation",excerpt(text,fallback),"The module-specific section falls back to generic instructions instead of stating the selected module's actual design or execution logic.","Replace the fallback with a module-specific mechanism, visual consequence, functional principle or production decision.");
  const vague=VAGUE.map(re=>re.exec(text)).filter(Boolean),method=METHOD.test(text),controls=CONTROLS.test(text),context=CONTEXT.test(text),quality=QUALITY.test(text);
  if(vague.length>=2&&(!method||!controls))issue(issues,"generic_instruction_density","medium","operational specificity",vague.slice(0,3).map(m=>excerpt(text,m)),"Several broad quality claims appear without enough detectable method or concrete controls.","Replace generic adjectives with concrete decisions: mechanism, hierarchy, material behaviour or execution constraints.");
  if(text&&words>=35&&!method&&!controls&&!context)issue(issues,"low_operational_specificity","medium","operational specificity",{methodSignal:method,controlSignal:controls,contextSignal:context},"The prompt contains little detectable instruction about what to do, what to control or why the transformation is being made.","Manually check for an executable method, concrete controls and meaningful context. Pattern absence alone is not proof of absence.");
  const specialistReview=(CHECKS[category]||[]).map(([key,label,re])=>({key,question:label,evidenceStatus:evidence(text,re)?"evidence_detected":"not_detected_by_pattern",evidence:evidence(text,re)}));
  return {index,id,title,category,subcategory:Array.isArray(p.tags)?p.tags.join(" / "):"",wordCount:words,disposition:"no_rewrite_signal_detected",confidence:"none",rewriteCandidate:false,familyRewriteCandidate:false,targetSubstitutionFamily:null,issues,operationalSignals:{methodEvidenceDetected:method,controlEvidenceDetected:controls,contextEvidenceDetected:context,qualityEvidenceDetected:quality},specialistReview,templateFamily:null,prompt:text};
 });
 const idGroups=new Map(),bodyGroups=new Map(),titleGroups=new Map();
 for(const r of records){
  if(r.id){if(!idGroups.has(r.id))idGroups.set(r.id,[]);idGroups.get(r.id).push(r);}
  const body=norm(r.prompt);if(body){if(!bodyGroups.has(body))bodyGroups.set(body,[]);bodyGroups.get(body).push(r);}
  const title=r.category+"::"+norm(r.title);if(r.title){if(!titleGroups.has(title))titleGroups.set(title,[]);titleGroups.get(title).push(r);}
 }
 for(const group of idGroups.values())if(group.length>1)for(const r of group)issue(r.issues,"duplicate_id","high","structure",group.map(x=>x.title),"Multiple records share the same identifier.","Assign a unique ID to each record.");
 for(const group of bodyGroups.values())if(group.length>1)for(const r of group)issue(r.issues,"duplicate_prompt_body","high","duplication",group.filter(x=>x!==r).map(x=>({id:x.id,title:x.title})),"The normalized prompt body is duplicated elsewhere.","Consolidate the duplicate or make the intended distinction explicit.");
 for(const group of titleGroups.values())if(group.length>1)for(const r of group)issue(r.issues,"duplicate_title_in_category","medium","catalogue clarity",group.filter(x=>x!==r).map(x=>({id:x.id,title:x.title})),"The category contains repeated normalized titles.","Differentiate the titles or consolidate duplicate records.");
 const families=new Map();
 for(const r of records)if(SPECIALIST.has(r.category)&&r.prompt){const key=r.category+"::"+skeleton(prompts[r.index]);if(!families.has(key))families.set(key,[]);families.get(key).push(r);}
 const templateFamilies=[];let familyNo=0;
 for(const members of families.values())if(members.length>1){
  familyNo++;const familyId=members[0].category+"-family-"+String(familyNo).padStart(2,"0"),memberList=members.map(m=>({id:m.id,title:m.title,subcategory:m.subcategory}));
  templateFamilies.push({familyId,category:members[0].category,count:members.length,members:memberList});
  for(const r of members){r.templateFamily={id:familyId,size:members.length,members:memberList};issue(r.issues,"shared_template_family","review","specialist differentiation",{familyId,familySize:members.length,peerTitles:members.filter(m=>m!==r).map(m=>m.title)},"After masking title, category and tags, this prompt shares a normalized instruction skeleton with peers. This may be reusable structure, but could also mean prompts differ mainly by interchangeable module names.","Compare actual module-specific reasoning. Each prompt should contain distinct discipline-specific decisions, not only a changed subject label.");}
 }
 const targetSubstitutionFamilies=detectTargetSubstitutionFamilies(prompts,records);
 for(const r of records){
  const high=r.issues.filter(x=>x.severity==="high").length;
  const mediumDimensions=new Set(r.issues.filter(x=>x.severity==="medium"&&x.code!=="shared_template_family").map(x=>x.dimension));
  const substantiveIssues=r.issues.filter(x=>x.code!=="shared_template_family"&&x.code!=="target_substitution_family");
  if(high){r.disposition="rewrite_candidate";r.confidence="high";r.rewriteCandidate=true;}
  else if(mediumDimensions.size>=2){r.disposition="rewrite_candidate";r.confidence="provisional";r.rewriteCandidate=true;}
  else if(r.familyRewriteCandidate){r.disposition="family_rewrite_candidate";r.confidence="family";}
  else if(substantiveIssues.length){r.disposition="targeted_review";r.confidence="review";}
  else if(r.templateFamily){r.disposition="differentiation_review";r.confidence="review";}
 }
 const counts={rewriteCandidates:0,highConfidenceRewriteCandidates:0,provisionalRewriteCandidates:0,targetedReview:0,differentiationReview:0,noRewriteSignalDetected:0,familyRewriteCandidates:0,familyRewriteCandidateMembers:0},byCategory={},issueCounts={};
 for(const r of records){
  if(r.disposition==="rewrite_candidate"){counts.rewriteCandidates++;if(r.confidence==="high")counts.highConfidenceRewriteCandidates++;else counts.provisionalRewriteCandidates++;}
  else if(r.disposition==="family_rewrite_candidate")counts.familyRewriteCandidateMembers++;
  else if(r.disposition==="targeted_review")counts.targetedReview++;
  else if(r.disposition==="differentiation_review")counts.differentiationReview++;
  else counts.noRewriteSignalDetected++;
  const c=byCategory[r.category]||(byCategory[r.category]={total:0,rewriteCandidates:0,familyRewriteCandidateMembers:0,targetedReview:0,differentiationReview:0,noRewriteSignalDetected:0});
  c.total++;
  c[r.disposition==="rewrite_candidate"?"rewriteCandidates":r.disposition==="family_rewrite_candidate"?"familyRewriteCandidateMembers":r.disposition==="targeted_review"?"targetedReview":r.disposition==="differentiation_review"?"differentiationReview":"noRewriteSignalDetected"]++;
  for(const x of r.issues)issueCounts[x.code]=(issueCounts[x.code]||0)+1;
 }
 counts.familyRewriteCandidates=targetSubstitutionFamilies.length;
 counts.familyRewriteCandidateMembers=targetSubstitutionFamilies.reduce((n,f)=>n+f.count,0);
 return {schemaVersion:3,generatedAt:new Date().toISOString(),auditModel:"conservative rule-based triage; no semantic quality score",interpretation:{rewrite_candidate:"Specific defect evidence warrants a human rewrite decision; never rewrite automatically.",targeted_review:"One or more signals need a human check; current evidence is insufficient to recommend rewriting.",differentiation_review:"A shared specialist template skeleton was detected; verify genuinely distinct domain reasoning.",no_rewrite_signal_detected:"No configured rule found a concrete issue. This is not a quality pass.",family_rewrite_candidate:"A large group of records shares the same complete prompt after masking only the target name. Redesign the family template and individual target logic together; do not mechanically rewrite every record."},limitations:["Pattern matches are evidence hints, not semantic understanding.","A missing keyword is never treated as proof that a concept is absent.","Template reuse is a differentiation signal, not an automatic rewrite verdict.","The audit cannot reliably detect factual errors, weak concepts, cultural inaccuracies or subtle semantic redundancy without human review."],total:records.length,counts,issueCounts,byCategory,templateFamilies,targetSubstitutionFamilies,manualCalibration:{status:"human spot-check of representative catalogue records; illustrative calibration, not a statistically validated gold set",examples:[{id:1,title:"Brushed Aluminium",category:"materials",assessment:"member of target-substitution rewrite family",reason:"The same complete instruction body appears for all 200 materials after masking the material title; no aluminium-specific grain direction, anisotropic reflectance, edge treatment or machining behaviour is specified."},{id:201,title:"Bauhaus",category:"styles",assessment:"member of target-substitution rewrite family",reason:"The same complete instruction body appears for all 125 styles after masking the style title; no Bauhaus-specific geometry, typography, palette, composition or historical visual grammar is specified."},{id:326,title:"Fine Film Grain",category:"textures",assessment:"member of target-substitution rewrite family",reason:"The same complete instruction body appears for all 125 textures after masking the texture title; no grain size, density, distribution, luminance response or interaction with image detail is specified."},{id:6050,title:"Void-Carved Monolith",category:"sculpture-3d-objects",assessment:"not a rewrite candidate based on this sample",reason:"Its subcategory method and module focus specify subtraction, compression, mass, void, centre of gravity, edge condition, material weight and viewing distance."},{id:6033,title:"Museum",category:"architecture-spaces",assessment:"targeted section review",reason:"The civic/institutional programme method is substantive, but its module-focus section is a generic fallback; improve that section rather than rewrite the complete prompt."},{id:6210,title:"Portable Device",category:"product-design",assessment:"not a rewrite candidate based on this sample",reason:"Its method specifies interface hierarchy, tactile inputs, ports, sensors, thermal paths, component placement, hand ergonomics and serviceability."}]},records};
}
function markdown(report){
 const out=["# Prompt Intelligence Audit v3","","**Records:** "+report.total+"  ","**Rewrite candidates:** "+report.counts.rewriteCandidates+" (high-confidence structural: "+report.counts.highConfidenceRewriteCandidates+"; provisional multi-signal: "+report.counts.provisionalRewriteCandidates+")  ",
  "**Rewrite-family candidates:** "+report.counts.familyRewriteCandidates+" families / "+report.counts.familyRewriteCandidateMembers+" member prompts  ","**Targeted review:** "+report.counts.targetedReview+"  ","**Differentiation review:** "+report.counts.differentiationReview+"  ","**No rewrite signal detected:** "+report.counts.noRewriteSignalDetected,"","> Rewrite candidates are a human-review shortlist, not automatic rewrite orders. No score is used; pattern absence is not proof of quality.","","## Issue types"];
 for(const [k,v] of Object.entries(report.issueCounts).sort((a,b)=>b[1]-a[1]))out.push("- "+k+": "+v);
 out.push("","## Collection triage","| Collection | Total | Rewrite candidates | Family rewrite members | Targeted review | Differentiation review | No signal |","|---|---:|---:|---:|---:|---:|---:|");
 for(const [k,v] of Object.entries(report.byCategory))out.push("| "+k+" | "+v.total+" | "+v.rewriteCandidates+" | "+v.familyRewriteCandidateMembers+" | "+v.targetedReview+" | "+v.differentiationReview+" | "+v.noRewriteSignalDetected+" |");
 out.push("","## Rewrite candidates");
 const candidates=report.records.filter(r=>r.rewriteCandidate);
 if(!candidates.length)out.push("No records met the conservative rewrite-candidate threshold. Inspect targeted and differentiation queues rather than manufacturing false positives.");
 for(const r of candidates.slice(0,80)){out.push("- **"+r.id+" — "+r.title+" ("+r.category+")** ["+r.confidence+"]");for(const x of r.issues)if(x.severity==="high"||x.severity==="medium")out.push("  - "+x.code+": "+x.whyItMatters);}
 out.push("","## Target-substitution rewrite families");
 if(!report.targetSubstitutionFamilies.length)out.push("No large target-substitution family met the conservative threshold.");
 for(const f of report.targetSubstitutionFamilies){out.push("- **"+f.familyId+" — "+f.category+" ("+f.count+"/"+f.categoryTotal+", "+f.categoryCoverage+"%)**: "+f.evidence+" Action: "+f.recommendedAction);for(const item of f.targetSpecificRequirements)out.push("  - "+item);}
 out.push("","## Specialist template families");
 if(!report.templateFamilies.length)out.push("No repeated specialist skeletons detected.");
 for(const f of report.templateFamilies)out.push("- **"+f.familyId+" — "+f.category+" ("+f.count+")**: "+f.members.map(x=>x.title).join("; "));
 out.push("","## Limitations",report.limitations.map(x=>"- "+x).join("\n"),"","Full record evidence, prompt text and pattern checks are in the JSON artifact.");
 return out.join("\n");
}
function loadCatalogue(){
 const app=fs.readFileSync("app.js","utf8"),start=app.indexOf("const collections = "),end=app.indexOf(";\nlet prompts",start);
 if(start<0||end<0)throw new Error("Unable to parse collections from app.js");
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync("catalogue-expansion.js","utf8"),sandbox,{timeout:5000});
 const prompts=sandbox.window.AI_PROMPT_EXPANSION||[];if(!prompts.length)throw new Error("Catalogue expansion loaded no prompts");return prompts;
}
function calibrationTest(){
 const prompts=loadCatalogue(),report=analysePrompts(prompts);
 const expected={materials:200,styles:125,textures:125,lighting:75,effects:125,composition:75,rendering:75,"colour-atmosphere":75};
 if(report.total!==1521)throw new Error("Calibration failed: expected 1,521 records, got "+report.total);
 if(report.targetSubstitutionFamilies.length!==8)throw new Error("Calibration failed: expected eight target-substitution families.");
 for(const [category,count] of Object.entries(expected)){
  const matches=report.targetSubstitutionFamilies.filter(f=>f.category===category);
  if(matches.length!==1||matches[0].count!==count||matches[0].categoryTotal!==count||matches[0].categoryCoverage!==100)throw new Error("Calibration failed for "+category+": expected one full-coverage family of "+count+".");
 }
 if(report.counts.familyRewriteCandidateMembers!==875)throw new Error("Calibration failed: expected 875 family-level candidate members.");
 const byId=new Map(report.records.map(r=>[String(r.id),r]));
 const brushed=byId.get("1"),bauhaus=byId.get("201"),grain=byId.get("326"),monolith=byId.get("6050"),museum=byId.get("6033"),device=byId.get("6210");
 if(!brushed?.familyRewriteCandidate||!bauhaus?.familyRewriteCandidate||!grain?.familyRewriteCandidate)throw new Error("Calibration failed: universal collection examples were not assigned to rewrite families.");
 if(monolith?.rewriteCandidate||monolith?.familyRewriteCandidate||monolith?.disposition!=="differentiation_review")throw new Error("Calibration failed: domain-specific sculpture prompt was over-escalated.");
 if(museum?.disposition!=="targeted_review"||!museum.issues.some(x=>x.code==="generic_module_focus_fallback"))throw new Error("Calibration failed: Museum module-focus section was not isolated as targeted review.");
 if(device?.rewriteCandidate||device?.familyRewriteCandidate||device?.issues.some(x=>x.code==="generic_module_focus_fallback"))throw new Error("Calibration failed: Product Design specialist prompt was over-escalated.");
 return "PASS: all 1,521 records calibrated; eight target-substitution rewrite families / 875 members; strong specialist examples retained; Museum section-level gap isolated.";
}
function selfTest(){
 const strong={id:1,title:"Calibrated Material Study",category:"materials",tags:["Metals"],prompt:"[SUBJECT] Transform the supplied object into brushed aluminium while preserving its defining silhouette and proportions. Model the directional grain, anisotropic reflectance, edge radii and subtle machining marks. Control the key-light direction so highlights travel consistently across the surface; retain the source geometry and avoid unrelated additions. Resolve the transition between polished edges and satin faces."};
 const weak={id:2,title:"Generic Module",category:"product-design",tags:["Consumer Electronics"],prompt:"[SUBJECT] Make it beautiful, amazing, stunning and visually interesting. Add lots of detail and make it unique. Use the specific module Portable Device as the decisive proposition. Show the design decisions that make this module distinct."};
 const duplicate={id:3,title:"Duplicate",category:"materials",tags:["Metals"],prompt:strong.prompt};
 const missing={id:4,title:"Missing Anchor",category:"styles",tags:["Illustration"],prompt:"Create a compelling illustration with a considered line system and clear composition."};
 const strongResult=analysePrompts([strong]);
 if(strongResult.records[0].rewriteCandidate||strongResult.counts.familyRewriteCandidates)throw new Error("Strong material fixture was incorrectly escalated.");
 const weakResult=analysePrompts([weak]),weakRecord=weakResult.records[0];
 if(!weakRecord.issues.some(x=>x.code==="generic_instruction_density"))throw new Error("Generic wording was not detected.");
 if(!weakRecord.issues.some(x=>x.code==="generic_module_focus_fallback"))throw new Error("Module fallback was not detected.");
 const duplicateResult=analysePrompts([strong,duplicate]);
 if(!duplicateResult.records.every(r=>r.issues.some(x=>x.code==="duplicate_prompt_body")))throw new Error("Duplicate body was not detected.");
 const missingResult=analysePrompts([missing]),missingRecord=missingResult.records[0];
 if(!missingRecord.issues.some(x=>x.code==="missing_subject_anchor")||!missingRecord.rewriteCandidate)throw new Error("Missing source anchor was not treated as a structural rewrite candidate.");
 const universal=Array.from({length:MIN_TARGET_FAMILY_SIZE},(_,i)=>({id:100+i,title:"Material "+i,category:"materials",tags:["Metals"],prompt:"UNIVERSAL MATERIALS PROMPT\n\nSUBJECT VARIABLE: [SUBJECT]\nTARGET ELEMENT: Material "+i+"\n\nTransform [SUBJECT] into a complete, convincing embodiment of the material Material "+i+". Preserve the source silhouette.\n\nUNIVERSAL APPLICATION: Apply this treatment to the supplied subject. Keep the result coherent."}));
 const familyResult=analysePrompts(universal);
 if(familyResult.counts.familyRewriteCandidates!==1||familyResult.counts.familyRewriteCandidateMembers!==MIN_TARGET_FAMILY_SIZE)throw new Error("Large target-substitution family was not detected.");
 if(!familyResult.records.every(r=>r.familyRewriteCandidate))throw new Error("Family membership was not assigned to each target prompt.");
 return "PASS: strong fixture not escalated; generic instructions, module fallback, duplicate body, missing source anchor and target-substitution family detected.";
}
function main(){
 const args=new Set(process.argv.slice(2));
 if(args.has("--self-test")){console.log(selfTest());return;}
 if(args.has("--calibration-test")){console.log(calibrationTest());return;}
 const report=analysePrompts(loadCatalogue());
 if(args.has("--json")){process.stdout.write(JSON.stringify(report,null,2)+"\n");return;}
 if(args.has("--summary")){process.stdout.write(markdown(report)+"\n");return;}
 console.log("PROMPT INTELLIGENCE AUDIT v3 — conservative triage, not a semantic quality score");
 console.log("Records: "+report.total);
 console.log("Rewrite candidates: "+report.counts.rewriteCandidates+" (high-confidence "+report.counts.highConfidenceRewriteCandidates+", provisional "+report.counts.provisionalRewriteCandidates+")");
 console.log("Targeted review: "+report.counts.targetedReview);
 console.log("Differentiation review: "+report.counts.differentiationReview);
 console.log("No rewrite signal detected: "+report.counts.noRewriteSignalDetected);
 console.log("Rewrite-family candidates: "+report.counts.familyRewriteCandidates+" families / "+report.counts.familyRewriteCandidateMembers+" member prompts");
 console.log("Use --json for all record-level evidence or --summary for Markdown.");
}
if(require.main===module)main();
module.exports={analysePrompts,markdown,norm,skeleton,selfTest};
