import argparse
import json
import sys
import re
import shutil
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'Legacy'))
from export_venus_turn import export

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--runtime', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
arguments = parser.parse_args() 
available = {int(value) for value in re.findall(r'\[Begin\s+Action\s+(\d+)\]', (arguments.source / 'neptune.air').read_text(encoding='utf-8-sig'), re.I)}
enabled = available
with tempfile.TemporaryDirectory() as temporary:
    staged = Path(temporary)
    shutil.copy2(arguments.source / 'neptune.sff', staged / 'neptune.sff')
    air = (arguments.source / 'neptune.air').read_text(encoding='utf-8-sig')
    air = re.sub(r'(?m)^(\s*)11\s*,\s*([012])\s*,', r'\g<1>10,\2,', air)
    air = re.sub(r'(?m)^(\s*)5150\s*,\s*10\s*,', r'\g<1>5150,1,', air)
    (staged / 'neptune.air').write_text(air, encoding='utf-8')
    export(staged, arguments.output, tuple(map(str, sorted(enabled))), 'neptune_full', 'neptune', webp_quality=85, blank_pairs=((122, 0), (951, 99), (953, 99)), trim_transparent=True)
path = arguments.output / 'neptune_full.json'
metadata = json.loads(path.read_text(encoding='utf-8'))
metadata['character'] = 'SailorNeptune'
metadata['compression'] = {'format': 'webp', 'quality': 85, 'alphaQuality': 100}
path.write_text(json.dumps(metadata, separators=(',', ':')), encoding='utf-8')
