import io
import json
import struct
import sys
import tempfile
import unittest
from pathlib import Path
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent / 'Legacy'))
from export_venus_turn import export


class AtlasTests(unittest.TestCase):
    def test_overflow_preserves_partially_filled_row(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            headers = bytearray()
            payload = bytearray()
            sizes = [(1800, 1500), (600, 300), (600, 600)]
            originals = []
            for index, (width, height) in enumerate(sizes):
                original = Image.new('RGBA', (width, height), (index * 60, 20, 80, 255))
                originals.append(original)
                encoded = io.BytesIO()
                original.save(encoded, format='PNG')
                data = struct.pack('<I', width * height * 4) + encoded.getvalue()
                headers.extend(struct.pack('<HHHHhhHBBIIHH', 1, index, width, height,
                                           0, 0, 0, 12, 32, len(payload), len(data), 0, 0))
                payload.extend(data)
            header = bytearray(128)
            header[:12] = b'ElecbyteSpr\x00'
            header[15] = 2
            offset = 128 + len(headers)
            struct.pack_into('<7I', header, 36, 128, 3, offset, 0, offset, len(payload), offset)
            (root / 'test.sff').write_bytes(header + headers + payload)
            (root / 'test.air').write_text('[Begin Action 0]\n1,0,0,0,1\n1,1,0,0,1\n1,2,0,0,1\n')
            export(root, root, ('0',), 'test_full', 'test')
            metadata = json.loads((root / 'test_full.json').read_text())
            for index, original in enumerate(originals):
                sprite = metadata['sprites'][f'1,{index}']
                with Image.open(root / metadata['atlasFiles'][sprite['page']]) as page:
                    assert sprite['y'] + sprite['h'] <= page.height
                    recovered = page.convert('RGBA').crop((sprite['x'], sprite['y'],
                                                          sprite['x'] + sprite['w'], sprite['y'] + sprite['h']))
                    self.assertEqual(recovered.tobytes(), original.tobytes())


if __name__ == '__main__':
    unittest.main()
