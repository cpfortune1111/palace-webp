"""Check source/evidence reconciliation, identity boundaries and non-certification."""
import argparse
import importlib.util
import json
from pathlib import Path

cli = argparse.ArgumentParser(description=__doc__)
for name in ('mugen-document', 'registry', 'compiler'):
    cli.add_argument('--' + name, type=Path, required=True)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('hitdef_reconcile', Path(__file__).with_name('reconcile-hitdef-coverage.py'))
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)
actual = tool.reconcile(root, args.mugen_document.read_bytes(), args.registry.read_bytes(), args.compiler.read_bytes())
published = json.loads((root / 'Docs/HITDEF-COVERAGE.json').read_text(encoding='utf-8'))
assert actual == published, 'Published coverage differs from pinned source/current evidence inputs'
rows = {row['parameter']: row for row in published['rows']}
assert len(rows) == len(published['rows']) == 131
assert published['counts'] == {'parameters': 131, 'partial': 38, 'unassessed': 93, 'certified': 0,
                               'legacyNotImplementedWithCurrentEvidence': 13}
for row in rows.values():
    assert set(row['stages']) == {'Parsed', 'Executable', 'Source-verified', 'Semantically tested'}
    assert all(value in ('Partial', 'Unassessed') for value in row['stages'].values())
    if row['overall'] == 'Partial':
        assert row['evidence'] and all(item['pending'] and item['tests'] for item in row['evidence'])
    else:
        assert row['overall'] == 'Unassessed'
    assert row['followUp']
assert rows['affectteam']['legacyStatus'] == 'Not implemented' and rows['affectteam']['overall'] == 'Partial'
assert rows['xaccel']['legacyStatus'] == 'Not implemented' and rows['xaccel']['overall'] == 'Partial'
assert rows['damage']['legacyStatus'] == 'Implemented' and rows['damage']['overall'] == 'Unassessed'
assert rows['missonoverride']['overall'] == 'Unassessed', 'ReversalDef evidence must not certify HitDef'
assert rows['teamside']['overall'] == 'Partial' and rows['teamside']['stages']['Semantically tested'] == 'Unassessed', 'Side-filter tests do not prove HitDef teamside compilation semantics'
assert any(row['controller'] == 'ReversalDef' and row['parameter'] == 'missonoverride' for row in published['excludedIndependentEvidence'])
assert published['goalComplete'] is False and published['status'] == 'Partial'
print('PASS 131 source-backed names, 38 scoped partial/93 unassessed records, 13 stale absences and controller identity boundaries')
