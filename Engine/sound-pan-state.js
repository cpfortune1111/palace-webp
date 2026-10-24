import {controllerFloat32} from './controller-value-conversion.js';

export function createSoundPanState(){return {pan:0,sourceId:-1,sourceX:0,lastPan:0}}

export function setSoundPanState(state,{pan=0,sourceId=-1,localScale=1,facing=1}){
 state.sourceId=sourceId;
 state.pan=sourceId>=0?Math.fround(Math.fround(controllerFloat32(pan)*Math.fround(localScale))*Math.fround(facing)):controllerFloat32(pan);
 return state;
}

export function updateSoundPanState(state,{x=0,scale=1,width=320,strength=100,stereo=true},sourcePosition){
 let position=0;
 if(state.sourceId>=0){
  const source=sourcePosition(state.sourceId);if(source!==null&&source!==undefined)state.sourceX=Math.fround(source);
  if(width>0&&scale>0)position=Math.fround(Math.fround(Math.fround(Math.fround(Math.fround(state.pan+state.sourceX)-Math.fround(x))*Math.fround(scale))*2)/Math.fround(width));
 }else if(width>0)position=Math.fround(Math.fround(2*state.pan)/Math.fround(width));
 state.lastPan=stereo?Math.fround(Math.fround(position*Math.max(0,Math.min(100,Math.fround(strength))))/100):0;
 return state.lastPan;
}
