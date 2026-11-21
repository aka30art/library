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
const titleGroups=new Map(),templateGroups=new Map(),categoryCounts={};
for(const p of prompts){
 categoryCounts[p.category]=(categoryCounts[p.category]||0)+1;
 if(!p.id||!p.title||!p.desc||!p.prompt||!p.negative||!Array.isArray(p.tags)||!p.tags.length||!Array.isArray(p.model)||!p.model.length)errors.push("Incomplete record: "+(p.id||p.title||"unknown"));
 if(!String(p.prompt).includes("[SUBJECT]"))warnings.push("Missing [SUBJECT] variable: "+p.id+" "+p.title);
 const key=p.category+"::"+normalise(p.title);
 if(titleGroups.has(key))errors.push("Repeated title in category: "+p.category+" / "+p.title+" (id="+p.id+")");
 titleGroups.set(key,(titleGroups.get(key)||0)+1);
 const fingerprint=normalise(p.prompt.replace(/\[[^\]]+\]/g,"VAR").replace(/\b(?:source image|subject|target element|module|collection|subcategory)\b/g,"VAR"));
 const fkey=p.category+"::"+fingerprint;
 templateGroups.set(fkey,(templateGroups.get(fkey)||0)+1);
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
 for(const label of labels)if(!subcategoryCounts[category+" / "+label])warnings.push("Empty subcategory: "+category+" / "+label);
}
const duplicateStyles=[...titleGroups.entries()].filter(([k,n])=>k.startsWith("styles::")&&n>1);
if(duplicateStyles.length)errors.push("Duplicate style titles remain: "+duplicateStyles.map(x=>x[0].replace("styles::","")).join(", "));
console.log("PROMPT QUALITY AUDIT — "+prompts.length+" entries / "+collections.length+" collections");
console.log("Category totals: "+Object.entries(categoryCounts).map(([k,v])=>k+"="+v).join(" | "));
const templatesByCategory={};
for(const k of templateGroups.keys()){const c=k.split("::")[0];templatesByCategory[c]=(templatesByCategory[c]||0)+1;}
console.log("Template fingerprint groups per category: "+Object.entries(templatesByCategory).map(([k,v])=>k+"="+v).join(" | "));
console.log("Subcategory counts: "+Object.entries(subcategoryCounts).map(([k,v])=>k+"="+v).join(" | "));
if(warnings.length)console.warn("Warnings ("+warnings.length+"):\n"+warnings.slice(0,80).join("\n")+(warnings.length>80?"\n... truncated":""));
if(errors.length){console.error("ERRORS:\n"+errors.join("\n"));process.exit(1);}
console.log("PASS: no blocking structural errors.");
