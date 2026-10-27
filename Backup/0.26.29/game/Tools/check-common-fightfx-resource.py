import hashlib
import json
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
resource = json.loads((root / 'Data/Common/fightfx-resource.json').read_text())
animations = json.loads((root / 'Data/Common/common_animations_full.json').read_text())
assert resource['prefix'] == 'f'
assert resource['localcoord'] == [320, 240] and resource['scale'] == 1
assert resource['collisionBoxes'] == 'none'
assert resource['source']['airSHA256'] == animations['source']['airSHA256']
assert resource['source']['sffSHA256'] == animations['source']['sffSHA256']
assert len(animations['actions']) == 33
if len(sys.argv) > 1:
    source = Path(sys.argv[1])
    for filename, key in [('fight.def', 'fightDefSHA256'), ('fightfx.air', 'airSHA256'), ('fightfx.sff', 'sffSHA256')]:
        assert hashlib.sha256((source / filename).read_bytes()).hexdigest() == resource['source'][key]
    air = (source / 'fightfx.air').read_text(encoding='utf-8-sig')
    active = '\n'.join(line.split(';')[0] for line in air.splitlines())
    assert not re.search(r'\bclsn[12]', active, re.I)
    assert set(re.findall(r'^\s*\[Begin\s+Action\s+(\d+)\]', active, re.I | re.M)) == set(animations['actions'])
print('PASS verified 33-action FightFX resource, source hashes, default coordinates and collision-free AIR')
