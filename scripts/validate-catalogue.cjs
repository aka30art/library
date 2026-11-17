#!/usr/bin/env node
const fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const m=app.match(/const collections = (\[[\s\S]*?\n\]);\nlet prompts =/);
if(!m)throw Error('Cannot parse universal collections');
const collections=vm.runInNewContext(m[1]),sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:5000});
const all=sandbox.window.AI_PROMPT_EXPANSION,expected=['materials','styles','textures','lighting','effects','composition','rendering','colour-atmosphere'],errors=[];
if(collections.length!==8||expected.some((x,i)=>collections[i].id!==x))errors.push('Collection taxonomy mismatch');
if(all.length!==1000)errors.push('Expected 1000 entries, got '+all.length);
const ids=new Set();for(const p of all){if(ids.has(p.id))errors.push('Duplicate ID '+p.id);ids.add(p.id);for(const k of ['title','prompt','negative','tags','model'])if(!p[k])errors.push('Missing '+k+' on '+p.id);if(!expected.includes(p.category))errors.push('Invalid category '+p.category);if(!p.prompt.includes('[SUBJECT]'))errors.push('Missing subject variable '+p.id);if(/yellow-skinned|springfield|new new york|delivery crew|lego|sitcom family/i.test(p.title+' '+p.prompt))errors.push('Legacy subject prompt '+p.id);}
for(const file of ['index.html','explore.html','builder.html']){const h=fs.readFileSync(file,'utf8');for(const x of ['catalogue-expansion.js?v=20261117-universal-library1','app.js?v=20261117-header-fix2','styles.css?v=20261117-universal-library1'])if(!h.includes(x))errors.push(file+' stale asset '+x);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('PASS: 1000 universal elements, eight collections, unique IDs, complete fields, subject variables and synchronized page assets.');
