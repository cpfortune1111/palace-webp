import ast
from pathlib import Path
import unittest

from state_persistence import import_bundle_persistence, import_state_persistence


TOOLS = Path(__file__).resolve().parent


class StatePersistenceImportTests(unittest.TestCase):
    def test_expressions_and_explicit_zero_are_preserved(self):
        state = {'ctrl': 1}
        values = {'hitcountpersist': 'var(2) != 0', 'movehitpersist': '0',
                  'hitdefpersist': 'ifelse(time > 0, 1, 0)'}
        self.assertEqual(import_state_persistence(state, values), {'ctrl': 1, **values})
        self.assertEqual(import_state_persistence({}, {}), {})

    def test_each_general_builder_executes_import_before_export(self):
        for filename in ('build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                function = next(node for node in tree.body if isinstance(node, ast.FunctionDef)
                                and node.name == 'compile_runtime')
                loop = next(node for node in function.body if isinstance(node, ast.For)
                            and isinstance(node.target, ast.Name) and node.target.id == 'definition')
                calls = [node for node in loop.body if isinstance(node, ast.Expr)
                         and isinstance(node.value, ast.Call)
                         and isinstance(node.value.func, ast.Name)
                         and node.value.func.id == 'import_state_persistence']
                self.assertEqual(len(calls), 1)
                state = {}
                namespace = {'state': state, 'values': {'hitcountpersist': '1'},
                             'import_state_persistence': import_state_persistence}
                exec(compile(ast.Module(body=calls, type_ignores=[]), filename, 'exec'), namespace)
                self.assertEqual(state, {'hitcountpersist': '1'})

    def test_venus_all_export_groups_and_first_definition(self):
        groups = ('attackStates', 'helperStates', 'lifecycleStates', 'lifecycleHelpers',
                  'fallStates', 'locomotionStates')
        bundle = {name: {'200': {}} for name in groups}
        bundle['state200'] = {}
        definitions = [{'id': 200, 'entries': [{'text': 'HitCountPersist = var(1)'}]},
                       {'id': 200, 'entries': [{'text': 'HitCountPersist = 0'}]}]
        import_bundle_persistence(bundle, definitions)
        for name in groups:
            self.assertEqual(bundle[name]['200']['hitcountpersist'], 'var(1)')
        self.assertEqual(bundle['state200']['hitcountpersist'], 'var(1)')
        tree = ast.parse((TOOLS / 'compile_state200.py').read_text(encoding='utf-8-sig'))
        calls = [node for node in tree.body if isinstance(node, ast.Expr)
                 and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name)
                 and node.value.func.id == 'import_bundle_persistence']
        self.assertEqual(len(calls), 1)


if __name__ == '__main__':
    unittest.main()
