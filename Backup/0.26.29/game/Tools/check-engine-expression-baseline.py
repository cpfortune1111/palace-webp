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

    def test_document_markup_keeps_format_separate_from_nested_argument_definitions(self):
        text = '<div class="section" id="foo"><h2><a>Foo(*,***)</a></h2><dl><dt>Format:</dt><dd>Foo(<em>n</em>)</dd><dt>Arguments:</dt><dd><dl><dt>n</dt><dd>int</dd></dl></dd><dt>Return type:</dt><dd>float</dd></dl></div>'
        rows = expressions.extract_mugen_triggers(text)
        self.assertEqual(rows[0]['name'], 'foo')
        self.assertEqual(rows[0]['formatCandidates'][0]['text'], 'Foo(n)')
        self.assertEqual(rows[0]['declaredReturnTypes'][0]['text'], 'float')
        self.assertEqual(rows[0]['anchor'], 'foo')
        self.assertEqual(set(rows[0]['stages'].values()), {'Unassessed'})

    def test_document_suffixes_and_projectile_id_family_are_not_lost(self):
        text = '<div class="section" id="win"><h2>Win</h2><p>Format: 1. Win 2. WinKO 3. WinTime 4. WinPerfect</p></div><div class="section" id="lose"><h2>Lose</h2><dl><dt>Format:</dt><dd><ol><li>Lose</li><li>LoseKO</li><li>LoseTime</li></ol></dd></dl></div><div class="section" id="projhit"><h2>ProjHit(*,***)</h2><dl><dt>Format:</dt><dd>ProjHit[ID] = 1, &lt; 15</dd></dl></div>'
        rows = expressions.extract_mugen_triggers(text)
        self.assertEqual(rows[0]['documentedSpellings'], ['win', 'winko', 'wintime', 'winperfect'])
        self.assertEqual(rows[1]['documentedSpellings'], ['lose', 'loseko', 'losetime'])
        self.assertEqual(rows[2]['specialGrammarFamily'], 'projhit<decimal projectile ID>')
        self.assertIn('< 15', rows[2]['formatCandidates'][0]['text'])

    def test_document_missing_suffix_duplicate_or_unparsed_heading_fails(self):
        for text in ['<div class="section"><h2>Win</h2></div>',
                     '<div class="section"><h2>Time</h2><h2>Time</h2></div>',
                     '<div class="section"><h2>Unexpected heading words</h2></div>',
                     '<div class="section"><h2>Time</h2><dl><dt>Format:</dt></dl></div>']:
            with self.assertRaises(ValueError):
                expressions.extract_mugen_triggers(text)

    def test_document_reference_formats_keep_original_and_alias_locations(self):
        text = '<div class="section"><h2>Name(*,***)</h2><dl><dt>Format:</dt><dd>Name = "example"</dd><dt>Return type:</dt><dd>boolean int</dd></dl></div>\n<div class="section"><h2>P1Name(*,***)</h2></div>\n<div class="section"><h2>P2Name(*,***)</h2></div>'
        rows = expressions.extract_mugen_triggers(text)
        expressions.resolve_mugen_formats(rows)
        self.assertEqual(rows[2]['formatCandidates'][0]['text'], 'P2Name = "example"')
        self.assertEqual(rows[2]['formatCandidates'][0]['sourceLine'], 1)
        self.assertEqual(rows[2]['formatCandidates'][0]['referenceSourceLine'], 3)
        self.assertEqual(rows[2]['declaredReturnTypes'][0]['text'], 'boolean int')
        self.assertEqual(rows[0]['formatCandidates'][0]['text'], 'Name = "example"')

    def test_document_unknown_reference_cannot_silently_produce_empty_formats(self):
        rows = expressions.extract_mugen_triggers('<div class="section"><h2>P1Name</h2></div>')
        with self.assertRaisesRegex(ValueError, 'Unknown MUGEN format reference'):
            expressions.resolve_mugen_formats(rows)

    def test_document_format_reference_cycle_is_rejected(self):
        from unittest.mock import patch
        text = '<div class="section"><h2>First</h2></div><div class="section"><h2>Second</h2></div>'
        rows = expressions.extract_mugen_triggers(text)
        with patch.dict(expressions.MUGEN_FORMAT_REFERENCES, {'first': 'second', 'second': 'first'}, clear=True):
            with self.assertRaisesRegex(ValueError, 'Cyclic'):
                expressions.resolve_mugen_formats(rows)

    def test_document_selector_disagreements_are_preserved_without_aliasing(self):
        text = '<div class="section"><h2>StageVar</h2><dl><dt>Valid values are:</dt><dd>info.name, info.authorname.</dd><dt>Details:</dt><dd><ul><li>info.name: name</li><li>info.author: author</li></ul></dd></dl></div>'
        row = expressions.extract_mugen_triggers(text)[0]
        selectors = row['selectorInventory']
        self.assertEqual([item['name'] for item in selectors['candidates']], ['info.author', 'info.authorname', 'info.name'])
        self.assertEqual(selectors['argumentOnly'], ['info.authorname'])
        self.assertEqual(selectors['detailsOnly'], ['info.author'])
        self.assertEqual(set(selectors['candidates'][0]['stages'].values()), {'Unassessed'})

    def test_unparsed_document_selector_list_is_not_dropped(self):
        text = '<div class="section"><h2>GetHitVar</h2><dl><dt>Valid values are:</dt><dd>damage, unknown syntax !</dd></dl></div>'
        with self.assertRaisesRegex(ValueError, 'Unparsed documented selector list'):
            expressions.extract_mugen_triggers(text)


if __name__ == '__main__':
    unittest.main()
