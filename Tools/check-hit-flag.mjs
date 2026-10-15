import assert from 'node:assert/strict';
import {hitFlagAllows,nativeGuardState} from '../Engine/hit-flag.js';

for(const [stateType,flag] of [['S','H'],['C','L'],['A','A'],['L','D']]){
 assert.equal(hitFlagAllows(flag,{stateType,hitState:0}),true);
 assert.equal(hitFlagAllows('',{stateType,hitState:0}),false);
}
assert.equal(hitFlagAllows('M',{stateType:'S',hitState:0}),true);
assert.equal(hitFlagAllows('M',{stateType:'C',hitState:0}),true);
assert.equal(hitFlagAllows('MAF',{stateType:'A',hitState:2}),true);
assert.equal(hitFlagAllows('MA',{stateType:'A',hitState:2}),false);
assert.equal(hitFlagAllows('MAF',{stateType:'A',hitState:2,noFallHitFlag:true}),false);
for(const hitState of [-1,0,1,2]){
 assert.equal(hitFlagAllows('MAF-',{stateType:'S',hitState}),hitState<=0);
 assert.equal(hitFlagAllows('MAF+',{stateType:'S',hitState}),hitState>0);
 assert.equal(hitFlagAllows('MAF+',{stateType:'S',hitState,inGuard:true}),false);
}
for(let state=119;state<=156;state++)assert.equal(nativeGuardState(state),[120,130,131,132,140,150,151,152,153,154,155].includes(state));
assert.throws(()=>hitFlagAllows('M',{stateType:'S'}),/hit-state/);
console.log('Native hitflag S/C/A/L, F, plus/minus, NoFallHitFlag and exact guard-state ranges pass; live phase parity remains pending');
