"""Extract editable PowerPoint content to JSON and render it in a separate HTML layer.

Uses only Python's standard library and OOXML. The JSON is the content layer; the
generated HTML is the presentation layer. No slide screenshots are generated.
Usage: python scripts/pptx_to_json.py [--input-dir slides]
"""
from __future__ import annotations
import argparse, html, json, re, posixpath
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
        raw=e.get('Target','')
        if e.get('TargetMode')=='External': result[e.get('Id')]=raw
        elif raw.startswith('/'): result[e.get('Id')]=raw.lstrip('/')
        else: result[e.get('Id')]=posixpath.normpath(posixpath.join(str(path.parent),raw))
    return result

def para_text(p):
    out=[]
    for x in p.iter():
        if x.tag in (A+'t',A+'fld'): out.append(x.text or '')
        elif x.tag==A+'br': out.append('\n')
    return ''.join(out).strip()

def text_style(rpr):
    if rpr is None:return {}
    out={k:rpr.get(k) for k in ('b','i','u','sz','baseline','strike') if rpr.get(k) is not None}
    latin=rpr.find('./'+A+'latin')
    if latin is not None and latin.get('typeface'):out['font']=latin.get('typeface')
    fill=rpr.find('./'+A+'solidFill')
    if fill is not None and len(fill):out['color']={'type':fill[0].tag.split('}')[-1],'value':fill[0].get('val')}
    return out

def bullet_marker(ppr):
    if ppr is None:return None
    if ppr.find('./'+A+'buNone') is not None:return {'type':'none'}
    bu=ppr.find('./'+A+'buChar')
    if bu is not None:
        font=ppr.find('./'+A+'buFont')
        out={'type':'char','value':bu.get('char')}
        if font is not None:out['font']=font.get('typeface')
        return out
    auto=ppr.find('./'+A+'buAutoNum')
    if auto is not None:return {'type':'number','scheme':auto.get('type'),'start_at':auto.get('startAt')}
    return None

def slide_bullet_defaults(z, slide_rels):
    """Resolve bullets inherited from the slide layout and master text styles."""
    layout=next((v for v in slide_rels.values() if v.startswith('ppt/slideLayouts/')),None)
    layout_defaults={};master_defaults={};layout_types={}
    if not layout or layout not in z.namelist():return {'layout':layout_defaults,'master':master_defaults,'layout_types':layout_types}
    lr=xml(z,layout)
    for sp in lr.findall('.//'+P+'sp'):
        ph=sp.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph');tx=sp.find('./'+P+'txBody')
        if ph is None or tx is None:continue
        idx=ph.get('idx');ptype=ph.get('type')
        if idx is not None and ptype:layout_types[('idx',idx)]=ptype
        for para in tx.findall('./'+A+'p'):
            pp=para.find('./'+A+'pPr');level=int(pp.get('lvl','0')) if pp is not None else 0;marker=bullet_marker(pp)
            if marker is None:continue
            for key in ([('idx',idx)] if idx is not None else [])+([('type',ptype)] if ptype else []):layout_defaults[(key[0],key[1],level)]=marker
    layout_rel=rels(z,layout)
    master=next((v for v in layout_rel.values() if v.startswith('ppt/slideMasters/')),None)
    if master and master in z.namelist():
        mr=xml(z,master);styles=mr.find('./'+P+'txStyles')
        if styles is not None:
            for style_name in ('bodyStyle','titleStyle','otherStyle'):
                style=styles.find('./'+P+style_name)
                if style is None:continue
                for level in range(1,10):
                    pp=style.find('./'+A+f'lvl{level}pPr');marker=bullet_marker(pp)
                    if marker is not None:master_defaults[(style_name,level-1)]=marker
    return {'layout':layout_defaults,'master':master_defaults,'layout_types':layout_types}

