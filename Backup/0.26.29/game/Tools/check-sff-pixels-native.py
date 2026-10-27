"""Compare the existing indexed preprocessing path with extracted native decode functions."""
import argparse
import base64
import hashlib
import io
import json
from pathlib import Path
import random
import struct
import subprocess

from PIL import Image
from sff_indexed_palette import IndexedSff

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--receipt', required=True, type=Path)
cli.add_argument('--output', required=True, type=Path)
cli.add_argument('--character-sff', action='append', default=[], type=Path)
args = cli.parse_args()
receipt = json.loads(args.receipt.read_text(encoding='utf-8'))
assert receipt['commit'] == 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
assert receipt['compiler'].startswith('go version go1.27.3 ')
assert hashlib.sha256(Path(receipt['executable']).read_bytes()).hexdigest() == receipt['executableSha256']


def container(encoding, width, height, payload, flags):
    ldata, tdata = 512, 2048
    offset = 0 if flags else 1024
    absolute = tdata if flags else ldata + offset
    source = bytearray(absolute + len(payload))
    source[:12] = b'ElecbyteSpr\0'
    source[13], source[15] = 1, 2
    struct.pack_into('<7I', source, 36, 128, 1, 156, 1, ldata, 1024 + (0 if flags else len(payload)), tdata)
    struct.pack_into('<HHHHhhHBBIIHH', source, 128, 0, 0, width, height, 3, -4, 0, encoding, 8, offset, len(payload), 0, flags)
    struct.pack_into('<HHHHII', source, 156, 1, 1, 256, 0, 0, 1024)
    source[ldata:ldata + 1024] = bytes([11, 22, 33, 255]) * 256
    source[absolute:absolute + len(payload)] = payload
    return bytes(source)


def rle8(pixels):
    encoded, index = bytearray(), 0
    while index < len(pixels):
        count = 1
        while index + count < len(pixels) and pixels[index + count] == pixels[index] and count < 63:
            count += 1
        if count > 1 or pixels[index] & 0xc0 == 0x40:
            encoded.extend((0x40 | count, pixels[index]))
        else:
            encoded.append(pixels[index])
        index += count
    return bytes(encoded)


def rle5_runs(count, rng):
    encoded, produced = bytearray(), 0
    while produced < count:
        run, color = rng.randint(1, min(256, count - produced)), rng.randrange(256)
        produced += run
        subruns = []
        for unused in range(rng.randrange(5)):
            if produced >= count:
                break
            size = rng.randint(1, min(8, count - produced))
            subruns.append(((size - 1) << 5) | rng.randrange(32))
            produced += size
        encoded.extend((run - 1, len(subruns) | (128 if color else 0)))
        if color:
            encoded.append(color)
        encoded.extend(subruns)
    return bytes(encoded)


def lz5_runs(count, rng):
    encoded, produced, packet = bytearray(), 0, 0
    while produced < count:
        if packet % 8 == 0:
            encoded.append(0)
        run, color = rng.randint(1, min(263, count - produced)), rng.randrange(32)
        if run < 8:
            encoded.append((run << 5) | color)
        else:
            encoded.extend((color, run - 8))
        produced += run
        packet += 1
    return bytes(encoded)


cases = []
def add(encoding, width, height, packet, label):
    payload = packet if encoding == 0 else struct.pack('<I', width * height) + packet
    flags = len(cases) % 2
    value = IndexedSff(container(encoding, width, height, payload, flags)).sprite(0)
    assert (value['axisX'], value['axisY'], value['palette']) == (3, -4, 0)
    cases.append({'encoding': encoding, 'width': width, 'height': height, 'payload': payload,
                  'indices': value['indices'], 'label': label, 'flags': flags})

for color in range(256):
    add(0, 1, 1, bytes([color]), 'raw-byte')
    add(2, 1, 1, bytes([0x41, color]), 'rle8-byte')
    add(3, 1, 1, bytes([0, 0x80, color]), 'rle5-header-byte')
for count in range(1, 64):
    for color in (0, 64, 127, 128, 255):
        add(2, count, 1, bytes([0x40 | count, color]), 'rle8-count')
        add(2, min(count, 5), 1, bytes([0x40 | count, color]), 'rle8-clipped-count')
for run in range(1, 9):
    for color in range(32):
        add(3, run + 1, 1, bytes([0, 1, ((run - 1) << 5) | color]), 'rle5-subpacket')
add(2, 2, 1, bytes([0x40, 5, 1, 2]), 'rle8-zero-run-before-progress')
add(2, 8, 1, bytes([7]), 'rle8-native-eof-cursor')
add(3, 8, 1, bytes([0]), 'rle5-native-eof-cursor')
add(4, 8, 1, bytes([2, 0x61, 4, 0]), 'lz5-short-backreference')
add(4, 11, 1, bytes([2, 0x61, 0, 0, 5]), 'lz5-long-backreference')
recycled = bytearray()
for start in range(0, 32, 8):
    recycled.append(0)
    recycled.extend(0x20 | color for color in range(start, start + 8))
