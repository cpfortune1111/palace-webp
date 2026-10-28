"""Export/import editable AIR-style presentation timelines; no source media required."""
import argparse,json,pathlib,re,shlex
p=argparse.ArgumentParser();p.add_argument('mode',choices=['export','import']);p.add_argument('character',choices=['Moon','Jupiter','Neptune','Saturn']);p.add_argument('--root',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]);args=p.parse_args()
manifest=args.root/'Data/Quote'/f'{args.character.lower()}.json';air=args.root/'Timelines'/f'{args.character}.air';data=json.loads(manifest.read_text(encoding='utf-8'))
if args.mode=='export':
 lines=[f'; {args.character}: presentation portrait timelines, 60 ticks per second.', '; group,item, x,y, ticks. Sound comments are editable timeline cues.', '; Run Tools/quote-timelines.py import '+args.character+' to apply edits.','']
 for key,action in data['actions'].items():
  lines += [f'[Begin Action {key}]']
  duration=sum(max(0,f['ticks']) for f in action['frames'])
  for cue in action['cues']:
   if cue['tick']>=duration:lines.append('; @sound '+json.dumps(cue,separators=(',',':')))
  tick=0;loop=action.get('loop')
  for f in action['frames']:
   number=int(f['sprite']);ticks=f['ticks']
   end=tick+max(0,ticks);cuts={tick,end}
   if loop is not None and tick<=loop<end:cuts.add(loop)
   for cue in action['cues']:
    if tick<=cue['tick']<end:cuts.add(cue['tick'])
   cuts=sorted(cuts)
   if ticks<0:cuts=[tick,tick-1]
   for start,stop in zip(cuts,cuts[1:]):
    if loop==start:lines.append('loopstart')
    for cue in action['cues']:
     if cue['tick']==start:lines.append('; PLAYSND '+json.dumps(cue['file'])+' ; duration='+str(cue['duration']))
    lines.append(f'{number//100},{number%100}, 0,0, {stop-start}')
   tick+=max(0,ticks)
  lines.append('')
 air.parent.mkdir(parents=True,exist_ok=True);air.write_text('\n'.join(lines),encoding='utf-8')
 print(air)
else:
 current=None;actions={};tick=0
 for number,line in enumerate(air.read_text(encoding='utf-8-sig').splitlines(),1):
  line=line.strip();match=re.fullmatch(r'\[Begin Action (\d+)\]',line,re.I)
  if match:
   current=match[1];actions[current]={'frames':[],'cues':[],'loop':None};tick=0;continue
  if line.startswith('; @sound '):
   if current is None:raise ValueError(f'line {number}: sound outside action')
   actions[current]['cues'].append(json.loads(line[len('; @sound '):]));continue
  sound=re.fullmatch(r';\s*PLAYSND\s+(".*")\s*;\s*duration=(\d+)',line,re.I)
  if sound:
   if current is None:raise ValueError(f'line {number}: sound outside action')
   actions[current]['cues'].append({'file':json.loads(sound[1]),'tick':tick,'duration':int(sound[2])});continue
  line=line.split(';',1)[0].strip()
  if not line:continue
  if current is None:raise ValueError(f'line {number}: frame outside action')
  if line.lower()=='loopstart':actions[current]['loop']=tick;continue
  fields=[int(v.strip()) for v in line.split(',')]
  if len(fields)!=5 or fields[2:4]!=[0,0]:raise ValueError(f'line {number}: expected group,item,0,0,ticks')
  group,item,_,_,duration=fields;sprite=f'{group:04d}{item:02d}'
  if sprite not in data['frames'] or duration==0 or duration < -1:raise ValueError(f'line {number}: unknown sprite or invalid duration')
  actions[current]['frames'].append({'sprite':sprite,'ticks':duration});tick+=max(0,duration)
 for key,action in actions.items():
  if not action['frames']:raise ValueError(f'Action {key} has no frames')
  action['cues'].sort(key=lambda cue:cue['tick'])
  data['actions'][key]=action
 manifest.write_text(json.dumps(data,separators=(',',':'),ensure_ascii=False),encoding='utf-8');print(manifest)
