"""Collect licenses for packages linked into the js/wasm engine."""
import json, os, pathlib, subprocess, sys
root=pathlib.Path(sys.argv[1]).resolve();go=pathlib.Path(sys.argv[2]).resolve();out=pathlib.Path(sys.argv[3]).resolve()
env=dict(os.environ,GOOS='js',GOARCH='wasm',CGO_ENABLED='0',GOEXPERIMENT='arenas',GOTOOLCHAIN='local')
raw=subprocess.check_output([str(go),'list','-deps','-json','./src'],cwd=root,env=env).decode('utf-8');decoder=json.JSONDecoder();modules={};offset=0
while offset<len(raw):
    while offset<len(raw) and raw[offset].isspace():offset+=1
    if offset==len(raw):break
    package,end=decoder.raw_decode(raw,offset);offset=end;module=package.get('Module')
    if module and not module.get('Main'):
        actual=module.get('Replace',module)
        if 'Dir' in actual:modules[(module['Path'],module.get('Version','local'))]=pathlib.Path(actual['Dir'])
goroot=pathlib.Path(subprocess.check_output([str(go),'env','GOROOT'],env=env).decode().strip())
items=[('IKEMEN GO / fiiight browser port',root/'LICENCE.txt'),('Go runtime',goroot/'LICENSE')]
missing=[]
for (name,version),directory in sorted(modules.items()):
    candidates=[p for p in directory.iterdir() if p.is_file() and p.name.upper().startswith(('LICENSE','LICENCE','COPYING','NOTICE','UNLICENSE'))]
    if not candidates:missing.append(name)
    for candidate in sorted(candidates):items.append((name+' '+version+' / '+candidate.name,candidate))
if missing:raise SystemExit('Missing dependency notices: '+', '.join(missing))
out.write_text('\n\n'.join('===== '+label+' =====\n\n'+file.read_text(encoding='utf-8',errors='replace') for label,file in items),encoding='utf-8')
print('Collected '+str(len(items))+' notices from '+str(len(modules))+' linked dependency modules plus engine and Go')
