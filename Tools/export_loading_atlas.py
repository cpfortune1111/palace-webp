import json
from pathlib import Path
from PIL import Image

source = Path('E:/3D 2022/Loading/1x')
destination = Path(__file__).resolve().parents[1] / 'Data/Loading'
destination.mkdir(parents=True, exist_ok=True)
entries = []
for file in sorted(source.glob('*.webp')):
    image = Image.open(file).convert('RGBA')
    bounds = image.getbbox()
    if not bounds:
        raise ValueError(f'Empty sprite: {file.name}')
    entries.append((file.stem, image.crop(bounds), image.size, bounds))
entries.sort(key=lambda entry: (-entry[1].height, entry[0]))
width = 2048
cursor_x = cursor_y = row_height = 2
sprites = {}
placements = []
for name, image, original_size, bounds in entries:
    if cursor_x + image.width + 2 > width:
        cursor_x = 2
        cursor_y += row_height + 4
        row_height = 0
    sprites[name] = {'x': cursor_x, 'y': cursor_y, 'w': image.width, 'h': image.height,
                     'originalSize': list(original_size), 'crop': list(bounds)}
    placements.append((image, cursor_x, cursor_y))
    cursor_x += image.width + 4
    row_height = max(row_height, image.height)
height = cursor_y + row_height + 2
atlas = Image.new('RGBA', (width, height))
for image, position_x, position_y in placements:
    atlas.paste(image, (position_x, position_y))
atlas.save(destination / 'loading-atlas.webp', format='WEBP', lossless=True, method=6)
letters = 'NOWLOADING'
locations = [465.75, 530.9028, 604.5869, 692.832, 744.7988,
             805.0508, 867.6611, 910.6455, 955.6807, 1020.4033]
config = {'atlas': 'loading-atlas.webp', 'size': [width, height], 'sprites': sprites,
          'letters': [{'sprite': letter, 'x': position_x, 'y': 355.4456, 'scale': .5}
                      for letter, position_x in zip(letters, locations)],
          'letterDuration': 58,
          'bar': {'sprite': 'LoadingBar', 'scale': .5, 'x': 640, 'y': 480, 'color': '#FF3EA7',
                  'startX': 257, 'endX': 1026, 'insetY': 4},
          'luna': {'frames': [f'00600{index}' for index in range(10)],
                   'x': 299, 'y': 340, 'height': 630, 'frameTicks': 6},
          'previewTicks': 720}
(destination / 'loading-atlas.json').write_text(json.dumps(config, separators=(',', ':')), encoding='utf-8')
print(json.dumps({'sprites': len(sprites), 'size': [width, height],
                  'bytes': (destination / 'loading-atlas.webp').stat().st_size}))

