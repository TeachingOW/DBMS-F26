(() => {
  const panel = document.querySelector('.questions-panel');
  const form = document.querySelector('#slide-question-form');
  if (!panel || !form) return;

  const storageKey = 'dbms-slide-questions-v1';
  const config = window.DBMS_QUESTIONS_CONFIG || {};
  const contextLabel = panel.querySelector('[data-question-context]');
  const nameInput = form.elements.studentName;
  const typeInput = form.elements.entryType;
  const messageInput = form.elements.message;
  const status = panel.querySelector('[data-question-status]');
  const list = panel.querySelector('[data-question-list]');
  const empty = panel.querySelector('[data-question-empty]');
  const copyDraft = panel.querySelector('[data-question-copy-draft]');
  const copyAll = panel.querySelector('[data-question-copy-all]');
  const sharedContainer = panel.querySelector('[data-shared-comment-container]');
  const sharedStatus = panel.querySelector('[data-shared-comment-status]');
  const providerButtons = [...panel.querySelectorAll('[data-comment-provider]')];
  const countBadges = [...document.querySelectorAll('[data-question-count]')];
  let context = { key: 'slide-1', label: 'Slide 1', hash: '1' };
  let store = loadStore();
  let provider = loadProvider();

  function loadProvider() {
    try {
      const saved = localStorage.getItem('dbms-comment-provider');
      if (saved === 'giscus' || saved === 'disqus') return saved;
    } catch (error) {
      // Browser storage is optional.
    }
    return config.defaultProvider === 'disqus' ? 'disqus' : 'giscus';
  }

  function saveProvider() {
    try {
      localStorage.setItem('dbms-comment-provider', provider);
    } catch (error) {
      // The selected provider still works for the current session.
    }
  }

  function loadStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveStore() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(store));
      return true;
    } catch (error) {
      return false;
    }
  }

  function entries() {
    return Array.isArray(store[context.key]) ? store[context.key] : [];
  }

  function formatEntry(entry) {
    const byline = entry.name ? `${entry.type} from ${entry.name}` : entry.type;
    return `${context.label}\n${byline}\n${entry.message}\n${new Date(entry.createdAt).toLocaleString()}`;
  }

  async function copyText(value, button) {
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        field.remove();
      }
      button.textContent = 'Copied';
    } catch (error) {
      button.textContent = 'Select and copy';
    }
    setTimeout(() => { button.textContent = original; }, 1500);
  }

  function draftText() {
    const type = typeInput.value || 'Question';
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const pageUrl = `${location.href.split('#')[0]}#${context.hash}`;
    return [
      `Slide: ${context.label}`,
      `Link: ${pageUrl}`,
      `Type: ${type}`,
      ...(name ? [`Student: ${name}`] : []),
      '',
      message || '[Write the question or comment here]'
    ].join('\n');
  }

  function giscusConfig() {
    const repo = String(config.githubRepo || '').trim();
    const repoId = String(config.giscusRepoId || '').trim();
    const category = String(config.giscusCategory || '').trim();
    const categoryId = String(config.giscusCategoryId || '').trim();
    const validRepo = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo);
    if (!validRepo || !repoId || !category || !categoryId) return null;
    return { repo, repoId, category, categoryId };
  }

  function loadGiscusDiscussion() {
    const shared = giscusConfig();
    if (!shared) {
      sharedStatus.textContent = 'GitHub discussion is not configured. Choose Guest comments or use the private notes below.';
      return;
    }

    sharedStatus.textContent = `Loading GitHub comments for ${context.label}…`;
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', shared.repo);
    script.setAttribute('data-repo-id', shared.repoId);
    script.setAttribute('data-category', shared.category);
    script.setAttribute('data-category-id', shared.categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', `dbms-${context.key}`);
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.addEventListener('load', () => {
      sharedStatus.textContent = `GitHub discussion for ${context.label}. Sign in with GitHub to participate.`;
    });
    script.addEventListener('error', () => {
      sharedStatus.textContent = 'The GitHub discussion could not be loaded. Check the internet connection and GitHub discussion settings.';
    });
    sharedContainer.appendChild(script);
  }

  function disqusConfig() {
    const shortname = String(config.disqusShortname || '').trim();
    return /^[A-Za-z0-9-]+$/.test(shortname) ? { shortname } : null;
  }

  function discussionUrl() {
    const hosted = /^https?:$/.test(location.protocol)
      ? location.href.split('#')[0]
      : 'https://teachingow.github.io/DBMS-F26/';
    return `${hosted}#${context.hash}`;
  }

  function loadDisqusDiscussion() {
    const shared = disqusConfig();
    if (!shared) {
      sharedStatus.textContent = 'Guest comments need a Disqus shortname. GitHub discussion and private notes are still available.';
      return;
    }

    sharedStatus.textContent = `Loading guest comments for ${context.label}…`;
    const thread = document.createElement('div');
    thread.id = 'disqus_thread';
    sharedContainer.appendChild(thread);
    const setThread = function () {
      this.page.url = discussionUrl();
      this.page.identifier = `dbms-${context.key}`;
      this.page.title = context.label;
    };

    if (window.DISQUS?.reset) {
      window.DISQUS.reset({ reload: true, config: setThread });
      sharedStatus.textContent = `Guest discussion for ${context.label}. Select “I'd rather post as guest” when submitting.`;
      return;
    }

    window.disqus_config = setThread;
    const script = document.createElement('script');
    script.id = 'disqus-embed-script';
    script.src = `https://${shared.shortname}.disqus.com/embed.js`;
    script.async = true;
    script.setAttribute('data-timestamp', String(Date.now()));
    script.addEventListener('load', () => {
      sharedStatus.textContent = `Guest discussion for ${context.label}. Select “I'd rather post as guest” when submitting.`;
    });
    script.addEventListener('error', () => {
      sharedStatus.textContent = 'Guest comments could not be loaded. Check the Disqus shortname and site settings.';
    });
    document.head.appendChild(script);
  }

  function loadSharedDiscussion() {
    if (!sharedContainer || !sharedStatus) return;
    sharedContainer.replaceChildren();
    providerButtons.forEach(button => {
      const active = button.dataset.commentProvider === provider;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (provider === 'disqus') loadDisqusDiscussion();
    else loadGiscusDiscussion();
  }

  function render() {
    contextLabel.textContent = context.label;
    list.replaceChildren();
    const currentEntries = entries();
    empty.hidden = currentEntries.length > 0;
    copyAll.hidden = currentEntries.length === 0;
    countBadges.forEach(badge => {
      badge.textContent = String(currentEntries.length);
      badge.hidden = currentEntries.length === 0;
    });

    currentEntries.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'question-entry';
      const head = document.createElement('div');
      head.className = 'question-entry-head';
      const title = document.createElement('strong');
      title.textContent = entry.name ? `${entry.type} · ${entry.name}` : entry.type;
      const time = document.createElement('time');
      time.dateTime = entry.createdAt;
      time.textContent = new Date(entry.createdAt).toLocaleString();
      head.append(title, time);
      const message = document.createElement('p');
      message.textContent = entry.message;
      const actions = document.createElement('div');
      actions.className = 'question-entry-actions';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = 'Copy';
      copy.addEventListener('click', () => copyText(formatEntry(entry), copy));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove from this device';
      remove.addEventListener('click', () => {
        store[context.key] = entries().filter(candidate => candidate.id !== entry.id);
        saveStore();
        render();
      });
      actions.append(copy, remove);
      article.append(head, message, actions);
      list.appendChild(article);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (!message) {
      status.textContent = 'Write a question or comment first.';
      messageInput.focus();
      return;
    }
    const entry = {
      id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: typeInput.value || 'Question',
      name: nameInput.value.trim(),
      message,
      createdAt: new Date().toISOString()
    };
    store[context.key] = [...entries(), entry];
    const persisted = saveStore();
    messageInput.value = '';
    status.textContent = persisted ? 'Saved on this device.' : 'Saved for this session; browser storage is unavailable.';
    render();
  });

  copyDraft.addEventListener('click', () => copyText(draftText(), copyDraft));
  copyAll.addEventListener('click', () => copyText(entries().map(formatEntry).join('\n\n---\n\n'), copyAll));
  providerButtons.forEach(button => button.addEventListener('click', () => {
    provider = button.dataset.commentProvider;
    saveProvider();
    loadSharedDiscussion();
  }));

  window.addEventListener('dbms:slidechange', event => {
    context = event.detail;
    status.textContent = '';
    render();
    loadSharedDiscussion();
  });

  render();
})();
