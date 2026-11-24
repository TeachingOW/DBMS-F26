import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from zipfile import ZipFile

import deck_pipeline as pipeline


def fixture(path, text='A generic slide', media=b'first-image', second=False):
    """Minimal OOXML fixture independent of course slides and third-party packages."""
    p = 'http://schemas.openxmlformats.org/presentationml/2006/main'
    a = 'http://schemas.openxmlformats.org/drawingml/2006/main'
    r = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    rel = 'http://schemas.openxmlformats.org/package/2006/relationships'
    with ZipFile(path, 'w') as archive:
        archive.writestr('ppt/presentation.xml', f'<p:presentation xmlns:p="{p}" xmlns:r="{r}"><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst><p:sldSz cx="9144000" cy="6858000"/></p:presentation>')
        archive.writestr('ppt/_rels/presentation.xml.rels', f'<Relationships xmlns="{rel}"><Relationship Id="rId1" Target="slides/slide1.xml"/></Relationships>')
        archive.writestr('ppt/slides/slide1.xml', f'<p:sld xmlns:p="{p}" xmlns:a="{a}" xmlns:r="{r}"><p:cSld><p:spTree><p:nvGrpSpPr/><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Text"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="100" y="100"/><a:ext cx="100000" cy="100000"/></a:xfrm></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>{text}</a:t></a:r></a:p></p:txBody></p:sp><p:pic><p:nvPicPr><p:cNvPr id="3" name="Picture"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="img"/></p:blipFill><p:spPr><a:xfrm><a:off x="200" y="200"/><a:ext cx="100000" cy="100000"/></a:xfrm></p:spPr></p:pic></p:spTree></p:cSld></p:sld>')
        archive.writestr('ppt/slides/_rels/slide1.xml.rels', f'<Relationships xmlns="{rel}"><Relationship Id="img" Target="../media/image1.png"/></Relationships>')
        archive.writestr('ppt/media/image1.png', media)