def rich_paragraphs(sh, bullet_defaults=None):
    """Retain run styling such as underlined E/R keys and formatted labels."""
    tx=sh.find('./'+P+'txBody')
    if tx is None:return []
    out=[]
    for p in tx.findall('./'+A+'p'):
        pp=p.find('./'+A+'pPr');level=int(pp.get('lvl','0')) if pp is not None else 0;ph=sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph');para={'text':para_text(p),'level':level,'alignment':pp.get('algn') if pp is not None else None,'runs':[]}
        marker=bullet_marker(pp);source='explicit'
        if marker is None and ph is not None and bullet_defaults:
            idx=ph.get('idx');ptype=ph.get('type') or bullet_defaults['layout_types'].get(('idx',idx))
            keys=([('idx',idx)] if idx is not None else [])+([('type',ptype)] if ptype else [])
            marker=next((bullet_defaults['layout'][(k[0],k[1],level)] for k in keys if (k[0],k[1],level) in bullet_defaults['layout']),None)
            source='layout'
            if marker is None:
                style_name='titleStyle' if ptype in ('title','ctrTitle') else 'bodyStyle' if ptype in (None,'obj','body') else 'otherStyle'
                marker=bullet_defaults['master'].get((style_name,level-1));source='master'
        if marker is None:marker={'type':'none'};source='default'
        para['bullet']={**marker,'source':source}
        if pp is not None:
            para['paragraph_format']={k:int(pp.get(k)) for k in ('marL','marR','indent','defTabSz') if pp.get(k) is not None}
            for spacing in ('spcBef','spcAft','lnSpc'):
                node=pp.find('./'+A+spacing)
                if node is not None and len(node):para['paragraph_format'][spacing]={node[0].tag.split('}')[-1]:node[0].get('val')}
        for r in list(p):
            tag=r.tag.split('}')[-1]
            if tag in ('r','fld'):
                t=r.find('./'+A+'t'); entry={'text':t.text or '' if t is not None else '', 'style':text_style(r.find('./'+A+'rPr'))}
                if tag=='fld':entry['field_type']=r.get('type')
                para['runs'].append(entry)
            elif tag=='br':para['runs'].append({'text':'\n','break':True,'style':text_style(r.find('./'+A+'rPr'))})
        if para['text'] or para['runs']:out.append(para)
    return out

def xfrm_data(sh):
    """Return an object's position in EMU without flattening the original geometry."""
    xfrm=sh.find('./'+P+'spPr/'+A+'xfrm')
    if xfrm is None: xfrm=sh.find('./'+P+'grpSpPr/'+A+'xfrm')
    if xfrm is None: xfrm=sh.find('./'+P+'xfrm')
    if xfrm is None: return None
    off=xfrm.find('./'+A+'off'); ext=xfrm.find('./'+A+'ext')
    if off is None or ext is None: return None
    return {'x':int(off.get('x','0')),'y':int(off.get('y','0')),'width':int(ext.get('cx','0')),'height':int(ext.get('cy','0')),'rotation_60000deg':int(xfrm.get('rot','0')),'flipH':xfrm.get('flipH')=='1','flipV':xfrm.get('flipV')=='1'}

def object_meta(sh, slide_rels=None):
    """Capture drawable OOXML details so ER diagrams can be rebuilt as vectors."""
    tag=sh.tag.split('}')[-1]
    nv=sh.find('.//'+P+'cNvPr')
    meta={'object_type':tag,'shape_id':nv.get('id') if nv is not None else None,'name':nv.get('name','') if nv is not None else '', 'bounds_emu':xfrm_data(sh)}
    if tag=='sp':
        geom=sh.find('./'+P+'spPr/'+A+'prstGeom')
        if geom is not None: meta['geometry']={'type':'preset','name':geom.get('prst'),'adjustments':[x.get('val') for x in geom.findall('./'+A+'avLst/'+A+'gd')]}
        cust=sh.find('./'+P+'spPr/'+A+'custGeom')
        if cust is not None:
            meta['geometry']={'type':'custom','paths':[{'width':p.get('w'),'height':p.get('h'),'commands':[e.tag.split('}')[-1] for e in p.iter() if e is not p]} for p in cust.findall('./'+A+'pathLst/'+A+'path')]}
    elif tag=='cxnSp':
        meta['geometry']={'type':'connector'}
        c=sh.find('./'+P+'nvCxnSpPr/'+P+'cNvCxnSpPr')
        if c is not None: meta['connection']={'start':c.find('./'+A+'stCxn').attrib if c.find('./'+A+'stCxn') is not None else None,'end':c.find('./'+A+'endCxn').attrib if c.find('./'+A+'endCxn') is not None else None}
    elif tag=='pic':
        blip=sh.find('.//'+A+'blip')
        if blip is not None:
            rid=blip.get('{'+R+'}embed'); meta['embedded_media_relationship']=rid
            if slide_rels and rid in slide_rels:meta['embedded_media_target']=slide_rels[rid]
    elif tag=='graphicFrame':
        uri=sh.find('.//'+A+'graphicData')
        if uri is not None: meta['graphic_uri']=uri.get('uri')
    if tag=='grpSp':
        meta['children']=[{'object_type':c.tag.split('}')[-1],**object_meta(c,slide_rels)} for c in list(sh) if c.tag.split('}')[-1] in ('sp','cxnSp','pic','grpSp','graphicFrame')]
    fill=sh.find('./'+P+'spPr/'+A+'solidFill')
    if fill is not None and len(fill):
        color=fill[0]; meta['fill']={'type':color.tag.split('}')[-1], 'value':color.get('val')}
    ln=sh.find('./'+P+'spPr/'+A+'ln')
    if ln is not None:
        line={'width_emu':int(ln.get('w','0'))}; sf=ln.find('./'+A+'solidFill')
        if sf is not None and len(sf):line['color']={'type':sf[0].tag.split('}')[-1],'value':sf[0].get('val')}
        head=ln.find('./'+A+'headEnd');tail=ln.find('./'+A+'tailEnd')
        if head is not None:line['head_end']=head.attrib
        if tail is not None:line['tail_end']=tail.attrib
        meta['line']=line
    return meta

