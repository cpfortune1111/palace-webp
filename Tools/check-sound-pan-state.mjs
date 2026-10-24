import assert from 'node:assert/strict';
import {createSoundPanState,setSoundPanState,updateSoundPanState} from '../Engine/sound-pan-state.js';

const state=createSoundPanState(),view={x:0,scale:1,width:320,strength:100,stereo:true};
setSoundPanState(state,{pan:40,sourceId:2,localScale:.5,facing:-1});assert.equal(state.pan,-20);
assert.equal(updateSoundPanState(state,view,()=>100),.5);assert.equal(updateSoundPanState(state,view,()=>null),.5);assert.equal(state.sourceX,100);
assert.equal(updateSoundPanState(state,{...view,x:80},()=>100),0);assert.equal(updateSoundPanState(state,{...view,scale:2},()=>100),1);
assert.equal(updateSoundPanState(state,{...view,strength:50},()=>100),.25);assert.equal(updateSoundPanState(state,{...view,stereo:false},()=>100),0);
setSoundPanState(state,{pan:80,sourceId:-1,localScale:.1,facing:-1});assert.equal(state.pan,80);assert.equal(updateSoundPanState(state,{...view,x:100,scale:3},()=>{throw Error('Absolute pan must not read source')}),.5);
assert.equal(updateSoundPanState(state,{...view,width:0},()=>null),0);assert.equal(updateSoundPanState(state,{...view,strength:-1},()=>null),0);
setSoundPanState(state,{pan:'80',sourceId:-1});assert.equal(state.pan,0);
setSoundPanState(state,{pan:320,sourceId:-1});assert.equal(updateSoundPanState(state,view,()=>null),2);
console.log('Independent sound pan state captures facing/local scale, tracks emitter/camera, retains removed source position and distinguishes absolute/stereo settings');
