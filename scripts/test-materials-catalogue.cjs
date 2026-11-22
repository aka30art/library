'use strict';
const fs = require('node:fs');
const vm = require('node:vm');

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js', 'utf8'), sandbox, { timeout: 10000 });
const all = sandbox.window.AI_PROMPT_EXPANSION || [];
const materials = all.filter(item => item.category === 'materials');
const requiredSubcategories = [
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

check(materials.length === 200, 'Expected exactly 200 Materials records; received ' + materials.length + '.');
const ids = new Set();
const titles = new Set();
const bodies = new Set();
const categoryCounts = new Map();

for (const item of materials) {
  const title = String(item.title || '');
  const prompt = String(item.prompt || '');
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  check(item.id != null && !ids.has(String(item.id)), 'Missing or duplicate Materials ID: ' + item.id);
  ids.add(String(item.id));
  check(title && !titles.has(title.toLowerCase()), 'Missing or duplicate Materials title: ' + title);
  titles.add(title.toLowerCase());

  check(requiredSubcategories.includes(item.subcategory), title + ': missing or invalid explicit subcategory (' + item.subcategory + ').');
  categoryCounts.set(item.subcategory, (categoryCounts.get(item.subcategory) || 0) + 1);
  check(Array.isArray(item.tags) && item.tags.includes(item.subcategory), title + ': subcategory must also be present in tags.');
  check(typeof item.desc === 'string' && item.desc.length >= 70, title + ': material-specific description is too short.');
  check(prompt.includes('[SUBJECT]'), title + ': missing [SUBJECT] contract.');
  check(prompt.includes('MATERIAL TARGET: ' + title), title + ': target heading does not match record title.');
  for (const section of [
    'SOURCE IDENTITY LOCK:',
    'MATERIAL IDENTITY:',
    'BULK STRUCTURE AND MICROSTRUCTURE:',
    'FORMATION AND MANUFACTURING EVIDENCE:',
    'MECHANICAL AND ENVIRONMENTAL BEHAVIOUR:',
    'OPTICAL RESPONSE:',
    'MATERIAL BOUNDARIES AND EXCLUSIONS:',
    'FINAL SOURCE-AWARE CHECK:'
  ]) check(prompt.includes(section), title + ': missing prompt architecture section ' + section);
  check(words.length >= 145, title + ': insufficient prompt depth (' + words.length + ' words).');
  check(item.kind === 'material' && item.difficulty === 'Professional', title + ': material metadata is not configured.');
  check(/subject substitution|silhouette|material physics|unrelated props/i.test(item.negative || ''), title + ': negative constraints are not material-aware.');

  const body = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
  check(!bodies.has(body), title + ': duplicate prompt body.');
  bodies.add(body);
}
for (const name of requiredSubcategories) {
  check(categoryCounts.has(name), 'No Materials records cover subcategory ' + name + '.');
}

const get = title => materials.find(item => item.title.toLowerCase() === title.toLowerCase());
const ferrofluid = get('Ferrofluid');
check(ferrofluid?.subcategory === 'Liquids & Gels', 'Ferrofluid must be classified as Liquids & Gels.');
check(/nanoparticle suspension/i.test(ferrofluid?.prompt || '') && /not a bulk metal/i.test(ferrofluid?.prompt || ''), 'Ferrofluid profile must distinguish fluid suspension from solid metal.');

const aerogel = get('Aerogel');
check(aerogel?.subcategory === 'Polymers & Composites', 'Aerogel must have a stable default catalogue subcategory.');
check(/silica aerogel/i.test(aerogel?.prompt || '') && /polymeric chemistry/i.test(aerogel?.prompt || ''), 'Aerogel must specify its default chemistry and acknowledge variants.');

const mycelium = get('Mycelium Composite');
check(/open lattice/i.test(mycelium?.prompt || '') && /surface skin|surface skin/i.test(mycelium?.prompt || ''), 'Mycelium composite must preserve dense moulded skins and forbid open-lattice conversion.');
check(/vents|functional openings/i.test(mycelium?.prompt || ''), 'Mycelium composite must protect functional openings.');

const shapeMemory = get('Shape-Memory Alloy Mesh');
check(shapeMemory?.subcategory === 'Metals & Alloys', 'Shape-memory alloy mesh must remain in Metals & Alloys.');
check(/programmed geometry|trained geometry/i.test(shapeMemory?.prompt || '') && /stable recovered state/i.test(shapeMemory?.prompt || ''), 'Shape-memory alloy must specify programmed recovery behaviour.');

const nitinol = get('Nitinol Wire Fabric');
check(nitinol?.subcategory === 'Metals & Alloys', 'Nitinol wire fabric must be classified by its metallic material identity.');
check(/nickel-titanium/i.test(nitinol?.prompt || '') && /metal textile/i.test(nitinol?.prompt || ''), 'Nitinol profile must distinguish metal wire fabric from ordinary cloth.');

const thermochromic = get('Thermochromic Pigment');
check(/thermal activation|thermal conduction/i.test(thermochromic?.prompt || '') && /highlight direction remain unchanged/i.test(thermochromic?.prompt || ''), 'Thermochromic profile must separate thermal colour change from lighting.');

const nacre = get('Nacre');
check(/aragonite platelets/i.test(nacre?.prompt || '') && /angle-dependent structural iridescence/i.test(nacre?.prompt || ''), 'Nacre profile must encode layered structure and angle-dependent colour.');

const carbon = get('Carbon Fibre');
check(carbon?.subcategory === 'Polymers & Composites', 'Carbon fibre must be classified as a resin-matrix composite.');
check(/continuous carbon filaments/i.test(carbon?.prompt || '') && /load paths/i.test(carbon?.prompt || ''), 'Carbon fibre profile must encode reinforcement direction and lay-up.');

const textiles = get('Waxed Canvas');
check(textiles?.subcategory === 'Textiles & Fabrics', 'Waxed canvas must be treated as a coated textile, not a bulk wax.');
const corkLeather = get('Cork Leather');
check(corkLeather?.subcategory === 'Wood & Plant Fibres', 'Cork leather must be treated as plant-derived, not animal hide.');

const promptIds = all.map(item => String(item.id));
check(new Set(promptIds).size === promptIds.length, 'Full catalogue contains duplicate IDs after Materials generation.');

console.log('MATERIALS ARCHITECTURE v2 — ' + materials.length + ' prompts / ' + categoryCounts.size + ' subcategories');
console.log('Subcategory distribution: ' + [...categoryCounts.entries()].map(([key, count]) => key + '=' + count).join(' | '));
console.log('Unique prompt bodies: ' + bodies.size + ' / ' + materials.length);
if (failures.length) {
  console.error('FAIL Materials catalogue architecture checks');
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}
console.log('PASS: all 200 Materials records have explicit profiles, target-aware physics, source-preservation rules and taxonomy assignments.');
