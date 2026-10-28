"""Pack compressed presentation media separately from battle assets (MPUI v1)."""
import json,pathlib,re,struct,mimetypes,hashlib
root=pathlib.Path(__file__).resolve().parents[1];mapping=json.loads((root/'asset-map.json').read_text());names=set(mapping)
for folder in ['Data/Quote','Char']:
 for f in (root/folder).rglob('*'):
  if f.is_file():names.add(f.relative_to(root).as_posix())
pattern=re.compile(r'^(Data/(ACS|Select|ReportCard|Sound|Quote)/|Stage/Select/|Char/[^/]+/(Quote|Select)/)')
names={n for n in names if pattern.match(n) and not n.endswith(('.js','.md','.py'))}
def source(name):
 own=root/name
 return own if own.is_file() else (root/mapping[name]).resolve()
layout=json.loads(source('Data/asset-layout.json').read_text())
def refs(value):
 if isinstance(value,dict):
  if isinstance(value.get('file'),str):names.add(layout.get(value['file'],value['file']))
  for v in value.values():refs(v)
 elif isinstance(value,list):
  for v in value:refs(v)
for name in ['Data/Select/select-screen.json','Data/Select/selection-assets.json']:refs(json.loads(source(name).read_text()))
entries={};chunks=[];offset=0
for name in sorted(names):
 if '/Battle/' in name or re.match(r'Char/[^/]+/Sound/',name):raise ValueError('Battle media in presentation pack: '+name)
 if not source(name).is_file():raise FileNotFoundError(name)
 data=source(name).read_bytes();mime=mimetypes.guess_type(name)[0] or 'application/octet-stream'
 entries[name]={'offset':offset,'length':len(data),'type':mime};chunks.append(data);offset+=len(data)
header=json.dumps({'version':1,'entries':entries},separators=(',',':')).encode();pack=b'MPUI'+struct.pack('<I',len(header))+header+b''.join(chunks)
dest=root/'Data/Presentation/selection.mpui';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(pack)
report={'bytes':len(pack),'files':len(entries),'sha256':hashlib.sha256(pack).hexdigest(),'paths':sorted(entries)}
(root/'Data/Presentation/build-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='paths'}))
