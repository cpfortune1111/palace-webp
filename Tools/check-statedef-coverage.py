"""Verify StateDef inventory/source facts and scoped evidence records."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
from reference_go_scan import declaration

cli = argparse.ArgumentParser(description=__doc__)
for name in ('compiler', 'bytecode', 'cns'):
    cli.add_argument('--' + name, type=Path, required=True)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
ledger = json.loads((root / 'Docs/STATEDEF-COVERAGE.json').read_text(encoding='utf-8'))
sources = {}
for name, field in (('compiler', 'compilerSha256'), ('bytecode', 'bytecodeSha256'), ('cns', 'cnsDocumentSha256')):
    data = getattr(args, name).read_bytes()
    assert hashlib.sha256(data).hexdigest() == ledger['references'][field], name
    sources[name] = data.decode('utf-8-sig')
header = declaration(sources['compiler'], 'func (c *CharCompiler) stateDef(')['body']
keys = re.findall(r'(?:stateParam|paramValue|paramPrefixValue)\(is,\s*(?:sc,\s*)?"([a-z0-9]+)"', header)
assert keys == ledger['nativeCompilerOrder'] and len(keys) == len(set(keys)) == 13
body = declaration(sources['bytecode'], 'func (sc stateDef) Run(')['body']
assert re.findall(r'case stateDef_([a-z0-9]+):', body) == ledger['nativeHeaderExecutionOrder']
spec = importlib.util.spec_from_file_location('cns_baseline', Path(__file__).with_name('audit-engine-cns-baseline.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
documented = module.build(args.cns.read_bytes())['stateDefFields']
assert {row['name'] for row in documented} == set(keys)
assert {row['parameter'] for row in ledger['rows']} == set(keys)
assert ledger['counts'] == {'mugenFields': 13, 'nativeCompilerFields': 13, 'reviewedFields': 13, 'partial': 13, 'certified': 0}
for row in ledger['rows']:
    assert set(row['stages']) == {'Parsed', 'Executable', 'Source-verified', 'Semantically tested'}
    assert set(row['stages'].values()) == {'Partial'}
    assert row['pending'] and row['nativeRule']
    for path in row['runtimeConsumers'] + row['semanticTests']:
        assert (root / path).is_file(), path
assert ledger['status'] == 'Partial' and ledger['goalComplete'] is False
print('PASS 13 MUGEN/native StateDef fields, source header order and distinct Partial evidence records')
