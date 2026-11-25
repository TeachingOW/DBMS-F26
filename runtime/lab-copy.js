document.querySelectorAll('button.copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-target');
        const code = document.getElementById(id).textContent;
        try{
          await navigator.clipboard.writeText(code);
          btn.innerText = 'Copied!';
          setTimeout(()=> btn.innerText = 'Copy Commands',1200);
        }catch(e){alert('Copy failed');}
      });
    });
