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
    if (!/^[0-9a-f]{6}$/i.test(hex || '')) return '';
    const channels = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
    const lumMod = value.lumMod == null ? 1 : Number(value.lumMod) / 100000;
    const lumOff = value.lumOff == null ? 0 : Number(value.lumOff) / 100000;
    const transformed = channels.map(channel => Math.max(0, Math.min(255, Math.round(channel * lumMod + 255 * lumOff))));
    const alpha = value.alpha == null ? 1 : Number(value.alpha) / 100000;
    return alpha < 1 ? `rgba(${transformed.join(',')},${alpha})` : `#${transformed.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
  }

  function paragraphHtml(block) {
    const paragraphs = block.rich_paragraphs?.length ? block.rich_paragraphs : (block.paragraphs || []).map(text => ({text, runs:[]}));
    return paragraphs.map(paragraph => {
      const runs = (paragraph.runs || []).map(run => {
        const style = run.style || {};
        const css = [style.sz ? `font-size:calc(${Number(style.sz) / 1080}cqw * var(--fit,1))` : '', style.bold ? 'font-weight:700' : '', style.italic ? 'font-style:italic' : '', style.underline ? 'text-decoration:underline' : '', resolveColor(style.color) ? `color:${resolveColor(style.color)}` : '', style.font ? `font-family:${escapeHtml(style.font)},Arial,sans-serif` : ''].filter(Boolean).join(';');
        return `<span style="${css}">${escapeHtml(run.text)}</span>`;
      }).join('');
      const bullet = paragraph.bullet?.type === 'char' ? escapeHtml(paragraph.bullet.value || '•') : paragraph.bullet?.type === 'number' ? `${escapeHtml(paragraph.bullet.start_at || '1')}.` : '';
      const alignment = {ctr:'center', r:'right', just:'justify'}[paragraph.alignment] || 'left';
      const format = paragraph.paragraph_format || {};
      const emuCqw = value => Number(value || 0) / width * 100;
      const spacing = [];
      if (format.marL) spacing.push(`padding-left:${emuCqw(format.marL).toFixed(3)}cqw`);
      if (format.indent) spacing.push(`text-indent:${emuCqw(format.indent).toFixed(3)}cqw`);
      if (format.spcBef?.spcPts) spacing.push(`margin-top:${(Number(format.spcBef.spcPts) * 127 / width * 100).toFixed(3)}cqw`);
      if (format.spcAft?.spcPts) spacing.push(`margin-bottom:${(Number(format.spcAft.spcPts) * 127 / width * 100).toFixed(3)}cqw`);
      if (format.lnSpc?.spcPct) spacing.push(`line-height:${Number(format.lnSpc.spcPct) / 100000}`);
      return `<p style="text-align:${alignment};${spacing.join(';')}">${bullet ? `<span class="json-bullet">${bullet}</span>` : ''}${runs || escapeHtml(paragraph.text) || '&nbsp;'}</p>`;
    }).join('');
  }

  function shapeHtml(block) {
    const fill = resolveColor(block.fill) || 'transparent';
    const connector = block.object_type === 'cxnSp';
    const inheritedConnectorColor = connector && (block.line?.head_end?.type || block.line?.tail_end?.type)
      ? resolveColor({type:'schemeClr', value:'accent2'})
      : '#243c2f';
    const stroke = resolveColor(block.line?.color) || (connector ? inheritedConnectorColor : 'transparent');
    const geometry = block.geometry?.name;
    if (!geometry && fill === 'transparent' && stroke === 'transparent' && !connector) return '';
    const strokeWidth = block.line?.width_emu ? Math.max(.6, Number(block.line.width_emu) / 19050) : 1;
    const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"`;
    let shape = `<rect x="1" y="1" width="98" height="98" ${common}/>`;
    if (geometry === 'ellipse') shape = `<ellipse cx="50" cy="50" rx="48" ry="48" ${common}/>`;
    if (geometry === 'diamond') shape = `<polygon points="50,1 99,50 50,99 1,50" ${common}/>`;
    if (['line', 'lineInv'].includes(geometry) || connector) {
      const reversed = geometry === 'lineInv';
      const markerId = `arrow-${block.shape_id || 'connector'}`;
      const marker = `<defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${stroke}"/></marker></defs>`;
      const markerStart = block.line?.head_end?.type && block.line.head_end.type !== 'none' ? ` marker-start="url(#${markerId})"` : '';
      const markerEnd = block.line?.tail_end?.type && block.line.tail_end.type !== 'none' ? ` marker-end="url(#${markerId})"` : '';
      shape = `${marker}<line x1="${reversed ? 100 : 0}" y1="0" x2="${reversed ? 0 : 100}" y2="100" stroke="${stroke}" stroke-width="${strokeWidth}"${markerStart}${markerEnd}/>`;
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
    const transforms = [];
    if (bounds.rotation_60000deg) transforms.push(`rotate(${bounds.rotation_60000deg / 60000}deg)`);
    if (bounds.flipH) transforms.push('scaleX(-1)');
    if (bounds.flipV) transforms.push('scaleY(-1)');
    const transform = transforms.length ? `transform:${transforms.join(' ')};` : '';
    const overflow = block.object_type === 'cxnSp' ? 'overflow:visible;' : '';
    const frame = `left:${x}%;top:${y}%;width:${w}%;height:${h}%;${transform}${overflow}`;
    if (block.kind === 'table') {
      const rows = (block.rows || []).map((row, rowIndex) => `<tr>${row.map(cell => rowIndex ? `<td>${escapeHtml(cell)}</td>` : `<th>${escapeHtml(cell)}</th>`).join('')}</tr>`).join('');
      return `<div class="json-object" style="${frame}"><table>${rows}</table></div>`;
    }
    const image = block.media_src ? `<img src="${escapeHtml(block.media_src)}" alt="${escapeHtml(block.name || 'Slide illustration')}">` : '';
    const textBox = block.text_box || {};
    const anchor = {ctr:'center', b:'flex-end'}[textBox.anchor] || 'flex-start';
    const inset = value => `${(Number(value || 0) / width * 100).toFixed(3)}cqw`;
    const textStyle = `justify-content:${anchor};padding:${inset(textBox.tIns)} ${inset(textBox.rIns)} ${inset(textBox.bIns)} ${inset(textBox.lIns)}`;
    const text = block.paragraphs || block.rich_paragraphs ? `<div class="json-text" style="${textStyle}">${paragraphHtml(block)}</div>` : '';
    return `<div class="json-object" style="${frame}" aria-label="${escapeHtml(block.name || 'Slide object')}">${shapeHtml(block)}${image}${text}</div>`;
  }

  function renderSlide(slide) {
    const objects = (slide.content || []).filter(block => block.bounds_emu && (block.placeholder || '').toLowerCase() !== 'sldnum');
    return `<div class="json-slide" role="img" aria-label="${escapeHtml(slide.title)}">${[...objects].sort((a, b) => (a.source_order || 0) - (b.source_order || 0)).map(block => renderObject(block)).join('')}</div>`;
  }

  const sourceImage = document.querySelector('[data-slide]');
  const jsonView = document.createElement('div');
  jsonView.className = 'json-slide-view';
  sourceImage.before(jsonView);
  sourceImage.hidden = true;
  const caption = document.querySelector('[data-caption]'), status = document.querySelector('[data-status]'), previous = document.querySelector('[data-prev]'), next = document.querySelector('[data-next]'), form = document.querySelector('[data-jump]'), number = form.querySelector('input'), transcript = document.querySelector('[data-text]'), links = document.querySelector('[data-links]');
  const controls = document.querySelector('.slide-controls');
  const overviewButton = document.createElement('button');
  overviewButton.type = 'button'; overviewButton.textContent = 'Overview'; overviewButton.title = 'Overview (O)';
  const helpButton = document.createElement('button');
  helpButton.type = 'button'; helpButton.textContent = 'Shortcuts'; helpButton.title = 'Keyboard shortcuts (?)';
  controls.append(overviewButton, helpButton);
  const overview = document.createElement('dialog');
  overview.className = 'slide-overview';
  overview.innerHTML = `<header><h2>Slide overview</h2><button type="button" data-close>Close</button></header><div class="overview-grid"></div>`;
  document.body.append(overview);
  const overviewGrid = overview.querySelector('.overview-grid');
  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'overview-item';
    button.innerHTML = `<span>${index + 1}</span><strong>${escapeHtml(slide.title || 'Untitled slide')}</strong>`;
    button.addEventListener('click', () => { overview.close(); go(index + 1); });
    overviewGrid.append(button);
  });
  const help = document.createElement('dialog');
  help.className = 'shortcut-help';
  help.innerHTML = `<header><h2>Keyboard shortcuts</h2><button type="button" data-close>Close</button></header><dl><div><dt>← / →</dt><dd>Previous / next slide</dd></div><div><dt>Home / End</dt><dd>First / last slide</dd></div><div><dt>O</dt><dd>Open slide overview</dd></div><div><dt>G</dt><dd>Go to slide number</dd></div><div><dt>?</dt><dd>Show shortcuts</dd></div><div><dt>Esc</dt><dd>Close overview or help</dd></div></dl>`;
  document.body.append(help);
  overview.querySelector('[data-close]').onclick = () => overview.close();
  help.querySelector('[data-close]').onclick = () => help.close();
  overviewButton.onclick = () => overview.showModal();
  helpButton.onclick = () => help.showModal();
  let current = 1;
  number.max = slides.length;
  document.querySelector('[data-total]').textContent = `of ${slides.length}`;

  function show(index) {
    current = Math.max(1, Math.min(slides.length, index || 1));
    const slide = slides[current - 1];
    number.value = current; previous.disabled = current === 1; next.disabled = current === slides.length;
    caption.textContent = slide.title;
    status.textContent = `Slide ${current} of ${slides.length}${slide.hidden ? ' · Hidden in PowerPoint' : ''}`;
    jsonView.innerHTML = renderSlide(slide);
    for (const text of jsonView.querySelectorAll('.json-text')) {
      let fit = 1;
      while ((text.scrollHeight > text.clientHeight + 1 || text.scrollWidth > text.clientWidth + 1) && fit > .45) {
        fit -= .05;
        text.style.setProperty('--fit', fit.toFixed(2));
      }
    }
    transcript.textContent = slide.text || 'No selectable text on this slide.';
    links.replaceChildren(...slide.links.map(url => { const entry = document.createElement('li'), link = document.createElement('a'); link.href = url; link.textContent = url; entry.append(link); return entry; }));
  }
  function fromHash() { show(Number(location.hash.slice(1).match(/^\d+$/)?.[0])); }
  function go(index) { const target = Math.max(1, Math.min(slides.length, index)); if (target !== current) location.hash = String(target); }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  form.addEventListener('submit', event => { event.preventDefault(); go(number.valueAsNumber); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (overview.open) overview.close(); if (help.open) help.close(); return; }
    if (event.target.closest('input, button, a, summary') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key.toLowerCase() === 'o') { event.preventDefault(); overview.showModal(); return; }
    if (event.key.toLowerCase() === 'g') { event.preventDefault(); number.focus(); number.select(); return; }
    if (event.key === '?') { event.preventDefault(); help.showModal(); return; }
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
