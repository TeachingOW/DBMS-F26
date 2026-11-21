"""Extract editable PowerPoint content to JSON and render it in a separate HTML layer.

Uses only Python's standard library and OOXML. The JSON is the content layer; the
generated HTML is the presentation layer. No slide screenshots are generated.
Usage: python scripts/pptx_to_json.py [--input-dir slides]
"""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET
from zipfile import ZipFile

P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'

# Hand-authored concept data is intentionally separate from extracted OOXML text.
# It can be revised without editing the PowerPoint or presentation renderer.
DIAGRAMS = {
    ('er-v26-with-labs', 56): {
        'type': 'erd',
        'description': 'Simplified football season model',
        'entities': [
            {'id':'teams','name':'Teams','attributes':['Team ID']},
            {'id':'players','name':'Players','attributes':['Player ID','name']},
            {'id':'games','name':'Games','attributes':['date','location']},
            {'id':'plays','name':'Plays','attributes':['Play ID','Yardage Diff','Touchdown']},
        ],
        'relationships': [
            {'id':'member-of','name':'MemberOf','from':'players','to':'teams','cardinality':'A player belongs to one team (no trades).'},
            {'id':'playing-home','name':'PlayingHome','from':'games','to':'teams','cardinality':'A game has a home team; a team can play repeatedly.'},
            {'id':'playing-away','name':'PlayingAway','from':'games','to':'teams','cardinality':'A game has an away team; a team can play repeatedly.'},
            {'id':'occur-in','name':'OccurIn','from':'plays','to':'games','cardinality':'A play occurs in one game.'},
            {'id':'participate-in','name':'ParticipateIn','from':'players','to':'plays','cardinality':'A play has one or more player participants.' ,'attributes':['Participation Type']},
        ],
        'notes':'A play is a run by one player or a pass involving a passer and receiver. The source does not specify all participation cardinalities; confirm whether a play has exactly one runner or one passer and one receiver.'
    }
}

def xml(z, name): return ET.fromstring(z.read(name))
def rels(z, name):
    path = PurePosixPath(name); relpath = str(path.parent / '_rels' / (path.name + '.rels'))
    if relpath not in z.namelist(): return {}
    root=xml(z,relpath)
    result={}
    for e in root:
        target=PurePosixPath(e.get('Target'))
        result[e.get('Id')]=str((target if target.is_absolute() else path.parent/target).as_posix()).lstrip('/')
    return result

def para_text(p):
    out=[]
    for x in p.iter():
        if x.tag in (A+'t',A+'fld'): out.append(x.text or '')
        elif x.tag==A+'br': out.append('\n')
    return ''.join(out).strip()

def shape_content(sh):
    nv=sh.find('./'+P+'nvSpPr/'+P+'cNvPr')
    if nv is None: nv=sh.find('./'+P+'nvGraphicFramePr/'+P+'cNvPr')
    name=nv.get('name','') if nv is not None else ''
    ph=sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph')
    ph_type=ph.get('type','') if ph is not None else ''
    tbl=sh.find('.//'+A+'tbl')
    if tbl is not None:
        rows=[]
        for tr in tbl.findall('./'+A+'tr'):
            rows.append([ '\n'.join(filter(None,(para_text(p) for p in tc.findall('.//'+A+'p'))) ) for tc in tr.findall('./'+A+'tc')])
        return {'kind':'table','name':name,'rows':rows}
    tx=sh.find('./'+P+'txBody')
    if tx is None: return None
    paras=[para_text(p) for p in tx.findall('./'+A+'p')]
    paras=[x for x in paras if x]
    if not paras:return None
    return {'kind':'text','name':name,'placeholder':ph_type,'paragraphs':paras}

