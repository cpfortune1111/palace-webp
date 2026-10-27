import ast
import copy
import json
from pathlib import Path
import unittest

from state_velocity import import_bundle_velocity, state_velocity


TOOLS = Path(__file__).resolve().parent


class StateVelocityImportTests(unittest.TestCase):
    def test_raw_expression_and_empty_legacy_form(self):
        self.assertEqual(state_velocity(' 1/4, ifelse(ctrl, 2, 3), Vel Y '), '1/4, ifelse(ctrl, 2, 3), Vel Y')
        self.assertEqual(state_velocity(''), [])

    def test_all_groups_first_definition_and_first_key(self):
        groups = ('states', 'attackStates', 'helperStates', 'lifecycleStates',
                  'lifecycleHelpers', 'fallStates', 'locomotionStates')
        bundle = {group: {'200': {'velset': [9, 9]}} for group in groups}
        bundle['state200'] = {'velset': [9, 9]}
        definitions = [{'id': 200, 'entries': [{'text': 'VelSet = 1.0/4, Vel X + 2, Vel Y + 3'},
                                              {'text': 'velset = 99'}]},
                       {'id': 200, 'entries': [{'text': 'velset = 88'}]}]
        import_bundle_velocity(bundle, definitions)
        for group in groups:
            self.assertEqual(bundle[group]['200']['velset'], '1.0/4, Vel X + 2, Vel Y + 3')
        self.assertEqual(bundle['state200']['velset'], '1.0/4, Vel X + 2, Vel Y + 3')

    def test_renamed_and_negative_state_headers(self):
        bundle = {'states': {'1110': {}, '-2': {}}}
        import_bundle_velocity(bundle, [{'id': 1101, 'entries': [{'text': 'velset=2'}]},
                                        {'id': -2, 'entries': [{'text': 'velset=99'}]}], {1101: 1110})
        self.assertEqual(bundle['states']['1110']['velset'], '2')
        self.assertNotIn('velset', bundle['states']['-2'])

    def test_current_payloads_match_original_velocity_headers(self):
        for name, path in [('moon', 'Char/Moon/Battle/moon_runtime.json'),
                           ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
                           ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
                           ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
                           ('venus', 'Char/Venus/venus_battle200.json')]:
            with self.subTest(character=name):
                data = json.loads((TOOLS.parent / path).read_text(encoding='utf-8-sig'))
                definitions = json.loads((TOOLS.parent.parent / 'outputs' / name / 'state_sections.json').read_text(encoding='utf-8-sig'))['states']
                expected = import_bundle_velocity(copy.deepcopy(data), definitions, {1101: 1110} if name == 'moon' else None)
                self.assertEqual(data, expected)

    def test_all_export_hooks_and_no_float_only_vector_reader(self):
        for filename in ('compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                source = (TOOLS / filename).read_text(encoding='utf-8-sig')
                tree = ast.parse(source)
                calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                         and isinstance(node.func, ast.Name) and node.func.id == 'import_bundle_velocity']
                self.assertEqual(len(calls), 1)
                self.assertNotIn("float(value) for value in values['velset']", source)
                self.assertNotIn("float(value) for value in fields['velset']", source)


if __name__ == '__main__':
    unittest.main()
