import gzip,json,pathlib,re,struct,sys,shutil
web=pathlib.Path(sys.argv[1]);native=pathlib.Path(sys.argv[2]);out=pathlib.Path(sys.argv[3])/'stages';out.mkdir(parents=True,exist_ok=True)
def native_glb(raw):
 assert raw[:4]==b'glTF';size,kind=struct.unpack_from('<II',raw,12);doc=json.loads(raw[20:20+size]);tail=raw[20+size:]
 for texture in doc.get('textures',[]):
  extension=texture.get('extensions',{}).get('EXT_texture_webp')
  if extension is not None:texture['source']=extension['source']
 encoded=json.dumps(doc,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4);return b'glTF'+struct.pack('<II',2,20+len(encoded)+len(tail))+struct.pack('<II',len(encoded),kind)+encoded+tail
moon=gzip.decompress((web/'Stage/Millennium/StageMoon.glb.gz').read_bytes());(out/'moon.glb').write_bytes(native_glb(moon))
(out/'training.glb').write_bytes(native_glb((web/'Stage/Training/StageTraining.glb').read_bytes()))
text=(native/'stages/StageMoon.def').read_text(encoding='utf-8-sig');text=re.sub(r'(?im)^model\s*=.*$','model = moon.glb',text);text=re.sub(r'(?im)^spr\s*=.*$','spr = filter.pms',text);text=re.sub(r'(?im)^bgmusic\s*=.*$','bgmusic =',text);(out/'moon.def').write_text(text,encoding='utf-8')
camera=json.loads((web/'Stage/Training/stage_camera.json').read_text());lines=['[Info]','name = Training','mugenversion = 1.1']
for section,key in [('Camera','camera'),('PlayerInfo','player'),('Bound','bound')]:lines+=['['+section+']']+[str(k)+' = '+str(v) for k,v in camera[key].items()]
lines+=['[StageInfo]','zoffset = 660','localcoord = 1280,720','autoturn = 1','resetBG = 1','[Shadow]','intensity = 25','yscale = .25','[Reflection]','intensity = 50','[BGdef]','model = training.glb','spr = filter.pms','[Model]','offset = 0,-.2,-.9','scale = .125,.125,.125','[BG Filter]','type = normal','spriteno = 1,0','layerno = 1','start = 0,0','delta = 0,0','mask = 1'];(out/'training.def').write_text('\n'.join(lines),encoding='utf-8')
shutil.copyfile(web/'Stage/Common/stage_filter.webp',out/'filter.webp');(out/'filter.pms').write_text(json.dumps(dict(sprites=[dict(group=1,number=0,file='stages/filter.webp',x=0,y=0,w=1280,h=720,axisX=640,axisY=0)]),separators=(',',':')))
print('Derived native-compatible WebP-textured stages without original GLB/SFF archives')
