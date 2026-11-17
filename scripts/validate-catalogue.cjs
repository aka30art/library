#!/usr/bin/env node
const fs = require('node:fs');
const vm = require('node:vm');

function extract(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not read ${label} from app.js`);
  return vm.runInNewContext(match[1]);
}

const app = fs.readFileSync('app.js', 'utf8');
const baseCollections = extract(app, /const collections = (\[[\s\S]*?\n\];)\nconst prompts =/, 'collections');
const basePrompts = extract(app, /const prompts = (\[[\s\S]*?\n\];)\nprompts\.push/, 'base prompts');
const expansionSource = fs.readFileSync('catalogue-expansion.js', 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(expansionSource, sandbox, { timeout: 5000 });
const expansion = sandbox.window.AI_PROMPT_EXPANSION;
if (!Array.isArray(expansion)) throw new Error('Expansion script did not expose an array');

const prompts = [...basePrompts, ...expansion];
const counts = new Map(baseCollections.map(c => [c.id, 0]));
const ids = new Set();
const errors = [];
for (const p of prompts) {
  if (!counts.has(p.category)) errors.push(`Unknown category on prompt ${p.id}: ${p.category}`);
  else counts.set(p.category, counts.get(p.category) + 1);
  if (ids.has(String(p.id))) errors.push(`Duplicate prompt ID: ${p.id}`);
  ids.add(String(p.id));
  for (const field of ['title', 'prompt', 'negative', 'tags', 'model']) {
    if (p[field] == null || (Array.isArray(p[field]) && !p[field].length)) errors.push(`Prompt ${p.id} missing ${field}`);
  }
}
for (const c of baseCollections) {
  const count = counts.get(c.id);
  if (count < 50) errors.push(`Collection ${c.id} has only ${count} prompts (minimum 50)`);
}
if (prompts.length !== 1001) errors.push(`Expected 1001 prompts, found ${prompts.length}`);
if (baseCollections.length !== 20) errors.push(`Expected 20 collections, found ${baseCollections.length}`);

const pages = ['index.html', 'explore.html', 'builder.html'].map(file => [file, fs.readFileSync(file, 'utf8')]);
for (const [file, html] of pages) {
  if (!html.includes('catalogue-expansion.js?v=20261117-reliability1')) errors.push(`${file} does not use the current catalogue asset version`);
  if (!html.includes('app.js?v=20261117-reliability1')) errors.push(`${file} does not use the current app asset version`);
  if (!html.includes('backups/2026-11-17/catalogue-expansion.js')) errors.push(`${file} is missing the catalogue recovery loader`);
}
if (errors.length) {
  console.error('CATALOGUE VALIDATION FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Catalogue validation passed: ${prompts.length} prompts, ${baseCollections.length} collections, minimum ${Math.min(...counts.values())} per collection, unique IDs, complete prompt fields, and synchronized page assets.`);
