import importlib.util
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('const_inventory', Path(__file__).with_name('audit-native-constants.py'))
inventory = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inventory)


class ConstantInventoryTests(unittest.TestCase):
    def test_pinned_compiler_matches_saved_names_and_opcodes(self):
        source = (ROOT.parent / 'outputs/ikemen-compiler.go').read_text(encoding='utf-8-sig')
        actual = inventory.builtin_constants(source)
        saved = json.loads((ROOT / 'Docs/CONST-AUDIT.json').read_text(encoding='utf-8-sig'))
        self.assertEqual(saved['referenceCommit'], inventory.REFERENCE)
        self.assertEqual(saved['builtinNameCount'], 138)
        self.assertEqual(saved['certifiedBuiltinNames'], 0)
        self.assertEqual(actual, [{key: row[key] for key in ('name', 'opcode')} for row in saved['rows']])

    def test_aliases_are_not_deduplicated_by_opcode(self):
        source = '\tcase "const":\n switch c.token {\n case "first", "second":\n out.append(OC_const_example)\n }\n\tcase "const240p":'
        self.assertEqual(inventory.builtin_constants(source), [
            {'name': 'first', 'opcode': 'OC_const_example'},
            {'name': 'second', 'opcode': 'OC_const_example'}])

    def test_unrecognized_case_fails_closed(self):
        with self.assertRaisesRegex(ValueError, 'Unhandled'):
            inventory.builtin_constants('\tcase "const":\n switch c.token {\n case "missing":\n other()\n }\n\tcase "const240p":')


if __name__ == '__main__':
    unittest.main()
