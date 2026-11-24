"""Extract editable PowerPoint content to JSON and render it in a separate HTML layer.

Uses only Python's standard library and OOXML. The JSON is the content layer; the
generated HTML is the presentation layer. No slide screenshots are generated.
Usage: python scripts/pptx_to_json.py --help
"""
from __future__ import annotations
import argparse, html, json, re, posixpath
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET
from zipfile import ZipFile

P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'


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
        color=entry[0];palette[entry.tag.split('}')[-1]]=(color.get('lastClr') if color.tag == A+'sysClr' else color.get('val'))
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
    if rpr.get('b') is not None:out['bold']=rpr.get('b') not in ('0','false')
    if rpr.get('i') is not None:out['italic']=rpr.get('i') not in ('0','false')
    if rpr.get('u') is not None:out['underline']=rpr.get('u') not in ('none','0','false')
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

def paragraph_defaults(ppr):
    """Capture inherited paragraph spacing, indents, alignment, and default run style."""
    if ppr is None:return {'format':{},'run_style':{},'alignment':None,'bullet':None}
    fmt={k:int(ppr.get(k)) for k in ('marL','marR','indent','defTabSz') if ppr.get(k) is not None}
    for spacing in ('spcBef','spcAft','lnSpc'):
        node=ppr.find('./'+A+spacing)
        if node is not None and len(node):fmt[spacing]={node[0].tag.split('}')[-1]:node[0].get('val')}
    return {'format':fmt,'run_style':text_style(ppr.find('./'+A+'defRPr')),
            'alignment':ppr.get('algn'),'bullet':bullet_marker(ppr)}

def slide_bullet_defaults(z, slide_rels):
    """Resolve inherited paragraph and run styles from the slide layout and master."""
    layout=next((v for v in slide_rels.values() if v.startswith('ppt/slideLayouts/')),None)
    layout_defaults={};layout_paras={};master_defaults={};master_paras={};layout_types={}
    if not layout or layout not in z.namelist():return {'layout':layout_defaults,'layout_paras':layout_paras,'master':master_defaults,'master_paras':master_paras,'layout_types':layout_types}
    lr=xml(z,layout)
    for sp in lr.findall('.//'+P+'sp'):
        ph=sp.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph');tx=sp.find('./'+P+'txBody')
        if ph is None or tx is None:continue
        idx=ph.get('idx');ptype=ph.get('type') or ('obj' if idx is not None else None)
        if idx is not None and ptype:layout_types[('idx',idx)]=ptype
        for para in tx.findall('./'+A+'p'):
            pp=para.find('./'+A+'pPr');level=int(pp.get('lvl','0')) if pp is not None else 0;props=paragraph_defaults(pp)
            for key in ([('idx',idx)] if idx is not None else [])+([('type',ptype)] if ptype else []):
                layout_paras[(key[0],key[1],level)]=props
                if props['bullet'] is not None:layout_defaults[(key[0],key[1],level)]=props['bullet']
    layout_rel=rels(z,layout)
    master=next((v for v in layout_rel.values() if v.startswith('ppt/slideMasters/')),None)
    if master and master in z.namelist():
        mr=xml(z,master);styles=mr.find('./'+P+'txStyles')
        if styles is not None:
            for style_name in ('bodyStyle','titleStyle','otherStyle'):
                style=styles.find('./'+P+style_name)
                if style is None:continue
                for level in range(1,10):
                    pp=style.find('./'+A+f'lvl{level}pPr');props=paragraph_defaults(pp)
                    master_paras[(style_name,level-1)]=props
                    if props['bullet'] is not None:master_defaults[(style_name,level-1)]=props['bullet']
    return {'layout':layout_defaults,'layout_paras':layout_paras,'master':master_defaults,'master_paras':master_paras,'layout_types':layout_types}

