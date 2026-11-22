const { chromium } = require('playwright');
const BASE = process.env.SITE_URL || 'http://127.0.0.1:8000/';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const failures = [];
  const check = (ok, label) => ok ? console.log('PASS ' + label) : failures.push('FAIL ' + label);
  page.on('pageerror', error => failures.push('Runtime: ' + error.message));
  try {
    await page.goto(BASE + 'explore.html', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('#category-filter').selectOption('materials');
    check(await page.locator('#prompt-grid .prompt-card').count() === 200, 'Materials collection contains 200 records');

    const taxonomy = await page.locator('#subcategory-filter option').allTextContents();
    check(taxonomy.some(x => x.startsWith('Liquids & Gels')) && taxonomy.some(x => x.startsWith('Polymers & Composites')), 'Materials taxonomy includes functional subcategories');

    await page.locator('#subcategory-filter').selectOption('Liquids & Gels');
    check(await page.locator('#prompt-grid .prompt-card').filter({ hasText: 'Ferrofluid' }).count() === 1, 'Ferrofluid is filed under Liquids & Gels');
    await page.locator('#subcategory-filter').selectOption('Metals & Alloys');
    check(await page.locator('#prompt-grid .prompt-card').filter({ hasText: 'Ferrofluid' }).count() === 0, 'Ferrofluid is excluded from Metals & Alloys');
    check(await page.locator('#prompt-grid .prompt-card').filter({ hasText: 'Shape-Memory Alloy Mesh' }).count() === 1, 'Shape-memory alloy remains under Metals & Alloys');

    await page.locator('#subcategory-filter').selectOption('Liquids & Gels');
    await page.locator('#prompt-grid .prompt-card').filter({ hasText: 'Ferrofluid' }).click();
    const ferrofluidText = await page.locator('#detail-prompt').textContent();
    check(ferrofluidText.includes('magnetic nanoparticle suspension') && ferrofluidText.includes('not a bulk metal'), 'Ferrofluid detail exposes liquid-suspension physics');
    await page.locator('#prompt-dialog .dialog-close').click();

    await page.locator('#subcategory-filter').selectOption('Polymers & Composites');
    await page.locator('#prompt-grid .prompt-card').filter({ hasText: 'Aerogel' }).click();
    const aerogelText = await page.locator('#detail-prompt').textContent();
    check(aerogelText.includes('silica aerogel') && aerogelText.includes('polymeric chemistry'), 'Aerogel detail differentiates silica and polymer chemistries');
    await page.locator('#prompt-dialog .dialog-close').click();

    await page.goto(BASE + 'builder.html', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('#builder-module-search').fill('Mycelium Composite');
    const target = page.locator('#builder-modules input[data-prompt-id]');
    check(await target.count() === 1, 'Builder can search the specific Mycelium Composite prompt');
    await target.check();
    const builderOutput = await page.locator('#builder-output').evaluate(element => element.dataset.copyText || '');
    check(builderOutput.includes('MATERIAL TARGET: Mycelium Composite'), 'Builder copies the complete target-specific Materials profile');
    check(/do not convert solid structural members into open lattice/i.test(builderOutput), 'Builder output carries the visual-evaluation constraint');

    await page.goto(BASE + 'randomiser.html', { waitUntil: 'networkidle', timeout: 45000 });
    const catalogue = await page.evaluate(() => window.AI_PROMPT_BUILDER_CATALOGUE || []);
    const materialRecords = catalogue.filter(item => item.category === 'materials');
    check(materialRecords.length === 200, 'Randomiser loads all 200 Materials records');
    check(materialRecords.every(item => item.subcategory && item.prompt.includes('SOURCE IDENTITY LOCK:')), 'Randomiser receives explicit subcategories and target-aware prompts');
    await page.locator('#randomiser-page .randomiser-category[data-id="materials"] .randomiser-enabled').check();
    await page.locator('#randomiser-generate').click();
    const composed = await page.locator('.randomiser-composed-text').textContent();
    check(
      composed.includes('MATERIAL TRANSFORMATION') &&
      composed.includes('SOURCE IDENTITY LOCK:') &&
      composed.includes('BULK STRUCTURE AND MICROSTRUCTURE:') &&
      composed.includes('FORMATION AND MANUFACTURING EVIDENCE:') &&
      composed.includes('MECHANICAL AND ENVIRONMENTAL BEHAVIOUR:') &&
      composed.includes('OPTICAL RESPONSE:') &&
      composed.includes('MATERIAL BOUNDARIES AND EXCLUSIONS:') &&
      composed.includes('FINAL SOURCE-AWARE CHECK:'),
      'Randomiser preserves all core Materials profile sections in combined output'
    );
  } catch (error) {
    failures.push(error.stack || String(error));
  }
  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log('Materials-specific Builder, Explore and Randomiser browser QA passed');
})();