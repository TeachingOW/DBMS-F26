/* JSON-rendered slides are the default; reviewed source images remain optional. */
window.DBMSReviewed = (() => {
  let sourceMode = false;
  function apply(slide, body, main) {
    const ref = slide.presentation?.reference;
    if (!ref) return;
    const existing = document.getElementById('source-view-controls');
    if (existing) existing.remove();
    const controls = document.createElement('div');
    controls.id = 'source-view-controls'; controls.className = 'source-view-controls';
    const toggle = document.createElement('button'); toggle.type = 'button';
    const note = document.createElement('span');
    note.textContent = ref.kind === 'base-source-static'
      ? `Source layout repaired from base deck slide ${ref.source_slide_number}. Static view; animations are in the PowerPoint.`
      : 'PowerPoint source view · Static export. Use slide text for content revealed by animations.';
    controls.append(toggle, note);
    for (const url of slide.source_links || []) {
      if (!/^(https?:|mailto:)/i.test(url)) continue;
      const link=document.createElement('a'); link.href=url; link.textContent=url; controls.append(link);
    }
    main.before(controls);
    const approximation = document.createElement('div');
    approximation.className = 'reviewed-editable-layout';
    approximation.append(...body.childNodes);
    const image = document.createElement('img');
    image.className = 'reviewed-source-image'; image.src = ref.media_src;
    image.width = ref.width; image.height = ref.height;
    image.alt = `${slide.title} — static PowerPoint reference`;
    const error = document.createElement('p'); error.hidden = true; error.setAttribute('role', 'alert');
    error.textContent = 'Source image could not load. The editable layout and slide text are still available.';
    image.onerror = () => { error.hidden = false; sourceMode = false; update(); };
    body.replaceChildren(image, error, approximation);
    const wasPositioned = main.classList.contains('positioned');
    function update() {
      image.hidden = !sourceMode; approximation.hidden = sourceMode;
      main.classList.toggle('positioned', !sourceMode && wasPositioned);
      toggle.textContent = sourceMode ? 'Show editable layout (approximate)' : 'Show PowerPoint source view';
      toggle.setAttribute('aria-pressed', String(!sourceMode));
      body.dataset.reviewedView = sourceMode ? 'source' : 'editable';
    }
    toggle.onclick = () => { sourceMode = !sourceMode; update(); };
    update();
  }
  return {apply};
})();
