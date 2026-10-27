import gzip
import hashlib
import json
import struct
from io import BytesIO
from pathlib import Path
from PIL import Image

source = Path('F:/Ikemen_GO-dev-windows/Moon Palace/stages/StageMoon.glb')
destination = Path(__file__).resolve().parents[1] / 'Stage/Millennium'
destination.mkdir(parents=True, exist_ok=True)
original = source.read_bytes()
length = struct.unpack_from('<I', original, 12)[0]
document = json.loads(original[20:20+length])
binary = original[28+length:]
image_views = {entry['bufferView']: entry for entry in document.get('images', [])}
rebuilt = bytearray()
for index, view in enumerate(document['bufferViews']):
    start = view.get('byteOffset', 0)
    data = binary[start:start+view['byteLength']]
    if index in image_views:
        image = Image.open(BytesIO(data)).convert('RGBA')
        image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
        encoded = BytesIO()
        image.save(encoded, format='WEBP', quality=90, method=4)
        data = encoded.getvalue()
        image_views[index]['mimeType'] = 'image/webp'
    rebuilt.extend(bytes((-len(rebuilt)) % 4))
    view['byteOffset'] = len(rebuilt)
    view['byteLength'] = len(data)
    rebuilt.extend(data)
rebuilt.extend(bytes((-len(rebuilt)) % 4))
for texture in document.get('textures', []):
    if 'source' in texture:
        texture.setdefault('extensions', {})['EXT_texture_webp'] = {'source': texture.pop('source')}
for field in ['extensionsUsed', 'extensionsRequired']:
    document.setdefault(field, []).append('EXT_texture_webp')
document['buffers'][0]['byteLength'] = len(rebuilt)
encoded = json.dumps(document, separators=(',', ':')).encode()
encoded += b' ' * ((-len(encoded)) % 4)
glb = struct.pack('<III', 0x46546C67, 2, 28+len(encoded)+len(rebuilt))
glb += struct.pack('<II', len(encoded), 0x4E4F534A)+encoded
glb += struct.pack('<II', len(rebuilt), 0x004E4942)+rebuilt
compressed = gzip.compress(glb, compresslevel=9, mtime=0)
(destination / 'StageMoon.glb.gz').write_bytes(compressed)

import re
sections = {}
section = None
for raw in source.with_suffix('.def').read_text(encoding='utf-8-sig').splitlines():
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
(destination / 'stage-camera.json').write_text(json.dumps({'camera': camera, 'player': sections['playerinfo'], 'bound': sections['bound']}), encoding='utf-8')
print(len(compressed))

