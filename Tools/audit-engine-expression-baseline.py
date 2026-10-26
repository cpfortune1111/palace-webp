"""Inventory pinned compiler trigger/redirect names, without certifying Web execution."""
import argparse
import hashlib
import json
from pathlib import Path
import re

COMMIT = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
SOURCE_SHA256 = 'e027f39df8f86d3ea9b7c422237f4c1525795d70eb1365b136e9a31c75bcd9f8'
STAGES = ('Parsed', 'Executable', 'Source-verified', 'Semantically tested')
GROUPS = {'Redirections', 'Mugen triggers', 'Ikemen triggers'}


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


def build(source_bytes, evidence=None):
    if hashlib.sha256(source_bytes).hexdigest() != SOURCE_SHA256:
        raise ValueError('Compiler snapshot differs from pinned expression baseline')
    rows = extract_registry(source_bytes.decode('utf-8-sig'))
    for row in rows:
        row.update({'id': 'ikemen-compiler/expression/' + row['name'],
                    'officialMugenClassification': 'Unassessed; compiler comments are not the MUGEN documentation inventory',
                    'stages': {stage: 'Unassessed' for stage in STAGES},
                    'runtimeConsumers': [], 'semanticTests': [], 'nativeBehaviorEvidence': [],
                    'argumentAndPropertyInventory': 'Incomplete'})
    if evidence is not None:
        apply_evidence(rows, evidence)
    return {'schema': 'moon-palace-expression-baseline-v1',
            'reference': {'commit': COMMIT, 'source': 'src/compiler.go', 'sha256': SOURCE_SHA256},
            'certification': 'Name inventory only; registry membership does not prove parser support, Web execution, argument coverage or native behavior parity.',
            'registryCount': len(rows),
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
    args = cli.parse_args()
    evidence = json.loads(args.evidence.read_text(encoding='utf-8-sig')) if args.evidence else None
    result = build(args.compiler.read_bytes(), evidence)
    args.output.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'registryCount': result['registryCount'], 'groupCounts': result['groupCounts']}))
