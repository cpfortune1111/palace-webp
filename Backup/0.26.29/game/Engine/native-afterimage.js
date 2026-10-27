import {controllerInteger,controllerFloat32,controllerBoolean} from './controller-value-conversion.js';
import {compileTransParameters} from './trans-controller.js';

export function createNativeAfterImage({mugen11=false}={}){
 const base={add:[30,30,30],mul:[120,120,220],color:1,hue:0,invertall:false,rawInvertall:false,invertblend:mugen11?-2:0,rawInvertblend:mugen11?-2:0,allowNegative:true};
 return {native:true,time:0,length:20,timegap:1,framegap:4,postbright:[0,0,0],add:[10,10,25],mul:[Math.fround(.65),Math.fround(.65),Math.fround(.75)],transState:null,ignorehitpause:true,base,palettes:[base],imgs:[null],imgidx:0,restgap:0,reccount:0,timecount:0,priority:0,lastTick:null};
}
export function setupNativeAfterImage(state,{ikemen=false}={}){
 if(state.length<=0)return;
 const size=state.length+Number(ikemen);state.imgs.length=size;for(let index=0;index<size;index++)state.imgs[index]??=null;state.imgidx=Math.max(0,Math.min(size-1,state.imgidx));
 state.base.invertblend=state.base.rawInvertblend<=-2&&state.base.invertall?3:state.base.rawInvertblend;
 const count=Math.max(1,Math.trunc(state.length/state.framegap));state.palettes=[state.base];let post=[...state.postbright];
 for(let index=1;index<count;index++){const previous=state.palettes[index-1];state.palettes.push({...previous,add:previous.add.map((value,axis)=>(value+state.add[axis]+post[axis])|0),mul:previous.mul.map((value,axis)=>controllerInteger(Math.fround(Math.fround(value)*state.mul[axis])))});post=[0,0,0]}
 state.needsetup=false;
}
export function nativeAfterImageActive(state){
 return !!state&&state.time!==0&&!(state.time>0&&state.timecount>=((state.timegap*state.length+state.time-1)|0))&&state.timegap>=1&&state.timegap<=32767&&state.framegap>=1&&state.framegap<=32767;
}
export function recordNativeAfterImage(state,snapshot,{record=true,hitpause=false}={}){
 if(!record&&!(hitpause&&state.ignorehitpause))return;
 if(state.time===0){state.reccount=0;state.timegap=0;return}
 if(state.restgap<=0){state.imgs[state.imgidx]={...snapshot,matrix:[...snapshot.matrix],args:[...snapshot.args],clip:snapshot.clip?{...snapshot.clip}:null,priority:(controllerInteger(snapshot.priority)-2)|0,syncId:0};state.imgidx=(state.imgidx+1)%state.imgs.length;state.reccount=(state.reccount+1)|0;state.restgap=state.timegap}
 state.restgap=(state.restgap-1)|0;state.timecount=(state.timecount+1)|0;
}
export function nativeAfterImageDraws(state,currentPriority,{ikemen=false,maximum=Infinity}={}){
 // The caller checks isActive before recording, as native recAndCue does.
 const output=[];if(!state||!state.imgs.length||state.framegap<=0||state.timegap<=0)return output;
 const usable=Math.max(0,Math.min(ikemen?state.reccount-1:state.reccount,ikemen?state.length:state.length-1)),steps=Math.trunc(usable/state.framegap);
 for(let step=0;step<steps&&output.length<maximum;step++){
  const distance=(step+1)*state.framegap,index=((state.imgidx-distance-1+Number(!ikemen))%state.imgs.length+state.imgs.length)%state.imgs.length,image=state.imgs[index];if(!image)continue;
  if(image.priority>=currentPriority)image.priority=(currentPriority-2)|0;
  if(state.time<0||((Math.trunc(state.timecount/state.timegap)-distance)|0)<Math.trunc(((state.time-2)|0)/state.timegap)+1){if(!state.palettes[step])continue;output.push({...image,priority:(image.priority-step)|0,paletteEffect:state.palettes[step],transState:state.transState})}
 }
 return output;
}
export function copyNativeAfterImageSettings(destination,source){
 if(!source||source.time===0)return destination;
 destination??=createNativeAfterImage();
 for(const name of ['time','length','timegap','framegap','restgap','timecount','priority','ignorehitpause'])destination[name]=source[name];
 for(const name of ['postbright','add','mul'])destination[name]=[...source[name]];
 destination.transState=source.transState?{type:source.transState.type,alpha:[...source.transState.alpha]}:null;destination.base=source.base;destination.palettes[0]=source.palettes[0];return destination;
}
export const nativeAfterImageFields=['trans','alpha','time','length','timegap','framegap','palcolor','palhue','palinvertall','palinvertblend','palbright','palcontrast','palpostbright','paladd','palmul','ignorehitpause'];
export function nativeAfterImageParameterWrites(params,api){
 const writes=[],integer=expression=>controllerInteger(api.evaluate(expression));
 const compiled=compileTransParameters(params,{mugen:!api.ikemen,split:api.split});if(compiled)writes.push(state=>{state.transState={type:compiled.type,alpha:compiled.alpha.map(value=>Math.max(0,Math.min(255,integer(value))))}});
 for(const name of ['time','length','timegap','framegap'])if(params[name]!==undefined)writes.push(state=>{let value=integer(params[name]);if(name==='length'){if(value<0)api.warn('AfterImage length must be positive');if(value>60){api.warn('AfterImage length exceeds maximum 60');value=60}}if((name==='timegap'||name==='framegap')&&value<1){api.warn('invalid AfterImage '+name);return}state[name]=value});
 if(params.palcolor!==undefined)writes.push(state=>{state.base.color=Math.fround(Math.max(0,Math.min(256,integer(params.palcolor)))/256)});
 if(params.palhue!==undefined)writes.push(state=>{state.base.hue=Math.fround(Math.max(-256,Math.min(256,integer(params.palhue)))/512)});
 if(params.palinvertall!==undefined)writes.push(state=>{state.base.rawInvertall=state.base.invertall=controllerBoolean(api.evaluate(params.palinvertall))});
 if(params.palinvertblend!==undefined)writes.push(state=>{state.base.rawInvertblend=integer(params.palinvertblend)});
 for(const [name,base,field,floating] of [['palbright',true,'add',false],['palcontrast',true,'mul',false],['palpostbright',false,'postbright',false],['paladd',false,'add',false],['palmul',false,'mul',true]])if(params[name]!==undefined){const parts=api.split(params[name]);if(!parts.length||parts.length>3)throw Error('Invalid AfterImage '+name+' vector');writes.push(state=>{const destination=base?state.base:state;for(const [axis,expression] of parts.entries())destination[field][axis]=floating?controllerFloat32(api.evaluate(expression)):integer(expression)})}
 if(params.ignorehitpause!==undefined)writes.push(state=>{state.ignorehitpause=controllerBoolean(api.evaluate(params.ignorehitpause))});return writes;
}
export function deferredExplodAfterImageWrites(params,api){
 const fields={};for(const name of nativeAfterImageFields)if(params['afterimage.'+name]!==undefined)fields[name]=params['afterimage.'+name];
 return nativeAfterImageParameterWrites(fields,api).map(write=>effect=>{effect.nativeAfterImage??=createNativeAfterImage();write(effect.nativeAfterImage);effect.nativeAfterImage.needsetup=true});
}
export function finishExplodAfterImage(effect,{ikemen=false}={}){const state=effect.nativeAfterImage;if(state?.time!==0&&state?.needsetup)setupNativeAfterImage(state,{ikemen})}
export function applyNativeAfterImageController(controller,caller,api){
 const type=String(controller.type).toLowerCase();if(!['afterimage','afterimagetime'].includes(type))return false;
 const params=controller.params??{},allowed=type==='afterimagetime'?['redirectid','time','value','persistent','ignorehitpause']:['redirectid','trans','alpha','time','length','timegap','framegap','palcolor','palhue','palinvertall','palinvertblend','palbright','palcontrast','palpostbright','paladd','palmul','ignorehitpause','persistent'];
 for(const name of Object.keys(params))if(!allowed.includes(name))throw Error('Unsupported '+controller.type+' parameter: '+name);
 const integer=expression=>controllerInteger(api.evaluate(expression)),owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 if(type==='afterimagetime'){const state=api.get(owner);if(!state||state.timegap<=0)return true;const time=integer(params.time??params.value??0);state.time=time===1?0:time;state.timecount=0;return true}
 const state=createNativeAfterImage({mugen11:api.mugen11(caller)});state.time=1;api.set(owner,state);
 for(const write of nativeAfterImageParameterWrites(params,{...api,ikemen:api.ikemen(caller)}))write(state);
 setupNativeAfterImage(state,{ikemen:api.ikemen(owner)});return true;
}
