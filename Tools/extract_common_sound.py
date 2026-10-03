import struct
from pathlib import Path

source = Path('F:/Ikemen_GO-dev-windows/Moon Palace/data/common.snd')
data = source.read_bytes()
count, offset = struct.unpack_from('<2I', data, 16)
for index in range(count):
    next_offset, size, group, number = struct.unpack_from('<4I', data, offset)
    print(group, number, size)
    if (group == 7 and number in (0, 1, 2)) or (group == 20 and number == 0):
        payload = data[offset + 16:offset + 16 + size]
        if payload[:4] != b'RIFF':
            raise ValueError('Expected WAV')
        Path(f'work/battle-sounds/common-{group}-{number}.wav').write_bytes(payload)
    offset = next_offset
