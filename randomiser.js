(() => {
  "use strict";
  const root=document.querySelector("#randomiser-categories"); if(!root)return;
  const db=window.AI_PROMPT_BUILDER_CATALOGUE||window.AI_PROMPT_EXPANSION||[];
  const cats=[["materials","Materials","materials"],["styles","Styles","styles"],["textures","Textures","textures"],["lighting","Photography Post-Edits","lighting"],["effects","Effects","effects"],["composition","Composition","composition"],["rendering","Rendering","rendering"],["colour-atmosphere","Colour & Atmosphere","colour-atmosphere"],["films-tv","Films & Shows — TV Shows","films-shows","TV Shows"],["films-cartoon","Films & Shows — Cartoons","films-shows","Cartoons"],["films-films","Films & Shows — Films","films-shows","Films"],["films-anime","Films & Shows — Anime","films-shows","Anime"],["films-other","Films & Shows — Other Screen Worlds","films-shows","Other Screen Worlds"],["toys-collectibles","Toys & Collectibles","toys-collectibles"]];
  const picked=new Map();let mode="smart",fullPrompt="";
  const output=document.querySelector("#randomiser-result"),copyBtn=document.querySelector("#randomiser-copy"),heading=document.querySelector("#randomiser-result-title"),compat=document.querySelector("#randomiser-compatibility");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const options=c=>db.filter(p=>p.category===c[2]&&(!c[3]||(p.tags||[]).includes(c[3])));
  root.innerHTML=cats.map(c=>'<div class="randomiser-category" data-id="'+esc(c[0])+'"><label class="randomiser-category-main"><input type="checkbox" class="randomiser-enabled"><span class="randomiser-category-name">'+esc(c[1])+'</span><small>'+options(c).length+' available</small></label><label class="randomiser-quantity" hidden>Quantity <select class="randomiser-count" aria-label="Quantity">'+[1,2,3].map(n=>'<option value="'+n+'">'+n+'</option>').join("")+'</select></label></div>').join("");
  root.querySelectorAll(".randomiser-category").forEach(row=>{const c=cats.find(x=>x[0]===row.dataset.id),cb=row.querySelector(".randomiser-enabled"),select=row.querySelector("select"),qty=row.querySelector(".randomiser-quantity");cb.addEventListener("change",()=>{qty.hidden=!cb.checked;cb.checked?picked.set(c[0],+select.value):picked.delete(c[0]);});select.addEventListener("change",()=>{if(cb.checked)picked.set(c[0],+select.value);});});
  function sample(){const a=[];cats.filter(c=>picked.has(c[0])).forEach(c=>{let pool=options(c).slice(),n=Math.min(picked.get(c[0]),pool.length);while(n>0&&pool.length){n--;a.push({cat:c,prompt:pool.splice(Math.floor(Math.random()*pool.length),1)[0]});}});return a;}
  function smartSample(){let best=[],max=-Infinity;for(let t=0;t<30;t++){const trial=sample();let total=0,pairs=0;if(window.PromptIntelligence&&trial.length>1){for(let i=0;i<trial.length;i++)for(let j=i+1;j<trial.length;j++){const score=window.PromptIntelligence.compatibility(trial[i].prompt,trial[j].prompt).score;total+=Number(score)||0;pairs++;}}else total=100;const score=pairs?total/pairs:total;if(score>max){best=trial;max=score;}}return best;}
  function compose(a){
    const chosen=a.map(x=>({category:x.cat[1],title:String(x.prompt.title||"").trim(),body:String(x.prompt.prompt||x.prompt.desc||"").trim()}));
    const buckets={materials:[],styles:[],textures:[],lighting:[],effects:[],composition:[],rendering:[],colour:[],world:[],objects:[]};
    const mapRole=category=>{
      if(category==="Materials")return "materials";
      if(category==="Styles")return "styles";
      if(category==="Textures")return "textures";
      if(category==="Photography Post-Edits")return "lighting";
      if(category==="Effects")return "effects";
      if(category==="Composition")return "composition";
      if(category==="Rendering")return "rendering";
      if(category==="Colour & Atmosphere")return "colour";
      if(category.startsWith("Films & Shows"))return "world";
      if(category==="Toys & Collectibles")return "objects";
      return "styles";
    };
    chosen.forEach(x=>buckets[mapRole(x.category)].push(x));
    const clean=s=>String(s||"").replace(/\\s+/g," ").replace(/^[•*\\-]+\\s*/,"").replace(/[.\\s]+$/,"").trim();
    const compact=x=>{
      const body=clean(x.body);
      const sentences=body.split(/(?<=[.!?])\\s+/).filter(Boolean);
      let parts=sentences.length?sentences.slice(0,2):[body];
      if(parts.join(" ").length>330)parts=[parts[0]];
      return parts.join(" ").slice(0,380);
    };
    const directives=role=>buckets[role].map(x=>({name:x.title,text:compact(x)})).filter(x=>x.text);
    const join=arr=>arr.map(x=>x.text).filter(Boolean).join("; ");
    const named=arr=>arr.map(x=>x.name).filter(Boolean).join(", ");
    const subjectWorld=join(directives("world"));
    const form=join(directives("objects"));
    const material=join(directives("materials"));
    const style=join(directives("styles"));
    const surface=join(directives("textures"));
    const framing=join(directives("composition"));
    const light=join(directives("lighting"));
    const effect=join(directives("effects"));
    const palette=join(directives("colour"));
    const render=join(directives("rendering"));
    const allNames=chosen.map(x=>x.title).filter(Boolean);
    const mood=mode==="smart"?"SMART / COHERENT":"EXPERIMENTAL / CREATIVE COLLISION";
    const textParts=[
      "MASTER IMAGE PROMPT — "+mood,
      "Create one fully resolved, high-end image from the following creative brief. Treat it as a single artwork or photograph, not a collage, moodboard, multi-panel layout, or collection of separate effects.",
      "CREATIVE THESIS: Establish one clear visual idea and a deliberate focal subject. The image should communicate a distinct concept immediately, with every secondary decision reinforcing that concept rather than competing for attention.",
      "SUBJECT & SCENE: [Insert subject or reference image]."+(subjectWorld?" Shape its setting and world through this direction: "+subjectWorld+".":"")+" Preserve the subject's defining form, identity, proportions and recognisable features unless transformation is explicitly part of the brief. Give the subject a believable relationship to the environment and a clear reason to occupy the frame.",
      (form?"OBJECT / FORM LANGUAGE: "+form+".":""),
      (style?"VISUAL LANGUAGE: Apply "+style+". Treat this as the overarching art-direction grammar—shape language, level of abstraction, detail, finish and visual character—not as a collection of independent styles.":""),
      (material?"MATERIAL & PHYSICALITY: "+material+". Assign materials according to the object's form and function; make surface qualities, weight, translucency, reflectivity and edge behaviour visually credible.":""),
      (surface?"SURFACE DETAIL: "+surface+". Use this as controlled surface-level detail. Keep it subordinate to silhouette, focal hierarchy and the overall visual read; avoid uniform detail everywhere.":""),
      (framing?"COMPOSITION & SPATIAL DESIGN: "+framing+". Build a deliberate hierarchy of foreground, subject, supporting elements and negative space. Maintain clear silhouette separation, purposeful framing and consistent spatial logic.":""),
      (light?"LIGHTING: "+light+". Establish a coherent key-light direction, supporting fill and shadow logic. Let illumination reveal form and material instead of flattening or randomly decorating the scene.":""),
      (palette?"COLOUR & ATMOSPHERE: "+palette+". Use colour as a unified palette and emotional system. Coordinate dominant, supporting and accent colours; control saturation and contrast to protect the focal point.":""),
      (effect?"ATMOSPHERIC / OPTICAL TREATMENT: "+effect+". Integrate these phenomena into the scene's lighting, depth and physical space. Effects should have a clear source and scale, never appear as pasted overlays.":""),
      (render?"CAPTURE & FINAL RENDER: "+render+". Render at high fidelity with controlled detail, clean edges, intentional depth, and no accidental artifacts.":""),
      "ART-DIRECTION PRIORITY: Subject readability and concept first; composition and visual language second; material, surface, lighting, colour and atmosphere serve the concept. Reconcile overlaps, discard redundant wording and resolve incompatible instructions into the strongest unified interpretation.",
      (mode==="smart"?"SMART RESOLUTION: Prefer the most coherent interpretation of the selected modules. Use restrained accents where multiple directions compete; maintain consistent perspective, scale, material physics, light sources, colour logic and detail density.":"EXPERIMENTAL RESOLUTION: Preserve meaningful contrasts and unexpected combinations, but translate them into one deliberate design logic. Creative collision is welcome; incoherent placement, contradictory physics, competing focal points and random decoration are not."),
      "OUTPUT: Produce a single polished image with a confident focal hierarchy, purposeful detail, balanced visual weight, convincing spatial relationships and professional finish. No text, logos, watermarks, borders or additional panels unless explicitly required by the selected creative direction."
    ].filter(Boolean);
    return textParts.join("\\n\\n");
  }
  function render(){const a=mode==="smart"?smartSample():sample();if(!a.length){output.innerHTML='<p class="randomiser-placeholder">Select at least one category to generate a combined prompt.</p>';fullPrompt="";copyBtn.disabled=true;compat.hidden=true;return;}
    fullPrompt=compose(a);const preview=fullPrompt.slice(0,220)+"…";const sources=a.map(x=>'<details class="randomiser-source-prompt"><summary>'+esc(x.prompt.title)+' <small>'+esc(x.cat[1])+'</small></summary><div class="randomiser-source-prompt-text">'+esc(x.prompt.prompt||x.prompt.desc||"")+'</div></details>').join("");
    output.innerHTML='<article class="randomiser-composed"><p class="randomiser-composed-label">ONE COMPLETE COMBINED PROMPT</p><button type="button" class="randomiser-prompt-toggle" aria-expanded="false">Show full combined prompt <span>＋</span></button><p class="randomiser-prompt-preview">'+esc(preview)+'</p><div class="randomiser-composed-text" hidden>'+esc(fullPrompt)+'</div><div class="randomiser-source-details"><button type="button" class="randomiser-ingredients-toggle" aria-expanded="false">View individual ingredient prompts ('+a.length+') <span>＋</span></button><div class="randomiser-source-list" hidden>'+sources+'</div></div></article>';
    const btn=output.querySelector(".randomiser-prompt-toggle"),textBlock=output.querySelector(".randomiser-composed-text");btn.onclick=()=>{const open=btn.getAttribute("aria-expanded")==="true";btn.setAttribute("aria-expanded",String(!open));textBlock.hidden=open;btn.innerHTML=(open?"Show full combined prompt":"Hide full combined prompt")+' <span>'+(open?"＋":"－")+'</span>';};
    const ingredientBtn=output.querySelector(".randomiser-ingredients-toggle"),ingredientList=output.querySelector(".randomiser-source-list");ingredientBtn.onclick=()=>{const open=ingredientBtn.getAttribute("aria-expanded")==="true";ingredientBtn.setAttribute("aria-expanded",String(!open));ingredientList.hidden=open;ingredientBtn.innerHTML=(open?"View individual ingredient prompts":"Hide individual ingredient prompts")+' ('+a.length+') <span>'+(open?"＋":"－")+'</span>';};
    heading.textContent=(mode==="smart"?"Smart":"Experimental")+" mode · "+a.length+" ingredients";copyBtn.disabled=false;compat.hidden=true;compat.innerHTML="";
  }
  document.querySelector("#randomiser-generate").addEventListener("click",render);
  document.querySelectorAll('input[name="randomiser-mode"]').forEach(r=>r.addEventListener("change",()=>{if(r.checked){mode=r.value;heading.textContent=mode==="smart"?"Smart mode selected":"Experimental mode selected";}}));
  document.querySelector("#randomiser-clear").addEventListener("click",()=>{picked.clear();root.querySelectorAll(".randomiser-enabled").forEach(x=>x.checked=false);root.querySelectorAll(".randomiser-quantity").forEach(x=>x.hidden=true);root.querySelectorAll(".randomiser-count").forEach(x=>x.value="1");output.innerHTML='<p class="randomiser-placeholder">Choose categories, then generate one integrated prompt.</p>';heading.textContent="Your prompt mix";fullPrompt="";copyBtn.disabled=true;compat.hidden=true;});
  copyBtn.addEventListener("click",async()=>{if(!fullPrompt)return;try{await navigator.clipboard.writeText(fullPrompt);const toast=document.querySelector("#toast");if(toast){toast.textContent="Copied complete combined prompt";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);}}catch{copyBtn.textContent="Clipboard unavailable";}});
})();