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
  await page.locator('#category-filter').selectOption('textures');
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Explore displays all 125 Texture records');
  const options=await page.locator('#subcategory-filter option').evaluateAll(els=>els.map(el=>({value:el.value,text:el.textContent})));
  const groups=options.filter(option=>option.value!=='all');
  check(groups.length===11&&!groups.some(option=>option.value==='Other'),'Textures exposes eleven explicit subcategories and no Other bucket');
  let total=0;
  for(const option of groups){
   await page.locator('#subcategory-filter').selectOption(option.value);
   const count=await page.locator('#prompt-grid .prompt-card').count();
   check(count>0,option.value+' contains Texture records');
   total+=count;
  }
  check(total===125,'All 125 Texture records are reachable through subcategory filters');
  await page.locator('#subcategory-filter').selectOption('Print, Media & Optical');
  const grain=page.locator('#prompt-grid .prompt-card').filter({hasText:'Fine Film Grain'});
  check(await grain.count()===1,'Fine Film Grain is routed to Print, Media & Optical');
  await grain.click();
  const detail=await page.locator('#detail-prompt').textContent();
  for(const heading of ['TEXTURE TRANSFORMATION — TARGET-SPECIFIC SURFACE SYSTEM','SOURCE IDENTITY & GEOMETRY LOCK:','TEXTURE IDENTITY & FORMATION:','MICROSTRUCTURE & SCALE:','TOPOGRAPHY, DIRECTION & DISTRIBUTION:','TACTILE / MECHANICAL CHARACTER:','LIGHT & OPTICAL RESPONSE:','SOURCE INTEGRATION & COVERAGE:','BOUNDARIES & EXCLUSIONS:','FINAL TEXTURE-AWARE CHECK:']){
   check(detail.includes(heading),'Explore detail exposes '+heading);
  }
  await page.locator('#prompt-dialog .dialog-close').click();

  await page.goto(BASE+'builder.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#builder-module-search').fill('Fine Film Grain');
  const module=page.locator('#builder-modules input[data-prompt-id]');
  check(await module.count()===1,'Builder finds the Fine Film Grain module');
  await module.check();
  const builderCopy=await page.locator('#builder-output').evaluate(el=>el.dataset.copyText||'');
  check(builderCopy.includes('TEXTURE TARGET: Fine Film Grain')&&builderCopy.includes('TEXTURE IDENTITY & FORMATION:'),'Builder includes the complete Textures v2 profile');
  await page.locator('#builder-type').selectOption('transformation');
  await page.locator('#transformation-architecture').selectOption('texture');
  await page.locator('#transformation-target').fill('Apply the Fine Film Grain target profile to the supplied source.');
  const protocol=await page.locator('#builder-output').textContent();
  check(protocol.includes('TEXTURE TRANSFORMATION PROTOCOL — TARGET-SPECIFIC SURFACE SYSTEM'),'Builder activates the refined texture protocol');
  check(protocol.includes('SCALE, DISTRIBUTION & MATERIAL BOUNDARIES:'),'Builder retains texture scale and substrate constraints');

  await page.goto(BASE+'randomiser.html',{waitUntil:'networkidle',timeout:45000});
  const loaded=await page.evaluate(()=>window.AI_PROMPT_BUILDER_CATALOGUE||[]);
  const textureRecords=loaded.filter(item=>item.category==='textures');
  check(textureRecords.length===125,'Randomiser loads all 125 enriched Texture records');
  check(textureRecords.every(item=>item.subcategory&&item.tags.includes(item.subcategory)),'Randomiser receives explicit Texture taxonomy');
  check(textureRecords.every(item=>item.prompt.includes('TEXTURE IDENTITY & FORMATION:')),'Randomiser receives Textures v2 profiles');
  await page.locator('#randomiser-page .randomiser-category[data-id="textures"] .randomiser-enabled').check();
  await page.locator('#randomiser-generate').click();
  const composed=await page.locator('.randomiser-composed-text').textContent();
  for(const heading of ['TEXTURE TRANSFORMATION — TARGET-SPECIFIC SURFACE SYSTEM','SOURCE IDENTITY & GEOMETRY LOCK:','TEXTURE IDENTITY & FORMATION:','MICROSTRUCTURE & SCALE:','TOPOGRAPHY, DIRECTION & DISTRIBUTION:','TACTILE / MECHANICAL CHARACTER:','LIGHT & OPTICAL RESPONSE:','SOURCE INTEGRATION & COVERAGE:','BOUNDARIES & EXCLUSIONS:','FINAL TEXTURE-AWARE CHECK:']){
   check(composed.includes(heading),'Randomiser preserves '+heading);
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto(BASE+'explore.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#category-filter').selectOption('textures');
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Desktop Explore renders all Texture records');
 }catch(error){failures.push(error.stack||String(error));}
 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1);}
 console.log('Textures v2 Explore, Builder and Randomiser browser QA passed on mobile and desktop');
})();