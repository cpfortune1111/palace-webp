import pathlib, sys, zipfile, shutil, io, math, struct, wave, gzip, hashlib, json
here=pathlib.Path(__file__).resolve().parent;out=pathlib.Path(sys.argv[1]).resolve()
shutil.copyfile(here/'smoke.html',out/'index.html')
with zipfile.ZipFile(out/'smoke-content.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
    for name,target in [('config.ini','config.ini'),('smoke.lua','data/smoke.lua')]:
        info=zipfile.ZipInfo(target,date_time=(2026,10,27,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,(here/'smoke'/name).read_bytes())
    audio=io.BytesIO()
    with wave.open(audio,'wb') as wav:
        wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(22050)
        wav.writeframes(b''.join(struct.pack('<h',int(1600*math.sin(2*math.pi*440*n/22050))) for n in range(22050)))
    info=zipfile.ZipInfo('data/tone.wav',date_time=(2026,10,27,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,audio.getvalue())
wasm=(out/'ikemen.wasm').read_bytes();(out/'ikemen.wasm.gz').write_bytes(gzip.compress(wasm,compresslevel=9,mtime=0))
receipt={name:{'bytes':(out/name).stat().st_size,'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()} for name in ['ikemen.wasm','ikemen.wasm.gz','wasm_exec.js','fs-shim.js','smoke-content.zip']}
(out/'artifact-hashes.json').write_text(json.dumps(receipt,indent=2))
print('Packaged authored smoke fixture; no character or demo assets')
