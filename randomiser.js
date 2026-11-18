(() => {
  const root = document.querySelector("#randomiser-categories");
  if (!root) return;
  const catalogue = window.AI_PROMPT_BUILDER_CATALOGUE || window.AI_PROMPT_EXPANSION || [];
  const categories = [
    {id:"materials",label:"Materials",cat:["materials"]},{id:"styles",label:"Styles",cat:["styles"]},{id:"textures",label:"Textures",cat:["textures"]},{id:"lighting",label:"Photography Post-Edits",cat:["lighting"]},{id:"effects",label:"Effects",cat:["effects"]},{id:"composition",label:"Composition",cat:["composition"]},{id:"rendering",label:"Rendering",cat:["rendering"]},{id:"colour-atmosphere",label:"Colour & Atmosphere",cat:["colour-atmosphere"]},
    {id:"films-shows-tv",label:"Films & Shows — TV Shows",cat:["films-shows"],tag:"TV Shows"},{id:"films-shows-cartoon",label:"Films & Shows — Cartoons",cat:["films-shows"],tag:"Cartoons"},{id:"films-shows-films",label:"Films & Shows — Films",cat:["films-shows"],tag:"Films"},{id:"films-shows-anime",label:"Films & Shows — Anime",cat:["films-shows"],tag:"Anime"},{id:"films-shows-other",label:"Films & Shows — Other Screen Worlds",cat:["films-shows"],tag:"Other Screen Worlds"},{id:"toys-collectibles",label:"Toys & Collectibles",cat:["toys-collectibles"]}
  ];
  const selected = new Map();
  let lastPrompt = "", mode = "smart";
  const output = document.querySelector("#randomiser-result"), copy = document.querySelector("#randomiser-copy"), title = document.querySelector("#randomiser-result-title"), compatibilityBox = document.querySelector("#randomiser-compatibility");
  const esc = s => String(s ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const available = c => catalogue.filter(p => c.cat.includes(p.category) && (!c.tag || (p.tags||[]).includes(c.tag)));
  root.innerHTML = categories.map(c => {
    const n=available(c).length;
    return '<div class="randomiser-category" data-category="'+c.id+'"><label class="randomiser-category-main"><input type="checkbox" class="randomiser-enabled"><span class="randomiser-category-name">'+esc(c.label)+'</span><small>'+n+' available</small></label><label class="randomiser-quantity" hidden>Quantity <select class="randomiser-count" aria-label="Prompt quantity for '+esc(c.label)+'">'+[1,2,3].map(x=>'<option value="'+x+'">'+x+'</option>').join("")+'</select></label></div>';
  }).join("");
  root.querySelectorAll(".randomiser-category").forEach(row => {
    const c=categories.find(x=>x.id===row.dataset.category),cb=row.querySelector(".randomiser-enabled"),qty=row.querySelector(".randomiser-count"),qWrap=row.querySelector(".randomiser-quantity");
    cb.addEventListener("change",()=>{if(cb.checked)selected.set(c.id,Number(qty.value));else selected.delete(c.id);qWrap.hidden=!cb.checked;});
    qty.addEventListener("change",()=>{if(cb.checked)selected.set(c.id,Number(qty.value));});
  });
  const composePrompt=(chosen,selectedMode)=>{
    const get=c=>chosen.filter(x=>x.prompt.category===c).map(x=>x.prompt.title);
    const list=arr=>arr.length?arr.join(", "):"";
    const material=get("materials"),texture=get("textures"),style=get("styles"),lighting=get("lighting"),effect=get("effects"),composition=get("composition"),rendering=get("rendering"),colour=get("colour-atmosphere"),screen=get("films-shows"),toy=get("toys-collectibles");
    const parts=[selectedMode==="smart"?"Create one unified image from the supplied subject. Integrate all selected elements into a cohesive visual direction. Prioritise compatibility, visual synergy, coherent physical logic and harmonious interaction; treat ingredients as unified design decisions, never as separate prompt layers.":"Create one unified image from the supplied subject using an unrestricted experimental combination. Do not optimise compatibility or neutralise contradictions. Allow visual tension, opposing aesthetics, unexpected material behaviour and creative accidents, but fuse all ingredients into one unified image rather than stacking prompts."];
    if(material.length)parts.push("Material identity: "+list(material)+". Make this material physically convincing and let it govern surface, reflectance, translucency, weight and edge behaviour.");
    if(texture.length)parts.push("Surface detail: "+list(texture)+". Integrate as material-aware detail, not unrelated overlays.");
    if(style.length)parts.push("Visual language: "+list(style)+". Apply as the governing aesthetic across shape, detail, colour handling and finish.");
    if(screen.length)parts.push("World and art direction: "+list(screen)+". Adapt the art direction across subject and surroundings without copying a specific character.");
    if(toy.length)parts.push("Collectible/object treatment: "+list(toy)+". Resolve form, scale, manufacture, materials and finish as one designed object.");
    if(colour.length)parts.push("Colour and atmosphere: "+list(colour)+". Integrate palette and mood into lighting, background and tonal hierarchy.");
    if(lighting.length)parts.push("Lighting and photographic finish: "+list(lighting)+". Establish readable form and deliberate highlight/shadow behaviour.");
    if(effect.length)parts.push("Optical/environmental effects: "+list(effect)+". Make effects interact with material, lighting and environment.");
    if(composition.length)parts.push("Composition: "+list(composition)+". Establish focal point, spatial balance and framing.");
    if(rendering.length)parts.push("Rendering: "+list(rendering)+". Maintain consistent visual logic, fidelity and detail.");
    parts.push(selectedMode==="smart"?"Resolve priorities: subject readability first, primary material and style identity second, supporting texture, light, effects and atmosphere in balance. Avoid repetition, clutter, unrelated decoration, contradictions and collage-like layering.":"Keep the experimental collision intact. Let incompatible qualities coexist as deliberate visual tension, while avoiding a literal collage or separate ingredient overlays. Make the final result one complete visual concept.");
    return "RANDOMISED VISUAL PROMPT\n\n"+parts.join("\n\n");
  };
  const drawRandom=()=>{
    const chosen=[];
    categories.filter(c=>selected.has(c.id)).forEach(c=>{
      const pool=available(c).slice(),amount=Math.min(selected.get(c.id)||1,pool.length);
      for(let i=0;i<amount;i++){const idx=Math.floor(Math.random()*pool.length);chosen.push({category:c.label,prompt:pool.splice(idx,1)[0]});}
    });
    return chosen;
  };
  const drawSmart=()=>{
    let best=null,bestScore=-Infinity;
    for(let t=0;t<24;t++){
      const trial=drawRandom();let score=0,pairs=0;
      if(window.PromptIntelligence&&trial.length>1){
        for(let i=0;i<trial.length;i++)for(let j=i+1;j<trial.length;j++){
          const result=window.PromptIntelligence.compatibility(trial[i].prompt,trial[j].prompt);score+=Number(result.score)||0;pairs++;
        }
      }else score=trial.length?100:0;
      score=pairs?score/pairs:score;if(score>bestScore){bestScore=score;best=trial;}
    }
    return best||drawRandom();
  };
  const showDiagnostics=chosen=>{
    if(!compatibilityBox||!window.PromptIntelligence||mode!=="smart"){if(compatibilityBox){compatibilityBox.hidden=true;compatibilityBox.innerHTML="";}return;}
    const pairs=[];for(let i=0;i<chosen.length;i++)for(let j=i+1;j<chosen.length;j++){const c=window.PromptIntelligence.compatibility(chosen[i].prompt,chosen[j].prompt);pairs.push({a:chosen[i].prompt.title,b:chosen[j].prompt.title,c});}
    compatibilityBox.hidden=!pairs.length;compatibilityBox.innerHTML=pairs.length?'<details class="randomiser-diagnostics"><summary>Compatibility analysis ('+pairs.length+' pairings)</summary><div class="compat-list">'+pairs.map(p=>'<div class="compat-row"><span><strong>'+esc(p.a)+' ↔ '+esc(p.b)+'</strong><small>'+esc(p.c.level||"Compatibility")+(p.c.warnings?.length?' · '+esc(p.c.warnings.join(" ")):'')+'</small></span><span class="compat-score">'+esc(p.c.score)+'/100</span></div>').join("")+'</div></details>':'';
  };
  const render=()=>{
    const chosen=mode==="smart"?drawSmart():drawRandom();
    if(!chosen.length){output.innerHTML='<p class="randomiser-placeholder">Select at least one category to generate a prompt.</p>';copy.disabled=true;lastPrompt="";showDiagnostics([]);return;}
    lastPrompt=composePrompt(chosen,mode);
    const body=lastPrompt.replace("RANDOMISED VISUAL PROMPT\n\n","");
    const preview=body.length>220?body.slice(0,220)+"…":body;
    const sources=chosen.map(x=>'<details class="randomiser-source-prompt"><summary><span>'+esc(x.prompt.title)+'</span><small>'+esc(x.category)+'</small></summary><div class="randomiser-source-prompt-text">'+esc(x.prompt.prompt)+'</div></details>').join("");
    output.innerHTML='<article class="randomiser-composed"><p class="randomiser-composed-label">ONE COMPLETE COMBINED PROMPT</p><details class="randomiser-prompt-details"><summary><span>Expand combined prompt</span><small>'+esc(preview)+'</small></summary><div class="randomiser-composed-text">'+esc(body)+'</div></details><details class="randomiser-source-details"><summary>View source ingredients ('+chosen.length+')</summary><div class="randomiser-source-list">'+sources+'</div></details></article>';
    title.textContent=(mode==="smart"?"Smart mode":"Experimental mode")+" · "+chosen.length+" ingredients";copy.disabled=false;showDiagnostics(chosen);
  };
  document.querySelector("#randomiser-generate").addEventListener("click",render);
  root.closest(".randomiser-panel").querySelectorAll("input[name=randomiser-mode]").forEach(r=>r.addEventListener("change",()=>{mode=r.value;title.textContent=mode==="smart"?"Smart mode selected":"Experimental mode selected";}));
  document.querySelector("#randomiser-clear").addEventListener("click",()=>{
    selected.clear();root.querySelectorAll(".randomiser-enabled").forEach(x=>x.checked=false);root.querySelectorAll(".randomiser-quantity").forEach(x=>x.hidden=true);root.querySelectorAll(".randomiser-count").forEach(x=>x.value="1");
    output.innerHTML='<p class="randomiser-placeholder">Choose categories, then generate one integrated prompt.</p>';title.textContent="Your prompt mix";copy.disabled=true;lastPrompt="";
    if(compatibilityBox){compatibilityBox.hidden=true;compatibilityBox.innerHTML="";}
  });
  copy.addEventListener("click",async()=>{if(!lastPrompt)return;try{await navigator.clipboard.writeText(lastPrompt);const toast=document.querySelector("#toast");if(toast){toast.textContent="Copied complete combined prompt";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);}}catch{copy.textContent="Clipboard unavailable";}});
})();