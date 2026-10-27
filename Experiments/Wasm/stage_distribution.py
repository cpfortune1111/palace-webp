"""Stage only engine binaries, notices, and the authored smoke fixture."""
import json, hashlib, pathlib, shutil, sys
source=pathlib.Path(sys.argv[1]).resolve();dest=pathlib.Path(__file__).with_name('Dist')
allowed=['index.html','ikemen.wasm.gz','wasm_exec.js','fs-shim.js','smoke-content.zip','artifact-hashes.json','LICENCE.txt','THIRD-PARTY-NOTICES.txt']
hashes=json.loads((source/'artifact-hashes.json').read_text())
for name in ['ikemen.wasm','ikemen.wasm.gz','wasm_exec.js','fs-shim.js','smoke-content.zip']:
    data=(source/name).read_bytes()
    if hashlib.sha256(data).hexdigest()!=hashes[name]['sha256']:raise ValueError(name)
dest.mkdir(parents=True,exist_ok=True)
for name in allowed:shutil.copyfile(source/name,dest/name)
print('Staged '+str(len(allowed))+' whitelisted distribution files')
