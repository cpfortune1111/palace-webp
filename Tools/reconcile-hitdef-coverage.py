"""Reconcile HitDef name inventory and reviewed evidence without promoting legacy claims."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path


def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(filename))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def reconcile(root, document, registry, compiler):
    baseline = module('controller_baseline', 'audit-engine-controller-baseline.py')
    source_inventory = module('controller_inventory', 'audit-controller-parameters.py')
    assert hashlib.sha256(registry).hexdigest() == 'e027f39df8f86d3ea9b7c422237f4c1525795d70eb1365b136e9a31c75bcd9f8'
    inventory = source_inventory.build_inventory(registry.decode('utf-8-sig'), compiler.decode('utf-8-sig'))
    complete = baseline.build(document, inventory, compiler)
    inputs = [row for row in complete['rows'] if row['controller'] == 'hitdef']
    assert len(inputs) == 2
    by_reference = {row['reference']: set(row['parameterCandidates']) for row in inputs}
    names = sorted(set.union(*by_reference.values()))
    legacy_bytes = (root / 'Docs/HITDEF-AUDIT.json').read_bytes()
    legacy = {row['parameter']: row for row in json.loads(legacy_bytes)}
    assert set(legacy) == set(names), 'Legacy/new name differences require explicit review'
    reviewed_bytes = (root / 'Docs/HITDEF-REVIEWED-EVIDENCE.json').read_bytes()
    reviewed = json.loads(reviewed_bytes)
    incremental_bytes = (root / 'Docs/HITDEF-PARAMETER-EVIDENCE.json').read_bytes()
    incremental = json.loads(incremental_bytes)
    evidence = {}
    for index, group in enumerate(reviewed['groups']):
        assert group['pending'] and group['observation'] and group['runtime'] and group['tests']
        for path in group['runtime'] + group['tests'] + group['documents']:
            assert (root / path).is_file(), path
        for parameter in group['parameters']:
            assert parameter in names, parameter
            evidence.setdefault(parameter, []).append({'kind': 'reviewed-group', 'index': index,
                'observation': group['observation'], 'runtime': group['runtime'], 'tests': group['tests'],
                'pending': group['pending'], 'documents': group['documents'],
                'stageOverrides': group.get('stageOverrides', {}).get(parameter, {})})
    excluded = []
    for index, item in enumerate(incremental['rows']):
        if item['controller'] != 'HitDef':
            excluded.append({'controller': item['controller'], 'parameter': item['parameter'],
                             'reason': 'Controller identity is distinct; no implicit promotion into HitDef'})
            continue
        parameter = item['parameter']
        assert parameter in names and item['status'] in ('Partial', 'Preparatory') and item['pending']
        for test in item['tests']:
            assert (root / 'Tools' / test).is_file(), test
        evidence.setdefault(parameter, []).append({'kind': 'incremental-row', 'index': index,
            'observation': item['runtime'], 'tests': ['Tools/' + name for name in item['tests']],
            'pending': item['pending'], 'status': item['status']})
    rows = []
    stages = ('Parsed', 'Executable', 'Source-verified', 'Semantically tested')
    for parameter in names:
        current = evidence.get(parameter, [])
        reviewed_execution = any(item.get('status', 'Partial') == 'Partial' for item in current)
        assessments = {stage: 'Partial' if reviewed_execution else 'Unassessed' for stage in stages}
        if current and not reviewed_execution:
            assessments['Parsed'] = 'Partial'
        for item in current:
            for stage, status in item.get('stageOverrides', {}).items():
                assert stage in stages and status in ('Partial', 'Unassessed')
                assessments[stage] = status
        rows.append({'parameter': parameter, 'references': [name for name, keys in by_reference.items() if parameter in keys],
                     'overall': 'Partial' if reviewed_execution else 'Unassessed', 'stages': assessments,
                     'legacyStatus': legacy[parameter]['status'], 'evidence': current,
                     'followUp': 'Complete defaults, evaluation/order, version, all actors and executable native comparisons' if current else
                     'Current consumer/default/test reconciliation still required; legacy status is historical, not an absence or support certification'})
    partial = sum(row['overall'] == 'Partial' for row in rows)
    return {'schema': 'moon-palace-hitdef-coverage-v1', 'status': 'Partial', 'goalComplete': False,
            'runtimeVersion': '0.26.22', 'references': complete['references'],
            'inputHashes': {'legacyAudit': hashlib.sha256(legacy_bytes).hexdigest(),
                            'reviewedEvidence': hashlib.sha256(reviewed_bytes).hexdigest(),
                            'incrementalEvidence': hashlib.sha256(incremental_bytes).hexdigest()},
            'scope': 'HitDef parameter name union and reviewed existing consumer reconciliation. Not complete combat/HitDef certification; common controller fields and independent ReversalDef/Projectile fields stay separate.',
            'counts': {'parameters': len(rows), 'partial': partial, 'unassessed': len(rows) - partial, 'certified': 0,
                       'legacyNotImplementedWithCurrentEvidence': sum(row['legacyStatus'] == 'Not implemented' and bool(row['evidence']) for row in rows)},
            'excludedIndependentEvidence': excluded, 'rows': rows}


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    for name in ('mugen-document', 'registry', 'compiler', 'output'):
        cli.add_argument('--' + name, type=Path, required=True)
    cli.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    args = cli.parse_args()
    result = reconcile(args.root, args.mugen_document.read_bytes(), args.registry.read_bytes(), args.compiler.read_bytes())
    args.output.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result['counts']))
