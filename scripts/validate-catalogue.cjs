#!/usr/bin/env node
const fs=require('node:fs'),vm=require('node:vm'),errors=[],app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('const collections = '),end=app.indexOf(';\nlet prompts =',start);
if(start<0||end<0)throw Error('Cannot parse collections');
const collections=vm.runInNewContext(app.slice(start+'const collections = '.length,end+1));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:5000});
const all=sandbox.window.AI_PROMPT_EXPANSION;
const expected=['materials','styles','textures','lighting','effects','composition','rendering','colour-atmosphere','films-shows','toys-collectibles','architecture-spaces','sculpture-3d-objects','graphic-design-layout','photography-camera','product-design'];
if(collections.length!==15||expected.some((x,i)=>collections[i]?.id!==x))errors.push('Collection taxonomy mismatch');
if(all.length!==1521)errors.push('Expected 1521 entries after TCG consolidation, got '+all.length);
const ids=new Set(),counts=Object.fromEntries(expected.map(x=>[x,0]));
for(const p of all){
 if(ids.has(p.id))errors.push('Duplicate ID '+p.id);
 ids.add(p.id);
 for(const k of ['title','desc','prompt','negative','tags','model'])if(p[k]==null||(Array.isArray(p[k])&&!p[k].length))errors.push('Missing '+k+' on '+p.id);
 if(!expected.includes(p.category))errors.push('Unexpected category '+p.category);else counts[p.category]++;
 if(!p.prompt.includes('[SUBJECT]'))errors.push('Missing [SUBJECT] '+p.id);
 if(/yellow-skinned|springfield|new new york|delivery crew|sitcom family|suburban sitcom/i.test(p.title+' '+p.prompt))errors.push('Legacy subject prompt '+p.id);
}
for(const category of expected.slice(0,8)){const target=({materials:200,styles:125,textures:125,lighting:75,effects:125,composition:75,rendering:75,'colour-atmosphere':75})[category];if(counts[category]!==target)errors.push(category+' expected '+target+' entries, got '+counts[category]);}
if(counts['films-shows']!==350)errors.push('films-shows expected 350 entries, got '+counts['films-shows']);
if(counts['toys-collectibles']!==46)errors.push('toys-collectibles expected 46 entries after consolidation, got '+counts['toys-collectibles']);
for(const category of expected.slice(10)){if(counts[category]!==50)errors.push(category+' expected 50 entries, got '+counts[category]);}
const screen=all.filter(p=>p.category==='films-shows');
for(const p of screen){
 for(const term of ['SUBJECT RE-CREATION','WORLD AND ENVIRONMENT TRANSFORMATION','UNIFIED ART DIRECTION','SCENE CONTROL'])if(!p.prompt.includes(term))errors.push('Incomplete screen-universe transformation prompt '+p.id+' missing '+term);
}
for(const sub of ['TV Shows','Cartoons','Films','Anime','Other Screen Worlds']){
 const n=screen.filter(p=>(p.tags||[]).includes(sub)).length;
 if(n!==70)errors.push(sub+' expected 70, got '+n);
}

if(!app.includes('const builder=$("#builder-type")'))errors.push('Builder guard missing');
for(const page of ['index.html','explore.html','builder.html']){
 const html=fs.readFileSync(page,'utf8');
 const assetNames=['catalogue-expansion.js','app.js','styles.css'];for(const asset of assetNames){const re=new RegExp('<script[^>]+src="'+asset+'\\?v=[^"]+"|<link[^>]+href="'+asset+'\\?v=[^"]+"');if(!re.test(html))errors.push(page+' missing or unversioned '+asset);}
 for(const id of ['focus-search','menu-toggle','mobile-menu','prompt-dialog','dialog-content','toast'])if(!html.includes('id="'+id+'"'))errors.push(page+' missing '+id);
 if(html.includes('id="dna-builder"'))errors.push(page+' legacy UI');
 if(page==='explore.html'&&(!html.includes('id="subcategory-filter"')||!html.includes('Filter by subcategory')))errors.push('Explore category subcategory filter missing');
 if(page!=='explore.html'&&html.includes('id="subcategory-filter"'))errors.push(page+' should not contain the Explore-only subcategory filter');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 for(const id of new Set(ids))if(ids.filter(x=>x===id).length>1)errors.push(page+' duplicate id '+id);
 if(page!=='builder.html'&&(!html.includes('id="hero-search-form"')||!html.includes('id="hero-search"')||!html.includes('id="archive-search"')))errors.push(page+' search markup missing');
 if(page==='builder.html')for(const id of ['builder-type','builder-source','builder-modules','builder-output','builder-clear','copy-builder'])if(!html.includes('id="'+id+'"'))errors.push('builder missing '+id);
}
const randomiserHtml=fs.readFileSync('randomiser.html','utf8'),randomiserJs=fs.readFileSync('randomiser.js','utf8'),randomiserCss=fs.readFileSync('prompt-intelligence.css','utf8');
for(const id of ['randomiser-mode-smart','randomiser-mode-experimental','randomiser-generate','randomiser-copy'])if(!randomiserHtml.includes('id="'+id+'"'))errors.push('Randomiser missing '+id);
for(const token of ['randomiser-prompt-toggle','randomiser-ingredients-toggle','randomiser-source-list','randomiser-composed-text'])if(!randomiserJs.includes(token))errors.push('Randomiser missing collapse control '+token);
if(!randomiserJs.includes('randomiser-source-list" hidden')||!randomiserJs.includes('randomiser-composed-text" hidden'))errors.push('Randomiser collapsed-by-default state missing');
if(!randomiserCss.includes('#randomiser-page .randomiser-mode-option'))errors.push('Randomiser mobile mode visibility styles missing');
if(randomiserCss.includes('.randomiser-source-details:not([open]) .randomiser-source-list'))errors.push('Randomiser ingredient accordion uses obsolete details[open] CSS');
if(!randomiserCss.includes('.randomiser-source-list:not([hidden])'))errors.push('Randomiser ingredient accordion open state CSS missing');
if(!randomiserHtml.includes('randomiser-v9'))errors.push('Randomiser cache version is stale');

