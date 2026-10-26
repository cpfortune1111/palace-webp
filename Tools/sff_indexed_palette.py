import io
import struct

from PIL import Image

from Legacy.export_venus_turn import decode_lz5


def decode_rle8(data, length):
    if not data:
        return bytes(data)
    output = bytearray(length)
    cursor = position = 0
    last = len(data) - 1
    while position < length:
        previous = cursor
        count, value = 1, data[cursor]
        cursor = min(cursor + 1, last)
        if value & 0xc0 == 0x40:
            count = value & 0x3f
            value = data[cursor]
            cursor = min(cursor + 1, last)
        if count == 0 and cursor == previous:
            # Native would loop forever on this malformed final zero-run.
            # Keep this explicit rejection outside compatibility certification.
            raise ValueError('Non-progressing SFF RLE8 packet')
        emitted = min(count, length - position)
        output[position:position + emitted] = bytes([value]) * emitted
        position += emitted
    return bytes(output)


def decode_rle5(data, length):
    if not data:
        return bytes(data)
    output = bytearray(length)
    cursor = position = 0
    last = len(data) - 1
    while position < length:
        run = data[cursor]
        cursor = min(cursor + 1, last)
        remaining = data[cursor] & 0x7f
        color = 0
        if data[cursor] >> 7:
            cursor = min(cursor + 1, last)
            color = data[cursor]
        cursor = min(cursor + 1, last)
        while True:
            if position < length:
                output[position] = color
                position += 1
            run -= 1
            if run < 0:
                remaining -= 1
                if remaining < 0:
                    break
                color = data[cursor] & 0x1f
                run = data[cursor] >> 5
                cursor = min(cursor + 1, last)
    return bytes(output)


class IndexedSff:
    def __init__(self, source):
        if len(source) < 64 or source[:12] != b'ElecbyteSpr\x00' or source[15] != 2:
            raise ValueError('Expected an SFF v2 source')
        self.source = source
        self.sprite_cache = {}
        self.palette_cache = []
        self.palette_names = {}
        (self.sprite_offset, self.sprite_count, self.palette_offset,
         self.palette_count, self.ldata, _, self.tdata) = struct.unpack_from('<7I', source, 36)

    def block(self, offset, size):
        if offset < 0 or size < 0 or offset + size > len(self.source):
            raise ValueError('SFF block outside source bounds')
        return self.source[offset:offset + size]

    def palette(self, index):
        if index < 0 or index >= self.palette_count:
            raise ValueError('Invalid SFF palette reference')
        while len(self.palette_cache) <= index:
            current = len(self.palette_cache)
            group, number, _, link, _, size = struct.unpack(
                '<HHHHII', self.block(self.palette_offset + current * 16, 16))
            physical = self.palette_names.get((group, number))
            if physical is None:
                physical = link if size == 0 else current
            if physical > current or (physical == current and size == 0):
                raise ValueError('Invalid forward palette link')
            if physical == current:
                palette = self.raw_palette(current)
            else:
                palette = {**self.palette_cache[physical], 'group': group,
                           'number': number, 'index': current}
            palette['remapIndex'] = physical
            self.palette_cache.append(palette)
            self.palette_names[(group, number)] = physical
        return self.palette_cache[index]

    def raw_palette(self, index):
        visited = set()
        requested = index
        logical = None
        while True:
            if index < 0 or index >= self.palette_count or index in visited:
                raise ValueError('Invalid SFF palette reference')
            visited.add(index)
            group, number, colors, link, offset, size = struct.unpack(
                '<HHHHII', self.block(self.palette_offset + index * 16, 16))
            if logical is None:
                logical = (group, number)
            if size == 0:
                if link >= index:
                    raise ValueError('Invalid forward palette link')
                index = link
                continue
            if size < colors * 4:
                raise ValueError('Truncated SFF palette')
            data = self.block(self.ldata + offset, colors * 4)
            values = [list(data[color * 4:color * 4 + 4]) for color in range(colors)]
            if self.source[13] == 0:
                for color, value in enumerate(values):
                    value[3] = 0 if color == 0 else 255
            return {'group': logical[0], 'number': logical[1], 'index': requested,
                    'resolvedIndex': index, 'colors': values}

    def sprite(self, index):
        if index < 0 or index >= self.sprite_count:
            raise ValueError('Invalid SFF sprite index')
        if index in self.sprite_cache:
            return self.sprite_cache[index]
        (group, number, width, height, axis_x, axis_y, link, encoding,
         depth, offset, size, palette, flags) = struct.unpack(
            '<HHHHhhHBBIIHH', self.block(self.sprite_offset + index * 28, 28))
        if size == 0:
            if link >= index:
                raise ValueError('Invalid forward sprite link')
            base = self.sprite(link)
            result = None if base is None else {
                **base, 'group': group, 'number': number,
                'axisX': axis_x, 'axisY': axis_y, 'palette': palette}
            self.sprite_cache[index] = result
            return result
        if depth <= 8 and encoding not in (0, 2, 3, 4, 10):
            raise NotImplementedError('Unsupported indexed SFF encoding')
        if depth != 8:
            self.sprite_cache[index] = None
            return None
        data = self.block((self.tdata if flags & 1 else self.ldata) + offset, size)
        if encoding == 0:
            indices = data
        elif len(data) < 4:
            raise ValueError('Truncated indexed sprite')
        elif encoding == 2:
            indices = decode_rle8(data[4:], width * height)
        elif encoding == 3:
            indices = decode_rle5(data[4:], width * height)
        elif encoding == 4:
            indices = decode_lz5(data[4:], width * height)
        else:
            with Image.open(io.BytesIO(data[4:])) as image:
                if image.mode != 'P' or image.size != (width, height):
                    raise ValueError('Indexed PNG layout mismatch')
                indices = image.tobytes()
        if len(indices) != width * height:
            raise ValueError('Indexed sprite byte count mismatch')
        result = {'group': group, 'number': number, 'width': width, 'height': height,
                  'axisX': axis_x, 'axisY': axis_y, 'palette': palette, 'indices': indices}
        self.sprite_cache[index] = result
        return result
