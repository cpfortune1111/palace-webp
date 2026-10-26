"""Build private native Pause setter/timer/allowance probes, not a full scheduler."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
from reference_go_scan import declaration

cli = argparse.ArgumentParser(description=__doc__)
for name in ('char','system','common','go','output'):cli.add_argument('--'+name,type=Path,required=True)
args=cli.parse_args()
pins={'char':'7f8839374168cf5948d190268e6bdad73c61dac4febadb015cd501d46a579bf7','system':'b1784a92a937f5c940e7a99fc5025f807af497a23bc447c861c276bdbb51bf77','common':'d7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6'}
sources={}
for name,pin in pins.items():
    data=getattr(args,name).read_bytes();assert hashlib.sha256(data).hexdigest()==pin,name
    sources[name]=data.decode('utf-8')
selected=[]
for name,markers in {'char':['func (c *Char) setPauseTime(','func (c *Char) setSuperPauseTime(','func (c *Char) propagateIgnoreDarkenTime('],'common':['func Max[','func Btoi(']}.items():
    for marker in markers:
        row=declaration(sources[name],marker);selected.append({'source':name,'marker':marker,'line':row['line'],'text':row['text'],'sha256':hashlib.sha256(row['text'].encode()).hexdigest()})
def block(name,start,end,after=0):
    text=sources[name];a=text.index(start,after);b=text.index(end,a);return text[a:b]
timers=block('system','\t\t// Step pause timers','\n\t\t// In Mugen 1.1, few global')
prepare_start=sources['char'].index('func (c *Char) actionPrepare()')
prepare=block('char','\tc.pauseBool = false','\n\tif !c.pauseBool {',prepare_start)
move=block('char','\t\t\t// Step movetime','\n\t\t\t// Reset char width',prepare_start)
reset=block('system','\ts.pausetime, s.pausetimebuffer = 0, 0','\n\ts.envcol_time = 0',sources['system'].index('func (s *System) resetGblEffect()'))
out=args.output.resolve();out.mkdir(parents=True,exist_ok=True)
environment={**os.environ,'GOENV':'off','GOTOOLCHAIN':'local','GO111MODULE':'off','GOPROXY':'off','GOSUMDB':'off','CGO_ENABLED':'0','GOCACHE':str(out/'cache'),'GOPATH':str(out/'gopath')}
go=args.go.resolve();version=subprocess.check_output([str(go),'version'],env=environment,text=True).strip();assert version.startswith('go version go1.27.3 ')
wrapper='''package main
import("encoding/json";"os")
type Char struct{id int32;playerNo,teamside int;ss struct{sb struct{playerNo int}};pauseMovetime,superMovetime,prevPauseMovetime,prevSuperMovetime,unhittableTime,ignoreDarkenTime int32;superDefenseMulBuffer float32;ownpal bool;parentID int32;children []int32;cmd *int;pauseBool bool;acttmp int8}
type systemState struct{pausetime,pausetimebuffer,supertime,supertimebuffer,pauseendcmdbuftime,superendcmdbuftime int32;pauseplayerno,superplayerno int;pausebg,superpausebg bool;chars [][]*Char;ids map[int32]*Char}
func(s *systemState)playerID(id int32)*Char{return s.ids[id]}
func(c *Char)parent(bool)*Char{return sys.ids[c.parentID]}
var sys systemState
type actorInput struct{ID int32;Player,StatePlayer,Team int;OwnPal bool;Parent int32;Children []int32;Defence float32}
type operation struct{Kind string;Actor int32;Time,MoveTime,EndBuffer int32;Background,Unhittable,HitPause,NoCommands bool;Defence float32}
type request struct{Actors []actorInput;Operations []operation}
type actorResult struct{ID int32;PauseMove,SuperMove,PreviousPauseMove,PreviousSuperMove,Unhittable,IgnoreDarken int32;Defence float32;Paused bool;ActionTemporary int8}
type timerResult struct{Time,Buffer int32;Player int;EndBuffer int32;Background bool}
type snapshot struct{Normal,Super timerResult;Actors []actorResult}
func capture(order []*Char)snapshot{r:=snapshot{Normal:timerResult{sys.pausetime,sys.pausetimebuffer,sys.pauseplayerno,sys.pauseendcmdbuftime,sys.pausebg},Super:timerResult{sys.supertime,sys.supertimebuffer,sys.superplayerno,sys.superendcmdbuftime,sys.superpausebg}};for _,c:=range order{r.Actors=append(r.Actors,actorResult{c.id,c.pauseMovetime,c.superMovetime,c.prevPauseMovetime,c.prevSuperMovetime,c.unhittableTime,c.ignoreDarkenTime,c.superDefenseMulBuffer,c.pauseBool,c.acttmp})};return r}
func evaluate(v request)[]snapshot{sys=systemState{chars:make([][]*Char,2),ids:map[int32]*Char{}};order:=[]*Char{};for _,a:=range v.Actors{c:=&Char{id:a.ID,playerNo:a.Player,teamside:a.Team,ownpal:a.OwnPal,parentID:a.Parent,children:a.Children,superDefenseMulBuffer:a.Defence};c.ss.sb.playerNo=a.StatePlayer;sys.ids[c.id]=c;sys.chars[c.playerNo]=append(sys.chars[c.playerNo],c);order=append(order,c)};results:=[]snapshot{}
 for _,op:=range v.Operations{c:=sys.ids[op.Actor];switch op.Kind{
 case "pause":sys.pausebg=op.Background;sys.pauseendcmdbuftime=op.EndBuffer;c.setPauseTime(op.Time,op.MoveTime)
 case "super":sys.superpausebg=op.Background;sys.superendcmdbuftime=op.EndBuffer;c.setSuperPauseTime(op.Time,op.MoveTime,op.Unhittable,op.Defence)
 case "advance":s:=&sys
''' + timers + '''
 _=s
 case "prepare":if op.NoCommands{c.cmd=nil}else{c.cmd=new(int)}
''' + prepare + '''
 if !c.pauseBool&&!op.HitPause{
''' + move + '''
 }
 case "reset":s:=&sys
''' + reset + '''
 _=s
 default:panic("invalid fixture operation")};results=append(results,capture(order))};return results}
func main(){var input []request;if err:=json.NewDecoder(os.Stdin).Decode(&input);err!=nil{panic(err)};out:=make([][]snapshot,len(input));for i,v:=range input{out[i]=evaluate(v)};if err:=json.NewEncoder(os.Stdout).Encode(out);err!=nil{panic(err)}}
'''
code=out/'global-pause.go';code.write_text(wrapper+'\n'+'\n\n'.join(row['text']for row in selected),encoding='utf-8')
executable=out/('global-pause.exe'if os.name=='nt'else'global-pause')
subprocess.run([str(go),'build','-trimpath','-o',str(executable),str(code)],env=environment,cwd=out,check=True,timeout=180)
receipt={'commit':'cb56d73badb322f3725257c2e8cfd157b2c3989d','sourcePins':pins,'compiler':version,'declarations':[{k:v for k,v in row.items()if k!='text'}for row in selected],'blocks':{name:hashlib.sha256(text.encode()).hexdigest()for name,text in [('timers',timers),('prepare',prepare),('move',move),('reset',reset)]},'executable':str(executable),'executableSha256':hashlib.sha256(executable.read_bytes()).hexdigest(),'scope':'Unchanged Pause/SuperPause setters and darken-family propagation plus isolated native timer/prepare/movetime/reset blocks. Fixture actor hierarchy/ID/commands facades; does not execute full actionPrepare or scheduler phase order.'}
(out/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print('PASS built native global-pause component reference: five declarations and four phase blocks')
