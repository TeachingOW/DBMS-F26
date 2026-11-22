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

def theme_palette(z, presentation_rels):
    theme=next((v for v in presentation_rels.values() if v.startswith('ppt/theme/')),None)
    if not theme or theme not in z.namelist():return {}
    root=xml(z,theme);scheme=root.find('.//'+A+'clrScheme')
    if scheme is None:return {}
    palette={}
    for entry in list(scheme):
        if not len(entry):continue
        color=entry[0];palette[entry.tag.split('}')[-1]]=color.get('val') or color.get('lastClr')
    return palette

def normalize_symbols(text):
    mapping={'\uf0e0':'→','\uf0cd':'⊆','\uf0c7':'∩','\uf0c6':'∅','\uf0c8':'∪','\uf0b9':'¹','\uf0b2':'²','\uf0d7':'×','\uf0e8':'→'}
    text=text.translate(str.maketrans(mapping))
    return re.sub(r'\s*-+\s*>\s*',' → ',text)

def para_text(p):
    out=[]
    for x in p.iter():
        if x.tag in (A+'t',A+'fld'): out.append(x.text or '')
        elif x.tag==A+'br': out.append('\n')
    return normalize_symbols(''.join(out).strip())

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
                t=r.find('./'+A+'t'); entry={'text':normalize_symbols(t.text or '') if t is not None else '', 'style':text_style(r.find('./'+A+'rPr'))}
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
    """Capture a reusable, slide-independent description of an editable OOXML object."""
    tag=sh.tag.split('}')[-1]
    nv=sh.find('.//'+P+'cNvPr')
    meta={'object_type':tag,'shape_id':nv.get('id') if nv is not None else None,'name':nv.get('name','') if nv is not None else '', 'bounds_emu':xfrm_data(sh)}
    # Keep object ordering and text-box behavior so a later renderer can place the
    # same object on a proportional slide canvas rather than guessing a new layout.
    body=sh.find('./'+P+'txBody/'+A+'bodyPr')
    if body is not None:
        meta['text_box']={k:body.get(k) for k in ('vert','wrap','anchor','lIns','rIns','tIns','bIns','rot') if body.get(k) is not None}
        meta['text_box']['auto_fit']=next((c.tag.split('}')[-1] for c in body if c.tag.split('}')[-1] in ('noAutofit','spAutoFit','normAutofit')),None)
    if tag=='sp':
        geom=sh.find('./'+P+'spPr/'+A+'prstGeom')
        if geom is not None: meta['geometry']={'type':'preset','name':geom.get('prst'),'adjustments':[x.get('val') for x in geom.findall('./'+A+'avLst/'+A+'gd')]}
        cust=sh.find('./'+P+'spPr/'+A+'custGeom')
        if cust is not None:
            meta['geometry']={'type':'custom',
                'guides':[{'name':g.get('name'),'formula':g.get('fmla')} for g in cust.findall('./'+A+'avLst/'+A+'gd')],
                'paths':[{'width':p.get('w'),'height':p.get('h'),
                          'commands':[{'op':e.tag.split('}')[-1],**e.attrib,
                                       'points':[pt.attrib for pt in e.findall('./'+A+'pt')]}
                                      for e in list(p)]}
                         for p in cust.findall('./'+A+'pathLst/'+A+'path')]}
    elif tag=='cxnSp':
        meta['geometry']={'type':'connector'}
        c=sh.find('./'+P+'nvCxnSpPr/'+P+'cNvCxnSpPr')
        if c is not None: meta['connection']={'start':c.find('./'+A+'stCxn').attrib if c.find('./'+A+'stCxn') is not None else None,'end':c.find('./'+A+'endCxn').attrib if c.find('./'+A+'endCxn') is not None else None}
    elif tag=='pic':
        blip=sh.find('.//'+A+'blip')
        if blip is not None:
            rid=blip.get(R+'embed'); meta['embedded_media_relationship']=rid
            if slide_rels and rid in slide_rels:meta['embedded_media_target']=slide_rels[rid]
    elif tag=='graphicFrame':
        uri=sh.find('.//'+A+'graphicData')
        if uri is not None: meta['graphic_uri']=uri.get('uri')
    if tag=='grpSp':
        xf=sh.find('./'+P+'grpSpPr/'+A+'xfrm')
        if xf is not None:
            def xy(node): return {'x':int(node.get('x','0')),'y':int(node.get('y','0'))} if node is not None else None
            def wh(node): return {'width':int(node.get('cx','0')),'height':int(node.get('cy','0'))} if node is not None else None
            meta['group_transform']={'off':xy(xf.find('./'+A+'off')),'ext':wh(xf.find('./'+A+'ext')),'child_off':xy(xf.find('./'+A+'chOff')),'child_ext':wh(xf.find('./'+A+'chExt')),'rotation_60000deg':int(xf.get('rot','0')),'flipH':xf.get('flipH')=='1','flipV':xf.get('flipV')=='1'}
        meta['children']=[{'object_type':c.tag.split('}')[-1],**object_meta(c,slide_rels)} for c in list(sh) if c.tag.split('}')[-1] in ('sp','cxnSp','pic','grpSp','graphicFrame')]
    fill=sh.find('./'+P+'spPr/'+A+'solidFill')
    def color_meta(node):
        if node is None or not len(node):return None
        color=node[0];out={'type':color.tag.split('}')[-1],'value':color.get('val') or color.get('lastClr')}
        for child in color:
            key=child.tag.split('}')[-1]
            if key in ('alpha','lumMod','lumOff'):out[key]=int(child.get('val','100000'))
        return out
    if fill is not None and len(fill):
        meta['fill']=color_meta(fill)
    elif sh.find('./'+P+'spPr/'+A+'noFill') is not None:
        meta['fill']={'type':'none'}
    ln=sh.find('./'+P+'spPr/'+A+'ln')
    if ln is not None:
        line={'width_emu':int(ln.get('w','0')),'cap':ln.get('cap'),'compound':ln.get('cmpd'),'alignment':ln.get('algn')}; sf=ln.find('./'+A+'solidFill')
        if sf is not None and len(sf):line['color']=color_meta(sf)
        dash=ln.find('./'+A+'prstDash')
        if dash is not None:line['dash']=dash.get('val')
        else:line['dash']=None
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
    tag=sh.tag.split('}')[-1]
    if tag=='grpSp':
        meta=object_meta(sh,slide_rels)
        children=[]
        for child in list(sh):
            if child.tag.split('}')[-1] not in ('sp','cxnSp','pic','grpSp','graphicFrame'):continue
            item=shape_content(child,slide_rels,bullet_defaults)
            if item:
                item['source_order']=len(children)+1
                children.append(item)
        meta['children']=children
        return {'kind':'group','name':meta.get('name',''),**meta}
    nv=sh.find('./'+P+'nvSpPr/'+P+'cNvPr')
    if nv is None: nv=sh.find('./'+P+'nvGraphicFramePr/'+P+'cNvPr')
    name=nv.get('name','') if nv is not None else ''
    ph=sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph')
    ph_type=ph.get('type','') if ph is not None else ''
    ph_idx=ph.get('idx') if ph is not None else None
    tbl=sh.find('.//'+A+'tbl')
    if tbl is not None:
        rows=[]
        for tr in tbl.findall('./'+A+'tr'):
            rows.append([ '\n'.join(filter(None,(para_text(p) for p in tc.findall('.//'+A+'p'))) ) for tc in tr.findall('./'+A+'tc')])
        grid=tbl.find('./'+A+'tblGrid')
        columns=[int(c.get('w','0')) for c in grid.findall('./'+A+'gridCol')] if grid is not None else []
        heights=[int(r.get('h','0')) for r in tbl.findall('./'+A+'tr')]
        return {'kind':'table','name':name,'rows':rows,'column_widths_emu':columns,'row_heights_emu':heights,**object_meta(sh,slide_rels)}
    tx=sh.find('./'+P+'txBody')
    if tx is None:
        if sh.tag.split('}')[-1] in ('sp','cxnSp','pic','grpSp','graphicFrame'): return {'kind':'drawing',**object_meta(sh,slide_rels)}
        return None
    paras=[para_text(p) for p in tx.findall('./'+A+'p')]
    paras=[x for x in paras if x]
    if not paras and sh.tag.split('}')[-1] not in ('sp','cxnSp','pic','grpSp','graphicFrame'):return None
    rich=rich_paragraphs(sh,bullet_defaults)
    hinted_list=(name.lower().startswith('content placeholder') and len(paras)>=4 and all(len(x)<120 for x in paras) and not any(p.get('bullet',{}).get('type') in ('char','number') for p in rich))
    return {'kind':'text' if paras else 'drawing','name':name,'placeholder':ph_type,'placeholder_idx':ph_idx,'paragraphs':paras,'rich_paragraphs':rich,'render_list_hint':'unordered' if hinted_list else None,**object_meta(sh,slide_rels)}

