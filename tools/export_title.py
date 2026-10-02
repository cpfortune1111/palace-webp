import json
import shutil
from pathlib import Path
from PIL import Image
from export_venus_turn import export

source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\data')
scratch = Path('work/title-source')
scratch.mkdir(exist_ok=True)
shutil.copyfile(source / 'system.sff', scratch / 'system.sff')
layers = [(10, 0), (20, 0), (21, 0), (25, 0), (30, 0), (1, 0), (0, 0)]
(scratch / 'system.air').write_text('\n'.join(f'[Begin Action {index}]\n{group},{item},0,0,-1' for index, (group, item) in enumerate(layers)), encoding='utf-8')
export(scratch, scratch, tuple(str(index) for index in range(len(layers))), 'title', 'system')
data = json.loads((scratch / 'title.json').read_text())
atlas = Image.open(scratch / 'title_atlas.png')
output = []
for index, (group, item) in enumerate(layers):
    sprite = data['sprites'][f'{group},{item}']
    filename = f'title-layer-{index}.webp'
    atlas.crop((sprite['x'], sprite['y'], sprite['x']+sprite['w'], sprite['y']+sprite['h'])).save(Path('work') / filename, lossless=True)
    output.append({'file': filename, 'axisX': sprite['axisX'], 'axisY': sprite['axisY'], 'sprite': [group, item]})
Path('work/title_layers.json').write_text(json.dumps({'layers': output, 'source': data['source'], 'menu': {'pos': [640, 560], 'spacing': 50}}, separators=(',', ':')))
