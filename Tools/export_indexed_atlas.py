import argparse
import hashlib
import json
import struct
from pathlib import Path

from PIL import Image

from sff_indexed_palette import IndexedSff


def export_indexed_atlas(source_path, layout_path, output_path, pages=None, uncropped=False):
    source_path, layout_path, output_path = map(Path, (source_path, layout_path, output_path))
    source = source_path.read_bytes()
    layout = json.loads(layout_path.read_text(encoding='utf-8'))
    digest = hashlib.sha256(source).hexdigest()
    if layout.get('source', {}).get('sffSHA256', '').lower() != digest:
        raise ValueError('Indexed atlas source hash mismatch')
    reader = IndexedSff(source)
    lookup = {}
    for index in range(reader.sprite_count):
        group, number = struct.unpack('<HH', reader.block(reader.sprite_offset + index * 28, 4))
        lookup[f'{group},{number}'] = index
    selected = set(range(len(layout['atlasFiles']))) if pages is None else set(pages)
    if any(page < 0 or page >= len(layout['atlasFiles']) for page in selected):
        raise ValueError('Invalid indexed atlas page selection')
    images = {}
    for page in ([] if uncropped else sorted(selected)):
        with Image.open(layout_path.parent / layout['atlasFiles'][page]) as original:
            images[page] = Image.new('L', original.size)
    sprites, non_indexed = {}, {}
    cursor_x, cursor_y, row_height, output_page = 0, 0, 0, -1
    for key, packed in layout['sprites'].items():
        page = packed['page']
        if page not in selected:
            continue
        if key not in lookup:
            raise ValueError('Indexed atlas sprite missing from source: ' + key)
        sprite = reader.sprite(lookup[key])
        if sprite is None:
            encoding, depth = struct.unpack('<BB', reader.block(reader.sprite_offset + lookup[key] * 28 + 14, 2))
            non_indexed[key] = {'encoding': encoding, 'depth': depth}
            continue
        if uncropped:
            width, height = sprite['width'], sprite['height']
            if output_page < 0 or width > images[output_page].width or height > images[output_page].height:
                output_page += 1
                images[output_page] = Image.new('L', (max(2048, width), max(2048, height)))
                cursor_x, cursor_y, row_height = 0, 0, 0
            if cursor_x + width > images[output_page].width:
                cursor_x, cursor_y, row_height = 0, cursor_y + row_height + 1, 0
            if cursor_y + height > images[output_page].height:
                output_page += 1
                images[output_page] = Image.new('L', (max(2048, width), max(2048, height)))
                cursor_x, cursor_y, row_height = 0, 0, 0
            packed = {'x': cursor_x, 'y': cursor_y, 'w': width, 'h': height,
                      'axisX': sprite['axisX'], 'axisY': sprite['axisY'], 'page': output_page}
            page = output_page
            cursor_x += width + 1
            row_height = max(row_height, height)
        left, top = sprite['axisX'] - packed['axisX'], sprite['axisY'] - packed['axisY']
        width, height = packed['w'], packed['h']
        if min(left, top, width, height) < 0 or left + width > sprite['width'] or top + height > sprite['height']:
            raise ValueError('Indexed atlas crop outside source: ' + key)
        image = Image.frombytes('L', (sprite['width'], sprite['height']), sprite['indices'])
        cropped = image.crop((left, top, left + width, top + height))
        indices = cropped.tobytes()
        colors = reader.palette(sprite['palette'])['colors']
        rgba = bytes(channel for color in indices for channel in (colors[color] if color < len(colors) else (0, 0, 0, 0)))
        images[page].paste(cropped, (packed['x'], packed['y']))
        sprites[key] = {**packed, 'paletteIndex': sprite['palette'],
                        'sourceWidth': sprite['width'], 'sourceHeight': sprite['height'],
                        'sourceAxisX': sprite['axisX'], 'sourceAxisY': sprite['axisY'],
                        'cropX': left, 'cropY': top,
                        'indexSHA256': hashlib.sha256(indices).hexdigest(),
                        'rgbaSHA256': hashlib.sha256(rgba).hexdigest()}
    color_tables, color_lookup, palettes = [], {}, []
    for index in range(reader.palette_count):
        palette = reader.palette(index)
        encoded = bytes(channel for color in palette['colors'] for channel in color)
        if encoded not in color_lookup:
            color_lookup[encoded] = len(color_tables)
            color_tables.append(palette['colors'])
        palettes.append({'index': index, 'group': palette['group'], 'number': palette['number'],
                         'colorTable': color_lookup[encoded], 'resolvedIndex': palette['resolvedIndex'],
                         'remapIndex': palette['remapIndex']})
    output_path.mkdir(parents=True, exist_ok=True)
    files = []
    for page, image in sorted(images.items()):
        if uncropped:
            used = [sprite for sprite in sprites.values() if sprite['page'] == page]
            image = image.crop((0, 0, max(sprite['x'] + sprite['w'] for sprite in used),
                                max(sprite['y'] + sprite['h'] for sprite in used)))
        name = f'indices-{page}.webp'
        target = output_path / name
        image.convert('RGB').save(target, format='WEBP', lossless=True, exact=True, method=6)
        with Image.open(target) as decoded:
            if decoded.convert('RGB').tobytes() != image.convert('RGB').tobytes():
                raise ValueError('Indexed atlas lossless verification failed')
        files.append({'page': page, 'file': name, 'width': image.width, 'height': image.height,
                      'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'bytes': target.stat().st_size})
    result = {'schema': 'palace-indexed-atlas-v1', 'uncropped': uncropped, 'sourceSHA256': digest, 'pages': files,
              'sprites': sprites, 'nonIndexedSprites': non_indexed, 'palettes': palettes, 'colorTables': color_tables}
    (output_path / 'indexed.json').write_text(json.dumps(result, separators=(',', ':')), encoding='utf-8')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True)
    parser.add_argument('--layout', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--pages')
    parser.add_argument('--uncropped', action='store_true')
    args = parser.parse_args()
    selected = None if args.pages is None else [int(page) for page in args.pages.split(',')]
    result = export_indexed_atlas(args.source, args.layout, args.output, selected, args.uncropped)
    print(json.dumps({'pages': len(result['pages']), 'sprites': len(result['sprites']),
                      'palettes': len(result['palettes']), 'colorTables': len(result['colorTables']),
                      'imageBytes': sum(page['bytes'] for page in result['pages'])}))
