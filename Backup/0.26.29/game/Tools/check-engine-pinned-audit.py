"""Cross-check actual pinned audit inputs. This does not certify engine execution."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path


def load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + '.py'))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--reference-root', required=True, type=Path)
cli.add_argument('--registry-source', required=True, type=Path)
cli.add_argument('--compiler-source', required=True, type=Path)
cli.add_argument('--official-controller-cache', required=True, type=Path)
cli.add_argument('--output', required=True, type=Path)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
metadata = json.loads((root / 'Docs/ENGINE-REFERENCE-BASELINE.json').read_text(encoding='utf-8-sig'))
assert len(metadata['files']) == 31
for entry in metadata['files']:
    data = (args.reference_root / entry['path']).read_bytes()
    assert len(data) == entry['bytes'], entry['path'] + ' size'
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], entry['path'] + ' SHA-256'
    assert hashlib.sha1(b'blob ' + str(len(data)).encode('ascii') + b'\0' + data).hexdigest() == entry['gitBlobSha'], entry['path'] + ' Git blob'

controllers = load('audit-engine-controller-baseline')
expressions = load('audit-engine-expression-baseline')
cns = load('audit-engine-cns-baseline')
legacy = load('audit-controller-parameters')
registry_bytes, compiler_bytes = args.registry_source.read_bytes(), args.compiler_source.read_bytes()
inventory = json.loads((root / 'Docs/CONTROLLER-AUDIT.json').read_text(encoding='utf-8-sig'))
assert legacy.build_inventory(registry_bytes.decode('utf-8-sig'), compiler_bytes.decode('utf-8-sig')) == inventory
official = controllers.build(args.official_controller_cache.read_bytes(), inventory, compiler_bytes)
mirrored = controllers.build((args.reference_root / 'docs/sctrls.html').read_bytes(), inventory, compiler_bytes)
assert official['rows'] == mirrored['rows'], 'Official-cache and mirrored controller inventories must agree'
evidence = json.loads((root / 'Docs/ENGINE-EXPRESSION-EVIDENCE.json').read_text(encoding='utf-8-sig'))
expression_report = expressions.build(registry_bytes, evidence, (args.reference_root / 'docs/trigger.html').read_bytes())
cns_report = cns.build((args.reference_root / 'docs/cns.html').read_bytes())
assert len(expression_report['mugenTriggerSpellings']) == 132
assert not expression_report['mugenSpellingsAbsentFromCompiler']
assert not expression_report['mugenHeadingsWithoutFormatCandidates']
assert len({row['id'] for row in expression_report['mugenTriggerSpellings']}) == 132
assert {row['name'] for row in expression_report['mugenTriggerRows'] if row['formatNameDisagreements']} == {'drawgame', 'gamewidth', 'prevstateno', 'projguardedtime', 'rightedge'}
selector_counts = {row['name']: len(row['selectorInventory']['candidates']) for row in expression_report['mugenTriggerRows'] if row['selectorInventory']}
assert selector_counts == {'const': 74, 'gethitvar': 36, 'stagevar': 4}
mugen_redirects = {row['name'] for row in cns_report['redirectForms']}
compiler_redirects = {row['name'] for row in expression_report['rows'] if row['kind'] == 'redirect'}
assert len(mugen_redirects) == 8 and mugen_redirects <= compiler_redirects
unclassified_redirects = sorted(compiler_redirects - mugen_redirects)
assert unclassified_redirects == ['helperindex', 'p2', 'player', 'playerindex', 'stateowner']
for row in expression_report['mugenTriggerSpellings']:
    assert set(row['stages']) == set(expressions.STAGES)
    assert set(row['stages'].values()) == {'Unassessed'}

report = {'scope': 'Pinned audit inputs and extraction only; no runtime compatibility certification',
          'referenceTextDocumentsVerified': 31, 'legacyCompilerInventoryReproduced': True,
          'officialAndMirroredControllerRowsIdentical': True,
          'mugenTriggerSections': 127, 'independentMugenTriggerSpellings': 132,
          'selectorCandidateCounts': selector_counts, 'mugenRedirectNames': sorted(mugen_redirects),
          'compilerRedirectNamesOutsideCnsList': unclassified_redirects,
          'cnsCounts': {key: len(cns_report[key]) for key in ('operatorPrecedenceGroups', 'operatorRows', 'intervalForms', 'redirectForms', 'stateDefFields', 'specialStateNumbers')},
          'goalComplete': False}
args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print('PASS pinned text/source hashes, reproduced legacy inventory, identical controller copies, trigger/selector variants and CNS cross-reference boundaries')
