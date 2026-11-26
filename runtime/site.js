/* Bootstrap a stable course URL from JSON. No course prose lives in this file. */
(() => {
  const root = new URL('../', document.currentScript.src);
  const asset = path => new URL(path, root).href;
  const loaded = new Set();
  async function json(path) {
    const response = await fetch(asset(path));
    if (!response.ok) throw new Error(`Cannot load ${path} (${response.status})`);
    return response.json();
  }
  function element(node, svg = false) {
    if (typeof node === 'string') return document.createTextNode(node);
    if (!node || !/^[a-z][a-z0-9-]*$/i.test(node.tag)) throw new Error('Invalid content node');
    if (['script', 'iframe', 'object', 'embed', 'base'].includes(node.tag)) throw new Error('Executable content is not allowed');
    const isSvg = svg || node.tag === 'svg';
    const el = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', node.tag) : document.createElement(node.tag);
    for (const [key, value] of Object.entries(node.attrs || {})) {
      if (/^on/i.test(key) || key === 'srcdoc' || (/^(href|src|action)$/i.test(key) && /^\s*javascript:/i.test(value))) continue;
      el.setAttribute(key, String(value));
    }
    for (const child of node.children || []) el.append(element(child, isSvg && node.tag !== 'foreignObject'));
    return el;
  }
  function script(path) {
    if (loaded.has(path)) return Promise.resolve();
    loaded.add(path);
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = asset(path); el.async = false;
      el.onload = resolve;
      el.onerror = () => reject(new Error(`Cannot load renderer ${path}`));
      document.body.append(el);
    });
  }
  async function start() {
    const manifest = await json('content/site.json');
    let route = decodeURIComponent(location.pathname.slice(root.pathname.length));
    if (!route || route.endsWith('/')) route += 'index.html';
    const config = manifest.routes[route];
    if (!config) throw new Error(`No course page is registered for ${route}`);
    const [page, datasets] = await Promise.all([
      json(config.document), Promise.all((config.data || []).map(json))
    ]);
    for (const data of datasets) {
      for (const [key, value] of Object.entries(data)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new Error('Invalid data key');
        window[key] = value;
      }
    }
    // Downloads remain real SQL files. Inline copy controls read those same files.
    for (const key of ['DBMS_SQL_REPRO', 'DBMS_LAB_SETUP']) {
      const fixture = window[key];
      if (fixture?.setupFile) {
        const response = await fetch(asset(fixture.setupFile));
        if (!response.ok) throw new Error(`Cannot load SQL fixture ${fixture.setupFile}`);
        fixture.setup = await response.text();
      }
    }
    document.title = page.title;
    for (const attribute of [...document.body.attributes]) document.body.removeAttribute(attribute.name);
    for (const [key,value] of Object.entries(page.bodyAttributes || {})) document.body.setAttribute(key,value);
    const sheets = (config.styles || []).map(path => new Promise((resolve, reject) => {
      const link=document.createElement('link');link.rel='stylesheet';link.href=asset(path);
      link.onload=resolve;link.onerror=()=>new URL(link.href).origin===root.origin ? reject(new Error(`Cannot load styles ${path}`)) : resolve();document.head.append(link);
    }));
    document.body.replaceChildren(...page.nodes.map(node => element(node)));
    for (const link of document.querySelectorAll('a[href$=".pptx"]')) {
      const filename = link.getAttribute('href').split('/').pop();
      link.href = asset(`lectures/powerpoint/${filename}`);
    }
    window.DBMS_PAGE = {...config, rootUrl:root.href, deckUrl:config.deck ? asset(config.deck) : null};
    await Promise.all(sheets);
    for (const path of config.scripts || []) {
      try { await script(path); } catch (error) {
        if (new URL(asset(path)).origin === root.origin) throw error;
        console.warn('Optional external enhancement unavailable:', path);
      }
    }
    document.documentElement.dataset.courseReady='true';
    window.dispatchEvent(new Event('dbms:ready'));
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }
  start().catch(error => {
    document.documentElement.dataset.courseError='true';
    const panel=document.createElement('section');panel.setAttribute('role','alert');
    const title=document.createElement('h1');title.textContent='Course materials could not load';
    const detail=document.createElement('p');detail.textContent=error.message;
    const retry=document.createElement('button');retry.textContent='Retry';retry.onclick=()=>location.reload();
    panel.append(title,detail,retry);document.body.prepend(panel);console.error(error);
  });
})();
