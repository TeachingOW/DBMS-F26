(() => {
  const body = document.body;
  const title = body.dataset.title;
  const count = Number(body.dataset.count);
  const assetPath = body.dataset.assets;
  const deckKey = body.dataset.deck;
  const nativeMode = body.dataset.native === 'true';
  const headingFixed = body.dataset.headingFixed === 'true';
  const githubPagesMode = body.dataset.githubPages === 'true';
  const image = document.querySelector('.slide-image');
  const nativeSlide = document.querySelector('.native-slide');
  const labSlide = document.querySelector('.lab-slide');
  const advancedSlide = document.querySelector('.advanced-slide');
  const loading = document.querySelector('.loading');
  const counter = document.querySelector('.counter');
  const progress = document.querySelector('.progress span');
  const overview = document.querySelector('.overview');
  const thumbGrid = document.querySelector('.thumb-grid');
  const help = document.querySelector('.help');
  const labs = document.querySelector('.labs-panel');
  const questions = document.querySelector('.questions-panel');
  const alignedLabList = document.querySelector('.aligned-lab-list');
  const notesPanel = document.querySelector('.slide-notes');
  const notesNumber = document.querySelector('.slide-notes-number');
  const notesTitle = document.querySelector('.slide-notes-title');
  const notesExplanation = document.querySelector('.slide-notes-explanation');
  const notesTakeaway = document.querySelector('.slide-notes-takeaway p');
  const sqlRepro = window.DBMS_SQL_REPRO || {};
  const originalDeck = ((window.DBMS_ORIGINAL_SLIDES && window.DBMS_ORIGINAL_SLIDES[deckKey]) || null);
  const tableCaptionsBySlide = {
    9: ['Product'], 10: ['Product'], 11: ['Product'], 12: ['Product'], 13: ['Product'],
    18: ['Students'],
    24: ['Product (input)', 'Selection result'],
    25: ['Product (input)', 'Projection result'],
    30: ['DISTINCT result', 'Result with duplicates'],
    34: ['Students', 'Enrolled'],
    37: ['Company', 'Product'],
    41: ['Product', 'Company', 'Query result'],
    45: ['Output', 'Table R', 'R × S (cross product)', 'Table S', 'Rows where R.A = S.B'],
    50: ['Product', 'Company', 'Query result'],
    55: ['Multiset X — list form', 'Multiset X — count form'],
    56: ['Multiset X', 'Multiset Y', 'Intersection result Z'],
    57: ['Multiset X', 'Multiset Y', 'Union result Z'],
    64: ['Join result: C ⋈ P'],
    65: ['Join result: C ⋈ P'],
    84: ['Purchase'],
    87: ['FROM and WHERE result'],
    88: ['Rows before grouping', 'Rows grouped by Product'],
    89: ['Grouped rows', 'SELECT result'],
    92: ['Grouped rows', 'HAVING result'],
    112: ['Product', 'Purchase', 'INNER JOIN result'],
    113: ['Product', 'Purchase', 'LEFT OUTER JOIN result']
  };
  const slideNotes = ((window.DBMS_SLIDE_NOTES && window.DBMS_SLIDE_NOTES[deckKey]) || {});
  const advancedSlides = ((window.DBMS_ADVANCED_SLIDES && window.DBMS_ADVANCED_SLIDES[deckKey]) || []);
  const activities = [
    ...((window.DBMS_LABS && window.DBMS_LABS[deckKey]) || []),
    ...((window.DBMS_QUERY_LABS && window.DBMS_QUERY_LABS[deckKey]) || [])
  ]
    .slice()
    .sort((a, b) => a.afterSlide - b.afterSlide);
  const sequence = [];
  let current = 0;
  let thumbsBuilt = false;
  let hideTimer;
  let touchStartX = 0;

  for (let slide = 1; slide <= count; slide += 1) {
    sequence.push({ type: 'slide', slide, key: `slide-${slide}` });
    activities
      .filter(activity => activity.afterSlide === slide)
      .forEach(activity => sequence.push({ type: 'lab', activity, key: `lab-${activity.id}` }));
  }
  advancedSlides.forEach((content, index) => {
    sequence.push({ type: 'content', content, slide: count + index + 1, key: `content-${content.id}` });
  });

  const filename = number => `slide-${String(number).padStart(3, '0')}.png`;
  const srcFor = number => `${assetPath}/${filename(number)}`;
  const indexForSlide = number => sequence.findIndex(item => item.type === 'slide' && item.slide === number);
  const indexForLab = id => sequence.findIndex(item => item.type === 'lab' && item.activity.id === id);
  const indexForContent = number => sequence.findIndex(item => item.type === 'content' && item.slide === number);
  const resourceHref = value => githubPagesMode && value?.startsWith('../') ? value.slice(3) : value;

  function indexFromHash() {
    const value = decodeURIComponent(location.hash.slice(1));
    if (value.startsWith('lab-')) {
      const labIndex = indexForLab(value.slice(4));
      return labIndex >= 0 ? labIndex : 0;
    }
    const requested = Math.max(1, Number(value) || 1);
    if (requested > count) {
      const contentIndex = indexForContent(Math.min(count + advancedSlides.length, requested));
      return contentIndex >= 0 ? contentIndex : sequence.length - 1;
    }
    return Math.max(0, indexForSlide(Math.min(count, requested)));
  }

  function revealControls() {
    body.classList.remove('controls-hidden');
    clearTimeout(hideTimer);
    if (!overview.classList.contains('open') && !help.classList.contains('open') && !labs.classList.contains('open') && !questions?.classList.contains('open')) {
      hideTimer = setTimeout(() => body.classList.add('controls-hidden'), 2800);
    }
  }

  function setHash(item) {
    const hash = item.type === 'lab' ? `#lab-${item.activity.id}` : `#${item.slide}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  function make(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  }

  function activityText(activity) {
    const parts = [activity.title, `${activity.duration} · after slide ${activity.afterSlide}`, '', activity.prompt, '', 'Steps:'];
    activity.steps.forEach((step, index) => parts.push(`${index + 1}. ${step}`));
    (activity.code || []).forEach(block => parts.push('', block.label, block.text));
    if (activity.resource) parts.push('', `Companion resource: ${new URL(activity.resource, location.href).href}`);
    return parts.join('\n');
  }

  function advancedText(content, number) {
    const parts = [`Slide ${number}: ${content.title}`, content.section, '', content.lead, ''];
    content.points.forEach((point, index) => parts.push(`${index + 1}. ${point}`));
    (content.code || []).forEach(block => parts.push('', block.label, block.text));
    parts.push('', `ⓘ Note: ${content.takeaway}`);
    return parts.join('\n');
  }

  async function copyText(value, button) {
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        textarea.remove();
      }
      button.textContent = 'Copied';
    } catch (error) {
      button.textContent = 'Select and copy';
    }
    setTimeout(() => { button.textContent = original; }, 1600);
  }

  function appendGeneralSyntax(container, block) {
    if (!sqlRepro.syntaxInfoFor || (block.language && block.language !== 'sql')) return;
    const info = sqlRepro.syntaxInfoFor(block.text);
    if (!info) return;
    const link = make('a', 'syntax-link', `General syntax: ${info.title} →`);
    link.href = `syntax/${info.slug}.html`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.title = `Open the standalone ${info.title} syntax page`;
    container.appendChild(link);
  }

  function appendDatabaseSetup(container) {
    if (!sqlRepro.setup) return;
    const details = make('details', 'query-setup');
    details.appendChild(make('summary', '', 'Recreate the database for this query'));
    details.appendChild(make(
      'p',
      'query-setup-note',
      `Run this reset script in a fresh ${sqlRepro.dialect || 'SQL'} database, then run the example query. Schema-definition labs may intentionally replace one table.`
    ));
    const pre = make('pre');
    pre.appendChild(make('code', 'language-sql', sqlRepro.setup));
    const actions = make('div', 'query-setup-actions');
    const copy = make('button', 'copy-button', 'Copy database setup');
    copy.type = 'button';
    copy.addEventListener('click', () => copyText(sqlRepro.setup, copy));
    actions.appendChild(copy);
    if (sqlRepro.setupFile) {
      const download = make('a', 'lab-resource', 'Download demo-database.sql');
      download.href = sqlRepro.setupFile;
      download.download = '';
      actions.appendChild(download);
    }
    details.append(pre, actions);
    container.appendChild(details);
  }

  function addShowHeadingButton(container) {
    if (headingFixed) return;
    const button = make('button', 'heading-show-button', 'Show title');
    button.type = 'button';
    button.dataset.action = 'toggle-heading';
    button.setAttribute('aria-label', 'Show the slide title and number');
    container.appendChild(button);
  }

  function makeClickableTitle(value) {
    const heading = make('h1', '', value);
    if (!headingFixed) {
      heading.dataset.action = 'toggle-heading';
      heading.title = 'Click to hide the slide title and number';
      heading.tabIndex = 0;
      heading.setAttribute('role', 'button');
    }
    return heading;
  }

  function renderLectureSlide(number) {
    if (!nativeSlide) return;
    nativeSlide.replaceChildren();
    const sourceSlide = originalDeck?.slides?.[number];
    const note = slideNotes[number] || [
      `SQL concept ${number}`,
      'Read the example by identifying the input table, the requested columns, and the condition applied to each row.',
      'Predict the result columns, rows, duplicates, ordering, and possible NULL values before moving on.'
    ];
    addShowHeadingButton(nativeSlide);

    const heading = make('div', 'native-heading');
    heading.appendChild(make('h1', '', sourceSlide?.title || note[0]));
    nativeSlide.appendChild(heading);

    const sourceContent = make('div', 'source-slide-content');
    const querySamples = [];
    const tableCaptions = tableCaptionsBySlide[number] || [];
    const captionRoots = new Set(tableCaptions.map(caption => caption.split(/\s(?:\(|—|:)/)[0].trim().toLowerCase()));
    let tableIndex = 0;
    (sourceSlide?.elements || []).forEach(element => {
      if (element.kind === 'table' && element.rows?.length) {
        const wrap = make('figure', 'source-table-wrap');
        const caption = tableCaptions[tableIndex] || `Table ${tableIndex + 1}`;
        tableIndex += 1;
        wrap.appendChild(make('figcaption', 'source-table-caption', caption));
        const table = make('table', 'source-table');
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        element.rows[0].forEach(value => headRow.appendChild(make('th', '', value)));
        thead.appendChild(headRow);
        const tbody = document.createElement('tbody');
        element.rows.slice(1).forEach(row => {
          const tr = document.createElement('tr');
          row.forEach(value => tr.appendChild(make('td', '', value)));
          tbody.appendChild(tr);
        });
        table.append(thead, tbody);
        wrap.appendChild(table);
        sourceContent.appendChild(wrap);
        return;
      }

      const paragraphs = (element.paragraphs || []).filter(paragraph => paragraph.text?.trim());
      if (!paragraphs.length) return;
      const text = paragraphs.map(paragraph => paragraph.text).join('\n');
      if (paragraphs.length === 1 && captionRoots.has(text.trim().toLowerCase())) return;
      const isSql = /(^|\n)\s*(SELECT|CREATE|INSERT|UPDATE|DELETE|WITH|EXPLAIN|BEGIN|GRANT|ALTER|DROP)\b/i.test(text);
      const isTableDefinition = /(?:^|\n)\s*[A-Za-z_][\w]*\s*\([^)]*(?::|,|\b(?:string|integer|int|float|decimal|char|varchar|date|timestamp)\b)[^)]*\)/i.test(text);
      const isCreateTable = /(^|\n)\s*CREATE\s+TABLE\b/i.test(text);
      const isBulletGroup = paragraphs.filter(paragraph => paragraph.bullet).length >= Math.ceil(paragraphs.length / 2);
      if (element.kind === 'code' && element.placeholder !== 'body' && isSql) {
        const pre = make('pre', `source-code${isCreateTable ? ' table-definition-code' : ''}`);
        pre.appendChild(make('code', 'language-sql', text));
        const copy = make('button', 'copy-button source-copy', 'Copy code');
        copy.type = 'button';
        copy.addEventListener('click', () => copyText(text, copy));
        const block = make('div', 'source-code-block');
        block.append(pre, copy);
        sourceContent.appendChild(block);
        querySamples.push(text);
      } else if (isBulletGroup) {
        const list = make('ul', 'source-bullets');
        paragraphs.forEach(paragraph => {
          const item = make('li', '', paragraph.text);
          item.dataset.level = String(paragraph.level || 0);
          list.appendChild(item);
        });
        sourceContent.appendChild(list);
      } else {
        const block = make('div', `source-text-block${isTableDefinition ? ' table-definition' : ''}`);
        paragraphs.forEach(paragraph => {
          const p = make('p', '', paragraph.text);
          if (paragraph.level) p.dataset.level = String(paragraph.level);
          block.appendChild(p);
        });
        sourceContent.appendChild(block);
      }
    });
    if (sourceContent.childElementCount) nativeSlide.appendChild(sourceContent);

    if (querySamples.length) {
      const actions = make('div', 'source-slide-actions');
      appendGeneralSyntax(actions, { language: 'sql', text: querySamples.join('\n') });
      const setup = make('a', 'lab-resource', 'Recreate the demo database');
      setup.href = resourceHref(sqlRepro.setupFile || 'demo-database.sql');
      setup.target = '_blank';
      setup.rel = 'noopener';
      actions.appendChild(setup);
      nativeSlide.appendChild(actions);
    }

    if (note[1] || note[2]) {
      const explanation = make('section', 'self-contained-explanation');
      if (note[1]) explanation.appendChild(make('p', '', note[1]));
      if (note[2]) {
        const takeaway = make('p', 'instructor-takeaway');
        takeaway.append(make('strong', '', 'ⓘ Note: '), document.createTextNode(note[2]));
        explanation.appendChild(takeaway);
      }
      nativeSlide.appendChild(explanation);
    }
    const footer = make('footer', 'source-slide-footer');
    const logo = document.createElement('img');
    logo.className = 'source-slide-logo';
    logo.src = resourceHref('assets/brand/suny-old-westbury-logo.svg');
    logo.alt = 'SUNY Old Westbury';
    footer.append(logo, make('p', 'source-slide-number', `${number} / ${count}`));
    nativeSlide.appendChild(footer);
  }

  function renderLab(activity) {
    labSlide.replaceChildren();
    addShowHeadingButton(labSlide);
    const labType = activity.quick ? 'Quick query lab' : 'Aligned lab';
    labSlide.appendChild(make('p', 'lab-kicker', `${labType} · ${activity.duration} · after slide ${activity.afterSlide}`));
    labSlide.appendChild(makeClickableTitle(activity.title));
    labSlide.appendChild(make('p', 'lab-prompt', activity.prompt));

    const demoOutputs = [];
    const demoButtons = [];
    const addCode = (work, block, demo) => {
      work.appendChild(make('h2', '', block.label));
      appendGeneralSyntax(work, block);
      work.appendChild(make('h3', 'query-example-label', 'Concrete example'));
      const pre = make('pre');
      const code = make('code', `language-${block.language || 'text'}`, block.text);
      pre.appendChild(code);
      work.appendChild(pre);
      const copy = make('button', 'copy-button', 'Copy code');
      copy.type = 'button';
      copy.addEventListener('click', () => copyText(block.text, copy));
      const codeActions = make('div', 'lab-code-actions');
      codeActions.appendChild(copy);
      if (demo) {
        const demonstrate = make('button', 'demo-button', 'Show result');
        demonstrate.type = 'button';
        const output = make('pre', 'lab-demo-output');
        output.hidden = true;
        output.appendChild(make('code', '', demo));
        demonstrate.addEventListener('click', () => {
          output.hidden = !output.hidden;
          demonstrate.textContent = output.hidden ? 'Show result' : 'Hide result';
        });
        demoButtons.push(demonstrate);
        demoOutputs.push(output);
        codeActions.appendChild(demonstrate);
        work.append(codeActions, output);
      } else {
        work.appendChild(codeActions);
      }
      appendDatabaseSetup(work);
    };

    const codeBlocks = activity.code || [];
    if (codeBlocks.length === activity.steps.length && codeBlocks.length > 1) {
      const stepList = make('div', 'lab-step-list');
      activity.steps.forEach((step, index) => {
        const row = make('section', 'lab-step');
        const instruction = make('div', 'lab-step-copy');
        instruction.append(make('h2', '', `Step ${index + 1}`), make('p', '', step));
        const work = make('div', 'lab-code');
        addCode(work, codeBlocks[index], activity.demos?.[index]);
        row.append(instruction, work);
        stepList.appendChild(row);
      });
      labSlide.appendChild(stepList);
    } else {
      const layout = make('div', 'lab-layout');
      const instructions = make('section', 'lab-instructions');
      instructions.appendChild(make('h2', '', 'What to do'));
      const steps = make('ol');
      activity.steps.forEach(step => steps.appendChild(make('li', '', step)));
      instructions.appendChild(steps);
      const work = make('section', 'lab-code');
      codeBlocks.forEach((block, index) => addCode(work, block, activity.demos?.[index]));
      layout.append(instructions, work);
      labSlide.appendChild(layout);
    }

    const actions = make('div', 'lab-actions');
    if (demoOutputs.length) {
      const demonstrateAll = make('button', 'demo-button demo-all-button', 'Demonstrate all');
      demonstrateAll.type = 'button';
      demonstrateAll.addEventListener('click', () => {
        const shouldShow = demoOutputs.some(output => output.hidden);
        demoOutputs.forEach((output, index) => {
          output.hidden = !shouldShow;
          demoButtons[index].textContent = shouldShow ? 'Hide result' : 'Show result';
        });
        demonstrateAll.textContent = shouldShow ? 'Hide all results' : 'Demonstrate all';
      });
      actions.appendChild(demonstrateAll);
    }
    const copyActivity = make('button', 'copy-button', 'Copy activity');
    copyActivity.type = 'button';
    copyActivity.addEventListener('click', () => copyText(activityText(activity), copyActivity));
    actions.appendChild(copyActivity);
    if (activity.resource) {
      const resource = make('a', 'lab-resource', 'Open companion lab →');
      resource.href = resourceHref(activity.resource);
      resource.target = '_blank';
      resource.rel = 'noopener';
      actions.appendChild(resource);
    }
    labSlide.appendChild(actions);
  }

  function renderAdvanced(content, number) {
    advancedSlide.replaceChildren();
    addShowHeadingButton(advancedSlide);
    const position = number - count;
    advancedSlide.appendChild(make('p', 'advanced-kicker', `${content.section} · slide ${position} of ${advancedSlides.length}`));
    advancedSlide.appendChild(makeClickableTitle(content.title));
    advancedSlide.appendChild(make('p', 'advanced-lead', content.lead));

    const layout = make('div', `advanced-layout${content.code ? '' : ' advanced-layout-wide'}`);
    const points = make('section', 'advanced-points');
    points.appendChild(make('h2', '', 'How to reason about it'));
    const list = make('ul');
    content.points.forEach(point => list.appendChild(make('li', '', point)));
    points.appendChild(list);
    layout.appendChild(points);

    if (content.code) {
      const work = make('section', 'advanced-code');
      content.code.forEach(block => {
        work.appendChild(make('h2', '', block.label));
        appendGeneralSyntax(work, block);
        work.appendChild(make('h3', 'query-example-label', 'Concrete example'));
        const pre = make('pre');
        pre.appendChild(make('code', `language-${block.language || 'text'}`, block.text));
        work.appendChild(pre);
        const copy = make('button', 'copy-button', 'Copy code');
        copy.type = 'button';
        copy.addEventListener('click', () => copyText(block.text, copy));
        work.appendChild(copy);
        appendDatabaseSetup(work);
      });
      layout.appendChild(work);
    }
    advancedSlide.appendChild(layout);

    const footer = make('div', 'advanced-footer');
    const takeaway = make('p', 'advanced-takeaway');
    takeaway.append(make('strong', '', 'ⓘ Note: '), document.createTextNode(content.takeaway));
    const copySlide = make('button', 'copy-button', 'Copy slide text');
    copySlide.type = 'button';
    copySlide.addEventListener('click', () => copyText(advancedText(content, number), copySlide));
    footer.append(takeaway, copySlide);
    advancedSlide.appendChild(footer);
  }

  function preloadNearby(index) {
    if (nativeMode) return;
    [index - 1, index + 1].forEach(candidate => {
      const item = sequence[candidate];
      if (item && item.type === 'slide') {
        const preload = new Image();
        preload.src = srcFor(item.slide);
      }
    });
  }

  function renderSlideNotes(number) {
    if (!notesPanel) return;
    const note = slideNotes[number];
    notesNumber.textContent = `Slide ${number} of ${count}`;
    notesTitle.textContent = note ? note[0] : `Guide to slide ${number}`;
    notesExplanation.textContent = note ? note[1] : 'Use the slide title, schema, and example rows to identify the query’s input and intended result.';
    notesTakeaway.textContent = note ? note[2] : 'Predict the output columns, rows, duplicates, and possible NULL values before moving on.';
  }

  function syncNotesControls() {
    const visible = body.classList.contains('notes-visible');
    document.querySelectorAll('[data-action="toggle-notes"]').forEach(button => {
      button.setAttribute('aria-pressed', String(visible));
      if (button.classList.contains('notes-close')) button.textContent = visible ? 'Hide' : 'Show';
    });
  }

  function toggleNotes() {
    if (!notesPanel) return;
    body.classList.toggle('notes-visible');
    syncNotesControls();
    revealControls();
  }

  function syncHeadingControls() {
    const hidden = body.classList.contains('slide-heading-hidden');
    document.querySelectorAll('[data-action="toggle-heading"]').forEach(button => {
      button.setAttribute('aria-pressed', String(hidden));
    });
  }

  function toggleHeading() {
    if (headingFixed) {
      body.classList.remove('slide-heading-hidden');
      return;
    }
    body.classList.toggle('slide-heading-hidden');
    syncHeadingControls();
    revealControls();
  }

  function syncCleanControls() {
    const active = body.classList.contains('clean-mode');
    document.querySelectorAll('[data-action="clean-mode"]').forEach(button => {
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? 'Exit clean view' : 'Clean view';
    });
  }

  function toggleCleanMode(force) {
    const active = typeof force === 'boolean' ? force : !body.classList.contains('clean-mode');
    body.classList.toggle('clean-mode', active);
    if (active) closeOverlays();
    syncCleanControls();
    revealControls();
  }

  function showIndex(index, updateHash = true) {
    current = Math.min(sequence.length - 1, Math.max(0, index));
    const item = sequence[current];
    if (item.type === 'slide') {
      body.classList.remove('lab-active');
      labSlide.hidden = true;
      if (advancedSlide) advancedSlide.hidden = true;
      if (nativeMode && nativeSlide) {
        body.classList.add('native-active');
        if (image) image.hidden = true;
        loading.hidden = true;
        renderLectureSlide(item.slide);
        nativeSlide.hidden = false;
        nativeSlide.scrollTop = 0;
      } else {
        body.classList.remove('native-active');
        if (nativeSlide) nativeSlide.hidden = true;
        image.hidden = false;
        loading.hidden = image.src.endsWith(filename(item.slide));
        image.src = srcFor(item.slide);
        image.alt = `${title}, slide ${item.slide} of ${count}`;
        renderSlideNotes(item.slide);
      }
      document.title = `${title} — Slide ${item.slide}`;
    } else if (item.type === 'lab') {
      body.classList.add('native-active');
      body.classList.add('lab-active');
      if (image) image.hidden = true;
      if (nativeSlide) nativeSlide.hidden = true;
      if (advancedSlide) advancedSlide.hidden = true;
      loading.hidden = true;
      renderLab(item.activity);
      labSlide.hidden = false;
      labSlide.scrollTop = 0;
      document.title = `${title} — ${item.activity.title}`;
    } else {
      body.classList.add('native-active');
      body.classList.remove('lab-active');
      if (image) image.hidden = true;
      if (nativeSlide) nativeSlide.hidden = true;
      labSlide.hidden = true;
      loading.hidden = true;
      renderAdvanced(item.content, item.slide);
      advancedSlide.hidden = false;
      advancedSlide.scrollTop = 0;
      document.title = `${title} — ${item.content.title}`;
    }
    counter.textContent = item.type === 'lab'
      ? `${current + 1} / ${sequence.length} · Lab`
      : `${current + 1} / ${sequence.length} · Slide ${item.slide}`;
    progress.style.width = `${((current + 1) / sequence.length) * 100}%`;
    const discussionLabel = item.type === 'slide'
      ? `Slide ${item.slide}: ${originalDeck?.slides?.[item.slide]?.title || slideNotes[item.slide]?.[0] || title}`
      : item.type === 'lab'
        ? `Lab: ${item.activity.title}`
        : `Advanced slide ${item.slide}: ${item.content.title}`;
    const discussionHash = item.type === 'lab' ? `lab-${item.activity.id}` : String(item.slide);
    window.dispatchEvent(new CustomEvent('dbms:slidechange', {
      detail: { key: item.key, label: discussionLabel, hash: discussionHash }
    }));
    syncHeadingControls();
    if (updateHash) setHash(item);
    preloadNearby(current);
    revealControls();
  }

  function goToSlide(number) {
    const index = indexForSlide(Math.min(count, Math.max(1, number)));
    showIndex(index >= 0 ? index : 0);
  }

  function closeOverlays() {
    [overview, help, labs, questions].filter(Boolean).forEach(panel => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });
    revealControls();
  }

  function openOverlay(panel) {
    if (!panel) return;
    closeOverlays();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    body.classList.remove('controls-hidden');
  }

  function toggleOverview() {
    if (overview.classList.contains('open')) {
      closeOverlays();
      return;
    }
    buildOverview();
    openOverlay(overview);
  }

  function buildOverview() {
    if (thumbsBuilt) return;
    sequence.forEach((item, index) => {
      if (item.type === 'slide') {
        const button = make('button', nativeMode ? 'content-tile native-overview-tile' : 'thumb');
        button.type = 'button';
        button.setAttribute('aria-label', `Go to slide ${item.slide}`);
        if (nativeMode) {
          const note = slideNotes[item.slide] || [`SQL concept ${item.slide}`, 'Review the query inputs and expected output.'];
          button.append(
            make('span', 'content-tile-number', `Slide ${item.slide}`),
            make('strong', '', note[0]),
            make('small', '', note[1])
          );
        } else {
          const thumb = make('img');
          thumb.loading = 'lazy';
          thumb.src = srcFor(item.slide);
          thumb.alt = '';
          button.append(thumb, make('span', '', `Slide ${item.slide}`));
        }
        button.addEventListener('click', () => { showIndex(index); closeOverlays(); });
        thumbGrid.appendChild(button);
      } else if (item.type === 'lab') {
        const button = make('button', 'lab-tile');
        button.type = 'button';
        button.append(
          make('strong', '', item.activity.title),
          make('span', '', `${item.activity.duration} · after slide ${item.activity.afterSlide}`)
        );
        button.addEventListener('click', () => { showIndex(index); closeOverlays(); });
        thumbGrid.appendChild(button);
      } else {
        const button = make('button', 'content-tile');
        button.type = 'button';
        button.append(
          make('span', 'content-tile-number', `Slide ${item.slide} · ${item.content.section}`),
          make('strong', '', item.content.title)
        );
        button.addEventListener('click', () => { showIndex(index); closeOverlays(); });
        thumbGrid.appendChild(button);
      }
    });
    thumbsBuilt = true;
  }

  function buildAlignedLabList() {
    if (!alignedLabList) return;
    activities.forEach(activity => {
      const button = make('button', 'lab-nav-item');
      button.type = 'button';
      button.append(
        make('strong', '', activity.title),
        make('span', '', `${activity.duration} · follows slide ${activity.afterSlide}`)
      );
      button.addEventListener('click', () => {
        const index = indexForLab(activity.id);
        if (index >= 0) showIndex(index);
        closeOverlays();
      });
      alignedLabList.appendChild(button);
    });
    const practice = advancedSlides.find(content => content.id === 'advanced-practice');
    if (practice) {
      const number = count + advancedSlides.indexOf(practice) + 1;
      const button = make('button', 'lab-nav-item', '');
      button.type = 'button';
      button.append(
        make('strong', '', practice.title),
        make('span', '', `Advanced practice · slide ${number}`)
      );
      button.addEventListener('click', () => {
        const index = indexForContent(number);
        if (index >= 0) showIndex(index);
        closeOverlays();
      });
      alignedLabList.appendChild(button);
    }
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'next') showIndex(current + 1);
    if (action === 'prev') showIndex(current - 1);
    if (action === 'overview') toggleOverview();
    if (action === 'labs') openOverlay(labs);
    if (action === 'questions') openOverlay(questions);
    if (action === 'help') openOverlay(help);
    if (action === 'toggle-notes') toggleNotes();
    if (action === 'toggle-heading') toggleHeading();
    if (action === 'clean-mode') toggleCleanMode();
    if (action === 'close-overview' || action === 'close-help' || action === 'close-labs' || action === 'close-questions') closeOverlays();
    if (action === 'fullscreen') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    }
    if (action === 'jump-lab') {
      goToSlide(Number(event.target.closest('[data-slide]').dataset.slide));
      closeOverlays();
    }
  });

  document.addEventListener('keydown', event => {
    const interactive = event.target.closest('button, a, input, textarea, select, code');
    if (interactive) return;
    if (event.key.toLowerCase() === 'h') {
      const overlayOpen = overview.classList.contains('open') || help.classList.contains('open') || labs.classList.contains('open') || questions?.classList.contains('open');
      if (overlayOpen) return closeOverlays();
      if (body.classList.contains('clean-mode')) return toggleCleanMode(false);
      return closeOverlays();
    }
    if (event.key === '?') return openOverlay(help);
    if (event.key.toLowerCase() === 'o') return toggleOverview();
    if (event.key.toLowerCase() === 'l') return openOverlay(labs);
    if (event.key.toLowerCase() === 'q') return openOverlay(questions);
    if (event.key.toLowerCase() === 't' && !headingFixed) return toggleHeading();
    if (event.key.toLowerCase() === 'n' && !nativeMode) return toggleNotes();
    if (event.key.toLowerCase() === 'p') return toggleCleanMode();
    if (event.key.toLowerCase() === 'f') return document.querySelector('[data-action="fullscreen"]').click();
    if (overview.classList.contains('open') || help.classList.contains('open') || labs.classList.contains('open') || questions?.classList.contains('open')) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key)) { event.preventDefault(); showIndex(current + 1); }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) { event.preventDefault(); showIndex(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); showIndex(0); }
    if (event.key === 'End') { event.preventDefault(); showIndex(sequence.length - 1); }
  });

  document.addEventListener('mousemove', revealControls);
  document.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; revealControls(); }, { passive: true });
  document.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 55) showIndex(current + (distance < 0 ? 1 : -1));
  }, { passive: true });
  if (image) {
    image.addEventListener('load', () => { loading.hidden = true; });
    image.addEventListener('error', () => {
      loading.hidden = false;
      loading.textContent = 'Slide image could not be loaded.';
    });
  }
  window.addEventListener('hashchange', () => showIndex(indexFromHash(), false));

  buildAlignedLabList();
  syncNotesControls();
  syncHeadingControls();
  syncCleanControls();
  current = indexFromHash();
  showIndex(current, false);
})();
