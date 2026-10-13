import {createPalFxDefinition} from './palfx-controller.js';

export function createPalFxRuntime(definition=createPalFxDefinition(),{allowNegative=true}={}){
 return {definition,allowNegative,phase:[0,0,0,0],enabled:false,effective:null};
}

export function refreshPalFx(runtime){
 const definition=runtime.definition;
 runtime.enabled=definition.time!==0;if(!runtime.enabled)return;
 const wave=axis=>{const period=definition.cycleTime[axis];return period>1?Math.sin((2*Math.PI*runtime.phase[axis]+(period===2?Math.PI/2:0))/period):0};
 runtime.effective={add:definition.add.map((value,axis)=>(value+Math.trunc(wave(0)*definition.sinadd[axis]))|0),mul:definition.mul.map((value,axis)=>(value+Math.trunc(wave(1)*definition.sinmul[axis]))|0),color:Math.fround(definition.color+Math.fround(wave(2)*definition.sincolor/256)),hue:Math.fround(definition.hue+Math.fround(wave(3)*definition.sinhue/512)),invertall:definition.invertall,rawInvertall:definition.invertall,rawInvertblend:definition.invertblend,invertblend:definition.invertblend<=-2&&definition.invertall?3:definition.invertblend,allowNegative:runtime.allowNegative};
}

export function tickPalFx(runtime){
 if(!runtime.enabled)return;
 for(let axis=0;axis<4;axis++)if(runtime.definition.cycleTime[axis]>0)runtime.phase[axis]=(runtime.phase[axis]+1)%runtime.definition.cycleTime[axis];
 if(runtime.definition.time>0)runtime.definition.time--;
}

export function stepPalFx(runtime){refreshPalFx(runtime);tickPalFx(runtime)}

export function samplePalFx(runtime){
 if(runtime?.enabled)return runtime.effective;
 return {add:[0,0,0],mul:[256,256,256],color:1,hue:0,invertall:false,invertblend:0,allowNegative:false};
}