"""Probe pinned native AIR frame metadata and scan private original character files.

This tests source components/metadata loss, not a Web AIR parser or renderer.
Original AIR text and full raw native output stay private.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import struct
import subprocess

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--receipt', type=Path, required=True)
cli.add_argument('--output', type=Path, required=True)
cli.add_argument('--character-air', type=Path, action='append', default=[])
args = cli.parse_args()
receipt = json.loads(args.receipt.read_text(encoding='utf-8'))
assert receipt['commit'] == 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
assert receipt['compiler'].startswith('go version go1.27.3 ')
assert hashlib.sha256(Path(receipt['executable']).read_bytes()).hexdigest() == receipt['executableSha256']
bits = lambda value: struct.unpack('<I', struct.pack('<f', value))[0]
signed = lambda value: (value + 2**31) % 2**32 - 2**31
requests, expectations = [], []
for flip in ('', 'H', 'V', 'HV', 'HH', 'VV', 'hHvV'):
    for scale in (('', '', ''), ('0', '-2', '90'), ('1.25', '.5', '-45')):
        line = '1,2,3,-4,5,' + flip + ',,' + ','.join(scale)
        values = [signed(3 * (-1)**len(re.findall('h', flip, re.I))), signed(-4 * (-1)**len(re.findall('v', flip, re.I)))]
        integers = [1, 2, *values, 5, -1 if 'h' in flip.lower() else 1, -1 if 'v' in flip.lower() else 1]
        requests.append({'Kind': 'frame', 'Line': line})
        expectations.append({'integers': integers, 'floats': [bits(float(value) if value else fallback) for value, fallback in zip(scale, (1, 1, 0))]})
for line in ('', 'LoopStart', '+1,0,0,0,1', ' 1,0,0,0,1'):
    requests.append({'Kind': 'frame', 'Line': line});expectations.append({'present': False})
requests.append({'Kind': 'frame', 'Line': '1,0,0,0'});expectations.append({'error': True, 'present': False})
for column in (7, 8, 9):
    fields = ['1', '2', '3', '4', '5', '', '', '', '', '']
    fields[column] = 'invalid'
    requests.append({'Kind': 'frame', 'Line': ','.join(fields)});expectations.append({'error': True, 'present': True})
fixture_count = len(requests)
characters = []
for path in args.character_air:
    data = path.read_bytes()
    rows = []
    stats = {'frames': 0, 'scaleOrAngleFields': 0, 'nonDefaultScaleOrAngle': 0, 'interpolationDirectives': 0, 'longFrameRows': 0}
    for number, raw in enumerate(data.decode('utf-8-sig').splitlines(), 1):
        line = raw.split(';', 1)[0].strip()
        if re.match(r'^interpolate\b', line, re.I):stats['interpolationDirectives'] += 1
        if not re.match(r'^-?\d+\s*,', line):continue
        fields = [field.strip() for field in line.split(',', 9)]
        assert len(fields) >= 5, (path.stem, number, 'missing required fields')
        first = [signed(int(field)) for field in fields[:5]]
        flip = fields[5] if len(fields) > 5 else ''
        assert not re.sub('[hv]', '', flip, flags=re.I), (path.stem, number, 'invalid source flip')
        first[2] = signed(first[2] * (-1)**len(re.findall('h', flip, re.I)))
        first[3] = signed(first[3] * (-1)**len(re.findall('v', flip, re.I)))
        floats = [float(fields[index]) if len(fields) > index and fields[index] else fallback for index, fallback in ((7, 1), (8, 1), (9, 0))]
        if len(fields) > 7:stats['scaleOrAngleFields'] += 1
        if floats != [1, 1, 0]:stats['nonDefaultScaleOrAngle'] += 1
        if len(line.split(',')) > 10:stats['longFrameRows'] += 1
        requests.append({'Kind': 'frame', 'Line': line})
        expectations.append({'integers': first + [-1 if 'h' in flip.lower() else 1, -1 if 'v' in flip.lower() else 1], 'floats': list(map(bits, floats)), 'source': [path.stem, number]})
        rows.append(number);stats['frames'] += 1
    characters.append({'name': path.stem, 'sourceSha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data), **stats})
completed = subprocess.run([receipt['executable']], input=json.dumps(requests), capture_output=True, text=True, timeout=60, check=True)
results = json.loads(completed.stdout)
assert len(results) == len(expectations)
for index, (actual, expected) in enumerate(zip(results, expectations)):
    label = expected.get('source', index)
    assert not actual['Panic'], (label, actual['Panic'])
    assert bool(actual['Error']) == expected.get('error', False), (label, actual['Error'])
    assert actual['Present'] == expected.get('present', True), label
    if 'integers' in expected:
        assert actual['FrameIntegers'] == expected['integers'], (label, actual['FrameIntegers'], expected['integers'])
        assert actual['FrameFloatBits'] == expected['floats'], (label, 'float32 metadata')
report = {'commit': receipt['commit'], 'compiler': receipt['compiler'], 'oracleExecutableSha256': receipt['executableSha256'],
          'syntheticFrames': fixture_count, 'originalFrames': sum(row['frames'] for row in characters), 'characters': characters,
          'matched': True, 'scope': 'Compiled native ReadAnimFrame versus independent metadata fixtures and private original AIR frame fields. Not Web scale/angle/interpolation execution, generic AIR file parsing or renderer certification.', 'goalComplete': False}
args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print('PASS ' + str(fixture_count) + ' synthetic and ' + str(report['originalFrames']) + ' original AIR frame metadata probes across ' + str(len(characters)) + ' files')