recycled.extend((15, 1, 0, 65, 2, 193, 6, 193))
add(4, 40, 1, bytes(recycled), 'lz5-recycled-distance')
rng = random.Random(2623)
for index in range(160):
    width, height = rng.randint(1, 32), rng.randint(1, 8)
    count = width * height
    pixels = bytes(rng.randrange(256) for unused in range(count))
    add(0, width, height, pixels, 'raw-random')
    add(2, width, height, rle8(pixels), 'rle8-random')
    add(3, width, height, rle5_runs(count, rng), 'rle5-random-packets')
    add(4, width, height, lz5_runs(count, rng), 'lz5-random-runs')
    image = Image.frombytes('P', (width, height), pixels)
    image.putpalette([11, 22, 33] * 256)
    stream = io.BytesIO()
    image.save(stream, format='PNG')
    add(10, width, height, stream.getvalue(), 'png-index-preservation')

requests = [{'Kind': 'sprite', 'Format': case['encoding'], 'Width': case['width'], 'Height': case['height'],
             'Depth': 8, 'Payload': base64.b64encode(case['payload']).decode('ascii')} for case in cases]
completed = subprocess.run([receipt['executable']], input=json.dumps(requests), text=True, capture_output=True, timeout=30, check=True)
native = json.loads(completed.stdout)
assert len(native) == len(cases)
for case, result in zip(cases, native):
    assert not result['Error'] and not result['Panic'], (case['label'], result)
    assert base64.b64decode(result['Pixels'] or '') == case['indices'], (case['encoding'], case['label'])
characters = []
for path in args.character_sff:
    data = path.read_bytes()
    source = IndexedSff(data)
    eligible = []
    first_format = {}
    for index in range(source.sprite_count):
        header = struct.unpack('<HHHHhhHBBIIHH', source.block(source.sprite_offset + index * 28, 28))
        if header[8] == 8 and header[10] > 0 and header[7] in (0, 2, 3, 4, 10) and 0 < header[2] * header[3] <= 1048576:
            eligible.append(index)
            first_format.setdefault(header[7], index)
    assert eligible, ('No eligible physical indexed fixtures', path.name)
    selected = sorted(set(first_format.values()) | {eligible[round(n * (len(eligible) - 1) / 15)] for n in range(16)})
    request = [{'Kind': 'container', 'FilePath': str(path.resolve()), 'Indices': selected}]
    run = subprocess.run([receipt['executable']], input=json.dumps(request), text=True, capture_output=True, timeout=60, check=True)
    result = json.loads(run.stdout)[0]
    assert not result['Error'] and not result['Panic'], (path.name, result['Error'], result['Panic'])
    digest = hashlib.sha256(data).hexdigest()
    assert result['FileSha256'] == digest
    assert len(result['Frames']) == len(selected)
    for index, frame in zip(selected, result['Frames']):
        expected = source.sprite(index)
        assert frame['Index'] == index
        assert (frame['Group'], frame['Number'], frame['Offset'], frame['Palette']) == (expected['group'], expected['number'], [expected['axisX'], expected['axisY']], expected['palette']), (path.name, index, 'header')
        assert base64.b64decode(frame['Pixels'] or '') == expected['indices'], (path.name, index, 'pixels')
    characters.append({'name': path.stem, 'sourceSha256': digest, 'spriteCount': source.sprite_count,
                       'eligiblePhysicalIndexedSprites': len(eligible), 'sampledIndices': selected, 'matched': True})
report = {'commit': receipt['commit'], 'compiler': receipt['compiler'], 'oracleExecutableSha256': receipt['executableSha256'],
          'cases': len(cases), 'encodingCounts': {str(key): sum(case['encoding'] == key for case in cases) for key in (0, 2, 3, 4, 10)},
          'matched': True, 'characters': characters, 'scope': 'Indexed preprocessing/container dispatch versus native decoded-byte capture; synthetic fixtures and optional sampled original physical sprites. Not browser SFF loading, palette/GPU rendering, linked sprites or corrupt-input conformance.',
          'knownDifference': 'A malformed terminal RLE8 zero-run that would stall native execution is explicitly rejected by the preprocessing helper; no native-hang equivalence claimed.',
          'goalComplete': False}
args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print('PASS ' + str(len(cases)) + ' indexed SFF raw/RLE8/RLE5/LZ5/PNG preprocessing cases match extracted compiled native pixel output')
print('PASS ' + str(sum(len(item['sampledIndices']) for item in characters)) + ' sampled physical sprites across ' + str(len(characters)) + ' character SFF sources')
