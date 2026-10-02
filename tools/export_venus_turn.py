import argparse
import hashlib
import io
import json
import re
import struct
from pathlib import Path
from PIL import Image, ImageChops


def export(source_dir, output_dir, action_ids=('5', '6'), prefix='venus_turn', source_prefix='venus'):
    source_dir, output_dir = Path(source_dir), Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    sff = (source_dir / (source_prefix + '.sff')).read_bytes()
    air = (source_dir / (source_prefix + '.air')).read_bytes()
    assert sff[:12] == b'ElecbyteSpr\x00' and sff[15] == 2
    sprite_offset, count, palette_offset, palette_count, ldata, _, tdata = struct.unpack_from('<7I', sff, 36)
    headers = [struct.unpack_from('<HHHHhhHBBIIHH', sff, sprite_offset + index * 28) for index in range(count)]
    sprite_index = {(header[0], header[1]): index for index, header in enumerate(headers)}

    def palette(index):
        _, _, colors, link, offset, size = struct.unpack_from('<HHHHII', sff, palette_offset + index * 16)
        if size == 0:
            assert link < index
            return palette(link)
        values = [tuple(sff[ldata + offset + color * 4:ldata + offset + color * 4 + 4]) for color in range(colors)]
        if sff[13] == 0:
            values = [(*value[:3], 0 if color == 0 else 255) for color, value in enumerate(values)]
        return values

    def decode(index):
        group, item, width, height, axis_x, axis_y, link, fmt, depth, offset, size, pal, flags = headers[index]
        if size == 0:
            assert link < index
            image, _, _ = decode(link)
            return image, axis_x, axis_y
        absolute = (tdata if flags & 1 else ldata) + offset
        assert fmt in (10, 11, 12), f'Unsupported SFF format {fmt} for {group},{item}'
        png = Image.open(io.BytesIO(sff[absolute + 4:absolute + size]))
        assert png.size == (width, height)
        if fmt == 10:
            assert png.mode == 'P'
            values = palette(pal)
            image = Image.new('RGBA', png.size)
            image.putdata([values[color] for color in png.tobytes()])
        else:
            image = png.convert('RGBA')
        return image, axis_x, axis_y

    actions = {}
    loop_starts = {}
    action = None
    for raw in air.decode('utf-8-sig', errors='replace').splitlines():
        line = raw.split(';', 1)[0].strip()
        begin = re.match(r'\[Begin Action (\d+)\]', line, re.I)
        if begin:
            action = begin[1] if begin[1] in action_ids else None
            if action:
                actions[action] = []
        elif action and line.lower() == 'loopstart':
            loop_starts[action] = len(actions[action])
        elif action and re.match(r'^-?\d+\s*,', line):
            fields = [part.strip() for part in line.split(',')]
            group, item, ox, oy, time = map(int, fields[:5])
            actions[action].append(dict(group=group, item=item, ox=ox, oy=oy, time=time, flip=fields[5] if len(fields)>5 else '', blend=fields[6] if len(fields)>6 else ''))
    assert set(actions) == set(action_ids)
    atlas = Image.new('RGBA', (1024, 1024) if action_ids == ('5', '6') else (2048, 4096))
    sprites = {}
    cursor_x, cursor_y, row_height = 2, 2, 0
    for frames in actions.values():
        for frame in frames:
            if frame['group'] == -1 or frame['item'] == -1 or (frame['group'], frame['item']) in ((122, 0), (951, 99)):
                frame['empty'] = True
                continue
            key = f"{frame['group']},{frame['item']}"
            if key in sprites:
                continue
            image, axis_x, axis_y = decode(sprite_index[(frame['group'], frame['item'])])
            if cursor_x + image.width + 2 > atlas.width:
                cursor_x, cursor_y, row_height = 2, cursor_y + row_height + 4, 0
            if cursor_y + image.height + 2 > atlas.height:
                expanded = Image.new('RGBA', (atlas.width, max(atlas.height * 2, cursor_y + image.height + 2)))
                expanded.paste(atlas, (0, 0))
                atlas = expanded
            atlas.paste(image, (cursor_x, cursor_y))
            sprites[key] = dict(x=cursor_x, y=cursor_y, w=image.width, h=image.height, axisX=axis_x, axisY=axis_y)
            cursor_x += image.width + 4
            row_height = max(row_height, image.height)
    atlas = atlas.crop((0, 0, atlas.width, cursor_y + row_height + 2))
    atlas.save(output_dir / (prefix + '_atlas.png'))
    data = dict(sprites=sprites, actions=actions, loopStarts=loop_starts, source=dict(sffSHA256=hashlib.sha256(sff).hexdigest(), airSHA256=hashlib.sha256(air).hexdigest()))
    (output_dir / (prefix + '.json')).write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('Exported AIR:', {action: [frame['time'] for frame in frames] for action, frames in actions.items()})
    previous = output_dir / 'venus_runtime_atlas.png'
    runtime = output_dir / 'venus_runtime.json'
    if source_prefix == 'venus' and previous.exists() and runtime.exists():
        packed = Image.open(previous).convert('RGBA')
        metadata = json.loads(runtime.read_text(encoding='utf-8'))
        for key in ('20,4', '20,3'):
            entry = metadata['sprites'][key]
            cropped = packed.crop((entry['x'], entry['y'], entry['x']+entry['w'], entry['y']+entry['h']))
            original, _, _ = decode(sprite_index[tuple(map(int, key.split(',')))])
            print('Source comparison', key, ImageChops.difference(cropped, original).getbbox())
            cropped.save(output_dir / ('sprite-'+key.replace(',', '-')+'.png'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source_dir')
    parser.add_argument('output_dir')
    parser.add_argument('--actions', default='5,6')
    parser.add_argument('--prefix', default='venus_turn')
    parser.add_argument('--source-prefix', default='venus')
    arguments = parser.parse_args()
    export(arguments.source_dir, arguments.output_dir, tuple(arguments.actions.split(',')), arguments.prefix, arguments.source_prefix)