def animation_steps(root):
    """Preserve PowerPoint's ordered animation effects and their target object IDs."""
    timing=root.find('./'+P+'timing')
    if timing is None:return []
    steps=[]
    for node in timing.iter():
        kind=node.tag.split('}')[-1]
        if kind not in ('anim','animEffect','animMotion','animRot','animScale','set','cmd'):continue
        target=node.find('.//'+P+'spTgt')
        behavior=next((e for e in list(node) if e.tag.split('}')[-1] in ('cBhvr','cMediaNode')),None)
        ctn=behavior.find('./'+P+'cTn') if behavior is not None else None
        step={'order':len(steps)+1,'effect':kind,'target_shape_id':target.get('spid') if target is not None else None}
        if kind=='animEffect':step['transition']={k:node.get(k) for k in ('transition','filter') if node.get(k) is not None}
        if kind=='anim':
            attr=node.find('.//'+P+'attrName')
            if attr is not None:step['attribute']=attr.get('val')
        if ctn is not None:
            for k in ('dur','repeatCount','fill','nodeType'):
                if ctn.get(k) is not None:step[k]=ctn.get(k)
        steps.append(step)
    return steps

def shape_content(sh, slide_rels=None, bullet_defaults=None):
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
        return {'kind':'table','name':name,'rows':rows,**object_meta(sh,slide_rels)}
    tx=sh.find('./'+P+'txBody')
    if tx is None:
        if sh.tag.split('}')[-1] in ('sp','cxnSp','pic','grpSp','graphicFrame'): return {'kind':'drawing',**object_meta(sh,slide_rels)}
        return None
    paras=[para_text(p) for p in tx.findall('./'+A+'p')]
    paras=[x for x in paras if x]
    if not paras and sh.tag.split('}')[-1] not in ('sp','cxnSp','pic','grpSp','graphicFrame'):return None
    return {'kind':'text' if paras else 'drawing','name':name,'placeholder':ph_type,'paragraphs':paras,'rich_paragraphs':rich_paragraphs(sh,bullet_defaults),**object_meta(sh,slide_rels)}

