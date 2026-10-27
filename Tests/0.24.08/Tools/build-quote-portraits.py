"""Build compressed presentation-only portraits and editable 60 Hz voice timelines."""
import argparse,collections,json,math,pathlib,re,sys,hashlib
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[4]
sys.path.insert(0,str(root/'outputs/audio-codec-deps'))
import numpy as np
import soundfile as sf
p=argparse.ArgumentParser();p.add_argument('--source',default='E:/3D 2022/Quote');p.add_argument('--output',default=str(root/'work/Tests/0.24.08'));args=p.parse_args()
source=pathlib.Path(args.source);out=pathlib.Path(args.output);venus=json.loads((root/'work/Data/Quote/venus.json').read_text())
def append(frames,sprite,ticks):
 if ticks>0 and frames and frames[-1]['sprite']==sprite and frames[-1]['ticks']>0:frames[-1]['ticks']+=ticks
 else:frames.append(dict(sprite=sprite,ticks=ticks))
def lip_frames(audio,sr,poses):
 # Two-tick analysis windows avoid jitter, retaining pauses and utterance timing.
 mono=audio.mean(axis=1) if audio.ndim>1 else audio;duration=math.ceil(len(mono)/sr*60);rms=[]
 for t in range(0,duration,2):
  samples=mono[int(t*sr/60):int((t+2)*sr/60)];rms.append(float(np.sqrt(np.mean(samples*samples))) if len(samples) else 0)
 reference=max(float(np.percentile(rms,90)),.0001);frames=[];levels=[]
 for index,energy in enumerate(rms):
  ratio=energy/reference;level=0 if ratio<.09 else 1 if ratio<.48 else 2
  levels.append(level);append(frames,poses[level],min(2,duration-index*2))
 return frames,duration,dict(windowTicks=2,referenceRms=reference,closedWindows=levels.count(0),halfWindows=levels.count(1),openWindows=levels.count(2))
