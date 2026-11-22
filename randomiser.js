(() => {
  "use strict";
  const root=document.querySelector("#randomiser-categories"); if(!root)return;
  const db=window.AI_PROMPT_BUILDER_CATALOGUE||window.AI_PROMPT_EXPANSION||[];
  const cats=[["materials","Materials","materials"],["styles","Styles","styles"],["textures","Textures","textures"],["lighting","Photography Post-Edits","lighting"],["effects","Effects","effects"],["composition","Composition","composition"],["rendering","Rendering","rendering"],["colour-atmosphere","Colour & Atmosphere","colour-atmosphere"],["films-tv","Films & Shows — TV Shows","films-shows","TV Shows"],["films-cartoon","Films & Shows — Cartoons","films-shows","Cartoons"],["films-films","Films & Shows — Films","films-shows","Films"],["films-anime","Films & Shows — Anime","films-shows","Anime"],["films-other","Films & Shows — Other Screen Worlds","films-shows","Other Screen Worlds"],["toys-collectibles","Toys & Collectibles","toys-collectibles"],["architecture-spaces","Architecture & Spaces","architecture-spaces"],["sculpture-3d-objects","Sculpture & 3D Objects","sculpture-3d-objects"],["graphic-design-layout","Graphic Design & Layout","graphic-design-layout"],["photography-camera","Photography & Camera","photography-camera"],["product-design","Product Design","product-design"]];
  const picked=new Map();let mode="smart",fullPrompt="";
  const output=document.querySelector("#randomiser-result"),copyBtn=document.querySelector("#randomiser-copy"),heading=document.querySelector("#randomiser-result-title"),compat=document.querySelector("#randomiser-compatibility");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const options=c=>db.filter(p=>p.category===c[2]&&(!c[3]||(p.tags||[]).includes(c[3])));
  root.innerHTML=cats.map(c=>'<div class="randomiser-category" data-id="'+esc(c[0])+'"><label class="randomiser-category-main"><input type="checkbox" class="randomiser-enabled"><span class="randomiser-category-name">'+esc(c[1])+'</span><small>'+options(c).length+' available</small></label><label class="randomiser-quantity" hidden>Quantity <select class="randomiser-count" aria-label="Quantity">'+[1,2,3].map(n=>'<option value="'+n+'">'+n+'</option>').join("")+'</select></label></div>').join("");
  root.querySelectorAll(".randomiser-category").forEach(row=>{const c=cats.find(x=>x[0]===row.dataset.id),cb=row.querySelector(".randomiser-enabled"),select=row.querySelector("select"),qty=row.querySelector(".randomiser-quantity");cb.addEventListener("change",()=>{qty.hidden=!cb.checked;cb.checked?picked.set(c[0],+select.value):picked.delete(c[0]);});select.addEventListener("change",()=>{if(cb.checked)picked.set(c[0],+select.value);});});
  function sample(){const a=[];cats.filter(c=>picked.has(c[0])).forEach(c=>{let pool=options(c).slice(),n=Math.min(picked.get(c[0]),pool.length);while(n>0&&pool.length){n--;a.push({cat:c,prompt:pool.splice(Math.floor(Math.random()*pool.length),1)[0]});}});return a;}
  let compositionMeta={score:0,warnings:[],pairCount:0};
  function assess(a){
    const pairResults=[];
    if(window.PromptIntelligence&&a.length>1){
      for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){
        pairResults.push(window.PromptIntelligence.compatibility(a[i].prompt,a[j].prompt));
      }
    }
    const score=pairResults.length?pairResults.reduce((sum,x)=>sum+(Number(x.score)||0),0)/pairResults.length:100;
    const warnings=[...new Set(pairResults.flatMap(x=>x.warnings||[]))];
    return{score:Math.round(score),warnings,pairCount:pairResults.length,levels:pairResults.map(x=>x.level)};
  }
  function smartSample(){
    let best=[],bestScore=-Infinity,bestMeta={score:0,warnings:[],pairCount:0};
    for(let attempt=0;attempt<72;attempt++){
      const trial=sample();
      const meta=assess(trial);
      const domainCount=new Set(trial.map(x=>x.prompt.category)).size;
      const conflictPenalty=meta.warnings.length*24;
      const score=meta.score-conflictPenalty+domainCount*1.5;
      if(score>bestScore){best=trial;bestScore=score;bestMeta=meta;}
    }
    compositionMeta=bestMeta;
    return best;
  }
  function compactDirective(item){
    const raw=String(item.prompt.prompt||item.prompt.desc||"").trim();
    if(!raw)return "";
    const blocks=raw.split(/\n\s*\n/).map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean);
    const isMaterial=item.prompt.category==="materials"||/MATERIAL TRANSFORMATION — TARGET-SPECIFIC CONSTRUCTION/i.test(raw);
    const isStyle=item.prompt.category==="styles"||/STYLE TRANSFORMATION — TARGET-SPECIFIC VISUAL LANGUAGE/i.test(raw);
    const preferred=isMaterial?[
      "MATERIAL TRANSFORMATION","SOURCE: [SUBJECT]","MATERIAL TARGET:","SOURCE IDENTITY LOCK:",
      "MATERIAL IDENTITY:","BULK STRUCTURE AND MICROSTRUCTURE:","FORMATION AND MANUFACTURING EVIDENCE:",
      "MECHANICAL AND ENVIRONMENTAL BEHAVIOUR:","OPTICAL RESPONSE:","TARGET MODIFIER:",
      "MATERIAL BOUNDARIES AND EXCLUSIONS:","FINAL SOURCE-AWARE CHECK:"
    ]:isStyle?[
      "STYLE TRANSFORMATION — TARGET-SPECIFIC VISUAL LANGUAGE","SOURCE: [SUBJECT] / [SOURCE IMAGE].","STYLE TARGET:",
      "SOURCE IDENTITY LOCK:","STYLE IDENTITY AND INTENT:","FORM GRAMMAR AND SHAPE LANGUAGE:",
      "LINE, MARKMAKING AND EDGE BEHAVIOUR:","COLOUR, VALUE AND SURFACE SYSTEM:",
      "COMPOSITION AND SPATIAL LOGIC:","MEDIUM AND RENDERING METHOD:","SOURCE ADAPTATION:",
      "STYLE BOUNDARIES AND EXCLUSIONS:","FINAL STYLE-AWARE CHECK:"
    ]:[
      "DESIGN INTENT:","SUBCATEGORY METHOD:","DOMAIN-SPECIFIC EXECUTION:","MODULE-SPECIFIC FOCUS:",
      "SUBJECT RE-CREATION","WORLD AND ENVIRONMENT TRANSFORMATION","UNIFIED ART DIRECTION","SCENE CONTROL",
      "SOURCE INPUT:","TARGET ELEMENT:"
    ];
    const selected=[];
    for(const label of preferred){
      const found=blocks.find(x=>x.toUpperCase().startsWith(label));
      if(found&&!selected.includes(found))selected.push(found);
      if(selected.join(" ").length>(isMaterial?6000:isStyle?8000:1050))break;
    }
    let text=selected.length&&(isMaterial||isStyle||/DESIGN INTENT:|SUBJECT RE-CREATION|WORLD AND ENVIRONMENT TRANSFORMATION|UNIFIED ART DIRECTION|SCENE CONTROL/i.test(raw))?selected.join(" "):raw;
    text=text.replace(/\s+/g," ").trim();
    const maxLength=isMaterial?6000:isStyle?4800:1050;
    if(text.length>maxLength){
      const cut=text.slice(0,maxLength);
      const boundary=Math.max(cut.lastIndexOf(". "),cut.lastIndexOf("; "));
      text=boundary>Math.floor(maxLength*.62)?cut.slice(0,boundary+1):cut.slice(0,maxLength-3)+"…";
    }
    return text;
  }
  function compose(a){
    const buckets={materials:[],styles:[],textures:[],photoFinish:[],effects:[],composition:[],rendering:[],colour:[],world:[],collectibles:[],architecture:[],sculpture:[],graphic:[],photography:[],product:[]};
    const mapRole=category=>{
      if(category==="Materials")return "materials";
      if(category==="Styles")return "styles";
      if(category==="Textures")return "textures";
      if(category==="Photography Post-Edits")return "photoFinish";
      if(category==="Effects")return "effects";
      if(category==="Composition")return "composition";
      if(category==="Rendering")return "rendering";
      if(category==="Colour & Atmosphere")return "colour";
      if(category.startsWith("Films & Shows"))return "world";
      if(category==="Toys & Collectibles")return "collectibles";
      if(category==="Architecture & Spaces")return "architecture";
      if(category==="Sculpture & 3D Objects")return "sculpture";
      if(category==="Graphic Design & Layout")return "graphic";
      if(category==="Photography & Camera")return "photography";
      if(category==="Product Design")return "product";
      return "styles";
    };
    a.forEach(x=>buckets[mapRole(x.cat[1])].push({title:String(x.prompt.title||"").trim(),text:compactDirective(x)}));
    const join=role=>buckets[role].filter(x=>x.text).map(x=>x.title+": "+x.text).join("\n");
    const subjectWorld=join("world"),architecture=join("architecture"),form=join("collectibles"),sculpture=join("sculpture");
    const product=join("product"),graphic=join("graphic"),camera=join("photography"),material=join("materials");
    const style=join("styles"),surface=join("textures"),framing=join("composition"),photoFinish=join("photoFinish");
    const effect=join("effects"),palette=join("colour"),render=join("rendering");
    const mood=mode==="smart"?"SMART / COHERENT":"EXPERIMENTAL / CREATIVE COLLISION";
    const negativeTerms=[...new Set(a.flatMap(x=>String(x.prompt.negative||"").split(/[,;]+/).map(s=>s.trim()).filter(Boolean)))].slice(0,24);
    const textParts=[
      "MASTER IMAGE PROMPT — "+mood,
      "CREATIVE OBJECTIVE: Create one fully resolved image from this brief. Build a single visual proposition with one clear focal subject. Integrate every selected module into the same image; do not turn the result into a collage, moodboard, multi-panel layout or checklist of unrelated effects.",
      "CREATIVE THESIS: Establish the idea, intended viewer response and visual point of difference before rendering. Every secondary decision must reinforce that thesis or be removed.",
      "SUBJECT, IDENTITY & SCENE: [Insert the subject or supply the source image]. Treat the source as the identity anchor. Preserve defining form, proportions, recognisable features and required content unless a selected transformation specifically authorises a change. Give the subject a convincing relationship to its setting.",
      subjectWorld?"SCREEN-WORLD DIRECTION: "+subjectWorld:"" ,
      architecture?"ARCHITECTURE & SPATIAL SYSTEM: "+architecture+" Resolve site, programme, massing, circulation, structure, daylight, access and human scale as one coherent spatial proposition.":"",
      form?"COLLECTIBLE FORMAT & OBJECT CONSTRUCTION: "+form+" Translate the subject into the selected collectible format with legible proportions, construction, materials, assembly, display and product presentation.":"",
      sculpture?"SCULPTURAL FORM & CONSTRUCTION: "+sculpture+" Resolve mass, void, balance, gravity, negative space, material thickness, support and assembly into one credible three-dimensional form.":"",
      product?"PRODUCT FUNCTION & INDUSTRIAL DESIGN: "+product+" Make user task, affordances, ergonomics, interface, manufacturing, assembly, tolerances, safety and serviceability intentional and believable.":"",
      graphic?"GRAPHIC DESIGN & COMMUNICATION: "+graphic+" Resolve format, typographic hierarchy, grid, reading order, spacing and print or screen output. Use only meaningful, legible text.":"",
      style?"VISUAL LANGUAGE: "+style+" Use this as the governing form grammar, abstraction level, image character and detail logic. Select one dominant style; secondary influences may support it but must not compete.":"",
      material?"MATERIAL & PHYSICAL BEHAVIOUR: "+material+" Assign materials where they make functional and visual sense. Resolve reflectance, roughness, translucency, weight, edge response and contact consistently.":"",
      surface?"SURFACE & MICRODETAIL: "+surface+" Treat texture as a controlled surface-level decision. Match scale, direction and coverage to the underlying material; keep detail subordinate to silhouette and concept.":"",
      framing?"COMPOSITION & SPATIAL HIERARCHY: "+framing+" Establish a deliberate focal path, foreground-to-background separation, negative space, scale relationships and clear silhouette readability.":"",
      photoFinish?"PHOTOGRAPHIC FINISH & POST-PRODUCTION: "+photoFinish+" Treat the supplied photograph as a fixed source. Change its photographic finish, tonal response, colour, grain or authorised retouching only; do not invent a new capture, viewpoint or scene unless explicitly requested.":"",
      palette?"COLOUR & ATMOSPHERE: "+palette+" Resolve a unified palette with a clear dominant, supporting and accent relationship. Control saturation, temperature, contrast and atmosphere to protect the focal hierarchy.":"",
      effect?"ATMOSPHERIC / OPTICAL TREATMENT: "+effect+" Integrate effects through a credible source, scale, depth and physical interaction. Avoid pasted overlays or effects that obscure the subject.":"",
      camera?"CAMERA, LENS & CAPTURE: "+camera+" Choose one physically consistent viewpoint, focal length, exposure, focus plane and motion character. Keep perspective, depth and optical behaviour coherent.":"",
      render?"RENDERING & IMAGE FINISH: "+render+" Use a rendering method that supports the selected visual language, materials and output. Resolve clean edges, coherent shading, depth, detail and artefact control.":"",
      "ART-DIRECTION PRIORITY: 1) Preserve mandatory source identity and required content. 2) Respect functional, structural and physical constraints. 3) Establish one dominant creative thesis and visual language. 4) Apply supporting material, texture, composition, photographic and atmospheric treatments only where they reinforce the thesis. 5) Remove redundancy and resolve conflicts instead of stacking contradictory instructions.",
      (mode==="smart"?"SMART RESOLUTION: Prefer a coherent synthesis. Where two modules overlap, retain the more specific instruction and subordinate the other. Where they conflict, honour source identity and functional truth first, then the dominant art direction; interpret incompatible treatments as restrained accents only when they can coexist in one image.":"EXPERIMENTAL RESOLUTION: Permit surprising combinations and deliberate visual tension. Preserve a clear focal subject and coherent construction; resolve competing directions through hierarchy, contrast and controlled juxtaposition rather than random feature stacking."),
      negativeTerms.length?"NEGATIVE CONSTRAINTS: "+negativeTerms.join(", ")+".":"",
      "FINAL QUALITY GATE: Check subject fidelity, hierarchy, spatial logic, proportion, material behaviour, typography where relevant, lighting, camera consistency, edge quality, texture scale and finish. Deliver one intentional, technically convincing image with no accidental artefacts, unrelated props, meaningless text, watermarks or decorative noise."
    ].filter(Boolean);
    return textParts.join("\n\n");
  }
  function render(){const a=mode==="smart"?smartSample():sample();if(!a.length){output.innerHTML='<p class="randomiser-placeholder">Select at least one category to generate a combined prompt.</p>';fullPrompt="";copyBtn.disabled=true;compat.hidden=true;return;}
    compositionMeta=assess(a);fullPrompt=compose(a);const preview=fullPrompt.slice(0,220)+"…";const sources=a.map(x=>'<details class="randomiser-source-prompt"><summary>'+esc(x.prompt.title)+' <small>'+esc(x.cat[1])+'</small></summary><div class="randomiser-source-prompt-text">'+esc(x.prompt.prompt||x.prompt.desc||"")+'</div></details>').join("");
    output.innerHTML='<article class="randomiser-composed"><p class="randomiser-composed-label">ONE COMPLETE COMBINED PROMPT</p><button type="button" class="randomiser-prompt-toggle" aria-expanded="false">Show full combined prompt <span>＋</span></button><p class="randomiser-prompt-preview">'+esc(preview)+'</p><div class="randomiser-composed-text" hidden>'+esc(fullPrompt)+'</div><div class="randomiser-source-details"><button type="button" class="randomiser-ingredients-toggle" aria-expanded="false">View individual ingredient prompts ('+a.length+') <span>＋</span></button><div class="randomiser-source-list" hidden>'+sources+'</div></div></article>';
    const btn=output.querySelector(".randomiser-prompt-toggle"),textBlock=output.querySelector(".randomiser-composed-text");btn.onclick=()=>{const open=btn.getAttribute("aria-expanded")==="true";btn.setAttribute("aria-expanded",String(!open));textBlock.hidden=open;btn.innerHTML=(open?"Show full combined prompt":"Hide full combined prompt")+' <span>'+(open?"＋":"－")+'</span>';};
    const ingredientBtn=output.querySelector(".randomiser-ingredients-toggle"),ingredientList=output.querySelector(".randomiser-source-list");ingredientBtn.onclick=()=>{const open=ingredientBtn.getAttribute("aria-expanded")==="true";ingredientBtn.setAttribute("aria-expanded",String(!open));ingredientList.hidden=open;ingredientBtn.innerHTML=(open?"View individual ingredient prompts":"Hide individual ingredient prompts")+' ('+a.length+') <span>'+(open?"＋":"－")+'</span>';};
    heading.textContent=(mode==="smart"?"Smart":"Experimental")+" mode · "+a.length+" ingredients";
    const warningMarkup=compositionMeta.warnings.length?'<ul>'+compositionMeta.warnings.map(w=>'<li>'+esc(w)+'</li>').join("")+'</ul>':'<p>No major conflicts detected by the compatibility rules.</p>';
    compat.innerHTML='<p><strong>Module compatibility: '+compositionMeta.score+'/100</strong> · '+compositionMeta.pairCount+' pair checks</p>'+warningMarkup;
    compat.hidden=false;copyBtn.disabled=false;
  }
  document.querySelector("#randomiser-generate").addEventListener("click",render);
  document.querySelectorAll('input[name="randomiser-mode"]').forEach(r=>r.addEventListener("change",()=>{if(r.checked){mode=r.value;heading.textContent=mode==="smart"?"Smart mode selected":"Experimental mode selected";}}));
  document.querySelector("#randomiser-clear").addEventListener("click",()=>{picked.clear();root.querySelectorAll(".randomiser-enabled").forEach(x=>x.checked=false);root.querySelectorAll(".randomiser-quantity").forEach(x=>x.hidden=true);root.querySelectorAll(".randomiser-count").forEach(x=>x.value="1");output.innerHTML='<p class="randomiser-placeholder">Choose categories, then generate one integrated prompt.</p>';heading.textContent="Your prompt mix";fullPrompt="";copyBtn.disabled=true;compat.hidden=true;});
  copyBtn.addEventListener("click",async()=>{if(!fullPrompt)return;try{await navigator.clipboard.writeText(fullPrompt);const toast=document.querySelector("#toast");if(toast){toast.textContent="Copied complete combined prompt";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);}}catch{copyBtn.textContent="Clipboard unavailable";}});
})();