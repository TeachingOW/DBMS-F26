/* Shared code-copy behavior for student handouts. */
(() => {
  window.hljs?.highlightAll();
  document.querySelectorAll('[data-copy-code]').forEach(button => button.addEventListener('click', async () => {
    const code = button.closest('.code-block-wrapper')?.querySelector('code');
    if (!code) return;
    const label = button.innerHTML;
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent='Copied';
    } catch {
      const range=document.createRange();range.selectNodeContents(code);
      const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
      button.textContent='Selected — copy now';
    }
    setTimeout(()=>{button.innerHTML=label;},1800);
  }));
})();
