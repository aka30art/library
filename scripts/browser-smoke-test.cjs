const { chromium } = require('playwright');
const BASE = process.env.SITE_URL || 'https://aka30art.github.io/library/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const failures=[];
 const check=(ok,label)=>{if(!ok)failures.push(label);else console.log('PASS '+label);};
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write']});
  page.on('pageerror',e=>failures.push('Browser runtime error: '+e.message));
  page.on('console',m=>{if(m.type()==='error')failures.push('Console error: '+m.text());});
  for(const path of ['','explore.html','builder.html']){
   let loaded=false;
   for(let attempt=0;attempt<6&&!loaded;attempt++){
    try{const r=await page.goto(BASE+path,{waitUntil:'networkidle',timeout:30000});loaded=!!r&&r.ok();}catch(e){if(attempt===5)throw e;await page.waitForTimeout(3000);}
   }
   check(loaded,'Loads '+(path||'home'));
   await page.waitForTimeout(300);
   const menu=page.locator('#menu-toggle');
   await menu.click();
   check(await menu.getAttribute('aria-expanded')==='true','Mobile menu opens on '+(path||'home'));
   check(await page.locator('#mobile-menu').evaluate(el=>getComputedStyle(el).display!=='none'),'Mobile menu is visible on '+(path||'home'));
   await menu.click();
   check(await menu.getAttribute('aria-expanded')==='false','Mobile menu closes on '+(path||'home'));
   if(path===''){
    const search=page.locator('#hero-search');
    await search.fill('carbon fibre');
    check(new URL(page.url()).pathname.endsWith('/'),'Home search does not redirect while typing');
    await search.press('Enter');
    await page.waitForURL(/explore\.html\?search=carbon(%20|\+)fibre|explore\.html\?search=carbon%20fibre/);
    check(await page.locator('#archive-search').inputValue()==='carbon fibre','Home search submits query to Explore');
    check(await page.locator('#prompt-grid .prompt-card').count()>0,'Search returns matching prompt cards');
   }else if(path==='explore.html'){
    await page.locator('#archive-search').fill('brushed aluminium');
    check(await page.locator('#prompt-grid .prompt-card').count()>0,'Explore live search returns results');
    await page.locator('#category-filter').selectOption({label:/Materials/});
    check(await page.locator('#prompt-grid .prompt-card').count()>0,'Collection filter returns results');
    check(await page.locator('#subcategory-filter option').count()>1,'Subcollection options populate');
    const first=page.locator('#prompt-grid .prompt-card').first();
    await first.click();
    check(await page.locator('#prompt-dialog').evaluate(el=>el.open),'Prompt detail opens');
    await page.locator('[data-mode="transformation"]').click();
    check((await page.locator('#detail-prompt').innerText()).includes('UNIVERSAL TRANSFORMATION'),'Prompt mode tabs switch content');
    await page.locator('#prompt-dialog form button').click();
   }else{
    const options=page.locator('#builder-modules input[data-prompt-id]');
    check(await options.count()>0,'Builder modules load');
    await options.first().check();
    check((await page.locator('#builder-selection-count').innerText()).includes('1 selected'),'Builder selection updates count');
    check((await page.locator('#builder-output').innerText()).includes('SELECTED VISUAL MODULES'),'Builder composes selected module');
    await page.locator('#builder-clear').click();
    check((await page.locator('#builder-selection-count').innerText()).includes('0 selected'),'Builder clear resets selection');
   }
  }
 }catch(e){failures.push(e.stack||String(e));}
 finally{await browser.close();}
 if(failures.length){console.error('\nSMOKE TEST FAILURES\n'+failures.join('\n'));process.exit(1);}
 console.log('\nAll responsive website smoke tests passed.');
})();
