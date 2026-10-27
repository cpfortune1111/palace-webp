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
        saved = json.loads((root / 'work/Docs/CONTROLLER-AUDIT.json').read_text(encoding='utf-8-sig'))
        self.assertEqual(result, saved)
        previous = {row['controller']: row for row in saved['controllers']}
        for name, row in rows.items():
            expected = set(previous[name]['parameterCandidates'])
            if name == 'assertinput':
                expected.update('flag' + str(index) for index in range(2, 9))
            self.assertEqual(set(row['parameterCandidates']), expected)
        self.assertEqual(sum(len(row['unresolvedExtraction']) for row in result['controllers']), 9)
        self.assertEqual(sum(len(row['parameterCandidates']) for row in result['controllers']), 2165)

    def test_finite_keys_resolve_only_the_bounded_parameter_use(self):
        body = '''for i := 2; i <= 8; i++ {
    key := fmt.Sprintf("flag%d", i)
    if err := c.stateParam(is, key, false, nil); err != nil {
        return err
    }
}
c.stateParam(is, key, false, nil)
'''
        names, positions = inventory.finite_parameter_keys(body)
        self.assertEqual(names, {'flag' + str(index) for index in range(2, 9)})
        self.assertEqual(len(positions), 1)
        self.assertLess(next(iter(positions)), body.rfind('key'))
        self.assertEqual(inventory.finite_parameter_keys(body.replace('i <= 8', 'i <= limit')), (set(), set()))
        self.assertEqual(inventory.finite_parameter_keys(body.replace('i <= 8', 'i <= 1000')), (set(), set()))

    def test_literal_key_helpers_bind_without_false_dynamic_warning(self):
        registry = '''c.scmap = map[string]scFunc{
            "example": c.example,
\t}
'''
        compiler = '''func (c *CharCompiler) example(is IniSection, sc Base) error {
    c.paramValue(is, sc, "time", nil)
    c.palette(is, sc, "palfx.")
    c.paramPostype(is, sc, numericOpcode)
}
func (c *CharCompiler) palette(is IniSection, sc Base, prefix string) error {
    c.paramValue(is, sc, prefix+"color", nil)
}
func (c *CharCompiler) paramValue(is IniSection, sc Base, paramname string, id byte) error {
    return c.stateParam(is, paramname, false, nil)
}
func (c *CharCompiler) paramPostype(is IniSection, sc Base, id byte) error {
    return c.stateParam(is, "postype", false, nil)
}
'''
        row = inventory.build_inventory(registry, compiler)['controllers'][0]
        self.assertEqual(row['parameterCandidates'], ['palfx.color', 'postype', 'time'])
        self.assertEqual(row['unresolvedExtraction'], [])
        contexts = [context for context in row['compilerContextsInspected'] if context['function'] == 'paramValue']
        self.assertEqual({context['parameterBindings']['paramname'] for context in contexts}, {'time', 'palfx.color'})
        unbound = compiler.replace('"time", nil', 'dynamicName, nil')
        row = inventory.build_inventory(registry, unbound)['controllers'][0]
        self.assertIn('paramValue: dynamic parameter names', row['unresolvedExtraction'])


if __name__ == '__main__':
    unittest.main()
