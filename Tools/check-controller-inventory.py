import importlib.util
import json
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location('inventory', Path(__file__).with_name('audit-controller-parameters.py'))
inventory = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inventory)


class InventoryTests(unittest.TestCase):
    def test_saved_inventory_is_complete_json(self):
        root = Path(__file__).resolve().parents[1]
        artifact = json.loads((root / 'Docs/CONTROLLER-AUDIT.json').read_text(encoding='utf-8-sig'))
        self.assertEqual(artifact['referenceCommit'], inventory.REFERENCE)
        self.assertEqual(artifact['controllerCount'], len(artifact['controllers']))
        self.assertEqual(artifact['controllerCount'], 163)
        self.assertEqual(len({row['controller'] for row in artifact['controllers']}), 163)

    def test_delegated_prefixes_and_registry_helpers(self):
        registry = '''c.scmap = map[string]scFunc{
            "example": c.example,
\t}
func (c *CharCompiler) paramTrans(is IniSection, sc Base, prefix string) error {
    _, exists := is[prefix+"alpha"]
    return c.stateParam(is, prefix+"trans", false, nil)
}
'''
        compiler = '''func (c *CharCompiler) example(is IniSection, sc Base) error {
    c.palette(is, sc, "palfx.")
    c.palette(is, sc, "afterimage.")
    c.paramValue(is, sc, "redirectid", nil)
}
func (c *CharCompiler) palette(is IniSection, sc Base, prefix string) error {
    c.paramValue(is, sc, prefix+"color", nil)
    c.paramTrans(is, sc, prefix, nil)
    c.stateParam(is, dynamicName, false, nil)
}
'''
        row = inventory.build_inventory(registry, compiler)['controllers'][0]
        self.assertEqual(row['parameterCandidates'], [
            'afterimage.alpha', 'afterimage.color', 'afterimage.trans',
            'palfx.alpha', 'palfx.color', 'palfx.trans', 'redirectid',
        ])
        self.assertEqual(row['unresolvedExtraction'], ['palette: dynamic parameter names'])
        self.assertEqual(row['coverageStatus'], 'not semantically certified')

    def test_pinned_inventory(self):
        root = Path(__file__).resolve().parents[2]
        result = inventory.build_inventory(
            (root / 'outputs/ikemen-compiler.go').read_text(encoding='utf-8-sig'),
            (root / 'outputs/ikemen-compiler-functions.go').read_text(encoding='utf-8-sig'),
        )
        rows = {row['controller']: row for row in result['controllers']}
        self.assertEqual(result['controllerCount'], 163)
        self.assertIn('palfx.sinadd', rows['explod']['parameterCandidates'])
        self.assertIn('afterimage.palcontrast', rows['explod']['parameterCandidates'])
        self.assertIn('afterimage.alpha', rows['explod']['parameterCandidates'])
        self.assertIn('sincolor', rows['allpalfx']['parameterCandidates'])
        self.assertIn('alpha', rows['trans']['parameterCandidates'])


if __name__ == '__main__':
    unittest.main()