import importlib.util
from html import escape
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('cns_reference', Path(__file__).with_name('audit-engine-cns-baseline.py'))
cns = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cns)


def document(text):
    result = cns.reference.DocumentTree()
    result.feed(text)
    return result


class CnsInventoryTests(unittest.TestCase):
    def test_operator_precedence_and_associativity_are_separate_facts(self):
        symbols = ['! ~ - (unary operators)', '**', '* / %', '+ -', '> >= < <=', '= != intervals', ':=', '&', '^', '|', '&&', '^^', '||']
        rows = ''.join('<tr><td>' + escape(text) + '</td><td></td></tr>' for text in symbols)
        source = document('<div class="section"><h2>Precedence and associativity of operators</h2><p>except for the unary operators and the assignment operator</p><table>' + rows + '</table></div>')
        groups, operators, intervals = cns.operators(source)
        self.assertEqual(len(groups), 13)
        self.assertEqual(len(operators), 22)
        by_id = {row['kind'] + ':' + row['symbol']: row for row in operators}
        self.assertEqual(by_id['unary:-']['associativity'], 'right')
        self.assertEqual(by_id['binary:-']['associativity'], 'left')
        self.assertEqual(by_id['binary:**']['associativity'], 'left')
        self.assertEqual(by_id['assignment::=']['associativity'], 'right')
        self.assertLess(by_id['binary:=']['precedenceOrdinal'], by_id['assignment::=']['precedenceOrdinal'])
        self.assertLess(by_id['assignment::=']['precedenceOrdinal'], by_id['binary:&']['precedenceOrdinal'])
        self.assertEqual(len({(row['comparison'], row['leftDelimiter'], row['rightDelimiter']) for row in intervals}), 8)
        self.assertEqual(set(by_id['binary:**']['stages'].values()), {'Unassessed'})

    def test_unknown_operator_syntax_is_not_silently_skipped(self):
        source = document('<div><h2>Precedence and associativity of operators</h2><p>except for the unary operators and the assignment operator</p><table><tr><td>unknown</td><td></td></tr></table></div>')
        with self.assertRaisesRegex(ValueError, 'Unknown CNS operator'):
            cns.operators(source)

    def test_redirect_names_and_argument_forms_are_distinct(self):
        forms = ['parent', 'root', 'helper', 'helper(ID)', 'target', 'target(ID)', 'partner', 'enemy', 'enemy(n)', 'enemyNear', 'enemyNear(n)', 'playerID(ID)']
        source = document('<div><h2>Trigger redirection</h2><ul>' + ''.join('<li><p>' + form + '</p><p>meaning</p></li>' for form in forms) + '</ul></div>')
        rows = cns.redirects(source)
        self.assertEqual(len({row['name'] for row in rows}), 8)
        self.assertEqual([row['argumentName'] for row in rows if row['name'] == 'helper'], [None, 'ID'])
        self.assertEqual([row['syntax'] for row in rows if row['name'] == 'enemynear'], ['enemyNear', 'enemyNear(n)'])

    def test_statedef_fields_preserve_identity_without_certifying_defaults(self):
        names = ['type', 'movetype', 'physics', 'anim', 'velset', 'ctrl', 'poweradd', 'juggle', 'facep2', 'hitdefpersist', 'movehitpersist', 'hitcountpersist', 'sprpriority']
        text = '<div><h2>Details on StateDef</h2>' + ''.join('<div><h3><tt>' + name + '</tt></h3></div>' for name in names) + '</div>'
        rows = cns.statedef_fields(document(text))
        self.assertEqual([row['name'] for row in rows], names)
        self.assertEqual(rows[0]['defaultsEntryOrderRetentionAndVersionSemantics'], 'Unassessed')
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            cns.statedef_fields(document(text.replace('<h3><tt>ctrl', '<h3><tt>anim')))

    def test_duplicate_special_states_and_non_numeric_rows_are_rejected(self):
        for cells in [('0', '0'), ('unknown', '10')]:
            text = '<div><h1>Special State Numbers</h1><table>' + ''.join('<tr><td>' + value + '</td><td>state</td></tr>' for value in cells) + '</table></div>'
            with self.assertRaises(ValueError):
                cns.common_state_numbers(document(text))

    def test_unpinned_reference_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'differs from pinned'):
            cns.build(b'unpinned CNS reference')


if __name__ == '__main__':
    unittest.main()
