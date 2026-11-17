#!/usr/bin/env node
const fs=require('node:fs'),vm=require('node:vm'),errors=[],app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('const collections = '),end=app.indexOf(';\nlet prompts =',start);
if(start<0||end<0)throw Error('Cannot parse collections');
const collections=vm.runInNewContext(app.slice(start+'const collections = '.length,end+1));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:5000});
const all=sandbox.window.AI_PROMPT_EXPANSION;
const expected=['materials','styles','textures','lighting','effects','composition','rendering','colour-atmosphere','films-shows','toys-collectibles'];
if(collections.length!==10||expected.some((x,i)=>collections[i]?.id!==x))errors.push('Collection taxonomy mismatch');
if(all.length!==1150)errors.push('Expected 1150 entries, got '+all.length);
const ids=new Set(),counts=Object.fromEntries(expected.map(x=>[x,0]));
for(const p of all){
 if(ids.has(p.id))errors.push('Duplicate ID '+p.id);
 ids.add(p.id);
 for(const k of ['title','desc','prompt','negative','tags','model'])if(p[k]==null||(Array.isArray(p[k])&&!p[k].length))errors.push('Missing '+k+' on '+p.id);
 if(!expected.includes(p.category))errors.push('Unexpected category '+p.category);else counts[p.category]++;
 if(!p.prompt.includes('[SUBJECT]'))errors.push('Missing [SUBJECT] '+p.id);
 if(/yellow-skinned|springfield|new new york|delivery crew|sitcom family|suburban sitcom/i.test(p.title+' '+p.prompt))errors.push('Legacy subject prompt '+p.id);
}
for(const category of expected.slice(0,9))if(counts[category]!==125)errors.push(category+' expected 125 entries, got '+counts[category]);
if(counts['toys-collectibles']!==25)errors.push('toys-collectibles expected 25 entries, got '+counts['toys-collectibles']);
const screen=all.filter(p=>p.category==='films-shows');
for(const sub of ['TV Shows','Cartoons','Films','Anime','Other Screen Worlds']){
 const n=screen.filter(p=>(p.tags||[]).includes(sub)).length;
 if(n!==25)errors.push(sub+' expected top 25, got '+n);
}

if(!app.includes('const builder=$("#builder-type")'))errors.push('Builder guard missing');
for(const page of ['index.html','explore.html','builder.html']){
 const html=fs.readFileSync(page,'utf8');
 for(const asset of ['catalogue-expansion.js?v=20261117-utp-v1','app.js?v=20261117-utp-v1','styles.css?v=20261117-utp-v1'])if(!html.includes(asset))errors.push(page+' stale '+asset);
 for(const id of ['focus-search','menu-toggle','mobile-menu','prompt-dialog','dialog-content','toast'])if(!html.includes('id="'+id+'"'))errors.push(page+' missing '+id);
 if(html.includes('id="dna-builder"'))errors.push(page+' legacy UI');
 if(page==='explore.html'&&!html.includes('id="subcategory-filter"'))errors.push('Explore Films & Shows filter missing');
 if(page!=='explore.html'&&html.includes('id="subcategory-filter"'))errors.push(page+' should not contain the Explore-only subcategory filter');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 for(const id of new Set(ids))if(ids.filter(x=>x===id).length>1)errors.push(page+' duplicate id '+id);
 if(page!=='builder.html'&&(!html.includes('id="hero-search-form"')||!html.includes('id="hero-search"')||!html.includes('id="archive-search"')))errors.push(page+' search markup missing');
 if(page==='builder.html')for(const id of ['builder-type','builder-source','builder-modules','builder-output','builder-clear','copy-builder'])if(!html.includes('id="'+id+'"'))errors.push('builder missing '+id);
}
const transformation=fs.readFileSync('transformation-system.js','utf8');
for(const term of ['material','surface','texture','style-transfer','hybrid'])if(!transformation.includes(term))errors.push('Missing UTP architecture '+term);
if(!fs.readFileSync('builder.html','utf8').includes('transformation-system.js?v=20261117-utp-v1'))errors.push('Builder transformation system not loaded');
if(fs.readFileSync('explore.html','utf8').includes('Eight universal collections, each containing 125'))errors.push('Stale collection count text');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('PASS: 1,150 prompts, ten collections, five Films & Shows subcategories ×25, 25 collectible formats, unique IDs, subject variables, specialist UTP architectures and page wiring.');
