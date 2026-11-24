"""Portable, standard-library-only PPTX extraction, review, and authoring CLI."""
from __future__ import annotations

import argparse
from collections import Counter
from contextlib import contextmanager
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import shutil
import tempfile
import uuid
from zipfile import ZipFile

import pptx_to_json as pptx


@contextmanager
def staging_directory(parent):
    # Inherit the parent ACL on Windows (Python 3.14's private temp ACL can
    # exclude a restricted process token). Only remove the exact folder created.
    parent = Path(parent).resolve()
    folder = parent / ('.deck-stage-' + uuid.uuid4().hex)
    folder.mkdir()
    try:
        yield folder
    finally:
        if folder.exists() and folder.resolve().parent == parent:
            shutil.rmtree(folder)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    # A unique temporary name prevents a partial JSON file on interruption.
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent,
                                     suffix='.tmp', delete=False) as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
        temporary = Path(stream.name)
    temporary.replace(path)


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def identifier(value):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]*', value):
        raise ValueError('IDs may contain only letters, numbers, underscores, and hyphens.')
    return value


def deck_root(workspace, deck):
    return Path(workspace) / 'decks' / identifier(deck)


def objects(blocks):
    for block in blocks:
        yield block
        yield from objects(block.get('children', []))


def refresh(slide):
    """Rebuild derived references after editing canonical content."""
    slide['scene'] = pptx.scene_model(slide['content'])
    slide['diagram_objects'] = [b for b in slide['content'] if b.get('object_type') in
                               ('sp', 'cxnSp', 'pic', 'grpSp', 'graphicFrame')]
    return slide


def validate_slide(slide):
    if not isinstance(slide, dict) or not isinstance(slide.get('title'), str):
        raise ValueError('A slide needs a string title.')
    if not isinstance(slide.get('content'), list):
        raise ValueError('A slide needs a content array.')
    for block in objects(slide['content']):
        if not isinstance(block, dict) or not isinstance(block.get('kind'), str):
            raise ValueError('Every content object needs a kind.')


def slide_hash(slide, data):
    # Reordering slides alone does not invalidate corrections.
    return digest({'slide': {k: v for k, v in slide.items() if k != 'number'},
                   'size': data.get('slide_size_emu'), 'theme': data.get('theme_colors')})


def flags(slide):
    result = ['visual-review-required']
    if slide.get('animation_timing_xml'):
        result.append('animation-fidelity')
    if slide.get('scene', {}).get('concept_candidates'):
        result.append('diagram-interpretation')
    for block in objects(slide['content']):
        if block.get('embedded_media_target') and not block.get('media_src'):
            result.append('missing-media')
        if block.get('kind') == 'drawing' or block.get('object_type') == 'graphicFrame':
            result.append('complex-object')
        if not block.get('bounds_emu'):
            result.append('missing-bounds')
    return sorted(set(result))


def current(workspace, deck):
    root = deck_root(workspace, deck)
    revision = read(root / 'current.json')['revision']
    return root, revision, read(root / 'raw' / revision / 'deck.json')


def sync_review(root, revision, data):
    path = root / 'review.json'
    review = read(path) if path.exists() else {'schema_version': 1, 'slides': {}, 'history': []}
    active = set()
    for slide in data['slides']:
        sid = slide['id']
        active.add(sid)
        expected = slide_hash(slide, data)
        old = review['slides'].get(sid)
        if old and old['expected'] == expected and old['status'] != 'removed':
            old['number'] = slide['number']
            continue
        entry = {'expected': expected, 'source_revision': revision, 'number': slide['number'],
                 'status': 'conflict' if old else 'pending', 'flags': flags(slide)}
        if old:
            review['history'].append({'slide_id': sid, 'record': deepcopy(old), 'at': timestamp()})
            entry['previous'] = old
        review['slides'][sid] = entry
    for sid, entry in review['slides'].items():
        if sid not in active:
            entry['status'] = 'removed'
    review['revision'] = revision
    write(path, review)
    return review


