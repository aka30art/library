'use strict';
const fs = require('node:fs');

const file = 'phase-b1-materials-prototype.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const expectedSubcategories = [
  'Metals & Alloys',
  'Wood & Plant Fibres',
  'Resins & Waxes',
  'Flora & Fungi',
  'Fauna & Animal-derived',
  'Recycled & Circular Materials',
  'Smart & Functional Materials',
  'Organic & Food-Derived Materials',
  'Stone & Minerals',
  'Glass & Ceramics',
  'Textiles & Fabrics',
  'Polymers & Composites',
  'Paper & Cellulose',
  'Liquids & Gels',
  'Construction & Earth'
];

check(data.schemaVersion === 1, 'Prototype schema version must be 1.');
check(data.phase === 'B1' && data.family === 'Materials', 'Prototype must identify Phase B1 Materials.');
check(data.status === 'prototype-only; not wired into the live catalogue', 'Prototype must remain explicitly isolated from the live catalogue.');
check(Array.isArray(data.cases), 'Prototype cases must be an array.');

const cases = Array.isArray(data.cases) ? data.cases : [];
check(cases.length === 20, `Expected 20 representative cases; received ${cases.length}.`);

const titles = new Set();
const normalizedPrompts = new Set();
const subcategories = new Set();

for (const item of cases) {
  const name = item.material || '(unnamed material)';
  check(typeof item.material === 'string' && item.material.trim(), 'Every case needs a material title.');
  check(!titles.has(name), `Duplicate target title: ${name}`);
  titles.add(name);

  check(expectedSubcategories.includes(item.subcategory), `${name}: unknown or unsupported subcategory "${item.subcategory}".`);
  subcategories.add(item.subcategory);

  check(typeof item.sourceSubject === 'string' && item.sourceSubject.length >= 30, `${name}: missing a concrete adversarial source-subject fixture.`);
  for (const key of ['physicalSignature', 'processSignature', 'lightSignature', 'constraints']) {
    check(typeof item[key] === 'string' && item[key].trim().length >= 35, `${name}: missing substantive ${key}.`);
  }

  const prompt = String(item.prompt || '');
  const words = prompt.trim().split(/\\s+/).filter(Boolean);
  check(words.length >= 100, `${name}: prompt is too short (${words.length} words; minimum 100).`);
  check(prompt.includes('[SUBJECT]'), `${name}: missing the [SUBJECT] input variable.`);
  check(prompt.toLowerCase().includes(name.toLowerCase()), `${name}: prompt does not explicitly name its selected material.`);
  check(prompt.includes('SOURCE:') && prompt.includes('MATERIAL TARGET:'), `${name}: missing the standard input header.`);
  check(/preserv(e|ing|ed)/i.test(prompt), `${name}: no explicit source-preservation instruction.`);
  check(/avoid|do not|never/i.test(prompt), `${name}: no explicit material-specific exclusion.`);
  check(/light|reflection|transmission|scattering|highlight|specular/i.test(prompt), `${name}: no optical/light-response instruction.`);

  const normalized = prompt.toLowerCase()
    .replace(name.toLowerCase(), '[target]')
    .replace(/\\s+/g, ' ')
    .trim();
  check(!normalizedPrompts.has(normalized), `${name}: prompt body duplicates another target after masking the target title.`);
  normalizedPrompts.add(normalized);
}

for (const subcategory of expectedSubcategories) {
  check(subcategories.has(subcategory), `No representative case covers subcategory: ${subcategory}.`);
}
check(subcategories.size === 15, `Expected 15 distinct subcategories; found ${subcategories.size}.`);

check(Array.isArray(data.framework?.sourceLock) && data.framework.sourceLock.length >= 3, 'Shared source-lock framework is incomplete.');
check(Array.isArray(data.framework?.materialPhysics) && data.framework.materialPhysics.length >= 5, 'Shared material-physics framework is incomplete.');
check(Array.isArray(data.framework?.executionOrder) && data.framework.executionOrder.length >= 5, 'Shared execution order is incomplete.');

const ferrofluidReview = (data.knownTaxonomyReview || []).find(x => x.material === 'Ferrofluid');
check(!!ferrofluidReview && /Liquids & Gels/.test(ferrofluidReview.recommendedAction || ''), 'Ferrofluid subcategory conflict must be recorded for correction.');

if (failures.length) {
  console.error('FAIL Materials prototype checks');
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}

console.log(`PASS Materials prototype: ${cases.length} differentiated prompts across ${subcategories.size} subcategories; source fixtures, material physics, process, optical response and exclusions present.`);
