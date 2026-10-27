import hashlib
import json
from pathlib import Path

source = Path('outputs/venus/original/venus.snd').read_bytes()
directory = json.loads(Path('outputs/venus/snd_directory.json').read_text(encoding='utf-8'))
required = {(1000, 0), (1100, 0), (1200, 0), (3000, 0), (3000, 1), (5, 0), (200, 2)} | {(900, number) for number in range(9)} | {(10, number) for number in range(4)}
for sound in directory:
    key = (sound['group'], sound['number'])
    if key not in required:
        continue
    sample = source[sound['offset']:sound['offset'] + sound['bytes']]
    assert hashlib.sha256(sample).hexdigest() == sound['sha256']
    target = Path('work/battle-sounds') / f'{key[0]}-{key[1]}.wav'
    target.write_bytes(sample)
    print(target)
