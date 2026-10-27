"""Inventory pinned compiler trigger/redirect names, without certifying Web execution."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re

COMMIT = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
SOURCE_SHA256 = 'e027f39df8f86d3ea9b7c422237f4c1525795d70eb1365b136e9a31c75bcd9f8'
STAGES = ('Parsed', 'Executable', 'Source-verified', 'Semantically tested')
GROUPS = {'Redirections', 'Mugen triggers', 'Ikemen triggers'}
MUGEN_TRIGGER_SHA256 = 'b90c6f80a749b6e3862949939e1191f1416a8a708476bdb6a27fe89e1bbc15de'
MUGEN_MIRROR_COMMIT = '5ed02054fe5e80c24259b9da1f7d129b995676c9'
MUGEN_FORMAT_REFERENCES = {
    'p1name': 'name', 'p2name': 'p1name', 'p3name': 'p1name', 'p4name': 'p1name',
    'p2life': 'life', 'p2movetype': 'movetype', 'p2stateno': 'stateno',
    'p2statetype': 'statetype', 'selfanimexist': 'animexist',
}


class Element:
    def __init__(self, tag, attrs=None, line=0, parent=None):
        self.tag, self.attrs, self.line, self.parent = tag, dict(attrs or []), line, parent
        self.children = []

    def walk(self, tag=None):
        if tag is None or self.tag == tag:
            yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk(tag)

    def text(self):
        parts = []
        for child in self.children:
            if isinstance(child, str):
                parts.append(child)
            else:
                value = child.text()
                parts.append('\n' + value + '\n' if child.tag in {'p', 'li', 'dd', 'dt', 'pre', 'br', 'tr'} else value)
        return ''.join(parts)


class DocumentTree(HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element('document')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs, self.getpos()[0], self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def compact(text):
    return ' '.join(text.split())


def definition_values(section, label):
    results = []
    for node in section.walk('dt'):
        if compact(node.text()).rstrip(':').lower() != label:
            continue
        siblings = [child for child in node.parent.children if isinstance(child, Element)]
        index = siblings.index(node)
        if index + 1 >= len(siblings) or siblings[index + 1].tag != 'dd':
            raise ValueError('Missing document definition for ' + label)
        results.append({'text': compact(siblings[index + 1].text()), 'sourceLine': node.line})
    return results


def selector_candidates(section):
    records, argument_names, detail_names = {}, set(), set()

    def add(spelling, origin, line):
        name = spelling.lower()
        row = records.setdefault(name, {'name': name, 'documentSpellings': [], 'argumentListLines': [],
                                       'detailListLines': [], 'stages': {stage: 'Unassessed' for stage in STAGES}})
        if spelling not in row['documentSpellings']:
            row['documentSpellings'].append(spelling)
        row[origin].append(line)

    for node in section.walk('dt'):
        label = compact(node.text()).rstrip(':').lower()
        if 'valid values are' not in label:
            continue
        for entry in definition_values(section, label):
            text = entry['text'].rstrip('.')
            for spelling in text.split(','):
                spelling = spelling.strip()
                if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_.]*', spelling):
                    raise ValueError('Unparsed documented selector list: ' + text)
                add(spelling, 'argumentListLines', entry['sourceLine'])
                argument_names.add(spelling.lower())
    for node in section.walk('li'):
        match = re.match(r'^([A-Za-z][A-Za-z0-9_.]*)\s*:', compact(node.text()))
        if match:
            add(match.group(1), 'detailListLines', node.line)
            detail_names.add(match.group(1).lower())
    return {'candidates': [records[name] for name in sorted(records)],
            'argumentOnly': sorted(argument_names - detail_names) if argument_names else None,
            'detailsOnly': sorted(detail_names - argument_names) if argument_names else None,
            'certification': 'Documented syntax candidates only; list/detail differences require native verification, not automatic aliasing'}


def extract_mugen_triggers(text):
    document = DocumentTree()
    document.feed(text)
    rows, names = [], set()
    suffixes = {'lose': ['loseko', 'losetime'], 'win': ['winko', 'wintime', 'winperfect']}
    for heading in document.root.walk('h2'):
        title = compact(heading.text())
        match = re.fullmatch(r'([A-Za-z][A-Za-z0-9]*)(?:\s*\([^)]*\))?', title)
        if not match:
            raise ValueError('Unrecognized MUGEN trigger heading: ' + title)
        name = match.group(1).lower()
        if name in names:
            raise ValueError('Duplicate MUGEN trigger heading: ' + name)
        names.add(name)
        section = heading.parent
        if section.tag != 'div' or 'section' not in section.attrs.get('class', '').split():
            raise ValueError('Missing MUGEN trigger section: ' + name)
        formats = definition_values(section, 'format')
        for paragraph in section.walk('p'):
            value = compact(paragraph.text())
            if value.lower().startswith('format:'):
                formats.append({'text': value[len('format:'):].strip(), 'sourceLine': paragraph.line})
        spellings = [name]
        for suffix in suffixes.get(name, []):
            if not re.search(r'\b' + suffix + r'\b', section.text(), re.I):
                raise ValueError('Missing documented trigger suffix: ' + suffix)
            spellings.append(suffix)
        rows.append({'name': name, 'documentHeading': title,
                     'sourceLine': heading.line, 'anchor': section.attrs.get('id'),
                     'documentedSpellings': spellings, 'formatCandidates': formats,
                     'declaredReturnTypes': definition_values(section, 'return type'),
                     'specialGrammarFamily': name + '<decimal projectile ID>' if name in {'projcontact', 'projguarded', 'projhit'} else None,
                     'argumentAndPropertyInventory': 'Incomplete',
                     'selectorInventory': selector_candidates(section) if name in {'const', 'gethitvar', 'stagevar'} else None,
                     'stages': {stage: 'Unassessed' for stage in STAGES}})
    if not rows:
        raise ValueError('Missing MUGEN trigger headings')
    return rows


def resolve_mugen_formats(rows):
    by_name = {row['name']: row for row in rows}
    visiting, done = set(), set()

    def visit(name):
        if name not in by_name:
            raise ValueError('Unknown MUGEN format reference: ' + name)
        if name in visiting:
            raise ValueError('Cyclic MUGEN format reference: ' + name)
        if name in done:
            return
        visiting.add(name)
        row = by_name[name]
        target = MUGEN_FORMAT_REFERENCES.get(name)
        row['formatReference'] = target
        if not row['formatCandidates'] and target:
            visit(target)
            replacement = re.match(r'[A-Za-z][A-Za-z0-9]*', row['documentHeading']).group(0)
            row['formatCandidates'] = [
                {**entry, 'text': re.sub(r'\b' + re.escape(target) + r'\b', replacement, entry['text'], flags=re.I),
                 'inheritedFrom': target, 'referenceSourceLine': row['sourceLine']}
                for entry in by_name[target]['formatCandidates']]
            if not row['declaredReturnTypes']:
                row['declaredReturnTypes'] = [{**entry, 'inheritedFrom': target, 'referenceSourceLine': row['sourceLine']}
                                              for entry in by_name[target]['declaredReturnTypes']]
        visiting.remove(name)
        done.add(name)

    for name in by_name:
        visit(name)


def extract_registry(source):
    lines = source.splitlines()
    starts = [i for i, line in enumerate(lines) if line.strip() == 'var triggerMap = map[string]int{']
    if len(starts) != 1:
        raise ValueError('Expected exactly one triggerMap registry')
    group, names, rows = None, set(), []
    for index in range(starts[0] + 1, len(lines)):
        line = lines[index].strip()
        if line == '}':
            if not rows:
                raise ValueError('Empty triggerMap registry')
            return rows
        if not line:
            continue
        if line.startswith('// '):
            group = line[3:]
            if group not in GROUPS:
                raise ValueError('Unknown trigger registry group: ' + group)
            continue
        match = re.fullmatch(r'"([a-z][a-z0-9]*)"\s*:\s*([01]),', line)
        if not match or group is None:
            raise ValueError('Unparsed registry line ' + str(index + 1))
        name, flag = match.groups()
        if name in names:
            raise ValueError('Duplicate trigger registry name: ' + name)
        if (group == 'Redirections') != (flag == '0'):
            raise ValueError('Unexpected trigger registry flag for ' + name)
        names.add(name)
        rows.append({'name': name, 'kind': 'redirect' if flag == '0' else 'expression-name',
                     'compilerDeclaredGroup': group, 'registryFlag': int(flag),
                     'sourceLine': index + 1})
    raise ValueError('Unterminated triggerMap registry')


def apply_evidence(rows, evidence):
    if evidence.get('schema') != 'moon-palace-expression-evidence-v1' or evidence.get('referenceCommit') != COMMIT:
        raise ValueError('Expression evidence reference/schema mismatch')
    by_name, seen = {row['name']: row for row in rows}, set()
    for item in evidence['rows']:
        name = item['name']
        if name not in by_name or name in seen:
            raise ValueError('Unknown or duplicate expression evidence: ' + name)
        seen.add(name)
        if set(item['stages']) != set(STAGES) or not set(item['stages'].values()) <= {'Unassessed', 'Partial'}:
            raise ValueError('Initial reconciliation only accepts explicit Unassessed/Partial stage records')
        if not item['remaining']:
            raise ValueError('Partial evidence must retain explicit remaining work')
        target = by_name[name]
        for field in ('stages', 'runtimeConsumers', 'semanticTests', 'nativeBehaviorEvidence', 'verifiedSubset', 'remaining'):
            target[field] = item[field]


def build(source_bytes, evidence=None, mugen_document=None):
    if hashlib.sha256(source_bytes).hexdigest() != SOURCE_SHA256:
        raise ValueError('Compiler snapshot differs from pinned expression baseline')
    rows = extract_registry(source_bytes.decode('utf-8-sig'))
    mugen_rows = []
    if mugen_document is not None:
        if hashlib.sha256(mugen_document).hexdigest() != MUGEN_TRIGGER_SHA256:
            raise ValueError('MUGEN trigger document differs from pinned baseline')
        mugen_rows = extract_mugen_triggers(mugen_document.decode('utf-8-sig'))
        resolve_mugen_formats(mugen_rows)
        for row in mugen_rows:
            row['formatNameDisagreements'] = []
            for entry in row['formatCandidates']:
                text = re.sub(r'^\d+\.\s*', '', entry['text'])
                match = re.match(r'[A-Za-z][A-Za-z0-9]*', text)
                if match and match.group(0).lower() != row['name']:
                    row['formatNameDisagreements'].append({'formatName': match.group(0), 'sourceLine': entry['sourceLine']})
        if len(mugen_rows) != 127:
            raise ValueError('Pinned MUGEN trigger heading count mismatch')
    mugen_names = {name for row in mugen_rows for name in row['documentedSpellings']}
    mugen_spelling_rows = [
        {'id': 'mugen-1.1/trigger/' + name, 'name': name,
         'documentSection': row['name'], 'variantOf': row['name'] if name != row['name'] else None,
         'sourceLine': row['sourceLine'], 'anchor': row['anchor'],
         'stages': {stage: 'Unassessed' for stage in STAGES},
         'runtimeConsumers': [], 'semanticTests': [], 'nativeBehaviorEvidence': [],
         'remaining': ['Independent argument, evaluation and behavior verification; document grouping does not make variants semantically identical']}
        for row in mugen_rows for name in row['documentedSpellings']]
    for row in rows:
        row.update({'id': 'ikemen-compiler/expression/' + row['name'],
                    'officialMugenClassification': ('Documented in pinned MUGEN trigger reference' if row['name'] in mugen_names else 'Not classified: inspect other MUGEN documents and Ikemen extension documentation') if mugen_document is not None else 'Unassessed; compiler comments are not the MUGEN documentation inventory',
                    'stages': {stage: 'Unassessed' for stage in STAGES},
                    'runtimeConsumers': [], 'semanticTests': [], 'nativeBehaviorEvidence': [],
                    'argumentAndPropertyInventory': 'Incomplete'})
    if evidence is not None:
        apply_evidence(rows, evidence)
    return {'schema': 'moon-palace-expression-baseline-v1',
            'reference': {'commit': COMMIT, 'source': 'src/compiler.go', 'sha256': SOURCE_SHA256},
            'certification': 'Name inventory only; registry membership does not prove parser support, Web execution, argument coverage or native behavior parity.',
            'registryCount': len(rows),
            'mugenReference': {'mirrorCommit': MUGEN_MIRROR_COMMIT, 'sha256': MUGEN_TRIGGER_SHA256, 'source': 'docs/trigger.html'} if mugen_document is not None else None,
            'mugenHeadingCount': len(mugen_rows),
            'mugenDocumentedSpellingCount': len(mugen_names),
            'mugenTriggerRows': mugen_rows,
            'mugenTriggerSpellings': mugen_spelling_rows,
            'mugenHeadingsWithoutFormatCandidates': [row['name'] for row in mugen_rows if not row['formatCandidates']],
            'mugenSpellingsAbsentFromCompiler': sorted(mugen_names - {row['name'] for row in rows}),
            'compilerNamesOutsideMugenTriggerReference': sorted({row['name'] for row in rows} - mugen_names) if mugen_document is not None else None,
            'groupCounts': {group: sum(row['compilerDeclaredGroup'] == group for row in rows) for group in sorted(GROUPS)},
            'rows': rows,
            'remaining': ['Pin complete MUGEN trigger and expression documentation',
                          'Separate official MUGEN names and documented Ikemen extensions',
                          'Inventory function arguments, property selectors, aliases and special grammar',
                          'Inventory operators, literals, conversions, precedence, evaluation order, short-circuit and bottom/error propagation',
                          'Reconcile each Web runtime consumer and semantic test with pinned native behavior']}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--compiler', required=True, type=Path)
    cli.add_argument('--output', required=True, type=Path)
    cli.add_argument('--evidence', type=Path)
    cli.add_argument('--mugen-document', type=Path)
    args = cli.parse_args()
    evidence = json.loads(args.evidence.read_text(encoding='utf-8-sig')) if args.evidence else None
    result = build(args.compiler.read_bytes(), evidence, args.mugen_document.read_bytes() if args.mugen_document else None)
    args.output.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: result[key] for key in ('registryCount', 'groupCounts', 'mugenHeadingCount', 'mugenDocumentedSpellingCount', 'mugenSpellingsAbsentFromCompiler')}))
