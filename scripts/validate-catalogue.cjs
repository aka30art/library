#!/usr/bin/env node
const fs = require('node:fs');
const vm = require('node:vm');
function extract(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not read ${label} from app.js`);
  return vm.runInNewContext(match[1]);
}
const app = fs.readFileSync('app.js', 'utf8');
const collections = extract(app, /const collections = (\[[\s\S]*?\n\];)\nlet prompts =/, 'collections');
const basePrompts = extract(app, /let prompts = (\[[\s\S]*?\n\];)\nprompts\.push/, 'base prompts');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js', 'utf8'), sandbox, { timeout: 5000 });
const expansion = sandbox.window.AI_PROMPT_EXPANSION;
if (!Array.isArray(expansion)) throw new Error('Expansion script did not expose an array');
const all = [...basePrompts, ...expansion];
const ids = new Set(), errors = [];
for (const p of all) {
  if (ids.has(String(p.id))) errors.push(`Duplicate prompt ID: ${p.id}`);
  ids.add(String(p.id));
  for (const field of ['title','prompt','negative','tags','model']) if (p[field] == null || (Array.isArray(p[field]) && !p[field].length)) errors.push(`Prompt ${p.id} missing ${field}`);
}
const expected = ['materials','styles','effects','lighting','composition','rendering','transformations'];
if (collections.length !== expected.length || expected.some((id,i)=>collections[i]?.id!==id)) errors.push('Public collections must be the seven agreed universal groups in order');
if (all.length !== 1001) errors.push(`Expected 1001 preserved source prompts, found ${all.length}`);
const pages = ['index.html','explore.html','builder.html'].map(file => [file,fs.readFileSync(file,'utf8')]);
for (const [file,html] of pages) {
 if (!html.includes('catalogue-expansion.js?v=20261117-modular-builder1')) errors.push(`${file} has stale catalogue asset version`);
 if (!html.includes('app.js?v=20261117-modular-builder1')) errors.push(`${file} has stale app asset version`);
 if (!html.includes('backups/2026-11-17/catalogue-expansion.js')) errors.push(`${file} missing recovery loader`);
}
if (!fs.readFileSync('explore.html','utf8').includes('id="category-filter"')) errors.push('Explore collection filter missing');
if (fs.readFileSync('explore.html','utf8').includes('id="visual-filter"')) errors.push('Narrow visual subfilter should be removed');
if (errors.length) { console.error('CATALOGUE VALIDATION FAILED'); errors.forEach(e=>console.error('- '+e)); process.exit(1); }
console.log(`Validation passed: ${all.length} source prompts preserved, ${collections.length} universal collections, duplicate IDs absent, required fields complete, no narrow visual subfilter, page assets synchronized.`);
