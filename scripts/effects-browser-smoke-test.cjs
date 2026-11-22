const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const base=process.env.SITE_URL||'http://127.0.0.1:8000/';const b=await chromium.launch({headless:true});try{
 for(const [name,url] of [['Explore','explore.html'],['Builder','builder.html'],['Randomiser','randomiser.html']]){
  const p=await b.newPage({viewport:{width:390,height:844}});await p.goto(new URL(url,base).href);await p.waitForTimeout(900);const body=await p.locator('body').innerText();assert.ok(body.length>300,name+' page renders');
  if(name==='Explore')assert.ok(body.includes('Effects'),'Effects category appears');
  if(name==='Builder')assert.ok(body.includes('Effects transformation')||body.includes('Effects'),'Builder Effects option appears');
  if(name==='Randomiser')assert.ok(body.includes('Random'),'Randomiser page loaded');
  await p.close();
 }console.log('Effects mobile browser smoke PASS');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});