def extract_one(workspace, source, deck=None, exclude_notes=False):
    source = Path(source).resolve()
    deck = identifier(deck or (re.sub(r'[^a-z0-9]+', '-', source.stem.lower()).strip('-') or 'deck'))
    root = deck_root(workspace, deck)
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    extractor_hash = hashlib.sha256(Path(pptx.__file__).read_bytes()).hexdigest()
    pipeline_hash = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    revision = digest([source_hash, extractor_hash, pipeline_hash, exclude_notes])
    metadata_path = root / 'source.json'
    if metadata_path.exists() and read(metadata_path)['path'] != str(source):
        raise ValueError(f'{deck}: ID belongs to another source; pass a unique --deck ID.')
    raw = root / 'raw' / revision
    if not (raw / 'deck.json').exists():
        raw.mkdir(parents=True, exist_ok=True)
        # Snapshot first so the recorded source and extraction cannot diverge.
        shutil.copyfile(source, raw / 'source.pptx')
        if hashlib.sha256((raw / 'source.pptx').read_bytes()).hexdigest() != source_hash:
            raise ValueError('Source changed during extraction. Run again.')
        data = pptx.extract(raw / 'source.pptx', include_speaker_notes=not exclude_notes)
        data['source_file'] = source.name
        with ZipFile(raw / 'source.pptx') as archive:
            for slide in data['slides']:
                slide['id'] = f"{deck}:{slide['id']}"
                pptx.attach_media(archive, slide['content'], raw / 'media')
        # Include media bytes in the slide hash, including when OOXML names stay the same.
        for slide in data['slides']:
            for block in objects(slide['content']):
                if block.get('media_src'):
                    block['media_sha256'] = hashlib.sha256((raw / block['media_src']).read_bytes()).hexdigest()
        data['pipeline'] = {'deck': deck, 'revision': revision, 'source_sha256': source_hash,
                            'extractor_sha256': extractor_hash, 'pipeline_sha256': pipeline_hash}
        write(raw / 'deck.json', data)
        state = 'extracted'
    else:
        data = read(raw / 'deck.json')
        state = 'cached'
    write(metadata_path, {'path': str(source)})
    sync_review(root, revision, data)
    write(root / 'current.json', {'revision': revision})
    return {'deck': deck, 'revision': revision, 'state': state, 'slides': len(data['slides'])}


def review_action(workspace, deck, sid, action, actor, replacement=None, reason=''):
    root, revision, data = current(workspace, deck)
    review = read(root / 'review.json')
    slide = next((s for s in data['slides'] if s['id'] == sid), None)
    if slide is None:
        raise ValueError(f'Unknown slide ID: {sid}')
    record = review['slides'][sid]
    review['history'].append({'slide_id': sid, 'record': deepcopy(record), 'at': timestamp()})
    if action == 'propose':
        validate_slide(replacement)
        replacement = refresh(deepcopy(replacement))
        for key in ('id', 'source_part', 'number'):
            replacement[key] = slide[key]
        record['replacement'] = replacement
        record['status'] = 'proposed'
        record['expected'] = slide_hash(slide, data)
        record['source_revision'] = revision
    elif action == 'accept':
        if record['status'] != 'proposed':
            raise ValueError('Accept requires a current proposal. Re-propose conflicted repairs first.')
        record['status'] = 'accepted'
    elif action == 'approve':
        if record['status'] == 'proposed':
            raise ValueError('Accept or reject the proposal before approving the raw slide.')
        record.pop('replacement', None)
        record['status'] = 'approved'
    elif action == 'reject':
        if record['status'] != 'proposed':
            raise ValueError('Reject requires a current proposal.')
        record.pop('replacement', None)
        record['status'] = 'pending'
    record.update(actor=actor, reason=reason, updated_at=timestamp())
    write(root / 'review.json', review)
    return record