class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = pipeline.staging_directory(Path(__file__).resolve().parent.parent)
        self.root = self.tmp.__enter__()
        self.addCleanup(self.tmp.__exit__, None, None, None)
        self.workspace = self.root / 'workspace'
        self.source = self.root / 'Unrelated SQL.pptx'
        fixture(self.source)
        self.initial = pipeline.extract_one(self.workspace, self.source, 'sample')
        self.deck_root, self.revision, self.raw = pipeline.current(self.workspace, 'sample')
        self.sid = self.raw['slides'][0]['id']

    def approve(self):
        pipeline.review_action(self.workspace, 'sample', self.sid, 'approve', 'human', reason='Checked')
        return pipeline.build(self.workspace, 'sample')

    def test_incremental_extraction(self):
        self.assertEqual(pipeline.extract_one(self.workspace, self.source, 'sample')['state'], 'cached')
        self.assertEqual(self.sid, 'sample:256')

    def test_pending_blocks_build(self):
        with self.assertRaisesRegex(ValueError, 'need review'):
            pipeline.build(self.workspace, 'sample')

    def test_accepted_fix_survives_rerun(self):
        slide = self.raw['slides'][0]
        slide['title'] = 'Reviewed title'
        pipeline.review_action(self.workspace, 'sample', self.sid, 'propose', 'agent', slide, 'Repair')
        pipeline.review_action(self.workspace, 'sample', self.sid, 'accept', 'human', reason='Verified')
        pipeline.extract_one(self.workspace, self.source, 'sample')
        built = pipeline.read(pipeline.build(self.workspace, 'sample'))
        self.assertEqual(built['slides'][0]['title'], 'Reviewed title')
        self.assertNotEqual(pipeline.read(self.deck_root / 'raw' / self.revision / 'deck.json')['slides'][0]['title'], 'Reviewed title')

    def test_source_change_conflicts(self):
        self.approve()
        fixture(self.source, 'Changed')
        pipeline.extract_one(self.workspace, self.source, 'sample')
        review = pipeline.read(self.deck_root / 'review.json')
        self.assertEqual(review['slides'][self.sid]['status'], 'conflict')
        self.assertTrue((self.deck_root / 'raw' / self.revision / 'deck.json').exists())
        with self.assertRaises(ValueError):
            pipeline.build(self.workspace, 'sample')

    def test_media_change_conflicts(self):
        self.approve()
        fixture(self.source, media=b'changed-image')
        pipeline.extract_one(self.workspace, self.source, 'sample')
        self.assertEqual(pipeline.read(self.deck_root / 'review.json')['slides'][self.sid]['status'], 'conflict')

    def test_compose_retains_assets_and_protects_edits(self):
        reviewed = self.approve()
        other = self.root / 'other.pptx'
        fixture(other, 'Second deck', media=b'second-image')
        pipeline.extract_one(self.workspace, other, 'other')
        pipeline.review_action(self.workspace, 'other', 'other:256', 'approve', 'human')
        other_reviewed = pipeline.build(self.workspace, 'other')
        manifest = self.root / 'manifest.json'
        pipeline.write(manifest, {'title': 'Combined', 'sources': [{'deck': str(reviewed)}, {'deck': str(other_reviewed)}]})
        authored = pipeline.compose(manifest, self.root / 'authored')
        data = pipeline.read(authored)
        self.assertEqual(len({s['id'] for s in data['slides']}), 2)
        self.assertEqual(len(list((authored.parent / 'media').glob('*'))), 2)
        data['slides'][0]['title'] = 'My permanent edit'
        pipeline.write(authored, data)
        pipeline.extract_one(self.workspace, self.source, 'sample')
        self.assertEqual(pipeline.read(authored)['slides'][0]['title'], 'My permanent edit')
        with self.assertRaisesRegex(ValueError, 'already exists'):
            pipeline.compose(manifest, authored.parent)
        rendered = pipeline.render(authored, self.root / 'preview')
        self.assertTrue(rendered.exists())
        self.assertEqual(len(list((rendered.parent / 'media').glob('*'))), 2)

    def test_render_cannot_overwrite_authored_or_raw(self):
        reviewed = self.approve()
        with self.assertRaises(ValueError):
            pipeline.render(reviewed, reviewed.parent)
        with self.assertRaises(ValueError):
            pipeline.render(reviewed, self.deck_root)

    def test_source_id_collision_is_rejected(self):
        other = self.root / 'other.pptx'
        fixture(other)
        with self.assertRaisesRegex(ValueError, 'another source'):
            pipeline.extract_one(self.workspace, other, 'sample')

    def test_reject_does_not_approve(self):
        pipeline.review_action(self.workspace, 'sample', self.sid, 'propose', 'agent', self.raw['slides'][0])
        pipeline.review_action(self.workspace, 'sample', self.sid, 'reject', 'human')
        with self.assertRaises(ValueError):
            pipeline.build(self.workspace, 'sample')

    def test_cli_runs_away_from_repository(self):
        script = Path(pipeline.__file__).parent / 'pptx_to_json.py'
        result = subprocess.run([sys.executable, str(script), '--workspace', str(self.root / 'cli'),
                                 'extract', str(self.source)], cwd=self.root, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)['slides'], 1)

    def test_review_page_tracks_candidate_and_source(self):
        slide = self.raw['slides'][0]
        slide['title'] = 'Candidate title'
        pipeline.review_action(self.workspace, 'sample', self.sid, 'propose', 'agent', slide)
        page = pipeline.review_preview(self.workspace, 'sample', self.root / 'review')
        self.assertTrue((page.parent / 'source.pptx').exists())
        self.assertEqual(pipeline.read(page.parent / 'candidate/deck.json')['slides'][0]['title'], 'Candidate title')
        self.assertNotEqual(pipeline.read(page.parent / 'raw/deck.json')['slides'][0]['title'], 'Candidate title')
        self.assertEqual(pipeline.read(page.parent / 'review.json')['slides'][0]['content'][1]['media_src'], 'media/image1.png')

    def test_batch_includes_sql_and_namespaces_duplicate_filenames(self):
        source_dir = self.root / 'input'
        for folder in ('one', 'two'):
            (source_dir / folder).mkdir(parents=True)
            fixture(source_dir / folder / 'SQL.pptx')
        script = Path(pipeline.__file__).parent / 'pptx_to_json.py'
        result = subprocess.run([sys.executable, str(script), '--workspace', str(self.root / 'batch'),
                                 'extract', str(source_dir)], cwd=self.root, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        decks = json.loads(result.stdout)
        self.assertEqual(len({d['deck'] for d in decks}), 2)


if __name__ == '__main__':
    unittest.main()
