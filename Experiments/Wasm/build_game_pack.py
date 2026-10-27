"""Convert native resources to derivative media, then encrypt mixed bundles."""
import argparse, io, json, mimetypes, pathlib, re, struct, subprocess, sys
from PIL import Image
from pack_assets import pack

def main():
 p=argparse.ArgumentParser();p.add_argument('--web',required=True);p.add_argument('--native',required=True);p.add_argument('--engine',required=True);p.add_argument('--encoder',required=True);p.add_argument('--output',required=True);p.add_argument('--common-derived',required=True);p.add_argument('--characters',nargs='+',default=['SailorVenus']);p.add_argument('--ui',action='store_true');a=p.parse_args()
 web=pathlib.Path(a.web).resolve();native=pathlib.Path(a.native).resolve();engine=pathlib.Path(a.engine).resolve();here=pathlib.Path(__file__).resolve().parent;files={};converted={};counts={}
 def media(path):
  key=path.relative_to(web).as_posix()
  if key in converted:return converted[key]
  data=path.read_bytes();mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
  if path.suffix.lower()=='.png':
   image=Image.open(io.BytesIO(data)).convert('RGBA');out=io.BytesIO();image.save(out,format='WEBP',quality=88,method=4);data=out.getvalue();mime='image/webp'
  elif path.suffix.lower() in ('.wav','.flac'):
   run=subprocess.run([a.encoder,'-hide_banner','-loglevel','error','-i','pipe:0','-map_metadata','-1','-c:a','libvorbis','-q:a','4','-f','ogg','pipe:1'],input=data,capture_output=True,check=True);data=run.stdout;mime='audio/ogg'
  files[key]=(data,mime);converted[key]=key;return key
 for character in a.characters:
  short=character.removeprefix('Sailor');directory=web/'Char'/short;sprites={}
  for metadata in sorted(directory.rglob('*.json')):
   if 'Native' in metadata.parts or 'Sources' in metadata.parts:continue
   try:d=json.loads(metadata.read_text(encoding='utf-8'))
   except (ValueError,UnicodeError):continue
   if not isinstance(d,dict) or not isinstance(d.get('sprites'),dict):continue
   pages=d.get('atlasFiles')
   if not pages:
    candidates=[metadata.with_name(metadata.stem+'_atlas'+ext) for ext in ['.webp','.png']];existing=next((x for x in candidates if x.exists()),None)
    if not existing:continue
    pages=[existing.name]
   for key,entry in d['sprites'].items():
    if not isinstance(entry,dict) or not all(x in entry for x in ['x','y','w','h','axisX','axisY']):continue
    page=entry.get('page',0)
    if page>=len(pages):continue
    atlas=metadata.parent/pages[page]
    if not atlas.exists():raise ValueError(str(atlas))
    group,number=map(int,key.split(','));sprites[key]=dict(group=group,number=number,file=media(atlas),**{x:entry[x] for x in ['x','y','w','h','axisX','axisY']})
  if not sprites:raise ValueError('No derivative sprites: '+character)
  prefix='chars/'+character+'/'
  folder=native/'chars'/character
  for source in folder.iterdir():
   if source.is_file() and source.suffix.lower() in ('.cns','.st','.cmd','.air','.dat','.def'):
    files[prefix+source.name]=(source.read_bytes(),'text/plain')
  definition=next(folder.glob('*.def')).read_text(encoding='utf-8-sig',errors='replace')
  definition=re.sub(r'(?im)^\s*sprite\s*=.*$','sprite = media.pms',definition);definition=re.sub(r'(?im)^\s*sound\s*=.*$','sound = media.pma',definition)
  files[prefix+'host.def']=(definition.encode(),'text/plain');files[prefix+'media.pms']=(json.dumps(dict(sprites=list(sprites.values())),separators=(',',':')).encode(),'application/json')
  snd=next(folder.glob('*.snd')).read_bytes();count,offset=struct.unpack_from('<II',snd,16);sounds=[]
  for i in range(count):
   following,size,group,number=struct.unpack_from('<IIii',snd,offset);wave=snd[offset+16:offset+16+size]
   run=subprocess.run([a.encoder,'-hide_banner','-loglevel','error','-i','pipe:0','-map_metadata','-1','-c:a','libvorbis','-q:a','4','-f','ogg','pipe:1'],input=wave,capture_output=True,check=True)
   name='media/'+character+'/sound-'+str(group)+'-'+str(number)+'.ogg';files[name]=(run.stdout,'audio/ogg');sounds.append(dict(group=group,number=number,file=name));offset=following
  files[prefix+'media.pma']=(json.dumps(dict(sounds=sounds),separators=(',',':')).encode(),'application/json');counts[character]=dict(sprites=len(sprites),sounds=len(sounds));print(character,counts[character],flush=True)
 for source in (engine/'data').rglob('*'):
  if source.is_file() and source.suffix.lower() in ('.zss','.cmd','.air','.const'):files['data/'+source.relative_to(engine/'data').as_posix()]=(source.read_bytes(),'text/plain')
 for source in (here/'native').iterdir():
  if source.is_file():files[('stages/' if source.name=='training.def' else 'data/')+source.name]=(source.read_bytes(),'text/plain')
 files['config.ini']=files.pop('data/config.ini')
 for source in pathlib.Path(a.common_derived).iterdir():
  if source.is_file():files['data/'+source.name]=(source.read_bytes(),mimetypes.guess_type(source.name)[0] or 'application/octet-stream')
 if a.ui:
  for folder in ['Data','Char','Stage','system-webp','logo-webp','title-source','Sound']:
   for source in (web/folder).rglob('*'):
    if source.is_file() and source.suffix.lower() in ('.png','.webp','.jpg','.jpeg','.mp3','.ogg','.wav','.flac','.glb','.gz','.ttf','.woff','.woff2','.json') and 'Sources' not in source.parts and 'Native' not in source.parts:media(source)
  layout=json.loads((web/'Data/asset-layout.json').read_text(encoding='utf-8'))
  for value in set(layout.values()):
   source=web/value
   if source.parent==web and source.is_file() and source.suffix.lower() in ('.png','.webp','.mp3','.json','.ttf','.woff','.woff2'):media(source)
 # Generated adapters override only this isolated preview's encrypted catalog.
 additions=pathlib.Path(a.common_derived).parent/'wasm-pack-additions'
 if additions.exists():
  for source in additions.rglob('*'):
   if source.is_file():
    name=source.relative_to(additions).as_posix()
    if source.suffix.lower() in ('.sff','.snd'):raise ValueError('Original archives are forbidden: '+name)
    files[name]=(source.read_bytes(),mimetypes.guess_type(source.name)[0] or 'application/octet-stream')
 result=pack(files,a.output);result['characters']=counts;pathlib.Path(a.output).joinpath('build-summary.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)

if __name__=='__main__':main()
