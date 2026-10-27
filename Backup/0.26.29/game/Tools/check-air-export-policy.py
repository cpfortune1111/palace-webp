"""Prevent silent AIR transform/interpolation loss in both existing exporters."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import unittest
from export_venus_turn import air_frame_for_export
from Legacy.export_venus_turn import air_frame_for_export as legacy_frame


class AirExportPolicyTests(unittest.TestCase):
    def test_existing_seven_field_contract(self):
        for parse in (air_frame_for_export, legacy_frame):
            self.assertEqual(parse('1,2,3,-4,5,HV,AS128D64'), {'group': 1, 'item': 2, 'ox': 3, 'oy': -4, 'time': 5, 'flip': 'HV', 'blend': 'AS128D64'})

    def test_omitted_or_identity_transforms(self):
        for parse in (air_frame_for_export, legacy_frame):
            expected = parse('1,2,0,0,1')
            for suffix in (',,,,', ',,,1,1,0', ',,,1,,0'):
                self.assertEqual(parse('1,2,0,0,1' + suffix), expected)

    def test_nonidentity_transforms_and_interpolation_are_explicit(self):
        for parse in (air_frame_for_export, legacy_frame):
            for suffix in (',,,0,1,0', ',,,1,-1,0', ',,,1,1,90'):
                with self.assertRaisesRegex(NotImplementedError, 'not integrated'):
                    parse('1,2,0,0,1' + suffix)
            for line in ('Interpolate Offset', 'interpolate scale', 'Interpolate Angle', 'Interpolate Blend'):
                with self.assertRaisesRegex(NotImplementedError, 'interpolation'):
                    parse(line)

    def test_invalid_component_counts(self):
        for parse in (air_frame_for_export, legacy_frame):
            for line in ('1,2,3,4', '1,2,0,0,1,,,,,,'):
                with self.assertRaises(ValueError):parse(line)


if __name__ == '__main__':
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--character-air', type=Path, action='append', default=[])
    cli.add_argument('--output', type=Path)
    args = cli.parse_args()
    result = unittest.TextTestRunner().run(unittest.defaultTestLoader.loadTestsFromTestCase(AirExportPolicyTests))
    if not result.wasSuccessful():raise SystemExit(1)
    rows = []
    for path in args.character_air:
        data = path.read_bytes();count = 0
        for raw in data.decode('utf-8-sig').splitlines():
            line = raw.split(';', 1)[0].strip()
            if not re.match(r'^-?\d+\s*,|^interpolate\b', line, re.I):continue
            first, second = air_frame_for_export(line), legacy_frame(line)
            fields = [part.strip() for part in line.split(',')]
            old = dict(zip(('group', 'item', 'ox', 'oy', 'time'), map(int, fields[:5])))
            old.update(flip=fields[5] if len(fields) > 5 else '', blend=fields[6] if len(fields) > 6 else '')
            assert first == second == old
            count += 1
        rows.append({'name': path.stem, 'sourceSha256': hashlib.sha256(data).hexdigest(), 'frames': count, 'unchanged': True})
    report = {'unitChecks': result.testsRun, 'characters': rows, 'frames': sum(row['frames'] for row in rows), 'goalComplete': False}
    if args.output:args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print('PASS both exporter policies and ' + str(report['frames']) + ' unchanged original frame records')
