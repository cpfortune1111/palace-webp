"""Refresh Saturn quote art at its original 1920-wide design scale, bottom aligned."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
source=Path('E:/3D 2022/Quote/Saturn/1x')
manifest=root/'Data/Quote/saturn.json'
data=json.loads(manifest.read_text(encoding='utf-8'))
for path in sorted(source.glob('Sat9010*.png'))+[source/'Sat902000.png']:
 key=path.stem.removeprefix('Sat');image=Image.open(path).convert('RGBA')
 size=(1280,round(image.height*1280/image.width));resized=image.resize(size,Image.Resampling.LANCZOS)
 offset=720-size[1];box=resized.getchannel('A').getbbox();destination=root/'Char/Saturn/Quote'/(key+'.webp')
 resized.crop(box).save(destination,format='WEBP',quality=92,method=6)
 data['frames'][key]={'file':f'Char/Saturn/Quote/{key}.webp','width':1280,'height':720,'x':box[0],'y':box[1]+offset,'cropWidth':box[2]-box[0],'cropHeight':box[3]-box[1],'sourceSize':list(image.size),'alignment':'bottom'}
 print(key,data['frames'][key],destination.stat().st_size)
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
