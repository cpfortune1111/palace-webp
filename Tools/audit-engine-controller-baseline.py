"""M0 evidence input inventory; extracted names are never semantic certification."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re

MUGEN_SHA256 = '16e143ce3f7b61be0de8a3056d03495c916dd83c76d7ef339a6c70e54877b332'
IKEMEN_COMMIT = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
IKEMEN_COMPILER_SHA256 = 'fb22ba6775515cf9cd278a6d0556b4972287655f712e07271a12d5561e55688d'
STAGES = ('Parsed', 'Executable', 'Source-verified', 'Semantically tested')
MUGEN_PARAMETER_REFERENCES = {
    'allpalfx': 'palfx', 'appendtoclipboard': 'displaytoclipboard',
    'bgpalfx': 'palfx', 'changeanim2': 'changeanim',
    'modifyexplod': 'explod', 'selfstate': 'changestate',
}
MUGEN_PARAMETERLESS = {
    'clearclipboard', 'fallenvshake', 'gravity', 'hitfalldamage',
    'hitfallvel', 'movehitreset', 'null', 'turn',
}
MAP_CONTROLLERS = {'mapset', 'mapadd', 'parentmapset', 'parentmapadd',
                   'rootmapset', 'rootmapadd', 'teammapset', 'teammapadd'}


def evidence_entries(names):
    return {name: {'stages': {stage: 'Unassessed' for stage in STAGES},
                   'runtimeConsumers': [], 'semanticTests': [], 'nativeBehaviorEvidence': []}
            for name in sorted(set(names))}


def reviewed_dynamic_families(name):
    """Manual syntax audit of the pinned compiler, not a Web parser implementation."""
    if name == 'dialogue':
        return [{'family': 'text<N>', 'inputKeyPattern': '^text[0-9]+$',
                 'compilerFunction': 'dialogue', 'sourceLines': [4561, 4601],
                 'valueSyntax': 'double-quoted text',
                 'ordering': 'numeric index sort, then canonical text%v key lookup',
                 'followUp': 'Verify leading-zero/duplicate indices, integer conversion, escaping and emitted-text order in native and Web execution'}]
    if name in MAP_CONTROLLERS:
        return [{'family': 'map(KEY)', 'compilerFunction': 'mapSetSub',
                 'sourceLines': [4758, 4883],
                 'keySyntax': 'trimmed nonempty literal name between map( and ); case-insensitive map prefix',
                 'valueSyntax': 'one float expression',
                 'cardinality': 'at most one map(KEY) key per controller',
                 'alternateForms': ['map = "KEY" plus value = expression',
                                    'assignment syntax carried in the map parameter; = or := after the closing parenthesis'],
                 'followUp': 'Verify CNS versus ZSS parsing, precedence between forms, warnings/errors, quoting, empty names/values, redirects and target scope against native execution'}]
    return []


class ControllerDocument(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.current = None
        self.capture = None
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in ('h1', 'h2', 'dt'):
            self.capture = tag
            self.parts = []
        if tag == 'a' and self.current and self.capture not in ('h1', 'h2'):
            href = dict(attrs).get('href', '')
            if href.startswith('#') and href not in self.current['referenceLinks']:
                self.current['referenceLinks'].append(href)

    def handle_data(self, data):
        if self.capture:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag != self.capture:
            return
        text = ' '.join(''.join(self.parts).split())
        self.capture = None
        if tag == 'h1':
            self.current = None
        elif tag == 'h2':
            self.current = {'controller': text.lower(), 'documentHeading': text,
                            'documentLine': self.getpos()[0], 'parameterCandidates': [],
                            'referenceLinks': [],
                            'unresolvedTerms': []}
            self.rows.append(self.current)
        elif self.current and tag == 'dt' and '=' in text:
            name = text.split('=', 1)[0].strip().lower()
            if re.fullmatch(r'[a-z][a-z0-9_.]*', name):
                if name not in self.current['parameterCandidates']:
                    self.current['parameterCandidates'].append(name)
            else:
                self.current['unresolvedTerms'].append(text)


def resolve_parameter_references(rows, references):
    """Document syntax inheritance only; runtime/default semantics remain unassessed."""
    by_name = {row['controller']: row for row in rows}
    resolved, visiting = {}, set()

    def visit(name):
        if name in resolved:
            return resolved[name]
        if name in visiting:
            raise ValueError('Cyclic document parameter reference: ' + name)
        if name not in by_name:
            raise ValueError('Unknown document parameter reference: ' + name)
        visiting.add(name)
        row = by_name[name]
        inline = row['parameterCandidates']
        inherited = visit(references[name]) if name in references else []
        resolved[name] = sorted(set(inline) | set(inherited))
        visiting.remove(name)
        return resolved[name]

    for name in by_name:
        visit(name)
    return resolved


def build(document, registry, compiler=None):
    digest = hashlib.sha256(document).hexdigest()
    if digest != MUGEN_SHA256:
        raise ValueError('MUGEN documentation snapshot differs from pinned baseline')
    if registry['referenceCommit'] != IKEMEN_COMMIT:
        raise ValueError('Ikemen controller inventory differs from pinned baseline')
    if compiler is None or hashlib.sha256(compiler).hexdigest() != IKEMEN_COMPILER_SHA256:
        raise ValueError('Ikemen compiler snapshot differs from pinned baseline')
    parser = ControllerDocument()
    parser.feed(document.decode('utf-8-sig'))
    names = [r['controller'] for r in parser.rows]
    if len(names) != 89 or len(names) != len(set(names)):
        raise ValueError('Missing or duplicate MUGEN controller headings')
    ikemen = registry['controllers']
    if registry['controllerCount'] != len(ikemen) or len(ikemen) != 163:
        raise ValueError('Ikemen inventory count mismatch')
    if len({r['controller'] for r in ikemen}) != len(ikemen):
        raise ValueError('Duplicate Ikemen controller registry entries')
    mugen_by_name = {r['controller']: r for r in parser.rows}
    parameters_by_name = resolve_parameter_references(parser.rows, MUGEN_PARAMETER_REFERENCES)
    rows = []
    for row in parser.rows:
        name = row['controller']
        parameters = parameters_by_name[name]
        if not parameters and name not in MUGEN_PARAMETERLESS:
            raise ValueError('Unresolved empty MUGEN parameter inventory: ' + name)
        if parameters and name in MUGEN_PARAMETERLESS:
            raise ValueError('Unexpected parameters for parameterless MUGEN controller: ' + name)
        rows.append({**row, 'reference': 'mugen-1.1-beta1',
                     'inlineParameterCandidates': row['parameterCandidates'],
                     'parameterCandidates': parameters,
                     'parameterReference': MUGEN_PARAMETER_REFERENCES.get(name),
                     'parameterlessInDocument': name in MUGEN_PARAMETERLESS,
                     'parameterInventoryStatus': 'Document syntax candidates; defaults, alternate syntax and field applicability require semantic review',
                     'parameterEvidence': evidence_entries(parameters),
                     'stages': {stage: 'Unassessed' for stage in STAGES}})
    for row in ikemen:
        base = mugen_by_name.get(row['controller'])
        parameters = row['parameterCandidates']
        families = reviewed_dynamic_families(row['controller'])
        resolved_warning = ('dialogue: dynamic parameter names' if row['controller'] == 'dialogue'
                            else 'map(KEY) assignment syntax requires semantic parsing')
        warnings = row['unresolvedExtraction']
        unresolved = [warning for warning in warnings if not families or warning != resolved_warning]
        rows.append({'controller': row['controller'], 'reference': 'ikemen-' + IKEMEN_COMMIT,
                     'parameterCandidates': parameters,
                     'commonParameters': row['commonParameters'],
                     'parameterEvidence': evidence_entries(parameters + row['commonParameters'] + [family['family'] for family in families]),
                     'legacyExtractionWarnings': warnings,
                     'reviewedManualParameterFamilies': families,
                     'unresolvedExtraction': unresolved,
                     'dynamicSyntaxCertifiedExecutable': False,
                     'compilerFunctionsInspected': row['compilerFunctionsInspected'],
                     'hasMugenHeading': base is not None,
                     'candidateParameterDifference': sorted(set(parameters) - set(parameters_by_name[row['controller']])) if base else parameters,
                     'differenceMeaning': 'Name difference only; not verified extension semantics',
                     'stages': {stage: 'Unassessed' for stage in STAGES}})
    return {'schema': 'moon-palace-controller-baseline-v1',
            'certification': 'Input inventory only. Existing runtime evidence must be reconciled per item; Unassessed does not mean absent.',
            'references': {'mugenDocumentSha256': digest, 'ikemenCommit': IKEMEN_COMMIT,
                           'ikemenCompilerSha256': IKEMEN_COMPILER_SHA256},
            'scopeExclusion': 'Character costume recoloring is excluded by the user. Gameplay PalFX remains in scope.',
            'mugenControllerHeadings': len(parser.rows), 'ikemenRegistryControllers': len(ikemen),
            'rows': rows,
            'remaining': ['Resolve alternate syntax and inherited-field applicability, especially ModifyExplod',
                          'Verify manually inventoried dynamic Ikemen syntax in native and Web execution',
                          'Classify documented Ikemen extensions separately from compiler-only names',
                          'Reconcile per-parameter consumers, defaults, reference behavior and executable semantic tests',
                          'Inventory remaining nine engine subsystems']}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--mugen-document', required=True, type=Path)
    cli.add_argument('--ikemen-inventory', required=True, type=Path)
    cli.add_argument('--ikemen-compiler', required=True, type=Path)
    cli.add_argument('--output', required=True, type=Path)
    args = cli.parse_args()
    result = build(args.mugen_document.read_bytes(), json.loads(args.ikemen_inventory.read_text(encoding='utf-8-sig')), args.ikemen_compiler.read_bytes())
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps({key: result[key] for key in ('mugenControllerHeadings', 'ikemenRegistryControllers')}))
