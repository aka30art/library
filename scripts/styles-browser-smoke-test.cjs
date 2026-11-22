const { chromium } = require('playwright');
const BASE=process.env.SITE_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const failures=[];
 const check=(ok,label)=>ok?console.log('PASS '+label):failures.push('FAIL '+label);
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',error=>failures.push('Runtime: '+error.message));
 try{
  await page.goto(BASE+'explore.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#category-filter').selectOption('styles');
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Explore displays all 125 Styles records');
  const options=await page.locator('#subcategory-filter option').evaluateAll(els=>els.map(el=>({value:el.value,text:el.textContent})));
  const subcategories=options.filter(option=>option.value!=='all');
  check(subcategories.length===9&&!subcategories.some(option=>option.value==='Other'),'Styles exposes nine explicit subcategories and no Other bucket');
  let observed=0;
  for(const option of subcategories){
   await page.locator('#subcategory-filter').selectOption(option.value);
   const count=await page.locator('#prompt-grid .prompt-card').count();
   check(count>0,option.value+' contains assigned Styles records');
   observed+=count;
  }
  check(observed===125,'All 125 Styles records are reachable through explicit subcategory filters');
  await page.locator('#subcategory-filter').selectOption('Art Movements');
  const bauhaus=page.locator('#prompt-grid .prompt-card').filter({hasText:'Bauhaus'});
  check(await bauhaus.count()===1,'Bauhaus is filed under Art Movements');
  await bauhaus.click();
  const detail=await page.locator('#detail-prompt').textContent();
  for(const heading of ['STYLE TRANSFORMATION — TARGET-SPECIFIC VISUAL LANGUAGE','STYLE IDENTITY AND INTENT:','FORM GRAMMAR AND SHAPE LANGUAGE:','LINE, MARKMAKING AND EDGE BEHAVIOUR:','COLOUR, VALUE AND SURFACE SYSTEM:','COMPOSITION AND SPATIAL LOGIC:','MEDIUM AND RENDERING METHOD:','SOURCE ADAPTATION:','STYLE BOUNDARIES AND EXCLUSIONS:','FINAL STYLE-AWARE CHECK:']){
   check(detail.includes(heading),'Explore detail exposes '+heading);
  }
  await page.locator('#prompt-dialog .dialog-close').click();

  await page.goto(BASE+'builder.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#builder-module-search').fill('Bauhaus');
  const module=page.locator('#builder-modules input[data-prompt-id]');
  check(await module.count()===1,'Builder can find the exact Bauhaus style module');
  await module.check();
  let builderOutput=await page.locator('#builder-output').evaluate(el=>el.dataset.copyText||'');
  check(builderOutput.includes('STYLE TARGET: Bauhaus')&&builderOutput.includes('STYLE IDENTITY AND INTENT:'),'Builder includes the full Styles v2 prompt profile');
  await page.locator('#builder-type').selectOption('transformation');
  await page.locator('#transformation-architecture').selectOption('style-transfer');
  await page.locator('#transformation-target').fill('Apply the Bauhaus target profile to the supplied source.');
  builderOutput=await page.locator('#builder-output').textContent();
  check(builderOutput.includes('VISUAL STYLE TRANSFER PROTOCOL — STYLE DNA DECOMPOSITION'),'Builder activates the refined Style Transfer architecture');
  check(builderOutput.includes('FORM GRAMMAR AND SHAPE LANGUAGE:')&&builderOutput.includes('STYLE BOUNDARIES AND EXCLUSIONS:'),'Builder retains detailed source style constraints');

  await page.goto(BASE+'randomiser.html',{waitUntil:'networkidle',timeout:45000});
  const catalogue=await page.evaluate(()=>window.AI_PROMPT_BUILDER_CATALOGUE||[]);
  const styleRecords=catalogue.filter(item=>item.category==='styles');
  check(styleRecords.length===125,'Randomiser loads all 125 Styles records');
  check(styleRecords.every(item=>item.subcategory&&item.tags.includes(item.subcategory)),'Randomiser receives explicit Styles subcategories');
  check(styleRecords.every(item=>item.prompt.includes('STYLE IDENTITY AND INTENT:')),'Randomiser receives target-specific Styles v2 prompts');
  await page.locator('#randomiser-page .randomiser-category[data-id="styles"] .randomiser-enabled').check();
  await page.locator('#randomiser-generate').click();
  const composed=await page.locator('.randomiser-composed-text').textContent();
  for(const heading of ['STYLE TRANSFORMATION — TARGET-SPECIFIC VISUAL LANGUAGE','SOURCE IDENTITY LOCK:','STYLE IDENTITY AND INTENT:','FORM GRAMMAR AND SHAPE LANGUAGE:','LINE, MARKMAKING AND EDGE BEHAVIOUR:','COLOUR, VALUE AND SURFACE SYSTEM:','COMPOSITION AND SPATIAL LOGIC:','MEDIUM AND RENDERING METHOD:','SOURCE ADAPTATION:','STYLE BOUNDARIES AND EXCLUSIONS:','FINAL STYLE-AWARE CHECK:']){
   check(composed.includes(heading),'Randomiser combined output preserves '+heading);
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(BASE+'explore.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#category-filter').selectOption('styles');
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Desktop Styles collection renders all records');
 }catch(error){failures.push(error.stack||String(error));}
 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1);}
 console.log('Styles v2 Explore, Builder and Randomiser browser QA passed on mobile and desktop');
})();