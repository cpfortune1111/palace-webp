import ast
import json
import math
from pathlib import Path
import tempfile
import unittest

from custom_constants import constants_section, imported_custom_constants, native_atof


TOOLS = Path(__file__).resolve().parent


class CustomConstantImportTests(unittest.TestCase):
    def test_shared_browser_fixture_is_actual_parser_output(self):
        source = (TOOLS / 'fixtures/custom-constants.cns').read_text(encoding='utf-8-sig')
        expected = json.loads((TOOLS / 'fixtures/custom-constants.json').read_text(encoding='utf-8-sig'))
        self.assertEqual({'customConstants': constants_section(source)}, expected)

    def test_first_section_and_key_and_native_tokens(self):
        source = '[Constants extra]\nignored=1\n[CONSTANTS] ; comment\nRate = 1.23456789 ; first\nRATE=99\nother words = 3\nempty value\n[Constants]\nlater=7'
        values = constants_section(source)
        self.assertEqual(set(values), {'rate', 'other', 'empty'})
        self.assertAlmostEqual(values['rate'], 1.2345678806304932)
        self.assertEqual(values['other'], 3)
        self.assertEqual(values['empty'], 0)
        self.assertEqual(constants_section('[Constants ]\nignored=1'), {})

    def test_native_numeric_prefix_and_sign_exponent_quirk(self):
        for text, expected in [('1+2', 1), ('bad', 0), ('12.5tail', 12.5),
                               ('1e-2', .01), ('-1e-2', -100), ('+1e-2', 100),
                               ('-1.5e-2', -150), ('1.2.3', 1.2), ('', 0)]:
            with self.subTest(text=text):
                self.assertAlmostEqual(native_atof(text), expected)
        self.assertEqual(math.copysign(1, native_atof('-0')), -1)
        values = constants_section('[Constants]\nbig=1e999\nnotnumber=0e999\nnegative=-1e999')
        self.assertEqual(values, {'big': 'Infinity', 'notnumber': 'NaN', 'negative': '-Infinity'})
        json.dumps(values, allow_nan=False)

    def test_manifest_source_and_path_boundary(self):
        with tempfile.TemporaryDirectory() as directory:
            imported = Path(directory)
            (imported / 'original').mkdir()
            (imported / 'original/main.cns').write_text('[Constants]\nanswer=42', encoding='utf-8')
            manifest = imported / 'manifest.json'
            manifest.write_text(json.dumps({'dependencies': {'cns': 'main.cns'}}), encoding='utf-8')
            self.assertEqual(imported_custom_constants(imported), {'customConstants': {'answer': 42}})
            manifest.write_text(json.dumps({'dependencies': {'cns': '../outside.cns'}}), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'outside'):
                imported_custom_constants(imported)

    def test_all_builders_export_the_same_metadata(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'imported_custom_constants']
                self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