report={}
for character in ['Moon','Jupiter','Neptune','Saturn']:
 src=source/character;target=out/'Char'/character/'Quote';target.mkdir(parents=True,exist_ok=True);frames={}
 for path in sorted((src/'1x').glob('*.png')):
  key=re.search(r'(9\d{5})$',path.stem).group(1);image=Image.open(path).convert('RGBA').resize((1280,720),Image.Resampling.LANCZOS)
  box=image.getchannel('A').getbbox() or (0,0,1,1);destination=target/(key+'.webp')
  if not destination.exists() or destination.stat().st_mtime<path.stat().st_mtime:image.crop(box).save(destination,format='WEBP',quality=88,method=6)
  frames[key]=dict(file=f'Char/{character}/Quote/{key}.webp',width=1280,height=720,x=box[0],y=box[1],cropWidth=box[2]-box[0],cropHeight=box[3]-box[1])
 actions={};notes={};audio_files={}
 def static_action(identifier):
  action=json.loads(json.dumps(venus['actions'][identifier]));action['cues']=[];return action
 for identifier in ['9000','9010','9019']:actions[identifier]=static_action(identifier)
 def voice_action(identifier,path,prefix,poses,tail=None,hold=True):
  audio,sr=sf.read(path,dtype='float32',always_2d=True);name=re.sub(r'[^A-Za-z0-9]+','-',path.stem).strip('-')+'.ogg';dest=target/name
  if name not in audio_files:sf.write(dest,audio,sr,format='OGG',subtype='VORBIS');audio_files[name]=dict(source=path.name,samples=len(audio),sampleRate=sr,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
  sequence=[dict(sprite=s,ticks=t) for s,t in prefix];start=sum(x['ticks'] for x in sequence);lip,duration,analysis=lip_frames(audio,sr,poses)
  for f in lip:append(sequence,f['sprite'],f['ticks'])
  if not tail:append(sequence,poses[0],4)
  for sprite,ticks in tail or []:append(sequence,sprite,ticks)
  if hold:append(sequence,sequence[-1]['sprite'],-1)
  actions[identifier]=dict(frames=sequence,cues=[dict(tick=start,duration=duration,file=f'Char/{character}/Quote/{name}')],loop=None)
  notes[identifier]=dict(source=path.name,speechStartTick=start,speechTicks=duration,mouthSprites=poses,analysis=analysis)
  return duration
 wavs=list(src.glob('*.wav'))
 for variant,path in enumerate(sorted(x for x in wavs if x.name.startswith('Intro'))):voice_action(str(9011+variant),path,[],['901008','901009','901010'])
 for variant,path in enumerate(sorted(x for x in wavs if x.name.startswith('Win'))):
  hold=28 if variant==0 else 18
  if character=='Moon':prefix=[1,2,3,4,5,6,10];mouth=[10,9,8];tail=[(10,hold)]
  elif character=='Jupiter':prefix=[4,5,6,7,8];mouth=[8,9,10];tail=[(8,hold)]
  elif character=='Saturn':prefix=[1,2,3,4,5,6];mouth=[6,7,8];tail=[(6,hold)]
  else:prefix=[1,2,3];mouth=[4,5,6];tail=[(7,4),(8,hold)]
  voice_action(str(9020+variant),path,[(f'9020{i:02}',4) for i in prefix],[f'9020{i:02}' for i in mouth],[(f'9020{i:02}',t) for i,t in tail])
 lose_paths=sorted(x for x in wavs if x.name.startswith('Lose'))
 for variant,path in enumerate(lose_paths):
  prefix=list(range(9)) if character=='Jupiter' else [0,1,2];mouth=[9,10,11] if character=='Jupiter' else [5,4,3] if character=='Saturn' else [3,4,5]
  voice_action(str(9030+variant),path,[(f'9030{i:02}',4) for i in prefix],[f'9030{i:02}' for i in mouth])
 # Time-over lines ending a/b form one utterance, not separate random variants.
 groups=collections.defaultdict(list)
 for path in sorted(x for x in wavs if x.name.startswith('TLose')):groups[re.sub(r'[ab]$','',path.stem)].append(path)
 for variant,paths in enumerate(groups.values()):
  poses=['903003','903006','903007'] if character=='Moon' else ['903009','903010','903011'] if character=='Jupiter' else ['903005','903004','903003'] if character=='Saturn' else ['903003','903004','903005']
  identifier=str(9040+variant);sequence=[];cues=[]
  prefix=list(range(9)) if character=='Jupiter' else [0,1,2]
  for i in prefix:append(sequence,f'9030{i:02}',4)
  offset=sum(f['ticks'] for f in sequence)
  for path in paths:
   temp='part-'+identifier;voice_action(temp,path,[],poses,hold=False);part=actions.pop(temp);part_notes=notes.pop(temp)
   # Preserve source clip boundary; a short closed-mouth pause separates split files.
   for cue in part['cues']:cues.append({**cue,'tick':offset+cue['tick']})
   for f in part['frames']:append(sequence,f['sprite'],f['ticks'])
   offset=sum(f['ticks'] for f in sequence);append(sequence,poses[0],6);offset+=6
  append(sequence,poses[0],-1);actions[identifier]=dict(frames=sequence,cues=cues,loop=None);notes[identifier]=dict(sources=[x.name for x in paths],speechStartTick=len(prefix)*4,mouthSprites=poses,splitGapTicks=10)
 if character=='Moon':
  for identifier in ['9030','9031','9040','9041']:
   if identifier not in actions:continue
   actions[identifier]['frames']=[dict(sprite=f'9030{i:02}',ticks=4) for i in [0,1,2,3,4,5,6,7,6,5,4]]
   actions[identifier]['loop']=12;notes[identifier]['mode']='cry-loop-no-lip-sync';notes[identifier].pop('analysis',None);notes[identifier].pop('mouthSprites',None)
 for action in actions.values():
  for frame in action['frames']:
   if frame['sprite'] not in frames:raise ValueError(character+' missing '+frame['sprite'])
 manifest=dict(character='Sailor'+character,logicalSize=[1280,720],tickRate=60,frames=frames,actions=actions,timelineNotes=notes,audioSources=audio_files)
 dest=out/'Data/Quote'/ (character.lower()+'.json');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(manifest,indent=2),encoding='utf-8')
 report[character]=dict(frames=len(frames),actions=list(actions),bytes=sum(x.stat().st_size for x in target.iterdir()))
 print(character,report[character],flush=True)
(out/'Data/Quote/build-report.json').write_text(json.dumps(report,indent=2))
