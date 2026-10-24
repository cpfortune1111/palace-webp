import argparse
import json
from pathlib import Path

from sound_sample_metadata import enrich_sound_manifest


parser = argparse.ArgumentParser()
parser.add_argument('--imported', type=Path, required=True)
parser.add_argument('--manifest', type=Path, required=True)
arguments = parser.parse_args()
sounds = json.loads(arguments.manifest.read_text(encoding='utf-8'))
print(json.dumps(enrich_sound_manifest(arguments.imported, sounds), indent=2))
