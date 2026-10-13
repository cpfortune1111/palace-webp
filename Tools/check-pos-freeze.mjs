import assert from 'node:assert/strict';
import {applyPosFreezeController,frozenPosition} from '../Engine/pos-freeze.js';
const owner={},api={evaluate:Number,findActor:id=>id===2?owner:null,set:(actor,value)=>{actor.frozen=value}};
applyPosFreezeController({type:'PosFreeze',params:{}},owner,api);assert.equal(owner.frozen,true);
applyPosFreezeController({type:'PosFreeze',params:{redirectid:2,value:0}},{},api);assert.equal(owner.frozen,false);
applyPosFreezeController({type:'PosFreeze',params:{value:-0.1}},owner,api);assert.equal(owner.frozen,true);
assert.deepEqual(frozenPosition([10,20,30],[40,50,60],{frozen:true,cornerPush:3,boundAxes:[false,true,false]}),[13,50,30]);
assert.deepEqual(frozenPosition([10,20],[40,50]),[40,50]);
console.log('PosFreeze default/redirection, bound-axis exemption and preserved cornerpush passed');