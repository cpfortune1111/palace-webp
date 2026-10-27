import argparse
import hashlib
import io
import json
import re
from pathlib import Path

import numpy
import soundfile

from sound_sample_metadata import source_sound_metadata, verified_sound_samples


parser = argparse.ArgumentParser()
parser.add_argument('--imported', type=Path, required=True)
parser.add_argument('--manifest', type=Path, required=True)
parser.add_argument('--keys', required=True)
parser.add_argument('--output', type=Path, required=True)
arguments = parser.parse_args()
sounds = json.loads(arguments.manifest.read_text(encoding='utf-8'))
selected = {key: sounds[key] for key in arguments.keys.split(',')}
arguments.output.mkdir(parents=True, exist_ok=True)
report = {}
for key, sound, sample in verified_sound_samples(arguments.imported, selected):
    if not re.fullmatch(r'-?\d+-\d+', key):
        raise ValueError('Invalid native sound filename')
    metadata = source_sound_metadata(sample)
    subtype = {1: 'PCM_S8', 2: 'PCM_16', 3: 'PCM_24'}.get(metadata['sourceSampleWidth'])
    if subtype is None:
        raise ValueError('Unsupported lossless FLAC sample width')
    frames, rate = soundfile.read(io.BytesIO(sample), dtype='int32', always_2d=True)
    encoded = io.BytesIO()
    soundfile.write(encoded, frames, rate, format='FLAC', subtype=subtype)
    payload = encoded.getvalue()
    restored, restored_rate = soundfile.read(io.BytesIO(payload), dtype='int32', always_2d=True)
    if restored_rate != rate or not numpy.array_equal(frames, restored):
        raise ValueError('Lossless sound round-trip mismatch')
    if len(payload) >= len(sample):
        raise ValueError('Native FLAC does not reduce original sample size')
    filename = key + '.flac'
    (arguments.output / filename).write_bytes(payload)
    report[key] = {'nativeFile': 'Native/' + filename,
                   'nativeSHA256': hashlib.sha256(payload).hexdigest(),
                   'nativeBytes': len(payload), 'sourceBytes': len(sample)}
print(json.dumps(report, indent=2))
