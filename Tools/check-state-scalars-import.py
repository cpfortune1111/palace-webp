import ast
import copy
import json
from pathlib import Path
import unittest

from state_scalars import STATE_SCALAR_FIELDS, import_bundle_state_scalars, state_scalar
from state_velocity import STATE_GROUPS


TOOLS = Path(__file__).resolve().parent


class StateScalarImportTests(unittest.TestCase):
    def test_literals_and_expressions(self):
        self.assertEqual(state_scalar('+2'), 2)
        self.assertEqual(state_scalar('-1000'), -1000)
        self.assertEqual(state_scalar('Ctrl * 10 + Power'), 'Ctrl * 10 + Power')
        self.assertEqual(state_scalar('3.9'), '3.9')
        self.assertEqual(state_scalar('999999999999999999999999'), '999999999999999999999999')
        self.assertEqual(state_scalar('-2147483648'), -2147483648)

    def test_all_groups_first_definition_key_and_omission(self):
        bundle = {group: {'200': {'ctrl': 0, 'sprpriority': 0, 'poweradd': 0}} for group in STATE_GROUPS}
        bundle['state200'] = {'ctrl': 0, 'sprpriority': 0, 'poweradd': 0}
        definitions = [{'id': 200, 'entries': [{'text': 'CTRL = Anim = 11'}, {'text': 'ctrl = 0'},
                                              {'text': 'poweradd = Ctrl * 10'}, {'text': 'sprpriority = '}]},
                       {'id': 200, 'entries': [{'text': 'ctrl = 1'}]}]
        import_bundle_state_scalars(bundle, definitions)
        for group in STATE_GROUPS:
            self.assertEqual(bundle[group]['200'], {'ctrl': 'Anim = 11', 'poweradd': 'Ctrl * 10'})
        self.assertEqual(bundle['state200'], {'ctrl': 'Anim = 11', 'poweradd': 'Ctrl * 10'})

    def test_explicit_legacy_preservation_is_not_the_source_default(self):
        definition = [{'id': 0, 'entries': [{'text': 'sprpriority=0'}]}]
        native = {'states': {'0': {'ctrl': 1}}}
        legacy = copy.deepcopy(native)
        import_bundle_state_scalars(native, definition)
        import_bundle_state_scalars(legacy, definition, retain_missing=True)
        self.assertEqual(native['states']['0'], {'sprpriority': 0})
        self.assertEqual(legacy['states']['0'], {'ctrl': 1, 'sprpriority': 0})

    def test_renaming_and_negative_headers(self):
        bundle = {'states': {'1110': {}, '-2': {}}}
        import_bundle_state_scalars(bundle, [{'id': 1101, 'entries': [{'text': 'ctrl=1'}]},
                                             {'id': -2, 'entries': [{'text': 'ctrl=1'}]}], {1101: 1110})
        self.assertEqual(bundle['states'], {'1110': {'ctrl': 1}, '-2': {}})

    def test_facep2_expression_uses_first_key_and_preserves_omission(self):
        bundle = {'states': {'100': {'facep2': 1}, '101': {'facep2': 1}}}
        definitions = [{'id': 100, 'entries': [{'text': 'facep2=Ctrl && Facing = 1'},
                                              {'text': 'facep2=0'}]},
                       {'id': 101, 'entries': []}]
        import_bundle_state_scalars(bundle, definitions)
        self.assertEqual(bundle['states'], {'100': {'facep2': 'Ctrl && Facing = 1'}, '101': {}})

    def test_current_payloads_match_original_scalar_headers(self):
        for name, path in [('moon', 'Char/Moon/Battle/moon_runtime.json'),
                           ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
                           ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
                           ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
                           ('venus', 'Char/Venus/venus_battle200.json')]:
            with self.subTest(character=name):
                data = json.loads((TOOLS.parent / path).read_text(encoding='utf-8-sig'))
                definitions = json.loads((TOOLS.parent.parent / 'outputs' / name / 'state_sections.json').read_text(encoding='utf-8-sig'))['states']
                expected = import_bundle_state_scalars(copy.deepcopy(data), definitions, {1101: 1110} if name == 'moon' else None)
                for group in STATE_GROUPS:
                    for number, state in expected.get(group, {}).items():
                        for field in STATE_SCALAR_FIELDS:
                            self.assertEqual((field in data[group][number], data[group][number].get(field)), (field in state, state.get(field)), (name, group, number, field))
                self.assertEqual(data.get('state200'), expected.get('state200'))

    def test_legacy_venus_mirrors_declared_source_fields(self):
        data = json.loads((TOOLS.parent / 'Char/Venus/venus_runtime_states.json').read_text(encoding='utf-8-sig'))
        definitions = json.loads((TOOLS.parent.parent / 'outputs/venus/state_sections.json').read_text(encoding='utf-8-sig'))['states']
        expected = import_bundle_state_scalars(copy.deepcopy(data), definitions, retain_missing=True)
        self.assertEqual(data, expected)

    def test_all_builder_hooks(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'import_bundle_state_scalars']
                self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
