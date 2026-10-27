import {controllerFloat32,controllerBoolean} from './controller-value-conversion.js';
import {samplePalFx} from './palfx-runtime.js';
import {spriteWindowRect} from './sprite-window.js';

export function createReflectionOverride(){return {intensity:-1,color:[-1,-1,-1],xscale:0,yscale:0,offset:[0,0],window:[0,0,0,0],keeptransform:true,angle:0,xangle:0,yangle:0}}

export function reflectionWindowRect(window,stageWindow,{origin,scale,pixelRatio=1,yscale=1}){
 const selected=window?.some(value=>value!==0)?window:stageWindow;
 return spriteWindowRect(selected,{origin,scale:[scale,-scale*Math.sign(yscale)],pixelRatio});
}

export function resetReflectionOverride(state){Object.assign(state,createReflectionOverride())}

export function reflectionPaletteEffect(base,override,stage){
 const stageColor=stage.color??[255,255,255],packed=typeof stageColor==='number';
 const color=override.color[0]>=0?override.color:packed?[(stageColor>>>16)&255,(stageColor>>>8)&255,stageColor&255]:stageColor;
 if(color.every(value=>value===255))return base;
 const source=base??samplePalFx(null);
 return {...source,add:[...source.add],mul:source.mul.map((value,index)=>Math.trunc(Math.fround(Math.fround(value)*Math.fround(color[index]/255)))|0)};
}

export function reflectionAngleState(base,override,stage,facing){
 const direction=facing<0?-1:1,enabled=!!base?.enabled;
 const source={angle:enabled?Math.fround(base.value*direction):0,xangle:enabled?base.xangle:0,yangle:enabled?Math.fround(base.yangle*direction):0};
 const result={};
 for(const axis of ['angle','xangle','yangle']){
  const custom=override[axis],stageAngle=stage.rot?.[axis]??stage[axis]??0;
  result[axis]=override.keeptransform?Math.fround(source[axis]+(custom!==0?custom:stageAngle)):custom;
 }
 if(override.keeptransform)for(const axis of ['angle','yangle'])if(source[axis]<0)result[axis]=Math.fround(source[axis]-Math.fround(result[axis]-source[axis]));
 const value=Math.fround(result.angle*direction),xangle=result.xangle,yangle=Math.fround(result.yangle*direction);
 return {value,xangle,yangle,enabled:enabled||value!==0||xangle!==0||yangle!==0,scale:enabled?[...base.scale]:[1,1],pivot:enabled?[...base.pivot]:[0,0]};
}

export function applyModifyReflection(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyreflection')return false;
 const params=controller.params||{},integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 const target=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','color','intensity','offset','window','xscale','yscale','keeptransform','angle','xangle','yangle','ignorehitpause','persistent'].includes(name))throw Error('ModifyReflection '+name+' is not implemented');
 if(!['color','intensity','offset','window','xscale','yscale','keeptransform','angle','xangle','yangle'].some(name=>params[name]!==undefined))return true;
 const state=api.state(target);
 if(params.color!==undefined){
  const components=api.split(params.color);
  if(components.length>3)throw Error('ModifyReflection color expects at most three values');
  const color=[0,0,0];
  for(let channel=0;channel<components.length;channel++)color[channel]=Math.max(0,Math.min(255,integer(components[channel])));
  state.color=color;
 }
 if(params.intensity!==undefined)state.intensity=Math.max(0,Math.min(255,integer(params.intensity)));
 if(params.keeptransform!==undefined)state.keeptransform=controllerBoolean(api.evaluate(params.keeptransform));
 if(params.offset!==undefined){
  const components=api.split(params.offset);
  if(components.length>2)throw Error('ModifyReflection offset expects at most two values');
  const ratio=Math.fround(api.localScale(caller)/api.localScale(target));
  for(let axis=0;axis<components.length;axis++)state.offset[axis]=Math.fround(controllerFloat32(api.evaluate(components[axis]))*ratio);
 }
 if(params.window!==undefined){
  const components=api.split(params.window);
  if(components.length>4)throw Error('ModifyReflection window expects at most four values');
  if(components.length<4)api.warn?.('invalid ModifyReflection window');
  else{
   const ratio=Math.fround(api.localScale(caller)/api.localScale(target));
   for(let index=0;index<4;index++)state.window[index]=Math.fround(controllerFloat32(api.evaluate(components[index]))*ratio);
  }
 }
 for(const name of ['xscale','yscale'])if(params[name]!==undefined)state[name]=controllerFloat32(api.evaluate(params[name]));
 for(const name of ['angle','xangle','yangle'])if(params[name]!==undefined)state[name]=controllerFloat32(api.evaluate(params[name]));
 return true;
}
