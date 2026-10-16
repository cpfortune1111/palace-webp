from pathlib import Path
import ast
import struct
import unittest

from attack_distance_constants import attack_distance_constants, update_attack_distance_constants


TOOLS = Path(__file__).resolve().parent


class AttackDistanceImportTests(unittest.TestCase):
    def test_raw_size_section_and_components(self):
        text = '[Data]\nattack.dist=999\n[SIZE]\nATTACK.DIST=200 ; comment\nattack.dist.width=240,30\nattack.dist.height=,60\nattack.dist.depth=7,8\nproj.attack.dist=80\nproj.attack.dist.height=25\n[State 1]\nattack.dist=999'
        self.assertEqual(attack_distance_constants(text), {
            'size.attack.dist': 200, 'size.attack.dist.width.x': 240,
            'size.attack.dist.width.y': 30, 'size.attack.dist.height.y': 60,
            'size.attack.dist.depth.x': 7, 'size.attack.dist.depth.y': 8,
            'size.proj.attack.dist': 80, 'size.proj.attack.dist.height.x': 25})

    def test_float32_and_stale_generic_values(self):
        constants = {'size.attack.dist.width.y': 99, 'unrelated': 12}
        update_attack_distance_constants(constants, '[Size]\nattack.dist.width=1.23456789')
        self.assertEqual(constants, {'unrelated': 12, 'size.attack.dist.width.x':
                                    struct.unpack('f', struct.pack('f', 1.23456789))[0]})
        for value in ('nan', 'inf', 'bad'):
            with self.assertRaises(ValueError):
                attack_distance_constants('[Size]\nattack.dist=' + value)

    def test_real_builder_calls(self):
        for filename in ('build_moon_runtime.py', 'build_jupiter_runtime.py',
                         'build_neptune_runtime.py', 'build_saturn_runtime.py'):
            with self.subTest(filename=filename):
                tree = ast.parse((TOOLS / filename).read_text(encoding='utf-8-sig'))
                function = next(node for node in tree.body if isinstance(node, ast.FunctionDef)
                                and node.name == 'compile_runtime')
                calls = [node for node in function.body if isinstance(node, ast.Expr)
                         and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name)
                         and node.value.func.id == 'update_attack_distance_constants']
                self.assertEqual(len(calls), 1)
                self.assertEqual(calls[0].value.args[0].id, 'constants')
        tree = ast.parse((TOOLS / 'compile_state200.py').read_text(encoding='utf-8-sig'))
        calls = [node for node in tree.body if isinstance(node, ast.Assign)
                 and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name)
                 and node.value.func.id == 'attack_distance_constants']
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0].targets[0].id, 'size_constants')


if __name__ == '__main__':
    unittest.main()