def copy_assets(value, source, destination):
    """Bundle referenced assets by content hash; reject escaping source paths."""
    if isinstance(value, list):
        for item in value:
            copy_assets(item, source, destination)
    elif isinstance(value, dict):
        if value.get('media_src'):
            asset = (source / value['media_src']).resolve()
            if not asset.is_relative_to(source.resolve()):
                raise ValueError(f'Asset must be inside its deck folder: {asset}')
            payload = asset.read_bytes()
            name = hashlib.sha256(payload).hexdigest() + asset.suffix.lower()
            target = destination / 'media' / name
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                target.write_bytes(payload)
            value['media_src'] = 'media/' + name
        for item in value.values():
            if isinstance(item, (list, dict)):
                copy_assets(item, source, destination)


def build(workspace, deck):
    root, revision, data = current(workspace, deck)
    review = read(root / 'review.json')
    unresolved = [s['id'] for s in data['slides']
                  if review['slides'][s['id']]['status'] not in ('approved', 'accepted')]
    if unresolved:
        raise ValueError(f'{len(unresolved)} slides still need review: {", ".join(unresolved[:8])}')
    result = deepcopy(data)
    for index, slide in enumerate(data['slides']):
        record = review['slides'][slide['id']]
        if record['expected'] != slide_hash(slide, data):
            raise ValueError(f"Stale review: {slide['id']}")
        result['slides'][index] = deepcopy(record.get('replacement', slide))
        result['slides'][index]['number'] = index + 1
        validate_slide(result['slides'][index])
        refresh(result['slides'][index])
    version = digest([result, review])
    dest = root / 'reviewed' / version
    if not (dest / 'deck.json').exists():
        # Materialize once: content and mirrored diagram references share no objects.
        result = json.loads(json.dumps(result))
        copy_assets(result, root / 'raw' / revision, dest)
        result['pipeline']['reviewed_version'] = version
        write(dest / 'review.json', review)
        write(dest / 'deck.json', result)
    write(root / 'reviewed-current.json', {'version': version})
    return dest / 'deck.json'


def compose(manifest, output):
    """Snapshot selected slides; future extraction never writes to this folder."""
    output = Path(output)
    if output.exists():
        raise ValueError('Authoring output already exists; choose a new directory to preserve edits.')
    spec = read(manifest)
    result = {'schema_version': '1.3', 'source_file': spec.get('title', 'Authored deck'),
              'authored': True, 'slides': []}
    selections = []
    for entry in spec['sources']:
        source_path = (Path(manifest).resolve().parent / entry['deck']).resolve()
        source = read(source_path)
        if not source.get('authored') and not source.get('pipeline', {}).get('reviewed_version'):
            raise ValueError('Compose from reviewed or authored decks, not unreviewed extraction.')
        lookup = {s['id']: s for s in source['slides']}
        for sid in entry.get('slides', list(lookup)):
            if sid not in lookup:
                raise ValueError(f'Unknown source slide: {sid}')
            slide = deepcopy(lookup[sid])
            slide['id'] = 'authored:' + uuid.uuid4().hex
            slide['provenance'] = {'slide_id': sid, 'deck_sha256': digest(source),
                                    'source': str(source_path), 'prior': slide.get('provenance')}
            slide.setdefault('slide_size_emu', source.get('slide_size_emu'))
            slide.setdefault('theme_colors', source.get('theme_colors', {}))
            validate_slide(slide)
            selections.append((slide, source_path.parent))
    if not selections:
        raise ValueError('A deck must contain at least one slide.')
    output.parent.mkdir(parents=True, exist_ok=True)
    with staging_directory(output.parent) as temporary:
        staging = Path(temporary) / 'deck'
        staging.mkdir()
        for number, (slide, source_dir) in enumerate(selections, 1):
            slide['number'] = number
            copy_assets(slide, source_dir, staging)
            result['slides'].append(slide)
        write(staging / 'deck.json', result)
        write(staging / 'composition.json', spec)
        output.mkdir()  # Exclusive creation; never merge into an existing authored deck.
        shutil.copytree(staging, output, dirs_exist_ok=True)
    return output / 'deck.json'


