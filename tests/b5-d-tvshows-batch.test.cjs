const fs=require('fs');
const data=JSON.parse(fs.readFileSync('screenworld-tvshows-v2.json','utf8'));
const assert=require('assert');
assert.equal(data.length,25,'TV Shows batch must contain exactly 25 entries');
assert.equal(new Set(data.map(x=>x.id)).size,25,'IDs must be unique');
assert.equal(new Set(data.map(x=>x.title)).size,25,'Titles must be unique');
assert.equal(new Set(data.map(x=>x.prompt)).size,25,'Prompt bodies must be unique');
for(const p of data){
 assert.equal(p.category,'films-shows',p.title+' category');
 assert.equal(p.subcategory,'TV Shows',p.title+' subcategory');
 assert(p.prompt.includes('DESTINATION WORLD: '+p.title),p.title+' destination world missing');
 for(const section of ['SOURCE ANALYSIS & IDENTITY LOCK','TV-WORLD TRANSFORMATION','FULL SCENE RECONSTRUCTION','CAMERA & COMPOSITION','QUALITY CONTROL']) assert(p.prompt.includes(section),p.title+' missing '+section);
 assert(p.prompt.split(/\\s+/).length>=190,p.title+' prompt too short');
}
console.log('B5-D TV Shows batch validation: 25/25 PASS');
