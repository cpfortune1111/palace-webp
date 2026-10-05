import gzip
import hashlib
import json
import struct
from io import BytesIO
from pathlib import Path
from PIL import Image

source = Path('E:/3D 2022/Select/Select v1.glb')
destination = Path(__file__).resolve().parents[1] / 'Stage/Select'
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
(destination / 'Select.glb.gz').write_bytes(compressed)
settings = {'fov': 30, 'localcoord': [1280, 720], 'cameraPosition': [0, 1.55, 8], 'target': 'Sphere.004', 'animations': len(document.get('animations', [])), 'sourceSHA256': hashlib.sha256(original).hexdigest(), 'sourceBytes': len(original), 'downloadBytes': len(compressed), 'textureFormat': 'webp', 'textureMaxSize': 2048}
(destination / 'select-stage.json').write_text(json.dumps(settings, separators=(',', ':')), encoding='utf-8')
print(json.dumps(settings))
