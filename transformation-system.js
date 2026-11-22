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
    texture:["TEXTURE TRANSFORMATION PROTOCOL — TARGET-SPECIFIC SURFACE SYSTEM","Treat the supplied subject and source image as fixed identity and geometry references. Transform only the selected surface structure; do not substitute the base material, redesign the silhouette or add a new scene.","Resolve the target through texture identity and formation, microstructure and scale, topography and direction, distribution and coverage, tactile/mechanical character, and light/optical response. Distinguish surface relief from bulk geometry, coatings from substrates, and loose deposits from bonded structures.","Scale every feature to the object's real dimensions and viewing distance. Follow curvature, gravity, stress, growth, weave, manufacturing direction and contact history. Make transitions coherent at seams, edges, cut faces, joints, labels and separate components.","Preserve source proportions, pose, part count, construction, openings, controls, labels, moving interfaces and functional clearances. Apply the texture only where the substrate, exposure and use justify it; reduce it across protected, hidden, moving or non-contact regions.","SCALE, DISTRIBUTION & MATERIAL BOUNDARIES: prevent uniform tiling, random noise, impossible relief, disconnected details, false material substitution, texture scale drift, melted contours, blocked apertures, incoherent lighting and details that obscure source identity.","FINAL TEXTURE CHECK: verify named texture identity, physical origin, microstructure, scale, direction, coverage, optical response, substrate continuity, functional geometry and immediate source recognition."].join("\n"),
    "style-transfer":["VISUAL STYLE TRANSFER PROTOCOL — STYLE DNA DECOMPOSITION","Identify the target style's governing visual principles before rendering. Treat the style as a connected system, not a name, preset, filter or palette swap.","Resolve the style through distinct but coordinated axes: visual thesis; shape grammar and proportion; line, markmaking and edge behaviour; colour and value hierarchy; composition, space and rhythm; medium, reproduction or rendering method; detail density and focal emphasis.","Translate those principles onto the supplied source's actual forms. Preserve recognisable identity anchors, part count, key proportions, pose and intended subject unless controlled reinterpretation is explicitly permitted.","Make every selected principle reinforce the same style identity. Do not combine incompatible periods, media, cultural references or movements by default; resolve overlaps in favour of the named target's defining grammar.","Transfer visual principles rather than unrelated characters, props, logos, text, symbols or scene content. Use cultural and historical references specifically and respectfully; do not replace a named tradition with generic shorthand.","FINAL STYLE CHECK: the target style must be evident through form, technique, composition and surface—not merely colour. Confirm source recognition, internal consistency, purposeful detail hierarchy and absence of generic AI embellishment."].join("\n"),
    hybrid:["HYBRID TRANSFORMATION ORCHESTRATION PROTOCOL","Combine selected treatments deliberately. Establish primary transformation, supporting treatments, priority and distinct visual roles before execution.","Define each module’s spatial/material/compositional responsibility, coverage, overlaps, transitions and locked attributes. Avoid uniform application or uncontrolled blending.","Conflict handling: explicit user requirements and the preservation contract determine permission to change; architecture defines only the transformation domain and cannot override preservation limits. Within permitted changes, prioritize the primary treatment, then supporting modules and optional refinements. Adapt or omit conflicting lower-priority instructions."].join("\n")
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
      "CONSTRAINT PRECEDENCE: explicit user requirements and the selected source-preservation contract define what changes are permitted. The transformation architecture defines the domain and method of change, not permission to override locked attributes. Within those limits, prioritize the primary transformation objective, then supporting modules, then optional style, lighting and composition refinements. Resolve conflicts before rendering; adapt or omit lower-priority instructions. Analyse the source and distinguish locked attributes, permitted changes and necessary changes. Maintain perspective, geometry, depth, lighting and occlusion only where compatible and relevant. Ensure one coherent resolved image.",
      "",
      "8. QUALITY CONTROL",
      "Check transformation-specific fidelity, identity anchors, locked attributes, permitted changes, material/style behaviour, texture scale, transitions and focal clarity. Check lighting, depth and atmosphere only when relevant. Correct artifacts, accidental substitutions, contradictions, broken boundaries, repeated patterns and details competing with the objective.",
      "",
      "9. NEGATIVE CONSTRAINTS",
      "No subject substitution or identity drift unless requested; no changes to locked attributes; no unrelated props, text or logos; no contradictory instructions; no incoherent material behavior, uncontrolled effects, excessive surface noise or clutter. Do not impose camera, depth, lighting or atmosphere changes unless relevant and permitted.",
      "",
      "10. FINAL OUTPUT",
      "Deliver a coherent, fully resolved result that clearly realises the target transformation. Preserve source identity and recognisable features to the degree required by the selected preservation contract; under controlled reinterpretation, recognisability may be deliberately reduced only as needed to serve the target visual language."
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