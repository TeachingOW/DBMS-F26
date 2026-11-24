import json
from pathlib import Path
import sys
import unittest

import agent_review
import deck_pipeline as dp
import test_deck_pipeline


class AgentReviewTests(unittest.TestCase):
    setUp = test_deck_pipeline.PipelineTests.setUp

    def config(self, mode='propose'):
        script = self.root / 'test_reviewer.py'
        script.write_text('''import json, sys, time
from pathlib import Path
request = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
mode = sys.argv[3]
if mode == 'timeout': time.sleep(10)
if mode == 'exit': sys.exit(7)
slide = request['slide']
slide['title'] = 'Agent corrected title'
response = {'decision': 'propose', 'reason': 'Source confirms title',
            'evidence': ['Source title object inspected'],
            'replacement_json': json.dumps(slide), 'visual_review': False}
if mode == 'no_change': response.update(decision='no_change', replacement_json='')
if mode == 'invalid': response['replacement_json'] = '{broken'
if mode == 'false_visual': response['visual_review'] = True
if mode == 'stale':
    path = Path(sys.argv[4]); data=json.loads(path.read_text(encoding='utf-8'))
    data['slides'][request['slide_id']]['status']='approved'
    path.write_text(json.dumps(data),encoding='utf-8')
Path(sys.argv[2]).write_text(json.dumps(response), encoding='utf-8')
''', encoding='utf-8')
        config = self.root / 'agent.json'
        dp.write(config, {'actor': 'test-reviewer', 'argv': [sys.executable, str(script),
                  '{request}', '{response}', mode, str(self.deck_root / 'review.json')]})
        return config

    def test_invokes_process_and_imports_proposal_without_approval(self):
        result = agent_review.run(self.workspace, 'sample', self.config())
        self.assertEqual(result['completed'], 1)
        record = dp.read(self.deck_root / 'review.json')['slides'][self.sid]
        self.assertEqual(record['status'], 'proposed')
        self.assertEqual(record['replacement']['title'], 'Agent corrected title')
        self.assertEqual(record['agent_review']['actor'], 'test-reviewer')
        self.assertTrue((Path(result['runs'][0]['run_dir']) / 'request.json').exists())
        with self.assertRaises(ValueError): dp.build(self.workspace, 'sample')

    def test_no_change_resumes_without_repeating_or_approving(self):
        config = self.config('no_change')
        first = agent_review.run(self.workspace, 'sample', config)
        second = agent_review.run(self.workspace, 'sample', config)
        self.assertEqual(first['completed'], 1)
        self.assertEqual(second['runs'], [])
        self.assertEqual(dp.read(self.deck_root / 'review.json')['slides'][self.sid]['status'], 'pending')
        self.assertEqual(agent_review.run(self.workspace, 'sample', config, force=True)['completed'], 1)

    def test_invalid_response_and_false_visual_claim_leave_review_unchanged(self):
        before = dp.read(self.deck_root / 'review.json')
        for mode in ('invalid', 'false_visual', 'exit'):
            with self.subTest(mode=mode):
                result = agent_review.run(self.workspace, 'sample', self.config(mode))
                self.assertEqual(result['failed'], 1)
                self.assertEqual(dp.read(self.deck_root / 'review.json'), before)

    def test_timeout_records_failure_without_proposal(self):
        result = agent_review.run(self.workspace, 'sample', self.config('timeout'), timeout=.1)
        self.assertEqual(result['failed'], 1)
        self.assertEqual(dp.read(self.deck_root / 'review.json')['slides'][self.sid]['status'], 'pending')

    def test_concurrent_decision_is_not_overwritten(self):
        result = agent_review.run(self.workspace, 'sample', self.config('stale'))
        self.assertEqual(result['failed'], 1)
        self.assertIn('review changed', result['runs'][0]['error'])
        self.assertEqual(dp.read(self.deck_root / 'review.json')['slides'][self.sid]['status'], 'approved')

    def test_dry_run_does_not_launch(self):
        result = agent_review.run(self.workspace, 'sample', self.config('exit'), dry_run=True)
        self.assertEqual(result['slides'], [self.sid])
        self.assertFalse((self.deck_root / 'agent-runs').exists())


if __name__ == '__main__':
    unittest.main()
