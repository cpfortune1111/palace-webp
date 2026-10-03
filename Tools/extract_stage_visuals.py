import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path
from PIL import Image
from export_venus_turn import export

parser = argparse.ArgumentParser()
parser.add_argument('--stage-source', type=Path, default=Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\stages'))
source = parser.parse_args().stage_source
definition = (source / 'StageTraining.def').read_text(encoding='utf-8-sig')
reflection = re.search(r'\[Reflection\]([^\[]+)', definition, re.I)[1]
intensity = int(re.search(r'^intensity\s*=\s*(\d+)', reflection, re.M | re.I)[1])
scratch = Path('work/stage-visual-source')
scratch.mkdir(parents=True, exist_ok=True)
shutil.copyfile(source / 'StageTraining.sff', scratch / 'StageTraining.sff')
(scratch / 'StageTraining.air').write_text('[Begin Action 1]\n1,0,0,0,-1\n', encoding='utf-8')
export(scratch, scratch, ('1',), 'stage_visual_extract', 'StageTraining')
data = json.loads((scratch / 'stage_visual_extract.json').read_text(encoding='utf-8'))
sprite = data['sprites']['1,0']
atlas = Image.open(scratch / 'stage_visual_extract_atlas.png').convert('RGBA')
image = atlas.crop((sprite['x'], sprite['y'], sprite['x'] + sprite['w'], sprite['y'] + sprite['h']))
left, top = sprite['axisX'] - 640, sprite['axisY']
assert 0 <= left <= image.width - 1280 and 0 <= top <= image.height - 720
visible = image.crop((left, top, left + 1280, top + 720))
visible.save('work/stage_filter.webp', lossless=True, exact=True)
assert Image.open('work/stage_filter.webp').convert('RGBA').tobytes() == visible.tobytes()
config = {'filter': {'file': 'stage_filter.webp', 'width': 1280, 'height': 720,
                     'axisX': 640, 'axisY': 0, 'originalSprite': sprite, 'sourceCrop': [left, top, 1280, 720], 'start': [0, 0], 'delta': [0, 0],
                     'layerno': 1, 'trans': 'none', 'mask': 1, 'sprite': [1, 0]},
          'reflection': {'intensity': intensity, 'xscale': 1, 'yscale': 1},
          'source': {'defSHA256': hashlib.sha256((source / 'StageTraining.def').read_bytes()).hexdigest(),
                     'sffSHA256': hashlib.sha256((source / 'StageTraining.sff').read_bytes()).hexdigest(),
                     'glbSHA256': hashlib.sha256((source / 'StageTraining.glb').read_bytes()).hexdigest()}}
Path('work/stage_visuals.json').write_text(json.dumps(config, indent=2), encoding='utf-8')
print(json.dumps({'sprite': sprite, 'rgbaExtrema': image.getextrema(), 'config': config}))
