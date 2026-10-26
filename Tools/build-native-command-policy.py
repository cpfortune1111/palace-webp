"""Build private commandUpdate policy probes; no full CharList scheduler certification."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess

cli = argparse.ArgumentParser(description=__doc__)
for key in ('char', 'go', 'output'):cli.add_argument('--' + key, type=Path, required=True)
args = cli.parse_args()
data = args.char.read_bytes()
pin = '7f8839374168cf5948d190268e6bdad73c61dac4febadb015cd501d46a579bf7'
assert hashlib.sha256(data).hexdigest() == pin, 'Unpinned char.go'
source = data.decode('utf-8');begin = source.index('func (cl *CharList) commandUpdate()')
active_start = source.index('\t\t\tact := true', begin)
active_end = source.index('\n\t\t\t// Auto turning check', active_start)
flags_start = source.index('\t\t\t\thpbuf := false', active_end)
flags_end = source.index('\n\t\t\t\t// Update commands', flags_start)
extra_start = source.index('\t\t\t\t\textratime :=', flags_end)
extra_end = source.index('\n\t\t\t\t\tc.cmd[i].Step(', extra_start)
blocks = [source[active_start:active_end], source[flags_start:flags_end], source[extra_start:extra_end]]
out = args.output.resolve();out.mkdir(parents=True, exist_ok=True)
environment = {**os.environ, 'GOENV': 'off', 'GOTOOLCHAIN': 'local', 'GO111MODULE': 'off', 'GOPROXY': 'off', 'GOSUMDB': 'off', 'CGO_ENABLED': '0', 'GOCACHE': str(out / 'cache'), 'GOPATH': str(out / 'gopath')}
go = args.go.resolve();version = subprocess.check_output([str(go), 'version'], env=environment, text=True).strip()
assert version.startswith('go version go1.27.3 '), version
wrapper = '''package main
import("encoding/json";"os")
type request struct{HitPause bool;PauseOnHitPause float32;SuperTime,PauseTime,SuperMoveTime,PauseMoveTime,SuperEndBuffer,PauseEndBuffer int32;Ikemen [3]int;Mugen [2]int;Helper bool}
type result struct{Active,HitPause,PauseEnd,HelperRestricted bool;Extra int32}
type fixtureInfo struct{constants map[string]float32;ikemenver [3]int;mugenver [2]int}
type fixtureChar struct{info fixtureInfo;hit bool;superMovetime,pauseMovetime int32;helperIndex int}
func(c *fixtureChar)gi()*fixtureInfo{return &c.info}
func(c *fixtureChar)stWgi()*fixtureInfo{return &c.info}
func(c *fixtureChar)hitPause()bool{return c.hit}
func Btoi(v bool)int32{if v{return 1};return 0}
func evaluate(v request)result{
 c:=&fixtureChar{info:fixtureInfo{map[string]float32{"input.pauseonhitpause":v.PauseOnHitPause},v.Ikemen,v.Mugen},hit:v.HitPause,superMovetime:v.SuperMoveTime,pauseMovetime:v.PauseMoveTime};if v.Helper{c.helperIndex=1}
 sys:=struct{supertime,pausetime,superendcmdbuftime,pauseendcmdbuftime int32}{v.SuperTime,v.PauseTime,v.SuperEndBuffer,v.PauseEndBuffer}
''' + '\n'.join(blocks) + '''
 return result{act,hpbuf,pausebuf,helperbug,extratime}
}
func main(){var input []request;if err:=json.NewDecoder(os.Stdin).Decode(&input);err!=nil{panic(err)};out:=make([]result,len(input));for i,v:=range input{out[i]=evaluate(v)};if err:=json.NewEncoder(os.Stdout).Encode(out);err!=nil{panic(err)}}
'''
code = out / 'command-policy.go';code.write_text(wrapper, encoding='utf-8')
executable = out / ('command-policy.exe' if os.name == 'nt' else 'command-policy')
subprocess.run([str(go), 'build', '-trimpath', '-o', str(executable), str(code)], env=environment, cwd=out, check=True, timeout=180)
receipt = {'commit': 'cb56d73badb322f3725257c2e8cfd157b2c3989d', 'sourceSha256': pin, 'compiler': version,
           'blockSha256': [hashlib.sha256(block.encode()).hexdigest() for block in blocks], 'executable': str(executable),
           'executableSha256': hashlib.sha256(executable.read_bytes()).hexdigest(),
           'scope': 'Three unchanged commandUpdate policy blocks; fixture-provided native timers, allowances, source version and own constant. Not a full CharList scheduler or pause arbitration reference.'}
(out / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
print('PASS built pinned commandUpdate policy reference from three unchanged statement blocks')
