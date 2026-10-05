import json
import math
import wave
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
target = root / 'Char/Venus/VS'
target.mkdir(parents=True, exist_ok=True)
image = Image.open('E:/3D 2022/VS/Venus Pose 7 001.png').convert('RGBA')
bounds = image.getchannel('A').getbbox()
image = image.crop(bounds)
image = image.resize((round(image.width * 720 / image.height), 720), Image.Resampling.LANCZOS)
image.save(target / 'declaration-0.webp', lossless=True, exact=True)
frames = json.loads((root / 'Char/Venus/venus_round.json').read_text())['actions']['191']
cues = []
for element, item in [(9, 0), (29, 1)]:
    filename = f'Char/Venus/Sound/190-{item}.wav'
    with wave.open(str(root / filename)) as sound:
        duration = math.ceil(sound.getnframes() / sound.getframerate() * 60)
    cues.append(dict(tick=sum(frame['time'] for frame in frames[:element - 1]), duration=duration, file=filename))
data = dict(characters={'SailorVenus': dict(variants=[dict(id='venus-0', image='Char/Venus/VS/declaration-0.webp', cues=cues)])})
def result_variant(group, item, tick, identifier):
    filename = f'Char/Venus/Sound/{group}-{item}.wav'
    with wave.open(str(root / filename)) as sound:
        duration = math.ceil(sound.getnframes() / sound.getframerate() * 60)
    return dict(id=identifier, image='Char/Venus/VS/declaration-0.webp', cues=[dict(tick=tick, duration=duration, file=filename)])
win_frames = json.loads((root / 'Char/Venus/venus_round.json').read_text())['actions']['181']
data['characters']['SailorVenus']['winVariants'] = [result_variant(180, 0, 0, 'venus-win-0'), result_variant(180, 1, sum(frame['time'] for frame in win_frames[:5]), 'venus-win-1')]
data['characters']['SailorVenus']['loseVariants'] = [result_variant(170, 0, 0, 'venus-lose-0')]
(root / 'Data/VS').mkdir(exist_ok=True)
(root / 'Data/VS/declarations.json').write_text(json.dumps(data, indent=2))
print(data)

