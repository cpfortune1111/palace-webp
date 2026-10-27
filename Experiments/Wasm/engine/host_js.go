//go:build js

package main

import (
 "encoding/json"
 "syscall/js"
 lua "github.com/yuin/gopher-lua"
)
type palaceHostSettings struct{Players []string `json:"players"`;Hardware []string `json:"hardware"`;Command []string `json:"command"`;ACS [][]int `json:"acs"`}
var palaceSettings palaceHostSettings
var palaceTotalHits [2]int32
func palaceRecordHit(c *Char,count int32){if c!=nil&&count>0{palaceTotalHits[c.playerNo&1]+=count}}
func palaceHostFrame(){
 if len(palaceSettings.Players)!=2{return};control:=js.Global().Get("__palaceControl");if control.Type()==js.TypeObject{sys.paused=control.Get("paused").Truthy()}
 if !sys.gameRunning{return}
 if sys.fightScreen.round!=nil&&sys.fightScreen.snd!=nil{number:=sys.roundNo;if number>3{number=3};if sound:=sys.fightScreen.snd.table[[2]int32{0,number}];sound!=nil&&sound.format.SampleRate>0{sys.fightScreen.round.callfight_time=int32((int64(sound.length)*60+int64(sound.format.SampleRate)-1)/int64(sound.format.SampleRate))+28}}
 fighters:=make([]map[string]interface{},0,2)
 for i:=0;i<2;i++{if len(sys.chars[i])==0{return};c:=sys.chars[i][0];if len(palaceSettings.Hardware)==2{mode:=int32(0);if palaceSettings.Hardware[i]=="saturn"{mode=2};c.varSet(50,mode)};if len(palaceSettings.Command)==2{value:=int32(0);if palaceSettings.Command[i]=="auto"{value=10};c.varSet(52,value)}
  if control.Type()==js.TypeObject{if control.Get("kill").Type()==js.TypeNumber&&control.Get("kill").Int()==i+1{c.life=0;control.Set("kill",0)};if control.Get("all1hp").Truthy(){c.life=1;if i==1{control.Set("all1hp",false)}}}
  fighters=append(fighters,map[string]interface{}{"life":c.life,"lifeMax":c.lifeMax,"state":c.ss.no,"stateTime":c.ss.time,"facing":c.facing,"x":c.pos[0],"y":c.pos[1],"hits":c.hitCount,"score":sys.scorePoints[i]})
 }
 if sys.frameCounter%4==0{data,_:=json.Marshal(map[string]interface{}{"fighters":fighters,"round":sys.roundNo,"ticks":sys.tickCount,"timer":sys.curRoundTime,"paused":sys.paused,"intro":sys.intro,"wins":sys.wins,"totalHits":palaceTotalHits,"roundState":sys.roundState(),"streaming":palaceStreamingStats()});js.Global().Call("__palaceEmit","snapshot",string(data))}
}
func palaceLifeScale(player int)float64{if len(palaceSettings.ACS)==2&&len(palaceSettings.ACS[player&1])==6{return 1+float64(palaceSettings.ACS[player&1][4])/12};return 1}
func palaceLua(l *lua.LState,value interface{})lua.LValue{
 switch v:=value.(type){case nil:return lua.LNil;case bool:return lua.LBool(v);case string:return lua.LString(v);case float64:return lua.LNumber(v);case []interface{}:t:=l.NewTable();for _,x:=range v{t.Append(palaceLua(l,x))};return t;case map[string]interface{}:t:=l.NewTable();for k,x:=range v{t.RawSetString(k,palaceLua(l,x))};return t};return lua.LNil
}
func registerPalaceHost(l *lua.LState){
 sys.cfg.Common.Lua=make(map[string][]string)
 json.Unmarshal([]byte(js.Global().Get("__palaceConfig").String()),&palaceSettings)
 luaRegister(l,"palaceConfig",func(l *lua.LState)int{var value interface{};if err:=json.Unmarshal([]byte(js.Global().Get("__palaceConfig").String()),&value);err!=nil{l.RaiseError("Invalid host configuration")};l.Push(palaceLua(l,value));return 1})
 luaRegister(l,"palaceEmit",func(l *lua.LState)int{js.Global().Call("__palaceEmit",strArg(l,1),strArg(l,2));return 0})
}
func palaceDamageMultiplier(attacker,defender *Char)float64{
 if attacker==nil||defender==nil{return 1}
 a,d:=attacker.playerNo&1,defender.playerNo&1;config:=palaceSettings
 if len(config.ACS)!=2||len(config.ACS[a])!=6||len(config.ACS[d])!=6{return 1}
 category,rate:=5,.07;state,attribute:=attacker.ss.no,defender.ghv.attr
 if state>=200&&state<1000{category,rate=5,.07}else if state>=3000&&state<4000||attribute&int32(AT_AH)!=0{category,rate=1,.1}else if state>=1000&&state<3000||attribute&int32(AT_AS)!=0{category,rate=0,.2}
 return (1+rate*float64(config.ACS[a][category]))*(1-.1*float64(config.ACS[d][2]))
}
