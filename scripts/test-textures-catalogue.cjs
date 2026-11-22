'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const failures=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('catalogue-expansion.js','utf8'),sandbox,{timeout:20000});
const base=sandbox.window.AI_PROMPT_EXPANSION||[];
const textures=base.filter(item=>item.category==='textures');
vm.runInNewContext(fs.readFileSync('textures-v2.js','utf8'),sandbox,{timeout:20000});
const all=sandbox.window.AI_PROMPT_EXPANSION||[];
const records=all.filter(item=>item.category==='textures');
const expectedNames=["Fine Film Grain","Coarse Film Grain","Microscopic Surface Pores","Brushed Directional Grain","Subtle Patina","Distressed Abrasion","Layered Pigment","Paper Tooth","Woven Fibre Detail","Embossed Relief","Debossed Impression","Micro-Scratches","Hairline Fractures","Powder-Coated Finish","Orange-Peel Texture","Soft-Touch Matte","Wet Gloss","Translucent Layering","Iridescent Interference","Crystalline Facets","Organic Mottling","Mineral Deposits","Aged Surface Wear","Tactile Stippling","Fine Noise Structure","Woven Mesh Structure","Hammered Metal Relief","Cracked Ceramic Glaze","Tree Bark Ridges","Reptile Scale Pattern","Feather Barbs","Layered Fur Strands","Crystalline Growth","Frost Crystal Formation","Condensation Droplets","Water Ripple Rings","Open-Cell Foam","Cooled Lava Crust","Stratified Sediment","Salt Crystallisation","Rust Bloom Clusters","Peeling Paint Layers","Concrete Pitting","Natural Stone Veining","Wood Knot Patterns","Knitted Loop Structure","Chainmail Interlock","Carbon Weave Pattern","Beeswax Bloom","Granular Sand Deposits","Lichen-Crusted Stone","Moss Velvet Growth","Coral Polyp Surface","Petrified Wood Grain","Fossilised Shell Matrix","Meteorite Regmaglypts","Geode Crystal Cavity","Selenite Satin Spar","Botryoidal Mineral Surface","Dried River-Mud Polygon Cracks","Desert Varnish Patina","Glacier Ice Striations","Compressed Snow Crystals","Sea-Salt Encrustation","Pearlescent Shell Layers","Oxidised Paint Scaling","Alligator-Skin Crazing","Shattered Safety-Glass Granules","Pitted Volcanic Glass","Sintered Metal Pores","Sponge-Metal Lattice","Electroformed Dendrites","Laser-Etched Microgrooves","Embroidery Thread Relief","Tufted Textile Pile","Tennis-Ball Fluorescent Felt Nap","Crushed Velvet Directional Pile","Microfibre Suede Nap","Peach-Skin Fabric Fuzz","Flocked Rubber Dust","Static-Cling Synthetic Fibres","Chenille Caterpillar Pile","Sherpa Fleece Curls","Boucle Loop Clusters","Terry-Cloth Loops","Bath-Mat Tufting","Carpet Underlay Foam Cells","AstroTurf Plastic Blades","Artificial Grass Thatch","Velcro Hook-And-Loop Field","Hook Tape Microhooks","Balloon Latex Stretch Sheen","Powdered Chalk Drag","Dried Acrylic Skin Wrinkles","Crackle-Medium Alligatoring","Crazed Porcelain Glaze","Orange Peel Powder-Coat Dimples","Hammered Foil Crumple","Candy-Wrapper Metallised Wrinkles","Heat-Shrink Plastic Ripples","Melted Vinyl Sag","Melted Wax Rivulets","Soap-Bubble Membrane","Suds And Foam Cells","Whipped-Cream Aeration","Marshmallow Porous Crumb","Meringue Crisp Shell","Popcorn Kernel Crags","Rice-Paper Wrinkling","Parchment Translucency","Blistered Paint Bubbles","Peeling Adhesive Residue","Duct-Tape Weave And Adhesive","Gaffer-Tape Cloth Grain","Carbon-Paper Transfer Haze","Thermal Receipt Paper Fade","Newsprint Ink Feathering","Riso Ink Pinholes","Photocopier Toner Scatter","Magnetic Tape Oxide Shedding","Cassette Tape Ribbon Tangles","Vinyl Record Groove Micro-Ridges","CD Diffraction Pits","LCD Pixel-Grid Shimmer","Satin Ribbon Moire"];
const expectedSubcategories=["Natural & Biological","Microstructure & Surface Finish","Food & Organic Textures","Mineral & Geological","Metal & Industrial","Textile & Fibres","Paper & Print","Liquid & Atmospheric","Synthetic & Manufactured","Surface Wear & Ageing","Print, Media & Optical"];
const sections=[
'TEXTURE TRANSFORMATION — TARGET-SPECIFIC SURFACE SYSTEM','SOURCE: [SUBJECT] / [SOURCE IMAGE].','TEXTURE TARGET:',
'SOURCE IDENTITY & GEOMETRY LOCK:','TEXTURE IDENTITY & FORMATION:','MICROSTRUCTURE & SCALE:',
'TOPOGRAPHY, DIRECTION & DISTRIBUTION:','TACTILE / MECHANICAL CHARACTER:','LIGHT & OPTICAL RESPONSE:',
'SOURCE INTEGRATION & COVERAGE:','BOUNDARIES & EXCLUSIONS:','FINAL TEXTURE-AWARE CHECK:'
];
const normalise=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
check(textures.length===125,'Base catalogue should contain exactly 125 Textures records.');
check(records.length===125,'Textures v2 should retain exactly 125 records.');
check(records.every((item,index)=>String(item.id)===String(index+326)),'Texture IDs 326–450 must remain stable and ordered.');
check(records.every((item,index)=>normalise(item.title)===normalise(expectedNames[index])),'Original Texture title sequence must remain unchanged.');
const ids=new Set(),titles=new Set(),bodies=new Set(),skeletons=new Set(),counts={};
for(const item of records){
 const name=String(item.title||''),prompt=String(item.prompt||'');
 check(item.id!=null&&!ids.has(String(item.id)),'Missing or duplicate Texture ID '+item.id);ids.add(String(item.id));
 check(name&&!titles.has(normalise(name)),'Missing or duplicate Texture title '+name);titles.add(normalise(name));
 check(expectedSubcategories.includes(item.subcategory),name+': invalid Texture subcategory '+item.subcategory);
 counts[item.subcategory]=(counts[item.subcategory]||0)+1;
 check(item.tags.includes(item.subcategory)&&item.tags.includes('Texture DNA v2'),'Missing explicit Texture taxonomy/profile tags: '+name);
 check(item.tags.includes('Target-specific surface system'),'Missing target-specific profile tag: '+name);
 check(item.kind==='texture'&&item.difficulty==='Professional',name+': Texture v2 metadata incorrect');
 check(prompt.startsWith(sections[0]),name+': missing Textures v2 prompt marker');
 check(sections.every(section=>prompt.includes(section)),name+': missing one or more of twelve required sections');
 check(prompt.includes('TEXTURE TARGET: '+name),name+': target not explicit');
 check(prompt.includes('[SUBJECT]')&&prompt.includes('[SOURCE IMAGE]'),name+': source contract missing');
 const words=prompt.trim().split(/\s+/).filter(Boolean).length;
 check(words>=200,name+': prompt is underdeveloped ('+words+' words)');
 check(!bodies.has(normalise(prompt)),name+': duplicate prompt body');bodies.add(normalise(prompt));
 const skeleton=normalise(prompt.split('\n\n').filter(block=>!block.startsWith('TEXTURE TARGET:')&&!block.startsWith('FINAL TEXTURE-AWARE CHECK:')).join(' '));
 check(!skeletons.has(skeleton),name+': repeated generic profile skeleton');skeletons.add(skeleton);
}
for(const sub of expectedSubcategories)check((counts[sub]||0)>0,'Texture taxonomy empty: '+sub);
const audit=sandbox.window.AI_PROMPT_TEXTURES_V2_AUDIT;
check(audit&&audit.version==='2.0'&&audit.records===125&&audit.profiles===125&&audit.requiredSections===12,'Textures v2 runtime audit missing or incomplete');
check(Object.keys(audit?.subcategoryCounts||{}).length===11,'Textures v2 runtime audit must report all eleven subcategories');
const app=fs.readFileSync('app.js','utf8');
for(const sub of expectedSubcategories)check(app.includes('"'+sub+'"'),'App taxonomy missing '+sub);
const taxStart=app.indexOf('subcategoryTaxonomy='),taxEnd=app.indexOf(';;\nconst subcategoryOverrides=',taxStart);
check(taxStart>=0&&taxEnd>taxStart,'Unable to inspect application subcategory taxonomy');
if(taxStart>=0&&taxEnd>taxStart){
 const taxonomy=vm.runInNewContext('('+app.slice(taxStart+'subcategoryTaxonomy='.length,taxEnd).replace(/;+\s*$/,'')+')');
 const overrideStart=app.indexOf('const subcategoryOverrides='),overrideEnd=app.indexOf(';\nfunction subcategoryFor',overrideStart);
 const fnStart=app.indexOf('function subcategoryFor(p){'),fnEnd=app.indexOf('\nprompts.forEach',fnStart);
 if(overrideStart>=0&&overrideEnd>overrideStart&&fnStart>=0&&fnEnd>fnStart){
  const overrides=vm.runInNewContext('('+app.slice(overrideStart+'const subcategoryOverrides='.length,overrideEnd).replace(/;+\s*$/,'')+')');
  const classifier=vm.runInNewContext(app.slice(fnStart,fnEnd)+';subcategoryFor',{subcategoryTaxonomy:taxonomy,subcategoryOverrides:overrides,prompts:all});
  for(const item of records)check(classifier(item)===item.subcategory,item.title+': runtime Explore classifier differs from profile taxonomy');
  for(const sub of expectedSubcategories)check(taxonomy.textures.some(row=>row[0]===sub),'Textures Explore taxonomy missing '+sub);
 }
}
if(failures.length){console.error('TEXTURES CATALOGUE V2 FAILURES ('+failures.length+')\\n'+failures.join('\\n'));process.exit(1);}
console.log('PASS: 125 Textures records retain original IDs 326–450 and title order.');
console.log('PASS: 125 authored target-specific prompts; twelve required sections and unique bodies.');
console.log('PASS: all eleven Textures subcategories are assigned and runtime-filterable.');
console.log('Textures v2 distribution: '+Object.entries(counts).map(([name,count])=>name+'='+count).join(' | '));
