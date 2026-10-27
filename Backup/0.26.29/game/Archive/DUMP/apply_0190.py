# 0.19.0 index patch
# Apply these exact replacements to repo 0.18.4 index.html.
# This script intentionally changes only runtime controller evaluation and visible build IDs.
from pathlib import Path
p=Path("index.html"); s=p.read_text()
s=s.replace("Prototype 0.18.4 Screen Edge Allowance","Prototype 0.19.0 CNS Runtime M1")
s=s.replace("Prototype 0.18.4 · Screen Edge Allowance","Prototype 0.19.0 · CNS Runtime M1")
s=s.replace("BUILD screen-edge-allowance-20260929-01","BUILD cns-runtime-m1-20260929-01")
s=s.replace("READY · screen edge allowance S4","READY · CNS runtime M1")
s=s.replace("venus_runtime_states.json?v=0184","venus_runtime_states_0190.json?v=0190")
s=s.replace("venus_runtime_atlas.png?v=0184","venus_runtime_atlas.png?v=0190")
s=s.replace("venus_runtime.json?v=0184","venus_runtime.json?v=0190")
old=s[s.index("function runController(c){"):s.index("function applyPhysics(def){")]
new=r"""function evalM1(expr){
 let e=String(expr).trim();
 const vals={'PrevStateNo':prevState,'StateNo':state,'AnimTime':animDone()?0:-1,'Anim':current,'Time':stateTicks,'AILevel':0,'Ctrl':runtimeCtrl,'Pos Y':posY,'Pos X':posX,'Vel Y':vy,'Vel X':vx};
 for(const [k,v] of Object.entries(vals).sort((a,b)=>b[0].length-a[0].length))e=e.replace(new RegExp('\\b'+k.replace(' ','\\s+')+'\\b','gi'),String(v));
 e=e.replace(/(?<![!<>=])=(?!=)/g,'==');
 if(!/^[0-9eE+\-*/%().<>=!&|\s]+$/.test(e))throw new Error('M1 unsupported expression: '+expr);
 return !!Function('"use strict";return ('+e+')')();
}
function triggered(c){
 if(!c.triggers)return null;
 if((c.triggerall||[]).some(x=>!evalM1(x)))return false;
 return Object.values(c.triggers).some(g=>g.every(evalM1));
}
function runController(c){
 const generic=triggered(c);
 if(generic===false)return;
 if(generic===null){
  if(c.trigger==='AnimDone'&&!animDone())return;
  if(c.trigger==='VelYPositive'&&!(vy>0))return;
  if(c.trigger==='PosYAtGround'&&!(posY>=0))return;
 }
 const p=c.params||c;
 switch(c.type){
  case 'WalkVelocity': vx=input.right?constVal('velocity.walk.fwd.x'):constVal('velocity.walk.back.x');posX+=vx;break;
  case 'JumpTakeoff': vx=jumpIntent==='forward'?constVal('velocity.jump.fwd.x'):(jumpIntent==='back'?constVal('velocity.jump.back.x'):constVal('velocity.jump.neu.x'));vy=constVal('velocity.jump.y');enterIRState(c.nextState);break;
  case 'VelSet': if(p.x!==undefined)vx=Number(p.x);if(p.y!==undefined)vy=Number(p.y);break;
  case 'PosSet': if(p.x!==undefined)posX=Number(p.x);if(p.y!==undefined)posY=Number(p.y);break;
  case 'CtrlSet': runtimeCtrl=Number(p.value);break;
  case 'VelSetThreshold': if(c.axis==='x'&&Math.abs(vx)<constVal(c.absBelowConst))vx=Number(c.value);break;
  case 'ChangeState': enterIRState(Number(p.value));if(p.ctrl!==undefined)runtimeCtrl=Number(p.ctrl);break;
  case 'Land': posY=0;vy=0;enterIRState(c.value);break;
 }
}
"""
s=s.replace(old,new)
p.write_text(s)
print("patched index.html -> 0.19.0")
