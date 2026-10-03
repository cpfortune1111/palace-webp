import io
import json
import re
import struct
from pathlib import Path
from PIL import Image


source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace')
definition = (source / 'data/system.def').read_text(encoding='utf-8-sig')
settings = {}
section = ''
for raw in definition.splitlines():
    line = raw.split(';', 1)[0].strip()
    if line.startswith('['):
        section = line.split(']')[0][1:]
    elif section == 'Select Info' and '=' in line:
        key, value = line.split('=', 1)
        settings[key.strip()] = value.strip()
system = json.loads(Path('work/Data/System/system_webp.json').read_text())
keys = ['2000,0', '2001,0', '2002,0', '2002,1', '2003,0', '2003,1', '2003,2', '2100,29', '2200,0']
background = [dict(key=key, **system['sprites'][key]) for key in keys]
destination = Path('work/Data/Select')
destination.mkdir(parents=True, exist_ok=True)
portraits = []
sff = (source / 'chars/SailorVenus/venus.sff').read_bytes()
offset, count, _, _, ldata, _, tdata = struct.unpack_from('<7I', sff, 36)
for index in range(count):
    group, item, width, height, axis_x, axis_y, _, fmt, _, data_offset, size, _, flags = struct.unpack_from('<HHHHhhHBBIIHH', sff, offset+index*28)
    if (group, item) != (9000, 1):
        continue
    assert fmt == 12
    absolute = (tdata if flags & 1 else ldata) + data_offset
    image = Image.open(io.BytesIO(sff[absolute+4:absolute+size])).convert('RGBA')
    image.save(destination / 'venus-portrait.webp', lossless=True)
    portraits.append(dict(id='SailorVenus', name='Sailor Venus', file='Data/Select/venus-portrait.webp', axisX=axis_x, axisY=axis_y, width=width, height=height))
select = (source / 'data/select.def').read_text(encoding='utf-8-sig')
cells = []
for raw in select.split('[Characters]')[1].split('[ExtraStages]')[0].splitlines():
    line = raw.split(';', 1)[0].strip()
    if not line:
        continue
    identifier = line.split(',')[0].strip()
    cells.append(dict(id=identifier, available=identifier == 'SailorVenus'))
data = dict(settings=settings, background=background, portraits=portraits, cells=cells, stages=[dict(id='training', name='Training', available=True), dict(id='moon', name='Moon Palace', available=False), dict(id='mercury', name='Mercury', available=False), dict(id='mars', name='Mars', available=False), dict(id='pluto', name='Pluto', available=False), dict(id='swatheshia', name='Swatheshia', available=False)], source='data/system.def + system.sff + select.def')
(destination / 'select-screen.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
print('Static selection:', len(cells), 'cells;', len(portraits), 'playable character;', len(background), 'layers')
