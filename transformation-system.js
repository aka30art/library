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
    material:["MATERIAL TRANSFORMATION PROTOCOL","Change the material identity to the specified target. Preserve silhouette, proportions, construction and topology unless material-driven redesign is explicitly requested.","Define physically coherent colour, metallic/dielectric response, roughness, gloss, reflectance, transmission, refraction, absorption, subsurface response, anisotropy, thickness and edge behaviour only where relevant.","Make highlights, reflections, shadows, transparency and light interaction consistent. Do not merely recolour or overlay."].join("\n"),
    surface:["SURFACE TRANSFORMATION PROTOCOL","Change only the exposed treatment—finish, coating, patina, glaze, polish, oxidation, print, inlay, relief or wear—unless explicitly instructed to replace the substrate.","Specify coverage, boundaries, thickness, layer order, adhesion, transitions and interaction with seams, recesses and contact zones.","Do not replace the base material or deform the form unless requested."].join("\n"),
    texture:["TEXTURE TRANSFORMATION PROTOCOL","Change tactile/microstructural character—grain, pore scale, fibre direction, roughness, relief, embossing, erosion, granularity, striation or cracking—without changing material identity or silhouette unless displacement is requested.","Scale texture to the subject and distribute it according to curvature, orientation, wear and manufacturing logic.","Avoid tiling, uniform noise, scale drift, melted contours or detail that obscures the subject."].join("\n"),
    "style-transfer":["VISUAL STYLE TRANSFER PROTOCOL","Reconstruct the source through the target visual language: shape grammar, markmaking, value structure, colour logic, edge treatment, simplification, detail hierarchy and rendering conventions.","Preserve identity anchors and intended focal subject. Pose, camera and composition may change only when the brief allows or requires it.","Transfer visual principles, not unrelated characters, props, logos, text or scene content."].join("\n"),
    hybrid:["HYBRID TRANSFORMATION ORCHESTRATION PROTOCOL","Combine selected treatments deliberately. Establish primary transformation, supporting treatments, priority and distinct visual roles before execution.","Define each module’s spatial/material/compositional responsibility, coverage, overlaps, transitions and locked attributes. Avoid uniform application or uncontrolled blending.","Conflict precedence: explicit user requirements > primary transformation > architecture scope > preservation contract > supporting modules > optional refinements. Adapt or omit lower-priority conflicts."].join("\n")
  };
  const preservationRules={
    strict:"STRICT SOURCE LOCK: preserve identity, defining features, exact silhouette, proportions, pose, expression, object count, relationships, viewpoint and framing. Change only explicitly permitted attributes. If the requested treatment inherently requires a change, make the smallest necessary local change and preserve all other locked attributes.",
    structural:"STRUCTURAL LOCK: preserve identity, primary geometry, proportions, pose, key details and principal composition. Permit only local changes required by the requested transformation; do not redesign unrelated features.",
    reinterpret:"CONTROLLED REINTERPRETATION: preserve semantic identity anchors and recognisability. Permit secondary details, shape language, edge behaviour and composition to change only when directly supporting the target visual language."
  };
  let rendering=false;
  const promptById=new Map((window.AI_PROMPT_BUILDER_CATALOGUE||[]).map(p=>[String(p.id),p]));
  function build(){
    if(mode.value!=="transformation"){panel.hidden=true;return;}
    panel.hidden=false;
    const checked=[...document.querySelectorAll("#builder-modules input[data-prompt-id]:checked")];
    const modules=checked.map(input=>promptById.get(String(input.dataset.promptId))).filter(Boolean).map(p=>p.title+"\n"+p.prompt);
    const selected=modules.length?modules.join("\n\n"):"No visual modules selected. Use the target treatment as the primary transformation instruction.";
    const refinements=[["Visual style",document.getElementById("builder-style")?.value],["Lighting",document.getElementById("builder-light")?.value],["Composition",document.getElementById("builder-frame")?.value]].filter(item=>item[1]).map(item=>item[0]+": "+item[1]);
    const artDirection=refinements.length?refinements.join("\n"):"No additional style, lighting or composition refinement specified.";
    const architectureName=architecture.options[architecture.selectedIndex].text;
    const objective=target.value.trim()||"Apply the selected visual modules as a deliberate target treatment. Resolve the target from the source image rather than substituting the example subject.";
    const subject=source.value.trim()||"[SUPPLY THE SOURCE IMAGE AND, IF NECESSARY, A BRIEF SUBJECT DESCRIPTION]";
    const text=[
      "UNIVERSAL TRANSFORMATION PROMPT (UTP) — "+architectureName.toUpperCase(),
      "",
      "1. SOURCE INPUT",
      "Use the supplied source image as the sole source of subject identity and structural information.",
      "Source image: preserve the original reference as the transformation input; do not replace it with a newly invented scene.",
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
      "CONSTRAINT PRECEDENCE: explicit user requirements > primary transformation objective > architecture scope > source preservation contract > supporting modules > optional style, lighting and composition refinements. Resolve conflicts before rendering; adapt or omit lower-priority instructions. Analyse the source and separate locked attributes from permitted and required changes. Maintain perspective, geometry, depth, lighting and occlusion only where compatible with the chosen transformation. Ensure one coherent resolved image.",
      "",
      "8. QUALITY CONTROL",
      "Check transformation-specific fidelity, identity anchors, locked attributes, permitted changes, material/style behaviour, texture scale, transitions and focal clarity. Check lighting, depth and atmosphere only when relevant. Correct artifacts, accidental substitutions, contradictions, broken boundaries, repeated patterns and details competing with the objective.",
      "",
      "9. NEGATIVE CONSTRAINTS",
      "No subject substitution or identity drift unless requested; no changes to locked attributes; no unrelated props, text or logos; no contradictory instructions; no incoherent material behavior, uncontrolled effects, excessive surface noise or clutter. Do not impose camera, depth, lighting or atmosphere changes unless relevant and permitted.",
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