(async () => {
  const response = await fetch(window.DBMS_PAGE.deckUrl);
  if (!response.ok) throw new Error('Reviewed presentation could not load');
  const deck = await response.json();
  const width = deck.slide_size_emu?.width || 12192000;
  const height = deck.slide_size_emu?.height || 6858000;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]));
  const slideText = blocks => (blocks || []).flatMap(block => [...(block.paragraphs || []), ...(block.rows || []).map(row => row.join(' | ')), ...slideText(block.children)]);
  const slides = deck.slides.map(slide => ({...slide, text:slideText(slide.content).join('\n'), links:slide.website_links || slide.source_links || []}));

  function resolveColor(value) {
    if (!value) return '';
    let hex;
    if (value.type === 'srgbClr') hex = value.value;
    if (value.type === 'sysClr') hex = value.lastClr;
    if (value.type === 'schemeClr') {
      const key = {tx1:'dk1', tx2:'dk2', bg1:'lt1', bg2:'lt2'}[value.value] || value.value;
      const themeValue = deck.theme_colors?.[key];
      hex = typeof themeValue === 'string' ? themeValue : themeValue?.lastClr || themeValue?.val;
    }
    return /^[0-9a-f]{6}$/i.test(hex || '') ? `#${hex}` : '';
  }

  function paragraphHtml(block) {
    const paragraphs = block.rich_paragraphs?.length ? block.rich_paragraphs : (block.paragraphs || []).map(text => ({text, runs:[]}));
    return paragraphs.map(paragraph => {
      const runs = (paragraph.runs || []).map(run => {
        const style = run.style || {};
        const css = [style.sz ? `font-size:${Number(style.sz) / 1080}cqw` : '', style.bold ? 'font-weight:700' : '', style.italic ? 'font-style:italic' : '', style.underline ? 'text-decoration:underline' : '', resolveColor(style.color) ? `color:${resolveColor(style.color)}` : ''].filter(Boolean).join(';');
        return `<span style="${css}">${escapeHtml(run.text)}</span>`;
      }).join('');
      const bullet = paragraph.bullet?.type === 'char' ? escapeHtml(paragraph.bullet.value || '•') : paragraph.bullet?.type === 'number' ? `${escapeHtml(paragraph.bullet.start_at || '1')}.` : '';
      const alignment = {ctr:'center', r:'right', just:'justify'}[paragraph.alignment] || 'left';
      return `<p style="text-align:${alignment}">${bullet ? `<span class="json-bullet">${bullet}</span>` : ''}${runs || escapeHtml(paragraph.text) || '&nbsp;'}</p>`;
    }).join('');
  }

  function shapeHtml(block) {
    const fill = resolveColor(block.fill) || 'transparent';
    const stroke = resolveColor(block.line?.color) || 'transparent';
    const geometry = block.geometry?.name;
    if (!geometry && fill === 'transparent' && stroke === 'transparent') return '';
    const common = `fill="${fill}" stroke="${stroke}" stroke-width="1"`;
    let shape = `<rect x="1" y="1" width="98" height="98" ${common}/>`;
    if (geometry === 'ellipse') shape = `<ellipse cx="50" cy="50" rx="48" ry="48" ${common}/>`;
    if (geometry === 'diamond') shape = `<polygon points="50,1 99,50 50,99 1,50" ${common}/>`;
    if (['line', 'lineInv'].includes(geometry) || block.object_type === 'cxnSp') {
      const reversed = geometry === 'lineInv';
      shape = `<line x1="${reversed ? 100 : 0}" y1="0" x2="${reversed ? 0 : 100}" y2="100" stroke="${stroke === 'transparent' ? '#243c2f' : stroke}" stroke-width="2"/>`;
    }
    return `<svg class="json-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${shape}</svg>`;
  }

  function renderObject(block, context = {sx:100 / width, sy:100 / height, tx:0, ty:0}) {
    const bounds = block.bounds_emu || {};
    if (block.kind === 'group') {
      const transform = block.group_transform || {}, offset = transform.off || {}, extent = transform.ext || {}, childOffset = transform.child_off || {}, childExtent = transform.child_ext || {};
      const childContext = childExtent.width ? {sx:context.sx * (extent.width || bounds.width) / childExtent.width, sy:context.sy * (extent.height || bounds.height) / childExtent.height, tx:context.tx + ((offset.x || 0) - (childOffset.x || 0)) * context.sx, ty:context.ty + ((offset.y || 0) - (childOffset.y || 0)) * context.sy} : context;
      return (block.children || []).map(child => renderObject(child, childContext)).join('');
    }
    const x = context.tx + (bounds.x || 0) * context.sx, y = context.ty + (bounds.y || 0) * context.sy, w = (bounds.width || 0) * context.sx, h = (bounds.height || 0) * context.sy;
    const rotation = bounds.rotation_60000deg ? `transform:rotate(${bounds.rotation_60000deg / 60000}deg);` : '';
    const frame = `left:${x}%;top:${y}%;width:${w}%;height:${h}%;${rotation}`;
    if (block.kind === 'table') {
      const rows = (block.rows || []).map((row, rowIndex) => `<tr>${row.map(cell => rowIndex ? `<td>${escapeHtml(cell)}</td>` : `<th>${escapeHtml(cell)}</th>`).join('')}</tr>`).join('');
      return `<div class="json-object" style="${frame}"><table>${rows}</table></div>`;
    }
    const image = block.media_src ? `<img src="${escapeHtml(block.media_src)}" alt="${escapeHtml(block.name || 'Slide illustration')}">` : '';
    const text = block.paragraphs || block.rich_paragraphs ? `<div class="json-text">${paragraphHtml(block)}</div>` : '';
    return `<div class="json-object" style="${frame}" aria-label="${escapeHtml(block.name || 'Slide object')}">${shapeHtml(block)}${image}${text}</div>`;
  }

  function renderSlide(slide) {
    const objects = (slide.content || []).filter(block => block.bounds_emu);
    const priority = block => block.object_type === 'pic' ? 0 : block.kind === 'drawing' ? 1 : block.kind === 'table' ? 2 : 3;
    return `<div class="json-slide" role="img" aria-label="${escapeHtml(slide.title)}">${[...objects].sort((a, b) => priority(a) - priority(b)).map(block => renderObject(block)).join('')}</div>`;
  }

  const sourceImage = document.querySelector('[data-slide]');
  const jsonView = document.createElement('div');
  jsonView.className = 'json-slide-view';
  sourceImage.before(jsonView);
  sourceImage.hidden = true;
  const caption = document.querySelector('[data-caption]'), status = document.querySelector('[data-status]'), previous = document.querySelector('[data-prev]'), next = document.querySelector('[data-next]'), form = document.querySelector('[data-jump]'), number = form.querySelector('input'), transcript = document.querySelector('[data-text]'), links = document.querySelector('[data-links]');
  const sourceToggle = document.createElement('button');
  sourceToggle.type = 'button'; sourceToggle.textContent = 'Show PowerPoint source image';
  document.querySelector('.slide-controls').append(sourceToggle);
  let current = 1, sourceMode = false;
  number.max = slides.length;
  document.querySelector('[data-total]').textContent = `of ${slides.length}`;

  function updateMode(slide) {
    jsonView.hidden = sourceMode; sourceImage.hidden = !sourceMode;
    sourceToggle.textContent = sourceMode ? 'Show JSON-rendered slide' : 'Show PowerPoint source image';
    sourceToggle.setAttribute('aria-pressed', String(sourceMode));
    if (sourceMode) {
      const reference = slide.presentation?.reference;
      sourceImage.width = reference?.width || 1280; sourceImage.height = reference?.height || 720;
      sourceImage.alt = `${slide.title} — static PowerPoint reference`; sourceImage.src = reference?.media_src || '';
    }
  }

  function show(index) {
    current = Math.max(1, Math.min(slides.length, index || 1));
    const slide = slides[current - 1];
    number.value = current; previous.disabled = current === 1; next.disabled = current === slides.length;
    caption.textContent = slide.title;
    status.textContent = `Slide ${current} of ${slides.length}${slide.hidden ? ' · Hidden in PowerPoint' : ''}`;
    jsonView.innerHTML = renderSlide(slide);
    transcript.textContent = slide.text || 'No selectable text on this slide.';
    links.replaceChildren(...slide.links.map(url => { const entry = document.createElement('li'), link = document.createElement('a'); link.href = url; link.textContent = url; entry.append(link); return entry; }));
    updateMode(slide);
  }
  function fromHash() { show(Number(location.hash.slice(1).match(/^\d+$/)?.[0])); }
  function go(index) { const target = Math.max(1, Math.min(slides.length, index)); if (target !== current) location.hash = String(target); }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  sourceToggle.addEventListener('click', () => { sourceMode = !sourceMode; updateMode(slides[current - 1]); });
  form.addEventListener('submit', event => { event.preventDefault(); go(number.valueAsNumber); });
  document.addEventListener('keydown', event => {
    if (event.target.closest('input, button, a, summary') || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = {ArrowLeft:current - 1, ArrowRight:current + 1, Home:1, End:slides.length};
    if (Object.hasOwn(keys, event.key)) { event.preventDefault(); go(keys[event.key]); }
  });
  window.addEventListener('hashchange', fromHash);
  fromHash();
})().catch(error => {
  const status = document.querySelector('[data-status]');
  if (status) { status.textContent = error.message; status.setAttribute('role', 'alert'); }
  console.error(error);
});
