import hashlib
import json
import unittest
from pathlib import Path

from import_venus_sources import air_sprite_references
from audit_venus_sources import semantic_states


class ImportTests(unittest.TestCase):
    def test_empty_frames_keep_time(self):
        actions = [{'id': 9041, 'frames': [{'sprite': [904, -1], 'ticks': duration} for duration in (2, 3, 4)]}]
        empty, missing = air_sprite_references(actions, set())
        self.assertEqual([frame['ticks'] for frame in empty], [2, 3, 4])
        self.assertEqual(missing, [])

    def test_other_negative_numbers_wrap(self):
        actions = [{'id': 1, 'frames': [{'sprite': [3, -2], 'ticks': 1}, {'sprite': [-1, 0], 'ticks': 5}]}]
        empty, missing = air_sprite_references(actions, {(3, 65534)})
        self.assertEqual(len(empty), 1)
        self.assertEqual(missing, [])

    def test_genuine_missing_pair(self):
        empty, missing = air_sprite_references([{'id': 645, 'frames': [{'sprite': [645, 0], 'ticks': 24}]}], {(951, 9)})
        self.assertEqual(empty, [])
        self.assertEqual(missing[0]['sprite'], [645, 0])

    def test_author_intentional_blanks(self):
        actions = [{'id': 152, 'frames': [{'sprite': [122, 0], 'ticks': -1}, {'sprite': [951, 99], 'ticks': 24}]}]
        empty, missing = air_sprite_references(actions, set())
        self.assertEqual([frame['ticks'] for frame in empty], [-1, 24])
        self.assertEqual(missing, [])

    def test_source_snapshot(self):
        root = Path('outputs/venus')
        if not (root / 'original/venus.snd').exists():
            self.skipTest('Full local source import required for snapshot integration test')
        manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
        for entry in manifest['files']:
            self.assertEqual(hashlib.sha256((root / 'original' / entry['path']).read_bytes()).hexdigest(), entry['sha256'])
        self.assertEqual(len(manifest['missingAIRSpriteReferences']), 9)
        self.assertEqual(len([frame for frame in manifest['intentionalEmptyAIRFrames'] if frame['action'] == 9041]), 3)
        report = json.loads(Path('outputs/venus-audit/source_audit.json').read_text(encoding='utf-8'))
        self.assertEqual(len(report['soundExports']), 67)
        self.assertEqual(len(report['staticMissingReview']), 6)
        self.assertNotEqual(semantic_states(Path('work/legacy-venus.cns'))[200],
                            semantic_states(root / 'original/venus.cns')[200])


if __name__ == '__main__':
    unittest.main()
