const assert=require("node:assert/strict");
const {ScreenworldEngine:E}=require("../screenworld-engine.js");
const sourceTypes=["human","animal","object","collectible","vehicle","architecture"];
const destinations=["The Simpsons","Arcane","Blade Runner 2049","Naruto","Stop-Motion Miniature"];
let checks=0;
for(const sourceType of sourceTypes)for(const target of destinations){
const p=E.compile({sourceType,target,subject:"QA sample source"});
assert.ok(p.length>600);
assert.ok(p.includes(E.sources[sourceType]));
assert.ok(p.includes(E.worlds[target].dna));
assert.ok(p.includes(E.worlds[target].production));
for(const gate of ["WORLD BUILD","FINAL CHECK","FAILURE PREVENTION","CONTINUITY"])assert.ok(p.includes(gate));
checks++;
}
assert.ok(E.compile({sourceType:"human",target:"Arcane",subject:"portrait"}).includes("painterly hybrid 2D/3D"));
assert.throws(()=>E.compile({sourceType:"human",target:"Unknown World"}),/Unknown or missing destination/);
console.log("PASS: "+checks+" source/destination combinations; assertions and invalid destination rejection.");
