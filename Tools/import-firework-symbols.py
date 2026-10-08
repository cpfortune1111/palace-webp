from pathlib import Path
import json
from PIL import Image

source = Path(r'E:\3D 2022\Control Mode\WEB\FIREWORK')
root = Path(__file__).resolve().parents[1]
identifiers = {'CMoon': 'SailorChibiMoon', 'Swatheshia': 'LadySwatheshia'}
symbols = {}
for original in sorted(source.glob('095000 *.png')):
    folder = original.stem.split(' ', 1)[1]
    identifier = identifiers.get(folder, 'Sailor' + folder)
    target = root / 'Char' / folder / 'Firework' / 'symbol.webp'
    target.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(original).convert('RGBA')
    image.save(target, 'WEBP', lossless=True, method=6)
    symbols[identifier] = {'file': target.relative_to(root).as_posix(), 'width': image.width, 'height': image.height}
    print(folder, original.stat().st_size, '->', target.stat().st_size)
manifest = root / 'Data' / 'Fireworks' / 'symbols.json'
manifest.parent.mkdir(parents=True, exist_ok=True)
manifest.write_text(json.dumps(symbols, separators=(',', ':')), encoding='utf-8')
print('Imported', len(symbols), 'exact firework symbols')

