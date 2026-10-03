import json
import re
import struct
from pathlib import Path
from PIL import Image
from export_venus_turn import export

source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\data')
scratch = Path('work/fight-hud-source')
payload = (source / 'fight.sff').read_bytes()
offset, count = struct.unpack_from('<2I', payload, 36)
groups = sorted({struct.unpack_from('<H', payload, offset + index * 28)[0] for index in range(count)} & set(range(100, 111)))
(scratch / 'win_icons.sff').write_bytes(payload)
(scratch / 'win_icons.air').write_text('\n'.join(f'[Begin Action {group}]\n{group},0,0,0,-1' for group in groups))
export(scratch, Path('work'), tuple(map(str, groups)), 'win_icons', 'win_icons')
Image.open('work/win_icons_atlas.png').save('work/win_icons_atlas.webp', lossless=True, exact=True)
text = (source / 'fight.def').read_text(encoding='utf-8-sig')
section = text.split('[WinIcon]', 1)[1].split('[Score]', 1)[0]
values = dict(re.findall(r'^([\w.]+)\s*=\s*([^;\r\n]*)', section, re.M))
data = json.loads(Path('work/win_icons.json').read_text())
data['settings'] = {key: [float(value) for value in values[key].split(',')] for key in ['p1.pos', 'p2.pos', 'p1.iconoffset', 'p2.iconoffset']}
data['settings']['useiconupto'] = int(values['useiconupto'])
data['types'] = {key: list(map(int, values['p1.' + key + '.spr'].split(','))) for key in ['n', 's', 'h', 'throw', 'c', 't', 'suicide', 'teammate', 'perfect']}
Path('work/win_icons.json').write_text(json.dumps(data, separators=(',', ':')))