def extract(path, include_speaker_notes=True):
  with ZipFile(path) as z:
    pres=xml(z,'ppt/presentation.xml'); pr=rels(z,'ppt/presentation.xml')
    size=pres.find('./'+P+'sldSz'); slides=[]
    for n,item in enumerate(pres.findall('./'+P+'sldIdLst/'+P+'sldId'),1):
      target=pr[item.get(R+'id')]; root=xml(z,target); sp=root.find('./'+P+'cSld/'+P+'spTree')
      blocks=[]; sr=rels(z,target); bullet_defaults=slide_bullet_defaults(z,sr)
      if sp is not None:
        for sh in list(sp)[2:]:
          b=shape_content(sh,sr,bullet_defaults)
          if b:
            b['source_order']=len(blocks)+1
            blocks.append(b)
      title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() in ('title','ctrtile')),None)
      subtitle=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower()=='subtitle'),None)
      if not title: title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() not in ('subtitle','sldnum') and b.get('paragraphs')),f'Slide {n}')
      note=''
      if include_speaker_notes:
        for rel in sr.values():
          if 'notesSlides/notesSlide' in rel and rel in z.namelist():
            nr=xml(z,rel)
            note_parts=[]
            for nsh in nr.findall('.//'+P+'sp'):
              nph=nsh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph')
              if nph is not None and nph.get('type') in ('slidenum','sldNum'):continue
              note_parts.extend(para_text(p) for p in nsh.findall('./'+P+'txBody/'+A+'p') if para_text(p))
            note='\n'.join(note_parts)
            break
      drawings=[b for b in blocks if b.get('object_type') in ('sp','cxnSp','pic','grpSp','graphicFrame')]
      timing=root.find('./'+P+'timing')
      timing_xml=ET.tostring(timing,encoding='unicode') if timing is not None else None
      slide={'number':n,'title':title,'subtitle':subtitle,'hidden':root.get('show') in ('0','false'),'content':blocks,'diagram_objects':drawings,'animation_steps':animation_steps(root),'animation_timing_xml':timing_xml,'speaker_notes':note}
      slides.append(slide)
    return {'schema_version':'1.1','source_file':path.name,'slide_size_emu':{'width':int(size.get('cx')),'height':int(size.get('cy'))} if size is not None else None,'slides':slides}

