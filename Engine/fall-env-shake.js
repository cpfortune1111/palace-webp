import {controllerInteger} from './controller-value-conversion.js';
export function applyFallEnvShake(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='fallenvshake')return false;
 const params=controller.params||{},recipient=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!recipient)return true;
 const hit=api.getHit(recipient),time=Math.trunc(Number(hit['fall.envshake.time']??0))|0;
 if(time<=0)return true;
 const old=hit.shake||{},shake={};
 for(const [name,fallback] of [['freq',60],['phase',NaN],['ampl',-4],['mul',1],['dir',0],['diradd',0],['decay',0]])shake[name]=Math.fround(Number(hit['fall.envshake.'+name]??old[name]??fallback));
 if(Number.isNaN(shake.phase))shake.phase=shake.freq>=90?90:0;
 shake.ampl=Math.fround(shake.ampl*Math.fround(api.amplitudeScale(caller)));
 api.start({remaining:time,age:0,params:shake});
 hit['fall.envshake.time']=0;
 return true;
}
