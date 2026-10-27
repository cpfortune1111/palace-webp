"""Keep already-approved disabled presentation helpers out of the WASM roster."""
import pathlib,re,sys,json
source=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);counts={}
for character in ['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn']:
 for file in (source/'chars'/character).iterdir():
  if file.suffix.lower() not in ('.cns','.st','.cmd'):continue
  text=file.read_text(encoding='utf-8-sig',errors='replace');removed=[]
  def clean(match):
   block=match.group(0)
   if re.search(r'(?im)^\s*type\s*=\s*Helper\b',block) and (state:=re.search(r'(?im)^\s*stateno\s*=\s*(915|925|950)\s*(?:;.*)?$',block)):
    removed.append(int(state.group(1)));return '; Portrait/emblem presentation is owned by the Web HUD.\n'
   return block
  modified=re.sub(r'(?ims)^\[State\s+[^\]]*\].*?(?=^\[|\Z)',clean,text)
  # v1.0.0 rejects unary ! immediately after a trigger redirection.
  modified=re.sub(r'(?i)\b(root|parent|enemynear|enemy)\s*,\s*!\s*Alive\b',r'\1,Alive = 0',modified)
  if modified!=text:
   target=out/'chars'/character/file.name;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(modified,encoding='utf-8');counts[character+'/'+file.name]=len(removed)
print(json.dumps(counts))
