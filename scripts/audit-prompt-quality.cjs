#!/usr/bin/env node
const fs=require("node:fs"),vm=require("node:vm");
const app=fs.readFileSync("app.js","utf8"),errors=[],warnings=[];
const start=app.indexOf("const collections = "),end=app.indexOf(";\nlet prompts",start);
if(start<0||end<0)throw Error("Unable to parse collection definitions");
const collections=vm.runInNewContext(app.slice(start+"const collections = ".length,end+1));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync("catalogue-expansion.js","utf8"),sandbox,{timeout:5000});
const prompts=sandbox.window.AI_PROMPT_EXPANSION||[];
const expectedTotal=1562;
const normalise=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const titleGroups=new Map(),categoryCounts={};
for(const p of prompts){
 categoryCounts[p.category]=(categoryCounts[p.category]||0)+1;
 if(!p.id||!p.title||!p.desc||!p.prompt||!p.negative||!Array.isArray(p.tags)||!p.tags.length||!Array.isArray(p.model)||!p.model.length)errors.push("Incomplete record: "+(p.id||p.title||"unknown"));
 if(!String(p.prompt).includes("[SUBJECT]"))warnings.push("Missing [SUBJECT] variable: "+p.id+" "+p.title);
 const key=p.category+"::"+normalise(p.title);
 if(titleGroups.has(key))errors.push("Repeated title in category: "+p.category+" / "+p.title+" (id="+p.id+")");
 titleGroups.set(key,(titleGroups.get(key)||0)+1);

 if(String(p.prompt).split(/\s+/).filter(Boolean).length<45)warnings.push("Short prompt may lack depth: "+p.id+" "+p.title);
}
if(prompts.length!==expectedTotal)errors.push("Expected "+expectedTotal+" prompts, got "+prompts.length);
const taxStart=app.indexOf("subcategoryTaxonomy="),taxEnd=app.indexOf("\nfunction subcategoryFor",taxStart);
if(taxStart<0||taxEnd<0)throw Error("Unable to parse subcategory taxonomy");
const taxonomySource=app.slice(taxStart+"subcategoryTaxonomy=".length,taxEnd).replace(/;+\s*$/,"");
const taxonomy=vm.runInNewContext("("+taxonomySource+")");
const fnStart=app.indexOf("function subcategoryFor(p){"),fnEnd=app.indexOf("\nfunction updateSubcategoryOptions",fnStart);
if(fnStart<0||fnEnd<0)throw Error("Unable to parse subcategory classifier");
const classifier=vm.runInNewContext(app.slice(fnStart,fnEnd)+";subcategoryFor",{subcategoryTaxonomy:taxonomy,prompts});
const subcategoryCounts={};
for(const p of prompts){const sub=classifier(p);const key=p.category+" / "+sub;subcategoryCounts[key]=(subcategoryCounts[key]||0)+1;}
for(const category of Object.keys(taxonomy)){
 const labels=taxonomy[category].map(x=>x[0]),duplicates=labels.filter((x,i)=>labels.indexOf(x)!==i);
 if(duplicates.length)errors.push("Duplicate subcategory labels in "+category+": "+duplicates.join(", "));
 for(const label of labels)if(!subcategoryCounts[category+" / "+label])errors.push("Empty subcategory: "+category+" / "+label);
}
const intelligenceSource=fs.readFileSync("prompt-intelligence.js","utf8");
function readIntelligenceMap(name,nextName){
 const start=intelligenceSource.indexOf("const "+name+"=");
 const end=intelligenceSource.indexOf("\nconst "+nextName,start);
 if(start<0||end<0)throw Error("Unable to parse Prompt Intelligence map: "+name);
 const expression=intelligenceSource.slice(start+("const "+name+"=").length,end).replace(/;\s*$/,"");
 return vm.runInNewContext("("+expression+")");
}
const intelligenceMaps={
 types:readIntelligenceMap("types","roles"),
 roles:readIntelligenceMap("roles","terms"),
 categories:readIntelligenceMap("categories","conflicts")
};
for(const category of collections)for(const mapName of Object.keys(intelligenceMaps))if(!intelligenceMaps[mapName][category.id])errors.push("Prompt Intelligence "+mapName+" mapping missing collection: "+category.id);
const duplicateStyles=[...titleGroups.entries()].filter(([k,n])=>k.startsWith("styles::")&&n>1);
if(duplicateStyles.length)errors.push("Duplicate style titles remain: "+duplicateStyles.map(x=>x[0].replace("styles::","")).join(", "));
const unclassified=prompts.filter(p=>classifier(p)==="Other");
const unclassifiedByCategory={};
for(const p of unclassified){(unclassifiedByCategory[p.category]??=[]).push(p.title);}
const specialistCategories=["architecture-spaces","sculpture-3d-objects","graphic-design-layout","photography-camera","product-design"];
const templateGroups={};
for(const p of prompts.filter(p=>specialistCategories.includes(p.category))){
 let skeleton=String(p.prompt||"").toLowerCase();
 for(const token of [p.title,p.category,...(p.tags||[])])if(token)skeleton=skeleton.replaceAll(String(token).toLowerCase(),"[module]");
 skeleton=skeleton.replace(/\s+/g," ").trim();
 const key=p.category+"::"+skeleton;
 (templateGroups[key]??=[]).push(p.title);
}
const repeatedTemplates=Object.entries(templateGroups).filter(([,titles])=>titles.length>1);
const promptWordCounts=prompts.map(p=>String(p.prompt||"").trim().split(/\s+/).filter(Boolean).length).sort((a,b)=>a-b);
console.log("PROMPT QUALITY AUDIT — "+prompts.length+" entries / "+collections.length+" collections");
console.log("Category totals: "+Object.entries(categoryCounts).map(([k,v])=>k+"="+v).join(" | "));
console.log("Subcategory distribution: "+Object.entries(subcategoryCounts).map(([k,v])=>k+"="+v).join(" | "));
console.log("Unclassified records: "+unclassified.length);
for(const [category,titles] of Object.entries(unclassifiedByCategory))console.log("UNCLASSIFIED "+category+": "+titles.join(" | "));
if(unclassified.length)errors.push("Unclassified prompts remain: "+unclassified.length);
console.log("Specialist prompt templates: "+repeatedTemplates.length+" repeated skeletons across "+specialistCategories.length+" collections");
for(const [key,titles] of repeatedTemplates)if(titles.length>1)console.log("TEMPLATE REUSE "+key.split("::")[0]+" ("+titles.length+"): "+titles.join(" | "));
console.log("Prompt word counts: min="+(promptWordCounts[0]||0)+" / median="+(promptWordCounts[Math.floor(promptWordCounts.length/2)]||0)+" / max="+(promptWordCounts[promptWordCounts.length-1]||0));
if(warnings.length)console.warn("Warnings ("+warnings.length+"):\n"+warnings.slice(0,100).join("\n")+(warnings.length>100?"\n... truncated":""));
if(errors.length){console.error("ERRORS:\n"+errors.join("\n"));process.exit(1);}
console.log("PASS: no blocking structural errors.");
