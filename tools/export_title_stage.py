import gzip
import hashlib
import json
import struct
from io import BytesIO
from pathlib import Path

from PIL import Image

source = Path('F:/Ikemen_GO-dev-windows/Moon Palace/stages/Title.glb')
output = Path('work')
original = source.read_bytes()
definition = source.with_suffix('.def').read_text(encoding='utf-8-sig')
sections = {}
section = ''
for line in definition.splitlines():
    line = line.split(';', 1)[0].strip()
    if line.startswith('[') and line.endswith(']'):
        section = line[1:-1].lower()
        sections.setdefault(section, {})
    elif '=' in line:
        key, value = line.split('=', 1)
        sections[section][key.strip().lower()] = value.strip()
def numbers(section, key):
    return [float(value.strip()) for value in sections[section][key].split(',')]
json_length = struct.unpack_from('<I', original, 12)[0]
document = json.loads(original[20:20 + json_length])
binary = original[28 + json_length:]
image_views = {image['bufferView']: image for image in document['images']}
rebuilt = bytearray()
for index, view in enumerate(document['bufferViews']):
    start = view.get('byteOffset', 0)
    data = binary[start:start + view['byteLength']]
    if index in image_views:
        image = Image.open(BytesIO(data)).convert('RGBA')
        image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
        encoded = BytesIO()
        image.save(encoded, format='WEBP', quality=90, method=6)
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
for field in ('extensionsUsed', 'extensionsRequired'):
    extensions = document.setdefault(field, [])
    if 'EXT_texture_webp' not in extensions:
        extensions.append('EXT_texture_webp')
document['buffers'][0]['byteLength'] = len(rebuilt)
encoded_json = json.dumps(document, separators=(',', ':')).encode()
encoded_json += b' ' * ((-len(encoded_json)) % 4)
glb = struct.pack('<III', 0x46546C67, 2, 28 + len(encoded_json) + len(rebuilt))
glb += struct.pack('<II', len(encoded_json), 0x4E4F534A) + encoded_json
glb += struct.pack('<II', len(rebuilt), 0x004E4942) + rebuilt
compressed = gzip.compress(glb, compresslevel=9, mtime=0)
(output / 'Title.glb.gz').write_bytes(compressed)
settings = {'fov': numbers('camera', 'fov')[0], 'localcoord': numbers('stageinfo', 'localcoord'),
            'offset': numbers('model', 'offset'), 'scale': numbers('model', 'scale'),
            'animations': len(document.get('animations', [])),
            'sourceSHA256': hashlib.sha256(original).hexdigest(),
            'textureMaxSize': 2048, 'textureFormat': 'webp', 'downloadBytes': len(compressed)}
(output / 'title_stage.json').write_text(json.dumps(settings), encoding='utf-8')
print(json.dumps(settings))