def render(source, output, template=None):
    source, output = Path(source).resolve(), Path(output).resolve()
    # Generated HTML may be rebuilt, but never over an input/authored directory.
    if output == source.parent or output in source.parents or output.is_relative_to(source.parent):
        raise ValueError('Render to a separate output directory, outside the input deck directory.')
    marker = output / '.deck-render.json'
    if output.exists() and not marker.exists():
        raise ValueError('Output is not a generated preview directory; refusing to overwrite it.')
    data = read(source)
    if not data.get('slides'):
        raise ValueError('No slides to render.')
    for number, slide in enumerate(data['slides'], 1):
        validate_slide(slide)
        slide['number'] = number
        refresh(slide)
    data = json.loads(json.dumps(data))
    output.mkdir(parents=True, exist_ok=True)
    copy_assets(data, source.parent, output)
    template = Path(template) if template else Path(__file__).parent / 'templates/viewer.html'
    write(output / 'deck.json', data)
    (output / 'index.html').write_text(template.read_text(encoding='utf-8'), encoding='utf-8')
    write(marker, {'source': str(source), 'content_sha256': digest(data),
                   'renderer_sha256': hashlib.sha256(template.read_bytes()).hexdigest()})
    return output / 'index.html'


def review_preview(workspace, deck, output):
    root, revision, data = current(workspace, deck)
    output = Path(output).resolve()
    if output.is_relative_to(root.resolve()) or root.resolve().is_relative_to(output):
        raise ValueError('Review preview must be separate from stored deck data.')
    marker = output / '.deck-review.json'
    if output.exists() and not marker.exists():
        raise ValueError('Output is not a generated review directory.')
    review = read(root / 'review.json')
    candidate = deepcopy(data)
    for index, slide in enumerate(data['slides']):
        record = review['slides'][slide['id']]
        # A conflicted correction stays in history; do not present it as current.
        if record['status'] in ('accepted', 'proposed'):
            candidate['slides'][index] = deepcopy(record['replacement'])
    output.mkdir(parents=True, exist_ok=True)
    render(root / 'raw' / revision / 'deck.json', output / 'raw')
    with staging_directory(output.parent) as temporary:
        copy_assets(candidate, root / 'raw' / revision, temporary)
        write(temporary / 'deck.json', candidate)
        render(temporary / 'deck.json', output / 'candidate')
    # Keep original relative media paths in exported proposals so they remain
    # relative to the source revision when submitted to `propose`.
    write(output / 'review.json', {'deck': deck, 'review': review, 'slides':
          [deepcopy(review['slides'][s['id']].get('replacement', s))
           if review['slides'][s['id']]['status'] in ('accepted', 'proposed') else s
           for s in data['slides']]})
    shutil.copyfile(root / 'raw' / revision / 'source.pptx', output / 'source.pptx')
    template = Path(__file__).parent / 'templates/review.html'
    (output / 'index.html').write_text(template.read_text(encoding='utf-8'), encoding='utf-8')
    write(marker, {'deck': deck, 'revision': revision})
    return output / 'index.html'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workspace', type=Path, default=Path('deck-workspace'))
    commands = parser.add_subparsers(dest='command', required=True)
    extract = commands.add_parser('extract', help='Extract a PPTX or recursively scan a directory.')
    extract.add_argument('input', type=Path)
    extract.add_argument('--deck', help='Stable source ID (single-file input only).')
    extract.add_argument('--exclude-speaker-notes', action='store_true')
    status = commands.add_parser('status', help='Inspect the persistent review queue.')
    status.add_argument('deck')
    review_command = commands.add_parser('review', help='Generate a browser review page and JSON correction editor.')
    review_command.add_argument('deck')
    review_command.add_argument('--output', type=Path, required=True)
    agent = commands.add_parser('agent-review', help='Invoke Codex or a configured agent and save review proposals.')
    agent.add_argument('deck')
    agent.add_argument('--agent-config', type=Path, help='JSON config with argv array and actor name.')
    agent.add_argument('--slide', action='append', help='Stable slide ID; repeat to select several slides.')
    agent.add_argument('--limit', type=int, default=1, help='Maximum slides per invocation (default: 1).')
    agent.add_argument('--timeout', type=int, default=300, help='Timeout in seconds per slide.')
    agent.add_argument('--references', type=Path, help='JSON map of slide IDs to original/candidate image paths.')
    agent.add_argument('--force', action='store_true', help='Repeat completed assessments of pending slides.')
    agent.add_argument('--model', help='Optional model override for the Codex adapter.')
    agent.add_argument('--dry-run', action='store_true', help='List eligible slides without launching an agent.')
    for action in ('propose', 'accept', 'reject', 'approve'):
        command = commands.add_parser(action)
        command.add_argument('deck')
        command.add_argument('slide', help='Stable slide ID from status or raw deck JSON.')
        command.add_argument('--actor', required=True, help='Human or agent reviewer identity.')
        command.add_argument('--reason', required=True)
        if action == 'propose':
            command.add_argument('--replacement', type=Path, required=True, help='Complete corrected slide JSON.')
    build_command = commands.add_parser('build', help='Build only after every active slide is reviewed.')
    build_command.add_argument('deck')
    composition = commands.add_parser('compose', help='Create a protected authored deck from a manifest.')
    composition.add_argument('manifest', type=Path)
    composition.add_argument('--output', type=Path, required=True)
    preview = commands.add_parser('render')
    preview.add_argument('source', type=Path, help='Path to a raw, reviewed, or authored deck.json.')
    preview.add_argument('--output', type=Path, required=True)
    preview.add_argument('--template', type=Path)
    args = parser.parse_args()
    try:
        if args.command == 'extract':
            if args.input.is_dir():
                if args.deck:
                    raise ValueError('--deck is only valid for single-file input.')
                sources = sorted(p for p in args.input.rglob('*') if p.suffix.lower() == '.pptx'
                                 and not p.resolve().is_relative_to(args.workspace.resolve()))
                if not sources:
                    raise ValueError('No PPTX files found.')
                result = []
                for source in sources:
                    relative = source.relative_to(args.input).with_suffix('').as_posix()
                    slug = re.sub(r'[^a-z0-9]+', '-', relative.lower()).strip('-') or 'deck'
                    result.append(extract_one(args.workspace, source, slug + '-' + digest(relative)[:8],
                                              args.exclude_speaker_notes))
            else:
                result = extract_one(args.workspace, args.input, args.deck, args.exclude_speaker_notes)
        elif args.command == 'status':
            root, _, _ = current(args.workspace, args.deck)
            result = read(root / 'review.json')
            result['counts'] = dict(Counter(s['status'] for s in result['slides'].values()))
        elif args.command == 'review':
            result = str(review_preview(args.workspace, args.deck, args.output))
        elif args.command == 'agent-review':
            from agent_review import run
            result = run(args.workspace, args.deck, args.agent_config, args.slide, args.limit,
                         args.timeout, args.references, args.force, args.model, args.dry_run)
        elif args.command in ('propose', 'accept', 'reject', 'approve'):
            result = review_action(args.workspace, args.deck, args.slide, args.command, args.actor,
                                   read(args.replacement) if args.command == 'propose' else None, args.reason)
        elif args.command == 'build':
            result = str(build(args.workspace, args.deck))
        elif args.command == 'compose':
            result = str(compose(args.manifest, args.output))
        else:
            result = str(render(args.source, args.output, args.template))
        print(json.dumps(result, ensure_ascii=False, indent=2))
        if args.command == 'agent-review' and result.get('failed'):
            parser.exit(1)
    except (ValueError, KeyError, OSError) as exc:
        parser.exit(1, f'Error: {exc}\n')


if __name__ == '__main__':
    main()
