import ast
from pathlib import Path
import re
import unittest


TOOLS = Path(__file__).resolve().parent


def controller(state, line, value):
    return {'state': state, 'file': 'fixture.st', 'line': line, 'type': 'VarAdd',
            'entries': [{'text': 'type = VarAdd'}, {'text': 'v = 1'},
                        {'text': 'value = ' + str(value)}, {'text': 'trigger1 = 1'},
                        {'text': 'persistent = 0'}, {'text': 'ignorehitpause = 1'}]}


def compiler():
    tree = ast.parse((TOOLS / 'compile_state200.py').read_text(encoding='utf-8-sig'))
    function = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'compile_controller')
    namespace = {'re': re}
    exec(compile(ast.Module(body=[function], type_ignores=[]), 'compile_state200.py', 'exec'), namespace)
    return namespace['compile_controller']


def export_block(filename, raw):
    tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
    translate = compiler()
    namespace = {'re': re, 'raw': raw, 'states': raw, 'canonical': {},
                 'compile_controller': translate,
                 'non_3do_controller': translate,
                 'compile_neptune_controller': translate,
                 'compile_saturn_controller': translate}
    if filename == 'compile_state200.py':
        nodes = [node for node in tree.body if isinstance(node, ast.Assign)
                 and any(isinstance(target, ast.Name) and target.id == 'global_controllers' for target in node.targets)]
        result = 'global_controllers'
    else:
        function = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'compile_runtime')
        start = next(index for index, node in enumerate(function.body) if isinstance(node, ast.Assign)
                     and any(isinstance(target, ast.Name) and target.id == 'globals_data' for target in node.targets))
        nodes = function.body[start:start + 2]
        result = 'globals_data'
    exec(compile(ast.Module(body=nodes, type_ignores=[]), filename, 'exec'), namespace)
    return namespace[result]


class NegativeStateImportTests(unittest.TestCase):
    def test_all_character_global_export_blocks_preserve_state_four_order(self):
        raw = {'controllers': [controller(-4, 1, 4), controller(-3, 2, 3), controller(-4, 3, 5),
                               controller(-2, 4, 2), controller(-1, 5, 1), controller(0, 6, 0)]}
        for filename in ['compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py']:
            with self.subTest(filename=filename):
                result = export_block(filename, raw)
                self.assertEqual(list(result), ['-4', '-3', '-2'])
                self.assertEqual([item['params']['value'] for item in result['-4']], ['4', '5'])
                self.assertEqual([item['source']['line'] for item in result['-4']], [1, 3])
                self.assertEqual(result['-4'][0]['params']['target'], 'var(1)')
                self.assertEqual(result['-4'][0]['params']['persistent'], '0')
                self.assertEqual(result['-4'][0]['params']['ignorehitpause'], '1')
                self.assertEqual(len(result['-3']), 1)
                self.assertEqual(len(result['-2']), 1)

    def test_absent_state_four_keeps_an_empty_array(self):
        for filename in ['compile_state200.py', 'build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py']:
            with self.subTest(filename=filename):
                result = export_block(filename, {'controllers': [controller(-2, 1, 2)]})
                self.assertEqual(result['-4'], [])
                self.assertEqual(len(result['-2']), 1)


if __name__ == '__main__':
    unittest.main()
