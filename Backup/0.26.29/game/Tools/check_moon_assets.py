import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'Char' / 'Moon'
data = json.loads((root / 'Battle' / 'moon_full.json').read_text(encoding='utf-8'))
disabled = {195, 612, 614, 830, 3199}
assert set(data['disabledActions']) == disabled
assert not disabled.intersection(map(int, data['actions']))
dimensions = []
for filename in data['atlasFiles']:
    with Image.open(root / 'Battle' / filename) as image:
        assert image.format == 'WEBP'
        dimensions.append(image.size)
for key, sprite in data['sprites'].items():
    width, height = dimensions[sprite['page']]
    assert 0 <= sprite['x'] <= width - sprite['w'], key
    assert 0 <= sprite['y'] <= height - sprite['h'], key
for frames in data['actions'].values():
    for frame in frames:
        assert frame.get('empty') or f"{frame['group']},{frame['item']}" in data['sprites']
sounds = json.loads((root / 'Sound' / 'sounds.json').read_text(encoding='utf-8'))
assert len(sounds) == 87
for sound in sounds.values():
    assert (root / 'Sound' / sound['file']).stat().st_size > 0
    assert sound['ticks'] >= 0
print(json.dumps({'actions': len(data['actions']), 'atlasPages': len(dimensions),
                  'sprites': len(data['sprites']), 'sounds': len(sounds),
                  'decodedAtlasBytes': sum(width * height * 4 for width, height in dimensions)}))
