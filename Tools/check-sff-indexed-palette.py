import io
import struct
import unittest

from PIL import Image

from sff_indexed_palette import IndexedSff


def fixture(linked=False):
    image = Image.new('P', (2, 1))
    image.putpalette([10, 20, 30] * 256)
    image.putdata([0, 1])
    encoded = io.BytesIO()
    image.save(encoded, format='PNG')
    payload = struct.pack('<I', 2) + encoded.getvalue()
    header = bytearray(512)
    header[:12] = b'ElecbyteSpr\x00'
    header[13], header[15] = 1, 2
    palette_offset = 184 if linked else 156
    struct.pack_into('<7I', header, 36, 128, 2 if linked else 1, palette_offset, 2, 512, 8 + len(payload), 512)
    struct.pack_into('<HHHHhhHBBIIHH', header, 128, 0, 0, 2, 1, 3, 4, 0, 10, 8, 8, len(payload), 1, 0)
    if linked:
        struct.pack_into('<HHHHhhHBBIIHH', header, 156, 0, 1, 0, 0, 7, 8, 0, 0, 0, 0, 0, 0, 0)
    struct.pack_into('<HHHHII', header, palette_offset, 1, 1, 2, 0, 0, 8)
    struct.pack_into('<HHHHII', header, palette_offset + 16, 1, 2, 2, 0, 0, 0)
    return bytes(header) + bytes([10, 20, 30, 255] * 2) + payload


class IndexedPaletteTests(unittest.TestCase):
    def test_native_direct_alias_chain_and_duplicate_logical_name(self):
        data = bytearray(fixture())
        palette_offset = 156
        struct.pack_into('<I', data, 48, 4)
        struct.pack_into('<HHHHII', data, palette_offset + 32, 1, 3, 2, 1, 0, 0)
        struct.pack_into('<HHHHII', data, palette_offset + 48, 1, 1, 2, 0, 999999, 8)
        source = IndexedSff(bytes(data))
        palettes = [source.palette(index) for index in range(4)]
        self.assertEqual([palette['remapIndex'] for palette in palettes], [0, 0, 1, 0])
        self.assertEqual([palette['resolvedIndex'] for palette in palettes], [0, 0, 0, 0])
        self.assertTrue(all(palette['colors'] == palettes[0]['colors'] for palette in palettes))

    def test_linked_sprite_keeps_own_axes_and_palette_but_shares_indices(self):
        source = IndexedSff(fixture(linked=True))
        base, linked = source.sprite(0), source.sprite(1)
        self.assertEqual((linked['width'], linked['height']), (2, 1))
        self.assertEqual((linked['axisX'], linked['axisY'], linked['palette']), (7, 8, 0))
        self.assertEqual(base['palette'], 1)
        self.assertIs(linked['indices'], base['indices'])

    def test_duplicate_colors_keep_distinct_indices_and_logical_palette(self):
        source = IndexedSff(fixture())
        sprite = source.sprite(0)
        self.assertEqual(sprite['indices'], bytes([0, 1]))
        self.assertEqual((sprite['axisX'], sprite['axisY'], sprite['palette']), (3, 4, 1))
        palette = source.palette(1)
        self.assertEqual((palette['group'], palette['number']), (1, 2))
        self.assertEqual((palette['index'], palette['resolvedIndex']), (1, 0))
        self.assertEqual(palette['colors'], [[10, 20, 30, 255]] * 2)

    def test_legacy_alpha_and_bounds(self):
        data = bytearray(fixture())
        data[13] = 0
        source = IndexedSff(bytes(data))
        self.assertEqual([color[3] for color in source.palette(0)['colors']], [0, 255])
        with self.assertRaises(ValueError):
            source.sprite(1)
        with self.assertRaises(ValueError):
            source.block(len(data), 1)
        with self.assertRaises(ValueError):
            IndexedSff(b'not an sff')


if __name__ == '__main__':
    unittest.main()
