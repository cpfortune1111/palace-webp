import importlib.util
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location('compatibility', Path(__file__).with_name('character_compatibility.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class CompatibilityTests(unittest.TestCase):
    def test_native_versions(self):
        read = module.definition_compatibility
        self.assertEqual(read('[Info]\nmugenversion=1.0')['engineVersions']['mugen'], [1, 0])
        self.assertEqual(read('[Info]\nmugenversion=1.1')['engineVersions']['mugen'], [1, 1])
        self.assertEqual(read('[Info]\nmugenversion=2.0')['engineVersions']['mugen'], [0, 5])
        self.assertEqual(read('[Info]\nikemenversion=0.99.1'), {
            'compatibility': 'ikemen', 'engineVersions': {'mugen': [1, 1], 'ikemen': [0, 99, 1]}})
        self.assertEqual(read('[Info]\nikemenversion=0.0.1')['compatibility'], 'mugen')
        self.assertEqual(read('[Info]\nikemenversion=1.invalid.5')['engineVersions']['ikemen'], [1, 0, 0])
        self.assertEqual(read('[Info]\nikemenversion=65536.1')['compatibility'], 'mugen')
        self.assertEqual(read('[Files]\nikemenversion=1.0')['compatibility'], 'mugen')
        self.assertEqual(read('[INFO]\n MUGENVERSION = 1.1 ; note')['engineVersions']['mugen'], [1, 1])


if __name__ == '__main__':
    unittest.main()
