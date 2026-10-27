"""Record source preservation, reproducibility and browser smoke evidence."""
import hashlib, json, pathlib, sys
sources,integrated,build,repeat,results=map(lambda p:pathlib.Path(p).resolve(),sys.argv[1:])
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(build/'ikemen.wasm')==sha(repeat/'ikemen.wasm'),'Non-reproducible WASM'
native=sources/'ikemen-native'
core=['anim.go','bytecode.go','char.go','compiler.go','compiler_functions.go','controllers.go','fightscreen.go','model.go','stage.go','state.go','stats.go','script.go']
preserved=[]
for name in core:
    original=native/'src'/name
    if not original.exists():continue
    assert original.read_bytes()==(integrated/'src'/name).read_bytes(),name
    preserved.append(name)
test=json.loads((results/'wasm-integrated-smoke-results.json').read_text(encoding='utf-8'));state=test['state']
for marker in ['PALACE_TICK:180','PALACE_P1_A','PALACE_P2_A']:assert any(marker in x for x in state['log']),marker
assert not test['errors'] and not state.get('failure') and 'exit' not in state
assert state['audio']['state']=='running' and state['audio']['peak']>0
report=dict(date='2026-10-27',nativeCommit='81c6da71d689625e20db79586815b695da00dd6d',browserCommit='716cc944a6f19bf845e08595a1c9b7b5f8f8525b',mergeBase='05b7d98af690c73c7bffe5cb4f4eeb6933fa2703',go='1.27.3',target='js/wasm',goexperiment='arenas',reproducibleFreshIntegrations=True,wasmSha256=sha(build/'ikemen.wasm'),wasmBytes=(build/'ikemen.wasm').stat().st_size,gzipBytes=(build/'ikemen.wasm.gz').stat().st_size,officialCoreFilesUnchanged=preserved,browserTest=dict(browser='Microsoft Edge 156 (headless SwiftShader)',webgl2=True,uiTicks=180,p1AndP2Keyboard=True,audioNonzeroSamples=True,pageErrors=0),liveRuntimeChanged=False,characterBattleVerified=False,originalCharacterAssetsPublished=False,encryptionImplemented=False,hostUiBridgeImplemented=False,limitations=['WebGL2 model shadows unavailable','Raw TCP/UDP browser netplay unavailable','Video scaling modes other than None not implemented by port','HTML video volume uses linear approximation','No real-device performance or touch-bridge qualification yet'])
path=pathlib.Path(__file__).with_name('build-report.json');path.write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