def resolve_layout_placeholders(z, slide_rels, blocks):
    """Inherit placeholder bounds/text-box settings from layout, then master."""
    layout=next((v for v in slide_rels.values() if v.startswith('ppt/slideLayouts/')),None)
    if not layout or layout not in z.namelist():return
    def placeholders(root):
        out=[]
        for sh in root.findall('.//'+P+'sp'):
            ph=sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph')
            if ph is not None:out.append((ph.get('type',''),ph.get('idx'),sh))
        return out
    candidates=placeholders(xml(z,layout))
    layout_rels=rels(z,layout)
    master=next((v for v in layout_rels.values() if v.startswith('ppt/slideMasters/')),None)
    master_candidates=placeholders(xml(z,master)) if master and master in z.namelist() else []
    for b in blocks:
        if b.get('bounds_emu') is not None or b.get('placeholder') is None:continue
        ptype=b.get('placeholder','');pidx=b.get('placeholder_idx')
        layout_match=next((sh for typ,idx,sh in candidates if pidx is not None and idx==pidx),None)
        if layout_match is None:layout_match=next((sh for typ,idx,sh in candidates if typ==ptype),None)
        match=layout_match
        if match is None or xfrm_data(match) is None:
            match=next((sh for typ,idx,sh in master_candidates if typ==ptype and ptype),None)
            if match is None and pidx is not None:
                match=next((sh for typ,idx,sh in master_candidates if idx==pidx),None)
            if match is None:match=layout_match
        if match is None:continue
        bounds=xfrm_data(match)
        if bounds is not None:
            b['bounds_emu']=bounds;b['bounds_source']='master' if match in [m[2] for m in master_candidates] else 'layout'
        meta=object_meta(match)
        if b.get('text_box') is None and meta.get('text_box') is not None:b['text_box']=meta['text_box']
        if b.get('fill') is None and meta.get('fill') is not None:b['fill']=meta['fill']
        if b.get('line') is None and meta.get('line') is not None:b['line']=meta['line']
        b['layout_placeholder']={'type':ptype,'idx':pidx,'layout_object_name':meta.get('name')}

