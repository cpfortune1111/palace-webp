"""Check pinned stage/asset inventory facts; this is not runtime conformance."""
import argparse
import hashlib
import json
from pathlib import Path
import re

from reference_go_scan import declaration

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--source-root', required=True, type=Path)
cli.add_argument('--background-document', required=True, type=Path)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
ledger = json.loads((root / 'Docs/STAGE-ASSET-COVERAGE.json').read_text(encoding='utf-8'))
names = {'common': 'common-pinned'}
sources = {}
for path, pin in ledger['references']['sources'].items():
    name = Path(path).stem
    data = (args.source_root / ('ikemen-' + names.get(name, name) + '.go')).read_bytes()
    assert hashlib.sha256(data).hexdigest() == pin, path
    sources[name] = data.decode('utf-8')
data = args.background_document.read_bytes()
assert hashlib.sha256(data).hexdigest() == ledger['references']['mugenBackgroundDocumentSha256']
body = declaration(sources['stage'], 'func (bgc *bgCtrl) read(')['body']
types = re.findall(r'case "([a-z]+)":', body)
bg = ledger['stage']['backgroundControllers']
assert types == bg['ikemenRead'], types
keys = set(re.findall(r'(?:is\[|is\.[a-zA-Z0-9_]+\()"([a-z]+)"', body))
expected = set(sum((bg[key] for key in ('commonReadKeys', 'xyReadKeys', 'remapReadKeys', 'palfxReadKeys', 'otherReadKeys')), []))
assert keys == expected, (keys - expected, expected - keys)
assert ledger['status'] == 'Partial' and ledger['goalComplete'] is False
evidence = ledger['assets']['sff']['semanticEvidence']
assert evidence['cases'] == sum(evidence['encodingCounts'].values()) == 2460
assert len(evidence['characters']) == 5
assert sum(len(row['sampledIndices']) for row in evidence['characters']) == 80
for row in evidence['characters']:
    assert row['matched'] is True
    assert len(set(row['sampledIndices'])) == len(row['sampledIndices'])
    assert max(row['sampledIndices']) < row['spriteCount']
for path in ledger['stage']['examinedConsumers'] + ledger['assets']['examinedConsumers']:
    assert (root / path.split(':', 1)[0]).is_file(), path
print('PASS five native source pins, BGCtrl type/key inventory, evidence counts and examined consumer paths')
