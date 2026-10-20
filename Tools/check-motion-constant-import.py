import ast
import json
from pathlib import Path
import unittest

from motion_constants import imported_motion_constants, motion_constants


TOOLS = Path(__file__).resolve().parent


class MotionConstantImportTests(unittest.TestCase):
    def test_complete_pinned_name_catalog(self):
        rows = json.loads((TOOLS.parent / 'Docs/CONST-AUDIT.json').read_text(encoding='utf-8-sig'))['rows']
        names = {row['name'] for row in rows if row['name'].startswith(('velocity.', 'movement.'))}
        self.assertEqual(len(names), 85)
        self.assertEqual(set(motion_constants('')), names)

    def test_defaults(self):
        result = motion_constants('')
        expected = {'velocity.walk.fwd.x': 0, 'velocity.run.back.y': 0,
                    'velocity.jump.y': 0, 'velocity.runjump.y': 0,
                    'velocity.air.gethit.groundrecover.x': -0.15000000596046448,
                    'velocity.air.gethit.groundrecover.y': -3.5,
                    'velocity.air.gethit.airrecover.mul.y': 0.20000000298023224,
                    'velocity.air.gethit.airrecover.add.y': -4.5,
                    'velocity.ground.gethit.ko.xmul': 0.6600000262260437,
                    'movement.airjump.num': 0, 'movement.airjump.height': 0,
                    'movement.yaccel': 0.4399999976158142,
                    'movement.air.gethit.groundrecover.ground.threshold': -20,
                    'movement.down.bounce.offset.y': 20,
                    'movement.down.gethit.offset.y': 15}
        for name, value in expected.items():
            with self.subTest(name=name):
                self.assertEqual(result[name], value)

    def test_localcoord_scales_only_defaults_before_overrides(self):
        result = motion_constants('[Velocity]\njump.neu=2,-16\n[Movement]\nyaccel=1.8', 1280)
        self.assertEqual(result['velocity.air.gethit.groundrecover.x'], -0.6000000238418579)
        self.assertEqual(result['velocity.air.gethit.airrecover.add.y'], -18)
        self.assertEqual(result['velocity.air.gethit.airrecover.mul.y'], 0.20000000298023224)
        self.assertEqual(result['velocity.runjump.y'], -16)
        self.assertEqual(result['movement.stand.friction.threshold'], 8)
        self.assertEqual(result['movement.yaccel'], 1.7999999523162842)
        self.assertEqual(result['movement.stand.friction'], 0.8500000238418579)

    def test_shared_fixture_and_inheritance(self):
        text = (TOOLS / 'fixtures/motion-constants.cns').read_text(encoding='utf-8-sig')
        result = motion_constants(text)
        expected = json.loads((TOOLS / 'fixtures/motion-constants.json').read_text(encoding='utf-8-sig'))
        self.assertEqual({'originalMotionConstants': result}, expected)
        for name, value in {'velocity.walk.fwd.x': 4, 'velocity.jump.y': -16,
                            'velocity.runjump.back.x': -7, 'velocity.runjump.back.y': -20,
                            'velocity.runjump.fwd.x': 11, 'velocity.runjump.y': -16,
                            'velocity.airjump.neu.x': 2, 'velocity.airjump.y': -12,
                            'velocity.airjump.back.x': -7, 'velocity.airjump.fwd.x': 9,
                            'velocity.walk.up.z': 3, 'velocity.run.down.z': 6,
                            'movement.airjump.num': 2, 'movement.airjump.height': 80,
                            'movement.down.bounce.offset.x': 0,
                            'movement.down.bounce.offset.y': 30}.items():
            with self.subTest(name=name):
                self.assertEqual(result[name], value)

    def test_empty_components_prefixes_and_nonfinite_encoding(self):
        result = motion_constants('[Velocity]\njump.neu=, -9tail\nrunjump.fwd=,\nrun.up=1e100,2,\n[Movement]\nairjump.num=-2.9\nyaccel=,\n')
        self.assertEqual(result['velocity.runjump.y'], -9)
        self.assertEqual(result['velocity.run.up.x'], 'Infinity')
        self.assertEqual(result['movement.airjump.num'], -2)
        self.assertEqual(result['movement.yaccel'], 0.4399999976158142)
        json.dumps(result, allow_nan=False)

    def test_current_payloads_match_original_sections(self):
        for name, payload in [('moon', 'Char/Moon/Battle/moon_runtime.json'),
                              ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
                              ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
                              ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
                              ('venus', 'Char/Venus/venus_battle200.json')]:
            with self.subTest(character=name):
                expected = imported_motion_constants(TOOLS.parent.parent / 'outputs' / name)
                actual = json.loads((TOOLS.parent / payload).read_text(encoding='utf-8-sig'))
                self.assertEqual(actual['originalMotionConstants'], expected['originalMotionConstants'])

    def test_all_export_hooks(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'imported_motion_constants']
                self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
