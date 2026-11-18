(()=>{
 const root=document.querySelector("#randomiser-categories");if(!root)return;
 const catalogue=window.AI_PROMPT_BUILDER_CATALOGUE||window.AI_PROMPT_CATALOGUE||window.prompts||[];
 const categories=[
 {id:"materials",label:"Materials",cat:["materials"]},
 {id:"styles",label:"Styles",cat:["styles"]},
 {id:"textures",label:"Textures",cat:["textures"]},
 {id:"lighting",label:"Photography Post-Edits",cat:["lighting"]},
 {id:"effects",label:"Effects",cat:["effects"]},
 {id:"composition",label:"Composition",cat:["composition"]},
 {id:"rendering",label:"Rendering",cat:["rendering"]},
 {id:"colour-atmosphere",label:"Colour & Atmosphere",cat:["colour-atmosphere"]},
 {id:"films-shows-tv",label:"Films & Shows — TV Shows",cat:["films-shows"],tag:"TV Shows"},
 {id:"films-shows-cartoon",label:"Films & Shows — Cartoons",cat:["films-shows"],tag:"Cartoons"},
 {id:"films-shows-films",label:"Films & Shows — Films",cat:["films-shows"],tag:"Films"},
 {id:"films-shows-anime",label:"Films & Shows — Anime",cat:["films-shows"],tag:"Anime"},
 {id:"films-shows-other",label:"Films & Shows — Other Screen Worlds",cat:["films-shows"],tag:"Other Screen Worlds"},
 {id:"toys-collectibles",label:"Toys & Collectibles",cat:["toys-collectibles"]}
 ];
 const selected=new Map();let lastPrompt="";
 const available=(c)=>catalogue.filter(p=>c.cat.includes(p.category)&&(!c.tag||(p.tags||[]).includes(c.tag)));
 const esc=s=>String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 root.innerHTML=categories.map(c=>{const n=available(c).length;return '<div class="randomiser-category" data-category="'+c.id+'"><label class="randomiser-category-main"><input type="checkbox" class="randomiser-enabled" '+(selected.has(c.id)?'checked':'')+'><span class="randomiser-category-name">'+c.label+'</span><small>'+n+' available</small></label><label class="randomiser-quantity" '+(selected.has(c.id)?'':'hidden')+'>Prompts <select class="randomiser-count" aria-label="Prompt quantity for '+c.label+'">'+[1,2,3].map(x=>'<option value="'+x+'" '+((selected.get(c.id)||1)===x?'selected':'')+'>'+x+'</option>').join("")+'</select></label></div>'}).join("");
 root.querySelectorAll(".randomiser-category").forEach(row=>{const c=categories.find(x=>x.id===row.dataset.category);const cb=row.querySelector(".randomiser-enabled"),qty=row.querySelector(".randomiser-count"),qWrap=row.querySelector(".randomiser-quantity");cb.addEventListener("change",()=>{if(cb.checked)selected.set(c.id,Number(qty.value));else selected.delete(c.id);qWrap.hidden=!cb.checked;});qty.addEventListener("change",()=>{if(cb.checked)selected.set(c.id,Number(qty.value));});});
 const output=document.querySelector("#randomiser-result"),copy=document.querySelector("#randomiser-copy"),title=document.querySelector("#randomiser-result-title");
 const randomise=()=>{const chosen=[];categories.filter(c=>selected.has(c.id)).forEach(c=>{const pool=available(c).slice();const amount=Math.min(selected.get(c.id)||1,pool.length);for(let i=0;i<amount;i++){const idx=Math.floor(Math.random()*pool.length);chosen.push({category:c.label,prompt:pool.splice(idx,1)[0]});}});if(!chosen.length){output.innerHTML='<p class="randomiser-placeholder">Select at least one category to generate a prompt.</p>';copy.disabled=true;return;}lastPrompt="RANDOMISED VISUAL PROMPT\n\n"+chosen.map((x,i)=>"MODULE "+(i+1)+" — "+x.category+"\n"+x.prompt.title+"\n"+x.prompt.prompt).join("\n\n");title.textContent=chosen.length+" prompts combined";output.innerHTML=chosen.map((x,i)=>'<article class="randomiser-picked"><span class="randomiser-picked-label">'+esc(x.category)+'</span><h3>'+esc(x.prompt.title)+'</h3><p>'+esc(x.prompt.prompt)+'</p></article>').join("");copy.disabled=false;};
 document.querySelector("#randomiser-generate").addEventListener("click",randomise);
 document.querySelector("#randomiser-clear").addEventListener("click",()=>{selected.clear();root.querySelectorAll(".randomiser-enabled").forEach(x=>x.checked=false);root.querySelectorAll(".randomiser-quantity").forEach(x=>x.hidden=true);root.querySelectorAll(".randomiser-count").forEach(x=>x.value="1");output.innerHTML='<p class="randomiser-placeholder">Select categories and generate your combination.</p>';title.textContent="Your prompt mix";copy.disabled=true;lastPrompt="";});
 copy.addEventListener("click",async()=>{if(!lastPrompt)return;try{await navigator.clipboard.writeText(lastPrompt);const toast=document.querySelector("#toast");if(toast){toast.textContent="Copied combined prompt";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);}}catch{copy.textContent="Clipboard unavailable";}});
})();