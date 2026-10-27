import io
import hashlib
import json
import re
import wave
from pathlib import Path


def source_sound_metadata(sample):
    with wave.open(io.BytesIO(sample), 'rb') as recording:
        return {
            'sourceSampleRate': recording.getframerate(),
            'sourceFrames': recording.getnframes(),
            'sourceChannels': recording.getnchannels(),
            'sourceSampleWidth': recording.getsampwidth(),
        }


def verified_sound_samples(imported, sounds):
    imported = Path(imported)
    manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8'))
    original = (imported / 'original').resolve()
    source_path = (original / manifest['dependencies']['sound']).resolve()
    if not source_path.is_relative_to(original):
        raise ValueError('Sound source escapes original import directory')
    source = source_path.read_bytes()
    directory = json.loads((imported / 'snd_directory.json').read_text(encoding='utf-8'))
    entries = {f"{entry['group']}-{entry['number']}": entry for entry in directory}
    for key, sound in sounds.items():
        entry = entries[key]
        offset, length = entry['offset'], entry['bytes']
        if offset < 0 or length < 0 or offset + length > len(source):
            raise ValueError('Sound sample outside imported source')
        sample = source[offset:offset + length]
        digest = hashlib.sha256(sample).hexdigest()
        if digest != entry['sha256'] or digest != sound['sourceSHA256']:
            raise ValueError('Sound source checksum mismatch')
        yield key, sound, sample


def enrich_sound_manifest(imported, sounds):
    return {key: {**sound, **source_sound_metadata(sample)}
            for key, sound, sample in verified_sound_samples(imported, sounds)}


def wave_sound_manifest(directory, prefix=''):
    sounds = {}
    for path in sorted(Path(directory).glob('*.wav')):
        matched = re.fullmatch(re.escape(prefix) + r'(-?\d+)-(-?\d+)\.wav', path.name)
        if not matched:
            raise ValueError('Invalid grouped wave sound filename')
        sample = path.read_bytes()
        metadata = source_sound_metadata(sample)
        digest = hashlib.sha256(sample).hexdigest()
        sounds[f'{matched[1]}-{matched[2]}'] = {
            'file': path.name,
            'ticks': round(metadata['sourceFrames'] / metadata['sourceSampleRate'] * 60),
            'sourceSHA256': digest, 'nativeSHA256': digest, **metadata,
        }
    return sounds
