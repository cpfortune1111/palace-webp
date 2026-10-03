import io
import json
import re
import struct
from pathlib import Path
from PIL import Image


def export():
    destination = Path('work/logo-webp')
    destination.mkdir(parents=True, exist_ok=True)
    image = Image.open(r'E:\3D 2022\LOGO\Letter_79.png').convert('RGBA')
    alpha = image.getchannel('A')
    occupied = [alpha.crop((column, 0, column + 1, image.height)).getbbox() is not None for column in range(image.width)]
    ranges = []
    start = None
    for column, visible in enumerate(occupied + [False]):
        if visible and start is None:
            start = column
        if not visible and start is not None:
            ranges.append((start, column))
            start = None
    assert len(ranges) == 10
    letters = []
    widths = []
    for index, (left, right) in enumerate(ranges):
        bounds = alpha.crop((left, 0, right, image.height)).getbbox()
        top, bottom = bounds[1], bounds[3]
        cropped = image.crop((left, top, right, bottom))
        filename = f'letter-{index}.webp'
        cropped.save(destination / filename, lossless=True, exact=True)
        letters.append(dict(file='logo-webp/' + filename, width=right-left, height=bottom-top, top=top))
        widths.append(right-left)
    scale = 0.6
    gap = 0
    total = sum(widths) * scale + gap * 9
    cursor = (1280-total)/2
    for entry in letters:
        entry.update(x=cursor, y=360+(entry['top']-520)*scale, scale=scale)
        cursor += entry['width']*scale + gap
    source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\data')
    definition = (source / 'Logo.def').read_text(encoding='utf-8-sig')
    duration = int(re.search(r'end.time\s*=\s*(\d+)', definition).group(1))
    sff = (source / 'Logo.sff').read_bytes()
    offset, count, _, _, ldata, _, tdata = struct.unpack_from('<7I', sff, 36)
    petals = []
    for index in range(count):
        group, item, width, height, axis_x, axis_y, _, fmt, _, data_offset, size, _, flags = struct.unpack_from('<HHHHhhHBBIIHH', sff, offset+index*28)
        if group != 10:
            continue
        assert fmt == 12 and size > 0
        absolute = (tdata if flags & 1 else ldata) + data_offset
        frame = Image.open(io.BytesIO(sff[absolute+4:absolute+size])).convert('RGBA')
        bounds = frame.getchannel('A').getbbox()
        filename = f'petals-{item}.webp'
        frame.crop(bounds).save(destination / filename, lossless=True, exact=True)
        petals.append(dict(item=item, file='logo-webp/'+filename, x=640-axis_x+bounds[0], y=-axis_y+bounds[1]))
    frames = []
    action = definition.split('[Begin Action 10]')[1]
    tick = 0
    for line in action.splitlines():
        if re.match(r'^-?\d+\s*,', line.strip()):
            group, item, _, _, time = map(int, line.split(',')[:5])
            if time < 0:
                break
            if group == 10:
                frames.append(dict(start=tick, end=tick+time, item=item))
            tick += time
    data = dict(duration=duration, letterStart=180, letterStagger=11, letterDuration=27, letters=letters, petals=petals, petalFrames=frames)
    Path('work/logo-intro.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
    print('Letters:', len(letters), 'petals:', len(petals), 'duration:', duration, 'bytes:', sum(file.stat().st_size for file in destination.glob('*.webp')))


if __name__ == '__main__':
    export()
