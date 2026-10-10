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
actions = json.loads((arguments.imported / 'air_sections.json').read_text(encoding='utf-8'))
enabled = tuple(str(action['id']) for action in actions if action['id'] not in (60, 9050))
export(arguments.source, arguments.output, enabled, 'jupiter_full', 'jupiter', webp_quality=85, blank_pairs=((122, 0), (951, 99), (953, 99)), trim_transparent=True)
metadata_path = arguments.output / 'jupiter_full.json'
metadata = json.loads(metadata_path.read_text(encoding='utf-8'))
metadata['character'] = 'SailorJupiter'
metadata['disabledActions'] = [60, 9050]
metadata['compression'] = {'format': 'webp', 'quality': 85, 'alphaQuality': 100}
metadata_path.write_text(json.dumps(metadata, separators=(',', ':')), encoding='utf-8')
for atlas in arguments.output.glob('jupiter_full_atlas-*.webp'):
    if atlas.name not in metadata['atlasFiles']:
        atlas.unlink()