VIEWER='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deck</title><style>
:root{color-scheme:light;--ink:#14241c;--green:#0b5d3b;--gold:#c7a34a}*{box-sizing:border-box}body{margin:0;background:#e8ece8;color:var(--ink);font:18px/1.5 system-ui,sans-serif}.bar{height:58px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid #c9d2cb}.bar a{color:var(--green)}main{height:calc(100vh - 112px);max-width:1200px;margin:auto;padding:4vh 7vw;display:flex;flex-direction:column;justify-content:center;background:#fff}.eyebrow{font-size:.86rem;color:#51665a}.title{font-size:clamp(2rem,4vw,3.3rem);line-height:1.1;color:var(--green);margin:.2em 0 .6em}.subtitle{font-size:clamp(1.1rem,2vw,1.5rem);line-height:1.35;color:#53645a;margin:-.4em 0 1.1em}.body{font-size:clamp(1.05rem,1.6vw,1.45rem)}.body p{margin:.55em 0}.body ul,.body ol{padding-left:1.35em;margin:.3em 0}.body li{margin:.45em 0}.tbl{border-collapse:collapse;width:100%;font-size:1rem}.tbl td,.tbl th{border:1px solid #9eafa3;padding:.55em;text-align:left}.tbl tr:first-child{background:#e6efe8;font-weight:650}.controls{height:54px;display:flex;align-items:center;justify-content:center;gap:18px}.controls button{font:inherit;padding:5px 15px}.notes{font-size:.9rem;color:#52645a;margin-top:1em}.source-diagram{width:100%;max-height:65vh;background:#fff;border:1px solid #d9e0da}.source-diagram .edge{stroke:#52645a;stroke-width:2;fill:none}.source-diagram text{font:14px system-ui,sans-serif;fill:#14241c}.erd{width:100%;max-height:58vh}.erd .entity{fill:#edf4ef;stroke:#0b5d3b;stroke-width:3}.erd .diamond{fill:#fff8e5;stroke:#9a7824;stroke-width:2}.erd .edge{stroke:#52665a;stroke-width:2}.erd text{font:16px system-ui,sans-serif;fill:#14241c}.erd .ename{font-weight:700;fill:#07583b}.erd .rname{font-size:14px;font-weight:650}.erd .attr{font-size:12px;fill:#43564b}kbd{background:#fff;padding:2px 6px;border:1px solid #ccd4ce}
</style><header class="bar"><a href="../index.html">Course content</a><strong id="deck"></strong><span id="count"></span></header><main><div class="eyebrow" id="eyebrow"></div><h1 class="title" id="title"></h1><p class="subtitle" id="subtitle" hidden></p><article class="body" id="body"></article></main><nav class="controls"><button id="prev">← Previous</button><span id="status"></span><button id="next">Next →</button></nav><script>
fetch('deck.json?v=speaker-notes-9c4eed6').then(r=>r.json()).then(d=>{const requestedSlide=Number(new URLSearchParams(location.search).get('slide'));let i=Number.isFinite(requestedSlide)?Math.max(0,Math.min(d.slides.length-1,Math.floor(requestedSlide)-1)):0;document.title=d.source_file;document.querySelector('#deck').textContent=d.source_file;const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));function renderErd(g){const pos={teams:[80,170],games:[420,120],plays:[790,170],players:[420,410]};let out='<svg class="erd" viewBox="0 0 1000 620" role="img" aria-label="'+esc(g.description)+'">';const anchors={};for(const r of g.relationships){const [x1,y1]=pos[r.from],[x2,y2]=pos[r.to];const mx=(x1+x2)/2,my=(y1+y2)/2;const dy=(r.id==='playing-home'?-24:r.id==='playing-away'?24:0);out+=`<line class="edge" x1="${x1+105}" y1="${y1+48}" x2="${x2+105}" y2="${y2+48}"/>`;const cx=mx+105,cy=my+48+dy;out+=`<polygon class="diamond" points="${cx},${cy-25} ${cx+58},${cy} ${cx},${cy+25} ${cx-58},${cy}"/><text class="rname" text-anchor="middle" x="${cx}" y="${cy+5}">${esc(r.name)}</text>`;if(r.attributes?.length)out+=`<text class="attr" text-anchor="middle" x="${cx}" y="${cy+43}">${esc(r.attributes.join(', '))}</text>`}for(const e of g.entities){const [x,y]=pos[e.id];out+=`<rect class="entity" x="${x}" y="${y}" width="210" height="96" rx="3"/><text class="ename" text-anchor="middle" x="${x+105}" y="${y+27}">${esc(e.name)}</text><text class="attr" text-anchor="middle" x="${x+105}" y="${y+54}">${esc(e.attributes.join(' · '))}</text>`}out+='</svg><p>'+esc(g.notes)+'</p>';return out}function sourceSvg(s){if(!s.diagram_objects?.length)return null;const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=`Extracted source diagram (${s.diagram_objects.length} editable objects; ${s.animation_steps?.length||0} animation effects)`;details.appendChild(summary);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','source-diagram');svg.setAttribute('viewBox','0 0 1280 720');svg.setAttribute('role','img');svg.setAttribute('aria-label','Diagram reconstructed from editable PowerPoint objects');const sw=d.slide_size_emu?.width||12192000,sh=d.slide_size_emu?.height||6858000;for(const o of s.diagram_objects){const b=o.bounds_emu;if(!b||o.object_type==='pic')continue;const x=b.x/sw*1280,y=b.y/sh*720,w=b.width/sw*1280,h=b.height/sh*720,g=o.geometry?.name||'',cx=x+w/2,cy=y+h/2,fill=o.fill?.type==='srgbClr'?'#'+o.fill.value:'none',stroke=o.line?.color?.type==='srgbClr'?'#'+o.line.color.value:'#52645a';let el;if(g==='line'||g==='lineInv'||o.object_type==='cxnSp'){el=document.createElementNS(svg.namespaceURI,'line');el.setAttribute('x1',x);el.setAttribute('y1',y);el.setAttribute('x2',x+w);el.setAttribute('y2',y+h);el.setAttribute('class','edge')}else if(g==='ellipse'){el=document.createElementNS(svg.namespaceURI,'ellipse');el.setAttribute('cx',cx);el.setAttribute('cy',cy);el.setAttribute('rx',w/2);el.setAttribute('ry',h/2);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}else if(g==='diamond'){el=document.createElementNS(svg.namespaceURI,'polygon');el.setAttribute('points',`${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}else{el=document.createElementNS(svg.namespaceURI,'rect');el.setAttribute('x',x);el.setAttribute('y',y);el.setAttribute('width',w);el.setAttribute('height',h);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}svg.appendChild(el);const label=(o.paragraphs||[]).join(' ');if(label){const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',cx);t.setAttribute('y',cy+5);t.setAttribute('text-anchor','middle');t.textContent=label.length>38?label.slice(0,35)+'…':label;svg.appendChild(t)}}details.appendChild(svg);return details}function renderBlock(b){if(b.kind==='table')return '<table class="tbl">'+b.rows.map((r,j)=>'<tr>'+r.map(c=>j===0?'<th>'+esc(c)+'</th>':'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</table>';const ps=b.rich_paragraphs?.length?b.rich_paragraphs:(b.paragraphs||[]).map(text=>({text,bullet:{type:'none'},level:0}));const nodes=[],stack=[];for(const p of ps){const type=p.bullet?.type||'none',text=p.text||'';if(!text.trim())continue;if(type==='char'||type==='number'){const level=Math.max(0,Math.min(8,Number(p.level)||0)),node={type,level,scheme:p.bullet.scheme||'',char:p.bullet.value||'',start:p.bullet.start_at||'',html:esc(text).replace(/\\n/g,'<br>'),children:[]};while(stack.length&&stack[stack.length-1].level>=level)stack.pop();if(level>0&&stack.length)stack[stack.length-1].node.children.push(node);else nodes.push(node);stack.push({level,node})}else{stack.length=0;nodes.push({type:'paragraph',html:esc(text).replace(/\\n/g,'<br>')})}}function renderNodes(items){let out='';for(let i=0;i<items.length;){const n=items[i];if(n.type==='paragraph'){out+='<p>'+n.html+'</p>';i++;continue}let j=i+1;while(j<items.length&&items[j].type===n.type&&items[j].level===n.level&&items[j].scheme===n.scheme)j++;const group=items.slice(i,j),ordered=n.type==='number',tag=ordered?'ol':'ul';let listStyle='';if(ordered){const s=n.scheme.toLowerCase();listStyle=s.includes('roman')?(s.includes('uc')?'upper-roman':'lower-roman'):s.includes('alpha')?(s.includes('uc')?'upper-alpha':'lower-alpha'):'decimal'}else{const c=n.char;listStyle=c==='▪'||c==='■'?'square':c==='○'||c==='◦'?'circle':'disc'}const start=ordered&&n.start?` start="${Number(n.start)||1}"`:'';out+=`<${tag} style="list-style-type:${listStyle}"${start}>`+group.map(item=>'<li>'+item.html+(item.children.length?renderNodes(item.children):'')+'</li>').join('')+`</${tag}>`;i=j}return out}return renderNodes(nodes)}function draw(){let s=d.slides[i];document.querySelector('#eyebrow').textContent=`Slide ${s.number}${s.hidden?' · Hidden in source deck':''}`;document.querySelector('#title').textContent=s.title;const subtitle=document.querySelector('#subtitle');subtitle.textContent=s.subtitle||'';subtitle.hidden=!s.subtitle;document.querySelector('#count').textContent=`${i+1} / ${d.slides.length}`;document.querySelector('#status').textContent=`${i+1} of ${d.slides.length}`;document.querySelector('#body').innerHTML=s.diagram?renderErd(s.diagram):s.content.filter(b=>!['title','ctrtile','subtitle'].includes((b.placeholder||'').toLowerCase())).map(renderBlock).join('');const rawDiagram=sourceSvg(s);if(rawDiagram)document.querySelector('#body').appendChild(rawDiagram);document.querySelector('#prev').disabled=i===0;document.querySelector('#next').disabled=i===d.slides.length-1}function go(n){i=Math.max(0,Math.min(d.slides.length-1,n));draw()}document.querySelector('#prev').onclick=()=>go(i-1);document.querySelector('#next').onclick=()=>go(i+1);document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft')go(i-1)});draw()});</script></html>'''

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--input-dir',type=Path,default=Path(__file__).resolve().parent.parent/'slides');ap.add_argument('--output-dir',type=Path,default=Path(__file__).resolve().parent.parent/'content'/'decks-json');ap.add_argument('--exclude-speaker-notes',action='store_true',help='Omit speaker notes when building a public JSON dataset.');args=ap.parse_args()
 root=args.input_dir.resolve(); out=args.output_dir.resolve(); pres=out.parent.parent/'presentations'/'editable';out.mkdir(parents=True,exist_ok=True);pres.mkdir(parents=True,exist_ok=True)
 is_sql=lambda p: 'sql' in p.stem.lower() and not p.stem.lower().startswith('mysql_')
 sources=[p for p in sorted(root.glob('*.pptx')) if not is_sql(p)]
 sources += [p for p in sorted(root.parent.glob('*.pptx')) if not is_sql(p)]
 # Multiple variant decks are retained as separate sources so no content is silently discarded.
 for src in sources:
   data=extract(src,include_speaker_notes=not args.exclude_speaker_notes); slug=re.sub(r'[^a-z0-9]+','-',src.stem.lower()).strip('-')
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
