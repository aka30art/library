#!/usr/bin/env node
const fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8'),errors=[];
const m=app.match(/const collections = (\[[\s\S]*?\n\]);\nlet prompts =/);
if(!m)throw Error('Cannot parse universal collections');
const collections=vm.runInNewContext(m[1]),sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:5000});
const all=sandbox.window.AI_PROMPT_EXPANSION;
const expected=['materials','styles','textures','lighting','effects','composition','rendering','colour-atmosphere'];
if(collections.length!==8||expected.some((x,i)=>collections[i]?.id!==x))errors.push('Collection taxonomy mismatch');
if(all.length!==1000)errors.push('Expected 1000 entries, got '+all.length);
const ids=new Set(),counts=Object.fromEntries(expected.map(x=>[x,0]));
for(const p of all){
 if(ids.has(p.id))errors.push('Duplicate ID '+p.id);ids.add(p.id);
 for(const k of ['title','desc','prompt','negative','tags','model'])if(!p[k]||(Array.isArray(p[k])&&!p[k].length))errors.push('Missing '+k+' on '+p.id);
 if(!expected.includes(p.category))errors.push('Invalid category '+p.category);else counts[p.category]++;
 if(!p.prompt.includes('[SUBJECT]'))errors.push('Missing subject variable '+p.id);
 if(/yellow-skinned|springfield|new new york|delivery crew|lego|sitcom family|suburban sitcom/i.test(p.title+' '+p.prompt))errors.push('Legacy subject prompt '+p.id);
}
for(const c of expected)if(counts[c]!==125)errors.push(c+' expected 125 entries, got '+counts[c]);
if(app.includes('subcategory-filter')||app.includes('populateSubcategoryFilter'))errors.push('Obsolete subcollection filter logic remains');
if(!app.includes('const builder=$("#builder-type")'))errors.push('Builder initialisation guard missing');
for(const file of ['index.html','explore.html','builder.html']){
 const h=fs.readFileSync(file,'utf8');
 for(const x of ['catalogue-expansion.js?v=20261117-full-site-qa1','app.js?v=20261117-full-site-qa1','styles.css?v=20261117-full-site-qa1'])if(!h.includes(x))errors.push(file+' stale asset '+x);
 for(const id of ['focus-search','menu-toggle','mobile-menu','toast','prompt-dialog'])if(!h.includes('id="'+id+'"'))errors.push(file+' missing '+id);
 if(h.includes('id="dna-builder"'))errors.push(file+' retains legacy hidden builder');
 if(h.includes('id="subcategory-filter"'))errors.push(file+' retains obsolete subcategory dropdown');
 if(file!=='builder.html'&&(!h.includes('id="hero-search-form"')||!h.includes('id="hero-search"')||!h.includes('id="archive-search"')))errors.push(file+' search wiring missing');
 if(file==='builder.html')for(const id of ['builder-type','builder-source','builder-modules','builder-output','builder-clear','copy-builder'])if(!h.includes('id="'+id+'"'))errors.push('builder.html missing '+id);
 const idsInHtml=[...h.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 for(const id of new Set(idsInHtml))if(idsInHtml.filter(x=>x===id).length>1)errors.push(file+' duplicate id '+id);
}
const explore=fs.readFileSync('explore.html','utf8');
if(explore.includes('Twenty specialist libraries')||explore.includes('fifty curated prompts'))errors.push('Stale collection-count copy');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('PASS: 1,000 universal components; 8 collections × 125 each; unique IDs; complete data; subject variables; no legacy subject prompts or subcategory filter; all three pages wired.');
