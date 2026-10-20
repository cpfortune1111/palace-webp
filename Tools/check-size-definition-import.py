import ast
import json
from pathlib import Path
import unittest

from size_definition import imported_size_definition, size_definition


TOOLS = Path(__file__).resolve().parent


class SizeDefinitionImportTests(unittest.TestCase):
    def test_current_payloads_match_original_size_sections(self):
        for name, payload in [('moon', 'Char/Moon/Battle/moon_runtime.json'),
                              ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
                              ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
                              ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
                              ('venus', 'Char/Venus/venus_battle200.json')]:
            with self.subTest(character=name):
                expected = imported_size_definition(TOOLS.parent.parent / 'outputs' / name)
                actual = json.loads((TOOLS.parent / payload).read_text(encoding='utf-8-sig'))
                self.assertEqual(actual['sizeDefinition'], expected['sizeDefinition'])

    def test_shared_raw_fixture(self):
        source = (TOOLS / 'fixtures/size-definition.cns').read_text(encoding='utf-8-sig')
        expected = json.loads((TOOLS / 'fixtures/size-definition.json').read_text(encoding='utf-8-sig'))
        self.assertEqual({'sizeDefinition': size_definition(source)}, expected)

    def test_defaults_and_independent_box_arrays(self):
        size = size_definition('')
        self.assertEqual(size['standbox'], [-16, -60, 16, 0])
        self.assertEqual(size['airbox'], [-12, -60, 12, 0])
        self.assertEqual(size['headPosition'], [-5, -90])
        self.assertEqual(size['weight'], 100)
        size['standbox'][0] = 99
        self.assertEqual(size['crouchbox'][0], -16)

    def test_localcoord_scales_defaults_before_explicit_fields(self):
        size = size_definition('[Size]\nground.front=40\nhead.pos=,-300', 1280)
        self.assertEqual(size['standbox'], [-64, -240, 40, 0])
        self.assertEqual(size['headPosition'], [-20, -300])
        self.assertEqual(size['attackDistance']['y'], [4000, 4000])
        self.assertEqual(size['projectileAttackDistance']['z'], [40, 40])
        self.assertEqual(size['xscale'], 1)
        self.assertEqual(size['weight'], 100)

    def test_legacy_boxes_before_explicit_partial_overrides(self):
        size = size_definition('[Size]\nheight=100\nground.back=20\nground.front=30\nair.back=12\nair.front=14\nstand.sizebox=,-150,,3\ncrouch.sizebox=-25,-50,26,4\nair.sizebox=,,15\n[Size]\nheight=999')
        self.assertEqual(size['standbox'], [-20, -150, 30, 3])
        self.assertEqual(size['crouchbox'], [-25, -50, 26, 4])
        self.assertEqual(size['airbox'], [-12, -100, 15, 0])
        self.assertEqual(size['downbox'], [-20, -100, 30, 0])

    def test_native_prefix_and_legacy_blank_component_negation(self):
        size = size_definition('[Size]\nheight=,9\nground.back=,9\nxscale=1.5tail\nweight=123.9\nattack.dist=200\nattack.dist.width=240,30\nhead.pos=,-300\nproj.doscale=2')
        self.assertEqual(size['standbox'][0:2], [16, 60])
        self.assertEqual(size['xscale'], 1.5)
        self.assertEqual(size['weight'], 123)
        self.assertEqual(size['headPosition'], [-5, -300])
        self.assertEqual(size['attackDistance']['x'], [240, 30])
        self.assertEqual(size['projectileDoScale'], 2)
        json.dumps(size, allow_nan=False)

    def test_all_builder_hooks(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'imported_size_definition']
                self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
