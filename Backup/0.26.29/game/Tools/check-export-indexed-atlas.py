import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from export_indexed_atlas import export_indexed_atlas
from importlib.util import module_from_spec, spec_from_file_location

spec = spec_from_file_location('indexed_fixture', Path(__file__).with_name('check-sff-indexed-palette.py'))
fixture_module = module_from_spec(spec)
spec.loader.exec_module(fixture_module)


class IndexedAtlasTests(unittest.TestCase):
    def test_exact_plane_palette_aliases_and_crop(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = fixture_module.fixture()
            (root / 'source.sff').write_bytes(source)
            Image.new('RGB', (2, 1), (10, 20, 30)).save(root / 'base.webp', lossless=True)
            layout = {'source': {'sffSHA256': hashlib.sha256(source).hexdigest()},
                      'atlasFiles': ['base.webp'], 'sprites': {'0,0': {
                          'x': 0, 'y': 0, 'w': 1, 'h': 1, 'axisX': 2, 'axisY': 4, 'page': 0}}}
            (root / 'layout.json').write_text(json.dumps(layout), encoding='utf-8')
            result = export_indexed_atlas(root / 'source.sff', root / 'layout.json', root / 'output')
            with Image.open(root / 'output/indices-0.webp') as image:
                self.assertEqual(image.convert('L').tobytes(), bytes([1, 0]))
            self.assertEqual(result['sprites']['0,0']['paletteIndex'], 1)
            self.assertEqual(result['sprites']['0,0']['indexSHA256'], hashlib.sha256(bytes([1])).hexdigest())
            self.assertEqual(result['sprites']['0,0']['rgbaSHA256'], hashlib.sha256(bytes([10, 20, 30, 255])).hexdigest())
            self.assertEqual(len(result['palettes']), 2)
            self.assertEqual(len(result['colorTables']), 1)
            self.assertEqual(result['palettes'][1]['number'], 2)
            full = export_indexed_atlas(root / 'source.sff', root / 'layout.json', root / 'full', uncropped=True)
            self.assertTrue(full['uncropped'])
            sprite = full['sprites']['0,0']
            self.assertEqual((sprite['w'], sprite['h'], sprite['axisX'], sprite['axisY']), (2, 1, 3, 4))
            self.assertEqual((sprite['cropX'], sprite['cropY']), (0, 0))
            with Image.open(root / 'full/indices-0.webp') as image:
                self.assertEqual(image.convert('L').tobytes(), bytes([0, 1]))
            self.assertEqual(sprite['indexSHA256'], hashlib.sha256(bytes([0, 1])).hexdigest())
            layout['source']['sffSHA256'] = '0' * 64
            (root / 'layout.json').write_text(json.dumps(layout), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'hash mismatch'):
                export_indexed_atlas(root / 'source.sff', root / 'layout.json', root / 'invalid')
            self.assertFalse((root / 'invalid').exists())


if __name__ == '__main__':
    unittest.main()
