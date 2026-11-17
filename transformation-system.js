(function(){
  const page=document.querySelector('[data-page="builder"]');
  if(!page)return;
  const mode=document.getElementById("builder-type");
  const output=document.getElementById("builder-output");
  const source=document.getElementById("builder-source");
  const panel=document.getElementById("transformation-controls");
  if(!mode||!output||!source||!panel)return;
  const architecture=document.getElementById("transformation-architecture");
  const target=document.getElementById("transformation-target");
  const preservation=document.getElementById("transformation-preservation");
  const rules={
    material:[
      "MATERIAL TRANSFORMATION PROTOCOL",
      "Replace the source material identity with the specified target material while retaining the object's underlying geometry, silhouette, dimensions, construction, topology and recognisable design.",
      "Define the target material through physically coherent optical and tactile properties: base colour, metallic or dielectric response, roughness, gloss, reflectance, transmission, refraction, absorption, subsurface behaviour, anisotropy, edge response and micro-surface variation where relevant.",
      "Make reflections, highlights, shadows, thickness, transparency and light interaction consistent with the target material. Do not merely recolour the source or add a material-like overlay."
    ].join("\n"),
    surface:[
      "SURFACE TRANSFORMATION PROTOCOL",
      "Retain the source object's substrate, geometry, topology, proportions and construction. Transform only the exposed surface treatment: coating, finish, patina, glaze, polish, oxidation, print, inlay, relief, wear, pattern or applied layer as specified.",
      "Respect the relationship between the treatment and the underlying form. Define coverage, boundaries, thickness, edge transitions, layer order, adhesion, wear distribution and interaction with existing seams, recesses and protrusions.",
      "Do not turn a surface treatment into a replacement base material unless the target brief explicitly requires it. Keep the underlying object structurally legible."
    ].join("\n"),
    texture:[
      "TEXTURE TRANSFORMATION PROTOCOL",
      "Preserve the source subject's material identity and geometry unless explicitly overridden. Change the surface's tactile and microstructural character: grain, pore scale, fibre direction, roughness variation, relief, embossing, erosion, granularity, striation, cracking or other specified texture behaviour.",
      "Control texture scale relative to the object's real dimensions. Distribute detail according to curvature, orientation, wear, contact zones and manufacturing logic. Distinguish shallow surface detail from actual geometric relief.",
      "Avoid texture tiling, uniform noise, scale drift, excessive displacement, melted contours and detail that obscures the source silhouette."
    ].join("\n"),
    "style-transfer":[
      "VISUAL STYLE TRANSFER PROTOCOL",
      "Translate the source image into the target visual language through its defining formal rules: shape grammar, line behaviour, mark-making, value structure, colour logic, edge treatment, spatial simplification, detail hierarchy and rendering conventions.",
      "Preserve the source subject's recognisable identity, key features, pose, gesture, object relationships and intended focal hierarchy. Reconstruct those features in the target visual language rather than placing a style filter over the original pixels.",
      "Do not import unrelated characters, signature props, logos, text or scene content from style references. Transfer visual principles, not reference-image subject matter."
    ].join("\n"),
    hybrid:[
      "HYBRID TRANSFORMATION ORCHESTRATION PROTOCOL",
      "Combine two or more selected treatments as a controlled visual system. Establish a primary transformation, secondary supporting treatments and explicit priority order before rendering.",
      "Assign each treatment a clear spatial or material responsibility. Define where treatments overlap, where they remain separate, how boundaries transition and which source attributes remain locked. Avoid uncontrolled blending or competing treatments applied uniformly to every surface.",
      "Resolve conflicts using this hierarchy: source identity and preservation contract; primary transformation; secondary treatments; selected visual modules; lighting and composition refinements. Keep every treatment visually legible and technically compatible."
    ].join("\n")
  };
  const preservationRules={
    strict:"STRICT LOCK: preserve subject identity, exact silhouette, defining features, proportions, pose, expression, object count, object relationships, camera viewpoint, framing and essential composition. Alter only the explicitly requested visual treatment.",
    structural:"STRUCTURAL LOCK: preserve the recognisable subject, primary geometry, proportions, pose, key details and principal composition. Permit only local changes required to make the requested treatment coherent.",
    reinterpret:"CONTROLLED REINTERPRETATION: preserve identity anchors and the subject's semantic recognisability. Allow deliberate changes to secondary detail, edge language and local composition only where they directly support the target visual language."
  };
  let rendering=false;
  function extract(text,label,nextLabel){
    const start=text.indexOf(label);
    if(start<0)return "";
    const from=start+label.length;
    const end=nextLabel?text.indexOf(nextLabel,from):-1;
    return text.slice(from,end<0?text.length:end).trim();
  }
  function build(){
    if(mode.value!=="transformation"){panel.hidden=true;return;}
    panel.hidden=false;
    const base=output.textContent||"";
    const modules=extract(base,"SELECTED VISUAL MODULES:\n","ADDITIONAL ART DIRECTION:");
    const artDirection=extract(base,"ADDITIONAL ART DIRECTION:\n","INTEGRATION RULES:");
    const selected=modules&&modules!=="SELECT AT LEAST ONE VISUAL MODULE TO BEGIN."?modules:"No visual modules selected. Use the target treatment as the primary transformation instruction.";
    const architectureName=architecture.options[architecture.selectedIndex].text;
    const objective=target.value.trim()||"Apply the selected visual modules as a deliberate target treatment. Resolve the target from the source image rather than substituting the example subject.";
    const subject=source.value.trim()||"[SUPPLY THE SOURCE IMAGE AND, IF NECESSARY, A BRIEF SUBJECT DESCRIPTION]";
    const text=[
      "UNIVERSAL TRANSFORMATION PROMPT (UTP) — "+architectureName.toUpperCase(),
      "",
      "1. SOURCE INPUT",
      "Use the supplied image as the sole source of subject identity and structural information.",
      "Subject / source description: "+subject,
      "",
      "2. TRANSFORMATION OBJECTIVE",
      objective,
      "",
      "3. TRANSFORMATION ARCHITECTURE",
      rules[architecture.value],
      "",
      "4. SOURCE PRESERVATION CONTRACT",
      preservationRules[preservation.value],
      "Do not introduce unrelated subject matter, remove essential features, change object count or invent details that contradict the source.",
      "",
      "5. SELECTED VISUAL MODULES",
      selected,
      "",
      "6. ADDITIONAL ART DIRECTION",
      artDirection||"No additional style, lighting or composition refinement specified.",
      "",
      "7. EXECUTION AND INTEGRATION",
      "Analyse the source before applying the treatment. Separate invariant source attributes from attributes permitted to change. Apply the transformation at the correct spatial scale and maintain coherent perspective, geometry, depth, lighting and occlusion. Keep transitions deliberate and localised. Ensure that the transformed result reads as one resolved image rather than a collection of disconnected effects.",
      "",
      "8. QUALITY CONTROL",
      "Check subject recognisability, silhouette integrity, feature placement, proportion, edge continuity, material or style coherence, texture scale, lighting consistency, focal hierarchy and visual clarity. Correct artefacts, accidental substitutions, inconsistent reflections, broken boundaries, repeated texture patterns and details that compete with the subject.",
      "",
      "9. NEGATIVE CONSTRAINTS",
      "No unintended redesign, subject substitution, identity drift, geometry distortion, arbitrary props, unrelated text, logos, inconsistent material physics, uncontrolled effects, excessive surface noise, visual clutter or decorative additions that do not serve the transformation.",
      "",
      "10. FINAL OUTPUT",
      "Deliver a fully resolved transformation with the source subject recognisable and the target treatment clearly, consistently and convincingly realised."
    ].join("\n");
    if(output.textContent!==text){rendering=true;output.textContent=text;rendering=false;}
  }
  mode.addEventListener("change",build);
  [architecture,target,preservation,source,document.getElementById("builder-style"),document.getElementById("builder-light"),document.getElementById("builder-frame")].filter(Boolean).forEach(el=>el.addEventListener(el===target||el===source?"input":"change",build));
  document.getElementById("builder-modules")?.addEventListener("change",build);
  document.getElementById("builder-clear")?.addEventListener("click",()=>requestAnimationFrame(build));
  new MutationObserver(()=>{if(!rendering&&mode.value==="transformation")build();}).observe(output,{childList:true,characterData:true,subtree:true});
  build();
})();