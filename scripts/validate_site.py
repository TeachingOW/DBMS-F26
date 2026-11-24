"""Check public HTML links, editable deck mirrors/media and publication boundaries."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
ROOT=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self): super().__init__(); self.links=[]; self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.add(a['id'])
  for key in ('href','src','poster'):
   if a.get(key): self.links.append(a[key])
def walk(x):
 if isinstance(x,dict):
  yield x
  for v in x.values(): yield from walk(v)
 elif isinstance(x,list):
  for v in x: yield from walk(v)
def validate():
 errors=[];external=set();pages={};media=set();slides=0
 for p in ROOT.rglob('*.html'):
  if p.relative_to(ROOT).as_posix().startswith(('scripts/templates/', 'content/legacy-overrides/')):continue
  if any(x in p.relative_to(ROOT).parts for x in ('.git','work','node_modules','__pycache__')):continue
  parser=Links();parser.feed(p.read_text(encoding='utf-8'));pages[p.resolve()]=parser
 for p,parser in pages.items():
  for link in parser.links:
   u=urlsplit(link)
   if u.scheme or u.netloc:
    if u.scheme in ('https','http'):external.add(link)
    continue
   if not u.path:continue # dynamic slide hashes are not HTML IDs
   target=(ROOT/u.path.lstrip('/') if u.path.startswith('/') else p.parent/unquote(u.path)).resolve()
   if target.is_dir():target=target/'index.html'
   if not target.exists(): errors.append(f'{p.relative_to(ROOT)}: missing {link}')
   elif u.fragment and target in pages and not u.fragment.isdigit() and u.fragment not in pages[target].ids:
    errors.append(f'{p.relative_to(ROOT)}: missing anchor {link}')
 for p in (ROOT/'content/decks-json').glob('*.json'):
  d=json.loads(p.read_text(encoding='utf-8'));folder=ROOT/'presentations/editable'/p.stem
  if d!=json.loads((folder/'deck.json').read_text(encoding='utf-8')):errors.append(f'{p.name}: mirror mismatch')
  slides+=len(d['slides'])
  for obj in walk(d):
   if obj.get('media_src'):
    m=folder/obj['media_src'];media.add(m)
    if not m.is_file():errors.append(f'{p.name}: missing {obj["media_src"]}')
 for f in ('instructor-guide.html','programming.sql','reference-queries.sql'):
  if (ROOT/'labs/semester'/f).exists():errors.append(f'Excluded solution present: {f}')
 generator=(ROOT/'scripts/build-course-plan.py').read_text(encoding='utf-8')
 if "GUIDE='''" in generator or "OUT/'instructor-guide.html'" in generator:errors.append('Generator embeds instructor guide')
 return {'html_pages':len(pages),'editable_slides':slides,'referenced_media':len(media),'external_links':sorted(external),'errors':sorted(set(errors))}
if __name__=='__main__':
 result=validate();print(json.dumps(result,indent=2));raise SystemExit(bool(result['errors']))
