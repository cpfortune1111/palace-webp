import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path('E:/3D 2022/Select/WEB')
control = Path('E:/3D 2022/Control Mode/WEB')
manifest = {'characters': {}, 'modes': {}, 'stages': {}, 'controlExtras': {}}

def export(path, destination):
    image = Image.open(path).convert('RGBA')
    bounds = image.getbbox()
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.crop(bounds).save(destination, format='WEBP', quality=90, method=6)
    return {'file': destination.relative_to(root).as_posix(), 'x': bounds[0], 'y': bounds[1], 'w': bounds[2]-bounds[0], 'h': bounds[3]-bounds[1]}

for name in ['Moon', 'CMoon', 'Mercury', 'Mars', 'Jupiter', 'Venus', 'Uranus', 'Neptune', 'Pluto', 'Saturn', 'Swatheshia']:
    identifier = 'LadySwatheshia' if name == 'Swatheshia' else 'SailorChibiMoon' if name == 'CMoon' else 'Sailor'+name
    entries = {}
    for kind, filename in [('portrait', 'Portrait '+('Nep' if name == 'Neptune' else name)+'.png'), ('name', 'Name '+name+'.png'), ('disc', name+'900000.png')]:
        path = source / filename
        if path.exists():
            entries[kind] = export(path, root / 'Char' / name / 'Select' / (kind+'.webp'))
    manifest['characters'][identifier] = entries

for code, name in [('0930', 'snes'), ('0931', '3do'), ('0932', 'saturn'), ('0935', 'normal'), ('0936', 'auto')]:
    manifest['modes'][name] = [export(control / (code+str(frame).zfill(2)+'.png'), root / 'Data/Select/Mode' / (name+'-'+str(frame)+'.webp')) for frame in range(2)]

for path in control.glob('095*.png'):
    code, name = path.stem.split(' ', 1)
    manifest['controlExtras'][path.stem] = export(path, root / 'Char' / name / 'Select' / (code+'.webp'))

for path in source.glob('*.png'):
    if path.name.startswith(('Name ', 'Portrait ')) or '900000' in path.name:
        continue
    stem = path.stem
    name, frame = stem.rsplit(' ', 1)
    index = 'preview' if frame == '0' else '0' if frame == '00' else '1'
    manifest['stages'].setdefault(name, {})[index] = export(path, root / 'Stage' / name / 'Select' / ('title-'+index+'.webp'))

(root / 'Data/Select/selection-assets.json').write_text(json.dumps(manifest, separators=(',', ':')), encoding='utf-8')
print('Exported', len(manifest['characters']), 'characters,', len(manifest['modes']), 'modes,', len(manifest['stages']), 'stage titles')
