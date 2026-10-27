import argparse
import hashlib
import json
import subprocess
import wave
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--imported', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--encoder', type=Path, required=True)
arguments = parser.parse_args()
manifest = json.loads((arguments.imported / 'manifest.json').read_text(encoding='utf-8'))
source = (arguments.imported / 'original' / manifest['dependencies']['sound']).read_bytes()
directory = json.loads((arguments.imported / 'snd_directory.json').read_text(encoding='utf-8'))
arguments.output.mkdir(parents=True, exist_ok=True)
sounds = {}
for entry in directory:
    sample = source[entry['offset']:entry['offset'] + entry['bytes']]
    if hashlib.sha256(sample).hexdigest() != entry['sha256']:
        raise ValueError('Source sound checksum mismatch')
    key = f"{entry['group']}-{entry['number']}"
    temporary = arguments.imported / (key + '.wav')
    temporary.write_bytes(sample)
    with wave.open(str(temporary)) as recording:
        seconds = recording.getnframes() / recording.getframerate()
    filename = key + '.mp3'
    subprocess.run([str(arguments.encoder), '-y', '-hide_banner', '-loglevel', 'error',
                    '-i', str(temporary), '-map_metadata', '-1', '-codec:a', 'libmp3lame',
                    '-b:a', '128k', str(arguments.output / filename)], check=True)
    sounds[key] = {'file': filename, 'ticks': round(seconds * 60),
                   'sourceSHA256': entry['sha256']}
    temporary.unlink()
(arguments.output / 'sounds.json').write_text(json.dumps(sounds, indent=2) + '\n', encoding='utf-8')
print('Compressed', len(sounds), 'character sounds')
