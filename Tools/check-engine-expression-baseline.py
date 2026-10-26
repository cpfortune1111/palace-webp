import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('expressions', Path(__file__).with_name('audit-engine-expression-baseline.py'))
expressions = importlib.util.module_from_spec(spec)
spec.loader.exec_module(expressions)


class RegistryExtractionTests(unittest.TestCase):
    def test_names_groups_flags_and_original_line_numbers(self):
        source = '\nvar triggerMap = map[string]int{\n// Redirections\n"root": 0,\n// Mugen triggers\n"time": 1,\n// Ikemen triggers\n"map": 1,\n}\n'
        rows = expressions.extract_registry(source)
        self.assertEqual([row['name'] for row in rows], ['root', 'time', 'map'])
        self.assertEqual([row['sourceLine'] for row in rows], [4, 6, 8])
        self.assertEqual([row['kind'] for row in rows], ['redirect', 'expression-name', 'expression-name'])

    def test_unknown_syntax_and_duplicates_fail_instead_of_disappearing(self):
        for body in ['// Mugen triggers\n"time": 1,\n"time": 1,',
                     '// Mugen triggers\n"time": dynamic,',
                     '// Unexpected group\n"time": 1,',
                     '// Redirections\n"root": 1,']:
            with self.assertRaises(ValueError):
                expressions.extract_registry('var triggerMap = map[string]int{\n' + body + '\n}')

    def test_missing_or_unterminated_registry_fails(self):
        for source in ['', 'var triggerMap = map[string]int{\n// Mugen triggers\n"time": 1,']:
            with self.assertRaises(ValueError):
                expressions.extract_registry(source)

    def test_unpinned_source_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'differs from pinned'):
            expressions.build(b'unpinned source')

    def test_evidence_cannot_silently_certify_or_reference_unknown_names(self):
        evidence = {'schema': 'moon-palace-expression-evidence-v1', 'referenceCommit': expressions.COMMIT,
                    'rows': [{'name': 'unknown'}]}
        with self.assertRaisesRegex(ValueError, 'Unknown'):
            expressions.apply_evidence([{'name': 'attack'}], evidence)
        evidence['rows'] = [{'name': 'attack', 'stages': {stage: 'Complete' for stage in expressions.STAGES}}]
        with self.assertRaisesRegex(ValueError, 'only accepts'):
            expressions.apply_evidence([{'name': 'attack'}], evidence)

    def test_saved_reconciliation_keeps_scope_and_remaining_work(self):
        import json
        evidence = json.loads((Path(__file__).resolve().parents[1] / 'Docs/ENGINE-EXPRESSION-EVIDENCE.json').read_text(encoding='utf-8-sig'))
        rows = [{'name': 'attack'}, {'name': 'defence'}, {'name': 'time'}]
        expressions.apply_evidence(rows, evidence)
        self.assertEqual(rows[0]['stages']['Parsed'], 'Unassessed')
        self.assertEqual(rows[1]['stages']['Executable'], 'Partial')
        self.assertIn('Native differential traces', rows[1]['remaining'])
        self.assertEqual(rows[2], {'name': 'time'})


if __name__ == '__main__':
    unittest.main()
