import json
import math
import re
import wave
from pathlib import Path

source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\stages\StageTraining.def')
sections = {}
section = None
for raw in source.read_text(encoding='utf-8-sig').splitlines():
    line = raw.split(';', 1)[0].strip()
    if line.startswith('['):
        section = line.strip('[]').lower()
        sections[section] = {}
    elif section and '=' in line:
        key, value = line.split('=', 1)
        try:
            sections[section][key.strip().lower()] = float(value.strip())
        except ValueError:
            pass
camera = {'startx': 0, 'starty': 0, 'startzoom': 1, 'zoomin': 1, 'zoomout': 1, 'tension': 50, 'verticalfollow': .2, 'floortension': 0}
camera.update(sections['camera'])
Path('work/stage_camera.json').write_text(json.dumps({'camera': camera, 'player': sections['playerinfo'], 'bound': sections['bound']}))
durations = {}
for directory in ['battle-sounds', 'round-sounds']:
    for file in Path('work', directory).glob('*.wav'):
        with wave.open(str(file)) as sound:
            durations[f'{directory}/{file.name}'] = math.ceil(sound.getnframes() / sound.getframerate() * 60)
Path('work/round_audio.json').write_text(json.dumps(durations))
