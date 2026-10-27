import assert from 'node:assert/strict';
import {createRoundFlow} from '../Engine/round-flow-runtime.js';

const life=[900,1000],alive=[true,false],api={config:{startWait:0,controlWait:0},rounds:{},setTimer:()=>{},reset:()=>{},initialize:()=>{},message:()=>{},lock:()=>{},fade:()=>{},stepPresentation:()=>{},introComplete:()=>true,voiceReady:()=>true,announcerReady:()=>true,sound:()=>{},fight:()=>{},life:()=>life,alive:()=>alive,remaining:()=>99,stopCombat:()=>{}};
const flow=createRoundFlow(api);flow.begin('vs','99');
for(let tick=0;flow.snapshot().phase!=='fight'&&tick<200;tick++)flow.step();
assert.equal(flow.snapshot().phase,'fight');flow.step();
assert.equal(flow.snapshot().reason,'ko');assert.equal(flow.snapshot().winner,1);assert.deepEqual(life,[900,1000]);
alive.fill(false);flow.begin('vs','99');for(let tick=0;flow.snapshot().phase!=='fight'&&tick<200;tick++)flow.step();flow.step();assert.equal(flow.snapshot().winner,0);
console.log('Round KO follows actor Alive flags independently of positive HP and supports double KO');
