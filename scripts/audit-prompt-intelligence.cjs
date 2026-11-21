#!/usr/bin/env node
/**
 * Heuristic Prompt Intelligence Audit.
 * Scores prompt-engineering signals; it does NOT claim semantic understanding.
 * Run: node scripts/audit-prompt-intelligence.cjs [--json]
 */
const fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('const collections = '),end=app.indexOf(';\nlet prompts',start);
if(start<0||end<0)throw Error('Unable to parse collections from app.js');
const collections=vm.runInNewContext(app.slice(start+'const collections = '.length,end),{});
const sandbox={window:{}};
vm.runInContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:5000});
const prompts=sandbox.window.AI_PROMPT_EXPANSION||[];
const signals=[
 {key:'actionable_method',label:'Actionable method',weight:20,re:/\b(apply|use|construct|build|render|transform|create|employ|integrate|simulate|compose|derive|model|define)\b/i},
 {key:'specific_visual_controls',label:'Specific visual controls',weight:20,re:/\b(silhouette|geometry|proportion|scale|viewpoint|perspective|composition|surface|texture|material|lighting|contrast|palette|depth|focus|detail|structure|edge|shape|form|spatial|tonal|colour|color)\b/i},
 {key:'constraint_handling',label:'Constraint handling',weight:15,re:/\b(preserve|retain|lock|avoid|exclude|without|do not|must|only|consistent|coherent|intentional|controlled|limit)\b/i},
 {key:'contextual_execution',label:'Contextual execution',weight:15,re:/\b(context|purpose|function|environment|scene|subject|reference|use case|audience|story|narrative|domain|specific|target)\b/i},
 {key:'quality_criteria',label:'Quality criteria',weight:15,re:/\b(quality|professional|resolve|refine|accurate|credible|believable|readable|legible|balanced|clean|precise|finish|cohesive|artifact)\b/i},
 {key:'anti_generic_guidance',label:'Anti-generic guidance',weight:15,re:/\b(generic|arbitrary|random|unrelated|unnecessary|noise|watermark|placeholder|incoherent|artifact|filler)\b/i}
];
const normalize=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const scored=prompts.map(p=>{
 const text=String(p.prompt||'');
 const wordCount=text.split(/\s+/).filter(Boolean).length;
 const dims=signals.map(s=>({key:s.key,label:s.label,score:s.re.test(text)?s.weight:0,max:s.weight}));
 const score=dims.reduce((n,d)=>n+d.score,0);
 const reasons=[];
 if(wordCount<100)reasons.push('short prompt (<100 words)');
 if(!/\[SUBJECT\]/.test(text))reasons.push('missing subject variable');
 if(!dims[0].score)reasons.push('no clear action/method signal');
 if(!dims[1].score)reasons.push('few visual-control signals');
 if(!dims[2].score)reasons.push('constraint guidance signal absent');
 if(!dims[4].score)reasons.push('quality gate signal absent');
 return {id:p.id,title:p.title,category:p.category,subcategory:(p.tags||[]).join(' / '),wordCount,score,dims,reasons};
});
const categorySummary={};
for(const r of scored){const c=categorySummary[r.category]||(categorySummary[r.category]={count:0,total:0,low:0,mid:0,high:0});c.count++;c.total+=r.score;if(r.score<40)c.low++;else if(r.score<70)c.mid++;else c.high++;}
for(const c of Object.values(categorySummary))c.average=Math.round(c.total/c.count);
const flagged=scored.filter(r=>r.score<70).sort((a,b)=>a.score-b.score);
const output={generatedAt:new Date().toISOString(),auditType:'heuristic signals only; manual semantic review required',total:scored.length,scoring:{max:100,signals:signals.map(s=>({key:s.key,label:s.label,weight:s.weight})),bands:{low:'0-39: weak signal coverage; review first',medium:'40-69: review for gaps/redundancy',high:'70-100: strong signal coverage, not a guarantee of quality'}},categorySummary,flaggedCount:flagged.length,flagged:flagged.map(r=>({id:r.id,title:r.title,category:r.category,subcategory:r.subcategory,wordCount:r.wordCount,score:r.score,reasons:r.reasons,dims:r.dims}))};
if(process.argv.includes('--json'))console.log(JSON.stringify(output,null,2));
else{
 console.log('PROMPT INTELLIGENCE AUDIT — heuristic only; manual semantic review required');
 console.log('Records: '+output.total+' | Flagged for review (<70): '+output.flaggedCount);
 console.log('Category summary:');
 for(const [name,c] of Object.entries(categorySummary))console.log('  '+name+': avg '+c.average+'/100 | low '+c.low+' | review '+c.mid+' | strong '+c.high);
 console.log('Lowest-scoring records (first 30):');
 for(const r of flagged.slice(0,30))console.log('  '+r.score+'/100 | '+r.id+' | '+r.category+' | '+r.title+' | '+r.reasons.join('; '));
 console.log('Run with --json for the full record-level diagnostic output.');
}
