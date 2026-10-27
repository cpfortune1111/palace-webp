"""Package the derivative-media engine; native checkout and raw media stay private."""
import gzip,hashlib,json,pathlib,shutil,sys
build=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2])
out.mkdir(parents=True,exist_ok=True)
raw=(build/'ikemen.wasm').read_bytes()
(out/'ikemen.wasm.gz').write_bytes(gzip.compress(raw,compresslevel=9,mtime=0))
for name in ['wasm_exec.js','fs-shim.js','LICENCE.txt','THIRD-PARTY-NOTICES.txt']:
    shutil.copyfile(build/name,out/name)
hashes={'ikemen.wasm':{'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}}
for source in out.iterdir():
    if source.is_file() and source.name!='artifact-hashes.json':
        data=source.read_bytes();hashes[source.name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
(out/'artifact-hashes.json').write_text(json.dumps(hashes,indent=2))
print('Packaged compressed host engine with integrity hashes and dependency notices')