const transformation=fs.readFileSync('transformation-system.js','utf8');
for(const term of ['material','surface','texture','style-transfer','hybrid'])if(!transformation.includes(term))errors.push('Missing UTP architecture '+term);
if(!fs.readFileSync('builder.html','utf8').includes('transformation-system.js?v=20261118-tcg-single-subcategory-v1'))errors.push('Builder transformation system not loaded');
if(fs.readFileSync('explore.html','utf8').includes('Eight universal collections, each containing 125'))errors.push('Stale collection count text');
const specialistTaxonomy={
 'architecture-spaces':['Urban Architecture','Residential Architecture','Interior Architecture','Civic & Institutional','Sacred & Contemplative'],
 'sculpture-3d-objects':['Monolithic Form','Assembled Sculpture','Kinetic Sculpture','Biomorphic Sculpture','Public Monument'],
 'graphic-design-layout':['Editorial Systems','Poster Composition','Typographic Experiment','Brand Applications','Print & Production'],
 'photography-camera':['Lens & Perspective','Exposure & Capture','Photographic Genres','Camera Movement','Focus & Depth'],
 'product-design':['Industrial Objects','Consumer Electronics','Furniture & Lighting','Packaging & Containers','Concept Products']
};
if(!app.includes('const exact=(p.tags||[])'))errors.push('Exact-tag subcategory routing missing');
for(const [category,subs] of Object.entries(specialistTaxonomy)){
 if(!app.includes('"'+category+'":'))errors.push('Missing subcategory taxonomy '+category);
 for(const sub of subs){
  const n=all.filter(p=>p.category===category&&(p.tags||[]).includes(sub)).length;
  if(n!==10)errors.push(category+'/'+sub+' expected 10 prompts, got '+n);
 }
}

const requiredTcgParents=["Pokémon Trading Card Game Card","One Piece Card Game Card","Yu-Gi-Oh! Trading Card","Magic: The Gathering Card","Disney Lorcana Trading Card","Sports Trading Card","Universal TCG Card Design"];
for(const title of requiredTcgParents)if(!all.some(p=>p.category==="toys-collectibles"&&p.title===title))errors.push('Missing TCG parent prompt '+title);
if(!app.includes('function promptOptionsFor(p)')||!app.includes('data-prompt-option'))errors.push('Configurable per-prompt option controls missing');
if(!app.includes('Holographic foil')||!app.includes('One-of-One / 1-of-1'))errors.push('TCG finish or serialisation options missing');
for(const label of ['Natural Resins & Waxes','Trading Cards & TCG','Miniatures, Vehicles & Statues','Soft, Handmade & Traditional Toys','Games, Puzzles & Interactive Toys'])if(!app.includes(label))errors.push('Missing refined taxonomy group '+label);

if(errors.length){console.error(errors.join('\\n'));process.exit(1);}
console.log('PASS: 1,521 prompts, fifteen collections, consolidated TCG brand prompts with configurable variants, category-specific subcategory filters, five Films & Shows subcategories ×70, unique IDs, subject variables, specialist UTP architectures and page wiring.');
