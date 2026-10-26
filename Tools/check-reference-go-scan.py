import unittest
from reference_go_scan import declaration, matching_delimiter


class ReferenceScanTests(unittest.TestCase):
    def test_nested_blocks_ignore_literals_comments_and_runes(self):
        text = 'func Probe() {\n s := "}\\\"{"; r := \'}\'; raw := `{}`\n // }\n /* { } */\n if true { run() }\n}\nfunc Next() {}'
        result = declaration(text, 'func Probe(')
        self.assertTrue(result['text'].endswith('if true { run() }\n}'))
        self.assertNotIn('func Next', result['text'])
        self.assertEqual(result['line'], 1)

    def test_parenthesized_constant_blocks(self):
        text = 'const ( Max = int32(^uint32(0) >> 1); Min = ^Max ) trailing'
        end = matching_delimiter(text, text.index('('), '(', ')')
        self.assertEqual(text[end:], ' trailing')

    def test_unclosed_or_ambiguous_source_fails(self):
        for text in ['func Probe() {', 'func Probe() { "oops', 'func Probe() { /* oops', 'func Probe() {}\nfunc Probe() {}']:
            with self.assertRaises(ValueError):
                declaration(text, 'func Probe(')

    def test_declarations_only_match_line_start(self):
        text = '// func Probe() {fake}\nfunc Probe() { real() }'
        self.assertEqual(declaration(text, 'func Probe(')['line'], 2)


if __name__ == '__main__':
    unittest.main()