def scene_model(blocks):
    """Build a generic visual-object graph and cautious, evidence-linked ER candidates."""
    objects=[]
    for content_index,b in enumerate(blocks):
        if b.get('object_type') not in ('sp','cxnSp','pic','grpSp','graphicFrame'):continue
        sid=b.get('shape_id')
        objects.append({
            'shape_id':sid,'content_index':content_index,
            'source_order':b.get('source_order',content_index+1),
            'object_type':b.get('object_type'),
        })
    labels=[b for b in blocks if b.get('kind')=='text' and any(t.strip() for t in b.get('paragraphs',[]))]
    positioned=[b for b in blocks if b.get('bounds_emu')]
    diagram_candidate=len(positioned)>=12 and len(labels)>=5
    candidates={'type':'diagram' if diagram_candidate else None,
                'confidence':'layout heuristic' if diagram_candidate else 'none',
                'evidence_shape_ids':[b.get('shape_id') for b in positioned] if diagram_candidate else [],
                'warning':'This identifies a dense visual composition only. Domain concepts such as entities, relationships, attributes, and cardinalities require semantic review.'}
    return {'coordinate_system':'EMU; origin at slide top-left','objects':objects,
            'connections':[{'shape_id':b.get('shape_id'),'connection':b.get('connection')}
                           for b in blocks if b.get('object_type')=='cxnSp'],
            'object_count':len(objects),'concept_candidates':candidates}

def extract(path, include_speaker_notes=True):
  with ZipFile(path) as z:
    pres=xml(z,'ppt/presentation.xml'); pr=rels(z,'ppt/presentation.xml')
    palette=theme_palette(z,pr)
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
      resolve_layout_placeholders(z,sr,blocks)
      title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() in ('title','ctrtile')),None)
      subtitle=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower()=='subtitle'),None)
      if not title: title=next((b['paragraphs'][0] for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() not in ('subtitle','sldnum') and b.get('paragraphs')),f'Slide {n}')
      if path.stem.lower() in ('er.v26','er.v26_enhanced','er.v26_with_labs') and n==56:
        title='ERD Design Example'
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
      slide={'number':n,'title':title,'subtitle':subtitle,'hidden':root.get('show') in ('0','false'),'content':blocks,'diagram_objects':drawings,'scene':scene_model(blocks),'animation_steps':animation_steps(root),'animation_timing_xml':timing_xml,'speaker_notes':note}
      slides.append(slide)
    return {'schema_version':'1.3','source_file':path.name,'slide_size_emu':{'width':int(size.get('cx')),'height':int(size.get('cy'))} if size is not None else None,'theme_colors':palette,'slides':slides}

def attach_media(z, blocks, media_dir):
    """Copy embedded picture assets alongside a deck and link their JSON objects."""
    for b in blocks:
        target=b.get('embedded_media_target')
        if target and target in z.namelist():
            name=PurePosixPath(target).name
            media_dir.mkdir(parents=True,exist_ok=True)
            out=media_dir/name
            if not out.exists():out.write_bytes(z.read(target))
            b['media_src']='media/'+name
        if b.get('children'):attach_media(z,b['children'],media_dir)

