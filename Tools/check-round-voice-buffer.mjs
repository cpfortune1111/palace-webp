import assert from 'node:assert/strict';
import {createRoundFlow} from '../Engine/round-flow-runtime.js';
let ready=false;const sounds=[];
const api={config:{startWait:0,controlWait:0},rounds:{},setTimer:()=>{},reset:()=>{},initialize:()=>{},message:()=>{},lock:()=>{},fade:()=>{},stepPresentation:()=>{},introComplete:()=>true,voiceReady:()=>true,announcerReady:()=>ready,sound:value=>sounds.push(value),fight:()=>{}};
const flow=createRoundFlow(api);flow.begin('vs','99');while(flow.snapshot().phase!=='ready')flow.step();
for(let tick=0;tick<120;tick++)flow.step();assert.deepEqual(sounds,['0,1']);ready=true;flow.step();assert.equal(flow.snapshot().phase,'roundVoiceBuffer');
for(let tick=0;tick<29;tick++)flow.step();assert.deepEqual(sounds,['0,1']);flow.step();assert.deepEqual(sounds,['0,1','1,0']);
sounds.length=0;flow.begin('training','infinite');while(flow.snapshot().phase!=='fightBuffer')flow.step();assert.deepEqual(sounds,['1,0']);
console.log('Round voice: waits for voice completion plus 30 ticks; training still skips Round passed');

