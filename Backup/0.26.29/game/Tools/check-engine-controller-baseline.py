import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('baseline', Path(__file__).with_name('audit-engine-controller-baseline.py'))
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)


class DocumentExtractionTests(unittest.TestCase):
    def test_nested_markup_and_alternate_syntax_are_not_silently_certified(self):
        parser = baseline.ControllerDocument()
        parser.feed('<h1>Reference</h1><h2><a href="#toc">VarSet</a></h2><dt>value = <em>expr</em></dt><dt>var(0) = expr</dt><dt>value = repeated</dt><p>See <a href="#varadd">VarAdd</a>.</p><h1>Other</h1><dt>fake = 1</dt>')
        self.assertEqual(len(parser.rows), 1)
        self.assertEqual(parser.rows[0]['parameterCandidates'], ['value'])
        self.assertEqual(parser.rows[0]['unresolvedTerms'], ['var(0) = expr'])
        self.assertEqual(parser.rows[0]['referenceLinks'], ['#varadd'])

    def test_changed_reference_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'snapshot differs'):
            baseline.build(b'unpinned document', {})

    def test_parameter_references_transitive_union_and_no_shared_mutation(self):
        rows = [{'controller': 'base', 'parameterCandidates': ['time', 'value']},
                {'controller': 'middle', 'parameterCandidates': ['id']},
                {'controller': 'leaf', 'parameterCandidates': []}]
        result = baseline.resolve_parameter_references(rows, {'middle': 'base', 'leaf': 'middle'})
        self.assertEqual(result['leaf'], ['id', 'time', 'value'])
        self.assertEqual(rows[2]['parameterCandidates'], [])
        self.assertEqual(result['base'], ['time', 'value'])

    def test_invalid_parameter_reference_graph_is_rejected(self):
        rows = [{'controller': 'one', 'parameterCandidates': []}, {'controller': 'two', 'parameterCandidates': []}]
        with self.assertRaisesRegex(ValueError, 'Cyclic'):
            baseline.resolve_parameter_references(rows, {'one': 'two', 'two': 'one'})
        with self.assertRaisesRegex(ValueError, 'Unknown'):
            baseline.resolve_parameter_references(rows, {'one': 'missing'})

    def test_each_parameter_has_distinct_unassessed_evidence(self):
        entries = baseline.evidence_entries(['time', 'value', 'time'])
        self.assertEqual(list(entries), ['time', 'value'])
        self.assertEqual(set(entries['time']['stages']), set(baseline.STAGES))
        entries['time']['stages']['Parsed'] = 'Partial'
        entries['time']['semanticTests'].append('fixture')
        self.assertEqual(entries['value']['stages']['Parsed'], 'Unassessed')
        self.assertEqual(entries['value']['semanticTests'], [])

    def test_unbounded_key_families_remain_families_not_finite_name_lists(self):
        dialogue = baseline.reviewed_dynamic_families('dialogue')
        self.assertEqual(dialogue[0]['inputKeyPattern'], '^text[0-9]+$')
        self.assertIn('canonical', dialogue[0]['ordering'])
        for name in baseline.MAP_CONTROLLERS:
            family = baseline.reviewed_dynamic_families(name)[0]
            self.assertEqual(family['family'], 'map(KEY)')
            self.assertEqual(family['compilerFunction'], 'mapSetSub')
            self.assertIn('at most one', family['cardinality'])
        self.assertEqual(baseline.reviewed_dynamic_families('unknown'), [])


if __name__ == '__main__':
    unittest.main()