def extract(path):
  with ZipFile(path) as z:
    pres=xml(z,'ppt/presentation.xml'); pr=rels(z,'ppt/presentation.xml')
    size=pres.find('./'+P+'sldSz'); slides=[]
    for n,item in enumerate(pres.findall('./'+P+'sldIdLst/'+P+'sldId'),1):
      target=pr[item.get(R+'id')]; root=xml(z,target); sp=root.find('./'+P+'cSld/'+P+'spTree')
      blocks=[]
      if sp is not None:
        for sh in list(sp)[2:]:
          b=shape_content(sh)
          if b: blocks.append(b)
      title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and b.get('placeholder')=='title'),None)
      if not title: title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text'),f'Slide {n}')
      note=''
      sr=rels(z,target)
      for rel in sr.values():
        if 'notesSlides/notesSlide' in rel and rel in z.namelist():
          nr=xml(z,rel)
          note='\n'.join(t for sh in nr.findall('.//'+P+'sp') for p in sh.findall('./'+P+'txBody/'+A+'p') for t in [para_text(p)] if t and not sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph') is not None and sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph').get('type') not in ('slidenum','sldNum'))
          break
      slide={'number':n,'title':title,'hidden':root.get('show') in ('0','false'),'content':blocks,'speaker_notes':note}
      slides.append(slide)
    return {'schema_version':'1.0','source_file':path.name,'source_path':str(path.resolve()),'slide_size_emu':{'width':int(size.get('cx')),'height':int(size.get('cy'))} if size is not None else None,'slides':slides}

