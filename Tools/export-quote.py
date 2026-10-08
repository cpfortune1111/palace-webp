import json
import math
import re
import shutil
import wave
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path('E:/3D 2022/Quote/Venus')
target = root / 'Char/Venus/Quote'
target.mkdir(parents=True, exist_ok=True)
actions = {}
current = None
tick = 0
for line in (source / 'venus.txt').read_text(encoding='utf-8-sig').splitlines():
    line = line.strip()
    heading = re.match(r'^(9\d{3})\s+\w', line)
    frame = re.match(r'^(\d+),(\d+),\s*0,0,\s*(-?\d+)', line)
    if heading:
        current = actions.setdefault(heading[1], dict(frames=[], cues=[], loop=None))
        tick = 0
    elif line.lower() == 'loopstart':
        current['loop'] = tick
    elif line.startswith('PLAYSND '):
        name = line[8:]
        with wave.open(str(source / name)) as sound:
            duration = math.ceil(sound.getnframes() / sound.getframerate() * 60)
        shutil.copyfile(source / name, target / name)
        current['cues'].append(dict(tick=tick, duration=duration, file='Char/Venus/Quote/' + name))
    elif frame:
        group, item, duration = map(int, frame.groups())
        current['frames'].append(dict(sprite=f'{group}{item:02}', ticks=duration))
        tick += max(0, duration)
frames = {}
for group in ['9000', '9010', '9020', '9030']:
    paths = sorted((source / '1x').glob(group + '*.webp'))
    images = [Image.open(path).convert('RGBA') for path in paths]
    bounds = [image.getchannel('A').getbbox() for image in images]
    union = (min(bound[0] for bound in bounds), min(bound[1] for bound in bounds), max(bound[2] for bound in bounds), max(bound[3] for bound in bounds))
    size = (round((union[2]-union[0])*720/(union[3]-union[1])), 720)
    for path, image in zip(paths, images):
        image.crop(union).resize(size, Image.Resampling.LANCZOS).save(target / path.name, quality=92, method=6)
        frames[path.stem] = dict(file='Char/Venus/Quote/' + path.name, width=size[0], height=size[1])
(root / 'Data/Quote').mkdir(parents=True, exist_ok=True)
(root / 'Data/Quote/venus.json').write_text(json.dumps(dict(character='SailorVenus', actions=actions, frames=frames), indent=2), encoding='utf-8')
report = root / 'Data/ReportCard'
report.mkdir(parents=True, exist_ok=True)
for name in ['RC BG.webp', 'RCard Title.webp', 'RCard Continue.webp']:
    shutil.copyfile(Path('E:/3D 2022/ReportCard/WEB') / name, report / name)
print('Exported', len(frames), 'frames;', len(actions), 'animations; report artwork copied')

