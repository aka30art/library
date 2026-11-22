const { chromium } = require('playwright');
const BASE=process.env.SITE_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const failures=[];
 const check=(ok,label)=>ok?console.log('PASS '+label):failures.push('FAIL '+label);
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',e=>failures.push('Runtime: '+e.message));
 try{
  await page.goto(BASE+'explore.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#category-filter').selectOption('films-shows');
  await page.locator('#show-all').click();
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Explore loads exactly 125 Films & Shows v2 prompts');
  const options=await page.locator('#subcategory-filter option').allTextContents();
  const expected=['TV Shows','Cartoons','Films','Anime','Other Screen Worlds'];
  check(expected.every(x=>options.some(o=>o.includes(x))),'Explore exposes all five Films & Shows subcategories');
  for(const label of expected){
   const option=page.locator('#subcategory-filter option').filter({hasText:label}).first();
   const value=await option.getAttribute('value');
   await page.locator('#subcategory-filter').selectOption(value);
   check(await page.locator('#prompt-grid .prompt-card').count()===25,label+' filter returns exactly 25 prompts');
  }
  await page.locator('#subcategory-filter').selectOption('TV Shows');
  const first=page.locator('#prompt-grid .prompt-card').first();
  const title=(await first.innerText()).trim().split('\n')[0];
  await first.click();
  const detail=await page.locator('#detail-prompt').textContent();
  check(detail.includes('DESTINATION DNA:')&&detail.includes('SOURCE IDENTITY LOCK:')&&detail.includes('QUALITY GATE:'),'Prompt detail displays complete standalone Screenworld transformation structure');
  check(detail.includes(title),'Prompt detail corresponds to the selected TV Shows card');
  await page.locator('#prompt-dialog .dialog-close').click();

  await page.goto(BASE+'builder.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#builder-module-search').fill(title);
  const module=page.locator('#builder-modules input[data-prompt-id]');
  check(await module.count()===1,'Builder finds selected Films & Shows v2 prompt');
  await module.check();
  const output=await page.locator('#builder-output').evaluate(el=>el.dataset.copyText||el.textContent||'');
  check(output.includes('DESTINATION DNA:')&&output.includes('SOURCE IDENTITY LOCK:')&&output.includes(title),'Builder combines the full Screenworld prompt with target identity');

  await page.goto(BASE+'randomiser.html',{waitUntil:'networkidle',timeout:45000});
  const tvRow=page.locator('#randomiser-page .randomiser-category[data-id="films-tv"]');
  check(await tvRow.innerText().then(t=>t.includes('25 available')),'Randomiser registers 25 TV Shows prompts');
  await tvRow.locator('.randomiser-enabled').check();
  await page.locator('#randomiser-generate').click();
  const generated=page.locator('.randomiser-composed-text');
  await page.locator('.randomiser-prompt-toggle').click();
  const combined=await generated.textContent();
  check(combined.includes('SCREEN-WORLD DIRECTION:')&&combined.includes('DESTINATION DNA:'),'Randomiser output incorporates Screenworld transformation directives');
  const sourceDetails=page.locator('.randomiser-source-prompt');
  check(await sourceDetails.count()===1,'Randomiser generated one TV Shows ingredient');
  check((await sourceDetails.first().innerText()).includes(title),'Randomiser source prompt is from the rebuilt catalogue');

  await page.setViewportSize({width:1440,height:900});
  await page.goto(BASE+'explore.html',{waitUntil:'networkidle',timeout:45000});
  await page.locator('#category-filter').selectOption('films-shows');
  await page.locator('#show-all').click();
  check(await page.locator('#prompt-grid .prompt-card').count()===125,'Desktop Explore renders all 125 Screenworld prompts');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  check(!overflow,'Desktop Explore has no horizontal overflow');
 }catch(e){failures.push(e.stack||String(e));}
 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1);}
 console.log('B5-E Films & Shows Explore, Builder, Randomiser browser QA PASS (mobile + desktop)');
})();
