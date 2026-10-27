"""Separate presentation from complete per-character battle resources."""
import collections,io,json,pathlib,re,sys
from PIL import Image
from pack_assets import pack
from repack_assets import read_files
source,out,fixes=map(pathlib.Path,sys.argv[1:4]);files=read_files(source)
files['config.ini']=(pathlib.Path(__file__).with_name('native').joinpath('config.ini').read_bytes(),'text/plain')
for file in (fixes/'chars').rglob('*'):
 if file.is_file():files['chars/'+file.relative_to(fixes/'chars').as_posix()]=(file.read_bytes(),'text/plain')
characters=['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn']
groups={};owned=set()
for character in characters:
 names={name for name in files if name.startswith('chars/'+character+'/') or name.startswith('media/'+character+'/')}
 manifest=json.loads(files['chars/'+character+'/media.pms'][0]);names.update(entry['file'] for entry in manifest['sprites'])
 groups['characters/'+character]={name:files[name] for name in names};owned.update(names)
 # Small, independent HUD images: never require a battle atlas for a portrait.
 air=next(raw.decode('utf-8-sig',errors='replace') for name,(raw,mime) in files.items() if name.startswith('chars/'+character+'/') and name.lower().endswith('.air'))
 actions={};action=None
 for line in air.splitlines():
  line=line.split(';')[0].strip();header=re.match(r'\[Begin Action\s+(-?\d+)\]',line,re.I)
  if header:action=header.group(1);continue
  if action not in {str(n) for n in [915,916,917,918,919,925,926,927,928,929,950,951,952]}:continue
  frame=re.match(r'(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)(.*)',line)
  if frame:
   g,n,x,y,t=map(int,frame.groups()[:5]);actions.setdefault(action,[]).append(dict(group=g,item=n,ox=x,oy=y,time=t,flip=frame.group(6).strip(', ').split(',')[0]))
 sprites={};lookup={(s['group'],s['number']):s for s in manifest['sprites']};last=None;image=None
 for frame in [f for frames in actions.values() for f in frames]:
  key=str(frame['group'])+','+str(frame['item'])
  if key in sprites:continue
  entry=lookup.get((frame['group'],frame['item']))
  if entry is None:continue
  if last!=entry['file']:image=Image.open(io.BytesIO(files[entry['file']][0])).convert('RGBA');last=entry['file']
  tile=image.crop((entry['x'],entry['y'],entry['x']+entry['w'],entry['y']+entry['h']));buffer=io.BytesIO();tile.save(buffer,format='WEBP',lossless=True,method=4)
  name='Data/HudFaces/'+character+'/'+key.replace(',','-')+'.webp';files[name]=(buffer.getvalue(),'image/webp')
  sprites[key]=dict(x=0,y=0,w=entry['w'],h=entry['h'],axisX=entry['axisX'],axisY=entry['axisY'],file=name,page=len(sprites))
 files['Data/HudFaces/'+character+'.json']=(json.dumps(dict(actions=actions,sprites=sprites),separators=(',',':')).encode(),'application/json')
shared={name for name in files if name.startswith(('data/','resources/')) or name=='config.ini' or name.startswith('stages/filter.')}
for name in list(shared):
 if name.endswith('.pms'):shared.update(entry['file'] for entry in json.loads(files[name][0])['sprites'])
groups['shared']={name:files[name] for name in shared};owned.update(shared)
for stage in ['moon','training']:
 names={name for name in files if name in ['stages/'+stage+'.def','stages/'+stage+'.glb']};groups['stages/'+stage]={name:files[name] for name in names};owned.update(names)
presentation={}
for name,value in files.items():
 if name in owned and not name.startswith('Data/'):continue
 if name.startswith(('chars/','media/','stages/')):raise ValueError('Unassigned native resource '+name)
 if name in ['Stage/Training/StageTraining.glb','Stage/Millennium/StageMoon.glb.gz']:continue
 if re.match(r'Char/[^/]+/Sound/',name) and not name.endswith('.json') and not re.search(r'/(170|180|190|191|192)[-_]',name):continue
 presentation[name]=value
groups['presentation']={name:value for name,value in presentation.items() if name.startswith(('Char/','Data/Quote/','Data/HudFaces/','Data/Select/','Stage/Select/'))}
groups['interface']={name:value for name,value in presentation.items() if name not in groups['presentation']}
root={'version':2,'presentation':'presentation/manifest.json','interface':'interface/manifest.json','shared':'shared/manifest.json','characters':{c:'characters/'+c+'/manifest.json' for c in characters},'stages':{s:'stages/'+s+'/manifest.json' for s in ['moon','training']}}
reports={}
for name,group in groups.items():
 reports[name]=pack(group,out/name,bundle_limit=90*1024*1024 if name=='presentation' else 4*1024*1024)
 print(name,json.dumps(reports[name]),flush=True)
 if name=='presentation' and reports[name]['bundles']!=1:raise ValueError('Presentation must fit one separate bundle')
(out/'manifest.json').write_text(json.dumps(root,separators=(',',':')))
(out/'build-summary.json').write_text(json.dumps(reports,indent=2))
