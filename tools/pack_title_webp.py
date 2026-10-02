import json
from pathlib import Path
from PIL import Image

root = Path('work')
data = json.loads((root / 'title_animation.json').read_text())
output = {'actions': data['actions'], 'loopStarts': data['loopStarts'], 'source': data['source'], 'animated': {}}
for action in ('21', '30'):
    frames = data['actions'][action]
    rectangles = []
    for frame in frames:
        sprite = data['sprites'][f"{frame['group']},{frame['item']}"]
        x, y = 640-sprite['axisX']+frame['ox'], -sprite['axisY']+frame['oy']
        rectangles.append((x, y, x+sprite['w'], y+sprite['h']))
    left, top = min(rect[0] for rect in rectangles), min(rect[1] for rect in rectangles)
    width, height = max(rect[2] for rect in rectangles)-left, max(rect[3] for rect in rectangles)-top
    images = []
    for frame, rectangle in zip(frames, rectangles):
        sprite = data['sprites'][f"{frame['group']},{frame['item']}"]
        with Image.open(root / data['atlasFiles'][sprite['page']]) as atlas:
            image = Image.new('RGBA', (width, height))
            image.paste(atlas.crop((sprite['x'], sprite['y'], sprite['x']+sprite['w'], sprite['y']+sprite['h'])), (rectangle[0]-left, rectangle[1]-top))
            images.append(image)
    filename = f'title-action-{action}.webp'
    images[0].save(root / filename, save_all=True, append_images=images[1:], quality=90, method=4, exact=True, duration=[round(frame['time']*1000/60) for frame in frames], loop=0, minimize_size=True)
    output['animated'][action] = {'file': filename, 'x': left, 'y': top, 'frames': len(images)}
(root / 'title_animation_webp.json').write_text(json.dumps(output, separators=(',', ':')))
