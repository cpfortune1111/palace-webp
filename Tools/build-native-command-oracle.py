"""Build private command references from pinned source bodies and an optional compiler block.

Physical hardware/SOCD and full-engine compilation/scheduling are excluded.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
from reference_go_scan import declaration, matching_delimiter

PINS = {'input': 'c5f02ca16464c98a052fee9c453729638b3fab31c6d6ace6ba4e92a96985d94b',
        'common': 'd7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6'}
cli = argparse.ArgumentParser(description=__doc__)
for name in ('input', 'common', 'go', 'output'):
    cli.add_argument('--' + name, type=Path, required=True)
cli.add_argument('--with-lists', action='store_true', help='Also compile native list and legacy transforms; logging is captured by a fixture facade')
cli.add_argument('--compiler', type=Path, help='Pinned compiler.go, required for --with-files')
cli.add_argument('--with-files', action='store_true', help='Compile original CMD section-reading block with native INI functions')
args = cli.parse_args()
if args.with_files:
    args.with_lists = True
    if not args.compiler:cli.error('--with-files requires --compiler')
sources = {}
for name, pin in PINS.items():
    data = getattr(args, name).read_bytes()
    if hashlib.sha256(data).hexdigest() != pin:raise ValueError('Unpinned source: ' + name)
    sources[name] = data.decode('utf-8')
out = args.output.resolve();out.mkdir(parents=True, exist_ok=True)
environment = {**os.environ, 'GOENV': 'off', 'GOTOOLCHAIN': 'local', 'GO111MODULE': 'off', 'GOPROXY': 'off',
               'GOSUMDB': 'off', 'CGO_ENABLED': '0', 'GOCACHE': str(out / 'cache'), 'GOPATH': str(out / 'gopath')}
go = args.go.resolve()
version = subprocess.check_output([str(go), 'version'], env=environment, text=True).strip()
if not version.startswith('go version go1.27.3 '):raise ValueError('Expected pinned Go 1.27.3')
selected = []
for name, markers in {
    'input': ['type CommandStepKey struct ', 'type CommandStep struct ', 'type Command struct ',
              'type CommandKeyRemap struct ', 'type InputBuffer struct ',
              'func (ck CommandStepKey) IsDirectionPress(', 'func (ck CommandStepKey) IsDirectionRelease(',
              'func (ck CommandStepKey) IsButtonPress(', 'func (ck CommandStepKey) IsButtonRelease(',
              'func (cs *CommandStep) IsSingleDirection(', 'func (cs *CommandStep) IsDirToButton(',
              'func (cs CommandStep) EqualSteps(', 'func newCommand(', 'func NewCommandKeyRemap(',
              'func (c *Command) ReadCommandSymbols(', 'func (c *Command) AutoGreaterExpand(',
              'func (c *Command) GreaterCheckFail(', 'func (c *Command) Clear(', 'func (c *Command) Step(',
              'func (ib *InputBuffer) updateInputTime(', 'func (__ *InputBuffer) State(', 'func (ib *InputBuffer) StateCharge('],
    'common': ['func Min[', 'func Max[', 'func Abs['],
}.items():
    for marker in markers:
        row = declaration(sources[name], marker)
        selected.append({'source': name, 'marker': marker, 'line': row['line'], 'text': row['text'],
                         'sha256': hashlib.sha256(row['text'].encode()).hexdigest()})
if args.with_lists:
    for marker in ['type CommandList struct ', 'func NewCommandList(', 'func (cl *CommandList) Add(',
                   'func (cl *CommandList) Assert(', 'func (cl *CommandList) ClearName(',
                   'func (cl *CommandList) Step(', 'func (cl *CommandList) Get(', 'func (cl *CommandList) At(',
                   'func (cl *CommandList) GetState(', 'func (c *Command) ApplyBackwardCompatibility(']:
        row = declaration(sources['input'], marker)
        selected.append({'source': 'input', 'marker': marker, 'line': row['line'], 'text': row['text'],
                         'sha256': hashlib.sha256(row['text'].encode()).hexdigest()})
compiler_block = None
if args.with_files:
    compiler_data = args.compiler.read_bytes()
    compiler_pin = 'e027f39df8f86d3ea9b7c422237f4c1525795d70eb1365b136e9a31c75bcd9f8'
    if hashlib.sha256(compiler_data).hexdigest() != compiler_pin:raise ValueError('Unpinned compiler')
    compiler_text = compiler_data.decode('utf-8')
    block_start = compiler_text.index('\tremap, defaults, ckr := true, true, NewCommandKeyRemap()')
    block_end = compiler_text.index('\n\t// Reset string pool', block_start)
    compiler_block = compiler_text[block_start:block_end]
    PINS['compiler'] = compiler_pin
    alias = 'type IniSection map[string]string'
    selected.append({'source': 'common', 'marker': alias, 'line': sources['common'][:sources['common'].index(alias)].count('\n') + 1,
                     'text': alias, 'sha256': hashlib.sha256(alias.encode()).hexdigest()})
    for marker in ['func NewIniSection(', 'func ReadIniSection(',
                   'func (is IniSection) Parse(', 'func (is IniSection) ReadI32(',
                   'func (is IniSection) ReadBool(', 'func (is IniSection) getText(',
                   'func Atoi(', 'func SplitAndTrim(', 'func SectionName(']:
        row = declaration(sources['common'], marker)
        selected.append({'source': 'common', 'marker': marker, 'line': row['line'], 'text': row['text'],
                         'sha256': hashlib.sha256(row['text'].encode()).hexdigest()})
source = sources['input'];start = source.index('type CommandKey byte')
opening = source.index('(', source.index('const (', start))
enum = source[start:matching_delimiter(source, opening, '(', ')')]
wrapper = r'''package main
import("encoding/json";"fmt";"math";"os";"strings")
type InputReader struct{}
func Error(value string)error{return fmt.Errorf("%s",value)}
var labels=[]string{"U","D","B","F","L","R","UB","UF","DB","DF","UL","UR","DL","DR","N","a","b","c","x","y","z","s","d","w","m"}
func keyLabel(key CommandKey)string{if int(key)>=len(labels){return "?"};return labels[key]}
func findKey(label string)CommandKey{for i,name:=range labels{if label==name{return CommandKey(i)}};panic("invalid fixture key "+label)}
type frameRequest struct{Held []string;Facing int;AI,Helper,HitPause,PauseEnd bool;Extra int32;Queries []string}
type request struct{Command string;Time,StepTime,Buffer int32;AutoGreater,BufferHitPause,BufferPauseEnd bool;Remap map[string]string;Frames []frameRequest}
type keyResult struct{Key string;Hold,Release,Fourway bool;Charge int32}
type stepResult struct{Keys []keyResult;Greater,Or bool}
type tickResult struct{Complete bool;Buffer,Time int32;Completed []bool;Timers []int32;States map[string]int32}
type response struct{Error,Panic string;Steps []stepResult;Order []int;Ticks []tickResult}
func evaluate(v request)(r response){defer func(){if x:=recover();x!=nil{r.Panic=fmt.Sprint(x)}}();c:=newCommand();c.maxtime=v.Time;c.maxsteptime=v.StepTime;c.maxbuftime=v.Buffer;c.autogreater=v.AutoGreater;c.buffer_hitpause=v.BufferHitPause;c.buffer_pauseend=v.BufferPauseEnd;remap:=NewCommandKeyRemap();for from,to:=range v.Remap{key:=findKey(to);switch from{case "a":remap.a=key;case "b":remap.b=key;case "c":remap.c=key;case "x":remap.x=key;case "y":remap.y=key;case "z":remap.z=key;case "s":remap.s=key;case "d":remap.d=key;case "w":remap.w=key;case "m":remap.m=key;default:panic("invalid fixture remap")}}
 if err:=c.ReadCommandSymbols(v.Command,remap);err!=nil{r.Error=err.Error()};r.Order=append([]int{},c.loopOrder...);for _,step:=range c.steps{out:=stepResult{Greater:step.greater,Or:step.orLogic};for _,key:=range step.keys{out.Keys=append(out.Keys,keyResult{Key:keyLabel(key.key),Hold:key.slash,Release:key.tilde,Fourway:key.dollar,Charge:key.chargetime})};r.Steps=append(r.Steps,out)}
 if r.Error!=""{return};if len(v.Frames)>10000{panic("fixture frame limit")};buffer:=&InputBuffer{}
 for _,frame:=range v.Frames{held:=map[string]bool{};for _,name:=range frame.Held{held[name]=true};left,right:=held["L"],held["R"];back,forward:=left,right;if frame.Facing<0{back,forward=right,left};buffer.updateInputTime(held["U"],held["D"],left,right,back,forward,held["a"],held["b"],held["c"],held["x"],held["y"],held["z"],held["s"],held["d"],held["w"],held["m"]);c.Step(buffer,frame.AI,frame.Helper,frame.HitPause,frame.PauseEnd,frame.Extra);tick:=tickResult{Complete:c.completeframe,Buffer:c.curbuftime,Time:c.curtime,Completed:append([]bool{},c.completed...),Timers:append([]int32{},c.stepTimers...),States:map[string]int32{}};for _,query:=range frame.Queries{q:=newCommand();if err:=q.ReadCommandSymbols(query,NewCommandKeyRemap());err!=nil||len(q.steps)!=1||len(q.steps[0].keys)!=1{panic("invalid state query")};tick.States[query]=buffer.State(q.steps[0].keys[0]);tick.States[query+":charge"]=buffer.StateCharge(q.steps[0].keys[0])};r.Ticks=append(r.Ticks,tick)};return}
func main(){var input []request;if err:=json.NewDecoder(os.Stdin).Decode(&input);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)};result:=make([]response,len(input));for i,v:=range input{result[i]=evaluate(v)};if err:=json.NewEncoder(os.Stdout).Encode(result);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)}}
'''
if args.with_lists:
    wrapper = wrapper.replace('type request struct{Command string;', 'type request struct{Commands []listCommandRequest;Command string;')
    wrapper = wrapper.replace('type frameRequest struct{Held []string;', 'type frameRequest struct{Assertions []assertRequest;ClearNames []string;Held []string;')
    wrapper = wrapper.replace('type response struct{Error,Panic string;', 'type response struct{ListTicks []listTickResult;Error,Panic string;')
    wrapper = wrapper.replace('c:=newCommand();c.maxtime=v.Time;', 'if len(v.Commands)>0{return evaluateList(v)};c:=newCommand();c.maxtime=v.Time;')
    wrapper += r'''
type fixtureSystem struct{}
func (fixtureSystem) appendToConsole(string){}
var sys fixtureSystem
func LogMessage(string){}
type assertRequest struct{Name string;Time int32}
type listCommandRequest struct{Name string;Definition request;Shared,Legacy bool}
type listCommandResult struct{Name string;Complete bool;Buffer,Time,MaxBuffer int32;Completed []bool;Timers []int32;Steps []stepResult}
type listTickResult struct{Commands []listCommandResult;Assertions []bool;Active map[string]bool}
func evaluateList(v request)(r response){
 buffer:=&InputBuffer{};list:=NewCommandList(buffer)
 for _,entry:=range v.Commands{d:=entry.Definition;c:=newCommand();c.name=entry.Name;c.maxtime=d.Time;c.maxsteptime=d.StepTime;c.maxbuftime=d.Buffer;c.autogreater=d.AutoGreater;c.buffer_hitpause=d.BufferHitPause;c.buffer_pauseend=d.BufferPauseEnd;c.buffer_shared=entry.Shared;if err:=c.ReadCommandSymbols(d.Command,NewCommandKeyRemap());err!=nil{r.Error=err.Error();return};if entry.Legacy{c.ApplyBackwardCompatibility("fixture")};list.Add(*c)}
 for _,frame:=range v.Frames{held:=map[string]bool{};for _,name:=range frame.Held{held[name]=true};left,right:=held["L"],held["R"];back,forward:=left,right;if frame.Facing<0{back,forward=right,left};buffer.updateInputTime(held["U"],held["D"],left,right,back,forward,held["a"],held["b"],held["c"],held["x"],held["y"],held["z"],held["s"],held["d"],held["w"],held["m"]);tick:=listTickResult{Assertions:[]bool{},Active:map[string]bool{}};for _,a:=range frame.Assertions{tick.Assertions=append(tick.Assertions,list.Assert(a.Name,a.Time))};for _,name:=range frame.ClearNames{list.ClearName(name)};list.Step(frame.AI,frame.Helper,frame.HitPause,frame.PauseEnd,frame.Extra);for _,group:=range list.Commands{for _,c:=range group{out:=listCommandResult{Name:c.name,Complete:c.completeframe,Buffer:c.curbuftime,Time:c.curtime,MaxBuffer:c.maxbuftime,Completed:append([]bool{},c.completed...),Timers:append([]int32{},c.stepTimers...),Steps:[]stepResult{}};for _,step:=range c.steps{s:=stepResult{Greater:step.greater,Or:step.orLogic};for _,k:=range step.keys{s.Keys=append(s.Keys,keyResult{Key:keyLabel(k.key),Hold:k.slash,Release:k.tilde,Fourway:k.dollar,Charge:k.chargetime})};out.Steps=append(out.Steps,s)};tick.Commands=append(tick.Commands,out);tick.Active[c.name]=list.GetState(c.name)}};r.ListTicks=append(r.ListTicks,tick)};return
}
'''
if args.with_files:
    wrapper = wrapper.replace('type fixtureSystem struct{}', 'type fixtureSystem struct{ignoreMostErrors bool}')
    wrapper = wrapper.replace('func LogMessage(string){}', 'func LogMessage(string,...any){}')
    wrapper = wrapper.replace('type request struct{Commands ', 'type request struct{FileText *string;Version [3]int;IgnoreErrors bool;Commands ')
    wrapper = wrapper.replace('type response struct{ListTicks ', 'type response struct{File *fileResult;ListTicks ')
    wrapper = wrapper.replace('if len(v.Commands)>0{return evaluateList(v)};', 'if v.FileText!=nil{r.File=evaluateFile(*v.FileText,v.Version,v.IgnoreErrors);return};if len(v.Commands)>0{return evaluateList(v)};')
    wrapper += '''
const IMax int32=2147483647
const IErr int32=-2147483648
type fixtureCompiler struct{cmdl *CommandList}
type fileCommand struct{Name string;Time,StepTime,Buffer int32;AutoGreater,HitPause,PauseEnd,Shared bool;Steps []stepResult;Order []int}
type fileResult struct{Error string;Commands []fileCommand;Defaults map[string]any}
func compileFile(str string,version [3]int,ignore bool)(*CommandList,error){
 lines,lnidx:=SplitAndTrim(str,"\\n"),0;c:=&fixtureCompiler{NewCommandList(&InputBuffer{})};gi:=struct{ikemenver [3]int;name string}{version,"fixture"};cmd:="fixture.cmd";sys.ignoreMostErrors=ignore
''' + compiler_block + '''
 return c.cmdl,nil
}
func evaluateFile(text string,version [3]int,ignore bool)*fileResult{
 r:=&fileResult{Commands:[]fileCommand{}};list,err:=compileFile(text,version,ignore);if err!=nil{r.Error=err.Error();return r};r.Defaults=map[string]any{"time":list.DefaultTime,"stepTime":list.DefaultStepTime,"autoGreater":list.DefaultAutoGreater,"bufferTime":list.DefaultBufferTime,"bufferHitPause":list.DefaultBufferHitpause,"bufferPauseEnd":list.DefaultBufferPauseEnd,"bufferShared":list.DefaultBufferShared};for _,group:=range list.Commands{for _,c:=range group{out:=fileCommand{Name:c.name,Time:c.maxtime,StepTime:c.maxsteptime,Buffer:c.maxbuftime,AutoGreater:c.autogreater,HitPause:c.buffer_hitpause,PauseEnd:c.buffer_pauseend,Shared:c.buffer_shared,Steps:[]stepResult{},Order:append([]int{},c.loopOrder...)};for _,step:=range c.steps{s:=stepResult{Greater:step.greater,Or:step.orLogic};for _,k:=range step.keys{s.Keys=append(s.Keys,keyResult{Key:keyLabel(k.key),Hold:k.slash,Release:k.tilde,Fourway:k.dollar,Charge:k.chargetime})};out.Steps=append(out.Steps,s)};r.Commands=append(r.Commands,out)}};return r
}
'''
source_file = out / 'command-oracle.go'
source_file.write_text(wrapper + '\n' + enum + '\n' + '\n\n'.join(row['text'] for row in selected), encoding='utf-8')
executable = out / ('native-command-oracle.exe' if os.name == 'nt' else 'native-command-oracle')
subprocess.run([str(go), 'build', '-trimpath', '-o', str(executable), str(source_file)], env=environment, cwd=out, check=True, timeout=180)
receipt = {'commit': 'cb56d73badb322f3725257c2e8cfd157b2c3989d', 'compiler': version, 'sourcePins': PINS,
           'functions': [{k: v for k, v in row.items() if k != 'text'} for row in selected],
           'generatedSourceSha256': hashlib.sha256(source_file.read_bytes()).hexdigest(), 'executableSha256': hashlib.sha256(executable.read_bytes()).hexdigest(), 'executable': str(executable),
           'scope': 'Unmodified symbol parser, command matching and input counter/state/charge functions; fixture-provided button booleans/facing/config. Optional list and CMD compiler-statement-block modes are explicitly recorded. Excludes hardware/SOCD, byte decoding/file IO and full-engine compilation/scheduling.',
           'listMode': args.with_lists, 'loggingFacade': args.with_lists, 'fileMode': args.with_files,
           'compilerBlockSha256': hashlib.sha256(compiler_block.encode()).hexdigest() if compiler_block else None}
(out / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
print('PASS built private native command oracle with '+str(len(selected))+' unchanged declarations')