VIEWER='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deck</title><style>
:root{color-scheme:light;--ink:#14241c;--green:#0b5d3b;--gold:#c7a34a}*{box-sizing:border-box}body{margin:0;background:#e8ece8;color:var(--ink);font:18px/1.5 system-ui,sans-serif}.bar{height:58px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid #c9d2cb}.bar a{color:var(--green)}main{height:calc(100vh - 112px);max-width:1200px;margin:auto;padding:4vh 7vw;display:flex;flex-direction:column;justify-content:center;background:#fff}.eyebrow{font-size:.86rem;color:#51665a}.title{font-size:clamp(2rem,4vw,3.3rem);line-height:1.1;color:var(--green);margin:.2em 0 .6em}.subtitle{font-size:clamp(1.1rem,2vw,1.5rem);line-height:1.35;color:#53645a;margin:-.4em 0 1.1em}.body{font-size:clamp(1.05rem,1.6vw,1.45rem)}.body p{margin:.55em 0}.body ul,.body ol{padding-left:1.35em;margin:.3em 0}.body li{margin:.45em 0}.tbl{border-collapse:collapse;width:100%;font-size:1rem}.tbl td,.tbl th{border:1px solid #9eafa3;padding:.55em;text-align:left}.tbl tr:first-child{background:#e6efe8;font-weight:650}.controls{height:54px;display:flex;align-items:center;justify-content:center;gap:18px}.controls button{font:inherit;padding:5px 15px}.notes{font-size:.9rem;color:#52645a;margin-top:1em}.source-diagram{width:100%;max-height:65vh;background:#fff;border:1px solid #d9e0da}.source-diagram .edge{stroke:#52645a;stroke-width:2;fill:none}.source-diagram text{font:14px system-ui,sans-serif;fill:#14241c}.erd{width:100%;max-height:58vh}.erd .entity{fill:#edf4ef;stroke:#0b5d3b;stroke-width:3}.erd .diamond{fill:#fff8e5;stroke:#9a7824;stroke-width:2}.erd .edge{stroke:#52665a;stroke-width:2}.erd text{font:16px system-ui,sans-serif;fill:#14241c}.erd .ename{font-weight:700;fill:#07583b}.erd .rname{font-size:14px;font-weight:650}.erd .attr{font-size:12px;fill:#43564b}kbd{background:#fff;padding:2px 6px;border:1px solid #ccd4ce}

main.positioned{display:block;width:min(90vw,calc((100vh - 128px)*16/9));height:auto;max-height:calc(100vh - 128px);aspect-ratio:16/9;padding:0;position:relative;overflow:hidden}.positioned #eyebrow,.positioned #title,.positioned #subtitle{display:none}.positioned .body{position:absolute;inset:0;width:100%;height:100%;font-size:inherit}.positioned-canvas{position:relative;width:100%;height:100%;overflow:hidden;container-type:inline-size}.positioned-object{position:absolute;box-sizing:border-box;white-space:pre-wrap;overflow:hidden;line-height:1.2;padding:0}.positioned-object p{margin:0 0 .35em}.positioned-object.title-placeholder{text-align:center}
.positioned-table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed;font-size:1.1cqw;line-height:1.15}.positioned-table th,.positioned-table td{border:1px solid #718278;padding:.25em .4em;text-align:left;vertical-align:middle;overflow-wrap:anywhere}.positioned-table tr:first-child{background:rgba(230,239,232,.62);font-weight:650}
.positioned-object{overflow:visible;isolation:isolate}.positioned-object.group{overflow:visible}.shape-art{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.positioned-content{position:absolute;inset:0;z-index:1;white-space:pre-wrap;overflow:hidden;line-height:1.18}.positioned-content p{margin:0 0 .3em}.positioned-content sup,.positioned-content sub{font-size:.72em;line-height:0}.positioned-content .bullet{display:inline-block;margin-left:-1.1em;width:1.1em}.positioned-object img{display:block;width:100%;height:100%;object-fit:contain}.positioned-paragraph{white-space:pre-wrap}
.slide68-layout{width:100%;height:100%;padding:1.4%;display:grid;grid-template-columns:46% 54%;grid-template-rows:21% 79%;gap:.5%;overflow:hidden;font-size:1.05cqw;line-height:1.16}.slide68-layout h2{margin:0 0 .25em;color:#0b5d3b;font-size:2cqw}.slide68-layout h3{margin:.15em 0 .35em;font-size:1.12cqw;color:#0b5d3b}.slide68-layout p{margin:.16em 0}.s68-heading{grid-column:1/3;border-bottom:2px solid #0b5d3b;padding:0 .5em .45em}.s68-heading p{font-size:1.12cqw}.s68-figure{grid-column:1;grid-row:2;display:flex;align-items:flex-start;justify-content:center;overflow:hidden}.s68-figure img{width:100%;height:39%;object-fit:contain;object-position:top}.s68-check{grid-column:1;grid-row:2;align-self:end;height:59%;overflow:hidden;border:1px solid #afbeb4;border-radius:8px;padding:.5em;background:#f7f9f7;font-size:.93cqw;line-height:1.14}.s68-check p{margin:.09em 0}.s68-summary{grid-column:2;grid-row:2;display:flex;flex-direction:column;gap:.32em;overflow:hidden}.s68-summary>div{border:1px solid #bdc9c0;border-radius:7px;padding:.35em .55em;background:#fafcfb}.s68-schema p{font-weight:600}.s68-twocol{display:grid;grid-template-columns:1fr 1fr;gap:.45em}.s68-twocol p{font-size:.98cqw;overflow-wrap:anywhere}.s68-keys,.s68-result,.s68-decomp{font-size:.95cqw}.s68-result{background:#fff3e0!important;border-color:#d8a342!important}.s68-decomp{background:#eaf4ed!important;border-color:#75a584!important}.slide4-layout{width:100%;height:100%;padding:5% 7%;display:grid;grid-template-columns:68% 28%;grid-template-rows:16% 84%;gap:2%;overflow:hidden}.slide4-layout h2{grid-column:1/3;margin:0;color:#0b5d3b;font-size:3cqw}.slide4-layout ul{margin:0;padding:1em 0 0 1.5em;font-size:1.75cqw;line-height:1.35}.slide4-layout li{padding:.2em 0 .55em}.slide4-layout aside{align-self:center;padding:1em;border:2px solid #91a99a;border-radius:12px;background:#f3f7f4;font-size:1.45cqw;line-height:1.35}.slide4-layout aside p{margin:.3em 0 1em}</style><header class="bar"><a href="../index.html">Course content</a><strong id="deck"></strong><span id="count"></span></header><main><div class="eyebrow" id="eyebrow"></div><h1 class="title" id="title"></h1><p class="subtitle" id="subtitle" hidden></p><article class="body" id="body"></article></main><nav class="controls"><button id="prev">← Previous</button><span id="status"></span><button id="next">Next →</button></nav><script>
fetch('deck.json?v=design-fixes-2026-11-21').then(r=>r.json()).then(d=>{const requestedSlide=Number(new URLSearchParams(location.search).get('slide'));let i=Number.isFinite(requestedSlide)?Math.max(0,Math.min(d.slides.length-1,Math.floor(requestedSlide)-1)):0;document.title=d.source_file;document.querySelector('#deck').textContent=d.source_file;const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));function renderErd(g){const pos={teams:[80,170],games:[420,120],plays:[790,170],players:[420,410]};let out='<svg class="erd" viewBox="0 0 1000 620" role="img" aria-label="'+esc(g.description)+'">';const anchors={};for(const r of g.relationships){const [x1,y1]=pos[r.from],[x2,y2]=pos[r.to];const mx=(x1+x2)/2,my=(y1+y2)/2;const dy=(r.id==='playing-home'?-24:r.id==='playing-away'?24:0);out+=`<line class="edge" x1="${x1+105}" y1="${y1+48}" x2="${x2+105}" y2="${y2+48}"/>`;const cx=mx+105,cy=my+48+dy;out+=`<polygon class="diamond" points="${cx},${cy-25} ${cx+58},${cy} ${cx},${cy+25} ${cx-58},${cy}"/><text class="rname" text-anchor="middle" x="${cx}" y="${cy+5}">${esc(r.name)}</text>`;if(r.attributes?.length)out+=`<text class="attr" text-anchor="middle" x="${cx}" y="${cy+43}">${esc(r.attributes.join(', '))}</text>`}for(const e of g.entities){const [x,y]=pos[e.id];out+=`<rect class="entity" x="${x}" y="${y}" width="210" height="96" rx="3"/><text class="ename" text-anchor="middle" x="${x+105}" y="${y+27}">${esc(e.name)}</text><text class="attr" text-anchor="middle" x="${x+105}" y="${y+54}">${esc(e.attributes.join(' · '))}</text>`}out+='</svg><p>'+esc(g.notes)+'</p>';return out}function sourceSvg(s){if(!s.diagram_objects?.length)return null;const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=`Extracted source diagram (${s.diagram_objects.length} editable objects; ${s.animation_steps?.length||0} animation effects)`;details.appendChild(summary);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','source-diagram');svg.setAttribute('viewBox','0 0 1280 720');svg.setAttribute('role','img');svg.setAttribute('aria-label','Diagram reconstructed from editable PowerPoint objects');const sw=d.slide_size_emu?.width||12192000,sh=d.slide_size_emu?.height||6858000;for(const o of s.diagram_objects){const b=o.bounds_emu;if(!b||o.object_type==='pic')continue;const x=b.x/sw*1280,y=b.y/sh*720,w=b.width/sw*1280,h=b.height/sh*720,g=o.geometry?.name||'',cx=x+w/2,cy=y+h/2,fill=o.fill?.type==='srgbClr'?'#'+o.fill.value:'none',stroke=o.line?.color?.type==='srgbClr'?'#'+o.line.color.value:'#52645a';let el;if(g==='line'||g==='lineInv'||o.object_type==='cxnSp'){el=document.createElementNS(svg.namespaceURI,'line');el.setAttribute('x1',x);el.setAttribute('y1',y);el.setAttribute('x2',x+w);el.setAttribute('y2',y+h);el.setAttribute('class','edge')}else if(g==='ellipse'){el=document.createElementNS(svg.namespaceURI,'ellipse');el.setAttribute('cx',cx);el.setAttribute('cy',cy);el.setAttribute('rx',w/2);el.setAttribute('ry',h/2);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}else if(g==='diamond'){el=document.createElementNS(svg.namespaceURI,'polygon');el.setAttribute('points',`${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}else{el=document.createElementNS(svg.namespaceURI,'rect');el.setAttribute('x',x);el.setAttribute('y',y);el.setAttribute('width',w);el.setAttribute('height',h);el.setAttribute('fill',fill);el.setAttribute('stroke',stroke)}svg.appendChild(el);const label=(o.paragraphs||[]).join(' ');if(label){const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',cx);t.setAttribute('y',cy+5);t.setAttribute('text-anchor','middle');t.textContent=label.length>38?label.slice(0,35)+'…':label;svg.appendChild(t)}}details.appendChild(svg);return details}function renderBlock(b){if(b.kind==='table')return '<table class="tbl">'+b.rows.map((r,j)=>'<tr>'+r.map(c=>j===0?'<th>'+esc(c)+'</th>':'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</table>';const ps=b.rich_paragraphs?.length?b.rich_paragraphs:(b.paragraphs||[]).map(text=>({text,bullet:{type:'none'},level:0}));const nodes=[],stack=[];for(const p of ps){const type=p.bullet?.type||'none',text=p.text||'';if(!text.trim())continue;if(type==='char'||type==='number'){const level=Math.max(0,Math.min(8,Number(p.level)||0)),node={type,level,scheme:p.bullet.scheme||'',char:p.bullet.value||'',start:p.bullet.start_at||'',html:esc(text).replace(/\\n/g,'<br>'),children:[]};while(stack.length&&stack[stack.length-1].level>=level)stack.pop();if(level>0&&stack.length)stack[stack.length-1].node.children.push(node);else nodes.push(node);stack.push({level,node})}else{stack.length=0;nodes.push({type:'paragraph',html:esc(text).replace(/\\n/g,'<br>')})}}function renderNodes(items){let out='';for(let i=0;i<items.length;){const n=items[i];if(n.type==='paragraph'){out+='<p>'+n.html+'</p>';i++;continue}let j=i+1;while(j<items.length&&items[j].type===n.type&&items[j].level===n.level&&items[j].scheme===n.scheme)j++;const group=items.slice(i,j),ordered=n.type==='number',tag=ordered?'ol':'ul';let listStyle='';if(ordered){const s=n.scheme.toLowerCase();listStyle=s.includes('roman')?(s.includes('uc')?'upper-roman':'lower-roman'):s.includes('alpha')?(s.includes('uc')?'upper-alpha':'lower-alpha'):'decimal'}else{const c=n.char;listStyle=c==='▪'||c==='■'?'square':c==='○'||c==='◦'?'circle':'disc'}const start=ordered&&n.start?` start="${Number(n.start)||1}"`:'';out+=`<${tag} style="list-style-type:${listStyle}"${start}>`+group.map(item=>'<li>'+item.html+(item.children.length?renderNodes(item.children):'')+'</li>').join('')+`</${tag}>`;i=j}return out}return renderNodes(nodes)}function renderSlide4(s){const find=(items,name)=>{for(const b of items||[]){if(b.name===name)return b;const x=find(b.children,name);if(x)return x}return null},safe=t=>esc(String(t||'')),list=find(s.content,'Content Placeholder 2'),aside=find(s.content,'TextBox 7'),focus=find(s.content,'TextBox 8'),items=list?.paragraphs||[];return `<div class="slide4-layout"><h2>Normal Forms</h2><ul>${items.map(t=>`<li>${safe(t)}</li>`).join('')}</ul><aside><p>${safe(aside?.paragraphs?.[0])}</p><p>${safe(focus?.paragraphs?.[0])}</p></aside></div>`}
function renderSlide68(s){const by=n=>s.content.find(b=>b.name===n)||{},txt=b=>b.rich_paragraphs?.map(p=>p.text||'')||b.paragraphs||[],safe=t=>esc(String(t||'').replace(/\u00a0/g,' ').replace(/\\s{2,}/g,' ').trim()).replace(/\uF0E0/g,'→');const items=by('Content Placeholder 2'),detail=by('TextBox 9'),definition=by('TextBox 11'),figure=by('Picture 4'),fail=by('Rectangle 5'),decomp=by('Rectangle 6');const p=txt(items),fd=p.slice(1,5),closures=p.slice(5,9),prime=p.slice(10,13),checks=txt(detail),pic=figure.media_src||'';return `<div class="slide68-layout"><header class="s68-heading"><h2>Example: Testing LOTS in 2NF</h2><p>${safe(txt(definition)[0])}</p></header><section class="s68-figure"><img src="${esc(pic)}" alt="Functional dependencies in the LOTS relation"></section><section class="s68-check"><h3>Check each non-prime attribute</h3>${checks.slice(1).map(t=>`<p>${safe(t)}</p>`).join('')}</section><section class="s68-summary"><div class="s68-schema"><b>LOTS relation</b><p>${safe(p[0])}</p></div><div class="s68-twocol"><div><h3>Functional dependencies</h3>${fd.map(t=>`<p>${safe(t)}</p>`).join('')}</div><div><h3>Attribute closures</h3>${closures.map(t=>`<p>${safe(t)}</p>`).join('')}</div></div><div class="s68-keys"><b>Prime attributes:</b> ${prime.map(safe).join(' · ')}</div><div class="s68-result"><b>2NF result:</b> ${safe(txt(fail)[0])}</div><div class="s68-decomp"><b>Decomposition:</b> ${txt(decomp).map(safe).join(' · ')}</div></section></div>`}
function renderPositioned(s){
const items=(s.content||[]).filter(b=>b.bounds_emu);if(!items.length)return null;
const W=d.slide_size_emu?.width||12192000,H=d.slide_size_emu?.height||6858000;
const escText=t=>esc(String(t??'')).replace(/\uF0E0/g,'→').replace(/\uF0CD/g,'⊆').replace(/\uF0C7/g,'∩').replace(/\uF0C6/g,'∅').replace(/\uF0C8/g,'∪').replace(/\uF0D7/g,'×').replace(/\uF0B9/g,'¹').replace(/\uF0B2/g,'²');
const color=c=>{if(!c)return '';let hex=c.type==='srgbClr'?c.value:(c.type==='schemeClr'?d.theme_colors?.[c.value]:null);if(!hex)return '';let rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));if(c.lumMod!=null||c.lumOff!=null)rgb=rgb.map(v=>Math.max(0,Math.min(255,Math.round(v*(c.lumMod??100000)/100000+255*(c.lumOff??0)/100000))));let a=(c.alpha??100000)/100000;return `rgba(${rgb.join(',')},${a})`};
const cssColor=c=>color(c)||'transparent';
function paraHtml(b){const rich=b.rich_paragraphs||[];const paras=rich.length?rich:(b.paragraphs||[]).map(t=>({text:t,bullet:{type:'none'},level:0}));let html='';for(const p of paras){let tx=escText(p.text||'');if(!tx.trim())continue;let runs=(p.runs||[]).map(r=>{let st=r.style||{},css='';if(st.sz)css+=`font-size:calc(${Number(st.sz)/750}cqw * var(--fit,1));`;if(st.bold)css+='font-weight:700;';if(st.italic)css+='font-style:italic;';if(st.underline)css+='text-decoration:underline;';if(st.color)css+=`color:${cssColor(st.color)};`;if(st.font)css+=`font-family:${esc(st.font)},sans-serif;`;let rt=escText(r.text||'');if(Number(st.baseline)>0)rt=`<sup>${rt}</sup>`;else if(Number(st.baseline)<0)rt=`<sub>${rt}</sub>`;return `<span style="${css}">${rt}</span>`}).join('');if(!runs)runs=tx;
let bullet=p.bullet||{},typ=bullet.type||'none',prefix='';if(typ==='char')prefix=`<span class="bullet">${escText(bullet.value||'•')}</span>`;else if(typ==='number')prefix=`<span class="bullet">${escText(bullet.start_at||'1')}.</span>`;else if(b.render_list_hint==='unordered')prefix='<span class="bullet">•</span>';
let fs='';if(p.level)fs+=`margin-left:${Math.min(5,Number(p.level)||0)*1.2}em;`;if(p.alignment)fs+=`text-align:${p.alignment};`;html+=`<p class="positioned-paragraph" style="${fs}">${prefix}${runs}</p>`}return html}
function shapeSvg(b,w,h){let g=b.geometry?.name||'',fill=cssColor(b.fill),line=b.line||{},arrow=['rightArrow','leftArrow','upArrow','downArrow'].includes(g),stroke=color(line.color)||((arrow||b.object_type==='cxnSp')?(d.theme_colors?.accent1?'#'+d.theme_colors.accent1:'#243c2f'):''),sw=Math.max(.5,Number(line.width_emu||12700)*100/Math.max(1,b.bounds_emu?.width||1));if(fill==='transparent'&&arrow)fill=stroke;let attrs=`fill="${fill}" stroke="${stroke||'#243c2f'}" stroke-width="${sw}"`;let el='';if(g==='ellipse'||g==='arc')el=`<ellipse cx="50" cy="50" rx="48" ry="48" ${attrs}/>`;else if(g==='diamond')el=`<polygon points="50,2 98,50 50,98 2,50" ${attrs}/>`;else if(g==='rightArrow')el=`<polygon points="0,30 65,30 65,5 100,50 65,95 65,70 0,70" ${attrs}/>`;else if(g==='leftArrow')el=`<polygon points="100,30 35,30 35,5 0,50 35,95 35,70 100,70" ${attrs}/>`;else if(g==='downArrow')el=`<polygon points="30,0 70,0 70,60 95,60 50,100 5,60 30,60" ${attrs}/>`;else if(g==='upArrow')el=`<polygon points="30,100 70,100 70,40 95,40 50,0 5,40 30,40" ${attrs}/>`;else if(g==='leftBracket')el=`<path d="M80 2H30Q10 2 10 22V78Q10 98 30 98H80" fill="none" stroke="${stroke}" stroke-width="${Math.max(2,sw*2)}"/>`;else if(g==='rightBracket')el=`<path d="M20 2H70Q90 2 90 22V78Q90 98 70 98H20" fill="none" stroke="${stroke}" stroke-width="${Math.max(2,sw*2)}"/>`;else if(['line','lineInv'].includes(g)||b.object_type==='cxnSp'){let x2=g==='lineInv'?0:100,x1=g==='lineInv'?100:0;let marker='';if(line.head_end)marker+=' marker-start="url(#arr)"';if(line.tail_end)marker+=' marker-end="url(#arr)"';el=`<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="${stroke}"/></marker></defs><line x1="${x1}" y1="0" x2="${x2}" y2="100" stroke="${stroke}" stroke-width="${Math.max(1,sw)}"${marker}/>`}else if(g==='rect'||g==='roundRect'||g==='round1Rect'||g==='snipRoundRect')el=`<rect x="1" y="1" width="98" height="98" rx="${g==='rect'?0:10}" ${attrs}/>`;else if((b.fill&&b.fill.type!=='none')||line.color)el=`<rect x="1" y="1" width="98" height="98" ${attrs}/>`;else return '';return `<svg class="shape-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${el}</svg>`}
function renderObj(b,ctx={sx:100/W,sy:100/H,tx:0,ty:0}){const q=b.bounds_emu||{};let x=ctx.tx+(q.x||0)*ctx.sx,y=ctx.ty+(q.y||0)*ctx.sy,w=(q.width||0)*ctx.sx,h=(q.height||0)*ctx.sy,fit=1;if(s.number===68){const boxes={'Title 1':[5,3,90,10,1],'TextBox 11':[5,14,90,9,.8],'Picture 4':[5,25,43,35,1],'Content Placeholder 2':[51,25,44,35,.62],'TextBox 9':[5,62,55,34,.65],'Rectangle 5':[63,64,32,11,.65],'Rectangle 6':[63,79,32,14,.7],'Slide Number Placeholder 4':[92,94,5,4,1]};const a=boxes[b.name];if(a){[x,y,w,h]=a;fit=a[4]}}if(b.kind==='group'){let inner='';const gt=b.group_transform||{},off=gt.off||{},ext=gt.ext||{},co=gt.child_off||{},ce=gt.child_ext||{};const childCtx=ce.width?{sx:ctx.sx*(ext.width||q.width)/ce.width,sy:ctx.sy*(ext.height||q.height)/ce.height,tx:ctx.tx+(off.x-co.x)*ctx.sx,ty:ctx.ty+(off.y-co.y)*ctx.sy}:ctx;for(const c of b.children||[])inner+=renderObj(c,childCtx);return inner}
const style=`left:${x}%;top:${y}%;width:${w}%;height:${h}%;`;if(b.kind==='table'){const rows=(b.rows||[]).map((r,j)=>'<tr>'+r.map(c=>j===0?'<th>'+escText(c)+'</th>':'<td>'+escText(c)+'</td>').join('')+'</tr>').join('');return `<div class="positioned-object" style="${style}"><table class="positioned-table">${rows}</table></div>`}
let ph=(b.placeholder||'').toLowerCase(),title=['title','ctrtitle'].includes(ph),paras=paraHtml(b),art=shapeSvg(b,w,h),bg=color(b.fill),ln=color(b.line?.color);let extra='';if(bg&&b.fill?.type!=='none')extra+=`background:${bg};`;if(ln)extra+=`border:${Math.max(1,Number(b.line.width_emu||9525)/9525)}px solid ${ln};`;let txStyle=fit<1?`--fit:${fit};`:'';const first=(b.rich_paragraphs||[]).flatMap(p=>p.runs||[]).find(r=>r.text?.trim())?.style||{};if(first.sz)txStyle+=`font-size:calc(${Number(first.sz)/750}cqw * var(--fit,1));`;else txStyle+=`font-size:${title?'2.8':'1.65'}cqw;`;if(first.color)txStyle+=`color:${cssColor(first.color)};`;if(first.font)txStyle+=`font-family:${esc(first.font)},sans-serif;`;let rot=q.rotation_60000deg?`transform:rotate(${q.rotation_60000deg/60000}deg);`:'';let img=b.media_src?`<img src="${esc(b.media_src)}" alt="${esc(b.name||'Slide illustration')}">`:'';return `<div class="positioned-object${title?' title-placeholder':''}" style="${style}${extra}${rot}" aria-label="${esc(b.name||'Slide object')}">${art}${img}${paras?`<div class="positioned-content" style="${txStyle}">${paras}</div>`:''}</div>`}
let out='<div class="positioned-canvas">';const priority=b=>b.object_type==='pic'?0:b.kind==='drawing'&&['rightArrow','leftArrow','upArrow','downArrow'].includes(b.geometry?.name)?4:b.kind==='drawing'?1:b.kind==='table'?2:3;for(const b of [...items].sort((a,b)=>priority(a)-priority(b)))out+=renderObj(b);return out+'</div>'}
function draw(){let s=d.slides[i];document.querySelector('#eyebrow').textContent=`Slide ${s.number}${s.hidden?' · Hidden in source deck':''}`;document.querySelector('#title').textContent=s.title;const subtitle=document.querySelector('#subtitle');subtitle.textContent=s.subtitle||'';subtitle.hidden=!s.subtitle;document.querySelector('#count').textContent=`${i+1} / ${d.slides.length}`;document.querySelector('#status').textContent=`${i+1} of ${d.slides.length}`;const main=document.querySelector('main'),body=document.querySelector('#body'),positioned=s.number===68?renderSlide68(s):s.number===4?renderSlide4(s):renderPositioned(s);main.classList.toggle('positioned',Boolean(positioned));body.innerHTML=positioned|| (s.diagram?renderErd(s.diagram):s.content.filter(b=>!['title','ctrtitle','subtitle','sldnum'].includes((b.placeholder||'').toLowerCase())).map(renderBlock).join(''));if(positioned)for(const el of body.querySelectorAll('.positioned-content')){let scale=1;while(el.scrollHeight>el.clientHeight+1&&scale>.55){scale-=.05;el.style.setProperty('--fit',scale)}}const rawDiagram=positioned?null:sourceSvg(s);if(rawDiagram)body.appendChild(rawDiagram);document.querySelector('#prev').disabled=i===0;document.querySelector('#next').disabled=i===d.slides.length-1}function go(n){i=Math.max(0,Math.min(d.slides.length-1,n));draw()}document.querySelector('#prev').onclick=()=>go(i-1);document.querySelector('#next').onclick=()=>go(i+1);document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft')go(i-1)});draw()});</script></html>'''

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--input-dir',type=Path,default=Path(__file__).resolve().parent.parent/'slides');ap.add_argument('--output-dir',type=Path,default=Path(__file__).resolve().parent.parent/'content'/'decks-json');ap.add_argument('--exclude-speaker-notes',action='store_true',help='Omit speaker notes when building a public JSON dataset.');args=ap.parse_args()
 root=args.input_dir.resolve(); out=args.output_dir.resolve(); pres=out.parent.parent/'presentations'/'editable';out.mkdir(parents=True,exist_ok=True);pres.mkdir(parents=True,exist_ok=True)
 is_sql=lambda p: 'sql' in p.stem.lower() and not p.stem.lower().startswith('mysql_')
 sources=[p for p in sorted(root.glob('*.pptx')) if not is_sql(p)]
 sources += [p for p in sorted(root.parent.glob('*.pptx')) if not is_sql(p)]
 # Multiple variant decks are retained as separate sources so no content is silently discarded.
 for src in sources:
   data=extract(src,include_speaker_notes=not args.exclude_speaker_notes); slug=re.sub(r'[^a-z0-9]+','-',src.stem.lower()).strip('-')
   dest=pres/slug;dest.mkdir(exist_ok=True)
   with ZipFile(src) as z:
     for slide in data['slides']:attach_media(z,slide['content'],dest/'media')
   for slide in data['slides']:
     diagram=DIAGRAMS.get((slug,slide['number']))
     if diagram: slide['diagram']=diagram
   (out/f'{slug}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
   (dest/'deck.json').write_text(json.dumps(data,ensure_ascii=False)+'\n',encoding='utf-8')
   (dest/'index.html').write_text(VIEWER,encoding='utf-8')
   print(f'{src.name}: {len(data["slides"])} slides -> {slug}')
 index='<!doctype html><meta charset="utf-8"><title>Editable course presentations</title><h1>Editable course presentations</h1><p>Content is stored as JSON; these HTML decks render text and tables without slide screenshots.</p><ul>'
 for d in sorted(pres.iterdir()):
   if d.is_dir():index+=f'<li><a href="{d.name}/index.html">{html.escape(d.name.replace("-"," "))}</a></li>'
 (pres/'index.html').write_text(index+'</ul>',encoding='utf-8')
if __name__=='__main__':main()