def rich_paragraphs(sh, bullet_defaults=None):
    """Retain run styling such as underlined E/R keys and formatted labels."""
    tx=sh.find('./'+P+'txBody')
    if tx is None:return []
    out=[]
    for p in tx.findall('./'+A+'p'):
        pp=p.find('./'+A+'pPr');level=int(pp.get('lvl','0')) if pp is not None else 0;ph=sh.find('./'+P+'nvSpPr/'+P+'nvPr/'+P+'ph');para={'text':para_text(p),'level':level,'alignment':None,'runs':[]}
        inherited={'format':{},'run_style':{},'alignment':None,'bullet':None};ptype=None;idx=None
        if ph is not None and bullet_defaults:
            idx=ph.get('idx');ptype=ph.get('type') or bullet_defaults['layout_types'].get(('idx',idx)) or ('obj' if idx is not None else None)
            keys=([('idx',idx)] if idx is not None else [])+([('type',ptype)] if ptype else [])
            inherited=next((bullet_defaults['layout_paras'][k+(level,)] for k in keys if k+(level,) in bullet_defaults.get('layout_paras',{})),inherited)
            style_name='titleStyle' if ptype in ('title','ctrTitle') else 'bodyStyle' if ptype in (None,'','obj','body') else 'otherStyle'
            master=bullet_defaults.get('master_paras',{}).get((style_name,level),{})
            inherited={**master,**inherited,'format':{**master.get('format',{}),**inherited.get('format',{})},'run_style':{**master.get('run_style',{}),**inherited.get('run_style',{})},'bullet':inherited.get('bullet') or master.get('bullet')}
        explicit=paragraph_defaults(pp)
        para['paragraph_format']={**inherited.get('format',{}),**explicit.get('format',{})}
        para['alignment']=explicit.get('alignment') or inherited.get('alignment')
        marker=explicit.get('bullet');source='explicit'
        if marker is None:marker=inherited.get('bullet');source='layout' if marker is not None else 'master'
        if marker is None:marker={'type':'none'};source='default'
        para['bullet']={**marker,'source':source}
        run_defaults=inherited.get('run_style',{})
        for r in list(p):
            tag=r.tag.split('}')[-1]
            if tag in ('r','fld'):
                t=r.find('./'+A+'t'); entry={'text':normalize_symbols(t.text or '') if t is not None else '', 'style':{**run_defaults,**text_style(r.find('./'+A+'rPr'))}}
                if tag=='fld':entry['field_type']=r.get('type')
                para['runs'].append(entry)
            elif tag=='br':para['runs'].append({'text':'\n','break':True,'style':{**run_defaults,**text_style(r.find('./'+A+'rPr'))}})
        out.append(para)
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
        color=node[0];out={'type':color.tag.split('}')[-1],'value':(color.get('lastClr') if color.tag == A+'sysClr' else color.get('val'))}
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
      title=next((t for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() in ('title','ctrtile') for t in b.get('paragraphs',[]) if t.strip()),None)
      subtitle=next((t for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower()=='subtitle' for t in b.get('paragraphs',[]) if t.strip()),None)
      if not title: title=next((t for b in blocks if b['kind']=='text' and (b.get('placeholder') or '').lower() not in ('subtitle','sldnum') for t in b.get('paragraphs',[]) if t.strip()),f'Slide {n}')
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
      slide={'id':item.get('id'),'source_part':target,'number':n,'title':title,'subtitle':subtitle,'hidden':root.get('show') in ('0','false'),'content':blocks,'diagram_objects':drawings,'scene':scene_model(blocks),'animation_steps':animation_steps(root),'animation_timing_xml':timing_xml,'speaker_notes':note}
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


# Kept importable for existing comparison tools; the template contains no deck data.
VIEWER = (Path(__file__).parent / 'templates' / 'viewer.html').read_text(encoding='utf-8')

def main():
    from deck_pipeline import main as pipeline_main
    pipeline_main()

if __name__ == '__main__':
    main()
