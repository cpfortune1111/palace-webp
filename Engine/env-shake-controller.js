import {controllerFloat32} from './controller-value-conversion.js';

export function applyEnvShake(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='envshake')return false;
 api.start(null);
 const params=controller.params||{},shake={freq:60,phase:NaN,ampl:-4,mul:1,dir:0,diradd:0,decay:0};let time=0;
 for(const name of ['time','ampl','phase','freq','mul','dir','diradd','decay']){
  if(params[name]===undefined)continue;
  const raw=api.evaluate(params[name]);
  let value=name==='time'||name==='ampl'?(typeof raw==='string'?0:Math.trunc(Number(raw))|0):controllerFloat32(raw);
  if(name==='time'){time=value;continue}
  value=Math.fround(value);
  if(name==='ampl')value=Math.trunc(Math.fround(value*Math.fround(api.nativeLocalScale(caller))))|0;
  if(name==='freq')value=Math.max(0,value);
  if(name==='phase')value=Math.max(-180,Math.min(180,value));
  shake[name]=value;
 }
 if(Number.isNaN(shake.phase))shake.phase=shake.freq>=90?90:0;
 shake.ampl=Math.fround(shake.ampl*Math.fround(api.nativeToWorld(caller)));
 if(time>0)api.start({remaining:time,age:0,params:shake});
 return true;
}
