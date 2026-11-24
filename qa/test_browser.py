from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,json,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'work/browser';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
errors=[];missing=[];results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,headless=True)
 context=browser.new_context(viewport={'width':1440,'height':1000})
 context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base) else route.fulfill(status=200,body='',content_type='application/javascript'))
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
 page.goto(base+'index.html#37');page.wait_for_selector('.native-slide:not([hidden])')
 page.locator('[data-action="questions"]').click();assert '37' in page.locator('[data-question-context]').inner_text()
 page.locator('.private-question-notes summary').click();page.locator('[name="studentName"]').fill('QA');page.locator('[name="message"]').fill('<img src=x onerror=alert(1)> SQL question')
 page.locator('#slide-question-form [type="submit"]').click();assert page.locator('.question-entry').count()==1;assert page.locator('.question-entry img').count()==0
 page.reload();page.locator('[data-action="questions"]').click();page.locator('.private-question-notes summary').click();assert page.locator('.question-entry').count()==1
 page.evaluate("location.hash='38'");page.wait_for_function("document.querySelector('[data-question-context]').textContent.includes('38')");assert page.locator('.question-entry').count()==0
 page.evaluate("location.hash='37'");page.wait_for_function("document.querySelectorAll('.question-entry').length===1");page.get_by_text('Remove from this device',exact=True).click();assert page.locator('.question-entry').count()==0
 page.locator('[data-comment-provider="giscus"]').click();assert page.locator('script[data-term="dbms-slide-37"]').count()==1
 page.locator('[data-action="close-questions"]').click();results.append({'questions':'save, reload, slide isolation, removal, escaped text, provider mapping passed; providers mocked'})
 for n in range(1,127):
  page.evaluate('(n)=>{location.hash=String(n)}',n)
  page.wait_for_function('(n)=>document.querySelector("[data-question-context]").textContent.startsWith("Slide "+n+":")',arg=n)
  assert page.locator('.native-slide').inner_text().strip(),n
  if n in [18,37,84,112]:page.screenshot(path=str(OUT/f'sql-{n}.png'))
 results.append({'sql_slides':126})
 # Exercise the complete SQL sequence, including labs and advanced material.
 page.goto(base+'index.html#1');page.wait_for_selector('.native-slide:not([hidden])')
 total=int(page.locator('.counter').inner_text().split('/')[1].split()[0]);dynamic_links=set()
 for i in range(total):
  if i:page.locator('[data-action="next"]').evaluate('(el)=>el.click()')
  dynamic_links.update(page.eval_on_selector_all('.stage a[href]', '(els)=>els.map(e=>e.href)'))
 for url in sorted(dynamic_links):
  if url.startswith(base):
   response=context.request.get(url.split('#')[0]);assert response.ok,(url,response.status)
 results.append({'full_sql_sequence':total,'dynamic_resource_links':len(dynamic_links)})
 # Walk all editable slides via synchronous next handlers and await image decoding.
 for folder in sorted((ROOT/'presentations/editable').iterdir()):
  if not folder.is_dir():continue
  d=json.loads((folder/'deck.json').read_text(encoding='utf-8'));page.goto(base+f'presentations/editable/{folder.name}/index.html');page.wait_for_function("document.querySelector('#status').textContent.length>0")
  broken=[];empty=[]
  for i in range(len(d['slides'])):
   if i:page.locator('#next').evaluate('(el)=>el.click()')
   state=page.evaluate('''async()=>{await Promise.all([...document.querySelectorAll('#body img')].map(i=>i.decode().catch(()=>{})));return {bad:[...document.querySelectorAll('#body img')].filter(i=>!i.naturalWidth).map(i=>i.src),empty:!document.querySelector('#body').textContent.trim()&&!document.querySelector('#body img,#body svg')}}''')
   broken+=state['bad']
   if state['empty']:empty.append(i+1)
   if (folder.name=='db-design' and i+1 in [15,31,68,80]) or (folder.name=='er-v26' and i==55) or (folder.name=='intro' and i==0):page.screenshot(path=str(OUT/f'{folder.name}-{i+1}.png'))
  results.append({'deck':folder.name,'slides':len(d['slides']),'broken_images':sorted(set(broken)),'empty_slides':empty});print(folder.name,len(d['slides']),len(broken),len(empty),flush=True)
 page.goto(base+'mongodb.html');page.wait_for_selector('.advanced-slide:not([hidden])');results.append({'mongodb':'initial render passed'})
 browser.close()
server.shutdown();report={'results':results,'javascript_errors':errors,'http_errors':missing};(OUT/'results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
assert not errors and not missing
assert not any(r.get('broken_images') for r in results)
