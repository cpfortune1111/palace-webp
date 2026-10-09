import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'Legacy'))
from export_venus_turn import export

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--imported', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
arguments = parser.parse_args()
disabled = {195, 612, 614, 830, 3199}
actions = json.loads((arguments.imported / 'air_sections.json').read_text(encoding='utf-8'))
enabled = tuple(str(action['id']) for action in actions if action['id'] not in disabled)
export(arguments.source, arguments.output, enabled, 'moon_full', 'moon', webp_quality=85)
metadata_path = arguments.output / 'moon_full.json'
metadata = json.loads(metadata_path.read_text(encoding='utf-8'))
metadata['character'] = 'SailorMoon'
metadata['disabledActions'] = sorted(disabled)
metadata['disabledTransitions'] = [{'state': 823, 'target': 10612}]
metadata['runtimeEnabled'] = False
metadata['compression'] = {'format': 'webp', 'quality': 85, 'alphaQuality': 100}
metadata_path.write_text(json.dumps(metadata, separators=(',', ':')), encoding='utf-8')
