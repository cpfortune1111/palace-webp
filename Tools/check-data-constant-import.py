import ast
import json
from pathlib import Path
import unittest

from data_constants import data_constants, imported_data_constants, native_atoi


TOOLS = Path(__file__).resolve().parent


class DataConstantImportTests(unittest.TestCase):
    def test_current_character_payloads_match_actual_original_data(self):
        for name, payload in [('moon', 'Char/Moon/Battle/moon_runtime.json'),
                              ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
                              ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
                              ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
                              ('venus', 'Char/Venus/venus_battle200.json')]:
            with self.subTest(character=name):
                expected = imported_data_constants(TOOLS.parent.parent / 'outputs' / name)
                actual = json.loads((TOOLS.parent / payload).read_text(encoding='utf-8-sig'))
                self.assertEqual(actual['dataConstants'], expected['dataConstants'])

    def test_shared_raw_browser_fixture(self):
        source = (TOOLS / 'fixtures/data-constants.cns').read_text(encoding='utf-8-sig')
        expected = json.loads((TOOLS / 'fixtures/data-constants.json').read_text(encoding='utf-8-sig'))
        self.assertEqual({'dataConstants': data_constants(source)}, expected)

    def test_all_names_and_native_defaults(self):
        actual = data_constants('')
        inventory = json.loads((TOOLS.parent / 'Docs/CONST-AUDIT.json').read_text(encoding='utf-8-sig'))
        self.assertEqual(set(actual), {row['name'] for row in inventory['rows'] if row['name'].startswith('data.')})
        self.assertEqual(len(actual), 18)
        self.assertEqual(actual['data.volume'], 256)
        self.assertEqual(actual['data.intpersistindex'], 2147483647)
        self.assertEqual(actual['data.fall.defence_mul'], 0.6666666865348816)

    def test_life_dependencies_first_section_and_empty_values(self):
        actual = data_constants('[Data]\nlife=1500\nLIFE=2000\npower=2500\nintpersistindex=\nfloatpersistindex=,12\n[Data]\nlife=3000')
        self.assertEqual([actual['data.life'], actual['data.dizzypoints'], actual['data.guardpoints']], [1500] * 3)
        self.assertEqual(actual['data.power'], 2500)
        self.assertEqual(actual['data.intpersistindex'], 0)
        self.assertEqual(actual['data.floatpersistindex'], 0)

    def test_integer_prefixes_bounds_volume_and_reciprocal(self):
        self.assertEqual(native_atoi('12.9tail'), 12)
        self.assertEqual(native_atoi('-99999999999'), -2147483648)
        self.assertEqual(native_atoi('99999999999'), 2147483647)
        self.assertEqual(native_atoi('bad'), 0)
        self.assertEqual(data_constants('[Data]\nvolume=-3')['data.volume'], 255)
        self.assertEqual(data_constants('[Data]\nvolumescale=100')['data.volume'], 256)
        self.assertEqual(data_constants('[Data]\nvolume=20\nvolumescale=,1')['data.volume'], 51)
        self.assertEqual(data_constants('[Data]\nvolumescale=2147483647')['data.volume'], -2)
        self.assertEqual(data_constants('[Data]\nfall.defence_up=-100')['data.fall.defence_mul'], 'Infinity')
        self.assertEqual(data_constants('[Data]\nfall.defence_up=100')['data.fall.defence_mul'], .5)

    def test_all_builder_hooks(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'imported_data_constants']
                self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
