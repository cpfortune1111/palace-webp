import io,json,pathlib,struct,subprocess,sys
from PIL import Image
source=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);encoder=sys.argv[3];out.mkdir(parents=True,exist_ok=True)
raw=(source/'gofx.sff').read_bytes();assert raw[:12]==b'ElecbyteSpr\0' and raw[15]==1
count,offset=struct.unpack_from('<II',raw,20);images=[];sprites=[];palette=None
for i in range(count):
 following,size,ax,ay,group,number,link=struct.unpack_from('<IIhhHHH',raw,offset)
 if not size:image=images[link].copy()
 else:
  pcx=raw[offset+32:offset+32+size]
  if len(pcx)>769 and pcx[-769]==12:palette=pcx[-768:]
  elif palette is not None:pcx+=b'\x0c'+palette
  image=Image.open(io.BytesIO(pcx));image.load();image.info['transparency']=0;image=image.convert('RGBA')
 images.append(image);name='gofx-'+str(group)+'-'+str(number)+'.webp';image.save(out/name,format='WEBP',quality=88,method=4)
 sprites.append(dict(group=group,number=number,file='data/'+name,x=0,y=0,w=image.width,h=image.height,axisX=ax,axisY=ay));offset=following
(out/'gofx.pms').write_text(json.dumps(dict(sprites=sprites),separators=(',',':')));(out/'gofx.air').write_bytes((source/'gofx.air').read_bytes())
raw=(source/'gofx.snd').read_bytes();count,offset=struct.unpack_from('<II',raw,16);sounds=[]
for i in range(count):
 following,size,group,number=struct.unpack_from('<IIii',raw,offset);run=subprocess.run([encoder,'-hide_banner','-loglevel','error','-i','pipe:0','-map_metadata','-1','-c:a','libvorbis','-q:a','4','-f','ogg','pipe:1'],input=raw[offset+16:offset+16+size],capture_output=True,check=True);name='gofx-'+str(group)+'-'+str(number)+'.ogg';(out/name).write_bytes(run.stdout);sounds.append(dict(group=group,number=number,file='data/'+name));offset=following
(out/'gofx.pma').write_text(json.dumps(dict(sounds=sounds),separators=(',',':')))
print('Derived common FX:',len(sprites),'sprites,',len(sounds),'sounds')