VIEWER='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deck</title><style>
:root{color-scheme:light;--ink:#14241c;--green:#0b5d3b;--gold:#c7a34a}*{box-sizing:border-box}body{margin:0;background:#e8ece8;color:var(--ink);font:18px/1.5 system-ui,sans-serif}.bar{height:58px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid #c9d2cb}.bar a{color:var(--green)}main{height:calc(100vh - 112px);max-width:1200px;margin:auto;padding:4vh 7vw;display:flex;flex-direction:column;justify-content:center;background:#fff}.eyebrow{font-size:.86rem;color:#51665a}.title{font-size:clamp(2rem,4vw,3.3rem);line-height:1.1;color:var(--green);margin:.2em 0 .6em}.body{font-size:clamp(1.05rem,1.6vw,1.45rem)}.body ul{padding-left:1.3em}.body li{margin:.45em 0}.tbl{border-collapse:collapse;width:100%;font-size:1rem}.tbl td,.tbl th{border:1px solid #9eafa3;padding:.55em;text-align:left}.tbl tr:first-child{background:#e6efe8;font-weight:650}.controls{height:54px;display:flex;align-items:center;justify-content:center;gap:18px}.controls button{font:inherit;padding:5px 15px}.notes{font-size:.9rem;color:#52645a;margin-top:1em}.erd{width:100%;max-height:58vh}.erd .entity{fill:#edf4ef;stroke:#0b5d3b;stroke-width:3}.erd .diamond{fill:#fff8e5;stroke:#9a7824;stroke-width:2}.erd .edge{stroke:#52665a;stroke-width:2}.erd text{font:16px system-ui,sans-serif;fill:#14241c}.erd .ename{font-weight:700;fill:#07583b}.erd .rname{font-size:14px;font-weight:650}.erd .attr{font-size:12px;fill:#43564b}kbd{background:#fff;padding:2px 6px;border:1px solid #ccd4ce}
</style><header class="bar"><a href="../index.html">Course content</a><strong id="deck"></strong><span id="count"></span></header><main><div class="eyebrow" id="eyebrow"></div><h1 class="title" id="title"></h1><article class="body" id="body"></article><div class="notes" id="notes"></div></main><nav class="controls"><button id="prev">← Previous</button><span id="status"></span><button id="next">Next →</button><button id="notesToggle">Speaker notes</button></nav><script>
fetch('deck.json').then(r=>r.json()).then(d=>{let i=0,notes=false;document.title=d.source_file;document.querySelector('#deck').textContent=d.source_file;const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));function renderErd(g){const pos={teams:[80,170],games:[420,120],plays:[790,170],players:[420,410]};let out='<svg class="erd" viewBox="0 0 1000 620" role="img" aria-label="'+esc(g.description)+'">';const anchors={};for(const r of g.relationships){const [x1,y1]=pos[r.from],[x2,y2]=pos[r.to];const mx=(x1+x2)/2,my=(y1+y2)/2;const dy=(r.id==='playing-home'?-24:r.id==='playing-away'?24:0);out+=`<line class="edge" x1="${x1+105}" y1="${y1+48}" x2="${x2+105}" y2="${y2+48}"/>`;const cx=mx+105,cy=my+48+dy;out+=`<polygon class="diamond" points="${cx},${cy-25} ${cx+58},${cy} ${cx},${cy+25} ${cx-58},${cy}"/><text class="rname" text-anchor="middle" x="${cx}" y="${cy+5}">${esc(r.name)}</text>`;if(r.attributes?.length)out+=`<text class="attr" text-anchor="middle" x="${cx}" y="${cy+43}">${esc(r.attributes.join(', '))}</text>`}for(const e of g.entities){const [x,y]=pos[e.id];out+=`<rect class="entity" x="${x}" y="${y}" width="210" height="96" rx="3"/><text class="ename" text-anchor="middle" x="${x+105}" y="${y+27}">${esc(e.name)}</text><text class="attr" text-anchor="middle" x="${x+105}" y="${y+54}">${esc(e.attributes.join(' · '))}</text>`}out+='</svg><p>'+esc(g.notes)+'</p>';return out}function draw(){let s=d.slides[i];document.querySelector('#eyebrow').textContent=`Slide ${s.number}${s.hidden?' · Hidden in source deck':''}`;document.querySelector('#title').textContent=s.title;document.querySelector('#count').textContent=`${i+1} / ${d.slides.length}`;document.querySelector('#status').textContent=`${i+1} of ${d.slides.length}`;document.querySelector('#body').innerHTML=s.diagram?renderErd(s.diagram):s.content.map(b=>b.kind==='table'?'<table class="tbl">'+b.rows.map((r,j)=>'<tr>'+r.map(c=>j===0?'<th>'+esc(c)+'</th>':'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</table>':'<ul>'+b.paragraphs.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ul>').join('');document.querySelector('#notes').hidden=!notes;document.querySelector('#notes').textContent=notes?(s.speaker_notes||'No speaker notes on this slide.'):' ';document.querySelector('#prev').disabled=i===0;document.querySelector('#next').disabled=i===d.slides.length-1}function go(n){i=Math.max(0,Math.min(d.slides.length-1,n));draw()}document.querySelector('#prev').onclick=()=>go(i-1);document.querySelector('#next').onclick=()=>go(i+1);document.querySelector('#notesToggle').onclick=()=>{notes=!notes;draw()};document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft')go(i-1)});draw()});</script></html>'''

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--input-dir',type=Path,default=Path(__file__).resolve().parent.parent/'slides');ap.add_argument('--output-dir',type=Path,default=Path(__file__).resolve().parent.parent/'content'/'decks-json');args=ap.parse_args()
 root=args.input_dir.resolve(); out=args.output_dir.resolve(); pres=out.parent.parent/'presentations'/'editable';out.mkdir(parents=True,exist_ok=True);pres.mkdir(parents=True,exist_ok=True)
 is_sql=lambda p: 'sql' in p.stem.lower() and not p.stem.lower().startswith('mysql_')
 sources=[p for p in sorted(root.glob('*.pptx')) if not is_sql(p)]
 sources += [p for p in sorted(root.parent.glob('*.pptx')) if not is_sql(p)]
 # Multiple variant decks are retained as separate sources so no content is silently discarded.
 for src in sources:
   data=extract(src); slug=re.sub(r'[^a-z0-9]+','-',src.stem.lower()).strip('-')
   for slide in data['slides']:
     diagram=DIAGRAMS.get((slug,slide['number']))
     if diagram: slide['diagram']=diagram
   (out/f'{slug}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
   dest=pres/slug;dest.mkdir(exist_ok=True)
   (dest/'deck.json').write_text(json.dumps(data,ensure_ascii=False)+'\n',encoding='utf-8')
   (dest/'index.html').write_text(VIEWER,encoding='utf-8')
   print(f'{src.name}: {len(data["slides"])} slides -> {slug}')
 index='<!doctype html><meta charset="utf-8"><title>Editable course presentations</title><h1>Editable course presentations</h1><p>Content is stored as JSON; these HTML decks render text and tables without slide screenshots.</p><ul>'
 for d in sorted(pres.iterdir()):
   if d.is_dir():index+=f'<li><a href="{d.name}/index.html">{html.escape(d.name.replace("-"," "))}</a></li>'
 (pres/'index.html').write_text(index+'</ul>',encoding='utf-8')
if __name__=='__main__':main()
