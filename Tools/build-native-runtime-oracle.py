"""Build scoped RNG/tick/order probes from unchanged pinned native declarations.

Generated native source and executable belong in private outputs, never the repo.
Action callbacks are trace facades, not native state/combat execution.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess

from reference_go_scan import declaration, matching_delimiter

COMMIT = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
PINS = {'common': 'd7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6',
        'system': 'b1784a92a937f5c940e7a99fc5025f807af497a23bc447c861c276bdbb51bf77',
        'char': '7f8839374168cf5948d190268e6bdad73c61dac4febadb015cd501d46a579bf7'}
cli = argparse.ArgumentParser(description=__doc__)
for name in ('common', 'system', 'char', 'go', 'output'):
    cli.add_argument('--' + name, required=True, type=Path)
args = cli.parse_args()
sources = {}
for name, pin in PINS.items():
    data = getattr(args, name).read_bytes()
    if hashlib.sha256(data).hexdigest() != pin:
        raise ValueError('Unpinned source: ' + name)
    sources[name] = data.decode('utf-8')
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=True)
environment = {**os.environ, 'GOENV': 'off', 'GOTOOLCHAIN': 'local', 'GO111MODULE': 'off',
               'GOPROXY': 'off', 'GOSUMDB': 'off', 'CGO_ENABLED': '0',
               'GOCACHE': str(out / 'cache'), 'GOPATH': str(out / 'gopath')}
go = args.go.resolve()
version = subprocess.check_output([str(go), 'version'], env=environment, text=True).strip()
if not version.startswith('go version go1.27.3 '):
    raise ValueError('Expected pinned Go 1.27.3')
selected = []
for name, markers in {
    'common': ['func Random(', 'func Srand(', 'func Rand(', 'func RandF32(', 'func RandI(', 'func RandF(', 'func Btoi(', 'func Clamp['],
    'system': ['func (s *System) tickFrame(', 'func (s *System) tickNextFrame(', 'func (s *System) tickInterpolation('],
    'char': ['func (cl *CharList) updateRunOrder(', 'func (cl *CharList) action('],
}.items():
    for marker in markers:
        row = declaration(sources[name], marker)
        selected.append({'source': name, 'marker': marker, 'line': row['line'], 'text': row['text'],
                         'sha256': hashlib.sha256(row['text'].encode()).hexdigest()})
common = sources['common']
start = common.index('const (')
opening = common.index('(', start)
constants = common[start:matching_delimiter(common, opening, '(', ')')]
wrapper = r'''package main
import("encoding/json";"fmt";"math";"os";"sort")
type settings struct{Config struct{TickInterpolation bool}}
type System struct{randseed int32;paused,frameStepFlag bool;oldTickCount,tickCount int;tickCountF,nextAddTime,lastTick float32;cfg settings}
var sys=&System{}
type actorSpec struct{ID int32;Helper bool;Move string;First,Last bool;Spawn []actorSpec}
type moveType int
const(MT_I moveType=iota;MT_A;MT_H)
const(ASF_runfirst uint32=1<<iota;ASF_runlast)
type stateSpec struct{moveType moveType}
type Char struct{id int32;helperIndex int;ss stateSpec;flags uint32;spawn []actorSpec;list *CharList}
func(c *Char)asf(flag uint32)bool{return c.flags&flag!=0}
func(c *Char)unsetASF(flag uint32){c.flags &^= flag}
type CharList struct{runOrder []*Char;trace []string}
func(cl *CharList)commandUpdate(){cl.trace=append(cl.trace,"commands")}
func(c *Char)actionPrepare(){c.list.trace=append(c.list.trace,fmt.Sprintf("prepare:%d",c.id))}
func(c *Char)actionRun(){c.list.trace=append(c.list.trace,fmt.Sprintf("run:%d",c.id));for _,spec:=range c.spawn{c.list.runOrder=append(c.list.runOrder,makeChar(spec,c.list))};c.spawn=nil}
func(c *Char)actionFinish(){c.list.trace=append(c.list.trace,fmt.Sprintf("finish:%d",c.id))}
func makeChar(spec actorSpec,list *CharList)*Char{c:=&Char{id:spec.ID,list:list,spawn:spec.Spawn};if spec.Helper{c.helperIndex=1};switch spec.Move{case "I":c.ss.moveType=MT_I;case "A":c.ss.moveType=MT_A;case "H":c.ss.moveType=MT_H;default:panic("invalid move label")};if spec.First{c.flags|=ASF_runfirst};if spec.Last{c.flags|=ASF_runlast};return c}
type operation struct{Mode string;Low,High int32;FloatLow,FloatHigh float32}
type request struct{Kind string;Seed int32;Operations []operation;Paused,FrameStep,Interpolate bool;OldTick,Tick int;TickFloat,NextAdd,LastTick float32;Actors []actorSpec;Rounds int}
type rngResult struct{Integer int32;FloatBits uint32;State int32}
type response struct{Values []rngResult;TickFrame,TickNext bool;InterpolationBits uint32;Trace []string;Order []int32;Flags []uint32;Panic string}
func evaluate(v request)(r response){defer func(){if x:=recover();x!=nil{r.Panic=fmt.Sprint(x)}}();switch v.Kind{
case "rng":Srand(v.Seed);for _,op:=range v.Operations{one:=rngResult{};switch op.Mode{case "next":one.Integer=Random();case "integer":one.Integer=RandI(op.Low,op.High);case "float":one.FloatBits=math.Float32bits(RandF(op.FloatLow,op.FloatHigh));case "float32":one.FloatBits=math.Float32bits(RandF32(op.FloatLow,op.FloatHigh));default:panic("invalid random operation")};one.State=sys.randseed;r.Values=append(r.Values,one)}
case "tick":sys=&System{paused:v.Paused,frameStepFlag:v.FrameStep,oldTickCount:v.OldTick,tickCount:v.Tick,tickCountF:v.TickFloat,nextAddTime:v.NextAdd,lastTick:v.LastTick};sys.cfg.Config.TickInterpolation=v.Interpolate;r.TickFrame=sys.tickFrame();r.TickNext=sys.tickNextFrame();r.InterpolationBits=math.Float32bits(sys.tickInterpolation())
case "order":if len(v.Actors)>64||v.Rounds<1||v.Rounds>4{panic("order fixture limit")};cl:=&CharList{};for _,spec:=range v.Actors{cl.runOrder=append(cl.runOrder,makeChar(spec,cl))};for n:=0;n<v.Rounds;n++{cl.action();if len(cl.runOrder)>128{panic("spawn fixture limit")}};r.Trace=cl.trace;for _,c:=range cl.runOrder{r.Order=append(r.Order,c.id);r.Flags=append(r.Flags,c.flags)}
default:panic("unknown runtime component")};return}
func main(){var input []request;if err:=json.NewDecoder(os.Stdin).Decode(&input);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)};result:=make([]response,len(input));for i,v:=range input{result[i]=evaluate(v)};if err:=json.NewEncoder(os.Stdout).Encode(result);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)}}
'''
generated = wrapper + '\n' + constants + '\n' + '\n\n'.join(row['text'] for row in selected)
source_file = out / 'runtime-oracle.go'
source_file.write_text(generated, encoding='utf-8')
executable = out / ('native-runtime-oracle.exe' if os.name == 'nt' else 'native-runtime-oracle')
subprocess.run([str(go), 'build', '-trimpath', '-o', str(executable), str(source_file)], env=environment, cwd=out, check=True, timeout=180)
receipt = {'commit': COMMIT, 'compiler': version, 'sourcePins': PINS,
           'functions': [{k: v for k, v in row.items() if k != 'text'} for row in selected],
           'generatedSourceSha256': hashlib.sha256(source_file.read_bytes()).hexdigest(),
           'executableSha256': hashlib.sha256(executable.read_bytes()).hexdigest(), 'executable': str(executable),
           'scope': 'Exact RNG/tick gate/order/action-loop function bodies with primitive System fields and traced character callbacks. Not full native states, commands, spawn allocator, combat, tick scheduler or MUGEN executable certification.',
           'facades': ['Primitive System field/config subset', 'Character move/flag label adapter', 'Command/prepare/run/finish trace callbacks', 'Fixture-only helper appends']}
(out / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
print('PASS built private runtime component oracle with ' + str(len(selected)) + ' unchanged declarations')
