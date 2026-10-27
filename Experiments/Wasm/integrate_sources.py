"""Apply the fixed browser port as a three-way merge onto official v1.0.0."""
import argparse, hashlib, io, json, pathlib, subprocess, urllib.request, zipfile
BASE = '05b7d98af690c73c7bffe5cb4f4eeb6933fa2703'

def main():
    p=argparse.ArgumentParser();p.add_argument('--sources',required=True);p.add_argument('--destination',required=True);a=p.parse_args()
    source=pathlib.Path(a.sources).resolve();dest=pathlib.Path(a.destination).resolve()
    site=pathlib.Path(__file__).resolve().parents[2]
    if dest==site or site in dest.parents:p.error('Keep native sources outside the published site')
    if dest.exists() and any(dest.iterdir()):p.error('Destination must be empty')
    lock=json.loads(pathlib.Path(__file__).with_name('source-lock.json').read_text())
    for snapshot in lock['sources']:
        for entry in snapshot['files']:
            b=(source/snapshot['name']/entry['path']).read_bytes()
            if hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()!=entry['sha']:raise ValueError('Locked source changed: '+entry['path'])
    native=source/'ikemen-native';port=source/'fiiight-browser'
    archive=zipfile.ZipFile(io.BytesIO(urllib.request.urlopen('https://codeload.github.com/ikemen-engine/Ikemen-GO/zip/'+BASE,timeout=180).read()))
    prefix=archive.namelist()[0];base={x[len(prefix):]:archive.read(x).replace(b'\r\n',b'\n') for x in archive.namelist() if not x.endswith('/')}
    native_files={x.relative_to(native).as_posix():x.read_bytes() for x in native.rglob('*') if x.is_file()}
    port_files={x.relative_to(port).as_posix():x.read_bytes() for x in port.rglob('*') if x.is_file()}
    result=dict(native_files);rows=[];conflicts=[]
    native_only={'src/compiler_functions.go','src/state.go','src/stats.go'}
    scratch=dest.parent/(dest.name+'-merge-input');scratch.mkdir(parents=True,exist_ok=True)
    for name in sorted(set(base)|set(port_files)):
        old=base.get(name);web=port_files.get(name)
        if old==web:continue
        # Only engine/runtime/build/dependency patches; never import demo assets.
        if not (name.startswith(('src/','build/wasm/','third_party/')) or name in ('go.mod','go.sum')):continue
        if name in native_only:continue
        upstream=native_files.get(name)
        if upstream==old or upstream==web or old is None:
            merged=web;status='applied'
        elif web is None:
            conflicts.append(name);continue
        else:
            for n,b in [('native',upstream or b''),('base',old),('port',web)]: (scratch/n).write_bytes(b)
            run=subprocess.run(['git','merge-file','-p',str(scratch/'native'),str(scratch/'base'),str(scratch/'port')],capture_output=True)
            merged=run.stdout;status='conflict' if run.returncode else 'merged'
            if run.returncode and name in ('src/music.go','src/system.go'):
                import re
                merged=re.sub(rb'^<<<<<<<[^\n]*\n(.*?)^=======\n.*?^>>>>>>>[^\n]*\n',lambda m:m.group(1),merged,flags=re.M|re.S)
                status='resolved-official-hunks'
            elif run.returncode:conflicts.append(name)
        if merged is None:result.pop(name,None)
        else:result[name]=merged
        rows.append(dict(path=name,status=status))
    for name,content in result.items():
        target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(content)
    receipt=dict(base=BASE,native='81c6da71d689625e20db79586815b695da00dd6d',browser='716cc944a6f19bf845e08595a1c9b7b5f8f8525b',changes=rows,conflicts=conflicts)
    (dest.parent/(dest.name+'-merge.json')).write_text(json.dumps(receipt,indent=2))
    print(json.dumps(receipt,indent=2))
    if conflicts:raise SystemExit('Resolve source conflicts before compiling')

if __name__=='__main__':main()
