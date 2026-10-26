"""Validate runtime evidence against pinned declarations, not full engine conformance."""
import argparse
import hashlib
import json
from pathlib import Path
import re

from reference_go_scan import declaration

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--source-root', type=Path, required=True)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
ledger = json.loads((root / 'Docs/RUNTIME-COVERAGE.json').read_text(encoding='utf-8'))
sources = {}
for name, pin in ledger['references']['sourceHashes'].items():
    source = args.source_root / ('ikemen-' + ('common-pinned' if name == 'common' else name) + '.go')
    data = source.read_bytes()
    assert hashlib.sha256(data).hexdigest() == pin, name
    sources[name] = data.decode('utf-8')
rows = ledger['references']['unchangedDeclarations']
assert len(rows) == 13
for row in rows:
    actual = declaration(sources[row['source']], row['marker'])
    assert actual['line'] == row['line'], row['marker']
    assert hashlib.sha256(actual['text'].encode()).hexdigest() == row['sha256'], row['marker']
def ordered_calls(body, calls):
    positions = []
    for call in calls:
        found = list(re.finditer(r'^\s*' + re.escape(call) + r'\(', body, re.M))
        assert len(found) == 1, call
        positions.append(found[0].start())
    assert positions == sorted(positions), calls
ordered_calls(declaration(sources['char'], 'func (cl *CharList) action(')['body'],
              ['cl.updateRunOrder', 'cl.commandUpdate', 'c.actionPrepare', 'c.actionRun', 'c.actionFinish'])
ordered_calls(declaration(sources['system'], 'func (s *System) action(')['body'],
              ['s.cam.ResetTracking', 's.stepRoundState', 's.stage.action', 's.charList.action', 's.charUpdate',
               's.fightScreen.step', 's.globalCollision', 's.globalTick', 's.cam.Update', 's.charList.xScreenBound', 's.explodUpdate'])
ordered_calls(declaration(sources['system'], 'func (s *System) globalTick(')['body'],
              ['s.stage.tick', 's.charList.tick', 'p.tick'])
results = ledger['componentEvidence']['results']
assert (results['randomOperations'], results['tickCases'], results['orderCases']) == (10960, 672, 321)
assert results['matched'] is True and results['goalComplete'] is False
assert ledger['status'] == 'Partial' and ledger['goalComplete'] is False
for name in ('rng', 'tick', 'actorOrder', 'systemOrder', 'statePhases'):
    assert set(ledger[name]['evidenceStages']) == {'Parsed', 'Executable', 'Source-verified', 'Semantically tested'}
    assert set(ledger[name]['evidenceStages'].values()) == {'Partial'}
assert (root / ledger['rng']['consumer']).is_file()
print('PASS runtime source pins, 13 unchanged declaration hashes, observed call order and scoped evidence records')
trace = json.loads((root / 'Docs/RUNTIME-TRACE-EVIDENCE.json').read_text(encoding='utf-8'))
trial = trace['trial']
assert trace['status'] == 'Partial' and trace['goalComplete'] is False
assert trial['sameSeedMatched'] is True and trial['otherSeedDiffers'] is True
assert trial['digests'][0] == trial['digests'][1] != trial['digests'][2]
assert trial['seeds'] == [17, 17, 29] and trial['ticksPerRun'] == 360
assert trial['sourceChanges'] == [] and trial['sourceFileCount'] == 332
driver = root / 'Tools/check-runtime-trace-repeatability.cjs'
assert hashlib.sha256(driver.read_bytes()).hexdigest() == trial['driverSha256'], 'Trace driver evidence is stale'
assert trial['snapshotPolicy'].startswith('Immutable plain-data projection')
assert trial['maxEntities'] > 0 and trial['minimumLife'][1] < 1000 and trial['legacyRandomCalls'] > 0
print('PASS actual Web trace evidence identity, frozen driver and explicitly Partial repeatability scope')
