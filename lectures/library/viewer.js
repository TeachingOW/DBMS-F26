(() => {
  const slides = window.lectureSlides;
  const image = document.querySelector('[data-slide]');
  const caption = document.querySelector('[data-caption]');
  const status = document.querySelector('[data-status]');
  const previous = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const form = document.querySelector('[data-jump]');
  const number = form.querySelector('input');
  const transcript = document.querySelector('[data-text]');
  const links = document.querySelector('[data-links]');
  let current = 1;

  number.max = slides.length;
  document.querySelector('[data-total]').textContent = `of ${slides.length}`;
  const source = index => `slides/${String(index).padStart(3, '0')}.webp`;

  function show(index) {
    current = Math.max(1, Math.min(slides.length, index || 1));
    const slide = slides[current - 1];
    number.value = current;
    previous.disabled = current === 1;
    next.disabled = current === slides.length;
    caption.textContent = slide.title;
    status.textContent = `Slide ${current} of ${slides.length}${slide.hidden ? ' · Hidden in PowerPoint' : ''}`;
    image.width = slide.width;
    image.height = slide.height;
    image.alt = slide.title;
    image.src = source(current);
    transcript.textContent = slide.text || 'No selectable text on this slide.';
    links.replaceChildren(...slide.links.map(url => {
      const entry = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = url;
      entry.append(link);
      return entry;
    }));
  }

  function fromHash() {
    show(Number(location.hash.slice(1).match(/^\d+$/)?.[0]));
  }

  function go(index) {
    const target = Math.max(1, Math.min(slides.length, index));
    if (target !== current) location.hash = String(target);
  }

  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  form.addEventListener('submit', event => {
    event.preventDefault();
    go(number.valueAsNumber);
  });
  document.addEventListener('keydown', event => {
    if (event.target.closest('input, button, a, summary') || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 1, End: slides.length };
    if (Object.hasOwn(keys, event.key)) {
      event.preventDefault();
      go(keys[event.key]);
    }
  });
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
