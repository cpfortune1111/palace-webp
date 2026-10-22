import unittest
import ast
import json
from pathlib import Path
import tempfile
import shutil
import math
from decimal import Decimal, localcontext

from map_defaults import definition_map_defaults, map_default_value, imported_map_defaults


class MapDefaultImportTests(unittest.TestCase):
    def test_float32_subnormal_and_overflow_rounding(self):
        with localcontext() as context:
            context.prec = 250
            midpoint = Decimal(2) ** -150
            self.assertEqual(map_default_value(str(midpoint)), ('float', 0.0))
            self.assertEqual(map_default_value(str(midpoint + Decimal(2) ** -200)), ('float', 2 ** -149))
            self.assertEqual(map_default_value(str(midpoint - Decimal(2) ** -200)), ('float', 0.0))
        self.assertEqual(math.copysign(1, map_default_value('-0.0')[1]), -1)
        self.assertEqual(map_default_value('0x1.fffffeffffffp127'), ('float', (2 - 2 ** -23) * 2 ** 127))
        with self.assertRaisesRegex(ValueError, 'float32 range'):
            map_default_value('0x1.ffffffp127')

    def test_real_moon_builder_with_localized_nonempty_defaults(self):
        source = Path(__file__).resolve().parents[2] / 'outputs/moon'
        if not (source / 'manifest.json').exists():
            self.skipTest('Local Moon source import not available')
        from build_moon_runtime import compile_runtime
        with tempfile.TemporaryDirectory() as directory:
            imported = Path(directory) / 'moon'
            imported.mkdir()
            for name in ['manifest.json', 'state_sections.json', 'command_sections.json', 'air_sections.json']:
                shutil.copyfile(source / name, imported / name)
            for original in (source / 'original').rglob('*'):
                if original.is_file() and original.suffix.lower() in ['.def', '.cns', '.cmd', '.st']:
                    destination = imported / 'original' / original.relative_to(source / 'original')
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(original, destination)
            manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8-sig'))
            definition = imported / 'original' / manifest['definition']
            with definition.open('a', encoding='utf-8') as target:
                target.write('\n[Map]\nshared=3\ndefaultonly=7\n[en.Map]\nshared=3.0\ntext="Moon"\n')
            output = Path(directory) / 'runtime.json'
            compile_runtime(imported, output, 'en')
            bundle = json.loads(output.read_text(encoding='utf-8'))
            self.assertEqual(bundle['mapDefaults'], {'shared': 3.0, 'defaultonly': 7, 'text': 'Moon'})
            self.assertEqual(bundle['mapDefaultTypes'], {'shared': 'float', 'defaultonly': 'int', 'text': 'string'})
            compile_runtime(imported, output)
            bundle = json.loads(output.read_text(encoding='utf-8'))
            self.assertEqual(bundle['mapDefaults'], {'shared': 3, 'defaultonly': 7})
            self.assertEqual(bundle['mapDefaultTypes']['shared'], 'int')

    def test_manifest_definition_not_cns_and_containment(self):
        with tempfile.TemporaryDirectory() as directory:
            imported = Path(directory)
            (imported / 'original').mkdir()
            (imported / 'original/character.def').write_text('[Map]\nFloat=3.0\nInteger=3', encoding='utf-8')
            (imported / 'original/character.cns').write_text('[Map]\nwrong=99', encoding='utf-8')
            manifest = imported / 'manifest.json'
            manifest.write_text(json.dumps({'definition': 'character.def', 'dependencies': {'cns': 'character.cns'}}), encoding='utf-8')
            expected = {'mapDefaults': {'float': 3.0, 'integer': 3}, 'mapDefaultTypes': {'float': 'float', 'integer': 'int'}}
            self.assertEqual(imported_map_defaults(imported), expected)
            self.assertEqual(json.loads(json.dumps(imported_map_defaults(imported), allow_nan=False)), expected)
            manifest.write_text(json.dumps({'definition': '../outside.def'}), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'outside'):
                imported_map_defaults(imported)

    def test_all_builders_export_map_defaults(self):
        tools = Path(__file__).resolve().parent
        for filename in ['compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py', 'build_neptune_runtime.py', 'build_saturn_runtime.py']:
            tree = ast.parse((tools / filename).read_text(encoding='utf-8-sig'))
            imports = [node for node in ast.walk(tree) if isinstance(node, ast.ImportFrom) and node.module == 'map_defaults']
            self.assertEqual(len(imports), 1, filename)
            calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'imported_map_defaults']
            self.assertEqual(len(calls), 1, filename)

    def test_types_and_float_rounding(self):
        for raw, expected in [('3', ('int', 3)), ('3.0', ('float', 3.0)), ('3e0', ('float', 3.0)), ('2147483648', ('int', 2147483647)), ('-2147483649', ('int', -2147483648)), ('0x1.8p1', ('float', 3.0)), ('1_2.5', ('float', 12.5)), ('NaN', ('float', 'NaN')), ('-Inf', ('float', '-Infinity'))]:
            self.assertEqual(map_default_value(raw), expected)
        self.assertEqual(map_default_value('1.23456789'), ('float', 1.2345678806304932))
        self.assertEqual(map_default_value('1.000000059604644775390625000001'), ('float', 1.0000001192092896))
        self.assertEqual(map_default_value('1.000000059604644775390625'), ('float', 1.0))
        self.assertEqual(map_default_value('0x1.00000100000000000001p0'), ('float', 1.0000001192092896))
        self.assertEqual(map_default_value('9' * 5000), ('int', 2147483647))
        self.assertEqual(map_default_value('-' + '9' * 5000), ('int', -2147483648))
        with self.assertRaisesRegex(ValueError, 'float32 range'):
            map_default_value('0x1p99999')

    def test_quoted_strings(self):
        self.assertEqual(map_default_value(r'"A\x42\103\u263a\U0001f319\n"'), ('string', 'ABC☺🌙\n'))
        self.assertEqual(map_default_value('"3"'), ('string', '3'))
        for raw in [r'"\q"', r'"\400"', r'"\uD800"', r'"\U00110000"', '"unfinished', 'word', '1/2', '1e999', '1e39', '1__2.0']:
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                map_default_value(raw)

    def test_first_section_and_duplicate(self):
        result = definition_map_defaults('[Map]\nFloat=3.0\nFLOAT=99\nText="Moon"\n[Map]\nlater=9')
        self.assertEqual(result, {'mapDefaults': {'float': 3.0, 'text': 'Moon'}, 'mapDefaultTypes': {'float': 'float', 'text': 'string'}})

    def test_localized_map_order_and_types(self):
        default = '[Map]\nshared=3\ndefaultonly=1\n'
        localized = '[en.Map]\nshared=3.0\nlocalonly="Moon"\n'
        result = definition_map_defaults(default + localized + '[en.Map]\nignored=9', 'en')
        self.assertEqual(result, {'mapDefaults': {'shared': 3.0, 'defaultonly': 1, 'localonly': 'Moon'}, 'mapDefaultTypes': {'shared': 'float', 'defaultonly': 'int', 'localonly': 'string'}})
        early = definition_map_defaults(localized + default, 'en')
        self.assertNotIn('defaultonly', early['mapDefaults'])
        self.assertEqual(early['mapDefaultTypes']['shared'], 'float')
        self.assertEqual(definition_map_defaults(localized + default), definition_map_defaults(default))
        self.assertEqual(definition_map_defaults(localized + default, 'ja'), definition_map_defaults(default))
        self.assertEqual(definition_map_defaults('[en.Map]\n[Map]\nignored=1', 'en'), {})
        self.assertEqual(definition_map_defaults('[Map ]\nignored=1\n' + localized, 'en'), definition_map_defaults(localized, 'en'))


if __name__ == '__main__':
    unittest.main()
