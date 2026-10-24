import argparse
import json
from pathlib import Path

from sound_sample_metadata import wave_sound_manifest


parser = argparse.ArgumentParser()
parser.add_argument('--directory', type=Path, required=True)
parser.add_argument('--prefix', default='')
arguments = parser.parse_args()
print(json.dumps(wave_sound_manifest(arguments.directory, arguments.prefix), indent=2))
