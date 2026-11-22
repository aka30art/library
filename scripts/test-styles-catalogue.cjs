'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const failures=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:15000});
const all=sandbox.window.AI_PROMPT_EXPANSION||[];
const styles=all.filter(item=>item.category==='styles');
const expectedNames='Bauhaus|minimalist brutalism|neo-expressionism|surrealism|photorealism|hyperrealism|anime illustration|manga inkwork|editorial illustration|geometric abstraction|constructivism|Swiss graphic design|Art Deco|mid-century modernism|Japanese contemporary art|naive art|pop art|neo-futurism|organic abstraction|low-poly design|pixel art|woodcut printmaking|risograph aesthetics|cinematic realism|painterly realism|De Stijl|Memphis design|Art Nouveau|Gothic revival|Futurism|Suprematism|Dada collage|Abstract Expressionism|Op art|Precisionism|Ukiyo-e|Sumi-e|Vaporwave|Synthwave|Cyberpunk|Solarpunk|Biopunk|Steampunk|Retrofuturism|Dark fantasy illustration|Conceptual art|Surrealist photomontage|Editorial collage|Gothic graphic design|Japanese minimalism|Wiener Werkstätte|Vienna Secession|Arts and Crafts movement|Rayonism|Orphism|Vorticism|Lyrical abstraction|Hard-edge painting|Color Field painting|Tachisme|Art Brut|CoBrA movement|Neo-Dada|Fluxus|Arte Povera|Land art|Process art|Light and Space|Kinetic art|Psychedelic poster art|Lowbrow art|Pop Surrealism|New Objectivity|Magic realism|Metaphysical painting|Toyism|Excessivism|Unilalianism|Stuckism|Minjung woodcut aesthetic|Chicha poster graphics|Pixação lettering culture|2 Tone ska graphics|Psychedelic Op Art|Fauvist Colour Expression|Synchromism|Synthetism|Symbolist Illustration|Social Documentary Realism|Precisionist surrealism|Neo-Geo abstraction|Pattern and Decoration|Gutai action painting|Mono-ha material minimalism|Systems art|Generative plotter art|Bio-art visualism|Data-moshing aesthetic|Glitch brutalism|Webcore collage|Frutiger Aero revival|Y2K cyber-organic|Mallsoft liminalism|Dreamcore imagery|Weirdcore collage|Kidcore maximalism|Goblin-core naturalism|Cottagecore pastoralism|Hauntology aesthetic|Analog horror design|Found-footage visual language|Cassette futurism|Atompunk illustration|Dieselpunk industrialism|Eco-Industrial Design|Afrofuturist surrealism|Mythpunk illustration|Dungeon synth fantasy art|Neo-Medieval Manuscript Art|Visionary psychedelic art|Art informel|Abstract Calligraphy|Neo-folk ornament|Folk horror visualism|Naive constructivism'.split('|');
const expectedSubcategories=['Art Movements','Graphic Design & Typography','Illustration & Drawing','Photography & Realism','Digital & Generative','Futurism & Speculative','Folk & Traditional','Pop & Subculture','Contemporary & Experimental'];
const sections=[
 'STYLE TRANSFORMATION — TARGET-SPECIFIC VISUAL LANGUAGE','SOURCE IDENTITY LOCK:',
 'STYLE IDENTITY AND INTENT:','FORM GRAMMAR AND SHAPE LANGUAGE:',
 'LINE, MARKMAKING AND EDGE BEHAVIOUR:','COLOUR, VALUE AND SURFACE SYSTEM:',
 'COMPOSITION AND SPATIAL LOGIC:','MEDIUM AND RENDERING METHOD:',
 'SOURCE ADAPTATION:','STYLE BOUNDARIES AND EXCLUSIONS:','FINAL STYLE-AWARE CHECK:'
];
const normalise=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
check(styles.length===125,'Expected exactly 125 Styles records; received '+styles.length+'.');
check(expectedNames.length===125,'Acceptance list must contain 125 original Styles titles.');
check(styles.every((item,index)=>String(item.id)===String(index+201)),'Styles IDs 201–325 must remain unchanged and ordered.');
check(styles.every((item,index)=>normalise(item.title)===normalise(expectedNames[index])),'Original Styles title sequence must remain unchanged.');
const ids=new Set(),titles=new Set(),bodies=new Set(),skeletons=new Set(),subcounts={};
for(const item of styles){
 const name=String(item.title||''),prompt=String(item.prompt||'');
 check(item.id!=null&&!ids.has(String(item.id)),'Missing or duplicate Styles ID '+item.id);ids.add(String(item.id));
 check(name&&!titles.has(normalise(name)),'Missing or duplicate Styles title '+name);titles.add(normalise(name));
 check(expectedSubcategories.includes(item.subcategory),name+': invalid or missing explicit subcategory '+item.subcategory);
 subcounts[item.subcategory]=(subcounts[item.subcategory]||0)+1;
 check(Array.isArray(item.tags)&&item.tags.includes(item.subcategory),name+': explicit subcategory must be present in tags');
 check(item.styleArchitectureVersion==='2.0',name+': missing Styles architecture version marker');
 check(item.difficulty==='Professional',name+': difficulty not promoted to Professional');
 check(sections.every(section=>prompt.includes(section)),name+': missing one or more required Styles v2 sections');
 check(prompt.includes('STYLE TARGET: '+name),name+': target identity is not explicit in prompt');
 check(prompt.includes('[SUBJECT]')&&prompt.includes('[SOURCE IMAGE]'),name+': source input contract missing');
 const wordCount=prompt.trim().split(/\s+/).filter(Boolean).length;
 check(wordCount>=230,name+': target-specific prompt is too short ('+wordCount+' words)');
 check(!bodies.has(normalise(prompt)),name+': duplicate prompt body');bodies.add(normalise(prompt));
 const skeleton=normalise(prompt.split('\n\n').filter(block=>!block.startsWith('STYLE TARGET:')&&!block.startsWith('FINAL STYLE-AWARE CHECK:')).join(' '));
 check(!skeletons.has(skeleton),name+': repeated generic prompt skeleton');skeletons.add(skeleton);
 for(const section of sections.slice(1)){
  const ix=prompt.indexOf(section),next=prompt.indexOf('\n\n',ix);
  const body=prompt.slice(ix+section.length,next<0?undefined:next).trim();
  check(body.length>=45,name+': underdeveloped section '+section);
 }
}
for(const sub of expectedSubcategories)check((subcounts[sub]||0)>=3,'Styles taxonomy has insufficient coverage for '+sub);
const expectedAudit=sandbox.window.AI_PROMPT_STYLES_V2_AUDIT;
check(expectedAudit&&expectedAudit.records===125&&expectedAudit.profiles===125,'Runtime Styles v2 audit missing or incomplete');
check(Object.keys(expectedAudit?.subcategoryCounts||{}).length===expectedSubcategories.length,'Runtime Styles v2 audit does not cover all nine subcategories');
const app=fs.readFileSync('app.js','utf8');
for(const sub of expectedSubcategories)check(app.includes('"'+sub+'"'),'App taxonomy missing '+sub);
const taxStart=app.indexOf("subcategoryTaxonomy="),taxEnd=app.indexOf(";;\nconst subcategoryOverrides=",taxStart);
check(taxStart>=0&&taxEnd>taxStart,'Unable to inspect runtime Styles taxonomy');
if(taxStart>=0&&taxEnd>taxStart){
 const taxonomy=vm.runInNewContext("("+app.slice(taxStart+"subcategoryTaxonomy=".length,taxEnd).replace(/;+\s*$/,"")+")");
 const overrideStart=app.indexOf("const subcategoryOverrides="),overrideEnd=app.indexOf(";\nfunction subcategoryFor",overrideStart);
 check(overrideStart>=0&&overrideEnd>overrideStart,'Unable to inspect runtime Styles overrides');
 if(overrideStart>=0&&overrideEnd>overrideStart){
  const overrides=vm.runInNewContext("("+app.slice(overrideStart+"const subcategoryOverrides=".length,overrideEnd).replace(/;+\s*$/,"")+")");
  const fnStart=app.indexOf("function subcategoryFor(p){"),fnEnd=app.indexOf("\nprompts.forEach",fnStart);
  check(fnStart>=0&&fnEnd>fnStart,'Unable to inspect runtime Styles classifier');
  if(fnStart>=0&&fnEnd>fnStart){
   const classifier=vm.runInNewContext(app.slice(fnStart,fnEnd)+";subcategoryFor",{subcategoryTaxonomy:taxonomy,subcategoryOverrides:overrides,prompts:all});
   for(const item of styles)check(classifier(item)===item.subcategory,item.title+': Explore runtime classifier disagrees with Styles v2 profile taxonomy');
  }
 }
}
if(failures.length){console.error('STYLES CATALOGUE V2 FAILURES ('+failures.length+')\n'+failures.join('\n'));process.exit(1);}
console.log('PASS: 125 Styles records retain IDs 201–325 and original title order.');
console.log('PASS: 125 unique target-specific style profiles; eleven complete architecture sections.');
console.log('PASS: all nine explicit Styles subcategories are assigned and tagged.');
console.log('Styles v2 subcategory distribution: '+Object.entries(subcounts).map(([name,count])=>name+'='+count).join(' | '));
