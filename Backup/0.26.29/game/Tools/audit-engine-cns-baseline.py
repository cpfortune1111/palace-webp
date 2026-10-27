"""M0 inventory of pinned CNS syntax facts; not a runtime CNS parser or compatibility certificate."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re

spec = importlib.util.spec_from_file_location('expression_reference', Path(__file__).with_name('audit-engine-expression-baseline.py'))
reference = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reference)
SOURCE_SHA256 = 'ee340cc6fb0bafca800dfbd41e385b5bb9b0dd94af1b5ea89b0d5b6a305c93bb'
STAGES = reference.STAGES


def pending():
    return {stage: 'Unassessed' for stage in STAGES}


def section(document, tag, title):
    headings = [node for node in document.root.walk(tag) if reference.compact(node.text()).lower() == title.lower()]
    if len(headings) != 1:
        raise ValueError('Expected one CNS section: ' + title)
    return headings[0].parent


def table_rows(table):
    for node in table.walk('tr'):
        cells = [child for child in node.children if isinstance(child, reference.Element) and child.tag == 'td']
        if cells:
            yield node.line, [reference.compact(cell.text()) for cell in cells]


def operators(document):
    source = section(document, 'h2', 'Precedence and associativity of operators')
    if 'except for the unary operators and the assignment operator' not in reference.compact(source.text()):
        raise ValueError('CNS associativity rule changed or missing')
    tables = list(source.walk('table'))
    if len(tables) != 1:
        raise ValueError('Expected one CNS precedence table')
    groups, entries = [], []
    allowed = {'!', '~', '-', '**', '*', '/', '%', '+', '>', '>=', '<', '<=', '=', '!=', ':=', '&', '^', '|', '&&', '^^', '||'}
    for ordinal, (line, cells) in enumerate(table_rows(tables[0])):
        if len(cells) != 2:
            raise ValueError('Unparsed CNS precedence row')
        tokens = cells[0].replace('(unary operators)', '').split()
        interval = 'intervals' in tokens
        tokens = [token for token in tokens if token != 'intervals']
        if not tokens or any(token not in allowed for token in tokens):
            raise ValueError('Unknown CNS operator tokens: ' + cells[0])
        unary = '(unary operators)' in cells[0]
        groups.append({'precedenceOrdinal': ordinal, 'higherOrdinalMeans': 'lower precedence', 'symbols': tokens,
                       'intervalGrammarAtThisLevel': interval, 'sourceLine': line})
        for token in tokens:
            kind = 'unary' if unary else 'assignment' if token == ':=' else 'binary'
            entries.append({'id': 'mugen-1.1/operator/' + kind + '/' + token,
                            'symbol': token, 'kind': kind, 'precedenceOrdinal': ordinal,
                            'associativity': 'right' if kind in {'unary', 'assignment'} else 'left',
                            'sourceLine': line, 'stages': pending(), 'semanticTests': [], 'runtimeConsumers': []})
    if len(groups) != 13:
        raise ValueError('Pinned CNS precedence group count mismatch')
    intervals = [{'comparison': compare, 'leftDelimiter': left, 'rightDelimiter': right,
                  'stages': pending(), 'argumentAndNestingSemantics': 'Unassessed'}
                 for compare in ('=', '!=') for left in ('[', '(') for right in (']', ')')]
    return groups, entries, intervals


def redirects(document):
    source = section(document, 'h2', 'Trigger redirection')
    rows, seen = [], set()
    for node in source.walk('li'):
        paragraphs = [child for child in node.children if isinstance(child, reference.Element) and child.tag == 'p']
        if not paragraphs:
            raise ValueError('Unparsed CNS redirect definition')
        syntax = reference.compact(paragraphs[0].text())
        match = re.fullmatch(r'([A-Za-z][A-Za-z0-9]*)(?:\(([A-Za-z][A-Za-z0-9]*)\))?', syntax)
        if not match or syntax.lower() in seen:
            raise ValueError('Unknown or duplicate CNS redirect form: ' + syntax)
        seen.add(syntax.lower())
        rows.append({'name': match.group(1).lower(), 'syntax': syntax, 'argumentName': match.group(2),
                     'sourceLine': node.line, 'stages': pending(), 'semanticTests': [], 'runtimeConsumers': [],
                     'argumentBoundsOwnershipAndMissingTargetBehavior': 'Unassessed'})
    if len(rows) != 12:
        raise ValueError('Pinned CNS redirect form count mismatch')
    return rows


def statedef_fields(document):
    source = section(document, 'h2', 'Details on StateDef')
    rows, seen = [], set()
    for node in source.walk('h3'):
        name = reference.compact(node.text()).lower()
        if not re.fullmatch(r'[a-z][a-z0-9]*', name) or name in seen:
            raise ValueError('Unknown or duplicate CNS StateDef field: ' + name)
        seen.add(name)
        rows.append({'name': name, 'sourceLine': node.line, 'stages': pending(),
                     'defaultsEntryOrderRetentionAndVersionSemantics': 'Unassessed',
                     'runtimeConsumers': [], 'semanticTests': []})
    if len(rows) != 13:
        raise ValueError('Pinned CNS StateDef field count mismatch')
    return rows


def common_state_numbers(document):
    source = section(document, 'h1', 'Special State Numbers')
    tables = list(source.walk('table'))
    if len(tables) != 1:
        raise ValueError('Expected one CNS special-state table')
    rows = []
    for line, cells in table_rows(tables[0]):
        if len(cells) != 2 or not re.fullmatch(r'-?\d+', cells[0]):
            raise ValueError('Unparsed CNS special-state row')
        rows.append({'state': int(cells[0]), 'documentLabel': cells[1], 'sourceLine': line,
                     'stages': pending(), 'commonStateImplementationAndOverrides': 'Unassessed'})
    if len({row['state'] for row in rows}) != len(rows):
        raise ValueError('Duplicate CNS special-state number')
    return rows


def build(data):
    if hashlib.sha256(data).hexdigest() != SOURCE_SHA256:
        raise ValueError('CNS document differs from pinned baseline')
    document = reference.DocumentTree()
    document.feed(data.decode('utf-8-sig'))
    groups, operator_rows, intervals = operators(document)
    return {'schema': 'moon-palace-cns-baseline-v1',
            'reference': {'mirrorCommit': reference.MUGEN_MIRROR_COMMIT, 'source': 'docs/cns.html', 'sha256': SOURCE_SHA256},
            'certification': 'Document syntax inventory only. Existing runtime evidence remains to be reconciled; no expression/state execution is certified by extraction.',
            'operatorPrecedenceGroups': groups, 'operatorRows': operator_rows, 'intervalForms': intervals,
            'redirectForms': redirects(document), 'stateDefFields': statedef_fields(document),
            'specialStateNumbers': common_state_numbers(document),
            'remaining': ['Complete literal/type/conversion/bottom/evaluation and legacy grammar item inventories',
                          'Negative/global/current State phases, persistence, trigger groups and transition scheduling evidence',
                          'StateDef defaults, evaluation/entry order, common-state bodies and source-version behavior',
                          'Separate Ikemen syntax/behavior extensions and reconcile all existing consumers/tests',
                          'Native differential traces and real-character integration']}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--document', required=True, type=Path)
    cli.add_argument('--output', required=True, type=Path)
    args = cli.parse_args()
    result = build(args.document.read_bytes())
    args.output.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: len(result[key]) for key in ('operatorPrecedenceGroups', 'operatorRows', 'intervalForms', 'redirectForms', 'stateDefFields', 'specialStateNumbers')}))
